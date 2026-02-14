/**
 * PubExteriorScene — Geanimeerde avond-pub scene
 *
 * Lagen:
 * 1. Sky: sky-evening-warm (warme avondlucht)
 * 2. Moon: prop-moon-crescent (rechtsboven, zachte gloed)
 * 3. Terrain: terrain-cobblestone-street (keistraat)
 * 4. Structure: struct-pub-exterior (pub gebouw, centraal)
 * 5. Props: prop-street-lamp (links + rechts, gespiegeld)
 * 6. Animatie-overlays:
 *    - Lantaarn warm licht (flikkerende gloed)
 *    - Maan-gloed halo
 *    - Raam-licht (warm uit pub-ramen)
 *    - Sfeerdeeltjes (stofmoten in het licht)
 *    - Lichte nevel aan de grond
 *    - Sterren twinkel
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile, interpolate } from 'remotion';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const PUB_EXTERIOR_FRAMES = 300; // 10 seconden @ 30fps

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

// Dust motes floating in lamp light (left lamp area)
const dustLeft = makeParticles(15, 10, { x1: 150, y1: 300, x2: 380, y2: 650 });
// Dust motes floating in lamp light (right lamp area)
const dustRight = makeParticles(15, 20, { x1: 1150, y1: 300, x2: 1380, y2: 650 });
// Ground fog particles
const fogParticles = makeParticles(25, 30, { x1: 0, y1: 750, x2: 1536, y2: 1024 });
// Stars
const stars = Array.from({ length: 30 }, (_, i) => ({
  x: 50 + rand(100 + i) * 1436,
  y: 20 + rand(200 + i) * 250,
  size: 1 + rand(300 + i) * 3,
  twinkleSpeed: 0.02 + rand(400 + i) * 0.06,
  phase: rand(500 + i) * Math.PI * 2,
  opacity: 0.3 + rand(600 + i) * 0.7,
}));

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Flickering warm lamp glow */
const LampGlow: React.FC<{ frame: number; cx: number; cy: number; id: string }> = ({
  frame,
  cx,
  cy,
  id,
}) => {
  // Flicker: base brightness with subtle random variation
  const flicker =
    0.85 +
    sineWave(frame, 0.03, 0) * 0.06 +
    sineWave(frame, 0.07, 1.3) * 0.04 +
    sineWave(frame, 0.13, 2.7) * 0.03;

  const radius = 120 + sineWave(frame, 0.025, 0.5) * 15;

  return (
    <svg
      viewBox="0 0 1536 1024"
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
    >
      <defs>
        <radialGradient id={`lamp-glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD580" stopOpacity={0.6 * flicker} />
          <stop offset="30%" stopColor="#FFAA33" stopOpacity={0.3 * flicker} />
          <stop offset="70%" stopColor="#FF8800" stopOpacity={0.1 * flicker} />
          <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse
        cx={cx}
        cy={cy}
        rx={radius}
        ry={radius * 1.3}
        fill={`url(#lamp-glow-${id})`}
      />
    </svg>
  );
};

/** Moon halo — soft ethereal glow */
const MoonGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 0.9 + sineWave(frame, 0.008, 0) * 0.1;
  return (
    <svg
      viewBox="0 0 1536 1024"
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
    >
      <defs>
        <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8E0FF" stopOpacity={0.25 * pulse} />
          <stop offset="40%" stopColor="#C8B8FF" stopOpacity={0.12 * pulse} />
          <stop offset="100%" stopColor="#8070CC" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={1200} cy={140} rx={200} ry={180} fill="url(#moon-halo)" />
    </svg>
  );
};

/** Warm light spilling from pub windows */
const WindowLight: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker =
    0.9 +
    sineWave(frame, 0.04, 0.8) * 0.05 +
    sineWave(frame, 0.11, 2.1) * 0.03;

  return (
    <svg
      viewBox="0 0 1536 1024"
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
    >
      <defs>
        <radialGradient id="window-light-1" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity={0.35 * flicker} />
          <stop offset="50%" stopColor="#FFAA30" stopOpacity={0.15 * flicker} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Central glow from the pub entrance/windows area */}
      <ellipse cx={768} cy={520} rx={250} ry={180} fill="url(#window-light-1)" />
      {/* Light spill on the ground in front */}
      <ellipse
        cx={768}
        cy={780}
        rx={300}
        ry={80}
        fill="#FFD060"
        opacity={0.12 * flicker}
      />
    </svg>
  );
};

