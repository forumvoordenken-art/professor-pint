/**
 * dirt_plain — Neutrale bruine aarde, kale vlakte.
 *
 * Overgangsscènes, armoede, droogte, transitie.
 * Bare brown earth — not lush, not desert. Just earth.
 * Dense crack network, sparse dead grass, scattered pebbles.
 * Tire ruts, ant trails, anthills, tumbleweed, boot prints.
 * Distant leaning fence posts, earthworm mounds, dust clouds.
 * Barbed wire fragment. Color variation: damp vs dry areas.
 */

import React, { useMemo } from 'react';
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
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'dirt-plain';
const HORIZON = 570;

/* ── colour palette ─────────────────────────────────────── */
const EARTH_LIGHT = '#9A8468';
const EARTH_MID = '#7A6448';
const CRACK_COLOR = '#3A2E20';
const DAMP_SPOT = '#5A4A38';
const DRY_SPOT = '#A89878';
const DEAD_YELLOW = '#9A8860';
const PUDDLE_BROWN = '#5A4A3A';

const GROUND_STOPS = [
  { offset: '0%', color: '#8A7458' },
  { offset: '15%', color: '#7E6A4E' },
  { offset: '30%', color: '#7A6448' },
  { offset: '50%', color: '#6A5438' },
  { offset: '70%', color: '#5E4C34' },
  { offset: '85%', color: '#5A4830' },
  { offset: '100%', color: '#4A3C28' },
];

/* ── low rolling hills ──────────────────────────────────── */
const HILLS = [
  { path: generateHillPath(550, 22, 6, 6001), fill: '#8A7A68', opacity: 0.4, drift: 0.15 },
  { path: generateHillPath(562, 18, 8, 6002), fill: '#7A6A58', opacity: 0.45, drift: 0.1 },
  { path: generateHillPath(570, 12, 10, 6003), fill: '#6A5A48', opacity: 0.35, drift: 0.08 },
];

/* ── large crack network (10+ branching paths) ──────────── */
const rng1 = seededRandom(6301);
const CRACKS: Array<{ path: string; width: number; opacity: number }> = [];
for (let i = 0; i < 14; i++) {
  const cx = rng1() * 1920;
  const cy = 630 + rng1() * 400;
  const segs = 4 + Math.floor(rng1() * 6);
  let path = `M${cx},${cy}`;
  let lastX = cx;
  let lastY = cy;
  for (let j = 0; j < segs; j++) {
    const dx = (rng1() - 0.5) * 100;
    const dy = rng1() * 50 - 10;
    path += ` l${dx},${dy}`;
    lastX += dx;
    lastY += dy;
    /* branch off sub-cracks */
    if (rng1() > 0.4) {
      const bx = (rng1() - 0.5) * 50;
      const by = rng1() * 30;
      CRACKS.push({
        path: `M${lastX},${lastY} l${bx},${by}`,
        width: 0.4 + rng1() * 0.4,
        opacity: 0.06 + rng1() * 0.05,
      });
    }
  }
  CRACKS.push({
    path,
    width: 0.6 + rng1() * 0.8,
    opacity: 0.08 + rng1() * 0.07,
  });
}

/* ── sparse dead grass tufts ────────────────────────────── */
const DEAD_GRASS = generateSurfaceElements(40, 6401,
  { x: 0, y: 640, width: 1920, height: 400 },
  [DEAD_YELLOW, '#8A7850', '#A89870', '#7A6A48', '#B0A078']);

/* ── scattered pebbles (30+) ────────────────────────────── */
const PEBBLES = generateSurfaceElements(40, 6402,
  { x: 0, y: 620, width: 1920, height: 430 },
  ['#6A5A48', '#7A6A58', '#5A4A38', '#8A7A68', '#4A3A28', '#8A8070']);

/* ── tire/cart wheel ruts ───────────────────────────────── */
const WHEEL_RUTS = [
  { x1: 700, x2: 750, yStart: HORIZON + 30, yEnd: 1080 },
  { x1: 740, x2: 790, yStart: HORIZON + 30, yEnd: 1080 },
];

