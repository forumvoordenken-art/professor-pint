/**
 * HorizonMatcher — Atmospheric blending between sky and terrain layers
 *
 * The biggest visual risk is a "collage look" where sky and terrain feel
 * like separate cutouts pasted together. HorizonMatcher solves this with:
 *
 * 1. Atmospheric haze band at the horizon line (where sky meets terrain)
 * 2. Color bleeding: sky color gently tints the top of the terrain
 * 3. Light spill: warm/cool light from the sky influences terrain colors
 *
 * Usage: Place HorizonMatcher between sky and terrain layers in a scene.
 *
 * NOTE: This is a scene-level component, not per-asset. It only makes
 * sense when sky and terrain are composed together.
 */

import React from 'react';
import { longCycleNoise } from '../assets/skies/SkyEngine';

// ─── Horizon mood presets ────────────────────────────────

export type HorizonMood =
  | 'day_warm'     // Clear/cloudy day — warm golden haze
  | 'day_cool'     // Hazy/overcast — cool blue-gray
  | 'dawn'         // Golden hour — rich warm tones
  | 'sunset_warm'  // Warm sunset — orange/pink bleed
  | 'sunset_cold'  // Cold sunset — purple/blue bleed
  | 'dusk'         // Red dusk — deep warm haze
  | 'night'        // Night — dark blue, minimal haze
  | 'storm'        // Storm — heavy gray-green haze
  | 'sand'         // Desert — warm ochre haze
  | 'indoor';      // Indoor — no horizon effect

interface HorizonConfig {
  /** Primary haze color at horizon */
  hazeColor: string;
  /** Secondary haze tint (for gradient) */
  hazeTint: string;
  /** Light spill color bleeding onto terrain */
  lightSpill: string;
  /** Haze opacity (0-1) */
  hazeOpacity: number;
  /** Light spill opacity */
  spillOpacity: number;
  /** Vertical extent of haze in px (from horizon center) */
  hazeHeight: number;
  /** Vertical extent of light spill on terrain */
  spillHeight: number;
  /** Dust particles amount (0 = none) */
  dustAmount: number;
  /** Dust color */
  dustColor: string;
}

const HORIZON_CONFIGS: Record<HorizonMood, HorizonConfig> = {
  day_warm: {
    hazeColor: 'rgba(200, 210, 230, 0.35)',
    hazeTint: 'rgba(240, 235, 220, 0.2)',
    lightSpill: 'rgba(255, 248, 230, 0.15)',
    hazeOpacity: 0.4,
    spillOpacity: 0.12,
    hazeHeight: 120,
    spillHeight: 180,
    dustAmount: 8,
    dustColor: 'rgba(255, 250, 240, 0.08)',
  },
  day_cool: {
    hazeColor: 'rgba(180, 195, 215, 0.4)',
    hazeTint: 'rgba(200, 210, 225, 0.25)',
    lightSpill: 'rgba(210, 220, 235, 0.12)',
    hazeOpacity: 0.45,
    spillOpacity: 0.10,
    hazeHeight: 140,
    spillHeight: 160,
    dustAmount: 4,
    dustColor: 'rgba(200, 210, 225, 0.06)',
  },
  dawn: {
    hazeColor: 'rgba(255, 220, 160, 0.45)',
    hazeTint: 'rgba(255, 200, 140, 0.3)',
    lightSpill: 'rgba(255, 230, 180, 0.2)',
    hazeOpacity: 0.5,
    spillOpacity: 0.18,
    hazeHeight: 150,
    spillHeight: 220,
    dustAmount: 12,
    dustColor: 'rgba(255, 240, 200, 0.1)',
  },
  sunset_warm: {
    hazeColor: 'rgba(255, 180, 120, 0.5)',
    hazeTint: 'rgba(255, 160, 100, 0.35)',
    lightSpill: 'rgba(255, 200, 140, 0.22)',
    hazeOpacity: 0.55,
    spillOpacity: 0.2,
    hazeHeight: 160,
    spillHeight: 250,
    dustAmount: 15,
    dustColor: 'rgba(255, 200, 150, 0.12)',
  },
  sunset_cold: {
    hazeColor: 'rgba(180, 140, 200, 0.45)',
    hazeTint: 'rgba(160, 130, 190, 0.3)',
    lightSpill: 'rgba(200, 170, 220, 0.18)',
    hazeOpacity: 0.5,
    spillOpacity: 0.15,
    hazeHeight: 140,
    spillHeight: 200,
    dustAmount: 10,
    dustColor: 'rgba(200, 180, 220, 0.08)',
  },
  dusk: {
    hazeColor: 'rgba(200, 120, 100, 0.5)',
    hazeTint: 'rgba(180, 100, 80, 0.35)',
    lightSpill: 'rgba(220, 150, 120, 0.2)',
    hazeOpacity: 0.5,
    spillOpacity: 0.18,
    hazeHeight: 130,
    spillHeight: 200,
    dustAmount: 10,
    dustColor: 'rgba(200, 140, 120, 0.1)',
  },
  night: {
    hazeColor: 'rgba(40, 50, 80, 0.3)',
    hazeTint: 'rgba(30, 40, 70, 0.2)',
    lightSpill: 'rgba(60, 70, 100, 0.1)',
    hazeOpacity: 0.25,
    spillOpacity: 0.08,
    hazeHeight: 80,
    spillHeight: 120,
    dustAmount: 0,
    dustColor: 'transparent',
  },
  storm: {
    hazeColor: 'rgba(100, 110, 100, 0.55)',
    hazeTint: 'rgba(80, 90, 85, 0.4)',
    lightSpill: 'rgba(120, 130, 120, 0.15)',
    hazeOpacity: 0.6,
    spillOpacity: 0.12,
    hazeHeight: 180,
    spillHeight: 250,
    dustAmount: 6,
    dustColor: 'rgba(120, 130, 120, 0.08)',
  },
  sand: {
    hazeColor: 'rgba(220, 190, 140, 0.55)',
    hazeTint: 'rgba(210, 180, 130, 0.4)',
    lightSpill: 'rgba(230, 210, 170, 0.2)',
    hazeOpacity: 0.55,
    spillOpacity: 0.18,
    hazeHeight: 170,
    spillHeight: 230,
    dustAmount: 20,
    dustColor: 'rgba(220, 200, 160, 0.15)',
  },
  indoor: {
    hazeColor: 'transparent',
    hazeTint: 'transparent',
    lightSpill: 'transparent',
    hazeOpacity: 0,
    spillOpacity: 0,
    hazeHeight: 0,
    spillHeight: 0,
    dustAmount: 0,
    dustColor: 'transparent',
  },
};

