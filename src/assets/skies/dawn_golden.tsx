/**
 * dawn_golden — Gouden dageraad, zacht roze, nieuw begin.
 *
 * Nieuwe tijdperken, hoop, opkomst van beschavingen.
 * Low sun near horizon with intense golden-pink light.
 * Long horizontal cloud bands lit from below.
 * Dark blue remnants of night at the top transitioning to warm gold.
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
  generateStars,
  StarField,
} from './SkyEngine';

const ID = 'dawn-gold';

// Dawn gradient — night fading into golden warmth
const SKY_STOPS = [
  { offset: '0%', color: '#0E1B3A' },        // lingering night
  { offset: '10%', color: '#1A2D5A' },       // deep twilight blue
  { offset: '22%', color: '#2D4878' },       // pre-dawn blue
  { offset: '36%', color: '#4A6890' },       // lightening blue
  { offset: '50%', color: '#7A90A8' },       // blue-grey transition
  { offset: '62%', color: '#B8A088' },       // warm grey-gold
  { offset: '74%', color: '#D8A878' },       // soft gold
  { offset: '84%', color: '#E8A860' },       // warm amber
  { offset: '92%', color: '#F0B050' },       // bright gold
  { offset: '100%', color: '#F8C060' },      // horizon gold
];

// Fading stars — only at the top, dimmer
const FADING_STARS = generateStars(35, 151, 250, 0.05);

// Lit-from-below cloud bands — long, horizontal, warm-colored
const DAWN_BANDS = generateClouds(5, 251, {
  yRange: [300, 550],
  rxRange: [300, 600],
  ryRange: [12, 30],
  fill: '#F0A858',
  opacityRange: [0.3, 0.55],
  driftRange: [0.03, 0.07],
  blobRange: [2, 4],
});

// Pink-tinted clouds higher up — catching first light
const PINK_CLOUDS = generateClouds(4, 352, {
  yRange: [150, 350],
  rxRange: [200, 400],
  ryRange: [25, 50],
  fill: '#E0A0A0',
  opacityRange: [0.2, 0.4],
  driftRange: [0.04, 0.08],
  blobRange: [3, 5],
});

// Dark silhouette clouds — still in shadow, near top
const SHADOW_CLOUDS = generateClouds(3, 453, {
  yRange: [80, 200],
  rxRange: [200, 350],
  ryRange: [30, 55],
  fill: '#2A3A5A',
  opacityRange: [0.25, 0.4],
  driftRange: [0.05, 0.1],
  blobRange: [3, 5],
});

export const DawnGolden: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    bands: DAWN_BANDS,
    pink: PINK_CLOUDS,
    shadow: SHADOW_CLOUDS,
  }), []);

  // Stars fade over time (or stay dim for static scenes)
  const starBrightness = 0.3;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — night to gold */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Fading night stars — only visible at top */}
      <g opacity={starBrightness}>
        <StarField stars={FADING_STARS} frame={frame} twinkleSpeed={0.04} />
      </g>

      {/* Rising sun — just peeking above horizon */}
      <CelestialBody
        cx={960}
        cy={900}
        r={60}
        fill="#F8D048"
        glowColor="#F8C040"
        glowRadius={500}
        frame={frame}
        pulseAmount={0.05}
      />

      {/* Sun pillar — vertical beam of light above sun */}
      <defs>
        <linearGradient id={`${ID}-pillar`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#F8C040" stopOpacity={0.2} />
          <stop offset="30%" stopColor="#F0B040" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#F0B040" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={900} y={300} width={120} height={600} fill={`url(#${ID}-pillar)`} />

      {/* Massive horizon glow — sun illuminating the entire lower sky */}
      <HorizonGlow
        color="#F0A840"
        cy={920}
        rx={1400}
        ry={400}
        opacity={0.4}
        id={`${ID}-main`}
        frame={frame}
        pulseAmount={0.03}
      />

      {/* Secondary pink glow — higher, more diffuse */}
      <HorizonGlow
        color="#D88888"
        cy={700}
        rx={1000}
        ry={300}
        opacity={0.15}
        id={`${ID}-pink`}
        frame={frame}
        pulseAmount={0.02}
      />

      {/* Shadow clouds — still in darkness at top */}
      <CloudLayer clouds={clouds.shadow} frame={frame} idPrefix={`${ID}-sh`} />

      {/* Pink-tinted clouds — catching first light */}
      <CloudLayer clouds={clouds.pink} frame={frame} idPrefix={`${ID}-pk`} />

      {/* Golden lit bands — dramatic underlit streaks */}
      <CloudLayer clouds={clouds.bands} frame={frame} idPrefix={`${ID}-bd`} />

      {/* Cloud band underlight — warm glow on bottom edges */}
      <g opacity={0.12}>
        {clouds.bands.map((c, i) => {
          const drift = c.drift ?? 0.05;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          return (
            <ellipse
              key={i}
              cx={c.cx + xOff}
              cy={c.cy + c.ry * 0.6}
              rx={c.rx * 0.7}
              ry={c.ry * 0.4}
              fill="#F8A030"
            />
          );
        })}
      </g>

      {/* Thin golden streaks near horizon */}
      <g opacity={0.15}>
        <ellipse cx={400 + (frame * 0.04) % 2400} cy={700} rx={500} ry={4} fill="#F0A040" />
        <ellipse cx={1200 + (frame * 0.03) % 2400} cy={730} rx={400} ry={3} fill="#E89838" />
        <ellipse cx={700 + (frame * 0.05) % 2400} cy={760} rx={450} ry={5} fill="#F0A848" />
        <ellipse cx={1500 + (frame * 0.035) % 2400} cy={680} rx={350} ry={3.5} fill="#E8A040" />
      </g>

      {/* Atmospheric haze — golden warm */}
      <AtmosphericHaze color="#E8C080" intensity={0.7} horizonY={0.78} id={ID} />

      {/* Color grade — slight warm wash */}
      <rect x={0} y={0} width={1920} height={1080} fill="#F0C060" opacity={0.03} />

      {/* Painterly texture */}
      <g opacity={0.025}>
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={64 * i + 20}
            cy={400 + Math.sin(i * 1.5) * 300}
            r={2 + (i % 3)}
            fill={i % 2 === 0 ? '#C08840' : '#E0A860'}
          />
        ))}
      </g>
    </svg>
  );
};

export default DawnGolden;
