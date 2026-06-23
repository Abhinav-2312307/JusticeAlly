import { requireSessionUser } from "@/lib/auth"
import { listUserConversations } from "@/lib/db"
import { AssistantWorkspace } from "@/components/legal/assistant-workspace"

interface LegalAssistantPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LegalAssistantPage({ searchParams }: LegalAssistantPageProps) {
  const params = searchParams ? await searchParams : undefined
  const user = await requireSessionUser("/tools/legal-assistant")
  const initialConversations = await listUserConversations(user.uid, 5).catch((error) => {
    console.error("[legal-assistant] Could not load saved conversations.", error)
    return []
  })
  const promptValue = params?.prompt
  const issueValue = params?.issue
  const urgencyValue = params?.urgency

  return (
    <AssistantWorkspace
      initialConversations={initialConversations}
      initialPrompt={typeof promptValue === "string" ? promptValue : undefined}
      initialIssueType={typeof issueValue === "string" ? issueValue : undefined}
      initialUrgency={typeof urgencyValue === "string" ? urgencyValue : undefined}
    />
  )
}
