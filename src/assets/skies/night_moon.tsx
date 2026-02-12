/**
 * night_moon — Maanlicht, zilver, mysterieus.
 *
 * Samenzweringen, geheimen, nachtelijke operaties.
 * Large bright moon dominates the sky with silver light.
 * Moonlit clouds with silver edges and dark interiors.
 * Stars visible but washed out near the moon.
 * Cool blue-silver color palette throughout.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  StarField,
  CelestialBody,
  AtmosphericHaze,
  HorizonGlow,
  generateClouds,
  generateStars,
} from './SkyEngine';

const ID = 'night-moon';

// Moonlit night palette — cool blue-silver
const SKY_STOPS = [
  { offset: '0%', color: '#06081A' },        // deep dark blue-black
  { offset: '12%', color: '#0A1028' },       // dark navy
  { offset: '28%', color: '#0E1838' },       // navy
  { offset: '45%', color: '#142040' },       // blue-navy
  { offset: '60%', color: '#1A2848' },       // moonlit blue
  { offset: '75%', color: '#203050' },       // lighter night blue
  { offset: '90%', color: '#283858' },       // horizon blue
  { offset: '100%', color: '#304060' },      // moonlit horizon
];

// Stars — fewer visible near moon due to light
const STARS_DIM = generateStars(50, 311, 600, 0.04);
const STARS_BRIGHT = generateStars(15, 312, 500, 0.1);

// Moonlit clouds — silver edges, dark bodies
const SILVER_CLOUDS = generateClouds(4, 561, {
  yRange: [150, 400],
  rxRange: [180, 350],
  ryRange: [40, 80],
  fill: '#182838',
  opacityRange: [0.4, 0.65],
  driftRange: [0.04, 0.08],
  blobRange: [4, 7],
});

// Thin wispy moon-lit clouds — passing across moon
const WISPY_CLOUDS = generateClouds(5, 662, {
  yRange: [100, 350],
  rxRange: [200, 400],
  ryRange: [15, 30],
  fill: '#283848',
  opacityRange: [0.15, 0.3],
  driftRange: [0.06, 0.12],
  blobRange: [2, 4],
});

// Low horizon mist — moonlit fog
const MIST_CLOUDS = generateClouds(4, 763, {
  yRange: [700, 900],
  rxRange: [300, 600],
  ryRange: [30, 60],
  fill: '#283848',
  opacityRange: [0.15, 0.3],
  driftRange: [0.02, 0.04],
  blobRange: [3, 5],
});

// Moon craters
const MOON_CRATERS = [
  { cx: -8, cy: -5, r: 6 },
  { cx: 10, cy: 8, r: 4 },
  { cx: -12, cy: 10, r: 5 },
  { cx: 5, cy: -12, r: 3.5 },
  { cx: -3, cy: 14, r: 4.5 },
  { cx: 15, cy: -3, r: 3 },
  { cx: -15, cy: -10, r: 2.5 },
  { cx: 8, cy: -8, r: 2 },
];

export const NightMoon: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    silver: SILVER_CLOUDS,
    wispy: WISPY_CLOUDS,
    mist: MIST_CLOUDS,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — cool moonlit blue-black */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Moon-washed area — brighter patch around moon position */}
      <defs>
        <radialGradient id={`${ID}-moonwash`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#304868" stopOpacity={0.3} />
          <stop offset="40%" stopColor="#203050" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#203050" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={1300} cy={200} rx={600} ry={500} fill={`url(#${ID}-moonwash)`} />

      {/* Dim stars — washed out near moon */}
      <g opacity={0.4}>
        <StarField stars={STARS_DIM} frame={frame} twinkleSpeed={0.04} />
      </g>
      {/* Brighter stars — farther from moon */}
      <g opacity={0.6}>
        <StarField stars={STARS_BRIGHT} frame={frame} twinkleSpeed={0.05} />
      </g>

      {/* Silver clouds — dark bodies */}
      <CloudLayer clouds={clouds.silver} frame={frame} idPrefix={`${ID}-sv`} />

      {/* Silver rimlight on cloud edges — moonlight hitting tops */}
      <g opacity={0.2}>
        {clouds.silver.map((c, i) => {
          const drift = c.drift ?? 0.06;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          // Rimlight on the side facing the moon (right-upper)
          return (
            <ellipse
              key={i}
              cx={c.cx + xOff + c.rx * 0.3}
              cy={c.cy - c.ry * 0.35}
              rx={c.rx * 0.5}
              ry={c.ry * 0.2}
              fill="#8098B8"
            />
          );
        })}
      </g>

      {/* The Moon — large, detailed, bright */}
      <CelestialBody
        cx={1300}
        cy={200}
        r={50}
        fill="#E0E8F0"
        glowColor="#8098B8"
        glowRadius={300}
        frame={frame}
        craters={MOON_CRATERS}
        pulseAmount={0.03}
      />

      {/* Moon surface detail — mare (dark patches) */}
      <g opacity={0.06}>
        <ellipse cx={1292} cy={195} rx={20} ry={15} fill="#607080" />
        <ellipse cx={1310} cy={210} rx={12} ry={10} fill="#506070" />
        <ellipse cx={1285} cy={215} rx={15} ry={8} fill="#607080" />
      </g>

      {/* Wispy clouds — passing across/near moon */}
      <CloudLayer clouds={clouds.wispy} frame={frame} idPrefix={`${ID}-wp`} />

      {/* Moonbeam — subtle ray of light downward */}
      <defs>
        <linearGradient id={`${ID}-beam`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#8098B8" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#8098B8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g opacity={0.5}>
        <polygon
          points="1280,250 1320,250 1450,1080 1150,1080"
          fill={`url(#${ID}-beam)`}
        />
      </g>

      {/* Low mist — moonlit horizon fog */}
      <CloudLayer clouds={clouds.mist} frame={frame} idPrefix={`${ID}-ms`} />

      {/* Silver mist glow on horizon */}
      <HorizonGlow
        color="#405878"
        cy={900}
        rx={1200}
        ry={200}
        opacity={0.15}
        id={`${ID}-hz`}
        frame={frame}
        pulseAmount={0.02}
      />

      {/* Atmospheric haze — cool blue */}
      <AtmosphericHaze color="#182838" intensity={0.5} horizonY={0.85} id={ID} />

      {/* Cool silver color grade */}
      <rect x={0} y={0} width={1920} height={1080} fill="#4060A0" opacity={0.03} />

      {/* Dark vignette — mysterious framing */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.68" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="60%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.25} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default NightMoon;
