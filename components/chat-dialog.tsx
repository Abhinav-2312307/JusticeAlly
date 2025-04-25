"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Copy, Check, Volume2 } from "lucide-react"
import { useState } from "react"

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  query: string
  response: string
}

export function ChatDialog({ open, onOpenChange, query, response }: ChatDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(response)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Legal Assistant Response</DialogTitle>
          <DialogDescription>This is general legal information, not legal advice.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div className="flex gap-3">
            <Avatar className="bg-slate-300">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-4 bg-muted flex-1">
              <p>{query}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Avatar className="bg-primary">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-4 bg-primary text-primary-foreground flex-1">
              <p className="whitespace-pre-line">{response}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handleTextToSpeech}>
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Response
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
