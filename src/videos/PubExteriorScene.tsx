/**
 * PubExteriorScene — Night pub exterior (v4 — user-designed SVG assets)
 *
 * Uses external SVG assets designed by the user (ChatGPT + vectorizer.ai)
 * with code-based animation overlays (glows, stars, fog, particles).
 *
 * Assets (public/assets/):
 *  - sky/sky-night.svg        (1536×1024, landscape)
 *  - terrain/terrain-street.svg (1536×1024, landscape)
 *  - structures/struct-pub.svg  (1024×1536, portrait)
 *  - props/prop-lamp.svg       (1024×1536, portrait)
 *  - props/prop-moon.svg       (1024×1024, square)
 *
 * Layers (back → front):
 *  1. Sky background
 *  2. Moon + moon glow
 *  3. Twinkling stars overlay
 *  4. Terrain (bottom portion)
 *  5. Horizon blend
 *  6. Pub building (center)
 *  7. Window light glow
 *  8. Street lamps (left + right mirrored)
 *  9. Lamp glow halos
 * 10. Dust motes
 * 11. Ground fog
 * 12. Vignette
 * 13. Color grade
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile, interpolate } from 'remotion';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const PUB_EXTERIOR_FRAMES = 300; // 10 seconds @ 30fps

const W = 1920;
const H = 1080;

// ---------------------------------------------------------------------------
// Layout — all sizing derived from category + aspect ratio
// No metadata system needed. Tweak these constants to adjust.
// ---------------------------------------------------------------------------

// Sky: fills entire canvas
const SKY = { x: 0, y: 0, w: W, h: H };

// Moon: upper-right, ~10% of canvas width (zoals eerst — dit was goed)
const MOON_SIZE = W * 0.10;
const MOON = { x: W * 0.82, y: H * 0.05, w: MOON_SIZE, h: MOON_SIZE };

// Terrain: bottom ~50%, full width (meer zichtbaar)
const TERRAIN_TOP = H * 0.50;
const TERRAIN = { x: 0, y: TERRAIN_TOP, w: W, h: H - TERRAIN_TOP };

// Pub: center, height ~90% of canvas, width from aspect ratio (2:3) — VEEL GROTER
const PUB_H = H * 0.90;
const PUB_W = PUB_H * (1024 / 1536);
const PUB = {
  x: (W - PUB_W) / 2,
  y: H * 0.94 - PUB_H, // bottom at 94% (op de grond)
  w: PUB_W,
  h: PUB_H,
};

// Lamps: height ~60% of canvas, width from aspect ratio (2:3) — ook groter
const LAMP_H = H * 0.60;
const LAMP_W = LAMP_H * (1024 / 1536);
const LAMP_BOTTOM = H * 0.94; // zelfde grondlijn als pub
const LAMP_LEFT = {
  x: W * 0.10 - LAMP_W / 2,
  y: LAMP_BOTTOM - LAMP_H,
  w: LAMP_W,
  h: LAMP_H,
};
const LAMP_RIGHT = {
  x: W * 0.90 - LAMP_W / 2,
  y: LAMP_BOTTOM - LAMP_H,
  w: LAMP_W,
  h: LAMP_H,
};

// Glow positions (near top of lamps)
const GLOW_LEFT = { cx: LAMP_LEFT.x + LAMP_W / 2, cy: LAMP_LEFT.y + LAMP_H * 0.12 };
const GLOW_RIGHT = { cx: LAMP_RIGHT.x + LAMP_W / 2, cy: LAMP_RIGHT.y + LAMP_H * 0.12 };

// Pub center (for window light)
const PUB_CENTER = { cx: PUB.x + PUB.w / 2, cy: PUB.y + PUB.h * 0.5 };

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
// Pre-generated particles (deterministic, no per-frame allocation)
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
    size: 1.5 + rand(seed + i * 3.7) * 4,
    speed: 0.2 + rand(seed + i * 4.1) * 0.8,
    opacity: 0.15 + rand(seed + i * 5.9) * 0.45,
    phase: rand(seed + i * 6.3) * Math.PI * 2,
  }));

const dustLeft = makeParticles(15, 10, {
  x1: GLOW_LEFT.cx - 80, y1: GLOW_LEFT.cy - 20,
  x2: GLOW_LEFT.cx + 80, y2: GLOW_LEFT.cy + 250,
});
const dustRight = makeParticles(15, 20, {
  x1: GLOW_RIGHT.cx - 80, y1: GLOW_RIGHT.cy - 20,
  x2: GLOW_RIGHT.cx + 80, y2: GLOW_RIGHT.cy + 250,
});
const fogParticles = makeParticles(25, 30, { x1: 0, y1: H * 0.78, x2: W, y2: H });
const stars = Array.from({ length: 40 }, (_, i) => ({
  cx: 40 + rand(100 + i) * (W - 80),
  cy: 15 + rand(200 + i) * (H * 0.45),
  r: 0.8 + rand(300 + i) * 2.5,
  speed: 0.015 + rand(400 + i) * 0.05,
  phase: rand(500 + i) * Math.PI * 2,
  brightness: 0.4 + rand(600 + i) * 0.6,
}));

// ---------------------------------------------------------------------------
// Animation overlays
// ---------------------------------------------------------------------------

const Stars: React.FC<{ frame: number }> = ({ frame }) => (
  <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
    {stars.map((s, i) => {
      const t = 0.3 + Math.abs(sin(frame, s.speed, s.phase)) * 0.7;
      return <circle key={i} cx={s.cx} cy={s.cy} r={s.r * t} fill="#FFFDE8" opacity={s.brightness * t} />;
    })}
  </svg>
);

const MoonGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 0.9 + sin(frame, 0.008, 0) * 0.1;
  const cx = MOON.x + MOON.w / 2;
  const cy = MOON.y + MOON.h / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id="moon-halo-v4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFF0" stopOpacity={0.2 * pulse} />
          <stop offset="30%" stopColor="#E8E0D0" stopOpacity={0.12 * pulse} />
          <stop offset="100%" stopColor="#8070AA" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={180} ry={170} fill="url(#moon-halo-v4)" />
    </svg>
  );
};

const LampGlow: React.FC<{ frame: number; cx: number; cy: number; id: string }> = ({ frame, cx, cy, id }) => {
  const f = 0.85 + sin(frame, 0.03, 0) * 0.06 + sin(frame, 0.07, 1.3) * 0.04 + sin(frame, 0.13, 2.7) * 0.03;
  const r = 120 + sin(frame, 0.025, 0.5) * 15;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id={`lg-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD580" stopOpacity={0.55 * f} />
          <stop offset="30%" stopColor="#FFAA33" stopOpacity={0.25 * f} />
          <stop offset="70%" stopColor="#FF8800" stopOpacity={0.08 * f} />
          <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.3} fill={`url(#lg-${id})`} />
    </svg>
  );
};

const WindowLight: React.FC<{ frame: number }> = ({ frame }) => {
  const f = 0.9 + sin(frame, 0.04, 0.8) * 0.05 + sin(frame, 0.11, 2.1) * 0.03;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id="wl-v4" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity={0.3 * f} />
          <stop offset="50%" stopColor="#FFAA30" stopOpacity={0.12 * f} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={PUB_CENTER.cx} cy={PUB_CENTER.cy + 50} rx={280} ry={200} fill="url(#wl-v4)" />
      <ellipse cx={PUB_CENTER.cx} cy={H * 0.88} rx={320} ry={70} fill="#FFD060" opacity={0.1 * f} />
    </svg>
  );
};

const DustMotes: React.FC<{ frame: number; particles: Particle[]; id: string }> = ({ frame, particles, id }) => (
  <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
    {particles.map((p, i) => {
      const t = frame * 0.02 * p.speed;
      const px = p.x + Math.sin(t + p.phase) * 25;
      const py = p.y + Math.cos(t * 0.7 + p.phase) * 15 - frame * p.speed * 0.15;
      const wy = ((py % 300) + 300) % 300 + p.y - 80;
      const o = p.opacity * (0.6 + sin(frame, p.speed * 0.02, p.phase) * 0.4);
      return <circle key={`${id}-${i}`} cx={px} cy={wy} r={p.size} fill="#FFD080" opacity={Math.max(0, o)} />;
    })}
  </svg>
);

const GroundFog: React.FC<{ frame: number }> = ({ frame }) => (
  <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
    {fogParticles.map((p, i) => {
      const drift = frame * 0.3 * p.speed;
      const px = ((p.x + drift) % (W + 100)) - 50;
      const py = p.y + sin(frame, 0.01, p.phase) * 8;
      const o = p.opacity * 0.35 * (0.5 + sin(frame, 0.015, p.phase) * 0.5);
      return <ellipse key={`fog-${i}`} cx={px} cy={py} rx={p.size * 18} ry={p.size * 5} fill="#9888A8" opacity={Math.max(0, o)} />;
    })}
  </svg>
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

        {/* Layer 1: Sky (full background) */}
        <AbsoluteFill style={{ zIndex: 1 }}>
          <Img
            src={staticFile('assets/sky/sky-night.svg')}
            style={{
              position: 'absolute',
              left: SKY.x, top: SKY.y, width: SKY.w, height: SKY.h,
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>

        {/* Layer 2: Moon */}
        <AbsoluteFill style={{ zIndex: 2 }}>
          <Img
            src={staticFile('assets/props/prop-moon.svg')}
            style={{
              position: 'absolute',
              left: MOON.x, top: MOON.y, width: MOON.w, height: MOON.h,
            }}
          />
        </AbsoluteFill>

        {/* Layer 3: Moon glow */}
        <AbsoluteFill style={{ zIndex: 3, mixBlendMode: 'screen' }}>
          <MoonGlow frame={frame} />
        </AbsoluteFill>

        {/* Layer 4: Twinkling stars */}
        <AbsoluteFill style={{ zIndex: 4 }}>
          <Stars frame={frame} />
        </AbsoluteFill>

        {/* Layer 5: Terrain (bottom portion) */}
        <AbsoluteFill style={{ zIndex: 5 }}>
          <Img
            src={staticFile('assets/terrain/terrain-street.svg')}
            style={{
              position: 'absolute',
              left: TERRAIN.x, top: TERRAIN.y, width: TERRAIN.w, height: TERRAIN.h,
              objectFit: 'fill', // NIET cover — we willen de hele straat zien
            }}
          />
        </AbsoluteFill>

        {/* Layer 6: Horizon blend (soften sky→terrain) */}
        <AbsoluteFill style={{ zIndex: 6 }}>
          <div style={{
            position: 'absolute', left: 0, right: 0,
            top: TERRAIN_TOP - 50, height: 100,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(20,24,43,0.7) 45%, rgba(20,24,43,0.7) 55%, transparent 100%)',
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>

        {/* Layer 7: Pub building (center) */}
        <AbsoluteFill style={{ zIndex: 7 }}>
          <Img
            src={staticFile('assets/structures/struct-pub.svg')}
            style={{
              position: 'absolute',
              left: PUB.x, top: PUB.y, width: PUB.w, height: PUB.h,
            }}
          />
        </AbsoluteFill>

        {/* Layer 8: Window light glow */}
        <AbsoluteFill style={{ zIndex: 8, mixBlendMode: 'screen' }}>
          <WindowLight frame={frame} />
        </AbsoluteFill>

        {/* Layer 9: Street lamp LEFT */}
        <AbsoluteFill style={{ zIndex: 9 }}>
          <Img
            src={staticFile('assets/props/prop-lamp.svg')}
            style={{
              position: 'absolute',
              left: LAMP_LEFT.x, top: LAMP_LEFT.y,
              width: LAMP_LEFT.w, height: LAMP_LEFT.h,
            }}
          />
        </AbsoluteFill>

        {/* Layer 10: Street lamp RIGHT (mirrored) */}
        <AbsoluteFill style={{ zIndex: 10 }}>
          <Img
            src={staticFile('assets/props/prop-lamp.svg')}
            style={{
              position: 'absolute',
              left: LAMP_RIGHT.x, top: LAMP_RIGHT.y,
              width: LAMP_RIGHT.w, height: LAMP_RIGHT.h,
              transform: 'scaleX(-1)',
            }}
          />
        </AbsoluteFill>

        {/* Layer 11: Lamp glow halos */}
        <AbsoluteFill style={{ zIndex: 11, mixBlendMode: 'screen' }}>
          <LampGlow frame={frame} cx={GLOW_LEFT.cx} cy={GLOW_LEFT.cy} id="left" />
          <LampGlow frame={frame} cx={GLOW_RIGHT.cx} cy={GLOW_RIGHT.cy} id="right" />
        </AbsoluteFill>

        {/* Layer 12: Dust motes */}
        <AbsoluteFill style={{ zIndex: 12, mixBlendMode: 'screen', opacity: 0.7 }}>
          <DustMotes frame={frame} particles={dustLeft} id="dl" />
          <DustMotes frame={frame} particles={dustRight} id="dr" />
        </AbsoluteFill>

        {/* Layer 13: Ground fog */}
        <AbsoluteFill style={{ zIndex: 13, opacity: 0.5 }}>
          <GroundFog frame={frame} />
        </AbsoluteFill>

        {/* Layer 14: Vignette */}
        <AbsoluteFill style={{ zIndex: 14 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(8,4,16,0.6) 100%)',
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>

        {/* Layer 15: Color grade (warm tint) */}
        <AbsoluteFill style={{
          zIndex: 15,
          backgroundColor: 'rgba(255, 180, 100, 0.05)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }} />

      </AbsoluteFill>

      {/* Title overlay */}
      <div style={{
        position: 'absolute', bottom: 50, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', zIndex: 20,
        opacity: interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#FFD080',
          padding: '10px 30px',
          borderRadius: 8,
          fontSize: 32,
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          letterSpacing: 2,
        }}>
          Professor Pint&apos;s Pub
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default PubExteriorScene;
