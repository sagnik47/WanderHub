import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set")
}

// Initialize with the latest library version
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
    
    // Try the most common model names for the latest API
    let model;
    let modelName = "";
    
    const modelsToTry = [
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash", 
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    for (const tryModel of modelsToTry) {
      try {
        console.log(`🔍 Trying model: ${tryModel}`);
        model = genAI.getGenerativeModel({ model: tryModel });
        modelName = tryModel;
        console.log(`✅ Successfully created model: ${tryModel}`);
        break;
      } catch (modelError) {
        console.log(`❌ Model ${tryModel} failed: ${(modelError as any)?.message}`);
        continue;
      }
    }
    
    if (!model) {
      throw new Error("No available Gemini models found. All model attempts failed.");
    }
    
    const systemPrompt = createSystemPrompt(destination)
    const userMessage = messages[messages.length - 1]?.content || "Hello"
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
    
    console.log(`📤 Sending request to Gemini using ${modelName}...`)
    const result = await model.generateContent(fullPrompt)
    console.log("📥 Received response from Gemini")
    
    const response = result.response
    const text = response.text()
    
    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Gemini API")
    }
    
    console.log(`✅ Success with ${modelName}! Response length:`, text.length)
    return text.trim()
    
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
    
    // Try the most common model names for the latest API
    let model;
    let modelName = "";
    
    const modelsToTry = [
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash", 
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    for (const tryModel of modelsToTry) {
      try {
        console.log(`🔍 Trying model: ${tryModel}`);
        model = genAI.getGenerativeModel({ model: tryModel });
        modelName = tryModel;
        console.log(`✅ Successfully created model: ${tryModel}`);
        break;
      } catch (modelError) {
        console.log(`❌ Model ${tryModel} failed: ${(modelError as any)?.message}`);
        continue;
      }
    }
    
    if (!model) {
      throw new Error("No available Gemini models found. All model attempts failed.");
    }
    
    const systemPrompt = `You are a friendly travel guide assistant for WanderHub. Help users with travel planning, destinations, and travel advice. Be helpful and concise.`
    const userMessage = messages[messages.length - 1]?.content || "Hello"
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
    
    console.log(`📤 Sending request to Gemini using ${modelName}...`)
    const result = await model.generateContent(fullPrompt)
    console.log("📥 Received response from Gemini")
    
    const response = result.response
    const text = response.text()
    
    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Gemini API")
    }
    
    console.log(`✅ Success with ${modelName}! Response length:`, text.length)
    return text.trim()
    
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
    
    const modelsToTry = [
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash", 
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    for (const tryModel of modelsToTry) {
      try {
        console.log(`🔍 Testing model: ${tryModel}`);
        const model = genAI.getGenerativeModel({ model: tryModel });
        
        // Try a simple generation to test if the model works
        const result = await model.generateContent("Hello");
        const response = result.response.text();
        
        if (response && response.trim().length > 0) {
          console.log(`✅ Successfully tested model: ${tryModel}`);
          return { success: true, model: tryModel };
        }
      } catch (modelError: any) {
        console.log(`❌ Model ${tryModel} failed: ${modelError?.message}`);
        continue;
      }
    }
    
    return { success: false, error: "No working models found" };
  } catch (error: any) {
    console.error("❌ Error testing connection:", error);
    return { success: false, error: error?.message || "Connection test failed" };
  }
}