import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      {/* Navigation */}
      <header className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span>EduFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Modern Learning Management System
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-2xl leading-tight">
          Master new skills with structured learning.
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
          EduFlow empowers students and instructors with seamless curriculum tracking, video lessons, and interactive course management.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/sign-up">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Start learning today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign in to your account
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-base mb-1">Curated Courses</h3>
            <p className="text-sm text-zinc-500">
              Structured chapters, downloadable resources, and progress tracking.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <ShieldCheck className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-base mb-1">Role-Based Access</h3>
            <p className="text-sm text-zinc-500">
              Secure portals for students, instructors, and platform administrators.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <Sparkles className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-base mb-1">Built with Next.js</h3>
            <p className="text-sm text-zinc-500">
              Powered by Server Components, Supabase Auth, and Prisma ORM.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
      </footer>
    </div>
  );
}
