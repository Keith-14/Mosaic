import { Link, useNavigate } from 'react-router-dom'
import { ProductVisual } from './ProductVisual'
import { Rating } from './ui/Rating'
import { TagBadge } from './ui/Badge'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import type { Product } from '../data/products'
import { CostPerUse } from './CostPerUse'

export function productDiscount(product: Pick<Product, 'price' | 'mrp'>) {
  return product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0
}

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const push = useToastStore((state) => state.push)
  const discount = productDiscount(product)
  const add = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (product.variants) { navigate(`/product/${product.slug}`); return }
    addItem({ productId: product.id })
    useCartStore.getState().open()
    push(`${product.name} added to cart`)
  }
  const openProduct = () => navigate(`/product/${product.slug}`)

  return (
    <article className="group cursor-pointer rounded-card bg-background p-2 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg" onClick={openProduct} onKeyDown={(event) => { if (event.key === 'Enter') openProduct() }} tabIndex={0} aria-label={`View ${product.name}`}>
      <ProductVisual visual={product.visual} className="h-auto w-full aspect-square" />
      <div className="px-2 pb-2 pt-3">
        <TagBadge>{product.concern}</TagBadge>
        <Link to={`/product/${product.slug}`} onClick={(event) => event.stopPropagation()} className="mt-2 block text-sm font-semibold leading-5 text-text hover:text-accent sm:text-base">{product.name}</Link>
        <p className="mt-1 min-h-5 text-xs text-muted">{product.size}, {product.heroIngredient}</p>
        <CostPerUse productId={product.id} price={product.price} />
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-base font-bold text-primary">₹{product.price}</span>{product.mrp > product.price && <><span className="text-xs text-muted line-through">₹{product.mrp}</span><span className="rounded-pill bg-sky px-2 py-0.5 text-[10px] font-bold text-accent">{discount}% OFF</span></>}</div>
        <div className="mt-2 flex items-center justify-between gap-2"><Rating value={product.rating} /><button type="button" onClick={add} className="rounded-pill bg-primary px-3 py-1.5 text-[11px] font-bold tracking-wide text-background transition-colors hover:bg-accent">{product.variants ? `${product.variants.length} OPTIONS` : 'ADD'}</button></div>
      </div>
    </article>
  )
}
