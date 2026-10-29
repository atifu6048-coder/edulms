"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Home, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SignOutButton } from "@/components/shared/sign-out-button"
import { Badge } from "@/components/ui/badge"

interface DashboardTopbarProps {
  user: {
    id: string
    email: string
    fullName: string | null
    role: string
    avatarUrl?: string | null
  }
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      {/* Left side: Mobile menu trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Sheet Trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl"
                aria-label="Open sidebar navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <DashboardSidebar user={user} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Home quick link */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-indigo-600 transition-colors dark:text-zinc-400"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
          <ExternalLink className="h-3 w-3 opacity-60" />
        </Link>
      </div>

      {/* Right side: User Profile & Sign Out */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-xs text-white shadow-xs">
            {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {user.fullName || user.email.split("@")[0]}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold">
                {user.role}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[160px]">
              {user.email}
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        <SignOutButton className="rounded-xl text-zinc-600 hover:text-red-600 dark:text-zinc-400" />
      </div>
    </header>
  )
}
