import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  style, 
  interactive = false 
}) => {
  const baseClass = interactive ? 'glass-panel-interactive' : 'glass-panel';
  
  return (
    <div 
      className={`${baseClass} ${className}`}
      onClick={onClick}
      style={{
        padding: '20px',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </div>
  );
};
