import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const storageKey = 'bodywise-demo-announcement-dismissed'

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(sessionStorage.getItem(storageKey) !== 'true')
  }, [])

  if (!visible) return null
  const dismiss = () => {
    sessionStorage.setItem(storageKey, 'true')
    setVisible(false)
  }

  return (
    <aside className="relative bg-promo px-12 py-2 text-center text-xs font-medium text-background sm:text-sm" aria-label="Promotion">
      <span>Use BB Wallet and save upto 30%</span>
      <button type="button" className="ml-2 rounded-pill bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-promo transition-opacity hover:opacity-90" onClick={() => undefined}>Download APP</button>
      <button type="button" aria-label="Dismiss promotion" onClick={dismiss} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-background/15"><X size={16} /></button>
    </aside>
  )
}
