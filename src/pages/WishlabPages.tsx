import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { useAuthStore } from '../store/authStore'
import { useWishlabStore } from '../store/wishlabStore'
import {
  Sparkles,
  Plus,
  Check,
  RotateCcw,
  Send,
  FlaskConical,
  Leaf,
  Flower2,
  Droplets,
  Flame,
  Wheat,
  Coffee,
  CircleDot,
  Mountain,
  Sun,
  ShieldCheck,
  Waves,
  Zap,
} from 'lucide-react'

const verticals = [
  'Face wash',
  'Body scrub',
  'Lip care',
  'Hair mask',
  'Body mist',
  'Soap bar',
  'Sunscreen',
  'Other',
]

export type IngredientMeta = {
  id: string
  label: string
  color: string
  bgSoft: string
  textColor: string
  category: string
  icon: typeof Leaf
  benefit: string
}

export const ingredientsList: IngredientMeta[] = [
  {
    id: 'aloe',
    label: 'Aloe Vera',
    color: 'bg-emerald-500',
    bgSoft: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-700',
    category: 'Soothing',
    icon: Leaf,
    benefit: 'Intensive Calming & Hydration',
  },
  {
    id: 'rose',
    label: 'Rose Water',
    color: 'bg-rose-400',
    bgSoft: 'bg-rose-50 text-rose-800 border-rose-200',
    textColor: 'text-rose-600',
    category: 'Floral Hydrosol',
    icon: Flower2,
    benefit: 'Pore Tightening & Floral Glow',
  },
  {
    id: 'green tea',
    label: 'Green Tea',
    color: 'bg-lime-500',
    bgSoft: 'bg-lime-50 text-lime-800 border-lime-200',
    textColor: 'text-lime-700',
    category: 'Antioxidant',
    icon: Droplets,
    benefit: 'Free-Radical Defense & Sebum Control',
  },
  {
    id: 'neem',
    label: 'Neem Extract',
    color: 'bg-emerald-700',
    bgSoft: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    textColor: 'text-emerald-800',
    category: 'Clarifying',
    icon: ShieldCheck,
    benefit: 'Blemish Control & Purifying',
  },
  {
    id: 'oatmeal',
    label: 'Colloidal Oat',
    color: 'bg-amber-300',
    bgSoft: 'bg-amber-50 text-amber-900 border-amber-200',
    textColor: 'text-amber-700',
    category: 'Nourishing',
    icon: Wheat,
    benefit: 'Barrier Repair & Anti-Itch',
  },
  {
    id: 'coffee',
    label: 'Coffee Bean',
    color: 'bg-amber-800',
    bgSoft: 'bg-amber-50 text-amber-950 border-amber-300',
    textColor: 'text-amber-900',
    category: 'Exfoliant',
    icon: Coffee,
    benefit: 'Microcirculation & Polish',
  },
  {
    id: 'charcoal',
    label: 'Activated Charcoal',
    color: 'bg-neutral-800',
    bgSoft: 'bg-neutral-100 text-neutral-900 border-neutral-300',
    textColor: 'text-neutral-800',
    category: 'Detox',
    icon: Flame,
    benefit: 'Deep Impurity Extraction',
  },
  {
    id: 'clay',
    label: 'French Pink Clay',
    color: 'bg-orange-400',
    bgSoft: 'bg-orange-50 text-orange-900 border-orange-200',
    textColor: 'text-orange-700',
    category: 'Mineral Purifier',
    icon: Mountain,
    benefit: 'Gentle Cell Renewal & Silky Feel',
  },
  {
    id: 'shea',
    label: 'Shea Butter',
    color: 'bg-yellow-200',
    bgSoft: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    textColor: 'text-yellow-700',
    category: 'Lipid Rich',
    icon: Sun,
    benefit: 'Deep Emollient Moisture',
  },
  {
    id: 'coconut',
    label: 'Coconut Milk',
    color: 'bg-stone-300',
    bgSoft: 'bg-stone-100 text-stone-900 border-stone-200',
    textColor: 'text-stone-700',
    category: 'Softening',
    icon: CircleDot,
    benefit: 'Supple Elasticity & Dew',
  },
  {
    id: 'jojoba',
    label: 'Jojoba Oil',
    color: 'bg-yellow-500',
    bgSoft: 'bg-yellow-50 text-yellow-900 border-yellow-300',
    textColor: 'text-yellow-800',
    category: 'Biomimetic Lipid',
    icon: Waves,
    benefit: 'Lightweight Moisture Retention',
  },
]

