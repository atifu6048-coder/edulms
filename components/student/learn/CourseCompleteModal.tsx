"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Award, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CourseCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseTitle: string
}

export function CourseCompleteModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: CourseCompleteModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClaimCertificate = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to issue certificate.")
      }

      toast.success("Certificate issued successfully!")
      onClose()
      router.push("/student/certificates")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center p-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
          <Award className="h-8 w-8" />
        </div>

        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-center">
            You finished the course!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            Congratulations on completing{" "}
            <span className="font-semibold text-foreground">{courseTitle}</span>
            . You have mastered all chapters and are now eligible for your
            official Certificate of Completion.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-1/2"
          >
            Review Course
          </Button>
          <Button
            type="button"
            onClick={handleClaimCertificate}
            disabled={isLoading}
            className="w-full sm:w-1/2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Issuing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get my certificate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
