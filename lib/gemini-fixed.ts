import { GoogleGenerativeAI } from "@google/generative-ai"

const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro",
]

let cachedWorkingModelName: string | null = null

// Lazy initialization - only check API key when actually needed
function getGenAI() {
  const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
  
  if (!GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not set")
  }
  
  return new GoogleGenerativeAI(GEMINI_API_KEY)
}

function isUnsupportedModelError(error: unknown): boolean {
  const message = String((error as any)?.message || error || "").toLowerCase()
  return (
    message.includes("not found") ||
    message.includes("is not supported") ||
    message.includes("unsupported") ||
    message.includes("404")
  )
}

async function generateWithModelFallback(genAI: GoogleGenerativeAI, fullPrompt: string) {
  const modelOrder = cachedWorkingModelName
    ? [cachedWorkingModelName, ...MODEL_CANDIDATES.filter((model) => model !== cachedWorkingModelName)]
    : MODEL_CANDIDATES

  let lastError: unknown = null

  for (const modelName of modelOrder) {
    try {
      console.log(`🔍 Trying Gemini model: ${modelName}`)
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(fullPrompt)
      const text = result.response.text()

      if (!text || text.trim().length === 0) {
        throw new Error(`Empty response from Gemini model ${modelName}`)
      }

      cachedWorkingModelName = modelName
      console.log(`✅ Gemini response generated with model: ${modelName}`)
      return { text: text.trim(), modelName }
    } catch (error) {
      lastError = error
      const message = (error as any)?.message || String(error)
      console.log(`❌ Gemini model ${modelName} failed: ${message}`)

      if (!isUnsupportedModelError(error)) {
        throw error
      }
    }
  }

  if (lastError) {
    throw lastError
  }

  throw new Error("No available Gemini models found")
}

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
  return `You are a helpful travel assistant for WanderHub. You are helping a user learn about "${destination.name}".

DESTINATION INFO:
- Name: ${destination.name}
- Category: ${destination.category}
${destination.description ? `- Description: ${destination.description}` : ""}

Be helpful, friendly, and concise. Focus on ${destination.name} and travel-related topics.`
}

/**
 * Generate a chat response using Gemini AI - LATEST VERSION
 */
export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  destination: DestinationContext
): Promise<string> {
  try {
    console.log("🚀 Starting Gemini API call with latest library...")
    
    const genAI = getGenAI()
    
    const systemPrompt = createSystemPrompt(destination)
    const userMessage = messages[messages.length - 1]?.content || "Hello"
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
    
    console.log("📤 Sending request to Gemini...")
    const { text, modelName } = await generateWithModelFallback(genAI, fullPrompt)
    console.log(`✅ Success with ${modelName}! Response length:`, text.length)
    return text
    
  } catch (error: any) {
    console.error("❌ Gemini API Error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      stack: error?.stack
    })
    
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
    console.log("🚀 Starting Travel Guide API call with latest library...")
    
    const genAI = getGenAI()
    
    const systemPrompt = `You are a friendly travel guide assistant for WanderHub. Help users with travel planning, destinations, and travel advice. Be helpful and concise.`
    const userMessage = messages[messages.length - 1]?.content || "Hello"
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
    
    console.log("📤 Sending request to Gemini...")
    const { text, modelName } = await generateWithModelFallback(genAI, fullPrompt)
    console.log(`✅ Success with ${modelName}! Response length:`, text.length)
    return text
    
  } catch (error: any) {
    console.error("❌ Travel Guide API Error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      stack: error?.stack
    })
    
    const errorMessage = error?.message || String(error)
    throw new Error(`Travel Guide API error: ${errorMessage}`)
  }
}

/**
 * Test Gemini API connection
 */
export async function testGeminiConnection(): Promise<{ success: boolean; model?: string; error?: string }> {
  try {
    console.log("🔍 Testing Gemini API connection...")
    
    const genAI = getGenAI()

    const { modelName } = await generateWithModelFallback(genAI, "Hello")
    return { success: true, model: modelName }
  } catch (error: any) {
    console.error("❌ Error testing connection:", error);
    return { success: false, error: error?.message || "Connection test failed" };
  }
}