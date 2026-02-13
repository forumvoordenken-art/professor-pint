import React from 'react';
import { Composition } from 'remotion';
import { SceneComposerTest } from './videos/TestVideo';
import { ProfessorPintEmotionCarousel } from './videos/EmotionCarousel';
import { SkyShowcase, TOTAL_FRAMES as SKY_TOTAL } from './videos/SkyShowcase';
import { TerrainShowcase, TOTAL_FRAMES as TERRAIN_TOTAL } from './videos/TerrainShowcase';
import { CombinedShowcase, COMBINED_TOTAL_FRAMES } from './videos/CombinedShowcase';
import { ComparisonShowcase, COMPARISON_TOTAL_FRAMES } from './videos/ComparisonShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SceneComposer-Test"
        component={SceneComposerTest}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProfessorPint-Emotions"
        component={ProfessorPintEmotionCarousel}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Sky-Showcase"
        component={SkyShowcase}
        durationInFrames={SKY_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Terrain-Showcase"
        component={TerrainShowcase}
        durationInFrames={TERRAIN_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Combined-Showcase"
        component={CombinedShowcase}
        durationInFrames={COMBINED_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Comparison-Showcase"
        component={ComparisonShowcase}
        durationInFrames={COMPARISON_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
