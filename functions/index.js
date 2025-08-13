const functions = require("firebase-functions");
const {VertexAI} = require("@google-cloud/vertexai");

// Import data pipeline functions - temporarily disabled for deployment
// const {syncSurveyToBigQuery, backfillSurveyData} = require("./data-pipeline");

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

exports.generateAIRecipe = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to generate recipes.",
    );
  }

  const uid = context.auth.uid;
  const { beerStyle, batchSize, experienceLevel, specialRequests } = data;

  // Rate limiting check
  if (!checkRateLimit(uid)) {
    throw new functions.https.HttpsError(
        "resource-exhausted",
        "Rate limit exceeded. Please try again later.",
    );
  }

  // Input validation
  if (!beerStyle || typeof beerStyle !== "string") {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Beer style is required.",
    );
  }

  try {
    const systemPrompt = `You are the AI Master Brewer, an expert brewing consultant with decades of commercial and craft brewing experience.
    
    TASK: Generate a complete, professional beer recipe based on the user's specifications.
    
    RESPONSE FORMAT: Return a JSON object with this exact structure:
    {
      "recipe": {
        "name": "Recipe Name",
        "batchSize": 5.0,
        "targetOG": "1.055",
        "targetFG": "1.012",
        "targetABV": "5.6",
        "targetIBU": 35,
        "targetSRM": 8,
        "fermentables": [
          {"name": "Pale 2-Row", "amount": "8.5", "unit": "lbs", "yield": 81, "color": 2},
          {"name": "Crystal 60L", "amount": "1.0", "unit": "lbs", "yield": 74, "color": 60}
        ],
        "hops": [
          {"name": "Cascade", "amount": "1.0", "unit": "oz", "alpha": 5.5, "time": 60, "use": "Boil"},
          {"name": "Centennial", "amount": "0.5", "unit": "oz", "alpha": 10.0, "time": 15, "use": "Boil"}
        ],
        "yeast": [
          {"name": "Safale US-05", "amount": "1", "unit": "pkg", "attenuation": 75}
        ],
        "efficiency": 72,
        "boilTime": 60
      },
      "summary": "Brief description of the recipe and brewing notes",
      "instructions": {
        "mash": "Mash instructions",
        "boil": "Boil schedule",
        "fermentation": "Fermentation guidelines"
      }
    }
    
    REQUIREMENTS:
    - Use authentic ingredient names and realistic amounts
    - Calculate accurate OG, FG, ABV, IBU, and SRM values
    - Ensure recipe is balanced and true to style
    - Include professional brewing advice
    - Scale ingredients appropriately for batch size`;

    const userPrompt = `Generate a ${beerStyle} recipe with these specifications:
    - Batch Size: ${batchSize || 5} gallons
    - Experience Level: ${experienceLevel || 'intermediate'}
    ${specialRequests ? `- Special Requests: ${specialRequests}` : ''}
    
    Please create a complete, professional recipe with accurate calculations.`;

    const fullPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}`;

    const generativeModel = vertexAi.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const resp = await generativeModel.generateContent(fullPrompt);
    const responseData = resp.response;

    if (!responseData || !responseData.candidates || responseData.candidates.length === 0) {
      throw new Error("No response generated from AI model");
    }

    const candidate = responseData.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error("Invalid response format from AI model");
    }

    const text = candidate.content.parts[0].text;
    
    // Parse JSON response
    let recipeData;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      recipeData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', text);
      throw new Error("Failed to parse recipe data");
    }

    functions.logger.info("AI recipe generation completed", {
      uid,
      beerStyle,
      batchSize,
      recipeGenerated: !!recipeData.recipe
    });

    return recipeData;
  } catch (error) {
    functions.logger.error("Error in generateAIRecipe", {
      uid,
      error: error.message,
      stack: error.stack
    });

    throw new functions.https.HttpsError(
        "internal",
        "Failed to generate recipe. Please try again later.",
    );
  }
});

exports.getAIBrewingAdvice = functions.https.onCall(async (data, context) => {
      // Authentication check - allow both authenticated and anonymous users
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
    // Enhanced brewing-specific prompt with expanded knowledge base
    const systemPrompt = `You are the AI Master Brewer, an expert brewing consultant with decades of commercial and craft brewing experience.
    
    EXPERTISE AREAS:
    - Recipe formulation and optimization for all beer styles
    - Advanced brewing techniques (pressure fermentation, biotransformation, barrel aging)
    - Water chemistry mastery and ion balance optimization
    - Yeast management, propagation, and fermentation control
    - Sensory analysis and off-flavor identification/correction
    - Equipment optimization and maintenance protocols
    - Quality control and consistency management
    - Commercial brewing scaling and operations
    - Troubleshooting complex brewing issues
    - Innovation in brewing techniques and ingredients
    
    RESPONSE STYLE:
    - Provide specific, actionable advice with concrete numbers and parameters
    - Include relevant calculations, formulas, and technical details when appropriate
    - Reference specific ingredients, equipment, and techniques by name
    - Offer multiple solutions when applicable, ranked by effectiveness
    - Always consider safety, quality, and consistency in recommendations
    - Adapt technical depth to the apparent experience level of the questioner
    
    KNOWLEDGE BASE:
    - Comprehensive ingredient database (75+ malts, 50+ hops, 30+ yeast strains)
    - Water chemistry profiles for major brewing regions and styles
    - Advanced fermentation techniques and troubleshooting
    - Equipment optimization and maintenance protocols
    - Sensory analysis and off-flavor identification
    - Commercial brewing considerations and scaling
    
    Always provide helpful, accurate, and practical brewing advice in a friendly, professional tone.`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${userPrompt}`;

    const generativeModel = vertexAi.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
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
    functions.logger.error("Error in getAIBrewingAdvice", {
      uid,
      error: error.message,
      stack: error.stack,
      promptLength: userPrompt?.length || 0,
    });

    throw new functions.https.HttpsError(
        "internal",
        "Failed to get AI response. Please try again later.",
    );
  }
});

