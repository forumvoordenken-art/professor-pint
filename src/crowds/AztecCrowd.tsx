// Animated Aztec crowd components for background scenes
// Mesoamerican figures: warriors, priests, traders, farmers, musicians
// These create the feeling of a living, bustling Aztec world

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

// ---- Shared Aztec colors ----
const SKIN = '#B8865A';
const SKIN_DARK = '#9A6E42';
const SKIN_LIGHT = '#D4A06A';
const LOINCLOTH = '#E8D8B8';
const COTTON_WHITE = '#F0E8D0';
const COTTON_BLUE = '#3B6B8A';
const JAGUAR_SPOT = '#C8A040';
const JAGUAR_DARK = '#5C4420';
const EAGLE_WHITE = '#E8E0D0';
const EAGLE_GRAY = '#8A8A7A';
const FEATHER_GREEN = '#1A6B3A';
const FEATHER_RED = '#B02020';
const FEATHER_BLUE = '#2040A0';
const FEATHER_GOLD = '#D4A020';
const OBSIDIAN = '#2A2A3A';
const OBSIDIAN_SHINE = '#4A4A6A';
const JADE = '#3A8A5A';
const TURQUOISE = '#40B0B0';
const GOLD = '#D4A020';
const GOLD_LIGHT = '#F0C840';
const WOOD = '#7A5030';
const WOOD_DARK = '#5A3820';
const STONE = '#8A7A6A';
const ROPE = '#9B8968';
const CACAO = '#4A2A10';
const MAIZE_GREEN = '#5A8A30';
const MAIZE_GOLD = '#E8C040';
const BLOOD_RED = '#8B0000';
const INCENSE_GRAY = 'rgba(180,170,160,0.4)';
const OUTLINE = '#1A1A1A';

// ---- Types ----

export interface AztecCrowdFigureProps {
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  flip?: boolean;
}

export interface AztecCrowdLayerConfig {
  figures: Array<{
    type: AztecCrowdFigureType;
    x: number;
    y: number;
    scale?: number;
    seed?: number;
    flip?: boolean;
  }>;
}

export type AztecCrowdFigureType =
  | 'jaguarWarrior'
  | 'eagleWarrior'
  | 'aztecPriest'
  | 'sacrificePriest'
  | 'merchantTrader'
  | 'farmer'
  | 'waterCarrier'
  | 'noblewoman'
  | 'drummer'
  | 'conchPlayer'
  | 'sickPerson'
  | 'mourner'
  | 'spanishSoldier'
  | 'horseman';

// ---- Jaguar Warrior: fierce fighter in jaguar costume ----

export const JaguarWarrior: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const fightCycle = sineWave(frame, 0.2, seed);
  const armSwing = fightCycle * 8;
  const bodyLean = fightCycle * 3;
  const legStride = fightCycle * 5;
  const breathe = sineWave(frame, 0.08, seed + 1) * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={2} rx={14} ry={4} fill="rgba(0,0,0,0.18)" />
      {/* Back leg */}
      <line x1={-3} y1={-10} x2={-7 - legStride} y2={2} stroke={SKIN_DARK} strokeWidth={3.5} strokeLinecap="round" />
      {/* Shin guard */}
      <rect x={-9 - legStride} y={-2} width={4} height={5} rx={1} fill={GOLD} opacity={0.6} />
      {/* Front leg */}
      <line x1={3} y1={-10} x2={8 + legStride} y2={2} stroke={SKIN} strokeWidth={3.5} strokeLinecap="round" />
      <rect x={6 + legStride} y={-2} width={4} height={5} rx={1} fill={GOLD} opacity={0.6} />
      {/* Body (muscular, leaning) */}
      <line x1={0} y1={-10} x2={bodyLean} y2={-26 - breathe} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
      {/* Jaguar skin costume - spotted pattern on torso */}
      <rect x={-4 + bodyLean * 0.3} y={-24 - breathe} width={8} height={12} rx={2} fill={JAGUAR_SPOT} stroke={OUTLINE} strokeWidth={0.5} />
      <circle cx={-1 + bodyLean * 0.3} cy={-20 - breathe} r={1.2} fill={JAGUAR_DARK} />
      <circle cx={3 + bodyLean * 0.3} cy={-18 - breathe} r={1} fill={JAGUAR_DARK} />
      <circle cx={0 + bodyLean * 0.3} cy={-15 - breathe} r={1.2} fill={JAGUAR_DARK} />
      {/* Jaguar head helmet */}
      <g transform={`translate(${bodyLean + 1}, ${-30 - breathe})`}>
        <circle cx={0} cy={0} r={5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
        {/* Jaguar helmet top */}
        <path d="M-7,-3 Q-8,-10 -3,-12 Q0,-14 3,-12 Q8,-10 7,-3 L5,-2 L-5,-2 Z"
          fill={JAGUAR_SPOT} stroke={OUTLINE} strokeWidth={0.6} />
        {/* Jaguar ears */}
        <path d="M-6,-8 L-8,-14 L-4,-10 Z" fill={JAGUAR_SPOT} stroke={OUTLINE} strokeWidth={0.5} />
        <path d="M6,-8 L8,-14 L4,-10 Z" fill={JAGUAR_SPOT} stroke={OUTLINE} strokeWidth={0.5} />
        {/* Jaguar spots on helmet */}
        <circle cx={-4} cy={-8} r={1} fill={JAGUAR_DARK} />
        <circle cx={4} cy={-8} r={1} fill={JAGUAR_DARK} />
        {/* Jaw fangs */}
        <path d="M-4,2 L-3,5 L-1,3 L1,3 L3,5 L4,2" fill="white" stroke={OUTLINE} strokeWidth={0.4} />
      </g>
      {/* Loincloth with decorative fringe */}
      <path d="M-5,-12 L5,-12 L6,-8 L-6,-8 Z" fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      <path d="M-5,-8 L-4,-5 M-2,-8 L-1,-5 M1,-8 L2,-5 M4,-8 L5,-5" stroke={GOLD} strokeWidth={0.5} />
      {/* Shield arm (left) */}
      <line x1={bodyLean - 2} y1={-22 - breathe} x2={-10} y2={-16} stroke={SKIN_DARK} strokeWidth={2.5} strokeLinecap="round" />
      {/* Round shield with mosaic */}
      <circle cx={-14} cy={-14} r={8} fill={FEATHER_GREEN} stroke={OUTLINE} strokeWidth={1} />
      <circle cx={-14} cy={-14} r={5} fill={GOLD} stroke={OUTLINE} strokeWidth={0.5} />
      <circle cx={-14} cy={-14} r={2.5} fill={TURQUOISE} />
      {/* Feather fringe on shield */}
      {[-30, -15, 0, 15, 30].map((angle, i) => (
        <line key={`sf-${i}`}
          x1={-14 + Math.cos((angle + 180) * Math.PI / 180) * 8}
          y1={-14 + Math.sin((angle + 180) * Math.PI / 180) * 8}
          x2={-14 + Math.cos((angle + 180) * Math.PI / 180) * 12}
          y2={-14 + Math.sin((angle + 180) * Math.PI / 180) * 12}
          stroke={[FEATHER_RED, FEATHER_GREEN, FEATHER_BLUE, FEATHER_GREEN, FEATHER_RED][i]}
          strokeWidth={1.5} strokeLinecap="round" />
      ))}
      {/* Weapon arm (right) with macuahuitl (obsidian sword) */}
      <line x1={bodyLean + 2} y1={-22 - breathe} x2={14 + armSwing} y2={-18} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Macuahuitl */}
      <g transform={`translate(${14 + armSwing}, -18) rotate(${-20 + fightCycle * 15})`}>
        <rect x={-2} y={-20} width={4} height={22} rx={1} fill={WOOD} stroke={OUTLINE} strokeWidth={0.6} />
        {/* Obsidian blades on edges */}
        {[-16, -12, -8, -4].map((oy, i) => (
          <React.Fragment key={`ob-${i}`}>
            <path d={`M-2,${oy} L-5,${oy - 1.5} L-2,${oy + 2} Z`} fill={OBSIDIAN} stroke={OBSIDIAN_SHINE} strokeWidth={0.3} />
            <path d={`M2,${oy} L5,${oy - 1.5} L2,${oy + 2} Z`} fill={OBSIDIAN} stroke={OBSIDIAN_SHINE} strokeWidth={0.3} />
          </React.Fragment>
        ))}
      </g>
    </g>
  );
};

