/**
 * TextureOverlay — Canvas/Paper Texture + Kuwahara-style Post-Processing
 *
 * Combines two visual quality techniques:
 *
 * 1. Canvas Texture: SVG-generated noise patterns that simulate real canvas
 *    or watercolor paper grain. Applied as semi-transparent overlays with
 *    CSS blend modes (multiply, overlay, soft-light).
 *
 * 2. Kuwahara Approximation: Since true Kuwahara requires WebGL, we use
 *    SVG filter primitives to approximate the effect:
 *    - Bilateral blur (gaussian + edge-preserving via morphology)
 *    - Color quantization via feComponentTransfer
 *    - Produces a "painted flat areas with preserved edges" look
 *
 * Usage:
 *   <CanvasTexture preset="linen" opacity={0.08} />
 *   <KuwaharaFilter id="scene-kuw" strength="medium">
 *     <YourContent />
 *   </KuwaharaFilter>
 *
 * All overlays render in 1920×1080 coordinate space.
 */

import React from 'react';
import { longCycleNoise } from '../assets/skies/SkyEngine';

// ─── Canvas Texture Presets ──────────────────────────────

export type CanvasPreset = 'linen' | 'watercolor' | 'burlap' | 'parchment' | 'smooth';

interface CanvasTextureConfig {
  /** Base frequency for feTurbulence (lower = coarser grain) */
  frequency: number;
  /** Turbulence octaves (more = finer detail) */
  octaves: number;
  /** Color of the texture grain */
  grainColor: string;
  /** Secondary color for variation */
  secondaryColor: string;
  /** Blend mode for the overlay */
  blendMode: string;
  /** Default opacity */
  defaultOpacity: number;
  /** feTurbulence type: 'fractalNoise' or 'turbulence' */
  noiseType: 'fractalNoise' | 'turbulence';
}

const CANVAS_PRESETS: Record<CanvasPreset, CanvasTextureConfig> = {
  linen: {
    frequency: 0.65,
    octaves: 4,
    grainColor: '#8A7A60',
    secondaryColor: '#6A5A40',
    blendMode: 'multiply',
    defaultOpacity: 0.06,
    noiseType: 'fractalNoise',
  },
  watercolor: {
    frequency: 0.02,
    octaves: 5,
    grainColor: '#A09080',
    secondaryColor: '#B0A090',
    blendMode: 'overlay',
    defaultOpacity: 0.08,
    noiseType: 'turbulence',
  },
  burlap: {
    frequency: 1.2,
    octaves: 2,
    grainColor: '#7A6A50',
    secondaryColor: '#5A4A30',
    blendMode: 'multiply',
    defaultOpacity: 0.05,
    noiseType: 'fractalNoise',
  },
  parchment: {
    frequency: 0.04,
    octaves: 6,
    grainColor: '#C8B898',
    secondaryColor: '#A89870',
    blendMode: 'soft-light',
    defaultOpacity: 0.1,
    noiseType: 'turbulence',
  },
  smooth: {
    frequency: 0.3,
    octaves: 3,
    grainColor: '#908070',
    secondaryColor: '#706050',
    blendMode: 'multiply',
    defaultOpacity: 0.04,
    noiseType: 'fractalNoise',
  },
};

// ─── Canvas Texture Component ────────────────────────────

interface CanvasTextureProps {
  /** Unique ID to avoid SVG filter collisions */
  id?: string;
  /** Texture preset */
  preset?: CanvasPreset;
  /** Override opacity (0-1) */
  opacity?: number;
  /** Animation frame for subtle texture drift */
  frame?: number;
  /** Enable/disable */
  enabled?: boolean;
}

/**
 * Full-screen canvas texture overlay.
 * Renders as an SVG with feTurbulence noise, tinted and blended
 * over the scene to simulate real canvas/paper grain.
 *
 * This is entirely procedural — no PNG assets needed.
 */
