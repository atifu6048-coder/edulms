import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

/**
 * Retrieves the currently authenticated user from Supabase Auth and finds their
 * corresponding record in the database. If the database record does not exist yet
 * (e.g. immediate redirect after initial sign-up), it creates the record on the fly.
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser()

  if (error || !authUser || !authUser.email) {
    return null
  }

  let user = await db.user.findUnique({
    where: { id: authUser.id },
  })

  if (!user) {
    const emailPrefix = authUser.email.split("@")[0]
    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      emailPrefix

    user = await db.user.create({
      data: {
        id: authUser.id,
        email: authUser.email,
        fullName,
        avatarUrl:
          authUser.user_metadata?.avatar_url ||
          authUser.user_metadata?.picture ||
          null,
        role: "STUDENT",
      },
    })
  }

  return user
}
