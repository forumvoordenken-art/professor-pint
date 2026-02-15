import React from 'react';
import { Composition } from 'remotion';
import { HistoryOfMoneyFull } from './HistoryOfMoneyFull';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HistoryOfMoneyFull"
      component={HistoryOfMoneyFull}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={23400}
    />
  );
};