export const CanvasTexture: React.FC<CanvasTextureProps> = ({
  id = 'canvas-tex',
  preset = 'linen',
  opacity,
  frame = 0,
  enabled = true,
}) => {
  if (!enabled) return null;

  const cfg = CANVAS_PRESETS[preset];
  const effectiveOpacity = opacity ?? cfg.defaultOpacity;

  // Very slow seed drift so texture doesn't feel frozen
  const seed = Math.floor(longCycleNoise(frame * 0.002, 1234) * 3 + 7);

  const filterId = `${id}-canvas-filter`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: cfg.blendMode as React.CSSProperties['mixBlendMode'],
        opacity: effectiveOpacity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            {/* Generate base canvas noise */}
            <feTurbulence
              type={cfg.noiseType}
              baseFrequency={cfg.frequency}
              numOctaves={cfg.octaves}
              seed={seed}
              result="grain"
            />

            {/* Tint the noise to our grain color */}
            <feColorMatrix
              in="grain"
              type="matrix"
              values={`
                0.3 0 0 0 ${parseInt(cfg.grainColor.slice(1, 3), 16) / 255}
                0 0.3 0 0 ${parseInt(cfg.grainColor.slice(3, 5), 16) / 255}
                0 0 0.3 0 ${parseInt(cfg.grainColor.slice(5, 7), 16) / 255}
                0 0 0 1 0
              `}
              result="tinted"
            />
          </filter>
        </defs>

        {/* Full-screen rect with canvas texture filter */}
        <rect
          x={0}
          y={0}
          width={1920}
          height={1080}
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
};

// ─── Inline SVG Canvas Texture ───────────────────────────

interface SvgCanvasTextureProps {
  id: string;
  preset?: CanvasPreset;
  opacity?: number;
  frame?: number;
}

/**
 * Canvas texture for use directly inside an SVG element.
 * Renders a full-viewport rect with procedural noise filter.
 */
export const SvgCanvasTexture: React.FC<SvgCanvasTextureProps> = ({
  id,
  preset = 'linen',
  opacity,
  frame = 0,
}) => {
  const cfg = CANVAS_PRESETS[preset];
  const effectiveOpacity = opacity ?? cfg.defaultOpacity;
  const seed = Math.floor(longCycleNoise(frame * 0.002, 1234) * 3 + 7);
  const filterId = `${id}-svgcanvas`;

  return (
    <g opacity={effectiveOpacity}>
      <defs>
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type={cfg.noiseType}
            baseFrequency={cfg.frequency}
            numOctaves={cfg.octaves}
            seed={seed}
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values={`
              0.3 0 0 0 ${parseInt(cfg.grainColor.slice(1, 3), 16) / 255}
              0 0.3 0 0 ${parseInt(cfg.grainColor.slice(3, 5), 16) / 255}
              0 0 0.3 0 ${parseInt(cfg.grainColor.slice(5, 7), 16) / 255}
              0 0 0 1 0
            `}
            result="tinted"
          />
        </filter>
      </defs>
      <rect
        x={0}
        y={0}
        width={1920}
        height={1080}
        filter={`url(#${filterId})`}
      />
    </g>
  );
};

// ─── Kuwahara Approximation Filter ──────────────────────

export type KuwaharaStrength = 'subtle' | 'medium' | 'heavy';

interface KuwaharaConfig {
  /** Blur radius for the smoothing pass */
  blurRadius: number;
  /** Morphology radius for edge preservation */
  edgeRadius: number;
  /** Color quantization steps (lower = more painterly) */
  quantSteps: number;
  /** How much of the original detail to preserve (0-1) */
  detailMix: number;
}

const KUWAHARA_PRESETS: Record<KuwaharaStrength, KuwaharaConfig> = {
  subtle: {
    blurRadius: 0.8,
    edgeRadius: 0.5,
    quantSteps: 32,
    detailMix: 0.7,
  },
  medium: {
    blurRadius: 1.5,
    edgeRadius: 1.0,
    quantSteps: 20,
    detailMix: 0.5,
  },
  heavy: {
    blurRadius: 2.5,
    edgeRadius: 1.5,
    quantSteps: 12,
    detailMix: 0.3,
  },
};

