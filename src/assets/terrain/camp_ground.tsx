/**
 * camp_ground — Kampeerterrein, menselijke nederzetting.
 *
 * Legerkampen, vroege nederzettingen, nomaden, veldtochten.
 * Cleared area with tamped earth, fire pit, logs for seating.
 * Worn paths and flattened grass areas.
 * Warm, lived-in feel with animated firelight and smoke.
 *
 * Oil painting style — muted, layered colors, never flat.
 * All animation via longCycleNoise — no Math.sin(frame).
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
  renderPebble,
  longCycleNoise,
  seededRandom,
  slowDrift,
} from './TerrainEngine';

const ID = 'camp-ground';
const HORIZON = 570;
const FIRE_CX = 960;
const FIRE_CY = 800;

// ─── Ground Gradient ─────────────────────────────────────

const GROUND_STOPS = [
  { offset: '0%', color: '#7A6A48' },        // trampled earth
  { offset: '15%', color: '#6E5E3C' },       // worn soil
  { offset: '30%', color: '#6A5A3A' },       // packed dirt
  { offset: '50%', color: '#5A4A30' },       // dark earth
  { offset: '75%', color: '#4A3E28' },       // shadow
  { offset: '100%', color: '#3A3220' },      // deep shadow
];

// ─── Hills ───────────────────────────────────────────────

const HILLS = [
  { path: generateHillPath(548, 22, 6, 1801), fill: '#5A7A48', opacity: 0.35, drift: 0.08 },
  { path: generateHillPath(558, 18, 7, 1802), fill: '#4A6A38', opacity: 0.4, drift: 0.12 },
  { path: generateHillPath(568, 14, 8, 1803), fill: '#3A5A28', opacity: 0.45, drift: 0.16 },
];

// ─── Edge Vegetation ─────────────────────────────────────

const GRASS_COLORS = ['#4A7828', '#5A8838', '#3A6818', '#4A6A20'];
const EDGE_GRASS = generateSurfaceElements(50, 2903, { x: 0, y: 620, width: 1920, height: 100 }, GRASS_COLORS);
const CORNER_GRASS_L = generateSurfaceElements(30, 2904, { x: 0, y: 700, width: 350, height: 350 }, GRASS_COLORS);
const CORNER_GRASS_R = generateSurfaceElements(30, 2905, { x: 1570, y: 700, width: 350, height: 350 }, GRASS_COLORS);
const MIDGRASS = generateSurfaceElements(20, 2906, { x: 200, y: 950, width: 1520, height: 130 }, GRASS_COLORS);

// ─── Pebbles & Debris ───────────────────────────────────

const PEBBLE_COLORS = ['#5A4A38', '#6A5A48', '#4A3A28', '#7A6A58'];
const GROUND_PEBBLES = generateSurfaceElements(35, 2910, { x: 300, y: 680, width: 1320, height: 350 }, PEBBLE_COLORS);

// ─── Static data generators ──────────────────────────────

const treeRng = seededRandom(9900);
const TREE_SILHOUETTES = Array.from({ length: 20 }, () => {
  const x = treeRng() * 2000 - 40;
  const trunkH = 60 + treeRng() * 80;
  const crownR = 25 + treeRng() * 40;
  const shade = Math.floor(0x18 + treeRng() * 0x14);
  const color = `#${shade.toString(16)}${(shade + 8).toString(16)}${Math.floor(shade * 0.6).toString(16)}`;
  return { x, trunkH, crownR, color };
});

const WORN_PATHS = [
  // Main path from bottom toward fire
  'M400,1080 Q440,950 480,880 Q530,820 600,780 Q720,740 880,730 Q920,725 960,720',
  // Path exiting right
  'M960,720 Q1050,730 1150,760 Q1280,800 1380,860 Q1450,920 1520,1080',
  // Path toward tents (upper left)
  'M960,720 Q900,700 820,680 Q720,660 620,660 Q500,665 380,690',
  // Short path toward supply area
  'M960,720 Q1020,710 1080,700 Q1160,690 1220,680',
];

const debrisRng = seededRandom(8800);
const GROUND_DEBRIS = Array.from({ length: 25 }, () => ({
  cx: 350 + debrisRng() * 1220,
  cy: 680 + debrisRng() * 340,
  rx: 1.2 + debrisRng() * 3.5,
  ry: 0.8 + debrisRng() * 2.5,
  fill: debrisRng() > 0.5 ? '#5A4A38' : '#6A5A48',
  angle: debrisRng() * 180,
}));

// Bones near fire
const boneRng = seededRandom(4420);
const BONES = Array.from({ length: 5 }, () => ({
  x: FIRE_CX - 80 + boneRng() * 160,
  y: FIRE_CY + 25 + boneRng() * 40,
  len: 10 + boneRng() * 18,
  angle: boneRng() * 360,
}));

// Boot prints in soft earth
const bootRng = seededRandom(5510);
const BOOT_PRINTS = Array.from({ length: 8 }, () => ({
  x: 600 + bootRng() * 720,
  y: 750 + bootRng() * 250,
  angle: -30 + bootRng() * 60,
  scale: 0.7 + bootRng() * 0.5,
}));

// ─── Component ───────────────────────────────────────────

export const CampGround: React.FC<AssetProps> = ({ frame }) => {
  // Memoize stone ring positions (never change)
  const stoneRing = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const rx = 40 + (i % 2) * 4;
      const ry = 16 + (i % 2) * 2;
      return {
        x: FIRE_CX + Math.cos(angle) * rx,
        y: FIRE_CY + Math.sin(angle) * ry,
        stoneRx: 7 + (i % 3) * 2,
        stoneRy: 4 + (i % 2) * 1.5,
        shade: i % 2 === 0 ? '#585048' : '#4A4438',
      };
    }), []);

  // Memoize firewood pile positions
  const firewoodPile = useMemo(() => {
    const fwRng = seededRandom(6620);
    return Array.from({ length: 12 }, () => ({
      x: 1140 + fwRng() * 80,
      y: 810 + fwRng() * 50,
      len: 25 + fwRng() * 40,
      angle: -15 + fwRng() * 30,
      width: 4 + fwRng() * 5,
      color: fwRng() > 0.5 ? '#5A4828' : '#4A3818',
    }));
  }, []);

  // Animated fire values
  const fireFlicker = longCycleNoise(frame * 0.5, 99);
  const fireGlow = 0.06 + Math.max(0, fireFlicker) * 0.04;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── SKY AREA DEFS ───────────────────────────────── */}
      <defs>
        {/* Firelight radial glow */}
        <radialGradient id={`${ID}-fire-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#D88030" stopOpacity={fireGlow} />
          <stop offset="40%" stopColor="#C86820" stopOpacity={fireGlow * 0.5} />
          <stop offset="100%" stopColor="#D88030" stopOpacity={0} />
        </radialGradient>
        {/* Bottom vignette */}
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="85%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
        {/* Warm atmosphere overlay */}
        <radialGradient id={`${ID}-warm`} cx="0.5" cy="0.74" r="0.45">
          <stop offset="0%" stopColor="#D88030" stopOpacity={0.04 + Math.max(0, fireFlicker) * 0.02} />
          <stop offset="100%" stopColor="#D88030" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* ── HORIZON ─────────────────────────────────────── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 60} height={120} color="#7A8A60" opacity={0.35} />

      {/* ── DISTANT HILLS ───────────────────────────────── */}
      <HillSilhouette hills={HILLS} frame={frame} idPrefix={`${ID}-h`} />

      {/* ── BACKGROUND TREE SILHOUETTES ─────────────────── */}
      <g opacity={0.35}>
        {TREE_SILHOUETTES.map((t, i) => {
          const sway = longCycleNoise(frame * 0.05, i * 17 + 200) * 3;
          return (
            <g key={i}>
              {/* Trunk */}
              <rect
                x={t.x - 3} y={HORIZON - t.trunkH + 20}
                width={6} height={t.trunkH}
                fill={t.color} opacity={0.6}
              />
              {/* Crown — layered ellipses for oil painting feel */}
              <ellipse
                cx={t.x + sway} cy={HORIZON - t.trunkH + 10}
                rx={t.crownR} ry={t.crownR * 0.8}
                fill={t.color}
              />
              <ellipse
                cx={t.x + sway - t.crownR * 0.2} cy={HORIZON - t.trunkH + 5}
                rx={t.crownR * 0.6} ry={t.crownR * 0.5}
                fill={t.color} opacity={0.5}
              />
            </g>
          );
        })}
      </g>

      {/* ── BASE GROUND ─────────────────────────────────── */}
      <GroundPlane id={ID} horizonY={HORIZON + 20} stops={GROUND_STOPS} />

      {/* ── WORN PATHS ──────────────────────────────────── */}
      {WORN_PATHS.map((d, i) => (
        <path key={i} d={d}
          fill="none" stroke="#8A7A58" strokeWidth={24 - i * 4}
          opacity={0.1 + i * 0.015} strokeLinecap="round" strokeLinejoin="round"
        />
      ))}

      {/* ── BOOT PRINTS IN SOFT EARTH ───────────────────── */}
      {BOOT_PRINTS.map((bp, i) => (
        <g key={i} transform={`translate(${bp.x}, ${bp.y}) rotate(${bp.angle}) scale(${bp.scale})`} opacity={0.08}>
          {/* Left boot */}
          <ellipse cx={-4} cy={0} rx={4} ry={8} fill="#3A3020" />
          <ellipse cx={-4} cy={-10} rx={3} ry={3} fill="#3A3020" />
          {/* Right boot */}
          <ellipse cx={8} cy={5} rx={4} ry={8} fill="#3A3020" />
          <ellipse cx={8} cy={-5} rx={3} ry={3} fill="#3A3020" />
        </g>
      ))}

      {/* ── SCATTERED DEBRIS ────────────────────────────── */}
      {GROUND_DEBRIS.map((d, i) => (
        <ellipse key={i}
          cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry}
          fill={d.fill} opacity={0.3}
          transform={`rotate(${d.angle}, ${d.cx}, ${d.cy})`}
        />
      ))}

      {/* ── GROUND PEBBLES ──────────────────────────────── */}
      <SurfaceScatter elements={GROUND_PEBBLES} frame={frame} renderElement={renderPebble} />

      {/* ── EDGE GRASS ──────────────────────────────────── */}
      <SurfaceScatter elements={EDGE_GRASS} frame={frame} renderElement={renderGrassBlade} />
      <SurfaceScatter elements={CORNER_GRASS_L} frame={frame} renderElement={renderGrassBlade} />
      <SurfaceScatter elements={CORNER_GRASS_R} frame={frame} renderElement={renderGrassBlade} />
      <SurfaceScatter elements={MIDGRASS} frame={frame} renderElement={renderGrassBlade} />

      {/* ── TENT SILHOUETTES (BACKGROUND) ───────────────── */}
      <g opacity={0.45}>
        {/* Tent 1 — large, left side */}
        <polygon points="350,700 430,640 510,700" fill="#4A3E28" />
        <polygon points="360,700 430,645 500,700" fill="#5A4E38" opacity={0.4} />
        <line x1={430} y1={640} x2={430} y2={700} stroke="#3A3020" strokeWidth={2} opacity={0.3} />
        {/* Tent flap */}
        <polygon points="410,700 430,665 450,700" fill="#3A3018" opacity={0.4} />

        {/* Tent 2 — medium, center-left */}
        <polygon points="560,710 620,660 680,710" fill="#3A3220" />
        <polygon points="568,710 620,664 672,710" fill="#4A4230" opacity={0.35} />
        <line x1={620} y1={660} x2={620} y2={710} stroke="#2A2818" strokeWidth={2} opacity={0.3} />

        {/* Tent 3 — small, far right background */}
        <polygon points="1500,695 1545,658 1590,695" fill="#4A4028" />
        <polygon points="1508,695 1545,662 1582,695" fill="#5A5038" opacity={0.3} />
        <line x1={1545} y1={658} x2={1545} y2={695} stroke="#3A3020" strokeWidth={1.5} opacity={0.25} />
      </g>

      {/* ── DRYING RACK WITH HIDES ──────────────────────── */}
      <g opacity={0.5}>
        {/* Two upright poles */}
        <rect x={740} y={690} width={4} height={60} rx={1} fill="#5A4828" />
        <rect x={830} y={690} width={4} height={60} rx={1} fill="#5A4828" />
        {/* Crossbar */}
        <rect x={738} y={688} width={98} height={3} rx={1} fill="#6A5838" />
        {/* Hanging hides — 3 pieces with subtle sway */}
        {[0, 1, 2].map((j) => {
          const hx = 755 + j * 30;
          const sway = longCycleNoise(frame * 0.15, j * 51 + 330) * 4;
          const hideColor = j === 0 ? '#7A6040' : j === 1 ? '#8A7050' : '#6A5030';
          return (
            <g key={j}>
              <path
                d={`M${hx},691 Q${hx + sway},710 ${hx + 2 + sway},730 Q${hx + 8 + sway * 0.5},738 ${hx + 18},730 Q${hx + 20 + sway * 0.3},710 ${hx + 20},691`}
                fill={hideColor} opacity={0.6}
              />
              {/* Hide texture line */}
              <line x1={hx + 5} y1={695} x2={hx + 10 + sway * 0.5} y2={725}
                stroke="#5A4020" strokeWidth={0.5} opacity={0.3} />
            </g>
          );
        })}
      </g>

      {/* ── WEAPON RACK (SPEARS & SHIELDS) ──────────────── */}
      <g opacity={0.5}>
        {/* Log base */}
        <rect x={1280} y={730} width={70} height={10} rx={5} fill="#5A4828" />
        <rect x={1282} y={731} width={66} height={4} rx={3} fill="#6A5838" opacity={0.4} />
        {/* Spears leaning */}
        {[0, 1, 2].map((j) => {
          const sx = 1290 + j * 22;
          return (
            <g key={j}>
              <line x1={sx} y1={730} x2={sx - 8 - j * 3} y2={640}
                stroke="#6A5838" strokeWidth={2.5} strokeLinecap="round" />
              {/* Spear tip */}
              <polygon
                points={`${sx - 8 - j * 3},640 ${sx - 12 - j * 3},628 ${sx - 4 - j * 3},628`}
                fill="#8A8A90" opacity={0.6}
              />
            </g>
          );
        })}
        {/* Shield leaning against log */}
        <ellipse cx={1338} cy={710} rx={14} ry={20}
          fill="#6A4020" opacity={0.5}
          transform={`rotate(10, 1338, 710)`}
        />
        <ellipse cx={1337} cy={709} rx={10} ry={16}
          fill="#7A5030" opacity={0.3}
          transform={`rotate(10, 1337, 709)`}
        />
      </g>

      {/* ── SUPPLY AREA ─────────────────────────────────── */}
      <g>
        {/* Barrel */}
        <g opacity={0.5}>
          <ellipse cx={1180} cy={740} rx={18} ry={8} fill="#5A4020" />
          <rect x={1162} y={718} width={36} height={22} rx={3} fill="#6A4828" />
          <ellipse cx={1180} cy={718} rx={18} ry={7} fill="#7A5838" />
          {/* Barrel bands */}
          <rect x={1163} y={724} width={34} height={2} rx={1} fill="#4A3818" opacity={0.4} />
          <rect x={1163} y={733} width={34} height={2} rx={1} fill="#4A3818" opacity={0.4} />
        </g>

        {/* Sack of provisions */}
        <g opacity={0.5}>
          <ellipse cx={1225} cy={745} rx={14} ry={10} fill="#8A7A58" />
          <ellipse cx={1225} cy={730} rx={12} ry={16} fill="#9A8A68" />
          {/* Rope tie */}
          <ellipse cx={1225} cy={720} rx={5} ry={3} fill="#6A5A38" opacity={0.6} />
        </g>

        {/* Bedrolls — two rolled bundles */}
        {[{ x: 1110, y: 755, angle: 5 }, { x: 1145, y: 760, angle: -8 }].map((br, i) => (
          <g key={i} opacity={0.45} transform={`rotate(${br.angle}, ${br.x}, ${br.y})`}>
            <rect x={br.x - 20} y={br.y - 5} width={40} height={10} rx={5} fill="#7A6A48" />
            <rect x={br.x - 18} y={br.y - 4} width={36} height={4} rx={3} fill="#8A7A58" opacity={0.5} />
            {/* Strap */}
            <rect x={br.x - 8} y={br.y - 6} width={16} height={12} rx={1}
              fill="none" stroke="#5A4A30" strokeWidth={1} opacity={0.4} />
          </g>
        ))}

        {/* Water bucket */}
        <g opacity={0.45}>
          <path d="M1255,750 L1260,730 L1282,730 L1287,750 Z" fill="#6A5838" />
          <ellipse cx={1271} cy={730} rx={11} ry={4} fill="#7A6848" />
          {/* Water glint */}
          <ellipse cx={1271} cy={732} rx={8} ry={2.5} fill="#4A6A8A" opacity={0.3} />
          {/* Handle */}
          <path d="M1263,728 Q1271,718 1279,728" fill="none" stroke="#5A4828" strokeWidth={1.5} />
        </g>
      </g>

      {/* ── FIREWOOD PILE ───────────────────────────────── */}
      <g opacity={0.55}>
        {firewoodPile.map((fw, i) => (
          <g key={i} transform={`rotate(${fw.angle}, ${fw.x}, ${fw.y})`}>
            <rect x={fw.x} y={fw.y} width={fw.len} height={fw.width} rx={2} fill={fw.color} />
            {/* Bark highlight */}
            <rect x={fw.x + 2} y={fw.y + 1} width={fw.len - 4} height={fw.width * 0.3}
              rx={1} fill="#7A6848" opacity={0.3} />
          </g>
        ))}
      </g>

      {/* ── LOG SEATS AROUND FIRE ───────────────────────── */}
      {[
        { x: 890, y: 835, angle: -5, w: 70 },
        { x: 1010, y: 830, angle: 8, w: 65 },
        { x: 935, y: 765, angle: 3, w: 55 },
        { x: 870, y: 790, angle: -12, w: 50 },
      ].map((log, i) => (
        <g key={i} opacity={0.5} transform={`rotate(${log.angle}, ${log.x + log.w / 2}, ${log.y})`}>
          <rect x={log.x} y={log.y} width={log.w} height={12} rx={6} fill="#5A4828" />
          <rect x={log.x + 2} y={log.y + 1} width={log.w - 4} height={5} rx={3} fill="#6A5838" opacity={0.5} />
          {/* Bark rings on ends */}
          <ellipse cx={log.x} cy={log.y + 6} rx={4} ry={6} fill="#4A3818" opacity={0.4} />
          <ellipse cx={log.x + log.w} cy={log.y + 6} rx={4} ry={6} fill="#4A3818" opacity={0.4} />
        </g>
      ))}

      {/* ── BONES / DISCARDED FOOD ──────────────────────── */}
      {BONES.map((b, i) => (
        <g key={i} opacity={0.25} transform={`rotate(${b.angle}, ${b.x}, ${b.y})`}>
          <line x1={b.x} y1={b.y} x2={b.x + b.len} y2={b.y}
            stroke="#C8B898" strokeWidth={2} strokeLinecap="round" />
          {/* Knob ends */}
          <circle cx={b.x} cy={b.y} r={2} fill="#C8B898" />
          <circle cx={b.x + b.len} cy={b.y} r={2.5} fill="#C8B898" />
        </g>
      ))}

      {/* ── FIRE PIT ────────────────────────────────────── */}
      <g>
        {/* Stone ring — larger, more varied */}
        {stoneRing.map((s, i) => (
          <g key={i}>
            <ellipse cx={s.x} cy={s.y} rx={s.stoneRx} ry={s.stoneRy}
              fill={s.shade} opacity={0.55} />
            {/* Stone highlight */}
            <ellipse cx={s.x - 1} cy={s.y - 1} rx={s.stoneRx * 0.5} ry={s.stoneRy * 0.4}
              fill="#8A8078" opacity={0.1} />
          </g>
        ))}

        {/* Ash pile — layered for depth */}
        <ellipse cx={FIRE_CX} cy={FIRE_CY + 2} rx={30} ry={12} fill="#2A2420" opacity={0.5} />
        <ellipse cx={FIRE_CX + 3} cy={FIRE_CY + 1} rx={22} ry={9} fill="#3A3430" opacity={0.35} />
        <ellipse cx={FIRE_CX - 5} cy={FIRE_CY + 3} rx={18} ry={7} fill="#1A1810" opacity={0.3} />

        {/* Glowing coals — warm orange/red base */}
        {Array.from({ length: 10 }, (_, i) => {
          const glow = longCycleNoise(frame * 0.7, i * 17 + 55);
          const coalOpacity = 0.15 + Math.max(0, glow) * 0.25;
          const prng = seededRandom(7600 + i);
          const cx = FIRE_CX - 18 + prng() * 36;
          const cy = FIRE_CY - 4 + prng() * 10;
          const cr = 2 + prng() * 4;
          return (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx={cr} ry={cr * 0.6} fill="#D84018" opacity={coalOpacity} />
              <ellipse cx={cx} cy={cy} rx={cr * 1.8} ry={cr * 1.1} fill="#C83010" opacity={coalOpacity * 0.15} />
            </g>
          );
        })}

        {/* Animated flames — 4 flame shapes */}
        {[
          { ox: -8, seed: 100, baseH: 35, color1: '#E88020', color2: '#D86010' },
          { ox: 5, seed: 200, baseH: 45, color1: '#F0A030', color2: '#E87018' },
          { ox: -3, seed: 300, baseH: 30, color1: '#D86818', color2: '#C04810' },
          { ox: 8, seed: 400, baseH: 25, color1: '#F0B848', color2: '#E89028' },
        ].map((fl, i) => {
          const flicker = longCycleNoise(frame * 0.9, fl.seed);
          const heightMod = 0.7 + Math.max(0, flicker) * 0.6;
          const swayX = longCycleNoise(frame * 0.6, fl.seed + 50) * 6;
          const h = fl.baseH * heightMod;
          const fx = FIRE_CX + fl.ox + swayX;
          const fy = FIRE_CY - 5;
          const fOpacity = 0.25 + Math.max(0, flicker) * 0.35;
          return (
            <g key={i} opacity={fOpacity}>
              {/* Outer flame */}
              <path
                d={`M${fx - 6},${fy} Q${fx - 4 + swayX * 0.5},${fy - h * 0.6} ${fx + swayX},${fy - h} Q${fx + 4 + swayX * 0.3},${fy - h * 0.5} ${fx + 6},${fy}`}
                fill={fl.color2} opacity={0.6}
              />
              {/* Inner bright core */}
              <path
                d={`M${fx - 3},${fy} Q${fx - 1 + swayX * 0.3},${fy - h * 0.5} ${fx + swayX * 0.5},${fy - h * 0.7} Q${fx + 2 + swayX * 0.2},${fy - h * 0.35} ${fx + 3},${fy}`}
                fill={fl.color1} opacity={0.7}
              />
              {/* Bright tip */}
              <ellipse cx={fx + swayX * 0.5} cy={fy - h * 0.8} rx={2} ry={3}
                fill="#F8D878" opacity={fOpacity * 0.4} />
            </g>
          );
        })}

        {/* Embers — glowing dots in the fire */}
        {Array.from({ length: 8 }, (_, i) => {
          const glow = longCycleNoise(frame * 0.8, i * 13 + 77);
          const opacity = 0.2 + Math.max(0, glow) * 0.4;
          const prng = seededRandom(7700 + i);
          const ex = FIRE_CX - 15 + prng() * 30;
          const ey = FIRE_CY - 3 + prng() * 8;
          return (
            <g key={i}>
              <circle cx={ex} cy={ey} r={1.5} fill="#F8A040" opacity={opacity} />
              <circle cx={ex} cy={ey} r={4} fill="#E87020" opacity={opacity * 0.15} />
            </g>
          );
        })}
      </g>

      {/* ── HANGING POT / KETTLE ON TRIPOD ──────────────── */}
      <g opacity={0.55}>
        {/* Tripod legs */}
        <line x1={FIRE_CX} y1={FIRE_CY - 60} x2={FIRE_CX - 30} y2={FIRE_CY + 5}
          stroke="#5A4828" strokeWidth={3} strokeLinecap="round" />
        <line x1={FIRE_CX} y1={FIRE_CY - 60} x2={FIRE_CX + 30} y2={FIRE_CY + 5}
          stroke="#5A4828" strokeWidth={3} strokeLinecap="round" />
        <line x1={FIRE_CX} y1={FIRE_CY - 60} x2={FIRE_CX + 5} y2={FIRE_CY + 10}
          stroke="#5A4828" strokeWidth={3} strokeLinecap="round" />
        {/* Chain / rope */}
        <line x1={FIRE_CX} y1={FIRE_CY - 58} x2={FIRE_CX} y2={FIRE_CY - 35}
          stroke="#4A4A4A" strokeWidth={1.5} strokeDasharray="2,2" />
        {/* Pot */}
        <path d={`M${FIRE_CX - 12},${FIRE_CY - 35} Q${FIRE_CX - 14},${FIRE_CY - 22} ${FIRE_CX},${FIRE_CY - 20} Q${FIRE_CX + 14},${FIRE_CY - 22} ${FIRE_CX + 12},${FIRE_CY - 35}`}
          fill="#3A3A3A" />
        <ellipse cx={FIRE_CX} cy={FIRE_CY - 35} rx={12} ry={4} fill="#4A4A4A" />
        {/* Pot rim highlight */}
        <ellipse cx={FIRE_CX} cy={FIRE_CY - 35} rx={10} ry={3} fill="#5A5A5A" opacity={0.3} />
        {/* Steam from pot */}
        {[0, 1, 2].map((j) => {
          const steamDrift = longCycleNoise(frame * 0.2, j * 43 + 550) * 8;
          const steamOpacity = 0.06 + Math.max(0, longCycleNoise(frame * 0.15, j * 37 + 560)) * 0.06;
          return (
            <ellipse key={j}
              cx={FIRE_CX - 5 + j * 5 + steamDrift}
              cy={FIRE_CY - 42 - j * 8}
              rx={4 + j * 2}
              ry={3 + j}
              fill="#B8B0A0" opacity={steamOpacity}
            />
          );
        })}
      </g>

      {/* ── SMOKE COLUMN ────────────────────────────────── */}
      <g>
        {Array.from({ length: 7 }, (_, i) => {
          const baseY = FIRE_CY - 50 - i * 35;
          const driftX = longCycleNoise(frame * 0.12, i * 29 + 700) * (15 + i * 8);
          const driftY = longCycleNoise(frame * 0.08, i * 23 + 710) * 10;
          const pulse = 1 + longCycleNoise(frame * 0.1, i * 19 + 720) * 0.2;
          const smokeOpacity = 0.06 - i * 0.006;
          const rx = 20 + i * 12;
          const ry = 8 + i * 4;
          return (
            <ellipse key={i}
              cx={FIRE_CX + driftX}
              cy={baseY + driftY}
              rx={rx * pulse}
              ry={ry * pulse}
              fill="#8A8070"
              opacity={Math.max(0.005, smokeOpacity)}
            />
          );
        })}
      </g>

      {/* ── EMBERS / SPARKS FLOATING UP ─────────────────── */}
      {Array.from({ length: 12 }, (_, i) => {
        const prng = seededRandom(9200 + i);
        const lifetime = (frame * 0.3 + prng() * 500) % 200;
        const progress = lifetime / 200;
        const sparkX = FIRE_CX - 15 + prng() * 30 + longCycleNoise(frame * 0.4, i * 31 + 800) * (10 + progress * 30);
        const sparkY = FIRE_CY - 10 - progress * 180;
        const sparkOpacity = progress < 0.1
          ? progress * 5
          : progress > 0.7
            ? (1 - progress) * 3.3
            : 0.5;
        const sparkSize = 1 + prng() * 1.5;
        return (
          <circle key={i}
            cx={sparkX} cy={sparkY}
            r={sparkSize * (1 - progress * 0.5)}
            fill={prng() > 0.5 ? '#F8A040' : '#E87020'}
            opacity={Math.max(0, sparkOpacity) * 0.4}
          />
        );
      })}

      {/* ── TORCH / LANTERN AT SIDE ─────────────────────── */}
      <g opacity={0.55}>
        {/* Pole */}
        <rect x={1390} y={680} width={4} height={70} rx={1} fill="#5A4828" />
        {/* Lantern body */}
        <rect x={1383} y={675} width={18} height={14} rx={2} fill="#6A5838" />
        {/* Lantern top */}
        <polygon points="1384,675 1400,675 1396,668 1388,668" fill="#5A4828" />
        {/* Warm glow inside */}
        {(() => {
          const torchFlicker = longCycleNoise(frame * 0.7, 880);
          const torchGlow = 0.15 + Math.max(0, torchFlicker) * 0.15;
          return (
            <g>
              <rect x={1386} y={678} width={12} height={8} rx={1}
                fill="#F0A030" opacity={torchGlow} />
              {/* Warm glow on ground */}
              <defs>
                <radialGradient id={`${ID}-torch-glow`} cx="0.5" cy="0.3" r="0.5">
                  <stop offset="0%" stopColor="#D88030" stopOpacity={torchGlow * 0.3} />
                  <stop offset="100%" stopColor="#D88030" stopOpacity={0} />
                </radialGradient>
              </defs>
              <ellipse cx={1392} cy={740} rx={60} ry={30}
                fill={`url(#${ID}-torch-glow)`} />
            </g>
          );
        })()}
      </g>

      {/* ── MOTHS NEAR FIRELIGHT ────────────────────────── */}
      {Array.from({ length: 5 }, (_, i) => {
        const mothSeed = 1100 + i;
        const orbitPhase = slowDrift(frame * 0.4, mothSeed);
        const orbitR = 30 + i * 20;
        const mx = FIRE_CX + orbitPhase * orbitR + longCycleNoise(frame * 0.5, mothSeed + 10) * 15;
        const my = FIRE_CY - 40 - i * 15 + longCycleNoise(frame * 0.35, mothSeed + 20) * 12;
        const wingFlap = 1 + longCycleNoise(frame * 2.0, mothSeed + 30) * 0.5;
        return (
          <g key={i} opacity={0.2}>
            {/* Left wing */}
            <ellipse cx={mx - 2 * wingFlap} cy={my} rx={2.5} ry={1.5}
              fill="#C8B898" transform={`rotate(-20, ${mx}, ${my})`} />
            {/* Right wing */}
            <ellipse cx={mx + 2 * wingFlap} cy={my} rx={2.5} ry={1.5}
              fill="#C8B898" transform={`rotate(20, ${mx}, ${my})`} />
            {/* Body */}
            <ellipse cx={mx} cy={my} rx={1} ry={1.5} fill="#A89878" />
          </g>
        );
      })}

      {/* ── TERRAIN TEXTURE ─────────────────────────────── */}
      <TerrainTexture id={ID} y={HORIZON} height={510} color="#2A2018" opacity={0.025} seed={4101} />

      {/* ── GROUND MIST ─────────────────────────────────── */}
      <GroundMist id={ID} y={780} color="#8A8070" opacity={0.08} frame={frame} count={4} seed={5001} />

      {/* ── FIRELIGHT ON GROUND (ANIMATED) ──────────────── */}
      <ellipse cx={FIRE_CX} cy={FIRE_CY} rx={220} ry={90} fill={`url(#${ID}-fire-glow)`} />
      {/* Secondary wider, dimmer glow */}
      <ellipse cx={FIRE_CX} cy={FIRE_CY + 20} rx={350} ry={140} fill={`url(#${ID}-fire-glow)`} opacity={0.3} />

      {/* ── WARM ATMOSPHERE OVERLAY ─────────────────────── */}
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-warm)`} />

      {/* ── BOTTOM VIGNETTE ─────────────────────────────── */}
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default CampGround;
