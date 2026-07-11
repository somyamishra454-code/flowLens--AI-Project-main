import type { POSOrder, InventoryItem, KitchenTicket, DeliveryRider, CustomerReview } from '../types/operationalData';

// Static lists to generate data
export const MENU_ITEMS = [
  { id: 'm1', name: 'Truffle Mushroom Pizza', price: 950, cost: 220, category: 'Pizza' },
  { id: 'm2', name: 'Signature Cheeseburger', price: 650, cost: 180, category: 'Grill' },
  { id: 'm3', name: 'Crispy Avocado Taco', price: 480, cost: 140, category: 'Prep' },
  { id: 'm4', name: 'Peri Peri Chicken Wings', price: 520, cost: 120, category: 'Fry' },
  { id: 'm5', name: 'Smoked Salmon Salad', price: 780, cost: 260, category: 'Prep' },
  { id: 'm6', name: 'Burrata Caprese', price: 720, cost: 240, category: 'Prep' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Mozzarella & Parmesan Cheese', currentStock: 12, safetyStock: 35, unitCost: 450, wastePercentage: 4, lastRestocked: '2026-07-04', supplierName: 'Dairy Gold Farms' },
  { id: 'i2', name: 'Fresh Hass Avocados', currentStock: 8, safetyStock: 25, unitCost: 350, wastePercentage: 18, lastRestocked: '2026-07-03', supplierName: 'Organic Greens Inc.' },
  { id: 'i3', name: 'Premium Ground Beef Patty', currentStock: 48, safetyStock: 40, unitCost: 280, wastePercentage: 2, lastRestocked: '2026-07-05', supplierName: 'Heritage Meats' },
  { id: 'i4', name: 'Brioche Buns', currentStock: 120, safetyStock: 80, unitCost: 25, wastePercentage: 5, lastRestocked: '2026-07-05', supplierName: 'Artisan Bakers' },
  { id: 'i5', name: 'White Truffle Oil', currentStock: 5, safetyStock: 3, unitCost: 1800, wastePercentage: 1, lastRestocked: '2026-06-28', supplierName: 'Fine Foods Dist.' }
];

export const INITIAL_KITCHEN_TICKETS: KitchenTicket[] = [
  { id: 'k1', orderId: 'ord-101', station: 'pizza', prepTimeSeconds: 1080, assignedChefId: 'c1', status: 'delayed', foodItemName: 'Truffle Mushroom Pizza' },
  { id: 'k2', orderId: 'ord-102', station: 'grill', prepTimeSeconds: 420, assignedChefId: 'c2', status: 'completed', foodItemName: 'Signature Cheeseburger' },
  { id: 'k3', orderId: 'ord-103', station: 'prep', prepTimeSeconds: 780, assignedChefId: 'c3', status: 'delayed', foodItemName: 'Crispy Avocado Taco' },
  { id: 'k4', orderId: 'ord-104', station: 'fry', prepTimeSeconds: 310, assignedChefId: 'c4', status: 'completed', foodItemName: 'Peri Peri Chicken Wings' }
];

export const INITIAL_RIDERS: DeliveryRider[] = [
  { id: 'r1', name: 'Rahul Sharma', status: 'transit', zone: 'North Zone', averageTimeMinutes: 44, complaintsCount: 3 },
  { id: 'r2', name: 'Amit Verma', status: 'idle', zone: 'North Zone', averageTimeMinutes: 38, complaintsCount: 1 },
  { id: 'r3', name: 'Vikram Singh', status: 'transit', zone: 'South Zone', averageTimeMinutes: 28, complaintsCount: 0 },
  { id: 'r4', name: 'Priya Nair', status: 'transit', zone: 'East Zone', averageTimeMinutes: 24, complaintsCount: 0 }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  { id: 'rev-1', timestamp: '2026-07-05T14:30:00Z', customerName: 'Kabir Mehta', rating: 2, comment: 'Pizza took 45 mins to arrive and was cold. North Zone delivery speeds are terrible.', sentiment: 'negative', deliveryZone: 'North Zone', menuItemId: 'm1' },
  { id: 'rev-2', timestamp: '2026-07-05T15:12:00Z', customerName: 'Ananya Roy', rating: 5, comment: 'Amazing truffle mushroom pizza, but cheese could be spread more evenly.', sentiment: 'positive', menuItemId: 'm1' },
  { id: 'rev-3', timestamp: '2026-07-05T16:05:00Z', customerName: 'Siddharth Sen', rating: 3, comment: 'Burger was great, but delivery was delayed.', sentiment: 'neutral', deliveryZone: 'North Zone' },
  { id: 'rev-4', timestamp: '2026-07-05T16:40:00Z', customerName: 'Riya Gupta', rating: 2, comment: 'Avocado salad was sub-par, and portion was tiny. Disappointed with the waste.', sentiment: 'negative', menuItemId: 'm3' }
];

export const INITIAL_ORDERS: POSOrder[] = [
  { id: 'ord-101', timestamp: '17:15', items: [{ menuItemId: 'm1', quantity: 2, salePrice: 950 }], paymentMethod: 'Card', source: 'delivery', status: 'completed', revenue: 1900 },
  { id: 'ord-102', timestamp: '17:20', items: [{ menuItemId: 'm2', quantity: 1, salePrice: 650 }], paymentMethod: 'UPI', source: 'dine_in', status: 'completed', revenue: 650 },
  { id: 'ord-103', timestamp: '17:25', items: [{ menuItemId: 'm3', quantity: 3, salePrice: 480 }], paymentMethod: 'UPI', source: 'delivery', status: 'completed', revenue: 1440 },
  { id: 'ord-104', timestamp: '17:30', items: [{ menuItemId: 'm4', quantity: 2, salePrice: 520 }], paymentMethod: 'Cash', source: 'takeaway', status: 'completed', revenue: 1040 },
  { id: 'ord-105', timestamp: '17:35', items: [{ menuItemId: 'm5', quantity: 1, salePrice: 780 }], paymentMethod: 'Card', source: 'dine_in', status: 'completed', revenue: 780 }
];

// Helper to generate dynamic metrics based on restaurant state
export interface SimulatedMetrics {
  revenueTotal: number;
  ordersCount: number;
  wasteCost: number;
  averagePrepTime: number; // in seconds
  averageDeliveryTime: number; // in minutes
  customerSatisfaction: number; // 0-5
  kitchenLoadRatio: number; // percentage
  deliveryBottleneckLevel: 'low' | 'medium' | 'high';
  activeAlertCount: number;
}

export function calculateMetrics(
  chefCount: number,
  riderCount: number,
  cheeseRatio: number,
  avocadoRatio: number,
  marketingMultiplier: number
): SimulatedMetrics {
  // Base constants
  const baseOrders = 180;
  
  // Marketing multiplier effect
  const simulatedOrders = Math.round(baseOrders * marketingMultiplier);
  const averageTicketSize = 750;
  const simulatedRevenue = simulatedOrders * averageTicketSize;

  // Kitchen performance: depends on chefs and cheese stock availability (lack of cheese stock triggers walking delay)
  // More chefs = faster prep. Less cheese stock = slower prep (walking back and forth to freezer)
  const basePrep = 720; // 12 mins
  const chefFactor = 4 / Math.max(1, chefCount); // 4 chefs is standard
  const stockDelayFactor = cheeseRatio < 1 ? (1.5 - cheeseRatio * 0.5) : 1.0;
  const simulatedPrepTime = Math.round(basePrep * chefFactor * stockDelayFactor);

  // Delivery performance: depends on riders and orders volume
  const baseDelivery = 26; // 26 mins
  const riderRatio = (simulatedOrders / 10) / Math.max(1, riderCount); // standard: 1 rider per 10 orders active
  const simulatedDeliveryTime = Math.round(baseDelivery * riderRatio * 1.2);

  // Waste cost: depends on Avocado and Cheese stock ratios
  // high ratio = overstocking = higher waste. Low stock = less waste but potential out-of-stock
  const cheeseStockVal = 15750 * cheeseRatio;
  const avocadoStockVal = 8750 * avocadoRatio;
  const cheeseWaste = cheeseStockVal * (0.04 + (cheeseRatio > 1.5 ? (cheeseRatio - 1.5) * 0.15 : 0));
  const avocadoWaste = avocadoStockVal * (0.18 + (avocadoRatio > 1.2 ? (avocadoRatio - 1.2) * 0.25 : 0));
  const otherWaste = 4200;
  const simulatedWasteCost = Math.round(cheeseWaste + avocadoWaste + otherWaste);

  // Customer satisfaction: negative impact by delivery delay and prep times
  let satisfaction = 4.6;
  if (simulatedDeliveryTime > 35) satisfaction -= (simulatedDeliveryTime - 35) * 0.05;
  if (simulatedPrepTime > 900) satisfaction -= (simulatedPrepTime - 900) * 0.0005;
  if (cheeseRatio < 0.5) satisfaction -= 0.3; // Out of cheese pizza complaints
  satisfaction = Math.max(1.0, Math.min(5.0, Number(satisfaction.toFixed(2))));

  // Kitchen load ratio
  const loadRatio = Math.min(100, Math.round((simulatedOrders * 60) / (chefCount * 45)));

  // Delivery bottleneck level
  let deliveryBottleneck: 'low' | 'medium' | 'high' = 'low';
  if (simulatedDeliveryTime > 40) {
    deliveryBottleneck = 'high';
  } else if (simulatedDeliveryTime > 30) {
    deliveryBottleneck = 'medium';
  }

  // Count active alerts (computed downstream by the AI engine)
  let activeAlertCount = 0;
  if (cheeseRatio < 0.6) activeAlertCount++;
  if (avocadoRatio > 1.4) activeAlertCount++;
  if (simulatedDeliveryTime > 38) activeAlertCount++;
  if (simulatedPrepTime > 840) activeAlertCount++;

  return {
    revenueTotal: simulatedRevenue,
    ordersCount: simulatedOrders,
    wasteCost: simulatedWasteCost,
    averagePrepTime: simulatedPrepTime,
    averageDeliveryTime: simulatedDeliveryTime,
    customerSatisfaction: satisfaction,
    kitchenLoadRatio: loadRatio,
    deliveryBottleneckLevel: deliveryBottleneck,
    activeAlertCount
  };
}
