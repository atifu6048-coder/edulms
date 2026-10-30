import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { TeacherSettingsForm } from "@/components/teacher/settings/TeacherSettingsForm"

export const metadata: Metadata = {
  title: "Teacher Settings - EduFlow",
  description: "Manage your instructor profile, biography, and credentials.",
}

export default async function TeacherSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student")
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Instructor Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your teacher biography and public instructor information.
        </p>
      </div>

      {/* Teacher Form */}
      <TeacherSettingsForm
        initialFullName={dbUser.fullName || ""}
        initialBio={dbUser.bio || ""}
        email={dbUser.email}
        role={dbUser.role}
        createdAt={dbUser.createdAt}
      />
    </div>
  )
}
