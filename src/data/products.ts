export type ProductCategory = 'hair' | 'body-care' | 'health-fitness'
export type ProductVisualType = 'pump-bottle' | 'roll-on' | 'gummy-jar' | 'tube'

export type ProductVariant = { label: string; price: number; mrp: number }

export type Product = {
  id: string
  slug: string
  name: string
  category: ProductCategory
  concern: string
  size: string
  heroIngredient: string
  price: number
  mrp: number
  rating: number
  reviewCount: number
  shortDescription: string
  description: string
  benefits: string[]
  howToUse: string[]
  ingredients: string
  variants?: ProductVariant[]
  visual: ProductVisualType
}

export const products: Product[] = [
  {
    id: 'body-wash-salicylic', slug: '1-percent-salicylic-ceramide-body-wash', name: '1% Salicylic Ceramide Body Wash',
    category: 'body-care', concern: 'Body Acne & Dry Skin', size: '200ml', heroIngredient: 'Salicylic Acid + Ceramides', price: 549, mrp: 549, rating: 4.6, reviewCount: 1284,
    shortDescription: 'A gentle daily body cleanser for bumpy, congested-looking skin.',
    description: 'A refreshing, soap-free body wash that cleanses without leaving skin feeling tight. Salicylic acid and ceramides make it an easy addition to a balanced shower routine.',
    benefits: ['Cleanses away daily buildup gently', 'Leaves skin feeling soft, not stripped', 'Made for regular body-care routines'],
    howToUse: ['Apply to wet skin during your shower.', 'Massage into a light lather, avoiding broken skin.', 'Rinse well and follow with moisturiser if needed.'],
    ingredients: 'Aqua, gentle cleansing agents, 1% salicylic acid, ceramides, glycerin, fragrance.', visual: 'pump-bottle',
  },
  {
    id: 'urea-body-lotion', slug: '10-percent-urea-body-lotion', name: '10% Urea Body Lotion',
    category: 'body-care', concern: 'Dry Skin', size: '300ml', heroIngredient: '10% Urea', price: 449, mrp: 499, rating: 4.5, reviewCount: 956,
    shortDescription: 'Comforting everyday moisture for skin that feels dry or rough.',
    description: 'A plush, fast-absorbing lotion with 10% urea that helps make your everyday body-care ritual feel more nourishing. It layers comfortably under clothes without a sticky finish.',
    benefits: ['Gives dry skin a cushiony feel', 'Absorbs quickly for daytime use', 'Supports a simple, consistent moisture routine'],
    howToUse: ['Smooth over clean, dry skin.', 'Pay extra attention to elbows, knees and heels.', 'Use daily or whenever skin feels dry.'],
    ingredients: 'Aqua, urea, glycerin, emollients, shea butter, panthenol, fragrance.', visual: 'tube',
  },
  {
    id: 'hair-growth-roll-on', slug: 'advanced-hair-growth-serum-roll-on', name: 'Advanced Hair Growth Serum Roll-On',
    category: 'hair', concern: 'Hair Thinning', size: '25ml', heroIngredient: 'Rosemary + Peptides', price: 569, mrp: 599, rating: 4.7, reviewCount: 2048,
    shortDescription: 'A no-fuss roll-on for a mindful scalp-care routine.',
    description: 'A lightweight, easy-to-apply scalp serum with rosemary and peptides. The roll-on format helps you apply it precisely as part of your regular hair-care ritual.',
    benefits: ['Easy targeted roll-on application', 'Non-greasy, lightweight texture', 'Designed for consistent scalp-care routines'],
    howToUse: ['Part dry hair to reveal the scalp.', 'Roll directly along the scalp in small sections.', 'Massage gently with clean fingertips and leave in.'],
    ingredients: 'Aqua, rosemary leaf extract, peptides, niacinamide, caffeine, humectants.', variants: [{ label: '25ml', price: 569, mrp: 599 }, { label: '50ml', price: 999, mrp: 1199 }], visual: 'roll-on',
  },
  {
    id: 'biotin-gummies', slug: 'biotin-hair-gummies', name: 'Biotin Hair Gummies (30)',
    category: 'health-fitness', concern: 'Stage 1 Hair Loss', size: '30 pcs', heroIngredient: 'Biotin + Zinc', price: 499, mrp: 549, rating: 4.6, reviewCount: 1732,
    shortDescription: 'A berry-flavoured daily gummy for your hair-care routine.',
    description: 'A convenient, berry-flavoured gummy with biotin and zinc for adults who prefer a simple supplement format. Enjoy as part of a varied diet and an everyday wellness routine.',
    benefits: ['Easy, enjoyable daily format', 'With biotin and zinc', 'Made for adults seeking a simple routine'],
    howToUse: ['Chew one gummy daily, or as advised by a healthcare professional.', 'Do not exceed the suggested daily serving.', 'Store in a cool, dry place.'],
    ingredients: 'Glucose syrup, sugar, pectin, biotin, zinc citrate, natural berry flavour, fruit concentrate.', variants: [{ label: '30 pcs', price: 499, mrp: 549 }, { label: '60 pcs', price: 849, mrp: 999 }], visual: 'gummy-jar',
  },
]

export const getProductById = (id: string) => products.find((product) => product.id === id)
export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug)
