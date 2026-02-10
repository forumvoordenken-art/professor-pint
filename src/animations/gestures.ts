// Gesture animation system
// Named gestures for character arm/hand movements beyond basic talking

import { sineWave, cubicEaseOut, cubicEaseInOut } from './easing';

export type Gesture = 'idle' | 'wave' | 'point' | 'shrug' | 'explain' | 'cheers';

interface GestureState {
  leftArmRotation: number;
  leftForearmAngle: number;
  rightArmRotation: number;
  rightForearmAngle: number;
}

const GESTURE_DURATION = 30; // frames per gesture cycle

/**
 * Get gesture-driven arm positions.
 * gestureFrame = frames since gesture started (for transition-in).
 * Returns rotation offsets to add on top of idle/talking animations.
 */
export const getGestureState = (
  gesture: Gesture,
  frame: number,
  gestureFrame: number,
): GestureState => {
  // Smooth entry into gesture over 8 frames
  const entry = cubicEaseOut(Math.min(1, gestureFrame / 8));

  switch (gesture) {
    case 'wave': {
      // Left hand waves back and forth
      const wave = sineWave(frame, 3) * 20;
      return {
        leftArmRotation: (-45 + wave) * entry,
        leftForearmAngle: -40 * entry,
        rightArmRotation: 0,
        rightForearmAngle: 0,
      };
    }
    case 'point': {
      // Left arm extends forward and points
      return {
        leftArmRotation: -55 * entry,
        leftForearmAngle: -70 * entry,
        rightArmRotation: 0,
        rightForearmAngle: 0,
      };
    }
    case 'shrug': {
      // Both shoulders up, palms out
      const hold = cubicEaseInOut(Math.min(1, gestureFrame / 12));
      return {
        leftArmRotation: -30 * hold,
        leftForearmAngle: -50 * hold,
        rightArmRotation: 30 * hold,
        rightForearmAngle: 50 * hold,
      };
    }
    case 'explain': {
      // Left hand moves in circular explaining motion
      const circX = sineWave(frame, 1.5) * 15;
      const circY = sineWave(frame, 1.5, 1.57) * 8;
      return {
        leftArmRotation: (-35 + circX) * entry,
        leftForearmAngle: (-45 + circY) * entry,
        rightArmRotation: 0,
        rightForearmAngle: 0,
      };
    }
    case 'cheers': {
      // Right arm raises pint glass higher
      const raise = cubicEaseOut(Math.min(1, gestureFrame / 15));
      return {
        leftArmRotation: 0,
        leftForearmAngle: 0,
        rightArmRotation: -15 * raise,
        rightForearmAngle: -20 * raise,
      };
    }
    case 'idle':
    default:
      return {
        leftArmRotation: 0,
        leftForearmAngle: 0,
        rightArmRotation: 0,
        rightForearmAngle: 0,
      };
  }
};

/**
 * Get gesture duration in frames for timing purposes
 */
export const getGestureDuration = (gesture: Gesture): number => {
  switch (gesture) {
    case 'wave': return 45;
    case 'point': return 30;
    case 'shrug': return 40;
    case 'explain': return 60;
    case 'cheers': return 35;
    default: return GESTURE_DURATION;
  }
};
