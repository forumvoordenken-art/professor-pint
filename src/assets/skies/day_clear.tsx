/**
 * day_clear — Strakblauwe hemel met zachte witte wolken.
 *
 * Default sky voor neutrale, informatieve scenes.
 * Subtle color variation: warmer near horizon, cooler at zenith.
 * Light cumulus clouds drift slowly right-to-left.
 * Thin cirrus wisps high up for painterly depth.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  AtmosphericHaze,
  generateClouds,
} from './SkyEngine';

const ID = 'day-clear';

// Oil painting palette — NOT flat CSS blues
const SKY_STOPS = [
  { offset: '0%', color: '#1B3F7A' },        // deep zenith blue
  { offset: '15%', color: '#2B5EA8' },       // rich cobalt
  { offset: '35%', color: '#4A82C8' },       // cerulean
  { offset: '55%', color: '#6DA4D8' },       // sky blue
  { offset: '75%', color: '#A0C8E8' },       // pale blue
  { offset: '88%', color: '#C8DDF0' },       // horizon haze
  { offset: '100%', color: '#E0E8EC' },      // warm horizon
];

// Pre-generated cloud configs — 3 layers of depth
const CLOUDS_FAR = generateClouds(5, 101, {
  yRange: [80, 180],
  rxRange: [200, 350],
  ryRange: [30, 55],
  fill: '#E8EEF4',
  opacityRange: [0.25, 0.4],
  driftRange: [0.06, 0.12],
  blobRange: [3, 6],
});

const CLOUDS_MID = generateClouds(4, 202, {
  yRange: [200, 400],
  rxRange: [140, 250],
  ryRange: [35, 65],
  fill: '#FFFFFF',
  opacityRange: [0.35, 0.55],
  driftRange: [0.12, 0.22],
  blobRange: [3, 5],
});

const CLOUDS_NEAR = generateClouds(3, 303, {
  yRange: [350, 550],
  rxRange: [180, 320],
  ryRange: [45, 80],
  fill: '#FAFCFF',
  opacityRange: [0.4, 0.6],
  driftRange: [0.2, 0.35],
  blobRange: [4, 7],
});

export const DayClear: React.FC<AssetProps> = ({ frame }) => {
  // Memoize cloud configs (they're static)
  const allClouds = useMemo(() => ({
    far: CLOUDS_FAR,
    mid: CLOUDS_MID,
    near: CLOUDS_NEAR,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — deep zenith to warm horizon */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Subtle warm band near horizon — sun-warmed air */}
      <defs>
        <linearGradient id={`${ID}-warm`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8E8C0" stopOpacity={0} />
          <stop offset="70%" stopColor="#F8E8C0" stopOpacity={0} />
          <stop offset="90%" stopColor="#F8E8C0" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#F0DEB0" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-warm)`} />

      {/* High cirrus wisps — thin, stretched, barely visible */}
      <g opacity={0.12}>
        <ellipse cx={400 + (frame * 0.03) % 2200} cy={60} rx={300} ry={4} fill="#D8E4F0" />
        <ellipse cx={900 + (frame * 0.025) % 2200} cy={45} rx={250} ry={3} fill="#D0DCE8" />
        <ellipse cx={1400 + (frame * 0.02) % 2200} cy={75} rx={200} ry={3.5} fill="#D4E0EC" />
        <ellipse cx={200 + (frame * 0.035) % 2200} cy={90} rx={180} ry={2.5} fill="#DCE8F0" />
        <ellipse cx={1100 + (frame * 0.028) % 2200} cy={55} rx={280} ry={3} fill="#D8E4F0" />
      </g>

      {/* Far clouds — small, low contrast, slow */}
      <CloudLayer clouds={allClouds.far} frame={frame} idPrefix={`${ID}-far`} />

      {/* Mid clouds — medium, moderate contrast */}
      <CloudLayer clouds={allClouds.mid} frame={frame} idPrefix={`${ID}-mid`} />

      {/* Near clouds — larger, brighter, faster */}
      <CloudLayer clouds={allClouds.near} frame={frame} idPrefix={`${ID}-near`} />

      {/* Cloud shadows on lower sky — very subtle dark patches */}
      <g opacity={0.04}>
        <ellipse cx={600 + (frame * 0.18) % 2200} cy={650} rx={250} ry={60} fill="#4A6080" />
        <ellipse cx={1300 + (frame * 0.14) % 2200} cy={700} rx={200} ry={50} fill="#4A6080" />
      </g>

      {/* Atmospheric haze — unifies sky with terrain layer below */}
      <AtmosphericHaze color="#D8E4EC" intensity={0.5} horizonY={0.85} id={ID} />

      {/* Subtle sun glow upper-right — directional light hint */}
      <defs>
        <radialGradient id={`${ID}-sun-hint`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFF0" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#FFF8E0" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#FFF8E0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={1500} cy={100} rx={400} ry={300} fill={`url(#${ID}-sun-hint)`} />

      {/* Painterly texture — subtle noise-like dots for oil painting feel */}
      <g opacity={0.02}>
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={64 * i + 30}
            cy={200 + Math.sin(i * 1.7) * 150}
            r={2 + (i % 3)}
            fill={i % 2 === 0 ? '#6090C0' : '#A0C0E0'}
          />
        ))}
      </g>
    </svg>
  );
};

export default DayClear;
