/**
 * Sky Assets — Registration index
 *
 * Registers all 15 sky assets with the SceneComposer asset registry.
 * Import this file to make all skies available for scene composition.
 *
 * Each sky is wrapped with withAssetPaint for per-asset painterly effects
 * (edge displacement + canvas grain), tuned per sky category.
 *
 * Naming convention: sky_[category]_[variant]
 * Categories: day, dawn, sunset, dusk, night, storm, sand, indoor
 */

import React from 'react';
import { registerAsset } from '../../motor/SceneComposer';
import type { AssetProps } from '../../motor/SceneComposer';
import { withAssetPaint } from '../../motor/withAssetPaint';

// ─── Daglicht (4) ─────────────────────────────────────────
import { DayClear } from './day_clear';
import { DayCloudy } from './day_cloudy';
import { DayHazy } from './day_hazy';
import { DayTropical } from './day_tropical';

// ─── Schemering (4) ──────────────────────────────────────
import { DawnGolden } from './dawn_golden';
import { SunsetWarm } from './sunset_warm';
import { SunsetCold } from './sunset_cold';
import { DuskRed } from './dusk_red';

// ─── Nacht (3) ────────────────────────────────────────────
import { NightStars } from './night_stars';
import { NightMoon } from './night_moon';
import { NightAurora } from './night_aurora';

// ─── Storm (2) ────────────────────────────────────────────
import { StormDark } from './storm_dark';
import { StormRain } from './storm_rain';

// ─── Speciaal (2) ─────────────────────────────────────────
import { Sandstorm } from './sandstorm';
import { IndoorCeiling } from './indoor_ceiling';

// ─── Wrap with per-asset paint effects ───────────────────

// IndoorCeiling has a slightly different prop signature (frame only)
// so we wrap it to match AssetProps first
const IndoorCeilingWrapped: React.FC<AssetProps> = ({ frame }) => (
  <IndoorCeiling frame={frame} />
);

// Day skies: subtle displacement, light grain
const PaintedDayClear     = withAssetPaint(DayClear, 'sky_day', 'day-clear');
const PaintedDayCloudy    = withAssetPaint(DayCloudy, 'sky_day', 'day-cloudy');
const PaintedDayHazy      = withAssetPaint(DayHazy, 'sky_day', 'day-hazy');
const PaintedDayTropical  = withAssetPaint(DayTropical, 'sky_day', 'day-tropical');

// Twilight skies: more displacement, saturation boost for colors
const PaintedDawnGolden   = withAssetPaint(DawnGolden, 'sky_twilight', 'dawn-golden');
const PaintedSunsetWarm   = withAssetPaint(SunsetWarm, 'sky_twilight', 'sunset-warm');
const PaintedSunsetCold   = withAssetPaint(SunsetCold, 'sky_twilight', 'sunset-cold');
const PaintedDuskRed      = withAssetPaint(DuskRed, 'sky_twilight', 'dusk-red');

// Night skies: very subtle — don't blur stars
const PaintedNightStars   = withAssetPaint(NightStars, 'sky_night', 'night-stars');
const PaintedNightMoon    = withAssetPaint(NightMoon, 'sky_night', 'night-moon');
const PaintedNightAurora  = withAssetPaint(NightAurora, 'sky_night', 'night-aurora');

// Storm skies: heavier displacement for dramatic clouds
const PaintedStormDark    = withAssetPaint(StormDark, 'sky_storm', 'storm-dark');
const PaintedStormRain    = withAssetPaint(StormRain, 'sky_storm', 'storm-rain');

// Special skies
const PaintedSandstorm    = withAssetPaint(Sandstorm, 'sky_special', 'sandstorm');
const PaintedIndoorCeiling = withAssetPaint(IndoorCeilingWrapped, 'sky_special', 'indoor-ceiling');

// ─── Register all skies (painted versions) ──────────────

registerAsset('sky_day_clear', PaintedDayClear);
registerAsset('sky_day_cloudy', PaintedDayCloudy);
registerAsset('sky_day_hazy', PaintedDayHazy);
registerAsset('sky_day_tropical', PaintedDayTropical);
registerAsset('sky_dawn_golden', PaintedDawnGolden);
registerAsset('sky_sunset_warm', PaintedSunsetWarm);
registerAsset('sky_sunset_cold', PaintedSunsetCold);
registerAsset('sky_dusk_red', PaintedDuskRed);
registerAsset('sky_night_stars', PaintedNightStars);
registerAsset('sky_night_moon', PaintedNightMoon);
registerAsset('sky_night_aurora', PaintedNightAurora);
registerAsset('sky_storm_dark', PaintedStormDark);
registerAsset('sky_storm_rain', PaintedStormRain);
registerAsset('sky_sandstorm', PaintedSandstorm);
registerAsset('sky_indoor_ceiling', PaintedIndoorCeiling);

// ─── Export list for showcase/manifest ────────────────────
// Showcase uses painted versions so preview matches final output

export const SKY_ASSETS = [
  { id: 'sky_day_clear', name: 'Clear Day', category: 'day', component: PaintedDayClear },
  { id: 'sky_day_cloudy', name: 'Cloudy Day', category: 'day', component: PaintedDayCloudy },
  { id: 'sky_day_hazy', name: 'Hazy Day', category: 'day', component: PaintedDayHazy },
  { id: 'sky_day_tropical', name: 'Tropical Day', category: 'day', component: PaintedDayTropical },
  { id: 'sky_dawn_golden', name: 'Golden Dawn', category: 'twilight', component: PaintedDawnGolden },
  { id: 'sky_sunset_warm', name: 'Warm Sunset', category: 'twilight', component: PaintedSunsetWarm },
  { id: 'sky_sunset_cold', name: 'Cold Sunset', category: 'twilight', component: PaintedSunsetCold },
  { id: 'sky_dusk_red', name: 'Red Dusk', category: 'twilight', component: PaintedDuskRed },
  { id: 'sky_night_stars', name: 'Starry Night', category: 'night', component: PaintedNightStars },
  { id: 'sky_night_moon', name: 'Moonlit Night', category: 'night', component: PaintedNightMoon },
  { id: 'sky_night_aurora', name: 'Aurora Night', category: 'night', component: PaintedNightAurora },
  { id: 'sky_storm_dark', name: 'Dark Storm', category: 'storm', component: PaintedStormDark },
  { id: 'sky_storm_rain', name: 'Rain Storm', category: 'storm', component: PaintedStormRain },
  { id: 'sky_sandstorm', name: 'Sandstorm', category: 'special', component: PaintedSandstorm },
  { id: 'sky_indoor_ceiling', name: 'Indoor Ceiling', category: 'special', component: PaintedIndoorCeiling },
] as const;

// Raw exports (without paint effects) for cases where you need the original
export {
  DayClear, DayCloudy, DayHazy, DayTropical,
  DawnGolden, SunsetWarm, SunsetCold, DuskRed,
  NightStars, NightMoon, NightAurora,
  StormDark, StormRain,
  Sandstorm, IndoorCeiling,
};
