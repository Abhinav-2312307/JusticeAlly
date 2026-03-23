import RightsList from "@/components/know-your-rights/rights-list"
import { getAllRights } from "@/lib/rights"

export default function AllRightsPage() {
  const rights = getAllRights()

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Know Your Rights</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">All rights and public protections.</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            Browse the full rights library, open source files, and use the AI assistant to understand practical meaning and common doubts.
          </p>
        </div>

        <RightsList rights={rights} />
      </div>
    </main>
  )
}
