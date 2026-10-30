import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),
  description: z.string().trim().max(500).optional().nullable(),
})

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_GET_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const result = createCategorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, description } = result.data

    const existing = await prisma.category.findUnique({
      where: { name },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_POST_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
