import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { GlassCard } from '../components/common/GlassCard';
import { Truck, AlertTriangle, MapPin, Compass, Calendar, SlidersHorizontal, TrendingUp, BarChart3, Info } from 'lucide-react';

export const DeliveryIntelligence: React.FC = () => {
  const { riders, applyRecommendation } = useRestaurant();
  const [showWarning, setShowWarning] = useState(true);

  // Always reflects the real system date — never hardcoded.
  const todayLabel = `Today, ${new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())}`;

  const getZoneColor = (minutes: number) => {
    if (minutes > 35) return 'var(--color-red)';
    if (minutes > 26) return 'var(--color-orange)';
    return 'var(--color-emerald)';
  };

  const zones = [
    { id: 'north', name: 'North Delivery Zone', time: 37, orders: '42%', sla: 72 },
    { id: 'south', name: 'South Delivery Zone', time: 28, orders: '26%', sla: 81 },
    { id: 'east', name: 'East Delivery Zone', time: 24, orders: '18%', sla: 85 },
    { id: 'west', name: 'West Delivery Zone', time: 25, orders: '14%', sla: 79 }
  ];

  const insights = [
    { id: 1, type: 'error', text: 'High delays in North Zone', subtext: 'Consider reallocating riders to improve SLA.', color: 'var(--color-red)' },
    { id: 2, type: 'warning', text: 'Peak time between 12 PM - 6 PM', subtext: 'Orders surge by 32% during this window.', color: 'var(--color-orange)' },
    { id: 3, type: 'success', text: 'East Zone performing well', subtext: 'Higher on-time rate compared to other zones.', color: 'var(--color-emerald)' }
  ];

  const handleReallocate = () => {
    applyRecommendation('alert-delivery');
    setShowWarning(false);
  };

  const cardAnimationStyle = {
    animation: 'fadeIn 0.5s ease-out forwards',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      padding: '20px', 
      color: '#FFFFFF', 
      backgroundColor: '#0A0B0D', 
      height: '100vh', 
      overflowY: 'auto', 
      boxSizing: 'border-box'
    }}>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .animated-card {
          animation: fadeIn 0.4s ease-out both;
        }
        .animated-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .warning-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 200px;
          opacity: 1;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .warning-card.hidden {
          max-height: 0;
          opacity: 0;
          padding-top: 0;
          padding-bottom: 0;
          margin-bottom: 0;
          border: none;
        }
        .trend-line {
          stroke-dasharray: 1000;
          animation: drawLine 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass style={{ color: 'var(--color-cyan)' }} size={20} />
            Delivery Analytics
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Real-time overview of delivery operations and performance</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: '#14161A', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <Calendar size={14} /> {todayLabel}
          </button>
          <button style={{ background: '#14161A', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Top Summary Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.05s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>AVERAGE DELIVERY TIME</span>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: 'var(--color-red)' }}>
                37 mins
              </div>
            </div>
            <div style={{ color: 'var(--color-red)', opacity: 0.6 }}><TrendingUp size={24} /></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Target: 30 mins limit. Variance peak: North Zone.
          </span>
        </GlassCard>

        <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>ON-TIME SLA PERCENTAGE</span>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: 'var(--color-orange)' }}>
                78.2%
              </div>
            </div>
            <div style={{ color: 'var(--color-orange)', opacity: 0.6 }}><TrendingUp size={24} /></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Calculated across active dispatch riders in service.
          </span>
        </GlassCard>

        <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>DISPATCH ORDER QUEUE</span>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: 'var(--color-cyan)' }}>
                8 tickets <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-secondary)' }}>Pending</span>
              </div>
            </div>
            <div style={{ color: 'var(--color-cyan)', opacity: 0.6 }}><BarChart3 size={24} /></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Orders boxed and waiting at dispatch table: 3 tickets.
          </span>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 5fr 4fr', gap: '16px', alignItems: 'start' }}>
        
        {/* Left Column: Regional Zone Performance */}
        <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.2s', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={16} style={{ color: 'var(--color-cyan)' }} />
            <span>Regional Zone Performance</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {zones.map(zone => {
              const color = getZoneColor(zone.time);
              return (
                <div key={zone.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>{zone.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Share: {zone.orders}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Average Transit:</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: color }}>{zone.time} mins</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                      <span>On-time %:</span>
                      <span>{zone.sla}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${zone.sla}%`, height: '100%', background: color, borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Middle Column: Map Heatmap & Accurate Delivery Trend Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.25s', height: '320px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(10,11,13,0.8), transparent)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={16} style={{ color: 'var(--color-cyan)' }} />
                <span>Live Delivery Heatmap</span>
                <span style={{ fontSize: '10px', background: 'rgba(52,211,153,0.1)', color: 'var(--color-emerald)', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>• Live</span>
              </h3>
            </div>
            <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img 
                src="https://miro.medium.com/v2/resize:fit:1358/1*925qsq1DK5cfs-XxSaC-SA.gif" 
                alt="Live Heatmap" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
              />
            </div>
            <div style={{ padding: '10px 16px', display: 'flex', gap: '16px', fontSize: '10px', color: 'var(--text-secondary)', background: '#0D0E12', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }} /> On-time (&lt; 30m)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-orange)' }} /> Delayed (30m - 60m)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-red)' }} /> Severely Delayed (&gt; 60m)</span>
            </div>
          </GlassCard>

          {/* Precise High-Fidelity Delivery Trend Line Chart */}
          <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.3s', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>Delivery Trend (Today)</h3>
              <div style={{ display: 'flex', gap: '14px', fontSize: '11px', fontWeight: '500' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--color-emerald)', borderRadius: '2px', display: 'inline-block' }} /> On-time
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--color-orange)', borderRadius: '2px', display: 'inline-block' }} /> Delayed
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--color-red)', borderRadius: '2px', display: 'inline-block' }} /> Severely Delayed
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%', height: '150px' }}>
              {/* Y Axis Numeric Labels */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'right', width: '24px', height: '120px', paddingRight: '4px' }}>
                <span>120</span>
                <span>80</span>
                <span>40</span>
                <span>0</span>
              </div>

              {/* Chart Plot Workspace */}
              <div style={{ flex: 1, position: 'relative' }}>
                <svg viewBox="0 0 600 120" width="100%" height="120px" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  {/* Grid background markers matched exactly to Y thresholds */}
                  <line x1="0" y1="0" x2="600" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                  {/* GREEN LINE: On-Time Data Sequence */}
                  <path 
                    className="trend-line"
                    d="M 0 115 L 20 113 L 40 111 L 60 108 L 80 105 L 100 101 L 120 98 L 140 94 L 160 88 L 180 84 L 200 85 L 220 78 L 240 78 L 260 69 L 280 65 L 300 50 L 320 54 L 340 64 L 360 56 L 380 60 L 400 57 L 420 50 L 440 55 L 460 62 L 480 64 L 500 60 L 520 50 L 540 56 L 560 58 L 580 68 L 600 75" 
                    fill="none" 
                    stroke="var(--color-emerald)" 
                    strokeWidth="2" 
                    strokeLinejoin="round" 
                    strokeLinecap="round"
                  />

                  {/* YELLOW/ORANGE LINE: Delayed Data Sequence */}
                  <path 
                    className="trend-line"
                    d="M 0 118 L 20 118 L 40 116 L 60 115 L 80 114 L 100 112 L 120 110 L 140 108 L 160 108 L 180 105 L 200 107 L 220 103 L 240 106 L 260 99 L 280 101 L 300 92 L 320 96 L 340 101 L 360 97 L 380 97 L 400 93 L 420 86 L 440 93 L 460 90 L 480 95 L 500 91 L 520 95 L 540 88 L 560 94 L 580 97 L 600 99" 
                    fill="none" 
                    stroke="var(--color-orange)" 
                    strokeWidth="2" 
                    strokeLinejoin="round" 
                    strokeLinecap="round"
                    style={{ animationDelay: '0.15s' }}
                  />

                  {/* RED LINE: Severely Delayed Data Sequence */}
                  <path 
                    className="trend-line"
                    d="M 0 120 L 20 120 L 40 119 L 60 119 L 80 119 L 100 118 L 120 118 L 140 117 L 160 117 L 180 116 L 200 116 L 220 115 L 240 115 L 260 113 L 280 113 L 300 111 L 320 113 L 340 111 L 360 112 L 380 111 L 400 113 L 420 110 L 440 113 L 460 112 L 480 114 L 500 112 L 520 113 L 540 111 L 560 114 L 580 116 L 600 117" 
                    fill="none" 
                    stroke="var(--color-red)" 
                    strokeWidth="2" 
                    strokeLinejoin="round" 
                    strokeLinecap="round"
                    style={{ animationDelay: '0.3s' }}
                  />
                </svg>

                {/* X Axis Chronological Labels Grid Line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px', paddingLeft: '2px' }}>
                  <span>12 AM</span>
                  <span>3 AM</span>
                  <span>6 AM</span>
                  <span>9 AM</span>
                  <span>12 PM</span>
                  <span>3 PM</span>
                  <span>6 PM</span>
                  <span>9 PM</span>
                  <span>12 AM</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Alerts, Riders, and Analytics Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className={`warning-card ${!showWarning ? 'hidden' : ''}`}>
            <GlassCard style={{ borderLeft: '3px solid var(--color-red)', background: 'rgba(255,69,58,0.02)', height: '100%' }}>
              <h4 style={{ color: 'var(--color-red)', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0' }}>
                <AlertTriangle size={14} /> Rider Deficit Warning
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                North Zone average delivery duration is 37 mins. Under-staffing is hurting customer retention.
              </p>
              <button
                onClick={handleReallocate}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-medium)',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textAlign: 'center',
                  transition: 'background 0.2s'
                }}
              >
                Reallocate 1 Rider to North Zone
              </button>
            </GlassCard>
          </div>

          <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.35s' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
              <Truck size={14} style={{ color: 'var(--color-cyan)' }} />
              <span>Active Rider Roster</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {riders.length > 0 ? riders.map(rider => (
                <div key={rider.id} style={{ padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{rider.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Zone: {rider.zone} • Status: {rider.status}</div>
                  </div>
                  <span style={{ color: rider.averageTimeMinutes > 35 ? 'var(--color-red)' : 'var(--text-secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {rider.averageTimeMinutes}m avg
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getZoneColor(rider.averageTimeMinutes) }} />
                  </span>
                </div>
              )) : (
                [
                  { name: 'Rahul Sharma', zone: 'North Zone', time: '37m avg', color: 'var(--color-red)' },
                  { name: 'Amit Verma', zone: 'North Zone', time: '37m avg', color: 'var(--color-red)' },
                  { name: 'Vikram Singh', zone: 'South Zone', time: '28m avg', color: 'var(--color-emerald)' },
                  { name: 'Priya Nair', zone: 'East Zone', time: '24m avg', color: 'var(--color-emerald)' }
                ].map((rider, i) => (
                  <div key={i} style={{ padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{rider.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Zone: {rider.zone} • Status: transit</div>
                    </div>
                    <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                      {rider.time}
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rider.color }} />
                    </span>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="animated-card" style={{ ...cardAnimationStyle, animationDelay: '0.4s' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
              <Info size={14} style={{ color: 'var(--color-cyan)' }} />
              <span>Delivery Insights</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {insights.map(insight => (
                <div key={insight.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: insight.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0, marginTop: '2px', color: '#000000' }}>
                    !
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#FFFFFF' }}>{insight.text}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{insight.subtext}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};