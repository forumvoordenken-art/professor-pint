/**
 * PubBuilding — Two-story brick pub with pitched roof, windows, door, sign
 *
 * Details:
 *  - Brick facade with individual brick pattern
 *  - Pitched roof with chimney (left side)
 *  - Central wooden door with frame
 *  - 6 windows (3 per floor) with warm interior glow
 *  - Hanging pub sign (left, with beer mug icon)
 *  - Two wall lanterns flanking the door
 *  - Window boxes with plants (ground floor)
 *  - "THE PAINTED PINT" text above door
 *
 * Aspect ratio: ~600w × 700h (portrait-ish building)
 * Category: structure
 */

import React from 'react';

interface PubBuildingProps {
  frame: number;
  width?: number;
  height?: number;
}

const sin = (f: number, freq: number, phase = 0) =>
  Math.sin(f * freq * Math.PI * 2 + phase);

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Pre-generate brick pattern
interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

const BRICK_COLORS = [
  '#7a3828', '#843c2c', '#6e3224', '#8a4030', '#743628',
  '#7e3a2a', '#883e2e', '#723426', '#804030', '#763828',
  '#6a3020', '#8c4232', '#703222', '#823c2c', '#783a28',
];

const generateBricks = (
  sx: number, sy: number,
  bw: number, bh: number,
  cols: number, rows: number,
  seed: number,
): Brick[] => {
  const bricks: Brick[] = [];
  const gap = 2;
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : bw * 0.5;
    for (let col = -1; col < cols + 1; col++) {
      const s = seed + row * 100 + col;
      bricks.push({
        x: sx + col * (bw + gap) + offset + rand(s) * 2 - 1,
        y: sy + row * (bh + gap) + rand(s + 1) * 1 - 0.5,
        w: bw + rand(s + 2) * 3 - 1.5,
        h: bh + rand(s + 3) * 1 - 0.5,
        color: BRICK_COLORS[Math.floor(rand(s + 4) * BRICK_COLORS.length)],
      });
    }
  }
  return bricks;
};

// Building dimensions (in local coordinate space 600×700)
const W = 600;
const H = 700;
const ROOF_PEAK = 60;
const ROOF_BASE = 160;
const WALL_TOP = ROOF_BASE;
const WALL_BOTTOM = H;
const WALL_LEFT = 40;
const WALL_RIGHT = W - 40;
const WALL_W = WALL_RIGHT - WALL_LEFT;

// Generate bricks for the wall
const BRICKS = generateBricks(WALL_LEFT, WALL_TOP, 28, 12, 20, 40, 77);

// Window configuration
const WINDOWS = [
  // Upper floor (3 windows)
  { x: 130, y: 210, w: 70, h: 90 },
  { x: 265, y: 210, w: 70, h: 90 },
  { x: 400, y: 210, w: 70, h: 90 },
  // Ground floor (2 windows, door is in the middle)
  { x: 110, y: 430, w: 80, h: 100 },
  { x: 410, y: 430, w: 80, h: 100 },
];

