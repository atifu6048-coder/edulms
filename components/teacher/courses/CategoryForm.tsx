"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pencil, Loader2, X } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFormProps {
  initialData: {
    categoryId: string | null
  }
  courseId: string
  options: { label: string; value: string }[]
}

export function CategoryForm({
  initialData,
  courseId,
  options,
}: CategoryFormProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [categoryId, setCategoryId] = React.useState<string>(
    initialData.categoryId || ""
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const toggleEdit = () => {
    setIsEditing((current) => !current)
    setCategoryId(initialData.categoryId || "")
  }

  const selectedOption = options.find((option) => option.value === initialData.categoryId)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: categoryId || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to update course category")
      }

      toast.success("Course category updated")
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
        <span className="text-sm font-semibold">Course category</span>
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
        <p
          className={cn(
            "mt-2 text-sm",
            !selectedOption && "italic text-muted-foreground"
          )}
        >
          {selectedOption ? selectedOption.label : "No category selected"}
        </p>
      )}

      {isEditing && (
        <form onSubmit={onSubmit} className="mt-2 space-y-3">
          <Select
            value={categoryId}
            onValueChange={(val) => setCategoryId(val as string)}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-x-2">
            <Button
              disabled={isSubmitting || !categoryId}
              size="sm"
              type="submit"
            >
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
