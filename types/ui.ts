// UI Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ProductCardProps extends BaseComponentProps {
  product: import('./database').Product;
  onQuickView?: (product: import('./database').Product) => void;
  onAddToCart?: (product: import('./database').Product, size: string) => void;
  onAddToWishlist?: (productId: string) => void;
  showQuickActions?: boolean;
}

export interface ProductImageGalleryProps extends BaseComponentProps {
  images: import('./database').ProductImage[];
  selectedImage?: string;
  onImageSelect?: (imageUrl: string) => void;
  showZoom?: boolean;
}

export interface SizeSelectorProps extends BaseComponentProps {
  sizes: import('./database').Size[];
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
  error?: string;
  showSizeGuide?: boolean;
}

export interface ColorSelectorProps extends BaseComponentProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

export interface FilterSidebarProps extends BaseComponentProps {
  filters: import('./database').ProductFilters;
  onFiltersChange: (filters: import('./database').ProductFilters) => void;
  categories: import('./database').Category[];
  priceRange: [number, number];
  maxPrice: number;
}

export interface CartItemProps extends BaseComponentProps {
  item: import('./database').CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onMoveToWishlist: (item: import('./database').CartItem) => void;
}

export interface AddressFormProps extends BaseComponentProps {
  address?: import('./database').Address;
  onSubmit: (address: Omit<import('./database').Address, 'id'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ReviewCardProps extends BaseComponentProps {
  review: import('./database').Review;
  onHelpful?: (reviewId: string) => void;
  showProductInfo?: boolean;
}

export interface SearchBarProps extends BaseComponentProps {
  query?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
  showSuggestions?: boolean;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

// Layout Component Props
export interface HeaderProps extends BaseComponentProps {
  cartItemCount?: number;
  user?: import('./database').User;
  onCartOpen?: () => void;
  onSearch?: (query: string) => void;
}

export interface FooterProps extends BaseComponentProps {
  showNewsletter?: boolean;
  socialLinks?: {
    name: string;
    url: string;
    icon: string;
  }[];
}

export interface NavigationProps extends BaseComponentProps {
  categories: import('./database').Category[];
  currentCategory?: string;
}

// Form Component Props
export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export interface LoginFormProps extends BaseComponentProps {
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
}

export interface RegisterFormProps extends BaseComponentProps {
  onSubmit: (data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

// Cultural Component Props
export interface SizeGuideModalProps extends ModalProps {
  category: string;
  measurements: import('./database').MeasurementGuide[];
}

export interface OccasionFilterProps extends BaseComponentProps {
  occasions: string[];
  selectedOccasions?: string[];
  onOccasionSelect: (occasions: string[]) => void;
}

export interface FabricSelectorProps extends BaseComponentProps {
  fabrics: string[];
  selectedFabric?: string;
  onFabricSelect: (fabric: string) => void;
}

// Festival Component Props
export interface FestivalBannerProps extends BaseComponentProps {
  festival: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  endDate?: Date;
}

export interface CountdownTimerProps extends BaseComponentProps {
  targetDate: Date;
  onComplete?: () => void;
  format?: 'full' | 'compact';
}

// Admin Component Props
export interface ProductFormProps extends BaseComponentProps {
  product?: import('./database').Product;
  categories: import('./database').Category[];
  onSubmit: (product: Omit<import('./database').Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
  error?: string;
}

export interface OrderManagementProps extends BaseComponentProps {
  orders: import('./database').Order[];
  onStatusUpdate: (orderId: string, status: import('./database').OrderStatus) => void;
  onOrderView: (order: import('./database').Order) => void;
  isLoading?: boolean;
}

// Animation and Transition Props
export interface AnimatedProps extends BaseComponentProps {
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  duration?: number;
  delay?: number;
  trigger?: 'mount' | 'hover' | 'click';
}

// Responsive Props
export interface ResponsiveProps extends BaseComponentProps {
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}