// Easing & interpolation utilities for Professor Pint animations
// All animations use these shared functions for consistent feel

/**
 * Cubic ease-out: fast start, smooth deceleration
 * Used for emotion transitions, camera moves, entrances
 */
export const cubicEaseOut = (t: number): number => {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
};

/**
 * Cubic ease-in-out: smooth start and end
 * Used for breathing, swaying, looping animations
 */
export const cubicEaseInOut = (t: number): number => {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
};

/**
 * Linear interpolation between two values
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * Math.max(0, Math.min(1, t));
};

/**
 * Map a value from one range to another with optional easing
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  easingFn?: (t: number) => number
): number => {
  const t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  const eased = easingFn ? easingFn(t) : t;
  return outMin + (outMax - outMin) * eased;
};

/**
 * Sine wave oscillation - used for breathing, swaying, idle motion
 * Returns value between -1 and 1
 */
export const sineWave = (frame: number, frequency: number, phase: number = 0): number => {
  return Math.sin((frame / 30) * frequency * Math.PI * 2 + phase);
};

/**
 * Deterministic pseudo-random based on seed
 * Used for blink timing so it's consistent across renders
 */
export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
