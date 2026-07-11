import { useState, useRef, useEffect } from 'react';
import { Send, Loader, AlertCircle } from 'lucide-react';
import ChatbotService from '../../services/chatbotService';

const C = {
  bg: '#08080a',
  panel: '#000000',
  card: 'rgba(255,255,255,0.035)',
  border: 'rgba(255,255,255,0.07)',
  text1: '#f4f4f5',
  text2: '#a8a8b3',
  text3: '#77777f',
  text4: '#4d4d54',
  violet: '#8b5cf6',
  violetDim: 'rgba(139,92,246,0.14)',
  cyan: '#22d3ee',
  emerald: '#22c55e',
  red: '#ef4444',
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  loading?: boolean;
  error?: string;
}

interface ChatBotProps {
  apiKey?: string;
}

export default function ChatBot({ apiKey }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotService = useRef<ChatbotService | null>(null);

  // Initialize chatbot service
  useEffect(() => {
    if (apiKey) {
      chatbotService.current = new ChatbotService(apiKey);
    } else {
      chatbotService.current = new ChatbotService();
    }
  }, [apiKey]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !chatbotService.current) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);

    // Add user message to UI
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Show loading state
    const loadingMsg: ChatMessage = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true,
    };

    setMessages((prev) => [...prev, loadingMsg]);
    setLoading(true);

    try {
      const response = await chatbotService.current.sendMessage(userMessage);

      if (response.error) {
        setError(response.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMsg.id
              ? {
                  ...msg,
                  loading: false,
                  error: response.error,
                  content: 'Sorry, I encountered an error. Please try again.',
                }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMsg.id
              ? {
                  ...msg,
                  loading: false,
                  content: response.content,
                }
              : msg
          )
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== loadingMsg.id)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (chatbotService.current) {
      chatbotService.current.clearHistory();
    }
    setMessages([]);
    setError(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: C.card,
        border: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${C.violetDim}, transparent)`,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, color: C.violet, textTransform: 'uppercase' }}>
          AI Assistant (Quick chat)
        </span>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            title="Clear"
            style={{
              background: 'transparent',
              border: 'none',
              color: C.text3,
              cursor: 'pointer',
              fontSize: 10,
              padding: '2px 4px',
              borderRadius: 4,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = C.text1;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = C.text3;
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {messages.length === 0 && !error && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: C.text3,
              textAlign: 'center',
              padding: 16,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>👋</div>
            <div style={{ fontSize: 11, lineHeight: 1.4 }}>
              Hey! I'm your FlowLens AI assistant. Ask me anything about your restaurant's
              performance, sales trends, or business insights.
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '10px',
              background: `${C.red}15`,
              border: `1px solid ${C.red}40`,
              borderRadius: 8,
              fontSize: 11,
              color: C.red,
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: 8,
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '8px 11px',
                borderRadius: 10,
                background:
                  msg.role === 'user'
                    ? `linear-gradient(135deg, ${C.violet}80, ${C.violet}40)`
                    : C.card,
                border:
                  msg.role === 'user'
                    ? `1px solid ${C.violet}60`
                    : `1px solid ${C.border}`,
                color: C.text1,
                fontSize: 11,
                lineHeight: 1.5,
                wordBreak: 'break-word',
                position: 'relative',
              }}
            >
              {msg.loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.text3 }}>
                  <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Thinking...</span>
                </div>
              ) : msg.error ? (
                <span style={{ color: C.red }}>Error: {msg.error}</span>
              ) : (
                (() => {
                  const content = msg.content || '';
                  // If this is a user message, render as compact "You" badge + short text or images
                  if (msg.role === 'user') {
                    const imgRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp|svg))/gi;
                    const imgs = Array.from(content.matchAll(imgRegex)).map(m => m[0]);
                    if (imgs.length) {
                      return (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {imgs.map((src, i) => (
                            <img key={i} src={src} alt={`you-${i}`} style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} />
                          ))}
                        </div>
                      );
                    }

                    const clean = content.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
                    const short = clean.substring(0, 80) + (clean.length > 80 ? '...' : '');

                    return (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ width: 46, height: 36, borderRadius: 8, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.text3, flexShrink: 0 }}>
                          You
                        </div>
                        <div style={{ fontSize: 12, color: C.text1, textAlign: 'right' }}>{short}</div>
                      </div>
                    );
                  }

                  // assistant rendering (kept as images/short snippet)
                  const imgRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp|svg))/gi;
                  const imgs = Array.from(content.matchAll(imgRegex)).map(m => m[0]);
                  if (imgs.length) {
                    return (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {imgs.map((src, i) => (
                          <img key={i} src={src} alt={`ai-${i}`} style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} />
                        ))}
                      </div>
                    );
                  }

                  const clean = content.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
                  const short = clean.substring(0, 80) + (clean.length > 80 ? '...' : '');

                  return (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 46, height: 36, borderRadius: 8, background: C.violetDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.violet, flexShrink: 0 }}>
                        AI
                      </div>
                      <div style={{ fontSize: 12, color: C.text1 }}>{short}</div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '10px',
          borderTop: `1px solid ${C.border}`,
          background: C.panel,
        }}
      >
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            disabled={loading}
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 10px',
              fontSize: 11,
              color: C.text1,
              outline: 'none',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'text',
            }}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: 'none',
              background:
                loading || !inputValue.trim()
                  ? `${C.violet}40`
                  : `linear-gradient(135deg, ${C.violet}, #6d28d9)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            title="Send message"
          >
            <Send size={13} color="#fff" />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
