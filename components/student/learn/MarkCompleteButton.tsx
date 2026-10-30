"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { CourseCompleteModal } from "@/components/student/learn/CourseCompleteModal"

interface MarkCompleteButtonProps {
  chapterId: string
  courseId: string
  courseTitle?: string
  isCompleted: boolean
  nextChapterId?: string
  isFinalIncomplete?: boolean
  onCompleteModalTrigger?: () => void
}

export function MarkCompleteButton({
  chapterId,
  courseId,
  courseTitle = "Course",
  isCompleted: initialCompleted,
  nextChapterId,
  isFinalIncomplete = false,
  onCompleteModalTrigger,
}: MarkCompleteButtonProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = React.useState(initialCompleted)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  React.useEffect(() => {
    setIsCompleted(initialCompleted)
  }, [initialCompleted])

  const toggleCompletion = async () => {
    try {
      setIsLoading(true)
      const nextStatus = !isCompleted

      const res = await fetch(`/api/progress/${chapterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: nextStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update progress.")
      }

      setIsCompleted(nextStatus)

      if (nextStatus) {
        toast.success("Lesson completed!")
        if (isFinalIncomplete || !nextChapterId) {
          if (onCompleteModalTrigger) {
            onCompleteModalTrigger()
          } else {
            setIsModalOpen(true)
          }
        } else if (nextChapterId) {
          router.push(`/student/learn/${courseId}/${nextChapterId}`)
        }
        router.refresh()
      } else {
        toast.info("Lesson marked as incomplete.")
        router.refresh()
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={toggleCompletion}
        disabled={isLoading}
        type="button"
        variant={isCompleted ? "outline" : "default"}
        className={
          isCompleted
            ? "border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
        ) : (
          <Circle className="mr-2 h-4 w-4" />
        )}
        {isCompleted ? "Completed" : "Mark as complete"}
      </Button>

      <CourseCompleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
      />
    </>
  )
}
