import { Skeleton } from "@/components/ui/skeleton"

export default function CoursesCatalogLoading() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-5 w-96 rounded" />
        </div>

        {/* Filter bar skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-full max-w-md rounded-xl" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
            ))}
          </div>
        </div>

        {/* Courses grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border/80 bg-card p-0 space-y-4"
            >
              <Skeleton className="aspect-video w-full rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-14 rounded" />
                </div>
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

