'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { FilterSidebar } from '@/components/product/filter-sidebar';
import { generateMockProducts } from '@/lib/mock-data/products';
import { generateMockCategories } from '@/lib/mock-data/categories';
import { ProductFilters } from '@/types/database';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const products = generateMockProducts(20);
  const categories = generateMockCategories();
  const maxPrice = 10000;
  const priceRange: [number, number] = [0, maxPrice];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              priceRange={priceRange}
              maxPrice={maxPrice}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                All Products
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Discover our complete collection of ethnic wear
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}