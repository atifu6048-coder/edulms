import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { Settings } from "lucide-react"

export default function TeacherSettingsPage() {
  return (
    <PlaceholderPage
      title="Instructor Profile & Preferences"
      description="Configure public instructor bio, display name, and teaching notifications."
      badge="Teacher Portal"
      icon={Settings}
    />
  )
}
