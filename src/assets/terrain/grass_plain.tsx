/**
 * grass_plain — Lush rolling grassland with wildflowers, butterflies, and pastoral detail.
 *
 * Multiple depth layers of rolling green hills, hundreds of grass blades swaying
 * in wind, wildflower clusters (daisies, poppies, bluebells, dandelions),
 * butterflies with flapping wings, floating dandelion seeds, clover patches,
 * distant tree silhouettes, fence posts, low stone walls, dirt patches,
 * sunlight/shadow strips, buzzing insects, and bottom vignette.
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

const ID = 'grass-plain';
const HORIZON = 580;

/* ── Ground gradient ── */
const GROUND_STOPS = [
  { offset: '0%', color: '#5A8A3A' },
  { offset: '15%', color: '#4F7E34' },
  { offset: '35%', color: '#457230' },
  { offset: '55%', color: '#3C6428' },
  { offset: '75%', color: '#345820' },
  { offset: '100%', color: '#2A4818' },
];

/* ── Hill layers ── */
const HILLS_FAR = [
  { path: generateHillPath(555, 30, 7, 1001), fill: '#7A9A88', opacity: 0.45, drift: 0.15 },
  { path: generateHillPath(565, 25, 9, 1002), fill: '#6A8A74', opacity: 0.5, drift: 0.2 },
];
const HILLS_MID = [
  { path: generateHillPath(585, 22, 6, 1003), fill: '#5A8050', opacity: 0.65, drift: 0.35 },
  { path: generateHillPath(595, 18, 8, 1004), fill: '#4A7040', opacity: 0.7, drift: 0.4 },
];
const HILLS_NEAR = [
  { path: generateHillPath(610, 14, 5, 1005), fill: '#3E6830', opacity: 0.8, drift: 0.55 },
];

/* ── Distant tree silhouettes on horizon ── */
const treeRng = seededRandom(5501);
const TREES = Array.from({ length: 14 }, () => ({
  cx: treeRng() * 1920,
  cy: 548 + treeRng() * 20,
  w: 8 + treeRng() * 14,
  h: 12 + treeRng() * 20,
  opacity: 0.2 + treeRng() * 0.15,
}));

/* ── Fence posts ── */
const FENCE_POSTS = [
  { x: 280, y: 690 }, { x: 340, y: 688 }, { x: 400, y: 686 },
  { x: 460, y: 685 }, { x: 520, y: 684 },
];

/* ── Low stone wall ── */
const stoneRng = seededRandom(6601);
const STONES_WALL = Array.from({ length: 22 }, (_, i) => ({
  cx: 1100 + i * 28 + (stoneRng() - 0.5) * 8,
  cy: 720 + (stoneRng() - 0.5) * 6,
  rx: 10 + stoneRng() * 8,
  ry: 6 + stoneRng() * 4,
  color: ['#8A8070', '#7A7060', '#9A9080', '#6A6558'][Math.floor(stoneRng() * 4)],
}));

/* ── Grass blade scatter ── */
const GRASS_COLORS = ['#4A7A2A', '#5A8A38', '#3A6A1E', '#6A9A42', '#4E7E30', '#3E7020', '#558838'];
const GRASS_FORE = generateSurfaceElements(120, 2001, { x: 0, y: 750, width: 1920, height: 330 }, GRASS_COLORS);
const GRASS_MID = generateSurfaceElements(80, 2002, { x: 0, y: 640, width: 1920, height: 150 }, GRASS_COLORS);
const GRASS_TALL = generateSurfaceElements(40, 2005, { x: 0, y: 980, width: 1920, height: 100 }, GRASS_COLORS);

/* ── Wildflower clusters ── */
const flowerRng = seededRandom(2003);
const DAISIES = Array.from({ length: 12 }, () => ({
  cx: flowerRng() * 1920, cy: 700 + flowerRng() * 300,
  size: 2 + flowerRng() * 2, seed: flowerRng() * 1000,
}));
const POPPIES = Array.from({ length: 8 }, () => ({
  cx: flowerRng() * 1920, cy: 720 + flowerRng() * 280,
  size: 2.5 + flowerRng() * 2, seed: flowerRng() * 1000,
}));
const BLUEBELLS = Array.from({ length: 10 }, () => ({
  cx: flowerRng() * 1920, cy: 710 + flowerRng() * 290,
  size: 1.5 + flowerRng() * 1.5, seed: flowerRng() * 1000,
}));
const DANDELIONS = Array.from({ length: 7 }, () => ({
  cx: flowerRng() * 1920, cy: 730 + flowerRng() * 260,
  size: 2 + flowerRng() * 2, seed: flowerRng() * 1000,
}));

