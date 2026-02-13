/**
 * ComparisonShowcase — Raw vs Painted side-by-side comparison
 *
 * Quality tool for evaluating paint effects. Shows each asset twice:
 *   Left half  = RAW (no paint effects)
 *   Right half = PAINTED (with withAssetPaint effects)
 *
 * A vertical divider slides through to let you compare specific areas.
 * Cycles through a selection of skies and terrains.
 *
 * 10 assets × 150 frames = 1500 frames (50 seconds at 30fps)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { AssetProps } from '../motor/SceneComposer';
import { longCycleNoise } from '../assets/skies/SkyEngine';

// Raw (unpainted) imports
import {
  DayClear, DayCloudy, SunsetWarm, NightStars, StormRain,
} from '../assets/skies';
import {
  GrassPlain, SandDunes, RockyMountain, SeaShore, JungleFloor,
} from '../assets/terrain';

// Painted imports (via the same index, which exports painted versions)
import { SKY_ASSETS } from '../assets/skies';
import { TERRAIN_ASSETS } from '../assets/terrain';

// ─── Asset pairs to compare ────────────────────────────

interface ComparisonPair {
  label: string;
  category: 'sky' | 'terrain';
  raw: React.FC<AssetProps>;
  paintedId: string;
}

const COMPARISON_PAIRS: ComparisonPair[] = [
  { label: 'Clear Day Sky', category: 'sky', raw: DayClear, paintedId: 'sky_day_clear' },
  { label: 'Cloudy Day Sky', category: 'sky', raw: DayCloudy, paintedId: 'sky_day_cloudy' },
  { label: 'Warm Sunset Sky', category: 'sky', raw: SunsetWarm, paintedId: 'sky_sunset_warm' },
  { label: 'Starry Night Sky', category: 'sky', raw: NightStars, paintedId: 'sky_night_stars' },
  { label: 'Rain Storm Sky', category: 'sky', raw: StormRain, paintedId: 'sky_storm_rain' },
  { label: 'Grass Plain', category: 'terrain', raw: GrassPlain, paintedId: 'terrain_grass_plain' },
  { label: 'Sand Dunes', category: 'terrain', raw: SandDunes, paintedId: 'terrain_sand_dunes' },
  { label: 'Rocky Mountain', category: 'terrain', raw: RockyMountain, paintedId: 'terrain_rocky_mountain' },
  { label: 'Sea Shore', category: 'terrain', raw: SeaShore, paintedId: 'terrain_sea_shore' },
  { label: 'Jungle Floor', category: 'terrain', raw: JungleFloor, paintedId: 'terrain_jungle_floor' },
];

const FRAMES_PER_PAIR = 150; // 5 seconds
const TOTAL_PAIRS = COMPARISON_PAIRS.length;
export const COMPARISON_TOTAL_FRAMES = FRAMES_PER_PAIR * TOTAL_PAIRS;

// ─── Find painted component by ID ──────────────────────

type AssetEntry = {
  id: string;
  name: string;
  category: string;
  component: React.FC<AssetProps>;
};

function findPaintedComponent(id: string): React.FC<AssetProps> | null {
  const allAssets = [
    ...(SKY_ASSETS as readonly AssetEntry[]),
    ...(TERRAIN_ASSETS as readonly AssetEntry[]),
  ];
  const found = allAssets.find((a) => a.id === id);
  return found?.component ?? null;
}

// ─── Component ──────────────────────────────────────────

export const ComparisonShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const pairIndex = Math.min(
    Math.floor(frame / FRAMES_PER_PAIR),
    TOTAL_PAIRS - 1,
  );
  const localFrame = frame - pairIndex * FRAMES_PER_PAIR;

  const pair = COMPARISON_PAIRS[pairIndex];
  const RawComponent = pair.raw;
  const PaintedComponent = findPaintedComponent(pair.paintedId);

  if (!PaintedComponent) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#F00', color: '#FFF', fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Missing painted asset: {pair.paintedId}
      </AbsoluteFill>
    );
  }

  const fadeIn = Math.min(localFrame / 15, 1);

  // Divider slides slowly across the frame
  const dividerX = 960 + longCycleNoise(localFrame, 55) * 200;

  const categoryColor = pair.category === 'sky' ? '#4A82C8' : '#4A8A38';

  return (
    <AbsoluteFill style={{ backgroundColor: '#1A1A1A' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* Left half: RAW */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: dividerX,
          height: '100%',
          overflow: 'hidden',
        }}>
          <div style={{ width: 1920, height: 1080 }}>
            {pair.category === 'terrain' && (
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="comp-bg-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A6890" />
                    <stop offset="100%" stopColor="#C0D0E0" />
                  </linearGradient>
                </defs>
                <rect x={0} y={0} width={1920} height={1080} fill="url(#comp-bg-sky)" />
              </svg>
            )}
            <RawComponent frame={localFrame} />
          </div>
        </div>

        {/* Right half: PAINTED */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: dividerX,
          width: 1920 - dividerX,
          height: '100%',
          overflow: 'hidden',
        }}>
          <div style={{
            width: 1920,
            height: 1080,
            marginLeft: -dividerX,
          }}>
            {pair.category === 'terrain' && (
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="comp-bg-sky-r" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A6890" />
                    <stop offset="100%" stopColor="#C0D0E0" />
                  </linearGradient>
                </defs>
                <rect x={0} y={0} width={1920} height={1080} fill="url(#comp-bg-sky-r)" />
              </svg>
            )}
            <PaintedComponent frame={localFrame} />
          </div>
        </div>

        {/* Divider line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: dividerX - 1.5,
          width: 3,
          height: '100%',
          backgroundColor: 'rgba(255,255,255,0.6)',
          boxShadow: '0 0 8px rgba(0,0,0,0.5)',
        }} />

        {/* Divider arrow indicator */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: dividerX - 16,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          transform: 'translateY(-50%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {'<>'}
        </div>
      </AbsoluteFill>

      {/* Labels */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'rgba(255,255,255,0.7)',
        padding: '4px 12px',
        borderRadius: 6,
        fontSize: 16,
        fontFamily: 'monospace',
        fontWeight: 600,
      }}>
        RAW
      </div>
      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'rgba(255,255,255,0.7)',
        padding: '4px 12px',
        borderRadius: 6,
        fontSize: 16,
        fontFamily: 'monospace',
        fontWeight: 600,
      }}>
        PAINTED
      </div>

      {/* Asset name — top center */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: categoryColor,
            color: 'white',
            padding: '2px 10px',
            borderRadius: 10,
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            {pair.category}
          </div>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: 6,
            fontSize: 22,
            fontFamily: 'monospace',
            fontWeight: 700,
          }}>
            {pair.label}
          </div>
        </div>
      </div>

      {/* Progress — bottom */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        display: 'flex',
        gap: 4,
      }}>
        {COMPARISON_PAIRS.map((p, i) => (
          <div
            key={p.paintedId}
            style={{
              flex: 1,
              height: i === pairIndex ? 5 : 3,
              borderRadius: 2,
              backgroundColor: i < pairIndex
                ? 'rgba(255,255,255,0.4)'
                : i === pairIndex
                  ? 'rgba(255,255,255,0.8)'
                  : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        right: 24,
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontFamily: 'monospace',
      }}>
        {pairIndex + 1}/{TOTAL_PAIRS}
      </div>
    </AbsoluteFill>
  );
};

export default ComparisonShowcase;
