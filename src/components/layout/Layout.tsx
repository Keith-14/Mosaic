import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { BottomTabs } from './BottomTabs'
import { ToastViewport } from '../ui/Toast'
import { CartDrawer } from '../CartDrawer'
import { Seo } from '../Seo'
import { DevTools } from '../DevTools'

/** Routes where the bottom tab bar is hidden (keep in sync with BottomTabs) */
const TAB_HIDDEN_ON = ['/checkout', '/login', '/signup']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [pathname])
  return null
}

export function Layout() {
  const { pathname } = useLocation()

  // Add bottom padding on mobile so content is never hidden behind the tab bar.
  // The tab bar is ~56px + safe-area inset. Use pb-[calc(3.5rem+env(safe-area-inset-bottom))].
  const showTabs = !TAB_HIDDEN_ON.includes(pathname) && !pathname.startsWith('/order-success/')

  return (
    <div className="flex min-h-screen flex-col">
      <Seo />
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      {/* On mobile: add bottom padding so content clears the sticky tab bar */}
      <div
        key={pathname}
        className={`page-enter flex-1 ${showTabs ? 'pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0' : ''}`}
      >
        <Outlet />
      </div>
      <Footer />
      <BottomTabs />
      <CartDrawer />
      <ToastViewport />
      <DevTools />
    </div>
  )
}
