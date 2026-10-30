# EduFlow

EduFlow is an open, modern Learning Management System (LMS) built for instructors, students, and administrators. It provides an end-to-end learning platform where instructors create structured courses, upload curriculum media and resources, and track learner progress, while students can browse courses, enroll, track their progress, and complete lessons.

---

## The Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/) & [Recharts](https://recharts.org/)
- **Drag and Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for curriculum reordering
- **Database & Auth & Storage**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Supabase Storage buckets)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Hosting**: [Vercel](https://vercel.com/)
- **Source Control**: [GitHub](https://github.com/)

---

## Quickstart: Running Locally

### Prerequisites
1. **Node.js**: v20 or higher installed on your computer.
2. **Git**: Installed and configured.
3. **Accounts**: GitHub and Supabase accounts.

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atifu6048-coder/edulms.git
   cd edulms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase connection strings, API keys, and local app URL. Detailed instructions can be found in [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

4. **Push database schema to Supabase**:
   ```bash
   npx prisma db push
   ```

5. **(Optional) Seed initial data**:
   ```bash
   npm run seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000) to see EduFlow running.

---

## Documentation Index

Explore the comprehensive guides in the [`docs/`](docs/) directory:

| Document | Description |
| :--- | :--- |
| [**GETTING_STARTED.md**](docs/GETTING_STARTED.md) | Zero-to-running walkthrough: prerequisites, accounts, env configuration, schema push, seed, and dev server. |
| [**ENVIRONMENT.md**](docs/ENVIRONMENT.md) | Exhaustive breakdown of each environment variable, where to locate it in Supabase, and a clean `.env.example`. |
| [**STRUCTURE.md**](docs/STRUCTURE.md) | Project directory and file tree with clear one-line annotations of responsibilities. |
| [**DATABASE.md**](docs/DATABASE.md) | Complete Prisma schema containing models, relations, enums, indexes, and Auth UUID integration. |
| [**AUTH.md**](docs/AUTH.md) | Supabase Auth implementation: client/server/route helpers, role-based middleware, user synchronization, and admin SQL snippets. |
| [**API.md**](docs/API.md) | Full API route catalog covering HTTP methods, role permissions, request payloads, and response structures. |
| [**DEPLOYMENT.md**](docs/DEPLOYMENT.md) | Production launch guide: GitHub setup, Vercel import, Supavisor connection pooling, redirect URLs, and smoke testing. |
| [**TROUBLESHOOTING.md**](docs/TROUBLESHOOTING.md) | Common beginner errors and proven solutions for paused projects, connection issues, RLS policies, and auth redirects. |
| [**CONTRIBUTING.md**](docs/CONTRIBUTING.md) | Coding conventions, UI component blueprint, API route template, and conventional commit guidelines. |

---

## License

MIT
