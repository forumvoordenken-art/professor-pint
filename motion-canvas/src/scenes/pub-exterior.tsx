import {makeScene2D, Img, Circle, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  createRef,
  waitFor,
  loop,
  sequence,
  easeInOutCubic,
  easeInOutSine,
  linear,
  createRefArray,
  createSignal,
} from '@motion-canvas/core';

/**
 * Professor Pint — Pub Exterior Scene (Enhanced Edition)
 *
 * Full atmospheric animation with:
 * - Twinkling stars (40)
 * - Moon glow with layered radial effect
 * - Multi-frequency lamp pulsing with glow halos
 * - Window light with floor reflection
 * - Chimney smoke physics (rising, expanding, drifting, fading)
 * - Dust motes rising in lamp light
 * - Ground fog drifting
 * - Pub lantern glows
 * - Vignette and atmospheric overlays
 */

const W = 1920;
const H = 1080;

// ── Character (boy + dog) dimensions ───────────────────────────────────────
const CHAR_W = 1274;
const CHAR_H = 873;
const CHAR_SCALE = 0.32;
const CHAR_DISPLAY_W = CHAR_W * CHAR_SCALE;
const CHAR_DISPLAY_H = CHAR_H * CHAR_SCALE;

// ── Deterministic pseudo-random ────────────────────────────────────────────
const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ── Anchor points (match Remotion positions) ───────────────────────────────
const ANCHORS = {
  moon: { x: W * 0.82 - W/2, y: H * 0.12 - H/2 },
  pubCenter: { x: 0, y: H * 0.45 - H/2 },
  groundLine: H * 0.73 - H/2,
  lampLeft: { x: W * 0.245 - W/2, y: H * 0.20 - H/2 },
  lampRight: { x: W * 0.755 - W/2, y: H * 0.20 - H/2 },
  chimney: { x: W * 0.262 - W/2, y: H * 0.128 - H/2 },
  pubLanternLeft: { x: W * 0.381 - W/2, y: H * 0.610 - H/2 },
  pubLanternRight: { x: W * 0.509 - W/2, y: H * 0.626 - H/2 },
};

// ── Pre-generated particles ────────────────────────────────────────────────
interface Particle {
  x: number; y: number; size: number; speed: number; opacity: number; phase: number;
}

const makeParticles = (
  count: number, seed: number,
  bounds: { x1: number; y1: number; x2: number; y2: number },
): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    x: bounds.x1 + rand(seed + i * 1.1) * (bounds.x2 - bounds.x1),
    y: bounds.y1 + rand(seed + i * 2.3) * (bounds.y2 - bounds.y1),
    size: 1.5 + rand(seed + i * 3.7) * 4,
    speed: 0.2 + rand(seed + i * 4.1) * 0.8,
    opacity: 0.15 + rand(seed + i * 5.9) * 0.45,
    phase: rand(seed + i * 6.3) * Math.PI * 2,
  }));

const dustLeft = makeParticles(15, 10, {
  x1: ANCHORS.lampLeft.x - 80, y1: ANCHORS.lampLeft.y - 20,
  x2: ANCHORS.lampLeft.x + 80, y2: ANCHORS.lampLeft.y + 250,
});
const dustRight = makeParticles(15, 20, {
  x1: ANCHORS.lampRight.x - 80, y1: ANCHORS.lampRight.y - 20,
  x2: ANCHORS.lampRight.x + 80, y2: ANCHORS.lampRight.y + 250,
});
const fogParticles = makeParticles(25, 30, {
  x1: -W/2, y1: ANCHORS.groundLine, x2: W/2, y2: H/2,
});

const stars = Array.from({ length: 40 }, (_, i) => ({
  x: (40 + rand(100 + i) * (W - 80)) - W/2,
  y: (15 + rand(200 + i) * (H * 0.45)) - H/2,
  size: 0.8 + rand(300 + i) * 2.5,
  speed: 0.015 + rand(400 + i) * 0.05,
  phase: rand(500 + i) * Math.PI * 2,
  brightness: 0.4 + rand(600 + i) * 0.6,
}));

const smokeParticles = Array.from({ length: 18 }, (_, i) => ({
  xOff: (rand(700 + i) - 0.5) * 30,
  size: 6 + rand(800 + i) * 14,
  speed: 0.3 + rand(900 + i) * 0.5,
  drift: (rand(1000 + i) - 0.5) * 0.4,
  opacity: 0.12 + rand(1100 + i) * 0.18,
  phase: rand(1200 + i) * Math.PI * 2,
  lifetime: 80 + rand(1300 + i) * 60,
}));

