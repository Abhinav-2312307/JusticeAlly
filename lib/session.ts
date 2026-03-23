import { createHmac, timingSafeEqual } from "crypto"
import { getSessionSecret } from "@/lib/env"

export interface SessionUser {
  uid: string
  email: string | null
  name: string | null
  picture: string | null
  phoneNumber: string | null
  providerId: string | null
}

interface SignedSessionPayload {
  user: SessionUser
  exp: number
  iat: number
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf-8")
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url")
}

export function createSignedSessionCookie(user: SessionUser, maxAgeSeconds = 60 * 60 * 24 * 5) {
  const secret = getSessionSecret()

  if (!secret) {
    throw new Error("Missing SESSION_SECRET. Add it or configure Firebase Admin credentials.")
  }

  const issuedAt = Math.floor(Date.now() / 1000)
  const payload: SignedSessionPayload = {
    user,
    iat: issuedAt,
    exp: issuedAt + maxAgeSeconds,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifySignedSessionCookie(cookieValue: string) {
  const secret = getSessionSecret()

  if (!secret) {
    return null
  }

  const [encodedHeader, encodedPayload, encodedSignature] = cookieValue.split(".")

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, secret)
  const provided = Buffer.from(encodedSignature)
  const expected = Buffer.from(expectedSignature)

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SignedSessionPayload

    if (!payload?.user?.uid || payload.exp * 1000 <= Date.now()) {
      return null
    }

    return payload.user
  } catch {
    return null
  }
}
