import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { Settings } from "lucide-react"

export default function StudentSettingsPage() {
  return (
    <PlaceholderPage
      title="Student Account Settings"
      description="Manage your profile information, email preferences, and password."
      badge="Student Portal"
      icon={Settings}
    />
  )
}
