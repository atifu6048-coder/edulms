import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import {
  AdminCoursesTable,
  type AdminCourseRow,
} from "@/components/admin/courses/AdminCoursesTable"

export const metadata: Metadata = {
  title: "Course Registry - Admin",
  description: "Platform-wide course governance, moderation, and featured status controls.",
}

export default async function AdminCoursesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/student")
  }

  const courses = await db.course.findMany({
    include: {
      category: true,
      user: {
        select: {
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          chapters: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const courseRows: AdminCourseRow[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    imageUrl: c.imageUrl,
    isPublished: c.isPublished,
    isFeatured: c.isFeatured,
    createdAt: c.createdAt,
    categoryName: c.category?.name || null,
    teacherName: c.user?.fullName || "Instructor",
    teacherEmail: c.user?.email || "",
    teacherAvatar: c.user?.avatarUrl || null,
    enrollmentsCount: c._count.enrollments,
    chaptersCount: c._count.chapters,
  }))

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Platform Course Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review all authored courses across instructors. Feature top programs on the home page or force unpublish flagged drafts.
        </p>
      </div>

      {/* Admin Courses Table */}
      <AdminCoursesTable initialCourses={courseRows} />
    </div>
  )
}
