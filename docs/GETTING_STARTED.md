# Getting Started with EduFlow

This guide takes you from zero to a fully functional local development environment for **EduFlow**. Even if you have never built a Next.js application before, follow these steps in order to get up and running smoothly.

---

## 1. Required Accounts

Before installing software, register for these three free services:

### Account 1: GitHub
- **Website**: [github.com](https://github.com/)
- **Purpose**: Hosts your Git repository and enables continuous deployment with Vercel.

### Account 2: Supabase
- **Website**: [supabase.com](https://supabase.com/)
- **Purpose**: Powers the PostgreSQL database, user authentication (Supabase Auth), and asset storage (Supabase Storage buckets for course thumbnails and lesson attachments).

### Account 3: Vercel
- **Website**: [vercel.com](https://vercel.com/)
- **Purpose**: Hosts and serves your Next.js application in production. Log in using your GitHub account for seamless integration.

---

## 2. Local Machine Prerequisites

Ensure the following tools are installed on your computer:

1. **Node.js (LTS version 20 or higher)**:
   - Check if installed:
     ```bash
     node -v
     ```
   - If not installed, download from [nodejs.org](https://nodejs.org/).
2. **npm** (included with Node.js):
   - Check if installed:
     ```bash
     npm -v
     ```
3. **Git**:
   - Check if installed:
     ```bash
     git --version
     ```
   - If not installed, download from [git-scm.com](https://git-scm.com/).

---

## 3. Clone and Install Dependencies

1. Open your terminal or command prompt.
2. Clone your repository:
   ```bash
   git clone https://github.com/your-username/eduflow.git
   cd eduflow
   ```
3. Install all npm dependencies:
   ```bash
   npm install
   ```

---

## 4. Set Up Your Supabase Project

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**.
3. Choose an organization, enter a name (e.g., `eduflow-dev`), and set a strong database password (keep this password saved).
4. Select a region close to you or your target users.
5. Click **Create new project** and wait 1–2 minutes for provisioning to finish.

### Create Storage Buckets
EduFlow uses Supabase Storage for files:
1. In the Supabase left navigation bar, click **Storage**.
2. Click **New Bucket**.
3. Name the bucket `course-thumbnails`, check **Public bucket**, and click **Save**.
4. Click **New Bucket** again, name it `course-attachments`, check **Public bucket** (or private with download URLs), and click **Save**.

---

## 5. Configure Environment Variables

1. In the project root, make a copy of `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in your code editor.
3. Retrieve your values from the Supabase dashboard (detailed navigation instructions are in [ENVIRONMENT.md](ENVIRONMENT.md)):
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL found under **Project Settings > API**.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Anon key found under **Project Settings > API**.
   - `SUPABASE_SERVICE_ROLE_KEY`: Secret service role key found under **Project Settings > API**.
   - `DATABASE_URL`: Connection string found under **Project Settings > Database > Connection string** (Transaction pooler, port 6543).
   - `DIRECT_URL`: Direct connection string found under **Project Settings > Database > Connection string** (Session or direct, port 5432).
   - `NEXT_PUBLIC_APP_URL`: Set to `http://localhost:3000` for local development.

---

## 6. Sync Database Schema with Prisma

EduFlow manages database tables through Prisma schema definitions.

1. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
2. Push the schema to your Supabase PostgreSQL database:
   ```bash
   npx prisma db push
   ```
   > **Note**: `npx prisma db push` reads your schema file located at `prisma/schema.prisma` and creates all tables, foreign key constraints, and enums directly in Supabase without requiring manual migration files.

3. (Optional) Open Prisma Studio to browse your tables visually:
   ```bash
   npx prisma studio
   ```
   This opens an admin UI at [http://localhost:5555](http://localhost:5555).

---

## 7. Seed Initial Data

To load starter categories and sample courses into your database:

1. Run the seed script:
   ```bash
   npm run seed
   ```
   *(If a dedicated npm script is not present in package.json, run: `npx ts-node prisma/seed.ts`)*.
2. The seed script creates initial categories (such as Web Development, Data Science, Design, Business) so you can immediately begin creating and browsing courses.

---

## 8. Run the Development Server

1. Start the Next.js development server:
   ```bash
   npm run dev
   ```
2. Your terminal will display:
   ```text
   ▲ Next.js 16.x (Turbopack)
   - Local: http://localhost:3000
   ✓ Ready in 1.2s
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```
4. You should see the EduFlow landing page.

---

## Next Steps

- Read [ENVIRONMENT.md](ENVIRONMENT.md) for details on all configuration parameters.
- Read [AUTH.md](AUTH.md) to understand how user authentication and admin roles work.
- Read [DATABASE.md](DATABASE.md) to explore the data models.

