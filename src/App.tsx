import { useState, useEffect } from 'react';
import { useRestaurant } from './context/RestaurantContext';
import { DataProvider } from './context/DataContext';

import { Login } from './pages/Login';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { DecisionIntelligence } from './pages/DecisionIntelligence';
import { InventoryIntelligence } from './pages/InventoryIntelligence';
import { KitchenIntelligence } from './pages/KitchenIntelligence';
import { DeliveryIntelligence } from './pages/DeliveryIntelligence';
import { MenuIntelligence } from './pages/MenuIntelligence';
import { CustomerIntelligence } from './pages/CustomerIntelligence';
import { PredictiveAnalytics } from './pages/PredictiveAnalytics';
import { BusinessSimulator } from './pages/BusinessSimulator';
import { ExecutiveReports } from './pages/ExecutiveReports';
import { Settings } from './pages/Settings';

import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { AIAssistantPanel } from './components/common/AIAssistantPanel';

function AppContent() {
  const { activeView, setActiveView } = useRestaurant();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [animatingView, setAnimatingView] = useState(activeView);
  const [transitioning, setTransitioning] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
      // [ → toggle sidebar
      if (e.key === '[' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setSidebarCollapsed(prev => !prev);
      }
      // Escape → close overlays
      if (e.key === 'Escape') {
        if (assistantOpen) setAssistantOpen(false);
      }
      // Number shortcuts → navigate (when no input focused)
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        const navMap: Record<string, string> = {
          '1': 'dashboard', '2': 'decision', '3': 'inventory',
          '4': 'kitchen', '5': 'delivery', '6': 'menu',
          '7': 'customer', '8': 'predictive', '9': 'simulator', '0': 'reports',
        };
        if (navMap[e.key]) setActiveView(navMap[e.key] as any);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [assistantOpen, setActiveView]);

  // Page transition
  useEffect(() => {
    if (activeView !== animatingView) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setAnimatingView(activeView);
        setTransitioning(false);
      }, 110);
      return () => clearTimeout(t);
    }
  }, [activeView, animatingView]);

  if (activeView === 'login') return <Login />;

  const renderView = () => {
    switch (animatingView) {
      case 'dashboard':  return <ExecutiveDashboard />;
      case 'decision':   return <DecisionIntelligence />;
      case 'inventory':  return <InventoryIntelligence />;
      case 'kitchen':    return <KitchenIntelligence />;
      case 'delivery':   return <DeliveryIntelligence />;
      case 'menu':       return <MenuIntelligence />;
      case 'customer':   return <CustomerIntelligence />;
      case 'predictive': return <PredictiveAnalytics />;
      case 'simulator':  return <BusinessSimulator />;
      case 'reports':    return <ExecutiveReports />;
      case 'settings':   return <Settings />;
      default:           return <ExecutiveDashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'var(--bg-0)', overflow: 'hidden' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
        <Header
          onSearchClick={() => setPaletteOpen(true)}
          onAssistantToggle={() => setAssistantOpen(p => !p)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page viewport */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          background: 'var(--bg-1)',
          position: 'relative',
        }}>
          <div style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(6px) scale(0.998)' : 'translateY(0) scale(1)',
            transition: 'opacity 0.12s ease-out, transform 0.12s ease-out',
          }}>
            {renderView()}
          </div>
        </div>
      </div>

      {/* Slide panels */}
      <AIAssistantPanel isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
