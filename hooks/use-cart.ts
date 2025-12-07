import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/database';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  isLoading: boolean;
  // Actions
  addItem: (product: Product, quantity: number, size: string, color?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      isLoading: false,

      addItem: (product, quantity, size, color) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              item.size === size &&
              item.color === color
          );

          let newItems: CartItem[];

          if (existingItemIndex >= 0) {
            // Update existing item
            newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            };
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `${product.id}-${size}-${color || 'default'}`,
              productId: product.id,
              product,
              quantity,
              size,
              color,
              price: product.price,
            };
            newItems = [...state.items, newItem];
          }

          return {
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId);
          return {
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity === 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          return {
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          };
        });
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().total;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, total: state.total }),
    }
  )
);