/**
 * WalkingCharacter — Procedural animated character (boy + dog on leash).
 *
 * Flat-color Kurzgesagt style, built entirely from SVG primitives.
 * Walk cycle uses sin-based joint rotations for legs, arms, and head bob.
 * Dog follows on a leash with its own walk cycle offset.
 *
 * Usage:
 *   <WalkingCharacter frame={frame} x={500} y={780} scale={0.8} direction={1} />
 */

import React from 'react';

interface WalkingCharacterProps {
  /** Current Remotion frame */
  frame: number;
  /** X position (center of character feet) */
  x: number;
  /** Y position (ground line) */
  y: number;
  /** Scale factor (1 = ~80px tall character) */
  scale?: number;
  /** Walk direction: 1 = right, -1 = left */
  direction?: 1 | -1;
  /** Walk speed multiplier */
  speed?: number;
}

export const WalkingCharacter: React.FC<WalkingCharacterProps> = ({
  frame,
  x,
  y,
  scale = 1,
  direction = 1,
  speed = 1,
}) => {
  const t = frame * 0.08 * speed; // walk cycle phase

  // Walk cycle angles (degrees)
  const legSwing = Math.sin(t) * 25;          // front/back leg swing
  const armSwing = Math.sin(t + Math.PI) * 20; // opposite to legs
  const bodyBob = Math.abs(Math.sin(t)) * 2;   // subtle up-down
  const headTilt = Math.sin(t * 2) * 3;        // gentle head bob
  const bodyLean = Math.sin(t) * 2;            // slight forward lean

  // Dog walk cycle (slightly offset for natural feel)
  const dogT = t - 0.8;
  const dogLegFront = Math.sin(dogT) * 30;
  const dogLegBack = Math.sin(dogT + Math.PI) * 30;
  const dogTailWag = Math.sin(dogT * 3) * 25;
  const dogBob = Math.abs(Math.sin(dogT)) * 1.5;
  const dogHeadBob = Math.sin(dogT * 2) * 2;

  // Leash sway
  const leashSway = Math.sin(t * 0.7) * 3;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * direction}, ${scale})`}>
      {/* === DOG (behind character, on leash) === */}
      <g transform={`translate(-55, ${-dogBob})`}>
        {/* Leash from character hand to dog collar */}
        <line
          x1={40 + leashSway}
          y1={-38}
          x2={15}
          y2={-22}
          stroke="#5C3A1E"
          strokeWidth={1.2}
          strokeLinecap="round"
        />

        {/* Dog body */}
        <ellipse cx={0} cy={-18} rx={18} ry={10} fill="#8B6914" />

        {/* Dog head */}
        <g transform={`translate(-16, ${-24 + dogHeadBob})`}>
          <ellipse cx={0} cy={0} rx={9} ry={7} fill="#A07818" />
          {/* Ear */}
          <ellipse cx={-4} cy={-5} rx={4} ry={3} fill="#6B5010" />
          {/* Eye */}
          <circle cx={-4} cy={-1} r={1.5} fill="#1A1A1A" />
          {/* Nose */}
          <circle cx={-8} cy={1} r={1.8} fill="#2A1A0A" />
          {/* Collar */}
          <rect x={4} y={3} width={8} height={3} rx={1} fill="#CC3333" />
        </g>

        {/* Tail */}
        <g transform={`translate(18, -24) rotate(${-30 + dogTailWag})`}>
          <rect x={0} y={0} width={3} height={12} rx={1.5} fill="#8B6914" />
        </g>

        {/* Dog legs */}
        {/* Front left */}
        <g transform={`translate(-8, -10) rotate(${dogLegFront}, 0, 0)`}>
          <rect x={-1.5} y={0} width={3} height={12} rx={1.5} fill="#7A5A10" />
        </g>
        {/* Front right */}
        <g transform={`translate(-4, -10) rotate(${-dogLegFront}, 0, 0)`}>
          <rect x={-1.5} y={0} width={3} height={12} rx={1.5} fill="#6B4E0E" />
        </g>
        {/* Back left */}
        <g transform={`translate(10, -10) rotate(${dogLegBack}, 0, 0)`}>
          <rect x={-1.5} y={0} width={3} height={12} rx={1.5} fill="#7A5A10" />
        </g>
        {/* Back right */}
        <g transform={`translate(14, -10) rotate(${-dogLegBack}, 0, 0)`}>
          <rect x={-1.5} y={0} width={3} height={12} rx={1.5} fill="#6B4E0E" />
        </g>
      </g>

      {/* === CHARACTER (boy) === */}
      <g transform={`translate(0, ${-bodyBob}) rotate(${bodyLean}, 0, 0)`}>
        {/* Back arm (behind body) */}
        <g transform={`translate(-4, -52) rotate(${-armSwing}, 0, 0)`}>
          <rect x={-3} y={0} width={6} height={22} rx={3} fill="#2D7A4A" />
          {/* Hand */}
          <circle cx={0} cy={22} r={3.5} fill="#D4A574" />
        </g>

        {/* Back leg */}
        <g transform={`translate(-4, -18) rotate(${-legSwing}, 0, 0)`}>
          {/* Thigh */}
          <rect x={-4} y={0} width={8} height={14} rx={3} fill="#2C3243" />
          {/* Shin */}
          <g transform={`translate(0, 14) rotate(${Math.max(0, -legSwing * 0.6)}, 0, 0)`}>
            <rect x={-3.5} y={0} width={7} height={12} rx={3} fill="#2C3243" />
            {/* Shoe */}
            <ellipse cx={0} cy={13} rx={5} ry={3} fill="#4A3520" />
          </g>
        </g>

        {/* Body / torso */}
        <rect x={-8} y={-55} width={16} height={28} rx={5} fill="#337A50" />

        {/* Front leg */}
        <g transform={`translate(4, -18) rotate(${legSwing}, 0, 0)`}>
          {/* Thigh */}
          <rect x={-4} y={0} width={8} height={14} rx={3} fill="#3F4453" />
          {/* Shin */}
          <g transform={`translate(0, 14) rotate(${Math.max(0, legSwing * 0.6)}, 0, 0)`}>
            <rect x={-3.5} y={0} width={7} height={12} rx={3} fill="#3F4453" />
            {/* Shoe */}
            <ellipse cx={0} cy={13} rx={5} ry={3} fill="#5C4530" />
          </g>
        </g>

        {/* Front arm (with leash) */}
        <g transform={`translate(4, -52) rotate(${armSwing}, 0, 0)`}>
          <rect x={-3} y={0} width={6} height={22} rx={3} fill="#3A9060" />
          {/* Hand holding leash */}
          <circle cx={0} cy={22} r={3.5} fill="#D4A574" />
        </g>

        {/* Head */}
        <g transform={`translate(0, ${-62 + headTilt * 0.3}) rotate(${headTilt}, 0, 0)`}>
          {/* Head shape */}
          <ellipse cx={0} cy={0} rx={10} ry={12} fill="#D4A574" />
          {/* Hair */}
          <ellipse cx={0} cy={-6} rx={10.5} ry={8} fill="#3A2518" />
          {/* Eye */}
          <circle cx={-4} cy={1} r={2} fill="#1A1A1A" />
          {/* Mouth */}
          <path
            d="M -3 5 Q 0 7 3 5"
            stroke="#8B6040"
            strokeWidth={1}
            fill="none"
            strokeLinecap="round"
          />
          {/* Nose */}
          <circle cx={-6} cy={2} r={1.2} fill="#C09060" />
        </g>
      </g>
    </g>
  );
};