/* ── muddy puddles in low spots ─────────────────────────── */
const PUDDLES = [
  { cx: 450, cy: 810, rx: 55, ry: 18 },
  { cx: 1050, cy: 870, rx: 70, ry: 22 },
  { cx: 1500, cy: 780, rx: 45, ry: 15 },
];

/* ── ant trail ──────────────────────────────────────────── */
const rng3 = seededRandom(6601);
const ANT_TRAIL: Array<{ x: number; y: number }> = [];
let antX = 200;
let antY = 850;
for (let i = 0; i < 35; i++) {
  antX += 8 + rng3() * 12;
  antY += (rng3() - 0.5) * 6;
  ANT_TRAIL.push({ x: antX, y: antY });
}

/* ── anthills ───────────────────────────────────────────── */
const ANTHILLS = [
  { x: 600, y: 860, r: 12 },
  { x: 1200, y: 900, r: 10 },
  { x: 1650, y: 840, r: 14 },
  { x: 300, y: 920, r: 9 },
];

/* ── tumbleweed positions ───────────────────────────────── */
const TUMBLEWEEDS = [
  { baseX: 1300, baseY: 800, r: 18, seed: 6701 },
  { baseX: 500, baseY: 880, r: 14, seed: 6702 },
];

/* ── distant fence posts ────────────────────────────────── */
const rng4 = seededRandom(6801);
const FENCE_POSTS = Array.from({ length: 6 }, (_, i) => ({
  x: 1100 + i * 90,
  y: HORIZON + 20 + i * 8,
  height: 35 - i * 2,
  lean: (rng4() - 0.5) * 12,
}));

/* ── boot prints near foreground ────────────────────────── */
const rng5 = seededRandom(6901);
const BOOT_PRINTS = Array.from({ length: 6 }, (_, i) => ({
  x: 150 + i * 50 + (rng5() - 0.5) * 20,
  y: 960 + (rng5() - 0.5) * 30,
  angle: -10 + rng5() * 20,
  depth: 0.04 + rng5() * 0.04,
}));

/* ── earthworm mounds ───────────────────────────────────── */
const WORM_MOUNDS = [
  { cx: 800, cy: 930, rx: 8, ry: 5 },
  { cx: 1400, cy: 960, rx: 10, ry: 6 },
  { cx: 350, cy: 980, rx: 7, ry: 4 },
  { cx: 1700, cy: 950, rx: 9, ry: 5 },
];

/* ── damp/dry color variation patches ───────────────────── */
const DAMP_PATCHES = [
  { cx: 300, cy: 780, rx: 160, ry: 55 },
  { cx: 900, cy: 850, rx: 200, ry: 70 },
  { cx: 1600, cy: 900, rx: 140, ry: 50 },
];

const DRY_PATCHES = [
  { cx: 600, cy: 730, rx: 180, ry: 60 },
  { cx: 1300, cy: 760, rx: 150, ry: 50 },
  { cx: 1800, cy: 820, rx: 120, ry: 45 },
];

/* ── worn footpath ──────────────────────────────────────── */
const FOOTPATH = 'M0,880 Q200,870 400,875 Q600,880 800,872 Q1000,865 1200,870 Q1400,878 1600,873 Q1800,868 1920,872';

