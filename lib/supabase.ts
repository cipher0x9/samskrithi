import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !anonKey) {
  console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_* envs — using mock fallbacks in routes');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceKey || anonKey || 'placeholder',
  { auth: { persistSession: false } }
);

export const supabaseAnon = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  anonKey || 'placeholder'
);

// Server-only client (service role bypasses RLS)
export const supabaseServer = supabase;
