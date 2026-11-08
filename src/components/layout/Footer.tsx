import { Instagram, MessageCircle, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Logo } from './Logo'

const columns = [
  { title: 'Shop', links: ['All Products', 'Hair', 'Body Care', 'Nutrition'] },
  { title: 'Help', links: ['Contact', 'FAQs', 'About', 'Returns & Refunds'] },
  { title: 'Legal', links: ['Privacy', 'Terms'] },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-primary text-background">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          <div><Logo light /><p className="mt-4 max-w-xs text-sm leading-6 text-background/75">Everyday wellness, made simple for your body and your routine.</p><div className="mt-5 flex gap-2"><a href="#instagram" aria-label="Instagram" className="rounded-full p-2 hover:bg-background/15"><Instagram size={18} /></a><a href="#youtube" aria-label="YouTube" className="rounded-full p-2 hover:bg-background/15"><Youtube size={18} /></a><a href="#community" aria-label="Community" className="rounded-full p-2 hover:bg-background/15"><MessageCircle size={18} /></a></div></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => <div key={column.title}><h2 className="text-sm font-semibold">{column.title}</h2><ul className="mt-3 space-y-2">{column.links.map((link) => <li key={link}><Link to="/shop" className="text-sm text-background/75 transition-colors hover:text-background">{link}</Link></li>)}</ul></div>)}
          </div>
        </div>
        <p className="mt-10 border-t border-background/20 pt-5 text-xs text-background/65">Copyright © 2026 Bodywise Demo. All rights reserved.</p>
      </Container>
    </footer>
  )
}
