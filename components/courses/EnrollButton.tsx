"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, PlayCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface EnrollButtonProps {
  courseId: string
  firstChapterId?: string
  targetChapterId?: string
  isEnrolled: boolean
  isSignedIn: boolean
}

export function EnrollButton({
  courseId,
  firstChapterId,
  targetChapterId,
  isEnrolled,
  isSignedIn,
}: EnrollButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const destinationChapterId = targetChapterId || firstChapterId

  // Case 1: User is not signed in -> redirect to /sign-in
  if (!isSignedIn) {
    return (
      <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-bold shadow-md">
        <Link href={`/sign-in?redirect=/courses/${courseId}`}>
          Enroll for Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    )
  }

  // Case 2: User is already enrolled -> Continue learning
  if (isEnrolled) {
    return (
      <Button
        asChild
        size="lg"
        className="w-full sm:w-auto h-12 px-8 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
      >
        <Link href={`/student/learn/${courseId}/${destinationChapterId}`}>
          <PlayCircle className="mr-2 h-5 w-5" />
          Continue learning
        </Link>
      </Button>
    )
  }

  // Case 3: Signed in, not enrolled -> Enroll button
  const handleEnroll = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      })

      const data = await res.json().catch(() => null)

      if (res.ok || res.status === 201) {
        toast.success("You're enrolled")
        router.push(`/student/learn/${courseId}/${firstChapterId}`)
        router.refresh()
        return
      }

      if (res.status === 400 && data?.error === "Already enrolled") {
        toast.info("You're already enrolled")
        router.push(`/student/learn/${courseId}/${firstChapterId}`)
        router.refresh()
        return
      }

      throw new Error(data?.error || "Failed to complete course enrollment.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isLoading}
      size="lg"
      className="w-full sm:w-auto h-12 px-8 text-base font-bold shadow-md"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        <>
          Enroll for Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}
