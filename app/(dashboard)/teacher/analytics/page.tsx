import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { BarChart3 } from "lucide-react"

export default function TeacherAnalyticsPage() {
  return (
    <PlaceholderPage
      title="Teaching Analytics"
      description="Track engagement graphs, watch times, and completion rates."
      badge="Teacher Portal"
      icon={BarChart3}
      stats={[
        { label: "Total Views", value: "8,920", description: "Lesson plays" },
        { label: "Avg Watch Duration", value: "14m", description: "Per session" },
        { label: "Feedback Score", value: "4.9/5", description: "Student satisfaction" },
      ]}
    />
  )
}
