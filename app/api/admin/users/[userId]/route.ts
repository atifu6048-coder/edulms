import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const roleSchema = z.object({
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"], {
    message: "Invalid role value. Must be STUDENT, INSTRUCTOR, or ADMIN.",
  }),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

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

    // Verify requesting user is ADMIN
    const currentAdmin = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, role: true },
    })

    if (!currentAdmin || currentAdmin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Administrator privileges required." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const result = roleSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors.role?.[0] || "Invalid role" },
        { status: 400 }
      )
    }

    const { role } = result.data

    // Protection rule: cannot remove own admin role
    if (userId === authUser.id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "You cannot remove your own administrator role." },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found." },
        { status: 404 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error("[ADMIN_USER_ROLE_PATCH_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
