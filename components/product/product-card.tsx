'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDiscountPrice, getStockStatus } from '@/lib/utils';
import { useCartStore } from '@/hooks/use-cart';
import { useWishlistStore } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
  showQuickActions?: boolean;
}

export function ProductCard({ 
  product, 
  className, 
  onQuickView,
  showQuickActions = true 
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const [selectedSize, setSelectedSize] = React.useState('');
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = React.useState(false);

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const stockStatus = getStockStatus(product.inventory);
  const averageRating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  const handleAddToCart = async () => {
    if (!selectedSize && (product.sizing?.sizes?.length ?? 0) > 0) {
      alert('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    try {
      addItem(product, 1, selectedSize || 'OS');
      // Show success toast
    } catch (error) {
      console.error(error);
      // Show error toast
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    setIsAddingToWishlist(true);
    try {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    } catch (error) {
      // Show error toast
      // error
      console.error(error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className={cn(
      'group bg-base-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden',
      className
    )}>
      {/* Product Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-base-200">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {formatDiscountPrice(product.originalPrice!, product.price)}
            </span>
          )}
          {stockStatus.status === 'low_stock' && (
            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Only {product.inventory} left
            </span>
          )}
          {stockStatus.status === 'out_of_stock' && (
            <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onQuickView?.(product)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={isAddingToWishlist}
              className={cn(
                'p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md',
                isInWishlist(product.id) && 'text-red-600'
              )}
              aria-label="Add to wishlist"
            >
              <Heart className={cn('h-4 w-4', isInWishlist(product.id) && 'fill-current')} />
            </button>
          </div>
        )}

        {/* Cultural Tags */}
        {product.culturalMetadata?.occasions && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
            {product.culturalMetadata.occasions.slice(0, 2).map((occasion) => (
              <span
                key={occasion}
                className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {occasion}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-base-content/60 mb-1 uppercase tracking-wide">
          {product.culturalMetadata?.fabric ?? ''}{product.culturalMetadata?.fabric && product.culturalMetadata?.work ? ' • ' : ''}{product.culturalMetadata?.work ?? ''}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-base-content mb-2 line-clamp-2 hover:text-primary transition-colors">
          <a href={`/products/${product.id}`}>
            {product.name}
          </a>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Math.floor(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-base-content/60">
            {averageRating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-base-content/60 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Size Selector */}
        {product.sizing?.sizes && product.sizing.sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-1 flex-wrap">
              {product.sizing.sizes.slice(0, 4).map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.label)}
                  disabled={!size.available}
                  className={cn(
                    'px-3 py-1 text-xs border rounded transition-colors',
                    selectedSize === size.label
                      ? 'border-primary bg-primary text-primary-content'
                      : size.available
                      ? 'border-base-300 hover:border-primary'
                      : 'border-base-300 bg-base-200 text-base-content/40 cursor-not-allowed'
                  )}
                >
                  {size.label}
                </button>
              ))}
              {product.sizing.sizes.length > 4 && (
                <span className="px-3 py-1 text-xs border border-base-300 rounded">
                  +{product.sizing.sizes.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={stockStatus.status === 'out_of_stock' || isAddingToCart}
          className="w-full"
          size="sm"
        >
          {isAddingToCart ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Adding...
            </span>
          ) : stockStatus.status === 'out_of_stock' ? (
            'Out of Stock'
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}