import { Home, Lock } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { navItems } from '../../config/nav'
import { useAuthStore } from '../../store/authStore'
import { useNavBadges } from '../../hooks/useNavBadges'

/** Routes where the bottom tab bar should be hidden */
const HIDDEN_ON = ['/checkout', '/login', '/signup']

export function BottomTabs() {
  const { pathname } = useLocation()
  const user   = useAuthStore(s => s.currentUser)
  const badges = useNavBadges()

  // hide on checkout / auth pages and order-success deep routes
  if (HIDDEN_ON.includes(pathname) || pathname.startsWith('/order-success/')) return null

  const tabs = [
    { label: 'Home', to: '/', icon: Home, end: true } as const,
    ...navItems,
  ]

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-accent-soft bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {tabs.map(tab => {
        const Icon  = tab.icon
        const lock  = 'requiresAuth' in tab && tab.requiresAuth && !user
        const to    = lock ? '/login' : tab.to
        const state = lock ? { from: tab.to } : undefined

        const badgeKey = 'badgeKey' in tab ? tab.badgeKey : undefined
        const due      = badgeKey === 'journey' && badges.journeyDue
        const count    = badgeKey === 'packs'   ? badges.packsAttention : 0
        const isNew    = badgeKey === 'wishlab' && badges.wishlabNew

        const ariaLabel = [
          tab.label,
          due   ? ', check-in due'                  : '',
          count ? `, ${count} packs need attention` : '',
          lock  ? ', login required'                : '',
        ].join('')

        return (
          <NavLink
            key={tab.label}
            to={to}
            state={state}
            end={'end' in tab ? tab.end : false}
            aria-label={ariaLabel}
            className={({ isActive }) =>
              `relative flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition-colors ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            {/* Icon + dot/count badges */}
            <span className="relative">
              <Icon size={19} aria-hidden />

              {/* Journey: due dot */}
              {due && (
                <i aria-hidden className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" />
              )}

              {/* Packs: count pill */}
              {count > 0 && (
                <i aria-hidden className="absolute -right-3 -top-2 rounded-pill bg-accent px-1 text-[9px] not-italic text-background">
                  {count}
                </i>
              )}

              {/* Wishlab: NEW chip */}
              {isNew && (
                <i aria-hidden className="absolute -right-4 -top-2 rounded-pill bg-sky px-1 text-[8px] not-italic text-accent">
                  NEW
                </i>
              )}
            </span>

            <span>{tab.label}</span>

            {/* Lock icon for protected tabs when logged out */}
            {lock && (
              <Lock aria-hidden size={10} className="absolute right-1 top-1" />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
