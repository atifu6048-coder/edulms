"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, User, Mail, Shield, Calendar, BookOpen } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TeacherSettingsFormProps {
  initialFullName: string
  initialBio: string
  email: string
  role: string
  createdAt: Date | string
}

export function TeacherSettingsForm({
  initialFullName,
  initialBio,
  email,
  role,
  createdAt,
}: TeacherSettingsFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = React.useState(initialFullName)
  const [bio, setBio] = React.useState(initialBio)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error("Display name cannot be empty.")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          bio: bio.trim() || null,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update instructor profile.")
      }

      toast.success("Instructor profile updated successfully")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const memberSinceFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(createdAt))

  return (
    <Card className="max-w-2xl border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Instructor Profile</CardTitle>
        <CardDescription>
          Update your public teacher profile, bio, and instructor credentials.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Display Name Input */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-1.5 text-sm font-semibold">
              <User className="h-4 w-4 text-primary" />
              Instructor Display Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              disabled={isLoading}
              className="h-10"
              required
            />
            <p className="text-xs text-muted-foreground">
              This name will be displayed as the lead instructor on your courses and certificates.
            </p>
          </div>

          {/* Teacher Bio Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio" className="flex items-center gap-1.5 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-primary" />
                Instructor Biography
              </Label>
              <span className="text-xs text-muted-foreground">
                {bio.length}/1000
              </span>
            </div>
            <Textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell students about your domain expertise, industry experience, and teaching background..."
              disabled={isLoading}
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Appears on your public course landing pages and instructor summary.
            </p>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
              <Mail className="h-4 w-4" />
              Account Email
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="h-10 bg-muted/50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Contact email linked to your platform login.
            </p>
          </div>

          {/* Account Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Platform Role</p>
                <div className="pt-0.5">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Instructor Since</p>
                <p className="text-xs font-semibold text-foreground pt-0.5">
                  {memberSinceFormatted}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-4 border-t border-border/60">
          <Button type="submit" disabled={isLoading} className="font-semibold shadow-sm">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
