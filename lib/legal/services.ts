import { z } from "zod"
import { generateText } from "@/lib/gemini"
import {
  getConversationMessages,
  saveArtifact,
  saveConversationTurn,
  type ConversationMessage,
} from "@/lib/db"
import {
  buildAssistantPrompt,
  buildDocumentChatPrompt,
  buildDocumentDraftPrompt,
  buildSimplifierPrompt,
  buildStoredDocumentAnalysisPrompt,
} from "@/lib/legal/prompts"
import { getDocumentTemplate } from "@/lib/legal/templates"
import { retrieveRelevantKnowledge } from "@/lib/rag/retrieval"

const assistantInputSchema = z.object({
  userId: z.string().min(1),
  query: z.string().min(3).max(5000),
  conversationId: z.string().optional(),
  issueType: z.string().default("general"),
  urgency: z.string().default("normal"),
})

const simplifyInputSchema = z.object({
  userId: z.string().min(1),
  text: z.string().min(20).max(80000),
  title: z.string().default("Simplified legal document"),
})

const documentDraftSchema = z.object({
  userId: z.string().min(1),
  templateId: z.string().min(1),
  values: z.record(z.string(), z.string()),
})

const storedDocumentAnalysisSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  text: z.string().min(20).max(30000),
})

const documentChatSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(160),
  question: z.string().min(3).max(5000),
  documents: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).max(200),
        type: z.string().max(120).optional(),
        text: z.string().min(1).max(20000),
      }),
    )
    .min(1)
    .max(8),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(6000),
      }),
    )
    .max(20)
    .default([]),
})

function deriveConversationTitle(query: string) {
  const title = query.replace(/\s+/g, " ").trim().slice(0, 72)
  return title.length > 48 ? `${title.slice(0, 48)}...` : title
}

function trimHistory(messages: ConversationMessage[]) {
  return messages.slice(-8)
}

function clampDocumentText(text: string) {
  return text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, 12000)
}

export async function answerLegalQuestion(input: z.infer<typeof assistantInputSchema>) {
  const data = assistantInputSchema.parse(input)
  const history = data.conversationId ? await getConversationMessages(data.userId, data.conversationId, 12) : []
  const sources = await retrieveRelevantKnowledge(data.query, 5)
  const answer = await generateText(
    buildAssistantPrompt({
      query: data.query,
      issueType: data.issueType,
      urgency: data.urgency,
      history: trimHistory(history),
      sources,
    }),
    {
      temperature: 0.15,
      maxOutputTokens: 1800,
    },
  )

  const saved = await saveConversationTurn({
    userId: data.userId,
    conversationId: data.conversationId,
    title: deriveConversationTitle(data.query),
    issueType: data.issueType,
    urgency: data.urgency,
    userMessage: data.query,
    assistantMessage: answer,
    sources: sources.map((source) => ({
      id: source.id,
      title: source.title,
      sourceTitle: source.sourceTitle,
      excerpt: source.excerpt,
    })),
  })

  return {
    answer,
    conversationId: saved.conversationId,
    sources: sources.map((source) => ({
      id: source.id,
      title: source.title,
      sourceTitle: source.sourceTitle,
      category: source.category,
      excerpt: source.excerpt,
      score: source.score,
    })),
  }
}

export async function simplifyLegalDocument(input: z.infer<typeof simplifyInputSchema>) {
  const data = simplifyInputSchema.parse(input)
  const output = await generateText(buildSimplifierPrompt(data.text), {
    temperature: 0.1,
    maxOutputTokens: 1600,
  })

  const saved = await saveArtifact({
    userId: data.userId,
    kind: "simplify",
    title: data.title,
    preview: output.slice(0, 180),
    payload: {
      input: data.text,
      output,
    },
  })

  return {
    artifactId: saved.artifactId,
    simplifiedText: output,
  }
}

export async function draftLegalDocument(input: z.infer<typeof documentDraftSchema>) {
  const data = documentDraftSchema.parse(input)
  const template = getDocumentTemplate(data.templateId)

  if (!template) {
    throw new Error("Unknown document template.")
  }

  const output = await generateText(buildDocumentDraftPrompt(template, data.values), {
    temperature: 0.18,
    maxOutputTokens: 1800,
  })

  const saved = await saveArtifact({
    userId: data.userId,
    kind: "draft",
    title: template.name,
    preview: output.slice(0, 180),
    payload: {
      templateId: template.id,
      values: data.values,
      output,
    },
  })

  return {
    artifactId: saved.artifactId,
    document: output,
    template,
  }
}

export async function analyzeStoredDocument(input: z.infer<typeof storedDocumentAnalysisSchema>) {
  const data = storedDocumentAnalysisSchema.parse(input)
  const output = await generateText(
    buildStoredDocumentAnalysisPrompt({
      title: data.title,
      category: data.category,
      text: data.text,
    }),
    {
      temperature: 0.12,
      maxOutputTokens: 1400,
    },
  )

  const saved = await saveArtifact({
    userId: data.userId,
    kind: "analysis",
    title: data.title,
    preview: output.slice(0, 180),
    payload: {
      category: data.category,
      input: data.text,
      output,
    },
  })

  return {
    artifactId: saved.artifactId,
    analysis: output,
  }
}

export async function chatWithDocument(input: z.infer<typeof documentChatSchema>) {
  const data = documentChatSchema.parse(input)
  const sanitizedDocuments = data.documents.map((document) => ({
    ...document,
    type: document.type ?? "unknown",
    text: clampDocumentText(document.text),
  }))

  const output = await generateText(
    buildDocumentChatPrompt({
      title: data.title,
      documents: sanitizedDocuments,
      history: data.history,
      question: data.question,
    }),
    {
      temperature: 0.1,
      maxOutputTokens: 1600,
    },
  )

  return {
    answer: output,
    documents: sanitizedDocuments.map((document) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      preview: document.text.slice(0, 180),
    })),
  }
}
