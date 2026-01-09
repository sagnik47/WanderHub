import { GoogleGenerativeAI } from "@google/generative-ai"

// ✅ For Next.js client components, use NEXT_PUBLIC_ prefix
// ✅ For Next.js server components/API routes, use regular process.env
const GEMINI_API_KEY = 
  typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY 
    : process.env.GOOGLE_GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in .env file")
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
  return `You are WanderAI, an intelligent travel assistant for WanderHub. You are currently helping a user explore "${destination.name}".

CRITICAL: You MUST use the destination context provided below. DO NOT answer from general knowledge alone.

DESTINATION CONTEXT:
- Name: ${destination.name}
- Category: ${destination.category}
${destination.description ? `- Description: ${destination.description}` : ""}
${destination.address ? `- Address: ${destination.address}` : ""}
${destination.rating ? `- Rating: ${destination.rating}/5` : ""}
${destination.priceLevel ? `- Price Level: ${"$".repeat(destination.priceLevel)}/4` : ""}
${destination.amenities && destination.amenities.length > 0 ? `- Amenities: ${destination.amenities.join(", ")}` : ""}
${destination.website ? `- Website: ${destination.website}` : ""}
${destination.openingHours && destination.openingHours.length > 0 ? `- Opening Hours:\n${destination.openingHours.map(h => `  - ${h}`).join("\n")}` : ""}

YOUR ROLE:
1. Answer questions SPECIFICALLY about ${destination.name} using the context above
2. If the context doesn't contain the information requested, clearly state: "I don't have that specific information about ${destination.name} in my current data. Let me tell you what I do know..." and then share relevant details from the context
3. Provide helpful travel tips based on the destination type and category
4. Suggest nearby attractions or related experiences when relevant
5. Help with planning visits and practical logistics
6. Be friendly, concise, and informative

STRICT RULES:
- ALWAYS reference the destination context when answering
- If asked about details not in the context (e.g., "what's the best time to visit"), acknowledge the limitation: "I don't have seasonal information for ${destination.name}, but based on it being a ${destination.category}, I'd suggest..."
- If the user asks about a completely different location, politely redirect: "I'm currently focused on ${destination.name}. Would you like to know more about it, or shall we explore a different destination?"
- Never make up facts about ${destination.name} - only use the provided context
- If the context is minimal, be honest: "I have limited details about ${destination.name} right now. Here's what I know: [share available context]"
- Keep responses concise (2-3 paragraphs max unless more detail is requested)
- Use emojis sparingly and only when appropriate

Remember: You are WanderAI, powered by real destination data. Accuracy and honesty about data limitations are crucial!`
}

/**
 * Generate a chat response using Gemini AI
 * Using gemini-1.5-flash-latest model which is available in Google AI Studio free tier
 */
export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  destination: DestinationContext
): Promise<string> {
  // Validate destination context
  if (!destination || !destination.name || !destination.category) {
    throw new Error("Invalid destination context. Name and category are required.")
  }

  try {
    // ✅ Use the correct model name for Google AI Studio
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 500, // Keep responses concise
      },
    })
    
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

    // Validate user message isn't too long
    if (currentMessage.content.length > 1000) {
      throw new Error("Message too long. Please keep your questions under 1000 characters.")
    }

    // Build conversation context from previous messages (limit to last 5 exchanges)
    const previousMessages = validMessages.slice(-10, -1).filter(msg => msg.content && msg.content.trim())
    
    let conversationContext = ""
    if (previousMessages.length > 0) {
      conversationContext = previousMessages
        .map((msg) => {
          const role = msg.role === "user" ? "User" : "WanderAI"
          return `${role}: ${msg.content}`
        })
        .join("\n\n")
    }

    // Build full prompt with system instruction and conversation history
    let fullPrompt = systemPrompt
    if (conversationContext) {
      fullPrompt += `\n\nPrevious conversation:\n${conversationContext}`
    }
    fullPrompt += `\n\nUser: ${currentMessage.content}\n\nWanderAI:`

    // Use generateContent with proper error handling
    console.log("🤖 WanderAI calling Gemini API with model: gemini-1.5-flash-latest")
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from AI. Please try rephrasing your question.")
    }
    
    return text.trim()
  } catch (error: any) {
    // Log full error for debugging
    console.error("❌ WanderAI API error:", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusText: error?.statusText,
      destination: destination?.name,
    })
    
    const errorMessage = error?.message || String(error)
    
    // API Authentication errors
    if (errorMessage.includes("API key") || errorMessage.includes("403") || errorMessage.includes("401")) {
      throw new Error("Authentication error. Please check your API configuration.")
    }
    
    // Model not found errors
    if (errorMessage.includes("404") || errorMessage.includes("not found") || errorMessage.includes("models/")) {
      throw new Error("AI model configuration error. Please contact support.")
    }
    
    // Rate limit errors
    if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("rate limit")) {
      throw new Error("Service temporarily busy. Please wait a moment and try again.")
    }
    
    // Safety/content filtering errors
    if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
      throw new Error("Your message couldn't be processed due to content guidelines. Please rephrase your question.")
    }
    
    // Network errors
    if (errorMessage.includes("fetch") || errorMessage.includes("network") || errorMessage.includes("timeout")) {
      throw new Error("Network error. Please check your connection and try again.")
    }
    
    // Generic fallback with sanitized error
    throw new Error(`Unable to process your request: ${errorMessage.substring(0, 100)}`)
  }
}

