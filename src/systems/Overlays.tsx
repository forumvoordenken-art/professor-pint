import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

// ---- Types ----

export type OverlayType = 'statCard' | 'barChart' | 'factBox' | 'topicCard';

export interface OverlayData {
  type: OverlayType;
  startFrame: number;
  endFrame: number;
  props: Record<string, unknown>;
}

// ---- Stat Card ----
// Shows a big number + label, e.g. "7.2%" / "Average Annual Return"

interface StatCardProps {
  value: string;
  label: string;
  startFrame: number;
  endFrame: number;
  position?: 'left' | 'right' | 'center';
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  startFrame,
  endFrame,
  position = 'right',
  color = '#D4A012',
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;
  const fadeIn = 12;
  const fadeOut = 10;

  const opacity = interpolate(
    localFrame,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const scale = interpolate(
    localFrame,
    [0, fadeIn],
    [0.8, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) },
  );

  const slideX = interpolate(
    localFrame,
    [0, fadeIn],
    [position === 'left' ? -60 : position === 'right' ? 60 : 0, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  );

  const posStyle: React.CSSProperties =
    position === 'left'
      ? { left: 80, top: 160 }
      : position === 'right'
        ? { right: 80, top: 160 }
        : { left: '50%', top: 160, transform: `translateX(-50%) scale(${scale}) translateX(${slideX}px)` };

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        opacity,
        transform: posStyle.transform ?? `scale(${scale}) translateX(${slideX}px)`,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        padding: '20px 32px',
        minWidth: 200,
      }}
    >
      <div style={{ color, fontSize: 64, fontWeight: 800, fontFamily: "'Segoe UI', sans-serif", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, fontWeight: 500, marginTop: 8, fontFamily: "'Segoe UI', sans-serif" }}>
        {label}
      </div>
    </div>
  );
};

// ---- Bar Chart ----
// Animated horizontal bars

interface BarChartProps {
  bars: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  startFrame: number;
  endFrame: number;
  position?: 'left' | 'right';
}

export const BarChart: React.FC<BarChartProps> = ({
  bars,
  title,
  startFrame,
  endFrame,
  position = 'left',
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;
  const maxValue = Math.max(...bars.map((b) => b.value));
  const fadeIn = 15;
  const fadeOut = 10;

  const opacity = interpolate(
    localFrame,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 60,
        top: 140,
        opacity,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 10,
        padding: '24px 28px',
        minWidth: 300,
      }}
    >
      {title && (
        <div style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 16, fontFamily: "'Segoe UI', sans-serif" }}>
          {title}
        </div>
      )}
      {bars.map((bar, i) => {
        // Stagger animation: each bar starts slightly later
        const barDelay = fadeIn + i * 5;
        const barProgress = interpolate(
          localFrame,
          [barDelay, barDelay + 15],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
        );
        const barWidth = (bar.value / maxValue) * 220 * barProgress;
        const barColor = bar.color ?? `hsl(${40 + i * 30}, 70%, 55%)`;

        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 4, fontFamily: "'Segoe UI', sans-serif" }}>
              {bar.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: barWidth,
                height: 20,
                backgroundColor: barColor,
                borderRadius: 4,
                transition: 'none',
              }} />
              <div style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: "'Segoe UI', sans-serif" }}>
                {Math.round(bar.value * barProgress)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---- Fact Box ----
// Callout box with an icon-like accent

interface FactBoxProps {
  text: string;
  accent?: string;
  startFrame: number;
  endFrame: number;
  position?: 'left' | 'right' | 'center';
}

export const FactBox: React.FC<FactBoxProps> = ({
  text,
  accent = '!',
  startFrame,
  endFrame,
  position = 'right',
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  const opacity = interpolate(
    localFrame,
    [0, 10, duration - 8, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const slideY = interpolate(
    localFrame,
    [0, 10],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  );

  const posStyle: React.CSSProperties =
    position === 'left'
      ? { left: 60, top: 320 }
      : position === 'right'
        ? { right: 60, top: 320 }
        : { left: '50%', top: 320, transform: `translateX(-50%) translateY(${slideY}px)` };

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        opacity,
        transform: posStyle.transform ?? `translateY(${slideY}px)`,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 10,
        padding: '18px 24px',
        maxWidth: 380,
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <div style={{
        backgroundColor: '#D4A012',
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'black',
        fontWeight: 800,
        fontSize: 20,
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        {accent}
      </div>
      <div style={{ color: 'white', fontSize: 20, lineHeight: 1.5, fontFamily: "'Segoe UI', sans-serif" }}>
        {text}
      </div>
    </div>
  );
};

// ---- Topic Card / Lower Third ----
// Appears at bottom-left showing topic name + subtitle

interface TopicCardProps {
  topic: string;
  subtitle?: string;
  startFrame: number;
  endFrame: number;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  subtitle = 'Professor Pint explains...',
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  const opacity = interpolate(
    localFrame,
    [0, 15, duration - 12, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const slideX = interpolate(
    localFrame,
    [0, 15],
    [-300, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  );

  // Bar reveal
  const barWidth = interpolate(
    localFrame,
    [5, 20],
    [0, 360],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        bottom: 160,
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      {/* Gold accent bar */}
      <div style={{ width: barWidth, height: 3, backgroundColor: '#D4A012', marginBottom: 8, borderRadius: 2 }} />
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '16px 28px',
        borderRadius: 6,
      }}>
        <div style={{ color: '#D4A012', fontSize: 16, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'Segoe UI', sans-serif" }}>
          {subtitle}
        </div>
        <div style={{ color: 'white', fontSize: 38, fontWeight: 800, marginTop: 4, fontFamily: "'Segoe UI', sans-serif" }}>
          {topic}
        </div>
      </div>
    </div>
  );
};

// ---- Overlay Renderer ----
// Renders overlays from a data array (for SceneRenderer integration)

interface OverlayRendererProps {
  overlays: OverlayData[];
}

export const OverlayRenderer: React.FC<OverlayRendererProps> = ({ overlays }) => {
  return (
    <>
      {overlays.map((overlay, i) => {
        const p = overlay.props;
        switch (overlay.type) {
          case 'statCard':
            return (
              <StatCard
                key={`overlay-${i}`}
                value={p.value as string}
                label={p.label as string}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
                position={p.position as 'left' | 'right' | 'center'}
                color={p.color as string}
              />
            );
          case 'barChart':
            return (
              <BarChart
                key={`overlay-${i}`}
                bars={p.bars as BarChartProps['bars']}
                title={p.title as string}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
                position={p.position as 'left' | 'right'}
              />
            );
          case 'factBox':
            return (
              <FactBox
                key={`overlay-${i}`}
                text={p.text as string}
                accent={p.accent as string}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
                position={p.position as 'left' | 'right' | 'center'}
              />
            );
          case 'topicCard':
            return (
              <TopicCard
                key={`overlay-${i}`}
                topic={p.topic as string}
                subtitle={p.subtitle as string}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
