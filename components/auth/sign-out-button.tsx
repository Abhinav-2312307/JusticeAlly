"use client"

import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { getFirebaseClientAuth } from "@/lib/firebase/client"
import { cn } from "@/lib/utils"

interface SignOutButtonProps {
  className?: string
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignOut() {
    setIsLoading(true)

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
      })

      const auth = getFirebaseClientAuth()

      if (auth) {
        await signOut(auth)
      }

      router.push("/")
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" onClick={handleSignOut} disabled={isLoading} className={cn(className)}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
      Sign out
    </Button>
  )
}
