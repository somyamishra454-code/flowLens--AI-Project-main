import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  FileText, Download, CheckCircle, IndianRupee, ShoppingBag, 
  Clock, Truck, Trash2, ChevronRight, LayoutGrid, BarChart3, Clock3
} from 'lucide-react';

type TimeframeType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Reusable Counter Sub-Component for frame-by-frame ticking animation
const AnimatedNumber: React.FC<{ value: number; isCurrency?: boolean }> = ({ value, isCurrency = false }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    // Adjust total animation runtime (ms) based on magnitude
    const duration = 800; 
    const startTime = performance.now();

    const updateNumber = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smooth slowing down at the end (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      
      const currentNumber = Math.floor(easeProgress * (end - start) + start);
      setDisplayValue(currentNumber);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value]);

  if (isCurrency) {
    return (
      <span>
        {new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(displayValue)}
      </span>
    );
  }

  return <span>{displayValue.toLocaleString('en-IN')}</span>;
};

export const ExecutiveReports: React.FC = () => {
  const { metrics } = useRestaurant();
  const [generating, setGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<string>('daily_summary');
  const [timeframe, setTimeframe] = useState<TimeframeType>('daily');
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    setAnimationProgress(0);
    const timer = setTimeout(() => setAnimationProgress(1), 50);
    return () => clearTimeout(timer);
  }, [activeReport, timeframe]);

  const handleReportChange = (typeId: string) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setActiveReport(typeId);
    }, 400);
  };

  const handleExportPDF = () => {
    const printableContent = document.getElementById('report-canvas-print-area');
    if (!printableContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Executive Report Export</title>
          <style>
            body { background-color: #050507; color: #e4e4e7; font-family: system-ui, sans-serif; padding: 40px; }
            h4, h5 { color: #ffffff; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #16161c; padding: 10px; text-align: left; font-size: 12px; }
            th { color: #64748b; }
            .card { background: #0b0b0e; border: 1px solid #16161c; padding: 12px; border-radius: 6px; }
            .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
            @media print { body { background: #fff; color: #000; padding: 0; } th, td, .card { border-color: #ddd; color: #000; } }
          </style>
        </head>
        <body>
          ${printableContent.innerHTML}
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const timeframeData = {
    daily: {
      revenue: metrics?.revenueTotal ?? 162000,
      orders: metrics?.ordersCount ?? 142,
      prepTime: metrics?.averagePrepTime ?? 1308, 
      waste: metrics?.wasteCost ?? 7799,
      sla: 78,
      chartPath: "M 10 75 Q 50 60 100 50 T 180 30 T 260 45 T 310 25",
      intervals: ["08:00", "12:00", "16:00", "20:00", "Current Day"],
      rows: [
        { name: 'Pizza & Oven Station', orders: 46, prep: '19m 20s', target: '10m', sla: 72, status: 'Below SLA', error: true },
        { name: 'Charcoal Grill Station', orders: 32, prep: '7m 0s', target: '8m', sla: 88, status: 'Optimal', error: false },
        { name: 'Deep Fryer Station', orders: 28, prep: '5m 10s', target: '6m', sla: 85, status: 'Optimal', error: false },
        { name: 'Salad & Cold Prep', orders: 36, prep: '8m 17s', target: '8m', sla: 92, status: 'Optimal', error: false }
      ]
    },
    weekly: {
      revenue: 1134000,
      orders: 994,
      prepTime: 1240, 
      waste: 54600,
      sla: 84,
      chartPath: "M 10 80 Q 60 40 120 70 T 200 40 T 270 55 T 310 15",
      intervals: ["Mon", "Wed", "Fri", "Sat", "Last Week"],
      rows: [
        { name: 'Pizza & Oven Station', orders: 322, prep: '16m 45s', target: '10m', sla: 79, status: 'Below SLA', error: true },
        { name: 'Charcoal Grill Station', orders: 244, prep: '7m 12s', target: '8m', sla: 91, status: 'Optimal', error: false },
        { name: 'Deep Fryer Station', orders: 208, prep: '5m 40s', target: '6m', sla: 89, status: 'Optimal', error: false },
        { name: 'Salad & Cold Prep', orders: 220, prep: '7m 55s', target: '8m', sla: 94, status: 'Optimal', error: false }
      ]
    },
    monthly: {
      revenue: 4860000,
      orders: 4260,
      prepTime: 1190, 
      waste: 233970,
      sla: 89,
      chartPath: "M 10 60 Q 70 80 130 40 T 210 50 T 280 30 T 310 10",
      intervals: ["Week 1", "Week 2", "Week 3", "Week 4", "Last Month"],
      rows: [
        { name: 'Pizza & Oven Station', orders: 1380, prep: '15m 10s', target: '10m', sla: 82, status: 'Optimal', error: false },
        { name: 'Charcoal Grill Station', orders: 1020, prep: '7m 02s', target: '8m', sla: 93, status: 'Optimal', error: false },
        { name: 'Deep Fryer Station', orders: 890, prep: '5m 22s', target: '6m', sla: 91, status: 'Optimal', error: false },
        { name: 'Salad & Cold Prep', orders: 970, prep: '7m 30s', target: '8m', sla: 96, status: 'Optimal', error: false }
      ]
    },
    yearly: {
      revenue: 58320000,
      orders: 51120,
      prepTime: 1110, 
      waste: 2808000,
      sla: 93,
      chartPath: "M 10 90 Q 80 30 140 50 T 220 20 T 290 35 T 310 5",
      intervals: ["Q1", "Q2", "Q3", "Q4", "Last Year"],
      rows: [
        { name: 'Pizza & Oven Station', orders: 16560, prep: '13m 45s', target: '10m', sla: 88, status: 'Optimal', error: false },
        { name: 'Charcoal Grill Station', orders: 12240, prep: '6m 50s', target: '8m', sla: 95, status: 'Optimal', error: false },
        { name: 'Deep Fryer Station', orders: 10680, prep: '5m 05s', target: '6m', sla: 94, status: 'Optimal', error: false },
        { name: 'Salad & Cold Prep', orders: 11640, prep: '7m 10s', target: '8m', sla: 97, status: 'Optimal', error: false }
      ]
    }
  };

  const currentData = timeframeData[timeframe];
  const prepMins = Math.floor(currentData.prepTime / 60);

  const reportTitles: Record<string, string> = {
    daily_summary: 'COO Core Parameters Summary',
    kitchen_velocity: 'KDS Station Performance Matrix',
    waste_ledger: 'Ingredient Spoilage & Loss Ledger'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '340px 1fr', 
      backgroundColor: '#050507', 
      minHeight: '100vh', 
      padding: '28px', 
      fontFamily: 'Inter, system-ui, sans-serif', 
      color: '#94a3b8',
      gap: '24px'
    }}>
      
      {/* Left Sidebar Control Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <FileText size={20} style={{ color: '#06b6d4' }} />
            <span>Executive Reports</span>
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: '12px 0 0 0' }}>
            Generate company reports to compile kitchen performance, KDS logs, and AI COO recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
          {[
            { id: 'daily_summary', name: 'Executive Overview Ledger', desc: 'Main operations summary configuration overview.', icon: <FileText size={16} /> },
            { id: 'kitchen_velocity', name: 'KDS & Station Velocity Log', desc: 'Detailed log of station-wise speed indices.', icon: <LayoutGrid size={16} /> },
            { id: 'waste_ledger', name: 'Ingredient Spoilage Ledger', desc: 'Track analytics on food waste and pricing leakage.', icon: <BarChart3 size={16} /> }
          ].map(type => {
            const isActive = activeReport === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleReportChange(type.id)}
                disabled={generating}
                style={{
                  background: isActive ? 'rgba(6, 182, 212, 0.03)' : '#0b0b0e',
                  border: isActive ? '1px solid #0e4e5a' : '1px solid #16161c',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ color: isActive ? '#06b6d4' : '#3f3f46', marginTop: '2px' }}>
                    {type.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: isActive ? '#ffffff' : '#e4e4e7', fontWeight: '600', marginBottom: '2px' }}>{type.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>{type.desc}</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: isActive ? '#06b6d4' : '#3f3f46', flexShrink: 0 }} />
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #16161c', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#e4e4e7', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock3 size={14} style={{ color: '#64748b' }} /> Pipeline Live
          </span>
          <span style={{ fontSize: '10px', color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>Connected</span>
        </div>
      </div>

      {/* Right Canvas Display Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>Report Console Preview</h3>
          <button
            onClick={handleExportPDF}
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              color: '#06b6d4',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={13} /> Export PDF
          </button>
        </div>

        {/* Scrollable Frame Panel Container */}
        <div style={{ 
          flex: 1, 
          background: '#0b0b0e', 
          border: '1px solid #16161c', 
          borderRadius: '12px', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          maxHeight: '660px',
          overflowY: 'auto'
        }}>
          
          {generating ? (
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{ border: '2px solid rgba(6,182,212,0.1)', borderTop: '2px solid #06b6d4', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '12px', color: '#64748b' }}>Recompiling operational log frameworks...</div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div id="report-canvas-print-area">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                    {reportTitles[activeReport] || reportTitles.daily_summary}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Active Audit Snapshot Matrix • All Stations Checked
                  </span>
                </div>
                
                {/* Timeline Multi-Selection Buttons */}
                <div style={{ display: 'flex', background: '#050507', border: '1px solid #16161c', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                  {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(time => (
                    <button
                      key={time}
                      onClick={() => setTimeframe(time)}
                      style={{
                        background: timeframe === time ? '#16161c' : 'transparent',
                        border: 'none',
                        color: timeframe === time ? '#ffffff' : '#4b5563',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Cards Row Grid with Frame Counter Triggers */}
              <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div className="card" style={{ backgroundColor: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Total Revenue</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#10b981', display: 'block', margin: '8px 0 6px 0' }}>
                    <AnimatedNumber value={currentData.revenue} isCurrency={true} />
                  </span>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(16,185,129,0.06)', padding: '4px', borderRadius: '4px' }}><IndianRupee size={12} style={{ color: '#10b981' }} /></div>
                </div>

                <div className="card" style={{ backgroundColor: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Orders Completed</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8', display: 'block', margin: '8px 0 6px 0' }}>
                    <AnimatedNumber value={currentData.orders} />
                  </span>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(56,189,248,0.06)', padding: '4px', borderRadius: '4px' }}><ShoppingBag size={12} style={{ color: '#38bdf8' }} /></div>
                </div>

                <div className="card" style={{ backgroundColor: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Avg Prep Time</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#f59e0b', display: 'block', margin: '8px 0 6px 0' }}>
                    <AnimatedNumber value={prepMins} />m
                  </span>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(245,158,11,0.06)', padding: '4px', borderRadius: '4px' }}><Clock size={12} style={{ color: '#f59e0b' }} /></div>
                </div>

                <div className="card" style={{ backgroundColor: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>On-Time SLA</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#c084fc', display: 'block', margin: '8px 0 6px 0' }}>
                    <AnimatedNumber value={currentData.sla} />%
                  </span>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(192,132,252,0.06)', padding: '4px', borderRadius: '4px' }}><Truck size={12} style={{ color: '#c084fc' }} /></div>
                </div>

                <div className="card" style={{ backgroundColor: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Wastage Cost</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#fbbf24', display: 'block', margin: '8px 0 6px 0' }}>
                    <AnimatedNumber value={currentData.waste} isCurrency={true} />
                  </span>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(251,191,36,0.06)', padding: '4px', borderRadius: '4px' }}><Trash2 size={12} style={{ color: '#fbbf24' }} /></div>
                </div>
              </div>

              {/* Layout Splitting Stack */}
              <div className="flex-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: '0 0 12px 0' }}>Key Insights</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ backgroundColor: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <CheckCircle size={14} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '500', display: 'block', lineHeight: '1.4' }}>Operational indices track normal safe thresholds.</span>
                        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>Satisfactory output generated based on selected window timeline metrics.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <h5 style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff', margin: 0 }}>Timeline Trend Tracking Vector</h5>
                  
                  <div style={{ flex: 1, position: 'relative', minHeight: '130px', borderLeft: '1px dashed #16161c', borderBottom: '1px solid #16161c', marginTop: '16px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                    <svg viewBox="0 0 320 100" style={{ width: '100%', height: '85%', overflow: 'visible' }}>
                      <path 
                        d={currentData.chartPath}
                        fill="none" 
                        stroke="#06b6d4" 
                        strokeWidth="2" 
                        strokeDasharray="400"
                        strokeDashoffset={400 * (1 - animationProgress)}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                      <circle 
                        cx="310" 
                        cy="25" 
                        r="4" 
                        fill="#06b6d4" 
                        style={{ 
                          transform: `scale(${animationProgress})`, 
                          transformOrigin: '310px 25px', 
                          transition: 'transform 0.3s 0.9s ease-out' 
                        }} 
                      />
                    </svg>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#3f3f46', marginTop: '8px' }}>
                    {currentData.intervals.map((label, idx) => (
                      <span key={idx}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Station Performance Table */}
              <div>
                <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: '0 0 12px 0' }}>Station Performance Matrix Summary</h5>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #16161c', color: '#64748b' }}>
                      <th style={{ paddingBottom: '10px', fontWeight: '500' }}>STATION LOCATION</th>
                      <th style={{ paddingBottom: '10px', fontWeight: '500' }}>VOLUME HITS</th>
                      <th style={{ paddingBottom: '10px', fontWeight: '500' }}>VELOCITY PREP</th>
                      <th style={{ paddingBottom: '10px', fontWeight: '500' }}>SLA THRESHOLD</th>
                      <th style={{ paddingBottom: '10px', fontWeight: '500' }}>ON-TIME DELIVERY</th>
                      <th style={{ paddingBottom: '10px', fontWeight: '500' }}>STATUS SYSTEM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.rows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #16161c' }}>
                        <td style={{ padding: '12px 0', color: '#e4e4e7', fontWeight: '500' }}>{row.name}</td>
                        <td style={{ color: '#ffffff' }}><AnimatedNumber value={row.orders} /></td>
                        <td style={{ color: row.error ? '#ef4444' : '#10b981' }}>{row.prep}</td>
                        <td style={{ color: '#64748b' }}>{row.target}</td>
                        <td style={{ color: row.error ? '#ef4444' : '#10b981' }}><AnimatedNumber value={row.sla} />%</td>
                        <td>
                          <span style={{ 
                            color: row.error ? '#ef4444' : '#10b981', 
                            backgroundColor: row.error ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)', 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            fontSize: '10px',
                            fontWeight: '500'
                          }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
};