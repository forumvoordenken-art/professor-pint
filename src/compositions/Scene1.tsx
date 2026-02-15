/**
 * Scene1 — Professor Pint staat bij de pub.
 *
 * 10 seconden (300 frames @ 30fps).
 * Gebruikt de Stage component met achtergrond + actor.
 */

import React from 'react';
import { Stage } from '../components/Stage';

export const SCENE1_FRAMES = 300; // 10 sec @ 30fps

export const Scene1: React.FC = () => {
  return (
    <Stage
      background="prof_idle.png"
      actor="prof_idle.png"
      actorX={50}
      actorScale={1.0}
      durationInFrames={SCENE1_FRAMES}
    />
  );
};

export default Scene1;
