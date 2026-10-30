import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Calendar, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"

export interface RecentEnrollmentItem {
  id: string
  createdAt: Date | string
  user: {
    fullName: string | null
    email: string
    avatarUrl?: string | null
  }
  course: {
    id: string
    title: string
  }
}

interface RecentEnrollmentsProps {
  enrollments: RecentEnrollmentItem[]
}

export function RecentEnrollments({ enrollments }: RecentEnrollmentsProps) {
  if (enrollments.length === 0) {
    return (
      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Student Enrollments</CardTitle>
          <CardDescription>
            The latest students who enrolled in your courses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Users}
            title="No enrollments yet"
            description="When students enroll in your published courses, their details and progress will appear here."
            className="min-h-[220px]"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-bold">Recent Student Enrollments</CardTitle>
          <CardDescription>
            Latest 8 students who registered for your courses.
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
          <Link href="/teacher/students">
            View All Students
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {enrollments.map((item) => {
            const studentName = item.user.fullName || "Student"
            const studentInitial = studentName.charAt(0).toUpperCase()
            const enrolledDate = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(item.createdAt))

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/40 transition-colors"
              >
                {/* Student Avatar & Info */}
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {item.user.avatarUrl ? (
                      <Image
                        src={item.user.avatarUrl}
                        alt={studentName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>{studentInitial}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {studentName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.user.email}
                    </p>
                  </div>
                </div>

                {/* Course & Date */}
                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div className="hidden sm:block text-right">
                    <Link
                      href={`/teacher/courses/${item.course.id}`}
                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 max-w-[200px]"
                    >
                      {item.course.title}
                    </Link>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>{enrolledDate}</span>
                    </div>
                  </div>

                  <span className="sm:hidden text-xs text-muted-foreground">
                    {enrolledDate}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
