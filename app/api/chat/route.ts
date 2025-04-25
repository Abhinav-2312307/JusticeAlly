import { type NextRequest, NextResponse } from "next/server"

// Gemini API endpoint for the 2.0-flash model
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const API_KEY = "AIzaSyAG3hpw2yL_6zwN4yJVoeSuomwrp1s_-CU"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 })
    }

    // Prepare the prompt for Gemini with legal context
    const systemPrompt =
      "You are JusticeAlly, an AI legal assistant. Provide helpful, accurate, and concise legal information in a clean, professional format. " +
      "Do not use asterisks, bold formatting, or excessive disclaimers. Present information in a straightforward manner with proper paragraphing and minimal formatting. " +
      "Include only a brief, single-line disclaimer at the end if necessary. Focus on explaining legal concepts in simple terms and providing direct, actionable information."

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }, { text: query }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048, // Increased token limit for document simplification
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
