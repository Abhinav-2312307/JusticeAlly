import { requireSessionUser } from "@/lib/auth"
import { listUserConversations, upsertUserProfile } from "@/lib/db"
import { AssistantWorkspace } from "@/components/legal/assistant-workspace"

interface LegalAssistantPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LegalAssistantPage({ searchParams }: LegalAssistantPageProps) {
  const params = searchParams ? await searchParams : undefined
  const user = await requireSessionUser("/tools/legal-assistant")
  await upsertUserProfile(user)
  const initialConversations = await listUserConversations(user.uid, 5)
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
