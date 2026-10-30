import { Metadata } from "next"
import { Sparkles, BookOpen } from "lucide-react"

import { db } from "@/lib/db"
import { CourseCard } from "@/components/website/CourseCard"
import { CoursesFilter } from "@/components/courses/CoursesFilter"
import { EmptyState } from "@/components/shared/EmptyState"

export const metadata: Metadata = {
  title: "Explore Courses - EduFlow",
  description: "Browse curated, high-impact courses taught by experienced industry practitioners.",
}

interface CoursesPageProps {
  searchParams: Promise<{
    title?: string
    categoryId?: string
    category?: string
  }>
}

export default async function PublicCoursesPage({
  searchParams,
}: CoursesPageProps) {
  const { title, categoryId: directCategoryId, category: categorySlug } = await searchParams

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  })

  // Match categoryId either from direct categoryId or from category name/slug
  let activeCategoryId = directCategoryId
  if (!activeCategoryId && categorySlug) {
    const matchedCategory = categories.find(
      (c) =>
        c.name.toLowerCase() === categorySlug.toLowerCase() ||
        c.id === categorySlug
    )
    if (matchedCategory) {
      activeCategoryId = matchedCategory.id
    }
  }

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(title
        ? {
            title: {
              contains: title,
              mode: "insensitive",
            },
          }
        : {}),
      ...(activeCategoryId ? { categoryId: activeCategoryId } : {}),
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
  })

  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Structured Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Explore Courses
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Gain job-ready skills through hands-on project syllabuses. Every course is 100% free and open for lifetime learning.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <CoursesFilter
          categories={categories}
          currentTitle={title}
          currentCategoryId={activeCategoryId}
        />

        {/* Course Grid or Empty State */}
        {courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No matching courses found"
            description="We couldn't find any published courses matching your search query or filter. Try using different keywords or clearing your filters."
            actionLabel="Reset filters"
            actionHref="/courses"
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}
