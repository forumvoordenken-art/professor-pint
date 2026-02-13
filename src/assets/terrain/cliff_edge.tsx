/**
 * cliff_edge — Dramatische klif/rand met uitzicht.
 *
 * Beslissingsmomenten, hoogtevrees, filosofie, vergezichten.
 * Standing on a cliff edge looking out over a vast drop.
 * Rocky ledge in foreground, distant valley/sea below.
 * Creates sense of height and perspective.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  HorizonBlend,
  TerrainTexture,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'cliff-edge';
const HORIZON = 520;
const CLIFF_TOP = 680;

// Far below — valley/water

export const CliffEdge: React.FC<AssetProps> = ({ frame }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon — distant atmospheric haze */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 80} height={160} color="#8A9AA8" opacity={0.35} />

      {/* Distant landscape below cliff — very far, atmospheric */}
      <defs>
        <linearGradient id={`${ID}-valley`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A8A70" stopOpacity={0.2} />
          <stop offset="50%" stopColor="#6A7A60" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#5A6A50" stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON} width={1920} height={CLIFF_TOP - HORIZON} fill={`url(#${ID}-valley)`} />

      {/* Distant river/road in valley */}
      <path
        d="M200,580 Q500,600 800,590 Q1100,580 1400,600 Q1600,610 1920,595"
        fill="none" stroke="#5A7A88" strokeWidth={3} opacity={0.15} />

      {/* Distant fields — patchwork */}
      <g opacity={0.08}>
        <rect x={300} y={560} width={200} height={80} fill="#6A8A50" rx={3} />
        <rect x={550} y={570} width={180} height={70} fill="#7A9A60" rx={3} />
        <rect x={800} y={555} width={220} height={85} fill="#5A7A40" rx={3} />
        <rect x={1100} y={565} width={190} height={75} fill="#6A8850" rx={3} />
        <rect x={1350} y={558} width={210} height={82} fill="#7A9858" rx={3} />
      </g>

      {/* Cliff face — vertical rock wall */}
      <defs>
        <linearGradient id={`${ID}-cliff-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#686058" stopOpacity={0.8} />
          <stop offset="40%" stopColor="#585048" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#484038" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect x={0} y={CLIFF_TOP - 30} width={1920} height={50} fill={`url(#${ID}-cliff-face)`} />

      {/* Rock strata on cliff face */}
      <g opacity={0.15}>
        {Array.from({ length: 4 }, (_, i) => (
          <line key={i} x1={0} y1={CLIFF_TOP - 20 + i * 10} x2={1920} y2={CLIFF_TOP - 22 + i * 10}
            stroke="#3A3228" strokeWidth={1} />
        ))}
      </g>

      {/* Cliff edge rock surface — irregular edge */}
      <path
        d={`M0,${CLIFF_TOP} ${Array.from({ length: 40 }, (_, i) => {
          const x = i * 50;
          const y = CLIFF_TOP + seededRandom(9000 + i)() * 8 - 4;
          return `L${x},${y}`;
        }).join(' ')} L1920,${CLIFF_TOP} L1920,1080 L0,1080 Z`}
        fill="#585048"
      />

      {/* Rock surface detail */}
      <defs>
        <linearGradient id={`${ID}-rock`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#686058" />
          <stop offset="30%" stopColor="#585048" />
          <stop offset="60%" stopColor="#4A4238" />
          <stop offset="100%" stopColor="#3A3428" />
        </linearGradient>
      </defs>
      <rect x={0} y={CLIFF_TOP + 5} width={1920} height={400} fill={`url(#${ID}-rock)`} />

      {/* Rock cracks and veins */}
      {Array.from({ length: 10 }, (_, i) => {
        const prng = seededRandom(7000 + i);
        const x = prng() * 1920;
        const y = CLIFF_TOP + 10 + prng() * 300;
        let path = `M${x},${y}`;
        for (let j = 0; j < 3; j++) {
          path += ` l${(prng() - 0.5) * 50},${prng() * 25}`;
        }
        return (
          <path key={i} d={path} fill="none" stroke="#2A2418" strokeWidth={0.8}
            opacity={0.12} strokeLinecap="round" />
        );
      })}

      {/* Boulders on cliff top */}
      {[
        { cx: 200, cy: CLIFF_TOP + 30, rx: 25, ry: 15 },
        { cx: 800, cy: CLIFF_TOP + 20, rx: 35, ry: 20 },
        { cx: 1400, cy: CLIFF_TOP + 25, rx: 28, ry: 18 },
        { cx: 1700, cy: CLIFF_TOP + 35, rx: 22, ry: 14 },
      ].map((b, i) => (
        <g key={i}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill="#605848" opacity={0.7} />
          <ellipse cx={b.cx - 3} cy={b.cy - 3} rx={b.rx * 0.5} ry={b.ry * 0.4}
            fill="white" opacity={0.04} />
        </g>
      ))}

      {/* Wind effect — subtle movement at edge */}
      <g opacity={0.04}>
        {Array.from({ length: 8 }, (_, i) => {
          const x = i * 250 + longCycleNoise(frame * 0.3, i * 17) * 30;
          const y = CLIFF_TOP - 5;
          return (
            <line key={i} x1={x} y1={y} x2={x + 20} y2={y - 3}
              stroke="white" strokeWidth={1} />
          );
        })}
      </g>

      {/* Lichen on rocks */}
      {[
        { cx: 500, cy: CLIFF_TOP + 50 },
        { cx: 1100, cy: CLIFF_TOP + 80 },
        { cx: 1600, cy: CLIFF_TOP + 40 },
      ].map((l, i) => (
        <circle key={i} cx={l.cx} cy={l.cy} r={6} fill="#5A7840" opacity={0.15} />
      ))}

      {/* Texture */}
      <TerrainTexture id={ID} y={CLIFF_TOP} height={400} color="#1A1810" opacity={0.025} seed={4301} />

      {/* Atmospheric depth — valley haze */}
      <defs>
        <linearGradient id={`${ID}-depth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A9AA0" stopOpacity={0} />
          <stop offset={`${((CLIFF_TOP - HORIZON) / 1080) * 100}%`} stopColor="#8A9AA0" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#8A9AA0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON} width={1920} height={CLIFF_TOP - HORIZON} fill={`url(#${ID}-depth)`} />

      {/* Bottom darken */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="85%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default CliffEdge;