/* ── Floating dandelion seeds ── */
const seedRng = seededRandom(7701);
const DANDELION_SEEDS = Array.from({ length: 12 }, () => ({
  startX: seedRng() * 1920,
  startY: 500 + seedRng() * 300,
  seed: seedRng() * 1000,
  speed: 0.15 + seedRng() * 0.25,
}));

/* ── Butterflies ── */
const bflyRng = seededRandom(8801);
const BUTTERFLIES = Array.from({ length: 5 }, () => ({
  cx: 200 + bflyRng() * 1520,
  cy: 550 + bflyRng() * 300,
  color: ['#E8A030', '#D85858', '#7888D0', '#E0D050', '#D070A0'][Math.floor(bflyRng() * 5)],
  seed: bflyRng() * 1000,
  radius: 60 + bflyRng() * 100,
}));

/* ── Clover patches ── */
const cloverRng = seededRandom(9901);
const CLOVER_PATCHES = Array.from({ length: 6 }, () => ({
  cx: cloverRng() * 1920,
  cy: 720 + cloverRng() * 280,
  rx: 30 + cloverRng() * 50,
  ry: 12 + cloverRng() * 18,
}));

/* ── Dirt patches ── */
const dirtRng = seededRandom(10001);
const DIRT_PATCHES = Array.from({ length: 5 }, () => ({
  cx: dirtRng() * 1920,
  cy: 750 + dirtRng() * 250,
  rx: 20 + dirtRng() * 40,
  ry: 8 + dirtRng() * 12,
}));

/* ── Insect dots ── */
const bugRng = seededRandom(11001);
const INSECTS = Array.from({ length: 15 }, () => ({
  cx: bugRng() * 1920,
  cy: 650 + bugRng() * 350,
  seed: bugRng() * 1000,
}));

