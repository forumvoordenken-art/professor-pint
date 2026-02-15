import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ProfessorPint} from '../characters/ProfessorPint';

export const ProfessorPintShowroom: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#E5E7EB'}}>
      <ProfessorPint scale={0.9} x={80} y={90} />
      <ProfessorPint scale={1.2} x={700} y={20} />
      <ProfessorPint scale={1.8} x={1300} y={-220} />
    </AbsoluteFill>
  );
};
