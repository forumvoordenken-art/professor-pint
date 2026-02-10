import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

interface InsidePyramidProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  ceilingDark: '#1A0E04',
  wallDark: '#2A1A0A',
  wall: '#3A2818',
  wallLight: '#4A3828',
  wallBlock: '#352414',
  floor: '#4A3828',
  floorSlab: '#3E2C18',
  floorLine: '#2A1A0A',
  hieroglyph: '#8B7B5A',
  torchWood: '#5C3218',
  torchBracket: '#6A6A6A',
  flameOuter: '#FF8C00',
  flameInner: '#FFD700',
  flameCore: '#FFFACD',
  glowOrange: 'rgba(255,160,50,0.15)',
  glowWarm: 'rgba(255,120,30,0.08)',
  sarcophagus: '#5A4A32',
  sarcophagusLight: '#6B5A42',
  sarcophagusDark: '#3A2A18',
  sarcophagusDetail: '#8B7B5A',
  doorway: '#0A0604',
  doorwayFrame: '#3A2818',
  shadow: 'rgba(0,0,0,0.6)',
  boardBg: '#4A3828',
  boardFrame: '#5A4832',
  chalk: '#E8D8B8',
  outline: '#1A1A1A',
};

export const InsidePyramid: React.FC<InsidePyramidProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // Torch flame animations
  const flame1 = sineWave(frame, 0.35);
  const flame2 = sineWave(frame, 0.45, 1.5);
  const flame3 = sineWave(frame, 0.55, 3.0);
  const flame4 = sineWave(frame, 0.4, 0.7);
  const glowPulse = 0.85 + sineWave(frame, 0.2) * 0.15;
  const glowPulse2 = 0.85 + sineWave(frame, 0.22, 1.0) * 0.15;

  const torchLX = width * 0.15;
  const torchRX = width * 0.85;
  const torchY = height * 0.35;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Torch glow gradients */}
        <radialGradient id="ip-glow-left" cx={torchLX / width} cy={torchY / height} r="0.35">
          <stop offset="0%" stopColor="rgba(255,160,50,0.18)" />
          <stop offset="40%" stopColor="rgba(255,120,30,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="ip-glow-right" cx={torchRX / width} cy={torchY / height} r="0.35">
          <stop offset="0%" stopColor="rgba(255,160,50,0.18)" />
          <stop offset="40%" stopColor="rgba(255,120,30,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="ip-ambient" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="rgba(255,140,40,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        {/* Vignette for dark corners */}
        <radialGradient id="ip-vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
        </radialGradient>
        {/* Floor gradient */}
        <linearGradient id="ip-floor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.floor} />
          <stop offset="100%" stopColor={C.wallDark} />
        </linearGradient>
      </defs>

      {/* === BASE FILL (very dark) === */}
      <rect x={0} y={0} width={width} height={height} fill={C.ceilingDark} />

      {/* === ANGLED CEILING (pyramid architecture) === */}
      <path
        d={`M0,0 L${width * 0.35},${height * 0.12} L${width * 0.65},${height * 0.12} L${width},0 Z`}
        fill={C.wallDark}
        stroke={C.outline}
        strokeWidth={2}
      />
      {/* Ceiling stone lines */}
      {[0.03, 0.06, 0.09].map((yf, i) => (
        <line
          key={`ceil-${i}`}
          x1={width * (0.05 + i * 0.1)}
          y1={height * yf}
          x2={width * (0.95 - i * 0.1)}
          y2={height * yf}
          stroke={C.wallBlock}
          strokeWidth={1}
          opacity={0.4}
        />
      ))}

      {/* === LEFT WALL === */}
      <path
        d={`M0,0 L${width * 0.35},${height * 0.12} L${width * 0.2},${height * 0.85} L0,${height} Z`}
        fill={C.wall}
        stroke={C.outline}
        strokeWidth={2}
      />

      {/* === RIGHT WALL === */}
      <path
        d={`M${width},0 L${width * 0.65},${height * 0.12} L${width * 0.8},${height * 0.85} L${width},${height} Z`}
        fill={C.wall}
        stroke={C.outline}
        strokeWidth={2}
      />

      {/* === BACK WALL === */}
      <rect
        x={width * 0.2}
        y={height * 0.12}
        width={width * 0.6}
        height={height * 0.73}
        fill={C.wallLight}
        stroke={C.outline}
        strokeWidth={2}
      />

      {/* === STONE BLOCK TEXTURES (back wall) === */}
      {/* Horizontal block lines */}
      {[0.2, 0.28, 0.36, 0.44, 0.52, 0.6, 0.68, 0.76].map((yf, i) => (
        <line
          key={`hbl-${i}`}
          x1={width * 0.2}
          y1={height * yf}
          x2={width * 0.8}
          y2={height * yf}
          stroke={C.wallBlock}
          strokeWidth={1.2}
          opacity={0.35}
        />
      ))}
      {/* Vertical block lines (staggered) */}
      {[0.28, 0.36, 0.44, 0.52, 0.6, 0.68, 0.76, 0.84].map((yf, row) => {
        const offset = row % 2 === 0 ? 0 : 0.05;
        return [0.28, 0.36, 0.44, 0.52, 0.6, 0.68, 0.72].map((xf, col) => (
          <line
            key={`vbl-${row}-${col}`}
            x1={width * (xf + offset)}
            y1={height * (yf - 0.08)}
            x2={width * (xf + offset)}
            y2={height * yf}
            stroke={C.wallBlock}
            strokeWidth={0.8}
            opacity={0.25}
          />
        ));
      })}

      {/* === STONE BLOCK TEXTURES (left wall) === */}
      {[0.25, 0.38, 0.5, 0.63, 0.75].map((yf, i) => (
        <line
          key={`lbl-${i}`}
          x1={width * (0.02 + i * 0.02)}
          y1={height * yf}
          x2={width * (0.22 + i * -0.002)}
          y2={height * yf}
          stroke={C.wallBlock}
          strokeWidth={1}
          opacity={0.3}
        />
      ))}

      {/* === STONE BLOCK TEXTURES (right wall) === */}
      {[0.25, 0.38, 0.5, 0.63, 0.75].map((yf, i) => (
        <line
          key={`rbl-${i}`}
          x1={width * (0.78 - i * -0.002)}
          y1={height * yf}
          x2={width * (0.98 - i * 0.02)}
          y2={height * yf}
          stroke={C.wallBlock}
          strokeWidth={1}
          opacity={0.3}
        />
      ))}

      {/* === FLOOR (stone slabs) === */}
      <path
        d={`M0,${height} L${width * 0.2},${height * 0.85} L${width * 0.8},${height * 0.85} L${width},${height} Z`}
        fill="url(#ip-floor-grad)"
        stroke={C.outline}
        strokeWidth={2}
      />
      {/* Floor slab lines (perspective) */}
      {[0.3, 0.4, 0.5, 0.6, 0.7].map((xf, i) => (
        <line
          key={`fsl-${i}`}
          x1={width * xf}
          y1={height * 0.85}
          x2={width * (xf < 0.5 ? xf - 0.15 : xf + 0.15)}
          y2={height}
          stroke={C.floorLine}
          strokeWidth={1.5}
          opacity={0.3}
        />
      ))}
      {/* Horizontal floor lines */}
      {[0.88, 0.92, 0.96].map((yf, i) => (
        <line
          key={`fhl-${i}`}
          x1={width * (0.08 - i * 0.03)}
          y1={height * yf}
          x2={width * (0.92 + i * 0.03)}
          y2={height * yf}
          stroke={C.floorLine}
          strokeWidth={1}
          opacity={0.25}
        />
      ))}

      {/* === NARROW DOORWAY/CORRIDOR (back wall) === */}
      <rect
        x={width * 0.46}
        y={height * 0.3}
        width={width * 0.08}
        height={height * 0.42}
        fill={C.doorway}
        stroke={C.doorwayFrame}
        strokeWidth={3}
      />
      {/* Doorway top (slight arch) */}
      <path
        d={`M${width * 0.46},${height * 0.32} Q${width * 0.5},${height * 0.27} ${width * 0.54},${height * 0.32}`}
        fill={C.doorway}
        stroke={C.doorwayFrame}
        strokeWidth={3}
      />
      {/* Faint light from corridor */}
      <rect
        x={width * 0.465}
        y={height * 0.33}
        width={width * 0.07}
        height={height * 0.38}
        fill="rgba(60,40,20,0.3)"
      />

      {/* === HIEROGLYPHICS (back wall - left side) === */}
      <text
        x={width * 0.24}
        y={height * 0.25}
        fontSize={22}
        fill={C.hieroglyph}
        opacity={0.25}
        fontFamily="serif"
      >
        𓀀 𓂀 𓃀
      </text>
      <text
        x={width * 0.25}
        y={height * 0.35}
        fontSize={20}
        fill={C.hieroglyph}
        opacity={0.2}
        fontFamily="serif"
      >
        𓄀 𓅀 𓆀
      </text>
      <text
        x={width * 0.23}
        y={height * 0.45}
        fontSize={24}
        fill={C.hieroglyph}
        opacity={0.22}
        fontFamily="serif"
      >
        𓇀 𓈀 𓀀
      </text>
      <text
        x={width * 0.26}
        y={height * 0.55}
        fontSize={18}
        fill={C.hieroglyph}
        opacity={0.18}
        fontFamily="serif"
      >
        𓂀 𓆀 𓃀 𓅀
      </text>

      {/* === HIEROGLYPHICS (back wall - right side) === */}
      <text
        x={width * 0.66}
        y={height * 0.25}
        fontSize={22}
        fill={C.hieroglyph}
        opacity={0.25}
        fontFamily="serif"
      >
        𓅀 𓇀 𓈀
      </text>
      <text
        x={width * 0.67}
        y={height * 0.35}
        fontSize={20}
        fill={C.hieroglyph}
        opacity={0.2}
        fontFamily="serif"
      >
        𓀀 𓃀 𓄀
      </text>
      <text
        x={width * 0.65}
        y={height * 0.45}
        fontSize={24}
        fill={C.hieroglyph}
        opacity={0.22}
        fontFamily="serif"
      >
        𓆀 𓂀 𓈀
      </text>
      <text
        x={width * 0.68}
        y={height * 0.55}
        fontSize={18}
        fill={C.hieroglyph}
        opacity={0.18}
        fontFamily="serif"
      >
        𓄀 𓇀 𓅀 𓀀
      </text>

      {/* === HIEROGLYPHICS (left wall) === */}
      <text
        x={width * 0.06}
        y={height * 0.4}
        fontSize={18}
        fill={C.hieroglyph}
        opacity={0.15}
        fontFamily="serif"
      >
        𓃀 𓈀
      </text>
      <text
        x={width * 0.07}
        y={height * 0.55}
        fontSize={16}
        fill={C.hieroglyph}
        opacity={0.12}
        fontFamily="serif"
      >
        𓅀 𓂀
      </text>

      {/* === HIEROGLYPHICS (right wall) === */}
      <text
        x={width * 0.88}
        y={height * 0.4}
        fontSize={18}
        fill={C.hieroglyph}
        opacity={0.15}
        fontFamily="serif"
      >
        𓄀 𓇀
      </text>
      <text
        x={width * 0.87}
        y={height * 0.55}
        fontSize={16}
        fill={C.hieroglyph}
        opacity={0.12}
        fontFamily="serif"
      >
        𓆀 𓀀
      </text>

      {/* === SARCOPHAGUS (center-back) === */}
      <g transform={`translate(${width * 0.38}, ${height * 0.65})`}>
        {/* Shadow beneath */}
        <ellipse
          cx={width * 0.12}
          cy={height * 0.2 + 5}
          rx={width * 0.14}
          ry={12}
          fill="rgba(0,0,0,0.4)"
        />
        {/* Main body */}
        <rect
          x={0}
          y={0}
          width={width * 0.24}
          height={height * 0.18}
          rx={4}
          fill={C.sarcophagus}
          stroke={C.outline}
          strokeWidth={2}
        />
        {/* Top face (3D perspective) */}
        <path
          d={`M0,0 L${width * 0.02},-${height * 0.03} L${width * 0.26},-${height * 0.03} L${width * 0.24},0 Z`}
          fill={C.sarcophagusLight}
          stroke={C.outline}
          strokeWidth={1.5}
        />
        {/* Right face */}
        <path
          d={`M${width * 0.24},0 L${width * 0.26},-${height * 0.03} L${width * 0.26},${height * 0.15} L${width * 0.24},${height * 0.18} Z`}
          fill={C.sarcophagusDark}
          stroke={C.outline}
          strokeWidth={1.5}
        />
        {/* Carved detail lines on front */}
        <rect
          x={width * 0.02}
          y={height * 0.02}
          width={width * 0.2}
          height={height * 0.14}
          rx={2}
          fill="none"
          stroke={C.sarcophagusDetail}
          strokeWidth={1.5}
          opacity={0.4}
        />
        {/* Carved center symbol */}
        <text
          x={width * 0.12}
          y={height * 0.11}
          textAnchor="middle"
          fontSize={28}
          fill={C.sarcophagusDetail}
          opacity={0.5}
          fontFamily="serif"
        >
          𓂀
        </text>
        {/* Horizontal carved lines */}
        <line
          x1={width * 0.03}
          y1={height * 0.06}
          x2={width * 0.21}
          y2={height * 0.06}
          stroke={C.sarcophagusDetail}
          strokeWidth={0.8}
          opacity={0.3}
        />
        <line
          x1={width * 0.03}
          y1={height * 0.14}
          x2={width * 0.21}
          y2={height * 0.14}
          stroke={C.sarcophagusDetail}
          strokeWidth={0.8}
          opacity={0.3}
        />
      </g>

      {/* === TORCH GLOW OVERLAYS === */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#ip-glow-left)"
        opacity={glowPulse}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#ip-glow-right)"
        opacity={glowPulse2}
      />
      <rect x={0} y={0} width={width} height={height} fill="url(#ip-ambient)" />

      {/* === LEFT TORCH === */}
      <Torch
        x={torchLX}
        y={torchY}
        flame1={flame1}
        flame2={flame2}
        flame3={flame3}
        glowPulse={glowPulse}
        side="left"
      />

      {/* === RIGHT TORCH === */}
      <Torch
        x={torchRX}
        y={torchY}
        flame1={flame4}
        flame2={flame3}
        flame3={flame1}
        glowPulse={glowPulse2}
        side="right"
      />

      {/* === STONE TABLET BOARD === */}
      <g transform={`translate(${width / 2 - 210}, ${height * 0.17})`}>
        {/* Outer frame */}
        <rect
          x={-10}
          y={-10}
          width={440}
          height={190}
          rx={5}
          fill={C.boardFrame}
          stroke={C.outline}
          strokeWidth={2.5}
        />
        {/* Inner surface */}
        <rect x={0} y={0} width={420} height={170} rx={2} fill={C.boardBg} />
        {/* Carved border decoration */}
        <rect
          x={8}
          y={8}
          width={404}
          height={154}
          rx={2}
          fill="none"
          stroke={C.hieroglyph}
          strokeWidth={1}
          opacity={0.25}
        />
        {/* Corner hieroglyphs */}
        <text x={16} y={28} fontSize={14} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">
          𓀀
        </text>
        <text x={394} y={28} fontSize={14} fill={C.hieroglyph} opacity={0.3} fontFamily="serif" textAnchor="end">
          𓂀
        </text>
        <text x={16} y={155} fontSize={14} fill={C.hieroglyph} opacity={0.3} fontFamily="serif">
          𓃀
        </text>
        <text x={394} y={155} fontSize={14} fill={C.hieroglyph} opacity={0.3} fontFamily="serif" textAnchor="end">
          𓅀
        </text>
        {/* Board text */}
        {boardText && (
          <text
            x={210}
            y={100}
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

      {/* === SHADOW CORNERS / VIGNETTE === */}
      <rect x={0} y={0} width={width} height={height} fill="url(#ip-vignette)" />

      {/* Dark shadow in top corners */}
      <path
        d={`M0,0 L${width * 0.12},0 L0,${height * 0.15} Z`}
        fill="rgba(0,0,0,0.5)"
      />
      <path
        d={`M${width},0 L${width * 0.88},0 L${width},${height * 0.15} Z`}
        fill="rgba(0,0,0,0.5)"
      />

      {/* Bottom corner shadows */}
      <path
        d={`M0,${height} L${width * 0.08},${height} L0,${height * 0.88} Z`}
        fill="rgba(0,0,0,0.4)"
      />
      <path
        d={`M${width},${height} L${width * 0.92},${height} L${width},${height * 0.88} Z`}
        fill="rgba(0,0,0,0.4)"
      />
    </svg>
  );
};

/* === TORCH SUB-COMPONENT === */
const Torch: React.FC<{
  x: number;
  y: number;
  flame1: number;
  flame2: number;
  flame3: number;
  glowPulse: number;
  side: 'left' | 'right';
}> = ({ x, y, flame1, flame2, flame3, glowPulse, side }) => {
  const bracketDir = side === 'left' ? 1 : -1;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Wall bracket */}
      <line
        x1={-bracketDir * 20}
        y1={0}
        x2={0}
        y2={-10}
        stroke={C.torchBracket}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={-bracketDir * 20}
        y1={0}
        x2={-bracketDir * 20}
        y2={15}
        stroke={C.torchBracket}
        strokeWidth={3}
      />

      {/* Torch stick */}
      <rect
        x={-5}
        y={-10}
        width={10}
        height={50}
        rx={2}
        fill={C.torchWood}
        stroke={C.outline}
        strokeWidth={1.5}
      />
      {/* Wrap at top */}
      <rect x={-6} y={-8} width={12} height={8} rx={1} fill="#7A5A3A" opacity={0.6} />

      {/* Flame glow (halo) */}
      <ellipse
        cx={0}
        cy={-30}
        rx={35 + flame1 * 5}
        ry={40 + flame2 * 5}
        fill="rgba(255,140,30,0.12)"
        opacity={glowPulse}
      />

      {/* Outer flame */}
      <path
        d={`M-10,-12 Q${-6 + flame1 * 3},-40 ${flame2 * 2},-55 Q${6 + flame3 * 3},-40 10,-12 Z`}
        fill={C.flameOuter}
        opacity={0.8}
      />
      {/* Middle flame */}
      <path
        d={`M-6,-12 Q${-3 + flame2 * 2},-35 ${flame1 * 1.5},-46 Q${4 + flame1 * 2},-35 6,-12 Z`}
        fill={C.flameInner}
        opacity={0.85}
      />
      {/* Inner flame core */}
      <path
        d={`M-3,-12 Q${-1 + flame3 * 1},-28 ${flame2 * 1},-35 Q${2 + flame2},-28 3,-12 Z`}
        fill={C.flameCore}
        opacity={0.9}
      />

      {/* Sparks */}
      <circle
        cx={flame1 * 4}
        cy={-58 + flame2 * 3}
        r={1.5}
        fill={C.flameInner}
        opacity={0.4 + flame3 * 0.3}
      />
      <circle
        cx={-3 + flame3 * 3}
        cy={-62 + flame1 * 4}
        r={1}
        fill={C.flameCore}
        opacity={0.3 + flame2 * 0.3}
      />
    </g>
  );
};

export default InsidePyramid;
