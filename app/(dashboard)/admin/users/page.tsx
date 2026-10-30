import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { UsersTable, type UserRow } from "@/components/admin/users/UsersTable"

export const metadata: Metadata = {
  title: "User Management - EduFlow",
  description: "View all user accounts, audit permissions, and promote platform roles.",
}

export default async function AdminUsersPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/student")
  }

  const allUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
    },
  })

  const users: UserRow[] = allUsers.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    avatarUrl: u.avatarUrl,
    role: u.role,
    createdAt: u.createdAt,
  }))

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Platform User Accounts
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review all registered students, course instructors, and administrators. Promote or adjust roles directly.
        </p>
      </div>

      {/* Users Table */}
      <UsersTable initialUsers={users} currentAdminId={user.id} />
    </div>
  )
}
