/**
 * day_hazy — Warm, wazig, bleek blauw. Hitte-waas effect.
 *
 * Woestijn, zomer, Midden-Oosten, mediterraan.
 * Washed-out colors, strong horizon glow, heat shimmer.
 * Very few clouds — mostly haze and atmospheric distortion.
 * Sun is high and harsh — creates a bleached, overexposed feel.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  AtmosphericHaze,
  HorizonGlow,
  CelestialBody,
} from './SkyEngine';

const ID = 'day-hazy';

// Washed-out warm palette — desaturated, bleached
const SKY_STOPS = [
  { offset: '0%', color: '#5A7898' },        // washed zenith
  { offset: '12%', color: '#7898B0' },       // pale blue
  { offset: '28%', color: '#98B4C4' },       // bleached sky
  { offset: '45%', color: '#B8CCd4' },       // very pale
  { offset: '62%', color: '#D0D8D4' },       // warm-grey transition
  { offset: '78%', color: '#DCD8C8' },       // warm cream
  { offset: '90%', color: '#E4D8B8' },       // sandy horizon
  { offset: '100%', color: '#E8D4A8' },      // hot sand glow
];

export const DayHazy: React.FC<AssetProps> = ({ frame }) => {
  // Heat shimmer — subtle vertical distortion
  const shimmerY1 = Math.sin(frame * 0.08) * 3;
  const shimmerY2 = Math.sin(frame * 0.06 + 1.5) * 4;
  const shimmerY3 = Math.sin(frame * 0.1 + 3) * 2.5;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — washed out, warm */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Harsh sun — high position, large glow, almost white */}
      <CelestialBody
        cx={1100}
        cy={120}
        r={45}
        fill="#FFF8E0"
        glowColor="#FFF0C0"
        glowRadius={350}
        frame={frame}
        pulseAmount={0.04}
      />

      {/* Sun overexposure wash — bleaches the upper sky */}
      <defs>
        <radialGradient id={`${ID}-overexpose`} cx="0.57" cy="0.11" r="0.55">
          <stop offset="0%" stopColor="#FFFFF0" stopOpacity={0.3} />
          <stop offset="20%" stopColor="#FFF8E0" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#F0E8D0" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#F0E8D0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-overexpose)`} />

      {/* Dust haze layers — multiple thin bands */}
      <defs>
        <linearGradient id={`${ID}-dust1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D8C8A0" stopOpacity={0} />
          <stop offset="60%" stopColor="#D8C8A0" stopOpacity={0.08} />
          <stop offset="80%" stopColor="#D0C098" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#C8B890" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id={`${ID}-dust2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0A870" stopOpacity={0} />
          <stop offset="70%" stopColor="#C0A870" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#C0A870" stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-dust1)`} />
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-dust2)`} />

      {/* Heat shimmer bands — subtle wavy horizontal distortions */}
      <g opacity={0.06}>
        <ellipse cx={960} cy={750 + shimmerY1} rx={900} ry={8} fill="#E0D0B0" />
        <ellipse cx={960} cy={800 + shimmerY2} rx={800} ry={10} fill="#D8C8A0" />
        <ellipse cx={960} cy={850 + shimmerY3} rx={850} ry={12} fill="#D0C098" />
        <ellipse cx={960} cy={900 + shimmerY1 * 0.8} rx={920} ry={15} fill="#C8B890" />
        <ellipse cx={960} cy={950 + shimmerY2 * 0.6} rx={960} ry={18} fill="#C0B088" />
      </g>

      {/* Wispy high-altitude dust clouds — very thin, stretched */}
      <g opacity={0.1}>
        <ellipse cx={300 + (frame * 0.04) % 2400} cy={200} rx={400} ry={6} fill="#C8C0A8" />
        <ellipse cx={800 + (frame * 0.035) % 2400} cy={160} rx={350} ry={4} fill="#D0C8B0" />
        <ellipse cx={1500 + (frame * 0.03) % 2400} cy={240} rx={300} ry={5} fill="#C0B8A0" />
        <ellipse cx={1000 + (frame * 0.045) % 2400} cy={300} rx={450} ry={8} fill="#D0C8B0" />
      </g>

      {/* Floating dust motes — subtle particles in the air */}
      <g opacity={0.08}>
        {Array.from({ length: 40 }, (_, i) => {
          const speed = 0.02 + (i % 7) * 0.008;
          const yBase = 400 + (i * 37) % 500;
          const xBase = (i * 89) % 1920;
          const wobble = Math.sin(frame * speed + i * 0.8) * 20;
          const size = 1 + (i % 4) * 0.5;
          return (
            <circle
              key={i}
              cx={xBase + wobble}
              cy={yBase + Math.sin(frame * 0.015 + i) * 10}
              r={size}
              fill={i % 2 === 0 ? '#D8C8A0' : '#E0D8C0'}
            />
          );
        })}
      </g>

      {/* Horizon glow — strong warm radiance from the ground */}
      <HorizonGlow
        color="#E8D0A0"
        cy={950}
        rx={1200}
        ry={300}
        opacity={0.35}
        id={`${ID}-hz`}
        frame={frame}
        pulseAmount={0.03}
      />

      {/* Main atmospheric haze — very heavy near horizon */}
      <AtmosphericHaze color="#D8CCA0" intensity={0.85} horizonY={0.75} id={ID} />

      {/* Subtle warm color grade overlay */}
      <rect x={0} y={0} width={1920} height={1080} fill="#E8D0A0" opacity={0.04} />

      {/* Painterly brush texture — warm dusty specks */}
      <g opacity={0.03}>
        {Array.from({ length: 35 }, (_, i) => (
          <circle
            key={i}
            cx={55 * i + 15}
            cy={500 + Math.sin(i * 1.9) * 300}
            r={1.5 + (i % 3) * 1.2}
            fill={i % 2 === 0 ? '#B8A880' : '#D0C0A0'}
          />
        ))}
      </g>
    </svg>
  );
};

export default DayHazy;
