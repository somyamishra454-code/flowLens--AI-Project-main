import React, { useState } from 'react';
import type { OperationalAlert } from '../../types/operationalData';
import { ProgressRing } from './ProgressRing';
import { StatusBadge } from './StatusBadge';
import {
  AlertTriangle, ChevronDown, ChevronRight, Lightbulb, Target,
  TrendingUp, Zap, CheckCircle2
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface AIInsightCardProps {
  alert: OperationalAlert;
  expanded?: boolean;
  animationDelay?: number;
}

const SEV_MAP = {
  critical: {
    border: 'var(--red)',
    bg: 'rgba(239,68,68,0.04)',
    status: 'critical' as const,
    glow: 'rgba(239,68,68,0.15)',
  },
  warning: {
    border: 'var(--amber)',
    bg: 'rgba(245,158,11,0.04)',
    status: 'warning' as const,
    glow: 'rgba(245,158,11,0.12)',
  },
  info: {
    border: 'var(--cyan)',
    bg: 'rgba(6,182,212,0.03)',
    status: 'info' as const,
    glow: 'rgba(6,182,212,0.10)',
  },
};

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  alert,
  expanded: defaultExpanded = false,
  animationDelay = 0,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [applying, setApplying] = useState(false);
  const { applyRecommendation } = useRestaurant();

  const sev = SEV_MAP[alert.severity] ?? SEV_MAP.info;

  const handleApply = async () => {
    setApplying(true);
    await new Promise(r => setTimeout(r, 900));
    applyRecommendation(alert.id);
    setApplying(false);
  };

  if (alert.resolved) {
    return (
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '3px solid var(--emerald)',
          animation: `fadeSlideUp 0.4s var(--ease-spring) ${animationDelay}ms both`,
          opacity: 0.7,
        }}
      >
        <CheckCircle2 size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-1)' }}>{alert.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>Resolved — action applied successfully</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card"
      style={{
        borderLeft: `3px solid ${sev.border}`,
        background: sev.bg,
        animation: `fadeSlideUp 0.45s var(--ease-spring) ${animationDelay}ms both`,
        boxShadow: `var(--glass-shadow), -4px 0 24px ${sev.glow}`,
        padding: '18px 20px',
      }}
    >
      {/* Header row */}
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}
        onClick={() => setExpanded(p => !p)}
      >
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: `${sev.border}18`,
          border: `1px solid ${sev.border}28`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <AlertTriangle size={15} style={{ color: sev.border }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <StatusBadge status={sev.status} size="sm" />
            <span style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
              {alert.timestamp}
            </span>
          </div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '650',
            color: 'var(--text-1)',
            marginTop: '5px',
            letterSpacing: '-0.015em',
          }}>
            {alert.title}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '4px', lineHeight: 1.5 }}>
            {alert.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <ProgressRing
            value={alert.confidenceScore}
            size={52}
            strokeWidth={4}
            color={sev.border}
            label={`${alert.confidenceScore}`}
            sublabel="conf"
          />
          <div style={{ color: 'var(--text-4)', transition: 'color var(--t-fast)', transform: expanded ? 'rotate(180deg)' : 'none', transitionProperty: 'transform' }}>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Savings pill */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--emerald)',
          background: 'var(--emerald-dim)',
          padding: '4px 10px',
          borderRadius: '999px',
          border: '1px solid rgba(16,185,129,0.20)',
        }}>
          <TrendingUp size={11} />
          {alert.expectedSavings}
        </span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          color: 'var(--text-3)',
          background: 'rgba(255,255,255,0.03)',
          padding: '4px 10px',
          borderRadius: '999px',
          border: '1px solid var(--border-0)',
        }}>
          {alert.category}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            marginTop: '18px',
            borderTop: '1px solid var(--border-0)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'fadeSlideUp 0.3s var(--ease-spring) both',
          }}
        >
          {/* Evidence */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Target size={12} style={{ color: 'var(--text-3)' }} />
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Evidence</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: '18px', borderLeft: '2px solid var(--border-1)' }}>
              {alert.evidence}
            </p>
          </div>

          {/* Root Cause */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ChevronRight size={12} style={{ color: 'var(--text-3)' }} />
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Root Cause</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: '18px', borderLeft: '2px solid var(--border-1)' }}>
              {alert.rootCause}
            </p>
          </div>

          {/* Prediction */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Zap size={12} style={{ color: 'var(--amber)' }} />
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prediction</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: '18px', borderLeft: `2px solid ${sev.border}40` }}>
              {alert.prediction}
            </p>
          </div>

          {/* Recommendation */}
          <div style={{
            padding: '14px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            border: '1px solid var(--border-0)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Lightbulb size={12} style={{ color: 'var(--cyan)' }} />
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Recommendation</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }}>
              {alert.recommendation}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px', lineHeight: 1.4 }}>
              Impact: {alert.businessImpact}
            </p>
          </div>

          {/* CTA */}
          <button
            className="btn btn-primary"
            onClick={handleApply}
            disabled={applying}
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '13px',
              fontWeight: '600',
              opacity: applying ? 0.7 : 1,
            }}
          >
            {applying ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                Applying...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={13} />
                Apply AI Fix
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
