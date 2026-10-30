import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PlusCircle, BookOpen } from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/teacher/dashboard/StatsCards"
import { RecentEnrollments } from "@/components/teacher/dashboard/RecentEnrollments"

export const metadata: Metadata = {
  title: "Teacher Dashboard - EduFlow",
  description: "Instructor overview of courses, published modules, and student enrollments.",
}

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Ensure user has teacher or admin role
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student")
  }

  // Scoped queries: courses authored by the logged-in user
  const [totalCourses, publishedCourses, totalChapters, studentGroups, recentEnrollments] =
    await Promise.all([
      db.course.count({
        where: { userId: user.id },
      }),
      db.course.count({
        where: { userId: user.id, isPublished: true },
      }),
      db.chapter.count({
        where: { course: { userId: user.id } },
      }),
      db.enrollment.groupBy({
        by: ["userId"],
        where: {
          course: { userId: user.id },
        },
      }),
      db.enrollment.findMany({
        where: {
          course: { userId: user.id },
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ])

  const totalStudents = studentGroups.length

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Instructor Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track student enrollment activity, curriculum reach, and course metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="font-semibold shadow-xs">
            <Link href="/teacher/courses">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Manage Courses
            </Link>
          </Button>
          <Button asChild size="sm" className="font-semibold shadow-xs">
            <Link href="/teacher/courses/create">
              <PlusCircle className="mr-1.5 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalCourses={totalCourses}
        publishedCourses={publishedCourses}
        totalStudents={totalStudents}
        totalChapters={totalChapters}
      />

      {/* Recent Enrollments */}
      <RecentEnrollments enrollments={recentEnrollments} />
    </div>
  )
}
