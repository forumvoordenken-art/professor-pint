/**
 * indoor_floor — Stenen/houten binnenvloer met rijke details.
 *
 * Past bij indoor_ceiling sky. Pubs, kerken, kastelen, musea.
 * Dense flagstone tiles with mortar lines, perspective grid,
 * worn traffic paths, rug, spilled drinks, coins, candle wax,
 * rat silhouette, table legs, barrel, hay, lantern light pools,
 * dust motes, trapdoor, drain grate, boot mud tracks, vignette.
 *
 * Oil painting style — warm, layered, atmospheric.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  TerrainTexture,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'indoor-floor';
const FLOOR_START = 620;
const MORTAR = '#221A10';

// ─── Flagstone tile generation ───────────────────────────────
const rng = seededRandom(3001);
const TILE_COLORS = ['#4A3E30', '#504438', '#3E3428', '#584C40', '#4A4035', '#5A4E3A', '#463828', '#524636'];
const TILES: Array<{
  points: string; fill: string; highlight: boolean; worn: boolean;
  cx: number; cy: number;
}> = [];

for (let row = 0; row < 12; row++) {
  const y = FLOOR_START + row * 38;
  const perspScale = 1 + row * 0.12;
  const tileWidth = (100 + row * 8) * perspScale * 0.6;
  const tilesPerRow = Math.ceil(1920 / tileWidth) + 2;
  const offsetX = (row % 2) * tileWidth * 0.4 - tileWidth * 0.5;

  for (let col = 0; col < tilesPerRow; col++) {
    const x = col * tileWidth + offsetX;
    const jx = () => (rng() - 0.5) * 10;
    const jy = () => (rng() - 0.5) * 6;
    const x1 = x + jx(), y1 = y + jy();
    const x2 = x + tileWidth + jx(), y2 = y + jy();
    const x3 = x + tileWidth + jx(), y3 = y + 38 + jy();
    const x4 = x + jx(), y4 = y + 38 + jy();
    TILES.push({
      points: `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`,
      fill: TILE_COLORS[Math.floor(rng() * TILE_COLORS.length)],
      highlight: rng() > 0.65,
      worn: rng() > 0.8,
      cx: (x1 + x2 + x3 + x4) / 4,
      cy: (y1 + y2 + y3 + y4) / 4,
    });
  }
}

// ─── Scattered coins ─────────────────────────────────────────
const coinRng = seededRandom(3100);
const COINS = Array.from({ length: 5 }, () => ({
  cx: 400 + coinRng() * 1100,
  cy: FLOOR_START + 80 + coinRng() * 300,
  r: 3 + coinRng() * 2,
  color: coinRng() > 0.5 ? '#C8A840' : '#B0A070',
  seed: coinRng() * 1000,
}));

// ─── Candle wax drips ────────────────────────────────────────
const waxRng = seededRandom(3200);
const WAX_DRIPS = Array.from({ length: 7 }, () => ({
  cx: 250 + waxRng() * 1400,
  cy: FLOOR_START + 60 + waxRng() * 280,
  rx: 4 + waxRng() * 8,
  ry: 3 + waxRng() * 5,
  angle: waxRng() * 360,
}));

// ─── Hay/straw scattered ────────────────────────────────────
const hayRng = seededRandom(3300);
const HAY_STRANDS = Array.from({ length: 30 }, () => ({
  x: hayRng() * 1920,
  y: FLOOR_START + 40 + hayRng() * 380,
  length: 8 + hayRng() * 18,
  angle: hayRng() * 360,
  color: hayRng() > 0.5 ? '#B8A060' : '#C8B070',
  opacity: 0.15 + hayRng() * 0.25,
}));

// ─── Boot mud tracks ─────────────────────────────────────────
const bootRng = seededRandom(3400);
const BOOT_PRINTS = Array.from({ length: 6 }, (_, i) => ({
  cx: 600 + i * 120 + (bootRng() - 0.5) * 30,
  cy: FLOOR_START + 140 + (bootRng() - 0.5) * 20 + i * 15,
  angle: -10 + bootRng() * 20,
  size: 0.7 + bootRng() * 0.3,
}));

export const IndoorFloor: React.FC<AssetProps> = ({ frame }) => {
  const ratX = 50 + longCycleNoise(frame * 0.15, 777) * 200 + (frame * 0.08) % 300;
  const ratY = FLOOR_START + 10 + longCycleNoise(frame * 0.3, 778) * 8;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Wall base — dark transition from wall to floor */}
      <defs>
        <linearGradient id={`${ID}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A2018" stopOpacity={0} />
          <stop offset="30%" stopColor="#2A2018" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#2A2018" stopOpacity={0.85} />
        </linearGradient>
      </defs>
      <rect x={0} y={FLOOR_START - 100} width={1920} height={100} fill={`url(#${ID}-wall)`} />

      {/* Wall baseboards — dark horizontal strip where floor meets wall */}
      <rect x={0} y={FLOOR_START - 8} width={1920} height={12} fill="#1E1608" opacity={0.6} />
      <rect x={0} y={FLOOR_START - 10} width={1920} height={3} fill="#3A2E20" opacity={0.3} />

      {/* Base floor — mortar/grout layer */}
      <rect x={0} y={FLOOR_START} width={1920} height={460} fill={MORTAR} />

      {/* Ground plane base gradient for depth */}
      <GroundPlane
        id={`${ID}-base`}
        horizonY={FLOOR_START}
        stops={[
          { offset: '0%', color: '#3A3020', opacity: 0.9 },
          { offset: '50%', color: '#2E2418', opacity: 0.95 },
          { offset: '100%', color: '#1E1810', opacity: 1 },
        ]}
      />

      {/* Flagstone tiles with mortar gaps */}
      {TILES.map((t, i) => (
        <g key={`tile-${i}`}>
          <polygon points={t.points} fill={t.fill} opacity={0.9} />
          {t.highlight && (
            <polygon points={t.points} fill="white" opacity={0.04} />
          )}
          {t.worn && (
            <polygon points={t.points} fill="#1A1408" opacity={0.08} />
          )}
        </g>
      ))}

      {/* Mortar groove lines — horizontal perspective rows */}
      <g opacity={0.2}>
        {Array.from({ length: 13 }, (_, i) => {
          const y = FLOOR_START + i * 38;
          return (
            <line key={`mh-${i}`} x1={0} y1={y} x2={1920} y2={y}
              stroke={MORTAR} strokeWidth={2.5} />
          );
        })}
      </g>

      {/* Tile color variations — per-tile stain overlay */}
      {TILES.filter((_, i) => i % 5 === 0).map((t, i) => {
        const stainColor = i % 2 === 0 ? '#5A4A30' : '#3A2E1A';
        return (
          <circle key={`stain-${i}`} cx={t.cx} cy={t.cy} r={12 + i * 2}
            fill={stainColor} opacity={0.06} />
        );
      })}

      {/* Worn smooth traffic path — center of room */}
      <defs>
        <radialGradient id={`${ID}-worn-center`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#5A5040" stopOpacity={0.12} />
          <stop offset="60%" stopColor="#4A4030" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#4A4030" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${ID}-worn-left`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#584838" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#584838" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={960} cy={FLOOR_START + 180} rx={350} ry={100} fill={`url(#${ID}-worn-center)`} />
      <ellipse cx={450} cy={FLOOR_START + 220} rx={180} ry={70} fill={`url(#${ID}-worn-left)`} />

      {/* Rug/carpet — woven rectangle in center */}
      <defs>
        <linearGradient id={`${ID}-rug`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7A2828" />
          <stop offset="15%" stopColor="#8A3030" />
          <stop offset="30%" stopColor="#6A2020" />
          <stop offset="50%" stopColor="#8A3535" />
          <stop offset="70%" stopColor="#6A2020" />
          <stop offset="85%" stopColor="#8A3030" />
          <stop offset="100%" stopColor="#7A2828" />
        </linearGradient>
      </defs>
      <g transform={`translate(700, ${FLOOR_START + 120})`}>
        {/* Rug body — perspective trapezoid */}
        <polygon points="40,0 480,0 520,180 0,180" fill={`url(#${ID}-rug)`} opacity={0.55} />
        {/* Rug border pattern */}
        <polygon points="40,0 480,0 520,180 0,180" fill="none"
          stroke="#4A1818" strokeWidth={4} opacity={0.3} />
        <polygon points="50,8 470,8 508,172 12,172" fill="none"
          stroke="#C8A040" strokeWidth={1.5} opacity={0.2} />
        {/* Woven crosshatch pattern */}
        {Array.from({ length: 8 }, (_, i) => {
          const lx = 55 + i * 55;
          return (
            <line key={`rw-${i}`} x1={lx} y1={12} x2={lx - 5} y2={170}
              stroke="#4A1818" strokeWidth={1} opacity={0.12} />
          );
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const ly = 20 + i * 28;
          return (
            <line key={`rh-${i}`} x1={45} y1={ly} x2={510} y2={ly}
              stroke="#4A1818" strokeWidth={0.8} opacity={0.1} />
          );
        })}
        {/* Fringe edges — top */}
        {Array.from({ length: 20 }, (_, i) => {
          const fx = 45 + i * 22;
          return (
            <line key={`ft-${i}`} x1={fx} y1={0} x2={fx + 1} y2={-8}
              stroke="#8A3030" strokeWidth={1.2} opacity={0.25} />
          );
        })}
        {/* Fringe edges — bottom */}
        {Array.from({ length: 22 }, (_, i) => {
          const fx = 5 + i * 24;
          return (
            <line key={`fb-${i}`} x1={fx} y1={180} x2={fx - 1} y2={190}
              stroke="#8A3030" strokeWidth={1.2} opacity={0.25} />
          );
        })}
      </g>

      {/* Spilled drink stain — dark wet circle with satellite drops */}
      <defs>
        <radialGradient id={`${ID}-spill`} cx="0.45" cy="0.45" r="0.5">
          <stop offset="0%" stopColor="#1A1008" stopOpacity={0.3} />
          <stop offset="60%" stopColor="#2A1A08" stopOpacity={0.2} />
          <stop offset="85%" stopColor="#2A1A08" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#2A1A08" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={1350} cy={FLOOR_START + 200} rx={45} ry={35} fill={`url(#${ID}-spill)`} />
      {/* Splash drops around stain */}
      {[
        { dx: 55, dy: -15, r: 4 }, { dx: -40, dy: 25, r: 3 },
        { dx: 60, dy: 20, r: 2.5 }, { dx: -30, dy: -30, r: 3.5 },
        { dx: 50, dy: 35, r: 2 }, { dx: -55, dy: 5, r: 2.8 },
      ].map((d, i) => (
        <circle key={`drip-${i}`} cx={1350 + d.dx} cy={FLOOR_START + 200 + d.dy}
          r={d.r} fill="#2A1A08" opacity={0.12} />
      ))}

      {/* Scattered coins — metallic circles */}
      {COINS.map((c, i) => {
        const glint = 0.3 + longCycleNoise(frame * 0.2, c.seed) * 0.1;
        return (
          <g key={`coin-${i}`}>
            <circle cx={c.cx} cy={c.cy} r={c.r} fill={c.color} opacity={0.5} />
            <circle cx={c.cx - 1} cy={c.cy - 1} r={c.r * 0.5} fill="#E8D880" opacity={glint} />
            <circle cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke="#8A7830" strokeWidth={0.5} opacity={0.3} />
          </g>
        );
      })}

      {/* Candle wax drips — hardened cream/white blobs */}
      {WAX_DRIPS.map((w, i) => (
        <g key={`wax-${i}`}>
          <ellipse cx={w.cx} cy={w.cy} rx={w.rx} ry={w.ry}
            fill="#E8DCCB" opacity={0.18}
            transform={`rotate(${w.angle}, ${w.cx}, ${w.cy})`} />
          <ellipse cx={w.cx + 1} cy={w.cy - 1} rx={w.rx * 0.6} ry={w.ry * 0.5}
            fill="#F0E8D8" opacity={0.1}
            transform={`rotate(${w.angle}, ${w.cx}, ${w.cy})`} />
        </g>
      ))}

      {/* Table leg bases — thick wooden posts */}
      {[
        { cx: 350, cy: FLOOR_START + 260 },
        { cx: 550, cy: FLOOR_START + 260 },
        { cx: 1400, cy: FLOOR_START + 280 },
        { cx: 1580, cy: FLOOR_START + 280 },
      ].map((leg, i) => (
        <g key={`leg-${i}`}>
          {/* Shadow of leg on floor */}
          <ellipse cx={leg.cx + 8} cy={leg.cy + 5} rx={18} ry={8} fill="#0A0804" opacity={0.15} />
          {/* Leg base circle */}
          <ellipse cx={leg.cx} cy={leg.cy} rx={14} ry={7} fill="#3A2A18" opacity={0.7} />
          <ellipse cx={leg.cx} cy={leg.cy - 2} rx={12} ry={5} fill="#4A3A28" opacity={0.5} />
          {/* Highlight */}
          <ellipse cx={leg.cx - 3} cy={leg.cy - 3} rx={5} ry={3} fill="#6A5A40" opacity={0.2} />
        </g>
      ))}

      {/* Chair shadows cast on floor */}
      {[
        { x: 400, y: FLOOR_START + 300, w: 80, h: 50 },
        { x: 1450, y: FLOOR_START + 320, w: 70, h: 45 },
      ].map((shadow, i) => (
        <ellipse key={`chair-sh-${i}`} cx={shadow.x} cy={shadow.y}
          rx={shadow.w} ry={shadow.h} fill="#0A0804" opacity={0.08} />
      ))}

      {/* Barrel at side — seen from above, wooden circle with metal bands */}
      <g transform={`translate(120, ${FLOOR_START + 100})`}>
        {/* Barrel shadow */}
        <ellipse cx={8} cy={8} rx={38} ry={32} fill="#0A0804" opacity={0.15} />
        {/* Barrel body */}
        <ellipse cx={0} cy={0} rx={35} ry={28} fill="#5A4028" opacity={0.7} />
        {/* Wood grain lines */}
        {Array.from({ length: 5 }, (_, i) => {
          const angle = -40 + i * 18;
          return (
            <line key={`bg-${i}`}
              x1={-30} y1={-20 + i * 10} x2={30} y2={-20 + i * 10}
              stroke="#4A3018" strokeWidth={0.8} opacity={0.2}
              transform={`rotate(${angle}, 0, 0)`} />
          );
        })}
        {/* Metal bands */}
        <ellipse cx={0} cy={0} rx={35} ry={28} fill="none"
          stroke="#6A6050" strokeWidth={2.5} opacity={0.4} />
        <ellipse cx={0} cy={0} rx={28} ry={22} fill="none"
          stroke="#6A6050" strokeWidth={1.5} opacity={0.25} />
        {/* Center top highlight */}
        <ellipse cx={-5} cy={-5} rx={12} ry={8} fill="#7A6A48" opacity={0.15} />
      </g>

      {/* Hay/straw scattered on floor */}
      {HAY_STRANDS.map((h, i) => (
        <line key={`hay-${i}`}
          x1={h.x} y1={h.y}
          x2={h.x + Math.cos(h.angle * Math.PI / 180) * h.length}
          y2={h.y + Math.sin(h.angle * Math.PI / 180) * h.length}
          stroke={h.color} strokeWidth={1.2} strokeLinecap="round"
          opacity={h.opacity} />
      ))}

      {/* Wooden trapdoor outline in floor */}
      <g transform={`translate(1600, ${FLOOR_START + 300})`} opacity={0.25}>
        <rect x={0} y={0} width={90} height={70} fill="#3A2A18" rx={2} />
        <rect x={3} y={3} width={84} height={64} fill="none" stroke="#2A1A10" strokeWidth={2} />
        {/* Planks on trapdoor */}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`tp-${i}`} x1={5} y1={8 + i * 17} x2={85} y2={8 + i * 17}
            stroke="#2A1A10" strokeWidth={0.8} />
        ))}
        {/* Iron ring handle */}
        <circle cx={45} cy={35} r={8} fill="none" stroke="#5A5448" strokeWidth={2} />
        <circle cx={45} cy={28} r={3} fill="#5A5448" />
      </g>

      {/* Iron drain grate */}
      <g transform={`translate(850, ${FLOOR_START + 350})`} opacity={0.2}>
        <rect x={0} y={0} width={40} height={40} fill="#1A1208" rx={3} />
        {/* Grate bars */}
        {Array.from({ length: 4 }, (_, i) => (
          <React.Fragment key={`grate-${i}`}>
            <line x1={5 + i * 10} y1={3} x2={5 + i * 10} y2={37}
              stroke="#4A4840" strokeWidth={2} />
            <line x1={3} y1={5 + i * 10} x2={37} y2={5 + i * 10}
              stroke="#4A4840" strokeWidth={2} />
          </React.Fragment>
        ))}
      </g>

      {/* Boot mud tracks */}
      {BOOT_PRINTS.map((b, i) => (
        <g key={`boot-${i}`} transform={`rotate(${b.angle}, ${b.cx}, ${b.cy})`} opacity={0.08}>
          <ellipse cx={b.cx} cy={b.cy} rx={12 * b.size} ry={18 * b.size} fill="#2A2010" />
          <ellipse cx={b.cx} cy={b.cy - 22 * b.size} rx={8 * b.size} ry={6 * b.size} fill="#2A2010" />
        </g>
      ))}

      {/* Rat silhouette scurrying along wall edge */}
      <g transform={`translate(${ratX}, ${ratY})`} opacity={0.2}>
        <ellipse cx={0} cy={0} rx={10} ry={5} fill="#1A1208" />
        <circle cx={-8} cy={-3} r={3} fill="#1A1208" />
        <line x1={10} y1={0} x2={22} y2={-3 + longCycleNoise(frame * 0.8, 780) * 3}
          stroke="#1A1208" strokeWidth={1} strokeLinecap="round" />
        {/* Tiny ears */}
        <circle cx={-10} cy={-5} r={2} fill="#2A2018" />
        <circle cx={-7} cy={-5} r={2} fill="#2A2018" />
        {/* Eye glint */}
        <circle cx={-10} cy={-2} r={0.5} fill="#C8A860" opacity={0.4} />
      </g>

      {/* Lantern light pools — warm flickering glow on floor */}
      {[
        { cx: 350, cy: FLOOR_START + 180, seed: 10, r: 220 },
        { cx: 960, cy: FLOOR_START + 150, seed: 20, r: 280 },
        { cx: 1550, cy: FLOOR_START + 190, seed: 30, r: 200 },
      ].map((light, i) => {
        const flicker = longCycleNoise(frame * 0.6, light.seed) * 0.025;
        const sizeFlicker = 1 + longCycleNoise(frame * 0.5, light.seed + 5) * 0.03;
        return (
          <g key={`light-${i}`}>
            <defs>
              <radialGradient id={`${ID}-light-${i}`} cx="0.5" cy="0.3" r="0.55">
                <stop offset="0%" stopColor="#E8A840" stopOpacity={0.12 + flicker} />
                <stop offset="30%" stopColor="#D89830" stopOpacity={0.06 + flicker * 0.5} />
                <stop offset="60%" stopColor="#C88828" stopOpacity={0.025} />
                <stop offset="100%" stopColor="#C88828" stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={light.cx} cy={light.cy}
              rx={light.r * sizeFlicker} ry={light.r * 0.45 * sizeFlicker}
              fill={`url(#${ID}-light-${i})`} />
          </g>
        );
      })}

      {/* Dust motes in lantern light beams */}
      {Array.from({ length: 20 }, (_, i) => {
        const baseX = 300 + (i % 10) * 150;
        const baseY = FLOOR_START - 40 + (i % 4) * 60;
        const drift = longCycleNoise(frame * 0.25, i * 17 + 100) * 25;
        const floatY = longCycleNoise(frame * 0.2, i * 23 + 200) * 15;
        const vis = longCycleNoise(frame * 0.15, i * 31 + 300);
        if (vis < 0.1) return null;
        return (
          <circle key={`dust-${i}`} cx={baseX + drift} cy={baseY + floatY}
            r={0.8 + vis * 0.8} fill="#D8C898" opacity={0.04 + vis * 0.04} />
        );
      })}

      {/* Painterly texture overlay */}
      <TerrainTexture id={`${ID}-tex1`} y={FLOOR_START} height={460}
        color="#0A0804" opacity={0.03} dotCount={60} seed={4201} />
      <TerrainTexture id={`${ID}-tex2`} y={FLOOR_START} height={460}
        color="#D8A050" opacity={0.015} dotCount={40} seed={4202} />

      {/* Warm ambient color grade */}
      <rect x={0} y={FLOOR_START} width={1920} height={460} fill="#D8A050" opacity={0.025} />

      {/* Heavy vignette — very dark room edges */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.65" r="0.55">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="40%" stopColor="#000" stopOpacity={0} />
          <stop offset="70%" stopColor="#000" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>
      </defs>
      <rect x={0} y={FLOOR_START - 100} width={1920} height={560} fill={`url(#${ID}-vig)`} />

      {/* Edge darkness — left and right walls */}
      <defs>
        <linearGradient id={`${ID}-edge-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${ID}-edge-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <rect x={0} y={FLOOR_START} width={250} height={460} fill={`url(#${ID}-edge-l)`} />
      <rect x={1670} y={FLOOR_START} width={250} height={460} fill={`url(#${ID}-edge-r)`} />
    </svg>
  );
};

export default IndoorFloor;
