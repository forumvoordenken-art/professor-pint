/**
 * SpriteWalker — Spritesheet-based walking animation for boy + dog.
 *
 * Uses the Ludo.ai generated spritesheet (8 cols × 6 rows = 48 frames).
 * Each Remotion frame picks the corresponding sprite cell and displays it.
 *
 * Usage:
 *   <SpriteWalker frame={frame} x={200} y={600} scale={1} />
 */

import React from 'react';
import { Img, staticFile } from 'remotion';

const SHEET_WIDTH = 1566;
const SHEET_HEIGHT = 1140;
const COLS = 8;
const ROWS = 6;
const TOTAL_FRAMES = COLS * ROWS; // 48
const FRAME_W = SHEET_WIDTH / COLS; // ~195.75
const FRAME_H = SHEET_HEIGHT / ROWS; // 190

interface SpriteWalkerProps {
  /** Current Remotion frame */
  frame: number;
  /** X position on canvas */
  x: number;
  /** Y position (bottom of sprite) */
  y: number;
  /** Display scale (1 = native sprite size) */
  scale?: number;
  /** Frames per sprite-frame — higher = slower animation */
  holdFrames?: number;
  /** Walk direction: 1 = right, -1 = left (mirrors sprite) */
  direction?: 1 | -1;
  /** Display width override (pixels). If set, scale is ignored. */
  displayWidth?: number;
}

export const SpriteWalker: React.FC<SpriteWalkerProps> = ({
  frame,
  x,
  y,
  scale = 1,
  holdFrames = 2,
  direction = 1,
  displayWidth,
}) => {
  // Which sprite frame to show (loop through all 48)
  const spriteIndex = Math.floor(frame / holdFrames) % TOTAL_FRAMES;
  const col = spriteIndex % COLS;
  const row = Math.floor(spriteIndex / COLS);

  // Source rectangle on the spritesheet
  const srcX = col * FRAME_W;
  const srcY = row * FRAME_H;

  // Display size
  const w = displayWidth ?? FRAME_W * scale;
  const h = displayWidth ? (displayWidth / FRAME_W) * FRAME_H : FRAME_H * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h,
        width: w,
        height: h,
        overflow: 'hidden',
        transform: direction === -1 ? 'scaleX(-1)' : undefined,
      }}
    >
      <Img
        src={staticFile('assets/boy-dog-walking-spritesheet.png')}
        style={{
          position: 'absolute',
          width: SHEET_WIDTH * (w / FRAME_W),
          height: SHEET_HEIGHT * (h / FRAME_H),
          left: -srcX * (w / FRAME_W),
          top: -srcY * (h / FRAME_H),
          imageRendering: 'auto',
        }}
      />
    </div>
  );
};
