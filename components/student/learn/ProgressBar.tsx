import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  completedCount: number
  totalCount: number
  className?: string
}

export function ProgressBar({
  completedCount,
  totalCount,
  className,
}: ProgressBarProps) {
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>
          {completedCount} of {totalCount} complete ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
