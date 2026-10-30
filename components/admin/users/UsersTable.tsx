"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, ShieldAlert, Loader2, Calendar } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface UserRow {
  id: string
  fullName: string | null
  email: string
  avatarUrl?: string | null
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"
  createdAt: Date | string
}

interface UsersTableProps {
  initialUsers: UserRow[]
  currentAdminId: string
}

export function UsersTable({ initialUsers, currentAdminId }: UsersTableProps) {
  const router = useRouter()
  const [users, setUsers] = React.useState<UserRow[]>(initialUsers)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL")
  const [isLoading, setIsLoading] = React.useState(false)

  // Pending role change for confirmation dialog
  const [pendingChange, setPendingChange] = React.useState<{
    userId: string
    userName: string
    oldRole: string
    newRole: "STUDENT" | "INSTRUCTOR" | "ADMIN"
  } | null>(null)

  React.useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  const handleSelectRole = (
    user: UserRow,
    newRole: "STUDENT" | "INSTRUCTOR" | "ADMIN"
  ) => {
    if (user.role === newRole) return

    if (user.id === currentAdminId && newRole !== "ADMIN") {
      toast.error("You cannot remove your own administrator role.")
      return
    }

    setPendingChange({
      userId: user.id,
      userName: user.fullName || user.email,
      oldRole: user.role,
      newRole,
    })
  }

  const confirmRoleChange = async () => {
    if (!pendingChange) return

    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/users/${pendingChange.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: pendingChange.newRole }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update role.")
      }

      toast.success(`Role updated to ${pendingChange.newRole}`)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === pendingChange.userId ? { ...u, role: pendingChange.newRole } : u
        )
      )
      setPendingChange(null)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const query = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !query ||
        (u.fullName && u.fullName.toLowerCase().includes(query)) ||
        u.email.toLowerCase().includes(query)

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "STUDENT", "INSTRUCTOR", "ADMIN"].map((r) => (
            <Button
              key={r}
              variant={roleFilter === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter(r)}
              className="text-xs font-semibold capitalize h-9"
            >
              {r.toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[320px]">User</TableHead>
              <TableHead className="w-[140px]">Current Role</TableHead>
              <TableHead className="w-[180px]">Joined Date</TableHead>
              <TableHead className="text-right">Change Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No accounts match your search filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((userRow) => {
                const name = userRow.fullName || "User"
                const initial = name.charAt(0).toUpperCase()
                const isMe = userRow.id === currentAdminId
                const joined = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(userRow.createdAt))

                return (
                  <TableRow key={userRow.id} className="hover:bg-muted/30 transition-colors">
                    {/* User Avatar + Email */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {userRow.avatarUrl ? (
                            <Image
                              src={userRow.avatarUrl}
                              alt={name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span>{initial}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {name}
                            </p>
                            {isMe && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {userRow.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role Badge */}
                    <TableCell>
                      <Badge
                        variant={
                          userRow.role === "ADMIN"
                            ? "default"
                            : userRow.role === "INSTRUCTOR"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs font-semibold capitalize"
                      >
                        {userRow.role.toLowerCase()}
                      </Badge>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{joined}</span>
                      </div>
                    </TableCell>

                    {/* Role Dropdown */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <select
                          value={userRow.role}
                          onChange={(e) =>
                            handleSelectRole(
                              userRow,
                              e.target.value as "STUDENT" | "INSTRUCTOR" | "ADMIN"
                            )
                          }
                          disabled={isLoading}
                          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground shadow-xs focus:border-primary focus:outline-none"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={Boolean(pendingChange)}
        onOpenChange={(open) => !open && setPendingChange(null)}
      >
        <DialogContent className="sm:max-w-md p-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-2">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-xl font-bold text-center">
              Change User Role
            </DialogTitle>
            <DialogDescription className="text-sm text-center">
              Are you sure you want to change the role of{" "}
              <span className="font-semibold text-foreground">
                {pendingChange?.userName}
              </span>{" "}
              from <span className="font-semibold">{pendingChange?.oldRole}</span> to{" "}
              <span className="font-semibold text-primary">{pendingChange?.newRole}</span>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingChange(null)}
              disabled={isLoading}
              className="w-full sm:w-1/2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmRoleChange}
              disabled={isLoading}
              className="w-full sm:w-1/2 font-semibold shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