// ══════════════════════════════════════════════════════════════════════════
// MAIN SCENE
// ══════════════════════════════════════════════════════════════════════════

export default makeScene2D(function* (view) {
  // Frame counter for animation math
  const frameSignal = createSignal(0);

  // ── Background ───────────────────────────────────────────────────────────
  const bg = createRef<Img>();
  view.add(
    <Img
      ref={bg}
      src={'/assets/scenes/pub-exterior-full.svg'}
      width={1920}
      height={1080}
      opacity={0}
    />,
  );

  // ── Character (boy + dog walking) ────────────────────────────────────────
  const character = createRef<Img>();
  view.add(
    <Img
      ref={character}
      src={'/assets/scenes/pub-exterior-boy-dog.svg'}
      width={CHAR_DISPLAY_W}
      height={CHAR_DISPLAY_H}
      x={W * 0.15}  // Start position (right side)
      y={H * 0.08}  // Feet on sidewalk (MC center origin, so positive y)
      opacity={0}
      compositeOperation={'multiply'}
    />,
  );

  // ── Stars ────────────────────────────────────────────────────────────────
  const starRefs = createRefArray<Circle>();
  for (const s of stars) {
    view.add(
      <Circle
        ref={starRefs}
        width={s.size * 2}
        height={s.size * 2}
        x={s.x}
        y={s.y}
        fill={'#FFFDE8'}
        opacity={0}
      />,
    );
  }

  // ── Moon Glow (layered circles for radial gradient) ─────────────────────
  const moonGlow1 = createRef<Circle>();
  const moonGlow2 = createRef<Circle>();
  const moonGlow3 = createRef<Circle>();
  view.add(
    <>
      <Circle ref={moonGlow3} width={360} height={340} x={ANCHORS.moon.x} y={ANCHORS.moon.y}
        fill={'#8070AA08'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={moonGlow2} width={180} height={170} x={ANCHORS.moon.x} y={ANCHORS.moon.y}
        fill={'#E8E0D018'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={moonGlow1} width={90} height={85} x={ANCHORS.moon.x} y={ANCHORS.moon.y}
        fill={'#FFFFF028'} opacity={0} compositeOperation={'screen'} />
    </>,
  );

  // ── Lamp Glows (left & right, multi-layer radial) ───────────────────────
  const lampLeftOuter = createRef<Circle>();
  const lampLeftMid = createRef<Circle>();
  const lampLeftInner = createRef<Circle>();
  const lampRightOuter = createRef<Circle>();
  const lampRightMid = createRef<Circle>();
  const lampRightInner = createRef<Circle>();

  view.add(
    <>
      {/* Left lamp */}
      <Circle ref={lampLeftOuter} width={400} height={520} x={ANCHORS.lampLeft.x} y={ANCHORS.lampLeft.y}
        fill={'#FF660010'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={lampLeftMid} width={220} height={286} x={ANCHORS.lampLeft.x} y={ANCHORS.lampLeft.y}
        fill={'#FFAA3320'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={lampLeftInner} width={120} height={156} x={ANCHORS.lampLeft.x} y={ANCHORS.lampLeft.y}
        fill={'#FFD58040'} opacity={0} compositeOperation={'screen'} />

      {/* Right lamp */}
      <Circle ref={lampRightOuter} width={400} height={520} x={ANCHORS.lampRight.x} y={ANCHORS.lampRight.y}
        fill={'#FF660010'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={lampRightMid} width={220} height={286} x={ANCHORS.lampRight.x} y={ANCHORS.lampRight.y}
        fill={'#FFAA3320'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={lampRightInner} width={120} height={156} x={ANCHORS.lampRight.x} y={ANCHORS.lampRight.y}
        fill={'#FFD58040'} opacity={0} compositeOperation={'screen'} />
    </>,
  );

  // ── Window Light (dual glow: window + floor reflection) ─────────────────
  const windowGlow = createRef<Circle>();
  const floorGlow = createRef<Circle>();
  view.add(
    <>
      <Circle ref={windowGlow} width={560} height={400} x={ANCHORS.pubCenter.x} y={ANCHORS.pubCenter.y + 50}
        fill={'#FFD06025'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={floorGlow} width={640} height={140} x={ANCHORS.pubCenter.x} y={ANCHORS.groundLine}
        fill={'#FFD06015'} opacity={0} compositeOperation={'screen'} />
    </>,
  );

  // ── Pub Lantern Glows ────────────────────────────────────────────────────
  const lanternLeft1 = createRef<Circle>();
  const lanternLeft2 = createRef<Circle>();
  const lanternRight1 = createRef<Circle>();
  const lanternRight2 = createRef<Circle>();
  view.add(
    <>
      <Circle ref={lanternLeft2} width={160} height={224} x={ANCHORS.pubLanternLeft.x} y={ANCHORS.pubLanternLeft.y}
        fill={'#FFAA3318'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={lanternLeft1} width={80} height={112} x={ANCHORS.pubLanternLeft.x} y={ANCHORS.pubLanternLeft.y}
        fill={'#FFE0A035'} opacity={0} compositeOperation={'screen'} />

      <Circle ref={lanternRight2} width={160} height={224} x={ANCHORS.pubLanternRight.x} y={ANCHORS.pubLanternRight.y}
        fill={'#FFAA3318'} opacity={0} compositeOperation={'screen'} />
      <Circle ref={lanternRight1} width={80} height={112} x={ANCHORS.pubLanternRight.x} y={ANCHORS.pubLanternRight.y}
        fill={'#FFE0A035'} opacity={0} compositeOperation={'screen'} />
    </>,
  );

  // ── Chimney Smoke ────────────────────────────────────────────────────────
  const smokeRefs = createRefArray<Circle>();
  for (const s of smokeParticles) {
    view.add(
      <Circle
        ref={smokeRefs}
        width={s.size * 2}
        height={s.size * 2}
        x={ANCHORS.chimney.x}
        y={ANCHORS.chimney.y}
        fill={'#8888AA'}
        opacity={0}
      />,
    );
  }

  // ── Dust Motes ───────────────────────────────────────────────────────────
  const dustLeftRefs = createRefArray<Circle>();
  const dustRightRefs = createRefArray<Circle>();
  for (const d of dustLeft) {
    view.add(
      <Circle
        ref={dustLeftRefs}
        width={d.size * 2}
        height={d.size * 2}
        x={d.x}
        y={d.y}
        fill={'#FFD080'}
        opacity={0}
        compositeOperation={'screen'}
      />,
    );
  }
  for (const d of dustRight) {
    view.add(
      <Circle
        ref={dustRightRefs}
        width={d.size * 2}
        height={d.size * 2}
        x={d.x}
        y={d.y}
        fill={'#FFD080'}
        opacity={0}
        compositeOperation={'screen'}
      />,
    );
  }

  // ── Ground Fog ───────────────────────────────────────────────────────────
  const fogRefs = createRefArray<Circle>();
  for (const f of fogParticles) {
    view.add(
      <Circle
        ref={fogRefs}
        width={f.size * 36}
        height={f.size * 10}
        x={f.x}
        y={f.y}
        fill={'#9888A812'}
        opacity={0}
      />,
    );
  }

  // ── Vignette ─────────────────────────────────────────────────────────────
  const vignette = createRef<Circle>();
  view.add(
    <Circle
      ref={vignette}
      width={W * 1.5}
      height={H * 1.5}
      fill={'#080410'}
      opacity={0}
      compositeOperation={'multiply'}
    />,
  );

  // ── Title Text (on the roof) ────────────────────────────────────────────
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  view.add(
    <>
      <Txt
        ref={title}
        text={'PROFESSOR PINT'}
        fontSize={72}
        fontFamily={'serif'}
        fontWeight={700}
        fill={'#f5e6c8'}
        y={-360}  // On the roof
        opacity={0}
        letterSpacing={8}
        shadowColor={'#000000'}
        shadowBlur={15}
        shadowOffsetY={3}
      />
      <Txt
        ref={subtitle}
        text={'Philosophy on Tap'}
        fontSize={32}
        fontFamily={'serif'}
        fontStyle={'italic'}
        fill={'#ffb74d'}
        y={-310}  // Below title
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={10}
        shadowOffsetY={2}
      />
    </>,
  );

  // ══════════════════════════════════════════════════════════════════════════
  // ANIMATION TIMELINE
  // ══════════════════════════════════════════════════════════════════════════

  // 1. Fade in background
  yield* bg().opacity(1, 2.5, easeInOutCubic);

  // 2. Stars appear sequentially
  yield* all(
    ...starRefs.map((star, i) =>
      star.opacity(stars[i].brightness * 0.7, 1.8 + i * 0.04, easeInOutSine),
    ),
  );

  // 3. Lights activate
  yield* all(
    // Moon
    moonGlow1().opacity(1, 1.5, easeInOutCubic),
    moonGlow2().opacity(1, 1.5, easeInOutCubic),
    moonGlow3().opacity(1, 1.5, easeInOutCubic),

    // Street lamps
    lampLeftInner().opacity(1, 1.2, easeInOutCubic),
    lampLeftMid().opacity(1, 1.2, easeInOutCubic),
    lampLeftOuter().opacity(1, 1.2, easeInOutCubic),
    lampRightInner().opacity(1, 1.2, easeInOutCubic),
    lampRightMid().opacity(1, 1.2, easeInOutCubic),
    lampRightOuter().opacity(1, 1.2, easeInOutCubic),

    // Window
    windowGlow().opacity(1, 1.5, easeInOutCubic),
    floorGlow().opacity(1, 1.5, easeInOutCubic),

    // Pub lanterns
    lanternLeft1().opacity(1, 1.3, easeInOutCubic),
    lanternLeft2().opacity(1, 1.3, easeInOutCubic),
    lanternRight1().opacity(1, 1.3, easeInOutCubic),
    lanternRight2().opacity(1, 1.3, easeInOutCubic),

    // Atmospheric
    vignette().opacity(0.3, 2, easeInOutCubic),
  );

  // 4. Smoke and particles come alive
  yield* all(
    ...smokeRefs.map((s, i) => s.opacity(smokeParticles[i].opacity, 1.5, easeInOutCubic)),
    ...dustLeftRefs.map((d, i) => d.opacity(dustLeft[i].opacity * 0.7, 1.5, easeInOutCubic)),
    ...dustRightRefs.map((d, i) => d.opacity(dustRight[i].opacity * 0.7, 1.5, easeInOutCubic)),
    ...fogRefs.map((f, i) => f.opacity(fogParticles[i].opacity * 0.5, 2, easeInOutCubic)),
    character().opacity(1, 1.5, easeInOutCubic),
  );

  yield* waitFor(0.5);

  // 5. Title card
  yield* sequence(
    0.3,
    title().opacity(1, 1, easeInOutCubic),
    subtitle().opacity(1, 0.8, easeInOutCubic),
  );

  yield* waitFor(2.5);

  // 6. Title fades out
  yield* all(
    title().opacity(0, 0.8, easeInOutCubic),
    subtitle().opacity(0, 0.6, easeInOutCubic),
  );

  yield* waitFor(0.5);

  // ══════════════════════════════════════════════════════════════════════════
  // AMBIENT LOOP — Continuous atmospheric animation
  // ══════════════════════════════════════════════════════════════════════════

  yield* loop(Infinity, function* () {
    const loopStart = frameSignal();

    // Run 5 seconds of animation, then repeat
    yield* all(
      // Frame counter
      frameSignal(loopStart + 150, 5, linear),

      // Character walk cycle (right to left, ~10 seconds per pass)
      loop(1, function* () {
        const walkDuration = 10;
        const startX = W * 0.15;
        const endX = -W * 0.15;

        // Walk across with step animation
        yield* all(
          // Horizontal walk
          character().x(endX, walkDuration, linear),

          // Step cycle (bob + lean + sway)
          // Using nested loop for continuous stepping
          loop(Math.ceil(walkDuration * 2), function* () {
            const stepDur = 0.5; // ~2 steps per second

            // Step down → step up
            yield* all(
              // Vertical bob
              character().y(H * 0.08 + 4, stepDur / 2, easeInOutSine),
              // Body lean forward
              character().rotation(-1.5, stepDur / 2, easeInOutSine),
              // Lateral sway right
              character().x(character().x() + 2, stepDur / 2, easeInOutSine),
            );

            yield* all(
              // Return to ground
              character().y(H * 0.08, stepDur / 2, easeInOutSine),
              // Lean back
              character().rotation(0.5, stepDur / 2, easeInOutSine),
              // Sway left
              character().x(character().x() - 2, stepDur / 2, easeInOutSine),
            );
          }),
        );

        // Reset position for next loop
        character().x(startX);
        character().y(H * 0.08);
        character().rotation(0);
      }),

      // Stars twinkle at individual frequencies
      ...starRefs.map((star, i) => {
        const s = stars[i];
        const freq = 0.015 + s.speed;
        return loop(3, function* () {
          yield* star.opacity(s.brightness * 0.3, 1 / freq, easeInOutSine);
          yield* star.opacity(s.brightness * 0.9, 1 / freq, easeInOutSine);
        });
      }),

      // Moon glow pulsing
      loop(2, function* () {
        yield* all(
          moonGlow1().scale(1.15, 2.5, easeInOutSine),
          moonGlow2().scale(1.12, 2.5, easeInOutSine),
          moonGlow3().scale(1.08, 2.5, easeInOutSine),
        );
        yield* all(
          moonGlow1().scale(0.9, 2.5, easeInOutSine),
          moonGlow2().scale(0.92, 2.5, easeInOutSine),
          moonGlow3().scale(0.95, 2.5, easeInOutSine),
        );
      }),

      // Street lamps multi-frequency pulsing
      loop(3, function* () {
        yield* all(
          lampLeftInner().scale(1.12, 1.5, easeInOutSine),
          lampLeftMid().scale(1.08, 1.7, easeInOutSine),
          lampRightInner().scale(1.10, 1.8, easeInOutSine),
          lampRightMid().scale(1.06, 2.0, easeInOutSine),
        );
        yield* all(
          lampLeftInner().scale(0.92, 1.5, easeInOutSine),
          lampLeftMid().scale(0.94, 1.7, easeInOutSine),
          lampRightInner().scale(0.90, 1.8, easeInOutSine),
          lampRightMid().scale(0.93, 2.0, easeInOutSine),
        );
      }),

      // Window flicker
      loop(4, function* () {
        yield* windowGlow().scale(1.05, 1.2, easeInOutSine);
        yield* windowGlow().scale(0.98, 1.0, easeInOutSine);
      }),

      // Pub lanterns flicker
      loop(3, function* () {
        yield* all(
          lanternLeft1().scale(1.08, 1.3, easeInOutSine),
          lanternRight1().scale(1.06, 1.5, easeInOutSine),
        );
        yield* all(
          lanternLeft1().scale(0.94, 1.3, easeInOutSine),
          lanternRight1().scale(0.96, 1.5, easeInOutSine),
        );
      }),

      // Chimney smoke physics
      ...smokeRefs.map((s, i) => {
        const p = smokeParticles[i];
        return loop(1, function* () {
          const duration = p.lifetime / 30; // ~3-5 seconds per puff

          // Rise and expand
          yield* all(
            s.y(ANCHORS.chimney.y - 180, duration, linear),
            s.x(ANCHORS.chimney.x + p.xOff + p.drift * 100, duration, easeInOutSine),
            s.scale(3.5, duration, easeInOutCubic),
            s.opacity(0, duration, easeInOutCubic),
          );

          // Reset
          s.y(ANCHORS.chimney.y);
          s.x(ANCHORS.chimney.x + p.xOff);
          s.scale(1);
          s.opacity(p.opacity);
        });
      }),

      // Dust motes rising with sway
      ...dustLeftRefs.map((d, i) => {
        const p = dustLeft[i];
        return loop(2, function* () {
          yield* all(
            d.y(p.y - 150, 3 / p.speed, linear),
            sequence(
              0,
              d.x(p.x + 25, 1.5 / p.speed, easeInOutSine),
              d.x(p.x - 25, 1.5 / p.speed, easeInOutSine),
            ),
          );
          d.y(p.y + 50);
        });
      }),
      ...dustRightRefs.map((d, i) => {
        const p = dustRight[i];
        return loop(2, function* () {
          yield* all(
            d.y(p.y - 150, 3 / p.speed, linear),
            sequence(
              0,
              d.x(p.x - 25, 1.5 / p.speed, easeInOutSine),
              d.x(p.x + 25, 1.5 / p.speed, easeInOutSine),
            ),
          );
          d.y(p.y + 50);
        });
      }),

      // Ground fog drifting
      ...fogRefs.map((f, i) => {
        const p = fogParticles[i];
        const duration = 5 / p.speed;
        return loop(1, function* () {
          yield* all(
            f.x(p.x + W/2, duration, linear),
            sequence(
              0,
              f.y(p.y + 8, duration / 2, easeInOutSine),
              f.y(p.y - 8, duration / 2, easeInOutSine),
            ),
          );
          f.x(p.x - W/2);
        });
      }),
    );
  });
});
