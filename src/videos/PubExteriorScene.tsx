/**
 * PubExteriorScene — Night pub exterior (v3 — code-based assets)
 *
 * Uses inline React/SVG components instead of external SVG files + metadata.
 * No metadata system needed — positions are hardcoded per scene.
 *
 * Layers (back → front):
 *  1. Sky (NightSkyPub — gradient, moon, stars, clouds)
 *  2. Terrain (CobblestoneStreet — bottom 45%)
 *  3. Pub building (PubBuilding — center, 60% width)
 *  4. Window light glow (screen blend)
 *  5. Street lamps (VictorianLamp × 2, left + right)
 *  6. Lamp glow halos (screen blend)
 *  7. Dust motes in lamp light
 *  8. Ground fog
 *  9. Vignette
 * 10. Color grade
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { NightSkyPub } from '../assets/skies/NightSkyPub';
import { CobblestoneStreet } from '../assets/terrain/CobblestoneStreet';
import { PubBuilding } from '../assets/structures/PubBuilding';
import { VictorianLamp } from '../assets/props/VictorianLamp';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const PUB_EXTERIOR_FRAMES = 300; // 10 seconds @ 30fps

const CANVAS_W = 1920;
const CANVAS_H = 1080;

// Layout constants (hardcoded for this scene)
const TERRAIN_TOP = 0.58;           // Terrain starts at 58% from top
const PUB_WIDTH_FRAC = 0.52;       // Pub is 52% of canvas width
const PUB_HEIGHT_FRAC = 0.72;      // Pub is 72% of canvas height
const PUB_BOTTOM = 0.97;           // Pub bottom at 97%
const LAMP_HEIGHT_FRAC = 0.52;     // Lamp is 52% of canvas height
const LAMP_WIDTH_FRAC = 0.065;     // Lamp is 6.5% of canvas width
const LAMP_BOTTOM = 0.97;          // Same ground line as pub
const LAMP_LEFT_X = 0.12;          // Left lamp at 12%
const LAMP_RIGHT_X = 0.88;         // Right lamp at 88%

// Derived pixel positions
const terrainY = CANVAS_H * TERRAIN_TOP;
const terrainH = CANVAS_H - terrainY;

const pubW = CANVAS_W * PUB_WIDTH_FRAC;
const pubH = CANVAS_H * PUB_HEIGHT_FRAC;
const pubX = (CANVAS_W - pubW) / 2;
const pubY = CANVAS_H * PUB_BOTTOM - pubH;

const lampW = CANVAS_W * LAMP_WIDTH_FRAC;
const lampH = CANVAS_H * LAMP_HEIGHT_FRAC;
const lampLeftX = CANVAS_W * LAMP_LEFT_X - lampW / 2;
const lampRightX = CANVAS_W * LAMP_RIGHT_X - lampW / 2;
const lampY = CANVAS_H * LAMP_BOTTOM - lampH;

// Glow centers (near top of lamps)
const lampLeftGlowCX = lampLeftX + lampW / 2;
const lampLeftGlowCY = lampY + lampH * 0.15;
const lampRightGlowCX = lampRightX + lampW / 2;
const lampRightGlowCY = lampY + lampH * 0.15;

// Pub center for window light
const pubCenterX = pubX + pubW / 2;
const pubCenterY = pubY + pubH * 0.5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const sineWave = (frame: number, frequency: number, phase = 0): number =>
  Math.sin(frame * frequency * Math.PI * 2 + phase);

// ---------------------------------------------------------------------------
// Pre-generated particles
// ---------------------------------------------------------------------------

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

const makeParticles = (
  count: number,
  seed: number,
  bounds: { x1: number; y1: number; x2: number; y2: number },
): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    x: bounds.x1 + rand(seed + i * 1.1) * (bounds.x2 - bounds.x1),
    y: bounds.y1 + rand(seed + i * 2.3) * (bounds.y2 - bounds.y1),
    size: 1.5 + rand(seed + i * 3.7) * 4,
    speed: 0.2 + rand(seed + i * 4.1) * 0.8,
    opacity: 0.15 + rand(seed + i * 5.9) * 0.45,
    phase: rand(seed + i * 6.3) * Math.PI * 2,
  }));

// Dust motes near lamps
const dustLeft = makeParticles(15, 10, {
  x1: lampLeftGlowCX - 80,
  y1: lampLeftGlowCY - 20,
  x2: lampLeftGlowCX + 80,
  y2: lampLeftGlowCY + 250,
});

const dustRight = makeParticles(15, 20, {
  x1: lampRightGlowCX - 80,
  y1: lampRightGlowCY - 20,
  x2: lampRightGlowCX + 80,
  y2: lampRightGlowCY + 250,
});

// Ground fog
const fogParticles = makeParticles(25, 30, {
  x1: 0,
  y1: CANVAS_H * 0.78,
  x2: CANVAS_W,
  y2: CANVAS_H,
});

// ---------------------------------------------------------------------------
// Sub-components (scene-level effects)
// ---------------------------------------------------------------------------

/** Large glow halo around lamp tops */
const LampGlow: React.FC<{ frame: number; cx: number; cy: number; id: string }> = ({
  frame, cx, cy, id,
}) => {
  const flicker =
    0.85 +
    sineWave(frame, 0.03, 0) * 0.06 +
    sineWave(frame, 0.07, 1.3) * 0.04 +
    sineWave(frame, 0.13, 2.7) * 0.03;
  const radius = 120 + sineWave(frame, 0.025, 0.5) * 15;

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
    >
      <defs>
        <radialGradient id={`lamp-glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD580" stopOpacity={0.55 * flicker} />
          <stop offset="30%" stopColor="#FFAA33" stopOpacity={0.25 * flicker} />
          <stop offset="70%" stopColor="#FF8800" stopOpacity={0.08 * flicker} />
          <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={radius} ry={radius * 1.3} fill={`url(#lamp-glow-${id})`} />
    </svg>
  );
};

/** Warm light spilling from pub windows onto ground */
const WindowLight: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker =
    0.9 +
    sineWave(frame, 0.04, 0.8) * 0.05 +
    sineWave(frame, 0.11, 2.1) * 0.03;

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
    >
      <defs>
        <radialGradient id="window-light-v3" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity={0.3 * flicker} />
          <stop offset="50%" stopColor="#FFAA30" stopOpacity={0.12 * flicker} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Glow around pub facade */}
      <ellipse cx={pubCenterX} cy={pubCenterY + 50} rx={280} ry={200} fill="url(#window-light-v3)" />
      {/* Light spill on the ground */}
      <ellipse
        cx={pubCenterX}
        cy={CANVAS_H * 0.88}
        rx={320}
        ry={70}
        fill="#FFD060"
        opacity={0.1 * flicker}
      />
    </svg>
  );
};

