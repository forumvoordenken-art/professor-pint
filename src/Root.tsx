import React from 'react';
import { Composition } from 'remotion';
import { PubExteriorScene, PUB_EXTERIOR_FRAMES } from './videos/PubExteriorScene';
import { PubInteriorScene, PUB_INTERIOR_FRAMES } from './videos/PubInteriorScene';
import { HistoryOfMoney, HISTORY_OF_MONEY_FRAMES } from './videos/HistoryOfMoney';
import { SpriteWalkerTest, SPRITE_TEST_FRAMES } from './videos/SpriteWalkerTest';
import { SVGWalkerTest, SVG_WALKER_TEST_FRAMES } from './videos/SVGWalkerTest';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Main video ── */}
      <Composition
        id="History-of-Money"
        component={HistoryOfMoney}
        durationInFrames={HISTORY_OF_MONEY_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Individual scenes (for preview/testing) ── */}
      <Composition
        id="Pub-Exterior"
        component={PubExteriorScene}
        durationInFrames={PUB_EXTERIOR_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Pub-Interior"
        component={PubInteriorScene}
        durationInFrames={PUB_INTERIOR_FRAMES}
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
