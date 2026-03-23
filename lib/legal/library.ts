import legalCorpus from "@/content/legal-corpus.json"
import legalAidDirectory from "@/content/legal-aid-directory.json"
import type { LegalCorpusDocument } from "@/lib/rag/chunking"

export interface LegalAidResource {
  id: string
  name: string
  category: string
  coverage: string
  contactLabel: string
  contactValue: string
  website: string
  notes: string
}

export const legalDocuments = legalCorpus as LegalCorpusDocument[]
export const legalAidResources = legalAidDirectory as LegalAidResource[]

export function getLegalDocumentCategories() {
  return [...new Set(legalDocuments.map((document) => document.category))].sort()
}

export function getResourceCategories() {
  return [...new Set(legalAidResources.map((resource) => resource.category))].sort()
}
