import * as React from "react"
import Link from "next/link"
import { LucideIcon, FolderSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {(actionLabel && actionHref) && (
        <Button asChild className="mt-6 font-medium shadow-sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}

      {(actionLabel && onAction && !actionHref) && (
        <Button onClick={onAction} className="mt-6 font-medium shadow-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
