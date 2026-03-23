"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { LegalAidResource } from "@/lib/legal/library"

interface DirectoryBrowserProps {
  resources: LegalAidResource[]
}

function buildResourcePrompt(resource: LegalAidResource) {
  return `I may need help from ${resource.name}. Explain when to use this resource, what information I should keep ready, and what legal steps I should take in parallel.`
}

export function DirectoryBrowser({ resources }: DirectoryBrowserProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")

  const categories = useMemo(() => ["All", ...new Set(resources.map((resource) => resource.category))], [resources])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return resources.filter((resource) => {
      const categoryMatch = category === "All" || resource.category === category
      const queryMatch =
        normalizedQuery.length === 0 ||
        `${resource.name} ${resource.category} ${resource.coverage} ${resource.notes} ${resource.contactValue}`
          .toLowerCase()
          .includes(normalizedQuery)

      return categoryMatch && queryMatch
    })
  }, [category, query, resources])

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by issue type, helpline, or service name"
          />
          <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-muted-foreground">
            {filtered.length} resource{filtered.length === 1 ? "" : "s"} found
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <Button key={item} variant={item === category ? "default" : "outline"} onClick={() => setCategory(item)}>
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((resource) => (
          <article key={resource.id} className="glass-panel p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{resource.category}</p>
            <h3 className="mt-2 text-2xl font-semibold">{resource.name}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{resource.notes}</p>
            <div className="mt-5 rounded-3xl border border-white/80 bg-white/80 p-4 text-sm">
              <p className="font-medium text-foreground">{resource.contactLabel}</p>
              <p className="mt-1 text-muted-foreground">{resource.contactValue}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{resource.coverage}</p>
            </div>
            {resource.website ? (
              <Button className="mt-5" asChild>
                <Link href={resource.website} target="_blank" rel="noreferrer">
                  Open resource
                </Link>
              </Button>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href={`/tools/legal-assistant?prompt=${encodeURIComponent(buildResourcePrompt(resource))}`}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask AI how to use this
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/tools/legal-assistant">
                  Open assistant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        ))}

        {filtered.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-lg font-semibold text-foreground">No matching resources found.</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Try a broader keyword or use the legal assistant for guided help choosing the right channel.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
