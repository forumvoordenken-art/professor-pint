/**
 * TerrainEngine — Shared rendering primitives for all terrain assets.
 *
 * Provides composable building blocks:
 * - GroundPlane: multi-stop vertical gradient for ground surface
 * - HorizonBlend: soft transparent-to-opaque transition at horizon
 * - HillSilhouette: organic hill shapes with parallax drift
 * - SurfaceScatter: procedural surface detail (grass, pebbles, etc.)
 * - GroundMist: atmospheric fog near ground level
 * - WaterSurface: animated water with reflections
 *
 * All components render inside a 1920×1080 SVG coordinate space.
 * Terrain occupies roughly the lower 40-50% (y ~550 to 1080).
 * Upper portion is transparent to let sky show through.
 *
 * Colors use oil-painting-style muted, layered tones.
 * All animations use longCycleNoise for non-repeating 10-15min videos.
 */

import React from 'react';
import { seededRandom, longCycleNoise } from '../skies/SkyEngine';

// Re-export noise functions for terrain files
export { seededRandom, longCycleNoise, slowDrift } from '../skies/SkyEngine';

// ─── Shared Types ─────────────────────────────────────────

export interface GradientStop {
  offset: string;
  color: string;
  opacity?: number;
}

export interface HillConfig {
  /** SVG path data for the hill shape */
  path: string;
  fill: string;
  opacity: number;
  /** Pixels per frame horizontal drift (parallax) */
  drift: number;
}

export interface SurfaceElement {
  cx: number;
  cy: number;
  /** Rotation in degrees */
  angle: number;
  /** Scale multiplier */
  size: number;
  color: string;
  opacity: number;
  /** Per-element seed for animation */
  seed: number;
}

// ─── Ground Plane ─────────────────────────────────────────

interface GroundPlaneProps {
  id: string;
  /** Y where ground starts (horizon line) */
  horizonY: number;
  stops: GradientStop[];
}

/**
 * Renders the base ground gradient from horizon to bottom.
 * Transparent above horizonY so sky shows through.
 */
export const GroundPlane: React.FC<GroundPlaneProps> = ({ id, horizonY, stops }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
        {stops.map((s, i) => (
          <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
        ))}
      </linearGradient>
    </defs>
    <rect x={0} y={horizonY} width={1920} height={1080 - horizonY} fill={`url(#${id}-ground)`} />
  </g>
);

// ─── Horizon Blend ────────────────────────────────────────

interface HorizonBlendProps {
  id: string;
  /** Y center of the blend zone */
  y: number;
  /** Height of the blend zone */
  height: number;
  /** Color that blends from transparent to opaque */
  color: string;
  opacity?: number;
}

/**
 * Soft transition at the horizon line.
 * Fades from transparent (top) to opaque (bottom) to smoothly
 * merge sky and terrain layers.
 */
