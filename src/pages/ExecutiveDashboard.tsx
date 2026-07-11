import { useRef, useState, type ReactNode, type CSSProperties } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip,
} from 'recharts';
import {
  Users, BrainCircuit, Bell, Sparkles,
  IndianRupee, ShoppingBag, Wallet, Trophy,
} from 'lucide-react';
import ChatBot from '../components/common/ChatBot';
import { useData } from '../context/DataContext';
import { getRelativeDateLabel } from '../data/data';
import { getMenuItemById } from '../data/menu';
import robotNormal from '../assets/robot-normal.mp4';
import robotReverse from '../assets/robot-revers.mp4';

// Add animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);

const C = {
  bg: '#08080a',
  panel: '#000000',
  card: 'rgba(255,255,255,0.035)',
  border: 'rgba(255,255,255,0.07)',
  borderSoft: 'rgba(255,255,255,0.045)',
  text1: '#f4f4f5',
  text2: '#a8a8b3',
  text3: '#77777f',
  text4: '#4d4d54',
  violet: '#8b5cf6',
  violetDim: 'rgba(139,92,246,0.14)',
  cyan: '#22d3ee',
  emerald: '#22c55e',
  emeraldDim: 'rgba(34,197,94,0.14)',
  amber: '#f59e0b',
  amberDim: 'rgba(245,158,11,0.14)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.14)',
  blue: '#3b82f6',
  blueDim: 'rgba(59,130,246,0.14)',
};

const fmt = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

