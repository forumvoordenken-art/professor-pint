import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

interface ClassroomProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  wall: '#F5F0E1',
  wallShadow: '#E8E0D0',
  floor: '#C4A882',
  floorDark: '#A89070',
  board: '#2A5A3A',
  boardDark: '#1E4A2E',
  boardFrame: '#8B6B4A',
  boardFrameDark: '#6B4B2A',
  chalk: '#F0F0E0',
  chalkDust: 'rgba(240,240,220,0.3)',
  desk: '#A0784A',
  deskDark: '#886838',
  deskTop: '#B8905A',
  window: '#B8D8F0',
  windowFrame: '#E0D8C8',
  windowFrameDark: '#C0B8A0',
  curtain: '#8B2020',
  curtainDark: '#6B1010',
  light: '#FFFDE8',
  lightFixture: '#C0C0C0',
  trim: '#D8D0C0',
  bookRed: '#A02020',
  bookBlue: '#2040A0',
  bookGreen: '#206020',
  bookYellow: '#C0A020',
  outline: '#1A1A1A',
  clock: '#F8F0E0',
  clockFrame: '#6B4B2A',
};

export const Classroom: React.FC<ClassroomProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const clockSecond = (frame / 30) % 60;
  const clockAngle = clockSecond * 6; // 360/60 = 6 degrees per second
  const lightFlicker = 1 + sineWave(frame, 0.08) * 0.02;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient id="cls-floor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.floor} />
          <stop offset="100%" stopColor={C.floorDark} />
        </linearGradient>
        <radialGradient id="cls-light" cx="50%" cy="20%" r="65%">
          <stop offset="0%" stopColor="rgba(255,253,232,0.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="cls-board" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.board} />
          <stop offset="100%" stopColor={C.boardDark} />
        </linearGradient>
      </defs>

      {/* === BACK WALL === */}
      <rect x={0} y={0} width={width} height={height * 0.75} fill={C.wall} />
      {/* Wainscoting (lower wall panel) */}
      <rect x={0} y={height * 0.55} width={width} height={height * 0.20} fill={C.wallShadow} />
      <rect x={0} y={height * 0.55} width={width} height={3} fill={C.trim} />
      <rect x={0} y={height * 0.73} width={width} height={4} fill={C.trim} />
      {/* Ambient lighting */}
      <rect x={0} y={0} width={width} height={height} fill="url(#cls-light)" opacity={lightFlicker} />

      {/* === CHALKBOARD (center) === */}
      <g transform={`translate(${width / 2 - 350}, 60)`}>
        {/* Frame */}
        <rect x={-16} y={-16} width={732} height={332} rx={4} fill={C.boardFrameDark} stroke={C.outline} strokeWidth={2} />
        <rect x={-10} y={-10} width={720} height={320} rx={3} fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        {/* Board surface */}
        <rect x={0} y={0} width={700} height={300} fill="url(#cls-board)" />
        {/* Chalk dust texture */}
        <rect x={20} y={20} width={660} height={260} fill={C.chalkDust} opacity={0.08} />
        {/* Chalk tray */}
        <rect x={-8} y={300} width={716} height={18} rx={3} fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        {/* Chalk pieces on tray */}
        <rect x={40} y={304} width={35} height={7} rx={3} fill={C.chalk} opacity={0.8} />
        <rect x={90} y={305} width={25} height={6} rx={3} fill="#FFD700" opacity={0.6} />
        <rect x={130} y={304} width={30} height={7} rx={3} fill="#FF8888" opacity={0.6} />
        {/* Eraser */}
        <rect x={620} y={302} width={50} height={12} rx={2} fill="#888" stroke={C.outline} strokeWidth={1} />
        <rect x={622} y={304} width={46} height={4} rx={1} fill="#666" />
        {/* Board text */}
        {boardText && (
          <text x={350} y={165} textAnchor="middle" fill={C.chalk}
            fontSize={48} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        )}
      </g>

      {/* === WINDOWS (left) === */}
      <ClassroomWindow x={80} y={80} w={200} h={280} />

      {/* === WINDOWS (right) === */}
      <ClassroomWindow x={width - 280} y={80} w={200} h={280} />

      {/* === CLOCK (above board, right) === */}
      <g transform={`translate(${width / 2 + 420}, 100)`}>
        <circle cx={0} cy={0} r={32} fill={C.clock} stroke={C.clockFrame} strokeWidth={4} />
        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = Math.cos(angle) * 24;
          const y1 = Math.sin(angle) * 24;
          const x2 = Math.cos(angle) * 28;
          const y2 = Math.sin(angle) * 28;
          return <line key={`h-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.outline} strokeWidth={2} />;
        })}
        {/* Minute hand (fixed at 10:10 for aesthetics) */}
        <line x1={0} y1={0} x2={-10} y2={-18} stroke={C.outline} strokeWidth={2.5} strokeLinecap="round" />
        {/* Hour hand */}
        <line x1={0} y1={0} x2={12} y2={-8} stroke={C.outline} strokeWidth={3} strokeLinecap="round" />
        {/* Second hand - animated */}
        <line x1={0} y1={0}
          x2={Math.cos((clockAngle - 90) * Math.PI / 180) * 22}
          y2={Math.sin((clockAngle - 90) * Math.PI / 180) * 22}
          stroke="#CC0000" strokeWidth={1} strokeLinecap="round" />
        <circle cx={0} cy={0} r={3} fill={C.outline} />
      </g>

      {/* === FLOOR === */}
      <rect x={0} y={height * 0.75} width={width} height={height * 0.25} fill="url(#cls-floor)" />
      {/* Floor tile pattern */}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`ftv-${i}`} x1={i * 210 + 30} y1={height * 0.75} x2={i * 210 + 30} y2={height}
          stroke={C.floorDark} strokeWidth={1.5} opacity={0.2} />
      ))}
      {[0.85, 0.95].map((r, i) => (
        <line key={`fth-${i}`} x1={0} y1={height * r} x2={width} y2={height * r}
          stroke={C.floorDark} strokeWidth={1} opacity={0.15} />
      ))}

      {/* === TEACHER'S DESK (front center) === */}
      <g transform={`translate(${width / 2 - 200}, ${height * 0.60})`}>
        {/* Desk front */}
        <rect x={0} y={30} width={400} height={100} rx={4} fill={C.desk} stroke={C.outline} strokeWidth={2.5} />
        <rect x={10} y={40} width={180} height={80} rx={3} fill={C.deskDark} stroke={C.outline} strokeWidth={1.5} opacity={0.4} />
        <rect x={210} y={40} width={180} height={80} rx={3} fill={C.deskDark} stroke={C.outline} strokeWidth={1.5} opacity={0.4} />
        {/* Desk top surface */}
        <rect x={-10} y={20} width={420} height={16} rx={3} fill={C.deskTop} stroke={C.outline} strokeWidth={2.5} />
        <rect x={0} y={22} width={400} height={6} rx={2} fill="rgba(255,255,255,0.06)" />
        {/* Desk legs */}
        <rect x={10} y={125} width={12} height={45} fill={C.desk} stroke={C.outline} strokeWidth={1.5} />
        <rect x={378} y={125} width={12} height={45} fill={C.desk} stroke={C.outline} strokeWidth={1.5} />

        {/* Items on desk */}
        {/* Book stack */}
        <rect x={320} y={8} width={50} height={8} rx={1} fill={C.bookRed} stroke={C.outline} strokeWidth={1} />
        <rect x={322} y={1} width={46} height={8} rx={1} fill={C.bookBlue} stroke={C.outline} strokeWidth={1} />
        <rect x={324} y={-5} width={42} height={7} rx={1} fill={C.bookGreen} stroke={C.outline} strokeWidth={1} />
        {/* Apple (classic teacher's desk) */}
        <circle cx={355} cy={-14} r={8} fill="#CC3333" stroke={C.outline} strokeWidth={1.5} />
        <path d="M355,-22 Q358,-28 360,-24" fill="#2D5016" stroke={C.outline} strokeWidth={1} />
        <circle cx={352} cy={-17} r={2} fill="rgba(255,255,255,0.25)" />
      </g>

      {/* === FLUORESCENT LIGHTS === */}
      <FluorescentLight x={width * 0.25} y={0} w={200} />
      <FluorescentLight x={width * 0.75} y={0} w={200} />

      {/* === BOOKSHELF (far left wall) === */}
      <g transform="translate(20, 400)">
        <rect x={0} y={0} width={45} height={170} fill={C.desk} stroke={C.outline} strokeWidth={2} />
        {/* Shelves */}
        <rect x={-2} y={0} width={49} height={4} fill={C.deskTop} />
        <rect x={-2} y={55} width={49} height={4} fill={C.deskTop} />
        <rect x={-2} y={110} width={49} height={4} fill={C.deskTop} />
        <rect x={-2} y={166} width={49} height={4} fill={C.deskTop} />
        {/* Books */}
        <rect x={5} y={8} width={8} height={44} rx={1} fill={C.bookRed} />
        <rect x={15} y={12} width={7} height={40} rx={1} fill={C.bookBlue} />
        <rect x={24} y={10} width={8} height={42} rx={1} fill={C.bookYellow} />
        <rect x={34} y={14} width={6} height={38} rx={1} fill={C.bookGreen} />
        <rect x={5} y={63} width={7} height={44} rx={1} fill={C.bookBlue} />
        <rect x={14} y={65} width={8} height={42} rx={1} fill={C.bookGreen} />
        <rect x={24} y={60} width={7} height={47} rx={1} fill={C.bookRed} />
      </g>
    </svg>
  );
};

// ---- Window component ----
const ClassroomWindow: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Window recess shadow */}
    <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={3} fill="rgba(0,0,0,0.08)" />
    {/* Frame */}
    <rect x={-4} y={-4} width={w + 8} height={h + 8} rx={2} fill={C.windowFrame} stroke={C.outline} strokeWidth={2} />
    {/* Sky / glass */}
    <rect x={0} y={0} width={w} height={h} fill={C.window} />
    {/* Window divider (cross) */}
    <line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke={C.windowFrameDark} strokeWidth={4} />
    <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke={C.windowFrameDark} strokeWidth={4} />
    {/* Sky gradient - lighter at top */}
    <rect x={0} y={0} width={w} height={h * 0.5} fill="rgba(255,255,255,0.15)" />
    {/* Simple cloud hint */}
    <ellipse cx={w * 0.3} cy={h * 0.25} rx={30} ry={12} fill="rgba(255,255,255,0.4)" />
    <ellipse cx={w * 0.7} cy={h * 0.35} rx={22} ry={9} fill="rgba(255,255,255,0.3)" />
    {/* Curtain - left */}
    <path
      d={`M-2,0 Q${-15},${h * 0.3} -8,${h} L-2,${h} Z`}
      fill={C.curtain} stroke={C.outline} strokeWidth={1.5} opacity={0.85}
    />
    <path d={`M-5,20 Q-12,${h * 0.4} -7,${h * 0.6}`} fill="none" stroke={C.curtainDark} strokeWidth={1} opacity={0.3} />
    {/* Curtain - right */}
    <path
      d={`M${w + 2},0 Q${w + 15},${h * 0.3} ${w + 8},${h} L${w + 2},${h} Z`}
      fill={C.curtain} stroke={C.outline} strokeWidth={1.5} opacity={0.85}
    />
    {/* Sill */}
    <rect x={-8} y={h + 2} width={w + 16} height={10} rx={2} fill={C.windowFrame} stroke={C.outline} strokeWidth={1.5} />
  </g>
);

// ---- Fluorescent light fixture ----
const FluorescentLight: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g transform={`translate(${x - w / 2}, ${y})`}>
    <rect x={0} y={0} width={w} height={12} rx={3} fill={C.lightFixture} stroke={C.outline} strokeWidth={1.5} />
    <rect x={10} y={10} width={w - 20} height={6} rx={2} fill={C.light} opacity={0.9} />
    {/* Light glow */}
    <ellipse cx={w / 2} cy={20} rx={w * 0.6} ry={30} fill="rgba(255,253,232,0.06)" />
  </g>
);

export default Classroom;
