// AztecSacrifice.tsx — Templo Mayor sacrifice ceremony at the Great Temple
// Oil-painting quality: Caravaggio chiaroscuro, dramatic torchlight, towering pyramid
// Deep shadows with pools of golden firelight, sacred ritual atmosphere

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { AztecCrowdLayer, AZTEC_CROWD_CONFIGS } from '../crowds/AztecCrowd';

// ---- Color palette: 100+ named colors for oil painting depth ----
const C = {
  // Night sky
  skyTop: '#06040A',
  skyMid: '#0E0818',
  skyLow: '#1A0E28',
  skyHorizon: '#2A1838',
  skyGlow: 'rgba(200,100,30,0.12)',
  starWhite: '#E8E0D0',
  starYellow: '#F0D880',
  starDim: 'rgba(200,190,170,0.4)',
  // Moon
  moonFace: '#E8DCC0',
  moonShadow: '#C8B898',
  moonGlow: 'rgba(220,210,180,0.15)',
  moonCrater: '#B8A880',
  // Distant city silhouette
  cityDark: '#0A0610',
  cityMid: '#1A1020',
  cityLight: '#2A1830',
  cityWindow: 'rgba(220,160,60,0.5)',
  cityTorch: 'rgba(255,140,40,0.3)',
  // Templo Mayor pyramid
  pyramidBase: '#4A3828',
  pyramidMid: '#5A4832',
  pyramidLight: '#6A583C',
  pyramidDark: '#2A1A10',
  pyramidShadow: '#1A0E08',
  pyramidHighlight: '#7A6848',
  pyramidEdge: '#3A2818',
  stairStone: '#5A4A38',
  stairShadow: '#3A2A1A',
  stairHighlight: '#7A6A52',
  stairCenter: '#6A5A42',
  // Temple shrines (top)
  shrineRed: '#8A2020',
  shrineRedDark: '#5A1010',
  shrineRedLight: '#B03030',
  shrineBlue: '#1A3A6A',
  shrineBlueDark: '#0A1A3A',
  shrineBlueLight: '#2A4A8A',
  shrineRoof: '#3A2A1A',
  shrineRoofEdge: '#5A4A30',
  // Sacrificial stone (techcatl)
  altarStone: '#6A5A48',
  altarDark: '#3A2A1A',
  altarLight: '#8A7A60',
  altarBlood: '#5A0808',
  altarBloodWet: '#8A1010',
  altarBloodDrip: '#6A0A0A',
  altarCarving: '#4A3A28',
  // Fire & torches
  fireDark: '#8A2010',
  fireMid: '#D06020',
  fireLight: '#F0A030',
  fireBright: '#FFD060',
  fireWhite: '#FFF0C0',
  fireGlow: 'rgba(255,140,40,0.35)',
  fireGlowWide: 'rgba(255,120,30,0.12)',
  torchWood: '#5A3818',
  torchWoodDark: '#3A2010',
  torchBase: '#4A2A10',
  emberRed: '#C04020',
  emberOrange: '#E08030',
  emberYellow: '#FFC040',
  sparkWhite: '#FFF8E0',
  // Incense & smoke
  smokeDark: 'rgba(20,15,10,0.5)',
  smokeMid: 'rgba(60,45,30,0.35)',
  smokeLight: 'rgba(120,100,70,0.2)',
  smokeWhite: 'rgba(200,190,170,0.15)',
  incenseBlue: 'rgba(80,100,140,0.2)',
  incenseGray: 'rgba(160,150,140,0.25)',
  copalSmoke: 'rgba(140,120,80,0.18)',
  // Blood channel
  bloodDark: '#3A0808',
  bloodMid: '#6A1010',
  bloodLight: '#8A2020',
  bloodGlisten: 'rgba(180,40,40,0.5)',
  bloodDried: '#3A1818',
  // Priests
  priestBlack: '#1A1A1A',
  priestRobe: '#2A1A1A',
  priestSkin: '#8A6A42',
  priestPaint: '#1A1A2A',
  priestPaintRed: '#8A1818',
  priestJade: '#2A7A4A',
  // Decorations
  skullWhite: '#E0D8C8',
  skullShadow: '#A8A090',
  skullEye: '#1A1010',
  bannerRed: '#8A2020',
  bannerGold: '#C8A030',
  bannerBlue: '#1A2A5A',
  bannerGreen: '#1A5A2A',
  featherGreen: '#1A6A3A',
  featherRed: '#A02020',
  featherBlue: '#1A3080',
  featherGold: '#D0A020',
  jadeGreen: '#2A8A4A',
  jadeDark: '#1A5A30',
  turquoise: '#30A0A0',
  turquoiseDark: '#1A6A6A',
  goldBright: '#E0B830',
  goldDark: '#8A7020',
  obsidian: '#2A2A3A',
  obsidianShine: '#4A4A6A',
  // Ground / plaza
  plazaStone: '#4A3A2A',
  plazaDark: '#2A1A0A',
  plazaLight: '#5A4A38',
  plazaGap: '#1A1008',
  plazaBlood: '#3A1010',
  // Serpent heads
  serpentStone: '#6A5A48',
  serpentDark: '#3A2A1A',
  serpentEye: '#C8A020',
  serpentTongue: '#8A2020',
  serpentTooth: '#D8D0C0',
  // Tzompantli (skull rack)
  rackWood: '#5A3818',
  rackWoodDark: '#3A2010',
  rackRope: '#8A7858',
  // Atmospheric
  vignetteBlack: 'rgba(0,0,0,0.7)',
  vignetteEdge: 'rgba(0,0,0,0.9)',
  fogDark: 'rgba(20,10,5,0.3)',
  fogLight: 'rgba(60,40,20,0.15)',
  godRay: 'rgba(255,180,80,0.06)',
  boardBg: '#2A1A0A',
  boardEdge: '#5A4A30',
  boardText: '#E8D8B8',
  boardShadow: 'rgba(0,0,0,0.5)',
};

// ---- Types ----
interface AztecSacrificeProps {
  boardText?: string;
  width?: number;
  height?: number;
}

// ---- Sub-components ----

/** Single torch with animated flame */
const Torch: React.FC<{
  x: number; y: number; scale?: number; frame: number; seed?: number;
}> = ({ x, y, scale = 1, frame, seed = 0 }) => {
  const flicker1 = sineWave(frame, 3.2, seed);
  const flicker2 = sineWave(frame, 5.7, seed + 1.5);
  const flicker3 = sineWave(frame, 8.1, seed + 3.0);
  const sway = sineWave(frame, 1.1, seed + 0.5) * 2;
  const intensity = 0.8 + flicker1 * 0.1 + flicker2 * 0.1;

  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* Torch bracket / mount */}
      <rect x={-4} y={0} width={8} height={50} rx={2} fill={C.torchWood} stroke={C.torchWoodDark} strokeWidth={0.5} />
      <rect x={-6} y={45} width={12} height={8} rx={1} fill={C.torchWoodDark} />
      {/* Cloth wrap */}
      <rect x={-5} y={-5} width={10} height={15} rx={2} fill={C.bannerRed} opacity={0.8} />
      {/* Fire glow (wide) */}
      <ellipse cx={0 + sway * 0.5} cy={-25} rx={40 * intensity} ry={50 * intensity} fill={C.fireGlowWide} />
      <ellipse cx={0 + sway * 0.3} cy={-20} rx={25 * intensity} ry={35 * intensity} fill={C.fireGlow} />
      {/* Fire layers */}
      <ellipse cx={0 + sway} cy={-18 + flicker2 * 2} rx={8 + flicker1 * 2} ry={20 + flicker2 * 3} fill={C.fireDark} opacity={0.9} />
      <ellipse cx={sway * 0.7} cy={-22 + flicker1 * 2} rx={6 + flicker2 * 1.5} ry={16 + flicker1 * 2} fill={C.fireMid} />
      <ellipse cx={sway * 0.4} cy={-25 + flicker3 * 1.5} rx={4 + flicker1} ry={12 + flicker3 * 2} fill={C.fireLight} />
      <ellipse cx={sway * 0.2} cy={-27 + flicker2} rx={2.5 + flicker3 * 0.8} ry={8 + flicker1 * 1.5} fill={C.fireBright} />
      <ellipse cx={0} cy={-28 + flicker1} rx={1.5} ry={5 + flicker2} fill={C.fireWhite} opacity={0.7} />
      {/* Sparks */}
      {[0, 1, 2, 3, 4].map(i => {
        const sparkPhase = seed + i * 1.7;
        const sparkY = -35 - ((frame * 0.8 + i * 30 + seed * 10) % 50);
        const sparkX = sineWave(frame, 2 + i * 0.5, sparkPhase) * (6 + i * 2);
        const sparkOp = Math.max(0, 1 - ((frame * 0.8 + i * 30 + seed * 10) % 50) / 50);
        return (
          <circle key={i} cx={sparkX + sway} cy={sparkY} r={0.8 + Math.random() * 0.4} fill={i % 2 === 0 ? C.emberYellow : C.emberOrange} opacity={sparkOp * 0.8} />
        );
      })}
    </g>
  );
};

/** Serpent head carved in stone */
const SerpentHead: React.FC<{
  x: number; y: number; scale?: number; flip?: boolean;
}> = ({ x, y, scale = 1, flip = false }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
    {/* Head base */}
    <path d="M0,0 Q15,-5 25,-2 Q35,2 38,10 Q40,18 35,22 Q25,28 10,25 Q0,22 -5,15 Q-8,8 0,0Z" fill={C.serpentStone} stroke={C.serpentDark} strokeWidth={0.8} />
    {/* Jaw */}
    <path d="M25,15 Q35,18 38,22 Q36,28 28,30 Q20,28 18,22Z" fill={C.serpentDark} />
    {/* Eye */}
    <circle cx={18} cy={8} r={4} fill={C.serpentEye} />
    <circle cx={18} cy={8} r={2} fill={C.obsidian} />
    <circle cx={19} cy={7} r={0.8} fill={C.goldBright} opacity={0.6} />
    {/* Fangs */}
    <path d="M30,18 L32,25 L28,20Z" fill={C.serpentTooth} />
    <path d="M24,20 L25,27 L22,22Z" fill={C.serpentTooth} />
    {/* Tongue */}
    <path d="M35,22 Q42,24 48,20 Q45,26 38,25" fill={C.serpentTongue} strokeWidth={0.5} stroke={C.bloodDark} />
    {/* Nostril */}
    <circle cx={30} cy={6} r={1.5} fill={C.serpentDark} />
    {/* Scale texture lines */}
    <path d="M5,8 Q10,5 15,7" fill="none" stroke={C.serpentDark} strokeWidth={0.4} opacity={0.5} />
    <path d="M8,14 Q13,11 18,13" fill="none" stroke={C.serpentDark} strokeWidth={0.4} opacity={0.5} />
    <path d="M3,18 Q8,16 12,18" fill="none" stroke={C.serpentDark} strokeWidth={0.4} opacity={0.5} />
    {/* Feather crest */}
    <path d="M0,0 Q-5,-8 2,-15 Q5,-10 8,-18 Q8,-8 12,-14 Q10,-5 15,-8 Q12,0 18,-3" fill={C.featherGreen} opacity={0.7} stroke={C.serpentDark} strokeWidth={0.3} />
  </g>
);

