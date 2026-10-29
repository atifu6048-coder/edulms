import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { Logo } from "@/components/shared/Logo"
import { SignOutButton } from "@/components/shared/sign-out-button"
import { MobileNav } from "@/components/shared/mobile-nav"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/courses"
              className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              Courses
            </Link>
            <Link
              href="/about"
              className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="rounded-xl border-zinc-300 dark:border-zinc-700">
                  <LayoutDashboard className="mr-1.5 h-4 w-4 text-indigo-600" />
                  Dashboard
                </Button>
              </Link>
              <SignOutButton className="text-zinc-600 hover:text-red-600 dark:text-zinc-400" />
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="rounded-xl font-medium">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="rounded-xl bg-indigo-600 font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger menu */}
        <MobileNav user={user} />
      </div>
    </header>
  )
}

