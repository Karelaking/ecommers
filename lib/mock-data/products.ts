import { Product } from '@/types/database';
import { REMOTE_PRODUCT_IMAGES } from '@/lib/config/images';
import { generateMockCategories } from './categories';

export function generateMockProducts(count: number = 50): Product[] {
  const categories = generateMockCategories();
  return Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length];
    const imageA = REMOTE_PRODUCT_IMAGES[(index * 3) % REMOTE_PRODUCT_IMAGES.length];
    const imageB = REMOTE_PRODUCT_IMAGES[(index * 3 + 1) % REMOTE_PRODUCT_IMAGES.length];
    const imageC = REMOTE_PRODUCT_IMAGES[(index * 3 + 2) % REMOTE_PRODUCT_IMAGES.length];
    const price = 999 + (index % 50) * 100;

    return {
      id: `product-${index + 1}`,
      name: `Product ${index + 1}`,
      description: 'Mock product for centralized data plan',
      price,
      categoryId: category?.id ?? '1',
      images: [
        { id: `img-${index}-1`, url: imageA, alt: 'Product image 1', order: 0, isPrimary: true },
        { id: `img-${index}-2`, url: imageB, alt: 'Product image 2', order: 1, isPrimary: false },
        { id: `img-${index}-3`, url: imageC, alt: 'Product image 3', order: 2, isPrimary: false },
      ],
      inventory: 20,
      sku: `SKU${String(index + 1).padStart(6, '0')}`,
      status: 'active' as const,
      culturalMetadata: {
        occasions: ['wedding', 'festival', 'casual'].slice(0, (index % 3) + 1),
        fabric: ['silk', 'cotton', 'chiffon', 'banarasi'][index % 4],
        work: ['embroidery', 'printed', 'handloom', 'zari'][index % 4],
        region: ['rajasthan', 'kashmir', 'south', 'gujarat'][index % 4],
        careInstructions: ['Dry clean only', 'Hand wash cold', 'Gentle cycle'],
        colorFamily: ['red', 'blue', 'green', 'gold', 'black'].slice(0, (index % 3) + 2),
      },
      sizing: {
        sizes: [
          { id: `s-${index}`, label: 'S', chest: 36, waist: 30, length: 28, available: true },
          { id: `m-${index}`, label: 'M', chest: 38, waist: 32, length: 29, available: true },
          { id: `l-${index}`, label: 'L', chest: 40, waist: 34, length: 30, available: index % 3 !== 0 },
          { id: `xl-${index}`, label: 'XL', chest: 42, waist: 36, length: 31, available: index % 4 !== 0 },
        ],
        sizeGuide: { 
          category: 'women', 
          measurements: [
            { size: 'S', chest: 36, waist: 30, hips: 38, length: 28 },
            { size: 'M', chest: 38, waist: 32, hips: 40, length: 29 },
            { size: 'L', chest: 40, waist: 34, hips: 42, length: 30 },
          ]
        },
        internationalSizing: {
          'US': 'S-M-L',
          'EU': '36-38-40',
          'UK': '8-10-12'
        }
      },
      tags: ['ethnic', 'traditional', 'modern'].slice(0, (index % 2) + 2),
      rating: 3.5 + (index % 2),
      reviewCount: 5 + (index % 20),
      createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
      updatedAt: new Date(),
    };
  });
}
