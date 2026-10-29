import * as React from "react"
import Link from "next/link"
import { GraduationCap, LogOut, BookOpen, LayoutDashboard, User } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-30 border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span>EduFlow</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link href="/dashboard" className="text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 hover:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/courses" className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 hover:text-primary">
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-semibold text-xs">
                {user.fullName ? user.fullName[0].toUpperCase() : "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-medium text-xs leading-none">{user.fullName || "Student"}</p>
                <p className="text-[10px] text-zinc-500 leading-none mt-1">{user.role}</p>
              </div>
            </div>
            <form action="/api/auth/sign-out" method="POST">
              <button
                type="submit"
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}

