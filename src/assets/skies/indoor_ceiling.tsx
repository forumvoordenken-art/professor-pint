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
import { seededRandom, longCycleNoise, slowDrift } from './SkyEngine';

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

  // Torch flicker — non-repeating via longCycleNoise for 10-15min videos
  const baseFlicker1 = 0.78 + longCycleNoise(frame, 10.0) * 0.12;
  const baseFlicker2 = 0.78 + longCycleNoise(frame, 20.0) * 0.12;
  // Wind gusts — occasional strong flicker events (non-periodic)
  const gustNoise = longCycleNoise(frame * 0.5, 30.0);
  const gust = gustNoise > 0.7 ? (gustNoise - 0.7) * 3.3 : 0; // triggers ~15% of time
  const flicker1 = Math.min(1, baseFlicker1 + gust * 0.15 + slowDrift(frame, 1.0) * 0.04);
  const flicker2 = Math.min(1, baseFlicker2 + gust * 0.10 + slowDrift(frame, 2.0) * 0.04);

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

      {/* ─── THIRD TORCH — deeper, dimmer, center-back for depth ─── */}
      {(() => {
        const flicker3 = 0.55 + longCycleNoise(frame, 35.0) * 0.10 + slowDrift(frame, 3.5) * 0.03;
        return (
          <g>
            <defs>
              <radialGradient id={`${ID}-torch-c`} cx="0.5" cy="1" r="0.7">
                <stop offset="0%" stopColor="#D89030" stopOpacity={0.25 * flicker3} />
                <stop offset="30%" stopColor="#C07828" stopOpacity={0.12 * flicker3} />
                <stop offset="60%" stopColor="#A06020" stopOpacity={0.04 * flicker3} />
                <stop offset="100%" stopColor="#A06020" stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={960} cy={780} rx={350} ry={400} fill={`url(#${ID}-torch-c)`} />
            <ellipse cx={960} cy={740} rx={5} ry={10} fill="#E0A040" opacity={0.3 * flicker3} />
            <ellipse cx={960} cy={735} rx={2.5} ry={6} fill="#F0C070" opacity={0.35 * flicker3} />
            <rect x={952} y={750} width={16} height={4} fill="#3A3430" opacity={0.25} rx={1} />
            <rect x={948} y={750} width={4} height={35} fill="#3A3430" opacity={0.25} rx={1} />
          </g>
        );
      })()}

      {/* ─── SOOT MARKS above torches ─── */}
      <g opacity={0.18}>
        <ellipse cx={350} cy={790} rx={35} ry={80} fill="#0A0806" />
        <ellipse cx={350} cy={740} rx={25} ry={50} fill="#0A0806" opacity={0.6} />
        <ellipse cx={350} cy={700} rx={15} ry={30} fill="#0A0806" opacity={0.3} />
        <ellipse cx={1570} cy={790} rx={35} ry={80} fill="#0A0806" />
        <ellipse cx={1570} cy={740} rx={25} ry={50} fill="#0A0806" opacity={0.6} />
        <ellipse cx={1570} cy={700} rx={15} ry={30} fill="#0A0806" opacity={0.3} />
        <ellipse cx={960} cy={710} rx={20} ry={50} fill="#0A0806" opacity={0.4} />
      </g>

      {/* ─── STONE CARVINGS / RELIEF on vault panels ─── */}
      <g opacity={0.12}>
        {/* Left panel — shield/cross motif */}
        <rect x={380} y={220} width={80} height={100} fill="none" stroke={STONE.mid} strokeWidth={2} rx={4} />
        <line x1={420} y1={220} x2={420} y2={320} stroke={STONE.mid} strokeWidth={1.5} />
        <line x1={380} y1={270} x2={460} y2={270} stroke={STONE.mid} strokeWidth={1.5} />
        <circle cx={420} cy={270} r={20} fill="none" stroke={STONE.light} strokeWidth={1} />
        {/* Right panel — arch motif */}
        <rect x={1400} y={200} width={90} height={110} fill="none" stroke={STONE.mid} strokeWidth={2} rx={4} />
        <path d="M1410,310 Q1445,230 1480,310" fill="none" stroke={STONE.light} strokeWidth={1.5} />
        <path d="M1420,310 Q1445,245 1470,310" fill="none" stroke={STONE.mid} strokeWidth={1} />
        {/* Center medallion near keystone */}
        <circle cx={960} cy={100} r={30} fill="none" stroke={STONE.light} strokeWidth={2} />
        <circle cx={960} cy={100} r={18} fill="none" stroke={STONE.mid} strokeWidth={1.5} />
        <line x1={960} y1={82} x2={960} y2={118} stroke={STONE.mid} strokeWidth={1} />
        <line x1={942} y1={100} x2={978} y2={100} stroke={STONE.mid} strokeWidth={1} />
        {/* Small rosette patterns between ribs */}
        {[680, 1240].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={160} r={14} fill="none" stroke={STONE.mid} strokeWidth={1} />
            {[0, 60, 120, 180, 240, 300].map((angle, j) => (
              <line key={j}
                x1={cx + Math.cos(angle * Math.PI / 180) * 6}
                y1={160 + Math.sin(angle * Math.PI / 180) * 6}
                x2={cx + Math.cos(angle * Math.PI / 180) * 14}
                y2={160 + Math.sin(angle * Math.PI / 180) * 14}
                stroke={STONE.mid} strokeWidth={0.8} />
            ))}
          </g>
        ))}
      </g>

      {/* ─── CRACKS in stone — light bleeding through some ─── */}
      <g>
        {/* Major crack — left vault, warm light bleeds through */}
        <path d="M520,180 L525,200 L518,225 L528,260 L522,290 L530,310"
          fill="none" stroke="#1A1610" strokeWidth={2} opacity={0.25} />
        <path d="M520,180 L525,200 L518,225 L528,260 L522,290 L530,310"
          fill="none" stroke={STONE.litWarm} strokeWidth={0.8} opacity={0.08 * flicker1} />
        {/* Branching hairline cracks */}
        <path d="M525,200 L540,210 L545,230" fill="none" stroke="#1A1610" strokeWidth={1} opacity={0.18} />
        <path d="M528,260 L515,270 L510,285" fill="none" stroke="#1A1610" strokeWidth={1} opacity={0.15} />
        {/* Right side — wider crack, no light */}
        <path d="M1380,150 L1375,175 L1382,210 L1370,240 L1378,270"
          fill="none" stroke="#1A1610" strokeWidth={2.5} opacity={0.2} />
        <path d="M1382,210 L1395,225 L1400,245" fill="none" stroke="#1A1610" strokeWidth={1.2} opacity={0.15} />
        {/* Small star crack near keystone */}
        <g opacity={0.15}>
          <line x1={900} y1={80} x2={895} y2={65} stroke="#1A1610" strokeWidth={1} />
          <line x1={900} y1={80} x2={910} y2={68} stroke="#1A1610" strokeWidth={0.8} />
          <line x1={900} y1={80} x2={888} y2={78} stroke="#1A1610" strokeWidth={0.8} />
        </g>
      </g>

      {/* ─── HANGING CHAINS with hooks — animated sway ─── */}
      {(() => {
        const chains = [
          { x: 600, y: 320, length: 120, speed: 0.03, amp: 4, phase: 0 },
          { x: 1320, y: 280, length: 150, speed: 0.025, amp: 5, phase: 1.5 },
          { x: 960, y: 160, length: 100, speed: 0.02, amp: 3, phase: 3 },
        ];
        return chains.map((chain, ci) => {
          const sway = Math.sin(frame * chain.speed + chain.phase) * chain.amp;
          const sway2 = Math.sin(frame * chain.speed * 1.4 + chain.phase + 0.5) * chain.amp * 0.3;
          const links = Math.floor(chain.length / 12);
          return (
            <g key={ci} opacity={0.22}>
              {Array.from({ length: links }, (_, li) => {
                const progress = li / links;
                const linkSway = sway * progress + sway2 * progress * progress;
                const lx = chain.x + linkSway;
                const ly = chain.y + li * 12;
                return li % 2 === 0 ? (
                  <ellipse key={li} cx={lx} cy={ly} rx={3} ry={5}
                    fill="none" stroke="#4A4440" strokeWidth={1.5} />
                ) : (
                  <ellipse key={li} cx={lx} cy={ly} rx={4} ry={3}
                    fill="none" stroke="#4A4440" strokeWidth={1.5} />
                );
              })}
              {/* Hook at the bottom */}
              <path d={`M${chain.x + sway * 1},${chain.y + chain.length}
                q0,8 -6,12 q-4,3 -2,8 q2,5 6,2`}
                fill="none" stroke="#4A4440" strokeWidth={2} opacity={0.8} />
            </g>
          );
        });
      })()}

      {/* ─── DRIPPING WATER — animated drops ─── */}
      {(() => {
        const drips = [
          { x: 520, startY: 310, speed: 1.2, interval: 180, phase: 0 },
          { x: 1375, startY: 270, speed: 1.5, interval: 240, phase: 60 },
          { x: 780, startY: 220, speed: 1.0, interval: 300, phase: 120 },
          { x: 1100, startY: 250, speed: 1.3, interval: 200, phase: 40 },
        ];
        return drips.map((drip, di) => {
          const progress = ((frame + drip.phase) % drip.interval) / drip.interval;
          // Water bead forming
          if (progress < 0.3) {
            const size = progress / 0.3;
            return (
              <ellipse key={di} cx={drip.x} cy={drip.startY + size * 3}
                rx={1.5 * size} ry={2 * size}
                fill="#8090A0" opacity={0.2 * size} />
            );
          }
          // Drop falling
          if (progress < 0.85) {
            const fallProgress = (progress - 0.3) / 0.55;
            const fallDist = fallProgress * fallProgress * 400;
            return (
              <g key={di}>
                <ellipse cx={drip.x} cy={drip.startY + 3 + fallDist}
                  rx={1.2} ry={2.5 + fallProgress * 2}
                  fill="#8090A0" opacity={0.18 * (1 - fallProgress * 0.5)} />
                {/* Tiny highlight on drop */}
                <ellipse cx={drip.x - 0.5} cy={drip.startY + 2 + fallDist}
                  rx={0.5} ry={1}
                  fill="#B0C0D0" opacity={0.12 * (1 - fallProgress)} />
              </g>
            );
          }
          // Splash at bottom
          const splashProgress = (progress - 0.85) / 0.15;
          const splashY = drip.startY + 3 + 400;
          return (
            <g key={di} opacity={0.15 * (1 - splashProgress)}>
              <ellipse cx={drip.x} cy={splashY}
                rx={3 + splashProgress * 8} ry={1 + splashProgress * 2}
                fill="#8090A0" />
              <circle cx={drip.x - 3 * splashProgress} cy={splashY - 2 * splashProgress}
                r={0.8} fill="#8090A0" />
              <circle cx={drip.x + 4 * splashProgress} cy={splashY - 1.5 * splashProgress}
                r={0.6} fill="#8090A0" />
            </g>
          );
        });
      })()}

      {/* ─── EXTENDED COBWEBS — between arches, center ceiling ─── */}
      <g opacity={0.08}>
        {/* Large web between left rib and transverse — sagging catenary */}
        <path d="M480,200 Q520,280 600,240 Q650,220 700,250 Q680,300 600,310 Q520,300 480,260"
          fill="none" stroke="#B0B0A0" strokeWidth={0.6} />
        <path d="M480,200 Q590,270 700,250" fill="none" stroke="#A0A090" strokeWidth={0.4} />
        <path d="M600,240 Q600,290 600,310" fill="none" stroke="#A0A090" strokeWidth={0.4} />
        <path d="M480,260 Q590,250 700,250" fill="none" stroke="#A0A090" strokeWidth={0.3} />
        {/* Dusty web clump at chain attachment */}
        <ellipse cx={600} cy={315} rx={12} ry={6} fill="#908880" opacity={0.3} />
        {/* Right side web — simpler, sparser */}
        <path d="M1300,180 Q1350,230 1400,200" fill="none" stroke="#B0B0A0" strokeWidth={0.5} />
        <path d="M1350,230 Q1360,260 1340,280" fill="none" stroke="#A0A090" strokeWidth={0.4} />
        <path d="M1300,180 Q1340,250 1340,280" fill="none" stroke="#A0A090" strokeWidth={0.3} />
        {/* Thread from ceiling — single strand with dust */}
        <path d="M850,50 Q852,120 848,200" fill="none" stroke="#B0B0A0" strokeWidth={0.4} />
        <circle cx={848} cy={200} r={2} fill="#A09880" opacity={0.15} />
      </g>

      {/* ─── SHADOW PATTERNS from arch ribs ─── */}
      <g opacity={0.08 * flicker1}>
        {/* Left torch casts rib shadows rightward */}
        <path d="M500,420 Q700,350 960,380 L970,390 Q700,360 510,430Z" fill="#0A0806" />
        <path d="M300,610 Q500,520 700,610 L700,620 Q500,530 300,620Z" fill="#0A0806" />
      </g>
      <g opacity={0.06 * flicker2}>
        {/* Right torch casts rib shadows leftward */}
        <path d="M1420,420 Q1220,350 960,380 L950,390 Q1220,360 1410,430Z" fill="#0A0806" />
        <path d="M1720,610 Q1520,520 1220,610 L1220,620 Q1520,530 1720,620Z" fill="#0A0806" />
      </g>

      {/* ─── FLAGSTONE FLOOR — visible in lower third ─── */}
      <g opacity={0.18}>
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => {
            const flagW = 160 + (col % 3) * 30 + (row % 2) * 15;
            const flagH = 80 + (row % 2) * 20;
            const x = col * 195 + (row % 2) * 95 - 20;
            const y = 780 + row * (flagH + 4);
            const shade = ((row + col) * 7) % 5;
            const fill = shade < 2 ? STONE.dark : shade < 4 ? STONE.mid : STONE.warm;
            return (
              <g key={`f${row}-${col}`}>
                <rect x={x} y={y} width={flagW} height={flagH} fill={fill}
                  rx={2} opacity={0.5 + (shade % 3) * 0.15} />
                <rect x={x} y={y} width={flagW} height={flagH} fill="none"
                  stroke={STONE.grout} strokeWidth={2} rx={2} opacity={0.4} />
              </g>
            );
          })
        )}
      </g>
      {/* Floor wear marks — polished paths where people walk */}
      <g opacity={0.06}>
        <ellipse cx={960} cy={950} rx={300} ry={30} fill={STONE.light} />
        <ellipse cx={500} cy={920} rx={150} ry={20} fill={STONE.light} />
        <ellipse cx={1400} cy={930} rx={180} ry={22} fill={STONE.light} />
      </g>
      {/* Puddle on floor — near drip point */}
      <g opacity={0.08}>
        <ellipse cx={520} cy={720} rx={25} ry={8} fill="#506070" />
        <ellipse cx={520} cy={720} rx={18} ry={5} fill="#607080" opacity={0.4} />
      </g>

      {/* ─── COLUMN CAPITALS at vault springers ─── */}
      <g opacity={0.3}>
        {/* Left springer — where ribs meet the wall */}
        <rect x={0} y={570} width={60} height={35} fill={STONE.mid} rx={3} />
        <rect x={-5} y={560} width={70} height={15} fill={STONE.light} rx={2} />
        <rect x={-3} y={600} width={66} height={10} fill={STONE.light} rx={2} />
        {/* Decorative corbel detail */}
        <path d="M5,605 Q30,630 55,605" fill="none" stroke={STONE.highlight} strokeWidth={1.5} />
        <path d="M10,610 Q30,625 50,610" fill="none" stroke={STONE.mid} strokeWidth={1} />
        {/* Right springer */}
        <rect x={1860} y={570} width={60} height={35} fill={STONE.mid} rx={3} />
        <rect x={1855} y={560} width={70} height={15} fill={STONE.light} rx={2} />
        <rect x={1857} y={600} width={66} height={10} fill={STONE.light} rx={2} />
        <path d="M1865,605 Q1890,630 1915,605" fill="none" stroke={STONE.highlight} strokeWidth={1.5} />
        {/* Center-left springer at crossing rib */}
        <rect x={180} y={575} width={50} height={30} fill={STONE.mid} rx={3} />
        <rect x={175} y={567} width={60} height={12} fill={STONE.light} rx={2} />
        {/* Center-right springer */}
        <rect x={1690} y={575} width={50} height={30} fill={STONE.mid} rx={3} />
        <rect x={1685} y={567} width={60} height={12} fill={STONE.light} rx={2} />
      </g>

      {/* ─── PASSAGE / DOORWAY — light leak from another room ─── */}
      {(() => {
        // Distant doorway on the right wall — warm light leaking in
        const passageFlicker = 0.6 + longCycleNoise(frame, 50.0) * 0.15;
        return (
          <g>
            {/* Dark archway shape */}
            <path d="M1850,650 Q1870,600 1890,650 L1890,850 L1850,850 Z"
              fill="#0A0808" opacity={0.4} />
            {/* Warm light leak */}
            <defs>
              <radialGradient id={`${ID}-passage`} cx="0.5" cy="0.4" r="0.6">
                <stop offset="0%" stopColor="#D09040" stopOpacity={0.12 * passageFlicker} />
                <stop offset="50%" stopColor="#C08030" stopOpacity={0.04 * passageFlicker} />
                <stop offset="100%" stopColor="#C08030" stopOpacity={0} />
              </radialGradient>
            </defs>
            <ellipse cx={1870} cy={740} rx={120} ry={160} fill={`url(#${ID}-passage)`} />
            {/* Light spill on floor */}
            <ellipse cx={1800} cy={860} rx={80} ry={20}
              fill="#D09040" opacity={0.03 * passageFlicker} />
          </g>
        );
      })()}

      {/* ─── TORCH EMBER SPARKS — rising orange dots ─── */}
      {(() => {
        // Each spark has a unique lifecycle driven by non-repeating noise
        const sparks = useMemo(() => {
          const sparkRng = seededRandom(8001);
          return Array.from({ length: 20 }, (_, i) => ({
            torchX: i < 10 ? 350 : 1570,
            offsetX: -15 + sparkRng() * 30,
            speed: 0.4 + sparkRng() * 0.8,
            interval: 60 + Math.floor(sparkRng() * 200),
            phase: Math.floor(sparkRng() * 300),
            size: 0.5 + sparkRng() * 1.5,
            drift: -0.3 + sparkRng() * 0.6,
            wobbleSpeed: 0.08 + sparkRng() * 0.12,
            wobbleAmp: 3 + sparkRng() * 8,
          }));
        }, []);

        return sparks.map((s, i) => {
          // Non-repeating interval variation using noise
          const intervalVar = s.interval + Math.floor(longCycleNoise(frame * 0.1, i * 3.7) * 40);
          const progress = ((frame + s.phase) % Math.max(30, intervalVar)) / Math.max(30, intervalVar);
          if (progress > 0.6) return null; // spark only alive for 60% of cycle
          const life = progress / 0.6;
          const x = s.torchX + s.offsetX + Math.sin(frame * s.wobbleSpeed + i) * s.wobbleAmp * life + frame * s.drift * 0.1;
          const y = 800 - life * 250 * s.speed;
          const fade = life < 0.3 ? life / 0.3 : 1 - (life - 0.3) / 0.7;
          return (
            <circle key={i} cx={x} cy={y} r={s.size * (1 - life * 0.5)}
              fill="#F0A030" opacity={0.3 * fade} />
          );
        });
      })()}

      {/* ─── RAT SHADOW — occasional dart across floor ─── */}
      {(() => {
        // Rat appears every ~500-700 frames, runs across in ~60 frames
        const ratCycle = 600 + Math.floor(slowDrift(frame, 99.0) * 80);
        const ratProgress = (frame % Math.max(200, ratCycle));
        const runDuration = 50;
        if (ratProgress >= runDuration) return null;
        const t = ratProgress / runDuration;
        // Alternating direction based on cycle count
        const direction = Math.floor(frame / Math.max(200, ratCycle)) % 2 === 0 ? 1 : -1;
        const startX = direction > 0 ? -30 : 1950;
        const ratX = startX + direction * t * 1980;
        const ratY = 900 + Math.sin(t * Math.PI * 6) * 3; // tiny scurry bounce
        return (
          <g opacity={0.12}>
            {/* Body */}
            <ellipse cx={ratX} cy={ratY} rx={12} ry={5} fill="#1A1614" />
            {/* Head */}
            <ellipse cx={ratX + direction * 10} cy={ratY - 2} rx={5} ry={4} fill="#1A1614" />
            {/* Tail */}
            <path d={`M${ratX - direction * 12},${ratY} q${-direction * 15},${-8} ${-direction * 25},${3}`}
              fill="none" stroke="#1A1614" strokeWidth={1.5} />
          </g>
        );
      })()}

      {/* ─── FALLING STONE DUST — from cracks, non-repeating ─── */}
      {(() => {
        const dustSources = [
          { x: 522, y: 310, seed: 9001 },
          { x: 1378, y: 270, seed: 9002 },
          { x: 900, y: 80, seed: 9003 },
        ];
        return dustSources.map((src, si) => {
          // Trigger dust fall non-periodically
          const trigger = longCycleNoise(frame * 0.3, src.seed);
          if (trigger < 0.5) return null; // only active ~25% of time
          const intensity = (trigger - 0.5) * 2;
          const dustRng = seededRandom(src.seed + Math.floor(frame / 120));
          return (
            <g key={si} opacity={0.15 * intensity}>
              {Array.from({ length: 5 }, (_, di) => {
                const dx = -8 + dustRng() * 16;
                const fallSpeed = 0.3 + dustRng() * 0.5;
                const dy = (frame * fallSpeed + dustRng() * 100) % 200;
                return (
                  <circle key={di}
                    cx={src.x + dx + Math.sin(frame * 0.05 + di) * 2}
                    cy={src.y + dy}
                    r={0.4 + dustRng() * 0.8}
                    fill={STONE.mid} />
                );
              })}
            </g>
          );
        });
      })()}

      {/* ─── WALL NICHES — recessed alcoves with deeper shadow ─── */}
      <g opacity={0.2}>
        {/* Left wall niche */}
        <rect x={80} y={650} width={60} height={100} fill="#0E0C0A" rx={3} />
        <path d="M80,650 Q110,635 140,650" fill="none" stroke={STONE.mid} strokeWidth={2} />
        <rect x={82} y={652} width={56} height={96} fill="none" stroke={STONE.grout} strokeWidth={1} rx={2} />
        {/* Right wall niche */}
        <rect x={1780} y={660} width={55} height={90} fill="#0E0C0A" rx={3} />
        <path d="M1780,660 Q1807,648 1835,660" fill="none" stroke={STONE.mid} strokeWidth={2} />
        <rect x={1782} y={662} width={51} height={86} fill="none" stroke={STONE.grout} strokeWidth={1} rx={2} />
      </g>

      {/* ─── PILLAR BASES — at floor level ─── */}
      <g opacity={0.25}>
        {/* Left pillar base */}
        <rect x={170} y={750} width={70} height={200} fill={STONE.mid} rx={2} />
        <rect x={165} y={745} width={80} height={12} fill={STONE.light} rx={2} />
        <rect x={168} y={940} width={74} height={10} fill={STONE.light} rx={2} />
        {/* Right pillar base */}
        <rect x={1680} y={750} width={70} height={200} fill={STONE.mid} rx={2} />
        <rect x={1675} y={745} width={80} height={12} fill={STONE.light} rx={2} />
        <rect x={1678} y={940} width={74} height={10} fill={STONE.light} rx={2} />
      </g>

      {/* ─── ANIMATED SMOKE RINGS from torches — slow rising ─── */}
      {(() => {
        const rings = [
          { torchX: 350, seed: 6001 },
          { torchX: 1570, seed: 6002 },
          { torchX: 960, seed: 6003 },
        ];
        return rings.map((ring, ri) => {
          const ringRng = seededRandom(ring.seed);
          return Array.from({ length: 3 }, (_, i) => {
            const interval = 180 + Math.floor(ringRng() * 120);
            const phase = Math.floor(ringRng() * interval);
            const progress = ((frame + phase) % interval) / interval;
            const y = (ring.torchX === 960 ? 720 : 790) - progress * 350;
            const radius = 8 + progress * 30;
            const fade = progress < 0.1 ? progress / 0.1 : Math.max(0, 1 - (progress - 0.3) / 0.7);
            const wobble = longCycleNoise(frame * 0.5, ring.seed + i * 11) * 15;
            return (
              <ellipse key={`${ri}-${i}`}
                cx={ring.torchX + wobble}
                cy={y}
                rx={radius} ry={radius * 0.4}
                fill="none" stroke="#706050"
                strokeWidth={1.5 - progress}
                opacity={0.04 * fade} />
            );
          });
        });
      })()}

      {/* ─── LIGHT COLOR TEMPERATURE SHIFT — slow drift warm↔cool ─── */}
      {(() => {
        const tempShift = slowDrift(frame, 42.0);
        // When positive: slightly warmer. When negative: slightly cooler.
        const warmOverlay = Math.max(0, tempShift) * 0.03;
        const coolOverlay = Math.max(0, -tempShift) * 0.02;
        return (
          <g>
            {warmOverlay > 0.005 && (
              <rect x={0} y={0} width={1920} height={1080} fill="#D08020" opacity={warmOverlay} />
            )}
            {coolOverlay > 0.005 && (
              <rect x={0} y={0} width={1920} height={1080} fill="#4060A0" opacity={coolOverlay} />
            )}
          </g>
        );
      })()}

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
