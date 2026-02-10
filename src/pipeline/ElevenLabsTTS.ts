// ElevenLabs TTS Service
// Generates audio files + phoneme timing data from text.
// Works both in Node.js (for pre-generation) and provides types for Remotion.

import type { AudioSegment, PhonemeData } from '../systems/AudioSync';

// ---- Config ----

export interface TTSConfig {
  /** ElevenLabs API key */
  apiKey: string;
  /** Voice ID (default: Professor Pint's voice) */
  voiceId?: string;
  /** Model ID (default: eleven_multilingual_v2) */
  modelId?: string;
  /** Output directory for audio files (relative to public/) */
  outputDir?: string;
}

// ---- ElevenLabs API response types ----

interface ElevenLabsAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

interface ElevenLabsResponse {
  audio_base64?: string;
  alignment?: ElevenLabsAlignment;
}

// ---- Character-to-phoneme mapping ----

const charToPhoneme = (char: string): string => {
  const vowels: Record<string, string> = {
    a: 'AA', e: 'EH', i: 'IH', o: 'AO', u: 'UH',
    A: 'AA', E: 'EH', I: 'IH', O: 'AO', U: 'UH',
  };
  const consonants: Record<string, string> = {
    b: 'B', c: 'K', d: 'D', f: 'F', g: 'G',
    h: 'HH', j: 'JH', k: 'K', l: 'L', m: 'M',
    n: 'N', p: 'P', q: 'K', r: 'R', s: 'S',
    t: 'T', v: 'V', w: 'W', x: 'K', y: 'Y', z: 'Z',
  };
  const lower = char.toLowerCase();
  return vowels[lower] ?? consonants[lower] ?? 'SIL';
};

// ---- Main TTS function ----

/**
 * Generate audio + phonemes for a line of dialogue.
 * Returns the audio file path and phoneme data for lip sync.
 *
 * In production: calls ElevenLabs API, saves audio file, extracts phonemes.
 * Without API key: generates mock phoneme timing for testing.
 */
export const generateSpeech = async (
  text: string,
  characterId: string,
  startFrame: number,
  config: TTSConfig,
): Promise<AudioSegment> => {
  const {
    apiKey,
    voiceId = 'pNInz6obpgDQGcFmaJgB', // Default: Adam
    modelId = 'eleven_multilingual_v2',
    outputDir = 'audio',
  } = config;

  // If no API key, return mock data for development/testing
  if (!apiKey || apiKey === 'mock' || apiKey === 'test') {
    return generateMockSegment(text, characterId, startFrame);
  }

  // Call ElevenLabs API with alignment data
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.65,
          similarity_boost: 0.75,
          style: 0.35,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
  }

  const data: ElevenLabsResponse = await response.json();

  // Extract phonemes from alignment data
  const phonemes = extractPhonemes(data.alignment);

  // Audio file path (caller is responsible for saving the base64 audio)
  const safeId = characterId.replace(/[^a-zA-Z0-9]/g, '_');
  const audioFile = `${outputDir}/${safeId}_${startFrame}.mp3`;

  return {
    characterId,
    startFrame,
    audioFile,
    phonemes,
    _audioBase64: data.audio_base64,
  } as AudioSegment & { _audioBase64?: string };
};

/**
 * Extract phoneme data from ElevenLabs alignment response.
 */
const extractPhonemes = (alignment?: ElevenLabsAlignment): PhonemeData[] => {
  if (!alignment) return [];

  const phonemes: PhonemeData[] = [];
  const { characters, character_start_times_seconds } = alignment;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const time = character_start_times_seconds[i];

    // Skip whitespace and punctuation
    if (/\s|[.,!?;:'"()-]/.test(char)) {
      // Add silence phoneme for pauses longer than 0.1s
      if (phonemes.length > 0) {
        const lastTime = phonemes[phonemes.length - 1].time;
        if (time - lastTime > 0.1) {
          phonemes.push({ time, phoneme: 'SIL' });
        }
      }
      continue;
    }

    phonemes.push({
      time,
      phoneme: charToPhoneme(char),
    });
  }

  return phonemes;
};

// ---- Mock generation for development ----

/**
 * Generate realistic mock phoneme data from text.
 * Useful for testing lip sync without API calls.
 */
const generateMockSegment = (
  text: string,
  characterId: string,
  startFrame: number,
): AudioSegment => {
  const words = text.split(/\s+/);
  const avgWordDuration = 0.35; // seconds per word
  const phonemes: PhonemeData[] = [];

  let currentTime = 0.1; // Small initial delay

  for (const word of words) {
    const charDuration = avgWordDuration / Math.max(word.length, 1);

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (/[.,!?;:'"()-]/.test(char)) continue;

      phonemes.push({
        time: currentTime,
        phoneme: charToPhoneme(char),
      });
      currentTime += charDuration;
    }

    // Pause between words
    currentTime += 0.08;
    phonemes.push({ time: currentTime, phoneme: 'SIL' });
    currentTime += 0.05;
  }

  return {
    characterId,
    startFrame,
    audioFile: `audio/mock_${characterId}_${startFrame}.mp3`,
    phonemes,
  };
};

// ---- Batch generation ----

/**
 * Generate audio for all scenes that have subtitles.
 * Returns AudioSegment[] ready for AudioSync.
 */
export const generateAllSpeech = async (
  scenes: Array<{ subtitle: string; start: number; characters: Array<{ id: string; talking: boolean }> }>,
  config: TTSConfig,
): Promise<AudioSegment[]> => {
  const segments: AudioSegment[] = [];

  for (const scene of scenes) {
    if (!scene.subtitle) continue;

    // Find the talking character
    const talkingChar = scene.characters.find((c) => c.talking);
    if (!talkingChar) continue;

    const segment = await generateSpeech(
      scene.subtitle,
      talkingChar.id,
      scene.start,
      config,
    );
    segments.push(segment);
  }

  return segments;
};

// ---- Save audio utility ----

/**
 * Save base64 audio data to a file (Node.js only).
 * Call this from a build script, not from Remotion components.
 */
export const saveAudioFile = async (
  base64Audio: string,
  outputPath: string,
): Promise<void> => {
  // Dynamic import for Node.js fs
  const fs = await import('fs');
  const path = await import('path');

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const buffer = Buffer.from(base64Audio, 'base64');
  fs.writeFileSync(outputPath, buffer);
};
