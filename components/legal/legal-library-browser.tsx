"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { LegalCorpusDocument } from "@/lib/rag/chunking"

interface LegalLibraryBrowserProps {
  documents: LegalCorpusDocument[]
}

function buildAssistantPrompt(document: LegalCorpusDocument) {
  return `Explain the key rights, practical next steps, and evidence checklist for ${document.title}. Focus on Indian users and keep the answer grounded in source-backed guidance.`
}

export function LegalLibraryBrowser({ documents }: LegalLibraryBrowserProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = useMemo(() => ["All", ...new Set(documents.map((document) => document.category))], [documents])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return documents.filter((document) => {
      const categoryMatch = activeCategory === "All" || document.category === activeCategory
      const textMatch =
        normalizedQuery.length === 0 ||
        `${document.title} ${document.summary} ${document.sourceTitle} ${document.tags.join(" ")} ${document.body}`
          .toLowerCase()
          .includes(normalizedQuery)

      return categoryMatch && textMatch
    })
  }, [activeCategory, documents, query])

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search legal topics, rights, laws, or issue types"
              className="pl-10"
            />
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} across {categories.length - 1} categories
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={category === activeCategory ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((document) => (
          <article key={document.id} className="glass-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{document.category}</p>
                <h3 className="mt-2 text-2xl font-semibold">{document.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{document.summary}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-xs uppercase tracking-[0.18em] text-primary">
                {document.jurisdiction}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {document.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-950">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-3xl border border-white/80 bg-white/80 p-5">
              <p className="text-sm leading-7 text-foreground/85">{document.body.split("\n\n")[0]}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{document.sourceTitle}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href={`/tools/legal-assistant?prompt=${encodeURIComponent(buildAssistantPrompt(document))}`}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ask AI
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/tools/legal-assistant">
                    Open assistant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-lg font-semibold text-foreground">No matching legal resources found.</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Try a broader search term, change the category, or open the assistant for a guided query.
            </p>
            <Button asChild className="mt-4">
              <Link href="/tools/legal-assistant">Open assistant</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
