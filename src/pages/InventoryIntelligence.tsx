import React, { useEffect, useRef, useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ProgressRing } from '../components/common/ProgressRing';
import { StatusBadge } from '../components/common/StatusBadge';
import { Package, AlertTriangle, Clock, Zap, Sparkles, ArrowRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// Small local helpers (no chart library needed — everything is inline SVG)
// ---------------------------------------------------------------------------

/** Animated count-up number, e.g. useCountUp(7799) -> 0 -> 7799 over ~1.2s */
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

/** Tiny inline sparkline that draws itself in on mount */
const Sparkline: React.FC<{ points: number[]; color: string; width?: number; height?: number }> = ({
  points, color, width = 70, height = 26,
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
      <polyline
        ref={ref}
        points={coords}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Grouped bar chart: stock vs safety minimum */
const StockBarChart: React.FC<{
  data: { label: string; stock: number; safety: number }[];
}> = ({ data }) => {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 150);
    return () => clearTimeout(t);
  }, []);

  const w = 340, h = 190, padBottom = 26, padTop = 10;
  const maxVal = Math.max(...data.flatMap(d => [d.stock, d.safety])) * 1.15;
  const groupW = w / data.length;
  const barW = 12;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
      <line x1={0} x2={w} y1={h - padBottom} y2={h - padBottom} stroke="rgba(255,255,255,0.08)" />
      {data.map((d, i) => {
        const cx = groupW * i + groupW / 2;
        const stockH = grown ? (d.stock / maxVal) * (h - padBottom - padTop) : 0;
        const safetyH = grown ? (d.safety / maxVal) * (h - padBottom - padTop) : 0;
        return (
          <g key={d.label}>
            <rect
              x={cx - barW - 2}
              y={h - padBottom - safetyH}
              width={barW}
              height={safetyH}
              rx={2}
              fill="rgba(255,255,255,0.18)"
              style={{ transition: `all 1s cubic-bezier(.22,1,.36,1) ${0.1 + i * 0.08}s` }}
            />
            <rect
              x={cx + 2}
              y={h - padBottom - stockH}
              width={barW}
              height={stockH}
              rx={2}
              fill="var(--cyan)"
              style={{ transition: `all 1s cubic-bezier(.22,1,.36,1) ${0.1 + i * 0.08}s` }}
            />
            <text x={cx} y={h - 8} textAnchor="middle" fill="var(--text-3)" fontSize="8.5">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Donut chart for waste value breakdown */
const WasteDonut: React.FC<{
  segments: { label: string; pct: number; value: number; color: string }[];
  total: number;
}> = ({ segments, total }) => {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 150);
    return () => clearTimeout(t);
  }, []);

  const cx = 70, cy = 70, r = 52, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW} />
      {segments.map((seg, i) => {
        const segLen = (seg.pct / 100) * circumference;
        const dashoffset = grown ? -acc : circumference;
        const el = (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={`${segLen} ${circumference - segLen}`}
            strokeDashoffset={dashoffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: `stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1) ${0.1 + i * 0.12}s` }}
          />
        );
        acc += segLen;
        return el;
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--text-1)" fontSize="15" fontWeight={800}>
        ₹{total.toLocaleString('en-IN')}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-3)" fontSize="9">
        Total
      </text>
    </svg>
  );
};

