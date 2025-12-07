import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { Cart, CartItem, Product } from '@/types/database';

// Mock cart storage - in production, this would be in a database
const carts = new Map<string, Cart>();

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = carts.get(userId) || {
      id: `cart-${userId}`,
      userId,
      items: [],
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity = 1, size = 'OS' } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get existing cart or create new one
    let cart = carts.get(userId);
    if (!cart) {
      cart = {
        id: `cart-${userId}`,
        userId,
        items: [],
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // In a real app, you'd fetch the product from the database
    // For now, we'll create a mock product
    const product: Product = {
      id: productId,
      name: `Product ${productId}`,
      description: 'Mock product',
      price: 99.99,
      categoryId: '1',
      images: [],
      inventory: 10,
      sku: `SKU${productId}`,
      status: 'active',
      culturalMetadata: {
        occasions: [],
        fabric: 'cotton',
        work: 'printed',
        region: 'rajasthan',
        careInstructions: [],
        colorFamily: [],
      },
      sizing: {
        sizes: [],
        sizeGuide: { category: 'women', measurements: [] },
        internationalSizing: {},
      },
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        productId,
        product,
        quantity,
        size,
        price: product.price,
      };
      cart.items.push(cartItem);
    }

    // Recalculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.updatedAt = new Date();

    // Save cart
    carts.set(userId, cart);

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      // Clear entire cart
      carts.delete(userId);
      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }

    // Remove specific item
    const cart = carts.get(userId);
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    cart.items = cart.items.filter((item) => item.id !== itemId);
    
    // Recalculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.updatedAt = new Date();

    carts.set(userId, cart);

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}