import { z } from 'zod';

// Product Validation Schemas
export const ProductImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
  order: z.number().min(0),
  isPrimary: z.boolean(),
});

export const CulturalMetadataSchema = z.object({
  occasions: z.array(z.string()),
  fabric: z.string().min(1),
  work: z.string().min(1),
  region: z.string().min(1),
  careInstructions: z.array(z.string()),
  colorFamily: z.array(z.string()),
});

export const SizeSchema = z.object({
  label: z.string().min(1),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  length: z.number().positive().optional(),
  available: z.boolean(),
});

export const MeasurementGuideSchema = z.object({
  size: z.string().min(1),
  chest: z.number().positive(),
  waist: z.number().positive(),
  hips: z.number().positive().optional(),
  length: z.number().positive(),
  shoulder: z.number().positive().optional(),
});

export const SizeGuideSchema = z.object({
  category: z.string().min(1),
  measurements: z.array(MeasurementGuideSchema),
});

export const ProductSizingSchema = z.object({
  sizes: z.array(SizeSchema),
  sizeGuide: SizeGuideSchema,
  internationalSizing: z.record(z.string(), z.string()),
});

export const ProductCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  sku: z.string().min(1, 'SKU is required'),
  inventory: z.number().int().min(0, 'Inventory must be non-negative'),
  images: z.array(ProductImageSchema).min(1, 'At least one image is required'),
  culturalMetadata: CulturalMetadataSchema,
  sizing: ProductSizingSchema,
  tags: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
});

export const ProductUpdateSchema = ProductCreateSchema.partial().extend({
  id: z.string().uuid(),
});

// Category Validation Schemas
export const CategoryCreateSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial().extend({
  id: z.string().uuid(),
});

// User Validation Schemas
export const UserUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number').optional(),
  avatar: z.string().url().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  preferences: z.object({
    currency: z.string().length(3).optional(),
    language: z.string().length(2).optional(),
    newsletter: z.boolean().optional(),
    sizeRecommendations: z.boolean().optional(),
  }).optional(),
});

// Address Validation Schemas
export const AddressCreateSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  isDefault: z.boolean().default(false),
});

export const AddressUpdateSchema = AddressCreateSchema.partial().extend({
  id: z.string().uuid(),
});

// Cart Validation Schemas
export const CartAddSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().optional(),
});

export const CartUpdateSchema = z.object({
  itemId: z.string().uuid('Invalid cart item ID'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

// Order Validation Schemas
export const OrderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().optional(),
});

export const OrderCreateSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: AddressCreateSchema.omit({ type: true }),
  billingAddress: AddressCreateSchema.omit({ type: true }).optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  couponCode: z.string().optional(),
});

// Review Validation Schemas
export const ReviewCreateSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Review title is required'),
  content: z.string().min(10, 'Review content must be at least 10 characters'),
  images: z.array(z.string().url()).optional(),
});

export const ReviewUpdateSchema = ReviewCreateSchema.partial().extend({
  id: z.string().uuid(),
});

// Wishlist Validation Schemas
export const WishlistAddSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
});

// Search and Filter Validation Schemas
export const ProductFiltersSchema = z.object({
  categories: z.array(z.string()).optional(),
  priceRange: z.tuple([z.number().min(0), z.number().min(0)]).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  fabrics: z.array(z.string()).optional(),
  occasions: z.array(z.string()).optional(),
  work: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5).optional(),
  inStock: z.boolean().optional(),
});

export const SearchParamsSchema = z.object({
  query: z.string().optional(),
  filters: ProductFiltersSchema.optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'oldest', 'popular', 'rating', 'name_asc', 'name_desc']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Auth Validation Schemas
export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

// Payment Validation Schemas
export const PaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Invalid currency code'),
  orderId: z.string().uuid('Invalid order ID'),
  customerEmail: z.string().email('Invalid email address'),
});

// File Upload Validation Schemas
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['product', 'avatar', 'review']),
  productId: z.string().uuid().optional(),
});

// Admin Validation Schemas
export const BulkOperationSchema = z.object({
  action: z.enum(['activate', 'deactivate', 'delete', 'update_category']),
  productIds: z.array(z.string().uuid()).min(1, 'At least one product ID is required'),
  categoryId: z.string().uuid().optional(),
});

// Export type inference
export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type AddressCreateInput = z.infer<typeof AddressCreateSchema>;
export type AddressUpdateInput = z.infer<typeof AddressUpdateSchema>;
export type CartAddInput = z.infer<typeof CartAddSchema>;
export type CartUpdateInput = z.infer<typeof CartUpdateSchema>;
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type ReviewCreateInput = z.infer<typeof ReviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof ReviewUpdateSchema>;
export type WishlistAddInput = z.infer<typeof WishlistAddSchema>;
export type ProductFiltersInput = z.infer<typeof ProductFiltersSchema>;
export type SearchParamsInput = z.infer<typeof SearchParamsSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type PaymentIntentInput = z.infer<typeof PaymentIntentSchema>;
export type FileUploadInput = z.infer<typeof FileUploadSchema>;
export type BulkOperationInput = z.infer<typeof BulkOperationSchema>;