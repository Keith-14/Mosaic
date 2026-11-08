import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Lock, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Logo } from './Logo'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useNotificationStore } from '../../store/notificationStore'
import { navItems } from '../../config/nav'
import { useNavBadges } from '../../hooks/useNavBadges'

// ─── NavLink item (shared by desktop nav + mobile drawer) ─────────────────────
function NavItem({
  item,
  mobile = false,
  onNavigate,
}: {
  item: (typeof navItems)[number]
  mobile?: boolean
  onNavigate?: () => void
}) {
  const user = useAuthStore(s => s.currentUser)
  const badges = useNavBadges()
  const loc = useLocation()

  const lock   = !!item.requiresAuth && !user
  const to     = lock ? '/login' : item.to
  const state  = lock ? { from: item.to } : undefined
  const due    = item.badgeKey === 'journey' && badges.journeyDue
  const count  = item.badgeKey === 'packs' ? badges.packsAttention : 0
  const isNew  = item.badgeKey === 'wishlab' && badges.wishlabNew

  const ariaLabel = [
    item.label,
    due   ? ', check-in due'                   : '',
    count ? `, ${count} packs need attention`  : '',
    lock  ? ', login required'                 : '',
  ].join('')

  const isActive = loc.pathname === item.to || loc.pathname.startsWith(item.to + '/')

  return (
    <NavLink
      to={to}
      state={state}
      onClick={onNavigate}
      aria-label={ariaLabel}
      className={() =>
        [
          'relative inline-flex items-center gap-1 whitespace-nowrap font-medium',
          'transition-colors hover:text-accent focus-visible:outline-none',
          mobile ? 'py-3 text-base' : 'py-2 text-sm',
          isActive
            ? 'text-primary underline decoration-accent decoration-2 underline-offset-[6px]'
            : 'text-text',
        ].join(' ')
      }
    >
      <span>{item.label}</span>
      {lock  && <Lock aria-hidden size={13} />}
      {due   && <i aria-hidden className="h-2 w-2 rounded-full bg-accent" />}
      {count > 0 && (
        <i aria-hidden className="rounded-pill bg-accent px-1 text-[10px] not-italic text-background">
          {count}
        </i>
      )}
      {isNew && (
        <i aria-hidden className="rounded-pill bg-sky px-1 text-[9px] not-italic text-accent">
          NEW
        </i>
      )}
    </NavLink>
  )
}

// ─── Search flyout ─────────────────────────────────────────────────────────────
function SearchFlyout({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) nav(`/shop?q=${encodeURIComponent(q.trim())}`)
    onClose()
  }

  return (
    <div className="absolute inset-x-0 top-full z-50 border-b border-accent-soft bg-background shadow-card">
      <Container>
        <form onSubmit={submit} className="flex items-center gap-3 py-3">
          <Search size={18} className="shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search products…"
            className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="Clear search">
              <X size={16} className="text-muted" />
            </button>
          )}
          <button
            type="submit"
            className="rounded-pill bg-primary px-4 py-1.5 text-xs font-bold text-background"
          >
            Go
          </button>
        </form>
      </Container>
    </div>
  )
}