// ---- Eagle Warrior: elite fighter in eagle costume ----

export const EagleWarrior: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const marchCycle = sineWave(frame, 0.16, seed);
  const armSwing = marchCycle * 6;
  const legStride = marchCycle * 4;
  const breathe = sineWave(frame, 0.08, seed + 2) * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={13} ry={3.5} fill="rgba(0,0,0,0.16)" />
      {/* Legs */}
      <line x1={-3} y1={-10} x2={-6 - legStride} y2={2} stroke={SKIN_DARK} strokeWidth={3.5} strokeLinecap="round" />
      <line x1={3} y1={-10} x2={6 + legStride} y2={2} stroke={SKIN} strokeWidth={3.5} strokeLinecap="round" />
      {/* Sandals */}
      <rect x={-8 - legStride} y={0} width={5} height={3} rx={1} fill={WOOD} />
      <rect x={4 + legStride} y={0} width={5} height={3} rx={1} fill={WOOD} />
      {/* Body */}
      <line x1={0} y1={-10} x2={0} y2={-26 - breathe} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
      {/* Eagle feather costume on torso */}
      <rect x={-5} y={-24 - breathe} width={10} height={12} rx={2} fill={EAGLE_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Feather texture lines */}
      {[-22, -19, -16].map((fy, i) => (
        <line key={`ef-${i}`} x1={-4} y1={fy - breathe} x2={4} y2={fy - breathe}
          stroke={EAGLE_GRAY} strokeWidth={0.5} opacity={0.4} />
      ))}
      {/* Eagle head helmet */}
      <g transform={`translate(0, ${-30 - breathe})`}>
        <circle cx={0} cy={0} r={4.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
        {/* Eagle beak (open) */}
        <path d="M0,-6 L-4,-4 L-8,-8 L-3,-5 L0,-7 L3,-5 L8,-8 L4,-4 Z"
          fill={EAGLE_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
        <path d="M-8,-8 L-3,-6" stroke={GOLD} strokeWidth={0.8} />
        <path d="M8,-8 L3,-6" stroke={GOLD} strokeWidth={0.8} />
        {/* Eagle crest feathers */}
        <line x1={0} y1={-6} x2={-4} y2={-16} stroke={EAGLE_WHITE} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={0} y1={-6} x2={0} y2={-18} stroke={EAGLE_WHITE} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={0} y1={-6} x2={4} y2={-16} stroke={EAGLE_WHITE} strokeWidth={1.5} strokeLinecap="round" />
        {/* Red feather tips */}
        <circle cx={-4} cy={-16} r={1.5} fill={FEATHER_RED} />
        <circle cx={0} cy={-18} r={1.5} fill={FEATHER_RED} />
        <circle cx={4} cy={-16} r={1.5} fill={FEATHER_RED} />
      </g>
      {/* Loincloth with eagle feather fringe */}
      <path d="M-5,-12 L5,-12 L6,-7 L-6,-7 Z" fill={EAGLE_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Wing-like arm feathers */}
      <line x1={0} y1={-22 - breathe} x2={-12 - armSwing} y2={-14} stroke={SKIN_DARK} strokeWidth={2.5} strokeLinecap="round" />
      {/* Left wing feathers */}
      {[-18, -15, -12].map((fy, i) => (
        <line key={`wf-${i}`}
          x1={-10 - armSwing} y1={fy}
          x2={-16 - armSwing} y2={fy + 2}
          stroke={EAGLE_WHITE} strokeWidth={1.5} strokeLinecap="round" />
      ))}
      {/* Right arm with spear */}
      <line x1={0} y1={-22 - breathe} x2={10 + armSwing} y2={-18} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Spear */}
      <line x1={10 + armSwing} y1={-18} x2={12 + armSwing} y2={-42} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
      <path d={`M${10 + armSwing},-42 L${12 + armSwing},-50 L${14 + armSwing},-42 Z`}
        fill={OBSIDIAN} stroke={OUTLINE} strokeWidth={0.5} />
    </g>
  );
};

// ---- Aztec Priest: elaborate feathered headdress, incense ----

