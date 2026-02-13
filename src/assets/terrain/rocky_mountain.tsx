/**
 * rocky_mountain — Rotsachtig bergterrein, ruig.
 *
 * Oorlog, expedities, geologische periodes, vulkanen.
 * Dramatic rocky terrain with boulders and cliff faces.
 * Layered stone formations in greys and browns.
 * Sparse lichen and moss patches for color.
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
  seededRandom,
} from './TerrainEngine';

const ID = 'rocky-mountain';
const HORIZON = 450;

const GROUND_STOPS = [
  { offset: '0%', color: '#686058' },
  { offset: '30%', color: '#585048' },
  { offset: '60%', color: '#484038' },
  { offset: '100%', color: '#383028' },
];

// Jagged mountain silhouettes — sharp, angular
const MOUNTAINS_FAR = [
  { path: 'M0,1080 L0,420 L180,380 L350,440 L480,350 L620,420 L780,330 L920,400 L1080,360 L1200,420 L1380,340 L1520,400 L1680,370 L1800,430 L1920,390 L1920,1080 Z',
    fill: '#5A6878', opacity: 0.5, drift: 0.08 },
];

const MOUNTAINS_MID = [
  { path: 'M0,1080 L0,500 L150,460 L280,520 L420,440 L580,510 L720,430 L880,490 L1020,450 L1180,520 L1300,440 L1480,500 L1620,450 L1780,510 L1920,470 L1920,1080 Z',
    fill: '#5A5848', opacity: 0.65, drift: 0.15 },
];

const ROCKS_NEAR = [
  { path: generateHillPath(620, 50, 4, 1501), fill: '#585048', opacity: 0.8, drift: 0.25 },
];

// Boulder shapes
const rng = seededRandom(2501);
const BOULDERS = Array.from({ length: 8 }, () => ({
  cx: rng() * 1920,
  cy: 650 + rng() * 350,
  rx: 20 + rng() * 50,
  ry: 15 + rng() * 35,
  color: ['#585048', '#686058', '#504840', '#686860'][Math.floor(rng() * 4)],
  angle: (rng() - 0.5) * 20,
}));

// Rock face cracks
const CRACKS = Array.from({ length: 12 }, () => {
  const x = rng() * 1920;
  const y = 550 + rng() * 400;
  const segs = 2 + Math.floor(rng() * 3);
  let path = `M${x},${y}`;
  for (let j = 0; j < segs; j++) {
    path += ` l${(rng() - 0.5) * 40},${rng() * 30}`;
  }
  return { path, opacity: 0.1 + rng() * 0.08 };
});

export const RockyMountain: React.FC<AssetProps> = ({ frame }) => {
  const mountains = useMemo(() => ({
    far: MOUNTAINS_FAR, mid: MOUNTAINS_MID, near: ROCKS_NEAR,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon — mountain haze */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 100} height={200} color="#6A7080" opacity={0.35} />

      {/* Far mountains — blue atmospheric */}
      <HillSilhouette hills={mountains.far} frame={frame} idPrefix={`${ID}-mf`} />

      {/* Snow patches on far mountains */}
      <g opacity={0.15}>
        <polygon points="480,350 520,370 440,370" fill="#C8D0D8" />
        <polygon points="780,330 830,360 730,355" fill="#C0C8D0" />
        <polygon points="1380,340 1420,365 1340,360" fill="#C8D0D8" />
      </g>

      {/* Mid mountains */}
      <HillSilhouette hills={mountains.mid} frame={frame} idPrefix={`${ID}-mm`} />

      {/* Near rocky terrain */}
      <HillSilhouette hills={mountains.near} frame={frame} idPrefix={`${ID}-rn`} />

      {/* Base ground */}
      <GroundPlane id={ID} horizonY={640} stops={GROUND_STOPS} />

      {/* Rock strata lines — layered stone formations */}
      <g opacity={0.08}>
        {Array.from({ length: 6 }, (_, i) => {
          const y = 660 + i * 55;
          return (
            <line key={i} x1={0} y1={y} x2={1920} y2={y + (i % 2 === 0 ? 5 : -5)}
              stroke="#3A3228" strokeWidth={1.5} />
          );
        })}
      </g>

      {/* Rock face cracks */}
      {CRACKS.map((c, i) => (
        <path key={i} d={c.path} fill="none" stroke="#2A2218" strokeWidth={0.8}
          opacity={c.opacity} strokeLinecap="round" />
      ))}

      {/* Boulders */}
      {BOULDERS.map((b, i) => (
        <g key={i}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color}
            transform={`rotate(${b.angle}, ${b.cx}, ${b.cy})`} />
          {/* Boulder highlight */}
          <ellipse cx={b.cx - b.rx * 0.2} cy={b.cy - b.ry * 0.3} rx={b.rx * 0.5} ry={b.ry * 0.4}
            fill="white" opacity={0.05}
            transform={`rotate(${b.angle}, ${b.cx}, ${b.cy})`} />
          {/* Boulder shadow */}
          <ellipse cx={b.cx + 3} cy={b.cy + b.ry * 0.8} rx={b.rx * 0.8} ry={b.ry * 0.2}
            fill="#1A1810" opacity={0.1} />
        </g>
      ))}

      {/* Lichen/moss patches — green spots on rocks */}
      {[
        { cx: 380, cy: 720, r: 8 }, { cx: 1200, cy: 780, r: 6 },
        { cx: 800, cy: 850, r: 10 }, { cx: 1600, cy: 700, r: 7 },
      ].map((m, i) => (
        <circle key={i} cx={m.cx} cy={m.cy} r={m.r} fill="#4A6838" opacity={0.2} />
      ))}

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={630} color="#1A1810" opacity={0.025} seed={3601} />

      {/* Mountain mist */}
      <GroundMist id={ID} y={920} color="#6A7080" opacity={0.12} frame={frame} count={5} seed={4501} />

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

export default RockyMountain;
