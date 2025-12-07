"use client";
import React from 'react';
import { User, Order } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Calendar, Download, Eye, Heart } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { generateMockOrders } from '@/lib/mock-data';

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = React.useState('orders');
  const [orders, setOrders] = React.useState<Order[]>([]);

  // Mock data for demonstration
  const mockOrders: Order[] = generateMockOrders(5).map(order => ({
    ...order,
    userId: user.id,
  }));

  React.useEffect(() => {
    setOrders(mockOrders);
  }, [user.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-purple-600 bg-purple-50';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'refunded':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'refunded':
        return 'Refunded';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-gray-600">
            Welcome back, {user.firstName || user.email}!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'addresses'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'wishlist'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Wishlist
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-gray-600">
                      Start shopping to see your orders here.
                    </p>
                    <a href="/products" className="mt-4 inline-block">
                      <Button>
                        Start Shopping
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <div className="text-sm text-gray-600">
                              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p>{order.shippingAddress.addressLine1}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Order Total</h4>
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(order.total)}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium mb-3">Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                  {item.product.images[0] && (
                                    <img
                                      src={item.product.images[0].url}
                                      alt={item.product.images[0].alt}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium">{item.product.name}</h5>
                                  <div className="text-sm text-gray-600">
                                    {item.size && <span>Size: {item.size}</span>}
                                    {item.color && <span className="ml-2">Color: {item.color}</span>}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Qty: {item.quantity}</span>
                                    <span>{formatPrice(item.price)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            {order.trackingNumber && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Tracking: {order.trackingNumber}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Invoice
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Personal Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">First Name</label>
                          <input
                            type="text"
                            value={user.firstName || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Last Name</label>
                          <input
                            type="text"
                            value={user.lastName || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={user.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <input
                            type="tel"
                            value={user.phone || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Account Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Email Notifications</span>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                            <span className="sr-only">Toggle</span>
                            <span className="translate-x-1 inline-block h-4 w-4 bg-white rounded-full shadow-sm transform transition-transform group-hover:translate-x-0"></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SMS Notifications</span>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                            <span className="sr-only">Toggle</span>
                            <span className="translate-x-1 inline-block h-4 w-4 bg-white rounded-full shadow-sm transform transition-transform group-hover:translate-x-0"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <Button>
                    Add New Address
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Home Address</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>John Doe</p>
                          <p>123 Main Street, Apartment 4B</p>
                          <p>Mumbai, Maharashtra 400001</p>
                          <p>India</p>
                          <p>+91 98765 43210</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Heart className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-6">
                    Save your favorite items to wishlist for easy access later.
                  </p>
                  <a href="/products" className="w-full max-w-xs inline-block">
                    <Button>
                      Browse Products
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}