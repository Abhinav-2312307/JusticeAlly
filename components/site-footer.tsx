import Link from "next/link"

const footerGroups = [
  {
    title: "Platform",
    links: [
      { href: "/tools/legal-assistant", label: "Legal assistant" },
      { href: "/tools/document-simplifier", label: "Document chat" },
      { href: "/tools/document-generator", label: "Draft studio" },
      { href: "/workspace", label: "Workspace" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources/legal-library", label: "Legal library" },
      { href: "/resources/rights-guide", label: "Rights guide" },
      { href: "/resources/templates", label: "Templates" },
      { href: "/resources/directory", label: "Aid directory" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-[rgba(241,233,219,0.75)]">
      <div className="container-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <p className="font-display text-3xl font-semibold">JusticeAlly</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              AI-assisted legal guidance for Indian users, grounded in a searchable knowledge base, backed by Firebase
              auth and conversation history, and designed to make first-step legal workflows usable.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{group.title}</p>
              <div className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-foreground/80 transition hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/80 pt-6 text-sm text-muted-foreground">
          JusticeAlly provides general legal information and drafting assistance. It does not replace a licensed
          advocate reviewing the exact facts of a matter.
        </div>
      </div>
    </footer>
  )
}
