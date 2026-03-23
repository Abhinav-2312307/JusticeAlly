import { redirect } from "next/navigation"
import { AuthPanel } from "@/components/auth/auth-panel"
import { getOptionalSessionUser } from "@/lib/auth"

interface LoginPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined
  const nextValue = params?.next
  const nextPath = typeof nextValue === "string" ? nextValue : "/workspace"
  const user = await getOptionalSessionUser()

  if (user) {
    redirect(nextPath)
  }

  return <AuthPanel mode="login" nextPath={nextPath} />
}
