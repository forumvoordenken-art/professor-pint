/**
 * sand_dunes — Dramatische zandduinen, golvend.
 *
 * Avontuur, woestijnontdekking, karavanen, Sahara-verhalen.
 * Rolling sand dunes with dramatic light/shadow interplay.
 * Wind-blown sand streaks along dune crests.
 * Warm golden palette with cool blue-purple shadows.
 * Camel caravan silhouettes on distant ridges.
 * Oasis hint on the horizon, scarab tracks in foreground.
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

/* ── colour palette ─────────────────────────────────────── */
const GOLD_LIGHT = '#E8C878';
const GOLD_MID = '#D8B060';
const GOLD_DARK = '#C8A050';
const AMBER_DEEP = '#A07838';
const SHADOW_BLUE = '#5A6888';
const SHADOW_PURPLE = '#6A5878';
const CREST_BRIGHT = '#F8E0A0';
const HAZE_SAND = '#D8C898';

const GROUND_STOPS = [
  { offset: '0%', color: '#D8B878' },
  { offset: '15%', color: '#D0A868' },
  { offset: '35%', color: '#C89858' },
  { offset: '55%', color: '#B88848' },
  { offset: '75%', color: '#A87838' },
  { offset: '100%', color: '#906828' },
];

/* ── dune layers (4+ layers, dramatic height) ───────────── */
const DUNES_DISTANT = [
  { path: generateHillPath(460, 60, 3, 5001), fill: '#C8B080', opacity: 0.4, drift: 0.08 },
  { path: generateHillPath(475, 45, 4, 5002), fill: '#C0A878', opacity: 0.45, drift: 0.1 },
];

const DUNES_FAR = [
  { path: generateHillPath(510, 70, 3, 5003), fill: '#C8A868', opacity: 0.6, drift: 0.15 },
  { path: generateHillPath(530, 55, 4, 5004), fill: '#C0A060', opacity: 0.55, drift: 0.18 },
];

const DUNES_MID = [
  { path: generateHillPath(580, 85, 3, 5005), fill: GOLD_MID, opacity: 0.75, drift: 0.28 },
  { path: generateHillPath(620, 60, 4, 5006), fill: '#C89850', opacity: 0.7, drift: 0.32 },
];

const DUNES_NEAR = [
  { path: generateHillPath(700, 100, 2, 5007), fill: GOLD_LIGHT, opacity: 0.9, drift: 0.45 },
  { path: generateHillPath(750, 70, 3, 5008), fill: GOLD_MID, opacity: 0.85, drift: 0.4 },
];

/* ── wind-blown crest particles ─────────────────────────── */
const rng1 = seededRandom(5201);
const CREST_PARTICLES = Array.from({ length: 60 }, () => ({
  x: rng1() * 1920,
  y: 480 + rng1() * 280,
  speed: 0.4 + rng1() * 1.2,
  size: 0.4 + rng1() * 1.8,
  opacity: 0.04 + rng1() * 0.1,
  seed: rng1() * 1000,
}));

/* ── sand ripple lines on dune faces ────────────────────── */
const rng2 = seededRandom(5301);
const SAND_RIPPLES = Array.from({ length: 25 }, (_, i) => ({
  y: 710 + i * 14,
  x1: 100 + rng2() * 200,
  x2: 1620 + rng2() * 200,
  curve: (rng2() - 0.5) * 6,
  opacity: 0.04 + rng2() * 0.06,
}));

/* ── camel caravan on distant ridge ─────────────────────── */
const CAMELS = [
  { x: 1200, y: 462, scale: 0.6 },
  { x: 1240, y: 460, scale: 0.55 },
  { x: 1275, y: 463, scale: 0.5 },
];

/* ── caravan tracks winding between dunes ───────────────── */
const rng3 = seededRandom(5401);
const TRACK_POINTS: Array<{ x: number; y: number }> = [];
for (let i = 0; i < 20; i++) {
  TRACK_POINTS.push({
    x: 300 + i * 75 + (rng3() - 0.5) * 40,
    y: 820 + Math.sin(i * 0.4) * 30 + (rng3() - 0.5) * 15,
  });
}

/* ── desert plant positions ─────────────────────────────── */
const rng4 = seededRandom(5501);
const DESERT_PLANTS = Array.from({ length: 4 }, () => ({
  x: 100 + rng4() * 1720,
  y: 850 + rng4() * 120,
  height: 10 + rng4() * 18,
  branches: 3 + Math.floor(rng4() * 4),
  seed: rng4() * 1000,
}));

