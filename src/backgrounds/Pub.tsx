import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

interface PubProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  wall: '#3D2B1F',
  wallAccent: '#4A3628',
  wallMolding: '#5C3A20',
  floor: '#5C3A1E',
  floorDark: '#4A2E14',
  bar: '#6B3A2A',
  barTop: '#8B5A3A',
  barTopShine: 'rgba(255,220,160,0.12)',
  barFront: '#5C2E1E',
  barTrim: '#7A4A32',
  barPanel: '#4E2518',
  shelf: '#5C3218',
  shelfFront: '#6B3A20',
  glass: 'rgba(200,220,240,0.35)',
  glassShine: 'rgba(255,255,255,0.25)',
  stool: '#3A2010',
  stoolSeat: '#6B4528',
  stoolMetal: '#888888',
  chalkboard: '#2A3A2A',
  chalkFrame: '#4A2A1A',
  chalk: '#E8E8D8',
  lampShade: '#B8890F',
  lampChain: '#5A5A5A',
  tapBase: '#444444',
  tapHandle: '#C0C0C0',
  tapAccent1: '#2D5016',
  tapAccent2: '#8B0000',
  tapAccent3: '#D4A012',
  warmGlow: 'rgba(255,200,100,',
  outline: '#1A1A1A',
};

export const Pub: React.FC<PubProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const lampSway1 = sineWave(frame, 0.1) * 2.5;
  const lampSway2 = sineWave(frame, 0.13, 1.2) * 2;
  const lampSway3 = sineWave(frame, 0.11, 2.5) * 2.2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <radialGradient id="ambient" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="rgba(255,180,80,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.barTrim} />
          <stop offset="40%" stopColor={C.barFront} />
          <stop offset="100%" stopColor={C.barPanel} />
        </linearGradient>
        <linearGradient id="floor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.floor} />
          <stop offset="100%" stopColor={C.floorDark} />
        </linearGradient>
      </defs>

      {/* === BACK WALL === */}
      <rect x={0} y={0} width={width} height={height * 0.72} fill={C.wall} />
      <rect x={0} y={height * 0.35} width={width} height={height * 0.37} fill={C.wallAccent} opacity={0.4} />
      <rect x={0} y={height * 0.35} width={width} height={4} fill={C.wallMolding} opacity={0.5} />
      <rect x={0} y={0} width={width} height={height} fill="url(#ambient)" />

      {/* === GLASS SHELVES (left wall) === */}
      <GlassShelf x={80} y={120} />
      <GlassShelf x={80} y={270} />

      {/* === GLASS SHELVES (right wall) === */}
      <GlassShelf x={1540} y={120} />
      <GlassShelf x={1540} y={270} />

      {/* === CHALKBOARD === */}
      <g transform={`translate(${width / 2 - 220}, 50)`}>
        <rect x={-12} y={-12} width={464} height={244} rx={4} fill={C.chalkFrame} stroke={C.outline} strokeWidth={3} />
        <rect x={0} y={0} width={440} height={220} fill={C.chalkboard} />
        <rect x={10} y={10} width={420} height={200} fill="rgba(255,255,255,0.02)" />
        <rect x={-8} y={220} width={456} height={14} rx={2} fill={C.chalkFrame} stroke={C.outline} strokeWidth={2} />
        <rect x={40} y={223} width={30} height={5} rx={2} fill={C.chalk} opacity={0.7} />
        <rect x={90} y={224} width={20} height={4} rx={2} fill="#FFD700" opacity={0.5} />
        {boardText && (
          <text x={220} y={125} textAnchor="middle" fill={C.chalk}
            fontSize={38} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.85}>
            {boardText}
          </text>
        )}
      </g>

      {/* === FLOOR === */}
      <rect x={0} y={height * 0.72} width={width} height={height * 0.28} fill="url(#floor-grad)" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`fp-${i}`} x1={i * 230 + 40} y1={height * 0.72} x2={i * 230 + 40} y2={height}
          stroke={C.floorDark} strokeWidth={1.5} opacity={0.3} />
      ))}
      {[0.82, 0.92].map((r, i) => (
        <line key={`fh-${i}`} x1={0} y1={height * r} x2={width} y2={height * r}
          stroke={C.floorDark} strokeWidth={1} opacity={0.2} />
      ))}

      {/* === BAR COUNTER === */}
      <rect x={0} y={height * 0.58} width={width} height={height * 0.16} fill="url(#bar-grad)" stroke={C.outline} strokeWidth={2} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`bp-${i}`} x={160 + i * 320} y={height * 0.60} width={200} height={height * 0.12}
          rx={4} fill="none" stroke={C.barPanel} strokeWidth={1.5} opacity={0.4} />
      ))}
      <rect x={0} y={height * 0.555} width={width} height={28} rx={4} fill={C.barTop} stroke={C.outline} strokeWidth={2.5} />
      <rect x={60} y={height * 0.56} width={width - 120} height={8} rx={4} fill={C.barTopShine} />
      <rect x={80} y={height * 0.72 - 8} width={width - 160} height={6} rx={3} fill={C.stoolMetal} opacity={0.35} />

      {/* === BEER TAPS (left & right of center) === */}
      <BeerTaps x={280} y={height * 0.555} />
      <BeerTaps x={1640} y={height * 0.555} />

      {/* === BAR STOOLS === */}
      <BarStool x={450} y={height * 0.72} />
      <BarStool x={780} y={height * 0.72} />
      <BarStool x={1140} y={height * 0.72} />
      <BarStool x={1470} y={height * 0.72} />

      {/* === HANGING LAMPS === */}
      <HangingLamp x={350} sway={lampSway1} />
      <HangingLamp x={960} sway={lampSway2} />
      <HangingLamp x={1570} sway={lampSway3} />
    </svg>
  );
};

