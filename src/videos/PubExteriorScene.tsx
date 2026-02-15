/**
 * PubExteriorScene — Night pub exterior (v9 — split-scene layers)
 *
 * NEW APPROACH: Eén scene-PNG → vectorizer.ai → split-scene-svg.js → aparte lagen.
 * Alle lagen hebben DEZELFDE viewBox → perfect uitgelijn met inset: 0.
 * Geen handmatige positionering meer.
 *
 * Workflow:
 *   1. Genereer volledige scene als PNG (ChatGPT)
 *   2. Vectorize (vectorizer.ai)
 *   3. node scripts/clean-svg-backgrounds.js
 *   4. node scripts/split-scene-svg.js <input.svg> --config scenes/pub-exterior-regions.json
 *   5. Output → public/assets/scenes/pub-exterior/*.svg
 *
 * Animation overlays (stars, glow, fog) worden procedureel gegenereerd
 * op basis van anchor points die per scene worden ingesteld.
 *
 * Assets (public/assets/scenes/pub-exterior/):
 *   - sky.svg         Lucht, maan, sterren
 *   - pub.svg         Pub gebouw
 *   - lamp-left.svg   Linker lantaarnpaal
 *   - lamp-right.svg  Rechter lantaarnpaal
 *   - characters.svg  Man + hond
 *   - sidewalk.svg    Stoep
 *   - street.svg      Straat (cobblestone)
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
// Scene layers — alle SVGs hebben dezelfde viewBox, dus inset: 0 = perfect align
// ---------------------------------------------------------------------------

const SCENE_DIR = 'assets/scenes';

// Background scene (without characters) — full scene as single SVG
const BG_SRC = `${SCENE_DIR}/pub-exterior-bg.svg`;

// Character (boy + dog) — separate SVG, can be freely animated
const CHAR_SRC = `${SCENE_DIR}/pub-exterior-boy-dog.svg`;
// Character SVG dimensions (from cropped viewBox)
const CHAR_W = 1274;
const CHAR_H = 873;
// Character display size and position on canvas
const CHAR_SCALE = 0.22; // scale to fit scene proportions
const CHAR_DISPLAY_W = CHAR_W * CHAR_SCALE;
const CHAR_DISPLAY_H = CHAR_H * CHAR_SCALE;

// Full-canvas style for scene layers (shared viewBox = no positioning needed)
const LAYER_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

// ---------------------------------------------------------------------------
// Animation anchor points (fracties van canvas, aanpassen per scene)
// Deze komen overeen met waar elementen in de scene staan.
// Na eerste render → check posities en pas aan.
// ---------------------------------------------------------------------------

const ANCHORS = {
  // Moon: upper-right area
  moon: { x: W * 0.82, y: H * 0.12 },

  // Pub center: for window light glow
  pubCenter: { x: W * 0.50, y: H * 0.45 },

  // Ground line: where sidewalk starts (for fog, horizon blend)
  groundLine: H * 0.73,

  // Street lamp tops: where glow emanates from (updated from SVG analysis)
  lampLeft: { x: W * 0.245, y: H * 0.20 },
  lampRight: { x: W * 0.755, y: H * 0.20 },

  // Chimney: top-center for smoke origin
  chimney: { x: W * 0.262, y: H * 0.128 },

  // Pub lanterns on facade
  pubLanternLeft: { x: W * 0.381, y: H * 0.610 },
  pubLanternRight: { x: W * 0.509, y: H * 0.626 },
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
  x1: ANCHORS.lampLeft.x - 80, y1: ANCHORS.lampLeft.y - 20,
  x2: ANCHORS.lampLeft.x + 80, y2: ANCHORS.lampLeft.y + 250,
});
const dustRight = makeParticles(15, 20, {
  x1: ANCHORS.lampRight.x - 80, y1: ANCHORS.lampRight.y - 20,
  x2: ANCHORS.lampRight.x + 80, y2: ANCHORS.lampRight.y + 250,
});
const fogParticles = makeParticles(25, 30, {
  x1: 0, y1: ANCHORS.groundLine, x2: W, y2: H,
});
// Smoke particles for chimney
const smokeParticles = Array.from({ length: 18 }, (_, i) => ({
  xOff: (rand(700 + i) - 0.5) * 30,     // horizontal spread
  size: 6 + rand(800 + i) * 14,          // puff size
  speed: 0.3 + rand(900 + i) * 0.5,      // rise speed
  drift: (rand(1000 + i) - 0.5) * 0.4,   // wind drift
  opacity: 0.12 + rand(1100 + i) * 0.18,
  phase: rand(1200 + i) * Math.PI * 2,
  lifetime: 80 + rand(1300 + i) * 60,     // frames before reset
}));

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
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFF0" stopOpacity={0.2 * pulse} />
          <stop offset="30%" stopColor="#E8E0D0" stopOpacity={0.12 * pulse} />
          <stop offset="100%" stopColor="#8070AA" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={ANCHORS.moon.x} cy={ANCHORS.moon.y} rx={180} ry={170} fill="url(#moon-halo)" />
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
        <radialGradient id="wl" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity={0.3 * f} />
          <stop offset="50%" stopColor="#FFAA30" stopOpacity={0.12 * f} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={ANCHORS.pubCenter.x} cy={ANCHORS.pubCenter.y + 50} rx={280} ry={200} fill="url(#wl)" />
      <ellipse cx={ANCHORS.pubCenter.x} cy={ANCHORS.groundLine} rx={320} ry={70} fill="#FFD060" opacity={0.1 * f} />
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

const ChimneySmoke: React.FC<{ frame: number }> = ({ frame }) => (
  <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
    {smokeParticles.map((p, i) => {
      // Each puff rises, expands, drifts, and fades over its lifetime
      const t = ((frame * p.speed + p.phase * 50) % p.lifetime) / p.lifetime; // 0→1 over lifetime
      const rise = t * 180;         // pixels upward
      const expand = 1 + t * 2.5;   // grows as it rises
      const fadeOut = 1 - t * t;     // quadratic fade
      const drift = t * p.drift * 100 + Math.sin(frame * 0.03 + p.phase) * 8; // wind + wobble

      const px = ANCHORS.chimney.x + p.xOff + drift;
      const py = ANCHORS.chimney.y - rise;
      const r = p.size * expand;
      const o = p.opacity * fadeOut * 0.7;

      return o > 0.01 ? (
        <ellipse
          key={`smoke-${i}`}
          cx={px} cy={py}
          rx={r * 1.2} ry={r * 0.8}
          fill="#8888AA"
          opacity={Math.max(0, o)}
        />
      ) : null;
    })}
  </svg>
);

const PubLanternGlow: React.FC<{ frame: number; cx: number; cy: number; id: string }> = ({ frame, cx, cy, id }) => {
  const f = 0.8 + sin(frame, 0.04, 0.5) * 0.08 + sin(frame, 0.09, 2.0) * 0.05 + sin(frame, 0.17, 3.5) * 0.03;
  const r = 55 + sin(frame, 0.035, 1.0) * 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id={`plg-${id}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFE0A0" stopOpacity={0.5 * f} />
          <stop offset="25%" stopColor="#FFD060" stopOpacity={0.3 * f} />
          <stop offset="60%" stopColor="#FFAA33" stopOpacity={0.1 * f} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.4} fill={`url(#plg-${id})`} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const PubExteriorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0e1a' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>

        {/* ─── Background scene (pub exterior without characters) ─── */}
        <AbsoluteFill style={{ zIndex: 0 }}>
          <Img
            src={staticFile(BG_SRC)}
            style={{ ...LAYER_STYLE, objectFit: 'cover' as const }}
          />
        </AbsoluteFill>

        {/* ─── Character (boy + dog) — walks across the sidewalk ─── */}
        {(() => {
          // Walk from right to left over the scene duration
          const startX = W * 0.65;
          const endX = W * 0.35;
          const charX = interpolate(frame, [0, PUB_EXTERIOR_FRAMES], [startX, endX], { extrapolateRight: 'clamp' });

          // Walk cycle — step frequency ~2 steps/sec
          const stepPhase = frame * 0.21;
          // Vertical bob: up at mid-step, down at foot-plant
          const stepBob = Math.abs(Math.sin(stepPhase)) * 4;
          // Body lean: tilt forward/back with each step
          const lean = Math.sin(stepPhase) * 1.8;
          // Lateral sway: slight side-to-side shift
          const sway = Math.sin(stepPhase * 0.5) * 2;

          // Position: feet on the sidewalk
          const charY = H * 0.58;
          return (
            <div style={{
              position: 'absolute',
              left: charX - CHAR_DISPLAY_W / 2 + sway,
              top: charY - stepBob,
              width: CHAR_DISPLAY_W,
              height: CHAR_DISPLAY_H,
              zIndex: 10,
              transformOrigin: 'bottom center',
              transform: `rotate(${lean}deg)`,
            }}>
              <Img
                src={staticFile(CHAR_SRC)}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          );
        })()}

        {/* ─── Animation overlays ─── */}

        {/* Moon glow */}
        <AbsoluteFill style={{ zIndex: 3, mixBlendMode: 'screen' }}>
          <MoonGlow frame={frame} />
        </AbsoluteFill>

        {/* Twinkling stars */}
        <AbsoluteFill style={{ zIndex: 4 }}>
          <Stars frame={frame} />
        </AbsoluteFill>

        {/* Horizon blend (soften sky→ground transition) */}
        <AbsoluteFill style={{ zIndex: 5 }}>
          <div style={{
            position: 'absolute', left: 0, right: 0,
            top: ANCHORS.groundLine - 80, height: 120,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(20,24,43,0.6) 45%, rgba(20,24,43,0.6) 55%, transparent 100%)',
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>

        {/* Chimney smoke */}
        <AbsoluteFill style={{ zIndex: 5, opacity: 0.6 }}>
          <ChimneySmoke frame={frame} />
        </AbsoluteFill>

        {/* Window light glow */}
        <AbsoluteFill style={{ zIndex: 7, mixBlendMode: 'screen' }}>
          <WindowLight frame={frame} />
        </AbsoluteFill>

        {/* Pub lantern glow */}
        <AbsoluteFill style={{ zIndex: 7, mixBlendMode: 'screen' }}>
          <PubLanternGlow frame={frame} cx={ANCHORS.pubLanternLeft.x} cy={ANCHORS.pubLanternLeft.y} id="pub-left" />
          <PubLanternGlow frame={frame} cx={ANCHORS.pubLanternRight.x} cy={ANCHORS.pubLanternRight.y} id="pub-right" />
        </AbsoluteFill>

        {/* Street lamp glow halos */}
        <AbsoluteFill style={{ zIndex: 12, mixBlendMode: 'screen' }}>
          <LampGlow frame={frame} cx={ANCHORS.lampLeft.x} cy={ANCHORS.lampLeft.y} id="left" />
          <LampGlow frame={frame} cx={ANCHORS.lampRight.x} cy={ANCHORS.lampRight.y} id="right" />
        </AbsoluteFill>

        {/* Dust motes */}
        <AbsoluteFill style={{ zIndex: 13, mixBlendMode: 'screen', opacity: 0.7 }}>
          <DustMotes frame={frame} particles={dustLeft} id="dl" />
          <DustMotes frame={frame} particles={dustRight} id="dr" />
        </AbsoluteFill>

        {/* Ground fog */}
        <AbsoluteFill style={{ zIndex: 14, opacity: 0.5 }}>
          <GroundFog frame={frame} />
        </AbsoluteFill>

        {/* Vignette */}
        <AbsoluteFill style={{ zIndex: 15 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(8,4,16,0.6) 100%)',
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>

        {/* Color grade (warm tint) */}
        <AbsoluteFill style={{
          zIndex: 16,
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
