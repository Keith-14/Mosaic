import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AppState = {
  cartCount: number
  firstName: string | null
  setCartCount: (count: number) => void
  setFirstName: (name: string | null) => void
}

// Demo-only mock auth state. No real account data or authentication is used.
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cartCount: 0,
      firstName: null,
      setCartCount: (cartCount) => set({ cartCount }),
      setFirstName: (firstName) => set({ firstName }),
    }),
    { name: 'bodywise-demo-state' },
  ),
)
