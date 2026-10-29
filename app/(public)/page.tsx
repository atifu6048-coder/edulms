import { HeroSection } from "@/components/website/HeroSection"
import { StatsSection } from "@/components/website/StatsSection"
import { FeaturedCourses } from "@/components/website/FeaturedCourses"
import { CategorySection } from "@/components/website/CategorySection"
import { HowItWorks } from "@/components/website/HowItWorks"
import { Testimonials } from "@/components/website/Testimonials"
import { TeacherCTABanner } from "@/components/website/TeacherCTABanner"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <HeroSection />
      <StatsSection />
      <FeaturedCourses />
      <CategorySection />
      <HowItWorks />
      <Testimonials />
      <TeacherCTABanner />
    </div>
  )
}

