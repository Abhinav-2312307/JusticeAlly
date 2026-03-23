import { randomUUID } from "crypto"
import { getFirebaseAdminDb } from "@/lib/firebase/admin"
import { getMongoDb } from "@/lib/mongodb"
import type { KnowledgeChunk } from "@/lib/rag/chunking"
import type { SessionUser } from "@/lib/session"

export interface ConversationSummary {
  id: string
  title: string
  issueType: string
  urgency: string
  createdAt: string
  updatedAt: string
  preview: string
}

export interface ConversationMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  sources?: Array<{
    id: string
    title: string
    sourceTitle: string
    excerpt: string
  }>
}

export interface SavedArtifact {
  id: string
  kind: "simplify" | "draft" | "analysis"
  title: string
  createdAt: string
  updatedAt: string
  preview: string
}

export interface UserProfile {
  uid: string
  email: string | null
  name: string | null
  picture: string | null
  phoneNumber: string | null
  providerId: string | null
  city: string
  state: string
  preferredLanguage: string
  contactPreference: string
  primaryIssue: string
  safetyNotes: string
  createdAt: string
  updatedAt: string
  lastSeenAt: string
}

export interface StoredDocumentSummary {
  id: string
  title: string
  category: string
  status: "uploaded" | "analyzed"
  fileName: string
  mimeType: string
  fileSize: number
  secureUrl: string
  publicId: string
  preview: string
  createdAt: string
  updatedAt: string
}

export interface StoredDocumentRecord extends StoredDocumentSummary {
  extractedText: string
  analysis: string
}

interface UserProfileDoc extends UserProfile {
  _id: string
}

interface ConversationSummaryDoc extends ConversationSummary {
  _id: string
  userId: string
}

interface ConversationMessageDoc extends ConversationMessage {
  _id: string
  userId: string
  conversationId: string
}

interface SavedArtifactDoc extends SavedArtifact {
  _id: string
  userId: string
  payload: Record<string, unknown>
}

interface StoredDocumentRecordDoc extends StoredDocumentRecord {
  _id: string
  userId: string
}

const loggedKnowledgeWarnings = new Set<string>()

function buildDefaultUserProfile(user?: Partial<SessionUser> & { uid: string }): UserProfile {
  return {
    uid: user?.uid ?? "",
    email: user?.email ?? null,
    name: user?.name ?? null,
    picture: user?.picture ?? null,
    phoneNumber: user?.phoneNumber ?? null,
    providerId: user?.providerId ?? null,
    city: "",
    state: "",
    preferredLanguage: "",
    contactPreference: "",
    primaryIssue: "",
    safetyNotes: "",
    createdAt: "",
    updatedAt: "",
    lastSeenAt: "",
  }
}

function normalizeProfile(doc: UserProfileDoc | null | undefined, fallback: UserProfile): UserProfile {
  if (!doc) {
    return fallback
  }

  return {
    ...fallback,
    ...doc,
    uid: doc.uid || doc._id,
  }
}

function normalizeConversation(doc: ConversationSummaryDoc): ConversationSummary {
  return {
    id: doc.id || doc._id,
    title: doc.title || "Untitled conversation",
    issueType: doc.issueType || "general",
    urgency: doc.urgency || "normal",
    createdAt: doc.createdAt || "",
    updatedAt: doc.updatedAt || "",
    preview: doc.preview || "",
  }
}

function normalizeMessage(doc: ConversationMessageDoc): ConversationMessage {
  return {
    id: doc.id || doc._id,
    role: doc.role,
    content: doc.content,
    createdAt: doc.createdAt || "",
    sources: doc.sources ?? [],
  }
}

function normalizeArtifact(doc: SavedArtifactDoc): SavedArtifact {
  return {
    id: doc.id || doc._id,
    kind: doc.kind,
    title: doc.title || "Untitled artifact",
    createdAt: doc.createdAt || "",
    updatedAt: doc.updatedAt || "",
    preview: doc.preview || "",
  }
}

function normalizeDocument(doc: StoredDocumentRecordDoc): StoredDocumentRecord {
  return {
    id: doc.id || doc._id,
    title: doc.title || "Untitled document",
    category: doc.category || "general",
    status: doc.status || "uploaded",
    fileName: doc.fileName || "",
    mimeType: doc.mimeType || "",
    fileSize: doc.fileSize || 0,
    secureUrl: doc.secureUrl || "",
    publicId: doc.publicId || "",
    preview: doc.preview || "",
    extractedText: doc.extractedText || "",
    analysis: doc.analysis || "",
    createdAt: doc.createdAt || "",
    updatedAt: doc.updatedAt || "",
  }
}

