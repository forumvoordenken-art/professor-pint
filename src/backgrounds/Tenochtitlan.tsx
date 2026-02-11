// Tenochtitlan.tsx — The breathtaking Aztec capital city on Lake Texcoco
// Oil-painting quality: snow-capped volcanoes, island city, causeways, lake reflections
// Vermeer-level atmospheric depth with mist, god rays, golden hour lighting

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { AztecCrowdLayer, AZTEC_CROWD_CONFIGS } from '../crowds/AztecCrowd';

// ---- Color palette: 100+ named colors ----
const C = {
  // Sky
  skyZenith: '#1A3A6A',
  skyUpper: '#2A5A8A',
  skyMid: '#4A8AB8',
  skyLow: '#7AB8D8',
  skyHorizon: '#C8D8E8',
  skyWarm: '#E8D0B0',
  // Clouds
  cloudWhite: '#F0EEE8',
  cloudLight: '#D8D4C8',
  cloudMid: '#B8B0A0',
  cloudShadow: '#8A8478',
  cloudWarm: '#E8C8A0',
  cloudPink: '#E0B8B0',
  // Sun
  sunCore: '#FFF8E0',
  sunGlow: 'rgba(255,220,140,0.3)',
  sunRay: 'rgba(255,200,100,0.08)',
  sunRayBright: 'rgba(255,210,120,0.12)',
  // Volcanoes
  volcanoFar: '#4A3A5A',
  volcanoMid: '#5A4A6A',
  volcanoNear: '#6A5A78',
  volcanoBase: '#7A6A88',
  snowBright: '#F0ECE8',
  snowMid: '#D8D0C8',
  snowShadow: '#B0A8A0',
  snowBlue: '#C0C8D8',
  // Mountains
  mountainFar: '#5A5068',
  mountainMid: '#6A6078',
  mountainNear: '#7A7088',
  mountainFoot: '#8A8098',
  // Lake
  lakeDeep: '#1A3040',
  lakeMid: '#2A4A5A',
  lakeLight: '#3A6070',
  lakeSurface: '#4A7888',
  lakeShallow: '#5A8898',
  lakeReflectSky: 'rgba(120,180,220,0.15)',
  lakeReflectCity: 'rgba(180,140,80,0.12)',
  lakeReflectMtn: 'rgba(80,60,90,0.1)',
  lakeGlint: 'rgba(255,240,200,0.2)',
  lakeRipple: 'rgba(255,255,255,0.06)',
  // Chinampas
  chinampaDark: '#2A4A1A',
  chinampaMid: '#3A5A2A',
  chinampaLight: '#4A6A3A',
  chinampaEdge: '#5A4A2A',
  chinampaWater: '#3A5A5A',
  // Reeds
  reedDark: '#3A4A1A',
  reedLight: '#5A6A2A',
  reedTip: '#7A8A4A',
  // City - Templo Mayor
  templeStone: '#C8B898',
  templeShadow: '#8A7A60',
  templeLight: '#E0D0B0',
  templeRed: '#A04030',
  templeBlue: '#304080',
  templeStair: '#A08A68',
  templeStairShadow: '#7A6A4A',
  templeFireGlow: 'rgba(255,140,40,0.3)',
  // City buildings
  buildingWhite: '#E8E0D0',
  buildingCream: '#D8C8A8',
  buildingShadow: '#A08A68',
  buildingDark: '#7A6A50',
  buildingRoof: '#8A6A40',
  buildingRoofDark: '#6A4A28',
  // Palaces
  palaceWhite: '#F0E8D8',
  palaceCream: '#E0D0B0',
  palaceGold: '#D4A020',
  palaceGoldLight: '#F0C840',
  palaceRed: '#B04030',
  palaceBlue: '#2A4080',
  // Causeways
  causewayStone: '#B0A088',
  causewayShadow: '#8A7A60',
  causewayEdge: '#9A8A70',
  causewayWall: '#A09078',
  // Aqueduct
  aqueductStone: '#B8A890',
  aqueductShadow: '#8A7A60',
  aqueductWater: '#5A8898',
  aqueductArch: '#A09078',
  // Canoes
  canoeWood: '#7A5030',
  canoeDark: '#5A3820',
  canoeLight: '#9A7040',
  // Market
  marketAwning1: '#C83020',
  marketAwning2: '#2050A0',
  marketAwning3: '#D4A020',
  marketAwning4: '#1A6A3A',
  // Smoke/Fire
  templeSmoke: 'rgba(120,100,80,0.3)',
  templeFire: '#E08030',
  fireGlow: 'rgba(255,140,40,0.15)',
  incenseSmoke: 'rgba(160,150,140,0.2)',
  // Atmosphere
  fogNear: 'rgba(180,200,220,0.15)',
  fogMid: 'rgba(160,180,200,0.1)',
  fogFar: 'rgba(140,160,180,0.08)',
  mistLake: 'rgba(200,220,240,0.12)',
  godRay: 'rgba(255,220,140,0.06)',
  godRayBright: 'rgba(255,230,160,0.1)',
  haze: 'rgba(180,180,200,0.06)',
  vignette: 'rgba(20,15,30,0.3)',
  // Birds
  birdDark: '#2A2A3A',
  // Board
  boardStone: '#8A7A60',
  boardSurface: '#C8B898',
  boardFrame: '#6A5A40',
  boardText: '#2A1A0A',
  // Greenery
  treeDark: '#2A4A1A',
  treeMid: '#3A5A2A',
  treeLight: '#4A7A3A',
  treeHighlight: '#5A8A4A',
  cypressDark: '#1A3A1A',
  cypressMid: '#2A4A2A',
  // Water plants
  lilyPad: '#3A6A2A',
  lilyFlower: '#E0B0C0',
  // Outline
  outline: '#1A1A1A',
};

interface TenochtitlanProps {
  boardText?: string;
  width?: number;
  height?: number;
}

// ---- Sub-component: Snow-capped volcano ----
const Volcano: React.FC<{
  x: number; baseY: number; peakY: number; width: number;
  snowLine: number; fill: string; snowIntensity: number;
}> = ({ x, baseY, peakY, width: w, snowLine, fill, snowIntensity }) => (
  <g>
    {/* Main volcanic cone */}
    <path d={`M${x - w / 2},${baseY}
      Q${x - w * 0.15},${peakY + (baseY - peakY) * 0.3} ${x - w * 0.05},${peakY + 5}
      Q${x},${peakY} ${x + w * 0.05},${peakY + 5}
      Q${x + w * 0.15},${peakY + (baseY - peakY) * 0.3} ${x + w / 2},${baseY} Z`}
      fill={fill} />
    {/* Ridge detail lines */}
    <path d={`M${x - w * 0.1},${peakY + 15}
      Q${x - w * 0.08},${peakY + (baseY - peakY) * 0.4} ${x - w * 0.2},${baseY}`}
      fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1.5} />
    <path d={`M${x + w * 0.08},${peakY + 20}
      Q${x + w * 0.12},${peakY + (baseY - peakY) * 0.5} ${x + w * 0.25},${baseY}`}
      fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
    {/* Snow cap */}
    <path d={`M${x - w * 0.12},${snowLine}
      Q${x - w * 0.08},${peakY + 8} ${x - w * 0.04},${peakY + 4}
      Q${x},${peakY} ${x + w * 0.04},${peakY + 4}
      Q${x + w * 0.08},${peakY + 8} ${x + w * 0.12},${snowLine}
      Q${x + w * 0.06},${snowLine + 5} ${x},${snowLine + 8}
      Q${x - w * 0.06},${snowLine + 5} ${x - w * 0.12},${snowLine} Z`}
      fill={C.snowBright} opacity={snowIntensity} />
    {/* Snow shadow on one side */}
    <path d={`M${x},${peakY + 2}
      Q${x + w * 0.04},${peakY + 6} ${x + w * 0.1},${snowLine}
      Q${x + w * 0.05},${snowLine + 3} ${x},${snowLine + 6}
      Q${x - w * 0.02},${snowLine + 2} ${x},${peakY + 2} Z`}
      fill={C.snowShadow} opacity={snowIntensity * 0.4} />
    {/* Blue ice highlights */}
    <path d={`M${x - w * 0.03},${peakY + 10}
      Q${x - w * 0.06},${peakY + 15} ${x - w * 0.08},${snowLine - 5}`}
      fill="none" stroke={C.snowBlue} strokeWidth={2} opacity={snowIntensity * 0.3} />
  </g>
);

