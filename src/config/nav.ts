import { Activity, Package, ShoppingBag, Sparkles, type LucideIcon } from 'lucide-react'

export type BadgeKey = 'journey' | 'packs' | 'wishlab'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  requiresAuth?: boolean
  /** Which badge slot this item uses, if any */
  badgeKey?: BadgeKey
}

export const navItems: NavItem[] = [
  { label: 'Shop',       to: '/shop',     icon: ShoppingBag },
  { label: 'My Journey', to: '/journey',  icon: Activity,  badgeKey: 'journey' },
  { label: 'My Packs',   to: '/my-packs', icon: Package,   badgeKey: 'packs', requiresAuth: true },
  { label: 'Wishlab',    to: '/wishlab',  icon: Sparkles,  badgeKey: 'wishlab' },
]
