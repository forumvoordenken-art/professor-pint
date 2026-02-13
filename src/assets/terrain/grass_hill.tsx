/**
 * grass_hill — Dramatic rolling hills with pastoral British countryside detail.
 *
 * Multiple dramatic hill layers (4+) with strong depth separation, winding dirt
 * path, scattered bushes, sheep silhouettes, hedgerow lines, field patches in
 * varying tones, valley mist, cloud shadows drifting across hills, rocky outcrops,
 * bird silhouettes, fence line going up a hill, strong parallax.
 *
 * Oil painting style — muted layered tones, never flat CSS colors.
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
  renderGrassBlade,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'grass-hill';
const HORIZON = 480;

/* ── Ground gradient ── */
const GROUND_STOPS = [
  { offset: '0%', color: '#5A8838' },
  { offset: '20%', color: '#4E7C32' },
  { offset: '40%', color: '#42702A' },
  { offset: '60%', color: '#386224' },
  { offset: '80%', color: '#305820' },
  { offset: '100%', color: '#264818' },
];

/* ── Hill layers — 5 layers for strong depth ── */
const HILLS_VERY_FAR = [
  { path: generateHillPath(430, 70, 4, 1100), fill: '#8A9EA8', opacity: 0.35, drift: 0.08 },
  { path: generateHillPath(445, 55, 5, 1101), fill: '#7A94A0', opacity: 0.4, drift: 0.1 },
];
const HILLS_FAR = [
  { path: generateHillPath(470, 60, 4, 1102), fill: '#6A8A80', opacity: 0.5, drift: 0.18 },
  { path: generateHillPath(490, 50, 5, 1103), fill: '#5E8070', opacity: 0.55, drift: 0.22 },
];
const HILLS_MID = [
  { path: generateHillPath(530, 55, 4, 1104), fill: '#4E7850', opacity: 0.65, drift: 0.35 },
  { path: generateHillPath(555, 45, 5, 1105), fill: '#447040', opacity: 0.7, drift: 0.3 },
];
const HILLS_NEAR_MID = [
  { path: generateHillPath(600, 40, 3, 1106), fill: '#3C6838', opacity: 0.78, drift: 0.45 },
];
const HILLS_NEAR = [
  { path: generateHillPath(660, 35, 3, 1107), fill: '#346030', opacity: 0.85, drift: 0.6 },
];

/* ── Field patches (colored rectangles on mid-hills) ── */
const fieldRng = seededRandom(5001);
const FIELD_PATCHES = Array.from({ length: 10 }, () => {
  const colors = ['#5A8A40', '#6A9448', '#4A7A30', '#7A9850', '#8AA058',
    '#687A38', '#5A7030', '#4A6828', '#6A8840', '#7A8C48'];
  return {
    x: fieldRng() * 1920,
    y: 500 + fieldRng() * 180,
    w: 80 + fieldRng() * 200,
    h: 30 + fieldRng() * 60,
    color: colors[Math.floor(fieldRng() * colors.length)],
    angle: (fieldRng() - 0.5) * 8,
    opacity: 0.25 + fieldRng() * 0.2,
  };
});

/* ── Hedgerow lines ── */
const hedgeRng = seededRandom(5101);
const HEDGEROWS = Array.from({ length: 7 }, () => ({
  x1: hedgeRng() * 1600,
  y1: 510 + hedgeRng() * 160,
  length: 100 + hedgeRng() * 250,
  angle: (hedgeRng() - 0.5) * 20,
  thickness: 3 + hedgeRng() * 4,
}));

/* ── Sheep silhouettes on distant hills ── */
const sheepRng = seededRandom(6001);
const SHEEP = Array.from({ length: 5 }, () => ({
  cx: 200 + sheepRng() * 1520,
  cy: 460 + sheepRng() * 80,
  size: 3 + sheepRng() * 3,
  seed: sheepRng() * 1000,
}));

/* ── Bushes/shrubs on hillsides ── */
const bushRng = seededRandom(6101);
const BUSHES = Array.from({ length: 12 }, () => ({
  cx: bushRng() * 1920,
  cy: 550 + bushRng() * 200,
  rx: 10 + bushRng() * 18,
  ry: 6 + bushRng() * 10,
  shade: ['#2A5018', '#285420', '#1E4814', '#305828', '#264C1A'][Math.floor(bushRng() * 5)],
}));

