import {makeScene2D, Circle, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  waitFor,
  loop,
  sequence,
  linear,
  easeInOutCubic,
  createRefArray,
  range,
} from '@motion-canvas/core';

/**
 * Professor Pint — Pub Interior Scene (proof of concept)
 *
 * Demonstrates Motion Canvas capabilities:
 * - Layered background composition
 * - Text animations (title cards)
 * - Procedural ambient effects (fireplace glow, dust particles)
 * - Scene transitions
 */
export default makeScene2D(function* (view) {
  // ── Colors ──────────────────────────────────────────────
  const COLORS = {
    wall: '#3a2518',
    wallLight: '#4a3528',
    bar: '#2a1a0e',
    barTop: '#5c3a1e',
    floor: '#4a3020',
    ceiling: '#2e1a10',
    lampGlow: '#ffb74d',
    fireGlow: '#ff6b35',
    moonlight: '#94b8d4',
    beer: '#d4920a',
    beerFoam: '#f5e6c8',
    text: '#f5e6c8',
    textShadow: '#1a0e06',
  };

  // ── Background layers ──────────────────────────────────
  // Ceiling
  const ceiling = createRef<Rect>();
  view.add(
    <Rect
      ref={ceiling}
      width={1920}
      height={300}
      y={-390}
      fill={COLORS.ceiling}
    />,
  );

  // Back wall
  const wall = createRef<Rect>();
  view.add(
    <Rect
      ref={wall}
      width={1920}
      height={600}
      y={-100}
      fill={COLORS.wall}
    />,
  );

  // Floor
  const floor = createRef<Rect>();
  view.add(
    <Rect
      ref={floor}
      width={1920}
      height={400}
      y={340}
      fill={COLORS.floor}
    />,
  );

  // ── Bar counter ────────────────────────────────────────
  const barCounter = createRef<Rect>();
  const barTop = createRef<Rect>();
  view.add(
    <>
      <Rect
        ref={barCounter}
        width={1200}
        height={250}
        x={-100}
        y={150}
        fill={COLORS.bar}
        radius={8}
      />
      <Rect
        ref={barTop}
        width={1250}
        height={25}
        x={-100}
        y={30}
        fill={COLORS.barTop}
        radius={4}
      />
    </>,
  );

  // ── Beer glass on bar ──────────────────────────────────
  const beerGlass = createRef<Rect>();
  const beerLiquid = createRef<Rect>();
  const beerFoam = createRef<Rect>();
  view.add(
    <>
      {/* Glass */}
      <Rect
        ref={beerGlass}
        width={50}
        height={90}
        x={-200}
        y={-20}
        fill={'rgba(255,255,255,0.15)'}
        radius={[0, 0, 4, 4]}
      />
      {/* Beer */}
      <Rect
        ref={beerLiquid}
        width={44}
        height={65}
        x={-200}
        y={-5}
        fill={COLORS.beer}
        radius={[0, 0, 3, 3]}
      />
      {/* Foam */}
      <Rect
        ref={beerFoam}
        width={48}
        height={18}
        x={-200}
        y={-42}
        fill={COLORS.beerFoam}
        radius={[6, 6, 0, 0]}
      />
    </>,
  );

  // ── Hanging lamps ──────────────────────────────────────
  const lampGlows = createRefArray<Circle>();
  const lampPositions = [-500, 0, 500];

  for (const lx of lampPositions) {
    view.add(
      <>
        {/* Lamp fixture */}
        <Rect
          width={30}
          height={40}
          x={lx}
          y={-350}
          fill={'#8b6914'}
          radius={4}
        />
        {/* Wire */}
        <Rect
          width={2}
          height={110}
          x={lx}
          y={-440}
          fill={'#555'}
        />
        {/* Glow */}
        <Circle
          ref={lampGlows}
          width={300}
          height={300}
          x={lx}
          y={-280}
          fill={`${COLORS.lampGlow}22`}
        />
      </>,
    );
  }

  // ── Fireplace glow (right side) ────────────────────────
  const fireGlow = createRef<Circle>();
  view.add(
    <Circle
      ref={fireGlow}
      width={400}
      height={350}
      x={750}
      y={100}
      fill={`${COLORS.fireGlow}18`}
    />,
  );

  // ── Moonlight patch (window top-right) ─────────────────
  const moonPatch = createRef<Rect>();
  view.add(
    <>
      {/* Window frame */}
      <Rect
        width={120}
        height={100}
        x={700}
        y={-320}
        fill={COLORS.moonlight}
        radius={8}
        opacity={0.6}
      />
      {/* Light patch on floor */}
      <Rect
        ref={moonPatch}
        width={150}
        height={80}
        x={650}
        y={380}
        fill={`${COLORS.moonlight}15`}
        rotation={-5}
      />
    </>,
  );

  // ── Dust particles ─────────────────────────────────────
  const dustParticles = createRefArray<Circle>();
  const dustData = range(15).map(() => ({
    x: Math.random() * 1600 - 800,
    y: Math.random() * 800 - 400,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 40 + 20,
    delay: Math.random() * 3,
  }));

  for (const d of dustData) {
    view.add(
      <Circle
        ref={dustParticles}
        width={d.size}
        height={d.size}
        x={d.x}
        y={d.y}
        fill={'#f5e6c844'}
      />,
    );
  }

  // ── Title text ─────────────────────────────────────────
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
        fill={COLORS.text}
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
        fill={COLORS.lampGlow}
        y={40}
        opacity={0}
      />
    </>,
  );

  // ── ANIMATION ──────────────────────────────────────────

  // 1. Fade in the scene (lamps glow up)
  yield* all(
    ...lampGlows.map((lamp, i) =>
      lamp.fill(`${COLORS.lampGlow}44`, 1.5 + i * 0.3, easeInOutCubic),
    ),
    fireGlow().fill(`${COLORS.fireGlow}30`, 2, easeInOutCubic),
  );

  // 2. Title card
  yield* sequence(
    0.3,
    title().opacity(1, 1, easeInOutCubic),
    subtitle().opacity(1, 0.8, easeInOutCubic),
  );

  yield* waitFor(2);

  // 3. Title fades out
  yield* all(
    title().opacity(0, 0.8),
    subtitle().opacity(0, 0.6),
  );

  yield* waitFor(0.5);

  // 4. Ambient loop: lamps pulse, fire flickers, dust drifts
  yield* all(
    // Lamp pulsing
    ...lampGlows.map((lamp, i) =>
      loop(4, () =>
        all(
          lamp.fill(`${COLORS.lampGlow}55`, 1.5 + i * 0.2, easeInOutCubic),
          lamp.fill(`${COLORS.lampGlow}33`, 1.5 + i * 0.2, easeInOutCubic),
        ),
      ),
    ),
    // Fire flickering
    loop(6, function* () {
      yield* all(
        fireGlow().fill(`${COLORS.fireGlow}38`, 0.8, easeInOutCubic),
        fireGlow().scale(1.05, 0.8, easeInOutCubic),
      );
      yield* all(
        fireGlow().fill(`${COLORS.fireGlow}20`, 1.0, easeInOutCubic),
        fireGlow().scale(0.95, 1.0, easeInOutCubic),
      );
    }),
    // Dust floating down
    ...dustParticles.map((p, i) =>
      loop(3, function* () {
        yield* all(
          p.y(p.y() + dustData[i].speed, 2, linear),
          p.opacity(0, 2, linear),
        );
        p.y(dustData[i].y);
        p.opacity(1);
      }),
    ),
  );
});
