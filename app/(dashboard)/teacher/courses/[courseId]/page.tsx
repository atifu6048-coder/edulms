import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  ImageIcon,
  Sparkles,
} from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { TitleForm } from "@/components/teacher/courses/TitleForm"
import { DescriptionForm } from "@/components/teacher/courses/DescriptionForm"
import { CategoryForm } from "@/components/teacher/courses/CategoryForm"
import { LevelForm } from "@/components/teacher/courses/LevelForm"
import { ImageUpload } from "@/components/teacher/courses/ImageUpload"
import { ChapterList } from "@/components/teacher/courses/ChapterList"
import { CourseActions } from "@/components/teacher/courses/CourseActions"

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
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      category: true,
    },
  })

  if (!course) {
    return notFound()
  }

  // Ownership verification: user must own this course or be platform admin
  const isOwner = course.userId === user.id
  const isAdmin = user.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    redirect("/teacher/courses")
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const requiredFields = [
    Boolean(course.title),
    Boolean(course.description),
    Boolean(course.imageUrl),
    Boolean(course.categoryId),
    Boolean(course.level),
    course.chapters.some((chapter) => chapter.isPublished),
  ]

  const totalFields = requiredFields.length // 6
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`
  const isComplete = requiredFields.every(Boolean)

  return (
    <div className="flex flex-col">
      {/* 3. Completion banner at top */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b px-6 py-3.5 text-sm ${
          isComplete
            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
            : "bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/20"
        }`}
      >
        <div className="flex items-center gap-x-2">
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <span>
            {course.isPublished
              ? "This course is published and live in the public catalog."
              : "This course is currently unpublished. It will not be visible to students until published."}
          </span>
        </div>
        <div className="flex items-center gap-x-2 font-semibold">
          <span>Complete all fields to publish {completionText}</span>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/teacher/courses"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to courses
          </Link>
          <div className="flex items-center gap-x-3">
            {course.isPublished ? (
              <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/30">
                Published
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-muted-foreground">
                Draft
              </Badge>
            )}
            {/* 4. Delete course button */}
            <CourseActions courseId={course.id} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Course Setup
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete all fields to publish {completionText}
          </p>
        </div>

        {/* 2. Inline-editable sections & placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Left Column: Course Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-x-2 text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Customize your course</h2>
            </div>

            <TitleForm
              initialData={{ title: course.title }}
              courseId={course.id}
            />

            <DescriptionForm
              initialData={{ description: course.description }}
              courseId={course.id}
            />

            <ImageUpload
              initialData={{ imageUrl: course.imageUrl }}
              courseId={course.id}
            />

            <CategoryForm
              initialData={{ categoryId: course.categoryId }}
              courseId={course.id}
              options={categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />

            <LevelForm
              initialData={{ level: course.level }}
              courseId={course.id}
            />
          </div>

          {/* Right Column: Chapters & Curriculum */}
          <div className="space-y-6">
            <div className="flex items-center gap-x-2 text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ListChecks className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Course chapters</h2>
            </div>

            <ChapterList
              items={course.chapters}
              courseId={course.id}
            />

            {/* Course status quick overview */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Checklist Checklist</span>
              </div>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className={course.title ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                    {course.title ? "✓" : "○"}
                  </span>
                  <span>Title configured</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={course.description ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                    {course.description ? "✓" : "○"}
                  </span>
                  <span>Description added</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={course.imageUrl ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                    {course.imageUrl ? "✓" : "○"}
                  </span>
                  <span>Thumbnail image uploaded</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={course.categoryId ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                    {course.categoryId ? "✓" : "○"}
                  </span>
                  <span>Category assigned</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={course.level ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                    {course.level ? "✓" : "○"}
                  </span>
                  <span>Difficulty level selected</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={course.chapters.some((c) => c.isPublished) ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                    {course.chapters.some((c) => c.isPublished) ? "✓" : "○"}
                  </span>
                  <span>At least one published chapter</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
