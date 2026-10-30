import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const progressSchema = z.object({
  isCompleted: z.boolean(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params

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

    const body = await request.json()
    const parsed = progressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { isCompleted } = parsed.data

    // Check that chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found." },
        { status: 404 }
      )
    }

    // Ensure db user exists
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!dbUser && user.email) {
      const emailPrefix = user.email.split("@")[0]
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        emailPrefix

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          fullName,
          avatarUrl:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
          role: "STUDENT",
        },
      })
    }

    // Access check: enrolled, isFree (preview), course instructor, or admin
    const isOwner = chapter.course.userId === user.id
    const isAdmin = dbUser?.role === "ADMIN"

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: chapter.course.id,
        },
      },
    })

    const hasAccess = !!enrollment || chapter.isFree || isOwner || isAdmin
    if (!hasAccess) {
      return NextResponse.json(
        { error: "You must be enrolled to track progress on this course." },
        { status: 403 }
      )
    }

    // Upsert UserProgress record
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId: chapter.id,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId: user.id,
        chapterId: chapter.id,
        isCompleted,
      },
    })

    return NextResponse.json(progress, { status: 200 })
  } catch (error) {
    console.error("[PROGRESS_PUT_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
