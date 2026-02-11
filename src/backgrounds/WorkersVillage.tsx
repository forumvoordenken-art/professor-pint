import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { CrowdLayer, CROWD_CONFIGS } from '../crowds/CrowdWorkers';

interface WorkersVillageProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  skyTop: '#4A90D9',
  skyBottom: '#6BA3D6',
  sun: '#FFD700',
  sunGlow: 'rgba(255,200,50,0.3)',
  cloud: '#F0F0F0',
  cloudShadow: '#D8D8E8',
  sand: '#D4A868',
  sandDark: '#C49858',
  sandLight: '#E4B878',
  path: '#C49040',
  pathEdge: '#B08030',
  building: '#C4986A',
  buildingDark: '#B08858',
  buildingLight: '#D4A878',
  roofTop: '#A07848',
  doorway: '#5A3A20',
  oven: '#A06030',
  ovenDark: '#7A4820',
  ovenGlow: '#FF6030',
  smoke: 'rgba(120,110,100,0.25)',
  pot: '#B07040',
  potDark: '#8A5530',
  well: '#9A8060',
  wellWater: '#4A80B0',
  awning: '#C86040',
  awningAlt: '#D4A040',
  rack: '#8B6B4A',
  fish: '#C8A870',
  pyramid: '#C4986A',
  pyramidShade: '#A07848',
  outline: '#1A1A1A',
  boardBg: '#C4986A',
  boardFrame: '#8B6B4A',
  chalk: '#F5E8C8',
  hieroglyph: '#8B6B4A',
};

