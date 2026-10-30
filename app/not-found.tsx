import Link from "next/link"
import { Compass, Home, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm">
          <Compass className="h-12 w-12 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
            404 Error
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The curriculum module, page, or resource you are looking for does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline" className="w-full sm:w-auto font-medium shadow-xs">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button asChild className="w-full sm:w-auto font-semibold shadow-xs">
            <Link href="/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
