/**
 * sand_flat — Vlak woestijnzand, eindeloze horizon.
 *
 * Egypte, woestijnverhalen, isolatie, doortocht.
 * Flat endless desert with subtle wind-blown sand patterns.
 * Heat shimmer near horizon. Scattered rocks.
 * Warm ochre/gold palette.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  SurfaceScatter,
  GroundMist,
  TerrainTexture,
  generateSurfaceElements,
  renderPebble,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'sand-flat';
const HORIZON = 560;

const GROUND_STOPS = [
  { offset: '0%', color: '#D8B878' },        // sunlit sand
  { offset: '20%', color: '#C8A868' },       // warm sand
  { offset: '45%', color: '#B89858' },       // mid sand
  { offset: '70%', color: '#A88848' },       // deeper sand
  { offset: '100%', color: '#987838' },      // shadow sand
];

// Scattered rocks — dark desert stones
const ROCKS = generateSurfaceElements(25, 2201, { x: 0, y: 620, width: 1920, height: 400 },
  ['#7A6848', '#6A5838', '#8A7858', '#5A4828', '#7A6A50']);

// Sand ripple lines — wind-blown patterns
const rng = seededRandom(3201);
const SAND_RIPPLES = Array.from({ length: 12 }, () => ({
  y: 640 + rng() * 380,
  x1: rng() * 400,
  length: 300 + rng() * 600,
  curve: (rng() - 0.5) * 20,
  opacity: 0.06 + rng() * 0.08,
}));

export const SandFlat: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon blend — heat haze */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 80} height={160} color="#D8C090" opacity={0.5} />

      {/* Heat shimmer — wavy distortion hint near horizon */}
      <g opacity={0.06}>
        {Array.from({ length: 8 }, (_, i) => {
          const shimX = i * 250 + 50;
          const shimY = HORIZON + 10 + longCycleNoise(frame * 0.8, i * 19) * 8;
          return (
            <ellipse key={i} cx={shimX} cy={shimY} rx={120} ry={3 + Math.abs(longCycleNoise(frame * 0.4, i * 31)) * 4}
              fill="#F0D890" />
          );
        })}
      </g>

      {/* Base ground */}
      <GroundPlane id={ID} horizonY={HORIZON} stops={GROUND_STOPS} />

      {/* Sand ripple lines — wind patterns */}
      {SAND_RIPPLES.map((r, i) => {
        const drift = longCycleNoise(frame * 0.15, i * 23 + 100) * 15;
        return (
          <path key={i}
            d={`M${r.x1 + drift},${r.y} Q${r.x1 + r.length / 2},${r.y + r.curve} ${r.x1 + r.length + drift},${r.y}`}
            fill="none" stroke="#E8C888" strokeWidth={1.2} opacity={r.opacity} />
        );
      })}

      {/* Wind-blown sand particles — very subtle */}
      <g opacity={0.08}>
        {Array.from({ length: 30 }, (_, i) => {
          const prng = seededRandom(7700 + i);
          const baseX = prng() * 2200 - 140;
          const baseY = HORIZON + 40 + prng() * 300;
          const windX = (frame * (0.3 + prng() * 0.4)) % 2200 - 140;
          return (
            <circle key={i} cx={(baseX + windX) % 2200 - 140} cy={baseY + longCycleNoise(frame * 0.5, i * 11) * 3}
              r={0.8 + prng() * 1.2} fill="#D8C080" />
          );
        })}
      </g>

      {/* Sunlight patch — hot spot on sand */}
      <defs>
        <radialGradient id={`${ID}-hot`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F0E0A0" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#F0E0A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={960 + longCycleNoise(frame * 0.05, 77) * 50} cy={750}
        rx={400} ry={150} fill={`url(#${ID}-hot)`} />

      {/* Scattered rocks */}
      <SurfaceScatter elements={ROCKS} frame={frame} renderElement={renderPebble} />

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={520} color="#8A7040" opacity={0.02} seed={3201} />

      {/* Heat haze mist */}
      <GroundMist id={ID} y={HORIZON + 30} color="#E0D0A0" opacity={0.08} frame={frame} count={4} seed={4201} />

      {/* Warm color grade */}
      <rect x={0} y={HORIZON} width={1920} height={520} fill="#F0D080" opacity={0.04} />

      {/* Bottom shadow */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="90%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default SandFlat;
