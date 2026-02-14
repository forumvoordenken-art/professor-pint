/**
 * NightSkyPub — Deep blue night sky with full moon, clouds, and stars
 *
 * Layers:
 *  - Sky gradient (deep navy → dark purple → muted blue)
 *  - Moon with crater details and outer glow
 *  - Stylized clouds at multiple depths
 *  - Stars with twinkle animation
 *
 * Default size: Full canvas (1920×1080)
 * Category: sky
 */

import React from 'react';

interface NightSkyPubProps {
  frame: number;
  width?: number;
  height?: number;
}

const sin = (f: number, freq: number, phase = 0) =>
  Math.sin(f * freq * Math.PI * 2 + phase);

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Pre-generate stars
const STARS = Array.from({ length: 55 }, (_, i) => ({
  cx: 30 + rand(i * 1.1 + 100) * 1860,
  cy: 15 + rand(i * 2.3 + 200) * 480,
  r: 0.8 + rand(i * 3.7 + 300) * 2.5,
  twinkleSpeed: 0.015 + rand(i * 4.1 + 400) * 0.05,
  phase: rand(i * 5.9 + 500) * Math.PI * 2,
  brightness: 0.4 + rand(i * 6.3 + 600) * 0.6,
}));

export const NightSkyPub: React.FC<NightSkyPubProps> = ({
  frame,
  width = 1920,
  height = 1080,
}) => {
  const moonPulse = 0.92 + sin(frame, 0.006, 0) * 0.08;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
    >
      <defs>
        {/* Sky gradient — rich deep blues to purple */}
        <linearGradient id="night-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="15%" stopColor="#0f1528" />
          <stop offset="35%" stopColor="#151c3a" />
          <stop offset="55%" stopColor="#1a2244" />
          <stop offset="75%" stopColor="#1e2850" />
          <stop offset="100%" stopColor="#243058" />
        </linearGradient>

        {/* Moon glow */}
        <radialGradient id="moon-outer-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDE8" stopOpacity={0.35 * moonPulse} />
          <stop offset="25%" stopColor="#E8E0D0" stopOpacity={0.2 * moonPulse} />
          <stop offset="50%" stopColor="#C8B8A0" stopOpacity={0.1 * moonPulse} />
          <stop offset="100%" stopColor="#8070AA" stopOpacity={0} />
        </radialGradient>

        {/* Moon surface gradient */}
        <radialGradient id="moon-surface" cx="40%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFFEF0" />
          <stop offset="30%" stopColor="#F5ECD0" />
          <stop offset="60%" stopColor="#E8DDB8" />
          <stop offset="100%" stopColor="#D4C8A0" />
        </radialGradient>

        {/* Cloud gradient */}
        <linearGradient id="cloud-grad-1" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#1a1f3a" stopOpacity={0.7} />
          <stop offset="50%" stopColor="#252b4a" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#1a1f3a" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id="cloud-grad-2" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#1e2340" stopOpacity={0.6} />
          <stop offset="50%" stopColor="#2a3050" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#1e2340" stopOpacity={0.25} />
        </linearGradient>

        {/* Subtle sky haze near horizon */}
        <linearGradient id="horizon-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#243058" stopOpacity={0} />
          <stop offset="60%" stopColor="#2a3660" stopOpacity={0} />
          <stop offset="85%" stopColor="#3a4570" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#4a5580" stopOpacity={0.5} />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect x="0" y="0" width={width} height={height} fill="url(#night-sky-grad)" />

      {/* Horizon haze */}
      <rect x="0" y="0" width={width} height={height} fill="url(#horizon-haze)" />

      {/* Stars */}
      {STARS.map((s, i) => {
        const twinkle = 0.3 + Math.abs(sin(frame, s.twinkleSpeed, s.phase)) * 0.7;
        return (
          <circle
            key={`star-${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r * twinkle}
            fill="#FFFDE8"
            opacity={s.brightness * twinkle}
          />
        );
      })}

      {/* Moon outer glow (large, diffuse) */}
      <ellipse
        cx={1580}
        cy={180}
        rx={220}
        ry={200}
        fill="url(#moon-outer-glow)"
      />

      {/* Moon body */}
      <circle cx={1580} cy={180} r={65} fill="url(#moon-surface)" />

      {/* Moon craters — subtle darker spots */}
      <circle cx={1565} cy={168} r={8} fill="#D0C498" opacity={0.4} />
      <circle cx={1592} cy={195} r={12} fill="#C8BC90" opacity={0.35} />
      <circle cx={1570} cy={200} r={5} fill="#D0C498" opacity={0.3} />
      <circle cx={1600} cy={170} r={6} fill="#C8BC90" opacity={0.25} />
      <circle cx={1555} cy={190} r={4} fill="#D0C498" opacity={0.3} />

      {/* Moon highlight (top-left lit edge) */}
      <ellipse
        cx={1565}
        cy={165}
        rx={55}
        ry={50}
        fill="#FFFFF0"
        opacity={0.08}
      />

      {/* Cloud 1 — large, upper left */}
      <g opacity={0.7} transform={`translate(${sin(frame, 0.003, 0) * 8}, 0)`}>
        <ellipse cx={250} cy={140} rx={180} ry={50} fill="url(#cloud-grad-1)" />
        <ellipse cx={190} cy={130} rx={100} ry={45} fill="url(#cloud-grad-1)" />
        <ellipse cx={330} cy={135} rx={120} ry={40} fill="url(#cloud-grad-1)" />
        <ellipse cx={260} cy={120} rx={90} ry={35} fill="#1a1f3a" opacity={0.3} />
      </g>

      {/* Cloud 2 — mid left */}
      <g opacity={0.55} transform={`translate(${sin(frame, 0.004, 1.5) * 10}, 0)`}>
        <ellipse cx={150} cy={320} rx={200} ry={45} fill="url(#cloud-grad-2)" />
        <ellipse cx={80} cy={310} rx={110} ry={40} fill="url(#cloud-grad-2)" />
        <ellipse cx={250} cy={315} rx={130} ry={38} fill="url(#cloud-grad-2)" />
      </g>

      {/* Cloud 3 — right side, below moon */}
      <g opacity={0.5} transform={`translate(${sin(frame, 0.0035, 3.0) * 6}, 0)`}>
        <ellipse cx={1400} cy={300} rx={160} ry={42} fill="url(#cloud-grad-1)" />
        <ellipse cx={1340} cy={290} rx={100} ry={38} fill="url(#cloud-grad-1)" />
        <ellipse cx={1480} cy={295} rx={110} ry={35} fill="url(#cloud-grad-1)" />
      </g>

      {/* Cloud 4 — lower, wide */}
      <g opacity={0.4} transform={`translate(${sin(frame, 0.005, 4.5) * 12}, 0)`}>
        <ellipse cx={900} cy={450} rx={250} ry={35} fill="url(#cloud-grad-2)" />
        <ellipse cx={780} cy={445} rx={140} ry={30} fill="url(#cloud-grad-2)" />
        <ellipse cx={1050} cy={440} rx={160} ry={30} fill="url(#cloud-grad-2)" />
      </g>

      {/* Cloud 5 — small, lower left */}
      <g opacity={0.35} transform={`translate(${sin(frame, 0.0045, 2.0) * 7}, 0)`}>
        <ellipse cx={400} cy={500} rx={120} ry={28} fill="url(#cloud-grad-1)" />
        <ellipse cx={350} cy={495} rx={80} ry={25} fill="url(#cloud-grad-1)" />
      </g>
    </svg>
  );
};

export default NightSkyPub;
