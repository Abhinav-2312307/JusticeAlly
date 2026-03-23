import legalCorpus from "@/content/legal-corpus.json"
import { embedText } from "@/lib/gemini"
import { listKnowledgeChunks } from "@/lib/db"
import { chunkLegalDocument, type KnowledgeChunk, type LegalCorpusDocument } from "@/lib/rag/chunking"

const localCorpus = legalCorpus as LegalCorpusDocument[]
const localChunks = localCorpus.flatMap((document) => chunkLegalDocument(document))
const localEmbeddingCache = new Map<string, number[]>()

export interface RetrievedChunk extends KnowledgeChunk {
  score: number
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2)
}

function lexicalScore(query: string, candidate: string) {
  const queryTokens = new Set(tokenize(query))
  const candidateTokens = tokenize(candidate)

  if (queryTokens.size === 0 || candidateTokens.length === 0) {
    return 0
  }

  let matches = 0

  for (const token of candidateTokens) {
    if (queryTokens.has(token)) {
      matches += 1
    }
  }

  return matches / candidateTokens.length
}

function cosineSimilarity(left: number[], right: number[]) {
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0

  for (let index = 0; index < left.length; index += 1) {
    const leftValue = left[index] ?? 0
    const rightValue = right[index] ?? 0
    dot += leftValue * rightValue
    leftNorm += leftValue * leftValue
    rightNorm += rightValue * rightValue
  }

  if (!leftNorm || !rightNorm) {
    return 0
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
}

async function ensureLocalChunkEmbedding(chunk: KnowledgeChunk) {
  const cached = localEmbeddingCache.get(chunk.id)

  if (cached) {
    return cached
  }

  const embedding = await embedText(chunk.content, {
    taskType: "RETRIEVAL_DOCUMENT",
    outputDimensionality: 768,
  })

  localEmbeddingCache.set(chunk.id, embedding)
  return embedding
}

export async function getKnowledgeBaseStatus() {
  const storedChunks = await listKnowledgeChunks()

  return {
    mode: storedChunks.length > 0 ? "firestore" : "local",
    documentCount: localCorpus.length,
    chunkCount: storedChunks.length > 0 ? storedChunks.length : localChunks.length,
  }
}

export async function retrieveRelevantKnowledge(query: string, limit = 5): Promise<RetrievedChunk[]> {
  const storedChunks = await listKnowledgeChunks()
  const sourceChunks = storedChunks.length > 0 ? storedChunks : localChunks
  const queryEmbedding = await embedText(query, {
    taskType: "RETRIEVAL_QUERY",
    outputDimensionality: 768,
  })

  const lexicalCandidates = [...sourceChunks]
    .map((chunk) => ({
      chunk,
      lexical: lexicalScore(query, `${chunk.title} ${chunk.tags.join(" ")} ${chunk.content}`),
    }))
    .sort((left, right) => right.lexical - left.lexical)
    .slice(0, storedChunks.length > 0 ? 18 : 10)

  const scored: RetrievedChunk[] = []

  for (const candidate of lexicalCandidates) {
    const embedding =
      storedChunks.length > 0
        ? candidate.chunk.embedding ?? []
        : await ensureLocalChunkEmbedding(candidate.chunk)
    const semantic = embedding.length > 0 ? cosineSimilarity(queryEmbedding, embedding) : 0
    const score = semantic > 0 ? semantic * 0.82 + candidate.lexical * 0.18 : candidate.lexical

    if (score > 0.05) {
      scored.push({
        ...candidate.chunk,
        score,
      })
    }
  }

  return scored.sort((left, right) => right.score - left.score).slice(0, limit)
}
