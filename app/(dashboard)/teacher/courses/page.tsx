import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { BookOpenCheck } from "lucide-react"

export default function TeacherCoursesPage() {
  return (
    <PlaceholderPage
      title="Course Management"
      description="Create, organize chapters, and publish course syllabuses."
      badge="Teacher Portal"
      icon={BookOpenCheck}
      stats={[
        { label: "Published", value: "2", description: "Visible in public catalog" },
        { label: "Drafts", value: "1", description: "Currently being authored" },
        { label: "Total Chapters", value: "28", description: "Video lessons" },
      ]}
    />
  )
}
