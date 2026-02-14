#!/usr/bin/env node
/**
 * clean-svg-backgrounds.js
 *
 * Verwijdert automatisch witte achtergrond-paths uit SVGs.
 * Vectorizer.ai traced altijd de witte achtergrond mee als eerste <path>.
 * Dit script scant alle .svg bestanden in public/assets/ en verwijdert die paths.
 *
 * Usage:
 *   node scripts/clean-svg-backgrounds.js
 *
 * Options:
 *   --dry-run    Toon wat er gebeurt zonder bestanden te wijzigen
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Check of een kleur bijna-wit is.
 * Parst de hex-kleur en checkt of R, G en B elk >= 248 (0xF8) zijn.
 * Dat vangt #ffffff, #fefefe, #fcfdfe, #fafafa, enz.
 */
function isWhite(color) {
  if (!color) return false;
  const hex = color.toLowerCase().trim();
  if (hex === 'white') return true;

  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
  if (!m) return false;

  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return r >= 248 && g >= 248 && b >= 248;
}

/**
 * Verwijder witte achtergrond-elementen uit SVG string.
 *
 * Detecteert:
 *  - <path fill="white-ish" ...>...</path>  en  <path fill="white-ish" ... />
 *  - <rect fill="white-ish" ...>...</rect>  en  <rect fill="white-ish" ... />
 *  - <g fill="white-ish">...</g>  (hele groep)
 *
 * Verwijdert alleen het EERSTE witte element dat het tegenkomt.
 * Run het script meerdere keren als er meerdere zijn.
 *
 * Returns { cleaned: string, removed: boolean, color: string|null }
 */
function removeWhiteBackground(svgContent) {
  // 1. Check for <g fill="white"> ... </g> (greedy: outermost closing tag)
  const gRegex = /<g\s+fill="([^"]+)"\s*>[\s\S]*?<\/g>/;
  const gMatch = svgContent.match(gRegex);
  if (gMatch && isWhite(gMatch[1])) {
    const cleaned = svgContent.replace(gMatch[0], '');
    return { cleaned, removed: true, color: gMatch[1] };
  }

  // 2. Check for <rect fill="white"> (self-closing or with closing tag)
  const rectRegex = /<rect\s+[^>]*fill="([^"]+)"[^>]*\/?>(?:<\/rect>)?/;
  const rectMatch = svgContent.match(rectRegex);
  if (rectMatch && isWhite(rectMatch[1])) {
    const cleaned = svgContent.replace(rectMatch[0], '');
    return { cleaned, removed: true, color: rectMatch[1] };
  }

  // 3. Check for <path fill="white"> (original logic)
  const pathRegex = /<path\s+fill="([^"]+)"[^>]*>[\s\S]*?<\/path>|<path\s+fill="([^"]+)"[^>]*\/>/;
  const match = svgContent.match(pathRegex);

  if (!match) {
    return { cleaned: svgContent, removed: false, color: null };
  }

  const fillColor = match[1] || match[2];

  if (!isWhite(fillColor)) {
    return { cleaned: svgContent, removed: false, color: fillColor };
  }

  const cleaned = svgContent.replace(pathRegex, '');
  return { cleaned, removed: true, color: fillColor };
}

/**
 * Vind alle .svg bestanden recursief
 */
function findSvgFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(findSvgFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Process één SVG bestand — herhaalt tot er geen witte elementen meer zijn
 */
function processSvg(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(ASSETS_DIR, filePath);

  let removedAny = false;

  // Loop: verwijder witte elementen tot er geen meer zijn
  while (true) {
    const result = removeWhiteBackground(content);
    if (!result.removed) break;

    removedAny = true;
    content = result.cleaned;
    console.log(`✅ ${relativePath}`);
    console.log(`   Removed white background: ${result.color}`);
  }

  if (removedAny) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   Written cleaned SVG`);
    }
    return { processed: true, changed: true };
  } else {
    console.log(`⏭️  ${relativePath}`);
    console.log(`   No white backgrounds found`);
    return { processed: true, changed: false };
  }
}

/**
 * Main
 */
function main() {
  console.log('🎨 SVG Background Cleaner\n');
  console.log(`Scanning: ${ASSETS_DIR}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE (will modify files)'}\n`);

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const svgFiles = findSvgFiles(ASSETS_DIR);

  if (svgFiles.length === 0) {
    console.log('No .svg files found.');
    process.exit(0);
  }

  console.log(`Found ${svgFiles.length} SVG file(s)\n`);
  console.log('Processing...\n');

  let changedCount = 0;

  for (const file of svgFiles) {
    const result = processSvg(file);
    if (result.changed) changedCount++;
    console.log('');
  }

  console.log('─'.repeat(60));
  console.log(`\n✨ Done!`);
  console.log(`   Total files: ${svgFiles.length}`);
  console.log(`   Changed: ${changedCount}`);
  console.log(`   Unchanged: ${svgFiles.length - changedCount}`);

  if (DRY_RUN) {
    console.log(`\n💡 Run without --dry-run to apply changes`);
  }
}

main();
