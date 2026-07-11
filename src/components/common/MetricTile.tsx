import React from 'react';
import { GlassCard } from './GlassCard';

interface MetricTileProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  title,
  value,
  trend,
  subtitle,
  sparklineData = [30, 45, 35, 50, 40, 60, 55],
  sparklineColor = 'var(--color-cyan)',
  onClick,
  icon
}) => {
  // SVG Sparkline drawing helper
  const drawSparkline = (data: number[]) => {
    const width = 120;
    const height = 40;
    const padding = 2;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;

    const points = data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - min) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke={sparklineColor}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <GlassCard interactive={!!onClick} onClick={onClick} style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.03em', fontFamily: 'var(--font-sans)' }}>
              {value}
            </span>
            {trend && (
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: trend.isPositive ? 'var(--color-emerald)' : 'var(--color-red)'
              }}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '8px', 
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {subtitle}
        </span>
        {sparklineData && sparklineData.length > 0 && (
          <div style={{ opacity: 0.85 }}>
            {drawSparkline(sparklineData)}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