// ─── Notifications dropdown ────────────────────────────────────────────────────
function NotificationsDropdown({
  userId,
  onClose,
}: {
  userId: string
  onClose: () => void
}) {
  const all  = useNotificationStore(s => s.notifications)
  const mark = useNotificationStore(s => s.read)
  const ref  = useRef<HTMLDivElement>(null)

  const notes = useMemo(
    () => all.filter(n => n.userId === userId).slice(0, 8),
    [all, userId],
  )

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-1 w-80 rounded-card bg-background shadow-card ring-1 ring-accent-soft/40"
    >
      <div className="flex items-center justify-between border-b border-accent-soft px-4 py-3">
        <span className="text-sm font-semibold text-primary">Notifications</span>
        <button onClick={onClose} aria-label="Close notifications">
          <X size={15} className="text-muted" />
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted">No notifications yet</p>
      ) : (
        <ul className="max-h-80 divide-y divide-accent-soft overflow-y-auto">
          {notes.map(n => (
            <li key={n.id}>
              <Link
                to={n.link}
                onClick={() => { mark(n.id); onClose() }}
                className={`block px-4 py-3 text-sm transition-colors hover:bg-sky ${n.read ? 'opacity-60' : ''}`}
              >
                <p className={`font-medium ${n.read ? 'text-muted' : 'text-primary'}`}>
                  {!n.read && (
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-badge align-middle" />
                  )}
                  {n.title}
                </p>
                <p className="mt-0.5 text-muted">{n.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Account dropdown ──────────────────────────────────────────────────────────
function AccountDropdown({ firstName, onLogout }: { firstName: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 text-sm font-medium text-primary"
      >
        <User size={18} aria-hidden />
        <span>Hi, {firstName}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-card bg-background p-1 shadow-card ring-1 ring-accent-soft/40">
          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm transition-colors hover:bg-sky"
          >
            My Orders
          </Link>
          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm transition-colors hover:bg-sky"
          >
            Account
          </Link>
          <button
            onClick={() => { onLogout(); setOpen(false) }}
            className="block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-sky"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Header ───────────────────────────────────────────────────────────────
export function Header() {
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [notifOpen,  setNotifOpen]    = useState(false)
  const drawerRef = useRef<HTMLElement>(null)

  const user   = useAuthStore(s => s.currentUser)
  const logout = useAuthStore(s => s.logout)
  const cart   = useCartStore(s => s.count?.() ?? 0)
  const all    = useNotificationStore(s => s.notifications)

  const firstName = user?.name.split(' ')[0] ?? ''

  const unread = useMemo(
    () => all.some(n => n.userId === user?.id && !n.read),
    [all, user?.id],
  )

  // Esc closes drawer / search / notif
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        setSearchOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Focus trap for drawer
  useEffect(() => {
    if (!drawerOpen) return
    const el = drawerRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
    )
    focusable[0]?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-accent-soft/60 bg-background">
      {/*
        Mobile layout: hamburger | [logo centered absolutely] | icons
        Desktop layout: logo | nav | icons  (all in normal flow)
      */}
      <Container className="relative flex h-16 items-center justify-between md:h-[72px]">

        {/* ── Left: hamburger (mobile-only) ── */}
        <div className="flex items-center">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="p-2 lg:hidden"
          >
            <Menu />
          </button>
          {/* Logo: hidden on mobile (shown centered below), visible on desktop */}
          <div className="hidden lg:block">
            <Logo />
          </div>
        </div>

        {/* Logo centered on mobile via absolute positioning */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
          <Logo />
        </div>

        {/* ── Center: desktop nav ── */}
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navItems.map(item => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* ── Right: search, bell, cart, account ── */}
        <div className="flex items-center gap-1 text-primary">

          {/* Search */}
          <button
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => { setSearchOpen(o => !o); setNotifOpen(false) }}
            className="p-2"
          >
            <Search size={20} />
          </button>

          {/* Bell */}
          <div className="relative">
            <button
              aria-label={unread ? 'Notifications, unread' : 'Notifications'}
              aria-expanded={notifOpen}
              onClick={() => { setNotifOpen(o => !o); setSearchOpen(false) }}
              className="relative p-2"
            >
              <Bell size={20} />
              {unread && (
                <i aria-hidden className="absolute right-1 top-1 h-2 w-2 rounded-full bg-badge" />
              )}
            </button>

            {notifOpen && user && (
              <NotificationsDropdown
                userId={user.id}
                onClose={() => setNotifOpen(false)}
              />
            )}
          </div>

          {/* Cart */}
          <button
            onClick={() => useCartStore.getState().open()}
            aria-label={`Cart, ${cart} item${cart !== 1 ? 's' : ''}`}
            className="relative p-2"
          >
            <ShoppingBag size={20} />
            {cart > 0 && (
              <i aria-hidden className="absolute right-0 top-0 rounded-full bg-badge px-1 text-[9px] not-italic text-background">
                {cart}
              </i>
            )}
          </button>

          {/* Account control – desktop only */}
          <div className="hidden lg:block">
            {user ? (
              <AccountDropdown firstName={firstName} onLogout={logout} />
            ) : (
              <div className="ml-1 flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-primary">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-pill border border-primary px-3 py-1.5 text-xs font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Search flyout – spans full width below the header bar */}
      {searchOpen && <SearchFlyout onClose={() => setSearchOpen(false)} />}

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            onClick={closeDrawer}
            aria-label="Close menu"
            className="absolute inset-0 bg-primary/35"
            tabIndex={-1}
          />
          <aside
            ref={drawerRef}
            className="relative flex h-full w-[84vw] max-w-sm flex-col overflow-y-auto bg-background p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={closeDrawer} aria-label="Close menu" className="p-1">
                <X />
              </button>
            </div>

            <div className="mt-5">
              {user ? (
                <p className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <User size={18} aria-hidden /> Hi, {firstName}
                </p>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={closeDrawer}
                    className="rounded-pill bg-primary px-4 py-2 text-xs font-medium text-background"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeDrawer}
                    className="rounded-pill border border-primary px-4 py-2 text-xs font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            <nav aria-label="Mobile navigation" className="mt-6 flex flex-col border-t border-accent-soft/50 pt-2">
              {navItems.map(item => (
                <NavItem key={item.label} item={item} mobile onNavigate={closeDrawer} />
              ))}
            </nav>

            {user && (
              <div className="mt-2 flex flex-col border-t border-accent-soft/50 pt-2">
                <Link to="/orders" onClick={closeDrawer} className="py-3 text-sm text-text hover:text-accent">
                  My Orders
                </Link>
                <Link to="/account" onClick={closeDrawer} className="py-3 text-sm text-text hover:text-accent">
                  Account
                </Link>
                <button
                  onClick={() => { logout(); closeDrawer() }}
                  className="py-3 text-left text-sm text-text hover:text-accent"
                >
                  Log out
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </header>
  )
}