/* ── scarab/beetle tracks in foreground ─────────────────── */
const rng5 = seededRandom(5601);
const BEETLE_TRACKS = Array.from({ length: 3 }, () => {
  const startX = 200 + rng5() * 1520;
  const startY = 920 + rng5() * 100;
  let path = `M${startX},${startY}`;
  for (let j = 0; j < 8; j++) {
    const dx = (rng5() - 0.3) * 25;
    const dy = (rng5() - 0.5) * 12;
    path += ` l${dx},${dy}`;
  }
  return { path, opacity: 0.06 + rng5() * 0.04 };
});

/* ── dune shadow shapes (cool blue-purple) ──────────────── */
const DUNE_SHADOWS = [
  { x: 0, y: 540, w: 600, h: 180, color: SHADOW_BLUE, opacity: 0.12 },
  { x: 800, y: 600, w: 500, h: 150, color: SHADOW_PURPLE, opacity: 0.1 },
  { x: 1400, y: 560, w: 520, h: 200, color: SHADOW_BLUE, opacity: 0.11 },
  { x: 200, y: 700, w: 700, h: 200, color: SHADOW_PURPLE, opacity: 0.14 },
  { x: 1100, y: 720, w: 600, h: 180, color: SHADOW_BLUE, opacity: 0.13 },
];

/* ── crest ridge highlight lines ────────────────────────── */
const CREST_LINES = [
  { x1: 50, y1: 508, cx: 480, cy: 488, x2: 900, y2: 512 },
  { x1: 400, y1: 528, cx: 750, cy: 510, x2: 1100, y2: 535 },
  { x1: 900, y1: 575, cx: 1200, cy: 555, x2: 1500, y2: 580 },
  { x1: 1300, y1: 460, cx: 1550, cy: 445, x2: 1800, y2: 465 },
  { x1: 100, y1: 695, cx: 500, cy: 670, x2: 900, y2: 700 },
  { x1: 1000, y1: 710, cx: 1350, cy: 685, x2: 1700, y2: 715 },
];

