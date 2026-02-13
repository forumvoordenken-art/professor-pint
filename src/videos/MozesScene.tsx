/**
 * MozesScene — Volledig geanimeerde "Mozes splitst de Rode Zee" compositie
 *
 * Base layer: statische SVG (vectorizer.ai traced, Kurzgesagt-stijl)
 * Overlay: 12 animatielagen in een SVG met dezelfde viewBox (1536x1024)
 *
 * Animatielagen:
 * 1.  Watermuur golven (links + rechts)
 * 2.  Water shimmer / lichtreflecties
 * 3.  Waterdruppels / spray
 * 4.  Lichtstralen vanuit de hemel
 * 5.  Stofdeeltjes in de lichtbundels
 * 6.  Mozes' staf gloed
 * 7.  Windlijnen bij Mozes
 * 8.  Menigte subtiele loop-beweging
 * 9.  Vissen in de watermuren
 * 10. Vogels in de lucht
 * 11. Nevel / mist bij waterbasis
 * 12. Horizon gloed + atmosfeer
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile, interpolate } from 'remotion';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deterministic pseudo-random based on seed (0..1 range) */
const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

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
    size: 2 + rand(seed + i * 3.7) * 6,
    speed: 0.3 + rand(seed + i * 4.1) * 1.5,
    opacity: 0.2 + rand(seed + i * 5.9) * 0.6,
    phase: rand(seed + i * 6.3) * Math.PI * 2,
  }));

// ---------------------------------------------------------------------------
// Pre-generated particle sets (static, created once)
// ---------------------------------------------------------------------------

// Mist near water base
const mistLeft = makeParticles(18, 1, { x1: 30, y1: 320, x2: 480, y2: 580 });
const mistRight = makeParticles(18, 2, { x1: 1060, y1: 320, x2: 1510, y2: 580 });

// Spray droplets
const sprayLeft = makeParticles(22, 3, { x1: 380, y1: 280, x2: 520, y2: 520 });
const sprayRight = makeParticles(22, 4, { x1: 1020, y1: 280, x2: 1160, y2: 520 });

// Dust motes in light beams
const dustMotes = makeParticles(35, 5, { x1: 580, y1: 50, x2: 960, y2: 600 });

// Birds
const birds = Array.from({ length: 8 }, (_, i) => ({
  startX: -80 - rand(10 + i) * 250,
  y: 25 + rand(20 + i) * 100,
  speed: 1.2 + rand(30 + i) * 2.5,
  size: 6 + rand(40 + i) * 14,
  flapSpeed: 0.08 + rand(50 + i) * 0.1,
  phase: rand(60 + i) * Math.PI * 2,
}));

// Fish — left wall
const fishL = Array.from({ length: 6 }, (_, i) => ({
  x: 60 + rand(70 + i) * 350,
  y: 220 + rand(80 + i) * 250,
  size: 10 + rand(90 + i) * 18,
  speed: 0.2 + rand(100 + i) * 0.6,
  phase: rand(110 + i) * Math.PI * 2,
  dir: rand(120 + i) > 0.5 ? 1 : -1,
}));

// Fish — right wall
const fishR = Array.from({ length: 6 }, (_, i) => ({
  x: 1100 + rand(130 + i) * 380,
  y: 220 + rand(140 + i) * 250,
  size: 10 + rand(150 + i) * 18,
  speed: 0.2 + rand(160 + i) * 0.6,
  phase: rand(170 + i) * Math.PI * 2,
  dir: rand(180 + i) > 0.5 ? 1 : -1,
}));

// Walkers (crowd on the path)
const walkers = Array.from({ length: 20 }, (_, i) => ({
  cx: 520 + rand(200 + i) * 500,
  cy: 650 + rand(300 + i) * 120,
  bounceSpeed: 0.06 + rand(400 + i) * 0.06,
  walkSpeed: 0.01 + rand(500 + i) * 0.02,
  phase: rand(600 + i) * Math.PI * 2,
  size: 3 + rand(700 + i) * 4,
}));

// Seaweed in water walls
const seaweedLeft = Array.from({ length: 8 }, (_, i) => ({
  x: 60 + rand(800 + i) * 380,
  y: 400 + rand(810 + i) * 180,
  height: 30 + rand(820 + i) * 50,
  width: 4 + rand(830 + i) * 6,
  speed: 0.03 + rand(840 + i) * 0.04,
  phase: rand(850 + i) * Math.PI * 2,
}));

