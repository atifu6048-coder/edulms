import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import {
  EnrollmentChart,
  type DailyEnrollmentPoint,
  type CourseAnalyticsBreakdown,
} from "@/components/teacher/analytics/EnrollmentChart"

export const metadata: Metadata = {
  title: "Teacher Analytics - EduFlow",
  description: "Engagement statistics, enrollment volume, and curriculum completion metrics.",
}

export default async function TeacherAnalyticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student")
  }

  // 1. Generate 30 days dates list
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  // 2. Fetch enrollments in last 30 days scoped to current teacher
  const enrollmentsLast30Days = await db.enrollment.findMany({
    where: {
      course: { userId: user.id },
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      createdAt: true,
    },
  })

  // Map enrollments to date buckets
  const dailyCountMap = new Map<string, number>()
  for (const item of enrollmentsLast30Days) {
    const key = item.createdAt.toISOString().slice(0, 10)
    dailyCountMap.set(key, (dailyCountMap.get(key) || 0) + 1)
  }

  const chartData: DailyEnrollmentPoint[] = []
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(d.getDate() + i)
    const dateKey = d.toISOString().slice(0, 10)
    const label = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(d)

    chartData.push({
      date: dateKey,
      label,
      enrollments: dailyCountMap.get(dateKey) || 0,
    })
  }

  // 3. Fetch courses scoped to current teacher with chapters & enrollments
  const courses = await db.course.findMany({
    where: { userId: user.id },
    include: {
      chapters: {
        where: { isPublished: true },
        select: { id: true },
      },
      enrollments: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch progress for all published chapters across my courses
  const allChapterIds = courses.flatMap((c) => c.chapters.map((ch) => ch.id))
  const progressRecords = await db.userProgress.findMany({
    where: {
      chapterId: { in: allChapterIds },
      isCompleted: true,
    },
    select: {
      userId: true,
      chapterId: true,
    },
  })

  const completedSet = new Set(
    progressRecords.map((p) => `${p.userId}:${p.chapterId}`)
  )

  const courseStats: CourseAnalyticsBreakdown[] = courses.map((course) => {
    const studentsCount = course.enrollments.length
    const chaptersCount = course.chapters.length

    let averageCompletion = 0
    if (studentsCount > 0 && chaptersCount > 0) {
      let totalStudentPcts = 0
      for (const enrollment of course.enrollments) {
        const completedLessons = course.chapters.filter((ch) =>
          completedSet.has(`${enrollment.userId}:${ch.id}`)
        ).length
        const pct = (completedLessons / chaptersCount) * 100
        totalStudentPcts += pct
      }
      averageCompletion = Math.round(totalStudentPcts / studentsCount)
    }

    return {
      courseId: course.id,
      title: course.title,
      isPublished: course.isPublished,
      studentsCount,
      averageCompletion,
      chaptersCount,
    }
  })

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Analytics & Performance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review 30-day student registration trends and curriculum completion averages for your authored courses.
        </p>
      </div>

      {/* Analytics Chart & Breakdown */}
      <EnrollmentChart chartData={chartData} courseStats={courseStats} />
    </div>
  )
}