/** Picks a representative emoji for an ingredient name (keyword match, case-insensitive) */
function getIngredientEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('cheese') || n.includes('mozzarella') || n.includes('parmesan')) return '🧀';
  if (n.includes('avocado')) return '🥑';
  if (n.includes('beef') || n.includes('patty') || n.includes('meat')) return '🥩';
  if (n.includes('bun') || n.includes('bread') || n.includes('brioche')) return '🥖';
  if (n.includes('truffle') || n.includes('oil')) return '🫒';
  if (n.includes('tomato')) return '🍅';
  if (n.includes('chicken')) return '🍗';
  if (n.includes('pepper')) return '🌶️';
  if (n.includes('onion')) return '🧅';
  if (n.includes('garlic')) return '🧄';
  if (n.includes('lettuce') || n.includes('greens') || n.includes('spinach')) return '🥬';
  if (n.includes('milk') || n.includes('dairy') || n.includes('cream')) return '🥛';
  if (n.includes('egg')) return '🥚';
  if (n.includes('fish') || n.includes('salmon')) return '🐟';
  if (n.includes('shrimp') || n.includes('prawn')) return '🦐';
  if (n.includes('rice')) return '🍚';
  if (n.includes('flour') || n.includes('dough')) return '🌾';
  return '📦';
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export const InventoryIntelligence: React.FC = () => {
  const { inventory, metrics, state, applyRecommendation } = useRestaurant();

  const getStatus = (cur: number, safe: number): { label: string; status: 'critical' | 'warning' | 'optimal' } => {
    const ratio = cur / safe;
    if (ratio < 0.5) return { label: 'Critical Understock', status: 'critical' };
    if (ratio < 1.0) return { label: 'Below Safety Stock', status: 'warning' };
    return { label: 'Optimal', status: 'optimal' };
  };

  const wasteCost = useCountUp(metrics.wasteCost);

  // Waste breakdown — swap for real backend data if/when available
  const wasteSegments = [
    { label: 'Avocado Rot', pct: 48, value: Math.round(metrics.wasteCost * 0.48), color: 'var(--emerald)' },
    { label: 'Cheese Spoilage', pct: 22, value: Math.round(metrics.wasteCost * 0.22), color: 'var(--amber)' },
    { label: 'Meat Trimming', pct: 15, value: Math.round(metrics.wasteCost * 0.15), color: 'var(--red)' },
    { label: 'Expired Goods', pct: 10, value: Math.round(metrics.wasteCost * 0.10), color: '#a855f7' },
    { label: 'Other', pct: 5, value: Math.round(metrics.wasteCost * 0.05), color: '#3b82f6' },
  ];

  const barData = inventory.map(item => ({
    label: item.name.split(' ')[0].replace('&', ''),
    stock: item.currentStock,
    safety: item.safetyStock,
  }));

  const suppliers = [
    { name: 'Dairy Gold Farms', lead: '12h', status: 'warning' as const, note: 'Delayed +6h avg' },
    { name: 'Organic Greens Inc.', lead: '24h', status: 'optimal' as const, note: 'On schedule' },
    { name: 'Heritage Meats', lead: '8h', status: 'optimal' as const, note: 'On schedule' },
    { name: 'Artisan Bakers', lead: '6h', status: 'optimal' as const, note: 'On schedule' },
  ];

  const criticalCount = inventory.filter(i => getStatus(i.currentStock, i.safetyStock).status === 'critical').length;
  const warningCount = inventory.filter(i => getStatus(i.currentStock, i.safetyStock).status === 'warning').length;
  const healthyCount = inventory.length - criticalCount - warningCount;

  return (
    <div className="dashboard-grid stagger-children">

      {/* KPI row */}
      {[
        { label: 'Total Spoilage Cost', value: `₹${Math.round(wasteCost).toLocaleString('en-IN')}`, sub: 'Avocado rot = 48% of total', color: 'var(--amber)', spark: [22, 20, 23, 15, 17, 9, 11] },
        { label: 'Inventory Turnover', value: '14.2×', sub: 'Target: 15× monthly', color: 'var(--cyan)', spark: [24, 21, 22, 16, 18, 10, 6] },
        { label: 'Supplier SLA Compliance', value: '88.4%', sub: 'Dairy Gold Farms delayed +6h', color: '#fff', spark: [12, 16, 10, 14, 8, 12, 7] },
        { label: 'Active Alerts', value: `${(state.cheeseStockRatio < 0.6 ? 1 : 0) + (state.avocadoStockRatio > 1.4 ? 1 : 0)}`, sub: 'Require replenishment action', color: 'var(--red)', spark: null },
      ].map((k, i) => (
        <div key={i} style={{ gridColumn: 'span 3' }}>
          <div className="glass-card" style={{ borderTop: `2px solid ${k.color}`, position: 'relative' }}>
            {k.label === 'Active Alerts' && (
              <div style={{
                position: 'absolute', top: '16px', right: '16px', width: '26px', height: '26px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(239,68,68,0.12)', animation: 'pulseBell 2.2s ease-in-out infinite',
              }}>
                <AlertTriangle size={13} style={{ color: 'var(--red)' }} />
              </div>
            )}
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>{k.sub}</div>
              </div>
              {k.spark && <Sparkline points={k.spark} color={k.color === '#fff' ? 'var(--emerald)' : k.color} />}
            </div>
          </div>
        </div>
      ))}

      {/* Left column: table + charts stacked together so height is self-contained */}
      <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-0)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={14} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontSize: '14px', fontWeight: '650', color: 'var(--text-1)' }}>Core Raw Stock Status</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Stock</th>
                  <th>Safety Min</th>
                  <th>Fill Rate</th>
                  <th>Unit Cost</th>
                  <th>Waste %</th>
                  <th>Status</th>
                  <th>Trend (7D)</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, idx) => {
                  const st = getStatus(item.currentStock, item.safetyStock);
                  const fillPct = Math.min(100, Math.round((item.currentStock / item.safetyStock) * 100));
                  const trendColor = st.status === 'critical' ? 'var(--red)' : 'var(--emerald)';
                  // deterministic mock trend leading up to today's stock level, until real history is wired in
                  const trend = [0.7, 0.78, 0.82, 0.9, 0.95, 1.02, 1].map(f => item.currentStock * f);
                  return (
                    <tr key={item.id} style={{ animation: `fadeSlideUp .5s cubic-bezier(.22,1,.36,1) ${idx * 0.06}s both` }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', background: 'rgba(255,255,255,0.05)', flexShrink: 0,
                          }}>
                            {getIngredientEmoji(item.name)}
                          </span>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-1)' }}>{item.name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{item.supplierName}</div>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{item.currentStock} kg</span></td>
                      <td><span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{item.safetyStock} kg</span></td>
                      <td style={{ minWidth: '100px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{
                              width: `${fillPct}%`,
                              background: st.status === 'critical' ? 'var(--red)' : st.status === 'warning' ? 'var(--amber)' : 'var(--emerald)',
                              transition: 'width 1s cubic-bezier(.22,1,.36,1)',
                            }} />
                          </div>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', minWidth: '32px' }}>{fillPct}%</span>
                        </div>
                      </td>
                      <td><span style={{ fontSize: '12px', color: 'var(--text-2)' }}>₹{item.unitCost}/kg</span></td>
                      <td>
                        <span style={{ color: item.wastePercentage > 15 ? 'var(--red)' : 'var(--text-2)', fontWeight: item.wastePercentage > 15 ? '700' : '400', fontFamily: 'var(--font-mono)' }}>
                          {item.wastePercentage}%
                        </span>
                      </td>
                      <td><StatusBadge status={st.status} label={st.label} size="sm" /></td>
                      <td><Sparkline points={trend} color={trendColor} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock vs Safety bar chart + Waste donut chart, side by side under the table */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <div className="glass-card" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: '650', color: 'var(--text-2)', marginBottom: '10px' }}>Stock Level vs Safety Minimum</div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '10.5px', color: 'var(--text-3)', marginBottom: '10px' }}>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--cyan)', marginRight: 6 }} />Stock (kg)</span>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--text-3)', marginRight: 6 }} />Safety Min (kg)</span>
            </div>
            <StockBarChart data={barData} />
          </div>

          <div className="glass-card" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: '650', color: 'var(--text-2)', marginBottom: '14px' }}>Waste Value Breakdown (7D)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <WasteDonut segments={wasteSegments} total={metrics.wasteCost} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {wasteSegments.map(seg => (
                  <div key={seg.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)' }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                      {seg.label}
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-1)', fontWeight: 600 }}>{seg.pct}%</span>{' '}
                      <span style={{ color: 'var(--text-3)' }}>₹{seg.value.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <a style={{ fontSize: '11.5px', color: 'var(--cyan)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '14px', cursor: 'pointer' }}>
              View Waste Analysis <ArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Side alerts */}
      <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Cheese alert */}
        {state.cheeseStockRatio < 0.6 && (
          <div className="glass-card" style={{ borderLeft: '3px solid var(--red)', background: 'rgba(239,68,68,0.04)', animation: 'fadeSlideUp 0.4s var(--ease-spring) both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--red)' }}>Critical: Cheese Depletion</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '12px' }}>
              Cheese stock at {Math.round(35 * state.cheeseStockRatio)}kg — 65% below safety minimum. Pizza station delays are active.
            </p>
            <button className="btn btn-primary btn-sm" style={{ width: '100%', gap: '6px' }} onClick={() => applyRecommendation('alert-cheese')}>
              <Zap size={12} /> Authorize Replenishment
            </button>
          </div>
        )}

        {/* Avocado alert */}
        {state.avocadoStockRatio > 1.4 && (
          <div className="glass-card" style={{ borderLeft: '3px solid var(--amber)', background: 'rgba(245,158,11,0.04)', animation: 'fadeSlideUp 0.4s var(--ease-spring) 60ms both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={14} style={{ color: 'var(--amber)' }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--amber)' }}>Warning: Avocado Overstock</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '12px' }}>
              {Math.round(25 * state.avocadoStockRatio)}kg on hand. Spoilage rate at 26%. ₹8,400 at risk.
            </p>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', gap: '6px' }} onClick={() => applyRecommendation('alert-avocado')}>
              <Zap size={12} /> Trigger Promo Special
            </button>
          </div>
        )}

        {/* Supplier SLA */}
        <div className="glass-card" style={{ animation: 'fadeSlideUp 0.4s var(--ease-spring) 120ms both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Clock size={14} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontSize: '13px', fontWeight: '650', color: 'var(--text-1)' }}>Supplier Lead Times</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suppliers.map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '550', color: 'var(--text-1)' }}>{s.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{s.note}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{s.lead}</span>
                  <StatusBadge status={s.status} size="sm" dot={false} label={s.status === 'warning' ? 'Delay' : 'OK'} />
                </div>
              </div>
            ))}
          </div>
          <a style={{ fontSize: '11.5px', color: 'var(--cyan)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '14px', cursor: 'pointer' }}>
            View All Suppliers <ArrowRight size={11} />
          </a>
        </div>

        {/* Stock ring overview */}
        <div className="glass-card" style={{ animation: 'fadeSlideUp 0.4s var(--ease-spring) 180ms both' }}>
          <div style={{ fontSize: '13px', fontWeight: '650', color: 'var(--text-1)', marginBottom: '14px' }}>Fill Rate Overview</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing value={criticalCount * 100} size={58} strokeWidth={5} color="var(--red)" label={`${criticalCount}`} />
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '6px' }}>Critical</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing value={warningCount * 100} size={58} strokeWidth={5} color="var(--amber)" label={`${warningCount}`} />
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '6px' }}>At Risk</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing value={healthyCount * 100} size={58} strokeWidth={5} color="var(--emerald)" label={`${healthyCount}`} />
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '6px' }}>Healthy</div>
            </div>
          </div>
          <a style={{ fontSize: '11.5px', color: 'var(--cyan)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '14px', cursor: 'pointer' }}>
            View All Inventory <ArrowRight size={11} />
          </a>
        </div>
      </div>

      {/* AI recommendation bar */}
      <div style={{ gridColumn: 'span 12' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderRadius: '12px',
          background: 'linear-gradient(90deg, rgba(34,211,238,0.08), rgba(34,211,238,0.02))',
          border: '1px solid rgba(34,211,238,0.2)', marginTop: '2px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: 'rgba(34,211,238,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'sparkle 2.4s ease-in-out infinite',
            }}>
              <Sparkles size={15} style={{ color: 'var(--cyan)' }} />
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>
              <b style={{ color: 'var(--text-1)', fontWeight: 650 }}>AI Recommendation:</b> Reallocate 14kg mozzarella from South Zone to Central Zone (demand higher by 18%). Potential savings: ₹1,120
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};