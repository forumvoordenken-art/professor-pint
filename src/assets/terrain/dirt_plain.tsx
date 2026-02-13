/**
 * dirt_plain — Neutrale bruine aarde, kale vlakte.
 *
 * Overgangsscènes, armoede, droogte, transitie.
 * Bare brown earth — not lush, not desert. Just earth.
 * Subtle cracks in dry soil, sparse dead grass patches.
 * Most neutral terrain — works as transition between themes.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  HillSilhouette,
  SurfaceScatter,
  TerrainTexture,
  generateHillPath,
  generateSurfaceElements,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'dirt-plain';
const HORIZON = 570;

const GROUND_STOPS = [
  { offset: '0%', color: '#8A7458' },
  { offset: '25%', color: '#7A6448' },
  { offset: '50%', color: '#6A5438' },
  { offset: '75%', color: '#5A4830' },
  { offset: '100%', color: '#4A3C28' },
];

const HILLS = [
  { path: generateHillPath(555, 20, 6, 1301), fill: '#8A7A68', opacity: 0.4, drift: 0.15 },
  { path: generateHillPath(570, 15, 8, 1302), fill: '#7A6A58', opacity: 0.45, drift: 0.1 },
];

// Sparse dead grass — yellowed, dry
const DEAD_GRASS = generateSurfaceElements(30, 2301, { x: 0, y: 650, width: 1920, height: 380 },
  ['#9A8860', '#8A7850', '#A89870', '#7A6A48']);

// Pebbles and small stones
const PEBBLES = generateSurfaceElements(35, 2302, { x: 0, y: 620, width: 1920, height: 420 },
  ['#6A5A48', '#7A6A58', '#5A4A38', '#8A7A68']);

// Soil cracks — thin dark lines
const rng = seededRandom(6301);
const CRACKS = Array.from({ length: 8 }, () => {
  const cx = rng() * 1920;
  const cy = 650 + rng() * 350;
  const segs = 3 + Math.floor(rng() * 4);
  let path = `M${cx},${cy}`;
  for (let j = 0; j < segs; j++) {
    const dx = (rng() - 0.5) * 80;
    const dy = rng() * 40;
    path += ` l${dx},${dy}`;
  }
  return { path, opacity: 0.08 + rng() * 0.06 };
});

export const DirtPlain: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon — dusty brown */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 60} height={120} color="#9A8A70" opacity={0.4} />

      {/* Low hills */}
      <HillSilhouette hills={HILLS} frame={frame} idPrefix={`${ID}-h`} />

      {/* Base ground */}
      <GroundPlane id={ID} horizonY={HORIZON + 10} stops={GROUND_STOPS} />

      {/* Dry soil cracks */}
      {CRACKS.map((c, i) => (
        <path key={i} d={c.path} fill="none" stroke="#3A2E20" strokeWidth={0.8}
          opacity={c.opacity} strokeLinecap="round" />
      ))}

      {/* Dust patches — lighter spots */}
      {[{ cx: 400, cy: 750 }, { cx: 1100, cy: 820 }, { cx: 1600, cy: 700 }].map((p, i) => {
        const drift = longCycleNoise(frame * 0.08, i * 23) * 20;
        return (
          <ellipse key={i} cx={p.cx + drift} cy={p.cy} rx={150} ry={60}
            fill="#A89878" opacity={0.08} />
        );
      })}

      {/* Pebbles */}
      <SurfaceScatter elements={PEBBLES} frame={frame} renderElement={(el, i) => {
        const r = 1.5 + el.size * 2.5;
        return (
          <g key={i} opacity={el.opacity}>
            <ellipse cx={el.cx} cy={el.cy} rx={r} ry={r * 0.65}
              fill={el.color} transform={`rotate(${el.angle}, ${el.cx}, ${el.cy})`} />
          </g>
        );
      }} />

      {/* Dead grass tufts */}
      {DEAD_GRASS.map((el, i) => {
        const sway = longCycleNoise(frame * 0.3, el.seed) * 4;
        const h = 5 + el.size * 8;
        return (
          <g key={i} opacity={el.opacity * 0.6}>
            <line x1={el.cx} y1={el.cy} x2={el.cx + sway - 2} y2={el.cy - h}
              stroke={el.color} strokeWidth={0.8} strokeLinecap="round" />
            <line x1={el.cx + 2} y1={el.cy} x2={el.cx + sway + 3} y2={el.cy - h * 0.8}
              stroke={el.color} strokeWidth={0.6} strokeLinecap="round" />
          </g>
        );
      })}

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={510} color="#3A2E20" opacity={0.025} seed={3401} />

      {/* Faint dust in air */}
      <g opacity={0.04}>
        {Array.from({ length: 15 }, (_, i) => {
          const x = (i * 137 + frame * 0.2) % 2000;
          const y = HORIZON + 20 + longCycleNoise(frame * 0.3, i * 17) * 40;
          return <circle key={i} cx={x} cy={y} r={1.5} fill="#C8B898" />;
        })}
      </g>

      {/* Bottom darken */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="88%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default DirtPlain;
