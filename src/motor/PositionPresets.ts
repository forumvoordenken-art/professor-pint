/**
 * PositionPresets — Phase 0.5
 *
 * Pre-defined positions on the 1920x1080 canvas.
 * The LLM picks a preset name (e.g. "center_front") instead of raw x/y coordinates.
 *
 * Layout:
 *   BACK row  (y ~350, scale 0.6)  — far away, small characters/objects
 *   MID row   (y ~500, scale 1.0)  — medium distance, normal size
 *   FRONT row (y ~650, scale 1.5)  — close up, large characters/objects
 *
 * Each row has 5 horizontal positions: far_left, left, center, right, far_right.
 * Total: 15 base presets + special positions.
 */

// ---- Types ----

export interface PositionPreset {
  x: number;
  y: number;
  scale: number;
  /** Human-readable description for the LLM prompt */
  description: string;
}

export interface ResolvedPosition {
  x: number;
  y: number;
  scale: number;
}

// ---- Canvas constants ----

const CANVAS_W = 1920;
const CANVAS_H = 1080;

// Horizontal positions (x)
const X_FAR_LEFT = CANVAS_W * 0.1;   // 192
const X_LEFT = CANVAS_W * 0.25;      // 480
const X_CENTER = CANVAS_W * 0.5;     // 960
const X_RIGHT = CANVAS_W * 0.75;     // 1440
const X_FAR_RIGHT = CANVAS_W * 0.9;  // 1728

// Depth rows (y + scale)
const BACK = { y: CANVAS_H * 0.35, scale: 0.6 };
const MID = { y: CANVAS_H * 0.5, scale: 1.0 };
const FRONT = { y: CANVAS_H * 0.65, scale: 1.5 };

// ---- Preset definitions ----

export const POSITION_PRESETS: Record<string, PositionPreset> = {
  // Back row — far away, small
  far_left_back: { x: X_FAR_LEFT, ...BACK, description: 'Far left, background — small, distant' },
  left_back: { x: X_LEFT, ...BACK, description: 'Left side, background — small, distant' },
  center_back: { x: X_CENTER, ...BACK, description: 'Center, background — small, distant' },
  right_back: { x: X_RIGHT, ...BACK, description: 'Right side, background — small, distant' },
  far_right_back: { x: X_FAR_RIGHT, ...BACK, description: 'Far right, background — small, distant' },

  // Mid row — medium distance
  far_left_mid: { x: X_FAR_LEFT, ...MID, description: 'Far left, middle ground — normal size' },
  left_mid: { x: X_LEFT, ...MID, description: 'Left side, middle ground — normal size' },
  center_mid: { x: X_CENTER, ...MID, description: 'Center, middle ground — normal size, neutral position' },
  right_mid: { x: X_RIGHT, ...MID, description: 'Right side, middle ground — normal size' },
  far_right_mid: { x: X_FAR_RIGHT, ...MID, description: 'Far right, middle ground — normal size' },

  // Front row — close up, large
  far_left_front: { x: X_FAR_LEFT, ...FRONT, description: 'Far left, foreground — large, close up' },
  left_front: { x: X_LEFT, ...FRONT, description: 'Left side, foreground — large, close up' },
  center_front: { x: X_CENTER, ...FRONT, description: 'Center, foreground — large, close up, main speaker position' },
  right_front: { x: X_RIGHT, ...FRONT, description: 'Right side, foreground — large, close up' },
  far_right_front: { x: X_FAR_RIGHT, ...FRONT, description: 'Far right, foreground — large, close up' },

  // Special positions
  podium: {
    x: X_CENTER,
    y: CANVAS_H * 0.55,
    scale: 1.8,
    description: 'Center podium — extra large, for solo presenter (Professor Pint)',
  },
  duo_left: {
    x: CANVAS_W * 0.35,
    y: CANVAS_H * 0.55,
    scale: 1.3,
    description: 'Left side of a two-person conversation',
  },
  duo_right: {
    x: CANVAS_W * 0.65,
    y: CANVAS_H * 0.55,
    scale: 1.3,
    description: 'Right side of a two-person conversation',
  },
};

// ---- Resolver ----

/**
 * Resolves a preset name to x/y/scale coordinates.
 * Optionally adds small random jitter for natural variation.
 *
 * @param presetName — key from POSITION_PRESETS (e.g. "center_front")
 * @param jitter — if true, adds ±30px x, ±15px y, ±5% scale randomness
 * @param seed — optional seed for deterministic jitter (e.g. character index)
 */
export function resolvePosition(
  presetName: string,
  jitter = false,
  seed = 0,
): ResolvedPosition {
  const preset = POSITION_PRESETS[presetName];
  if (!preset) {
    console.warn(`[PositionPresets] Unknown preset: "${presetName}", using center_mid`);
    return resolvePosition('center_mid', jitter, seed);
  }

  if (!jitter) {
    return { x: preset.x, y: preset.y, scale: preset.scale };
  }

  // Seeded pseudo-random for deterministic jitter
  const hash = Math.sin(seed * 9301 + 49297) * 49297;
  const rand = hash - Math.floor(hash); // 0..1

  const hash2 = Math.sin((seed + 1) * 9301 + 49297) * 49297;
  const rand2 = hash2 - Math.floor(hash2);

  const hash3 = Math.sin((seed + 2) * 9301 + 49297) * 49297;
  const rand3 = hash3 - Math.floor(hash3);

  return {
    x: preset.x + (rand - 0.5) * 60,         // ±30px
    y: preset.y + (rand2 - 0.5) * 30,         // ±15px
    scale: preset.scale * (1 + (rand3 - 0.5) * 0.1), // ±5%
  };
}

/**
 * Returns all preset names and descriptions — used to build the LLM prompt
 * so the LLM knows which positions are available.
 */
export function getPresetManifest(): Array<{ name: string; description: string }> {
  return Object.entries(POSITION_PRESETS).map(([name, preset]) => ({
    name,
    description: preset.description,
  }));
}
