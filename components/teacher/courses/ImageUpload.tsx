"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  UploadCloud,
  ImageIcon,
  Pencil,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  initialData: {
    imageUrl: string | null
  }
  courseId: string
}

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB

export function ImageUpload({ initialData, courseId }: ImageUploadProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState<string | null>(
    initialData.imageUrl
  )
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const toggleEdit = () => {
    setIsEditing((prev) => !prev)
  }

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP, etc.).")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image file must be under 4MB.")
      return
    }

    try {
      setIsUploading(true)

      // 1. Upload file to Supabase Storage via our backend API route
      const formData = new FormData()
      formData.append("file", file)
      formData.append("courseId", courseId)

      const uploadRes = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to upload image")
      }

      const { url } = await uploadRes.json()

      // 2. Persist returned public URL to the course record via PUT route
      const courseRes = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: url,
        }),
      })

      if (!courseRes.ok) {
        const errorData = await courseRes.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to update course with new image")
      }

      setImageUrl(url)
      setIsEditing(false)
      toast.success("Course image updated successfully")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isUploading) setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isUploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
    // Reset file input value so re-uploading the same file still triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between font-medium text-foreground">
        <span className="text-sm font-semibold">Course image</span>
        {imageUrl && (
          <Button
            onClick={toggleEdit}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            disabled={isUploading}
          >
            {isEditing ? (
              <>
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Change image
              </>
            )}
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
        disabled={isUploading}
      />

      {/* View Mode: Image exists & not editing */}
      {!isEditing && imageUrl && (
        <div className="relative aspect-video mt-2 w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={imageUrl}
            alt="Course thumbnail"
            fill
            className="object-cover transition-transform duration-200 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
      )}

      {/* Dropzone Mode: No image or editing */}
      {(isEditing || !imageUrl) && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "relative mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
            isUploading && "pointer-events-none opacity-60 cursor-not-allowed"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">
                Uploading to Supabase Storage...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Optimizing and storing your thumbnail.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WebP, or SVG (max 4MB, 16:9 recommended)
              </p>
            </div>
          )}
        </div>
      )}

      {imageUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>16:9 aspect ratio thumbnail uploaded</span>
        </div>
      )}
    </div>
  )
}
