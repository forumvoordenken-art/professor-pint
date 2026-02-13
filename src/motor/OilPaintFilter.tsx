/**
 * OilPaintFilter — SVG Filter Chain for Painterly Post-Processing
 *
 * Applies a multi-stage SVG filter pipeline to transform clean vector
 * graphics into an oil-painting aesthetic:
 *
 * 1. feTurbulence → generates Perlin noise for brush-stroke displacement
 * 2. feDisplacementMap → warps edges organically (paint doesn't have pixel-perfect lines)
 * 3. feConvolveMatrix → emboss/impasto effect (raised paint texture)
 * 4. feGaussianBlur → subtle softening for painted look
 * 5. feColorMatrix → warm saturation boost (oil paintings have rich color)
 *
 * Usage:
 *   <OilPaintFilter id="scene-paint" strength="medium">
 *     <YourSVGContent />
 *   </OilPaintFilter>
 *
 * All components render inside a 1920×1080 SVG coordinate space.
 * The filter is defined once in <defs> and applied via CSS filter property.
 */

import React from 'react';
import { longCycleNoise } from '../assets/skies/SkyEngine';

// ─── Filter Presets ──────────────────────────────────────

export type PaintStrength = 'subtle' | 'medium' | 'heavy' | 'custom';

interface PaintFilterConfig {
  /** Turbulence frequency — lower = larger brush strokes */
  turbulenceFreq: number;
  /** Number of turbulence octaves (detail levels) */
  turbulenceOctaves: number;
  /** Displacement scale — how much edges warp */
  displacementScale: number;
  /** Emboss strength (0 = off, 1 = subtle, 3 = heavy impasto) */
  embossStrength: number;
  /** Final blur radius for softening */
  softBlur: number;
  /** Saturation boost (1.0 = no change, 1.3 = rich oil colors) */
  saturation: number;
  /** Warm color shift — mimics yellowed oil varnish */
  warmth: number;
}

const PRESETS: Record<Exclude<PaintStrength, 'custom'>, PaintFilterConfig> = {
  subtle: {
    turbulenceFreq: 0.015,
    turbulenceOctaves: 2,
    displacementScale: 2,
    embossStrength: 0.3,
    softBlur: 0.3,
    saturation: 1.08,
    warmth: 0.02,
  },
  medium: {
    turbulenceFreq: 0.012,
    turbulenceOctaves: 3,
    displacementScale: 4,
    embossStrength: 0.6,
    softBlur: 0.5,
    saturation: 1.15,
    warmth: 0.04,
  },
  heavy: {
    turbulenceFreq: 0.008,
    turbulenceOctaves: 4,
    displacementScale: 7,
    embossStrength: 1.2,
    softBlur: 0.8,
    saturation: 1.25,
    warmth: 0.06,
  },
};

// ─── Main Component ──────────────────────────────────────

