import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <main className="page-section">
      <div className="container-shell">
        <Card className="glass-panel border-white/70">
          <CardHeader>
            <CardTitle className="text-5xl">Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              JusticeAlly stores account and workspace data in Firebase when that integration is configured. That can include email
              identity, conversation summaries, generated documents, and other artifacts created by the user inside the platform.
            </p>
            <p>
              The platform is designed so the operator can swap in their own Firebase project and environment secrets. The legal
              sensitivity of stored data means production deployments should use least-privilege access, secure hosting, and proper
              retention decisions before real users are onboarded.
            </p>
            <p>
              The implementation in this repository is a product foundation. Final privacy disclosures should be reviewed and tailored
              to the exact deployment, storage practices, and jurisdictional obligations of the operating entity.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
