import { readFile } from "node:fs/promises"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const corpusFile = new URL("../content/legal-corpus.json", import.meta.url)
const geminiApiKey = process.env.GEMINI_API_KEY
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")

if (!geminiApiKey || !projectId || !clientEmail || !privateKey) {
  console.error("Missing env. Set GEMINI_API_KEY and FIREBASE_ADMIN_* before seeding knowledge.")
  process.exit(1)
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

const db = getFirestore()

function chunkDocument(document) {
  const blocks = [document.summary, ...document.body.split(/\n{2,}/)].map((block) => block.trim()).filter(Boolean)
  const chunks = []
  let buffer = []
  let length = 0
  let index = 0

  const flush = () => {
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
    length = 0
    index += 1
  }

  for (const block of blocks) {
    if (length + block.length > 900 && buffer.length > 0) {
      flush()
    }

    buffer.push(block)
    length += block.length
  }

  flush()
  return chunks
}

async function embedText(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text }],
        },
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: 768,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(await response.text())
  }

  const data = await response.json()
  const values = data?.embedding?.values

  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("Gemini returned an empty embedding.")
  }

  return values
}

const corpus = JSON.parse(await readFile(corpusFile, "utf8"))
const chunks = corpus.flatMap((document) => chunkDocument(document))

console.log(`Seeding ${chunks.length} chunks from ${corpus.length} documents...`)

for (let index = 0; index < chunks.length; index += 1) {
  const chunk = chunks[index]
  const embedding = await embedText(chunk.content)
  await db.collection("knowledgeChunks").doc(chunk.id).set({
    ...chunk,
    embedding,
    updatedAt: new Date().toISOString(),
  })
  console.log(`Stored ${index + 1}/${chunks.length}: ${chunk.id}`)
}

console.log("Knowledge seeding completed.")
