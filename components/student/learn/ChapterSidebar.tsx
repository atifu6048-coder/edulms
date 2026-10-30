"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Lock, PlayCircle, ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/student/learn/ProgressBar"

export interface ChapterSidebarItem {
  id: string
  title: string
  position: number
  isFree: boolean
  isCompleted: boolean
}

interface ChapterSidebarProps {
  courseTitle: string
  courseId: string
  chapters: ChapterSidebarItem[]
  currentChapterId: string
  isEnrolled: boolean
  completedCount: number
  totalCount: number
  className?: string
}

export function ChapterSidebar({
  courseTitle,
  courseId,
  chapters,
  currentChapterId,
  isEnrolled,
  completedCount,
  totalCount,
  className,
}: ChapterSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs gap-5",
        className
      )}
    >
      {/* Course Header */}
      <div className="space-y-2">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Course overview
        </Link>
        <h2 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
          {courseTitle}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl bg-muted/40 p-3.5 border border-border/60">
        <ProgressBar completedCount={completedCount} totalCount={totalCount} />
      </div>

      {/* Chapter List */}
      <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 pb-1">
          Course Lessons
        </div>
        <div className="divide-y divide-border/50 rounded-xl border border-border/70 overflow-hidden bg-background/50">
          {chapters.map((chapter, index) => {
            const isCurrent = chapter.id === currentChapterId
            const isLocked = !isEnrolled && !chapter.isFree

            const content = (
              <div
                className={cn(
                  "flex items-center justify-between p-3.5 text-xs sm:text-sm font-medium transition-colors",
                  isCurrent
                    ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                    : "hover:bg-muted/40 text-foreground",
                  isLocked && "opacity-60 cursor-not-allowed hover:bg-transparent"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate">{chapter.title}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {chapter.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : isLocked ? (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : chapter.isFree && !isEnrolled ? (
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/40 text-primary">
                      Preview
                    </Badge>
                  ) : (
                    <PlayCircle
                      className={cn(
                        "h-4 w-4",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
              </div>
            )

            if (isLocked) {
              return (
                <div key={chapter.id} title="Enroll to unlock this chapter">
                  {content}
                </div>
              )
            }

            return (
              <Link
                key={chapter.id}
                href={`/student/learn/${courseId}/${chapter.id}`}
              >
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