export function WishlabPage() {
  const user = useAuthStore(s => s.currentUser)
  const submit = useWishlabStore(s => s.submit)
  const nav = useNavigate()

  const [vertical, setVertical] = useState(verticals[0])
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null)
  const [isMixing, setIsMixing] = useState(false)
  const [hasMixed, setHasMixed] = useState(false)
  const [name, setName] = useState('')
  const [why, setWhy] = useState('')

  const toggleIngredient = (id: string) => {
    if (hasMixed) setHasMixed(false)

    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(prev => prev.filter(i => i !== id))
      if (recentlyAdded === id) setRecentlyAdded(null)
    } else if (selectedIngredients.length < 5) {
      setSelectedIngredients(prev => [...prev, id])
      setRecentlyAdded(id)
      setTimeout(() => setRecentlyAdded(null), 650)
    }
  }

  const handleMix = () => {
    if (selectedIngredients.length === 0) return
    setIsMixing(true)
    setTimeout(() => {
      setIsMixing(false)
      setHasMixed(true)
    }, 1500)
  }

  const handleReset = () => {
    setSelectedIngredients([])
    setRecentlyAdded(null)
    setHasMixed(false)
    setName('')
    setWhy('')
  }

  const handleSend = () => {
    if (!name.trim()) return
    if (!user) {
      nav('/login', { state: { from: '/wishlab' } })
      return
    }

    submit({
      userId: user.id,
      vertical,
      ingredients: selectedIngredients,
      fragrance: 'Fresh Botanical',
      concern: 'Custom Wellness Blend',
      name: name.trim(),
      why: why.trim(),
    })
    nav('/wishlab/my')
  }

  return (
    <main className="py-8 sm:py-12">
      <Container>
        {/* Header section */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-accent">Lab & Co-Creation</p>
            <h1 className="mt-1 text-3xl font-semibold text-primary sm:text-4xl">Wishlab Formulation Studio</h1>
            <p className="mt-1.5 text-sm text-muted">
              Select botanicals from the shelf to watch them drop into your beaker. Mix with sonic agitation, then name and submit to our lab.
            </p>
          </div>
          <Link
            to="/wishlab/my"
            className="rounded-pill border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-sky"
          >
            My Submissions
          </Link>
        </div>

        {/* 1. Category selector */}
        <div className="mt-8 rounded-card border border-accent-soft/80 bg-background p-5 shadow-xs">
          <label className="text-xs font-bold tracking-wider uppercase text-muted">Step 1 · Pick Product Category</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {verticals.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setVertical(item)}
                className={`rounded-pill px-4 py-2 text-xs font-semibold transition ${
                  vertical === item
                    ? 'bg-primary text-background shadow-sm'
                    : 'bg-sky/70 text-text hover:bg-sky'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive 3-Column Studio Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 items-start">

          {/* LEFT: Ingredients Shelf */}
          <div className="lg:col-span-4 rounded-card border border-accent-soft/80 bg-background p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-primary">Ingredients Shelf</h2>
                <p className="text-xs text-muted">Click to drop into beaker (up to 5)</p>
              </div>
              <span className="rounded-pill bg-sky px-2.5 py-1 text-xs font-bold text-accent">
                {selectedIngredients.length} / 5
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {ingredientsList.map(item => {
                const Icon = item.icon
                const isSelected = selectedIngredients.includes(item.id)
                const disabled = !isSelected && selectedIngredients.length >= 5
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleIngredient(item.id)}
                    className={`group relative flex items-center justify-between rounded-card border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-accent bg-sky/60 shadow-xs ring-1 ring-accent/30'
                        : disabled
                        ? 'cursor-not-allowed border-accent-soft/40 opacity-40 bg-sky/20'
                        : 'border-accent-soft/70 bg-background hover:border-accent hover:bg-sky/30 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Ingredient Logo Icon Badge */}
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.bgSoft} shadow-xs transition group-hover:scale-110`}
                      >
                        <Icon size={18} className={item.textColor} />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-primary">{item.label}</p>
                          <span className={`h-2 w-2 rounded-full ${item.color}`} />
                        </div>
                        <p className="text-[11px] text-muted">{item.benefit}</p>
                      </div>
                    </div>

                    <div className="flex items-center pl-2">
                      {isSelected ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow-xs">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky text-primary transition group-hover:bg-primary group-hover:text-background">
                          <Plus size={13} strokeWidth={2.5} />
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* CENTER: The Beaker / Formulation Chamber */}
          <div className="lg:col-span-4 rounded-card border border-accent-soft/80 bg-gradient-to-b from-sky/50 via-sky/20 to-background p-6 shadow-xs flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between pb-2 border-b border-accent-soft/50">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <FlaskConical size={16} className="text-accent" /> Laboratory Beaker
              </span>
              {selectedIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[11px] text-muted hover:text-accent transition"
                  title="Clear mixture"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              )}
            </div>

            {/* The Visual Beaker Container with lip & glass reflections */}
            <div className="relative mt-7 flex h-72 w-52 flex-col justify-end overflow-hidden rounded-b-[40px] border-x-4 border-b-4 border-slate-300/80 bg-white/60 backdrop-blur-xs shadow-xl ring-1 ring-white/80">
              {/* Glass Rim Top Lip */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              {/* Vertical Glass Specular Highlight */}
              <div className="absolute left-3 inset-y-0 w-1.5 bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none z-30" />
              <div className="absolute right-3 inset-y-0 w-1 bg-gradient-to-b from-white/60 via-white/10 to-transparent pointer-events-none z-30" />

              {/* Beaker Volume Graduations */}
              <div className="absolute left-2.5 top-8 flex items-center gap-1 z-20 text-[9px] font-mono text-slate-400">
                <div className="h-0.5 w-4 bg-slate-300" /> <span>250ml</span>
              </div>
              <div className="absolute left-2.5 top-20 flex items-center gap-1 z-20 text-[9px] font-mono text-slate-400">
                <div className="h-0.5 w-3 bg-slate-300" /> <span>200ml</span>
              </div>
              <div className="absolute left-2.5 top-32 flex items-center gap-1 z-20 text-[9px] font-mono text-slate-400">
                <div className="h-0.5 w-4 bg-slate-300" /> <span>150ml</span>
              </div>
              <div className="absolute left-2.5 top-44 flex items-center gap-1 z-20 text-[9px] font-mono text-slate-400">
                <div className="h-0.5 w-3 bg-slate-300" /> <span>100ml</span>
              </div>
              <div className="absolute left-2.5 top-56 flex items-center gap-1 z-20 text-[9px] font-mono text-slate-400">
                <div className="h-0.5 w-4 bg-slate-300" /> <span>50ml</span>
              </div>

              {/* ── Empty State ── */}
              {selectedIngredients.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-xs text-muted">
                  <div className="rounded-full bg-sky/80 p-3 text-accent mb-2">
                    <FlaskConical size={26} strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-primary">Beaker is empty</p>
                  <p className="mt-1 text-[11px] text-muted">Click an ingredient on the shelf to drop it in</p>
                </div>
              ) : hasMixed ? (
                /* ── MIXED STATE: Luminous Swirling Micro-Emulsion ── */
                <div
                  className="relative flex w-full flex-col items-center justify-center bg-gradient-to-t from-primary via-accent to-sky text-background overflow-hidden transition-all duration-700"
                  style={{ height: `${Math.min(95, selectedIngredients.length * 20)}%` }}
                >
                  {/* Effervescent Rising Bubbles */}
                  <div className="absolute left-1/4 bottom-1 h-3 w-3 rounded-full bg-white/40 animate-bubble-1" />
                  <div className="absolute left-2/4 bottom-2 h-2 w-2 rounded-full bg-white/50 animate-bubble-2" />
                  <div className="absolute left-3/4 bottom-1 h-3.5 w-3.5 rounded-full bg-white/30 animate-bubble-3" />
                  <div className="absolute left-1/3 bottom-4 h-2 w-2 rounded-full bg-white/40 animate-bubble-4" />

                  {/* Surface Liquid Meniscus */}
                  <div className="absolute inset-x-0 top-0 h-3 bg-white/30 rounded-t-full filter blur-[1px]" />

                  {/* Shimmer & Badge */}
                  <div className="relative z-10 flex flex-col items-center p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs shadow-md">
                      <Sparkles size={22} className="text-amber-200 animate-pulse" />
                    </div>
                    <span className="mt-2 text-xs font-bold tracking-wider uppercase drop-shadow-sm text-white">
                      Perfect Emulsion
                    </span>
                    <span className="text-[10px] text-white/80 font-medium">{vertical}</span>
                  </div>
                </div>
              ) : isMixing ? (
                /* ── ACTIVE MIXING ANIMATION: High-speed Vortex & Swirling Energy ── */
                <div
                  className="relative flex w-full flex-col items-center justify-center bg-gradient-to-t from-accent to-emerald-400 overflow-hidden"
                  style={{ height: `${Math.min(95, selectedIngredients.length * 20)}%` }}
                >
                  {/* Dynamic Swirling Vortex Waves */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-36 w-36 rounded-full border-4 border-dashed border-white/60 animate-vortex" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full border-2 border-white/40 animate-spin" />
                  </div>

                  {/* Bubbles splashing during mixing */}
                  <div className="absolute left-5 bottom-2 h-2.5 w-2.5 rounded-full bg-white/60 animate-bubble-1" />
                  <div className="absolute right-6 bottom-3 h-3 w-3 rounded-full bg-white/60 animate-bubble-3" />

                  {/* Center Energy Pulse */}
                  <div className="relative z-10 flex flex-col items-center">
                    <Zap size={28} className="text-yellow-200 animate-bounce" />
                    <span className="mt-1 text-[11px] font-bold tracking-widest uppercase text-white animate-pulse">
                      Emulsifying...
                    </span>
                  </div>
                </div>
              ) : (
                /* ── UNMIXED: Density Layers with Dropping Animation ── */
                <div
                  className="flex w-full flex-col justify-end transition-all duration-300"
                  style={{ height: `${Math.min(95, selectedIngredients.length * 20)}%` }}
                >
                  {/* Surface Meniscus line */}
                  <div className="h-1.5 w-full bg-white/40 rounded-t-full shadow-inner" />

                  {selectedIngredients.map((ingId, idx) => {
                    const ing = ingredientsList.find(x => x.id === ingId)
                    const Icon = ing?.icon ?? Leaf
                    const isNewest = recentlyAdded === ingId
                    return (
                      <div
                        key={ingId}
                        className={`relative flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white shadow-inner transition-all ${
                          ing?.color ?? 'bg-accent'
                        } ${isNewest ? 'animate-ingredient-drop z-10' : ''}`}
                        style={{
                          height: `${100 / selectedIngredients.length}%`,
                        }}
                      >
                        <Icon size={14} className="drop-shadow-xs" />
                        <span className="truncate drop-shadow-xs">{ing?.label}</span>

                        {/* Top boundary bubble line between layers */}
                        {idx > 0 && (
                          <div className="absolute inset-x-0 top-0 h-0.5 bg-black/10" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Status indicator pill */}
            <div className="mt-4 text-xs">
              {hasMixed ? (
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-emerald-100 px-3.5 py-1 font-semibold text-emerald-800 shadow-xs">
                  <Check size={14} className="text-emerald-700" /> Blended & Stabilized
                </span>
              ) : isMixing ? (
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-sky px-3.5 py-1 font-semibold text-accent animate-pulse">
                  <Sparkles size={14} className="animate-spin text-accent" /> High-speed homogenization...
                </span>
              ) : selectedIngredients.length > 0 ? (
                <span className="rounded-pill bg-sky px-3 py-1 font-medium text-primary">
                  {selectedIngredients.length} ingredient{selectedIngredients.length > 1 ? 's' : ''} in beaker · Ready to mix
                </span>
              ) : (
                <span className="text-muted">Awaiting ingredients</span>
              )}
            </div>

            {/* Mixing Action Button */}
            <button
              type="button"
              disabled={selectedIngredients.length === 0 || isMixing || hasMixed}
              onClick={handleMix}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-pill py-3 text-xs font-bold transition shadow-md ${
                hasMixed
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isMixing
                  ? 'bg-accent text-background animate-pulse'
                  : selectedIngredients.length === 0
                  ? 'bg-accent-soft/50 text-muted cursor-not-allowed shadow-none'
                  : 'bg-primary text-background hover:bg-primary/95 active:scale-[0.98]'
              }`}
            >
              <Sparkles size={16} />
              {hasMixed ? 'MIXTURE READY' : isMixing ? 'MIXING INGREDIENTS...' : 'MIX INGREDIENTS'}
            </button>
          </div>

          {/* RIGHT: Name, Why & Send Form */}
          <div className="lg:col-span-4 rounded-card border border-accent-soft/80 bg-background p-5 shadow-xs">
            <label className="text-xs font-bold tracking-wider uppercase text-muted">Step 3 · Brand & Submit</label>
            <h2 className="mt-1 font-semibold text-primary">Name Your Formula</h2>
            <p className="text-xs text-muted">
              {hasMixed
                ? 'Your botanical blend is stabilized! Give it a title and tell our team why you want it.'
                : 'Mix the ingredients in your beaker to unlock naming and submission.'}
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-primary">Formula / Product Name *</label>
                <input
                  type="text"
                  disabled={!hasMixed}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={hasMixed ? 'e.g. Dewy Oat & Rose Radiance Wash' : 'Mix ingredients first...'}
                  className="mt-1.5 w-full rounded-card border border-accent-soft bg-background px-3 py-2.5 text-sm outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:bg-sky/30 disabled:text-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary">Why do you want this product?</label>
                <textarea
                  maxLength={160}
                  disabled={!hasMixed}
                  rows={4}
                  value={why}
                  onChange={e => setWhy(e.target.value)}
                  placeholder={
                    hasMixed
                      ? 'Tell our formulation R&D team what benefit or skin feel you are looking for...'
                      : 'Mix ingredients first...'
                  }
                  className="mt-1.5 w-full rounded-card border border-accent-soft bg-background p-3 text-sm outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:bg-sky/30 disabled:text-muted"
                />
                <span className="mt-1 block text-right text-[10px] text-muted">{why.length} / 160</span>
              </div>

              {/* Recipe Summary Box */}
              {hasMixed && (
                <div className="rounded-card border border-accent-soft/70 bg-sky/50 p-3.5 text-xs">
                  <p className="font-semibold text-primary flex items-center gap-1.5">
                    <FlaskConical size={14} className="text-accent" /> Active Recipe Formulation:
                  </p>
                  <p className="mt-1.5 text-text font-medium leading-relaxed">
                    <span className="text-accent font-semibold">{vertical}</span> base powered by{' '}
                    {selectedIngredients.map((id, i) => {
                      const ing = ingredientsList.find(x => x.id === id)
                      return (
                        <span key={id}>
                          <span className="font-semibold text-primary">{ing?.label}</span>
                          {i < selectedIngredients.length - 1 ? ', ' : ''}
                        </span>
                      )
                    })}
                  </p>
                </div>
              )}

              {/* Send Button */}
              <button
                type="button"
                disabled={!hasMixed || !name.trim()}
                onClick={handleSend}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-pill bg-primary py-3 text-xs font-bold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
              >
                <Send size={14} /> SEND FORMULA TO LAB
              </button>
            </div>
          </div>

        </div>

        {/* Co-Creation Disclaimer footer */}
        <p className="mt-8 text-center text-xs text-muted">
          This is a community co-creation wish, not a finalized cosmetic formula. Our R&D team rigorously reviews stability, dermal safety, and regulations before advancing shortlisted submissions.
        </p>
      </Container>
    </main>
  )
}

