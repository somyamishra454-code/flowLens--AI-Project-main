import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { AIInsightCard } from '../components/common/AIInsightCard';
import { ProgressRing } from '../components/common/ProgressRing';
import { CheckCircle2, Filter } from 'lucide-react';

export const DecisionIntelligence: React.FC = () => {
  const { alerts, selectedAlertId } = useRestaurant();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');

  const filtered = alerts.filter(a => {
    if (filter === 'all') return !a.resolved || a.severity === 'info';
    if (filter === 'critical') return a.severity === 'critical' && !a.resolved;
    if (filter === 'warning') return a.severity === 'warning' && !a.resolved;
    if (filter === 'resolved') return a.resolved;
    return true;
  });

  const unresolvedCount = alerts.filter(a => !a.resolved && a.severity !== 'info').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.resolved).length;
  const resolvedCount = alerts.filter(a => a.resolved).length;

  const totalSavings = alerts
    .filter(a => !a.resolved)
    .reduce((sum, a) => {
      const match = a.expectedSavings.match(/[\d,]+/);
      return sum + (match ? parseInt(match[0].replace(/,/g, ''), 10) : 0);
    }, 0);

  const FILTERS = [
    { key: 'all' as const,      label: 'Active',   count: unresolvedCount },
    { key: 'critical' as const, label: 'Critical', count: criticalCount },
    { key: 'warning' as const,  label: 'Warning',  count: warningCount },
    { key: 'resolved' as const, label: 'Resolved', count: resolvedCount },
  ];

  return (
    <div className="dashboard-grid stagger-children">

      {/* Summary stat cards */}
      <div style={{ gridColumn: 'span 3' }}>
        <div className="glass-card" style={{ borderTop: '2px solid var(--red)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Critical Issues</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--red)', letterSpacing: '-0.05em', lineHeight: 1 }}>{criticalCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>Require immediate action</div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 3' }}>
        <div className="glass-card" style={{ borderTop: '2px solid var(--amber)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Warnings</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--amber)', letterSpacing: '-0.05em', lineHeight: 1 }}>{warningCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>Monitor & optimize</div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 3' }}>
        <div className="glass-card" style={{ borderTop: '2px solid var(--emerald)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Recoverable Revenue</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--emerald)', letterSpacing: '-0.04em', lineHeight: 1 }}>₹{totalSavings.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>If all fixes applied now</div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 3' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '100%' }}>
          <ProgressRing
            value={resolvedCount > 0 ? Math.round((resolvedCount / alerts.length) * 100) : 0}
            size={60}
            strokeWidth={5}
            color="var(--emerald)"
            label={`${resolvedCount > 0 ? Math.round((resolvedCount / alerts.length) * 100) : 0}%`}
            sublabel="fixed"
          />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Resolution Rate</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-1)' }}>{resolvedCount} of {alerts.length} fixed</div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>This session</div>
          </div>
        </div>
      </div>

      {/* Filter tabs + insights */}
      <div style={{ gridColumn: 'span 12' }}>
        <div className="glass-card" style={{ padding: '0' }}>
          {/* Filter bar */}
          <div style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid var(--border-0)',
            padding: '0 16px',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px', padding: '14px 0' }}>
              <Filter size={12} style={{ color: 'var(--text-3)' }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filter</span>
            </div>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '14px 16px',
                  fontSize: '13px',
                  fontWeight: filter === f.key ? '650' : '400',
                  color: filter === f.key ? 'var(--text-1)' : 'var(--text-3)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: filter === f.key ? '2px solid var(--cyan)' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--t-fast)',
                  marginBottom: '-1px',
                }}
              >
                {f.label}
                {f.count > 0 && (
                  <span style={{
                    background: filter === f.key ? 'var(--cyan-dim)' : 'rgba(255,255,255,0.05)',
                    color: filter === f.key ? 'var(--cyan)' : 'var(--text-3)',
                    borderRadius: '999px',
                    padding: '1px 6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    border: filter === f.key ? '1px solid rgba(6,182,212,0.2)' : '1px solid var(--border-0)',
                  }}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Card list */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: '48px' }}>
                <div className="empty-state-icon" style={{ background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--emerald)' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-2)' }}>No issues in this category</span>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>All operations are running within safe parameters</span>
              </div>
            ) : (
              filtered.map((alert, i) => (
                <AIInsightCard
                  key={alert.id}
                  alert={alert}
                  expanded={alert.id === selectedAlertId}
                  animationDelay={i * 60}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
