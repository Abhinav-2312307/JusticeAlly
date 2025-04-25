"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function ApiGuidePage() {
  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gemini API Quick Start Guide</h1>
          <p className="text-muted-foreground">Learn how to integrate Gemini AI models into your applications</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>What is Gemini API?</CardTitle>
                <CardDescription>
                  Google's Gemini API provides access to state-of-the-art AI models for various applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Gemini is Google's most capable AI model family, designed to be multimodal from the ground up. The
                  Gemini API allows developers to integrate these powerful models into their applications for:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>Text generation and summarization</li>
                  <li>Conversational AI and chatbots</li>
                  <li>Content creation and editing</li>
                  <li>Code generation and analysis</li>
                  <li>Multimodal understanding (text, images, etc.)</li>
                </ul>

                <div className="bg-slate-50 p-4 rounded-lg border mt-4">
                  <h3 className="font-semibold mb-2">Available Models</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="font-medium">gemini-2.0-flash</span>
                      <span className="text-muted-foreground">Fastest model, good for most use cases</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">gemini-2.0-pro</span>
                      <span className="text-muted-foreground">More capable for complex tasks</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">gemini-1.5-pro</span>
                      <span className="text-muted-foreground">Previous generation with long context</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="https://ai.google.dev/docs/gemini_api_overview" target="_blank" rel="noopener noreferrer">
                    Official Documentation
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>How to authenticate your requests to the Gemini API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">API Key Authentication</h3>
                  <p className="mb-4">
                    The simplest way to authenticate with the Gemini API is using an API key. You can include your API
                    key as a query parameter in your requests.
                  </p>

                  <CodeBlock
                    code={`// Example URL with API key
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY`}
                    language="javascript"
                  />

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-amber-800 mb-2">Security Note</h4>
                    <p className="text-amber-800">
                      Never expose your API key in client-side code. Always make API calls from a secure server
                      environment.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Getting an API Key</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      Go to the{" "}
                      <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google AI Studio
                      </a>
                    </li>
                    <li>Sign in with your Google account</li>
                    <li>Click on "Get API key" or go to the API keys section</li>
                    <li>Create a new API key and copy it</li>
                    <li>Store your API key securely</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Project Configuration</h3>
                  <p>Your project details:</p>
                  <div className="bg-slate-50 p-4 rounded-lg border mt-2">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Project Number:</span>
                      <span>279138887565</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">API Key:</span>
                      <span>AIzaSyAG3hpw2yL_6zwN4yJVoeSuomwrp1s_-CU</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>Sample code to help you get started with the Gemini API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Text Generation</h3>
                  <p className="mb-2">Simple example to generate text using the Gemini API:</p>

                  <CodeBlock
                    code={`// Using fetch in JavaScript
const API_KEY = "AIzaSyAG3hpw2yL_6zwN4yJVoeSuomwrp1s_-CU";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function generateText(prompt) {
  const response = await fetch(\`\${API_URL}?key=\${API_KEY}\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    }),
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// Example usage
generateText("Explain how AI works")
  .then(text => console.log(text))
  .catch(error => console.error("Error:", error));`}
                    language="javascript"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">cURL Example</h3>
                  <p className="mb-2">Using cURL to make a request to the Gemini API:</p>

                  <CodeBlock
                    code={`curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAG3hpw2yL_6zwN4yJVoeSuomwrp1s_-CU" \\
-H 'Content-Type: application/json' \\
-X POST \\
-d '{
  "contents": [{
    "parts":[{"text": "Explain how AI works"}]
  }]
}'`}
                    language="bash"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Python Example</h3>
                  <p className="mb-2">Using Python to interact with the Gemini API:</p>

                  <CodeBlock
                    code={`import requests
import json

API_KEY = "AIzaSyAG3hpw2yL_6zwN4yJVoeSuomwrp1s_-CU"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

def generate_text(prompt):
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    response = requests.post(API_URL, json=payload)
    response_json = response.json()
    
    return response_json["candidates"][0]["content"]["parts"][0]["text"]

# Example usage
result = generate_text("Explain how AI works")
print(result)`}
                    language="python"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Advanced Configuration</h3>
                  <p className="mb-2">Example with more configuration options:</p>

                  <CodeBlock
                    code={`// Using fetch with advanced parameters
async function generateTextAdvanced(prompt) {
  const response = await fetch(\`\${API_URL}?key=\${API_KEY}\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }),
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}`}
                    language="javascript"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link
                    href="https://ai.google.dev/tutorials/rest_quickstart"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More Examples
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
                <CardDescription>Helpful links and resources for working with the Gemini API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceCard
                    title="Official Documentation"
                    description="Comprehensive documentation for the Gemini API"
                    link="https://ai.google.dev/docs"
                  />
                  <ResourceCard
                    title="API Reference"
                    description="Detailed API reference for all endpoints and parameters"
                    link="https://ai.google.dev/api/rest"
                  />
                  <ResourceCard
                    title="Google AI Studio"
                    description="Web interface to experiment with Gemini models"
                    link="https://makersuite.google.com/"
                  />
                  <ResourceCard
                    title="Sample Applications"
                    description="Example applications built with Gemini API"
                    link="https://ai.google.dev/tutorials"
                  />
                  <ResourceCard
                    title="Node.js SDK"
                    description="Official Node.js SDK for Gemini API"
                    link="https://github.com/google/generative-ai-js"
                  />
                  <ResourceCard
                    title="Python SDK"
                    description="Official Python SDK for Gemini API"
                    link="https://github.com/google/generative-ai-python"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="https://ai.google.dev/community" target="_blank" rel="noopener noreferrer">
                    Join the Community
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Code block component with copy functionality
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className={`language-${language} rounded-lg p-4 bg-slate-950 text-slate-50 overflow-x-auto`}>
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  )
}

// Resource card component
function ResourceCard({ title, description, link }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="link" className="px-0" asChild>
          <Link href={link} target="_blank" rel="noopener noreferrer">
            Visit Resource
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
