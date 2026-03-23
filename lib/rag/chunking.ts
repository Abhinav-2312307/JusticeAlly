export interface LegalCorpusDocument {
  id: string
  title: string
  category: string
  jurisdiction: string
  sourceTitle: string
  officialSource: string
  tags: string[]
  summary: string
  body: string
}

export interface KnowledgeChunk {
  id: string
  documentId: string
  title: string
  category: string
  jurisdiction: string
  sourceTitle: string
  officialSource: string
  tags: string[]
  index: number
  excerpt: string
  content: string
  embedding?: number[]
}

const TARGET_CHUNK_SIZE = 900

export function chunkLegalDocument(document: LegalCorpusDocument): KnowledgeChunk[] {
  const blocks = [document.summary, ...document.body.split(/\n{2,}/)].map((block) => block.trim()).filter(Boolean)
  const chunks: KnowledgeChunk[] = []
  let buffer: string[] = []
  let currentLength = 0
  let index = 0

  const pushChunk = () => {
    if (buffer.length === 0) {
      return
    }

    const content = buffer.join("\n\n").trim()
    chunks.push({
      id: `${document.id}-${index}`,
      documentId: document.id,
      title: document.title,
      category: document.category,
      jurisdiction: document.jurisdiction,
      sourceTitle: document.sourceTitle,
      officialSource: document.officialSource,
      tags: document.tags,
      index,
      excerpt: content.slice(0, 220),
      content,
    })
    buffer = []
    currentLength = 0
    index += 1
  }

  for (const block of blocks) {
    if (currentLength + block.length > TARGET_CHUNK_SIZE && buffer.length > 0) {
      pushChunk()
    }

    buffer.push(block)
    currentLength += block.length
  }

  pushChunk()

  return chunks
}
