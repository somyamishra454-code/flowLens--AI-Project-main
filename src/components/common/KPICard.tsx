import React from 'react';
import { MiniChart } from './MiniChart';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; isPositive: boolean };
  sparklineData?: number[];
  sparklineColor?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
  animationDelay?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  sparklineData,
  sparklineColor = 'var(--cyan)',
  icon,
  accentColor,
  onClick,
  animationDelay = 0,
}) => {
  return (
    <div
      className="glass-card hover-lift"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
        borderTop: accentColor ? `2px solid ${accentColor}` : '2px solid transparent',
        animation: `fadeSlideUp 0.45s var(--ease-spring) ${animationDelay}ms both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow backdrop */}
      {accentColor && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: `radial-gradient(ellipse at 50% -20%, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ position: 'relative' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {title}
          </span>
          {icon && (
            <span style={{ color: accentColor ?? 'var(--text-3)', opacity: 0.8 }}>
              {icon}
            </span>
          )}
        </div>

        {/* Main value */}
        <div style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#fff',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          marginBottom: '6px',
          animation: `countUp 0.4s var(--ease-spring) ${animationDelay + 80}ms both`,
        }}>
          {value}
        </div>

        {/* Trend + subtitle row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {trend && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontSize: '11px',
              fontWeight: '600',
              color: trend.isPositive ? 'var(--emerald)' : 'var(--red)',
              background: trend.isPositive ? 'var(--emerald-dim)' : 'var(--red-dim)',
              padding: '2px 7px',
              borderRadius: '999px',
            }}>
              {trend.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0.8 }}>
          <MiniChart
            data={sparklineData}
            color={sparklineColor}
            height={44}
            width={110}
            filled
          />
        </div>
      )}

      {/* Click arrow hint */}
      {onClick && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '14px',
          color: 'var(--text-4)',
          transition: 'color var(--t-fast), transform var(--t-fast)',
        }}>
          <ArrowUpRight size={13} />
        </div>
      )}
    </div>
  );
};
