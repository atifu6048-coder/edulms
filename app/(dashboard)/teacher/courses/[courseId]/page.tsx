import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, BookOpen, Clock, FileEdit, LayoutDashboard, Sparkles } from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CourseIdPageProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  const { courseId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId: user.id,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  })

  if (!course) {
    return notFound()
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/teacher/courses"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to course list
        </Link>
        <div className="flex items-center gap-2">
          {course.isPublished ? (
            <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/30">
              Published
            </Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {course.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Course ID: <span className="font-mono text-xs">{course.id}</span>
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Course Editor Workspace</h2>
            <p className="text-sm text-muted-foreground">
              Customize course description, upload thumbnails, manage chapters, and publish.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="rounded-xl border bg-muted/20 p-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </span>
            <p className="text-lg font-semibold mt-1">
              {course.isPublished ? "Live in Catalog" : "Draft (Hidden)"}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/20 p-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Curriculum
            </span>
            <p className="text-lg font-semibold mt-1">
              {course.chapters.length} {course.chapters.length === 1 ? "Chapter" : "Chapters"}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/20 p-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pricing
            </span>
            <p className="text-lg font-semibold mt-1">
              {course.price ? `$${course.price.toFixed(2)}` : "Free"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
