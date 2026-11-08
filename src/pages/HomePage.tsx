import { useState } from 'react'
import { ArrowRight, FlaskConical, HeartPulse, Leaf, Stethoscope, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products, type ProductCategory } from '../data/products'
import { reviews } from '../data/reviews'
import { ProductVisual } from '../components/ProductVisual'
import { ProductCard, productDiscount } from '../components/ProductCard'
import { HeroCarousel } from '../components/home/HeroCarousel'
import { Container } from '../components/ui/Container'

const categories: { title: string; description: string; query: ProductCategory; visual: 'roll-on' | 'tube' | 'gummy-jar' }[] = [
  { title: 'Hair Care', description: 'Hair Thinning | Frizz | Scalp Care', query: 'hair', visual: 'roll-on' },
  { title: 'Body Care', description: 'Body Acne | Odour | Dry Skin', query: 'body-care', visual: 'tube' },
  { title: 'Health & Fitness', description: 'Hair Nutrition | Daily Wellness', query: 'health-fitness', visual: 'gummy-jar' },
]
const tabs: { label: string; category?: ProductCategory }[] = [{ label: 'All' }, { label: 'Hair Care', category: 'hair' }, { label: 'Body Care', category: 'body-care' }, { label: 'Health & Fitness', category: 'health-fitness' }]

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="text-center"><h2 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">{title}</h2><p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p></div>
}

function CategoryTiles() {
  return <section className="mt-14 sm:mt-20"><SectionHeading title="Every Body Works Wonders" subtitle="We work to keep it that way" /><div className="mt-7 flex snap-x gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-3 sm:overflow-visible">
    {categories.map((category) => <Link key={category.title} to={`/shop?category=${category.query}`} className="group min-w-[246px] snap-start overflow-hidden rounded-card bg-background shadow-card transition hover:-translate-y-1 hover:shadow-lg sm:min-w-0"><ProductVisual visual={category.visual} className="h-44 w-full rounded-b-none sm:h-48" /><div className="p-4"><h3 className="font-semibold text-primary">{category.title}</h3><p className="mt-1 text-xs leading-5 text-muted">{category.description}</p></div></Link>)}
  </div></section>
}

function BestSellers() {
  const [activeTab, setActiveTab] = useState('All')
  const tab = tabs.find((item) => item.label === activeTab)
  const visibleProducts = tab?.category ? products.filter((product) => product.category === tab.category) : products
  return <section className="mt-14 sm:mt-20"><SectionHeading title="Best Sellers" subtitle="Browse our best sellers by type of your concerns" /><div className="mt-7 flex gap-2 overflow-x-auto pb-1 sm:justify-center">{tabs.map((item) => <button key={item.label} onClick={() => setActiveTab(item.label)} className={`whitespace-nowrap rounded-pill px-4 py-2 text-xs font-semibold transition-colors ${activeTab === item.label ? 'bg-primary text-background' : 'bg-sky text-primary hover:bg-accent-soft'}`}>{item.label}</button>)}</div><div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
}

function AppBanner() {
  return <section className="mt-14 overflow-hidden rounded-card bg-primary px-6 py-8 text-background sm:mt-20 sm:px-10 sm:py-10"><div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold tracking-[0.14em] text-accent-soft">BODYWISE ON THE GO</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Shop faster on the Bodywise app</h2><p className="mt-2 max-w-xl text-sm text-background/75">Discover your next routine, keep track of orders, and come back to what works for you.</p></div><div className="flex gap-2"><span className="rounded-lg border border-background/40 px-3 py-2 text-xs font-semibold">GET IT ON<br />Google Play</span><span className="rounded-lg border border-background/40 px-3 py-2 text-xs font-semibold">Download on the<br />App Store</span></div></div></section>
}

function Testimonials() {
  const [start, setStart] = useState(0)
  const visible = [reviews[start], reviews[(start + 1) % reviews.length], reviews[(start + 2) % reviews.length]]
  return <section className="mt-14 sm:mt-20"><SectionHeading title="Happy Women, Honest Reviews" subtitle="1L+ women have seen visible results from solutions that work with their bodies. When you win, we win." /><div className="mt-7 grid gap-4 md:grid-cols-3">{visible.map((review) => { const product = products.find((item) => item.id === review.productId)!; const discount = productDiscount(product); return <article key={`${review.name}-${review.productId}`} className="rounded-card bg-sky p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-background">{review.name.slice(0, 1)}</span><p className="text-sm font-semibold">{review.name} <span className="font-normal text-muted">| {review.age}, {review.city}</span></p></div><blockquote className="mt-4 min-h-16 text-sm leading-6 text-text">“{review.quote}”</blockquote><div className="mt-5 border-t border-accent-soft pt-4"><div className="flex items-center gap-2"><ProductVisual visual={product.visual} size="sm" className="h-12 w-12" /><div className="min-w-0"><p className="truncate text-xs font-semibold">{product.name}</p><p className="mt-1 text-xs font-bold text-primary">₹{product.price} <span className="font-normal text-muted line-through">₹{product.mrp}</span> {discount > 0 && <span className="ml-1 rounded-pill bg-background px-1.5 py-0.5 text-[9px] text-accent">{discount}% OFF</span>}</p></div></div><div className="mt-4 flex items-center justify-between gap-2"><span className="rounded-pill bg-background px-2 py-1 text-[10px] font-bold tracking-wide text-accent">FOR {review.concern.toUpperCase()}</span><Link to={`/product/${product.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">Learn More <ArrowRight size={13} /></Link></div></div></article> })}</div><div className="mt-5 flex justify-center gap-2"><button aria-label="Previous testimonials" onClick={() => setStart((current) => (current - 1 + reviews.length) % reviews.length)} className="rounded-pill border border-accent-soft px-4 py-2 text-xs font-semibold text-primary hover:bg-sky">Previous</button><button aria-label="Next testimonials" onClick={() => setStart((current) => (current + 1) % reviews.length)} className="rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-background hover:bg-accent">Next</button></div></section>
}

function TrustStrip() {
  const facts = [{ icon: Stethoscope, label: 'Developed by Doctors' }, { icon: FlaskConical, label: 'Backed by Science' }, { icon: Leaf, label: 'Cruelty-free' }, { icon: Truck, label: 'Free shipping over ₹499' }]
  return <section className="mt-14 border-y border-accent-soft/60 py-7 sm:mt-20"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{facts.map(({ icon: Icon, label }) => <div key={label} className="flex items-center justify-center gap-3 text-sm font-semibold text-primary"><Icon size={22} aria-hidden="true" /><span>{label}</span></div>)}</div></section>
}

export function HomePage() {
  return <main><Container><HeroCarousel /><CategoryTiles /><BestSellers /><AppBanner /><Testimonials /><TrustStrip /></Container></main>
}