export const AztecPriest: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const breathe = sineWave(frame, 0.07, seed) * 0.6;
  const incenseWaft = sineWave(frame, 0.12, seed + 1) * 3;
  const armGesture = sineWave(frame, 0.09, seed + 2) * 4;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={10} ry={3} fill="rgba(0,0,0,0.14)" />
      {/* Legs (standing, robes cover them) */}
      <line x1={-3} y1={-6} x2={-4} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-6} x2={4} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Long robe */}
      <path d="M-7,-6 L-8,-26 Q-8,-28 -6,-28 L6,-28 Q8,-28 8,-26 L7,-6 Z"
        fill={COTTON_BLUE} stroke={OUTLINE} strokeWidth={0.6} />
      {/* Robe decorative border */}
      <path d="M-7,-6 L7,-6" stroke={GOLD} strokeWidth={1.2} />
      <path d="M-7,-10 L7,-10" stroke={FEATHER_RED} strokeWidth={0.6} />
      {/* Body beneath */}
      <line x1={0} y1={-6} x2={0} y2={-26 - breathe} stroke={SKIN} strokeWidth={0} />
      {/* Head */}
      <circle cx={0} cy={-31 - breathe} r={4.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Face paint - black around eyes */}
      <path d="M-3,-32 L-1,-31 M1,-31 L3,-32" stroke={OUTLINE} strokeWidth={1.2} />
      {/* Elaborate feathered headdress */}
      <g transform={`translate(0, ${-36 - breathe})`}>
        {/* Base headband */}
        <rect x={-6} y={-2} width={12} height={4} rx={1} fill={GOLD} stroke={OUTLINE} strokeWidth={0.5} />
        <rect x={-5} y={-1} width={3} height={2} rx={0.5} fill={TURQUOISE} />
        <rect x={-1} y={-1} width={3} height={2} rx={0.5} fill={JADE} />
        <rect x={3} y={-1} width={2} height={2} rx={0.5} fill={TURQUOISE} />
        {/* Tall quetzal feathers */}
        <line x1={0} y1={-2} x2={-6} y2={-20} stroke={FEATHER_GREEN} strokeWidth={2} strokeLinecap="round" />
        <line x1={0} y1={-2} x2={-3} y2={-24} stroke={FEATHER_GREEN} strokeWidth={2} strokeLinecap="round" />
        <line x1={0} y1={-2} x2={0} y2={-26} stroke={FEATHER_GREEN} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={0} y1={-2} x2={3} y2={-24} stroke={FEATHER_GREEN} strokeWidth={2} strokeLinecap="round" />
        <line x1={0} y1={-2} x2={6} y2={-20} stroke={FEATHER_GREEN} strokeWidth={2} strokeLinecap="round" />
        {/* Red accent feathers between green */}
        <line x1={0} y1={-2} x2={-4} y2={-18} stroke={FEATHER_RED} strokeWidth={1} strokeLinecap="round" />
        <line x1={0} y1={-2} x2={4} y2={-18} stroke={FEATHER_RED} strokeWidth={1} strokeLinecap="round" />
        {/* Gold feather tips */}
        <circle cx={0} cy={-26} r={1.5} fill={GOLD_LIGHT} />
        <circle cx={-3} cy={-24} r={1.2} fill={GOLD_LIGHT} />
        <circle cx={3} cy={-24} r={1.2} fill={GOLD_LIGHT} />
      </g>
      {/* Arm holding incense burner */}
      <line x1={0} y1={-22 - breathe} x2={12 + armGesture} y2={-20} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Incense clay burner */}
      <g transform={`translate(${14 + armGesture}, -20)`}>
        <path d="M-4,0 Q-5,-4 -3,-6 Q0,-8 3,-6 Q5,-4 4,0 Z" fill={STONE} stroke={OUTLINE} strokeWidth={0.6} />
        {/* Handle */}
        <line x1={-4} y1={-2} x2={-8} y2={-2} stroke={STONE} strokeWidth={1.5} strokeLinecap="round" />
        {/* Smoke wisps */}
        <path d={`M0,-6 Q${incenseWaft},-12 ${-incenseWaft},-18 Q${incenseWaft * 0.5},-24 0,-30`}
          fill="none" stroke={INCENSE_GRAY} strokeWidth={1.5} opacity={0.5} />
        <path d={`M2,-6 Q${incenseWaft + 2},-14 ${-incenseWaft + 1},-20`}
          fill="none" stroke={INCENSE_GRAY} strokeWidth={1} opacity={0.3} />
      </g>
      {/* Other arm */}
      <line x1={0} y1={-22 - breathe} x2={-8} y2={-14} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Sacrifice Priest: skull mask, ritual knife ----

export const SacrificePriest: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const breathe = sineWave(frame, 0.07, seed) * 0.5;
  const armRaise = sineWave(frame, 0.1, seed + 1) * 5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={10} ry={3} fill="rgba(0,0,0,0.15)" />
      {/* Legs */}
      <line x1={-3} y1={-6} x2={-4} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-6} x2={4} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Black robe */}
      <path d="M-7,-6 L-8,-26 Q-8,-28 -6,-28 L6,-28 Q8,-28 8,-26 L7,-6 Z"
        fill="#1A1A2A" stroke={OUTLINE} strokeWidth={0.6} />
      {/* Blood stains on robe */}
      <circle cx={-2} cy={-18} r={2} fill={BLOOD_RED} opacity={0.6} />
      <circle cx={3} cy={-14} r={1.5} fill={BLOOD_RED} opacity={0.4} />
      {/* Head */}
      <circle cx={0} cy={-31 - breathe} r={4.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Skull mask over face */}
      <g transform={`translate(0, ${-31 - breathe})`}>
        <circle cx={0} cy={0} r={4.8} fill="#E8E0D0" stroke={OUTLINE} strokeWidth={0.6} />
        {/* Skull eye sockets */}
        <circle cx={-2} cy={-1} r={1.5} fill={OUTLINE} />
        <circle cx={2} cy={-1} r={1.5} fill={OUTLINE} />
        {/* Skull nose */}
        <path d="M-0.5,1 L0.5,1 L0,2.5 Z" fill={OUTLINE} />
        {/* Skull teeth */}
        <path d="M-3,3 L-2,4 L-1,3 L0,4 L1,3 L2,4 L3,3" stroke={OUTLINE} strokeWidth={0.5} fill="none" />
      </g>
      {/* Feathered back ornament */}
      {[-3, -1, 1, 3].map((dx, i) => (
        <line key={`bp-${i}`}
          x1={dx} y1={-34 - breathe}
          x2={dx * 2} y2={-46 - breathe}
          stroke={[FEATHER_RED, FEATHER_GREEN, FEATHER_BLUE, FEATHER_RED][i]}
          strokeWidth={1.5} strokeLinecap="round" />
      ))}
      {/* Right arm raised with obsidian knife */}
      <line x1={0} y1={-22 - breathe} x2={10} y2={-28 - armRaise} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Obsidian sacrificial knife */}
      <g transform={`translate(10, ${-30 - armRaise}) rotate(-30)`}>
        <rect x={-1.5} y={-3} width={3} height={8} rx={1} fill={WOOD} stroke={OUTLINE} strokeWidth={0.4} />
        <path d="M-2,-3 L0,-12 L2,-3 Z" fill={OBSIDIAN} stroke={OBSIDIAN_SHINE} strokeWidth={0.3} />
      </g>
      {/* Left arm */}
      <line x1={0} y1={-22 - breathe} x2={-8} y2={-16} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Merchant Trader: carrying goods, colorful clothing ----

