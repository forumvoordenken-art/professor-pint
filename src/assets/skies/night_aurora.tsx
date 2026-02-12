/**
 * night_aurora — Noorderlicht, groen/paars banden, magisch.
 *
 * Vikingen, poolgebied, magische/mythische scenes.
 * Animated aurora borealis curtains — green and purple.
 * Rich starfield visible through the aurora.
 * Dark landscape silhouette implied by very dark horizon.
 * Subtle color ripple animation on the aurora bands.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GradientSky,
  StarField,
  AtmosphericHaze,
  generateStars,
} from './SkyEngine';

const ID = 'night-aurora';

// Arctic night palette — very dark with subtle green-blue at horizon
const SKY_STOPS = [
  { offset: '0%', color: '#020408' },        // almost black
  { offset: '15%', color: '#040810' },       // very dark blue
  { offset: '35%', color: '#060C18' },       // dark navy
  { offset: '55%', color: '#081020' },       // navy
  { offset: '75%', color: '#0A1428' },       // blue-navy
  { offset: '88%', color: '#0E1830' },       // horizon hint
  { offset: '100%', color: '#101C28' },      // dark horizon
];

// Rich starfield — arctic skies are very clear
const STARS_BG = generateStars(100, 401, 600, 0.03);
const STARS_MED = generateStars(50, 402, 550, 0.08);
const STARS_BRIGHT = generateStars(20, 403, 500, 0.15);

// Aurora curtain definition
interface AuroraCurtain {
  yCenter: number;
  amplitude: number;
  wavelength: number;
  width: number;
  speed: number;
  phase: number;
  color: string;
  glowColor: string;
  opacity: number;
}

const AURORA_CURTAINS: AuroraCurtain[] = [
  // Main green curtain — brightest
  { yCenter: 280, amplitude: 60, wavelength: 400, width: 80, speed: 0.015, phase: 0,
    color: '#30C850', glowColor: '#20A040', opacity: 0.25 },
  // Secondary green — offset
  { yCenter: 320, amplitude: 45, wavelength: 350, width: 60, speed: 0.012, phase: 1.5,
    color: '#28B848', glowColor: '#18A038', opacity: 0.18 },
  // Purple fringe — top edge of main curtain
  { yCenter: 200, amplitude: 50, wavelength: 450, width: 50, speed: 0.018, phase: 0.5,
    color: '#8040C0', glowColor: '#6030A0', opacity: 0.15 },
  // Pink/magenta accent
  { yCenter: 240, amplitude: 40, wavelength: 380, width: 35, speed: 0.02, phase: 2.0,
    color: '#C040A0', glowColor: '#A03080', opacity: 0.1 },
  // Faint green lower curtain
  { yCenter: 400, amplitude: 35, wavelength: 500, width: 100, speed: 0.01, phase: 3.0,
    color: '#20A040', glowColor: '#188830', opacity: 0.12 },
  // Very faint high purple
  { yCenter: 150, amplitude: 30, wavelength: 300, width: 40, speed: 0.022, phase: 1.0,
    color: '#6030A0', glowColor: '#502888', opacity: 0.08 },
];

export const NightAurora: React.FC<AssetProps> = ({ frame }) => {
  // Generate aurora curtain paths
  const auroraPaths = useMemo(() => {
    return AURORA_CURTAINS.map((curtain) => {
      // Pre-compute path control points for wave shape
      const points = 24;
      const step = 1920 / points;
      return { curtain, step, points };
    });
  }, []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Base gradient — arctic dark */}
      <GradientSky id={`${ID}-base`} stops={SKY_STOPS} />

      {/* Background stars — visible through aurora */}
      <g opacity={0.5}>
        <StarField stars={STARS_BG} frame={frame} twinkleSpeed={0.03} />
      </g>
      <g opacity={0.7}>
        <StarField stars={STARS_MED} frame={frame} twinkleSpeed={0.04} />
      </g>
      <StarField stars={STARS_BRIGHT} frame={frame} twinkleSpeed={0.05} />

      {/* Aurora glow — overall atmospheric green glow */}
      <defs>
        <radialGradient id={`${ID}-aglow`} cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#20A040" stopOpacity={0.06} />
          <stop offset="50%" stopColor="#18803A" stopOpacity={0.03} />
          <stop offset="100%" stopColor="#18803A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={800} fill={`url(#${ID}-aglow)`} />

      {/* Aurora curtains — animated wave bands */}
      {auroraPaths.map(({ curtain, step, points }, ci) => {
        // Build wave path with animated phase
        const animPhase = frame * curtain.speed + curtain.phase;
        let topPath = 'M0,';
        let bottomPath = '';
        const topPoints: string[] = [];
        const bottomPoints: string[] = [];

        for (let p = 0; p <= points; p++) {
          const x = p * step;
          const wave = Math.sin((x / curtain.wavelength) * Math.PI * 2 + animPhase);
          const wave2 = Math.sin((x / (curtain.wavelength * 0.7)) * Math.PI * 2 + animPhase * 1.3) * 0.3;
          const yOffset = (wave + wave2) * curtain.amplitude;
          const topY = curtain.yCenter + yOffset - curtain.width / 2;
          const botY = curtain.yCenter + yOffset + curtain.width / 2;
          topPoints.push(`${x},${topY}`);
          bottomPoints.unshift(`${x},${botY}`);
        }

        topPath = `M${topPoints[0]} ` + topPoints.slice(1).map(p => `L${p}`).join(' ');
        bottomPath = bottomPoints.map(p => `L${p}`).join(' ');
        const fullPath = `${topPath} ${bottomPath} Z`;

        return (
          <g key={ci}>
            {/* Curtain glow — wider, softer */}
            <defs>
              <linearGradient id={`${ID}-curt-${ci}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={curtain.color} stopOpacity={0} />
                <stop offset="30%" stopColor={curtain.color} stopOpacity={curtain.opacity * 0.7} />
                <stop offset="50%" stopColor={curtain.color} stopOpacity={curtain.opacity} />
                <stop offset="70%" stopColor={curtain.glowColor} stopOpacity={curtain.opacity * 0.7} />
                <stop offset="100%" stopColor={curtain.glowColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={fullPath} fill={`url(#${ID}-curt-${ci})`} />

            {/* Bright core line — along the center of each curtain */}
            <g opacity={curtain.opacity * 0.6}>
              {(() => {
                const corePath = topPoints.map((tp, i) => {
                  const [x] = tp.split(',').map(Number);
                  const topY = Number(tp.split(',')[1]);
                  const botY = Number(bottomPoints[points - i]?.split(',')[1] ?? topY);
                  const midY = (topY + botY) / 2;
                  return i === 0 ? `M${x},${midY}` : `L${x},${midY}`;
                }).join(' ');
                return (
                  <path d={corePath} fill="none" stroke={curtain.color}
                    strokeWidth={2} opacity={0.4} />
                );
              })()}
            </g>
          </g>
        );
      })}

      {/* Aurora reflection on low clouds / horizon */}
      <defs>
        <linearGradient id={`${ID}-reflect`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20A040" stopOpacity={0} />
          <stop offset="80%" stopColor="#20A040" stopOpacity={0} />
          <stop offset="95%" stopColor="#20A040" stopOpacity={0.04} />
          <stop offset="100%" stopColor="#18803A" stopOpacity={0.06} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-reflect)`} />

      {/* Subtle purple reflection */}
      <defs>
        <linearGradient id={`${ID}-preflect`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6030A0" stopOpacity={0} />
          <stop offset="85%" stopColor="#6030A0" stopOpacity={0} />
          <stop offset="100%" stopColor="#6030A0" stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-preflect)`} />

      {/* Atmospheric haze — very dark, cold */}
      <AtmosphericHaze color="#0A1020" intensity={0.4} horizonY={0.9} id={ID} />

      {/* Dark vignette — focus on the aurora */}
      <defs>
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <stop offset="65%" stopColor="#000000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default NightAurora;
