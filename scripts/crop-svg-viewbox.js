#!/usr/bin/env node
/**
 * crop-svg-viewbox.js
 *
 * Cropped de viewBox van elke SVG naar de echte content-bounds.
 * Vectorizer.ai genereert SVGs met veel lege ruimte rond het figuur.
 * Dit script vindt de bounding box van alle paths en past de viewBox aan.
 *
 * Resultaat: als je een element op 50% canvas-hoogte zet, vult het figuur
 * ook echt 50% — geen onzichtbare whitespace meer.
 *
 * Usage:
 *   node scripts/crop-svg-viewbox.js
 *
 * Options:
 *   --dry-run    Toon wat er gebeurt zonder bestanden te wijzigen
 *   --padding N  Extra padding rond content in viewBox-eenheden (default: 10)
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const DRY_RUN = process.argv.includes('--dry-run');
const PADDING = (() => {
  const idx = process.argv.indexOf('--padding');
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : 10;
})();

/**
 * Parse alle coördinaten uit SVG path d-attributen en vind de bounding box.
 *
 * Dit is een vereenvoudigde parser die werkt voor vectorizer.ai output:
 * - Pakt alle M, L, Q, C commando-coördinaten
 * - Pakt ook ellipse cx/cy/rx/ry, circle cx/cy/r, rect x/y/width/height
 * - Negeert relatieve commando's (die zijn zeldzaam in vectorizer output)
 */
