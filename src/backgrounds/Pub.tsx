import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

// ============================================================================
// Professor Pint - Pub Interior Background
// Oil-painting quality cozy European pub. Vermeer/Rembrandt warm interior style.
// 1920x1080 @ 30fps, all animations via sineWave(frame, freq, phase)
// ============================================================================

interface PubProps {
  boardText?: string;
  width?: number;
  height?: number;
}

// ---------------------------------------------------------------------------
// Color Palette - 90+ named colors for oil-painting richness
// ---------------------------------------------------------------------------
const C = {
  // Walls
  wall: '#3D2B1F',
  wallDeep: '#2E1F14',
  wallAccent: '#4A3628',
  wallMolding: '#5C3A20',
  wallMoldingHi: '#7A5030',
  wallPanelDark: '#2A1C12',
  wallPanelMid: '#3A2818',
  wallPanelLight: '#4E3622',
  wallPanelEdge: '#5A402A',
  wainscot: '#3E2A1A',
  wainscotGroove: '#2C1C10',
  wainscotCap: '#5C3E28',
  crownMolding: '#6B4A32',
  crownMoldingHi: '#8A6444',

  // Ceiling
  ceiling: '#2A1C12',
  ceilingBeam: '#3E2818',
  ceilingBeamHi: '#5A3E28',
  ceilingBeamShadow: '#1E1008',

  // Floor
  floor: '#5C3A1E',
  floorDark: '#4A2E14',
  floorLight: '#6E4A2A',
  floorGrain: '#3E2410',
  floorWorn: '#6B4828',
  floorStain: 'rgba(30,15,5,0.3)',
  floorShine: 'rgba(255,200,120,0.06)',

  // Bar
  bar: '#6B3A2A',
  barTop: '#8B5A3A',
  barTopShine: 'rgba(255,220,160,0.15)',
  barTopReflect: 'rgba(255,200,120,0.08)',
  barFront: '#5C2E1E',
  barTrim: '#7A4A32',
  barPanel: '#4E2518',
  barPanelGroove: '#3A1A0E',
  barPanelMolding: '#6A3E28',
  barEdge: '#8B5A3A',
  barFootRail: '#B8924A',
  barFootRailHi: '#D4AA5E',
  barFootRailShadow: '#8A6E3A',

  // Shelves & bottles
  shelf: '#5C3218',
  shelfFront: '#6B3A20',
  shelfBracket: '#4A2812',
  bottleGreen: '#1A4A28',
  bottleGreenDk: '#0E3018',
  bottleBrown: '#5A3218',
  bottleBrownDk: '#3E2210',
  bottleAmber: '#8A5A1E',
  bottleAmberDk: '#6A4418',
  bottleClear: 'rgba(200,220,240,0.4)',
  bottleRed: '#6A1E1E',
  bottleRedDk: '#4A1010',
  bottleBlue: '#1E2E5A',
  bottleLabel: '#E8DCC8',
  bottleLabelDk: '#C4B8A4',
  bottleCap: '#888888',
  liquidAmber: 'rgba(200,140,40,0.5)',
  liquidRed: 'rgba(140,20,20,0.4)',
  liquidGreen: 'rgba(40,100,40,0.3)',

  // Glass
  glass: 'rgba(200,220,240,0.35)',
  glassThin: 'rgba(200,220,240,0.2)',
  glassShine: 'rgba(255,255,255,0.25)',
  glassHighlight: 'rgba(255,255,255,0.4)',
  glassRim: 'rgba(255,255,255,0.15)',
  beerGold: 'rgba(220,170,40,0.6)',
  beerFoam: 'rgba(255,248,230,0.85)',
  beerDark: 'rgba(60,30,10,0.5)',
  whiskey: 'rgba(180,100,20,0.5)',

  // Brass
  brass: '#B8924A',
  brassHi: '#D4AA5E',
  brassDk: '#8A6E3A',
  brassShadow: '#6A5028',
  brassPatina: 'rgba(80,110,60,0.15)',

  // Stool
  stool: '#3A2010',
  stoolSeat: '#6B4528',
  stoolSeatHi: '#7E5634',
  stoolLeather: '#5A3820',
  stoolMetal: '#888888',
  stoolMetalDk: '#666666',

  // Chalkboard
  chalkboard: '#2A3A2A',
  chalkboardDk: '#1E2E1E',
  chalkFrame: '#4A2A1A',
  chalkFrameHi: '#5E3A24',
  chalk: '#E8E8D8',
  chalkDust: 'rgba(232,232,216,0.15)',

  // Lamps
  lampShade: '#B8890F',
  lampShadeHi: '#D4A020',
  lampShadeDk: '#8A6608',
  lampChain: '#5A5A5A',
  lampChainHi: '#7A7A7A',
  lampBulb: '#FFF4D6',
  lampBulbCore: '#FFFFFF',

  // Taps
  tapBase: '#444444',
  tapBaseDk: '#2A2A2A',
  tapHandle: '#C0C0C0',
  tapHandleHi: '#E0E0E0',
  tapAccent1: '#2D5016',
  tapAccent2: '#8B0000',
  tapAccent3: '#D4A012',
  tapAccent4: '#1A3A6A',

  // Fireplace
  fireBrick: '#6A3A2A',
  fireBrickDk: '#4A2218',
  fireBrickMortar: '#5A4838',
  fireMantel: '#5A3218',
  fireMantelHi: '#7A4A2A',
  fireOrange: '#FF8C20',
  fireYellow: '#FFD040',
  fireRed: '#CC3300',
  fireCoreWhite: '#FFE8A0',
  fireEmber: '#FF4400',
  fireLog: '#3A1E0A',
  fireLogHi: '#5A3218',
  fireAsh: '#8A8078',
  fireGlow: 'rgba(255,140,30,',

  // Candle
  candleWax: '#E8DCC0',
  candleWick: '#2A1A0A',
  candleFlame: '#FFD040',
  candleFlameTip: '#FF8C20',
  candleFlameCore: '#FFF8E0',
  candleGlow: 'rgba(255,200,80,',
  candleHolder: '#888870',
  candleHolderBrass: '#A08840',

  // Dartboard
  dartRed: '#CC2200',
  dartGreen: '#1A5A28',
  dartBlack: '#1A1A1A',
  dartCream: '#E8DCC0',
  dartWire: '#AAAAAA',
  dartBoard: '#C4A878',

  // Paintings
  paintFrame: '#8A6A30',
  paintFrameInner: '#6A4E20',
  paintFrameHi: '#B08A40',
  paintCanvas: '#3A3028',

  // Fabric
  curtain: '#5A1E1E',
  curtainDk: '#3E1010',
  curtainFold: '#7A2828',

  // Warm light
  warmGlow: 'rgba(255,200,100,',
  warmGlowFire: 'rgba(255,140,50,',
  ambientWarm: 'rgba(255,180,80,0.08)',
  ambientDark: 'rgba(0,0,0,0.15)',

  // General
  outline: '#1A1A1A',
  outlineSoft: '#2A1A0A',
  shadow: 'rgba(0,0,0,0.25)',
  shadowDeep: 'rgba(0,0,0,0.4)',
  vignetteEdge: 'rgba(10,5,0,0.6)',
  vignetteMid: 'rgba(10,5,0,0.2)',
  smoke: 'rgba(180,160,130,',
  dustMote: 'rgba(255,220,160,0.3)',
};

