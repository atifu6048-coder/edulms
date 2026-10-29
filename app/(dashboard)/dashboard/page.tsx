import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardHubPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  if (user.role === "ADMIN" || user.role === "INSTRUCTOR") {
    redirect("/teacher")
  }

  redirect("/student")
}
