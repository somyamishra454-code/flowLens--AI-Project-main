import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Search, LayoutDashboard, AlertTriangle, Package, Flame, Truck, TrendingUp, Users, LineChart, Sliders, FileText, Settings, Zap, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_COMMANDS = [
  { id: 'dashboard',  label: 'Executive Overview',       group: 'Navigate',    icon: LayoutDashboard, shortcut: '1' },
  { id: 'decision',   label: 'Decision Center',          group: 'Navigate',    icon: AlertTriangle },
  { id: 'inventory',  label: 'Inventory Intelligence',   group: 'Navigate',    icon: Package },
  { id: 'kitchen',    label: 'Kitchen Velocity',         group: 'Navigate',    icon: Flame },
  { id: 'delivery',   label: 'Delivery Analytics',      group: 'Navigate',    icon: Truck },
  { id: 'menu',       label: 'Menu Analytics',          group: 'Navigate',    icon: TrendingUp },
  { id: 'customer',   label: 'Customer Sentiment',      group: 'Navigate',    icon: Users },
  { id: 'predictive', label: 'Predictive Risks',        group: 'Navigate',    icon: LineChart },
  { id: 'simulator',  label: 'Business Simulator',      group: 'Navigate',    icon: Sliders },
  { id: 'reports',    label: 'Executive Reports',       group: 'Navigate',    icon: FileText },
  { id: 'settings',   label: 'System Settings',         group: 'Navigate',    icon: Settings },
  { id: 'action-ai',  label: 'Open AI COO Chat',        group: 'Actions',     icon: Zap, action: 'openAI' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { setActiveView } = useRestaurant();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = ALL_COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.group.toLowerCase().includes(query.toLowerCase())
  );

  const groups = [...new Set(filtered.map(c => c.group))];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); execute(filtered[selectedIdx]); }
      if (e.key === 'Escape') { onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selectedIdx]);

  const execute = (cmd: typeof ALL_COMMANDS[0] | undefined) => {
    if (!cmd) return;
    if (cmd.action === 'openAI') { /* handled upstream */ }
    else setActiveView(cmd.id as any);
    onClose();
  };

  if (!isOpen) return null;

  let flatIdx = 0;

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette-modal" onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-0)',
        }}>
          <Search size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, actions, insights..."
            style={{
              flex: 1,
              fontSize: '14px',
              color: 'var(--text-1)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              letterSpacing: '-0.01em',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-3)', cursor: 'pointer' }}>
              <X size={13} />
            </button>
          )}
          <kbd>esc</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '32px' }}>
              <Search size={20} style={{ opacity: 0.3 }} />
              <span style={{ fontSize: '13px' }}>No results for "{query}"</span>
            </div>
          )}

          {groups.map(group => {
            const items = filtered.filter(c => c.group === group);
            return (
              <div key={group} style={{ marginBottom: '4px' }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: 'var(--text-4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '6px 10px 4px',
                }}>
                  {group}
                </div>
                {items.map(cmd => {
                  const isSelected = flatIdx === selectedIdx;
                  const Icon = cmd.icon;
                  const itemIdx = flatIdx++;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => execute(cmd)}
                      onMouseEnter={() => setSelectedIdx(itemIdx)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 10px',
                        borderRadius: '7px',
                        background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background var(--t-fast)',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isSelected ? 'rgba(6,182,212,0.2)' : 'var(--border-0)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all var(--t-fast)',
                      }}>
                        <Icon size={13} style={{ color: isSelected ? 'var(--cyan)' : 'var(--text-3)' }} />
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: isSelected ? '550' : '400',
                        color: isSelected ? 'var(--text-1)' : 'var(--text-2)',
                        flex: 1,
                        transition: 'color var(--t-fast)',
                      }}>
                        {cmd.label}
                      </span>
                      {isSelected && (
                        <span style={{ color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}>
                          <kbd>↵</kbd>
                        </span>
                      )}
                      {cmd.shortcut && !isSelected && (
                        <kbd>{cmd.shortcut}</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border-0)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}>
          {[['↑↓', 'Navigate'], ['↵', 'Select'], ['esc', 'Close']].map(([key, label]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-4)' }}>
              <kbd>{key}</kbd> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
