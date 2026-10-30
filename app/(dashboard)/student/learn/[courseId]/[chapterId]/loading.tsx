import { Skeleton } from "@/components/ui/skeleton"

export default function StudentLearnLoading() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar skeleton */}
        <div className="lg:col-span-4 order-2 lg:order-1 rounded-2xl border border-border/80 bg-card p-5 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-6 w-4/5 rounded" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Video & main area skeleton */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          <Skeleton className="aspect-video w-full rounded-2xl bg-muted" />

          {/* Under video controls skeleton */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-card">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-36 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>

          {/* Details skeleton */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