async function usersCollection() {
  const db = await getMongoDb()
  return db.collection<UserProfileDoc>("users")
}

async function conversationsCollection() {
  const db = await getMongoDb()
  return db.collection<ConversationSummaryDoc>("conversations")
}

async function conversationMessagesCollection() {
  const db = await getMongoDb()
  return db.collection<ConversationMessageDoc>("conversationMessages")
}

async function artifactsCollection() {
  const db = await getMongoDb()
  return db.collection<SavedArtifactDoc>("artifacts")
}

async function documentsCollection() {
  const db = await getMongoDb()
  return db.collection<StoredDocumentRecordDoc>("documents")
}

export async function upsertUserProfile(user: SessionUser) {
  const users = await usersCollection()
  const timestamp = new Date().toISOString()

  const nextFields: Partial<UserProfileDoc> = {
    uid: user.uid,
    updatedAt: timestamp,
    lastSeenAt: timestamp,
  }

  if (user.email !== undefined) {
    nextFields.email = user.email ?? null
  }

  if (user.name !== undefined) {
    nextFields.name = user.name ?? null
  }

  if (user.picture !== undefined) {
    nextFields.picture = user.picture ?? null
  }

  if (user.phoneNumber !== undefined) {
    nextFields.phoneNumber = user.phoneNumber ?? null
  }

  if (user.providerId !== undefined) {
    nextFields.providerId = user.providerId ?? null
  }

  await users.updateOne(
    { _id: user.uid },
    {
      $set: nextFields,
      $setOnInsert: {
        _id: user.uid,
        city: "",
        state: "",
        preferredLanguage: "",
        contactPreference: "",
        primaryIssue: "",
        safetyNotes: "",
        createdAt: timestamp,
      },
    },
    { upsert: true },
  )
}

export async function getUserProfile(user: SessionUser): Promise<UserProfile> {
  const users = await usersCollection()
  const doc = await users.findOne({ _id: user.uid })
  return normalizeProfile(doc, buildDefaultUserProfile(user))
}

export async function saveUserProfileDetails(input: {
  userId: string
  name: string
  phoneNumber: string
  city: string
  state: string
  preferredLanguage: string
  contactPreference: string
  primaryIssue: string
  safetyNotes: string
}) {
  const users = await usersCollection()
  const timestamp = new Date().toISOString()

  await users.updateOne(
    { _id: input.userId },
    {
      $set: {
        uid: input.userId,
        name: input.name || null,
        phoneNumber: input.phoneNumber || null,
        city: input.city,
        state: input.state,
        preferredLanguage: input.preferredLanguage,
        contactPreference: input.contactPreference,
        primaryIssue: input.primaryIssue,
        safetyNotes: input.safetyNotes,
        updatedAt: timestamp,
        lastSeenAt: timestamp,
      },
      $setOnInsert: {
        _id: input.userId,
        email: null,
        picture: null,
        providerId: null,
        createdAt: timestamp,
      },
    },
    { upsert: true },
  )

  const doc = await users.findOne({ _id: input.userId })
  return normalizeProfile(doc, buildDefaultUserProfile({ uid: input.userId }))
}

export async function listUserConversations(userId: string, limit = 8): Promise<ConversationSummary[]> {
  const conversations = await conversationsCollection()
  const docs = await conversations.find({ userId }).sort({ updatedAt: -1 }).limit(limit).toArray()
  return docs.map(normalizeConversation)
}

export async function getConversationMessages(
  userId: string,
  conversationId: string,
  limit = 10,
): Promise<ConversationMessage[]> {
  const messages = await conversationMessagesCollection()
  const docs = await messages.find({ userId, conversationId }).sort({ createdAt: -1 }).limit(limit).toArray()
  return docs.reverse().map(normalizeMessage)
}

