// CameraPath: Keyframe-based camera movement WITHIN a scene
// Replaces static camera positions with smooth animated paths
// Includes character tracking to keep subjects in frame

import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

// ---- Types ----

export interface CameraKeyframe {
  /** Frame offset from scene start (0 = start of scene) */
  frame: number;
  x: number;
  y: number;
  zoom: number;
}

export interface CameraPathData {
  keyframes: CameraKeyframe[];
  /** Character tracking: keep this character centered if set */
  trackCharacter?: string;
  /** How much to offset tracking (e.g., keep character on left third) */
  trackOffsetX?: number;
  trackOffsetY?: number;
}

export interface CameraPathProps {
  children: React.ReactNode;
  /** Camera path definition */
  path?: CameraPathData;
  /** Fallback static camera (used if no path defined) */
  x?: number;
  y?: number;
  zoom?: number;
  /** Scene timing */
  sceneStart: number;
  sceneEnd: number;
  /** Previous scene's camera for smooth entry */
  previousX?: number;
  previousY?: number;
  previousZoom?: number;
  /** Character positions for tracking */
  characterPositions?: Array<{ id: string; x: number; y: number }>;
  /** Canvas dimensions */
  width?: number;
  height?: number;
}

// ---- Preset camera paths ----

export type CameraPreset =
  | 'static'
  | 'slowZoomIn'
  | 'slowZoomOut'
  | 'panLeftToRight'
  | 'panRightToLeft'
  | 'tiltDown'
  | 'tiltUp'
  | 'establishingShot'    // wide → zoom to character
  | 'dramaticZoom'        // fast zoom to close-up
  | 'followCharacter'     // tracks character position
  | 'sweepingPan'         // wide panoramic sweep
  | 'revealDown';         // starts high, reveals scene

export const CAMERA_PRESETS: Record<CameraPreset, (sceneDuration: number) => CameraPathData> = {
  static: () => ({
    keyframes: [{ frame: 0, x: 0, y: 0, zoom: 1 }],
  }),
  slowZoomIn: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: 0, zoom: 1 },
      { frame: dur, x: 0, y: -30, zoom: 1.3 },
    ],
  }),
  slowZoomOut: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: -20, zoom: 1.3 },
      { frame: dur, x: 0, y: 0, zoom: 1 },
    ],
  }),
  panLeftToRight: (dur) => ({
    keyframes: [
      { frame: 0, x: -200, y: 0, zoom: 1.15 },
      { frame: dur, x: 200, y: 0, zoom: 1.15 },
    ],
  }),
  panRightToLeft: (dur) => ({
    keyframes: [
      { frame: 0, x: 200, y: 0, zoom: 1.15 },
      { frame: dur, x: -200, y: 0, zoom: 1.15 },
    ],
  }),
  tiltDown: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: -120, zoom: 1.2 },
      { frame: dur, x: 0, y: 60, zoom: 1.2 },
    ],
  }),
  tiltUp: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: 60, zoom: 1.2 },
      { frame: dur, x: 0, y: -120, zoom: 1.2 },
    ],
  }),
  establishingShot: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: 0, zoom: 1 },
      { frame: Math.floor(dur * 0.3), x: 0, y: 0, zoom: 1 },
      { frame: dur, x: 50, y: -20, zoom: 1.4 },
    ],
  }),
  dramaticZoom: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: 0, zoom: 1.1 },
      { frame: Math.floor(dur * 0.6), x: 0, y: 0, zoom: 1.1 },
      { frame: Math.floor(dur * 0.8), x: 0, y: -30, zoom: 1.6 },
      { frame: dur, x: 0, y: -30, zoom: 1.6 },
    ],
  }),
  followCharacter: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: 0, zoom: 1.2 },
      { frame: dur, x: 0, y: 0, zoom: 1.2 },
    ],
    trackCharacter: 'professorPint',
    trackOffsetX: 0,
    trackOffsetY: -40,
  }),
  sweepingPan: (dur) => ({
    keyframes: [
      { frame: 0, x: -300, y: -50, zoom: 1.1 },
      { frame: Math.floor(dur * 0.5), x: 0, y: 0, zoom: 1.15 },
      { frame: dur, x: 300, y: -50, zoom: 1.1 },
    ],
  }),
  revealDown: (dur) => ({
    keyframes: [
      { frame: 0, x: 0, y: -200, zoom: 1.3 },
      { frame: Math.floor(dur * 0.7), x: 0, y: 0, zoom: 1.15 },
      { frame: dur, x: 0, y: 0, zoom: 1.15 },
    ],
  }),
};

