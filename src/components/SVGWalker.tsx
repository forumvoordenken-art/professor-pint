/**
 * SVGWalker — Hybrid SVG + procedural walking animation for boy + dog.
 *
 * Uses ChatGPT SVG parts where available (torso, head, legs) and fills in
 * missing parts (arms, dog head) with procedural primitives.
 *
 * Approach: Skeletal animation with sin-based joint rotations — exactly how
 * professional studios do walk cycles, but in code instead of After Effects.
 *
 * Usage:
 *   <SVGWalker frame={frame} x={200} y={600} scale={1} />
 */

import React from 'react';
import { Img, staticFile } from 'remotion';

interface SVGWalkerProps {
  /** Current Remotion frame */
  frame: number;
  /** X position on canvas */
  x: number;
  /** Y position (ground level) */
  y: number;
  /** Display scale */
  scale?: number;
  /** Walk direction: 1 = right, -1 = left */
  direction?: 1 | -1;
  /** Walk speed multiplier */
  speed?: number;
}

export const SVGWalker: React.FC<SVGWalkerProps> = ({
  frame,
  x,
  y,
  scale = 0.3,
  direction = 1,
  speed = 1,
}) => {
  const t = frame * 0.08 * speed; // walk cycle phase

  // Walk cycle angles (degrees)
  const legSwing = Math.sin(t) * 25;
  const armSwing = Math.sin(t + Math.PI) * 20;
  const bodyBob = Math.abs(Math.sin(t)) * 3;
  const headTilt = Math.sin(t * 2) * 2;

  // Dog walk cycle (offset for natural feel)
  const dogT = t - 0.8;
  const dogLegFront = Math.sin(dogT) * 30;
  const dogLegBack = Math.sin(dogT + Math.PI) * 30;
  const dogTailWag = Math.sin(dogT * 3) * 25;
  const dogBob = Math.abs(Math.sin(dogT)) * 2;

  // Leash sway
  const leashSway = Math.sin(t * 0.7) * 5;

  // SVG viewBox from original: 0 0 1536 1024
  // Boy is roughly centered at ~500, 550 in the original SVG
  // Dog is to the left at ~900, 620

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * direction}, ${scale})`}>
      {/* === DOG (on leash, left side) === */}
      <g transform={`translate(-200, ${-dogBob})`}>
        {/* Leash from character's hand to dog collar */}
        <line
          x1={250 + leashSway}
          y1={-450}
          x2={100}
          y2={-380}
          stroke="#5C3A1E"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Dog body (from SVG) — positioned relative to original SVG coords */}
        <g transform="translate(-900, -620)">
          {/* We'll inline the dog-body SVG paths here */}
          {/* For now, use procedural dog until we extract the SVG properly */}
          <ellipse cx={900} cy={620} rx={60} ry={35} fill="#8B6914" />

          {/* Dog tail (with wag) */}
          <g transform={`translate(960, 600) rotate(${-30 + dogTailWag})`}>
            <rect x={0} y={0} width={10} height={40} rx={5} fill="#8B6914" />
          </g>

          {/* Dog head (procedural — missing from SVG) */}
          <g transform={`translate(840, 595)`}>
            <ellipse cx={0} cy={0} rx={30} ry={24} fill="#A07818" />
            <ellipse cx={-12} cy={-15} rx={12} ry={9} fill="#6B5010" /> {/* ear */}
            <circle cx={-12} cy={-3} r={4} fill="#1A1A1A" /> {/* eye */}
            <circle cx={-24} cy={3} r={5} fill="#2A1A0A" /> {/* nose */}
            {/* Collar */}
            <rect x={12} y={9} width={24} height={8} rx={3} fill="#CC3333" />
          </g>

          {/* Dog legs (animated) */}
          <g transform={`translate(870, 640) rotate(${dogLegFront})`}>
            <rect x={-5} y={0} width={10} height={40} rx={5} fill="#7A5A10" />
          </g>
          <g transform={`translate(890, 640) rotate(${-dogLegFront})`}>
            <rect x={-5} y={0} width={10} height={40} rx={5} fill="#6B4E0E" />
          </g>
          <g transform={`translate(930, 640) rotate(${dogLegBack})`}>
            <rect x={-5} y={0} width={10} height={40} rx={5} fill="#7A5A10" />
          </g>
          <g transform={`translate(950, 640) rotate(${-dogLegBack})`}>
            <rect x={-5} y={0} width={10} height={40} rx={5} fill="#6B4E0E" />
          </g>
        </g>
      </g>

      {/* === BOY CHARACTER === */}
      <g transform={`translate(0, ${-bodyBob})`}>
        {/* Back arm (behind body) — procedural (missing from SVG) */}
        <g transform={`translate(-15, -460) rotate(${-armSwing})`}>
          <rect x={-10} y={0} width={20} height={75} rx={10} fill="#2D7A4A" />
          <circle cx={0} cy={75} r={12} fill="#D4A574" />
        </g>

        {/* Back leg (from SVG boy-leg_back) */}
        <g transform={`translate(-15, -350) rotate(${-legSwing})`}>
          {/* For now, procedural — will extract SVG paths later */}
          <rect x={-14} y={0} width={28} height={50} rx={10} fill="#2C3243" />
          <g transform={`translate(0, 50) rotate(${Math.max(0, -legSwing * 0.6)})`}>
            <rect x={-12} y={0} width={24} height={42} rx={10} fill="#2C3243" />
            <ellipse cx={0} cy={46} rx={18} ry={10} fill="#4A3520" />
          </g>
        </g>

        {/* Torso (from SVG boy-torso) */}
        <g transform="translate(-500, -550)">
          {/* Simplified torso — real SVG has 15 paths */}
          <rect x={470} y={405} width={60} height={100} rx={18} fill="#337A50" />
        </g>

        {/* Front leg (from SVG boy-leg_front) */}
        <g transform={`translate(15, -350) rotate(${legSwing})`}>
          <rect x={-14} y={0} width={28} height={50} rx={10} fill="#3F4453" />
          <g transform={`translate(0, 50) rotate(${Math.max(0, legSwing * 0.6)})`}>
            <rect x={-12} y={0} width={24} height={42} rx={10} fill="#3F4453" />
            <ellipse cx={0} cy={46} rx={18} ry={10} fill="#5C4530" />
          </g>
        </g>

        {/* Front arm (with leash) — procedural */}
        <g transform={`translate(15, -460) rotate(${armSwing})`}>
          <rect x={-10} y={0} width={20} height={75} rx={10} fill="#3A9060" />
          <circle cx={0} cy={75} r={12} fill="#D4A574" />
        </g>

        {/* Head (from SVG boy-head) */}
        <g transform={`translate(0, ${-520 + headTilt * 2}) rotate(${headTilt})`}>
          {/* Simplified head — real SVG has 9 paths + 3 ellipses */}
          <ellipse cx={0} cy={0} rx={35} ry={42} fill="#D4A574" />
          <ellipse cx={0} cy={-21} rx={37} ry={28} fill="#3A2518" /> {/* hair */}
          <circle cx={-14} cy={3} r={7} fill="#1A1A1A" /> {/* eye */}
          <circle cx={-21} cy={7} r={4} fill="#C09060" /> {/* nose */}
          <path
            d="M -10 18 Q 0 24 10 18"
            stroke="#8B6040"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          /> {/* mouth */}
        </g>
      </g>
    </g>
  );
};