/* ── Winding dirt path ── */
const PATH_D = 'M880,560 Q920,620 900,690 Q880,760 920,830 Q960,900 940,970 L980,1080 L900,1080 Q880,970 860,900 Q840,830 820,760 Q800,690 840,620 Z';
const PATH_HIGHLIGHT = 'M885,565 Q918,620 898,688 Q878,755 915,825 Q952,895 935,965 L970,1080 L910,1080 Q885,965 865,895 Q845,825 828,758 Q808,690 845,625 Z';

/* ── Rocky outcrops ── */
const rockRng = seededRandom(7001);
const ROCK_OUTCROPS = Array.from({ length: 6 }, () => ({
  cx: rockRng() * 1920,
  cy: 570 + rockRng() * 150,
  w: 8 + rockRng() * 20,
  h: 5 + rockRng() * 12,
  color: ['#7A7868', '#8A8878', '#6A6858', '#9A9888'][Math.floor(rockRng() * 4)],
}));

/* ── Bird silhouettes ── */
const birdRng = seededRandom(7101);
const BIRDS = Array.from({ length: 6 }, () => ({
  cx: 200 + birdRng() * 1520,
  cy: 380 + birdRng() * 100,
  size: 4 + birdRng() * 6,
  seed: birdRng() * 1000,
}));

/* ── Cloud shadows ── */
const CLOUD_SHADOWS = [
  { baseX: 300, y: 520, rx: 220, ry: 60, seed: 8001 },
  { baseX: 900, y: 580, rx: 280, ry: 70, seed: 8002 },
  { baseX: 1500, y: 540, rx: 200, ry: 55, seed: 8003 },
];

/* ── Fence line going up a hill ── */
const fenceRng = seededRandom(9001);
const FENCE_HILL = Array.from({ length: 8 }, (_, i) => ({
  x: 1300 + i * 50,
  y: 620 - i * 15 + (fenceRng() - 0.5) * 6,
}));

/* ── Wildflowers on near hill ── */
const flowerRng = seededRandom(9101);
const NEAR_FLOWERS = Array.from({ length: 18 }, () => ({
  cx: flowerRng() * 1920,
  cy: 680 + flowerRng() * 300,
  color: ['#D8A038', '#C84040', '#A858A8', '#D06868', '#E8C040'][Math.floor(flowerRng() * 5)],
  size: 1.5 + flowerRng() * 2,
  seed: flowerRng() * 1000,
}));

/* ── Grass scatter ── */
const GRASS_COLORS = ['#3E7020', '#4E8030', '#5A8A38', '#3A6A18', '#4A7828', '#558A30'];
const GRASS_ELEMENTS = generateSurfaceElements(100, 2101, { x: 0, y: 700, width: 1920, height: 380 }, GRASS_COLORS);
const GRASS_MID = generateSurfaceElements(60, 2102, { x: 0, y: 600, width: 1920, height: 140 }, GRASS_COLORS);

