/**
 * TerrainShowcase — Preview composition showing all 15 terrain assets.
 *
 * Each terrain is shown for 4 seconds (120 frames at 30fps).
 * Total duration: 15 × 120 = 1800 frames (60 seconds).
 *
 * Terrains worden al per-asset gewrapt met paint effects via withAssetPaint
 * in de index. Geen extra scene-level effecten nodig.
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TERRAIN_ASSETS } from '../assets/terrain';

const FRAMES_PER_TERRAIN = 120; // 4 seconds at 30fps
const TOTAL_TERRAINS = TERRAIN_ASSETS.length;
export const TOTAL_FRAMES = FRAMES_PER_TERRAIN * TOTAL_TERRAINS; // 1800

const CATEGORY_COLORS: Record<string, string> = {
  grass: '#4A8A38',
  sand: '#C8A050',
  earth: '#7A6448',
  stone: '#686058',
  snow: '#8098B0',
  jungle: '#2A5818',
  water: '#3A6878',
  camp: '#8A6838',
  indoor: '#5A4838',
  special: '#6A6878',
};

export const TerrainShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const terrainIndex = Math.min(Math.floor(frame / FRAMES_PER_TERRAIN), TOTAL_TERRAINS - 1);
  const localFrame = frame - terrainIndex * FRAMES_PER_TERRAIN;

  const currentTerrain = TERRAIN_ASSETS[terrainIndex];
  const TerrainComponent = currentTerrain.component;
  const catColor = CATEGORY_COLORS[currentTerrain.category] ?? '#888888';

  // Fade transition — first 15 frames fade in
  const fadeIn = Math.min(localFrame / 15, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: '#2A3040' }}>
      {/* Neutral sky background — so terrain isn't floating on black */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="showcase-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A6890" />
            <stop offset="50%" stopColor="#7090B0" />
            <stop offset="80%" stopColor="#A0B8D0" />
            <stop offset="100%" stopColor="#C0D0E0" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#showcase-sky)" />
      </svg>

      {/* Terrain render — paint effects zitten al in de component */}
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <TerrainComponent frame={localFrame} />
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
          {currentTerrain.category}
        </div>
        {/* Terrain name */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '8px 24px',
          borderRadius: 8,
          fontSize: 28,
          fontFamily: 'monospace',
          fontWeight: 700,
        }}>
          {currentTerrain.name}
        </div>
        {/* Asset ID */}
        <div style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14,
          fontFamily: 'monospace',
        }}>
          {currentTerrain.id}
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
        {TERRAIN_ASSETS.map((terrain, i) => (
          <div
            key={terrain.id}
            style={{
              width: i === terrainIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === terrainIndex
                ? CATEGORY_COLORS[terrain.category] ?? '#FFF'
                : i < terrainIndex
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
        {terrainIndex + 1}/{TOTAL_TERRAINS} — frame {localFrame}/{FRAMES_PER_TERRAIN}
      </div>
    </AbsoluteFill>
  );
};

export default TerrainShowcase;
