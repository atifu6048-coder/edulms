import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Display name cannot be empty")
    .max(100, "Display name must be under 100 characters")
    .optional(),
  bio: z
    .string()
    .max(1000, "Bio cannot exceed 1000 characters")
    .nullable()
    .optional(),
})

export async function PATCH(request: NextRequest) {
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
    const result = profileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { fullName, bio } = result.data

    const updateData: { fullName?: string; bio?: string | null } = {}
    if (fullName !== undefined) updateData.fullName = fullName
    if (bio !== undefined) updateData.bio = bio

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        bio: true,
        avatarUrl: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error("[USER_PROFILE_PATCH_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
