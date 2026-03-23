import Link from "next/link"
import { documentTemplates } from "@/lib/legal/templates"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TemplatesPage() {
  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Public resource</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">Document templates and guided drafting.</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            JusticeAlly uses structured templates for first-pass legal complaints, notices, RTIs, and workplace reports.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {documentTemplates.map((template) => (
            <Card key={template.id} className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-3xl">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-7 text-muted-foreground">{template.draftingNotes}</p>
                <div className="flex flex-wrap gap-2">
                  {template.fields.map((field) => (
                    <span key={field.id} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-950">
                      {field.label}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={`/tools/document-generator?template=${encodeURIComponent(template.id)}`}>Open drafting workspace</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link
                      href={`/tools/legal-assistant?prompt=${encodeURIComponent(
                        `Help me prepare the facts and evidence checklist for a ${template.name}.`,
                      )}`}
                    >
                      Ask AI before drafting
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
