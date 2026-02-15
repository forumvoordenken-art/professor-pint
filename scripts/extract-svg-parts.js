#!/usr/bin/env node
/**
 * Extract SVG body parts into individual files for inspection.
 * This helps debug missing/empty groups.
 */

const fs = require('fs');
const path = require('path');

const svgPath = process.argv[2];
const outputDir = process.argv[3] || '/tmp/svg-parts';

if (!svgPath) {
  console.error('Usage: node extract-svg-parts.js <svg-file> [output-dir]');
  process.exit(1);
}

const svg = fs.readFileSync(svgPath, 'utf8');
fs.mkdirSync(outputDir, { recursive: true });

// Extract viewBox from root SVG
const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 1536 1024';

console.log(`ViewBox: ${viewBox}`);
console.log(`Output: ${outputDir}\n`);

// Find all top-level groups within <g id="scene">
const sceneMatch = svg.match(/<g id="scene">([\s\S]*)<\/g>\s*<\/svg>/);
if (!sceneMatch) {
  console.error('No <g id="scene"> found');
  process.exit(1);
}

const sceneContent = sceneMatch[1];

// Split into major groups (boy, dog, leash)
const majorGroupRegex = /<g id="(boy|dog|leash)"[^>]*>([\s\S]*?)(?=<g id="(?:boy|dog|leash)"|<\/g>\s*$)/g;
let match;

while ((match = majorGroupRegex.exec(sceneContent)) !== null) {
  const [_, groupId, content] = match;

  // Find all nested groups within this major group
  const nestedRegex = /<g id="([^"]+)"[^>]*>/g;
  const nestedIds = [];
  let nestedMatch;

  while ((nestedMatch = nestedRegex.exec(content)) !== null) {
    nestedIds.push(nestedMatch[1]);
  }

  console.log(`\n📦 ${groupId}`);
  console.log(`   Nested groups: ${nestedIds.join(', ') || '(none)'}`);

  // Extract each nested group
  for (const nestedId of nestedIds) {
    extractGroup(svg, nestedId, viewBox, outputDir);
  }
}

function extractGroup(svg, groupId, viewBox, outputDir) {
  // Find the group with proper depth tracking
  const groupStart = `<g id="${groupId}"`;
  const startIndex = svg.indexOf(groupStart);

  if (startIndex === -1) {
    console.log(`   ⚠️  ${groupId}: not found`);
    return;
  }

  // Find matching closing tag with depth tracking
  let depth = 0;
  let i = startIndex;
  let inTag = false;
  let tagContent = '';

  while (i < svg.length) {
    const char = svg[i];

    if (char === '<') {
      inTag = true;
      tagContent = '<';
    } else if (char === '>' && inTag) {
      inTag = false;

      if (tagContent.startsWith('<g ') || tagContent.startsWith('<g>')) {
        depth++;
      } else if (tagContent === '</g') {
        depth--;
        if (depth === 0) {
          // Found the matching closing tag
          const groupContent = svg.substring(startIndex, i + 1);

          // Count elements
          const pathCount = (groupContent.match(/<path/g) || []).length;
          const shapeCount = (groupContent.match(/<(ellipse|circle|rect|line)/g) || []).length;
          const isEmpty = pathCount === 0 && shapeCount === 0 && !groupContent.includes('<g ');

          const status = isEmpty ? '❌ EMPTY' : `✅ ${pathCount}p ${shapeCount}s`;
          console.log(`   ${status} ${groupId}`);

          // Write to file
          const wrappedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
${groupContent}
</svg>`;

          fs.writeFileSync(path.join(outputDir, `${groupId}.svg`), wrappedSVG);
          return;
        }
      }

      tagContent = '';
    } else if (inTag) {
      tagContent += char;
    }

    i++;
  }

  console.log(`   ⚠️  ${groupId}: no closing tag found`);
}