export function WishlabMy() {
  const u = useAuthStore(s => s.currentUser)!
  const allItems = useWishlabStore(s => s.items)
  const items = useMemo(() => allItems.filter(x => x.userId === u.id), [allItems, u.id])

  return (
    <main className="py-10">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <Link to="/wishlab" className="text-xs font-semibold text-accent hover:underline">
              ← Back to Formulation Studio
            </Link>
            <h1 className="mt-2 text-3xl font-semibold text-primary">My Wishlab Ideas</h1>
          </div>
          <Link
            to="/wishlab"
            className="rounded-pill bg-primary px-4 py-2 text-xs font-bold text-background"
          >
            Create Another
          </Link>
        </div>

        {!items.length ? (
          <div className="mt-8 rounded-card border border-dashed border-accent-soft p-10 text-center text-muted">
            <FlaskConical size={32} className="mx-auto mb-2 text-accent" />
            <p className="font-semibold text-primary">No formula wishes submitted yet</p>
            <p className="mt-1 text-xs">Mix your first product in the formulation studio!</p>
            <Link
              to="/wishlab"
              className="mt-4 inline-block rounded-pill bg-primary px-5 py-2.5 text-xs font-bold text-background"
            >
              Start Mixing
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(x => (
              <div key={x.id} className="flex flex-col rounded-card border border-accent-soft bg-sky/40 p-5 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <b className="text-base text-primary">{x.name}</b>
                  <span className="rounded-pill bg-background px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                    {x.status}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-text">{x.vertical}</p>
                {x.why && <p className="mt-3 text-xs text-muted line-clamp-3">“{x.why}”</p>}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {x.ingredients.map(ing => (
                    <span key={ing} className="rounded-pill bg-background px-2 py-0.5 text-[10px] text-muted">
                      {ing}
                    </span>
                  ))}
                </div>
                <div className="mt-4 border-t border-accent-soft/60 pt-3 text-[11px] text-muted flex justify-between">
                  <span>{new Date(x.createdAt).toLocaleDateString()}</span>
                  <span>{x.votes.length} votes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
