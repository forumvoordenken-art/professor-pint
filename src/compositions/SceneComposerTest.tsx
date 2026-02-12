/**
 * SceneComposerTest — Phase 0.1 test composition
 *
 * Renders a hardcoded ComposedScene using placeholder assets
 * to validate the 10-layer composition system in Remotion Studio.
 */

import React from 'react';
import { SceneComposer } from '../systems/SceneComposer';
import type { ComposedScene } from '../systems/SceneComposer';
import { registerTestAssets } from '../assets/test/placeholders';

// Register placeholder assets on module load
registerTestAssets();

// A test scene using all 10 layers
const testScene: ComposedScene = {
  sky: { asset: 'test_sky' },
  terrain: { asset: 'test_terrain' },
  water: { asset: 'test_water', x: 200, y: 620, scale: 2 },
  structures: [
    { asset: 'test_structure', x: 800, y: 350, scale: 1.2 },
    { asset: 'test_structure', x: 1200, y: 380, scale: 0.8, mirror: true },
  ],
  vegetation: [
    { asset: 'test_vegetation', x: 100, y: 480, scale: 1.0 },
    { asset: 'test_vegetation', x: 1600, y: 500, scale: 0.9, mirror: true },
    { asset: 'test_vegetation', x: 500, y: 520, scale: 0.7 },
  ],
  characters: [
    { asset: 'test_character', x: 900, y: 550, scale: 2.0 },
    { asset: 'test_character', x: 700, y: 580, scale: 1.5 },
    { asset: 'test_character', x: 1100, y: 600, scale: 1.2 },
  ],
  props: [
    { asset: 'test_prop', x: 600, y: 620, scale: 1.0 },
    { asset: 'test_prop', x: 1050, y: 640, scale: 0.8 },
  ],
  foreground: [{ asset: 'test_foreground', opacity: 0.6 }],
  atmosphere: [{ asset: 'test_atmosphere', opacity: 0.5 }],
  lighting: { asset: 'test_lighting', intensity: 0.8 },
};

export const SceneComposerTest: React.FC = () => {
  return <SceneComposer scene={testScene} />;
};
