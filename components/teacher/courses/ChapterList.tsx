"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd"
import { GripVertical, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { ChapterForm } from "@/components/teacher/courses/ChapterForm"
import { cn } from "@/lib/utils"

export interface ChapterItem {
  id: string
  title: string
  position: number
  isPublished: boolean
  isFree: boolean
}

interface ChapterListProps {
  items: ChapterItem[]
  courseId: string
}

export function ChapterList({ items, courseId }: ChapterListProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const [chapters, setChapters] = React.useState<ChapterItem[]>(items)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    setChapters(items)
  }, [items])

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const startIndex = result.source.index
    const endIndex = result.destination.index

    if (startIndex === endIndex) return

    const reordered = Array.from(chapters)
    const [movedChapter] = reordered.splice(startIndex, 1)
    reordered.splice(endIndex, 0, movedChapter)

    // Optimistically update positions
    const updatedWithPositions = reordered.map((chapter, index) => ({
      ...chapter,
      position: index + 1,
    }))

    setChapters(updatedWithPositions)

    const payload = updatedWithPositions.map((chapter) => ({
      id: chapter.id,
      position: chapter.position,
    }))

    try {
      setIsUpdating(true)
      const res = await fetch(`/api/courses/${courseId}/chapters/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ list: payload }),
      })

      if (!res.ok) {
        throw new Error("Failed to reorder chapters")
      }

      toast.success("Chapters reordered successfully")
      router.refresh()
    } catch {
      toast.error("Failed to reorder chapters. Restoring previous order.")
      setChapters(items)
    } finally {
      setIsUpdating(false)
    }
  }

  const onDelete = async (chapterId: string) => {
    try {
      setDeletingId(chapterId)
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
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs relative">
      {isUpdating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-xs">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium text-foreground mb-3">
        <span className="text-sm font-semibold">Course curriculum</span>
        <span className="text-xs text-muted-foreground">
          {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
        </span>
      </div>

      {!isMounted ? (
        <div className="py-4 text-center text-xs text-muted-foreground">
          Loading curriculum...
        </div>
      ) : chapters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 py-8 px-4 text-center mb-3">
          <p className="text-sm font-medium text-muted-foreground">
            No chapters authored yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add chapters to structure your lessons and videos.
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="chapters-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 mb-3"
              >
                {chapters.map((chapter, index) => (
                  <Draggable
                    key={chapter.id}
                    draggableId={chapter.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "flex items-center gap-x-2 rounded-lg border bg-background px-3 py-2 text-sm transition-all shadow-xs",
                          snapshot.isDragging && "border-primary shadow-md bg-muted/30",
                          chapter.isPublished && "border-emerald-500/30 bg-emerald-500/5"
                        )}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing px-1"
                          title="Drag to reorder"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        <span className="font-mono text-xs text-muted-foreground w-4 text-center">
                          {index + 1}
                        </span>

                        <span className="flex-1 font-medium truncate text-foreground">
                          {chapter.title}
                        </span>

                        <div className="ml-auto flex items-center gap-x-2">
                          {chapter.isFree && (
                            <Badge
                              variant="outline"
                              className="text-[11px] font-normal border-primary/40 bg-primary/10 text-primary"
                            >
                              Free preview
                            </Badge>
                          )}

                          <Badge
                            variant={chapter.isPublished ? "default" : "secondary"}
                            className={cn(
                              "text-[11px] font-normal",
                              chapter.isPublished
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "text-muted-foreground"
                            )}
                          >
                            {chapter.isPublished ? "Published" : "Draft"}
                          </Badge>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              router.push(
                                `/teacher/courses/${courseId}/chapters/${chapter.id}`
                              )
                            }
                            title="Edit chapter"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <ConfirmModal
                            title="Delete this chapter?"
                            description="This action cannot be undone. Any progress recorded for this chapter will be permanently removed."
                            confirmText="Delete chapter"
                            onConfirm={() => onDelete(chapter.id)}
                            disabled={deletingId === chapter.id}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              title="Delete chapter"
                              disabled={deletingId === chapter.id}
                            >
                              {deletingId === chapter.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </ConfirmModal>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Form to add a new chapter */}
      <ChapterForm courseId={courseId} />

      {chapters.length > 1 && (
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Drag and drop chapters to reorder curriculum
        </p>
      )}
    </div>
  )
}
