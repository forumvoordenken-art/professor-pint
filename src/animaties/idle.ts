// Idle animation system
// Always-active subtle movements that bring characters to life

import { sineWave, seededRandom } from './easing';

/**
 * Breathing: subtle vertical oscillation of the torso
 * ~0.5Hz sine wave, moves 1-2px
 */
export const getBreathing = (frame: number): { y: number; scaleX: number } => {
  const breathY = sineWave(frame, 0.5) * 1.5;
  // Slight chest expansion on inhale
  const breathScaleX = 1 + sineWave(frame, 0.5) * 0.003;
  return { y: breathY, scaleX: breathScaleX };
};

/**
 * Eye blinking: deterministic random intervals, 2-6 sec apart
 * Blink lasts ~5 frames (closing 2, closed 1, opening 2)
 */
export const getBlinkState = (frame: number): number => {
  // Check each potential blink window
  // We divide time into 2-second windows and use seeded random to decide if a blink happens
  const fps = 30;
  const windowSize = fps * 2; // Check every 2 seconds
  const windowIndex = Math.floor(frame / windowSize);
  
  // Use seeded random to decide if this window has a blink
  const shouldBlink = seededRandom(windowIndex * 7) > 0.35; // ~65% chance per window
  
  if (!shouldBlink) return 1; // Fully open
  
  // Determine blink start frame within this window
  const blinkOffset = Math.floor(seededRandom(windowIndex * 13) * (windowSize - 10));
  const blinkStart = windowIndex * windowSize + blinkOffset;
  const frameInBlink = frame - blinkStart;
  
  if (frameInBlink < 0 || frameInBlink > 5) return 1; // Fully open
  
  // Blink curve: 1 -> 0 -> 1 over 5 frames
  if (frameInBlink <= 2) return 1 - (frameInBlink / 2); // Closing
  if (frameInBlink === 3) return 0.05; // Nearly closed
  return (frameInBlink - 3) / 2; // Opening
};

/**
 * Body sway: very subtle side-to-side movement
 * Slower than breathing, slightly irregular
 */
export const getBodySway = (frame: number): { x: number; rotation: number } => {
  // Combine two sine waves at different frequencies for organic feel
  const sway1 = sineWave(frame, 0.15) * 0.8;
  const sway2 = sineWave(frame, 0.23, 1.5) * 0.4;
  const x = sway1 + sway2;
  const rotation = (sway1 + sway2) * 0.3; // Very subtle lean
  return { x, rotation };
};

/**
 * Pupil micro-movement: tiny random-looking eye movements
 * Makes eyes feel alive even when not tracking anything
 */
export const getPupilMicroMovement = (frame: number): { x: number; y: number } => {
  const x = sineWave(frame, 0.3, 0) * 0.5 + sineWave(frame, 0.7, 2) * 0.3;
  const y = sineWave(frame, 0.25, 1) * 0.4 + sineWave(frame, 0.6, 3) * 0.2;
  return { x, y };
};

/**
 * Beer sway in the pint glass - slight liquid motion
 */
export const getBeerSway = (frame: number): { rotation: number; liquidOffset: number } => {
  const rotation = sineWave(frame, 0.2, 0.5) * 1.5;
  const liquidOffset = sineWave(frame, 0.3, 1) * 0.8;
  return { rotation, liquidOffset };
};

/**
 * Combined idle state for convenience
 */
export const getIdleState = (frame: number) => {
  return {
    breathing: getBreathing(frame),
    blink: getBlinkState(frame),
    sway: getBodySway(frame),
    pupil: getPupilMicroMovement(frame),
    beerSway: getBeerSway(frame),
  };
};
