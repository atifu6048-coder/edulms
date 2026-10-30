import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    const { supabaseResponse, user, supabase } = await updateSession(request)
    const pathname = request.nextUrl.pathname

    const isTeacherRoute =
      pathname.startsWith("/teacher") || pathname.startsWith("/instructor")
    const isAdminRoute = pathname.startsWith("/admin")
    const isStudentRoute =
      pathname.startsWith("/student") || pathname.startsWith("/dashboard")

    const isProtectedRoute = isTeacherRoute || isAdminRoute || isStudentRoute

    const isAuthRoute =
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/register")

    // 1. Signed-out users attempting to access protected routes go to /sign-in
    if (isProtectedRoute && !user) {
      const signInUrl = new URL("/sign-in", request.url)
      signInUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // 2. Signed-in users attempting to access auth routes redirect to dashboard
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 3. Role-based route protection for authenticated users
    if (user && (isTeacherRoute || isAdminRoute)) {
      // Look up the user's row in the users table by auth UUID
      let role: string = (user.user_metadata?.role as string) || "STUDENT"

      if (supabase) {
        try {
          const { data: dbUser } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()

          if (dbUser?.role) {
            role = dbUser.role
          }
        } catch {
          // Fallback to metadata if DB lookup encounters an issue
        }
      }

      const isTeacherOrAdmin =
        role === "INSTRUCTOR" || role === "TEACHER" || role === "ADMIN"

      // /admin/* requires ADMIN
      if (isAdminRoute && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // /teacher/* requires TEACHER or ADMIN
      if (isTeacherRoute && !isTeacherOrAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error("[MIDDLEWARE_ERROR]:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

