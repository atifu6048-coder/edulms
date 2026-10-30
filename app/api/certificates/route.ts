import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const createCertificateSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
})

function generateUniqueCode(): string {
  const p1 = crypto.randomBytes(3).toString("hex").toUpperCase()
  const p2 = crypto.randomBytes(3).toString("hex").toUpperCase()
  return `EDUF-${p1}-${p2}`
}

export async function POST(request: NextRequest) {
  try {
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
    const result = createCertificateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { courseId } = result.data

    // Fetch course and its published chapters
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      )
    }

    if (course.chapters.length === 0) {
      return NextResponse.json(
        { error: "Course has no published chapters." },
        { status: 400 }
      )
    }

    // Verify user has completed EVERY published chapter
    const publishedChapterIds = course.chapters.map((ch) => ch.id)
    const completedProgress = await prisma.userProgress.findMany({
      where: {
        userId: user.id,
        chapterId: { in: publishedChapterIds },
        isCompleted: true,
      },
      select: { chapterId: true },
    })

    const completedIds = new Set(completedProgress.map((p) => p.chapterId))
    const isAllCompleted = publishedChapterIds.every((id) =>
      completedIds.has(id)
    )

    if (!isAllCompleted) {
      return NextResponse.json(
        {
          error:
            "Course is not yet completed. Complete all chapters to earn your certificate.",
        },
        { status: 400 }
      )
    }

    // Check if certificate already exists (return existing if so)
    const existing = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            title: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        user: {
          select: {
            fullName: true,
          },
        },
      },
    })

    if (existing) {
      return NextResponse.json(existing, { status: 200 })
    }

    // Ensure uniqueCode
    let uniqueCode = generateUniqueCode()
    const codeExists = await prisma.certificate.findUnique({
      where: { uniqueCode },
    })
    if (codeExists) {
      uniqueCode = generateUniqueCode()
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        courseId,
        uniqueCode,
      },
      include: {
        course: {
          select: {
            title: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        user: {
          select: {
            fullName: true,
          },
        },
      },
    })

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error("[CERTIFICATE_POST_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
