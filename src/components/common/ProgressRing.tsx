import React from 'react';

interface ProgressRingProps {
  value: number;        // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  color = 'var(--cyan)',
  trackColor = 'rgba(255,255,255,0.04)',
  label,
  sublabel,
  animate = true,
}) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={animate ? {
            transition: 'stroke-dashoffset 1s var(--ease-spring)',
          } : undefined}
        />
      </svg>

      {/* Center label */}
      {(label !== undefined || sublabel !== undefined) && (
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {label !== undefined && (
            <div style={{
              fontSize: size > 70 ? '18px' : '13px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              {label}
            </div>
          )}
          {sublabel && (
            <div style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '2px', letterSpacing: '0.02em' }}>
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
