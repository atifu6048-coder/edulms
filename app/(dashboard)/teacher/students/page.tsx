import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { Users } from "lucide-react"

export default function TeacherStudentsPage() {
  return (
    <PlaceholderPage
      title="Student Directory"
      description="View enrolled learners, chapter milestones, and student engagement."
      badge="Teacher Portal"
      icon={Users}
      stats={[
        { label: "Enrolled Students", value: "248", description: "Across all courses" },
        { label: "Completed Lessons", value: "1,420", description: "Progress checkpoints" },
        { label: "Active Today", value: "32", description: "Learners online" },
      ]}
    />
  )
}
