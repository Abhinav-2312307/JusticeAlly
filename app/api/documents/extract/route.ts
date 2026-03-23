import { NextResponse } from "next/server"
import { extractDocumentTextFromFile } from "@/lib/documents/server"
import { getDocumentExtractionMessage } from "@/lib/documents/shared"

const MAX_DOCUMENT_SIZE = 15 * 1024 * 1024
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Select a file to read." }, { status: 400 })
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      return NextResponse.json({ error: "Upload a file smaller than 15 MB." }, { status: 400 })
    }

    const extractedText = (await extractDocumentTextFromFile(file)).slice(0, 60000)

    return NextResponse.json({
      extractedText,
      warning: extractedText ? null : getDocumentExtractionMessage(file.name),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not read the file.",
      },
      { status: 400 },
    )
  }
}
