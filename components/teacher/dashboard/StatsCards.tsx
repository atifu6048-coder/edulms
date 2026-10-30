import * as React from "react"
import { BookOpen, CheckCircle2, Users, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardsProps {
  totalCourses: number
  publishedCourses: number
  totalStudents: number
  totalChapters: number
}

export function StatsCards({
  totalCourses,
  publishedCourses,
  totalStudents,
  totalChapters,
}: StatsCardsProps) {
  const draftCourses = Math.max(0, totalCourses - publishedCourses)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Courses */}
      <Card className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Courses
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {totalCourses}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {draftCourses} {draftCourses === 1 ? "draft" : "drafts"} in development
          </p>
        </CardContent>
      </Card>

      {/* Published Courses */}
      <Card className="border border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Published Courses
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {publishedCourses}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Live and available for students
          </p>
        </CardContent>
      </Card>

      {/* Total Students */}
      <Card className="border border-border/80 shadow-xs hover:border-blue-500/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Students
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {totalStudents}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enrolled across your curriculum
          </p>
        </CardContent>
      </Card>

      {/* Total Chapters */}
      <Card className="border border-border/80 shadow-xs hover:border-purple-500/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Chapters
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Layers className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {totalChapters}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Authored video lessons
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
