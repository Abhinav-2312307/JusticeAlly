"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Download, FileText, Loader2, Scale, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { documentTemplates, type DocumentTemplateDefinition } from "@/lib/legal/templates"

interface DocumentGeneratorWorkspaceProps {
  initialTemplateId?: string
}

function downloadJsonFile(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function DocumentGeneratorWorkspace({ initialTemplateId }: DocumentGeneratorWorkspaceProps) {
  const { toast } = useToast()
  const [templateId, setTemplateId] = useState(initialTemplateId ?? documentTemplates[0]?.id ?? "")
  const [values, setValues] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [documentText, setDocumentText] = useState("")
  const [artifactId, setArtifactId] = useState("")
  const [copied, setCopied] = useState(false)

  const activeTemplate = useMemo<DocumentTemplateDefinition | null>(() => {
    return documentTemplates.find((template) => template.id === templateId) ?? null
  }, [templateId])

  const exportPayload = useMemo(() => {
    return {
      exportedAt: new Date().toISOString(),
      templateId,
      templateName: activeTemplate?.name ?? null,
      values,
      artifactId: artifactId || null,
      output: documentText || null,
    }
  }, [activeTemplate?.name, artifactId, documentText, templateId, values])

  useEffect(() => {
    setValues({})
    setDocumentText("")
    setArtifactId("")
  }, [templateId])

  function updateValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value }))
  }

  async function handleGenerate() {
    if (!activeTemplate) {
      return
    }

    const missingFields = activeTemplate.fields.filter((field) => field.required && !values[field.id]?.trim())

    if (missingFields.length > 0) {
      toast({
        title: "Missing required details",
        description: `Complete these fields first: ${missingFields.map((field) => field.label).join(", ")}.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/documents/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          values,
        }),
      })

      const data = (await response.json()) as { document?: string; artifactId?: string; error?: string }

      if (!response.ok || !data.document) {
        throw new Error(data.error ?? "Could not generate the document.")
      }

      setDocumentText(data.document)
      setArtifactId(data.artifactId ?? "")
    } catch (error) {
      toast({
        title: "Document generation failed",
        description: error instanceof Error ? error.message : "Try again with more factual detail.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(documentText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([documentText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${activeTemplate?.name ?? "generated-document"}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <section className="glass-panel overflow-hidden border-white/70 bg-[linear-gradient(135deg,rgba(64,40,20,0.98),rgba(18,76,66,0.94))] p-8 text-white md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80">
                <FileText className="h-4 w-4" />
                FIR, RTI, notice, and complaint drafting
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
                Generate cleaner first-pass legal drafts without inventing facts.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                Pick a document type, enter only the facts you know, and get a structured draft designed for review and
                refinement. The prompts are tuned to stay factual and leave uncertainty visible instead of guessing.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  FIR / police complaint
                </Badge>
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  RTI request
                </Badge>
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  Legal notice
                </Badge>
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  Workplace complaint
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Drafting rule</p>
                <p className="mt-3 text-lg font-semibold">Facts first</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  The generator is instructed not to invent sections, addresses, dates, or case numbers.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Output</p>
                <p className="mt-3 text-lg font-semibold">Structured formal draft</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Each result ends with a short checklist of things the user should verify before sending.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Handoff</p>
                <p className="mt-3 text-lg font-semibold">Guidance and drafting stay connected</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  If the facts are still messy, move into the assistant first and come back with a cleaner timeline.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.56fr_0.44fr]">
          <div className="space-y-6">
            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">Choose a draft type</CardTitle>
                <CardDescription>Pick the workflow that best matches the user&apos;s legal task.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {documentTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setTemplateId(template.id)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      template.id === templateId
                        ? "border-emerald-400/70 bg-emerald-50"
                        : "border-white/80 bg-white/85 hover:border-amber-300 hover:bg-amber-50/70"
                    }`}
                  >
                    <p className="text-lg font-semibold text-foreground">{template.name}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{template.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.fields.slice(0, 3).map((field) => (
                        <Badge key={field.id} variant="outline">
                          {field.label}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">{activeTemplate?.name ?? "Draft details"}</CardTitle>
                <CardDescription>{activeTemplate?.purpose ?? "Provide the details required for drafting."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeTemplate ? (
                  <div className="rounded-3xl border border-white/80 bg-white/85 p-5">
                    <p className="text-sm font-semibold text-foreground">Prompt guardrails</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeTemplate.draftingNotes}</p>
                  </div>
                ) : null}

                <div className="grid gap-5">
                  {activeTemplate?.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.label}
                        {field.required ? " *" : ""}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.id}
                          value={values[field.id] ?? ""}
                          onChange={(event) => updateValue(field.id, event.target.value)}
                          placeholder={field.placeholder}
                          className="min-h-[120px]"
                        />
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type}
                          value={values[field.id] ?? ""}
                          onChange={(event) => updateValue(field.id, event.target.value)}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button className="w-full" onClick={handleGenerate} disabled={isLoading || !activeTemplate}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Generate draft
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      downloadJsonFile(
                        `justiceally-draft-${activeTemplate?.id ?? "template"}.json`,
                        exportPayload,
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">Generated document</CardTitle>
                <CardDescription>
                  {artifactId ? `Saved as ${artifactId}` : "A saved draft will appear here after generation."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentText ? (
                  <>
                    <div className="rounded-3xl border border-white/80 bg-white/85 p-5">
                      <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">{documentText}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" onClick={handleCopy}>
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? "Copied" : "Copy draft"}
                      </Button>
                      <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download text
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Choose a template, complete the factual fields, and generate the first pass of the document here.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Scale className="h-5 w-5 text-primary" />
                  Drafting handoff
                </CardTitle>
                <CardDescription>Use the assistant first if you need help organizing the matter before drafting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>The generator performs best when names, dates, places, and chronology are already settled.</p>
                <p>If facts are incomplete or emotionally tangled, use the legal assistant to produce a cleaner timeline and evidence list first.</p>
                <Button asChild className="w-full justify-between">
                  <Link
                    href={`/tools/legal-assistant?issue=general&urgency=normal&prompt=${encodeURIComponent(
                      `Help me prepare the facts and evidence checklist for a ${activeTemplate?.name ?? "legal draft"} before I generate it.`,
                    )}`}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Open assistant with drafting context
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-xl">Guardrails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>The model is instructed to stay factual, chronological, and formal without hallucinating authorities or procedural certainty.</p>
                <p>Missing facts should remain visible as blanks or placeholders, not be silently invented by the generator.</p>
                <p>Before submission, users should still verify names, dates, addresses, annexures, and local filing requirements.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
