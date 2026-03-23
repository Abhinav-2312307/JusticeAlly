import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/toaster"

export const metadata: Metadata = {
  title: "JusticeAlly",
  description:
    "JusticeAlly is an AI-assisted legal guidance platform with Gemini-powered retrieval, Firebase authentication, and working document workflows.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
