# Troubleshooting & Common Pitfalls

This guide covers common issues and error messages encountered when building and running **EduFlow**, along with actionable steps to resolve them.

---

## 1. Paused Supabase Project

### Symptoms
- `PrismaClientInitializationError: Can't reach database server at ...`
- API calls hang indefinitely or return `504 Gateway Timeout`.
- `npx prisma db push` fails with `P1001: Can't reach database server`.

### Cause
On the free tier, Supabase pauses projects that have received no queries for one week.

### Fix
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Look at your project card. If it displays **Paused**, click **Restore Project**.
3. Wait 1–2 minutes for the database instance to resume.
4. Re-run `npx prisma db push` or restart your local server.

---

## 2. Wrong Database Connection Strings

### Symptoms
- `Timed out fetching a new connection from the connection pool` on Vercel under moderate traffic.
- `Can't reach database server at pooler.supabase.com:6543`.
- Password authentication failed errors despite entering the correct password.

### Causes & Fixes

#### A. Special Characters in Database Password
If your database password contains characters such as `@`, `:`, `/`, `?`, or `#`, Prisma will misparse the URI.
- **Fix**: URL-encode special characters in your password (for example, replace `@` with `%40`, `#` with `%23`) or change your database password in **Project Settings > Database** to an alphanumeric password.

#### B. Direct Port Used Instead of Pooler
If `DATABASE_URL` connects to port `5432` instead of port `6543` in serverless production, each lambda opens its own connection and quickly exhausts PostgreSQL's connection cap.
- **Fix**: Verify your `.env` and Vercel environment variables:
  - `DATABASE_URL` must use port `6543` with `?pgbouncer=true`.
  - `DIRECT_URL` must use port `5432` for schema pushes.

---

## 3. Storage RLS Policy Blocks ("403 Forbidden" or "Row-Level Security Violation")

### Symptoms
- Image or video uploads fail with `403 Forbidden`.
- Browser console shows: `new row violates row-level security policy for table "objects"`.

### Cause
By default, Supabase Storage enables Row Level Security (RLS) on the storage `objects` table. If no policies allow uploads, client uploads will be denied.

### Fix
1. Open your **Supabase Dashboard** > **Storage**.
2. Click **Policies** on the left menu.
3. Locate the `course-thumbnails` and `course-attachments` buckets.
4. Click **New Policy** on the bucket:
   - For public read access: Choose **Give users access to read any image** > Target role `public` > select `SELECT`.
   - For authenticated uploads: Choose **Give authenticated users access to insert** > Target role `authenticated` > select `INSERT`.
5. Alternatively, for development simplicity, click the three dots next to the bucket in the Storage view, choose **Edit bucket**, and toggle **Public bucket** to `ON`.

---

## 4. Authentication Redirect Loops

### Symptoms
- Navigating to `/dashboard` immediately redirects to `/login`, which immediately redirects back to `/dashboard`, repeating until the browser halts with `ERR_TOO_MANY_REDIRECTS`.

### Cause
The Next.js Edge Middleware and Server Components are out of sync regarding authentication cookies, or `supabaseResponse` is not returning updated session cookies.

### Fix
Ensure your `middleware.ts` sets cookies on both the request and the response as shown in [AUTH.md](AUTH.md):

```typescript
// Correct pattern inside middleware:
cookiesToSet.forEach(({ name, value }) =>
  request.cookies.set(name, value)
)
supabaseResponse = NextResponse.next({ request })
cookiesToSet.forEach(({ name, value, options }) =>
  supabaseResponse.cookies.set(name, value, options)
)
return supabaseResponse
```

Also verify that your login page redirects to `/dashboard` only when a user is confirmed, and your root route does not unselectively forward authenticated users into protected routes without checking session validity.

---

## 5. Email Confirmation Gotchas

### Symptoms
- A user signs up on `/register`, but cannot sign in; Supabase reports `Invalid login credentials` or the user session is `null`.

### Cause
Supabase Auth defaults to requiring email confirmation before an account is activated. If you have not configured custom SMTP, confirmation emails may be delayed or land in spam folders during local testing.

### Fix for Local Development
1. Open your **Supabase Dashboard**.
2. Navigate to **Authentication** > **Providers**.
3. Click on the **Email** provider.
4. Scroll to **Confirm email** and toggle it **OFF**.
5. Click **Save**.
6. Now, new user signups will be active immediately upon registration without waiting for an email confirmation link.

*(For production environments, keep email confirmation enabled and configure a custom SMTP provider in Supabase settings).*

---

## 6. TypeScript Compilation or Prisma Client Out-of-Sync

### Symptoms
- `Property 'course' does not exist on type 'User'` in your editor.
- Next.js build errors referencing missing Prisma model types.

### Fix
Re-generate the Prisma client whenever you edit `prisma/schema.prisma`:

```bash
npx prisma generate
```

If the development server is actively running, restart it to allow TypeScript to pick up the newly generated client definitions.

