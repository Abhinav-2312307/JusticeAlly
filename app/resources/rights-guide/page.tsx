import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const guides = [
  {
    title: "If wages are delayed",
    steps: [
      "Collect salary slips, bank statements, attendance records, and the appointment letter.",
      "Send a written demand that states the unpaid period and amount.",
      "Preserve all employer replies and escalation emails.",
    ],
  },
  {
    title: "If a landlord pressures you to leave",
    steps: [
      "Keep the rent agreement, receipts, chats, and notice copies together.",
      "Ask for every demand in writing and avoid undocumented cash settlements.",
      "Take local legal advice because rent law and police practice vary by state.",
    ],
  },
  {
    title: "If you face online harassment or extortion",
    steps: [
      "Preserve screenshots, links, transaction references, and timestamps.",
      "Report the account on-platform and preserve proof of the report.",
      "Use cybercrime channels quickly if money, identity documents, or threats are involved.",
    ],
  },
]

export default function RightsGuidePage() {
  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Public resource</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">First-step rights guide.</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            Quick practical checklists for common legal trouble points. These are intended to help a user organize facts before
            talking to the assistant or a licensed lawyer.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {guides.map((guide) => (
            <Card key={guide.title} className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-3xl">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3 text-sm leading-7 text-muted-foreground">
                  {guide.steps.map((step, index) => (
                    <li key={step}>
                      {index + 1}. {step}
                    </li>
                  ))}
                </ol>
                <Button asChild variant="outline">
                  <Link href={`/tools/legal-assistant?prompt=${encodeURIComponent(`Guide me through the next legal steps for this situation: ${guide.title}.`)}`}>
                    Ask AI about this scenario
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
