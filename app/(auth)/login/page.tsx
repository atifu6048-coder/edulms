import { Suspense } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading sign in...</div>}>
      <SignInForm />
    </Suspense>
  )
}

