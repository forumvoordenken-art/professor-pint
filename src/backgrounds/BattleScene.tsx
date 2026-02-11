// BattleScene.tsx — Epic battle between Aztec warriors and Spanish conquistadors
// Oil-painting quality: dramatic sky, Tenochtitlan skyline, battlefield chaos
// Rembrandt-level atmospheric lighting with dust, fire, smoke columns

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { AztecCrowdLayer, AZTEC_CROWD_CONFIGS } from '../crowds/AztecCrowd';

// ---- Color palette: 100+ named colors for oil painting depth ----
const C = {
  // Sky
  skyTop: '#1A0A1E',
  skyMid: '#3A1A2E',
  skyLow: '#6A2A1E',
  skyHorizon: '#C85A20',
  skyFire: '#E87030',
  cloudDark: '#2A1A1E',
  cloudMid: '#4A2A2E',
  cloudLight: '#7A4A3E',
  cloudHighlight: '#C86A40',
  cloudEmber: '#E88040',
  // Sun (obscured, behind smoke)
  sunGlow: 'rgba(255,120,40,0.25)',
  sunCore: '#FFB060',
  // Mountains (distant)
  mountainFar: '#2A1A2A',
  mountainMid: '#3A2030',
  mountainNear: '#4A2838',
  mountainSnow: '#C8B8C8',
  mountainSnowShadow: '#8A7A8A',
  // City silhouette (Tenochtitlan burning)
  cityDark: '#1A0A0A',
  cityMid: '#2A1010',
  cityLight: '#3A1818',
  cityFire: '#E86020',
  cityFireGlow: 'rgba(255,100,20,0.4)',
  citySmoke: 'rgba(40,20,10,0.6)',
  templeStone: '#4A3828',
  templeShadow: '#2A1A10',
  templeHighlight: '#6A4A30',
  // Lake
  lakeDark: '#1A2A3A',
  lakeMid: '#2A3A4A',
  lakeLight: '#3A4A5A',
  lakeReflection: 'rgba(230,120,40,0.15)',
  lakeFireReflect: 'rgba(255,80,20,0.2)',
  // Causeway
  causewayStone: '#5A4A3A',
  causewayShadow: '#3A2A1A',
  causewayEdge: '#4A3A2A',
  // Battlefield ground
  groundDark: '#3A2A1A',
  groundMid: '#5A4228',
  groundLight: '#6A5238',
  groundDust: '#8A7A5A',
  groundBlood: '#4A1010',
  groundBloodWet: '#6A1818',
  mudDark: '#3A2818',
  mudLight: '#5A4030',
  // Dust and smoke
  dustLight: 'rgba(160,140,100,0.35)',
  dustMid: 'rgba(120,100,70,0.3)',
  dustDark: 'rgba(80,60,40,0.25)',
  smokeDark: 'rgba(30,20,15,0.6)',
  smokeMid: 'rgba(60,40,25,0.4)',
  smokeLight: 'rgba(100,80,50,0.3)',
  smokeWhite: 'rgba(180,170,150,0.25)',
  // Fire
  fireDark: '#A03010',
  fireMid: '#E06020',
  fireLight: '#FF9030',
  fireBright: '#FFCC60',
  fireGlow: 'rgba(255,120,30,0.3)',
  emberRed: '#C04020',
  emberOrange: '#E08030',
  emberYellow: '#FFC040',
  // Weapons & armor
  obsidian: '#2A2A3A',
  obsidianShine: '#4A4A6A',
  steelDark: '#5A5A5A',
  steelMid: '#8A8A8A',
  steelLight: '#B0B0B0',
  steelShine: 'rgba(255,255,255,0.2)',
  gold: '#D4A020',
  goldLight: '#F0C840',
  woodWeapon: '#6A4020',
  woodDark: '#4A2810',
  shieldGreen: '#1A5A2A',
  shieldRed: '#8A1010',
  // Aztec colors
  featherGreen: '#1A6B3A',
  featherRed: '#B02020',
  featherBlue: '#2040A0',
  jaguarSpot: '#C8A040',
  jaguarDark: '#5A4420',
  eagleWhite: '#D8D0C0',
  cottonWhite: '#E8E0D0',
  // Spanish colors
  spanishRed: '#8A1020',
  spanishBlue: '#1A2060',
  fabricCream: '#D8C8A0',
  leather: '#5A3820',
  // Atmospheric
  fogNear: 'rgba(80,60,40,0.2)',
  fogMid: 'rgba(60,40,25,0.15)',
  fogFar: 'rgba(40,20,15,0.1)',
  godRay: 'rgba(255,180,80,0.06)',
  godRayBright: 'rgba(255,200,100,0.1)',
  vignette: 'rgba(10,5,0,0.4)',
  bloodMist: 'rgba(120,20,10,0.08)',
  // Board
  boardBg: '#3A2818',
  boardFrame: '#5A3820',
  boardStone: '#6A5040',
  chalk: '#E8D8C0',
  // Outline
  outline: '#1A1A1A',
};

interface BattleSceneProps {
  boardText?: string;
  width?: number;
  height?: number;
}

// ---- Sub-component: Distant burning building silhouette ----
const BurningBuilding: React.FC<{
  x: number; y: number; w: number; h: number;
  fireIntensity: number; smokeDrift: number;
}> = ({ x, y, w, h, fireIntensity, smokeDrift }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Building silhouette */}
    <rect x={0} y={-h} width={w} height={h} fill={C.cityDark} />
    <rect x={2} y={-h + 4} width={w - 4} height={h - 4} fill={C.cityMid} opacity={0.5} />
    {/* Window openings glowing with fire */}
    {Array.from({ length: Math.floor(w / 12) }, (_, i) => (
      <rect key={`win-${i}`}
        x={4 + i * 12} y={-h + 8 + (i % 2) * 10}
        width={6} height={5}
        fill={C.cityFire} opacity={0.4 + fireIntensity * 0.3} />
    ))}
    {/* Fire on roof */}
    <g opacity={0.6 + fireIntensity * 0.3}>
      <path d={`M${w * 0.2},${-h} Q${w * 0.15},${-h - 12 - fireIntensity * 8} ${w * 0.3},${-h - 6}`}
        fill={C.fireMid} opacity={0.7} />
      <path d={`M${w * 0.5},${-h} Q${w * 0.45},${-h - 18 - fireIntensity * 12} ${w * 0.6},${-h - 8}`}
        fill={C.fireLight} opacity={0.6} />
      <path d={`M${w * 0.7},${-h} Q${w * 0.75},${-h - 10 - fireIntensity * 6} ${w * 0.8},${-h - 4}`}
        fill={C.fireMid} opacity={0.5} />
    </g>
    {/* Fire glow above building */}
    <ellipse cx={w / 2} cy={-h - 10} rx={w * 0.6} ry={15 + fireIntensity * 10}
      fill={C.cityFireGlow} opacity={0.3 + fireIntensity * 0.2} />
    {/* Smoke column rising */}
    <path d={`M${w * 0.4},${-h - 10}
      Q${w * 0.3 + smokeDrift * 3},${-h - 40} ${w * 0.5 + smokeDrift * 6},${-h - 70}
      Q${w * 0.4 + smokeDrift * 8},${-h - 100} ${w * 0.6 + smokeDrift * 10},${-h - 140}`}
      fill="none" stroke={C.smokeDark} strokeWidth={w * 0.4} strokeLinecap="round" opacity={0.5} />
    <path d={`M${w * 0.5},${-h - 5}
      Q${w * 0.6 + smokeDrift * 2},${-h - 30} ${w * 0.4 + smokeDrift * 5},${-h - 60}`}
      fill="none" stroke={C.smokeMid} strokeWidth={w * 0.3} strokeLinecap="round" opacity={0.4} />
  </g>
);

// ---- Sub-component: Temple pyramid silhouette ----
const TempleSilhouette: React.FC<{
  x: number; y: number; w: number; h: number;
  fireGlow: number;
}> = ({ x, y, w, h, fireGlow }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Stepped pyramid shape */}
    <path d={`M0,0
      L${w * 0.1},${-h * 0.3}
      L${w * 0.15},${-h * 0.3}
      L${w * 0.2},${-h * 0.55}
      L${w * 0.25},${-h * 0.55}
      L${w * 0.3},${-h * 0.75}
      L${w * 0.35},${-h * 0.75}
      L${w * 0.4},${-h}
      L${w * 0.6},${-h}
      L${w * 0.65},${-h * 0.75}
      L${w * 0.7},${-h * 0.75}
      L${w * 0.75},${-h * 0.55}
      L${w * 0.8},${-h * 0.55}
      L${w * 0.85},${-h * 0.3}
      L${w * 0.9},${-h * 0.3}
      L${w},0 Z`}
      fill={C.cityDark} />
    {/* Temple structure at top */}
    <rect x={w * 0.38} y={-h - 12} width={w * 0.24} height={14} fill={C.cityMid} />
    {/* Step details */}
    <line x1={w * 0.1} y1={-h * 0.3} x2={w * 0.9} y2={-h * 0.3} stroke={C.cityLight} strokeWidth={0.5} opacity={0.3} />
    <line x1={w * 0.2} y1={-h * 0.55} x2={w * 0.8} y2={-h * 0.55} stroke={C.cityLight} strokeWidth={0.5} opacity={0.3} />
    <line x1={w * 0.3} y1={-h * 0.75} x2={w * 0.7} y2={-h * 0.75} stroke={C.cityLight} strokeWidth={0.5} opacity={0.3} />
    {/* Fire at temple top */}
    <g transform={`translate(${w * 0.5}, ${-h - 12})`}>
      <ellipse cx={0} cy={-8} rx={12 + fireGlow * 5} ry={8 + fireGlow * 3}
        fill={C.fireGlow} opacity={0.4 + fireGlow * 0.2} />
      <path d={`M-4,0 Q-6,${-10 - fireGlow * 6} 0,${-16 - fireGlow * 8} Q6,${-10 - fireGlow * 6} 4,0`}
        fill={C.fireMid} opacity={0.6} />
      <path d={`M-2,0 Q-3,${-8 - fireGlow * 4} 0,${-12 - fireGlow * 6} Q3,${-8 - fireGlow * 4} 2,0`}
        fill={C.fireLight} opacity={0.5} />
    </g>
  </g>
);

