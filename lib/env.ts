import { z } from "zod"

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
})

const geminiEnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1),
})

const firebaseAdminEnvSchema = z.object({
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
})

const sessionEnvSchema = z.object({
  SESSION_COOKIE_NAME: z.string().min(1).default("justiceally_session"),
  SESSION_SECRET: z.string().min(32).optional(),
})

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_FOLDER: z.string().min(1).default("justiceally"),
})

const mongoEnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1).optional(),
})

type PublicEnvKey = keyof z.infer<typeof publicEnvSchema>
type GeminiEnvKey = keyof z.infer<typeof geminiEnvSchema>
type FirebaseAdminEnvKey = keyof z.infer<typeof firebaseAdminEnvSchema>
type CloudinaryEnvKey = keyof z.infer<typeof cloudinaryEnvSchema>
type MongoEnvKey = keyof z.infer<typeof mongoEnvSchema>

function getPublicCandidateEnv() {
  return {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }
}

function getGeminiCandidateEnv() {
  return {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  }
}

function getFirebaseAdminCandidateEnv() {
  return {
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  }
}

function getSessionCandidateEnv() {
  return {
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME ?? "justiceally_session",
    SESSION_SECRET: process.env.SESSION_SECRET,
  }
}

function getCloudinaryCandidateEnv() {
  return {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER ?? "justiceally",
  }
}

function getMongoCandidateEnv() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  }
}

const publicEnvResult = publicEnvSchema.safeParse(getPublicCandidateEnv())
const geminiEnvResult = geminiEnvSchema.safeParse(getGeminiCandidateEnv())
const firebaseAdminEnvResult = firebaseAdminEnvSchema.safeParse(getFirebaseAdminCandidateEnv())
const sessionEnvResult = sessionEnvSchema.safeParse(getSessionCandidateEnv())
const cloudinaryEnvResult = cloudinaryEnvSchema.safeParse(getCloudinaryCandidateEnv())
const mongoEnvResult = mongoEnvSchema.safeParse(getMongoCandidateEnv())

export function getMissingPublicEnv(): PublicEnvKey[] {
  if (publicEnvResult.success) {
    return []
  }

  return publicEnvResult.error.issues
    .map((issue) => issue.path[0])
    .filter((value): value is PublicEnvKey => typeof value === "string")
}

export function getMissingGeminiEnv(): GeminiEnvKey[] {
  if (geminiEnvResult.success) {
    return []
  }

  return geminiEnvResult.error.issues
    .map((issue) => issue.path[0])
    .filter((value): value is GeminiEnvKey => typeof value === "string")
}

export function getMissingFirebaseAdminEnv(): FirebaseAdminEnvKey[] {
  if (firebaseAdminEnvResult.success) {
    return []
  }

  return firebaseAdminEnvResult.error.issues
    .map((issue) => issue.path[0])
    .filter((value): value is FirebaseAdminEnvKey => typeof value === "string")
}

export function getMissingCloudinaryEnv(): CloudinaryEnvKey[] {
  if (cloudinaryEnvResult.success) {
    return []
  }

  return cloudinaryEnvResult.error.issues
    .map((issue) => issue.path[0])
    .filter((value): value is CloudinaryEnvKey => typeof value === "string")
}

export function getMissingMongoEnv(): MongoEnvKey[] {
  if (mongoEnvResult.success) {
    return []
  }

  return mongoEnvResult.error.issues
    .map((issue) => issue.path[0])
    .filter((value): value is MongoEnvKey => typeof value === "string")
}

export const hasFirebaseClientConfig = publicEnvResult.success
export const hasGeminiConfig = geminiEnvResult.success
export const hasFirebaseAdminConfig = firebaseAdminEnvResult.success
export const hasCloudinaryConfig = cloudinaryEnvResult.success
export const hasMongoConfig = mongoEnvResult.success
export const hasSessionSecret = !!sessionEnvResult.data?.SESSION_SECRET

export function getFirebaseClientConfig() {
  if (!publicEnvResult.success) {
    return null
  }

  return publicEnvResult.data
}

export function getFirebaseAdminConfig() {
  if (!firebaseAdminEnvResult.success) {
    return null
  }

  return {
    projectId: firebaseAdminEnvResult.data.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: firebaseAdminEnvResult.data.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: firebaseAdminEnvResult.data.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }
}

export function getGeminiApiKey() {
  return geminiEnvResult.success ? geminiEnvResult.data.GEMINI_API_KEY : null
}

export function getSessionCookieName() {
  return sessionEnvResult.success ? sessionEnvResult.data.SESSION_COOKIE_NAME : "justiceally_session"
}

export function getSessionSecret() {
  return sessionEnvResult.success ? sessionEnvResult.data.SESSION_SECRET ?? null : null
}

export function getCloudinaryConfig() {
  if (!cloudinaryEnvResult.success) {
    return null
  }

  return {
    cloudName: cloudinaryEnvResult.data.CLOUDINARY_CLOUD_NAME,
    apiKey: cloudinaryEnvResult.data.CLOUDINARY_API_KEY,
    apiSecret: cloudinaryEnvResult.data.CLOUDINARY_API_SECRET,
    folder: cloudinaryEnvResult.data.CLOUDINARY_FOLDER,
  }
}

export function getMongoConfig() {
  if (!mongoEnvResult.success) {
    return null
  }

  return {
    uri: mongoEnvResult.data.MONGODB_URI,
    dbName: mongoEnvResult.data.MONGODB_DB_NAME ?? null,
  }
}

export function getSetupSummary() {
  return {
    hasGeminiConfig,
    hasFirebaseClientConfig,
    hasFirebaseAdminConfig,
    hasCloudinaryConfig,
    hasMongoConfig,
    hasSessionSecret,
    missingClientEnv: getMissingPublicEnv(),
    missingGeminiEnv: getMissingGeminiEnv(),
    missingFirebaseAdminEnv: getMissingFirebaseAdminEnv(),
    missingCloudinaryEnv: getMissingCloudinaryEnv(),
    missingMongoEnv: getMissingMongoEnv(),
  }
}
