/**
 * PaintEffect — Master Post-Processing Wrapper
 *
 * Combines all visual quality enhancements into one component
 * that wraps around scene content. The order of effects matters:
 *
 * 1. Kuwahara filter (smooths flat areas, preserves edges)
 * 2. Oil paint filter (displacement + emboss + color enrichment)
 * 3. Canvas texture overlay (paper/canvas grain)
 * 4. Film grain (animated per-frame noise)
 * 5. Pigment variation (uneven paint density)
 * 6. Color grading (scene mood tint)
 * 7. Vignette (dark edges)
 *
 * Usage:
 *   <PaintEffect frame={frame} preset="standard">
 *     <SceneComposer scene={scene} />
 *   </PaintEffect>
 *
 * Or with SceneComposer directly:
 *   <PaintedScene scene={scene} paintPreset="cinematic" />
 *
 * The user's workflow doesn't change at all — this is infrastructure
 * that gets applied automatically to every scene.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { OilPaintFilter, Vignette, ColorGrade } from './OilPaintFilter';
import type { PaintStrength } from './OilPaintFilter';
import { CanvasTexture, FilmGrain, PigmentVariation, KuwaharaFilter } from './TextureOverlay';
import type { CanvasPreset, KuwaharaStrength } from './TextureOverlay';

// ─── Effect Presets ──────────────────────────────────────

export type PaintPreset = 'none' | 'subtle' | 'standard' | 'cinematic' | 'heavy' | 'custom';

interface PaintEffectConfig {
  /** Enable oil paint displacement filter */
  oilPaint: boolean;
  oilPaintStrength: PaintStrength;

  /** Enable Kuwahara color smoothing */
  kuwahara: boolean;
  kuwaharaStrength: KuwaharaStrength;

  /** Canvas texture overlay */
  canvasTexture: boolean;
  canvasPreset: CanvasPreset;
  canvasOpacity: number;

  /** Animated film grain */
  filmGrain: boolean;
  filmGrainIntensity: number;

  /** Pigment density variation */
  pigmentVariation: boolean;
  pigmentIntensity: number;

  /** Color grading */
  colorGrade: 'golden' | 'moonlit' | 'sepia' | 'emerald' | 'none';
  colorGradeIntensity: number;

  /** Vignette */
  vignette: boolean;
  vignetteIntensity: number;
}

const PRESETS: Record<Exclude<PaintPreset, 'custom'>, PaintEffectConfig> = {
  none: {
    oilPaint: false,
    oilPaintStrength: 'subtle',
    kuwahara: false,
    kuwaharaStrength: 'subtle',
    canvasTexture: false,
    canvasPreset: 'linen',
    canvasOpacity: 0,
    filmGrain: false,
    filmGrainIntensity: 0,
    pigmentVariation: false,
    pigmentIntensity: 0,
    colorGrade: 'none',
    colorGradeIntensity: 0,
    vignette: false,
    vignetteIntensity: 0,
  },
  subtle: {
    oilPaint: false,              // Skip heavy filter for performance
    oilPaintStrength: 'subtle',
    kuwahara: false,
    kuwaharaStrength: 'subtle',
    canvasTexture: true,          // Just canvas grain
    canvasPreset: 'smooth',
    canvasOpacity: 0.03,
    filmGrain: true,              // Light grain
    filmGrainIntensity: 0.025,
    pigmentVariation: true,       // Light pigment
    pigmentIntensity: 0.03,
    colorGrade: 'golden',
    colorGradeIntensity: 0.5,
    vignette: true,
    vignetteIntensity: 0.25,
  },
  standard: {
    oilPaint: true,               // Oil paint displacement
    oilPaintStrength: 'subtle',
    kuwahara: false,              // Skip Kuwahara (too heavy with oil paint)
    kuwaharaStrength: 'subtle',
    canvasTexture: true,
    canvasPreset: 'linen',
    canvasOpacity: 0.05,
    filmGrain: true,
    filmGrainIntensity: 0.035,
    pigmentVariation: true,
    pigmentIntensity: 0.04,
    colorGrade: 'golden',
    colorGradeIntensity: 0.7,
    vignette: true,
    vignetteIntensity: 0.35,
  },
  cinematic: {
    oilPaint: true,
    oilPaintStrength: 'medium',
    kuwahara: true,               // Full Kuwahara for maximum painterly
    kuwaharaStrength: 'subtle',
    canvasTexture: true,
    canvasPreset: 'watercolor',
    canvasOpacity: 0.06,
    filmGrain: true,
    filmGrainIntensity: 0.04,
    pigmentVariation: true,
    pigmentIntensity: 0.05,
    colorGrade: 'golden',
    colorGradeIntensity: 1.0,
    vignette: true,
    vignetteIntensity: 0.45,
  },
  heavy: {
    oilPaint: true,
    oilPaintStrength: 'heavy',
    kuwahara: true,
    kuwaharaStrength: 'medium',
    canvasTexture: true,
    canvasPreset: 'burlap',
    canvasOpacity: 0.08,
    filmGrain: true,
    filmGrainIntensity: 0.05,
    pigmentVariation: true,
    pigmentIntensity: 0.06,
    colorGrade: 'sepia',
    colorGradeIntensity: 1.0,
    vignette: true,
    vignetteIntensity: 0.5,
  },
};