export const GrassPlain: React.FC<AssetProps> = ({ frame }) => {
  const hills = useMemo(() => ({ far: HILLS_FAR, mid: HILLS_MID, near: HILLS_NEAR }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Horizon blend ── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 70} height={140} color="#7A9A68" opacity={0.4} />

      {/* ── Distant tree silhouettes on horizon ── */}
      <g opacity={0.35}>
        {TREES.map((t, i) => (
          <g key={i}>
            <rect x={t.cx - 1.5} y={t.cy} width={3} height={t.h * 0.4} fill="#4A5A40" opacity={t.opacity} />
            <ellipse cx={t.cx} cy={t.cy - t.h * 0.15} rx={t.w / 2} ry={t.h * 0.5} fill="#3A5030" opacity={t.opacity} />
            <ellipse cx={t.cx + 1} cy={t.cy - t.h * 0.25} rx={t.w * 0.35} ry={t.h * 0.35} fill="#4A6038" opacity={t.opacity * 0.7} />
          </g>
        ))}
      </g>

      {/* ── Far hills ── */}
      <HillSilhouette hills={hills.far} frame={frame} idPrefix={`${ID}-hf`} />

      {/* ── Mid hills ── */}
      <HillSilhouette hills={hills.mid} frame={frame} idPrefix={`${ID}-hm`} />

      {/* ── Near hills ── */}
      <HillSilhouette hills={hills.near} frame={frame} idPrefix={`${ID}-hn`} />

      {/* ── Base ground plane ── */}
      <GroundPlane id={ID} horizonY={HORIZON + 15} stops={GROUND_STOPS} />

      {/* ── Clover patches — darker rounded grass clusters ── */}
      {CLOVER_PATCHES.map((c, i) => (
        <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
          fill="#2A5A18" opacity={0.18} />
      ))}

      {/* ── Dirt patches showing through grass ── */}
      {DIRT_PATCHES.map((d, i) => (
        <ellipse key={i} cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry}
          fill="#8A7858" opacity={0.15} />
      ))}

      {/* ── Low stone wall in mid-distance ── */}
      <g opacity={0.45}>
        {STONES_WALL.map((s, i) => (
          <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
            fill={s.color} stroke="#6A6050" strokeWidth={0.5} />
        ))}
        {/* mortar line along wall top */}
        <line x1={1095} y1={717} x2={1710} y2={717} stroke="#9A9080" strokeWidth={0.8} opacity={0.3} />
      </g>

      {/* ── Fence posts with wire ── */}
      <g opacity={0.4}>
        {FENCE_POSTS.map((p, i) => (
          <rect key={i} x={p.x - 2} y={p.y - 22} width={4} height={24}
            fill="#7A6848" rx={1} />
        ))}
        {/* wire connecting posts */}
        <path
          d={`M${FENCE_POSTS[0].x},${FENCE_POSTS[0].y - 18} ${FENCE_POSTS.map(
            (p) => `L${p.x},${p.y - 17}`
          ).join(' ')}`}
          fill="none" stroke="#5A5040" strokeWidth={0.8} />
        <path
          d={`M${FENCE_POSTS[0].x},${FENCE_POSTS[0].y - 10} ${FENCE_POSTS.map(
            (p) => `L${p.x},${p.y - 9}`
          ).join(' ')}`}
          fill="none" stroke="#5A5040" strokeWidth={0.8} />
      </g>

      {/* ── Sunlight patches ── */}
      <defs>
        <radialGradient id={`${ID}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#B8D870" stopOpacity={0.16} />
          <stop offset="100%" stopColor="#B8D870" stopOpacity={0} />
        </radialGradient>
      </defs>
      {[{ cx: 450, cy: 730 }, { cx: 1100, cy: 790 }, { cx: 800, cy: 870 }, { cx: 1600, cy: 820 }].map((s, i) => {
        const drift = longCycleNoise(frame * 0.08, i * 17 + 50) * 40;
        return (
          <ellipse key={i} cx={s.cx + drift} cy={s.cy} rx={260} ry={75}
            fill={`url(#${ID}-sun)`} />
        );
      })}

      {/* ── Shadow strips ── */}
      <g opacity={0.07}>
        <rect x={180} y={760} width={420} height={9} rx={4.5} fill="#1A3010"
          transform="rotate(-1.5, 390, 764)" />
        <rect x={900} y={830} width={520} height={11} rx={5.5} fill="#1A3010"
          transform="rotate(0.8, 1160, 835)" />
        <rect x={1400} y={780} width={350} height={8} rx={4} fill="#1A3010"
          transform="rotate(-0.5, 1575, 784)" />
      </g>

      {/* ── Mid-distance grass ── */}
      <g opacity={0.55}>
        <SurfaceScatter elements={GRASS_MID} frame={frame} renderElement={renderGrassBlade} />
      </g>

      {/* ── Foreground grass blades ── */}
      <SurfaceScatter elements={GRASS_FORE} frame={frame} renderElement={renderGrassBlade} />

      {/* ── Wildflowers: Daisies (white petals, yellow center) ── */}
      {DAISIES.map((d, i) => {
        const bob = longCycleNoise(frame * 0.5, d.seed) * 2;
        const sway = longCycleNoise(frame * 0.3, d.seed + 50) * 3;
        return (
          <g key={`daisy-${i}`} transform={`translate(${d.cx + sway}, ${d.cy + bob})`}>
            {/* stem */}
            <line x1={0} y1={2} x2={-1} y2={d.size * 4} stroke="#4A7828" strokeWidth={1} opacity={0.5} />
            {/* petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse key={angle} cx={Math.cos(angle * Math.PI / 180) * d.size * 0.8}
                cy={Math.sin(angle * Math.PI / 180) * d.size * 0.8}
                rx={d.size * 0.5} ry={d.size * 0.2}
                fill="#F0E8D8" opacity={0.85}
                transform={`rotate(${angle}, ${Math.cos(angle * Math.PI / 180) * d.size * 0.8}, ${Math.sin(angle * Math.PI / 180) * d.size * 0.8})`} />
            ))}
            {/* center */}
            <circle cx={0} cy={0} r={d.size * 0.35} fill="#D8B040" opacity={0.9} />
          </g>
        );
      })}

      {/* ── Wildflowers: Poppies (red) ── */}
      {POPPIES.map((p, i) => {
        const bob = longCycleNoise(frame * 0.45, p.seed) * 2.5;
        return (
          <g key={`poppy-${i}`} transform={`translate(${p.cx}, ${p.cy + bob})`}>
            <line x1={0} y1={2} x2={0} y2={p.size * 3.5} stroke="#3A6020" strokeWidth={1} opacity={0.5} />
            <circle cx={0} cy={0} r={p.size} fill="#C83030" opacity={0.8} />
            <circle cx={0} cy={0} r={p.size * 0.35} fill="#2A1810" opacity={0.7} />
          </g>
        );
      })}

      {/* ── Wildflowers: Bluebells ── */}
      {BLUEBELLS.map((b, i) => {
        const bob = longCycleNoise(frame * 0.4, b.seed) * 2;
        return (
          <g key={`bell-${i}`} transform={`translate(${b.cx}, ${b.cy + bob})`}>
            <line x1={0} y1={0} x2={1} y2={b.size * 4} stroke="#3A6020" strokeWidth={0.8} opacity={0.45} />
            <ellipse cx={0} cy={-1} rx={b.size * 0.45} ry={b.size * 0.7} fill="#5870B8" opacity={0.75} />
            <ellipse cx={0} cy={-b.size * 0.5} rx={b.size * 0.3} ry={b.size * 0.2} fill="#7890D0" opacity={0.4} />
          </g>
        );
      })}

      {/* ── Wildflowers: Dandelions (yellow puffballs) ── */}
      {DANDELIONS.map((d, i) => {
        const bob = longCycleNoise(frame * 0.35, d.seed) * 2;
        return (
          <g key={`dand-${i}`} transform={`translate(${d.cx}, ${d.cy + bob})`}>
            <line x1={0} y1={2} x2={0} y2={d.size * 4} stroke="#5A7830" strokeWidth={0.8} opacity={0.45} />
            <circle cx={0} cy={0} r={d.size * 0.7} fill="#E8D848" opacity={0.75} />
            {/* fuzzy edge */}
            <circle cx={0} cy={0} r={d.size * 0.9} fill="#E8D848" opacity={0.15} />
          </g>
        );
      })}

      {/* ── Floating dandelion seeds ── */}
      {DANDELION_SEEDS.map((s, i) => {
        const driftX = longCycleNoise(frame * s.speed, s.seed) * 120;
        const driftY = longCycleNoise(frame * s.speed * 0.7, s.seed + 33) * 40;
        const x = s.startX + driftX;
        const y = s.startY + driftY;
        const spin = longCycleNoise(frame * 0.2, s.seed + 77) * 20;
        return (
          <g key={`seed-${i}`} opacity={0.35} transform={`translate(${x}, ${y}) rotate(${spin})`}>
            {/* tiny seed body */}
            <ellipse cx={0} cy={0} rx={0.8} ry={1.5} fill="#A89870" />
            {/* wispy filaments */}
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <line key={a} x1={0} y1={0}
                x2={Math.cos(a * Math.PI / 180) * 4}
                y2={Math.sin(a * Math.PI / 180) * 4 - 2}
                stroke="#D8D0C0" strokeWidth={0.3} />
            ))}
          </g>
        );
      })}

      {/* ── Butterflies (5) with flapping wings ── */}
      {BUTTERFLIES.map((bf, i) => {
        const t = frame * 0.02;
        const angle = longCycleNoise(t, bf.seed) * Math.PI * 2;
        const bx = bf.cx + Math.cos(angle) * bf.radius;
        const by = bf.cy + Math.sin(angle * 0.6) * bf.radius * 0.4;
        const flap = Math.sin(frame * 0.35 + bf.seed) * 25;
        return (
          <g key={`bf-${i}`} transform={`translate(${bx}, ${by})`} opacity={0.7}>
            {/* body */}
            <ellipse cx={0} cy={0} rx={1} ry={3} fill="#3A2A20" />
            {/* left wing */}
            <ellipse cx={-4} cy={-1} rx={5} ry={3} fill={bf.color} opacity={0.8}
              transform={`skewY(${flap})`} />
            {/* right wing */}
            <ellipse cx={4} cy={-1} rx={5} ry={3} fill={bf.color} opacity={0.8}
              transform={`skewY(${-flap})`} />
            {/* wing spots */}
            <circle cx={-4} cy={-1} r={1.5} fill="#FFFFFF" opacity={0.3}
              transform={`skewY(${flap})`} />
            <circle cx={4} cy={-1} r={1.5} fill="#FFFFFF" opacity={0.3}
              transform={`skewY(${-flap})`} />
          </g>
        );
      })}

      {/* ── Insect dots buzzing near ground ── */}
      {INSECTS.map((bug, i) => {
        const bx = bug.cx + longCycleNoise(frame * 0.8, bug.seed) * 15;
        const by = bug.cy + longCycleNoise(frame * 0.6, bug.seed + 20) * 10;
        return <circle key={`bug-${i}`} cx={bx} cy={by} r={0.8} fill="#2A2A18" opacity={0.25} />;
      })}

      {/* ── Tall foreground grass framing bottom ── */}
      {GRASS_TALL.map((el, i) => {
        const sway = longCycleNoise(frame * 0.5, el.seed) * 12;
        const h = 20 + el.size * 25;
        return (
          <g key={`tall-${i}`} opacity={el.opacity * 0.8}>
            <line x1={el.cx} y1={el.cy} x2={el.cx + sway} y2={el.cy - h}
              stroke={el.color} strokeWidth={2 + el.size} strokeLinecap="round" />
            {/* secondary blade */}
            <line x1={el.cx + 3} y1={el.cy} x2={el.cx + sway + 4} y2={el.cy - h * 0.7}
              stroke={el.color} strokeWidth={1.2 + el.size * 0.5} strokeLinecap="round" opacity={0.6} />
          </g>
        );
      })}

      {/* ── Painterly texture ── */}
      <TerrainTexture id={ID} y={HORIZON} height={500} color="#2A4A18" opacity={0.025} seed={3001} dotCount={60} />

      {/* ── Ground mist ── */}
      <GroundMist id={ID} y={960} color="#A8C8A0" opacity={0.1} frame={frame} count={5} seed={4001} />

      {/* ── Warm color grade ── */}
      <rect x={0} y={HORIZON} width={1920} height={500} fill="#E8D898" opacity={0.03} />

      {/* ── Bottom vignette ── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="80%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default GrassPlain;
