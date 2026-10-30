import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(
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

    // Ensure user exists in Prisma database
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

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        id: true,
        isPublished: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or is not published." },
        { status: 404 }
      )
    }

    // Check if existing enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled" },
        { status: 400 }
      )
    }

    try {
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId,
        },
      })

      return NextResponse.json(enrollment, { status: 201 })
    } catch (createError: any) {
      // Prisma unique constraint violation code is P2002
      if (createError?.code === "P2002") {
        return NextResponse.json(
          { error: "Already enrolled" },
          { status: 400 }
        )
      }
      throw createError
    }
  } catch (error) {
    console.error("[COURSE_ENROLL_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
