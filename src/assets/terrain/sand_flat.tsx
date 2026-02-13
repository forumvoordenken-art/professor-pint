/**
 * sand_flat — Endless flat desert with heat shimmer, wind-blown sand, and bleached bones.
 *
 * Flat sand plane with warm gradient, heat shimmer waves near horizon, wind-blown
 * sand particles, sand ripple lines, desert scrub bushes, animal skull/bones,
 * scattered dark rocks, camel tracks, cracked earth patches, distant mirage,
 * sun hotspot, dust devil, sand color variation, lizard tracks.
 *
 * Oil painting style — muted layered tones, never flat CSS colors.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  SurfaceScatter,
  GroundMist,
  TerrainTexture,
  generateSurfaceElements,
  renderPebble,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'sand-flat';
const HORIZON = 560;

/* ── Ground gradient ── */
const GROUND_STOPS = [
  { offset: '0%', color: '#D8B878' },
  { offset: '12%', color: '#D0B070' },
  { offset: '30%', color: '#C8A868' },
  { offset: '50%', color: '#B89858' },
  { offset: '70%', color: '#A88848' },
  { offset: '85%', color: '#9A7C40' },
  { offset: '100%', color: '#907038' },
];

/* ── Sand ripple lines ── */
const rippleRng = seededRandom(3201);
const SAND_RIPPLES = Array.from({ length: 18 }, () => ({
  y: 620 + rippleRng() * 400,
  x1: rippleRng() * 300,
  length: 250 + rippleRng() * 700,
  curve: (rippleRng() - 0.5) * 24,
  opacity: 0.05 + rippleRng() * 0.08,
  thickness: 0.8 + rippleRng() * 0.8,
}));

/* ── Scattered dark rocks ── */
const ROCKS = generateSurfaceElements(30, 2201, { x: 0, y: 620, width: 1920, height: 400 },
  ['#7A6848', '#6A5838', '#8A7858', '#5A4828', '#7A6A50', '#685840']);

/* ── Sand color variation patches ── */
const patchRng = seededRandom(3301);
const SAND_PATCHES = Array.from({ length: 8 }, () => ({
  cx: patchRng() * 1920,
  cy: 620 + patchRng() * 380,
  rx: 80 + patchRng() * 180,
  ry: 20 + patchRng() * 40,
  lighter: patchRng() > 0.5,
  opacity: 0.04 + patchRng() * 0.06,
}));

/* ── Desert scrub bushes ── */
const scrubRng = seededRandom(4001);
const SCRUB_BUSHES = Array.from({ length: 4 }, () => ({
  cx: 150 + scrubRng() * 1620,
  cy: 650 + scrubRng() * 300,
  size: 10 + scrubRng() * 18,
  seed: scrubRng() * 1000,
}));

/* ── Animal skull/bones ── */
const SKULL = { cx: 750, cy: 780, size: 1.0 };

/* ── Camel/animal tracks ── */
const trackRng = seededRandom(5001);
const CAMEL_TRACKS = Array.from({ length: 14 }, (_, i) => ({
  cx: 1200 + i * 35 + (trackRng() - 0.5) * 8,
  cy: 720 - i * 18 + (trackRng() - 0.5) * 4,
  size: 2.5 - i * 0.12,
  opacity: 0.12 - i * 0.006,
}));

/* ── Cracked earth patches ── */
const crackRng = seededRandom(5501);
const CRACKED_PATCHES = Array.from({ length: 3 }, () => ({
  cx: crackRng() * 1920,
  cy: 680 + crackRng() * 300,
  size: 30 + crackRng() * 50,
}));

/* ── Cracked earth lines generator ── */
function generateCrackLines(cx: number, cy: number, size: number, seed: number): string[] {
  const rng = seededRandom(seed);
  const lines: string[] = [];
  const count = 5 + Math.floor(rng() * 5);
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const len = size * 0.3 + rng() * size * 0.7;
    const ex = cx + Math.cos(angle) * len;
    const ey = cy + Math.sin(angle) * len;
    const mx = cx + Math.cos(angle) * len * 0.5 + (rng() - 0.5) * size * 0.3;
    const my = cy + Math.sin(angle) * len * 0.5 + (rng() - 0.5) * size * 0.3;
    lines.push(`M${cx},${cy} Q${mx},${my} ${ex},${ey}`);
    // branch
    if (rng() > 0.4) {
      const bAngle = angle + (rng() - 0.5) * 1.2;
      const bLen = len * 0.4 + rng() * len * 0.3;
      const bx = mx + Math.cos(bAngle) * bLen;
      const by = my + Math.sin(bAngle) * bLen;
      lines.push(`M${mx},${my} L${bx},${by}`);
    }
  }
  return lines;
}

