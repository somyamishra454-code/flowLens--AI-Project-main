import { useState } from 'react';
import { Star, Flame, Leaf } from 'lucide-react';
import { menuItems, type MenuItem, getMenuCategories } from '../../data/menu';

const C = {
  bg: '#08080a',
  panel: '#000000',
  card: 'rgba(255,255,255,0.035)',
  border: 'rgba(255,255,255,0.07)',
  borderSoft: 'rgba(255,255,255,0.045)',
  text1: '#f4f4f5',
  text2: '#a8a8b3',
  text3: '#77777f',
  text4: '#4d4d54',
  violet: '#8b5cf6',
  violetDim: 'rgba(139,92,246,0.14)',
  cyan: '#22d3ee',
  emerald: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
};

interface MenuGridProps {
  columns?: number;
  showFilters?: boolean;
}

export default function MenuGrid({ columns = 4, showFilters = true }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const categories = getMenuCategories();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const MenuCard = ({ item }: { item: MenuItem }) => (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        background: C.card,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const elem = e.currentTarget as HTMLElement;
        elem.style.borderColor = C.cyan;
        elem.style.transform = 'translateY(-4px)';
        elem.style.boxShadow = `0 12px 24px rgba(34, 211, 238, 0.2)`;
      }}
      onMouseLeave={(e) => {
        const elem = e.currentTarget as HTMLElement;
        elem.style.borderColor = C.border;
        elem.style.transform = 'translateY(0)';
        elem.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '100%',
          height: 160,
          background: `linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,211,238,0.1))`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLImageElement).style.transform = 'scale(1)';
          }}
        />
        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '4px 8px',
            borderRadius: 6,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Star size={12} color={C.amber} fill={C.amber} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.text1 }}>{item.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 12 }}>
        {/* Name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text1,
                lineHeight: 1.3,
              }}
            >
              {item.name}
            </div>
            <div style={{ fontSize: 10, color: C.text4, marginTop: 2 }}>{item.category}</div>
          </div>
          {item.vegetarian && (
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                border: `1.5px solid ${C.emerald}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Leaf size={10} color={C.emerald} />
            </div>
          )}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 10,
            color: C.text3,
            marginBottom: 8,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 9,
            color: C.text4,
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: `1px solid ${C.borderSoft}`,
          }}
        >
          <span>⏱ {item.prepTime}min</span>
          <span>📦 {item.orders} orders</span>
          {item.spiceLevel > 0 && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {Array.from({ length: item.spiceLevel }).map((_, i) => (
                <Flame key={i} size={8} color={C.amber} fill={C.amber} />
              ))}
            </span>
          )}
        </div>

        {/* Price and Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: C.emerald }}>₹{item.price}</span>

        </div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      {/* Filters */}
      {showFilters && (
        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text1,
              fontSize: 12,
              outline: 'none',
              transition: 'border 0.2s',
            }}
            onFocus={(e) => {
              (e.target as HTMLElement).style.borderColor = C.cyan;
            }}
            onBlur={(e) => {
              (e.target as HTMLElement).style.borderColor = C.border;
            }}
          />

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: `1px solid ${!selectedCategory ? C.cyan : C.border}`,
                background: !selectedCategory ? 'rgba(34, 211, 238, 0.1)' : C.card,
                color: !selectedCategory ? C.cyan : C.text2,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              All ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((item) => item.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: `1px solid ${selectedCategory === cat ? C.cyan : C.border}`,
                    background: selectedCategory === cat ? 'rgba(34, 211, 238, 0.1)' : C.card,
                    color: selectedCategory === cat ? C.cyan : C.text2,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div style={{ fontSize: 12, color: C.text3 }}>
            Showing <span style={{ fontWeight: 600, color: C.text1 }}>{filteredItems.length}</span> items
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 16,
        }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <MenuCard key={item.id} item={item} />)
        ) : (
          <div
            style={{
              gridColumn: `1 / -1`,
              padding: 40,
              textAlign: 'center',
              color: C.text3,
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 8 }}>No items found</div>
            <div style={{ fontSize: 12 }}>Try a different search or category</div>
          </div>
        )}
      </div>
    </div>
  );
}
