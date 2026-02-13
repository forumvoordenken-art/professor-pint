/**
 * camp_ground — Kampeerterrein, menselijke nederzetting.
 *
 * Legerkampen, vroege nederzettingen, nomaden, veldtochten.
 * Cleared area with tamped earth, fire pit, logs for seating.
 * Worn paths and flattened grass areas.
 * Warm, lived-in feel.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  HillSilhouette,
  SurfaceScatter,
  GroundMist,
  TerrainTexture,
  generateHillPath,
  generateSurfaceElements,
  renderGrassBlade,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'camp-ground';
const HORIZON = 570;

const GROUND_STOPS = [
  { offset: '0%', color: '#7A6A48' },        // trampled earth
  { offset: '25%', color: '#6A5A3A' },       // packed dirt
  { offset: '50%', color: '#5A4A30' },       // dark earth
  { offset: '80%', color: '#4A3E28' },       // shadow
  { offset: '100%', color: '#3A3220' },      // deep shadow
];

const HILLS = [
  { path: generateHillPath(555, 20, 5, 1801), fill: '#6A8A58', opacity: 0.4, drift: 0.1 },
  { path: generateHillPath(568, 15, 7, 1802), fill: '#5A7A48', opacity: 0.45, drift: 0.15 },
];

// Surrounding grass — edges of camp
const GRASS_COLORS = ['#4A7828', '#5A8838', '#3A6818'];
const EDGE_GRASS = generateSurfaceElements(40, 2903, { x: 0, y: 620, width: 1920, height: 100 }, GRASS_COLORS);
const CORNER_GRASS_L = generateSurfaceElements(25, 2904, { x: 0, y: 700, width: 300, height: 350 }, GRASS_COLORS);
const CORNER_GRASS_R = generateSurfaceElements(25, 2905, { x: 1620, y: 700, width: 300, height: 350 }, GRASS_COLORS);

// Fire pit embers

export const CampGround: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 60} height={120} color="#7A8A60" opacity={0.35} />

      {/* Distant tree line / hills */}
      <HillSilhouette hills={HILLS} frame={frame} idPrefix={`${ID}-h`} />

      {/* Treeline at horizon — dark silhouettes */}
      <g opacity={0.3}>
        {Array.from({ length: 15 }, (_, i) => {
          const x = i * 140 + 30;
          const h = 20 + seededRandom(9900 + i)() * 30;
          return (
            <ellipse key={i} cx={x} cy={HORIZON + 5} rx={35} ry={h} fill="#2A4818" />
          );
        })}
      </g>

      {/* Base ground — packed earth */}
      <GroundPlane id={ID} horizonY={HORIZON + 20} stops={GROUND_STOPS} />

      {/* Worn paths — lighter tracks in the dirt */}
      <path
        d="M400,1080 Q450,900 500,800 Q550,720 650,680 Q800,650 960,660 Q1120,670 1300,700 Q1400,750 1450,850 Q1500,950 1520,1080"
        fill="none" stroke="#8A7A58" strokeWidth={30} opacity={0.12} strokeLinecap="round" />

      {/* Edge grass — surrounding vegetation */}
      <SurfaceScatter elements={EDGE_GRASS} frame={frame} renderElement={renderGrassBlade} />
      <SurfaceScatter elements={CORNER_GRASS_L} frame={frame} renderElement={renderGrassBlade} />
      <SurfaceScatter elements={CORNER_GRASS_R} frame={frame} renderElement={renderGrassBlade} />

      {/* Fire pit — center */}
      <g>
        {/* Stone ring */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = 960 + Math.cos(angle) * 35;
          const y = 800 + Math.sin(angle) * 15;
          return (
            <ellipse key={i} cx={x} cy={y} rx={8} ry={5} fill="#585048" opacity={0.5} />
          );
        })}
        {/* Ash/charcoal center */}
        <ellipse cx={960} cy={800} rx={25} ry={10} fill="#2A2420" opacity={0.4} />
        {/* Embers — glowing dots */}
        {Array.from({ length: 6 }, (_, i) => {
          const glow = longCycleNoise(frame * 0.8, i * 13 + 77);
          const opacity = 0.2 + Math.max(0, glow) * 0.3;
          const ex = 950 + (seededRandom(7700 + i)() - 0.5) * 30;
          const ey = 798 + (seededRandom(7800 + i)() - 0.5) * 8;
          return (
            <g key={i}>
              <circle cx={ex} cy={ey} r={2} fill="#E85020" opacity={opacity} />
              <circle cx={ex} cy={ey} r={5} fill="#D84018" opacity={opacity * 0.2} />
            </g>
          );
        })}
      </g>

      {/* Log seats */}
      {[
        { x: 900, y: 830, angle: -5 },
        { x: 1020, y: 825, angle: 8 },
        { x: 940, y: 770, angle: 3 },
      ].map((log, i) => (
        <g key={i} opacity={0.5} transform={`rotate(${log.angle}, ${log.x + 30}, ${log.y})`}>
          <rect x={log.x} y={log.y} width={60} height={10} rx={5} fill="#5A4828" />
          <rect x={log.x + 2} y={log.y + 1} width={56} height={4} rx={3} fill="#6A5838" opacity={0.5} />
        </g>
      ))}

      {/* Scattered debris — small rocks, twigs */}
      {Array.from({ length: 15 }, (_, i) => {
        const prng = seededRandom(8800 + i);
        return (
          <ellipse key={i}
            cx={400 + prng() * 1120}
            cy={700 + prng() * 300}
            rx={1.5 + prng() * 3}
            ry={1 + prng() * 2}
            fill={prng() > 0.5 ? '#5A4A38' : '#6A5A48'}
            opacity={0.3}
            transform={`rotate(${prng() * 180}, ${400 + prng() * 1120}, ${700 + prng() * 300})`}
          />
        );
      })}

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={510} color="#2A2018" opacity={0.025} seed={4101} />

      {/* Camp smoke/mist — faint */}
      <GroundMist id={ID} y={780} color="#8A8070" opacity={0.08} frame={frame} count={3} seed={5001} />

      {/* Warm firelight glow on ground */}
      <defs>
        <radialGradient id={`${ID}-fire`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#D88030" stopOpacity={0.06 + Math.max(0, longCycleNoise(frame * 0.5, 99)) * 0.03} />
          <stop offset="100%" stopColor="#D88030" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={960} cy={800} rx={200} ry={80} fill={`url(#${ID}-fire)`} />

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

export default CampGround;
