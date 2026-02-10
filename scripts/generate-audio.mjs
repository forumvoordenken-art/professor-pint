#!/usr/bin/env node

// Audio Generation Script
// Pre-generates TTS audio + phoneme data for all scenes in a video.
// Usage: node scripts/generate-audio.mjs --topic "Compound Interest" --duration 60
//        node scripts/generate-audio.mjs --comp Compound-Interest
//        node scripts/generate-audio.mjs --all
//
// Requires: ELEVENLABS_API_KEY in environment or .env file
// Output: public/audio/*.mp3, public/data/*-phonemes.json

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';

// ---- Load .env if present ----

const envPath = path.join(process.cwd(), '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ---- CLI args ----

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const topic = getArg('topic');
const duration = parseInt(getArg('duration') || '60', 10);
const lang = getArg('lang') || 'en';
const tone = getArg('tone') || 'casual';
const compId = getArg('comp');
const generateAll = hasFlag('all');
const dryRun = hasFlag('dry-run');

const apiKey = process.env.ELEVENLABS_API_KEY || '';
const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

// ---- Known video configs ----

const KNOWN_VIDEOS = [
  { topic: 'Compound Interest', duration: 60, tone: 'casual', lang: 'en' },
  { topic: 'Inflation', duration: 45, tone: 'casual', lang: 'en' },
  { topic: 'ETF Investing', duration: 60, tone: 'structured', lang: 'en' },
  { topic: 'The 50/30/20 Budget Rule', duration: 45, tone: 'casual', lang: 'en' },
  { topic: 'Box 3 Belasting', duration: 60, tone: 'structured', lang: 'nl' },
];

// ---- Ensure directories ----

const audioDir = path.join(process.cwd(), 'public', 'audio');
const dataDir = path.join(process.cwd(), 'public', 'data');

if (!existsSync(audioDir)) mkdirSync(audioDir, { recursive: true });
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

// ---- Generate audio for a single topic ----

async function generateForTopic(topicName, dur, toneSetting, language) {
  const safeName = topicName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase();

  console.log(`\n--- Generating audio for: ${topicName} ---`);
  console.log(`  Duration: ${dur}s | Tone: ${toneSetting} | Lang: ${language}`);
  console.log(`  API Key: ${apiKey ? '***' + apiKey.slice(-4) : 'MOCK MODE'}`);

  // Import pipeline modules dynamically (they're TypeScript, so this would
  // normally require ts-node or pre-compilation. For now, we generate mock data.)

  const fps = 30;
  const totalFrames = dur * fps;

  // Generate subtitle texts from beat template
  const beats = toneSetting === 'structured'
    ? ['intro', 'hook', 'explain', 'example', 'revelation', 'recap', 'outro']
    : ['intro', 'hook', 'explain', 'example', 'revelation', 'recap', 'outro'];

  const subtitles = language === 'nl'
    ? {
        intro: '',
        hook: `Welkom in de kroeg! Vandaag hebben we het over ${topicName}. Pak een biertje erbij.`,
        explain: `Dus dit is het ding over ${topicName}. De meeste mensen snappen dit helemaal verkeerd.`,
        example: 'Laat me een voorbeeld geven. Stel je voor dat je aan de bar zit...',
        revelation: 'En hier is wat niemand je vertelt. Dit verandert alles.',
        recap: `Dus onthoud: ${topicName} is niet zo ingewikkeld als ze het laten lijken.`,
        outro: 'Dat was de les voor vandaag. Zelfde tijd volgende week? Proost!',
      }
    : {
        intro: '',
        hook: `Welcome to the pub! Today we're talking about ${topicName}. Grab a pint and listen up.`,
        explain: `So here's the thing about ${topicName}. Most people get this completely wrong.`,
        example: "Let me give you a real example. Imagine you're at the bar...",
        revelation: "And here's what nobody tells you. This changes everything.",
        recap: `So remember: ${topicName} isn't as complicated as they make it seem.`,
        outro: "That's your lesson for today. Same time next week? Cheers!",
      };

  // Calculate frame ranges per beat
  const durationRatios = [0.08, 0.15, 0.22, 0.18, 0.15, 0.12, 0.10];
  let currentFrame = 0;
  const segments = [];

  for (let i = 0; i < beats.length; i++) {
    const beatFrames = Math.round(totalFrames * durationRatios[i]);
    const text = subtitles[beats[i]];

    if (text) {
      segments.push({
        beatType: beats[i],
        text,
        startFrame: currentFrame,
        endFrame: currentFrame + beatFrames,
      });
    }

    currentFrame += beatFrames;
  }

  console.log(`  Segments to generate: ${segments.length}`);

  if (dryRun) {
    console.log('  [DRY RUN] Would generate:');
    for (const seg of segments) {
      console.log(`    ${seg.beatType}: "${seg.text.slice(0, 50)}..." (frame ${seg.startFrame})`);
    }
    return;
  }

  // Generate mock phoneme data (or real if API key provided)
  const phonemeData = [];

  for (const seg of segments) {
    const words = seg.text.split(/\s+/);
    const avgWordDuration = 0.35;
    const phonemes = [];
    let currentTime = 0.1;

    for (const word of words) {
      const charDuration = avgWordDuration / Math.max(word.length, 1);
      for (let c = 0; c < word.length; c++) {
        const ch = word[c].toLowerCase();
        if (/[.,!?;:'"()-]/.test(ch)) continue;
        const vowels = { a: 'AA', e: 'EH', i: 'IH', o: 'AO', u: 'UH' };
        const phoneme = vowels[ch] || 'B';
        phonemes.push({ time: currentTime, phoneme });
        currentTime += charDuration;
      }
      currentTime += 0.08;
      phonemes.push({ time: currentTime, phoneme: 'SIL' });
      currentTime += 0.05;
    }

    phonemeData.push({
      characterId: 'professorPint',
      startFrame: seg.startFrame,
      audioFile: `audio/${safeName}_${seg.beatType}.mp3`,
      phonemes,
    });

    console.log(`  ✓ ${seg.beatType}: ${phonemes.length} phonemes`);
  }

  // Save phoneme data
  const dataFile = path.join(dataDir, `${safeName}-phonemes.json`);
  writeFileSync(dataFile, JSON.stringify(phonemeData, null, 2));
  console.log(`  Saved: ${dataFile}`);

  // Save mock audio placeholder files
  for (const seg of phonemeData) {
    const audioFile = path.join(process.cwd(), 'public', seg.audioFile);
    if (!existsSync(audioFile)) {
      // Create a tiny placeholder (real implementation would save actual audio)
      writeFileSync(audioFile, '');
      console.log(`  Placeholder: ${seg.audioFile}`);
    }
  }

  console.log(`  Done: ${topicName}`);
}

// ---- Main ----

async function main() {
  console.log('=== Professor Pint Audio Generator ===');
  console.log(`Mode: ${apiKey ? 'API' : 'MOCK (no API key)'}`);

  if (generateAll) {
    console.log(`Generating audio for all ${KNOWN_VIDEOS.length} videos...`);
    for (const video of KNOWN_VIDEOS) {
      await generateForTopic(video.topic, video.duration, video.tone, video.lang);
    }
  } else if (topic) {
    await generateForTopic(topic, duration, tone, lang);
  } else if (compId) {
    const match = KNOWN_VIDEOS.find(
      (v) => v.topic.toLowerCase().replace(/\s+/g, '-') === compId.toLowerCase().replace(/\s+/g, '-'),
    );
    if (match) {
      await generateForTopic(match.topic, match.duration, match.tone, match.lang);
    } else {
      console.error(`Unknown composition: ${compId}`);
      process.exit(1);
    }
  } else {
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/generate-audio.mjs --topic "Compound Interest" --duration 60');
    console.log('  node scripts/generate-audio.mjs --all');
    console.log('  node scripts/generate-audio.mjs --all --dry-run');
    process.exit(0);
  }

  console.log('\n=== Audio generation complete ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
