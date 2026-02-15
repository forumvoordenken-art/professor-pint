#!/usr/bin/env node
/**
 * Analyze SVG group structure — show which groups have content.
 */

const fs = require('fs');

const svgPath = process.argv[2];
if (!svgPath) {
  console.error('Usage: node analyze-svg-groups.js <svg-file>');
  process.exit(1);
}

const svg = fs.readFileSync(svgPath, 'utf8');

// Find all <g id="..."> groups
const groupRegex = /<g id="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g;
let match;

console.log('\n=== SVG Group Analysis ===\n');

while ((match = groupRegex.exec(svg)) !== null) {
  const [fullMatch, id, content] = match;

  // Count child elements
  const pathCount = (content.match(/<path/g) || []).length;
  const ellipseCount = (content.match(/<ellipse/g) || []).length;
  const circleCount = (content.match(/<circle/g) || []).length;
  const rectCount = (content.match(/<rect/g) || []).length;
  const lineCount = (content.match(/<line/g) || []).length;
  const subGroupCount = (content.match(/<g /g) || []).length;

  const totalElements = pathCount + ellipseCount + circleCount + rectCount + lineCount;
  const isEmpty = totalElements === 0 && subGroupCount === 0;

  console.log(`${isEmpty ? '❌' : '✅'} ${id.padEnd(20)} | paths:${pathCount} ellipses:${ellipseCount} circles:${circleCount} rects:${rectCount} lines:${lineCount} subgroups:${subGroupCount}`);

  if (isEmpty) {
    console.log(`   ^ EMPTY GROUP`);
  }
}

console.log('\n');
