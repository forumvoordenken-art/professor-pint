import React from 'react';

type SceneShellProps = {
  title: string;
  act?: string;
  children?: React.ReactNode;
};

export const SceneShell: React.FC<SceneShellProps> = ({title, act, children}) => {
  return (
    <div style={{width: '100%', height: '100%'}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label={title}>
        <rect x={0} y={0} width={1920} height={1080} fill="#1f2937" />
        <text x={48} y={72} fill="#f3f4f6" fontSize={36} fontWeight={700}>
          {title}
          {act ? ` · ${act}` : ''}
        </text>
        {children}
      </svg>
    </div>
  );
};
