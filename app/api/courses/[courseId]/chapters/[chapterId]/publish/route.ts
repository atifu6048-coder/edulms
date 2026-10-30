import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params

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
      select: { userId: true },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 })
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId, courseId },
    })

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const isOwner = course.userId === user.id
    const isAdmin = dbUser?.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. You do not have permission to publish this chapter." },
        { status: 403 }
      )
    }

    // Validation rules: title, description, and video (videoUrl set)
    const missingFields: string[] = []
    if (!chapter.title) missingFields.push("title")
    if (!chapter.description) missingFields.push("description")
    if (!chapter.videoUrl) missingFields.push("video")

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Chapter must have ${missingFields.join(", ")} before publishing.`,
          missingFields,
        },
        { status: 400 }
      )
    }

    const publishedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(
      {
        id: publishedChapter.id,
        isPublished: publishedChapter.isPublished,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[CHAPTER_PUBLISH_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
