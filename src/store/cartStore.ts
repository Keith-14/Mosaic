import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProductById } from '../data/products'

export type CartItem = { productId: string; variantLabel?: string; qty: number }
export type CartTotals = { count: number; subtotal: number; mrpTotal: number; discount: number; shipping: number; total: number }

const itemPrice = (item: CartItem) => {
  const product = getProductById(item.productId)
  const variant = product?.variants?.find((candidate) => candidate.label === item.variantLabel)
  return { price: variant?.price ?? product?.price ?? 0, mrp: variant?.mrp ?? product?.mrp ?? 0 }
}

export const getCartTotals = (items: CartItem[]): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + itemPrice(item).price * item.qty, 0)
  const mrpTotal = items.reduce((sum, item) => sum + itemPrice(item).mrp * item.qty, 0)
  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49
  return { count, subtotal, mrpTotal, discount: mrpTotal - subtotal, shipping, total: subtotal + shipping }
}

type CartState = {
  items: CartItem[]
  couponCode?: string
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (productId: string, variantLabel?: string) => void
  setQty: (productId: string, qty: number, variantLabel?: string) => void
  clear: () => void
  applyCoupon: (code?: string) => void
  open: () => void
  close: () => void
  count: () => number
  subtotal: () => number
  mrpTotal: () => number
  discount: () => number
  shipping: () => number
  total: () => number
}

const sameItem = (item: CartItem, productId: string, variantLabel?: string) => item.productId === productId && item.variantLabel === variantLabel

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], couponCode: undefined, isOpen: false,
      addItem: ({ productId, variantLabel }, qty = 1) => set((state) => {
        const existing = state.items.find((item) => sameItem(item, productId, variantLabel))
        return { items: existing ? state.items.map((item) => sameItem(item, productId, variantLabel) ? { ...item, qty: Math.min(10, item.qty + qty) } : item) : [...state.items, { productId, variantLabel, qty: Math.min(10, Math.max(1, qty)) }] }
      }),
      removeItem: (productId, variantLabel) => set((state) => ({ items: state.items.filter((item) => !sameItem(item, productId, variantLabel)) })),
      setQty: (productId, qty, variantLabel) => set((state) => ({ items: state.items.map((item) => sameItem(item, productId, variantLabel) ? { ...item, qty: Math.min(10, Math.max(1, qty)) } : item) })),
      clear: () => set({ items: [], couponCode: undefined }), applyCoupon: (couponCode) => set({ couponCode }), open: () => set({ isOpen: true }), close: () => set({ isOpen: false }),
      count: () => getCartTotals(get().items).count,
      subtotal: () => getCartTotals(get().items).subtotal,
      mrpTotal: () => getCartTotals(get().items).mrpTotal,
      discount: () => getCartTotals(get().items).discount,
      shipping: () => getCartTotals(get().items).shipping,
      total: () => getCartTotals(get().items).total,
    }),
    { name: 'bodywise-demo-cart', partialize: (state) => ({ items: state.items, couponCode: state.couponCode }) },
  ),
)

if (import.meta.env.DEV) {
  const sample = getCartTotals([{ productId: 'urea-body-lotion', qty: 1 }])
  console.assert(sample.subtotal === 449 && sample.shipping === 49 && sample.total === 498, 'Cart totals should include ₹49 shipping below ₹499')
  const freeShipping = getCartTotals([{ productId: 'biotin-gummies', qty: 1 }])
  console.assert(freeShipping.shipping === 0 && freeShipping.total === 499, 'Cart shipping should be free at ₹499')
}
