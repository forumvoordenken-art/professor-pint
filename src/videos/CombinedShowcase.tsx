/**
 * CombinedShowcase — Sky + Terrain together with HorizonMatcher
 *
 * THIS IS THE KEY QUALITY TOOL. It answers the critical question:
 * "Do sky and terrain look like ONE cohesive painting, or like
 * two separate images pasted together?"
 *
 * Shows 15 curated sky+terrain combos, each for 5 seconds.
 * Each combo includes the HorizonMatcher atmospheric blending layer.
 *
 * Total: 15 × 150 frames = 2250 frames (75 seconds at 30fps)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SKY_ASSETS } from '../assets/skies';
import { TERRAIN_ASSETS } from '../assets/terrain';
import { HorizonMatcher, CURATED_COMBOS } from '../motor/HorizonMatcher';
import type { AssetProps } from '../motor/SceneComposer';

const FRAMES_PER_COMBO = 150; // 5 seconds — more time to evaluate cohesion
const TOTAL_COMBOS = CURATED_COMBOS.length;
export const COMBINED_TOTAL_FRAMES = FRAMES_PER_COMBO * TOTAL_COMBOS;

// ─── Lookup helpers ─────────────────────────────────────

type AssetEntry = {
  id: string;
  name: string;
  category: string;
  component: React.FC<AssetProps>;
};

function findSky(id: string): AssetEntry | undefined {
  return (SKY_ASSETS as readonly AssetEntry[]).find((s) => s.id === id);
}

function findTerrain(id: string): AssetEntry | undefined {
  return (TERRAIN_ASSETS as readonly AssetEntry[]).find((t) => t.id === id);
}

// ─── Component ──────────────────────────────────────────

export const CombinedShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const comboIndex = Math.min(
    Math.floor(frame / FRAMES_PER_COMBO),
    TOTAL_COMBOS - 1,
  );
  const localFrame = frame - comboIndex * FRAMES_PER_COMBO;

  const combo = CURATED_COMBOS[comboIndex];
  const sky = findSky(combo.skyId);
  const terrain = findTerrain(combo.terrainId);

  if (!sky || !terrain) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#F00', color: '#FFF', fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Missing asset: {!sky ? combo.skyId : combo.terrainId}
      </AbsoluteFill>
    );
  }

  const SkyComponent = sky.component;
  const TerrainComponent = terrain.component;

  // Fade transition
  const fadeIn = Math.min(localFrame / 20, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* Layer 1: Sky (full frame, behind everything) */}
        <AbsoluteFill>
          <SkyComponent frame={localFrame} />
        </AbsoluteFill>

        {/* Layer 2: HorizonMatcher (atmospheric blending) */}
        <HorizonMatcher
          mood={combo.mood}
          frame={localFrame}
          horizonY={540}
          intensity={1.0}
        />

        {/* Layer 3: Terrain (lower half, upper part is transparent) */}
        <AbsoluteFill>
          <TerrainComponent frame={localFrame} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Label overlay — top left */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {/* Combo name */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '8px 20px',
          borderRadius: 8,
          fontSize: 26,
          fontFamily: 'monospace',
          fontWeight: 700,
        }}>
          {combo.label}
        </div>
        {/* Mood tag */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          color: 'rgba(255,255,255,0.7)',
          padding: '4px 12px',
          borderRadius: 6,
          fontSize: 14,
          fontFamily: 'monospace',
          display: 'inline-block',
          alignSelf: 'flex-start',
        }}>
          mood: {combo.mood}
        </div>
      </div>

      {/* Asset info — top right */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
      }}>
        <div style={{
          backgroundColor: 'rgba(70, 130, 200, 0.5)',
          color: 'white',
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 13,
          fontFamily: 'monospace',
        }}>
          SKY: {sky.name}
        </div>
        <div style={{
          backgroundColor: 'rgba(80, 140, 60, 0.5)',
          color: 'white',
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 13,
          fontFamily: 'monospace',
        }}>
          TERRAIN: {terrain.name}
        </div>
      </div>

      {/* Progress bar — bottom */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        display: 'flex',
        gap: 3,
        alignItems: 'center',
      }}>
        {CURATED_COMBOS.map((c, i) => (
          <div
            key={c.label}
            style={{
              flex: 1,
              height: i === comboIndex ? 5 : 3,
              borderRadius: 2,
              backgroundColor: i < comboIndex
                ? 'rgba(255,255,255,0.4)'
                : i === comboIndex
                  ? 'rgba(255,255,255,0.8)'
                  : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Counter — bottom right */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        right: 24,
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontFamily: 'monospace',
      }}>
        {comboIndex + 1}/{TOTAL_COMBOS}
      </div>
    </AbsoluteFill>
  );
};

export default CombinedShowcase;
