# Environment Variables Guide

This document explains every environment variable used in **EduFlow**, what each does, and the exact steps to locate its value inside the [Supabase Dashboard](https://supabase.com/dashboard).

---

## Overview of Variables

EduFlow requires only two categories of environment variables:
1. **Supabase Variables**: Credentials to connect to Supabase Auth, PostgreSQL (via Prisma), and Supabase Storage.
2. **Application URL**: The base URL of the running application used for authentication redirects and absolute links.

---

## Detailed Variable Reference

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **What it is**: The unique HTTPS API endpoint for your Supabase project. The `NEXT_PUBLIC_` prefix makes it accessible in both client-side browser code and server-side code.
- **Where to find it in Supabase**:
  1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
  2. Click the gear icon (**Project Settings**) at the bottom of the left sidebar.
  3. Under the **Configuration** menu, click **API**.
  4. Look for the **Project URL** box. Copy the URL (it looks like `https://abcdefghijklm.supabase.co`).

---

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **What it is**: The public anonymous client API key. It is safe to expose in client-side code because database operations are secured by Row Level Security (RLS) policies and authenticated user sessions.
- **Where to find it in Supabase**:
  1. Navigate to **Project Settings** > **API**.
  2. Under the **Project API keys** section, locate the row labeled `anon` / `public`.
  3. Click **Copy** to copy the token.

---

### 3. `SUPABASE_SERVICE_ROLE_KEY`
- **What it is**: The privileged administrative key. It bypasses Row Level Security and has full access to your database. **Never expose this key in client-side code, git repositories, or public files.** It is used exclusively in secure Server Actions or background server operations.
- **Where to find it in Supabase**:
  1. Navigate to **Project Settings** > **API**.
  2. Under **Project API keys**, locate the row labeled `service_role` / `secret`.
  3. Click **Reveal** and then **Copy**.

---

### 4. `DATABASE_URL`
- **What it is**: The pooled PostgreSQL connection string used by Prisma for application queries. EduFlow uses Supabase's connection pooler (**Supavisor**) in Transaction mode on port `6543`. This prevents serverless Next.js functions from exhausting database connections under concurrent traffic.
- **Where to find it in Supabase**:
  1. Navigate to **Project Settings** > **Database**.
  2. Scroll down to the **Connection string** section.
  3. Select the **URI** tab.
  4. Ensure the dropdown is set to **Transaction** mode (port `6543`).
  5. Copy the connection string. It resembles:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
  6. Replace `[YOUR-PASSWORD]` with the actual database password you chose during project creation.

---

### 5. `DIRECT_URL`
- **What it is**: The direct, unpooled PostgreSQL connection string on port `5432`. Prisma uses this variable exclusively for running schema pushes and migrations (`npx prisma db push`), which require a continuous session that cannot run through a transaction pooler.
- **Where to find it in Supabase**:
  1. Navigate to **Project Settings** > **Database**.
  2. In the **Connection string** section, select the **URI** tab.
  3. Change the dropdown mode to **Session** (or direct connection, port `5432`).
  4. Copy the connection string. It resembles:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
  5. Replace `[YOUR-PASSWORD]` with your actual database password.

---

### 6. `NEXT_PUBLIC_APP_URL`
- **What it is**: The canonical root URL of the EduFlow application. This is used by Supabase Auth for email confirmation redirects, password reset links, and OAuth callbacks.
- **How to configure**:
  - **Local Development**: `http://localhost:3000`
  - **Production (Vercel)**: `https://your-production-domain.vercel.app` (or your custom domain).

---

## Complete `.env.example` Block

Create a file named `.env` in the root of your project and paste the following template:

```env
# -----------------------------------------------------------------------------
# Supabase API Credentials
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key-here"

# -----------------------------------------------------------------------------
# Database Connections (Prisma ORM)
# -----------------------------------------------------------------------------
# Pooled connection string (Port 6543, Transaction mode with pgbouncer=true)
DATABASE_URL="postgresql://postgres.your-project-ref:your-db-password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection string for schema migrations (Port 5432)
DIRECT_URL="postgresql://postgres.your-project-ref:your-db-password@aws-0-region.pooler.supabase.com:5432/postgres"

# -----------------------------------------------------------------------------
# Application URL
# -----------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

