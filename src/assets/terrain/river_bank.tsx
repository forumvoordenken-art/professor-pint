/**
 * river_bank — Rivieroever, water ontmoet land.
 *
 * Handel, transport, nederzettingen, bruggen, waterverhalen.
 * Land on the lower portion with river water flowing through.
 * Reeds and grass along the water's edge.
 * Gentle current with reflections.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  HillSilhouette,
  WaterSurface,
  SurfaceScatter,
  GroundMist,
  TerrainTexture,
  generateHillPath,
  generateSurfaceElements,
  renderGrassBlade,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'river-bank';
const HORIZON = 560;
const WATER_START = 680;
const BANK_Y = 750;

const GROUND_STOPS = [
  { offset: '0%', color: '#5A7A30' },
  { offset: '30%', color: '#4A6828' },
  { offset: '60%', color: '#6A5838' },       // muddy near water
  { offset: '100%', color: '#5A4830' },      // wet mud
];

const HILLS = [
  { path: generateHillPath(545, 20, 6, 1701), fill: '#6A8A60', opacity: 0.45, drift: 0.1 },
  { path: generateHillPath(560, 15, 7, 1702), fill: '#5A7A50', opacity: 0.5, drift: 0.15 },
];

// Grass along bank edge
const BANK_GRASS_COLORS = ['#4A7A28', '#5A8A38', '#3A6A1E', '#6A9A42'];
const BANK_GRASS = generateSurfaceElements(50, 2801, { x: 0, y: BANK_Y - 30, width: 1920, height: 40 }, BANK_GRASS_COLORS);

// Reeds — tall, thin, swaying
const rng = seededRandom(2802);
const REEDS = Array.from({ length: 20 }, () => ({
  cx: rng() * 1920,
  baseY: BANK_Y - 10 + rng() * 20,
  height: 40 + rng() * 60,
  seed: rng() * 1000,
}));

// Mud patches near water
const MUD_PATCHES = Array.from({ length: 5 }, () => ({
  cx: rng() * 1920,
  cy: BANK_Y + rng() * 30,
  rx: 40 + rng() * 80,
  ry: 10 + rng() * 15,
}));

export const RiverBank: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 60} height={120} color="#7A9A68" opacity={0.35} />

      {/* Distant hills */}
      <HillSilhouette hills={HILLS} frame={frame} idPrefix={`${ID}-h`} />

      {/* Green bank ground — upper portion */}
      <GroundPlane id={ID} horizonY={HORIZON + 20} stops={GROUND_STOPS} />

      {/* River water — mid section */}
      <WaterSurface
        id={ID}
        y={WATER_START}
        height={200}
        color="#2A4858"
        reflectionColor="#5A8878"
        opacity={0.85}
        frame={frame}
        waveCount={6}
      />

      {/* Far bank — the other side of the river */}
      <rect x={0} y={WATER_START - 5} width={1920} height={15}
        fill="#5A7A40" opacity={0.4} />

      {/* Mud patches near water */}
      {MUD_PATCHES.map((m, i) => (
        <ellipse key={i} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
          fill="#5A4828" opacity={0.2} />
      ))}

      {/* Bank edge — where land meets water */}
      <path
        d={`M0,${BANK_Y} ${Array.from({ length: 20 }, (_, i) => {
          const x = i * 100;
          const y = BANK_Y + longCycleNoise(frame * 0.1, i * 17) * 3 + Math.sin(i * 0.8) * 5;
          return `L${x},${y}`;
        }).join(' ')} L1920,${BANK_Y} L1920,${BANK_Y + 8} L0,${BANK_Y + 8} Z`}
        fill="#4A3820"
        opacity={0.4}
      />

      {/* Lower bank ground — below water */}
      <rect x={0} y={WATER_START + 190} width={1920} height={210}
        fill="#4A6828" opacity={0.8} />

      {/* Bank grass */}
      <SurfaceScatter elements={BANK_GRASS} frame={frame} renderElement={renderGrassBlade} />

      {/* Reeds — tall swaying plants at water's edge */}
      {REEDS.map((r, i) => {
        const sway = longCycleNoise(frame * 0.4, r.seed) * 10;
        return (
          <g key={i} opacity={0.6}>
            {/* Main reed */}
            <line x1={r.cx} y1={r.baseY} x2={r.cx + sway} y2={r.baseY - r.height}
              stroke="#5A7830" strokeWidth={2} strokeLinecap="round" />
            {/* Reed tip — darker */}
            <line x1={r.cx + sway * 0.8} y1={r.baseY - r.height * 0.7}
              x2={r.cx + sway * 1.2} y2={r.baseY - r.height}
              stroke="#4A6020" strokeWidth={3} strokeLinecap="round" />
            {/* Secondary reed */}
            <line x1={r.cx + 3} y1={r.baseY} x2={r.cx + sway * 0.7 + 5} y2={r.baseY - r.height * 0.7}
              stroke="#4A6828" strokeWidth={1.5} strokeLinecap="round" />
          </g>
        );
      })}

      {/* Water edge foam — subtle white line */}
      <g opacity={0.12}>
        {Array.from({ length: 15 }, (_, i) => {
          const x = i * 140 + longCycleNoise(frame * 0.3, i * 11) * 10;
          return (
            <ellipse key={i} cx={x} cy={WATER_START - 2} rx={30} ry={2} fill="white" />
          );
        })}
      </g>

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={520} color="#1A2810" opacity={0.02} seed={3901} />

      {/* River mist */}
      <GroundMist id={ID} y={WATER_START + 80} color="#8AA898" opacity={0.1} frame={frame} count={4} seed={4801} />

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

export default RiverBank;