export async function saveConversationTurn(input: {
  userId: string
  conversationId?: string
  title: string
  issueType: string
  urgency: string
  userMessage: string
  assistantMessage: string
  sources: ConversationMessage["sources"]
}) {
  const conversations = await conversationsCollection()
  const messages = await conversationMessagesCollection()
  const conversationId = input.conversationId ?? randomUUID()
  const timestamp = new Date().toISOString()
  const userMessageId = randomUUID()
  const assistantMessageId = randomUUID()

  await conversations.updateOne(
    { _id: conversationId },
    {
      $set: {
        id: conversationId,
        userId: input.userId,
        title: input.title,
        issueType: input.issueType,
        urgency: input.urgency,
        preview: input.userMessage,
        updatedAt: timestamp,
      },
      $setOnInsert: {
        _id: conversationId,
        createdAt: timestamp,
      },
    },
    { upsert: true },
  )

  await messages.insertMany([
    {
      _id: userMessageId,
      id: userMessageId,
      userId: input.userId,
      conversationId,
      role: "user",
      content: input.userMessage,
      createdAt: timestamp,
      sources: [],
    },
    {
      _id: assistantMessageId,
      id: assistantMessageId,
      userId: input.userId,
      conversationId,
      role: "assistant",
      content: input.assistantMessage,
      createdAt: new Date(Date.now() + 1).toISOString(),
      sources: input.sources ?? [],
    },
  ])

  return { conversationId }
}

export async function listUserArtifacts(userId: string, limit = 6): Promise<SavedArtifact[]> {
  const artifacts = await artifactsCollection()
  const docs = await artifacts.find({ userId }).sort({ updatedAt: -1 }).limit(limit).toArray()
  return docs.map(normalizeArtifact)
}

export async function saveArtifact(input: {
  userId: string
  kind: "simplify" | "draft" | "analysis"
  title: string
  preview: string
  payload: Record<string, unknown>
}) {
  const artifacts = await artifactsCollection()
  const artifactId = randomUUID()
  const timestamp = new Date().toISOString()

  await artifacts.insertOne({
    _id: artifactId,
    id: artifactId,
    userId: input.userId,
    kind: input.kind,
    title: input.title,
    preview: input.preview,
    payload: input.payload,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return { artifactId }
}

export async function listUserDocuments(userId: string, limit = 8): Promise<StoredDocumentSummary[]> {
  const documents = await documentsCollection()
  const docs = await documents.find({ userId }).sort({ updatedAt: -1 }).limit(limit).toArray()
  return docs.map((doc) => normalizeDocument(doc))
}

export async function saveUserDocument(input: {
  userId: string
  title: string
  category: string
  status: "uploaded" | "analyzed"
  fileName: string
  mimeType: string
  fileSize: number
  secureUrl: string
  publicId: string
  extractedText: string
  analysis: string
  preview: string
}) {
  const documents = await documentsCollection()
  const documentId = randomUUID()
  const timestamp = new Date().toISOString()

  const document: StoredDocumentRecordDoc = {
    _id: documentId,
    id: documentId,
    userId: input.userId,
    title: input.title,
    category: input.category,
    status: input.status,
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
    secureUrl: input.secureUrl,
    publicId: input.publicId,
    extractedText: input.extractedText,
    analysis: input.analysis,
    preview: input.preview,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await documents.insertOne(document)

  return {
    documentId,
    document: normalizeDocument(document),
  }
}

function isRecoverableKnowledgeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  return [
    "PERMISSION_DENIED",
    "firestore.googleapis.com",
    "Cloud Firestore API has not been used",
    "The caller does not have permission",
    "database (default) does not exist",
  ].some((fragment) => message.includes(fragment))
}

function logKnowledgeFallback(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  if (loggedKnowledgeWarnings.has(message)) {
    return
  }

  loggedKnowledgeWarnings.add(message)
  console.warn(`[db] Knowledge chunk storage unavailable. Falling back to local corpus. ${message}`)
}

export async function listKnowledgeChunks(): Promise<KnowledgeChunk[]> {
  const db = getFirebaseAdminDb()

  if (!db) {
    return []
  }

  try {
    const snapshot = await db.collection("knowledgeChunks").get()

    return snapshot.docs.map((doc) => {
      const data = doc.data() as Partial<KnowledgeChunk> | undefined

      return {
        id: data?.id ?? doc.id,
        documentId: data?.documentId ?? "",
        title: data?.title ?? "",
        category: data?.category ?? "",
        jurisdiction: data?.jurisdiction ?? "India",
        sourceTitle: data?.sourceTitle ?? "",
        officialSource: data?.officialSource ?? "",
        tags: data?.tags ?? [],
        index: data?.index ?? 0,
        excerpt: data?.excerpt ?? "",
        content: data?.content ?? "",
        embedding: data?.embedding ?? [],
      }
    })
  } catch (error) {
    if (isRecoverableKnowledgeError(error)) {
      logKnowledgeFallback(error)
      return []
    }

    throw error
  }
}
