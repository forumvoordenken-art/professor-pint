/**
 * sand_dunes — Dramatische zandduinen, golvend.
 *
 * Avontuur, woestijnontdekking, karavanen, Sahara-verhalen.
 * Rolling sand dunes with dramatic light/shadow interplay.
 * Wind-blown sand streaks along dune crests.
 * Warm golden palette with cool blue shadows.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  HillSilhouette,
  GroundMist,
  TerrainTexture,
  generateHillPath,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'sand-dunes';
const HORIZON = 500;

const GROUND_STOPS = [
  { offset: '0%', color: '#D8B070' },
  { offset: '30%', color: '#C8A060' },
  { offset: '60%', color: '#B89050' },
  { offset: '100%', color: '#A07840' },
];

// Dune shapes — smooth, rolling, dramatic curves
const DUNES_FAR = [
  { path: generateHillPath(480, 50, 3, 1201), fill: '#C8A870', opacity: 0.5, drift: 0.1 },
  { path: generateHillPath(500, 40, 4, 1202), fill: '#B89860', opacity: 0.55, drift: 0.15 },
];

const DUNES_MID = [
  { path: generateHillPath(560, 60, 3, 1203), fill: '#C8A060', opacity: 0.7, drift: 0.25 },
  { path: generateHillPath(590, 45, 4, 1204), fill: '#B89050', opacity: 0.65, drift: 0.3 },
];

const DUNES_NEAR = [
  { path: generateHillPath(680, 70, 2, 1205), fill: '#D8B878', opacity: 0.85, drift: 0.4 },
  { path: generateHillPath(720, 50, 3, 1206), fill: '#C8A868', opacity: 0.75, drift: 0.35 },
];

// Wind-blown crest sand
const rng = seededRandom(5201);
const CREST_PARTICLES = Array.from({ length: 40 }, () => ({
  x: rng() * 1920,
  y: 500 + rng() * 250,
  speed: 0.5 + rng() * 1.0,
  size: 0.5 + rng() * 1.5,
  opacity: 0.05 + rng() * 0.1,
}));

export const SandDunes: React.FC<AssetProps> = ({ frame }) => {
  const dunes = useMemo(() => ({
    far: DUNES_FAR, mid: DUNES_MID, near: DUNES_NEAR,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon — dusty, warm */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 100} height={200} color="#D8C090" opacity={0.45} />

      {/* Far dunes — atmospheric */}
      <HillSilhouette hills={dunes.far} frame={frame} idPrefix={`${ID}-df`} />

      {/* Shadow sides of far dunes — cool blue tint */}
      <defs>
        <linearGradient id={`${ID}-dshadow`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4A5878" stopOpacity={0.08} />
          <stop offset="30%" stopColor="#4A5878" stopOpacity={0} />
          <stop offset="70%" stopColor="#4A5878" stopOpacity={0} />
          <stop offset="100%" stopColor="#4A5878" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON - 20} width={1920} height={300} fill={`url(#${ID}-dshadow)`} />

      {/* Mid dunes */}
      <HillSilhouette hills={dunes.mid} frame={frame} idPrefix={`${ID}-dm`} />

      {/* Dune ridge highlights — lit crests */}
      {[580, 620, 700].map((y, i) => (
        <path key={i}
          d={`M${100 + i * 200},${y} Q${500 + i * 200},${y - 12} ${900 + i * 200},${y}`}
          fill="none" stroke="#F0D890" strokeWidth={1.5} opacity={0.12} />
      ))}

      {/* Near dunes */}
      <HillSilhouette hills={dunes.near} frame={frame} idPrefix={`${ID}-dn`} />

      {/* Base ground fill */}
      <GroundPlane id={ID} horizonY={700} stops={GROUND_STOPS} />

      {/* Sand ripples on near dune face */}
      <g opacity={0.08}>
        {Array.from({ length: 15 }, (_, i) => {
          const y = 720 + i * 22;
          const drift = longCycleNoise(frame * 0.1, i * 17) * 8;
          return (
            <line key={i} x1={200 + drift} y1={y} x2={1720 + drift} y2={y + 3}
              stroke="#E8C878" strokeWidth={0.8} />
          );
        })}
      </g>

      {/* Wind-blown crest sand — particles streaming off dune tops */}
      <g>
        {CREST_PARTICLES.map((p, i) => {
          const windX = (frame * p.speed) % 2200 - 140;
          const waveY = longCycleNoise(frame * 0.4, i * 13) * 5;
          return (
            <circle key={i}
              cx={(p.x + windX) % 2200 - 140}
              cy={p.y + waveY}
              r={p.size}
              fill="#D8C080"
              opacity={p.opacity}
            />
          );
        })}
      </g>

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={580} color="#8A7040" opacity={0.02} seed={3301} />

      {/* Sand haze — low mist */}
      <GroundMist id={ID} y={950} color="#D8C898" opacity={0.1} frame={frame} count={5} seed={4301} />

      {/* Warm overlay */}
      <rect x={0} y={HORIZON} width={1920} height={580} fill="#F8D888" opacity={0.03} />

      {/* Bottom darken */}
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

export default SandDunes;
