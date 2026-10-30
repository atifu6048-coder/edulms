"use client"

import * as React from "react"
import Link from "next/link"
import { Printer, ShieldCheck, ExternalLink, Award, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/shared/Logo"
import { cn } from "@/lib/utils"

export interface CertificateData {
  id: string
  uniqueCode: string
  createdAt: Date | string
  user: {
    fullName: string | null
  }
  course: {
    title: string
    user: {
      fullName: string | null
    }
  }
}

interface CertificateCardProps {
  certificate: CertificateData
  className?: string
}

export function CertificateCard({
  certificate,
  className,
}: CertificateCardProps) {
  const [origin, setOrigin] = React.useState("")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  const verifyUrl = origin
    ? `${origin}/verify/${certificate.uniqueCode}`
    : `/verify/${certificate.uniqueCode}`

  const studentName = certificate.user.fullName || "Student of EduFlow"
  const teacherName = certificate.course.user.fullName || "EduFlow Lead Instructor"
  const issueDateFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(certificate.createdAt))

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-none text-xs font-semibold gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Credential
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {certificate.uniqueCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs font-medium"
          >
            <Link href={`/verify/${certificate.uniqueCode}`} target="_blank">
              Verify Link
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            className="text-xs font-semibold shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Download / Print
          </Button>
        </div>
      </div>

      {/* Elegant Landscape Certificate Container */}
      <div className="certificate-print-area w-full overflow-hidden rounded-2xl border-8 border-indigo-950/10 dark:border-indigo-400/10 bg-gradient-to-br from-amber-50/60 via-background to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-3 sm:p-5 shadow-xl">
        {/* Inner Decorative Double Border */}
        <div className="relative flex flex-col justify-between rounded-xl border-2 border-dashed border-amber-600/40 dark:border-amber-400/30 p-6 sm:p-10 lg:p-12 text-center min-h-[500px] overflow-hidden">
          {/* Subtle Watermark Emblem Background */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
            <Award className="h-[480px] w-[480px] text-foreground" />
          </div>

          {/* Certificate Header */}
          <div className="relative space-y-4">
            <div className="flex items-center justify-center">
              <Logo />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                <Sparkles className="h-3 w-3" />
                Certificate of Completion
                <Sparkles className="h-3 w-3" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                This acknowledges that
              </p>
            </div>
          </div>

          {/* Student Name */}
          <div className="relative py-6 space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              {studentName}
            </h2>
            <div className="mx-auto h-0.5 w-48 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
            <p className="text-xs sm:text-sm text-muted-foreground pt-2 max-w-lg mx-auto leading-relaxed">
              has successfully fulfilled all curriculum requirements, practical assignments, and verified milestones for
            </p>
          </div>

          {/* Course Title */}
          <div className="relative space-y-1 pb-4">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              {certificate.course.title}
            </h3>
          </div>

          {/* Certificate Footer / Signatures / Verification */}
          <div className="relative pt-6 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-left">
            {/* Instructor Signature */}
            <div className="space-y-1">
              <div className="font-serif italic text-base sm:text-lg text-foreground font-semibold">
                {teacherName}
              </div>
              <div className="h-px w-36 bg-foreground/30" />
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Lead Instructor
              </p>
            </div>

            {/* Verification Seal */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 border border-amber-600/40 text-amber-700 dark:text-amber-400 shadow-sm mb-1">
                <Award className="h-7 w-7" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Verified Credential
              </p>
            </div>

            {/* Issue Date & Code */}
            <div className="space-y-1 text-left sm:text-right">
              <p className="text-xs font-semibold text-foreground">
                Issued: {issueDateFormatted}
              </p>
              <div className="text-[11px] font-mono text-muted-foreground">
                ID: {certificate.uniqueCode}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                {verifyUrl}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          /* Hide non-print areas */
          nav,
          header,
          aside,
          footer,
          .no-print,
          button {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Full page print for certificate */
          .certificate-print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 1.5cm !important;
            border: 4px solid #312e81 !important;
            background: white !important;
            box-shadow: none !important;
            page-break-after: always;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}
