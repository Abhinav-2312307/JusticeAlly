export function getDocumentExtractionMessage(fileName: string) {
  const lowerName = fileName.toLowerCase()

  if (lowerName.endsWith(".doc")) {
    return "Legacy .doc files can be stored securely, but automatic text extraction is strongest for PDF, TXT, and DOCX in this build."
  }

  return "The file was stored, but automatic text extraction was not available for that format."
}
