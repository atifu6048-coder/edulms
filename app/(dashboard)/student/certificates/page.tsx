import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { Award } from "lucide-react"

export default function StudentCertificatesPage() {
  return (
    <PlaceholderPage
      title="Certificates of Completion"
      description="View and download verified credentials for completed EduFlow courses."
      badge="Student Portal"
      icon={Award}
    />
  )
}
