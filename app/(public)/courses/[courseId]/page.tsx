import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BookOpen,
  Users,
  BarChart,
  Lock,
  PlayCircle,
  Sparkles,
  Layers,
  ArrowLeft,
} from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { EnrollButton } from "@/components/courses/EnrollButton"

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { title: true, description: true },
  })

  if (!course) {
    return { title: "Course Not Found - EduFlow" }
  }

  return {
    title: `${course.title} - EduFlow`,
    description: course.description || "Learn with EduFlow's interactive curriculum.",
  }
}

export default async function PublicCourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = await params
  const user = await getCurrentUser()

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          email: true,
        },
      },
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
      _count: {
        select: {
          enrollments: true,
          chapters: {
            where: { isPublished: true },
          },
        },
      },
    },
  })

  if (!course) {
    return notFound()
  }

  // Check enrollment status for signed-in user
  let isEnrolled = false
  let targetChapterId = course.chapters[0]?.id

  if (user) {
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    })
    isEnrolled = !!enrollment

    if (isEnrolled && course.chapters.length > 0) {
      const chapterIds = course.chapters.map((ch) => ch.id)
      const userProgress = await db.userProgress.findMany({
        where: {
          userId: user.id,
          chapterId: { in: chapterIds },
          isCompleted: true,
        },
        select: {
          chapterId: true,
        },
      })
      const completedSet = new Set(userProgress.map((p) => p.chapterId))
      const firstIncomplete = course.chapters.find((ch) => !completedSet.has(ch.id))
      targetChapterId = firstIncomplete ? firstIncomplete.id : course.chapters[0].id
    }
  }

  const teacherName = course.user?.fullName || "EduFlow Instructor"
  const teacherInitial = teacherName.charAt(0).toUpperCase()

  const formatLevel = (lvl?: string | null) => {
    if (!lvl) return "All Levels"
    switch (lvl.toUpperCase()) {
      case "BEGINNER":
        return "Beginner"
      case "INTERMEDIATE":
        return "Intermediate"
      case "ADVANCED":
        return "Advanced"
      default:
        return lvl
    }
  }

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all courses
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {course.category && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                  {course.category.name}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {formatLevel(course.level)}
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-none text-xs font-semibold">
                {course.price === null || course.price === 0 ? "Free Access" : `$${course.price}`}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              {course.title}
            </h1>

            {course.description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/80">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Curriculum</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {course.chapters.length} {course.chapters.length === 1 ? "Chapter" : "Chapters"}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Students</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {course._count.enrollments} Enrolled
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BarChart className="h-4 w-4 text-primary" />
                  <span>Difficulty</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {formatLevel(course.level)}
                </p>
              </div>
            </div>

            {/* Big Action Button (Mobile & Desktop) */}
            <div className="pt-2">
              <EnrollButton
                courseId={course.id}
                firstChapterId={course.chapters[0]?.id}
                targetChapterId={targetChapterId}
                isEnrolled={isEnrolled}
                isSignedIn={Boolean(user)}
              />
            </div>
          </div>

          {/* Right: Course Thumbnail Card */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5 text-muted-foreground">
                    <Layers className="h-16 w-16 text-primary/40" />
                  </div>
                )}
              </div>

              {/* Teacher Card */}
              <div className="p-6 border-t border-border/80 space-y-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Lead Instructor
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold text-base">
                    {course.user?.avatarUrl ? (
                      <Image
                        src={course.user.avatarUrl}
                        alt={teacherName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>{teacherInitial}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {teacherName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Educator & Specialist at EduFlow
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus / Chapter List Section */}
        <div className="pt-8 space-y-6">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Structured Syllabus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Course Curriculum
            </h2>
            <p className="text-sm text-muted-foreground">
              {course.chapters.length} lessons designed to guide you step-by-step from foundations to mastery.
            </p>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden divide-y divide-border/60">
            {course.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 sm:p-5 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                      {chapter.title}
                    </h4>
                    {chapter.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {chapter.isFree ? (
                    <Badge className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold gap-1">
                      <PlayCircle className="h-3 w-3" />
                      Free preview
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="hidden sm:inline">Members only</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

