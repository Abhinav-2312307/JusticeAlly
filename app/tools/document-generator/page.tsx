import { requireSessionUser } from "@/lib/auth"
import { DocumentGeneratorWorkspace } from "@/components/legal/document-generator-workspace"

interface DocumentGeneratorPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function DocumentGeneratorPage({ searchParams }: DocumentGeneratorPageProps) {
  const params = searchParams ? await searchParams : undefined
  await requireSessionUser("/tools/document-generator")
  const templateValue = params?.template

  return <DocumentGeneratorWorkspace initialTemplateId={typeof templateValue === "string" ? templateValue : undefined} />
}