// ---- Sub-component: Stepped pyramid ----
const SteppedPyramid: React.FC<{
  x: number; y: number; w: number; h: number;
  steps: number; hasTemple: boolean; hasFire: boolean;
  fireFlicker: number; smokeOffset: number;
}> = ({ x, y, w, h, steps, hasTemple, hasFire, fireFlicker, smokeOffset }) => {
  const stepH = h / steps;
  const stepInset = w / (steps * 2 + 2);
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Pyramid steps from bottom to top */}
      {Array.from({ length: steps }, (_, i) => {
        const sw = w - i * stepInset * 2;
        const sx = -sw / 2;
        const sy = -i * stepH;
        return (
          <g key={`step-${i}`}>
            {/* Step body */}
            <rect x={sx} y={sy - stepH} width={sw} height={stepH}
              fill={i % 2 === 0 ? C.templeStone : C.templeLight}
              stroke={C.templeShadow} strokeWidth={0.5} />
            {/* Step shadow (front face) */}
            <rect x={sx} y={sy - 3} width={sw} height={3}
              fill={C.templeStairShadow} opacity={0.3} />
            {/* Step texture lines */}
            {Array.from({ length: Math.floor(sw / 15) }, (_, j) => (
              <line key={`sl-${j}`}
                x1={sx + 5 + j * 15} y1={sy - stepH + 2}
                x2={sx + 5 + j * 15} y2={sy - 2}
                stroke={C.templeShadow} strokeWidth={0.3} opacity={0.15} />
            ))}
          </g>
        );
      })}
      {/* Central staircase */}
      <rect x={-w * 0.08} y={-h} width={w * 0.16} height={h}
        fill={C.templeStair} stroke={C.templeStairShadow} strokeWidth={0.5} />
      {/* Stair lines */}
      {Array.from({ length: steps * 3 }, (_, i) => (
        <line key={`stair-${i}`}
          x1={-w * 0.08} y1={-h + i * (h / (steps * 3))}
          x2={w * 0.08} y2={-h + i * (h / (steps * 3))}
          stroke={C.templeStairShadow} strokeWidth={0.3} opacity={0.3} />
      ))}
      {/* Twin temples at top */}
      {hasTemple && (
        <g transform={`translate(0, ${-h})`}>
          {/* Left temple (Tlaloc - blue) */}
          <rect x={-w * 0.2} y={-stepH * 1.5} width={w * 0.18} height={stepH * 1.5}
            fill={C.templeBlue} stroke={C.outline} strokeWidth={0.5} />
          <path d={`M${-w * 0.22},${-stepH * 1.5} L${-w * 0.11},${-stepH * 2.2} L${-w * 0.01},${-stepH * 1.5} Z`}
            fill={C.templeBlue} stroke={C.outline} strokeWidth={0.5} />
          {/* Right temple (Huitzilopochtli - red) */}
          <rect x={w * 0.02} y={-stepH * 1.5} width={w * 0.18} height={stepH * 1.5}
            fill={C.templeRed} stroke={C.outline} strokeWidth={0.5} />
          <path d={`M${w * 0.01},${-stepH * 1.5} L${w * 0.11},${-stepH * 2.2} L${w * 0.21},${-stepH * 1.5} Z`}
            fill={C.templeRed} stroke={C.outline} strokeWidth={0.5} />
          {/* Door openings */}
          <rect x={-w * 0.15} y={-stepH * 0.8} width={w * 0.08} height={stepH * 0.8}
            fill={C.outline} opacity={0.6} />
          <rect x={w * 0.07} y={-stepH * 0.8} width={w * 0.08} height={stepH * 0.8}
            fill={C.outline} opacity={0.6} />
        </g>
      )}
      {/* Sacred fire at top */}
      {hasFire && (
        <g transform={`translate(0, ${-h - stepH * 1.2})`}>
          <ellipse cx={0} cy={6} rx={8 + fireFlicker * 4} ry={4 + fireFlicker * 2}
            fill={C.fireGlow} opacity={0.4 + fireFlicker * 0.2} />
          <path d={`M-4,2 Q-5,${-6 - fireFlicker * 8} 0,${-12 - fireFlicker * 12}
            Q5,${-6 - fireFlicker * 8} 4,2`}
            fill={C.templeFire} opacity={0.7} />
          <path d={`M-2,2 Q-3,${-4 - fireFlicker * 5} 0,${-8 - fireFlicker * 8}
            Q3,${-4 - fireFlicker * 5} 2,2`}
            fill="#FFCC60" opacity={0.5} />
          {/* Smoke from fire */}
          <path d={`M0,${-12 - fireFlicker * 12}
            Q${smokeOffset * 3},${-25 - fireFlicker * 10} ${smokeOffset * 6},${-40}
            Q${smokeOffset * 8},${-55} ${smokeOffset * 10},${-70}`}
            fill="none" stroke={C.templeSmoke} strokeWidth={6} strokeLinecap="round" opacity={0.4} />
        </g>
      )}
    </g>
  );
};

// ---- Sub-component: City building cluster ----
const BuildingCluster: React.FC<{
  x: number; y: number; count: number; maxH: number; spread: number;
}> = ({ x, y, count, maxH, spread }) => (
  <g transform={`translate(${x}, ${y})`}>
    {Array.from({ length: count }, (_, i) => {
      const bw = 8 + (i * 7) % 12;
      const bh = maxH * 0.4 + (i * 13) % (maxH * 0.6);
      const bx = -spread / 2 + (i * spread) / count;
      const isWhite = i % 3 !== 0;
      return (
        <g key={`bld-${i}`}>
          <rect x={bx} y={-bh} width={bw} height={bh}
            fill={isWhite ? C.buildingWhite : C.buildingCream}
            stroke={C.buildingShadow} strokeWidth={0.3} />
          {/* Flat roof */}
          <rect x={bx - 1} y={-bh - 2} width={bw + 2} height={3}
            fill={C.buildingRoof} opacity={0.5} />
          {/* Door */}
          <rect x={bx + bw * 0.3} y={-bh * 0.3} width={bw * 0.3} height={bh * 0.3}
            fill={C.buildingDark} opacity={0.4} />
          {/* Shadow side */}
          <rect x={bx + bw * 0.7} y={-bh} width={bw * 0.3} height={bh}
            fill={C.buildingShadow} opacity={0.15} />
        </g>
      );
    })}
  </g>
);

// ---- Sub-component: Canoe on water ----
const Canoe: React.FC<{
  x: number; y: number; scale: number; hasPaddler: boolean;
  bob: number; loaded?: boolean;
}> = ({ x, y, scale, hasPaddler, bob, loaded = false }) => (
  <g transform={`translate(${x}, ${y + bob}) scale(${scale})`}>
    {/* Water shadow/reflection */}
    <ellipse cx={0} cy={4} rx={16} ry={2.5} fill="rgba(0,0,0,0.08)" />
    {/* Canoe hull */}
    <path d="M-18,0 Q-20,-4 -16,-5 L16,-5 Q20,-4 18,0 Q14,3 0,3 Q-14,3 -18,0 Z"
      fill={C.canoeWood} stroke={C.canoeDark} strokeWidth={0.6} />
    {/* Hull texture */}
    <line x1={-14} y1={-3} x2={14} y2={-3} stroke={C.canoeLight} strokeWidth={0.4} opacity={0.3} />
    <line x1={-12} y1={-1} x2={12} y2={-1} stroke={C.canoeDark} strokeWidth={0.3} opacity={0.2} />
    {/* Goods in canoe */}
    {loaded && (
      <g>
        <rect x={-8} y={-7} width={6} height={4} rx={1} fill={C.buildingCream} opacity={0.6} />
        <circle cx={2} cy={-7} r={2.5} fill="#3A5A2A" opacity={0.5} />
        <rect x={5} y={-8} width={5} height={5} rx={0.5} fill="#A07040" opacity={0.5} />
      </g>
    )}
    {/* Paddler */}
    {hasPaddler && (
      <g transform="translate(-2, -5)">
        <line x1={0} y1={0} x2={0} y2={-8} stroke="#B8865A" strokeWidth={2} strokeLinecap="round" />
        <circle cx={0} cy={-10} r={2.5} fill="#B8865A" stroke={C.outline} strokeWidth={0.4} />
        <line x1={-2} y1={-11} x2={2} y2={-11} stroke="#E8E0D0" strokeWidth={1} />
        {/* Paddle */}
        <line x1={3} y1={-6} x2={8} y2={2} stroke={C.canoeWood} strokeWidth={1.2} />
        <path d="M7,0 L9,4 L7,4 Z" fill={C.canoeDark} />
      </g>
    )}
  </g>
);

// ---- Sub-component: Ahuejote (willow) tree ----
const WillowTree: React.FC<{
  x: number; y: number; scale: number; sway: number;
}> = ({ x, y, scale, sway }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Trunk */}
    <path d="M-3,0 Q-2,-15 -1,-30 Q0,-35 1,-30 Q2,-15 3,0 Z"
      fill="#5A3A20" stroke={C.outline} strokeWidth={0.4} />
    {/* Main branches */}
    <line x1={-1} y1={-25} x2={-10 + sway} y2={-20} stroke="#5A3A20" strokeWidth={1.5} />
    <line x1={1} y1={-28} x2={12 + sway} y2={-22} stroke="#5A3A20" strokeWidth={1.5} />
    <line x1={0} y1={-30} x2={-5 + sway * 0.5} y2={-38} stroke="#5A3A20" strokeWidth={1} />
    {/* Drooping willow fronds */}
    {[-12, -8, -4, 0, 4, 8, 12].map((dx, i) => (
      <path key={`frond-${i}`}
        d={`M${dx + sway * 0.3},${-28 - Math.abs(dx) * 0.3}
          Q${dx * 0.8 + sway * 0.8},${-15} ${dx * 0.6 + sway},${-2 + Math.abs(dx) * 0.2}`}
        fill="none"
        stroke={i % 2 === 0 ? C.treeMid : C.treeLight}
        strokeWidth={2} strokeLinecap="round" opacity={0.7} />
    ))}
    {/* Leaf clusters */}
    <ellipse cx={sway * 0.5} cy={-30} rx={14} ry={8}
      fill={C.treeMid} opacity={0.4} />
    <ellipse cx={sway * 0.3 - 2} cy={-28} rx={10} ry={6}
      fill={C.treeLight} opacity={0.3} />
  </g>
);