/* ---- Shelf with glasses ---- */
const GlassShelf: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M0,55 L0,65 L8,65" fill="none" stroke={C.shelf} strokeWidth={3} />
    <path d="M300,55 L300,65 L292,65" fill="none" stroke={C.shelf} strokeWidth={3} />
    <rect x={-5} y={55} width={310} height={10} rx={2} fill={C.shelfFront} stroke={C.outline} strokeWidth={1.5} />
    <PintGlassSmall x={25} y={15} />
    <PintGlassSmall x={70} y={15} />
    <PintGlassSmall x={115} y={15} />
    <WineGlass x={175} y={10} />
    <WineGlass x={210} y={10} />
    <Tumbler x={255} y={28} />
    <Tumbler x={280} y={28} />
  </g>
);

const PintGlassSmall: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M-8,0 L-6,-38 L6,-38 L8,0 Z" fill={C.glass} stroke={C.outline} strokeWidth={1.5} />
    <line x1={-4} y1={-34} x2={-3} y2={-2} stroke={C.glassShine} strokeWidth={1} />
  </g>
);

const WineGlass: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <ellipse cx={0} cy={-28} rx={8} ry={12} fill={C.glass} stroke={C.outline} strokeWidth={1.2} />
    <line x1={0} y1={-16} x2={0} y2={0} stroke={C.outline} strokeWidth={1.5} />
    <ellipse cx={0} cy={0} rx={7} ry={2.5} fill={C.glass} stroke={C.outline} strokeWidth={1.2} />
    <line x1={-3} y1={-35} x2={-2} y2={-22} stroke={C.glassShine} strokeWidth={0.8} />
  </g>
);

const Tumbler: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M-7,0 L-6,-24 L6,-24 L7,0 Z" fill={C.glass} stroke={C.outline} strokeWidth={1.2} />
    <line x1={-4} y1={-20} x2={-3} y2={-2} stroke={C.glassShine} strokeWidth={0.8} />
  </g>
);

