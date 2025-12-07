import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { ProductFilters } from '@/types/database';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
  priceRange: [number, number];
  maxPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

const OCCASIONS = [
  'Wedding', 'Festival', 'Party', 'Casual', 'Office', 'Traditional', 'Modern'
];

const FABRICS = [
  'Silk', 'Cotton', 'Georgette', 'Chiffon', 'Velvet', 'Banarasi', 'Kanjeevaram',
  'Brocade', 'Net', 'Satin', 'Linen', 'Crepe'
];

const WORK_TYPES = [
  'Embroidery', 'Zari Work', 'Stone Work', 'Mirror Work', 'Printed',
  'Handloom', 'Woven', 'Patch Work', 'Applique', 'Block Print'
];

const REGIONS = [
  'Rajasthan', 'Kashmir', 'Gujarat', 'Banaras', 'Kanchipuram', 'Mysore',
  'Lucknow', 'Kolkata', 'Hyderabad', 'Chennai', 'Mumbai', 'Delhi'
];

const COLORS = [
  'Red', 'Maroon', 'Pink', 'Orange', 'Yellow', 'Green', 'Blue',
  'Navy', 'Purple', 'Black', 'White', 'Beige', 'Brown', 'Gold', 'Silver'
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export function FilterSidebar({
  filters,
  onFiltersChange,
  categories,
  priceRange,
  maxPrice,
  isOpen,
  onClose
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    categories: true,
    price: true,
    occasions: false,
    fabrics: false,
    work: false,
    colors: false,
    sizes: false,
    regions: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const currentRange = filters.priceRange || [0, maxPrice];
    
    if (type === 'min') {
      onFiltersChange({ ...filters, priceRange: [numValue, currentRange[1]] });
    } else {
      onFiltersChange({ ...filters, priceRange: [currentRange[0], numValue] });
    }
  };

  const handleMultiSelectChange = (field: keyof ProductFilters, value: string) => {
    const currentValues = (filters[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({ ...filters, [field]: newValues });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 overflow-y-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Categories
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.categories ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.categories && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category.id) || false}
                      onChange={() => handleCategoryChange(category.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Price Range
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.price ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.price && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange?.[0] || ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange?.[1] || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Range: ₹0 - ₹{maxPrice.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Occasions */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('occasions')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Occasions
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.occasions ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.occasions && (
              <div className="space-y-2">
                {OCCASIONS.map((occasion) => (
                  <label key={occasion} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.occasions?.includes(occasion) || false}
                      onChange={() => handleMultiSelectChange('occasions', occasion)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{occasion}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Fabrics */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('fabrics')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Fabrics
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.fabrics ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.fabrics && (
              <div className="space-y-2">
                {FABRICS.map((fabric) => (
                  <label key={fabric} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.fabrics?.includes(fabric) || false}
                      onChange={() => handleMultiSelectChange('fabrics', fabric)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{fabric}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Work Types */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('work')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Work Type
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.work ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.work && (
              <div className="space-y-2">
                {WORK_TYPES.map((work) => (
                  <label key={work} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.work?.includes(work) || false}
                      onChange={() => handleMultiSelectChange('work', work)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{work}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('colors')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Colors
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.colors ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.colors && (
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.colors?.includes(color) || false}
                      onChange={() => handleMultiSelectChange('colors', color)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-xs">{color}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('sizes')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Sizes
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.sizes ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.sizes && (
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sizes?.includes(size) || false}
                      onChange={() => handleMultiSelectChange('sizes', size)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-xs">{size}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Regions */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('regions')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              Regions
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.regions ? 'rotate-180' : ''
                )}
              />
            </button>
            {expandedSections.regions && (
              <div className="space-y-2">
                {REGIONS.map((region) => (
                  <label key={region} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.regions?.includes(region) || false}
                      onChange={() => handleMultiSelectChange('regions', region)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{region}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}