export const SandDunes: React.FC<AssetProps> = ({ frame }) => {
  const allDunes = useMemo(() => ({
    distant: DUNES_DISTANT,
    far: DUNES_FAR,
    mid: DUNES_MID,
    near: DUNES_NEAR,
  }), []);

  /* animated sand haze opacity */
  const hazeShift = longCycleNoise(frame * 0.05, 7001) * 0.04;
  /* sun glare pulse */
  const glarePulse = 0.08 + longCycleNoise(frame * 0.08, 7002) * 0.04;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── gradient defs ────────────────────────────────── */}
      <defs>
        {/* shadow gradient for dune sides */}
        <linearGradient id={`${ID}-shadow-lr`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SHADOW_BLUE} stopOpacity={0.15} />
          <stop offset="40%" stopColor={SHADOW_BLUE} stopOpacity={0} />
          <stop offset="60%" stopColor={SHADOW_PURPLE} stopOpacity={0} />
          <stop offset="100%" stopColor={SHADOW_PURPLE} stopOpacity={0.18} />
        </linearGradient>
        {/* sun glare radial */}
        <radialGradient id={`${ID}-glare`} cx="0.65" cy="0.35" r="0.4">
          <stop offset="0%" stopColor="#FFF8D0" stopOpacity={glarePulse} />
          <stop offset="50%" stopColor="#F8E8B0" stopOpacity={glarePulse * 0.4} />
          <stop offset="100%" stopColor="#F8E8B0" stopOpacity={0} />
        </radialGradient>
        {/* distance haze gradient */}
        <linearGradient id={`${ID}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={HAZE_SAND} stopOpacity={0.25 + hazeShift} />
          <stop offset="60%" stopColor={HAZE_SAND} stopOpacity={0.08} />
          <stop offset="100%" stopColor={HAZE_SAND} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* ── horizon blend — warm dusty ───────────────────── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 120} height={240} color="#D8C090" opacity={0.5} />

      {/* ── sandy atmosphere haze thickening with distance ── */}
      <rect x={0} y={HORIZON - 80} width={1920} height={350} fill={`url(#${ID}-haze)`} />

      {/* ── oasis hint — distant dark-green spot on horizon ─ */}
      <ellipse cx={350} cy={HORIZON - 5} rx={35} ry={8} fill="#4A6A30" opacity={0.2} />
      <ellipse cx={355} cy={HORIZON - 8} rx={18} ry={5} fill="#3A5A20" opacity={0.15} />
      {/* tiny palm silhouettes */}
      <line x1={345} y1={HORIZON - 8} x2={343} y2={HORIZON - 22} stroke="#3A5A20" strokeWidth={1.2} opacity={0.12} />
      <line x1={358} y1={HORIZON - 8} x2={360} y2={HORIZON - 18} stroke="#3A5A20" strokeWidth={1} opacity={0.1} />

      {/* ── distant dune layer ───────────────────────────── */}
      <HillSilhouette hills={allDunes.distant} frame={frame} idPrefix={`${ID}-dd`} />

      {/* ── camel caravan silhouettes on distant ridge ───── */}
      <g>
        {CAMELS.map((c, i) => {
          const bob = longCycleNoise(frame * 0.2, 8001 + i * 11) * 1.5;
          return (
            <g key={i} transform={`translate(${c.x},${c.y + bob}) scale(${c.scale})`} opacity={0.18}>
              {/* body */}
              <ellipse cx={0} cy={0} rx={12} ry={6} fill="#3A2A18" />
              {/* hump */}
              <ellipse cx={-2} cy={-6} rx={5} ry={4} fill="#3A2A18" />
              {/* neck */}
              <line x1={8} y1={-2} x2={12} y2={-12} stroke="#3A2A18" strokeWidth={2} />
              {/* head */}
              <circle cx={13} cy={-13} r={2} fill="#3A2A18" />
              {/* legs */}
              <line x1={-5} y1={5} x2={-6} y2={14} stroke="#3A2A18" strokeWidth={1.5} />
              <line x1={5} y1={5} x2={4} y2={14} stroke="#3A2A18" strokeWidth={1.5} />
            </g>
          );
        })}
      </g>

      {/* ── far dune layer ───────────────────────────────── */}
      <HillSilhouette hills={allDunes.far} frame={frame} idPrefix={`${ID}-df`} />

      {/* ── dune shadow overlay — cool blue/purple patches ── */}
      {DUNE_SHADOWS.map((s, i) => {
        const drift = longCycleNoise(frame * 0.06, 6001 + i * 19) * 15;
        return (
          <ellipse key={i} cx={s.x + s.w / 2 + drift} cy={s.y + s.h / 2}
            rx={s.w / 2} ry={s.h / 2} fill={s.color} opacity={s.opacity} />
        );
      })}

      {/* ── shadow side gradient (left/right cool tones) ─── */}
      <rect x={0} y={HORIZON - 20} width={1920} height={400} fill={`url(#${ID}-shadow-lr)`} />

      {/* ── mid dune layer ───────────────────────────────── */}
      <HillSilhouette hills={allDunes.mid} frame={frame} idPrefix={`${ID}-dm`} />

      {/* ── dune ridge crest highlights (bright blown edges) ─ */}
      {CREST_LINES.map((cl, i) => {
        const shimmer = longCycleNoise(frame * 0.12, 7101 + i * 7) * 0.04;
        return (
          <path key={i}
            d={`M${cl.x1},${cl.y1} Q${cl.cx},${cl.cy} ${cl.x2},${cl.y2}`}
            fill="none" stroke={CREST_BRIGHT} strokeWidth={2}
            opacity={0.1 + shimmer} strokeLinecap="round" />
        );
      })}

      {/* ── near dune layer ──────────────────────────────── */}
      <HillSilhouette hills={allDunes.near} frame={frame} idPrefix={`${ID}-dn`} />

      {/* ── base ground fill ─────────────────────────────── */}
      <GroundPlane id={ID} horizonY={720} stops={GROUND_STOPS} />

      {/* ── sand ripple texture on visible dune faces ────── */}
      <g>
        {SAND_RIPPLES.map((r, i) => {
          const drift = longCycleNoise(frame * 0.08, 7201 + i * 13) * 10;
          return (
            <path key={i}
              d={`M${r.x1 + drift},${r.y} Q${960},${r.y + r.curve} ${r.x2 + drift},${r.y}`}
              fill="none" stroke={GOLD_DARK} strokeWidth={0.7}
              opacity={r.opacity} />
          );
        })}
      </g>

      {/* ── deep valley shadows between near dunes ───────── */}
      <g opacity={0.18}>
        <ellipse cx={400} cy={760} rx={250} ry={25} fill="#4A3828" />
        <ellipse cx={1100} cy={770} rx={300} ry={30} fill="#4A3828" />
        <ellipse cx={1650} cy={745} rx={200} ry={20} fill="#4A3828" />
      </g>

      {/* ── caravan footprint trail winding between dunes ── */}
      <g opacity={0.06}>
        {TRACK_POINTS.map((p, i) => {
          if (i === 0) return null;
          const prev = TRACK_POINTS[i - 1];
          return (
            <g key={i}>
              {/* paired footprints */}
              <ellipse cx={p.x - 3} cy={p.y} rx={2.5} ry={1.5} fill="#6A5838"
                transform={`rotate(${Math.atan2(p.y - prev.y, p.x - prev.x) * 57.3}, ${p.x - 3}, ${p.y})`} />
              <ellipse cx={p.x + 3} cy={p.y + 2} rx={2.5} ry={1.5} fill="#6A5838"
                transform={`rotate(${Math.atan2(p.y - prev.y, p.x - prev.x) * 57.3}, ${p.x + 3}, ${p.y + 2})`} />
            </g>
          );
        })}
      </g>

      {/* ── desert plants clinging to dune base ──────────── */}
      {DESERT_PLANTS.map((pl, i) => {
        const sway = longCycleNoise(frame * 0.25, pl.seed) * 4;
        return (
          <g key={i} opacity={0.35}>
            {/* main stem */}
            <line x1={pl.x} y1={pl.y} x2={pl.x + sway} y2={pl.y - pl.height}
              stroke="#7A6A30" strokeWidth={1.2} strokeLinecap="round" />
            {/* scraggly branches */}
            {Array.from({ length: pl.branches }, (_, j) => {
              const bRng = seededRandom(pl.seed + j * 17);
              const bY = pl.y - pl.height * (0.3 + bRng() * 0.6);
              const bLen = 4 + bRng() * 8;
              const bDir = bRng() > 0.5 ? 1 : -1;
              return (
                <line key={j}
                  x1={pl.x + sway * (bY - pl.y) / (-pl.height)}
                  y1={bY}
                  x2={pl.x + sway * (bY - pl.y) / (-pl.height) + bLen * bDir}
                  y2={bY - bLen * 0.3}
                  stroke="#8A7A38" strokeWidth={0.7} strokeLinecap="round" />
              );
            })}
          </g>
        );
      })}

      {/* ── beetle/scarab tracks in foreground sand ──────── */}
      {BEETLE_TRACKS.map((bt, i) => (
        <path key={i} d={bt.path} fill="none" stroke="#7A6A48"
          strokeWidth={0.5} opacity={bt.opacity}
          strokeDasharray="2,3" strokeLinecap="round" />
      ))}

      {/* ── wind-blown sand particles streaming off crests ── */}
      <g>
        {CREST_PARTICLES.map((p, i) => {
          const windX = (frame * p.speed * 0.8) % 2400 - 240;
          const waveY = longCycleNoise(frame * 0.35, p.seed + i * 7) * 6;
          const fadeX = ((p.x + windX) % 2400 - 240);
          const distFromCrest = Math.abs(waveY);
          const fadeFactor = Math.max(0, 1 - distFromCrest / 8);
          return (
            <circle key={i}
              cx={fadeX}
              cy={p.y + waveY}
              r={p.size}
              fill="#D8C888"
              opacity={p.opacity * fadeFactor}
            />
          );
        })}
      </g>

      {/* ── sun glare hotspot on nearest dune face ───────── */}
      <ellipse cx={1200} cy={740} rx={280} ry={120} fill={`url(#${ID}-glare)`} />

      {/* ── sand color gradient overlays ─────────────────── */}
      {/* orange-gold lit areas */}
      <g opacity={0.05}>
        <rect x={600} y={700} width={800} height={250} fill="#F0C868" rx={40} />
      </g>
      {/* deep amber in shadow areas */}
      <g opacity={0.06}>
        <ellipse cx={250} cy={850} rx={250} ry={100} fill={AMBER_DEEP} />
        <ellipse cx={1650} cy={870} rx={200} ry={90} fill={AMBER_DEEP} />
      </g>

      {/* ── painterly texture overlay ────────────────────── */}
      <TerrainTexture id={`${ID}-t1`} y={HORIZON} height={580} color="#8A7040" opacity={0.025} seed={3301} dotCount={60} />
      <TerrainTexture id={`${ID}-t2`} y={700} height={380} color="#6A5030" opacity={0.02} seed={3302} dotCount={40} />

      {/* ── ground mist / sand haze ──────────────────────── */}
      <GroundMist id={`${ID}-m1`} y={920} color={HAZE_SAND} opacity={0.12} frame={frame} count={6} seed={4301} />
      <GroundMist id={`${ID}-m2`} y={HORIZON + 40} color={HAZE_SAND} opacity={0.06} frame={frame} count={4} seed={4302} />

      {/* ── warm overall tint ────────────────────────────── */}
      <rect x={0} y={HORIZON} width={1920} height={580} fill="#F8D888" opacity={0.035} />

      {/* ── bottom vignette darken ───────────────────────── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="88%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.14} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default SandDunes;
