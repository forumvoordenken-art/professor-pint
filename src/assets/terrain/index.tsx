/**
 * Terrain Assets — Registration index
 *
 * Registers all 15 terrain assets with the SceneComposer asset registry.
 * Import this file to make all terrains available for scene composition.
 *
 * Naming convention: terrain_[category]_[variant]
 * Categories: grass, sand, earth, stone, snow, jungle, water, camp, indoor, cliff, abstract
 */

import { registerAsset } from '../../motor/SceneComposer';

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

// ─── Register all terrains ───────────────────────────────

registerAsset('terrain_grass_plain', GrassPlain);
registerAsset('terrain_grass_hill', GrassHill);
registerAsset('terrain_sand_flat', SandFlat);
registerAsset('terrain_sand_dunes', SandDunes);
registerAsset('terrain_dirt_plain', DirtPlain);
registerAsset('terrain_cobblestone', Cobblestone);
registerAsset('terrain_rocky_mountain', RockyMountain);
registerAsset('terrain_snow_field', SnowField);
registerAsset('terrain_jungle_floor', JungleFloor);
registerAsset('terrain_river_bank', RiverBank);
registerAsset('terrain_sea_shore', SeaShore);
registerAsset('terrain_camp_ground', CampGround);
registerAsset('terrain_indoor_floor', IndoorFloor);
registerAsset('terrain_cliff_edge', CliffEdge);
registerAsset('terrain_abstract_plane', AbstractPlane);

// ─── Export list for showcase/manifest ────────────────────

export const TERRAIN_ASSETS = [
  { id: 'terrain_grass_plain', name: 'Grass Plain', category: 'grass', component: GrassPlain },
  { id: 'terrain_grass_hill', name: 'Grass Hills', category: 'grass', component: GrassHill },
  { id: 'terrain_sand_flat', name: 'Flat Sand', category: 'sand', component: SandFlat },
  { id: 'terrain_sand_dunes', name: 'Sand Dunes', category: 'sand', component: SandDunes },
  { id: 'terrain_dirt_plain', name: 'Dirt Plain', category: 'earth', component: DirtPlain },
  { id: 'terrain_cobblestone', name: 'Cobblestone', category: 'stone', component: Cobblestone },
  { id: 'terrain_rocky_mountain', name: 'Rocky Mountain', category: 'stone', component: RockyMountain },
  { id: 'terrain_snow_field', name: 'Snow Field', category: 'snow', component: SnowField },
  { id: 'terrain_jungle_floor', name: 'Jungle Floor', category: 'jungle', component: JungleFloor },
  { id: 'terrain_river_bank', name: 'River Bank', category: 'water', component: RiverBank },
  { id: 'terrain_sea_shore', name: 'Sea Shore', category: 'water', component: SeaShore },
  { id: 'terrain_camp_ground', name: 'Camp Ground', category: 'camp', component: CampGround },
  { id: 'terrain_indoor_floor', name: 'Indoor Floor', category: 'indoor', component: IndoorFloor },
  { id: 'terrain_cliff_edge', name: 'Cliff Edge', category: 'special', component: CliffEdge },
  { id: 'terrain_abstract_plane', name: 'Abstract Plane', category: 'special', component: AbstractPlane },
] as const;

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
