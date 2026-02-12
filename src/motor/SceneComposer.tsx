/**
 * SceneComposer — Phase 0.1 Prototype
 *
 * Renders a ComposedScene by stacking 10 layers in order:
 * sky → terrain → water → structures → vegetation → characters → props → foreground → atmosphere → lighting
 *
 * Each layer entry references an asset by string name, resolved via an asset registry.
 * This prototype uses placeholder assets to validate the layered composition concept in Remotion.
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

// ---- Asset component interface (VIDEO-SPEC.md §4.3) ----

export interface AssetProps {
  frame: number;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  mirror?: boolean;
  colorShift?: string;
}

// ---- ComposedScene interface (VIDEO-SPEC.md §5.1) ----

export interface ComposedScene {
  /** Layer 1: Sky / far background */
  sky: { asset: string; colorShift?: string };

  /** Layer 2: Terrain / ground */
  terrain: { asset: string; colorShift?: string };

  /** Layer 3: Water (optional) */
  water?: { asset: string; x: number; y: number; scale: number };

  /** Layer 4: Structures (buildings, monuments) */
  structures: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
    mirror?: boolean;
  }>;

  /** Layer 5: Vegetation */
  vegetation: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
    mirror?: boolean;
  }>;

  /** Layer 6: Characters (midground) */
  characters: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
    emotion?: string;
    talking?: boolean;
    activity?: string;
  }>;

  /** Layer 7: Props (small objects) */
  props?: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
  }>;

  /** Layer 8: Foreground framing */
  foreground?: Array<{
    asset: string;
    opacity?: number;
  }>;

  /** Layer 9: Atmosphere effects */
  atmosphere?: Array<{
    asset: string;
    opacity?: number;
  }>;

  /** Layer 10: Lighting overlay */
  lighting: {
    asset: string;
    intensity?: number;
  };
}

// ---- Asset Registry ----
// Maps asset string names to React components.
// In production, this will be auto-generated from the asset library.
// For the prototype, placeholder assets are registered manually.

type AssetComponent = React.FC<AssetProps>;

const assetRegistry = new Map<string, AssetComponent>();

export function registerAsset(name: string, component: AssetComponent): void {
  assetRegistry.set(name, component);
}

export function getAsset(name: string): AssetComponent | undefined {
  return assetRegistry.get(name);
}

// ---- Layer renderers ----

