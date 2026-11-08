import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
const routeMeta: Record<string, [string, string]> = {
  '/': ['Bodywise Demo | Everyday wellness', 'Thoughtful women’s wellness routines, made simple.'],
  '/shop': ['Shop | Bodywise Demo', 'Explore Bodywise Demo hair, body-care and wellness essentials.'],
  '/login': ['Log in | Bodywise Demo', 'Log in to the Bodywise Demo store.'],
  '/signup': ['Create account | Bodywise Demo', 'Create a mock Bodywise Demo account.'],
  '/checkout': ['Checkout | Bodywise Demo', 'Complete a demo order with no payment collected.'],
}
export function Seo(){const {pathname}=useLocation();useEffect(()=>{const [title,description]=routeMeta[pathname]??(pathname.startsWith('/product/')?['Product | Bodywise Demo','Learn about a Bodywise Demo wellness product.']:['Bodywise Demo','Thoughtful everyday wellness.']);document.title=title;let tag=document.querySelector('meta[name="description"]');if(!tag){tag=document.createElement('meta');tag.setAttribute('name','description');document.head.appendChild(tag)}tag.setAttribute('content',description)},[pathname]);return null}
