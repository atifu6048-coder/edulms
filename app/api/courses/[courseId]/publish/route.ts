import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: true,
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const isOwner = course.userId === user.id
    const isAdmin = dbUser?.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. You do not have permission to publish this course." },
        { status: 403 }
      )
    }

    // Validation rules: title, description, imageUrl, categoryId, and at least one published chapter
    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished)

    const missingFields: string[] = []
    if (!course.title) missingFields.push("title")
    if (!course.description) missingFields.push("description")
    if (!course.imageUrl) missingFields.push("thumbnail image")
    if (!course.categoryId) missingFields.push("category")
    if (!hasPublishedChapter) missingFields.push("at least one published chapter")

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields to publish: ${missingFields.join(", ")}.`,
          missingFields,
        },
        { status: 400 }
      )
    }

    const publishedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(
      {
        id: publishedCourse.id,
        isPublished: publishedCourse.isPublished,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[COURSE_PUBLISH_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
