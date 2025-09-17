import { createClient } from "@supabase/supabase-js"

// Direct Supabase configuration (fallback)
const SUPABASE_URL = "https://rfmkgjswjqafiweonolx.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmbWtnanN3anFhZml3ZW9ub2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjk5NTIsImV4cCI6MjA2NTkwNTk1Mn0.6_o1As4Cj15u809H1N9kO7tBj1pkqPvQx5_TGIdnQrU"

export const supabaseDirect = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
  global: {
    headers: {
      'X-Client-Info': 'ghana-transport-app-direct',
    },
  },
})

console.log('Direct Supabase client created with:', {
  url: SUPABASE_URL,
  key: `${SUPABASE_ANON_KEY.substring(0, 20)}...`
})




