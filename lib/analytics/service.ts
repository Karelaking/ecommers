import { AnalyticsEvent, AnalyticsEventType, AnalyticsMetrics, AnalyticsFilter } from '@/types/analytics';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  trackEvent(
    eventType: AnalyticsEventType,
    eventName: string,
    properties: Record<string, any> = {},
    userId?: string
  ): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      userId,
      sessionId: this.sessionId,
      eventType,
      eventName,
      properties,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    this.events.push(event);
    this.persistEvent(event);
  }

  trackPageView(page: string, userId?: string): void {
    this.trackEvent('page_view', 'Page View', { page }, userId);
  }

  trackProductView(productId: string, productName: string, price: number, userId?: string): void {
    this.trackEvent('product_view', 'Product View', {
      productId,
      productName,
      price,
    }, userId);
  }

  trackAddToCart(productId: string, productName: string, price: number, quantity: number, userId?: string): void {
    this.trackEvent('add_to_cart', 'Add to Cart', {
      productId,
      productName,
      price,
      quantity,
      totalValue: price * quantity,
    }, userId);
  }

  trackRemoveFromCart(productId: string, productName: string, price: number, quantity: number, userId?: string): void {
    this.trackEvent('remove_from_cart', 'Remove from Cart', {
      productId,
      productName,
      price,
      quantity,
      totalValue: price * quantity,
    }, userId);
  }

  trackBeginCheckout(cartValue: number, itemCount: number, userId?: string): void {
    this.trackEvent('begin_checkout', 'Begin Checkout', {
      cartValue,
      itemCount,
    }, userId);
  }

  trackPurchase(orderId: string, total: number, itemCount: number, products: any[], userId?: string): void {
    this.trackEvent('purchase', 'Purchase', {
      orderId,
      total,
      itemCount,
      products,
    }, userId);
  }

  trackAddToWishlist(productId: string, productName: string, price: number, userId?: string): void {
    this.trackEvent('add_to_wishlist', 'Add to Wishlist', {
      productId,
      productName,
      price,
    }, userId);
  }

  trackSearch(query: string, resultCount: number, userId?: string): void {
    this.trackEvent('search', 'Search', {
      query,
      resultCount,
    }, userId);
  }

  trackFilter(filters: Record<string, any>, userId?: string): void {
    this.trackEvent('filter', 'Filter Applied', {
      filters,
    }, userId);
  }

  trackCategoryView(categoryId: string, categoryName: string, userId?: string): void {
    this.trackEvent('category_view', 'Category View', {
      categoryId,
      categoryName,
    }, userId);
  }

  trackLogin(userId: string, method: string = 'email'): void {
    this.trackEvent('login', 'User Login', {
      method,
    }, userId);
  }

  trackSignup(userId: string, method: string = 'email'): void {
    this.trackEvent('signup', 'User Signup', {
      method,
    }, userId);
  }

  trackCartView(cartValue: number, itemCount: number, userId?: string): void {
    this.trackEvent('cart_view', 'Cart View', {
      cartValue,
      itemCount,
    }, userId);
  }

  async getMetrics(filter?: AnalyticsFilter): Promise<AnalyticsMetrics> {
    const filteredEvents = this.filterEvents(filter);
    
    return {
      totalRevenue: this.calculateTotalRevenue(filteredEvents),
      totalOrders: this.calculateTotalOrders(filteredEvents),
      totalUsers: this.calculateTotalUsers(filteredEvents),
      averageOrderValue: this.calculateAverageOrderValue(filteredEvents),
      conversionRate: this.calculateConversionRate(filteredEvents),
      cartAbandonmentRate: this.calculateCartAbandonmentRate(filteredEvents),
      topProducts: this.getTopProducts(filteredEvents),
      topCategories: this.getTopCategories(filteredEvents),
      userEngagement: this.getUserEngagementMetrics(filteredEvents),
      salesMetrics: this.getSalesMetrics(filteredEvents),
    };
  }

  private filterEvents(filter?: AnalyticsFilter): AnalyticsEvent[] {
    if (!filter) return this.events;

    return this.events.filter(event => {
      if (filter.startDate && event.timestamp < filter.startDate) return false;
      if (filter.endDate && event.timestamp > filter.endDate) return false;
      if (filter.userId && event.userId !== filter.userId) return false;
      if (filter.eventType && event.eventType !== filter.eventType) return false;
      if (filter.category && event.properties.categoryId !== filter.category) return false;
      if (filter.product && event.properties.productId !== filter.product) return false;
      
      return true;
    });
  }

  private calculateTotalRevenue(events: AnalyticsEvent[]): number {
    return events
      .filter(e => e.eventType === 'purchase')
      .reduce((total, event) => total + (event.properties.total || 0), 0);
  }

  private calculateTotalOrders(events: AnalyticsEvent[]): number {
    return events.filter(e => e.eventType === 'purchase').length;
  }

  private calculateTotalUsers(events: AnalyticsEvent[]): number {
    const uniqueUsers = new Set(events.filter(e => e.userId).map(e => e.userId));
    return uniqueUsers.size;
  }

  private calculateAverageOrderValue(events: AnalyticsEvent[]): number {
    const purchaseEvents = events.filter(e => e.eventType === 'purchase');
    if (purchaseEvents.length === 0) return 0;
    
    const totalRevenue = purchaseEvents.reduce((sum, e) => sum + (e.properties.total || 0), 0);
    return totalRevenue / purchaseEvents.length;
  }

  private calculateConversionRate(events: AnalyticsEvent[]): number {
    const uniqueUsers = new Set(events.filter(e => e.userId).map(e => e.userId));
    const purchasingUsers = new Set(
      events
        .filter(e => e.eventType === 'purchase' && e.userId)
        .map(e => e.userId)
    );
    
    if (uniqueUsers.size === 0) return 0;
    return (purchasingUsers.size / uniqueUsers.size) * 100;
  }

  private calculateCartAbandonmentRate(events: AnalyticsEvent[]): number {
    const checkoutStarted = events.filter(e => e.eventType === 'begin_checkout').length;
    const purchases = events.filter(e => e.eventType === 'purchase').length;
    
    if (checkoutStarted === 0) return 0;
    return ((checkoutStarted - purchases) / checkoutStarted) * 100;
  }

  private getTopProducts(events: AnalyticsEvent[]): any[] {
    const productMetrics = new Map();

    events.forEach(event => {
      if (event.properties.productId) {
        const productId = event.properties.productId;
        const productName = event.properties.productName || 'Unknown Product';
        
        if (!productMetrics.has(productId)) {
          productMetrics.set(productId, {
            productId,
            productName,
            views: 0,
            addToCarts: 0,
            purchases: 0,
            revenue: 0,
          });
        }

        const metrics = productMetrics.get(productId);
        
        switch (event.eventType) {
          case 'product_view':
            metrics.views++;
            break;
          case 'add_to_cart':
            metrics.addToCarts++;
            break;
          case 'purchase':
            metrics.purchases++;
            metrics.revenue += event.properties.total || 0;
            break;
        }
      }
    });

    return Array.from(productMetrics.values())
      .map(product => ({
        ...product,
        conversionRate: product.views > 0 ? (product.purchases / product.views) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private getTopCategories(events: AnalyticsEvent[]): any[] {
    const categoryMetrics = new Map();

    events.forEach(event => {
      if (event.properties.categoryId) {
        const categoryId = event.properties.categoryId;
        const categoryName = event.properties.categoryName || 'Unknown Category';
        
        if (!categoryMetrics.has(categoryId)) {
          categoryMetrics.set(categoryId, {
            categoryId,
            categoryName,
            views: 0,
            addToCarts: 0,
            purchases: 0,
            revenue: 0,
          });
        }

        const metrics = categoryMetrics.get(categoryId);
        
        switch (event.eventType) {
          case 'category_view':
            metrics.views++;
            break;
          case 'add_to_cart':
            metrics.addToCarts++;
            break;
          case 'purchase':
            metrics.purchases++;
            metrics.revenue += event.properties.total || 0;
            break;
        }
      }
    });

    return Array.from(categoryMetrics.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private getUserEngagementMetrics(events: AnalyticsEvent[]): any {
    const sessions = new Map();
    
    events.forEach(event => {
      if (!sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, {
          startTime: event.timestamp,
          endTime: event.timestamp,
          pageViews: 0,
          duration: 0,
        });
      }
      
      const session = sessions.get(event.sessionId);
      session.endTime = event.timestamp;
      session.duration = session.endTime.getTime() - session.startTime.getTime();
      
      if (event.eventType === 'page_view') {
        session.pageViews++;
      }
    });

    const sessionArray = Array.from(sessions.values());
    const averageSessionDuration = sessionArray.length > 0 
      ? sessionArray.reduce((sum, s) => sum + s.duration, 0) / sessionArray.length / 1000 / 60
      : 0;

    const bounceRate = sessionArray.length > 0
      ? (sessionArray.filter(s => s.pageViews === 1).length / sessionArray.length) * 100
      : 0;

    const pagesPerSession = sessionArray.length > 0
      ? sessionArray.reduce((sum, s) => sum + s.pageViews, 0) / sessionArray.length
      : 0;

    const uniqueUsers = new Set(events.filter(e => e.userId).map(e => e.userId));
    const returningUsers = new Set();
    
    events.forEach(event => {
      if (event.userId) {
        const userEvents = events.filter(e => e.userId === event.userId);
        if (userEvents.length > 1) {
          returningUsers.add(event.userId);
        }
      }
    });

    const returningUserRate = uniqueUsers.size > 0 
      ? (returningUsers.size / uniqueUsers.size) * 100 
      : 0;

    return {
      averageSessionDuration,
      bounceRate,
      pagesPerSession,
      returningUserRate,
      dailyActiveUsers: uniqueUsers.size,
      monthlyActiveUsers: uniqueUsers.size,
    };
  }

  private getSalesMetrics(events: AnalyticsEvent[]): any {
    const dailySales = new Map();
    const monthlySales = new Map();
    const revenueByCategory = new Map();

    events
      .filter(e => e.eventType === 'purchase')
      .forEach(event => {
        const date = event.timestamp.toISOString().split('T')[0];
        const month = event.timestamp.toISOString().slice(0, 7);
        const total = event.properties.total || 0;

        if (!dailySales.has(date)) {
          dailySales.set(date, { date, revenue: 0, orders: 0 });
        }
        dailySales.get(date).revenue += total;
        dailySales.get(date).orders++;

        if (!monthlySales.has(month)) {
          monthlySales.set(month, { month, revenue: 0, orders: 0 });
        }
        monthlySales.get(month).revenue += total;
        monthlySales.get(month).orders++;

        if (event.properties.categoryId) {
          const categoryId = event.properties.categoryId;
          const categoryName = event.properties.categoryName || 'Unknown';
          
          if (!revenueByCategory.has(categoryId)) {
            revenueByCategory.set(categoryId, { categoryId, categoryName, revenue: 0 });
          }
          revenueByCategory.get(categoryId).revenue += total;
        }
      });

    const totalRevenue = Array.from(revenueByCategory.values())
      .reduce((sum, cat) => sum + cat.revenue, 0);

    return {
      dailySales: Array.from(dailySales.values())
        .map(day => ({
          ...day,
          averageOrderValue: day.orders > 0 ? day.revenue / day.orders : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      monthlySales: Array.from(monthlySales.values())
        .map(month => ({
          ...month,
          averageOrderValue: month.orders > 0 ? month.revenue / month.orders : 0,
          growthRate: 0,
        }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      revenueByCategory: Array.from(revenueByCategory.values())
        .map(cat => ({
          ...cat,
          percentage: totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue),
      revenueByRegion: [],
    };
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  private generateEventId(): string {
    return 'event_' + Math.random().toString(36).substr(2, 9);
  }

  private persistEvent(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      existingEvents.push(event);
      
      if (existingEvents.length > 1000) {
        existingEvents.splice(0, existingEvents.length - 1000);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(existingEvents));
    }
  }

  loadPersistedEvents(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        try {
          const parsedEvents = JSON.parse(stored);
          this.events = parsedEvents.map((event: any) => ({
            ...event,
            timestamp: new Date(event.timestamp),
          }));
        } catch (error) {
          console.error('Failed to load persisted analytics events:', error);
        }
      }
    }
  }
}