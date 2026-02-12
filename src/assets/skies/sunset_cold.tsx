/**
 * sunset_cold — Paars/blauw/violet zonsondergang. Melancholisch.
 *
 * Val van rijken, einde van tijdperken, tragische momenten.
 * Cold color dominance — purple, violet, steel blue with minimal warm.
 * Thin orange strip at horizon is the only warmth.
 * Elongated altocumulus in cold tones.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  AtmosphericHaze,
  HorizonGlow,
  generateClouds,
  generateStars,
  StarField,
} from './SkyEngine';

const ID = 'sun-cold';

// Cold sunset palette — dominated by purple and steel blue
const SKY_STOPS = [
  { offset: '0%', color: '#0A0E20' },        // near-black zenith
  { offset: '10%', color: '#141830' },       // deep indigo
  { offset: '22%', color: '#282848' },       // dark violet
  { offset: '35%', color: '#3A3868' },       // purple
  { offset: '48%', color: '#504878' },       // medium purple
  { offset: '58%', color: '#686088' },       // mauve
  { offset: '68%', color: '#887898' },       // lavender grey
  { offset: '78%', color: '#A8909A' },       // pink-grey
  { offset: '86%', color: '#C0988A' },       // muted peach
  { offset: '93%', color: '#D0986A' },       // thin warm band
  { offset: '100%', color: '#C88858' },      // narrow golden horizon
];

// Early stars appearing at top
const EARLY_STARS = generateStars(45, 171, 350, 0.07);

// Altocumulus bands — long, cold-toned, layered
const ALTO_BANDS = generateClouds(6, 541, {
  yRange: [250, 550],
  rxRange: [250, 500],
  ryRange: [10, 25],
  fill: '#504870',
  opacityRange: [0.25, 0.45],
  driftRange: [0.03, 0.07],
  blobRange: [2, 4],
});

// Darker cloud masses — brooding, heavy
const DARK_MASSES = generateClouds(3, 642, {
  yRange: [150, 350],
  rxRange: [250, 450],
  ryRange: [50, 100],
  fill: '#1A1830',
  opacityRange: [0.3, 0.5],
  driftRange: [0.04, 0.07],
  blobRange: [4, 7],
});

// Thin warm edge clouds — barely lit by the dying sun
const WARM_EDGES = generateClouds(4, 743, {
  yRange: [600, 780],
  rxRange: [200, 400],
  ryRange: [6, 14],
  fill: '#C08858',
  opacityRange: [0.2, 0.35],
  driftRange: [0.02, 0.05],
  blobRange: [1, 3],
});

// Purple mid-level wisps
const PURPLE_WISPS = generateClouds(5, 844, {
  yRange: [350, 550],
  rxRange: [150, 300],
  ryRange: [15, 35],
  fill: '#685080',
  opacityRange: [0.15, 0.3],
  driftRange: [0.05, 0.09],
  blobRange: [2, 4],
});

export const SunsetCold: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    alto: ALTO_BANDS,
    dark: DARK_MASSES,
    warm: WARM_EDGES,
    purple: PURPLE_WISPS,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — cold purple-violet */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Appearing stars */}
      <g opacity={0.5}>
        <StarField stars={EARLY_STARS} frame={frame} twinkleSpeed={0.04} />
      </g>

      {/* Very narrow warm horizon glow — the only warmth */}
      <HorizonGlow
        color="#C08050"
        cy={950}
        rx={1200}
        ry={150}
        opacity={0.3}
        id={`${ID}-warm`}
        frame={frame}
        pulseAmount={0.02}
      />

      {/* Cold violet glow — dominant */}
      <HorizonGlow
        color="#584078"
        cy={700}
        rx={1000}
        ry={350}
        opacity={0.15}
        id={`${ID}-violet`}
      />

      {/* Dark cloud masses — brooding silhouettes */}
      <CloudLayer clouds={clouds.dark} frame={frame} idPrefix={`${ID}-dk`} />

      {/* Purple undersides — cold reflected light on dark clouds */}
      <g opacity={0.1}>
        {clouds.dark.map((c, i) => {
          const drift = c.drift ?? 0.05;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          return (
            <ellipse
              key={i}
              cx={c.cx + xOff}
              cy={c.cy + c.ry * 0.5}
              rx={c.rx * 0.6}
              ry={c.ry * 0.2}
              fill="#705888"
            />
          );
        })}
      </g>

      {/* Altocumulus bands — layered cold streaks */}
      <CloudLayer clouds={clouds.alto} frame={frame} idPrefix={`${ID}-ac`} />

      {/* Purple wisps — mid-level atmosphere */}
      <CloudLayer clouds={clouds.purple} frame={frame} idPrefix={`${ID}-pw`} />

      {/* Warm edge clouds — last light at horizon */}
      <CloudLayer clouds={clouds.warm} frame={frame} idPrefix={`${ID}-we`} />

      {/* Thin horizontal color bands — atmospheric scattering */}
      <g opacity={0.08}>
        <rect x={0} y={680} width={1920} height={3} fill="#A07060" />
        <rect x={0} y={710} width={1920} height={2} fill="#907868" />
        <rect x={0} y={740} width={1920} height={4} fill="#806858" />
        <rect x={0} y={770} width={1920} height={3} fill="#908070" />
        <rect x={0} y={800} width={1920} height={2} fill="#A08868" />
      </g>

      {/* Violet mist in lower sky */}
      <defs>
        <linearGradient id={`${ID}-mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A2850" stopOpacity={0} />
          <stop offset="50%" stopColor="#3A2850" stopOpacity={0.05} />
          <stop offset="80%" stopColor="#3A2850" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#4A3860" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-mist)`} />

      {/* Atmospheric haze — cold purple */}
      <AtmosphericHaze color="#4A3858" intensity={0.6} horizonY={0.82} id={ID} />

      {/* Cold color grade overlay */}
      <rect x={0} y={0} width={1920} height={1080} fill="#2A1840" opacity={0.04} />

      {/* Painterly texture — cold purples */}
      <g opacity={0.02}>
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={64 * i + 20}
            cy={350 + Math.sin(i * 2.0) * 250}
            r={1.5 + (i % 4)}
            fill={i % 3 === 0 ? '#3A2858' : i % 3 === 1 ? '#584878' : '#887098'}
          />
        ))}
      </g>
    </svg>
  );
};

export default SunsetCold;
