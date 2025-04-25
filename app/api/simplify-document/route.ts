import { type NextRequest, NextResponse } from "next/server"

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const text = formData.get("text") as string
    const apiKey = "AIzaSyDd9cs07QGtPHCHIq7HOeH9UYr0F_iA0os" // Using the provided API key

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Prepare the prompt for Gemini
    const prompt =
      "Simplify the following legal document into plain language that's easy to understand. Break it down into sections with clear explanations of key terms, rights, and obligations:\n\n"

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt + text }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to simplify document" }, { status: 500 })
    }

    const data = await response.json()
    const simplifiedText = data.candidates[0].content.parts[0].text

    return NextResponse.json({ simplifiedText })
  } catch (error) {
    console.error("Error in simplify-document API:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}
