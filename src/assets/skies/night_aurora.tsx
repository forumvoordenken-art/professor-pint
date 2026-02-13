/**
 * night_aurora — Noorderlicht, groen/paars banden, magisch.
 *
 * Vikingen, poolgebied, magische/mythische scenes.
 * Realistic aurora borealis with vertical ray columns.
 * Green base fading to purple/magenta at the top.
 * Rich starfield visible through the aurora.
 * Dark landscape silhouette implied by very dark horizon.
 * Organic undulating curtain motion — NOT streamers.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  StarField,
  AtmosphericHaze,
  generateStars,
  seededRandom,
  longCycleNoise,
} from './SkyEngine';

const ID = 'night-aurora';

// Arctic night palette — very dark with subtle green-blue at horizon
const SKY_STOPS = [
  { offset: '0%', color: '#020408' },        // almost black
  { offset: '15%', color: '#040810' },       // very dark blue
  { offset: '35%', color: '#060C18' },       // dark navy
  { offset: '55%', color: '#081020' },       // navy
  { offset: '75%', color: '#0A1428' },       // blue-navy
  { offset: '88%', color: '#0E1830' },       // horizon hint
  { offset: '100%', color: '#101C28' },      // dark horizon
];

// Rich starfield — arctic skies are very clear
const STARS_BG = generateStars(100, 401, 600, 0.03);
const STARS_MED = generateStars(50, 402, 550, 0.08);
const STARS_BRIGHT = generateStars(20, 403, 500, 0.15);

// Aurora curtain band definition — each band is a horizontal region
// filled with vertical rays that shimmer independently
interface AuroraBand {
  /** Y center of the band */
  yCenter: number;
  /** Vertical extent of the band */
  height: number;
  /** Number of vertical ray columns */
  rayCount: number;
  /** Base green color at bottom of rays */
  colorBottom: string;
  /** Purple/magenta at top of rays */
  colorTop: string;
  /** Overall opacity multiplier */
  opacity: number;
  /** Horizontal wave speed */
  waveSpeed: number;
  /** Horizontal wave amplitude (px) */
  waveAmp: number;
  /** Vertical shimmer speed */
  shimmerSpeed: number;
  /** Phase offset for variety between bands */
  phase: number;
  /** Seed for ray placement randomness */
  seed: number;
}

// Asymmetric bands — concentrated left-of-center, each on different x-range
// xBias shifts the ray distribution (negative = leftward, positive = rightward)
interface AuroraBandExt extends AuroraBand {
  /** Horizontal center bias — shifts ray cluster off-center */
  xBias: number;
  /** Horizontal spread — how wide the rays are distributed */
  xSpread: number;
}

const AURORA_BANDS: AuroraBandExt[] = [
  // Main bright curtain — left-of-center, dominant
  {
    yCenter: 320, height: 300, rayCount: 65, opacity: 0.28,
    colorBottom: '#40E870', colorTop: '#8040C0',
    waveSpeed: 0.012, waveAmp: 45, shimmerSpeed: 0.04, phase: 0, seed: 5001,
    xBias: -250, xSpread: 1400,
  },
  // Secondary curtain — far right, dimmer, sparse
  {
    yCenter: 260, height: 240, rayCount: 35, opacity: 0.16,
    colorBottom: '#30D060', colorTop: '#6030A8',
    waveSpeed: 0.015, waveAmp: 35, shimmerSpeed: 0.035, phase: 1.8, seed: 5002,
    xBias: 300, xSpread: 900,
  },
  // High purple fringe — left side only
  {
    yCenter: 170, height: 180, rayCount: 25, opacity: 0.10,
    colorBottom: '#50B868', colorTop: '#A050D8',
    waveSpeed: 0.018, waveAmp: 25, shimmerSpeed: 0.05, phase: 0.7, seed: 5003,
    xBias: -400, xSpread: 800,
  },
  // Low green wash — broad but left-leaning
  {
    yCenter: 430, height: 180, rayCount: 40, opacity: 0.13,
    colorBottom: '#28C850', colorTop: '#38A850',
    waveSpeed: 0.008, waveAmp: 50, shimmerSpeed: 0.03, phase: 2.5, seed: 5004,
    xBias: -100, xSpread: 1600,
  },
  // Faint pink/magenta — isolated patch, right-center
  {
    yCenter: 220, height: 140, rayCount: 18, opacity: 0.06,
    colorBottom: '#D060A0', colorTop: '#8030B0',
    waveSpeed: 0.02, waveAmp: 20, shimmerSpeed: 0.06, phase: 3.2, seed: 5005,
    xBias: 150, xSpread: 600,
  },
];

