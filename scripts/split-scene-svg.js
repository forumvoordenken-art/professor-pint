#!/usr/bin/env node
/**
 * split-scene-svg.js
 *
 * Splitst een volledige scene-SVG (uit vectorizer.ai) in aparte lagen
 * op basis van ruimtelijke regio's. Elke output-SVG behoudt de ORIGINELE
 * viewBox, zodat alle lagen perfect gestapeld kunnen worden:
 *
 *   <Img src="scene/sky.svg"      style={{ position: 'absolute', inset: 0 }} />
 *   <Img src="scene/pub.svg"      style={{ position: 'absolute', inset: 0 }} />
 *   <Img src="scene/sidewalk.svg" style={{ position: 'absolute', inset: 0 }} />
 *
 * Geen handmatige positionering nodig — alles lijnt uit via de viewBox.
 *
 * Usage:
 *   node scripts/split-scene-svg.js <input.svg> --config <regions.json>
 *   node scripts/split-scene-svg.js <input.svg> --config <regions.json> --output-dir <dir>
 *   node scripts/split-scene-svg.js <input.svg> --config <regions.json> --dry-run
 *   node scripts/split-scene-svg.js <input.svg> --analyze   (show path bounding boxes)
 *
 * Region config format (regions.json):
 *   {
 *     "layers": [
 *       { "id": "sky",      "y": [0, 0.55] },
 *       { "id": "pub",      "x": [0.2, 0.8], "y": [0.1, 0.75], "priority": 1 },
 *       { "id": "sidewalk", "y": [0.72, 0.88] },
 *       { "id": "street",   "y": [0.85, 1.0] }
 *     ]
 *   }
 *
 * - x/y ranges are fractions (0-1) of the viewBox dimensions
 * - Omit x to span full width; omit y to span full height
 * - "priority" (lower = checked first) resolves overlaps — higher priority
 *   regions claim paths before lower priority ones
 * - Paths that don't match any region go in "uncategorized.svg"
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const inputFile = args.find(a => !a.startsWith('--'));

if (!inputFile) {
  console.error('Usage: node split-scene-svg.js <input.svg> --config <regions.json> [--output-dir <dir>] [--dry-run] [--analyze]');
  process.exit(1);
}

const DRY_RUN = args.includes('--dry-run');
const ANALYZE = args.includes('--analyze');

const configIdx = args.indexOf('--config');
const configFile = configIdx !== -1 ? args[configIdx + 1] : null;

const outIdx = args.indexOf('--output-dir');
const OUTPUT_DIR = outIdx !== -1
  ? args[outIdx + 1]
  : path.join(path.dirname(inputFile), path.basename(inputFile, '.svg') + '-layers');

// ---------------------------------------------------------------------------
// Bounding box parser (from crop-svg-viewbox.js, adapted for single elements)
// ---------------------------------------------------------------------------

function parseBoundsFromD(d) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  function expand(x, y) {
    if (isFinite(x) && isFinite(y)) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  const commands = d.matchAll(/([MLHVCSQTAZ])\s*([-\d.,\s]*)/gi);
  for (const [, cmd, coordStr] of commands) {
    const upper = cmd.toUpperCase();
    const nums = coordStr.match(/-?\d+\.?\d*/g);
    if (!nums) continue;
    const n = nums.map(Number);

    if (upper === 'M' || upper === 'L' || upper === 'T') {
      for (let i = 0; i + 1 < n.length; i += 2) expand(n[i], n[i + 1]);
    } else if (upper === 'H') {
      for (const x of n) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
    } else if (upper === 'V') {
      for (const y of n) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    } else if (upper === 'Q') {
      for (let i = 0; i + 3 < n.length; i += 4) {
        expand(n[i], n[i + 1]);
        expand(n[i + 2], n[i + 3]);
      }
    } else if (upper === 'C') {
      for (let i = 0; i + 5 < n.length; i += 6) {
        expand(n[i], n[i + 1]);
        expand(n[i + 2], n[i + 3]);
        expand(n[i + 4], n[i + 5]);
      }
    } else if (upper === 'S') {
      for (let i = 0; i + 3 < n.length; i += 4) {
        expand(n[i], n[i + 1]);
        expand(n[i + 2], n[i + 3]);
      }
    } else if (upper === 'A') {
      for (let i = 0; i + 6 < n.length; i += 7) {
        expand(n[i + 5], n[i + 6]);
      }
    }
  }

  if (!isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

/**
 * Compute bounds of an SVG element string (path, ellipse, circle, rect, or group).
 */
function computeElementBounds(elementStr) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  function merge(b) {
    if (!b) return;
    minX = Math.min(minX, b.minX);
    minY = Math.min(minY, b.minY);
    maxX = Math.max(maxX, b.maxX);
    maxY = Math.max(maxY, b.maxY);
  }

  // All d= attributes in this element
  for (const [, d] of elementStr.matchAll(/\bd="([^"]+)"/g)) {
    merge(parseBoundsFromD(d));
  }

  // Ellipses with transform (vectorizer.ai format)
  for (const [, cx, cy] of elementStr.matchAll(/<ellipse[^>]*transform="translate\(([\d.-]+),([\d.-]+)\)[^"]*"/g)) {
    const x = Number(cx), y = Number(cy);
    // Approximate — use center point (rx/ry are rotated, hard to parse exactly)
    merge({ minX: x - 50, minY: y - 50, maxX: x + 50, maxY: y + 50 });
  }

  // Standard ellipses (cx, cy, rx, ry)
  for (const [, cx, cy, rx, ry] of elementStr.matchAll(/<ellipse[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\brx="([\d.]+)"[^>]*\bry="([\d.]+)"/g)) {
    merge({
      minX: Number(cx) - Number(rx), minY: Number(cy) - Number(ry),
      maxX: Number(cx) + Number(rx), maxY: Number(cy) + Number(ry),
    });
  }

  // Circles
  for (const [, cx, cy, r] of elementStr.matchAll(/<circle[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\br="([\d.]+)"/g)) {
    merge({
      minX: Number(cx) - Number(r), minY: Number(cy) - Number(r),
      maxX: Number(cx) + Number(r), maxY: Number(cy) + Number(r),
    });
  }

  // Rects
  for (const [, x, y, w, h] of elementStr.matchAll(/<rect[^>]*\bx="([\d.]+)"[^>]*\by="([\d.]+)"[^>]*\bwidth="([\d.]+)"[^>]*\bheight="([\d.]+)"/g)) {
    merge({
      minX: Number(x), minY: Number(y),
      maxX: Number(x) + Number(w), maxY: Number(y) + Number(h),
    });
  }

  if (!isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

// ---------------------------------------------------------------------------
// Depth-tracked </g> finder
// ---------------------------------------------------------------------------

/**
 * Starting right after the opening tag's '>', find the matching </g> index.
 * Returns the index of the character AFTER '</g>' (i.e. endIdx for substring).
 * Returns -1 if not found.
 */
function findMatchingCloseG(content, startAfterOpenTag) {
  let depth = 1;
  let i = startAfterOpenTag;

  while (depth > 0 && i < content.length) {
    const nextOpen = content.indexOf('<g', i);
    const nextClose = content.indexOf('</g>', i);

    if (nextClose === -1) return -1; // malformed SVG

    if (nextOpen !== -1 && nextOpen < nextClose) {
      const charAfterG = content[nextOpen + 2];
      if (charAfterG === ' ' || charAfterG === '>' || charAfterG === '\n' || charAfterG === '\r' || charAfterG === '\t') {
        depth++;
      }
      i = nextOpen + 2;
    } else {
      depth--;
      if (depth === 0) {
        return nextClose + 4; // '</g>'.length
      }
      i = nextClose + 4;
    }
  }

  return -1;
}

// ---------------------------------------------------------------------------
// SVG element extraction
// ---------------------------------------------------------------------------

/**
 * Extract top-level SVG elements in DOCUMENT ORDER.
 * Returns array of { type, content, bounds, docOrder, strokeGroupAttrs? }.
 *
 * CRITICAL: Elements must preserve their original document order because
 * vectorizer.ai interleaves stroke groups and fill elements:
 *   STROKE-GROUP-1 → fills → STROKE-GROUP-2 → fills → STROKE-GROUP-3 → fills
 * This interleaving creates the correct z-layering. If we put all strokes
 * first and all fills after, dark fills cover lighter stroke details → black.
 *
 * This function does a single pass through the SVG content, extracting
 * elements in the order they appear, with a sequential docOrder counter.
 */
function extractElements(svgContent) {
  const elements = [];
  let docOrder = 0;

  // Strip XML/DOCTYPE headers and SVG wrapper to get inner content
  let content = svgContent;
  content = content.replace(/<\?xml[^>]*\?>/, '');
  content = content.replace(/<!DOCTYPE[^>]*>/, '');

  const svgOpenMatch = content.match(/<svg[^>]*>/);
  if (!svgOpenMatch) return elements;
  const svgOpenEnd = content.indexOf('>', content.indexOf('<svg')) + 1;
  const svgCloseIdx = content.lastIndexOf('</svg>');
  content = content.substring(svgOpenEnd, svgCloseIdx);

  let strokeGroupCount = 0;

  // Single pass: walk through content finding top-level elements
  let pos = 0;
  while (pos < content.length) {
    const nextTag = content.indexOf('<', pos);
    if (nextTag === -1) break;

    // Skip comments
    if (content.substring(nextTag, nextTag + 4) === '<!--') {
      const commentEnd = content.indexOf('-->', nextTag);
      pos = commentEnd === -1 ? content.length : commentEnd + 3;
      continue;
    }

    // Skip closing tags and whitespace
    if (content[nextTag + 1] === '/' || content[nextTag + 1] === '!') {
      pos = content.indexOf('>', nextTag) + 1;
      continue;
    }

    // Get tag name
    const tagNameMatch = content.substring(nextTag).match(/^<(\w+)/);
    if (!tagNameMatch) { pos = nextTag + 1; continue; }
    const tagName = tagNameMatch[1];

    if (tagName === 'g') {
      const openTagEnd = content.indexOf('>', nextTag);
      if (openTagEnd === -1) { pos = nextTag + 1; continue; }
      const openTag = content.substring(nextTag, openTagEnd + 1);

      // Find matching </g> with depth tracking
      const endIdx = findMatchingCloseG(content, openTagEnd + 1);
      if (endIdx === -1) { pos = content.length; break; }

      const fullGroup = content.substring(nextTag, endIdx);
      const innerContent = content.substring(openTagEnd + 1, endIdx - 4); // before </g>

      if (/stroke-width=/.test(openTag) && /fill="none"/.test(openTag)) {
        // ── Stroke group: extract individual paths ──
        strokeGroupCount++;
        const attrsMatch = openTag.match(/<g\s+(.*?)>/s);
        const strokeAttrs = attrsMatch ? attrsMatch[1] : 'stroke-width="2.00" fill="none"';

        for (const pm of innerContent.matchAll(/<path\s[^>]*\/>/g)) {
          const bounds = computeElementBounds(pm[0]);
          if (bounds) {
            elements.push({
              type: 'stroke-path',
              content: pm[0],
              bounds,
              strokeGroupAttrs: strokeAttrs,
              docOrder,
            });
          }
        }
        docOrder++;
      } else if (/fill="(?!none)/.test(openTag)) {
        // ── Fill group: keep as whole (children inherit fill from parent) ──
        const bounds = computeElementBounds(fullGroup);
        if (bounds) {
          elements.push({ type: 'fill-group', content: fullGroup, bounds, docOrder: docOrder++ });
        }
      } else {
        // ── Other group (transform, opacity, etc.): keep as whole ──
        const bounds = computeElementBounds(fullGroup);
        if (bounds) {
          elements.push({ type: 'other-group', content: fullGroup, bounds, docOrder: docOrder++ });
        }
      }

      pos = endIdx;
    } else if (tagName === 'path') {
      // Self-closing <path .../> or <path ...>...</path>
      const selfClose = content.indexOf('/>', nextTag);
      const pathClose = content.indexOf('</path>', nextTag);
      let endIdx;

      if (selfClose !== -1 && (pathClose === -1 || selfClose < pathClose)) {
        endIdx = selfClose + 2;
      } else if (pathClose !== -1) {
        endIdx = pathClose + 7;
      } else {
        pos = nextTag + 1; continue;
      }

      const pathStr = content.substring(nextTag, endIdx);
      const bounds = computeElementBounds(pathStr);
      if (bounds) {
        elements.push({ type: 'fill-path', content: pathStr, bounds, docOrder: docOrder++ });
      }
      pos = endIdx;
    } else if (tagName === 'ellipse' || tagName === 'circle' || tagName === 'rect') {
      const endIdx = content.indexOf('/>', nextTag);
      if (endIdx === -1) { pos = nextTag + 1; continue; }
      const elStr = content.substring(nextTag, endIdx + 2);
      const bounds = computeElementBounds(elStr);
      if (bounds) {
        elements.push({ type: tagName, content: elStr, bounds, docOrder: docOrder++ });
      }
      pos = endIdx + 2;
    } else {
      // Skip unknown tags
      pos = nextTag + 1;
    }
  }

  if (strokeGroupCount > 0) {
    console.log(`  Found ${strokeGroupCount} stroke group(s)`);
  }

  return elements;
}

// ---------------------------------------------------------------------------
// Region matching
// ---------------------------------------------------------------------------

function assignToRegion(bounds, regions, viewBox) {
  const elWidth = bounds.maxX - bounds.minX;

  // Background detection: elements wider than 60% of the viewBox are scene
  // backgrounds (sky fill, ground color, dark overlays). These get placed in
  // a dedicated "base" layer so every region-specific layer can paint on top.
  if (elWidth > viewBox.width * 0.6) {
    return 'base';
  }

  // Normalize centroid to 0-1 range
  const nx = (bounds.cx - viewBox.x) / viewBox.width;
  const ny = (bounds.cy - viewBox.y) / viewBox.height;

  // Sort regions by priority (lower = first)
  const sorted = [...regions].sort((a, b) => (a.priority || 99) - (b.priority || 99));

  for (const region of sorted) {
    const xRange = region.x || [0, 1];
    const yRange = region.y || [0, 1];

    if (nx >= xRange[0] && nx <= xRange[1] && ny >= yRange[0] && ny <= yRange[1]) {
      return region.id;
    }
  }

  return 'uncategorized';
}

// ---------------------------------------------------------------------------
// SVG output builder
// ---------------------------------------------------------------------------

/**
 * Build a layer SVG preserving ORIGINAL DOCUMENT ORDER.
 *
 * Elements are sorted by docOrder. Consecutive stroke-paths with the same
 * docOrder (= from the same original stroke group) are wrapped in a single
 * <g stroke-width="..." fill="none"> group. Fill elements are emitted as-is.
 *
 * This preserves the interleaved stroke→fill→stroke→fill layering that
 * vectorizer.ai uses for correct visual z-ordering.
 */
function buildLayerSvg(viewBoxStr, elements) {
  // Sort by original document order
  const sorted = [...elements].sort((a, b) => a.docOrder - b.docOrder);

  const lines = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>`);
  lines.push(`<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`);
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="${viewBoxStr}" preserveAspectRatio="none">`);
  lines.push('');

  let i = 0;
  while (i < sorted.length) {
    if (sorted[i].type === 'stroke-path') {
      // Group consecutive stroke paths with the same docOrder into one <g>
      const attrs = sorted[i].strokeGroupAttrs || 'stroke-width="2.00" fill="none" stroke-linecap="butt"';
      const currentOrder = sorted[i].docOrder;
      lines.push(`<g ${attrs}>`);
      while (i < sorted.length && sorted[i].type === 'stroke-path' && sorted[i].docOrder === currentOrder) {
        lines.push(sorted[i].content);
        i++;
      }
      lines.push('</g>');
      lines.push('');
    } else {
      lines.push(sorted[i].content);
      i++;
    }
  }

  lines.push('');
  lines.push('</svg>');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// ViewBox parser
// ---------------------------------------------------------------------------

function parseViewBox(svgContent) {
  const match = svgContent.match(/viewBox="([\d.\s-]+)"/);
  if (!match) return null;
  const parts = match[1].trim().split(/\s+/).map(Number);
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('🔪 SVG Scene Splitter\n');

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const svgContent = fs.readFileSync(inputFile, 'utf8');
  const viewBox = parseViewBox(svgContent);
  if (!viewBox) {
    console.error('❌ No viewBox found in SVG');
    process.exit(1);
  }

  console.log(`Input:   ${inputFile}`);
  console.log(`ViewBox: ${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  console.log('');

  // Extract all elements
  const elements = extractElements(svgContent);
  console.log(`Found ${elements.length} elements\n`);

  // Analyze mode: show bounding boxes and exit
  if (ANALYZE) {
    console.log('Element analysis (centroid as fraction of viewBox):');
    console.log('─'.repeat(70));

    for (const el of elements) {
      const nx = ((el.bounds.cx - viewBox.x) / viewBox.width).toFixed(3);
      const ny = ((el.bounds.cy - viewBox.y) / viewBox.height).toFixed(3);
      const w = (el.bounds.maxX - el.bounds.minX).toFixed(0);
      const h = (el.bounds.maxY - el.bounds.minY).toFixed(0);

      // Show fill/stroke color for identification
      const fillMatch = el.content.match(/fill="(#[^"]+)"/);
      const strokeMatch = el.content.match(/stroke="(#[^"]+)"/);
      const color = fillMatch ? fillMatch[1] : strokeMatch ? strokeMatch[1] : '???';

      console.log(`  ${el.type.padEnd(12)} cx=${nx} cy=${ny}  size=${w}×${h}  color=${color}`);
    }

    console.log('\n─'.repeat(70));
    console.log('\nUse these centroid positions to define regions in your config file.');
    console.log('Example regions.json:');
    console.log(JSON.stringify({
      layers: [
        { id: 'sky', y: [0, 0.5] },
        { id: 'building', x: [0.2, 0.8], y: [0.1, 0.75], priority: 1 },
        { id: 'ground', y: [0.7, 1.0] },
      ]
    }, null, 2));
    return;
  }

  // Load region config
  if (!configFile) {
    console.error('❌ No config file specified. Use --config <regions.json> or --analyze to explore first.');
    process.exit(1);
  }

  if (!fs.existsSync(configFile)) {
    console.error(`❌ Config file not found: ${configFile}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const regions = config.layers;

  console.log(`Regions: ${regions.map(r => r.id).join(', ')}`);
  console.log('');

  // Assign elements to regions
  const buckets = {};
  buckets['base'] = []; // auto-generated: wide background elements
  for (const region of regions) {
    buckets[region.id] = [];
  }
  buckets['uncategorized'] = [];

  for (const el of elements) {
    const regionId = assignToRegion(el.bounds, regions, viewBox);
    buckets[regionId].push(el);
  }

  // Report
  const viewBoxStr = `${viewBox.x.toFixed(2)} ${viewBox.y.toFixed(2)} ${viewBox.width.toFixed(2)} ${viewBox.height.toFixed(2)}`;

  for (const [id, els] of Object.entries(buckets)) {
    if (els.length === 0) {
      console.log(`  ⏭️  ${id}: 0 elements (skipped)`);
      continue;
    }

    const strokes = els.filter(e => e.type === 'stroke-path').length;
    const fills = els.length - strokes;
    console.log(`  ✅ ${id}: ${els.length} elements (${fills} fill, ${strokes} stroke)`);

    if (!DRY_RUN) {
      // Create output directory
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }

      const outPath = path.join(OUTPUT_DIR, `${id}.svg`);
      const svg = buildLayerSvg(viewBoxStr, els);
      fs.writeFileSync(outPath, svg, 'utf8');
      console.log(`     → ${outPath}`);
    }
  }

  console.log('\n─'.repeat(60));
  console.log('\n✨ Done!');

  if (DRY_RUN) {
    console.log('💡 Run without --dry-run to write files.');
  } else {
    console.log(`\nOutput: ${OUTPUT_DIR}/`);
    console.log('\nAlle lagen hebben dezelfde viewBox — stapel ze met:');
    console.log('  <Img src={staticFile("layer.svg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />');
  }
}

main();