export const MerchantTrader: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const walkCycle = sineWave(frame, 0.14, seed);
  const bob = Math.abs(walkCycle) * 1.5;
  const legSwing = walkCycle * 4;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={12} ry={3} fill="rgba(0,0,0,0.13)" />
      {/* Legs walking */}
      <line x1={-2} y1={-8} x2={-5 - legSwing} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={2} y1={-8} x2={5 + legSwing} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Sandals */}
      <rect x={-7 - legSwing} y={0} width={4} height={3} rx={1} fill={WOOD} />
      <rect x={3 + legSwing} y={0} width={4} height={3} rx={1} fill={WOOD} />
      {/* Body */}
      <line x1={0} y1={-8} x2={0} y2={-24 - bob} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Colorful tilmatli (cloak) */}
      <path d={`M-6,-24 L-8,-10 L8,-10 L6,-24 Z`}
        fill={COTTON_BLUE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Decorative border on cloak */}
      <line x1={-7} y1={-12} x2={7} y2={-12} stroke={GOLD} strokeWidth={1} />
      <line x1={-7} y1={-14} x2={7} y2={-14} stroke={FEATHER_RED} strokeWidth={0.5} />
      {/* Head */}
      <circle cx={0} cy={-27 - bob} r={4} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Cotton headband */}
      <rect x={-4} y={-29 - bob} width={8} height={3} rx={1} fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.3} />
      {/* Loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Tumpline (carrying strap on forehead) */}
      <line x1={0} y1={-26 - bob} x2={0} y2={-20 - bob} stroke={ROPE} strokeWidth={1.5} />
      {/* Large trade bundle on back */}
      <g transform={`translate(-2, ${-32 - bob})`}>
        <rect x={-8} y={-4} width={12} height={14} rx={2} fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.6} />
        {/* Bundle contents showing */}
        <circle cx={-3} cy={2} r={2} fill={JADE} opacity={0.6} />
        <rect x={0} y={0} width={4} height={3} rx={0.5} fill={CACAO} />
        <line x1={-6} y1={4} x2={2} y2={4} stroke={FEATHER_GREEN} strokeWidth={1} />
      </g>
      {/* Walking staff */}
      <line x1={6} y1={-18 - bob} x2={10} y2={4} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Farmer: working with digging stick or carrying maize ----

