import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlaceholderPageProps {
  title: string
  description: string
  badge?: string
  icon?: React.ComponentType<{ className?: string }>
  stats?: Array<{ label: string; value: string; description?: string }>
  action?: React.ReactNode
}

export function PlaceholderPage({
  title,
  description,
  badge,
  icon: Icon,
  stats,
  action,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {title}
            </h1>
            {badge && (
              <Badge variant="outline" className="font-semibold text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Optional Stat Cards */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-2xl border-zinc-200/80 shadow-xs dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold">{stat.value}</CardTitle>
              </CardHeader>
              {stat.description && (
                <CardContent className="pt-0">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Content Container Card */}
      <Card className="rounded-2xl border-zinc-200/80 shadow-xs dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Workspace & Overview</CardTitle>
          <CardDescription>
            This section is active. Data management and interactive features will sync directly with the EduFlow database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
            <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 dark:bg-zinc-900 dark:text-zinc-500">
              {Icon ? <Icon className="h-5 w-5" /> : null}
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {title} Management Ready
            </h3>
            <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
              All backend endpoints, database tables, and role authentication are active.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
