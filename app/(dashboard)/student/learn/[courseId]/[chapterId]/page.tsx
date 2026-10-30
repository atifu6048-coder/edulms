import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Lock,
  BookOpen,
  Layers,
} from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LearnPageProps {
  params: Promise<{
    courseId: string
    chapterId: string
  }>
}

export async function generateMetadata({
  params,
}: LearnPageProps): Promise<Metadata> {
  const { chapterId } = await params
  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    select: { title: true },
  })

  return {
    title: chapter ? `${chapter.title} - EduFlow` : "Course Player - EduFlow",
  }
}

export default async function StudentLearnPage({ params }: LearnPageProps) {
  const { courseId, chapterId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/sign-in?redirect=/student/learn/${courseId}/${chapterId}`)
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  })

  if (!course) {
    return notFound()
  }

  const currentChapter = course.chapters.find((ch) => ch.id === chapterId)
  if (!currentChapter) {
    return notFound()
  }

  // Access validation: Course owner, Admin, Enrolled student, or Free chapter
  const isOwner = course.userId === user.id
  const isAdmin = user.role === "ADMIN"

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  })

  const isEnrolled = !!enrollment || isOwner || isAdmin
  const canAccess = isEnrolled || currentChapter.isFree

  if (!canAccess) {
    redirect(`/courses/${courseId}`)
  }

  // Fetch progress for all chapters
  const progressRecords = await db.userProgress.findMany({
    where: {
      userId: user.id,
      chapterId: { in: course.chapters.map((ch) => ch.id) },
    },
  })

  const completedMap = new Map(
    progressRecords.map((p) => [p.chapterId, p.isCompleted])
  )

  const currentIndex = course.chapters.findIndex((ch) => ch.id === chapterId)
  const prevChapter = currentIndex > 0 ? course.chapters[currentIndex - 1] : null
  const nextChapter =
    currentIndex < course.chapters.length - 1
      ? course.chapters[currentIndex + 1]
      : null

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to course details
        </Link>

        <div className="flex items-center gap-2">
          {currentChapter.isFree && (
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Free preview
            </Badge>
          )}
          {isEnrolled && (
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-none text-xs">
              Enrolled
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Video & Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          <div className="overflow-hidden rounded-2xl bg-black border border-border shadow-xl aspect-video relative flex items-center justify-center">
            {currentChapter.videoUrl ? (
              <video
                key={currentChapter.videoUrl}
                src={currentChapter.videoUrl}
                controls
                playsInline
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-zinc-400 space-y-3">
                <PlayCircle className="h-16 w-16 text-zinc-600 stroke-1" />
                <p className="text-sm">No video file attached to this lesson yet.</p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-border/60">
            {prevChapter ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/student/learn/${course.id}/${prevChapter.id}`}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous lesson
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <Button asChild size="sm">
                <Link href={`/student/learn/${course.id}/${nextChapter.id}`}>
                  Next lesson
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href={`/courses/${course.id}`}>
                  Finish Course
                  <CheckCircle2 className="ml-1.5 h-4 w-4 text-emerald-500" />
                </Link>
              </Button>
            )}
          </div>

          {/* Lesson Details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Lesson {currentIndex + 1} of {course.chapters.length}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {currentChapter.title}
              </h1>
            </div>

            {currentChapter.description ? (
              <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {currentChapter.description}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description provided for this lesson.
              </p>
            )}
          </div>
        </div>

        {/* Chapters Curriculum Sidebar */}
        <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-base">Course Curriculum</h3>
            <p className="text-xs text-muted-foreground">
              {course.chapters.length} {course.chapters.length === 1 ? "lesson" : "lessons"} total
            </p>
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden">
            {course.chapters.map((ch, idx) => {
              const isActive = ch.id === currentChapter.id
              const isCompleted = completedMap.get(ch.id) ?? false
              const isChapterLocked = !isEnrolled && !ch.isFree

              return (
                <Link
                  key={ch.id}
                  href={
                    isChapterLocked
                      ? `/courses/${course.id}`
                      : `/student/learn/${course.id}/${ch.id}`
                  }
                  className={cn(
                    "flex items-center justify-between p-3.5 text-xs sm:text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted/50 text-foreground",
                    isChapterLocked && "opacity-60 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-mono font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="truncate">{ch.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : isChapterLocked ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : ch.isFree ? (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        Free
                      </Badge>
                    ) : (
                      <PlayCircle
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
