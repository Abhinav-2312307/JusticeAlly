import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, FileText, MessageSquare, AlertTriangle, BookOpen, Globe } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialSection } from "@/components/testimonial-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      {/* Features Section */}
      <section className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            JusticeAlly provides comprehensive legal assistance through AI-powered tools designed for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mic className="h-8 w-8 text-primary" />}
            title="Voice-Based Legal Assistant"
            description="Speak or type your legal issue and receive immediate guidance on your rights and next steps."
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-primary" />}
            title="Document Simplification"
            description="Upload complex legal documents and get simplified summaries in plain language."
          />
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-primary" />}
            title="Legal Q&A System"
            description="Ask questions about legal matters and receive accurate, contextual answers."
          />
          <FeatureCard
            icon={<AlertTriangle className="h-8 w-8 text-primary" />}
            title="Emergency Guidance"
            description="Get real-time assistance during legal emergencies with step-by-step instructions."
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-primary" />}
            title="Document Generator"
            description="Generate legal documents, complaints, and FIRs based on your specific situation."
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-primary" />}
            title="Multilingual Support"
            description="Access legal help in multiple languages including Hindi, English, and regional languages."
          />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-slate-50 py-12 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Real-World Use Cases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how JusticeAlly can help in various legal situations.
            </p>
          </div>

          <Tabs defaultValue="tenant" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="tenant">Tenant Issues</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="freelance">Freelancers</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="harassment">Harassment</TabsTrigger>
            </TabsList>
            <TabsContent value="tenant" className="p-6 bg-white rounded-lg shadow-sm">
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Harassment</CardTitle>
                  <CardDescription>How JusticeAlly helps tenants facing issues with landlords</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>When facing harassment from a landlord, JusticeAlly can:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Inform you about tenant rights under local housing laws</li>
                    <li>Generate formal complaint letters to housing authorities</li>
                    <li>Provide scripts for verbal confrontations</li>
                    <li>Connect you with tenant rights organizations in your area</li>
                    <li>Help document incidents for potential legal action</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/demo/tenant">Try Tenant Rights Demo</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="employment" className="p-6 bg-white rounded-lg shadow-sm">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Contracts</CardTitle>
                  <CardDescription>How JusticeAlly helps job seekers understand employment terms</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>When reviewing an employment contract, JusticeAlly can:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Simplify complex legal terminology in offer letters</li>
                    <li>Highlight potentially problematic clauses</li>
                    <li>Explain your rights as an employee</li>
                    <li>Compare terms to industry standards</li>
                    <li>Suggest negotiation points for better terms</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/demo/employment">Try Employment Contract Demo</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="freelance" className="p-6 bg-white rounded-lg shadow-sm">
              <Card>
                <CardHeader>
                  <CardTitle>Freelance Agreements</CardTitle>
                  <CardDescription>How JusticeAlly helps freelancers with work agreements</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>When validating freelance work agreements, JusticeAlly can:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Review contract terms for payment and delivery schedules</li>
                    <li>Identify intellectual property rights concerns</li>
                    <li>Generate standard freelance agreements</li>
                    <li>Explain tax implications of freelance work</li>
                    <li>Provide guidance on non-payment issues</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/demo/freelance">Try Freelance Agreement Demo</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="students" className="p-6 bg-white rounded-lg shadow-sm">
              <Card>
                <CardHeader>
                  <CardTitle>Student Rights</CardTitle>
                  <CardDescription>How JusticeAlly helps students understand institutional rules</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>When dealing with educational institutions, JusticeAlly can:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Explain student rights under education laws</li>
                    <li>Help interpret university policies and regulations</li>
                    <li>Generate appeals for academic decisions</li>
                    <li>Provide guidance on discrimination or harassment cases</li>
                    <li>Assist with scholarship or financial aid disputes</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/demo/student">Try Student Rights Demo</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="harassment" className="p-6 bg-white rounded-lg shadow-sm">
              <Card>
                <CardHeader>
                  <CardTitle>Harassment Cases</CardTitle>
                  <CardDescription>How JusticeAlly helps victims of online or physical harassment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>When facing harassment situations, JusticeAlly can:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Provide immediate steps to ensure safety</li>
                    <li>Help draft police complaints or FIRs</li>
                    <li>Connect with local support organizations</li>
                    <li>Explain legal protections against harassment</li>
                    <li>Guide through the process of obtaining restraining orders</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/demo/harassment">Try Harassment Support Demo</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Try JusticeAlly</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience how JusticeAlly can help with your legal questions and document needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Document Simplification</CardTitle>
              <CardDescription>Upload a legal document to get a simplified summary</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild size="lg" className="w-full">
                <Link href="/tools/document-simplifier">
                  <FileText className="mr-2 h-5 w-5" />
                  Try Document Simplifier
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Assistant</CardTitle>
              <CardDescription>Ask questions or describe your legal situation</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild size="lg" className="w-full">
                <Link href="/tools/legal-assistant">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try Legal Assistant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of users who have already benefited from JusticeAlly's AI-powered legal assistance.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Sign Up for Free</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
