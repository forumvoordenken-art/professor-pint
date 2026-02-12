/**
 * indoor_ceiling — Donker plafond/gewelf, fakkellicht.
 *
 * Binnenscenes: tempels, paleizen, kerken, grotten, catacomben.
 * Stone vault/ceiling architecture with arched ribs.
 * Flickering warm torchlight from below illuminates stone.
 * Cobwebs, dust motes, smoke wisps in the air.
 * No sky visible — fully enclosed space.
 */

import React, { useMemo } from 'react';
import { seededRandom } from './SkyEngine';

const ID = 'indoor';

// Stone colors
const STONE = {
  dark: '#2A2420',
  mid: '#3A3430',
  light: '#4A4440',
  highlight: '#5A5450',
  warm: '#4A3C34',
  grout: '#1A1614',
  moss: '#2A3A28',
};

export const IndoorCeiling: React.FC<{ frame: number }> = ({ frame }) => {
  const rng = seededRandom(7001);

  // Torch flicker — varies light intensity
  const flicker1 = 0.7 + Math.sin(frame * 0.18) * 0.1 + Math.sin(frame * 0.31) * 0.08 + Math.sin(frame * 0.53) * 0.05;
  const flicker2 = 0.7 + Math.sin(frame * 0.22 + 1) * 0.1 + Math.sin(frame * 0.37 + 2) * 0.07 + Math.sin(frame * 0.47 + 3) * 0.06;

  // Dust motes data
  const dustMotes = useMemo(() =>
    Array.from({ length: 35 }, () => ({
      x: rng() * 1920,
      y: rng() * 800 + 100,
      size: 0.5 + rng() * 2,
      speedX: -0.1 + rng() * 0.2,
      speedY: -0.05 + rng() * 0.1,
      wobbleSpeed: 0.02 + rng() * 0.03,
      wobbleAmp: 5 + rng() * 15,
      brightness: 0.3 + rng() * 0.5,
      phase: rng() * Math.PI * 2,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  // Smoke wisps data
  const smokeWisps = useMemo(() =>
    Array.from({ length: 6 }, () => ({
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
      {/* Base — very dark, warm-toned */}
      <defs>
        <linearGradient id={`${ID}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E0C0A" />
          <stop offset="40%" stopColor="#1A1614" />
          <stop offset="100%" stopColor="#242018" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-base)`} />

      {/* ─── STONE VAULT STRUCTURE ─── */}

      {/* Main vault arch — central rib */}
      <path
        d="M0,400 Q960,-80 1920,400"
        fill="none" stroke={STONE.mid} strokeWidth={30} opacity={0.6}
      />
      <path
        d="M0,400 Q960,-80 1920,400"
        fill="none" stroke={STONE.highlight} strokeWidth={3} opacity={0.15}
      />

      {/* Secondary ribs — crossing arches */}
      <path d="M200,600 Q700,-20 1200,600" fill="none" stroke={STONE.mid} strokeWidth={22} opacity={0.4} />
      <path d="M720,600 Q1220,-20 1720,600" fill="none" stroke={STONE.mid} strokeWidth={22} opacity={0.4} />

      {/* Transverse ribs — horizontal structural elements */}
      <path d="M0,180 Q480,120 960,160 Q1440,120 1920,180" fill="none" stroke={STONE.dark} strokeWidth={18} opacity={0.5} />
      <path d="M0,350 Q480,300 960,330 Q1440,300 1920,350" fill="none" stroke={STONE.dark} strokeWidth={15} opacity={0.4} />

      {/* Stone blocks — between ribs, visible as subtle grid */}
      <g opacity={0.12}>
        {Array.from({ length: 16 }, (_, row) =>
          Array.from({ length: 12 }, (_, col) => {
            const x = col * 165 + (row % 2) * 82;
            const y = row * 45 + 20;
            const w = 155 + (col % 3) * 5;
            const h = 38 + (row % 2) * 4;
            return (
              <rect
                key={`${row}-${col}`}
                x={x} y={y} width={w} height={h}
                fill="none" stroke={STONE.grout} strokeWidth={1.5}
                rx={1}
              />
            );
          })
        )}
      </g>

      {/* Stone texture variation — individual block shading */}
      <g opacity={0.06}>
        {Array.from({ length: 30 }, (_, i) => {
          const x = (i * 67) % 1920;
          const y = (i * 41) % 500;
          const w = 80 + (i % 5) * 30;
          const h = 25 + (i % 3) * 10;
          return (
            <rect
              key={i}
              x={x} y={y} width={w} height={h}
              fill={i % 3 === 0 ? STONE.warm : i % 3 === 1 ? STONE.light : STONE.dark}
              rx={1}
            />
          );
        })}
      </g>

      {/* Moss/damp patches — green-tinted areas */}
      <g opacity={0.04}>
        <ellipse cx={300} cy={200} rx={80} ry={40} fill={STONE.moss} />
        <ellipse cx={1200} cy={150} rx={60} ry={30} fill={STONE.moss} />
        <ellipse cx={800} cy={300} rx={100} ry={35} fill={STONE.moss} />
        <ellipse cx={1600} cy={250} rx={70} ry={28} fill={STONE.moss} />
      </g>

      {/* ─── TORCHLIGHT ─── */}

      {/* Left torch glow */}
      <defs>
        <radialGradient id={`${ID}-torch-l`} cx="0.5" cy="1" r="0.8">
          <stop offset="0%" stopColor="#F0A040" stopOpacity={0.3 * flicker1} />
          <stop offset="30%" stopColor="#E08830" stopOpacity={0.15 * flicker1} />
          <stop offset="60%" stopColor="#C06820" stopOpacity={0.05 * flicker1} />
          <stop offset="100%" stopColor="#C06820" stopOpacity={0} />
        </radialGradient>
        {/* Right torch glow */}
        <radialGradient id={`${ID}-torch-r`} cx="0.5" cy="1" r="0.8">
          <stop offset="0%" stopColor="#F0A040" stopOpacity={0.25 * flicker2} />
          <stop offset="30%" stopColor="#E08830" stopOpacity={0.12 * flicker2} />
          <stop offset="60%" stopColor="#C06820" stopOpacity={0.04 * flicker2} />
          <stop offset="100%" stopColor="#C06820" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Left torch light pool */}
      <ellipse cx={350} cy={900} rx={500} ry={600} fill={`url(#${ID}-torch-l)`} />
      {/* Right torch light pool */}
      <ellipse cx={1570} cy={900} rx={500} ry={600} fill={`url(#${ID}-torch-r)`} />

      {/* Central combined light — where both torches overlap */}
      <defs>
        <radialGradient id={`${ID}-combined`} cx="0.5" cy="0.7" r="0.6">
          <stop offset="0%" stopColor="#E89030" stopOpacity={0.08 * (flicker1 + flicker2) / 2} />
          <stop offset="100%" stopColor="#E89030" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-combined)`} />

      {/* Light hitting vault ribs — warm highlights on stone */}
      <g opacity={0.06 * flicker1}>
        <path d="M300,380 Q600,220 960,300" fill="none" stroke="#E0A050" strokeWidth={8} />
        <path d="M960,300 Q1320,220 1620,380" fill="none" stroke="#D09040" strokeWidth={6} />
      </g>

      {/* ─── ATMOSPHERIC EFFECTS ─── */}

      {/* Smoke wisps — rising from torches */}
      <g opacity={0.05}>
        {smokeWisps.map((w, i) => {
          const yOff = Math.sin(frame * w.speed + w.phase) * 30;
          const xOff = Math.cos(frame * w.speed * 0.7 + w.phase) * 20;
          return (
            <ellipse
              key={i}
              cx={w.cx + xOff}
              cy={w.cy + yOff - frame * 0.1}
              rx={w.rx}
              ry={w.ry}
              fill="#A09080"
            />
          );
        })}
      </g>

      {/* Dust motes — floating in torchlight */}
      <g>
        {dustMotes.map((d, i) => {
          const wobbleX = Math.sin(frame * d.wobbleSpeed + d.phase) * d.wobbleAmp;
          const wobbleY = Math.cos(frame * d.wobbleSpeed * 0.7 + d.phase) * d.wobbleAmp * 0.5;
          const x = d.x + wobbleX + frame * d.speedX;
          const y = d.y + wobbleY + frame * d.speedY;
          // Brighter when near torch positions
          const distToTorch1 = Math.sqrt((x - 350) ** 2 + (y - 800) ** 2);
          const distToTorch2 = Math.sqrt((x - 1570) ** 2 + (y - 800) ** 2);
          const torchLight = Math.max(0, 1 - Math.min(distToTorch1, distToTorch2) / 500);
          const opacity = d.brightness * (0.03 + torchLight * 0.12);

          return (
            <circle
              key={i}
              cx={((x % 2000) + 2000) % 2000 - 40}
              cy={((y % 1100) + 1100) % 1100}
              r={d.size}
              fill="#F0D0A0"
              opacity={opacity}
            />
          );
        })}
      </g>

      {/* Cobwebs — corner decorations */}
      <g opacity={0.04}>
        {/* Top-left cobweb */}
        <path d="M0,0 Q80,30 60,120" fill="none" stroke="#A0A0A0" strokeWidth={0.8} />
        <path d="M0,0 Q50,50 30,130" fill="none" stroke="#A0A0A0" strokeWidth={0.6} />
        <path d="M0,0 Q30,40 10,100" fill="none" stroke="#A0A0A0" strokeWidth={0.5} />
        <path d="M20,40 Q40,50 50,80" fill="none" stroke="#909090" strokeWidth={0.4} />
        {/* Top-right cobweb */}
        <path d="M1920,0 Q1840,30 1860,120" fill="none" stroke="#A0A0A0" strokeWidth={0.8} />
        <path d="M1920,0 Q1870,50 1890,130" fill="none" stroke="#A0A0A0" strokeWidth={0.6} />
        <path d="M1900,40 Q1880,50 1870,80" fill="none" stroke="#909090" strokeWidth={0.4} />
      </g>

      {/* Upper darkness — top of vault fades to black */}
      <defs>
        <linearGradient id={`${ID}-top-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060504" stopOpacity={0.6} />
          <stop offset="30%" stopColor="#060504" stopOpacity={0.3} />
          <stop offset="60%" stopColor="#060504" stopOpacity={0} />
          <stop offset="100%" stopColor="#060504" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-top-dark)`} />

      {/* Heavy vignette — enclosed space feel */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.6" r="0.65">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="50%" stopColor="#000000" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.5} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default IndoorCeiling;
