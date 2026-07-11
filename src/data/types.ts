// TypeScript type definitions for restaurant operational data

export interface DashboardMetrics {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  totalCustomers: number;
  revenueChange: string;
  ordersChange: string;
  avgOrderChange: string;
  customersChange: string;
  businessHealth: number;
  riskLevel: "Low" | "Medium" | "High";
  systemStatus: "Healthy" | "Issues Detected";
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  color: string;
  dim: string;
  sub: string;
}

export interface ChartDataPoint {
  t: string;
  v: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface DishItem {
  name: string;
  orders: number;
  revenue: number;
  tag: string;
  color: string;
  menuId: number;
  image: string;
}

export interface NonSellingItem {
  name: string;
  orders: number;
  revenue: number;
  menuId: number;
  image: string;
}

export interface BestPerforming {
  name: string;
  orders: number;
  revenue: number;
}

export interface DayData {
  date: string;
  displayDate: string;
  dashboard: DashboardMetrics;
  kpis: KPI[];
  salesTrend: ChartDataPoint[];
  ordersByTime: ChartDataPoint[];
  categoryData: CategoryData[];
  topDishes: DishItem[];
  notSelling: NonSellingItem[];
  bestPerforming: BestPerforming;
  aiRecommendation: string;
}

export interface RestaurantData {
  [date: string]: DayData;
}

export interface DataContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  currentData: DayData | null;
  availableDates: string[];
}
