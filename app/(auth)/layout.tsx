import * as React from "react"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-zinc-900 dark:text-zinc-50 font-bold">EduFlow</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

