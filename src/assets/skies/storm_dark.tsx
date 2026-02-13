/**
 * storm_dark — Donkergrijs, bliksem, dreigend.
 *
 * Rampen, revoluties, crisis, dramatische wendingen.
 * Massive dark cumulonimbus clouds dominate.
 * Event-based lightning strikes illuminate the scene — frequent and varied.
 * Ominous green-grey tint (storm light).
 * Wind-driven cloud movement.
 * Multiple independent lightning systems for long-video variety.
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
  seededRandom,
} from './SkyEngine';
import type { LightningBolt } from './SkyEngine';

const ID = 'storm-dark';

// Ominous storm palette — grey-green, dark, oppressive
const SKY_STOPS = [
  { offset: '0%', color: '#1A1C1E' },
  { offset: '12%', color: '#222428' },
  { offset: '25%', color: '#2A2C30' },
  { offset: '40%', color: '#343838' },
  { offset: '55%', color: '#3C4240' },
  { offset: '68%', color: '#444A48' },
  { offset: '80%', color: '#4C5450' },
  { offset: '90%', color: '#505850' },
  { offset: '100%', color: '#485048' },
];

// Massive cumulonimbus — towering, menacing
const CB_MAIN = generateClouds(4, 571, {
  yRange: [30, 250], rxRange: [350, 600], ryRange: [100, 200],
  fill: '#282C30', opacityRange: [0.7, 0.9], driftRange: [0.08, 0.15], blobRange: [6, 10],
});

// Mid-level turbulent clouds — moving fast
const TURBULENT = generateClouds(6, 672, {
  yRange: [250, 500], rxRange: [200, 400], ryRange: [40, 80],
  fill: '#343838', opacityRange: [0.5, 0.7], driftRange: [0.12, 0.25], blobRange: [4, 7],
});

// Low scud clouds — ragged, fast-moving
const SCUD = generateClouds(5, 773, {
  yRange: [500, 700], rxRange: [150, 300], ryRange: [20, 40],
  fill: '#3C4040', opacityRange: [0.3, 0.5], driftRange: [0.2, 0.4], blobRange: [2, 4],
});

// Very dark undersides — anvil bases
const ANVIL_BASES = generateClouds(3, 874, {
  yRange: [200, 350], rxRange: [300, 500], ryRange: [25, 45],
  fill: '#1A1C20', opacityRange: [0.5, 0.7], driftRange: [0.08, 0.15], blobRange: [3, 5],
});

// Lightning bolts — 8 different paths for maximum variety
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
  {
    x: 200, width: 2.8, color: '#E4ECFF', glowColor: '#5878C0',
    segments: [
      { dx: 10, dy: 75 }, { dx: -20, dy: 85 }, { dx: 15, dy: 95 },
      { dx: -25, dy: 65 }, { dx: 10, dy: 80 }, { dx: -10, dy: 100 },
      { dx: 20, dy: 70 },
    ],
  },
  {
    x: 1600, width: 3.2, color: '#DCE4FF', glowColor: '#6888C8',
    segments: [
      { dx: -15, dy: 85 }, { dx: 25, dy: 75 }, { dx: -10, dy: 90 },
      { dx: 20, dy: 65 }, { dx: -30, dy: 100 }, { dx: 10, dy: 80 },
    ],
  },
  {
    x: 800, width: 4, color: '#F0F4FF', glowColor: '#80A0E0',
    segments: [
      { dx: -35, dy: 50 }, { dx: 25, dy: 70 }, { dx: -20, dy: 90 },
      { dx: 30, dy: 60 }, { dx: -15, dy: 80 }, { dx: 10, dy: 100 },
      { dx: -25, dy: 70 }, { dx: 15, dy: 60 }, { dx: -10, dy: 80 },
    ],
  },
  {
    x: 1150, width: 2, color: '#C8D0F0', glowColor: '#4060A0',
    segments: [
      { dx: 8, dy: 90 }, { dx: -18, dy: 70 }, { dx: 12, dy: 80 },
      { dx: -8, dy: 100 }, { dx: 15, dy: 60 }, { dx: -22, dy: 90 },
    ],
  },
];

// Fork bolts — branch off from main bolts
const FORK_BOLTS: LightningBolt[] = [
  {
    x: 550, width: 1.5, color: '#C0C8E0', glowColor: '#4060A0',
    segments: [{ dx: -30, dy: 40 }, { dx: -20, dy: 50 }, { dx: -10, dy: 60 }],
  },
  {
    x: 1050, width: 1.2, color: '#B8C0D8', glowColor: '#3858A0',
    segments: [{ dx: 25, dy: 45 }, { dx: 15, dy: 55 }, { dx: 20, dy: 40 }],
  },
  {
    x: 830, width: 1.8, color: '#D0D8E8', glowColor: '#5070B8',
    segments: [{ dx: -15, dy: 35 }, { dx: -25, dy: 50 }, { dx: -10, dy: 45 }],
  },
];

export const StormDark: React.FC<AssetProps> = ({ frame }) => {
  const clouds = useMemo(() => ({
    cb: CB_MAIN, turbulent: TURBULENT, scud: SCUD, anvil: ANVIL_BASES,
  }), []);

  const distantFlashes = useMemo(() => [
    { interval: 73, offset: 0, cx: 300, cy: 180, rx: 250, ry: 120, duration: 3 },
    { interval: 97, offset: 30, cx: 1500, cy: 220, rx: 300, ry: 140, duration: 4 },
    { interval: 61, offset: 15, cx: 800, cy: 160, rx: 200, ry: 100, duration: 2 },
    { interval: 113, offset: 50, cx: 1100, cy: 200, rx: 350, ry: 130, duration: 5 },
    { interval: 47, offset: 8, cx: 500, cy: 250, rx: 180, ry: 90, duration: 2 },
    { interval: 83, offset: 42, cx: 1700, cy: 180, rx: 220, ry: 110, duration: 3 },
  ], []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Storm green tint */}
      <defs>
        <radialGradient id={`${ID}-green`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#304830" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#304830" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-green)`} />

      <CloudLayer clouds={clouds.cb} frame={frame} idPrefix={`${ID}-cb`} />
      <CloudLayer clouds={clouds.anvil} frame={frame} idPrefix={`${ID}-av`} />

      {/* Green-lit cloud edges */}
      <g opacity={0.08}>
        {clouds.cb.map((c, i) => {
          const drift = c.drift ?? 0.1;
          const xOff = ((frame * drift) % 2400 + 2400) % 2400 - 240;
          return (
            <ellipse key={i} cx={c.cx + xOff} cy={c.cy + c.ry * 0.3}
              rx={c.rx * 0.6} ry={c.ry * 0.15} fill="#506850" />
          );
        })}
      </g>

      <CloudLayer clouds={clouds.turbulent} frame={frame} idPrefix={`${ID}-tb`} />
      <CloudLayer clouds={clouds.scud} frame={frame} idPrefix={`${ID}-sc`} />

      {/* Lightning System 1: Main strikes — frequent */}
      <LightningSystem frame={frame} interval={90} flashDuration={6}
        bolts={BOLTS} flashColor="rgba(200,210,230,0.35)" phaseOffset={0} />

      {/* Lightning System 2: Offset strikes */}
      <LightningSystem frame={frame} interval={120} flashDuration={5}
        bolts={BOLTS.slice(3)} flashColor="rgba(190,200,220,0.25)" phaseOffset={45} />

      {/* Lightning System 3: Rapid-fire doubles */}
      <LightningSystem frame={frame} interval={150} flashDuration={3}
        bolts={BOLTS.slice(1, 4)} flashColor="rgba(210,220,240,0.2)" phaseOffset={75} />

      {/* Lightning System 4: Fork bolts */}
      <LightningSystem frame={frame} interval={110} flashDuration={4}
        bolts={FORK_BOLTS} flashColor="rgba(180,190,210,0.15)" phaseOffset={20} />

      {/* Lightning System 5: Slow massive strikes */}
      <LightningSystem frame={frame} interval={200} flashDuration={8}
        bolts={[BOLTS[6]]} flashColor="rgba(220,230,250,0.4)" phaseOffset={100} />

      {/* Distant lightning flashes — cloud illumination only */}
      {distantFlashes.map((df, i) => {
        const progress = (frame + df.offset) % df.interval;
        if (progress >= df.duration) return null;
        const intensity = 1 - progress / df.duration;
        return (
          <g key={i}>
            <rect x={0} y={0} width={1920} height={500} fill="white" opacity={intensity * 0.03} />
            <ellipse cx={df.cx} cy={df.cy} rx={df.rx} ry={df.ry} fill="white" opacity={intensity * 0.08} />
            <ellipse cx={df.cx} cy={df.cy} rx={df.rx * 0.4} ry={df.ry * 0.4} fill="#D0D8FF" opacity={intensity * 0.1} />
          </g>
        );
      })}

      {/* Cloud-to-cloud lightning — horizontal flash */}
      {(() => {
        const ccProgress = (frame + 65) % 130;
        if (ccProgress >= 4) return null;
        const intensity = 1 - ccProgress / 4;
        const rng = seededRandom(Math.floor((frame + 65) / 130) * 7 + 3001);
        const startX = 200 + rng() * 600;
        const y = 200 + rng() * 200;
        let path = `M${startX},${y}`;
        let cx = startX;
        for (let s = 0; s < 12; s++) {
          cx += 60 + rng() * 80;
          const cy = y + (rng() - 0.5) * 60;
          path += ` L${cx},${cy}`;
        }
        return (
          <g>
            <path d={path} fill="none" stroke="#A0B0D0" strokeWidth={6} opacity={intensity * 0.2} strokeLinecap="round" />
            <path d={path} fill="none" stroke="#E0E8FF" strokeWidth={2} opacity={intensity * 0.5} strokeLinecap="round" />
            <path d={path} fill="none" stroke="white" strokeWidth={0.8} opacity={intensity * 0.4} strokeLinecap="round" />
          </g>
        );
      })()}

      {/* Second cloud-to-cloud */}
      {(() => {
        const ccProgress = (frame + 95) % 170;
        if (ccProgress >= 3) return null;
        const intensity = 1 - ccProgress / 3;
        const rng = seededRandom(Math.floor((frame + 95) / 170) * 11 + 3002);
        const startX = 800 + rng() * 600;
        const y = 150 + rng() * 250;
        let path = `M${startX},${y}`;
        let cx = startX;
        for (let s = 0; s < 8; s++) {
          cx += 50 + rng() * 70;
          const cy = y + (rng() - 0.5) * 50;
          path += ` L${cx},${cy}`;
        }
        return (
          <g>
            <path d={path} fill="none" stroke="#8898B0" strokeWidth={4} opacity={intensity * 0.15} strokeLinecap="round" />
            <path d={path} fill="none" stroke="#D0D8F0" strokeWidth={1.5} opacity={intensity * 0.4} strokeLinecap="round" />
          </g>
        );
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

      <HorizonGlow color="#4A5848" cy={950} rx={1000} ry={150} opacity={0.12} id={`${ID}-hz`} />
      <AtmosphericHaze color="#3A4038" intensity={0.75} horizonY={0.78} id={ID} />

      {/* Vignette */}
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
