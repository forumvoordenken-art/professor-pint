import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { CrowdLayer, CROWD_CONFIGS } from '../crowds/CrowdWorkers';

interface NileRiverProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  skyTop: '#4A90D9',
  skyBottom: '#87CEEB',
  sun: '#FFD700',
  sunGlow: 'rgba(255,215,0,0.25)',
  water: '#2E7D8A',
  waterDark: '#246A75',
  waterLight: '#3A9AAA',
  waterReflect: 'rgba(255,255,255,0.15)',
  sand: '#D4A868',
  sandDark: '#C49858',
  sandLight: '#E4C088',
  boatWood: '#8B6B4A',
  boatWoodDark: '#6B4F32',
  boatWoodLight: '#A07E5A',
  sail: '#F5E8D0',
  sailShade: '#DDD0B8',
  stone: '#9A8A78',
  stoneDark: '#7A6A58',
  papyrus: '#3D7A3D',
  papyrusDark: '#2D5A2D',
  palm: '#2D6B1E',
  palmTrunk: '#8B6B4A',
  pyramidSilhouette: '#B8986A',
  pyramidSilhouetteShade: '#A08050',
  boardBg: '#C4986A',
  boardFrame: '#8B6B4A',
  boardStone: '#B8906A',
  chalk: '#F5E8C8',
  hieroglyph: '#8B6B4A',
  outline: '#1A1A1A',
  bird: '#2A2A2A',
};

