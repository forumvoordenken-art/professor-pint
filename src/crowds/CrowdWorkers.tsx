// Animated crowd components for background scenes
// Small, simple SVG figures performing repetitive tasks
// These create the feeling of a living, busy world

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

// ---- Shared colors ----
const SKIN = '#C4986A';
const SKIN_DARK = '#A07848';
const LOINCLOTH = '#E8D8B8';
const LOINCLOTH_ALT = '#D4B888';
const HEADBAND = '#C86040';
const HEADBAND_ALT = '#D4A040';
const STONE = '#B8906A';
const ROPE = '#9B8968';
const WOOD = '#8B5E3C';
const OUTLINE = '#1A1A1A';

// ---- Types ----

export interface CrowdFigureProps {
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  flip?: boolean;
}

export interface CrowdLayerConfig {
  figures: Array<{
    type: CrowdFigureType;
    x: number;
    y: number;
    scale?: number;
    seed?: number;
    flip?: boolean;
  }>;
}

export type CrowdFigureType =
  | 'stonePuller'
  | 'stoneCarrier'
  | 'chiselWorker'
  | 'waterCarrier'
  | 'overseer'
  | 'fanBearer'
  | 'seated'
  | 'kneeling'
  | 'rowerLeft'
  | 'rowerRight'
  | 'baker'
  | 'sweeper';

// ---- Stone Puller: bent forward, pulling rope ----

export const StonePuller: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const pullCycle = sineWave(frame, 0.18, seed);
  const bodyLean = pullCycle * 3;
  const armPull = pullCycle * 6;
  const legStride = pullCycle * 4;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={2} rx={12} ry={3} fill="rgba(0,0,0,0.15)" />
      {/* Back leg */}
      <line x1={-2} y1={-8} x2={-6 - legStride} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      {/* Front leg */}
      <line x1={2} y1={-8} x2={8 + legStride} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body (leaning forward) */}
      <line x1={0} y1={-8} x2={6 + bodyLean} y2={-22} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={8 + bodyLean} cy={-25} r={4} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Headband */}
      <line x1={5 + bodyLean} y1={-26} x2={11 + bodyLean} y2={-26} stroke={HEADBAND} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d={`M-3,-10 L3,-10 L4,-6 L-4,-6 Z`} fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms pulling rope */}
      <line x1={6 + bodyLean} y1={-20} x2={18 + armPull} y2={-16} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={6 + bodyLean} y1={-18} x2={16 + armPull} y2={-14} stroke={SKIN_DARK} strokeWidth={2.5} strokeLinecap="round" />
      {/* Rope */}
      <line x1={18 + armPull} y1={-16} x2={35} y2={-14} stroke={ROPE} strokeWidth={1.5} />
    </g>
  );
};

// ---- Stone Carrier: walking with block on shoulder ----

export const StoneCarrier: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const walkCycle = sineWave(frame, 0.15, seed);
  const bobUp = Math.abs(walkCycle) * 2;
  const legSwing = walkCycle * 5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={10} ry={3} fill="rgba(0,0,0,0.12)" />
      {/* Legs walking */}
      <line x1={-2} y1={-8} x2={-4 - legSwing} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={2} y1={-8} x2={4 + legSwing} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body */}
      <line x1={0} y1={-8} x2={0} y2={-22 - bobUp} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={0} cy={-25 - bobUp} r={4} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={-3} y1={-26 - bobUp} x2={3} y2={-26 - bobUp} stroke={HEADBAND_ALT} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms supporting stone on shoulder */}
      <line x1={0} y1={-20 - bobUp} x2={8} y2={-28 - bobUp} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={0} y1={-19 - bobUp} x2={-6} y2={-26 - bobUp} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
      {/* Stone block on shoulder */}
      <rect x={-5} y={-34 - bobUp} width={14} height={8} rx={1} fill={STONE} stroke={OUTLINE} strokeWidth={0.8} />
    </g>
  );
};

// ---- Chisel Worker: kneeling, chiseling stone ----

