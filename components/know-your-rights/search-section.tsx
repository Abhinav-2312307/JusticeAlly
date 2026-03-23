"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Fuse from "fuse.js"
import { FileText, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllRights, type RightType } from "@/lib/rights"

function buildPrompt(right: RightType) {
  return `I am reading ${right.title}. Explain it in simple language, what protections it gives, and answer common doubts a person may have.`
}

export default function SearchSection() {
  const rights = useMemo(() => getAllRights(), [])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<RightType[]>([])
  const [fuse, setFuse] = useState<Fuse<RightType> | null>(null)

  useEffect(() => {
    setFuse(
      new Fuse(rights, {
        keys: ["title", "description", "category", "content"],
        threshold: 0.32,
      }),
    )
  }, [rights])

  useEffect(() => {
    if (fuse && searchTerm.trim()) {
      setSearchResults(fuse.search(searchTerm).map((result) => result.item))
      return
    }

    setSearchResults([])
  }, [searchTerm, fuse])

  return (
    <section className="glass-panel border-white/70 p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Search Rights</p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Search laws, protections, and public-rights documents.
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
          Search by right, law name, issue type, or keyword. Every result can open the file or launch an AI explanation.
        </p>
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search for rights, acts, wages, harassment, RTI, cybercrime..."
          className="pl-10"
        />
      </div>

      {searchTerm.trim() ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm font-medium text-foreground">
            {searchResults.length === 0
              ? "No matching rights found."
              : `Found ${searchResults.length} result${searchResults.length === 1 ? "" : "s"}.`}
          </p>

          <div className="grid gap-4">
            {searchResults.map((right) => (
              <div key={right.id} className="rounded-3xl border border-white/80 bg-white/85 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{right.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">{right.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{right.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/tools/legal-assistant?prompt=${encodeURIComponent(buildPrompt(right))}`}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ask AI
                      </Link>
                    </Button>
                    {right.pdfUrl ? (
                      <Button asChild>
                        <Link href={`/resources/know-your-rights/pdf/${right.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Read file
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
