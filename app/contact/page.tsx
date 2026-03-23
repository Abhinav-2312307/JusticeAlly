import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <main className="page-section">
      <div className="container-shell grid gap-6 lg:grid-cols-2">
        <Card className="glass-panel border-white/70">
          <CardHeader>
            <CardTitle className="text-5xl">Contact and escalation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              JusticeAlly is product infrastructure, not a law chamber. If you need product support, use the repository, deployment,
              or workspace admin channels attached to your implementation.
            </p>
            <p>
              If the issue is urgent and involves safety, fraud, detention, or abuse, use the emergency channels and public resource
              directory first rather than waiting for a platform response.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/70">
          <CardHeader>
            <CardTitle className="text-3xl">Useful next steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/resources/directory">Open legal aid directory</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/emergency">Open emergency page</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/workspace">Go to workspace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
