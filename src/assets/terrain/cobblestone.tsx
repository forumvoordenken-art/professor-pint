/**
 * cobblestone — Keienstenen straat, stad, marktplein.
 *
 * Middeleeuwen, Renaissance, stadsverhalen, handel.
 * Dense cobblestone pattern with visible mortar lines.
 * Perspective grid: stones smaller and denser in distance.
 * Gutter channels, rain puddles, weeds between cracks.
 * Cart wheel ruts, market debris, lantern post, drain grate.
 * Moss patches, boot scuffs, building shadow, curb edges.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  TerrainTexture,
  GroundMist,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'cobblestone';
const HORIZON = 560;

/* ── colour palette ─────────────────────────────────────── */
const MORTAR_DARK = '#2A2420';
const STONE_WARM = '#787068';
const WET_DARK = '#484038';
const MOSS_GREEN = '#3A4A30';
const PUDDLE_SKY = '#506878';
const GUTTER_DARK = '#2A2218';

const GROUND_STOPS = [
  { offset: '0%', color: '#787068' },
  { offset: '20%', color: '#6A6258' },
  { offset: '45%', color: '#5A5248' },
  { offset: '70%', color: '#4A4238' },
  { offset: '100%', color: '#3A3228' },
];

const STONE_COLORS = [
  '#706860', '#686058', '#787068', '#605850', '#7A7268',
  '#585048', '#6A6860', '#706868', '#5A5850', '#787878',
];

/* ── generate cobblestone grid with perspective ─────────── */
const rng1 = seededRandom(7001);

interface StoneData {
  cx: number; cy: number; rx: number; ry: number;
  color: string; highlight: number; angle: number;
  wet: boolean; mossy: boolean;
}

const STONES: StoneData[] = [];

for (let row = 0; row < 22; row++) {
  const y = HORIZON + 25 + row * 24;
  const perspectiveFactor = row / 22;
  const stoneWidth = 22 + row * 1.8;
  const stoneHeight = 11 + row * 0.9;
  const stonesPerRow = Math.ceil(1920 / stoneWidth) + 2;
  const offsetX = (row % 2) * stoneWidth * 0.5;
  const rowJitter = (rng1() - 0.5) * 2;

  for (let col = 0; col < stonesPerRow; col++) {
    const cx = col * stoneWidth + offsetX + (rng1() - 0.5) * 5;
    const cy = y + (rng1() - 0.5) * 4 + rowJitter;
    const rVal = rng1();
    STONES.push({
      cx,
      cy,
      rx: stoneWidth * 0.4 + (rng1() - 0.5) * 4,
      ry: stoneHeight * 0.4 + (rng1() - 0.5) * 2.5,
      color: STONE_COLORS[Math.floor(rng1() * STONE_COLORS.length)],
      highlight: rng1(),
      angle: (rng1() - 0.5) * 10,
      wet: rVal < 0.15,
      mossy: rVal > 0.85 && perspectiveFactor < 0.6,
    });
  }
}

/* ── rain puddles with sky reflection ───────────────────── */
const PUDDLES = [
  { cx: 520, cy: 740, rx: 65, ry: 20 },
  { cx: 1100, cy: 820, rx: 80, ry: 25 },
  { cx: 1550, cy: 700, rx: 50, ry: 16 },
  { cx: 350, cy: 900, rx: 55, ry: 18 },
];

/* ── weeds growing between stone cracks ─────────────────── */
const rng2 = seededRandom(7101);
const WEEDS = Array.from({ length: 14 }, () => ({
  x: rng2() * 1920,
  y: HORIZON + 60 + rng2() * 440,
  height: 3 + rng2() * 8,
  blades: 2 + Math.floor(rng2() * 3),
  seed: rng2() * 1000,
}));

/* ── cart wheel ruts — worn grooves ─────────────────────── */
const CART_RUTS = [
  { x: 680, y1: HORIZON + 30, y2: 1080 },
  { x: 780, y1: HORIZON + 30, y2: 1080 },
];

