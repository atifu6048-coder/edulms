"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChapterActionsProps {
  courseId: string
  chapterId: string
  isPublished: boolean
  disabled: boolean
  missingFields?: string[]
}

export function ChapterActions({
  courseId,
  chapterId,
  isPublished,
  disabled,
  missingFields = [],
}: ChapterActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const onPublishToggle = async () => {
    try {
      setIsLoading(true)

      const endpoint = isPublished
        ? `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        : `/api/courses/${courseId}/chapters/${chapterId}/publish`

      const res = await fetch(endpoint, {
        method: "PATCH",
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(
          errorData?.error || "Failed to update chapter publication status."
        )
      }

      toast.success(
        isPublished
          ? "Chapter unpublished."
          : "Chapter published successfully!"
      )
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

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

  const publishButton = (
    <Button
      onClick={onPublishToggle}
      disabled={(!isPublished && disabled) || isLoading}
      variant={isPublished ? "outline" : "default"}
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          {isPublished ? "Unpublishing..." : "Publishing..."}
        </>
      ) : isPublished ? (
        "Unpublish"
      ) : (
        "Publish"
      )}
    </Button>
  )

  return (
    <div className="flex items-center gap-x-2">
      <TooltipProvider>
        {!isPublished && disabled && missingFields.length > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-block cursor-not-allowed">
                {publishButton}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p className="font-semibold mb-1">Missing required fields to publish:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {missingFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        ) : (
          publishButton
        )}
      </TooltipProvider>

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