/** Animated dust/pollen motes floating in lamp light */
const DustMotes: React.FC<{ frame: number; particles: Particle[]; id: string }> = ({
  frame,
  particles,
  id,
}) => (
  <svg
    viewBox="0 0 1536 1024"
    style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
  >
    {particles.map((p, i) => {
      const t = frame * 0.02 * p.speed;
      const px = p.x + Math.sin(t + p.phase) * 25;
      const py = p.y + Math.cos(t * 0.7 + p.phase) * 15 - frame * p.speed * 0.15;
      // Wrap vertically
      const wrappedY = ((py % 400) + 400) % 400 + p.y - 100;
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

/** Ground fog — drifting low mist */
const GroundFog: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    viewBox="0 0 1536 1024"
    style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
  >
    {fogParticles.map((p, i) => {
      const drift = frame * 0.3 * p.speed;
      const px = ((p.x + drift) % 1636) - 50;
      const py = p.y + sineWave(frame, 0.01, p.phase) * 8;
      const opacity = p.opacity * 0.4 * (0.5 + sineWave(frame, 0.015, p.phase) * 0.5);

      return (
        <ellipse
          key={`fog-${i}`}
          cx={px}
          cy={py}
          rx={p.size * 15}
          ry={p.size * 4}
          fill="#B8A8C8"
          opacity={Math.max(0, opacity)}
        />
      );
    })}
  </svg>
);

/** Twinkling stars */
const Stars: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    viewBox="0 0 1536 1024"
    style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
  >
    {stars.map((s, i) => {
      const twinkle = 0.3 + Math.abs(sineWave(frame, s.twinkleSpeed, s.phase)) * 0.7;
      return (
        <circle
          key={`star-${i}`}
          cx={s.x}
          cy={s.y}
          r={s.size * twinkle}
          fill="#FFFDE8"
          opacity={s.opacity * twinkle}
        />
      );
    })}
  </svg>
);

/** Horizon haze — blends sky into terrain */
const HorizonHaze: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: '28%',
      height: '22%',
      background:
        'linear-gradient(to bottom, transparent 0%, rgba(180,120,70,0.3) 40%, rgba(180,120,70,0.3) 60%, transparent 100%)',
      pointerEvents: 'none',
    }}
  />
);

/** Vignette — dark edges for atmosphere */
const Vignette: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(10,5,20,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const PubExteriorScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0e2e' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* Layer 1: Sky — full background */}
        <AbsoluteFill>
          <Img
            src={staticFile('assets/skies/sky-evening-warm.svg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>

        {/* Layer 2: Stars twinkling in the sky */}
        <AbsoluteFill style={{ zIndex: 2 }}>
          <Stars frame={frame} />
        </AbsoluteFill>

        {/* Layer 3: Moon (top right area) */}
        <AbsoluteFill style={{ zIndex: 3 }}>
          <div
            style={{
              position: 'absolute',
              right: '12%',
              top: '3%',
              width: '12%',
              opacity: 0.95,
            }}
          >
            <Img
              src={staticFile('assets/props/prop-moon-crescent.svg')}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </AbsoluteFill>

        {/* Layer 4: Moon glow halo */}
        <AbsoluteFill style={{ zIndex: 4, mixBlendMode: 'screen' }}>
          <MoonGlow frame={frame} />
        </AbsoluteFill>

        {/* Layer 5: Horizon haze blend */}
        <HorizonHaze />

        {/* Layer 6: Terrain — bottom 55% */}
        <AbsoluteFill style={{ zIndex: 6, top: '45%' }}>
          <Img
            src={staticFile('assets/terrain/terrain-cobblestone-street.svg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>

        {/* Layer 7: Pub building — center */}
        <AbsoluteFill style={{ zIndex: 7 }}>
          <div
            style={{
              position: 'absolute',
              left: '15%',
              top: '8%',
              width: '70%',
              height: '85%',
            }}
          >
            <Img
              src={staticFile('assets/structures/struct-pub-exterior.svg')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </AbsoluteFill>

        {/* Layer 8: Window light glow (behind lamps, in front of building) */}
        <AbsoluteFill style={{ zIndex: 8, mixBlendMode: 'screen' }}>
          <WindowLight frame={frame} />
        </AbsoluteFill>

        {/* Layer 9: Street lamp LEFT */}
        <AbsoluteFill style={{ zIndex: 9 }}>
          <div
            style={{
              position: 'absolute',
              left: '5%',
              top: '10%',
              width: '14%',
              height: '82%',
            }}
          >
            <Img
              src={staticFile('assets/props/prop-street-lamp.svg')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </AbsoluteFill>

        {/* Layer 10: Street lamp RIGHT (mirrored) */}
        <AbsoluteFill style={{ zIndex: 10 }}>
          <div
            style={{
              position: 'absolute',
              right: '5%',
              top: '10%',
              width: '14%',
              height: '82%',
              transform: 'scaleX(-1)',
            }}
          >
            <Img
              src={staticFile('assets/props/prop-street-lamp.svg')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </AbsoluteFill>

        {/* Layer 11: Lamp glows */}
        <AbsoluteFill style={{ zIndex: 11, mixBlendMode: 'screen' }}>
          <LampGlow frame={frame} cx={260} cy={350} id="left" />
          <LampGlow frame={frame} cx={1276} cy={350} id="right" />
        </AbsoluteFill>

        {/* Layer 12: Dust motes in lamp light */}
        <AbsoluteFill style={{ zIndex: 12, mixBlendMode: 'screen', opacity: 0.7 }}>
          <DustMotes frame={frame} particles={dustLeft} id="dust-l" />
          <DustMotes frame={frame} particles={dustRight} id="dust-r" />
        </AbsoluteFill>

        {/* Layer 13: Ground fog */}
        <AbsoluteFill style={{ zIndex: 13, opacity: 0.5 }}>
          <GroundFog frame={frame} />
        </AbsoluteFill>

        {/* Layer 14: Vignette */}
        <AbsoluteFill style={{ zIndex: 14 }}>
          <Vignette />
        </AbsoluteFill>

        {/* Layer 15: Color grade — warm evening tint */}
        <AbsoluteFill
          style={{
            zIndex: 15,
            backgroundColor: 'rgba(255, 180, 100, 0.06)',
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
