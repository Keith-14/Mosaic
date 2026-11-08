import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        promo: 'var(--color-promo)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        sky: 'var(--color-sky)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        background: 'var(--color-bg)',
        badge: 'var(--color-badge)',
      },
      fontFamily: {
        primary: 'var(--font-primary)',
        serif: 'var(--font-serif)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      maxWidth: {
        content: '1124px',
      },
    },
  },
  plugins: [],
} satisfies Config