/* ── market debris ──────────────────────────────────────── */
const rng3 = seededRandom(7201);
const STRAW_BITS = Array.from({ length: 12 }, () => ({
  x: 300 + rng3() * 1320,
  y: 700 + rng3() * 300,
  len: 5 + rng3() * 12,
  angle: rng3() * 360,
  opacity: 0.06 + rng3() * 0.06,
}));

const DROPPED_FRUITS = [
  { cx: 850, cy: 780, r: 4, color: '#8A3030' },
  { cx: 1200, cy: 850, r: 3.5, color: '#6A8A30' },
  { cx: 450, cy: 820, r: 3, color: '#C8A030' },
];

const CLOTH_SCRAPS = [
  { x: 1050, y: 760, w: 15, h: 10, color: '#8A4040', angle: 25 },
  { x: 600, y: 870, w: 12, h: 8, color: '#404870', angle: -15 },
];

/* ── lantern post base ──────────────────────────────────── */
const LANTERN_X = 1700;
const LANTERN_Y = 680;

/* ── drain grate ────────────────────────────────────────── */
const DRAIN = { cx: 960, cy: 880, w: 40, h: 30 };

/* ── moss patches (green-black) ─────────────────────────── */
const rng4 = seededRandom(7301);
const MOSS_PATCHES = Array.from({ length: 8 }, () => ({
  cx: rng4() * 1920,
  cy: HORIZON + 50 + rng4() * 400,
  rx: 10 + rng4() * 30,
  ry: 5 + rng4() * 12,
  opacity: 0.08 + rng4() * 0.1,
}));

/* ── boot scuff marks ───────────────────────────────────── */
const SCUFF_MARKS = [
  { cx: 400, cy: 800, rx: 20, ry: 8 },
  { cx: 900, cy: 750, rx: 25, ry: 10 },
  { cx: 1400, cy: 830, rx: 18, ry: 7 },
  { cx: 700, cy: 920, rx: 22, ry: 9 },
  { cx: 1300, cy: 700, rx: 15, ry: 6 },
];

/* ── building shadow falling across street ──────────────── */
const BUILDING_SHADOW_PATH = 'M0,560 L0,1080 L800,1080 L650,560 Z';

/* ── curb/step detail at edges ──────────────────────────── */
const CURB_LEFT_Y = HORIZON + 25;
const CURB_RIGHT_Y = HORIZON + 25;