/**
 * Create a general travel guide system prompt
 */
export function createGeneralTravelPrompt(): string {
  return `You are WanderAI, an intelligent and friendly travel guide assistant for WanderHub. You help travelers discover amazing destinations, plan trips, and get expert travel advice.

YOUR ROLE:
1. Provide helpful, practical travel tips and recommendations
2. Help users plan trips based on their interests, budget, and preferences
3. Suggest destinations, activities, and authentic experiences
4. Answer travel questions about locations, timing, packing, logistics, etc.
5. Offer personalized itinerary suggestions and travel strategies
6. Be enthusiastic, concise, and genuinely helpful

IMPORTANT GUIDELINES:
- Focus exclusively on travel, destinations, and tourism topics
- Provide actionable, practical advice that travelers can actually use
- Be encouraging about exploration and cultural experiences
- When you don't have specific information, be honest: "I don't have the latest details on that, but generally..."
- Keep responses concise (2-3 paragraphs) unless the user asks for more detail
- Use emojis occasionally to add warmth, but don't overdo it
- If asked about non-travel topics, politely redirect: "I'm specialized in travel planning! How can I help you discover your next adventure?"

RESPONSE STYLE:
- Friendly and conversational, not robotic
- Focus on unique, authentic experiences over generic tourist traps
- Consider sustainability and responsible tourism when relevant
- Acknowledge budget constraints and offer alternatives
- Share insider tips when possible

Remember: You are WanderAI - enthusiastic about travel, knowledgeable about destinations, and committed to helping users have amazing experiences!`
}

/**
 * Generate a general travel guide chat response using Gemini AI
 * Using gemini-1.5-flash-latest model compatible with Google AI Studio free tier
 */
