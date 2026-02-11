// AztecMarket.tsx — The bustling Tlatelolco market, largest in Mesoamerica
// Oil-painting quality: temple backdrop, colorful stalls, traders, goods
// Rich Vermeer-style warm light with dust, food smoke, vibrant textiles

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { AztecCrowdLayer, AZTEC_CROWD_CONFIGS } from '../crowds/AztecCrowd';

// ---- Color palette: 100+ named colors ----
const C = {
  // Sky
  skyTop: '#2A5A8A',
  skyMid: '#5A90B8',
  skyLow: '#8AB8D0',
  skyHorizon: '#C8D8E0',
  // Clouds
  cloudWhite: '#F0EEE8',
  cloudLight: '#E0D8C8',
  cloudMid: '#C0B8A8',
  cloudShadow: '#9A9488',
  // Sun
  sunGlow: 'rgba(255,220,140,0.2)',
  sunWarm: 'rgba(255,200,100,0.08)',
  // Temple (background)
  templeStone: '#C8B898',
  templeShadow: '#8A7A60',
  templeLight: '#E0D0B0',
  templeRed: '#A04030',
  templeBlue: '#304080',
  templeStair: '#A08A68',
  templeStairShadow: '#7A6A4A',
  // Market ground (stone pavement)
  paveDark: '#7A6A50',
  paveMid: '#9A8A68',
  paveLight: '#B0A080',
  paveJoint: '#6A5A40',
  paveWet: '#6A6048',
  // Market stalls
  stallWood: '#7A5030',
  stallWoodDark: '#5A3820',
  stallWoodLight: '#9A6840',
  stallPost: '#6A4828',
  stallRope: '#9B8968',
  // Awnings
  awningRed: '#C83020',
  awningBlue: '#2050A0',
  awningGold: '#D4A020',
  awningGreen: '#1A6A3A',
  awningWhite: '#E8E0D0',
  awningCream: '#D8C8A8',
  awningStripe: '#B04030',
  // Textiles
  textileRed: '#C02020',
  textileBlue: '#2040B0',
  textileGreen: '#1A6A2A',
  textileGold: '#D4A020',
  textilePurple: '#6A2080',
  textileWhite: '#F0E8D8',
  textileOrange: '#D06020',
  textilePink: '#D06080',
  // Goods
  cacaoBean: '#4A2A10',
  jadeGreen: '#3A8A5A',
  jadeDark: '#2A6A3A',
  turquoise: '#40B0B0',
  obsidian: '#2A2A3A',
  obsidianShine: '#4A4A6A',
  gold: '#D4A020',
  goldLight: '#F0C840',
  copper: '#B87040',
  pottery: '#B07040',
  potteryDark: '#8A5028',
  potteryRed: '#C04830',
  // Food
  maizeGold: '#E8C040',
  maizeGreen: '#5A8A30',
  tomatoRed: '#D03020',
  chiliRed: '#B82020',
  chiliGreen: '#3A6A1A',
  squashOrange: '#D08030',
  squashGreen: '#4A7A2A',
  avocadoGreen: '#3A5A1A',
  beanBrown: '#6A4A20',
  // Animals
  turkeyBrown: '#5A3A1A',
  turkeyRed: '#C03020',
  dogTan: '#B89060',
  parrotGreen: '#1A8A2A',
  parrotRed: '#D02020',
  parrotBlue: '#2040C0',
  cageWood: '#7A5A30',
  // Featherwork
  featherGreen: '#1A6B3A',
  featherRed: '#B02020',
  featherBlue: '#2040A0',
  featherGold: '#D4A020',
  quetzalGreen: '#00AA44',
  // Smoke/dust
  cookSmoke: 'rgba(140,120,90,0.25)',
  dustLight: 'rgba(160,140,100,0.2)',
  dustMid: 'rgba(120,100,70,0.15)',
  incenseGray: 'rgba(160,150,140,0.2)',
  // Atmosphere
  fogNear: 'rgba(200,190,170,0.12)',
  warmGlow: 'rgba(255,200,120,0.06)',
  vignette: 'rgba(30,20,10,0.3)',
  // Board
  boardWood: '#5A3820',
  boardSurface: '#7A5A38',
  boardText: '#E8D8C0',
  // People colors
  skin: '#B8865A',
  skinDark: '#9A6E42',
  cotton: '#E8E0D0',
  cottonBlue: '#3B6B8A',
  // Drain channel
  drainStone: '#6A5A40',
  drainWater: '#5A7A6A',
  // Outline
  outline: '#1A1A1A',
};

interface AztecMarketProps {
  boardText?: string;
  width?: number;
  height?: number;
}

// ---- Sub-component: Market Stall with awning ----
const MarketStall: React.FC<{
  x: number; y: number; w: number;
  awningColor: string; awningColor2?: string;
  hasPots?: boolean; hasTextiles?: boolean; hasFood?: boolean;
  hasFeathers?: boolean; hasJade?: boolean;
}> = ({ x, y, w, awningColor, awningColor2, hasPots, hasTextiles, hasFood, hasFeathers, hasJade }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Stall posts */}
    <line x1={0} y1={0} x2={0} y2={-50} stroke={C.stallPost} strokeWidth={3} />
    <line x1={w} y1={0} x2={w} y2={-50} stroke={C.stallPost} strokeWidth={3} />
    {/* Cross beam */}
    <line x1={-3} y1={-48} x2={w + 3} y2={-48} stroke={C.stallWood} strokeWidth={2.5} />
    {/* Awning fabric (draped) */}
    <path d={`M-5,-48 Q${w * 0.25},-42 ${w * 0.5},-46 Q${w * 0.75},-42 ${w + 5},-48
      L${w + 8},-38 Q${w * 0.75},-34 ${w * 0.5},-38 Q${w * 0.25},-34 -8,-38 Z`}
      fill={awningColor} stroke={C.outline} strokeWidth={0.5} opacity={0.85} />
    {/* Awning stripe pattern */}
    {awningColor2 && (
      <path d={`M${w * 0.2},-46 Q${w * 0.35},-40 ${w * 0.5},-44 Q${w * 0.65},-40 ${w * 0.8},-46`}
        fill="none" stroke={awningColor2} strokeWidth={2} opacity={0.4} />
    )}
    {/* Awning shadow on goods */}
    <rect x={-2} y={-38} width={w + 4} height={5}
      fill="rgba(0,0,0,0.08)" />
    {/* Counter/table */}
    <rect x={-3} y={-8} width={w + 6} height={8}
      fill={C.stallWood} stroke={C.stallWoodDark} strokeWidth={0.8} />
    <rect x={-2} y={-10} width={w + 4} height={3}
      fill={C.stallWoodLight} stroke={C.stallWoodDark} strokeWidth={0.5} />
    {/* Counter front panel detail */}
    <rect x={2} y={-6} width={w - 4} height={4} rx={1}
      fill={C.stallWoodDark} opacity={0.3} />
    {/* Goods on counter */}
    {hasPots && (
      <g>
        {Array.from({ length: Math.floor(w / 14) }, (_, i) => (
          <g key={`pot-${i}`} transform={`translate(${6 + i * 14}, -10)`}>
            <path d={`M-4,0 Q-5,-4 -4,-8 Q-2,-10 0,-10 Q2,-10 4,-8 Q5,-4 4,0 Z`}
              fill={i % 2 === 0 ? C.pottery : C.potteryRed} stroke={C.outline} strokeWidth={0.4} />
            <ellipse cx={0} cy={-10} rx={3} ry={1.5} fill={C.potteryDark} stroke={C.outline} strokeWidth={0.3} />
            <line x1={-3} y1={-6} x2={3} y2={-6} stroke={C.gold} strokeWidth={0.4} opacity={0.4} />
          </g>
        ))}
      </g>
    )}
    {hasTextiles && (
      <g>
        {Array.from({ length: Math.floor(w / 10) }, (_, i) => {
          const tColors = [C.textileRed, C.textileBlue, C.textileGreen, C.textileGold, C.textilePurple];
          return (
            <rect key={`tex-${i}`}
              x={3 + i * 10} y={-18} width={7} height={8} rx={0.5}
              fill={tColors[i % 5]} stroke={C.outline} strokeWidth={0.3} opacity={0.7} />
          );
        })}
        {/* Hanging textiles from beam */}
        {Array.from({ length: 3 }, (_, i) => {
          const hColors = [C.textileOrange, C.textileBlue, C.textilePink];
          return (
            <rect key={`htex-${i}`}
              x={w * 0.2 + i * w * 0.25} y={-45}
              width={8} height={20}
              fill={hColors[i]} stroke={C.outline} strokeWidth={0.3} opacity={0.5} />
          );
        })}
      </g>
    )}
    {hasFood && (
      <g>
        {/* Piles of food on counter */}
        {/* Maize/corn ears */}
        {Array.from({ length: 3 }, (_, i) => (
          <g key={`corn-${i}`} transform={`translate(${4 + i * 8}, -12) rotate(${-10 + i * 10})`}>
            <ellipse cx={0} cy={0} rx={2} ry={5} fill={C.maizeGold} stroke={C.outline} strokeWidth={0.3} />
            <line x1={0} y1={5} x2={0} y2={8} stroke={C.maizeGreen} strokeWidth={1} />
          </g>
        ))}
        {/* Tomato pile */}
        <g transform={`translate(${w * 0.4}, -12)`}>
          <circle cx={0} cy={0} r={3} fill={C.tomatoRed} opacity={0.7} />
          <circle cx={3} cy={1} r={2.5} fill={C.tomatoRed} opacity={0.6} />
          <circle cx={-2} cy={2} r={2} fill={C.tomatoRed} opacity={0.65} />
        </g>
        {/* Chili peppers */}
        <g transform={`translate(${w * 0.6}, -12)`}>
          {Array.from({ length: 4 }, (_, i) => (
            <path key={`chili-${i}`}
              d={`M${i * 5 - 8},0 Q${i * 5 - 6},-4 ${i * 5 - 4},0`}
              fill={i % 2 === 0 ? C.chiliRed : C.chiliGreen} stroke={C.outline} strokeWidth={0.2} />
          ))}
        </g>
        {/* Squash */}
        <ellipse cx={w * 0.85} cy={-12} rx={4} ry={3}
          fill={C.squashOrange} stroke={C.outline} strokeWidth={0.3} opacity={0.6} />
      </g>
    )}
    {hasFeathers && (
      <g>
        {/* Feather fans displayed */}
        {Array.from({ length: 4 }, (_, i) => {
          const fColors = [C.quetzalGreen, C.featherRed, C.featherBlue, C.featherGold];
          return (
            <g key={`fan-${i}`} transform={`translate(${8 + i * w * 0.22}, -12)`}>
              {[-20, -10, 0, 10, 20].map((angle, j) => (
                <line key={`ff-${j}`}
                  x1={0} y1={0}
                  x2={Math.sin(angle * Math.PI / 180) * 10}
                  y2={-Math.cos(angle * Math.PI / 180) * 10}
                  stroke={fColors[(i + j) % 4]} strokeWidth={1.2} strokeLinecap="round" />
              ))}
              <circle cx={0} cy={0} r={1.5} fill={C.gold} />
            </g>
          );
        })}
        {/* Hanging feather headdress */}
        <g transform={`translate(${w * 0.5}, -46)`}>
          <rect x={-3} y={0} width={6} height={3} rx={1} fill={C.gold} />
          {[-3, -1, 1, 3].map((dx, i) => (
            <line key={`hf-${i}`} x1={dx} y1={0} x2={dx * 2} y2={-10}
              stroke={[C.quetzalGreen, C.featherRed, C.quetzalGreen, C.featherBlue][i]}
              strokeWidth={1.5} strokeLinecap="round" />
          ))}
        </g>
      </g>
    )}
    {hasJade && (
      <g>
        {/* Jade and turquoise pieces laid out */}
        {Array.from({ length: Math.floor(w / 8) }, (_, i) => {
          const isJade = i % 3 !== 0;
          return (
            <g key={`gem-${i}`} transform={`translate(${4 + i * 8}, -12)`}>
              {isJade ? (
                <circle cx={0} cy={0} r={2.5}
                  fill={i % 2 === 0 ? C.jadeGreen : C.jadeDark}
                  stroke={C.outline} strokeWidth={0.3} opacity={0.7} />
              ) : (
                <rect x={-2} y={-2} width={4} height={4} rx={0.5}
                  fill={C.turquoise} stroke={C.outline} strokeWidth={0.3} opacity={0.6} />
              )}
            </g>
          );
        })}
        {/* Gold pieces */}
        <circle cx={w * 0.3} cy={-14} r={3} fill={C.gold} opacity={0.5} stroke={C.outline} strokeWidth={0.3} />
        <circle cx={w * 0.7} cy={-14} r={2.5} fill={C.goldLight} opacity={0.5} stroke={C.outline} strokeWidth={0.3} />
        {/* Obsidian mirror */}
        <ellipse cx={w * 0.5} cy={-15} rx={4} ry={3}
          fill={C.obsidian} stroke={C.obsidianShine} strokeWidth={0.5} opacity={0.6} />
      </g>
    )}
  </g>
);

