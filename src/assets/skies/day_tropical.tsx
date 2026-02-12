/**
 * day_tropical — Fel cyaan, grote cumuluswolken, hoge zon.
 *
 * Caribisch, Pacific, tropisch. Intense kleuren, hoog contrast.
 * Massive cumulus towers with bright white tops and dark grey bases.
 * Deep saturated blue sky. Humid atmosphere near horizon.
 * Sun creates sharp highlights on cloud tops.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  AtmosphericHaze,
  HorizonGlow,
  CelestialBody,
  generateClouds,
} from './SkyEngine';

const ID = 'day-trop';

// Intense tropical blue palette
const SKY_STOPS = [
  { offset: '0%', color: '#0A2E6E' },        // deep tropical blue
  { offset: '10%', color: '#1448A0' },       // rich blue
  { offset: '25%', color: '#1E60C0' },       // vibrant blue
  { offset: '42%', color: '#3080D0' },       // bright cyan-blue
  { offset: '58%', color: '#50A0D8' },       // sky blue
  { offset: '72%', color: '#78BCD8' },       // pale cyan
  { offset: '85%', color: '#A0D0D8' },       // humid horizon
  { offset: '100%', color: '#C0D8D0' },      // green-tinged horizon (humidity)
];

// Large cumulus towers — dramatic, vertical
const CUMULUS_TOWERS = generateClouds(3, 711, {
  yRange: [120, 300],
  rxRange: [200, 350],
  ryRange: [100, 200],
  fill: '#FFFFFF',
  opacityRange: [0.7, 0.9],
  driftRange: [0.05, 0.1],
  blobRange: [6, 10],
});

// Cloud bases — darker undersides of the towers
const CLOUD_BASES = generateClouds(4, 812, {
  yRange: [350, 520],
  rxRange: [180, 320],
  ryRange: [30, 60],
  fill: '#8898A8',
  opacityRange: [0.3, 0.5],
  driftRange: [0.05, 0.1],
  blobRange: [3, 5],
});

// Small fair-weather cumulus — scattered puffs
const FAIR_WEATHER = generateClouds(6, 913, {
  yRange: [180, 450],
  rxRange: [60, 120],
  ryRange: [25, 50],
  fill: '#F8FCFF',
  opacityRange: [0.5, 0.75],
  driftRange: [0.1, 0.2],
  blobRange: [2, 4],
});

// Distant horizon clouds — flat, compressed by perspective
const HORIZON_CLOUDS = generateClouds(5, 1014, {
  yRange: [600, 750],
  rxRange: [200, 400],
  ryRange: [10, 25],
  fill: '#B0C8D0',
  opacityRange: [0.25, 0.4],
  driftRange: [0.03, 0.06],
  blobRange: [2, 3],
});

export const DayTropical: React.FC<AssetProps> = ({ frame }) => {
  const allClouds = useMemo(() => ({
    towers: CUMULUS_TOWERS,
    bases: CLOUD_BASES,
    fair: FAIR_WEATHER,
    horizon: HORIZON_CLOUDS,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — deep saturated tropical blue */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Sun — high, intense, tropical */}
      <CelestialBody
        cx={960}
        cy={80}
        r={35}
        fill="#FFF8E0"
        glowColor="#FFF0C0"
        glowRadius={250}
        frame={frame}
        pulseAmount={0.03}
      />

      {/* Sun corona — high-energy tropical light */}
      <defs>
        <radialGradient id={`${ID}-corona`} cx="0.5" cy="0.07" r="0.5">
          <stop offset="0%" stopColor="#FFFFF0" stopOpacity={0.2} />
          <stop offset="25%" stopColor="#FFF8D0" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#FFF8D0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-corona)`} />

      {/* Distant horizon clouds — perspective-compressed */}
      <CloudLayer clouds={allClouds.horizon} frame={frame} idPrefix={`${ID}-hz`} />

      {/* Humidity haze near horizon — tropical moisture */}
      <HorizonGlow
        color="#A0C8D0"
        cy={850}
        rx={1100}
        ry={250}
        opacity={0.25}
        id={`${ID}-humid`}
        frame={frame}
        pulseAmount={0.02}
      />

      {/* Large cumulus towers */}
      <CloudLayer clouds={allClouds.towers} frame={frame} idPrefix={`${ID}-tw`} />

      {/* Dark bases under towers */}
      <CloudLayer clouds={allClouds.bases} frame={frame} idPrefix={`${ID}-bs`} />

      {/* Bright cloud-top highlights — sun hitting cumulus peaks */}
      <g opacity={0.15}>
        {allClouds.towers.map((c, i) => {
          const drift = c.drift ?? 0.08;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          return (
            <ellipse
              key={i}
              cx={c.cx + xOff - c.rx * 0.1}
              cy={c.cy - c.ry * 0.5}
              rx={c.rx * 0.4}
              ry={c.ry * 0.2}
              fill="white"
            />
          );
        })}
      </g>

      {/* Small fair-weather puffs */}
      <CloudLayer clouds={allClouds.fair} frame={frame} idPrefix={`${ID}-fw`} />

      {/* Rain virga hints — visible rain falling from distant clouds but evaporating */}
      <g opacity={0.04}>
        <defs>
          <linearGradient id={`${ID}-virga`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7090A8" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#7090A8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={300 + (frame * 0.06) % 600} y={450} width={80} height={300} fill={`url(#${ID}-virga)`} />
        <rect x={1400 + (frame * 0.04) % 400} y={400} width={60} height={350} fill={`url(#${ID}-virga)`} />
      </g>

      {/* Atmospheric haze — humid, slightly green-tinted */}
      <AtmosphericHaze color="#B0D0C8" intensity={0.55} horizonY={0.82} id={ID} />

      {/* Color richness boost — subtle saturation overlay */}
      <rect x={0} y={0} width={1920} height={1080} fill="#1040A0" opacity={0.02} />

      {/* Painterly texture — tropical blues */}
      <g opacity={0.02}>
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={64 * i + 30}
            cy={150 + Math.sin(i * 2.1) * 200}
            r={2 + (i % 3)}
            fill={i % 3 === 0 ? '#2060A0' : i % 3 === 1 ? '#40A0D0' : '#80C0D8'}
          />
        ))}
      </g>
    </svg>
  );
};

export default DayTropical;
