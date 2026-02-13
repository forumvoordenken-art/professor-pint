/**
 * snow_field — Besneeuwd landschap, wit en koud.
 *
 * Winterverhalen, Russische geschiedenis, poolexpedities, ijs.
 * Bright white snow with blue shadows, snowdrift ripples,
 * animal tracks, bare trees, frost sparkles, frozen creek,
 * icicles, and wind-blown particles. Oil painting style.
 */

import React from 'react';
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

const ID = 'snow-field';
const HORIZON = 550;

const GROUND_STOPS = [
  { offset: '0%', color: '#E4ECF4' },
  { offset: '12%', color: '#D8E2F0' },
  { offset: '30%', color: '#D0D8E8' },
  { offset: '50%', color: '#C4CCE0' },
  { offset: '70%', color: '#B8C0D4' },
  { offset: '85%', color: '#AEB6C8' },
  { offset: '100%', color: '#A0A8BC' },
];

// Distant snow hills
const HILLS = [
  { path: generateHillPath(528, 28, 5, 1601), fill: '#C8D4E4', opacity: 0.5, drift: 0.1 },
  { path: generateHillPath(542, 22, 6, 1602), fill: '#BCC8D8', opacity: 0.55, drift: 0.15 },
  { path: generateHillPath(556, 16, 7, 1603), fill: '#B0BCD0', opacity: 0.45, drift: 0.12 },
];

const rng = seededRandom(2601);

// ─── Snowdrift ripple patterns (wind-formed ridges) ──────
const DRIFTS = Array.from({ length: 18 }, () => {
  const y = 580 + rng() * 420;
  const x = -50 + rng() * 1970;
  const width = 180 + rng() * 500;
  const curve = (rng() - 0.5) * 20;
  const thickness = 0.8 + rng() * 1.2;
  return { y, x, width, curve, thickness, opacity: 0.08 + rng() * 0.12 };
});

// ─── Blue shadow dips and valleys ────────────────────────
const SHADOW_DIPS = Array.from({ length: 8 }, () => ({
  cx: rng() * 1920,
  cy: 620 + rng() * 380,
  rx: 100 + rng() * 250,
  ry: 20 + rng() * 50,
  opacity: 0.05 + rng() * 0.06,
}));

// ─── Fox paw prints going into distance ──────────────────
const FOX_TRACKS: Array<{ x: number; y: number }> = [];
let foxX = 300 + rng() * 400;
let foxY = 950;
for (let i = 0; i < 22; i++) {
  foxX += 30 + rng() * 25;
  foxY -= 12 + rng() * 10;
  FOX_TRACKS.push({ x: foxX, y: foxY });
}

// ─── Rabbit hop tracks (pairs of dots) ──────────────────
const RABBIT_TRACKS: Array<{ x: number; y: number }> = [];
let rabX = 1200 + rng() * 300;
let rabY = 920;
for (let i = 0; i < 16; i++) {
  rabX += 20 + rng() * 15;
  rabY -= 10 + rng() * 8;
  RABBIT_TRACKS.push({ x: rabX, y: rabY });
  RABBIT_TRACKS.push({ x: rabX + 5, y: rabY + 3 });
}

// ─── Bird tracks (tiny Y-shapes near bushes) ────────────
const BIRD_TRACKS = Array.from({ length: 12 }, () => ({
  x: 600 + rng() * 400,
  y: 760 + rng() * 80,
  angle: rng() * 360,
  size: 2 + rng() * 2,
}));

// ─── Bare winter trees (skeletal branches) ───────────────
const BARE_TREES = [
  { x: 380, y: 640, height: 140, branches: 7, seed: 5501 },
  { x: 1480, y: 660, height: 120, branches: 6, seed: 5502 },
  { x: 920, y: 680, height: 100, branches: 5, seed: 5503 },
];

