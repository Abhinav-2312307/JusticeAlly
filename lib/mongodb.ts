import { MongoClient } from "mongodb"
import { getMongoConfig } from "@/lib/env"

declare global {
  // eslint-disable-next-line no-var
  var __justiceAllyMongoClientPromise: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var __justiceAllyMongoIndexesPromise: Promise<void> | undefined
}

function deriveDatabaseName(uri: string) {
  try {
    const url = new URL(uri)
    const pathname = url.pathname.replace(/^\/+/, "")
    return pathname || "justiceAlly-db"
  } catch {
    return "justiceAlly-db"
  }
}

async function getMongoClient() {
  const config = getMongoConfig()

  if (!config) {
    throw new Error("MongoDB is not configured. Add MONGODB_URI to persist user data.")
  }

  if (!global.__justiceAllyMongoClientPromise) {
    const client = new MongoClient(config.uri)
    global.__justiceAllyMongoClientPromise = client.connect()
  }

  return global.__justiceAllyMongoClientPromise
}

async function getRawMongoDb() {
  const config = getMongoConfig()

  if (!config) {
    throw new Error("MongoDB is not configured. Add MONGODB_URI to persist user data.")
  }

  const client = await getMongoClient()
  return client.db(config.dbName ?? deriveDatabaseName(config.uri))
}

async function ensureIndexes() {
  if (!global.__justiceAllyMongoIndexesPromise) {
    global.__justiceAllyMongoIndexesPromise = (async () => {
      const db = await getRawMongoDb()

      await Promise.all([
        db.collection("conversations").createIndex({ userId: 1, updatedAt: -1 }),
        db.collection("conversationMessages").createIndex({ userId: 1, conversationId: 1, createdAt: 1 }),
        db.collection("artifacts").createIndex({ userId: 1, updatedAt: -1 }),
        db.collection("documents").createIndex({ userId: 1, updatedAt: -1 }),
      ])
    })()
  }

  await global.__justiceAllyMongoIndexesPromise
}

export async function getMongoDb() {
  const db = await getRawMongoDb()
  await ensureIndexes()
  return db
}
