import Link from "next/link"
import { Logo } from "@/components/shared/Logo"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand block */}
          <div className="space-y-4 md:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              EduFlow is an open, modern learning platform designed to make high-quality education accessible to anyone, anywhere. Learn practical skills through structured courses and interactive projects.
            </p>
            <div className="pt-2 text-xs text-zinc-500">
              Empowering learners with technology and open knowledge.
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/courses" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/courses?category=development" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/courses?category=design" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="/courses?category=business" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Business & Startup
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/about" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  About EduFlow
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Teach on EduFlow
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/sign-in" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            &copy; 2026 EduFlow Platform. Built with care for students and educators worldwide.
          </p>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <span>Designed for modern learning</span>
            <Heart className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
          </div>
        </div>
      </div>
    </footer>
  )
}