export const GrassHill: React.FC<AssetProps> = ({ frame }) => {
  const hills = useMemo(() => ({
    veryFar: HILLS_VERY_FAR, far: HILLS_FAR, mid: HILLS_MID,
    nearMid: HILLS_NEAR_MID, near: HILLS_NEAR,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Atmospheric horizon ── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 100} height={200} color="#8AA880" opacity={0.35} />

      {/* ── Very far hills — misty blue ── */}
      <HillSilhouette hills={hills.veryFar} frame={frame} idPrefix={`${ID}-hvf`} />

      {/* ── Bird silhouettes — V shapes high up ── */}
      {BIRDS.map((b, i) => {
        const driftX = longCycleNoise(frame * 0.05, b.seed) * 60;
        const driftY = longCycleNoise(frame * 0.03, b.seed + 20) * 15;
        return (
          <g key={`bird-${i}`} transform={`translate(${b.cx + driftX}, ${b.cy + driftY})`} opacity={0.3}>
            <path d={`M${-b.size},${b.size * 0.3} Q${-b.size * 0.5},${-b.size * 0.2} 0,0 Q${b.size * 0.5},${-b.size * 0.2} ${b.size},${b.size * 0.3}`}
              fill="none" stroke="#3A3A40" strokeWidth={1.2} strokeLinecap="round" />
          </g>
        );
      })}

      {/* ── Far hills ── */}
      <HillSilhouette hills={hills.far} frame={frame} idPrefix={`${ID}-hf`} />

      {/* ── Field patches — colored patchwork on mid-hills ── */}
      {FIELD_PATCHES.map((f, i) => (
        <rect key={`field-${i}`} x={f.x} y={f.y} width={f.w} height={f.h}
          fill={f.color} opacity={f.opacity} rx={4}
          transform={`rotate(${f.angle}, ${f.x + f.w / 2}, ${f.y + f.h / 2})`} />
      ))}

      {/* ── Hedgerow lines ── */}
      {HEDGEROWS.map((h, i) => {
        const x2 = h.x1 + Math.cos(h.angle * Math.PI / 180) * h.length;
        const y2 = h.y1 + Math.sin(h.angle * Math.PI / 180) * h.length;
        return (
          <line key={`hedge-${i}`} x1={h.x1} y1={h.y1} x2={x2} y2={y2}
            stroke="#2A4A18" strokeWidth={h.thickness} strokeLinecap="round" opacity={0.35} />
        );
      })}

      {/* ── Sheep silhouettes ── */}
      {SHEEP.map((s, i) => {
        const bob = longCycleNoise(frame * 0.15, s.seed) * 1.5;
        const drift = longCycleNoise(frame * 0.05, s.seed + 40) * 8;
        return (
          <g key={`sheep-${i}`} transform={`translate(${s.cx + drift}, ${s.cy + bob})`} opacity={0.5}>
            {/* body — fluffy white oval */}
            <ellipse cx={0} cy={0} rx={s.size * 1.4} ry={s.size} fill="#E8E4D8" />
            {/* head */}
            <ellipse cx={s.size * 1.2} cy={-s.size * 0.3} rx={s.size * 0.45} ry={s.size * 0.4} fill="#4A4A40" />
            {/* legs */}
            <line x1={-s.size * 0.5} y1={s.size} x2={-s.size * 0.5} y2={s.size * 1.8} stroke="#4A4A40" strokeWidth={1} />
            <line x1={s.size * 0.5} y1={s.size} x2={s.size * 0.5} y2={s.size * 1.8} stroke="#4A4A40" strokeWidth={1} />
          </g>
        );
      })}

      {/* ── Mid hills ── */}
      <HillSilhouette hills={hills.mid} frame={frame} idPrefix={`${ID}-hm`} />

      {/* ── Cloud shadows moving across hills ── */}
      {CLOUD_SHADOWS.map((cs, i) => {
        const driftX = longCycleNoise(frame * 0.04, cs.seed) * 200;
        return (
          <ellipse key={`shadow-${i}`} cx={cs.baseX + driftX} cy={cs.y}
            rx={cs.rx} ry={cs.ry} fill="#1A3018" opacity={0.08} />
        );
      })}

      {/* ── Rocky outcrops ── */}
      {ROCK_OUTCROPS.map((r, i) => (
        <g key={`rock-${i}`} opacity={0.45}>
          <ellipse cx={r.cx} cy={r.cy} rx={r.w / 2} ry={r.h / 2} fill={r.color} />
          {/* highlight */}
          <ellipse cx={r.cx - r.w * 0.1} cy={r.cy - r.h * 0.15}
            rx={r.w * 0.25} ry={r.h * 0.2} fill="#B8B8A8" opacity={0.2} />
          {/* shadow underneath */}
          <ellipse cx={r.cx} cy={r.cy + r.h * 0.4}
            rx={r.w * 0.6} ry={r.h * 0.15} fill="#2A3020" opacity={0.15} />
        </g>
      ))}

      {/* ── Winding dirt path ── */}
      <path d={PATH_D} fill="#A89878" opacity={0.28} />
      <path d={PATH_HIGHLIGHT} fill="#B8A888" opacity={0.12} />
      {/* path edge worn-in detail */}
      <path d="M875,565 Q910,620 895,685" fill="none" stroke="#8A7858" strokeWidth={1.5} opacity={0.15} />
      <path d="M945,825 Q975,890 955,960" fill="none" stroke="#8A7858" strokeWidth={1.5} opacity={0.12} />

      {/* ── Near-mid hill ── */}
      <HillSilhouette hills={hills.nearMid} frame={frame} idPrefix={`${ID}-hnm`} />

      {/* ── Bushes/shrubs ── */}
      {BUSHES.map((b, i) => (
        <g key={`bush-${i}`} opacity={0.5}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.rx * 1.3} ry={b.ry} fill={b.shade} />
          <ellipse cx={b.cx - 2} cy={b.cy - 3} rx={b.rx} ry={b.ry * 0.8} fill="#366028" opacity={0.7} />
          <ellipse cx={b.cx + 3} cy={b.cy - 5} rx={b.rx * 0.7} ry={b.ry * 0.6} fill="#3E7020" opacity={0.5} />
          {/* highlight */}
          <ellipse cx={b.cx - 1} cy={b.cy - 4} rx={b.rx * 0.3} ry={b.ry * 0.25}
            fill="#6A9A48" opacity={0.25} />
        </g>
      ))}

      {/* ── Near hill ── */}
      <HillSilhouette hills={hills.near} frame={frame} idPrefix={`${ID}-hn`} />

      {/* ── Base ground plane ── */}
      <GroundPlane id={ID} horizonY={660} stops={GROUND_STOPS} />

      {/* ── Hill shadow gradients for depth ── */}
      <defs>
        <linearGradient id={`${ID}-hshadow`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A3010" stopOpacity={0.14} />
          <stop offset="35%" stopColor="#1A3010" stopOpacity={0} />
          <stop offset="65%" stopColor="#1A3010" stopOpacity={0} />
          <stop offset="100%" stopColor="#1A3010" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect x={0} y={640} width={1920} height={440} fill={`url(#${ID}-hshadow)`} />

      {/* ── Fence line going up a hill ── */}
      <g opacity={0.4}>
        {FENCE_HILL.map((p, i) => (
          <rect key={i} x={p.x - 1.5} y={p.y - 16} width={3} height={18}
            fill="#6A5838" rx={0.8} />
        ))}
        {/* wire */}
        <path
          d={`M${FENCE_HILL[0].x},${FENCE_HILL[0].y - 12} ${FENCE_HILL.map(
            (p) => `L${p.x},${p.y - 11}`
          ).join(' ')}`}
          fill="none" stroke="#5A4830" strokeWidth={0.7} />
        <path
          d={`M${FENCE_HILL[0].x},${FENCE_HILL[0].y - 5} ${FENCE_HILL.map(
            (p) => `L${p.x},${p.y - 4}`
          ).join(' ')}`}
          fill="none" stroke="#5A4830" strokeWidth={0.7} />
      </g>

      {/* ── Mid-distance grass ── */}
      <g opacity={0.5}>
        <SurfaceScatter elements={GRASS_MID} frame={frame} renderElement={renderGrassBlade} />
      </g>

      {/* ── Foreground grass ── */}
      <SurfaceScatter elements={GRASS_ELEMENTS} frame={frame} renderElement={renderGrassBlade} />

      {/* ── Wildflowers on near hill ── */}
      {NEAR_FLOWERS.map((f, i) => {
        const bob = longCycleNoise(frame * 0.4, f.seed) * 2;
        return (
          <circle key={`fl-${i}`} cx={f.cx} cy={f.cy + bob} r={f.size}
            fill={f.color} opacity={0.6} />
        );
      })}

      {/* ── Valley mist collecting between hills ── */}
      <GroundMist id={`${ID}-vm`} y={580} color="#90B890" opacity={0.15} frame={frame} count={6} seed={4101} />
      <GroundMist id={`${ID}-gm`} y={920} color="#80A880" opacity={0.1} frame={frame} count={4} seed={4102} />

      {/* ── Texture overlay ── */}
      <TerrainTexture id={ID} y={HORIZON} height={600} color="#1A3810" opacity={0.02} seed={3101} dotCount={50} />

      {/* ── Warm atmospheric grade ── */}
      <rect x={0} y={HORIZON} width={1920} height={600} fill="#D8C888" opacity={0.025} />

      {/* ── Bottom vignette ── */}
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

export default GrassHill;
