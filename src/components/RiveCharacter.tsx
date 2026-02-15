/**
 * RiveCharacter — Rive-animated character overlay for scene compositions.
 *
 * Usage:
 *   <RiveCharacter
 *     src="assets/characters/boy-walking.riv"
 *     animation="walk"
 *     style={{ position: 'absolute', left: '60%', bottom: '20%', width: 200, height: 300 }}
 *   />
 *
 * Workflow om een .riv bestand te maken:
 *   1. Genereer character parts (body, head, arms, legs) als losse PNGs via ChatGPT
 *   2. Upload naar Rive (rive.app) → zet bones/skeletal animation op
 *   3. Maak animaties (walk, idle, talk, wave, etc.)
 *   4. Export als .riv → zet in public/assets/characters/
 *   5. Gebruik dit component in je scene
 *
 * De RemotionRiveCanvas van @remotion/rive synct automatisch met
 * useCurrentFrame() — dus de animatie volgt exact het Remotion frame.
 */

import React from 'react';
import { RemotionRiveCanvas } from '@remotion/rive';
import { staticFile } from 'remotion';

interface RiveCharacterProps {
  /** Path relative to public/ (e.g. "assets/characters/boy-walking.riv") */
  src: string;
  /** Name of the animation to play from the .riv file */
  animation?: string;
  /** Name or index of the artboard to use */
  artboard?: string | number;
  /** CSS positioning — use absolute + left/bottom/width/height to place in scene */
  style?: React.CSSProperties;
}

export const RiveCharacter: React.FC<RiveCharacterProps> = ({
  src,
  animation,
  artboard,
  style,
}) => {
  return (
    <div style={style}>
      <RemotionRiveCanvas
        src={staticFile(src)}
        animation={animation}
        artboard={artboard}
        fit="contain"
      />
    </div>
  );
};