/* ── Lizard tracks ── */
const lizardRng = seededRandom(6001);
const LIZARD_TRACKS = Array.from({ length: 12 }, (_, i) => ({
  cx: 400 + i * 30 + (lizardRng() - 0.5) * 10,
  cy: 860 + Math.sin(i * 0.8) * 12 + (lizardRng() - 0.5) * 4,
}));

/* ── Wind-blown sand particles ── */
const windRng = seededRandom(7001);
const WIND_PARTICLES = Array.from({ length: 45 }, () => ({
  baseX: windRng() * 2200 - 140,
  baseY: HORIZON + 30 + windRng() * 350,
  speed: 0.25 + windRng() * 0.5,
  size: 0.6 + windRng() * 1.4,
  seed: windRng() * 1000,
}));

/* ── Heat shimmer lines ── */
const shimmerRng = seededRandom(7501);
const HEAT_SHIMMERS = Array.from({ length: 12 }, () => ({
  cx: shimmerRng() * 1920,
  width: 100 + shimmerRng() * 200,
  seed: shimmerRng() * 1000,
}));

/* ── Dust devil particles ── */
const dustRng = seededRandom(8001);
const DUST_DEVIL_PARTICLES = Array.from({ length: 20 }, () => ({
  angle: dustRng() * Math.PI * 2,
  radius: 3 + dustRng() * 25,
  height: dustRng() * 80,
  size: 0.5 + dustRng() * 2,
  speed: 0.5 + dustRng() * 1.5,
}));