export const DirtPlain: React.FC<AssetProps> = ({ frame }) => {
  const hills = useMemo(() => HILLS, []);

  /* tumbleweed rolling animation */
  const tumble1X = longCycleNoise(frame * 0.15, 6701) * 80;
  const tumble1Roll = frame * 1.2;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        {/* puddle reflection gradient */}
        {PUDDLES.map((p, i) => (
          <radialGradient key={i} id={`${ID}-puddle-${i}`} cx="0.5" cy="0.4" r="0.5">
            <stop offset="0%" stopColor={PUDDLE_BROWN} stopOpacity={0.35} />
            <stop offset="60%" stopColor={PUDDLE_BROWN} stopOpacity={0.18} />
            <stop offset="100%" stopColor={PUDDLE_BROWN} stopOpacity={0} />
          </radialGradient>
        ))}
        {/* dust cloud radial */}
        <radialGradient id={`${ID}-dust`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#B0A080" stopOpacity={0.12} />
          <stop offset="60%" stopColor="#B0A080" stopOpacity={0.04} />
          <stop offset="100%" stopColor="#B0A080" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* ── horizon blend — dusty brown ──────────────────── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 70} height={140} color="#9A8A70" opacity={0.45} />

      {/* ── low hills ────────────────────────────────────── */}
      <HillSilhouette hills={hills} frame={frame} idPrefix={`${ID}-h`} />

      {/* ── distant fence posts leaning at angles ────────── */}
      {FENCE_POSTS.map((fp, i) => (
        <g key={i} opacity={0.2 - i * 0.02}>
          <line x1={fp.x} y1={fp.y} x2={fp.x + fp.lean} y2={fp.y - fp.height}
            stroke="#5A4A38" strokeWidth={2.5 - i * 0.2} strokeLinecap="round" />
          {/* crossbar between posts */}
          {i < FENCE_POSTS.length - 1 && (
            <line x1={fp.x + fp.lean * 0.5} y1={fp.y - fp.height * 0.6}
              x2={FENCE_POSTS[i + 1].x + FENCE_POSTS[i + 1].lean * 0.5}
              y2={FENCE_POSTS[i + 1].y - FENCE_POSTS[i + 1].height * 0.6}
              stroke="#5A4A38" strokeWidth={1} opacity={0.12} />
          )}
        </g>
      ))}

      {/* ── base ground ──────────────────────────────────── */}
      <GroundPlane id={ID} horizonY={HORIZON + 10} stops={GROUND_STOPS} />

      {/* ── damp area patches (darker) ───────────────────── */}
      {DAMP_PATCHES.map((dp, i) => (
        <ellipse key={`damp-${i}`} cx={dp.cx} cy={dp.cy} rx={dp.rx} ry={dp.ry}
          fill={DAMP_SPOT} opacity={0.12} />
      ))}

      {/* ── dry area patches (lighter) ───────────────────── */}
      {DRY_PATCHES.map((dp, i) => (
        <ellipse key={`dry-${i}`} cx={dp.cx} cy={dp.cy} rx={dp.rx} ry={dp.ry}
          fill={DRY_SPOT} opacity={0.08} />
      ))}

      {/* ── worn footpath to one side ────────────────────── */}
      <path d={FOOTPATH} fill="none" stroke={DRY_SPOT} strokeWidth={18} opacity={0.06} strokeLinecap="round" />
      <path d={FOOTPATH} fill="none" stroke={EARTH_LIGHT} strokeWidth={8} opacity={0.04} strokeLinecap="round" />

      {/* ── large crack network in dry soil ──────────────── */}
      {CRACKS.map((c, i) => (
        <path key={i} d={c.path} fill="none" stroke={CRACK_COLOR}
          strokeWidth={c.width} opacity={c.opacity} strokeLinecap="round" />
      ))}

      {/* ── tire/cart wheel ruts going into distance ─────── */}
      {WHEEL_RUTS.map((rut, i) => {
        const x1Drift = longCycleNoise(frame * 0.03, 6550 + i) * 3;
        return (
          <g key={i} opacity={0.1}>
            <line x1={rut.x1 + x1Drift} y1={rut.yStart}
              x2={rut.x2 + x1Drift} y2={rut.yEnd}
              stroke={CRACK_COLOR} strokeWidth={3} />
            {/* track texture marks */}
            {Array.from({ length: 12 }, (_, j) => {
              const ty = rut.yStart + j * ((rut.yEnd - rut.yStart) / 12);
              return (
                <line key={j}
                  x1={rut.x1 + x1Drift - 3} y1={ty}
                  x2={rut.x1 + x1Drift + 3} y2={ty + 1}
                  stroke={CRACK_COLOR} strokeWidth={0.5} opacity={0.5} />
              );
            })}
          </g>
        );
      })}

      {/* ── muddy puddles with slight reflection ─────────── */}
      {PUDDLES.map((p, i) => {
        const ripple = longCycleNoise(frame * 0.2, 6610 + i * 19) * 0.03;
        return (
          <g key={i}>
            <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
              fill={`url(#${ID}-puddle-${i})`} />
            {/* surface shimmer */}
            <ellipse cx={p.cx + 5} cy={p.cy - 3} rx={p.rx * 0.35} ry={p.ry * 0.4}
              fill="white" opacity={0.04 + ripple} />
          </g>
        );
      })}

      {/* ── pebbles and small rocks ──────────────────────── */}
      <SurfaceScatter elements={PEBBLES} frame={frame} renderElement={(el, i) => {
        const r = 1.5 + el.size * 3;
        return (
          <g key={i} opacity={el.opacity}>
            <ellipse cx={el.cx} cy={el.cy} rx={r} ry={r * 0.6}
              fill={el.color} transform={`rotate(${el.angle}, ${el.cx}, ${el.cy})`} />
            {/* highlight on top */}
            <ellipse cx={el.cx - r * 0.2} cy={el.cy - r * 0.15}
              rx={r * 0.35} ry={r * 0.2} fill="white" opacity={0.06} />
          </g>
        );
      }} />

      {/* ── dead grass tufts — yellow/brown, bent/broken ── */}
      {DEAD_GRASS.map((el, i) => {
        const sway = longCycleNoise(frame * 0.3, el.seed) * 5;
        const h = 5 + el.size * 10;
        const bent = el.seed > 500; /* half are bent/broken */
        return (
          <g key={i} opacity={el.opacity * 0.55}>
            <line x1={el.cx} y1={el.cy} x2={el.cx + sway - 2} y2={el.cy - h}
              stroke={el.color} strokeWidth={0.9} strokeLinecap="round" />
            <line x1={el.cx + 2} y1={el.cy} x2={el.cx + sway + 4} y2={el.cy - h * 0.75}
              stroke={el.color} strokeWidth={0.6} strokeLinecap="round" />
            {bent && (
              <line x1={el.cx - 1} y1={el.cy}
                x2={el.cx + sway - 5} y2={el.cy - h * 0.4}
                stroke={el.color} strokeWidth={0.5} strokeLinecap="round" opacity={0.7} />
            )}
          </g>
        );
      })}

      {/* ── ant trail — thin line of tiny dots ───────────── */}
      <g opacity={0.09}>
        {ANT_TRAIL.map((a, i) => (
          <circle key={i} cx={a.x} cy={a.y} r={0.7} fill="#2A2018" />
        ))}
      </g>

      {/* ── anthills — small dirt mounds ─────────────────── */}
      {ANTHILLS.map((ah, i) => (
        <g key={i} opacity={0.2}>
          <ellipse cx={ah.x} cy={ah.y} rx={ah.r} ry={ah.r * 0.5} fill={EARTH_MID} />
          <ellipse cx={ah.x} cy={ah.y - ah.r * 0.25} rx={ah.r * 0.6} ry={ah.r * 0.3}
            fill={EARTH_LIGHT} opacity={0.5} />
          {/* tiny hole at top */}
          <circle cx={ah.x} cy={ah.y - ah.r * 0.3} r={1.5} fill={CRACK_COLOR} opacity={0.4} />
        </g>
      ))}

      {/* ── tumbleweeds (one drifting slowly) ────────────── */}
      {TUMBLEWEEDS.map((tw, i) => {
        const drift = i === 0 ? tumble1X : 0;
        const roll = i === 0 ? tumble1Roll : 0;
        const bob = longCycleNoise(frame * 0.4, tw.seed + 10) * 3;
        return (
          <g key={i} transform={`translate(${tw.baseX + drift},${tw.baseY + bob}) rotate(${roll})`}
            opacity={0.2}>
            {/* scraggly circular shape */}
            <circle cx={0} cy={0} r={tw.r} fill="none" stroke="#8A7848" strokeWidth={0.8} />
            <circle cx={0} cy={0} r={tw.r * 0.7} fill="none" stroke="#7A6838" strokeWidth={0.5} />
            {/* cross strands */}
            {Array.from({ length: 8 }, (_, j) => {
              const angle = (j / 8) * Math.PI * 2;
              return (
                <line key={j}
                  x1={Math.cos(angle) * tw.r * 0.3}
                  y1={Math.sin(angle) * tw.r * 0.3}
                  x2={Math.cos(angle + 0.4) * tw.r * 0.95}
                  y2={Math.sin(angle + 0.4) * tw.r * 0.95}
                  stroke="#8A7848" strokeWidth={0.4} />
              );
            })}
          </g>
        );
      })}

      {/* ── boot print impressions in foreground ─────────── */}
      {BOOT_PRINTS.map((bp, i) => (
        <g key={i} transform={`rotate(${bp.angle}, ${bp.x}, ${bp.y})`} opacity={bp.depth}>
          {/* sole shape */}
          <ellipse cx={bp.x} cy={bp.y} rx={6} ry={10} fill={CRACK_COLOR} />
          {/* heel */}
          <ellipse cx={bp.x} cy={bp.y + 12} rx={5} ry={4} fill={CRACK_COLOR} />
          {/* tread marks */}
          <line x1={bp.x - 3} y1={bp.y - 4} x2={bp.x + 3} y2={bp.y - 4}
            stroke={DAMP_SPOT} strokeWidth={0.5} />
          <line x1={bp.x - 3} y1={bp.y} x2={bp.x + 3} y2={bp.y}
            stroke={DAMP_SPOT} strokeWidth={0.5} />
        </g>
      ))}

      {/* ── earthworm mounds — small ridged soil bumps ──── */}
      {WORM_MOUNDS.map((wm, i) => (
        <g key={i} opacity={0.12}>
          <ellipse cx={wm.cx} cy={wm.cy} rx={wm.rx} ry={wm.ry} fill={EARTH_MID} />
          {/* ridged texture */}
          {Array.from({ length: 4 }, (_, j) => (
            <ellipse key={j}
              cx={wm.cx + (j - 1.5) * (wm.rx * 0.4)}
              cy={wm.cy - wm.ry * 0.2}
              rx={wm.rx * 0.15} ry={wm.ry * 0.6}
              fill={EARTH_LIGHT} opacity={0.3} />
          ))}
        </g>
      ))}

      {/* ── barbed wire fragment on ground ───────────────── */}
      <g opacity={0.1}>
        <path d="M1050,940 Q1070,935 1090,940 Q1110,945 1130,938 Q1145,933 1155,940"
          fill="none" stroke="#5A5048" strokeWidth={1} />
        {/* barbs */}
        <line x1={1070} y1={937} x2={1068} y2={932} stroke="#5A5048" strokeWidth={0.5} />
        <line x1={1090} y1={940} x2={1092} y2={935} stroke="#5A5048" strokeWidth={0.5} />
        <line x1={1115} y1={942} x2={1113} y2={937} stroke="#5A5048" strokeWidth={0.5} />
        <line x1={1140} y1={936} x2={1138} y2={931} stroke="#5A5048" strokeWidth={0.5} />
      </g>

      {/* ── dust rising from one area (particle cloud) ──── */}
      {(() => {
        const dustDrift = longCycleNoise(frame * 0.1, 6950) * 20;
        const dustPulse = 0.8 + longCycleNoise(frame * 0.15, 6951) * 0.3;
        return (
          <ellipse cx={850 + dustDrift} cy={720} rx={80 * dustPulse} ry={40 * dustPulse}
            fill={`url(#${ID}-dust)`} />
        );
      })()}

      {/* ── faint dust in air ────────────────────────────── */}
      <g opacity={0.05}>
        {Array.from({ length: 20 }, (_, i) => {
          const x = (i * 137 + frame * 0.15) % 2100 - 90;
          const y = HORIZON + 15 + longCycleNoise(frame * 0.25, i * 17 + 100) * 50;
          return <circle key={i} cx={x} cy={y} r={1.2 + longCycleNoise(frame * 0.1, i * 31) * 0.8} fill="#C8B898" />;
        })}
      </g>

      {/* ── painterly texture ────────────────────────────── */}
      <TerrainTexture id={`${ID}-t1`} y={HORIZON} height={510} color={CRACK_COLOR} opacity={0.03} seed={3401} dotCount={50} />
      <TerrainTexture id={`${ID}-t2`} y={750} height={330} color="#2A1E10" opacity={0.02} seed={3402} dotCount={35} />

      {/* ── ground mist — thin dust haze ─────────────────── */}
      <GroundMist id={`${ID}-m`} y={980} color="#B0A080" opacity={0.06} frame={frame} count={4} seed={4401} />

      {/* ── bottom darken vignette ───────────────────────── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="86%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.16} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default DirtPlain;
