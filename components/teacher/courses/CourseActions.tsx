"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/shared/ConfirmModal"

interface CourseActionsProps {
  courseId: string
}

export function CourseActions({ courseId }: CourseActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

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

  return (
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
  )
}
