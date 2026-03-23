import { NextResponse } from "next/server"
import { getOptionalSessionUser } from "@/lib/auth"
import { simplifyLegalDocument } from "@/lib/legal/services"

async function getPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as { text?: string; title?: string }
    return {
      text: json.text ?? "",
      title: json.title ?? "Simplified legal document",
    }
  }

  const formData = await request.formData()
  return {
    text: String(formData.get("text") ?? ""),
    title: String(formData.get("title") ?? "Simplified legal document"),
  }
}

export async function POST(request: Request) {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to simplify a document." }, { status: 401 })
  }

  try {
    const payload = await getPayload(request)
    const result = await simplifyLegalDocument({
      userId: user.uid,
      text: payload.text,
      title: payload.title,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not simplify the document.",
      },
      { status: 400 },
    )
  }
}
