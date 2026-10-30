import { Metadata } from "next"
import { redirect } from "next/navigation"
import { Award, Compass } from "lucide-react"
import Link from "next/link"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { CertificateCard } from "@/components/student/certificates/CertificateCard"
import { EmptyState } from "@/components/shared/EmptyState"

export const metadata: Metadata = {
  title: "My Certificates - EduFlow",
  description: "View, download, and verify your official course completion certificates.",
}

export default async function StudentCertificatesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const certificates = await db.certificate.findMany({
    where: { userId: user.id },
    include: {
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
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Earned Certificates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official proof of completion and skill verification across your completed programs.
          </p>
        </div>

        {certificates.length > 0 && (
          <Button asChild variant="outline" className="self-start sm:self-auto font-medium shadow-xs">
            <Link href="/student/my-courses">
              <Compass className="mr-2 h-4 w-4 text-primary" />
              View Enrolled Courses
            </Link>
          </Button>
        )}
      </div>

      {/* Content */}
      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates earned yet"
          description="Complete 100% of all lessons in an enrolled course to unlock your verified certificate of completion."
          actionLabel="Go to My Courses"
          actionHref="/student/my-courses"
        />
      ) : (
        <div className="space-y-10">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  )
}
