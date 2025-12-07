// Centralized mock-data surface (shim for migration)
export { generateMockCategories } from './mock-data/categories';
export { generateMockProducts } from './mock-data/products';
export { generateMockUsers } from './mock-data/users';
export { generateMockOrders } from './mock-data/orders';
export { generateMockReviews } from './mock-data/reviews';
import { generateMockProducts as _generateMockProducts } from './mock-data/products';
export function generateMockProduct(id?: string) {
  const p = _generateMockProducts(1)[0];
  if (id) p.id = id;
  return p;
}