interface OilPaintFilterProps {
  /** Unique ID for this filter instance (avoids SVG id collisions) */
  id: string;
  /** Preset strength or 'custom' with config prop */
  strength?: PaintStrength;
  /** Custom config (only used when strength='custom') */
  config?: PaintFilterConfig;
  /** Current animation frame for subtle filter animation */
  frame?: number;
  /** Whether the filter is enabled (allows toggling for performance) */
  enabled?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps SVG content with an oil-painting filter chain.
 * The filter is defined in an inline SVG <defs> block and referenced
 * via CSS filter: url(#...) on the wrapper div.
 *
 * When enabled=false, children render without any filter (zero cost).
 */
export const OilPaintFilter: React.FC<OilPaintFilterProps> = ({
  id,
  strength = 'medium',
  config,
  frame = 0,
  enabled = true,
  children,
}) => {
  const cfg = strength === 'custom' && config ? config : PRESETS[strength === 'custom' ? 'medium' : strength];

  // Subtle animation: turbulence seed drifts very slowly over time
  // This prevents the filter from looking static/frozen
  const turbSeed = Math.floor(longCycleNoise(frame * 0.01, 777) * 3 + 5);

  if (!enabled) {
    return <>{children}</>;
  }

  // Build the saturation + warmth color matrix
  // Standard SVG saturate matrix with warmth offset
  const s = cfg.saturation;
  const w = cfg.warmth;

  const filterId = `${id}-oil-paint`;

  return (
    <>
      {/* Hidden SVG just for filter definitions */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            {/* Stage 1: Generate Perlin noise for brush-stroke texture */}
            <feTurbulence
              type="turbulence"
              baseFrequency={cfg.turbulenceFreq}
              numOctaves={cfg.turbulenceOctaves}
              seed={turbSeed}
              result="noise"
            />

            {/* Stage 2: Displace edges using noise — makes lines organic */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={cfg.displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            {/* Stage 3: Emboss / impasto effect — raised paint texture */}
            {cfg.embossStrength > 0 && (
              <feConvolveMatrix
                in="displaced"
                order="3"
                kernelMatrix={`
                  ${-cfg.embossStrength}  ${-cfg.embossStrength}  0
                  ${-cfg.embossStrength}   1                       ${cfg.embossStrength}
                   0                       ${cfg.embossStrength}   ${cfg.embossStrength}
                `}
                divisor="1"
                bias="0"
                preserveAlpha="true"
                result="embossed"
              />
            )}

            {/* Stage 4: Soft blur — oil paint doesn't have sharp edges */}
            <feGaussianBlur
              in={cfg.embossStrength > 0 ? 'embossed' : 'displaced'}
              stdDeviation={cfg.softBlur}
              result="blurred"
            />

            {/* Stage 5: Color enrichment — warm saturation boost */}
            <feColorMatrix
              in="blurred"
              type="matrix"
              values={`
                ${0.213 + 0.787 * s}  ${0.715 - 0.715 * s}  ${0.072 - 0.072 * s}  0  ${w}
                ${0.213 - 0.213 * s}  ${0.715 + 0.285 * s}  ${0.072 - 0.072 * s}  0  ${w * 0.5}
                ${0.213 - 0.213 * s}  ${0.715 - 0.715 * s}  ${0.072 + 0.928 * s}  0  0
                0                     0                      0                      1  0
              `}
              result="colored"
            />

            {/* Stage 6: Blend original back for detail preservation */}
            <feBlend
              in="colored"
              in2="SourceGraphic"
              mode="normal"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      {/* Apply filter to all children via CSS */}
      <div style={{ filter: `url(#${filterId})` }}>
        {children}
      </div>
    </>
  );
};

// ─── Inline SVG Filter (for use inside SVG elements) ─────

interface SvgPaintFilterDefsProps {
  id: string;
  strength?: Exclude<PaintStrength, 'custom'>;
  frame?: number;
}

/**
 * Renders just the <defs> block with the paint filter.
 * Use this inside an existing <svg> element when you can't wrap with OilPaintFilter.
 *
 * Apply via: <g filter="url(#your-id-oil-paint)">...</g>
 */
export const SvgPaintFilterDefs: React.FC<SvgPaintFilterDefsProps> = ({
  id,
  strength = 'medium',
  frame = 0,
}) => {
  const cfg = PRESETS[strength];
  const turbSeed = Math.floor(longCycleNoise(frame * 0.01, 777) * 3 + 5);
  const s = cfg.saturation;
  const w = cfg.warmth;
  const filterId = `${id}-oil-paint`;

  return (
    <defs>
      <filter
        id={filterId}
        x="-5%"
        y="-5%"
        width="110%"
        height="110%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="turbulence"
          baseFrequency={cfg.turbulenceFreq}
          numOctaves={cfg.turbulenceOctaves}
          seed={turbSeed}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={cfg.displacementScale}
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        {cfg.embossStrength > 0 && (
          <feConvolveMatrix
            in="displaced"
            order="3"
            kernelMatrix={`
              ${-cfg.embossStrength}  ${-cfg.embossStrength}  0
              ${-cfg.embossStrength}   1                       ${cfg.embossStrength}
               0                       ${cfg.embossStrength}   ${cfg.embossStrength}
            `}
            divisor="1"
            bias="0"
            preserveAlpha="true"
            result="embossed"
          />
        )}
        <feGaussianBlur
          in={cfg.embossStrength > 0 ? 'embossed' : 'displaced'}
          stdDeviation={cfg.softBlur}
          result="blurred"
        />
        <feColorMatrix
          in="blurred"
          type="matrix"
          values={`
            ${0.213 + 0.787 * s}  ${0.715 - 0.715 * s}  ${0.072 - 0.072 * s}  0  ${w}
            ${0.213 - 0.213 * s}  ${0.715 + 0.285 * s}  ${0.072 - 0.072 * s}  0  ${w * 0.5}
            ${0.213 - 0.213 * s}  ${0.715 - 0.715 * s}  ${0.072 + 0.928 * s}  0  0
            0                     0                      0                      1  0
          `}
          result="final"
        />
      </filter>
    </defs>
  );
};

// ─── Edge Roughen Filter ─────────────────────────────────

interface EdgeRoughenFilterDefsProps {
  id: string;
  /** How much edges jitter (1-5 typical) */
  roughness?: number;
  frame?: number;
}

/**
 * SVG filter that roughens edges — makes vector art look hand-drawn.
 * Apply to individual elements or groups for selective roughening.
 *
 * Usage inside SVG:
 *   <EdgeRoughenFilterDefs id="rough" roughness={2} />
 *   <g filter="url(#rough-edge-roughen)">
 *     <path d="..." />
 *   </g>
 */
export const EdgeRoughenFilterDefs: React.FC<EdgeRoughenFilterDefsProps> = ({
  id,
  roughness = 2,
  frame = 0,
}) => {
  const seed = Math.floor(longCycleNoise(frame * 0.005, 333) * 5 + 10);
  const filterId = `${id}-edge-roughen`;

  return (
    <defs>
      <filter id={filterId} x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={0.04}
          numOctaves={3}
          seed={seed}
          result="edgeNoise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="edgeNoise"
          scale={roughness}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  );
};

// ─── Vignette Filter ─────────────────────────────────────

interface VignetteProps {
  /** Unique ID */
  id: string;
  /** How dark the edges get (0-1, default 0.4) */
  intensity?: number;
  /** Size of the clear center (0-1, default 0.5) */
  radius?: number;
  /** Vignette color (default black) */
  color?: string;
}

/**
 * Cinematic vignette overlay — darkens edges of the frame.
 * Renders as a radial gradient overlay in a 1920x1080 space.
 */
export const Vignette: React.FC<VignetteProps> = ({
  id,
  intensity = 0.4,
  radius = 0.5,
  color = '#000000',
}) => (
  <svg
    viewBox="0 0 1920 1080"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }}
  >
    <defs>
      <radialGradient id={`${id}-vignette`} cx="0.5" cy="0.5" r={radius}>
        <stop offset="0%" stopColor={color} stopOpacity={0} />
        <stop offset="70%" stopColor={color} stopOpacity={0} />
        <stop offset="90%" stopColor={color} stopOpacity={intensity * 0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={intensity} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}-vignette)`} />
  </svg>
);

// ─── Color Grading Overlay ───────────────────────────────

interface ColorGradeProps {
  /** Preset: warm golden hour, cool moonlit, sepia aged, etc. */
  preset: 'golden' | 'moonlit' | 'sepia' | 'emerald' | 'none';
  /** Intensity 0-1 (how strongly the grade is applied) */
  intensity?: number;
}

const COLOR_GRADE_MAP: Record<string, { color: string; blendMode: string; opacity: number }> = {
  golden: { color: 'rgba(255, 200, 100, 1)', blendMode: 'multiply', opacity: 0.12 },
  moonlit: { color: 'rgba(100, 130, 200, 1)', blendMode: 'screen', opacity: 0.08 },
  sepia: { color: 'rgba(180, 140, 80, 1)', blendMode: 'multiply', opacity: 0.15 },
  emerald: { color: 'rgba(80, 180, 120, 1)', blendMode: 'multiply', opacity: 0.08 },
};

/**
 * Full-screen color grading overlay.
 * Applies a subtle tint to the entire scene for mood consistency.
 */
export const ColorGrade: React.FC<ColorGradeProps> = ({
  preset,
  intensity = 1,
}) => {
  if (preset === 'none') return null;
  const grade = COLOR_GRADE_MAP[preset];
  if (!grade) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: grade.color,
        mixBlendMode: grade.blendMode as React.CSSProperties['mixBlendMode'],
        opacity: grade.opacity * intensity,
        pointerEvents: 'none',
      }}
    />
  );
};