// ---- Sub-component: Cannon with smoke plume ----
const Cannon: React.FC<{
  x: number; y: number; scale: number;
  fireCycle: number; smokeDrift: number;
}> = ({ x, y, scale, fireCycle, smokeDrift }) => {
  const isFiring = fireCycle > 0.7;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Cannon wheels */}
      <circle cx={-8} cy={2} r={6} fill={C.woodDark} stroke={C.outline} strokeWidth={1} />
      <circle cx={-8} cy={2} r={2} fill={C.steelDark} />
      <circle cx={8} cy={2} r={6} fill={C.woodDark} stroke={C.outline} strokeWidth={1} />
      <circle cx={8} cy={2} r={2} fill={C.steelDark} />
      {/* Wheel spokes */}
      {[0, 60, 120].map((angle, i) => (
        <React.Fragment key={`spoke-${i}`}>
          <line x1={-8 + Math.cos(angle * Math.PI / 180) * 2} y1={2 + Math.sin(angle * Math.PI / 180) * 2}
            x2={-8 + Math.cos(angle * Math.PI / 180) * 5.5} y2={2 + Math.sin(angle * Math.PI / 180) * 5.5}
            stroke={C.woodWeapon} strokeWidth={1} />
          <line x1={8 + Math.cos(angle * Math.PI / 180) * 2} y1={2 + Math.sin(angle * Math.PI / 180) * 2}
            x2={8 + Math.cos(angle * Math.PI / 180) * 5.5} y2={2 + Math.sin(angle * Math.PI / 180) * 5.5}
            stroke={C.woodWeapon} strokeWidth={1} />
        </React.Fragment>
      ))}
      {/* Cannon carriage */}
      <rect x={-10} y={-6} width={20} height={6} rx={1} fill={C.woodWeapon} stroke={C.outline} strokeWidth={0.8} />
      {/* Cannon barrel */}
      <rect x={-4} y={-12} width={30} height={8} rx={2} fill={C.steelDark} stroke={C.outline} strokeWidth={1} />
      <rect x={-2} y={-11} width={26} height={6} rx={1.5} fill={C.steelMid} />
      <line x1={0} y1={-10} x2={22} y2={-10} stroke={C.steelShine} strokeWidth={0.8} opacity={0.3} />
      {/* Barrel bands */}
      <rect x={4} y={-12} width={3} height={8} rx={0.5} fill={C.steelDark} opacity={0.4} />
      <rect x={14} y={-12} width={3} height={8} rx={0.5} fill={C.steelDark} opacity={0.4} />
      {/* Muzzle */}
      <ellipse cx={26} cy={-8} rx={4.5} ry={5} fill={C.steelDark} stroke={C.outline} strokeWidth={0.8} />
      <ellipse cx={26} cy={-8} rx={3} ry={3.5} fill="#2A2A2A" />
      {/* Firing effect */}
      {isFiring && (
        <g transform="translate(26, -8)">
          {/* Muzzle flash */}
          <ellipse cx={10} cy={0} rx={14} ry={8} fill={C.fireBright} opacity={0.8} />
          <ellipse cx={8} cy={0} rx={10} ry={6} fill="white" opacity={0.5} />
          {/* Smoke burst */}
          <ellipse cx={20 + smokeDrift * 4} cy={-2} rx={18 + smokeDrift * 8} ry={12 + smokeDrift * 3}
            fill={C.smokeWhite} opacity={0.6 - smokeDrift * 0.1} />
          <ellipse cx={30 + smokeDrift * 8} cy={-4} rx={14 + smokeDrift * 6} ry={10 + smokeDrift * 2}
            fill={C.smokeMid} opacity={0.4} />
        </g>
      )}
    </g>
  );
};

// ---- Sub-component: Fallen warrior on ground ----
const FallenWarrior: React.FC<{
  x: number; y: number; isAztec: boolean; rotation: number;
}> = ({ x, y, isAztec, rotation }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
    {/* Body lying */}
    <line x1={-10} y1={0} x2={10} y2={0}
      stroke={isAztec ? '#B8865A' : '#8A8A8A'} strokeWidth={4} strokeLinecap="round" />
    {/* Head */}
    <circle cx={-12} cy={0} r={3} fill={isAztec ? '#B8865A' : '#C8A880'}
      stroke={C.outline} strokeWidth={0.5} />
    {/* Shield or weapon nearby */}
    {isAztec ? (
      <circle cx={6} cy={-4} r={4} fill={C.shieldGreen} opacity={0.6} stroke={C.outline} strokeWidth={0.4} />
    ) : (
      <line x1={4} y1={-3} x2={14} y2={-6} stroke={C.steelMid} strokeWidth={1.5} opacity={0.5} />
    )}
    {/* Blood pool */}
    <ellipse cx={0} cy={2} rx={8} ry={3} fill={C.groundBlood} opacity={0.4} />
  </g>
);

// ---- Sub-component: Broken weapon/debris on ground ----
const BattleDebris: React.FC<{
  x: number; y: number; type: 'shield' | 'spear' | 'sword' | 'obsidian';
}> = ({ x, y, type }) => (
  <g transform={`translate(${x}, ${y})`}>
    {type === 'shield' && (
      <>
        <ellipse cx={0} cy={0} rx={6} ry={5} fill={C.shieldGreen} opacity={0.5}
          stroke={C.outline} strokeWidth={0.5} transform="rotate(25)" />
        <circle cx={0} cy={0} r={2} fill={C.gold} opacity={0.4} />
      </>
    )}
    {type === 'spear' && (
      <>
        <line x1={-12} y1={2} x2={12} y2={-1} stroke={C.woodWeapon} strokeWidth={2} opacity={0.6} />
        <path d="M12,-1 L16,-3 L14,1 Z" fill={C.obsidian} opacity={0.5} />
      </>
    )}
    {type === 'sword' && (
      <>
        <line x1={-8} y1={1} x2={8} y2={-1} stroke={C.steelMid} strokeWidth={1.5} opacity={0.5} />
        <rect x={-10} y={-1} width={4} height={3} rx={0.5} fill={C.gold} opacity={0.4} />
      </>
    )}
    {type === 'obsidian' && (
      <>
        <rect x={-6} y={-1} width={12} height={3} rx={0.5} fill={C.woodWeapon} opacity={0.5} />
        {[-4, -1, 2, 5].map((ox, i) => (
          <path key={`ob-${i}`} d={`M${ox},-1 L${ox - 1},-3 L${ox + 1},-1`}
            fill={C.obsidian} opacity={0.4} />
        ))}
      </>
    )}
  </g>
);

// ---- Sub-component: Dust cloud drifting ----
const DustCloud: React.FC<{
  x: number; y: number; size: number;
  drift: number; opacity: number;
}> = ({ x, y, size, drift, opacity }) => (
  <g transform={`translate(${x + drift}, ${y})`}>
    <ellipse cx={0} cy={0} rx={size * 1.5} ry={size * 0.6}
      fill={C.dustLight} opacity={opacity * 0.6} />
    <ellipse cx={size * 0.3} cy={-size * 0.2} rx={size} ry={size * 0.4}
      fill={C.dustMid} opacity={opacity * 0.4} />
    <ellipse cx={-size * 0.4} cy={size * 0.1} rx={size * 0.8} ry={size * 0.3}
      fill={C.dustDark} opacity={opacity * 0.3} />
  </g>
);

// ---- Sub-component: Smoke column from fires ----
const SmokeColumn: React.FC<{
  x: number; y: number; height: number; width: number;
  drift: number; opacity: number;
}> = ({ x, y, height, width: w, drift, opacity }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d={`M0,0
      Q${drift * 4},${-height * 0.3} ${drift * 8},${-height * 0.5}
      Q${drift * 10},${-height * 0.7} ${drift * 12},${-height}`}
      fill="none" stroke={C.smokeDark} strokeWidth={w} strokeLinecap="round" opacity={opacity * 0.5} />
    <path d={`M${w * 0.3},0
      Q${drift * 3 + w * 0.2},${-height * 0.25} ${drift * 7},${-height * 0.45}
      Q${drift * 9 + w * 0.1},${-height * 0.65} ${drift * 11},${-height * 0.9}`}
      fill="none" stroke={C.smokeMid} strokeWidth={w * 0.7} strokeLinecap="round" opacity={opacity * 0.3} />
  </g>
);

// ---- Sub-component: Spanish banner/standard ----
const SpanishBanner: React.FC<{
  x: number; y: number; sway: number;
}> = ({ x, y, sway }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Pole */}
    <line x1={0} y1={0} x2={0} y2={-60} stroke={C.woodDark} strokeWidth={2} strokeLinecap="round" />
    {/* Cross finial */}
    <line x1={-3} y1={-58} x2={3} y2={-58} stroke={C.gold} strokeWidth={1.5} />
    <line x1={0} y1={-62} x2={0} y2={-55} stroke={C.gold} strokeWidth={1.5} />
    {/* Banner fabric */}
    <path d={`M0,-55 Q${8 + sway * 3},-50 ${12 + sway * 4},-45
      L${10 + sway * 3},-35 Q${6 + sway * 2},-38 0,-40 Z`}
      fill={C.spanishRed} stroke={C.outline} strokeWidth={0.5} opacity={0.8} />
    {/* Cross on banner */}
    <line x1={4 + sway} y1={-50} x2={8 + sway * 2} y2={-50}
      stroke={C.gold} strokeWidth={1} opacity={0.6} />
    <line x1={6 + sway * 1.5} y1={-53} x2={6 + sway * 1.5} y2={-47}
      stroke={C.gold} strokeWidth={1} opacity={0.6} />
  </g>
);

// ---- Sub-component: Aztec war banner ----
const AztecBanner: React.FC<{
  x: number; y: number; sway: number;
}> = ({ x, y, sway }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Pole */}
    <line x1={0} y1={0} x2={0} y2={-65} stroke={C.woodWeapon} strokeWidth={2.5} strokeLinecap="round" />
    {/* Feathered top */}
    {[-3, -1, 1, 3].map((dx, i) => (
      <line key={`bf-${i}`}
        x1={0} y1={-65}
        x2={dx * 2 + sway} y2={-75 - Math.abs(dx) * 2}
        stroke={[C.featherGreen, C.featherRed, C.featherBlue, C.featherGreen][i]}
        strokeWidth={2} strokeLinecap="round" />
    ))}
    {/* Back-rack frame */}
    <path d={`M-2,-60 L-8 + ${sway},-50 L-6 + ${sway},-35 L-2,-30 Z`}
      fill={C.featherGreen} stroke={C.outline} strokeWidth={0.5} opacity={0.7} />
    <path d={`M2,-60 L8 + ${sway},-50 L6 + ${sway},-35 L2,-30 Z`}
      fill={C.featherRed} stroke={C.outline} strokeWidth={0.5} opacity={0.7} />
    {/* Gold disc center */}
    <circle cx={sway * 0.5} cy={-48} r={4} fill={C.gold} stroke={C.outline} strokeWidth={0.5} opacity={0.7} />
  </g>
);

