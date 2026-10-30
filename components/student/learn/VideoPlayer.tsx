"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PlayCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CourseCompleteModal } from "@/components/student/learn/CourseCompleteModal"

interface VideoPlayerProps {
  videoUrl?: string | null
  title?: string
  chapterId?: string
  courseId?: string
  courseTitle?: string
  nextChapterId?: string
  isCompleted?: boolean
  isFinalIncomplete?: boolean
  onEnded?: () => void
  onCourseComplete?: () => void
  className?: string
}

export function VideoPlayer({
  videoUrl,
  title,
  chapterId,
  courseId,
  courseTitle = "Course",
  nextChapterId,
  isCompleted = false,
  isFinalIncomplete = false,
  onEnded,
  onCourseComplete,
  className,
}: VideoPlayerProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleEnded = async () => {
    if (onEnded) {
      onEnded()
      return
    }

    if (chapterId && !isCompleted) {
      try {
        const res = await fetch(`/api/progress/${chapterId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isCompleted: true }),
        })

        if (res.ok) {
          toast.success("Lesson completed!")
          if (isFinalIncomplete || !nextChapterId) {
            if (onCourseComplete) {
              onCourseComplete()
            } else {
              setIsModalOpen(true)
            }
          } else if (nextChapterId && courseId) {
            router.push(`/student/learn/${courseId}/${nextChapterId}`)
          }
          router.refresh()
        }
      } catch (err) {
        console.error("[VIDEO_AUTO_COMPLETE_ERROR]:", err)
      }
    }
  }

  if (!videoUrl) {
    return (
      <div
        className={cn(
          "relative flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-zinc-950 text-zinc-400 border border-border shadow-xl p-8 text-center",
          className
        )}
      >
        <PlayCircle className="h-16 w-16 text-zinc-600 stroke-1 mb-3" />
        <h3 className="text-base font-semibold text-zinc-300">
          No video available
        </h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          There is no video file attached to this lesson yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-border shadow-xl flex items-center justify-center",
          className
        )}
      >
        <video
          key={videoUrl}
          src={videoUrl}
          controls
          playsInline
          onEnded={handleEnded}
          aria-label={title || "Lesson Video"}
          className="h-full w-full object-contain"
        />
      </div>

      {courseId && (
        <CourseCompleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseId={courseId}
          courseTitle={courseTitle}
        />
      )}
    </>
  )
}
