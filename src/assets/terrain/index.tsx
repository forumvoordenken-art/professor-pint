/**
 * Terrain Assets — Registration index
 *
 * Registers all 15 terrain assets with the SceneComposer asset registry.
 * Import this file to make all terrains available for scene composition.
 *
 * Each terrain is wrapped with withAssetPaint for per-asset painterly effects
 * (edge displacement + canvas grain + edge roughening), tuned per terrain type.
 *
 * Naming convention: terrain_[category]_[variant]
 * Categories: grass, sand, earth, stone, snow, jungle, water, camp, indoor, cliff, abstract
 */

import { registerAsset } from '../../motor/SceneComposer';
import { withAssetPaint } from '../../motor/withAssetPaint';

// ─── Grasland (2) ─────────────────────────────────────────
import { GrassPlain } from './grass_plain';
import { GrassHill } from './grass_hill';

// ─── Zand (2) ─────────────────────────────────────────────
import { SandFlat } from './sand_flat';
import { SandDunes } from './sand_dunes';

// ─── Aarde (1) ────────────────────────────────────────────
import { DirtPlain } from './dirt_plain';

// ─── Steen (2) ────────────────────────────────────────────
import { Cobblestone } from './cobblestone';
import { RockyMountain } from './rocky_mountain';

// ─── Sneeuw (1) ───────────────────────────────────────────
import { SnowField } from './snow_field';

// ─── Jungle (1) ───────────────────────────────────────────
import { JungleFloor } from './jungle_floor';

// ─── Water (2) ────────────────────────────────────────────
import { RiverBank } from './river_bank';
import { SeaShore } from './sea_shore';

// ─── Menselijk (1) ───────────────────────────────────────
import { CampGround } from './camp_ground';

// ─── Indoor (1) ───────────────────────────────────────────
import { IndoorFloor } from './indoor_floor';

// ─── Speciaal (2) ─────────────────────────────────────────
import { CliffEdge } from './cliff_edge';
import { AbstractPlane } from './abstract_plane';

// ─── Wrap with per-asset paint effects ───────────────────

// Terrain: heavier displacement + edge roughening for organic feel
const PaintedGrassPlain     = withAssetPaint(GrassPlain, 'terrain', 'grass-plain');
const PaintedGrassHill      = withAssetPaint(GrassHill, 'terrain', 'grass-hill');
const PaintedSandFlat       = withAssetPaint(SandFlat, 'terrain', 'sand-flat');
const PaintedSandDunes      = withAssetPaint(SandDunes, 'terrain', 'sand-dunes');
const PaintedDirtPlain      = withAssetPaint(DirtPlain, 'terrain', 'dirt-plain');
const PaintedCobblestone    = withAssetPaint(Cobblestone, 'terrain', 'cobblestone');
const PaintedRockyMountain  = withAssetPaint(RockyMountain, 'terrain', 'rocky-mountain');
const PaintedSnowField      = withAssetPaint(SnowField, 'terrain', 'snow-field');
const PaintedJungleFloor    = withAssetPaint(JungleFloor, 'terrain', 'jungle-floor');
const PaintedRiverBank      = withAssetPaint(RiverBank, 'terrain', 'river-bank');
const PaintedSeaShore       = withAssetPaint(SeaShore, 'terrain', 'sea-shore');
const PaintedCampGround     = withAssetPaint(CampGround, 'terrain', 'camp-ground');
const PaintedCliffEdge      = withAssetPaint(CliffEdge, 'terrain', 'cliff-edge');
const PaintedAbstractPlane  = withAssetPaint(AbstractPlane, 'terrain', 'abstract-plane');

// Indoor: lighter treatment (already very detailed)
const PaintedIndoorFloor    = withAssetPaint(IndoorFloor, 'terrain_indoor', 'indoor-floor');

// ─── Register all terrains (painted versions) ───────────

registerAsset('terrain_grass_plain', PaintedGrassPlain);
registerAsset('terrain_grass_hill', PaintedGrassHill);
registerAsset('terrain_sand_flat', PaintedSandFlat);
registerAsset('terrain_sand_dunes', PaintedSandDunes);
registerAsset('terrain_dirt_plain', PaintedDirtPlain);
registerAsset('terrain_cobblestone', PaintedCobblestone);
registerAsset('terrain_rocky_mountain', PaintedRockyMountain);
registerAsset('terrain_snow_field', PaintedSnowField);
registerAsset('terrain_jungle_floor', PaintedJungleFloor);
registerAsset('terrain_river_bank', PaintedRiverBank);
registerAsset('terrain_sea_shore', PaintedSeaShore);
registerAsset('terrain_camp_ground', PaintedCampGround);
registerAsset('terrain_indoor_floor', PaintedIndoorFloor);
registerAsset('terrain_cliff_edge', PaintedCliffEdge);
registerAsset('terrain_abstract_plane', PaintedAbstractPlane);

// ─── Export list for showcase/manifest ────────────────────
// Showcase uses painted versions so preview matches final output

export const TERRAIN_ASSETS = [
  { id: 'terrain_grass_plain', name: 'Grass Plain', category: 'grass', component: PaintedGrassPlain },
  { id: 'terrain_grass_hill', name: 'Grass Hills', category: 'grass', component: PaintedGrassHill },
  { id: 'terrain_sand_flat', name: 'Flat Sand', category: 'sand', component: PaintedSandFlat },
  { id: 'terrain_sand_dunes', name: 'Sand Dunes', category: 'sand', component: PaintedSandDunes },
  { id: 'terrain_dirt_plain', name: 'Dirt Plain', category: 'earth', component: PaintedDirtPlain },
  { id: 'terrain_cobblestone', name: 'Cobblestone', category: 'stone', component: PaintedCobblestone },
  { id: 'terrain_rocky_mountain', name: 'Rocky Mountain', category: 'stone', component: PaintedRockyMountain },
  { id: 'terrain_snow_field', name: 'Snow Field', category: 'snow', component: PaintedSnowField },
  { id: 'terrain_jungle_floor', name: 'Jungle Floor', category: 'jungle', component: PaintedJungleFloor },
  { id: 'terrain_river_bank', name: 'River Bank', category: 'water', component: PaintedRiverBank },
  { id: 'terrain_sea_shore', name: 'Sea Shore', category: 'water', component: PaintedSeaShore },
  { id: 'terrain_camp_ground', name: 'Camp Ground', category: 'camp', component: PaintedCampGround },
  { id: 'terrain_indoor_floor', name: 'Indoor Floor', category: 'indoor', component: PaintedIndoorFloor },
  { id: 'terrain_cliff_edge', name: 'Cliff Edge', category: 'special', component: PaintedCliffEdge },
  { id: 'terrain_abstract_plane', name: 'Abstract Plane', category: 'special', component: PaintedAbstractPlane },
] as const;

// Raw exports (without paint effects) for cases where you need the original
export {
  GrassPlain, GrassHill,
  SandFlat, SandDunes,
  DirtPlain,
  Cobblestone, RockyMountain,
  SnowField,
  JungleFloor,
  RiverBank, SeaShore,
  CampGround,
  IndoorFloor,
  CliffEdge, AbstractPlane,
};
