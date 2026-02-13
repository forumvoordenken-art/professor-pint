/**
 * indoor_ceiling — Donker plafond/gewelf, fakkellicht.
 *
 * Binnenscenes: tempels, paleizen, kerken, grotten, catacomben.
 * Stone vault/ceiling architecture with arched ribs — CLEARLY VISIBLE.
 * Flickering warm torchlight from below strongly illuminates stone.
 * Cobwebs, dust motes, smoke wisps in the air.
 * No sky visible — fully enclosed space.
 * Much higher contrast than typical sky — stone is bright where lit.
 */

import React, { useMemo } from 'react';
import { seededRandom } from './SkyEngine';

const ID = 'indoor';

// Stone colors — brighter range for visibility
const STONE = {
  dark: '#3A3430',
  mid: '#5A5450',
  light: '#7A7470',
  highlight: '#9A9490',
  warm: '#6A5C54',
  grout: '#2A2620',
  moss: '#3A4A38',
  litWarm: '#B0906A',
  litBright: '#D0B090',
};

export const IndoorCeiling: React.FC<{ frame: number }> = ({ frame }) => {
  const rng = seededRandom(7001);

  // Torch flicker — varies light intensity (stronger range)
  const flicker1 = 0.8 + Math.sin(frame * 0.18) * 0.08 + Math.sin(frame * 0.31) * 0.06 + Math.sin(frame * 0.53) * 0.04;
  const flicker2 = 0.8 + Math.sin(frame * 0.22 + 1) * 0.08 + Math.sin(frame * 0.37 + 2) * 0.06 + Math.sin(frame * 0.47 + 3) * 0.04;

  // Dust motes data
  const dustMotes = useMemo(() =>
    Array.from({ length: 40 }, () => ({
      x: rng() * 1920,
      y: rng() * 800 + 100,
      size: 0.8 + rng() * 2.5,
      speedX: -0.1 + rng() * 0.2,
      speedY: -0.05 + rng() * 0.1,
      wobbleSpeed: 0.02 + rng() * 0.03,
      wobbleAmp: 5 + rng() * 15,
      brightness: 0.4 + rng() * 0.6,
      phase: rng() * Math.PI * 2,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  // Smoke wisps data
  const smokeWisps = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      cx: 300 + rng() * 1300,
      cy: 200 + rng() * 400,
      rx: 80 + rng() * 150,
      ry: 20 + rng() * 40,
      speed: 0.02 + rng() * 0.03,
      phase: rng() * Math.PI * 2,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base — dark but warm-toned (not pitch black) */}
      <defs>
        <linearGradient id={`${ID}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1614" />
          <stop offset="40%" stopColor="#2A2620" />
          <stop offset="100%" stopColor="#342C24" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-base)`} />

      {/* ─── STONE VAULT STRUCTURE — HIGH VISIBILITY ─── */}

      {/* Stone block wall fill — subtle base texture */}
      <g opacity={0.2}>
        {Array.from({ length: 20 }, (_, row) =>
          Array.from({ length: 14 }, (_, col) => {
            const x = col * 145 + (row % 2) * 72;
            const y = row * 42 + 10;
            const w = 135 + (col % 3) * 5;
            const h = 36 + (row % 2) * 4;
            const shade = (row + col) % 4;
            const fill = shade === 0 ? STONE.dark : shade === 1 ? STONE.mid : shade === 2 ? STONE.warm : STONE.dark;
            return (
              <rect key={`${row}-${col}`} x={x} y={y} width={w} height={h}
                fill={fill} rx={1} opacity={0.4 + (shade % 2) * 0.2} />
            );
          })
        )}
      </g>

      {/* Stone block outlines — mortar lines */}
      <g opacity={0.25}>
        {Array.from({ length: 18 }, (_, row) =>
          Array.from({ length: 14 }, (_, col) => {
            const x = col * 145 + (row % 2) * 72;
            const y = row * 42 + 10;
            const w = 135 + (col % 3) * 5;
            const h = 36 + (row % 2) * 4;
            return (
              <rect key={`${row}-${col}`} x={x} y={y} width={w} height={h}
                fill="none" stroke={STONE.grout} strokeWidth={1.5} rx={1} />
            );
          })
        )}
      </g>

      {/* Main vault arch — central rib (THICK, BRIGHT) */}
      <path d="M0,400 Q960,-80 1920,400" fill="none" stroke={STONE.light} strokeWidth={35} opacity={0.5} />
      <path d="M0,400 Q960,-80 1920,400" fill="none" stroke={STONE.highlight} strokeWidth={6} opacity={0.3} />
      <path d="M0,410 Q960,-65 1920,410" fill="none" stroke="#1A1614" strokeWidth={12} opacity={0.3} />

      {/* Secondary ribs — crossing arches */}
      <path d="M200,600 Q700,-20 1200,600" fill="none" stroke={STONE.mid} strokeWidth={28} opacity={0.4} />
      <path d="M200,600 Q700,-20 1200,600" fill="none" stroke={STONE.highlight} strokeWidth={4} opacity={0.15} />
      <path d="M720,600 Q1220,-20 1720,600" fill="none" stroke={STONE.mid} strokeWidth={28} opacity={0.4} />
      <path d="M720,600 Q1220,-20 1720,600" fill="none" stroke={STONE.highlight} strokeWidth={4} opacity={0.15} />

      {/* Transverse ribs */}
      <path d="M0,180 Q480,120 960,160 Q1440,120 1920,180" fill="none" stroke={STONE.mid} strokeWidth={22} opacity={0.4} />
      <path d="M0,350 Q480,300 960,330 Q1440,300 1920,350" fill="none" stroke={STONE.mid} strokeWidth={18} opacity={0.35} />

      {/* Keystone at vault apex */}
      <g opacity={0.35}>
        <rect x={935} y={40} width={50} height={40} fill={STONE.light} rx={3} />
        <rect x={935} y={40} width={50} height={40} fill="none" stroke={STONE.grout} strokeWidth={2} rx={3} />
      </g>

      {/* Stone texture variation */}
      <g opacity={0.15}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 49) % 1920;
          const y = (i * 31) % 600;
          const w = 60 + (i % 5) * 25;
          const h = 20 + (i % 3) * 10;
          return (
            <rect key={i} x={x} y={y} width={w} height={h}
              fill={i % 4 === 0 ? STONE.warm : i % 4 === 1 ? STONE.light : i % 4 === 2 ? STONE.mid : STONE.dark}
              rx={1} />
          );
        })}
      </g>

      {/* Moss/damp patches */}
      <g opacity={0.1}>
        <ellipse cx={300} cy={200} rx={80} ry={40} fill={STONE.moss} />
        <ellipse cx={1200} cy={150} rx={60} ry={30} fill={STONE.moss} />
        <ellipse cx={800} cy={300} rx={100} ry={35} fill={STONE.moss} />
        <ellipse cx={1600} cy={250} rx={70} ry={28} fill={STONE.moss} />
        <ellipse cx={500} cy={100} rx={50} ry={25} fill={STONE.moss} />
      </g>

      {/* Water stains */}
      <g opacity={0.12}>
        <rect x={440} y={100} width={4} height={200} fill="#2A3028" rx={2} />
        <rect x={1100} y={80} width={3} height={250} fill="#2A3028" rx={1.5} />
        <rect x={1550} y={120} width={5} height={180} fill="#283028" rx={2.5} />
        <rect x={780} y={60} width={3} height={220} fill="#2A3028" rx={1.5} />
      </g>

      {/* ─── TORCHLIGHT — STRONG, CLEARLY ILLUMINATING ─── */}

      <defs>
        <radialGradient id={`${ID}-torch-l`} cx="0.5" cy="1" r="0.8">
          <stop offset="0%" stopColor="#F0A040" stopOpacity={0.6 * flicker1} />
          <stop offset="20%" stopColor="#E89838" stopOpacity={0.4 * flicker1} />
          <stop offset="40%" stopColor="#D08028" stopOpacity={0.2 * flicker1} />
          <stop offset="65%" stopColor="#C06820" stopOpacity={0.08 * flicker1} />
          <stop offset="100%" stopColor="#C06820" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${ID}-torch-r`} cx="0.5" cy="1" r="0.8">
          <stop offset="0%" stopColor="#F0A040" stopOpacity={0.55 * flicker2} />
          <stop offset="20%" stopColor="#E89838" stopOpacity={0.35 * flicker2} />
          <stop offset="40%" stopColor="#D08028" stopOpacity={0.18 * flicker2} />
          <stop offset="65%" stopColor="#C06820" stopOpacity={0.06 * flicker2} />
          <stop offset="100%" stopColor="#C06820" stopOpacity={0} />
        </radialGradient>
      </defs>

      <ellipse cx={350} cy={850} rx={600} ry={700} fill={`url(#${ID}-torch-l)`} />
      <ellipse cx={1570} cy={850} rx={600} ry={700} fill={`url(#${ID}-torch-r)`} />

      {/* Central combined light */}
      <defs>
        <radialGradient id={`${ID}-combined`} cx="0.5" cy="0.65" r="0.55">
          <stop offset="0%" stopColor="#E89030" stopOpacity={0.18 * (flicker1 + flicker2) / 2} />
          <stop offset="50%" stopColor="#D08028" stopOpacity={0.06 * (flicker1 + flicker2) / 2} />
          <stop offset="100%" stopColor="#D08028" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-combined)`} />

      {/* Torch flame shapes */}
      <g>
        <ellipse cx={350} cy={820} rx={8} ry={16} fill="#F0B040" opacity={0.5 * flicker1} />
        <ellipse cx={350} cy={812} rx={4} ry={10} fill="#F0D080" opacity={0.6 * flicker1} />
        <ellipse cx={350} cy={808} rx={2} ry={6} fill="#FFF0C0" opacity={0.4 * flicker1} />
        <ellipse cx={1570} cy={820} rx={8} ry={16} fill="#F0B040" opacity={0.5 * flicker2} />
        <ellipse cx={1570} cy={812} rx={4} ry={10} fill="#F0D080" opacity={0.6 * flicker2} />
        <ellipse cx={1570} cy={808} rx={2} ry={6} fill="#FFF0C0" opacity={0.4 * flicker2} />
      </g>

      {/* Light hitting vault ribs — warm highlights (MUCH BRIGHTER) */}
      <g opacity={0.2 * flicker1}>
        <path d="M300,380 Q600,220 960,300" fill="none" stroke={STONE.litBright} strokeWidth={10} />
        <path d="M200,590 Q500,400 700,590" fill="none" stroke={STONE.litWarm} strokeWidth={8} />
      </g>
      <g opacity={0.18 * flicker2}>
        <path d="M960,300 Q1320,220 1620,380" fill="none" stroke={STONE.litBright} strokeWidth={10} />
        <path d="M1220,590 Q1420,400 1720,590" fill="none" stroke={STONE.litWarm} strokeWidth={8} />
      </g>

      {/* Warm light on stone blocks near torches */}
      <g opacity={0.12 * flicker1}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={150 + i * 50} y={500 + (i % 3) * 60} width={60} height={30}
            fill={STONE.litWarm} rx={2} />
        ))}
      </g>
      <g opacity={0.12 * flicker2}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={1370 + i * 50} y={500 + (i % 3) * 60} width={60} height={30}
            fill={STONE.litWarm} rx={2} />
        ))}
      </g>

      {/* ─── ATMOSPHERIC EFFECTS ─── */}

      {/* Smoke wisps */}
      <g opacity={0.12}>
        {smokeWisps.map((w, i) => {
          const yOff = Math.sin(frame * w.speed + w.phase) * 30;
          const xOff = Math.cos(frame * w.speed * 0.7 + w.phase) * 20;
          return (
            <ellipse key={i} cx={w.cx + xOff} cy={w.cy + yOff - (frame * 0.1) % 300}
              rx={w.rx} ry={w.ry} fill="#A09080" />
          );
        })}
      </g>

      {/* Rising smoke columns from torches */}
      <g opacity={0.08}>
        <ellipse cx={350} cy={700 - (frame * 0.15) % 200} rx={40} ry={20} fill="#908070" />
        <ellipse cx={350} cy={600 - (frame * 0.12) % 200} rx={50} ry={25} fill="#807060" />
        <ellipse cx={1570} cy={700 - (frame * 0.14) % 200} rx={40} ry={20} fill="#908070" />
        <ellipse cx={1570} cy={600 - (frame * 0.11) % 200} rx={50} ry={25} fill="#807060" />
      </g>

      {/* Dust motes — floating in torchlight */}
      <g>
        {dustMotes.map((d, i) => {
          const wobbleX = Math.sin(frame * d.wobbleSpeed + d.phase) * d.wobbleAmp;
          const wobbleY = Math.cos(frame * d.wobbleSpeed * 0.7 + d.phase) * d.wobbleAmp * 0.5;
          const x = d.x + wobbleX + frame * d.speedX;
          const y = d.y + wobbleY + frame * d.speedY;
          const distToTorch1 = Math.sqrt((x - 350) ** 2 + (y - 800) ** 2);
          const distToTorch2 = Math.sqrt((x - 1570) ** 2 + (y - 800) ** 2);
          const torchLight = Math.max(0, 1 - Math.min(distToTorch1, distToTorch2) / 600);
          const opacity = d.brightness * (0.06 + torchLight * 0.25);
          return (
            <circle key={i}
              cx={((x % 2000) + 2000) % 2000 - 40}
              cy={((y % 1100) + 1100) % 1100}
              r={d.size} fill="#F0D0A0" opacity={opacity} />
          );
        })}
      </g>

      {/* Cobwebs */}
      <g opacity={0.1}>
        <path d="M0,0 Q80,30 60,120" fill="none" stroke="#B0B0A0" strokeWidth={1} />
        <path d="M0,0 Q50,50 30,130" fill="none" stroke="#B0B0A0" strokeWidth={0.8} />
        <path d="M0,0 Q30,40 10,100" fill="none" stroke="#B0B0A0" strokeWidth={0.6} />
        <path d="M20,40 Q40,50 50,80" fill="none" stroke="#A0A090" strokeWidth={0.5} />
        <path d="M40,20 Q55,60 60,90" fill="none" stroke="#A0A090" strokeWidth={0.4} />
        <path d="M0,0 Q80,30 60,120 Q30,80 0,0" fill="#908880" opacity={0.08} />
        <path d="M1920,0 Q1840,30 1860,120" fill="none" stroke="#B0B0A0" strokeWidth={1} />
        <path d="M1920,0 Q1870,50 1890,130" fill="none" stroke="#B0B0A0" strokeWidth={0.8} />
        <path d="M1900,40 Q1880,50 1870,80" fill="none" stroke="#A0A090" strokeWidth={0.5} />
        <path d="M1920,0 Q1840,30 1860,120 Q1890,80 1920,0" fill="#908880" opacity={0.08} />
      </g>

      {/* Iron torch brackets */}
      <g opacity={0.35}>
        <rect x={340} y={830} width={20} height={6} fill="#3A3430" rx={1} />
        <rect x={330} y={830} width={6} height={50} fill="#3A3430" rx={1} />
        <rect x={1560} y={830} width={20} height={6} fill="#3A3430" rx={1} />
        <rect x={1580} y={830} width={6} height={50} fill="#3A3430" rx={1} />
      </g>

      {/* ─── DEPTH AND ATMOSPHERE ─── */}

      {/* Upper darkness — not to black */}
      <defs>
        <linearGradient id={`${ID}-top-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0808" stopOpacity={0.4} />
          <stop offset="25%" stopColor="#0A0808" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#0A0808" stopOpacity={0} />
          <stop offset="100%" stopColor="#0A0808" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-top-dark)`} />

      {/* Warm ambient fill — prevents pure black */}
      <rect x={0} y={0} width={1920} height={1080} fill="#3A2C20" opacity={0.08} />

      {/* Vignette — softer */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.6" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="55%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default IndoorCeiling;
