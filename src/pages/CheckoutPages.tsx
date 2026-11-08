import { useState, useMemo } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { useAuthStore, type Address } from '../store/authStore'
import { useCartStore, getCartTotals } from '../store/cartStore'
import { useOrderStore } from '../store/orderStore'
import { getProductById } from '../data/products'

function Summary() {
  const items = useCartStore(s => s.items)
  const t = getCartTotals(items)
  return (
    <aside className="rounded-card bg-sky p-5">
      <h2 className="font-semibold text-primary">Order summary</h2>
      <div className="mt-3 space-y-2">
        {items.map(i => {
          const p = getProductById(i.productId)!
          const v = p.variants?.find(x => x.label === i.variantLabel)
          return (
            <p key={i.productId + i.variantLabel} className="flex justify-between text-sm">
              <span>{p.name} × {i.qty}</span>
              <b>₹{(v?.price ?? p.price) * i.qty}</b>
            </p>
          )
        })}
      </div>
      <div className="mt-4 border-t border-accent-soft pt-3 text-sm">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{t.subtotal}</span>
        </p>
        <p className="mt-1 flex justify-between">
          <span>Shipping</span>
          <span>{t.shipping ? '₹' + t.shipping : 'FREE'}</span>
        </p>
        <p className="mt-2 flex justify-between text-base font-bold text-primary">
          <span>Total</span>
          <span>₹{t.total}</span>
        </p>
      </div>
    </aside>
  )
}

export function CheckoutPage() {
  const user = useAuthStore(s => s.currentUser)!
  const items = useCartStore(s => s.items)
  const clear = useCartStore(s => s.clear)
  const place = useOrderStore(s => s.placeOrder)
  const add = useAuthStore(s => s.addAddress)
  const nav = useNavigate()
  const saved = user.addresses[0]
  const [form, setForm] = useState<Omit<Address, 'id'>>(
    saved
      ? {
          fullName: saved.fullName,
          phone: saved.phone,
          line1: saved.line1,
          line2: saved.line2 ?? '',
          pincode: saved.pincode,
          city: saved.city,
          state: saved.state,
        }
      : { fullName: user.name, phone: user.phone, line1: '', line2: '', pincode: '', city: '', state: '' },
  )
  const [save, setSave] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!items.length) return <Navigate to="/shop" replace />

  const valid = Object.values(form).every(x => x !== '' || x === form.line2)
  const submit = () => {
    if (!valid) return
    setLoading(true)
    setTimeout(() => {
      const order = place(user.id, items, { ...form, id: 'delivery' })
      if (save) add(form)
      clear()
      nav(`/order-success/${order.id}`)
    }, 1000)
  }

  return (
    <main className="py-8">
      <Container>
        <h1 className="text-3xl font-semibold text-primary">Checkout</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <section className="space-y-5">
            <div className="rounded-card border border-accent-soft p-5">
              <h2 className="font-semibold">Delivery address</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(form).map(([k, v]) => (
                  <input
                    key={k}
                    value={v}
                    placeholder={k.replace(/([A-Z])/g, ' $1')}
                    onChange={e => setForm({ ...form, [k]: e.target.value })}
                    className="rounded-card border border-accent-soft px-3 py-2.5 text-sm sm:col-span-1"
                  />
                ))}
              </div>
              <label className="mt-4 flex gap-2 text-sm">
                <input type="checkbox" checked={save} onChange={e => setSave(e.target.checked)} />
                Save this address
              </label>
            </div>
            <div className="rounded-card border border-accent-soft p-5">
              <h2 className="font-semibold">Delivery method</h2>
              <p className="mt-2 text-sm text-muted">Standard delivery · usually 3–5 days</p>
            </div>
            <p className="rounded-card bg-sky p-4 text-sm text-primary">
              This is a demo store. No payment is collected.
            </p>
          </section>
          <div>
            <Summary />
            <button
              disabled={!valid || loading}
              onClick={submit}
              className="mt-4 w-full rounded-pill bg-primary py-3 text-sm font-bold text-background disabled:opacity-50"
            >
              {loading ? 'PLACING ORDER…' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </Container>
    </main>
  )
}

export function OrderSuccessPage() {
  const { id } = useParams()
  const user = useAuthStore(s => s.currentUser)!
  // Select raw orders array (stable reference) and filter outside selector
  const allOrders = useOrderStore(s => s.orders)
  const order = allOrders.find(o => o.id === id && o.userId === user.id)

  if (!order) return <Navigate to="/orders" replace />

  const eta = new Date()
  eta.setDate(eta.getDate() + 4)

  return (
    <main className="py-12">
      <Container className="max-w-2xl">
        <div className="rounded-card bg-sky p-7 text-center">
          <CheckCircle2 className="mx-auto text-accent" size={54} />
          <h1 className="mt-4 text-3xl font-semibold text-primary">Order confirmed</h1>
          <p className="mt-2 text-muted">
            Order {order.id} · Estimated delivery {eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
          <p className="mt-4 text-sm">
            Delivering to {order.address.line1}, {order.address.city}
          </p>
          <p className="mt-3 font-bold text-primary">Total ₹{order.total}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/orders" className="rounded-pill bg-primary px-5 py-3 text-xs font-bold text-background">
              VIEW MY ORDERS
            </Link>
            <Link
              to="/shop"
              className="rounded-pill border border-primary px-5 py-3 text-xs font-bold text-primary"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}

export function OrdersPage() {
  const user = useAuthStore(s => s.currentUser)!
  // FIX: Select raw orders array (stable reference) rather than calling getOrdersByUser
  // inside the selector. getOrdersByUser returns a new [] on every call, causing an infinite loop.
  const allOrders = useOrderStore(s => s.orders)
  const orders = useMemo(() => allOrders.filter(o => o.userId === user.id), [allOrders, user.id])

  const add = useCartStore(s => s.addItem)
  const [open, setOpen] = useState<string | null>(null)

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-3xl font-semibold text-primary">My orders</h1>
        {!orders.length ? (
          <div className="mt-6 rounded-card bg-sky p-8">
            <p>No orders yet.</p>
            <Link to="/shop" className="mt-3 inline-block text-accent underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map(o => (
              <article key={o.id} className="rounded-card border border-accent-soft p-5">
                <button
                  onClick={() => setOpen(open === o.id ? null : o.id)}
                  className="flex w-full justify-between text-left"
                >
                  <span>
                    <b>{o.id}</b>
                    <br />
                    <span className="text-sm text-muted">
                      {new Date(o.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </span>
                  <span className="text-right">
                    <b>₹{o.total}</b>
                    <br />
                    <span className="rounded-pill bg-sky px-2 py-1 text-xs text-accent">Confirmed</span>
                  </span>
                </button>
                {open === o.id && (
                  <div className="mt-4 border-t border-accent-soft pt-4 text-sm">
                    <p>
                      {o.address.line1}, {o.address.city}, {o.address.state}
                    </p>
                    {o.items.map(i => (
                      <p key={i.productId + i.variantLabel} className="mt-2">
                        {i.name} × {i.qty}
                      </p>
                    ))}
                    <button
                      onClick={() => o.items.forEach(i => add(i, i.qty))}
                      className="mt-3 rounded-pill bg-primary px-4 py-2 text-xs font-bold text-background"
                    >
                      REORDER
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
