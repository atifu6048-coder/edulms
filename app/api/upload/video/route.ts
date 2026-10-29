import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"

const requestUploadUrlSchema = z.object({
  chapterId: z.string().min(1, "Chapter ID is required"),
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
    const validationResult = requestUploadUrlSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { chapterId } = validationResult.data

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
        { error: "Forbidden. You do not have permission to upload videos to this chapter." },
        { status: 403 }
      )
    }

    const adminClient = createAdminClient()

    // Ensure the bucket exists
    const { data: buckets } = await adminClient.storage.listBuckets()
    if (!buckets?.some((b) => b.name === "course-videos")) {
      await adminClient.storage.createBucket("course-videos", { public: true })
    }

    const filePath = `${chapter.courseId}/${chapter.id}/${Date.now()}-video.mp4`

    const { data, error } = await adminClient.storage
      .from("course-videos")
      .createSignedUploadUrl(filePath)

    if (error || !data) {
      console.error("[SIGNED_UPLOAD_URL_ERROR]:", error)
      return NextResponse.json(
        { error: error?.message || "Failed to generate signed upload URL." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        uploadUrl: data.signedUrl,
        path: data.path,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[VIDEO_UPLOAD_INIT_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error while initializing video upload." },
      { status: 500 }
    )
  }
}
