import React from 'react';

export type CoinType = 'Gold' | 'Silver' | 'Bronze' | 'Bitcoin';

type CoinProps = {
  type: CoinType;
  size?: number;
  rotation?: number;
};

const COIN_STYLES: Record<CoinType, { outer: string; inner: string; symbol: string; ring: string }> = {
  Gold: {
    outer: '#B8860B',
    inner: '#F3CF72',
    symbol: 'G',
    ring: '#FFE29A',
  },
  Silver: {
    outer: '#6E7884',
    inner: '#C9D3DD',
    symbol: 'S',
    ring: '#EEF4FA',
  },
  Bronze: {
    outer: '#7A4D2A',
    inner: '#C1844B',
    symbol: 'B',
    ring: '#D9A474',
  },
  Bitcoin: {
    outer: '#9A5E07',
    inner: '#F7931A',
    symbol: '₿',
    ring: '#FFD08A',
  },
};

export const Coin: React.FC<CoinProps> = ({ type, size = 180, rotation = 0 }) => {
  const style = COIN_STYLES[type];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <defs>
        <radialGradient id={`coin-gradient-${type}`} cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.42" />
          <stop offset="45%" stopColor={style.inner} />
          <stop offset="100%" stopColor={style.outer} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill={style.outer} />
      <circle cx="100" cy="100" r="82" fill={`url(#coin-gradient-${type})`} stroke={style.ring} strokeWidth="6" />
      <circle cx="100" cy="100" r="68" fill="none" stroke={style.ring} strokeOpacity="0.65" strokeWidth="3" />
      <text
        x="100"
        y="122"
        textAnchor="middle"
        fontSize="72"
        fontWeight="800"
        fill="#1D1D1D"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {style.symbol}
      </text>
      <ellipse cx="78" cy="64" rx="30" ry="16" fill="#FFFFFF" opacity="0.16" />
    </svg>
  );
};
