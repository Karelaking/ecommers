// API Route Types
export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  query?: Record<string, string | string[]>;
  body?: any;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  fabric?: string;
  occasion?: string;
  inStock?: boolean;
}

export interface SearchParams extends PaginationParams, SortParams, FilterParams {
  q?: string;
}

// Auth API Types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  token: string;
}

// Product API Types
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  sku: string;
  inventory: number;
  images: {
    url: string;
    alt: string;
    order: number;
    isPrimary: boolean;
  }[];
  culturalMetadata: {
    occasions: string[];
    fabric: string;
    work: string;
    region: string;
    careInstructions: string[];
    colorFamily: string[];
  };
  sizing: {
    sizes: {
      label: string;
      chest?: number;
      waist?: number;
      length?: number;
      available: boolean;
    }[];
    sizeGuide: {
      category: string;
      measurements: {
        size: string;
        chest: number;
        waist: number;
        hips?: number;
        length: number;
        shoulder?: number;
      }[];
    };
    internationalSizing: Record<string, string>;
  };
  tags: string[];
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string;
}

export interface ProductListResponse {
  products: import('./database').Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    categories: import('./database').Category[];
    priceRange: {
      min: number;
      max: number;
    };
    colors: string[];
    sizes: string[];
    fabrics: string[];
    occasions: string[];
  };
}

// Cart API Types
export interface CartAddRequest {
  productId: string;
  quantity: number;
  size: string;
  color?: string;
}

export interface CartUpdateRequest {
  itemId: string;
  quantity: number;
}

export interface CartResponse {
  id: string;
  items: import('./database').CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
}

// Order API Types
export interface OrderCreateRequest {
  items: {
    productId: string;
    quantity: number;
    size: string;
    color?: string;
  }[];
  shippingAddress: Omit<import('./database').Address, 'id' | 'type'>;
  billingAddress?: Omit<import('./database').Address, 'id' | 'type'>;
  paymentMethod: string;
  couponCode?: string;
}

export interface OrderResponse {
  order: import('./database').Order;
  paymentIntent?: {
    clientSecret: string;
    publishableKey: string;
  };
}

// Review API Types
export interface ReviewCreateRequest {
  productId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
}

export interface ReviewUpdateRequest extends Partial<ReviewCreateRequest> {
  id: string;
}

// Wishlist API Types
export interface WishlistAddRequest {
  productId: string;
}

export interface WishlistResponse {
  id: string;
  items: import('./database').WishlistItem[];
}

// User API Types
export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    currency?: string;
    language?: string;
    newsletter?: boolean;
    sizeRecommendations?: boolean;
  };
}

export interface AddressCreateRequest {
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressUpdateRequest extends Partial<AddressCreateRequest> {
  id: string;
}

// Admin API Types
export interface AdminStatsResponse {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: import('./database').Order[];
  topProducts: {
    product: import('./database').Product;
    sales: number;
    revenue: number;
  }[];
  salesChart: {
    date: string;
    sales: number;
    revenue: number;
  }[];
}

// Payment API Types
export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  publishableKey: string;
}

export interface WebhookEvent {
  type: string;
  data: any;
  signature: string;
}

// Search API Types
export interface SearchSuggestionResponse {
  suggestions: string[];
  products: import('./database').Product[];
  categories: import('./database').Category[];
}

// File Upload API Types
export interface FileUploadRequest {
  file: File;
  type: 'product' | 'avatar' | 'review';
  productId?: string;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

export interface ValidationError extends ApiError {
  field: string;
  value: any;
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Cache Types
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[];
  revalidate?: number;
}

// Webhook Types
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature: string;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  userId?: string;
  sessionId: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface ProductViewEvent extends AnalyticsEvent {
  event: 'product_view';
  properties: {
    productId: string;
    categoryId: string;
    price: number;
    source: string;
  };
}

export interface AddToCartEvent extends AnalyticsEvent {
  event: 'add_to_cart';
  properties: {
    productId: string;
    quantity: number;
    price: number;
    size: string;
    color?: string;
  };
}

export interface PurchaseEvent extends AnalyticsEvent {
  event: 'purchase';
  properties: {
    orderId: string;
    total: number;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    paymentMethod: string;
  };
}