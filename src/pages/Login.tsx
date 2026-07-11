import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Sparkles, ArrowRight, Shield, Zap, BarChart3, Mail, Lock, EyeOff, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: Zap,        title: 'Real-time AI COO',      desc: 'Continuous monitoring across every operational layer' },
  { icon: BarChart3,  title: 'Predictive Intelligence', desc: 'ML-powered forecasts with 91.8% model confidence' },
  { icon: Shield,     title: 'Decision Automation',   desc: 'Ranked actions by revenue impact and confidence' },
];

export const Login: React.FC = () => {
  const { setActiveView } = useRestaurant();
  const [email, setEmail] = useState('operator@flowlens.ai');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setActiveView('dashboard');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#020408',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      
      {/* GLOBAL CSS HOVER ANIMATION RULES */}
      <style>{`
        .input-glow:focus-within {
          border-color: #06b6d4 !important;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.15) !important;
        }
        .btn-action { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-action:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-action:active { transform: translateY(0); }
        .floating-pill { animation: floatAnim 4s ease-in-out infinite alternate; }
        @keyframes floatAnim { from { transform: translateY(0px); } to { transform: translateY(-6px); } }
      `}</style>

      {/* LEFT PANEL: HERO CONTENT & ANALYTICAL METRICS */}
      <div style={{
        flex: '0 0 54%',
        background: '#030712',
        borderRight: '1px solid #111827',
        display: 'flex',
        flexDirection: 'column',
        padding: '56px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Abstract Futuristic Network Grid Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 0px), radial-gradient(rgba(255, 255, 255, 0.01) 1.5px, transparent 0px)',
          backgroundSize: '40px 40px, 20px 20px',
          pointerEvents: 'none',
        }} />

        {/* Dynamic Curved Particle Network Mesh */}
        <div style={{
          position: 'absolute',
          top: '25%', right: '-10%', width: '600px', height: '500px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }} />

        {/* BRAND IDENTITY TOP BAR */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px', zIndex: 10,
          opacity: mounted ? 1 : 0, transition: 'all 0.5s ease'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid #334155', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '800', color: '#06b6d4', fontSize: '14px'
          }}>
            FL
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              FlowLens <span style={{ color: '#06b6d4' }}>AI</span>
            </div>
            <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '1px' }}>Enterprise Operations Platform</div>
          </div>
        </div>

        {/* FLOATING ANALYTICS MINI-CARD CONTAINER */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          
          {/* Revenue Protected Float Card */}
          <div className="floating-pill" style={{
            position: 'absolute', top: '15%', right: '15%', background: '#090d16',
            border: '1px solid #1e293b', borderRadius: '12px', padding: '12px 18px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', animationDelay: '0s'
          }}>
            <span style={{ fontSize: '10px', color: '#6b7280', display: 'block' }}>Revenue Protected</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#06b6d4', display: 'block', marginTop: '2px' }}>₹69,200</span>
            <span style={{ fontSize: '10px', color: '#10b981', display: 'block', marginTop: '2px' }}>▲ 12.5%</span>
          </div>

          {/* Orders Analyzed Float Card */}
          <div className="floating-pill" style={{
            position: 'absolute', top: '42%', right: '8%', background: '#090d16',
            border: '1px solid #1e293b', borderRadius: '12px', padding: '12px 16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', animationDelay: '1s',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ background: 'rgba(6,182,212,0.1)', padding: '6px', borderRadius: '6px' }}>🗂️</div>
            <div>
              <span style={{ fontSize: '10px', color: '#6b7280', display: 'block' }}>Orders Analyzed</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>12,854</span>
              <span style={{ fontSize: '9px', color: '#4b5563', display: 'block' }}>Today</span>
            </div>
          </div>

          {/* SLA Accuracy Float Card */}
          <div className="floating-pill" style={{
            position: 'absolute', bottom: '22%', right: '25%', background: '#090d16',
            border: '1px solid #1e293b', borderRadius: '12px', padding: '12px 16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', animationDelay: '0.5s'
          }}>
            <span style={{ fontSize: '10px', color: '#6b7280', display: 'block' }}>SLA Accuracy</span>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff', display: 'block', marginTop: '2px' }}>94.2%</span>
            <span style={{ fontSize: '9px', color: '#10b981', display: 'block' }}>Excellent</span>
          </div>

        </div>

        {/* HERO TYPOGRAPHY */}
        <div style={{ marginTop: 'auto', marginBottom: 'auto', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.15)',
            borderRadius: '999px', padding: '6px 14px', fontSize: '11px', fontWeight: '600',
            color: '#06b6d4', marginBottom: '28px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4',boxShadow: '0 0 8px #06b6d4' }} />
            AI COO — Live monitoring active
          </div>

          <h1 style={{
            fontSize: '46px', fontWeight: '900', letterSpacing: '-0.04em',
            color: '#fff', lineHeight: 1.15, margin: '0 0 24px 0'
          }}>
            See Problems<br />
            <span style={{
              background: 'linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Before They Cost
            </span>
            <br />You Money.
          </h1>

          <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.6, maxWidth: '420px', margin: 0 }}>
            FlowLens AI monitors your entire restaurant operation in real time — kitchen velocity, inventory health, delivery SLAs, and customer sentiment — then ranks the actions that protect your revenue.
          </p>
        </div>

        {/* FEATURE CAPABILITY GRID LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10, marginTop: 'auto' }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid #1f2937',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={15} style={{ color: '#06b6d4' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f3f4f6' }}>{f.title}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* METADATA SECURITY BOTTOM ROW */}
        <div style={{
          position: 'absolute', bottom: '24px', left: '64px', display: 'flex',
          gap: '16px', fontSize: '11px', color: '#4b5563', borderTop: '1px solid #111827',
          paddingTop: '16px', right: '64px'
        }}>
          <span>🛡️ Bank-grade security</span>
          <span>• SOC 2 Type II</span>
          <span>• End-to-end encryption</span>
        </div>

      </div>

      {/* RIGHT PANEL: DOCK CARD LOGIN INTERFACE CONTAINER */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px'
      }}>
        
        {/* Core Frame Wrapper */}
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* CENTRAL LOGO HEXAGON GLOW MARKER */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '84px', height: '84px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(6,182,212,0.15)', position: 'relative'
            }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '14px',
                background: 'linear-gradient(145deg, #111827, #030712)',
                border: '1px solid #1f2937', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: '900', color: '#fff', fontSize: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
              }}>
                FL
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em', margin: '0 0 6px 0' }}>
              Welcome <span style={{ color: '#06b6d4' }}>back</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Sign in to your FlowLens workspace
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* EMAIL ROW CONTAINER */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <div className="input-glow" style={{
                display: 'flex', alignItems: 'center', background: '#090d16',
                border: '1px solid #1f2937', borderRadius: '8px', padding: '0 14px',
                transition: 'all 0.2s'
              }}>
                <Mail size={14} style={{ color: '#4b5563', marginRight: '10px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    padding: '12px 0', fontSize: '13px', color: '#fff', outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* PASSWORD ROW CONTAINER */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div className="input-glow" style={{
                display: 'flex', alignItems: 'center', background: '#090d16',
                border: '1px solid #1f2937', borderRadius: '8px', padding: '0 14px',
                transition: 'all 0.2s'
              }}>
                <Lock size={14} style={{ color: '#4b5563', marginRight: '10px' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter any password to demo"
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    padding: '12px 0', fontSize: '13px', color: '#fff', outline: 'none'
                  }}
                />
                <EyeOff size={14} style={{ color: '#4b5563', marginLeft: '10px', cursor: 'pointer' }} />
              </div>
            </div>

            {/* ACTION RUNTIME SUBMIT SUB-LAYER */}
            <button
              type="submit"
              disabled={loading}
              className="btn-action"
              style={{
                width: '100%', marginTop: '8px', padding: '14px',
                fontSize: '13px', fontWeight: '700', borderRadius: '8px',
                background: 'linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)',
                border: 'none', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? 'Opening Core Instance...' : 'Access Dashboard'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          {/* DIVERGENT OR DIVIDER ROUTER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#1f2937' }} />
            <span style={{ fontSize: '10px', color: '#4b5563', fontWeight: '700' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#1f2937' }} />
          </div>

          {/* SKIP GATEWAY LAYER */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="btn-action"
            style={{
              width: '100%', background: 'transparent', border: '1px solid #1f2937',
              borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#9ca3af',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Sparkles size={12} style={{ color: '#06b6d4' }} />
            Skip to live demo dashboard
          </button>

          {/* SECURITY STATEMENT STAMP FOOTER */}
          <div style={{
            marginTop: '28px', background: 'rgba(255,255,255,0.01)', border: '1px solid #1f2937',
            padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <ShieldCheck size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
              Demo instance — data is simulated. No real credentials needed.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};