import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getFirebaseAdminAuth } from "@/lib/firebase/admin"
import { getSessionCookieName } from "@/lib/env"
import { lookupFirebaseUserByIdToken } from "@/lib/firebase/rest"
import { getOptionalSessionUser } from "@/lib/auth"
import { upsertUserProfile } from "@/lib/db"
import { createSignedSessionCookie } from "@/lib/session"

const sessionSchema = z.object({
  idToken: z.string().min(1),
})

export async function GET() {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}

export async function POST(request: Request) {
  const adminAuth = getFirebaseAdminAuth()

  try {
    const payload = sessionSchema.parse(await request.json())
    const expiresIn = 1000 * 60 * 60 * 24 * 5
    const cookieStore = await cookies()
    let user

    if (adminAuth) {
      const decoded = await adminAuth.verifyIdToken(payload.idToken)
      const sessionCookie = await adminAuth.createSessionCookie(payload.idToken, { expiresIn })

      cookieStore.set(getSessionCookieName(), sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn / 1000,
      })

      user = {
        uid: decoded.uid,
        email: decoded.email ?? null,
        name: decoded.name ?? null,
        picture: decoded.picture ?? null,
        phoneNumber: decoded.phone_number ?? null,
        providerId: decoded.firebase?.sign_in_provider ?? null,
      }
    } else {
      user = await lookupFirebaseUserByIdToken(payload.idToken)
      const sessionCookie = createSignedSessionCookie(user, expiresIn / 1000)

      cookieStore.set(getSessionCookieName(), sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn / 1000,
      })
    }

    await upsertUserProfile(user)

    return NextResponse.json({ ok: true, user })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create a secure session.",
      },
      { status: 400 },
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return NextResponse.json({ ok: true })
}
