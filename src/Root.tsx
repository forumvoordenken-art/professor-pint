import React from 'react';
import { Composition } from 'remotion';
import { AssetShowcase, ASSET_SHOWCASE_FRAMES } from './videos/AssetShowcase';

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
    </>
  );
};
