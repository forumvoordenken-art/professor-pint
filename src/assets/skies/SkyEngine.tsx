/**
 * SkyEngine — Shared rendering primitives for all sky assets.
 *
 * Provides composable building blocks:
 * - GradientSky: multi-stop vertical gradient background
 * - CloudLayer: procedural cloud clusters with parallax drift
 * - StarField: procedural stars with twinkle animation
 * - CelestialBody: sun/moon with animated glow
 * - LightningSystem: event-based lightning bolts + flash overlay
 * - ParticleField: rain, snow, sand particles with physics
 * - AtmosphericHaze: depth fog / horizon glow overlays
 * - HorizonGlow: radial glow at the horizon line
 *
 * All components render inside a 1920×1080 SVG coordinate space.
 * Colors use oil-painting-style muted, layered tones — never flat CSS colors.
 */

import React from 'react';

// ─── Shared Types ─────────────────────────────────────────

export interface GradientStop {
  offset: string;
  color: string;
  opacity?: number;
}

export interface CloudConfig {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  opacity: number;
  /** Pixels per frame horizontal drift. Negative = left. */
  drift?: number;
  /** Additional sub-blobs around the main ellipse */
  blobs?: number;
}

export interface StarConfig {
  cx: number;
  cy: number;
  r: number;
  brightness: number;
  /** Phase offset for twinkle (0-1) */
  phase: number;
}

export interface ParticleConfig {
  count: number;
  color: string;
  opacity: number;
  /** Min/max width of each particle */
  sizeRange: [number, number];
  /** Min/max height (for rain streaks vs snow dots) */
  heightRange: [number, number];
  /** Pixels per frame vertical speed */
  speedY: number;
  /** Pixels per frame horizontal drift */
  speedX: number;
  /** Seed for deterministic placement */
  seed: number;
}

export interface LightningBolt {
  x: number;
  segments: Array<{ dx: number; dy: number }>;
  width: number;
  color: string;
  glowColor: string;
}

// ─── Deterministic pseudo-random ──────────────────────────

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Gradient Sky ─────────────────────────────────────────

interface GradientSkyProps {
  id: string;
  stops: GradientStop[];
  /** Optional animated hue rotation in degrees per frame */
  hueShift?: number;
  frame?: number;
}

export const GradientSky: React.FC<GradientSkyProps> = ({ id, stops }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map((s, i) => (
          <stop
            key={i}
            offset={s.offset}
            stopColor={s.color}
            stopOpacity={s.opacity ?? 1}
          />
        ))}
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id})`} />
  </g>
);

// ─── Cloud Layer ──────────────────────────────────────────

interface CloudLayerProps {
  clouds: CloudConfig[];
  frame: number;
  /** Unique prefix for gradient IDs to avoid collisions between sky instances */
  idPrefix: string;
}

/**
 * Renders organic-looking clouds. Each cloud is a main ellipse
 * surrounded by smaller "blob" ellipses for a puffy, painterly look.
 * Clouds drift horizontally with parallax (bigger = slower = farther).
 */
export const CloudLayer: React.FC<CloudLayerProps> = ({ clouds, frame, idPrefix }) => {
  const rng = seededRandom(42);

  return (
    <g>
      {/* Cloud-specific gradients */}
      <defs>
        {clouds.map((c, i) => (
          <radialGradient key={i} id={`${idPrefix}-cloud-${i}`} cx="0.4" cy="0.35" r="0.7">
            <stop offset="0%" stopColor={c.fill} stopOpacity={c.opacity} />
            <stop offset="50%" stopColor={c.fill} stopOpacity={c.opacity * 0.85} />
            <stop offset="100%" stopColor={c.fill} stopOpacity={c.opacity * 0.3} />
          </radialGradient>
        ))}
      </defs>

      {clouds.map((c, i) => {
        const drift = c.drift ?? 0.15;
        // Wrap around screen width with margin
        const totalWidth = 2400;
        const xOffset = ((frame * drift) % totalWidth + totalWidth) % totalWidth - 240;
        const cx = c.cx + xOffset;

        const blobCount = c.blobs ?? 3;

        return (
          <g key={i} opacity={c.opacity}>
            {/* Main cloud body */}
            <ellipse
              cx={cx}
              cy={c.cy}
              rx={c.rx}
              ry={c.ry}
              fill={`url(#${idPrefix}-cloud-${i})`}
            />
            {/* Sub-blobs for organic shape */}
            {Array.from({ length: blobCount }, (_, b) => {
              const angle = (b / blobCount) * Math.PI + rng() * 0.5;
              const dist = c.rx * (0.4 + rng() * 0.4);
              const blobRx = c.rx * (0.3 + rng() * 0.35);
              const blobRy = c.ry * (0.4 + rng() * 0.4);
              return (
                <ellipse
                  key={b}
                  cx={cx + Math.cos(angle) * dist}
                  cy={c.cy + Math.sin(angle) * dist * 0.4}
                  rx={blobRx}
                  ry={blobRy}
                  fill={`url(#${idPrefix}-cloud-${i})`}
                />
              );
            })}
            {/* Highlight on top edge */}
            <ellipse
              cx={cx - c.rx * 0.15}
              cy={c.cy - c.ry * 0.4}
              rx={c.rx * 0.5}
              ry={c.ry * 0.3}
              fill="white"
              opacity={0.08}
            />
          </g>
        );
      })}
    </g>
  );
};

