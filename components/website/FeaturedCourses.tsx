import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { CourseCard, type CourseCardProps } from "@/components/courses/CourseCard"
import { Button } from "@/components/ui/button"

const placeholderCourses: CourseCardProps[] = [
  {
    id: "full-stack-nextjs",
    title: "Full-Stack Web Development with Next.js & TypeScript",
    description: "Build robust, scalable full-stack web applications with App Router, server actions, and PostgreSQL.",
    chaptersLength: 18,
    price: 0,
    category: "Development",
  },
  {
    id: "modern-ui-ux-design",
    title: "Design Systems & Modern UI/UX Masterclass",
    description: "Master modern interface architecture, responsive layouts, design tokens, and user testing frameworks.",
    chaptersLength: 14,
    price: 0,
    category: "Design",
  },
  {
    id: "product-strategy-business",
    title: "Product Strategy & Tech Startup Fundamentals",
    description: "Learn how to validate ideas, conduct customer discovery, and scale early-stage digital products.",
    chaptersLength: 10,
    price: 0,
    category: "Business",
  },
  {
    id: "modern-digital-marketing",
    title: "Organic Growth & Content Marketing Strategy",
    description: "Actionable frameworks for audience growth, technical SEO, and building high-converting landing funnels.",
    chaptersLength: 8,
    price: 0,
    category: "Marketing",
  },
  {
    id: "creative-photography",
    title: "Visual Storytelling & Composition Fundamentals",
    description: "Camera control, natural lighting mastery, and digital post-processing workflow for compelling imagery.",
    chaptersLength: 12,
    price: 0,
    category: "Photography",
  },
  {
    id: "advanced-database-architecture",
    title: "Database Modeling with PostgreSQL & Prisma",
    description: "Designing resilient relational schemas, indexing strategies, foreign key constraints, and migrations.",
    chaptersLength: 9,
    price: 0,
    category: "Development",
  },
]

export function FeaturedCourses() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Syllabus</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Featured Courses
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              Explore hands-on curriculum taught through structured lessons. Every lesson is crafted to deliver practical, portfolio-ready outcomes.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="gap-2 rounded-xl border-zinc-300 dark:border-zinc-700">
              <span>View all courses</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Course Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  )
}

