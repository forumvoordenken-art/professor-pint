/**
 * VictorianLamp — Ornate Victorian street lamp with animated glow
 *
 * Details:
 *  - Tall dark metal pole with ornamental base
 *  - Glass lantern housing at top
 *  - Warm animated flame/glow inside
 *  - Decorative finial and curves
 *  - Light cone projected downward
 *
 * Aspect ratio: ~120w × 500h (tall, narrow)
 * Category: prop
 */

import React from 'react';

interface VictorianLampProps {
  frame: number;
  glowIntensity?: number;
}

const sin = (f: number, freq: number, phase = 0) =>
  Math.sin(f * freq * Math.PI * 2 + phase);

export const VictorianLamp: React.FC<VictorianLampProps> = ({
  frame,
  glowIntensity = 1.0,
}) => {
  // Flame flicker
  const flicker =
    0.82 +
    sin(frame, 0.04, 0) * 0.07 +
    sin(frame, 0.09, 1.3) * 0.05 +
    sin(frame, 0.15, 2.7) * 0.04;

  const intensity = flicker * glowIntensity;

  // Flame shape variation
  const flameH = 14 + sin(frame, 0.06, 0.5) * 3;
  const flameW = 6 + sin(frame, 0.08, 1.0) * 1.5;

  return (
    <svg viewBox="0 0 120 500" style={{ overflow: 'visible' }}>
      <defs>
        {/* Lamp glow gradient */}
        <radialGradient id="vlamp-glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFD580" stopOpacity={0.7 * intensity} />
          <stop offset="30%" stopColor="#FFAA33" stopOpacity={0.4 * intensity} />
          <stop offset="60%" stopColor="#FF8800" stopOpacity={0.15 * intensity} />
          <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
        </radialGradient>

        {/* Light cone downward */}
        <linearGradient id="vlamp-cone" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFD580" stopOpacity={0.2 * intensity} />
          <stop offset="40%" stopColor="#FFAA33" stopOpacity={0.08 * intensity} />
          <stop offset="100%" stopColor="#FF8800" stopOpacity={0} />
        </linearGradient>

        {/* Metal gradient */}
        <linearGradient id="vlamp-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="30%" stopColor="#2a2a2a" />
          <stop offset="50%" stopColor="#333333" />
          <stop offset="70%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>

        {/* Flame gradient */}
        <radialGradient id="vlamp-flame" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
          <stop offset="20%" stopColor="#FFE880" stopOpacity={0.8} />
          <stop offset="50%" stopColor="#FFAA33" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
        </radialGradient>

        {/* Glass gradient */}
        <linearGradient id="vlamp-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD580" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#FFFAF0" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#FFD580" stopOpacity={0.15} />
        </linearGradient>
      </defs>

      {/* === LIGHT CONE (behind everything) === */}
      <polygon
        points="40,105 80,105 110,400 10,400"
        fill="url(#vlamp-cone)"
      />

      {/* === BASE === */}
      {/* Base plate */}
      <ellipse cx={60} cy={498} rx={35} ry={6} fill="#1a1a1a" />
      <ellipse cx={60} cy={495} rx={32} ry={5} fill="#2a2a2a" />

      {/* Base ornamental feet (4 curved feet) */}
      <path d="M 35,492 Q 28,485 30,478 L 38,480 Q 36,488 38,492 Z" fill="#2a2a2a" />
      <path d="M 85,492 Q 92,485 90,478 L 82,480 Q 84,488 82,492 Z" fill="#2a2a2a" />

      {/* Base column (flared bottom) */}
      <path d="M 48,492 L 44,470 L 50,470 L 50,492 Z" fill="url(#vlamp-metal)" />
      <path d="M 72,492 L 76,470 L 70,470 L 70,492 Z" fill="url(#vlamp-metal)" />

      {/* Base ring */}
      <ellipse cx={60} cy={470} rx={14} ry={4} fill="#333333" />
      <ellipse cx={60} cy={468} rx={12} ry={3} fill="#3a3a3a" />

      {/* === MAIN POLE === */}
      <rect x={55} y={135} width={10} height={335} fill="url(#vlamp-metal)" />

      {/* Pole rings/joints */}
      {[180, 280, 380, 440].map(y => (
        <g key={`ring-${y}`}>
          <ellipse cx={60} cy={y} rx={8} ry={3} fill="#3a3a3a" />
          <ellipse cx={60} cy={y - 1} rx={7} ry={2} fill="#444444" />
        </g>
      ))}

      {/* === CROSS ARM / BRACKET === */}
      {/* Scroll ornaments at top of pole */}
      <path
        d="M 45,135 Q 35,128 38,118 Q 42,112 48,116 Q 50,122 48,130 Z"
        fill="#2a2a2a"
        stroke="#333333"
        strokeWidth={0.5}
      />
      <path
        d="M 75,135 Q 85,128 82,118 Q 78,112 72,116 Q 70,122 72,130 Z"
        fill="#2a2a2a"
        stroke="#333333"
        strokeWidth={0.5}
      />

      {/* === LANTERN HOUSING === */}
      {/* Lantern base ring */}
      <ellipse cx={60} cy={105} rx={22} ry={5} fill="#2a2a2a" />

      {/* Lantern glass panels (4-sided, shown as trapezoid) */}
      <path d="M 38,60 L 42,105 L 78,105 L 82,60 Z" fill="#1a1a1a" />
      <path d="M 40,62 L 44,103 L 76,103 L 80,62 Z" fill="url(#vlamp-glass)" />

      {/* Glass frame lines */}
      <line x1={40} y1={62} x2={44} y2={103} stroke="#2a2a2a" strokeWidth={2} />
      <line x1={80} y1={62} x2={76} y2={103} stroke="#2a2a2a" strokeWidth={2} />
      <line x1={60} y1={60} x2={60} y2={105} stroke="#2a2a2a" strokeWidth={1.5} />
      {/* Cross bar */}
      <line x1={41} y1={82} x2={79} y2={82} stroke="#2a2a2a" strokeWidth={1.5} />

      {/* Flame inside */}
      <ellipse
        cx={60}
        cy={88 - sin(frame, 0.07, 0) * 2}
        rx={flameW}
        ry={flameH}
        fill="url(#vlamp-flame)"
      />
      {/* Flame core (white-hot) */}
      <ellipse
        cx={60}
        cy={90 - sin(frame, 0.07, 0) * 1.5}
        rx={3}
        ry={6}
        fill="#FFF8E0"
        opacity={0.8 * intensity}
      />

      {/* Glow around lantern */}
      <ellipse
        cx={60}
        cy={82}
        rx={50}
        ry={45}
        fill="url(#vlamp-glow)"
      />

      {/* Lantern top cap */}
      <path d="M 38,60 L 60,42 L 82,60 Z" fill="#2a2a2a" />

      {/* === FINIAL (top ornament) === */}
      <line x1={60} y1={42} x2={60} y2={28} stroke="#2a2a2a" strokeWidth={3} />
      <circle cx={60} cy={25} r={5} fill="#333333" />
      <circle cx={60} cy={25} r={3} fill="#3a3a3a" />
      {/* Spike */}
      <line x1={60} y1={20} x2={60} y2={12} stroke="#333333" strokeWidth={2} />
      <circle cx={60} cy={11} r={2.5} fill="#3a3a3a" />
    </svg>
  );
};

export default VictorianLamp;
