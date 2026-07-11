import React from 'react';
import MenuGrid from '../components/common/MenuGrid';

const C = {
  bg: '#08080a',
  panel: '#000000',
  text1: '#f4f4f5',
  text2: '#a8a8b3',
  text3: '#77777f',
  border: 'rgba(255,255,255,0.07)',
};

export const MenuIntelligence: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      maxHeight: '100vh',
      overflowY: 'auto',
      color: C.text1,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: 13,
    }}>
      <div style={{
        flex: 1,
        minWidth: 0,
        padding: '24px 28px',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>
            🍽️ Menu Management
          </div>
          <div style={{ fontSize: 13, color: C.text3 }}>
            Browse all 50 items with prices, ratings, and preparation details
          </div>
        </div>

        {/* Menu Grid */}
        <MenuGrid columns={4} showFilters={true} />
      </div>
    </div>
  );
};
