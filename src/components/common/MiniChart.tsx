import React from 'react';

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  filled?: boolean;
  animate?: boolean;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  color = 'var(--cyan)',
  height = 48,
  width = 120,
  filled = true,
  animate = true,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;
  const w = width;
  const h = height;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  const gradId = `chart-grad-${color.replace(/[^a-z0-9]/gi, '')}${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {filled && (
        <path
          d={areaPath}
          fill={`url(#${gradId})`}
        />
      )}

      <path
        d={linePath}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={animate ? {
          strokeDasharray: 1000,
          strokeDashoffset: 0,
          animation: 'drawPath 1.2s ease-out both',
        } : undefined}
      />

      {/* End dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={color}
        stroke="var(--bg-0)"
        strokeWidth="1.5"
      />
    </svg>
  );
};
