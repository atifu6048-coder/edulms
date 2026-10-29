import Link from "next/link"
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TeacherCTABanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 px-8 py-14 text-white shadow-xl shadow-indigo-950/20 sm:px-16 sm:py-20">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-80 w-80 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>Share Your Expertise</span>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-tight">
              Teach on EduFlow & Inspire Global Learners
            </h2>

            <p className="mt-5 text-base leading-relaxed text-indigo-100 sm:text-lg">
              Are you an experienced engineer, designer, or business strategist? Create structured courses, upload curriculum videos, and share your practical knowledge with thousands of eager students worldwide.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-indigo-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Drag-and-Drop Curriculum Builder</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Built-in Video Lesson Management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Instant Student Analytics</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-2xl bg-white px-7 py-6 text-base font-bold text-indigo-950 shadow-md transition-all hover:bg-zinc-100"
                >
                  <span>Start Teaching Today</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl border-indigo-400/40 bg-transparent px-7 py-6 text-base font-semibold text-white hover:bg-white/10"
                >
                  Contact Curriculum Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

