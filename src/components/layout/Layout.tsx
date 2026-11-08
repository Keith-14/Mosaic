import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastViewport } from '../ui/Toast'
import { CartDrawer } from '../CartDrawer'
import { Seo } from '../Seo'
import { DevTools } from '../DevTools'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [pathname])
  return null
}

export function Layout() {
  const { pathname } = useLocation()
  return <div className="flex min-h-screen flex-col"><Seo /><ScrollToTop /><AnnouncementBar /><Header /><div key={pathname} className="page-enter"><Outlet /></div><Footer /><CartDrawer /><ToastViewport /><DevTools /></div>
}
