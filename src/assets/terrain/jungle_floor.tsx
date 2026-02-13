/**
 * jungle_floor — Dichte tropische jungle bodem.
 *
 * Amazone, Maya, koloniale verkenning, biodiversiteit.
 * Dense tropical floor with roots, fallen leaves, filtered light.
 * Lush greens and browns, humid atmosphere.
 * Dappled sunlight filtering through canopy above.
 *
 * Features: multi-layer canopy, thick root system, fallen trunk,
 * orchids, bromeliads, fireflies, butterflies, poison dart frog,
 * dripping water, 80+ leaf litter, bracket fungi, lianas,
 * god rays, steam wisps, spider web, trailing vines, ferns.
 */

import React, { useMemo } from 'react';
import type { AssetProps } from '../../motor/SceneComposer';
import {
  GroundPlane,
  HorizonBlend,
  GroundMist,
  TerrainTexture,
  generateSurfaceElements,
  longCycleNoise,
  seededRandom,
} from './TerrainEngine';

const ID = 'jungle-floor';
const HORIZON = 500;

/* ── Color palettes ─────────────────────────────────────── */

const GROUND_STOPS = [
  { offset: '0%', color: '#3A5020' },
  { offset: '15%', color: '#2E4218' },
  { offset: '35%', color: '#2A3818' },
  { offset: '55%', color: '#222E14' },
  { offset: '75%', color: '#1C2610' },
  { offset: '100%', color: '#141C0A' },
];

const LEAF_COLORS = [
  '#8A6830', '#6A5020', '#A87838', '#5A4018', '#7A5828', '#4A6020',
  '#6B5530', '#9A7040', '#3E4E1A', '#887040', '#5E3E18', '#746228',
];

const CANOPY_GREENS = [
  ['#0C1E08', '#142A0C', '#0A1806'],   // deepest canopy
  ['#1A3010', '#22380E', '#162A0A'],   // mid canopy
  ['#243E14', '#2C4818', '#1E3610'],   // near canopy
  ['#2E5018', '#38581C', '#284414'],   // bright canopy
];

/* ── Static data (computed once via seededRandom) ──────── */

// Leaf litter — 90 fallen leaves in various decomposition stages
const LEAVES = generateSurfaceElements(
  90, 2701,
  { x: 0, y: 580, width: 1920, height: 480 },
  LEAF_COLORS,
);

// Exposed root system — 12 thick roots snaking across ground
const rootRng = seededRandom(2702);
const ROOTS = Array.from({ length: 12 }, () => {
  const startX = rootRng() * 1920;
  const startY = 620 + rootRng() * 320;
  const segs = 4 + Math.floor(rootRng() * 4);
  let path = `M${startX},${startY}`;
  for (let j = 0; j < segs; j++) {
    const dx = 25 + rootRng() * 70;
    const dy = (rootRng() - 0.35) * 35;
    const cx1 = dx * 0.3 + rootRng() * 10;
    const cy1 = dy - 12 + rootRng() * 6;
    const cx2 = dx * 0.7 + rootRng() * 10;
    const cy2 = dy + 8 - rootRng() * 6;
    path += ` c${cx1},${cy1} ${cx2},${cy2} ${dx},${dy}`;
  }
  return {
    path,
    width: 4 + rootRng() * 8,
    color: `rgb(${60 + Math.floor(rootRng() * 20)},${40 + Math.floor(rootRng() * 16)},${18 + Math.floor(rootRng() * 10)})`,
    barkSeed: Math.floor(rootRng() * 10000),
  };
});

// Mushrooms / bracket fungi positions
const fungiRng = seededRandom(2710);
const MUSHROOMS = Array.from({ length: 10 }, () => ({
  cx: fungiRng() * 1920,
  cy: 680 + fungiRng() * 340,
  r: 3 + fungiRng() * 6,
  color: ['#C86838', '#D88848', '#A85828', '#E8A858', '#B87040'][Math.floor(fungiRng() * 5)],
}));

