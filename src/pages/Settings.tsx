import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { GlassCard } from '../components/common/GlassCard';
import { 
  Settings as SettingsIcon, Cpu, Database, Sliders, RefreshCw, 
  ChevronRight, Edit2, Bell, Mail, MessageSquare, Terminal, ShieldAlert, CheckCircle 
} from 'lucide-react';

// Reusable micro-counter for frame-by-frame ticking layout animation
const AnimatedNumber: React.FC<{ value: number; decimalPlaces?: number; suffix?: string }> = ({ value, decimalPlaces = 0, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 800; 
    const startTime = performance.now();

    const updateNumber = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = progress * (2 - progress);
      
      const currentNumber = easeProgress * (end - start) + start;
      setDisplayValue(currentNumber);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value]);

  return <span>{displayValue.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{suffix}</span>;
};

export const Settings: React.FC = () => {
  const { state, resetSimulation } = useRestaurant();
  const [syncTimers, setSyncTimers] = useState([10, 8, 12, 15]);
  
  // Interactive Live Dynamic States
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isTestingConnections, setIsTestingConnections] = useState(false);
  const [connectorLatencies, setConnectorLatencies] = useState(['120ms', '240ms', '410ms', '180ms']);
  const [healthStatus, setHealthStatus] = useState<'Healthy' | 'Degraded' | 'Checking'>('Healthy');

  // Trigger temporary floating micro-notifications
  const triggerToast = (message: string) => {
    setActiveNotification(message);
    setTimeout(() => setActiveNotification(null), 3500);
  };

  // Simulate changing sync seconds live
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTimers(prev => prev.map(t => (t >= 30 ? 1 : t + 1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handler: Test All Connectors Pipeline Animation
  const handleTestConnections = () => {
    if (isTestingConnections) return;
    setIsTestingConnections(true);
    triggerToast("Initiating structural ping test across pipeline arrays...");
    
    setTimeout(() => {
      setConnectorLatencies([
        `${Math.floor(Math.random() * 50 + 90)}ms`,
        `${Math.floor(Math.random() * 80 + 180)}ms`,
        `${Math.floor(Math.random() * 150 + 300)}ms`,
        `${Math.floor(Math.random() * 60 + 120)}ms`
      ]);
      setSyncTimers([0, 0, 0, 0]);
      setIsTestingConnections(false);
      triggerToast("Pipeline array operational metrics optimized successfully!");
    }, 1800);
  };

  // Handler: Diagnostic System Health Sweep
  const handleHealthCheck = () => {
    setHealthStatus('Checking');
    triggerToast("Executing complete systems topology verification...");
    setTimeout(() => {
      setHealthStatus('Healthy');
      triggerToast("All nodes reporting functional parameters.");
    }, 1500);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px', 
      padding: '16px 4px', 
      color: '#94a3b8', 
      fontFamily: 'Inter, system-ui, sans-serif',
      maxHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Dynamic Slide-in Contextual Notification Banner */}
      {activeNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#09090b',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '12px 18px',
          color: '#ffffff',
          fontSize: '12px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.7)',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <CheckCircle size={14} style={{ color: '#10b981' }} />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Embedded CSS Keyframe Injection for Micro-Animations */}
      <style>{`
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .interactive-btn { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .interactive-btn:hover { background: #16161c !important; color: #ffffff !important; transform: translateY(-1px); }
        .interactive-btn:active { transform: translateY(0); }
        .card-hover-entry { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
      
      {/* Top Banner Header Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={22} style={{ color: '#06b6d4' }} />
            <span>System Settings</span>
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', margin: 0 }}>
            Configure system preferences, integrations, and operational data pipelines.
          </p>
        </div>
        
        <button 
          onClick={handleHealthCheck}
          className="interactive-btn"
          style={{
            background: '#0b0b0e',
            border: '1px solid #16161c',
            borderRadius: '8px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b' }}>System Health</span>
          <span style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            backgroundColor: healthStatus === 'Healthy' ? '#10b981' : healthStatus === 'Checking' ? '#eab308' : '#ef4444',
            transition: 'background-color 0.3s ease'
          }}></span>
          <span style={{ 
            fontSize: '11px', 
            color: healthStatus === 'Healthy' ? '#10b981' : healthStatus === 'Checking' ? '#eab308' : '#ef4444', 
            fontWeight: '600' 
          }}>
            {healthStatus}
          </span>
          <ChevronRight size={12} style={{ color: '#4b5563', marginLeft: '4px' }} />
        </button>
      </div>

      {/* Main 4-Card Dashboard Grid Layout Block (Scrollable) */}
      <div 
        className="dashboard-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '20px',
          overflowY: 'auto',
          paddingRight: '4px',
          flexGrow: 1
        }}
      >
        
        {/* PANEL 1: Branch Configuration */}
        <div className="card-hover-entry" style={{ gridColumn: 'span 6', animationDelay: '0.05s' }}>
          <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(6,182,212,0.06)', padding: '8px', borderRadius: '8px' }}>
                  <SettingsIcon size={18} style={{ color: '#06b6d4', display: 'block' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>Branch Configuration</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Manage branch details and operational settings.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Branch Name', value: state?.branchName || 'Downtown Hub (HQ)', keyName: 'Branch Name' },
                  { label: 'Operational Mode', value: 'Active AI Monitoring Enabled', isStatus: true, keyName: 'Operational Topology' },
                  { label: 'Geographic Coordinates', value: '12.9716° N, 77.5946° E (Bengaluru HQ)', keyName: 'Telemetry Coordinates' }
                ].map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid #111115',
                    paddingBottom: '12px'
                  }}>
                    <div>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', color: '#4b5563', letterSpacing: '0.05em', display: 'block' }}>{item.label}</label>
                      <div style={{ 
                        color: item.isStatus ? '#10b981' : '#ffffff', 
                        fontWeight: '600', 
                        fontSize: '13px', 
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {item.isStatus && <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>}
                        {item.value}
                      </div>
                    </div>
                    <button 
                      onClick={() => triggerToast(`Invoking editor node: [${item.keyName}]`)}
                      className="interactive-btn"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '6px', borderRadius: '4px' }}
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => {
                resetSimulation?.();
                triggerToast("Sandbox orchestration parameters restored to system default.");
              }}
              className="interactive-btn"
              style={{
                marginTop: '20px',
                background: 'transparent',
                border: '1px solid #16161c',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={13} style={{ color: '#06b6d4' }} />
              <span>Reset Sandbox Settings</span>
            </button>
          </GlassCard>
        </div>

        {/* PANEL 2: Operational Connectors */}
        <div className="card-hover-entry" style={{ gridColumn: 'span 6', animationDelay: '0.1s' }}>
          <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(16,185,129,0.06)', padding: '8px', borderRadius: '8px' }}>
                    <Cpu size={18} style={{ color: '#10b981', display: 'block' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>Operational Connectors</h3>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Monitor and manage system integrations and data streams.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleTestConnections}
                  className="interactive-btn"
                  style={{
                    background: isTestingConnections ? '#16161c' : 'rgba(255,255,255,0.02)',
                    border: '1px solid #16161c',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    color: '#e4e4e7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={10} className={isTestingConnections ? 'spin-anim' : ''} style={{ animation: isTestingConnections ? 'spin 1s linear infinite' : 'none' }} />
                  {isTestingConnections ? 'Testing Array...' : 'Test All Connections'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'POS Integration (Sales Stream)', icon: <Terminal size={14} />, color: '#10b981', bg: 'rgba(16,185,129,0.04)' },
                  { name: 'KDS Connection (Prep Clock)', icon: <RefreshCw size={14} />, color: '#a855f7', bg: 'rgba(168,85,247,0.04)' },
                  { name: 'Inventory Ledger (Safety Stock)', icon: <Database size={14} />, color: '#f97316', bg: 'rgba(249,115,22,0.04)' },
                  { name: 'Rider GPS Logs (Transit delays)', icon: <Sliders size={14} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.04)' }
                ].map((conn, idx) => (
                  <div 
                    key={idx}
                    onClick={() => triggerToast(`Opening advanced telemetry parameters for ${conn.name.split(' ')[0]}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#050507',
                      border: '1px solid #16161c',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#27272a'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#16161c'}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ backgroundColor: conn.bg, color: conn.color, padding: '8px', borderRadius: '6px' }}>
                        {conn.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '12px' }}>{conn.name}</div>
                        <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '2px' }}>Latency: {connectorLatencies[idx]}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: '#10b981', fontWeight: '600', fontSize: '11px', display: 'block' }}>
                          ● Connected
                        </span>
                        <span style={{ fontSize: '9px', color: '#4b5563', display: 'block', marginTop: '2px' }}>
                          Last synced: {syncTimers[idx]}s ago
                        </span>
                      </div>
                      <ChevronRight size={13} style={{ color: '#3f3f46' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button 
                onClick={() => triggerToast("Loading dedicated microservice connector console...")}
                style={{ background: 'transparent', border: 'none', fontSize: '11px', color: '#06b6d4', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                View All Connectors <span style={{ fontSize: '12px' }}>➔</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* PANEL 3: Operational Database Size */}
        <div className="card-hover-entry" style={{ gridColumn: 'span 6', animationDelay: '0.15s' }}>
          <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(168,85,247,0.06)', padding: '8px', borderRadius: '8px' }}>
                <Database size={18} style={{ color: '#a855f7', display: 'block' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>Operational Database Size</h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>View database capacity, usage, and retention configuration.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1, padding: '10px 0' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="50" fill="transparent" stroke="#16161c" strokeWidth="6" />
                  <circle 
                    cx="60" cy="60" r="50" fill="transparent" stroke="#06b6d4" strokeWidth="6" 
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - 0.621)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                    <AnimatedNumber value={12854} />
                  </span>
                  <span style={{ fontSize: '9px', color: '#4b5563', textTransform: 'uppercase', marginTop: '2px' }}>Rows</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '11px' }}>
                    <span>Storage Used</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>62.1%</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>2.48 GB</div>
                  <div style={{ height: '3px', background: '#16161c', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '62.1%', height: '100%', background: '#38bdf8', borderRadius: '2px' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #111115', paddingTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>Storage Allocated</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>4.00 GB</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Cache Hit Ratio</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>
                    <AnimatedNumber value={93.4} decimalPlaces={1} suffix="%" />
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b' }}>Data Retention</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontWeight: '600' }}>
                    <span>90 Days</span>
                    <button 
                      onClick={() => triggerToast("Initializing Retention Array Adjuster Module...")}
                      className="interactive-btn"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '2px', borderRadius: '4px' }}
                    >
                      <Edit2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => triggerToast("Launching relational database optimizer stack...")}
              className="interactive-btn"
              style={{
                marginTop: '16px',
                background: 'transparent',
                border: '1px solid #16161c',
                color: '#06b6d4',
                padding: '8px 0',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Database size={12} /> Manage Database
            </button>
          </GlassCard>
        </div>

        {/* PANEL 4: System Preferences */}
        <div className="card-hover-entry" style={{ gridColumn: 'span 6', animationDelay: '0.2s' }}>
          <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(99,102,241,0.06)', padding: '8px', borderRadius: '8px' }}>
                <Sliders size={18} style={{ color: '#6366f1', display: 'block' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>System Preferences</h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Configure global system preferences and alerts.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px' }}>
                {[
                  { label: 'Alert Sensitivity', value: 'High', color: '#ef4444', icon: <ShieldAlert size={12} /> },
                  { label: 'AI Recommendation Level', value: 'Proactive', color: '#10b981', icon: <Cpu size={12} /> },
                  { label: 'Report Generation Time', value: '03:00 AM Daily', color: '#3b82f6', icon: <RefreshCw size={12} /> },
                  { label: 'Time Zone', value: 'Asia/Kolkata (IST)', color: '#3b82f6', icon: <SettingsIcon size={12} /> },
                  { label: 'Data Sync Frequency', value: 'Real-time', color: '#10b981', icon: <RefreshCw size={12} /> }
                ].map((pref, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => triggerToast(`Altering Preference Module Node: [${pref.label}]`)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {pref.icon} {pref.label}
                    </span>
                    <span className="interactive-btn" style={{ color: pref.color, fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '2px 4px', borderRadius: '4px' }}>
                      {pref.value} <ChevronRight size={10} style={{ color: '#4b5563' }} />
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#050507', border: '1px solid #16161c', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#ffffff', display: 'block' }}>Notification Channels</span>
                <span style={{ fontSize: '9px', color: '#4b5563', display: 'block', marginTop: '2px', marginBottom: '12px' }}>Configure where alerts are sent.</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
                  {[
                    { name: 'Email Notifications', active: true, icon: <Mail size={12} /> },
                    { name: 'SMS Alerts', active: true, icon: <MessageSquare size={12} /> },
                    { name: 'In-App Notifications', active: true, icon: <Bell size={12} /> },
                    { name: 'Webhook Integration', active: false, icon: <Terminal size={12} /> }
                  ].map((chan, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => triggerToast(`Toggled channel pipeline: ${chan.name}`)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <span style={{ color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {chan.icon} {chan.name}
                      </span>
                      <span className="interactive-btn" style={{ color: chan.active ? '#10b981' : '#4b5563', fontWeight: '600', fontSize: '10px', padding: '2px 4px', borderRadius: '4px' }}>
                        {chan.active ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => triggerToast("Opening full screen preference management view...")}
              className="interactive-btn"
              style={{
                marginTop: '16px',
                background: 'transparent',
                border: '1px solid #16161c',
                color: '#38bdf8',
                padding: '8px 0',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Edit2 size={12} /> Edit Preferences
            </button>
          </GlassCard>
        </div>

      </div>
      
      {/* Dynamic Keyframe Rules Injector Injection Block */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};