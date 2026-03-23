import Link from "next/link"
import { ArrowRight, BookOpenText, FileText, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOptionalSessionUser } from "@/lib/auth"
import { getSetupSummary } from "@/lib/env"
import { legalAidResources, legalDocuments } from "@/lib/legal/library"
import { documentTemplates } from "@/lib/legal/templates"
import { getKnowledgeBaseStatus } from "@/lib/rag/retrieval"

export default async function HomePage() {
  const [knowledgeStatus, user] = await Promise.all([getKnowledgeBaseStatus(), getOptionalSessionUser()])
  const setup = getSetupSummary()

  const featureCards = [
    {
      title: "AI Lawyer",
      description: "A cleaner assistant UI with retrieval-backed legal guidance, saved threads, and JSON export.",
      href: "/tools/legal-assistant",
      cta: "Open assistant",
    },
    {
      title: "Document Chat",
      description: "Attach PDFs, DOCX, JSON, or text files, generate a legal brief, and continue the conversation.",
      href: "/tools/document-simplifier",
      cta: "Analyze documents",
    },
    {
      title: "Draft Studio",
      description: "Generate FIR-style complaints, RTIs, legal notices, and workplace complaints from structured facts.",
      href: "/tools/document-generator",
      cta: "Generate draft",
    },
    {
      title: "Rights + Directory",
      description: "Browse legal resources, rights summaries, and aid channels with AI handoff into the assistant.",
      href: "/resources/legal-library",
      cta: "Browse library",
    },
  ]

  const flowSteps = [
    {
      title: "Understand the issue",
      description: "Use the AI lawyer and rights library to frame the matter, urgency, and evidence checklist.",
    },
    {
      title: "Analyze documents",
      description: "Upload legal files, generate a plain-language brief, and ask follow-up questions from the same document set.",
    },
    {
      title: "Draft the next move",
      description: "Turn facts into a first-pass FIR complaint, RTI request, notice, or workplace complaint.",
    },
    {
      title: "Keep the record",
      description: "Persist threads, artifacts, and uploaded files in the workspace for later follow-up.",
    },
  ]

  return (
    <main className="space-y-14 pb-14 md:space-y-20 md:pb-20">
      <section className="page-section pb-0">
        <div className="container-shell">
          <div className="glass-panel overflow-hidden border-white/70 bg-[linear-gradient(135deg,rgba(20,72,61,0.98),rgba(50,32,17,0.94))] p-8 text-white md:p-12">
            <div className="grid gap-10 xl:grid-cols-[1.08fr_0.92fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80">
                  <Sparkles className="h-4 w-4" />
                  Full legal guidance workspace
                </div>
                <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] md:text-7xl">
                  JusticeAlly turns legal confusion into guided action.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                  Start from a landing page, sign in with email or Google, use a retrieval-backed AI lawyer, chat with
                  legal documents, generate structured drafts like FIR complaints and RTIs, and keep everything tied to one
                  workspace.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href={user ? "/workspace" : "/signup"}>
                      {user ? "Open workspace" : "Create workspace"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                    <Link href="/resources/legal-library">Browse legal library</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <Card className="border-white/15 bg-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Platform snapshot</CardTitle>
                    <CardDescription className="text-white/70">What the current build is wired to support.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm text-white/78 sm:grid-cols-2">
                    <p>Knowledge mode: {knowledgeStatus.mode}</p>
                    <p>Corpus documents: {legalDocuments.length}</p>
                    <p>Template types: {documentTemplates.length}</p>
                    <p>Directory resources: {legalAidResources.length}</p>
                  </CardContent>
                </Card>

                <Card className="border-white/15 bg-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Readiness</CardTitle>
                    <CardDescription className="text-white/70">Env visibility from the landing page.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm text-white/78 sm:grid-cols-2">
                    <p>Gemini: {setup.hasGeminiConfig ? "configured" : "missing"}</p>
                    <p>Firebase client: {setup.hasFirebaseClientConfig ? "configured" : "missing"}</p>
                    <p>Firebase admin: {setup.hasFirebaseAdminConfig ? "configured" : "missing"}</p>
                    <p>MongoDB: {setup.hasMongoConfig ? "configured" : "missing"}</p>
                    <p>Session secret: {setup.hasSessionSecret ? "configured" : "missing"}</p>
                    <p>Cloudinary: {setup.hasCloudinaryConfig ? "configured" : "missing"}</p>
                  </CardContent>
                </Card>

                <div className="rounded-3xl border border-white/15 bg-white/10 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">Scope</p>
                  <p className="mt-3 text-lg leading-7 text-white/85">
                    Built for Indian legal guidance and first-step drafting. High-stakes action still needs case-specific review
                    from a licensed advocate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section py-0">
        <div className="container-shell grid gap-6 lg:grid-cols-4">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full justify-between">
                  <Link href={feature.href}>
                    {feature.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-section py-0">
        <div className="container-shell">
          <div className="grid gap-6 xl:grid-cols-[0.6fr_0.4fr]">
            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-3xl">How the user flow works now</CardTitle>
                <CardDescription>Designed as one connected product instead of separate disconnected pages.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {flowSteps.map((step, index) => (
                  <div key={step.title} className="rounded-3xl border border-white/80 bg-white/85 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Step {index + 1}</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{step.title}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  What changed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>Phone-number sign-in is no longer part of the auth flow. Access is handled through email-password and Google only.</p>
                <p>The assistant now supports saved thread loading, better source visibility, and JSON export.</p>
                <p>The old simplifier has been upgraded into a document-chat workspace with multi-file attachments and follow-up Q&A.</p>
                <p>The drafting tool now better surfaces FIR/RTI/legal notice flows and connects back into the assistant when facts need cleanup.</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild variant="outline">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/workspace">Open workspace</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="page-section py-0">
        <div className="container-shell grid gap-6 lg:grid-cols-3">
          <Card className="glass-panel border-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpenText className="h-5 w-5 text-primary" />
                Rights Library
              </CardTitle>
              <CardDescription>Search the same knowledge base that powers legal retrieval.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/resources/legal-library">Browse library</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="h-5 w-5 text-primary" />
                Document Workflows
              </CardTitle>
              <CardDescription>Summaries, document chat, generated drafts, and stored outputs live under one account.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/tools/document-simplifier">Document chat</Link>
              </Button>
              <Button asChild>
                <Link href="/tools/document-generator">Draft studio</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Guidance
              </CardTitle>
              <CardDescription>Move from public resources into the assistant with guided prompts and context handoff.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/tools/legal-assistant">Open AI lawyer</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
