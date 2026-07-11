import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  POSOrder, 
  InventoryItem, 
  KitchenTicket, 
  DeliveryRider, 
  CustomerReview, 
  OperationalAlert, 
  RestaurantState 
} from '../types/operationalData';
import { calculateMetrics } from '../services/dataMock';
import type { SimulatedMetrics } from '../services/dataMock';
import { 
  INITIAL_INVENTORY, 
  INITIAL_KITCHEN_TICKETS, 
  INITIAL_RIDERS, 
  INITIAL_REVIEWS, 
  INITIAL_ORDERS 
} from '../services/dataMock';
import { runAIEngine } from '../services/aiEngine';

type ViewID = 
  | 'login'
  | 'dashboard'
  | 'decision'
  | 'inventory'
  | 'kitchen'
  | 'delivery'
  | 'menu'
  | 'customer'
  | 'predictive'
  | 'simulator'
  | 'reports'
  | 'settings';

interface RestaurantContextType {
  activeBranch: string;
  setActiveBranch: (branch: string) => void;
  activeView: ViewID;
  setActiveView: (view: ViewID) => void;
  state: RestaurantState;
  updateState: (newState: Partial<RestaurantState>) => void;
  metrics: SimulatedMetrics;
  alerts: OperationalAlert[];
  orders: POSOrder[];
  inventory: InventoryItem[];
  kitchenTickets: KitchenTicket[];
  riders: DeliveryRider[];
  reviews: CustomerReview[];
  selectedAlertId: string | null;
  setSelectedAlertId: (id: string | null) => void;
  applyRecommendation: (alertId: string) => void;
  resetSimulation: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBranch, setActiveBranch] = useState<string>('Downtown Hub (HQ)');
  const [activeView, setActiveView] = useState<ViewID>('dashboard');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Simulation parameters starting at "healthy" or slightly standard states
  const [state, setState] = useState<RestaurantState>({
    branchName: 'Downtown Hub (HQ)',
    chefCount: 3, // starting with 3 (triggers kitchen delay if pizza load is high)
    riderCount: 2, // starting with 2 (triggers delivery delay in North Zone)
    cheeseStockRatio: 0.4, // starting low to trigger cheese stock alert
    avocadoStockRatio: 1.5, // starting high to trigger avocado spoilage warning
    marketingSpendMultiplier: 1.2 // slightly elevated orders
  });

  const [metrics, setMetrics] = useState<SimulatedMetrics>({
    revenueTotal: 174000,
    ordersCount: 216,
    wasteCost: 6500,
    averagePrepTime: 780,
    averageDeliveryTime: 36,
    customerSatisfaction: 4.2,
    kitchenLoadRatio: 65,
    deliveryBottleneckLevel: 'medium',
    activeAlertCount: 2
  });

  const [alerts, setAlerts] = useState<OperationalAlert[]>([]);
  const [orders] = useState<POSOrder[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [kitchenTickets, setKitchenTickets] = useState<KitchenTicket[]>(INITIAL_KITCHEN_TICKETS);
  const [riders, setRiders] = useState<DeliveryRider[]>(INITIAL_RIDERS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

  // Recalculate metrics whenever sliders shift
  useEffect(() => {
    const computedMetrics = calculateMetrics(
      state.chefCount,
      state.riderCount,
      state.cheeseStockRatio,
      state.avocadoStockRatio,
      state.marketingSpendMultiplier
    );
    setMetrics(computedMetrics);

    const generatedAlerts = runAIEngine(
      state.chefCount,
      state.riderCount,
      state.cheeseStockRatio,
      state.avocadoStockRatio,
      computedMetrics.averagePrepTime,
      computedMetrics.averageDeliveryTime
    );
    setAlerts(generatedAlerts);

    // Dynamic adaptation of mock entities for high-fidelity presentation
    // Update inventory stock based on stock multiplier
    const updatedInventory = INITIAL_INVENTORY.map(item => {
      if (item.id === 'i1') { // Cheese
        const stock = Math.round(35 * state.cheeseStockRatio);
        return { ...item, currentStock: stock, wastePercentage: stock > 50 ? 12 : 3 };
      }
      if (item.id === 'i2') { // Avocado
        const stock = Math.round(25 * state.avocadoStockRatio);
        return { ...item, currentStock: stock, wastePercentage: stock > 30 ? 26 : 14 };
      }
      return item;
    });
    setInventory(updatedInventory);

    // Update tickets to show status based on computed prep times
    const updatedTickets = INITIAL_KITCHEN_TICKETS.map(t => {
      let prep = t.prepTimeSeconds;
      let status: 'completed' | 'in_progress' | 'delayed' = t.status;
      if (t.station === 'pizza') {
        prep = Math.round(600 * (4 / Math.max(1, state.chefCount)) * (state.cheeseStockRatio < 0.6 ? 1.4 : 1.0));
        status = prep > 720 ? 'delayed' : 'completed';
      }
      if (t.station === 'prep') {
        prep = Math.round(540 * (state.avocadoStockRatio > 1.4 ? 0.95 : 1.0));
        status = prep > 600 ? 'delayed' : 'completed';
      }
      return { ...t, prepTimeSeconds: prep, status };
    });
    setKitchenTickets(updatedTickets);

    // Update riders to show average transit times
    const updatedRiders = INITIAL_RIDERS.map(r => {
      if (r.zone === 'North Zone') {
        const time = Math.round(28 * ((2.2 * state.marketingSpendMultiplier) / Math.max(1, state.riderCount)));
        return { 
          ...r, 
          averageTimeMinutes: time, 
          status: time > 30 ? 'transit' : 'idle',
          complaintsCount: time > 40 ? 3 : time > 32 ? 1 : 0
        };
      }
      return r;
    });
    setRiders(updatedRiders as DeliveryRider[]);

    // Update review sentiments based on satisfaction score
    const updatedReviews = INITIAL_REVIEWS.map(rev => {
      if (rev.id === 'rev-1') {
        const time = Math.round(28 * ((2.2 * state.marketingSpendMultiplier) / Math.max(1, state.riderCount)));
        return {
          ...rev,
          rating: time > 40 ? 1 : time > 32 ? 2 : 4,
          sentiment: time > 35 ? 'negative' as const : 'positive' as const,
          comment: time > 35 ? `Pizza took ${time} mins to arrive and was cold. North Zone delivery speeds are terrible.` : 'Fast delivery, pizza was warm.'
        };
      }
      if (rev.id === 'rev-4') {
        return {
          ...rev,
          rating: state.avocadoStockRatio > 1.4 ? 2 : 4,
          sentiment: state.avocadoStockRatio > 1.4 ? 'negative' as const : 'positive' as const,
          comment: state.avocadoStockRatio > 1.4 ? 'Avocado salad was sub-par, and portion was tiny. Disappointed with the waste.' : 'Delicious Avocado taco, very fresh.'
        };
      }
      return rev;
    });
    setReviews(updatedReviews);

  }, [state]);

  const updateState = (newState: Partial<RestaurantState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const applyRecommendation = (alertId: string) => {
    if (alertId === 'alert-cheese') {
      // Fix cheese stock & move a chef
      setState(prev => ({
        ...prev,
        cheeseStockRatio: 1.0,
        chefCount: Math.max(4, prev.chefCount)
      }));
    } else if (alertId === 'alert-delivery') {
      // Add a rider
      setState(prev => ({
        ...prev,
        riderCount: prev.riderCount + 1
      }));
    } else if (alertId === 'alert-avocado') {
      // Balance stock level
      setState(prev => ({
        ...prev,
        avocadoStockRatio: 1.0
      }));
    } else if (alertId === 'alert-kitchen') {
      // Move a chef
      setState(prev => ({
        ...prev,
        chefCount: Math.max(4, prev.chefCount)
      }));
    }
    // Set alert resolved in active alerts array
    setAlerts(prev => 
      prev.map(a => a.id === alertId ? { ...a, resolved: true } : a)
    );
  };

  const resetSimulation = () => {
    setState({
      branchName: 'Downtown Hub (HQ)',
      chefCount: 3,
      riderCount: 2,
      cheeseStockRatio: 0.4,
      avocadoStockRatio: 1.5,
      marketingSpendMultiplier: 1.2
    });
  };

  return (
    <RestaurantContext.Provider
      value={{
        activeBranch,
        setActiveBranch,
        activeView,
        setActiveView,
        state,
        updateState,
        metrics,
        alerts,
        orders,
        inventory,
        kitchenTickets,
        riders,
        reviews,
        selectedAlertId,
        setSelectedAlertId,
        applyRecommendation,
        resetSimulation
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
