/**
 * RiveIntegration — Rive + Remotion Character Bridge
 *
 * Provides the integration layer between Rive state machines
 * (for characters) and the Remotion rendering pipeline.
 *
 * WHY Rive:
 * - Characters with complex state machines (emotions, talking, gestures)
 *   are better handled by Rive's native state machine engine
 * - Rive animations are artist-friendly (designed in the Rive editor)
 * - @remotion/rive provides frame-perfect Rive-to-Remotion sync
 * - SVG environments + Rive characters = best of both worlds
 *
 * SETUP REQUIRED:
 * 1. Install: npm install @remotion/rive @rive-app/canvas
 * 2. Create .riv files in the Rive editor (rive.app)
 * 3. Place .riv files in src/assets/rive/
 * 4. Use RiveCharacter component in scenes
 *
 * This file provides:
 * - Type definitions for Rive character integration
 * - RiveCharacter wrapper component (placeholder until @remotion/rive installed)
 * - State machine input helpers for emotion/talking/activity control
 * - Documentation for the Rive ↔ Remotion workflow
 *
 * WORKFLOW (unchanged for the user):
 * 1. User describes what they want (emotion, activity)
 * 2. We configure the RiveCharacter props
 * 3. Remotion renders it frame-by-frame
 * The user never touches Rive files directly.
 */

import React from 'react';

// ─── Types ───────────────────────────────────────────────

/** Rive state machine inputs that control character behavior */
export interface RiveCharacterInputs {
  /** Current emotion (maps to Rive state machine states) */
  emotion: string;
  /** Whether the character is talking (triggers mouth animation) */
  talking: boolean;
  /** Current activity/gesture (optional) */
  activity?: string;
  /** Blink trigger (fire periodically for natural blinking) */
  blink?: boolean;
  /** Breath cycle (0-1, drives idle animation) */
  breathCycle?: number;
}

/** Props for the RiveCharacter wrapper */
export interface RiveCharacterProps {
  /** Path to the .riv file (relative to public/) */
  src: string;
  /** Name of the artboard in the .riv file */
  artboard?: string;
  /** Name of the state machine to use */
  stateMachine?: string;
  /** State machine inputs */
  inputs: RiveCharacterInputs;
  /** Position and scale */
  x?: number;
  y?: number;
  scale?: number;
  /** Mirror horizontally */
  mirror?: boolean;
  /** Width/height of the Rive canvas */
  width?: number;
  height?: number;
}

// ─── Rive Character Component ────────────────────────────

/**
 * Placeholder component for Rive character rendering.
 *
 * Once @remotion/rive is installed, this will use:
 *   import { RemotionRiveCanvas } from '@remotion/rive';
 *
 * For now, it renders a labeled placeholder box so the scene
 * composition system works without the Rive dependency.
 *
 * To activate Rive rendering:
 * 1. Run: npm install @remotion/rive @rive-app/canvas
 * 2. Replace the placeholder below with RemotionRiveCanvas
 * 3. Map inputs to Rive state machine inputs
 */
export const RiveCharacter: React.FC<RiveCharacterProps> = ({
  src,
  inputs,
  x = 0,
  y = 0,
  scale = 1,
  mirror = false,
  width = 300,
  height = 400,
}) => {
  // TODO: Replace with actual Rive rendering when @remotion/rive is installed
  //
  // import { RemotionRiveCanvas } from '@remotion/rive';
  //
  // return (
  //   <RemotionRiveCanvas
  //     src={src}
  //     artboard={artboard}
  //     stateMachine={stateMachine}
  //     inputValues={{
  //       emotion: inputs.emotion,
  //       isTalking: inputs.talking,
  //       activity: inputs.activity ?? '',
  //       blink: inputs.blink ?? false,
  //       breathCycle: inputs.breathCycle ?? 0,
  //     }}
  //     style={{
  //       position: 'absolute',
  //       left: x,
  //       top: y,
  //       width: width * scale,
  //       height: height * scale,
  //       transform: mirror ? 'scaleX(-1)' : undefined,
  //     }}
  //   />
  // );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width * scale,
        height: height * scale,
        transform: mirror ? 'scaleX(-1)' : undefined,
        transformOrigin: 'center top',
        border: '2px dashed rgba(139, 92, 246, 0.4)',
        borderRadius: 8,
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(139, 92, 246, 0.6)',
        fontSize: 11,
        fontFamily: 'monospace',
        lineHeight: 1.4,
        textAlign: 'center',
        padding: 8,
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 13 }}>RIVE</div>
      <div>{src.split('/').pop()}</div>
      <div style={{ marginTop: 4, fontSize: 10 }}>
        {inputs.emotion}
        {inputs.talking ? ' (talking)' : ''}
        {inputs.activity ? ` [${inputs.activity}]` : ''}
      </div>
    </div>
  );
};

// ─── Helper: Map emotion names to Rive state names ──────

/**
 * Maps our Emotion type strings to Rive state machine state names.
 * Customize this mapping per character .riv file.
 *
 * In Rive, each emotion is a state in the state machine.
 * Transitions between states are handled by Rive's state machine engine.
 */
export const DEFAULT_EMOTION_MAP: Record<string, string> = {
  neutral: 'Idle',
  happy: 'Happy',
  shocked: 'Shocked',
  thinking: 'Thinking',
  angry: 'Angry',
  sad: 'Sad',
  excited: 'Excited',
  confused: 'Confused',
  proud: 'Proud',
  whisper: 'Whisper',
  dramatic: 'Dramatic',
  skeptical: 'Skeptical',
};

// ─── Helper: Generate blink triggers at natural intervals ─

/**
 * Generates natural-looking blink events based on frame number.
 * Average human blinks every 3-4 seconds (90-120 frames at 30fps).
 * Uses longCycleNoise for non-periodic timing.
 *
 * @param frame Current frame number
 * @param seed Per-character seed for unique blink timing
 * @returns true if the character should blink this frame
 */
export function shouldBlink(frame: number, seed: number = 0): boolean {
  // Use a simple threshold on a fast noise channel
  const PHI = 1.6180339887;
  const noise = Math.sin(frame * 0.033 * PHI + seed) * 0.5 +
    Math.sin(frame * 0.021 * 1.4142 + seed * 1.3) * 0.3 +
    Math.sin(frame * 0.089 + seed * 0.7) * 0.2;

  // Blink when noise crosses above 0.95 (roughly every 3-5 seconds)
  return noise > 0.95;
}

/**
 * Generates a smooth breath cycle (0-1) for idle animation.
 * Completes one full breath every ~4 seconds at 30fps.
 */
export function breathCycle(frame: number, seed: number = 0): number {
  const PHI = 1.6180339887;
  // Smooth sine-based breathing with slight variation
  const base = Math.sin(frame * 0.026 * PHI + seed) * 0.5 + 0.5;
  const variation = Math.sin(frame * 0.011 + seed * 2.1) * 0.08;
  return Math.max(0, Math.min(1, base + variation));
}
