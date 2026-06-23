import Link from "next/link"
import {
  ArrowRight,
  Banknote,
  BookOpenText,
  CheckCircle2,
  FileSearch,
  FileText,
  Languages,
  ListChecks,
  MessageSquareText,
  PenLine,
  Route,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOptionalSessionUser } from "@/lib/auth"
import { HeroSection } from "@/components/hero-section"

export default async function HomePage() {
  const [user] = await Promise.all([getOptionalSessionUser()])

  const featureCards = [
    {
      title: "AI Lawyer",
      description: "Ask legal questions in plain language and get source-backed guidance tailored to your situation.",
      href: "/tools/legal-assistant",
      cta: "Open assistant",
      icon: MessageSquareText,
    },
    {
      title: "Document Chat",
      description: "Upload notices, agreements, FIRs, or contracts and understand them in seconds.",
      href: "/tools/document-simplifier",
      cta: "Analyze documents",
      icon: FileText,
    },
    {
      title: "Draft Studio",
      description: "Generate legal notices, complaints, applications, and formal documents with AI assistance.",
      href: "/tools/document-generator",
      cta: "Generate draft",
      icon: PenLine,
    },
    {
      title: "Rights Library",
      description: "Explore rights, remedies, and source-backed legal resources before deciding your next step.",
      href: "/resources/legal-library",
      cta: "Browse library",
      icon: BookOpenText,
    },
  ]

  const comparisonCards = {
    others: [
      { label: "Complex Legal Language", icon: Languages },
      { label: "Expensive Consultations", icon: Banknote },
      { label: "Long Documents", icon: FileText },
      { label: "Unclear Next Steps", icon: Route },
    ],
    justiceAlly: [
      { label: "Simple Explanations", icon: MessageSquareText },
      { label: "Accessible Guidance", icon: CheckCircle2 },
      { label: "Instant Document Insights", icon: FileSearch },
      { label: "Actionable Recommendations", icon: ListChecks },
    ],
  }

  return (
    <main className="space-y-14 pb-14 md:space-y-20 md:pb-20">
      <HeroSection isSignedIn={!!user} />

      <section className="page-section overflow-hidden py-0">
        <div className="container-shell max-w-full">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">From confusion to clarity</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              Tell us what's happening. We'll tell you what to do next.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon

              return (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border border-primary/20 bg-[#fffaf0] shadow-[0_12px_40px_rgba(30,61,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-200/35 blur-2xl transition duration-300 group-hover:bg-primary/18" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(45,90,61,0.08),transparent_32%)] opacity-80" />
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-[#edf7ed] text-primary shadow-inner">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground/70">
                        0{index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="min-h-24 text-[15px] leading-7">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full justify-between rounded-2xl">
                      <Link href={feature.href}>
                        {feature.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1f5a3b] py-14 text-white md:py-18">
        <div className="pointer-events-none absolute -left-24 top-6 h-72 w-72 rounded-full bg-emerald-200/16 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-100/18 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-45" />
        <div className="container-shell relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-50/75">The purpose</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
              Why JusticeAlly exists
            </h2>
            <div className="mx-auto mt-6 max-w-4xl space-y-5 text-base leading-8 text-emerald-50/86 md:text-lg">
              <p>
                Legal information is often difficult to understand, expensive to access, and overwhelming to navigate. For many individuals, especially those from underprivileged, rural, and less educated communities, professional legal consultation remains out of reach due to financial, language, and accessibility barriers. As a result, countless people are unable to fully understand their rights, legal options, or the steps they can take when faced with a legal challenge.
              </p>
              <p>
                JusticeAlly exists to bridge this gap by making legal guidance simpler, more accessible, and actionable for everyone. Through AI-powered assistance, document intelligence, and rights awareness, we aim to empower every individual with the knowledge and confidence needed to make informed decisions and seek justice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section overflow-hidden py-0">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">The difference</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              From legal confusion to legal clarity
            </h2>
          </div>

          <div className="relative mx-auto mt-8 grid w-full max-w-5xl gap-5 lg:grid-cols-2">
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-primary/20 bg-[#fffaf0] px-4 py-2 text-xs font-bold tracking-[0.24em] text-primary shadow-[0_16px_40px_rgba(30,61,43,0.16)] lg:block">
              VS
            </div>

            <div className="group relative min-w-0 overflow-hidden rounded-[10%] border border-[#d7a765]/35 bg-[#173b29] p-5 text-[#fff7ea] shadow-[0_24px_70px_rgba(23,59,41,0.22)] transition duration-300 hover:-translate-y-2 hover:rotate-[-0.4deg] hover:border-[#d7a765]/65 hover:bg-[#1f4d36] hover:shadow-2xl hover:shadow-primary/18 md:p-7">
              <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[#d7a765]/35 blur-2xl transition duration-300 group-hover:scale-125" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/12 blur-2xl transition duration-300 group-hover:scale-125" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d7a765]/80 to-transparent" />
              <div className="relative flex items-center gap-3 border-b border-[#d7a765]/25 pb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[35%] bg-[#f3dfbf] text-[#6b4529] ring-1 ring-[#d7a765]/70 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-[#f8e7c9]">
                  <XCircle className="h-5 w-5" />
                </span>
                <h3 className="font-display text-3xl font-semibold">Others</h3>
              </div>
              <div className="relative mt-6 grid gap-3">
                {comparisonCards.others.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-[10%] border border-[#ead4b4] bg-[#fffaf0] px-4 py-3 text-sm font-medium text-[#3a241f] shadow-sm"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-[35%] bg-[#ead4b4] text-[#6b4529]">
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative min-w-0 overflow-hidden rounded-[10%] border border-[#d7a765]/35 bg-[#173b29] p-5 text-[#fff7ea] shadow-[0_24px_70px_rgba(23,59,41,0.24)] transition duration-300 hover:-translate-y-2 hover:rotate-[0.4deg] hover:border-[#d7a765]/65 hover:bg-[#1f4d36] hover:shadow-2xl hover:shadow-primary/20 md:p-7">
              <div className="pointer-events-none absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[#d7a765]/30 blur-2xl transition duration-300 group-hover:scale-125" />
              <div className="pointer-events-none absolute -bottom-8 right-0 h-28 w-28 rounded-full bg-white/12 blur-2xl transition duration-300 group-hover:scale-125" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d7a765]/80 to-transparent" />
              <div className="relative flex items-center gap-3 border-b border-[#d7a765]/25 pb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[35%] bg-[#f3dfbf] text-[#6b4529] ring-1 ring-[#d7a765]/70 transition duration-300 group-hover:rotate-8 group-hover:scale-110 group-hover:bg-[#f8e7c9]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h3 className="font-display text-3xl font-semibold">JusticeAlly</h3>
              </div>
              <div className="relative mt-6 grid gap-3">
                {comparisonCards.justiceAlly.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-[10%] border border-[#ead4b4] bg-[#fffaf0] px-4 py-3 text-sm font-medium text-[#24513a] shadow-sm"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-[35%] bg-[#ead4b4] text-[#6b4529]">
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
