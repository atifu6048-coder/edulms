"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Users, Layers } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface CourseCardProps {
  id: string
  title: string
  description?: string | null
  imageUrl?: string | null
  price?: number | null
  level?: string | null
  category?: {
    id: string
    name: string
  } | string | null
  instructor?: {
    id: string
    name?: string | null
    fullName?: string | null
    avatarUrl?: string | null
  } | null
  chaptersLength?: number
  chaptersCount?: number
  enrollmentsCount?: number
  className?: string
}

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
  price,
  level,
  category,
  instructor,
  chaptersLength,
  chaptersCount,
  enrollmentsCount = 0,
  className,
}: CourseCardProps) {
  const categoryName = typeof category === "string" ? category : category?.name
  const teacherName = instructor?.fullName || instructor?.name || "EduFlow Instructor"
  const teacherInitial = teacherName.charAt(0).toUpperCase()
  const totalChapters = chaptersCount ?? chaptersLength ?? 0

  const formatLevel = (lvl?: string | null) => {
    if (!lvl) return null
    switch (lvl.toUpperCase()) {
      case "BEGINNER":
        return "Beginner"
      case "INTERMEDIATE":
        return "Intermediate"
      case "ADVANCED":
        return "Advanced"
      default:
        return lvl
    }
  }

  const formattedLevel = formatLevel(level)

  return (
    <Link href={`/courses/${id}`} className="group block h-full">
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
          className
        )}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5 text-muted-foreground">
                <Layers className="h-10 w-10 text-primary/40" />
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              {categoryName && (
                <Badge className="rounded-md bg-background/90 text-foreground shadow-xs backdrop-blur-md hover:bg-background border-none text-[11px] font-semibold">
                  {categoryName}
                </Badge>
              )}
              {formattedLevel && (
                <Badge
                  variant="secondary"
                  className="rounded-md bg-black/60 text-white shadow-xs backdrop-blur-md hover:bg-black/70 border-none text-[11px] font-medium"
                >
                  {formattedLevel}
                </Badge>
              )}
            </div>

            {/* Price tag */}
            <div className="absolute bottom-3 right-3">
              <Badge className="rounded-md bg-primary text-primary-foreground shadow-xs font-bold text-xs border-none">
                {price === null || price === undefined || price === 0
                  ? "Free"
                  : `$${price.toFixed(2)}`}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 p-5">
          {/* Teacher avatar and name */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full bg-primary/10 text-primary items-center justify-center text-xs font-bold">
              {instructor?.avatarUrl ? (
                <Image
                  src={instructor.avatarUrl}
                  alt={teacherName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{teacherInitial}</span>
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground truncate">
              {teacherName}
            </span>
          </div>

          <h3 className="line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>

          {description && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/60 px-5 py-3.5 text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1.5 font-medium">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>
              {totalChapters} {totalChapters === 1 ? "chapter" : "chapters"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>
              {enrollmentsCount} {enrollmentsCount === 1 ? "student" : "students"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
