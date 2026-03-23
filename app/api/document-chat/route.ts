import { NextResponse } from "next/server"
import { z } from "zod"
import { getOptionalSessionUser } from "@/lib/auth"
import { chatWithDocument } from "@/lib/legal/services"

const requestSchema = z.object({
  title: z.string().min(1).max(160),
  question: z.string().min(3).max(5000),
  documents: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).max(200),
        type: z.string().max(120).optional(),
        text: z.string().min(1).max(20000),
      }),
    )
    .min(1)
    .max(8),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(6000),
      }),
    )
    .max(20)
    .default([]),
})

export async function POST(request: Request) {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to chat with legal documents." }, { status: 401 })
  }

  try {
    const body = requestSchema.parse(await request.json())
    const result = await chatWithDocument({
      userId: user.uid,
      title: body.title,
      question: body.question,
      documents: body.documents,
      history: body.history,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not process the document chat request.",
      },
      { status: 400 },
    )
  }
}
