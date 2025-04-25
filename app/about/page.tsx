import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Scale, Code, Users, Shield, BookOpen, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">About JusticeAlly</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Making Indian laws and rights easy to understand for everyone
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg mb-6">
                JusticeAlly is a legal-tech platform dedicated to making Indian laws and rights easy to understand for
                everyone. Our mission is to bridge the gap between complex legal terms and everyday people, because we
                believe justice starts with awareness.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Vision & Values Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Our Vision & Values</h2>
          </div>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">We envision a world where:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Every citizen knows their rights</li>
                <li>Legal knowledge is not limited to lawyers</li>
                <li>Everyone feels empowered to stand up for justice</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Our values:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🧩</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Clarity</h4>
                    <p className="text-muted-foreground">No jargon, just real, understandable explanations</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🤝</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Inclusivity</h4>
                    <p className="text-muted-foreground">For all ages, regions, and backgrounds</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🛡️</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Empowerment</h4>
                    <p className="text-muted-foreground">Knowledge that protects</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Transparency</h4>
                    <p className="text-muted-foreground">Reliable, real, verified legal content</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Meet the Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Abhinav Sahu" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">Abhinav Sahu</h3>
                  <p className="text-sm text-muted-foreground">Founder, Lead Developer & LegalTech Visionary</p>
                </div>
                <p className="text-center">
                  Hi! I'm a BTech Computer Science student passionate about coding, justice, and building solutions for
                  real-life problems. I started JusticeAlly to simplify how we understand our rights and legal duties.
                  What began as a personal project has now grown into something bigger — thanks to an amazing team.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Adarsh" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">Adarsh</h3>
                  <p className="text-sm text-muted-foreground">Co-Developer & Backend Specialist</p>
                </div>
                <p className="text-center">
                  Handles the logic, server-side integrations, and backend APIs that power our legal tools.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Shweta" />
                    <AvatarFallback>SH</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">Shweta</h3>
                  <p className="text-sm text-muted-foreground">Content Researcher & UI Contributor</p>
                </div>
                <p className="text-center">
                  Focuses on presenting verified, region-specific laws in a clean and understandable way. Also helps
                  enhance the user interface for smoother navigation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Saumya" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">Saumya</h3>
                  <p className="text-sm text-muted-foreground">Legal Content Curator & Outreach Coordinator</p>
                </div>
                <p className="text-center">
                  Ensures all legal data is simplified without losing accuracy. Also builds connections with legal
                  communities and contributors.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">What We Offer</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">JusticeAlly is your personal legal ally, offering:</p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">📘</span>
                  </div>
                  <p>Simplified legal explanations of rights, IPC sections, and basic laws</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🔍</span>
                  </div>
                  <p>Searchable database of Indian laws and Supreme Court case references</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🌐</span>
                  </div>
                  <p>Region-specific guidance and use-case-based advice</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🤖</span>
                  </div>
                  <p>AI tools (in progress) for legal document simplification and case prediction</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🧾</span>
                  </div>
                  <p>Learning resources on constitutional and civil rights</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Who Is This For Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Who Is This For?</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <ul className="list-disc pl-6 space-y-2">
                <li>Students trying to understand civics</li>
                <li>Anyone facing legal issues</li>
                <li>Curious individuals wanting to know their rights</li>
                <li>General public seeking a reliable legal info platform</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Tech Stack Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Tech Stack</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">JusticeAlly is built using:</p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">⚛️</span>
                  </div>
                  <p>
                    <strong>Frontend:</strong> React.js
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🐍</span>
                  </div>
                  <p>
                    <strong>Backend:</strong> Python (Flask)
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🗄️</span>
                  </div>
                  <p>
                    <strong>Database:</strong> MongoDB
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🕸️</span>
                  </div>
                  <p>
                    <strong>Web Scraping Tools:</strong> Built to extract real case data
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">🧠</span>
                  </div>
                  <p>
                    <strong>AI Integration:</strong> For document simplification and case categorization (coming soon)
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Note from Founder Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">A Note from the Founder</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <blockquote className="border-l-4 border-primary pl-4 italic">
                "Justice shouldn't be limited by your ability to read a law book. With JusticeAlly, we're building a
                bridge between the law and the people. Our goal is to educate, empower, and evolve legal understanding
                for every Indian citizen."
              </blockquote>
              <p className="text-right mt-4">— Abhinav Sahu, Founder & Lead Developer</p>
            </CardContent>
          </Card>
        </section>

        {/* Let's Grow Together Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Let's Grow Together</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <ul className="list-disc pl-6 space-y-2">
                <li>Explore the platform</li>
                <li>Share it with others</li>
                <li>Have suggestions or want to contribute? Reach out to us</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
