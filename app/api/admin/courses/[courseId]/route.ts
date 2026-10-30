import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const updateAdminCourseSchema = z.object({
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    const supabase = await createClient()
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      )
    }

    const currentAdmin = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true },
    })

    if (!currentAdmin || currentAdmin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Administrator privileges required." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const result = updateAdminCourseSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { isPublished, isFeatured } = result.data

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      )
    }

    const updateData: { isPublished?: boolean; isFeatured?: boolean } = {}
    if (isPublished !== undefined) updateData.isPublished = isPublished
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        category: true,
      },
    })

    return NextResponse.json(updatedCourse, { status: 200 })
  } catch (error) {
    console.error("[ADMIN_COURSE_PATCH_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

