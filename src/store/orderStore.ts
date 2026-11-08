import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProductById } from '../data/products'
import { getCartTotals, type CartItem } from './cartStore'
import type { Address } from './authStore'
import { useJourneyStore } from './journeyStore'
import { useNotificationStore } from './notificationStore'
import { now } from './timeStore'

export type OrderItem = CartItem & { name: string; price: number; mrp: number }
export type Order = { id: string; userId: string; createdAt: string; items: OrderItem[]; address: Address; subtotal: number; shipping: number; total: number; status: 'Confirmed' }

type OrderState = { orders: Order[]; placeOrder: (userId: string, items: CartItem[], address: Address) => Order; getOrdersByUser: (userId: string) => Order[] }
const orderId = () => `BW${Math.floor(10000000 + Math.random() * 90000000)}`

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: (userId, items, address) => {
        const totals = getCartTotals(items)
        const order: Order = {
          id: orderId(), userId, createdAt: now().toISOString(), address, subtotal: totals.subtotal, shipping: totals.shipping, total: totals.total, status: 'Confirmed',
          items: items.map((item) => {
            const product = getProductById(item.productId)
            const variant = product?.variants?.find((candidate) => candidate.label === item.variantLabel)
            return { ...item, name: product?.name ?? 'Product', price: variant?.price ?? product?.price ?? 0, mrp: variant?.mrp ?? product?.mrp ?? 0 }
          }),
        }
        set((state) => ({ orders: [order, ...state.orders] }))
        Array.from(new Set(items.map((item) => item.productId))).forEach((productId) => useJourneyStore.getState().startJourney(userId, productId))
        useNotificationStore.getState().add({userId,type:'system',title:'Your journey is ready',body:'Your purchase has a routine ready when you are.',link:'/orders'})
        return order
      },
      getOrdersByUser: (userId) => get().orders.filter((order) => order.userId === userId),
    }),
    { name: 'bodywise-demo-orders' },
  ),
)
