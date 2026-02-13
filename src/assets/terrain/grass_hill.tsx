/**
 * grass_hill — Steilere groene heuvels, dramatischer.
 *
 * Avontuur, reizen, verkenning, migratieverhalen.
 * More dramatic elevation changes than grass_plain.
 * Multiple hill layers with distinct depth separation.
 * Winding path visible between hills.
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
} from './TerrainEngine';

const ID = 'grass-hill';
const HORIZON = 480;

const GROUND_STOPS = [
  { offset: '0%', color: '#5A8838' },
  { offset: '25%', color: '#4A7830' },
  { offset: '50%', color: '#3C6826' },
  { offset: '75%', color: '#305820' },
  { offset: '100%', color: '#264818' },
];

// More dramatic hills — higher amplitude, more variation
const HILLS_DISTANT = [
  { path: generateHillPath(450, 60, 4, 1101), fill: '#7898A0', opacity: 0.45, drift: 0.15 },
  { path: generateHillPath(470, 50, 5, 1102), fill: '#6A8880', opacity: 0.5, drift: 0.2 },
];

const HILLS_MID = [
  { path: generateHillPath(520, 55, 4, 1103), fill: '#5A8050', opacity: 0.65, drift: 0.35 },
  { path: generateHillPath(550, 45, 5, 1104), fill: '#4A7040', opacity: 0.7, drift: 0.3 },
];

const HILLS_NEAR = [
  { path: generateHillPath(620, 40, 3, 1105), fill: '#3E6830', opacity: 0.8, drift: 0.5 },
];

const GRASS_COLORS = ['#3E7020', '#4E8030', '#5A8A38', '#3A6A18', '#4A7828'];
const GRASS_ELEMENTS = generateSurfaceElements(90, 2101, { x: 0, y: 680, width: 1920, height: 400 }, GRASS_COLORS);

export const GrassHill: React.FC<AssetProps> = ({ frame }) => {
  const hills = useMemo(() => ({
    distant: HILLS_DISTANT, mid: HILLS_MID, near: HILLS_NEAR,
  }), []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Atmospheric horizon */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 80} height={160} color="#8AA880" opacity={0.35} />

      {/* Distant hills — blue-green atmospheric */}
      <HillSilhouette hills={hills.distant} frame={frame} idPrefix={`${ID}-hd`} />

      {/* Mid hills */}
      <HillSilhouette hills={hills.mid} frame={frame} idPrefix={`${ID}-hm`} />

      {/* Winding path — pale dirt track between hills */}
      <path
        d="M850,620 Q900,680 880,750 Q860,820 900,880 Q940,940 920,1000 L960,1080 L880,1080 Q860,1000 840,940 Q820,880 800,800 Q780,720 810,660 Z"
        fill="#A89878"
        opacity={0.25}
      />
      <path
        d="M855,625 Q895,680 878,745 Q858,815 895,875 Q932,935 915,995 L950,1080 L890,1080 Q865,995 845,935 Q825,875 808,798 Q788,720 815,665 Z"
        fill="#B8A888"
        opacity={0.1}
      />

      {/* Near hill — foreground slope */}
      <HillSilhouette hills={hills.near} frame={frame} idPrefix={`${ID}-hn`} />

      {/* Base ground */}
      <GroundPlane id={ID} horizonY={640} stops={GROUND_STOPS} />

      {/* Hill shadow — depth on near hill */}
      <defs>
        <linearGradient id={`${ID}-hshadow`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A3010" stopOpacity={0.12} />
          <stop offset="40%" stopColor="#1A3010" stopOpacity={0} />
          <stop offset="60%" stopColor="#1A3010" stopOpacity={0} />
          <stop offset="100%" stopColor="#1A3010" stopOpacity={0.08} />
        </linearGradient>
      </defs>
      <rect x={0} y={620} width={1920} height={460} fill={`url(#${ID}-hshadow)`} />

      {/* Grass blades */}
      <SurfaceScatter elements={GRASS_ELEMENTS} frame={frame} renderElement={renderGrassBlade} />

      {/* Scattered bushes — dark green blobs on hillsides */}
      {[
        { cx: 300, cy: 650, r: 15 }, { cx: 1500, cy: 680, r: 18 },
        { cx: 700, cy: 720, r: 12 }, { cx: 1200, cy: 690, r: 14 },
      ].map((b, i) => (
        <g key={i} opacity={0.5}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.r * 1.5} ry={b.r} fill="#2A5018" />
          <ellipse cx={b.cx - 2} cy={b.cy - 2} rx={b.r * 1.2} ry={b.r * 0.8} fill="#366028" />
          <ellipse cx={b.cx + 3} cy={b.cy - 4} rx={b.r * 0.8} ry={b.r * 0.6} fill="#3E7020" />
        </g>
      ))}

      {/* Texture overlay */}
      <TerrainTexture id={ID} y={HORIZON} height={600} color="#1A3810" opacity={0.02} seed={3101} />

      {/* Valley mist */}
      <GroundMist id={ID} y={900} color="#90B090" opacity={0.12} frame={frame} count={5} seed={4101} />

      {/* Bottom darken */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="88%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default GrassHill;
