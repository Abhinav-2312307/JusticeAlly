"use client"

import { getDocumentExtractionMessage } from "@/lib/documents/shared"

export async function extractDocumentText(file: File) {
  const formData = new FormData()
  formData.set("file", file)

  const response = await fetch("/api/documents/extract", {
    method: "POST",
    body: formData,
  })

  const data = (await response.json()) as {
    extractedText?: string
    warning?: string | null
    error?: string
  }

  if (!response.ok) {
    throw new Error(data.error ?? "Could not read this file.")
  }

  return data.extractedText ?? ""
}

export { getDocumentExtractionMessage }
