import { faker } from '@faker-js/faker';
import { Category } from '@/types/database';
import { REMOTE_CATEGORY_IMAGES } from '@/lib/config/images';

export function generateMockCategories(): Category[] {
  return [
    {
      id: '1',
      name: 'Sarees',
      slug: 'sarees',
      description: 'Traditional Indian sarees for all occasions',
      image: REMOTE_CATEGORY_IMAGES[0],
      order: 1,
      isActive: true,
      subcategories: [
        { id: '1-1', name: 'Banarasi Sarees', slug: 'banarasi-sarees', description: 'Luxurious Banar silk sarees', parentId: '1', order: 1, isActive: true },
        { id: '1-2', name: 'Silk Sarees', slug: 'silk-sarees', description: 'Pure silk sarees', parentId: '1', order: 2, isActive: true },
      ],
    },
    {
      id: '2',
      name: 'Salwar Kameez',
      slug: 'salwar-kameez',
      description: 'Traditional salwar kameez suits',
      image: REMOTE_CATEGORY_IMAGES[1],
      order: 2,
      isActive: true,
    },
    {
      id: '3',
      name: 'Lehengas',
      slug: 'lehengas',
      description: 'Beautiful lehenga cholis',
      image: REMOTE_CATEGORY_IMAGES[2],
      order: 3,
      isActive: true,
    },
    {
      id: '4',
      name: 'Kurtis',
      slug: 'kurtis',
      description: 'Stylish kurtis for women',
      image: REMOTE_CATEGORY_IMAGES[3],
      order: 4,
      isActive: true,
    },
    {
      id: '5',
      name: 'Sherwanis',
      slug: 'sherwanis',
      description: "Traditional men's sherwanis",
      image: REMOTE_CATEGORY_IMAGES[4],
      order: 5,
      isActive: true,
    },
  ];
}
