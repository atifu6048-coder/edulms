import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name cannot be empty")
    .max(100, "Category name cannot exceed 100 characters")
    .optional(),
  description: z.string().trim().max(500).optional().nullable(),
})

async function verifyAdmin() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return { error: "Unauthorized. Please sign in to continue.", status: 401 }
  }

  const currentAdmin = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { role: true },
  })

  if (!currentAdmin || currentAdmin.role !== "ADMIN") {
    return { error: "Forbidden. Administrator privileges required.", status: 403 }
  }

  return { user: authUser }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    const authCheck = await verifyAdmin()
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const body = await request.json()
    const result = updateCategorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, description } = result.data

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      )
    }

    if (name && name !== category.name) {
      const existing = await prisma.category.findUnique({
        where: { name },
      })
      if (existing && existing.id !== categoryId) {
        return NextResponse.json(
          { error: "Another category with this name already exists." },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error("[ADMIN_CATEGORY_PATCH_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    const authCheck = await verifyAdmin()
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      )
    }

    // Block deleting if category has courses
    if (category._count.courses > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}" because it contains ${category._count.courses} active course(s). Reassign or delete those courses first.`,
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json(
      { message: "Category deleted successfully." },
      { status: 200 }
    )
  } catch (error) {
    console.error("[ADMIN_CATEGORY_DELETE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

