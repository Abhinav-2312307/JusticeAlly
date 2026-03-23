import { redirect } from "next/navigation"
import { AuthPanel } from "@/components/auth/auth-panel"
import { getOptionalSessionUser } from "@/lib/auth"

export default async function ForgotPasswordPage() {
  const user = await getOptionalSessionUser()

  if (user) {
    redirect("/workspace")
  }

  return <AuthPanel mode="forgot" />
}
