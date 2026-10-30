import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import {
  Users,
  Shield,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  Calendar,
  ArrowRight,
  FolderTree,
} from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Admin Overview - EduFlow",
  description: "Platform-wide administrative metrics, user distribution, and system registry.",
}

export default async function AdminOverviewPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/student")
  }

  // Fetch platform-wide totals in parallel
  const [
    totalUsers,
    studentCount,
    instructorCount,
    adminCount,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalCertificates,
    newestUsers,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "STUDENT" } }),
    db.user.count({ where: { role: "INSTRUCTOR" } }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.course.count(),
    db.course.count({ where: { isPublished: true } }),
    db.enrollment.count(),
    db.certificate.count(),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    }),
  ])

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold gap-1">
              <Shield className="h-3.5 w-3.5" />
              Platform Administration
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2">
            System Overview & Metrics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global metrics across all learners, instructors, courses, and certifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="font-semibold shadow-xs">
            <Link href="/admin/users">
              <Users className="mr-1.5 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="font-semibold shadow-xs">
            <Link href="/admin/courses">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Manage Courses
            </Link>
          </Button>
          <Button asChild size="sm" className="font-semibold shadow-xs">
            <Link href="/admin/categories">
              <FolderTree className="mr-1.5 h-4 w-4" />
              Categories
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <Card className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Accounts
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totalUsers}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
              <span>{studentCount} Students</span>
              <span>•</span>
              <span>{instructorCount} Instructors</span>
              <span>•</span>
              <span>{adminCount} Admins</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="border border-border/80 shadow-xs hover:border-blue-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Courses
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totalCourses}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {publishedCourses} published • {totalCourses - publishedCourses} drafts
            </p>
          </CardContent>
        </Card>

        {/* Enrollments */}
        <Card className="border border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Enrollments
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totalEnrollments}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Active student course registrations
            </p>
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="border border-border/80 shadow-xs hover:border-amber-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Certificates Issued
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totalCertificates}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Verified completions with credentials
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Newest Signups Table */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-bold">Newest Account Signups</CardTitle>
            <CardDescription>
              Recent registered users across all roles.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
            <Link href="/admin/users">
              View All Users
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {newestUsers.map((u) => {
              const name = u.fullName || "User"
              const initial = name.charAt(0).toUpperCase()
              const joinedDate = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(u.createdAt))

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {u.avatarUrl ? (
                        <Image
                          src={u.avatarUrl}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span>{initial}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <Badge
                      variant={
                        u.role === "ADMIN"
                          ? "default"
                          : u.role === "INSTRUCTOR"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs capitalize font-semibold"
                    >
                      {u.role.toLowerCase()}
                    </Badge>
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{joinedDate}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
