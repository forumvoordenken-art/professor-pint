/**
 * day_cloudy — Bewolkte hemel, grijs-wit, zachte diffuse schaduwen.
 *
 * Alledaagse scenes, Europa, overcast-but-not-depressing.
 * Multiple cloud layers fill most of the sky.
 * Occasional blue peeks through gaps.
 * Lower contrast than clear day — flatter, more muted.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  AtmosphericHaze,
  generateClouds,
} from './SkyEngine';

const ID = 'day-cloudy';

// Overcast gradient — muted, grey-blue
const SKY_STOPS = [
  { offset: '0%', color: '#7A8FA8' },        // grey-blue zenith
  { offset: '20%', color: '#8EA0B4' },       // lighter grey-blue
  { offset: '45%', color: '#A8B8C6' },       // mid grey
  { offset: '65%', color: '#BCC8D0' },       // pale grey
  { offset: '80%', color: '#C8D0D8' },       // near-white
  { offset: '100%', color: '#D4D8DC' },      // horizon grey
];

// Dense overcast layer — fills most of the sky
const CLOUDS_OVERCAST = generateClouds(8, 411, {
  yRange: [50, 350],
  rxRange: [300, 550],
  ryRange: [60, 120],
  fill: '#C8CED6',
  opacityRange: [0.6, 0.85],
  driftRange: [0.04, 0.1],
  blobRange: [5, 9],
});

// Darker undersides — depth and dimension
const CLOUDS_DARK = generateClouds(6, 512, {
  yRange: [200, 500],
  rxRange: [200, 400],
  ryRange: [40, 80],
  fill: '#98A4B0',
  opacityRange: [0.3, 0.5],
  driftRange: [0.06, 0.12],
  blobRange: [3, 6],
});

// Bright patches — where sun almost breaks through
const CLOUDS_BRIGHT = generateClouds(4, 613, {
  yRange: [80, 280],
  rxRange: [120, 250],
  ryRange: [30, 60],
  fill: '#E4E8EC',
  opacityRange: [0.4, 0.65],
  driftRange: [0.05, 0.09],
  blobRange: [2, 4],
});

// Blue peeks — tiny gaps showing blue sky behind
const BLUE_PEEKS = [
  { cx: 350, cy: 150, rx: 60, ry: 25, drift: 0.07 },
  { cx: 1100, cy: 200, rx: 45, ry: 20, drift: 0.05 },
  { cx: 1600, cy: 120, rx: 55, ry: 22, drift: 0.06 },
];

export const DayCloudy: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    overcast: CLOUDS_OVERCAST,
    dark: CLOUDS_DARK,
    bright: CLOUDS_BRIGHT,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — muted grey-blue */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Hidden blue sky behind clouds — slightly more saturated */}
      <defs>
        <linearGradient id={`${ID}-blue-behind`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5080B8" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#6090C0" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#6090C0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-blue-behind)`} />

      {/* Blue sky peeks through cloud gaps */}
      {BLUE_PEEKS.map((peek, i) => {
        const xOff = (frame * peek.drift) % 2200;
        return (
          <ellipse
            key={i}
            cx={peek.cx + xOff}
            cy={peek.cy}
            rx={peek.rx}
            ry={peek.ry}
            fill="#6898C0"
            opacity={0.2 + Math.sin(frame * 0.02 + i) * 0.05}
          />
        );
      })}

      {/* Dense overcast layer */}
      <CloudLayer clouds={clouds.overcast} frame={frame} idPrefix={`${ID}-oc`} />

      {/* Darker undersides for depth */}
      <CloudLayer clouds={clouds.dark} frame={frame} idPrefix={`${ID}-dk`} />

      {/* Bright patches — sun trying to break through */}
      <CloudLayer clouds={clouds.bright} frame={frame} idPrefix={`${ID}-br`} />

      {/* Soft light diffusion — where sun is roughly overhead */}
      <defs>
        <radialGradient id={`${ID}-diffuse`} cx="0.45" cy="0.25" r="0.5">
          <stop offset="0%" stopColor="#E0E4E8" stopOpacity={0.2} />
          <stop offset="60%" stopColor="#D0D4D8" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#D0D4D8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-diffuse)`} />

      {/* Streaky middle cloud layer — wispy horizontal streaks */}
      <g opacity={0.15}>
        <ellipse cx={300 + (frame * 0.08) % 2400} cy={420} rx={400} ry={8} fill="#B0B8C0" />
        <ellipse cx={800 + (frame * 0.06) % 2400} cy={380} rx={350} ry={6} fill="#A8B0B8" />
        <ellipse cx={1400 + (frame * 0.07) % 2400} cy={450} rx={300} ry={7} fill="#B4BCC4" />
        <ellipse cx={500 + (frame * 0.09) % 2400} cy={500} rx={380} ry={9} fill="#ACB4BC" />
        <ellipse cx={1100 + (frame * 0.05) % 2400} cy={340} rx={320} ry={5} fill="#B8C0C8" />
      </g>

      {/* Cloud shadow bands on lower sky */}
      <g opacity={0.06}>
        <rect x={0} y={600} width={1920} height={40} fill="#6A7A8A" />
        <rect x={0} y={680} width={1920} height={30} fill="#6A7A8A" />
        <rect x={0} y={740} width={1920} height={50} fill="#6A7A8A" />
      </g>

      {/* Atmospheric haze — heavier than clear day */}
      <AtmosphericHaze color="#C0C8D0" intensity={0.7} horizonY={0.8} id={ID} />

      {/* Very subtle rain hint — barely visible diagonal streaks */}
      <g opacity={0.03}>
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={i}
            x1={96 * i + (frame * 0.5) % 100}
            y1={700 + (i % 5) * 30}
            x2={96 * i + 15 + (frame * 0.5) % 100}
            y2={780 + (i % 5) * 30}
            stroke="#7A8A9A"
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Painterly texture — muted oil painting dots */}
      <g opacity={0.025}>
        {Array.from({ length: 25 }, (_, i) => (
          <circle
            key={i}
            cx={77 * i + 20}
            cy={300 + Math.sin(i * 2.3) * 200}
            r={1.5 + (i % 4)}
            fill={i % 3 === 0 ? '#8898A8' : i % 3 === 1 ? '#A0B0C0' : '#C0CCD6'}
          />
        ))}
      </g>
    </svg>
  );
};

export default DayCloudy;
