import Link from "next/link"
import { ArrowRight, BookOpenText, FileText, MessageSquare, ShieldCheck } from "lucide-react"
import { requireSessionUser } from "@/lib/auth"
import { getUserProfile, listUserArtifacts, listUserConversations, listUserDocuments, upsertUserProfile } from "@/lib/db"
import { getKnowledgeBaseStatus } from "@/lib/rag/retrieval"
import { getSetupSummary } from "@/lib/env"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileSettingsCard } from "@/components/legal/profile-settings-card"
import { DocumentVaultCard } from "@/components/legal/document-vault-card"

function formatDate(value: string) {
  if (!value) {
    return "No activity yet"
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export default async function WorkspacePage() {
  const user = await requireSessionUser("/workspace")
  await upsertUserProfile(user)

  const [profile, conversations, artifacts, documents, knowledgeStatus] = await Promise.all([
    getUserProfile(user),
    listUserConversations(user.uid),
    listUserArtifacts(user.uid),
    listUserDocuments(user.uid),
    getKnowledgeBaseStatus(),
  ])

  const setup = getSetupSummary()

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <section className="glass-panel overflow-hidden p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Workspace</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">
                {(profile.name || user.name) ? `Welcome back, ${(profile.name || user.name)?.split(" ")[0]}.` : "Welcome back."}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Your account is connected to a persistent workspace for assistant sessions, source-backed answers, and
                saved document outputs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/tools/legal-assistant">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Open assistant
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/tools/document-simplifier">
                    <FileText className="mr-2 h-4 w-4" />
                    Open document chat
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/tools/document-generator">
                    <BookOpenText className="mr-2 h-4 w-4" />
                    Open draft studio
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border-white/80 bg-white/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Knowledge mode</CardTitle>
                  <CardDescription>RAG operating source for Gemini answers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium uppercase tracking-[0.22em] text-primary">{knowledgeStatus.mode}</p>
                  <p>{knowledgeStatus.chunkCount} searchable chunks available.</p>
                </CardContent>
              </Card>

              <Card className="border-white/80 bg-white/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Setup status</CardTitle>
                  <CardDescription>Environment readiness for full-stack features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Gemini: {setup.hasGeminiConfig ? "configured" : "missing env"}</p>
                  <p>Firebase client: {setup.hasFirebaseClientConfig ? "configured" : "missing env"}</p>
                  <p>Firebase admin: {setup.hasFirebaseAdminConfig ? "configured" : "missing env"}</p>
                  <p>MongoDB: {setup.hasMongoConfig ? "configured" : "missing env"}</p>
                  <p>Session secret: {setup.hasSessionSecret ? "configured" : "missing env"}</p>
                  <p>Cloudinary: {setup.hasCloudinaryConfig ? "configured" : "missing env"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-panel border-white/70">
            <CardHeader>
              <CardTitle>Recent conversations</CardTitle>
              <CardDescription>Saved assistant threads linked to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved conversations yet. Start with the legal assistant.</p>
              ) : (
                conversations.map((conversation) => (
                  <div key={conversation.id} className="rounded-2xl border border-white/80 bg-white/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{conversation.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{conversation.preview}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {conversation.urgency}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Updated {formatDate(conversation.updatedAt)}</p>
                  </div>
                ))
              )}

              <Button variant="ghost" asChild className="w-full justify-between">
                <Link href="/tools/legal-assistant">
                  Go to legal assistant
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/70">
            <CardHeader>
              <CardTitle>Saved outputs</CardTitle>
              <CardDescription>Generated drafts and simplified document results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {artifacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved outputs yet. Use the document tools to create and store artifacts.
                </p>
              ) : (
                artifacts.map((artifact) => (
                  <div key={artifact.id} className="rounded-2xl border border-white/80 bg-white/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-foreground">{artifact.title}</p>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{artifact.kind}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{artifact.preview}</p>
                    <p className="mt-3 text-xs text-muted-foreground">Saved {formatDate(artifact.updatedAt)}</p>
                  </div>
                ))
              )}

              <div className="rounded-2xl border border-emerald-900/10 bg-emerald-950/95 p-5 text-white">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">Workspace note</p>
                    <p className="mt-1 text-sm text-white/80">
                      Assistant answers are grounded in the platform corpus, but matter-specific legal action should still
                      be validated by a licensed advocate.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.52fr_0.48fr]">
          <ProfileSettingsCard initialProfile={profile} />
          <DocumentVaultCard initialDocuments={documents} />
        </section>
      </div>
    </main>
  )
}