export const ChiselWorker: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const chiselHit = sineWave(frame, 0.3, seed);
  const armSwing = chiselHit > 0.5 ? (chiselHit - 0.5) * 8 : 0;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={8} ry={2.5} fill="rgba(0,0,0,0.12)" />
      {/* Kneeling legs */}
      <path d="M-3,-4 L-6,2 L-2,2 Z" fill={SKIN} stroke={OUTLINE} strokeWidth={0.5} />
      <path d="M3,-4 L6,2 L2,2 Z" fill={SKIN_DARK} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Body (kneeling, leaning forward) */}
      <line x1={0} y1={-4} x2={3} y2={-18} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={4} cy={-21} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={1} y1={-22} x2={7} y2={-22} stroke={HEADBAND} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-6 L3,-6 L4,-2 L-4,-2 Z" fill={LOINCLOTH_ALT} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arm with chisel */}
      <line x1={3} y1={-16} x2={12} y2={-10 - armSwing} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Chisel tool */}
      <line x1={12} y1={-10 - armSwing} x2={14} y2={-6} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
      {/* Other arm holding stone */}
      <line x1={3} y1={-15} x2={-4} y2={-10} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
      {/* Stone being worked on */}
      <rect x={8} y={-6} width={12} height={8} rx={1} fill={STONE} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Dust particles on hit */}
      {chiselHit > 0.5 && (
        <>
          <circle cx={14 + chiselHit * 3} cy={-8 - chiselHit * 4} r={1} fill={STONE} opacity={0.5} />
          <circle cx={16 + chiselHit * 2} cy={-6 - chiselHit * 3} r={0.7} fill={STONE} opacity={0.3} />
        </>
      )}
    </g>
  );
};

// ---- Water Carrier: walking with jars on yoke ----

export const WaterCarrier: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const walkCycle = sineWave(frame, 0.14, seed);
  const bob = Math.abs(walkCycle) * 1.5;
  const yokeSway = walkCycle * 2;
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
      {/* Head */}
      <circle cx={0} cy={-25 - bob} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={-2.5} y1={-26 - bob} x2={2.5} y2={-26 - bob} stroke={HEADBAND} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Yoke across shoulders */}
      <line x1={-18 + yokeSway} y1={-21 - bob} x2={18 + yokeSway} y2={-21 - bob} stroke={WOOD} strokeWidth={2.5} strokeLinecap="round" />
      {/* Arms holding yoke */}
      <line x1={0} y1={-20 - bob} x2={-8} y2={-21 - bob} stroke={SKIN} strokeWidth={2} strokeLinecap="round" />
      <line x1={0} y1={-20 - bob} x2={8} y2={-21 - bob} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
      {/* Left water jar */}
      <g transform={`translate(${-18 + yokeSway}, ${-18 - bob})`}>
        <line x1={0} y1={-3} x2={0} y2={5} stroke={ROPE} strokeWidth={1} />
        <path d="M-4,5 Q-5,10 -3,14 Q0,16 3,14 Q5,10 4,5 Z" fill="#B07040" stroke={OUTLINE} strokeWidth={0.8} />
      </g>
      {/* Right water jar */}
      <g transform={`translate(${18 + yokeSway}, ${-18 - bob})`}>
        <line x1={0} y1={-3} x2={0} y2={5} stroke={ROPE} strokeWidth={1} />
        <path d="M-4,5 Q-5,10 -3,14 Q0,16 3,14 Q5,10 4,5 Z" fill="#B07040" stroke={OUTLINE} strokeWidth={0.8} />
      </g>
    </g>
  );
};

// ---- Overseer: standing with staff, watching ----

export const Overseer: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const headTurn = sineWave(frame, 0.06, seed) * 2;
  const breathe = sineWave(frame, 0.08, seed) * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={8} ry={2.5} fill="rgba(0,0,0,0.12)" />
      {/* Legs (standing) */}
      <line x1={-3} y1={-8} x2={-4} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-8} x2={4} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body */}
      <line x1={0} y1={-8} x2={0} y2={-24 - breathe} stroke={SKIN} strokeWidth={4.5} strokeLinecap="round" />
      {/* White kilt (more elaborate than workers) */}
      <path d="M-5,-10 L5,-10 L6,-4 L-6,-4 Z" fill="white" stroke={OUTLINE} strokeWidth={0.8} />
      {/* Head */}
      <circle cx={headTurn} cy={-27 - breathe} r={4} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      {/* Headcloth */}
      <path d={`M${headTurn - 5},${-28 - breathe} Q${headTurn},${-33 - breathe} ${headTurn + 5},${-28 - breathe}
        L${headTurn + 6},${-24 - breathe} L${headTurn - 6},${-24 - breathe} Z`}
        fill="white" stroke={OUTLINE} strokeWidth={0.5} />
      {/* Staff */}
      <line x1={8} y1={-22 - breathe} x2={10} y2={4} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
      {/* Arm holding staff */}
      <line x1={0} y1={-20 - breathe} x2={8} y2={-18 - breathe} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Other arm on hip */}
      <line x1={0} y1={-18 - breathe} x2={-6} y2={-12} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Fan Bearer: waving a large fan ----