// ---- Interpolation helper ----

const interpolateKeyframes = (
  keyframes: CameraKeyframe[],
  frameInScene: number,
): { x: number; y: number; zoom: number } => {
  if (keyframes.length === 0) {
    return { x: 0, y: 0, zoom: 1 };
  }
  if (keyframes.length === 1) {
    return { x: keyframes[0].x, y: keyframes[0].y, zoom: keyframes[0].zoom };
  }

  // Find the two keyframes we're between
  let kfBefore = keyframes[0];
  let kfAfter = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frameInScene >= keyframes[i].frame && frameInScene <= keyframes[i + 1].frame) {
      kfBefore = keyframes[i];
      kfAfter = keyframes[i + 1];
      break;
    }
  }

  // Clamp to first/last keyframe
  if (frameInScene <= kfBefore.frame) {
    return { x: kfBefore.x, y: kfBefore.y, zoom: kfBefore.zoom };
  }
  if (frameInScene >= kfAfter.frame) {
    return { x: kfAfter.x, y: kfAfter.y, zoom: kfAfter.zoom };
  }

  // Interpolate between keyframes
  const range = kfAfter.frame - kfBefore.frame;
  const progress = (frameInScene - kfBefore.frame) / range;
  const eased = Easing.out(Easing.cubic)(progress);

  return {
    x: kfBefore.x + (kfAfter.x - kfBefore.x) * eased,
    y: kfBefore.y + (kfAfter.y - kfBefore.y) * eased,
    zoom: kfBefore.zoom + (kfAfter.zoom - kfBefore.zoom) * eased,
  };
};

// ---- CameraPath Component ----

export const CameraPath: React.FC<CameraPathProps> = ({
  children,
  path,
  x = 0,
  y = 0,
  zoom = 1,
  sceneStart,
  sceneEnd,
  previousX = 0,
  previousY = 0,
  previousZoom = 1,
  characterPositions = [],
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const frameInScene = frame - sceneStart;

  // Entry transition (smooth from previous scene's camera)
  const entryDuration = 28;
  const entryProgress = interpolate(
    frameInScene,
    [0, entryDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  let targetX: number;
  let targetY: number;
  let targetZoom: number;

  if (path && path.keyframes.length > 0) {
    // Use keyframe-based path
    const kfResult = interpolateKeyframes(path.keyframes, frameInScene);
    targetX = kfResult.x;
    targetY = kfResult.y;
    targetZoom = kfResult.zoom;

    // Apply character tracking offset
    if (path.trackCharacter && characterPositions.length > 0) {
      const tracked = characterPositions.find(c => c.id === path.trackCharacter);
      if (tracked) {
        const centerX = width / 2;
        const centerY = height / 2;
        const offsetX = (tracked.x - centerX) * 0.3;
        const offsetY = (tracked.y - centerY) * 0.3;
        targetX += offsetX + (path.trackOffsetX ?? 0);
        targetY += offsetY + (path.trackOffsetY ?? 0);
      }
    }
  } else {
    // Fallback: static camera position
    targetX = x;
    targetY = y;
    targetZoom = zoom;
  }

  // Blend from previous camera during entry
  const currentX = previousX + (targetX - previousX) * entryProgress;
  const currentY = previousY + (targetY - previousY) * entryProgress;
  const currentZoom = previousZoom + (targetZoom - previousZoom) * entryProgress;

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          transform: `translate(${centerX}px, ${centerY}px) scale(${currentZoom}) translate(${-centerX - currentX}px, ${-centerY - currentY}px)`,
          transformOrigin: '0 0',
          width,
          height,
          position: 'absolute',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---- Helper: suggest camera preset for beat type ----

export const suggestCameraPreset = (
  beatType: string,
  sceneIndex: number,
): CameraPreset => {
  switch (beatType) {
    case 'intro':
      return 'establishingShot';
    case 'hook':
      return sceneIndex % 2 === 0 ? 'slowZoomIn' : 'panLeftToRight';
    case 'explain':
      return sceneIndex % 3 === 0 ? 'tiltDown' : sceneIndex % 3 === 1 ? 'slowZoomIn' : 'panRightToLeft';
    case 'example':
      return sceneIndex % 2 === 0 ? 'sweepingPan' : 'panLeftToRight';
    case 'revelation':
      return 'dramaticZoom';
    case 'recap':
      return 'slowZoomOut';
    case 'outro':
      return 'slowZoomOut';
    default:
      return 'slowZoomIn';
  }
};

export default CameraPath;
