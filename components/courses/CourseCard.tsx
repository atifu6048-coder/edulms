"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Layers } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface CourseCardProps {
  id: string
  title: string
  imageUrl?: string | null
  chaptersLength: number
  price?: number | null
  category?: string | null
  description?: string | null
  className?: string
}

export function CourseCard({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  category,
  description,
  className,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-indigo-900",
          className
        )}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 via-zinc-100 to-indigo-500/5 text-zinc-400 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-800">
                <Layers className="h-10 w-10 text-indigo-400/60" />
              </div>
            )}
            {category && (
              <div className="absolute top-3 left-3">
                <Badge className="rounded-lg bg-white/90 text-zinc-900 shadow-sm backdrop-blur-md hover:bg-white dark:bg-zinc-950/90 dark:text-zinc-100">
                  {category}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-5">
          <h3 className="line-clamp-2 text-base font-bold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
            {title}
          </h3>
          {description && (
            <p className="mt-2 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-zinc-100 px-5 py-3.5 text-xs text-zinc-500 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5 font-medium">
            <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
            <span>
              {chaptersLength} {chaptersLength === 1 ? "lesson" : "lessons"}
            </span>
          </div>
          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
            {price === null || price === undefined || price === 0
              ? "Free"
              : `$${price.toFixed(2)}`}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

