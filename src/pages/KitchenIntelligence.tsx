import React, { useEffect, useRef, useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ProgressRing } from '../components/common/ProgressRing';
import { StatusBadge } from '../components/common/StatusBadge';
import { Flame, ChefHat, AlertTriangle, Zap, Lightbulb, Gauge, ChevronRight, ClipboardList } from 'lucide-react';

// ---------------------------------------------------------------------------
// Small local helpers (no chart library — inline SVG, matches Inventory page)
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const Sparkline: React.FC<{ points: number[]; color: string; width?: number; height?: number }> = ({
  points, color, width = 70, height = 30,
}) => {
  const ref = useRef<SVGPolylineElement>(null);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((v, i) => `${(i / (points.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    const t = setTimeout(() => {
      el.style.transition = 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)';
      el.style.strokeDashoffset = '0';
    }, 80);
    return () => clearTimeout(t);
  }, [coords]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline ref={ref} points={coords} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Small mock throughput bar chart, e.g. "orders per hour over the last few hours" */
const MiniBars: React.FC<{ values: number[]; color?: string; width?: number; height?: number }> = ({
  values, color = 'var(--cyan)', width = 90, height = 34,
}) => {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 150);
    return () => clearTimeout(t);
  }, []);
  const max = Math.max(...values) || 1;
  const barW = width / values.length - 3;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {values.map((v, i) => {
        const h = grown ? (v / max) * height : 0;
        return (
          <rect
            key={i}
            x={i * (barW + 3)}
            y={height - h}
            width={barW}
            height={h}
            rx={1.5}
            fill={color}
            opacity={0.55 + (i / values.length) * 0.45}
            style={{ transition: `all .7s cubic-bezier(.22,1,.36,1) ${i * 0.05}s` }}
          />
        );
      })}
    </svg>
  );
};

const statusColor = (status: 'critical' | 'warning' | 'optimal') =>
  status === 'critical' ? 'var(--red)' : status === 'warning' ? 'var(--amber)' : 'var(--emerald)';

export const KitchenIntelligence: React.FC = () => {
  const { kitchenTickets, metrics, state, applyRecommendation } = useRestaurant();

  const getStationStatus = (id: string, time: number): { label: string; status: 'critical' | 'warning' | 'optimal' } => {
    if (id === 'pizza' && state.cheeseStockRatio < 0.6) return { label: 'Cheese Outage', status: 'critical' };
    if (time > 900) return { label: 'Overloaded', status: 'critical' };
    if (time > 720) return { label: 'Elevated', status: 'warning' };
    return { label: 'Optimal', status: 'optimal' };
  };

  const STATIONS = [
    { id: 'pizza', name: 'Pizza & Oven Station', icon: '🍕', chef: 'Chef B', targetSec: 600, currentSec: Math.round(600 * (4 / Math.max(1, state.chefCount)) * (state.cheeseStockRatio < 0.6 ? 1.45 : 1.0)) },
    { id: 'grill', name: 'Charcoal Grill Station', icon: '🥩', chef: 'Chef A', targetSec: 480, currentSec: 420 },
    { id: 'fry',   name: 'Deep Fryer Station', icon: '🍗', chef: 'Chef C', targetSec: 360, currentSec: 310 },
    { id: 'prep',  name: 'Salad & Cold Prep', icon: '🥗', chef: 'Chef D', targetSec: 480, currentSec: Math.round(540 * (state.avocadoStockRatio > 1.4 ? 0.92 : 1.0)) },
  ];

  // Match open tickets to their station (falls back gracefully if the field doesn't match exactly)
  const ticketsForStation = (stationId: string) =>
    kitchenTickets.filter(t => (t.station || '').toLowerCase().includes(stationId));

  const delayedCount = kitchenTickets.filter(t => t.status === 'delayed').length;
  const completedCount = kitchenTickets.filter(t => t.status === 'completed').length;
  const activeCount = kitchenTickets.length - completedCount;

  const avgPrepMin = useCountUp(metrics.averagePrepTime / 60, 1200);
  const kitchenLoad = useCountUp(metrics.kitchenLoadRatio, 1200);

  return (
    <div className="dashboard-grid stagger-children">

      {/* KPI row */}
      {[
        { label: 'Average Prep Time', val: `${Math.floor(avgPrepMin)}m ${Math.round((avgPrepMin % 1) * 60)}s`, color: metrics.averagePrepTime > 780 ? 'var(--amber)' : 'var(--emerald)', sub: 'Target SLA: 12 min', spark: [10, 12, 14, 13, 16, 18, 21] },
        { label: 'Kitchen Load', val: `${Math.round(kitchenLoad)}%`, color: metrics.kitchenLoadRatio > 80 ? 'var(--red)' : 'var(--cyan)', sub: `${state.chefCount} chefs across 4 stations`, spark: [60, 68, 72, 80, 85, 90, 96] },
        { label: 'Station Balance', val: '91.4%', color: 'var(--emerald)', sub: 'Cross-station variance: steady', spark: [82, 85, 84, 87, 89, 90, 91] },
        { label: 'KDS Tickets', val: `${kitchenTickets.length}`, color: 'var(--text-1)', sub: `${delayedCount} delayed tickets`, spark: null },
      ].map((k, i) => (
        <div key={i} style={{ gridColumn: 'span 3' }}>
          <div className="glass-card" style={{ borderTop: `2px solid ${k.color}`, position: 'relative' }}>
            {k.label === 'KDS Tickets' && (
              <div style={{
                position: 'absolute', top: '16px', right: '16px', width: '26px', height: '26px',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
              }}>
                <ClipboardList size={13} style={{ color: 'var(--text-2)' }} />
              </div>
            )}
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{k.val}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>{k.sub}</div>
              </div>
              {k.spark && <Sparkline points={k.spark} color={k.color} />}
            </div>
          </div>
        </div>
      ))}

      {/* Station table */}
      <div style={{ gridColumn: 'span 8' }}>
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-0)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChefHat size={14} style={{ color: 'var(--cyan)' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '650', color: 'var(--text-1)' }}>Kitchen Assembly Stations</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-3)' }}>Real-time station performance</div>
            </div>
            <div style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11.5px', color: 'var(--text-2)', padding: '6px 10px', borderRadius: '8px',
              background: 'var(--panel)', border: '1px solid var(--border-0)', cursor: 'pointer',
            }}>
              View: Real-time
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 11, height: 11 }}><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Chef · Station</th>
                  <th>Current Order</th>
                  <th>Time Elapsed</th>
                  <th>SLA Target</th>
                  <th>Performance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {STATIONS.map((station, i) => {
                  const st = getStationStatus(station.id, station.currentSec);
                  const color = statusColor(st.status);
                  const perfPct = Math.round((station.currentSec / station.targetSec) * 100);
                  const tickets = ticketsForStation(station.id);
                  const currentTicket = tickets[0];
                  const activeN = tickets.length ? 1 : 0;
                  const queuedN = Math.max(0, tickets.length - 1);
                  const overTarget = station.currentSec > station.targetSec;
                  return (
                    <tr key={station.id} style={{ animation: `fadeSlideUp .5s cubic-bezier(.22,1,.36,1) ${i * 0.07}s both` }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '17px', background: `${color}22`,
                          }}>
                            {station.icon}
                          </span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '650', color: 'var(--text-1)' }}>{station.name}</div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-3)' }}>{station.chef}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{activeN} active · {queuedN} queued</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-1)' }}>
                          {currentTicket ? currentTicket.foodItemName : 'No active order'}
                        </div>
                        {currentTicket && <div style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>#{currentTicket.id}</div>}
                      </td>
                      <td style={{ minWidth: '110px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: overTarget ? color : 'var(--text-1)' }}>
                          {Math.floor(station.currentSec / 60)}m {station.currentSec % 60}s
                        </div>
                        <div className="progress-track" style={{ marginTop: '6px' }}>
                          <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((station.currentSec / (station.targetSec * 1.5)) * 100))}%`, background: color, transition: 'width 1s cubic-bezier(.22,1,.36,1)' }} />
                        </div>
                      </td>
                      <td><span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{Math.floor(station.targetSec / 60)}m</span></td>
                      <td>
                        <ProgressRing value={Math.min(100, perfPct)} size={50} strokeWidth={5} color={color} label={`${perfPct}%`} />
                      </td>
                      <td>
                        <StatusBadge status={st.status} label={overTarget ? (st.status === 'critical' ? 'Behind' : 'On Track') : 'On Track'} size="sm" />
                        <div style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '5px' }}>{st.label}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom summary strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '1px solid var(--border-0)', padding: '16px 20px', gap: '10px',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Total Active Orders</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-1)' }}>{activeCount}</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '2px' }}>Across all stations</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Average Order Time</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-1)' }}>{Math.floor(avgPrepMin)}m {Math.round((avgPrepMin % 1) * 60)}s</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '2px' }}>Target: 8m</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Orders Completed</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--emerald)' }}>{completedCount}</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '2px' }}>Today</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Order Throughput</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--cyan)' }}>18.2<span style={{ fontSize: '12px', color: 'var(--text-3)' }}>/hr</span></div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '2px' }}>Last 1 hour</div>
                </div>
                <MiniBars values={[8, 11, 9, 14, 12, 16, 15, 18]} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side: alerts + AI insight + KDS log + health score */}
      <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {state.chefCount < 4 && metrics.averagePrepTime > 780 && (
          <div className="glass-card" style={{ borderLeft: '3px solid var(--amber)', background: 'rgba(245,158,11,0.04)', animation: 'fadeSlideUp 0.4s var(--ease-spring) both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={14} style={{ color: 'var(--amber)' }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--amber)' }}>Pizza Station Bottleneck</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '12px' }}>
              Prep at {Math.round(metrics.averagePrepTime / 60)} mins — {state.chefCount < 4 ? `understaffed by ${4 - state.chefCount} chef(s)` : 'capacity exceeded'}. High queue time detected.
            </p>
            <button className="btn btn-primary btn-sm" style={{ width: '100%', gap: '6px' }} onClick={() => applyRecommendation('alert-kitchen')}>
              <Zap size={12} /> Reallocate Chef B to Pizza
            </button>
          </div>
        )}

        <div className="glass-card" style={{ borderLeft: '3px solid var(--cyan)', background: 'rgba(34,211,238,0.045)', animation: 'fadeSlideUp 0.4s var(--ease-spring) 60ms both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lightbulb size={14} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--cyan)' }}>AI Insight</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '12px' }}>
            Moving Chef C to Pizza Station can reduce average order time by 18%.
          </p>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', gap: '6px' }} onClick={() => applyRecommendation('ai-insight-kitchen')}>
            <Zap size={12} /> Apply Recommendation
          </button>
        </div>

        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', animation: 'fadeSlideUp 0.4s var(--ease-spring) 120ms both' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-0)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={13} style={{ color: 'var(--amber)' }} />
            <span style={{ fontSize: '13px', fontWeight: '650', color: 'var(--text-1)' }}>KDS Dispatch Log</span>
            <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: '10px' }}>{kitchenTickets.length} open</span>
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
            {kitchenTickets.map((ticket, i) => {
              const isDelayed = ticket.status === 'delayed';
              const isCompleted = ticket.status === 'completed';
              const rowColor = isDelayed ? 'var(--red)' : isCompleted ? 'var(--emerald)' : 'var(--cyan)';
              const label = isDelayed ? 'delayed' : isCompleted ? 'completed' : 'in progress';
              return (
                <div key={ticket.id} style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isDelayed ? 'rgba(239,68,68,0.15)' : 'var(--border-0)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  animation: `fadeSlideUp 0.35s var(--ease-spring) ${i * 50}ms both`,
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-1)' }}>{ticket.foodItemName}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      #{ticket.id} · {ticket.station}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: rowColor, fontFamily: 'var(--font-mono)' }}>
                      {Math.floor(ticket.prepTimeSeconds / 60)}m
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 650, color: rowColor }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kitchen Health Score */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeSlideUp 0.4s var(--ease-spring) 180ms both', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'rgba(34,211,238,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Gauge size={16} style={{ color: 'var(--cyan)' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '650', color: 'var(--text-1)' }}>Kitchen Health Score</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-3)' }}>Good performance today</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--emerald)' }}>82<span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>/100</span></div>
            <ChevronRight size={16} style={{ color: 'var(--text-3)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};