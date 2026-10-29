"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/shared/ConfirmModal"

interface ChapterActionsProps {
  courseId: string
  chapterId: string
  isPublished: boolean
}

export function ChapterActions({
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        {
          method: "DELETE",
        }
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to delete chapter")
      }

      toast.success("Chapter deleted successfully")
      router.push(`/teacher/courses/${courseId}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal
        title="Delete this chapter?"
        description="This will permanently delete this chapter and its video content. This action cannot be undone."
        confirmText="Delete chapter"
        onConfirm={onDelete}
        disabled={isLoading}
      >
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete chapter
        </Button>
      </ConfirmModal>
    </div>
  )
}
