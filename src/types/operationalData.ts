export interface POSOrder {
  id: string;
  timestamp: string;
  items: Array<{ menuItemId: string; quantity: number; salePrice: number }>;
  paymentMethod: string;
  source: 'dine_in' | 'delivery' | 'takeaway';
  status: 'completed' | 'cancelled';
  revenue: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number; // in kg or units
  safetyStock: number;
  unitCost: number;
  wastePercentage: number;
  lastRestocked: string;
  supplierName: string;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  station: 'grill' | 'fry' | 'pizza' | 'prep';
  prepTimeSeconds: number;
  assignedChefId: string;
  status: 'completed' | 'in_progress' | 'delayed';
  foodItemName: string;
}

export interface DeliveryRider {
  id: string;
  name: string;
  status: 'idle' | 'assigned' | 'transit';
  zone: 'North Zone' | 'South Zone' | 'East Zone' | 'West Zone';
  averageTimeMinutes: number;
  complaintsCount: number;
}

export interface CustomerReview {
  id: string;
  timestamp: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  deliveryZone?: string;
  menuItemId?: string;
}

export interface OperationalAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'kitchen' | 'inventory' | 'delivery' | 'menu' | 'customer';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  // Structured AI COO attributes
  evidence: string;
  rootCause: string;
  prediction: string;
  recommendation: string;
  businessImpact: string;
  expectedSavings: string;
  confidenceScore: number; // e.g. 94
}

export interface RestaurantState {
  branchName: string;
  chefCount: number;
  riderCount: number;
  cheeseStockRatio: number; // Multiplier of ingredient stock level for simulation
  avocadoStockRatio: number;
  marketingSpendMultiplier: number;
}
