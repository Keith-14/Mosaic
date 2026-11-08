import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Bell, ChevronDown, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Logo } from './Logo'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { products } from '../../data/products'
import { useNotificationStore } from '../../store/notificationStore'

const topLinks = [
  { to: '/shop', label: 'Build Your Own Kit' },
  { to: '/shop', label: 'Shop All' },
  { to: '/shop', label: 'Honest Reports' },
]
const categoryLinks = ['Hair', 'Body Care', 'Health & Fitness']

function NavItem({ to, children, onClick }: { to: string; children: ReactNode; onClick?: () => void }) {
  return <NavLink to={to} onClick={onClick} className={({ isActive }) => `rounded-sm py-2 text-sm font-medium transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-text'}`}>{children}</NavLink>
}

function CategoryMenu() {
  return (
    <div className="group relative">
      <button type="button" className="inline-flex items-center gap-1 rounded-sm py-2 text-sm font-medium text-text hover:text-accent" aria-haspopup="true">
        Shop By Category <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-48 translate-y-1 rounded-card border border-accent-soft bg-background p-2 opacity-0 shadow-card transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {categoryLinks.map((category) => <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`} className="block rounded-lg px-3 py-2 text-sm text-text hover:bg-sky hover:text-accent">{category}</Link>)}
      </div>
    </div>
  )
}

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)
  // Defensive fallbacks keep older persisted demo data from breaking a fresh build.
  const cartCount = useCartStore((state) => state.count?.() ?? state.items?.reduce((total, item) => total + (item.qty || 0), 0) ?? 0)
  const firstName = currentUser?.name.split(' ')[0] ?? null
  const allNotifications = useNotificationStore((state) => state.notifications)
  const notifications = useMemo(
    () => currentUser ? (allNotifications ?? []).filter((item) => item.userId === currentUser.id) : [],
    [allNotifications, currentUser?.id],
  )
  const markRead = useNotificationStore((state) => state.read)

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => event.key === 'Escape' && setDrawerOpen(false)
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [])

  const closeDrawer = () => setDrawerOpen(false)
  return (
    <header className="sticky top-0 z-40 border-b border-accent-soft/60 bg-background">
      <Container className="flex h-16 items-center justify-between gap-3 md:h-[72px]">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" aria-label="Open navigation menu" onClick={() => setDrawerOpen(true)} className="rounded-full p-2 text-primary hover:bg-sky lg:hidden"><Menu size={22} /></button>
          <Logo />
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-5 xl:gap-7 lg:flex" aria-label="Primary navigation">
          <NavItem to="/shop">Build Your Own Kit</NavItem>
          <CategoryMenu />
          {topLinks.slice(1).map((link) => <NavItem key={link.label} to={link.to}>{link.label}</NavItem>)}
          {firstName ? (
            <div className="relative">
              <button type="button" onClick={() => setAccountOpen((open) => !open)} className="inline-flex items-center gap-1 rounded-sm py-2 text-sm font-medium text-text hover:text-accent" aria-expanded={accountOpen}>Hi, {firstName} <ChevronDown size={14} /></button>
              {accountOpen && <div className="absolute right-0 top-full z-50 w-40 rounded-card border border-accent-soft bg-background p-2 shadow-card"><Link to="/journey" className="block rounded-lg px-3 py-2 text-sm hover:bg-sky">My Journey</Link><Link to="/my-packs" className="block rounded-lg px-3 py-2 text-sm hover:bg-sky">My Packs</Link><Link to="/wishlab" className="block rounded-lg px-3 py-2 text-sm hover:bg-sky">Wishlab</Link><Link to="/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-sky">My orders</Link><Link to="/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-sky">Account</Link><button type="button" onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-sky">Log out</button></div>}
            </div>
          ) : <NavItem to="/login">Login</NavItem>}
        </nav>
        <div className="flex items-center gap-0.5 text-primary sm:gap-1">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search products" className="rounded-full p-2 hover:bg-sky"><Search size={20} /></button>
          <div className="relative"><button type="button" onClick={()=>setNotificationsOpen(!notificationsOpen)} aria-label="Notifications" className="relative rounded-full p-2 hover:bg-sky"><Bell size={20}/>{notifications.some(n=>!n.read)&&<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-badge"/>}</button>{notificationsOpen&&<div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-card border border-accent-soft bg-background p-2 shadow-card">{notifications.length?notifications.map(n=><Link key={n.id} to={n.link} onClick={()=>{markRead(n.id);setNotificationsOpen(false)}} className={`block rounded-lg p-3 text-sm hover:bg-sky ${n.read?'text-muted':'text-text'}`}><b>{n.title}</b><br/><span className="text-xs">{n.body}</span></Link>):<p className="p-3 text-sm text-muted">No notifications yet.</p>}</div>}</div>
          <Link to={firstName ? '/account' : '/login'} aria-label="Account" className="rounded-full p-2 hover:bg-sky"><UserRound size={20} /></Link>
          <button type="button" onClick={() => useCartStore.getState().open()} aria-label={`Cart, ${cartCount} items`} className="relative rounded-full p-2 hover:bg-sky"><ShoppingBag size={20} />{cartCount > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-badge px-1 text-[9px] font-bold text-background">{cartCount}</span>}</button>
        </div>
      </Container>

      {searchOpen && <div className="fixed inset-0 z-50 bg-primary/35 p-4"><div className="mx-auto mt-12 max-w-xl rounded-card bg-background p-5 shadow-card" role="dialog" aria-modal="true" aria-label="Search products"><div className="flex gap-2"><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){window.location.href=`/shop?q=${encodeURIComponent(search)}`}}} placeholder="Search products" className="flex-1 rounded-pill border border-accent-soft px-4 py-2 text-sm"/><button onClick={()=>setSearchOpen(false)} aria-label="Close search" className="p-2"><X size={20}/></button></div><div className="mt-3">{products.filter(p=>`${p.name} ${p.concern}`.toLowerCase().includes(search.toLowerCase())).map(p=><Link key={p.id} to={`/product/${p.slug}`} onClick={()=>setSearchOpen(false)} className="block rounded-lg px-3 py-3 text-sm hover:bg-sky">{p.name}<span className="ml-2 text-xs text-muted">{p.concern}</span></Link>)}</div></div></div>}

      {drawerOpen && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <button type="button" aria-label="Close navigation menu" onClick={closeDrawer} className="absolute inset-0 cursor-default bg-primary/35" />
        <div className="relative flex h-full w-[min(84vw,340px)] flex-col bg-background p-5 shadow-card">
          <div className="flex items-center justify-between"><Logo onClick={closeDrawer} /><button type="button" aria-label="Close navigation menu" onClick={closeDrawer} className="rounded-full p-2 text-primary hover:bg-sky"><X size={21} /></button></div>
          <nav className="mt-8 flex flex-col divide-y divide-accent-soft/60" aria-label="Mobile primary navigation">
            <NavItem to="/shop" onClick={closeDrawer}>Build Your Own Kit</NavItem>
            <div className="py-3"><p className="text-sm font-medium text-text">Shop By Category</p><div className="mt-2 flex flex-col gap-1 pl-3">{categoryLinks.map((category) => <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`} onClick={closeDrawer} className="py-1.5 text-sm text-muted hover:text-accent">{category}</Link>)}</div></div>
            {topLinks.slice(1).map((link) => <NavItem key={link.label} to={link.to} onClick={closeDrawer}>{link.label}</NavItem>)}
            <NavItem to={firstName ? '/account' : '/login'} onClick={closeDrawer}>{firstName ? `Hi, ${firstName}` : 'Login'}</NavItem>
          </nav>
        </div>
      </div>}
    </header>
  )
}
