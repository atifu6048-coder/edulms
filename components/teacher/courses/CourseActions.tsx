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

interface CourseActionsProps {
  courseId: string
  isPublished: boolean
  disabled: boolean
  missingFields?: string[]
}

export function CourseActions({
  courseId,
  isPublished,
  disabled,
  missingFields = [],
}: CourseActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const onPublishToggle = async () => {
    try {
      setIsLoading(true)

      const endpoint = isPublished
        ? `/api/courses/${courseId}/unpublish`
        : `/api/courses/${courseId}/publish`

      const response = await fetch(endpoint, {
        method: "PATCH",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.error || "Failed to update course publication status."
        )
      }

      toast.success(
        isPublished
          ? "Course unpublished successfully."
          : "Course published successfully! Visible in catalog."
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
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to delete course")
      }

      toast.success("Course deleted successfully")
      router.push("/teacher/courses")
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
        title="Delete this course?"
        description="This will permanently delete the course and all associated chapters, media, and student enrollment records. This action cannot be undone."
        confirmText="Delete course"
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
          Delete course
        </Button>
      </ConfirmModal>
    </div>
  )
}
