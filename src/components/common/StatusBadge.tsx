import React from 'react';

interface StatusBadgeProps {
  status: 'critical' | 'warning' | 'optimal' | 'info' | 'neutral';
  label?: string;
  dot?: boolean;
  size?: 'sm' | 'md';
}

const CONFIG = {
  critical: { cls: 'badge-red',     dot: 'red',     label: 'Critical'  },
  warning:  { cls: 'badge-amber',   dot: 'amber',   label: 'Warning'   },
  optimal:  { cls: 'badge-emerald', dot: 'emerald', label: 'Optimal'   },
  info:     { cls: 'badge-cyan',    dot: 'cyan',    label: 'Info'      },
  neutral:  { cls: 'badge-neutral', dot: '',        label: 'Neutral'   },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  dot = true,
  size = 'md'
}) => {
  const cfg = CONFIG[status];
  return (
    <span
      className={`badge ${cfg.cls}`}
      style={{ fontSize: size === 'sm' ? '10px' : '11px', padding: size === 'sm' ? '2px 6px' : '3px 8px' }}
    >
      {dot && cfg.dot && (
        <span
          className={`dot-live ${cfg.dot}`}
          style={{ width: '5px', height: '5px' }}
        />
      )}
      {label ?? cfg.label}
    </span>
  );
};
