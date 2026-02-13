/**
 * river_bank — Rivieroever, water ontmoet land.
 *
 * Handel, transport, nederzettingen, bruggen, waterverhalen.
 * Lush grassy banks slope down to a flowing river.
 * Reeds, cattails, lily pads, stepping stones, a small jetty.
 * Fish jumping, dragonfly darting, frog on a lily pad.
 * Oil painting style with layered detail.
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
  renderPebble,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'river-bank';
const HORIZON = 560;
const FAR_BANK_Y = 640;
const WATER_START = 660;
const WATER_END = 860;
const NEAR_BANK_Y = 840;

// ─── Ground gradient: green bank ───────────────────────────
const GROUND_STOPS = [
  { offset: '0%', color: '#5A7A30' },
  { offset: '20%', color: '#4D6E2A' },
  { offset: '45%', color: '#4A6828' },
  { offset: '70%', color: '#6A5838' },
  { offset: '100%', color: '#5A4830' },
];

// ─── Distant hills ─────────────────────────────────────────
const HILLS = [
  { path: generateHillPath(540, 25, 6, 1701), fill: '#7A9A6A', opacity: 0.4, drift: 0.1 },
  { path: generateHillPath(555, 18, 8, 1702), fill: '#6A8A58', opacity: 0.45, drift: 0.15 },
  { path: generateHillPath(565, 12, 5, 1703), fill: '#5A7A48', opacity: 0.5, drift: 0.2 },
];

// ─── Bank grass ────────────────────────────────────────────
const BANK_GRASS_COLORS = ['#4A7A28', '#5A8A38', '#3A6A1E', '#6A9A42', '#4E7E30'];
const FAR_GRASS = generateSurfaceElements(35, 2800, { x: 0, y: FAR_BANK_Y - 40, width: 1920, height: 35 }, BANK_GRASS_COLORS);
const NEAR_GRASS = generateSurfaceElements(60, 2801, { x: 0, y: NEAR_BANK_Y + 10, width: 1920, height: 50 }, BANK_GRASS_COLORS);
const FOREGROUND_GRASS = generateSurfaceElements(70, 2806, { x: 0, y: 920, width: 1920, height: 160 }, BANK_GRASS_COLORS);

// ─── River pebbles in shallow water ───────────────────────
const PEBBLE_COLORS = ['#7A8A78', '#6A7A6A', '#8A9A88', '#5A6A58', '#9AAA98'];
const SHALLOW_PEBBLES = generateSurfaceElements(30, 2807, { x: 100, y: WATER_START + 10, width: 1920, height: WATER_END - WATER_START - 30 }, PEBBLE_COLORS);

// ─── Reeds & cattails ──────────────────────────────────────
const rng = seededRandom(2802);
const REEDS = Array.from({ length: 25 }, () => ({
  cx: rng() * 1920,
  baseY: NEAR_BANK_Y - 5 + rng() * 15,
  height: 50 + rng() * 70,
  thickness: 1.5 + rng() * 1,
  hasCattail: rng() > 0.4,
  seed: rng() * 1000,
}));

// ─── Far bank reeds (smaller, more distant) ───────────────
const FAR_REEDS = Array.from({ length: 15 }, () => ({
  cx: rng() * 1920,
  baseY: FAR_BANK_Y + 5 + rng() * 10,
  height: 25 + rng() * 35,
  seed: rng() * 1000,
}));

// ─── Lily pads ─────────────────────────────────────────────
const LILY_PADS = Array.from({ length: 6 }, () => ({
  cx: 300 + rng() * 1300,
  cy: WATER_START + 40 + rng() * (WATER_END - WATER_START - 80),
  r: 12 + rng() * 10,
  angle: rng() * 360,
  notchAngle: rng() * 360,
  hasFrog: false as boolean,
  seed: rng() * 1000,
}));
LILY_PADS[2].hasFrog = true;

// ─── Stepping stones ──────────────────────────────────────
const STEPPING_STONES = Array.from({ length: 5 }, (_, i) => ({
  cx: 700 + i * 120 + (rng() - 0.5) * 40,
  cy: WATER_START + 30 + (WATER_END - WATER_START - 60) * (i / 4) * 0.6 + 40,
  rx: 18 + rng() * 12,
  ry: 8 + rng() * 5,
  color: ['#7A7A70', '#8A8A80', '#6A6A60'][Math.floor(rng() * 3)],
}));

// ─── Mud patches ──────────────────────────────────────────
const MUD_PATCHES = Array.from({ length: 6 }, () => ({
  cx: rng() * 1920,
  cy: NEAR_BANK_Y - 5 + rng() * 30,
  rx: 30 + rng() * 70,
  ry: 8 + rng() * 12,
}));

// ─── Wildflowers along bank ───────────────────────────────
const WILDFLOWERS = Array.from({ length: 18 }, () => ({
  cx: rng() * 1920,
  cy: NEAR_BANK_Y + 20 + rng() * 60,
  color: ['#D8A838', '#C87848', '#A85898', '#D86868', '#E8E050', '#FFFFFF'][Math.floor(rng() * 6)],
  size: 1.5 + rng() * 2,
  seed: rng() * 1000,
}));

// ─── Jetty / dock ─────────────────────────────────────────
const JETTY_X = 1500;
const JETTY_Y = NEAR_BANK_Y - 10;

// ─── Willow branches (overhanging from left) ──────────────
const WILLOW_BRANCHES = Array.from({ length: 8 }, (_, i) => ({
  startX: -20 + rng() * 60,
  startY: HORIZON + 40 + i * 25,
  length: 120 + rng() * 180,
  droop: 80 + rng() * 60,
  seed: rng() * 1000,
}));

// ─── Bank erosion layers ──────────────────────────────────
const EROSION_X = 1100;
const EROSION_WIDTH = 280;

export const RiverBank: React.FC<AssetProps> = ({ frame }) => {
  const wavePush = longCycleNoise(frame * 0.2, 55) * 4;
  const fishJump = longCycleNoise(frame * 0.15, 333);
  const showFish = fishJump > 0.6;
  const fishPhase = Math.max(0, (fishJump - 0.6) / 0.4);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Horizon blend ─────────────────────────────── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 70} height={140} color="#7A9A68" opacity={0.35} />

      {/* ── Distant hills ─────────────────────────────── */}
      <HillSilhouette hills={HILLS} frame={frame} idPrefix={`${ID}-h`} />

      {/* ── Far bank ground ───────────────────────────── */}
      <GroundPlane id={`${ID}-far`} horizonY={HORIZON + 15} stops={[
        { offset: '0%', color: '#5A7A30' },
        { offset: '60%', color: '#4A6828' },
        { offset: '100%', color: '#3E5A22' },
      ]} />

      {/* ── Far bank vegetation strip ─────────────────── */}
      <rect x={0} y={FAR_BANK_Y - 8} width={1920} height={16} fill="#4A6A28" opacity={0.5} rx={3} />
      <SurfaceScatter elements={FAR_GRASS} frame={frame} renderElement={renderGrassBlade} />

      {/* ── Far bank reeds (smaller) ──────────────────── */}
      {FAR_REEDS.map((r, i) => {
        const sway = longCycleNoise(frame * 0.35, r.seed) * 6;
        return (
          <g key={`fr-${i}`} opacity={0.4}>
            <line x1={r.cx} y1={r.baseY} x2={r.cx + sway} y2={r.baseY - r.height}
              stroke="#4A6A28" strokeWidth={1.2} strokeLinecap="round" />
            <ellipse cx={r.cx + sway * 0.9} cy={r.baseY - r.height + 2}
              rx={2} ry={5} fill="#6A5020" opacity={0.5} />
          </g>
        );
      })}

      {/* ── Bank edge — far side (where land meets water) ── */}
      <path
        d={`M0,${FAR_BANK_Y + 8} ${Array.from({ length: 25 }, (_, i) => {
          const x = i * 80;
          const y = FAR_BANK_Y + 8 + longCycleNoise(frame * 0.08, i * 19 + 100) * 2 + Math.sin(i * 0.6) * 3;
          return `L${x},${y}`;
        }).join(' ')} L1920,${FAR_BANK_Y + 8} L1920,${FAR_BANK_Y + 15} L0,${FAR_BANK_Y + 15} Z`}
        fill="#3A4A20" opacity={0.35}
      />

      {/* ── River water ───────────────────────────────── */}
      <WaterSurface
        id={ID}
        y={WATER_START}
        height={WATER_END - WATER_START}
        color="#2A4858"
        reflectionColor="#5A8878"
        opacity={0.85}
        frame={frame}
        waveCount={8}
      />

      {/* ── Current lines — flowing streaks ───────────── */}
      <g opacity={0.07}>
        {Array.from({ length: 12 }, (_, i) => {
          const y = WATER_START + 20 + i * 15;
          const drift = longCycleNoise(frame * 0.6, i * 31) * 40;
          const x1 = 100 + i * 150 + drift;
          return (
            <line key={i} x1={x1} y1={y} x2={x1 + 80 + Math.abs(drift)} y2={y + 2}
              stroke="white" strokeWidth={0.8} strokeLinecap="round" />
          );
        })}
      </g>

      {/* ── Vegetation reflections in water ───────────── */}
      <g opacity={0.06}>
        {Array.from({ length: 10 }, (_, i) => {
          const x = i * 200 + 60;
          const waver = longCycleNoise(frame * 0.4, i * 23 + 500) * 8;
          return (
            <ellipse key={i} cx={x} cy={WATER_START + 30 + waver}
              rx={25} ry={40} fill="#2A4A20" />
          );
        })}
      </g>

      {/* ── River pebbles visible through shallow water ─ */}
      <g opacity={0.15}>
        <SurfaceScatter elements={SHALLOW_PEBBLES} frame={frame} renderElement={renderPebble} />
      </g>

      {/* ── Stepping stones ───────────────────────────── */}
      {STEPPING_STONES.map((s, i) => (
        <g key={`ss-${i}`}>
          {/* Shadow in water */}
          <ellipse cx={s.cx + 3} cy={s.cy + 4} rx={s.rx + 2} ry={s.ry + 1}
            fill="#1A2A20" opacity={0.15} />
          {/* Stone body */}
          <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
            fill={s.color} opacity={0.7} />
          {/* Highlight */}
          <ellipse cx={s.cx - s.rx * 0.2} cy={s.cy - s.ry * 0.2}
            rx={s.rx * 0.5} ry={s.ry * 0.4} fill="white" opacity={0.08} />
          {/* Wet edge */}
          <ellipse cx={s.cx} cy={s.cy} rx={s.rx + 1} ry={s.ry + 1}
            fill="none" stroke="#4A5A48" strokeWidth={0.5} opacity={0.3} />
        </g>
      ))}

      {/* ── Lily pads ─────────────────────────────────── */}
      {LILY_PADS.map((lp, i) => {
        const bob = longCycleNoise(frame * 0.3, lp.seed) * 3 + wavePush * 0.5;
        const rotate = longCycleNoise(frame * 0.15, lp.seed + 50) * 5;
        return (
          <g key={`lp-${i}`} transform={`translate(${lp.cx},${lp.cy + bob}) rotate(${rotate})`}>
            {/* Shadow */}
            <ellipse cx={2} cy={3} rx={lp.r + 1} ry={lp.r * 0.5}
              fill="#1A3020" opacity={0.12} />
            {/* Pad body — circle with notch */}
            <path d={`
              M${-lp.r},0
              A${lp.r},${lp.r * 0.55} 0 1,1 ${lp.r},0
              A${lp.r},${lp.r * 0.55} 0 1,1 ${-lp.r},0
              M0,0 L${lp.r * 0.3},-${lp.r * 0.15} L0,-${lp.r * 0.5} Z
            `} fill="#3A7A28" opacity={0.7} />
            {/* Vein lines */}
            <line x1={0} y1={0} x2={-lp.r * 0.6} y2={-lp.r * 0.1}
              stroke="#2A5A18" strokeWidth={0.5} opacity={0.3} />
            <line x1={0} y1={0} x2={lp.r * 0.5} y2={lp.r * 0.15}
              stroke="#2A5A18" strokeWidth={0.5} opacity={0.3} />
            <line x1={0} y1={0} x2={-lp.r * 0.3} y2={lp.r * 0.25}
              stroke="#2A5A18" strokeWidth={0.5} opacity={0.3} />
            {/* Frog on this pad */}
            {lp.hasFrog && (
              <g transform="translate(3,-4)">
                <ellipse cx={0} cy={0} rx={4} ry={3} fill="#4A8A28" opacity={0.7} />
                <ellipse cx={-2} cy={-2.5} rx={1.2} ry={1} fill="#5AAA38" opacity={0.6} />
                <ellipse cx={2} cy={-2.5} rx={1.2} ry={1} fill="#5AAA38" opacity={0.6} />
                <circle cx={-2} cy={-2.8} r={0.4} fill="#1A1A10" opacity={0.5} />
                <circle cx={2} cy={-2.8} r={0.4} fill="#1A1A10" opacity={0.5} />
              </g>
            )}
          </g>
        );
      })}

      {/* ── Fish jumping (periodic) ───────────────────── */}
      {showFish && (
        <g opacity={fishPhase * 0.6}>
          <g transform={`translate(850, ${WATER_START + 60 - fishPhase * 40})`}>
            {/* Fish body */}
            <ellipse cx={0} cy={0} rx={8} ry={3} fill="#6A7A8A" />
            <polygon points="-8,0 -13,-4 -13,4" fill="#5A6A7A" />
            {/* Splash rings */}
            <ellipse cx={0} cy={fishPhase * 30} rx={10 + fishPhase * 15} ry={3}
              fill="none" stroke="white" strokeWidth={0.6} opacity={0.3 * (1 - fishPhase)} />
            <ellipse cx={0} cy={fishPhase * 25} rx={6 + fishPhase * 8} ry={2}
              fill="none" stroke="white" strokeWidth={0.4} opacity={0.2 * (1 - fishPhase)} />
            {/* Water droplets */}
            {[[-5, -8], [3, -12], [8, -6]].map(([dx, dy], di) => (
              <circle key={di} cx={dx} cy={dy - fishPhase * 10} r={1}
                fill="#8AAAB8" opacity={0.3 * (1 - fishPhase)} />
            ))}
          </g>
        </g>
      )}

      {/* ── Near bank edge — where land meets water ───── */}
      <path
        d={`M0,${NEAR_BANK_Y} ${Array.from({ length: 25 }, (_, i) => {
          const x = i * 80;
          const y = NEAR_BANK_Y + longCycleNoise(frame * 0.1, i * 17) * 3 + Math.sin(i * 0.8) * 4;
          return `L${x},${y}`;
        }).join(' ')} L1920,${NEAR_BANK_Y} L1920,1080 L0,1080 Z`}
        fill="#4A6828" opacity={0.9}
      />

      {/* ── Bank erosion layers ───────────────────────── */}
      <g>
        {/* Grass/root layer */}
        <rect x={EROSION_X} y={NEAR_BANK_Y - 2} width={EROSION_WIDTH} height={6}
          fill="#3A5A1E" opacity={0.5} rx={2} />
        {/* Dark topsoil */}
        <rect x={EROSION_X + 5} y={NEAR_BANK_Y + 4} width={EROSION_WIDTH - 10} height={10}
          fill="#3A2A18" opacity={0.4} rx={1} />
        {/* Clay layer */}
        <rect x={EROSION_X + 10} y={NEAR_BANK_Y + 14} width={EROSION_WIDTH - 20} height={8}
          fill="#8A6A40" opacity={0.3} rx={1} />
        {/* Root tendrils */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i}
            x1={EROSION_X + 30 + i * 50} y1={NEAR_BANK_Y - 2}
            x2={EROSION_X + 35 + i * 50 + (seededRandom(6600 + i)() - 0.5) * 20}
            y2={NEAR_BANK_Y + 10 + seededRandom(6700 + i)() * 8}
            stroke="#5A4020" strokeWidth={0.8} opacity={0.3} />
        ))}
      </g>

      {/* ── Mud patches ───────────────────────────────── */}
      {MUD_PATCHES.map((m, i) => (
        <ellipse key={`mud-${i}`} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
          fill="#5A4828" opacity={0.18} />
      ))}

      {/* ── Near bank ground overlay ──────────────────── */}
      <GroundPlane id={`${ID}-near`} horizonY={NEAR_BANK_Y + 20} stops={GROUND_STOPS} />

      {/* ── Near bank grass ───────────────────────────── */}
      <SurfaceScatter elements={NEAR_GRASS} frame={frame} renderElement={renderGrassBlade} />

      {/* ── Wildflowers along bank edge ───────────────── */}
      {WILDFLOWERS.map((f, i) => {
        const bob = longCycleNoise(frame * 0.5, f.seed) * 2;
        const sway = longCycleNoise(frame * 0.4, f.seed + 30) * 3;
        return (
          <g key={`wf-${i}`}>
            {/* Stem */}
            <line x1={f.cx} y1={f.cy} x2={f.cx + sway} y2={f.cy - 8 - f.size * 2}
              stroke="#3A6A1E" strokeWidth={0.6} opacity={0.4} />
            {/* Bloom */}
            <circle cx={f.cx + sway} cy={f.cy - 8 - f.size * 2 + bob}
              r={f.size} fill={f.color} opacity={0.6} />
          </g>
        );
      })}

      {/* ── Reeds & cattails at near water's edge ─────── */}
      {REEDS.map((r, i) => {
        const sway = longCycleNoise(frame * 0.4, r.seed) * 10;
        const sway2 = longCycleNoise(frame * 0.35, r.seed + 20) * 7;
        return (
          <g key={`reed-${i}`} opacity={0.65}>
            {/* Main reed stem */}
            <line x1={r.cx} y1={r.baseY} x2={r.cx + sway} y2={r.baseY - r.height}
              stroke="#5A7830" strokeWidth={r.thickness} strokeLinecap="round" />
            {/* Cattail head */}
            {r.hasCattail && (
              <ellipse
                cx={r.cx + sway * 0.95} cy={r.baseY - r.height + 6}
                rx={2.5} ry={8} fill="#6A4A20" opacity={0.7}
                transform={`rotate(${sway * 0.5}, ${r.cx + sway * 0.95}, ${r.baseY - r.height + 6})`}
              />
            )}
            {/* Secondary shorter reed */}
            <line x1={r.cx + 4} y1={r.baseY} x2={r.cx + sway2 + 5} y2={r.baseY - r.height * 0.65}
              stroke="#4A6828" strokeWidth={r.thickness * 0.7} strokeLinecap="round" />
            {/* Leaf blade */}
            <path
              d={`M${r.cx + sway * 0.4},${r.baseY - r.height * 0.4}
                  Q${r.cx + sway * 0.4 + 15},${r.baseY - r.height * 0.5}
                   ${r.cx + sway * 0.4 + 25},${r.baseY - r.height * 0.35}`}
              fill="none" stroke="#4A7020" strokeWidth={1} opacity={0.4}
            />
          </g>
        );
      })}

      {/* ── Small wooden jetty/dock ───────────────────── */}
      <g>
        {/* Support posts */}
        <rect x={JETTY_X - 2} y={JETTY_Y - 5} width={4} height={40} fill="#5A4020" opacity={0.5} />
        <rect x={JETTY_X + 58} y={JETTY_Y - 5} width={4} height={45} fill="#5A4020" opacity={0.5} />
        {/* Planks */}
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={JETTY_X - 5} y={JETTY_Y + i * 8} width={70} height={6}
            fill={i % 2 === 0 ? '#7A6040' : '#6A5030'} opacity={0.45} rx={1} />
        ))}
        {/* Plank gaps */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i} x1={JETTY_X - 3} y1={JETTY_Y + i * 8 + 6.5}
            x2={JETTY_X + 63} y2={JETTY_Y + i * 8 + 6.5}
            stroke="#2A3A20" strokeWidth={0.5} opacity={0.3} />
        ))}
        {/* Rope post */}
        <rect x={JETTY_X + 60} y={JETTY_Y - 15} width={3} height={18} fill="#5A4020" opacity={0.5} />
        {/* Coiled rope */}
        <ellipse cx={JETTY_X + 61.5} cy={JETTY_Y - 16} rx={4} ry={2} fill="#8A7A50" opacity={0.4} />
        <ellipse cx={JETTY_X + 61.5} cy={JETTY_Y - 14} rx={3.5} ry={1.5}
          fill="none" stroke="#7A6A40" strokeWidth={0.8} opacity={0.35} />
        {/* Rope hanging to water */}
        <path d={`M${JETTY_X + 61.5},${JETTY_Y - 12} Q${JETTY_X + 70},${JETTY_Y + 5} ${JETTY_X + 65},${JETTY_Y + 20}`}
          fill="none" stroke="#8A7A50" strokeWidth={1} opacity={0.35} />
      </g>

      {/* ── Dragonfly ─────────────────────────────────── */}
      {(() => {
        const dfX = 600 + longCycleNoise(frame * 0.8, 777) * 200;
        const dfY = WATER_START - 30 + longCycleNoise(frame * 0.6, 778) * 40;
        const wingBeat = Math.sin(frame * 0.8) * 8;
        return (
          <g opacity={0.5} transform={`translate(${dfX},${dfY})`}>
            {/* Body */}
            <line x1={-8} y1={0} x2={8} y2={0} stroke="#2A5A6A" strokeWidth={1.2} strokeLinecap="round" />
            {/* Wings */}
            <ellipse cx={-2} cy={wingBeat * 0.3} rx={6} ry={2 + Math.abs(wingBeat * 0.2)}
              fill="#A8C8D8" opacity={0.25} />
            <ellipse cx={2} cy={-wingBeat * 0.3} rx={6} ry={2 + Math.abs(wingBeat * 0.2)}
              fill="#A8C8D8" opacity={0.25} />
            {/* Eyes */}
            <circle cx={8} cy={-0.5} r={1} fill="#4A8A6A" opacity={0.5} />
          </g>
        );
      })()}

      {/* ── Overhanging willow branches from left ─────── */}
      <g opacity={0.3}>
        {WILLOW_BRANCHES.map((b, i) => {
          const sway = longCycleNoise(frame * 0.25, b.seed) * 12;
          return (
            <path key={i}
              d={`M${b.startX},${b.startY}
                  Q${b.startX + b.length * 0.5 + sway},${b.startY + b.droop * 0.3}
                   ${b.startX + b.length + sway},${b.startY + b.droop}`}
              fill="none" stroke="#4A6A20" strokeWidth={1.2} opacity={0.5} />
          );
        })}
        {/* Willow leaf clusters */}
        {WILLOW_BRANCHES.filter((_, i) => i % 2 === 0).map((b, i) => {
          const sway = longCycleNoise(frame * 0.25, b.seed) * 12;
          const endX = b.startX + b.length + sway;
          const endY = b.startY + b.droop;
          return (
            <g key={`wl-${i}`}>
              {Array.from({ length: 4 }, (_, j) => (
                <ellipse key={j}
                  cx={endX - j * 8 - 10} cy={endY - j * 3}
                  rx={3} ry={6} fill="#5A8A30" opacity={0.3}
                  transform={`rotate(${10 + sway * 0.5}, ${endX - j * 8 - 10}, ${endY - j * 3})`} />
              ))}
            </g>
          );
        })}
      </g>

      {/* ── Water edge foam ───────────────────────────── */}
      <g opacity={0.12}>
        {Array.from({ length: 20 }, (_, i) => {
          const x = i * 100 + longCycleNoise(frame * 0.3, i * 11 + 200) * 10;
          return (
            <ellipse key={i} cx={x} cy={NEAR_BANK_Y + wavePush - 3}
              rx={25} ry={2} fill="white" />
          );
        })}
      </g>

      {/* ── Foreground grass (large, close) ───────────── */}
      <SurfaceScatter elements={FOREGROUND_GRASS} frame={frame} renderElement={renderGrassBlade} />

      {/* ── Painterly texture overlay ─────────────────── */}
      <TerrainTexture id={ID} y={HORIZON} height={520} color="#1A2810" opacity={0.02} seed={3901} />

      {/* ── River mist ────────────────────────────────── */}
      <GroundMist id={ID} y={WATER_START + 80} color="#8AA898" opacity={0.1} frame={frame} count={5} seed={4801} />

      {/* ── Warm sunlight patch on water ──────────────── */}
      <defs>
        <radialGradient id={`${ID}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8D898" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#E8D898" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={960} cy={WATER_START + 80} rx={300} ry={60} fill={`url(#${ID}-sun)`} />

      {/* ── Bottom vignette ───────────────────────────── */}
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
