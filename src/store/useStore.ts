import { create } from 'zustand'

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

interface CartItem extends Product {
  quantity: number
}

interface StoreState {
  cart: CartItem[]
  searchQuery: string
  categoryFilter: string
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  setSearchQuery: (query: string) => void
  setCategoryFilter: (category: string) => void
  clearCart: () => void
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  searchQuery: '',
  categoryFilter: '',
  
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id)
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] }
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  
  clearCart: () => set({ cart: [] }),
}))