// Generate branch paths for each tree
function generateTreeBranches(
  tx: number, ty: number, height: number, branchCount: number, seed: number,
): string[] {
  const treeRng = seededRandom(seed);
  const paths: string[] = [];
  const trunkTop = ty - height;
  paths.push(`M${tx},${ty} L${tx + (treeRng() - 0.5) * 8},${trunkTop}`);
  for (let b = 0; b < branchCount; b++) {
    const branchY = trunkTop + (b / branchCount) * height * 0.75;
    const side = b % 2 === 0 ? 1 : -1;
    const length = 20 + treeRng() * 40;
    const rise = 10 + treeRng() * 25;
    const bx = tx + side * length;
    const by = branchY - rise;
    paths.push(`M${tx + (treeRng() - 0.5) * 3},${branchY} Q${tx + side * length * 0.4},${branchY - rise * 0.3} ${bx},${by}`);
    if (treeRng() > 0.4) {
      const subLen = 10 + treeRng() * 20;
      const subRise = 5 + treeRng() * 12;
      paths.push(`M${bx},${by} L${bx + side * subLen * 0.6},${by - subRise}`);
    }
    if (treeRng() > 0.5) {
      const subLen = 8 + treeRng() * 15;
      paths.push(`M${bx},${by} L${bx + (treeRng() - 0.5) * subLen},${by + 5 + treeRng() * 8}`);
    }
  }
  return paths;
}

// ─── Snow-covered bushes (rounded white mounds) ──────────
const SNOW_BUSHES = [
  { cx: 560, cy: 750, rx: 40, ry: 22, branches: 4 },
  { cx: 1100, cy: 780, rx: 35, ry: 18, branches: 3 },
  { cx: 1650, cy: 730, rx: 45, ry: 25, branches: 5 },
  { cx: 200, cy: 810, rx: 30, ry: 16, branches: 3 },
];

// ─── Frost sparkle crystals ──────────────────────────────
const SPARKLES = Array.from({ length: 35 }, () => ({
  cx: rng() * 1920,
  cy: 570 + rng() * 460,
  phase: rng() * 100,
  brightness: 0.3 + rng() * 0.7,
  size: 2 + rng() * 3,
}));

// ─── Frozen creek/stream path ────────────────────────────
const CREEK_POINTS: string[] = [];
let ckX = 100;
let ckY = 830;
CREEK_POINTS.push(`M${ckX},${ckY}`);
for (let i = 0; i < 10; i++) {
  ckX += 150 + rng() * 80;
  ckY += (rng() - 0.5) * 40;
  CREEK_POINTS.push(`Q${ckX - 60},${ckY + (rng() - 0.5) * 30} ${ckX},${ckY}`);
}
const CREEK_PATH = CREEK_POINTS.join(' ');

// ─── Exposed rock patches ───────────────────────────────
const ROCK_PATCHES = Array.from({ length: 5 }, () => ({
  cx: rng() * 1920,
  cy: 700 + rng() * 300,
  rx: 15 + rng() * 30,
  ry: 6 + rng() * 14,
  opacity: 0.12 + rng() * 0.12,
}));

// ─── Pine needle debris on snow ─────────────────────────
const PINE_NEEDLES = Array.from({ length: 30 }, () => ({
  cx: 300 + rng() * 800,
  cy: 680 + rng() * 250,
  angle: rng() * 180,
  length: 3 + rng() * 5,
}));

// ─── Icicles hanging from rock outcrop ──────────────────
const ICICLE_X = 1300;
const ICICLE_Y = 700;
const ICICLES = Array.from({ length: 7 }, (_, i) => ({
  x: ICICLE_X + i * 8 - 24,
  length: 10 + rng() * 25,
  width: 1.5 + rng() * 2,
}));

// ─── Snowman / snow cairn (distant) ─────────────────────
const SNOWMAN_X = 1050;
const SNOWMAN_Y = 690;

// ─── Ice crystals (geometric facets) ────────────────────
const ICE_CRYSTALS = Array.from({ length: 6 }, () => ({
  cx: rng() * 1920,
  cy: 620 + rng() * 350,
  size: 3 + rng() * 6,
  angle: rng() * 60,
  opacity: 0.06 + rng() * 0.08,
}));

