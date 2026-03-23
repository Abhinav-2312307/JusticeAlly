import Link from "next/link"
import { ArrowRight, FileText, ShieldCheck, Sparkles } from "lucide-react"
import SearchSection from "@/components/know-your-rights/search-section"
import RightsList from "@/components/know-your-rights/rights-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getFeaturedRights, getRightCategories } from "@/lib/rights"

export default function KnowYourRightsPage() {
  const featuredRights = getFeaturedRights()
  const categories = getRightCategories()

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <section className="glass-panel overflow-hidden border-white/70 bg-[linear-gradient(135deg,rgba(16,73,88,0.98),rgba(29,59,30,0.95))] p-8 text-white md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80">
                <ShieldCheck className="h-4 w-4" />
                Know your rights
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
                Read the law, open the source files, and ask questions beside them.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                This section restores the dedicated rights library. Users can browse rights by category, open the actual
                PDF-backed files, and launch an AI explanation flow for any right they do not fully understand.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/tools/legal-assistant?prompt=Help me understand my rights in a legal situation and what evidence I should preserve first.">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ask rights assistant
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                >
                  <Link href="/resources/legal-library">Open legal library</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">What users can do</p>
                <p className="mt-3 text-lg font-semibold">Read the source files</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Open PDF-backed rights documents directly instead of losing them behind redirects.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">AI help</p>
                <p className="mt-3 text-lg font-semibold">Explain rights and doubts</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Launch a prefilled assistant prompt from each right to understand protections, violations, and next steps.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SearchSection />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Card key={category} className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-3xl">{category}</CardTitle>
                <CardDescription>Browse rights and source files in this category.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/resources/know-your-rights/rights/${encodeURIComponent(category)}`}>
                    Open category
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Featured Rights</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-5xl">Start with the most-used protections.</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/resources/know-your-rights/rights">
                <FileText className="mr-2 h-4 w-4" />
                View all rights
              </Link>
            </Button>
          </div>

          <RightsList rights={featuredRights} />
        </section>
      </div>
    </main>
  )
}
