import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, FileText, Sparkles } from "lucide-react"
import PdfViewer from "@/components/know-your-rights/pdf-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllRights, getRightById } from "@/lib/rights"

interface PdfPageProps {
  params: Promise<{
    id: string
  }>
}

function buildPrompt(title: string) {
  return `I am reading the source document for ${title}. Explain it in simple language, what protections it gives, what a person should preserve as evidence, and what doubts people commonly have.`
}

export default async function PdfPage({ params }: PdfPageProps) {
  const { id } = await params
  const right = getRightById(id)

  if (!right || !right.pdfUrl) {
    notFound()
  }

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Know Your Rights</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">{right.title}</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            Read the source file directly, then use the assistant if you want a simple explanation, practical meaning, or help with doubts.
          </p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <PdfViewer
            pdfUrl={right.pdfUrl}
            title={right.title}
            publicationDate={right.publicationDate}
            officialSource={right.officialSource}
            lastAmended={right.lastAmended}
          />

          <div className="space-y-6">
            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">Need help understanding this?</CardTitle>
                <CardDescription>Open the assistant with this right already framed in the prompt.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>The assistant can explain the right in plain language, identify common violations, and suggest what evidence a person should preserve.</p>
                <Button asChild className="w-full justify-between">
                  <Link href={`/tools/legal-assistant?prompt=${encodeURIComponent(buildPrompt(right.title))}`}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ask AI about this right
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">About this file</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>{right.description}</p>
                {right.content ? <p>{right.content}</p> : null}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild variant="outline">
                    <Link href={`/resources/know-your-rights/rights/${encodeURIComponent(right.category)}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      More in this category
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/resources/know-your-rights">
                      Back to rights hub
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

export function generateStaticParams() {
  return getAllRights()
    .filter((right) => right.pdfUrl)
    .map((right) => ({
      id: right.id,
    }))
}