export const SnowField: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Cold blue horizon haze ── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 80} height={160} color="#C0D0E8" opacity={0.55} />

      {/* ── Distant snow hills ── */}
      <HillSilhouette hills={HILLS} frame={frame} idPrefix={`${ID}-h`} />

      {/* ── Base snow ground ── */}
      <GroundPlane id={ID} horizonY={HORIZON + 10} stops={GROUND_STOPS} />

      {/* ── Blue shadow dips and valleys ── */}
      {SHADOW_DIPS.map((s, i) => (
        <ellipse
          key={i}
          cx={s.cx}
          cy={s.cy}
          rx={s.rx}
          ry={s.ry}
          fill="#7088B0"
          opacity={s.opacity}
        />
      ))}

      {/* ── Snow depth: deeper blue shadows in hollows ── */}
      <defs>
        <radialGradient id={`${ID}-hollow1`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#6078A8" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#6078A8" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${ID}-hollow2`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5068A0" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#5068A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={480} cy={880} rx={180} ry={70} fill={`url(#${ID}-hollow1)`} />
      <ellipse cx={1400} cy={920} rx={200} ry={80} fill={`url(#${ID}-hollow2)`} />
      <ellipse cx={900} cy={960} rx={160} ry={55} fill={`url(#${ID}-hollow1)`} />

      {/* ── Snowdrift ripple patterns ── */}
      {DRIFTS.map((d, i) => (
        <path
          key={i}
          d={`M${d.x},${d.y} Q${d.x + d.width * 0.3},${d.y + d.curve} ${d.x + d.width * 0.5},${d.y + d.curve * 0.3} T${d.x + d.width},${d.y}`}
          fill="none"
          stroke="#D8E4F8"
          strokeWidth={d.thickness}
          opacity={d.opacity}
        />
      ))}

      {/* ── Frozen creek/stream ── */}
      <g>
        {/* Ice base */}
        <path
          d={CREEK_PATH}
          fill="none"
          stroke="#8098B8"
          strokeWidth={18}
          opacity={0.12}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Ice surface */}
        <path
          d={CREEK_PATH}
          fill="none"
          stroke="#A0B8D4"
          strokeWidth={10}
          opacity={0.15}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Ice highlight */}
        <path
          d={CREEK_PATH}
          fill="none"
          stroke="#D0E0F0"
          strokeWidth={3}
          opacity={0.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crack line on ice */}
        <path
          d={CREEK_PATH}
          fill="none"
          stroke="#6080A8"
          strokeWidth={0.6}
          opacity={0.1}
          strokeLinecap="round"
          strokeDasharray="20,40,10,30"
        />
      </g>

      {/* ── Bare winter trees ── */}
      {BARE_TREES.map((tree, i) => {
        const branches = generateTreeBranches(tree.x, tree.y, tree.height, tree.branches, tree.seed);
        const sway = longCycleNoise(frame * 0.15, tree.seed) * 2;
        return (
          <g key={i} transform={`rotate(${sway}, ${tree.x}, ${tree.y})`}>
            {branches.map((b, j) => (
              <path
                key={j}
                d={b}
                fill="none"
                stroke="#3A3028"
                strokeWidth={j === 0 ? 3 : 1.2 + (1 - j / branches.length) * 1.5}
                strokeLinecap="round"
                opacity={0.6}
              />
            ))}
            {/* Snow on branches */}
            {branches.slice(1, 5).map((_, j) => {
              const branchY = tree.y - tree.height + (j / tree.branches) * tree.height * 0.75;
              const side = j % 2 === 0 ? 1 : -1;
              return (
                <ellipse
                  key={`snow-${j}`}
                  cx={tree.x + side * (15 + j * 6)}
                  cy={branchY - 3}
                  rx={8 + j * 2}
                  ry={3}
                  fill="#E8F0F8"
                  opacity={0.5}
                />
              );
            })}
          </g>
        );
      })}

      {/* ── Snow-covered bushes ── */}
      {SNOW_BUSHES.map((bush, i) => (
        <g key={i}>
          {/* Snow mound */}
          <ellipse
            cx={bush.cx}
            cy={bush.cy}
            rx={bush.rx}
            ry={bush.ry}
            fill="#DDE6F0"
            opacity={0.8}
          />
          {/* Snow highlight on top */}
          <ellipse
            cx={bush.cx - bush.rx * 0.15}
            cy={bush.cy - bush.ry * 0.4}
            rx={bush.rx * 0.6}
            ry={bush.ry * 0.3}
            fill="#F0F4FA"
            opacity={0.5}
          />
          {/* Blue shadow underneath */}
          <ellipse
            cx={bush.cx}
            cy={bush.cy + bush.ry * 0.6}
            rx={bush.rx * 0.8}
            ry={bush.ry * 0.3}
            fill="#7088B0"
            opacity={0.08}
          />
          {/* Dark branch tips poking through */}
          {Array.from({ length: bush.branches }, (_, j) => {
            const angle = -60 + j * (120 / bush.branches);
            const rad = (angle * Math.PI) / 180;
            const tipX = bush.cx + Math.sin(rad) * bush.rx * 0.7;
            const tipY = bush.cy - Math.cos(rad) * bush.ry * 0.8;
            return (
              <line
                key={j}
                x1={bush.cx + Math.sin(rad) * bush.rx * 0.3}
                y1={bush.cy - Math.cos(rad) * bush.ry * 0.3}
                x2={tipX}
                y2={tipY}
                stroke="#3A3028"
                strokeWidth={1}
                opacity={0.4}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      ))}

      {/* ── Rock outcrop with icicles ── */}
      <g>
        <ellipse cx={ICICLE_X} cy={ICICLE_Y} rx={35} ry={14} fill="#686058" opacity={0.3} />
        <ellipse cx={ICICLE_X - 5} cy={ICICLE_Y - 4} rx={28} ry={8} fill="#787068" opacity={0.2} />
        {ICICLES.map((ic, i) => (
          <g key={i}>
            <polygon
              points={`${ic.x - ic.width / 2},${ICICLE_Y + 8} ${ic.x + ic.width / 2},${ICICLE_Y + 8} ${ic.x},${ICICLE_Y + 8 + ic.length}`}
              fill="#C0D8F0"
              opacity={0.35}
            />
            <line
              x1={ic.x}
              y1={ICICLE_Y + 8}
              x2={ic.x}
              y2={ICICLE_Y + 8 + ic.length}
              stroke="#E0F0FF"
              strokeWidth={0.5}
              opacity={0.3}
            />
          </g>
        ))}
      </g>

      {/* ── Fox paw prints ── */}
      <g opacity={0.08}>
        {FOX_TRACKS.map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={t.y} r={2.2} fill="#5A6878" />
            <circle cx={t.x - 1.5} cy={t.y - 2} r={0.8} fill="#5A6878" />
            <circle cx={t.x + 1.5} cy={t.y - 2} r={0.8} fill="#5A6878" />
            <circle cx={t.x} cy={t.y - 3} r={0.7} fill="#5A6878" />
          </g>
        ))}
      </g>

      {/* ── Rabbit hop tracks (pairs) ── */}
      <g opacity={0.06}>
        {RABBIT_TRACKS.map((t, i) => (
          <ellipse key={i} cx={t.x} cy={t.y} rx={1.8} ry={1.2} fill="#5A6878" />
        ))}
      </g>

      {/* ── Bird tracks (Y-shapes) ── */}
      <g opacity={0.07}>
        {BIRD_TRACKS.map((t, i) => (
          <g key={i} transform={`translate(${t.x},${t.y}) rotate(${t.angle})`}>
            <line x1={0} y1={0} x2={0} y2={-t.size} stroke="#5A6878" strokeWidth={0.5} />
            <line x1={0} y1={-t.size} x2={-t.size * 0.6} y2={-t.size * 1.4} stroke="#5A6878" strokeWidth={0.5} />
            <line x1={0} y1={-t.size} x2={t.size * 0.6} y2={-t.size * 1.4} stroke="#5A6878" strokeWidth={0.5} />
          </g>
        ))}
      </g>

      {/* ── Exposed rock patches ── */}
      {ROCK_PATCHES.map((r, i) => (
        <ellipse
          key={i}
          cx={r.cx}
          cy={r.cy}
          rx={r.rx}
          ry={r.ry}
          fill="#686058"
          opacity={r.opacity}
        />
      ))}

      {/* ── Pine needle debris ── */}
      <g opacity={0.1}>
        {PINE_NEEDLES.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={n.cx - Math.cos(rad) * n.length}
              y1={n.cy - Math.sin(rad) * n.length}
              x2={n.cx + Math.cos(rad) * n.length}
              y2={n.cy + Math.sin(rad) * n.length}
              stroke="#3A4828"
              strokeWidth={0.6}
            />
          );
        })}
      </g>

      {/* ── Distant snowman / snow cairn ── */}
      <g opacity={0.2}>
        <circle cx={SNOWMAN_X} cy={SNOWMAN_Y} r={8} fill="#D8E4F0" />
        <circle cx={SNOWMAN_X} cy={SNOWMAN_Y - 12} r={6} fill="#DDE8F4" />
        <circle cx={SNOWMAN_X} cy={SNOWMAN_Y - 20} r={4} fill="#E0ECF6" />
        {/* Shadow */}
        <ellipse cx={SNOWMAN_X} cy={SNOWMAN_Y + 8} rx={10} ry={3} fill="#7088B0" opacity={0.3} />
      </g>

      {/* ── Ice crystals (geometric facets) ── */}
      {ICE_CRYSTALS.map((c, i) => {
        const twinkle = longCycleNoise(frame * 0.8, c.cx + i * 31);
        const op = c.opacity * (0.5 + Math.max(0, twinkle) * 0.5);
        return (
          <g key={i} transform={`translate(${c.cx},${c.cy}) rotate(${c.angle})`} opacity={op}>
            <polygon
              points={`0,${-c.size} ${c.size * 0.5},${-c.size * 0.3} ${c.size * 0.5},${c.size * 0.3} 0,${c.size} ${-c.size * 0.5},${c.size * 0.3} ${-c.size * 0.5},${-c.size * 0.3}`}
              fill="#D0E8FF"
              stroke="#A0C0E0"
              strokeWidth={0.3}
            />
          </g>
        );
      })}

      {/* ── Frost sparkle crystals (twinkling cross-shapes) ── */}
      {SPARKLES.map((s, i) => {
        const twinkle = longCycleNoise(frame * 1.2, s.phase + i * 7);
        const opacity = Math.max(0, twinkle) * s.brightness * 0.45;
        if (opacity < 0.04) return null;
        return (
          <g key={i}>
            <circle cx={s.cx} cy={s.cy} r={1} fill="white" opacity={opacity} />
            <line
              x1={s.cx - s.size}
              y1={s.cy}
              x2={s.cx + s.size}
              y2={s.cy}
              stroke="white"
              strokeWidth={0.4}
              opacity={opacity * 0.6}
            />
            <line
              x1={s.cx}
              y1={s.cy - s.size}
              x2={s.cx}
              y2={s.cy + s.size}
              stroke="white"
              strokeWidth={0.4}
              opacity={opacity * 0.6}
            />
            {/* Diagonal cross for extra sparkle */}
            <line
              x1={s.cx - s.size * 0.6}
              y1={s.cy - s.size * 0.6}
              x2={s.cx + s.size * 0.6}
              y2={s.cy + s.size * 0.6}
              stroke="white"
              strokeWidth={0.25}
              opacity={opacity * 0.3}
            />
            <line
              x1={s.cx + s.size * 0.6}
              y1={s.cy - s.size * 0.6}
              x2={s.cx - s.size * 0.6}
              y2={s.cy + s.size * 0.6}
              stroke="white"
              strokeWidth={0.25}
              opacity={opacity * 0.3}
            />
          </g>
        );
      })}

      {/* ── Wind-blown snow particles near ground ── */}
      <g opacity={0.08}>
        {Array.from({ length: 30 }, (_, i) => {
          const speed = 0.3 + (i % 5) * 0.15;
          const x = (i * 73 + frame * speed) % 2200 - 140;
          const baseY = HORIZON + 20 + (i % 7) * 8;
          const y = baseY + longCycleNoise(frame * 0.5, i * 19 + 300) * 20;
          const r = 0.6 + (i % 3) * 0.3;
          return <circle key={i} cx={x} cy={y} r={r} fill="white" />;
        })}
      </g>

      {/* ── Aurora / sky reflection on snow (very faint color) ── */}
      <defs>
        <linearGradient id={`${ID}-aurora`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#40A080" stopOpacity={0} />
          <stop offset="25%" stopColor="#40A080" stopOpacity={0.015} />
          <stop offset="50%" stopColor="#6080C0" stopOpacity={0.02} />
          <stop offset="75%" stopColor="#8060A0" stopOpacity={0.015} />
          <stop offset="100%" stopColor="#8060A0" stopOpacity={0} />
        </linearGradient>
      </defs>
      {(() => {
        const auroraShift = longCycleNoise(frame * 0.03, 999) * 100;
        return (
          <rect
            x={auroraShift}
            y={HORIZON + 10}
            width={1920}
            height={200}
            fill={`url(#${ID}-aurora)`}
          />
        );
      })()}

      {/* ── Painterly texture ── */}
      <TerrainTexture id={ID} y={HORIZON} height={530} color="#8090A8" opacity={0.02} seed={3701} />
      <TerrainTexture id={`${ID}-2`} y={HORIZON - 50} height={100} color="#B0C0D8" opacity={0.012} seed={3702} />

      {/* ── Icy ground mist ── */}
      <GroundMist id={ID} y={940} color="#C0D0E8" opacity={0.15} frame={frame} count={5} seed={4601} />
      <GroundMist id={`${ID}-low`} y={1000} color="#D0E0F0" opacity={0.1} frame={frame} count={3} seed={4602} />

      {/* ── Cool blue color grade ── */}
      <rect x={0} y={HORIZON} width={1920} height={530} fill="#6080B0" opacity={0.04} />

      {/* ── Bottom darken ── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="88%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default SnowField;
