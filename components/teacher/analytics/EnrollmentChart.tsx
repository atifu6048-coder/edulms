"use client"

import * as React from "react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, BookOpen, Users, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface DailyEnrollmentPoint {
  date: string
  label: string
  enrollments: number
}

export interface CourseAnalyticsBreakdown {
  courseId: string
  title: string
  isPublished: boolean
  studentsCount: number
  averageCompletion: number
  chaptersCount: number
}

interface EnrollmentChartProps {
  chartData: DailyEnrollmentPoint[]
  courseStats: CourseAnalyticsBreakdown[]
}

export function EnrollmentChart({ chartData, courseStats }: EnrollmentChartProps) {
  const totalPeriodEnrollments = chartData.reduce(
    (acc, curr) => acc + curr.enrollments,
    0
  )

  return (
    <div className="space-y-8">
      {/* 30-Day Trend Chart Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-lg font-bold">
                Enrollment Trends (Last 30 Days)
              </CardTitle>
            </div>
            <CardDescription className="mt-1">
              Daily student registrations across all your authored courses.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-bold self-start sm:self-auto">
            <span>+{totalPeriodEnrollments} Enrollments in 30d</span>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur-xs text-xs">
                          <p className="font-semibold text-foreground">{label}</p>
                          <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                            {payload[0].value} {payload[0].value === 1 ? "student" : "students"} enrolled
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#enrollmentGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Per-Course Breakdown Table */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Course Performance Breakdown</CardTitle>
          <CardDescription>
            Detailed metrics showing student volume and average completion rates per course.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[340px]">Course Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Published Lessons</TableHead>
                <TableHead className="text-center">Total Students</TableHead>
                <TableHead className="text-right">Average Completion</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {courseStats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                    No courses authored yet. Create your first course to view metrics.
                  </TableCell>
                </TableRow>
              ) : (
                courseStats.map((item) => (
                  <TableRow key={item.courseId} className="hover:bg-muted/30 transition-colors">
                    {/* Course Title */}
                    <TableCell>
                      <Link
                        href={`/teacher/courses/${item.courseId}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {item.isPublished ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-none text-[11px] font-semibold">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px]">
                          Draft
                        </Badge>
                      )}
                    </TableCell>

                    {/* Chapters */}
                    <TableCell className="text-center text-sm font-medium">
                      {item.chaptersCount}
                    </TableCell>

                    {/* Students */}
                    <TableCell className="text-center font-bold text-sm">
                      {item.studentsCount}
                    </TableCell>

                    {/* Avg Completion */}
                    <TableCell className="text-right">
                      <div className="space-y-1.5 inline-block text-right">
                        <span className="text-xs font-bold text-foreground">
                          {item.averageCompletion}%
                        </span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${item.averageCompletion}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
