import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

interface AztecTempleProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  sky: '#1B0A2E',
  skyMid: '#3A1855',
  horizon: '#8B3A1A',
  sunGlow: '#FF6B1A',
  sunCore: '#FFD700',
  stone: '#A89070',
  stoneDark: '#7A6548',
  stoneLight: '#C4B08A',
  stoneAccent: '#8B7355',
  grass: '#2D5016',
  grassLight: '#3A6B1E',
  path: '#8B7355',
  pathDark: '#6B5838',
  torch: '#FF8C00',
  torchGlow: 'rgba(255,140,0,',
  smoke: 'rgba(180,180,180,',
  gold: '#D4A012',
  goldDark: '#B8890F',
  jade: '#2D8B5A',
  blood: '#8B2020',
  outline: '#1A1A1A',
  cloud: 'rgba(255,200,150,',
  star: '#FFFFFF',
};

export const AztecTemple: React.FC<AztecTempleProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Animated elements
  const torchFlicker1 = sineWave(frame, 3.5) * 4 + sineWave(frame, 7.2, 1.3) * 2;
  const torchFlicker2 = sineWave(frame, 4.1, 0.8) * 3.5 + sineWave(frame, 6.5, 2.1) * 2.5;
  const torchGlow1 = 0.6 + sineWave(frame, 3.5) * 0.15;
  const torchGlow2 = 0.6 + sineWave(frame, 4.1, 0.8) * 0.15;
  const smokeY1 = (frame * 0.8) % 120;
  const smokeY2 = ((frame + 30) * 0.7) % 120;
  const cloudX = sineWave(frame, 0.02) * 40;
  const starTwinkle = sineWave(frame, 1.2) * 0.3 + 0.7;
  const starTwinkle2 = sineWave(frame, 0.9, 1.5) * 0.3 + 0.7;
  const bannerSway = sineWave(frame, 0.3) * 3;
  const fireParticle1Y = (frame * 2) % 60;
  const fireParticle2Y = ((frame + 15) * 1.8) % 60;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient id="aztec-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.sky} />
          <stop offset="50%" stopColor={C.skyMid} />
          <stop offset="85%" stopColor={C.horizon} />
          <stop offset="100%" stopColor={C.sunGlow} />
        </linearGradient>
        <radialGradient id="aztec-sun" cx="50%" cy="100%" r="40%">
          <stop offset="0%" stopColor={C.sunCore} stopOpacity={0.9} />
          <stop offset="40%" stopColor={C.sunGlow} stopOpacity={0.4} />
          <stop offset="100%" stopColor={C.sunGlow} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="temple-stone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.stoneLight} />
          <stop offset="100%" stopColor={C.stoneDark} />
        </linearGradient>
        <radialGradient id="torch-glow-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.torch} stopOpacity={torchGlow1 * 0.5} />
          <stop offset="100%" stopColor={C.torch} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="torch-glow-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.torch} stopOpacity={torchGlow2 * 0.5} />
          <stop offset="100%" stopColor={C.torch} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect x={0} y={0} width={width} height={height} fill="url(#aztec-sky)" />

      {/* === STARS === */}
      {[
        { x: 120, y: 60, s: starTwinkle },
        { x: 340, y: 100, s: starTwinkle2 },
        { x: 580, y: 40, s: starTwinkle },
        { x: 780, y: 120, s: starTwinkle2 },
        { x: 1050, y: 55, s: starTwinkle },
        { x: 1250, y: 90, s: starTwinkle2 },
        { x: 1480, y: 70, s: starTwinkle },
        { x: 1680, y: 110, s: starTwinkle2 },
        { x: 200, y: 180, s: starTwinkle },
        { x: 900, y: 30, s: starTwinkle2 },
        { x: 1600, y: 150, s: starTwinkle },
        { x: 450, y: 160, s: starTwinkle2 },
      ].map((st, i) => (
        <circle key={`star-${i}`} cx={st.x} cy={st.y} r={1.5} fill={C.star} opacity={st.s} />
      ))}

      {/* === SUN GLOW (horizon) === */}
      <ellipse cx={width / 2} cy={height * 0.52} rx={500} ry={200} fill="url(#aztec-sun)" />

      {/* === CLOUDS (animated) === */}
      <g transform={`translate(${cloudX}, 0)`} opacity={0.3}>
        <ellipse cx={300} cy={200} rx={120} ry={30} fill={`${C.cloud}0.4)`} />
        <ellipse cx={340} cy={195} rx={80} ry={25} fill={`${C.cloud}0.3)`} />
        <ellipse cx={1500} cy={180} rx={100} ry={28} fill={`${C.cloud}0.35)`} />
        <ellipse cx={1540} cy={175} rx={70} ry={22} fill={`${C.cloud}0.25)`} />
      </g>

      {/* === DISTANT MOUNTAINS === */}
      <path
        d="M0,500 L200,380 L400,440 L600,350 L800,420 L1000,370 L1200,440 L1400,380 L1600,430 L1920,400 L1920,560 L0,560 Z"
        fill={C.stoneDark} opacity={0.4}
      />

      {/* === MAIN TEMPLE (center) === */}
      <g transform={`translate(${width / 2}, 300)`}>
        {/* Base level */}
        <path d="M-280,260 L-240,200 L240,200 L280,260 Z" fill="url(#temple-stone)" stroke={C.outline} strokeWidth={2.5} />
        {/* Stone block texture */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`base-${i}`} x1={-270 + i * 110} y1={260 - i * 2} x2={-240 + i * 110} y2={200}
            stroke={C.stoneAccent} strokeWidth={1} opacity={0.4} />
        ))}

        {/* Second level */}
        <path d="M-200,200 L-170,150 L170,150 L200,200 Z" fill="url(#temple-stone)" stroke={C.outline} strokeWidth={2.5} />
        <line x1={-200} y1={200} x2={200} y2={200} stroke={C.stoneAccent} strokeWidth={2} opacity={0.5} />

        {/* Third level */}
        <path d="M-140,150 L-115,105 L115,105 L140,150 Z" fill="url(#temple-stone)" stroke={C.outline} strokeWidth={2.5} />
        <line x1={-140} y1={150} x2={140} y2={150} stroke={C.stoneAccent} strokeWidth={2} opacity={0.5} />

        {/* Fourth level */}
        <path d="M-90,105 L-70,70 L70,70 L90,105 Z" fill="url(#temple-stone)" stroke={C.outline} strokeWidth={2.5} />
        <line x1={-90} y1={105} x2={90} y2={105} stroke={C.stoneAccent} strokeWidth={2} opacity={0.5} />

        {/* Temple top (shrine) */}
        <rect x={-50} y={20} width={100} height={50} fill={C.stone} stroke={C.outline} strokeWidth={2.5} />
        <path d="M-55,20 L0,-10 L55,20 Z" fill={C.stoneLight} stroke={C.outline} strokeWidth={2.5} />

        {/* Doorway */}
        <rect x={-18} y={35} width={36} height={35} rx={2} fill={C.sky} stroke={C.outline} strokeWidth={2} />
        <rect x={-22} y={33} width={44} height={6} fill={C.gold} stroke={C.outline} strokeWidth={1.5} />

        {/* Stairs (center) */}
        <path d="M-35,260 L-35,70 L35,70 L35,260 Z" fill={C.stoneAccent} stroke={C.outline} strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`stair-${i}`} x1={-35} y1={70 + i * 16} x2={35} y2={70 + i * 16}
            stroke={C.stoneDark} strokeWidth={1.5} />
        ))}

        {/* Aztec carvings on temple levels */}
        <AztecCarving x={-160} y={170} />
        <AztecCarving x={120} y={170} />
        <AztecCarving x={-95} y={125} />
        <AztecCarving x={65} y={125} />

        {/* Gold eagle on top */}
        <g transform="translate(0, -10)">
          <path d="M-12,-15 L0,-28 L12,-15 L8,-8 L-8,-8 Z" fill={C.gold} stroke={C.outline} strokeWidth={2} />
          <circle cx={0} cy={-20} r={4} fill={C.blood} stroke={C.outline} strokeWidth={1.5} />
        </g>

        {/* LEFT TORCH */}
        <g transform="translate(-60, 30)">
          <rect x={-4} y={0} width={8} height={30} fill={C.stoneDark} stroke={C.outline} strokeWidth={2} />
          <circle cx={0} cy={-10} r={60} fill="url(#torch-glow-1)" />
          <g transform={`translate(${torchFlicker1 * 0.5}, 0)`}>
            <ellipse cx={0} cy={-8} rx={6 + torchFlicker1 * 0.5} ry={12 + torchFlicker1} fill={C.torch} opacity={0.9} />
            <ellipse cx={0} cy={-12} rx={4} ry={8 + torchFlicker1 * 0.5} fill={C.sunCore} opacity={0.7} />
            <ellipse cx={0} cy={-15} rx={2} ry={5} fill="white" opacity={0.4} />
          </g>
          {/* Fire particles */}
          <circle cx={-3} cy={-20 - fireParticle1Y * 0.5} r={1.5} fill={C.torch} opacity={Math.max(0, 1 - fireParticle1Y / 30)} />
          <circle cx={2} cy={-18 - fireParticle2Y * 0.5} r={1} fill={C.sunCore} opacity={Math.max(0, 1 - fireParticle2Y / 30)} />
        </g>

        {/* RIGHT TORCH */}
        <g transform="translate(60, 30)">
          <rect x={-4} y={0} width={8} height={30} fill={C.stoneDark} stroke={C.outline} strokeWidth={2} />
          <circle cx={0} cy={-10} r={60} fill="url(#torch-glow-2)" />
          <g transform={`translate(${torchFlicker2 * 0.5}, 0)`}>
            <ellipse cx={0} cy={-8} rx={6 + torchFlicker2 * 0.5} ry={12 + torchFlicker2} fill={C.torch} opacity={0.9} />
            <ellipse cx={0} cy={-12} rx={4} ry={8 + torchFlicker2 * 0.5} fill={C.sunCore} opacity={0.7} />
            <ellipse cx={0} cy={-15} rx={2} ry={5} fill="white" opacity={0.4} />
          </g>
          <circle cx={3} cy={-20 - fireParticle2Y * 0.5} r={1.5} fill={C.torch} opacity={Math.max(0, 1 - fireParticle2Y / 30)} />
          <circle cx={-2} cy={-18 - fireParticle1Y * 0.5} r={1} fill={C.sunCore} opacity={Math.max(0, 1 - fireParticle1Y / 30)} />
        </g>

        {/* Smoke from torches */}
        <g opacity={0.15}>
          <ellipse cx={-60} cy={-20 - smokeY1} rx={8 + smokeY1 * 0.15} ry={5 + smokeY1 * 0.1}
            fill={`${C.smoke}${Math.max(0, 0.3 - smokeY1 / 400)})`} />
          <ellipse cx={60} cy={-20 - smokeY2} rx={8 + smokeY2 * 0.15} ry={5 + smokeY2 * 0.1}
            fill={`${C.smoke}${Math.max(0, 0.3 - smokeY2 / 400)})`} />
        </g>
      </g>

      {/* === SMALLER TEMPLE (left) === */}
      <g transform="translate(280, 400)">
        <path d="M-100,160 L-80,110 L80,110 L100,160 Z" fill={C.stone} stroke={C.outline} strokeWidth={2} />
        <path d="M-65,110 L-50,70 L50,70 L65,110 Z" fill={C.stoneLight} stroke={C.outline} strokeWidth={2} />
        <rect x={-30} y={35} width={60} height={35} fill={C.stone} stroke={C.outline} strokeWidth={2} />
        <path d="M-35,35 L0,15 L35,35 Z" fill={C.stoneLight} stroke={C.outline} strokeWidth={2} />
        <rect x={-10} y={45} width={20} height={25} fill={C.sky} stroke={C.outline} strokeWidth={1.5} />
        <line x1={-100} y1={160} x2={100} y2={160} stroke={C.stoneAccent} strokeWidth={2} opacity={0.5} />
        <AztecCarving x={-55} y={125} />
        <AztecCarving x={30} y={125} />
      </g>

      {/* === SMALLER TEMPLE (right) === */}
      <g transform="translate(1640, 420)">
        <path d="M-90,140 L-70,95 L70,95 L90,140 Z" fill={C.stone} stroke={C.outline} strokeWidth={2} />
        <path d="M-55,95 L-40,60 L40,60 L55,95 Z" fill={C.stoneLight} stroke={C.outline} strokeWidth={2} />
        <rect x={-25} y={30} width={50} height={30} fill={C.stone} stroke={C.outline} strokeWidth={2} />
        <path d="M-30,30 L0,12 L30,30 Z" fill={C.stoneLight} stroke={C.outline} strokeWidth={2} />
        <rect x={-8} y={38} width={16} height={22} fill={C.sky} stroke={C.outline} strokeWidth={1.5} />
        <AztecCarving x={-45} y={108} />
        <AztecCarving x={25} y={108} />
      </g>

      {/* === GROUND / PLAZA === */}
      <rect x={0} y={height * 0.52} width={width} height={height * 0.48} fill={C.path} />
      <rect x={0} y={height * 0.52} width={width} height={8} fill={C.pathDark} opacity={0.4} />
      {/* Ground texture */}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`ground-${i}`} x1={i * 170 + 30} y1={height * 0.52} x2={i * 170 + 30} y2={height}
          stroke={C.pathDark} strokeWidth={1} opacity={0.15} />
      ))}
      {[0.65, 0.78, 0.90].map((r, i) => (
        <line key={`gh-${i}`} x1={0} y1={height * r} x2={width} y2={height * r}
          stroke={C.pathDark} strokeWidth={1} opacity={0.1} />
      ))}

      {/* === VEGETATION (sides) === */}
      {[50, 120, 1750, 1830].map((vx, i) => (
        <g key={`veg-${i}`} transform={`translate(${vx}, ${height * 0.48})`}>
          <ellipse cx={0} cy={20} rx={35} ry={40} fill={C.grass} opacity={0.6} />
          <ellipse cx={10} cy={15} rx={25} ry={35} fill={C.grassLight} opacity={0.4} />
        </g>
      ))}

      {/* === DECORATIVE BANNERS === */}
      <g transform={`translate(700, ${height * 0.55})`}>
        <line x1={0} y1={0} x2={0} y2={-60} stroke={C.stoneDark} strokeWidth={3} />
        <g transform={`rotate(${bannerSway}, 0, -60)`}>
          <path d="M0,-60 L25,-50 L20,-20 L0,-30 Z" fill={C.blood} stroke={C.outline} strokeWidth={1.5} />
          <circle cx={10} cy={-42} r={4} fill={C.gold} />
        </g>
      </g>
      <g transform={`translate(1220, ${height * 0.55})`}>
        <line x1={0} y1={0} x2={0} y2={-60} stroke={C.stoneDark} strokeWidth={3} />
        <g transform={`rotate(${-bannerSway}, 0, -60)`}>
          <path d="M0,-60 L-25,-50 L-20,-20 L0,-30 Z" fill={C.jade} stroke={C.outline} strokeWidth={1.5} />
          <circle cx={-10} cy={-42} r={4} fill={C.gold} />
        </g>
      </g>

      {/* === BOARD TEXT (stone slab overlay) === */}
      {boardText && (
        <g transform={`translate(${width / 2}, ${height * 0.15})`}>
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

/* Aztec carving decoration */
const AztecCarving: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={0} y={0} width={30} height={20} rx={2} fill="none" stroke="#D4A012" strokeWidth={1.5} opacity={0.5} />
    <line x1={5} y1={5} x2={25} y2={5} stroke="#D4A012" strokeWidth={1} opacity={0.4} />
    <line x1={5} y1={10} x2={25} y2={10} stroke="#D4A012" strokeWidth={1} opacity={0.3} />
    <line x1={5} y1={15} x2={25} y2={15} stroke="#D4A012" strokeWidth={1} opacity={0.4} />
    <circle cx={15} cy={10} r={4} fill="none" stroke="#D4A012" strokeWidth={1} opacity={0.4} />
  </g>
);

export default AztecTemple;
