import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ProfileForm } from "@/components/student/settings/ProfileForm"

export const metadata: Metadata = {
  title: "Account Settings - EduFlow",
  description: "Manage your personal profile, display name, and account details.",
}

export default async function StudentSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
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
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal profile and display preferences on EduFlow.
        </p>
      </div>

      {/* Profile Form */}
      <ProfileForm
        initialFullName={dbUser.fullName || ""}
        email={dbUser.email}
        role={dbUser.role}
        createdAt={dbUser.createdAt}
      />
    </div>
  )
}
