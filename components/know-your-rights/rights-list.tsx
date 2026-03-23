import Link from "next/link"
import { ArrowRight, Building, Calendar, FileText, History, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { RightType } from "@/lib/rights"

interface RightsListProps {
  rights: RightType[]
}

function buildPrompt(right: RightType) {
  return `Help me understand ${right.title} in simple language. Explain what protections it gives, common violations, what evidence to preserve, and when I should escalate to a lawyer or authority.`
}

export default function RightsList({ rights }: RightsListProps) {
  return (
    <div className="grid gap-5">
      {rights.map((right) => (
        <article key={right.id} className="glass-panel overflow-hidden border-white/70">
          <div className="h-1.5 bg-[linear-gradient(90deg,rgba(20,92,76,0.95),rgba(180,139,74,0.95))]" />
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline">{right.category}</Badge>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">{right.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{right.description}</p>
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

            {right.content ? (
              <div className="mt-5 rounded-3xl border border-white/80 bg-white/85 p-5">
                <p className="text-sm leading-7 text-foreground/85">{right.content}</p>
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {right.publicationDate ? (
                <div className="rounded-2xl border border-white/80 bg-white/80 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Published
                  </div>
                  <p className="mt-2">{right.publicationDate}</p>
                </div>
              ) : null}

              {right.officialSource ? (
                <div className="rounded-2xl border border-white/80 bg-white/80 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Building className="h-4 w-4 text-primary" />
                    Source
                  </div>
                  <p className="mt-2">{right.officialSource}</p>
                </div>
              ) : null}

              {right.lastAmended ? (
                <div className="rounded-2xl border border-white/80 bg-white/80 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <History className="h-4 w-4 text-primary" />
                    Last amended
                  </div>
                  <p className="mt-2">{right.lastAmended}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="ghost" className="px-0">
                <Link href={`/resources/know-your-rights/rights/${encodeURIComponent(right.category)}`}>
                  More in {right.category}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
