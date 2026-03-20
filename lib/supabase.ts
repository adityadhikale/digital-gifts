/**
 * Supabase client configuration.
 * Creates a singleton client instance for database and storage operations.
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client instance for client-side operations.
 * Uses the anon key which has row-level security (RLS) applied.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)