function findContentBounds(svgContent) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  function expandBounds(x, y) {
    if (isFinite(x) && isFinite(y)) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  // 1. Parse path d= attributes
  const dAttrs = svgContent.matchAll(/\bd="([^"]+)"/g);
  for (const [, d] of dAttrs) {
    // Match absolute commands with their coordinate pairs
    // M/L: moveto/lineto (x y)
    // Q: quadratic bezier (x1 y1 x y)
    // C: cubic bezier (x1 y1 x2 y2 x y)
    // A: arc (rx ry rotation large-arc sweep x y)
    const commands = d.matchAll(/([MLHVCSQTAZ])\s*([-\d.,\s]*)/gi);

    for (const [, cmd, coordStr] of commands) {
      const upper = cmd.toUpperCase();
      const nums = coordStr.match(/-?\d+\.?\d*/g);
      if (!nums) continue;
      const n = nums.map(Number);

      if (upper === 'M' || upper === 'L' || upper === 'T') {
        for (let i = 0; i + 1 < n.length; i += 2) expandBounds(n[i], n[i + 1]);
      } else if (upper === 'H') {
        for (const x of n) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
      } else if (upper === 'V') {
        for (const y of n) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
      } else if (upper === 'Q') {
        for (let i = 0; i + 3 < n.length; i += 4) {
          expandBounds(n[i], n[i + 1]);
          expandBounds(n[i + 2], n[i + 3]);
        }
      } else if (upper === 'C') {
        for (let i = 0; i + 5 < n.length; i += 6) {
          expandBounds(n[i], n[i + 1]);
          expandBounds(n[i + 2], n[i + 3]);
          expandBounds(n[i + 4], n[i + 5]);
        }
      } else if (upper === 'S') {
        for (let i = 0; i + 3 < n.length; i += 4) {
          expandBounds(n[i], n[i + 1]);
          expandBounds(n[i + 2], n[i + 3]);
        }
      } else if (upper === 'A') {
        // Arc: rx ry xrot large-arc sweep x y
        for (let i = 0; i + 6 < n.length; i += 7) {
          expandBounds(n[i + 5], n[i + 6]);
        }
      }
    }
  }

  // 2. Parse <ellipse>, <circle>, <rect> elements
  for (const [, cx, cy, rx, ry] of svgContent.matchAll(/<ellipse[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\brx="([\d.]+)"[^>]*\bry="([\d.]+)"/g)) {
    expandBounds(Number(cx) - Number(rx), Number(cy) - Number(ry));
    expandBounds(Number(cx) + Number(rx), Number(cy) + Number(ry));
  }
  for (const [, cx, cy, r] of svgContent.matchAll(/<circle[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\br="([\d.]+)"/g)) {
    expandBounds(Number(cx) - Number(r), Number(cy) - Number(r));
    expandBounds(Number(cx) + Number(r), Number(cy) + Number(r));
  }
  for (const [, x, y, w, h] of svgContent.matchAll(/<rect[^>]*\bx="([\d.]+)"[^>]*\by="([\d.]+)"[^>]*\bwidth="([\d.]+)"[^>]*\bheight="([\d.]+)"/g)) {
    expandBounds(Number(x), Number(y));
    expandBounds(Number(x) + Number(w), Number(y) + Number(h));
  }

  if (!isFinite(minX)) return null;

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * Parse bestaande viewBox
 */
function parseViewBox(svgContent) {
  const match = svgContent.match(/viewBox="([\d.\s-]+)"/);
  if (!match) return null;
  const parts = match[1].trim().split(/\s+/).map(Number);
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

/**
 * Process één SVG bestand
 */
function processSvg(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  const oldViewBox = parseViewBox(content);
  if (!oldViewBox) {
    console.log(`⏭️  ${relativePath} — no viewBox found`);
    return { changed: false };
  }

  const bounds = findContentBounds(content);
  if (!bounds) {
    console.log(`⏭️  ${relativePath} — no content found`);
    return { changed: false };
  }

  // Nieuwe viewBox met padding
  const newVB = {
    x: Math.max(0, bounds.minX - PADDING),
    y: Math.max(0, bounds.minY - PADDING),
    width: bounds.width + PADDING * 2,
    height: bounds.height + PADDING * 2,
  };

  // Check of crop significant is (>5% verschil)
  const oldArea = oldViewBox.width * oldViewBox.height;
  const newArea = newVB.width * newVB.height;
  const reduction = ((oldArea - newArea) / oldArea * 100).toFixed(0);

  if (newArea >= oldArea * 0.95) {
    console.log(`⏭️  ${relativePath} — content fills viewBox (${reduction}% reducible)`);
    return { changed: false };
  }

  const newViewBoxStr = `${newVB.x.toFixed(2)} ${newVB.y.toFixed(2)} ${newVB.width.toFixed(2)} ${newVB.height.toFixed(2)}`;
  const oldViewBoxStr = `${oldViewBox.x} ${oldViewBox.y} ${oldViewBox.width} ${oldViewBox.height}`;

  console.log(`✅ ${relativePath}`);
  console.log(`   Old viewBox: ${oldViewBoxStr}`);
  console.log(`   Content:     X ${bounds.minX.toFixed(0)}-${bounds.maxX.toFixed(0)}, Y ${bounds.minY.toFixed(0)}-${bounds.maxY.toFixed(0)}`);
  console.log(`   New viewBox: ${newViewBoxStr}`);
  console.log(`   Reduction:   ${reduction}% empty space removed`);
  console.log(`   Aspect:      ${(newVB.width / newVB.height).toFixed(2)}:1`);

  if (!DRY_RUN) {
    const updated = content.replace(/viewBox="[\d.\s-]+"/, `viewBox="${newViewBoxStr}"`);
    fs.writeFileSync(filePath, updated, 'utf8');
  }

  return { changed: true };
}

/**
 * Vind alle .svg bestanden recursief
 */
function findSvgFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findSvgFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.svg')) results.push(fullPath);
  }
  return results;
}

function main() {
  console.log('✂️  SVG ViewBox Cropper\n');
  console.log(`Scanning: ${ASSETS_DIR}`);
  console.log(`Padding:  ${PADDING}px`);
  console.log(`Mode:     ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const svgFiles = findSvgFiles(ASSETS_DIR);
  if (svgFiles.length === 0) {
    console.log('No .svg files found.');
    return;
  }

  console.log(`Found ${svgFiles.length} SVG file(s)\n`);

  let changedCount = 0;
  for (const file of svgFiles) {
    const result = processSvg(file);
    if (result.changed) changedCount++;
    console.log('');
  }

  console.log('─'.repeat(60));
  console.log(`\n✨ Done!`);
  console.log(`   Cropped: ${changedCount}`);
  console.log(`   Unchanged: ${svgFiles.length - changedCount}`);

  if (DRY_RUN) {
    console.log(`\n💡 Run without --dry-run to apply changes`);
  }
}

main();
