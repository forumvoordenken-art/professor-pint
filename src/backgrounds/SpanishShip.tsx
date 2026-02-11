import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

interface SpanishShipProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  skyTop: '#1B2A4A',
  skyMid: '#2A4A6A',
  horizon: '#4A7A9A',
  sunGlow: '#FFB347',
  sunCore: '#FFD700',
  seaDeep: '#1A3A5A',
  seaMid: '#2A5A7A',
  seaLight: '#3A7A9A',
  foam: 'rgba(255,255,255,',
  hull: '#5A3A1A',
  hullDark: '#3A2510',
  deck: '#8B6B4A',
  sail: '#F5E8D0',
  sailShadow: '#D8CAB0',
  mast: '#4A3520',
  flag: '#CC2020',
  flagYellow: '#FFD700',
  rope: '#6B5A40',
  coast: '#C4A868',
  coastDark: '#A08848',
  palm: '#2D5016',
  palmTrunk: '#6B5030',
  cloud: 'rgba(255,240,220,',
  star: '#FFFFFF',
  outline: '#1A1A1A',
  gold: '#D4A012',
};

export const SpanishShip: React.FC<SpanishShipProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Animations
  const waveOffset = sineWave(frame, 0.4) * 8;
  const waveOffset2 = sineWave(frame, 0.3, 1.2) * 6;
  const shipRock = sineWave(frame, 0.25) * 1.5;
  const shipBob = sineWave(frame, 0.3, 0.5) * 3;
  const flagWave = sineWave(frame, 0.8) * 8;
  const sailBillow = sineWave(frame, 0.15) * 3;
  const cloudX = sineWave(frame, 0.02) * 30;
  const starTwinkle = sineWave(frame, 1.2) * 0.3 + 0.7;
  const starTwinkle2 = sineWave(frame, 0.9, 1.5) * 0.3 + 0.7;
  const gullY = sineWave(frame, 0.5, 0.3) * 15;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient id="ship-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="60%" stopColor={C.skyMid} />
          <stop offset="100%" stopColor={C.horizon} />
        </linearGradient>
        <linearGradient id="ship-sea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.seaLight} />
          <stop offset="50%" stopColor={C.seaMid} />
          <stop offset="100%" stopColor={C.seaDeep} />
        </linearGradient>
        <radialGradient id="ship-sun" cx="15%" cy="45%" r="20%">
          <stop offset="0%" stopColor={C.sunCore} stopOpacity={0.8} />
          <stop offset="50%" stopColor={C.sunGlow} stopOpacity={0.3} />
          <stop offset="100%" stopColor={C.sunGlow} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect x={0} y={0} width={width} height={height * 0.55} fill="url(#ship-sky)" />

      {/* === STARS === */}
      {[
        { x: 150, y: 50, s: starTwinkle },
        { x: 400, y: 80, s: starTwinkle2 },
        { x: 700, y: 40, s: starTwinkle },
        { x: 1100, y: 70, s: starTwinkle2 },
        { x: 1400, y: 55, s: starTwinkle },
        { x: 1700, y: 90, s: starTwinkle2 },
      ].map((st, i) => (
        <circle key={`star-${i}`} cx={st.x} cy={st.y} r={1.2} fill={C.star} opacity={st.s * 0.5} />
      ))}

      {/* === SUN GLOW === */}
      <ellipse cx={width * 0.15} cy={height * 0.45} rx={300} ry={200} fill="url(#ship-sun)" />

      {/* === CLOUDS === */}
      <g transform={`translate(${cloudX}, 0)`} opacity={0.25}>
        <ellipse cx={500} cy={150} rx={100} ry={25} fill={`${C.cloud}0.4)`} />
        <ellipse cx={540} cy={145} rx={70} ry={20} fill={`${C.cloud}0.3)`} />
        <ellipse cx={1300} cy={120} rx={90} ry={22} fill={`${C.cloud}0.35)`} />
        <ellipse cx={1700} cy={170} rx={80} ry={20} fill={`${C.cloud}0.3)`} />
      </g>

      {/* === SEA === */}
      <rect x={0} y={height * 0.55} width={width} height={height * 0.45} fill="url(#ship-sea)" />

      {/* === WAVES === */}
      <g opacity={0.3}>
        {Array.from({ length: 8 }, (_, i) => {
          const yBase = height * 0.58 + i * 55;
          const xOff = sineWave(frame, 0.2 + i * 0.05, i * 0.8) * 20;
          return (
            <path key={`wave-${i}`}
              d={`M${-20 + xOff},${yBase} Q${240 + xOff},${yBase - 12 + waveOffset} ${480 + xOff},${yBase} Q${720 + xOff},${yBase + 8 + waveOffset2} ${960 + xOff},${yBase} Q${1200 + xOff},${yBase - 10 + waveOffset} ${1440 + xOff},${yBase} Q${1680 + xOff},${yBase + 6 + waveOffset2} ${1940 + xOff},${yBase}`}
              fill="none" stroke={`${C.foam}${0.2 - i * 0.02})`} strokeWidth={2} />
          );
        })}
      </g>

      {/* === DISTANT COAST (left side) === */}
      <g>
        <path d={`M0,${height * 0.52} L0,${height * 0.62} L350,${height * 0.58} L500,${height * 0.55} L400,${height * 0.50} L250,${height * 0.48} L100,${height * 0.50} Z`}
          fill={C.coast} stroke={C.outline} strokeWidth={1.5} opacity={0.7} />
        <path d={`M0,${height * 0.52} L0,${height * 0.56} L200,${height * 0.54} L300,${height * 0.52} L200,${height * 0.50} Z`}
          fill={C.coastDark} opacity={0.4} />
        {/* Palm trees on coast */}
        {[80, 180, 300].map((px, i) => (
          <g key={`palm-${i}`} transform={`translate(${px}, ${height * 0.48 + i * 8})`}>
            <line x1={0} y1={0} x2={3} y2={-45 + i * 5} stroke={C.palmTrunk} strokeWidth={4} />
            <ellipse cx={3 + i * 2} cy={-50 + i * 5} rx={20} ry={8} fill={C.palm} opacity={0.7} />
            <ellipse cx={-5 + i} cy={-45 + i * 5} rx={18} ry={7} fill={C.palm} opacity={0.6} />
          </g>
        ))}
      </g>

      {/* === MAIN SHIP (center-right) === */}
      <g transform={`translate(1100, ${height * 0.42 + shipBob}) rotate(${shipRock}, 0, 100)`}>
        {/* Hull */}
        <path d="M-180,100 Q-200,130 -160,160 L160,160 Q200,130 180,100 Z"
          fill={C.hull} stroke={C.outline} strokeWidth={2.5} />
        <path d="M-170,105 Q-185,130 -155,155 L155,155 Q185,130 170,105 Z"
          fill={C.hullDark} opacity={0.4} />
        {/* Hull stripes */}
        <line x1={-160} y1={125} x2={160} y2={125} stroke={C.deck} strokeWidth={2} opacity={0.5} />
        <line x1={-150} y1={140} x2={150} y2={140} stroke={C.deck} strokeWidth={1.5} opacity={0.3} />

        {/* Deck */}
        <rect x={-150} y={85} width={300} height={18} rx={2} fill={C.deck} stroke={C.outline} strokeWidth={1.5} />

        {/* Forecastle (front) */}
        <rect x={110} y={55} width={60} height={48} rx={2} fill={C.hull} stroke={C.outline} strokeWidth={2} />
        <rect x={112} y={57} width={56} height={12} fill={C.deck} opacity={0.5} />

        {/* Sterncastle (back) */}
        <rect x={-170} y={40} width={70} height={63} rx={2} fill={C.hull} stroke={C.outline} strokeWidth={2} />
        <rect x={-168} y={42} width={66} height={12} fill={C.deck} opacity={0.5} />
        {/* Windows */}
        <rect x={-155} y={65} width={12} height={10} rx={1} fill={C.sunGlow} opacity={0.5} />
        <rect x={-135} y={65} width={12} height={10} rx={1} fill={C.sunGlow} opacity={0.4} />

        {/* Main mast */}
        <line x1={0} y1={90} x2={0} y2={-120} stroke={C.mast} strokeWidth={5} />
        {/* Main sail */}
        <path d={`M-60,-100 Q${sailBillow},-50 -60,10 L60,10 Q${-sailBillow},-50 60,-100 Z`}
          fill={C.sail} stroke={C.outline} strokeWidth={1.5} />
        <path d={`M-55,-95 Q${sailBillow * 0.8},-50 -55,5 L0,5 Q${-sailBillow * 0.4},-50 0,-95 Z`}
          fill={C.sailShadow} opacity={0.3} />
        {/* Cross on sail */}
        <line x1={-2} y1={-80} x2={-2} y2={-20} stroke={C.flag} strokeWidth={4} opacity={0.7} />
        <line x1={-25} y1={-55} x2={20} y2={-55} stroke={C.flag} strokeWidth={4} opacity={0.7} />

        {/* Crow's nest */}
        <rect x={-12} y={-125} width={24} height={8} rx={1} fill={C.deck} stroke={C.outline} strokeWidth={1.5} />

        {/* Front mast */}
        <line x1={90} y1={85} x2={90} y2={-60} stroke={C.mast} strokeWidth={4} />
        {/* Front sail */}
        <path d={`M50,-50 Q${90 + sailBillow * 0.7},-15 50,30 L130,30 Q${90 - sailBillow * 0.7},-15 130,-50 Z`}
          fill={C.sail} stroke={C.outline} strokeWidth={1.5} />

        {/* Rear mast */}
        <line x1={-120} y1={40} x2={-120} y2={-80} stroke={C.mast} strokeWidth={3.5} />
        {/* Rear sail (lateen) */}
        <path d={`M-120,-75 L-90,15 L-150,15 Z`}
          fill={C.sail} stroke={C.outline} strokeWidth={1.5} />

        {/* Rigging */}
        <line x1={0} y1={-120} x2={170} y2={90} stroke={C.rope} strokeWidth={1} opacity={0.5} />
        <line x1={0} y1={-120} x2={-170} y2={90} stroke={C.rope} strokeWidth={1} opacity={0.5} />
        <line x1={90} y1={-60} x2={170} y2={85} stroke={C.rope} strokeWidth={1} opacity={0.4} />

        {/* Spanish flag */}
        <g transform={`translate(0, -125)`}>
          <path d={`M0,0 L${25 + flagWave * 0.5},${-3 + flagWave * 0.2} L${20 + flagWave * 0.3},${8} L0,5 Z`}
            fill={C.flag} stroke={C.outline} strokeWidth={1} />
          <line x1={8} y1={1} x2={`${18 + flagWave * 0.3}`} y2={3} stroke={C.flagYellow} strokeWidth={2} />
        </g>

        {/* Water line / reflection */}
        <ellipse cx={0} cy={165} rx={190} ry={8} fill={`${C.foam}0.15)`} />
      </g>

      {/* === SECOND SHIP (smaller, background) === */}
      <g transform={`translate(750, ${height * 0.46 + shipBob * 0.6}) scale(0.5) rotate(${shipRock * 0.7}, 0, 100)`} opacity={0.6}>
        <path d="M-150,100 Q-170,125 -130,150 L130,150 Q170,125 150,100 Z"
          fill={C.hull} stroke={C.outline} strokeWidth={2} />
        <line x1={0} y1={95} x2={0} y2={-80} stroke={C.mast} strokeWidth={4} />
        <path d="M-45,-70 L45,-70 L45,20 L-45,20 Z" fill={C.sail} stroke={C.outline} strokeWidth={1.5} />
      </g>

      {/* === SEAGULLS === */}
      {[
        { x: 600, y: 250 + gullY, s: 1 },
        { x: 650, y: 270 + gullY * 0.7, s: 0.7 },
        { x: 1500, y: 200 + gullY * 0.5, s: 0.8 },
      ].map((g, i) => (
        <g key={`gull-${i}`} transform={`translate(${g.x}, ${g.y}) scale(${g.s})`} opacity={0.6}>
          <path d="M-8,0 Q0,-6 8,0" fill="none" stroke="#333" strokeWidth={1.5} />
        </g>
      ))}

      {/* === BOARD TEXT === */}
      {boardText && (
        <g transform={`translate(${width / 2}, ${height * 0.12})`}>
          <rect x={-240} y={-30} width={480} height={60} rx={4} fill="rgba(0,0,0,0.5)" />
          <rect x={-238} y={-28} width={476} height={56} rx={3} fill="none" stroke={C.gold} strokeWidth={1.5} opacity={0.6} />
          <text x={0} y={8} textAnchor="middle" fill={C.gold}
            fontSize={32} fontFamily="'Georgia', serif" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        </g>
      )}
    </svg>
  );
};

export default SpanishShip;
