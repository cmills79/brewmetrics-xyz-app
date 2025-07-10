// Import the necessary Firebase modules
const functions = require("firebase-functions");
const { VertexAI } = require("@google-cloud/vertexai");

// Initialize the Vertex AI client
const vertex_ai = new VertexAI({
  project: "brewmetrics-xyz-app", // Replace with your actual project ID
  location: "us-central1",
});

// Create the main callable function
exports.getAIBrewingAdvice = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated if necessary (optional for now)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     "unauthenticated",
  //     "The function must be called while authenticated."
  //   );
  // }

  const prompt = data.prompt; // Get the prompt from the app's request

  if (!prompt) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a 'prompt'."
    );
  }

  // Select the Gemini Pro model
  const generativeModel = vertex_ai.getGenerativeModel({
    model: "gemini-1.5-flash-preview-0514",
  });

  try {
    // Generate content using the provided prompt
    const resp = await generativeModel.generateContent(prompt);
    const responseData = resp.response;
    const text = responseData.candidates[0].content.parts[0].text;

    // Send the AI's response back to the application
    return { response: text };

  } catch (error) {
    console.error("Error calling Vertex AI:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get a response from the AI."
    );
  }
});