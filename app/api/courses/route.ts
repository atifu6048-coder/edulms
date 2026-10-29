import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
})

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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, role: true },
    })

    if (!dbUser || (dbUser.role !== "INSTRUCTOR" && dbUser.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "You must be an instructor or administrator to create courses." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validationResult = createCourseSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        userId: dbUser.id,
        title: validationResult.data.title,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("[COURSES_CREATE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title")
    const categoryId = searchParams.get("categoryId")

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        ...(title ? { title: { contains: title, mode: "insensitive" } } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: course.price,
      isPublished: course.isPublished,
      category: course.category,
      teacher: course.user,
      chaptersCount: course._count.chapters,
    }))

    return NextResponse.json(formattedCourses, { status: 200 })
  } catch (error) {
    console.error("[COURSES_GET_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
