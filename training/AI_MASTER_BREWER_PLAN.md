# AI Master Brewer Feature Implementation Plan

## Overview
Add an AI-powered Master Brewer assistant to BrewMetrics that provides expert brewing guidance, recipe recommendations, and troubleshooting with integrated affiliate partner products.

## Feature Requirements

### Core AI Assistant Capabilities
- **Recipe Creation**: Generate new recipes based on style, ingredients, equipment
- **Recipe Enhancement**: Improve existing recipes with suggestions
- **Troubleshooting**: Diagnose brewing issues from batch feedback/ratings
- **Ingredient Recommendations**: Suggest specific malts, hops, yeast, additives
- **Equipment Recommendations**: Suggest brewing equipment upgrades
- **Process Optimization**: Improve brewing techniques and procedures

### Business Integration
- **Affiliate Links**: All recommendations include partner product links with discounts
- **Revenue Tracking**: Track clicks, conversions, and affiliate commissions
- **Discount Management**: Dynamic discount codes and promotional offers

## Technical Architecture

### 1. AI Service Integration (Google Gemini API)
```javascript
// New service: gemini-ai-service.js
class GeminiBrewingService {
    constructor(apiKey, projectId) {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.projectId = "brewmetrics-xyz-app";
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        this.vertexURL = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models`;
    }
    
    async generateRecipe(style, preferences) {
        const prompt = this.buildRecipePrompt(style, preferences);
        return await this.callGemini('gemini-pro', prompt);
    }
    
    async enhanceRecipe(recipe, feedback) {
        const prompt = this.buildEnhancementPrompt(recipe, feedback);
        return await this.callGemini('gemini-pro', prompt);
    }
    
    async troubleshootBatch(batchData, responses) {
        const prompt = this.buildTroubleshootPrompt(batchData, responses);
        return await this.callGemini('gemini-pro', prompt);
    }
    
    async recommendProducts(context) {
        const prompt = this.buildProductRecommendationPrompt(context);
        return await this.callGemini('gemini-pro', prompt);
    }
    
    async callGemini(model, prompt) {
        const response = await fetch(`${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    
    // Alternative: Use Vertex AI for more advanced features
    async callVertexAI(model, prompt) {
        const response = await fetch(`${this.vertexURL}/${model}:predict`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [{
                    prompt: prompt
                }],
                parameters: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    topK: 40,
                    topP: 0.95
                }
            })
        });
        
        const data = await response.json();
        return data.predictions[0].content;
    }
    
    async getAccessToken() {
        // Use Google Auth Library or Firebase Functions for server-side auth
        // This should be handled server-side for security
        return 'your-vertex-ai-access-token';
    }
}
```

### 2. Database Schema Extensions

#### New Collections
```javascript
// breweries/{userId}/recipes/{recipeId}
{
    name: "IPA Recipe v2.1",
    style: "American IPA",
    aiGenerated: true,
    aiPrompt: "Create a citrus-forward IPA with 6.5% ABV",
    ingredients: [
        {
            name: "Maris Otter",
            type: "grain",
            amount: "10 lbs",
            affiliateLink: "https://partner.com/maris-otter?ref=brewmetrics",
            discount: "BREW15"
        }
    ],
    equipment: [...],
    process: [...],
    createdAt: timestamp,
    aiVersion: "1.0"
}

// breweries/{userId}/ai-interactions/{interactionId}
{
    type: "recipe_generation|enhancement|troubleshooting",
    prompt: "User's question or request",
    response: "AI's response",
    context: { batchId?, recipeId?, userPreferences? },
    timestamp: timestamp,
    tokens: 1500
}

// affiliate-products (global collection)
{
    name: "Maris Otter Malt",
    category: "grains",
    supplier: "MoreBeer",
    affiliateLink: "https://partner.com/product?ref=brewmetrics",
    discount: "BREW15",
    commission: 0.08,
    inStock: true
}
```

### 3. New UI Components

#### AI Assistant Chat Interface
```html
<!-- ai-assistant-section.html -->
<div id="ai-assistant-section" class="dashboard-section">
    <div class="ai-chat-container">
        <div class="ai-chat-header">
            <h3><i class="fas fa-robot"></i> Master Brewer AI</h3>
            <span class="ai-status">Online</span>
        </div>
        
        <div class="ai-chat-messages" id="ai-messages">
            <!-- Messages populated by JavaScript -->
        </div>
        
        <div class="ai-chat-input">
            <input type="text" id="ai-prompt" placeholder="Ask me about brewing, recipes, or troubleshooting...">
            <button id="ai-send"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
    
    <div class="ai-quick-actions">
        <button class="ai-action-btn" data-action="generate-recipe">
            <i class="fas fa-magic"></i> Generate Recipe
        </button>
        <button class="ai-action-btn" data-action="enhance-recipe">
            <i class="fas fa-star"></i> Enhance Recipe
        </button>
        <button class="ai-action-btn" data-action="troubleshoot">
            <i class="fas fa-tools"></i> Troubleshoot Batch
        </button>
    </div>
</div>
```

#### Recipe Management Interface
```html
<!-- recipe-management-section.html -->
<div id="recipe-management-section" class="dashboard-section">
    <div class="recipe-library">
        <h3>Recipe Library</h3>
        <div class="recipe-filters">
            <select id="recipe-style-filter">
                <option value="">All Styles</option>
                <option value="IPA">IPA</option>
                <option value="Stout">Stout</option>
                <!-- More styles -->
            </select>
            <select id="recipe-source-filter">
                <option value="">All Sources</option>
                <option value="ai-generated">AI Generated</option>
                <option value="user-created">User Created</option>
            </select>
        </div>
        
        <div class="recipe-grid" id="recipe-grid">
            <!-- Recipes populated by JavaScript -->
        </div>
    </div>
</div>
```

### 4. New JavaScript Modules

#### AI Assistant Controller
```javascript
// ai-assistant.js
class AIAssistant {
    constructor(userId, apiService) {
        this.userId = userId;
        this.aiService = apiService;
        this.chatHistory = [];
        this.setupEventListeners();
    }
    
    async sendMessage(prompt, context = {}) {
        const response = await this.aiService.processPrompt(prompt, context);
        this.addToHistory(prompt, response);
        this.displayMessage(response);
        return response;
    }
    
    async generateRecipe(style, preferences) {
        const prompt = `Generate a ${style} recipe with these preferences: ${JSON.stringify(preferences)}`;
        const context = { action: 'generate_recipe', style, preferences };
        return await this.sendMessage(prompt, context);
    }
    
    async troubleshootBatch(batchId) {
        const batchData = await this.getBatchData(batchId);
        const responses = await this.getBatchResponses(batchId);
        
        const prompt = `Troubleshoot this batch: ${batchData.beerName}. 
                       Average rating: ${this.calculateAverageRating(responses)}.
                       Low scoring attributes: ${this.getWeakAreas(responses)}`;
        
        const context = { action: 'troubleshoot', batchId, batchData, responses };
        return await this.sendMessage(prompt, context);
    }
}
```

#### Recipe Management
```javascript
// recipe-manager.js
class RecipeManager {
    constructor(userId, db) {
        this.userId = userId;
        this.db = db;
        this.recipesRef = db.collection('breweries').doc(userId).collection('recipes');
    }
    
    async saveRecipe(recipe) {
        return await this.recipesRef.add({
            ...recipe,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    
    async getRecipes(filters = {}) {
        let query = this.recipesRef;
        
        if (filters.style) {
            query = query.where('style', '==', filters.style);
        }
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    async enhanceRecipe(recipeId, aiSuggestions) {
        const recipeRef = this.recipesRef.doc(recipeId);
        await recipeRef.update({
            aiEnhancements: aiSuggestions,
            lastEnhanced: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}
```

#### Affiliate Integration
```javascript
// affiliate-manager.js
class AffiliateManager {
    constructor(db) {
        this.db = db;
        this.productsRef = db.collection('affiliate-products');
    }
    
    async getProductRecommendations(ingredients) {
        const recommendations = [];
        
        for (const ingredient of ingredients) {
            const products = await this.findProducts(ingredient.name, ingredient.type);
            recommendations.push({
                ingredient: ingredient,
                products: products.map(p => ({
                    ...p,
                    trackingUrl: this.buildTrackingUrl(p.affiliateLink, 'ai-recommendation')
                }))
            });
        }
        
        return recommendations;
    }
    
    buildTrackingUrl(baseUrl, source) {
        return `${baseUrl}&utm_source=brewmetrics&utm_medium=ai&utm_campaign=${source}`;
    }
    
    async trackClick(productId, source) {
        await this.db.collection('affiliate-clicks').add({
            productId,
            source,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: this.userId
        });
    }
}
```

## Implementation Steps

### Phase 1: Core AI Integration (2-3 weeks)
1. **Set up AI service** (OpenAI API or alternative)
2. **Create basic chat interface**
3. **Implement core AI assistant module**
4. **Add new dashboard section for AI assistant**

### Phase 2: Recipe Management (2-3 weeks)
1. **Extend database schema for recipes**
2. **Build recipe management UI**
3. **Implement recipe generation and enhancement**
4. **Add recipe library and filtering**

### Phase 3: Affiliate Integration (1-2 weeks)
1. **Set up affiliate product database**
2. **Implement product recommendation system**
3. **Add affiliate tracking and analytics**
4. **Create discount code management**

### Phase 4: Advanced Features (2-3 weeks)
1. **Batch troubleshooting with AI analysis**
2. **Enhanced product recommendations**
3. **AI learning from user feedback**
4. **Advanced analytics and reporting**

## Cost Considerations

### AI Service Costs (Google Gemini/Vertex AI)
- Gemini API: ~$0.0005 per 1K tokens (significantly cheaper than OpenAI)
- Vertex AI: ~$0.002-0.02 per 1K tokens (depending on model)
- Estimated: $25-100/month for moderate usage
- Free tier: 60 queries per minute on Gemini API
- Consider rate limiting and caching

### Development Time
- Total: 7-11 weeks
- Can be done in parallel with existing features

### Revenue Potential
- Affiliate commissions: 5-15% per sale
- Premium AI features: $10-30/month subscription
- Equipment recommendations: Higher commission rates

## Next Steps

1. **Set up Google Cloud Project** with Gemini API and Vertex AI enabled
2. **Configure API keys** and authentication for Firebase integration
3. **Start with Phase 1** - basic Gemini AI integration
4. **Identify initial affiliate partners**
5. **Design brewing-specific prompts** for recipe generation and troubleshooting

## Google AI Setup Requirements

### 1. Google Cloud Console Setup
- Enable Generative AI API
- Enable Vertex AI API
- Create API keys for Gemini API
- Set up service account for Vertex AI (server-side)

### 2. Firebase Functions Integration
```javascript
// functions/index.js - For secure server-side AI calls
const functions = require('firebase-functions');
const { GoogleAuth } = require('google-auth-library');

exports.callGeminiAI = functions.https.onCall(async (data, context) => {
    // Verify user authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    
    const { prompt, model = 'gemini-pro' } = data;
    
    // Call Gemini API securely from server
    const response = await callGeminiAPI(prompt, model);
    return { response };
});
```

### 3. Environment Variables
```bash
# .env or Firebase Config
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLOUD_PROJECT_ID=your-project-id
VERTEX_AI_LOCATION=us-central1
```
