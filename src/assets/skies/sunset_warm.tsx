/**
 * sunset_warm — Oranje/roze/goud zonsondergang, dramatisch.
 *
 * Epische momenten, conclusies, hoogtepunten van verhalen.
 * Rich warm palette from deep purple zenith through orange to gold.
 * Dramatic cloud silhouettes with fiery edges.
 * Sun low on horizon creating long golden rays.
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

const ID = 'sun-warm';

// Classic warm sunset palette
const SKY_STOPS = [
  { offset: '0%', color: '#1A1040' },        // deep purple zenith
  { offset: '10%', color: '#2A1858' },       // purple
  { offset: '22%', color: '#4A2868' },       // mauve
  { offset: '34%', color: '#7A3868' },       // rose-purple
  { offset: '46%', color: '#A84858' },       // warm rose
  { offset: '56%', color: '#C85838' },       // salmon
  { offset: '66%', color: '#D87028' },       // deep orange
  { offset: '76%', color: '#E88820' },       // rich orange
  { offset: '86%', color: '#F0A020' },       // amber
  { offset: '94%', color: '#F8B830' },       // golden
  { offset: '100%', color: '#F8C848' },      // bright gold horizon
];

// Dramatic silhouette clouds — dark against fiery sky
const SILHOUETTE_CLOUDS = generateClouds(4, 531, {
  yRange: [200, 450],
  rxRange: [200, 400],
  ryRange: [40, 80],
  fill: '#2A1838',
  opacityRange: [0.4, 0.65],
  driftRange: [0.04, 0.08],
  blobRange: [4, 7],
});

// Fire-edged clouds — bright orange/pink rimlight
const FIRE_EDGE_CLOUDS = generateClouds(5, 632, {
  yRange: [300, 600],
  rxRange: [150, 350],
  ryRange: [20, 45],
  fill: '#F08030',
  opacityRange: [0.3, 0.55],
  driftRange: [0.05, 0.1],
  blobRange: [2, 5],
});

// High wispy streaks — pink/purple
const HIGH_WISPS = generateClouds(4, 733, {
  yRange: [80, 220],
  rxRange: [250, 500],
  ryRange: [6, 15],
  fill: '#C06888',
  opacityRange: [0.2, 0.35],
  driftRange: [0.03, 0.06],
  blobRange: [1, 3],
});

// Low golden bands — near the sun
const GOLDEN_BANDS = generateClouds(5, 834, {
  yRange: [650, 800],
  rxRange: [300, 600],
  ryRange: [8, 20],
  fill: '#F0A030',
  opacityRange: [0.3, 0.5],
  driftRange: [0.02, 0.05],
  blobRange: [1, 3],
});

export const SunsetWarm: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    silhouette: SILHOUETTE_CLOUDS,
    fireEdge: FIRE_EDGE_CLOUDS,
    wisps: HIGH_WISPS,
    golden: GOLDEN_BANDS,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — purple to gold */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Setting sun — low, large, intense */}
      <CelestialBody
        cx={700}
        cy={870}
        r={70}
        fill="#F8C040"
        glowColor="#F0A020"
        glowRadius={550}
        frame={frame}
        pulseAmount={0.04}
      />

      {/* Massive sun glow — washes entire lower sky */}
      <HorizonGlow
        color="#E88020"
        cy={900}
        rx={1500}
        ry={450}
        opacity={0.45}
        id={`${ID}-main`}
        frame={frame}
        pulseAmount={0.03}
      />

      {/* Secondary rose glow — higher up */}
      <HorizonGlow
        color="#C05070"
        cy={600}
        rx={900}
        ry={300}
        opacity={0.12}
        id={`${ID}-rose`}
        frame={frame}
        pulseAmount={0.02}
      />

      {/* Golden light rays — crepuscular rays radiating from sun */}
      <defs>
        <linearGradient id={`${ID}-ray`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#F0A030" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#F0A030" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g opacity={0.08}>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = -35 + i * 7;
          const rayWidth = 25 + (i % 3) * 15;
          return (
            <g key={i} transform={`rotate(${angle}, 700, 870)`}>
              <rect x={700 - rayWidth / 2} y={100} width={rayWidth} height={770} fill={`url(#${ID}-ray)`} />
            </g>
          );
        })}
      </g>

      {/* High wispy streaks */}
      <CloudLayer clouds={clouds.wisps} frame={frame} idPrefix={`${ID}-ws`} />

      {/* Silhouette clouds — dark dramatic shapes */}
      <CloudLayer clouds={clouds.silhouette} frame={frame} idPrefix={`${ID}-sl`} />

      {/* Fire-edge clouds — bright rimlit edges */}
      <CloudLayer clouds={clouds.fireEdge} frame={frame} idPrefix={`${ID}-fe`} />

      {/* Rimlight on silhouette cloud edges */}
      <g opacity={0.2}>
        {clouds.silhouette.map((c, i) => {
          const drift = c.drift ?? 0.06;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          return (
            <ellipse
              key={i}
              cx={c.cx + xOff}
              cy={c.cy + c.ry * 0.4}
              rx={c.rx * 0.8}
              ry={c.ry * 0.15}
              fill="#F08830"
            />
          );
        })}
      </g>

      {/* Low golden bands */}
      <CloudLayer clouds={clouds.golden} frame={frame} idPrefix={`${ID}-gd`} />

      {/* Venus / evening star — bright point high in the darkening sky */}
      <g>
        <circle cx={1600} cy={120} r={2.5} fill="white" opacity={0.5 + Math.sin(frame * 0.05) * 0.15} />
        <circle cx={1600} cy={120} r={6} fill="white" opacity={0.06} />
      </g>

      {/* Atmospheric haze — warm golden */}
      <AtmosphericHaze color="#D88830" intensity={0.65} horizonY={0.8} id={ID} />

      {/* Overall warm color grade */}
      <rect x={0} y={0} width={1920} height={1080} fill="#F08020" opacity={0.03} />

      {/* Painterly texture */}
      <g opacity={0.025}>
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={64 * i + 20}
            cy={300 + Math.sin(i * 1.8) * 300}
            r={2 + (i % 3)}
            fill={i % 2 === 0 ? '#A04028' : '#D07030'}
          />
        ))}
      </g>
    </svg>
  );
};

export default SunsetWarm;
