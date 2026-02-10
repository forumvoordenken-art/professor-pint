import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// Wall Street Broker: slicked-back hair, power suit, red tie, cocky grin
// Used in stock market / trading scenes

interface WallStreetBrokerProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#F5D0A9',
  skinShadow: '#E0B890',
  outline: '#1A1A1A',
  suit: '#1A1A2E',
  suitDark: '#0F0F1E',
  suitPinstripe: 'rgba(255,255,255,0.06)',
  shirt: '#FFFFFF',
  shirtShadow: '#E8E8E8',
  tie: '#CC0000',
  tieDark: '#990000',
  tieClip: '#D4A012',
  hair: '#2A2A2A',
  hairDark: '#1A1A1A',
  hairShine: '#444444',
  eyeWhite: '#FFFFFF',
  iris: '#3A6080',
  pupil: '#1A1A1A',
  mouth: '#8B2020',
  tongue: '#CC5555',
  blush: '#FFAAAA',
  shine: 'rgba(255,255,255,0.5)',
  shoe: '#1A1A1A',
  watch: '#D4A012',
};

const SW = 3.5;

export const WallStreetBroker: React.FC<WallStreetBrokerProps> = ({
  emotion = 'neutral',
  previousEmotion = 'neutral',
  emotionTransitionProgress = 1,
  talking = false,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const idle = getIdleState(frame);
  const mouthShape = getMouthShape(frame, talking);
  const talkBounce = getTalkingBounce(frame, talking);
  const talkGesture = getTalkingGesture(frame, talking);

  const emo = useMemo(
    () => interpolateEmotions(previousEmotion, emotion, emotionTransitionProgress),
    [previousEmotion, emotion, emotionTransitionProgress],
  );

  const bodyY = idle.breathing.y + talkBounce;

  return (
    <svg
      viewBox="-130 -210 260 400"
      width={260 * scale}
      height={400 * scale}
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        <BrokerLegs />
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <BrokerBody />
        </g>
        <BrokerLeftArm gestureRotation={talkGesture} />
        <BrokerRightArm />
        <g transform={`translate(0, -105) rotate(${emo.headTilt})`}>
          <BrokerHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

const BrokerLegs: React.FC = () => (
  <g>
    <path d="M-16,68 L-20,135 L-8,135 Z" fill={COL.suit} stroke={COL.outline} strokeWidth={SW} />
    <path d="M16,68 L20,135 L8,135 Z" fill={COL.suit} stroke={COL.outline} strokeWidth={SW} />
    <ellipse cx={-18} cy={137} rx={15} ry={6} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={18} cy={137} rx={15} ry={6} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    {/* Shoe shine */}
    <ellipse cx={-22} cy={135} rx={5} ry={2} fill="rgba(255,255,255,0.1)" />
    <ellipse cx={22} cy={135} rx={5} ry={2} fill="rgba(255,255,255,0.1)" />
  </g>
);

const BrokerBody: React.FC = () => (
  <g>
    {/* Suit jacket - sharp shoulders */}
    <path
      d="M-48,-48 Q-48,-55 -32,-55 L32,-55 Q48,-55 48,-48 L44,65 Q44,75 0,78 Q-44,75 -44,65 Z"
      fill={COL.suit} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Pinstripes */}
    {[-20, -10, 0, 10, 20].map((x, i) => (
      <line key={`pin-${i}`} x1={x} y1={-45} x2={x + 2} y2={70} stroke={COL.suitPinstripe} strokeWidth={1} />
    ))}

    {/* Shirt visible in V */}
    <path d="M-12,-50 L0,15 L12,-50" fill={COL.shirt} stroke={COL.outline} strokeWidth={1.5} />

    {/* Tie */}
    <path d="M-5,-48 L0,30 L5,-48" fill={COL.tie} stroke={COL.outline} strokeWidth={1.5} />
    <path d="M-4,-48 L0,-42 L4,-48" fill={COL.tieDark} stroke={COL.outline} strokeWidth={1} />
    {/* Tie clip */}
    <rect x={-6} y={-15} width={12} height={2.5} rx={1} fill={COL.tieClip} stroke={COL.outline} strokeWidth={0.8} />

    {/* Lapels */}
    <path d="M-12,-50 L-22,-50 L-32,10" fill="none" stroke={COL.suitDark} strokeWidth={2} />
    <path d="M12,-50 L22,-50 L32,10" fill="none" stroke={COL.suitDark} strokeWidth={2} />

    {/* Pocket square */}
    <path d="M28,-30 L32,-22 L36,-30" fill="white" stroke={COL.outline} strokeWidth={1} />

    {/* Neck */}
    <rect x={-11} y={-52} width={22} height={10} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
  </g>
);

const BrokerLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-48, -28) rotate(${-10 + gestureRotation}, 0, 0)`}>
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.suit} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(-16, 36)">
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-8} cy={32} r={7.5} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
      {/* Watch */}
      <rect x={-4} y={22} width={10} height={7} rx={2} fill={COL.watch} stroke={COL.outline} strokeWidth={1.5} />
    </g>
  </g>
);

const BrokerRightArm: React.FC = () => (
  <g transform="translate(48, -28)">
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.suit} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(14, 36)">
      <line x1={0} y1={0} x2={4} y2={28} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={6} cy={32} r={7.5} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

interface BrokerHeadProps {
  emo: {
    eyeScaleY: number; eyeOffsetY: number; pupilScale: number;
    browLeftY: number; browRightY: number; browLeftRotation: number; browRightRotation: number;
    mouthCurve: number; mouthWidth: number; mouthOpen: number;
    blushOpacity: number; headTilt: number;
  };
  blink: number;
  pupil: { x: number; y: number };
  mouthShape: MouthShape;
  talking: boolean;
}

const BrokerHead: React.FC<BrokerHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Slicked back hair - back */}
    <path
      d="M-44,5 Q-50,-10 -45,-30 Q-38,-50 0,-55 Q38,-50 45,-30 Q50,-10 44,5
         L40,10 Q20,15 0,15 Q-20,15 -40,10 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />

    {/* Face */}
    <path
      d="M-42,0 Q-42,-35 0,-40 Q42,-35 42,0 L40,25 Q35,45 0,48 Q-35,45 -40,25 Z"
      fill={COL.skin} stroke={COL.outline} strokeWidth={SW}
    />

    {/* Hair front - slicked */}
    <path
      d="M-40,-20 Q-35,-42 0,-46 Q35,-42 40,-20 L38,-15 Q30,-35 0,-38 Q-30,-35 -38,-15 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2}
    />
    {/* Hair shine */}
    <path d="M-15,-38 Q0,-45 15,-38" fill="none" stroke={COL.hairShine} strokeWidth={2} opacity={0.3} />

    {/* Jawline (chiseled) */}
    <path d="M-32,20 Q-28,38 0,42 Q28,38 32,20" fill="none" stroke={COL.skinShadow} strokeWidth={1.5} opacity={0.3} />

    {/* Eyes */}
    <g transform={`translate(-15, ${-2 + emo.eyeOffsetY})`}>
      <BrokerEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(15, ${-2 + emo.eyeOffsetY})`}>
      <BrokerEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows - sharp, confident */}
    <g transform={`translate(-15, ${-14 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <path d="M-10,0 L10,-3" fill="none" stroke={COL.hair} strokeWidth={3} strokeLinecap="round" />
    </g>
    <g transform={`translate(15, ${-14 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <path d="M-10,-3 L10,0" fill="none" stroke={COL.hair} strokeWidth={3} strokeLinecap="round" />
    </g>

    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-26} cy={14} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={26} cy={14} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose */}
    <path d="M-3,6 Q0,14 3,6" fill="none" stroke={COL.outline} strokeWidth={2.2} strokeLinecap="round" />

    {/* Mouth */}
    <BrokerMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth}
      emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

interface BrokerEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const BrokerEye: React.FC<BrokerEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={8.5} ry={6.5} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={px} cy={py} r={4 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2.2 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.3} fill="white" opacity={0.8} />
  </g>
);

interface BrokerMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const BrokerMouth: React.FC<BrokerMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 6, 10][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 12 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},26 Q0,${26 + curve} ${hw},26`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 26)">
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.5}
        fill={COL.mouth} stroke={COL.outline} strokeWidth={2.5} />
      {openAmount > 6 && (
        <ellipse cx={2} cy={openAmount * 0.25} rx={hw * 0.5} ry={openAmount * 0.2} fill={COL.tongue} />
      )}
      {openAmount > 3 && (
        <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={2.5} fill="white" rx={1} />
      )}
    </g>
  );
};

export default WallStreetBroker;
