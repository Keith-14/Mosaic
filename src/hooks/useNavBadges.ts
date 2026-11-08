import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useJourneyStore } from '../store/journeyStore'
import { useOrderStore } from '../store/orderStore'
import { useTimeStore, now } from '../store/timeStore'
import { usage } from '../data/usage'

const WISHLAB_KEY = 'bodywise-wishlab-first-seen'
const WISHLAB_WINDOW_MS = 14 * 86_400_000 // 14 days

export type NavBadges = {
  journeyDue: boolean
  packsAttention: number
  wishlabNew: boolean
}

/**
 * Returns reactive badge counts for the nav.
 * Re-evaluates whenever the journey/order/auth stores or the dev time offset
 * changes — so ?dev=1 time travel always reflects in the UI.
 */
export function useNavBadges(): NavBadges {
  const user     = useAuthStore(s => s.currentUser)
  const journeys = useJourneyStore(s => s.journeys)
  const orders   = useOrderStore(s => s.orders)

  // Subscribe to the dev time offset so badges re-evaluate on time travel.
  const timeOffsetDays = useTimeStore(s => s.timeOffsetDays)

  // wishlabNew: set/read first-seen date in localStorage.
  // Re-evaluated whenever timeOffsetDays changes so dev time travel works.
  const [wishlabNew, setWishlabNew] = useState(false)
  useEffect(() => {
    let seen = localStorage.getItem(WISHLAB_KEY)
    if (!seen) {
      seen = now().toISOString()
      localStorage.setItem(WISHLAB_KEY, seen)
    }
    setWishlabNew(now().getTime() - new Date(seen).getTime() < WISHLAB_WINDOW_MS)
  }, [timeOffsetDays]) // re-run on every time-travel step

  return useMemo<NavBadges>(() => {
    // Logged-out visitors still see the Wishlab NEW chip
    if (!user) return { journeyDue: false, packsAttention: 0, wishlabNew }

    const nowMs = now().getTime()

    // Journey: due if any active journey has 0 check-ins and started > 7 days ago,
    //          OR has at least one check-in but the last one was > 7 days ago.
    const journeyDue = journeys.some(j => {
      if (j.userId !== user.id || j.status !== 'active') return false
      const lastActivity =
        j.checkins.length === 0
          ? new Date(j.startedAt).getTime()
          : new Date(j.checkins[j.checkins.length - 1].createdAt).getTime()
      return nowMs - lastActivity > 7 * 86_400_000
    })

    // Packs: count packs that are "Running low" (< 20 days) OR "Refill now" (<= 10 days).
    // The spec says count pill = status "Running low" OR "Refill now", threshold < 20.
    const packsAttention = orders
      .filter(o => o.userId === user.id)
      .flatMap(o => o.items.map(i => ({ item: i, order: o })))
      .filter(({ item, order }) => {
        const durationDays = usage[item.productId]?.packDurationDays ?? 30
        const daysRemaining =
          durationDays - (nowMs - new Date(order.createdAt).getTime()) / 86_400_000
        return daysRemaining < 20 // "Running low" or "Refill now"
      }).length

    return { journeyDue, packsAttention, wishlabNew }
  }, [user, journeys, orders, timeOffsetDays, wishlabNew])
}