// ---------------------------------------------------------------------------
// Sub-component: GlassShelf - wall-mounted shelf with bottles and glasses
// ---------------------------------------------------------------------------
const GlassShelf: React.FC<{ x: number; y: number; variant?: number }> = ({
  x,
  y,
  variant = 0,
}) => {
  const bottles = [
    { bx: 15, color: C.bottleGreen, dk: C.bottleGreenDk, h: 52, w: 12, label: true },
    { bx: 42, color: C.bottleBrown, dk: C.bottleBrownDk, h: 48, w: 11, label: true },
    { bx: 68, color: C.bottleAmber, dk: C.bottleAmberDk, h: 55, w: 13, label: false },
    { bx: 95, color: C.bottleRed, dk: C.bottleRedDk, h: 44, w: 10, label: true },
    { bx: 118, color: C.bottleGreen, dk: C.bottleGreenDk, h: 50, w: 12, label: false },
    { bx: 145, color: C.bottleClear, dk: 'rgba(160,180,200,0.3)', h: 46, w: 10, label: true },
    { bx: 170, color: C.bottleBrown, dk: C.bottleBrownDk, h: 53, w: 12, label: true },
    { bx: 198, color: C.bottleBlue, dk: '#142248', h: 42, w: 11, label: false },
    { bx: 222, color: C.bottleAmber, dk: C.bottleAmberDk, h: 50, w: 12, label: true },
    { bx: 250, color: C.bottleRed, dk: C.bottleRedDk, h: 47, w: 11, label: true },
    { bx: 275, color: C.bottleGreen, dk: C.bottleGreenDk, h: 51, w: 12, label: false },
  ];

  // Shift bottle selection by variant
  const shiftedBottles = variant === 0
    ? bottles
    : bottles.slice(variant % 3).concat(bottles.slice(0, variant % 3));

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Shelf brackets */}
      <path d="M-2,58 L-2,72 L12,72" fill="none" stroke={C.shelfBracket} strokeWidth={3} />
      <path d="M302,58 L302,72 L288,72" fill="none" stroke={C.shelfBracket} strokeWidth={3} />

      {/* Shelf plank */}
      <rect x={-5} y={55} width={310} height={12} rx={1} fill={C.shelf} stroke={C.outlineSoft} strokeWidth={1.5} />
      <rect x={-5} y={55} width={310} height={3} fill={C.shelfFront} opacity={0.6} />
      <rect x={-5} y={64} width={310} height={3} fill={C.shelfBracket} opacity={0.4} />

      {/* Bottles */}
      {shiftedBottles.map((b, i) => (
        <g key={`bottle-${i}`} transform={`translate(${b.bx}, ${55 - b.h})`}>
          {/* Bottle body */}
          <rect x={-b.w / 2} y={b.h * 0.2} width={b.w} height={b.h * 0.8} rx={2}
            fill={b.color} stroke={C.outlineSoft} strokeWidth={1} />
          {/* Bottle neck */}
          <rect x={-b.w / 4} y={0} width={b.w / 2} height={b.h * 0.25} rx={1.5}
            fill={b.dk} stroke={C.outlineSoft} strokeWidth={0.8} />
          {/* Cap */}
          <rect x={-b.w / 4 - 1} y={-2} width={b.w / 2 + 2} height={4} rx={1}
            fill={C.bottleCap} opacity={0.7} />
          {/* Label */}
          {b.label && (
            <rect x={-b.w / 2 + 2} y={b.h * 0.4} width={b.w - 4} height={b.h * 0.25} rx={1}
              fill={C.bottleLabel} opacity={0.7} />
          )}
          {/* Highlight streak */}
          <line x1={-b.w / 4} y1={b.h * 0.25} x2={-b.w / 4} y2={b.h * 0.9}
            stroke={C.glassShine} strokeWidth={0.8} opacity={0.5} />
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: PintGlass - detailed pint glass with beer
// ---------------------------------------------------------------------------
const PintGlass: React.FC<{ x: number; y: number; filled?: boolean }> = ({
  x,
  y,
  filled = true,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Glass body - slight taper */}
    <path d="M-10,0 L-8,-44 L8,-44 L10,0 Z" fill={C.glass} stroke={C.outlineSoft} strokeWidth={1.5} />
    {/* Beer fill */}
    {filled && (
      <>
        <path d="M-9,-2 L-8,-38 L8,-38 L9,-2 Z" fill={C.beerGold} />
        {/* Foam head */}
        <ellipse cx={0} cy={-38} rx={8} ry={4} fill={C.beerFoam} />
        <ellipse cx={-3} cy={-39} rx={2} ry={1.5} fill="white" opacity={0.3} />
        <ellipse cx={3} cy={-37} rx={1.5} ry={1} fill="white" opacity={0.2} />
      </>
    )}
    {/* Glass highlights */}
    <line x1={-6} y1={-40} x2={-5} y2={-4} stroke={C.glassShine} strokeWidth={1.2} />
    <line x1={6} y1={-38} x2={5.5} y2={-6} stroke={C.glassHighlight} strokeWidth={0.6} opacity={0.3} />
    {/* Rim highlight */}
    <ellipse cx={0} cy={-44} rx={8.5} ry={2} fill="none" stroke={C.glassRim} strokeWidth={0.8} />
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: WineGlass - stemmed wine glass
// ---------------------------------------------------------------------------
const WineGlass: React.FC<{ x: number; y: number; hasWine?: boolean }> = ({
  x,
  y,
  hasWine = false,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Bowl */}
    <ellipse cx={0} cy={-30} rx={9} ry={14} fill={C.glassThin} stroke={C.outlineSoft} strokeWidth={1.2} />
    {hasWine && <ellipse cx={0} cy={-26} rx={7} ry={8} fill={C.liquidRed} />}
    {/* Stem */}
    <line x1={0} y1={-16} x2={0} y2={-2} stroke={C.outlineSoft} strokeWidth={1.5} />
    {/* Base */}
    <ellipse cx={0} cy={0} rx={8} ry={2.5} fill={C.glassThin} stroke={C.outlineSoft} strokeWidth={1} />
    {/* Shine */}
    <line x1={-4} y1={-38} x2={-3} y2={-22} stroke={C.glassShine} strokeWidth={0.8} />
    <ellipse cx={3} cy={-30} rx={2} ry={5} fill={C.glassHighlight} opacity={0.15} />
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: Tumbler - short whiskey glass
// ---------------------------------------------------------------------------
const Tumbler: React.FC<{ x: number; y: number; hasLiquid?: boolean }> = ({
  x,
  y,
  hasLiquid = false,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M-8,0 L-7,-26 L7,-26 L8,0 Z" fill={C.glassThin} stroke={C.outlineSoft} strokeWidth={1.2} />
    {hasLiquid && <path d="M-7,-2 L-6.5,-14 L6.5,-14 L7,-2 Z" fill={C.whiskey} />}
    {/* Thick bottom */}
    <rect x={-8} y={-3} width={16} height={3} rx={1} fill={C.glass} opacity={0.5} />
    <line x1={-5} y1={-22} x2={-4} y2={-4} stroke={C.glassShine} strokeWidth={0.8} />
    {/* Cut glass pattern */}
    <line x1={-3} y1={-24} x2={-2} y2={-4} stroke={C.glassRim} strokeWidth={0.4} />
    <line x1={3} y1={-24} x2={2} y2={-4} stroke={C.glassRim} strokeWidth={0.4} />
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: WhiskeyBottle - tall detailed bottle on display
// ---------------------------------------------------------------------------
const WhiskeyBottle: React.FC<{ x: number; y: number; color?: string; labelText?: string }> = ({
  x,
  y,
  color = C.bottleAmber,
  labelText = '',
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Body */}
    <rect x={-14} y={-55} width={28} height={55} rx={3} fill={color} stroke={C.outlineSoft} strokeWidth={1.5} />
    {/* Shoulder taper */}
    <path d="M-14,-55 L-14,-60 Q-14,-68 -7,-68 L7,-68 Q14,-68 14,-60 L14,-55" fill={color} stroke={C.outlineSoft} strokeWidth={1} />
    {/* Neck */}
    <rect x={-6} y={-82} width={12} height={14} rx={2} fill={color} stroke={C.outlineSoft} strokeWidth={1} />
    {/* Cap */}
    <rect x={-7} y={-86} width={14} height={5} rx={2} fill={C.bottleCap} stroke={C.outlineSoft} strokeWidth={1} />
    {/* Label */}
    <rect x={-11} y={-42} width={22} height={20} rx={1} fill={C.bottleLabel} opacity={0.8} />
    <rect x={-9} y={-40} width={18} height={2} fill={C.bottleLabelDk} opacity={0.4} />
    <rect x={-7} y={-35} width={14} height={1.5} fill={C.bottleLabelDk} opacity={0.3} />
    {labelText && (
      <text x={0} y={-30} textAnchor="middle" fontSize={5} fill={C.outlineSoft} fontFamily="serif">{labelText}</text>
    )}
    {/* Liquid level visible */}
    <rect x={-12} y={-20} width={24} height={20} rx={2} fill={C.liquidAmber} opacity={0.4} />
    {/* Glass highlight */}
    <line x1={-10} y1={-52} x2={-10} y2={-5} stroke={C.glassShine} strokeWidth={1} opacity={0.4} />
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: BeerTap - single beer tap with badge
// ---------------------------------------------------------------------------
const BeerTap: React.FC<{ x: number; y: number; color: string; badgeText?: string }> = ({
  x,
  y,
  color,
  badgeText = '',
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Tap column */}
    <rect x={-6} y={-55} width={12} height={48} rx={3} fill={C.tapHandle} stroke={C.outlineSoft} strokeWidth={1.5} />
    <rect x={-5} y={-52} width={2} height={42} fill={C.tapHandleHi} opacity={0.3} />
    {/* Handle / badge */}
    <rect x={-5} y={-74} width={10} height={24} rx={5} fill={color} stroke={C.outlineSoft} strokeWidth={2} />
    {/* Badge top */}
    <circle cx={0} cy={-76} r={7} fill={color} stroke={C.outlineSoft} strokeWidth={2} />
    <circle cx={0} cy={-76} r={4} fill="rgba(255,255,255,0.15)" />
    {badgeText && (
      <text x={0} y={-60} textAnchor="middle" fontSize={4} fill="white" fontWeight="bold">{badgeText}</text>
    )}
    {/* Highlight on handle */}
    <circle cx={-1} cy={-64} r={2.5} fill="rgba(255,255,255,0.2)" />
    {/* Spout */}
    <path d="M-4,-7 L-3,-3 L3,-3 L4,-7" fill={C.tapHandle} stroke={C.outlineSoft} strokeWidth={1} />
    <ellipse cx={0} cy={-3} rx={3.5} ry={1.5} fill={C.tapBaseDk} />
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: BeerTapGroup - 3 taps on a base
// ---------------------------------------------------------------------------
const BeerTapGroup: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Base plate */}
    <rect x={-85} y={-14} width={170} height={16} rx={4} fill={C.tapBase} stroke={C.outlineSoft} strokeWidth={2} />
    <rect x={-83} y={-12} width={166} height={4} fill={C.tapBaseDk} opacity={0.5} />
    {/* Drip tray */}
    <rect x={-75} y={2} width={150} height={10} rx={2} fill={C.tapBase} stroke={C.outlineSoft} strokeWidth={1.5} opacity={0.7} />
    <rect x={-70} y={4} width={140} height={6} rx={1} fill={C.tapBaseDk} opacity={0.3} />
    {/* Three taps */}
    <BeerTap x={-48} y={-14} color={C.tapAccent1} />
    <BeerTap x={0} y={-14} color={C.tapAccent2} />
    <BeerTap x={48} y={-14} color={C.tapAccent3} />
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: BarStool - leather-topped bar stool
// ---------------------------------------------------------------------------
const BarStool: React.FC<{ x: number; y: number; angle?: number }> = ({
  x,
  y,
  angle = 0,
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
    {/* Seat - leather cushion */}
    <ellipse cx={0} cy={-10} rx={40} ry={14} fill={C.stoolSeat} stroke={C.outlineSoft} strokeWidth={2.5} />
    {/* Leather highlight */}
    <ellipse cx={-8} cy={-14} rx={20} ry={6} fill={C.stoolSeatHi} opacity={0.3} />
    {/* Leather stitching suggestion */}
    <ellipse cx={0} cy={-10} rx={32} ry={10} fill="none" stroke={C.stoolLeather} strokeWidth={0.8} strokeDasharray="4,3" opacity={0.3} />
    {/* Cushion edge shadow */}
    <ellipse cx={0} cy={-6} rx={38} ry={10} fill="none" stroke={C.shadow} strokeWidth={1.5} opacity={0.3} />

    {/* Center post */}
    <rect x={-6} y={2} width={12} height={72} rx={3} fill={C.stool} stroke={C.outlineSoft} strokeWidth={2} />
    {/* Post highlight */}
    <rect x={-4} y={6} width={3} height={64} rx={1.5} fill={C.stoolSeat} opacity={0.15} />

    {/* Foot ring */}
    <ellipse cx={0} cy={50} rx={24} ry={7} fill="none" stroke={C.stoolMetal} strokeWidth={4} />
    <ellipse cx={0} cy={49} rx={24} ry={7} fill="none" stroke={C.stoolMetalDk} strokeWidth={1} opacity={0.3} />

    {/* Legs */}
    <line x1={-6} y1={74} x2={-30} y2={98} stroke={C.stool} strokeWidth={5} strokeLinecap="round" />
    <line x1={6} y1={74} x2={30} y2={98} stroke={C.stool} strokeWidth={5} strokeLinecap="round" />
    <line x1={0} y1={74} x2={0} y2={102} stroke={C.stool} strokeWidth={5} strokeLinecap="round" />
    {/* Back leg */}
    <line x1={0} y1={74} x2={-15} y2={100} stroke={C.stool} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    <line x1={0} y1={74} x2={15} y2={100} stroke={C.stool} strokeWidth={4} strokeLinecap="round" opacity={0.6} />

    {/* Foot caps */}
    <circle cx={-30} cy={99} r={4.5} fill={C.stoolMetal} opacity={0.5} />
    <circle cx={30} cy={99} r={4.5} fill={C.stoolMetal} opacity={0.5} />
    <circle cx={0} cy={103} r={4.5} fill={C.stoolMetal} opacity={0.5} />
    <circle cx={-15} cy={101} r={3.5} fill={C.stoolMetal} opacity={0.35} />
    <circle cx={15} cy={101} r={3.5} fill={C.stoolMetal} opacity={0.35} />
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: HangingLamp - brass pub lamp with warm glow
// ---------------------------------------------------------------------------
const HangingLamp: React.FC<{ x: number; sway: number; glowPulse: number }> = ({
  x,
  sway,
  glowPulse,
}) => {
  const glowOp = 0.10 + glowPulse * 0.03;
  const innerGlowOp = 0.15 + glowPulse * 0.04;
  return (
    <g transform={`translate(${x}, 0)`}>
      {/* Chain links */}
      <line x1={0} y1={0} x2={sway * 0.3} y2={30} stroke={C.lampChain} strokeWidth={2} />
      <circle cx={sway * 0.15} cy={15} r={2} fill="none" stroke={C.lampChainHi} strokeWidth={1} />
      <line x1={sway * 0.3} y1={30} x2={sway * 0.6} y2={60} stroke={C.lampChain} strokeWidth={2} />
      <circle cx={sway * 0.45} cy={45} r={2} fill="none" stroke={C.lampChainHi} strokeWidth={1} />
      <line x1={sway * 0.6} y1={60} x2={sway * 0.85} y2={90} stroke={C.lampChain} strokeWidth={2} />
      <circle cx={sway * 0.72} cy={75} r={2} fill="none" stroke={C.lampChainHi} strokeWidth={1} />
      <line x1={sway * 0.85} y1={90} x2={sway} y2={110} stroke={C.lampChain} strokeWidth={2} />

      <g transform={`translate(${sway}, 110)`}>
        {/* Outer glow */}
        <circle cx={0} cy={18} r={80} fill={`${C.warmGlow}${glowOp})`} />
        {/* Inner glow */}
        <circle cx={0} cy={12} r={45} fill={`${C.warmGlow}${innerGlowOp})`} />

        {/* Shade - brass */}
        <path d="M-38,0 L-26,-34 Q-26,-38 -22,-38 L22,-38 Q26,-38 26,-34 L38,0 Z"
          fill={C.lampShade} stroke={C.outlineSoft} strokeWidth={2.5} />
        {/* Shade inner shadow */}
        <path d="M-36,0 L-25,-32 L25,-32 L36,0 Z" fill={C.lampShadeDk} opacity={0.3} />
        {/* Shade highlight */}
        <path d="M-20,-32 L-14,-6" stroke={C.lampShadeHi} strokeWidth={2} opacity={0.3} />
        {/* Shade rim */}
        <line x1={-38} y1={0} x2={38} y2={0} stroke={C.lampShade} strokeWidth={3} />
        <line x1={-36} y1={1} x2={36} y2={1} stroke={C.lampShadeDk} strokeWidth={1} opacity={0.5} />

        {/* Bulb */}
        <ellipse cx={0} cy={6} rx={9} ry={7} fill={C.lampBulb} opacity={0.9} />
        <ellipse cx={0} cy={5} rx={5} ry={4} fill={C.lampBulbCore} opacity={0.5} />

        {/* Decorative brass ring at top */}
        <circle cx={0} cy={-38} r={6} fill={C.brass} stroke={C.outlineSoft} strokeWidth={1.5} />
        <circle cx={-2} cy={-40} r={2} fill={C.brassHi} opacity={0.4} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: Fireplace - brick fireplace with animated fire
// ---------------------------------------------------------------------------
const Fireplace: React.FC<{
  x: number;
  y: number;
  frame: number;
}> = ({ x, y, frame }) => {
  const fire1 = sineWave(frame, 0.4, 0) * 6;
  const fire2 = sineWave(frame, 0.55, 1.3) * 5;
  const fire3 = sineWave(frame, 0.35, 2.7) * 7;
  const fire4 = sineWave(frame, 0.6, 0.8) * 4;
  const emberGlow = 0.5 + sineWave(frame, 0.25) * 0.2;
  const glowSize = 120 + sineWave(frame, 0.2) * 10;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Fireplace glow on surroundings */}
      <circle cx={75} cy={20} r={glowSize} fill={`${C.fireGlow}0.06)`} />
      <circle cx={75} cy={0} r={80} fill={`${C.fireGlow}0.04)`} />

      {/* Mantel top */}
      <rect x={-20} y={-25} width={190} height={18} rx={3} fill={C.fireMantel} stroke={C.outlineSoft} strokeWidth={2} />
      <rect x={-18} y={-24} width={186} height={6} fill={C.fireMantelHi} opacity={0.3} />
      {/* Mantel corbels */}
      <rect x={-12} y={-7} width={16} height={24} rx={2} fill={C.fireMantel} stroke={C.outlineSoft} strokeWidth={1.5} />
      <rect x={146} y={-7} width={16} height={24} rx={2} fill={C.fireMantel} stroke={C.outlineSoft} strokeWidth={1.5} />

      {/* Brick surround */}
      {/* Left column */}
      {Array.from({ length: 8 }, (_, i) => (
        <React.Fragment key={`lb-${i}`}>
          <rect x={0} y={17 + i * 18} width={18} height={16} rx={1}
            fill={i % 2 === 0 ? C.fireBrick : C.fireBrickDk} stroke={C.fireBrickMortar} strokeWidth={1} />
        </React.Fragment>
      ))}
      {/* Right column */}
      {Array.from({ length: 8 }, (_, i) => (
        <React.Fragment key={`rb-${i}`}>
          <rect x={132} y={17 + i * 18} width={18} height={16} rx={1}
            fill={i % 2 === 0 ? C.fireBrickDk : C.fireBrick} stroke={C.fireBrickMortar} strokeWidth={1} />
        </React.Fragment>
      ))}
      {/* Top arch bricks */}
      <path d="M18,17 Q75,-10 132,17" fill="none" stroke={C.fireBrickMortar} strokeWidth={18} />
      <path d="M18,17 Q75,-10 132,17" fill="none" stroke={C.fireBrick} strokeWidth={14} />
      {/* Keystone */}
      <rect x={68} y={-2} width={14} height={18} rx={1} fill={C.fireBrickDk} stroke={C.fireBrickMortar} strokeWidth={1} />

      {/* Firebox interior */}
      <rect x={18} y={17} width={114} height={144} fill="#0A0604" />
      {/* Back wall glow */}
      <rect x={20} y={19} width={110} height={80} fill={`${C.fireGlow}0.08)`} />

      {/* Logs */}
      <ellipse cx={50} cy={148} rx={22} ry={7} fill={C.fireLog} stroke={C.outlineSoft} strokeWidth={1} />
      <ellipse cx={48} cy={146} rx={20} ry={5} fill={C.fireLogHi} opacity={0.3} />
      <ellipse cx={100} cy={150} rx={20} ry={6} fill={C.fireLog} stroke={C.outlineSoft} strokeWidth={1} />
      <ellipse cx={75} cy={145} rx={18} ry={5} fill={C.fireLog} stroke={C.outlineSoft} strokeWidth={1} transform="rotate(-15, 75, 145)" />

      {/* Embers */}
      {[40, 55, 68, 82, 95, 108].map((ex, i) => (
        <circle key={`ember-${i}`} cx={ex} cy={152 + (i % 2) * 3} r={2}
          fill={C.fireEmber} opacity={emberGlow + (i % 3) * 0.1} />
      ))}
      {/* Ash bed */}
      <ellipse cx={75} cy={158} rx={50} ry={4} fill={C.fireAsh} opacity={0.4} />

      {/* Fire flames - layered */}
      {/* Back flames (larger, darker) */}
      <path d={`M45,${148 + fire1} Q55,${90 + fire2} 65,${148 + fire3}`}
        fill={C.fireRed} opacity={0.7} />
      <path d={`M60,${150 + fire2} Q72,${85 + fire1} 85,${148 + fire4}`}
        fill={C.fireRed} opacity={0.6} />
      <path d={`M80,${148 + fire3} Q92,${95 + fire4} 105,${150 + fire1}`}
        fill={C.fireRed} opacity={0.65} />

      {/* Mid flames (orange) */}
      <path d={`M50,${148 + fire2} Q60,${100 + fire3} 72,${148 + fire1}`}
        fill={C.fireOrange} opacity={0.8} />
      <path d={`M65,${150 + fire4} Q75,${95 + fire1} 88,${148 + fire2}`}
        fill={C.fireOrange} opacity={0.75} />
      <path d={`M85,${148 + fire1} Q95,${105 + fire2} 105,${150 + fire3}`}
        fill={C.fireOrange} opacity={0.7} />

      {/* Front flames (yellow, bright) */}
      <path d={`M55,${148 + fire3} Q65,${108 + fire4} 75,${148 + fire2}`}
        fill={C.fireYellow} opacity={0.85} />
      <path d={`M70,${150 + fire1} Q80,${105 + fire3} 92,${148 + fire4}`}
        fill={C.fireYellow} opacity={0.8} />

      {/* Core white hotspot */}
      <path d={`M62,${148 + fire4} Q70,${115 + fire1} 80,${150 + fire2}`}
        fill={C.fireCoreWhite} opacity={0.5} />

      {/* Hearth base */}
      <rect x={-5} y={161} width={160} height={12} rx={2} fill={C.fireBrick} stroke={C.outlineSoft} strokeWidth={1.5} />
      <rect x={-3} y={162} width={156} height={4} fill={C.fireBrickDk} opacity={0.4} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: Dartboard - classic pub dartboard
// ---------------------------------------------------------------------------
const Dartboard: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const segments = 20;
  const segAngle = 360 / segments;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Backboard */}
      <rect x={-52} y={-52} width={104} height={104} rx={4} fill={C.dartBoard} stroke={C.outlineSoft} strokeWidth={2} />
      {/* Number ring background */}
      <circle cx={0} cy={0} r={48} fill={C.dartBlack} />
      {/* Segments */}
      {Array.from({ length: segments }, (_, i) => {
        const startAngle = (i * segAngle - 90 - segAngle / 2) * (Math.PI / 180);
        const endAngle = ((i + 1) * segAngle - 90 - segAngle / 2) * (Math.PI / 180);
        const outerR = 44;
        const midR = 28;
        const innerR = 16;
        const isEven = i % 2 === 0;
        // Outer double ring
        const ox1 = Math.cos(startAngle) * outerR;
        const oy1 = Math.sin(startAngle) * outerR;
        const ox2 = Math.cos(endAngle) * outerR;
        const oy2 = Math.sin(endAngle) * outerR;
        const mx1 = Math.cos(startAngle) * midR;
        const my1 = Math.sin(startAngle) * midR;
        const mx2 = Math.cos(endAngle) * midR;
        const my2 = Math.sin(endAngle) * midR;
        const ix1 = Math.cos(startAngle) * innerR;
        const iy1 = Math.sin(startAngle) * innerR;
        const ix2 = Math.cos(endAngle) * innerR;
        const iy2 = Math.sin(endAngle) * innerR;
        return (
          <React.Fragment key={`dart-${i}`}>
            {/* Outer section */}
            <path d={`M${mx1},${my1} L${ox1},${oy1} A${outerR},${outerR} 0 0,1 ${ox2},${oy2} L${mx2},${my2} A${midR},${midR} 0 0,0 ${mx1},${my1}`}
              fill={isEven ? C.dartRed : C.dartGreen} opacity={0.85} />
            {/* Inner section */}
            <path d={`M${ix1},${iy1} L${mx1},${my1} A${midR},${midR} 0 0,1 ${mx2},${my2} L${ix2},${iy2} A${innerR},${innerR} 0 0,0 ${ix1},${iy1}`}
              fill={isEven ? C.dartCream : C.dartBlack} opacity={0.85} />
          </React.Fragment>
        );
      })}
      {/* Triple ring */}
      <circle cx={0} cy={0} r={34} fill="none" stroke={C.dartWire} strokeWidth={0.8} />
      {/* Double ring */}
      <circle cx={0} cy={0} r={44} fill="none" stroke={C.dartWire} strokeWidth={0.8} />
      {/* Inner bull */}
      <circle cx={0} cy={0} r={6} fill={C.dartGreen} stroke={C.dartWire} strokeWidth={0.5} />
      {/* Bullseye */}
      <circle cx={0} cy={0} r={2.5} fill={C.dartRed} stroke={C.dartWire} strokeWidth={0.5} />
      {/* Wire spokes */}
      {Array.from({ length: segments }, (_, i) => {
        const angle = (i * segAngle - 90) * (Math.PI / 180);
        return (
          <line key={`wire-${i}`} x1={0} y1={0} x2={Math.cos(angle) * 46} y2={Math.sin(angle) * 46}
            stroke={C.dartWire} strokeWidth={0.5} opacity={0.6} />
        );
      })}
      {/* Number ring */}
      <circle cx={0} cy={0} r={48} fill="none" stroke={C.dartWire} strokeWidth={1} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: OldPainting - framed oil painting on the wall
// ---------------------------------------------------------------------------
const OldPainting: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  variant: number;
}> = ({ x, y, w, h, variant }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer frame */}
      <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={2}
        fill={C.paintFrame} stroke={C.outlineSoft} strokeWidth={2} />
      {/* Frame bevel highlight */}
      <line x1={-5} y1={-5} x2={w + 5} y2={-5} stroke={C.paintFrameHi} strokeWidth={2} opacity={0.5} />
      <line x1={-5} y1={-5} x2={-5} y2={h + 5} stroke={C.paintFrameHi} strokeWidth={1.5} opacity={0.4} />
      {/* Inner frame */}
      <rect x={-2} y={-2} width={w + 4} height={h + 4} rx={1}
        fill={C.paintFrameInner} stroke={C.outlineSoft} strokeWidth={1} />
      {/* Canvas */}
      <rect x={0} y={0} width={w} height={h} fill={C.paintCanvas} />

      {/* Painting content - varies by variant */}
      {variant === 0 && (
        // Landscape - rolling hills
        <>
          <rect x={0} y={0} width={w} height={h * 0.4} fill="#2A3848" />
          <path d={`M0,${h * 0.5} Q${w * 0.25},${h * 0.3} ${w * 0.5},${h * 0.45} Q${w * 0.75},${h * 0.35} ${w},${h * 0.5} L${w},${h} L0,${h} Z`}
            fill="#3A5028" opacity={0.8} />
          <path d={`M0,${h * 0.6} Q${w * 0.3},${h * 0.5} ${w * 0.6},${h * 0.58} Q${w * 0.8},${h * 0.52} ${w},${h * 0.6} L${w},${h} L0,${h} Z`}
            fill="#4A6038" opacity={0.7} />
          <circle cx={w * 0.8} cy={h * 0.2} r={8} fill="#D4A040" opacity={0.6} />
        </>
      )}
      {variant === 1 && (
        // Portrait - shadowed face
        <>
          <rect x={0} y={0} width={w} height={h} fill="#2A2018" />
          <ellipse cx={w / 2} cy={h * 0.38} rx={w * 0.2} ry={h * 0.22} fill="#C4A080" opacity={0.6} />
          <ellipse cx={w / 2} cy={h * 0.6} rx={w * 0.3} ry={h * 0.3} fill="#3A2818" opacity={0.7} />
          <rect x={w * 0.35} y={h * 0.15} width={w * 0.3} height={h * 0.12} rx={2} fill="#4A3020" opacity={0.5} />
        </>
      )}
      {variant === 2 && (
        // Still life - bowl and bottle
        <>
          <rect x={0} y={0} width={w} height={h} fill="#1E1810" />
          <ellipse cx={w * 0.35} cy={h * 0.65} rx={w * 0.2} ry={h * 0.12} fill="#6A4A2A" opacity={0.6} />
          <rect x={w * 0.6} y={h * 0.25} width={w * 0.12} height={h * 0.45} rx={2} fill="#2A4A28" opacity={0.7} />
          <circle cx={w * 0.35} cy={h * 0.55} r={4} fill="#8A2020" opacity={0.5} />
          <circle cx={w * 0.4} cy={h * 0.58} r={3} fill="#8A8020" opacity={0.4} />
        </>
      )}
      {variant === 3 && (
        // Seascape
        <>
          <rect x={0} y={0} width={w} height={h * 0.5} fill="#1A2A3A" />
          <rect x={0} y={h * 0.5} width={w} height={h * 0.5} fill="#2A3A4A" />
          {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
            <line key={`wave-${i}`} x1={0} y1={h * (0.5 + p * 0.4)} x2={w} y2={h * (0.52 + p * 0.38)}
              stroke="#4A5A6A" strokeWidth={1} opacity={0.4} />
          ))}
          <path d={`M${w * 0.5},${h * 0.3} L${w * 0.52},${h * 0.55} L${w * 0.48},${h * 0.55} Z`}
            fill="#E8E0D0" opacity={0.5} />
        </>
      )}

      {/* Varnish / age layer */}
      <rect x={0} y={0} width={w} height={h} fill="rgba(60,40,20,0.25)" />
      {/* Frame shadow */}
      <rect x={2} y={h + 2} width={w + 8} height={3} fill={C.shadow} opacity={0.3} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: BrassFixture - decorative brass element
// ---------------------------------------------------------------------------
const BrassFixture: React.FC<{ x: number; y: number; type: 'hook' | 'ring' | 'plate' }> = ({
  x,
  y,
  type,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {type === 'hook' && (
      <>
        <circle cx={0} cy={0} r={5} fill={C.brass} stroke={C.outlineSoft} strokeWidth={1} />
        <path d="M0,5 Q0,16 -8,20 Q-14,22 -14,16" fill="none" stroke={C.brass} strokeWidth={3} />
        <circle cx={-1} cy={-1} r={2} fill={C.brassHi} opacity={0.4} />
      </>
    )}
    {type === 'ring' && (
      <>
        <circle cx={0} cy={0} r={3} fill={C.brass} stroke={C.outlineSoft} strokeWidth={1} />
        <circle cx={0} cy={12} r={8} fill="none" stroke={C.brass} strokeWidth={3} />
        <circle cx={-3} cy={9} r={2} fill={C.brassHi} opacity={0.3} />
      </>
    )}
    {type === 'plate' && (
      <>
        <rect x={-10} y={-6} width={20} height={12} rx={3} fill={C.brass} stroke={C.outlineSoft} strokeWidth={1} />
        <rect x={-7} y={-3} width={14} height={6} rx={2} fill={C.brassDk} opacity={0.4} />
        <rect x={-6} y={-4} width={5} height={3} rx={1} fill={C.brassHi} opacity={0.3} />
      </>
    )}
  </g>
);

// ---------------------------------------------------------------------------
// Sub-component: CandleHolder - candle with animated flame
// ---------------------------------------------------------------------------
const CandleHolder: React.FC<{
  x: number;
  y: number;
  frame: number;
  phase?: number;
}> = ({ x, y, frame, phase = 0 }) => {
  const flicker = sineWave(frame, 0.6, phase) * 2;
  const flickerSide = sineWave(frame, 0.45, phase + 1.5) * 1.5;
  const glowPulse = 0.12 + sineWave(frame, 0.3, phase) * 0.04;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow */}
      <circle cx={0} cy={-28} r={35} fill={`${C.candleGlow}${glowPulse})`} />
      <circle cx={0} cy={-28} r={18} fill={`${C.candleGlow}${glowPulse + 0.05})`} />

      {/* Holder base */}
      <ellipse cx={0} cy={0} rx={10} ry={3} fill={C.candleHolderBrass} stroke={C.outlineSoft} strokeWidth={1} />
      <rect x={-8} y={-5} width={16} height={5} rx={1} fill={C.candleHolder} stroke={C.outlineSoft} strokeWidth={1} />
      {/* Holder rim */}
      <ellipse cx={0} cy={-5} rx={9} ry={3} fill={C.candleHolderBrass} stroke={C.outlineSoft} strokeWidth={0.8} />

      {/* Candle body */}
      <rect x={-4} y={-24} width={8} height={19} rx={1} fill={C.candleWax} stroke={C.outlineSoft} strokeWidth={0.8} />
      {/* Wax drip */}
      <path d="M-3,-24 Q-4,-22 -5,-18 Q-5,-15 -4,-14" fill={C.candleWax} stroke="none" />
      <path d="M3,-24 Q4.5,-20 4,-17" fill={C.candleWax} stroke="none" />

      {/* Wick */}
      <line x1={0} y1={-24} x2={flickerSide * 0.3} y2={-28} stroke={C.candleWick} strokeWidth={1} />

      {/* Flame */}
      <ellipse cx={flickerSide * 0.5} cy={-32 + flicker * 0.3} rx={3 + Math.abs(flickerSide) * 0.3} ry={6 + flicker * 0.3}
        fill={C.candleFlame} opacity={0.85} />
      <ellipse cx={flickerSide * 0.3} cy={-34 + flicker * 0.2} rx={1.5} ry={3.5}
        fill={C.candleFlameCore} opacity={0.7} />
      <ellipse cx={flickerSide * 0.6} cy={-36 + flicker * 0.4} rx={1.5} ry={2.5}
        fill={C.candleFlameTip} opacity={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: WoodBeam - ceiling beam with grain texture
// ---------------------------------------------------------------------------
const WoodBeam: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
}> = ({ x1, y1, x2, y2, thickness }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <g transform={`translate(${x1}, ${y1}) rotate(${angle})`}>
      {/* Main beam */}
      <rect x={0} y={-thickness / 2} width={len} height={thickness} rx={2}
        fill={C.ceilingBeam} stroke={C.outlineSoft} strokeWidth={1.5} />
      {/* Top highlight */}
      <rect x={2} y={-thickness / 2} width={len - 4} height={thickness * 0.25}
        fill={C.ceilingBeamHi} opacity={0.2} />
      {/* Bottom shadow */}
      <rect x={0} y={thickness * 0.25} width={len} height={thickness * 0.25}
        fill={C.ceilingBeamShadow} opacity={0.3} />
      {/* Grain lines */}
      {Array.from({ length: Math.floor(len / 40) }, (_, i) => (
        <line key={`grain-${i}`} x1={20 + i * 40} y1={-thickness / 2 + 3}
          x2={25 + i * 40} y2={thickness / 2 - 3}
          stroke={C.ceilingBeamShadow} strokeWidth={0.7} opacity={0.25} />
      ))}
      {/* End grain / knot marks */}
      <circle cx={len * 0.3} cy={0} r={3} fill={C.ceilingBeamShadow} opacity={0.2} />
      <circle cx={len * 0.7} cy={-2} r={2.5} fill={C.ceilingBeamShadow} opacity={0.15} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: HangingGlassRack - overhead glass rack
// ---------------------------------------------------------------------------
const HangingGlassRack: React.FC<{ x: number; y: number; count: number }> = ({
  x,
  y,
  count,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Rack rails */}
    <rect x={0} y={0} width={count * 28 + 10} height={4} rx={1} fill={C.ceilingBeam} stroke={C.outlineSoft} strokeWidth={1} />
    <rect x={0} y={18} width={count * 28 + 10} height={4} rx={1} fill={C.ceilingBeam} stroke={C.outlineSoft} strokeWidth={1} />
    {/* Support brackets */}
    <rect x={2} y={0} width={4} height={22} fill={C.ceilingBeam} opacity={0.8} />
    <rect x={count * 28 + 4} y={0} width={4} height={22} fill={C.ceilingBeam} opacity={0.8} />
    {/* Hanging glasses (upside down) */}
    {Array.from({ length: count }, (_, i) => (
      <g key={`hg-${i}`} transform={`translate(${14 + i * 28}, 22)`}>
        {/* Base of glass (now on top) */}
        <ellipse cx={0} cy={0} rx={7} ry={2} fill={C.glassThin} stroke={C.outlineSoft} strokeWidth={0.8} />
        {/* Stem */}
        <line x1={0} y1={2} x2={0} y2={14} stroke={C.outlineSoft} strokeWidth={1.2} />
        {/* Bowl (upside down) */}
        <ellipse cx={0} cy={22} rx={8} ry={10} fill={C.glassThin} stroke={C.outlineSoft} strokeWidth={0.8} />
        {/* Rim */}
        <ellipse cx={0} cy={32} rx={8} ry={2} fill={C.glassRim} />
        {/* Highlight */}
        <line x1={-4} y1={16} x2={-3} y2={28} stroke={C.glassShine} strokeWidth={0.6} />
      </g>
    ))}
  </g>
);

// ===========================================================================
// MAIN COMPONENT: Pub
// ===========================================================================
export const Pub: React.FC<PubProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Animation values
  const lampSway1 = sineWave(frame, 0.08) * 2.5;
  const lampSway2 = sineWave(frame, 0.11, 1.2) * 2;
  const lampSway3 = sineWave(frame, 0.09, 2.5) * 2.2;
  const lampSway4 = sineWave(frame, 0.1, 0.7) * 1.8;
  const glowPulse1 = sineWave(frame, 0.15);
  const glowPulse2 = sineWave(frame, 0.12, 1.0);
  const glowPulse3 = sineWave(frame, 0.18, 2.0);
  const glowPulse4 = sineWave(frame, 0.14, 0.5);
  const smokeDrift = sineWave(frame, 0.04) * 15;
  const smokeRise = (frame * 0.3) % 200;
  const ambientPulse = 0.08 + sineWave(frame, 0.06) * 0.02;
  const reflectionShimmer = sineWave(frame, 0.2, 0.5) * 0.03;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Ambient warm light from center */}
        <radialGradient id="pub-ambient" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={`rgba(255,180,80,${ambientPulse})`} />
          <stop offset="60%" stopColor="rgba(255,150,60,0.03)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Fireplace glow */}
        <radialGradient id="pub-fire-glow" cx="8%" cy="55%" r="30%">
          <stop offset="0%" stopColor={`${C.warmGlowFire}0.1)`} />
          <stop offset="50%" stopColor={`${C.warmGlowFire}0.04)`} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Bar top gradient */}
        <linearGradient id="pub-bartop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.barEdge} />
          <stop offset="30%" stopColor={C.barTop} />
          <stop offset="100%" stopColor={C.bar} />
        </linearGradient>

        {/* Bar front gradient */}
        <linearGradient id="pub-barfront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.barTrim} />
          <stop offset="40%" stopColor={C.barFront} />
          <stop offset="100%" stopColor={C.barPanel} />
        </linearGradient>

        {/* Floor gradient */}
        <linearGradient id="pub-floor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.floor} />
          <stop offset="60%" stopColor={C.floorDark} />
          <stop offset="100%" stopColor={C.floorGrain} />
        </linearGradient>

        {/* Wall panel gradient */}
        <linearGradient id="pub-wallpanel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.wallPanelDark} />
          <stop offset="50%" stopColor={C.wallPanelMid} />
          <stop offset="100%" stopColor={C.wallPanelDark} />
        </linearGradient>

        {/* Ceiling gradient */}
        <linearGradient id="pub-ceiling" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.ceiling} />
          <stop offset="100%" stopColor={C.wallDeep} />
        </linearGradient>

        {/* Vignette */}
        <radialGradient id="pub-vignette" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="70%" stopColor={C.vignetteMid} />
          <stop offset="100%" stopColor={C.vignetteEdge} />
        </radialGradient>

        {/* Bar top reflection */}
        <linearGradient id="pub-bartop-reflect" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={`rgba(255,200,120,${0.04 + reflectionShimmer})`} />
          <stop offset="50%" stopColor={`rgba(255,220,160,${0.10 + reflectionShimmer})`} />
          <stop offset="100%" stopColor={`rgba(255,200,120,${0.04 + reflectionShimmer})`} />
        </linearGradient>

        {/* Smoke haze */}
        <radialGradient id="pub-smoke" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor={`${C.smoke}0.06)`} />
          <stop offset="100%" stopColor={`${C.smoke}0)`} />
        </radialGradient>

        {/* Wood grain pattern */}
        <pattern id="pub-woodgrain" x="0" y="0" width="60" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="60" y2="2.5" stroke={C.floorGrain} strokeWidth="0.5" opacity="0.2" />
          <line x1="0" y1="5" x2="60" y2="5.3" stroke={C.floorGrain} strokeWidth="0.3" opacity="0.15" />
          <line x1="0" y1="7" x2="60" y2="6.8" stroke={C.floorGrain} strokeWidth="0.4" opacity="0.1" />
        </pattern>

        {/* Crown molding highlight */}
        <linearGradient id="pub-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.crownMoldingHi} />
          <stop offset="50%" stopColor={C.crownMolding} />
          <stop offset="100%" stopColor={C.wallMolding} />
        </linearGradient>

        {/* Brass rail gradient */}
        <linearGradient id="pub-brassrail" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.brassHi} />
          <stop offset="40%" stopColor={C.brass} />
          <stop offset="100%" stopColor={C.brassDk} />
        </linearGradient>
      </defs>

      {/* ================================================================ */}
      {/* LAYER 1: CEILING                                                 */}
      {/* ================================================================ */}
      <rect x={0} y={0} width={width} height={height * 0.12} fill="url(#pub-ceiling)" />
      {/* Ceiling texture - subtle planks */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={`ceil-${i}`} x1={i * 140 + 20} y1={0} x2={i * 140 + 20} y2={height * 0.12}
          stroke={C.ceilingBeamShadow} strokeWidth={0.8} opacity={0.2} />
      ))}

      {/* Ceiling beams */}
      <WoodBeam x1={0} y1={height * 0.04} x2={width} y2={height * 0.04} thickness={22} />
      <WoodBeam x1={0} y1={height * 0.10} x2={width} y2={height * 0.10} thickness={26} />

      {/* Cross beams */}
      <WoodBeam x1={320} y1={0} x2={320} y2={height * 0.12} thickness={18} />
      <WoodBeam x1={800} y1={0} x2={800} y2={height * 0.12} thickness={18} />
      <WoodBeam x1={1120} y1={0} x2={1120} y2={height * 0.12} thickness={18} />
      <WoodBeam x1={1600} y1={0} x2={1600} y2={height * 0.12} thickness={18} />

      {/* ================================================================ */}
      {/* LAYER 2: BACK WALL                                               */}
      {/* ================================================================ */}
      {/* Main wall */}
      <rect x={0} y={height * 0.10} width={width} height={height * 0.62} fill={C.wall} />

      {/* Wall upper section - slightly lighter */}
      <rect x={0} y={height * 0.10} width={width} height={height * 0.22} fill={C.wallAccent} opacity={0.3} />

      {/* Crown molding */}
      <rect x={0} y={height * 0.10} width={width} height={8} fill="url(#pub-crown)" />
      <rect x={0} y={height * 0.10} width={width} height={2} fill={C.crownMoldingHi} opacity={0.4} />
      <rect x={0} y={height * 0.107} width={width} height={3} fill={C.crownMolding} opacity={0.5} />

      {/* Wainscoting (lower wall panels) */}
      <rect x={0} y={height * 0.38} width={width} height={height * 0.34} fill={C.wainscot} opacity={0.6} />
      {/* Wainscot cap rail */}
      <rect x={0} y={height * 0.375} width={width} height={6} fill={C.wainscotCap} />
      <rect x={0} y={height * 0.375} width={width} height={2} fill={C.wallMoldingHi} opacity={0.3} />

      {/* Wainscot panels */}
      {Array.from({ length: 11 }, (_, i) => {
        const panelX = 30 + i * 175;
        const panelY = height * 0.40;
        const panelW = 150;
        const panelH = height * 0.30;
        return (
          <React.Fragment key={`wp-${i}`}>
            <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={3}
              fill="url(#pub-wallpanel)" stroke={C.wainscotGroove} strokeWidth={1.5} />
            {/* Panel inner bevel */}
            <rect x={panelX + 6} y={panelY + 6} width={panelW - 12} height={panelH - 12} rx={2}
              fill="none" stroke={C.wallPanelEdge} strokeWidth={0.8} opacity={0.3} />
            {/* Subtle grain */}
            <line x1={panelX + 15} y1={panelY + 10} x2={panelX + 15} y2={panelY + panelH - 10}
              stroke={C.wallPanelDark} strokeWidth={0.5} opacity={0.15} />
            <line x1={panelX + panelW - 15} y1={panelY + 12} x2={panelX + panelW - 15} y2={panelY + panelH - 8}
              stroke={C.wallPanelDark} strokeWidth={0.5} opacity={0.12} />
          </React.Fragment>
        );
      })}

      {/* Wall ambient light */}
      <rect x={0} y={height * 0.10} width={width} height={height * 0.62} fill="url(#pub-ambient)" />
      {/* Fireplace ambient on left wall */}
      <rect x={0} y={0} width={width} height={height} fill="url(#pub-fire-glow)" />

      {/* ================================================================ */}
      {/* LAYER 3: WALL DECORATIONS                                        */}
      {/* ================================================================ */}

      {/* === FIREPLACE (left side) === */}
      <Fireplace x={40} y={height * 0.24} frame={frame} />

      {/* === DARTBOARD (far right wall) === */}
      <Dartboard x={1800} y={height * 0.28} />
      {/* Dartboard light */}
      <circle cx={1800} cy={height * 0.28} r={60} fill={`${C.warmGlow}0.05)`} />

      {/* === OLD PAINTINGS === */}
      <OldPainting x={300} y={height * 0.14} w={100} h={70} variant={0} />
      <OldPainting x={480} y={height * 0.16} w={80} h={60} variant={1} />
      <OldPainting x={1350} y={height * 0.14} w={110} h={75} variant={2} />
      <OldPainting x={1550} y={height * 0.17} w={85} h={55} variant={3} />
      <OldPainting x={1680} y={height * 0.15} w={70} h={50} variant={0} />

      {/* === OLD MAP (left of chalkboard) === */}
      <g transform={`translate(620, ${height * 0.13})`}>
        <rect x={-4} y={-4} width={88} height={68} rx={2} fill={C.paintFrame} stroke={C.outlineSoft} strokeWidth={1.5} />
        <rect x={0} y={0} width={80} height={60} fill="#D4C8A8" />
        {/* Map lines */}
        <path d="M10,15 Q25,10 40,18 Q55,25 70,20" fill="none" stroke="#8A7A5A" strokeWidth={0.8} />
        <path d="M5,30 Q20,28 35,32 Q50,38 75,30" fill="none" stroke="#8A7A5A" strokeWidth={0.6} />
        <path d="M15,42 Q30,38 50,44 Q65,48 72,42" fill="none" stroke="#8A7A5A" strokeWidth={0.7} />
        <circle cx={40} cy={25} r={2} fill="#8A0000" opacity={0.5} />
        <rect x={0} y={0} width={80} height={60} fill="rgba(60,40,20,0.15)" />
      </g>

      {/* === FRAMED PHOTOS (right side, small) === */}
      {[
        { px: 1490, py: height * 0.35, pw: 40, ph: 50 },
        { px: 1545, py: height * 0.33, pw: 35, ph: 45 },
      ].map((p, i) => (
        <g key={`photo-${i}`} transform={`translate(${p.px}, ${p.py})`}>
          <rect x={-3} y={-3} width={p.pw + 6} height={p.ph + 6} rx={1}
            fill={C.paintFrame} stroke={C.outlineSoft} strokeWidth={1} />
          <rect x={0} y={0} width={p.pw} height={p.ph} fill="#2A2218" />
          <ellipse cx={p.pw / 2} cy={p.ph * 0.35} rx={6} ry={7} fill="#9A8A70" opacity={0.4} />
          <rect x={0} y={0} width={p.pw} height={p.ph} fill="rgba(40,30,15,0.3)" />
        </g>
      ))}

      {/* === BRASS FIXTURES on walls === */}
      <BrassFixture x={260} y={height * 0.32} type="hook" />
      <BrassFixture x={560} y={height * 0.34} type="ring" />
      <BrassFixture x={1300} y={height * 0.33} type="plate" />
      <BrassFixture x={1620} y={height * 0.34} type="hook" />
      <BrassFixture x={1760} y={height * 0.36} type="ring" />

      {/* ================================================================ */}
      {/* LAYER 4: BOTTLE SHELVES (behind bar)                             */}
      {/* ================================================================ */}

      {/* Left shelf group */}
      <GlassShelf x={60} y={height * 0.15} variant={0} />
      <GlassShelf x={60} y={height * 0.26} variant={1} />

      {/* Center-left shelf group */}
      <GlassShelf x={720} y={height * 0.15} variant={2} />
      <GlassShelf x={720} y={height * 0.26} variant={0} />

      {/* Center-right shelf group */}
      <GlassShelf x={1080} y={height * 0.15} variant={1} />
      <GlassShelf x={1080} y={height * 0.26} variant={2} />

      {/* Right shelf group */}
      <GlassShelf x={1520} y={height * 0.15} variant={0} />
      <GlassShelf x={1520} y={height * 0.26} variant={1} />

      {/* Featured whiskey bottles on bar back shelf */}
      <WhiskeyBottle x={420} y={height * 0.36} color={C.bottleAmber} />
      <WhiskeyBottle x={460} y={height * 0.36} color={C.bottleBrown} />
      <WhiskeyBottle x={500} y={height * 0.36} color={C.bottleGreen} />
      <WhiskeyBottle x={1160} y={height * 0.36} color={C.bottleRed} />
      <WhiskeyBottle x={1200} y={height * 0.36} color={C.bottleAmber} />
      <WhiskeyBottle x={1240} y={height * 0.36} color={C.bottleBrown} />

      {/* ================================================================ */}
      {/* LAYER 5: CHALKBOARD (center wall, prominent)                     */}
      {/* ================================================================ */}
      <g transform={`translate(${width / 2 - 240}, ${height * 0.13})`}>
        {/* Chalkboard outer frame */}
        <rect x={-16} y={-16} width={512} height={272} rx={5}
          fill={C.chalkFrame} stroke={C.outlineSoft} strokeWidth={3} />
        {/* Frame bevel */}
        <rect x={-14} y={-14} width={508} height={268} rx={4}
          fill="none" stroke={C.chalkFrameHi} strokeWidth={1.5} opacity={0.4} />
        {/* Inner frame */}
        <rect x={-6} y={-6} width={492} height={252} rx={2}
          fill={C.chalkFrameHi} stroke={C.outlineSoft} strokeWidth={1} opacity={0.5} />

        {/* Chalkboard surface */}
        <rect x={0} y={0} width={480} height={240} fill={C.chalkboard} />
        {/* Subtle texture */}
        <rect x={0} y={0} width={480} height={240} fill={C.chalkboardDk} opacity={0.3} />
        <rect x={5} y={5} width={470} height={230} fill="rgba(255,255,255,0.015)" />
        {/* Chalk dust residue */}
        <rect x={10} y={180} width={460} height={40} fill={C.chalkDust} opacity={0.08} />
        <circle cx={100} cy={200} r={20} fill={C.chalkDust} opacity={0.05} />
        <circle cx={350} cy={210} r={15} fill={C.chalkDust} opacity={0.04} />

        {/* Chalk tray */}
        <rect x={-10} y={240} width={500} height={16} rx={3}
          fill={C.chalkFrame} stroke={C.outlineSoft} strokeWidth={2} />
        <rect x={-8} y={241} width={496} height={6} fill={C.chalkFrameHi} opacity={0.3} />
        {/* Chalk pieces */}
        <rect x={40} y={244} width={32} height={6} rx={2} fill={C.chalk} opacity={0.8} />
        <rect x={85} y={245} width={20} height={5} rx={2} fill="#FFD700" opacity={0.5} />
        <rect x={120} y={244} width={15} height={5} rx={2} fill="#FF6B6B" opacity={0.4} />
        <rect x={380} y={245} width={25} height={5} rx={2} fill={C.chalk} opacity={0.6} />
        {/* Eraser */}
        <rect x={430} y={242} width={35} height={10} rx={2} fill="#6A5A4A" stroke={C.outlineSoft} strokeWidth={0.8} />
        <rect x={432} y={243} width={31} height={4} fill="#8A7A6A" opacity={0.5} />

        {/* Board text */}
        {boardText && (
          <text x={240} y={130} textAnchor="middle" fill={C.chalk}
            fontSize={40} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.88}>
            {boardText}
          </text>
        )}

        {/* Decorative chalk lines */}
        {!boardText && (
          <>
            <line x1={40} y1={40} x2={440} y2={40} stroke={C.chalk} strokeWidth={1} opacity={0.2} strokeDasharray="8,4" />
            <line x1={40} y1={120} x2={440} y2={120} stroke={C.chalk} strokeWidth={0.8} opacity={0.15} strokeDasharray="6,5" />
            <line x1={40} y1={200} x2={440} y2={200} stroke={C.chalk} strokeWidth={0.8} opacity={0.15} strokeDasharray="6,5" />
          </>
        )}
      </g>

      {/* ================================================================ */}
      {/* LAYER 6: HANGING GLASS RACKS (above bar)                         */}
      {/* ================================================================ */}
      <HangingGlassRack x={200} y={height * 0.38} count={8} />
      <HangingGlassRack x={580} y={height * 0.39} count={6} />
      <HangingGlassRack x={1100} y={height * 0.38} count={7} />
      <HangingGlassRack x={1450} y={height * 0.39} count={5} />

      {/* ================================================================ */}
      {/* LAYER 7: BAR COUNTER                                             */}
      {/* ================================================================ */}

      {/* Bar front face */}
      <rect x={0} y={height * 0.58} width={width} height={height * 0.16}
        fill="url(#pub-barfront)" stroke={C.outlineSoft} strokeWidth={2} />

      {/* Bar front panels */}
      {Array.from({ length: 7 }, (_, i) => {
        const px = 100 + i * 260;
        return (
          <React.Fragment key={`bpanel-${i}`}>
            <rect x={px} y={height * 0.595} width={200} height={height * 0.13} rx={4}
              fill="none" stroke={C.barPanelGroove} strokeWidth={1.5} opacity={0.5} />
            <rect x={px + 8} y={height * 0.605} width={184} height={height * 0.11} rx={3}
              fill={C.barPanel} stroke={C.barPanelGroove} strokeWidth={0.8} opacity={0.3} />
            {/* Panel molding detail */}
            <rect x={px + 14} y={height * 0.615} width={172} height={height * 0.09} rx={2}
              fill="none" stroke={C.barPanelMolding} strokeWidth={0.6} opacity={0.25} />
          </React.Fragment>
        );
      })}

      {/* Bar trim strip */}
      <rect x={0} y={height * 0.575} width={width} height={6} fill={C.barTrim} stroke={C.outlineSoft} strokeWidth={1} />

      {/* Bar top surface */}
      <rect x={0} y={height * 0.55} width={width} height={30} rx={4}
        fill="url(#pub-bartop)" stroke={C.outlineSoft} strokeWidth={2.5} />
      {/* Bar top shine/reflection */}
      <rect x={40} y={height * 0.555} width={width - 80} height={10} rx={5}
        fill="url(#pub-bartop-reflect)" />
      {/* Bar top edge highlight */}
      <rect x={0} y={height * 0.55} width={width} height={3} rx={1}
        fill={C.barEdge} opacity={0.3} />

      {/* Beer rings / coaster marks on bar */}
      {[280, 520, 780, 1020, 1380, 1600].map((cx, i) => (
        <circle key={`ring-${i}`} cx={cx} cy={height * 0.56} r={14 + (i % 3) * 2}
          fill="none" stroke={C.floorStain} strokeWidth={1} opacity={0.15 + (i % 2) * 0.05} />
      ))}

      {/* Coasters on bar */}
      {[400, 900, 1250].map((cx, i) => (
        <React.Fragment key={`coaster-${i}`}>
          <rect x={cx - 18} y={height * 0.555} width={36} height={36} rx={3}
            fill={i % 2 === 0 ? '#4A3A2A' : '#3A2A1A'} stroke={C.outlineSoft} strokeWidth={0.8} opacity={0.6} />
          <rect x={cx - 14} y={height * 0.56} width={28} height={28} rx={2}
            fill="none" stroke="#6A5A4A" strokeWidth={0.5} opacity={0.4} />
        </React.Fragment>
      ))}

      {/* Pint glasses on bar */}
      <PintGlass x={400} y={height * 0.555} filled={true} />
      <PintGlass x={920} y={height * 0.555} filled={false} />
      <Tumbler x={1260} y={height * 0.555} hasLiquid={true} />
      <WineGlass x={1500} y={height * 0.545} hasWine={true} />

      {/* ================================================================ */}
      {/* LAYER 8: BEER TAPS                                               */}
      {/* ================================================================ */}
      <BeerTapGroup x={300} y={height * 0.555} />
      <BeerTapGroup x={1640} y={height * 0.555} />

      {/* Center single decorative tap */}
      <g transform={`translate(${width / 2}, ${height * 0.555})`}>
        <rect x={-25} y={-14} width={50} height={16} rx={4} fill={C.tapBase} stroke={C.outlineSoft} strokeWidth={2} />
        <BeerTap x={0} y={-14} color={C.tapAccent4} />
      </g>

      {/* ================================================================ */}
      {/* LAYER 9: CANDLES ON BAR                                          */}
      {/* ================================================================ */}
      <CandleHolder x={550} y={height * 0.555} frame={frame} phase={0} />
      <CandleHolder x={1100} y={height * 0.555} frame={frame} phase={1.5} />
      <CandleHolder x={1400} y={height * 0.555} frame={frame} phase={3.0} />

      {/* ================================================================ */}
      {/* LAYER 10: BRASS FOOT RAIL                                        */}
      {/* ================================================================ */}
      <rect x={60} y={height * 0.725} width={width - 120} height={8} rx={4}
        fill="url(#pub-brassrail)" stroke={C.outlineSoft} strokeWidth={1} />
      {/* Rail highlights */}
      <rect x={80} y={height * 0.726} width={width - 160} height={2} rx={1}
        fill={C.brassHi} opacity={0.3} />
      {/* Rail supports */}
      {[180, 500, 820, 1140, 1460, 1740].map((sx, i) => (
        <React.Fragment key={`railsup-${i}`}>
          <rect x={sx - 4} y={height * 0.72} width={8} height={14} rx={2}
            fill={C.brass} stroke={C.outlineSoft} strokeWidth={0.8} />
          <rect x={sx - 3} y={height * 0.721} width={2} height={12} fill={C.brassHi} opacity={0.3} />
        </React.Fragment>
      ))}

      {/* ================================================================ */}
      {/* LAYER 11: FLOOR                                                  */}
      {/* ================================================================ */}
      <rect x={0} y={height * 0.72} width={width} height={height * 0.28}
        fill="url(#pub-floor)" />
      {/* Wood grain overlay */}
      <rect x={0} y={height * 0.72} width={width} height={height * 0.28}
        fill="url(#pub-woodgrain)" opacity={0.4} />

      {/* Floor plank lines (vertical) */}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={`fp-${i}`} x1={i * 130 + 30} y1={height * 0.72}
          x2={i * 130 + 30} y2={height}
          stroke={C.floorGrain} strokeWidth={1.5} opacity={0.25} />
      ))}
      {/* Floor plank lines (horizontal) - stagger like real planks */}
      {[0.78, 0.84, 0.90, 0.96].map((r, i) => (
        <React.Fragment key={`fh-${i}`}>
          <line x1={0} y1={height * r} x2={width} y2={height * r}
            stroke={C.floorGrain} strokeWidth={1} opacity={0.2} />
          {/* Stagger marks */}
          {Array.from({ length: 8 }, (_, j) => (
            <line key={`stagger-${i}-${j}`}
              x1={j * 250 + (i % 2) * 125 + 60} y1={height * r - 2}
              x2={j * 250 + (i % 2) * 125 + 60} y2={height * r + 2}
              stroke={C.floorGrain} strokeWidth={1} opacity={0.15} />
          ))}
        </React.Fragment>
      ))}

      {/* Worn spots on floor */}
      <ellipse cx={width * 0.3} cy={height * 0.85} rx={60} ry={20}
        fill={C.floorWorn} opacity={0.15} />
      <ellipse cx={width * 0.65} cy={height * 0.88} rx={45} ry={15}
        fill={C.floorWorn} opacity={0.12} />
      <ellipse cx={width * 0.5} cy={height * 0.92} rx={70} ry={18}
        fill={C.floorWorn} opacity={0.1} />

      {/* Old stains */}
      <circle cx={600} cy={height * 0.82} r={12} fill={C.floorStain} opacity={0.15} />
      <circle cx={1200} cy={height * 0.90} r={8} fill={C.floorStain} opacity={0.12} />
      <circle cx={350} cy={height * 0.95} r={10} fill={C.floorStain} opacity={0.1} />

      {/* Floor warm highlights from lamps */}
      <ellipse cx={350} cy={height * 0.85} rx={100} ry={40} fill={C.floorShine} />
      <ellipse cx={960} cy={height * 0.85} rx={120} ry={45} fill={C.floorShine} />
      <ellipse cx={1570} cy={height * 0.85} rx={100} ry={40} fill={C.floorShine} />

      {/* Door threshold (brass strip at bottom-right) */}
      <rect x={width - 120} y={height - 8} width={120} height={8} fill={C.brass} opacity={0.4} />
      <rect x={width - 118} y={height - 7} width={40} height={3} fill={C.brassHi} opacity={0.2} />

      {/* ================================================================ */}
      {/* LAYER 12: SMALL ROUND TABLES                                     */}
      {/* ================================================================ */}

      {/* Table 1 (left foreground) */}
      <g transform={`translate(250, ${height * 0.82})`}>
        {/* Table shadow */}
        <ellipse cx={0} cy={50} rx={45} ry={8} fill={C.shadowDeep} opacity={0.3} />
        {/* Pedestal base */}
        <ellipse cx={0} cy={48} rx={30} ry={6} fill={C.stool} stroke={C.outlineSoft} strokeWidth={1.5} />
        {/* Center post */}
        <rect x={-5} y={0} width={10} height={48} fill={C.stool} stroke={C.outlineSoft} strokeWidth={1.2} />
        {/* Table top */}
        <ellipse cx={0} cy={0} rx={50} ry={12} fill={C.bar} stroke={C.outlineSoft} strokeWidth={2} />
        <ellipse cx={-10} cy={-2} rx={25} ry={5} fill={C.barTopShine} />
        {/* Candle on table */}
        <CandleHolder x={10} y={-12} frame={frame} phase={4.5} />
        {/* Beer mat */}
        <rect x={-30} y={-6} width={22} height={22} rx={2} fill="#4A3A2A" opacity={0.5} />
      </g>

      {/* Table 2 (right foreground) */}
      <g transform={`translate(1650, ${height * 0.84})`}>
        <ellipse cx={0} cy={45} rx={40} ry={7} fill={C.shadowDeep} opacity={0.25} />
        <ellipse cx={0} cy={44} rx={28} ry={5} fill={C.stool} stroke={C.outlineSoft} strokeWidth={1.5} />
        <rect x={-5} y={0} width={10} height={44} fill={C.stool} stroke={C.outlineSoft} strokeWidth={1.2} />
        <ellipse cx={0} cy={0} rx={46} ry={11} fill={C.bar} stroke={C.outlineSoft} strokeWidth={2} />
        <ellipse cx={-8} cy={-2} rx={22} ry={4.5} fill={C.barTopShine} />
        <CandleHolder x={-5} y={-12} frame={frame} phase={6.0} />
      </g>

      {/* ================================================================ */}
      {/* LAYER 13: BAR STOOLS                                             */}
      {/* ================================================================ */}
      <BarStool x={450} y={height * 0.72} angle={-2} />
      <BarStool x={720} y={height * 0.72} angle={1} />
      <BarStool x={1000} y={height * 0.72} angle={-1} />
      <BarStool x={1280} y={height * 0.72} angle={2} />
      <BarStool x={1520} y={height * 0.72} angle={-1.5} />

      {/* ================================================================ */}
      {/* LAYER 14: HANGING LAMPS                                          */}
      {/* ================================================================ */}
      <HangingLamp x={250} sway={lampSway1} glowPulse={glowPulse1} />
      <HangingLamp x={640} sway={lampSway2} glowPulse={glowPulse2} />
      <HangingLamp x={1060} sway={lampSway3} glowPulse={glowPulse3} />
      <HangingLamp x={1480} sway={lampSway4} glowPulse={glowPulse4} />
      {/* Extra small lamp over dartboard */}
      <HangingLamp x={1800} sway={lampSway1 * 0.5} glowPulse={glowPulse1 * 0.5} />

      {/* ================================================================ */}
      {/* LAYER 15: CURTAIN (far left, by fireplace)                       */}
      {/* ================================================================ */}
      <g transform={`translate(0, ${height * 0.10})`}>
        {/* Curtain rod */}
        <rect x={0} y={0} width={80} height={5} fill={C.brass} />
        <circle cx={80} cy={2.5} r={5} fill={C.brass} />
        {/* Curtain fabric */}
        <path d="M0,5 Q10,80 5,200 Q2,280 0,340 L40,340 Q45,280 42,200 Q48,80 38,5 Z"
          fill={C.curtain} stroke={C.outlineSoft} strokeWidth={1} />
        {/* Fold highlights */}
        <path d="M8,20 Q12,100 10,200 Q9,260 8,330"
          fill="none" stroke={C.curtainFold} strokeWidth={2} opacity={0.3} />
        <path d="M25,15 Q28,90 26,180 Q25,250 24,330"
          fill="none" stroke={C.curtainDk} strokeWidth={2} opacity={0.25} />
        {/* Curtain shadow */}
        <path d="M40,5 Q42,80 41,200 Q40,280 40,340 L50,340 Q50,280 48,200 Q47,80 45,5 Z"
          fill={C.shadowDeep} opacity={0.3} />
      </g>

      {/* ================================================================ */}
      {/* LAYER 16: ATMOSPHERIC EFFECTS                                    */}
      {/* ================================================================ */}

      {/* Smoke / haze in air */}
      <ellipse cx={width * 0.3 + smokeDrift} cy={height * 0.25 - smokeRise * 0.3}
        rx={200} ry={40} fill={`${C.smoke}0.03)`} />
      <ellipse cx={width * 0.6 - smokeDrift * 0.7} cy={height * 0.30 - smokeRise * 0.2}
        rx={250} ry={50} fill={`${C.smoke}0.025)`} />
      <ellipse cx={width * 0.8 + smokeDrift * 0.5} cy={height * 0.22 - smokeRise * 0.25}
        rx={180} ry={35} fill={`${C.smoke}0.02)`} />
      {/* General haze */}
      <rect x={0} y={0} width={width} height={height * 0.5} fill="url(#pub-smoke)" />

      {/* Dust motes in light beams */}
      {[
        { dx: 340, dy: 220, phase: 0 },
        { dx: 660, dy: 180, phase: 1.2 },
        { dx: 980, dy: 250, phase: 2.4 },
        { dx: 1100, dy: 200, phase: 3.6 },
        { dx: 1500, dy: 230, phase: 4.8 },
      ].map((mote, i) => {
        const moteY = mote.dy + sineWave(frame, 0.08, mote.phase) * 15;
        const moteX = mote.dx + sineWave(frame, 0.05, mote.phase + 1) * 8;
        const moteOp = 0.2 + sineWave(frame, 0.12, mote.phase) * 0.15;
        return (
          <circle key={`mote-${i}`} cx={moteX} cy={moteY} r={1.5}
            fill={C.dustMote} opacity={moteOp} />
        );
      })}

      {/* Light cones from hanging lamps */}
      {[250, 640, 1060, 1480].map((lx, i) => {
        const sw = [lampSway1, lampSway2, lampSway3, lampSway4][i];
        return (
          <path key={`cone-${i}`}
            d={`M${lx + sw - 30},220 L${lx + sw - 120},${height * 0.72} L${lx + sw + 120},${height * 0.72} L${lx + sw + 30},220 Z`}
            fill={`${C.warmGlow}0.02)`} />
        );
      })}

      {/* ================================================================ */}
      {/* LAYER 17: VIGNETTE & FINAL COMPOSITING                           */}
      {/* ================================================================ */}

      {/* Warm overall tint */}
      <rect x={0} y={0} width={width} height={height}
        fill="rgba(255,180,100,0.02)" />

      {/* Edge darkening */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#pub-vignette)" />

      {/* Bottom edge extra dark (depth) */}
      <rect x={0} y={height - 40} width={width} height={40}
        fill="rgba(10,5,0,0.2)" />

      {/* Top edge dark (ceiling shadow) */}
      <rect x={0} y={0} width={width} height={30}
        fill="rgba(10,5,0,0.3)" />

      {/* Side shadows */}
      <rect x={0} y={0} width={40} height={height}
        fill="rgba(10,5,0,0.15)" />
      <rect x={width - 40} y={0} width={40} height={height}
        fill="rgba(10,5,0,0.15)" />
    </svg>
  );
};

export default Pub;