/** Single skull for tzompantli */
const Skull: React.FC<{ x: number; y: number; scale?: number; rot?: number }> = ({ x, y, scale = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={6} ry={7} fill={C.skullWhite} stroke={C.skullShadow} strokeWidth={0.5} />
    <ellipse cx={0} cy={-1} rx={5.5} ry={6} fill={C.skullWhite} />
    {/* Eye sockets */}
    <ellipse cx={-2.2} cy={-1} rx={1.8} ry={2} fill={C.skullEye} />
    <ellipse cx={2.2} cy={-1} rx={1.8} ry={2} fill={C.skullEye} />
    {/* Nose */}
    <path d="M-0.8,1.5 L0,3 L0.8,1.5" fill="none" stroke={C.skullEye} strokeWidth={0.5} />
    {/* Teeth */}
    <rect x={-3} y={4} width={6} height={2} rx={0.5} fill={C.skullWhite} stroke={C.skullShadow} strokeWidth={0.3} />
    <line x1={-1.5} y1={4} x2={-1.5} y2={6} stroke={C.skullShadow} strokeWidth={0.3} />
    <line x1={0} y1={4} x2={0} y2={6} stroke={C.skullShadow} strokeWidth={0.3} />
    <line x1={1.5} y1={4} x2={1.5} y2={6} stroke={C.skullShadow} strokeWidth={0.3} />
    {/* Temple hollows */}
    <ellipse cx={-4.5} cy={0} rx={1} ry={2} fill={C.skullShadow} opacity={0.3} />
    <ellipse cx={4.5} cy={0} rx={1} ry={2} fill={C.skullShadow} opacity={0.3} />
  </g>
);

/** Tzompantli skull rack */
const SkullRack: React.FC<{
  x: number; y: number; width?: number; rows?: number; frame: number;
}> = ({ x, y, width = 200, rows = 4, frame }) => {
  const cols = Math.floor(width / 16);
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Vertical posts */}
      <rect x={0} y={0} width={6} height={rows * 18 + 10} rx={1} fill={C.rackWood} stroke={C.rackWoodDark} strokeWidth={0.8} />
      <rect x={width - 6} y={0} width={6} height={rows * 18 + 10} rx={1} fill={C.rackWood} stroke={C.rackWoodDark} strokeWidth={0.8} />
      {/* Cross beams and skulls */}
      {Array.from({ length: rows }).map((_, row) => (
        <g key={row}>
          {/* Beam */}
          <rect x={3} y={8 + row * 18} width={width - 6} height={3} rx={0.5} fill={C.rackWood} stroke={C.rackWoodDark} strokeWidth={0.4} />
          {/* Skulls on this row */}
          {Array.from({ length: cols }).map((_, col) => {
            const rot = sineWave(frame, 0.3 + col * 0.05, row * 2 + col) * 8;
            return (
              <Skull key={col} x={10 + col * (width - 20) / cols} y={10 + row * 18} scale={0.65} rot={rot} />
            );
          })}
        </g>
      ))}
      {/* Top cap */}
      <rect x={-3} y={-5} width={width + 6} height={8} rx={2} fill={C.rackWoodDark} stroke={C.pyramidDark} strokeWidth={0.5} />
    </g>
  );
};

/** Incense burner (copal brazier) */
const IncenseBurner: React.FC<{
  x: number; y: number; scale?: number; frame: number; seed?: number;
}> = ({ x, y, scale = 1, frame, seed = 0 }) => {
  const smoke1 = sineWave(frame, 0.8, seed);
  const smoke2 = sineWave(frame, 1.3, seed + 2);
  const glow = 0.6 + sineWave(frame, 2, seed) * 0.2;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* Bowl base */}
      <ellipse cx={0} cy={20} rx={12} ry={3} fill={C.pyramidDark} />
      {/* Stand */}
      <path d="M-4,20 L-3,5 L3,5 L4,20Z" fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
      {/* Bowl */}
      <path d="M-10,5 Q-12,-2 -8,-5 Q0,-8 8,-5 Q12,-2 10,5Z" fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.8} />
      {/* Carved decorations on bowl */}
      <path d="M-7,0 Q-3,-2 0,0 Q3,-2 7,0" fill="none" stroke={C.goldDark} strokeWidth={0.5} />
      <circle cx={-5} cy={2} r={1} fill={C.turquoiseDark} opacity={0.6} />
      <circle cx={5} cy={2} r={1} fill={C.turquoiseDark} opacity={0.6} />
      {/* Glowing coals */}
      <ellipse cx={0} cy={-3} rx={6} ry={2.5} fill={C.fireDark} opacity={glow} />
      <ellipse cx={0} cy={-3} rx={4} ry={1.5} fill={C.fireMid} opacity={glow * 0.8} />
      <ellipse cx={0} cy={-3} rx={2} ry={1} fill={C.fireLight} opacity={glow * 0.6} />
      {/* Smoke columns */}
      {[0, 1, 2].map(i => {
        const sX = (i - 1) * 4 + smoke1 * 3 * (i === 1 ? -1 : 1);
        const phase = seed + i * 1.5;
        return (
          <g key={i}>
            <ellipse cx={sX + sineWave(frame, 0.5, phase) * 5} cy={-15 - i * 8 + smoke2 * 2} rx={5 + i * 3} ry={4 + i * 2} fill={C.copalSmoke} opacity={0.3 - i * 0.05} />
            <ellipse cx={sX + sineWave(frame, 0.4, phase + 1) * 8} cy={-28 - i * 12 + smoke1 * 3} rx={8 + i * 4} ry={5 + i * 3} fill={C.incenseGray} opacity={0.2 - i * 0.04} />
            <ellipse cx={sX + sineWave(frame, 0.3, phase + 2) * 12} cy={-45 - i * 15} rx={12 + i * 5} ry={7 + i * 3} fill={C.smokeWhite} opacity={0.12 - i * 0.03} />
          </g>
        );
      })}
    </g>
  );
};

/** Sacred banner hanging from pole */
const SacredBanner: React.FC<{
  x: number; y: number; color: string; colorDark: string; height?: number; frame: number; seed?: number;
}> = ({ x, y, color, colorDark, height = 80, frame, seed = 0 }) => {
  const sway = sineWave(frame, 0.6, seed) * 3;
  const wave1 = sineWave(frame, 1.2, seed + 1) * 2;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Pole */}
      <rect x={-2} y={-10} width={4} height={height + 20} rx={1} fill={C.rackWood} stroke={C.rackWoodDark} strokeWidth={0.5} />
      {/* Pole top ornament */}
      <circle cx={0} cy={-12} r={4} fill={C.goldBright} stroke={C.goldDark} strokeWidth={0.5} />
      <circle cx={0} cy={-12} r={2} fill={C.turquoise} />
      {/* Banner fabric */}
      <path
        d={`M3,0 Q${8 + sway},${height * 0.3} ${5 + wave1},${height * 0.6} Q${3 + sway * 0.5},${height * 0.8} ${6 + wave1 * 0.5},${height}
            L${-4 + wave1 * 0.3},${height} Q${-2 + sway * 0.3},${height * 0.8} ${-3 + wave1 * 0.5},${height * 0.6}
            Q${-6 + sway * 0.5},${height * 0.3} -3,0Z`}
        fill={color}
        stroke={colorDark}
        strokeWidth={0.5}
      />
      {/* Banner pattern - diamond shapes */}
      {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
        const by = height * t;
        const bx = sineWave(frame, 0.6, seed + i) * 1.5;
        return (
          <path key={i} d={`M${bx},${by - 5} L${bx + 5},${by} L${bx},${by + 5} L${bx - 5},${by}Z`}
            fill={C.goldBright} opacity={0.5} />
        );
      })}
      {/* Fringe at bottom */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={-3 + i * 2.5 + sway * 0.3} y1={height} x2={-4 + i * 2.5 + sway * 0.5} y2={height + 8 + sineWave(frame, 1, seed + i) * 2}
          stroke={C.goldBright} strokeWidth={0.8} opacity={0.6} />
      ))}
    </g>
  );
};

/** Feathered headdress decoration on shrine */
const FeatherCrest: React.FC<{
  x: number; y: number; scale?: number; frame: number; seed?: number;
}> = ({ x, y, scale = 1, frame, seed = 0 }) => {
  const sway = sineWave(frame, 0.8, seed) * 2;
  const colors = [C.featherGreen, C.featherBlue, C.featherRed, C.featherGold, C.featherGreen, C.featherBlue, C.featherRed];
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {colors.map((color, i) => {
        const angle = -60 + i * 20;
        const featherSway = sway + sineWave(frame, 1.2, seed + i * 0.7) * 3;
        return (
          <path key={i}
            d={`M0,0 Q${Math.sin((angle + featherSway) * Math.PI / 180) * 20},${-15} ${Math.sin((angle + featherSway) * Math.PI / 180) * 35},${-40 - i * 2}`}
            fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
        );
      })}
    </g>
  );
};

/** Carved stone step detail */
const CarvedStep: React.FC<{
  x: number; y: number; width: number; height: number;
}> = ({ x, y, width, height }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={0} y={0} width={width} height={height} fill={C.stairStone} stroke={C.stairShadow} strokeWidth={0.5} />
    {/* Carved glyphs along step face */}
    {Array.from({ length: Math.floor(width / 25) }).map((_, i) => (
      <g key={i} transform={`translate(${12 + i * 25},${height / 2})`}>
        <rect x={-5} y={-4} width={10} height={8} rx={1} fill="none" stroke={C.pyramidDark} strokeWidth={0.4} opacity={0.4} />
        <circle cx={0} cy={0} r={2} fill="none" stroke={C.pyramidDark} strokeWidth={0.3} opacity={0.3} />
        <line x1={-3} y1={-2} x2={3} y2={2} stroke={C.pyramidDark} strokeWidth={0.3} opacity={0.3} />
      </g>
    ))}
    {/* Top edge highlight */}
    <line x1={0} y1={0} x2={width} y2={0} stroke={C.stairHighlight} strokeWidth={0.5} opacity={0.4} />
  </g>
);

