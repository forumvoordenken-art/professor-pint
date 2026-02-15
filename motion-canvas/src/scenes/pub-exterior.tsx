import {makeScene2D, Img, Circle, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  createRef,
  waitFor,
  loop,
  sequence,
  easeInOutCubic,
  createRefArray,
  range,
  linear,
} from '@motion-canvas/core';

/**
 * Professor Pint — Pub Exterior Scene
 *
 * Uses the actual pub-exterior-full.svg as background,
 * with procedural animation overlays on top.
 */
export default makeScene2D(function* (view) {
  // ── Background: your actual artwork ───────────────────
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

  // ── Stars twinkling ───────────────────────────────────
  const stars = createRefArray<Circle>();
  const starData = range(30).map(() => ({
    x: Math.random() * 1920 - 960,
    y: Math.random() * 300 - 500,
    size: Math.random() * 3 + 1,
    phase: Math.random() * Math.PI * 2,
  }));

  for (const s of starData) {
    view.add(
      <Circle
        ref={stars}
        width={s.size}
        height={s.size}
        x={s.x}
        y={s.y}
        fill={'#ffffff'}
        opacity={0}
      />,
    );
  }

  // ── Moon glow ─────────────────────────────────────────
  const moonGlow = createRef<Circle>();
  view.add(
    <Circle
      ref={moonGlow}
      width={120}
      height={120}
      x={1920 * 0.32}
      y={-1080 * 0.38}
      fill={'#ffeebb18'}
      opacity={0}
    />,
  );

  // ── Lamp glows (left and right) ───────────────────────
  const lampLeft = createRef<Circle>();
  const lampRight = createRef<Circle>();
  view.add(
    <>
      <Circle
        ref={lampLeft}
        width={250}
        height={350}
        x={1920 * -0.255}
        y={-1080 * 0.30}
        fill={'#ffb74d20'}
        opacity={0}
      />
      <Circle
        ref={lampRight}
        width={250}
        height={350}
        x={1920 * 0.255}
        y={-1080 * 0.30}
        fill={'#ffb74d20'}
        opacity={0}
      />
    </>,
  );

  // ── Window light ──────────────────────────────────────
  const windowGlow = createRef<Circle>();
  view.add(
    <Circle
      ref={windowGlow}
      width={300}
      height={200}
      x={0}
      y={-1080 * 0.05}
      fill={'#ffcc4415'}
      opacity={0}
    />,
  );

  // ── Ground fog ────────────────────────────────────────
  const fogParticles = createRefArray<Rect>();
  const fogData = range(20).map(() => ({
    x: Math.random() * 2200 - 1100,
    y: 1080 * 0.23 + Math.random() * 100,
    w: Math.random() * 200 + 100,
    h: Math.random() * 20 + 8,
    speed: Math.random() * 60 + 30,
  }));

  for (const f of fogData) {
    view.add(
      <Rect
        ref={fogParticles}
        width={f.w}
        height={f.h}
        x={f.x}
        y={f.y}
        fill={'#8899aa08'}
        radius={f.h}
        opacity={0}
      />,
    );
  }

  // ── Title text ────────────────────────────────────────
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  view.add(
    <>
      <Txt
        ref={title}
        text={'PROFESSOR PINT'}
        fontSize={90}
        fontFamily={'serif'}
        fontWeight={700}
        fill={'#f5e6c8'}
        y={-50}
        opacity={0}
        letterSpacing={8}
      />
      <Txt
        ref={subtitle}
        text={'Philosophy on Tap'}
        fontSize={36}
        fontFamily={'serif'}
        fontStyle={'italic'}
        fill={'#ffb74d'}
        y={40}
        opacity={0}
      />
    </>,
  );

  // ── ANIMATION ─────────────────────────────────────────

  // 1. Fade in the scene
  yield* bg().opacity(1, 2, easeInOutCubic);

  // 2. Stars appear
  yield* all(
    ...stars.map((star, i) =>
      star.opacity(starData[i].size > 2 ? 0.9 : 0.5, 1.5 + i * 0.05, easeInOutCubic),
    ),
  );

  // 3. Lights come alive
  yield* all(
    moonGlow().opacity(1, 1.5, easeInOutCubic),
    lampLeft().opacity(1, 1, easeInOutCubic),
    lampRight().opacity(1, 1, easeInOutCubic),
    windowGlow().opacity(1, 1.5, easeInOutCubic),
    ...fogParticles.map((f) => f.opacity(1, 2, easeInOutCubic)),
  );

  yield* waitFor(0.5);

  // 4. Title card
  yield* sequence(
    0.3,
    title().opacity(1, 1, easeInOutCubic),
    subtitle().opacity(1, 0.8, easeInOutCubic),
  );

  yield* waitFor(2);

  // 5. Title fades out
  yield* all(
    title().opacity(0, 0.8),
    subtitle().opacity(0, 0.6),
  );

  yield* waitFor(0.5);

  // 6. Ambient loop: stars twinkle, lamps pulse, fog drifts
  yield* all(
    // Stars twinkling
    ...stars.map((star, i) =>
      loop(4, function* () {
        yield* star.opacity(0.2, 1 + Math.random(), easeInOutCubic);
        yield* star.opacity(starData[i].size > 2 ? 0.9 : 0.5, 1 + Math.random(), easeInOutCubic);
      }),
    ),
    // Lamp pulsing
    loop(4, function* () {
      yield* all(
        lampLeft().scale(1.1, 1.5, easeInOutCubic),
        lampRight().scale(1.08, 1.8, easeInOutCubic),
      );
      yield* all(
        lampLeft().scale(0.95, 1.5, easeInOutCubic),
        lampRight().scale(0.92, 1.8, easeInOutCubic),
      );
    }),
    // Moon glow pulsing
    loop(3, function* () {
      yield* moonGlow().scale(1.15, 2.5, easeInOutCubic);
      yield* moonGlow().scale(0.9, 2.5, easeInOutCubic);
    }),
    // Fog drifting
    ...fogParticles.map((f, i) =>
      loop(3, function* () {
        yield* f.x(f.x() + fogData[i].speed, 3, linear);
        f.x(fogData[i].x);
      }),
    ),
  );
});
