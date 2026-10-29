import Link from "next/link"
import { Code2, Palette, Briefcase, Megaphone, Camera, ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Development",
    slug: "development",
    description: "Web engineering, backend APIs, TypeScript, and modern frameworks.",
    icon: Code2,
    count: "12 Courses",
    accent: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    name: "Design",
    slug: "design",
    description: "User experience, visual interfaces, design systems, and Figma.",
    icon: Palette,
    count: "8 Courses",
    accent: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  },
  {
    name: "Business",
    slug: "business",
    description: "Startup validation, tech management, monetization, and leadership.",
    icon: Briefcase,
    count: "6 Courses",
    accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Organic distribution, technical SEO, and conversion optimization.",
    icon: Megaphone,
    count: "5 Courses",
    accent: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    name: "Photography",
    slug: "photography",
    description: "Framing composition, lighting techniques, and digital editing.",
    icon: Camera,
    count: "4 Courses",
    accent: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  },
]

export function CategorySection() {
  return (
    <section className="py-20 bg-zinc-50/60 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Explore by Discipline
          </h2>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
            Find the right domain for your career goals. Each path includes structured, project-first courses.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-900"
              >
                <div>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${cat.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500 line-clamp-2 dark:text-zinc-400">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  <span>{cat.count}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

