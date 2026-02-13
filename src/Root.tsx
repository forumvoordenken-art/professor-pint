import React from 'react';
import { Composition } from 'remotion';
import { AssetShowcase, ASSET_SHOWCASE_FRAMES } from './videos/AssetShowcase';
import { MozesScene, MOZES_SCENE_FRAMES } from './videos/MozesScene';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Asset-Showcase"
        component={AssetShowcase}
        durationInFrames={ASSET_SHOWCASE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Mozes-Scene"
        component={MozesScene}
        durationInFrames={MOZES_SCENE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
