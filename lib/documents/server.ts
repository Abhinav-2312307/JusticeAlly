import path from "node:path"
import { pathToFileURL } from "node:url"
import mammoth from "mammoth"

function normalizeExtractedText(value: string) {
  return value.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

export async function extractDocumentTextFromFile(file: File) {
  const lowerName = file.name.toLowerCase()

  if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs")
    const arrayBuffer = await file.arrayBuffer()
    const standardFontDataUrl = `${pathToFileURL(path.join(process.cwd(), "node_modules", "pdfjs-dist", "standard_fonts")).href}/`
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      isEvalSupported: false,
      standardFontDataUrl,
      useWorkerFetch: false,
    })
    const pdf = await loadingTask.promise
    let extracted = ""

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const text = await page.getTextContent()
      extracted += `${text.items.map((item) => ("str" in item ? item.str : "")).join(" ")}\n`
    }

    return normalizeExtractedText(extracted)
  }

  if (
    file.type.startsWith("text/") ||
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".md") ||
    lowerName.endsWith(".json")
  ) {
    return normalizeExtractedText(await file.text())
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return normalizeExtractedText(result.value)
  }

  if (lowerName.endsWith(".doc")) {
    return ""
  }

  return ""
}
