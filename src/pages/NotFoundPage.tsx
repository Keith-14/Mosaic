import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
export function NotFoundPage(){return <main className="grid min-h-[45vh] place-items-center py-12"><Container className="text-center"><p className="text-sm font-bold text-accent">404</p><h1 className="mt-2 text-3xl font-semibold text-primary">This page wandered off.</h1><Link to="/" className="mt-5 inline-block rounded-pill bg-primary px-5 py-3 text-xs font-bold text-background">GO HOME</Link></Container></main>}
