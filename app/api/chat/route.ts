import { NextResponse } from "next/server"
import { z } from "zod"
import { getOptionalSessionUser } from "@/lib/auth"
import { getConversationMessages } from "@/lib/db"
import { answerLegalQuestion } from "@/lib/legal/services"

const requestSchema = z.object({
  query: z.string().min(3).max(5000),
  conversationId: z.string().optional(),
  issueType: z.string().optional(),
  urgency: z.string().optional(),
})

export async function POST(request: Request) {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to use the legal assistant." }, { status: 401 })
  }

  try {
    const body = requestSchema.parse(await request.json())
    const result = await answerLegalQuestion({
      userId: user.uid,
      query: body.query,
      conversationId: body.conversationId,
      issueType: body.issueType ?? "general",
      urgency: body.urgency ?? "normal",
    })

    return NextResponse.json({
      response: result.answer,
      conversationId: result.conversationId,
      sources: result.sources,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not process the legal query.",
      },
      { status: 400 },
    )
  }
}

export async function GET(request: Request) {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to view conversation history." }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversationId")

  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversationId." }, { status: 400 })
  }

  try {
    const messages = await getConversationMessages(user.uid, conversationId, 30)
    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not load the conversation.",
      },
      { status: 400 },
    )
  }
}
