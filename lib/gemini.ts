import { getGeminiApiKey } from "@/lib/env"

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
const GENERATION_MODEL = "gemini-2.5-flash"
const EMBEDDING_MODEL = "gemini-embedding-001"

async function geminiRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const apiKey = getGeminiApiKey()

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY.")
  }

  const response = await fetch(`${GEMINI_BASE_URL}/${path}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Gemini request failed.")
  }

  return (await response.json()) as T
}

interface GenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

interface EmbedContentResponse {
  embedding?: {
    values?: number[]
  }
}

export async function generateText(prompt: string, options?: { temperature?: number; maxOutputTokens?: number }) {
  const data = await geminiRequest<GenerateContentResponse>(`${GENERATION_MODEL}:generateContent`, {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: options?.temperature ?? 0.2,
      topP: 0.9,
      maxOutputTokens: options?.maxOutputTokens ?? 2048,
    },
  })

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim()

  if (!text) {
    throw new Error("Gemini returned an empty response.")
  }

  return text
}

export async function embedText(
  text: string,
  options?: { taskType?: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT"; outputDimensionality?: number },
) {
  const data = await geminiRequest<EmbedContentResponse>(`${EMBEDDING_MODEL}:embedContent`, {
    model: `models/${EMBEDDING_MODEL}`,
    content: {
      parts: [{ text }],
    },
    taskType: options?.taskType ?? "RETRIEVAL_DOCUMENT",
    outputDimensionality: options?.outputDimensionality ?? 768,
  })

  const values = data.embedding?.values

  if (!values?.length) {
    throw new Error("Gemini returned an empty embedding.")
  }

  return values
}
