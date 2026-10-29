# Authentication & Authorization Guide

EduFlow uses **Supabase Auth** for user identity (email/password signups, magic links, social logins, and password resets) paired with **Prisma** to manage application user roles and relational records.

---

## Architecture Overview

```text
+-----------------------+         +----------------------------+
| Browser / Client App  |         | Next.js Server / Action    |
| (createBrowserClient) |         | (createServerClient)       |
+-----------+-----------+         +--------------+-------------+
            |                                    |
            | JWT Cookie Sync                    | Query auth session
            v                                    v
+-----------+------------------------------------+-------------+
|                     Next.js Edge Middleware                  |
|                 (Refreshes expired JWT tokens)               |
+-------------------------------+------------------------------+
                                |
                                v
               +----------------+----------------+
               | Supabase Auth Service (auth)    |
               | Returns Auth UUID & email       |
               +----------------+----------------+
                                |
                                v
               +----------------+----------------+
               | Prisma Database (public.users)  |
               | Look up or auto-create User row |
               +---------------------------------+
```

---

## 1. The Three Supabase Helpers (`@supabase/ssr`)

Because Next.js runs code in multiple environments (client browser, server components, server actions, and edge middleware), `@supabase/ssr` provides specific client configurations for each context.

### Helper 1: Browser Client (`lib/supabase/client.ts`)
Used in Client Components (components containing `"use client"`) for interactive login forms, sign-up buttons, and real-time client state:

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

### Helper 2: Server Client (`lib/supabase/server.ts`)
Used in **Server Components**, **Server Actions**, and **Route Handlers** to read secure HTTP-only session cookies and verify identity:

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
```

---

### Helper 3: Middleware Session Refresher (`lib/supabase/middleware.ts`)
Used exclusively inside `middleware.ts` to refresh expired Auth session cookies before rendering any page:

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid using supabase.auth.getSession() in middleware as it
  // is insecure. Always use getUser() to validate auth status with the server.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
```

---

## 2. Middleware Session Refresh & Role Protection

Next.js route protection happens at the edge in `middleware.ts`. This blocks unauthenticated visitors from accessing dashboard, instructor, or admin pages.

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // 1. Protected routes requiring authentication
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin")

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Redirect logged-in users away from auth pages
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register")

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```

---

## 3. `getCurrentUser()` with On-the-Fly User Row Creation

In EduFlow, user authentication lives in Supabase Auth, but application roles and relationships (courses, enrollments, progress) live in the Prisma database (`public.users`).

The helper `lib/auth.ts` bridges this gap seamlessly: when an authenticated user loads any page, `getCurrentUser()` checks if a matching record exists in the database. If not, it creates the database row automatically.

```typescript
// lib/auth.ts
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const supabase = await createClient()

  // Verify auth session securely with Supabase Auth
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser()

  if (error || !authUser) {
    return null
  }

  // Find user record in Prisma database
  let dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  // On-the-fly user creation if this is their first visit
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        fullName:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "Student",
        avatarUrl:
          authUser.user_metadata?.avatar_url ||
          authUser.user_metadata?.picture ||
          null,
        role: "STUDENT",
      },
    })
  }

  return dbUser
}
```

### Why this pattern is reliable:
- **No race conditions**: No need for fragile background processes or external notifications.
- **Immediate consistency**: The moment a user signs in and is redirected, their profile record exists in PostgreSQL.
- **Role safety**: The user defaults to the `STUDENT` role on creation.

---

## 4. Promoting a User to Admin

To grant administrator privileges to an account, run this SQL query directly in the **Supabase SQL Editor**:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Paste and execute the following snippet (replace the email with your own):

```sql
-- Promote a user to ADMIN in EduFlow
UPDATE public.users
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, full_name, role, created_at
FROM public.users
WHERE email = 'your-email@example.com';
```

To promote an instructor:
```sql
UPDATE public.users
SET role = 'INSTRUCTOR'
WHERE email = 'instructor-email@example.com';
```

