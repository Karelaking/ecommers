import React from 'react';
import { X, Plus, Minus, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart';
import { useWishlistStore } from '@/hooks/use-wishlist';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export function CartSidebar() {
  const {
    items,
    isOpen,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
  } = useCartStore();

  const { addItem: addToWishlist } = useWishlistStore();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleMoveToWishlist = (item: any) => {
    addToWishlist(item.product);
    removeItem(item.id);
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2999 ? 0 : 99; // Free shipping above ₹2999
  const tax = subtotal * 0.18; // 18% GST
  const orderTotal = subtotal + shipping + tax;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1.5 7.5L16 21a2 2 0 001.5-1.5H6.5A2 2 0 014 21l-2.5-7.5H5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">
                Add some beautiful ethnic wear to get started!
              </p>
              <Button onClick={closeCart} className="w-full max-w-xs">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden shrink-0">
                    {item.product.images[0] && (
                      <Image
                        fill
                        src={item.product.images[0].url}
                        alt={item.product.images[0].alt}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {item.product.name}
                    </h4>
                    
                    {/* Size and Color */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      {item.size && (
                        <span className="bg-white px-2 py-1 rounded border border-gray-200">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-white px-2 py-1 rounded border border-gray-200">
                          Color: {item.color}
                        </span>
                      )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-semibold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-gray-500">
                            {formatPrice(item.price)} each
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Move to Wishlist */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  items.forEach(item => handleMoveToWishlist(item));
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <Heart className="h-4 w-4" />
                Move all to Wishlist
              </button>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Free Shipping Message */}
            {shipping > 0 && (
              <div className="text-xs text-green-600 text-center">
                Add {formatPrice(3000 - subtotal)} more for FREE shipping!
              </div>
            )}

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Security Badge */}
            <div className="text-center text-xs text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.41 9-12V5l-9-4z"/>
                  <path d="M12 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5z"/>
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}