/**
 * indoor_floor — Stenen/houten binnenvloer.
 *
 * Past bij indoor_ceiling sky. Pubs, kerken, kastelen, musea.
 * Stone or wood plank floor with worn texture.
 * Warm lantern light reflections.
 * Pairs with indoor_ceiling sky for full indoor scenes.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  TerrainTexture,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'indoor-floor';
const FLOOR_START = 620;

// Stone tiles — irregular flagstone pattern
const rng = seededRandom(3001);
const TILES: Array<{
  points: string; fill: string; highlight: boolean;
}> = [];

// Generate flagstone grid with irregular shapes
for (let row = 0; row < 10; row++) {
  const y = FLOOR_START + row * 46;
  const tileWidth = 120 + row * 5; // Perspective
  const tilesPerRow = Math.ceil(1920 / tileWidth) + 1;
  const offsetX = (row % 2) * tileWidth * 0.35;

  for (let col = 0; col < tilesPerRow; col++) {
    const x = col * tileWidth + offsetX;
    const jitter = () => (rng() - 0.5) * 8;

    // Irregular quadrilateral
    const x1 = x + jitter();
    const y1 = y + jitter();
    const x2 = x + tileWidth + jitter();
    const y2 = y + jitter();
    const x3 = x + tileWidth + jitter();
    const y3 = y + 46 + jitter();
    const x4 = x + jitter();
    const y4 = y + 46 + jitter();

    const colors = ['#4A3E30', '#504438', '#3E3428', '#584C40', '#4A4035'];
    TILES.push({
      points: `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`,
      fill: colors[Math.floor(rng() * colors.length)],
      highlight: rng() > 0.7,
    });
  }
}

// Mortar line color
const MORTAR = '#2A2218';

export const IndoorFloor: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Wall base — transition from wall to floor */}
      <defs>
        <linearGradient id={`${ID}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3028" stopOpacity={0} />
          <stop offset="50%" stopColor="#3A3028" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#3A3028" stopOpacity={0.8} />
        </linearGradient>
      </defs>
      <rect x={0} y={FLOOR_START - 80} width={1920} height={80} fill={`url(#${ID}-wall)`} />

      {/* Base floor color — mortar/grout */}
      <rect x={0} y={FLOOR_START} width={1920} height={460} fill={MORTAR} />

      {/* Stone tiles */}
      {TILES.map((t, i) => (
        <g key={i}>
          <polygon points={t.points} fill={t.fill} />
          {/* Worn highlight on some tiles */}
          {t.highlight && (
            <polygon points={t.points} fill="white" opacity={0.03} />
          )}
        </g>
      ))}

      {/* Grout lines — dark between tiles */}
      <g opacity={0.15}>
        {Array.from({ length: 11 }, (_, i) => {
          const y = FLOOR_START + i * 46;
          return <line key={i} x1={0} y1={y} x2={1920} y2={y}
            stroke={MORTAR} strokeWidth={2} />;
        })}
      </g>

      {/* Lantern light pools on floor — warm circles */}
      {[
        { cx: 400, cy: 780, seed: 10 },
        { cx: 960, cy: 750, seed: 20 },
        { cx: 1520, cy: 790, seed: 30 },
      ].map((light, i) => {
        const flicker = longCycleNoise(frame * 0.6, light.seed) * 0.02;
        return (
          <g key={i}>
            <defs>
              <radialGradient id={`${ID}-light-${i}`} cx="0.5" cy="0.3" r="0.5">
                <stop offset="0%" stopColor="#D8A050" stopOpacity={0.1 + flicker} />
                <stop offset="50%" stopColor="#C89040" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#C89040" stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={light.cx} cy={light.cy} rx={200} ry={100}
              fill={`url(#${ID}-light-${i})`} />
          </g>
        );
      })}

      {/* Worn patches — darker areas from foot traffic */}
      <g opacity={0.06}>
        <ellipse cx={960} cy={800} rx={250} ry={80} fill="#1A1810" />
        <ellipse cx={500} cy={850} rx={150} ry={60} fill="#1A1810" />
      </g>

      {/* Dust on floor — small particles in light */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = 300 + i * 130;
        const y = 720 + (i % 3) * 80;
        const visible = longCycleNoise(frame * 0.4, i * 17);
        if (visible < 0.2) return null;
        return (
          <circle key={i} cx={x} cy={y} r={1} fill="#C8B898" opacity={0.08} />
        );
      })}

      {/* Baseboards / wall-floor junction — dark line */}
      <rect x={0} y={FLOOR_START - 3} width={1920} height={6} fill="#2A2018" opacity={0.4} />

      {/* Texture */}
      <TerrainTexture id={ID} y={FLOOR_START} height={460} color="#1A1810" opacity={0.02} seed={4201} />

      {/* Warm color grade */}
      <rect x={0} y={FLOOR_START} width={1920} height={460} fill="#D8A050" opacity={0.03} />

      {/* Heavy vignette — dark room edges */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.7" r="0.6">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="50%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.3} />
        </radialGradient>
      </defs>
      <rect x={0} y={FLOOR_START} width={1920} height={460} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default IndoorFloor;
