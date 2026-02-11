import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { CrowdLayer, CROWD_CONFIGS } from '../crowds/CrowdWorkers';

interface SphinxViewProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  skyTop: '#1E3A8A',
  skyMid: '#4A6FB5',
  skyBottom: '#D4A012',
  sun: '#FFD700',
  sunGlow: 'rgba(255,200,50,0.3)',
  sand: '#D4A868',
  sandDark: '#C49858',
  sandLight: '#E4B878',
  stone: '#C4986A',
  stoneMid: '#B8906A',
  stoneDark: '#A07848',
  stoneLight: '#D4B08A',
  nemes: '#1E3A8A',
  nemesGold: '#D4A012',
  kohl: '#1A1A1A',
  pyramid: '#C4986A',
  pyramidShade: '#A07848',
  pyramidLine: '#B08858',
  outline: '#1A1A1A',
  boardBg: '#C4986A',
  boardFrame: '#8B6B4A',
  chalk: '#F5E8C8',
  hieroglyph: '#8B6B4A',
  ruins: '#B08050',
};

export const SphinxView: React.FC<SphinxViewProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const heatShimmer = sineWave(frame, 0.15) * 2;
  const heatShimmer2 = sineWave(frame, 0.12, 1.5) * 1.5;
  const sunPulse = 1 + sineWave(frame, 0.05) * 0.03;

  // Sand particle positions (deterministic based on frame)
  const sandParticles = Array.from({ length: 12 }, (_, i) => {
    const baseX = (i * 173 + 50) % width;
    const baseY = height * 0.6 + (i * 47) % (height * 0.3);
    const driftX = sineWave(frame, 0.08 + i * 0.01, i * 0.7) * 8;
    const driftY = sineWave(frame, 0.06 + i * 0.015, i * 1.2) * 4;
    return { x: baseX + driftX, y: baseY + driftY, r: 1 + (i % 3) * 0.5, o: 0.15 + (i % 4) * 0.05 };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient - afternoon warmth */}
        <linearGradient id="spx-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="40%" stopColor={C.skyMid} />
          <stop offset="85%" stopColor={C.skyBottom} />
          <stop offset="100%" stopColor={C.sand} />
        </linearGradient>

        {/* Sun glow */}
        <radialGradient id="spx-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,215,0,0.5)" />
          <stop offset="40%" stopColor="rgba(255,200,50,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Stone texture gradient for sphinx body */}
        <linearGradient id="spx-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.stoneLight} />
          <stop offset="50%" stopColor={C.stone} />
          <stop offset="100%" stopColor={C.stoneMid} />
        </linearGradient>

        {/* Nemes headdress stripe pattern */}
        <pattern id="spx-nemes-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
          <rect width="8" height="8" fill={C.nemes} />
          <rect width="4" height="8" fill={C.nemesGold} />
        </pattern>

        {/* Heat shimmer filter */}
        <filter id="spx-heat">
          <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="2" seed={Math.floor(frame / 3)} />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>

      {/* ========== SKY ========== */}
      <rect x={0} y={0} width={width} height={height * 0.65} fill="url(#spx-sky)" />

      {/* ========== SUN ========== */}
      <g transform={`translate(${width * 0.82}, ${height * 0.15}) scale(${sunPulse})`}>
        <circle cx={0} cy={0} r={90} fill="url(#spx-sun-glow)" />
        <circle cx={0} cy={0} r={45} fill={C.sun} />
        <circle cx={-10} cy={-10} r={14} fill="white" opacity={0.3} />
      </g>

      {/* ========== KHAFRE'S PYRAMID (behind sphinx, right side) ========== */}
      <g transform={`translate(${width * 0.72}, ${height * 0.56})`}>
        <path d="M0,-340 L-260,0 L260,0 Z" fill={C.pyramid} stroke={C.outline} strokeWidth={2} />
        {/* Shadow side */}
        <path d="M0,-340 L-60,0 L-260,0 Z" fill={C.pyramidShade} opacity={0.35} />
        {/* Stone block lines */}
        {[-260, -190, -130, -75, -30].map((y, i) => (
          <line key={`pbl-${i}`} x1={y * -0.72} y1={y} x2={y * 0.72} y2={y}
            stroke={C.pyramidLine} strokeWidth={1} opacity={0.25} />
        ))}
      </g>

      {/* ========== DESERT SAND GROUND ========== */}
      <rect x={0} y={height * 0.56} width={width} height={height * 0.44} fill={C.sand} />
      {/* Sand dunes */}
      <path d={`M0,${height * 0.6} Q${width * 0.2},${height * 0.56 + heatShimmer} ${width * 0.4},${height * 0.59}
        Q${width * 0.6},${height * 0.55 + heatShimmer2} ${width * 0.8},${height * 0.58}
        Q${width * 0.9},${height * 0.56} ${width},${height * 0.6}
        L${width},${height} L0,${height} Z`}
        fill={C.sandDark} opacity={0.35} />
      {/* Lighter sand ridge */}
      <path d={`M0,${height * 0.63} Q${width * 0.3},${height * 0.6} ${width * 0.5},${height * 0.62}
        Q${width * 0.7},${height * 0.59} ${width},${height * 0.63}
        L${width},${height * 0.65} L0,${height * 0.65} Z`}
        fill={C.sandLight} opacity={0.25} />

      {/* ========== THE GREAT SPHINX (close-up, profile facing right) ========== */}
      <g transform={`translate(${width * 0.08}, ${height * 0.32})`}>

        {/* === LION BODY (lying down, paws forward) === */}
        {/* Main body mass */}
        <path d={`
          M 160,180
          Q 170,120 200,100
          L 380,90
          Q 430,85 450,95
          Q 470,110 460,150
          Q 455,180 450,200
          L 440,260
          Q 430,275 400,280
          L 140,280
          Q 120,275 120,260
          L 130,220
          Q 135,195 160,180
          Z`}
          fill="url(#spx-body-grad)" stroke={C.outline} strokeWidth={2} />

        {/* Body top contour - back ridge */}
        <path d="M 200,100 Q 280,85 360,88 Q 420,86 450,95"
          fill="none" stroke={C.stoneDark} strokeWidth={1.5} opacity={0.4} />

        {/* Haunches (rear, slightly raised) */}
        <path d={`
          M 400,280
          Q 430,270 450,240
          Q 465,200 460,150
          Q 458,130 450,115
          L 455,120
          Q 475,150 475,200
          Q 470,260 450,285
          Q 435,295 410,290
          Z`}
          fill={C.stoneMid} stroke={C.outline} strokeWidth={1.5} />

        {/* Rear legs tucked under */}
        <path d="M 410,280 Q 420,300 415,320 Q 410,330 395,330 L 385,320 Q 390,300 400,280"
          fill={C.stone} stroke={C.outline} strokeWidth={1.5} />
        <path d="M 440,275 Q 450,295 445,315 Q 440,325 425,325 L 415,315 Q 420,295 430,275"
          fill={C.stoneMid} stroke={C.outline} strokeWidth={1.5} />

        {/* Front paws extended forward */}
        {/* Left paw (further) */}
        <path d={`
          M 130,260
          L 40,275
          Q 20,278 15,285
          Q 10,295 20,300
          L 80,305
          Q 100,303 120,295
          L 140,280
          Z`}
          fill={C.stoneMid} stroke={C.outline} strokeWidth={1.5} />
        {/* Right paw (closer, overlapping) */}
        <path d={`
          M 145,250
          L 50,265
          Q 25,268 18,275
          Q 12,285 22,292
          L 85,296
          Q 110,294 135,285
          L 150,270
          Z`}
          fill={C.stone} stroke={C.outline} strokeWidth={2} />

        {/* Paw digit lines */}
        <line x1={45} y1={270} x2={42} y2={288} stroke={C.stoneDark} strokeWidth={1} opacity={0.3} />
        <line x1={65} y1={268} x2={62} y2={290} stroke={C.stoneDark} strokeWidth={1} opacity={0.3} />
        <line x1={85} y1={267} x2={83} y2={292} stroke={C.stoneDark} strokeWidth={1} opacity={0.3} />

        {/* Weathered stone texture lines on body */}
        <line x1={200} y1={130} x2={250} y2={135} stroke={C.stoneDark} strokeWidth={0.8} opacity={0.2} />
        <line x1={280} y1={120} x2={340} y2={118} stroke={C.stoneDark} strokeWidth={0.8} opacity={0.2} />
        <line x1={220} y1={170} x2={310} y2={168} stroke={C.stoneDark} strokeWidth={0.6} opacity={0.15} />
        <line x1={300} y1={200} x2={380} y2={195} stroke={C.stoneDark} strokeWidth={0.6} opacity={0.15} />
        <line x1={180} y1={240} x2={260} y2={242} stroke={C.stoneDark} strokeWidth={0.8} opacity={0.2} />
        <line x1={320} y1={230} x2={400} y2={235} stroke={C.stoneDark} strokeWidth={0.6} opacity={0.15} />
        {/* Crack details */}
        <path d="M 350,140 L 355,160 L 348,175" fill="none" stroke={C.stoneDark} strokeWidth={0.7} opacity={0.25} />
        <path d="M 230,200 L 238,215 L 232,230" fill="none" stroke={C.stoneDark} strokeWidth={0.7} opacity={0.2} />

        {/* === CHEST / FRONT TORSO === */}
        <path d={`
          M 160,180
          Q 150,160 155,140
          Q 160,115 175,105
          L 200,100
          Q 185,110 175,130
          Q 165,155 160,180
          Z`}
          fill={C.stoneMid} stroke={C.outline} strokeWidth={1.5} />

        {/* === NECK === */}
        <path d={`
          M 175,105
          Q 165,80 160,60
          Q 158,45 165,30
          L 195,15
          Q 210,20 215,40
          Q 218,55 215,80
          L 200,100
          Z`}
          fill={C.stone} stroke={C.outline} strokeWidth={2} />

        {/* === HEAD (profile facing right) === */}
        {/* Nemes headdress - back drape */}
        <path d={`
          M 115,-45
          Q 110,-20 115,10
          Q 118,30 125,50
          L 140,80
          Q 148,95 165,105
          L 175,105
          Q 160,85 150,60
          Q 140,30 138,0
          Q 135,-30 140,-50
          Z`}
          fill="url(#spx-nemes-stripes)" stroke={C.outline} strokeWidth={1.5} />

        {/* Nemes headdress - top */}
        <path d={`
          M 130,-70
          Q 145,-80 165,-82
          Q 185,-80 200,-72
          Q 210,-65 215,-55
          L 212,-40
          Q 200,-50 185,-55
          Q 165,-58 145,-55
          L 135,-50
          Z`}
          fill={C.nemes} stroke={C.outline} strokeWidth={2} />

        {/* Nemes side panel (lappet) hanging down */}
        <path d={`
          M 195,-50
          Q 205,-45 210,-35
          Q 215,-20 218,5
          Q 220,30 218,55
          Q 215,70 210,80
          L 205,85
          Q 208,65 210,45
          Q 212,20 210,0
          Q 208,-20 200,-40
          Z`}
          fill="url(#spx-nemes-stripes)" stroke={C.outline} strokeWidth={1.5} />

        {/* Gold nemes band across forehead */}
        <path d="M 135,-52 Q 165,-60 195,-52 Q 208,-47 215,-40"
          fill="none" stroke={C.nemesGold} strokeWidth={4} />
        <path d="M 135,-52 Q 165,-60 195,-52 Q 208,-47 215,-40"
          fill="none" stroke={C.outline} strokeWidth={1} opacity={0.3} />

        {/* Face shape */}
        <path d={`
          M 155,-45
          Q 160,-50 170,-52
          Q 185,-52 195,-45
          Q 205,-38 210,-25
          Q 215,-10 215,5
          L 210,20
          Q 205,32 195,38
          Q 185,42 178,40
          L 170,35
          Q 165,30 162,20
          Q 158,10 155,0
          Q 152,-15 153,-30
          Q 154,-40 155,-45
          Z`}
          fill={C.stoneLight} stroke={C.outline} strokeWidth={2} />

        {/* Chin / jaw line */}
        <path d="M 178,40 Q 185,45 195,38" fill="none" stroke={C.stoneDark} strokeWidth={1} opacity={0.4} />

        {/* Flat nose area (missing nose - historically accurate) */}
        <path d={`
          M 205,-15
          L 210,-8
          L 210,5
          L 205,10
          L 200,5
          L 200,-10
          Z`}
          fill={C.stoneMid} stroke={C.stoneDark} strokeWidth={1.5} />
        {/* Erosion marks where nose was */}
        <line x1={203} y1={-8} x2={207} y2={-5} stroke={C.stoneDark} strokeWidth={0.7} opacity={0.4} />
        <line x1={202} y1={0} x2={208} y2={2} stroke={C.stoneDark} strokeWidth={0.7} opacity={0.3} />

        {/* Eye - kohl-lined, iconic */}
        <g transform="translate(185, -28)">
          {/* Kohl outline */}
          <path d="M -10,0 Q -5,-8 5,-8 Q 12,-6 15,-2 Q 12,4 5,6 Q -5,5 -10,0 Z"
            fill="white" stroke={C.kohl} strokeWidth={2} />
          {/* Extended kohl line (Egyptian style) */}
          <line x1={15} y1={-2} x2={25} y2={-5} stroke={C.kohl} strokeWidth={2} />
          {/* Iris */}
          <circle cx={4} cy={-1} r={4} fill="#4A3520" />
          {/* Pupil */}
          <circle cx={5} cy={-1} r={2} fill={C.kohl} />
          {/* Eye highlight */}
          <circle cx={3} cy={-3} r={1} fill="white" opacity={0.6} />
          {/* Lower kohl line */}
          <path d="M -8,2 Q 0,7 12,4" fill="none" stroke={C.kohl} strokeWidth={1.5} opacity={0.6} />
        </g>

        {/* Eyebrow */}
        <path d="M 172,-38 Q 185,-44 205,-38" fill="none" stroke={C.stoneDark} strokeWidth={2} opacity={0.5} />

        {/* Mouth - serene, slight smile */}
        <path d="M 192,18 Q 200,22 208,20" fill="none" stroke={C.stoneDark} strokeWidth={2} />
        {/* Upper lip line */}
        <path d="M 192,16 Q 198,14 204,16 Q 208,17 210,18" fill="none" stroke={C.stoneDark} strokeWidth={1} opacity={0.4} />

        {/* Ear (visible in profile, partly behind nemes) */}
        <ellipse cx={152} cy={-15} rx={5} ry={12} fill={C.stoneLight} stroke={C.outline} strokeWidth={1.5} />

        {/* Uraeus (cobra) on forehead */}
        <g transform="translate(195, -58)">
          <path d="M 0,0 Q 2,-12 0,-18 Q -2,-22 -5,-20 Q -7,-16 -4,-12 Q -1,-8 0,0"
            fill={C.nemesGold} stroke={C.outline} strokeWidth={1} />
          {/* Cobra hood */}
          <ellipse cx={-3} cy={-20} rx={4} ry={3} fill={C.nemesGold} stroke={C.outline} strokeWidth={1} />
          <circle cx={-4} cy={-21} r={1} fill={C.kohl} />
        </g>

        {/* Weathering on face */}
        <path d="M 170,-10 L 175,-5" fill="none" stroke={C.stoneDark} strokeWidth={0.5} opacity={0.3} />
        <path d="M 190,10 L 195,15" fill="none" stroke={C.stoneDark} strokeWidth={0.5} opacity={0.25} />

        {/* Beard remnant (broken off but stub visible) */}
        <path d={`
          M 185,42
          Q 188,52 186,60
          Q 184,65 180,62
          Q 178,55 180,45
          Z`}
          fill={C.stoneMid} stroke={C.outline} strokeWidth={1} opacity={0.6} />
      </g>

      {/* ========== SCATTERED STONE RUINS / BLOCKS ========== */}
      {/* Blocks near sphinx base */}
      <rect x={width * 0.06} y={height * 0.68} width={30} height={20} rx={2}
        fill={C.ruins} stroke={C.outline} strokeWidth={1} opacity={0.6}
        transform={`rotate(-5, ${width * 0.06}, ${height * 0.68})`} />
      <rect x={width * 0.18} y={height * 0.7} width={25} height={18} rx={2}
        fill={C.stoneMid} stroke={C.outline} strokeWidth={1} opacity={0.5}
        transform={`rotate(8, ${width * 0.18}, ${height * 0.7})`} />
      <rect x={width * 0.35} y={height * 0.66} width={35} height={22} rx={2}
        fill={C.ruins} stroke={C.outline} strokeWidth={1} opacity={0.55}
        transform={`rotate(-3, ${width * 0.35}, ${height * 0.66})`} />
      {/* Distant small blocks */}
      <rect x={width * 0.55} y={height * 0.62} width={20} height={14} rx={1}
        fill={C.stoneMid} stroke={C.outline} strokeWidth={1} opacity={0.4} />
      <rect x={width * 0.6} y={height * 0.63} width={16} height={12} rx={1}
        fill={C.ruins} stroke={C.outline} strokeWidth={1} opacity={0.35}
        transform={`rotate(12, ${width * 0.6}, ${height * 0.63})`} />
      <rect x={width * 0.48} y={height * 0.67} width={22} height={15} rx={2}
        fill={C.stone} stroke={C.outline} strokeWidth={1} opacity={0.45}
        transform={`rotate(-7, ${width * 0.48}, ${height * 0.67})`} />

      {/* Animated crowd figures near sphinx */}
      <CrowdLayer config={CROWD_CONFIGS.sphinxView} />

      {/* ========== HEAT SHIMMER EFFECT ========== */}
      <rect x={0} y={height * 0.5} width={width} height={height * 0.12}
        fill="rgba(255,200,100,0.04)"
        opacity={0.5 + sineWave(frame, 0.1) * 0.3}
        filter="url(#spx-heat)" />
      {/* Secondary shimmer band */}
      <rect x={0} y={height * 0.55} width={width} height={height * 0.06}
        fill="rgba(255,220,130,0.03)"
        opacity={0.3 + sineWave(frame, 0.13, 1.0) * 0.2} />

      {/* ========== SAND PARTICLES (animated) ========== */}
      {sandParticles.map((p, i) => (
        <circle key={`sp-${i}`} cx={p.x} cy={p.y} r={p.r}
          fill={C.sandLight} opacity={p.o} />
      ))}

      {/* ========== STONE TABLET BOARD ========== */}
      <g transform={`translate(${width * 0.62}, ${height * 0.72})`}>
        {/* Outer frame */}
        <rect x={-8} y={-8} width={416} height={176} rx={4}
          fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        {/* Inner stone surface */}
        <rect x={0} y={0} width={400} height={160} fill={C.boardBg} />
        {/* Carved border decoration */}
        <rect x={4} y={4} width={392} height={152} rx={2}
          fill="none" stroke={C.boardFrame} strokeWidth={1.5} opacity={0.5} />
        {/* Hieroglyphic decorations */}
        <text x={30} y={28} fontSize={16} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">
          𓀀 𓂀 𓃀 𓄀
        </text>
        <text x={30} y={145} fontSize={16} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">
          𓅀 𓆀 𓇀 𓈀
        </text>
        {/* Board text */}
        {boardText && (
          <text x={200} y={95} textAnchor="middle" fill={C.chalk}
            fontSize={36} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        )}
      </g>
    </svg>
  );
};

export default SphinxView;
