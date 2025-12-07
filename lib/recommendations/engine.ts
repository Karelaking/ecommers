import { Product } from '@/types/database';

export interface RecommendationEngine {
  getRecommendations(userId: string, productId?: string): Promise<Product[]>;
  getSimilarProducts(productId: string): Promise<Product[]>;
  getTrendingProducts(): Promise<Product[]>;
  getPersonalizedRecommendations(userId: string): Promise<Product[]>;
}

export class ProductRecommendationService implements RecommendationEngine {
  private products: Product[] = [];
  private userInteractions: Map<string, UserInteraction[]> = new Map();

  constructor(products: Product[]) {
    this.products = products;
  }

  async getRecommendations(userId: string, productId?: string): Promise<Product[]> {
    const recommendations: Product[] = [];
    
    if (productId) {
      const similar = await this.getSimilarProducts(productId);
      recommendations.push(...similar.slice(0, 3));
    }
    
    const personalized = await this.getPersonalizedRecommendations(userId);
    recommendations.push(...personalized.slice(0, 4));
    
    const trending = await this.getTrendingProducts();
    recommendations.push(...trending.slice(0, 3));
    
    return this.removeDuplicates(recommendations).slice(0, 8);
  }

  async getSimilarProducts(productId: string): Promise<Product[]> {
    const product = this.products.find(p => p.id === productId);
    if (!product) return [];

    return this.products
      .filter(p => p.id !== productId && p.status === 'active')
      .map(p => ({
        product: p,
        score: this.calculateSimilarityScore(product, p)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.product);
  }

  async getTrendingProducts(): Promise<Product[]> {
    return this.products
      .filter(p => p.status === 'active')
      .sort((a, b) => {
        const aScore = this.calculateTrendingScore(a);
        const bScore = this.calculateTrendingScore(b);
        return bScore - aScore;
      })
      .slice(0, 10);
  }

  async getPersonalizedRecommendations(userId: string): Promise<Product[]> {
    const interactions = this.userInteractions.get(userId) || [];
    const userPreferences = this.analyzeUserPreferences(interactions);
    
    return this.products
      .filter(p => p.status === 'active')
      .map(p => ({
        product: p,
        score: this.calculatePersonalizationScore(p, userPreferences)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.product);
  }

  private calculateSimilarityScore(product1: Product, product2: Product): number {
    let score = 0;
    
    if (product1.categoryId === product2.categoryId) {
      score += 0.3;
    }
    
    const commonTags = product1.tags.filter(tag => product2.tags.includes(tag));
    score += commonTags.length * 0.1;
    
    const commonColors = product1.culturalMetadata.colorFamily.filter(
      color => product2.culturalMetadata.colorFamily.includes(color)
    );
    score += commonColors.length * 0.15;
    
    if (product1.culturalMetadata.fabric === product2.culturalMetadata.fabric) {
      score += 0.2;
    }
    
    if (product1.culturalMetadata.work === product2.culturalMetadata.work) {
      score += 0.15;
    }
    
    const priceDiff = Math.abs(product1.price - product2.price);
    const priceSimilarity = Math.max(0, 1 - priceDiff / Math.max(product1.price, product2.price));
    score += priceSimilarity * 0.1;
    
    return score;
  }

  private calculateTrendingScore(product: Product): number {
    const createdDate = typeof product.createdAt === 'string' 
      ? new Date(product.createdAt) 
      : product.createdAt;
    const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysSinceCreated / 30);
    
    const priceScore = product.price < 5000 ? 0.3 : 0.1;
    
    const tagScore = product.tags.includes('trending') ? 0.4 : 0;
    
    return recencyScore * 0.3 + priceScore + tagScore;
  }

  private calculatePersonalizationScore(product: Product, preferences: UserPreferences): number {
    let score = 0;
    
    if (preferences.preferredCategories.includes(product.categoryId)) {
      score += 0.3;
    }
    
    const commonFabrics = preferences.preferredFabrics.includes(product.culturalMetadata.fabric) ? [product.culturalMetadata.fabric] : [];
    score += commonFabrics.length * 0.2;
    
    const commonColors = product.culturalMetadata.colorFamily.filter(
      color => preferences.preferredColors.includes(color)
    );
    score += commonColors.length * 0.15;
    
    if (preferences.priceRange) {
      const [min, max] = preferences.priceRange;
      if (product.price >= min && product.price <= max) {
        score += 0.2;
      }
    }
    
    if (preferences.preferredOccasions.length > 0) {
      const commonOccasions = product.culturalMetadata.occasions.filter(
        occasion => preferences.preferredOccasions.includes(occasion)
      );
      score += commonOccasions.length * 0.1;
    }
    
    return score;
  }

  private analyzeUserPreferences(interactions: UserInteraction[]): UserPreferences {
    const preferences: UserPreferences = {
      preferredCategories: [],
      preferredFabrics: [],
      preferredColors: [],
      preferredOccasions: [],
      priceRange: [0, 10000]
    };

    const categoryCounts: Record<string, number> = {};
    const fabricCounts: Record<string, number> = {};
    const colorCounts: Record<string, number> = {};
    const occasionCounts: Record<string, number> = {};
    const prices: number[] = [];

    interactions.forEach(interaction => {
      if (interaction.product) {
        categoryCounts[interaction.product.categoryId] = 
          (categoryCounts[interaction.product.categoryId] || 0) + interaction.weight;
        
        fabricCounts[interaction.product.culturalMetadata.fabric] = 
          (fabricCounts[interaction.product.culturalMetadata.fabric] || 0) + interaction.weight;
        
        interaction.product.culturalMetadata.colorFamily.forEach(color => {
          colorCounts[color] = (colorCounts[color] || 0) + interaction.weight;
        });
        
        interaction.product.culturalMetadata.occasions.forEach(occasion => {
          occasionCounts[occasion] = (occasionCounts[occasion] || 0) + interaction.weight;
        });
        
        prices.push(interaction.product.price);
      }
    });

    preferences.preferredCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    preferences.preferredFabrics = Object.entries(fabricCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([fabric]) => fabric);

    preferences.preferredColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color);

    preferences.preferredOccasions = Object.entries(occasionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([occasion]) => occasion);

    if (prices.length > 0) {
      prices.sort((a, b) => a - b);
      const q1 = prices[Math.floor(prices.length * 0.25)];
      const q3 = prices[Math.floor(prices.length * 0.75)];
      preferences.priceRange = [q1, q3];
    }

    return preferences;
  }

  private removeDuplicates(products: Product[]): Product[] {
    const seen = new Set<string>();
    return products.filter(product => {
      if (seen.has(product.id)) {
        return false;
      }
      seen.add(product.id);
      return true;
    });
  }

  recordUserInteraction(userId: string, productId: string, type: InteractionType): void {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const interactions = this.userInteractions.get(userId) || [];
    const weight = this.getInteractionWeight(type);
    
    interactions.push({
      productId,
      product,
      type,
      weight,
      timestamp: new Date()
    });

    if (interactions.length > 100) {
      interactions.shift();
    }

    this.userInteractions.set(userId, interactions);
  }

  private getInteractionWeight(type: InteractionType): number {
    switch (type) {
      case 'view': return 1;
      case 'cart_add': return 3;
      case 'purchase': return 5;
      case 'wishlist_add': return 2;
      case 'review': return 4;
      default: return 1;
    }
  }
}

interface UserInteraction {
  productId: string;
  product: Product;
  type: InteractionType;
  weight: number;
  timestamp: Date;
}

type InteractionType = 'view' | 'cart_add' | 'purchase' | 'wishlist_add' | 'review';

interface UserPreferences {
  preferredCategories: string[];
  preferredFabrics: string[];
  preferredColors: string[];
  preferredOccasions: string[];
  priceRange: [number, number];
}