const renderPositionedAsset = (
  Asset: AssetComponent,
  frame: number,
  opts: {
    x?: number;
    y?: number;
    scale?: number;
    opacity?: number;
    mirror?: boolean;
    colorShift?: string;
  },
  key: string,
) => {
  const { x = 0, y = 0, scale = 1, opacity = 1, mirror = false, colorShift } = opts;
  return (
    <div
      key={key}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${mirror ? -scale : scale}, ${scale})`,
        transformOrigin: 'center top',
        opacity,
      }}
    >
      <Asset frame={frame} colorShift={colorShift} />
    </div>
  );
};

// ---- SceneComposer Component ----

interface SceneComposerProps {
  scene: ComposedScene;
}

export const SceneComposer: React.FC<SceneComposerProps> = ({ scene }) => {
  const frame = useCurrentFrame();

  const resolveAsset = (name: string): AssetComponent | null => {
    const asset = getAsset(name);
    if (!asset) {
      console.warn(`[SceneComposer] Asset not found: "${name}"`);
      return null;
    }
    return asset;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Layer 1: Sky */}
      {(() => {
        const Asset = resolveAsset(scene.sky.asset);
        if (!Asset) return null;
        return (
          <AbsoluteFill key="layer-sky" style={{ zIndex: 1 }}>
            <Asset frame={frame} colorShift={scene.sky.colorShift} />
          </AbsoluteFill>
        );
      })()}

      {/* Layer 2: Terrain */}
      {(() => {
        const Asset = resolveAsset(scene.terrain.asset);
        if (!Asset) return null;
        return (
          <AbsoluteFill key="layer-terrain" style={{ zIndex: 2 }}>
            <Asset frame={frame} colorShift={scene.terrain.colorShift} />
          </AbsoluteFill>
        );
      })()}

      {/* Layer 3: Water (optional) */}
      {scene.water &&
        (() => {
          const Asset = resolveAsset(scene.water!.asset);
          if (!Asset) return null;
          return (
            <AbsoluteFill key="layer-water" style={{ zIndex: 3 }}>
              {renderPositionedAsset(Asset, frame, scene.water!, 'water-0')}
            </AbsoluteFill>
          );
        })()}

      {/* Layer 4: Structures */}
      {scene.structures.length > 0 && (
        <AbsoluteFill key="layer-structures" style={{ zIndex: 4 }}>
          {scene.structures.map((entry, i) => {
            const Asset = resolveAsset(entry.asset);
            if (!Asset) return null;
            return renderPositionedAsset(Asset, frame, entry, `structure-${i}`);
          })}
        </AbsoluteFill>
      )}

      {/* Layer 5: Vegetation */}
      {scene.vegetation.length > 0 && (
        <AbsoluteFill key="layer-vegetation" style={{ zIndex: 5 }}>
          {scene.vegetation.map((entry, i) => {
            const Asset = resolveAsset(entry.asset);
            if (!Asset) return null;
            return renderPositionedAsset(Asset, frame, entry, `vegetation-${i}`);
          })}
        </AbsoluteFill>
      )}

      {/* Layer 6: Characters */}
      {scene.characters.length > 0 && (
        <AbsoluteFill key="layer-characters" style={{ zIndex: 6 }}>
          {scene.characters.map((entry, i) => {
            const Asset = resolveAsset(entry.asset);
            if (!Asset) return null;
            return renderPositionedAsset(
              Asset,
              frame,
              { x: entry.x, y: entry.y, scale: entry.scale },
              `character-${i}`,
            );
          })}
        </AbsoluteFill>
      )}

      {/* Layer 7: Props (optional) */}
      {scene.props &&
        scene.props.length > 0 && (
          <AbsoluteFill key="layer-props" style={{ zIndex: 7 }}>
            {scene.props.map((entry, i) => {
              const Asset = resolveAsset(entry.asset);
              if (!Asset) return null;
              return renderPositionedAsset(Asset, frame, entry, `prop-${i}`);
            })}
          </AbsoluteFill>
        )}

      {/* Layer 8: Foreground (optional) */}
      {scene.foreground &&
        scene.foreground.length > 0 && (
          <AbsoluteFill key="layer-foreground" style={{ zIndex: 8 }}>
            {scene.foreground.map((entry, i) => {
              const Asset = resolveAsset(entry.asset);
              if (!Asset) return null;
              return (
                <AbsoluteFill key={`foreground-${i}`} style={{ opacity: entry.opacity ?? 1 }}>
                  <Asset frame={frame} />
                </AbsoluteFill>
              );
            })}
          </AbsoluteFill>
        )}

      {/* Layer 9: Atmosphere (optional) */}
      {scene.atmosphere &&
        scene.atmosphere.length > 0 && (
          <AbsoluteFill key="layer-atmosphere" style={{ zIndex: 9 }}>
            {scene.atmosphere.map((entry, i) => {
              const Asset = resolveAsset(entry.asset);
              if (!Asset) return null;
              return (
                <AbsoluteFill key={`atmosphere-${i}`} style={{ opacity: entry.opacity ?? 1 }}>
                  <Asset frame={frame} />
                </AbsoluteFill>
              );
            })}
          </AbsoluteFill>
        )}

      {/* Layer 10: Lighting */}
      {(() => {
        const Asset = resolveAsset(scene.lighting.asset);
        if (!Asset) return null;
        return (
          <AbsoluteFill
            key="layer-lighting"
            style={{ zIndex: 10, opacity: scene.lighting.intensity ?? 1 }}
          >
            <Asset frame={frame} />
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};
