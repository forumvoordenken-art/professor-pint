/**
 * Stage — De master "Stage & Actor" component.
 *
 * Laag 1: Achtergrond (JPG/PNG) met Ken Burns zoom
 * Laag 2: Actor (PNG/WebM) met positionering
 * Laag 3: Sfeer (vignette + floating dust)
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StageProps {
  /** Bestandsnaam in /public/backgrounds/ (bv. "pub.jpg") */
  background: string;
  /** Bestandsnaam in /public/actors/ (bv. "prof_idle.png") — optioneel */
  actor?: string;
  /** Horizontale positie van de actor in % (0-100). Default: 50 */
  actorX?: number;
  /** Schaal van de actor. Default: 1.0 */
  actorScale?: number;
  /** Of de actor horizontaal gespiegeld moet worden. Default: false */
  mirror?: boolean;
  /** Totaal frames van deze stage (nodig voor Ken Burns timing). Default: 300 */
  durationInFrames?: number;
}

// ---------------------------------------------------------------------------
// Helpers: deterministic random voor dust particles
// ---------------------------------------------------------------------------

const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface DustParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

const DUST_COUNT = 30;
const dustParticles: DustParticle[] = Array.from({ length: DUST_COUNT }, (_, i) => ({
  x: rand(i * 1.1 + 42) * 100,          // % van breedte
  y: rand(i * 2.3 + 77) * 100,          // % van hoogte
  size: 2 + rand(i * 3.7 + 13) * 4,     // px
  speed: 0.1 + rand(i * 4.1 + 55) * 0.4,
  opacity: 0.15 + rand(i * 5.9 + 99) * 0.35,
  phase: rand(i * 6.3 + 31) * Math.PI * 2,
}));

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Floating dust particles voor premium sfeer */
const FloatingDust: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 3 }}>
    {dustParticles.map((p, i) => {
      const t = frame * 0.01 * p.speed;
      const px = p.x + Math.sin(t + p.phase) * 3;          // lichte horizontale drift
      const py = ((p.y - frame * p.speed * 0.05) % 100 + 100) % 100; // langzaam omhoog
      const o = p.opacity * (0.5 + Math.sin(frame * 0.02 * p.speed + p.phase) * 0.5);

      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${px}%`,
            top: `${py}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: '#FFD080',
            opacity: Math.max(0, o),
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Stage Component
// ---------------------------------------------------------------------------

export const Stage: React.FC<StageProps> = ({
  background,
  actor,
  actorX = 50,
  actorScale = 1.0,
  mirror = false,
  durationInFrames = 300,
}) => {
  const frame = useCurrentFrame();

  // ── Laag 1: Ken Burns zoom (1.0 → 1.05) ──
  const kenBurnsScale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>

      {/* ── LAAG 1: Achtergrond met Ken Burns ── */}
      <AbsoluteFill style={{ zIndex: 0, overflow: 'hidden' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${kenBurnsScale})`,
            transformOrigin: '50% 50%',
          }}
        >
          <Img
            src={staticFile(`backgrounds/${background}`)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* ── LAAG 2: Actor ── */}
      {actor && (
        <AbsoluteFill style={{ zIndex: 1 }}>
          <div
            style={{
              position: 'absolute',
              left: `${actorX}%`,
              bottom: 0,
              transform: `translateX(-50%) scaleX(${mirror ? -actorScale : actorScale}) scaleY(${actorScale})`,
              transformOrigin: 'center bottom',
            }}
          >
            <Img
              src={staticFile(`actors/${actor}`)}
              style={{
                height: '70%',
                maxHeight: 756, // 70% van 1080
                width: 'auto',
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── LAAG 3: Sfeer ── */}

      {/* Floating dust */}
      <FloatingDust frame={frame} />

      {/* Vignette */}
      <AbsoluteFill style={{ zIndex: 4, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </AbsoluteFill>

      {/* Donkere sfeer overlay */}
      <AbsoluteFill
        style={{
          zIndex: 5,
          backgroundColor: 'rgba(0,0,0,0.1)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Stage;