// ─── Star Field ───────────────────────────────────────────

interface StarFieldProps {
  stars: StarConfig[];
  frame: number;
  /** Twinkle speed — higher = faster flicker */
  twinkleSpeed?: number;
}

/**
 * Renders a field of stars with individual twinkle animations.
 * Each star pulses between 40% and 100% opacity using a sine wave
 * offset by its unique phase.
 */
export const StarField: React.FC<StarFieldProps> = ({ stars, frame, twinkleSpeed = 0.06 }) => (
  <g>
    {stars.map((s, i) => {
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(frame * twinkleSpeed + s.phase * Math.PI * 2));
      const opacity = s.brightness * twinkle;
      const glowR = s.r * 3;
      return (
        <g key={i}>
          {/* Soft glow */}
          <circle cx={s.cx} cy={s.cy} r={glowR} fill="white" opacity={opacity * 0.12} />
          {/* Star core */}
          <circle cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={opacity} />
          {/* Cross sparkle for bright stars */}
          {s.r > 1.5 && (
            <>
              <line
                x1={s.cx - s.r * 2.5} y1={s.cy}
                x2={s.cx + s.r * 2.5} y2={s.cy}
                stroke="white" strokeWidth={0.4} opacity={opacity * 0.5}
              />
              <line
                x1={s.cx} y1={s.cy - s.r * 2.5}
                x2={s.cx} y2={s.cy + s.r * 2.5}
                stroke="white" strokeWidth={0.4} opacity={opacity * 0.5}
              />
            </>
          )}
        </g>
      );
    })}
  </g>
);

// ─── Celestial Body (Sun / Moon) ──────────────────────────

interface CelestialBodyProps {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  glowColor: string;
  glowRadius: number;
  frame: number;
  /** Crater details for moon */
  craters?: Array<{ cx: number; cy: number; r: number }>;
  /** Animated glow pulse amplitude (0-1) */
  pulseAmount?: number;
}

