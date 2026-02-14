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

// Kleuren die als "wit" gelden (case-insensitive hex)
const WHITE_COLORS = [
  '#ffffff',
  '#fefefe',
  '#fdfdfd',
  '#fcfcfc',
  '#fcfdfe',
  '#feffff',
  '#fffeff',
];

/**
 * Check of een kleur bijna-wit is
 */
function isWhite(color) {
  if (!color) return false;
  const normalized = color.toLowerCase().trim();
  return WHITE_COLORS.includes(normalized);
}

/**
 * Verwijder eerste witte <path> uit SVG string
 * Returns { cleaned: string, removed: boolean, color: string|null }
 */
function removeWhiteBackground(svgContent) {
  // Match de eerste <path fill="..."> tag
  const pathRegex = /<path\s+fill="([^"]+)"[^>]*>[\s\S]*?<\/path>|<path\s+fill="([^"]+)"[^>]*\/>/;
  const match = svgContent.match(pathRegex);

  if (!match) {
    return { cleaned: svgContent, removed: false, color: null };
  }

  const fillColor = match[1] || match[2];

  if (!isWhite(fillColor)) {
    return { cleaned: svgContent, removed: false, color: fillColor };
  }

  // Verwijder de eerste path
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
 * Process één SVG bestand
 */
function processSvg(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = removeWhiteBackground(content);

  const relativePath = path.relative(ASSETS_DIR, filePath);

  if (result.removed) {
    console.log(`✅ ${relativePath}`);
    console.log(`   Removed white background: ${result.color}`);

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, result.cleaned, 'utf8');
      console.log(`   Written cleaned SVG`);
    }
    return { processed: true, changed: true };
  } else {
    console.log(`⏭️  ${relativePath}`);
    if (result.color) {
      console.log(`   First path is not white: ${result.color}`);
    } else {
      console.log(`   No <path> tags found`);
    }
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
