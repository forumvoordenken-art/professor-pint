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

const AURORA_BANDS: AuroraBand[] = [
  // Main bright curtain — dominant green-to-purple
  {
    yCenter: 300, height: 320, rayCount: 80, opacity: 0.35,
    colorBottom: '#40E870', colorTop: '#8040C0',
    waveSpeed: 0.012, waveAmp: 50, shimmerSpeed: 0.04, phase: 0, seed: 5001,
  },
  // Secondary curtain — shifted right, slightly dimmer
  {
    yCenter: 280, height: 280, rayCount: 60, opacity: 0.22,
    colorBottom: '#30D060', colorTop: '#6030A8',
    waveSpeed: 0.015, waveAmp: 40, shimmerSpeed: 0.035, phase: 1.8, seed: 5002,
  },
  // High purple fringe — delicate upper edge
  {
    yCenter: 180, height: 200, rayCount: 40, opacity: 0.15,
    colorBottom: '#50B868', colorTop: '#A050D8',
    waveSpeed: 0.018, waveAmp: 30, shimmerSpeed: 0.05, phase: 0.7, seed: 5003,
  },
  // Low green wash — broad, diffuse base
  {
    yCenter: 420, height: 200, rayCount: 50, opacity: 0.18,
    colorBottom: '#28C850', colorTop: '#38A850',
    waveSpeed: 0.008, waveAmp: 60, shimmerSpeed: 0.03, phase: 2.5, seed: 5004,
  },
  // Faint pink/magenta accent — rare color in real aurora
  {
    yCenter: 240, height: 160, rayCount: 30, opacity: 0.10,
    colorBottom: '#D060A0', colorTop: '#8030B0',
    waveSpeed: 0.02, waveAmp: 25, shimmerSpeed: 0.06, phase: 3.2, seed: 5005,
  },
];

/** Generates ray data for a single aurora band */
function generateRays(band: AuroraBand) {
  const rng = seededRandom(band.seed);
  return Array.from({ length: band.rayCount }, () => ({
    x: rng() * 2200 - 140,
    widthBase: 3 + rng() * 12,
    heightMult: 0.5 + rng() * 0.5,
    brightnessPhase: rng() * Math.PI * 2,
    brightnessMult: 0.4 + rng() * 0.6,
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

      {/* Aurora glow — overall atmospheric green glow behind curtains */}
      <defs>
        <radialGradient id={`${ID}-aglow`} cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#20A040" stopOpacity={0.08} />
          <stop offset="50%" stopColor="#18803A" stopOpacity={0.04} />
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

              // Brightness shimmer: each ray pulses independently
              const shimmer = 0.3 + 0.7 * Math.abs(Math.sin(
                frame * band.shimmerSpeed + ray.brightnessPhase
              ));
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

            {/* Diffuse glow behind this band — soft wide ellipse */}
            <ellipse
              cx={960 + Math.sin(frame * band.waveSpeed * 0.5 + band.phase) * 100}
              cy={band.yCenter}
              rx={800}
              ry={band.height * 0.6}
              fill={band.colorBottom}
              opacity={band.opacity * 0.06}
            />
          </g>
        );
      })}

      {/* ─── Bright core lines — horizontal brightness peaks ─── */}
      {(() => {
        const coreLines = [
          { y: 280, width: 1400, opacity: 0.08, speed: 0.01, color: '#50F080' },
          { y: 320, width: 1200, opacity: 0.06, speed: 0.013, color: '#40D870' },
          { y: 250, width: 1000, opacity: 0.05, speed: 0.016, color: '#9060D0' },
          { y: 380, width: 1100, opacity: 0.04, speed: 0.009, color: '#38C060' },
        ];
        return coreLines.map((line, i) => {
          const xShift = Math.sin(frame * line.speed + i * 1.5) * 120;
          const pulse = 0.5 + 0.5 * Math.sin(frame * 0.025 + i * 2);
          return (
            <rect
              key={i}
              x={960 - line.width / 2 + xShift}
              y={line.y - 2}
              width={line.width}
              height={4}
              rx={2}
              fill={line.color}
              opacity={line.opacity * pulse}
            />
          );
        });
      })()}

      {/* ─── Vertical bright pillars — occasional intense columns ─── */}
      {(() => {
        const pillars = [
          { x: 600, height: 350, width: 30, phase: 0 },
          { x: 900, height: 400, width: 25, phase: 1.2 },
          { x: 1200, height: 320, width: 35, phase: 2.4 },
          { x: 1500, height: 280, width: 20, phase: 3.6 },
          { x: 350, height: 300, width: 22, phase: 4.8 },
        ];
        return pillars.map((p, i) => {
          const cycle = Math.sin(frame * 0.015 + p.phase);
          const pillarOpacity = Math.max(0, cycle) * 0.12;
          if (pillarOpacity < 0.01) return null;
          const xWave = Math.sin(frame * 0.01 + p.phase * 0.7) * 40;
          return (
            <g key={i}>
              <defs>
                <linearGradient id={`${ID}-pillar-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8050C0" stopOpacity={0} />
                  <stop offset="20%" stopColor="#8050C0" stopOpacity={pillarOpacity * 0.5} />
                  <stop offset="50%" stopColor="#40E870" stopOpacity={pillarOpacity} />
                  <stop offset="80%" stopColor="#30C860" stopOpacity={pillarOpacity * 0.6} />
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
              {/* Soft glow around pillar */}
              <rect
                x={p.x + xWave - p.width}
                y={300 - p.height / 2}
                width={p.width * 3}
                height={p.height}
                rx={p.width}
                fill="#40E870"
                opacity={pillarOpacity * 0.15}
              />
            </g>
          );
        });
      })()}

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

      {/* Dark vignette — focus on the aurora */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="65%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default NightAurora;
