"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, BookOpen, Info, Mail, LayoutDashboard, LogIn, UserPlus } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"
import { SignOutButton } from "@/components/shared/sign-out-button"

interface MobileNavProps {
  user: {
    id: string
    email: string
    fullName: string | null
    role: string
  } | null
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <SheetHeader className="text-left pb-4 border-b">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-2 font-medium">
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-700 hover:text-indigo-600 hover:bg-zinc-100 transition-colors dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-700 hover:text-indigo-600 hover:bg-zinc-100 transition-colors dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-700 hover:text-indigo-600 hover:bg-zinc-100 transition-colors dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 transition-colors dark:bg-indigo-950/50 dark:text-indigo-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-6 border-t flex flex-col gap-3">
          {user ? (
            <div className="space-y-3">
              <div className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <p className="text-xs text-zinc-500">Signed in as</p>
                <p className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100">
                  {user.fullName || user.email}
                </p>
              </div>
              <SignOutButton className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full justify-center rounded-xl">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setOpen(false)}>
                <Button className="w-full justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

