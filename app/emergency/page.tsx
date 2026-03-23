import Link from "next/link"
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { legalAidResources } from "@/lib/legal/library"

const emergencyScenarios = [
  {
    title: "Arrest or detention",
    description: "Record the police station, time, grounds communicated, and ask for access to counsel and family notification.",
  },
  {
    title: "Domestic violence",
    description: "Prioritize physical safety, move to a safer location if possible, preserve evidence, and seek medical help early.",
  },
  {
    title: "Cyber extortion or fraud",
    description: "Preserve screenshots, transaction references, and account details. Escalate quickly because digital evidence disappears fast.",
  },
]

export default function EmergencyPage() {
  const emergencyResources = legalAidResources.filter((resource) =>
    ["Emergency", "Women and safety", "Cybercrime", "Child protection"].includes(resource.category),
  )

  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <section className="glass-panel overflow-hidden bg-[linear-gradient(135deg,rgba(101,17,17,0.97),rgba(65,24,13,0.95))] p-8 text-white md:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80">
              <AlertTriangle className="h-4 w-4" />
              Emergency-first legal guidance
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-6xl">
              Use this page when the legal problem is also a safety problem.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
              If someone is in immediate danger, use emergency response channels first. JusticeAlly can help frame the next
              legal steps after the urgent risk is contained.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {emergencyScenarios.map((scenario) => (
            <Card key={scenario.title} className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-2xl">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{scenario.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.62fr_0.38fr]">
          <Card className="glass-panel border-white/70">
            <CardHeader>
              <CardTitle className="text-3xl">Emergency channels</CardTitle>
              <CardDescription>National and commonly used support routes for urgent incidents.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {emergencyResources.map((resource) => (
                <div key={resource.id} className="rounded-3xl border border-white/80 bg-white/80 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{resource.category}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{resource.name}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{resource.notes}</p>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    {resource.contactLabel}: {resource.contactValue}
                  </p>
                  {resource.website ? (
                    <Button variant="outline" asChild className="mt-4">
                      <Link href={resource.website} target="_blank" rel="noreferrer">
                        Open site
                      </Link>
                    </Button>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ShieldAlert className="h-5 w-5 text-primary" />
                After the immediate risk
              </CardTitle>
              <CardDescription>Use the assistant once you have stabilized the immediate situation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Write down the sequence of events while memory is fresh, preserve screenshots and call details, and keep any
                notices, bills, or police papers.
              </p>
              <p>
                Use the legal assistant for a structured next-step plan, or jump straight into drafting a complaint or notice once
                you have the facts in order.
              </p>
              <Button asChild>
                <Link
                  href={`/tools/legal-assistant?issue=general&urgency=emergency&prompt=${encodeURIComponent(
                    "I have an urgent legal safety situation. Help me organize immediate next steps, evidence preservation, and which authority or emergency channel to contact first.",
                  )}`}
                >
                  Go to legal assistant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
