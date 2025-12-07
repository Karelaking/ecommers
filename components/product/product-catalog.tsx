'use client';

import React from 'react';
import { Grid, List, Filter, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { FilterSidebar } from '@/components/product/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Product, ProductFilters, SortOption } from '@/types/database';
import { cn } from '@/lib/utils';

interface ProductCatalogProps {
  products: Product[];
  categories: Array<{ id: string; name: string; slug: string }>;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isLoading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (page: number) => void;
  maxPrice: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

export function ProductCatalog({
  products,
  categories,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  isLoading = false,
  pagination,
  onPageChange,
  maxPrice,
}: ProductCatalogProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  const handleSortSelect = (sortOption: SortOption) => {
    onSortChange(sortOption);
    setIsSortOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories?.length) count++;
    if (filters.priceRange) count++;
    if (filters.colors?.length) count++;
    if (filters.sizes?.length) count++;
    if (filters.fabrics?.length) count++;
    if (filters.occasions?.length) count++;
    if (filters.work?.length) count++;
    if (filters.regions?.length) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex gap-8">
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={onFiltersChange}
        categories={categories}
        priceRange={filters.priceRange || [0, maxPrice]}
        maxPrice={maxPrice}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {isLoading ? (
                <span>Loading products...</span>
              ) : (
                <span>
                  Showing {products.length} of {pagination.total} products
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-content text-xs rounded-full px-2 py-1">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2"
                >
                  Sort: {SORT_OPTIONS.find(opt => opt.value === sort)?.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortSelect(option.value)}
                        className={cn(
                          'w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors',
                          sort === option.value && 'bg-primary text-primary-content'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-gray-100'
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-gray-100'
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.categories?.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <span
                    key={categoryId}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {category.name}
                    <button
                      onClick={() => {
                        const newCategories = filters.categories?.filter(id => id !== categoryId) || [];
                        onFiltersChange({ ...filters, categories: newCategories });
                      }}
                      className="ml-1 hover:text-gray-900"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              
              {filters.priceRange && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                  <button
                    onClick={() => onFiltersChange({ ...filters, priceRange: undefined })}
                    className="ml-1 hover:text-gray-900"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.colors?.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {color}
                  <button
                    onClick={() => {
                      const newColors = filters.colors?.filter(c => c !== color) || [];
                      onFiltersChange({ ...filters, colors: newColors });
                    }}
                    className="ml-1 hover:text-gray-900"
                  >
                    ×
                  </button>
                </span>
              ))}

              {filters.sizes?.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  Size {size}
                  <button
                    onClick={() => {
                      const newSizes = filters.sizes?.filter(s => s !== size) || [];
                      onFiltersChange({ ...filters, sizes: newSizes });
                    }}
                    className="ml-1 hover:text-gray-900"
                  >
                    ×
                  </button>
                </span>
              ))}

              <button
                onClick={() => onFiltersChange({})}
                className="text-sm text-primary hover:text-primary/80"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-3/4 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={cn(
            'gap-6',
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'space-y-6'
          )}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(product) => {
                  // TODO: Implement quick view modal
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search terms to find what you&apos;re looking for.
              </p>
              <Button onClick={() => onFiltersChange({})}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && products.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={cn(
                        'w-10 h-10 rounded-lg transition-colors',
                        pagination.page === pageNum
                          ? 'bg-primary text-primary-content'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}