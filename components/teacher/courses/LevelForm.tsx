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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const levelOptions = [
  { label: "Beginner Level", value: "BEGINNER" },
  { label: "Intermediate Level", value: "INTERMEDIATE" },
  { label: "Advanced Level", value: "ADVANCED" },
]

interface LevelFormProps {
  initialData: {
    level: string | null
  }
  courseId: string
}

export function LevelForm({ initialData, courseId }: LevelFormProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [level, setLevel] = React.useState<string>(initialData.level || "")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const toggleEdit = () => {
    setIsEditing((current) => !current)
    setLevel(initialData.level || "")
  }

  const selectedOption = levelOptions.find((option) => option.value === initialData.level)

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
          level: level || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to update course level")
      }

      toast.success("Course level updated")
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
        <span className="text-sm font-semibold">Course level</span>
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
        <div className="mt-2">
          {selectedOption ? (
            <Badge variant="outline" className="font-medium text-xs">
              {selectedOption.label}
            </Badge>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No level specified
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={onSubmit} className="mt-2 space-y-3">
          <Select
            value={level}
            onValueChange={(val) => setLevel(val as string)}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Select course difficulty" />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-x-2">
            <Button
              disabled={isSubmitting || !level}
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
