export type Testimonial = { name: string; age: number; city: string; quote: string; productId: string; concern: string }

export const reviews: Testimonial[] = [
  { name: 'Pritha', age: 23, city: 'Mumbai', quote: 'The body wash feels so gentle in my evening shower routine and leaves my skin feeling comfortable.', productId: 'body-wash-salicylic', concern: 'Body Acne & Dry Skin' },
  { name: 'Naina', age: 29, city: 'Bengaluru', quote: 'I love how quickly the lotion settles in. It makes my post-shower routine feel much more put together.', productId: 'urea-body-lotion', concern: 'Dry Skin' },
  { name: 'Rhea', age: 27, city: 'Delhi', quote: 'The roll-on makes it genuinely easy to stay consistent with a little scalp-care time every day.', productId: 'hair-growth-roll-on', concern: 'Hair Thinning' },
  { name: 'Meera', age: 31, city: 'Pune', quote: 'These gummies are a pleasant, fuss-free part of my morning routine.', productId: 'biotin-gummies', concern: 'Stage 1 Hair Loss' },
  { name: 'Isha', age: 26, city: 'Kolkata', quote: 'The bottle looks lovely on my shelf and the formula feels refreshing after a busy day.', productId: 'body-wash-salicylic', concern: 'Body Acne & Dry Skin' },
  { name: 'Aanya', age: 25, city: 'Hyderabad', quote: 'A small ritual that is easy to keep up with, especially on rushed mornings.', productId: 'hair-growth-roll-on', concern: 'Hair Thinning' },
]
