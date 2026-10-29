"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Settings,
  BookOpenCheck,
  Users,
  BarChart3,
  Shield,
  UserCheck,
  Layers,
  FolderTree,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/Logo"
import { Badge } from "@/components/ui/badge"

interface DashboardSidebarProps {
  user: {
    id: string
    email: string
    fullName: string | null
    role: string
    avatarUrl?: string | null
  }
  onNavigate?: () => void
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

export function DashboardSidebar({
  user,
  onNavigate,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const role = user.role

  const isTeacherOrAdmin =
    role === "INSTRUCTOR" || role === "TEACHER" || role === "ADMIN"
  const isAdmin = role === "ADMIN"

  const sections: NavSection[] = []

  // 1. Teacher section (TEACHER and ADMIN)
  if (isTeacherOrAdmin) {
    sections.push({
      title: "Instructor",
      items: [
        { title: "Dashboard", href: "/teacher", icon: LayoutDashboard },
        { title: "Courses", href: "/teacher/courses", icon: BookOpenCheck },
        { title: "Students", href: "/teacher/students", icon: Users },
        { title: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
        { title: "Settings", href: "/teacher/settings", icon: Settings },
      ],
    })
  }

  // 2. Student section (all students, or visible to all roles as learners)
  sections.push({
    title: "Student Portal",
    items: [
      { title: "Dashboard", href: "/student", icon: LayoutDashboard },
      { title: "My Courses", href: "/student/my-courses", icon: BookOpen },
      { title: "Certificates", href: "/student/certificates", icon: Award },
      { title: "Settings", href: "/student/settings", icon: Settings },
    ],
  })

  // 3. Admin section (ADMIN only)
  if (isAdmin) {
    sections.push({
      title: "Administration",
      items: [
        { title: "Overview", href: "/admin", icon: Shield },
        { title: "Users", href: "/admin/users", icon: UserCheck },
        { title: "Courses", href: "/admin/courses", icon: Layers },
        { title: "Categories", href: "/admin/categories", icon: FolderTree },
      ],
    })
  }

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      {/* Brand logo header */}
      <div className="flex h-16 items-center px-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Logo />
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 text-[11px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/student" &&
                    item.href !== "/teacher" &&
                    item.href !== "/admin" &&
                    pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-300"
                        : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-indigo-500" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User profile card at bottom */}
      <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-xs text-white">
            {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {user.fullName || user.email.split("@")[0]}
            </p>
            <div className="mt-0.5">
              <Badge
                variant="outline"
                className={cn(
                  "px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wider",
                  isAdmin
                    ? "border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                    : isTeacherOrAdmin
                    ? "border-purple-500/30 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
                    : "border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                )}
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
