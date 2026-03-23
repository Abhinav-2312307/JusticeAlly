import fs from "node:fs/promises"
import path from "node:path"
import Link from "next/link"
import { ArrowRight, ExternalLink, FileText, FolderOpen, Sparkles } from "lucide-react"
import RightsList from "@/components/know-your-rights/rights-list"
import { Button } from "@/components/ui/button"
import { LegalLibraryBrowser } from "@/components/legal/legal-library-browser"
import { legalDocuments } from "@/lib/legal/library"
import { getAllRights } from "@/lib/rights"

interface BundledPdfFile {
  fileName: string
  title: string
  url: string
  rightId: string | null
}

const legacyRightAliases: Record<string, string> = {
  "/assets/pdfs/domestic-violence-act.pdf": "domestic-violence-act",
  "/assets/pdfs/information-technology-act.pdf": "information-technology-act",
  "/assets/pdfs/minimum-wages-act.pdf": "minimum-wages-act",
  "/assets/pdfs/right-against-exploitation.pdf": "right-against-exploitation",
  "/assets/pdfs/right-to-constitutional-remedies.pdf": "right-to-constitutional-remedies",
  "/assets/pdfs/right-to-education.pdf": "right-to-education",
}

function formatPdfTitle(fileName: string) {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function buildPdfPrompt(title: string) {
  return `Help me understand the legal source file titled ${title}. Explain what protections or duties it contains, what records a person should preserve, and what practical next steps usually follow.`
}

async function getBundledPdfFiles(): Promise<BundledPdfFile[]> {
  const pdfDirectory = path.join(process.cwd(), "public", "assets", "pdfs")
  const entries = await fs.readdir(pdfDirectory)
  const rights = getAllRights()
  const directRightMap = new Map(rights.filter((right) => right.pdfUrl).map((right) => [right.pdfUrl!, right.id]))

  return entries
    .filter((entry) => entry.toLowerCase().endsWith(".pdf"))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const url = `/assets/pdfs/${fileName}`
      return {
        fileName,
        title: formatPdfTitle(fileName),
        url,
        rightId: directRightMap.get(url) ?? legacyRightAliases[url] ?? null,
      }
    })
}

export default async function LegalLibraryPage() {
  const rightsWithPdf = getAllRights().filter((right) => right.pdfUrl)
  const bundledPdfFiles = await getBundledPdfFiles()

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Public resource</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">Search the legal knowledge base.</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            Browse the same corpus that powers the assistant retrieval layer. This is general legal information intended for
            Indian users and is not a substitute for fact-specific legal advice.
          </p>
        </div>
        <LegalLibraryBrowser documents={legalDocuments} />

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Rights Library</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-5xl">
                Read curated rights pages with their attached source PDFs.
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Each entry below links to the actual PDF-backed file and a prefilled AI explanation flow, so users can read
                the source and ask grounded follow-up questions in one place.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/resources/know-your-rights/rights">
                <ArrowRight className="mr-2 h-4 w-4" />
                Open full rights hub
              </Link>
            </Button>
          </div>

          <RightsList rights={rightsWithPdf} />
        </section>

        <section className="space-y-5">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Source Files</p>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-5xl">
              All bundled PDF files currently available in the project.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              This archive reads directly from <code>public/assets/pdfs</code>, so older files that existed in the folder are
              visible again even if they were not part of the earlier curated cards.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bundledPdfFiles.map((file) => (
              <article key={file.url} className="glass-panel border-white/70 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">PDF source</p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">{file.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{file.fileName}</p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/80 p-2 text-primary">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {file.rightId ? (
                    <Button asChild>
                      <Link href={`/resources/know-your-rights/pdf/${file.rightId}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Read with AI help
                      </Link>
                    </Button>
                  ) : null}

                  <Button asChild variant="outline">
                    <a href={file.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open PDF
                    </a>
                  </Button>

                  <Button asChild variant="ghost">
                    <Link href={`/tools/legal-assistant?prompt=${encodeURIComponent(buildPdfPrompt(file.title))}`}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Ask AI
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
