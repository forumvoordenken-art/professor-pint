/**
 * CobblestoneStreet — Night-lit cobblestone street with perspective
 *
 * Layers:
 *  - Base ground color (dark grays/blues for night)
 *  - Cobblestone pattern (irregular rectangles with color variation)
 *  - Sidewalk edges (top and bottom)
 *  - Wet reflections (subtle puddle-like highlights)
 *  - Perspective narrowing toward horizon
 *
 * Default position: Bottom 45% of canvas
 * Category: terrain
 */

import React from 'react';

interface CobblestoneStreetProps {
  frame: number;
  width?: number;
  height?: number;
}

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Stone colors for night lighting
const STONE_COLORS = [
  '#3a3d48', '#42454f', '#35383f', '#4a4d55', '#383b44',
  '#3f4249', '#33363e', '#454850', '#3c3f47', '#40434b',
  '#363940', '#484b52', '#343740', '#3e4148', '#373a42',
];

const STONE_HIGHLIGHTS = [
  '#4e5158', '#52555c', '#4a4d54', '#565960',
];

// Pre-generate cobblestones
interface Stone {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  rx: number;
}

const generateStones = (
  startY: number,
  endY: number,
  canvasW: number,
  seed: number,
): Stone[] => {
  const stones: Stone[] = [];
  let y = startY;
  let row = 0;

  while (y < endY) {
    // Perspective: stones get smaller toward the top (horizon)
    const progress = (y - startY) / (endY - startY); // 0 = horizon, 1 = foreground
    const stoneH = 8 + progress * 18;
    const stoneW = 20 + progress * 35;
    const gap = 2 + progress * 3;

    // Row offset for brick pattern
    const offsetX = row % 2 === 0 ? 0 : stoneW * 0.4;

    // Perspective narrowing: street is narrower at horizon
    const streetLeft = canvasW * 0.08 * (1 - progress * 0.7);
    const streetRight = canvasW - streetLeft;

    let x = streetLeft + offsetX;
    while (x < streetRight) {
      const s = seed + row * 100 + Math.floor(x);
      const widthVar = stoneW * (0.7 + rand(s) * 0.6);
      const heightVar = stoneH * (0.8 + rand(s + 1) * 0.4);

      stones.push({
        x: x + rand(s + 2) * 3 - 1.5,
        y: y + rand(s + 3) * 2 - 1,
        w: widthVar,
        h: heightVar,
        color: STONE_COLORS[Math.floor(rand(s + 4) * STONE_COLORS.length)],
        rx: 1 + rand(s + 5) * 2,
      });

      x += widthVar + gap;
    }

    y += stoneH + gap;
    row++;
  }

  return stones;
};

const STONES = generateStones(0, 500, 1920, 42);

// Generate highlight stones (wet reflection spots)
const HIGHLIGHTS = Array.from({ length: 20 }, (_, i) => ({
  x: 200 + rand(i * 7 + 800) * 1520,
  y: 80 + rand(i * 9 + 900) * 380,
  w: 15 + rand(i * 3 + 1000) * 40,
  h: 4 + rand(i * 5 + 1100) * 10,
  opacity: 0.06 + rand(i * 2 + 1200) * 0.08,
}));

export const CobblestoneStreet: React.FC<CobblestoneStreetProps> = ({
  frame,
  width = 1920,
  height = 500,
}) => {
  // Subtle wet shimmer
  const shimmer = 0.9 + Math.sin(frame * 0.04) * 0.1;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Base ground gradient */}
        <linearGradient id="street-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2d35" />
          <stop offset="40%" stopColor="#323540" />
          <stop offset="100%" stopColor="#383b45" />
        </linearGradient>

        {/* Sidewalk gradient */}
        <linearGradient id="sidewalk-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4d58" />
          <stop offset="50%" stopColor="#424550" />
          <stop offset="100%" stopColor="#3a3d48" />
        </linearGradient>

        {/* Wet spot reflection */}
        <radialGradient id="wet-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6a7088" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#6a7088" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Base ground */}
      <rect x="0" y="0" width={width} height={height} fill="url(#street-base)" />

      {/* Sidewalk — top edge (horizon side) */}
      <rect x="0" y="0" width={width} height={28} fill="url(#sidewalk-grad)" />
      <line x1="0" y1="28" x2={width} y2="28" stroke="#555860" strokeWidth={1} opacity={0.3} />

      {/* Cobblestones */}
      {STONES.map((s, i) => (
        <rect
          key={`stone-${i}`}
          x={s.x}
          y={s.y + 30}
          width={s.w}
          height={s.h}
          rx={s.rx}
          fill={s.color}
        />
      ))}

      {/* Stone highlight edges (light catching top edges) */}
      {STONES.filter((_, i) => i % 5 === 0).map((s, i) => (
        <line
          key={`edge-${i}`}
          x1={s.x + 1}
          y1={s.y + 30}
          x2={s.x + s.w - 1}
          y2={s.y + 30}
          stroke={STONE_HIGHLIGHTS[i % STONE_HIGHLIGHTS.length]}
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}

      {/* Wet reflections */}
      {HIGHLIGHTS.map((h, i) => (
        <ellipse
          key={`wet-${i}`}
          cx={h.x}
          cy={h.y + 30}
          rx={h.w}
          ry={h.h}
          fill="#7080A0"
          opacity={h.opacity * shimmer}
        />
      ))}

      {/* Sidewalk — bottom edge (foreground) */}
      <rect x="0" y={height - 40} width={width} height={40} fill="url(#sidewalk-grad)" />
      <line x1="0" y1={height - 40} x2={width} y2={height - 40} stroke="#555860" strokeWidth={1} opacity={0.3} />

      {/* Curb shadow (depth between sidewalk and street) */}
      <rect x="0" y={height - 42} width={width} height={3} fill="#1a1c22" opacity={0.4} />
      <rect x="0" y="26" width={width} height={3} fill="#1a1c22" opacity={0.3} />
    </svg>
  );
};

export default CobblestoneStreet;
