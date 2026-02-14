import React from 'react';
import { Composition } from 'remotion';
import { PubExteriorScene, PUB_EXTERIOR_FRAMES } from './videos/PubExteriorScene';

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
    </>
  );
};
