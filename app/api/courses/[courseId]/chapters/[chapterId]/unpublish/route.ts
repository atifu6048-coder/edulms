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
        { error: "Forbidden. You do not have permission to unpublish this chapter." },
        { status: 403 }
      )
    }

    const unpublishedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        isPublished: false,
      },
    })

    // Check if any other chapters in this course are still published
    const remainingPublished = await prisma.chapter.findMany({
      where: {
        courseId,
        id: { not: chapterId },
        isPublished: true,
      },
    })

    // Unpublishing a course's last published chapter auto-unpublishes the course
    if (remainingPublished.length === 0) {
      await prisma.course.update({
        where: { id: courseId },
        data: {
          isPublished: false,
        },
      })
    }

    return NextResponse.json(
      {
        id: unpublishedChapter.id,
        isPublished: unpublishedChapter.isPublished,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
