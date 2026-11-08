# Bodywise Demo

A frontend-only women’s wellness e-commerce prototype built with Vite, React 18, TypeScript, Tailwind CSS, React Router, and Zustand.

## Run locally

```bash
npm install
npm run dev
```

Build the production bundle with `npm run build`.

## Demo login

- Email: `demo@bodywise.test`
- Password: `demo123`

## Folder structure

- `src/components` — shared UI, layout, cart, product and utility components
- `src/pages` — routed pages and flows
- `src/data` — local product and testimonial catalog data
- `src/store` — persisted Zustand auth, cart, toast, and order stores

## Reset demo data

All demo state is stored in browser localStorage. In the browser console, run:

```js
localStorage.clear()
```

Then refresh the page.

## Limitations

This is a demo only. Authentication is mocked and stores plain-text credentials locally; there is no backend, inventory, real user data, payment gateway, or payment collection.