export const FanBearer: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const fanWave = sineWave(frame, 0.2, seed) * 15;
  const breathe = sineWave(frame, 0.08, seed + 1) * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={8} ry={2.5} fill="rgba(0,0,0,0.12)" />
      {/* Legs */}
      <line x1={-3} y1={-8} x2={-4} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-8} x2={4} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body */}
      <line x1={0} y1={-8} x2={0} y2={-24 - breathe} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* White loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Head */}
      <circle cx={0} cy={-27 - breathe} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={-2.5} y1={-28 - breathe} x2={2.5} y2={-28 - breathe} stroke={HEADBAND_ALT} strokeWidth={1.5} />
      {/* Arm holding fan handle */}
      <line x1={0} y1={-20 - breathe} x2={6} y2={-30 - breathe} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Fan handle */}
      <line x1={6} y1={-30 - breathe} x2={8} y2={-52 - breathe} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
      {/* Fan (large feather/palm fan) */}
      <g transform={`translate(8, ${-52 - breathe}) rotate(${fanWave})`}>
        <path d="M0,0 Q-15,-20 -8,-35 Q0,-40 8,-35 Q15,-20 0,0 Z"
          fill="#2D5016" stroke={OUTLINE} strokeWidth={0.8} opacity={0.85} />
        <path d="M0,0 Q-8,-18 -4,-30 Q0,-34 4,-30 Q8,-18 0,0 Z"
          fill="#3D7A3D" stroke={OUTLINE} strokeWidth={0.5} opacity={0.7} />
        {/* Fan ribs */}
        <line x1={0} y1={0} x2={-5} y2={-30} stroke={WOOD} strokeWidth={0.6} opacity={0.4} />
        <line x1={0} y1={0} x2={0} y2={-32} stroke={WOOD} strokeWidth={0.6} opacity={0.4} />
        <line x1={0} y1={0} x2={5} y2={-30} stroke={WOOD} strokeWidth={0.6} opacity={0.4} />
      </g>
      {/* Other arm at side */}
      <line x1={0} y1={-18 - breathe} x2={-5} y2={-12} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Seated figure: resting, eating, or watching ----

export const SeatedFigure: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const breathe = sineWave(frame, 0.07, seed) * 0.5;
  const headNod = sineWave(frame, 0.05, seed + 2) * 1.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={7} ry={2} fill="rgba(0,0,0,0.1)" />
      {/* Legs (crossed/folded) */}
      <path d="M-5,-2 Q-8,2 -3,4 Q0,2 3,4 Q8,2 5,-2 Z" fill={SKIN_DARK} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Body */}
      <line x1={0} y1={-2} x2={0} y2={-16 - breathe} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={headNod} cy={-19 - breathe} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={headNod - 2.5} y1={-20 - breathe} x2={headNod + 2.5} y2={-20 - breathe} stroke={HEADBAND} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-4 L3,-4 L4,0 L-4,0 Z" fill={LOINCLOTH_ALT} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms resting on knees */}
      <line x1={0} y1={-12 - breathe} x2={-6} y2={-4} stroke={SKIN} strokeWidth={2} strokeLinecap="round" />
      <line x1={0} y1={-12 - breathe} x2={6} y2={-4} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Kneeling Figure: praying or working low ----

export const KneelingFigure: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const bow = sineWave(frame, 0.1, seed) * 3;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={7} ry={2} fill="rgba(0,0,0,0.1)" />
      {/* Kneeling legs */}
      <path d="M-3,-2 L-5,2 L-1,2 Z" fill={SKIN} stroke={OUTLINE} strokeWidth={0.5} />
      <path d="M3,-2 L5,2 L1,2 Z" fill={SKIN_DARK} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Body leaning forward */}
      <line x1={0} y1={-2} x2={2 + bow} y2={-14} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={3 + bow} cy={-17} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={bow} y1={-18} x2={6 + bow} y2={-18} stroke={HEADBAND_ALT} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-4 L3,-4 L4,0 L-4,0 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms forward (offering/working) */}
      <line x1={2 + bow} y1={-12} x2={10 + bow} y2={-8} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={2 + bow} y1={-11} x2={9 + bow} y2={-6} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
};

// ---- Rower: sitting, rowing motion ----

