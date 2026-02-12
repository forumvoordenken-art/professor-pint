/**
 * storm_dark — Donkergrijs, bliksem, dreigend.
 *
 * Rampen, revoluties, crisis, dramatische wendingen.
 * Massive dark cumulonimbus clouds dominate.
 * Event-based lightning strikes illuminate the scene.
 * Ominous green-grey tint (storm light).
 * Wind-driven cloud movement.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  CloudLayer,
  LightningSystem,
  AtmosphericHaze,
  HorizonGlow,
  generateClouds,
} from './SkyEngine';
import type { LightningBolt } from './SkyEngine';

const ID = 'storm-dark';

// Ominous storm palette — grey-green, dark, oppressive
const SKY_STOPS = [
  { offset: '0%', color: '#1A1C1E' },        // near-black top
  { offset: '12%', color: '#222428' },       // dark grey
  { offset: '25%', color: '#2A2C30' },       // grey
  { offset: '40%', color: '#343838' },       // mid grey-green
  { offset: '55%', color: '#3C4240' },       // storm green-grey
  { offset: '68%', color: '#444A48' },       // lighter storm
  { offset: '80%', color: '#4C5450' },       // green-grey
  { offset: '90%', color: '#505850' },       // horizon storm green
  { offset: '100%', color: '#485048' },      // dark green horizon
];

// Massive cumulonimbus — towering, menacing
const CB_MAIN = generateClouds(4, 571, {
  yRange: [30, 250],
  rxRange: [350, 600],
  ryRange: [100, 200],
  fill: '#282C30',
  opacityRange: [0.7, 0.9],
  driftRange: [0.08, 0.15],
  blobRange: [6, 10],
});

// Mid-level turbulent clouds — moving fast
const TURBULENT = generateClouds(6, 672, {
  yRange: [250, 500],
  rxRange: [200, 400],
  ryRange: [40, 80],
  fill: '#343838',
  opacityRange: [0.5, 0.7],
  driftRange: [0.12, 0.25],
  blobRange: [4, 7],
});

// Low scud clouds — ragged, fast-moving
const SCUD = generateClouds(5, 773, {
  yRange: [500, 700],
  rxRange: [150, 300],
  ryRange: [20, 40],
  fill: '#3C4040',
  opacityRange: [0.3, 0.5],
  driftRange: [0.2, 0.4],
  blobRange: [2, 4],
});

// Very dark undersides — anvil bases
const ANVIL_BASES = generateClouds(3, 874, {
  yRange: [200, 350],
  rxRange: [300, 500],
  ryRange: [25, 45],
  fill: '#1A1C20',
  opacityRange: [0.5, 0.7],
  driftRange: [0.08, 0.15],
  blobRange: [3, 5],
});

// Lightning bolts — multiple paths for variety
const BOLTS: LightningBolt[] = [
  {
    x: 600, width: 3, color: '#E0E8FF', glowColor: '#6080C0',
    segments: [
      { dx: -20, dy: 80 }, { dx: 15, dy: 60 }, { dx: -30, dy: 100 },
      { dx: 10, dy: 70 }, { dx: -15, dy: 90 }, { dx: 25, dy: 110 },
      { dx: -10, dy: 80 }, { dx: 5, dy: 60 },
    ],
  },
  {
    x: 1300, width: 2.5, color: '#D8E0FF', glowColor: '#5070B0',
    segments: [
      { dx: 15, dy: 70 }, { dx: -25, dy: 90 }, { dx: 10, dy: 60 },
      { dx: -20, dy: 100 }, { dx: 30, dy: 80 }, { dx: -15, dy: 70 },
      { dx: 5, dy: 90 },
    ],
  },
  {
    x: 400, width: 2, color: '#D0D8FF', glowColor: '#4868A8',
    segments: [
      { dx: -10, dy: 90 }, { dx: 20, dy: 70 }, { dx: -15, dy: 80 },
      { dx: 5, dy: 100 }, { dx: -20, dy: 60 }, { dx: 10, dy: 90 },
    ],
  },
  {
    x: 1000, width: 3.5, color: '#E8F0FF', glowColor: '#7090D0',
    segments: [
      { dx: -30, dy: 60 }, { dx: 20, dy: 80 }, { dx: -10, dy: 70 },
      { dx: 25, dy: 90 }, { dx: -35, dy: 100 }, { dx: 15, dy: 80 },
      { dx: -5, dy: 70 }, { dx: 10, dy: 60 },
    ],
  },
];

export const StormDark: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    cb: CB_MAIN,
    turbulent: TURBULENT,
    scud: SCUD,
    anvil: ANVIL_BASES,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — ominous grey-green */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Storm green tint — eerie color cast */}
      <defs>
        <radialGradient id={`${ID}-green`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#304830" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#304830" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-green)`} />

      {/* Massive cumulonimbus towers */}
      <CloudLayer clouds={clouds.cb} frame={frame} idPrefix={`${ID}-cb`} />

      {/* Dark anvil bases — very dark undersides */}
      <CloudLayer clouds={clouds.anvil} frame={frame} idPrefix={`${ID}-av`} />

      {/* Green-lit cloud edges — storm light reflecting */}
      <g opacity={0.08}>
        {clouds.cb.map((c, i) => {
          const drift = c.drift ?? 0.1;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          return (
            <ellipse
              key={i}
              cx={c.cx + xOff}
              cy={c.cy + c.ry * 0.3}
              rx={c.rx * 0.6}
              ry={c.ry * 0.15}
              fill="#506850"
            />
          );
        })}
      </g>

      {/* Mid-level turbulent clouds — fast-moving */}
      <CloudLayer clouds={clouds.turbulent} frame={frame} idPrefix={`${ID}-tb`} />

      {/* Low scud clouds — ragged, very fast */}
      <CloudLayer clouds={clouds.scud} frame={frame} idPrefix={`${ID}-sc`} />

      {/* Lightning system — event-based strikes */}
      <LightningSystem
        frame={frame}
        interval={120}
        flashDuration={6}
        bolts={BOLTS}
        flashColor="rgba(200,210,230,0.35)"
        phaseOffset={0}
      />

      {/* Second lightning — offset timing for double strikes */}
      <LightningSystem
        frame={frame}
        interval={180}
        flashDuration={4}
        bolts={BOLTS.slice(2)}
        flashColor="rgba(180,200,220,0.2)"
        phaseOffset={60}
      />

      {/* Distant lightning — just flashes, no visible bolt */}
      {(() => {
        const distantInterval = 90;
        const distantDuration = 3;
        const distantProgress = (frame + 40) % distantInterval;
        if (distantProgress < distantDuration) {
          const intensity = 1 - distantProgress / distantDuration;
          return (
            <g>
              <rect x={0} y={0} width={1920} height={500} fill="white" opacity={intensity * 0.04} />
              {/* Cloud illumination — specific cloud lights up */}
              <ellipse cx={1400} cy={200} rx={300} ry={150} fill="white" opacity={intensity * 0.06} />
            </g>
          );
        }
        return null;
      })()}

      {/* Heavy atmospheric murk */}
      <defs>
        <linearGradient id={`${ID}-murk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A3030" stopOpacity={0.1} />
          <stop offset="50%" stopColor="#2A3030" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#3A4038" stopOpacity={0.3} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-murk)`} />

      {/* Eerie horizon glow */}
      <HorizonGlow
        color="#4A5848"
        cy={950}
        rx={1000}
        ry={150}
        opacity={0.12}
        id={`${ID}-hz`}
      />

      {/* Atmospheric haze — heavy, grey-green */}
      <AtmosphericHaze color="#3A4038" intensity={0.75} horizonY={0.78} id={ID} />

      {/* Vignette — oppressive darkness */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="60%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.3} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default StormDark;
