/**
 * cobblestone — Keienstenen straat, stad, marktplein.
 *
 * Middeleeuwen, Renaissance, stadsverhalen, handel.
 * Cobblestone/brick street surface with gutters.
 * Puddle reflections after rain. Worn stone texture.
 * Warm greys and browns, medieval town feel.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  TerrainTexture,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'cobblestone';
const HORIZON = 560;

const GROUND_STOPS = [
  { offset: '0%', color: '#787068' },
  { offset: '25%', color: '#6A6258' },
  { offset: '55%', color: '#5A5248' },
  { offset: '80%', color: '#4A4238' },
  { offset: '100%', color: '#3A3228' },
];

// Generate cobblestone grid
const rng = seededRandom(1401);
const STONES: Array<{
  cx: number; cy: number; rx: number; ry: number;
  color: string; highlight: number; angle: number;
}> = [];

const STONE_COLORS = ['#706860', '#686058', '#787068', '#605850', '#7A7268', '#585048'];

// Create rows of cobblestones from horizon downward
for (let row = 0; row < 18; row++) {
  const y = HORIZON + 30 + row * 28;
  const stoneWidth = 28 + row * 1.5; // Perspective: larger as closer
  const stoneHeight = 14 + row * 0.8;
  const stonesPerRow = Math.ceil(1920 / stoneWidth) + 1;
  const offsetX = (row % 2) * stoneWidth * 0.5; // Brick offset

  for (let col = 0; col < stonesPerRow; col++) {
    const cx = col * stoneWidth + offsetX + (rng() - 0.5) * 4;
    const cy = y + (rng() - 0.5) * 3;
    STONES.push({
      cx,
      cy,
      rx: stoneWidth * 0.42 + (rng() - 0.5) * 3,
      ry: stoneHeight * 0.42 + (rng() - 0.5) * 2,
      color: STONE_COLORS[Math.floor(rng() * STONE_COLORS.length)],
      highlight: rng(),
      angle: (rng() - 0.5) * 8,
    });
  }
}

// Puddles — scattered reflective spots
const PUDDLES = Array.from({ length: 4 }, () => ({
  cx: 200 + rng() * 1520,
  cy: 680 + rng() * 300,
  rx: 30 + rng() * 60,
  ry: 10 + rng() * 20,
}));

export const Cobblestone: React.FC<AssetProps> = ({ frame }) => {
  // Only render stones visible on screen (performance optimization)
  const visibleStones = useMemo(() =>
    STONES.filter(s => s.cx > -50 && s.cx < 1970),
  []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon blend — building/sky transition */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 50} height={100} color="#787068" opacity={0.35} />

      {/* Base ground — gap fill */}
      <GroundPlane id={ID} horizonY={HORIZON} stops={GROUND_STOPS} />

      {/* Mortar lines — dark grid between stones */}
      <rect x={0} y={HORIZON + 20} width={1920} height={500} fill="#2A2420" opacity={0.3} />

      {/* Cobblestones */}
      {visibleStones.map((s, i) => (
        <g key={i}>
          {/* Stone body */}
          <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.color}
            transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
          {/* Top highlight — worn smooth surface */}
          {s.highlight > 0.6 && (
            <ellipse cx={s.cx - 1} cy={s.cy - s.ry * 0.2} rx={s.rx * 0.5} ry={s.ry * 0.3}
              fill="white" opacity={0.06}
              transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
          )}
        </g>
      ))}

      {/* Gutter lines — darker channels */}
      <line x1={300} y1={HORIZON + 30} x2={280} y2={1080}
        stroke="#2A2218" strokeWidth={8} opacity={0.15} />
      <line x1={1620} y1={HORIZON + 30} x2={1640} y2={1080}
        stroke="#2A2218" strokeWidth={8} opacity={0.15} />

      {/* Puddles — reflective water spots */}
      {PUDDLES.map((p, i) => {
        const shimmer = longCycleNoise(frame * 0.3, i * 31) * 0.03;
        return (
          <g key={i}>
            <defs>
              <radialGradient id={`${ID}-puddle-${i}`} cx="0.5" cy="0.4" r="0.5">
                <stop offset="0%" stopColor="#506878" stopOpacity={0.3 + shimmer} />
                <stop offset="70%" stopColor="#405060" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#405060" stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
              fill={`url(#${ID}-puddle-${i})`} />
            {/* Reflection highlight */}
            <ellipse cx={p.cx + 3} cy={p.cy - 2} rx={p.rx * 0.3} ry={p.ry * 0.4}
              fill="white" opacity={0.04 + shimmer} />
          </g>
        );
      })}

      {/* Wear patterns — darker patches on high-traffic areas */}
      <g opacity={0.06}>
        <ellipse cx={960} cy={800} rx={300} ry={80} fill="#2A2018" />
        <ellipse cx={500} cy={900} rx={200} ry={60} fill="#2A2018" />
      </g>

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={520} color="#2A2218" opacity={0.02} seed={3501} />

      {/* Bottom darken */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="85%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default Cobblestone;
