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
  return `You are a knowledgeable travel assistant for WanderHub, a smart tourism platform. You are currently helping a user learn about "${destination.name}".

DESTINATION CONTEXT:
- Name: ${destination.name}
- Category: ${destination.category}
${destination.description ? `- Description: ${destination.description}` : ""}
${destination.address ? `- Address: ${destination.address}` : ""}
${destination.rating ? `- Rating: ${destination.rating}/5` : ""}
${destination.priceLevel ? `- Price Level: ${destination.priceLevel}/4` : ""}
${destination.amenities && destination.amenities.length > 0 ? `- Amenities: ${destination.amenities.join(", ")}` : ""}
${destination.website ? `- Website: ${destination.website}` : ""}
${destination.openingHours && destination.openingHours.length > 0 ? `- Opening Hours:\n${destination.openingHours.map(h => `  - ${h}`).join("\n")}` : ""}

YOUR ROLE:
1. Answer questions specifically about ${destination.name}
2. Provide helpful travel tips, best times to visit, and local insights
3. Suggest nearby attractions or related destinations when relevant
4. Help with planning visits, transportation, and accommodations
5. Be friendly, concise, and informative

IMPORTANT RULES:
- Stay focused on ${destination.name} and related travel topics
- If asked about unrelated topics, politely redirect to travel/destination questions
- Never provide personal opinions or make claims you cannot verify
- Always be helpful and encouraging about travel
- Keep responses concise (2-3 paragraphs max unless more detail is requested)
- Use emojis sparingly and only when appropriate

Now, help the user with their questions about ${destination.name}!`
}

/**
 * Generate a chat response using Gemini AI
 * Using gemini-1.5-flash model compatible with Google AI Studio free tier
 */
export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  destination: DestinationContext
): Promise<string> {
  try {
    // Initialize model with exact name for Google AI Studio free tier
    // Try gemini-pro first (most reliable for free tier), fallback to gemini-1.5-flash
    let model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const systemPrompt = createSystemPrompt(destination)

    // Filter out empty messages
    const validMessages = messages.filter(msg => msg.content && msg.content.trim())
    if (validMessages.length === 0) {
      throw new Error("No valid messages provided")
    }

    const currentMessage = validMessages[validMessages.length - 1]
    if (currentMessage.role !== "user") {
      throw new Error("Last message must be from user")
    }

    // Build conversation context from previous messages
    const previousMessages = validMessages.slice(0, -1).filter(msg => msg.content && msg.content.trim())
    
    let conversationContext = ""
    if (previousMessages.length > 0) {
      conversationContext = previousMessages
        .map((msg) => {
          const role = msg.role === "user" ? "User" : "Assistant"
          return `${role}: ${msg.content}`
        })
        .join("\n\n")
    }

    // Build full prompt with system instruction and conversation history
    let fullPrompt = systemPrompt
    if (conversationContext) {
      fullPrompt += `\n\nPrevious conversation:\n${conversationContext}`
    }
    fullPrompt += `\n\nUser: ${currentMessage.content}\n\nAssistant:`

    // Use generateContent - simpler and more reliable for free tier
    try {
      console.log("Calling Gemini API with model: gemini-pro")
      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()
      
      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini API")
      }
      
      return text
    } catch (modelError: any) {
      // If gemini-pro fails, try gemini-1.5-flash
      if (modelError.message?.includes("404") || modelError.message?.includes("not found")) {
        console.log("gemini-pro not available, trying gemini-1.5-flash")
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()
        
        if (!text || text.trim().length === 0) {
          throw new Error("Empty response from Gemini API")
        }
        
        return text
      }
      throw modelError
    }
  } catch (error: any) {
    // Log full error for debugging
    console.error("Gemini API error details:", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusText: error?.statusText,
      stack: error?.stack,
    })
    
    const errorMessage = error?.message || String(error)
    
    if (errorMessage.includes("API key") || errorMessage.includes("403") || errorMessage.includes("401")) {
      throw new Error("Invalid or missing GOOGLE_GEMINI_API_KEY. Please check your API key.")
    }
    
    if (errorMessage.includes("404") || errorMessage.includes("not found") || errorMessage.includes("models/")) {
      throw new Error(`Model error: ${errorMessage}. Ensure you're using Google AI Studio (not Vertex AI). Try using "gemini-pro" model which is most compatible with free tier.`)
    }
    
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      throw new Error("API quota exceeded. Please check your usage limits.")
    }
    
    throw new Error(`Gemini API error: ${errorMessage}`)
  }
}

/**
 * Create a general travel guide system prompt
 */