export const Farmer: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const digCycle = sineWave(frame, 0.18, seed);
  const armDig = digCycle * 6;
  const bodyBend = digCycle * 2;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={10} ry={3} fill="rgba(0,0,0,0.12)" />
      {/* Legs */}
      <line x1={-3} y1={-8} x2={-4} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-8} x2={5} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body (bending forward when digging) */}
      <line x1={0} y1={-8} x2={bodyBend + 2} y2={-22} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Simple cotton mantle */}
      <path d={`M-4,-20 L-5,-10 L5,-10 L4,-20 Z`}
        fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} opacity={0.8} />
      {/* Head */}
      <circle cx={bodyBend + 2} cy={-25} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Simple headband */}
      <line x1={bodyBend - 1} y1={-26} x2={bodyBend + 5} y2={-26} stroke={COTTON_WHITE} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms with digging stick */}
      <line x1={bodyBend + 2} y1={-20} x2={12 + armDig} y2={-10} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Digging stick (coa) */}
      <line x1={12 + armDig} y1={-10} x2={16 + armDig} y2={4} stroke={WOOD} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M${15 + armDig},2 L${18 + armDig},6 L${14 + armDig},5 Z`} fill={WOOD_DARK} stroke={OUTLINE} strokeWidth={0.4} />
      {/* Other arm */}
      <line x1={bodyBend + 2} y1={-18} x2={-4} y2={-12} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Aztec Water Carrier: with clay jars ----

export const AztecWaterCarrier: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const walkCycle = sineWave(frame, 0.14, seed);
  const bob = Math.abs(walkCycle) * 1.5;
  const legSwing = walkCycle * 4;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={10} ry={3} fill="rgba(0,0,0,0.12)" />
      {/* Legs */}
      <line x1={-2} y1={-8} x2={-4 - legSwing} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={2} y1={-8} x2={4 + legSwing} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body */}
      <line x1={0} y1={-8} x2={0} y2={-22 - bob} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Simple garment */}
      <path d="M-4,-20 L-5,-10 L5,-10 L4,-20 Z" fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Head */}
      <circle cx={0} cy={-25 - bob} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={-2.5} y1={-26 - bob} x2={2.5} y2={-26 - bob} stroke={COTTON_WHITE} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms holding large clay jar on shoulder */}
      <line x1={0} y1={-20 - bob} x2={6} y2={-26 - bob} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={0} y1={-18 - bob} x2={-4} y2={-24 - bob} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
      {/* Large clay water jar on shoulder */}
      <g transform={`translate(2, ${-30 - bob})`}>
        <path d="M-5,2 Q-7,-2 -5,-6 Q-3,-10 0,-11 Q3,-10 5,-6 Q7,-2 5,2 Z"
          fill="#B07040" stroke={OUTLINE} strokeWidth={0.8} />
        {/* Decorative band */}
        <line x1={-5} y1={-3} x2={5} y2={-3} stroke={FEATHER_RED} strokeWidth={0.6} />
        {/* Jar mouth */}
        <ellipse cx={0} cy={-11} rx={3} ry={1.5} fill="#A06030" stroke={OUTLINE} strokeWidth={0.5} />
      </g>
    </g>
  );
};

// ---- Noblewoman: elaborate dress, jewelry ----

export const Noblewoman: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const breathe = sineWave(frame, 0.07, seed) * 0.5;
  const hairSway = sineWave(frame, 0.05, seed + 1) * 1;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={10} ry={3} fill="rgba(0,0,0,0.12)" />
      {/* Long skirt (huipil) */}
      <path d="M-8,2 L-6,-8 L6,-8 L8,2 Z" fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Embroidered border on skirt */}
      <line x1={-7} y1={0} x2={7} y2={0} stroke={FEATHER_RED} strokeWidth={1} />
      <line x1={-6} y1={-2} x2={6} y2={-2} stroke={FEATHER_BLUE} strokeWidth={0.5} />
      {/* Body */}
      <line x1={0} y1={-8} x2={0} y2={-22 - breathe} stroke={SKIN} strokeWidth={0} />
      {/* Blouse (quechquemitl) */}
      <path d="M-8,-8 L-10,-22 Q-10,-24 -8,-24 L8,-24 Q10,-24 10,-22 L8,-8 Z"
        fill={COTTON_BLUE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Embroidered V-pattern */}
      <path d="M0,-24 L-4,-16 M0,-24 L4,-16" stroke={GOLD} strokeWidth={0.8} />
      {/* Head */}
      <circle cx={0} cy={-27 - breathe} r={4} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Long black hair */}
      <path d={`M-4,-28 Q-5,-22 -6,-18 Q${-6 + hairSway},-14 -5,-10`}
        fill="none" stroke="#1A1A1A" strokeWidth={2} />
      <path d={`M4,-28 Q5,-22 6,-18 Q${6 + hairSway},-14 5,-10`}
        fill="none" stroke="#1A1A1A" strokeWidth={2} />
      {/* Hair ornament */}
      <circle cx={0} cy={-31 - breathe} r={2} fill={JADE} stroke={GOLD} strokeWidth={0.5} />
      {/* Jade earrings */}
      <circle cx={-4.5} cy={-26 - breathe} r={1.2} fill={JADE} stroke={OUTLINE} strokeWidth={0.3} />
      <circle cx={4.5} cy={-26 - breathe} r={1.2} fill={JADE} stroke={OUTLINE} strokeWidth={0.3} />
      {/* Gold necklace */}
      <path d="M-3,-24 Q0,-22 3,-24" fill="none" stroke={GOLD} strokeWidth={1} />
      <circle cx={0} cy={-22} r={1.5} fill={TURQUOISE} stroke={GOLD} strokeWidth={0.3} />
      {/* Arms at sides */}
      <line x1={0} y1={-20 - breathe} x2={-6} y2={-12} stroke={SKIN} strokeWidth={2} strokeLinecap="round" />
      <line x1={0} y1={-20 - breathe} x2={6} y2={-14} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Drummer: playing huehuetl drum ----

export const Drummer: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const drumHit = sineWave(frame, 0.3, seed);
  const leftArm = drumHit > 0 ? drumHit * 6 : 0;
  const rightArm = drumHit < 0 ? -drumHit * 6 : 0;
  const breathe = sineWave(frame, 0.08, seed + 1) * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={10} ry={3} fill="rgba(0,0,0,0.12)" />
      {/* Legs (kneeling) */}
      <path d="M-4,-2 L-7,2 L-2,2 Z" fill={SKIN} stroke={OUTLINE} strokeWidth={0.5} />
      <path d="M4,-2 L7,2 L2,2 Z" fill={SKIN_DARK} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Body */}
      <line x1={0} y1={-2} x2={0} y2={-18 - breathe} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Simple garment */}
      <path d="M-4,-16 L-5,-4 L5,-4 L4,-16 Z" fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Head */}
      <circle cx={0} cy={-21 - breathe} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={-3} y1={-22 - breathe} x2={3} y2={-22 - breathe} stroke={FEATHER_RED} strokeWidth={1.5} />
      {/* Feather in headband */}
      <line x1={2} y1={-23 - breathe} x2={4} y2={-30 - breathe} stroke={FEATHER_GREEN} strokeWidth={1} strokeLinecap="round" />
      {/* Huehuetl drum (tall cylindrical drum) */}
      <g transform="translate(10, -2)">
        <path d="M-6,-18 L-6,0 Q-6,2 -4,2 L4,2 Q6,2 6,0 L6,-18 Z"
          fill={WOOD} stroke={OUTLINE} strokeWidth={0.8} />
        {/* Drum skin on top */}
        <ellipse cx={0} cy={-18} rx={6} ry={2.5} fill="#D4C0A0" stroke={OUTLINE} strokeWidth={0.5} />
        {/* Carved decorations on drum body */}
        <circle cx={0} cy={-8} r={3} fill="none" stroke={GOLD} strokeWidth={0.5} />
        <path d="M-4,-12 L4,-12 M-4,-4 L4,-4" stroke={WOOD_DARK} strokeWidth={0.5} />
        {/* Drum vibration on hit */}
        {Math.abs(drumHit) > 0.5 && (
          <>
            <ellipse cx={0} cy={-18} rx={8} ry={3} fill="none" stroke="rgba(180,160,100,0.3)" strokeWidth={0.5} />
            <ellipse cx={0} cy={-18} rx={10} ry={3.5} fill="none" stroke="rgba(180,160,100,0.15)" strokeWidth={0.5} />
          </>
        )}
      </g>
      {/* Left arm hitting drum */}
      <line x1={0} y1={-16 - breathe} x2={8} y2={-18 - leftArm} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Right arm hitting drum */}
      <line x1={0} y1={-14 - breathe} x2={12} y2={-18 - rightArm} stroke={SKIN_DARK} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};

// ---- Conch Shell Player: blowing conch trumpet ----

export const ConchPlayer: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const breathe = sineWave(frame, 0.07, seed) * 0.5;
  const blowPulse = sineWave(frame, 0.15, seed + 1);
  const cheekPuff = blowPulse > 0.3 ? (blowPulse - 0.3) * 3 : 0;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={9} ry={2.5} fill="rgba(0,0,0,0.12)" />
      {/* Legs (standing) */}
      <line x1={-3} y1={-8} x2={-4} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-8} x2={4} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body */}
      <line x1={0} y1={-8} x2={0} y2={-22 - breathe} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Garment */}
      <path d="M-4,-20 L-5,-10 L5,-10 L4,-20 Z" fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} />
      <line x1={-4} y1={-12} x2={4} y2={-12} stroke={GOLD} strokeWidth={0.8} />
      {/* Head (cheeks puffed) */}
      <circle cx={0} cy={-25 - breathe} r={3.5 + cheekPuff * 0.3} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={-3} y1={-26 - breathe} x2={3} y2={-26 - breathe} stroke={FEATHER_RED} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms holding conch to lips */}
      <line x1={0} y1={-20 - breathe} x2={8} y2={-24 - breathe} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={0} y1={-18 - breathe} x2={6} y2={-22 - breathe} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
      {/* Conch shell */}
      <g transform={`translate(10, ${-25 - breathe}) rotate(15)`}>
        <path d="M0,0 Q4,-2 8,-1 Q12,0 14,3 Q16,8 12,10 Q8,8 4,6 Q2,4 0,0 Z"
          fill="#E0C8A0" stroke={OUTLINE} strokeWidth={0.6} />
        <path d="M2,1 Q6,0 10,2 Q12,4 10,6" fill="none" stroke="#C8A880" strokeWidth={0.5} />
        {/* Inner spiral */}
        <path d="M0,0 Q2,2 4,2 Q6,2 6,4" fill="none" stroke="#D4B090" strokeWidth={0.4} />
        {/* Sound waves */}
        {blowPulse > 0.3 && (
          <>
            <path d={`M14,3 Q18,${2 - blowPulse * 2} 22,3`} fill="none" stroke="rgba(200,180,140,0.3)" strokeWidth={1} />
            <path d={`M16,3 Q20,${1 - blowPulse * 3} 26,3`} fill="none" stroke="rgba(200,180,140,0.15)" strokeWidth={0.8} />
          </>
        )}
      </g>
    </g>
  );
};

// ---- Sick Person: lying/sitting, covered in spots ----

export const SickPerson: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const shiver = sineWave(frame, 0.25, seed) * 1;
  const breathe = sineWave(frame, 0.1, seed + 1) * 0.8;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={12} ry={3} fill="rgba(0,0,0,0.1)" />
      {/* Lying on mat */}
      <rect x={-14} y={0} width={28} height={3} rx={1} fill={WOOD} opacity={0.5} />
      {/* Body lying down */}
      <line x1={-8} y1={-2 + shiver} x2={8} y2={-2 + shiver} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
      {/* Blanket partially covering */}
      <path d={`M-6,-6 L6,-6 L8,2 L-8,2 Z`}
        fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} opacity={0.7} />
      {/* Head */}
      <circle cx={-10} cy={-4 + shiver} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Smallpox spots on face */}
      <circle cx={-11} cy={-5 + shiver} r={0.8} fill={BLOOD_RED} opacity={0.5} />
      <circle cx={-9} cy={-3 + shiver} r={0.6} fill={BLOOD_RED} opacity={0.5} />
      <circle cx={-11} cy={-2 + shiver} r={0.7} fill={BLOOD_RED} opacity={0.4} />
      <circle cx={-8} cy={-5 + shiver} r={0.5} fill={BLOOD_RED} opacity={0.4} />
      {/* Spots on body */}
      <circle cx={-2} cy={-3 + shiver} r={0.6} fill={BLOOD_RED} opacity={0.3} />
      <circle cx={2} cy={-4 + shiver} r={0.5} fill={BLOOD_RED} opacity={0.3} />
      <circle cx={5} cy={-2 + shiver} r={0.6} fill={BLOOD_RED} opacity={0.25} />
      {/* Arm weakly reaching */}
      <line x1={0} y1={-2 + shiver} x2={-2} y2={-8 + breathe} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Mourner: kneeling, grieving ----

export const Mourner: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const sob = sineWave(frame, 0.15, seed) * 2;
  const headBow = sineWave(frame, 0.08, seed + 1) * 3;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={8} ry={2.5} fill="rgba(0,0,0,0.1)" />
      {/* Kneeling legs */}
      <path d="M-4,-2 L-6,2 L-1,2 Z" fill={SKIN} stroke={OUTLINE} strokeWidth={0.5} />
      <path d="M4,-2 L6,2 L1,2 Z" fill={SKIN_DARK} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Body hunched */}
      <line x1={0} y1={-2} x2={headBow + 1} y2={-14 + sob} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Simple garment */}
      <path d="M-4,-12 L-5,-4 L5,-4 L4,-12 Z" fill={COTTON_WHITE} stroke={OUTLINE} strokeWidth={0.5} opacity={0.7} />
      {/* Head bowed */}
      <circle cx={headBow + 2} cy={-17 + sob} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Disheveled hair (sign of mourning) */}
      <path d={`M${headBow - 1},-18 Q${headBow - 3},-14 ${headBow - 4},-10`}
        fill="none" stroke="#1A1A1A" strokeWidth={1.5} />
      <path d={`M${headBow + 4},-18 Q${headBow + 5},-14 ${headBow + 6},-10`}
        fill="none" stroke="#1A1A1A" strokeWidth={1.5} />
      {/* Arms covering face or held to chest */}
      <line x1={headBow + 1} y1={-12 + sob} x2={headBow + 4} y2={-16 + sob}
        stroke={SKIN} strokeWidth={2} strokeLinecap="round" />
      <line x1={headBow + 1} y1={-11 + sob} x2={headBow - 2} y2={-15 + sob}
        stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Spanish Soldier: conquistador with armor ----

export const SpanishSoldier: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const marchCycle = sineWave(frame, 0.15, seed);
  const legSwing = marchCycle * 4;
  const armSwing = marchCycle * 5;
  const breathe = sineWave(frame, 0.08, seed + 1) * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={12} ry={3} fill="rgba(0,0,0,0.15)" />
      {/* Legs with boots */}
      <line x1={-3} y1={-10} x2={-5 - legSwing} y2={2} stroke="#4A3828" strokeWidth={3.5} strokeLinecap="round" />
      <line x1={3} y1={-10} x2={5 + legSwing} y2={2} stroke="#5A4838" strokeWidth={3.5} strokeLinecap="round" />
      {/* Boots */}
      <rect x={-7 - legSwing} y={-1} width={5} height={4} rx={1} fill="#3A2818" stroke={OUTLINE} strokeWidth={0.5} />
      <rect x={3 + legSwing} y={-1} width={5} height={4} rx={1} fill="#3A2818" stroke={OUTLINE} strokeWidth={0.5} />
      {/* Body - steel cuirass */}
      <path d="M-6,-10 L-6,-26 Q-6,-28 -4,-28 L4,-28 Q6,-28 6,-26 L6,-10 Z"
        fill="#8A8A8A" stroke={OUTLINE} strokeWidth={0.8} />
      {/* Armor shine */}
      <line x1={-3} y1={-24} x2={-3} y2={-14} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
      {/* Armor details */}
      <line x1={-5} y1={-18} x2={5} y2={-18} stroke="#6A6A6A" strokeWidth={0.5} />
      <line x1={-5} y1={-22} x2={5} y2={-22} stroke="#6A6A6A" strokeWidth={0.5} />
      {/* Morion helmet */}
      <g transform={`translate(0, ${-30 - breathe})`}>
        <circle cx={0} cy={0} r={4.5} fill="#C8A880" stroke={OUTLINE} strokeWidth={0.8} />
        {/* Helmet brim and crest */}
        <path d="M-7,1 L-5,-2 L5,-2 L7,1 Z" fill="#8A8A8A" stroke={OUTLINE} strokeWidth={0.5} />
        <path d="M-2,-4 Q0,-8 2,-4" fill="#8A8A8A" stroke={OUTLINE} strokeWidth={0.5} />
        {/* Helmet shine */}
        <line x1={-1} y1={-6} x2={1} y2={-6} stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} />
      </g>
      {/* Beard */}
      <path d={`M-3,${-28 - breathe} Q0,${-25 - breathe} 3,${-28 - breathe}`}
        fill="#5A3A1A" stroke="none" />
      {/* Sword arm */}
      <line x1={0} y1={-22 - breathe} x2={10 + armSwing} y2={-16} stroke="#C8A880" strokeWidth={2.5} strokeLinecap="round" />
      {/* Steel sword */}
      <g transform={`translate(${12 + armSwing}, -16) rotate(${-10 + marchCycle * 8})`}>
        <rect x={-1} y={-18} width={2} height={20} rx={0.5} fill="#B0B0B0" stroke={OUTLINE} strokeWidth={0.4} />
        <line x1={0} y1={-16} x2={0} y2={0} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        {/* Crossguard */}
        <rect x={-4} y={0} width={8} height={2} rx={0.5} fill={GOLD} stroke={OUTLINE} strokeWidth={0.3} />
        {/* Pommel */}
        <circle cx={0} cy={4} r={1.5} fill={GOLD} stroke={OUTLINE} strokeWidth={0.3} />
      </g>
      {/* Shield arm */}
      <line x1={0} y1={-22 - breathe} x2={-8} y2={-16} stroke="#C8A880" strokeWidth={2} strokeLinecap="round" />
      {/* Round steel shield */}
      <circle cx={-12} cy={-14} r={7} fill="#7A7A7A" stroke={OUTLINE} strokeWidth={0.8} />
      <circle cx={-12} cy={-14} r={4} fill="none" stroke="#6A6A6A" strokeWidth={0.5} />
      <circle cx={-12} cy={-14} r={2} fill={GOLD} stroke={OUTLINE} strokeWidth={0.3} />
    </g>
  );
};

// ---- Horseman: Spanish rider on horse ----

export const Horseman: React.FC<AztecCrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const gallopCycle = sineWave(frame, 0.2, seed);
  const horseBob = Math.abs(gallopCycle) * 3;
  const legKick = gallopCycle * 8;
  const tailSwish = sineWave(frame, 0.15, seed + 1) * 10;
  const riderBob = horseBob * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={4} rx={24} ry={5} fill="rgba(0,0,0,0.18)" />
      {/* Horse body */}
      <g transform={`translate(0, ${-horseBob})`}>
        {/* Horse legs */}
        <line x1={-12} y1={-4} x2={-14 - legKick} y2={4} stroke="#5A3A1A" strokeWidth={3} strokeLinecap="round" />
        <line x1={-6} y1={-4} x2={-4 + legKick} y2={4} stroke="#6A4A2A" strokeWidth={3} strokeLinecap="round" />
        <line x1={8} y1={-4} x2={6 - legKick} y2={4} stroke="#5A3A1A" strokeWidth={3} strokeLinecap="round" />
        <line x1={14} y1={-4} x2={16 + legKick} y2={4} stroke="#6A4A2A" strokeWidth={3} strokeLinecap="round" />
        {/* Horse body (barrel) */}
        <ellipse cx={0} cy={-12} rx={18} ry={10} fill="#6A4A2A" stroke={OUTLINE} strokeWidth={0.8} />
        {/* Saddle */}
        <path d="M-6,-20 Q0,-24 6,-20 L4,-18 L-4,-18 Z" fill="#3A2010" stroke={OUTLINE} strokeWidth={0.5} />
        {/* Horse neck */}
        <path d="M14,-14 Q18,-24 16,-34 Q14,-38 12,-38" fill="#6A4A2A" stroke={OUTLINE} strokeWidth={0.8} />
        {/* Horse head */}
        <g transform="translate(14, -40)">
          <ellipse cx={0} cy={0} rx={4} ry={6} fill="#6A4A2A" stroke={OUTLINE} strokeWidth={0.8} />
          {/* Muzzle */}
          <ellipse cx={2} cy={4} rx={3} ry={3} fill="#7A5A3A" stroke={OUTLINE} strokeWidth={0.5} />
          {/* Eye */}
          <circle cx={-1} cy={-2} r={1} fill={OUTLINE} />
          {/* Ear */}
          <path d="M-2,-6 L-1,-10 L1,-6" fill="#6A4A2A" stroke={OUTLINE} strokeWidth={0.5} />
          {/* Mane */}
          <path d="M-2,-4 Q-4,-8 -3,-14 Q-2,-18 0,-20" fill="none" stroke="#3A2010" strokeWidth={2} />
          {/* Bridle */}
          <line x1={-3} y1={0} x2={3} y2={2} stroke="#444" strokeWidth={0.8} />
          <line x1={3} y1={2} x2={4} y2={6} stroke="#444" strokeWidth={0.8} />
        </g>
        {/* Horse tail */}
        <path d={`M-18,-10 Q${-24 + tailSwish},-6 ${-22 + tailSwish},0`}
          fill="none" stroke="#3A2010" strokeWidth={2.5} strokeLinecap="round" />
        {/* Reins */}
        <path d="M14,-38 Q6,-30 0,-24" fill="none" stroke="#444" strokeWidth={0.8} />
      </g>
      {/* Rider on horse */}
      <g transform={`translate(0, ${-22 - horseBob - riderBob})`}>
        {/* Rider legs gripping horse */}
        <line x1={-4} y1={0} x2={-8} y2={8} stroke="#4A3828" strokeWidth={3} strokeLinecap="round" />
        <line x1={4} y1={0} x2={8} y2={8} stroke="#5A4838" strokeWidth={3} strokeLinecap="round" />
        {/* Rider body - armored */}
        <line x1={0} y1={0} x2={0} y2={-14} stroke="#8A8A8A" strokeWidth={5} strokeLinecap="round" />
        {/* Cuirass */}
        <rect x={-4} y={-12} width={8} height={10} rx={1} fill="#8A8A8A" stroke={OUTLINE} strokeWidth={0.5} />
        {/* Rider head with morion */}
        <circle cx={0} cy={-17} r={3.5} fill="#C8A880" stroke={OUTLINE} strokeWidth={0.6} />
        <path d="M-5,-16 L-3,-18 L3,-18 L5,-16" fill="#8A8A8A" stroke={OUTLINE} strokeWidth={0.4} />
        <path d="M-1,-20 Q0,-22 1,-20" fill="#8A8A8A" stroke={OUTLINE} strokeWidth={0.4} />
        {/* Lance */}
        <line x1={4} y1={-10} x2={20} y2={-36} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
        <path d="M20,-36 L19,-42 L21,-42 Z" fill="#B0B0B0" stroke={OUTLINE} strokeWidth={0.3} />
      </g>
    </g>
  );
};

// ---- Aztec Crowd Layer: renders a configuration of Aztec figures ----

export const AztecCrowdLayer: React.FC<{
  config: AztecCrowdLayerConfig;
}> = ({ config }) => {
  return (
    <g>
      {config.figures.map((fig, i) => {
        const props: AztecCrowdFigureProps = {
          x: fig.x,
          y: fig.y,
          scale: fig.scale ?? 1,
          seed: fig.seed ?? i * 7,
          flip: fig.flip ?? false,
        };

        switch (fig.type) {
          case 'jaguarWarrior':
            return <JaguarWarrior key={`aztec-${i}`} {...props} />;
          case 'eagleWarrior':
            return <EagleWarrior key={`aztec-${i}`} {...props} />;
          case 'aztecPriest':
            return <AztecPriest key={`aztec-${i}`} {...props} />;
          case 'sacrificePriest':
            return <SacrificePriest key={`aztec-${i}`} {...props} />;
          case 'merchantTrader':
            return <MerchantTrader key={`aztec-${i}`} {...props} />;
          case 'farmer':
            return <Farmer key={`aztec-${i}`} {...props} />;
          case 'waterCarrier':
            return <AztecWaterCarrier key={`aztec-${i}`} {...props} />;
          case 'noblewoman':
            return <Noblewoman key={`aztec-${i}`} {...props} />;
          case 'drummer':
            return <Drummer key={`aztec-${i}`} {...props} />;
          case 'conchPlayer':
            return <ConchPlayer key={`aztec-${i}`} {...props} />;
          case 'sickPerson':
            return <SickPerson key={`aztec-${i}`} {...props} />;
          case 'mourner':
            return <Mourner key={`aztec-${i}`} {...props} />;
          case 'spanishSoldier':
            return <SpanishSoldier key={`aztec-${i}`} {...props} />;
          case 'horseman':
            return <Horseman key={`aztec-${i}`} {...props} />;
          default:
            return null;
        }
      })}
    </g>
  );
};

// ---- Pre-built crowd configs per Aztec background ----

export const AZTEC_CROWD_CONFIGS: Record<string, AztecCrowdLayerConfig> = {
  battle: {
    figures: [
      // Aztec warriors fighting
      { type: 'jaguarWarrior', x: 400, y: 680, scale: 0.9, seed: 1 },
      { type: 'jaguarWarrior', x: 550, y: 690, scale: 0.85, seed: 2 },
      { type: 'eagleWarrior', x: 480, y: 670, scale: 0.9, seed: 3 },
      { type: 'eagleWarrior', x: 650, y: 695, scale: 0.8, seed: 4 },
      { type: 'jaguarWarrior', x: 750, y: 700, scale: 0.75, seed: 5, flip: true },
      // Spanish forces
      { type: 'spanishSoldier', x: 1100, y: 680, scale: 0.9, seed: 6, flip: true },
      { type: 'spanishSoldier', x: 1250, y: 690, scale: 0.85, seed: 7, flip: true },
      { type: 'spanishSoldier', x: 1050, y: 695, scale: 0.8, seed: 8, flip: true },
      { type: 'horseman', x: 1400, y: 670, scale: 0.75, seed: 9, flip: true },
      { type: 'horseman', x: 1550, y: 685, scale: 0.7, seed: 10, flip: true },
      // Background warriors (smaller)
      { type: 'jaguarWarrior', x: 300, y: 620, scale: 0.5, seed: 11 },
      { type: 'eagleWarrior', x: 700, y: 610, scale: 0.45, seed: 12 },
      { type: 'spanishSoldier', x: 1300, y: 615, scale: 0.5, seed: 13, flip: true },
    ],
  },
  tenochtitlan: {
    figures: [
      // City life - traders and commoners
      { type: 'merchantTrader', x: 350, y: 750, scale: 0.7, seed: 20 },
      { type: 'merchantTrader', x: 1500, y: 740, scale: 0.65, seed: 21, flip: true },
      { type: 'noblewoman', x: 500, y: 755, scale: 0.7, seed: 22 },
      { type: 'farmer', x: 250, y: 760, scale: 0.65, seed: 23 },
      { type: 'waterCarrier', x: 650, y: 745, scale: 0.7, seed: 24 },
      { type: 'aztecPriest', x: 900, y: 730, scale: 0.8, seed: 25 },
      { type: 'drummer', x: 1100, y: 750, scale: 0.65, seed: 26 },
      { type: 'jaguarWarrior', x: 1350, y: 735, scale: 0.7, seed: 27, flip: true },
      { type: 'noblewoman', x: 1600, y: 755, scale: 0.6, seed: 28, flip: true },
    ],
  },
  market: {
    figures: [
      // Bustling market scene
      { type: 'merchantTrader', x: 300, y: 720, scale: 0.8, seed: 30 },
      { type: 'merchantTrader', x: 600, y: 730, scale: 0.75, seed: 31 },
      { type: 'merchantTrader', x: 900, y: 725, scale: 0.8, seed: 32, flip: true },
      { type: 'merchantTrader', x: 1200, y: 735, scale: 0.7, seed: 33 },
      { type: 'noblewoman', x: 450, y: 740, scale: 0.7, seed: 34 },
      { type: 'noblewoman', x: 1050, y: 730, scale: 0.65, seed: 35, flip: true },
      { type: 'farmer', x: 750, y: 745, scale: 0.7, seed: 36 },
      { type: 'waterCarrier', x: 1400, y: 720, scale: 0.65, seed: 37, flip: true },
      { type: 'eagleWarrior', x: 1550, y: 710, scale: 0.7, seed: 38, flip: true },
      { type: 'drummer', x: 200, y: 750, scale: 0.6, seed: 39 },
    ],
  },
  sacrifice: {
    figures: [
      // Ceremony observers
      { type: 'aztecPriest', x: 700, y: 750, scale: 0.8, seed: 40 },
      { type: 'sacrificePriest', x: 850, y: 740, scale: 0.85, seed: 41 },
      { type: 'sacrificePriest', x: 1050, y: 745, scale: 0.8, seed: 42, flip: true },
      { type: 'drummer', x: 500, y: 760, scale: 0.7, seed: 43 },
      { type: 'conchPlayer', x: 1250, y: 755, scale: 0.7, seed: 44, flip: true },
      { type: 'jaguarWarrior', x: 350, y: 765, scale: 0.7, seed: 45 },
      { type: 'eagleWarrior', x: 1400, y: 760, scale: 0.65, seed: 46, flip: true },
      { type: 'noblewoman', x: 600, y: 770, scale: 0.6, seed: 47 },
      { type: 'noblewoman', x: 1150, y: 765, scale: 0.6, seed: 48, flip: true },
    ],
  },
  chinampas: {
    figures: [
      // Farmers working floating gardens
      { type: 'farmer', x: 400, y: 700, scale: 0.75, seed: 50 },
      { type: 'farmer', x: 700, y: 710, scale: 0.7, seed: 51 },
      { type: 'farmer', x: 1000, y: 695, scale: 0.75, seed: 52, flip: true },
      { type: 'farmer', x: 1300, y: 705, scale: 0.7, seed: 53 },
      { type: 'waterCarrier', x: 550, y: 720, scale: 0.65, seed: 54 },
      { type: 'waterCarrier', x: 1150, y: 715, scale: 0.65, seed: 55, flip: true },
      { type: 'merchantTrader', x: 850, y: 730, scale: 0.6, seed: 56 },
      { type: 'noblewoman', x: 1500, y: 725, scale: 0.55, seed: 57, flip: true },
    ],
  },
  plague: {
    figures: [
      // Devastation scene
      { type: 'sickPerson', x: 400, y: 760, scale: 0.8, seed: 60 },
      { type: 'sickPerson', x: 700, y: 770, scale: 0.75, seed: 61 },
      { type: 'sickPerson', x: 1100, y: 755, scale: 0.8, seed: 62 },
      { type: 'mourner', x: 500, y: 750, scale: 0.75, seed: 63 },
      { type: 'mourner', x: 900, y: 760, scale: 0.7, seed: 64 },
      { type: 'mourner', x: 1300, y: 765, scale: 0.7, seed: 65, flip: true },
      { type: 'aztecPriest', x: 600, y: 740, scale: 0.7, seed: 66 },
      { type: 'waterCarrier', x: 1450, y: 750, scale: 0.6, seed: 67, flip: true },
    ],
  },
};