export const Rower: React.FC<CrowdFigureProps & { direction?: 'left' | 'right' }> = ({
  x, y, scale = 1, seed = 0, flip = false, direction = 'right',
}) => {
  const frame = useCurrentFrame();
  const rowCycle = sineWave(frame, 0.16, seed);
  const armReach = rowCycle * 8;
  const bodyLean = rowCycle * 3;
  const fDir = flip ? -1 : 1;
  const dDir = direction === 'left' ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir * dDir}, ${scale})`}>
      {/* Seated lower body */}
      <path d="M-4,-2 L-6,2 L6,2 L4,-2 Z" fill={SKIN_DARK} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Body leaning with rowing */}
      <line x1={0} y1={-2} x2={bodyLean} y2={-16} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={bodyLean + 1} cy={-19} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={bodyLean - 2} y1={-20} x2={bodyLean + 4} y2={-20} stroke={HEADBAND} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-4 L3,-4 L4,0 L-4,0 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms rowing */}
      <line x1={bodyLean} y1={-14} x2={12 + armReach} y2={-10} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      {/* Oar */}
      <line x1={12 + armReach} y1={-10} x2={22 + armReach} y2={4} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
      {/* Oar blade */}
      <ellipse cx={23 + armReach} cy={6} rx={3} ry={5} fill={WOOD} stroke={OUTLINE} strokeWidth={0.5} transform={`rotate(${15 + rowCycle * 5}, ${23 + armReach}, 6)`} />
    </g>
  );
};

// ---- Baker: kneading or tending oven ----

export const Baker: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const kneadCycle = sineWave(frame, 0.22, seed);
  const armPush = kneadCycle * 4;
  const bodyRock = kneadCycle * 1.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={8} ry={2.5} fill="rgba(0,0,0,0.12)" />
      {/* Legs */}
      <line x1={-3} y1={-8} x2={-4} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-8} x2={4} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body leaning forward */}
      <line x1={0} y1={-8} x2={bodyRock + 2} y2={-22} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={bodyRock + 2} cy={-25} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={bodyRock - 1} y1={-26} x2={bodyRock + 5} y2={-26} stroke="white" strokeWidth={1.5} />
      {/* Loincloth + apron */}
      <path d="M-4,-10 L4,-10 L5,-4 L-5,-4 Z" fill={LOINCLOTH} stroke={OUTLINE} strokeWidth={0.5} />
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill="white" stroke={OUTLINE} strokeWidth={0.3} opacity={0.6} />
      {/* Arms kneading */}
      <line x1={bodyRock + 2} y1={-20} x2={10 + armPush} y2={-14} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={bodyRock + 2} y1={-18} x2={8 + armPush} y2={-12} stroke={SKIN_DARK} strokeWidth={2.5} strokeLinecap="round" />
      {/* Bread/dough */}
      <ellipse cx={12} cy={-10} rx={5} ry={3} fill="#E8D0A0" stroke={OUTLINE} strokeWidth={0.5} />
    </g>
  );
};

// ---- Sweeper: sweeping ground ----

export const Sweeper: React.FC<CrowdFigureProps> = ({
  x, y, scale = 1, seed = 0, flip = false,
}) => {
  const frame = useCurrentFrame();
  const sweepCycle = sineWave(frame, 0.25, seed);
  const broomSwing = sweepCycle * 10;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      <ellipse cx={0} cy={2} rx={8} ry={2.5} fill="rgba(0,0,0,0.12)" />
      {/* Legs */}
      <line x1={-2} y1={-8} x2={-3} y2={2} stroke={SKIN_DARK} strokeWidth={3} strokeLinecap="round" />
      <line x1={3} y1={-8} x2={4} y2={2} stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
      {/* Body */}
      <line x1={0} y1={-8} x2={1} y2={-22} stroke={SKIN} strokeWidth={4} strokeLinecap="round" />
      {/* Head */}
      <circle cx={1} cy={-25} r={3.5} fill={SKIN} stroke={OUTLINE} strokeWidth={0.8} />
      <line x1={-2} y1={-26} x2={4} y2={-26} stroke={HEADBAND} strokeWidth={1.5} />
      {/* Loincloth */}
      <path d="M-3,-10 L3,-10 L4,-6 L-4,-6 Z" fill={LOINCLOTH_ALT} stroke={OUTLINE} strokeWidth={0.5} />
      {/* Arms holding broom */}
      <line x1={1} y1={-20} x2={6} y2={-16} stroke={SKIN} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={1} y1={-16} x2={4} y2={-10} stroke={SKIN_DARK} strokeWidth={2} strokeLinecap="round" />
      {/* Broom handle */}
      <line x1={6} y1={-16} x2={10 + broomSwing} y2={2} stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
      {/* Broom head */}
      <path d={`M${8 + broomSwing},0 Q${10 + broomSwing},4 ${14 + broomSwing},2
        Q${12 + broomSwing},4 ${16 + broomSwing},3 L${10 + broomSwing},0 Z`}
        fill="#8B7B5A" stroke={OUTLINE} strokeWidth={0.5} />
      {/* Dust */}
      {Math.abs(sweepCycle) > 0.3 && (
        <circle cx={14 + broomSwing} cy={0} r={2} fill="rgba(180,160,100,0.3)" />
      )}
    </g>
  );
};

// ---- Sarcophagus with fan bearers (InsidePyramid special) ----

export const SarcophagusScene: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <FanBearer x={-40} y={0} scale={0.8} seed={1} />
      <FanBearer x={40} y={0} scale={0.8} seed={2} flip />
      <KneelingFigure x={-25} y={5} scale={0.7} seed={3} />
      <KneelingFigure x={25} y={5} scale={0.7} seed={4} flip />
    </g>
  );
};

// ---- Crowd Layer: renders a configuration of figures ----

export const CrowdLayer: React.FC<{
  config: CrowdLayerConfig;
}> = ({ config }) => {
  return (
    <g>
      {config.figures.map((fig, i) => {
        const props: CrowdFigureProps = {
          x: fig.x,
          y: fig.y,
          scale: fig.scale ?? 1,
          seed: fig.seed ?? i * 7,
          flip: fig.flip ?? false,
        };

        switch (fig.type) {
          case 'stonePuller':
            return <StonePuller key={`crowd-${i}`} {...props} />;
          case 'stoneCarrier':
            return <StoneCarrier key={`crowd-${i}`} {...props} />;
          case 'chiselWorker':
            return <ChiselWorker key={`crowd-${i}`} {...props} />;
          case 'waterCarrier':
            return <WaterCarrier key={`crowd-${i}`} {...props} />;
          case 'overseer':
            return <Overseer key={`crowd-${i}`} {...props} />;
          case 'fanBearer':
            return <FanBearer key={`crowd-${i}`} {...props} />;
          case 'seated':
            return <SeatedFigure key={`crowd-${i}`} {...props} />;
          case 'kneeling':
            return <KneelingFigure key={`crowd-${i}`} {...props} />;
          case 'rowerLeft':
            return <Rower key={`crowd-${i}`} {...props} direction="left" />;
          case 'rowerRight':
            return <Rower key={`crowd-${i}`} {...props} direction="right" />;
          case 'baker':
            return <Baker key={`crowd-${i}`} {...props} />;
          case 'sweeper':
            return <Sweeper key={`crowd-${i}`} {...props} />;
          default:
            return null;
        }
      })}
    </g>
  );
};

// ---- Pre-built crowd configs per background ----

export const CROWD_CONFIGS: Record<string, CrowdLayerConfig> = {
  pyramids: {
    figures: [
      // Workers near the base of the great pyramid
      { type: 'stonePuller', x: 750, y: 620, scale: 0.9, seed: 1 },
      { type: 'stonePuller', x: 790, y: 625, scale: 0.85, seed: 2 },
      { type: 'stonePuller', x: 830, y: 618, scale: 0.9, seed: 3 },
      { type: 'stoneCarrier', x: 650, y: 640, scale: 0.8, seed: 4 },
      { type: 'stoneCarrier', x: 1100, y: 635, scale: 0.75, seed: 5, flip: true },
      { type: 'overseer', x: 900, y: 615, scale: 1, seed: 6 },
      { type: 'waterCarrier', x: 500, y: 650, scale: 0.75, seed: 7 },
      { type: 'seated', x: 1200, y: 660, scale: 0.7, seed: 8 },
      { type: 'chiselWorker', x: 1050, y: 640, scale: 0.8, seed: 9 },
    ],
  },
  desertConstruction: {
    figures: [
      // Workers on the ramp pulling stones up
      { type: 'stonePuller', x: 520, y: 520, scale: 0.7, seed: 10 },
      { type: 'stonePuller', x: 550, y: 530, scale: 0.65, seed: 11 },
      { type: 'stonePuller', x: 580, y: 540, scale: 0.7, seed: 12 },
      // Workers at the base
      { type: 'stoneCarrier', x: 800, y: 640, scale: 0.85, seed: 13 },
      { type: 'stoneCarrier', x: 680, y: 650, scale: 0.8, seed: 14, flip: true },
      { type: 'chiselWorker', x: 1100, y: 636, scale: 0.8, seed: 15 },
      { type: 'chiselWorker', x: 1180, y: 642, scale: 0.75, seed: 16 },
      { type: 'waterCarrier', x: 400, y: 660, scale: 0.7, seed: 17 },
      { type: 'waterCarrier', x: 1350, y: 655, scale: 0.65, seed: 18, flip: true },
      { type: 'overseer', x: 850, y: 625, scale: 0.9, seed: 19 },
      { type: 'overseer', x: 1250, y: 650, scale: 0.8, seed: 20, flip: true },
      { type: 'seated', x: 350, y: 680, scale: 0.65, seed: 21 },
      { type: 'seated', x: 1400, y: 675, scale: 0.6, seed: 22 },
      { type: 'sweeper', x: 950, y: 660, scale: 0.7, seed: 23 },
    ],
  },
  insidePyramid: {
    figures: [
      // Fan bearers near sarcophagus
      { type: 'fanBearer', x: 550, y: 730, scale: 0.9, seed: 30 },
      { type: 'fanBearer', x: 1100, y: 730, scale: 0.9, seed: 31, flip: true },
      // Kneeling attendants
      { type: 'kneeling', x: 620, y: 760, scale: 0.8, seed: 32 },
      { type: 'kneeling', x: 1020, y: 760, scale: 0.8, seed: 33, flip: true },
      // Standing guards/priests
      { type: 'overseer', x: 420, y: 720, scale: 0.85, seed: 34 },
      { type: 'overseer', x: 1200, y: 720, scale: 0.85, seed: 35, flip: true },
    ],
  },
  nileRiver: {
    figures: [
      // Rowers on the large boat
      { type: 'rowerRight', x: -80, y: -24, scale: 0.6, seed: 40 },
      { type: 'rowerRight', x: -50, y: -24, scale: 0.6, seed: 41 },
      { type: 'rowerRight', x: -20, y: -24, scale: 0.6, seed: 42 },
      { type: 'rowerRight', x: 10, y: -24, scale: 0.6, seed: 43 },
      // People on the banks
      { type: 'waterCarrier', x: 200, y: 700, scale: 0.7, seed: 44 },
      { type: 'waterCarrier', x: 1600, y: 690, scale: 0.65, seed: 45, flip: true },
      { type: 'seated', x: 300, y: 710, scale: 0.6, seed: 46 },
      { type: 'seated', x: 1500, y: 705, scale: 0.55, seed: 47 },
      { type: 'stoneCarrier', x: 450, y: 695, scale: 0.65, seed: 48 },
      { type: 'overseer', x: 1700, y: 700, scale: 0.6, seed: 49, flip: true },
    ],
  },
  workersVillage: {
    figures: [
      // Workers around the village
      { type: 'baker', x: 600, y: 740, scale: 0.8, seed: 50 },
      { type: 'waterCarrier', x: 750, y: 730, scale: 0.75, seed: 51 },
      { type: 'sweeper', x: 900, y: 745, scale: 0.7, seed: 52 },
      { type: 'seated', x: 450, y: 760, scale: 0.7, seed: 53 },
      { type: 'seated', x: 500, y: 755, scale: 0.65, seed: 54 },
      { type: 'stoneCarrier', x: 1100, y: 735, scale: 0.7, seed: 55, flip: true },
      { type: 'chiselWorker', x: 1250, y: 750, scale: 0.7, seed: 56 },
      { type: 'overseer', x: 850, y: 720, scale: 0.8, seed: 57 },
      { type: 'kneeling', x: 350, y: 770, scale: 0.6, seed: 58 },
      { type: 'waterCarrier', x: 1400, y: 740, scale: 0.65, seed: 59, flip: true },
    ],
  },
  sphinxView: {
    figures: [
      // Tourists/workers near sphinx base
      { type: 'seated', x: 350, y: 740, scale: 0.6, seed: 60 },
      { type: 'kneeling', x: 420, y: 745, scale: 0.55, seed: 61 },
      { type: 'overseer', x: 500, y: 730, scale: 0.7, seed: 62 },
      { type: 'chiselWorker', x: 280, y: 750, scale: 0.6, seed: 63 },
      { type: 'stoneCarrier', x: 600, y: 720, scale: 0.55, seed: 64 },
      { type: 'waterCarrier', x: 200, y: 760, scale: 0.5, seed: 65 },
    ],
  },
};
