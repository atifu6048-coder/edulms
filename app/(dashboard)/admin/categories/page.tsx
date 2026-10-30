import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import {
  CategoryManagement,
  type CategoryItem,
} from "@/components/admin/categories/CategoryManagement"

export const metadata: Metadata = {
  title: "Categories - Admin",
  description: "Create, rename, and manage course topic taxonomy and auto slugs.",
}

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/student")
  }

  const rawCategories = await db.category.findMany({
    include: {
      _count: {
        select: {
          courses: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  const categories: CategoryItem[] = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    coursesCount: c._count.courses,
    createdAt: c.createdAt,
  }))

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Course Category Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Full taxonomy control for catalog topics. Create categories with auto-generated slugs or manage existing disciplines.
        </p>
      </div>

      {/* Category Management */}
      <CategoryManagement initialCategories={categories} />
    </div>
  )
}
