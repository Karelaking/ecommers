"use client";
import React from 'react';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { useCartStore } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2999 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-gray-400 mb-6">
            <ShoppingBag className="h-24 w-24 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Shopping Cart</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet. 
            Start shopping to add some beautiful ethnic wear!
          </p>
          <a href="/products" className="w-full inline-block">
            <Button className="w-full">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            You have {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-2">{item.product.name}</h3>
                      
                      {/* Size and Color */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        {item.size && (
                          <span className="bg-white px-3 py-1 rounded border border-gray-200">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="bg-white px-3 py-1 rounded border border-gray-200">
                            Color: {item.color}
                          </span>
                        )}
                        <span className="text-primary font-semibold">
                          {item.quantity} × {item.price.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">Price per item</div>
                          <div className="font-semibold">
                            {item.price.toLocaleString('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              minimumFractionDigits: 0,
                            })}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Subtotal</div>
                          <div className="font-semibold text-lg text-primary">
                            {(item.price * item.quantity).toLocaleString('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              minimumFractionDigits: 0,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1"
                  >
                    Clear Cart
                  </Button>
                  <a href="/products" className="flex-1 inline-block">
                    <Button className="w-full">
                      Continue Shopping
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>{subtotal.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                  })}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : shipping.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax (18% GST)</span>
                  <span>{tax.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                  })}</span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary">{total.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                  })}</span>
                </div>
              </div>

              {/* Free Shipping Message */}
              {shipping > 0 && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-6">
                  <div className="font-semibold mb-1">🎉 Free Shipping Available!</div>
                  <div>
                    Add {(3000 - subtotal).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                    })} more for free shipping
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <a href="/checkout" className="w-full inline-block">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  Proceed to Checkout
                  <CreditCard className="h-5 w-5" />
                </Button>
              </a>

              {/* Security Badge */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.41 9-12V5l-9-4z"/>
                    <path d="M12 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5z"/>
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </div>

              {/* Accepted Payments */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-3">We Accept:</div>
                <div className="flex gap-2">
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                    UPI
                  </div>
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                    COD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartSidebar />
    </div>
  );
}