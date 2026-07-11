import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { GlassCard } from '../components/common/GlassCard';
import { Sparkles, CloudSun, AlertCircle, Truck, ChevronRight, Droplets, Wind, Percent } from 'lucide-react';

export const PredictiveAnalytics: React.FC = () => {
  useRestaurant();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      padding: '20px', 
      backgroundColor: '#0A0B0D', 
      color: '#FFFFFF', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      
      {/* Injecting CSS animations and helper classes */}
      <style>{`
        .animated-card {
          animation: fadeIn 0.4s ease-out both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .animated-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        /* Sparkline and Graph Path Drawing Animations */
        .sparkline-draw {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: drawLine 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .main-line-draw {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          animation: drawLine 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .dashed-line-draw {
          stroke-dasharray: 6, 6;
          opacity: 0;
          animation: fadeInDashed 1.2s ease-out 0.4s forwards;
        }
        
        /* Area and Circular Gauge Fill Animations */
        .area-fade-in {
          opacity: 0;
          animation: fillOpacity 1s ease-out 0.8s forwards;
        }
        .ring-segment-draw {
          animation: drawRing 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .gauge-segment-draw {
          animation: drawGauge 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        /* Marker Animations */
        .chart-marker {
          transform: scale(0);
          transform-origin: center;
          animation: popMarker 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeInDashed {
          to { opacity: 0.5; }
        }
        @keyframes fillOpacity {
          to { opacity: 0.04; }
        }
        @keyframes drawRing {
          from { stroke-dasharray: 0 100; }
        }
        @keyframes drawGauge {
          from { stroke-dasharray: 0 44; }
        }
        @keyframes popMarker {
          to { transform: scale(1); }
        }
      `}</style>

      {/* TOP ROW: Summary KPIs with Sparklines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        
        {/* KPI 1: Projected Weekly Revenue */}
        <GlassCard className="animated-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>PROJECTED WEEKLY REVENUE</span>
            <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '6px', color: 'var(--color-cyan)' }}>₹11,34,000</div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '6px' }}>
              Forecast based on historical performance + weather indicators.
            </span>
          </div>
          <div style={{ width: '80px', height: '40px' }}>
            <svg viewBox="0 0 80 40" width="100%" height="100%">
              <path className="sparkline-draw" d="M0 35 L10 32 L20 25 L30 28 L40 18 L50 22 L60 12 L70 15 L80 5" fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </GlassCard>

        {/* KPI 2: Risk Cancel Cost */}
        <GlassCard className="animated-card" style={{ padding: '16px', borderLeft: '3px solid var(--color-orange)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>RISK CANCEL COST (7D)</span>
            <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '6px', color: 'var(--color-orange)' }}>₹34,800</div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '6px' }}>
              Estimated revenue leaked if bottlenecks are ignored.
            </span>
          </div>
          <div style={{ width: '80px', height: '40px' }}>
            <svg viewBox="0 0 80 40" width="100%" height="100%">
              <path className="sparkline-draw" style={{ animationDelay: '0.2s' }} d="M0 35 L15 30 L30 32 L45 20 L60 15 L80 8" fill="none" stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </GlassCard>

        {/* KPI 3: External Demand Shift */}
        <GlassCard className="animated-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>EXTERNAL DEMAND SHIFT</span>
            <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '6px', color: 'var(--color-emerald)' }}>
              +18.5% <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.5)' }}>Rainy</span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '6px' }}>
              Precipitation forecasts predict increased delivery volume.
            </span>
          </div>
          <div style={{ width: '80px', height: '40px' }}>
            <svg viewBox="0 0 80 40" width="100%" height="100%">
              <path className="sparkline-draw" style={{ animationDelay: '0.4s' }} d="M0 35 L20 30 L40 18 L60 15 L80 5" fill="none" stroke="var(--color-emerald)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </GlassCard>
      </div>

      {/* MIDDLE ROW: Main Demand Projections & Weather Vectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '16px' }}>
        
        {/* Main 7-Day Graph Area */}
        <GlassCard className="animated-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--color-cyan)' }} />
              <span>Next 7 Days Demand Projections</span>
            </h3>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Confidence: 91.8% (Proprietary ML Model)</span>
          </div>

          <div style={{ display: 'flex', width: '100%', height: '180px' }}>
            {/* Y Axis Grid Labels */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.3)', width: '25px', paddingRight: '6px', textAlign: 'right' }}>
              <span>14K</span><span>12K</span><span>10K</span><span>8K</span><span>6K</span><span>4K</span><span>2K</span><span>0</span>
            </div>

            {/* Area Charts with Upper & Lower bounds */}
            <div style={{ flex: 1, position: 'relative' }}>
              <svg viewBox="0 0 600 140" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                {/* Confidence Range Area Shade */}
                <path className="area-fade-in" d="M 0 110 Q 100 95 200 75 T 400 70 T 600 50 L 600 85 T 400 100 T 200 110 T 0 125 Z" fill="var(--color-cyan)" opacity="0" />
                
                {/* Upper Confidence Line (Dashed) */}
                <path className="dashed-line-draw" d="M 0 110 Q 100 95 200 75 T 400 70 T 600 50" fill="none" stroke="var(--color-cyan)" strokeWidth="1.2" />
                
                {/* Core Predicted Demand Line */}
                <path className="main-line-draw" d="M 0 118 Q 100 103 200 83 T 400 83 T 600 65" fill="none" stroke="var(--color-cyan)" strokeWidth="2.5" />
                
                {/* Lower Confidence Line (Dashed) */}
                <path className="dashed-line-draw" d="M 0 125 Q 100 110 200 92 T 400 100 T 600 85" fill="none" stroke="var(--color-cyan)" strokeWidth="1.2" />
                
                {/* Data Circle Markers */}
                <circle className="chart-marker" style={{ animationDelay: '0.5s' }} cx="0" cy="118" r="4" fill="var(--color-cyan)" stroke="#0A0B0D" strokeWidth="2" />
                <circle className="chart-marker" style={{ animationDelay: '0.6s' }} cx="100" cy="103" r="4" fill="var(--color-cyan)" stroke="#0A0B0D" strokeWidth="2" />
                <circle className="chart-marker" style={{ animationDelay: '0.7s' }} cx="200" cy="83" r="4" fill="var(--color-cyan)" stroke="#0A0B0D" strokeWidth="2" />
                <circle className="chart-marker" style={{ animationDelay: '0.8s' }} cx="300" cy="83" r="4" fill="var(--color-cyan)" stroke="#0A0B0D" strokeWidth="2" />
                <circle className="chart-marker" style={{ animationDelay: '0.9s' }} cx="400" cy="83" r="4" fill="var(--color-cyan)" stroke="#0A0B0D" strokeWidth="2" />
                <circle className="chart-marker" style={{ animationDelay: '1.0s' }} cx="500" cy="74" r="4" fill="var(--color-cyan)" stroke="#0A0B0D" strokeWidth="2" />
                <circle className="chart-marker" style={{ animationDelay: '1.1s' }} cx="600" cy="65" r="4" fill="var(--color-cyan)" stroke="#0A0B0D" strokeWidth="2" />
              </svg>
              
              {/* Timeline Horizontal Axis Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                <span>Mon (Today)</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Chart Custom Legend Block */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', marginTop: '16px', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '2px', background: 'var(--color-cyan)' }} /> Predicted Demand</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '2px', borderTop: '2px dashed var(--color-cyan)', opacity: 0.6 }} /> Upper Confidence</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '2px', borderTop: '2px dashed var(--color-cyan)', opacity: 0.6 }} /> Lower Confidence</span>
          </div>
        </GlassCard>

        {/* Weather Risk Vectors Detail Panel */}
        <GlassCard className="animated-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '14px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudSun size={16} style={{ color: 'var(--color-cyan)' }} />
            <span>Weather Risk Vectors</span>
          </h4>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <div style={{ fontSize: '24px' }}>🌧️</div>
              <div style={{ fontSize: '11px', fontWeight: '700', marginTop: '4px' }}>Heavy Monsoon</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Wed, 16 Jul • 18:00</div>
              <span style={{ display: 'inline-block', fontSize: '9px', background: 'rgba(255,69,58,0.15)', color: 'var(--color-red)', padding: '2px 6px', borderRadius: '4px', marginTop: '6px', fontWeight: '600' }}>High Risk</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', flex: 1, fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                <Droplets size={12} style={{ color: 'var(--color-cyan)' }} /> <span><strong>28 mm</strong> Rainfall</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                <Wind size={12} style={{ color: 'var(--color-cyan)' }} /> <span><strong>22 km/h</strong> Wind Speed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                <Percent size={12} style={{ color: 'var(--color-cyan)' }} /> <span><strong>89%</strong> Humidity</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4', margin: 0 }}>
            A heavy monsoon forecast for Wednesday evening will shift Dine-In orders to Delivery (+28%). High risk of courier delivery timeout.
          </p>
          <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
            <strong>Recommendation:</strong> Pre-hire 2 external riders on shift for Wednesday 18:00 to reduce timeout risk.
          </div>
        </GlassCard>
      </div>

      {/* BOTTOM ROW: Revenue Breakdown, Top Risk Zones, and Risk Registry Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 4fr 4fr', gap: '16px' }}>
        
        {/* Panel 1: Revenue Impact Breakdown */}
        <GlassCard className="animated-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 16px 0', fontWeight: '700' }}>Revenue Impact Breakdown <span style={{ fontWeight: '400', color: 'rgba(255,255,255,0.4)' }}>(Next 7 Days)</span></h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '100px', height: '100px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 36 36" width="100%" height="100%">
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="3" />
                <circle className="ring-segment-draw" cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-emerald)" strokeWidth="3.5" strokeDasharray="63.5 36.5" strokeDashoffset="25" />
                <circle className="ring-segment-draw" cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-cyan)" strokeWidth="3.5" strokeDasharray="21.6 78.4" strokeDashoffset="-38.5" />
                <circle className="ring-segment-draw" cx="18" cy="18" r="15.91" fill="none" stroke="purple" strokeWidth="3.5" strokeDasharray="9.9 90.1" strokeDashoffset="-60.1" />
                <circle className="ring-segment-draw" cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-red)" strokeWidth="3.5" strokeDasharray="8.3 91.7" strokeDashoffset="-70" />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center', width: '100%', top: '30%' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', display: 'block' }}>₹11.34L</span>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>Total Impact</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-emerald)' }}>● Demand Shift</span><span>+₹7.21L</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-cyan)' }}>● Weather Surge</span><span>+₹2.45L</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'purple' }}>● Operational Eff</span><span>+₹1.12L</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-red)' }}>● Risk of Loss</span><span>-₹0.94L</span></div>
            </div>
          </div>
        </GlassCard>

        {/* Panel 2: Top Risk Zones */}
        <GlassCard className="animated-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 16px 0', fontWeight: '700' }}>Top Risk Zones <span style={{ fontWeight: '400', color: 'rgba(255,255,255,0.4)' }}>(By Demand Volatility)</span></h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            {[
              { name: 'North Zone', level: 'High', color: 'var(--color-red)', val: '+32%' },
              { name: 'East Zone', level: 'Medium', color: 'var(--color-orange)', val: '+21%' },
              { name: 'West Zone', level: 'Medium', color: 'var(--color-orange)', val: '+15%' },
              { name: 'South Zone', level: 'Low', color: 'var(--color-emerald)', val: '+8%' }
            ].map((zone, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '500' }}>{zone.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '10px', background: zone.color + '20', color: zone.color, padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>{zone.level}</span>
                  <span style={{ fontWeight: '700', width: '35px', textAlign: 'right' }}>{zone.val}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Panel 3: Active Risk Registry & Overall Score */}
        <GlassCard className="animated-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '13px', margin: '0 0 12px 0', fontWeight: '700' }}>Active Risk Registry</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '4px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={12} style={{ color: 'var(--color-red)' }} /> Cheese Stock Depletion</span>
                <span style={{ color: 'var(--color-red)', fontWeight: '700', marginLeft: 'auto' }}>₹24,000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '4px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={12} style={{ color: 'var(--color-orange)' }} /> North Zone Delivery Delay</span>
                <span style={{ color: 'var(--color-orange)', fontWeight: '700', marginLeft: 'auto' }}>₹18,000</span>
              </div>
            </div>
          </div>

          {/* Overall Meter Gauge Metric */}
          <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '35px', position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 32 16" width="100%" height="100%">
                <path d="M2,16 A14,14 0 0,1 30,16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <path className="gauge-segment-draw" d="M2,16 A14,14 0 0,1 30,16" fill="none" stroke="var(--color-orange)" strokeWidth="3.5" strokeDasharray="30 44" />
              </svg>
              <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontSize: '12px', fontWeight: '800' }}>62</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-orange)' }}>Moderate Risk Score</div>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Monitor high risk zones and surges.</span>
            </div>
            <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--color-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '600' }}>
              Mitigate <ChevronRight size={14} />
            </button>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};