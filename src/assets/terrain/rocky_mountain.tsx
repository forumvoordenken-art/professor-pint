/**
 * rocky_mountain — Rotsachtig bergterrein, ruig.
 *
 * Oorlog, expedities, geologische periodes, vulkanen.
 * Dramatic rocky terrain with jagged peaks, snow caps, boulders,
 * cliff faces with strata, cave openings, lichen, scree slopes,
 * and circling eagles. Oil painting style.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  GroundMist,
  TerrainTexture,
  seededRandom,
  longCycleNoise,
} from './TerrainEngine';

const ID = 'rocky-mountain';
const HORIZON = 450;

const GROUND_STOPS = [
  { offset: '0%', color: '#686058' },
  { offset: '15%', color: '#5E5648' },
  { offset: '35%', color: '#545040' },
  { offset: '55%', color: '#4A4438' },
  { offset: '75%', color: '#403830' },
  { offset: '100%', color: '#322A20' },
];

// ─── Far mountain layer (most distant, blue-grey) ────────
const FAR_PEAKS_PATH =
  'M0,1080 L0,400 L60,420 L120,380 L200,410 L260,350 L340,390 L400,320 ' +
  'L480,370 L540,310 L620,360 L700,290 L780,340 L850,300 L920,350 ' +
  'L1000,280 L1080,330 L1140,290 L1220,340 L1300,270 L1380,320 ' +
  'L1440,360 L1520,300 L1600,340 L1680,310 L1760,360 L1840,330 ' +
  'L1920,370 L1920,1080 Z';

// ─── Mid mountain layer (medium distance, grey-brown) ────
const MID_PEAKS_PATH =
  'M0,1080 L0,470 L80,440 L160,480 L240,420 L320,460 L440,380 ' +
  'L520,430 L600,390 L680,450 L760,370 L840,420 L960,360 ' +
  'L1060,410 L1140,380 L1240,440 L1340,370 L1420,420 L1520,380 ' +
  'L1600,430 L1700,390 L1800,440 L1920,410 L1920,1080 Z';

// ─── Near mountain ridge (closest peaks, darker) ─────────
const NEAR_RIDGE_PATH =
  'M0,1080 L0,530 L100,510 L180,540 L280,490 L380,530 L460,470 ' +
  'L560,520 L640,480 L740,540 L840,470 L920,510 L1020,480 ' +
  'L1120,530 L1200,470 L1320,520 L1420,490 L1520,540 L1620,500 ' +
  'L1720,530 L1820,510 L1920,540 L1920,1080 Z';

// ─── Snow cap polygons on far peaks ──────────────────────
const SNOW_CAPS = [
  { points: '260,350 300,375 220,372', opacity: 0.55 },
  { points: '540,310 585,338 495,335', opacity: 0.6 },
  { points: '700,290 755,322 650,318', opacity: 0.65 },
  { points: '1000,280 1055,310 945,308', opacity: 0.6 },
  { points: '1300,270 1360,305 1245,300', opacity: 0.7 },
  { points: '400,320 435,342 365,340', opacity: 0.45 },
  { points: '1520,300 1565,328 1478,325', opacity: 0.5 },
  { points: '850,300 888,325 812,322', opacity: 0.55 },
];

// ─── Snow patches on mid peaks ───────────────────────────
const MID_SNOW = [
  { points: '440,380 478,400 402,398', opacity: 0.35 },
  { points: '760,370 800,395 722,392', opacity: 0.4 },
  { points: '960,360 1005,388 920,385', opacity: 0.35 },
  { points: '1340,370 1380,395 1302,392', opacity: 0.38 },
];

// ─── Rock face / cliff section (vertical wall) ──────────
const CLIFF_X = 800;
const CLIFF_TOP = 520;
const CLIFF_BOTTOM = 780;
const CLIFF_WIDTH = 220;

// ─── Strata lines on cliff face ─────────────────────────
const rng = seededRandom(2501);
const STRATA_LINES = Array.from({ length: 14 }, (_, i) => {
  const y = CLIFF_TOP + 15 + i * ((CLIFF_BOTTOM - CLIFF_TOP - 30) / 14);
  const wobble1 = (rng() - 0.5) * 12;
  const wobble2 = (rng() - 0.5) * 12;
  return {
    d: `M${CLIFF_X},${y + wobble1} Q${CLIFF_X + CLIFF_WIDTH / 2},${y + wobble2} ${CLIFF_X + CLIFF_WIDTH},${y + wobble1 * 0.5}`,
    opacity: 0.06 + rng() * 0.08,
    width: 0.6 + rng() * 1.0,
  };
});

// ─── Cave / overhang opening ─────────────────────────────
const CAVE_X = 880;
const CAVE_Y = 680;

// ─── Boulders (mid-ground and foreground) ────────────────
const BOULDERS = Array.from({ length: 12 }, () => ({
  cx: rng() * 1920,
  cy: 600 + rng() * 420,
  rx: 18 + rng() * 55,
  ry: 12 + rng() * 38,
  color: ['#585048', '#686058', '#504840', '#686860', '#5A5248', '#605850'][Math.floor(rng() * 6)],
  angle: (rng() - 0.5) * 25,
  highlight: 0.04 + rng() * 0.06,
}));

// ─── Rock scree / debris slopes ──────────────────────────
const SCREE = Array.from({ length: 50 }, () => ({
  cx: 600 + rng() * 700,
  cy: 540 + rng() * 200,
  rx: 2 + rng() * 6,
  ry: 1.5 + rng() * 4,
  angle: rng() * 360,
  color: ['#5A5248', '#686058', '#4A4238'][Math.floor(rng() * 3)],
  opacity: 0.2 + rng() * 0.3,
}));

// ─── Fallen rock debris at cliff base ────────────────────
const DEBRIS = Array.from({ length: 20 }, () => ({
  cx: CLIFF_X - 30 + rng() * (CLIFF_WIDTH + 60),
  cy: CLIFF_BOTTOM + rng() * 50,
  rx: 3 + rng() * 10,
  ry: 2 + rng() * 7,
  angle: rng() * 360,
  opacity: 0.25 + rng() * 0.25,
}));

// ─── Rock crack networks ─────────────────────────────────
const CRACK_NETWORKS = Array.from({ length: 18 }, () => {
  const x = rng() * 1920;
  const y = 550 + rng() * 440;
  const segs = 2 + Math.floor(rng() * 4);
  let path = `M${x},${y}`;
  for (let j = 0; j < segs; j++) {
    path += ` l${(rng() - 0.5) * 45},${rng() * 35}`;
    if (rng() > 0.6) {
      path += ` m${(rng() - 0.5) * 10},${rng() * 8}`;
      path += ` l${(rng() - 0.5) * 20},${rng() * 15}`;
    }
  }
  return { path, opacity: 0.08 + rng() * 0.1, width: 0.5 + rng() * 0.8 };
});

// ─── Lichen/moss patches ─────────────────────────────────
const LICHEN = Array.from({ length: 14 }, () => ({
  cx: rng() * 1920,
  cy: 580 + rng() * 420,
  rx: 5 + rng() * 14,
  ry: 3 + rng() * 10,
  color: ['#4A6838', '#5A7040', '#6A7830', '#3A5828', '#748838'][Math.floor(rng() * 5)],
  opacity: 0.12 + rng() * 0.18,
}));

// ─── Alpine plant clumps in crevices ─────────────────────
const ALPINE_PLANTS = Array.from({ length: 10 }, () => ({
  x: rng() * 1920,
  y: 560 + rng() * 350,
  size: 4 + rng() * 8,
  color: ['#3A5820', '#4A6830', '#2A4818'][Math.floor(rng() * 3)],
}));

// ─── Mountain goat path (faint trail) ────────────────────
const GOAT_PATH_POINTS: string[] = [];
let gpX = 650;
let gpY = 540;
for (let i = 0; i < 12; i++) {
  gpX += 25 + rng() * 40;
  gpY += -8 + rng() * 16;
  GOAT_PATH_POINTS.push(`${gpX},${gpY}`);
}
const GOAT_PATH = `M${GOAT_PATH_POINTS[0]} ${GOAT_PATH_POINTS.slice(1).map((p, i) => {
  const [px, py] = p.split(',');
  return `L${px},${py}`;
}).join(' ')}`;

// ─── Ice/water streak on rock face ───────────────────────
const ICE_STREAK_PATH =
  `M${CLIFF_X + 90},${CLIFF_TOP + 20} q5,40 -3,80 q-4,35 2,70 q3,30 -2,55`;

export const RockyMountain: React.FC<AssetProps> = ({ frame }) => {
  const eagleAngle = longCycleNoise(frame * 0.15, 777) * Math.PI * 2;
  const eagleCx = 960 + Math.cos(eagleAngle) * 200;
  const eagleCy = 300 + Math.sin(eagleAngle * 0.7) * 60;
  const eagleBank = longCycleNoise(frame * 0.2, 778) * 15;
  const mistBetweenPeaks = 0.08 + Math.max(0, longCycleNoise(frame * 0.06, 333)) * 0.08;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Atmospheric haze at horizon ── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 120} height={240} color="#7888A0" opacity={0.4} />

      {/* ── Far mountain layer (blue atmospheric) ── */}
      <path d={FAR_PEAKS_PATH} fill="#5A6878" opacity={0.5} />

      {/* ── Snow caps on far peaks ── */}
      <g>
        {SNOW_CAPS.map((s, i) => (
          <polygon key={i} points={s.points} fill="#D8E0E8" opacity={s.opacity} />
        ))}
      </g>

      {/* ── Mountain fog layer between far and mid peaks ── */}
      <defs>
        <linearGradient id={`${ID}-peakfog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8898B0" stopOpacity={0} />
          <stop offset="40%" stopColor="#8898B0" stopOpacity={mistBetweenPeaks} />
          <stop offset="70%" stopColor="#8898B0" stopOpacity={mistBetweenPeaks * 0.7} />
          <stop offset="100%" stopColor="#8898B0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={340} width={1920} height={140} fill={`url(#${ID}-peakfog)`} />

      {/* ── Mid mountain layer ── */}
      <path d={MID_PEAKS_PATH} fill="#5A5848" opacity={0.65} />

      {/* ── Snow on mid peaks ── */}
      <g>
        {MID_SNOW.map((s, i) => (
          <polygon key={i} points={s.points} fill="#C8D4E0" opacity={s.opacity} />
        ))}
      </g>

      {/* ── Strong shadows on north-facing slopes (left sides of peaks) ── */}
      <g opacity={0.12}>
        <polygon points="440,380 400,460 440,460" fill="#1A1810" />
        <polygon points="960,360 920,440 960,440" fill="#1A1810" />
        <polygon points="1340,370 1300,450 1340,450" fill="#1A1810" />
        <polygon points="240,420 200,490 240,490" fill="#1A1810" />
        <polygon points="760,370 720,450 760,450" fill="#1A1810" />
      </g>

      {/* ── Near mountain ridge ── */}
      <path d={NEAR_RIDGE_PATH} fill="#4E4840" opacity={0.75} />

      {/* ── Rock scree / debris on slopes ── */}
      <g>
        {SCREE.map((s, i) => (
          <ellipse
            key={i}
            cx={s.cx}
            cy={s.cy}
            rx={s.rx}
            ry={s.ry}
            fill={s.color}
            opacity={s.opacity}
            transform={`rotate(${s.angle}, ${s.cx}, ${s.cy})`}
          />
        ))}
      </g>

      {/* ── Base ground plane ── */}
      <GroundPlane id={ID} horizonY={580} stops={GROUND_STOPS} />

      {/* ── Rock face / cliff section ── */}
      <rect
        x={CLIFF_X}
        y={CLIFF_TOP}
        width={CLIFF_WIDTH}
        height={CLIFF_BOTTOM - CLIFF_TOP}
        fill="#4A4438"
        opacity={0.85}
      />
      {/* Cliff highlight (left edge catches light) */}
      <rect
        x={CLIFF_X}
        y={CLIFF_TOP}
        width={8}
        height={CLIFF_BOTTOM - CLIFF_TOP}
        fill="#8A8070"
        opacity={0.15}
      />
      {/* Cliff deep shadow (right edge) */}
      <rect
        x={CLIFF_X + CLIFF_WIDTH - 6}
        y={CLIFF_TOP}
        width={6}
        height={CLIFF_BOTTOM - CLIFF_TOP}
        fill="#1A1810"
        opacity={0.2}
      />

      {/* ── Strata lines on cliff face ── */}
      {STRATA_LINES.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke="#3A3228"
          strokeWidth={s.width}
          opacity={s.opacity}
        />
      ))}

      {/* ── Cave / overhang opening ── */}
      <g>
        <ellipse cx={CAVE_X} cy={CAVE_Y} rx={28} ry={18} fill="#0E0C08" opacity={0.9} />
        <ellipse cx={CAVE_X} cy={CAVE_Y - 3} rx={30} ry={8} fill="#3A3228" opacity={0.6} />
        {/* Shadow depth inside cave */}
        <ellipse cx={CAVE_X} cy={CAVE_Y + 4} rx={20} ry={10} fill="#060404" opacity={0.7} />
        {/* Rock overhang lip */}
        <path
          d={`M${CAVE_X - 35},${CAVE_Y - 12} Q${CAVE_X},${CAVE_Y - 22} ${CAVE_X + 35},${CAVE_Y - 12}`}
          fill="none"
          stroke="#5A5248"
          strokeWidth={3}
          opacity={0.5}
        />
      </g>

      {/* ── Ice/water streak on rock face ── */}
      <path
        d={ICE_STREAK_PATH}
        fill="none"
        stroke="#A0C0D8"
        strokeWidth={1.8}
        opacity={0.2}
        strokeLinecap="round"
      />
      <path
        d={ICE_STREAK_PATH}
        fill="none"
        stroke="#D0E8F0"
        strokeWidth={0.6}
        opacity={0.15}
        strokeLinecap="round"
      />

      {/* ── Mountain goat path (faint winding trail) ── */}
      <path
        d={GOAT_PATH}
        fill="none"
        stroke="#6A6258"
        strokeWidth={2.5}
        opacity={0.08}
        strokeLinecap="round"
        strokeDasharray="8,12"
      />

      {/* ── Rock strata lines across ground ── */}
      <g opacity={0.07}>
        {Array.from({ length: 8 }, (_, i) => {
          const y = 600 + i * 50;
          const wobble = longCycleNoise(frame * 0.02, i * 19 + 500) * 3;
          return (
            <line
              key={i}
              x1={0}
              y1={y + wobble}
              x2={1920}
              y2={y + (i % 2 === 0 ? 6 : -4) + wobble}
              stroke="#3A3228"
              strokeWidth={1.2 + (i % 3) * 0.4}
            />
          );
        })}
      </g>

      {/* ── Rock crack networks ── */}
      {CRACK_NETWORKS.map((c, i) => (
        <path
          key={i}
          d={c.path}
          fill="none"
          stroke="#2A2218"
          strokeWidth={c.width}
          opacity={c.opacity}
          strokeLinecap="round"
        />
      ))}

      {/* ── Boulders with highlight and shadow ── */}
      {BOULDERS.map((b, i) => (
        <g key={i}>
          {/* Boulder shadow on ground */}
          <ellipse
            cx={b.cx + 5}
            cy={b.cy + b.ry * 0.85}
            rx={b.rx * 0.9}
            ry={b.ry * 0.25}
            fill="#1A1810"
            opacity={0.12}
          />
          {/* Main boulder body */}
          <ellipse
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={b.color}
            transform={`rotate(${b.angle}, ${b.cx}, ${b.cy})`}
          />
          {/* Highlight on upper-left */}
          <ellipse
            cx={b.cx - b.rx * 0.25}
            cy={b.cy - b.ry * 0.3}
            rx={b.rx * 0.5}
            ry={b.ry * 0.4}
            fill="white"
            opacity={b.highlight}
            transform={`rotate(${b.angle}, ${b.cx}, ${b.cy})`}
          />
          {/* Dark edge on lower-right */}
          <ellipse
            cx={b.cx + b.rx * 0.2}
            cy={b.cy + b.ry * 0.25}
            rx={b.rx * 0.6}
            ry={b.ry * 0.5}
            fill="#1A1810"
            opacity={0.08}
            transform={`rotate(${b.angle + 10}, ${b.cx}, ${b.cy})`}
          />
        </g>
      ))}

      {/* ── Fallen rock debris at cliff base ── */}
      {DEBRIS.map((d, i) => (
        <ellipse
          key={i}
          cx={d.cx}
          cy={d.cy}
          rx={d.rx}
          ry={d.ry}
          fill="#504840"
          opacity={d.opacity}
          transform={`rotate(${d.angle}, ${d.cx}, ${d.cy})`}
        />
      ))}

      {/* ── Lichen/moss patches on rocks ── */}
      {LICHEN.map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.rx}
          ry={l.ry}
          fill={l.color}
          opacity={l.opacity}
        />
      ))}

      {/* ── Alpine plant clumps in crevices ── */}
      {ALPINE_PLANTS.map((p, i) => {
        const sway = longCycleNoise(frame * 0.4, i * 23 + 600) * 3;
        return (
          <g key={i} opacity={0.4}>
            {/* Multiple tiny leaf strokes */}
            {Array.from({ length: 5 }, (_, j) => {
              const angle = -40 + j * 20 + sway;
              const len = p.size * (0.6 + (j % 3) * 0.2);
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={j}
                  x1={p.x}
                  y1={p.y}
                  x2={p.x + Math.sin(rad) * len}
                  y2={p.y - Math.cos(rad) * len}
                  stroke={p.color}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      })}

      {/* ── Eagle / bird silhouette circling ── */}
      <g
        transform={`translate(${eagleCx}, ${eagleCy}) rotate(${eagleBank})`}
        opacity={0.35}
      >
        <path
          d="M0,0 L-18,-4 L-28,2 M0,0 L18,-4 L28,2"
          fill="none"
          stroke="#1A1810"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </g>
      {/* Second smaller bird further away */}
      <g
        transform={`translate(${eagleCx + 120}, ${eagleCy - 40}) rotate(${-eagleBank * 0.7}) scale(0.6)`}
        opacity={0.2}
      >
        <path
          d="M0,0 L-18,-4 L-28,2 M0,0 L18,-4 L28,2"
          fill="none"
          stroke="#1A1810"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </g>

      {/* ── Painterly texture overlay ── */}
      <TerrainTexture id={ID} y={HORIZON} height={630} color="#1A1810" opacity={0.025} seed={3601} />
      <TerrainTexture id={`${ID}-2`} y={HORIZON - 100} height={200} color="#5A6878" opacity={0.015} seed={3602} />

      {/* ── Mountain mist between peaks and foreground ── */}
      <GroundMist id={`${ID}-mid`} y={520} color="#7888A0" opacity={0.1} frame={frame} count={4} seed={4502} />
      <GroundMist id={ID} y={920} color="#6A7080" opacity={0.12} frame={frame} count={5} seed={4501} />

      {/* ── Cool atmospheric color grade ── */}
      <rect x={0} y={0} width={1920} height={HORIZON + 100} fill="#4060A0" opacity={0.03} />

      {/* ── Bottom vignette darken ── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="80%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default RockyMountain;