/** Animated dust motes floating in lamp light */
const DustMotes: React.FC<{ frame: number; particles: Particle[]; id: string }> = ({
  frame, particles, id,
}) => (
  <svg
    viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
    style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
  >
    {particles.map((p, i) => {
      const t = frame * 0.02 * p.speed;
      const px = p.x + Math.sin(t + p.phase) * 25;
      const py = p.y + Math.cos(t * 0.7 + p.phase) * 15 - frame * p.speed * 0.15;
      const wrappedY = ((py % 300) + 300) % 300 + p.y - 80;
      const opacity = p.opacity * (0.6 + sineWave(frame, p.speed * 0.02, p.phase) * 0.4);
      return (
        <circle
          key={`${id}-${i}`}
          cx={px}
          cy={wrappedY}
          r={p.size}
          fill="#FFD080"
          opacity={Math.max(0, opacity)}
        />
      );
    })}
  </svg>
);

/** Drifting ground fog */
const GroundFog: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
    style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
  >
    {fogParticles.map((p, i) => {
      const drift = frame * 0.3 * p.speed;
      const px = ((p.x + drift) % (CANVAS_W + 100)) - 50;
      const py = p.y + sineWave(frame, 0.01, p.phase) * 8;
      const opacity = p.opacity * 0.35 * (0.5 + sineWave(frame, 0.015, p.phase) * 0.5);
      return (
        <ellipse
          key={`fog-${i}`}
          cx={px}
          cy={py}
          rx={p.size * 18}
          ry={p.size * 5}
          fill="#9888A8"
          opacity={Math.max(0, opacity)}
        />
      );
    })}
  </svg>
);

