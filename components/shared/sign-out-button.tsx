"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleSignOut() {
    try {
      setIsLoading(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isLoading}
      className={className}
      title="Sign out"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="mr-1.5 h-4 w-4" />
          <span>Sign out</span>
        </>
      )}
    </Button>
  )
}

