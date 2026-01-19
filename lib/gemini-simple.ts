import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set")
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export interface DestinationContext {
  name: string
  description?: string
  category: string
  address?: string
  rating?: number
  priceLevel?: number
  amenities?: string[]
  website?: string
  openingHours?: string[]
}

/**
 * Create a contextual system prompt for the chatbot
 */
export function createSystemPrompt(destination: DestinationContext): string {
  return `You are a knowledgeable travel assistant for WanderHub. You are helping a user learn about "${destination.name}".

DESTINATION INFO:
- Name: ${destination.name}
- Category: ${destination.category}
${destination.description ? `- Description: ${destination.description}` : ""}
${destination.address ? `- Address: ${destination.address}` : ""}
${destination.rating ? `- Rating: ${destination.rating}/5` : ""}

Be helpful, friendly, and concise. Focus on ${destination.name} and travel-related topics.`
}

/**
 * Generate a chat response using Gemini AI - SIMPLE VERSION
 */
export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  destination: DestinationContext
): Promise<string> {
  try {
    console.log("🚀 Starting Gemini API call...")
    
    // Use the exact model name that works in Python
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    console.log("✅ Model created: gemini-1.5-flash")
    
    const systemPrompt = createSystemPrompt(destination)
    const userMessage = messages[messages.length - 1]?.content || "Hello"
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
    
    console.log("📤 Sending request to Gemini...")
    const result = await model.generateContent(fullPrompt)
    console.log("📥 Received response from Gemini")
    
    const response = result.response
    const text = response.text()
    
    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Gemini API")
    }
    
    console.log("✅ Success! Response length:", text.length)
    return text.trim()
    
  } catch (error: any) {
    console.error("❌ Gemini API Error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code
    })
    
    // Try alternative model name
    if (error?.message?.includes("404") || error?.message?.includes("not found")) {
      try {
        console.log("🔄 Trying alternative model: gemini-pro")
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        
        const systemPrompt = createSystemPrompt(destination)
        const userMessage = messages[messages.length - 1]?.content || "Hello"
        const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
        
        const result = await model.generateContent(fullPrompt)
        const response = result.response
        const text = response.text()
        
        if (text && text.trim().length > 0) {
          console.log("✅ Success with gemini-pro! Response length:", text.length)
          return text.trim()
        }
      } catch (fallbackError) {
        console.error("❌ Fallback model also failed:", fallbackError)
      }
    }
    
    const errorMessage = error?.message || String(error)
    throw new Error(`Gemini API error: ${errorMessage}`)
  }
}

/**
 * Generate a general travel guide chat response
 */
export async function generateGeneralTravelResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    console.log("🚀 Starting Travel Guide API call...")
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    console.log("✅ Model created: gemini-1.5-flash")
    
    const systemPrompt = `You are a friendly travel guide assistant for WanderHub. Help users with travel planning, destinations, and travel advice. Be helpful and concise.`
    const userMessage = messages[messages.length - 1]?.content || "Hello"
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
    
    console.log("📤 Sending request to Gemini...")
    const result = await model.generateContent(fullPrompt)
    console.log("📥 Received response from Gemini")
    
    const response = result.response
    const text = response.text()
    
    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Gemini API")
    }
    
    console.log("✅ Success! Response length:", text.length)
    return text.trim()
    
  } catch (error: any) {
    console.error("❌ Travel Guide API Error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code
    })
    
    const errorMessage = error?.message || String(error)
    throw new Error(`Travel Guide API error: ${errorMessage}`)
  }
}