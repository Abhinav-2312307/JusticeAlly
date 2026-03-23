import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const layers = [
  {
    title: "Frontend",
    description: "Next.js App Router pages for landing, auth, assistant, simplifier, document drafting, workspace, and public resources.",
  },
  {
    title: "Auth and persistence",
    description:
      "Firebase auth powers email, Google, and phone OTP flows. The server creates secure sessions, stores workspace data in Firestore, and saves uploaded files in Cloudinary.",
  },
  {
    title: "Retrieval and generation",
    description: "Gemini is used for embeddings and response generation. Retrieval uses a chunked legal corpus and source cards are returned with answers.",
  },
]

export default function ApiGuidePage() {
  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Architecture</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">How the rebuilt platform is wired.</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            This route documents the product architecture that now replaces the original v0-only demo implementation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {layers.map((layer) => (
            <Card key={layer.title} className="glass-panel border-white/70">
              <CardHeader>
                <CardTitle className="text-3xl">{layer.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{layer.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-panel border-white/70">
          <CardHeader>
            <CardTitle className="text-3xl">Core API routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>`POST /api/auth/session` creates an HTTP-only workspace session from a Firebase ID token.</p>
            <p>`POST /api/chat` retrieves legal context, builds a Gemini prompt, stores the result, and returns source cards.</p>
            <p>`POST /api/simplify-document` rewrites legal text into plain-language guidance and stores the output.</p>
            <p>`POST /api/documents/generate` creates a first-pass draft from structured template fields.</p>
            <p>`POST /api/documents/upload` stores a file in Cloudinary, saves metadata in Firestore, and runs AI analysis when text extraction is available.</p>
            <p>`PUT /api/user/profile` updates the intake profile used to keep recurring user context inside the workspace.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
