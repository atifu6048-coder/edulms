"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BookOpen, ChevronRight } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"

export interface CourseListItem {
  id: string
  title: string
  isPublished: boolean
  createdAt: Date | string
  chaptersCount: number
}

interface CourseListProps {
  courses: CourseListItem[]
}

export function CourseList({ courses }: CourseListProps) {
  const router = useRouter()

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No courses created yet"
        description="You have not created any courses yet. Create your first course to start adding chapters and lessons."
        actionLabel="New course"
        actionHref="/teacher/courses/create"
      />
    )
  }

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-6 font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Chapters</TableHead>
            <TableHead className="font-semibold">Created Date</TableHead>
            <TableHead className="w-[100px] text-right pr-6 font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(course.createdAt))

            return (
              <TableRow
                key={course.id}
                onClick={() => router.push(`/teacher/courses/${course.id}`)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <TableCell className="pl-6 py-4 font-medium text-foreground">
                  <span className="font-semibold hover:underline">
                    {course.title}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  {course.isPublished ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/30">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">
                      Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-4 text-muted-foreground text-sm">
                  {course.chaptersCount} {course.chaptersCount === 1 ? "chapter" : "chapters"}
                </TableCell>
                <TableCell className="py-4 text-muted-foreground text-sm">
                  {formattedDate}
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/teacher/courses/${course.id}`)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Edit course</span>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
