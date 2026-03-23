"use client"

import { useEffect, useState } from "react"
import { Building, Calendar, Download, FileText, History } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfViewerProps {
  pdfUrl: string
  title: string
  publicationDate?: string
  officialSource?: string
  lastAmended?: string
}

export default function PdfViewer({ pdfUrl, title, publicationDate, officialSource, lastAmended }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setLoadError(false)
  }, [pdfUrl])

  return (
    <div className="glass-panel overflow-hidden border-white/70">
      <div className="border-b border-white/80 bg-white/80 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              {publicationDate ? (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Published: {publicationDate}</span>
                </div>
              ) : null}

              {officialSource ? (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <span>Source: {officialSource}</span>
                </div>
              ) : null}

              {lastAmended ? (
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <span>Last amended: {lastAmended}</span>
                </div>
              ) : null}
            </div>
          </div>

          <Button asChild>
            <a href={pdfUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>

      <div className="relative min-h-[720px] bg-white">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
              Loading PDF...
            </div>
          </div>
        ) : null}

        {loadError ? (
          <div className="flex min-h-[720px] flex-col items-center justify-center px-6 text-center">
            <FileText className="h-16 w-16 text-primary" />
            <h3 className="mt-5 text-2xl font-semibold text-foreground">Unable to display the PDF in-browser</h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              The file is still available. Download it directly or open the assistant for an explanation of the right.
            </p>
            <Button asChild className="mt-5">
              <a href={pdfUrl} download>
                Download PDF instead
              </a>
            </Button>
          </div>
        ) : (
          <iframe
            src={pdfUrl}
            className="h-[720px] w-full"
            title={title}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setLoadError(true)
            }}
          />
        )}
      </div>
    </div>
  )
}
