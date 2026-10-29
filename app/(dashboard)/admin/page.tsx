import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { Shield } from "lucide-react"

export default function AdminOverviewPage() {
  return (
    <PlaceholderPage
      title="Platform Administration"
      description="System overview, user role distribution, and platform health."
      badge="Admin Portal"
      icon={Shield}
      stats={[
        { label: "Total Users", value: "2", description: "Registered accounts" },
        { label: "Active Courses", value: "6", description: "Published curriculums" },
        { label: "Database Status", value: "Healthy", description: "Supabase PostgreSQL" },
      ]}
    />
  )
}
