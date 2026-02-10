#!/usr/bin/env node

// Batch Render Script
// Renders multiple videos in sequence or parallel.
// Usage: node scripts/batch-render.mjs --all
//        node scripts/batch-render.mjs --topics "Compound Interest,Inflation,ETFs"
//        node scripts/batch-render.mjs --all --dry-run

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

// ---- CLI args ----

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const renderAll = hasFlag('all');
const topicList = getArg('topics');
const outDir = getArg('out') || 'out';
const codec = getArg('codec') || 'h264';
const concurrency = getArg('concurrency') || '50%';
const dryRun = hasFlag('dry-run');

// ---- Known compositions ----

const ALL_VIDEOS = [
  { id: 'DemoVideo', name: 'Demo Video', frames: 600 },
  { id: 'DialogueDemo', name: 'Dialogue Demo', frames: 900 },
  { id: 'Compound-Interest', name: 'Compound Interest', frames: 1800 },
  { id: 'Inflation', name: 'Inflation', frames: 1350 },
  { id: 'ETF-Investing', name: 'ETF Investing', frames: 1800 },
  { id: 'Budgeting', name: 'Budgeting', frames: 1350 },
  { id: 'Box3-Belasting', name: 'Box 3 Belasting', frames: 1800 },
];

// ---- Resolve what to render ----

let videosToRender = [];

if (renderAll) {
  videosToRender = ALL_VIDEOS;
} else if (topicList) {
  const topics = topicList.split(',').map((t) => t.trim().toLowerCase());
  videosToRender = ALL_VIDEOS.filter((v) =>
    topics.some((t) => v.name.toLowerCase().includes(t) || v.id.toLowerCase().includes(t)),
  );
} else {
  console.log('=== Professor Pint Batch Renderer ===');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/batch-render.mjs --all');
  console.log('  node scripts/batch-render.mjs --topics "Compound Interest,Inflation"');
  console.log('  node scripts/batch-render.mjs --all --dry-run');
  console.log('');
  console.log('Available compositions:');
  for (const v of ALL_VIDEOS) {
    console.log(`  ${v.id} (${v.name}, ${v.frames} frames)`);
  }
  process.exit(0);
}

// ---- Ensure output dir ----

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

// ---- Render ----

console.log('=== Professor Pint Batch Renderer ===');
console.log(`Videos to render: ${videosToRender.length}`);
console.log(`Output: ${outDir}/`);
console.log(`Codec: ${codec}`);
console.log('');

const results = [];
const startTime = Date.now();

for (let i = 0; i < videosToRender.length; i++) {
  const video = videosToRender[i];
  const safeName = video.name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase();
  const outputFile = path.join(outDir, `${safeName}.mp4`);

  console.log(`[${i + 1}/${videosToRender.length}] Rendering: ${video.name}`);
  console.log(`  Composition: ${video.id}`);
  console.log(`  Frames: ${video.frames}`);
  console.log(`  Output: ${outputFile}`);

  const renderCmd = [
    'npx remotion render',
    video.id,
    `"${outputFile}"`,
    `--codec=${codec}`,
    `--concurrency=${concurrency}`,
    '--log=error',
  ].join(' ');

  if (dryRun) {
    console.log(`  [DRY RUN] ${renderCmd}`);
    results.push({ name: video.name, status: 'dry-run' });
    continue;
  }

  const videoStart = Date.now();
  try {
    execSync(renderCmd, {
      stdio: 'pipe',
      cwd: process.cwd(),
      env: { ...process.env },
    });
    const elapsed = ((Date.now() - videoStart) / 1000).toFixed(1);
    console.log(`  ✓ Done in ${elapsed}s`);
    results.push({ name: video.name, status: 'success', time: elapsed });
  } catch (error) {
    const elapsed = ((Date.now() - videoStart) / 1000).toFixed(1);
    console.error(`  ✗ Failed after ${elapsed}s`);
    results.push({ name: video.name, status: 'failed', time: elapsed });
  }

  console.log('');
}

// ---- Summary ----

const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

console.log('=== Batch Render Summary ===');
console.log(`Total time: ${totalTime}s`);
console.log('');

for (const r of results) {
  const icon = r.status === 'success' ? '✓' : r.status === 'failed' ? '✗' : '○';
  const timeStr = r.time ? ` (${r.time}s)` : '';
  console.log(`  ${icon} ${r.name}: ${r.status}${timeStr}`);
}

const failed = results.filter((r) => r.status === 'failed');
if (failed.length > 0) {
  console.log(`\n${failed.length} video(s) failed to render.`);
  process.exit(1);
}