export const CelestialBody: React.FC<CelestialBodyProps> = ({
  cx, cy, r, fill, glowColor, glowRadius, frame,
  craters, pulseAmount = 0.08,
}) => {
  const pulse = 1 + Math.sin(frame * 0.03) * pulseAmount;
  const currentGlow = glowRadius * pulse;

  return (
    <g>
      <defs>
        <radialGradient id={`celestial-${cx}-${cy}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={glowColor} stopOpacity={0.5} />
          <stop offset="40%" stopColor={glowColor} stopOpacity={0.2} />
          <stop offset="70%" stopColor={glowColor} stopOpacity={0.05} />
          <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={currentGlow} fill={`url(#celestial-${cx}-${cy})`} />
      {/* Medium glow ring */}
      <circle cx={cx} cy={cy} r={r * 1.8} fill={glowColor} opacity={0.06} />
      {/* Body */}
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      {/* Highlight */}
      <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.5} fill="white" opacity={0.15} />
      {/* Craters (moon) */}
      {craters?.map((cr, i) => (
        <g key={i}>
          <circle cx={cx + cr.cx} cy={cy + cr.cy} r={cr.r} fill="rgba(0,0,0,0.08)" />
          <circle cx={cx + cr.cx + cr.r * 0.2} cy={cy + cr.cy + cr.r * 0.2} r={cr.r * 0.6} fill="rgba(0,0,0,0.05)" />
        </g>
      ))}
    </g>
  );
};

// ─── Lightning System ─────────────────────────────────────

interface LightningSystemProps {
  frame: number;
  /** Flash interval in frames (e.g. 90 = every 3 seconds at 30fps) */
  interval: number;
  /** Duration of each flash in frames */
  flashDuration: number;
  /** Bolt definitions */
  bolts: LightningBolt[];
  /** Overall flash overlay color */
  flashColor?: string;
  /** Random offset so multiple skies don't flash in sync */
  phaseOffset?: number;
}

/**
 * Event-based lightning: flashes occur at regular intervals.
 * Renders both the bolt path and a full-screen flash overlay.
 */
export const LightningSystem: React.FC<LightningSystemProps> = ({
  frame, interval, flashDuration, bolts, flashColor = 'rgba(255,255,255,0.3)',
  phaseOffset = 0,
}) => {
  const adjustedFrame = frame + phaseOffset;
  const cyclePos = adjustedFrame % interval;
  const isFlashing = cyclePos < flashDuration;

  if (!isFlashing) return null;

  // Flash intensity peaks at start, fades out
  const intensity = 1 - cyclePos / flashDuration;
  const flashOpacity = intensity * 0.35;

  // Pick which bolt to show based on cycle count
  const boltIndex = Math.floor(adjustedFrame / interval) % bolts.length;
  const bolt = bolts[boltIndex];

  // Build bolt path
  let pathD = `M${bolt.x},0`;
  let curX = bolt.x;
  let curY = 0;
  for (const seg of bolt.segments) {
    curX += seg.dx;
    curY += seg.dy;
    pathD += ` L${curX},${curY}`;
  }

  return (
    <g>
      {/* Full-screen flash overlay */}
      <rect x={0} y={0} width={1920} height={1080} fill={flashColor} opacity={flashOpacity} />
      {/* Bolt glow */}
      <path d={pathD} fill="none" stroke={bolt.glowColor} strokeWidth={bolt.width * 4}
        opacity={intensity * 0.4} strokeLinecap="round" strokeLinejoin="round" />
      {/* Bolt core */}
      <path d={pathD} fill="none" stroke={bolt.color} strokeWidth={bolt.width}
        opacity={intensity * 0.9} strokeLinecap="round" strokeLinejoin="round" />
      {/* Bolt bright center */}
      <path d={pathD} fill="none" stroke="white" strokeWidth={bolt.width * 0.3}
        opacity={intensity * 0.7} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

// ─── Particle Field ───────────────────────────────────────

interface ParticleFieldProps {
  config: ParticleConfig;
  frame: number;
}

/**
 * Renders a field of falling/drifting particles (rain, snow, sand).
 * Particles wrap around vertically and drift horizontally.
 * Uses seeded random for deterministic, reproducible layouts.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({ config, frame }) => {
  const rng = seededRandom(config.seed);
  const particles = Array.from({ length: config.count }, () => ({
    x: rng() * 2200 - 140,
    y: rng() * 1200,
    w: config.sizeRange[0] + rng() * (config.sizeRange[1] - config.sizeRange[0]),
    h: config.heightRange[0] + rng() * (config.heightRange[1] - config.heightRange[0]),
    speedMult: 0.7 + rng() * 0.6,
    opacityMult: 0.5 + rng() * 0.5,
    angle: -5 + rng() * 10,
  }));

  return (
    <g>
      {particles.map((p, i) => {
        const yPos = (p.y + frame * config.speedY * p.speedMult) % 1300 - 110;
        const xPos = p.x + frame * config.speedX * p.speedMult;
        const opacity = config.opacity * p.opacityMult;

        return (
          <rect
            key={i}
            x={xPos}
            y={yPos}
            width={p.w}
            height={p.h}
            rx={p.w * 0.3}
            ry={p.w * 0.3}
            fill={config.color}
            opacity={opacity}
            transform={`rotate(${p.angle}, ${xPos + p.w / 2}, ${yPos + p.h / 2})`}
          />
        );
      })}
    </g>
  );
};

// ─── Atmospheric Haze ─────────────────────────────────────

interface AtmosphericHazeProps {
  /** Color of the haze (usually matches horizon) */
  color: string;
  /** 0-1 intensity */
  intensity: number;
  /** Y position where haze is densest (0-1 of viewport, default 0.85) */
  horizonY?: number;
  id: string;
}

/**
 * Renders a gradient haze that's thickest near the horizon
 * and fades upward. Creates depth and unifies sky with terrain.
 */
export const AtmosphericHaze: React.FC<AtmosphericHazeProps> = ({
  color, intensity, horizonY = 0.85, id,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0} />
        <stop offset={`${horizonY * 70}%`} stopColor={color} stopOpacity={intensity * 0.15} />
        <stop offset={`${horizonY * 100}%`} stopColor={color} stopOpacity={intensity * 0.6} />
        <stop offset="100%" stopColor={color} stopOpacity={intensity * 0.8} />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}-haze)`} />
  </g>
);

// ─── Horizon Glow ─────────────────────────────────────────

interface HorizonGlowProps {
  color: string;
  cy: number;
  rx: number;
  ry: number;
  opacity: number;
  id: string;
  frame?: number;
  pulseAmount?: number;
}

/**
 * Radial glow centered at the horizon — used for sunrise/sunset
 * light bleeding upward, or moonlight reflecting off clouds.
 */
export const HorizonGlow: React.FC<HorizonGlowProps> = ({
  color, cy, rx, ry, opacity, id, frame = 0, pulseAmount = 0,
}) => {
  const pulse = 1 + Math.sin(frame * 0.02) * pulseAmount;

  return (
    <g>
      <defs>
        <radialGradient id={`${id}-hglow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <stop offset="40%" stopColor={color} stopOpacity={opacity * 0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse
        cx={960}
        cy={cy}
        rx={rx * pulse}
        ry={ry * pulse}
        fill={`url(#${id}-hglow)`}
      />
    </g>
  );
};