// ---- Main BattleScene Component ----
export const BattleScene: React.FC<BattleSceneProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Animation variables
  const cloudDrift1 = sineWave(frame, 0.02) * 15;
  const cloudDrift2 = sineWave(frame, 0.025, 1) * 12;
  const cloudDrift3 = sineWave(frame, 0.018, 2) * 18;
  const smokeDrift1 = sineWave(frame, 0.03, 0.5) * 8;
  const smokeDrift2 = sineWave(frame, 0.035, 1.5) * 10;
  const smokeDrift3 = sineWave(frame, 0.028, 2.5) * 6;
  const fireFlicker1 = sineWave(frame, 0.15) * 0.5 + 0.5;
  const fireFlicker2 = sineWave(frame, 0.18, 1) * 0.5 + 0.5;
  const fireFlicker3 = sineWave(frame, 0.12, 2) * 0.5 + 0.5;
  const dustDrift1 = sineWave(frame, 0.04) * 20;
  const dustDrift2 = sineWave(frame, 0.05, 1.5) * 25;
  const dustDrift3 = sineWave(frame, 0.035, 3) * 15;
  const bannerSway1 = sineWave(frame, 0.1) * 3;
  const bannerSway2 = sineWave(frame, 0.12, 1) * 2.5;
  const cannonFire1 = sineWave(frame, 0.08, 0);
  const cannonFire2 = sineWave(frame, 0.08, 2);
  const godRayPulse = sineWave(frame, 0.03) * 0.03 + 0.06;
  const waterRipple = sineWave(frame, 0.1) * 2;
  const mistFloat = sineWave(frame, 0.02) * 10;
  const emberFloat1 = sineWave(frame, 0.08, 0) * 5;
  const emberFloat2 = sineWave(frame, 0.1, 1.5) * 4;
  const emberFloat3 = sineWave(frame, 0.07, 3) * 6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient - dramatic, dark, fiery */}
        <linearGradient id="bs-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="30%" stopColor={C.skyMid} />
          <stop offset="60%" stopColor={C.skyLow} />
          <stop offset="85%" stopColor={C.skyHorizon} />
          <stop offset="100%" stopColor={C.skyFire} />
        </linearGradient>

        {/* Ground gradient */}
        <linearGradient id="bs-ground" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.groundMid} />
          <stop offset="30%" stopColor={C.groundDark} />
          <stop offset="70%" stopColor={C.mudDark} />
          <stop offset="100%" stopColor={C.groundDark} />
        </linearGradient>

        {/* Lake gradient */}
        <linearGradient id="bs-lake" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.lakeDark} />
          <stop offset="50%" stopColor={C.lakeMid} />
          <stop offset="100%" stopColor={C.lakeLight} />
        </linearGradient>

        {/* Fire glow radial */}
        <radialGradient id="bs-fireglow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={C.fireGlow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Sun glow behind smoke */}
        <radialGradient id="bs-sunglow" cx="65%" cy="25%" r="35%">
          <stop offset="0%" stopColor={C.sunGlow} />
          <stop offset="60%" stopColor="rgba(255,120,40,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Vignette effect */}
        <radialGradient id="bs-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={C.vignette} />
        </radialGradient>

        {/* Blood mist effect */}
        <radialGradient id="bs-bloodmist" cx="50%" cy="65%" r="40%">
          <stop offset="0%" stopColor={C.bloodMist} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* God ray filter */}
        <linearGradient id="bs-godray1" x1="60%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor={C.godRayBright} />
          <stop offset="50%" stopColor={C.godRay} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Causeway stone pattern */}
        <pattern id="bs-stone-pattern" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
          <rect width="20" height="10" fill={C.causewayStone} />
          <line x1="0" y1="5" x2="20" y2="5" stroke={C.causewayShadow} strokeWidth={0.5} opacity={0.3} />
          <line x1="10" y1="0" x2="10" y2="5" stroke={C.causewayShadow} strokeWidth={0.5} opacity={0.3} />
          <line x1="0" y1="5" x2="0" y2="10" stroke={C.causewayShadow} strokeWidth={0.5} opacity={0.3} />
          <line x1="20" y1="5" x2="20" y2="10" stroke={C.causewayShadow} strokeWidth={0.5} opacity={0.3} />
        </pattern>

        {/* Ground texture pattern */}
        <pattern id="bs-ground-tex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="rgba(0,0,0,0)" />
          <circle cx="8" cy="12" r="1" fill={C.groundDust} opacity={0.15} />
          <circle cx="25" cy="6" r="0.8" fill={C.groundDust} opacity={0.1} />
          <circle cx="32" cy="28" r="1.2" fill={C.groundDust} opacity={0.12} />
          <circle cx="15" cy="35" r="0.6" fill={C.groundDust} opacity={0.1} />
          <path d="M5,22 Q8,20 11,22" fill="none" stroke={C.mudLight} strokeWidth={0.3} opacity={0.1} />
          <path d="M28,15 Q30,13 33,15" fill="none" stroke={C.mudLight} strokeWidth={0.3} opacity={0.08} />
        </pattern>

        {/* Smoke blur filter for depth */}
        <filter id="bs-smoke-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        {/* Fire glow filter */}
        <filter id="bs-fire-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        {/* Mountain atmospheric gradient */}
        <linearGradient id="bs-mountain-haze" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(40,20,15,0)" />
          <stop offset="60%" stopColor="rgba(40,20,15,0.08)" />
          <stop offset="100%" stopColor="rgba(100,60,30,0.15)" />
        </linearGradient>

        {/* Lake reflection gradient */}
        <linearGradient id="bs-lake-reflect" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,120,40,0.12)" />
          <stop offset="50%" stopColor="rgba(255,80,20,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Dust particle pattern */}
        <pattern id="bs-dust-particles" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="15" r="0.5" fill={C.groundDust} opacity={0.08} />
          <circle cx="30" cy="8" r="0.3" fill={C.groundDust} opacity={0.06} />
          <circle cx="45" cy="35" r="0.6" fill={C.groundDust} opacity={0.07} />
          <circle cx="20" cy="48" r="0.4" fill={C.groundDust} opacity={0.05} />
          <circle cx="52" cy="22" r="0.5" fill={C.groundDust} opacity={0.06} />
          <circle cx="8" cy="42" r="0.3" fill={C.groundDust} opacity={0.04} />
          <circle cx="38" cy="55" r="0.4" fill={C.groundDust} opacity={0.05} />
        </pattern>

        {/* Canvas texture for oil painting feel */}
        <pattern id="bs-canvas" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="rgba(0,0,0,0)" />
          <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(0,0,0,0.01)" strokeWidth={0.3} />
          <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(0,0,0,0.008)" strokeWidth={0.3} />
          <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.01)" strokeWidth={0.3} />
          <line x1="2" y1="0" x2="2" y2="4" stroke="rgba(0,0,0,0.008)" strokeWidth={0.3} />
        </pattern>
      </defs>

      {/* ============================================================ */}
      {/* LAYER 1: SKY (background) */}
      {/* ============================================================ */}

      {/* Base sky gradient */}
      <rect x={0} y={0} width={width} height={height * 0.45} fill="url(#bs-sky)" />

      {/* Sun glow (partially obscured by smoke) */}
      <rect x={0} y={0} width={width} height={height * 0.5} fill="url(#bs-sunglow)" />

      {/* Sun disc behind smoke/clouds */}
      <circle cx={width * 0.65} cy={height * 0.18} r={35}
        fill={C.sunCore} opacity={0.2} />
      <circle cx={width * 0.65} cy={height * 0.18} r={60}
        fill={C.sunGlow} opacity={0.15} />

      {/* === DRAMATIC CLOUDS === */}

      {/* Far cloud layer */}
      <g opacity={0.6}>
        <ellipse cx={200 + cloudDrift1} cy={80} rx={180} ry={40}
          fill={C.cloudDark} />
        <ellipse cx={220 + cloudDrift1} cy={75} rx={140} ry={30}
          fill={C.cloudMid} opacity={0.5} />
        <ellipse cx={600 + cloudDrift2} cy={60} rx={220} ry={45}
          fill={C.cloudDark} />
        <ellipse cx={620 + cloudDrift2} cy={55} rx={160} ry={30}
          fill={C.cloudMid} opacity={0.4} />
        <ellipse cx={1100 + cloudDrift3} cy={90} rx={250} ry={50}
          fill={C.cloudDark} />
        <ellipse cx={1120 + cloudDrift3} cy={85} rx={180} ry={35}
          fill={C.cloudMid} opacity={0.5} />
        <ellipse cx={1500 + cloudDrift1 * 0.5} cy={70} rx={200} ry={38}
          fill={C.cloudDark} />
      </g>

      {/* Mid cloud layer with fire highlights */}
      <g opacity={0.7}>
        <ellipse cx={350 + cloudDrift2 * 0.8} cy={140} rx={200} ry={35}
          fill={C.cloudMid} />
        <ellipse cx={370 + cloudDrift2 * 0.8} cy={135} rx={150} ry={25}
          fill={C.cloudLight} opacity={0.4} />
        <ellipse cx={380 + cloudDrift2 * 0.8} cy={132} rx={80} ry={15}
          fill={C.cloudHighlight} opacity={0.25} />

        <ellipse cx={850 + cloudDrift1 * 0.6} cy={120} rx={240} ry={42}
          fill={C.cloudMid} />
        <ellipse cx={870 + cloudDrift1 * 0.6} cy={115} rx={180} ry={30}
          fill={C.cloudLight} opacity={0.4} />
        <ellipse cx={900 + cloudDrift1 * 0.6} cy={110} rx={100} ry={18}
          fill={C.cloudHighlight} opacity={0.3} />

        <ellipse cx={1400 + cloudDrift3 * 0.7} cy={130} rx={220} ry={38}
          fill={C.cloudMid} />
        <ellipse cx={1420 + cloudDrift3 * 0.7} cy={125} rx={160} ry={28}
          fill={C.cloudLight} opacity={0.35} />
      </g>

      {/* Near cloud layer (low, ominous) */}
      <g opacity={0.5}>
        <ellipse cx={150 + cloudDrift3} cy={200} rx={300} ry={50}
          fill={C.cloudDark} />
        <ellipse cx={700 + cloudDrift1 * 1.2} cy={180} rx={280} ry={45}
          fill={C.cloudDark} />
        <ellipse cx={1300 + cloudDrift2 * 0.9} cy={190} rx={320} ry={55}
          fill={C.cloudDark} />
        <ellipse cx={1700 + cloudDrift3 * 0.6} cy={210} rx={250} ry={40}
          fill={C.cloudDark} />
      </g>

      {/* Fire-lit cloud undersides */}
      <g opacity={0.35}>
        <ellipse cx={800 + cloudDrift1 * 0.5} cy={170} rx={300} ry={25}
          fill={C.cloudEmber} />
        <ellipse cx={500 + cloudDrift2 * 0.4} cy={185} rx={200} ry={20}
          fill={C.cloudHighlight} />
        <ellipse cx={1200 + cloudDrift3 * 0.3} cy={175} rx={250} ry={22}
          fill={C.cloudEmber} />
      </g>

      {/* God rays breaking through clouds */}
      <g opacity={godRayPulse}>
        <polygon points={`${width * 0.6},0 ${width * 0.52},${height * 0.5} ${width * 0.58},${height * 0.5}`}
          fill="url(#bs-godray1)" />
        <polygon points={`${width * 0.7},0 ${width * 0.64},${height * 0.45} ${width * 0.68},${height * 0.45}`}
          fill="url(#bs-godray1)" />
        <polygon points={`${width * 0.45},${height * 0.05} ${width * 0.4},${height * 0.48} ${width * 0.44},${height * 0.48}`}
          fill="url(#bs-godray1)" />
      </g>

      {/* ============================================================ */}
      {/* LAYER 2: DISTANT MOUNTAINS */}
      {/* ============================================================ */}

      {/* Far mountains */}
      <path d={`M0,${height * 0.35}
        Q${width * 0.08},${height * 0.22} ${width * 0.15},${height * 0.28}
        Q${width * 0.2},${height * 0.18} ${width * 0.28},${height * 0.25}
        Q${width * 0.35},${height * 0.12} ${width * 0.42},${height * 0.2}
        L${width * 0.42},${height * 0.45}
        L0,${height * 0.45} Z`}
        fill={C.mountainFar} />

      {/* Popocatépetl (iconic snow-capped volcano) */}
      <path d={`M${width * 0.3},${height * 0.35}
        Q${width * 0.35},${height * 0.1} ${width * 0.42},${height * 0.08}
        Q${width * 0.49},${height * 0.1} ${width * 0.54},${height * 0.35}`}
        fill={C.mountainMid} />
      {/* Snow cap */}
      <path d={`M${width * 0.37},${height * 0.15}
        Q${width * 0.39},${height * 0.09} ${width * 0.42},${height * 0.08}
        Q${width * 0.45},${height * 0.09} ${width * 0.47},${height * 0.15}
        Q${width * 0.44},${height * 0.13} ${width * 0.42},${height * 0.12}
        Q${width * 0.4},${height * 0.13} ${width * 0.37},${height * 0.15} Z`}
        fill={C.mountainSnow} opacity={0.4} />
      <path d={`M${width * 0.39},${height * 0.12}
        Q${width * 0.41},${height * 0.095} ${width * 0.42},${height * 0.09}
        Q${width * 0.43},${height * 0.095} ${width * 0.45},${height * 0.12}`}
        fill={C.mountainSnowShadow} opacity={0.3} />

      {/* Iztaccíhuatl (sleeping woman volcano) */}
      <path d={`M${width * 0.5},${height * 0.35}
        Q${width * 0.55},${height * 0.2} ${width * 0.58},${height * 0.14}
        Q${width * 0.6},${height * 0.16} ${width * 0.63},${height * 0.13}
        Q${width * 0.66},${height * 0.16} ${width * 0.68},${height * 0.18}
        Q${width * 0.72},${height * 0.22} ${width * 0.78},${height * 0.35}`}
        fill={C.mountainNear} />
      {/* Snow patches */}
      <path d={`M${width * 0.57},${height * 0.17}
        Q${width * 0.58},${height * 0.145} ${width * 0.59},${height * 0.15}
        Q${width * 0.6},${height * 0.16} ${width * 0.58},${height * 0.18}`}
        fill={C.mountainSnow} opacity={0.3} />
      <path d={`M${width * 0.62},${height * 0.15}
        Q${width * 0.63},${height * 0.135} ${width * 0.64},${height * 0.14}
        Q${width * 0.65},${height * 0.16} ${width * 0.63},${height * 0.17}`}
        fill={C.mountainSnow} opacity={0.25} />

      {/* Right side mountains */}
      <path d={`M${width * 0.7},${height * 0.35}
        Q${width * 0.78},${height * 0.2} ${width * 0.85},${height * 0.22}
        Q${width * 0.92},${height * 0.18} ${width},${height * 0.25}
        L${width},${height * 0.45}
        L${width * 0.7},${height * 0.45} Z`}
        fill={C.mountainFar} />

      {/* Mountain atmospheric haze */}
      <rect x={0} y={height * 0.25} width={width} height={height * 0.2}
        fill={C.fogFar} opacity={0.6} />

      {/* ============================================================ */}
      {/* LAYER 3: LAKE AND CITY SKYLINE (mid-distance) */}
      {/* ============================================================ */}

      {/* Lake Texcoco */}
      <rect x={0} y={height * 0.32} width={width} height={height * 0.16}
        fill="url(#bs-lake)" opacity={0.7} />

      {/* Lake fire reflections */}
      <rect x={width * 0.2} y={height * 0.34} width={width * 0.6} height={height * 0.12}
        fill={C.lakeFireReflect} opacity={0.3 + fireFlicker1 * 0.15} />
      <rect x={width * 0.3} y={height * 0.35} width={width * 0.4} height={height * 0.08}
        fill={C.lakeReflection} opacity={0.2} />

      {/* Water ripple lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`wr-${i}`}
          x1={width * 0.05 + i * width * 0.12}
          y1={height * 0.36 + (i % 3) * 8 + waterRipple * (i % 2 === 0 ? 1 : -1)}
          x2={width * 0.05 + i * width * 0.12 + 60}
          y2={height * 0.36 + (i % 3) * 8 + waterRipple * (i % 2 === 0 ? 1 : -1)}
          stroke={C.lakeLight} strokeWidth={0.5} opacity={0.15} />
      ))}

      {/* Tenochtitlan city skyline (burning) */}
      {/* Left side buildings */}
      <BurningBuilding x={width * 0.15} y={height * 0.34} w={40} h={30}
        fireIntensity={fireFlicker1} smokeDrift={smokeDrift1} />
      <BurningBuilding x={width * 0.2} y={height * 0.33} w={35} h={25}
        fireIntensity={fireFlicker2} smokeDrift={smokeDrift2} />
      <BurningBuilding x={width * 0.25} y={height * 0.335} w={30} h={20}
        fireIntensity={fireFlicker3} smokeDrift={smokeDrift1} />

      {/* Templo Mayor (center, prominent) */}
      <TempleSilhouette x={width * 0.35} y={height * 0.34} w={120} h={80}
        fireGlow={fireFlicker1} />

      {/* Right side buildings */}
      <BurningBuilding x={width * 0.55} y={height * 0.335} w={35} h={28}
        fireIntensity={fireFlicker2} smokeDrift={smokeDrift3} />
      <BurningBuilding x={width * 0.6} y={height * 0.34} w={45} h={32}
        fireIntensity={fireFlicker1} smokeDrift={smokeDrift2} />
      <BurningBuilding x={width * 0.67} y={height * 0.336} w={30} h={22}
        fireIntensity={fireFlicker3} smokeDrift={smokeDrift1} />

      {/* Second temple */}
      <TempleSilhouette x={width * 0.72} y={height * 0.34} w={80} h={55}
        fireGlow={fireFlicker2} />

      {/* More distant buildings */}
      <BurningBuilding x={width * 0.82} y={height * 0.338} w={25} h={18}
        fireIntensity={fireFlicker1} smokeDrift={smokeDrift3} />
      <BurningBuilding x={width * 0.87} y={height * 0.34} w={30} h={20}
        fireIntensity={fireFlicker2} smokeDrift={smokeDrift1} />

      {/* Smoke columns from burning city */}
      <SmokeColumn x={width * 0.25} y={height * 0.28} height={150} width={25}
        drift={smokeDrift1} opacity={0.5} />
      <SmokeColumn x={width * 0.42} y={height * 0.24} height={180} width={35}
        drift={smokeDrift2} opacity={0.6} />
      <SmokeColumn x={width * 0.62} y={height * 0.26} height={160} width={28}
        drift={smokeDrift3} opacity={0.5} />
      <SmokeColumn x={width * 0.78} y={height * 0.27} height={140} width={22}
        drift={smokeDrift1} opacity={0.45} />

      {/* City haze overlay */}
      <rect x={0} y={height * 0.28} width={width} height={height * 0.12}
        fill={C.citySmoke} opacity={0.3} />

      {/* ============================================================ */}
      {/* LAYER 4: CAUSEWAY (connecting city to battlefield) */}
      {/* ============================================================ */}

      {/* Causeway (perspective, getting wider towards viewer) */}
      <path d={`M${width * 0.42},${height * 0.42}
        L${width * 0.35},${height * 0.52}
        L${width * 0.25},${height * 0.58}
        L0,${height * 0.62}
        L0,${height * 0.68}
        L${width * 0.28},${height * 0.63}
        L${width * 0.38},${height * 0.55}
        L${width * 0.48},${height * 0.42} Z`}
        fill="url(#bs-stone-pattern)" stroke={C.causewayEdge} strokeWidth={1} />

      {/* Causeway edge detail */}
      <path d={`M${width * 0.42},${height * 0.42}
        L${width * 0.35},${height * 0.52}
        L${width * 0.25},${height * 0.58}
        L0,${height * 0.62}`}
        fill="none" stroke={C.causewayShadow} strokeWidth={2} />
      <path d={`M${width * 0.48},${height * 0.42}
        L${width * 0.38},${height * 0.55}
        L${width * 0.28},${height * 0.63}
        L0,${height * 0.68}`}
        fill="none" stroke={C.causewayShadow} strokeWidth={2} />

      {/* Causeway damage/breaks */}
      <rect x={width * 0.32} y={height * 0.54} width={20} height={8}
        fill={C.lakeMid} opacity={0.6} />
      <rect x={width * 0.18} y={height * 0.6} width={25} height={10}
        fill={C.lakeMid} opacity={0.5} />

      {/* ============================================================ */}
      {/* LAYER 5: BATTLEFIELD GROUND */}
      {/* ============================================================ */}

      {/* Main ground plane */}
      <path d={`M0,${height * 0.55}
        Q${width * 0.3},${height * 0.52} ${width * 0.5},${height * 0.54}
        Q${width * 0.7},${height * 0.52} ${width},${height * 0.55}
        L${width},${height} L0,${height} Z`}
        fill="url(#bs-ground)" />

      {/* Ground texture overlay */}
      <rect x={0} y={height * 0.55} width={width} height={height * 0.45}
        fill="url(#bs-ground-tex)" />

      {/* Uneven ground details - ruts, tracks */}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={`rut-${i}`}
          d={`M${100 + i * 160},${height * 0.7 + (i % 3) * 20}
            Q${120 + i * 160},${height * 0.7 + (i % 3) * 20 - 3} ${140 + i * 160},${height * 0.7 + (i % 3) * 20}`}
          fill="none" stroke={C.mudDark} strokeWidth={1} opacity={0.15} />
      ))}

      {/* Blood splatters on ground */}
      <ellipse cx={width * 0.35} cy={height * 0.72} rx={25} ry={8}
        fill={C.groundBlood} opacity={0.25} />
      <ellipse cx={width * 0.55} cy={height * 0.68} rx={18} ry={6}
        fill={C.groundBloodWet} opacity={0.2} />
      <ellipse cx={width * 0.75} cy={height * 0.74} rx={22} ry={7}
        fill={C.groundBlood} opacity={0.2} />
      <ellipse cx={width * 0.45} cy={height * 0.78} rx={15} ry={5}
        fill={C.groundBloodWet} opacity={0.15} />
      <ellipse cx={width * 0.65} cy={height * 0.82} rx={20} ry={6}
        fill={C.groundBlood} opacity={0.18} />

      {/* ============================================================ */}
      {/* LAYER 6: FALLEN WARRIORS AND DEBRIS (on ground) */}
      {/* ============================================================ */}

      {/* Fallen warriors scattered across battlefield */}
      <FallenWarrior x={width * 0.2} y={height * 0.72} isAztec={true} rotation={-15} />
      <FallenWarrior x={width * 0.4} y={height * 0.76} isAztec={false} rotation={20} />
      <FallenWarrior x={width * 0.58} y={height * 0.7} isAztec={true} rotation={-8} />
      <FallenWarrior x={width * 0.72} y={height * 0.78} isAztec={false} rotation={12} />
      <FallenWarrior x={width * 0.88} y={height * 0.73} isAztec={true} rotation={-20} />
      <FallenWarrior x={width * 0.32} y={height * 0.82} isAztec={true} rotation={5} />
      <FallenWarrior x={width * 0.52} y={height * 0.84} isAztec={false} rotation={-10} />
      <FallenWarrior x={width * 0.8} y={height * 0.86} isAztec={true} rotation={15} />

      {/* Scattered weapons and debris */}
      <BattleDebris x={width * 0.15} y={height * 0.74} type="shield" />
      <BattleDebris x={width * 0.3} y={height * 0.7} type="spear" />
      <BattleDebris x={width * 0.48} y={height * 0.77} type="sword" />
      <BattleDebris x={width * 0.62} y={height * 0.72} type="obsidian" />
      <BattleDebris x={width * 0.78} y={height * 0.8} type="shield" />
      <BattleDebris x={width * 0.42} y={height * 0.85} type="spear" />
      <BattleDebris x={width * 0.68} y={height * 0.88} type="sword" />
      <BattleDebris x={width * 0.9} y={height * 0.76} type="obsidian" />
      <BattleDebris x={width * 0.1} y={height * 0.8} type="obsidian" />
      <BattleDebris x={width * 0.55} y={height * 0.9} type="shield" />

      {/* ============================================================ */}
      {/* LAYER 7: SPANISH CANNONS (right side) */}
      {/* ============================================================ */}

      <Cannon x={width * 0.82} y={height * 0.66} scale={0.9}
        fireCycle={cannonFire1} smokeDrift={smokeDrift1} />
      <Cannon x={width * 0.92} y={height * 0.7} scale={0.8}
        fireCycle={cannonFire2} smokeDrift={smokeDrift2} />

      {/* Cannonball impact craters */}
      <ellipse cx={width * 0.45} cy={height * 0.68} rx={12} ry={5}
        fill={C.mudDark} stroke={C.groundDark} strokeWidth={1} opacity={0.4} />
      <ellipse cx={width * 0.35} cy={height * 0.73} rx={10} ry={4}
        fill={C.mudDark} stroke={C.groundDark} strokeWidth={1} opacity={0.35} />

      {/* ============================================================ */}
      {/* LAYER 8: WAR BANNERS */}
      {/* ============================================================ */}

      {/* Aztec war banners (left side) */}
      <AztecBanner x={width * 0.18} y={height * 0.68} sway={bannerSway1} />
      <AztecBanner x={width * 0.28} y={height * 0.65} sway={bannerSway2} />

      {/* Spanish banners (right side) */}
      <SpanishBanner x={width * 0.78} y={height * 0.64} sway={bannerSway1} />
      <SpanishBanner x={width * 0.88} y={height * 0.67} sway={bannerSway2} />

      {/* ============================================================ */}
      {/* LAYER 9: CROWD FIGURES (fighting warriors) */}
      {/* ============================================================ */}

      <AztecCrowdLayer config={AZTEC_CROWD_CONFIGS.battle} />

      {/* ============================================================ */}
      {/* LAYER 10: DUST CLOUDS (foreground battlefield) */}
      {/* ============================================================ */}

      {/* Large dust clouds drifting across battlefield */}
      <DustCloud x={width * 0.1} y={height * 0.7} size={60} drift={dustDrift1} opacity={0.4} />
      <DustCloud x={width * 0.35} y={height * 0.66} size={80} drift={dustDrift2} opacity={0.35} />
      <DustCloud x={width * 0.55} y={height * 0.72} size={70} drift={dustDrift3} opacity={0.3} />
      <DustCloud x={width * 0.75} y={height * 0.68} size={90} drift={dustDrift1 * 0.8} opacity={0.35} />
      <DustCloud x={width * 0.9} y={height * 0.74} size={50} drift={dustDrift2 * 0.6} opacity={0.3} />

      {/* Foreground dust closer to viewer */}
      <DustCloud x={width * 0.05} y={height * 0.85} size={100} drift={dustDrift3 * 1.2} opacity={0.25} />
      <DustCloud x={width * 0.4} y={height * 0.88} size={120} drift={dustDrift1 * 1.3} opacity={0.2} />
      <DustCloud x={width * 0.7} y={height * 0.86} size={110} drift={dustDrift2 * 1.1} opacity={0.22} />

      {/* ============================================================ */}
      {/* LAYER 11: FIRE AND EMBERS */}
      {/* ============================================================ */}

      {/* Ground fires in the battlefield */}
      {[
        { x: width * 0.3, y: height * 0.65, s: 1 },
        { x: width * 0.5, y: height * 0.62, s: 0.8 },
        { x: width * 0.68, y: height * 0.66, s: 0.9 },
      ].map((fire, i) => (
        <g key={`gf-${i}`} transform={`translate(${fire.x}, ${fire.y}) scale(${fire.s})`}>
          <ellipse cx={0} cy={5} rx={15} ry={4} fill={C.fireGlow}
            opacity={0.3 + [fireFlicker1, fireFlicker2, fireFlicker3][i] * 0.2} />
          <path d={`M-8,0 Q-10,${-12 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 10} 0,${-20 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 14}
            Q10,${-12 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 10} 8,0`}
            fill={C.fireMid} opacity={0.6} />
          <path d={`M-4,0 Q-5,${-8 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 6} 0,${-14 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 8}
            Q5,${-8 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 6} 4,0`}
            fill={C.fireLight} opacity={0.5} />
          <path d={`M-2,0 Q-2,${-5 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 4} 0,${-8 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 5}
            Q2,${-5 - [fireFlicker1, fireFlicker2, fireFlicker3][i] * 4} 2,0`}
            fill={C.fireBright} opacity={0.4} />
        </g>
      ))}

      {/* Floating embers */}
      {Array.from({ length: 20 }, (_, i) => {
        const ex = 100 + (i * 97) % (width - 200);
        const baseY = height * 0.3 + (i * 43) % (height * 0.4);
        const ey = baseY + [emberFloat1, emberFloat2, emberFloat3][i % 3] * (1 + (i % 4));
        const eSize = 1 + (i % 3) * 0.5;
        const eOpacity = 0.3 + (i % 4) * 0.1;
        return (
          <circle key={`ember-${i}`}
            cx={ex} cy={ey} r={eSize}
            fill={[C.emberRed, C.emberOrange, C.emberYellow][i % 3]}
            opacity={eOpacity} />
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 12: FOREGROUND SMOKE AND MIST */}
      {/* ============================================================ */}

      {/* Low ground mist */}
      <ellipse cx={width * 0.2 + mistFloat} cy={height * 0.92}
        rx={200} ry={30} fill={C.fogNear} opacity={0.3} />
      <ellipse cx={width * 0.6 - mistFloat} cy={height * 0.94}
        rx={250} ry={35} fill={C.fogNear} opacity={0.25} />
      <ellipse cx={width * 0.85 + mistFloat * 0.5} cy={height * 0.9}
        rx={180} ry={25} fill={C.fogMid} opacity={0.2} />

      {/* Smoke wisps in foreground */}
      <path d={`M0,${height * 0.8}
        Q${smokeDrift1 * 5},${height * 0.75} ${width * 0.15 + smokeDrift1 * 8},${height * 0.7}
        Q${width * 0.25 + smokeDrift1 * 10},${height * 0.65} ${width * 0.3 + smokeDrift1 * 12},${height * 0.55}`}
        fill="none" stroke={C.smokeLight} strokeWidth={40} strokeLinecap="round" opacity={0.15} />

      <path d={`M${width},${height * 0.78}
        Q${width - smokeDrift2 * 5},${height * 0.73} ${width * 0.85 - smokeDrift2 * 8},${height * 0.68}
        Q${width * 0.75 - smokeDrift2 * 10},${height * 0.63} ${width * 0.7 - smokeDrift2 * 12},${height * 0.55}`}
        fill="none" stroke={C.smokeLight} strokeWidth={35} strokeLinecap="round" opacity={0.12} />

      {/* Blood mist overlay (subtle) */}
      <rect x={0} y={0} width={width} height={height} fill="url(#bs-bloodmist)" />

      {/* ============================================================ */}
      {/* LAYER 12B: FOREGROUND FIGHTING GROUPS */}
      {/* ============================================================ */}

      {/* Hand-drawn foreground warrior clash (left side - Aztec attacking) */}
      <g transform={`translate(${width * 0.22}, ${height * 0.78})`}>
        {/* Jaguar warrior lunging forward */}
        <g transform={`scale(1.3)`}>
          {/* Shadow */}
          <ellipse cx={0} cy={4} rx={18} ry={5} fill="rgba(0,0,0,0.2)" />
          {/* Back leg braced */}
          <line x1={-8} y1={-12} x2={-16} y2={4} stroke="#9A6E42" strokeWidth={4.5} strokeLinecap="round" />
          {/* Front leg lunging */}
          <line x1={4} y1={-12} x2={18 + sineWave(frame, 0.2) * 4} y2={2}
            stroke="#B8865A" strokeWidth={4.5} strokeLinecap="round" />
          {/* Body leaning into attack */}
          <line x1={0} y1={-12} x2={6 + sineWave(frame, 0.2) * 2} y2={-32}
            stroke="#B8865A" strokeWidth={6} strokeLinecap="round" />
          {/* Jaguar costume torso */}
          <rect x={2} y={-30} width={10} height={14} rx={2}
            fill={C.jaguarSpot} stroke={C.outline} strokeWidth={0.6} />
          <circle cx={5} cy={-26} r={1.5} fill={C.jaguarDark} />
          <circle cx={9} cy={-22} r={1.2} fill={C.jaguarDark} />
          <circle cx={6} cy={-19} r={1.4} fill={C.jaguarDark} />
          {/* Head with jaguar helmet */}
          <circle cx={8} cy={-36} r={6} fill="#B8865A" stroke={C.outline} strokeWidth={0.8} />
          <path d="M1,-38 Q0,-48 4,-50 Q8,-52 12,-50 Q16,-48 15,-38 L12,-36 L4,-36 Z"
            fill={C.jaguarSpot} stroke={C.outline} strokeWidth={0.6} />
          <path d="M2,-46 L0,-52 L5,-47 Z" fill={C.jaguarSpot} stroke={C.outline} strokeWidth={0.4} />
          <path d="M14,-46 L16,-52 L11,-47 Z" fill={C.jaguarSpot} stroke={C.outline} strokeWidth={0.4} />
          <circle cx={4} cy={-45} r={1.2} fill={C.jaguarDark} />
          <circle cx={12} cy={-45} r={1.2} fill={C.jaguarDark} />
          <path d="M3,-34 L4,-31 L6,-33 L8,-31 L10,-33 L12,-31 L13,-34"
            fill="white" stroke={C.outline} strokeWidth={0.4} />
          {/* Attacking arm with macuahuitl */}
          <line x1={8} y1={-28} x2={26 + sineWave(frame, 0.25) * 6} y2={-22}
            stroke="#B8865A" strokeWidth={3.5} strokeLinecap="round" />
          <g transform={`translate(${28 + sineWave(frame, 0.25) * 6}, -22) rotate(${-25 + sineWave(frame, 0.25) * 20})`}>
            <rect x={-2.5} y={-24} width={5} height={26} rx={1.5} fill={C.woodWeapon} stroke={C.outline} strokeWidth={0.6} />
            {[-20, -16, -12, -8, -4].map((oy, i) => (
              <React.Fragment key={`fob-${i}`}>
                <path d={`M-2.5,${oy} L-6,${oy - 2} L-2.5,${oy + 2.5} Z`} fill={C.obsidian} stroke={C.obsidianShine} strokeWidth={0.3} />
                <path d={`M2.5,${oy} L6,${oy - 2} L2.5,${oy + 2.5} Z`} fill={C.obsidian} stroke={C.obsidianShine} strokeWidth={0.3} />
              </React.Fragment>
            ))}
          </g>
          {/* Shield arm */}
          <line x1={4} y1={-26} x2={-10} y2={-20} stroke="#9A6E42" strokeWidth={3} strokeLinecap="round" />
          <circle cx={-14} cy={-18} r={10} fill={C.shieldGreen} stroke={C.outline} strokeWidth={1} />
          <circle cx={-14} cy={-18} r={6} fill={C.gold} stroke={C.outline} strokeWidth={0.5} />
          <circle cx={-14} cy={-18} r={3} fill="#40B0B0" />
          {/* Shield feather fringe */}
          {[-40, -20, 0, 20, 40].map((angle, fi) => (
            <line key={`sff-${fi}`}
              x1={-14 + Math.cos((angle + 180) * Math.PI / 180) * 10}
              y1={-18 + Math.sin((angle + 180) * Math.PI / 180) * 10}
              x2={-14 + Math.cos((angle + 180) * Math.PI / 180) * 15}
              y2={-18 + Math.sin((angle + 180) * Math.PI / 180) * 15}
              stroke={[C.featherRed, C.featherGreen, C.featherBlue, C.featherGreen, C.featherRed][fi]}
              strokeWidth={2} strokeLinecap="round" />
          ))}
          {/* Loincloth */}
          <path d="M-4,-14 L6,-14 L7,-9 L-5,-9 Z" fill={C.cottonWhite} stroke={C.outline} strokeWidth={0.5} />
          <path d="M-3,-9 L-2,-6 M0,-9 L1,-6 M3,-9 L4,-6" stroke={C.gold} strokeWidth={0.5} />
        </g>
      </g>

      {/* Spanish soldier defending (right foreground) */}
      <g transform={`translate(${width * 0.72}, ${height * 0.8})`}>
        <g transform="scale(-1.2, 1.2)">
          {/* Shadow */}
          <ellipse cx={0} cy={4} rx={16} ry={4.5} fill="rgba(0,0,0,0.2)" />
          {/* Legs with boots */}
          <line x1={-4} y1={-10} x2={-8} y2={4} stroke="#4A3828" strokeWidth={4.5} strokeLinecap="round" />
          <line x1={4} y1={-10} x2={6 + sineWave(frame, 0.18, 1) * 3} y2={4}
            stroke="#5A4838" strokeWidth={4.5} strokeLinecap="round" />
          <rect x={-10} y={1} width={6} height={5} rx={1} fill="#3A2818" stroke={C.outline} strokeWidth={0.5} />
          <rect x={4 + sineWave(frame, 0.18, 1) * 3} y={1} width={6} height={5} rx={1}
            fill="#3A2818" stroke={C.outline} strokeWidth={0.5} />
          {/* Steel cuirass body */}
          <path d="M-7,-10 L-7,-30 Q-7,-32 -5,-32 L5,-32 Q7,-32 7,-30 L7,-10 Z"
            fill={C.steelMid} stroke={C.outline} strokeWidth={1} />
          <line x1={-4} y1={-28} x2={-4} y2={-14} stroke={C.steelShine} strokeWidth={1.5} opacity={0.3} />
          <line x1={-6} y1={-20} x2={6} y2={-20} stroke={C.steelDark} strokeWidth={0.5} />
          <line x1={-6} y1={-25} x2={6} y2={-25} stroke={C.steelDark} strokeWidth={0.5} />
          {/* Morion helmet */}
          <circle cx={0} cy={-36} r={5.5} fill="#C8A880" stroke={C.outline} strokeWidth={0.8} />
          <path d="M-8,-35 L-6,-37 L6,-37 L8,-35 Z" fill={C.steelMid} stroke={C.outline} strokeWidth={0.5} />
          <path d="M-2,-39 Q0,-44 2,-39" fill={C.steelMid} stroke={C.outline} strokeWidth={0.5} />
          {/* Beard */}
          <path d="M-3,-33 Q0,-30 3,-33" fill="#5A3A1A" />
          {/* Sword arm raised to block */}
          <line x1={0} y1={-26} x2={14 + sineWave(frame, 0.2, 2) * 4} y2={-32}
            stroke="#C8A880" strokeWidth={3} strokeLinecap="round" />
          <g transform={`translate(${16 + sineWave(frame, 0.2, 2) * 4}, -34) rotate(${-50 + sineWave(frame, 0.2, 2) * 15})`}>
            <rect x={-1.5} y={-22} width={3} height={24} rx={0.5} fill={C.steelLight} stroke={C.outline} strokeWidth={0.5} />
            <line x1={0} y1={-20} x2={0} y2={0} stroke={C.steelShine} strokeWidth={0.5} opacity={0.3} />
            <rect x={-5} y={0} width={10} height={2.5} rx={0.5} fill={C.gold} stroke={C.outline} strokeWidth={0.3} />
            <circle cx={0} cy={5} r={2} fill={C.gold} stroke={C.outline} strokeWidth={0.3} />
          </g>
          {/* Shield arm */}
          <line x1={0} y1={-24} x2={-10} y2={-18} stroke="#C8A880" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={-14} cy={-16} r={9} fill={C.steelDark} stroke={C.outline} strokeWidth={1} />
          <circle cx={-14} cy={-16} r={5} fill="none" stroke={C.steelMid} strokeWidth={0.6} />
          <circle cx={-14} cy={-16} r={2.5} fill={C.gold} stroke={C.outline} strokeWidth={0.3} />
          {/* Red cross on shield */}
          <line x1={-14} y1={-20} x2={-14} y2={-12} stroke={C.spanishRed} strokeWidth={1.5} opacity={0.5} />
          <line x1={-18} y1={-16} x2={-10} y2={-16} stroke={C.spanishRed} strokeWidth={1.5} opacity={0.5} />
        </g>
      </g>

      {/* Additional midground fighting pairs */}
      {/* Pair 1: Eagle warrior vs soldier (center-left) */}
      <g transform={`translate(${width * 0.38}, ${height * 0.7}) scale(0.7)`}>
        <ellipse cx={0} cy={4} rx={30} ry={6} fill="rgba(0,0,0,0.15)" />
        {/* Eagle warrior */}
        <g>
          <line x1={-15} y1={-10} x2={-20} y2={3} stroke="#9A6E42" strokeWidth={3} strokeLinecap="round" />
          <line x1={-9} y1={-10} x2={-4 + sineWave(frame, 0.22, 3) * 3} y2={3}
            stroke="#B8865A" strokeWidth={3} strokeLinecap="round" />
          <line x1={-12} y1={-10} x2={-10} y2={-26} stroke="#B8865A" strokeWidth={4.5} strokeLinecap="round" />
          <rect x={-14} y={-24} width={8} height={12} rx={1.5} fill={C.eagleWhite} stroke={C.outline} strokeWidth={0.4} />
          <circle cx={-10} cy={-30} r={4} fill="#B8865A" stroke={C.outline} strokeWidth={0.6} />
          <path d="M-10,-35 L-14,-33 L-18,-38 L-13,-34 L-10,-36 L-7,-34 L-2,-38 L-6,-33 Z"
            fill={C.eagleWhite} stroke={C.outline} strokeWidth={0.4} />
          <line x1={-10} y1={-35} x2={-10} y2={-44} stroke={C.eagleWhite} strokeWidth={1.5} strokeLinecap="round" />
          <circle cx={-10} cy={-44} r={1.5} fill={C.featherRed} />
          <line x1={-10} y1={-24} x2={4 + sineWave(frame, 0.22, 3) * 5} y2={-20}
            stroke="#B8865A" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={4 + sineWave(frame, 0.22, 3) * 5} y1={-20} x2={6 + sineWave(frame, 0.22, 3) * 5} y2={-38}
            stroke={C.woodWeapon} strokeWidth={2} strokeLinecap="round" />
        </g>
        {/* Spanish soldier */}
        <g transform="translate(25, 0) scale(-1, 1)">
          <line x1={-4} y1={-10} x2={-6} y2={3} stroke="#4A3828" strokeWidth={3} strokeLinecap="round" />
          <line x1={3} y1={-10} x2={5} y2={3} stroke="#5A4838" strokeWidth={3} strokeLinecap="round" />
          <rect x={-5} y={-24} width={10} height={14} rx={1} fill={C.steelMid} stroke={C.outline} strokeWidth={0.5} />
          <circle cx={0} cy={-28} r={4} fill="#C8A880" stroke={C.outline} strokeWidth={0.5} />
          <path d="M-6,-27 L-4,-29 L4,-29 L6,-27" fill={C.steelMid} stroke={C.outline} strokeWidth={0.3} />
          <line x1={0} y1={-22} x2={12} y2={-18} stroke="#C8A880" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={12} y1={-18} x2={14} y2={-32} stroke={C.steelLight} strokeWidth={1.5} />
        </g>
      </g>

      {/* Pair 2: Jaguar warrior grappling with soldier (center-right) */}
      <g transform={`translate(${width * 0.6}, ${height * 0.72}) scale(0.65)`}>
        <ellipse cx={0} cy={4} rx={28} ry={5} fill="rgba(0,0,0,0.12)" />
        {/* Interlocked fighters */}
        <line x1={-10} y1={-8} x2={-14} y2={3} stroke="#9A6E42" strokeWidth={3} strokeLinecap="round" />
        <line x1={-4} y1={-8} x2={0} y2={3} stroke="#B8865A" strokeWidth={3} strokeLinecap="round" />
        <line x1={-7} y1={-8} x2={-5} y2={-22} stroke="#B8865A" strokeWidth={4.5} strokeLinecap="round" />
        <rect x={-9} y={-20} width={8} height={10} rx={1.5} fill={C.jaguarSpot} stroke={C.outline} strokeWidth={0.4} />
        <circle cx={-5} cy={-26} r={4} fill="#B8865A" stroke={C.outline} strokeWidth={0.6} />
        <path d="M-9,-28 Q-10,-36 -5,-38 Q0,-36 1,-28" fill={C.jaguarSpot} stroke={C.outline} strokeWidth={0.4} />
        {/* Grappling arms */}
        <line x1={-5} y1={-18} x2={8} y2={-16} stroke="#B8865A" strokeWidth={2.5} strokeLinecap="round" />
        {/* Soldier */}
        <line x1={10} y1={-8} x2={14} y2={3} stroke="#4A3828" strokeWidth={3} strokeLinecap="round" />
        <line x1={16} y1={-8} x2={18} y2={3} stroke="#5A4838" strokeWidth={3} strokeLinecap="round" />
        <rect x={8} y={-22} width={10} height={14} rx={1} fill={C.steelMid} stroke={C.outline} strokeWidth={0.5} />
        <circle cx={13} cy={-26} r={4} fill="#C8A880" stroke={C.outline} strokeWidth={0.5} />
        <path d="M8,-25 L10,-27 L16,-27 L18,-25" fill={C.steelMid} stroke={C.outline} strokeWidth={0.3} />
        <line x1={13} y1={-18} x2={4} y2={-16} stroke="#C8A880" strokeWidth={2.5} strokeLinecap="round" />
      </g>

      {/* ============================================================ */}
      {/* LAYER 12C: FOREGROUND GROUND DETAILS */}
      {/* ============================================================ */}

      {/* Rocks and rubble in foreground */}
      {[
        { x: width * 0.05, y: height * 0.88, rx: 12, ry: 6 },
        { x: width * 0.15, y: height * 0.92, rx: 8, ry: 4 },
        { x: width * 0.32, y: height * 0.9, rx: 15, ry: 7 },
        { x: width * 0.48, y: height * 0.94, rx: 10, ry: 5 },
        { x: width * 0.62, y: height * 0.91, rx: 13, ry: 6 },
        { x: width * 0.78, y: height * 0.93, rx: 9, ry: 4.5 },
        { x: width * 0.88, y: height * 0.89, rx: 11, ry: 5.5 },
        { x: width * 0.95, y: height * 0.95, rx: 7, ry: 3.5 },
      ].map((rock, i) => (
        <g key={`rock-${i}`} transform={`translate(${rock.x}, ${rock.y})`}>
          <ellipse cx={0} cy={0} rx={rock.rx} ry={rock.ry}
            fill={C.groundMid} stroke={C.outline} strokeWidth={0.5} />
          <ellipse cx={-rock.rx * 0.2} cy={-rock.ry * 0.3} rx={rock.rx * 0.5} ry={rock.ry * 0.4}
            fill={C.groundLight} opacity={0.3} />
          <line x1={-rock.rx * 0.3} y1={rock.ry * 0.1} x2={rock.rx * 0.2} y2={rock.ry * 0.2}
            stroke={C.groundDark} strokeWidth={0.4} opacity={0.3} />
        </g>
      ))}

      {/* Wheel tracks / drag marks in mud */}
      <path d={`M${width * 0.7},${height * 0.85} Q${width * 0.75},${height * 0.84} ${width * 0.82},${height * 0.86}
        Q${width * 0.88},${height * 0.87} ${width * 0.95},${height * 0.86}`}
        fill="none" stroke={C.mudDark} strokeWidth={3} opacity={0.2} />
      <path d={`M${width * 0.72},${height * 0.86} Q${width * 0.77},${height * 0.85} ${width * 0.84},${height * 0.87}
        Q${width * 0.9},${height * 0.88} ${width * 0.97},${height * 0.87}`}
        fill="none" stroke={C.mudDark} strokeWidth={3} opacity={0.18} />

      {/* Broken obsidian chips scattered */}
      {Array.from({ length: 15 }, (_, i) => {
        const cx = 80 + (i * 131) % (width - 160);
        const cy = height * 0.82 + (i * 47) % (height * 0.15);
        return (
          <path key={`chip-${i}`}
            d={`M${cx},${cy} L${cx + 2},${cy - 3} L${cx + 4},${cy} L${cx + 2},${cy + 1} Z`}
            fill={C.obsidian} opacity={0.2 + (i % 3) * 0.05} />
        );
      })}

      {/* Spent arrows in ground */}
      {[
        { x: width * 0.25, y: height * 0.78, angle: -70 },
        { x: width * 0.42, y: height * 0.82, angle: -65 },
        { x: width * 0.58, y: height * 0.76, angle: -80 },
        { x: width * 0.74, y: height * 0.84, angle: -60 },
        { x: width * 0.36, y: height * 0.88, angle: -75 },
        { x: width * 0.66, y: height * 0.9, angle: -68 },
      ].map((arrow, i) => (
        <g key={`arrow-${i}`} transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.angle})`}>
          <line x1={0} y1={0} x2={0} y2={-18} stroke={C.woodWeapon} strokeWidth={1.5} />
          <path d="M-1.5,-18 L0,-22 L1.5,-18 Z" fill={C.obsidian} />
          {/* Fletching */}
          <line x1={-2} y1={-2} x2={-1} y2={2} stroke={C.featherRed} strokeWidth={0.8} />
          <line x1={2} y1={-2} x2={1} y2={2} stroke={C.featherRed} strokeWidth={0.8} />
        </g>
      ))}

      {/* Trampled feathers on ground */}
      {Array.from({ length: 10 }, (_, i) => {
        const fx = 120 + (i * 183) % (width - 240);
        const fy = height * 0.75 + (i * 59) % (height * 0.18);
        const fcolor = [C.featherGreen, C.featherRed, C.featherBlue, C.eagleWhite][i % 4];
        return (
          <g key={`feather-${i}`} transform={`translate(${fx}, ${fy}) rotate(${(i * 37) % 360})`}>
            <path d={`M0,0 Q2,-4 1,-8 Q0,-6 -1,-8 Q-2,-4 0,0 Z`}
              fill={fcolor} opacity={0.25} />
            <line x1={0} y1={0} x2={0} y2={-7} stroke={fcolor} strokeWidth={0.3} opacity={0.2} />
          </g>
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 12D: ADDITIONAL SMOKE PLUMES FROM CANNONS */}
      {/* ============================================================ */}

      {/* Lingering cannon smoke clouds (right side) */}
      <g opacity={0.3}>
        <ellipse cx={width * 0.85 + smokeDrift1 * 3} cy={height * 0.6}
          rx={80} ry={25} fill={C.smokeWhite} />
        <ellipse cx={width * 0.9 + smokeDrift2 * 2} cy={height * 0.58}
          rx={60} ry={20} fill={C.smokeMid} />
        <ellipse cx={width * 0.88 + smokeDrift3 * 2.5} cy={height * 0.62}
          rx={70} ry={22} fill={C.smokeLight} />
      </g>

      {/* Gunpowder smoke drifting left from Spanish side */}
      <path d={`M${width * 0.8},${height * 0.65}
        Q${width * 0.7 + smokeDrift1 * 4},${height * 0.6} ${width * 0.6 + smokeDrift1 * 8},${height * 0.58}
        Q${width * 0.5 + smokeDrift1 * 10},${height * 0.56} ${width * 0.4 + smokeDrift1 * 12},${height * 0.55}`}
        fill="none" stroke={C.smokeWhite} strokeWidth={30} strokeLinecap="round" opacity={0.1} />

      {/* ============================================================ */}
      {/* LAYER 12E: HORSES AND RIDERS (additional foreground) */}
      {/* ============================================================ */}

      {/* Rearing horse silhouette (dramatic, right foreground) */}
      <g transform={`translate(${width * 0.85}, ${height * 0.75}) scale(-1, 1)`}>
        {/* Horse shadow */}
        <ellipse cx={0} cy={15} rx={30} ry={6} fill="rgba(0,0,0,0.2)" />
        {/* Rear legs (on ground) */}
        <line x1={-8} y1={0} x2={-10} y2={14} stroke="#5A3A1A" strokeWidth={3.5} strokeLinecap="round" />
        <line x1={-2} y1={0} x2={-4} y2={14} stroke="#6A4A2A" strokeWidth={3.5} strokeLinecap="round" />
        {/* Body angled up (rearing) */}
        <path d="M-10,0 Q-8,-10 0,-18 Q8,-24 14,-28"
          fill="none" stroke="#6A4A2A" strokeWidth={12} strokeLinecap="round" />
        <ellipse cx={2} cy={-14} rx={16} ry={10}
          fill="#6A4A2A" stroke={C.outline} strokeWidth={0.8} />
        {/* Front legs kicking */}
        <line x1={10} y1={-22} x2={14 + sineWave(frame, 0.25, 4) * 4} y2={-34}
          stroke="#5A3A1A" strokeWidth={3} strokeLinecap="round" />
        <line x1={12} y1={-20} x2={18 + sineWave(frame, 0.25, 5) * 3} y2={-32}
          stroke="#6A4A2A" strokeWidth={3} strokeLinecap="round" />
        {/* Neck and head */}
        <path d="M10,-22 Q14,-32 12,-40" fill="none" stroke="#6A4A2A" strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={12} cy={-44} rx={4} ry={5.5} fill="#6A4A2A" stroke={C.outline} strokeWidth={0.6} />
        <ellipse cx={14} cy={-40} rx={2.5} ry={2.5} fill="#7A5A3A" />
        <circle cx={10} cy={-46} r={1} fill={C.outline} />
        <path d="M10,-48 L9,-52 L11,-48" fill="#6A4A2A" stroke={C.outline} strokeWidth={0.4} />
        {/* Mane */}
        <path d="M10,-38 Q8,-44 10,-50" fill="none" stroke="#3A2010" strokeWidth={2.5} />
        {/* Rider */}
        <g transform="translate(2, -24)">
          <line x1={0} y1={0} x2={0} y2={-12} stroke={C.steelMid} strokeWidth={4.5} strokeLinecap="round" />
          <rect x={-3.5} y={-10} width={7} height={8} rx={1} fill={C.steelMid} stroke={C.outline} strokeWidth={0.4} />
          <circle cx={0} cy={-15} r={3.5} fill="#C8A880" stroke={C.outline} strokeWidth={0.5} />
          <path d="M-5,-14 L-3,-16 L3,-16 L5,-14" fill={C.steelMid} stroke={C.outline} strokeWidth={0.3} />
          {/* Rider arm with lance */}
          <line x1={2} y1={-8} x2={18} y2={-30} stroke={C.woodWeapon} strokeWidth={2} />
          <path d="M18,-30 L17,-36 L19,-36 Z" fill={C.steelLight} />
        </g>
      </g>

      {/* ============================================================ */}
      {/* LAYER 13: STONE TABLET BOARD */}
      {/* ============================================================ */}

      <g transform={`translate(${width * 0.5 - 220}, ${height * 0.88})`}>
        {/* Tablet shadow */}
        <rect x={-6} y={-6} width={452} height={112} rx={4}
          fill="rgba(0,0,0,0.3)" />
        {/* Stone tablet outer frame */}
        <rect x={-10} y={-10} width={460} height={120} rx={6}
          fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        {/* Inner stone surface */}
        <rect x={0} y={0} width={440} height={100} rx={3}
          fill={C.boardBg} />
        {/* Stone texture */}
        <rect x={0} y={0} width={440} height={100} rx={3}
          fill={C.boardStone} opacity={0.15} />
        {/* Cracks in stone */}
        <path d="M20,0 L25,15 L22,30" fill="none" stroke={C.outline} strokeWidth={0.3} opacity={0.2} />
        <path d="M420,10 L415,25 L418,40" fill="none" stroke={C.outline} strokeWidth={0.3} opacity={0.15} />
        {/* Aztec border pattern (step fret / xicalcoliuhqui) */}
        <g opacity={0.3}>
          {Array.from({ length: 22 }, (_, i) => (
            <path key={`bp-${i}`}
              d={`M${i * 20 + 5},2 L${i * 20 + 10},2 L${i * 20 + 10},6 L${i * 20 + 15},6 L${i * 20 + 15},2 L${i * 20 + 20},2`}
              fill="none" stroke={C.gold} strokeWidth={0.8} />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <path key={`bpb-${i}`}
              d={`M${i * 20 + 5},98 L${i * 20 + 10},98 L${i * 20 + 10},94 L${i * 20 + 15},94 L${i * 20 + 15},98 L${i * 20 + 20},98`}
              fill="none" stroke={C.gold} strokeWidth={0.8} />
          ))}
        </g>
        {/* Board text */}
        {boardText && (
          <text x={220} y={58} textAnchor="middle" fill={C.chalk}
            fontSize={36} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        )}
      </g>

      {/* ============================================================ */}
      {/* LAYER 14: ADDITIONAL FOREGROUND DETAILS */}
      {/* ============================================================ */}

      {/* Broken pottery and debris (foreground bottom) */}
      {[
        { x: width * 0.08, y: height * 0.95 },
        { x: width * 0.22, y: height * 0.96 },
        { x: width * 0.45, y: height * 0.97 },
        { x: width * 0.68, y: height * 0.95 },
        { x: width * 0.85, y: height * 0.96 },
      ].map((pot, i) => (
        <g key={`pot-${i}`} transform={`translate(${pot.x}, ${pot.y})`}>
          <path d={`M-6,0 Q-8,-4 -5,-8 Q-2,-6 0,-8 Q3,-5 4,-3 L2,0 Z`}
            fill="#A07040" stroke={C.outline} strokeWidth={0.4} opacity={0.3} />
          <line x1={-3} y1={-5} x2={1} y2={-4} stroke="#8A5A30" strokeWidth={0.3} opacity={0.2} />
        </g>
      ))}

      {/* Scattered cacao beans and jade pieces (trade goods trampled) */}
      {Array.from({ length: 12 }, (_, i) => {
        const bx = 60 + (i * 167) % (width - 120);
        const by = height * 0.86 + (i * 31) % (height * 0.1);
        return i % 3 === 0 ? (
          <circle key={`jade-${i}`} cx={bx} cy={by} r={2}
            fill="#3A8A5A" opacity={0.2} stroke={C.outline} strokeWidth={0.2} />
        ) : (
          <ellipse key={`cacao-${i}`} cx={bx} cy={by} rx={1.5} ry={1}
            fill="#4A2A10" opacity={0.15} />
        );
      })}

      {/* Torn fabric scraps (clothing remnants) */}
      {[
        { x: width * 0.18, y: height * 0.84, color: C.cottonWhite },
        { x: width * 0.38, y: height * 0.88, color: C.spanishRed },
        { x: width * 0.56, y: height * 0.82, color: C.featherGreen },
        { x: width * 0.72, y: height * 0.86, color: C.fabricCream },
        { x: width * 0.84, y: height * 0.9, color: C.jaguarSpot },
      ].map((scrap, i) => (
        <path key={`scrap-${i}`}
          d={`M${scrap.x},${scrap.y}
            Q${scrap.x + 4},${scrap.y - 3} ${scrap.x + 8},${scrap.y - 1}
            Q${scrap.x + 6},${scrap.y + 2} ${scrap.x + 2},${scrap.y + 1} Z`}
          fill={scrap.color} opacity={0.15} />
      ))}

      {/* Distant causeway with people fleeing (tiny figures) */}
      <g opacity={0.3}>
        {Array.from({ length: 8 }, (_, i) => {
          const fx = width * 0.12 + i * 35;
          const fy = height * 0.6 + i * 1.5;
          return (
            <g key={`flee-${i}`} transform={`translate(${fx}, ${fy})`}>
              <line x1={0} y1={0} x2={0} y2={-5} stroke={C.cottonWhite} strokeWidth={1.2} strokeLinecap="round" />
              <circle cx={0} cy={-6} r={1.2} fill="#B8865A" />
            </g>
          );
        })}
      </g>

      {/* Canoes on the lake (fleeing/supply) */}
      <g opacity={0.35}>
        {[
          { x: width * 0.15, y: height * 0.4 },
          { x: width * 0.55, y: height * 0.38 },
          { x: width * 0.8, y: height * 0.41 },
        ].map((canoe, i) => (
          <g key={`canoe-${i}`} transform={`translate(${canoe.x}, ${canoe.y + waterRipple * (i % 2 === 0 ? 1 : -1)})`}>
            <path d="M-12,0 Q-14,-3 -10,-4 L10,-4 Q14,-3 12,0 Z"
              fill={C.woodWeapon} stroke={C.outline} strokeWidth={0.4} />
            <line x1={-4} y1={-4} x2={-4} y2={-10} stroke="#B8865A" strokeWidth={1} />
            <circle cx={-4} cy={-11} r={1} fill="#B8865A" />
          </g>
        ))}
      </g>

      {/* Battlefield birds (vultures circling) */}
      {Array.from({ length: 6 }, (_, i) => {
        const bx = width * 0.2 + (i * width * 0.12);
        const baseBy = height * 0.15 + (i % 3) * 30;
        const by = baseBy + sineWave(frame, 0.04, i * 2) * 8;
        const wingAngle = sineWave(frame, 0.06, i * 1.5) * 8;
        return (
          <g key={`vulture-${i}`} transform={`translate(${bx}, ${by})`}>
            <path d={`M0,0 Q-${6 + wingAngle},-${3 + wingAngle * 0.3} -${12 + wingAngle},${1 + wingAngle * 0.2}`}
              fill="none" stroke={C.cloudDark} strokeWidth={1.2} strokeLinecap="round" />
            <path d={`M0,0 Q${6 + wingAngle},-${3 + wingAngle * 0.3} ${12 + wingAngle},${1 + wingAngle * 0.2}`}
              fill="none" stroke={C.cloudDark} strokeWidth={1.2} strokeLinecap="round" />
            <circle cx={0} cy={0} r={1} fill={C.cloudDark} />
          </g>
        );
      })}

      {/* Smoke trails from individual fires on causeway */}
      <g opacity={0.25}>
        <path d={`M${width * 0.32},${height * 0.54}
          Q${width * 0.3 + smokeDrift2 * 2},${height * 0.48} ${width * 0.28 + smokeDrift2 * 4},${height * 0.4}`}
          fill="none" stroke={C.smokeMid} strokeWidth={8} strokeLinecap="round" />
        <path d={`M${width * 0.18},${height * 0.6}
          Q${width * 0.16 + smokeDrift3 * 1.5},${height * 0.54} ${width * 0.14 + smokeDrift3 * 3},${height * 0.46}`}
          fill="none" stroke={C.smokeLight} strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* Additional blood spatters (subtle, foreground) */}
      {Array.from({ length: 8 }, (_, i) => {
        const sx = 150 + (i * 223) % (width - 300);
        const sy = height * 0.8 + (i * 37) % (height * 0.12);
        return (
          <g key={`splat-${i}`}>
            <circle cx={sx} cy={sy} r={3 + (i % 3)} fill={C.groundBloodWet} opacity={0.12} />
            <circle cx={sx + 4} cy={sy - 2} r={1.5} fill={C.groundBlood} opacity={0.1} />
            <circle cx={sx - 3} cy={sy + 1} r={1} fill={C.groundBlood} opacity={0.08} />
          </g>
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 15: ATMOSPHERIC OVERLAYS */}
      {/* ============================================================ */}

      {/* Overall fire glow overlay */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#bs-fireglow)" opacity={0.2} />

      {/* Vignette darkening edges */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#bs-vignette)" />

      {/* Top smoke haze (looking through battlefield smoke) */}
      <rect x={0} y={0} width={width} height={height * 0.15}
        fill={C.smokeDark} opacity={0.15} />

      {/* Side darkness (left and right vignette) */}
      <linearGradient id="bs-left-dark" x1="0%" y1="0%" x2="15%" y2="0%">
        <stop offset="0%" stopColor="rgba(10,5,0,0.25)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>
      <rect x={0} y={0} width={width * 0.2} height={height}
        fill="url(#bs-left-dark)" />
      <linearGradient id="bs-right-dark" x1="85%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(10,5,0,0.25)" />
      </linearGradient>
      <rect x={width * 0.8} y={0} width={width * 0.2} height={height}
        fill="url(#bs-right-dark)" />

      {/* Bottom foreground darkness */}
      <linearGradient id="bs-bottom-dark" x1="0%" y1="80%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(10,5,0,0.3)" />
      </linearGradient>
      <rect x={0} y={height * 0.8} width={width} height={height * 0.2}
        fill="url(#bs-bottom-dark)" />

      {/* Warm atmospheric color grading */}
      <rect x={0} y={0} width={width} height={height}
        fill="rgba(180,80,20,0.04)" />

      {/* Oil painting canvas texture overlay */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#bs-canvas)" opacity={0.5} />

      {/* Dust particle overlay (floating in air) */}
      <rect x={0} y={height * 0.4} width={width} height={height * 0.5}
        fill="url(#bs-dust-particles)" />

      {/* Subtle film grain texture (oil painting feel) */}
      <g opacity={0.03}>
        {Array.from({ length: 30 }, (_, i) => (
          <rect key={`grain-${i}`}
            x={(i * 71) % width} y={(i * 43) % height}
            width={2} height={2}
            fill={i % 2 === 0 ? '#FFF' : '#000'} />
        ))}
      </g>
    </svg>
  );
};

export default BattleScene;
