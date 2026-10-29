import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { UserCheck } from "lucide-react"

export default function AdminUsersPage() {
  return (
    <PlaceholderPage
      title="User Management"
      description="Manage registered students, instructors, and administrator roles."
      badge="Admin Portal"
      icon={UserCheck}
      stats={[
        { label: "Administrators", value: "2", description: "Elevated access" },
        { label: "Instructors", value: "0", description: "Course authors" },
        { label: "Students", value: "0", description: "Active learners" },
      ]}
    />
  )
}
