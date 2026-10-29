import { Users, BookOpen, GraduationCap, Award } from "lucide-react"

const stats = [
  {
    label: "Active Learners",
    value: "15,000+",
    description: "Students expanding their technical skillsets",
    icon: Users,
  },
  {
    label: "Course Lessons",
    value: "450+",
    description: "Structured, high-impact video chapters",
    icon: BookOpen,
  },
  {
    label: "Categories",
    value: "5 Fields",
    description: "Engineering, design, business, and more",
    icon: GraduationCap,
  },
  {
    label: "Free Access",
    value: "100%",
    description: "Zero paywalls on foundational curriculum",
    icon: Award,
  },
]

export function StatsSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-8 shadow-xs sm:p-12 dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {stat.description}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

