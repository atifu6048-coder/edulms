"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  UploadCloud,
  Pencil,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface VideoUploadProps {
  initialData: {
    videoUrl: string | null
  }
  courseId: string
  chapterId: string
}

export function VideoUpload({
  initialData,
  courseId: _courseId,
  chapterId,
}: VideoUploadProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [progress, setProgress] = React.useState<number>(0)
  const [videoUrl, setVideoUrl] = React.useState<string | null>(
    initialData.videoUrl
  )
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const toggleEdit = () => {
    setIsEditing((prev) => !prev)
    setProgress(0)
  }

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file (MP4, WebM, etc.).")
      return
    }

    try {
      setIsUploading(true)
      setProgress(0)

      // 1. Fetch pre-signed direct upload URL from backend
      const initRes = await fetch("/api/upload/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId,
        }),
      })

      if (!initRes.ok) {
        const errData = await initRes.json().catch(() => null)
        throw new Error(errData?.error || "Failed to initialize video upload URL.")
      }

      const { uploadUrl, path } = await initRes.json()

      // 2. Upload file directly to Supabase Storage signed URL via XMLHttpRequest
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            setProgress(percent)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(
              new Error(`Direct storage upload failed with status ${xhr.status}`)
            )
          }
        }

        xhr.onerror = () => {
          reject(new Error("Network error during direct video upload."))
        }

        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", file.type || "video/mp4")
        xhr.send(file)
      })

      // 3. Confirm upload with backend to set videoUrl on the chapter
      const confirmRes = await fetch("/api/upload/video/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId,
          path,
        }),
      })

      if (!confirmRes.ok) {
        const errData = await confirmRes.json().catch(() => null)
        throw new Error(errData?.error || "Failed to confirm video upload.")
      }

      const { videoUrl: newVideoUrl } = await confirmRes.json()

      setVideoUrl(newVideoUrl)
      setIsEditing(false)
      setProgress(0)
      toast.success("Video uploaded successfully!")
      router.refresh()
    } catch (error) {
      console.error("[VIDEO_UPLOAD_CLIENT_ERROR]:", error)
      toast.error(
        error instanceof Error ? error.message : "Video upload failed"
      )
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between font-medium text-foreground">
        <span className="text-sm font-semibold">Chapter video</span>
        {videoUrl && (
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
                Replace video
              </>
            )}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={onFileChange}
        disabled={isUploading}
      />

      {/* View Mode: Native video player */}
      {!isEditing && videoUrl && (
        <div className="relative aspect-video mt-2 w-full overflow-hidden rounded-lg bg-black shadow-xs">
          <video
            controls
            src={videoUrl}
            className="h-full w-full object-contain"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Dropzone Mode */}
      {(isEditing || !videoUrl) && (
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
            isUploading && "pointer-events-none opacity-80 cursor-not-allowed"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center w-full max-w-xs py-4 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-foreground">
                  <span>Uploading to Supabase Storage</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 w-full" />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress < 100
                  ? "Streaming video directly from browser..."
                  : "Finalizing and linking video..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Click to upload video <span className="font-normal text-muted-foreground">or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                MP4, WebM, or QuickTime (direct signed upload to Supabase Storage)
              </p>
            </div>
          )}
        </div>
      )}

      {videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Video lesson active and ready for streaming</span>
        </div>
      )}
    </div>
  )
}
