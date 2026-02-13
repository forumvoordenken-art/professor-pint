/**
 * night_stars — Donkerblauwe sterrenhemel, helder en diep.
 *
 * Filosofie, wetenschap, reflectie, astronomie.
 * Rich starfield with varying brightness and twinkle patterns.
 * Milky Way band stretching diagonally across the sky.
 * No moon — pure stellar darkness with subtle nebula hints.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  StarField,
  AtmosphericHaze,
  generateStars,
  seededRandom,
  longCycleNoise,
} from './SkyEngine';

const ID = 'night-stars';

// Deep night palette — rich dark blues, not pure black
const SKY_STOPS = [
  { offset: '0%', color: '#050810' },        // near black zenith
  { offset: '15%', color: '#080C18' },       // very dark blue
  { offset: '35%', color: '#0A1020' },       // dark navy
  { offset: '55%', color: '#0E1828' },       // navy
  { offset: '75%', color: '#142030' },       // blue-black
  { offset: '90%', color: '#182838' },       // horizon blue
  { offset: '100%', color: '#1E3040' },      // subtle horizon glow
];

// Dense starfield — multiple layers for depth
const STARS_FAINT = generateStars(120, 201, 800, 0.02);
const STARS_MED = generateStars(60, 202, 750, 0.06);
const STARS_BRIGHT = generateStars(25, 203, 650, 0.15);

export const NightStars: React.FC<AssetProps> = ({ frame }) => {
  const rng = seededRandom(501);

  // Milky Way data — band of concentrated dim stars + nebula glow
  const milkyWayStars = useMemo(() =>
    Array.from({ length: 200 }, () => {
      // Band runs diagonally from upper-left to lower-right
      const t = rng();
      const bandCenterX = 200 + t * 1400;
      const bandCenterY = 80 + t * 500;
      const spread = 80 + rng() * 120;
      return {
        cx: bandCenterX + (rng() - 0.5) * spread,
        cy: bandCenterY + (rng() - 0.5) * spread * 0.6,
        r: 0.3 + rng() * 0.6,
        brightness: 0.15 + rng() * 0.25,
        phase: rng(),
      };
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  // Nebula patches — faint colored wisps in the Milky Way
  const nebulae = useMemo(() => [
    { cx: 600, cy: 200, rx: 150, ry: 80, color: '#2A1840', opacity: 0.08 },
    { cx: 900, cy: 280, rx: 120, ry: 60, color: '#1A2040', opacity: 0.06 },
    { cx: 1200, cy: 350, rx: 180, ry: 90, color: '#201838', opacity: 0.07 },
    { cx: 450, cy: 160, rx: 100, ry: 50, color: '#281830', opacity: 0.05 },
    { cx: 1050, cy: 320, rx: 140, ry: 70, color: '#1A1838', opacity: 0.06 },
    { cx: 750, cy: 240, rx: 160, ry: 75, color: '#221840', opacity: 0.07 },
  ], []);

  // Shooting stars — multiple, randomized timing/position/direction
  // Each star has a pseudo-random cycle driven by longCycleNoise
  const shootingStarData = useMemo(() => {
    const sRng = seededRandom(7777);
    return Array.from({ length: 5 }, (_, i) => ({
      baseInterval: 120 + Math.floor(sRng() * 240), // 4-12 sec between appearances
      duration: 6 + Math.floor(sRng() * 8),          // 6-14 frames visible
      startX: 200 + sRng() * 1500,
      startY: 50 + sRng() * 350,
      angle: 0.3 + sRng() * 1.0,                     // direction angle (radians)
      length: 150 + sRng() * 250,                     // travel distance
      tailLength: 50 + sRng() * 100,
      brightness: 0.5 + sRng() * 0.5,
      seed: i * 17.3,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — deep dark blue */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Subtle airglow — dim greenish band near horizon */}
      <defs>
        <linearGradient id={`${ID}-airglow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A4A3A" stopOpacity={0} />
          <stop offset="75%" stopColor="#2A4A3A" stopOpacity={0} />
          <stop offset="90%" stopColor="#2A4A3A" stopOpacity={0.04} />
          <stop offset="100%" stopColor="#2A4A3A" stopOpacity={0.06} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-airglow)`} />

      {/* Milky Way glow band — diffuse light */}
      <defs>
        <linearGradient id={`${ID}-mw-grad`} x1="0.1" y1="0" x2="0.9" y2="1"
          gradientTransform="rotate(-25)">
          <stop offset="0%" stopColor="#181830" stopOpacity={0} />
          <stop offset="30%" stopColor="#1A1838" stopOpacity={0.06} />
          <stop offset="50%" stopColor="#201840" stopOpacity={0.1} />
          <stop offset="70%" stopColor="#1A1838" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#181830" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={700} fill={`url(#${ID}-mw-grad)`} />

      {/* Nebula patches — faint colored wisps */}
      {nebulae.map((n, i) => (
        <g key={i}>
          <defs>
            <radialGradient id={`${ID}-neb-${i}`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor={n.color} stopOpacity={n.opacity} />
              <stop offset="100%" stopColor={n.color} stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry} fill={`url(#${ID}-neb-${i})`} />
        </g>
      ))}

      {/* Milky Way dense star band */}
      <g opacity={0.7}>
        <StarField stars={milkyWayStars} frame={frame} twinkleSpeed={0.03} />
      </g>

      {/* Faint background stars */}
      <g opacity={0.5}>
        <StarField stars={STARS_FAINT} frame={frame} twinkleSpeed={0.04} />
      </g>

      {/* Medium stars */}
      <g opacity={0.75}>
        <StarField stars={STARS_MED} frame={frame} twinkleSpeed={0.05} />
      </g>

      {/* Bright stars — with cross sparkle */}
      <StarField stars={STARS_BRIGHT} frame={frame} twinkleSpeed={0.06} />

      {/* Notable bright stars — manually placed for composition */}
      <g>
        {/* Bright blue-white star upper left */}
        <circle cx={320} cy={150} r={2.8} fill="#C0D0FF" opacity={0.7 + Math.sin(frame * 0.04) * 0.15} />
        <circle cx={320} cy={150} r={8} fill="#8090C0" opacity={0.06} />
        {/* Warm orange star right side */}
        <circle cx={1500} cy={200} r={2.2} fill="#FFC888" opacity={0.6 + Math.sin(frame * 0.05 + 1) * 0.12} />
        <circle cx={1500} cy={200} r={6} fill="#C0A070" opacity={0.04} />
        {/* Bright white star near zenith */}
        <circle cx={800} cy={80} r={3} fill="#EEEEFF" opacity={0.8 + Math.sin(frame * 0.035 + 2) * 0.1} />
        <circle cx={800} cy={80} r={10} fill="#9090B0" opacity={0.05} />
      </g>

      {/* Shooting stars — randomized timing, position, direction */}
      {shootingStarData.map((star, si) => {
        // Non-repeating interval variation — never the same pattern twice
        const intervalNoise = longCycleNoise(frame * 0.05, star.seed);
        const interval = Math.max(60, star.baseInterval + Math.floor(intervalNoise * 80));
        const progress = (frame % interval);
        if (progress >= star.duration) return null;

        const t = progress / star.duration;
        // Position varies per cycle using noise
        const cycleIndex = Math.floor(frame / interval);
        const posNoise1 = longCycleNoise(cycleIndex * 50, star.seed + 100);
        const posNoise2 = longCycleNoise(cycleIndex * 50, star.seed + 200);
        const angleNoise = longCycleNoise(cycleIndex * 50, star.seed + 300);

        const sx = star.startX + posNoise1 * 400;
        const sy = star.startY + posNoise2 * 150;
        const angle = star.angle + angleNoise * 0.4;
        const dist = star.length * t;
        const currentX = sx + Math.cos(angle) * dist;
        const currentY = sy + Math.sin(angle) * dist;
        const tailX = currentX - Math.cos(angle) * star.tailLength;
        const tailY = currentY - Math.sin(angle) * star.tailLength;
        const opacity = star.brightness * (t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8);

        return (
          <g key={si} opacity={opacity}>
            {/* Glow trail */}
            <line x1={tailX} y1={tailY} x2={currentX} y2={currentY}
              stroke="#8888FF" strokeWidth={4} opacity={0.12} />
            {/* Core streak */}
            <line x1={tailX} y1={tailY} x2={currentX} y2={currentY}
              stroke="white" strokeWidth={1.5} opacity={0.8} />
            {/* Head */}
            <circle cx={currentX} cy={currentY} r={1.8} fill="white" opacity={0.9} />
            <circle cx={currentX} cy={currentY} r={5} fill="white" opacity={0.1} />
          </g>
        );
      })}

      {/* Atmospheric haze — very subtle dark blue */}
      <AtmosphericHaze color="#0E1828" intensity={0.4} horizonY={0.88} id={ID} />

      {/* Horizon light pollution hint — very faint */}
      <defs>
        <linearGradient id={`${ID}-lp`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#283848" stopOpacity={0} />
          <stop offset="90%" stopColor="#283848" stopOpacity={0} />
          <stop offset="100%" stopColor="#283848" stopOpacity={0.08} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-lp)`} />
    </svg>
  );
};

export default NightStars;
