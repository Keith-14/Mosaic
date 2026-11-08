import type { ReactNode } from 'react'
import type { ProductVisualType } from '../data/products'

type ProductVisualProps = { visual: ProductVisualType; size?: 'sm' | 'md' | 'lg'; className?: string }

const sizes = { sm: 'h-28 w-28', md: 'h-52 w-52', lg: 'h-80 w-80' }
const Label = ({ children }: { children: ReactNode }) => <><rect x="59" y="111" width="82" height="49" rx="5" fill="var(--color-primary)" /><text x="100" y="130" fill="var(--color-bg)" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">BE</text><text x="100" y="144" fill="var(--color-bg)" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="6">{children}</text></>

export function ProductVisual({ visual, size = 'md', className = '' }: ProductVisualProps) {
  return (
    <div className={`grid place-items-center overflow-hidden rounded-card bg-sky ${sizes[size]} ${className}`}>
      <svg viewBox="0 0 200 220" className="h-full w-full p-3" role="img" aria-label={`${visual.replace('-', ' ')} product illustration`}>
        <ellipse cx="100" cy="192" rx="54" ry="10" fill="var(--color-accent-soft)" opacity=".45" />
        {visual === 'pump-bottle' && <><path d="M86 44h28v21H86z" fill="var(--color-primary)" /><path d="M101 28h43v8h-43z" fill="var(--color-primary)" /><path d="M94 22h13v14H94z" fill="var(--color-primary)" /><rect x="58" y="58" width="84" height="128" rx="17" fill="var(--color-bg)" stroke="var(--color-accent-soft)" strokeWidth="2" /><Label>BODY WASH</Label></>}
        {visual === 'roll-on' && <><rect x="75" y="31" width="50" height="22" rx="8" fill="var(--color-accent-soft)" /><circle cx="100" cy="36" r="10" fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth="2" /><rect x="64" y="49" width="72" height="137" rx="20" fill="var(--color-bg)" stroke="var(--color-accent-soft)" strokeWidth="2" /><Label>SCALP SERUM</Label></>}
        {visual === 'gummy-jar' && <><rect x="62" y="50" width="76" height="23" rx="6" fill="var(--color-primary)" /><rect x="57" y="67" width="86" height="111" rx="19" fill="var(--color-bg)" stroke="var(--color-accent-soft)" strokeWidth="2" /><rect x="59" y="111" width="82" height="49" rx="5" fill="var(--color-primary)" /><text x="100" y="130" fill="var(--color-bg)" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">BE</text><text x="100" y="144" fill="var(--color-bg)" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="6">BIOTIN GUMMIES</text></>}
        {visual === 'tube' && <><path d="M70 41h60l-8 142H78z" fill="var(--color-bg)" stroke="var(--color-accent-soft)" strokeWidth="2" /><path d="M77 183h46v12H77z" fill="var(--color-primary)" /><Label>10% UREA</Label></>}
      </svg>
    </div>
  )
}
