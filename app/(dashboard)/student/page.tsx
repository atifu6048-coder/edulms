import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { LayoutDashboard } from "lucide-react"

export default function StudentDashboardPage() {
  return (
    <PlaceholderPage
      title="Student Learning Dashboard"
      description="Track your enrolled courses, active lessons, and study streak."
      badge="Student Portal"
      icon={LayoutDashboard}
      stats={[
        { label: "Enrolled Courses", value: "2", description: "In progress" },
        { label: "Completed Chapters", value: "14", description: "Finished lessons" },
        { label: "Certificates Earned", value: "1", description: "Verified credentials" },
      ]}
    />
  )
}