export const WorkersVillage: React.FC<WorkersVillageProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const sunPulse = 1 + sineWave(frame, 0.05) * 0.03;
  const heatShimmer = sineWave(frame, 0.15) * 2;
  const smokeRise = sineWave(frame, 0.12);
  const smokeRise2 = sineWave(frame, 0.09, 1.5);
  const awningSway1 = sineWave(frame, 0.08) * 3;
  const awningSway2 = sineWave(frame, 0.07, 0.8) * 2.5;
  const cloudDrift = (frame * 0.15) % (width + 400);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient id="wv-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="100%" stopColor={C.skyBottom} />
        </linearGradient>
        <radialGradient id="wv-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.sunGlow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="wv-ground" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.sandLight} />
          <stop offset="100%" stopColor={C.sand} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x={0} y={0} width={width} height={height * 0.55} fill="url(#wv-sky)" />

      {/* Sun with pulse */}
      <g transform={`translate(${width * 0.82}, ${height * 0.12}) scale(${sunPulse})`}>
        <circle cx={0} cy={0} r={70} fill={C.sunGlow} opacity={0.35} />
        <circle cx={0} cy={0} r={45} fill={C.sun} />
        <circle cx={-10} cy={-10} r={14} fill="white" opacity={0.3} />
      </g>

      {/* Clouds */}
      <g transform={`translate(${-200 + cloudDrift}, ${height * 0.08})`} opacity={0.7}>
        <ellipse cx={0} cy={0} rx={60} ry={22} fill={C.cloud} />
        <ellipse cx={40} cy={-5} rx={45} ry={18} fill={C.cloud} />
        <ellipse cx={-30} cy={5} rx={40} ry={16} fill={C.cloudShadow} />
      </g>
      <g transform={`translate(${-500 + cloudDrift * 0.7}, ${height * 0.15})`} opacity={0.5}>
        <ellipse cx={0} cy={0} rx={50} ry={18} fill={C.cloud} />
        <ellipse cx={35} cy={-3} rx={35} ry={14} fill={C.cloud} />
      </g>
      <g transform={`translate(${-100 + cloudDrift * 0.5}, ${height * 0.06})`} opacity={0.4}>
        <ellipse cx={0} cy={0} rx={40} ry={14} fill={C.cloud} />
        <ellipse cx={28} cy={-4} rx={30} ry={12} fill={C.cloud} />
      </g>

      {/* Distant pyramids on horizon */}
      <g opacity={0.35}>
        <path d={`M${width * 0.08},${height * 0.52} L${width * 0.13},${height * 0.38} L${width * 0.18},${height * 0.52} Z`}
          fill={C.pyramid} stroke={C.outline} strokeWidth={1} />
        <path d={`M${width * 0.13},${height * 0.38} L${width * 0.155},${height * 0.52} L${width * 0.18},${height * 0.52} Z`}
          fill={C.pyramidShade} opacity={0.5} />
        <path d={`M${width * 0.15},${height * 0.52} L${width * 0.20},${height * 0.40} L${width * 0.25},${height * 0.52} Z`}
          fill={C.pyramid} stroke={C.outline} strokeWidth={1} />
        <path d={`M${width * 0.20},${height * 0.40} L${width * 0.225},${height * 0.52} L${width * 0.25},${height * 0.52} Z`}
          fill={C.pyramidShade} opacity={0.5} />
      </g>

      {/* Sandy ground */}
      <rect x={0} y={height * 0.50} width={width} height={height * 0.50} fill="url(#wv-ground)" />
      {/* Ground texture */}
      <path d={`M0,${height * 0.54} Q${width * 0.2},${height * 0.52 + heatShimmer} ${width * 0.4},${height * 0.53}
        Q${width * 0.6},${height * 0.51} ${width * 0.8},${height * 0.53 + heatShimmer * 0.5}
        L${width},${height * 0.52} L${width},${height * 0.55} L0,${height * 0.55} Z`}
        fill={C.sandDark} opacity={0.3} />

      {/* Dusty path/street running through village */}
      <path d={`M${width * 0.35},${height * 0.55} Q${width * 0.40},${height * 0.62} ${width * 0.42},${height * 0.70}
        Q${width * 0.45},${height * 0.80} ${width * 0.50},${height * 0.92}
        Q${width * 0.52},${height} ${width * 0.55},${height}`}
        fill="none" stroke={C.path} strokeWidth={80} strokeLinecap="round" />
      <path d={`M${width * 0.35},${height * 0.55} Q${width * 0.40},${height * 0.62} ${width * 0.42},${height * 0.70}
        Q${width * 0.45},${height * 0.80} ${width * 0.50},${height * 0.92}
        Q${width * 0.52},${height} ${width * 0.55},${height}`}
        fill="none" stroke={C.pathEdge} strokeWidth={84} strokeLinecap="round" opacity={0.3} />

      {/* === LEFT SIDE BUILDINGS === */}

      {/* Building 1 - large house, left */}
      <MudbrickBuilding x={width * 0.05} y={height * 0.52} w={160} h={120} />

      {/* Building 2 - smaller house behind */}
      <MudbrickBuilding x={width * 0.18} y={height * 0.48} w={120} h={90} />

      {/* Building 3 - medium house, left-center */}
      <MudbrickBuilding x={width * 0.08} y={height * 0.65} w={140} h={110} />

      {/* Awning on building 3 */}
      <g transform={`translate(${width * 0.08 + 140}, ${height * 0.65 + 20})`}>
        <line x1={0} y1={0} x2={0} y2={80} stroke={C.rack} strokeWidth={4} />
        <line x1={70} y1={10} x2={70} y2={90} stroke={C.rack} strokeWidth={4} />
        <path d={`M-5,${0 + awningSway1} Q35,${-8 + awningSway1 * 0.5} 75,${3 + awningSway1}`}
          fill="none" stroke={C.awning} strokeWidth={12} opacity={0.85} />
        <path d={`M-5,${20 + awningSway1 * 0.8} Q35,${12 + awningSway1 * 0.3} 75,${23 + awningSway1 * 0.8}`}
          fill="none" stroke={C.awning} strokeWidth={12} opacity={0.7} />
      </g>

      {/* === BAKERY (center-left) === */}
      <g transform={`translate(${width * 0.24}, ${height * 0.62})`}>
        {/* Bakery building */}
        <rect x={0} y={0} width={150} height={110} fill={C.building} stroke={C.outline} strokeWidth={2} />
        <rect x={0} y={-6} width={158} height={8} fill={C.roofTop} stroke={C.outline} strokeWidth={1.5} />
        <rect x={30} y={60} width={40} height={50} fill={C.doorway} stroke={C.outline} strokeWidth={1.5} rx={2} />
        {/* Window */}
        <rect x={100} y={25} width={25} height={25} fill={C.doorway} stroke={C.outline} strokeWidth={1.5} opacity={0.8} />

        {/* Clay oven (dome) next to bakery */}
        <g transform="translate(165, 50)">
          <ellipse cx={30} cy={60} rx={35} ry={10} fill={C.sandDark} opacity={0.3} />
          <path d="M0,60 Q0,0 30,-10 Q60,0 60,60 Z" fill={C.oven} stroke={C.outline} strokeWidth={2} />
          <path d="M30,-10 Q60,0 60,60 L40,60 Q50,10 30,-10 Z" fill={C.ovenDark} opacity={0.3} />
          {/* Oven opening */}
          <path d="M15,60 Q15,40 30,35 Q45,40 45,60 Z" fill={C.doorway} stroke={C.outline} strokeWidth={1.5} />
          {/* Oven glow */}
          <ellipse cx={30} cy={52} rx={10} ry={6} fill={C.ovenGlow} opacity={0.4 + sineWave(frame, 0.2) * 0.15} />

          {/* Smoke rising from oven */}
          <g opacity={0.5 + smokeRise * 0.15}>
            <ellipse cx={30 + smokeRise * 3} cy={-25 - (frame * 0.3 % 40)} rx={8} ry={5} fill={C.smoke} />
            <ellipse cx={25 + smokeRise2 * 4} cy={-45 - (frame * 0.25 % 35)} rx={10} ry={6} fill={C.smoke} opacity={0.7} />
            <ellipse cx={32 + smokeRise * 5} cy={-65 - (frame * 0.2 % 30)} rx={12} ry={7} fill={C.smoke} opacity={0.5} />
            <ellipse cx={28 + smokeRise2 * 6} cy={-90 - (frame * 0.18 % 25)} rx={14} ry={8} fill={C.smoke} opacity={0.3} />
            <ellipse cx={34 + smokeRise * 7} cy={-115 - (frame * 0.15 % 20)} rx={16} ry={9} fill={C.smoke} opacity={0.15} />
          </g>
        </g>
      </g>

      {/* === RIGHT SIDE BUILDINGS === */}

      {/* Building 4 - right of path */}
      <MudbrickBuilding x={width * 0.55} y={height * 0.54} w={170} h={125} />

      {/* Building 5 - far right */}
      <MudbrickBuilding x={width * 0.72} y={height * 0.50} w={140} h={100} />

      {/* Building 6 - lower right */}
      <MudbrickBuilding x={width * 0.60} y={height * 0.68} w={130} h={105} />

      {/* Awning on building 4 */}
      <g transform={`translate(${width * 0.55 - 5}, ${height * 0.54 + 25})`}>
        <line x1={0} y1={0} x2={0} y2={85} stroke={C.rack} strokeWidth={4} />
        <line x1={-65} y1={10} x2={-65} y2={95} stroke={C.rack} strokeWidth={4} />
        <path d={`M5,${2 + awningSway2} Q-30,${-6 + awningSway2 * 0.5} -70,${4 + awningSway2}`}
          fill="none" stroke={C.awningAlt} strokeWidth={12} opacity={0.85} />
        <path d={`M5,${22 + awningSway2 * 0.7} Q-30,${14 + awningSway2 * 0.3} -70,${24 + awningSway2 * 0.7}`}
          fill="none" stroke={C.awningAlt} strokeWidth={12} opacity={0.7} />
      </g>

      {/* === DRYING RACKS (near bakery) === */}
      <g transform={`translate(${width * 0.17}, ${height * 0.72})`}>
        {/* Rack frame */}
        <line x1={0} y1={0} x2={0} y2={60} stroke={C.rack} strokeWidth={4} />
        <line x1={80} y1={0} x2={80} y2={60} stroke={C.rack} strokeWidth={4} />
        <line x1={-3} y1={5} x2={83} y2={5} stroke={C.rack} strokeWidth={3} />
        <line x1={-3} y1={25} x2={83} y2={25} stroke={C.rack} strokeWidth={3} />
        <line x1={-3} y1={45} x2={83} y2={45} stroke={C.rack} strokeWidth={3} />
        {/* Fish/bread drying */}
        {[12, 28, 44, 60, 72].map((px, i) => (
          <g key={`dry-${i}`}>
            <ellipse cx={px} cy={12} rx={7} ry={3} fill={C.fish} stroke={C.outline} strokeWidth={0.8} opacity={0.8} />
            <ellipse cx={px + 5} cy={32} rx={6} ry={3} fill={C.fish} stroke={C.outline} strokeWidth={0.8} opacity={0.7} />
          </g>
        ))}
      </g>

      {/* === CLAY POTS AND JARS === */}

      {/* Pots near building 1 */}
      <g transform={`translate(${width * 0.05 + 165}, ${height * 0.52 + 70})`}>
        <ClayPot x={0} y={0} size={1} />
        <ClayPot x={22} y={5} size={0.8} />
        <ClayPot x={10} y={-20} size={0.7} />
      </g>

      {/* Pots near building 5 */}
      <g transform={`translate(${width * 0.72 - 40}, ${height * 0.50 + 55})`}>
        <ClayPot x={0} y={0} size={1.1} />
        <ClayPot x={25} y={3} size={0.9} />
        <ClayJar x={-20} y={-5} size={1} />
        <ClayJar x={50} y={0} size={0.8} />
      </g>

      {/* Pots near bakery */}
      <g transform={`translate(${width * 0.24 - 30}, ${height * 0.62 + 70})`}>
        <ClayJar x={0} y={0} size={0.9} />
        <ClayJar x={20} y={5} size={0.7} />
      </g>

      {/* === WELL (center of village) === */}
      <g transform={`translate(${width * 0.44}, ${height * 0.72})`}>
        {/* Well base - circular stone */}
        <ellipse cx={0} cy={30} rx={35} ry={12} fill={C.sandDark} opacity={0.3} />
        <ellipse cx={0} cy={0} rx={28} ry={10} fill={C.well} stroke={C.outline} strokeWidth={2} />
        <ellipse cx={0} cy={-6} rx={28} ry={10} fill={C.well} stroke={C.outline} strokeWidth={2} />
        <rect x={-28} y={-6} width={56} height={6} fill={C.well} />
        <line x1={-28} y1={-6} x2={-28} y2={0} stroke={C.outline} strokeWidth={2} />
        <line x1={28} y1={-6} x2={28} y2={0} stroke={C.outline} strokeWidth={2} />
        {/* Water inside */}
        <ellipse cx={0} cy={-2} rx={22} ry={7} fill={C.wellWater} opacity={0.7} />
        {/* Well posts and crossbar */}
        <line x1={-20} y1={-6} x2={-20} y2={-55} stroke={C.rack} strokeWidth={5} />
        <line x1={20} y1={-6} x2={20} y2={-55} stroke={C.rack} strokeWidth={5} />
        <line x1={-24} y1={-55} x2={24} y2={-55} stroke={C.rack} strokeWidth={4} />
        {/* Rope and bucket */}
        <line x1={0} y1={-55} x2={0} y2={-25} stroke={C.outline} strokeWidth={1.5} opacity={0.6} />
        <path d="M-6,-25 L-6,-18 L6,-18 L6,-25 Z" fill={C.pot} stroke={C.outline} strokeWidth={1} />
      </g>

      {/* Animated crowd workers (village life) */}
      <CrowdLayer config={CROWD_CONFIGS.workersVillage} />

      {/* === STONE TABLET BOARD === */}
      <g transform={`translate(${width / 2 - 200}, ${height * 0.82})`}>
        <rect x={-8} y={-8} width={416} height={146} rx={4} fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        <rect x={0} y={0} width={400} height={130} fill={C.boardBg} />
        {/* Hieroglyphic decorations */}
        <text x={25} y={22} fontSize={14} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">
          {'𓀀 𓂀 𓃀 𓄀'}
        </text>
        <text x={25} y={118} fontSize={14} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">
          {'𓅀 𓆀 𓇀 𓈀'}
        </text>
        {boardText && (
          <text x={200} y={75} textAnchor="middle" fill={C.chalk}
            fontSize={34} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        )}
      </g>

      {/* Heat shimmer overlay */}
      <rect x={0} y={height * 0.48} width={width} height={height * 0.12}
        fill="rgba(255,200,100,0.04)" opacity={0.5 + sineWave(frame, 0.1) * 0.3} />
    </svg>
  );
};

