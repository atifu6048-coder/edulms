import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ContinueLearning } from "@/components/student/dashboard/ContinueLearning"
import { EmptyState } from "@/components/shared/EmptyState"

export const metadata: Metadata = {
  title: "Student Dashboard - EduFlow",
  description: "Track your course progress, enrolled curricula, and certifications.",
}

export default async function StudentDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch student enrollments with published chapters & category
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          category: true,
          chapters: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch all progress records for the student
  const allProgress = await db.userProgress.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      chapter: {
        select: {
          id: true,
          courseId: true,
          title: true,
          position: true,
        },
      },
    },
  })

  const completedChapterIds = new Set(
    allProgress.filter((p) => p.isCompleted).map((p) => p.chapterId)
  )

  // Calculate statistics
  const coursesEnrolledCount = enrollments.length
  const chaptersCompletedCount = completedChapterIds.size

  const coursesCompletedCount = enrollments.filter((enrollment) => {
    const published = enrollment.course.chapters
    if (published.length === 0) return false
    return published.every((ch) => completedChapterIds.has(ch.id))
  }).length

  // Determine the course with the most recent progress activity
  let activeEnrollment = null
  const recentProgress = allProgress.find((p) =>
    enrollments.some((e) => e.courseId === p.chapter.courseId)
  )

  if (recentProgress) {
    activeEnrollment =
      enrollments.find((e) => e.courseId === recentProgress.chapter.courseId) ||
      null
  }

  // Fallback to most recently enrolled course if no progress record yet
  if (!activeEnrollment && enrollments.length > 0) {
    activeEnrollment = enrollments[0]
  }

  // Determine target chapter for ContinueLearning
  let targetChapterId = ""
  let targetChapterTitle = ""
  let activeCompletedCount = 0
  let activeTotalCount = 0

  if (activeEnrollment && activeEnrollment.course.chapters.length > 0) {
    const chapters = activeEnrollment.course.chapters
    activeTotalCount = chapters.length
    activeCompletedCount = chapters.filter((ch) =>
      completedChapterIds.has(ch.id)
    ).length

    const firstIncomplete = chapters.find((ch) => !completedChapterIds.has(ch.id))
    targetChapterId = firstIncomplete ? firstIncomplete.id : chapters[0].id
    targetChapterTitle = firstIncomplete ? firstIncomplete.title : chapters[0].title
  }

  const firstName = user.fullName
    ? user.fullName.trim().split(" ")[0]
    : "Student"

  return (
    <div className="space-y-8 pb-10">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick up right where you left off and keep expanding your skill set.
          </p>
        </div>

        <Button asChild variant="outline" className="self-start sm:self-auto font-medium shadow-xs">
          <Link href="/courses">
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            Explore Courses
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Enrolled Courses */}
        <Card className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Enrolled Courses
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {coursesEnrolledCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {coursesEnrolledCount === 1 ? "Active course" : "Active courses"} in your curriculum
            </p>
          </CardContent>
        </Card>

        {/* Courses Completed */}
        <Card className="border border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Courses Completed
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {coursesCompletedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {coursesCompletedCount === 1 ? "Program finished" : "Programs finished"} to 100%
            </p>
          </CardContent>
        </Card>

        {/* Chapters Completed */}
        <Card className="border border-border/80 shadow-xs hover:border-blue-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Chapters Completed
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {chaptersCompletedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Individual lessons completed across all courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          </div>
          {enrollments.length > 0 && (
            <Link
              href="/student/my-courses"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center"
            >
              View all my courses
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {activeEnrollment && targetChapterId ? (
          <ContinueLearning
            course={activeEnrollment.course}
            targetChapterId={targetChapterId}
            targetChapterTitle={targetChapterTitle}
            completedCount={activeCompletedCount}
            totalCount={activeTotalCount}
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No courses in progress"
            description="You have not enrolled in any courses yet. Browse our library to find your first learning topic."
            actionLabel="Browse courses"
            actionHref="/courses"
          />
        )}
      </div>
    </div>
  )
}
