import React, { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Sparkles, X, Send, Zap, AlertTriangle, TrendingUp, Package, Plus } from 'lucide-react';
import ChatbotService from '../../services/chatbotService';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const QUICK_CHIPS = [
  { icon: AlertTriangle, label: 'What are my critical alerts?' },
  { icon: TrendingUp,    label: 'How can I boost revenue today?' },
  { icon: Package,       label: 'Inventory recommendations?' },
  { icon: Zap,           label: 'Biggest risk right now?' },
];

const AI_RESPONSES: Record<string, string> = {
  default: "I've analyzed your current operations across all 4 stations. The most urgent action is resolving the cheese stock depletion — it's creating a cascade effect on pizza prep times and directly impacting delivery SLAs in your North Zone. I'd recommend authorizing an emergency replenishment order immediately.",
  revenue: "Your revenue is currently tracking at ₹1,35,000 today — 7% below target. The fastest lever is re-enabling the Truffle Pizza promotion and running the Avocado Special to clear overstocked inventory. Combined, this could recover ₹24,000 in revenue before the dinner rush.",
  alerts: "You have 3 active alerts: (1) Cheese stock at 34% of safety threshold — critical, (2) North Zone delivery averaging 42 min vs 27 min SLA — critical, (3) Avocado spoilage at 26% waste — warning. All three have actionable fixes in the Decision Center.",
  inventory: "Cheese is your most urgent concern. Avocado stock is overfull — consider a flash promotion. Premium Ground Beef and Brioche Buns are at optimal levels. White Truffle Oil is low but it's a low-volume ingredient, so it's low priority.",
  risk: "Your highest-impact risk right now is the North Zone delivery delay. If it continues for another 2 hours during the dinner peak, you're projected to lose ₹18,000 in refunds and face a 14% drop in North Zone customer retention. I recommend reallocating a West Zone rider immediately.",
};

const getAIResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes('revenue') || lower.includes('boost')) return AI_RESPONSES.revenue;
  if (lower.includes('alert') || lower.includes('critical')) return AI_RESPONSES.alerts;
  if (lower.includes('inventory') || lower.includes('stock')) return AI_RESPONSES.inventory;
  if (lower.includes('risk') || lower.includes('urgent')) return AI_RESPONSES.risk;
  return AI_RESPONSES.default;
};

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ isOpen, onClose }) => {
  const { metrics, alerts, setActiveView } = useRestaurant();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      text: `Good evening. I'm monitoring ${alerts.filter(a => !a.resolved).length} active operational issues across your kitchen, inventory, and delivery systems. I've ranked them by revenue impact. What would you like to tackle first?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef(new ChatbotService());

  const startNewChat = () => {
    chatbotRef.current.clearHistory();
    setMessages([
      {
        id: '0',
        role: 'ai',
        text: `Good evening. I'm monitoring ${alerts.filter(a => !a.resolved).length} active operational issues across your kitchen, inventory, and delivery systems. I've ranked them by revenue impact. What would you like to tackle first?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    setTyping(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    
    try {
      const response = await chatbotRef.current.sendMessage(text.trim());
      
      if (response.error) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: `⚠️ Error: ${response.error}. Please check your Groq API key in .env file.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(m => [...m, errorMsg]);
      } else {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: response.content || getAIResponse(text),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(m => [...m, aiMsg]);
      }
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `⚠️ Connection error. Please make sure your Groq API key is configured in the .env file.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(m => [...m, errorMsg]);
    }
    
    setTyping(false);
  };

  return (
    <div className={`assistant-panel ${isOpen ? '' : 'closed'}`}>
      {/* Header */}
      <div style={{
        padding: '16px 18px',
        borderBottom: '1px solid var(--border-0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'var(--cyan-dim)',
            border: '1px solid rgba(6,182,212,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={15} style={{ color: 'var(--cyan)' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '650', color: 'var(--text-1)' }}>AI COO Assistant</div>
            <div style={{ fontSize: '10px', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="dot-live emerald" style={{ width: '5px', height: '5px' }} />
              Live operational context loaded
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={startNewChat}
            className="btn btn-ghost btn-sm"
            style={{ 
              padding: '6px 10px', 
              color: 'var(--text-3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
            }}
            title="Start new chat"
          >
            <Plus size={14} />
            New
          </button>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', color: 'var(--text-3)' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Live stats bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        borderBottom: '1px solid var(--border-0)',
        flexShrink: 0,
      }}>
        {[
          { label: 'Revenue', val: `₹${(metrics.revenueTotal / 1000).toFixed(0)}K`, color: 'var(--cyan)' },
          { label: 'Alerts', val: `${alerts.filter(a => !a.resolved && a.severity !== 'info').length}`, color: 'var(--red)' },
          { label: 'Orders', val: `${metrics.ordersCount}`, color: 'var(--emerald)' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '10px 12px',
            borderRight: '1px solid var(--border-0)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: s.color, letterSpacing: '-0.03em' }}>{s.val}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '1px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Messages */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '10px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation: 'fadeSlideUp 0.3s var(--ease-spring) both',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: msg.role === 'ai' ? '8px' : '50%',
              background: msg.role === 'ai' ? 'var(--cyan-dim)' : 'var(--bg-4)',
              border: `1px solid ${msg.role === 'ai' ? 'rgba(6,182,212,0.2)' : 'var(--border-1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {msg.role === 'ai'
                ? <Sparkles size={12} style={{ color: 'var(--cyan)' }} />
                : <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-2)' }}>OP</span>
              }
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '78%',
              background: msg.role === 'ai' ? 'rgba(255,255,255,0.03)' : 'rgba(6,182,212,0.10)',
              border: `1px solid ${msg.role === 'ai' ? 'var(--border-0)' : 'rgba(6,182,212,0.18)'}`,
              borderRadius: msg.role === 'ai' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
              padding: '10px 13px',
            }}>
              {msg.role === 'ai' ? (
                <>
                  {(() => {
                    const imgRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp|svg))/gi;
                    const imgs = Array.from(msg.text.matchAll(imgRegex)).map(m => m[0]);
                    if (imgs.length) {
                      return (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {imgs.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt={`ai-img-${i}`}
                              style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-0)' }}
                            />
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div style={{ fontSize: '12px', color: 'var(--text-1)', whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>{msg.text}</div>
                    );
                  })()}
                  {msg.text.includes('Decision Center') && (
                    <div style={{ marginTop: 8 }}>
                      <button
                        onClick={() => { setActiveView('decision'); onClose(); }}
                        className="btn btn-cyan btn-xs"
                        style={{ padding: '6px 8px', fontSize: 11 }}
                      >
                        → Decision Center
                      </button>
                    </div>
                  )}
                </>
              ) : (
                (() => {
                  const content = msg.text || '';
                  const imgRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp|svg))/gi;
                  const imgs = Array.from(content.matchAll(imgRegex)).map(m => m[0]);
                  if (imgs.length) {
                    return (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {imgs.map((src, i) => (
                          <img key={i} src={src} alt={`you-img-${i}`} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-1)' }} />
                        ))}
                      </div>
                    );
                  }

                  const clean = content.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
                  const short = clean.substring(0, 80) + (clean.length > 80 ? '...' : '');

                  return (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{ width: 54, height: 36, borderRadius: 8, background: 'var(--bg-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-2)', flexShrink: 0 }}>
                        You
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-1)', lineHeight: 1.4, textAlign: 'right' }}>{short}</div>
                    </div>
                  );
                })()
              )}
              <span style={{ fontSize: '10px', color: 'var(--text-4)', marginTop: '5px', display: 'block' }}>{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: 'flex', gap: '10px', animation: 'fadeIn 0.2s ease' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'var(--cyan-dim)', border: '1px solid rgba(6,182,212,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={12} style={{ color: 'var(--cyan)' }} />
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-0)',
              borderRadius: '4px 12px 12px 12px',
              padding: '12px 16px',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick chips */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--border-0)',
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        {QUICK_CHIPS.map(c => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              className="chip"
              onClick={() => send(c.label)}
              style={{ fontSize: '11px' }}
            >
              <Icon size={10} />
              {c.label.length > 22 ? c.label.slice(0, 22) + '…' : c.label}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border-0)',
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder="Ask about operations, risks, revenue..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-1)',
            borderRadius: '8px',
            padding: '9px 12px',
            fontSize: '12px',
            color: 'var(--text-1)',
            outline: 'none',
            transition: 'border-color var(--t-fast)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--border-2)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-1)'; }}
        />
        <button
          onClick={() => send(input)}
          className="btn btn-cyan btn-sm"
          style={{ padding: '8px 12px', flexShrink: 0 }}
          disabled={!input.trim() || typing}
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};
