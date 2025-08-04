// AI Brewmaster Integration
// Intelligent brewing assistance using Google Discovery Engine

class AIBrewmaster {
  constructor() {
    this.endpoint = 'https://discoveryengine.googleapis.com/v1alpha/projects/391623246374/locations/global/collections/default_collection/engines/ai-brewmaster-engine/servingConfigs/default_config:search';
    this.isInitialized = false;
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    
    this.init();
  }

  async init() {
    try {
      // Initialize utilities
      this.utils = window.BrewMetricsUtils;
      if (!this.utils) {
        console.warn('BrewMetricsUtils not available. Using fallback logging.');
        // Fallback initialization without utils
        this.logger = {
          info: console.log,
          warn: console.warn,
          error: console.error,
          debug: console.debug
        };
        this.errorHandler = {
          handleError: (error) => console.error('AI Brewmaster Error:', error)
        };
      } else {
        this.logger = this.utils.logger;
        this.errorHandler = this.utils.errorHandler;
      }
      
      this.isInitialized = true;
      this.logger.info('AI Brewmaster initialized');
    } catch (error) {
      console.error('Failed to initialize AI Brewmaster:', error);
    }
  }

  /**
   * Get brewing advice for a specific question
   */
  async getBrewingAdvice(query, context = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('AI Brewmaster not initialized');
      }