exports.loadRecipeIntoDesigner = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to load recipes.",
    );
  }

  const { recipe } = data;
  
  if (!recipe) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Recipe data is required.",
    );
  }

  try {
    // Convert AI recipe format to recipe designer format
    const designerRecipe = {
      name: recipe.name || 'AI Generated Recipe',
      type: 'All Grain',
      batchSize: parseFloat(recipe.batchSize) || 5.0,
      efficiency: recipe.efficiency || 72,
      boilTime: recipe.boilTime || 60,
      style: recipe.style || '',
      fermentables: recipe.fermentables || [],
      hops: recipe.hops || [],
      yeast: recipe.yeast || [],
      targetOG: recipe.targetOG,
      targetFG: recipe.targetFG,
      targetABV: recipe.targetABV,
      targetIBU: recipe.targetIBU,
      targetSRM: recipe.targetSRM
    };

    return { success: true, recipe: designerRecipe };
  } catch (error) {
    functions.logger.error("Error loading recipe into designer", {
      error: error.message,
      recipe
    });

    throw new functions.https.HttpsError(
        "internal",
        "Failed to load recipe into designer.",
    );
  }
});

/**
 * Google My Business Reviews Integration
 */
exports.fetchGoogleReviews = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { breweryId } = data;
    
    try {
        // Simulated reviews data - in production would use GMB API
        const simulatedReviews = [
            {
                reviewId: 'gmb_review_1',
                author: 'John Smith',
                rating: 5,
                text: 'Excellent brewery with great atmosphere!',
                createTime: new Date().toISOString(),
                reviewReply: null
            },
            {
                reviewId: 'gmb_review_2', 
                author: 'Jane Doe',
                rating: 4,
                text: 'Good beer selection, friendly staff.',
                createTime: new Date(Date.now() - 86400000).toISOString(),
                reviewReply: {
                    comment: 'Thank you for your kind words!',
                    updateTime: new Date().toISOString()
                }
            }
        ];

        return {
            success: true,
            reviews: simulatedReviews,
            totalReviews: simulatedReviews.length,
            averageRating: simulatedReviews.reduce((sum, r) => sum + r.rating, 0) / simulatedReviews.length
        };

    } catch (error) {
        functions.logger.error('Error fetching Google reviews:', error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch reviews');
    }
});

exports.respondToGoogleReview = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { reviewId, responseText } = data;
    
    if (!responseText || responseText.trim().length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Response text is required');
    }

    try {
        // In production, would call GMB API to post response
        return {
            success: true,
            message: 'Response posted successfully'
        };

    } catch (error) {
        functions.logger.error('Error responding to review:', error);
        throw new functions.https.HttpsError('internal', 'Failed to post response');
    }
});

// Import and export demo setup function
const { createDemoBrewery } = require('./demo-setup');
exports.createDemoBrewery = createDemoBrewery;
