import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getFirebaseAdminAuth } from "@/lib/firebase/admin"
import { getSessionCookieName } from "@/lib/env"
import { verifySignedSessionCookie, type SessionUser } from "@/lib/session"

function normalizeUser(decodedToken: {
  uid: string
  email?: string
  name?: string
  picture?: string
  phone_number?: string
  firebase?: {
    sign_in_provider?: string
  }
}): SessionUser {
  return {
    uid: decodedToken.uid,
    email: decodedToken.email ?? null,
    name: decodedToken.name ?? null,
    picture: decodedToken.picture ?? null,
    phoneNumber: decodedToken.phone_number ?? null,
    providerId: decodedToken.firebase?.sign_in_provider ?? null,
  }
}

export async function getOptionalSessionUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(getSessionCookieName())?.value

  if (!sessionCookie) {
    return null
  }

  const adminAuth = getFirebaseAdminAuth()

  if (!adminAuth) {
    return verifySignedSessionCookie(sessionCookie)
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return normalizeUser(decoded)
  } catch {
    return null
  }
}

export async function requireSessionUser(nextPath = "/workspace") {
  const user = await getOptionalSessionUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  return user
}
