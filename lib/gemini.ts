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
 */
export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  destination: DestinationContext
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const systemPrompt = createSystemPrompt(destination)

  // Convert messages to Gemini format
  const chatHistory = messages
    .slice(0, -1) // All messages except the last one
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

  const currentMessage = messages[messages.length - 1]

  try {
    // Start a chat session with history
    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: systemPrompt,
    })

    const result = await chat.sendMessage(currentMessage.content)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API error:", error)
    throw new Error("Failed to generate chat response")
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
 */
export async function generateGeneralTravelResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  const systemPrompt = createGeneralTravelPrompt()

  // Convert messages to Gemini format
  const chatHistory = messages
    .slice(0, -1) // All messages except the last one
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

  const currentMessage = messages[messages.length - 1]

  try {
    // Start a chat session with history
    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: systemPrompt,
    })

    const result = await chat.sendMessage(currentMessage.content)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API error:", error)
    throw new Error("Failed to generate travel guide response")
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


