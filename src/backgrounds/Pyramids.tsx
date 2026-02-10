import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

interface PyramidsProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  skyTop: '#1E3A8A',
  skyBottom: '#D4A012',
  sun: '#FFD700',
  sunGlow: 'rgba(255,200,50,0.3)',
  sand: '#D4A868',
  sandDark: '#C49858',
  sandLight: '#E4B878',
  pyramid: '#C4986A',
  pyramidShade: '#A07848',
  pyramidLine: '#B08858',
  stone: '#B8906A',
  stoneDark: '#A07848',
  obelisk: '#D4B888',
  palm: '#2D5016',
  palmTrunk: '#8B6B4A',
  outline: '#1A1A1A',
  hieroglyph: '#8B6B4A',
  boardBg: '#C4986A',
  boardFrame: '#8B6B4A',
  chalk: '#F5E8C8',
};

export const Pyramids: React.FC<PyramidsProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const heatShimmer = sineWave(frame, 0.15) * 2;
  const sunPulse = 1 + sineWave(frame, 0.05) * 0.03;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient id="pyr-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="80%" stopColor={C.skyBottom} />
          <stop offset="100%" stopColor={C.sand} />
        </linearGradient>
        <radialGradient id="pyr-sun-glow" cx="50%" cy="30%" r="40%">
          <stop offset="0%" stopColor={C.sunGlow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect x={0} y={0} width={width} height={height * 0.65} fill="url(#pyr-sky)" />
      <rect x={0} y={0} width={width} height={height} fill="url(#pyr-sun-glow)" />

      {/* Sun */}
      <g transform={`translate(${width * 0.75}, ${height * 0.18}) scale(${sunPulse})`}>
        <circle cx={0} cy={0} r={60} fill={C.sunGlow} opacity={0.4} />
        <circle cx={0} cy={0} r={40} fill={C.sun} />
        <circle cx={-8} cy={-8} r={12} fill="white" opacity={0.3} />
      </g>

      {/* Stars (faint, it's dusk) */}
      {[
        [200, 80], [400, 40], [600, 100], [1100, 60], [1400, 90], [1700, 50],
      ].map(([x, y], i) => (
        <circle key={`star-${i}`} cx={x} cy={y} r={1.5} fill="white" opacity={0.3 + sineWave(frame, 0.2 + i * 0.05) * 0.2} />
      ))}

      {/* Desert sand */}
      <rect x={0} y={height * 0.55} width={width} height={height * 0.45} fill={C.sand} />
      {/* Sand dune shapes */}
      <path d={`M0,${height * 0.6} Q${width * 0.15},${height * 0.55} ${width * 0.3},${height * 0.58}
        Q${width * 0.5},${height * 0.54 + heatShimmer} ${width * 0.7},${height * 0.57}
        Q${width * 0.85},${height * 0.55} ${width},${height * 0.6} L${width},${height} L0,${height} Z`}
        fill={C.sandDark} opacity={0.4} />

      {/* Great Pyramid (center) */}
      <g transform={`translate(${width * 0.5}, ${height * 0.55})`}>
        <path d="M0,-280 L-220,0 L220,0 Z" fill={C.pyramid} stroke={C.outline} strokeWidth={2} />
        <path d="M0,-280 L50,0 L220,0 Z" fill={C.pyramidShade} opacity={0.4} />
        {/* Stone block lines */}
        {[-200, -140, -80, -30].map((y, i) => (
          <line key={`bl-${i}`} x1={y * -0.7} y1={y} x2={y * 0.7} y2={y} stroke={C.pyramidLine} strokeWidth={1} opacity={0.3} />
        ))}
      </g>

      {/* Second pyramid (left, smaller) */}
      <g transform={`translate(${width * 0.22}, ${height * 0.58})`}>
        <path d="M0,-180 L-150,0 L150,0 Z" fill={C.pyramid} stroke={C.outline} strokeWidth={2} />
        <path d="M0,-180 L40,0 L150,0 Z" fill={C.pyramidShade} opacity={0.4} />
      </g>

      {/* Third pyramid (right, smaller) */}
      <g transform={`translate(${width * 0.78}, ${height * 0.6})`}>
        <path d="M0,-140 L-120,0 L120,0 Z" fill={C.pyramid} stroke={C.outline} strokeWidth={2} />
        <path d="M0,-140 L30,0 L120,0 Z" fill={C.pyramidShade} opacity={0.4} />
      </g>

      {/* Sphinx silhouette (far left) */}
      <g transform={`translate(${width * 0.08}, ${height * 0.62})`}>
        <path d="M0,0 L10,-40 L20,-50 Q30,-55 40,-45 L50,-30 L70,-25 L90,-20 L100,0 Z"
          fill={C.stone} stroke={C.outline} strokeWidth={1.5} opacity={0.7} />
      </g>

      {/* Palm trees */}
      <PalmTree x={width * 0.12} y={height * 0.58} h={120} lean={-5 + heatShimmer * 0.5} />
      <PalmTree x={width * 0.88} y={height * 0.56} h={140} lean={3 + heatShimmer * 0.3} />

      {/* Stone tablet (instead of chalkboard) */}
      <g transform={`translate(${width / 2 - 200}, ${height * 0.68})`}>
        <rect x={-8} y={-8} width={416} height={176} rx={4} fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        <rect x={0} y={0} width={400} height={160} fill={C.boardBg} />
        {/* Hieroglyphic decorations */}
        <text x={30} y={30} fontSize={18} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">𓀀 𓂀 𓃀 𓄀</text>
        <text x={30} y={140} fontSize={18} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">𓅀 𓆀 𓇀 𓈀</text>
        {boardText && (
          <text x={200} y={95} textAnchor="middle" fill={C.chalk}
            fontSize={36} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        )}
      </g>

      {/* Heat shimmer overlay */}
      <rect x={0} y={height * 0.5} width={width} height={height * 0.1}
        fill="rgba(255,200,100,0.04)" opacity={0.5 + sineWave(frame, 0.1) * 0.3} />
    </svg>
  );
};

const PalmTree: React.FC<{ x: number; y: number; h: number; lean: number }> = ({ x, y, h, lean }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Trunk */}
    <path d={`M0,0 Q${lean},-${h * 0.5} ${lean * 1.5},-${h}`}
      fill="none" stroke={C.palmTrunk} strokeWidth={8} strokeLinecap="round" />
    <path d={`M0,0 Q${lean},-${h * 0.5} ${lean * 1.5},-${h}`}
      fill="none" stroke={C.outline} strokeWidth={10} strokeLinecap="round" opacity={0.1} />
    {/* Trunk ridges */}
    {[0.2, 0.4, 0.6, 0.8].map((r, i) => (
      <ellipse key={`r-${i}`} cx={lean * r * 1.5} cy={-h * r} rx={5} ry={2}
        fill="none" stroke={C.outline} strokeWidth={1} opacity={0.2} />
    ))}
    {/* Fronds */}
    <g transform={`translate(${lean * 1.5}, -${h})`}>
      <path d="M0,0 Q-30,-15 -50,5" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q-20,-25 -40,-10" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q30,-15 50,5" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q20,-25 40,-10" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q-10,-30 -15,-5" fill="none" stroke={C.palm} strokeWidth={3} />
      <path d="M0,0 Q10,-30 15,-5" fill="none" stroke={C.palm} strokeWidth={3} />
    </g>
  </g>
);

export default Pyramids;
