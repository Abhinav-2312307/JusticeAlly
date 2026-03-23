import { getFirebaseClientConfig } from "@/lib/env"
import type { SessionUser } from "@/lib/session"

interface AccountsLookupResponse {
  users?: Array<{
    localId?: string
    email?: string
    displayName?: string
    photoUrl?: string
    phoneNumber?: string
    providerUserInfo?: Array<{
      providerId?: string
    }>
  }>
  error?: {
    message?: string
  }
}

export async function lookupFirebaseUserByIdToken(idToken: string): Promise<SessionUser> {
  const firebaseConfig = getFirebaseClientConfig()

  if (!firebaseConfig) {
    throw new Error("Firebase client config is missing.")
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    },
  )

  const data = (await response.json().catch(() => null)) as AccountsLookupResponse | null
  const user = data?.users?.[0]

  if (!response.ok || !user?.localId) {
    throw new Error(data?.error?.message ?? "Could not verify the Firebase session token.")
  }

  return {
    uid: user.localId,
    email: user.email ?? null,
    name: user.displayName ?? null,
    picture: user.photoUrl ?? null,
    phoneNumber: user.phoneNumber ?? null,
    providerId: user.providerUserInfo?.find((entry) => !!entry.providerId)?.providerId ?? null,
  }
}
