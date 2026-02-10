#!/usr/bin/env node

// CLI Render Script
// Usage: node scripts/render.mjs --topic "Compound Interest" --duration 60 --lang en
// Outputs: out/<topic>.mp4

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

// ---- Parse CLI args ----

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const topic = getArg('topic') || 'Compound Interest';
const duration = parseInt(getArg('duration') || '60', 10);
const lang = getArg('lang') || 'en';
const tone = getArg('tone') || 'casual';
const compositionId = getArg('comp') || null;
const outDir = getArg('out') || 'out';
const codec = getArg('codec') || 'h264';
const concurrency = getArg('concurrency') || '50%';
const dryRun = hasFlag('dry-run');
const verbose = hasFlag('verbose');

// ---- Derived values ----

const fps = 30;
const totalFrames = duration * fps;
const safeTopic = topic.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase();
const outputFile = path.join(outDir, `${safeTopic}.mp4`);

// ---- Resolve composition ----
// If no --comp given, try to match a registered composition or use DemoVideo

const KNOWN_COMPOSITIONS = {
  'compound interest': 'Compound-Interest',
  'inflation': 'Inflation',
  'etf investing': 'ETF-Investing',
  'budgeting': 'Budgeting',
  'the 50/30/20 budget rule': 'Budgeting',
  'box 3 belasting': 'Box3-Belasting',
};

const resolveComposition = () => {
  if (compositionId) return compositionId;
  const match = KNOWN_COMPOSITIONS[topic.toLowerCase()];
  if (match) return match;
  // For unknown topics, we generate a custom composition via inputProps
  return 'PipelineVideo';
};

const comp = resolveComposition();

// ---- Generate inputProps for PipelineVideo ----

const inputProps = JSON.stringify({
  topic,
  duration,
  language: lang,
  tone,
  showDebug: false,
});

// ---- Ensure output dir ----

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

// ---- Register dynamic composition if needed ----
// For topics not in the known list, we need PipelineVideo registered with correct duration

const needsDynamic = comp === 'PipelineVideo' && !compositionId;

if (needsDynamic) {
  // Write a temporary props file for Remotion
  const propsFile = path.join(outDir, '.render-props.json');
  writeFileSync(propsFile, inputProps);
  console.log(`Props written to ${propsFile}`);
}

// ---- Build render command ----

const renderCmd = [
  'npx remotion render',
  comp,
  `"${outputFile}"`,
  `--props='${inputProps}'`,
  `--codec=${codec}`,
  `--concurrency=${concurrency}`,
  `--frames=0-${totalFrames - 1}`,
  '--log=verbose',
].join(' ');

// ---- Output info ----

console.log('');
console.log('=== Professor Pint Video Render ===');
console.log(`  Topic:        ${topic}`);
console.log(`  Composition:  ${comp}`);
console.log(`  Duration:     ${duration}s (${totalFrames} frames @ ${fps}fps)`);
console.log(`  Language:     ${lang}`);
console.log(`  Tone:         ${tone}`);
console.log(`  Output:       ${outputFile}`);
console.log(`  Codec:        ${codec}`);
console.log('');

if (verbose) {
  console.log(`  Command: ${renderCmd}`);
  console.log('');
}

if (dryRun) {
  console.log('[DRY RUN] Would execute:');
  console.log(`  ${renderCmd}`);
  process.exit(0);
}

// ---- Execute render ----

console.log('Rendering...');
console.log('');

try {
  execSync(renderCmd, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env },
  });
  console.log('');
  console.log(`Done! Video saved to: ${outputFile}`);
} catch (error) {
  console.error('');
  console.error('Render failed. Check the output above for details.');
  process.exit(1);
}