// ─── Curated sky+terrain → mood mapping ─────────────────

/**
 * Maps known sky IDs to their horizon mood for automatic matching.
 * When composing a scene, HorizonMatcher can auto-detect the right mood.
 */
export const SKY_MOOD_MAP: Record<string, HorizonMood> = {
  sky_day_clear: 'day_warm',
  sky_day_cloudy: 'day_cool',
  sky_day_hazy: 'day_cool',
  sky_day_tropical: 'day_warm',
  sky_dawn_golden: 'dawn',
  sky_sunset_warm: 'sunset_warm',
  sky_sunset_cold: 'sunset_cold',
  sky_dusk_red: 'dusk',
  sky_night_stars: 'night',
  sky_night_moon: 'night',
  sky_night_aurora: 'night',
  sky_storm_dark: 'storm',
  sky_storm_rain: 'storm',
  sky_sandstorm: 'sand',
  sky_indoor_ceiling: 'indoor',
};

// ─── Curated combos for showcase ────────────────────────

export interface SkyTerrainCombo {
  skyId: string;
  terrainId: string;
  label: string;
  mood: HorizonMood;
}

/**
 * Hand-picked sky+terrain combos that make visual sense together.
 * Used for the CombinedShowcase to evaluate cohesion.
 */
export const CURATED_COMBOS: SkyTerrainCombo[] = [
  { skyId: 'sky_day_clear', terrainId: 'terrain_grass_plain', label: 'Summer Meadow', mood: 'day_warm' },
  { skyId: 'sky_day_cloudy', terrainId: 'terrain_grass_hill', label: 'English Countryside', mood: 'day_cool' },
  { skyId: 'sky_dawn_golden', terrainId: 'terrain_river_bank', label: 'Golden River Dawn', mood: 'dawn' },
  { skyId: 'sky_sunset_warm', terrainId: 'terrain_sea_shore', label: 'Beach Sunset', mood: 'sunset_warm' },
  { skyId: 'sky_sunset_cold', terrainId: 'terrain_rocky_mountain', label: 'Mountain Twilight', mood: 'sunset_cold' },
  { skyId: 'sky_dusk_red', terrainId: 'terrain_camp_ground', label: 'Camp at Dusk', mood: 'dusk' },
  { skyId: 'sky_night_stars', terrainId: 'terrain_sand_dunes', label: 'Desert Night', mood: 'night' },
  { skyId: 'sky_night_moon', terrainId: 'terrain_snow_field', label: 'Moonlit Snow', mood: 'night' },
  { skyId: 'sky_storm_dark', terrainId: 'terrain_cliff_edge', label: 'Storm Cliff', mood: 'storm' },
  { skyId: 'sky_storm_rain', terrainId: 'terrain_cobblestone', label: 'Rain on Cobbles', mood: 'storm' },
  { skyId: 'sky_sandstorm', terrainId: 'terrain_sand_flat', label: 'Sahara Sandstorm', mood: 'sand' },
  { skyId: 'sky_day_tropical', terrainId: 'terrain_jungle_floor', label: 'Tropical Jungle', mood: 'day_warm' },
  { skyId: 'sky_day_hazy', terrainId: 'terrain_dirt_plain', label: 'Dusty Plains', mood: 'day_cool' },
  { skyId: 'sky_night_aurora', terrainId: 'terrain_snow_field', label: 'Aurora Snow', mood: 'night' },
  { skyId: 'sky_indoor_ceiling', terrainId: 'terrain_indoor_floor', label: 'Indoor Scene', mood: 'indoor' },
];