export const PubBuilding: React.FC<PubBuildingProps> = ({ frame }) => {
  // Window glow flicker (warm, inviting)
  const glowFlicker =
    0.88 +
    sin(frame, 0.035, 0) * 0.05 +
    sin(frame, 0.08, 1.3) * 0.04 +
    sin(frame, 0.14, 2.7) * 0.03;

  // Lantern flicker (slightly different rhythm)
  const lanternFlicker =
    0.85 +
    sin(frame, 0.04, 0.5) * 0.06 +
    sin(frame, 0.09, 2.0) * 0.05 +
    sin(frame, 0.16, 3.5) * 0.04;

  // Sign sway (very subtle wind)
  const signSway = sin(frame, 0.012, 0) * 1.5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        {/* Roof gradient */}
        <linearGradient id="pub-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="40%" stopColor="#353535" />
          <stop offset="100%" stopColor="#404040" />
        </linearGradient>

        {/* Window glow */}
        <radialGradient id="window-glow-inner" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFD060" />
          <stop offset="40%" stopColor="#FFAA30" />
          <stop offset="100%" stopColor="#CC7010" />
        </radialGradient>

        {/* Door wood */}
        <linearGradient id="door-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a2a12" />
          <stop offset="30%" stopColor="#5a3418" />
          <stop offset="70%" stopColor="#4e2c14" />
          <stop offset="100%" stopColor="#422410" />
        </linearGradient>

        {/* Lantern glow */}
        <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD580" stopOpacity={0.8} />
          <stop offset="30%" stopColor="#FFAA33" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </radialGradient>

        {/* Sign board */}
        <linearGradient id="sign-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a0a" />
          <stop offset="50%" stopColor="#3a2510" />
          <stop offset="100%" stopColor="#2a1a0a" />
        </linearGradient>

        {/* Window box */}
        <linearGradient id="windowbox-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3a1a" />
          <stop offset="100%" stopColor="#3a2210" />
        </linearGradient>
      </defs>

      {/* === ROOF === */}
      {/* Main roof shape */}
      <polygon
        points={`${W / 2},${ROOF_PEAK} ${WALL_LEFT - 15},${ROOF_BASE} ${WALL_RIGHT + 15},${ROOF_BASE}`}
        fill="url(#pub-roof)"
      />
      {/* Roof tiles — horizontal lines suggesting rows */}
      {Array.from({ length: 7 }, (_, i) => {
        const y = ROOF_PEAK + 14 + i * 14;
        const progress = (y - ROOF_PEAK) / (ROOF_BASE - ROOF_PEAK);
        const halfW = (WALL_W / 2 + 15) * progress;
        return (
          <line
            key={`tile-${i}`}
            x1={W / 2 - halfW}
            y1={y}
            x2={W / 2 + halfW}
            y2={y}
            stroke="#2a2a2a"
            strokeWidth={1.5}
            opacity={0.5}
          />
        );
      })}
      {/* Roof ridge */}
      <line
        x1={W / 2 - 3}
        y1={ROOF_PEAK}
        x2={W / 2 + 3}
        y2={ROOF_PEAK}
        stroke="#4a4a4a"
        strokeWidth={6}
        strokeLinecap="round"
      />

      {/* === CHIMNEY === */}
      <rect x={130} y={70} width={40} height={95} fill="#6a3020" />
      <rect x={126} y={65} width={48} height={12} fill="#5a2818" rx={2} />
      {/* Chimney bricks */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line
          key={`chim-${i}`}
          x1={132}
          y1={80 + i * 14}
          x2={168}
          y2={80 + i * 14}
          stroke="#5a2818"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}

      {/* === BRICK WALL === */}
      {/* Wall base color */}
      <rect
        x={WALL_LEFT}
        y={WALL_TOP}
        width={WALL_W}
        height={WALL_BOTTOM - WALL_TOP}
        fill="#7a3828"
      />
      {/* Individual bricks */}
      {BRICKS.map((b, i) => (
        <rect
          key={`brick-${i}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={b.color}
          rx={0.5}
          clipPath={`polygon(${WALL_LEFT}px ${WALL_TOP}px, ${WALL_RIGHT}px ${WALL_TOP}px, ${WALL_RIGHT}px ${WALL_BOTTOM}px, ${WALL_LEFT}px ${WALL_BOTTOM}px)`}
        />
      ))}
      {/* Wall clip — hide bricks outside wall */}
      <rect x={0} y={WALL_TOP} width={WALL_LEFT} height={WALL_BOTTOM - WALL_TOP} fill="#0a0e1a" />
      <rect x={WALL_RIGHT} y={WALL_TOP} width={W - WALL_RIGHT} height={WALL_BOTTOM - WALL_TOP} fill="#0a0e1a" />

      {/* === HORIZONTAL BANDS (between floors) === */}
      <rect x={WALL_LEFT} y={385} width={WALL_W} height={12} fill="#5a3018" />
      <rect x={WALL_LEFT} y={385} width={WALL_W} height={2} fill="#6a3a20" opacity={0.6} />

      {/* === FOUNDATION === */}
      <rect x={WALL_LEFT - 5} y={WALL_BOTTOM - 30} width={WALL_W + 10} height={30} fill="#3a3a42" />

      {/* === WINDOWS === */}
      {WINDOWS.map((w, i) => {
        const flicker = glowFlicker + sin(frame, 0.05, i * 1.7) * 0.03;
        return (
          <g key={`win-${i}`}>
            {/* Window frame (dark wood) */}
            <rect x={w.x - 4} y={w.y - 4} width={w.w + 8} height={w.h + 8} fill="#2a1a0a" rx={3} />
            {/* Window sill */}
            <rect x={w.x - 8} y={w.y + w.h} width={w.w + 16} height={8} fill="#3a2510" rx={1} />
            {/* Window glow */}
            <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="url(#window-glow-inner)" opacity={flicker} rx={1} />
            {/* Window cross bars */}
            <line x1={w.x + w.w / 2} y1={w.y} x2={w.x + w.w / 2} y2={w.y + w.h} stroke="#2a1a0a" strokeWidth={3} />
            <line x1={w.x} y1={w.y + w.h / 2} x2={w.x + w.w} y2={w.y + w.h / 2} stroke="#2a1a0a" strokeWidth={3} />
            {/* Window curtain suggestion (darker at edges) */}
            <rect x={w.x} y={w.y} width={12} height={w.h} fill="#8B4513" opacity={0.3} />
            <rect x={w.x + w.w - 12} y={w.y} width={12} height={w.h} fill="#8B4513" opacity={0.3} />
          </g>
        );
      })}

      {/* === DOOR === */}
      <g>
        {/* Door frame */}
        <rect x={255} y={420} width={90} height={140} fill="#2a1a0a" rx={4} />
        {/* Door arch top */}
        <ellipse cx={300} cy={425} rx={42} ry={15} fill="#2a1a0a" />
        {/* Door body */}
        <rect x={260} y={430} width={80} height={130} fill="url(#door-wood)" rx={2} />
        {/* Door panels */}
        <rect x={268} y={440} width={30} height={45} fill="#3a2010" rx={2} stroke="#4a2a12" strokeWidth={1} />
        <rect x={302} y={440} width={30} height={45} fill="#3a2010" rx={2} stroke="#4a2a12" strokeWidth={1} />
        <rect x={268} y={495} width={30} height={55} fill="#3a2010" rx={2} stroke="#4a2a12" strokeWidth={1} />
        <rect x={302} y={495} width={30} height={55} fill="#3a2010" rx={2} stroke="#4a2a12" strokeWidth={1} />
        {/* Door handle */}
        <circle cx={328} cy={505} r={4} fill="#C8A860" />
        <circle cx={328} cy={505} r={2.5} fill="#A08840" />
        {/* Door step */}
        <rect x={250} y={558} width={100} height={10} fill="#4a4a52" rx={1} />
        {/* Door light spill on ground */}
        <ellipse cx={300} cy={570} rx={60} ry={8} fill="#FFD060" opacity={0.08 * glowFlicker} />
      </g>

      {/* === "THE PAINTED PINT" TEXT ABOVE DOOR === */}
      <rect x={225} y={400} width={150} height={20} fill="#2a1a0a" rx={2} />
      <text
        x={300}
        y={415}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={11}
        fontWeight={700}
        fill="#D4A850"
        letterSpacing={2}
      >
        THE PAINTED PINT
      </text>

      {/* === WALL LANTERNS === */}
      {[238, 352].map((lx, i) => (
        <g key={`lantern-${i}`}>
          {/* Bracket */}
          <rect x={lx} y={445} width={3} height={15} fill="#3a3a3a" />
          <rect x={lx - 2} y={442} width={7} height={3} fill="#4a4a4a" />
          {/* Lantern housing */}
          <rect x={lx - 5} y={455} width={13} height={18} fill="#3a3a3a" rx={1} />
          <rect x={lx - 4} y={457} width={11} height={14} fill="#FFD060" opacity={0.7 * lanternFlicker} rx={1} />
          {/* Lantern cap */}
          <polygon points={`${lx - 6},${455} ${lx + 7},${455} ${lx + 1},${449}`} fill="#3a3a3a" />
          {/* Glow */}
          <ellipse cx={lx + 1} cy={465} rx={25} ry={30} fill="url(#lantern-glow)" opacity={0.5 * lanternFlicker} />
        </g>
      ))}

      {/* === WINDOW BOXES (ground floor windows) === */}
      {[110, 410].map((bx, i) => (
        <g key={`box-${i}`}>
          {/* Box */}
          <rect x={bx - 5} y={530} width={90} height={22} fill="url(#windowbox-grad)" rx={2} />
          {/* Plants — simple leaf shapes */}
          {Array.from({ length: 6 }, (_, j) => {
            const px = bx + 5 + j * 13;
            const lean = sin(frame, 0.008, i * 2 + j * 0.5) * 3;
            const ph = 10 + rand(i * 10 + j) * 12;
            return (
              <g key={`plant-${i}-${j}`} transform={`rotate(${lean}, ${px}, 530)`}>
                <line x1={px} y1={530} x2={px} y2={530 - ph} stroke="#2a5a20" strokeWidth={1.5} />
                <ellipse cx={px - 4} cy={530 - ph + 3} rx={5} ry={3} fill="#3a7a30" opacity={0.8} />
                <ellipse cx={px + 3} cy={530 - ph + 6} rx={4} ry={3} fill="#2a6a25" opacity={0.7} />
              </g>
            );
          })}
          {/* Occasional flower */}
          <circle cx={bx + 20} cy={515} r={3} fill="#cc4466" opacity={0.8} />
          <circle cx={bx + 55} cy={517} r={2.5} fill="#dd6688" opacity={0.7} />
        </g>
      ))}

      {/* === PUB SIGN (hanging left) === */}
      <g transform={`rotate(${signSway}, 90, 280)`}>
        {/* Bracket arm */}
        <rect x={42} y={278} width={55} height={4} fill="#3a3a3a" rx={1} />
        {/* Bracket mounting */}
        <rect x={40} y={268} width={6} height={25} fill="#4a4a4a" />
        {/* Chains */}
        <line x1={65} y1={282} x2={65} y2={295} stroke="#5a5a5a" strokeWidth={1.5} />
        <line x1={95} y1={282} x2={95} y2={295} stroke="#5a5a5a" strokeWidth={1.5} />
        {/* Sign board (oval) */}
        <ellipse cx={80} cy={330} rx={35} ry={32} fill="url(#sign-board)" stroke="#5a3a18" strokeWidth={2} />
        {/* Beer mug icon */}
        <rect x={70} y={318} width={16} height={20} rx={2} fill="#D4A850" opacity={0.8} />
        <rect x={86} y={322} width={5} height={12} rx={2} fill="#D4A850" opacity={0.6} />
        {/* Foam */}
        <ellipse cx={78} cy={319} rx={10} ry={4} fill="#F0E8D0" opacity={0.8} />
        {/* Sign text */}
        <text x={80} y={350} textAnchor="middle" fontFamily="Georgia, serif" fontSize={6} fill="#C8A040" fontWeight={700}>
          PUB
        </text>
      </g>

      {/* === AMBIENT DETAILS === */}
      {/* Drainpipe left */}
      <rect x={WALL_LEFT + 3} y={ROOF_BASE} width={5} height={WALL_BOTTOM - ROOF_BASE} fill="#4a4a4a" opacity={0.5} />
      {/* Drainpipe right */}
      <rect x={WALL_RIGHT - 8} y={ROOF_BASE} width={5} height={WALL_BOTTOM - ROOF_BASE} fill="#4a4a4a" opacity={0.5} />

      {/* Wall stains / weathering */}
      <ellipse cx={150} cy={500} rx={30} ry={50} fill="#5a2818" opacity={0.15} />
      <ellipse cx={450} cy={350} rx={25} ry={40} fill="#5a2818" opacity={0.12} />
    </svg>
  );
};

export default PubBuilding;
