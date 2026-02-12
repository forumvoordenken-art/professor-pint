// Emotion system
// Defines facial feature positions per emotion and smooth transitions

import { lerp, cubicEaseOut } from './easing';

export type Emotion = 'neutral' | 'happy' | 'shocked' | 'thinking' | 'angry' | 'sad';

/**
 * Facial feature offsets per emotion
 * All values are relative offsets from neutral position
 */
interface EmotionParams {
  eyeScaleY: number;      // 1 = normal, >1 = wider, <1 = squint
  eyeOffsetY: number;     // Vertical shift
  pupilScale: number;     // Pupil size
  browLeftY: number;      // Left eyebrow offset (negative = raised)
  browRightY: number;     // Right eyebrow offset
  browLeftRotation: number;  // Brow angle in degrees
  browRightRotation: number;
  mouthCurve: number;     // Positive = smile, negative = frown
  mouthWidth: number;     // 1 = normal
  mouthOpen: number;      // 0 = closed, 1 = fully open
  blushOpacity: number;   // Cheek blush
  headTilt: number;       // Head rotation in degrees
}

const EMOTION_PARAMS: Record<Emotion, EmotionParams> = {
  neutral: {
    eyeScaleY: 1, eyeOffsetY: 0, pupilScale: 1,
    browLeftY: 0, browRightY: 0, browLeftRotation: 0, browRightRotation: 0,
    mouthCurve: 0, mouthWidth: 1, mouthOpen: 0,
    blushOpacity: 0, headTilt: 0,
  },
  happy: {
    eyeScaleY: 0.8, eyeOffsetY: 0.5, pupilScale: 1.05,
    browLeftY: -2, browRightY: -2, browLeftRotation: -3, browRightRotation: 3,
    mouthCurve: 8, mouthWidth: 1.15, mouthOpen: 0.2,
    blushOpacity: 0.3, headTilt: 2,
  },
  shocked: {
    eyeScaleY: 1.5, eyeOffsetY: -1, pupilScale: 0.7,
    browLeftY: -6, browRightY: -6, browLeftRotation: 0, browRightRotation: 0,
    mouthCurve: -2, mouthWidth: 0.8, mouthOpen: 0.8,
    blushOpacity: 0, headTilt: 0,
  },
  thinking: {
    eyeScaleY: 0.9, eyeOffsetY: -1, pupilScale: 1,
    browLeftY: -1, browRightY: -4, browLeftRotation: 0, browRightRotation: 8,
    mouthCurve: -1, mouthWidth: 0.85, mouthOpen: 0,
    blushOpacity: 0, headTilt: -5,
  },
  angry: {
    eyeScaleY: 0.7, eyeOffsetY: 1, pupilScale: 0.85,
    browLeftY: 1, browRightY: 1, browLeftRotation: 12, browRightRotation: -12,
    mouthCurve: -5, mouthWidth: 1.1, mouthOpen: 0.1,
    blushOpacity: 0, headTilt: -2,
  },
  sad: {
    eyeScaleY: 0.85, eyeOffsetY: 1, pupilScale: 1.1,
    browLeftY: -2, browRightY: -2, browLeftRotation: -8, browRightRotation: 8,
    mouthCurve: -6, mouthWidth: 0.9, mouthOpen: 0,
    blushOpacity: 0, headTilt: 3,
  },
};

/**
 * Interpolate between two emotion states
 * transitionProgress: 0 = fully fromEmotion, 1 = fully toEmotion
 */
export const interpolateEmotions = (
  fromEmotion: Emotion,
  toEmotion: Emotion,
  progress: number
): EmotionParams => {
  const from = EMOTION_PARAMS[fromEmotion];
  const to = EMOTION_PARAMS[toEmotion];
  const t = cubicEaseOut(progress);

  const result: Record<string, number> = {};
  for (const key of Object.keys(from) as Array<keyof EmotionParams>) {
    result[key] = lerp(from[key], to[key], t);
  }
  return result as unknown as EmotionParams;
};

/**
 * Get emotion params (no transition, instant)
 */
export const getEmotionParams = (emotion: Emotion): EmotionParams => {
  return EMOTION_PARAMS[emotion];
};

/**
 * Manage emotion transitions over time
 * Call this each frame with the target emotion
 * Returns interpolated params with smooth transition
 */
export class EmotionTransition {
  private currentEmotion: Emotion = 'neutral';
  private targetEmotion: Emotion = 'neutral';
  private transitionStart: number = 0;
  private transitionDuration: number = 10; // frames (10 frames at 30fps = ~0.33s)

  getParams(frame: number, targetEmotion: Emotion): EmotionParams {
    if (targetEmotion !== this.targetEmotion) {
      this.currentEmotion = this.targetEmotion;
      this.targetEmotion = targetEmotion;
      this.transitionStart = frame;
    }

    const elapsed = frame - this.transitionStart;
    const progress = Math.min(1, elapsed / this.transitionDuration);

    return interpolateEmotions(this.currentEmotion, this.targetEmotion, progress);
  }
}

export type { EmotionParams };
