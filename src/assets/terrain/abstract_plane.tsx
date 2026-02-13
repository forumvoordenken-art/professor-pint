/**
 * abstract_plane — Rich conceptual/explainer environment.
 *
 * A detailed abstract space with perspective grids, floating geometry,
 * holographic rings, data streams, light beams, particle fields,
 * energy lines, caustics, and star fields. Oil painting palette
 * throughout — muted, layered, never flat.
 *
 * Used for philosophical / conceptual / explainer scenes.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  GroundMist,
  TerrainTexture,
  longCycleNoise,
  seededRandom,
  slowDrift,
} from './TerrainEngine';

const ID = 'abstract-plane';
const FLOOR_Y = 620;
const VANISH_X = 960;
const VANISH_Y = 420;

// ─── Color Palette (oil painting muted tones) ──────────────────
const COL = {
  floorDark: '#2A2833',
  floorMid: '#3A3840',
  floorLight: '#4A4858',
  gridBase: '#7080A0',
  gridBright: '#A0B8D8',
  warmZone: '#5A4838',
  coolZone: '#384858',
  accent: '#88A0C0',
  highlight: '#C0D0E8',
  gold: '#C8A868',
  particle: '#B0B8C8',
  beam: '#A0B0D0',
  holoring: '#80A0D0',
  energy: '#90B0E0',
  caustic: '#6888B0',
  star: '#C8D0E0',
  mist: '#505868',
  horizonGlow: '#8898B8',
};

// ─── Helper: perspective grid Y positions (exponential spacing) ──
function perspectiveYs(count: number, startOffset: number, exponent: number): number[] {
  const ys: number[] = [];
  for (let i = 0; i < count; i++) {
    const y = FLOOR_Y + startOffset + i * i * exponent;
    if (y <= 1080) ys.push(y);
  }
  return ys;
}

// ─── Helper: converging X at horizon ──────────────────────────
function convergeX(groundX: number, convergeFactor: number): number {
  return VANISH_X + (groundX - VANISH_X) * convergeFactor;
}

export const AbstractPlane: React.FC<AssetProps> = ({ frame }) => {
  // ── Precomputed static geometry (no frame dependency) ──────
  const staticGeo = useMemo(() => {
    const rng = seededRandom(777);

    // Particle field — 40 particles at various depths
    const particles = Array.from({ length: 40 }, (_, i) => ({
      baseX: rng() * 1920,
      baseY: 200 + rng() * 800,
      r: 0.8 + rng() * 2.5,
      depth: 0.3 + rng() * 0.7,
      seed: rng() * 1000,
      baseOpacity: 0.02 + rng() * 0.06,
    }));

    // Star field — 50 tiny stars in upper region
    const stars = Array.from({ length: 50 }, () => ({
      x: rng() * 1920,
      y: 30 + rng() * 380,
      r: 0.4 + rng() * 1.2,
      seed: rng() * 1000,
      baseOpacity: 0.015 + rng() * 0.04,
    }));

    // Floating geometric wireframe shapes
    const shapes = [
      { type: 'cube' as const, cx: 340, cy: 380, size: 50, seed: 101 },
      { type: 'pyramid' as const, cx: 1580, cy: 350, size: 45, seed: 202 },
      { type: 'sphere' as const, cx: 960, cy: 300, size: 40, seed: 303 },
      { type: 'cube' as const, cx: 1200, cy: 430, size: 35, seed: 404 },
      { type: 'pyramid' as const, cx: 600, cy: 310, size: 38, seed: 505 },
      { type: 'sphere' as const, cx: 250, cy: 460, size: 30, seed: 606 },
      { type: 'cube' as const, cx: 1700, cy: 480, size: 28, seed: 707 },
    ];

    // Data stream paths along grid (dots flowing toward vanishing point)
    const dataStreams = Array.from({ length: 8 }, (_, i) => {
      const groundX = 80 + i * 240;
      return {
        groundX,
        topX: convergeX(groundX, 0.12),
        dotCount: 6 + Math.floor(rng() * 5),
        seed: rng() * 1000,
        speed: 0.15 + rng() * 0.2,
      };
    });

    // Equation fragment positions
    const eqFragments = [
      { x: 160, y: 540, seed: 51 },
      { x: 480, y: 590, seed: 52 },
      { x: 780, y: 560, seed: 53 },
      { x: 1120, y: 575, seed: 54 },
      { x: 1400, y: 550, seed: 55 },
      { x: 1700, y: 585, seed: 56 },
    ];

    // Caustic pattern nodes
    const causticNodes = Array.from({ length: 18 }, () => ({
      cx: 200 + rng() * 1520,
      cy: FLOOR_Y + 60 + rng() * 300,
      rx: 40 + rng() * 100,
      ry: 10 + rng() * 30,
      seed: rng() * 1000,
    }));

    // Energy line connections (curved paths between floating shapes)
    const energyLines = [
      { from: 0, to: 4 },
      { from: 4, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 1 },
      { from: 5, to: 0 },
      { from: 1, to: 6 },
    ];

    return { particles, stars, shapes, dataStreams, eqFragments, causticNodes, energyLines };
  }, []);

  // ── Animated values ──────────────────────────────────────────
  const warmth = longCycleNoise(frame * 0.05, 42) * 0.02;
  const globalPulse = longCycleNoise(frame * 0.08, 99);
  const gridWave = longCycleNoise(frame * 0.12, 150);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        {/* Reusable glow filter */}
        <filter id={`${ID}-glow`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${ID}-glow-lg`}>
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Floor reflection gradient */}
        <linearGradient id={`${ID}-reflect`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={0.04} />
          <stop offset="30%" stopColor="white" stopOpacity={0.015} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>

        {/* Depth fog gradient */}
        <linearGradient id={`${ID}-depth-fog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COL.floorDark} stopOpacity={0.6} />
          <stop offset="40%" stopColor={COL.floorDark} stopOpacity={0.2} />
          <stop offset="100%" stopColor={COL.floorDark} stopOpacity={0} />
        </linearGradient>

        {/* Beam gradient template */}
        <linearGradient id={`${ID}-beam-grad`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={COL.beam} stopOpacity={0.12} />
          <stop offset="50%" stopColor={COL.beam} stopOpacity={0.04} />
          <stop offset="100%" stopColor={COL.beam} stopOpacity={0} />
        </linearGradient>

        {/* Color zone warm */}
        <radialGradient id={`${ID}-zone-warm`} cx="0.3" cy="0.6" r="0.4">
          <stop offset="0%" stopColor={COL.warmZone} stopOpacity={0.12 + warmth} />
          <stop offset="100%" stopColor={COL.warmZone} stopOpacity={0} />
        </radialGradient>

        {/* Color zone cool */}
        <radialGradient id={`${ID}-zone-cool`} cx="0.7" cy="0.55" r="0.35">
          <stop offset="0%" stopColor={COL.coolZone} stopOpacity={0.10 - warmth} />
          <stop offset="100%" stopColor={COL.coolZone} stopOpacity={0} />
        </radialGradient>

        {/* Horizon glow */}
        <radialGradient id={`${ID}-horizon-glow`} cx="0.5" cy="0" r="0.6">
          <stop offset="0%" stopColor={COL.horizonGlow} stopOpacity={0.18 + globalPulse * 0.04} />
          <stop offset="40%" stopColor={COL.horizonGlow} stopOpacity={0.06} />
          <stop offset="100%" stopColor={COL.horizonGlow} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* ═══════════════ LAYER 1: Star Field ═══════════════ */}
      <g>
        {staticGeo.stars.map((s, i) => {
          const twinkle = longCycleNoise(frame * 0.18, s.seed) * 0.5 + 0.5;
          return (
            <circle
              key={`star-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.r * (0.7 + twinkle * 0.3)}
              fill={COL.star}
              opacity={s.baseOpacity * twinkle}
            />
          );
        })}
      </g>

      {/* ═══════════════ LAYER 2: Horizon Glow ═══════════════ */}
      <ellipse
        cx={VANISH_X}
        cy={VANISH_Y}
        rx={600 + slowDrift(frame * 0.02, 88) * 30}
        ry={200 + slowDrift(frame * 0.015, 99) * 15}
        fill={`url(#${ID}-horizon-glow)`}
      />

      {/* ═══════════════ LAYER 3: Depth Fog toward horizon ═══════════════ */}
      <rect
        x={0} y={VANISH_Y - 80} width={1920} height={250}
        fill={`url(#${ID}-depth-fog)`}
      />

      {/* ═══════════════ LAYER 4: Base Floor ═══════════════ */}
      <GroundPlane
        id={`${ID}-floor`}
        horizonY={FLOOR_Y}
        stops={[
          { offset: '0%', color: COL.floorDark, opacity: 0.0 },
          { offset: '15%', color: COL.floorDark, opacity: 0.25 },
          { offset: '45%', color: COL.floorMid, opacity: 0.50 },
          { offset: '80%', color: COL.floorLight, opacity: 0.60 },
          { offset: '100%', color: COL.floorDark, opacity: 0.70 },
        ]}
      />

      {/* ═══════════════ LAYER 5: Color Zones ═══════════════ */}
      <rect x={0} y={FLOOR_Y} width={1920} height={460} fill={`url(#${ID}-zone-warm)`} />
      <rect x={0} y={FLOOR_Y} width={1920} height={460} fill={`url(#${ID}-zone-cool)`} />

      {/* ═══════════════ LAYER 6: Floor Reflection ═══════════════ */}
      <rect x={0} y={FLOOR_Y} width={1920} height={460} fill={`url(#${ID}-reflect)`} />

      {/* ═══════════════ LAYER 7: Perspective Grid (deep layer) ═══════════════ */}
      <g opacity={0.035 + gridWave * 0.008}>
        {/* Deep horizontal lines — tighter spacing */}
        {perspectiveYs(16, 5, 2.0).map((y, i) => {
          const pulse = longCycleNoise(frame * 0.06, i * 13 + 200) * 0.015;
          return (
            <line
              key={`dh-${i}`}
              x1={0} y1={y} x2={1920} y2={y}
              stroke={COL.gridBase}
              strokeWidth={0.4}
              opacity={0.5 + pulse}
            />
          );
        })}
        {/* Deep vertical lines — strong convergence */}
        {Array.from({ length: 30 }, (_, i) => {
          const groundX = i * 66;
          const topX = convergeX(groundX, 0.08);
          return (
            <line
              key={`dv-${i}`}
              x1={topX} y1={FLOOR_Y} x2={groundX} y2={1080}
              stroke={COL.gridBase}
              strokeWidth={0.3}
            />
          );
        })}
      </g>

      {/* ═══════════════ LAYER 8: Perspective Grid (mid layer) ═══════════════ */}
      <g opacity={0.055 + gridWave * 0.012}>
        {/* Mid horizontal lines */}
        {perspectiveYs(14, 8, 2.8).map((y, i) => {
          const waveBright = longCycleNoise(frame * 0.09 + y * 0.003, i * 17 + 300);
          return (
            <line
              key={`mh-${i}`}
              x1={0} y1={y} x2={1920} y2={y}
              stroke={COL.gridBase}
              strokeWidth={0.6}
              opacity={0.4 + waveBright * 0.2}
            />
          );
        })}
        {/* Mid vertical lines — moderate convergence */}
        {Array.from({ length: 22 }, (_, i) => {
          const groundX = i * 95 + 25;
          const topX = convergeX(groundX, 0.12);
          const waveBright = longCycleNoise(frame * 0.07, i * 23 + 400);
          return (
            <line
              key={`mv-${i}`}
              x1={topX} y1={FLOOR_Y} x2={groundX} y2={1080}
              stroke={COL.gridBase}
              strokeWidth={0.5}
              opacity={0.4 + waveBright * 0.15}
            />
          );
        })}
      </g>

      {/* ═══════════════ LAYER 9: Perspective Grid (front bright layer) ═══════════════ */}
      <g opacity={0.08}>
        {perspectiveYs(10, 20, 4.5).map((y, i) => {
          const pulse = longCycleNoise(frame * 0.1 + y * 0.005, i * 19 + 500);
          return (
            <line
              key={`fh-${i}`}
              x1={0} y1={y} x2={1920} y2={y}
              stroke={COL.gridBright}
              strokeWidth={0.8}
              opacity={0.3 + Math.max(0, pulse) * 0.4}
            />
          );
        })}
        {Array.from({ length: 14 }, (_, i) => {
          const groundX = i * 150 + 35;
          const topX = convergeX(groundX, 0.15);
          const pulse = longCycleNoise(frame * 0.1, i * 29 + 600);
          return (
            <line
              key={`fv-${i}`}
              x1={topX} y1={FLOOR_Y} x2={groundX} y2={1080}
              stroke={COL.gridBright}
              strokeWidth={0.7}
              opacity={0.3 + Math.max(0, pulse) * 0.35}
            />
          );
        })}
      </g>

      {/* ═══════════════ LAYER 10: Animated Grid Pulse Wave ═══════════════ */}
      {Array.from({ length: 3 }, (_, waveIdx) => {
        const wavePhase = longCycleNoise(frame * 0.04, waveIdx * 71 + 800);
        const waveCenter = FLOOR_Y + 50 + ((frame * 0.8 + waveIdx * 150) % 430);
        return (
          <rect
            key={`pulse-${waveIdx}`}
            x={0}
            y={waveCenter - 30}
            width={1920}
            height={60}
            fill={COL.gridBright}
            opacity={0.015 + Math.max(0, wavePhase) * 0.02}
          />
        );
      })}

      {/* ═══════════════ LAYER 11: Caustic Pattern on Floor ═══════════════ */}
      <g>
        {staticGeo.causticNodes.map((c, i) => {
          const shift = longCycleNoise(frame * 0.13, c.seed) * 20;
          const scaleX = 1 + longCycleNoise(frame * 0.08, c.seed + 50) * 0.3;
          const scaleY = 1 + longCycleNoise(frame * 0.1, c.seed + 100) * 0.2;
          const op = 0.015 + Math.max(0, longCycleNoise(frame * 0.09, c.seed + 150)) * 0.025;
          return (
            <ellipse
              key={`caust-${i}`}
              cx={c.cx + shift}
              cy={c.cy}
              rx={c.rx * scaleX}
              ry={c.ry * scaleY}
              fill="none"
              stroke={COL.caustic}
              strokeWidth={0.8}
              opacity={op}
            />
          );
        })}
      </g>

      {/* ═══════════════ LAYER 12: Data Streams ═══════════════ */}
      <g>
        {staticGeo.dataStreams.map((stream, si) => {
          const dots: React.ReactNode[] = [];
          for (let d = 0; d < stream.dotCount; d++) {
            // Each dot flows from bottom toward vanishing point
            const rawT = ((frame * stream.speed + d * (1 / stream.dotCount) * 400 + stream.seed) % 400) / 400;
            const t = rawT;
            const dotX = stream.groundX + (stream.topX - stream.groundX) * t;
            const dotY = 1080 + (FLOOR_Y - 1080) * t;
            const dotOp = 0.06 * (1 - t) * (0.5 + longCycleNoise(frame * 0.2, stream.seed + d * 7) * 0.5);
            const dotR = 1.2 * (1 - t * 0.6);
            if (dotOp > 0.005) {
              dots.push(
                <circle
                  key={`ds-${si}-${d}`}
                  cx={dotX}
                  cy={dotY}
                  r={dotR}
                  fill={COL.accent}
                  opacity={dotOp}
                />
              );
            }
          }
          return <g key={`stream-${si}`}>{dots}</g>;
        })}
      </g>

      {/* ═══════════════ LAYER 13: Floating Geometric Wireframes ═══════════════ */}
      <g filter={`url(#${ID}-glow)`}>
        {staticGeo.shapes.map((shape, si) => {
          const floatY = longCycleNoise(frame * 0.12, shape.seed) * 15;
          const floatX = longCycleNoise(frame * 0.08, shape.seed + 30) * 10;
          const rot = longCycleNoise(frame * 0.06, shape.seed + 60) * 25;
          const breathe = 1 + longCycleNoise(frame * 0.05, shape.seed + 90) * 0.08;
          const op = 0.06 + Math.max(0, longCycleNoise(frame * 0.07, shape.seed + 120)) * 0.05;
          const cx = shape.cx + floatX;
          const cy = shape.cy + floatY;
          const s = shape.size * breathe;

          if (shape.type === 'cube') {
            // Isometric cube wireframe
            const h = s * 0.5;
            return (
              <g key={`shape-${si}`} opacity={op}
                transform={`rotate(${rot}, ${cx}, ${cy})`}>
                {/* Front face */}
                <polygon
                  points={`${cx - s * 0.4},${cy} ${cx},${cy - h * 0.6} ${cx + s * 0.4},${cy} ${cx},${cy + h * 0.6}`}
                  fill="none" stroke={COL.accent} strokeWidth={0.8}
                />
                {/* Top face */}
                <polygon
                  points={`${cx},${cy - h * 0.6} ${cx + s * 0.35},${cy - h} ${cx + s * 0.75},${cy - h * 0.4} ${cx + s * 0.4},${cy}`}
                  fill="none" stroke={COL.accent} strokeWidth={0.6}
                />
                {/* Side face */}
                <polygon
                  points={`${cx + s * 0.4},${cy} ${cx + s * 0.75},${cy - h * 0.4} ${cx + s * 0.35},${cy + h * 0.2} ${cx},${cy + h * 0.6}`}
                  fill="none" stroke={COL.accent} strokeWidth={0.5}
                />
              </g>
            );
          } else if (shape.type === 'pyramid') {
            // Pyramid wireframe
            const base = s * 0.7;
            return (
              <g key={`shape-${si}`} opacity={op}
                transform={`rotate(${rot}, ${cx}, ${cy})`}>
                {/* Base */}
                <polygon
                  points={`${cx - base * 0.5},${cy + s * 0.3} ${cx + base * 0.5},${cy + s * 0.3} ${cx + base * 0.2},${cy + s * 0.5} ${cx - base * 0.2},${cy + s * 0.5}`}
                  fill="none" stroke={COL.gold} strokeWidth={0.6}
                />
                {/* Edges to apex */}
                <line x1={cx - base * 0.5} y1={cy + s * 0.3} x2={cx} y2={cy - s * 0.5}
                  stroke={COL.gold} strokeWidth={0.7} />
                <line x1={cx + base * 0.5} y1={cy + s * 0.3} x2={cx} y2={cy - s * 0.5}
                  stroke={COL.gold} strokeWidth={0.7} />
                <line x1={cx + base * 0.2} y1={cy + s * 0.5} x2={cx} y2={cy - s * 0.5}
                  stroke={COL.gold} strokeWidth={0.5} />
                <line x1={cx - base * 0.2} y1={cy + s * 0.5} x2={cx} y2={cy - s * 0.5}
                  stroke={COL.gold} strokeWidth={0.5} />
              </g>
            );
          } else {
            // Sphere wireframe (circles at angles)
            return (
              <g key={`shape-${si}`} opacity={op}
                transform={`rotate(${rot}, ${cx}, ${cy})`}>
                <ellipse cx={cx} cy={cy} rx={s * 0.45} ry={s * 0.45}
                  fill="none" stroke={COL.highlight} strokeWidth={0.7} />
                <ellipse cx={cx} cy={cy} rx={s * 0.45} ry={s * 0.18}
                  fill="none" stroke={COL.highlight} strokeWidth={0.5} />
                <ellipse cx={cx} cy={cy} rx={s * 0.18} ry={s * 0.45}
                  fill="none" stroke={COL.highlight} strokeWidth={0.5} />
                {/* Tilted ring */}
                <ellipse cx={cx} cy={cy} rx={s * 0.38} ry={s * 0.32}
                  fill="none" stroke={COL.highlight} strokeWidth={0.4}
                  transform={`rotate(35, ${cx}, ${cy})`} />
              </g>
            );
          }
        })}
      </g>

      {/* ═══════════════ LAYER 14: Energy Lines Between Shapes ═══════════════ */}
      <g>
        {staticGeo.energyLines.map((link, li) => {
          const from = staticGeo.shapes[link.from];
          const to = staticGeo.shapes[link.to];
          const midX = (from.cx + to.cx) / 2;
          const midY = (from.cy + to.cy) / 2 - 40;
          const wobble = longCycleNoise(frame * 0.1, li * 37 + 900) * 25;
          const op = 0.025 + Math.max(0, longCycleNoise(frame * 0.06, li * 43 + 950)) * 0.035;
          // Animated dot traveling along the energy line
          const dotT = ((frame * 0.3 + li * 80) % 300) / 300;
          const bezX = (1 - dotT) * (1 - dotT) * from.cx + 2 * (1 - dotT) * dotT * (midX + wobble) + dotT * dotT * to.cx;
          const bezY = (1 - dotT) * (1 - dotT) * from.cy + 2 * (1 - dotT) * dotT * (midY + wobble) + dotT * dotT * to.cy;
          return (
            <g key={`energy-${li}`}>
              <path
                d={`M${from.cx},${from.cy} Q${midX + wobble},${midY + wobble} ${to.cx},${to.cy}`}
                fill="none"
                stroke={COL.energy}
                strokeWidth={0.6}
                opacity={op}
              />
              <circle
                cx={bezX}
                cy={bezY}
                r={2}
                fill={COL.highlight}
                opacity={op * 2}
              />
            </g>
          );
        })}
      </g>

      {/* ═══════════════ LAYER 15: Holographic Rings at Focal Point ═══════════════ */}
      <g>
        {Array.from({ length: 6 }, (_, i) => {
          const baseR = 30 + i * 35;
          const pulse = longCycleNoise(frame * 0.09, i * 51 + 700);
          const r = baseR + pulse * 8;
          const op = 0.03 + Math.max(0, longCycleNoise(frame * 0.07 + i * 0.5, i * 61 + 750)) * 0.04;
          const ySquash = 0.35 + i * 0.02;
          return (
            <ellipse
              key={`holo-${i}`}
              cx={VANISH_X + slowDrift(frame * 0.01, i * 11) * 5}
              cy={VANISH_Y + 30}
              rx={r}
              ry={r * ySquash}
              fill="none"
              stroke={COL.holoring}
              strokeWidth={0.8 - i * 0.08}
              opacity={op}
              filter={i < 2 ? `url(#${ID}-glow)` : undefined}
            />
          );
        })}
      </g>

      {/* ═══════════════ LAYER 16: Equation/Formula Fragment Shapes ═══════════════ */}
      <g>
        {staticGeo.eqFragments.map((eq, i) => {
          const drift = longCycleNoise(frame * 0.06, eq.seed) * 8;
          const op = 0.03 + Math.max(0, longCycleNoise(frame * 0.08, eq.seed + 20)) * 0.03;
          // Abstract shapes that suggest mathematical notation
          const variant = i % 3;
          const cx = eq.x + drift;
          const cy = eq.y;
          if (variant === 0) {
            // Integral-like curve
            return (
              <g key={`eq-${i}`} opacity={op}>
                <path
                  d={`M${cx},${cy - 12} C${cx + 5},${cy - 8} ${cx - 5},${cy + 8} ${cx},${cy + 12}`}
                  fill="none" stroke={COL.accent} strokeWidth={1.2} />
                <line x1={cx + 8} y1={cy - 4} x2={cx + 25} y2={cy - 4}
                  stroke={COL.accent} strokeWidth={0.6} />
                <line x1={cx + 8} y1={cy + 4} x2={cx + 20} y2={cy + 4}
                  stroke={COL.accent} strokeWidth={0.6} />
              </g>
            );
          } else if (variant === 1) {
            // Sigma-like shape
            return (
              <g key={`eq-${i}`} opacity={op}>
                <polyline
                  points={`${cx + 15},${cy - 10} ${cx},${cy - 10} ${cx + 8},${cy} ${cx},${cy + 10} ${cx + 15},${cy + 10}`}
                  fill="none" stroke={COL.gold} strokeWidth={0.9} />
                <circle cx={cx + 22} cy={cy - 6} r={2} fill="none"
                  stroke={COL.gold} strokeWidth={0.5} />
              </g>
            );
          } else {
            // Pi / fraction-like shape
            return (
              <g key={`eq-${i}`} opacity={op}>
                <line x1={cx} y1={cy - 8} x2={cx + 18} y2={cy - 8}
                  stroke={COL.highlight} strokeWidth={0.9} />
                <line x1={cx + 4} y1={cy - 8} x2={cx + 4} y2={cy + 8}
                  stroke={COL.highlight} strokeWidth={0.7} />
                <line x1={cx + 14} y1={cy - 8} x2={cx + 13} y2={cy + 8}
                  stroke={COL.highlight} strokeWidth={0.7} />
                <line x1={cx - 2} y1={cy + 2} x2={cx + 22} y2={cy + 2}
                  stroke={COL.highlight} strokeWidth={0.5} />
              </g>
            );
          }
        })}
      </g>

      {/* ═══════════════ LAYER 17: Light Beams from Above ═══════════════ */}
      {[
        { x: 480, width: 180, seed: 1001 },
        { x: 960, width: 220, seed: 1002 },
        { x: 1440, width: 160, seed: 1003 },
      ].map((beam, bi) => {
        const sway = longCycleNoise(frame * 0.04, beam.seed) * 30;
        const intensity = 0.7 + longCycleNoise(frame * 0.06, beam.seed + 50) * 0.3;
        const topLeft = beam.x - beam.width * 0.15 + sway * 0.3;
        const topRight = beam.x + beam.width * 0.15 + sway * 0.3;
        const botLeft = beam.x - beam.width * 0.8 + sway;
        const botRight = beam.x + beam.width * 0.8 + sway;
        return (
          <polygon
            key={`beam-${bi}`}
            points={`${topLeft},0 ${topRight},0 ${botRight},1080 ${botLeft},1080`}
            fill={`url(#${ID}-beam-grad)`}
            opacity={0.08 * intensity}
          />
        );
      })}

      {/* ═══════════════ LAYER 18: Spotlight Pools on Floor ═══════════════ */}
      {[
        { cx: 480, cy: 800, rx: 280, ry: 100, seed: 2001 },
        { cx: 960, cy: 780, rx: 350, ry: 130, seed: 2002 },
        { cx: 1440, cy: 810, rx: 260, ry: 90, seed: 2003 },
      ].map((spot, si) => {
        const pulse = 0.8 + longCycleNoise(frame * 0.05, spot.seed) * 0.2;
        return (
          <g key={`spot-${si}`}>
            <defs>
              <radialGradient id={`${ID}-spot-${si}`} cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor={COL.highlight} stopOpacity={0.06 * pulse + warmth} />
                <stop offset="50%" stopColor={COL.accent} stopOpacity={0.025 * pulse} />
                <stop offset="100%" stopColor={COL.accent} stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse
              cx={spot.cx} cy={spot.cy} rx={spot.rx} ry={spot.ry}
              fill={`url(#${ID}-spot-${si})`}
            />
          </g>
        );
      })}

      {/* ═══════════════ LAYER 19: Terrain Texture (oil painting) ═══════════════ */}
      <TerrainTexture
        id={`${ID}-tex`}
        y={FLOOR_Y}
        height={460}
        color={COL.particle}
        opacity={0.04}
        dotCount={60}
        seed={1234}
      />

      {/* ═══════════════ LAYER 20: Particle Field ═══════════════ */}
      <g>
        {staticGeo.particles.map((p, i) => {
          const driftX = longCycleNoise(frame * 0.15 * p.depth, p.seed) * 25 * p.depth;
          const driftY = longCycleNoise(frame * 0.12 * p.depth, p.seed + 50) * 18 * p.depth;
          const fade = longCycleNoise(frame * 0.1, p.seed + 100) * 0.5 + 0.5;
          return (
            <circle
              key={`part-${i}`}
              cx={p.baseX + driftX}
              cy={p.baseY + driftY}
              r={p.r}
              fill={COL.particle}
              opacity={p.baseOpacity * fade}
            />
          );
        })}
      </g>

      {/* ═══════════════ LAYER 21: Ground Mist ═══════════════ */}
      <GroundMist
        id={`${ID}-mist`}
        y={FLOOR_Y + 180}
        color={COL.mist}
        opacity={0.06}
        frame={frame}
        count={8}
        seed={555}
      />

      {/* ═══════════════ LAYER 22: Horizon Blend ═══════════════ */}
      <HorizonBlend
        id={`${ID}-hblend`}
        y={FLOOR_Y - 60}
        height={120}
        color={COL.floorDark}
        opacity={0.35}
      />

      {/* ═══════════════ LAYER 23: Edge Fades ═══════════════ */}
      <defs>
        <linearGradient id={`${ID}-side-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${ID}-side-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={250} height={1080} fill={`url(#${ID}-side-l)`} />
      <rect x={1670} y={0} width={250} height={1080} fill={`url(#${ID}-side-r)`} />

      {/* ═══════════════ LAYER 24: Bottom Vignette ═══════════════ */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="85%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.15} />
        </linearGradient>
        <linearGradient id={`${ID}-vig-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0.08} />
          <stop offset="15%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig-top)`} />
    </svg>
  );
};

export default AbstractPlane;