// Firefly positions
const fireflyRng = seededRandom(2720);
const FIREFLIES = Array.from({ length: 18 }, () => ({
  cx: fireflyRng() * 1920,
  cy: 400 + fireflyRng() * 500,
  seed: Math.floor(fireflyRng() * 10000),
  size: 1.5 + fireflyRng() * 2.5,
}));

// Butterfly data
const butterflyRng = seededRandom(2730);
const BUTTERFLIES = Array.from({ length: 5 }, () => ({
  cx: 200 + butterflyRng() * 1520,
  cy: 450 + butterflyRng() * 300,
  seed: Math.floor(butterflyRng() * 10000),
  color: ['#E8C040', '#D06848', '#60A0D0', '#C848A0', '#48C878'][Math.floor(butterflyRng() * 5)],
  size: 4 + butterflyRng() * 4,
}));

// Orchid / bromeliad flowers on roots and trunk
const flowerRng = seededRandom(2740);
const FLOWERS = Array.from({ length: 8 }, () => ({
  cx: 100 + flowerRng() * 1720,
  cy: 600 + flowerRng() * 300,
  petals: 4 + Math.floor(flowerRng() * 4),
  size: 5 + flowerRng() * 8,
  color: ['#E84880', '#D060C0', '#F0A030', '#C830E0', '#E0E040', '#F06030', '#A050E0', '#40C8A0'][
    Math.floor(flowerRng() * 8)
  ],
  centerColor: ['#F8E840', '#E0C030', '#F0D060'][Math.floor(flowerRng() * 3)],
  angle: flowerRng() * 360,
  seed: Math.floor(flowerRng() * 10000),
}));

// Dripping water drop positions (from canopy)
const dripRng = seededRandom(2750);
const DRIPS = Array.from({ length: 10 }, () => ({
  x: 100 + dripRng() * 1720,
  startY: 380 + dripRng() * 100,
  endY: 700 + dripRng() * 300,
  seed: Math.floor(dripRng() * 10000),
  speed: 0.02 + dripRng() * 0.03,
}));

// Liana / hanging vine data
const lianaRng = seededRandom(2760);
const LIANAS = Array.from({ length: 8 }, () => {
  const topX = lianaRng() * 1920;
  const topY = 50 + lianaRng() * 100;
  const bottomY = 500 + lianaRng() * 350;
  const midX = topX + (lianaRng() - 0.5) * 120;
  return {
    topX, topY, midX, bottomY,
    width: 2 + lianaRng() * 4,
    color: `rgb(${50 + Math.floor(lianaRng() * 30)},${60 + Math.floor(lianaRng() * 20)},${15 + Math.floor(lianaRng() * 15)})`,
    seed: Math.floor(lianaRng() * 10000),
  };
});

// Fern positions at edges
const fernRng = seededRandom(2770);
const FERNS = Array.from({ length: 14 }, (_, i) => {
  const side = i < 7 ? 0 : 1;
  return {
    cx: side === 0 ? fernRng() * 300 : 1620 + fernRng() * 300,
    cy: 500 + fernRng() * 400,
    size: 30 + fernRng() * 40,
    angle: side === 0 ? -15 + fernRng() * 30 : -15 + fernRng() * 30,
    fronds: 5 + Math.floor(fernRng() * 4),
    color: `rgb(${30 + Math.floor(fernRng() * 30)},${70 + Math.floor(fernRng() * 40)},${15 + Math.floor(fernRng() * 15)})`,
    seed: Math.floor(fernRng() * 10000),
  };
});

// Trailing ground vines
const vineRng = seededRandom(2780);
const GROUND_VINES = Array.from({ length: 6 }, () => {
  const startX = vineRng() * 1920;
  const startY = 750 + vineRng() * 250;
  const segs = 5 + Math.floor(vineRng() * 5);
  let path = `M${startX},${startY}`;
  for (let j = 0; j < segs; j++) {
    const dx = 20 + vineRng() * 50;
    const dy = (vineRng() - 0.5) * 20;
    path += ` q${dx * 0.5},${dy - 5 + vineRng() * 10} ${dx},${dy}`;
  }
  return { path, seed: Math.floor(vineRng() * 10000) };
});

// Spider web anchor points
const WEB_CENTER = { x: 1400, y: 520 };
const WEB_RADIUS = 55;

