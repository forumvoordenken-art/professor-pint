// SceneDatabase: Store and retrieve approved scenes for reuse
// Saves scene definitions as JSON so Claude can reuse them in future videos
// This reduces token usage and maintains consistency

import * as fs from 'fs';
import * as path from 'path';
import type { SceneData } from '../systems/SceneRenderer';
import type { CameraPathData } from '../systems/CameraPath';
import type { CrowdLayerConfig } from '../crowds/CrowdWorkers';

// ---- Types ----

export interface StoredScene {
  /** Unique identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** When this scene was approved */
  approvedAt: string;
  /** Tags for search */
  tags: string[];
  /** Background type */
  background: string;
  /** The scene data */
  sceneData: Partial<SceneData>;
  /** Camera path for this scene */
  cameraPath?: CameraPathData;
  /** Crowd configuration */
  crowdConfig?: CrowdLayerConfig;
  /** How many times this scene has been reused */
  reuseCount: number;
  /** User rating (1-5) */
  rating?: number;
  /** Notes from user feedback */
  notes?: string;
  /** Version - for tracking improvements */
  version: number;
}

export interface SceneDatabase {
  version: number;
  scenes: StoredScene[];
  /** Background-to-scene index for quick lookup */
  backgroundIndex: Record<string, string[]>;
  /** Tag-to-scene index for quick lookup */
  tagIndex: Record<string, string[]>;
}

// ---- Default database ----

const DEFAULT_DB: SceneDatabase = {
  version: 1,
  scenes: [],
  backgroundIndex: {},
  tagIndex: {},
};

// ---- Database operations ----

const DB_PATH = path.join(process.cwd(), 'data', 'scenes.json');

/**
 * Load the scene database from disk.
 */
export const loadSceneDatabase = (): SceneDatabase => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data) as SceneDatabase;
    }
  } catch (err) {
    console.warn('Failed to load scene database, using empty:', err);
  }
  return { ...DEFAULT_DB };
};

/**
 * Save the scene database to disk.
 */
export const saveSceneDatabase = (db: SceneDatabase): void => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
};

/**
 * Rebuild indexes after modifications.
 */
const rebuildIndexes = (db: SceneDatabase): void => {
  db.backgroundIndex = {};
  db.tagIndex = {};

  for (const scene of db.scenes) {
    // Background index
    if (!db.backgroundIndex[scene.background]) {
      db.backgroundIndex[scene.background] = [];
    }
    db.backgroundIndex[scene.background].push(scene.id);

    // Tag index
    for (const tag of scene.tags) {
      if (!db.tagIndex[tag]) {
        db.tagIndex[tag] = [];
      }
      db.tagIndex[tag].push(scene.id);
    }
  }
};

/**
 * Store a new approved scene.
 */
export const storeScene = (
  scene: Omit<StoredScene, 'id' | 'approvedAt' | 'reuseCount' | 'version'>,
): StoredScene => {
  const db = loadSceneDatabase();
  const stored: StoredScene = {
    ...scene,
    id: `scene-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    approvedAt: new Date().toISOString(),
    reuseCount: 0,
    version: 1,
  };
  db.scenes.push(stored);
  rebuildIndexes(db);
  saveSceneDatabase(db);
  return stored;
};

/**
 * Find scenes matching criteria.
 */
export const findScenes = (query: {
  background?: string;
  tags?: string[];
  minRating?: number;
}): StoredScene[] => {
  const db = loadSceneDatabase();
  let results = db.scenes;

  if (query.background) {
    const ids = db.backgroundIndex[query.background] ?? [];
    results = results.filter(s => ids.includes(s.id));
  }

  if (query.tags && query.tags.length > 0) {
    results = results.filter(scene =>
      query.tags!.some(tag => scene.tags.includes(tag))
    );
  }

  if (query.minRating !== undefined) {
    results = results.filter(s => (s.rating ?? 0) >= query.minRating!);
  }

  // Sort by rating (desc) then reuse count (desc)
  results.sort((a, b) => {
    const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return b.reuseCount - a.reuseCount;
  });

  return results;
};

/**
 * Mark a scene as reused (increment counter).
 */
export const markSceneReused = (sceneId: string): void => {
  const db = loadSceneDatabase();
  const scene = db.scenes.find(s => s.id === sceneId);
  if (scene) {
    scene.reuseCount++;
    saveSceneDatabase(db);
  }
};

/**
 * Update a scene's rating.
 */
export const rateScene = (sceneId: string, rating: number, notes?: string): void => {
  const db = loadSceneDatabase();
  const scene = db.scenes.find(s => s.id === sceneId);
  if (scene) {
    scene.rating = Math.max(1, Math.min(5, rating));
    if (notes) scene.notes = notes;
    saveSceneDatabase(db);
  }
};

/**
 * Delete a scene from the database.
 */
export const deleteScene = (sceneId: string): boolean => {
  const db = loadSceneDatabase();
  const index = db.scenes.findIndex(s => s.id === sceneId);
  if (index >= 0) {
    db.scenes.splice(index, 1);
    rebuildIndexes(db);
    saveSceneDatabase(db);
    return true;
  }
  return false;
};

/**
 * Build a summary of available scenes for LLM context.
 * This helps Claude decide whether to reuse existing scenes.
 */
export const buildSceneSummaryForLLM = (): string => {
  const db = loadSceneDatabase();
  if (db.scenes.length === 0) {
    return 'No stored scenes available. All scenes must be generated fresh.';
  }

  const lines: string[] = ['Available pre-approved scenes:'];
  const byBg: Record<string, StoredScene[]> = {};

  for (const scene of db.scenes) {
    if (!byBg[scene.background]) byBg[scene.background] = [];
    byBg[scene.background].push(scene);
  }

  for (const [bg, scenes] of Object.entries(byBg)) {
    lines.push(`\n${bg} (${scenes.length} scenes):`);
    for (const s of scenes.slice(0, 5)) {
      const ratingStr = s.rating ? ` [${s.rating}/5]` : '';
      lines.push(`  - "${s.name}" (tags: ${s.tags.join(', ')})${ratingStr}`);
    }
    if (scenes.length > 5) {
      lines.push(`  ... and ${scenes.length - 5} more`);
    }
  }

  return lines.join('\n');
};

/**
 * Initialize the scene database if it doesn't exist.
 */
export const initSceneDatabase = (): void => {
  if (!fs.existsSync(DB_PATH)) {
    saveSceneDatabase(DEFAULT_DB);
  }
};
