import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductVisual } from '../ProductVisual'

const slides = [
  { visual: 'tube' as const, eyebrow: 'BODY CARE ESSENTIALS', copy: <>Dry skin&apos;s best kept secret—<em>Urea</em></>, to: '/product/10-percent-urea-body-lotion' },
  { visual: 'pump-bottle' as const, eyebrow: 'A ROUTINE THAT LISTENS', copy: <>Find the right <em>science-backed</em> routine for your body</>, to: '/shop?category=body-care' },
  { visual: 'tube' as const, eyebrow: 'MOISTURE, MADE SIMPLE', copy: <><em>Dry skin?</em> Bring 10% Urea Body Lotion into your routine</>, to: '/product/10-percent-urea-body-lotion' },
  { visual: 'roll-on' as const, eyebrow: 'HAIR CARE, YOUR WAY', copy: <>Give your scalp a little <em>everyday care</em></>, to: '/product/advanced-hair-growth-serum-roll-on' },
  { visual: 'gummy-jar' as const, eyebrow: 'WELLNESS IN A CHEW', copy: <>Small daily rituals, <em>feel-good</em> consistency</>, to: '/product/biotin-hair-gummies' },
]

export function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)
  const go = (direction: 1 | -1) => setActive((current) => (current + direction + slides.length) % slides.length)
  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => go(1), 5000)
    return () => window.clearInterval(timer)
  }, [paused])

  return (
    <section className="pt-5 sm:pt-8" aria-label="Featured products" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="overflow-hidden" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }} onTouchEnd={(event) => { if (touchStart.current === null) return; const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 35) go(delta < 0 ? 1 : -1); touchStart.current = null }}>
        <div className="flex gap-4 transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${active} * (100% - 2rem)))` }}>
          {slides.map((slide, index) => <article key={slide.eyebrow} aria-hidden={index !== active} className="flex w-[calc(100%-0rem)] shrink-0 flex-col-reverse overflow-hidden rounded-card bg-[linear-gradient(125deg,var(--color-sky),var(--color-bg),var(--color-accent-soft))] p-5 sm:w-[calc(100%-2rem)] sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10">
            <div className="max-w-xl"><p className="text-[10px] font-bold tracking-[0.14em] text-accent sm:text-xs">{slide.eyebrow}</p><h1 className="mt-3 text-3xl font-light leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">{slide.copy}</h1><Link className="mt-6 inline-flex h-11 items-center rounded-pill bg-primary px-5 text-xs font-bold tracking-[0.08em] text-background transition-colors hover:bg-accent" to={slide.to} tabIndex={index === active ? 0 : -1}>SHOP NOW</Link></div>
            <ProductVisual visual={slide.visual} size="lg" className="mb-2 h-44 w-44 self-end bg-background/45 sm:mb-0 sm:h-64 sm:w-64 lg:h-72 lg:w-72" />
          </article>)}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3"><button aria-label="Previous slide" onClick={() => go(-1)} className="grid h-9 w-9 place-items-center rounded-full bg-background text-accent shadow-card hover:bg-sky"><ChevronLeft size={18} /></button><div className="flex gap-1.5" role="tablist" aria-label="Choose slide">{slides.map((slide, index) => <button key={slide.eyebrow} aria-label={`Show slide ${index + 1}`} aria-selected={active === index} role="tab" onClick={() => setActive(index)} className={`h-2.5 rounded-pill transition-all ${active === index ? 'w-7 bg-accent' : 'w-2.5 bg-accent-soft'}`} />)}</div><button aria-label="Next slide" onClick={() => go(1)} className="grid h-9 w-9 place-items-center rounded-full bg-background text-accent shadow-card hover:bg-sky"><ChevronRight size={18} /></button></div>
    </section>
  )
}
