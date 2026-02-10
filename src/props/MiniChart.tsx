import React from 'react';
import { useCurrentFrame } from 'remotion';
import { cubicEaseOut } from '../animations/easing';

interface MiniChartProps {
  /** Chart trend: up, down, or volatile */
  trend?: 'up' | 'down' | 'volatile';
  /** Line color */
  color?: string;
  scale?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  trend = 'up',
  color = '#2D5016',
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const drawProgress = cubicEaseOut(Math.min(1, frame / 45));

  const CHART = {
    up: 'M0,35 L10,30 L20,32 L30,25 L40,20 L50,22 L60,12 L70,5',
    down: 'M0,5 L10,10 L20,8 L30,18 L40,22 L50,20 L60,30 L70,35',
    volatile: 'M0,20 L10,8 L20,30 L30,12 L40,35 L50,10 L60,28 L70,15',
  };

  const path = CHART[trend];

  return (
    <g transform={`scale(${scale})`}>
      {/* Background card */}
      <rect x={-10} y={-10} width={90} height={55} rx={6}
        fill="white" stroke="#DDD" strokeWidth={1.5} opacity={0.95} />

      {/* Grid lines */}
      <line x1={0} y1={10} x2={70} y2={10} stroke="#EEE" strokeWidth={0.5} />
      <line x1={0} y1={20} x2={70} y2={20} stroke="#EEE" strokeWidth={0.5} />
      <line x1={0} y1={30} x2={70} y2={30} stroke="#EEE" strokeWidth={0.5} />

      {/* Chart line with draw animation */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={200}
        strokeDashoffset={200 * (1 - drawProgress)}
      />

      {/* End dot */}
      {drawProgress > 0.9 && (
        <circle cx={70} cy={trend === 'up' ? 5 : trend === 'down' ? 35 : 15}
          r={3} fill={color} opacity={drawProgress > 0.95 ? 1 : 0} />
      )}

      {/* Trend arrow */}
      {drawProgress > 0.95 && (
        <text x={75} y={trend === 'up' ? 10 : trend === 'down' ? 38 : 18}
          fontSize={10} fill={color} fontWeight="bold">
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '~'}
        </text>
      )}
    </g>
  );
};

export default MiniChart;
