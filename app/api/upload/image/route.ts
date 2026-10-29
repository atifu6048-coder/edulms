import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
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

    // 2. Verify instructor or admin role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (!dbUser || (dbUser.role !== "INSTRUCTOR" && dbUser.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden. You must be an instructor or administrator to upload images." },
        { status: 403 }
      )
    }

    // 3. Parse FormData
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const courseId =
      (formData.get("courseId") as string) ||
      request.nextUrl.searchParams.get("courseId") ||
      "general"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data ('file' field required)." },
        { status: 400 }
      )
    }

    // 4. Validate file type and size
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files (PNG, JPG, WebP, etc.) are allowed." },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 4MB limit. Please upload a smaller image." },
        { status: 400 }
      )
    }

    // 5. Prepare file buffer and path
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filePath = `${courseId}/${Date.now()}-${sanitizedFilename}`

    const adminClient = createAdminClient()

    // 6. Upload using Supabase Service-Role Admin Client (bypasses RLS)
    let { data, error: uploadError } = await adminClient.storage
      .from("course-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    // If bucket doesn't exist yet, auto-create it with public read access
    if (uploadError && (uploadError.message.toLowerCase().includes("bucket not found") || uploadError.message.toLowerCase().includes("does not exist"))) {
      await adminClient.storage.createBucket("course-images", {
        public: true,
      })

      const retry = await adminClient.storage
        .from("course-images")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        })
      uploadError = retry.error
      data = retry.data
    }

    if (uploadError) {
      console.error("[STORAGE_UPLOAD_ERROR]:", uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // 7. Get public URL from Supabase Storage
    const {
      data: { publicUrl },
    } = adminClient.storage.from("course-images").getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error("[IMAGE_UPLOAD_ROUTE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error during image upload." },
      { status: 500 }
    )
  }
}
