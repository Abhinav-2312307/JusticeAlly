import { requireSessionUser } from "@/lib/auth"
import { upsertUserProfile } from "@/lib/db"
import { DocumentGeneratorWorkspace } from "@/components/legal/document-generator-workspace"

interface DocumentGeneratorPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function DocumentGeneratorPage({ searchParams }: DocumentGeneratorPageProps) {
  const params = searchParams ? await searchParams : undefined
  const user = await requireSessionUser("/tools/document-generator")
  await upsertUserProfile(user)
  const templateValue = params?.template

  return <DocumentGeneratorWorkspace initialTemplateId={typeof templateValue === "string" ? templateValue : undefined} />
}
