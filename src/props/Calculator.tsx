import React from 'react';

interface CalculatorProps {
  display?: string;
  scale?: number;
}

const COL = {
  body: '#2A2A2A',
  bodyLight: '#3A3A3A',
  screen: '#A8C8A0',
  screenText: '#1A2A1A',
  btnGray: '#555555',
  btnOrange: '#E07020',
  btnLight: '#888888',
  outline: '#1A1A1A',
};

export const Calculator: React.FC<CalculatorProps> = ({
  display = '1,000',
  scale = 1,
}) => {
  return (
    <g transform={`scale(${scale})`}>
      {/* Body */}
      <rect x={-28} y={-50} width={56} height={80} rx={5}
        fill={COL.body} stroke={COL.outline} strokeWidth={2} />
      <rect x={-26} y={-48} width={52} height={76} rx={4}
        fill={COL.bodyLight} opacity={0.3} />

      {/* Screen */}
      <rect x={-22} y={-44} width={44} height={18} rx={2}
        fill={COL.screen} stroke={COL.outline} strokeWidth={1.5} />
      <text x={20} y={-30} textAnchor="end" fontSize={11}
        fontFamily="'Courier New', monospace" fontWeight="bold" fill={COL.screenText}>
        {display}
      </text>

      {/* Button grid: 4x4 */}
      {[
        ['C', '±', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
      ].map((row, ri) =>
        row.map((label, ci) => {
          const bx = -20 + ci * 11;
          const by = -20 + ri * 12;
          const isOp = ci === 3;
          const isTop = ri === 0 && ci < 3;
          return (
            <g key={`btn-${ri}-${ci}`}>
              <rect x={bx} y={by} width={9} height={10} rx={2}
                fill={isOp ? COL.btnOrange : isTop ? COL.btnLight : COL.btnGray}
                stroke={COL.outline} strokeWidth={0.8} />
              <text x={bx + 4.5} y={by + 7.5} textAnchor="middle"
                fontSize={5.5} fill="white" fontFamily="sans-serif">
                {label}
              </text>
            </g>
          );
        }),
      )}

      {/* Bottom row: 0, ., = */}
      <rect x={-20} y={28} width={20} height={10} rx={2}
        fill={COL.btnGray} stroke={COL.outline} strokeWidth={0.8} />
      <text x={-10} y={35.5} textAnchor="middle" fontSize={5.5} fill="white" fontFamily="sans-serif">0</text>

      <rect x={2} y={28} width={9} height={10} rx={2}
        fill={COL.btnGray} stroke={COL.outline} strokeWidth={0.8} />
      <text x={6.5} y={35.5} textAnchor="middle" fontSize={5.5} fill="white" fontFamily="sans-serif">.</text>

      <rect x={13} y={28} width={9} height={10} rx={2}
        fill={COL.btnOrange} stroke={COL.outline} strokeWidth={0.8} />
      <text x={17.5} y={35.5} textAnchor="middle" fontSize={5.5} fill="white" fontFamily="sans-serif">=</text>
    </g>
  );
};

export default Calculator;
