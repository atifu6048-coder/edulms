import Link from "next/link"
import { ArrowRight, Sparkles, CheckCircle2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 overflow-hidden opacity-30 blur-3xl">
        <div className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-indigo-500 to-sky-400" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur-xs transition-colors hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Open, modern learning for everyone</span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl sm:leading-[1.15] dark:text-zinc-50">
            Learn real skills. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Build your future with EduFlow.
            </span>
          </h1>

          {/* Paragraph */}
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400">
            A free, community-powered learning platform designed for ambitious students and passionate instructors. Learn web engineering, design, and business through clear lessons and practical projects.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/courses" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full gap-2 rounded-2xl bg-indigo-600 px-7 py-6 text-base font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/35"
              >
                <span>Explore Courses</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 rounded-2xl border-zinc-300 px-7 py-6 text-base font-semibold hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <Play className="h-4 w-4 fill-current text-indigo-600 dark:text-indigo-400" />
                <span>Join for Free</span>
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>100% Free Core Curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Self-Paced Video Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Verified Course Progress</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

