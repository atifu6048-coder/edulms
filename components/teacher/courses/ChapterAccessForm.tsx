"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, Loader2, Pencil, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean
  }
  courseId: string
  chapterId: string
}

export function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isFree, setIsFree] = React.useState(initialData.isFree)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const toggleEdit = () => {
    setIsEditing((current) => !current)
    setIsFree(initialData.isFree)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFree,
            isPreview: isFree,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to update chapter preview access")
      }

      toast.success("Chapter access settings updated")
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between font-medium text-foreground">
        <span className="text-sm font-semibold">Access settings</span>
        <Button onClick={toggleEdit} variant="ghost" size="sm" className="h-8 px-2 text-xs">
          {isEditing ? (
            <>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Cancel
            </>
          ) : (
            <>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-2 flex items-center gap-2">
          {initialData.isFree ? (
            <Badge className="bg-primary/10 text-primary border-primary/30">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Free preview enabled
            </Badge>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              This chapter is restricted to enrolled students only.
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/30">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              disabled={isSubmitting}
              className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-ring"
            />
            <div className="space-y-1">
              <span className="text-sm font-medium leading-none text-foreground">
                Allow free preview
              </span>
              <p className="text-xs text-muted-foreground">
                Check this option if you want students to view this chapter without enrolling or purchasing the course.
              </p>
            </div>
          </label>

          <div className="flex items-center gap-x-2">
            <Button disabled={isSubmitting} size="sm" type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
