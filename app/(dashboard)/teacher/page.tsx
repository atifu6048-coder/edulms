import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { LayoutDashboard } from "lucide-react"

export default function TeacherDashboardPage() {
  return (
    <PlaceholderPage
      title="Instructor Dashboard"
      description="Monitor curriculum performance, recent enrollments, and teaching metrics."
      badge="Teacher Portal"
      icon={LayoutDashboard}
      stats={[
        { label: "Total Courses", value: "3", description: "Authored curriculums" },
        { label: "Active Students", value: "248", description: "Enrolled learners" },
        { label: "Average Completion", value: "84%", description: "Lesson progress" },
      ]}
    />
  )
}
