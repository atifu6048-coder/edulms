# Production Deployment Guide

This guide walks you through deploying **EduFlow** to production using **GitHub**, **Vercel**, and **Supabase**.

---

## 1. Push Code to GitHub

1. If you have not initialized a Git repository yet, run:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of EduFlow LMS"
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `eduflow`.
3. Link your local repo and push:
   ```bash
   git remote add origin https://github.com/your-username/eduflow.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Prepare the Supabase Production Database

Before linking Vercel, push your Prisma database schema to your Supabase PostgreSQL instance:

```bash
npx prisma db push
```

Verify that all tables (`users`, `categories`, `courses`, `chapters`, `user_progress`, `attachments`, `enrollments`) appear in the **Table Editor** of your Supabase dashboard.

---

## 3. Import Project into Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/) with your GitHub account.
2. Click **Add New...** > **Project**.
3. Locate `eduflow` under **Import Git Repository** and click **Import**.
4. In the **Configure Project** window:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `next build` (leave default; Prisma client is generated automatically or via `postinstall`)
   - **Output Directory**: `.next` (leave default)

---

## 4. Configure Production Environment Variables in Vercel

Before clicking **Deploy**, expand the **Environment Variables** section in Vercel and enter the following exact variables:

| Variable Name | Value Description | Crucial Detail |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (`https://xyz.supabase.co`) | Visible in client browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase `anon` / `public` API key | Visible in client browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` secret key | Kept secret on server only. |
| `DATABASE_URL` | **Pooled Supavisor connection string (Port 6543)** | **MUST BE POOLED:** In serverless environments like Vercel, using direct connections will quickly exhaust PostgreSQL connection limits. Use the transaction pooler with `?pgbouncer=true`. |
| `DIRECT_URL` | Direct PostgreSQL connection string (Port 5432) | Used for migration commands and schema sync. |
| `NEXT_PUBLIC_APP_URL` | Your production Vercel URL (e.g., `https://eduflow.vercel.app`) | Used for auth redirects and email links. |

Click **Deploy**. Vercel will build your Next.js application and provide you with a production domain (e.g., `https://eduflow.vercel.app`).

---

## 5. Configure Supabase Auth Redirect URLs

To ensure users can log in, register, and confirm their emails on your live domain:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** in the left sidebar.
3. Click **URL Configuration**.
4. Under **Site URL**, change `http://localhost:3000` to your live Vercel URL:
   ```text
   https://eduflow.vercel.app
   ```
5. Under **Redirect URLs**, click **Add URL** and add the following allowed callback paths:
   ```text
   https://eduflow.vercel.app/**
   https://eduflow.vercel.app/callback
   http://localhost:3000/**
   ```
   *(Keeping `localhost:3000` ensures your local development authentication continues to work).*
6. Click **Save**.

---

## 6. Live-Site Smoke Test Checklist

Once the deployment finishes, run through this checklist to ensure all production features work:

- [ ] **Homepage Load**: Visit `https://your-domain.vercel.app`. Does the homepage render with correct styles and fonts?
- [ ] **User Registration**: Register a new student account using an email address and password.
- [ ] **Authentication Callback**: Confirm that you are logged in and redirected to `/dashboard`.
- [ ] **Database Row Creation**: Check Supabase Table Editor (`public.users`). Is a row created with the matching Auth UUID?
- [ ] **Admin Assignment**: Run the SQL snippet from [AUTH.md](AUTH.md) to promote your user to `ADMIN`.
- [ ] **Course Creation**: Access `/instructor/courses/create`. Create a new course title.
- [ ] **Thumbnail Upload**: Upload a course thumbnail image and verify it displays properly from the `course-thumbnails` Supabase Storage bucket.
- [ ] **Chapter Management**: Add a chapter, edit its title, and test drag-and-drop reordering.
- [ ] **Publishing**: Publish the chapter, then publish the course.
- [ ] **Public Catalog**: Visit `/courses` in an incognito window. Does the newly published course appear?
- [ ] **Student Enrollment**: Sign in as a regular student and click **Enroll Now**. Does the course appear in the student's dashboard?
- [ ] **Progress Tracking**: Open a lesson and mark it completed. Does the progress bar update accurately?

