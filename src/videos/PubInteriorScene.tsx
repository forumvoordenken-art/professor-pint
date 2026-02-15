/**
 * PubInteriorScene — Warm pub interior (Scene 2: Hook)
 *
 * Full-scene SVG from vectorizer.ai, used as single background.
 * Procedural animation overlays for atmosphere (warm light, dust, lantern flicker).
 * Professor Pint is baked into the SVG for now — will be replaced with Rive later.
 *
 * Script (Scene 2, 0:08 - 0:25):
 *   "Grab a pint and sit down, because today I'm going to show you something
 *    that's in your pocket right now, and you have absolutely no idea how
 *    insane its history is."
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile, interpolate } from 'remotion';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const PUB_INTERIOR_FRAMES = 510; // 17 seconds @ 30fps (scene 2 + 3)

const W = 1920;
const H = 1080;

// ---------------------------------------------------------------------------
// Asset
// ---------------------------------------------------------------------------

const BG_SRC = 'assets/scenes/pub-interior-full.svg';

const LAYER_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

// ---------------------------------------------------------------------------
// Anchor points (pub interior landmarks — tune after first render)
// ---------------------------------------------------------------------------

const ANCHORS = {
  // Ceiling lanterns (warm light sources)
  lanternLeft: { x: W * 0.28, y: H * 0.18 },
  lanternCenter: { x: W * 0.48, y: H * 0.15 },
  lanternRight: { x: W * 0.68, y: H * 0.18 },

  // Bar counter top (for light reflection)
  barCenter: { x: W * 0.45, y: H * 0.52 },

  // Window (if any light comes from outside)
  windowLeft: { x: W * 0.12, y: H * 0.35 },

  // Professor Pint position (for spotlight)
  professor: { x: W * 0.38, y: H * 0.55 },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const sin = (frame: number, freq: number, phase = 0): number =>
  Math.sin(frame * freq * Math.PI * 2 + phase);

// ---------------------------------------------------------------------------
// Pre-generated particles
// ---------------------------------------------------------------------------

interface Particle {
  x: number; y: number; size: number; speed: number; opacity: number; phase: number;
}

const makeParticles = (
  count: number, seed: number,
  bounds: { x1: number; y1: number; x2: number; y2: number },
): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    x: bounds.x1 + rand(seed + i * 1.1) * (bounds.x2 - bounds.x1),
    y: bounds.y1 + rand(seed + i * 2.3) * (bounds.y2 - bounds.y1),
    size: 1 + rand(seed + i * 3.7) * 3,
    speed: 0.15 + rand(seed + i * 4.1) * 0.6,
    opacity: 0.1 + rand(seed + i * 5.9) * 0.3,
    phase: rand(seed + i * 6.3) * Math.PI * 2,
  }));

// Dust motes floating in lantern light
const dustCenter = makeParticles(20, 50, {
  x1: W * 0.15, y1: H * 0.10,
  x2: W * 0.75, y2: H * 0.55,
});

// ---------------------------------------------------------------------------
// Animation overlays
// ---------------------------------------------------------------------------

/** Warm lantern glow — creates ambient light pools on ceiling/bar */
const LanternGlow: React.FC<{ frame: number; cx: number; cy: number; id: string }> = ({ frame, cx, cy, id }) => {
  const f = 0.85 + sin(frame, 0.035, 0.5) * 0.06 + sin(frame, 0.08, 2.0) * 0.04 + sin(frame, 0.15, 3.5) * 0.03;
  const r = 140 + sin(frame, 0.03, 1.0) * 15;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id={`lg-int-${id}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFE0A0" stopOpacity={0.35 * f} />
          <stop offset="30%" stopColor="#FFD060" stopOpacity={0.18 * f} />
          <stop offset="65%" stopColor="#FFAA33" stopOpacity={0.06 * f} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.5} fill={`url(#lg-int-${id})`} />
    </svg>
  );
};

/** Bar counter light reflection */
const BarReflection: React.FC<{ frame: number }> = ({ frame }) => {
  const f = 0.9 + sin(frame, 0.04, 0.8) * 0.05 + sin(frame, 0.11, 2.1) * 0.03;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id="bar-refl" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity={0.15 * f} />
          <stop offset="50%" stopColor="#FFAA30" stopOpacity={0.06 * f} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={ANCHORS.barCenter.x} cy={ANCHORS.barCenter.y} rx={400} ry={80} fill="url(#bar-refl)" />
    </svg>
  );
};

/** Floating dust motes in warm light */
const DustMotes: React.FC<{ frame: number }> = ({ frame }) => (
  <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
    {dustCenter.map((p, i) => {
      const t = frame * 0.015 * p.speed;
      const px = p.x + Math.sin(t + p.phase) * 30;
      const py = p.y + Math.cos(t * 0.7 + p.phase) * 20 - frame * p.speed * 0.08;
      // Wrap vertically
      const wy = ((py % (H * 0.5)) + H * 0.5) % (H * 0.5) + H * 0.05;
      const o = p.opacity * (0.5 + sin(frame, p.speed * 0.02, p.phase) * 0.5);
      return <circle key={`dust-${i}`} cx={px} cy={wy} r={p.size} fill="#FFD080" opacity={Math.max(0, o)} />;
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const PubInteriorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Subtle slow zoom in towards Professor Pint
  const zoom = interpolate(frame, [0, PUB_INTERIOR_FRAMES], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });
  const panX = interpolate(frame, [0, PUB_INTERIOR_FRAMES], [0, -15], {
    extrapolateRight: 'clamp',
  });
  const panY = interpolate(frame, [0, PUB_INTERIOR_FRAMES], [0, -8], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0608' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>

        {/* Camera movement wrapper */}
        <AbsoluteFill style={{
          transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
          transformOrigin: '38% 55%', // Towards professor
        }}>

          {/* ─── Background scene ─── */}
          <AbsoluteFill style={{ zIndex: 0 }}>
            <Img
              src={staticFile(BG_SRC)}
              style={{ ...LAYER_STYLE, objectFit: 'cover' as const }}
            />
          </AbsoluteFill>

          {/* ─── Lantern glow (3 lanterns) ─── */}
          <AbsoluteFill style={{ zIndex: 3, mixBlendMode: 'screen' }}>
            <LanternGlow frame={frame} cx={ANCHORS.lanternLeft.x} cy={ANCHORS.lanternLeft.y} id="left" />
            <LanternGlow frame={frame} cx={ANCHORS.lanternCenter.x} cy={ANCHORS.lanternCenter.y} id="center" />
            <LanternGlow frame={frame} cx={ANCHORS.lanternRight.x} cy={ANCHORS.lanternRight.y} id="right" />
          </AbsoluteFill>

          {/* ─── Bar counter reflection ─── */}
          <AbsoluteFill style={{ zIndex: 4, mixBlendMode: 'screen' }}>
            <BarReflection frame={frame} />
          </AbsoluteFill>

          {/* ─── Dust motes ─── */}
          <AbsoluteFill style={{ zIndex: 5, mixBlendMode: 'screen', opacity: 0.6 }}>
            <DustMotes frame={frame} />
          </AbsoluteFill>

        </AbsoluteFill>

        {/* ─── Vignette (outside camera movement so it doesn't shift) ─── */}
        <AbsoluteFill style={{ zIndex: 10 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 65% 60% at 40% 50%, transparent 40%, rgba(8,4,6,0.7) 100%)',
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>

        {/* ─── Warm color grade ─── */}
        <AbsoluteFill style={{
          zIndex: 11,
          backgroundColor: 'rgba(255, 160, 80, 0.06)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }} />

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default PubInteriorScene;
