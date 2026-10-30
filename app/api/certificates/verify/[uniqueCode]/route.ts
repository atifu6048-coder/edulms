import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueCode: string }> }
) {
  try {
    const { uniqueCode } = await params

    const certificate = await prisma.certificate.findUnique({
      where: { uniqueCode },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
        course: {
          select: {
            title: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        uniqueCode: certificate.uniqueCode,
        studentName: certificate.user.fullName || "Student",
        courseTitle: certificate.course.title,
        teacherName: certificate.course.user.fullName || "EduFlow Instructor",
        issueDate: certificate.createdAt,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[CERTIFICATE_VERIFY_GET_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
