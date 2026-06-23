import { requireSessionUser } from "@/lib/auth"
import { DocumentSimplifierWorkspace } from "@/components/legal/document-simplifier-workspace"

export default async function DocumentSimplifierPage() {
  await requireSessionUser("/tools/document-simplifier")

  return <DocumentSimplifierWorkspace />
}
