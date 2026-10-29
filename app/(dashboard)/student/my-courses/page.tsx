import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { BookOpen } from "lucide-react"

export default function StudentMyCoursesPage() {
  return (
    <PlaceholderPage
      title="My Enrolled Courses"
      description="Access your active curriculum, lesson notes, and downloadable assets."
      badge="Student Portal"
      icon={BookOpen}
    />
  )
}