// ---- Sub-component: Caged birds ----
const BirdCage: React.FC<{
  x: number; y: number; birdColor: string; flutter: number;
}> = ({ x, y, birdColor, flutter }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Cage frame */}
    <rect x={-8} y={-18} width={16} height={18} rx={1}
      fill="none" stroke={C.cageWood} strokeWidth={1} />
    {/* Cage bars */}
    {Array.from({ length: 5 }, (_, i) => (
      <line key={`bar-${i}`} x1={-6 + i * 3} y1={-18} x2={-6 + i * 3} y2={0}
        stroke={C.cageWood} strokeWidth={0.5} />
    ))}
    {/* Top dome */}
    <path d="M-8,-18 Q0,-24 8,-18" fill="none" stroke={C.cageWood} strokeWidth={1} />
    {/* Bird inside */}
    <g transform={`translate(0, ${-10 + flutter * 1.5})`}>
      <ellipse cx={0} cy={0} rx={3} ry={2} fill={birdColor} opacity={0.6} />
      <circle cx={-2} cy={-1.5} r={1.5} fill={birdColor} opacity={0.7} />
      <line x1={-3.5} y1={-1.5} x2={-5} y2={-1} stroke={C.maizeGold} strokeWidth={0.5} />
      <circle cx={-2.5} cy={-2} r={0.4} fill={C.outline} />
      {/* Wing */}
      <path d={`M1,0 Q${3 + flutter * 2},${-2 - flutter} ${2 + flutter},${1}`}
        fill={birdColor} opacity={0.5} />
    </g>
  </g>
);

// ---- Sub-component: Ground goods display (on mat) ----
const GroundDisplay: React.FC<{
  x: number; y: number; type: 'cacao' | 'obsidian' | 'feathers' | 'cotton';
}> = ({ x, y, type }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Woven mat */}
    <rect x={-15} y={-2} width={30} height={4} rx={1}
      fill={C.stallRope} stroke={C.stallWoodDark} strokeWidth={0.4} opacity={0.5} />
    {/* Mat weave pattern */}
    {Array.from({ length: 6 }, (_, i) => (
      <line key={`weave-${i}`} x1={-13 + i * 5} y1={-1} x2={-13 + i * 5} y2={1}
        stroke={C.stallWoodDark} strokeWidth={0.3} opacity={0.2} />
    ))}
    {type === 'cacao' && (
      <g>
        {/* Pile of cacao beans */}
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={`bean-${i}`}
            cx={-10 + (i % 4) * 6 + (i > 7 ? 2 : 0)}
            cy={-4 - Math.floor(i / 4) * 3}
            rx={2} ry={1.2}
            fill={C.cacaoBean} stroke={C.outline} strokeWidth={0.2}
            opacity={0.6} transform={`rotate(${(i * 20) % 60 - 30})`} />
        ))}
      </g>
    )}
    {type === 'obsidian' && (
      <g>
        {/* Obsidian blades laid out */}
        {Array.from({ length: 5 }, (_, i) => (
          <g key={`blade-${i}`} transform={`translate(${-10 + i * 6}, -4) rotate(${-5 + i * 3})`}>
            <path d="M-1,0 L0,-8 L1,0 Z" fill={C.obsidian} stroke={C.obsidianShine} strokeWidth={0.3} />
          </g>
        ))}
        {/* Obsidian mirror */}
        <circle cx={8} cy={-6} r={3} fill={C.obsidian} stroke={C.obsidianShine} strokeWidth={0.5} opacity={0.5} />
      </g>
    )}
    {type === 'feathers' && (
      <g>
        {/* Bundles of feathers */}
        {Array.from({ length: 6 }, (_, i) => {
          const fc = [C.quetzalGreen, C.featherRed, C.featherBlue, C.featherGold, C.quetzalGreen, C.featherRed];
          return (
            <line key={`f-${i}`}
              x1={-10 + i * 5} y1={-2}
              x2={-10 + i * 5 + 1} y2={-10 - (i % 3) * 2}
              stroke={fc[i]} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
          );
        })}
      </g>
    )}
    {type === 'cotton' && (
      <g>
        {/* Folded cotton mantles */}
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={`cotton-${i}`}
            x={-12 + i * 7} y={-6} width={6} height={4} rx={0.5}
            fill={[C.cotton, C.cottonBlue, C.awningCream, C.textileWhite][i]}
            stroke={C.outline} strokeWidth={0.3} opacity={0.5} />
        ))}
      </g>
    )}
  </g>
);

// ---- Sub-component: Turkey ----
const Turkey: React.FC<{
  x: number; y: number; peck: number; flip?: boolean;
}> = ({ x, y, peck, flip = false }) => (
  <g transform={`translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`}>
    {/* Body */}
    <ellipse cx={0} cy={0} rx={6} ry={4} fill={C.turkeyBrown} stroke={C.outline} strokeWidth={0.4} />
    {/* Tail feathers (fanned) */}
    {[-15, -8, 0, 8, 15].map((angle, i) => (
      <line key={`tf-${i}`}
        x1={5} y1={-1}
        x2={5 + Math.cos((angle + 90) * Math.PI / 180) * 8}
        y2={-1 + Math.sin((angle + 90) * Math.PI / 180) * 8}
        stroke={i % 2 === 0 ? C.turkeyBrown : '#3A2A0A'}
        strokeWidth={1.5} strokeLinecap="round" />
    ))}
    {/* Neck */}
    <path d={`M-4,-2 Q-6,${-6 - peck} -5,${-10 - peck * 2}`}
      fill="none" stroke={C.turkeyBrown} strokeWidth={2} strokeLinecap="round" />
    {/* Head */}
    <circle cx={-5} cy={-11 - peck * 2} r={2} fill={C.turkeyBrown} stroke={C.outline} strokeWidth={0.3} />
    {/* Wattle (red) */}
    <path d={`M-5,${-10 - peck * 2} L-4,${-8 - peck * 2} L-6,${-8 - peck * 2} Z`}
      fill={C.turkeyRed} opacity={0.6} />
    {/* Eye */}
    <circle cx={-6} cy={-11.5 - peck * 2} r={0.5} fill={C.outline} />
    {/* Beak */}
    <line x1={-7} y1={-11 - peck * 2} x2={-9} y2={-10.5 - peck * 2}
      stroke={C.maizeGold} strokeWidth={0.8} />
    {/* Legs */}
    <line x1={-2} y1={3} x2={-3} y2={6} stroke={C.maizeGold} strokeWidth={0.8} />
    <line x1={2} y1={3} x2={3} y2={6} stroke={C.maizeGold} strokeWidth={0.8} />
  </g>
);