/** Obsidian sacrificial knife */
const SacrificialKnife: React.FC<{
  x: number; y: number; scale?: number; rotation?: number;
}> = ({ x, y, scale = 1, rotation = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rotation}) scale(${scale})`}>
    {/* Blade */}
    <path d="M0,0 Q5,-2 18,-5 Q22,-4 20,0 Q18,4 5,2Z" fill={C.obsidian} stroke={C.obsidianShine} strokeWidth={0.5} />
    {/* Edge gleam */}
    <path d="M2,0 Q10,-1 18,-4" fill="none" stroke={C.obsidianShine} strokeWidth={0.3} opacity={0.6} />
    {/* Handle */}
    <path d="M0,0 Q-2,-3 -10,-3 Q-14,-2 -14,0 Q-14,2 -10,3 Q-2,3 0,0Z" fill={C.turquoiseDark} stroke={C.jadeDark} strokeWidth={0.5} />
    {/* Mosaic on handle */}
    <circle cx={-5} cy={0} r={1.5} fill={C.turquoise} opacity={0.8} />
    <circle cx={-9} cy={0} r={1.2} fill={C.jadeGreen} opacity={0.8} />
    <circle cx={-7} cy={-1.5} r={0.8} fill={C.goldBright} opacity={0.6} />
    <circle cx={-7} cy={1.5} r={0.8} fill={C.goldBright} opacity={0.6} />
  </g>
);

/** Stone board/tablet for boardText display */
const StoneTablet: React.FC<{
  x: number; y: number; width: number; height: number; text?: string; frame: number;
}> = ({ x, y, width, height, text, frame }) => {
  const glow = 0.5 + sineWave(frame, 0.5, 0) * 0.1;
  if (!text) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Shadow */}
      <rect x={4} y={4} width={width} height={height} rx={6} fill={C.boardShadow} />
      {/* Stone background */}
      <rect x={0} y={0} width={width} height={height} rx={6} fill={C.boardBg} stroke={C.boardEdge} strokeWidth={2} />
      {/* Inner border with carved pattern */}
      <rect x={6} y={6} width={width - 12} height={height - 12} rx={3} fill="none" stroke={C.goldDark} strokeWidth={1} opacity={0.4} />
      {/* Corner glyphs */}
      {[[10, 10], [width - 14, 10], [10, height - 14], [width - 14, height - 14]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill={C.turquoiseDark} opacity={0.4} />
      ))}
      {/* Text */}
      <text x={width / 2} y={height / 2 + 6} textAnchor="middle" fill={C.boardText} fontSize={16} fontFamily="Georgia, serif" opacity={glow}>
        {text}
      </text>
      {/* Fire glow effect on tablet */}
      <rect x={0} y={0} width={width} height={height} rx={6} fill={C.fireGlowWide} opacity={0.15 + sineWave(frame, 2, 5) * 0.05} />
    </g>
  );
};

/** Animated blood drip */
const BloodDrip: React.FC<{
  x: number; startY: number; frame: number; seed?: number; speed?: number;
}> = ({ x, startY, frame, seed = 0, speed = 0.5 }) => {
  const progress = ((frame * speed + seed * 40) % 120) / 120;
  const dripY = startY + progress * 60;
  const opacity = progress < 0.8 ? 0.8 : (1 - progress) * 4;
  const stretch = 1 + progress * 0.5;
  return (
    <g>
      {/* Trail */}
      <line x1={x} y1={startY} x2={x} y2={dripY - 3} stroke={C.bloodMid} strokeWidth={1.2} opacity={opacity * 0.4} />
      {/* Drip */}
      <ellipse cx={x} cy={dripY} rx={1.5} ry={2 * stretch} fill={C.bloodLight} opacity={opacity} />
      <ellipse cx={x} cy={dripY - 0.5} rx={0.8} ry={1} fill={C.bloodGlisten} opacity={opacity * 0.5} />
    </g>
  );
};

/** Ceremonial drum */
const CeremonialDrum: React.FC<{
  x: number; y: number; scale?: number; frame: number; seed?: number;
}> = ({ x, y, scale = 1, frame, seed = 0 }) => {
  const vibrate = sineWave(frame, 6, seed) * 0.5;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* Drum body */}
      <ellipse cx={0} cy={25} rx={18} ry={5} fill={C.rackWoodDark} />
      <rect x={-18} y={0} width={36} height={25} rx={2} fill={C.rackWood} stroke={C.rackWoodDark} strokeWidth={0.8} />
      {/* Drum skin top */}
      <ellipse cx={0} cy={0 + vibrate} rx={18} ry={5} fill={C.skullWhite} stroke={C.rackWoodDark} strokeWidth={0.8} opacity={0.9} />
      {/* Rope tensioners */}
      {[-12, -6, 0, 6, 12].map((rx, i) => (
        <line key={i} x1={rx} y1={5} x2={rx + 2} y2={22} stroke={C.rackRope} strokeWidth={0.6} />
      ))}
      {/* Carved patterns on body */}
      <path d="M-15,10 Q-8,8 0,10 Q8,8 15,10" fill="none" stroke={C.goldDark} strokeWidth={0.5} opacity={0.5} />
      <path d="M-15,16 Q-8,14 0,16 Q8,14 15,16" fill="none" stroke={C.goldDark} strokeWidth={0.5} opacity={0.5} />
    </g>
  );
};

/** Offering bowl with food/hearts */
const OfferingBowl: React.FC<{
  x: number; y: number; scale?: number;
}> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {/* Bowl shadow */}
    <ellipse cx={0} cy={12} rx={14} ry={3} fill={C.plazaDark} opacity={0.4} />
    {/* Bowl body */}
    <path d="M-12,0 Q-14,8 -10,10 Q0,14 10,10 Q14,8 12,0Z" fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.6} />
    {/* Bowl rim */}
    <ellipse cx={0} cy={0} rx={12} ry={3.5} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
    {/* Contents (dark offerings) */}
    <ellipse cx={0} cy={-0.5} rx={9} ry={2.5} fill={C.bloodDark} opacity={0.7} />
    {/* Gold rim decoration */}
    <ellipse cx={0} cy={0} rx={12} ry={3.5} fill="none" stroke={C.goldDark} strokeWidth={0.4} opacity={0.5} />
    {/* Jade inlays */}
    <circle cx={-8} cy={5} r={1} fill={C.jadeGreen} opacity={0.6} />
    <circle cx={8} cy={5} r={1} fill={C.jadeGreen} opacity={0.6} />
    <circle cx={0} cy={8} r={1} fill={C.turquoise} opacity={0.6} />
  </g>
);

// ---- Main Component ----
export const AztecSacrifice: React.FC<AztecSacrificeProps> = ({
  boardText,
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Atmospheric animation values
  const breathe = sineWave(frame, 0.3, 0);
  const slowDrift = sineWave(frame, 0.15, 0);
  const fireFlicker = sineWave(frame, 3, 0);
  const smokeRise = sineWave(frame, 0.4, 2);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ backgroundColor: C.skyTop }}>
      <defs>
        {/* Night sky gradient */}
        <linearGradient id="sac-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="30%" stopColor={C.skyMid} />
          <stop offset="60%" stopColor={C.skyLow} />
          <stop offset="100%" stopColor={C.skyHorizon} />
        </linearGradient>

        {/* Pyramid stone texture */}
        <pattern id="sac-stone-tex" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={C.pyramidMid} />
          <rect x="0" y="0" width="4" height="4" fill={C.pyramidBase} opacity="0.3" />
          <rect x="4" y="4" width="4" height="4" fill={C.pyramidBase} opacity="0.2" />
          <circle cx="2" cy="6" r="0.3" fill={C.pyramidDark} opacity="0.2" />
          <circle cx="6" cy="2" r="0.3" fill={C.pyramidDark} opacity="0.15" />
        </pattern>

        {/* Blood channel gradient */}
        <linearGradient id="sac-blood-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bloodLight} />
          <stop offset="50%" stopColor={C.bloodMid} />
          <stop offset="100%" stopColor={C.bloodDark} />
        </linearGradient>

        {/* Fire glow radial */}
        <radialGradient id="sac-fire-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={C.fireLight} stopOpacity="0.3" />
          <stop offset="50%" stopColor={C.fireMid} stopOpacity="0.1" />
          <stop offset="100%" stopColor={C.fireDark} stopOpacity="0" />
        </radialGradient>

        {/* Moon glow */}
        <radialGradient id="sac-moon-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={C.moonFace} stopOpacity="0.4" />
          <stop offset="40%" stopColor={C.moonGlow} stopOpacity="0.15" />
          <stop offset="100%" stopColor={C.moonGlow} stopOpacity="0" />
        </radialGradient>

        {/* Canvas oil painting texture */}
        <filter id="sac-canvas">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="42" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="canvas" />
        </filter>

        {/* Vignette gradient */}
        <radialGradient id="sac-vignette" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.2)" />
          <stop offset="100%" stopColor={C.vignetteEdge} />
        </radialGradient>

        {/* God ray gradient */}
        <linearGradient id="sac-godray" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={C.fireLight} stopOpacity="0.08" />
          <stop offset="100%" stopColor={C.fireDark} stopOpacity="0" />
        </linearGradient>

        {/* Smoke filter for softness */}
        <filter id="sac-smoke-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        {/* Star twinkle filter */}
        <filter id="sac-star-glow">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* ============================================================ */}
      {/* LAYER 1: NIGHT SKY                                           */}
      {/* ============================================================ */}
      <rect x={0} y={0} width={width} height={height} fill="url(#sac-sky)" />

      {/* Stars */}
      {[
        [120, 45, 1.2], [280, 30, 0.8], [450, 60, 1.0], [620, 25, 0.7], [780, 50, 1.1],
        [920, 35, 0.6], [1050, 55, 0.9], [1200, 20, 1.0], [1380, 45, 0.7], [1520, 30, 0.8],
        [1680, 65, 0.6], [1800, 40, 1.0], [200, 90, 0.5], [500, 85, 0.7], [850, 75, 0.8],
        [1100, 80, 0.6], [1450, 70, 0.9], [1700, 85, 0.5], [350, 110, 0.4], [700, 100, 0.6],
        [1000, 95, 0.5], [1300, 105, 0.7], [1600, 115, 0.4], [1850, 60, 0.6],
        [160, 140, 0.5], [420, 130, 0.6], [680, 125, 0.4], [940, 135, 0.5],
        [1160, 120, 0.7], [1400, 140, 0.4], [1650, 128, 0.6], [1880, 110, 0.5],
      ].map(([sx, sy, sr], i) => {
        const twinkle = 0.4 + sineWave(frame, 0.5 + i * 0.1, i * 1.3) * 0.4;
        return (
          <circle key={i} cx={sx} cy={sy} r={sr as number} fill={i % 3 === 0 ? C.starYellow : C.starWhite} opacity={twinkle} />
        );
      })}

      {/* Moon */}
      <circle cx={1650} cy={100} r={60} fill="url(#sac-moon-glow)" />
      <circle cx={1650} cy={100} r={28} fill={C.moonFace} opacity={0.9} />
      <circle cx={1650} cy={100} r={26} fill={C.moonShadow} opacity={0.3} />
      {/* Moon craters */}
      <circle cx={1642} cy={92} r={4} fill={C.moonCrater} opacity={0.3} />
      <circle cx={1658} cy={105} r={3} fill={C.moonCrater} opacity={0.25} />
      <circle cx={1645} cy={108} r={2.5} fill={C.moonCrater} opacity={0.2} />
      <circle cx={1656} cy={90} r={2} fill={C.moonCrater} opacity={0.2} />
      {/* Moon shadow (crescent effect) */}
      <circle cx={1660} cy={96} r={24} fill={C.skyMid} opacity={0.5} />

      {/* Wispy night clouds */}
      {[
        [200, 80, 250, 20, 0.08], [600, 120, 300, 25, 0.06], [1000, 60, 200, 18, 0.07],
        [1400, 100, 280, 22, 0.05], [1700, 70, 220, 16, 0.06],
      ].map(([cx, cy, w, h, op], i) => (
        <ellipse key={i} cx={(cx as number) + slowDrift * 10} cy={cy as number} rx={w as number} ry={h as number}
          fill={C.skyLow} opacity={op as number} />
      ))}

      {/* Horizon fire glow from unseen city fires */}
      <ellipse cx={width / 2} cy={height * 0.35} rx={600} ry={80}
        fill={C.skyGlow} opacity={0.3 + fireFlicker * 0.05} />

      {/* ============================================================ */}
      {/* LAYER 2: DISTANT CITY SILHOUETTE                             */}
      {/* ============================================================ */}
      <g opacity={0.6}>
        {/* Distant buildings silhouette */}
        <path d={`M0,360 L80,360 L80,340 L100,340 L100,320 L110,310 L120,320 L120,340
          L200,340 L200,330 L220,330 L220,350 L300,350 L300,320 L310,300 L320,320 L320,350
          L400,350 L400,345 L450,345 L450,330 L460,310 L470,330 L470,350
          L550,350 L550,340 L580,340 L580,355 L650,355 L650,335 L660,315 L670,335 L670,355
          L750,355 L750,345 L800,345 L800,355 L880,355 L880,325 L890,305 L900,325 L900,355
          L980,355 L980,340 L1020,340 L1020,355 L1100,355 L1100,330 L1110,310 L1120,330 L1120,355
          L1200,355 L1200,345 L1250,345 L1250,360 L1350,360 L1350,340 L1360,320 L1370,340 L1370,360
          L1500,360 L1500,350 L1550,350 L1550,335 L1560,315 L1570,335 L1570,355
          L1650,355 L1650,345 L1700,345 L1700,360 L1800,360 L1800,340 L1810,325 L1820,340 L1820,360
          L${width},360 L${width},370 L0,370Z`}
          fill={C.cityDark} />
        {/* Distant temple pyramids */}
        <path d="M300,350 L340,260 L380,350Z" fill={C.cityMid} />
        <path d="M880,355 L930,250 L980,355Z" fill={C.cityMid} />
        <path d="M1550,355 L1590,270 L1630,355Z" fill={C.cityMid} />
        {/* Tiny window lights */}
        {[120, 250, 420, 580, 720, 890, 1050, 1220, 1380, 1550, 1720, 1850].map((wx, i) => (
          <rect key={i} x={wx} y={342 + (i % 3) * 4} width={2} height={2}
            fill={C.cityWindow} opacity={0.3 + sineWave(frame, 0.3 + i * 0.1, i) * 0.15} />
        ))}
        {/* Distant torch glows */}
        {[350, 920, 1580].map((tx, i) => (
          <circle key={i} cx={tx} cy={255 + i * 5} r={5}
            fill={C.cityTorch} opacity={0.4 + sineWave(frame, 2, i * 3) * 0.15} />
        ))}
      </g>

      {/* ============================================================ */}
      {/* LAYER 3: GREAT TEMPLE - TEMPLO MAYOR                        */}
      {/* ============================================================ */}
      <g>
        {/* Pyramid base - massive structure */}
        {/* Step 1 (base) */}
        <rect x={460} y={620} width={1000} height={60} fill="url(#sac-stone-tex)" stroke={C.pyramidDark} strokeWidth={0.5} />
        <CarvedStep x={460} y={620} width={1000} height={60} />

        {/* Step 2 */}
        <rect x={510} y={560} width={900} height={60} fill="url(#sac-stone-tex)" stroke={C.pyramidDark} strokeWidth={0.5} />
        <CarvedStep x={510} y={560} width={900} height={60} />

        {/* Step 3 */}
        <rect x={560} y={500} width={800} height={60} fill="url(#sac-stone-tex)" stroke={C.pyramidDark} strokeWidth={0.5} />
        <CarvedStep x={560} y={500} width={800} height={60} />

        {/* Step 4 */}
        <rect x={610} y={440} width={700} height={60} fill="url(#sac-stone-tex)" stroke={C.pyramidDark} strokeWidth={0.5} />
        <CarvedStep x={610} y={440} width={700} height={60} />

        {/* Step 5 */}
        <rect x={660} y={380} width={600} height={60} fill="url(#sac-stone-tex)" stroke={C.pyramidDark} strokeWidth={0.5} />
        <CarvedStep x={660} y={380} width={600} height={60} />

        {/* Step 6 (top platform) */}
        <rect x={710} y={320} width={500} height={60} fill="url(#sac-stone-tex)" stroke={C.pyramidDark} strokeWidth={0.5} />
        <CarvedStep x={710} y={320} width={500} height={60} />

        {/* Shadow on left side of pyramid */}
        <path d={`M460,680 L710,320 L710,380 L460,680Z`} fill={C.pyramidShadow} opacity={0.4} />

        {/* Central stairway */}
        <rect x={900} y={320} width={120} height={360} fill={C.stairCenter} stroke={C.stairShadow} strokeWidth={0.5} />
        {/* Stair lines */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={900} y1={325 + i * 15} x2={1020} y2={325 + i * 15}
            stroke={C.stairShadow} strokeWidth={0.5} opacity={0.5} />
        ))}
        {/* Stair center line */}
        <line x1={960} y1={320} x2={960} y2={680} stroke={C.stairShadow} strokeWidth={0.5} opacity={0.3} />
        {/* Stair side rails */}
        <rect x={896} y={320} width={4} height={360} fill={C.pyramidDark} />
        <rect x={1020} y={320} width={4} height={360} fill={C.pyramidDark} />

        {/* Serpent heads at stairway base */}
        <SerpentHead x={880} y={665} scale={1.8} />
        <SerpentHead x={1040} y={665} scale={1.8} flip />

        {/* Serpent balustrades running up stairs */}
        <path d="M898,680 Q895,500 898,320" fill="none" stroke={C.serpentStone} strokeWidth={4} />
        <path d="M1022,680 Q1025,500 1022,320" fill="none" stroke={C.serpentStone} strokeWidth={4} />
        {/* Serpent body undulations */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <circle cx={896} cy={360 + i * 40} r={3} fill={C.serpentStone} stroke={C.serpentDark} strokeWidth={0.3} />
            <circle cx={1024} cy={360 + i * 40} r={3} fill={C.serpentStone} stroke={C.serpentDark} strokeWidth={0.3} />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* LAYER 4: TWIN SHRINES AT TOP                                 */}
      {/* ============================================================ */}
      <g>
        {/* Left shrine - Tlaloc (blue/rain) */}
        <rect x={720} y={260} width={200} height={65} rx={2} fill={C.shrineBlue} stroke={C.shrineBlueDark} strokeWidth={1} />
        <rect x={720} y={252} width={200} height={12} rx={1} fill={C.shrineBlueLight} stroke={C.shrineBlueDark} strokeWidth={0.5} />
        {/* Tlaloc door */}
        <rect x={790} y={280} width={50} height={45} rx={2} fill={C.shrineBlueDark} />
        <rect x={792} y={282} width={46} height={41} rx={1} fill={C.priestBlack} opacity={0.8} />
        {/* Tlaloc roof */}
        <path d="M715,252 L820,220 L925,252Z" fill={C.shrineRoof} stroke={C.shrineRoofEdge} strokeWidth={0.5} />
        {/* Tlaloc crest */}
        <FeatherCrest x={820} y={222} scale={0.8} frame={frame} seed={0} />
        {/* Rain god symbols on wall */}
        <circle cx={750} cy={290} r={8} fill="none" stroke={C.turquoise} strokeWidth={1} opacity={0.5} />
        <path d="M746,298 L750,306 L754,298" fill="none" stroke={C.turquoise} strokeWidth={0.8} opacity={0.5} />
        <circle cx={885} cy={290} r={8} fill="none" stroke={C.turquoise} strokeWidth={1} opacity={0.5} />
        <path d="M881,298 L885,306 L889,298" fill="none" stroke={C.turquoise} strokeWidth={0.8} opacity={0.5} />

        {/* Right shrine - Huitzilopochtli (red/war) */}
        <rect x={1000} y={260} width={200} height={65} rx={2} fill={C.shrineRed} stroke={C.shrineRedDark} strokeWidth={1} />
        <rect x={1000} y={252} width={200} height={12} rx={1} fill={C.shrineRedLight} stroke={C.shrineRedDark} strokeWidth={0.5} />
        {/* Huitzilopochtli door */}
        <rect x={1070} y={280} width={50} height={45} rx={2} fill={C.shrineRedDark} />
        <rect x={1072} y={282} width={46} height={41} rx={1} fill={C.priestBlack} opacity={0.8} />
        {/* War shrine roof */}
        <path d="M995,252 L1100,220 L1205,252Z" fill={C.shrineRoof} stroke={C.shrineRoofEdge} strokeWidth={0.5} />
        {/* War shrine crest */}
        <FeatherCrest x={1100} y={222} scale={0.8} frame={frame} seed={3} />
        {/* War god symbols on wall */}
        <path d="M1030,280 L1040,295 L1020,295Z" fill="none" stroke={C.goldBright} strokeWidth={1} opacity={0.5} />
        <circle cx={1035} cy={295} r={5} fill="none" stroke={C.goldBright} strokeWidth={0.8} opacity={0.4} />
        <path d="M1160,280 L1170,295 L1150,295Z" fill="none" stroke={C.goldBright} strokeWidth={1} opacity={0.5} />
        <circle cx={1165} cy={295} r={5} fill="none" stroke={C.goldBright} strokeWidth={0.8} opacity={0.4} />

        {/* Sacrificial stone (techcatl) - between shrines on the platform */}
        <ellipse cx={960} cy={312} rx={30} ry={8} fill={C.altarDark} opacity={0.5} />
        <path d="M930,300 Q930,290 940,288 Q960,284 980,288 Q990,290 990,300 Q990,308 980,310 Q960,314 940,310 Q930,308 930,300Z"
          fill={C.altarStone} stroke={C.altarDark} strokeWidth={1} />
        {/* Blood stains on altar */}
        <ellipse cx={960} cy={296} rx={18} ry={4} fill={C.altarBlood} opacity={0.6} />
        <ellipse cx={955} cy={298} rx={10} ry={3} fill={C.altarBloodWet} opacity={0.4} />
        {/* Carved glyphs on altar */}
        <path d="M938,300 Q948,296 958,300 Q968,296 978,300" fill="none" stroke={C.altarCarving} strokeWidth={0.6} />
        <circle cx={945} cy={304} r={2} fill="none" stroke={C.altarCarving} strokeWidth={0.5} />
        <circle cx={975} cy={304} r={2} fill="none" stroke={C.altarCarving} strokeWidth={0.5} />
        {/* Sacrificial knife on altar */}
        <SacrificialKnife x={970} y={293} scale={0.8} rotation={-15} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 5: BLOOD CHANNELS                                      */}
      {/* ============================================================ */}
      <g>
        {/* Blood channel from altar down the stairs */}
        <path d={`M958,310 Q958,400 957,500 Q956,600 955,680`}
          fill="none" stroke="url(#sac-blood-grad)" strokeWidth={3} opacity={0.6} />
        <path d={`M962,310 Q963,420 964,520 Q965,620 966,680`}
          fill="none" stroke="url(#sac-blood-grad)" strokeWidth={2} opacity={0.4} />
        {/* Blood pool at base */}
        <ellipse cx={960} cy={682} rx={25} ry={5} fill={C.bloodDark} opacity={0.6} />
        <ellipse cx={960} cy={681} rx={18} ry={3} fill={C.bloodMid} opacity={0.5} />
        <ellipse cx={958} cy={680} rx={8} ry={2} fill={C.bloodGlisten} opacity={0.3} />
        {/* Dripping blood from altar */}
        {[940, 950, 960, 970, 980].map((bx, i) => (
          <BloodDrip key={i} x={bx} startY={310} frame={frame} seed={i * 7} speed={0.3 + i * 0.05} />
        ))}
        {/* Blood splatter on stairs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={950 + Math.sin(i * 2.3) * 15} cy={350 + i * 40} r={1.5 + Math.sin(i * 1.7) * 0.5}
            fill={C.bloodDried} opacity={0.3 + Math.sin(i * 3.1) * 0.1} />
        ))}
      </g>

      {/* ============================================================ */}
      {/* LAYER 6: TORCHES AND FIRE BRAZIERS                           */}
      {/* ============================================================ */}
      <g>
        {/* Large torches flanking the shrine */}
        <Torch x={710} y={260} scale={1.2} frame={frame} seed={0} />
        <Torch x={1210} y={260} scale={1.2} frame={frame} seed={2} />

        {/* Torches along the stairway */}
        <Torch x={875} y={400} scale={0.9} frame={frame} seed={4} />
        <Torch x={1040} y={400} scale={0.9} frame={frame} seed={5} />
        <Torch x={870} y={520} scale={0.8} frame={frame} seed={6} />
        <Torch x={1045} y={520} scale={0.8} frame={frame} seed={7} />
        <Torch x={865} y={620} scale={0.7} frame={frame} seed={8} />
        <Torch x={1050} y={620} scale={0.7} frame={frame} seed={9} />

        {/* Large fire braziers on platform */}
        <g transform="translate(750,310)">
          <ellipse cx={0} cy={5} rx={15} ry={4} fill={C.pyramidDark} opacity={0.4} />
          <path d="M-12,0 Q-14,-8 -8,-10 Q0,-12 8,-10 Q14,-8 12,0Z" fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.8} />
          {/* Big fire */}
          {(() => {
            const f1 = sineWave(frame, 3.5, 10);
            const f2 = sineWave(frame, 5.2, 11);
            return (
              <>
                <ellipse cx={0} cy={-18} rx={20 + f1 * 3} ry={25 + f2 * 4} fill={C.fireGlow} />
                <ellipse cx={f1 * 2} cy={-20 + f2} rx={12 + f1 * 2} ry={18 + f2 * 3} fill={C.fireDark} />
                <ellipse cx={f2} cy={-22 + f1} rx={8 + f2 * 1.5} ry={14 + f1 * 2} fill={C.fireMid} />
                <ellipse cx={f1 * 0.5} cy={-24 + f2 * 0.8} rx={5 + f1} ry={10 + f2 * 1.5} fill={C.fireLight} />
                <ellipse cx={0} cy={-25} rx={3} ry={6 + f1} fill={C.fireBright} opacity={0.8} />
              </>
            );
          })()}
        </g>

        <g transform="translate(1170,310)">
          <ellipse cx={0} cy={5} rx={15} ry={4} fill={C.pyramidDark} opacity={0.4} />
          <path d="M-12,0 Q-14,-8 -8,-10 Q0,-12 8,-10 Q14,-8 12,0Z" fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.8} />
          {(() => {
            const f1 = sineWave(frame, 3.5, 14);
            const f2 = sineWave(frame, 5.2, 15);
            return (
              <>
                <ellipse cx={0} cy={-18} rx={20 + f1 * 3} ry={25 + f2 * 4} fill={C.fireGlow} />
                <ellipse cx={f1 * 2} cy={-20 + f2} rx={12 + f1 * 2} ry={18 + f2 * 3} fill={C.fireDark} />
                <ellipse cx={f2} cy={-22 + f1} rx={8 + f2 * 1.5} ry={14 + f1 * 2} fill={C.fireMid} />
                <ellipse cx={f1 * 0.5} cy={-24 + f2 * 0.8} rx={5 + f1} ry={10 + f2 * 1.5} fill={C.fireLight} />
                <ellipse cx={0} cy={-25} rx={3} ry={6 + f1} fill={C.fireBright} opacity={0.8} />
              </>
            );
          })()}
        </g>

        {/* Ground-level fire pots along plaza */}
        {[200, 380, 1540, 1720].map((fx, i) => (
          <Torch key={i} x={fx} y={650} scale={0.6} frame={frame} seed={20 + i} />
        ))}

        {/* Fire glow pools on pyramid surface */}
        <ellipse cx={750} cy={310} rx={80} ry={30} fill={C.fireGlowWide} opacity={0.2 + fireFlicker * 0.05} />
        <ellipse cx={1170} cy={310} rx={80} ry={30} fill={C.fireGlowWide} opacity={0.2 + fireFlicker * 0.05} />
        <ellipse cx={960} cy={310} rx={60} ry={20} fill={C.fireGlowWide} opacity={0.15 + fireFlicker * 0.03} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 7: INCENSE BURNERS & SMOKE                             */}
      {/* ============================================================ */}
      <g>
        <IncenseBurner x={780} y={310} scale={0.9} frame={frame} seed={30} />
        <IncenseBurner x={1140} y={310} scale={0.9} frame={frame} seed={32} />
        <IncenseBurner x={850} y={615} scale={0.7} frame={frame} seed={34} />
        <IncenseBurner x={1070} y={615} scale={0.7} frame={frame} seed={36} />

        {/* Large smoke columns rising from temple */}
        <g filter="url(#sac-smoke-blur)">
          {[
            [780, 200, 60, 40, 0.15],
            [960, 180, 80, 50, 0.12],
            [1150, 210, 70, 45, 0.13],
          ].map(([sx, sy, sw, sh, sop], i) => {
            const drift = slowDrift * 15 + sineWave(frame, 0.3, i * 3) * 20;
            const rise = smokeRise * 10;
            return (
              <g key={i}>
                <ellipse cx={(sx as number) + drift} cy={(sy as number) - 40 + rise} rx={(sw as number) * 1.5} ry={(sh as number) * 1.2}
                  fill={C.smokeDark} opacity={(sop as number) * 0.6} />
                <ellipse cx={(sx as number) + drift * 0.7} cy={(sy as number) + rise * 0.5} rx={sw as number} ry={sh as number}
                  fill={C.smokeMid} opacity={sop as number} />
                <ellipse cx={(sx as number) + drift * 0.4} cy={(sy as number) + 30 + rise * 0.3} rx={(sw as number) * 0.7} ry={(sh as number) * 0.7}
                  fill={C.smokeLight} opacity={(sop as number) * 0.8} />
              </g>
            );
          })}
        </g>
      </g>

      {/* ============================================================ */}
      {/* LAYER 8: TZOMPANTLI (SKULL RACK)                             */}
      {/* ============================================================ */}
      <g>
        {/* Left skull rack */}
        <SkullRack x={140} y={540} width={180} rows={5} frame={frame} />
        {/* Right skull rack */}
        <SkullRack x={1600} y={540} width={180} rows={5} frame={frame} />
        {/* Small rack near stairs */}
        <SkullRack x={460} y={610} width={100} rows={3} frame={frame} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 9: SACRED BANNERS AND DECORATIONS                      */}
      {/* ============================================================ */}
      <g>
        {/* Banners flanking the pyramid */}
        <SacredBanner x={440} y={460} color={C.bannerRed} colorDark={C.shrineRedDark} height={100} frame={frame} seed={0} />
        <SacredBanner x={480} y={420} color={C.bannerBlue} colorDark={C.shrineBlueDark} height={110} frame={frame} seed={1} />
        <SacredBanner x={1440} y={460} color={C.bannerGold} colorDark={C.goldDark} height={100} frame={frame} seed={2} />
        <SacredBanner x={1480} y={420} color={C.bannerGreen} colorDark={C.jadeDark} height={110} frame={frame} seed={3} />

        {/* Hanging garlands/paper decorations between torches */}
        {[
          [710, 270, 920, 270, 30],
          [1000, 270, 1210, 270, 30],
        ].map(([x1, y1, x2, y2, sag], i) => {
          const sagAnim = (sag as number) + sineWave(frame, 0.5, i * 4) * 3;
          const mx = ((x1 as number) + (x2 as number)) / 2;
          const my = ((y1 as number) + (y2 as number)) / 2 + sagAnim;
          return (
            <g key={i}>
              <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                fill="none" stroke={C.featherGold} strokeWidth={1.5} opacity={0.6} />
              {/* Dangling paper cuts */}
              {Array.from({ length: 6 }).map((_, j) => {
                const t = (j + 1) / 7;
                const px = (x1 as number) + ((x2 as number) - (x1 as number)) * t;
                const py = (y1 as number) + sagAnim * 4 * t * (1 - t) + sineWave(frame, 0.8, i * 4 + j) * 2;
                const paperColor = j % 3 === 0 ? C.bannerRed : j % 3 === 1 ? C.bannerGold : C.bannerBlue;
                return (
                  <rect key={j} x={px - 3} y={py} width={6} height={10 + j % 3 * 2}
                    fill={paperColor} opacity={0.5} rx={0.5} />
                );
              })}
            </g>
          );
        })}

        {/* Offering bowls at pyramid base */}
        <OfferingBowl x={500} y={670} scale={0.9} />
        <OfferingBowl x={560} y={672} scale={0.8} />
        <OfferingBowl x={1360} y={670} scale={0.9} />
        <OfferingBowl x={1420} y={672} scale={0.8} />

        {/* Ceremonial drums */}
        <CeremonialDrum x={380} y={645} scale={0.9} frame={frame} seed={40} />
        <CeremonialDrum x={1540} y={645} scale={0.9} frame={frame} seed={42} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 10: PLAZA GROUND                                       */}
      {/* ============================================================ */}
      <g>
        {/* Main plaza floor */}
        <rect x={0} y={680} width={width} height={400} fill={C.plazaStone} />
        {/* Stone tile pattern */}
        {Array.from({ length: 20 }).map((_, row) =>
          Array.from({ length: 30 }).map((_, col) => (
            <rect key={`${row}-${col}`} x={col * 65 + (row % 2) * 32} y={680 + row * 20}
              width={64} height={19} fill={((row + col) % 3 === 0) ? C.plazaLight : C.plazaStone}
              stroke={C.plazaGap} strokeWidth={0.3} opacity={0.8} />
          ))
        )}
        {/* Blood stains on plaza */}
        {[
          [940, 700, 20, 6], [960, 710, 15, 4], [930, 720, 12, 3],
          [955, 730, 18, 5], [970, 695, 10, 3],
        ].map(([bx, by, bw, bh], i) => (
          <ellipse key={i} cx={bx as number} cy={by as number} rx={bw as number} ry={bh as number}
            fill={C.plazaBlood} opacity={0.3 - i * 0.03} />
        ))}
        {/* Ground-level fog */}
        <rect x={0} y={750} width={width} height={330} fill={C.fogDark} opacity={0.15 + breathe * 0.03} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 11: PRIEST FIGURES (hand-drawn on platform)            */}
      {/* ============================================================ */}
      <g>
        {/* High priest at altar - arms raised */}
        <g transform="translate(960,265)">
          {/* Body */}
          <rect x={-8} y={10} width={16} height={30} rx={2} fill={C.priestBlack} />
          {/* Head */}
          <circle cx={0} cy={5} r={7} fill={C.priestSkin} />
          {/* Face paint */}
          <rect x={-6} y={2} width={12} height={3} fill={C.priestPaint} opacity={0.7} />
          {/* Headdress */}
          <path d="M-10,-2 Q0,-18 10,-2" fill={C.featherGreen} stroke={C.jadeDark} strokeWidth={0.5} />
          <path d="M-7,-5 Q0,-22 7,-5" fill={C.featherRed} opacity={0.7} />
          {/* Arms raised holding knife */}
          <path d={`M-8,15 Q-20,${5 + sineWave(frame, 0.8, 50) * 3} -18,${-2 + sineWave(frame, 0.8, 50) * 2}`}
            fill="none" stroke={C.priestSkin} strokeWidth={4} strokeLinecap="round" />
          <path d={`M8,15 Q20,${5 + sineWave(frame, 0.8, 51) * 3} 18,${-2 + sineWave(frame, 0.8, 51) * 2}`}
            fill="none" stroke={C.priestSkin} strokeWidth={4} strokeLinecap="round" />
          {/* Knife in right hand */}
          <SacrificialKnife x={18} y={-5 + sineWave(frame, 0.8, 51) * 2} scale={0.6} rotation={-45 + sineWave(frame, 0.8, 51) * 5} />
          {/* Jade necklace */}
          <path d="M-6,10 Q0,14 6,10" fill="none" stroke={C.jadeGreen} strokeWidth={1.5} />
          {/* Blood splatter on robe */}
          <circle cx={-3} cy={25} r={2} fill={C.bloodDark} opacity={0.5} />
          <circle cx={4} cy={28} r={1.5} fill={C.bloodMid} opacity={0.4} />
          <circle cx={-1} cy={32} r={1.8} fill={C.bloodDark} opacity={0.4} />
        </g>

        {/* Assistant priest left */}
        <g transform="translate(930,275)">
          <rect x={-6} y={8} width={12} height={25} rx={2} fill={C.priestRobe} />
          <circle cx={0} cy={4} r={6} fill={C.priestSkin} />
          <rect x={-5} y={1} width={10} height={3} fill={C.priestPaintRed} opacity={0.6} />
          {/* Holding bowl */}
          <path d="M-6,12 Q-14,15 -16,18" fill="none" stroke={C.priestSkin} strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={-18} cy={20} rx={6} ry={3} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.5} />
          <ellipse cx={-18} cy={19} rx={4} ry={2} fill={C.bloodDark} opacity={0.6} />
        </g>

        {/* Assistant priest right */}
        <g transform="translate(990,275)">
          <rect x={-6} y={8} width={12} height={25} rx={2} fill={C.priestRobe} />
          <circle cx={0} cy={4} r={6} fill={C.priestSkin} />
          <rect x={-5} y={1} width={10} height={3} fill={C.priestPaintRed} opacity={0.6} />
          {/* Arms extended */}
          <path d="M6,12 Q14,10 18,8" fill="none" stroke={C.priestSkin} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Conch shell player at top of stairs */}
        <g transform="translate(1030,310)">
          <rect x={-5} y={6} width={10} height={22} rx={2} fill={C.priestBlack} />
          <circle cx={0} cy={2} r={5} fill={C.priestSkin} />
          {/* Conch shell */}
          <path d="M5,10 Q12,8 18,10 Q22,12 20,15 Q16,16 10,14Z" fill={C.skullWhite} stroke={C.skullShadow} strokeWidth={0.5} />
        </g>
      </g>

      {/* ============================================================ */}
      {/* LAYER 12: CROWD FIGURES                                      */}
      {/* ============================================================ */}
      <AztecCrowdLayer config={AZTEC_CROWD_CONFIGS.sacrifice} frame={frame} />

      {/* Additional hand-placed spectators in foreground */}
      <g>
        {/* Foreground kneeling figures */}
        {[
          [250, 730, 0.6], [350, 740, 0.55], [1550, 735, 0.6], [1650, 740, 0.55],
          [150, 745, 0.5], [1750, 745, 0.5],
        ].map(([fx, fy, fs], i) => {
          const bob = sineWave(frame, 0.5, i * 2) * 2;
          return (
            <g key={i} transform={`translate(${fx},${(fy as number) + bob}) scale(${fs})`}>
              {/* Kneeling body */}
              <rect x={-6} y={0} width={12} height={18} rx={2} fill={i % 2 === 0 ? '#E8D8B8' : '#3B6B8A'} />
              <circle cx={0} cy={-5} r={5} fill={C.priestSkin} />
              {/* Arms in prayer position */}
              <path d="M-6,5 Q-10,8 -8,12" fill="none" stroke={C.priestSkin} strokeWidth={2.5} strokeLinecap="round" />
              <path d="M6,5 Q10,8 8,12" fill="none" stroke={C.priestSkin} strokeWidth={2.5} strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      {/* ============================================================ */}
      {/* LAYER 13: GOD RAYS FROM FIRE                                 */}
      {/* ============================================================ */}
      <g opacity={0.15 + breathe * 0.03}>
        {/* Upward light shafts from fires */}
        {[750, 960, 1170].map((rx, i) => {
          const rayWidth = 40 + sineWave(frame, 0.3, i * 5) * 10;
          return (
            <polygon key={i}
              points={`${rx - rayWidth / 2},310 ${rx + rayWidth / 2},310 ${rx + rayWidth},0 ${rx - rayWidth},0`}
              fill="url(#sac-godray)" />
          );
        })}
      </g>

      {/* ============================================================ */}
      {/* LAYER 13b: PROCESSIONAL STAIRWAY FIGURES                     */}
      {/* ============================================================ */}
      <g>
        {/* Line of captives/prisoners being led up the stairs */}
        {Array.from({ length: 7 }).map((_, i) => {
          const stairX = 940 + sineWave(frame, 0.3, i * 2) * 1;
          const stairY = 640 - i * 45;
          const walk = sineWave(frame, 0.6, i * 1.5) * 1.5;
          const stumble = i === 3 ? sineWave(frame, 0.4, 20) * 3 : 0;
          return (
            <g key={i} transform={`translate(${stairX},${stairY + walk + stumble}) scale(0.5)`}>
              {/* Captive body - white loincloth, bound arms */}
              <rect x={-6} y={5} width={12} height={25} rx={2} fill="#E8D8B8" opacity={0.9} />
              <circle cx={0} cy={0} r={6} fill={C.priestSkin} />
              {/* Hair */}
              <path d="M-5,-4 Q0,-8 5,-4" fill="#2A1A0A" />
              {/* Bound hands behind back */}
              <path d="M-6,12 Q-10,15 -8,18 Q-4,20 0,18 Q4,20 8,18 Q10,15 6,12"
                fill="none" stroke={C.priestSkin} strokeWidth={2} />
              <path d="M-4,16 Q0,18 4,16" fill="none" stroke="#9B8968" strokeWidth={1.5} />
              {/* Fear/sadness expression */}
              <circle cx={-2} cy={-1} r={0.8} fill="#1A1A1A" />
              <circle cx={2} cy={-1} r={0.8} fill="#1A1A1A" />
              <path d="M-2,3 Q0,2 2,3" fill="none" stroke="#1A1A1A" strokeWidth={0.5} />
              {/* Guard warrior next to every other captive */}
              {i % 2 === 0 && (
                <g transform="translate(25,0)">
                  <rect x={-5} y={5} width={10} height={22} rx={2} fill={C.priestBlack} />
                  <circle cx={0} cy={0} r={5} fill={C.priestSkin} />
                  {/* Spear */}
                  <line x1={8} y1={-15} x2={8} y2={25} stroke="#7A5030" strokeWidth={2} />
                  <path d="M6,-15 L8,-22 L10,-15Z" fill={C.obsidian} />
                  {/* Shield */}
                  <ellipse cx={-8} cy={15} rx={6} ry={8} fill={C.bannerRed} stroke={C.shrineRedDark} strokeWidth={0.5} />
                  <path d="M-8,10 L-8,20" fill="none" stroke={C.goldBright} strokeWidth={0.4} />
                  <path d="M-12,15 L-4,15" fill="none" stroke={C.goldBright} strokeWidth={0.4} />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* ============================================================ */}
      {/* LAYER 13c: ADDITIONAL PYRAMID WALL CARVINGS                  */}
      {/* ============================================================ */}
      <g opacity={0.5}>
        {/* Large carved panels on pyramid face - left side */}
        {/* Sun Stone / Calendar carving */}
        <g transform="translate(520,480)">
          <circle cx={40} cy={40} r={35} fill="none" stroke={C.pyramidDark} strokeWidth={1.2} />
          <circle cx={40} cy={40} r={28} fill="none" stroke={C.pyramidDark} strokeWidth={0.8} />
          <circle cx={40} cy={40} r={20} fill="none" stroke={C.pyramidDark} strokeWidth={0.6} />
          <circle cx={40} cy={40} r={12} fill="none" stroke={C.pyramidDark} strokeWidth={0.5} />
          {/* Sun face center */}
          <circle cx={40} cy={40} r={6} fill={C.pyramidDark} opacity={0.3} />
          <circle cx={37} cy={38} r={1.5} fill={C.pyramidShadow} />
          <circle cx={43} cy={38} r={1.5} fill={C.pyramidShadow} />
          <path d="M37,43 Q40,45 43,43" fill="none" stroke={C.pyramidShadow} strokeWidth={0.8} />
          {/* Radiating lines */}
          {Array.from({ length: 16 }).map((_, j) => {
            const angle = (j / 16) * Math.PI * 2;
            return (
              <line key={j} x1={40 + Math.cos(angle) * 14} y1={40 + Math.sin(angle) * 14}
                x2={40 + Math.cos(angle) * 26} y2={40 + Math.sin(angle) * 26}
                stroke={C.pyramidDark} strokeWidth={0.5} />
            );
          })}
          {/* Cardinal point glyphs */}
          {[0, 90, 180, 270].map((angle, j) => {
            const rad = (angle * Math.PI) / 180;
            const gx = 40 + Math.cos(rad) * 32;
            const gy = 40 + Math.sin(rad) * 32;
            return <circle key={j} cx={gx} cy={gy} r={3} fill={C.pyramidDark} opacity={0.4} />;
          })}
        </g>

        {/* Warrior panel - right side */}
        <g transform="translate(1280,480)">
          <rect x={0} y={0} width={70} height={90} rx={3} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.6} />
          {/* Eagle warrior carving */}
          <circle cx={35} cy={20} r={10} fill="none" stroke={C.pyramidDark} strokeWidth={0.8} />
          {/* Beak/helmet */}
          <path d="M25,20 Q20,15 22,10 Q30,5 38,5 Q46,5 48,10 Q50,15 45,20"
            fill="none" stroke={C.pyramidDark} strokeWidth={0.6} />
          {/* Body */}
          <rect x={25} y={32} width={20} height={30} rx={2} fill="none" stroke={C.pyramidDark} strokeWidth={0.6} />
          {/* Shield */}
          <circle cx={18} cy={48} r={8} fill="none" stroke={C.pyramidDark} strokeWidth={0.5} />
          {/* Macuahuitl weapon */}
          <line x1={52} y1={35} x2={58} y2={65} stroke={C.pyramidDark} strokeWidth={1} />
          {/* Feather detail */}
          <path d="M28,10 Q35,-2 42,10" fill="none" stroke={C.pyramidDark} strokeWidth={0.4} />
        </g>

        {/* Serpent relief panels on step faces */}
        {[0, 1, 2, 3, 4, 5].map((step) => {
          const stepY = 625 + (step === 0 ? 0 : 0) - step * 60;
          const stepX = 465 + step * 50;
          const stepW = 990 - step * 100;
          return (
            <g key={step}>
              {/* Undulating serpent body along step */}
              <path d={`M${stepX + 20},${stepY + 30} Q${stepX + stepW * 0.25},${stepY + 22} ${stepX + stepW * 0.5},${stepY + 30} Q${stepX + stepW * 0.75},${stepY + 38} ${stepX + stepW - 20},${stepY + 30}`}
                fill="none" stroke={C.pyramidDark} strokeWidth={0.6} opacity={0.3} />
              {/* Diamond pattern on serpent */}
              {Array.from({ length: Math.floor(stepW / 60) }).map((_, d) => (
                <path key={d} d={`M${stepX + 40 + d * 60},${stepY + 25} L${stepX + 45 + d * 60},${stepY + 30} L${stepX + 40 + d * 60},${stepY + 35} L${stepX + 35 + d * 60},${stepY + 30}Z`}
                  fill="none" stroke={C.pyramidDark} strokeWidth={0.3} opacity={0.3} />
              ))}
            </g>
          );
        })}
      </g>

      {/* ============================================================ */}
      {/* LAYER 13d: SIDE STRUCTURES AND BUILDINGS                     */}
      {/* ============================================================ */}
      <g>
        {/* Left auxiliary temple/building */}
        <rect x={140} y={520} width={130} height={160} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.8} />
        <rect x={140} y={510} width={130} height={15} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
        {/* Doorway */}
        <rect x={185} y={560} width={40} height={120} rx={2} fill={C.priestBlack} opacity={0.7} />
        {/* Torch beside door */}
        <Torch x={175} y={540} scale={0.5} frame={frame} seed={60} />
        {/* Carved frieze */}
        <path d="M145,535 Q170,528 205,535 Q240,528 265,535" fill="none" stroke={C.goldDark} strokeWidth={0.6} opacity={0.3} />
        {/* Upper wall decoration */}
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x={150 + i * 24} y={525} width={12} height={8} rx={1}
            fill="none" stroke={C.pyramidDark} strokeWidth={0.4} opacity={0.4} />
        ))}
        {/* Roof crest */}
        <path d="M140,510 L205,480 L270,510Z" fill={C.shrineRoof} stroke={C.pyramidDark} strokeWidth={0.5} />

        {/* Right auxiliary temple */}
        <rect x={1650} y={520} width={130} height={160} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.8} />
        <rect x={1650} y={510} width={130} height={15} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
        <rect x={1695} y={560} width={40} height={120} rx={2} fill={C.priestBlack} opacity={0.7} />
        <Torch x={1740} y={540} scale={0.5} frame={frame} seed={62} />
        <path d="M1655,535 Q1680,528 1715,535 Q1750,528 1775,535" fill="none" stroke={C.goldDark} strokeWidth={0.6} opacity={0.3} />
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x={1660 + i * 24} y={525} width={12} height={8} rx={1}
            fill="none" stroke={C.pyramidDark} strokeWidth={0.4} opacity={0.4} />
        ))}
        <path d="M1650,510 L1715,480 L1780,510Z" fill={C.shrineRoof} stroke={C.pyramidDark} strokeWidth={0.5} />

        {/* Coatepantli (serpent wall) in foreground */}
        <rect x={0} y={700} width={400} height={40} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.5} />
        {/* Carved serpent heads on wall */}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(${30 + i * 60},700)`}>
            <circle cx={0} cy={20} r={8} fill={C.serpentStone} stroke={C.serpentDark} strokeWidth={0.5} />
            <circle cx={-2} cy={18} r={1.5} fill={C.serpentEye} />
            <circle cx={2} cy={18} r={1.5} fill={C.serpentEye} />
            <path d="M-4,23 Q0,26 4,23" fill={C.serpentTongue} />
          </g>
        ))}

        <rect x={1520} y={700} width={400} height={40} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.5} />
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(${1550 + i * 60},700)`}>
            <circle cx={0} cy={20} r={8} fill={C.serpentStone} stroke={C.serpentDark} strokeWidth={0.5} />
            <circle cx={-2} cy={18} r={1.5} fill={C.serpentEye} />
            <circle cx={2} cy={18} r={1.5} fill={C.serpentEye} />
            <path d="M-4,23 Q0,26 4,23" fill={C.serpentTongue} />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* LAYER 13e: EAGLE AND JAGUAR WARRIOR STATUES                  */}
      {/* ============================================================ */}
      <g>
        {/* Giant eagle warrior statue - left of stairs */}
        <g transform="translate(820,580)">
          {/* Pedestal */}
          <rect x={-20} y={70} width={40} height={30} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.8} />
          <rect x={-23} y={95} width={46} height={10} rx={2} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.5} />
          {/* Torso */}
          <rect x={-12} y={20} width={24} height={50} rx={3} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.6} />
          {/* Head with eagle helmet */}
          <circle cx={0} cy={12} r={12} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.6} />
          <path d="M-12,8 Q0,-8 12,8" fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
          <path d="M0,-5 L0,5 L8,12" fill="none" stroke={C.pyramidDark} strokeWidth={0.6} />
          {/* Beak */}
          <path d="M0,5 Q-5,10 -3,15 Q0,12 3,15 Q5,10 0,5Z" fill={C.pyramidDark} opacity={0.7} />
          {/* Wings spread */}
          <path d="M-12,30 Q-30,20 -40,35 Q-35,40 -12,40" fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.5} />
          <path d="M12,30 Q30,20 40,35 Q35,40 12,40" fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.5} />
          {/* Shield */}
          <circle cx={-25} cy={55} r={10} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
          {/* Weapon */}
          <line x1={25} y1={25} x2={30} y2={70} stroke={C.pyramidDark} strokeWidth={2} />
        </g>

        {/* Giant jaguar warrior statue - right of stairs */}
        <g transform="translate(1100,580)">
          <rect x={-20} y={70} width={40} height={30} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.8} />
          <rect x={-23} y={95} width={46} height={10} rx={2} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={0.5} />
          <rect x={-12} y={20} width={24} height={50} rx={3} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.6} />
          <circle cx={0} cy={12} r={12} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.6} />
          {/* Jaguar ears */}
          <path d="M-10,2 Q-12,-5 -6,-2Z" fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.4} />
          <path d="M10,2 Q12,-5 6,-2Z" fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.4} />
          {/* Jaguar face */}
          <circle cx={-4} cy={8} r={2} fill={C.pyramidDark} opacity={0.6} />
          <circle cx={4} cy={8} r={2} fill={C.pyramidDark} opacity={0.6} />
          <path d="M-3,14 Q0,16 3,14" fill={C.pyramidDark} opacity={0.5} />
          {/* Jaguar spots on body */}
          {[[-5, 30], [5, 35], [-3, 45], [6, 50], [-6, 55]].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={2} fill={C.pyramidDark} opacity={0.3} />
          ))}
          <circle cx={25} cy={55} r={10} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
          <line x1={-25} y1={25} x2={-30} y2={70} stroke={C.pyramidDark} strokeWidth={2} />
        </g>
      </g>

      {/* ============================================================ */}
      {/* LAYER 14: FOREGROUND ELEMENTS                                */}
      {/* ============================================================ */}
      <g>
        {/* Left foreground - close-up of carved wall section */}
        <rect x={0} y={600} width={120} height={480} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={1} />
        {/* Carved relief on foreground wall */}
        <g transform="translate(20,640)">
          {/* Warrior carving */}
          <rect x={0} y={0} width={80} height={100} rx={3} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
          <circle cx={40} cy={25} r={12} fill="none" stroke={C.pyramidDark} strokeWidth={1} opacity={0.5} />
          <path d="M30,40 L40,55 L50,40" fill="none" stroke={C.pyramidDark} strokeWidth={0.8} opacity={0.5} />
          <rect x={25} y={60} width={30} height={30} rx={2} fill="none" stroke={C.pyramidDark} strokeWidth={0.6} opacity={0.4} />
          <path d="M35,65 L40,75 L45,65" fill="none" stroke={C.pyramidDark} strokeWidth={0.5} opacity={0.4} />
        </g>
        {/* Foreground torch */}
        <Torch x={60} y={580} scale={1.0} frame={frame} seed={50} />

        {/* Right foreground - pillar edge */}
        <rect x={1820} y={580} width={100} height={500} fill={C.pyramidBase} stroke={C.pyramidDark} strokeWidth={1} />
        <g transform="translate(1840,620)">
          <rect x={0} y={0} width={60} height={80} rx={3} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
          <circle cx={30} cy={20} r={10} fill="none" stroke={C.pyramidDark} strokeWidth={0.8} opacity={0.5} />
          <path d="M20,35 L30,50 L40,35" fill="none" stroke={C.pyramidDark} strokeWidth={0.6} opacity={0.4} />
        </g>
        <Torch x={1860} y={570} scale={1.0} frame={frame} seed={52} />

        {/* Foreground smoke wisps */}
        <g filter="url(#sac-smoke-blur)" opacity={0.3}>
          <ellipse cx={100 + slowDrift * 20} cy={800} rx={120} ry={40} fill={C.smokeMid} />
          <ellipse cx={1800 - slowDrift * 15} cy={820} rx={100} ry={35} fill={C.smokeMid} />
          <ellipse cx={960 + slowDrift * 10} cy={850} rx={200} ry={50} fill={C.smokeDark} opacity={0.2} />
        </g>

        {/* Floating embers in foreground */}
        {Array.from({ length: 20 }).map((_, i) => {
          const ex = 200 + (i * 83) % 1520;
          const ey = 300 + ((frame * 0.3 + i * 47) % 600);
          const eSize = 0.5 + (i % 5) * 0.3;
          const eOp = Math.max(0, 0.7 - (ey - 300) / 600);
          const eDrift = sineWave(frame, 0.5 + i * 0.1, i * 2) * 10;
          return (
            <circle key={i} cx={ex + eDrift} cy={1080 - ey} r={eSize}
              fill={i % 3 === 0 ? C.emberYellow : i % 3 === 1 ? C.emberOrange : C.emberRed}
              opacity={eOp * 0.6} />
          );
        })}
      </g>

      {/* ============================================================ */}
      {/* LAYER 14b: ADDITIONAL GROUND DETAILS AND OFFERINGS           */}
      {/* ============================================================ */}
      <g>
        {/* Scattered flower petals on plaza (marigold for ceremony) */}
        {Array.from({ length: 30 }).map((_, i) => {
          const px = 300 + (i * 47) % 1320;
          const py = 690 + (i * 23) % 60;
          const pRot = i * 37;
          const pSize = 1.5 + (i % 4) * 0.5;
          return (
            <ellipse key={i} cx={px} cy={py} rx={pSize} ry={pSize * 0.6}
              fill={i % 3 === 0 ? C.goldBright : i % 3 === 1 ? C.fireMid : C.featherRed}
              opacity={0.4 + (i % 5) * 0.05}
              transform={`rotate(${pRot},${px},${py})`} />
          );
        })}

        {/* Copal incense trails on the ground */}
        {[500, 700, 1200, 1400].map((ix, i) => (
          <g key={i}>
            <ellipse cx={ix} cy={695} rx={15} ry={3} fill={C.smokeMid} opacity={0.15} />
            <ellipse cx={ix + sineWave(frame, 0.4, i * 5) * 5} cy={685 + smokeRise * 3}
              rx={10 + sineWave(frame, 0.6, i) * 3} ry={8}
              fill={C.copalSmoke} opacity={0.1} />
          </g>
        ))}

        {/* Stone carved drainage channels in plaza */}
        <line x1={460} y1={680} x2={460} y2={780} stroke={C.plazaGap} strokeWidth={2} opacity={0.4} />
        <line x1={1460} y1={680} x2={1460} y2={780} stroke={C.plazaGap} strokeWidth={2} opacity={0.4} />
        <line x1={460} y1={780} x2={1460} y2={780} stroke={C.plazaGap} strokeWidth={2} opacity={0.3} />
        {/* Blood in channels */}
        <line x1={900} y1={682} x2={900} y2={780} stroke={C.bloodDark} strokeWidth={1.5} opacity={0.25} />
        <line x1={1020} y1={682} x2={1020} y2={780} stroke={C.bloodDark} strokeWidth={1} opacity={0.2} />

        {/* Offering piles at base of pyramid */}
        {/* Jade and turquoise offerings */}
        <g transform="translate(620,672)">
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={i * 8 - 20} cy={Math.sin(i * 1.3) * 3} r={3 + (i % 3)}
              fill={i % 2 === 0 ? C.jadeGreen : C.turquoise} opacity={0.6} stroke={C.jadeDark} strokeWidth={0.3} />
          ))}
        </g>

        {/* Gold ornaments offering */}
        <g transform="translate(1300,672)">
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i}>
              <circle cx={i * 10 - 20} cy={Math.cos(i * 1.7) * 2} r={2.5 + i % 2}
                fill={C.goldBright} opacity={0.5} stroke={C.goldDark} strokeWidth={0.3} />
              {i % 2 === 0 && (
                <rect x={i * 10 - 22} y={-6} width={5} height={3} rx={0.5}
                  fill={C.goldBright} opacity={0.4} />
              )}
            </g>
          ))}
        </g>

        {/* Feather bundles */}
        {[550, 1380].map((fbx, fi) => (
          <g key={fi} transform={`translate(${fbx},670)`}>
            {Array.from({ length: 8 }).map((_, i) => {
              const fAngle = -30 + i * 8;
              const fColor = [C.featherGreen, C.featherBlue, C.featherRed, C.featherGold][i % 4];
              return (
                <line key={i} x1={0} y1={0} x2={Math.sin(fAngle * Math.PI / 180) * 15}
                  y2={-10 - Math.cos(fAngle * Math.PI / 180) * 8}
                  stroke={fColor} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
              );
            })}
            <ellipse cx={0} cy={2} rx={5} ry={2} fill={C.rackRope} />
          </g>
        ))}

        {/* Large stone Chac Mool statue at plaza level */}
        <g transform="translate(700,690)">
          {/* Reclining figure base */}
          <ellipse cx={0} cy={15} rx={25} ry={5} fill={C.pyramidDark} opacity={0.3} />
          {/* Body reclining */}
          <path d="M-20,0 Q-18,-8 -10,-10 Q0,-12 10,-10 Q18,-8 20,0 Q18,8 10,10 Q0,12 -10,10 Q-18,8 -20,0Z"
            fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.8} />
          {/* Head turned sideways */}
          <circle cx={-18} cy={-5} r={7} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.6} />
          <circle cx={-20} cy={-7} r={1.5} fill={C.pyramidDark} opacity={0.5} />
          {/* Bowl on belly */}
          <ellipse cx={0} cy={-5} rx={8} ry={4} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
          <ellipse cx={0} cy={-6} rx={6} ry={3} fill={C.bloodDark} opacity={0.4} />
          {/* Knees */}
          <circle cx={15} cy={0} r={5} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.4} />
        </g>

        {/* Another Chac Mool on right side */}
        <g transform="translate(1220,690) scale(-1,1)">
          <ellipse cx={0} cy={15} rx={25} ry={5} fill={C.pyramidDark} opacity={0.3} />
          <path d="M-20,0 Q-18,-8 -10,-10 Q0,-12 10,-10 Q18,-8 20,0 Q18,8 10,10 Q0,12 -10,10 Q-18,8 -20,0Z"
            fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.8} />
          <circle cx={-18} cy={-5} r={7} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.6} />
          <circle cx={-20} cy={-7} r={1.5} fill={C.pyramidDark} opacity={0.5} />
          <ellipse cx={0} cy={-5} rx={8} ry={4} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.5} />
          <ellipse cx={0} cy={-6} rx={6} ry={3} fill={C.bloodDark} opacity={0.4} />
          <circle cx={15} cy={0} r={5} fill={C.pyramidLight} stroke={C.pyramidDark} strokeWidth={0.4} />
        </g>

        {/* Caged animals near the temple (jaguars for warriors) */}
        <g transform="translate(340,660)">
          {/* Wooden cage */}
          <rect x={0} y={0} width={40} height={30} fill="none" stroke={C.rackWood} strokeWidth={1.5} />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={8 + i * 8} y1={0} x2={8 + i * 8} y2={30}
              stroke={C.rackWood} strokeWidth={1} />
          ))}
          {/* Jaguar inside (silhouette) */}
          <ellipse cx={20} cy={18} rx={12} ry={8} fill="#5C4420" opacity={0.5} />
          <circle cx={15} cy={14} r={1} fill={C.serpentEye} opacity={0.8} />
          <circle cx={25} cy={14} r={1} fill={C.serpentEye} opacity={0.8} />
        </g>

        {/* Stone marker/stele with glyphs */}
        <g transform="translate(1500,640)">
          <rect x={0} y={0} width={20} height={45} rx={2} fill={C.pyramidMid} stroke={C.pyramidDark} strokeWidth={0.6} />
          <rect x={-3} y={42} width={26} height={8} rx={1} fill={C.pyramidBase} />
          {/* Glyphs */}
          <circle cx={10} cy={10} r={4} fill="none" stroke={C.pyramidDark} strokeWidth={0.5} opacity={0.5} />
          <rect x={5} y={18} width={10} height={8} rx={1} fill="none" stroke={C.pyramidDark} strokeWidth={0.4} opacity={0.4} />
          <path d="M5,30 Q10,33 15,30" fill="none" stroke={C.pyramidDark} strokeWidth={0.4} opacity={0.4} />
        </g>
      </g>

      {/* ============================================================ */}
      {/* LAYER 15: STONE TABLET BOARD                                 */}
      {/* ============================================================ */}
      <StoneTablet x={50} y={900} width={350} height={60} text={boardText} frame={frame} />

      {/* ============================================================ */}
      {/* LAYER 16: ATMOSPHERIC OVERLAYS                               */}
      {/* ============================================================ */}
      <g>
        {/* Vignette */}
        <rect x={0} y={0} width={width} height={height} fill="url(#sac-vignette)" />

        {/* Fire-lit warm overlay on lower half */}
        <rect x={0} y={400} width={width} height={680} fill={C.fireGlowWide} opacity={0.08 + fireFlicker * 0.02} />

        {/* Moonlight cool overlay on upper area */}
        <rect x={1400} y={0} width={520} height={400} fill={C.moonGlow} opacity={0.05} />

        {/* Film grain / canvas texture */}
        <rect x={0} y={0} width={width} height={height} fill="url(#sac-stone-tex)" opacity={0.03} />

        {/* Final atmospheric haze at bottom */}
        <rect x={0} y={900} width={width} height={180}
          fill={C.fogDark} opacity={0.2 + breathe * 0.03} />

        {/* Top darkness */}
        <rect x={0} y={0} width={width} height={150}
          fill={C.vignetteBlack} opacity={0.3} />

        {/* Subtle color shift for oil painting warmth */}
        <rect x={0} y={0} width={width} height={height}
          fill="rgba(180,120,40,0.03)" />
      </g>
    </svg>
  );
};

export default AztecSacrifice;
