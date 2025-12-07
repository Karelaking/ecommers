export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventType: AnalyticsEventType;
  eventName: string;
  properties: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  page?: string;
}

export type AnalyticsEventType = 
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'add_to_wishlist'
  | 'search'
  | 'filter'
  | 'category_view'
  | 'login'
  | 'signup'
  | 'cart_view';

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
  conversionRate: number;
  cartAbandonmentRate: number;
  topProducts: ProductMetric[];
  topCategories: CategoryMetric[];
  userEngagement: UserEngagementMetrics;
  salesMetrics: SalesMetrics;
}

export interface ProductMetric {
  productId: string;
  productName: string;
  views: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
}

export interface CategoryMetric {
  categoryId: string;
  categoryName: string;
  views: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
}

export interface UserEngagementMetrics {
  averageSessionDuration: number;
  bounceRate: number;
  pagesPerSession: number;
  returningUserRate: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
}

export interface SalesMetrics {
  dailySales: DailySales[];
  monthlySales: MonthlySales[];
  revenueByCategory: RevenueByCategory[];
  revenueByRegion: RevenueByRegion[];
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  growthRate: number;
}

export interface RevenueByCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface RevenueByRegion {
  region: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  eventType?: AnalyticsEventType;
  category?: string;
  product?: string;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type: ReportType;
  filters: AnalyticsFilter;
  metrics: AnalyticsMetrics;
  generatedAt: Date;
  generatedBy: string;
}

export type ReportType = 
  | 'sales_summary'
  | 'product_performance'
  | 'user_behavior'
  | 'conversion_funnel'
  | 'inventory_analysis'
  | 'customer_lifetime_value';