// Talking animation system
// Mouth shapes, body bounce, and gesture sync

import { sineWave } from './easing';

/**
 * Mouth shapes for speech
 * 0 = closed, 1 = slightly open, 2 = medium/round, 3 = wide open
 */
export type MouthShape = 0 | 1 | 2 | 3;

/**
 * Get mouth shape from sine wave (basic mode, no phonemes)
 * Varies between shapes at speech-like rhythm
 */
export const getMouthShape = (frame: number, talking: boolean): MouthShape => {
  if (!talking) return 0;

  // Combine multiple frequencies for natural speech rhythm
  const fast = sineWave(frame, 4.5); // Main syllable rhythm
  const medium = sineWave(frame, 2.2, 0.7); // Word rhythm
  const slow = sineWave(frame, 0.8, 1.3); // Sentence rhythm (pauses)

  // Sentence rhythm creates natural pauses
  if (slow < -0.6) return 0; // Brief pause between phrases

  const combined = fast * 0.6 + medium * 0.4;

  if (combined > 0.5) return 3;  // Wide open (A/E sounds)
  if (combined > 0.0) return 2;  // Medium/round (O/U sounds)
  if (combined > -0.4) return 1; // Slightly open (B/M/P sounds)
  return 0;                       // Closed (natural pause)
};

/**
 * Get mouth shape from phoneme data (advanced mode, from ElevenLabs)
 * Phoneme format: [{time: number (seconds), phoneme: string}]
 */
export const getMouthShapeFromPhonemes = (
  frame: number,
  fps: number,
  phonemes: Array<{ time: number; phoneme: string }>
): MouthShape => {
  if (!phonemes.length) return 0;

  const currentTime = frame / fps;

  // Find the active phoneme
  let activePhoneme = '';
  for (let i = phonemes.length - 1; i >= 0; i--) {
    if (phonemes[i].time <= currentTime) {
      activePhoneme = phonemes[i].phoneme;
      break;
    }
  }

  // Map phonemes to mouth shapes
  const wideOpen = ['AA', 'AE', 'AH', 'AY', 'EH', 'EY'];
  const medium = ['AO', 'OW', 'UH', 'UW', 'OY'];
  const narrow = ['B', 'M', 'P', 'F', 'V', 'W'];
  // Everything else (T, D, N, S, Z, etc.) = slightly open

  if (wideOpen.includes(activePhoneme)) return 3;
  if (medium.includes(activePhoneme)) return 2;
  if (narrow.includes(activePhoneme)) return 1;
  if (activePhoneme === '' || activePhoneme === 'SIL') return 0;
  return 1; // Default slightly open for consonants
};

/**
 * Body bounce while talking - subtle up/down movement synced to speech
 */
export const getTalkingBounce = (frame: number, talking: boolean): number => {
  if (!talking) return 0;
  // Bounce synced to syllable rhythm
  const bounce = Math.abs(sineWave(frame, 3.5)) * 1.2;
  return -bounce; // Negative = upward
};

/**
 * Free hand gesture while talking
 * Returns rotation angle for the non-prop hand
 */
export const getTalkingGesture = (frame: number, talking: boolean): number => {
  if (!talking) return 0;
  // Slower, more expressive hand movement
  const gesture = sineWave(frame, 1.2, 0.5) * 12; // +/- 12 degrees
  return gesture;
};
