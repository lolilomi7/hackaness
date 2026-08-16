import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// createClient throws synchronously on a missing/empty URL or key, which
// would crash the whole app at import time. Stay null at runtime so callers
// (stays.ts) can no-op — typed as non-null so ai.ts (off-limits, and
// already wrapped in its own try/catch + fallback) doesn't need changes.
export const supabase = (
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
) as SupabaseClient;