export const NileRiver: React.FC<NileRiverProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Animation values
  const sunPulse = 1 + sineWave(frame, 0.05) * 0.03;
  const waterRipple1 = sineWave(frame, 0.12);
  const waterRipple2 = sineWave(frame, 0.18, 1.2);
  const boatBob = sineWave(frame, 0.08) * 3;
  const boatBob2 = sineWave(frame, 0.06, 0.8) * 2;
  const sailBillow = sineWave(frame, 0.1) * 4;
  const papyrusSway1 = sineWave(frame, 0.07) * 3;
  const papyrusSway2 = sineWave(frame, 0.09, 0.5) * 2.5;
  const papyrusSway3 = sineWave(frame, 0.06, 1.0) * 3.5;

  // Key Y positions
  const riverTop = height * 0.38;
  const riverBottom = height * 0.62;
  const riverMid = (riverTop + riverBottom) / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient */}
        <linearGradient id="nile-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="100%" stopColor={C.skyBottom} />
        </linearGradient>

        {/* Water gradient */}
        <linearGradient id="nile-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.waterLight} />
          <stop offset="40%" stopColor={C.water} />
          <stop offset="100%" stopColor={C.waterDark} />
        </linearGradient>

        {/* Sun glow */}
        <radialGradient id="nile-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.sunGlow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* ===== SKY ===== */}
      <rect x={0} y={0} width={width} height={riverTop} fill="url(#nile-sky)" />

      {/* ===== SUN (upper right) ===== */}
      <g transform={`translate(${width * 0.82}, ${height * 0.12}) scale(${sunPulse})`}>
        <circle cx={0} cy={0} r={70} fill={C.sunGlow} opacity={0.35} />
        <circle cx={0} cy={0} r={45} fill={C.sun} />
        <circle cx={-10} cy={-10} r={14} fill="white" opacity={0.3} />
      </g>

      {/* ===== BIRDS (V-shapes) ===== */}
      {[
        { x: width * 0.2, y: height * 0.08, s: 1.0, ph: 0 },
        { x: width * 0.28, y: height * 0.11, s: 0.7, ph: 0.4 },
        { x: width * 0.55, y: height * 0.06, s: 0.9, ph: 0.8 },
        { x: width * 0.62, y: height * 0.1, s: 0.6, ph: 1.5 },
        { x: width * 0.4, y: height * 0.14, s: 0.8, ph: 2.0 },
      ].map((b, i) => {
        const wingFlap = sineWave(frame, 0.2, b.ph) * 3;
        return (
          <g key={`bird-${i}`} transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}>
            <path
              d={`M-12,${wingFlap} Q-6,${-4 + wingFlap * 0.5} 0,0 Q6,${-4 + wingFlap * 0.5} 12,${wingFlap}`}
              fill="none" stroke={C.bird} strokeWidth={2} strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* ===== DISTANT PYRAMIDS on horizon ===== */}
      <g transform={`translate(${width * 0.15}, ${riverTop})`}>
        <path d="M0,0 L-35,-50 L35,0 Z" fill={C.pyramidSilhouette} opacity={0.5} />
        <path d="M0,0 L5,-50 L35,0 Z" fill={C.pyramidSilhouetteShade} opacity={0.3} />
      </g>
      <g transform={`translate(${width * 0.25}, ${riverTop})`}>
        <path d="M0,0 L-25,-35 L25,0 Z" fill={C.pyramidSilhouette} opacity={0.4} />
        <path d="M0,0 L5,-35 L25,0 Z" fill={C.pyramidSilhouetteShade} opacity={0.25} />
      </g>
      <g transform={`translate(${width * 0.08}, ${riverTop})`}>
        <path d="M0,0 L-18,-25 L18,0 Z" fill={C.pyramidSilhouette} opacity={0.3} />
      </g>

      {/* ===== TOP SANDY BANK ===== */}
      <path
        d={`M0,${riverTop}
          Q${width * 0.1},${riverTop - 12} ${width * 0.2},${riverTop - 5}
          Q${width * 0.4},${riverTop + 6} ${width * 0.6},${riverTop - 3}
          Q${width * 0.8},${riverTop + 8} ${width},${riverTop - 2}
          L${width},${riverTop - 60} L0,${riverTop - 60} Z`}
        fill={C.sand}
      />
      <path
        d={`M0,${riverTop + 3}
          Q${width * 0.15},${riverTop - 8} ${width * 0.3},${riverTop + 2}
          Q${width * 0.5},${riverTop + 10} ${width * 0.7},${riverTop}
          Q${width * 0.85},${riverTop + 5} ${width},${riverTop + 2}
          L${width},${riverTop} L0,${riverTop} Z`}
        fill={C.sandDark} opacity={0.4}
      />

      {/* ===== PALM TREES on far bank (top) ===== */}
      <PalmTree x={width * 0.42} y={riverTop - 8} h={110} lean={-4 + papyrusSway1 * 0.3} />
      <PalmTree x={width * 0.58} y={riverTop - 5} h={100} lean={3 + papyrusSway2 * 0.3} />
      <PalmTree x={width * 0.72} y={riverTop - 10} h={120} lean={-2 + papyrusSway1 * 0.2} />

      {/* ===== PAPYRUS REEDS along top bank ===== */}
      {[
        { x: width * 0.02, sway: papyrusSway1 },
        { x: width * 0.06, sway: papyrusSway2 },
        { x: width * 0.1, sway: papyrusSway3 },
        { x: width * 0.35, sway: papyrusSway2 },
        { x: width * 0.38, sway: papyrusSway1 },
        { x: width * 0.65, sway: papyrusSway3 },
        { x: width * 0.68, sway: papyrusSway1 },
        { x: width * 0.92, sway: papyrusSway2 },
        { x: width * 0.96, sway: papyrusSway3 },
      ].map((p, i) => (
        <PapyrusReed key={`pr-top-${i}`} x={p.x} y={riverTop + 5} sway={p.sway} flip={false} />
      ))}

      {/* ===== NILE RIVER WATER ===== */}
      <rect x={0} y={riverTop} width={width} height={riverBottom - riverTop} fill="url(#nile-water)" />

      {/* Animated wave ripples */}
      {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((frac, i) => {
        const yOff = riverTop + (riverBottom - riverTop) * (0.15 + frac * 0.7);
        const xShift = waterRipple1 * 8 + i * 20;
        return (
          <path
            key={`ripple-${i}`}
            d={`M${-40 + xShift},${yOff}
              Q${width * 0.1 + xShift},${yOff - 3 + waterRipple2 * 2} ${width * 0.2 + xShift},${yOff}
              Q${width * 0.3 + xShift},${yOff + 3 - waterRipple2 * 2} ${width * 0.4 + xShift},${yOff}
              Q${width * 0.5 + xShift},${yOff - 2 + waterRipple1 * 2} ${width * 0.6 + xShift},${yOff}
              Q${width * 0.7 + xShift},${yOff + 3 - waterRipple1 * 2} ${width * 0.8 + xShift},${yOff}
              Q${width * 0.9 + xShift},${yOff - 2 + waterRipple2 * 1.5} ${width + 40 + xShift},${yOff}`}
            fill="none"
            stroke={C.waterReflect}
            strokeWidth={1.5}
            opacity={0.3 + sineWave(frame, 0.1, i * 0.7) * 0.15}
          />
        );
      })}

      {/* Water shimmer reflections */}
      {[
        { x: width * 0.15, y: riverMid - 15, w: 40 },
        { x: width * 0.35, y: riverMid + 10, w: 55 },
        { x: width * 0.55, y: riverMid - 5, w: 35 },
        { x: width * 0.75, y: riverMid + 15, w: 45 },
        { x: width * 0.9, y: riverMid - 10, w: 30 },
      ].map((r, i) => (
        <line
          key={`shimmer-${i}`}
          x1={r.x}
          y1={r.y}
          x2={r.x + r.w}
          y2={r.y}
          stroke="white"
          strokeWidth={1}
          opacity={0.15 + sineWave(frame, 0.15, i * 1.1) * 0.1}
        />
      ))}

      {/* ===== SMALLER BOAT (background) ===== */}
      <g transform={`translate(${width * 0.25}, ${riverMid - 20 + boatBob2})`}>
        {/* Hull */}
        <path
          d="M-40,0 Q-45,-5 -35,-12 L35,-12 Q45,-5 40,0 Z"
          fill={C.boatWood} stroke={C.outline} strokeWidth={1.5}
        />
        <path
          d="M-40,0 Q-45,-5 -35,-12 L35,-12 Q45,-5 40,0 Z"
          fill={C.boatWoodLight} opacity={0.3}
        />
        {/* Small mast and sail */}
        <line x1={0} y1={-12} x2={0} y2={-55} stroke={C.boatWoodDark} strokeWidth={2} />
        <path
          d={`M0,-52 L${20 + sailBillow * 0.5},-35 L0,-15 Z`}
          fill={C.sail} stroke={C.outline} strokeWidth={1} opacity={0.9}
        />
        {/* Stone block on small boat */}
        <rect x={-15} y={-18} width={14} height={8} fill={C.stone} stroke={C.outline} strokeWidth={1} rx={1} />
      </g>

      {/* ===== LARGE BOAT (center, carrying stone blocks) ===== */}
      <g transform={`translate(${width * 0.55}, ${riverMid - 10 + boatBob})`}>
        {/* Hull - flat barge style */}
        <path
          d="M-120,0 Q-130,-8 -110,-22 L110,-22 Q130,-8 120,0 Z"
          fill={C.boatWood} stroke={C.outline} strokeWidth={2}
        />
        {/* Hull highlight */}
        <path
          d="M-105,-20 L105,-20 Q120,-10 110,-2 L-110,-2 Q-120,-10 -105,-20 Z"
          fill={C.boatWoodLight} opacity={0.25}
        />
        {/* Hull plank lines */}
        <line x1={-100} y1={-14} x2={100} y2={-14} stroke={C.boatWoodDark} strokeWidth={1} opacity={0.3} />
        <line x1={-95} y1={-7} x2={95} y2={-7} stroke={C.boatWoodDark} strokeWidth={1} opacity={0.2} />

        {/* Stone blocks on deck */}
        <rect x={-70} y={-38} width={30} height={18} fill={C.stone} stroke={C.outline} strokeWidth={1.5} rx={1} />
        <rect x={-70} y={-38} width={30} height={18} fill={C.stoneDark} opacity={0.2} rx={1} />
        <rect x={-35} y={-38} width={30} height={18} fill={C.stone} stroke={C.outline} strokeWidth={1.5} rx={1} />
        <rect x={-35} y={-40} width={28} height={4} fill="white" opacity={0.08} rx={1} />
        <rect x={0} y={-38} width={30} height={18} fill={C.stone} stroke={C.outline} strokeWidth={1.5} rx={1} />
        <rect x={0} y={-38} width={30} height={18} fill={C.stoneDark} opacity={0.15} rx={1} />
        {/* Stacked block on top */}
        <rect x={-55} y={-54} width={28} height={16} fill={C.stoneDark} stroke={C.outline} strokeWidth={1.5} rx={1} />
        <rect x={-20} y={-54} width={28} height={16} fill={C.stone} stroke={C.outline} strokeWidth={1.5} rx={1} />

        {/* Mast */}
        <line x1={55} y1={-22} x2={55} y2={-110} stroke={C.boatWoodDark} strokeWidth={3.5} />
        {/* Crossbeam */}
        <line x1={35} y1={-105} x2={75} y2={-105} stroke={C.boatWoodDark} strokeWidth={2} />

        {/* Sail */}
        <path
          d={`M55,-108
            Q${85 + sailBillow},-85 ${80 + sailBillow * 1.2},-55
            L55,-40 Z`}
          fill={C.sail} stroke={C.outline} strokeWidth={1.5}
        />
        <path
          d={`M55,-108
            Q${85 + sailBillow},-85 ${80 + sailBillow * 1.2},-55
            L55,-40 Z`}
          fill={C.sailShade} opacity={0.2}
        />
        {/* Sail stitch line */}
        <path
          d={`M55,-95 Q${72 + sailBillow * 0.7},-77 ${70 + sailBillow * 0.8},-58`}
          fill="none" stroke={C.boatWoodDark} strokeWidth={0.8} opacity={0.3}
        />

        {/* Rudder */}
        <line x1={110} y1={-18} x2={130} y2={8} stroke={C.boatWoodDark} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* ===== BOTTOM SANDY BANK ===== */}
      <path
        d={`M0,${riverBottom}
          Q${width * 0.12},${riverBottom + 8} ${width * 0.25},${riverBottom + 2}
          Q${width * 0.45},${riverBottom - 6} ${width * 0.65},${riverBottom + 4}
          Q${width * 0.8},${riverBottom + 10} ${width},${riverBottom}
          L${width},${height} L0,${height} Z`}
        fill={C.sand}
      />
      <path
        d={`M0,${riverBottom + 5}
          Q${width * 0.2},${riverBottom + 15} ${width * 0.4},${riverBottom + 8}
          Q${width * 0.6},${riverBottom + 18} ${width * 0.8},${riverBottom + 10}
          Q${width * 0.9},${riverBottom + 20} ${width},${riverBottom + 12}
          L${width},${height} L0,${height} Z`}
        fill={C.sandDark} opacity={0.3}
      />
      {/* Sand highlight */}
      <path
        d={`M0,${riverBottom + 2}
          Q${width * 0.3},${riverBottom - 4} ${width * 0.5},${riverBottom + 3}
          Q${width * 0.7},${riverBottom - 2} ${width},${riverBottom + 1}
          L${width},${riverBottom} L0,${riverBottom} Z`}
        fill={C.sandLight} opacity={0.4}
      />

      {/* ===== PAPYRUS REEDS along bottom bank ===== */}
      {[
        { x: width * 0.03, sway: papyrusSway2 },
        { x: width * 0.07, sway: papyrusSway3 },
        { x: width * 0.12, sway: papyrusSway1 },
        { x: width * 0.3, sway: papyrusSway3 },
        { x: width * 0.33, sway: papyrusSway2 },
        { x: width * 0.48, sway: papyrusSway1 },
        { x: width * 0.78, sway: papyrusSway2 },
        { x: width * 0.82, sway: papyrusSway3 },
        { x: width * 0.94, sway: papyrusSway1 },
        { x: width * 0.98, sway: papyrusSway2 },
      ].map((p, i) => (
        <PapyrusReed key={`pr-bot-${i}`} x={p.x} y={riverBottom - 5} sway={p.sway} flip={true} />
      ))}

      {/* Animated crowd figures (bank workers, etc) */}
      <CrowdLayer config={CROWD_CONFIGS.nileRiver} />

      {/* ===== STONE TABLET BOARD ===== */}
      <g transform={`translate(${width / 2 - 200}, ${height * 0.72})`}>
        {/* Shadow */}
        <rect x={-4} y={4} width={416} height={176} rx={6} fill="rgba(0,0,0,0.15)" />
        {/* Frame */}
        <rect x={-8} y={-8} width={416} height={176} rx={4} fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        {/* Inner tablet */}
        <rect x={0} y={0} width={400} height={160} fill={C.boardBg} />
        {/* Stone texture lines */}
        <line x1={20} y1={40} x2={380} y2={40} stroke={C.boardStone} strokeWidth={0.5} opacity={0.3} />
        <line x1={20} y1={80} x2={380} y2={80} stroke={C.boardStone} strokeWidth={0.5} opacity={0.2} />
        <line x1={20} y1={120} x2={380} y2={120} stroke={C.boardStone} strokeWidth={0.5} opacity={0.3} />
        {/* Hieroglyphic decorations */}
        <text x={30} y={28} fontSize={16} fill={C.hieroglyph} opacity={0.25} fontFamily="serif">
          𓀀 𓂀 𓃀 𓄀
        </text>
        <text x={30} y={148} fontSize={16} fill={C.hieroglyph} opacity={0.25} fontFamily="serif">
          𓅀 𓆀 𓇀 𓈀
        </text>
        {boardText && (
          <text
            x={200}
            y={95}
            textAnchor="middle"
            fill={C.chalk}
            fontSize={36}
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            opacity={0.9}
          >
            {boardText}
          </text>
        )}
      </g>
    </svg>
  );
};

