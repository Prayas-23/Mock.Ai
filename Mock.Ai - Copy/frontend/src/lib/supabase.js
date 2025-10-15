import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Provide a safe fallback in development when env vars are missing
let supabase
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. Using a no-op mock client for development. Auth features will be disabled until env vars are provided.')
  const noop = async (ret = {}) => ret
  const subscription = { unsubscribe: () => {} }
  const auth = {
    // Align return shapes with @supabase/supabase-js
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription } }),
    signUp: noop,
    signInWithPassword: noop,
    signInWithOAuth: noop,
    signOut: noop,
    resetPasswordForEmail: noop,
    updateUser: noop,
  }
  supabase = { auth }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

export { supabase }
export default supabase