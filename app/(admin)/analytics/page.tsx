'use client';

import { useState, useEffect } from 'react';
import { AnalyticsService } from '@/lib/analytics/service';
import { AnalyticsMetrics, AnalyticsFilter } from '@/types/analytics';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnalyticsFilter>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  });

  useEffect(() => {
    const analyticsService = AnalyticsService.getInstance();
    analyticsService.loadPersistedEvents();
    
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const data = await analyticsService.getMetrics(filter);
        setMetrics(data);
      } catch (error) {
        console.error('Failed to load analytics metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [filter]);

  const handleDateRangeChange = (days: number) => {
    setFilter({
      startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">No analytics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleDateRangeChange(7)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Last 7 days
          </button>
          <button
            onClick={() => handleDateRangeChange(30)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Last 30 days
          </button>
          <button
            onClick={() => handleDateRangeChange(90)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
          Last 90 days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{metrics.totalRevenue.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">
            {metrics.totalOrders}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average Order Value</h3>
          <p className="text-2xl font-bold text-purple-600">
            ₹{metrics.averageOrderValue.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold text-orange-600">
            {metrics.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="space-y-3">
            {metrics.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">
                      {product.views} views · {product.purchases} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {product.conversionRate.toFixed(1)}% conv.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
          <div className="space-y-3">
            {metrics.topCategories.slice(0, 5).map((category, index) => (
              <div key={category.categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{category.categoryName}</p>
                    <p className="text-sm text-gray-600">
                      {category.views} views · {category.purchases} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{category.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Engagement</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Session Duration</span>
              <span className="font-medium">
                {metrics.userEngagement.averageSessionDuration.toFixed(1)} min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-medium">{metrics.userEngagement.bounceRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pages per Session</span>
              <span className="font-medium">{metrics.userEngagement.pagesPerSession.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Returning Users</span>
              <span className="font-medium">{metrics.userEngagement.returningUserRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Cart Abandonment Rate</span>
              <span className="font-medium text-red-600">
                {metrics.cartAbandonmentRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Active Users</span>
              <span className="font-medium">{metrics.userEngagement.dailyActiveUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Active Users</span>
              <span className="font-medium">{metrics.userEngagement.monthlyActiveUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
          <div className="space-y-3">
            {metrics.salesMetrics.revenueByCategory.slice(0, 4).map((category) => (
              <div key={category.categoryId} className="flex justify-between">
                <span className="text-gray-600">{category.categoryName}</span>
                <div className="text-right">
                  <p className="font-medium">₹{category.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}