const functions = require("firebase-functions");
const {VertexAI} = require("@google-cloud/vertexai");

// Initialize the Vertex AI client
const vertexAi = new VertexAI({
  project: "brewmetrics-xyz-app",
  location: "us-central1",
});

// Create the main callable function
exports.getAIBrewingAdvice = functions.https.onCall(async (data, context) => {
  const prompt = data.prompt;

  if (!prompt) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a 'prompt'.",
    );
  }

  // Select the Gemini Flash model
  const generativeModel = vertexAi.getGenerativeModel({
    model: "gemini-1.5-flash-preview-0514",
  });

  try {
    const resp = await generativeModel.generateContent(prompt);
    const responseData = resp.response;
    const text = responseData.candidates[0].content.parts[0].text;

    return {response: text};
  } catch (error) {
    console.error("Error calling Vertex AI:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to get a response from the AI.",
    );
  }
});