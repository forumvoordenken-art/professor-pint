/**
 * abstract_plane — Conceptueel, minimaal grondvlak.
 *
 * Filosofie, conceptuele uitleg, tijdlijn, abstract denken.
 * Minimal ground plane — not a real landscape.
 * Soft gradient floor fading to nothing.
 * Grid lines suggesting infinite space.
 * Used for conceptual/explainer scenes.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  longCycleNoise,
} from './TerrainEngine';

const ID = 'abstract-plane';
const FLOOR_Y = 650;

export const AbstractPlane: React.FC<AssetProps> = ({ frame }) => {
  // Subtle color temperature shift over time
  const warmth = longCycleNoise(frame * 0.05, 42) * 0.02;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Floor gradient — fades from visible to transparent */}
      <defs>
        <linearGradient id={`${ID}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3840" stopOpacity={0} />
          <stop offset="40%" stopColor="#3A3840" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#3A3840" stopOpacity={0.5} />
        </linearGradient>
      </defs>
      <rect x={0} y={FLOOR_Y} width={1920} height={430} fill={`url(#${ID}-floor)`} />

      {/* Perspective grid lines — converging to vanishing point */}
      <g opacity={0.06}>
        {/* Horizontal lines — perspective spacing */}
        {Array.from({ length: 12 }, (_, i) => {
          const spacing = 8 + i * i * 2.5; // Exponential = perspective
          const y = FLOOR_Y + spacing;
          if (y > 1080) return null;
          return (
            <line key={`h${i}`} x1={0} y1={y} x2={1920} y2={y}
              stroke="#8088A0" strokeWidth={0.5} />
          );
        })}
        {/* Vertical lines — converging to center horizon */}
        {Array.from({ length: 20 }, (_, i) => {
          const x = i * 100 + 60;
          const topX = 960 + (x - 960) * 0.1; // Converge toward center
          return (
            <line key={`v${i}`} x1={topX} y1={FLOOR_Y} x2={x} y2={1080}
              stroke="#8088A0" strokeWidth={0.5} />
          );
        })}
      </g>

      {/* Soft spotlight — center floor illumination */}
      <defs>
        <radialGradient id={`${ID}-spot`} cx="0.5" cy="0.35" r="0.5">
          <stop offset="0%" stopColor="#A0A8B8" stopOpacity={0.08 + warmth} />
          <stop offset="60%" stopColor="#8088A0" stopOpacity={0.03} />
          <stop offset="100%" stopColor="#8088A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={960} cy={800} rx={500} ry={200} fill={`url(#${ID}-spot)`} />

      {/* Subtle reflection line — floor has slight sheen */}
      <defs>
        <linearGradient id={`${ID}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="40%" stopColor="white" stopOpacity={0.015} />
          <stop offset="60%" stopColor="white" stopOpacity={0.015} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={FLOOR_Y + 100} width={1920} height={3} fill={`url(#${ID}-sheen)`} />

      {/* Ambient particles — floating motes suggesting space */}
      {Array.from({ length: 8 }, (_, i) => {
        const baseX = 200 + i * 220;
        const baseY = FLOOR_Y + 50 + i * 30;
        const drift = longCycleNoise(frame * 0.2, i * 19) * 20;
        const float = longCycleNoise(frame * 0.15, i * 31) * 15;
        const opacity = 0.03 + Math.max(0, longCycleNoise(frame * 0.1, i * 43)) * 0.04;
        return (
          <circle key={i} cx={baseX + drift} cy={baseY + float} r={1.5}
            fill="#B0B8C8" opacity={opacity} />
        );
      })}

      {/* Edge fade — floor dissolves at sides */}
      <defs>
        <linearGradient id={`${ID}-side-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${ID}-side-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <rect x={0} y={FLOOR_Y} width={200} height={430} fill={`url(#${ID}-side-l)`} />
      <rect x={1720} y={FLOOR_Y} width={200} height={430} fill={`url(#${ID}-side-r)`} />

      {/* Bottom darken */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="90%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default AbstractPlane;