// ─── PaintEffect Component ──────────────────────────────

interface PaintEffectProps {
  /** Current animation frame */
  frame?: number;
  /** Choose a preset or 'custom' with config */
  preset?: PaintPreset;
  /** Custom config (only when preset='custom') */
  config?: Partial<PaintEffectConfig>;
  /** Unique ID prefix (for SVG filter IDs) */
  id?: string;
  children: React.ReactNode;
}

/**
 * Master post-processing wrapper.
 *
 * Wraps any React content (typically SceneComposer output)
 * with layered painterly effects. All effects are togglable
 * and use presets for easy configuration.
 *
 * Performance note: 'subtle' and 'standard' are render-safe.
 * 'cinematic' and 'heavy' may impact render times.
 */
export const PaintEffect: React.FC<PaintEffectProps> = ({
  frame: frameProp,
  preset = 'standard',
  config,
  id = 'paint',
  children,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = frameProp ?? currentFrame;

  // Resolve config
  const baseConfig = preset === 'custom'
    ? { ...PRESETS.standard, ...config }
    : PRESETS[preset];

  const cfg = baseConfig;

  // If everything is off, just render children
  if (preset === 'none') return <>{children}</>;

  // Build the effect stack from inside out
  let content = <>{children}</>;

  // Layer 1: Kuwahara (smooths colors into painted areas)
  if (cfg.kuwahara) {
    content = (
      <KuwaharaFilter
        id={`${id}-kuw`}
        strength={cfg.kuwaharaStrength}
      >
        {content}
      </KuwaharaFilter>
    );
  }

  // Layer 2: Oil paint displacement + emboss
  if (cfg.oilPaint) {
    content = (
      <OilPaintFilter
        id={`${id}-oil`}
        strength={cfg.oilPaintStrength}
        frame={frame}
      >
        {content}
      </OilPaintFilter>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Main content (with Kuwahara + Oil Paint applied) */}
      {content}

      {/* Layer 3: Canvas texture overlay */}
      <CanvasTexture
        id={`${id}-canvas`}
        preset={cfg.canvasPreset}
        opacity={cfg.canvasOpacity}
        frame={frame}
        enabled={cfg.canvasTexture}
      />

      {/* Layer 4: Animated film grain */}
      <FilmGrain
        id={`${id}-grain`}
        intensity={cfg.filmGrainIntensity}
        frame={frame}
        enabled={cfg.filmGrain}
      />

      {/* Layer 5: Pigment density variation */}
      {cfg.pigmentVariation && (
        <PigmentVariation
          id={`${id}-pigment`}
          intensity={cfg.pigmentIntensity}
        />
      )}

      {/* Layer 6: Color grading */}
      <ColorGrade
        preset={cfg.colorGrade}
        intensity={cfg.colorGradeIntensity}
      />

      {/* Layer 7: Vignette */}
      {cfg.vignette && (
        <Vignette
          id={`${id}-vig`}
          intensity={cfg.vignetteIntensity}
        />
      )}
    </div>
  );
};

// ─── Convenience: Pre-wired SceneComposer wrapper ───────

// This will be the standard way to render scenes once SceneComposer
// is updated. For now, import and wrap manually:
//
//   import { PaintEffect } from '../motor/PaintEffect';
//   import { SceneComposer } from '../motor/SceneComposer';
//
//   <PaintEffect preset="standard">
//     <SceneComposer scene={myScene} />
//   </PaintEffect>