// ─── Star generator utility ───────────────────────────────

/**
 * Generates a deterministic star field. Use once per sky, store the result.
 * @param count Number of stars
 * @param seed Random seed
 * @param maxY Stars won't appear below this Y (default 700 = above horizon)
 * @param brightStarChance Chance a star is "bright" (larger, with sparkle)
 */
export function generateStars(
  count: number,
  seed: number,
  maxY = 700,
  brightStarChance = 0.08,
): StarConfig[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => {
    const isBright = rng() < brightStarChance;
    return {
      cx: rng() * 1920,
      cy: rng() * maxY,
      r: isBright ? 1.2 + rng() * 1.5 : 0.4 + rng() * 0.8,
      brightness: isBright ? 0.7 + rng() * 0.3 : 0.3 + rng() * 0.4,
      phase: rng(),
    };
  });
}

// ─── Cloud presets utility ────────────────────────────────

/**
 * Generates a set of clouds with controlled randomness.
 * Useful for quickly populating a sky variant.
 */
export function generateClouds(
  count: number,
  seed: number,
  opts: {
    yRange: [number, number];
    rxRange: [number, number];
    ryRange: [number, number];
    fill: string;
    opacityRange: [number, number];
    driftRange: [number, number];
    blobRange: [number, number];
  },
): CloudConfig[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    cx: rng() * 2200 - 140,
    cy: opts.yRange[0] + rng() * (opts.yRange[1] - opts.yRange[0]),
    rx: opts.rxRange[0] + rng() * (opts.rxRange[1] - opts.rxRange[0]),
    ry: opts.ryRange[0] + rng() * (opts.ryRange[1] - opts.ryRange[0]),
    fill: opts.fill,
    opacity: opts.opacityRange[0] + rng() * (opts.opacityRange[1] - opts.opacityRange[0]),
    drift: opts.driftRange[0] + rng() * (opts.driftRange[1] - opts.driftRange[0]),
    blobs: Math.floor(opts.blobRange[0] + rng() * (opts.blobRange[1] - opts.blobRange[0])),
  }));
}
