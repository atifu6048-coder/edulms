"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Star,
  EyeOff,
  Layers,
  Users,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmModal } from "@/components/shared/ConfirmModal"

export interface AdminCourseRow {
  id: string
  title: string
  imageUrl?: string | null
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date | string
  categoryName?: string | null
  teacherName: string
  teacherEmail: string
  teacherAvatar?: string | null
  enrollmentsCount: number
  chaptersCount: number
}

interface AdminCoursesTableProps {
  initialCourses: AdminCourseRow[]
}

export function AdminCoursesTable({ initialCourses }: AdminCoursesTableProps) {
  const router = useRouter()
  const [courses, setCourses] = React.useState<AdminCourseRow[]>(initialCourses)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [loadingCourseId, setLoadingCourseId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setCourses(initialCourses)
  }, [initialCourses])

  const toggleFeatured = async (courseId: string, currentFeatured: boolean) => {
    try {
      setLoadingCourseId(courseId)
      const nextFeatured = !currentFeatured

      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextFeatured }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update course.")
      }

      toast.success(
        nextFeatured
          ? "Course featured on home catalog"
          : "Course removed from featured"
      )

      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, isFeatured: nextFeatured } : c
        )
      )
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setLoadingCourseId(null)
    }
  }

  const forceUnpublish = async (courseId: string) => {
    try {
      setLoadingCourseId(courseId)
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: false }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to unpublish course.")
      }

      toast.success("Course forced to draft mode")
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, isPublished: false } : c
        )
      )
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setLoadingCourseId(null)
    }
  }

  const filteredCourses = React.useMemo(() => {
    return courses.filter((c) => {
      const query = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !query ||
        c.title.toLowerCase().includes(query) ||
        c.teacherName.toLowerCase().includes(query) ||
        c.teacherEmail.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && c.isPublished) ||
        (statusFilter === "DRAFT" && !c.isPublished) ||
        (statusFilter === "FEATURED" && c.isFeatured)

      return matchesSearch && matchesStatus
    })
  }, [courses, searchTerm, statusFilter])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by course title or instructor..."
            className="pl-9 h-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PUBLISHED", "DRAFT", "FEATURED"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="text-xs font-semibold capitalize h-9"
            >
              {s.toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Courses Table */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[340px]">Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px] text-center">Students</TableHead>
              <TableHead className="w-[120px] text-center">Featured</TableHead>
              <TableHead className="w-[140px] text-right">Admin Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No courses found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => {
                const isBusy = loadingCourseId === course.id
                const initial = course.teacherName.charAt(0).toUpperCase()

                return (
                  <TableRow key={course.id} className="hover:bg-muted/30 transition-colors">
                    {/* Course Title & Thumbnail */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/60">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <Layers className="h-5 w-5 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <Link
                            href={`/courses/${course.id}`}
                            className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                            title={course.title}
                          >
                            {course.title}
                          </Link>
                          {course.categoryName && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                              {course.categoryName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Teacher */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {course.teacherAvatar ? (
                            <Image
                              src={course.teacherAvatar}
                              alt={course.teacherName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span>{initial}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {course.teacherName}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {course.teacherEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {course.isPublished ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-none text-[11px] font-semibold gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px]">
                          Draft
                        </Badge>
                      )}
                    </TableCell>

                    {/* Students Count */}
                    <TableCell className="text-center font-bold text-sm">
                      {course.enrollmentsCount}
                    </TableCell>

                    {/* Featured Toggle */}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => toggleFeatured(course.id, course.isFeatured)}
                        className="h-8 px-2 text-xs font-medium gap-1"
                        title={course.isFeatured ? "Unfeature course" : "Mark as featured"}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            course.isFeatured
                              ? "fill-amber-400 text-amber-500"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-[11px]">
                          {course.isFeatured ? "Featured" : "Regular"}
                        </span>
                      </Button>
                    </TableCell>

                    {/* Admin Actions */}
                    <TableCell className="text-right">
                      {course.isPublished ? (
                        <ConfirmModal
                          title="Force-unpublish Course"
                          description={`Are you sure you want to unpublish "${course.title}"? It will immediately disappear from the public course catalog.`}
                          confirmText="Unpublish"
                          onConfirm={() => forceUnpublish(course.id)}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isBusy}
                            className="h-8 text-xs font-semibold text-destructive hover:bg-destructive/10 border-destructive/30"
                          >
                            <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                            Unpublish
                          </Button>
                        </ConfirmModal>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Draft only
                        </span>
                      )}
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
