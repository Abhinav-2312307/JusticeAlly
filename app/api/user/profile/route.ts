import { NextResponse } from "next/server"
import { z } from "zod"
import { getOptionalSessionUser } from "@/lib/auth"
import { getUserProfile, saveUserProfileDetails } from "@/lib/db"

const profileSchema = z.object({
  name: z.string().max(120),
  phoneNumber: z.string().max(30),
  city: z.string().max(120),
  state: z.string().max(120),
  preferredLanguage: z.string().max(80),
  contactPreference: z.string().max(80),
  primaryIssue: z.string().max(120),
  safetyNotes: z.string().max(2000),
})

export async function GET() {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to view your profile." }, { status: 401 })
  }

  const profile = await getUserProfile(user)
  return NextResponse.json({ profile })
}

export async function PUT(request: Request) {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to update your profile." }, { status: 401 })
  }

  try {
    const body = profileSchema.parse(await request.json())
    const profile = await saveUserProfileDetails({
      userId: user.uid,
      ...body,
    })

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not update the profile.",
      },
      { status: 400 },
    )
  }
}
