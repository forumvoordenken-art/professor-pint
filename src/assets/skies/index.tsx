/**
 * Sky Assets — Registration index
 *
 * Registers all 15 sky assets with the SceneComposer asset registry.
 * Import this file to make all skies available for scene composition.
 *
 * Naming convention: sky_[category]_[variant]
 * Categories: day, dawn, sunset, dusk, night, storm, sand, indoor
 */

import React from 'react';
import { registerAsset } from '../../motor/SceneComposer';
import type { AssetProps } from '../../motor/SceneComposer';

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

// ─── Register all skies ───────────────────────────────────

// IndoorCeiling has a slightly different prop signature (frame only)
// so we wrap it to match AssetProps
const IndoorCeilingWrapped: React.FC<AssetProps> = ({ frame }) => (
  <IndoorCeiling frame={frame} />
);

registerAsset('sky_day_clear', DayClear);
registerAsset('sky_day_cloudy', DayCloudy);
registerAsset('sky_day_hazy', DayHazy);
registerAsset('sky_day_tropical', DayTropical);
registerAsset('sky_dawn_golden', DawnGolden);
registerAsset('sky_sunset_warm', SunsetWarm);
registerAsset('sky_sunset_cold', SunsetCold);
registerAsset('sky_dusk_red', DuskRed);
registerAsset('sky_night_stars', NightStars);
registerAsset('sky_night_moon', NightMoon);
registerAsset('sky_night_aurora', NightAurora);
registerAsset('sky_storm_dark', StormDark);
registerAsset('sky_storm_rain', StormRain);
registerAsset('sky_sandstorm', Sandstorm);
registerAsset('sky_indoor_ceiling', IndoorCeilingWrapped);

// ─── Export list for showcase/manifest ────────────────────

export const SKY_ASSETS = [
  { id: 'sky_day_clear', name: 'Clear Day', category: 'day', component: DayClear },
  { id: 'sky_day_cloudy', name: 'Cloudy Day', category: 'day', component: DayCloudy },
  { id: 'sky_day_hazy', name: 'Hazy Day', category: 'day', component: DayHazy },
  { id: 'sky_day_tropical', name: 'Tropical Day', category: 'day', component: DayTropical },
  { id: 'sky_dawn_golden', name: 'Golden Dawn', category: 'twilight', component: DawnGolden },
  { id: 'sky_sunset_warm', name: 'Warm Sunset', category: 'twilight', component: SunsetWarm },
  { id: 'sky_sunset_cold', name: 'Cold Sunset', category: 'twilight', component: SunsetCold },
  { id: 'sky_dusk_red', name: 'Red Dusk', category: 'twilight', component: DuskRed },
  { id: 'sky_night_stars', name: 'Starry Night', category: 'night', component: NightStars },
  { id: 'sky_night_moon', name: 'Moonlit Night', category: 'night', component: NightMoon },
  { id: 'sky_night_aurora', name: 'Aurora Night', category: 'night', component: NightAurora },
  { id: 'sky_storm_dark', name: 'Dark Storm', category: 'storm', component: StormDark },
  { id: 'sky_storm_rain', name: 'Rain Storm', category: 'storm', component: StormRain },
  { id: 'sky_sandstorm', name: 'Sandstorm', category: 'special', component: Sandstorm },
  { id: 'sky_indoor_ceiling', name: 'Indoor Ceiling', category: 'special', component: IndoorCeilingWrapped },
] as const;

export {
  DayClear, DayCloudy, DayHazy, DayTropical,
  DawnGolden, SunsetWarm, SunsetCold, DuskRed,
  NightStars, NightMoon, NightAurora,
  StormDark, StormRain,
  Sandstorm, IndoorCeiling,
};
