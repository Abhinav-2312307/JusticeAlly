"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, FileText, Download, Copy, Check, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Script from "next/script"

export default function DocumentSimplifier() {
  const [activeTab, setActiveTab] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [simplifiedText, setSimplifiedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false)

  // Load PDF.js scripts
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        await import("pdfjs-dist")
        setPdfJsLoaded(true)
      } catch (error) {
        console.error("Error loading PDF.js:", error)
      }
    }

    loadPdfJs()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
      return
    }

    setFileName(file.name)
    setIsProcessing(true)

    try {
      // Create a FileReader to read the file
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer

          // Load PDF.js dynamically
          const pdfjsLib = await import("pdfjs-dist")

          // Set the worker source
          const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument(arrayBuffer)
          const pdf = await loadingTask.promise

          let extractedText = ""

          // Extract text from each page
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items.map((item: any) => item.str).join(" ")
            extractedText += pageText + "\n"
          }

          // Set the extracted text to the textInput state if we're in upload mode
          if (activeTab === "upload") {
            setTextInput(extractedText)
          }

          // Now send the extracted text to the API for simplification
          await simplifyText(extractedText)
        } catch (error) {
          console.error("Error processing PDF content:", error)
          toast({
            title: "Error processing document",
            description: "There was an error extracting text from your PDF. Please try again.",
            variant: "destructive",
          })
          setIsProcessing(false)
        }
      }

      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "There was an error reading your file. Please try again.",
          variant: "destructive",
        })
        setIsProcessing(false)
      }

      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error("Error processing PDF:", error)
      toast({
        title: "Error processing document",
        description: "There was an error processing your PDF. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const simplifyText = async (text: string) => {
    try {
      // Use the same API endpoint as the chat feature but with a different prompt
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `Please simplify the following legal document into plain language that's easy to understand. Break it down into sections with clear explanations of key terms, rights, and obligations:\n\n${text}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to simplify document")
      }

      const data = await response.json()
      setSimplifiedText(data.response)
      setHasResult(true)
    } catch (error) {
      console.error("Error simplifying text:", error)
      toast({
        title: "Simplification failed",
        description: "There was an error simplifying your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleProcessDocument = async () => {
    if (activeTab === "paste" && !textInput.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to simplify",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    if (activeTab === "paste") {
      await simplifyText(textInput)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(simplifiedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([simplifiedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "simplified-document.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="container py-12">
      {/* PDF.js scripts */}
      <Script
        src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="beforeInteractive"
        onLoad={() => setPdfJsLoaded(true)}
      />
      <Script src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" strategy="beforeInteractive" />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Document Simplifier</h1>
          <p className="text-muted-foreground">
            Upload or paste a legal document to get a simplified explanation in plain language.
          </p>
        </div>

        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload a Legal Document</CardTitle>
                <CardDescription>We support PDF files up to 10MB.</CardDescription>
              </CardHeader>
              <CardContent>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex justify-center mb-4">
                    <FileUp className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="mb-4 text-muted-foreground">
                    {fileName ? `Selected: ${fileName}` : "Drag and drop your file here, or click to browse"}
                  </p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    Select File
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={isProcessing || !fileName} onClick={handleProcessDocument}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Simplify Document"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="paste">
            <Card>
              <CardHeader>
                <CardTitle>Paste Document Text</CardTitle>
                <CardDescription>Paste the text from your legal document below.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your legal text here..."
                  className="min-h-[200px]"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={isProcessing || !textInput.trim()} onClick={handleProcessDocument}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Simplify Text"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {hasResult && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Simplified Document
                </CardTitle>
                <CardDescription>Here's your document explained in simple terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-6 rounded-lg whitespace-pre-line">{simplifiedText}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
