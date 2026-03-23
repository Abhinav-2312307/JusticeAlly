import Link from "next/link"
import { AlertTriangle, BookOpenText, FileText, LayoutDashboard, Menu, Scale } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { getOptionalSessionUser } from "@/lib/auth"
import { SignOutButton } from "@/components/auth/sign-out-button"

const navLinks = [
  { href: "/tools/legal-assistant", label: "Assistant" },
  { href: "/tools/document-simplifier", label: "Document Chat" },
  { href: "/tools/document-generator", label: "Draft Studio" },
  { href: "/resources/legal-library", label: "Library" },
]

export async function SiteHeader() {
  const user = await getOptionalSessionUser()

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[rgba(250,246,238,0.82)] backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-emerald-900/10">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold leading-none">JusticeAlly</p>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Legal guidance platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <Button key={item.href} variant="ghost" asChild className="text-sm text-foreground/80 hover:text-foreground">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button variant="ghost" asChild className="text-sm text-red-700 hover:bg-red-50 hover:text-red-800">
            <Link href="/emergency">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency
            </Link>
          </Button>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/workspace">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Workspace
                </Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] bg-[rgba(251,247,241,0.98)]">
            <SheetHeader>
              <SheetTitle className="font-display text-3xl">JusticeAlly</SheetTitle>
              <SheetDescription>Assistant, RAG search, document drafting, and emergency guidance.</SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Platform</p>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/tools/legal-assistant">
                      <BookOpenText className="mr-2 h-4 w-4" />
                      Legal assistant
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/tools/document-simplifier">
                      <FileText className="mr-2 h-4 w-4" />
                      Document chat
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/resources/legal-library">
                      <BookOpenText className="mr-2 h-4 w-4" />
                      Legal library
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start text-red-700 hover:bg-red-50 hover:text-red-800">
                    <Link href="/emergency">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Emergency
                    </Link>
                  </Button>
                </div>
              </div>

              {user ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Account</p>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild className="justify-start">
                      <Link href="/workspace">Workspace</Link>
                    </Button>
                    <SignOutButton className="justify-start" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Create account</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
