import { Link } from 'react-router-dom'

export function Logo({ light = false, onClick }: { light?: boolean; onClick?: () => void }) {
  const color = light ? 'text-background' : 'text-primary'
  return (
    <Link to="/" onClick={onClick} className={`inline-flex flex-col leading-none ${color}`} aria-label="Bodywise Demo home">
      <span className="mb-0.5 text-[8px] font-bold tracking-[0.22em]">BE</span>
      <span className="font-serif text-2xl font-medium tracking-tight">Bodywise<sup className="ml-0.5 align-top text-[8px]">™</sup></span>
    </Link>
  )
}