// ---- Sub-component: Drainage channel ----
const DrainChannel: React.FC<{
  x1: number; y1: number; x2: number; y2: number; width: number;
}> = ({ x1: cx1, y1: cy1, x2: cx2, y2: cy2, width: w }) => (
  <g>
    <line x1={cx1} y1={cy1} x2={cx2} y2={cy2}
      stroke={C.drainStone} strokeWidth={w + 2} />
    <line x1={cx1} y1={cy1} x2={cx2} y2={cy2}
      stroke={C.drainWater} strokeWidth={w} opacity={0.4} />
    {/* Drain edges */}
    <line x1={cx1} y1={cy1 - w / 2 - 1} x2={cx2} y2={cy2 - w / 2 - 1}
      stroke={C.drainStone} strokeWidth={1} opacity={0.4} />
    <line x1={cx1} y1={cy1 + w / 2 + 1} x2={cx2} y2={cy2 + w / 2 + 1}
      stroke={C.drainStone} strokeWidth={1} opacity={0.4} />
  </g>
);

// ---- Main Component ----
export const AztecMarket: React.FC<AztecMarketProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Animations
  const cloudDrift1 = sineWave(frame, 0.015) * 15;
  const cloudDrift2 = sineWave(frame, 0.02, 1.5) * 12;
  const smokeDrift1 = sineWave(frame, 0.035, 0.5) * 6;
  const smokeDrift2 = sineWave(frame, 0.04, 2) * 8;
  const smokeDrift3 = sineWave(frame, 0.03, 3.5) * 5;
  const awningFlap1 = sineWave(frame, 0.08) * 2;
  const awningFlap2 = sineWave(frame, 0.09, 1) * 1.5;
  const dustFloat = sineWave(frame, 0.025) * 10;
  const birdFlutter1 = sineWave(frame, 0.2) * 1;
  const birdFlutter2 = sineWave(frame, 0.22, 1) * 1;
  const turkeyPeck = Math.max(0, sineWave(frame, 0.12));
  const flagSway = sineWave(frame, 0.1) * 3;
  const godRayPulse = sineWave(frame, 0.025) * 0.02 + 0.05;
  const fireFlicker = sineWave(frame, 0.15) * 0.5 + 0.5;
  const mistFloat = sineWave(frame, 0.02) * 8;
  const flyingBirdWing = sineWave(frame, 0.08) * 5;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient */}
        <linearGradient id="am-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="40%" stopColor={C.skyMid} />
          <stop offset="75%" stopColor={C.skyLow} />
          <stop offset="100%" stopColor={C.skyHorizon} />
        </linearGradient>

        {/* Ground gradient - stone pavement */}
        <linearGradient id="am-ground" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.paveMid} />
          <stop offset="50%" stopColor={C.paveDark} />
          <stop offset="100%" stopColor={C.paveDark} />
        </linearGradient>

        {/* Sun warmth */}
        <radialGradient id="am-sunglow" cx="60%" cy="15%" r="45%">
          <stop offset="0%" stopColor={C.sunGlow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Vignette */}
        <radialGradient id="am-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="75%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={C.vignette} />
        </radialGradient>

        {/* Stone pavement pattern */}
        <pattern id="am-pave" x="0" y="0" width="30" height="20" patternUnits="userSpaceOnUse">
          <rect width="30" height="20" fill={C.paveMid} />
          <rect x="0" y="0" width="14" height="9" fill={C.paveLight} opacity={0.3} rx={0.5} />
          <rect x="16" y="0" width="14" height="9" fill={C.paveMid} rx={0.5} />
          <rect x="8" y="11" width="14" height="9" fill={C.paveLight} opacity={0.25} rx={0.5} />
          <line x1="0" y1="10" x2="30" y2="10" stroke={C.paveJoint} strokeWidth={0.5} opacity={0.3} />
          <line x1="15" y1="0" x2="15" y2="10" stroke={C.paveJoint} strokeWidth={0.5} opacity={0.25} />
          <line x1="8" y1="10" x2="8" y2="20" stroke={C.paveJoint} strokeWidth={0.5} opacity={0.25} />
          <line x1="22" y1="10" x2="22" y2="20" stroke={C.paveJoint} strokeWidth={0.5} opacity={0.25} />
        </pattern>

        {/* God ray */}
        <linearGradient id="am-godray" x1="60%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,220,140,0.1)" />
          <stop offset="50%" stopColor="rgba(255,200,100,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Canvas texture */}
        <pattern id="am-canvas" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="rgba(0,0,0,0)" />
          <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(0,0,0,0.008)" strokeWidth={0.3} />
          <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(0,0,0,0.006)" strokeWidth={0.3} />
          <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.008)" strokeWidth={0.3} />
        </pattern>

        {/* Dust particle pattern */}
        <pattern id="am-dust" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="12" r="0.4" fill={C.dustLight} opacity={0.06} />
          <circle cx="28" cy="5" r="0.3" fill={C.dustLight} opacity={0.04} />
          <circle cx="42" cy="32" r="0.5" fill={C.dustMid} opacity={0.05} />
          <circle cx="18" cy="42" r="0.3" fill={C.dustLight} opacity={0.04} />
          <circle cx="38" cy="18" r="0.4" fill={C.dustMid} opacity={0.05} />
          <circle cx="5" cy="36" r="0.3" fill={C.dustLight} opacity={0.03} />
        </pattern>

        {/* Ground shadow gradient */}
        <linearGradient id="am-ground-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.05)" />
          <stop offset="50%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
        </linearGradient>

        {/* Warm ambient light for market */}
        <radialGradient id="am-ambient" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="rgba(255,200,120,0.06)" />
          <stop offset="70%" stopColor="rgba(255,180,80,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Textile stripe pattern */}
        <pattern id="am-textile-stripe" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={C.textileRed} />
          <rect x="0" y="0" width="6" height="2" fill={C.textileGold} opacity={0.5} />
          <rect x="0" y="4" width="6" height="2" fill={C.textileBlue} opacity={0.3} />
        </pattern>

        {/* Food grill smoke filter */}
        <filter id="am-smoke-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* ============================================================ */}
      {/* LAYER 1: SKY */}
      {/* ============================================================ */}

      <rect x={0} y={0} width={width} height={height * 0.35} fill="url(#am-sky)" />
      <rect x={0} y={0} width={width} height={height * 0.4} fill="url(#am-sunglow)" />

      {/* Clouds */}
      <g opacity={0.5}>
        <ellipse cx={250 + cloudDrift1} cy={60} rx={200} ry={30}
          fill={C.cloudMid} />
        <ellipse cx={270 + cloudDrift1} cy={55} rx={140} ry={20}
          fill={C.cloudLight} opacity={0.6} />
        <ellipse cx={700 + cloudDrift2} cy={80} rx={250} ry={35}
          fill={C.cloudMid} />
        <ellipse cx={720 + cloudDrift2} cy={75} rx={170} ry={22}
          fill={C.cloudWhite} opacity={0.5} />
        <ellipse cx={1300 + cloudDrift1 * 0.7} cy={50} rx={220} ry={28}
          fill={C.cloudMid} />
        <ellipse cx={1320 + cloudDrift1 * 0.7} cy={45} rx={150} ry={18}
          fill={C.cloudLight} opacity={0.55} />
        <ellipse cx={1650 + cloudDrift2 * 0.5} cy={70} rx={180} ry={25}
          fill={C.cloudShadow} />
      </g>

      {/* God rays */}
      <g opacity={godRayPulse}>
        <polygon points={`${width * 0.55},0 ${width * 0.48},${height * 0.45} ${width * 0.52},${height * 0.45}`}
          fill="url(#am-godray)" />
        <polygon points={`${width * 0.65},0 ${width * 0.6},${height * 0.4} ${width * 0.64},${height * 0.4}`}
          fill="url(#am-godray)" />
      </g>

      {/* Flying birds in sky */}
      {Array.from({ length: 5 }, (_, i) => {
        const bx = width * 0.2 + i * width * 0.15;
        const by = height * 0.08 + (i % 3) * 15 + sineWave(frame, 0.04, i) * 4;
        return (
          <g key={`skybird-${i}`} transform={`translate(${bx}, ${by})`}>
            <path d={`M0,0 Q-${4 + flyingBirdWing * (i % 2 === 0 ? 1 : -1)},${-2} -${8},${flyingBirdWing * 0.2}`}
              fill="none" stroke={C.outline} strokeWidth={0.8} opacity={0.3} />
            <path d={`M0,0 Q${4 + flyingBirdWing * (i % 2 === 0 ? 1 : -1)},${-2} ${8},${flyingBirdWing * 0.2}`}
              fill="none" stroke={C.outline} strokeWidth={0.8} opacity={0.3} />
          </g>
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 2: TEMPLE PYRAMID (background) */}
      {/* ============================================================ */}

      {/* Stepped pyramid behind market */}
      <g transform={`translate(${width * 0.5}, ${height * 0.35})`}>
        {/* Pyramid steps */}
        {Array.from({ length: 6 }, (_, i) => {
          const sw = 320 - i * 40;
          const sh = 20;
          const sy = -i * sh;
          return (
            <g key={`pstep-${i}`}>
              <rect x={-sw / 2} y={sy - sh} width={sw} height={sh}
                fill={i % 2 === 0 ? C.templeStone : C.templeLight}
                stroke={C.templeShadow} strokeWidth={0.5} />
              <rect x={-sw / 2} y={sy - 2} width={sw} height={2}
                fill={C.templeStairShadow} opacity={0.25} />
              {/* Stone block lines */}
              {Array.from({ length: Math.floor(sw / 20) }, (_, j) => (
                <line key={`bl-${j}`}
                  x1={-sw / 2 + 8 + j * 20} y1={sy - sh + 2}
                  x2={-sw / 2 + 8 + j * 20} y2={sy - 2}
                  stroke={C.templeShadow} strokeWidth={0.3} opacity={0.12} />
              ))}
            </g>
          );
        })}
        {/* Central staircase */}
        <rect x={-20} y={-120} width={40} height={120}
          fill={C.templeStair} stroke={C.templeStairShadow} strokeWidth={0.5} />
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`stl-${i}`}
            x1={-20} y1={-120 + i * (120 / 18)}
            x2={20} y2={-120 + i * (120 / 18)}
            stroke={C.templeStairShadow} strokeWidth={0.3} opacity={0.3} />
        ))}
        {/* Twin temples at top */}
        <rect x={-50} y={-145} width={40} height={25}
          fill={C.templeBlue} stroke={C.outline} strokeWidth={0.5} />
        <path d="M-52,-145 L-30,-162 L-8,-145 Z"
          fill={C.templeBlue} stroke={C.outline} strokeWidth={0.5} />
        <rect x={10} y={-145} width={40} height={25}
          fill={C.templeRed} stroke={C.outline} strokeWidth={0.5} />
        <path d="M8,-145 L30,-162 L52,-145 Z"
          fill={C.templeRed} stroke={C.outline} strokeWidth={0.5} />
        {/* Temple fires */}
        <g opacity={0.6 + fireFlicker * 0.3}>
          <ellipse cx={-30} cy={-155} rx={6 + fireFlicker * 3} ry={4}
            fill={C.warmGlow} opacity={0.5} />
          <path d={`M-32,-150 Q-33,${-158 - fireFlicker * 6} -30,${-164 - fireFlicker * 8}
            Q-27,${-158 - fireFlicker * 6} -28,-150`}
            fill="#E08030" opacity={0.5} />
          <ellipse cx={30} cy={-155} rx={6 + fireFlicker * 3} ry={4}
            fill={C.warmGlow} opacity={0.5} />
          <path d={`M28,-150 Q27,${-158 - fireFlicker * 6} 30,${-164 - fireFlicker * 8}
            Q33,${-158 - fireFlicker * 6} 32,-150`}
            fill="#E08030" opacity={0.5} />
        </g>
        {/* Smoke from temple fires */}
        <path d={`M-30,-164 Q${-32 + smokeDrift1},-180 ${-28 + smokeDrift1 * 2},-200`}
          fill="none" stroke={C.cookSmoke} strokeWidth={8} strokeLinecap="round" opacity={0.3} />
        <path d={`M30,-164 Q${32 + smokeDrift2},-180 ${28 + smokeDrift2 * 2},-200`}
          fill="none" stroke={C.cookSmoke} strokeWidth={8} strokeLinecap="round" opacity={0.3} />
      </g>

      {/* Temple decorative elements */}
      <g transform={`translate(${width * 0.5}, ${height * 0.35})`}>
        {/* Stone serpent heads at base of stairs */}
        <g transform="translate(-25, 0)">
          <circle cx={0} cy={-3} r={4} fill={C.templeStone} stroke={C.outline} strokeWidth={0.5} />
          <path d="M-4,-3 L-8,-2 L-4,-1" fill={C.templeStone} stroke={C.outline} strokeWidth={0.4} />
          <circle cx={-1} cy={-4} r={1} fill={C.outline} opacity={0.5} />
        </g>
        <g transform="translate(25, 0) scale(-1,1)">
          <circle cx={0} cy={-3} r={4} fill={C.templeStone} stroke={C.outline} strokeWidth={0.5} />
          <path d="M-4,-3 L-8,-2 L-4,-1" fill={C.templeStone} stroke={C.outline} strokeWidth={0.4} />
          <circle cx={-1} cy={-4} r={1} fill={C.outline} opacity={0.5} />
        </g>
        {/* Stone eagle sculpture at base */}
        <g transform="translate(60, -5)">
          <path d="M-6,0 Q-4,-6 0,-8 Q4,-6 6,0 Z"
            fill={C.templeStone} stroke={C.outline} strokeWidth={0.4} />
          <path d="M0,-8 L-4,-12 M0,-8 L4,-12"
            fill="none" stroke={C.templeStone} strokeWidth={1} strokeLinecap="round" />
        </g>
        {/* Skull rack (tzompantli) near temple */}
        <g transform="translate(-80, -10)">
          <rect x={0} y={-12} width={24} height={12}
            fill={C.stallWoodDark} stroke={C.outline} strokeWidth={0.4} />
          {Array.from({ length: 3 }, (_, row) => (
            Array.from({ length: 5 }, (_, col) => (
              <circle key={`tsk-${row}-${col}`}
                cx={3 + col * 5} cy={-3 - row * 4} r={1.5}
                fill="#E0D8C8" stroke={C.outline} strokeWidth={0.2} opacity={0.4} />
            ))
          ))}
        </g>
        {/* Incense braziers at temple base */}
        {[-50, 50].map((bx, i) => (
          <g key={`brazier-${i}`} transform={`translate(${bx}, -2)`}>
            <path d="M-4,0 Q-5,-3 -3,-6 Q0,-8 3,-6 Q5,-3 4,0 Z"
              fill={C.potteryDark} stroke={C.outline} strokeWidth={0.4} />
            <path d={`M0,-6 Q${smokeDrift1 * 0.5},-12 ${smokeDrift1},-20`}
              fill="none" stroke={C.incenseGray} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
          </g>
        ))}
        {/* Banners on temple */}
        {[-100, -40, 40, 100].map((bx, i) => (
          <g key={`tbanner-${i}`} transform={`translate(${bx}, -20)`}>
            <line x1={0} y1={0} x2={0} y2={-15} stroke={C.stallPost} strokeWidth={1} />
            <path d={`M0,-15 Q${3 + flagSway * 0.5},-13 ${5 + flagSway},-11 L${3 + flagSway * 0.5},-9 L0,-11 Z`}
              fill={[C.awningRed, C.awningGold, C.awningBlue, C.awningGreen][i]} opacity={0.5} />
          </g>
        ))}
      </g>

      {/* More background buildings with variety */}
      {Array.from({ length: 6 }, (_, i) => {
        const bx = width * 0.02 + i * (width * 0.16);
        const bh = 25 + (i * 11) % 15;
        const bw = 35 + (i % 3) * 8;
        return (
          <g key={`bgbld-${i}`}>
            <rect x={bx} y={height * 0.35 - bh} width={bw} height={bh}
              fill={i % 2 === 0 ? C.templeLight : C.templeStone}
              stroke={C.templeShadow} strokeWidth={0.3} opacity={0.5} />
            {/* Flat roof detail */}
            <rect x={bx - 1} y={height * 0.35 - bh - 2} width={bw + 2} height={2.5}
              fill={C.templeStairShadow} opacity={0.3} />
            {/* Door */}
            <rect x={bx + bw * 0.35} y={height * 0.35 - bh * 0.4}
              width={bw * 0.2} height={bh * 0.4}
              fill={C.outline} opacity={0.2} />
            {/* Shadow side */}
            <rect x={bx + bw * 0.75} y={height * 0.35 - bh}
              width={bw * 0.25} height={bh}
              fill={C.templeShadow} opacity={0.1} />
          </g>
        );
      })}

      {/* Side buildings flanking temple */}
      {Array.from({ length: 8 }, (_, i) => {
        const bx = width * 0.08 + i * (width * 0.11);
        const bh = 20 + (i * 7) % 20;
        return (
          <rect key={`sidebld-${i}`}
            x={bx} y={height * 0.35 - bh} width={30 + (i % 3) * 10} height={bh}
            fill={i % 3 === 0 ? C.templeLight : C.templeStone}
            stroke={C.templeShadow} strokeWidth={0.3} opacity={0.5} />
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 3: MARKET GROUND */}
      {/* ============================================================ */}

      {/* Main ground plane */}
      <rect x={0} y={height * 0.35} width={width} height={height * 0.65}
        fill="url(#am-ground)" />

      {/* Stone pavement texture */}
      <rect x={0} y={height * 0.35} width={width} height={height * 0.65}
        fill="url(#am-pave)" opacity={0.6} />

      {/* Drainage channels */}
      <DrainChannel x1={0} y1={height * 0.55} x2={width} y2={height * 0.55} width={4} />
      <DrainChannel x1={width * 0.3} y1={height * 0.35} x2={width * 0.3} y2={height} width={3} />
      <DrainChannel x1={width * 0.7} y1={height * 0.35} x2={width * 0.7} y2={height} width={3} />

      {/* Wet spots on pavement */}
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={`wet-${i}`}
          cx={120 + (i * 243) % (width - 240)}
          cy={height * 0.5 + (i * 67) % (height * 0.3)}
          rx={15 + (i % 3) * 5} ry={6 + (i % 2) * 3}
          fill={C.paveWet} opacity={0.1} />
      ))}

      {/* ============================================================ */}
      {/* LAYER 4: MARKET STALLS (back row) */}
      {/* ============================================================ */}

      {/* Back row stalls (closer to temple) */}
      <MarketStall x={width * 0.05} y={height * 0.45} w={100}
        awningColor={C.awningRed} awningColor2={C.awningGold}
        hasPots={true} />
      <MarketStall x={width * 0.15} y={height * 0.44} w={90}
        awningColor={C.awningBlue}
        hasTextiles={true} />
      <MarketStall x={width * 0.26} y={height * 0.45} w={100}
        awningColor={C.awningGreen} awningColor2={C.awningWhite}
        hasFood={true} />
      <MarketStall x={width * 0.58} y={height * 0.44} w={95}
        awningColor={C.awningGold} awningColor2={C.awningRed}
        hasFeathers={true} />
      <MarketStall x={width * 0.68} y={height * 0.45} w={100}
        awningColor={C.awningRed}
        hasJade={true} />
      <MarketStall x={width * 0.8} y={height * 0.44} w={90}
        awningColor={C.awningBlue} awningColor2={C.awningWhite}
        hasPots={true} />

      {/* ============================================================ */}
      {/* LAYER 5: GROUND GOODS AND ANIMALS (middle area) */}
      {/* ============================================================ */}

      {/* Ground displays between stall rows */}
      <GroundDisplay x={width * 0.12} y={height * 0.58} type="cacao" />
      <GroundDisplay x={width * 0.28} y={height * 0.56} type="obsidian" />
      <GroundDisplay x={width * 0.44} y={height * 0.57} type="feathers" />
      <GroundDisplay x={width * 0.6} y={height * 0.58} type="cotton" />
      <GroundDisplay x={width * 0.76} y={height * 0.56} type="cacao" />
      <GroundDisplay x={width * 0.9} y={height * 0.57} type="obsidian" />

      {/* Bird cages */}
      <BirdCage x={width * 0.36} y={height * 0.55} birdColor={C.parrotGreen} flutter={birdFlutter1} />
      <BirdCage x={width * 0.52} y={height * 0.54} birdColor={C.parrotRed} flutter={birdFlutter2} />
      <BirdCage x={width * 0.84} y={height * 0.55} birdColor={C.parrotBlue} flutter={birdFlutter1} />

      {/* Turkeys */}
      <Turkey x={width * 0.2} y={height * 0.6} peck={turkeyPeck} />
      <Turkey x={width * 0.48} y={height * 0.62} peck={turkeyPeck * 0.8} flip={true} />
      <Turkey x={width * 0.72} y={height * 0.6} peck={turkeyPeck * 1.1} />

      {/* Dog (xoloitzcuintli - hairless) */}
      <g transform={`translate(${width * 0.65}, ${height * 0.63})`}>
        <ellipse cx={0} cy={0} rx={6} ry={3.5} fill={C.dogTan} stroke={C.outline} strokeWidth={0.3} />
        <circle cx={-5} cy={-3} r={2.5} fill={C.dogTan} stroke={C.outline} strokeWidth={0.3} />
        <path d="M-6,-5 L-7,-8 L-5,-6" fill={C.dogTan} stroke={C.outline} strokeWidth={0.2} />
        <path d="M-4,-5 L-3,-8 L-2,-6" fill={C.dogTan} stroke={C.outline} strokeWidth={0.2} />
        <circle cx={-6.5} cy={-3.5} r={0.5} fill={C.outline} />
        <line x1={-7.5} y1={-2.5} x2={-8.5} y2={-2.5} stroke={C.outline} strokeWidth={0.4} />
        <line x1={-3} y1={3} x2={-4} y2={6} stroke={C.dogTan} strokeWidth={1} />
        <line x1={3} y1={3} x2={4} y2={6} stroke={C.dogTan} strokeWidth={1} />
        <path d="M6,0 Q8,-1 10,0" fill="none" stroke={C.dogTan} strokeWidth={0.8} />
      </g>

      {/* ============================================================ */}
      {/* LAYER 6: FRONT ROW STALLS (closer to viewer) */}
      {/* ============================================================ */}

      <MarketStall x={width * 0.02} y={height * 0.7} w={110}
        awningColor={C.awningGold} awningColor2={C.awningGreen}
        hasFood={true} />
      <MarketStall x={width * 0.18} y={height * 0.69} w={100}
        awningColor={C.awningRed}
        hasTextiles={true} />
      <MarketStall x={width * 0.35} y={height * 0.7} w={115}
        awningColor={C.awningWhite} awningColor2={C.awningBlue}
        hasJade={true} />
      <MarketStall x={width * 0.55} y={height * 0.69} w={105}
        awningColor={C.awningGreen}
        hasFood={true} />
      <MarketStall x={width * 0.72} y={height * 0.7} w={110}
        awningColor={C.awningBlue} awningColor2={C.awningGold}
        hasFeathers={true} />
      <MarketStall x={width * 0.88} y={height * 0.69} w={100}
        awningColor={C.awningRed} awningColor2={C.awningWhite}
        hasPots={true} />

      {/* ============================================================ */}
      {/* LAYER 7: CROWD FIGURES */}
      {/* ============================================================ */}

      <AztecCrowdLayer config={AZTEC_CROWD_CONFIGS.market} />

      {/* Additional small market-goers (hand-drawn) */}
      {Array.from({ length: 12 }, (_, i) => {
        const px = 80 + (i * 163) % (width - 160);
        const py = height * 0.55 + (i * 43) % (height * 0.2);
        return (
          <g key={`shopper-${i}`} transform={`translate(${px}, ${py})`}>
            <ellipse cx={0} cy={2} rx={5} ry={1.5} fill="rgba(0,0,0,0.08)" />
            <line x1={0} y1={0} x2={0} y2={-8} stroke={C.skin} strokeWidth={2} strokeLinecap="round" />
            <circle cx={0} cy={-10} r={2} fill={C.skin} stroke={C.outline} strokeWidth={0.3} />
            <rect x={-2.5} y={-7} width={5} height={5} rx={0.5}
              fill={[C.cotton, C.cottonBlue, C.awningCream, C.textileWhite][i % 4]}
              stroke={C.outline} strokeWidth={0.2} opacity={0.6} />
          </g>
        );
      })}

      {/* ============================================================ */}
      {/* LAYER 8: COOKING SMOKE AND DUST */}
      {/* ============================================================ */}

      {/* Food cooking smoke from stalls */}
      <g opacity={0.3}>
        <path d={`M${width * 0.1},${height * 0.42}
          Q${width * 0.08 + smokeDrift1 * 2},${height * 0.36} ${width * 0.06 + smokeDrift1 * 4},${height * 0.28}`}
          fill="none" stroke={C.cookSmoke} strokeWidth={12} strokeLinecap="round" />
        <path d={`M${width * 0.3},${height * 0.43}
          Q${width * 0.28 + smokeDrift2 * 1.5},${height * 0.37} ${width * 0.26 + smokeDrift2 * 3},${height * 0.3}`}
          fill="none" stroke={C.cookSmoke} strokeWidth={10} strokeLinecap="round" />
        <path d={`M${width * 0.6},${height * 0.42}
          Q${width * 0.58 + smokeDrift3 * 2},${height * 0.36} ${width * 0.56 + smokeDrift3 * 3},${height * 0.29}`}
          fill="none" stroke={C.cookSmoke} strokeWidth={11} strokeLinecap="round" />
        <path d={`M${width * 0.85},${height * 0.43}
          Q${width * 0.83 + smokeDrift1 * 1.5},${height * 0.37} ${width * 0.81 + smokeDrift1 * 3},${height * 0.3}`}
          fill="none" stroke={C.cookSmoke} strokeWidth={9} strokeLinecap="round" />
      </g>

      {/* Dust in air (kicked up by crowd) */}
      <ellipse cx={width * 0.25 + dustFloat} cy={height * 0.6}
        rx={120} ry={20} fill={C.dustLight} opacity={0.2} />
      <ellipse cx={width * 0.6 - dustFloat * 0.5} cy={height * 0.58}
        rx={100} ry={18} fill={C.dustMid} opacity={0.15} />
      <ellipse cx={width * 0.85 + dustFloat * 0.7} cy={height * 0.62}
        rx={90} ry={16} fill={C.dustLight} opacity={0.18} />

      {/* Food smoke from front row */}
      <g opacity={0.25}>
        <path d={`M${width * 0.08},${height * 0.66}
          Q${width * 0.06 + smokeDrift2 * 1.5},${height * 0.6} ${width * 0.04 + smokeDrift2 * 2.5},${height * 0.52}`}
          fill="none" stroke={C.cookSmoke} strokeWidth={10} strokeLinecap="round" />
        <path d={`M${width * 0.58},${height * 0.65}
          Q${width * 0.56 + smokeDrift1 * 1.5},${height * 0.59} ${width * 0.54 + smokeDrift1 * 2.5},${height * 0.52}`}
          fill="none" stroke={C.cookSmoke} strokeWidth={8} strokeLinecap="round" />
      </g>

      {/* Incense smoke wisps */}
      <g opacity={0.15}>
        <path d={`M${width * 0.45},${height * 0.5}
          Q${width * 0.44 + smokeDrift3},${height * 0.44} ${width * 0.43 + smokeDrift3 * 2},${height * 0.38}`}
          fill="none" stroke={C.incenseGray} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* ============================================================ */}
      {/* LAYER 8B: ADDITIONAL MARKET ELEMENTS */}
      {/* ============================================================ */}

      {/* Large pottery display (between stall rows) */}
      <g transform={`translate(${width * 0.4}, ${height * 0.62})`}>
        {/* Large olla (water jar) */}
        <path d="M-10,0 Q-14,-8 -12,-16 Q-8,-22 0,-24 Q8,-22 12,-16 Q14,-8 10,0 Z"
          fill={C.pottery} stroke={C.outline} strokeWidth={0.6} />
        <ellipse cx={0} cy={-24} rx={6} ry={3} fill={C.potteryDark} stroke={C.outline} strokeWidth={0.4} />
        {/* Decorative bands */}
        <line x1={-12} y1={-12} x2={12} y2={-12} stroke={C.potteryRed} strokeWidth={1} opacity={0.5} />
        <line x1={-11} y1={-8} x2={11} y2={-8} stroke={C.gold} strokeWidth={0.6} opacity={0.4} />
        {/* Painted motif (step fret) */}
        <path d="M-6,-14 L-4,-14 L-4,-16 L-2,-16 L-2,-14 L0,-14 L0,-16 L2,-16 L2,-14 L4,-14"
          fill="none" stroke={C.potteryRed} strokeWidth={0.5} opacity={0.4} />
        {/* Smaller pots nearby */}
        <g transform="translate(18, 2)">
          <path d="M-4,0 Q-5,-3 -4,-6 Q-2,-8 0,-8 Q2,-8 4,-6 Q5,-3 4,0 Z"
            fill={C.potteryRed} stroke={C.outline} strokeWidth={0.4} />
          <ellipse cx={0} cy={-8} rx={2.5} ry={1.2} fill={C.potteryDark} stroke={C.outline} strokeWidth={0.3} />
        </g>
        <g transform="translate(-16, 3)">
          <path d="M-3,0 Q-4,-2 -3,-5 Q-1,-6 0,-6 Q1,-6 3,-5 Q4,-2 3,0 Z"
            fill={C.pottery} stroke={C.outline} strokeWidth={0.3} />
          <ellipse cx={0} cy={-6} rx={2} ry={1} fill={C.potteryDark} stroke={C.outline} strokeWidth={0.2} />
        </g>
      </g>

      {/* Basket displays on ground */}
      {[
        { x: width * 0.15, y: height * 0.63 },
        { x: width * 0.5, y: height * 0.61 },
        { x: width * 0.82, y: height * 0.62 },
      ].map((basket, i) => (
        <g key={`basket-${i}`} transform={`translate(${basket.x}, ${basket.y})`}>
          {/* Woven basket */}
          <path d="M-8,0 Q-10,-4 -8,-8 L8,-8 Q10,-4 8,0 Z"
            fill={C.stallRope} stroke={C.stallWoodDark} strokeWidth={0.5} />
          {/* Weave pattern */}
          {Array.from({ length: 4 }, (_, j) => (
            <line key={`bw-${j}`} x1={-7 + j * 4} y1={-7} x2={-7 + j * 4} y2={-1}
              stroke={C.stallWoodDark} strokeWidth={0.3} opacity={0.3} />
          ))}
          {/* Contents */}
          {i === 0 && (
            // Avocados
            <g>
              {Array.from({ length: 5 }, (_, j) => (
                <ellipse key={`avo-${j}`}
                  cx={-5 + j * 3} cy={-10 - (j % 2)}
                  rx={2} ry={2.5}
                  fill={C.avocadoGreen} stroke={C.outline} strokeWidth={0.2} opacity={0.5} />
              ))}
            </g>
          )}
          {i === 1 && (
            // Beans
            <g>
              {Array.from({ length: 8 }, (_, j) => (
                <ellipse key={`bean-${j}`}
                  cx={-5 + (j % 4) * 3} cy={-10 - Math.floor(j / 4) * 2}
                  rx={1.5} ry={1}
                  fill={C.beanBrown} opacity={0.4} />
              ))}
            </g>
          )}
          {i === 2 && (
            // Squash
            <g>
              {Array.from({ length: 3 }, (_, j) => (
                <ellipse key={`sq-${j}`}
                  cx={-4 + j * 4} cy={-10}
                  rx={3} ry={2.5}
                  fill={j % 2 === 0 ? C.squashOrange : C.squashGreen}
                  stroke={C.outline} strokeWidth={0.2} opacity={0.5} />
              ))}
            </g>
          )}
        </g>
      ))}

      {/* Cotton bale stacks (textile section) */}
      <g transform={`translate(${width * 0.22}, ${height * 0.58})`}>
        {Array.from({ length: 3 }, (_, row) => (
          Array.from({ length: 4 - row }, (_, col) => (
            <rect key={`bale-${row}-${col}`}
              x={col * 12 + row * 6 - 20} y={-row * 8 - 4}
              width={10} height={7} rx={1}
              fill={[C.cotton, C.cottonBlue, C.awningCream, C.textileWhite][(row + col) % 4]}
              stroke={C.outline} strokeWidth={0.3} opacity={0.5} />
          ))
        ))}
      </g>

      {/* Live animal area - more turkeys, dogs */}
      <g transform={`translate(${width * 0.38}, ${height * 0.64})`}>
        {/* Wooden pen */}
        <rect x={-20} y={-3} width={40} height={6} rx={1}
          fill="none" stroke={C.stallWoodDark} strokeWidth={1} opacity={0.3} />
        {/* Turkey inside */}
        <Turkey x={-8} y={0} peck={turkeyPeck * 0.7} />
        <Turkey x={8} y={0} peck={turkeyPeck * 1.2} flip={true} />
      </g>

      {/* Hanging dried herbs and chilis from stall beams */}
      {[width * 0.08, width * 0.32, width * 0.62, width * 0.86].map((hx, i) => (
        <g key={`hang-${i}`} transform={`translate(${hx}, ${height * 0.42})`}>
          {/* String of chilis */}
          <line x1={0} y1={0} x2={0} y2={15} stroke={C.stallRope} strokeWidth={0.5} />
          {Array.from({ length: 5 }, (_, j) => (
            <path key={`hc-${j}`}
              d={`M${-1 + (j % 2) * 2},${3 + j * 3} Q${-2 + (j % 2) * 4},${5 + j * 3} ${-1 + (j % 2) * 2},${6 + j * 3}`}
              fill={j % 2 === 0 ? C.chiliRed : C.chiliGreen} opacity={0.5} />
          ))}
        </g>
      ))}

      {/* Flower garlands at stalls */}
      {[width * 0.12, width * 0.42, width * 0.75].map((fx, i) => (
        <g key={`garland-${i}`}>
          <path d={`M${fx},${height * 0.4} Q${fx + 30},${height * 0.42 + awningFlap1} ${fx + 60},${height * 0.4}`}
            fill="none" stroke={C.maizeGreen} strokeWidth={1.5} opacity={0.3} />
          {Array.from({ length: 5 }, (_, j) => (
            <circle key={`gf-${j}`}
              cx={fx + 5 + j * 12} cy={height * 0.405 + (j % 2) * 2 + awningFlap1 * 0.5}
              r={2} fill={j % 2 === 0 ? C.maizeGold : C.tomatoRed} opacity={0.3} />
          ))}
        </g>
      ))}

      {/* Merchant with scale (weighing goods) */}
      <g transform={`translate(${width * 0.55}, ${height * 0.58})`}>
        {/* Figure */}
        <ellipse cx={0} cy={3} rx={6} ry={2} fill="rgba(0,0,0,0.1)" />
        <line x1={0} y1={0} x2={0} y2={-14} stroke={C.skin} strokeWidth={3} strokeLinecap="round" />
        <circle cx={0} cy={-17} r={3} fill={C.skin} stroke={C.outline} strokeWidth={0.4} />
        <rect x={-3} y={-12} width={6} height={8} rx={1}
          fill={C.cottonBlue} stroke={C.outline} strokeWidth={0.3} />
        {/* Arms holding balance scale */}
        <line x1={0} y1={-10} x2={-10} y2={-12} stroke={C.skinDark} strokeWidth={2} strokeLinecap="round" />
        <line x1={0} y1={-10} x2={10} y2={-12} stroke={C.skin} strokeWidth={2} strokeLinecap="round" />
        {/* Balance beam */}
        <line x1={-12} y1={-12} x2={12} y2={-12} stroke={C.stallWoodDark} strokeWidth={1} />
        {/* Scale pans */}
        <path d="M-14,-12 L-16,-8 L-8,-8 L-10,-12" fill="none" stroke={C.copper} strokeWidth={0.5} />
        <path d="M10,-12 L8,-8 L16,-8 L14,-12" fill="none" stroke={C.copper} strokeWidth={0.5} />
        {/* Goods on pans */}
        <circle cx={-12} cy={-9} r={1.5} fill={C.cacaoBean} opacity={0.5} />
        <circle cx={12} cy={-9} r={1.5} fill={C.jadeGreen} opacity={0.5} />
      </g>

      {/* Water seller with clay jars */}
      <g transform={`translate(${width * 0.92}, ${height * 0.6})`}>
        <ellipse cx={0} cy={3} rx={8} ry={2} fill="rgba(0,0,0,0.08)" />
        <line x1={0} y1={0} x2={0} y2={-12} stroke={C.skin} strokeWidth={3} strokeLinecap="round" />
        <circle cx={0} cy={-15} r={2.5} fill={C.skin} stroke={C.outline} strokeWidth={0.4} />
        <rect x={-3} y={-10} width={6} height={7} rx={1} fill={C.cotton} stroke={C.outline} strokeWidth={0.3} />
        {/* Yoke with jars */}
        <line x1={-14} y1={-10} x2={14} y2={-10} stroke={C.stallWood} strokeWidth={1.5} />
        <g transform="translate(-12, -6)">
          <path d="M-3,0 Q-4,-3 -3,-6 Q0,-8 3,-6 Q4,-3 3,0 Z"
            fill={C.pottery} stroke={C.outline} strokeWidth={0.3} />
        </g>
        <g transform="translate(12, -6)">
          <path d="M-3,0 Q-4,-3 -3,-6 Q0,-8 3,-6 Q4,-3 3,0 Z"
            fill={C.pottery} stroke={C.outline} strokeWidth={0.3} />
        </g>
      </g>

      {/* Slave market area marker (wooden posts with rope) */}
      <g transform={`translate(${width * 0.88}, ${height * 0.55})`} opacity={0.3}>
        <line x1={0} y1={0} x2={0} y2={-30} stroke={C.stallPost} strokeWidth={3} />
        <line x1={30} y1={0} x2={30} y2={-30} stroke={C.stallPost} strokeWidth={3} />
        <path d="M0,-25 Q15,-22 30,-25" fill="none" stroke={C.stallRope} strokeWidth={1.5} />
        <path d="M0,-20 Q15,-17 30,-20" fill="none" stroke={C.stallRope} strokeWidth={1.5} />
      </g>

      {/* Obsidian workshop (craftsman knapping) */}
      <g transform={`translate(${width * 0.68}, ${height * 0.58})`}>
        <ellipse cx={0} cy={3} rx={8} ry={2.5} fill="rgba(0,0,0,0.08)" />
        {/* Seated figure */}
        <path d="M-3,0 L-5,3 L5,3 L3,0 Z" fill={C.skin} stroke={C.outline} strokeWidth={0.3} />
        <line x1={0} y1={0} x2={0} y2={-10} stroke={C.skin} strokeWidth={3} strokeLinecap="round" />
        <circle cx={0} cy={-13} r={2.5} fill={C.skin} stroke={C.outline} strokeWidth={0.4} />
        <rect x={-3} y={-9} width={6} height={6} rx={1} fill={C.cotton} stroke={C.outline} strokeWidth={0.2} />
        {/* Working hands with obsidian */}
        <line x1={0} y1={-6} x2={6} y2={-4} stroke={C.skinDark} strokeWidth={1.5} strokeLinecap="round" />
        <path d="M5,-5 L7,-10 L9,-5 Z" fill={C.obsidian} stroke={C.obsidianShine} strokeWidth={0.3} />
        {/* Obsidian shards on ground */}
        {Array.from({ length: 5 }, (_, i) => (
          <path key={`shard-${i}`}
            d={`M${-6 + i * 4},2 L${-5 + i * 4},-1 L${-4 + i * 4},2 Z`}
            fill={C.obsidian} opacity={0.3} />
        ))}
      </g>

      {/* ============================================================ */}
      {/* LAYER 9: FOREGROUND DETAILS */}
      {/* ============================================================ */}

      {/* Spilled goods on ground */}
      {Array.from({ length: 8 }, (_, i) => {
        const sx = 100 + (i * 239) % (width - 200);
        const sy = height * 0.72 + (i * 31) % (height * 0.1);
        return i % 2 === 0 ? (
          <ellipse key={`spill-${i}`} cx={sx} cy={sy} rx={2} ry={1.2}
            fill={C.cacaoBean} opacity={0.2} />
        ) : (
          <circle key={`spill-${i}`} cx={sx} cy={sy} r={1.5}
            fill={C.tomatoRed} opacity={0.15} />
        );
      })}

      {/* Footprints / worn pavement areas */}
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={`foot-${i}`}
          cx={200 + (i * 287) % (width - 400)}
          cy={height * 0.65 + (i * 53) % (height * 0.15)}
          rx={20} ry={8}
          fill={C.paveDark} opacity={0.06} />
      ))}

      {/* Shadows from awnings on ground */}
      {[0.05, 0.18, 0.35, 0.55, 0.72, 0.88].map((sx, i) => (
        <rect key={`awshad-${i}`}
          x={width * sx} y={height * 0.7}
          width={i % 2 === 0 ? 110 : 100} height={30}
          fill="rgba(0,0,0,0.06)" />
      ))}

      {/* Scattered flower petals (marigold/cempasúchil) */}
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={`petal-${i}`}
          cx={60 + (i * 197) % (width - 120)}
          cy={height * 0.6 + (i * 41) % (height * 0.2)}
          r={1.2}
          fill={i % 3 === 0 ? C.maizeGold : i % 3 === 1 ? C.tomatoRed : C.featherGold}
          opacity={0.2} />
      ))}

      {/* Foreground large pottery (broken and whole) */}
      <g transform={`translate(${width * 0.05}, ${height * 0.88})`}>
        <path d="M-12,0 Q-16,-8 -14,-18 Q-8,-24 0,-24 Q8,-24 14,-18 Q16,-8 12,0 Z"
          fill={C.pottery} stroke={C.outline} strokeWidth={0.6} />
        <ellipse cx={0} cy={-24} rx={8} ry={3} fill={C.potteryDark} stroke={C.outline} strokeWidth={0.4} />
        <line x1={-12} y1={-12} x2={12} y2={-12} stroke={C.potteryRed} strokeWidth={1.2} opacity={0.4} />
        <path d="M-8,-15 L-6,-15 L-6,-17 L-4,-17 L-4,-15 L-2,-15"
          fill="none" stroke={C.potteryRed} strokeWidth={0.5} opacity={0.3} />
      </g>
      <g transform={`translate(${width * 0.95}, ${height * 0.9})`}>
        {/* Broken pot shard */}
        <path d="M-8,0 Q-10,-5 -6,-10 Q-2,-8 2,-10 L4,-4 L2,0 Z"
          fill={C.pottery} stroke={C.outline} strokeWidth={0.4} opacity={0.5} />
        <path d="M6,-2 Q8,-6 4,-8 L6,-4 Z"
          fill={C.potteryDark} opacity={0.3} />
      </g>

      {/* Foreground cacao sack (spilling beans) */}
      <g transform={`translate(${width * 0.15}, ${height * 0.9})`}>
        <path d="M-10,0 Q-12,-8 -8,-14 L8,-14 Q12,-8 10,0 Z"
          fill={C.cotton} stroke={C.stallWoodDark} strokeWidth={0.5} opacity={0.5} />
        <line x1={-4} y1={-14} x2={-2} y2={-18} stroke={C.stallRope} strokeWidth={1} />
        <line x1={4} y1={-14} x2={2} y2={-18} stroke={C.stallRope} strokeWidth={1} />
        {/* Spilled beans */}
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={`sb-${i}`}
            cx={12 + i * 3 + (i % 2) * 2} cy={-2 + (i % 3) * 2}
            rx={1.5} ry={1} fill={C.cacaoBean} opacity={0.4}
            transform={`rotate(${(i * 25) % 60}, ${12 + i * 3}, 0)`} />
        ))}
      </g>

      {/* Large feather headdress on display stand (foreground) */}
      <g transform={`translate(${width * 0.78}, ${height * 0.85})`}>
        {/* Display stand */}
        <line x1={0} y1={0} x2={0} y2={-30} stroke={C.stallPost} strokeWidth={2} />
        <rect x={-8} y={0} width={16} height={3} rx={1} fill={C.stallWood} />
        {/* Headdress base */}
        <rect x={-6} y={-32} width={12} height={4} rx={1} fill={C.gold} stroke={C.outline} strokeWidth={0.4} />
        <rect x={-5} y={-31} width={3} height={2} rx={0.5} fill={C.turquoise} />
        <rect x={-1} y={-31} width={3} height={2} rx={0.5} fill={C.jadeGreen} />
        <rect x={3} y={-31} width={2} height={2} rx={0.5} fill={C.turquoise} />
        {/* Tall quetzal feathers */}
        {[-4, -2, 0, 2, 4].map((dx, i) => (
          <line key={`hdf-${i}`}
            x1={dx} y1={-32}
            x2={dx * 2 + flagSway * 0.3} y2={-55 - Math.abs(dx) * 3}
            stroke={i === 2 ? C.quetzalGreen : i % 2 === 0 ? C.featherGreen : C.featherRed}
            strokeWidth={2} strokeLinecap="round" />
        ))}
        {/* Gold tips */}
        {[-4, -2, 0, 2, 4].map((dx, i) => (
          <circle key={`hdt-${i}`}
            cx={dx * 2 + flagSway * 0.3} cy={-56 - Math.abs(dx) * 3}
            r={1.5} fill={C.goldLight} />
        ))}
      </g>

      {/* Foreground stone bench (market seating) */}
      <g transform={`translate(${width * 0.5}, ${height * 0.88})`}>
        <rect x={-25} y={-6} width={50} height={6} rx={2}
          fill={C.paveMid} stroke={C.paveJoint} strokeWidth={0.5} />
        <rect x={-22} y={0} width={8} height={6} rx={1}
          fill={C.paveDark} stroke={C.paveJoint} strokeWidth={0.3} />
        <rect x={14} y={0} width={8} height={6} rx={1}
          fill={C.paveDark} stroke={C.paveJoint} strokeWidth={0.3} />
        {/* Stone texture */}
        <line x1={-20} y1={-3} x2={20} y2={-3} stroke={C.paveJoint} strokeWidth={0.3} opacity={0.2} />
      </g>

      {/* Torch stands (for evening market or atmosphere) */}
      {[width * 0.1, width * 0.35, width * 0.65, width * 0.9].map((tx, i) => (
        <g key={`torch-${i}`} transform={`translate(${tx}, ${height * 0.5})`}>
          <line x1={0} y1={0} x2={0} y2={-35} stroke={C.stallPost} strokeWidth={2.5} />
          {/* Torch bowl */}
          <path d="M-5,-35 Q-6,-38 -4,-40 L4,-40 Q6,-38 5,-35 Z"
            fill={C.potteryDark} stroke={C.outline} strokeWidth={0.4} />
          {/* Small flame */}
          <g opacity={0.4 + fireFlicker * 0.3}>
            <path d={`M-2,-40 Q-3,${-44 - fireFlicker * 3} 0,${-48 - fireFlicker * 5}
              Q3,${-44 - fireFlicker * 3} 2,-40`}
              fill="#E08030" opacity={0.6} />
            <path d={`M-1,-40 Q-1,${-43 - fireFlicker * 2} 0,${-45 - fireFlicker * 3}
              Q1,${-43 - fireFlicker * 2} 1,-40`}
              fill="#FFCC60" opacity={0.4} />
          </g>
          {/* Flame glow */}
          <circle cx={0} cy={-44} r={8 + fireFlicker * 3}
            fill="rgba(255,160,40,0.06)" />
        </g>
      ))}

      {/* Aisle perspective lines (worn paths between stalls) */}
      <g opacity={0.08}>
        <path d={`M${width * 0.5},${height * 0.36}
          L${width * 0.45},${height} M${width * 0.5},${height * 0.36}
          L${width * 0.55},${height}`}
          fill="none" stroke={C.paveWet} strokeWidth={4} />
      </g>

      {/* Small children playing between stalls */}
      {[
        { x: width * 0.32, y: height * 0.66 },
        { x: width * 0.58, y: height * 0.64 },
      ].map((child, i) => (
        <g key={`child-${i}`} transform={`translate(${child.x}, ${child.y})`}>
          <ellipse cx={0} cy={2} rx={3} ry={1} fill="rgba(0,0,0,0.06)" />
          <line x1={0} y1={0} x2={0} y2={-5}
            stroke={C.skin} strokeWidth={1.5} strokeLinecap="round" />
          <circle cx={0} cy={-6.5} r={1.8}
            fill={C.skin} stroke={C.outline} strokeWidth={0.2} />
          <rect x={-1.5} y={-4} width={3} height={3} rx={0.5}
            fill={C.cotton} opacity={0.5} />
        </g>
      ))}

      {/* Shade patterns on ground from awnings (dappled light) */}
      {Array.from({ length: 15 }, (_, i) => {
        const sx = 50 + (i * 131) % (width - 100);
        const sy = height * 0.5 + (i * 47) % (height * 0.25);
        return (
          <ellipse key={`shade-${i}`}
            cx={sx} cy={sy}
            rx={12 + (i % 3) * 5} ry={5 + (i % 2) * 3}
            fill="rgba(0,0,0,0.04)" />
        );
      })}

      {/* Sunlight patches between shade (bright spots) */}
      {Array.from({ length: 8 }, (_, i) => {
        const lx = 100 + (i * 247) % (width - 200);
        const ly = height * 0.55 + (i * 61) % (height * 0.2);
        return (
          <ellipse key={`light-${i}`}
            cx={lx} cy={ly}
            rx={15 + (i % 4) * 5} ry={8 + (i % 3) * 3}
            fill="rgba(255,220,140,0.04)" />
        );
      })}

      {/* Discarded corn husks */}
      {Array.from({ length: 6 }, (_, i) => (
        <path key={`husk-${i}`}
          d={`M${80 + (i * 311) % (width - 160)},${height * 0.7 + (i * 29) % (height * 0.15)}
            Q${82 + (i * 311) % (width - 160)},${height * 0.7 + (i * 29) % (height * 0.15) - 3}
            ${85 + (i * 311) % (width - 160)},${height * 0.7 + (i * 29) % (height * 0.15)}`}
          fill={C.maizeGreen} opacity={0.1} />
      ))}

      {/* Dog prints on stone */}
      {Array.from({ length: 4 }, (_, i) => (
        <g key={`paw-${i}`} opacity={0.04}>
          <circle cx={width * 0.6 + i * 15} cy={height * 0.65 + i * 3} r={1.5} fill={C.paveDark} />
          <circle cx={width * 0.6 + i * 15 - 1} cy={height * 0.65 + i * 3 - 2} r={0.6} fill={C.paveDark} />
          <circle cx={width * 0.6 + i * 15 + 1} cy={height * 0.65 + i * 3 - 2} r={0.6} fill={C.paveDark} />
        </g>
      ))}

      {/* ============================================================ */}
      {/* LAYER 10: WOODEN BOARD (market sign style) */}
      {/* ============================================================ */}

      <g transform={`translate(${width * 0.5 - 220}, ${height * 0.86})`}>
        {/* Shadow */}
        <rect x={-6} y={-6} width={452} height={112} rx={4}
          fill="rgba(0,0,0,0.25)" />
        {/* Wooden frame */}
        <rect x={-10} y={-10} width={460} height={120} rx={6}
          fill={C.boardWood} stroke={C.outline} strokeWidth={2} />
        {/* Inner surface */}
        <rect x={0} y={0} width={440} height={100} rx={3}
          fill={C.boardSurface} />
        {/* Wood grain */}
        {Array.from({ length: 8 }, (_, i) => (
          <path key={`wg-${i}`}
            d={`M0,${10 + i * 12} Q${100 + (i % 3) * 40},${8 + i * 12} ${220},${10 + i * 12}
              Q${340 - (i % 3) * 30},${12 + i * 12} 440,${10 + i * 12}`}
            fill="none" stroke={C.boardWood} strokeWidth={0.5} opacity={0.15} />
        ))}
        {/* Aztec border */}
        <g opacity={0.3}>
          {Array.from({ length: 22 }, (_, i) => (
            <path key={`abf-${i}`}
              d={`M${i * 20 + 5},3 L${i * 20 + 10},3 L${i * 20 + 10},7 L${i * 20 + 15},7 L${i * 20 + 15},3`}
              fill="none" stroke={C.gold} strokeWidth={0.8} />
          ))}
        </g>
        {/* Text */}
        {boardText && (
          <text x={220} y={58} textAnchor="middle" fill={C.boardText}
            fontSize={36} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        )}
      </g>

      {/* ============================================================ */}
      {/* LAYER 11: ATMOSPHERIC OVERLAYS */}
      {/* ============================================================ */}

      {/* Warm market atmosphere */}
      <rect x={0} y={0} width={width} height={height}
        fill={C.warmGlow} />

      {/* Low fog near ground */}
      <ellipse cx={width * 0.3 + mistFloat} cy={height * 0.85}
        rx={200} ry={20} fill={C.fogNear} opacity={0.2} />
      <ellipse cx={width * 0.7 - mistFloat} cy={height * 0.87}
        rx={180} ry={18} fill={C.fogNear} opacity={0.15} />

      {/* Vignette */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#am-vignette)" />

      {/* Bottom darkness */}
      <linearGradient id="am-bottom" x1="0%" y1="88%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(20,10,5,0.2)" />
      </linearGradient>
      <rect x={0} y={height * 0.88} width={width} height={height * 0.12}
        fill="url(#am-bottom)" />

      {/* Canvas texture */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#am-canvas)" opacity={0.5} />

      {/* Warm color grading */}
      <rect x={0} y={0} width={width} height={height}
        fill="rgba(200,160,80,0.03)" />

      {/* Side darkening */}
      <linearGradient id="am-left" x1="0%" y1="0%" x2="10%" y2="0%">
        <stop offset="0%" stopColor="rgba(20,10,5,0.18)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>
      <rect x={0} y={0} width={width * 0.12} height={height}
        fill="url(#am-left)" />
      <linearGradient id="am-right" x1="90%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(20,10,5,0.18)" />
      </linearGradient>
      <rect x={width * 0.88} y={0} width={width * 0.12} height={height}
        fill="url(#am-right)" />

      {/* Floating dust motes in sunbeams */}
      {Array.from({ length: 25 }, (_, i) => {
        const dx = 80 + (i * 83) % (width - 160);
        const dy = height * 0.35 + (i * 37) % (height * 0.3);
        const ds = 0.4 + (i % 3) * 0.3;
        return (
          <circle key={`mote-${i}`}
            cx={dx + sineWave(frame, 0.015, i * 0.7) * 3}
            cy={dy + sineWave(frame, 0.012, i * 1.3) * 2}
            r={ds}
            fill="#FFF8E0" opacity={0.06 + (i % 4) * 0.015} />
        );
      })}

      {/* More cooking smoke wisps (thin, rising) */}
      <g opacity={0.12}>
        {[width * 0.2, width * 0.45, width * 0.7, width * 0.92].map((sx, i) => (
          <path key={`thinsmoke-${i}`}
            d={`M${sx},${height * 0.68}
              Q${sx + smokeDrift1 * (i % 2 === 0 ? 1 : -1)},${height * 0.58}
              ${sx + smokeDrift1 * 2 * (i % 2 === 0 ? 1 : -1)},${height * 0.48}`}
            fill="none" stroke={C.cookSmoke} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>

      {/* Market ambient noise visualization (subtle crowd haze) */}
      <ellipse cx={width * 0.5} cy={height * 0.6}
        rx={width * 0.35} ry={height * 0.1}
        fill={C.dustLight} opacity={0.06} />

      {/* Foreground stone detail (large paving stones) */}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={`fstone-${i}`}>
          <rect x={width * 0.02 + i * (width * 0.16)}
            y={height * 0.92}
            width={width * 0.14} height={height * 0.06}
            fill={C.paveMid} stroke={C.paveJoint} strokeWidth={0.5} opacity={0.2} rx={1} />
          <line x1={width * 0.09 + i * (width * 0.16)}
            y1={height * 0.92}
            x2={width * 0.09 + i * (width * 0.16)}
            y2={height * 0.98}
            stroke={C.paveJoint} strokeWidth={0.3} opacity={0.15} />
        </g>
      ))}

      {/* Subtle warm glow patches (from torches) */}
      {[width * 0.1, width * 0.35, width * 0.65, width * 0.9].map((gx, i) => (
        <circle key={`tglow-${i}`}
          cx={gx} cy={height * 0.5}
          r={40 + fireFlicker * 10}
          fill="rgba(255,160,40,0.02)" />
      ))}

      {/* Tiny birds pecking at spilled grain */}
      {Array.from({ length: 4 }, (_, i) => {
        const bx = width * 0.25 + i * width * 0.15;
        const by = height * 0.72 + (i % 2) * 5;
        const peckCycle = sineWave(frame, 0.2, i * 2);
        return (
          <g key={`gbird-${i}`} transform={`translate(${bx}, ${by})`}>
            <ellipse cx={0} cy={0} rx={2} ry={1.5}
              fill="#5A4A30" opacity={0.3} />
            <circle cx={-1.5} cy={-1 - Math.max(0, peckCycle) * 1.5} r={1}
              fill="#5A4A30" opacity={0.3} />
            <line x1={-2.5} y1={-1 - Math.max(0, peckCycle) * 1.5}
              x2={-3.5} y2={-0.5 - Math.max(0, peckCycle)}
              stroke="#8A6A30" strokeWidth={0.4} opacity={0.3} />
          </g>
        );
      })}

      {/* Ambient warmth from market activity */}
      <rect x={0} y={height * 0.35} width={width} height={height * 0.65}
        fill="url(#am-ambient)" />

      {/* Ground shadow */}
      <rect x={0} y={height * 0.35} width={width} height={height * 0.65}
        fill="url(#am-ground-shadow)" />

      {/* Dust particle overlay */}
      <rect x={0} y={height * 0.35} width={width} height={height * 0.5}
        fill="url(#am-dust)" />

      {/* Film grain */}
      <g opacity={0.02}>
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={`g-${i}`}
            x={(i * 107) % width} y={(i * 59) % height}
            width={1.5} height={1.5}
            fill={i % 2 === 0 ? '#FFF' : '#000'} />
        ))}
      </g>
    </svg>
  );
};

export default AztecMarket;
