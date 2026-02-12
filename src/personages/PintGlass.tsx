import React from 'react';

interface PintGlassProps {
  liquidOffset?: number;
  scale?: number;
}

export const PintGlass: React.FC<PintGlassProps> = ({ liquidOffset = 0, scale = 1 }) => {
  return (
    <g transform={`scale(${scale})`}>
      {/* Glass body - classic pint shape, wider at top */}
      <defs>
        <clipPath id="pint-clip">
          <path d="M-14,2 L-11,-52 Q-10,-55 -8,-55 L8,-55 Q10,-55 11,-52 L14,2 Z" />
        </clipPath>
      </defs>

      {/* Beer liquid */}
      <g clipPath="url(#pint-clip)">
        <rect x={-14} y={-42 + liquidOffset} width={28} height={54} fill="#D4A012" opacity={0.85} />
        {/* Beer gradient (darker at bottom) */}
        <rect x={-14} y={-10} width={28} height={12} fill="#B8890F" opacity={0.3} />
      </g>

      {/* Foam - layered for realistic look */}
      <g clipPath="url(#pint-clip)">
        {/* Foam base */}
        <rect x={-13} y={-52 + liquidOffset} width={26} height={12} fill="#FFF8E7" opacity={0.95} />
        {/* Foam bubbles top layer */}
        <ellipse cx={-5} cy={-50 + liquidOffset} rx={5} ry={3.5} fill="white" opacity={0.7} />
        <ellipse cx={4} cy={-49 + liquidOffset} rx={4.5} ry={3} fill="white" opacity={0.6} />
        <ellipse cx={-1} cy={-52 + liquidOffset} rx={4} ry={2.5} fill="white" opacity={0.5} />
        <ellipse cx={7} cy={-51 + liquidOffset} rx={3} ry={2} fill="white" opacity={0.5} />
        <ellipse cx={-8} cy={-48 + liquidOffset} rx={3.5} ry={2.5} fill="white" opacity={0.4} />
        {/* Foam drip on side */}
        <ellipse cx={11} cy={-38} rx={2} ry={4} fill="#FFF8E7" opacity={0.6} />
      </g>

      {/* Glass outline */}
      <path
        d="M-14,-2 L-11,-52 Q-10,-55 -8,-55 L8,-55 Q10,-55 11,-52 L14,-2 Q14,2 10,2 L-10,2 Q-14,2 -14,-2 Z"
        fill="rgba(255,255,255,0.12)"
        stroke="#1A1A1A"
        strokeWidth={2.5}
      />

      {/* Glass highlight streak */}
      <line x1={-8} y1={-50} x2={-6} y2={-5} stroke="white" strokeWidth={1.8} opacity={0.2} />

      {/* Handle */}
      <path
        d="M14,-38 Q26,-36 26,-20 Q26,-4 14,-2"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={3}
      />
      <path
        d="M14,-36 Q24,-34 24,-20 Q24,-6 14,-4"
        fill="rgba(255,255,255,0.08)"
        stroke="none"
      />
    </g>
  );
};
