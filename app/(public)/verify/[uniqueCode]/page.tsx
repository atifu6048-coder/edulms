import { Metadata } from "next"
import Link from "next/link"
import {
  XCircle,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
} from "lucide-react"

import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface VerifyPageProps {
  params: Promise<{
    uniqueCode: string
  }>
}

export async function generateMetadata({
  params,
}: VerifyPageProps): Promise<Metadata> {
  const { uniqueCode } = await params
  return {
    title: `Certificate Verification (${uniqueCode}) - EduFlow`,
    description: "Verify authentic certificates of completion issued by EduFlow.",
  }
}

export default async function CertificateVerifyPage({
  params,
}: VerifyPageProps) {
  const { uniqueCode } = await params

  const certificate = await db.certificate.findUnique({
    where: { uniqueCode },
    include: {
      user: {
        select: {
          fullName: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          user: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
  })

  // CASE 1: Invalid / Not Found
  if (!certificate) {
    return (
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-600 dark:text-red-400">
            <XCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="border-red-500/30 text-red-600 text-xs font-semibold">
              Invalid Credential
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Certificate Not Found
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We could not find any active completion certificate matching code{" "}
              <span className="font-mono font-semibold text-foreground">
                {uniqueCode}
              </span>
              . The certificate may not exist, or the link provided is incorrect.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <Button asChild>
              <Link href="/courses">
                Explore Verified Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // CASE 2: Authentic and Verified
  const studentName = certificate.user.fullName || "EduFlow Student"
  const teacherName = certificate.course.user.fullName || "EduFlow Instructor"
  const issueDateFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(certificate.createdAt))

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Card className="overflow-hidden border-2 border-emerald-600/30 dark:border-emerald-500/30 shadow-xl bg-card">
          {/* Header Banner */}
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 sm:p-8 border-b border-border/80">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <Badge className="bg-emerald-600 text-white border-none text-[11px] font-bold uppercase tracking-wider">
                    Official Verification
                  </Badge>
                  <h2 className="text-lg font-bold text-foreground mt-0.5">
                    Valid Certificate of Completion
                  </h2>
                </div>
              </div>

              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground self-start sm:self-auto">
                {certificate.uniqueCode}
              </span>
            </div>
          </CardHeader>

          {/* Details Content */}
          <CardContent className="p-6 sm:p-8 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              EduFlow certifies that the recipient below has successfully met all curriculum milestones and finished all required lessons.
            </p>

            <div className="divide-y divide-border/60 rounded-xl border border-border/70 overflow-hidden bg-muted/20">
              {/* Student Name */}
              <div className="flex items-start sm:items-center justify-between p-4 flex-col sm:flex-row gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <span>Recipient</span>
                </div>
                <div className="font-serif text-lg font-bold text-foreground">
                  {studentName}
                </div>
              </div>

              {/* Course Title */}
              <div className="flex items-start sm:items-center justify-between p-4 flex-col sm:flex-row gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Course</span>
                </div>
                <div className="text-sm font-bold text-foreground sm:text-right max-w-sm">
                  {certificate.course.title}
                </div>
              </div>

              {/* Lead Instructor */}
              <div className="flex items-start sm:items-center justify-between p-4 flex-col sm:flex-row gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>Lead Instructor</span>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {teacherName}
                </div>
              </div>

              {/* Issue Date */}
              <div className="flex items-start sm:items-center justify-between p-4 flex-col sm:flex-row gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Issue Date</span>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {issueDateFormatted}
                </div>
              </div>
            </div>
          </CardContent>

          {/* Footer Navigation */}
          <CardFooter className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60">
            <span className="text-xs text-muted-foreground text-center sm:text-left">
              Issued securely by EduFlow Digital Credentials
            </span>
            <Button asChild size="sm" className="font-semibold shadow-xs">
              <Link href={`/courses/${certificate.course.id}`}>
                View Course Curriculum
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
