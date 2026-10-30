"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Calendar,
  CheckCircle2,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/EmptyState"

export interface StudentEnrollmentRow {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  studentAvatar?: string | null
  courseId: string
  courseTitle: string
  enrolledAt: string | Date
  progressPercentage: number
  completedChapters: number
  totalChapters: number
}

interface StudentTableProps {
  initialData: StudentEnrollmentRow[]
}

export function StudentTable({ initialData }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc")

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const filteredAndSorted = React.useMemo(() => {
    const result = initialData.filter((item) => {
      const query = searchTerm.toLowerCase().trim()
      if (!query) return true
      return (
        item.studentName.toLowerCase().includes(query) ||
        item.studentEmail.toLowerCase().includes(query) ||
        item.courseTitle.toLowerCase().includes(query)
      )
    })

    result.sort((a, b) => {
      const dateA = new Date(a.enrolledAt).getTime()
      const dateB = new Date(b.enrolledAt).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    })

    return result
  }, [initialData, searchTerm, sortDirection])

  if (initialData.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No students enrolled yet"
        description="Students who register for any of your courses will appear here along with their live completion progress."
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student or course..."
            className="pl-9 h-10"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleSort}
          className="h-10 text-xs font-semibold gap-1.5 self-start sm:self-auto"
        >
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4 text-primary" />
          ) : (
            <ArrowDown className="h-4 w-4 text-primary" />
          )}
          <span>Date Enrolled ({sortDirection === "asc" ? "Oldest" : "Newest"})</span>
        </Button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[300px]">Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="w-[180px]">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-1 hover:text-foreground font-semibold transition-colors"
                >
                  <span>Enrolled Date</span>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="w-[200px] text-right">Course Progress</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No students match your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((row) => {
                const initial = row.studentName.charAt(0).toUpperCase()
                const dateFormatted = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(row.enrolledAt))

                return (
                  <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                    {/* Student */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {row.studentAvatar ? (
                            <Image
                              src={row.studentAvatar}
                              alt={row.studentName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span>{initial}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {row.studentName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {row.studentEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Course */}
                    <TableCell>
                      <Link
                        href={`/teacher/courses/${row.courseId}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {row.courseTitle}
                      </Link>
                    </TableCell>

                    {/* Enrolled Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                        <span>{dateFormatted}</span>
                      </div>
                    </TableCell>

                    {/* Progress % */}
                    <TableCell className="text-right">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-foreground">
                          {row.progressPercentage === 100 && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                          <span>{row.progressPercentage}%</span>
                          <span className="text-[11px] text-muted-foreground font-normal">
                            ({row.completedChapters}/{row.totalChapters})
                          </span>
                        </div>
                        <div className="h-1.5 w-24 ml-auto overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${row.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
