import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/80 bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

