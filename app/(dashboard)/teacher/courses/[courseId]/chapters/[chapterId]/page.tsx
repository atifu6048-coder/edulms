import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  LayoutDashboard,
  Video,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { ChapterTitleForm } from "@/components/teacher/courses/ChapterTitleForm"
import { ChapterDescriptionForm } from "@/components/teacher/courses/ChapterDescriptionForm"
import { ChapterAccessForm } from "@/components/teacher/courses/ChapterAccessForm"
import { ChapterActions } from "@/components/teacher/courses/ChapterActions"
import { VideoUpload } from "@/components/teacher/courses/VideoUpload"

interface ChapterIdPageProps {
  params: Promise<{
    courseId: string
    chapterId: string
  }>
}

export default async function ChapterIdPage({ params }: ChapterIdPageProps) {
  const { courseId, chapterId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      userId: true,
      title: true,
    },
  })

  if (!course) {
    return notFound()
  }

  // Ownership verification: user must own this course or be platform admin
  const isOwner = course.userId === user.id
  const isAdmin = user.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    redirect("/teacher/courses")
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
  })

  if (!chapter) {
    return notFound()
  }

  const missingFields: string[] = []
  if (!chapter.title) missingFields.push("Chapter title")
  if (!chapter.description) missingFields.push("Chapter description")
  if (!chapter.videoUrl) missingFields.push("Chapter video")

  const requiredFields = [
    Boolean(chapter.title),
    Boolean(chapter.description),
    Boolean(chapter.videoUrl),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`
  const isPublishable = missingFields.length === 0

  return (
    <div className="flex flex-col">
      {/* Chapter publication banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b px-6 py-3.5 text-sm ${
          chapter.isPublished
            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
            : "bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/20"
        }`}
      >
        <div className="flex items-center gap-x-2">
          {chapter.isPublished ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <span>
            {chapter.isPublished
              ? "This chapter is published and visible to enrolled students."
              : "This chapter is currently unpublished. It will not appear in the course curriculum player."}
          </span>
        </div>
        <div className="flex items-center gap-x-2 font-semibold">
          <span>Complete all fields to publish {completionText}</span>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to course setup
          </Link>
          <div className="flex items-center gap-x-3">
            {chapter.isFree && (
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                Free preview
              </Badge>
            )}
            <Badge
              variant={chapter.isPublished ? "default" : "secondary"}
              className={chapter.isPublished ? "bg-emerald-600 text-white" : "text-muted-foreground"}
            >
              {chapter.isPublished ? "Published" : "Draft"}
            </Badge>
            <ChapterActions
              courseId={courseId}
              chapterId={chapterId}
              isPublished={chapter.isPublished}
              disabled={!isPublishable}
              missingFields={missingFields}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Course:</span>
            <span className="text-foreground font-semibold">{course.title}</span>
            <span>•</span>
            <span>Position #{chapter.position}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
            Chapter Setup
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete all fields to publish {completionText}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Left Column: Chapter Metadata */}
          <div className="space-y-6">
            <div className="flex items-center gap-x-2 text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Customize your chapter</h2>
            </div>

            <ChapterTitleForm
              initialData={{ title: chapter.title }}
              courseId={courseId}
              chapterId={chapter.id}
            />

            <ChapterDescriptionForm
              initialData={{ description: chapter.description }}
              courseId={courseId}
              chapterId={chapter.id}
            />

            <div className="flex items-center gap-x-2 text-foreground pt-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Eye className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Access settings</h2>
            </div>

            <ChapterAccessForm
              initialData={{ isFree: chapter.isFree }}
              courseId={courseId}
              chapterId={chapter.id}
            />
          </div>

          {/* Right Column: Video & Media */}
          <div className="space-y-6">
            <div className="flex items-center gap-x-2 text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Video className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Add a video</h2>
            </div>

            <VideoUpload
              initialData={{ videoUrl: chapter.videoUrl }}
              courseId={courseId}
              chapterId={chapter.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
