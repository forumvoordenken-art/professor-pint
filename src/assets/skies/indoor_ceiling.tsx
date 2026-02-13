/**
 * indoor_ceiling — Stenen gewelf met hangende lantaarns.
 *
 * Based on reference: warm stone vault with ONE dominant front arch,
 * thin vault ribs crossing behind, 3 hanging lanterns creating
 * concentrated warm light pools, misty bottom, dark vignette.
 *
 * Key visual principles:
 * - Light comes from LANTERNS, not diffuse — islands of warm glow
 * - One thick front arch dominates the upper third
 * - Thin ghostly ribs cross diagonally behind
 * - Bottom third is obscured by atmospheric mist
 * - Very dark top and edges (strong vignette)
 * - Warm amber palette throughout
 */

import React, { useMemo } from 'react';
import { seededRandom, longCycleNoise, slowDrift } from './SkyEngine';

const ID = 'indoor';

// Warm stone palette — amber/golden tones matching reference
const STONE = {
  darkest: '#1A1610',
  dark: '#2C2418',
  mid: '#4A3C2C',
  warm: '#6A5840',
  light: '#8A7858',
  highlight: '#A89470',
  bright: '#C8B088',
  grout: '#1E1810',
  litWarm: '#D0A868',
  litBright: '#E8C888',
};

