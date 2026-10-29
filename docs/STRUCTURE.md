# Project Structure

This document outlines the directory structure and file organization of **EduFlow**. Each folder and primary file includes a one-line description of its responsibility.

```text
eduflow/
├── app/                                # Next.js App Router root containing all routes and layouts
│   ├── (admin)/                        # Protected route group for platform administrators
│   │   ├── admin/
│   │   │   ├── categories/page.tsx     # Manage course categories (create, rename, delete)
│   │   │   ├── users/page.tsx          # Manage user accounts and role assignments
│   │   │   └── page.tsx                # Admin overview dashboard and platform metrics
│   │   └── layout.tsx                  # Admin layout containing administrative navigation and sidebar
│   ├── (auth)/                         # Authentication route group with centered minimal layout
│   │   ├── callback/route.ts           # Route handler exchanging auth code for session tokens
│   │   ├── login/page.tsx              # Sign-in page with email/password and social login
│   │   ├── register/page.tsx           # Registration page for new students and instructors
│   │   ├── reset-password/page.tsx     # Password recovery and reset request page
│   │   └── layout.tsx                  # Centered authentication shell layout
│   ├── (dashboard)/                    # Student-facing learning portal
│   │   ├── courses/
│   │   │   ├── [courseId]/
│   │   │   │   ├── chapters/[chapterId]/page.tsx  # Course player view displaying active lesson and media
│   │   │   │   └── page.tsx            # Course overview, syllabus, and enrollment trigger
│   │   │   └── page.tsx                # Course catalog and search exploration page
│   │   ├── dashboard/page.tsx          # Enrolled courses overview and progress tracker
│   │   ├── profile/page.tsx            # Student profile settings and avatar management
│   │   └── layout.tsx                  # Main dashboard layout with sidebar and user navigation
│   ├── (instructor)/                   # Protected route group for course instructors
│   │   ├── instructor/
│   │   │   ├── analytics/page.tsx      # Revenue, enrollment metrics, and course engagement charts
│   │   │   ├── courses/
│   │   │   │   ├── [courseId]/
│   │   │   │   │   ├── chapters/[chapterId]/page.tsx # Chapter content editor and attachment uploader
│   │   │   │   │   └── page.tsx        # Course details, pricing, and curriculum organizer
│   │   │   │   ├── create/page.tsx     # Wizard page to initiate a new course draft
│   │   │   │   └── page.tsx            # List of all courses authored by the logged-in instructor
│   │   │   └── page.tsx                # Instructor quick-start overview page
│   │   └── layout.tsx                  # Instructor dashboard layout with author-focused navigation
│   ├── api/                            # Next.js backend API route handlers
│   │   ├── admin/
│   │   │   ├── categories/route.ts     # Create, update, or remove categories (admin only)
│   │   │   └── users/[userId]/route.ts # Change user roles and account statuses
│   │   ├── courses/
│   │   │   ├── [courseId]/
│   │   │   │   ├── attachments/route.ts # Manage chapter downloadable files in Supabase Storage
│   │   │   │   ├── chapters/
│   │   │   │   │   ├── [chapterId]/
│   │   │   │   │   │   ├── progress/route.ts # Mark chapter completed or uncompleted for a user
│   │   │   │   │   │   ├── publish/route.ts  # Publish or unpublish an individual chapter
│   │   │   │   │   │   └── route.ts          # Update chapter details, video URL, or delete chapter
│   │   │   │   │   ├── reorder/route.ts      # Update display order of chapters via drag-and-drop
│   │   │   │   │   └── route.ts              # Create a new chapter within a course
│   │   │   │   ├── enroll/route.ts     # Process student course enrollment
│   │   │   │   ├── publish/route.ts    # Publish or unpublish an entire course
│   │   │   │   └── route.ts            # Fetch, update, or delete a course
│   │   │   └── route.ts                # List public courses or create a new course draft
│   │   └── upload/route.ts             # Generate pre-signed Supabase Storage upload targets
│   ├── favicon.ico                     # Browser tab icon
│   ├── globals.css                     # Global Tailwind CSS imports, color tokens, and base styling
│   ├── layout.tsx                      # Root application layout wrapping providers and toaster
│   ├── not-found.tsx                   # Custom 404 page for missing routes
│   └── page.tsx                        # Public landing page with featured courses and hero banner
├── components/                         # Reusable React UI components
│   ├── auth/                           # Authentication UI elements (login form, register form, auth buttons)
│   ├── courses/                        # Course viewer components (course cards, video player, progress bar)
│   ├── instructor/                     # Authoring components (curriculum drag-and-drop list, chapter form)
│   ├── providers/                      # Context providers (Toaster provider, Theme provider)
│   ├── shared/                         # Layout components (navbar, sidebar, search input, footer, user menu)
│   └── ui/                             # shadcn/ui primitive components (button, dialog, card, tabs, etc.)
├── docs/                               # Comprehensive project documentation files
│   ├── API.md                          # API endpoints, request/response structures, and permissions
│   ├── AUTH.md                         # Supabase Auth architecture, helpers, and role protection
│   ├── CONTRIBUTING.md                 # Coding guidelines, component templates, and commit conventions
│   ├── DATABASE.md                     # Complete Prisma schema definition, models, and relations
│   ├── DEPLOYMENT.md                   # Production deployment guide for GitHub, Vercel, and Supabase
│   ├── ENVIRONMENT.md                  # Environment variables reference and .env.example
│   ├── GETTING_STARTED.md              # Beginner setup instructions from zero to running locally
│   ├── STRUCTURE.md                    # Project directory and file map (this file)
│   └── TROUBLESHOOTING.md              # Common setup pitfalls, error messages, and resolutions
├── hooks/                              # Custom React hooks (e.g., useDebounce, useMediaQuery)
├── lib/                                # Core utilities, clients, and backend helper libraries
│   ├── supabase/                       # Supabase client factory functions
│   │   ├── client.ts                   # Browser Supabase client helper using @supabase/ssr
│   │   ├── middleware.ts               # Middleware session refresher and cookie sync helper
│   │   └── server.ts                   # Server Component and Server Action Supabase client helper
│   ├── auth.ts                         # getCurrentUser() helper with automatic DB record synchronization
│   ├── prisma.ts                       # Global PrismaClient singleton instance
│   └── utils.ts                        # Styling utility combining clsx and tailwind-merge (cn helper)
├── prisma/                             # Database schema and migration management
│   ├── schema.prisma                   # Complete Prisma schema models, fields, enums, and relations
│   └── seed.ts                         # Database seeding script for default categories and sample records
├── public/                             # Static public assets served at root
│   ├── images/                         # Default course placeholders and platform graphics
│   └── logos/                          # EduFlow brand assets and svg icons
├── .env.example                        # Template of required environment variables without secrets
├── .gitignore                          # Files and directories ignored by Git (node_modules, .env, .next)
├── components.json                     # shadcn/ui configuration file defining style and alias mappings
├── middleware.ts                       # Edge middleware intercepting requests for auth and role checks
├── next.config.ts                      # Next.js framework configuration options
├── package.json                        # Project dependencies, scripts, and package metadata
├── README.md                           # Project landing documentation, overview, and getting started link
└── tsconfig.json                       # TypeScript compiler settings and path aliases (@/*)
```

