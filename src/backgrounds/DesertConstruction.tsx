import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { CrowdLayer, CROWD_CONFIGS } from '../crowds/CrowdWorkers';

interface DesertConstructionProps {
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
  wood: '#8B5E3C',
  woodLight: '#A0703C',
  woodDark: '#6B4226',
  rope: '#9B8968',
  tent: '#C8A878',
  tentDark: '#A08858',
  palm: '#2D5016',
  palmTrunk: '#8B6B4A',
  outline: '#1A1A1A',
  hieroglyph: '#8B6B4A',
  boardBg: '#C4986A',
  boardFrame: '#8B6B4A',
  chalk: '#F5E8C8',
};

export const DesertConstruction: React.FC<DesertConstructionProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const heatShimmer = sineWave(frame, 0.15) * 2;
  const sunPulse = 1 + sineWave(frame, 0.05) * 0.03;
  const ropeSway1 = sineWave(frame, 0.12) * 3;
  const ropeSway2 = sineWave(frame, 0.1, 1) * 2;

  // Pyramid geometry (center, half-built)
  const pyrX = width * 0.5;
  const pyrBaseY = height * 0.58;
  const pyrHalfW = 240;
  const pyrFullH = 320;
  const pyrBuiltH = pyrFullH * 0.55; // bottom 55% is built
  const pyrBuiltTopY = pyrBaseY - pyrBuiltH;
  // Width at built height
  const builtTopHalfW = pyrHalfW * (1 - pyrBuiltH / pyrFullH);

  // Ramp geometry (goes up left side of pyramid)
  const rampBaseX = pyrX - pyrHalfW - 80;
  const rampBaseY = pyrBaseY;
  const rampTopX = pyrX - builtTopHalfW - 10;
  const rampTopY = pyrBuiltTopY + 10;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        <linearGradient id="dc-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="80%" stopColor={C.skyBottom} />
          <stop offset="100%" stopColor={C.sand} />
        </linearGradient>
        <radialGradient id="dc-sun-glow" cx="50%" cy="30%" r="40%">
          <stop offset="0%" stopColor={C.sunGlow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect x={0} y={0} width={width} height={height * 0.65} fill="url(#dc-sky)" />
      <rect x={0} y={0} width={width} height={height} fill="url(#dc-sun-glow)" />

      {/* Sun */}
      <g transform={`translate(${width * 0.78}, ${height * 0.16}) scale(${sunPulse})`}>
        <circle cx={0} cy={0} r={60} fill={C.sunGlow} opacity={0.4} />
        <circle cx={0} cy={0} r={40} fill={C.sun} />
        <circle cx={-8} cy={-8} r={12} fill="white" opacity={0.3} />
      </g>

      {/* Stars (faint, it's dusk) */}
      {[
        [180, 70], [380, 35], [620, 95], [1050, 55], [1380, 85], [1680, 45],
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

      {/* Distant small pyramid (right, completed) */}
      <g transform={`translate(${width * 0.82}, ${height * 0.6})`}>
        <path d="M0,-120 L-100,0 L100,0 Z" fill={C.pyramid} stroke={C.outline} strokeWidth={2} />
        <path d="M0,-120 L25,0 L100,0 Z" fill={C.pyramidShade} opacity={0.4} />
      </g>

      {/* Half-built pyramid (center) */}
      <g>
        {/* Completed bottom section - solid stone blocks */}
        <path d={`M${pyrX - pyrHalfW},${pyrBaseY} L${pyrX - builtTopHalfW},${pyrBuiltTopY}
          L${pyrX + builtTopHalfW},${pyrBuiltTopY} L${pyrX + pyrHalfW},${pyrBaseY} Z`}
          fill={C.pyramid} stroke={C.outline} strokeWidth={2} />
        {/* Shade on right face */}
        <path d={`M${pyrX + 20},${pyrBaseY} L${pyrX + builtTopHalfW * 0.3},${pyrBuiltTopY}
          L${pyrX + builtTopHalfW},${pyrBuiltTopY} L${pyrX + pyrHalfW},${pyrBaseY} Z`}
          fill={C.pyramidShade} opacity={0.4} />

        {/* Stone block lines (horizontal courses) */}
        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((frac, i) => {
          const ly = pyrBaseY - pyrBuiltH * frac;
          const ratio = 1 - (pyrBuiltH * frac) / pyrFullH;
          const lhw = pyrHalfW * ratio;
          return (
            <line key={`block-${i}`} x1={pyrX - lhw} y1={ly} x2={pyrX + lhw} y2={ly}
              stroke={C.pyramidLine} strokeWidth={1} opacity={0.4} />
          );
        })}
        {/* Vertical block joints on bottom rows */}
        {[0, 0.15, 0.3, 0.45, 0.6, 0.75].map((frac, ri) => {
          const rowY = pyrBaseY - pyrBuiltH * frac;
          const nextY = pyrBaseY - pyrBuiltH * Math.min(frac + 0.15, 0.9);
          const ratio = 1 - (pyrBuiltH * frac) / pyrFullH;
          const lhw = pyrHalfW * ratio;
          const blockCount = Math.max(3, Math.round(8 * ratio));
          return Array.from({ length: blockCount }, (_, bi) => {
            const t = (bi + 0.5 + (ri % 2) * 0.5) / (blockCount + 1);
            const bx = pyrX - lhw + 2 * lhw * t;
            return (
              <line key={`vj-${ri}-${bi}`} x1={bx} y1={rowY} x2={bx} y2={nextY}
                stroke={C.pyramidLine} strokeWidth={0.6} opacity={0.2} />
            );
          });
        })}

        {/* Scaffolding / wooden framework on top (unfinished section) */}
        {/* Ghost outline of the full pyramid */}
        <path d={`M${pyrX - builtTopHalfW},${pyrBuiltTopY} L${pyrX},${pyrBaseY - pyrFullH}
          L${pyrX + builtTopHalfW},${pyrBuiltTopY}`}
          fill="none" stroke={C.wood} strokeWidth={1.5} strokeDasharray="8,6" opacity={0.5} />

        {/* Wooden scaffolding poles */}
        {[0.2, 0.4, 0.6, 0.8].map((frac, i) => {
          const scaffY = pyrBuiltTopY - (pyrFullH - pyrBuiltH) * frac * 0.7;
          const scaffRatio = 1 - (pyrBuiltH + (pyrFullH - pyrBuiltH) * frac * 0.7) / pyrFullH;
          const scaffHW = pyrHalfW * scaffRatio + 15;
          return (
            <g key={`scaff-${i}`}>
              {/* Horizontal beam */}
              <line x1={pyrX - scaffHW} y1={scaffY} x2={pyrX + scaffHW} y2={scaffY}
                stroke={C.wood} strokeWidth={3} strokeLinecap="round" />
              <line x1={pyrX - scaffHW} y1={scaffY} x2={pyrX + scaffHW} y2={scaffY}
                stroke={C.outline} strokeWidth={3} strokeLinecap="round" opacity={0.1} />
              {/* Vertical supports */}
              {[-0.6, 0, 0.6].map((sx, si) => (
                <line key={`sv-${i}-${si}`}
                  x1={pyrX + scaffHW * sx} y1={scaffY}
                  x2={pyrX + scaffHW * sx} y2={i === 0 ? pyrBuiltTopY : scaffY + 30}
                  stroke={C.wood} strokeWidth={2.5} strokeLinecap="round" />
              ))}
              {/* Cross braces */}
              {i > 0 && (
                <>
                  <line x1={pyrX - scaffHW * 0.6} y1={scaffY}
                    x2={pyrX} y2={scaffY + 28}
                    stroke={C.woodLight} strokeWidth={1.5} opacity={0.6} />
                  <line x1={pyrX + scaffHW * 0.6} y1={scaffY}
                    x2={pyrX} y2={scaffY + 28}
                    stroke={C.woodLight} strokeWidth={1.5} opacity={0.6} />
                </>
              )}
            </g>
          );
        })}
      </g>

      {/* Construction ramp going up the left side */}
      <g>
        {/* Ramp surface */}
        <path d={`M${rampBaseX},${rampBaseY}
          L${rampTopX},${rampTopY}
          L${rampTopX + 30},${rampTopY}
          L${rampBaseX + 50},${rampBaseY} Z`}
          fill={C.woodLight} stroke={C.outline} strokeWidth={2} />
        {/* Ramp side */}
        <path d={`M${rampBaseX},${rampBaseY}
          L${rampBaseX},${rampBaseY + 18}
          L${rampBaseX + 50},${rampBaseY + 18}
          L${rampBaseX + 50},${rampBaseY} Z`}
          fill={C.woodDark} stroke={C.outline} strokeWidth={1.5} />
        {/* Ramp cross-beams */}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const bx1 = rampBaseX + (rampTopX - rampBaseX) * t;
          const by1 = rampBaseY + (rampTopY - rampBaseY) * t;
          const bx2 = rampBaseX + 50 + (rampTopX + 30 - rampBaseX - 50) * t;
          const by2 = rampBaseY + (rampTopY - rampBaseY) * t;
          return (
            <line key={`rbeam-${i}`} x1={bx1} y1={by1} x2={bx2} y2={by2}
              stroke={C.wood} strokeWidth={2} />
          );
        })}
        {/* Ramp support posts */}
        {[0.25, 0.55, 0.8].map((t, i) => {
          const px = rampBaseX + 25 + (rampTopX + 15 - rampBaseX - 25) * t;
          const ptop = rampBaseY + (rampTopY - rampBaseY) * t;
          return (
            <line key={`rpost-${i}`} x1={px} y1={ptop} x2={px} y2={rampBaseY + 18}
              stroke={C.wood} strokeWidth={3} strokeLinecap="round" />
          );
        })}

        {/* Stone block being pulled up the ramp */}
        {(() => {
          const blockT = 0.45;
          const bx = rampBaseX + 15 + (rampTopX - rampBaseX) * blockT;
          const by = rampBaseY + (rampTopY - rampBaseY) * blockT - 14;
          return (
            <rect x={bx} y={by} width={28} height={18} rx={2}
              fill={C.stone} stroke={C.outline} strokeWidth={1.5}
              transform={`rotate(${Math.atan2(rampTopY - rampBaseY, rampTopX - rampBaseX) * 180 / Math.PI}, ${bx + 14}, ${by + 9})`} />
          );
        })()}
      </g>

      {/* Rope systems */}
      <g>
        {/* Rope from ramp top down to sled area */}
        <path d={`M${rampTopX + 15},${rampTopY}
          Q${rampTopX - 40},${rampTopY + 60 + ropeSway1} ${pyrX - 180},${pyrBaseY - 5}`}
          fill="none" stroke={C.rope} strokeWidth={2} strokeLinecap="round" />
        {/* Second rope line */}
        <path d={`M${rampTopX + 15},${rampTopY + 5}
          Q${rampTopX - 60},${rampTopY + 80 + ropeSway2} ${pyrX - 200},${pyrBaseY}`}
          fill="none" stroke={C.rope} strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
      </g>

      {/* Wooden sleds at the base with stone blocks */}
      {/* Sled 1 (left of pyramid) */}
      <g transform={`translate(${pyrX - 190}, ${pyrBaseY - 4})`}>
        {/* Sled runners */}
        <path d="M-5,12 Q0,18 10,18 L65,18 Q72,18 70,12" fill="none" stroke={C.wood} strokeWidth={3} strokeLinecap="round" />
        <path d="M-5,14 Q0,20 10,20 L65,20 Q72,20 70,14" fill="none" stroke={C.woodDark} strokeWidth={2} strokeLinecap="round" />
        {/* Sled platform */}
        <rect x={0} y={4} width={65} height={8} rx={1} fill={C.wood} stroke={C.outline} strokeWidth={1} />
        {/* Stone blocks on sled */}
        <rect x={5} y={-14} width={24} height={18} rx={2} fill={C.stone} stroke={C.outline} strokeWidth={1.5} />
        <rect x={32} y={-10} width={20} height={14} rx={2} fill={C.stoneDark} stroke={C.outline} strokeWidth={1.5} />
        {/* Rope attachment */}
        <line x1={-5} y1={8} x2={-20} y2={2 + ropeSway1 * 0.5} stroke={C.rope} strokeWidth={2} />
      </g>

      {/* Sled 2 (further left) */}
      <g transform={`translate(${pyrX - 320}, ${pyrBaseY + 8})`}>
        <path d="M-5,12 Q0,18 10,18 L55,18 Q62,18 60,12" fill="none" stroke={C.wood} strokeWidth={3} strokeLinecap="round" />
        <rect x={0} y={4} width={55} height={8} rx={1} fill={C.wood} stroke={C.outline} strokeWidth={1} />
        <rect x={8} y={-12} width={20} height={16} rx={2} fill={C.stone} stroke={C.outline} strokeWidth={1.5} />
        <rect x={30} y={-8} width={18} height={12} rx={2} fill={C.stoneDark} stroke={C.outline} strokeWidth={1.5} />
      </g>

      {/* Scattered stone blocks around the construction site */}
      {[
        { x: pyrX + 200, y: pyrBaseY + 6, w: 30, h: 20 },
        { x: pyrX + 250, y: pyrBaseY + 12, w: 24, h: 16 },
        { x: pyrX + 160, y: pyrBaseY + 18, w: 20, h: 14 },
        { x: pyrX - 100, y: pyrBaseY + 22, w: 26, h: 18 },
        { x: pyrX + 80, y: pyrBaseY + 10, w: 22, h: 15 },
        { x: pyrX - 50, y: pyrBaseY + 30, w: 18, h: 12 },
        { x: pyrX + 300, y: pyrBaseY + 20, w: 28, h: 18 },
      ].map((b, i) => (
        <rect key={`sblock-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} rx={2}
          fill={i % 2 === 0 ? C.stone : C.stoneDark} stroke={C.outline} strokeWidth={1.5} />
      ))}

      {/* Worker tents/shelters */}
      {/* Tent 1 (right side) */}
      <g transform={`translate(${width * 0.7}, ${height * 0.64})`}>
        <path d="M0,0 L25,-35 L50,0 Z" fill={C.tent} stroke={C.outline} strokeWidth={1.5} />
        <path d="M25,-35 L50,0 L40,0 Z" fill={C.tentDark} opacity={0.4} />
        {/* Tent pole */}
        <line x1={25} y1={-35} x2={25} y2={-42} stroke={C.wood} strokeWidth={2} strokeLinecap="round" />
        {/* Tent opening */}
        <path d="M18,0 L25,-15 L32,0" fill="none" stroke={C.outline} strokeWidth={1} opacity={0.4} />
      </g>

      {/* Tent 2 (right side, smaller) */}
      <g transform={`translate(${width * 0.74}, ${height * 0.66})`}>
        <path d="M0,0 L18,-25 L36,0 Z" fill={C.tentDark} stroke={C.outline} strokeWidth={1.5} />
        <path d="M18,-25 L36,0 L28,0 Z" fill={C.pyramidShade} opacity={0.3} />
        <line x1={18} y1={-25} x2={18} y2={-30} stroke={C.wood} strokeWidth={2} strokeLinecap="round" />
      </g>

      {/* Tent 3 (far left) */}
      <g transform={`translate(${width * 0.15}, ${height * 0.66})`}>
        <path d="M0,0 L20,-28 L40,0 Z" fill={C.tent} stroke={C.outline} strokeWidth={1.5} />
        <path d="M20,-28 L40,0 L32,0 Z" fill={C.tentDark} opacity={0.4} />
        <line x1={20} y1={-28} x2={20} y2={-34} stroke={C.wood} strokeWidth={2} strokeLinecap="round" />
      </g>

      {/* Palm trees */}
      <PalmTree x={width * 0.06} y={height * 0.6} h={130} lean={-4 + heatShimmer * 0.5} />
      <PalmTree x={width * 0.93} y={height * 0.58} h={140} lean={3 + heatShimmer * 0.3} />
      <PalmTree x={width * 0.1} y={height * 0.63} h={100} lean={-6 + heatShimmer * 0.4} />

      {/* Animated crowd workers */}
      <CrowdLayer config={CROWD_CONFIGS.desertConstruction} />

      {/* Stone tablet board for text */}
      <g transform={`translate(${width / 2 - 200}, ${height * 0.72})`}>
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

export default DesertConstruction;
