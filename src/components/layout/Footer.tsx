import { Instagram, MessageCircle, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Logo } from './Logo'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Shop',       to: '/shop'     },
      { label: 'My Journey', to: '/journey'  },
      { label: 'My Packs',   to: '/my-packs' },
      { label: 'Wishlab',    to: '/wishlab'  },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact',           to: '/shop' },
      { label: 'FAQs',              to: '/shop' },
      { label: 'About',             to: '/shop' },
      { label: 'Returns & Refunds', to: '/shop' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/shop' },
      { label: 'Terms',   to: '/shop' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-primary text-background">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          {/* Brand column */}
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-6 text-background/75">
              Everyday wellness, made simple for your body and your routine.
            </p>
            <div className="mt-5 flex gap-2">
              <a href="#instagram" aria-label="Instagram" className="rounded-full p-2 hover:bg-background/15">
                <Instagram size={18} />
              </a>
              <a href="#youtube" aria-label="YouTube" className="rounded-full p-2 hover:bg-background/15">
                <Youtube size={18} />
              </a>
              <a href="#community" aria-label="Community" className="rounded-full p-2 hover:bg-background/15">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map(column => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold">{column.title}</h2>
                <ul className="mt-3 space-y-2">
                  {column.links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-background/75 transition-colors hover:text-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 border-t border-background/20 pt-5 text-xs text-background/65">
          Copyright © 2026 Bodywise Demo. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
