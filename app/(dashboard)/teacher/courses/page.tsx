import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { CourseList } from "@/components/teacher/courses/CourseList"

export default async function TeacherCoursesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const courses = await db.course.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          chapters: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    isPublished: course.isPublished,
    createdAt: course.createdAt,
    chaptersCount: course._count.chapters,
  }))

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Courses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your courses, view publication status, and author lesson chapters.
          </p>
        </div>
        <Button asChild className="gap-2 self-start sm:self-auto shadow-sm">
          <Link href="/teacher/courses/create">
            <Plus className="h-4 w-4" />
            New course
          </Link>
        </Button>
      </div>

      <CourseList courses={formattedCourses} />
    </div>
  )
}
