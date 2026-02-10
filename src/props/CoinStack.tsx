import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';

interface CoinStackProps {
  count?: number;
  scale?: number;
  glow?: boolean;
}

const COIN_COLORS = {
  face: '#FFD700',
  edge: '#DAA520',
  edgeDark: '#B8860B',
  shine: 'rgba(255,255,255,0.5)',
  outline: '#1A1A1A',
  symbol: '#B8860B',
};

export const CoinStack: React.FC<CoinStackProps> = ({
  count = 5,
  scale = 1,
  glow = false,
}) => {
  const frame = useCurrentFrame();
  const shimmer = sineWave(frame, 0.5) * 0.15 + 0.85;

  return (
    <g transform={`scale(${scale})`}>
      {/* Glow effect */}
      {glow && (
        <ellipse cx={0} cy={-count * 6} rx={30} ry={25}
          fill="rgba(255,215,0,0.15)" opacity={shimmer} />
      )}

      {/* Stacked coins (bottom to top) */}
      {Array.from({ length: count }, (_, i) => {
        const y = -i * 6;
        const isTop = i === count - 1;
        return (
          <g key={`coin-${i}`} transform={`translate(0, ${y})`}>
            {/* Coin edge (side) */}
            <ellipse cx={0} cy={3} rx={16} ry={5} fill={COIN_COLORS.edgeDark} stroke={COIN_COLORS.outline} strokeWidth={1.2} />
            <rect x={-16} y={0} width={32} height={3} fill={COIN_COLORS.edge} />

            {/* Coin face */}
            <ellipse cx={0} cy={0} rx={16} ry={5} fill={COIN_COLORS.face} stroke={COIN_COLORS.outline} strokeWidth={1.5} />

            {/* Euro symbol on top coin */}
            {isTop && (
              <>
                <text x={0} y={2.5} textAnchor="middle" fontSize={7} fontWeight="bold"
                  fill={COIN_COLORS.symbol} fontFamily="serif">€</text>
                <ellipse cx={-5} cy={-1} rx={3} ry={1.5} fill={COIN_COLORS.shine} opacity={0.4} />
              </>
            )}

            {/* Shine on each coin */}
            <ellipse cx={-6} cy={-1} rx={4} ry={1.5} fill={COIN_COLORS.shine} opacity={0.2} />
          </g>
        );
      })}
    </g>
  );
};

export default CoinStack;