interface KuwaharaFilterProps {
  id: string;
  strength?: KuwaharaStrength;
  enabled?: boolean;
  children: React.ReactNode;
}

/**
 * Kuwahara-style painterly post-processing using SVG filters.
 *
 * This is an approximation of the Kuwahara filter using available
 * SVG primitives. The true Kuwahara (which computes local mean/variance
 * in quadrants) requires shader code, but this SVG approach gets
 * surprisingly close:
 *
 * 1. Detect edges with feMorphology (dilate/erode difference)
 * 2. Smooth flat areas with feGaussianBlur
 * 3. Quantize colors with feComponentTransfer
 * 4. Blend edges back in for sharpness
 *
 * The result: smooth, flat-colored areas (like painted strokes)
 * with crisp edges preserved — the hallmark of Kuwahara.
 */
export const KuwaharaFilter: React.FC<KuwaharaFilterProps> = ({
  id,
  strength = 'medium',
  enabled = true,
  children,
}) => {
  if (!enabled) return <>{children}</>;

  const cfg = KUWAHARA_PRESETS[strength];
  const filterId = `${id}-kuwahara`;

  // Build quantization table values (staircase function)
  const steps = cfg.quantSteps;
  const tableValues = Array.from(
    { length: steps + 1 },
    (_, i) => Math.round((i / steps) * steps) / steps,
  ).join(' ');

  return (
    <>
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-2%"
            y="-2%"
            width="104%"
            height="104%"
            colorInterpolationFilters="sRGB"
          >
            {/* Step 1: Edge detection via morphology */}
            <feMorphology
              in="SourceGraphic"
              operator="dilate"
              radius={cfg.edgeRadius}
              result="dilated"
            />
            <feMorphology
              in="SourceGraphic"
              operator="erode"
              radius={cfg.edgeRadius}
              result="eroded"
            />

            {/* Step 2: Smooth the source */}
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={cfg.blurRadius}
              result="smoothed"
            />

            {/* Step 3: Quantize colors for painted flat-area look */}
            <feComponentTransfer in="smoothed" result="quantized">
              <feFuncR type="discrete" tableValues={tableValues} />
              <feFuncG type="discrete" tableValues={tableValues} />
              <feFuncB type="discrete" tableValues={tableValues} />
            </feComponentTransfer>

            {/* Step 4: Extract edges (difference between dilate and erode) */}
            <feComposite
              in="dilated"
              in2="eroded"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="-1"
              k4="0"
              result="edges"
            />

            {/* Step 5: Brighten edges for visibility */}
            <feColorMatrix
              in="edges"
              type="matrix"
              values={`
                3 0 0 0 0
                0 3 0 0 0
                0 0 3 0 0
                0 0 0 1 0
              `}
              result="brightEdges"
            />

            {/* Step 6: Blend quantized (smooth) with original based on detailMix */}
            <feBlend
              in="quantized"
              in2="SourceGraphic"
              mode="normal"
              result="mixed"
            />

            {/* Step 7: Darken edges slightly for definition */}
            <feComposite
              in="mixed"
              in2="brightEdges"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3={`-${0.06}`}
              k4="0"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: `url(#${filterId})` }}>
        {children}
      </div>
    </>
  );
};

// ─── Kuwahara SVG Defs (for use inside SVG) ─────────────

interface SvgKuwaharaDefsProps {
  id: string;
  strength?: KuwaharaStrength;
}

/**
 * Renders just the <defs> block with Kuwahara filter.
 * Apply via: <g filter="url(#your-id-kuwahara)">...</g>
 */