export const Cobblestone: React.FC<AssetProps> = ({ frame }) => {
  const visibleStones = useMemo(() =>
    STONES.filter(s => s.cx > -60 && s.cx < 1980),
  []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        {/* puddle gradients */}
        {PUDDLES.map((p, i) => (
          <radialGradient key={i} id={`${ID}-puddle-${i}`} cx="0.5" cy="0.35" r="0.5">
            <stop offset="0%" stopColor={PUDDLE_SKY} stopOpacity={0.35} />
            <stop offset="50%" stopColor={PUDDLE_SKY} stopOpacity={0.18} />
            <stop offset="100%" stopColor={PUDDLE_SKY} stopOpacity={0} />
          </radialGradient>
        ))}
        {/* wet stone sheen */}
        <radialGradient id={`${ID}-wet`} cx="0.4" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="white" stopOpacity={0.08} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </radialGradient>
        {/* building shadow gradient */}
        <linearGradient id={`${ID}-bshadow`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.12} />
          <stop offset="80%" stopColor="#000" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* ── horizon blend ────────────────────────────────── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 60} height={120} color={STONE_WARM} opacity={0.4} />

      {/* ── base ground (gap fill) ───────────────────────── */}
      <GroundPlane id={ID} horizonY={HORIZON} stops={GROUND_STOPS} />

      {/* ── mortar base — dark grid layer between stones ─── */}
      <rect x={0} y={HORIZON + 15} width={1920} height={1080 - HORIZON - 15}
        fill={MORTAR_DARK} opacity={0.35} />

      {/* ── gutter channels on both sides ────────────────── */}
      <g opacity={0.2}>
        {/* left gutter — recessed, darker */}
        <path d={`M240,${HORIZON + 25} L220,1080 L260,1080 L280,${HORIZON + 25} Z`}
          fill={GUTTER_DARK} />
        <line x1={240} y1={HORIZON + 25} x2={220} y2={1080}
          stroke={MORTAR_DARK} strokeWidth={1.5} opacity={0.4} />
        <line x1={280} y1={HORIZON + 25} x2={260} y2={1080}
          stroke={MORTAR_DARK} strokeWidth={1.5} opacity={0.4} />
        {/* right gutter */}
        <path d={`M1640,${HORIZON + 25} L1660,1080 L1700,1080 L1680,${HORIZON + 25} Z`}
          fill={GUTTER_DARK} />
        <line x1={1640} y1={HORIZON + 25} x2={1660} y2={1080}
          stroke={MORTAR_DARK} strokeWidth={1.5} opacity={0.4} />
        <line x1={1680} y1={HORIZON + 25} x2={1700} y2={1080}
          stroke={MORTAR_DARK} strokeWidth={1.5} opacity={0.4} />
      </g>

      {/* ── curb/step detail at edges ────────────────────── */}
      <g opacity={0.15}>
        <rect x={180} y={CURB_LEFT_Y} width={60} height={1080 - CURB_LEFT_Y}
          fill="#5A5248" />
        <line x1={180} y1={CURB_LEFT_Y} x2={180} y2={1080}
          stroke="#787068" strokeWidth={2} opacity={0.3} />
        <rect x={1680} y={CURB_RIGHT_Y} width={60} height={1080 - CURB_RIGHT_Y}
          fill="#5A5248" />
        <line x1={1740} y1={CURB_RIGHT_Y} x2={1740} y2={1080}
          stroke="#787068" strokeWidth={2} opacity={0.3} />
      </g>

      {/* ── cobblestones — individual stones with mortar ─── */}
      {visibleStones.map((s, i) => (
        <g key={i}>
          {/* stone body */}
          <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.color}
            transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
          {/* top highlight — worn smooth surface */}
          {s.highlight > 0.55 && (
            <ellipse cx={s.cx - 1} cy={s.cy - s.ry * 0.2}
              rx={s.rx * 0.5} ry={s.ry * 0.3}
              fill="white" opacity={0.05}
              transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
          )}
          {/* bottom shadow edge */}
          {s.highlight < 0.3 && (
            <ellipse cx={s.cx + 1} cy={s.cy + s.ry * 0.25}
              rx={s.rx * 0.6} ry={s.ry * 0.2}
              fill={MORTAR_DARK} opacity={0.08}
              transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
          )}
          {/* wet stone sheen */}
          {s.wet && (
            <ellipse cx={s.cx} cy={s.cy} rx={s.rx * 0.8} ry={s.ry * 0.8}
              fill={`url(#${ID}-wet)`}
              transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
          )}
          {/* mossy stone */}
          {s.mossy && (
            <ellipse cx={s.cx + s.rx * 0.2} cy={s.cy + s.ry * 0.1}
              rx={s.rx * 0.4} ry={s.ry * 0.3}
              fill={MOSS_GREEN} opacity={0.15}
              transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`} />
          )}
        </g>
      ))}

      {/* ── cart wheel ruts — worn groove lines ──────────── */}
      {CART_RUTS.map((rut, i) => {
        const wobble = longCycleNoise(frame * 0.04, 7401 + i) * 3;
        return (
          <g key={i} opacity={0.1}>
            <line x1={rut.x + wobble} y1={rut.y1}
              x2={rut.x + 30 + wobble} y2={rut.y2}
              stroke={MORTAR_DARK} strokeWidth={4} />
            {/* worn smooth inside groove */}
            <line x1={rut.x + wobble + 1} y1={rut.y1}
              x2={rut.x + 31 + wobble} y2={rut.y2}
              stroke={WET_DARK} strokeWidth={2} opacity={0.5} />
          </g>
        );
      })}

      {/* ── building shadow falling across street ────────── */}
      <path d={BUILDING_SHADOW_PATH} fill={`url(#${ID}-bshadow)`} />

      {/* ── moss patches in shaded areas ─────────────────── */}
      {MOSS_PATCHES.map((mp, i) => (
        <ellipse key={i} cx={mp.cx} cy={mp.cy} rx={mp.rx} ry={mp.ry}
          fill={MOSS_GREEN} opacity={mp.opacity} />
      ))}

      {/* ── rain puddles with reflection and ripple ──────── */}
      {PUDDLES.map((p, i) => {
        const shimmer = longCycleNoise(frame * 0.25, i * 31 + 200) * 0.04;
        const rippleR = longCycleNoise(frame * 0.6, i * 47 + 300);
        return (
          <g key={i}>
            <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
              fill={`url(#${ID}-puddle-${i})`} />
            {/* sky reflection highlight */}
            <ellipse cx={p.cx + 4} cy={p.cy - 3} rx={p.rx * 0.35} ry={p.ry * 0.45}
              fill="white" opacity={0.05 + shimmer} />
            {/* ripple ring */}
            <ellipse cx={p.cx + rippleR * 10} cy={p.cy}
              rx={p.rx * (0.3 + Math.abs(rippleR) * 0.4)}
              ry={p.ry * (0.3 + Math.abs(rippleR) * 0.4)}
              fill="none" stroke="white" strokeWidth={0.4}
              opacity={0.03 + Math.abs(rippleR) * 0.03} />
          </g>
        );
      })}

      {/* ── weeds growing between cracks ─────────────────── */}
      {WEEDS.map((w, i) => {
        const sway = longCycleNoise(frame * 0.4, w.seed) * 3;
        return (
          <g key={i} opacity={0.3}>
            {Array.from({ length: w.blades }, (_, j) => {
              const spread = (j - (w.blades - 1) / 2) * 3;
              return (
                <line key={j}
                  x1={w.x + spread} y1={w.y}
                  x2={w.x + spread + sway} y2={w.y - w.height * (0.7 + j * 0.15)}
                  stroke="#4A6A30" strokeWidth={0.8} strokeLinecap="round" />
              );
            })}
            {/* tiny leaf dot at tip */}
            <circle cx={w.x + sway} cy={w.y - w.height} r={1} fill="#5A8A3A" opacity={0.4} />
          </g>
        );
      })}

      {/* ── market debris: straw bits ────────────────────── */}
      {STRAW_BITS.map((s, i) => (
        <line key={`straw-${i}`}
          x1={s.x} y1={s.y}
          x2={s.x + Math.cos(s.angle * Math.PI / 180) * s.len}
          y2={s.y + Math.sin(s.angle * Math.PI / 180) * s.len}
          stroke="#C8B880" strokeWidth={0.6} opacity={s.opacity} strokeLinecap="round" />
      ))}

      {/* ── market debris: dropped fruit ─────────────────── */}
      {DROPPED_FRUITS.map((f, i) => (
        <g key={`fruit-${i}`} opacity={0.2}>
          <circle cx={f.cx} cy={f.cy} r={f.r} fill={f.color} />
          <circle cx={f.cx - f.r * 0.3} cy={f.cy - f.r * 0.3} r={f.r * 0.3}
            fill="white" opacity={0.15} />
        </g>
      ))}

      {/* ── market debris: cloth scraps ──────────────────── */}
      {CLOTH_SCRAPS.map((c, i) => (
        <rect key={`cloth-${i}`} x={c.x} y={c.y} width={c.w} height={c.h}
          fill={c.color} opacity={0.1} rx={2}
          transform={`rotate(${c.angle}, ${c.x + c.w / 2}, ${c.y + c.h / 2})`} />
      ))}

      {/* ── lantern post base ────────────────────────────── */}
      <g opacity={0.25}>
        {/* stone base */}
        <rect x={LANTERN_X - 15} y={LANTERN_Y} width={30} height={20}
          fill="#5A5248" rx={3} />
        <rect x={LANTERN_X - 12} y={LANTERN_Y - 5} width={24} height={10}
          fill="#5A5A50" rx={2} />
        {/* iron post */}
        <line x1={LANTERN_X} y1={LANTERN_Y - 5} x2={LANTERN_X} y2={LANTERN_Y - 80}
          stroke="#3A3838" strokeWidth={5} strokeLinecap="round" />
        {/* post bracket */}
        <path d={`M${LANTERN_X},${LANTERN_Y - 70} Q${LANTERN_X + 20},${LANTERN_Y - 75} ${LANTERN_X + 25},${LANTERN_Y - 85}`}
          fill="none" stroke="#3A3838" strokeWidth={2.5} strokeLinecap="round" />
        {/* post base shadow on cobbles */}
        <ellipse cx={LANTERN_X} cy={LANTERN_Y + 18} rx={25} ry={6}
          fill="#000" opacity={0.08} />
      </g>

      {/* ── drain grate — iron grid ──────────────────────── */}
      <g opacity={0.2}>
        <rect x={DRAIN.cx - DRAIN.w / 2} y={DRAIN.cy - DRAIN.h / 2}
          width={DRAIN.w} height={DRAIN.h}
          fill="#1A1818" rx={3} />
        {/* grate bars */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i}
            x1={DRAIN.cx - DRAIN.w / 2 + 4 + i * (DRAIN.w - 8) / 4}
            y1={DRAIN.cy - DRAIN.h / 2 + 3}
            x2={DRAIN.cx - DRAIN.w / 2 + 4 + i * (DRAIN.w - 8) / 4}
            y2={DRAIN.cy + DRAIN.h / 2 - 3}
            stroke="#3A3838" strokeWidth={2} />
        ))}
        {/* cross bars */}
        <line x1={DRAIN.cx - DRAIN.w / 2 + 3} y1={DRAIN.cy - 3}
          x2={DRAIN.cx + DRAIN.w / 2 - 3} y2={DRAIN.cy - 3}
          stroke="#3A3838" strokeWidth={1.5} />
        <line x1={DRAIN.cx - DRAIN.w / 2 + 3} y1={DRAIN.cy + 5}
          x2={DRAIN.cx + DRAIN.w / 2 - 3} y2={DRAIN.cy + 5}
          stroke="#3A3838" strokeWidth={1.5} />
        {/* rim highlight */}
        <rect x={DRAIN.cx - DRAIN.w / 2 - 2} y={DRAIN.cy - DRAIN.h / 2 - 2}
          width={DRAIN.w + 4} height={DRAIN.h + 4}
          fill="none" stroke="#5A5858" strokeWidth={2} rx={4} opacity={0.4} />
      </g>

      {/* ── boot scuff marks — dark wear patterns ────────── */}
      {SCUFF_MARKS.map((sc, i) => (
        <ellipse key={i} cx={sc.cx} cy={sc.cy} rx={sc.rx} ry={sc.ry}
          fill={WET_DARK} opacity={0.06} />
      ))}

      {/* ── highlighted wet vs dry areas ─────────────────── */}
      <g opacity={0.04}>
        {/* wet patch (recently rained) */}
        <ellipse cx={600} cy={780} rx={200} ry={80} fill={WET_DARK} />
        <ellipse cx={1300} cy={850} rx={180} ry={70} fill={WET_DARK} />
      </g>
      <g opacity={0.03}>
        {/* dry patch (elevated, no water) */}
        <ellipse cx={1000} cy={700} rx={250} ry={60} fill={STONE_WARM} />
      </g>

      {/* ── painterly texture overlay ────────────────────── */}
      <TerrainTexture id={`${ID}-t1`} y={HORIZON} height={520} color={MORTAR_DARK}
        opacity={0.025} seed={3501} dotCount={50} />
      <TerrainTexture id={`${ID}-t2`} y={750} height={330} color="#1A1818"
        opacity={0.02} seed={3502} dotCount={35} />

      {/* ── subtle ground mist after rain ────────────────── */}
      <GroundMist id={`${ID}-m`} y={1000} color="#8A9098" opacity={0.05}
        frame={frame} count={4} seed={4501} />

      {/* ── bottom vignette darken ───────────────────────── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="84%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default Cobblestone;
