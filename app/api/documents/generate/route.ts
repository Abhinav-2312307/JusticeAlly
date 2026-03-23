import { NextResponse } from "next/server"
import { z } from "zod"
import { getOptionalSessionUser } from "@/lib/auth"
import { draftLegalDocument } from "@/lib/legal/services"

const requestSchema = z.object({
  templateId: z.string().min(1),
  values: z.record(z.string(), z.string()),
})

export async function POST(request: Request) {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to generate documents." }, { status: 401 })
  }

  try {
    const body = requestSchema.parse(await request.json())
    const result = await draftLegalDocument({
      userId: user.uid,
      templateId: body.templateId,
      values: body.values,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not generate the document.",
      },
      { status: 400 },
    )
  }
}