export const SandFlat: React.FC<AssetProps> = ({ frame }) => {
  /* ── Dust devil position ── */
  const dustDevilX = useMemo(() => 1400, []);
  const dustDevilY = useMemo(() => 720, []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Horizon blend — heat haze zone ── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 90} height={180} color="#D8C090" opacity={0.5} />

      {/* ── Distant mirage — faint wavering water-like reflection ── */}
      <defs>
        <linearGradient id={`${ID}-mirage`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#88B8D0" stopOpacity={0.08} />
          <stop offset="50%" stopColor="#A0C8D8" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#D8C090" stopOpacity={0} />
        </linearGradient>
      </defs>
      {(() => {
        const mirageWobble = longCycleNoise(frame * 0.3, 9001) * 8;
        return (
          <ellipse cx={960 + longCycleNoise(frame * 0.02, 9002) * 30}
            cy={HORIZON + 12 + mirageWobble}
            rx={500 + longCycleNoise(frame * 0.1, 9003) * 40}
            ry={8 + Math.abs(longCycleNoise(frame * 0.15, 9004)) * 5}
            fill={`url(#${ID}-mirage)`} />
        );
      })()}

      {/* ── Heat shimmer waves ── */}
      <g opacity={0.06}>
        {HEAT_SHIMMERS.map((s, i) => {
          const shimY = HORIZON + 8 + longCycleNoise(frame * 0.7, s.seed) * 10;
          const shimH = 2 + Math.abs(longCycleNoise(frame * 0.35, s.seed + 10)) * 5;
          return (
            <ellipse key={i} cx={s.cx} cy={shimY} rx={s.width / 2} ry={shimH}
              fill="#F0D890" />
          );
        })}
      </g>

      {/* ── Base ground plane ── */}
      <GroundPlane id={ID} horizonY={HORIZON} stops={GROUND_STOPS} />

      {/* ── Sand color variation patches ── */}
      {SAND_PATCHES.map((p, i) => (
        <ellipse key={`patch-${i}`} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
          fill={p.lighter ? '#E0C888' : '#A08848'} opacity={p.opacity} />
      ))}

      {/* ── Sand ripple lines ── */}
      {SAND_RIPPLES.map((r, i) => {
        const drift = longCycleNoise(frame * 0.12, i * 23 + 100) * 18;
        return (
          <path key={`ripple-${i}`}
            d={`M${r.x1 + drift},${r.y} Q${r.x1 + r.length / 2},${r.y + r.curve} ${r.x1 + r.length + drift},${r.y}`}
            fill="none" stroke="#E0C480" strokeWidth={r.thickness} opacity={r.opacity} />
        );
      })}

      {/* ── Sun hotspot ── */}
      <defs>
        <radialGradient id={`${ID}-hot`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F8E8A8" stopOpacity={0.15} />
          <stop offset="40%" stopColor="#F0E0A0" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#F0E0A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={960 + longCycleNoise(frame * 0.04, 77) * 50} cy={730}
        rx={420} ry={160} fill={`url(#${ID}-hot)`} />

      {/* ── Cracked earth patches ── */}
      {CRACKED_PATCHES.map((cp, i) => {
        const lines = generateCrackLines(cp.cx, cp.cy, cp.size, 5500 + i * 100);
        return (
          <g key={`crack-${i}`}>
            {/* clay base visible through cracks */}
            <ellipse cx={cp.cx} cy={cp.cy} rx={cp.size} ry={cp.size * 0.5}
              fill="#9A8058" opacity={0.08} />
            {/* crack lines */}
            {lines.map((d, j) => (
              <path key={j} d={d} fill="none" stroke="#8A7048" strokeWidth={0.7} opacity={0.12} />
            ))}
          </g>
        );
      })}

      {/* ── Camel/animal tracks ── */}
      {CAMEL_TRACKS.map((t, i) => (
        <g key={`track-${i}`} opacity={t.opacity}>
          {/* paired hoof imprints */}
          <ellipse cx={t.cx - 3} cy={t.cy} rx={t.size * 0.6} ry={t.size * 0.9} fill="#A89058" />
          <ellipse cx={t.cx + 3} cy={t.cy} rx={t.size * 0.6} ry={t.size * 0.9} fill="#A89058" />
          {/* shadow inside print */}
          <ellipse cx={t.cx - 3} cy={t.cy + 0.5} rx={t.size * 0.35} ry={t.size * 0.5} fill="#8A7040" opacity={0.5} />
          <ellipse cx={t.cx + 3} cy={t.cy + 0.5} rx={t.size * 0.35} ry={t.size * 0.5} fill="#8A7040" opacity={0.5} />
        </g>
      ))}

      {/* ── Lizard tracks — tiny S-curves ── */}
      <g opacity={0.08}>
        <path
          d={`M${LIZARD_TRACKS[0].cx},${LIZARD_TRACKS[0].cy} ${LIZARD_TRACKS.map(
            (t) => `L${t.cx},${t.cy}`
          ).join(' ')}`}
          fill="none" stroke="#8A7848" strokeWidth={0.6} strokeDasharray="2,3" />
        {/* tiny foot marks along the trail */}
        {LIZARD_TRACKS.filter((_, i) => i % 2 === 0).map((t, i) => (
          <g key={`lfoot-${i}`}>
            <line x1={t.cx - 3} y1={t.cy - 2} x2={t.cx - 5} y2={t.cy - 4} stroke="#8A7848" strokeWidth={0.4} />
            <line x1={t.cx + 3} y1={t.cy + 2} x2={t.cx + 5} y2={t.cy + 4} stroke="#8A7848" strokeWidth={0.4} />
          </g>
        ))}
      </g>

      {/* ── Scattered rocks ── */}
      <SurfaceScatter elements={ROCKS} frame={frame} renderElement={renderPebble} />

      {/* ── Desert scrub bushes ── */}
      {SCRUB_BUSHES.map((b, i) => {
        const sway = longCycleNoise(frame * 0.3, b.seed) * 3;
        const s = b.size;
        return (
          <g key={`scrub-${i}`} transform={`translate(${b.cx}, ${b.cy})`} opacity={0.6}>
            {/* shadow on ground */}
            <ellipse cx={2} cy={s * 0.4} rx={s * 0.8} ry={s * 0.15} fill="#6A5830" opacity={0.2} />
            {/* thorny branches */}
            {[-35, -15, 5, 20, 40].map((angle, j) => {
              const rad = angle * Math.PI / 180;
              const len = s * (0.6 + (j % 2) * 0.4);
              return (
                <line key={j}
                  x1={0} y1={0}
                  x2={Math.sin(rad) * len + sway} y2={-Math.cos(rad) * len}
                  stroke="#6A5028" strokeWidth={1.2} strokeLinecap="round" />
              );
            })}
            {/* sparse dry leaves */}
            {[-20, 10, 30].map((angle, j) => {
              const rad = angle * Math.PI / 180;
              const dist = s * 0.5;
              return (
                <ellipse key={`leaf-${j}`}
                  cx={Math.sin(rad) * dist + sway * 0.5}
                  cy={-Math.cos(rad) * dist}
                  rx={2.5} ry={1.2}
                  fill="#8A8040" opacity={0.5}
                  transform={`rotate(${angle}, ${Math.sin(rad) * dist}, ${-Math.cos(rad) * dist})`} />
              );
            })}
            {/* trunk base */}
            <rect x={-1.5} y={-3} width={3} height={6} fill="#6A5028" rx={1} />
          </g>
        );
      })}

      {/* ── Animal skull/bones ── */}
      <g transform={`translate(${SKULL.cx}, ${SKULL.cy})`} opacity={0.4}>
        {/* skull — main oval */}
        <ellipse cx={0} cy={0} rx={14} ry={10} fill="#E8E0D0" />
        {/* eye sockets */}
        <ellipse cx={-4} cy={-2} rx={3} ry={2.5} fill="#C8B898" />
        <ellipse cx={4} cy={-2} rx={3} ry={2.5} fill="#C8B898" />
        {/* nasal cavity */}
        <ellipse cx={0} cy={2} rx={2} ry={2.5} fill="#D0C8B0" />
        {/* jaw/teeth line */}
        <path d="M-8,6 Q-4,8 0,7 Q4,8 8,6" fill="none" stroke="#C8B898" strokeWidth={0.8} />
        {/* horn stubs */}
        <path d="M-10,-4 Q-16,-10 -14,-16" fill="none" stroke="#D8D0C0" strokeWidth={2} strokeLinecap="round" />
        <path d="M10,-4 Q16,-10 14,-16" fill="none" stroke="#D8D0C0" strokeWidth={2} strokeLinecap="round" />
        {/* scattered rib bones nearby */}
        <ellipse cx={25} cy={8} rx={10} ry={1.5} fill="#D8D0C0" opacity={0.5} transform="rotate(15, 25, 8)" />
        <ellipse cx={28} cy={12} rx={8} ry={1.2} fill="#D8D0C0" opacity={0.4} transform="rotate(20, 28, 12)" />
        <ellipse cx={-20} cy={10} rx={7} ry={1} fill="#D8D0C0" opacity={0.35} transform="rotate(-10, -20, 10)" />
        {/* shadow under skull */}
        <ellipse cx={0} cy={10} rx={16} ry={4} fill="#8A7850" opacity={0.15} />
      </g>

      {/* ── Wind-blown sand particles ── */}
      <g opacity={0.1}>
        {WIND_PARTICLES.map((p, i) => {
          const windX = (frame * p.speed * 1.5) % 2400 - 240;
          const wobbleY = longCycleNoise(frame * 0.4, p.seed) * 4;
          const x = (p.baseX + windX) % 2400 - 240;
          return (
            <circle key={i} cx={x} cy={p.baseY + wobbleY}
              r={p.size} fill="#D8C080" />
          );
        })}
      </g>

      {/* ── Dust devil ── */}
      <g opacity={0.2}>
        {DUST_DEVIL_PARTICLES.map((dp, i) => {
          const spin = frame * dp.speed * 0.05 + dp.angle;
          const currentRadius = dp.radius * (1 - dp.height / 120);
          const px = dustDevilX + Math.cos(spin) * currentRadius +
            longCycleNoise(frame * 0.1, i * 17) * 8;
          const py = dustDevilY - dp.height +
            longCycleNoise(frame * 0.15, i * 23) * 5;
          return (
            <circle key={`dust-${i}`} cx={px} cy={py}
              r={dp.size} fill="#C8A868" opacity={0.4 - dp.height / 200} />
          );
        })}
        {/* dust devil base shadow */}
        <ellipse cx={dustDevilX} cy={dustDevilY + 5} rx={20} ry={5}
          fill="#8A7040" opacity={0.1} />
      </g>

      {/* ── Painterly texture ── */}
      <TerrainTexture id={ID} y={HORIZON} height={520} color="#8A7040" opacity={0.02} seed={3401} dotCount={55} />

      {/* ── Heat haze mist near horizon ── */}
      <GroundMist id={ID} y={HORIZON + 25} color="#E0D0A0" opacity={0.08} frame={frame} count={5} seed={4201} />

      {/* ── Warm color grade ── */}
      <rect x={0} y={HORIZON} width={1920} height={520} fill="#F0D080" opacity={0.04} />

      {/* ── Bottom shadow vignette ── */}
      <defs>
        <linearGradient id={`${ID}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="88%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default SandFlat;
