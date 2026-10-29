import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Frontend Developer",
    content: "EduFlow's Next.js and TypeScript lessons helped me transition from junior to mid-level engineer in 3 months. The lesson layout and bite-sized curriculum make learning stick.",
    rating: 5,
    initials: "AR",
  },
  {
    name: "Sarah Chen",
    role: "Product Designer",
    content: "The design systems curriculum was clear, practical, and devoid of fluff. Having downloadable resources for each chapter saved me hours of trial and error.",
    rating: 5,
    initials: "SC",
  },
  {
    name: "Marcus Vance",
    role: "Software Founder",
    content: "As someone balancing a full-time job while building a startup, having self-paced, high-quality free education in one place is invaluable. Truly community-first.",
    rating: 5,
    initials: "MV",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-zinc-50/60 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Student Stories
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Trusted by Thousands of Learners
          </h2>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
            See how developers, designers, and founders are using EduFlow to level up their careers.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {t.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

