# Contributing Guidelines & Templates

This document outlines the standard coding patterns, component blueprints, API route templates, and Git commit conventions for **EduFlow**. Every future feature or prompt should adhere to these conventions.

---

## 1. UI Component Template

Use this standard structure when creating new React components. It includes TypeScript props, Tailwind CSS styling, shadcn/ui primitives, and Lucide icons.

### Client Component Example (`components/courses/course-card.tsx`)

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
  id: string
  title: string
  imageUrl?: string | null
  chaptersLength: number
  price?: number | null
  category?: string | null
  className?: string
}

export function CourseCard({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  category,
  className,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`} className="group block">
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200 hover:shadow-md",
          className
        )}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No preview image
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {category && (
            <Badge variant="outline" className="mb-2">
              {category}
            </Badge>
          )}
          <h3 className="line-clamp-2 text-base font-semibold group-hover:text-primary">
            {title}
          </h3>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>
              {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>
          <span className="font-semibold text-foreground">
            {price === null || price === undefined || price === 0
              ? "Free"
              : `$${price.toFixed(2)}`}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
```

---

## 2. API Route Template

Use this standard template when writing App Router API routes (`app/api/.../route.ts`). It handles:
1. Supabase session authentication.
2. Zod request validation.
3. Prisma database interaction.
4. Typed JSON responses and standardized error codes.

### API Route Example (`app/api/courses/[courseId]/chapters/route.ts`)

```typescript
import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// 1. Zod input validation schema
const createChapterSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    // 2. Await dynamic route parameters (Next.js 15+ standard)
    const { courseId } = await params

    // 3. Authenticate request using Supabase Server Client
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      )
    }

    // 4. Verify user permissions (Course Owner or Admin)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { userId: true },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const isOwner = course.userId === user.id
    const isAdmin = dbUser?.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. You do not have permission to modify this course." },
        { status: 403 }
      )
    }

    // 5. Parse and validate JSON payload
    const body = await request.json()
    const validationResult = createChapterSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // 6. Calculate position for the new chapter
    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    })

    const newPosition = lastChapter ? lastChapter.position + 1 : 1

    // 7. Execute Prisma mutation
    const chapter = await prisma.chapter.create({
      data: {
        title: validationResult.data.title,
        courseId,
        position: newPosition,
      },
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error("[CHAPTER_CREATE_ERROR]:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
```

---

## 3. Commit Message Conventions

EduFlow follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Every Git commit message must start with one of the following prefixes followed by a concise summary in imperative tense:

| Prefix | Description | Example |
| :--- | :--- | :--- |
| `feat:` | A new user-facing feature | `feat: add chapter drag and drop reordering` |
| `fix:` | A bug fix | `fix: resolve auth redirect loop in middleware` |
| `docs:` | Documentation changes only | `docs: add Supavisor pooling details to DEPLOYMENT.md` |
| `style:` | Formatting or styling (no logic change) | `style: adjust course card padding on mobile` |
| `refactor:` | Code restructuring without feature or bug changes | `refactor: extract getCurrentUser logic into lib/auth.ts` |
| `perf:` | A code change that improves performance | `perf: add index on courseId in chapter table` |
| `test:` | Adding or modifying tests | `test: add unit tests for chapter position calculator` |
| `chore:` | Maintenance tasks, dependencies, configs | `chore: update prisma to latest release` |

### Formatting Rules:
- Keep the first line under 72 characters.
- Use lowercase after the prefix (e.g., `feat: add ...` not `feat: Add ...`).
- Do not put a period at the end of the commit summary.

