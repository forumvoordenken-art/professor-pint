/**
 * snow_field — Besneeuwd landschap, wit en koud.
 *
 * Winterverhalen, Russische geschiedenis, poolexpedities, ijs.
 * White snow-covered ground with blue shadows in dips.
 * Subtle snowdrift patterns, frost sparkle.
 * Cool blue-white palette. Very bright.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  HillSilhouette,
  GroundMist,
  TerrainTexture,
  generateHillPath,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'snow-field';
const HORIZON = 550;

const GROUND_STOPS = [
  { offset: '0%', color: '#E0E8F0' },        // bright snow
  { offset: '20%', color: '#D0D8E8' },       // soft snow
  { offset: '50%', color: '#C0C8D8' },       // mid snow
  { offset: '80%', color: '#B0B8C8' },       // shadow snow
  { offset: '100%', color: '#A0A8B8' },      // deep shadow
];

const HILLS = [
  { path: generateHillPath(530, 25, 5, 1601), fill: '#C8D0E0', opacity: 0.5, drift: 0.1 },
  { path: generateHillPath(545, 20, 6, 1602), fill: '#B8C0D0', opacity: 0.55, drift: 0.15 },
];

// Snowdrift ripples
const rng = seededRandom(2601);
const DRIFTS = Array.from({ length: 10 }, () => ({
  y: 600 + rng() * 380,
  x: rng() * 1920,
  width: 200 + rng() * 400,
  curve: (rng() - 0.5) * 15,
}));

// Frost sparkle points
const SPARKLES = Array.from({ length: 25 }, () => ({
  cx: rng() * 1920,
  cy: 580 + rng() * 450,
  phase: rng() * 100,
  brightness: 0.3 + rng() * 0.7,
}));

export const SnowField: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon — cold blue haze */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 70} height={140} color="#C0D0E0" opacity={0.5} />

      {/* Distant snow hills */}
      <HillSilhouette hills={HILLS} frame={frame} idPrefix={`${ID}-h`} />

      {/* Base ground */}
      <GroundPlane id={ID} horizonY={HORIZON + 10} stops={GROUND_STOPS} />

      {/* Blue shadows in dips and valleys */}
      {[
        { cx: 400, cy: 720, rx: 200, ry: 40 },
        { cx: 1100, cy: 800, rx: 250, ry: 50 },
        { cx: 1600, cy: 750, rx: 180, ry: 35 },
        { cx: 700, cy: 900, rx: 220, ry: 45 },
      ].map((s, i) => (
        <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
          fill="#8090B0" opacity={0.08} />
      ))}

      {/* Snowdrift ripple lines */}
      {DRIFTS.map((d, i) => (
        <path key={i}
          d={`M${d.x},${d.y} Q${d.x + d.width / 2},${d.y + d.curve} ${d.x + d.width},${d.y}`}
          fill="none" stroke="#D8E0F0" strokeWidth={1.2} opacity={0.15} />
      ))}

      {/* Wind-blown snow particles — very subtle */}
      <g opacity={0.06}>
        {Array.from({ length: 20 }, (_, i) => {
          const x = (i * 107 + frame * 0.4) % 2100 - 90;
          const y = HORIZON + 30 + longCycleNoise(frame * 0.5, i * 19) * 30;
          return <circle key={i} cx={x} cy={y} r={1} fill="white" />;
        })}
      </g>

      {/* Frost sparkle — twinkling crystals */}
      {SPARKLES.map((s, i) => {
        const twinkle = longCycleNoise(frame * 1.2, s.phase + i * 7);
        const opacity = Math.max(0, twinkle) * s.brightness * 0.4;
        if (opacity < 0.05) return null;
        return (
          <g key={i}>
            <circle cx={s.cx} cy={s.cy} r={1.2} fill="white" opacity={opacity} />
            {/* Cross sparkle */}
            <line x1={s.cx - 3} y1={s.cy} x2={s.cx + 3} y2={s.cy}
              stroke="white" strokeWidth={0.4} opacity={opacity * 0.6} />
            <line x1={s.cx} y1={s.cy - 3} x2={s.cx} y2={s.cy + 3}
              stroke="white" strokeWidth={0.4} opacity={opacity * 0.6} />
          </g>
        );
      })}

      {/* Exposed rock patches — dark spots where snow melted */}
      {[
        { cx: 600, cy: 850, rx: 25, ry: 10 },
        { cx: 1400, cy: 920, rx: 20, ry: 8 },
      ].map((r, i) => (
        <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry}
          fill="#686058" opacity={0.2} />
      ))}

      {/* Texture */}
      <TerrainTexture id={ID} y={HORIZON} height={530} color="#8090A8" opacity={0.02} seed={3701} />

      {/* Ground mist — icy fog */}
      <GroundMist id={ID} y={940} color="#C0D0E8" opacity={0.15} frame={frame} count={5} seed={4601} />

      {/* Cool blue color grade */}
      <rect x={0} y={HORIZON} width={1920} height={530} fill="#6080B0" opacity={0.04} />

      {/* Bottom darken */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="88%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default SnowField;
