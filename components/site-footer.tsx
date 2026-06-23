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
    <footer className="relative overflow-hidden border-t border-[#8e6843]/40 bg-[#2a1a12] text-[#fff7ea]">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#8e6843]/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,247,234,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,234,0.04)_1px,transparent_1px)] bg-[size:46px_46px] opacity-45" />

      <div className="container-shell relative py-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <p className="font-display text-4xl font-semibold text-[#fff7ea]">JusticeAlly</p>
            <div className="mt-3 h-1 w-20 rounded-full bg-[#d7a765]" />
            <p className="mt-5 text-sm leading-7 text-[#f5dfbf]/78">
              AI-assisted legal guidance for Indian users. Grounded in a searchable knowledge base, it helps individuals understand their rights, simplify legal documents, generate legal drafts, and take informed action with confidence.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs uppercase tracking-[0.22em] text-[#d7a765]">{group.title}</p>
              <div className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex w-fit items-center gap-2 text-sm text-[#fff7ea]/78 transition duration-300 hover:translate-x-1 hover:text-[#fff7ea]"
                  >
                    <span className="h-px w-0 bg-[#d7a765] transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[#fff7ea]/15 pt-6 text-sm leading-6 text-[#f5dfbf]/72">
          JusticeAlly provides general legal information and drafting assistance. It does not replace a licensed
          advocate reviewing the exact facts of a matter.
        </div>
      </div>
    </footer>
  )
}