/** Papyrus reed with fan-shaped top, growing from the bank into the water edge */
const PapyrusReed: React.FC<{ x: number; y: number; sway: number; flip: boolean }> = ({
  x,
  y,
  sway,
  flip,
}) => {
  const dir = flip ? 1 : -1;
  const stalkH = 55 + Math.abs(sway) * 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Main stalk */}
      <path
        d={`M0,0 Q${sway * 0.6},${dir * -stalkH * 0.5} ${sway},${dir * -stalkH}`}
        fill="none"
        stroke={C.papyrus}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Fan-top fronds */}
      <g transform={`translate(${sway}, ${dir * -stalkH})`}>
        <path
          d={`M0,0 Q${-8 + sway * 0.3},${dir * -12} ${-14 + sway * 0.4},${dir * -6}`}
          fill="none" stroke={C.papyrus} strokeWidth={2} strokeLinecap="round"
        />
        <path
          d={`M0,0 Q${-3 + sway * 0.2},${dir * -15} ${-5 + sway * 0.2},${dir * -10}`}
          fill="none" stroke={C.papyrus} strokeWidth={2} strokeLinecap="round"
        />
        <path
          d={`M0,0 Q${3 + sway * 0.2},${dir * -15} ${5 + sway * 0.2},${dir * -10}`}
          fill="none" stroke={C.papyrus} strokeWidth={2} strokeLinecap="round"
        />
        <path
          d={`M0,0 Q${8 + sway * 0.3},${dir * -12} ${14 + sway * 0.4},${dir * -6}`}
          fill="none" stroke={C.papyrus} strokeWidth={2} strokeLinecap="round"
        />
        <path
          d={`M0,0 Q${0 + sway * 0.1},${dir * -16} ${0 + sway * 0.15},${dir * -12}`}
          fill="none" stroke={C.papyrusDark} strokeWidth={1.5} strokeLinecap="round"
        />
      </g>
      {/* Secondary shorter stalk */}
      <path
        d={`M3,0 Q${sway * 0.4 + 2},${dir * -stalkH * 0.35} ${sway * 0.7 + 4},${dir * -stalkH * 0.6}`}
        fill="none"
        stroke={C.papyrusDark}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
};

