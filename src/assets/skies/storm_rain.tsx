/**
 * storm_rain — Grijs, regenstrepen, somber.
 *
 * Verval, armoede, ellende, donkere tijden.
 * Heavy rain dominates — diagonal streaks across the full frame.
 * Low grey clouds with no break in coverage.
 * Flat, depressing light — no highlights, no warmth.
 * Rain splash hints near the bottom.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  ParticleField,
  AtmosphericHaze,
  generateClouds,
} from './SkyEngine';
import type { ParticleConfig } from './SkyEngine';

const ID = 'storm-rain';

// Flat depressing grey palette — no color, no warmth
const SKY_STOPS = [
  { offset: '0%', color: '#3A3C40' },        // dark grey top
  { offset: '15%', color: '#444648' },       // grey
  { offset: '30%', color: '#4C4E50' },       // mid grey
  { offset: '50%', color: '#545658' },       // lighter grey
  { offset: '70%', color: '#5C5E60' },       // pale grey
  { offset: '85%', color: '#606264' },       // near-horizon grey
  { offset: '100%', color: '#585A5C' },      // horizon (slightly darker)
];

// Thick overcast layer — no breaks, oppressive
const OVERCAST = generateClouds(8, 581, {
  yRange: [20, 300],
  rxRange: [350, 650],
  ryRange: [60, 130],
  fill: '#484A4C',
  opacityRange: [0.6, 0.85],
  driftRange: [0.04, 0.08],
  blobRange: [5, 9],
});

// Dark undersides — flat, featureless
const DARK_LAYER = generateClouds(5, 682, {
  yRange: [200, 400],
  rxRange: [250, 500],
  ryRange: [30, 60],
  fill: '#383A3C',
  opacityRange: [0.4, 0.6],
  driftRange: [0.05, 0.1],
  blobRange: [3, 5],
});

// Low rain curtains — dark streaky bands
const RAIN_CURTAINS = generateClouds(4, 783, {
  yRange: [400, 650],
  rxRange: [200, 400],
  ryRange: [40, 80],
  fill: '#4A4C50',
  opacityRange: [0.15, 0.3],
  driftRange: [0.06, 0.12],
  blobRange: [2, 4],
});

// Heavy rain particle config — diagonal, fast
const RAIN_HEAVY: ParticleConfig = {
  count: 200,
  color: '#909498',
  opacity: 0.35,
  sizeRange: [1, 2.5],
  heightRange: [20, 50],
  speedY: 8,
  speedX: -2,
  seed: 4001,
};

// Medium rain layer — slightly different angle
const RAIN_MED: ParticleConfig = {
  count: 150,
  color: '#7A7E82',
  opacity: 0.2,
  sizeRange: [0.8, 1.8],
  heightRange: [15, 35],
  speedY: 6,
  speedX: -1.5,
  seed: 4002,
};

// Fine mist rain — slow, diffuse
const RAIN_MIST: ParticleConfig = {
  count: 100,
  color: '#A0A4A8',
  opacity: 0.1,
  sizeRange: [0.5, 1.2],
  heightRange: [8, 18],
  speedY: 4,
  speedX: -1,
  seed: 4003,
};

export const StormRain: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    overcast: OVERCAST,
    dark: DARK_LAYER,
    curtains: RAIN_CURTAINS,
  }), []);

  // Rain splash timing — subtle surface disturbance
  const splashFrame = frame % 8;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — flat depressing grey */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Thick overcast — no sky visible */}
      <CloudLayer clouds={clouds.overcast} frame={frame} idPrefix={`${ID}-oc`} />

      {/* Dark undersides */}
      <CloudLayer clouds={clouds.dark} frame={frame} idPrefix={`${ID}-dk`} />

      {/* Rain curtain bands — visible sheets of rain in distance */}
      <CloudLayer clouds={clouds.curtains} frame={frame} idPrefix={`${ID}-rc`} />

      {/* Vertical rain streaks — far distance */}
      <g opacity={0.06}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = 48 * i + (frame * 0.3) % 60 - 30;
          const y = 300 + (i % 7) * 40;
          const height = 200 + (i % 5) * 80;
          return (
            <rect key={i} x={x} y={y} width={1.5} height={height}
              fill="#7A7E82" opacity={0.4 + (i % 3) * 0.15}
              transform={`rotate(-5, ${x}, ${y})`} />
          );
        })}
      </g>

      {/* Heavy rain particles — main layer */}
      <ParticleField config={RAIN_HEAVY} frame={frame} />

      {/* Medium rain — secondary layer */}
      <ParticleField config={RAIN_MED} frame={frame} />

      {/* Fine mist — atmospheric */}
      <ParticleField config={RAIN_MIST} frame={frame} />

      {/* Rain splash circles at bottom — surface impact */}
      <g opacity={0.06}>
        {Array.from({ length: 25 }, (_, i) => {
          const splashX = (i * 79 + frame * 3) % 1960 - 20;
          const splashY = 950 + (i % 4) * 25;
          const phase = (splashFrame + i * 3) % 8;
          const splashR = 2 + phase * 1.5;
          const splashOpacity = phase < 4 ? 0.4 : 0.4 * (1 - (phase - 4) / 4);
          return (
            <circle
              key={i}
              cx={splashX}
              cy={splashY}
              r={splashR}
              fill="none"
              stroke="#A0A8B0"
              strokeWidth={0.8}
              opacity={splashOpacity}
            />
          );
        })}
      </g>

      {/* Puddle reflections — horizontal streaks at bottom */}
      <g opacity={0.04}>
        <rect x={0} y={980} width={1920} height={2} fill="#808890" />
        <rect x={0} y={990} width={1920} height={3} fill="#707880" />
        <rect x={0} y={1000} width={1920} height={2} fill="#909098" />
        <rect x={0} y={1010} width={1920} height={4} fill="#808890" />
        <rect x={0} y={1030} width={1920} height={3} fill="#707880" />
      </g>

      {/* Rain fog — visibility reduction */}
      <defs>
        <linearGradient id={`${ID}-rainfog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#505458" stopOpacity={0.05} />
          <stop offset="40%" stopColor="#505458" stopOpacity={0.1} />
          <stop offset="70%" stopColor="#505458" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#505458" stopOpacity={0.35} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-rainfog)`} />

      {/* Atmospheric haze — heavy, grey, wet */}
      <AtmosphericHaze color="#505458" intensity={0.8} horizonY={0.75} id={ID} />

      {/* Overall desaturation wash — drains color */}
      <rect x={0} y={0} width={1920} height={1080} fill="#505050" opacity={0.05} />

      {/* Vignette — dark corners, depressing frame */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="65%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.25} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default StormRain;