export function createGeneralTravelPrompt(): string {
  return `You are a knowledgeable and friendly travel guide assistant for WanderHub, a smart tourism platform. You help users discover amazing destinations, plan trips, and get travel advice.

YOUR ROLE:
1. Provide helpful travel tips and recommendations
2. Help users plan trips based on their interests and budget
3. Suggest destinations, activities, and experiences
4. Answer general travel questions about locations, best times to visit, what to pack, etc.
5. Help with travel planning, itinerary suggestions, and travel tips
6. Be friendly, concise, and informative

IMPORTANT RULES:
- Focus on travel, destinations, and tourism topics
- Provide practical and actionable advice
- Be encouraging about travel and exploration
- Keep responses concise (2-3 paragraphs max unless more detail is requested)
- Use emojis sparingly and only when appropriate
- If asked about unrelated topics, politely redirect to travel questions

Now, help the user with their travel questions!`
}

/**
 * Generate a general travel guide chat response using Gemini AI
 * Using gemini-1.5-flash model compatible with Google AI Studio free tier
 */
export async function generateGeneralTravelResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    // Initialize model with exact name for Google AI Studio free tier
    // Try gemini-pro first (most reliable for free tier), fallback to gemini-1.5-flash
    let model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const systemPrompt = createGeneralTravelPrompt()

    // Filter out empty messages
    const validMessages = messages.filter(msg => msg.content && msg.content.trim())
    if (validMessages.length === 0) {
      throw new Error("No valid messages provided")
    }

    // The last message should be from the user
    const currentMessage = validMessages[validMessages.length - 1]
    if (currentMessage.role !== "user") {
      throw new Error("Last message must be from user")
    }

    // Build conversation context from previous messages
    const previousMessages = validMessages.slice(0, -1).filter(msg => msg.content && msg.content.trim())
    
    // Remove leading assistant messages - we'll include them in the context instead
    let conversationContext = ""
    if (previousMessages.length > 0) {
      conversationContext = previousMessages
        .map((msg) => {
          const role = msg.role === "user" ? "User" : "Assistant"
          return `${role}: ${msg.content}`
        })
        .join("\n\n")
    }

    // Build full prompt with system instruction and conversation history
    let fullPrompt = systemPrompt
    if (conversationContext) {
      fullPrompt += `\n\nPrevious conversation:\n${conversationContext}`
    }
    fullPrompt += `\n\nUser: ${currentMessage.content}\n\nAssistant:`

    // Use generateContent - simpler and more reliable for free tier
    try {
      console.log("Calling Gemini API with model: gemini-pro")
      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()
      
      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini API")
      }
      
      return text
    } catch (modelError: any) {
      // If gemini-pro fails, try gemini-1.5-flash
      if (modelError.message?.includes("404") || modelError.message?.includes("not found")) {
        console.log("gemini-pro not available, trying gemini-1.5-flash")
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()
        
        if (!text || text.trim().length === 0) {
          throw new Error("Empty response from Gemini API")
        }
        
        return text
      }
      throw modelError
    }
  } catch (error: any) {
    // Log full error for debugging
    console.error("Gemini API error details:", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusText: error?.statusText,
      stack: error?.stack,
    })
    
    // Check for specific error types
    const errorMessage = error?.message || String(error)
    
    if (errorMessage.includes("API key") || errorMessage.includes("403") || errorMessage.includes("401")) {
      throw new Error("Invalid or missing GOOGLE_GEMINI_API_KEY. Please check your API key in the .env file.")
    }
    
    if (errorMessage.includes("404") || errorMessage.includes("not found") || errorMessage.includes("models/")) {
      throw new Error(`Model error: ${errorMessage}. Ensure you're using Google AI Studio (not Vertex AI). Try using "gemini-pro" model which is most compatible with free tier.`)
    }
    
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      throw new Error("API quota exceeded. Please check your Gemini API usage limits.")
    }
    
    // Return the actual error message for better debugging
    throw new Error(`Gemini API error: ${errorMessage}`)
  }
}

/**
 * Generate personalized destination recommendations
 */
export async function generateRecommendations(
  userInterests: string[],
  userBudget: string,
  userLocation: { lat: number; lng: number },
  availableDestinations: Array<{
    name: string
    category: string
    distance: number
  }>
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `Based on the following user preferences, recommend the top 5 destinations from the list:

USER PREFERENCES:
- Interests: ${userInterests.join(", ")}
- Budget: ${userBudget}
- Location: ${userLocation.lat}, ${userLocation.lng}

AVAILABLE DESTINATIONS:
${availableDestinations.map((d, i) => `${i + 1}. ${d.name} (${d.category}, ${d.distance.toFixed(1)}km away)`).join("\n")}

Return ONLY a JSON array of destination names in order of recommendation, like: ["Destination 1", "Destination 2", ...]`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from response
    const jsonMatch = text.match(/\[.*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback: extract destination names
    return availableDestinations.slice(0, 5).map((d) => d.name)
  } catch (error) {
    console.error("Gemini recommendation error:", error)
    // Fallback to distance-based sorting
    return availableDestinations
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map((d) => d.name)
  }
}