/** Palm tree helper - matches Pyramids.tsx style */
const PalmTree: React.FC<{ x: number; y: number; h: number; lean: number }> = ({
  x,
  y,
  h,
  lean,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Trunk */}
    <path
      d={`M0,0 Q${lean},-${h * 0.5} ${lean * 1.5},-${h}`}
      fill="none"
      stroke={C.palmTrunk}
      strokeWidth={8}
      strokeLinecap="round"
    />
    <path
      d={`M0,0 Q${lean},-${h * 0.5} ${lean * 1.5},-${h}`}
      fill="none"
      stroke={C.outline}
      strokeWidth={10}
      strokeLinecap="round"
      opacity={0.08}
    />
    {/* Trunk ridges */}
    {[0.25, 0.45, 0.65, 0.85].map((r, i) => (
      <ellipse
        key={`r-${i}`}
        cx={lean * r * 1.5}
        cy={-h * r}
        rx={5}
        ry={2}
        fill="none"
        stroke={C.outline}
        strokeWidth={1}
        opacity={0.2}
      />
    ))}
    {/* Fronds */}
    <g transform={`translate(${lean * 1.5}, -${h})`}>
      <path d="M0,0 Q-35,-18 -55,5" fill="none" stroke={C.palm} strokeWidth={3.5} />
      <path d="M0,0 Q-25,-30 -45,-12" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q35,-18 55,5" fill="none" stroke={C.palm} strokeWidth={3.5} />
      <path d="M0,0 Q25,-30 45,-12" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q-12,-35 -18,-8" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q12,-35 18,-8" fill="none" stroke={C.palm} strokeWidth={3} />
    </g>
  </g>
);

export default NileRiver;
