"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  type User,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { ArrowRight, Loader2, Scale, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getFirebaseClientAuth } from "@/lib/firebase/client"

type AuthMode = "login" | "signup" | "forgot"

interface AuthPanelProps {
  mode: AuthMode
  nextPath?: string
}

async function persistSession(idToken: string) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? "Could not create a secure session.")
  }
}

export function AuthPanel({ mode, nextPath = "/workspace" }: AuthPanelProps) {
  const auth = useMemo(() => getFirebaseClientAuth(), [])
  const router = useRouter()
  const { toast } = useToast()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const content = {
    login: {
      title: "Sign in to your workspace",
      description: "Access your saved conversations, uploaded documents, and legal workflows securely.",
    },
    signup: {
      title: "Create your JusticeAlly account",
      description: "Use email or Google sign-in and keep your workspace synced across sessions.",
    },
    forgot: {
      title: "Reset your password",
      description: "Send a Firebase password reset email to regain access to your workspace.",
    },
  }[mode]

  function requireAuth() {
    if (!auth) {
      throw new Error("Firebase is not configured. Add the public Firebase env vars before using authentication.")
    }

    return auth
  }

  async function finalizeAuth(user: User, title: string, description: string) {
    const token = await user.getIdToken(true)
    await persistSession(token)

    toast({
      title,
      description,
    })

    router.push(nextPath)
    router.refresh()
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const credentials = await signInWithEmailAndPassword(requireAuth(), email, password)
      await finalizeAuth(credentials.user, "Signed in", "Your secure workspace session is active.")
    } catch (error) {
      toast({
        title: "Could not sign in",
        description: error instanceof Error ? error.message : "Please check your email and password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Use the same password in both fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const credentials = await createUserWithEmailAndPassword(requireAuth(), email, password)

      if (fullName.trim()) {
        await updateProfile(credentials.user, {
          displayName: fullName.trim(),
        })
      }

      await finalizeAuth(credentials.user, "Account created", "Your workspace is ready.")
    } catch (error) {
      toast({
        title: "Could not create account",
        description: error instanceof Error ? error.message : "Try again with a different email address.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleAuth() {
    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })
      const credentials = await signInWithPopup(requireAuth(), provider)

      if (mode === "signup" && fullName.trim() && !credentials.user.displayName) {
        await updateProfile(credentials.user, {
          displayName: fullName.trim(),
        })
      }

      await finalizeAuth(
        credentials.user,
        mode === "signup" ? "Google account connected" : "Signed in with Google",
        "Your workspace session has been created.",
      )
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        description: error instanceof Error ? error.message : "Try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(requireAuth(), email)
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the Firebase password reset link.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Could not send reset email",
        description: error instanceof Error ? error.message : "Please check the email address and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-section">
      <div className="container-shell">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel p-8 md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-900/10 bg-emerald-950 px-4 py-2 text-sm text-white">
              <Scale className="h-4 w-4" />
              Secure Firebase-authenticated workspace
            </div>
            <h1 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-tight text-foreground md:text-6xl">
              {mode === "login"
                ? "Resume your matters without losing context."
                : mode === "signup"
                  ? "Set up a legal workspace that remembers what matters."
                  : "Reset access and get back into your legal workspace."}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              JusticeAlly combines persistent sessions, document storage, AI analysis, and retrieval-grounded legal
              workflows so your work does not reset every time you leave the page.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/70 p-5">
                <p className="text-sm font-semibold text-foreground">Persistent workspace</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Save conversations, uploaded documents, and important profile details under one account.
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/70 p-5">
                <p className="text-sm font-semibold text-foreground">Simple secure access</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use email-password or Google sign-in without breaking the secure server session.
                </p>
              </div>
            </div>
          </div>

          <Card className="glass-panel border-white/70 bg-white/88">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode !== "forgot" && (
                <>
                  {mode === "signup" ? (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                    </div>
                  ) : null}

                  <Button className="w-full" type="button" variant="outline" onClick={handleGoogleAuth} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                    Continue with Google
                  </Button>

                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />
                    or use email
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </>
              )}

              {mode === "login" && (
                <form className="space-y-5" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    Log in
                  </Button>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Link href="/forgot-password" className="hover:text-foreground">
                      Forgot password?
                    </Link>
                    <Link href={`/signup${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`} className="hover:text-foreground">
                      Create account
                    </Link>
                  </div>
                </form>
              )}

              {mode === "signup" && (
                <form className="space-y-5" onSubmit={handleSignup}>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    Create account
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    By continuing you agree to the platform terms and acknowledge that JusticeAlly provides general legal
                    information, not representation.
                  </p>
                  <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-4 text-sm text-emerald-950">
                    Phone-number OTP sign-in has been removed. Account access is now handled through email-password and
                    Google only.
                  </div>
                </form>
              )}

              {mode === "forgot" && (
                <form className="space-y-5" onSubmit={handleReset}>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    Send reset email
                  </Button>
                  <Link href="/login" className="block text-sm text-muted-foreground hover:text-foreground">
                    Back to login
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
