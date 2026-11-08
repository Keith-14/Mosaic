import { createClient, type SupabaseClient } from '@supabase/supabase-js'
const url=import.meta.env.VITE_SUPABASE_URL as string|undefined,key=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined
const missing=[!url&&'VITE_SUPABASE_URL',!key&&'VITE_SUPABASE_ANON_KEY'].filter(Boolean).join(', ')
export const isSupabaseConfigured=Boolean(url&&key)
// DEMO ONLY: production must use Supabase Auth + per-user RLS policies.
export const supabase:SupabaseClient|null=isSupabaseConfigured?createClient(url!,key!):null
if(!isSupabaseConfigured)console.warn(`Supabase photo uploads disabled: missing ${missing}. Add the variable(s) and restart the dev server.`)
