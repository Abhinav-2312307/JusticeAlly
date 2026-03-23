"use client"

import { useMemo, useRef, useState } from "react"
import {
  Download,
  FileText,
  Loader2,
  MessageSquareQuote,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { extractDocumentText, getDocumentExtractionMessage } from "@/lib/documents/client"

interface AttachedDocument {
  id: string
  name: string
  type: string
  size: number
  text: string
  source: "upload" | "paste"
}

interface DocumentChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  kind: "intro" | "summary" | "chat"
}

const quickQuestions = [
  "Summarize the key obligations and deadlines in these documents.",
  "What facts, dates, and missing records should I verify before taking action?",
  "What should I preserve as evidence based on these documents?",
  "Does anything here suggest urgent legal or safety risk?",
]

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createIntroMessage(): DocumentChatMessage {
  return {
    id: createId("doc-msg"),
    role: "assistant",
    kind: "intro",
    content:
      "Attach legal documents or paste official text, then generate a plain-language brief or ask follow-up questions. I will stay grounded in the document text and explicitly say when something is unclear.",
  }
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

export function DocumentSimplifierWorkspace() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("JusticeAlly document session")
  const [text, setText] = useState("")
  const [question, setQuestion] = useState("")
  const [artifactId, setArtifactId] = useState("")
  const [documents, setDocuments] = useState<AttachedDocument[]>([])
  const [messages, setMessages] = useState<DocumentChatMessage[]>([createIntroMessage()])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const workingDocuments = useMemo<AttachedDocument[]>(() => {
    if (documents.length > 0) {
      return documents
    }

    if (text.trim().length >= 20) {
      return [
        {
          id: "pasted-draft",
          name: title.trim() || "Pasted legal text",
          type: "text/plain",
          size: text.trim().length,
          text: text.trim(),
          source: "paste",
        },
      ]
    }

    return []
  }, [documents, text, title])

  const latestAssistantMessage = useMemo(() => {
    return [...messages].reverse().find((message) => message.role === "assistant" && message.kind !== "intro") ?? null
  }, [messages])

  const exportPayload = useMemo(() => {
    return {
      exportedAt: new Date().toISOString(),
      title,
      artifactId: artifactId || null,
      documents: workingDocuments,
      messages,
    }
  }, [artifactId, messages, title, workingDocuments])

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? [])

    if (files.length === 0) {
      return
    }

    setIsExtracting(true)

    try {
      const extractedDocuments: AttachedDocument[] = []
      const failedFiles: string[] = []

      for (const file of files) {
        try {
          const extractedText = (await extractDocumentText(file)).trim()

          if (!extractedText) {
            toast({
              title: `Limited extraction for ${file.name}`,
              description: getDocumentExtractionMessage(file.name),
            })
            continue
          }

          extractedDocuments.push({
            id: createId("doc"),
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            text: extractedText,
            source: "upload",
          })
        } catch (error) {
          failedFiles.push(
            `${file.name}: ${error instanceof Error ? error.message : "The file could not be read on the server."}`,
          )
        }
      }

      if (extractedDocuments.length > 0) {
        setDocuments((current) => [...extractedDocuments, ...current].slice(0, 8))
        setMessages((current) => [
          ...current,
          {
            id: createId("doc-msg"),
            role: "assistant",
            kind: "chat",
            content: `Loaded ${extractedDocuments.length} document${extractedDocuments.length > 1 ? "s" : ""}. You can now generate a brief or ask follow-up questions.`,
          },
        ])
      }

      if (failedFiles.length > 0) {
        toast({
          title: failedFiles.length === 1 ? "Could not read this file" : "Could not read some files",
          description:
            failedFiles.length === 1
              ? failedFiles[0]
              : `${failedFiles[0]} (+${failedFiles.length - 1} more file${failedFiles.length > 2 ? "s" : ""})`,
          variant: "destructive",
        })
      }
    } finally {
      setIsExtracting(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  async function handleSummarize() {
    const combinedText = workingDocuments
      .map((document) => `Document: ${document.name}\n${document.text}`)
      .join("\n\n---\n\n")
      .slice(0, 60000)

    if (combinedText.trim().length < 20) {
      toast({
        title: "Add documents or paste text first",
        description: "Upload a PDF, DOCX, text file, or paste legal content before generating a brief.",
        variant: "destructive",
      })
      return
    }

    setIsSummarizing(true)

    try {
      const response = await fetch("/api/simplify-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          text: combinedText,
        }),
      })

      const data = (await response.json()) as { simplifiedText?: string; artifactId?: string; error?: string }

      if (!response.ok || !data.simplifiedText) {
        throw new Error(data.error ?? "Could not simplify this document.")
      }

      setArtifactId(data.artifactId ?? "")
      setMessages((current) => [
        ...current,
        {
          id: createId("doc-msg"),
          role: "assistant",
          kind: "summary",
          content: data.simplifiedText ?? "",
        },
      ])
    } catch (error) {
      toast({
        title: "Simplification failed",
        description: error instanceof Error ? error.message : "Try again with a shorter or cleaner document.",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  async function handleAsk(customQuestion?: string) {
    const prompt = (customQuestion ?? question).trim()

    if (workingDocuments.length === 0) {
      toast({
        title: "Add a document first",
        description: "Upload documents or paste legal text before starting the chat.",
        variant: "destructive",
      })
      return
    }

    if (!prompt) {
      toast({
        title: "Ask a question",
        description: "Write a follow-up question about the attached documents.",
        variant: "destructive",
      })
      return
    }

    const userMessage: DocumentChatMessage = {
      id: createId("doc-msg"),
      role: "user",
      kind: "chat",
      content: prompt,
    }

    setMessages((current) => [...current, userMessage])
    setQuestion("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/document-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          question: prompt,
          documents: workingDocuments.map((document) => ({
            id: document.id,
            name: document.name,
            type: document.type,
            text: document.text,
          })),
          history: messages.filter((message) => message.kind !== "intro").map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      })

      const data = (await response.json()) as { answer?: string; error?: string }

      if (!response.ok || !data.answer) {
        throw new Error(data.error ?? "Could not analyze the documents.")
      }

      setMessages((current) => [
        ...current,
        {
          id: createId("doc-msg"),
          role: "assistant",
          kind: "chat",
          content: data.answer ?? "",
        },
      ])
    } catch (error) {
      toast({
        title: "Document chat failed",
        description: error instanceof Error ? error.message : "Try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsChatLoading(false)
    }
  }

  function removeDocument(documentId: string) {
    setDocuments((current) => current.filter((document) => document.id !== documentId))
  }

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <section className="glass-panel overflow-hidden border-white/70 bg-[linear-gradient(135deg,rgba(28,62,80,0.98),rgba(22,31,56,0.96))] p-8 text-white md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80">
                <Sparkles className="h-4 w-4" />
                Document chat for legal files
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
                Upload legal documents, generate a clear brief, then keep asking questions.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                This workspace supports PDF, DOCX, text, JSON, and markdown inputs. It can produce a saved plain-language
                summary and continue with grounded follow-up answers like a document-aware legal copilot.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  Multi-file upload
                </Badge>
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  Summary + follow-up chat
                </Badge>
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  JSON transcript export
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Grounding</p>
                <p className="mt-3 text-lg font-semibold">Document text first</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Answers stay tied to what the uploaded or pasted documents actually show.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Output</p>
                <p className="mt-3 text-lg font-semibold">Readable brief and action points</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Generate a summary first, then ask about deadlines, risks, missing records, and next steps.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Export</p>
                <p className="mt-3 text-lg font-semibold">Share the session safely</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Download the document list and transcript as JSON for reuse or escalation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">Documents</CardTitle>
                <CardDescription>Attach case files or paste official text into this session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Session title</p>
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Rent notice and follow-up chat" />
                </div>

                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload files</TabsTrigger>
                    <TabsTrigger value="paste">Paste text</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-5 space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt,.md,.json,.docx,.doc"
                      multiple
                      className="hidden"
                      onChange={(event) => void handleFiles(event.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white/80 px-6 text-center transition hover:border-amber-300 hover:bg-amber-50/60"
                    >
                      {isExtracting ? (
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      ) : (
                        <UploadCloud className="h-10 w-10 text-primary" />
                      )}
                      <p className="mt-4 text-base font-medium text-foreground">Attach PDFs, DOCX files, or text records</p>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Files are parsed locally first so the chat can work directly with extracted document text.
                      </p>
                    </button>
                  </TabsContent>

                  <TabsContent value="paste" className="mt-5 space-y-4">
                    <Textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      className="min-h-[260px]"
                      placeholder="Paste the legal notice, contract text, FIR extract, court order, RTI reply, or any official document text here."
                    />
                    <p className="text-sm leading-6 text-muted-foreground">
                      Pasted text will be used as the active source document if you do not upload files.
                    </p>
                  </TabsContent>
                </Tabs>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button onClick={handleSummarize} disabled={isSummarizing || isExtracting || workingDocuments.length === 0}>
                    {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Generate legal brief
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadJsonFile(`justiceally-document-chat-${title || "session"}.json`, exportPayload)}
                    disabled={workingDocuments.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Attached sources</p>
                    <Badge variant="outline">{workingDocuments.length} active</Badge>
                  </div>

                  {workingDocuments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No active documents yet. Upload files or paste text to start.</p>
                  ) : (
                    workingDocuments.map((document) => (
                      <div key={document.id} className="rounded-2xl border border-white/80 bg-white/85 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{document.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {document.source} · {Math.max(1, Math.round(document.size / 1024))} KB
                            </p>
                          </div>
                          {document.id !== "pasted-draft" ? (
                            <Button type="button" variant="ghost" className="h-8 px-2" onClick={() => removeDocument(document.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </div>
                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{document.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-panel border-white/70">
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-2xl">Document chat</CardTitle>
                  <CardDescription>
                    {artifactId ? `Latest brief saved as ${artifactId}. Continue asking follow-up questions below.` : "Generate a brief or ask follow-up questions grounded in the attached documents."}
                  </CardDescription>
                </div>
                <Badge variant="outline">{workingDocuments.length} docs</Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScrollArea className="h-[640px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-[28px] border p-5 ${
                          message.role === "assistant"
                            ? "border-white/80 bg-white/85"
                            : "ml-auto border-sky-900/10 bg-sky-950 text-white"
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                          {message.role === "assistant" ? (
                            <>
                              <Sparkles className="h-4 w-4" />
                              JusticeAlly
                            </>
                          ) : (
                            <>
                              <MessageSquareQuote className="h-4 w-4" />
                              You
                            </>
                          )}
                        </div>
                        <p
                          className={`whitespace-pre-line text-sm leading-7 ${
                            message.role === "assistant" ? "text-foreground/85" : "text-white/92"
                          }`}
                        >
                          {message.content}
                        </p>
                      </div>
                    ))}

                    {(isSummarizing || isChatLoading) ? (
                      <div className="rounded-[28px] border border-white/80 bg-white/85 p-5">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isSummarizing ? "Generating plain-language legal brief..." : "Analyzing the attached documents..."}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </ScrollArea>

                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {quickQuestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => void handleAsk(item)}
                      className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-left text-sm leading-6 text-foreground/80 transition hover:border-sky-300 hover:bg-sky-50"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <Separator />

                <div className="rounded-[28px] border border-white/80 bg-white/88 p-4">
                  <Textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about deadlines, evidence, missing facts, legal risk, or what the document appears to require."
                    className="min-h-[160px] resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        void handleAsk()
                      }
                    }}
                  />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Shift+Enter for a new line. Enter to send.
                    </p>
                    <Button onClick={() => void handleAsk()} disabled={isChatLoading || !question.trim() || workingDocuments.length === 0}>
                      {isChatLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Ask about documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-xl">How this mode behaves</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>The summary action creates a readable brief and saves it as a workspace artifact using the existing simplifier flow.</p>
                <p>The chat mode answers follow-up questions from the attached document text and clearly flags what the documents do not show.</p>
                <p>For filings, deadlines, or fact disputes with real legal consequences, the output should still be reviewed by a licensed lawyer or relevant authority.</p>
              </CardContent>
            </Card>

            {latestAssistantMessage ? (
              <Card className="glass-panel border-white/70">
                <CardHeader>
                  <CardTitle className="text-xl">Latest output</CardTitle>
                  <CardDescription>Quick access to the most recent assistant response in this document session.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                    <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">{latestAssistantMessage.content}</p>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
