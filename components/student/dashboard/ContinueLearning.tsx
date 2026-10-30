"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { PlayCircle, Layers, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/student/learn/ProgressBar"
import { cn } from "@/lib/utils"

interface ContinueLearningProps {
  course: {
    id: string
    title: string
    description?: string | null
    imageUrl?: string | null
    category?: {
      id?: string
      name: string
    } | null
  }
  targetChapterId: string
  targetChapterTitle?: string
  completedCount: number
  totalCount: number
  className?: string
}

export function ContinueLearning({
  course,
  targetChapterId,
  targetChapterTitle,
  completedCount,
  totalCount,
  className,
}: ContinueLearningProps) {

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Course Thumbnail */}
        <div className="relative aspect-video w-full md:w-56 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/60">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <Layers className="h-10 w-10 text-primary/40" />
            </div>
          )}
        </div>

        {/* Content & Details */}
        <div className="flex-1 min-w-0 space-y-3 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold gap-1">
              <Sparkles className="h-3 w-3" />
              Continue Learning
            </Badge>
            {course.category && (
              <Badge variant="outline" className="text-xs">
                {course.category.name}
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-bold tracking-tight text-foreground truncate">
            {course.title}
          </h3>

          {targetChapterTitle && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              <span className="font-semibold text-foreground">Up next:</span>{" "}
              {targetChapterTitle}
            </p>
          )}

          {/* Progress Bar */}
          <div className="pt-1 max-w-md">
            <ProgressBar
              completedCount={completedCount}
              totalCount={totalCount}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <Button
            asChild
            size="lg"
            className="w-full md:w-auto font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link href={`/student/learn/${course.id}/${targetChapterId}`}>
              <PlayCircle className="mr-2 h-5 w-5" />
              Resume
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
