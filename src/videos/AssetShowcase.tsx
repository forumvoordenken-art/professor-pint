/**
 * AssetShowcase — Toont alle 8 nieuwe vector assets (4 skies + 4 terrains)
 *
 * Elke sky+terrain combo wordt 5 seconden getoond.
 * De sky vult het hele frame, terrain wordt onderaan geplaatst.
 *
 * Combos:
 * 1. sky-day-clear + terrain-grass-plain
 * 2. sky-sunset-warm + terrain-sand-flat
 * 3. sky-storm-dark + terrain-cobblestone
 * 4. sky-night-stars + terrain-river-bank
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile } from 'remotion';

const FRAMES_PER_COMBO = 150; // 5 seconds at 30fps

const COMBOS = [
  {
    label: 'Day Clear + Grass Plain',
    sky: 'sky-day-clear.svg',
    terrain: 'terrain-grass-plain.svg',
  },
  {
    label: 'Sunset Warm + Sand Flat',
    sky: 'sky-sunset-warm.svg',
    terrain: 'terrain-sand-flat.svg',
  },
  {
    label: 'Storm Dark + Cobblestone',
    sky: 'sky-storm-dark.svg',
    terrain: 'terrain-cobblestone.svg',
  },
  {
    label: 'Night Stars + River Bank',
    sky: 'sky-night-stars.svg',
    terrain: 'terrain-river-bank.svg',
  },
];

export const ASSET_SHOWCASE_FRAMES = FRAMES_PER_COMBO * COMBOS.length;

export const AssetShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const comboIndex = Math.min(
    Math.floor(frame / FRAMES_PER_COMBO),
    COMBOS.length - 1,
  );
  const localFrame = frame - comboIndex * FRAMES_PER_COMBO;
  const combo = COMBOS[comboIndex];

  // Fade in transition
  const fadeIn = Math.min(localFrame / 20, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* Sky — full background */}
        <AbsoluteFill>
          <Img
            src={staticFile(`assets/${combo.sky}`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>

        {/* Terrain — bottom half with transparency blend */}
        <AbsoluteFill style={{ top: '40%' }}>
          <Img
            src={staticFile(`assets/${combo.terrain}`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Label — top left */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '8px 20px',
          borderRadius: 8,
          fontSize: 28,
          fontFamily: 'monospace',
          fontWeight: 700,
        }}
      >
        {combo.label}
      </div>

      {/* Counter — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: 'rgba(0,0,0,0.4)',
          color: 'rgba(255,255,255,0.7)',
          padding: '4px 12px',
          borderRadius: 6,
          fontSize: 16,
          fontFamily: 'monospace',
        }}
      >
        {comboIndex + 1}/{COMBOS.length}
      </div>

      {/* Progress bar — bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 40,
          right: 100,
          display: 'flex',
          gap: 3,
          alignItems: 'center',
        }}
      >
        {COMBOS.map((c, i) => (
          <div
            key={c.label}
            style={{
              flex: 1,
              height: i === comboIndex ? 5 : 3,
              borderRadius: 2,
              backgroundColor:
                i < comboIndex
                  ? 'rgba(255,255,255,0.4)'
                  : i === comboIndex
                    ? 'rgba(255,255,255,0.8)'
                    : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default AssetShowcase;
