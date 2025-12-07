'use client';

import { Product } from '@/types/database';
import { ProductRecommendationService } from '@/lib/recommendations/engine';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RecommendationsProps {
  userId: string;
  productId?: string;
  title?: string;
  limit?: number;
}

export default function Recommendations({ 
  userId, 
  productId, 
  title = 'Recommended for You',
  limit = 4 
}: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/products');
        const { data: products } = await response.json();
        
        const recommendationService = new ProductRecommendationService(products);
        const recs = await recommendationService.getRecommendations(userId, productId);
        
        setRecommendations(recs.slice(0, limit));
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, productId, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg border bg-white">
              <Image
                src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
                alt={product.name}
                className="h-48 w-full object-cover transition-transform group-hover:scale-105"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {'★'.repeat(4)}
                  {'☆'.repeat(1)}
                </div>
                <span className="text-xs text-gray-500">(4.0)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}