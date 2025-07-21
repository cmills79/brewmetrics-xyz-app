const functions = require("firebase-functions");
const {VertexAI} = require("@google-cloud/vertexai");

// Initialize the Vertex AI client
const vertexAi = new VertexAI({
  project: "brewmetrics-xyz-app-e8d51",
  location: "us-central1",
});

exports.getAIBrewingAdvice = functions.https.onCall(async (data, context) => {
  const userPrompt = data.prompt;

  if (!userPrompt) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a 'prompt'.",
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
    const text = responseData.candidates[0].content.parts[0].text;

    return {response: text};
  } catch (error) {
    console.error("Error calling Vertex AI:", error);
    throw new functions.https.HttpsError(
        "internal",
        `Failed to get AI response: ${error.message}`,
    );
  }
});