function ImageWithFallback({ alt }: { alt: string }) {
  // Food emoji mapping
  const foodEmojis: { [key: string]: string } = {
    'Paneer Butter Masala': '🍛',
    'Chicken Biryani': '🍚',
    'Garlic Naan': '🫔',
    'Veg Schezwan Noodles': '🍜',
    'Chicken Tikka': '🍖',
    'Masala Dosa': '🫓',
    'Veg Pasta': '🍝',
    'Manchurian': '🥡',
    'French Fries': '🍟',
  };

  // Color mapping for each dish
  const dishColors: { [key: string]: string } = {
    'Paneer Butter Masala': '#f59e0b',
    'Chicken Biryani': '#22c55e',
    'Garlic Naan': '#3b82f6',
    'Veg Schezwan Noodles': '#8b5cf6',
    'Chicken Tikka': '#ef4444',
    'Masala Dosa': '#ec4899',
    'Veg Pasta': '#14b8a6',
    'Manchurian': '#f97316',
    'French Fries': '#eab308',
  };

  const emoji = foodEmojis[alt] || '🍽️';
  const bgColor = dishColors[alt] || '#8b5cf6';
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${bgColor}40, ${bgColor}20)`,
      fontSize: '32px',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {emoji}
    </div>
  );
}

function Card({ children, style, accent }: { children: ReactNode; style?: CSSProperties; accent?: string }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
      borderTop: accent ? `2px solid ${accent}` : `1px solid ${C.border}`,
      padding: 18, ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{children}</span>
      {right}
    </div>
  );
}

function Pill({ text, color, dim }: { text: string; color: string; dim: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, color, background: dim,
      padding: '2px 8px', borderRadius: 999, border: `1px solid ${color}33`,
    }}>
      {text}
    </span>
  );
}

function VideoPlayer() {
  const normalRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);

  const handleNormalEnd = () => {
    const normal = normalRef.current;
    const reverse = reverseRef.current;
    if (normal && reverse) {
      normal.style.opacity = '0';
      reverse.style.opacity = '1';
      reverse.currentTime = 0;
      reverse.play().catch(() => {});
    }
  };

  const handleReverseEnd = () => {
    const normal = normalRef.current;
    const reverse = reverseRef.current;
    if (normal && reverse) {
      reverse.style.opacity = '0';
      normal.style.opacity = '1';
      normal.currentTime = 0;
      normal.play().catch(() => {});
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        ref={normalRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        onEnded={handleNormalEnd}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none',
          display: 'block', opacity: 1
        }}
      >
        <source src={robotNormal} type="video/mp4" />
      </video>
      <video
        ref={reverseRef}
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        onEnded={handleReverseEnd}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none',
          position: 'absolute', top: 0, left: 0, opacity: 0
        }}
      >
        <source src={robotReverse} type="video/mp4" />
      </video>
    </div>
  );
}



export default function ExecutiveDashboard() {
  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  
  // Get data from context
  const { selectedDate, setSelectedDate, currentData, availableDates } = useData();
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: "High Revenue Alert",
      message: "Daily revenue exceeded target by 30%",
      time: "2 mins ago",
      icon: "📈",
      color: "#22c55e",
    },
    {
      id: 2,
      title: "Delivery Delay",
      message: "North Zone experiencing 15 min delays",
      time: "15 mins ago",
      icon: "🚚",
      color: "#f59e0b",
    },
    {
      id: 3,
      title: "Low Stock Alert",
      message: "Paneer Butter Masala stock running low",
      time: "1 hour ago",
      icon: "📦",
      color: "#ef4444",
    },
  ]);

  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%', maxHeight: '100vh', overflowY: 'auto',
      color: C.text1, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: 13,
    }}>
      {/* ── Main ── */}
      <div style={{ flex: 1, minWidth: 0, padding: '24px 24px 24px 28px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Hi, Manager! 👋</div>
            <div style={{ fontSize: 12.5, color: C.text3, marginTop: 3 }}>Here's what happened on {currentData?.displayDate}.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10,
                border: `1px solid ${C.border}`, background: C.card, fontSize: 12, color: C.text2,
                cursor: 'pointer', outline: 'none',
              }}
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {getRelativeDateLabel(date)}
                </option>
              ))}
            </select>
            <div style={{
              position: 'relative',
            }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  backgroundColor: showNotifications ? C.card : C.card,
                  borderColor: showNotifications ? C.cyan : C.border,
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = C.cyan;
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = showNotifications ? C.cyan : C.border;
                  (e.target as HTMLElement).style.backgroundColor = C.card;
                }}
              >
                <Bell size={15} color={showNotifications ? C.cyan : C.text2} />
                <span style={{
                  position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
                  background: C.red, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', border: `2px solid ${C.bg}`,
                }}>3</span>
              </button>

              {/* Notification panel */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 10, width: 320,
                  borderRadius: 12, border: `1px solid ${C.border}`, background: C.panel,
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', zIndex: 1000,
                  animation: 'slideDown 0.2s ease',
                }}>
                  {/* Header */}
                  <div style={{
                    padding: 14, borderBottom: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>Notifications</span>
                    <span style={{ fontSize: 11, color: '#fff', background: C.red, padding: '2px 6px', borderRadius: 4 }}>
                      {notifications.length}
                    </span>
                  </div>

                  {/* Notifications list */}
                  <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        style={{
                          padding: 12, borderBottom: `1px solid ${C.borderSoft}`,
                          cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = C.card;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div style={{
                            fontSize: 18, width: 24, flexShrink: 0, textAlign: 'center',
                          }}>
                            {notif.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>
                                {notif.title}
                              </span>
                              <span style={{
                                width: 8, height: 8, borderRadius: '50%', background: notif.color, flexShrink: 0,
                              }} />
                            </div>
                            <div style={{ fontSize: 11, color: C.text3, marginBottom: 4 }}>
                              {notif.message}
                            </div>
                            <div style={{ fontSize: 10, color: C.text4 }}>
                              {notif.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding: 10, borderTop: `1px solid ${C.border}`,
                    textAlign: 'center',
                  }}>
                    <button style={{
                      fontSize: 11, color: C.cyan, fontWeight: 600, background: 'none', border: 'none',
                      cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(34, 211, 238, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'none';
                    }}
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
          {currentData?.kpis.map((k) => {
            const IconComponent = k.icon === 'IndianRupee' ? IndianRupee : k.icon === 'ShoppingBag' ? ShoppingBag : k.icon === 'Wallet' ? Wallet : Users;
            return (
              <Card key={k.label} accent={k.color}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 10.5, color: C.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</span>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, background: k.dim,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <IconComponent size={13} color={k.color} />
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{k.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Pill text={`↗ ${k.change}`} color={k.positive ? C.emerald : C.red} dim={k.positive ? C.emeraldDim : C.redDim} />
                  <span style={{ fontSize: 11, color: C.text4 }}>{k.sub}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sales overview + Top dishes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 14, marginBottom: 14 }}>
          <Card>
            <SectionTitle right={<span style={{ fontSize: 12, color: C.text3 }}>Total Sales: <b style={{ color: C.text1 }}>{fmt(currentData?.dashboard.revenue || 0)}</b></span>}>
              Sales Overview
            </SectionTitle>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={currentData?.salesTrend || []} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.emerald} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: C.text4, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fill: C.text4, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip
                  contentStyle={{ background: '#151519', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: C.text3 }}
                  formatter={(v: any) => [fmt(v as number), 'Sales']}
                />
                <Area type="monotone" dataKey="v" stroke={C.emerald} strokeWidth={2} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionTitle>Top Selling Dishes</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentData?.topDishes.map((d, i) => {
                const menuItem = getMenuItemById(d.menuId);
                return (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span style={{ fontSize: 11, color: C.text4, fontWeight: 700, width: 20 }}>{i + 1}.</span>
                    
                    {/* Image */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 8, overflow: 'hidden',
                      background: `linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,211,238,0.1))`,
                      flexShrink: 0, border: `1px solid ${C.border}`,
                    }}>
                      <ImageWithFallback alt={d.name} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                      <div style={{ fontSize: 9.5, color: C.text4 }}>{d.orders} orders</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>₹{menuItem?.price || d.revenue}</div>
                      <div style={{ fontSize: 9, color: C.text4 }}>Revenue: ₹{d.revenue.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Category donut + not selling + orders by time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <Card>
            <SectionTitle>Top Selling Category</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={currentData?.categoryData || []} dataKey="value" innerRadius={35} outerRadius={52} paddingAngle={2} stroke="none">
                      {currentData?.categoryData.map((c) => <Cell key={c.name} fill={c.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                }}>
                  <span style={{ fontSize: 9.5, color: C.text4 }}>Total</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{fmt(currentData?.dashboard.revenue || 0)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                {currentData?.categoryData.map((c) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color }} />
                      <span style={{ color: C.text2 }}>{c.name}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Not Selling Well</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentData?.notSelling.map((d) => {
                const menuItem = getMenuItemById(d.menuId);
                return (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    {/* Image */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 8, overflow: 'hidden',
                      background: `linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.1))`,
                      flexShrink: 0, border: `1px solid ${C.border}`,
                    }}>
                      <ImageWithFallback alt={d.name} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{d.name}</div>
                      <div style={{ fontSize: 9.5, color: C.text4 }}>{d.orders} orders</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.red }}>₹{menuItem?.price || d.revenue}</div>
                      <div style={{ fontSize: 9, color: C.text4 }}>Revenue: ₹{d.revenue.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionTitle>Orders by Time</SectionTitle>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={currentData?.ordersByTime || []} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.violet} stopOpacity={1} />
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: C.text4, fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fill: C.text4, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#151519', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="v" fill="url(#barGrad)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bottom banners */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: C.amberDim,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Trophy size={20} color={C.amber} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.text3, marginBottom: 2 }}>Best Performing Dish</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{currentData?.bestPerforming.name}</div>
              <div style={{ fontSize: 11.5, color: C.text3, marginTop: 2 }}>{currentData?.bestPerforming.orders} orders · <span style={{ color: C.emerald, fontWeight: 600 }}>₹{currentData?.bestPerforming.revenue.toLocaleString('en-IN')} Revenue</span></div>
            </div>
          </Card>

          <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: C.violetDim,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Sparkles size={20} color={C.violet} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.text3, marginBottom: 2 }}>AI Recommendation</div>
              <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.5 }}>
                {currentData?.aiRecommendation}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── AI Assistant panel ── */}
      <div style={{
        width: 268, flexShrink: 0, borderLeft: `1px solid ${C.border}`, background: C.panel,
        padding: 20, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BrainCircuit size={15} color={C.violet} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>AI COO ASSISTANT</span>
            <span style={{ fontSize: 9, color: C.text4 }}>Operational Intelligence</span>
          </div>
        </div>

        {/* Small robot video square */}
        <div style={{
          borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden',
          background: `linear-gradient(160deg, rgba(139,92,246,0.14), rgba(0,0,0,0.3))`,
          width: '100%', height: 140, flexShrink: 0,
        }}>
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
            <VideoPlayer />
          </div>
        </div>

        {/* Chat box below */}
        <ChatBot apiKey={apiKey} />
      </div>
    </div>
  );
}

export { ExecutiveDashboard };