/* ---- Bigger bar stools ---- */
const BarStool: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <ellipse cx={0} cy={-8} rx={38} ry={12} fill={C.stoolSeat} stroke={C.outline} strokeWidth={2.5} />
    <ellipse cx={-5} cy={-12} rx={18} ry={5} fill="rgba(255,255,255,0.06)" />
    <rect x={-5} y={4} width={10} height={70} rx={3} fill={C.stool} stroke={C.outline} strokeWidth={2} />
    <ellipse cx={0} cy={50} rx={22} ry={6} fill="none" stroke={C.stoolMetal} strokeWidth={3.5} />
    <line x1={-5} y1={74} x2={-28} y2={95} stroke={C.stool} strokeWidth={4} strokeLinecap="round" />
    <line x1={5} y1={74} x2={28} y2={95} stroke={C.stool} strokeWidth={4} strokeLinecap="round" />
    <line x1={0} y1={74} x2={0} y2={98} stroke={C.stool} strokeWidth={4} strokeLinecap="round" />
    <circle cx={-30} cy={97} r={4} fill={C.stoolMetal} opacity={0.5} />
    <circle cx={30} cy={97} r={4} fill={C.stoolMetal} opacity={0.5} />
    <circle cx={0} cy={100} r={4} fill={C.stoolMetal} opacity={0.5} />
  </g>
);

/* ---- Beer taps ---- */
const BeerTaps: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-80} y={-12} width={160} height={14} rx={4} fill={C.tapBase} stroke={C.outline} strokeWidth={2} />
    <rect x={-70} y={2} width={140} height={8} rx={2} fill={C.tapBase} stroke={C.outline} strokeWidth={1.5} opacity={0.7} />
    {[
      { tx: -45, color: C.tapAccent1 },
      { tx: 0, color: C.tapAccent2 },
      { tx: 45, color: C.tapAccent3 },
    ].map(({ tx, color }, i) => (
      <g key={`tap-${i}`} transform={`translate(${tx}, -12)`}>
        <rect x={-5} y={-50} width={10} height={45} rx={3} fill={C.tapHandle} stroke={C.outline} strokeWidth={1.5} />
        <rect x={-4} y={-68} width={8} height={22} rx={4} fill={color} stroke={C.outline} strokeWidth={2} />
        <circle cx={0} cy={-70} r={6} fill={color} stroke={C.outline} strokeWidth={2} />
        <circle cx={0} cy={-58} r={2.5} fill="rgba(255,255,255,0.3)" />
        <path d="M-3,-5 L-2,-2 L2,-2 L3,-5" fill={C.tapHandle} stroke={C.outline} strokeWidth={1} />
      </g>
    ))}
  </g>
);

/* ---- Bigger hanging lamps ---- */
const HangingLamp: React.FC<{ x: number; sway: number }> = ({ x, sway }) => (
  <g transform={`translate(${x}, 0)`}>
    <line x1={0} y1={0} x2={sway * 0.5} y2={50} stroke={C.lampChain} strokeWidth={2} />
    <line x1={sway * 0.5} y1={50} x2={sway} y2={100} stroke={C.lampChain} strokeWidth={2} />
    <g transform={`translate(${sway}, 100)`}>
      <circle cx={0} cy={15} r={70} fill={`${C.warmGlow}0.08)`} />
      <circle cx={0} cy={10} r={40} fill={`${C.warmGlow}0.12)`} />
      <path d="M-35,0 L-24,-30 Q-24,-34 -20,-34 L20,-34 Q24,-34 24,-30 L35,0 Z"
        fill={C.lampShade} stroke={C.outline} strokeWidth={2.5} />
      <path d="M-33,0 L33,0" stroke={C.lampShade} strokeWidth={2} opacity={0.5} />
      <ellipse cx={0} cy={4} rx={8} ry={6} fill="#FFF4D6" opacity={0.85} />
      <ellipse cx={0} cy={4} rx={5} ry={4} fill="white" opacity={0.4} />
      <path d="M-18,-28 L-10,-5" stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
    </g>
  </g>
);

export default Pub;