export async function generateGeneralTravelResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    // ✅ Use the correct model name for Google AI Studio
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.8, // Slightly more creative for general travel advice
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 600,
      },
    })

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

    // Validate user message length
    if (currentMessage.content.length > 1000) {
      throw new Error("Message too long. Please keep your questions under 1000 characters.")
    }

    // Build conversation context from previous messages (limit to last 5 exchanges)
    const previousMessages = validMessages.slice(-10, -1).filter(msg => msg.content && msg.content.trim())
    
    let conversationContext = ""
    if (previousMessages.length > 0) {
      conversationContext = previousMessages
        .map((msg) => {
          const role = msg.role === "user" ? "User" : "WanderAI"
          return `${role}: ${msg.content}`
        })
        .join("\n\n")
    }

    // Build full prompt with system instruction and conversation history
    let fullPrompt = systemPrompt
    if (conversationContext) {
      fullPrompt += `\n\nPrevious conversation:\n${conversationContext}`
    }
    fullPrompt += `\n\nUser: ${currentMessage.content}\n\nWanderAI:`

    // Use generateContent with proper error handling
    console.log("🤖 WanderAI calling Gemini API with model: gemini-1.5-flash-latest")
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from AI. Please try rephrasing your question.")
    }
    
    return text.trim()
  } catch (error: any) {
    // Log full error for debugging
    console.error("❌ WanderAI API error:", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusText: error?.statusText,
    })
    
    // Check for specific error types
    const errorMessage = error?.message || String(error)
    
    // API Authentication errors
    if (errorMessage.includes("API key") || errorMessage.includes("403") || errorMessage.includes("401")) {
      throw new Error("Authentication error. Please check your API configuration.")
    }
    
    // Model not found errors
    if (errorMessage.includes("404") || errorMessage.includes("not found") || errorMessage.includes("models/")) {
      throw new Error("AI model configuration error. Please contact support.")
    }
    
    // Rate limit errors
    if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("rate limit")) {
      throw new Error("Service temporarily busy. Please wait a moment and try again.")
    }
    
    // Safety/content filtering errors
    if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
      throw new Error("Your message couldn't be processed due to content guidelines. Please rephrase your question.")
    }
    
    // Network errors
    if (errorMessage.includes("fetch") || errorMessage.includes("network") || errorMessage.includes("timeout")) {
      throw new Error("Network error. Please check your connection and try again.")
    }
    
    // Generic fallback with sanitized error
    throw new Error(`Unable to process your request: ${errorMessage.substring(0, 100)}`)
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
  // Validate inputs
  if (!userInterests || userInterests.length === 0) {
    throw new Error("User interests are required for recommendations")
  }
  
  if (!availableDestinations || availableDestinations.length === 0) {
    throw new Error("No destinations available for recommendations")
  }

  try {
    // ✅ Use the correct model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.4, // Lower temperature for more consistent recommendations
        maxOutputTokens: 200,
      },
    })

    const prompt = `You are WanderAI, a personalized travel recommendation engine. Based on user preferences, recommend the top 5 destinations from the provided list.

USER PREFERENCES:
- Interests: ${userInterests.join(", ")}
- Budget: ${userBudget}
- Current Location: ${userLocation.lat}, ${userLocation.lng}

AVAILABLE DESTINATIONS:
${availableDestinations.map((d, i) => `${i + 1}. ${d.name} (${d.category}, ${d.distance.toFixed(1)}km away)`).join("\n")}

INSTRUCTIONS:
1. Consider the user's interests and match them with destination categories
2. Factor in budget constraints (if specified)
3. Balance proximity with relevance to interests
4. Return ONLY a JSON array with exactly 5 destination names in priority order
5. Format: ["Destination 1", "Destination 2", "Destination 3", "Destination 4", "Destination 5"]

IMPORTANT: Return ONLY the JSON array, no explanations or additional text.`

    console.log("🎯 WanderAI generating recommendations...")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from response
    const jsonMatch = text.match(/\[.*\]/s)
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0])
      // Validate that recommendations are from the available list
      const validRecommendations = recommendations.filter((name: string) =>
        availableDestinations.some(d => d.name === name)
      )
      
      if (validRecommendations.length >= 3) {
        return validRecommendations.slice(0, 5)
      }
    }

    // Fallback: Smart sorting based on category matching and distance
    console.log("⚠️ Using fallback recommendation algorithm")
    return smartFallbackRecommendations(userInterests, availableDestinations)
    
  } catch (error: any) {
    console.error("❌ WanderAI recommendation error:", error)
    
    // Fallback to distance-based sorting with category bonus
    return smartFallbackRecommendations(userInterests, availableDestinations)
  }
}

/**
 * Smart fallback recommendation algorithm
 */
function smartFallbackRecommendations(
  userInterests: string[],
  availableDestinations: Array<{ name: string; category: string; distance: number }>
): string[] {
  // Score each destination based on interest match and distance
  const scoredDestinations = availableDestinations.map(dest => {
    let score = 0
    
    // Check if destination category matches user interests
    const categoryLower = dest.category.toLowerCase()
    userInterests.forEach(interest => {
      if (categoryLower.includes(interest.toLowerCase()) || 
          interest.toLowerCase().includes(categoryLower)) {
        score += 10 // High bonus for matching interests
      }
    })
    
    // Distance penalty (closer is better, but not the only factor)
    score -= dest.distance * 0.1
    
    return { ...dest, score }
  })
  
  // Sort by score and return top 5
  return scoredDestinations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(d => d.name)
}