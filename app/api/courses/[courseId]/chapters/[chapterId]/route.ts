import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const updateChapterSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  isFree: z.boolean().optional(),
  isPreview: z.boolean().optional(),
})

async function checkChapterOwnership(courseId: string, chapterId: string) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Unauthorized. Please sign in to continue.", status: 401 }
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { userId: true },
  })

  if (!course) {
    return { error: "Course not found.", status: 404 }
  }

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId, courseId },
  })

  if (!chapter) {
    return { error: "Chapter not found.", status: 404 }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  const isOwner = course.userId === user.id
  const isAdmin = dbUser?.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    return {
      error: "Forbidden. You do not have permission to modify this course.",
      status: 403,
    }
  }

  return { user, course, chapter }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId, courseId },
    })

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 })
    }

    return NextResponse.json(chapter, { status: 200 })
  } catch (error) {
    console.error("[CHAPTER_GET_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params
    const authCheck = await checkChapterOwnership(courseId, chapterId)

    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const body = await request.json()
    const validationResult = updateChapterSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { isPreview, isFree, ...restData } = validationResult.data
    const freeValue = isFree !== undefined ? isFree : isPreview

    const updatePayload: Record<string, unknown> = {
      ...restData,
    }

    if (freeValue !== undefined) {
      updatePayload.isFree = freeValue
    }

    const updatedChapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: updatePayload,
    })

    return NextResponse.json(updatedChapter, { status: 200 })
  } catch (error) {
    console.error("[CHAPTER_UPDATE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  return PUT(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params
    const authCheck = await checkChapterOwnership(courseId, chapterId)

    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      )
    }

    await prisma.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    })

    // If no published chapters remain, auto-unpublish the parent course
    const remainingPublished = await prisma.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    })

    if (remainingPublished.length === 0) {
      await prisma.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      })
    }

    return NextResponse.json(
      { message: "Chapter deleted successfully." },
      { status: 200 }
    )
  } catch (error) {
    console.error("[CHAPTER_DELETE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