export const SvgKuwaharaDefs: React.FC<SvgKuwaharaDefsProps> = ({
  id,
  strength = 'medium',
}) => {
  const cfg = KUWAHARA_PRESETS[strength];
  const filterId = `${id}-kuwahara`;

  const steps = cfg.quantSteps;
  const tableValues = Array.from(
    { length: steps + 1 },
    (_, i) => Math.round((i / steps) * steps) / steps,
  ).join(' ');

  return (
    <defs>
      <filter
        id={filterId}
        x="-2%"
        y="-2%"
        width="104%"
        height="104%"
        colorInterpolationFilters="sRGB"
      >
        <feMorphology
          in="SourceGraphic"
          operator="dilate"
          radius={cfg.edgeRadius}
          result="dilated"
        />
        <feMorphology
          in="SourceGraphic"
          operator="erode"
          radius={cfg.edgeRadius}
          result="eroded"
        />
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation={cfg.blurRadius}
          result="smoothed"
        />
        <feComponentTransfer in="smoothed" result="quantized">
          <feFuncR type="discrete" tableValues={tableValues} />
          <feFuncG type="discrete" tableValues={tableValues} />
          <feFuncB type="discrete" tableValues={tableValues} />
        </feComponentTransfer>
        <feComposite
          in="dilated"
          in2="eroded"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="-1"
          k4="0"
          result="edges"
        />
        <feBlend
          in="quantized"
          in2="SourceGraphic"
          mode="normal"
        />
      </filter>
    </defs>
  );
};

// ─── Film Grain Overlay ──────────────────────────────────

interface FilmGrainProps {
  /** Unique ID */
  id?: string;
  /** Grain intensity (0-1, default 0.04) */
  intensity?: number;
  /** Grain size — lower = finer (default 0.8) */
  size?: number;
  /** Animation frame for grain animation */
  frame?: number;
  /** Enable/disable */
  enabled?: boolean;
}

/**
 * Animated film grain overlay — adds subtle noise per frame.
 * The seed changes with frame so grain "moves" like real film stock.
 * Very subtle by default — just enough to break up digital smoothness.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({
  id = 'film-grain',
  intensity = 0.04,
  size = 0.8,
  frame = 0,
  enabled = true,
}) => {
  if (!enabled) return null;

  // Change seed every frame for animated grain
  const seed = (frame * 7 + 13) % 1000;
  const filterId = `${id}-grain-filter`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: intensity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={size}
              numOctaves={2}
              seed={seed}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="mono"
            />
          </filter>
        </defs>
        <rect
          x={0}
          y={0}
          width={1920}
          height={1080}
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
};

// ─── Pigment Variation Overlay ───────────────────────────

interface PigmentVariationProps {
  id?: string;
  /** Base tint color */
  color?: string;
  /** Intensity 0-1 */
  intensity?: number;
  /** Scale of variation (lower = larger blotches) */
  scale?: number;
}

/**
 * Simulates pigment density variation in oil paint.
 * Oil paint doesn't dry uniformly — some areas are thicker/richer.
 * This adds subtle color density variation across the frame.
 */
export const PigmentVariation: React.FC<PigmentVariationProps> = ({
  id = 'pigment',
  color = '#8A7A60',
  intensity = 0.05,
  scale = 0.005,
}) => {
  const filterId = `${id}-pigment-filter`;
  const r = parseInt(color.slice(1, 3), 16) / 255;
  const g = parseInt(color.slice(3, 5), 16) / 255;
  const b = parseInt(color.slice(5, 7), 16) / 255;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        opacity: intensity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="turbulence"
              baseFrequency={scale}
              numOctaves={3}
              seed={42}
              result="pigment"
            />
            <feColorMatrix
              in="pigment"
              type="matrix"
              values={`
                0.2 0 0 0 ${r}
                0 0.2 0 0 ${g}
                0 0 0.2 0 ${b}
                0 0 0 1 0
              `}
            />
          </filter>
        </defs>
        <rect
          x={0}
          y={0}
          width={1920}
          height={1080}
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
};