// ---- Sub-component: Reed cluster ----
const ReedCluster: React.FC<{
  x: number; y: number; count: number; maxH: number; sway: number;
}> = ({ x, y, count, maxH, sway }) => (
  <g transform={`translate(${x}, ${y})`}>
    {Array.from({ length: count }, (_, i) => {
      const rh = maxH * 0.6 + (i * 7) % (maxH * 0.4);
      const rx = -count * 1.5 + i * 3;
      const rSway = sway * (0.5 + (i % 3) * 0.25);
      return (
        <g key={`reed-${i}`}>
          <path d={`M${rx},0 Q${rx + rSway * 0.5},${-rh * 0.5} ${rx + rSway},${-rh}`}
            fill="none" stroke={i % 2 === 0 ? C.reedDark : C.reedLight}
            strokeWidth={1.5} strokeLinecap="round" />
          {/* Reed tip/seed head */}
          <ellipse cx={rx + rSway} cy={-rh - 3} rx={1} ry={3}
            fill={C.reedTip} opacity={0.6} />
        </g>
      );
    })}
  </g>
);

// ---- Main Component ----
export const Tenochtitlan: React.FC<TenochtitlanProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Animations
  const cloudDrift1 = sineWave(frame, 0.015) * 20;
  const cloudDrift2 = sineWave(frame, 0.02, 1) * 15;
  const cloudDrift3 = sineWave(frame, 0.012, 2.5) * 25;
  const waterRipple1 = sineWave(frame, 0.08) * 2;
  const waterRipple2 = sineWave(frame, 0.1, 1) * 1.5;
  const waterRipple3 = sineWave(frame, 0.06, 2) * 2.5;
  const waterGlint = sineWave(frame, 0.12) * 0.5 + 0.5;
  const fireFlicker1 = sineWave(frame, 0.15) * 0.5 + 0.5;
  const fireFlicker2 = sineWave(frame, 0.18, 1.2) * 0.5 + 0.5;
  const smokeDrift1 = sineWave(frame, 0.03, 0.5) * 6;
  const smokeDrift2 = sineWave(frame, 0.035, 1.5) * 8;
  const treeSway = sineWave(frame, 0.04) * 3;
  const reedSway = sineWave(frame, 0.06, 1) * 2;
  const birdFloat1 = sineWave(frame, 0.05) * 6;
  const birdFloat2 = sineWave(frame, 0.04, 2) * 5;
  const wingBeat = sineWave(frame, 0.08) * 6;
  const canoeBob1 = sineWave(frame, 0.07) * 1.5;
  const canoeBob2 = sineWave(frame, 0.08, 1) * 1.2;
  const canoeBob3 = sineWave(frame, 0.06, 2) * 1.8;
  const godRayPulse = sineWave(frame, 0.025) * 0.03 + 0.06;
  const mistFloat = sineWave(frame, 0.02) * 12;
  const flagSway = sineWave(frame, 0.1) * 3;
  const lilyBob = sineWave(frame, 0.05, 0.5) * 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient - golden hour from behind */}
        <linearGradient id="tn-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyZenith} />
          <stop offset="25%" stopColor={C.skyUpper} />
          <stop offset="50%" stopColor={C.skyMid} />
          <stop offset="75%" stopColor={C.skyLow} />
          <stop offset="90%" stopColor={C.skyHorizon} />
          <stop offset="100%" stopColor={C.skyWarm} />
        </linearGradient>

        {/* Lake gradient */}
        <linearGradient id="tn-lake" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.lakeSurface} />
          <stop offset="30%" stopColor={C.lakeMid} />
          <stop offset="70%" stopColor={C.lakeDeep} />
          <stop offset="100%" stopColor={C.lakeDeep} />
        </linearGradient>

        {/* Sun glow */}
        <radialGradient id="tn-sunglow" cx="50%" cy="18%" r="40%">
          <stop offset="0%" stopColor={C.sunGlow} />
          <stop offset="50%" stopColor="rgba(255,220,140,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Vignette */}
        <radialGradient id="tn-vignette" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="75%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={C.vignette} />
        </radialGradient>

        {/* God ray gradient */}
        <linearGradient id="tn-godray" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={C.godRayBright} />
          <stop offset="50%" stopColor={C.godRay} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Water reflection pattern */}
        <pattern id="tn-water-ripple" x="0" y="0" width="80" height="12" patternUnits="userSpaceOnUse">
          <path d="M0,6 Q20,3 40,6 Q60,9 80,6" fill="none" stroke={C.lakeRipple} strokeWidth={0.5} />
        </pattern>

        {/* Stone pattern for causeways */}
        <pattern id="tn-causeway-stone" x="0" y="0" width="16" height="8" patternUnits="userSpaceOnUse">
          <rect width="16" height="8" fill={C.causewayStone} />
          <line x1="0" y1="4" x2="16" y2="4" stroke={C.causewayShadow} strokeWidth={0.3} opacity={0.3} />
          <line x1="8" y1="0" x2="8" y2="4" stroke={C.causewayShadow} strokeWidth={0.3} opacity={0.3} />
          <line x1="0" y1="4" x2="0" y2="8" stroke={C.causewayShadow} strokeWidth={0.3} opacity={0.2} />
        </pattern>

        {/* Canvas texture */}
        <pattern id="tn-canvas" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="rgba(0,0,0,0)" />
          <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(0,0,0,0.008)" strokeWidth={0.3} />
          <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(0,0,0,0.006)" strokeWidth={0.3} />
          <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.008)" strokeWidth={0.3} />
          <line x1="2" y1="0" x2="2" y2="4" stroke="rgba(0,0,0,0.006)" strokeWidth={0.3} />
        </pattern>

        {/* Mountain haze gradient */}
        <linearGradient id="tn-mtn-haze" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={C.fogFar} />
        </linearGradient>
      </defs>

      {/* ============================================================ */}
      {/* LAYER 1: SKY */}
      {/* ============================================================ */}

      <rect x={0} y={0} width={width} height={height * 0.5} fill="url(#tn-sky)" />

      {/* Sun glow behind mountains */}
      <rect x={0} y={0} width={width} height={height * 0.55} fill="url(#tn-sunglow)" />

      {/* Sun disc (low, between volcanoes) */}
      <circle cx={width * 0.5} cy={height * 0.15} r={30}
        fill={C.sunCore} opacity={0.5} />
      <circle cx={width * 0.5} cy={height * 0.15} r={60}
        fill={C.sunGlow} opacity={0.25} />
      <circle cx={width * 0.5} cy={height * 0.15} r={100}
        fill="rgba(255,220,140,0.08)" />

      {/* === CLOUD LAYERS === */}

      {/* High cirrus clouds */}
      <g opacity={0.35}>
        <ellipse cx={300 + cloudDrift1} cy={50} rx={250} ry={15}
          fill={C.cloudLight} />
        <ellipse cx={800 + cloudDrift2 * 0.5} cy={40} rx={300} ry={12}
          fill={C.cloudWhite} />
        <ellipse cx={1400 + cloudDrift3 * 0.3} cy={55} rx={220} ry={14}
          fill={C.cloudLight} />
      </g>

      {/* Mid-level clouds */}
      <g opacity={0.5}>
        <ellipse cx={150 + cloudDrift2} cy={100} rx={200} ry={35}
          fill={C.cloudMid} />
        <ellipse cx={170 + cloudDrift2} cy={95} rx={150} ry={25}
          fill={C.cloudLight} opacity={0.6} />
        <ellipse cx={180 + cloudDrift2} cy={90} rx={80} ry={15}
          fill={C.cloudWhite} opacity={0.4} />

        <ellipse cx={650 + cloudDrift1 * 0.7} cy={80} rx={240} ry={40}
          fill={C.cloudMid} />
        <ellipse cx={670 + cloudDrift1 * 0.7} cy={75} rx={180} ry={28}
          fill={C.cloudLight} opacity={0.5} />
        <ellipse cx={690 + cloudDrift1 * 0.7} cy={72} rx={100} ry={16}
          fill={C.cloudWhite} opacity={0.4} />

        <ellipse cx={1200 + cloudDrift3 * 0.6} cy={95} rx={260} ry={38}
          fill={C.cloudMid} />
        <ellipse cx={1220 + cloudDrift3 * 0.6} cy={90} rx={190} ry={26}
          fill={C.cloudLight} opacity={0.5} />

        <ellipse cx={1650 + cloudDrift1 * 0.4} cy={85} rx={180} ry={30}
          fill={C.cloudMid} />
        <ellipse cx={1660 + cloudDrift1 * 0.4} cy={80} rx={120} ry={20}
          fill={C.cloudWhite} opacity={0.4} />
      </g>

      {/* Low clouds (warm undertones from sun) */}
      <g opacity={0.4}>
        <ellipse cx={400 + cloudDrift3} cy={160} rx={300} ry={28}
          fill={C.cloudShadow} />
        <ellipse cx={420 + cloudDrift3} cy={155} rx={200} ry={18}
          fill={C.cloudWarm} opacity={0.5} />

        <ellipse cx={1000 + cloudDrift2 * 0.8} cy={150} rx={280} ry={25}
          fill={C.cloudShadow} />
        <ellipse cx={1020 + cloudDrift2 * 0.8} cy={145} rx={180} ry={16}
          fill={C.cloudPink} opacity={0.4} />

        <ellipse cx={1600 + cloudDrift1 * 0.6} cy={165} rx={250} ry={22}
          fill={C.cloudShadow} />
      </g>

      {/* God rays from sun */}
      <g opacity={godRayPulse}>
        <polygon points={`${width * 0.48},${height * 0.05} ${width * 0.42},${height * 0.5} ${width * 0.46},${height * 0.5}`}
          fill="url(#tn-godray)" />
        <polygon points={`${width * 0.52},${height * 0.05} ${width * 0.56},${height * 0.55} ${width * 0.6},${height * 0.55}`}
          fill="url(#tn-godray)" />
        <polygon points={`${width * 0.44},${height * 0.08} ${width * 0.36},${height * 0.48} ${width * 0.4},${height * 0.48}`}
          fill="url(#tn-godray)" />
        <polygon points={`${width * 0.56},${height * 0.08} ${width * 0.64},${height * 0.5} ${width * 0.68},${height * 0.5}`}
          fill="url(#tn-godray)" />
      </g>

      {/* ============================================================ */}
      {/* LAYER 2: VOLCANOES AND MOUNTAINS */}
      {/* ============================================================ */}

      {/* Distant mountain range (far background) */}
      <path d={`M0,${height * 0.32}
        Q${width * 0.05},${height * 0.28} ${width * 0.1},${height * 0.3}
        Q${width * 0.15},${height * 0.25} ${width * 0.22},${height * 0.29}
        L${width * 0.22},${height * 0.38} L0,${height * 0.38} Z`}
        fill={C.mountainFar} />
      <path d={`M${width * 0.78},${height * 0.32}
        Q${width * 0.84},${height * 0.26} ${width * 0.9},${height * 0.29}
        Q${width * 0.95},${height * 0.25} ${width},${height * 0.3}
        L${width},${height * 0.38} L${width * 0.78},${height * 0.38} Z`}
        fill={C.mountainFar} />

      {/* Popocatépetl (left, iconic symmetric cone) */}
      <Volcano
        x={width * 0.32} baseY={height * 0.38} peakY={height * 0.06}
        width={width * 0.28} snowLine={height * 0.14}
        fill={C.volcanoMid} snowIntensity={0.7}
      />

      {/* Iztaccíhuatl (right, "sleeping woman" multi-peak) */}
      <g>
        <path d={`M${width * 0.56},${height * 0.38}
          Q${width * 0.6},${height * 0.22} ${width * 0.63},${height * 0.14}
          Q${width * 0.65},${height * 0.16} ${width * 0.67},${height * 0.12}
          Q${width * 0.69},${height * 0.15} ${width * 0.71},${height * 0.13}
          Q${width * 0.73},${height * 0.17} ${width * 0.76},${height * 0.2}
          Q${width * 0.8},${height * 0.26} ${width * 0.84},${height * 0.38}`}
          fill={C.volcanoNear} />
        {/* Multiple snow patches (sleeping woman's body) */}
        <path d={`M${width * 0.62},${height * 0.17}
          Q${width * 0.63},${height * 0.145} ${width * 0.635},${height * 0.15}
          Q${width * 0.64},${height * 0.17} ${width * 0.625},${height * 0.19}`}
          fill={C.snowBright} opacity={0.5} />
        <path d={`M${width * 0.665},${height * 0.14}
          Q${width * 0.67},${height * 0.125} ${width * 0.675},${height * 0.13}
          Q${width * 0.68},${height * 0.15} ${width * 0.67},${height * 0.16}`}
          fill={C.snowBright} opacity={0.55} />
        <path d={`M${width * 0.7},${height * 0.15}
          Q${width * 0.71},${height * 0.135} ${width * 0.715},${height * 0.14}
          Q${width * 0.72},${height * 0.16} ${width * 0.705},${height * 0.17}`}
          fill={C.snowMid} opacity={0.45} />
      </g>

      {/* Near foothills */}
      <path d={`M0,${height * 0.38}
        Q${width * 0.15},${height * 0.34} ${width * 0.25},${height * 0.36}
        Q${width * 0.4},${height * 0.32} ${width * 0.5},${height * 0.35}
        Q${width * 0.6},${height * 0.33} ${width * 0.75},${height * 0.36}
        Q${width * 0.88},${height * 0.34} ${width},${height * 0.37}
        L${width},${height * 0.42} L0,${height * 0.42} Z`}
        fill={C.mountainFoot} opacity={0.5} />

      {/* Mountain atmospheric haze */}
      <rect x={0} y={height * 0.25} width={width} height={height * 0.18}
        fill="url(#tn-mtn-haze)" />

      {/* ============================================================ */}
      {/* LAYER 3: LAKE TEXCOCO */}
      {/* ============================================================ */}

      {/* Main lake body */}
      <rect x={0} y={height * 0.36} width={width} height={height * 0.64}
        fill="url(#tn-lake)" />

      {/* Water ripple pattern */}
      <rect x={0} y={height * 0.38} width={width} height={height * 0.6}
        fill="url(#tn-water-ripple)" opacity={0.5} />

      {/* Sky reflection on water */}
      <rect x={0} y={height * 0.36} width={width} height={height * 0.15}
        fill={C.lakeReflectSky} />

      {/* Mountain reflection (blurred, inverted) */}
      <g opacity={0.12}>
        <path d={`M${width * 0.2},${height * 0.42}
          Q${width * 0.32},${height * 0.52} ${width * 0.44},${height * 0.42}
          L${width * 0.44},${height * 0.48} L${width * 0.2},${height * 0.48} Z`}
          fill={C.lakeReflectMtn} />
        <path d={`M${width * 0.56},${height * 0.42}
          Q${width * 0.7},${height * 0.55} ${width * 0.84},${height * 0.42}
          L${width * 0.84},${height * 0.5} L${width * 0.56},${height * 0.5} Z`}
          fill={C.lakeReflectMtn} />
      </g>

      {/* Water glint highlights (sunlight on water) */}
      {Array.from({ length: 20 }, (_, i) => {
        const gx = 80 + (i * 97) % (width - 160);
        const gy = height * 0.4 + (i * 31) % (height * 0.25);
        return (
          <line key={`glint-${i}`}
            x1={gx - 3} y1={gy + waterRipple1 * (i % 2 === 0 ? 1 : -1)}
            x2={gx + 3} y2={gy + waterRipple1 * (i % 2 === 0 ? 1 : -1)}
            stroke={C.lakeGlint} strokeWidth={0.8}
            opacity={(waterGlint * 0.3 + 0.1) * (i % 3 === 0 ? 1.2 : 0.8)} />
        );
      })}

      {/* Horizontal ripple lines */}
      {Array.from({ length: 15 }, (_, i) => {
        const ry = height * 0.42 + i * (height * 0.04);
        const rOffset = [waterRipple1, waterRipple2, waterRipple3][i % 3];
        return (
          <path key={`ripple-${i}`}
            d={`M${60 + i * 20},${ry + rOffset}
              Q${width * 0.25 + i * 10},${ry + rOffset - 1} ${width * 0.5},${ry + rOffset}
              Q${width * 0.75 - i * 10},${ry + rOffset + 1} ${width - 60 - i * 20},${ry + rOffset}`}
            fill="none" stroke={C.lakeRipple} strokeWidth={0.6} opacity={0.3 - i * 0.015} />
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 4: MAINLAND SHORE (distant) */}
      {/* ============================================================ */}

      {/* Distant shoreline */}
      <path d={`M0,${height * 0.38}
        Q${width * 0.1},${height * 0.39} ${width * 0.18},${height * 0.38}
        L${width * 0.18},${height * 0.42} L0,${height * 0.42} Z`}
        fill={C.chinampaEdge} opacity={0.4} />
      <path d={`M${width * 0.82},${height * 0.38}
        Q${width * 0.9},${height * 0.39} ${width},${height * 0.38}
        L${width},${height * 0.42} L${width * 0.82},${height * 0.42} Z`}
        fill={C.chinampaEdge} opacity={0.4} />

      {/* Distant shore vegetation */}
      {Array.from({ length: 12 }, (_, i) => {
        const tx = 20 + i * 15;
        return (
          <line key={`dtree-l-${i}`}
            x1={tx} y1={height * 0.39} x2={tx + treeSway * 0.3} y2={height * 0.35}
            stroke={C.treeDark} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const tx = width * 0.84 + i * 14;
        return (
          <line key={`dtree-r-${i}`}
            x1={tx} y1={height * 0.39} x2={tx + treeSway * 0.3} y2={height * 0.35}
            stroke={C.treeDark} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 5: CAUSEWAYS (3 main ones) */}
      {/* ============================================================ */}

      {/* Northern causeway (left, going to viewer) */}
      <path d={`M${width * 0.25},${height * 0.42}
        L${width * 0.15},${height * 0.52}
        L${width * 0.08},${height * 0.6}
        L0,${height * 0.72}
        L0,${height * 0.74}
        L${width * 0.1},${height * 0.62}
        L${width * 0.17},${height * 0.54}
        L${width * 0.27},${height * 0.42} Z`}
        fill="url(#tn-causeway-stone)" stroke={C.causewayEdge} strokeWidth={0.8} />
      {/* Causeway wall edge */}
      <path d={`M${width * 0.25},${height * 0.42}
        L${width * 0.15},${height * 0.52}
        L${width * 0.08},${height * 0.6} L0,${height * 0.72}`}
        fill="none" stroke={C.causewayShadow} strokeWidth={1.5} />

      {/* Southern causeway (right) */}
      <path d={`M${width * 0.72},${height * 0.42}
        L${width * 0.8},${height * 0.52}
        L${width * 0.88},${height * 0.62}
        L${width},${height * 0.74}
        L${width},${height * 0.76}
        L${width * 0.9},${height * 0.64}
        L${width * 0.82},${height * 0.54}
        L${width * 0.74},${height * 0.42} Z`}
        fill="url(#tn-causeway-stone)" stroke={C.causewayEdge} strokeWidth={0.8} />
      <path d={`M${width * 0.74},${height * 0.42}
        L${width * 0.82},${height * 0.54}
        L${width * 0.9},${height * 0.64} L${width},${height * 0.76}`}
        fill="none" stroke={C.causewayShadow} strokeWidth={1.5} />

      {/* Central causeway (straight towards viewer, center) */}
      <path d={`M${width * 0.48},${height * 0.43}
        L${width * 0.46},${height * 0.55}
        L${width * 0.44},${height * 0.68}
        L${width * 0.42},${height * 0.85}
        L${width * 0.58},${height * 0.85}
        L${width * 0.56},${height * 0.68}
        L${width * 0.54},${height * 0.55}
        L${width * 0.52},${height * 0.43} Z`}
        fill="url(#tn-causeway-stone)" stroke={C.causewayEdge} strokeWidth={0.8} />

      {/* ============================================================ */}
      {/* LAYER 6: AQUEDUCT */}
      {/* ============================================================ */}

      {/* Aqueduct running alongside western causeway */}
      <g opacity={0.7}>
        {Array.from({ length: 8 }, (_, i) => {
          const ax = width * 0.22 - i * 18;
          const ay = height * 0.43 + i * 12;
          return (
            <g key={`aq-${i}`} transform={`translate(${ax}, ${ay})`}>
              {/* Arch */}
              <path d="M-6,0 L-6,-8 Q0,-14 6,-8 L6,0"
                fill="none" stroke={C.aqueductStone} strokeWidth={2} />
              {/* Water channel on top */}
              <rect x={-7} y={-10} width={14} height={3}
                fill={C.aqueductStone} stroke={C.aqueductShadow} strokeWidth={0.5} />
              {/* Water visible */}
              <rect x={-5} y={-9} width={10} height={1.5}
                fill={C.aqueductWater} opacity={0.5} />
            </g>
          );
        })}
      </g>

      {/* ============================================================ */}
      {/* LAYER 7: ISLAND CITY - TENOCHTITLAN */}
      {/* ============================================================ */}

      {/* City island base */}
      <ellipse cx={width * 0.5} cy={height * 0.44} rx={width * 0.22} ry={height * 0.06}
        fill={C.chinampaEdge} opacity={0.5} />

      {/* City ground */}
      <ellipse cx={width * 0.5} cy={height * 0.43} rx={width * 0.21} ry={height * 0.055}
        fill={C.buildingCream} opacity={0.6} />

      {/* Background building clusters */}
      <BuildingCluster x={width * 0.35} y={height * 0.41} count={8} maxH={18} spread={80} />
      <BuildingCluster x={width * 0.65} y={height * 0.41} count={8} maxH={16} spread={70} />
      <BuildingCluster x={width * 0.42} y={height * 0.4} count={6} maxH={14} spread={50} />
      <BuildingCluster x={width * 0.58} y={height * 0.4} count={6} maxH={15} spread={55} />

      {/* Palace complex (left of Templo Mayor) */}
      <g transform={`translate(${width * 0.38}, ${height * 0.4})`}>
        <rect x={-30} y={-20} width={60} height={20}
          fill={C.palaceWhite} stroke={C.buildingShadow} strokeWidth={0.5} />
        <rect x={-32} y={-22} width={64} height={3}
          fill={C.palaceCream} stroke={C.buildingShadow} strokeWidth={0.3} />
        {/* Colonnade */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`col-${i}`} x1={-22 + i * 11} y1={-19} x2={-22 + i * 11} y2={-2}
            stroke={C.buildingShadow} strokeWidth={1} />
        ))}
        {/* Gold trim */}
        <line x1={-30} y1={-10} x2={30} y2={-10} stroke={C.palaceGold} strokeWidth={0.8} opacity={0.5} />
        {/* Courtyard opening */}
        <rect x={-8} y={-12} width={16} height={12} fill={C.buildingDark} opacity={0.3} />
      </g>

      {/* TEMPLO MAYOR - the Great Temple (center, dominant) */}
      <SteppedPyramid
        x={width * 0.5} y={height * 0.41}
        w={100} h={80} steps={5}
        hasTemple={true} hasFire={true}
        fireFlicker={fireFlicker1} smokeOffset={smokeDrift1}
      />

      {/* Smaller pyramid (right of Templo Mayor) */}
      <SteppedPyramid
        x={width * 0.6} y={height * 0.415}
        w={50} h={40} steps={4}
        hasTemple={false} hasFire={true}
        fireFlicker={fireFlicker2} smokeOffset={smokeDrift2}
      />

      {/* Market area (south of city center) */}
      <g transform={`translate(${width * 0.45}, ${height * 0.44})`}>
        {/* Market awnings */}
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={`awn-${i}`}
            x={-20 + i * 14} y={-6} width={10} height={4} rx={1}
            fill={[C.marketAwning1, C.marketAwning2, C.marketAwning3, C.marketAwning4, C.marketAwning1, C.marketAwning3][i]}
            opacity={0.5} />
        ))}
      </g>

      {/* City plaza (great square in front of temple) */}
      <rect x={width * 0.44} y={height * 0.41} width={width * 0.12} height={height * 0.025}
        fill={C.causewayStone} opacity={0.3} />

      {/* Banners/flags on buildings */}
      {[width * 0.38, width * 0.5, width * 0.62].map((fx, i) => (
        <g key={`flag-${i}`} transform={`translate(${fx}, ${height * 0.37})`}>
          <line x1={0} y1={0} x2={0} y2={-12} stroke={C.canoeWood} strokeWidth={1} />
          <path d={`M0,-12 Q${4 + flagSway},-10 ${6 + flagSway},-8 L${4 + flagSway},-6 L0,-8 Z`}
            fill={[C.marketAwning1, C.marketAwning3, C.marketAwning2][i]} opacity={0.6} />
        </g>
      ))}

      {/* Additional palace (Moctezuma's palace, right of center) */}
      <g transform={`translate(${width * 0.62}, ${height * 0.41})`}>
        <rect x={-25} y={-16} width={50} height={16}
          fill={C.palaceWhite} stroke={C.buildingShadow} strokeWidth={0.5} />
        <rect x={-27} y={-18} width={54} height={3}
          fill={C.palaceCream} stroke={C.buildingShadow} strokeWidth={0.3} />
        {/* Palace courtyard */}
        <rect x={-15} y={-8} width={30} height={8}
          fill={C.palaceCream} opacity={0.4} />
        {/* Columns */}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`pcol-${i}`} x1={-18 + i * 12} y1={-15} x2={-18 + i * 12} y2={-2}
            stroke={C.buildingShadow} strokeWidth={0.8} />
        ))}
        {/* Gold roof trim */}
        <line x1={-25} y1={-7} x2={25} y2={-7}
          stroke={C.palaceGold} strokeWidth={0.6} opacity={0.5} />
        {/* Red decorative band */}
        <line x1={-25} y1={-16} x2={25} y2={-16}
          stroke={C.palaceRed} strokeWidth={1} opacity={0.4} />
      </g>

      {/* Ball court (I-shaped, near great plaza) */}
      <g transform={`translate(${width * 0.44}, ${height * 0.425})`}>
        {/* Court walls */}
        <path d="M0,-3 L30,-3 L30,3 L0,3 Z"
          fill={C.templeStone} stroke={C.templeShadow} strokeWidth={0.5} />
        {/* End zones */}
        <rect x={-6} y={-6} width={6} height={12}
          fill={C.templeStone} stroke={C.templeShadow} strokeWidth={0.4} />
        <rect x={30} y={-6} width={6} height={12}
          fill={C.templeStone} stroke={C.templeShadow} strokeWidth={0.4} />
        {/* Stone ring (scoring hoop) */}
        <circle cx={15} cy={-3} r={2} fill="none" stroke={C.templeShadow} strokeWidth={0.5} />
      </g>

      {/* Tzompantli (skull rack - near Templo Mayor) */}
      <g transform={`translate(${width * 0.53}, ${height * 0.42})`}>
        <rect x={0} y={-8} width={16} height={8}
          fill={C.canoeWood} stroke={C.outline} strokeWidth={0.4} />
        {/* Skull rows */}
        {Array.from({ length: 3 }, (_, row) => (
          Array.from({ length: 4 }, (_, col) => (
            <circle key={`skull-${row}-${col}`}
              cx={2 + col * 4} cy={-2 - row * 3} r={1.2}
              fill="#E8E0D0" stroke={C.outline} strokeWidth={0.2} opacity={0.5} />
          ))
        ))}
      </g>

      {/* Additional building rows (residential areas) */}
      <BuildingCluster x={width * 0.32} y={height * 0.435} count={10} maxH={12} spread={90} />
      <BuildingCluster x={width * 0.68} y={height * 0.435} count={10} maxH={11} spread={85} />
      <BuildingCluster x={width * 0.38} y={height * 0.445} count={7} maxH={10} spread={60} />
      <BuildingCluster x={width * 0.62} y={height * 0.445} count={7} maxH={10} spread={55} />

      {/* Garden areas within city */}
      {[
        { x: width * 0.34, y: height * 0.44 },
        { x: width * 0.66, y: height * 0.44 },
        { x: width * 0.4, y: height * 0.435 },
      ].map((garden, i) => (
        <g key={`garden-${i}`}>
          <ellipse cx={garden.x} cy={garden.y} rx={12} ry={4}
            fill={C.treeMid} opacity={0.3} />
          <line x1={garden.x} y1={garden.y} x2={garden.x + treeSway * 0.3} y2={garden.y - 8}
            stroke={C.treeDark} strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
          <ellipse cx={garden.x + treeSway * 0.3} cy={garden.y - 10} rx={6} ry={4}
            fill={C.treeLight} opacity={0.3} />
        </g>
      ))}

      {/* Incense smoke from various temples */}
      <g opacity={0.2}>
        <path d={`M${width * 0.38},${height * 0.38}
          Q${width * 0.37 + smokeDrift2 * 0.5},${height * 0.34} ${width * 0.36 + smokeDrift2},${height * 0.3}`}
          fill="none" stroke={C.incenseSmoke} strokeWidth={4} strokeLinecap="round" />
        <path d={`M${width * 0.62},${height * 0.39}
          Q${width * 0.63 + smokeDrift1 * 0.4},${height * 0.35} ${width * 0.64 + smokeDrift1 * 0.8},${height * 0.31}`}
          fill="none" stroke={C.incenseSmoke} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Small figures on causeways (people walking) */}
      <g opacity={0.35}>
        {Array.from({ length: 6 }, (_, i) => {
          const fx = width * 0.24 - i * 12;
          const fy = height * 0.42 + i * 10;
          return (
            <g key={`cwalk-l-${i}`} transform={`translate(${fx}, ${fy})`}>
              <line x1={0} y1={0} x2={0} y2={-4} stroke="#B8865A" strokeWidth={1} strokeLinecap="round" />
              <circle cx={0} cy={-5} r={1} fill="#B8865A" />
            </g>
          );
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const fx = width * 0.73 + i * 14;
          const fy = height * 0.42 + i * 11;
          return (
            <g key={`cwalk-r-${i}`} transform={`translate(${fx}, ${fy})`}>
              <line x1={0} y1={0} x2={0} y2={-4} stroke="#B8865A" strokeWidth={1} strokeLinecap="round" />
              <circle cx={0} cy={-5} r={1} fill="#B8865A" />
            </g>
          );
        })}
        {/* Center causeway people */}
        {Array.from({ length: 8 }, (_, i) => {
          const fx = width * 0.49 + (i % 2) * 8;
          const fy = height * 0.48 + i * 15;
          return (
            <g key={`cwalk-c-${i}`} transform={`translate(${fx}, ${fy})`}>
              <line x1={0} y1={0} x2={0} y2={-5} stroke="#B8865A" strokeWidth={1.2} strokeLinecap="round" />
              <circle cx={0} cy={-6} r={1.2} fill="#B8865A" />
              {/* Tiny cotton garment */}
              <line x1={-1.5} y1={-3} x2={1.5} y2={-3} stroke="#E8E0D0" strokeWidth={0.8} />
            </g>
          );
        })}
      </g>

      {/* City wall/fortification at water edge */}
      <path d={`M${width * 0.3},${height * 0.445}
        Q${width * 0.4},${height * 0.45} ${width * 0.5},${height * 0.445}
        Q${width * 0.6},${height * 0.45} ${width * 0.7},${height * 0.445}`}
        fill="none" stroke={C.causewayStone} strokeWidth={2} opacity={0.3} />

      {/* Docks/piers at city edge */}
      {[width * 0.35, width * 0.45, width * 0.55, width * 0.65].map((dx, i) => (
        <g key={`dock-${i}`}>
          <line x1={dx} y1={height * 0.445} x2={dx} y2={height * 0.46}
            stroke={C.canoeWood} strokeWidth={2} opacity={0.4} />
          <rect x={dx - 4} y={height * 0.46} width={8} height={2}
            fill={C.canoeWood} opacity={0.3} />
        </g>
      ))}

      {/* City reflection in lake */}
      <g opacity={0.1}>
        <ellipse cx={width * 0.5} cy={height * 0.52} rx={width * 0.2} ry={height * 0.04}
          fill={C.lakeReflectCity} />
        {/* Blurred temple reflection */}
        <rect x={width * 0.47} y={height * 0.46} width={width * 0.06} height={height * 0.06}
          fill={C.lakeReflectCity} opacity={0.5} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 8: CHINAMPAS (floating gardens at city edges) */}
      {/* ============================================================ */}

      {/* Chinampas (rectangular garden plots) near the city */}
      {[
        { x: width * 0.28, y: height * 0.48, w: 40, h: 14 },
        { x: width * 0.3, y: height * 0.52, w: 35, h: 12 },
        { x: width * 0.25, y: height * 0.55, w: 45, h: 15 },
        { x: width * 0.7, y: height * 0.48, w: 38, h: 13 },
        { x: width * 0.72, y: height * 0.53, w: 42, h: 14 },
        { x: width * 0.68, y: height * 0.57, w: 36, h: 12 },
      ].map((ch, i) => (
        <g key={`chinampa-${i}`} transform={`translate(${ch.x}, ${ch.y})`}>
          {/* Water channel around */}
          <rect x={-2} y={-2} width={ch.w + 4} height={ch.h + 4}
            fill={C.chinampaWater} opacity={0.3} rx={1} />
          {/* Garden bed */}
          <rect x={0} y={0} width={ch.w} height={ch.h}
            fill={C.chinampaMid} stroke={C.chinampaEdge} strokeWidth={0.5} rx={1} />
          {/* Crop rows */}
          {Array.from({ length: Math.floor(ch.w / 8) }, (_, j) => (
            <line key={`crop-${j}`}
              x1={4 + j * 8} y1={2} x2={4 + j * 8} y2={ch.h - 2}
              stroke={C.chinampaLight} strokeWidth={2} opacity={0.4} />
          ))}
          {/* Edge willow trees */}
          {i % 2 === 0 && (
            <WillowTree x={ch.w + 3} y={ch.h / 2} scale={0.3} sway={treeSway * 0.5} />
          )}
        </g>
      ))}

      {/* ============================================================ */}
      {/* LAYER 9: CANOES ON THE LAKE */}
      {/* ============================================================ */}

      {/* Various canoes across the lake */}
      <Canoe x={width * 0.2} y={height * 0.5} scale={0.7} hasPaddler={true}
        bob={canoeBob1} loaded={true} />
      <Canoe x={width * 0.35} y={height * 0.55} scale={0.6} hasPaddler={true}
        bob={canoeBob2} />
      <Canoe x={width * 0.65} y={height * 0.53} scale={0.65} hasPaddler={true}
        bob={canoeBob3} loaded={true} />
      <Canoe x={width * 0.8} y={height * 0.5} scale={0.55} hasPaddler={true}
        bob={canoeBob1} />
      <Canoe x={width * 0.15} y={height * 0.62} scale={0.8} hasPaddler={true}
        bob={canoeBob2} loaded={true} />
      <Canoe x={width * 0.85} y={height * 0.6} scale={0.75} hasPaddler={true}
        bob={canoeBob3} />
      {/* Distant canoes (small) */}
      <Canoe x={width * 0.4} y={height * 0.46} scale={0.3} hasPaddler={true}
        bob={canoeBob1 * 0.5} />
      <Canoe x={width * 0.6} y={height * 0.47} scale={0.25} hasPaddler={true}
        bob={canoeBob2 * 0.5} />

      {/* ============================================================ */}
      {/* LAYER 10: FOREGROUND SHORE & REEDS */}
      {/* ============================================================ */}

      {/* Foreground shoreline (viewer's position) */}
      <path d={`M0,${height * 0.78}
        Q${width * 0.15},${height * 0.76} ${width * 0.3},${height * 0.78}
        Q${width * 0.5},${height * 0.8} ${width * 0.7},${height * 0.78}
        Q${width * 0.85},${height * 0.76} ${width},${height * 0.78}
        L${width},${height} L0,${height} Z`}
        fill={C.chinampaEdge} />

      {/* Shore texture */}
      {Array.from({ length: 20 }, (_, i) => (
        <path key={`shore-${i}`}
          d={`M${i * (width / 20)},${height * 0.79 + (i % 3) * 2}
            Q${i * (width / 20) + 30},${height * 0.78 + (i % 2) * 3} ${(i + 1) * (width / 20)},${height * 0.79}`}
          fill="none" stroke={C.chinampaDark} strokeWidth={0.5} opacity={0.15} />
      ))}

      {/* Reed clusters along shore */}
      <ReedCluster x={width * 0.05} y={height * 0.78} count={8} maxH={35} sway={reedSway} />
      <ReedCluster x={width * 0.12} y={height * 0.77} count={6} maxH={30} sway={reedSway * 0.8} />
      <ReedCluster x={width * 0.88} y={height * 0.77} count={7} maxH={32} sway={reedSway * 0.9} />
      <ReedCluster x={width * 0.95} y={height * 0.78} count={9} maxH={38} sway={reedSway} />
      <ReedCluster x={width * 0.35} y={height * 0.79} count={5} maxH={25} sway={reedSway * 0.7} />
      <ReedCluster x={width * 0.65} y={height * 0.79} count={5} maxH={28} sway={reedSway * 0.6} />

      {/* Lily pads in foreground water */}
      {[
        { x: width * 0.08, y: height * 0.76 },
        { x: width * 0.15, y: height * 0.74 },
        { x: width * 0.82, y: height * 0.75 },
        { x: width * 0.92, y: height * 0.76 },
        { x: width * 0.38, y: height * 0.77 },
        { x: width * 0.62, y: height * 0.76 },
      ].map((lily, i) => (
        <g key={`lily-${i}`} transform={`translate(${lily.x}, ${lily.y + lilyBob})`}>
          <ellipse cx={0} cy={0} rx={5} ry={3} fill={C.lilyPad} opacity={0.5} />
          <path d="M0,0 L2,-3 L0,0" fill="none" stroke={C.chinampaDark} strokeWidth={0.3} />
          {i % 3 === 0 && (
            <circle cx={2} cy={-2} r={2} fill={C.lilyFlower} opacity={0.4} />
          )}
        </g>
      ))}

      {/* Foreground shore ground detail */}
      {/* Pebbles and earth texture */}
      {Array.from({ length: 25 }, (_, i) => {
        const px = 30 + (i * 79) % (width - 60);
        const py = height * 0.8 + (i * 31) % (height * 0.12);
        const pr = 1.5 + (i % 4) * 0.8;
        return (
          <circle key={`pebble-${i}`} cx={px} cy={py} r={pr}
            fill={i % 3 === 0 ? C.causewayStone : C.chinampaEdge}
            opacity={0.15 + (i % 3) * 0.05} />
        );
      })}

      {/* Shore path (beaten earth path) */}
      <path d={`M0,${height * 0.84}
        Q${width * 0.15},${height * 0.82} ${width * 0.3},${height * 0.84}
        Q${width * 0.5},${height * 0.86} ${width * 0.7},${height * 0.84}
        Q${width * 0.85},${height * 0.82} ${width},${height * 0.84}`}
        fill="none" stroke={C.causewayStone} strokeWidth={8} opacity={0.12} strokeLinecap="round" />

      {/* Wild flowers on shore */}
      {Array.from({ length: 15 }, (_, i) => {
        const fx = 40 + (i * 131) % (width - 80);
        const fy = height * 0.8 + (i * 23) % (height * 0.1);
        const fColors = ['#E06060', '#E0E040', '#A060C0', '#60A0E0', '#E0A040'];
        return (
          <g key={`flower-${i}`} transform={`translate(${fx}, ${fy})`}>
            <line x1={0} y1={0} x2={treeSway * 0.2} y2={-6 - (i % 3) * 2}
              stroke={C.reedDark} strokeWidth={0.8} />
            <circle cx={treeSway * 0.2} cy={-7 - (i % 3) * 2} r={1.5}
              fill={fColors[i % 5]} opacity={0.4} />
          </g>
        );
      })}

      {/* Grass tufts */}
      {Array.from({ length: 20 }, (_, i) => {
        const gx = 20 + (i * 103) % (width - 40);
        const gy = height * 0.79 + (i * 17) % (height * 0.08);
        return (
          <g key={`grass-${i}`} transform={`translate(${gx}, ${gy})`}>
            <line x1={0} y1={0} x2={-2 + reedSway * 0.3} y2={-5}
              stroke={C.chinampaLight} strokeWidth={0.8} strokeLinecap="round" opacity={0.4} />
            <line x1={2} y1={0} x2={3 + reedSway * 0.3} y2={-6}
              stroke={C.chinampaMid} strokeWidth={0.8} strokeLinecap="round" opacity={0.35} />
            <line x1={-1} y1={0} x2={0 + reedSway * 0.2} y2={-4}
              stroke={C.chinampaLight} strokeWidth={0.7} strokeLinecap="round" opacity={0.3} />
          </g>
        );
      })}

      {/* Ducks on water (foreground) */}
      {[
        { x: width * 0.2, y: height * 0.73 },
        { x: width * 0.78, y: height * 0.74 },
        { x: width * 0.55, y: height * 0.75 },
      ].map((duck, i) => (
        <g key={`duck-${i}`} transform={`translate(${duck.x}, ${duck.y + canoeBob1 * 0.5})`}>
          {/* Wake */}
          <path d="M4,1 Q8,0 12,1" fill="none" stroke={C.lakeRipple} strokeWidth={0.5} opacity={0.3} />
          {/* Body */}
          <ellipse cx={0} cy={0} rx={4} ry={2} fill="#5A4A30" opacity={0.5} />
          {/* Head */}
          <circle cx={-3} cy={-2} r={1.5} fill="#2A5A2A" opacity={0.4} />
          <line x1={-4.5} y1={-2} x2={-6} y2={-1.5} stroke="#D4A020" strokeWidth={0.5} opacity={0.4} />
        </g>
      ))}

      {/* Fish jumping (occasional) */}
      {waterGlint > 0.8 && (
        <g transform={`translate(${width * 0.4}, ${height * 0.65})`}>
          <path d="M0,0 Q-3,-4 -1,-6 Q1,-4 3,-3 Q1,-2 0,0 Z"
            fill="#8A9A8A" opacity={0.3} />
          {/* Splash rings */}
          <ellipse cx={0} cy={1} rx={4} ry={1.5} fill="none" stroke={C.lakeRipple} strokeWidth={0.5} opacity={0.4} />
          <ellipse cx={0} cy={1} rx={7} ry={2.5} fill="none" stroke={C.lakeRipple} strokeWidth={0.3} opacity={0.2} />
        </g>
      )}

      {/* Foreground rocks along waterline */}
      {[
        { x: width * 0.08, y: height * 0.78, rx: 10, ry: 5 },
        { x: width * 0.22, y: height * 0.79, rx: 8, ry: 4 },
        { x: width * 0.42, y: height * 0.78, rx: 12, ry: 5.5 },
        { x: width * 0.58, y: height * 0.79, rx: 7, ry: 3.5 },
        { x: width * 0.76, y: height * 0.78, rx: 11, ry: 5 },
        { x: width * 0.92, y: height * 0.79, rx: 9, ry: 4 },
      ].map((rock, i) => (
        <g key={`frock-${i}`} transform={`translate(${rock.x}, ${rock.y})`}>
          <ellipse cx={0} cy={0} rx={rock.rx} ry={rock.ry}
            fill={C.mountainFoot} opacity={0.35} stroke={C.outline} strokeWidth={0.3} />
          <ellipse cx={-rock.rx * 0.2} cy={-rock.ry * 0.3} rx={rock.rx * 0.4} ry={rock.ry * 0.3}
            fill={C.causewayStone} opacity={0.15} />
          {/* Moss on rock */}
          <ellipse cx={rock.rx * 0.1} cy={rock.ry * 0.2} rx={rock.rx * 0.3} ry={rock.ry * 0.2}
            fill={C.chinampaDark} opacity={0.15} />
        </g>
      ))}

      {/* Dragonflies over water */}
      {Array.from({ length: 4 }, (_, i) => {
        const dx = width * 0.15 + i * width * 0.2;
        const dy = height * 0.72 + sineWave(frame, 0.06, i * 3) * 5;
        return (
          <g key={`dfly-${i}`} transform={`translate(${dx}, ${dy})`}>
            <line x1={-3} y1={0} x2={3} y2={0} stroke="#4080A0" strokeWidth={0.5} opacity={0.3} />
            <line x1={0} y1={0} x2={-2 + sineWave(frame, 0.15, i) * 2} y2={-2}
              stroke="rgba(180,220,255,0.3)" strokeWidth={0.3} />
            <line x1={0} y1={0} x2={2 + sineWave(frame, 0.15, i + 1) * 2} y2={-2}
              stroke="rgba(180,220,255,0.3)" strokeWidth={0.3} />
          </g>
        );
      })}

      {/* Foreground willow trees on shore */}
      <WillowTree x={width * 0.03} y={height * 0.78} scale={1.2} sway={treeSway} />
      <WillowTree x={width * 0.97} y={height * 0.77} scale={1.1} sway={treeSway * 0.9} />

      {/* Additional cypress trees */}
      {[width * 0.18, width * 0.82].map((cx, i) => (
        <g key={`cypress-${i}`} transform={`translate(${cx}, ${height * 0.78})`}>
          <line x1={0} y1={0} x2={0} y2={-30} stroke="#3A2A10" strokeWidth={2} />
          <path d={`M-4,${-8} Q0,${-35 + treeSway * 0.5} 4,${-8}`}
            fill={C.cypressDark} opacity={0.5} />
          <path d={`M-3,${-10} Q0,${-32 + treeSway * 0.5} 3,${-10}`}
            fill={C.cypressMid} opacity={0.4} />
        </g>
      ))}

      {/* ============================================================ */}
      {/* LAYER 11: CROWD FIGURES (along causeway/shore) */}
      {/* ============================================================ */}

      <AztecCrowdLayer config={AZTEC_CROWD_CONFIGS.tenochtitlan} />

      {/* ============================================================ */}
      {/* LAYER 12: BIRDS */}
      {/* ============================================================ */}

      {/* Flying birds (herons, eagles) */}
      {Array.from({ length: 8 }, (_, i) => {
        const bx = width * 0.15 + i * width * 0.1;
        const by = height * 0.2 + (i % 3) * 25 + birdFloat1 * (i % 2 === 0 ? 1 : -0.5);
        const wAngle = wingBeat * (i % 2 === 0 ? 1 : -1);
        return (
          <g key={`bird-${i}`} transform={`translate(${bx}, ${by})`}>
            <path d={`M0,0 Q-${5 + wAngle},-${2 + wAngle * 0.3} -${10 + wAngle},${wAngle * 0.3}`}
              fill="none" stroke={C.birdDark} strokeWidth={1} strokeLinecap="round" opacity={0.4} />
            <path d={`M0,0 Q${5 + wAngle},-${2 + wAngle * 0.3} ${10 + wAngle},${wAngle * 0.3}`}
              fill="none" stroke={C.birdDark} strokeWidth={1} strokeLinecap="round" opacity={0.4} />
          </g>
        );
      })}

      {/* Heron standing in shallows */}
      <g transform={`translate(${width * 0.1}, ${height * 0.75})`}>
        <line x1={0} y1={0} x2={0} y2={-10} stroke="#8A8A7A" strokeWidth={1} />
        <line x1={0} y1={-10} x2={0} y2={-18} stroke="#E8E0D0" strokeWidth={2} strokeLinecap="round" />
        <circle cx={0} cy={-20} r={2} fill="#E8E0D0" stroke={C.outline} strokeWidth={0.3} />
        <line x1={2} y1={-20} x2={6} y2={-19} stroke="#D4A020" strokeWidth={0.8} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 13: MIST AND FOG */}
      {/* ============================================================ */}

      {/* Lake mist (morning mist over water) */}
      <ellipse cx={width * 0.2 + mistFloat} cy={height * 0.55}
        rx={180} ry={20} fill={C.mistLake} opacity={0.4} />
      <ellipse cx={width * 0.5 - mistFloat * 0.5} cy={height * 0.5}
        rx={220} ry={25} fill={C.mistLake} opacity={0.3} />
      <ellipse cx={width * 0.8 + mistFloat * 0.7} cy={height * 0.53}
        rx={160} ry={18} fill={C.mistLake} opacity={0.35} />

      {/* Near fog (foreground) */}
      <ellipse cx={width * 0.15 + mistFloat * 0.5} cy={height * 0.8}
        rx={200} ry={25} fill={C.fogNear} opacity={0.25} />
      <ellipse cx={width * 0.85 - mistFloat * 0.3} cy={height * 0.82}
        rx={180} ry={22} fill={C.fogNear} opacity={0.2} />

      {/* Mountain haze */}
      <rect x={0} y={height * 0.3} width={width} height={height * 0.12}
        fill={C.haze} opacity={0.5} />

      {/* ============================================================ */}
      {/* LAYER 14: STONE TABLET BOARD */}
      {/* ============================================================ */}

      <g transform={`translate(${width * 0.5 - 220}, ${height * 0.86})`}>
        {/* Shadow */}
        <rect x={-6} y={-6} width={452} height={112} rx={4}
          fill="rgba(0,0,0,0.25)" />
        {/* Stone frame */}
        <rect x={-10} y={-10} width={460} height={120} rx={6}
          fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        {/* Stone surface */}
        <rect x={0} y={0} width={440} height={100} rx={3}
          fill={C.boardSurface} />
        {/* Stone texture */}
        <rect x={0} y={0} width={440} height={100} rx={3}
          fill={C.boardStone} opacity={0.12} />
        {/* Cracks */}
        <path d="M15,0 L20,18 L17,35" fill="none" stroke={C.outline} strokeWidth={0.3} opacity={0.15} />
        <path d="M425,5 L420,22 L423,42" fill="none" stroke={C.outline} strokeWidth={0.3} opacity={0.12} />
        {/* Aztec step-fret border */}
        <g opacity={0.3}>
          {Array.from({ length: 22 }, (_, i) => (
            <path key={`bf-${i}`}
              d={`M${i * 20 + 5},2 L${i * 20 + 10},2 L${i * 20 + 10},6 L${i * 20 + 15},6 L${i * 20 + 15},2`}
              fill="none" stroke={C.palaceGold} strokeWidth={0.8} />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <path key={`bfb-${i}`}
              d={`M${i * 20 + 5},98 L${i * 20 + 10},98 L${i * 20 + 10},94 L${i * 20 + 15},94 L${i * 20 + 15},98`}
              fill="none" stroke={C.palaceGold} strokeWidth={0.8} />
          ))}
        </g>
        {/* Text */}
        {boardText && (
          <text x={220} y={58} textAnchor="middle" fill={C.boardText}
            fontSize={36} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.85}>
            {boardText}
          </text>
        )}
      </g>

      {/* ============================================================ */}
      {/* LAYER 14B: ADDITIONAL WATER DETAIL */}
      {/* ============================================================ */}

      {/* Causeway shadows on water */}
      <g opacity={0.08}>
        <path d={`M${width * 0.25},${height * 0.43}
          L${width * 0.15},${height * 0.53}
          L${width * 0.08},${height * 0.61} L0,${height * 0.73}
          L0,${height * 0.75}
          L${width * 0.1},${height * 0.63}
          L${width * 0.17},${height * 0.55}
          L${width * 0.27},${height * 0.43} Z`}
          fill={C.lakeDeep} />
        <path d={`M${width * 0.74},${height * 0.43}
          L${width * 0.82},${height * 0.55}
          L${width * 0.9},${height * 0.65} L${width},${height * 0.77}
          L${width},${height * 0.79}
          L${width * 0.92},${height * 0.67}
          L${width * 0.84},${height * 0.57}
          L${width * 0.76},${height * 0.43} Z`}
          fill={C.lakeDeep} />
      </g>

      {/* Floating debris/leaves on water */}
      {Array.from({ length: 10 }, (_, i) => {
        const lx = 100 + (i * 191) % (width - 200);
        const ly = height * 0.5 + (i * 47) % (height * 0.2);
        return (
          <ellipse key={`leaf-${i}`}
            cx={lx + waterRipple2 * (i % 2 === 0 ? 1 : -1)}
            cy={ly + waterRipple1 * 0.5}
            rx={1.5} ry={0.8}
            fill={i % 3 === 0 ? C.chinampaLight : C.reedDark}
            opacity={0.15} transform={`rotate(${(i * 23) % 180}, ${lx}, ${ly})`} />
        );
      })}

      {/* Distant fishing nets visible on water */}
      <g opacity={0.12}>
        <path d={`M${width * 0.25},${height * 0.56}
          Q${width * 0.27},${height * 0.54} ${width * 0.29},${height * 0.56}
          Q${width * 0.27},${height * 0.58} ${width * 0.25},${height * 0.56}`}
          fill="none" stroke={C.canoeWood} strokeWidth={0.5} />
        <path d={`M${width * 0.73},${height * 0.54}
          Q${width * 0.75},${height * 0.52} ${width * 0.77},${height * 0.54}
          Q${width * 0.75},${height * 0.56} ${width * 0.73},${height * 0.54}`}
          fill="none" stroke={C.canoeWood} strokeWidth={0.5} />
      </g>

      {/* Water color variation zones */}
      <ellipse cx={width * 0.3} cy={height * 0.55} rx={80} ry={20}
        fill={C.lakeShallow} opacity={0.06} />
      <ellipse cx={width * 0.7} cy={height * 0.58} rx={60} ry={15}
        fill={C.lakeShallow} opacity={0.05} />
      <ellipse cx={width * 0.5} cy={height * 0.65} rx={100} ry={25}
        fill={C.lakeDeep} opacity={0.04} />

      {/* Causeway reflection details */}
      {Array.from({ length: 6 }, (_, i) => {
        const crx = width * 0.47 + (i % 2) * 12;
        const cry = height * 0.56 + i * 18;
        return (
          <line key={`cref-${i}`}
            x1={crx - 4} y1={cry + waterRipple2}
            x2={crx + 4} y2={cry + waterRipple2}
            stroke={C.lakeReflectCity} strokeWidth={1.5} opacity={0.08} />
        );
      })}

      {/* Subtle wind lines on water surface */}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`wind-${i}`}
          d={`M${width * 0.1 + i * width * 0.1},${height * 0.48 + (i % 3) * 20 + waterRipple3}
            Q${width * 0.15 + i * width * 0.1},${height * 0.47 + (i % 3) * 20 + waterRipple3}
            ${width * 0.2 + i * width * 0.1},${height * 0.48 + (i % 3) * 20 + waterRipple3}`}
          fill="none" stroke={C.lakeGlint} strokeWidth={0.4} opacity={0.1} />
      ))}

      {/* ============================================================ */}
      {/* LAYER 15: ATMOSPHERIC OVERLAYS */}
      {/* ============================================================ */}

      {/* Overall warm atmospheric glow */}
      <rect x={0} y={0} width={width} height={height}
        fill="rgba(255,220,140,0.03)" />

      {/* Vignette */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#tn-vignette)" />

      {/* Side darkening for depth */}
      <linearGradient id="tn-left-dark" x1="0%" y1="0%" x2="12%" y2="0%">
        <stop offset="0%" stopColor="rgba(15,10,25,0.2)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>
      <rect x={0} y={0} width={width * 0.15} height={height}
        fill="url(#tn-left-dark)" />
      <linearGradient id="tn-right-dark" x1="88%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(15,10,25,0.2)" />
      </linearGradient>
      <rect x={width * 0.85} y={0} width={width * 0.15} height={height}
        fill="url(#tn-right-dark)" />

      {/* Top sky darkening (zenith) */}
      <linearGradient id="tn-top-dark" x1="0%" y1="0%" x2="0%" y2="10%">
        <stop offset="0%" stopColor="rgba(10,15,35,0.15)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>
      <rect x={0} y={0} width={width} height={height * 0.15}
        fill="url(#tn-top-dark)" />

      {/* Water shimmer overlay */}
      <rect x={0} y={height * 0.36} width={width} height={height * 0.42}
        fill={`rgba(${100 + Math.floor(waterGlint * 30)},${160 + Math.floor(waterGlint * 20)},${200 + Math.floor(waterGlint * 15)},0.02)`} />

      {/* Atmospheric dust particles in sunbeams */}
      {Array.from({ length: 15 }, (_, i) => {
        const px = width * 0.35 + (i * 71) % (width * 0.3);
        const py = height * 0.1 + (i * 53) % (height * 0.35);
        const pSize = 0.5 + (i % 3) * 0.3;
        return (
          <circle key={`dust-${i}`}
            cx={px + sineWave(frame, 0.02, i) * 3}
            cy={py + sineWave(frame, 0.015, i + 1) * 2}
            r={pSize}
            fill={C.sunCore} opacity={0.08 + (i % 3) * 0.02} />
        );
      })}

      {/* Bottom darkness (depth) */}
      <linearGradient id="tn-bottom" x1="0%" y1="85%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(15,10,5,0.2)" />
      </linearGradient>
      <rect x={0} y={height * 0.85} width={width} height={height * 0.15}
        fill="url(#tn-bottom)" />

      {/* Canvas texture for oil painting feel */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#tn-canvas)" opacity={0.5} />

      {/* Film grain for painterly texture */}
      <g opacity={0.02}>
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={`grain-${i}`}
            x={(i * 103) % width} y={(i * 67) % height}
            width={1.5} height={1.5}
            fill={i % 2 === 0 ? '#FFF' : '#000'} />
        ))}
      </g>

      {/* Subtle blue-gold color grading */}
      <rect x={0} y={0} width={width * 0.5} height={height}
        fill="rgba(40,60,120,0.02)" />
      <rect x={width * 0.5} y={0} width={width * 0.5} height={height}
        fill="rgba(200,160,80,0.02)" />
    </svg>
  );
};

export default Tenochtitlan;
