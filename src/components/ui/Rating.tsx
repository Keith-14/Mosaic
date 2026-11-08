import { Star } from 'lucide-react'

export function Rating({ value, className = '' }: { value: number; className?: string }) {
  return <span className={`inline-flex items-center gap-1 text-sm font-semibold text-text ${className}`} aria-label={`${value} out of 5 stars`}><Star size={15} className="fill-accent text-accent" aria-hidden="true" />{value.toFixed(1)}</span>
}