export const IndoorCeiling: React.FC<{ frame: number }> = ({ frame }) => {
  const rng = seededRandom(7001);

  // ─── LANTERN FLICKER — non-repeating for 10-15min videos ───
  const lanternFlicker = [
    0.75 + longCycleNoise(frame, 10.0) * 0.15 + slowDrift(frame, 1.0) * 0.05,
    0.80 + longCycleNoise(frame, 20.0) * 0.12 + slowDrift(frame, 2.0) * 0.04,
    0.70 + longCycleNoise(frame, 35.0) * 0.18 + slowDrift(frame, 3.5) * 0.06,
  ];
  // Wind gust — occasionally makes all lanterns flicker harder
  const gustNoise = longCycleNoise(frame * 0.5, 30.0);
  const gust = gustNoise > 0.7 ? (gustNoise - 0.7) * 2.5 : 0;
  const flicker = lanternFlicker.map(f => Math.min(1, f + gust * 0.12));

  // Lantern positions — left, center, right (slightly asymmetric like reference)
  const lanterns = [
    { x: 480, y: 420, chainY: 80, strength: 0.9 },   // left
    { x: 960, y: 480, chainY: 100, strength: 1.0 },   // center (slightly lower, brighter)
    { x: 1440, y: 410, chainY: 75, strength: 0.85 },  // right
  ];

  // Dust motes data
  const dustMotes = useMemo(() =>
    Array.from({ length: 35 }, () => ({
      x: rng() * 1920,
      y: rng() * 700 + 150,
      size: 0.6 + rng() * 2,
      speedX: -0.08 + rng() * 0.16,
      speedY: -0.03 + rng() * 0.06,
      wobbleSpeed: 0.015 + rng() * 0.025,
      wobbleAmp: 4 + rng() * 12,
      brightness: 0.3 + rng() * 0.7,
      phase: rng() * Math.PI * 2,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ─── BASE — dark warm tone, darker at top ─── */}
      <defs>
        <linearGradient id={`${ID}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0C0A08" />
          <stop offset="20%" stopColor="#181410" />
          <stop offset="50%" stopColor="#221C14" />
          <stop offset="80%" stopColor="#2A2218" />
          <stop offset="100%" stopColor="#1C1810" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-base)`} />

      {/* ─── STONE BLOCK WALL — warm visible texture ─── */}
      {/* The blocks should be visible especially in the lit center area */}
      <g>
        {Array.from({ length: 22 }, (_, row) =>
          Array.from({ length: 14 }, (_, col) => {
            const blockW = 130 + (col % 3) * 15 + (row % 2) * 8;
            const blockH = 38 + (row % 3) * 6;
            const x = col * 145 + (row % 2) * 68 - 20;
            const y = row * 44 + 15;
            // Vary stone color per block
            const hash = (row * 17 + col * 31) % 7;
            const fill = hash < 2 ? STONE.dark : hash < 4 ? STONE.mid : hash < 6 ? STONE.warm : STONE.dark;
            // Blocks closer to center are more visible (lit by lanterns)
            const distFromCenter = Math.abs(x + blockW / 2 - 960) / 960;
            const baseOpacity = 0.08 + (1 - distFromCenter) * 0.12;
            return (
              <g key={`b${row}-${col}`}>
                <rect x={x} y={y} width={blockW} height={blockH}
                  fill={fill} rx={1} opacity={baseOpacity} />
                <rect x={x} y={y} width={blockW} height={blockH}
                  fill="none" stroke={STONE.grout} strokeWidth={1.2} rx={1}
                  opacity={baseOpacity * 0.8} />
              </g>
            );
          })
        )}
      </g>

      {/* ─── BACK VAULT RIBS — thin, ghostly, crossing diagonally ─── */}
      {/* These are the thin ribs visible BEHIND the main arch in the reference */}
      <g opacity={0.15}>
        {/* Left-to-right diagonal rib */}
        <path d="M180,650 Q580,100 980,250" fill="none" stroke={STONE.light}
          strokeWidth={5} />
        <path d="M180,650 Q580,100 980,250" fill="none" stroke={STONE.bright}
          strokeWidth={1.5} opacity={0.4} />
        {/* Right-to-left diagonal rib */}
        <path d="M1740,650 Q1340,100 940,250" fill="none" stroke={STONE.light}
          strokeWidth={5} />
        <path d="M1740,650 Q1340,100 940,250" fill="none" stroke={STONE.bright}
          strokeWidth={1.5} opacity={0.4} />
        {/* Secondary crossing ribs — even thinner */}
        <path d="M350,620 Q750,80 1150,350" fill="none" stroke={STONE.warm}
          strokeWidth={3.5} opacity={0.7} />
        <path d="M1570,620 Q1170,80 770,350" fill="none" stroke={STONE.warm}
          strokeWidth={3.5} opacity={0.7} />
        {/* Transverse rib — horizontal-ish, tying the vault together */}
        <path d="M300,350 Q650,280 960,300 Q1270,280 1620,350" fill="none"
          stroke={STONE.warm} strokeWidth={4} opacity={0.6} />
      </g>

      {/* ─── MAIN FRONT ARCH — dominant, thick, light stone ─── */}
      {/* This is THE arch — spanning the full width, peaking in upper third */}
      {/* Arch shadow (underneath) */}
      <path d="M-20,520 Q960,20 1940,520" fill="none"
        stroke={STONE.darkest} strokeWidth={42} opacity={0.25} />
      {/* Arch body — thick stone */}
      <path d="M-20,500 Q960,0 1940,500" fill="none"
        stroke={STONE.mid} strokeWidth={38} opacity={0.55} />
      {/* Arch highlight — lighter inner edge */}
      <path d="M-20,495 Q960,-5 1940,495" fill="none"
        stroke={STONE.light} strokeWidth={8} opacity={0.4} />
      {/* Arch bright edge — the light rim visible in reference */}
      <path d="M-20,490 Q960,-10 1940,490" fill="none"
        stroke={STONE.bright} strokeWidth={3} opacity={0.35} />
      {/* Lower edge shadow line */}
      <path d="M-20,515 Q960,15 1940,515" fill="none"
        stroke={STONE.darkest} strokeWidth={4} opacity={0.3} />

      {/* Arch stone block detail — subtle segmentation */}
      <g opacity={0.1}>
        {Array.from({ length: 25 }, (_, i) => {
          // Place blocks along the arch curve
          const t = (i + 0.5) / 25;
          const x = -20 + t * 1960;
          // Quadratic bezier: y = start + 2*(1-t)*t*control + t*t*end
          const y = (1 - t) * (1 - t) * 500 + 2 * (1 - t) * t * 0 + t * t * 500;
          const angle = Math.atan2(
            2 * (1 - t) * (0 - 500) + 2 * t * (500 - 0),
            1960
          ) * 180 / Math.PI;
          return (
            <line key={i}
              x1={x} y1={y - 18} x2={x} y2={y + 18}
              stroke={STONE.grout} strokeWidth={1.2}
              transform={`rotate(${angle}, ${x}, ${y})`} />
          );
        })}
      </g>

      {/* ─── KEYSTONE at arch apex ─── */}
      <g opacity={0.3}>
        <rect x={940} y={12} width={40} height={32} fill={STONE.light} rx={2} />
        <rect x={940} y={12} width={40} height={32} fill="none"
          stroke={STONE.grout} strokeWidth={1.5} rx={2} />
        {/* Decorative mark */}
        <line x1={960} y1={16} x2={960} y2={40} stroke={STONE.bright} strokeWidth={1} opacity={0.3} />
      </g>

      {/* ─── STONE PILLARS flanking doorways ─── */}
      {/* Left pillar */}
      <g opacity={0.4}>
        <rect x={150} y={500} width={55} height={400} fill={STONE.mid} rx={2} />
        {/* Capital (top molding) */}
        <rect x={142} y={490} width={71} height={16} fill={STONE.light} rx={2} />
        <rect x={145} y={504} width={65} height={8} fill={STONE.warm} rx={1} />
        {/* Base molding */}
        <rect x={145} y={890} width={65} height={12} fill={STONE.light} rx={2} />
        {/* Stone block lines on pillar */}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={150} y1={540 + i * 45} x2={205} y2={540 + i * 45}
            stroke={STONE.grout} strokeWidth={1} opacity={0.5} />
        ))}
      </g>
      {/* Right pillar */}
      <g opacity={0.4}>
        <rect x={1715} y={500} width={55} height={400} fill={STONE.mid} rx={2} />
        <rect x={1707} y={490} width={71} height={16} fill={STONE.light} rx={2} />
        <rect x={1710} y={504} width={65} height={8} fill={STONE.warm} rx={1} />
        <rect x={1710} y={890} width={65} height={12} fill={STONE.light} rx={2} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={1715} y1={540 + i * 45} x2={1770} y2={540 + i * 45}
            stroke={STONE.grout} strokeWidth={1} opacity={0.5} />
        ))}
      </g>

      {/* ─── DARK DOORWAYS / NICHES — left and right ─── */}
      {/* Left doorway */}
      <g opacity={0.5}>
        <path d="M40,530 Q80,480 120,530 L120,900 L40,900 Z" fill="#060504" />
        <path d="M40,530 Q80,480 120,530" fill="none" stroke={STONE.mid} strokeWidth={3} />
        <rect x={38} y={528} width={84} height={374} fill="none"
          stroke={STONE.dark} strokeWidth={2} rx={1} />
      </g>
      {/* Right doorway */}
      <g opacity={0.5}>
        <path d="M1800,530 Q1840,480 1880,530 L1880,900 L1800,900 Z" fill="#060504" />
        <path d="M1800,530 Q1840,480 1880,530" fill="none" stroke={STONE.mid} strokeWidth={3} />
        <rect x={1798} y={528} width={84} height={374} fill="none"
          stroke={STONE.dark} strokeWidth={2} rx={1} />
      </g>

      {/* ─── LANTERN LIGHT POOLS — concentrated warm glow ─── */}
      {/* This is the KEY lighting — focused pools, not diffuse */}
      <defs>
        {lanterns.map((lamp, i) => (
          <radialGradient key={i} id={`${ID}-light-${i}`} cx="0.5" cy="0.3" r="0.6">
            <stop offset="0%" stopColor="#F0A840"
              stopOpacity={0.55 * flicker[i] * lamp.strength} />
            <stop offset="15%" stopColor="#E89830"
              stopOpacity={0.35 * flicker[i] * lamp.strength} />
            <stop offset="35%" stopColor="#D08028"
              stopOpacity={0.18 * flicker[i] * lamp.strength} />
            <stop offset="60%" stopColor="#B06820"
              stopOpacity={0.06 * flicker[i] * lamp.strength} />
            <stop offset="100%" stopColor="#905020" stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      {lanterns.map((lamp, i) => {
        // Each lantern casts a warm pool — larger vertically (illuminates wall below)
        const sway = longCycleNoise(frame * 0.3, i * 15 + 50) * 4;
        return (
          <ellipse key={i}
            cx={lamp.x + sway}
            cy={lamp.y + 80}
            rx={380 * lamp.strength}
            ry={450 * lamp.strength}
            fill={`url(#${ID}-light-${i})`}
          />
        );
      })}

      {/* Secondary glow on stone — warm patches where light hits wall */}
      {lanterns.map((lamp, i) => {
        const sway = longCycleNoise(frame * 0.3, i * 15 + 50) * 4;
        return (
          <g key={`w${i}`} opacity={0.12 * flicker[i]}>
            {/* Upper glow on arch/ceiling stone */}
            <ellipse cx={lamp.x + sway} cy={lamp.y - 60} rx={200} ry={120}
              fill={STONE.litWarm} />
            {/* Bright spot directly around lantern */}
            <ellipse cx={lamp.x + sway} cy={lamp.y} rx={80} ry={60}
              fill={STONE.litBright} opacity={0.3} />
          </g>
        );
      })}

      {/* ─── HANGING LANTERNS — chain + body + flame ─── */}
      {lanterns.map((lamp, i) => {
        const sway = longCycleNoise(frame * 0.3, i * 15 + 50) * 4;
        const lx = lamp.x + sway;
        const ly = lamp.y;
        const f = flicker[i];

        return (
          <g key={`lamp${i}`}>
            {/* Chain/cable — from ceiling to lantern */}
            <line x1={lamp.x} y1={lamp.chainY} x2={lx} y2={ly - 35}
              stroke="#2A2420" strokeWidth={2} opacity={0.5} />
            {/* Secondary chain line (slightly offset for thickness) */}
            <line x1={lamp.x + 1} y1={lamp.chainY} x2={lx + 1} y2={ly - 35}
              stroke="#1A1410" strokeWidth={1} opacity={0.3} />

            {/* Lantern body — dark iron/bronze cage */}
            {/* Top cap */}
            <path d={`M${lx - 8},${ly - 35} L${lx + 8},${ly - 35} L${lx + 6},${ly - 30} L${lx - 6},${ly - 30} Z`}
              fill="#2A2218" opacity={0.6} />
            {/* Upper ring */}
            <ellipse cx={lx} cy={ly - 30} rx={7} ry={2} fill="#2A2218" opacity={0.5} />
            {/* Glass/cage body — slightly transparent */}
            <rect x={lx - 6} y={ly - 28} width={12} height={24}
              fill="#3A2C1C" opacity={0.35} rx={1} />
            {/* Iron frame lines */}
            <line x1={lx - 6} y1={ly - 28} x2={lx - 6} y2={ly - 4}
              stroke="#1A1410" strokeWidth={1.5} opacity={0.4} />
            <line x1={lx + 6} y1={ly - 28} x2={lx + 6} y2={ly - 4}
              stroke="#1A1410" strokeWidth={1.5} opacity={0.4} />
            {/* Bottom point */}
            <path d={`M${lx - 6},${ly - 4} L${lx},${ly + 4} L${lx + 6},${ly - 4}`}
              fill="#2A2218" opacity={0.5} />
            {/* Lower ring */}
            <ellipse cx={lx} cy={ly - 4} rx={7} ry={2} fill="#2A2218" opacity={0.4} />

            {/* Flame inside lantern */}
            <ellipse cx={lx} cy={ly - 18} rx={4} ry={8}
              fill="#F0B040" opacity={0.6 * f} />
            <ellipse cx={lx} cy={ly - 20} rx={2.5} ry={6}
              fill="#F8D070" opacity={0.7 * f} />
            <ellipse cx={lx} cy={ly - 22} rx={1.2} ry={3.5}
              fill="#FFF0B0" opacity={0.5 * f} />

            {/* Flame glow — small bright halo */}
            <ellipse cx={lx} cy={ly - 16} rx={14} ry={18}
              fill="#F0A030" opacity={0.12 * f} />
          </g>
        );
      })}

      {/* ─── LIGHT ON VAULT RIBS — warm highlights from lanterns ─── */}
      <g opacity={0.15 * (flicker[0] + flicker[1] + flicker[2]) / 3}>
        {/* Main arch gets warm highlight where lanterns illuminate it */}
        <path d="M300,440 Q960,60 1620,440" fill="none"
          stroke={STONE.litWarm} strokeWidth={6} />
        {/* Back ribs catch light faintly */}
        <path d="M400,600 Q700,200 980,280" fill="none"
          stroke={STONE.litWarm} strokeWidth={3} opacity={0.4} />
        <path d="M1520,600 Q1220,200 940,280" fill="none"
          stroke={STONE.litWarm} strokeWidth={3} opacity={0.4} />
      </g>

      {/* ─── SOOT MARKS above lanterns — subtle ─── */}
      <g opacity={0.1}>
        {lanterns.map((lamp, i) => (
          <g key={`soot${i}`}>
            <ellipse cx={lamp.x} cy={lamp.chainY + 40} rx={15} ry={35} fill="#0A0806" />
            <ellipse cx={lamp.x} cy={lamp.chainY + 20} rx={10} ry={20} fill="#0A0806" opacity={0.5} />
          </g>
        ))}
      </g>

      {/* ─── ATMOSPHERIC MIST — thick at bottom, obscuring floor ─── */}
      <defs>
        <linearGradient id={`${ID}-mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3C28" stopOpacity={0} />
          <stop offset="30%" stopColor="#3A3020" stopOpacity={0} />
          <stop offset="55%" stopColor="#3A3020" stopOpacity={0.05} />
          <stop offset="75%" stopColor="#2A2418" stopOpacity={0.25} />
          <stop offset="90%" stopColor="#201C14" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#181410" stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <rect x={0} y={400} width={1920} height={680} fill={`url(#${ID}-mist)`} />

      {/* Animated mist wisps — slow drift, non-repeating */}
      {(() => {
        const wisps = [
          { cx: 400, cy: 850, rx: 300, ry: 50, seed: 6001 },
          { cx: 960, cy: 880, rx: 400, ry: 60, seed: 6002 },
          { cx: 1500, cy: 840, rx: 280, ry: 45, seed: 6003 },
          { cx: 700, cy: 900, rx: 350, ry: 55, seed: 6004 },
          { cx: 1200, cy: 870, rx: 320, ry: 48, seed: 6005 },
        ];
        return wisps.map((w, i) => {
          const xDrift = longCycleNoise(frame * 0.15, w.seed) * 60;
          const yDrift = longCycleNoise(frame * 0.1, w.seed + 50) * 15;
          const opDrift = 0.08 + Math.abs(slowDrift(frame, w.seed)) * 0.06;
          return (
            <ellipse key={i}
              cx={w.cx + xDrift} cy={w.cy + yDrift}
              rx={w.rx} ry={w.ry}
              fill="#4A3C28" opacity={opDrift} />
          );
        });
      })()}

      {/* ─── FLOOR — barely visible through mist, warm stone ─── */}
      <g opacity={0.08}>
        {/* Floor light pool from center lantern */}
        <ellipse cx={960} cy={1000} rx={250} ry={60}
          fill={STONE.litWarm} opacity={0.4 * flicker[1]} />
        {/* Flagstone hints */}
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i}
            x={700 + i * 110} y={960 + (i % 2) * 15}
            width={100} height={50}
            fill={STONE.mid} rx={1} opacity={0.3} />
        ))}
      </g>

      {/* ─── DUST MOTES — floating in lantern light ─── */}
      <g>
        {dustMotes.map((d, i) => {
          const wobbleX = longCycleNoise(frame * d.wobbleSpeed * 10, d.phase * 30 + i * 5) * d.wobbleAmp;
          const wobbleY = longCycleNoise(frame * d.wobbleSpeed * 7, d.phase * 20 + i * 3) * d.wobbleAmp * 0.5;
          const x = d.x + wobbleX + frame * d.speedX;
          const y = d.y + wobbleY + frame * d.speedY;
          // Only bright near lanterns
          const closestLanternDist = Math.min(
            ...lanterns.map(l => Math.sqrt((x - l.x) ** 2 + (y - l.y) ** 2))
          );
          const lanternLight = Math.max(0, 1 - closestLanternDist / 350);
          const opacity = d.brightness * (0.02 + lanternLight * 0.3);
          if (opacity < 0.01) return null;
          return (
            <circle key={i}
              cx={((x % 2000) + 2000) % 2000 - 40}
              cy={((y % 900) + 900) % 900 + 100}
              r={d.size} fill="#F0D0A0" opacity={opacity} />
          );
        })}
      </g>

      {/* ─── EMBER SPARKS — rising from lanterns ─── */}
      {(() => {
        const sparks = useMemo(() => {
          const sparkRng = seededRandom(8001);
          return Array.from({ length: 15 }, (_, i) => ({
            lanternIdx: i % 3,
            offsetX: -10 + sparkRng() * 20,
            speed: 0.3 + sparkRng() * 0.6,
            interval: 80 + Math.floor(sparkRng() * 200),
            phase: Math.floor(sparkRng() * 250),
            size: 0.4 + sparkRng() * 1.2,
            drift: -0.2 + sparkRng() * 0.4,
            wobbleAmp: 3 + sparkRng() * 6,
          }));
        }, []);

        return sparks.map((s, i) => {
          const lamp = lanterns[s.lanternIdx];
          const intervalVar = s.interval + Math.floor(longCycleNoise(frame * 0.1, i * 4.3) * 50);
          const progress = ((frame + s.phase) % Math.max(40, intervalVar)) / Math.max(40, intervalVar);
          if (progress > 0.5) return null;
          const life = progress / 0.5;
          const sway = longCycleNoise(frame * 0.3, i * 15 + 50) * 4;
          const x = lamp.x + sway + s.offsetX + longCycleNoise(frame * 0.5, i * 7) * s.wobbleAmp * life;
          const y = lamp.y - 30 - life * 180 * s.speed;
          const fade = life < 0.25 ? life / 0.25 : 1 - (life - 0.25) / 0.75;
          return (
            <circle key={i} cx={x} cy={y} r={s.size * (1 - life * 0.4)}
              fill="#F0A030" opacity={0.25 * fade * flicker[s.lanternIdx]} />
          );
        });
      })()}

      {/* ─── MOSS & DAMP patches — subtle life on stone ─── */}
      <g opacity={0.06}>
        <ellipse cx={250} cy={350} rx={60} ry={25} fill="#3A4A30" />
        <ellipse cx={1100} cy={280} rx={45} ry={20} fill="#3A4A30" />
        <ellipse cx={1650} cy={400} rx={55} ry={22} fill="#384830" />
        <ellipse cx={750} cy={200} rx={50} ry={18} fill="#3A4A30" />
      </g>

      {/* ─── WATER STAINS — vertical streaks ─── */}
      <g opacity={0.08}>
        <rect x={380} y={150} width={3} height={180} fill="#2A2820" rx={1.5} />
        <rect x={1250} y={120} width={4} height={220} fill="#2A2820" rx={2} />
        <rect x={850} y={80} width={3} height={160} fill="#2A2820" rx={1.5} />
      </g>

      {/* ─── CRACKS — subtle, with occasional light bleed ─── */}
      <g opacity={0.15}>
        <path d="M620,250 L625,275 L618,300 L628,330" fill="none"
          stroke={STONE.darkest} strokeWidth={1.8} />
        <path d="M625,275 L638,285" fill="none" stroke={STONE.darkest} strokeWidth={1} />
        <path d="M1350,200 L1345,230 L1352,260" fill="none"
          stroke={STONE.darkest} strokeWidth={2} />
      </g>
      {/* Light bleed through crack */}
      <path d="M620,250 L625,275 L618,300 L628,330" fill="none"
        stroke={STONE.litWarm} strokeWidth={0.6}
        opacity={0.04 * flicker[0]} />

      {/* ─── COBWEBS — corner detail ─── */}
      <g opacity={0.07}>
        <path d="M0,0 Q70,25 55,110" fill="none" stroke="#A0A090" strokeWidth={0.8} />
        <path d="M0,0 Q45,45 25,120" fill="none" stroke="#A0A090" strokeWidth={0.6} />
        <path d="M0,0 Q25,35 10,90" fill="none" stroke="#A0A090" strokeWidth={0.4} />
        <path d="M1920,0 Q1850,25 1865,110" fill="none" stroke="#A0A090" strokeWidth={0.8} />
        <path d="M1920,0 Q1875,45 1895,120" fill="none" stroke="#A0A090" strokeWidth={0.6} />
      </g>

      {/* ─── LIGHT COLOR TEMPERATURE DRIFT — slow warm↔cool shift ─── */}
      {(() => {
        const tempShift = slowDrift(frame, 42.0);
        const warmOverlay = Math.max(0, tempShift) * 0.025;
        const coolOverlay = Math.max(0, -tempShift) * 0.015;
        return (
          <g>
            {warmOverlay > 0.005 && (
              <rect x={0} y={0} width={1920} height={1080}
                fill="#D08020" opacity={warmOverlay} />
            )}
            {coolOverlay > 0.005 && (
              <rect x={0} y={0} width={1920} height={1080}
                fill="#4060A0" opacity={coolOverlay} />
            )}
          </g>
        );
      })()}

      {/* ─── NOISE TEXTURE — slowly scrolling grain for stone feel ─── */}
      {/* Simulated with many small semi-transparent rects */}
      <g opacity={0.04}>
        {Array.from({ length: 80 }, (_, i) => {
          const noiseRng = seededRandom(3000 + i);
          const nx = noiseRng() * 1920;
          const ny = noiseRng() * 1080;
          const nw = 20 + noiseRng() * 80;
          const nh = 10 + noiseRng() * 40;
          // Slowly drift position using noise
          const driftX = slowDrift(frame, i * 0.7) * 8;
          const driftY = slowDrift(frame, i * 1.1) * 4;
          const shade = noiseRng() > 0.5 ? STONE.dark : STONE.mid;
          return (
            <rect key={i}
              x={((nx + driftX) % 1960) - 20}
              y={((ny + driftY) % 1120) - 20}
              width={nw} height={nh}
              fill={shade} rx={1} opacity={0.3 + noiseRng() * 0.4} />
          );
        })}
      </g>

      {/* ─── STRONG VIGNETTE — very dark top, dark sides, center lit ─── */}
      {/* Top darkness — ceiling disappears into shadow at very top */}
      <defs>
        <linearGradient id={`${ID}-top-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060504" stopOpacity={0.85} />
          <stop offset="8%" stopColor="#060504" stopOpacity={0.65} />
          <stop offset="20%" stopColor="#0A0808" stopOpacity={0.35} />
          <stop offset="40%" stopColor="#0A0808" stopOpacity={0.05} />
          <stop offset="60%" stopColor="#0A0808" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={650} fill={`url(#${ID}-top-dark)`} />

      {/* Radial vignette — centered slightly above middle, matching lantern illumination */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="40%" stopColor="#000000" stopOpacity={0} />
          <stop offset="65%" stopColor="#000000" stopOpacity={0.15} />
          <stop offset="85%" stopColor="#000000" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.65} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />

      {/* Side darkness — extra dark on left and right edges */}
      <defs>
        <linearGradient id={`${ID}-side-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#040302" stopOpacity={0.6} />
          <stop offset="15%" stopColor="#040302" stopOpacity={0.2} />
          <stop offset="40%" stopColor="#040302" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${ID}-side-r`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#040302" stopOpacity={0.6} />
          <stop offset="15%" stopColor="#040302" stopOpacity={0.2} />
          <stop offset="40%" stopColor="#040302" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-side-l)`} />
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-side-r)`} />

      {/* Warm ambient fill — prevents pure black, keeps warm tone */}
      <rect x={0} y={0} width={1920} height={1080} fill="#2A2010" opacity={0.06} />
    </svg>
  );
};

export default IndoorCeiling;
