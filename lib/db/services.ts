import { supabase } from '@/lib/supabase';
import { Product, Category, ProductFilters, PaginatedResponse } from '@/types/database';

export class ProductService {
  // Get all products with filters and pagination
  static async getProducts(
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 20,
    sort: string = 'newest'
  ): Promise<PaginatedResponse<Product>> {
    if (!supabase) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        cultural_metadata:cultural_metadata(*),
        sizes:product_sizes(*),
        reviews:reviews(rating)
      `, { count: 'exact' });

    // Apply filters
    if (filters.categories?.length) {
      query = query.in('category_id', filters.categories);
    }

    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);
    }

    if (filters.inStock !== undefined) {
      query = query.gt('inventory', 0);
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name_asc':
        query = query.order('name', { ascending: true });
        break;
      case 'name_desc':
        query = query.order('name', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    // Transform data to match our Product interface
    const products: Product[] = (data || []).map(this.transformProductData);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1,
      },
    };
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<Product | null> {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        cultural_metadata:cultural_metadata(*),
        sizes:product_sizes(*),
        reviews:reviews(*, user:user_profiles(first_name, last_name))
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return this.transformProductData(data);
  }

  // Get products by category
  static async getProductsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Product>> {
    return this.getProducts({ categories: [categoryId] }, page, limit);
  }

  // Search products
  static async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Product>> {
    if (!supabase) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    const { data, error, count } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        cultural_metadata:cultural_metadata(*),
        sizes:product_sizes(*)
      `, { count: 'exact' })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }

    const products: Product[] = (data || []).map(this.transformProductData);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1,
      },
    };
  }

  // Get related products
  static async getRelatedProducts(
    productId: string,
    categoryId: string,
    limit: number = 8
  ): Promise<Product[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        cultural_metadata:cultural_metadata(*),
        sizes:product_sizes(*)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'active')
      .neq('id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }

    return (data || []).map(this.transformProductData);
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 12): Promise<Product[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        cultural_metadata:cultural_metadata(*),
        sizes:product_sizes(*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return (data || []).map(this.transformProductData);
  }

  // Transform database data to Product interface
  private static transformProductData(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      originalPrice: data.original_price ? parseFloat(data.original_price) : undefined,
      categoryId: data.category_id,
      images: (data.images || []).map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || data.name,
        order: img.order_index,
        isPrimary: img.is_primary,
      })),
      inventory: data.inventory,
      sku: data.sku,
      status: data.status,
      culturalMetadata: data.cultural_metadata ? {
        occasions: data.cultural_metadata.occasions || [],
        fabric: data.cultural_metadata.fabric || '',
        work: data.cultural_metadata.work || '',
        region: data.cultural_metadata.region || '',
        careInstructions: data.cultural_metadata.care_instructions || [],
        colorFamily: data.cultural_metadata.color_family || [],
      } : {
        occasions: [],
        fabric: '',
        work: '',
        region: '',
        careInstructions: [],
        colorFamily: [],
      },
      sizing: {
        sizes: (data.sizes || []).map((size: any) => ({
          id: size.id,
          label: size.label,
          chest: size.chest,
          waist: size.waist,
          length: size.length,
          available: size.available,
        })),
        sizeGuide: {
          category: '',
          measurements: [],
        },
        internationalSizing: {},
      },
      tags: data.tags || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export class CategoryService {
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return (data || []).map(this.transformCategoryData);
  }

  // Get category by slug
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return this.transformCategoryData(data);
  }

  // Get category tree with subcategories
  static async getCategoryTree(): Promise<Category[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch category tree: ${error.message}`);
    }

    const categories = (data || []).map(this.transformCategoryData);
    return this.buildCategoryTree(categories);
  }

  // Transform database data to Category interface
  private static transformCategoryData(data: any): Category {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      parentId: data.parent_id,
      order: data.order_index,
      isActive: data.is_active,
    };
  }

  // Build hierarchical category tree
  private static buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<string, Category & { subcategories: Category[] }>();
    const rootCategories: (Category & { subcategories: Category[] })[] = [];

    // Create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, subcategories: [] });
    });

    // Build tree structure
    categories.forEach(category => {
      const categoryWithSubs = categoryMap.get(category.id)!;
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.subcategories.push(categoryWithSubs);
        }
      } else {
        rootCategories.push(categoryWithSubs);
      }
    });

    return rootCategories;
  }
}