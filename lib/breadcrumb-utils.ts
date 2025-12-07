import { BreadcrumbItem } from '@/components/layout/breadcrumb';

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with Home
  if (pathname !== '/') {
    breadcrumbs.push({
      label: 'Home',
      href: '/',
      isActive: false,
    });
  }

  // Build breadcrumb trail based on path segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip numeric segments (product IDs, page numbers)
    if (/^\d+$/.test(segment)) {
      return;
    }

    const breadcrumb = getBreadcrumbFromSegment(segment, currentPath, index === segments.length - 1);
    if (breadcrumb) {
      breadcrumbs.push(breadcrumb);
    }
  });

  return breadcrumbs;
}

function getBreadcrumbFromSegment(segment: string, fullPath: string, isLast: boolean): BreadcrumbItem | null {
  const segmentMap: Record<string, { label: string; href?: string }> = {
    // Categories
    'women': { label: 'Women', href: '/products/women' },
    'men': { label: 'Men', href: '/products/men' },
    'kids': { label: 'Kids', href: '/products/kids' },
    'sarees': { label: 'Sarees', href: '/products/women/sarees' },
    'salwar-kameez': { label: 'Salwar Kameez', href: '/products/women/salwar-kameez' },
    'lehengas': { label: 'Lehengas', href: '/products/women/lehengas' },
    'kurtis': { label: 'Kurtis', href: '/products/women/kurtis' },
    'sherwanis': { label: 'Sherwanis', href: '/products/men/sherwanis' },
    'kurtas': { label: 'Kurtas', href: '/products/men/kurtas' },
    'ethnic-jackets': { label: 'Ethnic Jackets', href: '/products/men/ethnic-jackets' },
    'dhotis': { label: 'Dhotis', href: '/products/men/dhotis' },
    
    // Collections
    'festive': { label: 'Festive Collection', href: '/collections/festive' },
    'wedding': { label: 'Wedding Collection', href: '/collections/wedding' },
    
    // Account pages
    'account': { label: 'Account', href: '/account' },
    'profile': { label: 'Profile', href: '/account/profile' },
    'orders': { label: 'Orders', href: '/account/orders' },
    'addresses': { label: 'Addresses', href: '/account/addresses' },
    'wishlist': { label: 'Wishlist', href: '/wishlist' },
    
    // Other pages
    'cart': { label: 'Shopping Cart', href: '/cart' },
    'checkout': { label: 'Checkout', href: '/checkout' },
    'products': { label: 'Products', href: '/products' },
    'about': { label: 'About Us', href: '/about' },
    'contact': { label: 'Contact', href: '/contact' },
    'offers': { label: 'Offers', href: '/offers' },
  };

  const mapped = segmentMap[segment];
  if (mapped) {
    return {
      label: mapped.label,
      href: mapped.href,
      isActive: isLast,
    };
  }

  // Handle dynamic segments with capitalization
  const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
  return {
    label: capitalizedSegment.replace(/-/g, ' '),
    isActive: isLast,
  };
}