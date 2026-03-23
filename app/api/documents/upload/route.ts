import { NextResponse } from "next/server"
import { getOptionalSessionUser } from "@/lib/auth"
import { saveUserDocument } from "@/lib/db"
import { extractDocumentTextFromFile } from "@/lib/documents/server"
import { getDocumentExtractionMessage } from "@/lib/documents/shared"
import { analyzeStoredDocument } from "@/lib/legal/services"
import { uploadDocumentToCloudinary } from "@/lib/cloudinary"

const MAX_DOCUMENT_SIZE = 15 * 1024 * 1024
export const runtime = "nodejs"

function normalizeExtractedText(value: string) {
  return value.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, 30000)
}

export async function POST(request: Request) {
  const user = await getOptionalSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Please log in to upload and analyze documents." }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const title = String(formData.get("title") ?? "").trim()
    const category = String(formData.get("category") ?? "general").trim()
    const submittedExtractedText = normalizeExtractedText(String(formData.get("extractedText") ?? ""))

    if (!(file instanceof File)) {
      throw new Error("Select a file to upload.")
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      throw new Error("Upload a file smaller than 15 MB.")
    }

    let analysis = ""
    let artifactId: string | null = null
    let warning: string | null = null
    let secureUrl = ""
    let publicId = ""
    let extractedText = submittedExtractedText

    try {
      const uploaded = await uploadDocumentToCloudinary({
        file,
        userId: user.uid,
        title: title || file.name,
      })

      secureUrl = uploaded.secureUrl
      publicId = uploaded.publicId
    } catch (error) {
      warning =
        error instanceof Error
          ? `The document text was kept in your workspace, but Cloudinary upload failed: ${error.message}`
          : "The document text was kept in your workspace, but Cloudinary upload failed."
    }

    if (!extractedText) {
      try {
        extractedText = normalizeExtractedText((await extractDocumentTextFromFile(file)).slice(0, 60000))
      } catch (error) {
        warning =
          warning ??
          (error instanceof Error
            ? `The file was uploaded, but text extraction failed: ${error.message}`
            : "The file was uploaded, but text extraction failed.")
      }
    }

    if (extractedText.length >= 20) {
      try {
        const analyzed = await analyzeStoredDocument({
          userId: user.uid,
          title: title || file.name,
          category,
          text: extractedText,
        })

        analysis = analyzed.analysis
        artifactId = analyzed.artifactId
      } catch (error) {
        warning =
          warning ??
          (error instanceof Error ? error.message : "The file was stored, but AI analysis could not be completed.")
      }
    } else {
      warning =
        warning ??
        `The file was stored, but AI analysis could not continue automatically. ${getDocumentExtractionMessage(file.name)}`
    }

    const saved = await saveUserDocument({
      userId: user.uid,
      title: title || file.name,
      category,
      status: analysis ? "analyzed" : "uploaded",
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
      secureUrl,
      publicId,
      extractedText,
      analysis,
      preview: (analysis || extractedText).slice(0, 180),
    })

    return NextResponse.json({
      document: saved.document,
      artifactId,
      warning,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not upload the document.",
      },
      { status: 400 },
    )
  }
}
