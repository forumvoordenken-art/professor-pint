/**
 * HistoryOfMoney — Main composition for Video 001
 *
 * Sequences all scenes with transitions.
 * Currently: Scene 1 (Pub Exterior) → Door Transition → Scene 2 (Pub Interior)
 *
 * The door transition:
 *   1. Zoom into the pub door (last ~60 frames of exterior)
 *   2. Black barn-door closes from left+right toward the door center
 *   3. Full black hold
 *   4. Black opens to reveal interior
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { PubExteriorScene } from './PubExteriorScene';
import { PubInteriorScene } from './PubInteriorScene';

// ---------------------------------------------------------------------------
// Timing (all in frames @ 30fps)
// ---------------------------------------------------------------------------

/** Scene 1: Pub exterior establishing (10 sec) */
const SCENE1_DURATION = 300;

/** Transition: zoom + barn-door close + black hold + open (3 sec) */
const TRANSITION_DURATION = 90;

/** Scene 2: Pub interior hook (17 sec) */
const SCENE2_DURATION = 510;

/** Total */
export const HISTORY_OF_MONEY_FRAMES = SCENE1_DURATION + TRANSITION_DURATION + SCENE2_DURATION;

// ---------------------------------------------------------------------------
// Door position in Scene 1 (fraction of 1920x1080 canvas)
// The pub door is roughly center of the building
// ---------------------------------------------------------------------------

const DOOR = {
  x: 0.46,   // horizontal center of door
  y: 0.58,   // vertical center of door
};

// ---------------------------------------------------------------------------
// DoorTransition — the zoom + barn-door iris effect
// ---------------------------------------------------------------------------

/**
 * Phases of the transition (within TRANSITION_DURATION = 90 frames):
 *
 * Phase 1 (0-40):  Zoom into the door on the exterior scene.
 *                   Simultaneously, black bars close from left+right.
 * Phase 2 (40-55): Full black. Silence. Anticipation.
 * Phase 3 (55-90): Black bars open to reveal the interior.
 */
const DoorTransition: React.FC = () => {
  const globalFrame = useCurrentFrame();

  // Phase boundaries
  const CLOSE_END = 40;     // barn door fully closed
  const BLACK_END = 55;     // black hold ends
  const OPEN_END = 90;      // interior fully revealed

  // ── Phase 1: Zoom on exterior + barn door closing ──

  // Zoom factor: 1.0 → 2.8 (zooms into the door)
  const zoom = interpolate(globalFrame, [0, CLOSE_END], [1.0, 2.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Pan toward door center (translate so door stays centered during zoom)
  const panX = interpolate(globalFrame, [0, CLOSE_END], [0, -(DOOR.x - 0.5) * 1920 * 1.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(globalFrame, [0, CLOSE_END], [0, -(DOOR.y - 0.5) * 1080 * 1.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Barn door: black bars from sides. 0 = fully open, 50 = bars meet at center
  const barnClose = interpolate(globalFrame, [5, CLOSE_END], [0, 50], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  // ── Phase 3: Interior reveal ──
  // Barn door opens: 50 → 0 (bars slide away)
  const barnOpen = interpolate(globalFrame, [BLACK_END, OPEN_END], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Which phase are we in?
  const isBlack = globalFrame >= CLOSE_END && globalFrame < BLACK_END;
  const isOpening = globalFrame >= BLACK_END;
  const barnDoorPercent = isOpening ? barnOpen : barnClose;

  // Show exterior during close, interior during open
  const showExterior = globalFrame < BLACK_END;
  const showInterior = globalFrame >= BLACK_END;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>

      {/* ── Exterior (zooming into door) ── */}
      {showExterior && !isBlack && (
        <AbsoluteFill style={{
          transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
          transformOrigin: `${DOOR.x * 100}% ${DOOR.y * 100}%`,
        }}>
          {/* Re-render the exterior scene at its final frame */}
          <PubExteriorScene />
        </AbsoluteFill>
      )}

      {/* ── Interior (revealed by opening barn doors) ── */}
      {showInterior && barnDoorPercent < 50 && (
        <AbsoluteFill>
          <PubInteriorScene />
        </AbsoluteFill>
      )}

      {/* ── Barn door: black bars from left and right ── */}
      {barnDoorPercent > 0 && (
        <>
          {/* Left bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${barnDoorPercent}%`,
            height: '100%',
            backgroundColor: '#000000',
            zIndex: 20,
          }} />
          {/* Right bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: `${barnDoorPercent}%`,
            height: '100%',
            backgroundColor: '#000000',
            zIndex: 20,
          }} />
        </>
      )}

      {/* ── Full black hold ── */}
      {isBlack && (
        <AbsoluteFill style={{ backgroundColor: '#000000', zIndex: 25 }} />
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const HistoryOfMoney: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Pub Exterior (0:00 - 10:00) */}
      <Sequence from={0} durationInFrames={SCENE1_DURATION}>
        <PubExteriorScene />
      </Sequence>

      {/* Transition: Door zoom + barn door close/open (10:00 - 13:00) */}
      <Sequence from={SCENE1_DURATION} durationInFrames={TRANSITION_DURATION}>
        <DoorTransition />
      </Sequence>

      {/* Scene 2: Pub Interior (13:00 - 30:00) */}
      <Sequence from={SCENE1_DURATION + TRANSITION_DURATION} durationInFrames={SCENE2_DURATION}>
        <PubInteriorScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default HistoryOfMoney;