/* --- Sub-components --- */

const MudbrickBuilding: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Shadow */}
    <rect x={6} y={6} width={w} height={h} fill={C.sandDark} opacity={0.25} rx={1} />
    {/* Main wall */}
    <rect x={0} y={0} width={w} height={h} fill={C.building} stroke={C.outline} strokeWidth={2} rx={1} />
    {/* Flat roof overhang */}
    <rect x={-4} y={-6} width={w + 8} height={8} fill={C.roofTop} stroke={C.outline} strokeWidth={1.5} />
    {/* Shade side */}
    <rect x={w * 0.6} y={0} width={w * 0.4} height={h} fill={C.buildingDark} opacity={0.25} />
    {/* Door */}
    <rect x={w * 0.15} y={h * 0.45} width={w * 0.22} height={h * 0.55}
      fill={C.doorway} stroke={C.outline} strokeWidth={1.5} rx={2} />
    {/* Window */}
    <rect x={w * 0.60} y={h * 0.20} width={w * 0.18} height={w * 0.15}
      fill={C.doorway} stroke={C.outline} strokeWidth={1.5} opacity={0.8} />
    {/* Brick line detail */}
    <line x1={0} y1={h * 0.33} x2={w} y2={h * 0.33} stroke={C.buildingDark} strokeWidth={0.8} opacity={0.3} />
    <line x1={0} y1={h * 0.66} x2={w * 0.15} y2={h * 0.66} stroke={C.buildingDark} strokeWidth={0.8} opacity={0.3} />
    <line x1={w * 0.37} y1={h * 0.66} x2={w} y2={h * 0.66} stroke={C.buildingDark} strokeWidth={0.8} opacity={0.3} />
  </g>
);

const ClayPot: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`}>
    <path d="M-8,0 Q-10,-12 -6,-18 Q0,-22 6,-18 Q10,-12 8,0 Z"
      fill={C.pot} stroke={C.outline} strokeWidth={1.5} />
    <ellipse cx={0} cy={0} rx={8} ry={3} fill={C.potDark} stroke={C.outline} strokeWidth={1} />
    <ellipse cx={0} cy={-18} rx={4} ry={2} fill={C.potDark} opacity={0.5} />
  </g>
);

const ClayJar: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`}>
    <path d="M-7,0 Q-9,-20 -5,-30 Q-3,-34 0,-35 Q3,-34 5,-30 Q9,-20 7,0 Z"
      fill={C.pot} stroke={C.outline} strokeWidth={1.5} />
    <ellipse cx={0} cy={0} rx={7} ry={3} fill={C.potDark} stroke={C.outline} strokeWidth={1} />
    {/* Narrow neck */}
    <ellipse cx={0} cy={-35} rx={3} ry={1.5} fill={C.potDark} opacity={0.5} />
    <rect x={-3} y={-37} width={6} height={4} fill={C.pot} stroke={C.outline} strokeWidth={1} rx={1} />
  </g>
);

export default WorkersVillage;
