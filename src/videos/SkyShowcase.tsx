/**
 * SkyShowcase — Preview composition showing all 15 sky assets.
 *
 * Each sky is shown for 4 seconds (120 frames at 30fps).
 * Total duration: 15 × 120 = 1800 frames (60 seconds).
 *
 * Displays:
 * - Full-screen sky render
 * - Sky name label at the top
 * - Category label
 * - Progress dots at the bottom
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SKY_ASSETS } from '../assets/skies';
import { PaintEffect } from '../motor/PaintEffect';

const FRAMES_PER_SKY = 120; // 4 seconds at 30fps
const TOTAL_SKIES = SKY_ASSETS.length;
export const TOTAL_FRAMES = FRAMES_PER_SKY * TOTAL_SKIES; // 1800

const CATEGORY_COLORS: Record<string, string> = {
  day: '#4A82C8',
  twilight: '#D88830',
  night: '#4A5898',
  storm: '#6A7078',
  special: '#8A7048',
};

export const SkyShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const skyIndex = Math.min(Math.floor(frame / FRAMES_PER_SKY), TOTAL_SKIES - 1);
  const localFrame = frame - skyIndex * FRAMES_PER_SKY;

  const currentSky = SKY_ASSETS[skyIndex];
  const SkyComponent = currentSky.component;
  const catColor = CATEGORY_COLORS[currentSky.category] ?? '#888888';

  // Fade transition — first 15 frames fade in
  const fadeIn = Math.min(localFrame / 15, 1);

  return (
    <PaintEffect preset="scene_only" id={`sky-${skyIndex}`}>
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Sky render — full frame */}
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <SkyComponent frame={localFrame} />
      </AbsoluteFill>

      {/* Label overlay — top center */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Category tag */}
        <div style={{
          backgroundColor: catColor,
          color: 'white',
          padding: '4px 16px',
          borderRadius: 12,
          fontSize: 18,
          fontFamily: 'monospace',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 2,
          opacity: 0.85,
        }}>
          {currentSky.category}
        </div>
        {/* Sky name */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '8px 24px',
          borderRadius: 8,
          fontSize: 28,
          fontFamily: 'monospace',
          fontWeight: 700,
        }}>
          {currentSky.name}
        </div>
        {/* Asset ID */}
        <div style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14,
          fontFamily: 'monospace',
        }}>
          {currentSky.id}
        </div>
      </div>

      {/* Progress dots — bottom center */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
      }}>
        {SKY_ASSETS.map((sky, i) => (
          <div
            key={sky.id}
            style={{
              width: i === skyIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === skyIndex
                ? CATEGORY_COLORS[sky.category] ?? '#FFF'
                : i < skyIndex
                  ? 'rgba(255,255,255,0.5)'
                  : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Frame counter — bottom right */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        right: 30,
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontFamily: 'monospace',
      }}>
        {skyIndex + 1}/{TOTAL_SKIES} — frame {localFrame}/{FRAMES_PER_SKY}
      </div>
    </AbsoluteFill>
    </PaintEffect>
  );
};

export default SkyShowcase;