export const HorizonBlend: React.FC<HorizonBlendProps> = ({
  id, y, height, color, opacity = 1,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-hblend`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0} />
        <stop offset="40%" stopColor={color} stopOpacity={0.3 * opacity} />
        <stop offset="100%" stopColor={color} stopOpacity={opacity} />
      </linearGradient>
    </defs>
    <rect x={0} y={y} width={1920} height={height} fill={`url(#${id}-hblend)`} />
  </g>
);

// ─── Hill Silhouette ──────────────────────────────────────

interface HillSilhouetteProps {
  hills: HillConfig[];
  frame: number;
  idPrefix: string;
}

/**
 * Renders layered hill shapes with parallax drift.
 * Each hill is an SVG path that drifts slowly horizontally.
 * Farther hills drift slower (smaller drift value).
 */
export const HillSilhouette: React.FC<HillSilhouetteProps> = ({ hills, frame, idPrefix }) => (
  <g>
    {hills.map((h, i) => {
      const xOff = longCycleNoise(frame * 0.3, i * 31.7 + 100) * h.drift * 80;
      return (
        <path
          key={i}
          d={h.path}
          fill={h.fill}
          opacity={h.opacity}
          transform={`translate(${xOff}, 0)`}
        />
      );
    })}
  </g>
);

// ─── Surface Scatter ──────────────────────────────────────

interface SurfaceScatterProps {
  elements: SurfaceElement[];
  frame: number;
  /** Render function for each element */
  renderElement: (el: SurfaceElement, index: number, frame: number) => React.ReactNode;
}

/**
 * Renders scattered surface detail elements (grass blades, pebbles, etc.)
 * Each element gets subtle animation via longCycleNoise.
 */
export const SurfaceScatter: React.FC<SurfaceScatterProps> = ({
  elements, frame, renderElement,
}) => (
  <g>
    {elements.map((el, i) => renderElement(el, i, frame))}
  </g>
);

// ─── Ground Mist ──────────────────────────────────────────

interface GroundMistProps {
  id: string;
  /** Y position of mist center */
  y: number;
  color: string;
  opacity: number;
  frame: number;
  /** Number of mist wisps */
  count?: number;
  seed?: number;
}

/**
 * Animated atmospheric mist near ground level.
 * Multiple elliptical wisps that drift and pulse independently.
 */
export const GroundMist: React.FC<GroundMistProps> = ({
  id, y, color, opacity, frame, count = 6, seed = 500,
}) => {
  const rng = seededRandom(seed);
  const wisps = Array.from({ length: count }, (_, i) => ({
    cx: rng() * 2400 - 240,
    cy: y + (rng() - 0.5) * 80,
    rx: 200 + rng() * 400,
    ry: 20 + rng() * 40,
    drift: 0.03 + rng() * 0.06,
    phase: rng() * 100,
  }));

  return (
    <g>
      <defs>
        {wisps.map((w, i) => (
          <radialGradient key={i} id={`${id}-mist-${i}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.8} />
            <stop offset="60%" stopColor={color} stopOpacity={opacity * 0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      {wisps.map((w, i) => {
        const drift = longCycleNoise(frame * 0.4, w.phase + i * 13) * 60;
        const pulse = 1 + longCycleNoise(frame * 0.15, w.phase + i * 7) * 0.15;
        return (
          <ellipse
            key={i}
            cx={w.cx + drift}
            cy={w.cy}
            rx={w.rx * pulse}
            ry={w.ry * pulse}
            fill={`url(#${id}-mist-${i})`}
          />
        );
      })}
    </g>
  );
};

// ─── Water Surface ────────────────────────────────────────

interface WaterSurfaceProps {
  id: string;
  /** Y where water starts */
  y: number;
  /** Height of water area */
  height: number;
  /** Base water color */
  color: string;
  /** Reflection color (usually sky-tinted) */
  reflectionColor: string;
  opacity: number;
  frame: number;
  /** Number of wave lines */
  waveCount?: number;
}

/**
 * Animated water surface with gentle waves and reflections.
 * Wave ripples use longCycleNoise for organic movement.
 */
export const WaterSurface: React.FC<WaterSurfaceProps> = ({
  id, y, height, color, reflectionColor, opacity, frame, waveCount = 8,
}) => {
  const waves = Array.from({ length: waveCount }, (_, i) => {
    const waveY = y + (i / waveCount) * height;
    const amplitude = 2 + (i / waveCount) * 4;
    const frequency = 0.008 + (i / waveCount) * 0.004;
    return { waveY, amplitude, frequency, seed: i * 23.7 };
  });

  return (
    <g opacity={opacity}>
      {/* Base water */}
      <defs>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={reflectionColor} stopOpacity={0.4} />
          <stop offset="40%" stopColor={color} stopOpacity={0.8} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>
      <rect x={0} y={y} width={1920} height={height} fill={`url(#${id}-water)`} />

      {/* Wave ripples */}
      {waves.map((w, i) => {
        const points: string[] = [];
        for (let x = 0; x <= 1920; x += 40) {
          const noise = longCycleNoise(frame * 0.5 + x * w.frequency, w.seed);
          const dy = noise * w.amplitude;
          points.push(`${x},${w.waveY + dy}`);
        }
        const waveOpacity = 0.06 + (i / waveCount) * 0.08;
        return (
          <polyline
            key={i}
            points={points.join(' ')}
            fill="none"
            stroke="white"
            strokeWidth={0.8}
            opacity={waveOpacity}
          />
        );
      })}

      {/* Shimmer highlights */}
      {Array.from({ length: 5 }, (_, i) => {
        const shimmerX = 200 + i * 380;
        const shimmerNoise = longCycleNoise(frame * 0.3, i * 41 + 200);
        const shimmerOpacity = 0.03 + Math.max(0, shimmerNoise) * 0.05;
        return (
          <ellipse
            key={i}
            cx={shimmerX + shimmerNoise * 30}
            cy={y + height * 0.3}
            rx={80 + shimmerNoise * 20}
            ry={15}
            fill="white"
            opacity={shimmerOpacity}
          />
        );
      })}
    </g>
  );
};

// ─── Hill Path Generator ──────────────────────────────────

/**
 * Generates a smooth, organic hill silhouette path.
 * The path starts at bottom-left, rises in organic curves, and ends at bottom-right.
 * @param baseY - The baseline Y of the hill tops
 * @param amplitude - How much hills rise above baseY
 * @param segments - Number of hill peaks (more = rougher)
 * @param seed - Random seed for variation
 * @param bottomY - Y coordinate of the bottom edge (default 1080)
 */
export function generateHillPath(
  baseY: number,
  amplitude: number,
  segments: number,
  seed: number,
  bottomY = 1080,
): string {
  const rng = seededRandom(seed);
  const points: Array<{ x: number; y: number }> = [];

  // Generate control points along the width
  const segWidth = 1920 / segments;
  for (let i = 0; i <= segments; i++) {
    const x = i * segWidth;
    const variation = (rng() - 0.5) * amplitude * 2;
    const y = baseY - Math.abs(variation);
    points.push({ x, y });
  }

  // Build smooth path using quadratic curves
  let path = `M0,${bottomY} L0,${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    const cpy = (prev.y + curr.y) / 2;
    path += ` Q${prev.x + segWidth * 0.5},${prev.y - rng() * amplitude * 0.5} ${cpx},${cpy}`;
  }
  path += ` L1920,${points[points.length - 1].y} L1920,${bottomY} Z`;

  return path;
}

/**
 * Generates surface detail elements scattered across a terrain area.
 * @param count - Number of elements
 * @param seed - Random seed
 * @param bounds - Area to scatter within { x, y, width, height }
 * @param colorPalette - Array of colors to pick from
 */
export function generateSurfaceElements(
  count: number,
  seed: number,
  bounds: { x: number; y: number; width: number; height: number },
  colorPalette: string[],
): SurfaceElement[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    cx: bounds.x + rng() * bounds.width,
    cy: bounds.y + rng() * bounds.height,
    angle: (rng() - 0.5) * 30,
    size: 0.5 + rng() * 1.0,
    color: colorPalette[Math.floor(rng() * colorPalette.length)],
    opacity: 0.4 + rng() * 0.5,
    seed: rng() * 1000,
  }));
}

/**
 * Standard grass blade renderer for SurfaceScatter.
 * Renders a thin, slightly curved blade that sways in wind.
 */
export function renderGrassBlade(el: SurfaceElement, index: number, frame: number): React.ReactNode {
  const sway = longCycleNoise(frame * 0.6, el.seed) * 8;
  const height = 8 + el.size * 12;
  return (
    <g key={index} opacity={el.opacity}>
      <line
        x1={el.cx}
        y1={el.cy}
        x2={el.cx + sway}
        y2={el.cy - height}
        stroke={el.color}
        strokeWidth={1 + el.size * 0.5}
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * Standard pebble renderer for SurfaceScatter.
 * Renders small stones with highlight.
 */
export function renderPebble(el: SurfaceElement, index: number, _frame: number): React.ReactNode {
  const r = 2 + el.size * 3;
  return (
    <g key={index} opacity={el.opacity}>
      <ellipse
        cx={el.cx}
        cy={el.cy}
        rx={r}
        ry={r * 0.7}
        fill={el.color}
        transform={`rotate(${el.angle}, ${el.cx}, ${el.cy})`}
      />
      <ellipse
        cx={el.cx - r * 0.2}
        cy={el.cy - r * 0.15}
        rx={r * 0.4}
        ry={r * 0.25}
        fill="white"
        opacity={0.1}
      />
    </g>
  );
}

// ─── Terrain Noise Texture ────────────────────────────────

interface TerrainTextureProps {
  id: string;
  /** Area to cover */
  y: number;
  height: number;
  color: string;
  opacity: number;
  /** Dot count for painterly texture */
  dotCount?: number;
  seed?: number;
}

/**
 * Painterly noise texture overlay — subtle dots for oil painting feel.
 * Similar to sky texture but for ground surfaces.
 */
export const TerrainTexture: React.FC<TerrainTextureProps> = ({
  id, y, height, color, opacity, dotCount = 40, seed = 900,
}) => {
  const rng = seededRandom(seed);
  return (
    <g opacity={opacity}>
      {Array.from({ length: dotCount }, (_, i) => (
        <circle
          key={i}
          cx={rng() * 1920}
          cy={y + rng() * height}
          r={1.5 + rng() * 3}
          fill={color}
        />
      ))}
    </g>
  );
};