      // Check cache first
      const cacheKey = this.generateCacheKey(query, context);
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        this.logger.debug('Using cached AI response', { query });
        return cached.data;
      }

      // Enhance query with context
      const enhancedQuery = this.enhanceQuery(query, context);
      
      const response = await this.searchBrewingKnowledge(enhancedQuery);
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });

      this.logger.info('AI Brewmaster advice retrieved', { query, resultsCount: response.results?.length });
      return response;

    } catch (error) {
      this.logger.error('Error getting brewing advice', error);
      // Return fallback response instead of throwing
      return {
        summary: "I'm having trouble accessing the brewing knowledge base right now. Please try asking about specific brewing topics like hops, fermentation, or beer styles.",
        results: [],
        suggestions: ["How do I make an IPA?", "What causes off-flavors?", "Troubleshooting fermentation"],
        totalResults: 0
      };
    }
  }

  /**
   * Get brewing advice using Discovery Engine
   */
  async searchBrewingKnowledge(query) {
    try {
      // Try Firebase function first, fallback to intelligent response
      if (typeof firebase !== 'undefined' && firebase.functions) {
        try {
          this.logger.info('Attempting Firebase function call');
          await this.ensureAuthenticated();
          const functions = firebase.functions('us-central1');
          const getAIBrewingAdvice = functions.httpsCallable('getAIBrewingAdvice');
          const result = await getAIBrewingAdvice({ prompt: query });
          return this.processCloudFunctionResponse(result.data);
        } catch (fbError) {
          this.logger.warn('Firebase function call failed, using intelligent response:', fbError.message);
        }
      } else {
        this.logger.info('Firebase functions not available, using intelligent response');
      }

      // Generate intelligent response based on query (always available)
      this.logger.info('Using intelligent response generation for query:', query);
      return this.generateIntelligentResponse(query);

    } catch (error) {
      this.logger.error('Error getting brewing advice', error);
      // Even if everything fails, provide a basic response
      return {
        summary: "I'm having trouble accessing the brewing knowledge base right now. Please try asking about specific brewing topics like hops, fermentation, or beer styles.",
        results: [],
        suggestions: ["How do I make an IPA?", "What causes off-flavors?", "Troubleshooting fermentation"],
        totalResults: 0
      };
    }
  }

  /**
   * Generate intelligent brewing response based on query analysis
   */
  generateIntelligentResponse(query) {
    const lowerQuery = query.toLowerCase();
    let response = "";
    
    // IPA recipe specific
    if (lowerQuery.includes('ipa') && lowerQuery.includes('recipe')) {
      response = `Here's a solid American IPA recipe:

**5-Gallon American IPA Recipe:**

**Grain Bill:**
- 10 lbs Pale 2-Row Malt (base)
- 1 lb Crystal 40L (color & body)
- 0.5 lb Munich Malt (complexity)

**Hop Schedule:**
- 1 oz Chinook (13.5% AA) @ 60 min (bittering)
- 1 oz Centennial (10% AA) @ 20 min (flavor)
- 1 oz Cascade (6% AA) @ 5 min (aroma)
- 1 oz Citra (12% AA) @ flameout/whirlpool
- 1 oz Mosaic (12% AA) dry hop (3 days)

**Yeast & Process:**
- Safale US-05 or Wyeast 1056
- Mash at 152°F for 60 minutes
- Ferment at 66-68°F for 7-10 days
- Dry hop during active fermentation

**Target Stats:**
- OG: 1.062, FG: 1.012
- ABV: 6.5%, IBU: 65, SRM: 6

**Pro Tips:**
- Use RO water with gypsum addition
- Keep hop additions cold until use
- Package with minimal oxygen exposure`;
    }
    // Recipe ideas and suggestions
    else if (lowerQuery.includes('recipe') && (lowerQuery.includes('idea') || lowerQuery.includes('popular') || lowerQuery.includes('suggestion'))) {
      response = `Here are some popular beer recipe ideas for different styles:

**American IPA Recipe:**
- 10 lbs Pale 2-Row Malt
- 1 lb Crystal 40L
- 1 oz Chinook (60 min)
- 1 oz Centennial (15 min)
- 1 oz Cascade (5 min)
- 1 oz Citra (dry hop)
- Safale US-05 yeast
- Target: 6.2% ABV, 65 IBU

**Wheat Beer Recipe:**
- 5 lbs Wheat Malt
- 4 lbs Pilsner Malt
- 0.75 oz Hallertau (60 min)
- Wyeast 3068 Weihenstephan
- Target: 5.1% ABV, 15 IBU

**Porter Recipe:**
- 8 lbs Pale 2-Row
- 1 lb Crystal 60L
- 0.5 lb Chocolate Malt
- 1 oz Fuggle (60 min)
- 0.5 oz East Kent Goldings (15 min)
- Wyeast 1968 London ESB
- Target: 5.8% ABV, 28 IBU

**Simple Pale Ale:**
- 8 lbs Pale 2-Row Malt
- 0.5 lb Crystal 60L
- 1 oz Cascade (60 min)
- 1 oz Cascade (15 min)
- Safale US-05 yeast
- Target: 5.2% ABV, 35 IBU`;
    }
    // West Coast IPA specific advice
    else if (lowerQuery.includes('west coast') && lowerQuery.includes('ipa')) {
      response = `For a West Coast IPA, focus on these key elements:

**Hops:** Chinook, Centennial, Cascade, Columbus, and Simcoe are classic choices. Use 60-80 IBUs for proper bitterness.

**Grain Bill:** 90-95% pale malt base with 5-10% crystal/caramel malts (40-60L) for color and slight sweetness.

**Process:** 
- Bitter hop additions at 60 minutes
- Flavor additions at 15-20 minutes  
- Aroma/whirlpool additions at flameout
- Dry hop 3-4 days into fermentation

**Yeast:** California Ale yeast (WY1056/S-05) for clean, hop-forward profile.

**Water:** Low sulfate-to-chloride ratio emphasizes hop character.`;
    }
    // Hop-specific questions
    else if (lowerQuery.includes('hop')) {
      response = `Hop selection depends on your beer style and desired characteristics:

**For IPAs:** Citrus (Citra, Centennial), Pine (Chinook, Columbus), Tropical (Mosaic, Galaxy)
**For Balance:** Noble hops (Hallertau, Saaz) or English varieties (East Kent Goldings)
**For Aroma:** Late additions, whirlpool, and dry hopping maximize aroma impact
**Bitterness:** Early boil additions (60+ minutes) provide clean bitterness

Consider hop oil content, alpha acids, and flavor profiles when selecting varieties.`;
    }
    // Fermentation issues
    else if (lowerQuery.includes('stuck fermentation') || lowerQuery.includes('fermentation')) {
      response = `Fermentation troubleshooting steps:

**Stuck Fermentation:**
- Check temperature (should be in yeast range)
- Gently rouse yeast by swirling fermenter
- Add yeast nutrients if lacking
- Consider repitching fresh yeast

**Prevention:**
- Proper oxygenation of wort
- Adequate yeast pitch rate
- Maintain consistent temperature
- Ensure proper yeast health and viability

**Signs of Issues:** Gravity readings unchanged for 3+ days, off odors, or visible contamination.`;
    }
    // General brewing advice
    else {
      response = `Key brewing principles:

**Sanitation:** Most critical factor - sanitize everything that touches beer post-boil
**Temperature Control:** Maintain proper fermentation temperature for your yeast strain
**Quality Ingredients:** Fresh malt, hops, and viable yeast make the biggest difference
**Process:** Follow your recipe timing, especially for hop additions and fermentation

**Common Issues to Avoid:**
- Poor sanitation leading to infection
- Temperature swings during fermentation
- Oxidation during transfers
- Rushing the process`;
    }

    return {
      summary: response,
      results: [],
      suggestions: this.generateBrewingSuggestions(response),
      totalResults: 1
    };
  }

  /**
   * Ensure user is authenticated, sign in anonymously if needed
   */
  async ensureAuthenticated() {
    return new Promise((resolve, reject) => {
      if (typeof firebase === 'undefined' || !firebase.auth) {
        reject(new Error('Firebase Auth not available'));
        return;
      }

      const auth = firebase.auth();
      
      // Check if already authenticated
      if (auth.currentUser) {
        resolve(auth.currentUser);
        return;
      }

      // Listen for auth state changes
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        } else {
          // Sign in anonymously
          try {
            const result = await auth.signInAnonymously();
            unsubscribe();
            resolve(result.user);
          } catch (error) {
            unsubscribe();
            reject(error);
          }
        }
      });
    });
  }

  /**
   * Process Cloud Function response
   */
  processCloudFunctionResponse(data) {
    const response = data.response || '';
    
    return {
      summary: response,
      results: [],
      suggestions: this.generateBrewingSuggestions(response),
      totalResults: 1
    };
  }

  /**
   * Process and format search results (legacy for Discovery Engine)
   */
  processSearchResults(data) {
    const results = data.results || [];
    
    return {
      summary: this.generateSummary(results),
      results: results.map(result => ({
        title: result.document?.derivedStructData?.title || 'Brewing Knowledge',
        snippet: result.document?.derivedStructData?.snippets?.[0]?.snippet || '',
        source: result.document?.name || '',
        relevanceScore: result.relevanceScore || 0
      })),
      suggestions: this.generateSuggestions(results),
      totalResults: data.totalSize || 0
    };
  }

  /**
   * Generate a summary from search results
   */
  generateSummary(results) {
    if (!results.length) return "I couldn't find specific information about that. Try asking about brewing techniques, ingredients, or troubleshooting.";
    
    // Extract key snippets
    const snippets = results
      .slice(0, 3)
      .map(r => r.document?.derivedStructData?.snippets?.[0]?.snippet)
      .filter(Boolean);
    
    if (snippets.length === 0) return "I found some relevant brewing information. Check the detailed results below.";
    
    return snippets.join(' ');
  }

  /**
   * Generate brewing-specific suggestions based on response content
   */
  generateBrewingSuggestions(response) {
    const suggestions = [];
    const lowerResponse = response.toLowerCase();
    
    // Context-aware suggestions based on response content
    if (lowerResponse.includes('hop') || lowerResponse.includes('bitter')) {
      suggestions.push("How can I balance hop bitterness?");
      suggestions.push("What are the best hop varieties for my style?");
    }
    
    if (lowerResponse.includes('malt') || lowerResponse.includes('grain')) {
      suggestions.push("How do I choose the right grain bill?");
      suggestions.push("What malt substitutions can I make?");
    }
    
    if (lowerResponse.includes('yeast') || lowerResponse.includes('ferment')) {
      suggestions.push("How do I troubleshoot fermentation issues?");
      suggestions.push("What yeast strain should I use?");
    }
    
    if (lowerResponse.includes('water') || lowerResponse.includes('chemistry')) {
      suggestions.push("How do I adjust my water chemistry?");
      suggestions.push("What water profile fits my beer style?");
    }
    
    // Default suggestions if no specific context found
    if (suggestions.length === 0) {
      suggestions.push(
        "How do I improve my beer quality?",
        "What are common brewing mistakes to avoid?",
        "How do I troubleshoot off-flavors?"
      );
    }
    
    return suggestions.slice(0, 3);
  }

  /**
   * Generate related suggestions (legacy for Discovery Engine)
   */
  generateSuggestions(results) {
    const suggestions = [
      "How do I improve hop utilization?",
      "What causes off-flavors in beer?",
      "Best practices for water chemistry",
      "Troubleshooting fermentation issues",
      "Grain bill recommendations for IPAs"
    ];
    
    return suggestions.slice(0, 3);
  }

  /**
   * Enhance query with brewing context
   */
  enhanceQuery(query, context) {
    let enhanced = query;
    
    // Add recipe context if available
    if (context.beerStyle) {
      enhanced += ` for ${context.beerStyle}`;
    }
    
    if (context.abv) {
      enhanced += ` with ${context.abv}% ABV`;
    }
    
    if (context.ibu) {
      enhanced += ` and ${context.ibu} IBU`;
    }
    
    return enhanced;
  }

  /**
   * Get specific recipe recommendations
   */
  async getRecipeRecommendations(style, characteristics = {}) {
    const query = `recipe recommendations for ${style} beer` + 
      (characteristics.abv ? ` with ${characteristics.abv}% alcohol` : '') +
      (characteristics.ibu ? ` and ${characteristics.ibu} IBU` : '') +
      (characteristics.flavor ? ` with ${characteristics.flavor} flavors` : '');
    
    return await this.getBrewingAdvice(query, { beerStyle: style, ...characteristics });
  }

  /**
   * Get troubleshooting help
   */
  async getTroubleshootingHelp(issue, recipeContext = {}) {
    const query = `troubleshooting ${issue} in beer brewing`;
    return await this.getBrewingAdvice(query, recipeContext);
  }

  /**
   * Get ingredient suggestions
   */
  async getIngredientSuggestions(ingredientType, style = '') {
    const query = `best ${ingredientType} for ${style} beer brewing`;
    return await this.getBrewingAdvice(query, { beerStyle: style });
  }

  /**
   * Get process optimization tips
   */
  async getProcessOptimization(process, currentSetup = {}) {
    const query = `optimize ${process} brewing process`;
    return await this.getBrewingAdvice(query, currentSetup);
  }

  /**
   * Generate cache key
   */
  generateCacheKey(query, context) {
    const contextString = JSON.stringify(context);
    return `${query}_${contextString}`.replace(/\s+/g, '_').toLowerCase();
  }

  /**
   * Get user ID for personalization
   */
  getUserId() {
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      return firebase.auth().currentUser.uid;
    }
    return 'anonymous';
  }

  /**
   * Get authentication token
   */
  async getAuthToken() {
    if (typeof gapi !== 'undefined' && gapi.auth2) {
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance && authInstance.isSignedIn.get()) {
        return authInstance.currentUser.get().getAuthResponse().access_token;
      }
    }
    
    // Fallback to gcloud auth if available
    try {
      const response = await fetch('/auth/token');
      if (response.ok) {
        const data = await response.json();
        return data.access_token;
      }
    } catch (error) {
      console.warn('Could not get auth token:', error);
    }
    
    throw new Error('No authentication token available');
  }

  /**
   * Clear AI cache
   */
  clearCache() {
    this.cache.clear();
    this.logger.info('AI Brewmaster cache cleared');
  }

  /**
   * Get AI health status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      cacheSize: this.cache.size,
      endpoint: this.endpoint
    };
  }
}

// Initialize AI Brewmaster when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.AIBrewmaster = new AIBrewmaster();
});

// Export for use in other scripts
window.AIBrewmaster = AIBrewmaster;
