import { Compass, Video, CheckCircle, Rocket } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Choose Your Path",
    description: "Browse curated courses across engineering, design, and business. Pick a topic aligned with your aspirations.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Learn with Video Chapters",
    description: "Follow focused, digestible video lessons. Download source code, study cheat sheets, and follow along hands-on.",
    icon: Video,
  },
  {
    step: "03",
    title: "Mark Your Progress",
    description: "Track your completed chapters and lessons in real-time. Pick up right where you left off from any device.",
    icon: CheckCircle,
  },
  {
    step: "04",
    title: "Build & Ship Projects",
    description: "Solidify skills by building portfolio-worthy software and design assets that stand out to employers.",
    icon: Rocket,
  },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Simple 4-Step Process
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            How EduFlow Works
          </h2>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
            We removed the complexity from online education so you can focus entirely on learning and building.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="relative rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-zinc-200 dark:text-zinc-800">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

