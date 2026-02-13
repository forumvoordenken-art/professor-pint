/**
 * cliff_edge — Dramatische klif/rand met uitzicht.
 *
 * Beslissingsmomenten, hoogtevrees, filosofie, vergezichten.
 * Standing on a cliff edge looking out over a vast drop.
 * Rocky ledge in foreground, distant valley/sea below.
 * Wind-bent tree, bird nest, rope anchor, waterfall hint,
 * fog layer, lichen, footprints, circling birds, vertigo lines.
 *
 * Oil painting style — dramatic, layered, atmospheric.
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

// ─── Rock cracks on cliff top ────────────────────────────────
const crackRng = seededRandom(7000);
const CRACKS = Array.from({ length: 15 }, () => {
  const x = crackRng() * 1920;
  const y = CLIFF_TOP + 10 + crackRng() * 320;
  const segments: Array<{ dx: number; dy: number }> = [];
  for (let j = 0; j < 4; j++) {
    segments.push({
      dx: (crackRng() - 0.5) * 60,
      dy: crackRng() * 30,
    });
  }
  return { x, y, segments, width: 0.5 + crackRng() * 1.2 };
});

// ─── Loose pebbles near cliff edge ──────────────────────────
const pebbleRng = seededRandom(7100);
const PEBBLES = Array.from({ length: 18 }, () => ({
  cx: pebbleRng() * 1920,
  cy: CLIFF_TOP + 5 + pebbleRng() * 40,
  rx: 2 + pebbleRng() * 5,
  ry: 1.5 + pebbleRng() * 3,
  angle: pebbleRng() * 180,
  color: pebbleRng() > 0.5 ? '#706858' : '#5A5248',
}));

// ─── Distant fields patchwork ────────────────────────────────
const fieldRng = seededRandom(7200);
const FIELDS = Array.from({ length: 12 }, () => ({
  x: fieldRng() * 1700 + 100,
  y: HORIZON + 20 + fieldRng() * (CLIFF_TOP - HORIZON - 80),
  w: 80 + fieldRng() * 180,
  h: 30 + fieldRng() * 60,
  color: ['#6A8A50', '#7A9A60', '#5A7A40', '#6A8850', '#7A9858', '#8AA068'][
    Math.floor(fieldRng() * 6)
  ],
}));

// ─── Lichen patches on rocks ─────────────────────────────────
const lichenRng = seededRandom(7300);
const LICHEN = Array.from({ length: 10 }, () => ({
  cx: lichenRng() * 1920,
  cy: CLIFF_TOP + 15 + lichenRng() * 200,
  r: 4 + lichenRng() * 10,
  color: lichenRng() > 0.5 ? '#6A8840' : '#8AA050',
}));

// ─── Footprints leading to edge ──────────────────────────────
const fpRng = seededRandom(7400);
const FOOTPRINTS = Array.from({ length: 5 }, (_, i) => ({
  cx: 900 + i * 50 + (fpRng() - 0.5) * 20,
  cy: CLIFF_TOP + 180 - i * 30 + (fpRng() - 0.5) * 10,
  angle: -15 + fpRng() * 10,
  size: 0.6 + fpRng() * 0.3,
}));

export const CliffEdge: React.FC<AssetProps> = ({ frame }) => {
  // Wind particles blowing off edge
  const windPhase = frame * 0.1;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Horizon — distant atmospheric haze */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 100} height={200} color="#8A9AA8" opacity={0.4} />

      {/* Distant sea/lake at base of cliff */}
      <defs>
        <linearGradient id={`${ID}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A7A90" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#4A6A80" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#3A5A70" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON - 30} width={1920} height={80} fill={`url(#${ID}-sea)`} />
      {/* Sea shimmer */}
      {Array.from({ length: 6 }, (_, i) => {
        const shimmer = longCycleNoise(frame * 0.3, i * 37 + 500) * 0.03;
        return (
          <line key={`sea-${i}`} x1={100 + i * 300} y1={HORIZON - 15 + i * 3}
            x2={200 + i * 300} y2={HORIZON - 15 + i * 3}
            stroke="white" strokeWidth={1} opacity={0.04 + shimmer} />
        );
      })}

      {/* Distant landscape below cliff — valley with fields */}
      <defs>
        <linearGradient id={`${ID}-valley`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A8A70" stopOpacity={0.15} />
          <stop offset="40%" stopColor="#6A7A60" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#5A6A50" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON + 40} width={1920} height={CLIFF_TOP - HORIZON - 60}
        fill={`url(#${ID}-valley)`} />

      {/* Patchwork fields — tiny distant rectangles */}
      <g opacity={0.09}>
        {FIELDS.map((f, i) => (
          <rect key={`field-${i}`} x={f.x} y={f.y} width={f.w} height={f.h}
            fill={f.color} rx={2} />
        ))}
      </g>

      {/* Distant river winding through valley */}
      <path
        d="M100,570 Q300,585 550,575 Q800,565 1000,580 Q1250,595 1500,578 Q1700,565 1920,585"
        fill="none" stroke="#5A7A90" strokeWidth={3.5} opacity={0.12} />
      {/* River tributary */}
      <path
        d="M700,560 Q750,570 800,575"
        fill="none" stroke="#5A7A90" strokeWidth={1.5} opacity={0.08} />

      {/* Distant roads */}
      <path
        d="M400,595 Q600,590 850,600 Q1100,610 1400,598"
        fill="none" stroke="#8A8070" strokeWidth={1} opacity={0.06} />

      {/* Tiny buildings/houses in valley — dots */}
      {[
        { cx: 500, cy: 585 }, { cx: 520, cy: 588 },
        { cx: 900, cy: 578 }, { cx: 1200, cy: 590 },
        { cx: 1210, cy: 595 }, { cx: 1400, cy: 585 },
      ].map((h, i) => (
        <rect key={`house-${i}`} x={h.cx} y={h.cy} width={4} height={3}
          fill="#6A6050" opacity={0.08} />
      ))}

      {/* Waterfall hint — thin white streak on distant cliff face */}
      <g opacity={0.08 + longCycleNoise(frame * 0.2, 600) * 0.02}>
        <line x1={1650} y1={HORIZON + 50} x2={1648} y2={HORIZON + 120}
          stroke="white" strokeWidth={2} strokeLinecap="round" />
        <line x1={1649} y1={HORIZON + 115} x2={1647} y2={HORIZON + 130}
          stroke="white" strokeWidth={3} opacity={0.5} strokeLinecap="round" />
      </g>

      {/* Fog/cloud layer below halfway down cliff face */}
      <defs>
        <linearGradient id={`${ID}-fog-layer`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0C8D0" stopOpacity={0} />
          <stop offset="30%" stopColor="#C0C8D0" stopOpacity={0.15} />
          <stop offset="70%" stopColor="#C0C8D0" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#C0C8D0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON + 60} width={1920} height={60} fill={`url(#${ID}-fog-layer)`} />
      {/* Fog wisps */}
      {Array.from({ length: 5 }, (_, i) => {
        const drift = longCycleNoise(frame * 0.15, i * 41 + 700) * 40;
        return (
          <ellipse key={`fog-${i}`}
            cx={200 + i * 380 + drift} cy={HORIZON + 85}
            rx={180 + longCycleNoise(frame * 0.1, i * 53) * 30} ry={15}
            fill="#C0C8D0" opacity={0.06} />
        );
      })}

      {/* Shadow of cliff stretching out below */}
      <defs>
        <linearGradient id={`${ID}-cliff-shadow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A2820" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#2A2820" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={CLIFF_TOP - 60} width={1920} height={60} fill={`url(#${ID}-cliff-shadow)`} />

      {/* Cliff face — vertical rock wall with strata layers */}
      <defs>
        <linearGradient id={`${ID}-cliff-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#686058" stopOpacity={0.85} />
          <stop offset="25%" stopColor="#5A5248" stopOpacity={0.75} />
          <stop offset="50%" stopColor="#504840" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#484038" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect x={0} y={CLIFF_TOP - 50} width={1920} height={70} fill={`url(#${ID}-cliff-face)`} />

      {/* Rock strata lines on cliff face — horizontal layers */}
      <g opacity={0.18}>
        {Array.from({ length: 8 }, (_, i) => {
          const y = CLIFF_TOP - 45 + i * 8;
          const wobble = longCycleNoise(i * 0.5, 800 + i) * 2;
          return (
            <line key={`strata-${i}`} x1={0} y1={y + wobble} x2={1920} y2={y - wobble}
              stroke={i % 2 === 0 ? '#3A3228' : '#4A4238'} strokeWidth={1} />
          );
        })}
      </g>

      {/* Vertigo depth lines — thin parallel lines on cliff face going down */}
      <g opacity={0.06}>
        {Array.from({ length: 12 }, (_, i) => {
          const x = 100 + i * 160;
          return (
            <line key={`vert-${i}`} x1={x} y1={CLIFF_TOP - 45}
              x2={x + (seededRandom(9500 + i)() - 0.5) * 10} y2={CLIFF_TOP + 15}
              stroke="#3A3020" strokeWidth={0.6} />
          );
        })}
      </g>

      {/* Cliff edge — sharp dramatic irregular drop-off line */}
      <path
        d={`M0,${CLIFF_TOP} ${Array.from({ length: 50 }, (_, i) => {
          const x = i * 40;
          const prng = seededRandom(9000 + i);
          const y = CLIFF_TOP + prng() * 10 - 5;
          return `L${x},${y}`;
        }).join(' ')} L1920,${CLIFF_TOP} L1920,1080 L0,1080 Z`}
        fill="#585048"
      />

      {/* Rock surface gradient on cliff top */}
      <defs>
        <linearGradient id={`${ID}-rock`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#686058" />
          <stop offset="20%" stopColor="#5A5248" />
          <stop offset="50%" stopColor="#4A4238" />
          <stop offset="100%" stopColor="#3A3428" />
        </linearGradient>
      </defs>
      <rect x={0} y={CLIFF_TOP + 5} width={1920} height={400} fill={`url(#${ID}-rock)`} />

      {/* Rock cracks radiating from edge */}
      {CRACKS.map((c, i) => {
        let path = `M${c.x},${c.y}`;
        for (const seg of c.segments) {
          path += ` l${seg.dx},${seg.dy}`;
        }
        return (
          <path key={`crack-${i}`} d={path} fill="none"
            stroke="#2A2418" strokeWidth={c.width}
            opacity={0.14} strokeLinecap="round" />
        );
      })}

      {/* Loose pebbles near edge */}
      {PEBBLES.map((p, i) => (
        <g key={`peb-${i}`}>
          <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
            fill={p.color} opacity={0.5}
            transform={`rotate(${p.angle}, ${p.cx}, ${p.cy})`} />
          <ellipse cx={p.cx - 1} cy={p.cy - 1} rx={p.rx * 0.4} ry={p.ry * 0.3}
            fill="white" opacity={0.06}
            transform={`rotate(${p.angle}, ${p.cx}, ${p.cy})`} />
        </g>
      ))}

      {/* Boulders on cliff top — large irregular rocks */}
      {[
        { cx: 180, cy: CLIFF_TOP + 35, rx: 30, ry: 18, color: '#605848' },
        { cx: 750, cy: CLIFF_TOP + 25, rx: 40, ry: 22, color: '#5A5040' },
        { cx: 1350, cy: CLIFF_TOP + 30, rx: 32, ry: 20, color: '#585048' },
        { cx: 1700, cy: CLIFF_TOP + 40, rx: 25, ry: 16, color: '#625A48' },
        { cx: 500, cy: CLIFF_TOP + 50, rx: 22, ry: 14, color: '#5C5440' },
      ].map((b, i) => (
        <g key={`boulder-${i}`}>
          {/* Shadow */}
          <ellipse cx={b.cx + 5} cy={b.cy + 6} rx={b.rx * 1.1} ry={b.ry * 0.7}
            fill="#2A2418" opacity={0.1} />
          {/* Body */}
          <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color} opacity={0.75} />
          {/* Highlight */}
          <ellipse cx={b.cx - b.rx * 0.2} cy={b.cy - b.ry * 0.25} rx={b.rx * 0.4} ry={b.ry * 0.3}
            fill="white" opacity={0.05} />
        </g>
      ))}

      {/* Wind-bent scraggly tree clinging to cliff edge */}
      <g transform={`translate(350, ${CLIFF_TOP - 5})`}>
        {/* Trunk — gnarled, wind-bent */}
        <path d="M0,0 Q-5,-30 -15,-60 Q-25,-85 -40,-110 Q-50,-130 -45,-150"
          fill="none" stroke="#3A2A18" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
        {/* Main branch — blown sideways */}
        <path d="M-40,-110 Q-60,-120 -90,-115 Q-110,-112 -130,-118"
          fill="none" stroke="#3A2A18" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        {/* Secondary branches */}
        <path d="M-25,-85 Q-45,-90 -65,-82"
          fill="none" stroke="#3A2A18" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
        <path d="M-45,-150 Q-55,-160 -70,-155"
          fill="none" stroke="#3A2A18" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
        <path d="M-15,-60 Q-30,-55 -45,-60"
          fill="none" stroke="#3A2A18" strokeWidth={1.5} strokeLinecap="round" opacity={0.35} />
        {/* Sparse wind-swept foliage */}
        {[
          { cx: -90, cy: -118, r: 18 }, { cx: -115, cy: -115, r: 14 },
          { cx: -65, cy: -85, r: 12 }, { cx: -70, cy: -158, r: 10 },
          { cx: -130, cy: -120, r: 10 },
        ].map((leaf, i) => {
          const sway = longCycleNoise(frame * 0.4, i * 19 + 900) * 4;
          return (
            <ellipse key={`leaf-${i}`} cx={leaf.cx + sway} cy={leaf.cy}
              rx={leaf.r} ry={leaf.r * 0.6}
              fill="#4A6A30" opacity={0.25} />
          );
        })}
        {/* Exposed roots gripping rock */}
        <path d="M0,0 Q5,8 15,12 Q20,14 25,10"
          fill="none" stroke="#3A2A18" strokeWidth={2} opacity={0.3} />
        <path d="M0,0 Q-8,10 -5,18"
          fill="none" stroke="#3A2A18" strokeWidth={1.5} opacity={0.25} />
      </g>

      {/* Bird nest in rock crevice near edge */}
      <g transform={`translate(600, ${CLIFF_TOP + 12})`} opacity={0.3}>
        <ellipse cx={0} cy={0} rx={12} ry={6} fill="#5A4828" />
        <ellipse cx={0} cy={-2} rx={10} ry={4} fill="#6A5838" />
        {/* Twigs */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = i * 60;
          const len = 10 + seededRandom(7500 + i)() * 5;
          const rad = angle * Math.PI / 180;
          return (
            <line key={`twig-${i}`} x1={0} y1={0}
              x2={Math.cos(rad) * len} y2={Math.sin(rad) * len * 0.4}
              stroke="#4A3818" strokeWidth={0.8} />
          );
        })}
        {/* Tiny eggs */}
        <ellipse cx={-3} cy={-1} rx={2.5} ry={2} fill="#C8D8D0" opacity={0.5} />
        <ellipse cx={3} cy={-1} rx={2.5} ry={2} fill="#C0D0C8" opacity={0.5} />
      </g>

      {/* Rope/chain anchor bolted into rock at edge */}
      <g transform={`translate(1100, ${CLIFF_TOP + 8})`} opacity={0.35}>
        {/* Iron bolt plate */}
        <rect x={-8} y={-4} width={16} height={8} fill="#5A5848" rx={2} />
        {/* Bolt heads */}
        <circle cx={-4} cy={0} r={2} fill="#6A6858" />
        <circle cx={4} cy={0} r={2} fill="#6A6858" />
        {/* Rope going over edge */}
        <path d="M0,4 Q2,15 -5,25 Q-8,35 -3,50"
          fill="none" stroke="#8A7A58" strokeWidth={3} strokeLinecap="round" />
        {/* Rope fraying */}
        <line x1={-3} y1={48} x2={-6} y2={55} stroke="#8A7A58" strokeWidth={1} />
        <line x1={-3} y1={48} x2={-1} y2={56} stroke="#8A7A58" strokeWidth={1} />
      </g>

      {/* Lichen on cliff-top rocks — yellow-green patches */}
      {LICHEN.map((l, i) => (
        <g key={`lichen-${i}`}>
          <circle cx={l.cx} cy={l.cy} r={l.r} fill={l.color} opacity={0.12} />
          <circle cx={l.cx + 2} cy={l.cy - 1} r={l.r * 0.6} fill={l.color} opacity={0.08} />
        </g>
      ))}

      {/* Bird silhouettes circling below — V-shapes at different heights */}
      {[
        { cx: 400, cy: HORIZON + 60, size: 8, seed: 300 },
        { cx: 800, cy: HORIZON + 40, size: 6, seed: 310 },
        { cx: 1200, cy: HORIZON + 80, size: 7, seed: 320 },
        { cx: 1500, cy: HORIZON + 30, size: 5, seed: 330 },
      ].map((bird, i) => {
        const bx = bird.cx + longCycleNoise(frame * 0.2, bird.seed) * 60;
        const by = bird.cy + longCycleNoise(frame * 0.15, bird.seed + 10) * 20;
        const wingFlap = longCycleNoise(frame * 0.8, bird.seed + 20) * 3;
        return (
          <path key={`bird-${i}`}
            d={`M${bx - bird.size},${by + wingFlap} Q${bx},${by - wingFlap} ${bx + bird.size},${by + wingFlap}`}
            fill="none" stroke="#2A2820" strokeWidth={1.2} opacity={0.15} />
        );
      })}

      {/* Wind particles blowing off edge */}
      {Array.from({ length: 10 }, (_, i) => {
        const baseX = 200 + i * 180;
        const progress = ((windPhase + i * 0.3) % 1);
        const px = baseX + progress * 80;
        const py = CLIFF_TOP - 8 - progress * 15 + longCycleNoise(frame * 0.5, i * 23 + 400) * 5;
        const opacity = 0.04 * (1 - progress);
        return (
          <circle key={`wind-${i}`} cx={px} cy={py} r={1} fill="white" opacity={opacity} />
        );
      })}

      {/* Brave/foolish footprints leading to edge */}
      {FOOTPRINTS.map((fp, i) => (
        <g key={`fp-${i}`} transform={`rotate(${fp.angle}, ${fp.cx}, ${fp.cy})`} opacity={0.07}>
          <ellipse cx={fp.cx} cy={fp.cy} rx={8 * fp.size} ry={14 * fp.size} fill="#3A3020" />
          <ellipse cx={fp.cx} cy={fp.cy - 17 * fp.size} rx={5 * fp.size} ry={4 * fp.size} fill="#3A3020" />
        </g>
      ))}

      {/* Texture overlay — painterly dots */}
      <TerrainTexture id={`${ID}-tex1`} y={CLIFF_TOP} height={400}
        color="#1A1810" opacity={0.03} dotCount={60} seed={4301} />
      <TerrainTexture id={`${ID}-tex2`} y={HORIZON} height={CLIFF_TOP - HORIZON}
        color="#8A9AA8" opacity={0.015} dotCount={30} seed={4302} />

      {/* Atmospheric depth haze between horizon and cliff */}
      <defs>
        <linearGradient id={`${ID}-depth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A9AA0" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#8A9AA0" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#8A9AA0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON} width={1920} height={CLIFF_TOP - HORIZON}
        fill={`url(#${ID}-depth)`} />

      {/* Warm rock surface color grade */}
      <rect x={0} y={CLIFF_TOP} width={1920} height={400} fill="#C8A060" opacity={0.02} />

      {/* Bottom darken — distance/depth */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="80%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />

      {/* Subtle edge vignette — atmospheric framing */}
      <defs>
        <radialGradient id={`${ID}-vig2`} cx="0.5" cy="0.55" r="0.65">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="70%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.12} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig2)`} />
    </svg>
  );
};

export default CliffEdge;
