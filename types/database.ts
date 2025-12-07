// Database Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  images: ProductImage[];
  inventory: number;
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  culturalMetadata: CulturalMetadata;
  sizing: ProductSizing;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface CulturalMetadata {
  occasions: string[]; // ['wedding', 'festival', 'casual']
  fabric: string;    // 'silk', 'cotton', 'chiffon', 'banarasi'
  work: string;      // 'embroidery', 'printed', 'handloom', 'zari'
  region: string;    // 'rajasthan', 'kashmir', 'south', 'gujarat'
  careInstructions: string[];
  colorFamily: string[];
}

export interface ProductSizing {
  sizes: Size[];
  sizeGuide: SizeGuide;
  internationalSizing: Record<string, string>;
}

export interface Size {
  id: string;
  label: string; // 'S', 'M', 'L', 'XL', 'XXL'
  chest?: number;
  waist?: number;
  length?: number;
  available: boolean;
}

export interface SizeGuide {
  category: string;
  measurements: MeasurementGuide[];
}

export interface MeasurementGuide {
  size: string;
  chest: number;
  waist: number;
  hips?: number;
  length: number;
  shoulder?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  subcategories?: Category[];
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color?: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color?: string;
  price: number;
  total: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  profile: UserProfile;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'customer' | 'admin' | 'vendor';

export interface UserProfile {
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  language: string;
  newsletter: boolean;
  sizeRecommendations: boolean;
}

export interface Address {
  id: string;
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

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: User;
  rating: number; // 1-5
  title: string;
  content: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter and Search Types
export interface ProductFilters {
  categories?: string[];
  priceRange?: [number, number];
  colors?: string[];
  sizes?: string[];
  fabrics?: string[];
  occasions?: string[];
  work?: string[];
  regions?: string[];
  rating?: number;
  inStock?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: ProductFilters;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption = 
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'oldest'
  | 'popular'
  | 'rating'
  | 'name_asc'
  | 'name_desc';

// UI State Types
export interface UIState {
  isLoading: boolean;
  error?: string;
  success?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  isLoading: boolean;
}

export interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct?: Product;
  filters: ProductFilters;
  searchQuery: string;
  sort: SortOption;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error?: string;
}