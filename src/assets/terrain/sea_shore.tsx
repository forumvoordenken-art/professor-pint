/**
 * sea_shore — Strand met golven, zand en schuim.
 *
 * Zeevaarders, ontdekkingsreizen, invasies, kustculturen.
 * Sandy beach with waves rolling in and foam.
 * Wet sand reflections near waterline.
 * Shells and driftwood scattered on beach.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  WaterSurface,
  TerrainTexture,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'sea-shore';
const HORIZON = 540;
const WAVE_LINE = 700;

const SAND_STOPS = [
  { offset: '0%', color: '#C8B888' },        // dry sand
  { offset: '30%', color: '#B8A878' },       // mid sand
  { offset: '60%', color: '#A89868' },       // damp sand
  { offset: '100%', color: '#988858' },      // shadow sand
];

// Shells and debris
const rng = seededRandom(2901);
const SHELLS = Array.from({ length: 12 }, () => ({
  cx: rng() * 1920,
  cy: WAVE_LINE + 20 + rng() * 300,
  r: 2 + rng() * 4,
  color: ['#E8D8C0', '#D8C8B0', '#C8B8A0', '#F0E0C8'][Math.floor(rng() * 4)],
  angle: rng() * 360,
}));

// Driftwood pieces
const DRIFTWOOD = Array.from({ length: 3 }, () => ({
  x: rng() * 1600 + 160,
  y: WAVE_LINE + 40 + rng() * 200,
  length: 40 + rng() * 80,
  angle: (rng() - 0.5) * 30,
}));

export const SeaShore: React.FC<AssetProps> = ({ frame }) => {
  // Wave animation — rolling in and out
  const wavePush = longCycleNoise(frame * 0.3, 55) * 15;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon — sea meets sky */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 60} height={120} color="#7A9AA8" opacity={0.4} />

      {/* Ocean — upper water area */}
      <WaterSurface
        id={`${ID}-ocean`}
        y={HORIZON}
        height={WAVE_LINE - HORIZON}
        color="#2A5068"
        reflectionColor="#5A8A98"
        opacity={0.9}
        frame={frame}
        waveCount={8}
      />

      {/* Wave foam line — where water meets beach */}
      <g>
        {/* Main foam line */}
        {Array.from({ length: 25 }, (_, i) => {
          const x = i * 80;
          const foamY = WAVE_LINE + wavePush + longCycleNoise(frame * 0.5, i * 13) * 6;
          return (
            <ellipse key={i} cx={x} cy={foamY} rx={45} ry={4}
              fill="white" opacity={0.25 + Math.max(0, longCycleNoise(frame * 0.4, i * 7)) * 0.1} />
          );
        })}
        {/* Secondary foam — thinner, behind */}
        {Array.from({ length: 20 }, (_, i) => {
          const x = i * 100 + 30;
          const foamY = WAVE_LINE - 15 + wavePush + longCycleNoise(frame * 0.6, i * 17 + 50) * 5;
          return (
            <ellipse key={i} cx={x} cy={foamY} rx={35} ry={2.5}
              fill="white" opacity={0.12} />
          );
        })}
      </g>

      {/* Wet sand zone — darker, reflective */}
      <defs>
        <linearGradient id={`${ID}-wet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A7A60" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#8A7A60" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={WAVE_LINE + wavePush} width={1920} height={60} fill={`url(#${ID}-wet)`} />

      {/* Beach sand */}
      <GroundPlane id={ID} horizonY={WAVE_LINE + 10} stops={SAND_STOPS} />

      {/* Wet sand reflections — shimmer */}
      {Array.from({ length: 8 }, (_, i) => {
        const x = 100 + i * 230;
        const shimmer = longCycleNoise(frame * 0.25, i * 29) * 0.04;
        return (
          <ellipse key={i} cx={x} cy={WAVE_LINE + 30 + wavePush * 0.5}
            rx={60} ry={8} fill="#90A8B0" opacity={0.06 + shimmer} />
        );
      })}

      {/* Sand ripple patterns — wave-formed */}
      <g opacity={0.06}>
        {Array.from({ length: 8 }, (_, i) => {
          const y = WAVE_LINE + 50 + i * 30;
          return (
            <path key={i}
              d={`M0,${y} ${Array.from({ length: 40 }, (_, j) =>
                `L${j * 50},${y + Math.sin(j * 0.5 + i * 0.3) * 3}`
              ).join(' ')}`}
              fill="none" stroke="#B8A870" strokeWidth={1} />
          );
        })}
      </g>

      {/* Shells */}
      {SHELLS.map((s, i) => (
        <g key={i} opacity={0.4}>
          <ellipse cx={s.cx} cy={s.cy} rx={s.r} ry={s.r * 0.6} fill={s.color}
            transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
        </g>
      ))}

      {/* Driftwood */}
      {DRIFTWOOD.map((d, i) => (
        <g key={i} opacity={0.35}>
          <line x1={d.x} y1={d.y} x2={d.x + d.length} y2={d.y + d.length * Math.sin(d.angle * Math.PI / 180)}
            stroke="#6A5838" strokeWidth={3} strokeLinecap="round" />
          <line x1={d.x + 2} y1={d.y - 1} x2={d.x + d.length - 5} y2={d.y + d.length * Math.sin(d.angle * Math.PI / 180) - 1}
            stroke="#8A7848" strokeWidth={1} strokeLinecap="round" opacity={0.5} />
        </g>
      ))}

      {/* Texture */}
      <TerrainTexture id={ID} y={WAVE_LINE} height={380} color="#7A6840" opacity={0.02} seed={4001} />

      {/* Sea spray mist */}
      <g opacity={0.05}>
        {Array.from({ length: 10 }, (_, i) => {
          const x = i * 200 + longCycleNoise(frame * 0.3, i * 23) * 30;
          return (
            <circle key={i} cx={x} cy={WAVE_LINE - 20 + longCycleNoise(frame * 0.5, i * 11) * 10}
              r={15 + Math.abs(longCycleNoise(frame * 0.2, i * 7)) * 10} fill="white" />
          );
        })}
      </g>

      {/* Bottom darken */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="88%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default SeaShore;
