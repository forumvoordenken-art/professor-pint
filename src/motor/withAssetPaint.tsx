/**
 * withAssetPaint — Higher-Order Component for per-asset painterly effects
 *
 * Wraps any asset component (sky, terrain, character) with appropriate
 * SVG-based paint effects. Applied at the index/registry level so:
 *
 * - Zero changes needed to individual asset files
 * - Every asset automatically gets painterly treatment
 * - Different presets per asset category (sky vs terrain vs character)
 * - Easy to tune or disable per category
 *
 * Effect split:
 *   PER-ASSET (this HOC):
 *     - Oil paint edge displacement (subtle imperfect edges)
 *     - Canvas/paper texture overlay
 *
 *   PER-SCENE (PaintEffect wrapper, separate):
 *     - Color grading (golden hour, moonlit, etc.)
 *     - Vignette (dark frame edges)
 *     - Film grain (animated per frame)
 *
 * This split makes sense because:
 * - Edge displacement should match each asset's detail level
 * - Canvas texture should be per-surface, not double-applied
 * - Color grading depends on the whole scene mood, not one asset
 * - Vignette is always a full-frame effect
 */

import React from 'react';
import type { AssetProps } from './SceneComposer';

// ─── Asset Paint Presets ─────────────────────────────────

export type AssetPaintCategory =
  | 'sky_day'
  | 'sky_twilight'
  | 'sky_night'
  | 'sky_storm'
  | 'sky_special'
  | 'terrain'
  | 'terrain_indoor'
  | 'character'
  | 'none';

interface AssetPaintConfig {
  /** Oil paint displacement amount (px). 0 = disabled. */
  displacement: number;
  /** Turbulence frequency for displacement noise */
  turbFrequency: number;
  /** Canvas grain base frequency */
  grainFrequency: number;
  /** Canvas grain octaves */
  grainOctaves: number;
  /** Canvas grain opacity */
  grainOpacity: number;
  /** CSS blend mode for grain */
  grainBlend: string;
  /** Edge roughening radius (0 = off) */
  edgeRadius: number;
  /** Color enrichment: bump saturation slightly */
  saturationBoost: number;
}

const ASSET_PAINT_CONFIGS: Record<AssetPaintCategory, AssetPaintConfig> = {
  sky_day: {
    displacement: 3.0,       // Zichtbare edge wobble op wolkenranden
    turbFrequency: 0.02,
    grainFrequency: 0.45,
    grainOctaves: 3,
    grainOpacity: 0.09,      // Duidelijk zichtbaar canvas
    grainBlend: 'multiply',
    edgeRadius: 0,
    saturationBoost: 1.08,
  },
  sky_twilight: {
    displacement: 4.0,       // Meer wobble — sunset wolken mogen wild
    turbFrequency: 0.018,
    grainFrequency: 0.35,
    grainOctaves: 4,
    grainOpacity: 0.11,
    grainBlend: 'overlay',
    edgeRadius: 0,
    saturationBoost: 1.12,   // Sunset kleuren pompen
  },
  sky_night: {
    displacement: 1.5,       // Subtiel — sterren moeten scherp blijven
    turbFrequency: 0.012,
    grainFrequency: 0.55,
    grainOctaves: 2,
    grainOpacity: 0.06,
    grainBlend: 'multiply',
    edgeRadius: 0,
    saturationBoost: 1.05,
  },
  sky_storm: {
    displacement: 5.0,       // Flink — storm wolken mogen chaotisch
    turbFrequency: 0.025,
    grainFrequency: 0.3,
    grainOctaves: 4,
    grainOpacity: 0.13,
    grainBlend: 'multiply',
    edgeRadius: 0,
    saturationBoost: 1.06,
  },
  sky_special: {
    displacement: 3.0,
    turbFrequency: 0.02,
    grainFrequency: 0.4,
    grainOctaves: 3,
    grainOpacity: 0.09,
    grainBlend: 'multiply',
    edgeRadius: 0,
    saturationBoost: 1.07,
  },
  terrain: {
    displacement: 4.5,       // Terrains hebben meer textuur nodig
    turbFrequency: 0.025,
    grainFrequency: 0.5,
    grainOctaves: 4,
    grainOpacity: 0.12,
    grainBlend: 'multiply',
    edgeRadius: 0.6,         // Zichtbare edge roughening
    saturationBoost: 1.10,
  },
  terrain_indoor: {
    displacement: 2.0,       // Indoor al gedetailleerd
    turbFrequency: 0.018,
    grainFrequency: 0.6,
    grainOctaves: 3,
    grainOpacity: 0.08,
    grainBlend: 'multiply',
    edgeRadius: 0,
    saturationBoost: 1.05,
  },
  character: {
    displacement: 1.8,       // Gezicht leesbaar maar toch painterly
    turbFrequency: 0.02,
    grainFrequency: 0.5,
    grainOctaves: 3,
    grainOpacity: 0.07,
    grainBlend: 'soft-light',
    edgeRadius: 0,
    saturationBoost: 1.06,
  },
  none: {
    displacement: 0,
    turbFrequency: 0,
    grainFrequency: 0,
    grainOctaves: 0,
    grainOpacity: 0,
    grainBlend: 'normal',
    edgeRadius: 0,
    saturationBoost: 1,
  },
};

