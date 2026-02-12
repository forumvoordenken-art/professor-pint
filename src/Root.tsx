import React from 'react';
import { Composition } from 'remotion';
import { SceneComposerTest } from './videos/TestVideo';
import { ProfessorPintEmotionCarousel } from './videos/EmotionCarousel';
import { SkyShowcase, TOTAL_FRAMES as SKY_TOTAL } from './videos/SkyShowcase';

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
    </>
  );
};
