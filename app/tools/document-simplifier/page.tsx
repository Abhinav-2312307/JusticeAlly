import { requireSessionUser } from "@/lib/auth"
import { upsertUserProfile } from "@/lib/db"
import { DocumentSimplifierWorkspace } from "@/components/legal/document-simplifier-workspace"

export default async function DocumentSimplifierPage() {
  const user = await requireSessionUser("/tools/document-simplifier")
  await upsertUserProfile(user)

  return <DocumentSimplifierWorkspace />
}
