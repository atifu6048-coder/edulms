"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Layers, CheckCircle2, PlayCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ProgressBar } from "@/components/student/learn/ProgressBar"
import { EmptyState } from "@/components/shared/EmptyState"
import { cn } from "@/lib/utils"

export interface EnrolledCourseItem {
  id: string
  title: string
  description?: string | null
  imageUrl?: string | null
  category?: string | null
  instructorName?: string | null
  completedCount: number
  totalCount: number
  targetChapterId: string
  isCompleted: boolean
}

interface CourseGridProps {
  courses: EnrolledCourseItem[]
  className?: string
}

export function CourseGrid({ courses, className }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No enrolled courses yet"
        description="You have not enrolled in any courses yet. Explore the course catalog to start learning today."
        actionLabel="Browse courses"
        actionHref="/courses"
      />
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {courses.map((course) => {
        const percentage =
          course.totalCount > 0
            ? Math.round((course.completedCount / course.totalCount) * 100)
            : 0

        return (
          <Card
            key={course.id}
            className="flex flex-col overflow-hidden border border-border/80 transition-all duration-200 hover:shadow-md"
          >
            {/* Thumbnail */}
            <CardHeader className="p-0">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-200 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <Layers className="h-10 w-10 text-primary/30" />
                  </div>
                )}
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex flex-1 flex-col p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                {course.category ? (
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                ) : (
                  <div />
                )}

                {course.isCompleted && (
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-none text-[11px] font-semibold gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>

              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                {course.instructorName && (
                  <p className="text-xs text-muted-foreground">
                    By {course.instructorName}
                  </p>
                )}
              </div>

              {/* Progress */}
              <div className="pt-1">
                <ProgressBar
                  completedCount={course.completedCount}
                  totalCount={course.totalCount}
                />
              </div>
            </CardContent>

            {/* Footer with Action Button */}
            <CardFooter className="p-5 pt-0">
              {course.isCompleted ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full font-semibold border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                >
                  <Link href={`/student/learn/${course.id}/${course.targetChapterId}`}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Review course
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full font-bold shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Link href={`/student/learn/${course.id}/${course.targetChapterId}`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
