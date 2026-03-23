"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  BookOpenText,
  Download,
  FileText,
  Loader2,
  MessageSquareQuote,
  Plus,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { ConversationMessage, ConversationSummary } from "@/lib/db"

interface AssistantSource {
  id: string
  title: string
  sourceTitle: string
  category?: string
  excerpt: string
  score?: number
}

interface AssistantMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: string
  sources?: AssistantSource[]
}

interface AssistantWorkspaceProps {
  initialConversations: ConversationSummary[]
  initialPrompt?: string
  initialIssueType?: string
  initialUrgency?: string
}

const suggestions = [
  "My landlord is threatening to evict me without written notice. What should I gather first?",
  "I need a step-by-step plan for unpaid salary and wage recovery.",
  "Help me understand whether this workplace harassment situation should go to HR or the Internal Committee.",
  "What should I do first if someone is blackmailing me online with private photos or chats?",
]

const issueTypes = [
  { value: "general", label: "General legal guidance" },
  { value: "housing", label: "Housing / tenancy" },
  { value: "employment", label: "Employment / wages" },
  { value: "police", label: "Police / detention" },
  { value: "cyber", label: "Cybercrime / privacy" },
  { value: "family", label: "Family / domestic violence" },
]

const urgencyLevels = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "emergency", label: "Emergency" },
]

function messageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function buildIntroMessage(initialPrompt?: string): AssistantMessage {
  return {
    id: messageId(),
    role: "assistant",
    content: initialPrompt
      ? "A legal issue from another page has been loaded into the composer. Review it, add missing facts, and send when ready."
      : "Describe the facts, timeline, people involved, documents you have, and the outcome you want. I’ll answer with retrieved legal context and practical next steps.",
  }
}

function deriveConversationTitle(input: string) {
  const title = input.replace(/\s+/g, " ").trim().slice(0, 72)
  return title.length > 52 ? `${title.slice(0, 52)}...` : title
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

function mapConversationMessages(messages: ConversationMessage[]): AssistantMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    sources: message.sources?.map((source) => ({
      id: source.id,
      title: source.title,
      sourceTitle: source.sourceTitle,
      category: source.sourceTitle,
      excerpt: source.excerpt,
    })),
  }))
}

