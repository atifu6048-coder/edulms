import { PlaceholderPage } from "@/components/dashboard/placeholder-page"
import { FolderTree } from "lucide-react"

export default function AdminCategoriesPage() {
  return (
    <PlaceholderPage
      title="Category Taxonomy"
      description="Create, rename, or reorder disciplines and topic classifications."
      badge="Admin Portal"
      icon={FolderTree}
      stats={[
        { label: "Active Categories", value: "5", description: "Seeded in database" },
        { label: "Top Field", value: "Development", description: "Highest enrollment" },
      ]}
    />
  )
}
