import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpen, Compass } from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  CourseGrid,
  type EnrolledCourseItem,
} from "@/components/student/dashboard/CourseGrid"

export const metadata: Metadata = {
  title: "My Courses - EduFlow",
  description: "View and resume all your enrolled courses and active study materials.",
}

export default async function StudentMyCoursesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch student enrollments
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          category: true,
          user: {
            select: {
              fullName: true,
            },
          },
          chapters: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch all completed chapter progress records
  const allChapterIds = enrollments.flatMap((e) =>
    e.course.chapters.map((ch) => ch.id)
  )

  const progressRecords = await db.userProgress.findMany({
    where: {
      userId: user.id,
      chapterId: { in: allChapterIds },
      isCompleted: true,
    },
    select: { chapterId: true },
  })

  const completedSet = new Set(progressRecords.map((p) => p.chapterId))

  const courses: EnrolledCourseItem[] = enrollments.map((e) => {
    const course = e.course
    const publishedChapters = course.chapters
    const totalCount = publishedChapters.length
    const completedCount = publishedChapters.filter((ch) =>
      completedSet.has(ch.id)
    ).length
    const isCompleted = totalCount > 0 && completedCount === totalCount

    const firstIncomplete = publishedChapters.find(
      (ch) => !completedSet.has(ch.id)
    )
    const targetChapterId = firstIncomplete
      ? firstIncomplete.id
      : publishedChapters[0]?.id || ""

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      category: course.category?.name || null,
      instructorName: course.user?.fullName || null,
      completedCount,
      totalCount,
      targetChapterId,
      isCompleted,
    }
  })

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access your ongoing curriculum, resume lessons, and review completed courses.
          </p>
        </div>

        {courses.length > 0 && (
          <Button asChild variant="outline" className="self-start sm:self-auto font-medium shadow-xs">
            <Link href="/courses">
              <Compass className="mr-2 h-4 w-4 text-primary" />
              Browse More Courses
            </Link>
          </Button>
        )}
      </div>

      {/* Course Grid */}
      <CourseGrid courses={courses} />
    </div>
  )
}
