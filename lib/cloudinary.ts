import { createHash } from "crypto"
import { getCloudinaryConfig } from "@/lib/env"

interface CloudinaryUploadResponse {
  public_id?: string
  secure_url?: string
  bytes?: number
  error?: {
    message?: string
  }
}

function sanitizePublicIdSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

function signUploadParams(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex")
}

export async function uploadDocumentToCloudinary(input: {
  file: File
  userId: string
  title: string
}) {
  const config = getCloudinaryConfig()

  if (!config) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.")
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = `${config.folder}/${input.userId}`
  const publicId = `${sanitizePublicIdSegment(input.title || input.file.name || "document")}-${timestamp}`
  const signature = signUploadParams(
    {
      folder,
      public_id: publicId,
      timestamp,
      use_filename: "false",
    },
    config.apiSecret,
  )

  const formData = new FormData()
  formData.set("file", input.file)
  formData.set("api_key", config.apiKey)
  formData.set("timestamp", timestamp)
  formData.set("folder", folder)
  formData.set("public_id", publicId)
  formData.set("use_filename", "false")
  formData.set("signature", signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/raw/upload`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  })

  const data = (await response.json().catch(() => null)) as CloudinaryUploadResponse | null

  if (!response.ok || !data?.public_id || !data.secure_url) {
    throw new Error(data?.error?.message ?? "Cloudinary upload failed.")
  }

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    bytes: data.bytes ?? input.file.size,
  }
}
