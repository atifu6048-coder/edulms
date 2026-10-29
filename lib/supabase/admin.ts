import { createClient } from "@supabase/supabase-js"

// Security check: Never allow this file or client to be evaluated in browser bundles
if (typeof window !== "undefined") {
  throw new Error(
    "Security Violation: Supabase Admin client cannot be instantiated or used in browser environments."
  )
}

export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "Security Violation: Supabase Admin client cannot be instantiated or used in browser environments."
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)."
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