/** Dark vignette overlay */
const Vignette: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(8,4,16,0.6) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const PubExteriorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0e1a' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>

        {/* Layer 1: Night sky (full background — stars, moon, clouds) */}
        <AbsoluteFill style={{ zIndex: 1 }}>
          <NightSkyPub frame={frame} />
        </AbsoluteFill>

        {/* Layer 2: Cobblestone street (bottom portion) */}
        <AbsoluteFill style={{ zIndex: 2 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: terrainY,
              width: CANVAS_W,
              height: terrainH,
            }}
          >
            <CobblestoneStreet frame={frame} width={CANVAS_W} height={terrainH} />
          </div>
        </AbsoluteFill>

        {/* Layer 3: Horizon blend (soften sky→terrain transition) */}
        <AbsoluteFill style={{ zIndex: 3 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: terrainY - 60,
              height: 120,
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(30,28,50,0.6) 40%, rgba(42,45,53,0.8) 70%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>

        {/* Layer 4: Pub building (center) */}
        <AbsoluteFill style={{ zIndex: 4 }}>
          <div
            style={{
              position: 'absolute',
              left: pubX,
              top: pubY,
              width: pubW,
              height: pubH,
            }}
          >
            <PubBuilding frame={frame} />
          </div>
        </AbsoluteFill>

        {/* Layer 5: Window light glow */}
        <AbsoluteFill style={{ zIndex: 5, mixBlendMode: 'screen' }}>
          <WindowLight frame={frame} />
        </AbsoluteFill>

        {/* Layer 6: Street lamp LEFT */}
        <AbsoluteFill style={{ zIndex: 6 }}>
          <div
            style={{
              position: 'absolute',
              left: lampLeftX,
              top: lampY,
              width: lampW,
              height: lampH,
            }}
          >
            <VictorianLamp frame={frame} />
          </div>
        </AbsoluteFill>

        {/* Layer 7: Street lamp RIGHT (mirrored) */}
        <AbsoluteFill style={{ zIndex: 7 }}>
          <div
            style={{
              position: 'absolute',
              left: lampRightX,
              top: lampY,
              width: lampW,
              height: lampH,
              transform: 'scaleX(-1)',
            }}
          >
            <VictorianLamp frame={frame} />
          </div>
        </AbsoluteFill>

        {/* Layer 8: Lamp glow halos */}
        <AbsoluteFill style={{ zIndex: 8, mixBlendMode: 'screen' }}>
          <LampGlow frame={frame} cx={lampLeftGlowCX} cy={lampLeftGlowCY} id="left" />
          <LampGlow frame={frame} cx={lampRightGlowCX} cy={lampRightGlowCY} id="right" />
        </AbsoluteFill>

        {/* Layer 9: Dust motes */}
        <AbsoluteFill style={{ zIndex: 9, mixBlendMode: 'screen', opacity: 0.7 }}>
          <DustMotes frame={frame} particles={dustLeft} id="dust-l" />
          <DustMotes frame={frame} particles={dustRight} id="dust-r" />
        </AbsoluteFill>

        {/* Layer 10: Ground fog */}
        <AbsoluteFill style={{ zIndex: 10, opacity: 0.5 }}>
          <GroundFog frame={frame} />
        </AbsoluteFill>

        {/* Layer 11: Vignette */}
        <AbsoluteFill style={{ zIndex: 11 }}>
          <Vignette />
        </AbsoluteFill>

        {/* Layer 12: Color grade (warm tint) */}
        <AbsoluteFill
          style={{
            zIndex: 12,
            backgroundColor: 'rgba(255, 180, 100, 0.05)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />

      </AbsoluteFill>

      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20,
          opacity: interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#FFD080',
            padding: '10px 30px',
            borderRadius: 8,
            fontSize: 32,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          Professor Pint&apos;s Pub
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default PubExteriorScene;
