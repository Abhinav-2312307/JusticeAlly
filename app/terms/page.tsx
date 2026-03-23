import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <main className="page-section">
      <div className="container-shell">
        <Card className="glass-panel border-white/70">
          <CardHeader>
            <CardTitle className="text-5xl">Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              JusticeAlly provides general legal information, document drafting assistance, and workflow tooling. It does not create an
              advocate-client relationship and does not replace case-specific advice from a licensed lawyer.
            </p>
            <p>
              Users are responsible for reviewing generated drafts, validating factual accuracy, and confirming legal fit before sending
              any complaint, notice, or application to an authority, employer, landlord, court, or third party.
            </p>
            <p>
              High-risk matters involving custody, detention, imminent deadlines, serious financial exposure, criminal accusations, or
              personal safety should be escalated to a qualified lawyer or emergency authority promptly.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
