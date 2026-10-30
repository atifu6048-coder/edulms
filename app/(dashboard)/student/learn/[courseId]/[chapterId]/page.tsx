import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ChevronLeft, ChevronRight, PlayCircle, Sparkles } from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChapterSidebar,
  type ChapterSidebarItem,
} from "@/components/student/learn/ChapterSidebar"
import { VideoPlayer } from "@/components/student/learn/VideoPlayer"
import { MarkCompleteButton } from "@/components/student/learn/MarkCompleteButton"

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

  // Access rule: user must be enrolled, OR the chapter has isPreview (isFree) true.
  // Otherwise redirect to the public course page.
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
  const hasPreviewAccess = Boolean(
    currentChapter.isFree || (currentChapter as any).isPreview
  )

  if (!isEnrolled && !hasPreviewAccess) {
    redirect(`/courses/${courseId}`)
  }

  // Fetch student progress for published chapters
  const progressRecords = await db.userProgress.findMany({
    where: {
      userId: user.id,
      chapterId: { in: course.chapters.map((ch) => ch.id) },
    },
  })

  const completedMap = new Map(
    progressRecords.map((p) => [p.chapterId, p.isCompleted])
  )

  const chaptersForSidebar: ChapterSidebarItem[] = course.chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    position: ch.position,
    isFree: Boolean(ch.isFree || (ch as any).isPreview),
    isCompleted: completedMap.get(ch.id) ?? false,
  }))

  const completedCount = chaptersForSidebar.filter((ch) => ch.isCompleted).length
  const totalCount = chaptersForSidebar.length
  const currentIsCompleted = completedMap.get(currentChapter.id) ?? false
  const isFinalIncomplete =
    (completedCount === totalCount - 1 && !currentIsCompleted) ||
    completedCount === totalCount

  const currentIndex = course.chapters.findIndex((ch) => ch.id === chapterId)
  const prevChapter = currentIndex > 0 ? course.chapters[currentIndex - 1] : null
  const nextChapter =
    currentIndex < course.chapters.length - 1
      ? course.chapters[currentIndex + 1]
      : null

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ChapterSidebar on the left */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <ChapterSidebar
            courseTitle={course.title}
            courseId={course.id}
            chapters={chaptersForSidebar}
            currentChapterId={currentChapter.id}
            isEnrolled={isEnrolled}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        </div>

        {/* Main learning area */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          {/* Native Video Player */}
          <VideoPlayer
            videoUrl={currentChapter.videoUrl}
            title={currentChapter.title}
            chapterId={currentChapter.id}
            courseId={course.id}
            courseTitle={course.title}
            nextChapterId={nextChapter?.id}
            isCompleted={currentIsCompleted}
            isFinalIncomplete={isFinalIncomplete}
          />

          {/* Under video: Prev/Next chapter navigation & MarkCompleteButton */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div>
              {prevChapter ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/student/learn/${course.id}/${prevChapter.id}`}>
                    <ChevronLeft className="mr-1.5 h-4 w-4" />
                    Previous chapter
                  </Link>
                </Button>
              ) : (
                <div />
              )}
            </div>

            <div className="flex items-center gap-3">
              <MarkCompleteButton
                chapterId={currentChapter.id}
                courseId={course.id}
                courseTitle={course.title}
                isCompleted={currentIsCompleted}
                nextChapterId={nextChapter?.id}
                isFinalIncomplete={isFinalIncomplete}
              />

              {nextChapter ? (
                <Button asChild size="sm">
                  <Link href={`/student/learn/${course.id}/${nextChapter.id}`}>
                    Next chapter
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/student/certificates">
                    View Certificate
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Chapter Title & Description */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Chapter {currentIndex + 1} of {course.chapters.length}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {currentChapter.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {currentChapter.isFree && !isEnrolled && (
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

            {currentChapter.description ? (
              <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap pt-2">
                {currentChapter.description}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic pt-2">
                No description provided for this chapter.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
