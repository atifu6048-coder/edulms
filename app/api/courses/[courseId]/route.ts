import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const updateCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters")
    .optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number").nullable().optional(),
  categoryId: z.string().nullable().optional(),
  level: z
    .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .nullable()
    .optional(),
  isPublished: z.boolean().optional(),
})

async function checkOwnership(courseId: string) {
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
    select: { id: true, userId: true },
  })

  if (!course) {
    return { error: "Course not found.", status: 404 }
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

  return { user, course }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        chapters: {
          orderBy: { position: "asc" },
        },
        attachments: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 })
    }

    return NextResponse.json(course, { status: 200 })
  } catch (error) {
    console.error("[COURSE_GET_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const authCheck = await checkOwnership(courseId)

    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const body = await request.json()
    const validationResult = updateCourseSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...validationResult.data,
      },
    })

    return NextResponse.json(updatedCourse, { status: 200 })
  } catch (error) {
    console.error("[COURSE_UPDATE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return PUT(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const authCheck = await checkOwnership(courseId)

    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      )
    }

    await prisma.course.delete({
      where: { id: courseId },
    })

    return NextResponse.json(
      { message: "Course deleted successfully." },
      { status: 200 }
    )
  } catch (error) {
    console.error("[COURSE_DELETE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