function formatDate(value: string) {
  if (!value) {
    return "No recent update"
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function AssistantWorkspace({
  initialConversations,
  initialPrompt,
  initialIssueType = "general",
  initialUrgency = "normal",
}: AssistantWorkspaceProps) {
  const { toast } = useToast()
  const [query, setQuery] = useState(initialPrompt ?? "")
  const [issueType, setIssueType] = useState(initialIssueType)
  const [urgency, setUrgency] = useState(initialUrgency)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [threadList, setThreadList] = useState(initialConversations)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const [messages, setMessages] = useState<AssistantMessage[]>([buildIntroMessage(initialPrompt)])

  const latestAssistantSources = useMemo(() => {
    return [...messages].reverse().find((message) => message.role === "assistant" && message.sources?.length)?.sources ?? []
  }, [messages])

  const conversationExport = useMemo(() => {
    return {
      exportedAt: new Date().toISOString(),
      conversationId: conversationId ?? null,
      issueType,
      urgency,
      messages,
      sources: latestAssistantSources,
    }
  }, [conversationId, issueType, latestAssistantSources, messages, urgency])

  function startNewConversation() {
    setConversationId(undefined)
    setMessages([buildIntroMessage()])
    setQuery("")
  }

  async function loadConversation(targetConversationId: string) {
    setIsLoadingConversation(true)

    try {
      const response = await fetch(`/api/chat?conversationId=${encodeURIComponent(targetConversationId)}`)
      const data = (await response.json()) as { messages?: ConversationMessage[]; error?: string }

      if (!response.ok || !data.messages) {
        throw new Error(data.error ?? "Could not load this conversation.")
      }

      setConversationId(targetConversationId)
      setMessages(data.messages.length > 0 ? mapConversationMessages(data.messages) : [buildIntroMessage()])
    } catch (error) {
      toast({
        title: "Could not open the thread",
        description: error instanceof Error ? error.message : "Try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingConversation(false)
    }
  }

  async function sendMessage(messageText: string) {
    if (!messageText.trim()) {
      return
    }

    const trimmed = messageText.trim()
    const userMessage: AssistantMessage = {
      id: messageId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    }

    setMessages((current) => [...current, userMessage])
    setQuery("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmed,
          conversationId,
          issueType,
          urgency,
        }),
      })

      const data = (await response.json()) as {
        response?: string
        error?: string
        conversationId?: string
        sources?: AssistantSource[]
      }

      if (!response.ok || !data.response) {
        throw new Error(data.error ?? "Could not get a legal response.")
      }

      const nextConversationId = data.conversationId ?? conversationId
      const timestamp = new Date().toISOString()

      setConversationId(nextConversationId)
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          content: data.response ?? "",
          createdAt: timestamp,
          sources: data.sources ?? [],
        },
      ])

      if (nextConversationId) {
        setThreadList((current) => {
          const nextSummary: ConversationSummary = {
            id: nextConversationId,
            title: deriveConversationTitle(trimmed),
            issueType,
            urgency,
            preview: trimmed,
            createdAt: timestamp,
            updatedAt: timestamp,
          }

          const remaining = current.filter((thread) => thread.id !== nextConversationId)
          return [nextSummary, ...remaining].slice(0, 8)
        })
      }
    } catch (error) {
      toast({
        title: "Assistant request failed",
        description: error instanceof Error ? error.message : "Try again in a moment.",
        variant: "destructive",
      })
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          content:
            "I could not complete that request. Check your Gemini and Firebase setup if this is a fresh environment, then retry.",
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <section className="glass-panel overflow-hidden border-white/70 bg-[linear-gradient(135deg,rgba(19,70,56,0.98),rgba(38,27,16,0.92))] p-8 text-white md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80">
                <Scale className="h-4 w-4" />
                RAG-grounded AI legal guidance
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
                A cleaner legal assistant that stays close to sources and next steps.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                Use retrieved legal context for Indian law guidance, continue saved threads, and export the conversation
                when you need a structured case record.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  Gemini answers + legal retrieval
                </Badge>
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  Thread history
                </Badge>
                <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10" variant="outline">
                  JSON export
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Mode</p>
                <p className="mt-3 text-lg font-semibold">Grounded answers first</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Responses prioritize retrieved corpus material and explicitly flag uncertainty.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Best for</p>
                <p className="mt-3 text-lg font-semibold">Triage, evidence, and action plans</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Use it for first-step strategy, not for pretending the model has seen facts it has not.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">Output</p>
                <p className="mt-3 text-lg font-semibold">Structured legal guidance</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Situation summary, rights position, next steps, evidence checklist, and a grounding note.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="glass-panel border-white/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl">Threads</CardTitle>
                  <CardDescription>Continue a saved matter or start a new one.</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={startNewConversation}>
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {threadList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No saved threads yet. Send a message to create your first one.</p>
                ) : (
                  threadList.map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => void loadConversation(conversation.id)}
                      className={`w-full rounded-3xl border p-4 text-left transition ${
                        conversation.id === conversationId
                          ? "border-emerald-400/70 bg-emerald-50"
                          : "border-white/80 bg-white/85 hover:border-amber-300 hover:bg-amber-50/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-semibold text-foreground">{conversation.title}</p>
                        {conversation.urgency === "emergency" ? (
                          <Badge className="shrink-0 bg-red-700 text-white hover:bg-red-700">Emergency</Badge>
                        ) : null}
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{conversation.preview}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {conversation.issueType} · {formatDate(conversation.updatedAt)}
                      </p>
                    </button>
                  ))
                )}

                {isLoadingConversation ? (
                  <div className="rounded-2xl border border-white/80 bg-white/80 p-4 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Loading conversation...
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-xl">Matter framing</CardTitle>
                <CardDescription>Set the context before you send the next message.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Issue type</p>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Urgency</p>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-panel border-white/70">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">Conversation</CardTitle>
                    <CardDescription>
                      {conversationId ? "This thread is linked to your workspace account." : "Send the first message to create a saved thread."}
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => downloadJsonFile(`justiceally-assistant-${conversationId ?? "draft"}.json`, conversationExport)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Issue: {issueType}</Badge>
                  <Badge variant="outline">Urgency: {urgency}</Badge>
                  <Badge variant="outline">{conversationId ? "Saved thread" : "Unsaved draft"}</Badge>
                </div>
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
                            : "ml-auto border-emerald-900/10 bg-emerald-950 text-white"
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                          {message.role === "assistant" ? (
                            <>
                              <Scale className="h-4 w-4" />
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

                        {message.role === "assistant" && message.sources?.length ? (
                          <div className="mt-4 grid gap-3">
                            {message.sources.map((source) => (
                              <div key={source.id} className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-amber-950">{source.title}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-amber-800">
                                      {source.sourceTitle}
                                    </p>
                                  </div>
                                  {typeof source.score === "number" ? (
                                    <Badge className="border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-100" variant="outline">
                                      {Math.round(source.score * 100)}% match
                                    </Badge>
                                  ) : null}
                                </div>
                                <p className="mt-2 text-sm leading-6 text-amber-950/80">{source.excerpt}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}

                    {isLoading ? (
                      <div className="rounded-[28px] border border-white/80 bg-white/85 p-5">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Retrieving legal context and generating a grounded answer...
                        </div>
                      </div>
                    ) : null}
                  </div>
                </ScrollArea>

                <Separator />

                <div className="rounded-[28px] border border-white/80 bg-white/88 p-4">
                  <Textarea
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Describe the issue, timeline, people involved, notices you received, money at stake, evidence you have, and what outcome you want."
                    className="min-h-[180px] resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        void sendMessage(query)
                      }
                    }}
                  />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Shift+Enter for a new line. Enter to send.
                    </p>
                    <Button onClick={() => void sendMessage(query)} disabled={isLoading || !query.trim()}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Send to assistant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-xl">Starter prompts</CardTitle>
                <CardDescription>Use these for a quick check of the new assistant flow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-left text-sm leading-6 text-foreground/80 transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-xl">Latest retrieved sources</CardTitle>
                <CardDescription>These are the source cards attached to the latest assistant reply.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestAssistantSources.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sources retrieved yet. Send a question to populate this panel.</p>
                ) : (
                  latestAssistantSources.map((source) => (
                    <div key={source.id} className="rounded-2xl border border-white/80 bg-white/85 p-4">
                      <p className="text-sm font-semibold text-foreground">{source.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {source.category || source.sourceTitle}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.excerpt}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            </div>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-xl">Connected tools</CardTitle>
                <CardDescription>Move from guidance into drafting or document analysis without losing context.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-between">
                  <Link href="/tools/document-generator">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate FIR, RTI, and notice drafts
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href="/tools/document-simplifier">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Chat with legal documents
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href="/resources/legal-library">
                    <BookOpenText className="mr-2 h-4 w-4" />
                    Browse legal library
                  </Link>
                </Button>
                <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-950">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      The assistant is designed to stay grounded in retrieved material, but high-stakes filings and urgent
                      factual disputes should still be checked by a licensed advocate.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
