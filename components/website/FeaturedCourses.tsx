import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen } from "lucide-react"

import { db } from "@/lib/db"
import { CourseCard } from "@/components/website/CourseCard"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"

export async function FeaturedCourses() {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          chapters: true,
          enrollments: true,
        },
      },
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
    take: 6,
  })

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Syllabus</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Featured Courses
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Explore hands-on curriculum taught through structured lessons. Every lesson is crafted to deliver practical, portfolio-ready outcomes.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="gap-2 rounded-xl">
              <span>View all courses</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No featured courses yet"
            description="Our instructors are preparing exciting new courses. Check back soon or visit our full catalog."
            actionLabel="Browse catalog"
            actionHref="/courses"
            className="mt-12"
          />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.imageUrl}
                price={course.price}
                level={course.level}
                category={course.category}
                instructor={course.user}
                chaptersCount={course._count.chapters}
                enrollmentsCount={course._count.enrollments}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
