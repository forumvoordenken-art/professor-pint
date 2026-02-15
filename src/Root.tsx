import React from 'react';
import { Composition } from 'remotion';
import { PubExteriorScene, PUB_EXTERIOR_FRAMES } from './videos/PubExteriorScene';
import { SpriteWalkerTest, SPRITE_TEST_FRAMES } from './videos/SpriteWalkerTest';
import { SVGWalkerTest, SVG_WALKER_TEST_FRAMES } from './videos/SVGWalkerTest';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Pub-Exterior"
        component={PubExteriorScene}
        durationInFrames={PUB_EXTERIOR_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Sprite-Walker-Test"
        component={SpriteWalkerTest}
        durationInFrames={SPRITE_TEST_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SVG-Walker-Test"
        component={SVGWalkerTest}
        durationInFrames={SVG_WALKER_TEST_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