/** Generates ray data for a single aurora band — asymmetric distribution */
function generateRays(band: AuroraBandExt) {
  const rng = seededRandom(band.seed);
  const center = 960 + band.xBias;
  return Array.from({ length: band.rayCount }, () => ({
    x: center - band.xSpread / 2 + rng() * band.xSpread,
    widthBase: 2 + rng() * 10,
    heightMult: 0.4 + rng() * 0.6,
    brightnessPhase: rng() * Math.PI * 2,
    brightnessMult: 0.3 + rng() * 0.7,
    wavePhaseOffset: rng() * Math.PI * 2,
  }));
}

export const NightAurora: React.FC<AssetProps> = ({ frame }) => {
  // Pre-generate ray data per band
  const bandData = useMemo(() =>
    AURORA_BANDS.map(band => ({
      band,
      rays: generateRays(band),
    })),
  []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — arctic dark */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Background stars — visible through aurora */}
      <g opacity={0.5}>
        <StarField stars={STARS_BG} frame={frame} twinkleSpeed={0.03} />
      </g>
      <g opacity={0.7}>
        <StarField stars={STARS_MED} frame={frame} twinkleSpeed={0.04} />
      </g>
      <StarField stars={STARS_BRIGHT} frame={frame} twinkleSpeed={0.05} />

      {/* Aurora glow — asymmetric, left-of-center */}
      <defs>
        <radialGradient id={`${ID}-aglow`} cx="0.35" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#20A040" stopOpacity={0.06} />
          <stop offset="50%" stopColor="#18803A" stopOpacity={0.03} />
          <stop offset="100%" stopColor="#18803A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={800} fill={`url(#${ID}-aglow)`} />

      {/* ─── Aurora curtain bands — vertical ray columns ─── */}
      {bandData.map(({ band, rays }, bi) => {
        const gradId = `${ID}-band-${bi}`;

        return (
          <g key={bi}>
            {/* Per-band vertical gradient */}
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={band.colorTop} stopOpacity={0} />
                <stop offset="15%" stopColor={band.colorTop} stopOpacity={band.opacity * 0.6} />
                <stop offset="40%" stopColor={band.colorTop} stopOpacity={band.opacity * 0.8} />
                <stop offset="65%" stopColor={band.colorBottom} stopOpacity={band.opacity} />
                <stop offset="85%" stopColor={band.colorBottom} stopOpacity={band.opacity * 0.7} />
                <stop offset="100%" stopColor={band.colorBottom} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Individual vertical ray columns */}
            {rays.map((ray, ri) => {
              // Horizontal wave: each ray sways left/right over time
              const waveOffset = Math.sin(
                frame * band.waveSpeed + ray.wavePhaseOffset + band.phase
              ) * band.waveAmp;

              // Secondary slower wave for organic motion
              const wave2 = Math.sin(
                frame * band.waveSpeed * 0.6 + ray.wavePhaseOffset * 1.3 + band.phase * 0.7
              ) * band.waveAmp * 0.4;

              // Non-repeating brightness shimmer for 10-15 min videos
              const shimmer = 0.3 + 0.7 * Math.abs(
                longCycleNoise(frame * band.shimmerSpeed * 15, ray.brightnessPhase * 50 + bi * 7)
              );
              const rayOpacity = shimmer * ray.brightnessMult;

              // Ray position
              const xPos = ray.x + waveOffset + wave2;
              const rayHeight = band.height * ray.heightMult;
              const rayTop = band.yCenter - rayHeight / 2;
              const rayWidth = ray.widthBase;

              return (
                <rect
                  key={ri}
                  x={xPos}
                  y={rayTop}
                  width={rayWidth}
                  height={rayHeight}
                  rx={rayWidth / 2}
                  ry={rayWidth / 2}
                  fill={`url(#${gradId})`}
                  opacity={rayOpacity}
                />
              );
            })}

            {/* Diffuse glow behind this band — asymmetric, follows xBias */}
            <ellipse
              cx={960 + band.xBias + Math.sin(frame * band.waveSpeed * 0.5 + band.phase) * 80}
              cy={band.yCenter}
              rx={band.xSpread * 0.45}
              ry={band.height * 0.5}
              fill={band.colorBottom}
              opacity={band.opacity * 0.05}
            />
          </g>
        );
      })}

      {/* ─── Bright core lines — asymmetric, left-weighted ─── */}
      {(() => {
        const coreLines = [
          { y: 300, xCenter: 650, width: 1100, opacity: 0.06, speed: 0.01, color: '#50F080' },
          { y: 340, xCenter: 750, width: 900, opacity: 0.04, speed: 0.013, color: '#40D870' },
          { y: 230, xCenter: 550, width: 700, opacity: 0.035, speed: 0.016, color: '#9060D0' },
          { y: 400, xCenter: 800, width: 1000, opacity: 0.03, speed: 0.009, color: '#38C060' },
        ];
        return coreLines.map((line, i) => {
          const xShift = Math.sin(frame * line.speed + i * 1.5) * 80;
          const pulse = 0.4 + 0.6 * Math.abs(longCycleNoise(frame * 0.4, i * 13.7 + 100));
          return (
            <rect
              key={i}
              x={line.xCenter - line.width / 2 + xShift}
              y={line.y - 1.5}
              width={line.width}
              height={3}
              rx={1.5}
              fill={line.color}
              opacity={line.opacity * pulse}
            />
          );
        });
      })()}

      {/* ─── Vertical bright pillars — asymmetric, mostly left side ─── */}
      {(() => {
        const pillars = [
          { x: 280, height: 320, width: 22, phase: 0 },
          { x: 520, height: 380, width: 18, phase: 1.5 },
          { x: 750, height: 280, width: 25, phase: 3.0 },
          { x: 1400, height: 200, width: 14, phase: 4.5 },
        ];
        return pillars.map((p, i) => {
          const cycle = longCycleNoise(frame * 0.2, p.phase * 20 + 200);
          const pillarOpacity = Math.max(0, cycle) * 0.08;
          if (pillarOpacity < 0.01) return null;
          const xWave = Math.sin(frame * 0.008 + p.phase * 0.7) * 30;
          return (
            <g key={i}>
              <defs>
                <linearGradient id={`${ID}-pillar-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8050C0" stopOpacity={0} />
                  <stop offset="20%" stopColor="#8050C0" stopOpacity={pillarOpacity * 0.4} />
                  <stop offset="50%" stopColor="#40E870" stopOpacity={pillarOpacity} />
                  <stop offset="80%" stopColor="#30C860" stopOpacity={pillarOpacity * 0.5} />
                  <stop offset="100%" stopColor="#30C860" stopOpacity={0} />
                </linearGradient>
              </defs>
              <rect
                x={p.x + xWave}
                y={300 - p.height / 2}
                width={p.width}
                height={p.height}
                rx={p.width / 2}
                fill={`url(#${ID}-pillar-${i})`}
              />
              <rect
                x={p.x + xWave - p.width * 0.8}
                y={300 - p.height / 2}
                width={p.width * 2.6}
                height={p.height}
                rx={p.width}
                fill="#40E870"
                opacity={pillarOpacity * 0.1}
              />
            </g>
          );
        });
      })()}

      {/* ─── Scattered faint glow patches — irregular, organic ─── */}
      {(() => {
        const patches = [
          { cx: 380, cy: 250, rx: 120, ry: 60, color: '#30A850', phase: 0 },
          { cx: 680, cy: 350, rx: 90, ry: 50, color: '#28C048', phase: 1.7 },
          { cx: 1100, cy: 200, rx: 70, ry: 45, color: '#7040A0', phase: 3.1 },
          { cx: 200, cy: 380, rx: 100, ry: 40, color: '#38B050', phase: 4.4 },
          { cx: 1500, cy: 300, rx: 60, ry: 35, color: '#6838A0', phase: 2.2 },
        ];
        return patches.map((p, i) => {
          const pulse = 0.3 + 0.7 * Math.abs(longCycleNoise(frame * 0.3, p.phase * 30 + 300));
          const drift = Math.sin(frame * 0.006 + p.phase * 1.3) * 30;
          return (
            <ellipse key={i}
              cx={p.cx + drift} cy={p.cy}
              rx={p.rx} ry={p.ry}
              fill={p.color}
              opacity={0.03 * pulse}
            />
          );
        });
      })()}

      {/* ─── Soft horizon fade — no hard treeline, blends with terrain layers ─── */}
      <defs>
        <linearGradient id={`${ID}-horizon-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060810" stopOpacity={0} />
          <stop offset="40%" stopColor="#060810" stopOpacity={0} />
          <stop offset="70%" stopColor="#060810" stopOpacity={0.3} />
          <stop offset="85%" stopColor="#060810" stopOpacity={0.65} />
          <stop offset="100%" stopColor="#060810" stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <rect x={0} y={600} width={1920} height={480} fill={`url(#${ID}-horizon-fade)`} />

      {/* Aurora reflection on low clouds / horizon */}
      <defs>
        <linearGradient id={`${ID}-reflect`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20A040" stopOpacity={0} />
          <stop offset="80%" stopColor="#20A040" stopOpacity={0} />
          <stop offset="95%" stopColor="#20A040" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#18803A" stopOpacity={0.08} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-reflect)`} />

      {/* Subtle purple horizon reflection */}
      <defs>
        <linearGradient id={`${ID}-preflect`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6030A0" stopOpacity={0} />
          <stop offset="85%" stopColor="#6030A0" stopOpacity={0} />
          <stop offset="100%" stopColor="#6030A0" stopOpacity={0.04} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-preflect)`} />

      {/* Atmospheric haze — very dark, cold */}
      <AtmosphericHaze color="#0A1020" intensity={0.4} horizonY={0.9} id={ID} />

      {/* Dark vignette — slightly left-focused to match aurora concentration */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.4" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="60%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.3} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default NightAurora;