// ─── SVG Paint Filter (inline, self-contained) ──────────

interface SvgAssetPaintProps {
  id: string;
  config: AssetPaintConfig;
  frame: number;
  children: React.ReactNode;
}

/**
 * Self-contained SVG paint filter that wraps asset content.
 * Renders the filter defs + a filtered group, all inside one SVG.
 *
 * This is the core rendering unit — the HOC below creates this
 * automatically for each wrapped asset.
 */
export { ASSET_PAINT_CONFIGS };

export const SvgAssetPaint: React.FC<SvgAssetPaintProps> = ({
  id,
  config,
  frame,
  children,
}) => {
  const cfg = config;
  const filterId = `${id}-asset-paint`;
  const grainId = `${id}-asset-grain`;

  // Slow seed drift for organic displacement feel
  const seed = Math.floor(((frame * 0.003 + 7.3) % 10) + 5);

  // Animated grain seed — changes every frame for living canvas texture
  // (like real oil paint catching light at different micro-angles)
  const grainSeed = (frame * 3 + 47) % 999;

  // Build saturation matrix values
  const s = cfg.saturationBoost;
  const sr = (1 - s) * 0.2126;
  const sg = (1 - s) * 0.7152;
  const sb = (1 - s) * 0.0722;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Hidden SVG with filter definitions */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          {/* Main paint filter: displacement + saturation */}
          {cfg.displacement > 0 && (
            <filter
              id={filterId}
              x="-3%"
              y="-3%"
              width="106%"
              height="106%"
              colorInterpolationFilters="sRGB"
            >
              {/* Noise for edge displacement */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency={cfg.turbFrequency}
                numOctaves={2}
                seed={seed}
                result="paintNoise"
              />

              {/* Displace edges for hand-painted feel */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="paintNoise"
                scale={cfg.displacement}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />

              {/* Optional edge roughening */}
              {cfg.edgeRadius > 0 ? (
                <>
                  <feMorphology
                    in="displaced"
                    operator="dilate"
                    radius={cfg.edgeRadius * 0.5}
                    result="dilated"
                  />
                  <feMorphology
                    in="displaced"
                    operator="erode"
                    radius={cfg.edgeRadius * 0.3}
                    result="eroded"
                  />
                  <feComposite
                    in="dilated"
                    in2="eroded"
                    operator="atop"
                    result="roughened"
                  />
                  {/* Saturation boost */}
                  <feColorMatrix
                    in="roughened"
                    type="matrix"
                    values={`
                      ${sr + s} ${sg}     ${sb}     0 0
                      ${sr}     ${sg + s} ${sb}     0 0
                      ${sr}     ${sg}     ${sb + s} 0 0
                      0         0         0         1 0
                    `}
                  />
                </>
              ) : (
                /* Just saturation boost without edge roughening */
                <feColorMatrix
                  in="displaced"
                  type="matrix"
                  values={`
                    ${sr + s} ${sg}     ${sb}     0 0
                    ${sr}     ${sg + s} ${sb}     0 0
                    ${sr}     ${sg}     ${sb + s} 0 0
                    0         0         0         1 0
                  `}
                />
              )}
            </filter>
          )}
        </defs>
      </svg>

      {/* Asset content with paint filter applied via CSS */}
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: cfg.displacement > 0 ? `url(#${filterId})` : undefined,
        }}
      >
        {children}
      </div>

      {/* Canvas grain texture overlay */}
      {cfg.grainOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            mixBlendMode: cfg.grainBlend as React.CSSProperties['mixBlendMode'],
            opacity: cfg.grainOpacity,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={cfg.grainFrequency}
                  numOctaves={cfg.grainOctaves}
                  seed={grainSeed}
                  result="grain"
                />
                <feColorMatrix
                  in="grain"
                  type="saturate"
                  values="0"
                />
              </filter>
            </defs>
            <rect
              x={0}
              y={0}
              width={1920}
              height={1080}
              filter={`url(#${grainId})`}
            />
          </svg>
        </div>
      )}

      {/* Impasto highlight — simulates thick paint catching light
       * Uses a separate noise pattern blended as soft-light to create
       * subtle raised/lowered paint texture visible on edges.
       * Only applied for categories with significant displacement. */}
      {cfg.displacement >= 3.0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            mixBlendMode: 'soft-light',
            opacity: Math.min(cfg.displacement * 0.012, 0.06),
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id={`${id}-impasto`} x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                  type="turbulence"
                  baseFrequency={cfg.turbFrequency * 1.5}
                  numOctaves={3}
                  seed={seed + 200}
                  result="impastoNoise"
                />
                {/* Emboss-like directional light (top-left source) */}
                <feConvolveMatrix
                  in="impastoNoise"
                  order="3"
                  kernelMatrix="-1 -1 0 -1 1 1 0 1 1"
                  divisor="1"
                  bias="0.5"
                  result="embossed"
                />
                <feColorMatrix
                  in="embossed"
                  type="saturate"
                  values="0"
                />
              </filter>
            </defs>
            <rect
              x={0}
              y={0}
              width={1920}
              height={1080}
              filter={`url(#${id}-impasto)`}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

// ─── The HOC ─────────────────────────────────────────────

/**
 * Wraps an asset component with per-asset painterly effects.
 *
 * Usage in index files:
 *   const PaintedDayClear = withAssetPaint(DayClear, 'sky_day', 'day-clear');
 *   registerAsset('sky_day_clear', PaintedDayClear);
 *
 * The wrapped component has the same props as the original (AssetProps).
 * The HOC just adds an outer layer with SVG filters + canvas grain.
 */
export function withAssetPaint(
  Component: React.FC<AssetProps>,
  category: AssetPaintCategory,
  id: string,
): React.FC<AssetProps> {
  if (category === 'none') return Component;

  const config = ASSET_PAINT_CONFIGS[category];

  const PaintedAsset: React.FC<AssetProps> = (props) => (
    <SvgAssetPaint
      id={id}
      config={config}
      frame={props.frame}
    >
      <Component {...props} />
    </SvgAssetPaint>
  );

  PaintedAsset.displayName = `Painted(${Component.displayName || Component.name || id})`;
  return PaintedAsset;
}

/**
 * Convenience: maps sky category strings to paint categories.
 */
export function skyPaintCategory(category: string): AssetPaintCategory {
  switch (category) {
    case 'day': return 'sky_day';
    case 'twilight': return 'sky_twilight';
    case 'night': return 'sky_night';
    case 'storm': return 'sky_storm';
    case 'special': return 'sky_special';
    default: return 'sky_day';
  }
}

/**
 * Convenience: maps terrain category strings to paint categories.
 */
export function terrainPaintCategory(category: string): AssetPaintCategory {
  switch (category) {
    case 'indoor': return 'terrain_indoor';
    default: return 'terrain';
  }
}
