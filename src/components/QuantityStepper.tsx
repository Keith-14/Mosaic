import { Minus, Plus } from 'lucide-react'
export function QuantityStepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <div className="inline-flex items-center rounded-pill border border-accent-soft bg-background"><button aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} className="p-2 text-primary disabled:opacity-35"><Minus size={16} /></button><span className="w-7 text-center text-sm font-semibold">{value}</span><button aria-label="Increase quantity" onClick={() => onChange(Math.min(10, value + 1))} disabled={value >= 10} className="p-2 text-primary disabled:opacity-35"><Plus size={16} /></button></div>
}
