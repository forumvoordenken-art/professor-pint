/**
 * sandstorm — Beige/geel waas, zanddeeltjes, woestijnstorm.
 *
 * Egypte, woestijn, Sahara, Midden-Oosten.
 * Thick sand particles obscure visibility.
 * Multiple particle layers at different speeds for depth.
 * Occasional sun barely visible through the haze.
 * Wind-driven horizontal motion dominates.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  ParticleField,
  AtmosphericHaze,
  HorizonGlow,
  seededRandom,
} from './SkyEngine';
import type { ParticleConfig } from './SkyEngine';

const ID = 'sandstorm';

// Sandy, warm, washed-out palette
const SKY_STOPS = [
  { offset: '0%', color: '#8A7050' },        // dark sand
  { offset: '15%', color: '#9A7E58' },       // warm sand
  { offset: '30%', color: '#A88C60' },       // medium sand
  { offset: '50%', color: '#B89868' },       // light sand
  { offset: '70%', color: '#C4A470' },       // pale sand
  { offset: '85%', color: '#CCAC78' },       // near-white sand
  { offset: '100%', color: '#D0B080' },      // hot horizon sand
];

// Heavy sand — large grains, fast, close
const SAND_HEAVY: ParticleConfig = {
  count: 180,
  color: '#C8A060',
  opacity: 0.4,
  sizeRange: [2, 6],
  heightRange: [2, 5],
  speedY: 1.5,
  speedX: 6,
  seed: 5001,
};

// Medium sand — mid-distance
const SAND_MED: ParticleConfig = {
  count: 250,
  color: '#B89858',
  opacity: 0.25,
  sizeRange: [1, 3.5],
  heightRange: [1.5, 3],
  speedY: 1,
  speedX: 4,
  seed: 5002,
};

// Fine sand dust — atmospheric haze particles
const SAND_FINE: ParticleConfig = {
  count: 200,
  color: '#D0A868',
  opacity: 0.12,
  sizeRange: [0.5, 2],
  heightRange: [1, 2],
  speedY: 0.5,
  speedX: 2.5,
  seed: 5003,
};

// Debris — larger objects carried by wind
const DEBRIS: ParticleConfig = {
  count: 15,
  color: '#907040',
  opacity: 0.3,
  sizeRange: [4, 10],
  heightRange: [3, 8],
  speedY: 2,
  speedX: 8,
  seed: 5004,
};

export const Sandstorm: React.FC<AssetProps> = ({ frame }) => {
  const rng = seededRandom(6001);

  // Swirling sand vortex patches
  const vortices = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      cx: rng() * 2200 - 140,
      cy: 300 + rng() * 500,
      rx: 100 + rng() * 200,
      ry: 60 + rng() * 120,
      speed: 2 + rng() * 4,
      rotSpeed: 0.01 + rng() * 0.02,
      opacity: 0.06 + rng() * 0.1,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  // Wind gust variation — periodic intensity changes
  const windGust = 1 + Math.sin(frame * 0.025) * 0.3 + Math.sin(frame * 0.07) * 0.15;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — sandy warm */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Obscured sun — barely visible disk through sand */}
      <defs>
        <radialGradient id={`${ID}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8C878" stopOpacity={0.25} />
          <stop offset="30%" stopColor="#D8B868" stopOpacity={0.12} />
          <stop offset="60%" stopColor="#C8A858" stopOpacity={0.04} />
          <stop offset="100%" stopColor="#C8A858" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={800} cy={250} rx={200} ry={200} fill={`url(#${ID}-sun)`} />
      {/* Faint sun disk */}
      <circle cx={800} cy={250} r={40} fill="#E0C070" opacity={0.15} />

      {/* Sand vortex patches — swirling denser areas */}
      {vortices.map((v, i) => {
        const xPos = (v.cx + frame * v.speed) % 2400 - 240;
        const rotation = frame * v.rotSpeed;
        return (
          <g key={i} opacity={v.opacity * windGust}>
            <ellipse
              cx={xPos}
              cy={v.cy + Math.sin(frame * 0.03 + i) * 20}
              rx={v.rx}
              ry={v.ry}
              fill="#C0A060"
              transform={`rotate(${rotation * 5}, ${xPos}, ${v.cy})`}
            />
            {/* Darker swirl center */}
            <ellipse
              cx={xPos + v.rx * 0.1}
              cy={v.cy + Math.sin(frame * 0.03 + i) * 20}
              rx={v.rx * 0.5}
              ry={v.ry * 0.4}
              fill="#A88848"
              opacity={0.5}
              transform={`rotate(${-rotation * 3}, ${xPos}, ${v.cy})`}
            />
          </g>
        );
      })}

      {/* Horizontal sand streaks — wind direction indicators */}
      <g opacity={0.08 * windGust}>
        {Array.from({ length: 15 }, (_, i) => {
          const y = 200 + i * 55 + Math.sin(frame * 0.02 + i) * 20;
          const xOff = (frame * (3 + i * 0.3)) % 2200;
          const width = 200 + (i % 4) * 100;
          return (
            <rect
              key={i}
              x={xOff - 100}
              y={y}
              width={width}
              height={2 + (i % 3)}
              rx={1}
              fill="#C8A860"
            />
          );
        })}
      </g>

      {/* Sand particle layers — multiple depths */}
      <g opacity={windGust}>
        <ParticleField config={SAND_FINE} frame={frame} />
      </g>
      <g opacity={windGust}>
        <ParticleField config={SAND_MED} frame={frame} />
      </g>
      <g opacity={windGust}>
        <ParticleField config={SAND_HEAVY} frame={frame} />
      </g>

      {/* Large debris */}
      <g opacity={windGust * 0.7}>
        <ParticleField config={DEBRIS} frame={frame} />
      </g>

      {/* Dense sand fog layers */}
      <defs>
        <linearGradient id={`${ID}-fog1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B89858" stopOpacity={0.1} />
          <stop offset="40%" stopColor="#B89858" stopOpacity={0.2} />
          <stop offset="70%" stopColor="#B89858" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#B89858" stopOpacity={0.5} />
        </linearGradient>
        <linearGradient id={`${ID}-fog2`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C0A060" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#C0A060" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#C0A060" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-fog1)`} />
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-fog2)`} />

      {/* Ground dust horizon glow */}
      <HorizonGlow
        color="#C0A060"
        cy={1000}
        rx={1200}
        ry={250}
        opacity={0.35}
        id={`${ID}-hz`}
        frame={frame}
        pulseAmount={0.04}
      />

      {/* Atmospheric haze — thick sand */}
      <AtmosphericHaze color="#B89858" intensity={0.9} horizonY={0.7} id={ID} />

      {/* Warm desaturation wash */}
      <rect x={0} y={0} width={1920} height={1080} fill="#C0A060" opacity={0.06} />

      {/* Vignette */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="60%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#4A3820" stopOpacity={0.2} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default Sandstorm;
