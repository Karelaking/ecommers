import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItem, Product } from '@/types/database';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );

          if (existingItem) {
            return state; // Item already in wishlist
          }

          const newItem: WishlistItem = {
            id: product.id,
            productId: product.id,
            product,
            addedAt: new Date(),
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);