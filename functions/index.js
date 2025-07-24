const functions = require("firebase-functions");
const {VertexAI} = require("@google-cloud/vertexai");

// Import data pipeline functions
const {syncSurveyToBigQuery, backfillSurveyData} = require("./data-pipeline");

// Get configuration from environment variables with fallbacks
const PROJECT_ID = process.env.GCP_PROJECT || "brewmetrics-xyz-app-e8d51";
const LOCATION = process.env.VERTEX_LOCATION || "us-central1";

// Initialize the Vertex AI client
const vertexAi = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

// Rate limiting store (in production, use Redis or Firestore)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 requests per minute per user

function checkRateLimit(uid) {
  const now = Date.now();
  const userKey = `${uid}:${Math.floor(now / RATE_LIMIT_WINDOW)}`;

  const currentCount = rateLimitStore.get(userKey) || 0;
  if (currentCount >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  rateLimitStore.set(userKey, currentCount + 1);

  // Clean up old entries
  for (const [key] of rateLimitStore) {
    const keyTime = parseInt(key.split(":")[1]);
    if (now - (keyTime * RATE_LIMIT_WINDOW) > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }

  return true;
}

exports.getAIBrewingAdvice = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to use AI brewing advice.",
    );
  }

  const uid = context.auth.uid;
  const userPrompt = data.prompt;

  // Rate limiting check
  if (!checkRateLimit(uid)) {
    throw new functions.https.HttpsError(
        "resource-exhausted",
        "Rate limit exceeded. Please try again later.",
    );
  }

  // Input validation
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a valid 'prompt' string.",
    );
  }

  if (userPrompt.length > 1000) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Prompt is too long. Maximum 1000 characters allowed.",
    );
  }

  try {
    // Enhanced brewing-specific prompt
    const systemPrompt = `You are the AI Master Brewer, an expert brewing consultant with decades of experience. 
    You provide helpful, accurate, and practical brewing advice. Always respond in a friendly, professional tone.
    When discussing specific techniques, ingredients, or processes, provide concrete details and actionable guidance.`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${userPrompt}`;

    const generativeModel = vertexAi.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const resp = await generativeModel.generateContent(fullPrompt);
    const responseData = resp.response;

    // Better error handling for AI response
    if (!responseData || !responseData.candidates || responseData.candidates.length === 0) {
      throw new Error("No response generated from AI model");
    }

    const candidate = responseData.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error("Invalid response format from AI model");
    }

    const text = candidate.content.parts[0].text;

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from AI model");
    }

    // Log successful request (without sensitive data)
    functions.logger.info("AI brewing advice request completed", {
      uid,
      promptLength: userPrompt.length,
      responseLength: text.length,
    });

    return {response: text};
  } catch (error) {
    // Structured error logging
    functions.logger.error("Error in getAIBrewingAdvice", {
      uid,
      error: error.message,
      stack: error.stack,
      promptLength: userPrompt?.length || 0,
    });

    // Don't expose internal error details to client
    throw new functions.https.HttpsError(
        "internal",
        "Failed to get AI response. Please try again later.",
    );
  }
});

// Export data pipeline functions
exports.syncSurveyToBigQuery = syncSurveyToBigQuery;
exports.backfillSurveyData = backfillSurveyData;
