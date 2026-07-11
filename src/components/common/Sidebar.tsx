import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  LayoutDashboard,
  AlertTriangle,
  Package,
  Flame,
  Truck,
  TrendingUp,
  Users,
  LineChart,
  Sliders,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard',  label: 'Dashboard',          icon: LayoutDashboard, shortcut: '1' },
      { id: 'decision',   label: 'Decision Center',     icon: AlertTriangle,   shortcut: '2', badge: true },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'inventory',  label: 'Inventory',           icon: Package,         shortcut: '3' },
      { id: 'kitchen',    label: 'Kitchen Velocity',    icon: Flame,           shortcut: '4' },
      { id: 'delivery',   label: 'Delivery',            icon: Truck,           shortcut: '5' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'menu',       label: 'Menu Analytics',      icon: TrendingUp,      shortcut: '6' },
      { id: 'customer',   label: 'Customer Sentiment',  icon: Users,           shortcut: '7' },
      { id: 'predictive', label: 'Predictive Risks',    icon: LineChart,       shortcut: '8' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'simulator',  label: 'Simulator',           icon: Sliders,         shortcut: '9' },
      { id: 'reports',    label: 'Reports',             icon: FileText,        shortcut: '0' },
      { id: 'settings',   label: 'Settings',            icon: SettingsIcon,    shortcut: '' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { activeView, setActiveView, alerts, state } = useRestaurant();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const unresolvedAlerts = alerts.filter(a => !a.resolved && a.severity !== 'info').length;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{ position: 'relative' }}>
      {/* Brand */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: '1px solid var(--border-0)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: '64px',
        transition: 'padding var(--t-slow)',
      }}>
        {/* Logo mark */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '7px',
          background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.4) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '900',
          color: '#000',
          fontSize: '11px',
          letterSpacing: '-0.03em',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          FL
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}>
              FlowLens AI
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '1px', whiteSpace: 'nowrap' }}>
              AI Chief Operating Officer
            </div>
          </div>
        )}
      </div>

      {/* Branch info */}
      {!collapsed && (
        <div style={{
          margin: '12px 12px 4px',
          padding: '9px 11px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-0)',
          fontSize: '11px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
            <span style={{ color: 'var(--text-3)' }}>Active branch</span>
            <span style={{ color: '#fff', fontWeight: '600', fontSize: '10px' }}>{state.branchName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-3)' }}>AI status</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald)', fontWeight: '600', fontSize: '10px' }}>
              <span className="dot-live emerald" style={{ width: '5px', height: '5px' }} />
              Live
            </span>
          </div>
        </div>
      )}

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '4px' }}>
            {/* Group label */}
            {!collapsed && (
              <div style={{
                fontSize: '9px',
                fontWeight: '700',
                color: 'var(--text-4)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '10px 8px 5px',
              }}>
                {group.label}
              </div>
            )}
            {collapsed && gi > 0 && (
              <div style={{ height: '1px', background: 'var(--border-0)', margin: '6px 4px' }} />
            )}

            {group.items.map(item => {
              const isActive = activeView === item.id;
              const Icon = item.icon;
              const showBadge = item.badge && unresolvedAlerts > 0;

              return (
                <button
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id as any)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    border: 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '10px' : '9px 10px',
                    position: 'relative',
                  }}
                >
                  <span style={{
                    color: isActive ? 'var(--cyan)' : (hoveredItem === item.id ? 'var(--text-1)' : 'var(--text-3)'),
                    transition: 'color var(--t-fast)',
                    flexShrink: 0,
                  }}>
                    <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>

                  {!collapsed && (
                    <span className="sidebar-label" style={{ flex: 1, fontSize: '13px' }}>
                      {item.label}
                    </span>
                  )}

                  {/* Badge */}
                  {showBadge && (
                    <span style={{
                      background: 'var(--red)',
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '1px 5px',
                      fontSize: '9px',
                      fontWeight: '700',
                      lineHeight: '14px',
                      minWidth: '16px',
                      textAlign: 'center',
                      flexShrink: 0,
                      position: collapsed ? 'absolute' : 'static',
                      top: collapsed ? '4px' : undefined,
                      right: collapsed ? '4px' : undefined,
                    }}>
                      {unresolvedAlerts}
                    </span>
                  )}

                  {/* Keyboard hint - only on hover when not collapsed */}
                  {!collapsed && item.shortcut && hoveredItem === item.id && (
                    <kbd style={{ opacity: 0.5 }}>{item.shortcut}</kbd>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{
        borderTop: '1px solid var(--border-0)',
        padding: collapsed ? '12px 8px' : '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--bg-4)',
                border: '1px solid var(--border-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700',
                color: 'var(--text-2)',
                flexShrink: 0,
              }}>
                OP
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Operator 01</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Admin</div>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveView('login')}
              style={{ padding: '6px', flexShrink: 0 }}
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          </>
        ) : (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setActiveView('login')}
            style={{ padding: '6px' }}
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: '68px',
          right: '-12px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'var(--bg-3)',
          border: '1px solid var(--border-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          color: 'var(--text-3)',
          transition: 'all var(--t-fast)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text-1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-3)'; }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </div>
  );
};
