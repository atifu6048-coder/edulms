"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"

interface CategoryItem {
  id: string
  name: string
}

interface CoursesFilterProps {
  categories: CategoryItem[]
  currentTitle?: string
  currentCategoryId?: string
}

export function CoursesFilter({
  categories,
  currentTitle = "",
  currentCategoryId = "",
}: CoursesFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [title, setTitle] = React.useState(currentTitle)
  const debouncedTitle = useDebounce(title, 300)

  // Sync state if URL search param changes from outside (e.g. browser back/forward)
  React.useEffect(() => {
    setTitle(currentTitle)
  }, [currentTitle])

  // Update URL search params when debounced title changes
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedTitle) {
      params.set("title", debouncedTitle)
    } else {
      params.delete("title")
    }

    const newUrl = `${pathname}?${params.toString()}`
    // Only push if query actually changed
    const currentQuery = searchParams.toString()
    if (params.toString() !== currentQuery) {
      router.push(newUrl, { scroll: false })
    }
  }, [debouncedTitle, pathname, router, searchParams])

  const onCategoryClick = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!categoryId || categoryId === currentCategoryId) {
      params.delete("categoryId")
    } else {
      params.set("categoryId", categoryId)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearSearch = () => {
    setTitle("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("title")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search courses by topic, keyword, or framework..."
          className="h-12 pl-10 pr-10 rounded-xl border-border/80 bg-background text-sm shadow-xs focus-visible:ring-primary/20"
        />
        {title && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onCategoryClick(undefined)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer select-none",
            !currentCategoryId
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          All Categories
        </button>

        {categories.map((category) => {
          const isSelected = currentCategoryId === category.id
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryClick(category.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer select-none",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
