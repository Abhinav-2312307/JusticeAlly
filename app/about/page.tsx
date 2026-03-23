import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="page-section">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <Card className="glass-panel border-white/70">
          <CardHeader>
            <CardTitle className="text-5xl">About JusticeAlly</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              JusticeAlly is being rebuilt as a full-stack legal guidance platform for Indian users. The goal is not to imitate a
              law firm site. The goal is to help a user move from panic and vague questions to a structured understanding of rights,
              evidence, next steps, and first-pass legal documents.
            </p>
            <p>
              The platform combines Gemini generation, retrieval against a curated legal corpus, Firebase authentication, Firestore
              persistence, and document workflows. That means user sessions, generated outputs, and knowledge retrieval can all live in
              the same product instead of across disconnected tools.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/70">
          <CardHeader>
            <CardTitle className="text-3xl">Principles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Ground answers in retrieved legal context.</p>
            <p>Stay clear about the difference between legal information and legal representation.</p>
            <p>Make first-step workflows usable for non-lawyers.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
