/**
 * grass_plain — Vlakke groene grasvlakte, zachte heuvels.
 *
 * Universeel terrain voor neutrale buitenscènes.
 * Gentle rolling hills in the distance, lush green foreground.
 * Windblown grass patches animate with longCycleNoise.
 * Warm/cool color variation for oil painting depth.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  HillSilhouette,
  SurfaceScatter,
  GroundMist,
  TerrainTexture,
  generateHillPath,
  generateSurfaceElements,
  renderGrassBlade,
  longCycleNoise,
} from './TerrainEngine';

const ID = 'grass-plain';
const HORIZON = 580;

// Lush green ground gradient — warm in sunlight, cool in shadows
const GROUND_STOPS = [
  { offset: '0%', color: '#5A8A3A' },        // bright sunlit green
  { offset: '20%', color: '#4D7A32' },       // mid green
  { offset: '45%', color: '#3E6A28' },       // rich green
  { offset: '70%', color: '#345820' },       // deeper green
  { offset: '100%', color: '#2A4818' },      // dark foreground green
];

// Distant hills — layered blues/greens
const HILLS_FAR = [
  { path: generateHillPath(560, 30, 6, 1001), fill: '#6A8A70', opacity: 0.6, drift: 0.3 },
  { path: generateHillPath(575, 25, 8, 1002), fill: '#5A7A60', opacity: 0.5, drift: 0.2 },
];

const HILLS_MID = [
  { path: generateHillPath(600, 20, 5, 1003), fill: '#4A7A3A', opacity: 0.7, drift: 0.5 },
  { path: generateHillPath(615, 15, 7, 1004), fill: '#3E6A30', opacity: 0.65, drift: 0.4 },
];

// Grass blades — scattered across foreground
const GRASS_COLORS = ['#4A7A2A', '#5A8A38', '#3A6A1E', '#6A9A42', '#4E7E30', '#3E7020'];
const GRASS_FORE = generateSurfaceElements(80, 2001, { x: 0, y: 700, width: 1920, height: 380 }, GRASS_COLORS);
const GRASS_MID = generateSurfaceElements(50, 2002, { x: 0, y: 620, width: 1920, height: 150 }, GRASS_COLORS);

// Wildflower dots — tiny color accents
const FLOWERS = generateSurfaceElements(20, 2003, { x: 0, y: 680, width: 1920, height: 300 },
  ['#D8A838', '#C87848', '#A85898', '#D86868', '#E8C838']);

export const GrassPlain: React.FC<AssetProps> = ({ frame }) => {
  const hills = useMemo(() => ({ far: HILLS_FAR, mid: HILLS_MID }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon blend — soft transition from sky */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 60} height={120} color="#7A9A68" opacity={0.4} />

      {/* Far hills — atmospheric blue-green */}
      <HillSilhouette hills={hills.far} frame={frame} idPrefix={`${ID}-hf`} />

      {/* Mid hills */}
      <HillSilhouette hills={hills.mid} frame={frame} idPrefix={`${ID}-hm`} />

      {/* Base ground plane */}
      <GroundPlane id={ID} horizonY={HORIZON + 20} stops={GROUND_STOPS} />

      {/* Sunlight patches — warm spots on the grass */}
      <defs>
        <radialGradient id={`${ID}-sun1`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#A8C868" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#A8C868" stopOpacity={0} />
        </radialGradient>
      </defs>
      {[{ cx: 500, cy: 720 }, { cx: 1300, cy: 780 }, { cx: 900, cy: 850 }].map((s, i) => {
        const drift = longCycleNoise(frame * 0.1, i * 17 + 50) * 30;
        return (
          <ellipse key={i} cx={s.cx + drift} cy={s.cy} rx={250} ry={80}
            fill={`url(#${ID}-sun1)`} />
        );
      })}

      {/* Mid grass blades */}
      <g opacity={0.6}>
        <SurfaceScatter elements={GRASS_MID} frame={frame} renderElement={renderGrassBlade} />
      </g>

      {/* Shadow strips — dark bands across terrain for depth */}
      <g opacity={0.06}>
        <rect x={200} y={750} width={400} height={8} rx={4} fill="#1A3010"
          transform={`rotate(-2, 400, 754)`} />
        <rect x={1000} y={820} width={500} height={10} rx={5} fill="#1A3010"
          transform={`rotate(1, 1250, 825)`} />
      </g>

      {/* Foreground grass blades — fuller, animated */}
      <SurfaceScatter elements={GRASS_FORE} frame={frame} renderElement={renderGrassBlade} />

      {/* Wildflower dots */}
      {FLOWERS.map((f, i) => {
        const bob = longCycleNoise(frame * 0.5, f.seed) * 2;
        return (
          <circle key={i} cx={f.cx} cy={f.cy + bob} r={1.5 + f.size}
            fill={f.color} opacity={f.opacity * 0.7} />
        );
      })}

      {/* Painterly texture */}
      <TerrainTexture id={ID} y={HORIZON} height={500} color="#2A4A18" opacity={0.025} seed={3001} />

      {/* Light ground mist — subtle morning atmosphere */}
      <GroundMist id={ID} y={950} color="#A8C8A0" opacity={0.1} frame={frame} count={4} seed={4001} />

      {/* Warm color grade — sunlit afternoon feel */}
      <rect x={0} y={HORIZON} width={1920} height={500} fill="#E8D898" opacity={0.03} />

      {/* Subtle vignette at bottom */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="85%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default GrassPlain;
