/**
 * Placeholder test assets for Phase 0.1 SceneComposer prototype.
 *
 * Each asset follows the standard AssetProps interface and renders a simple
 * colored SVG shape with basic animation to prove the layer system works.
 * These will be replaced by real oil-painting-quality assets in Phase 1.
 */

import React from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import { registerAsset } from '../../motor/SceneComposer';

// ---- Layer 1: Sky ----

const TestSky: React.FC<AssetProps> = ({ frame }) => {
  // Subtle color shift over time to simulate time-of-day
  const hue = 200 + Math.sin(frame * 0.005) * 10;
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue}, 60%, 55%)`} />
          <stop offset="60%" stopColor={`hsl(${hue + 20}, 50%, 70%)`} />
          <stop offset="100%" stopColor={`hsl(${hue + 40}, 40%, 80%)`} />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#sky-grad)" />
      {/* Animated clouds */}
      <ellipse
        cx={300 + (frame * 0.3) % 2200 - 100}
        cy={150}
        rx={180}
        ry={50}
        fill="rgba(255,255,255,0.4)"
      />
      <ellipse
        cx={900 + (frame * 0.2) % 2200 - 100}
        cy={100}
        rx={220}
        ry={60}
        fill="rgba(255,255,255,0.3)"
      />
      <ellipse
        cx={1500 + (frame * 0.15) % 2200 - 100}
        cy={200}
        rx={150}
        ry={40}
        fill="rgba(255,255,255,0.35)"
      />
    </svg>
  );
};

// ---- Layer 2: Terrain ----

const TestTerrain: React.FC<AssetProps> = ({ frame }) => {
  // Gentle grass sway
  const sway = Math.sin(frame * 0.04) * 2;
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        <linearGradient id="terrain-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="40%" stopColor="#6B8E3D" />
          <stop offset="100%" stopColor="#4A6B2A" />
        </linearGradient>
      </defs>
      {/* Ground starts at y=600 (lower 45% of screen) */}
      <rect x="0" y="600" width="1920" height="480" fill="url(#terrain-grad)" />
      {/* Rolling hills */}
      <path
        d={`M0,650 Q300,${580 + sway} 600,640 Q900,${600 + sway} 1200,630 Q1500,${610 + sway} 1920,650 L1920,1080 L0,1080 Z`}
        fill="#5A7E2F"
        opacity={0.8}
      />
    </svg>
  );
};

// ---- Layer 3: Water ----

const TestWater: React.FC<AssetProps> = ({ frame }) => {
  const wave1 = Math.sin(frame * 0.06) * 3;
  const wave2 = Math.sin(frame * 0.08 + 1) * 2;
  return (
    <svg width="400" height="200" viewBox="0 0 400 200">
      <defs>
        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A7BD5" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#1A4B8A" stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <path
        d={`M0,${30 + wave1} Q100,${20 + wave2} 200,${30 + wave1} Q300,${40 + wave2} 400,${30 + wave1} L400,200 L0,200 Z`}
        fill="url(#water-grad)"
      />
      {/* Shimmer highlights */}
      <line x1="50" y1={50 + wave1} x2="120" y2={48 + wave2} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <line x1="200" y1={45 + wave2} x2="280" y2={50 + wave1} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    </svg>
  );
};

// ---- Layer 4: Structure (pyramid placeholder) ----

const TestStructure: React.FC<AssetProps> = ({ frame }) => {
  // Subtle heat shimmer
  const shimmer = Math.sin(frame * 0.03) * 0.5;
  return (
    <svg width="300" height="250" viewBox="0 0 300 250">
      <defs>
        <linearGradient id="pyramid-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A650" />
          <stop offset="50%" stopColor="#C4943C" />
          <stop offset="100%" stopColor="#A07830" />
        </linearGradient>
      </defs>
      <polygon
        points={`150,${10 + shimmer} 30,240 270,240`}
        fill="url(#pyramid-grad)"
        stroke="#8B6914"
        strokeWidth="1.5"
      />
      {/* Shadow side */}
      <polygon
        points={`150,${10 + shimmer} 150,240 270,240`}
        fill="rgba(0,0,0,0.2)"
      />
    </svg>
  );
};

// ---- Layer 5: Vegetation (palm tree placeholder) ----

const TestVegetation: React.FC<AssetProps> = ({ frame }) => {
  const sway = Math.sin(frame * 0.05) * 4;
  return (
    <svg width="120" height="250" viewBox="0 0 120 250">
      {/* Trunk */}
      <path
        d={`M55,250 Q58,180 ${60 + sway * 0.3},100 Q${62 + sway * 0.5},60 ${60 + sway},30`}
        stroke="#8B6914"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {/* Fronds */}
      <ellipse cx={60 + sway} cy={25} rx={50} ry={20} fill="#2D5A1E" opacity={0.9} />
      <ellipse cx={40 + sway * 0.8} cy={20} rx={40} ry={12} fill="#3A7028" opacity={0.8} />
      <ellipse cx={80 + sway * 1.2} cy={22} rx={35} ry={14} fill="#2D5A1E" opacity={0.85} />
    </svg>
  );
};

// ---- Layer 6: Character (stick figure placeholder) ----

const TestCharacter: React.FC<AssetProps> = ({ frame }) => {
  const idle = Math.sin(frame * 0.08) * 1.5;
  return (
    <svg width="60" height="120" viewBox="0 0 60 120">
      {/* Head */}
      <circle cx="30" cy={15 + idle} r="12" fill="#F5D0A0" stroke="#8B6914" strokeWidth="1" />
      {/* Body */}
      <line x1="30" y1={27 + idle} x2="30" y2={70 + idle} stroke="#4A3728" strokeWidth="3" />
      {/* Arms */}
      <line x1="30" y1={40 + idle} x2="10" y2={55 + idle} stroke="#4A3728" strokeWidth="2.5" />
      <line x1="30" y1={40 + idle} x2="50" y2={55 + idle} stroke="#4A3728" strokeWidth="2.5" />
      {/* Legs */}
      <line x1="30" y1={70 + idle} x2="15" y2={100 + idle} stroke="#4A3728" strokeWidth="2.5" />
      <line x1="30" y1={70 + idle} x2="45" y2={100 + idle} stroke="#4A3728" strokeWidth="2.5" />
    </svg>
  );
};

// ---- Layer 7: Prop (barrel placeholder) ----

const TestProp: React.FC<AssetProps> = () => {
  return (
    <svg width="50" height="60" viewBox="0 0 50 60">
      <ellipse cx="25" cy="55" rx="22" ry="5" fill="#5A3E1B" />
      <rect x="3" y="10" width="44" height="45" rx="6" fill="#8B6914" />
      <ellipse cx="25" cy="10" rx="22" ry="5" fill="#A07830" />
      <line x1="25" y1="5" x2="25" y2="55" stroke="#5A3E1B" strokeWidth="1.5" />
      <rect x="8" y="20" width="34" height="3" rx="1" fill="#5A3E1B" opacity={0.6} />
      <rect x="8" y="40" width="34" height="3" rx="1" fill="#5A3E1B" opacity={0.6} />
    </svg>
  );
};

// ---- Layer 8: Foreground (column placeholder) ----

const TestForeground: React.FC<AssetProps> = () => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Left column */}
      <rect x="0" y="0" width="80" height="1080" fill="#6B5A45" />
      <rect x="0" y="0" width="80" height="40" fill="#8B7355" />
      <rect x="0" y="1040" width="80" height="40" fill="#8B7355" />
      {/* Right column */}
      <rect x="1840" y="0" width="80" height="1080" fill="#6B5A45" />
      <rect x="1840" y="0" width="80" height="40" fill="#8B7355" />
      <rect x="1840" y="1040" width="80" height="40" fill="#8B7355" />
    </svg>
  );
};

// ---- Layer 9: Atmosphere (dust particles placeholder) ----

const TestAtmosphere: React.FC<AssetProps> = ({ frame }) => {
  // Floating particles
  const particles = Array.from({ length: 15 }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7.3 + frame * (0.2 + i * 0.05)) % 1920;
    const y = (seed * 3.7 + frame * (0.1 + i * 0.03)) % 1080;
    const size = 2 + (i % 4);
    const opacity = 0.15 + (i % 5) * 0.05;
    return (
      <circle key={i} cx={x} cy={y} r={size} fill="#FFF8DC" opacity={opacity} />
    );
  });
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {particles}
    </svg>
  );
};

// ---- Layer 10: Lighting (warm vignette placeholder) ----

const TestLighting: React.FC<AssetProps> = () => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(255,200,100,0.05)" />
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#vignette)" />
    </svg>
  );
};

// ---- Register all placeholder assets ----

export function registerTestAssets(): void {
  registerAsset('test_sky', TestSky);
  registerAsset('test_terrain', TestTerrain);
  registerAsset('test_water', TestWater);
  registerAsset('test_structure', TestStructure);
  registerAsset('test_vegetation', TestVegetation);
  registerAsset('test_character', TestCharacter);
  registerAsset('test_prop', TestProp);
  registerAsset('test_foreground', TestForeground);
  registerAsset('test_atmosphere', TestAtmosphere);
  registerAsset('test_lighting', TestLighting);
}
