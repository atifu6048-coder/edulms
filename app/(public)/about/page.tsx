import Link from "next/link"
import { Sparkles, Target, Compass, Users2, ShieldCheck, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const values = [
  {
    title: "Radical Accessibility",
    description:
      "We believe world-class education should be available to every curious mind, regardless of geographic location or economic background.",
    icon: Compass,
    accent: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
  },
  {
    title: "Project-First Mastery",
    description:
      "Passive watching doesn't produce real skills. Every course chapter is anchored by practical exercises, source code, and tangible outcomes.",
    icon: Target,
    accent: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
  },
  {
    title: "Community & Peer Support",
    description:
      "Learning is accelerated through collaboration. We cultivate an inclusive ecosystem where students and instructors grow together.",
    icon: Users2,
    accent: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
  },
  {
    title: "Open Knowledge Integrity",
    description:
      "No artificial paywalls or deceptive tiers. Our core curriculum is freely accessible, transparently maintained, and continually updated.",
    icon: ShieldCheck,
    accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
]

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Empowering the Next Generation of Creators and Engineers
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400">
            EduFlow was founded on a simple principle: high-impact technical and creative skills should not be gated behind four-figure paywalls or predatory bootcamps.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Why We Built EduFlow
            </h2>
            <p>
              Traditional online courses often leave learners stranded in tutorial hell: endless theory, obsolete libraries, and zero feedback. Meanwhile, private coding schools charge thousands of dollars for introductory materials that should be common knowledge.
            </p>
            <p>
              We built EduFlow to combine the pedagogical rigor of top-tier academies with the warmth and freedom of an open-access platform. Every course is authored by seasoned practitioners who build real software and ship real products daily.
            </p>
            <p>
              Whether you are writing your first line of TypeScript, designing a design system in Figma, or strategizing product market fit for a SaaS company, EduFlow provides the structured pathway to get you there.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-8 shadow-xs sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    The EduFlow Promise
                  </h3>
                  <p className="text-xs text-zinc-500">Built for learners, forever free</p>
                </div>
              </div>
              <p className="text-sm italic leading-relaxed text-zinc-700 dark:text-zinc-300">
                &ldquo;We measure our success not by revenue per user, but by the projects our graduates build, the careers they launch, and the confidence they carry into the tech industry.&rdquo;
              </p>
              <div className="border-t border-zinc-200/80 pt-4 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  EduFlow Academic & Curriculum Team
                </p>
                <p className="text-xs text-zinc-500">Global Open Learning Community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mt-28">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Our Core Values
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              The foundational convictions that guide our course development and community standards.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, idx) => {
              const Icon = v.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${v.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {v.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-24 rounded-3xl bg-indigo-50/70 border border-indigo-100 p-8 text-center sm:p-14 dark:bg-indigo-950/30 dark:border-indigo-900/40">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Ready to Begin Learning?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Join thousands of active students mastering modern web development, UI design, and product management today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/courses">
              <Button size="lg" className="rounded-xl bg-indigo-600 px-7 font-semibold text-white hover:bg-indigo-700">
                Explore Curriculum
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-xl border-zinc-300 dark:border-zinc-700">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

