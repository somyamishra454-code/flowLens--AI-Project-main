import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { GlassCard } from '../components/common/GlassCard';
import { Star, StarHalf, ThumbsUp, ThumbsDown, MessageSquare, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const CustomerIntelligence: React.FC = () => {
  const { reviews } = useRestaurant();

  // Always reflects the real system date — never hardcoded.
  const todayLabel = `Today, ${new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())}`;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'var(--color-emerald)';
      case 'neutral': return 'var(--text-secondary)';
      case 'negative': return 'var(--color-red)';
      default: return '#FFFFFF';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      padding: '20px', 
      backgroundColor: '#0A0B0D', 
      color: '#FFFFFF',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      
      {/* CSS Animation Effects */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes growWidth {
          from { width: 0; }
        }
        @keyframes drawRing {
          from { stroke-dasharray: 0 100; }
        }
        @keyframes pulseIcon {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out both;
        }
        .list-item-appear {
          opacity: 0;
          transform: translateY(12px);
          animation: fadeInUp 0.45s ease-out both;
        }
        .metric-card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .metric-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        /* Sparkline Animation */
        .sparkline-trigger {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawLine 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Progress Bar Animation */
        .bar-grow-trigger {
          animation: growWidth 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        /* Donut Ring Animation */
        .ring-draw-trigger {
          animation: drawRing 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        /* Core KPI Icon Pulse */
        .icon-pulse {
          animation: pulseIcon 2s ease-in-out infinite;
        }
      `}</style>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        
        {/* Rating Card with 4.5 Stars */}
        <GlassCard className="animate-fade-in metric-card-hover" style={{ animationDelay: '0.05s', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <Star size={32} className="icon-pulse" style={{ color: 'var(--color-orange)', fill: 'var(--color-orange)', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>SATISFACTION RATING</span>
              <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>4.5 / 5.0</div>
              <div style={{ display: 'flex', gap: '2px', margin: '4px 0', alignItems: 'center' }}>
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} size={14} style={{ color: 'var(--color-orange)', fill: 'var(--color-orange)' }} />
                ))}
                <StarHalf size={14} style={{ color: 'var(--color-orange)', fill: 'var(--color-orange)' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Based on 2,845 reviews</span>
            </div>
          </div>
        </GlassCard>

        {/* Positive Sentiment Card */}
        <GlassCard className="animate-fade-in metric-card-hover" style={{ animationDelay: '0.1s', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <ThumbsUp size={32} className="icon-pulse" style={{ color: 'var(--color-emerald)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>POSITIVE SENTIMENT</span>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>64%</div>
                <div style={{ fontSize: '11px', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight size={12} /> ↑ 8% vs last 7 days
                </div>
              </div>
            </div>
            <svg width="70" height="30" style={{ opacity: 0.7 }}>
              <path className="sparkline-trigger" d="M0,25 Q15,10 30,20 T70,5" fill="none" stroke="var(--color-emerald)" strokeWidth="1.5" />
            </svg>
          </div>
        </GlassCard>

        {/* Complaint Ratio Card */}
        <GlassCard className="animate-fade-in metric-card-hover" style={{ animationDelay: '0.15s', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <ThumbsDown size={32} className="icon-pulse" style={{ color: 'var(--color-red)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>COMPLAINT RATIO</span>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>18.4%</div>
                <div style={{ fontSize: '11px', color: 'var(--color-red)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowDownRight size={12} /> ↓ 3% vs last 7 days
                </div>
              </div>
            </div>
            <svg width="70" height="30" style={{ opacity: 0.7 }}>
              <path className="sparkline-trigger" style={{ animationDelay: '0.2s' }} d="M0,5 Q20,25 40,10 T70,22" fill="none" stroke="var(--color-red)" strokeWidth="1.5" />
            </svg>
          </div>
        </GlassCard>

      </div>

      {/* Grid Layout Split Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '16px', alignItems: 'start' }}>
        
        {/* Real-Time Guest Feedback Streams */}
        <GlassCard className="animate-fade-in" style={{ animationDelay: '0.2s', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} style={{ color: 'var(--color-cyan)' }} />
              <span>Real-Time Guest Feedback Logs</span>
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: '#14161A', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <Calendar size={12} /> {todayLabel} <span style={{ color: 'var(--color-cyan)' }}></span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(reviews.length > 0 ? reviews : [
              { id: '1', customerName: 'Kabir Mehta', sentiment: 'positive', rating: 5, comment: 'Fast delivery, pizza was warm.', deliveryZone: 'North Zone' },
              { id: '2', customerName: 'Ananya Roy', sentiment: 'positive', rating: 5, comment: 'Amazing truffle mushroom pizza, but cheese could be spread more evenly.', deliveryZone: 'East Zone' },
              { id: '3', customerName: 'Siddharth Sen', sentiment: 'neutral', rating: 3, comment: 'Burger was great, but delivery was delayed.', deliveryZone: 'North Zone' },
              { id: '4', customerName: 'Riya Gupta', sentiment: 'negative', rating: 2, comment: 'Avocado salad was sub-par, and portion was tiny. Disappointed with the waste.', deliveryZone: 'West Zone' }
            ]).map((review, idx) => (
              <div key={review.id} className="list-item-appear" style={{ display: 'flex', gap: '12px', paddingBottom: '16px', borderBottom: idx !== 3 ? '1px solid rgba(255,255,255,0.04)' : 'none', animationDelay: `${(idx * 0.08) + 0.2}s` }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: getSentimentColor(review.sentiment), flexShrink: 0 }}>
                  {getInitials(review.customerName)}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>{review.customerName}</span>
                      <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: getSentimentColor(review.sentiment) }}>
                        {review.sentiment}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star 
                          key={s} 
                          size={10} 
                          strokeWidth={2}
                          style={{ 
                            color: 'var(--color-orange)', 
                            fill: s <= review.rating ? 'var(--color-orange)' : 'none' 
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 4px 0', lineHeight: '1.4' }}>
                    "{review.comment}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>Fulfillment: {review.deliveryZone} Delivery</span>
                    <span>{idx === 0 ? '10 min ago' : idx === 1 ? '25 min ago' : idx === 2 ? '45 min ago' : '1 hr ago'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            
            </span>
          </div>
        </GlassCard>

        {/* Right Columns: Sentiment Breakdown Distributions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <GlassCard className="animate-fade-in" style={{ animationDelay: '0.25s', padding: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 16px 0' }}>Sentiment Breakdowns</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Positive Reviews:</span>
                  <span style={{ color: 'var(--color-emerald)', fontWeight: '600' }}>64%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div className="bar-grow-trigger" style={{ width: '64%', height: '100%', background: 'var(--color-emerald)' }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>1,819 reviews</span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Neutral Feedback:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: '600' }}>18%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div className="bar-grow-trigger" style={{ width: '18%', height: '100%', background: 'rgba(255,255,255,0.3)', animationDelay: '0.1s' }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>512 reviews</span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Negative Complaints:</span>
                  <span style={{ color: 'var(--color-red)', fontWeight: '600' }}>18%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div className="bar-grow-trigger" style={{ width: '18%', height: '100%', background: 'var(--color-red)', animationDelay: '0.2s' }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>514 reviews</span>
              </div>
            </div>

            {/* Circular Ring Graphic Container */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="90" height="90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-emerald)" strokeWidth="3.2" strokeDasharray="64 100" strokeDashoffset="25" style={{ animationDelay: '0.3s' }} />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3.2" strokeDasharray="18 100" strokeDashoffset="-39" style={{ animationDelay: '0.4s' }} />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-red)" strokeWidth="3.2" strokeDasharray="18 100" strokeDashoffset="-57" style={{ animationDelay: '0.5s' }} />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800' }}>2,845</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Total Reviews</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Positive: 1,819 (64%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Neutral: 512 (18%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-red)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Negative: 514 (18%)</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Top Feedback Topics Panel */}
          <GlassCard className="animate-fade-in" style={{ animationDelay: '0.3s', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>Top Feedback Topics</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="90" height="90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="3.5" />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-cyan)" strokeWidth="3.5" strokeDasharray="35 100" strokeDashoffset="25" style={{ animationDelay: '0.4s' }} />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.5" strokeDasharray="28 100" strokeDashoffset="-10" style={{ animationDelay: '0.5s' }} />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-38" style={{ animationDelay: '0.6s' }} />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3.5" strokeDasharray="12 100" strokeDashoffset="-53" style={{ animationDelay: '0.7s' }} />
                  <circle className="ring-draw-trigger" cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="3.5" strokeDasharray="10 100" strokeDashoffset="-65" style={{ animationDelay: '0.8s' }} />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800' }}>2,845</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Mentions</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', width: '130px' }}>
                {[
                  { label: 'Food Quality', pct: '35%', color: 'var(--color-cyan)' },
                  { label: 'Delivery Time', pct: '28%', color: '#a855f7' },
                  { label: 'Packaging', pct: '15%', color: '#eab308' },
                  { label: 'Portion Size', pct: '12%', color: '#06b6d4' },
                  { label: 'Other', pct: '10%', color: '#64748b' }
                ].map((topic, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: topic.color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{topic.label}</span>
                    </div>
                    <span style={{ fontWeight: '600' }}>{topic.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};