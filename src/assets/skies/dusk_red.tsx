/**
 * dusk_red — Bloedrode schemering, donkere wolken. Spanning.
 *
 * Oorlog, conflict, revoluties, dramatische keerpunten.
 * Blood-red dominates with dark, almost black cloud masses.
 * Ominous feel — like the sky is on fire.
 * Embers and ash-like particles float in the air.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  AtmosphericHaze,
  HorizonGlow,
  generateClouds,
  seededRandom,
} from './SkyEngine';

const ID = 'dusk-red';

// Blood-red palette — ominous, fiery
const SKY_STOPS = [
  { offset: '0%', color: '#0A0808' },        // near black
  { offset: '8%', color: '#1A0A08' },        // very dark red-black
  { offset: '18%', color: '#2A1008' },       // dark blood
  { offset: '30%', color: '#4A1810' },       // deep crimson
  { offset: '42%', color: '#6A2018' },       // blood red
  { offset: '54%', color: '#8A2818' },       // crimson
  { offset: '64%', color: '#A83020' },       // bright crimson
  { offset: '74%', color: '#C04028' },       // fire red
  { offset: '84%', color: '#D05030' },       // orange-red
  { offset: '92%', color: '#D86030' },       // fiery orange
  { offset: '100%', color: '#E07038' },      // burning horizon
];

// Massive dark cloud formations — ominous, heavy
const DARK_FORMATIONS = generateClouds(5, 551, {
  yRange: [50, 350],
  rxRange: [300, 550],
  ryRange: [60, 130],
  fill: '#0A0808',
  opacityRange: [0.5, 0.75],
  driftRange: [0.03, 0.06],
  blobRange: [5, 9],
});

// Red-lit undersides — fire reflected on cloud bases
const RED_UNDERSIDES = generateClouds(4, 652, {
  yRange: [300, 500],
  rxRange: [200, 400],
  ryRange: [20, 40],
  fill: '#A02818',
  opacityRange: [0.25, 0.45],
  driftRange: [0.04, 0.08],
  blobRange: [2, 4],
});

// Smoke-like wisps — drifting dark tendrils
const SMOKE_WISPS = generateClouds(6, 753, {
  yRange: [200, 600],
  rxRange: [100, 250],
  ryRange: [15, 35],
  fill: '#1A0A08',
  opacityRange: [0.15, 0.3],
  driftRange: [0.06, 0.12],
  blobRange: [2, 4],
});

// Burning horizon bands
const FIRE_BANDS = generateClouds(5, 854, {
  yRange: [650, 830],
  rxRange: [300, 600],
  ryRange: [8, 18],
  fill: '#D05028',
  opacityRange: [0.3, 0.5],
  driftRange: [0.02, 0.05],
  blobRange: [1, 3],
});

export const DuskRed: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    dark: DARK_FORMATIONS,
    redUnder: RED_UNDERSIDES,
    smoke: SMOKE_WISPS,
    fire: FIRE_BANDS,
  }), []);

  // Ember particle system
  const rng = seededRandom(999);
  const embers = useMemo(() =>
    Array.from({ length: 50 }, () => ({
      x: rng() * 2000 - 40,
      y: rng() * 1100,
      size: 0.8 + rng() * 2.5,
      speed: 0.3 + rng() * 1.2,
      drift: -0.2 + rng() * 0.4,
      brightness: 0.3 + rng() * 0.7,
      phase: rng() * Math.PI * 2,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — black to blood red to burning orange */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Infernal horizon glow — the world is burning */}
      <HorizonGlow
        color="#C03020"
        cy={950}
        rx={1400}
        ry={400}
        opacity={0.5}
        id={`${ID}-main`}
        frame={frame}
        pulseAmount={0.05}
      />

      {/* Secondary deep red glow — higher */}
      <HorizonGlow
        color="#801818"
        cy={650}
        rx={1000}
        ry={300}
        opacity={0.2}
        id={`${ID}-deep`}
        frame={frame}
        pulseAmount={0.03}
      />

      {/* Pulsing fire glow — makes the horizon breathe */}
      <HorizonGlow
        color="#E05030"
        cy={1000}
        rx={800}
        ry={200}
        opacity={0.1 + Math.sin(frame * 0.04) * 0.05}
        id={`${ID}-pulse`}
        frame={frame}
        pulseAmount={0.08}
      />

      {/* Massive dark cloud formations */}
      <CloudLayer clouds={clouds.dark} frame={frame} idPrefix={`${ID}-dk`} />

      {/* Fire-lit undersides */}
      <CloudLayer clouds={clouds.redUnder} frame={frame} idPrefix={`${ID}-ru`} />

      {/* Red rimlight on dark cloud edges */}
      <g opacity={0.18}>
        {clouds.dark.map((c, i) => {
          const drift = c.drift ?? 0.04;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          return (
            <ellipse
              key={i}
              cx={c.cx + xOff}
              cy={c.cy + c.ry * 0.5}
              rx={c.rx * 0.7}
              ry={c.ry * 0.12}
              fill="#B03020"
            />
          );
        })}
      </g>

      {/* Smoke wisps — drifting dark tendrils */}
      <CloudLayer clouds={clouds.smoke} frame={frame} idPrefix={`${ID}-sm`} />

      {/* Burning horizon bands */}
      <CloudLayer clouds={clouds.fire} frame={frame} idPrefix={`${ID}-fb`} />

      {/* Ember/ash particles — floating upward */}
      <g>
        {embers.map((e, i) => {
          const yPos = (e.y - frame * e.speed + 1200) % 1200 - 60;
          const xPos = e.x + Math.sin(frame * 0.03 + e.phase) * 30 + frame * e.drift;
          const flicker = 0.5 + 0.5 * Math.sin(frame * 0.15 + e.phase);
          const opacity = e.brightness * flicker * 0.6;

          return (
            <g key={i}>
              {/* Ember glow */}
              <circle cx={xPos} cy={yPos} r={e.size * 2.5} fill="#E04020" opacity={opacity * 0.15} />
              {/* Ember core */}
              <circle cx={xPos} cy={yPos} r={e.size} fill="#F08040" opacity={opacity} />
              {/* Bright center */}
              <circle cx={xPos} cy={yPos} r={e.size * 0.4} fill="#FFD080" opacity={opacity * 0.7} />
            </g>
          );
        })}
      </g>

      {/* Smoke haze — rising from below */}
      <defs>
        <linearGradient id={`${ID}-smoke-haze`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#1A0808" stopOpacity={0.4} />
          <stop offset="30%" stopColor="#1A0808" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#1A0808" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-smoke-haze)`} />

      {/* Atmospheric haze — dark red-brown */}
      <AtmosphericHaze color="#3A1810" intensity={0.7} horizonY={0.78} id={ID} />

      {/* Dark vignette — ominous framing */}
      <defs>
        <radialGradient id={`${ID}-vignette`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="70%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.3} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vignette)`} />

      {/* Painterly texture — blood reds */}
      <g opacity={0.03}>
        {Array.from({ length: 25 }, (_, i) => (
          <circle
            key={i}
            cx={77 * i + 15}
            cy={400 + Math.sin(i * 1.6) * 300}
            r={2 + (i % 3)}
            fill={i % 2 === 0 ? '#601010' : '#903020'}
          />
        ))}
      </g>
    </svg>
  );
};

export default DuskRed;