const seaweedRight = Array.from({ length: 8 }, (_, i) => ({
  x: 1100 + rand(860 + i) * 380,
  y: 400 + rand(870 + i) * 180,
  height: 30 + rand(880 + i) * 50,
  width: 4 + rand(890 + i) * 6,
  speed: 0.03 + rand(900 + i) * 0.04,
  phase: rand(910 + i) * Math.PI * 2,
}));

// ---------------------------------------------------------------------------
// Duration
// ---------------------------------------------------------------------------

export const MOZES_SCENE_FRAMES = 450; // 15 seconds @ 30fps

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const MozesScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Global fade-in
  const fadeIn = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });

  // Wave motions
  const waveA = Math.sin(frame * 0.04) * 4;
  const waveB = Math.sin(frame * 0.04 + 1.2) * 3;

  // Light ray pulse
  const lightPulse = 0.45 + Math.sin(frame * 0.025) * 0.15;
  const lightPulse2 = 0.35 + Math.sin(frame * 0.032 + 1) * 0.12;

  // Staff glow
  const staffGlow = 0.5 + Math.sin(frame * 0.05) * 0.3;

  // Crowd drift
  const crowdDrift = Math.sin(frame * 0.018) * 2;

  // Horizon glow
  const horizonPulse = 0.55 + Math.sin(frame * 0.02) * 0.15;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0a2e' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* ============================================================ */}
        {/* BASE LAYER — static SVG artwork                              */}
        {/* ============================================================ */}
        <Img
          src={staticFile('assets/Mozes.svg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* ============================================================ */}
        {/* ANIMATED OVERLAY — SVG with matching coordinate space         */}
        {/* ============================================================ */}
        <svg
          viewBox="0 0 1536 1024"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {/* ---- DEFS (gradients, filters, clip paths) ---- */}
          <defs>
            {/* Light ray gradient */}
            <linearGradient id="mz-ray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#feba1c" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#fe962f" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fe962f" stopOpacity="0" />
            </linearGradient>

            {/* Staff radial glow */}
            <radialGradient id="mz-staff" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#feba1c" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#fe962f" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fe962f" stopOpacity="0" />
            </radialGradient>

            {/* Water shimmer moving highlight */}
            <linearGradient id="mz-shimmer" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a7e8eb" stopOpacity="0" />
              <stop offset="50%" stopColor="#dcf2f0" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#a7e8eb" stopOpacity="0" />
            </linearGradient>

            {/* Horizon radial warm glow */}
            <radialGradient id="mz-horizon" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="#feba1c" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#fe962f" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#4f2482" stopOpacity="0" />
            </radialGradient>

            {/* Mist blur */}
            <filter id="mz-mist">
              <feGaussianBlur stdDeviation="10" />
            </filter>

            {/* Soft glow filter */}
            <filter id="mz-glow">
              <feGaussianBlur stdDeviation="12" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Clip: left water wall region */}
            <clipPath id="mz-clip-lw">
              <rect x="0" y="50" width="520" height="650" />
            </clipPath>

            {/* Clip: right water wall region */}
            <clipPath id="mz-clip-rw">
              <rect x="1020" y="50" width="520" height="650" />
            </clipPath>

            {/* Clip: central path region */}
            <clipPath id="mz-clip-path">
              <polygon points="480,300 1060,300 1000,850 540,850" />
            </clipPath>
          </defs>

          {/* ========================================================== */}
          {/* 1. WATER WALL WAVES                                        */}
          {/* ========================================================== */}

          {/* Left wall waves */}
          <g clipPath="url(#mz-clip-lw)">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const y = 150 + i * 75;
              const wave = Math.sin(frame * 0.035 + i * 0.8) * 18;
              const a = 0.06 + Math.sin(frame * 0.04 + i * 1.2) * 0.03;
              return (
                <path
                  key={`lw-${i}`}
                  d={`M 0 ${y + wave} Q 130 ${y + wave - 22} 260 ${y + wave + 12} Q 390 ${y + wave + 28} 520 ${y + wave}`}
                  fill="none"
                  stroke="#a7e8eb"
                  strokeWidth="2.5"
                  opacity={a}
                />
              );
            })}
          </g>

          {/* Right wall waves */}
          <g clipPath="url(#mz-clip-rw)">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const y = 150 + i * 75;
              const wave = Math.sin(frame * 0.035 + i * 0.8 + 2.5) * 18;
              const a = 0.06 + Math.sin(frame * 0.04 + i * 1.2 + 2.5) * 0.03;
              return (
                <path
                  key={`rw-${i}`}
                  d={`M 1020 ${y + wave} Q 1150 ${y + wave - 22} 1280 ${y + wave + 12} Q 1410 ${y + wave + 28} 1536 ${y + wave}`}
                  fill="none"
                  stroke="#a7e8eb"
                  strokeWidth="2.5"
                  opacity={a}
                />
              );
            })}
          </g>

          {/* ========================================================== */}
          {/* 2. WATER SHIMMER — light bands moving across walls          */}
          {/* ========================================================== */}

          <g clipPath="url(#mz-clip-lw)" opacity={0.4}>
            <rect
              x={-250 + ((frame * 0.9) % 800)}
              y="80"
              width="250"
              height="600"
              fill="url(#mz-shimmer)"
            />
            <rect
              x={-250 + ((frame * 0.6 + 400) % 800)}
              y="80"
              width="180"
              height="600"
              fill="url(#mz-shimmer)"
              opacity={0.6}
            />
          </g>

          <g clipPath="url(#mz-clip-rw)" opacity={0.4}>
            <rect
              x={1020 + (-250 + ((frame * 0.7 + 200) % 800))}
              y="80"
              width="250"
              height="600"
              fill="url(#mz-shimmer)"
            />
            <rect
              x={1020 + (-250 + ((frame * 0.5 + 500) % 800))}
              y="80"
              width="180"
              height="600"
              fill="url(#mz-shimmer)"
              opacity={0.6}
            />
          </g>

          {/* Subtle vertical bulk movement on water walls */}
          <g opacity={0.04}>
            <rect x="30" y={130 + waveA} width="420" height="450" fill="#0290bc" rx="30" />
            <rect x="1080" y={130 + waveB} width="420" height="450" fill="#0290bc" rx="30" />
          </g>

          {/* ========================================================== */}
          {/* 3. WATER SPRAY DROPLETS                                    */}
          {/* ========================================================== */}

          {/* Left wall spray */}
          {sprayLeft.map((p, i) => {
            const t = (frame * p.speed + p.phase * 80) % 100;
            const py = p.y - t * 2.5;
            const px = p.x + Math.sin(frame * 0.06 + p.phase) * 25;
            const a = t < 50 ? interpolate(t, [0, 20, 50], [0, p.opacity, 0], { extrapolateRight: 'clamp' }) : 0;
            return (
              <circle
                key={`sl-${i}`}
                cx={px}
                cy={py}
                r={p.size * 0.4}
                fill="#dcf2f0"
                opacity={a}
              />
            );
          })}

          {/* Right wall spray */}
          {sprayRight.map((p, i) => {
            const t = (frame * p.speed + p.phase * 80) % 100;
            const py = p.y - t * 2.5;
            const px = p.x + Math.sin(frame * 0.06 + p.phase + 1.5) * 25;
            const a = t < 50 ? interpolate(t, [0, 20, 50], [0, p.opacity, 0], { extrapolateRight: 'clamp' }) : 0;
            return (
              <circle
                key={`sr-${i}`}
                cx={px}
                cy={py}
                r={p.size * 0.4}
                fill="#dcf2f0"
                opacity={a}
              />
            );
          })}

          {/* ========================================================== */}
          {/* 4. LIGHT RAYS FROM THE HEAVENS                             */}
          {/* ========================================================== */}

          <g filter="url(#mz-glow)" opacity={lightPulse}>
            {/* Central main beam */}
            <polygon
              points={`690,0 860,0 920,${660 + Math.sin(frame * 0.018) * 20} 640,${660 + Math.sin(frame * 0.018 + 1.2) * 20}`}
              fill="url(#mz-ray)"
              opacity={0.4}
            />
            {/* Left secondary beam */}
            <polygon
              points={`560,0 670,0 710,${520 + Math.sin(frame * 0.022 + 0.6) * 16} 520,${520 + Math.sin(frame * 0.022 + 1.8) * 16}`}
              fill="url(#mz-ray)"
              opacity={lightPulse2 * 0.6}
            />
            {/* Right secondary beam */}
            <polygon
              points={`880,0 980,0 1020,${540 + Math.sin(frame * 0.02 + 1.3) * 18} 840,${540 + Math.sin(frame * 0.02 + 2.5) * 18}`}
              fill="url(#mz-ray)"
              opacity={lightPulse2 * 0.5}
            />
            {/* Far left faint beam */}
            <polygon
              points={`440,0 530,0 580,${400 + Math.sin(frame * 0.026 + 2) * 12} 400,${400 + Math.sin(frame * 0.026 + 3) * 12}`}
              fill="url(#mz-ray)"
              opacity={lightPulse2 * 0.3}
            />
            {/* Far right faint beam */}
            <polygon
              points={`1000,0 1080,0 1110,${420 + Math.sin(frame * 0.024 + 1.8) * 14} 960,${420 + Math.sin(frame * 0.024 + 3) * 14}`}
              fill="url(#mz-ray)"
              opacity={lightPulse2 * 0.25}
            />
          </g>

          {/* ========================================================== */}
          {/* 5. DUST MOTES IN LIGHT BEAMS                               */}
          {/* ========================================================== */}

          <g clipPath="url(#mz-clip-path)">
            {dustMotes.map((p, i) => {
              const px = p.x + Math.sin(frame * 0.012 + p.phase) * 45;
              const rawPy = p.y + Math.cos(frame * 0.009 + p.phase) * 30 - frame * 0.15;
              const py = ((rawPy % 580) + 580) % 580 + 30;
              const a = p.opacity * (0.25 + Math.sin(frame * 0.035 + p.phase) * 0.25);
              return (
                <circle
                  key={`dm-${i}`}
                  cx={px}
                  cy={py}
                  r={p.size * 0.25}
                  fill="#fef3ac"
                  opacity={a}
                />
              );
            })}
          </g>

          {/* ========================================================== */}
          {/* 6. MOSES STAFF GLOW                                        */}
          {/* ========================================================== */}

          <ellipse
            cx="1195"
            cy="465"
            rx={55 + Math.sin(frame * 0.055) * 12}
            ry={70 + Math.sin(frame * 0.055) * 18}
            fill="url(#mz-staff)"
            opacity={staffGlow}
            filter="url(#mz-glow)"
          />

          {/* Small sparkles around the staff tip */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (frame * 0.04 + i * (Math.PI * 2) / 5);
            const dist = 25 + Math.sin(frame * 0.08 + i * 2) * 12;
            const sx = 1195 + Math.cos(angle) * dist;
            const sy = 445 + Math.sin(angle) * dist * 0.7;
            const sa = 0.4 + Math.sin(frame * 0.1 + i * 1.5) * 0.35;
            return (
              <circle
                key={`spark-${i}`}
                cx={sx}
                cy={sy}
                r={2 + Math.sin(frame * 0.12 + i) * 1}
                fill="#fef3ac"
                opacity={sa}
              />
            );
          })}

          {/* ========================================================== */}
          {/* 7. WIND LINES NEAR MOSES                                   */}
          {/* ========================================================== */}

          {[0, 1, 2, 3].map((i) => {
            const wx = 1120 + i * 25;
            const wy = 530 + i * 35;
            const drift = Math.sin(frame * 0.06 + i * 1.3) * 30;
            const a = 0.08 + Math.sin(frame * 0.07 + i * 2) * 0.05;
            return (
              <path
                key={`wind-${i}`}
                d={`M ${wx} ${wy} Q ${wx - 35 + drift} ${wy - 8} ${wx - 70 + drift * 1.6} ${wy + 4}`}
                fill="none"
                stroke="#a7e8eb"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={a}
              />
            );
          })}

          {/* ========================================================== */}
          {/* 8. CROWD SUBTLE WALKING MOTION                             */}
          {/* ========================================================== */}

          <g clipPath="url(#mz-clip-path)">
            {walkers.map((w, i) => {
              const bounce = Math.abs(Math.sin(frame * w.bounceSpeed + w.phase)) * 3;
              const walkX = Math.sin(frame * w.walkSpeed + w.phase) * 3 + crowdDrift;
              return (
                <g key={`walk-${i}`} opacity={0.12}>
                  {/* Head */}
                  <circle
                    cx={w.cx + walkX}
                    cy={w.cy - bounce - w.size * 2}
                    r={w.size * 0.6}
                    fill="#592327"
                  />
                  {/* Body */}
                  <ellipse
                    cx={w.cx + walkX}
                    cy={w.cy - bounce}
                    rx={w.size * 0.5}
                    ry={w.size}
                    fill="#592327"
                  />
                </g>
              );
            })}
          </g>

          {/* ========================================================== */}
          {/* 9. FISH SWIMMING IN WATER WALLS                            */}
          {/* ========================================================== */}

          {/* Left wall fish */}
          <g clipPath="url(#mz-clip-lw)">
            {fishL.map((f, i) => {
              const fx = f.x + Math.sin(frame * f.speed * 0.035 + f.phase) * 70 * f.dir;
              const fy = f.y + Math.sin(frame * 0.022 + f.phase + 1) * 18;
              const facing = Math.cos(frame * f.speed * 0.035 + f.phase) * f.dir;
              return (
                <g
                  key={`fl-${i}`}
                  transform={`translate(${fx}, ${fy}) scale(${facing > 0 ? 1 : -1}, 1)`}
                  opacity={0.45}
                >
                  <ellipse cx="0" cy="0" rx={f.size} ry={f.size * 0.4} fill="#fe962f" />
                  <polygon
                    points={`${f.size * 0.7},0 ${f.size * 1.4},${-f.size * 0.35} ${f.size * 1.4},${f.size * 0.35}`}
                    fill="#fe962f"
                  />
                  <circle cx={-f.size * 0.45} cy={-f.size * 0.1} r={f.size * 0.1} fill="#301e39" />
                </g>
              );
            })}
          </g>

          {/* Right wall fish */}
          <g clipPath="url(#mz-clip-rw)">
            {fishR.map((f, i) => {
              const fx = f.x + Math.sin(frame * f.speed * 0.035 + f.phase) * 70 * f.dir;
              const fy = f.y + Math.sin(frame * 0.022 + f.phase + 1) * 18;
              const facing = Math.cos(frame * f.speed * 0.035 + f.phase) * f.dir;
              return (
                <g
                  key={`fr-${i}`}
                  transform={`translate(${fx}, ${fy}) scale(${facing > 0 ? 1 : -1}, 1)`}
                  opacity={0.45}
                >
                  <ellipse cx="0" cy="0" rx={f.size} ry={f.size * 0.4} fill="#feba1c" />
                  <polygon
                    points={`${f.size * 0.7},0 ${f.size * 1.4},${-f.size * 0.35} ${f.size * 1.4},${f.size * 0.35}`}
                    fill="#feba1c"
                  />
                  <circle cx={-f.size * 0.45} cy={-f.size * 0.1} r={f.size * 0.1} fill="#301e39" />
                </g>
              );
            })}
          </g>

          {/* Seaweed in left wall */}
          <g clipPath="url(#mz-clip-lw)">
            {seaweedLeft.map((s, i) => {
              const sway = Math.sin(frame * s.speed + s.phase) * 15;
              const sway2 = Math.sin(frame * s.speed * 1.5 + s.phase + 1) * 8;
              return (
                <path
                  key={`sw-l-${i}`}
                  d={`M ${s.x} ${s.y} Q ${s.x + sway} ${s.y - s.height * 0.5} ${s.x + sway + sway2} ${s.y - s.height}`}
                  fill="none"
                  stroke="#197d08"
                  strokeWidth={s.width}
                  strokeLinecap="round"
                  opacity={0.35}
                />
              );
            })}
          </g>

          {/* Seaweed in right wall */}
          <g clipPath="url(#mz-clip-rw)">
            {seaweedRight.map((s, i) => {
              const sway = Math.sin(frame * s.speed + s.phase) * 15;
              const sway2 = Math.sin(frame * s.speed * 1.5 + s.phase + 1) * 8;
              return (
                <path
                  key={`sw-r-${i}`}
                  d={`M ${s.x} ${s.y} Q ${s.x + sway} ${s.y - s.height * 0.5} ${s.x + sway + sway2} ${s.y - s.height}`}
                  fill="none"
                  stroke="#197d08"
                  strokeWidth={s.width}
                  strokeLinecap="round"
                  opacity={0.35}
                />
              );
            })}
          </g>

          {/* ========================================================== */}
          {/* 10. BIRDS IN THE SKY                                       */}
          {/* ========================================================== */}

          {birds.map((b, i) => {
            const bx = b.startX + frame * b.speed;
            const by = b.y + Math.sin(frame * 0.025 + b.phase) * 10;
            const flap = Math.sin(frame * b.flapSpeed + b.phase) * 30;
            const wrappedX = ((bx % 1800) + 1800) % 1800 - 130;
            return (
              <g key={`bird-${i}`} transform={`translate(${wrappedX}, ${by})`} opacity={0.55}>
                <line
                  x1="0" y1="0"
                  x2={-b.size} y2={-Math.abs(flap) * 0.35}
                  stroke="#301e39"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="0" y1="0"
                  x2={b.size} y2={-Math.abs(flap) * 0.35}
                  stroke="#301e39"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* ========================================================== */}
          {/* 11. MIST / NEVEL BIJ WATERBASIS                           */}
          {/* ========================================================== */}

          <g filter="url(#mz-mist)">
            {/* Left mist clouds */}
            {mistLeft.map((p, i) => {
              const mx = p.x + Math.sin(frame * 0.018 + p.phase) * 35;
              const my = p.y + Math.sin(frame * 0.013 + p.phase + 1.5) * 18;
              const a = p.opacity * (0.4 + Math.sin(frame * 0.025 + p.phase) * 0.25);
              return (
                <ellipse
                  key={`ml-${i}`}
                  cx={mx}
                  cy={my}
                  rx={p.size * 4}
                  ry={p.size * 2}
                  fill="#a7e8eb"
                  opacity={a}
                />
              );
            })}
            {/* Right mist clouds */}
            {mistRight.map((p, i) => {
              const mx = p.x + Math.sin(frame * 0.018 + p.phase + 2.5) * 35;
              const my = p.y + Math.sin(frame * 0.013 + p.phase + 4) * 18;
              const a = p.opacity * (0.4 + Math.sin(frame * 0.025 + p.phase + 2.5) * 0.25);
              return (
                <ellipse
                  key={`mr-${i}`}
                  cx={mx}
                  cy={my}
                  rx={p.size * 4}
                  ry={p.size * 2}
                  fill="#a7e8eb"
                  opacity={a}
                />
              );
            })}
          </g>

          {/* Ground-level mist along the dry path */}
          <g filter="url(#mz-mist)" clipPath="url(#mz-clip-path)">
            {[0, 1, 2, 3].map((i) => {
              const mx = 550 + i * 120 + Math.sin(frame * 0.015 + i * 2) * 40;
              const my = 780 + Math.sin(frame * 0.02 + i * 1.5) * 10;
              const a = 0.06 + Math.sin(frame * 0.025 + i * 3) * 0.03;
              return (
                <ellipse
                  key={`gm-${i}`}
                  cx={mx}
                  cy={my}
                  rx={80}
                  ry={20}
                  fill="#cc7b3f"
                  opacity={a}
                />
              );
            })}
          </g>

          {/* ========================================================== */}
          {/* 12. HORIZON GLOW + ATMOSPHERE                              */}
          {/* ========================================================== */}

          {/* Warm horizon glow at the vanishing point */}
          <ellipse
            cx={768 + Math.sin(frame * 0.012) * 8}
            cy={630 + Math.sin(frame * 0.016) * 6}
            rx="380"
            ry="160"
            fill="url(#mz-horizon)"
            opacity={horizonPulse}
          />

          {/* Subtle purple atmosphere at top */}
          <rect
            x="0" y="0"
            width="1536" height="120"
            fill="#4f2482"
            opacity={0.06 + Math.sin(frame * 0.015) * 0.02}
          />

          {/* Ground warmth along the path */}
          <ellipse
            cx={768 + Math.sin(frame * 0.01) * 12}
            cy="760"
            rx="280"
            ry="55"
            fill="#fe962f"
            opacity={0.04 + Math.sin(frame * 0.028) * 0.015}
          />

          {/* Water surface caustics — subtle light patterns on the ground */}
          <g clipPath="url(#mz-clip-path)" opacity={0.04}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const cx = 580 + i * 80 + Math.sin(frame * 0.03 + i * 1.8) * 30;
              const cy = 500 + i * 40 + Math.cos(frame * 0.025 + i * 2.1) * 20;
              return (
                <ellipse
                  key={`caust-${i}`}
                  cx={cx}
                  cy={cy}
                  rx={25 + Math.sin(frame * 0.04 + i) * 8}
                  ry={12 + Math.cos(frame * 0.035 + i) * 5}
                  fill="#a7e8eb"
                  opacity={0.5 + Math.sin(frame * 0.05 + i * 2) * 0.3}
                />
              );
            })}
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default MozesScene;
