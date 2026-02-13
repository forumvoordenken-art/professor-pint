/**
 * sea_shore — Strand met golven, zand en schuim.
 *
 * Zeevaarders, ontdekkingsreizen, invasies, kustculturen.
 * Sandy beach with waves rolling in and foam.
 * Multi-layered ocean depth, wave crests with spray, wet sand
 * reflections, tide pools, seaweed, crabs, bird tracks, rock
 * outcrops with barnacles, distant sails, beach grass, jellyfish,
 * sea foam bubbles, starfish, wind-blown sand. Oil painting style.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  HillSilhouette,
  SurfaceScatter,
  GroundMist,
  WaterSurface,
  TerrainTexture,
  generateHillPath,
  generateSurfaceElements,
  renderGrassBlade,
  renderPebble,
  longCycleNoise,
  seededRandom,
  slowDrift,
} from './TerrainEngine';

const ID = 'sea-shore';
const HORIZON = 480;
const WAVE_BREAK = 680;
const WET_SAND_END = 740;
const DRY_SAND_START = 780;

// ─── Color Palettes (oil painting muted tones) ─────────────

const SAND_STOPS = [
  { offset: '0%', color: '#C2B080' },
  { offset: '18%', color: '#B8A878' },
  { offset: '40%', color: '#AE9E6E' },
  { offset: '65%', color: '#A09060' },
  { offset: '85%', color: '#948858' },
  { offset: '100%', color: '#887C50' },
];

const OCEAN_DEEP = '#1A3848';
const OCEAN_MID = '#2A5068';
const OCEAN_NEAR = '#3A7888';
const OCEAN_SHALLOW = '#58A0A8';

// ─── Distant headland hills (silhouette on horizon edges) ──

const HEADLAND_HILLS = [
  {
    path: generateHillPath(HORIZON - 10, 40, 6, 8801, HORIZON + 60),
    fill: '#3A5060',
    opacity: 0.25,
    drift: 0.2,
  },
  {
    path: generateHillPath(HORIZON + 5, 30, 5, 8802, HORIZON + 50),
    fill: '#4A6070',
    opacity: 0.18,
    drift: 0.15,
  },
];

// ─── Beach pebble scatter (near high-tide line) ────────────

const BEACH_PEBBLES = generateSurfaceElements(
  18,
  9900,
  { x: 50, y: WET_SAND_END - 10, width: 1820, height: 50 },
  ['#7A7268', '#6A6258', '#8A8078', '#5A5448', '#9A9088'],
);

// ─── Pre-computed static elements ──────────────────────────

const rng = seededRandom(2901);

// Distant sail boats on horizon
const SAIL_BOATS = Array.from({ length: 3 }, () => ({
  x: 200 + rng() * 1520,
  y: HORIZON - 15 + rng() * 20,
  size: 0.4 + rng() * 0.5,
  lean: (rng() - 0.5) * 8,
  opacity: 0.15 + rng() * 0.12,
}));

// Rock outcrops at water edge
const ROCK_OUTCROPS = [
  { x: 120, y: WAVE_BREAK - 20, w: 90, h: 55, seed: 3100 },
  { x: 1650, y: WAVE_BREAK - 10, w: 110, h: 65, seed: 3101 },
  { x: 880, y: WAVE_BREAK + 5, w: 70, h: 40, seed: 3102 },
];

// Barnacle clusters on rocks
const BARNACLES = ROCK_OUTCROPS.flatMap((rock) => {
  const brng = seededRandom(rock.seed + 50);
  return Array.from({ length: 18 }, () => ({
    cx: rock.x + brng() * rock.w,
    cy: rock.y + brng() * rock.h * 0.8,
    r: 1 + brng() * 2.5,
    opacity: 0.15 + brng() * 0.2,
  }));
});

// Tide pools — small water pools in sand depressions
const TIDE_POOLS = Array.from({ length: 5 }, () => ({
  cx: 100 + rng() * 1720,
  cy: WET_SAND_END + rng() * 30,
  rx: 15 + rng() * 25,
  ry: 6 + rng() * 12,
  angle: (rng() - 0.5) * 20,
  seed: Math.floor(rng() * 10000),
}));

// Pebbles inside tide pools
const TIDE_POOL_PEBBLES = TIDE_POOLS.flatMap((pool) => {
  const prng = seededRandom(pool.seed + 10);
  return Array.from({ length: 6 }, () => ({
    cx: pool.cx + (prng() - 0.5) * pool.rx * 1.2,
    cy: pool.cy + (prng() - 0.5) * pool.ry * 0.8,
    r: 1 + prng() * 2,
    color: ['#6A6258', '#5A5448', '#7A7268', '#8A8078'][Math.floor(prng() * 4)],
  }));
});

// Seaweed strands washed up
const SEAWEED = Array.from({ length: 8 }, () => {
  const sx = rng() * 1920;
  const sy = WAVE_BREAK + 20 + rng() * 80;
  const len = 20 + rng() * 50;
  const curves = 3 + Math.floor(rng() * 3);
  let path = `M${sx},${sy}`;
  for (let j = 0; j < curves; j++) {
    const dx = (rng() - 0.3) * len * 0.4;
    const dy = -rng() * len * 0.3;
    const cx1 = dx + (rng() - 0.5) * 15;
    const cy1 = dy + (rng() - 0.5) * 10;
    path += ` q${cx1},${cy1} ${dx},${dy}`;
  }
  return {
    path,
    color: ['#3A5828', '#4A6030', '#2A4818', '#5A7038', '#384A20'][Math.floor(rng() * 5)],
    width: 1.5 + rng() * 2.5,
    opacity: 0.25 + rng() * 0.2,
    hasBladder: rng() > 0.5,
    bladderX: sx + (rng() - 0.5) * 20,
    bladderY: sy - rng() * 15,
  };
});

// Shells scattered on beach
const SHELLS = Array.from({ length: 16 }, () => ({
  cx: rng() * 1920,
  cy: WAVE_BREAK + 30 + rng() * 280,
  r: 2 + rng() * 5,
  color: ['#E8D8C0', '#D8C8B0', '#C8B8A0', '#F0E0C8', '#E0D0B8'][Math.floor(rng() * 5)],
  angle: rng() * 360,
  type: Math.floor(rng() * 3), // 0=round, 1=fan, 2=spiral
}));

// Driftwood pieces
const DRIFTWOOD = Array.from({ length: 4 }, () => ({
  x: rng() * 1600 + 160,
  y: WAVE_BREAK + 40 + rng() * 200,
  length: 40 + rng() * 100,
  angle: (rng() - 0.5) * 35,
  thickness: 2 + rng() * 3,
}));

// Seabird tracks — V-shaped footprints in wet sand
const BIRD_TRACKS = Array.from({ length: 12 }, () => ({
  x: rng() * 1600 + 160,
  y: WET_SAND_END - 20 + rng() * 40,
  angle: (rng() - 0.5) * 40 - 90,
  size: 3 + rng() * 3,
}));

// Sand castle remains (eroded mound)
const CASTLE_X = 1200 + (seededRandom(5555)() - 0.5) * 400;
const CASTLE_Y = DRY_SAND_START + 40;

// Jellyfish washed up
const JELLY_X = 600 + seededRandom(6666)() * 600;
const JELLY_Y = WAVE_BREAK + 50 + seededRandom(6667)() * 40;

// Starfish on a rock (we place it on the first rock outcrop)
const STAR_X = ROCK_OUTCROPS[0].x + 30;
const STAR_Y = ROCK_OUTCROPS[0].y - 5;

// Beach grass tufts at top of beach
const BEACH_GRASS = generateSurfaceElements(
  24,
  7700,
  { x: 0, y: 950, width: 1920, height: 110 },
  ['#5A7038', '#4A6028', '#6A8040', '#3A5020', '#7A9048'],
);

// Wave foam bubble positions (static layout, animated opacity)
const FOAM_BUBBLES = Array.from({ length: 30 }, () => ({
  cx: rng() * 1920,
  cy: WAVE_BREAK - 5 + rng() * 40,
  r: 1 + rng() * 3,
  seed: rng() * 1000,
}));

// Wind-blown sand particles
const SAND_PARTICLES = Array.from({ length: 25 }, () => ({
  baseX: rng() * 1920,
  baseY: DRY_SAND_START + rng() * 250,
  size: 0.5 + rng() * 1.5,
  seed: rng() * 1000,
  speed: 0.3 + rng() * 0.5,
}));

// ─── Component ─────────────────────────────────────────────

export const SeaShore: React.FC<AssetProps> = ({ frame }) => {
  // Wave push — main tidal motion
  const wavePush = longCycleNoise(frame * 0.3, 55) * 15;
  const wavePush2 = longCycleNoise(frame * 0.25, 88) * 10;

  // Pre-compute wave line paths with useMemo where frame segments match
  const waveLines = useMemo(() => {
    const lines: Array<{ points: string; opacity: number; yBase: number }> = [];
    for (let w = 0; w < 6; w++) {
      const yBase = HORIZON + 30 + w * 35;
      const speed = 0.4 + w * 0.08;
      const amplitude = 3 + w * 1.5;
      const pts: string[] = [];
      for (let x = 0; x <= 1920; x += 30) {
        const noise = longCycleNoise(frame * speed + x * 0.006, w * 41 + 200);
        pts.push(`${x},${yBase + noise * amplitude}`);
      }
      lines.push({
        points: pts.join(' '),
        opacity: 0.05 + w * 0.025,
        yBase,
      });
    }
    return lines;
  }, [frame]);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Horizon atmospheric haze ── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 100} height={200} color="#7A9AA8" opacity={0.35} />

      {/* ── Distant headland hills (coastal silhouettes) ── */}
      <HillSilhouette hills={HEADLAND_HILLS} frame={frame} idPrefix={`${ID}-headland`} />

      {/* ── Ocean Layer 1: Far deep water (dark) ── */}
      <defs>
        <linearGradient id={`${ID}-ocean-deep`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={OCEAN_DEEP} stopOpacity={0.85} />
          <stop offset="50%" stopColor={OCEAN_MID} stopOpacity={0.9} />
          <stop offset="100%" stopColor={OCEAN_MID} stopOpacity={0.95} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON} width={1920} height={80} fill={`url(#${ID}-ocean-deep)`} />

      {/* ── Ocean Layer 2: Mid water ── */}
      <defs>
        <linearGradient id={`${ID}-ocean-mid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={OCEAN_MID} stopOpacity={0.9} />
          <stop offset="100%" stopColor={OCEAN_NEAR} stopOpacity={0.92} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON + 80} width={1920} height={60} fill={`url(#${ID}-ocean-mid)`} />

      {/* ── Ocean Layer 3: Near turquoise water ── */}
      <defs>
        <linearGradient id={`${ID}-ocean-near`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={OCEAN_NEAR} stopOpacity={0.9} />
          <stop offset="100%" stopColor={OCEAN_SHALLOW} stopOpacity={0.85} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON + 140} width={1920} height={60} fill={`url(#${ID}-ocean-near)`} />

      {/* ── Ocean Layer 4: Shallow water approaching beach ── */}
      <WaterSurface
        id={`${ID}-shallows`}
        y={HORIZON + 200}
        height={WAVE_BREAK - HORIZON - 200 + wavePush}
        color={OCEAN_SHALLOW}
        reflectionColor="#90C8D0"
        opacity={0.85}
        frame={frame}
        waveCount={10}
      />

      {/* ── Distant sail boats on horizon ── */}
      {SAIL_BOATS.map((boat, i) => {
        const bob = longCycleNoise(frame * 0.35, i * 61 + 400) * 3;
        const drift = slowDrift(frame, i * 77 + 500) * 12;
        return (
          <g key={i} opacity={boat.opacity} transform={`translate(${boat.x + drift}, ${boat.y + bob})`}>
            {/* Hull */}
            <ellipse cx={0} cy={0} rx={8 * boat.size} ry={2.5 * boat.size} fill="#2A2820" />
            {/* Mast */}
            <line x1={0} y1={0} x2={boat.lean * 0.15} y2={-18 * boat.size}
              stroke="#2A2820" strokeWidth={0.8} />
            {/* Sail */}
            <path
              d={`M${boat.lean * 0.15},${-18 * boat.size} L${4 * boat.size + boat.lean * 0.3},${-6 * boat.size} L0,${-2 * boat.size} Z`}
              fill="#D8D0C0" opacity={0.6}
            />
          </g>
        );
      })}

      {/* ── Ocean surface shimmer (sun reflection) ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const shimX = 150 + i * 240;
        const shimNoise = longCycleNoise(frame * 0.3, i * 37 + 150);
        return (
          <ellipse
            key={i}
            cx={shimX + shimNoise * 25}
            cy={HORIZON + 60 + i * 12}
            rx={50 + shimNoise * 15}
            ry={4 + shimNoise * 2}
            fill="#F0E8D0"
            opacity={0.03 + Math.max(0, shimNoise) * 0.04}
          />
        );
      })}

      {/* ── Wave lines rolling in (6 layers, different speeds) ── */}
      {waveLines.map((line, i) => (
        <polyline
          key={i}
          points={line.points}
          fill="none"
          stroke="white"
          strokeWidth={0.8 + i * 0.15}
          opacity={line.opacity}
        />
      ))}

      {/* ── Wave crest foam (white caps) ── */}
      <g>
        {Array.from({ length: 30 }, (_, i) => {
          const x = i * 66;
          const foamY = WAVE_BREAK + wavePush + longCycleNoise(frame * 0.5, i * 13) * 8;
          const foamWidth = 30 + longCycleNoise(frame * 0.35, i * 19 + 50) * 15;
          return (
            <ellipse key={i} cx={x} cy={foamY} rx={foamWidth} ry={3.5}
              fill="white" opacity={0.2 + Math.max(0, longCycleNoise(frame * 0.4, i * 7)) * 0.12} />
          );
        })}
      </g>

      {/* ── Secondary foam line (behind main break) ── */}
      <g>
        {Array.from({ length: 22 }, (_, i) => {
          const x = i * 90 + 20;
          const foamY = WAVE_BREAK - 20 + wavePush2 + longCycleNoise(frame * 0.55, i * 17 + 80) * 5;
          return (
            <ellipse key={i} cx={x} cy={foamY} rx={40} ry={2.2}
              fill="white" opacity={0.1 + Math.max(0, longCycleNoise(frame * 0.45, i * 11 + 30)) * 0.06} />
          );
        })}
      </g>

      {/* ── Tertiary foam (far out) ── */}
      <g opacity={0.06}>
        {Array.from({ length: 18 }, (_, i) => {
          const x = i * 110 + 40;
          const foamY = WAVE_BREAK - 50 + longCycleNoise(frame * 0.6, i * 23 + 120) * 4;
          return (
            <ellipse key={i} cx={x} cy={foamY} rx={35} ry={1.8} fill="white" />
          );
        })}
      </g>

      {/* ── Wave crash spray — animated white particles ── */}
      {Array.from({ length: 16 }, (_, i) => {
        const sprayBase = WAVE_BREAK + wavePush;
        const sprayX = 50 + i * 125 + longCycleNoise(frame * 0.4, i * 31) * 20;
        const sprayIntensity = Math.max(0, longCycleNoise(frame * 0.5, i * 43 + 300));
        return (
          <g key={i} opacity={sprayIntensity * 0.25}>
            {Array.from({ length: 5 }, (_, j) => {
              const pSeed = i * 100 + j * 17;
              const px = sprayX + longCycleNoise(frame * 0.7, pSeed) * 15;
              const py = sprayBase - 8 - j * 4 + longCycleNoise(frame * 0.8, pSeed + 50) * 6;
              return (
                <circle key={j} cx={px} cy={py} r={1 + j * 0.3} fill="white" opacity={0.5 - j * 0.08} />
              );
            })}
          </g>
        );
      })}

      {/* ── Sea foam bubbles in wash zone ── */}
      {FOAM_BUBBLES.map((b, i) => {
        const bubbleOp = 0.1 + Math.max(0, longCycleNoise(frame * 0.6, b.seed)) * 0.2;
        const drift = longCycleNoise(frame * 0.3, b.seed + 100) * 8;
        return (
          <circle key={i} cx={b.cx + drift} cy={b.cy + wavePush * 0.5} r={b.r}
            fill="none" stroke="white" strokeWidth={0.4} opacity={bubbleOp} />
        );
      })}

      {/* ── Wet sand zone — darker, reflective ── */}
      <defs>
        <linearGradient id={`${ID}-wet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6A7A80" stopOpacity={0.35} />
          <stop offset="40%" stopColor="#7A8A88" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#8A7A60" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={WAVE_BREAK + wavePush} width={1920} height={70} fill={`url(#${ID}-wet)`} />

      {/* ── Wet sand mirror shimmer ── */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = 80 + i * 160;
        const shimmer = longCycleNoise(frame * 0.2, i * 29 + 500) * 0.035;
        const stretch = longCycleNoise(frame * 0.15, i * 37 + 600) * 10;
        return (
          <ellipse key={i} cx={x} cy={WAVE_BREAK + 25 + wavePush * 0.5}
            rx={55 + stretch} ry={6} fill="#90B0B8" opacity={0.05 + shimmer} />
        );
      })}

      {/* ── Beach sand ground plane ── */}
      <GroundPlane id={ID} horizonY={WET_SAND_END} stops={SAND_STOPS} />

      {/* ── Sand ripple patterns (wave-formed) ── */}
      <g opacity={0.05}>
        {Array.from({ length: 10 }, (_, i) => {
          const y = WET_SAND_END + 5 + i * 22;
          const pts = Array.from({ length: 49 }, (_, j) => {
            const nx = j * 40;
            const ny = y + longCycleNoise(j * 0.08 + i * 1.3, i * 19 + 900) * 2.5;
            return `${nx},${ny}`;
          });
          return (
            <polyline key={i} points={pts.join(' ')}
              fill="none" stroke="#B8A870" strokeWidth={0.8} />
          );
        })}
      </g>

      {/* ── Rock outcrops at water edge ── */}
      {ROCK_OUTCROPS.map((rock, ri) => {
        const rockRng = seededRandom(rock.seed);
        return (
          <g key={ri}>
            {/* Main rock body */}
            <ellipse
              cx={rock.x + rock.w / 2}
              cy={rock.y + rock.h / 2}
              rx={rock.w / 2}
              ry={rock.h / 2}
              fill="#4A4840"
              opacity={0.85}
            />
            {/* Rock highlight (top-left) */}
            <ellipse
              cx={rock.x + rock.w * 0.35}
              cy={rock.y + rock.h * 0.3}
              rx={rock.w * 0.28}
              ry={rock.h * 0.22}
              fill="#8A8878"
              opacity={0.12}
            />
            {/* Rock shadow (bottom-right) */}
            <ellipse
              cx={rock.x + rock.w * 0.6}
              cy={rock.y + rock.h * 0.65}
              rx={rock.w * 0.35}
              ry={rock.h * 0.28}
              fill="#1A1810"
              opacity={0.15}
            />
            {/* Rock texture cracks */}
            {Array.from({ length: 4 }, (_, ci) => {
              const cx = rock.x + rockRng() * rock.w;
              const cy2 = rock.y + rockRng() * rock.h * 0.7;
              return (
                <line key={ci}
                  x1={cx} y1={cy2}
                  x2={cx + (rockRng() - 0.5) * 20}
                  y2={cy2 + rockRng() * 15}
                  stroke="#2A2820" strokeWidth={0.6} opacity={0.15}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Waterline mark on rock */}
            <ellipse
              cx={rock.x + rock.w / 2}
              cy={rock.y + rock.h * 0.55}
              rx={rock.w * 0.45}
              ry={2}
              fill="#5A8888"
              opacity={0.12}
            />
          </g>
        );
      })}

      {/* ── Barnacle texture on rocks ── */}
      {BARNACLES.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#8A8878" opacity={b.opacity} />
      ))}

      {/* ── Starfish on first rock ── */}
      <g transform={`translate(${STAR_X}, ${STAR_Y}) rotate(18)`} opacity={0.5}>
        {Array.from({ length: 5 }, (_, i) => {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const tipX = Math.cos(angle) * 8;
          const tipY = Math.sin(angle) * 8;
          const midAngle1 = ((i * 72 - 90 + 30) * Math.PI) / 180;
          const midAngle2 = ((i * 72 - 90 - 30) * Math.PI) / 180;
          const innerR = 3;
          return (
            <path key={i}
              d={`M0,0 L${Math.cos(midAngle2) * innerR},${Math.sin(midAngle2) * innerR} L${tipX},${tipY} L${Math.cos(midAngle1) * innerR},${Math.sin(midAngle1) * innerR} Z`}
              fill="#B85038"
              stroke="#A04028"
              strokeWidth={0.3}
            />
          );
        })}
        {/* Center bump */}
        <circle cx={0} cy={0} r={2.5} fill="#C06048" opacity={0.6} />
      </g>

      {/* ── Tide pools ── */}
      {TIDE_POOLS.map((pool, i) => {
        const poolShimmer = longCycleNoise(frame * 0.2, pool.seed) * 0.04;
        return (
          <g key={i} transform={`rotate(${pool.angle}, ${pool.cx}, ${pool.cy})`}>
            {/* Pool depression shadow */}
            <ellipse cx={pool.cx} cy={pool.cy + 2} rx={pool.rx + 2} ry={pool.ry + 1}
              fill="#7A6A50" opacity={0.15} />
            {/* Water surface */}
            <ellipse cx={pool.cx} cy={pool.cy} rx={pool.rx} ry={pool.ry}
              fill="#4A8090" opacity={0.4 + poolShimmer} />
            {/* Sky reflection */}
            <ellipse cx={pool.cx - pool.rx * 0.2} cy={pool.cy - pool.ry * 0.2}
              rx={pool.rx * 0.5} ry={pool.ry * 0.4}
              fill="#90B8C8" opacity={0.15 + poolShimmer} />
            {/* Rim highlight */}
            <ellipse cx={pool.cx} cy={pool.cy} rx={pool.rx} ry={pool.ry}
              fill="none" stroke="#A09878" strokeWidth={0.8} opacity={0.15} />
          </g>
        );
      })}

      {/* ── Pebbles in tide pools ── */}
      {TIDE_POOL_PEBBLES.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.color} opacity={0.3} />
      ))}

      {/* ── Beach pebbles along high-tide line ── */}
      <SurfaceScatter elements={BEACH_PEBBLES} frame={frame} renderElement={renderPebble} />

      {/* ── Seaweed strands ── */}
      {SEAWEED.map((sw, i) => (
        <g key={i}>
          <path d={sw.path} fill="none" stroke={sw.color}
            strokeWidth={sw.width} opacity={sw.opacity} strokeLinecap="round" />
          {/* Bladderwrack air bladders */}
          {sw.hasBladder && (
            <g>
              <ellipse cx={sw.bladderX} cy={sw.bladderY} rx={2.5} ry={2}
                fill={sw.color} opacity={sw.opacity * 0.8} />
              <ellipse cx={sw.bladderX - 0.5} cy={sw.bladderY - 0.5} rx={1} ry={0.7}
                fill="#6A8848" opacity={0.2} />
            </g>
          )}
        </g>
      ))}

      {/* ── Seabird tracks (V-shaped footprints) ── */}
      <g opacity={0.08}>
        {BIRD_TRACKS.map((t, i) => {
          const rad = (t.angle * Math.PI) / 180;
          const dx = Math.cos(rad) * t.size;
          const dy = Math.sin(rad) * t.size;
          const splay = 0.5;
          return (
            <g key={i}>
              <line x1={t.x} y1={t.y} x2={t.x + dx + dy * splay} y2={t.y + dy - dx * splay}
                stroke="#5A5040" strokeWidth={0.6} strokeLinecap="round" />
              <line x1={t.x} y1={t.y} x2={t.x + dx - dy * splay} y2={t.y + dy + dx * splay}
                stroke="#5A5040" strokeWidth={0.6} strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      {/* ── Sand castle remains (eroded mound) ── */}
      <g opacity={0.3}>
        {/* Main mound */}
        <ellipse cx={CASTLE_X} cy={CASTLE_Y + 8} rx={28} ry={10} fill="#B0A070" />
        {/* Tower remnant */}
        <rect x={CASTLE_X - 8} y={CASTLE_Y - 6} width={16} height={14}
          rx={3} fill="#B8A878" />
        {/* Eroded top */}
        <ellipse cx={CASTLE_X} cy={CASTLE_Y - 6} rx={10} ry={3} fill="#C0B080" />
        {/* Shadow */}
        <ellipse cx={CASTLE_X + 5} cy={CASTLE_Y + 14} rx={30} ry={4}
          fill="#6A6050" opacity={0.2} />
        {/* Moat remains (slight depression) */}
        <ellipse cx={CASTLE_X} cy={CASTLE_Y + 12} rx={35} ry={6}
          fill="none" stroke="#9A8A68" strokeWidth={0.8} opacity={0.2} />
      </g>

      {/* ── Jellyfish washed up (translucent blob) ── */}
      <g opacity={0.25}>
        {/* Body dome */}
        <ellipse cx={JELLY_X} cy={JELLY_Y} rx={12} ry={7} fill="#C0D0E0" />
        {/* Translucent inner */}
        <ellipse cx={JELLY_X} cy={JELLY_Y + 1} rx={8} ry={4} fill="#A0C0D8" opacity={0.4} />
        {/* Highlight */}
        <ellipse cx={JELLY_X - 3} cy={JELLY_Y - 2} rx={4} ry={2} fill="white" opacity={0.3} />
        {/* Tentacle traces */}
        {Array.from({ length: 5 }, (_, i) => {
          const tx = JELLY_X - 6 + i * 3;
          return (
            <path key={i}
              d={`M${tx},${JELLY_Y + 6} q${(i - 2) * 2},8 ${(i - 2) * 3},16`}
              fill="none" stroke="#A0B8C8" strokeWidth={0.5} opacity={0.3}
            />
          );
        })}
      </g>

      {/* ── Shells ── */}
      {SHELLS.map((s, i) => (
        <g key={i} opacity={0.35} transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`}>
          {s.type === 0 && (
            <ellipse cx={s.cx} cy={s.cy} rx={s.r} ry={s.r * 0.6} fill={s.color} />
          )}
          {s.type === 1 && (
            <g>
              {/* Fan shell */}
              <path d={`M${s.cx},${s.cy} L${s.cx - s.r},${s.cy + s.r * 0.8} A${s.r},${s.r * 0.6} 0 0,0 ${s.cx + s.r},${s.cy + s.r * 0.8} Z`}
                fill={s.color} />
              {/* Ridges */}
              {Array.from({ length: 3 }, (_, j) => (
                <line key={j}
                  x1={s.cx} y1={s.cy}
                  x2={s.cx + (j - 1) * s.r * 0.5} y2={s.cy + s.r * 0.7}
                  stroke="#B0A090" strokeWidth={0.3} opacity={0.3}
                />
              ))}
            </g>
          )}
          {s.type === 2 && (
            <g>
              {/* Spiral shell */}
              <ellipse cx={s.cx} cy={s.cy} rx={s.r} ry={s.r * 0.5} fill={s.color} />
              <path d={`M${s.cx + s.r * 0.3},${s.cy} a${s.r * 0.3},${s.r * 0.2} 0 1,1 -${s.r * 0.2},${s.r * 0.15}`}
                fill="none" stroke="#A09080" strokeWidth={0.4} opacity={0.3} />
            </g>
          )}
        </g>
      ))}

      {/* ── Driftwood ── */}
      {DRIFTWOOD.map((d, i) => {
        const endX = d.x + d.length * Math.cos(d.angle * Math.PI / 180);
        const endY = d.y + d.length * Math.sin(d.angle * Math.PI / 180);
        return (
          <g key={i} opacity={0.35}>
            {/* Shadow */}
            <line x1={d.x + 3} y1={d.y + 3} x2={endX + 3} y2={endY + 3}
              stroke="#5A5038" strokeWidth={d.thickness + 1} strokeLinecap="round" opacity={0.15} />
            {/* Main wood */}
            <line x1={d.x} y1={d.y} x2={endX} y2={endY}
              stroke="#6A5838" strokeWidth={d.thickness} strokeLinecap="round" />
            {/* Wood grain highlight */}
            <line x1={d.x + 2} y1={d.y - 1} x2={endX - 5} y2={endY - 1}
              stroke="#8A7848" strokeWidth={d.thickness * 0.4} strokeLinecap="round" opacity={0.4} />
          </g>
        );
      })}

      {/* ── Tiny crab near first rock ── */}
      <g opacity={0.35}>
        {(() => {
          const crabX = ROCK_OUTCROPS[0].x + ROCK_OUTCROPS[0].w + 15;
          const crabY = ROCK_OUTCROPS[0].y + ROCK_OUTCROPS[0].h * 0.7;
          const scuttle = longCycleNoise(frame * 0.15, 999) * 4;
          return (
            <g transform={`translate(${crabX + scuttle}, ${crabY})`}>
              {/* Body */}
              <ellipse cx={0} cy={0} rx={5} ry={3.5} fill="#8A5030" />
              {/* Eyes */}
              <circle cx={-2.5} cy={-3} r={0.8} fill="#1A1810" />
              <circle cx={2.5} cy={-3} r={0.8} fill="#1A1810" />
              {/* Claws */}
              <path d="M-5,0 L-8,-2 L-6,-1" fill="none" stroke="#8A5030" strokeWidth={0.8} strokeLinecap="round" />
              <path d="M5,0 L8,-2 L6,-1" fill="none" stroke="#8A5030" strokeWidth={0.8} strokeLinecap="round" />
              {/* Legs (3 per side) */}
              {Array.from({ length: 3 }, (_, li) => (
                <g key={li}>
                  <line x1={-4} y1={1 + li * 1.2} x2={-7} y2={2 + li * 1.5}
                    stroke="#7A4828" strokeWidth={0.5} />
                  <line x1={4} y1={1 + li * 1.2} x2={7} y2={2 + li * 1.5}
                    stroke="#7A4828" strokeWidth={0.5} />
                </g>
              ))}
            </g>
          );
        })()}
      </g>

      {/* ── Beach grass tufts at top of beach ── */}
      <SurfaceScatter elements={BEACH_GRASS} frame={frame} renderElement={renderGrassBlade} />

      {/* ── Extra thick grass clumps (foreground interest) ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const gx = 80 + i * 250;
        const gy = 980 + (i % 3) * 20;
        const sway = longCycleNoise(frame * 0.5, i * 47 + 800) * 6;
        return (
          <g key={i} opacity={0.45}>
            {Array.from({ length: 7 }, (_, j) => {
              const bladeAngle = -25 + j * 8 + sway;
              const bladeH = 18 + j * 2.5;
              const rad = (bladeAngle * Math.PI) / 180;
              return (
                <line key={j}
                  x1={gx + (j - 3) * 2} y1={gy}
                  x2={gx + (j - 3) * 2 + Math.sin(rad) * bladeH}
                  y2={gy - Math.cos(rad) * bladeH}
                  stroke={j % 2 === 0 ? '#5A7038' : '#4A6028'}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      })}

      {/* ── Wind-blown sand particles near surface ── */}
      {SAND_PARTICLES.map((p, i) => {
        const windX = longCycleNoise(frame * p.speed, p.seed) * 40;
        const windY = longCycleNoise(frame * p.speed * 0.7, p.seed + 50) * 6;
        const particleOp = 0.05 + Math.max(0, longCycleNoise(frame * 0.4, p.seed + 200)) * 0.08;
        return (
          <circle key={i}
            cx={p.baseX + windX}
            cy={p.baseY + windY}
            r={p.size}
            fill="#C8B888"
            opacity={particleOp}
          />
        );
      })}

      {/* ── Painterly texture overlays ── */}
      <TerrainTexture id={`${ID}-sand`} y={WET_SAND_END} height={300} color="#7A6840" opacity={0.02} seed={4001} />
      <TerrainTexture id={`${ID}-water`} y={HORIZON} height={200} color="#2A4058" opacity={0.015} seed={4002} />

      {/* ── Sea spray mist near waterline ── */}
      <GroundMist id={`${ID}-spray`} y={WAVE_BREAK - 30} color="#C8D8E0" opacity={0.06} frame={frame} count={5} seed={4501} />

      {/* ── Light atmospheric haze over entire scene ── */}
      <rect x={0} y={HORIZON - 50} width={1920} height={200} fill="#8AA8B8" opacity={0.03} />

      {/* ── Bottom vignette darken ── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="85%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default SeaShore;