/* ── Fallen trunk geometry (major feature) ─────────────── */
const TRUNK = {
  path: 'M280,760 Q480,720 720,740 Q960,760 1200,730 Q1400,710 1580,740',
  width: 38,
  barkColor: '#4A3820',
  mossColor: '#2A4818',
  highlightColor: '#6A5030',
};

/* ── Component ─────────────────────────────────────────── */

export const JungleFloor: React.FC<AssetProps> = ({ frame }) => {
  /* Pre-compute canopy blobs (no frame dependency) */
  const canopyLayers = useMemo(() =>
    CANOPY_GREENS.map((palette, layerIdx) => {
      const lr = seededRandom(8800 + layerIdx * 100);
      const count = 14 + layerIdx * 2;
      return Array.from({ length: count }, (_, i) => {
        const colorIdx = Math.floor(lr() * palette.length);
        return {
          cx: i * (1920 / count) + lr() * 80 - 40,
          cy: HORIZON - 60 + layerIdx * 35 + lr() * 30,
          rx: 70 + lr() * 50,
          ry: 50 + lr() * 40,
          fill: palette[colorIdx],
        };
      });
    }), [],
  );

  /* Pre-compute bracket fungi on fallen trunk */
  const bracketFungi = useMemo(() => {
    const br = seededRandom(2790);
    return Array.from({ length: 7 }, () => {
      const t = 0.1 + br() * 0.8;
      const cx = 280 + t * 1300;
      const cy = 725 + (br() - 0.5) * 30;
      return {
        cx, cy,
        width: 10 + br() * 14,
        height: 6 + br() * 8,
        color: ['#C8A060', '#A88040', '#D8B870', '#B89050'][Math.floor(br() * 4)],
        ringColor: '#8A6830',
      };
    });
  }, []);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ── Defs ─────────────────────────────────────── */}
      <defs>
        {/* Canopy shadow overlay */}
        <linearGradient id={`${ID}-canopy-shadow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060E04" stopOpacity={0.55} />
          <stop offset="25%" stopColor="#060E04" stopOpacity={0.35} />
          <stop offset="50%" stopColor="#060E04" stopOpacity={0.15} />
          <stop offset="75%" stopColor="#060E04" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#060E04" stopOpacity={0} />
        </linearGradient>

        {/* Firefly glow gradient (reused per firefly) */}
        <radialGradient id={`${ID}-firefly-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#D0F060" stopOpacity={0.9} />
          <stop offset="40%" stopColor="#A0D040" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#80B030" stopOpacity={0} />
        </radialGradient>

        {/* God ray gradient */}
        <linearGradient id={`${ID}-godray`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#E8E0A0" stopOpacity={0.12} />
          <stop offset="50%" stopColor="#D0C878" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#D0C878" stopOpacity={0} />
        </linearGradient>

        {/* Vignette */}
        <radialGradient id={`${ID}-vig`} cx="0.5" cy="0.6" r="0.65">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="50%" stopColor="#000" stopOpacity={0} />
          <stop offset="80%" stopColor="#000" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>

        {/* Water drop */}
        <radialGradient id={`${ID}-drop`} cx="0.4" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#C0D8E8" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#80A0B8" stopOpacity={0.3} />
        </radialGradient>
      </defs>

      {/* ── 1. Canopy shadow overlay (dark top zone) ── */}
      <rect x={0} y={0} width={1920} height={720} fill={`url(#${ID}-canopy-shadow)`} />

      {/* ── 2. Horizon blend — dark green vegetation wall ── */}
      <HorizonBlend id={`${ID}-hz`} y={HORIZON - 100} height={200} color="#0E2008" opacity={0.7} />

      {/* ── 3. Multi-layer canopy vegetation (4 layers, back to front) ── */}
      {canopyLayers.map((layer, layerIdx) => (
        <g key={layerIdx} opacity={0.55 + layerIdx * 0.1}>
          {layer.map((blob, i) => {
            const sway = longCycleNoise(frame * 0.06, layerIdx * 200 + i * 17) * 6;
            return (
              <ellipse key={i}
                cx={blob.cx + sway} cy={blob.cy}
                rx={blob.rx} ry={blob.ry}
                fill={blob.fill}
              />
            );
          })}
        </g>
      ))}

      {/* ── 4. Lianas hanging from canopy ── */}
      {LIANAS.map((l, i) => {
        const sway = longCycleNoise(frame * 0.08, l.seed) * 12;
        const midSway = longCycleNoise(frame * 0.06, l.seed + 50) * 18;
        return (
          <path key={i}
            d={`M${l.topX},${l.topY} Q${l.midX + midSway},${(l.topY + l.bottomY) * 0.5} ${l.topX + sway * 0.5},${l.bottomY}`}
            fill="none" stroke={l.color} strokeWidth={l.width}
            strokeLinecap="round" opacity={0.6}
          />
        );
      })}

      {/* ── 5. God rays — light shafts through canopy ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const baseX = 120 + i * 240;
        const drift = longCycleNoise(frame * 0.04, i * 37) * 30;
        const intensity = 0.5 + longCycleNoise(frame * 0.05, i * 53) * 0.4;
        const topWidth = 15 + i * 3;
        const bottomWidth = 80 + i * 15;
        const rayX = baseX + drift;
        return (
          <polygon key={i}
            points={`${rayX - topWidth},80 ${rayX + topWidth},80 ${rayX + bottomWidth},900 ${rayX - bottomWidth},900`}
            fill={`url(#${ID}-godray)`}
            opacity={Math.max(0, intensity) * 0.35}
          />
        );
      })}

      {/* ── 6. Base ground plane ── */}
      <GroundPlane id={ID} horizonY={HORIZON + 60} stops={GROUND_STOPS} />

      {/* ── 7. Dense undergrowth ferns at edges ── */}
      {FERNS.map((f, fi) => {
        const baseSway = longCycleNoise(frame * 0.07, f.seed) * 5;
        return (
          <g key={fi} transform={`translate(${f.cx},${f.cy}) rotate(${f.angle + baseSway})`} opacity={0.6}>
            {Array.from({ length: f.fronds }, (_, j) => {
              const frondAngle = -60 + (120 / (f.fronds - 1)) * j;
              const frondSway = longCycleNoise(frame * 0.08, f.seed + j * 30) * 4;
              const frondLen = f.size * (0.7 + 0.3 * Math.abs(j - f.fronds / 2) / (f.fronds / 2));
              return (
                <g key={j} transform={`rotate(${frondAngle + frondSway})`}>
                  {/* Frond spine */}
                  <line x1={0} y1={0} x2={0} y2={-frondLen}
                    stroke={f.color} strokeWidth={1.5} strokeLinecap="round" />
                  {/* Frond leaflets */}
                  {Array.from({ length: 6 }, (_, k) => {
                    const ly = -(frondLen * 0.2) - k * (frondLen * 0.13);
                    const lLen = (frondLen * 0.3) * (1 - k * 0.12);
                    return (
                      <g key={k}>
                        <line x1={0} y1={ly} x2={lLen} y2={ly - 4}
                          stroke={f.color} strokeWidth={1} opacity={0.7} />
                        <line x1={0} y1={ly} x2={-lLen} y2={ly - 4}
                          stroke={f.color} strokeWidth={1} opacity={0.7} />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        );
      })}

      {/* ── 8. Exposed tree roots (12 roots with bark texture) ── */}
      {ROOTS.map((r, i) => {
        const barkRng = seededRandom(r.barkSeed);
        return (
          <g key={i}>
            {/* Root shadow */}
            <path d={r.path} fill="none" stroke="#0A0804"
              strokeWidth={r.width + 3} strokeLinecap="round" opacity={0.15}
              transform="translate(2,3)" />
            {/* Root body */}
            <path d={r.path} fill="none" stroke={r.color}
              strokeWidth={r.width} strokeLinecap="round" opacity={0.65} />
            {/* Bark texture lines */}
            <path d={r.path} fill="none" stroke="#3A2810"
              strokeWidth={r.width * 0.15} strokeLinecap="round" opacity={0.2}
              strokeDasharray={`${2 + barkRng() * 4} ${3 + barkRng() * 5}`} />
            {/* Root highlight (top edge) */}
            <path d={r.path} fill="none" stroke="#7A6838"
              strokeWidth={r.width * 0.2} strokeLinecap="round" opacity={0.12} />
            {/* Moss on some roots */}
            {barkRng() > 0.4 && (
              <path d={r.path} fill="none" stroke="#2A5018"
                strokeWidth={r.width * 0.4} strokeLinecap="round" opacity={0.15}
                strokeDasharray={`${8 + barkRng() * 15} ${20 + barkRng() * 30}`} />
            )}
          </g>
        );
      })}

      {/* ── 9. Fallen tree trunk (major feature) ── */}
      <g>
        {/* Trunk shadow */}
        <path d={TRUNK.path} fill="none" stroke="#080604"
          strokeWidth={TRUNK.width + 8} strokeLinecap="round" opacity={0.2}
          transform="translate(4,6)" />
        {/* Trunk body */}
        <path d={TRUNK.path} fill="none" stroke={TRUNK.barkColor}
          strokeWidth={TRUNK.width} strokeLinecap="round" />
        {/* Bark texture — rough dashes */}
        <path d={TRUNK.path} fill="none" stroke="#3A2818"
          strokeWidth={TRUNK.width * 0.6} strokeLinecap="butt"
          strokeDasharray="3 8 5 12 2 6" opacity={0.2} />
        {/* Top highlight */}
        <path d={TRUNK.path} fill="none" stroke={TRUNK.highlightColor}
          strokeWidth={TRUNK.width * 0.2} strokeLinecap="round" opacity={0.2}
          transform="translate(0,-4)" />
        {/* Moss patches on trunk */}
        <path d={TRUNK.path} fill="none" stroke={TRUNK.mossColor}
          strokeWidth={TRUNK.width * 0.5} strokeLinecap="round" opacity={0.2}
          strokeDasharray="15 40 25 50 10 35" />
        {/* Broken branch stubs */}
        <line x1={520} y1={730} x2={530} y2={700} stroke="#4A3820" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
        <line x1={950} y1={745} x2={960} y2={710} stroke="#4A3820" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
        <line x1={1300} y1={720} x2={1290} y2={690} stroke="#4A3820" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
      </g>

      {/* ── 10. Bracket fungi on fallen trunk ── */}
      {bracketFungi.map((bf, i) => (
        <g key={i} opacity={0.6}>
          {/* Fungus body — half-ellipse shelf */}
          <ellipse cx={bf.cx} cy={bf.cy} rx={bf.width} ry={bf.height}
            fill={bf.color} />
          {/* Growth rings */}
          <ellipse cx={bf.cx} cy={bf.cy} rx={bf.width * 0.65} ry={bf.height * 0.6}
            fill="none" stroke={bf.ringColor} strokeWidth={0.6} opacity={0.4} />
          <ellipse cx={bf.cx} cy={bf.cy} rx={bf.width * 0.35} ry={bf.height * 0.35}
            fill="none" stroke={bf.ringColor} strokeWidth={0.4} opacity={0.3} />
          {/* Top highlight */}
          <ellipse cx={bf.cx - 2} cy={bf.cy - bf.height * 0.3} rx={bf.width * 0.4} ry={bf.height * 0.2}
            fill="white" opacity={0.06} />
        </g>
      ))}

      {/* ── 11. Trailing ground vines ── */}
      {GROUND_VINES.map((v, i) => {
        const sway = longCycleNoise(frame * 0.05, v.seed) * 3;
        return (
          <g key={i}>
            <path d={v.path} fill="none" stroke="#3A5818"
              strokeWidth={2} strokeLinecap="round" opacity={0.35}
              transform={`translate(${sway},0)`} />
            {/* Tiny leaves along vine */}
            <path d={v.path} fill="none" stroke="#4A6820"
              strokeWidth={4} strokeLinecap="round" opacity={0.15}
              strokeDasharray="2 18 3 22"
              transform={`translate(${sway},0)`} />
          </g>
        );
      })}

      {/* ── 12. Leaf litter (90 fallen leaves) ── */}
      {LEAVES.map((l, i) => {
        const rx = 3 + l.size * 6;
        const ry = rx * 0.45;
        const decomp = l.opacity;
        return (
          <g key={i}>
            <ellipse cx={l.cx} cy={l.cy} rx={rx} ry={ry}
              fill={l.color} opacity={decomp * 0.45}
              transform={`rotate(${l.angle * 4}, ${l.cx}, ${l.cy})`} />
            {/* Leaf vein */}
            <line x1={l.cx - rx * 0.6} y1={l.cy} x2={l.cx + rx * 0.6} y2={l.cy}
              stroke="#000" strokeWidth={0.3} opacity={decomp * 0.1}
              transform={`rotate(${l.angle * 4}, ${l.cx}, ${l.cy})`} />
          </g>
        );
      })}

      {/* ── 13. Mushrooms ── */}
      {MUSHROOMS.map((m, i) => (
        <g key={i} opacity={0.5}>
          <rect x={m.cx - 1.2} y={m.cy} width={2.4} height={m.r * 1.6}
            fill="#C8B888" rx={0.5} />
          <ellipse cx={m.cx} cy={m.cy} rx={m.r} ry={m.r * 0.55} fill={m.color} />
          <ellipse cx={m.cx - 1} cy={m.cy - 1} rx={m.r * 0.45} ry={m.r * 0.25}
            fill="white" opacity={0.08} />
          {/* Dots on cap */}
          <circle cx={m.cx + m.r * 0.3} cy={m.cy - 0.5} r={0.8} fill="white" opacity={0.1} />
          <circle cx={m.cx - m.r * 0.2} cy={m.cy + 0.5} r={0.6} fill="white" opacity={0.08} />
        </g>
      ))}

      {/* ── 14. Orchids and bromeliads ── */}
      {FLOWERS.map((fl, i) => {
        const sway = longCycleNoise(frame * 0.07, fl.seed) * 3;
        return (
          <g key={i} transform={`translate(${fl.cx + sway},${fl.cy}) rotate(${fl.angle})`} opacity={0.55}>
            {/* Petals */}
            {Array.from({ length: fl.petals }, (_, p) => {
              const petalAngle = (360 / fl.petals) * p;
              const px = Math.cos((petalAngle * Math.PI) / 180) * fl.size;
              const py = Math.sin((petalAngle * Math.PI) / 180) * fl.size;
              return (
                <ellipse key={p}
                  cx={px * 0.6} cy={py * 0.6}
                  rx={fl.size * 0.45} ry={fl.size * 0.22}
                  fill={fl.color}
                  transform={`rotate(${petalAngle}, ${px * 0.6}, ${py * 0.6})`}
                  opacity={0.75}
                />
              );
            })}
            {/* Center */}
            <circle cx={0} cy={0} r={fl.size * 0.18} fill={fl.centerColor} opacity={0.7} />
            {/* Stem hint */}
            <line x1={0} y1={fl.size * 0.3} x2={0} y2={fl.size * 1.2}
              stroke="#3A5818" strokeWidth={1.2} opacity={0.4} />
          </g>
        );
      })}

      {/* ── 15. Poison dart frog on a leaf ── */}
      {(() => {
        const frogY = 810;
        const frogX = 680;
        const frogBreath = longCycleNoise(frame * 0.15, 9901) * 0.5;
        return (
          <g transform={`translate(${frogX},${frogY})`} opacity={0.65}>
            {/* Leaf it sits on */}
            <ellipse cx={0} cy={3} rx={16} ry={6} fill="#4A6820" opacity={0.5} />
            {/* Body */}
            <ellipse cx={0} cy={0} rx={6} ry={4 + frogBreath} fill="#1838E8" />
            {/* Spots */}
            <circle cx={-2} cy={-1} r={1.2} fill="#F0D020" opacity={0.8} />
            <circle cx={2} cy={0.5} r={1} fill="#F0D020" opacity={0.8} />
            <circle cx={0} cy={1.5} r={0.8} fill="#F0D020" opacity={0.7} />
            {/* Head */}
            <ellipse cx={4} cy={-1} rx={3} ry={2.5 + frogBreath * 0.3} fill="#2040E0" />
            {/* Eyes */}
            <circle cx={5.5} cy={-2.5} r={1.2} fill="#1A1A1A" />
            <circle cx={5.5} cy={-2.5} r={0.5} fill="#E8E8E8" opacity={0.6} />
            {/* Front legs */}
            <line x1={3} y1={2} x2={8} y2={4} stroke="#1838E8" strokeWidth={1} strokeLinecap="round" />
            {/* Back legs */}
            <line x1={-4} y1={2} x2={-7} y2={5} stroke="#1838E8" strokeWidth={1.2} strokeLinecap="round" />
          </g>
        );
      })()}

      {/* ── 16. Spider web between branches ── */}
      <g opacity={0.12}>
        {/* Radial threads */}
        {Array.from({ length: 10 }, (_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          const ex = WEB_CENTER.x + Math.cos(angle) * WEB_RADIUS;
          const ey = WEB_CENTER.y + Math.sin(angle) * WEB_RADIUS;
          return (
            <line key={i} x1={WEB_CENTER.x} y1={WEB_CENTER.y} x2={ex} y2={ey}
              stroke="#E0E0E0" strokeWidth={0.4} />
          );
        })}
        {/* Spiral threads */}
        {Array.from({ length: 5 }, (_, ring) => {
          const r = WEB_RADIUS * (0.2 + ring * 0.18);
          const wobble = longCycleNoise(frame * 0.03, ring * 40 + 5000) * 1.5;
          return (
            <circle key={ring} cx={WEB_CENTER.x + wobble} cy={WEB_CENTER.y}
              r={r} fill="none" stroke="#E0E0E0" strokeWidth={0.3} />
          );
        })}
      </g>

      {/* ── 17. Dappled sunlight patches on ground ── */}
      {Array.from({ length: 10 }, (_, i) => {
        const baseX = 100 + i * 190;
        const baseY = 620 + (i % 3) * 60;
        const drift = longCycleNoise(frame * 0.08, i * 29) * 35;
        const intensity = 0.04 + Math.max(0, longCycleNoise(frame * 0.06, i * 41)) * 0.06;
        return (
          <ellipse key={i}
            cx={baseX + drift} cy={baseY}
            rx={60 + i * 8} ry={25 + i * 3}
            fill="#C8D068" opacity={intensity}
          />
        );
      })}

      {/* ── 18. Fireflies with animated glow ── */}
      {FIREFLIES.map((ff, i) => {
        const glowPhase = longCycleNoise(frame * 0.12, ff.seed);
        const glowIntensity = Math.max(0, glowPhase) * 0.8;
        const driftX = longCycleNoise(frame * 0.05, ff.seed + 100) * 25;
        const driftY = longCycleNoise(frame * 0.04, ff.seed + 200) * 15;
        if (glowIntensity < 0.05) return null;
        return (
          <g key={i}>
            {/* Glow halo */}
            <circle cx={ff.cx + driftX} cy={ff.cy + driftY}
              r={ff.size * 4} fill={`url(#${ID}-firefly-glow)`}
              opacity={glowIntensity * 0.5} />
            {/* Bright core */}
            <circle cx={ff.cx + driftX} cy={ff.cy + driftY}
              r={ff.size * 0.6} fill="#E0F860"
              opacity={glowIntensity} />
          </g>
        );
      })}

      {/* ── 19. Butterflies with wing flap ── */}
      {BUTTERFLIES.map((bf, i) => {
        const flapPhase = longCycleNoise(frame * 0.25, bf.seed);
        const wingSpread = 0.4 + (flapPhase + 1) * 0.3;
        const driftX = longCycleNoise(frame * 0.03, bf.seed + 300) * 60;
        const driftY = longCycleNoise(frame * 0.025, bf.seed + 400) * 30;
        return (
          <g key={i} transform={`translate(${bf.cx + driftX},${bf.cy + driftY})`} opacity={0.5}>
            {/* Left wing */}
            <ellipse cx={-bf.size * wingSpread} cy={0}
              rx={bf.size * 0.8} ry={bf.size * 0.5}
              fill={bf.color} opacity={0.6} />
            {/* Right wing */}
            <ellipse cx={bf.size * wingSpread} cy={0}
              rx={bf.size * 0.8} ry={bf.size * 0.5}
              fill={bf.color} opacity={0.6} />
            {/* Body */}
            <ellipse cx={0} cy={0} rx={1} ry={bf.size * 0.4}
              fill="#1A1A1A" opacity={0.6} />
            {/* Wing markings */}
            <circle cx={-bf.size * wingSpread * 0.7} cy={0} r={bf.size * 0.2}
              fill="#000" opacity={0.15} />
            <circle cx={bf.size * wingSpread * 0.7} cy={0} r={bf.size * 0.2}
              fill="#000" opacity={0.15} />
          </g>
        );
      })}

      {/* ── 20. Dripping water drops from canopy ── */}
      {DRIPS.map((d, i) => {
        const cycle = (frame * d.speed + d.seed * 0.001) % 1;
        const dropY = d.startY + cycle * (d.endY - d.startY);
        const fadeIn = Math.min(1, cycle * 5);
        const fadeOut = Math.min(1, (1 - cycle) * 5);
        const dropOpacity = fadeIn * fadeOut * 0.6;
        return (
          <g key={i} opacity={dropOpacity}>
            {/* Water drop */}
            <ellipse cx={d.x} cy={dropY} rx={1.5} ry={2.5}
              fill={`url(#${ID}-drop)`} />
            {/* Tiny highlight */}
            <circle cx={d.x - 0.3} cy={dropY - 1} r={0.5}
              fill="white" opacity={0.4} />
            {/* Splash ring at bottom (when near end) */}
            {cycle > 0.85 && (
              <ellipse cx={d.x} cy={d.endY}
                rx={(cycle - 0.85) * 80} ry={(cycle - 0.85) * 20}
                fill="none" stroke="#A0C0D0" strokeWidth={0.5}
                opacity={(1 - cycle) * 4} />
            )}
          </g>
        );
      })}

      {/* ── 21. Moss patches on ground ── */}
      {[
        { cx: 220, cy: 790, rx: 35, ry: 14 },
        { cx: 580, cy: 850, rx: 28, ry: 11 },
        { cx: 900, cy: 820, rx: 40, ry: 16 },
        { cx: 1200, cy: 880, rx: 30, ry: 12 },
        { cx: 1550, cy: 760, rx: 38, ry: 15 },
        { cx: 1750, cy: 840, rx: 25, ry: 10 },
      ].map((m, i) => (
        <ellipse key={i} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
          fill="#2A5818" opacity={0.2} />
      ))}

      {/* ── 22. Painterly terrain texture ── */}
      <TerrainTexture id={ID} y={HORIZON} height={580} color="#0A1808" opacity={0.035} seed={3801} dotCount={60} />

      {/* ── 23. Steam / humidity wisps rising from ground ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const baseX = 100 + i * 250;
        const riseSpeed = 0.03 + (i % 3) * 0.01;
        const riseY = longCycleNoise(frame * riseSpeed, 6000 + i * 47) * 60;
        const driftX = longCycleNoise(frame * 0.04, 6100 + i * 31) * 30;
        const pulse = 1 + longCycleNoise(frame * 0.05, 6200 + i * 19) * 0.2;
        return (
          <ellipse key={i}
            cx={baseX + driftX} cy={860 + riseY}
            rx={50 * pulse} ry={18 * pulse}
            fill="#3A5828" opacity={0.06}
          />
        );
      })}

      {/* ── 24. Ground mist (humid jungle fog) ── */}
      <GroundMist id={ID} y={900} color="#2A4020" opacity={0.18} frame={frame} count={8} seed={4701} />
      {/* Secondary lighter mist layer */}
      <GroundMist id={`${ID}-mist2`} y={820} color="#304828" opacity={0.08} frame={frame} count={5} seed={4801} />

      {/* ── 25. Green color grade — humid atmosphere ── */}
      <rect x={0} y={HORIZON} width={1920} height={580} fill="#283818" opacity={0.04} />

      {/* ── 26. Heavy vignette — dark jungle framing ── */}
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${ID}-vig)`} />
    </svg>
  );
};

export default JungleFloor;
