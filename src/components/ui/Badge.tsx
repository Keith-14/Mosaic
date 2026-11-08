import type { PropsWithChildren } from 'react'

export function DiscountBadge({ children }: PropsWithChildren) {
  return (
    <span className="badge-starburst inline-flex h-16 w-16 items-center justify-center bg-badge px-2 text-center text-[10px] font-bold leading-tight text-background" aria-label={`Discount: ${String(children)}`}>
      {children}
    </span>
  )
}

export function TagBadge({ children }: PropsWithChildren) {
  return <span className="inline-flex rounded-pill bg-sky px-3 py-1 text-xs font-semibold text-primary">{children}</span>
}
