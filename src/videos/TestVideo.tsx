/**
 * SceneComposerTest — Phase 0.1 + 0.5 test composition
 *
 * Renders a hardcoded ComposedScene using placeholder assets and position presets
 * to validate the 10-layer composition system + position preset system in Remotion Studio.
 */

import React from 'react';
import { SceneComposer } from '../motor/SceneComposer';
import type { ComposedScene } from '../motor/SceneComposer';
import { registerTestAssets } from '../assets/test/placeholders';

// Register placeholder assets on module load
registerTestAssets();

// A test scene using all 10 layers — now with position presets
const testScene: ComposedScene = {
  sky: { asset: 'test_sky' },
  terrain: { asset: 'test_terrain' },
  water: { asset: 'test_water', x: 200, y: 620, scale: 2 },
  structures: [
    { asset: 'test_structure', position: 'center_back' },
    { asset: 'test_structure', position: 'right_back', mirror: true },
  ],
  vegetation: [
    { asset: 'test_vegetation', position: 'far_left_mid' },
    { asset: 'test_vegetation', position: 'far_right_mid', mirror: true },
    { asset: 'test_vegetation', position: 'left_mid' },
  ],
  characters: [
    { asset: 'test_character', position: 'podium' },
    { asset: 'test_character', position: 'duo_left' },
    { asset: 'test_character', position: 'duo_right' },
  ],
  props: [
    { asset: 'test_prop', position: 'left_front' },
    { asset: 'test_prop', position: 'right_front' },
  ],
  foreground: [{ asset: 'test_foreground', opacity: 0.6 }],
  atmosphere: [{ asset: 'test_atmosphere', opacity: 0.5 }],
  lighting: { asset: 'test_lighting', intensity: 0.8 },
};

export const SceneComposerTest: React.FC = () => {
  return <SceneComposer scene={testScene} />;
};
