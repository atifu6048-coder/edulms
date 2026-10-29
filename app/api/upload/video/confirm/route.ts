import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"

const confirmUploadSchema = z.object({
  chapterId: z.string().min(1, "Chapter ID is required"),
  path: z.string().min(1, "Storage path is required"),
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

    const body = await request.json()
    const validationResult = confirmUploadSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { chapterId, path } = validationResult.data

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: {
          select: { id: true, userId: true },
        },
      },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found." },
        { status: 404 }
      )
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const isOwner = chapter.course.userId === user.id
    const isAdmin = dbUser?.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. You do not have permission to modify this chapter." },
        { status: 403 }
      )
    }

    const adminClient = createAdminClient()

    // 1. Delete previous video file from storage if one exists
    if (chapter.videoUrl) {
      try {
        const parts = chapter.videoUrl.split("/course-videos/")
        if (parts.length > 1) {
          const oldStoragePath = decodeURIComponent(parts[1])
          await adminClient.storage
            .from("course-videos")
            .remove([oldStoragePath])
        }
      } catch (err) {
        console.warn("[OLD_VIDEO_CLEANUP_WARN]: Failed to delete previous video file:", err)
      }
    }

    // 2. Compute public URL for the newly uploaded video file
    const {
      data: { publicUrl },
    } = adminClient.storage.from("course-videos").getPublicUrl(path)

    // 3. Save videoUrl onto the chapter in the database
    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoUrl: publicUrl,
      },
    })

    return NextResponse.json(
      {
        chapter: updatedChapter,
        videoUrl: publicUrl,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[VIDEO_CONFIRM_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error while confirming video upload." },
      { status: 500 }
    )
  }
}
