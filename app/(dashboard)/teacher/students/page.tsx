import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import {
  StudentTable,
  type StudentEnrollmentRow,
} from "@/components/teacher/students/StudentTable"

export const metadata: Metadata = {
  title: "Student Roster - EduFlow",
  description: "View and monitor student enrollments and curriculum progress across your courses.",
}

export default async function TeacherStudentsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student")
  }

  // Scoped to courses where instructor is the current user
  const enrollments = await db.enrollment.findMany({
    where: {
      course: { userId: user.id },
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      course: {
        include: {
          chapters: {
            where: { isPublished: true },
            select: { id: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch completed progress records across all published chapters of my courses
  const allChapterIds = Array.from(
    new Set(enrollments.flatMap((e) => e.course.chapters.map((ch) => ch.id)))
  )

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

  // Group progress by `${userId}:${chapterId}`
  const completedProgressKeySet = new Set(
    progressRecords.map((p) => `${p.userId}:${p.chapterId}`)
  )

  const studentRows: StudentEnrollmentRow[] = enrollments.map((item) => {
    const totalChapters = item.course.chapters.length
    const completedChapters = item.course.chapters.filter((ch) =>
      completedProgressKeySet.has(`${item.userId}:${ch.id}`)
    ).length

    const progressPercentage =
      totalChapters > 0
        ? Math.round((completedChapters / totalChapters) * 100)
        : 0

    return {
      id: item.id,
      studentId: item.userId,
      studentName: item.user.fullName || "Student",
      studentEmail: item.user.email,
      studentAvatar: item.user.avatarUrl,
      courseId: item.courseId,
      courseTitle: item.course.title,
      enrolledAt: item.createdAt,
      progressPercentage,
      completedChapters,
      totalChapters,
    }
  })

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Student Roster & Progress
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review all enrolled students across your authored courses, searchable and sortable by enrollment date.
        </p>
      </div>

      {/* Student Table */}
      <StudentTable initialData={studentRows} />
    </div>
  )
}