// ─── Main component ─────────────────────────────────────

export interface HorizonMatcherProps {
  mood: HorizonMood;
  frame: number;
  /** Y position of horizon line (default: 540 = center) */
  horizonY?: number;
  /** Override opacity multiplier (default: 1.0) */
  intensity?: number;
}

/**
 * HorizonMatcher — SVG overlay that blends sky and terrain at the horizon.
 *
 * Place this between the sky and terrain layers:
 *   <Sky />
 *   <HorizonMatcher mood="day_warm" frame={frame} />
 *   <Terrain />
 */
export const HorizonMatcher: React.FC<HorizonMatcherProps> = ({
  mood,
  frame,
  horizonY = 540,
  intensity = 1.0,
}) => {
  const cfg = HORIZON_CONFIGS[mood];
  if (mood === 'indoor' || cfg.hazeOpacity === 0) return null;

  // Gentle animation — haze drifts slightly
  const drift = longCycleNoise(frame, 42) * 8;
  const opacityPulse = 1 + longCycleNoise(frame, 77) * 0.05;

  const hazeTop = horizonY - cfg.hazeHeight;
  const hazeBottom = horizonY + cfg.hazeHeight;
  const spillBottom = horizonY + cfg.spillHeight;

  // Generate deterministic dust particles
  const dustParticles = [];
  if (cfg.dustAmount > 0) {
    let seed = 12345;
    const nextRand = () => {
      seed = (seed * 16807 + 0) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < cfg.dustAmount; i++) {
      const baseX = nextRand() * 1920;
      const baseY = horizonY - cfg.hazeHeight * 0.5 + nextRand() * cfg.hazeHeight;
      const size = 1.5 + nextRand() * 3;
      const driftX = longCycleNoise(frame, i * 13 + 100) * 30;
      const driftY = longCycleNoise(frame, i * 17 + 200) * 10;
      const particleOpacity = 0.3 + nextRand() * 0.5;

      dustParticles.push(
        <circle
          key={`dust-${i}`}
          cx={baseX + driftX}
          cy={baseY + driftY}
          r={size}
          fill={cfg.dustColor}
          opacity={particleOpacity * intensity * opacityPulse}
        />
      );
    }
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Main atmospheric haze gradient */}
          <linearGradient id={`horizon-haze-${mood}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={cfg.hazeTint} stopOpacity={0} />
            <stop offset="30%" stopColor={cfg.hazeColor} stopOpacity={cfg.hazeOpacity * intensity * opacityPulse} />
            <stop offset="50%" stopColor={cfg.hazeColor} stopOpacity={cfg.hazeOpacity * 0.85 * intensity * opacityPulse} />
            <stop offset="70%" stopColor={cfg.hazeTint} stopOpacity={cfg.hazeOpacity * 0.5 * intensity * opacityPulse} />
            <stop offset="100%" stopColor={cfg.hazeTint} stopOpacity={0} />
          </linearGradient>

          {/* Light spill gradient (bleeds down onto terrain) */}
          <linearGradient id={`horizon-spill-${mood}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={cfg.lightSpill} stopOpacity={cfg.spillOpacity * intensity} />
            <stop offset="100%" stopColor={cfg.lightSpill} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Atmospheric haze band */}
        <rect
          x={0}
          y={hazeTop + drift}
          width={1920}
          height={hazeBottom - hazeTop}
          fill={`url(#horizon-haze-${mood})`}
        />

        {/* Light spill on terrain */}
        <rect
          x={0}
          y={horizonY}
          width={1920}
          height={spillBottom - horizonY}
          fill={`url(#horizon-spill-${mood})`}
          opacity={opacityPulse}
        />

        {/* Dust particles */}
        {dustParticles}
      </svg>
    </div>
  );
};

export { HORIZON_CONFIGS };
export type { HorizonConfig };
