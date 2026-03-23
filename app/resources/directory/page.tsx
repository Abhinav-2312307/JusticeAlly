import { DirectoryBrowser } from "@/components/legal/directory-browser"
import { legalAidResources } from "@/lib/legal/library"

export default function DirectoryPage() {
  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Public resource</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">Legal aid and emergency directory.</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            A curated set of common support channels for emergencies, cybercrime, child protection, women’s safety, and legal aid discovery.
          </p>
        </div>
        <DirectoryBrowser resources={legalAidResources} />
      </div>
    </main>
  )
}
