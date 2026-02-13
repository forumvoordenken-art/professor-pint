/**
 * jungle_floor — Dichte tropische jungle bodem.
 *
 * Amazone, Maya, koloniale verkenning, biodiversiteit.
 * Dense tropical floor with roots, fallen leaves, filtered light.
 * Lush greens and browns, humid atmosphere.
 * Dappled sunlight filtering through canopy above.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  GroundMist,
  TerrainTexture,
  generateSurfaceElements,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'jungle-floor';
const HORIZON = 500;

const GROUND_STOPS = [
  { offset: '0%', color: '#3A5020' },        // mossy green
  { offset: '20%', color: '#2E4218' },       // dark forest floor
  { offset: '45%', color: '#2A3818' },       // deep humus
  { offset: '70%', color: '#222E14' },       // shadow floor
  { offset: '100%', color: '#1A2410' },      // darkest
];

// Fallen leaves
const LEAF_COLORS = ['#8A6830', '#6A5020', '#A87838', '#5A4018', '#7A5828', '#4A6020'];
const LEAVES = generateSurfaceElements(40, 2701, { x: 0, y: 600, width: 1920, height: 450 }, LEAF_COLORS);

// Exposed roots
const rng = seededRandom(2702);
const ROOTS = Array.from({ length: 6 }, () => {
  const startX = rng() * 1920;
  const startY = 650 + rng() * 300;
  const segs = 3 + Math.floor(rng() * 3);
  let path = `M${startX},${startY}`;
  for (let j = 0; j < segs; j++) {
    const dx = 30 + rng() * 60;
    const dy = (rng() - 0.3) * 30;
    path += ` q${dx * 0.5},${dy - 10} ${dx},${dy}`;
  }
  return { path, width: 3 + rng() * 5, color: '#4A3818' };
});

// Mushrooms — small colored caps
const MUSHROOMS = Array.from({ length: 8 }, () => ({
  cx: rng() * 1920,
  cy: 680 + rng() * 350,
  r: 3 + rng() * 5,
  color: ['#C86838', '#D88848', '#A85828', '#E8A858'][Math.floor(rng() * 4)],
}));

export const JungleFloor: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Dense canopy shadow — dark top zone */}
      <defs>
        <linearGradient id={`${ID}-canopy`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A1408" stopOpacity={0.4} />
          <stop offset="30%" stopColor="#0A1408" stopOpacity={0.2} />
          <stop offset="60%" stopColor="#0A1408" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#0A1408" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={700} fill={`url(#${ID}-canopy)`} />

      {/* Horizon blend — dark green wall of vegetation */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 80} height={180} color="#1A3010" opacity={0.6} />

      {/* Dense vegetation wall at horizon */}
      <g opacity={0.7}>
        {Array.from({ length: 12 }, (_, i) => {
          const x = i * 170 + (i % 2) * 40;
          const h = 80 + seededRandom(8800 + i)() * 60;
          return (
            <ellipse key={i} cx={x} cy={HORIZON + 20} rx={80} ry={h}
              fill={i % 3 === 0 ? '#1A3808' : i % 3 === 1 ? '#224010' : '#1A2E0A'} />
          );
        })}
      </g>

      {/* Base ground */}
      <GroundPlane id={ID} horizonY={HORIZON + 60} stops={GROUND_STOPS} />

      {/* Exposed tree roots */}
      {ROOTS.map((r, i) => (
        <g key={i}>
          <path d={r.path} fill="none" stroke={r.color} strokeWidth={r.width}
            strokeLinecap="round" opacity={0.6} />
          {/* Root highlight */}
          <path d={r.path} fill="none" stroke="#6A5828" strokeWidth={r.width * 0.3}
            strokeLinecap="round" opacity={0.15} />
        </g>
      ))}

      {/* Fallen leaves */}
      {LEAVES.map((l, i) => {
        const rx = 4 + l.size * 5;
        const ry = rx * 0.5;
        return (
          <ellipse key={i} cx={l.cx} cy={l.cy} rx={rx} ry={ry}
            fill={l.color} opacity={l.opacity * 0.5}
            transform={`rotate(${l.angle * 3}, ${l.cx}, ${l.cy})`} />
        );
      })}

      {/* Mushrooms */}
      {MUSHROOMS.map((m, i) => (
        <g key={i} opacity={0.5}>
          {/* Stem */}
          <rect x={m.cx - 1} y={m.cy} width={2} height={m.r * 1.5} fill="#C8B888" />
          {/* Cap */}
          <ellipse cx={m.cx} cy={m.cy} rx={m.r} ry={m.r * 0.6} fill={m.color} />
          <ellipse cx={m.cx - 1} cy={m.cy - 1} rx={m.r * 0.5} ry={m.r * 0.3} fill="white" opacity={0.1} />
        </g>
      ))}

      {/* Dappled sunlight — filtered through canopy */}
      {Array.from({ length: 6 }, (_, i) => {
        const baseX = 200 + i * 300;
        const baseY = 600 + i * 50;
        const drift = longCycleNoise(frame * 0.1, i * 29) * 40;
        const intensity = 0.06 + Math.max(0, longCycleNoise(frame * 0.08, i * 41)) * 0.06;
        return (
          <g key={i}>
            <defs>
              <radialGradient id={`${ID}-sun-${i}`} cx="0.5" cy="0.3" r="0.5">
                <stop offset="0%" stopColor="#C8D068" stopOpacity={intensity} />
                <stop offset="100%" stopColor="#C8D068" stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={baseX + drift} cy={baseY} rx={100} ry={60}
              fill={`url(#${ID}-sun-${i})`} />
          </g>
        );
      })}

      {/* Moss patches */}
      {[
        { cx: 300, cy: 780, rx: 30, ry: 12 },
        { cx: 900, cy: 850, rx: 25, ry: 10 },
        { cx: 1500, cy: 750, rx: 35, ry: 14 },
      ].map((m, i) => (
        <ellipse key={i} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
          fill="#2A5818" opacity={0.25} />
      ))}

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={580} color="#0A1808" opacity={0.03} seed={3801} />

      {/* Humid mist */}
      <GroundMist id={ID} y={880} color="#2A4020" opacity={0.15} frame={frame} count={6} seed={4701} />

      {/* Green color grade — humid atmosphere */}
      <rect x={0} y={HORIZON} width={1920} height={580} fill="#304820" opacity={0.05} />

      {/* Heavy vignette — dark jungle framing */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.6" r="0.7">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="60%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.3} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default JungleFloor;
