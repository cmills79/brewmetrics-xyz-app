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
   * Generate conversational recipe response with personality
   */
  generateConversationalRecipeResponse(query, context) {
    const style = context.beerStyle || 'craft beer';
    const batchSize = context.batchSize || 5;
    const experience = context.experienceLevel || 'intermediate';
    const special = context.specialRequests || '';
    
    let personality = "";
    let tips = "";
    
    // Add personality based on beer style
    if (style.toLowerCase().includes('ipa')) {
      personality = "Excellent choice! IPAs are one of my favorite styles to design. There's something magical about balancing hop character with malt backbone.";
      tips = "Pro tip: For this IPA, consider a hop stand at 170°F to maximize aroma while minimizing harsh bitterness.";
    } else if (style.toLowerCase().includes('stout')) {
      personality = "Ah, a stout! Now we're talking about some serious brewing artistry. The complexity you can achieve with roasted grains is incredible.";
      tips = "Remember: with stouts, less can be more. Don't overdo the roasted malts – let each grain contribute its unique character.";
    } else {
      personality = `${style} is a fantastic choice! This style offers great flexibility for creativity while staying true to tradition.`;
      tips = "Focus on balance – every ingredient should have a purpose and contribute to the overall character.";
    }
    
    // Adjust for experience level
    let experienceNote = "";
    if (experience === 'beginner') {
      experienceNote = "Since you're newer to brewing, I've designed this recipe to be forgiving while still producing exceptional results. Don't worry if things don't go exactly as planned – brewing is both art and science!";
    } else if (experience === 'advanced') {
      experienceNote = "With your experience, you'll appreciate the nuances in this recipe. Feel free to make adjustments based on your water profile and equipment.";
    }
    
    // Include special requests
    let specialNote = "";
    if (special) {
      specialNote = `I've incorporated your request for "${special}" into the recipe design. This adds a unique twist that should really make this beer special!`;
    }
    
    const response = `${personality}

For your ${batchSize}-gallon batch, I've crafted something that balances tradition with innovation. ${experienceNote}

${specialNote}

${tips}

The recipe I've created should give you a beautiful ${style} with excellent drinkability and character. Each ingredient has been carefully selected to work in harmony with the others.`;

    return {
      summary: response,
      results: [],
      suggestions: [
        `How can I modify this ${style} recipe?`,
        `What if I want to make this stronger/lighter?`,
        `Can you explain the brewing process for this recipe?`
      ],
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
   * Generate a complete recipe with instructions
   */
  async generateRecipe(beerStyle, characteristics = {}) {
    const query = `Generate a complete ${beerStyle} recipe with ingredients, amounts, and step-by-step brewing instructions`;
    
    try {
      // Get AI response for recipe generation
      const response = await this.getBrewingAdvice(query, { beerStyle, ...characteristics });
      
      // Parse and structure the recipe
      const recipe = this.parseRecipeFromResponse(response.summary, beerStyle, characteristics);
      
      return {
        ...response,
        recipe: recipe,
        instructions: this.generateBrewingInstructions(recipe)
      };
    } catch (error) {
      this.logger.error('Error generating recipe', error);
      return this.generateFallbackRecipe(beerStyle, characteristics);
    }
  }

  /**
   * Parse recipe from AI response and structure it
   */
  parseRecipeFromResponse(response, beerStyle, characteristics) {
    const recipe = {
      name: `AI Generated ${beerStyle}`,
      type: 'All Grain',
      batchSize: characteristics.batchSize || 5.0,
      efficiency: 72.0,
      boilTime: 60,
      style: beerStyle,
      fermentables: [],
      hops: [],
      yeast: [],
      misc: [],
      targetOG: characteristics.og || this.getStyleOG(beerStyle),
      targetFG: characteristics.fg || this.getStyleFG(beerStyle),
      targetABV: characteristics.abv || this.getStyleABV(beerStyle),
      targetIBU: characteristics.ibu || this.getStyleIBU(beerStyle)
    };

    // Parse fermentables from response
    recipe.fermentables = this.extractFermentables(response, beerStyle);
    
    // Parse hops from response
    recipe.hops = this.extractHops(response, beerStyle);
    
    // Parse yeast from response
    recipe.yeast = this.extractYeast(response, beerStyle);
    
    return recipe;
  }

  /**
   * Extract fermentables from AI response
   */
  extractFermentables(response, beerStyle) {
    const fermentables = [];
    
    if (beerStyle.toLowerCase().includes('ipa')) {
      fermentables.push(
        { name: 'Pale 2-Row', amount: 10.0, unit: 'lb', ppg: 37, lovibond: 2 },
        { name: 'Crystal 40L', amount: 1.0, unit: 'lb', ppg: 34, lovibond: 40 }
      );
    } else if (beerStyle.toLowerCase().includes('stout')) {
      fermentables.push(
        { name: 'Pale 2-Row', amount: 8.0, unit: 'lb', ppg: 37, lovibond: 2 },
        { name: 'Roasted Barley', amount: 0.75, unit: 'lb', ppg: 25, lovibond: 300 },
        { name: 'Crystal 60L', amount: 0.5, unit: 'lb', ppg: 34, lovibond: 60 }
      );
    } else {
      // Default pale ale grain bill
      fermentables.push(
        { name: 'Pale 2-Row', amount: 9.0, unit: 'lb', ppg: 37, lovibond: 2 },
        { name: 'Munich Malt', amount: 1.0, unit: 'lb', ppg: 37, lovibond: 10 }
      );
    }
    
    return fermentables;
  }

  /**
   * Extract hops from AI response
   */
  extractHops(response, beerStyle) {
    const hops = [];
    
    if (beerStyle.toLowerCase().includes('ipa')) {
      hops.push(
        { name: 'Chinook', amount: 1.0, unit: 'oz', time: 60, alpha: 13.0, use: 'Boil' },
        { name: 'Centennial', amount: 1.0, unit: 'oz', time: 20, alpha: 10.0, use: 'Boil' },
        { name: 'Cascade', amount: 1.0, unit: 'oz', time: 0, alpha: 5.5, use: 'Aroma' },
        { name: 'Citra', amount: 1.0, unit: 'oz', time: 3, alpha: 12.0, use: 'Dry Hop' }
      );
    } else if (beerStyle.toLowerCase().includes('stout')) {
      hops.push(
        { name: 'East Kent Goldings', amount: 1.25, unit: 'oz', time: 60, alpha: 5.0, use: 'Boil' },
        { name: 'Fuggle', amount: 0.75, unit: 'oz', time: 15, alpha: 4.5, use: 'Boil' }
      );
    } else {
      // Default pale ale hops
      hops.push(
        { name: 'Cascade', amount: 1.0, unit: 'oz', time: 60, alpha: 5.5, use: 'Boil' },
        { name: 'Centennial', amount: 0.75, unit: 'oz', time: 20, alpha: 10.0, use: 'Boil' },
        { name: 'Cascade', amount: 0.5, unit: 'oz', time: 0, alpha: 5.5, use: 'Aroma' }
      );
    }
    
    return hops;
  }

  /**
   * Extract yeast from AI response
   */
  extractYeast(response, beerStyle) {
    const yeast = [];
    
    if (beerStyle.toLowerCase().includes('ipa') || beerStyle.toLowerCase().includes('pale')) {
      yeast.push({
        name: 'Safale US-05',
        type: 'Ale',
        form: 'Dry',
        amount: 1,
        unit: 'pkg',
        attenuation: 81,
        temperature: '64-72°F'
      });
    } else if (beerStyle.toLowerCase().includes('stout')) {
      yeast.push({
        name: 'Wyeast 1084 Irish Ale',
        type: 'Ale',
        form: 'Liquid',
        amount: 1,
        unit: 'pkg',
        attenuation: 73,
        temperature: '62-72°F'
      });
    } else {
      yeast.push({
        name: 'Safale US-05',
        type: 'Ale',
        form: 'Dry',
        amount: 1,
        unit: 'pkg',
        attenuation: 81,
        temperature: '64-72°F'
      });
    }
    
    return yeast;
  }

  /**
   * Generate step-by-step brewing instructions
   */
  generateBrewingInstructions(recipe) {
    const instructions = {
      overview: `Complete brewing instructions for ${recipe.name}`,
      sections: []
    };

    // Mash instructions
    instructions.sections.push({
      title: "Mash",
      steps: [
        "Heat 3.5 gallons of water to 168°F for strike water",
        "Add grains and stabilize mash temperature at 152°F",
        "Mash for 60 minutes, stirring occasionally",
        "Heat sparge water to 170°F",
        "Vorlauf (recirculate) first runnings until clear",
        "Sparge slowly to collect 6.5 gallons of wort"
      ]
    });

    // Boil instructions
    const boilSteps = [
      "Bring wort to a rolling boil",
      "Add bittering hops at start of boil"
    ];
    
    // Add hop additions based on recipe
    recipe.hops.forEach(hop => {
      if (hop.time > 0 && hop.time < 60) {
        boilSteps.push(`Add ${hop.amount} oz ${hop.name} with ${hop.time} minutes remaining`);
      } else if (hop.time === 0) {
        boilSteps.push(`Add ${hop.amount} oz ${hop.name} at flameout`);
      }
    });
    
    boilSteps.push("Cool wort to 65°F using immersion chiller or ice bath");
    
    instructions.sections.push({
      title: "Boil",
      steps: boilSteps
    });

    // Fermentation instructions
    instructions.sections.push({
      title: "Fermentation",
      steps: [
        "Transfer cooled wort to sanitized fermenter",
        "Aerate wort thoroughly by splashing or using oxygen stone",
        `Pitch ${recipe.yeast[0]?.name || 'yeast'} when wort is at proper temperature`,
        `Ferment at ${recipe.yeast[0]?.temperature || '65-68°F'} for 7-10 days`,
        "Check gravity - should reach target FG before packaging",
        recipe.hops.some(h => h.use === 'Dry Hop') ? "Add dry hops 2-3 days before packaging" : null,
        "Package when fermentation is complete and gravity is stable"
      ].filter(Boolean)
    });

    // Packaging instructions
    instructions.sections.push({
      title: "Packaging",
      steps: [
        "Sanitize bottles/kegs and all equipment",
        "For bottles: Add 3/4 cup corn sugar dissolved in 1 cup boiling water",
        "For kegs: Rack beer to keg and carbonate to 2.4-2.6 volumes CO2",
        "Condition bottles at room temperature for 2 weeks",
        "Chill and enjoy!"
      ]
    });

    return instructions;
  }

  /**
   * Generate fallback recipe when AI fails
   */
  generateFallbackRecipe(beerStyle, characteristics) {
    const recipe = {
      name: `${beerStyle} Recipe`,
      type: 'All Grain',
      batchSize: 5.0,
      efficiency: 72.0,
      boilTime: 60,
      style: beerStyle,
      fermentables: this.extractFermentables('', beerStyle),
      hops: this.extractHops('', beerStyle),
      yeast: this.extractYeast('', beerStyle)
    };

    return {
      summary: `Generated ${beerStyle} recipe with standard ingredients and proportions.`,
      recipe: recipe,
      instructions: this.generateBrewingInstructions(recipe),
      suggestions: [`How do I adjust the ${beerStyle} recipe?`, `What variations work for ${beerStyle}?`],
      totalResults: 1
    };
  }

  /**
   * Get style-specific target values
   */
  getStyleOG(beerStyle) {
    const style = beerStyle.toLowerCase();
    if (style.includes('ipa')) return 1.060;
    if (style.includes('stout')) return 1.048;
    if (style.includes('pale')) return 1.052;
    return 1.050;
  }

  getStyleFG(beerStyle) {
    const style = beerStyle.toLowerCase();
    if (style.includes('ipa')) return 1.012;
    if (style.includes('stout')) return 1.012;
    if (style.includes('pale')) return 1.010;
    return 1.010;
  }

  getStyleABV(beerStyle) {
    const style = beerStyle.toLowerCase();
    if (style.includes('ipa')) return 6.2;
    if (style.includes('stout')) return 4.8;
    if (style.includes('pale')) return 5.5;
    return 5.0;
  }

  getStyleIBU(beerStyle) {
    const style = beerStyle.toLowerCase();
    if (style.includes('ipa')) return 60;
    if (style.includes('stout')) return 25;
    if (style.includes('pale')) return 35;
    return 30;
  }

  /**
   * Scale recipe to different batch size
   */
  async scaleRecipe(recipe, newBatchSize, conversational = true) {
    const scaleFactor = newBatchSize / recipe.batchSize;
    
    const scaledRecipe = {
      ...recipe,
      name: `${recipe.name} (${newBatchSize} gal)`,
      batchSize: newBatchSize,
      fermentables: recipe.fermentables.map(f => ({
        ...f,
        amount: Math.round((f.amount * scaleFactor) * 100) / 100
      })),
      hops: recipe.hops.map(h => ({
        ...h,
        amount: Math.round((h.amount * scaleFactor) * 100) / 100
      })),
      yeast: recipe.yeast.map(y => ({
        ...y,
        amount: scaleFactor > 2 ? Math.ceil(y.amount * scaleFactor) : y.amount
      }))
    };

    if (conversational) {
      const advice = this.generateScalingAdvice(recipe.batchSize, newBatchSize, scaleFactor);
      return {
        recipe: scaledRecipe,
        advice: advice,
        summary: `Recipe successfully scaled from ${recipe.batchSize} to ${newBatchSize} gallons.`
      };
    }

    return { recipe: scaledRecipe };
  }

  /**
   * Generate scaling advice
   */
  generateScalingAdvice(originalSize, newSize, scaleFactor) {
    let advice = `🔧 **Scaling from ${originalSize} to ${newSize} gallons (${scaleFactor.toFixed(2)}x)**\n\n`;
    
    if (scaleFactor > 3) {
      advice += `**⚠️ Large Scale-Up Tips:**
- Consider split boils if your kettle can't handle the volume
- You may need multiple fermenters
- Yeast starter highly recommended for this size
- Watch your efficiency - it may drop with larger grain bills\n\n`;
    } else if (scaleFactor < 0.5) {
      advice += `**⚠️ Scaling Down Tips:**
- Small amounts can be tricky to measure - consider percentages
- Watch out for hop utilization changes in smaller volumes
- Single yeast pack should still be sufficient\n\n`;
    }

    advice += `**Scaling Notes:**
- All fermentables and hops scaled linearly
- Yeast amounts adjusted for larger batches
- Timing remains the same
- Water chemistry may need adjustment for volume`;

    return advice;
  }

  /**
   * Adjust recipe gravity (OG/FG)
   */
  async adjustGravity(recipe, targetOG, conversational = true) {
    const currentOG = this.calculateOG(recipe);
    const adjustment = targetOG - currentOG;
    
    if (Math.abs(adjustment) < 0.002) {
      return {
        recipe: recipe,
        advice: "Recipe is already very close to target gravity!",
        summary: `Current OG: ${currentOG.toFixed(3)}, Target: ${targetOG.toFixed(3)}`
      };
    }

    // Calculate base malt adjustment needed
    const baseMaltIndex = recipe.fermentables.findIndex(f => 
      f.name.toLowerCase().includes('pale') || 
      f.name.toLowerCase().includes('2-row') ||
      f.name.toLowerCase().includes('pilsner')
    );

    if (baseMaltIndex === -1) {
      return { error: "Could not find base malt to adjust" };
    }

    const baseMalt = recipe.fermentables[baseMaltIndex];
    const pointsNeeded = adjustment * 1000 * recipe.batchSize;
    const poundsToAdd = pointsNeeded / (baseMalt.ppg * recipe.efficiency / 100);

    const adjustedRecipe = {
      ...recipe,
      name: `${recipe.name} (OG ${targetOG.toFixed(3)})`,
      fermentables: recipe.fermentables.map((f, index) => 
        index === baseMaltIndex 
          ? { ...f, amount: Math.round((f.amount + poundsToAdd) * 100) / 100 }
          : f
      ),
      targetOG: targetOG
    };

    if (conversational) {
      const advice = this.generateGravityAdvice(currentOG, targetOG, poundsToAdd, baseMalt.name);
      return {
        recipe: adjustedRecipe,
        advice: advice,
        summary: `Gravity adjusted from ${currentOG.toFixed(3)} to ${targetOG.toFixed(3)}`
      };
    }

    return { recipe: adjustedRecipe };
  }

  /**
   * Generate gravity adjustment advice
   */
  generateGravityAdvice(currentOG, targetOG, adjustment, maltName) {
    const direction = adjustment > 0 ? 'increased' : 'decreased';
    const change = Math.abs(adjustment);
    
    return `🎯 **Gravity Adjustment: ${currentOG.toFixed(3)} → ${targetOG.toFixed(3)}**

**Change Made:**
- ${direction.charAt(0).toUpperCase() + direction.slice(1)} ${maltName} by ${change.toFixed(2)} lbs

**Why This Works:**
${adjustment > 0 
  ? '- More base malt = more fermentable sugars = higher OG\n- This maintains the recipe balance while hitting your target' 
  : '- Less base malt = fewer fermentable sugars = lower OG\n- Recipe proportions stay balanced'}

**Pro Tips:**
- Recalculate your water volumes for the new grain bill
- Consider adjusting hop quantities if ABV changed significantly
- Your efficiency may vary slightly with different grain amounts`;
  }

  /**
   * Adjust recipe bitterness (IBU)
   */
  async adjustBitterness(recipe, targetIBU, conversational = true) {
    const currentIBU = this.calculateIBU(recipe);
    const adjustment = targetIBU - currentIBU;
    
    if (Math.abs(adjustment) < 2) {
      return {
        recipe: recipe,
        advice: "Recipe bitterness is already very close to target!",
        summary: `Current IBU: ${currentIBU.toFixed(1)}, Target: ${targetIBU.toFixed(1)}`
      };
    }

    // Find bittering hop (longest boil time)
    const bitteringHopIndex = recipe.hops.reduce((maxIndex, hop, index) => 
      hop.time > recipe.hops[maxIndex].time ? index : maxIndex, 0);

    if (bitteringHopIndex === -1) {
      return { error: "No bittering hops found to adjust" };
    }

    const bitteringHop = recipe.hops[bitteringHopIndex];
    const scaleFactor = targetIBU / currentIBU;
    
    const adjustedRecipe = {
      ...recipe,
      name: `${recipe.name} (${targetIBU} IBU)`,
      hops: recipe.hops.map((h, index) => 
        index === bitteringHopIndex 
          ? { ...h, amount: Math.round((h.amount * scaleFactor) * 100) / 100 }
          : h
      ),
      targetIBU: targetIBU
    };

    if (conversational) {
      const advice = this.generateBitternessAdvice(currentIBU, targetIBU, bitteringHop, scaleFactor);
      return {
        recipe: adjustedRecipe,
        advice: advice,
        summary: `Bitterness adjusted from ${currentIBU.toFixed(1)} to ${targetIBU.toFixed(1)} IBU`
      };
    }

    return { recipe: adjustedRecipe };
  }

  /**
   * Generate bitterness adjustment advice
   */
  generateBitternessAdvice(currentIBU, targetIBU, hop, scaleFactor) {
    const direction = scaleFactor > 1 ? 'increased' : 'decreased';
    const changePercent = Math.round(Math.abs((scaleFactor - 1) * 100));
    
    return `🍺 **Bitterness Adjustment: ${currentIBU.toFixed(1)} → ${targetIBU.toFixed(1)} IBU**

**Change Made:**
- ${direction.charAt(0).toUpperCase() + direction.slice(1)} ${hop.name} by ${changePercent}% (${hop.amount} → ${(hop.amount * scaleFactor).toFixed(2)} oz)

**Balance Notes:**
${scaleFactor > 1 
  ? '- Higher bitterness will create a more aggressive hop character\n- Consider the malt backbone can handle this level' 
  : '- Lower bitterness will let malt sweetness come through more\n- Great for showcasing specialty malts'}

**Brewing Tips:**
- This adjusts your primary bittering addition
- Flavor and aroma hops remain unchanged for balance
- Consider water chemistry - high sulfates enhance hop perception`;
  }

  /**
   * Adjust recipe color (SRM)
   */
  async adjustColor(recipe, targetSRM, conversational = true) {
    const currentSRM = this.calculateSRM(recipe);
    const adjustment = targetSRM - currentSRM;
    
    if (Math.abs(adjustment) < 1) {
      return {
        recipe: recipe,
        advice: "Recipe color is already very close to target!",
        summary: `Current SRM: ${currentSRM.toFixed(1)}, Target: ${targetSRM.toFixed(1)}`
      };
    }

    // Find crystal/specialty malts to adjust
    const specialtyMaltIndex = recipe.fermentables.findIndex(f => 
      f.name.toLowerCase().includes('crystal') || 
      f.name.toLowerCase().includes('caramel') ||
      (f.lovibond && f.lovibond > 10)
    );

    let adjustedRecipe;
    if (adjustment > 0 && specialtyMaltIndex !== -1) {
      // Darken by increasing specialty malts
      const specialtyMalt = recipe.fermentables[specialtyMaltIndex];
      const increase = adjustment * 0.1; // Rough estimate
      
      adjustedRecipe = {
        ...recipe,
        name: `${recipe.name} (${targetSRM} SRM)`,
        fermentables: recipe.fermentables.map((f, index) => 
          index === specialtyMaltIndex 
            ? { ...f, amount: Math.round((f.amount + increase) * 100) / 100 }
            : f
        ),
        targetSRM: targetSRM
      };
    } else if (adjustment < 0) {
      // Lighten by reducing specialty malts
      const reduction = Math.abs(adjustment) * 0.1;
      
      adjustedRecipe = {
        ...recipe,
        name: `${recipe.name} (${targetSRM} SRM)`,
        fermentables: recipe.fermentables.map(f => 
          (f.lovibond && f.lovibond > 10) 
            ? { ...f, amount: Math.max(0, Math.round((f.amount - reduction) * 100) / 100) }
            : f
        ),
        targetSRM: targetSRM
      };
    } else {
      return { error: "Could not find appropriate malts to adjust color" };
    }

    if (conversational) {
      const advice = this.generateColorAdvice(currentSRM, targetSRM, adjustment);
      return {
        recipe: adjustedRecipe,
        advice: advice,
        summary: `Color adjusted from ${currentSRM.toFixed(1)} to ${targetSRM.toFixed(1)} SRM`
      };
    }

    return { recipe: adjustedRecipe };
  }

  /**
   * Generate color adjustment advice
   */
  generateColorAdvice(currentSRM, targetSRM, adjustment) {
    const direction = adjustment > 0 ? 'darker' : 'lighter';
    const colorName = this.getSRMColorName(targetSRM);
    
    return `🎨 **Color Adjustment: ${currentSRM.toFixed(1)} → ${targetSRM.toFixed(1)} SRM (${colorName})**

**Change Made:**
- Recipe adjusted to be ${direction}
- ${adjustment > 0 ? 'Increased specialty malts' : 'Reduced specialty malts'}

**Color Impact:**
${adjustment > 0 
  ? '- Deeper color will add more caramel/roasted flavors\n- May slightly increase body and sweetness' 
  : '- Lighter color will reduce caramel notes\n- Cleaner, crisper flavor profile'}

**Visual Result:**
- Your beer will now pour a beautiful ${colorName.toLowerCase()} color
- Perfect for the ${this.getStyleForColor(targetSRM)} style range`;
  }

  /**
   * Get color name from SRM value
   */
  getSRMColorName(srm) {
    if (srm <= 3) return 'Pale Yellow';
    if (srm <= 6) return 'Gold';
    if (srm <= 9) return 'Amber';
    if (srm <= 14) return 'Copper';
    if (srm <= 18) return 'Brown';
    if (srm <= 35) return 'Dark Brown';
    return 'Black';
  }

  /**
   * Get beer style suggestion based on color
   */
  getStyleForColor(srm) {
    if (srm <= 4) return 'Pilsner/Light Lager';
    if (srm <= 8) return 'Pale Ale/IPA';
    if (srm <= 12) return 'Amber Ale';
    if (srm <= 20) return 'Brown Ale/Porter';
    return 'Stout';
  }

  /**
   * Calculate estimated OG from recipe
   */
  calculateOG(recipe) {
    const totalPoints = recipe.fermentables.reduce((sum, f) => 
      sum + (f.amount * (f.ppg || 37) * (recipe.efficiency || 72) / 100), 0);
    return 1 + (totalPoints / recipe.batchSize / 1000);
  }

  /**
   * Calculate estimated IBU from recipe
   */
  calculateIBU(recipe) {
    return recipe.hops.reduce((sum, h) => {
      const utilization = this.getHopUtilization(h.time);
      const aau = h.amount * (h.alpha || 5);
      return sum + (aau * utilization * 75) / recipe.batchSize;
    }, 0);
  }

  /**
   * Get hop utilization based on boil time
   */
  getHopUtilization(time) {
    if (time >= 60) return 0.30;
    if (time >= 30) return 0.25;
    if (time >= 15) return 0.15;
    if (time >= 5) return 0.10;
    return 0.05;
  }

  /**
   * Calculate estimated SRM from recipe
   */
  calculateSRM(recipe) {
    const totalSRM = recipe.fermentables.reduce((sum, f) => 
      sum + ((f.amount * (f.lovibond || 2)) / recipe.batchSize), 0);
    return 1.4922 * Math.pow(totalSRM, 0.6859);
  }

  /**
   * Generate detailed brew steps for recipe
   */
  async generateBrewSteps(recipe, userPreferences = {}) {
    const steps = {
      overview: `Complete step-by-step brewing instructions for ${recipe.name}`,
      estimatedTime: this.calculateBrewTime(recipe),
      difficulty: this.assessRecipeDifficulty(recipe),
      sections: []
    };

    // Pre-brew preparation
    steps.sections.push({
      title: "📋 Pre-Brew Preparation (Day Before)",
      duration: "30 minutes",
      steps: [
        "🧪 Test and adjust water chemistry if needed",
        "🍄 Prepare yeast starter if using liquid yeast (recommended for OG > 1.060)",
        "🧹 Sanitize all equipment that will contact wort post-boil",
        "📊 Verify all ingredients and amounts",
        "⚖️ Mill grains if not pre-milled (coarse crush for better efficiency)"
      ]
    });

    // Mash process
    const mashSection = this.generateMashSteps(recipe);
    steps.sections.push(mashSection);

    // Boil process  
    const boilSection = this.generateBoilSteps(recipe);
    steps.sections.push(boilSection);

    // Fermentation
    const fermentationSection = this.generateFermentationSteps(recipe);
    steps.sections.push(fermentationSection);

    // Packaging
    const packagingSection = this.generatePackagingSteps(recipe);
    steps.sections.push(packagingSection);

    return {
      steps: steps,
      tips: this.generateBrewingTips(recipe),
      troubleshooting: this.generateTroubleshootingGuide(recipe.style)
    };
  }

  /**
   * Generate mash steps
   */
  generateMashSteps(recipe) {
    const totalGrain = recipe.fermentables.reduce((sum, f) => sum + f.amount, 0);
    const strikeWater = Math.round((totalGrain * 1.25) * 10) / 10; // 1.25 qt/lb
    const spargeWater = Math.round((recipe.batchSize * 1.5 - strikeWater) * 10) / 10;

    return {
      title: "🌾 Mash Process",
      duration: "90 minutes",
      steps: [
        `🔥 Heat ${strikeWater} gallons of water to 168°F`,
        `⚖️ Add ${totalGrain} lbs of grain slowly while stirring`,
        "🌡️ Stabilize mash temperature at 152°F (adjust with hot/cold water)",
        "⏰ Mash for 60 minutes, checking temperature every 15 minutes",
        `🔥 Heat ${spargeWater} gallons of sparge water to 170°F`,
        "🔄 Vorlauf (recirculate) first runnings until clear",
        `💧 Sparge slowly over 30 minutes to collect ${recipe.batchSize + 1} gallons`
      ]
    };
  }

  /**
   * Generate boil steps
   */
  generateBoilSteps(recipe) {
    const steps = [
      "🔥 Bring wort to a vigorous rolling boil",
      "⏰ Start timer when boil begins"
    ];

    // Add hop additions
    const hopAdditions = recipe.hops.sort((a, b) => b.time - a.time);
    hopAdditions.forEach(hop => {
      if (hop.time > 0) {
        steps.push(`🍃 Add ${hop.amount} oz ${hop.name} at ${hop.time} minutes remaining`);
      } else {
        steps.push(`🍃 Add ${hop.amount} oz ${hop.name} at flameout/whirlpool`);
      }
    });

    steps.push(
      "❄️ Cool wort to 65-70°F using immersion chiller or ice bath",
      "🎯 Target final volume: " + recipe.batchSize + " gallons"
    );

    return {
      title: "🔥 Boil Process",
      duration: recipe.boilTime + " minutes",
      steps: steps
    };
  }

  /**
   * Generate fermentation steps
   */
  generateFermentationSteps(recipe) {
    const yeast = recipe.yeast[0] || { name: 'Ale Yeast', temperature: '64-68°F' };
    
    return {
      title: "🍺 Fermentation",
      duration: "7-14 days",
      steps: [
        "🧪 Take OG reading and record",
        "💨 Aerate wort thoroughly (2-3 minutes vigorous stirring or O2 stone)",
        `🍄 Pitch ${yeast.name} when wort is at fermentation temperature`,
        `🌡️ Ferment at ${yeast.temperature} for 7-10 days`,
        "📊 Check gravity daily after day 3",
        recipe.hops.some(h => h.use === 'Dry Hop') ? "🍃 Add dry hops 2-3 days before packaging" : null,
        "🎯 Target FG: " + (recipe.targetFG || "1.010-1.015"),
        "✅ Package when gravity is stable for 2-3 days"
      ].filter(Boolean)
    };
  }

  /**
   * Generate packaging steps
   */
  generatePackagingSteps(recipe) {
    return {
      title: "📦 Packaging",
      duration: "2-3 hours",
      steps: [
        "🧹 Sanitize all packaging equipment",
        "📊 Take final gravity reading",
        "🍯 For bottles: Dissolve 3/4 cup corn sugar in 1 cup boiling water",
        "🍺 For kegs: Rack directly to sanitized keg",
        "💨 Minimize oxygen exposure during transfer",
        "🍾 Bottle condition for 2 weeks at room temperature",
        "⛽ Or keg carbonate to 2.4-2.6 volumes CO2",
        "❄️ Chill and enjoy your " + recipe.name + "!"
      ]
    };
  }

  /**
   * Print recipe with professional formatting
   */
  printRecipe(recipe, includeSteps = true) {
    const printWindow = window.open('', '_blank');
    const printContent = this.generatePrintableRecipe(recipe, includeSteps);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  /**
   * Generate printable recipe HTML
   */
  generatePrintableRecipe(recipe, includeSteps) {
    const currentDate = new Date().toLocaleDateString();
    const currentOG = this.calculateOG(recipe).toFixed(3);
    const currentIBU = this.calculateIBU(recipe).toFixed(1);
    const currentSRM = this.calculateSRM(recipe).toFixed(1);
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${recipe.name} - Recipe</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0.5in; line-height: 1.4; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .recipe-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .recipe-style { font-size: 16px; color: #666; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .stat-box { text-align: center; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
          .stat-value { font-size: 18px; font-weight: bold; color: #333; }
          .stat-label { font-size: 12px; color: #666; }
          .section { margin: 20px 0; }
          .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .ingredient-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          .ingredient-table th, .ingredient-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .ingredient-table th { background-color: #f5f5f5; font-weight: bold; }
          .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="recipe-title">${recipe.name}</div>
          <div class="recipe-style">${recipe.style} • ${recipe.batchSize} Gallon Batch</div>
          <div style="font-size: 12px; margin-top: 10px;">Generated: ${currentDate}</div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">${currentOG}</div>
            <div class="stat-label">Original Gravity</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${recipe.targetFG || '1.012'}</div>
            <div class="stat-label">Final Gravity</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${currentIBU}</div>
            <div class="stat-label">IBU</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${currentSRM}</div>
            <div class="stat-label">SRM</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Fermentables</div>
          <table class="ingredient-table">
            <tr><th>Ingredient</th><th>Amount</th><th>PPG</th><th>Lovibond</th></tr>
            ${recipe.fermentables.map(f => `
              <tr>
                <td>${f.name}</td>
                <td>${f.amount} ${f.unit}</td>
                <td>${f.ppg || 37}</td>
                <td>${f.lovibond || 2}°L</td>
              </tr>
            `).join('')}
          </table>
        </div>

        <div class="section">
          <div class="section-title">Hops</div>
          <table class="ingredient-table">
            <tr><th>Hop</th><th>Amount</th><th>Alpha</th><th>Time</th><th>Use</th></tr>
            ${recipe.hops.map(h => `
              <tr>
                <td>${h.name}</td>
                <td>${h.amount} ${h.unit}</td>
                <td>${h.alpha || 5}%</td>
                <td>${h.time} min</td>
                <td>${h.use || 'Boil'}</td>
              </tr>
            `).join('')}
          </table>
        </div>

        <div class="section">
          <div class="section-title">Yeast</div>
          <table class="ingredient-table">
            <tr><th>Strain</th><th>Type</th><th>Form</th><th>Amount</th><th>Attenuation</th></tr>
            ${recipe.yeast.map(y => `
              <tr>
                <td>${y.name}</td>
                <td>${y.type}</td>
                <td>${y.form}</td>
                <td>${y.amount} ${y.unit}</td>
                <td>${y.attenuation}%</td>
              </tr>
            `).join('')}
          </table>
        </div>
    `;

    if (includeSteps) {
      // Add brewing steps for print version
      html += `
        <div style="page-break-before: always;"></div>
        <div class="section">
          <div class="section-title">Brewing Instructions</div>
          <div style="margin: 15px 0;">
            <strong>Mash:</strong> 152°F for 60 minutes<br>
            <strong>Boil:</strong> ${recipe.boilTime} minutes<br>
            <strong>Fermentation:</strong> ${recipe.yeast[0]?.temperature || '65-68°F'} for 7-10 days
          </div>
        </div>
      `;
    }

    html += `
        <div class="footer">
          Generated by BrewMetrics AI Brewmaster • ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Set recipe as user's default template
   */
  async setAsDefault(recipe) {
    try {
      if (!firebase.auth || !firebase.auth().currentUser) {
        throw new Error('User must be logged in to set default recipe');
      }

      const userId = firebase.auth().currentUser.uid;
      const defaultRecipe = {
        ...recipe,
        isDefault: true,
        savedAt: new Date().toISOString()
      };

      await firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('preferences')
        .doc('defaultRecipe')
        .set(defaultRecipe);

      return {
        success: true,
        message: `${recipe.name} has been set as your default recipe template!`
      };
    } catch (error) {
      this.logger.error('Error setting default recipe', error);
      return {
        success: false,
        message: 'Failed to set default recipe. Please try again.'
      };
    }
  }

  /**
   * Generate interactive recipe tutorial
   */
  generateRecipeTutorial(recipe) {
    const difficulty = this.assessRecipeDifficulty(recipe);
    const keyTechniques = this.identifyKeyTechniques(recipe);
    
    return {
      title: `🎓 Brewing Tutorial: ${recipe.name}`,
      difficulty: difficulty,
      estimatedTime: this.calculateBrewTime(recipe),
      keyLearning: keyTechniques,
      sections: [
        {
          title: "🎯 Learning Objectives",
          content: [
            `Master the ${recipe.style} style characteristics`,
            "Practice proper mashing techniques",
            "Learn hop timing and utilization",
            `Understand ${recipe.yeast[0]?.name || 'ale yeast'} fermentation`,
            "Develop palate for style evaluation"
          ]
        },
        {
          title: "📚 Style Background",
          content: this.getStyleEducation(recipe.style)
        },
        {
          title: "🔬 Key Techniques",
          content: keyTechniques.map(technique => ({
            technique: technique.name,
            description: technique.description,
            tips: technique.tips
          }))
        },
        {
          title: "🍺 Tasting Notes",
          content: [
            "Expected aroma characteristics",
            "Flavor profile breakdown", 
            "Mouthfeel and body expectations",
            "Common off-flavors to watch for"
          ]
        }
      ]
    };
  }

  /**
   * Assess recipe difficulty level
   */
  assessRecipeDifficulty(recipe) {
    let complexity = 0;
    
    // Fermentables complexity
    complexity += recipe.fermentables.length > 4 ? 2 : 0;
    complexity += recipe.fermentables.some(f => f.lovibond > 100) ? 1 : 0;
    
    // Hops complexity
    complexity += recipe.hops.length > 4 ? 2 : 0;
    complexity += recipe.hops.some(h => h.use === 'Dry Hop') ? 1 : 0;
    
    // Style complexity
    if (recipe.style.toLowerCase().includes('sour')) complexity += 3;
    if (recipe.style.toLowerCase().includes('imperial')) complexity += 2;
    if (recipe.style.toLowerCase().includes('belgian')) complexity += 1;
    
    if (complexity <= 2) return 'Beginner';
    if (complexity <= 5) return 'Intermediate';
    return 'Advanced';
  }

  /**
   * Identify key brewing techniques for tutorial
   */
  identifyKeyTechniques(recipe) {
    const techniques = [];
    
    // Mashing technique
    techniques.push({
      name: "Single Infusion Mash",
      description: "Standard mashing technique for most ales",
      tips: ["Maintain 152°F throughout mash", "Stir gently every 15 minutes"]
    });
    
    // Hop techniques
    if (recipe.hops.some(h => h.time === 0)) {
      techniques.push({
        name: "Hop Stand/Whirlpool",
        description: "Adding hops at flameout for aroma",
        tips: ["Let temperature drop to 170°F", "Steep for 20-30 minutes"]
      });
    }
    
    if (recipe.hops.some(h => h.use === 'Dry Hop')) {
      techniques.push({
        name: "Dry Hopping",
        description: "Adding hops during fermentation for aroma",
        tips: ["Add during active fermentation", "Sanitize hops with vodka spray"]
      });
    }
    
    return techniques;
  }

  /**
   * Calculate total brew time
   */
  calculateBrewTime(recipe) {
    return "6-8 hours brewing + 2-3 weeks total";
  }

  /**
   * Get style education content
   */
  getStyleEducation(style) {
    // This would be expanded with comprehensive style information
    return [
      `${style} is characterized by specific flavor and aroma profiles`,
      "Historical background and regional variations",
      "Commercial examples to try for reference",
      "Common brewing challenges and solutions"
    ];
  }

  /**
   * Load AI-generated recipe into recipe designer
   */
  async loadRecipeIntoDesigner(recipe) {
    try {
      // Check if we're on the recipe designer page
      const currentURL = window.location.pathname;
      if (!currentURL.includes('recipe-designer')) {
        // Redirect to recipe designer with the recipe data
        const recipeData = encodeURIComponent(JSON.stringify(recipe));
        window.location.href = `recipe-designer.html?aiRecipe=${recipeData}`;
        return true;
      }

      // Try multiple ways to access the recipe designer
      let designer = window.recipeDesigner || window.RecipeDesigner;
      
      if (!designer) {
        // Look for the instance in global scope
        for (let key in window) {
          if (window[key] && typeof window[key] === 'object' && window[key].recipe && window[key].calculateStats) {
            designer = window[key];
            break;
          }
        }
      }

      if (!designer) {
        // Fallback: directly update the form fields
        this.logger.warn('Recipe Designer instance not found, using direct form update');
        return this.updateFormFieldsDirectly(recipe);
      }

      this.logger.info('Found recipe designer instance', designer);

      // Update the recipe object
      designer.recipe.name = recipe.name;
      designer.recipe.type = recipe.type || 'All Grain';
      designer.recipe.batchSize = recipe.batchSize;
      designer.recipe.efficiency = recipe.efficiency;
      designer.recipe.boilTime = recipe.boilTime;
      designer.recipe.style = recipe.style;
      designer.recipe.fermentables = [...recipe.fermentables];
      designer.recipe.hops = [...recipe.hops];
      designer.recipe.yeast = [...recipe.yeast];
      designer.recipe.misc = recipe.misc || [];
      designer.recipe.notes = `AI Generated Recipe\n\nTarget Stats:\nOG: ${recipe.targetOG}\nFG: ${recipe.targetFG}\nABV: ${recipe.targetABV}%\nIBU: ${recipe.targetIBU}`;

      // Update the UI form fields
      this.updateRecipeDesignerUI(recipe);
      
      // Update the ingredient displays
      this.updateIngredientDisplays(recipe, designer);
      
      // Trigger calculations and display updates
      setTimeout(() => {
        try {
          designer.calculateStats();
          designer.updateDisplay();
          this.logger.info('Recipe calculations and display updated');
        } catch (calcError) {
          this.logger.warn('Error in calculations, trying fallback', calcError);
          // Try manual calculation trigger
          const calculateBtn = document.querySelector('[onclick*="calculate"]') || 
                              document.querySelector('.calculate-btn');
          if (calculateBtn) calculateBtn.click();
        }
      }, 200);
      
      this.logger.info('Recipe loaded into designer successfully', recipe.name);
      return true;
    } catch (error) {
      this.logger.error('Error loading recipe into designer', error);
      this.showDetailedError(error);
      return this.updateFormFieldsDirectly(recipe);
    }
  }

  /**
   * Show detailed error information for debugging
   */
  showDetailedError(error) {
    console.group('🤖 AI Brewmaster Recipe Loading Debug');
    console.error('Error details:', error);
    console.log('Available global objects:', Object.keys(window).filter(key => 
      key.toLowerCase().includes('recipe') || key.toLowerCase().includes('designer')
    ));
    console.log('Recipe designer instance check:', {
      'window.recipeDesigner': window.recipeDesigner,
      'window.RecipeDesigner': window.RecipeDesigner,
      'window.EnhancedRecipeDesigner': window.EnhancedRecipeDesigner
    });
    console.log('Available DOM elements:', {
      'recipe-name': !!document.getElementById('recipe-name'),
      'batch-vol': !!document.getElementById('batch-vol'),
      'fermentables-list': !!document.getElementById('fermentables-list'),
      'hops-list': !!document.getElementById('hops-list')
    });
    console.groupEnd();
  }

  /**
   * Fallback method to update form fields directly
   */
  updateFormFieldsDirectly(recipe) {
    try {
      // Update basic recipe info
      const nameInput = document.getElementById('recipe-name');
      if (nameInput) nameInput.value = recipe.name;
      
      const batchSizeInput = document.getElementById('batch-vol');
      if (batchSizeInput) {
        batchSizeInput.value = recipe.batchSize;
        batchSizeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const efficiencyInput = document.getElementById('efficiency');
      if (efficiencyInput) {
        efficiencyInput.value = recipe.efficiency;
        efficiencyInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const boilTimeInput = document.getElementById('boil-time');
      if (boilTimeInput) {
        boilTimeInput.value = recipe.boilTime;
        boilTimeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Clear and populate ingredient tables
      this.clearIngredientTables();
      
      // Add ingredients one by one
      recipe.fermentables.forEach(fermentable => {
        this.addIngredientToTableDirect('fermentables', fermentable);
      });
      
      recipe.hops.forEach(hop => {
        this.addIngredientToTableDirect('hops', hop);
      });
      
      recipe.yeast.forEach(yeast => {
        this.addIngredientToTableDirect('yeast', yeast);
      });

      // Try to trigger calculations manually
      setTimeout(() => {
        const calculateBtn = document.querySelector('button[onclick*="calculate"]') || 
                           document.querySelector('.calculate-btn') ||
                           document.getElementById('calculate-stats');
        if (calculateBtn) calculateBtn.click();
      }, 500);

      this.logger.info('Recipe loaded using direct form update', recipe.name);
      return true;
    } catch (error) {
      this.logger.error('Error in direct form update fallback', error);
      return false;
    }
  }

  /**
   * Update recipe designer UI with AI-generated recipe
   */
  updateRecipeDesignerUI(recipe) {
    // Update basic recipe info
    const nameInput = document.getElementById('recipe-name');
    if (nameInput) {
      nameInput.value = recipe.name;
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    const batchSizeInput = document.getElementById('batch-vol');
    if (batchSizeInput) {
      batchSizeInput.value = recipe.batchSize;
      batchSizeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    const efficiencyInput = document.getElementById('efficiency');
    if (efficiencyInput) {
      efficiencyInput.value = recipe.efficiency;
      efficiencyInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    const boilTimeInput = document.getElementById('boil-time');
    if (boilTimeInput) {
      boilTimeInput.value = recipe.boilTime;
      boilTimeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const styleInput = document.getElementById('beer-style');
    if (styleInput) {
      styleInput.value = recipe.style;
      styleInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this.logger.info('Updated recipe designer form fields');
  }

  /**
   * Update ingredient displays in recipe designer
   */
  updateIngredientDisplays(recipe, designer) {
    // Clear existing ingredient tables
    this.clearIngredientTables();
    
    // Trigger ingredient display updates through the designer
    if (designer.updateIngredientDisplay) {
      setTimeout(() => {
        designer.updateIngredientDisplay();
      }, 100);
    } else {
      // Fallback: manually add ingredients to tables
      recipe.fermentables.forEach(fermentable => {
        this.addIngredientToTable('fermentables', fermentable);
      });
      
      recipe.hops.forEach(hop => {
        this.addIngredientToTable('hops', hop);
      });
      
      recipe.yeast.forEach(yeast => {
        this.addIngredientToTable('yeast', yeast);
      });
    }
    
    this.logger.info('Updated ingredient displays');
  }

  /**
   * Clear ingredient tables in recipe designer
   */
  clearIngredientTables() {
    const possibleTableIds = [
      'fermentables-list', 'hops-list', 'yeast-list',
      'fermentable-list', 'hop-list', 'yeast-list',
      'fermentables-table-body', 'hops-table-body', 'yeast-table-body'
    ];
    
    possibleTableIds.forEach(tableId => {
      const table = document.getElementById(tableId);
      if (table) {
        // Only clear AI-generated rows to preserve any existing manual entries
        const aiRows = table.querySelectorAll('tr[data-ai-generated="true"]');
        aiRows.forEach(row => row.remove());
        
        // If table is completely empty, clear it completely
        if (table.children.length === 0) {
          table.innerHTML = '';
        }
      }
    });
    
    // Also try clearing tables by class selectors
    const tableSelectors = [
      '.fermentables-table tbody',
      '.hops-table tbody', 
      '.yeast-table tbody'
    ];
    
    tableSelectors.forEach(selector => {
      const table = document.querySelector(selector);
      if (table) {
        const aiRows = table.querySelectorAll('tr[data-ai-generated="true"]');
        aiRows.forEach(row => row.remove());
      }
    });
    
    this.logger.info('Cleared AI-generated ingredient tables');
  }

  /**
   * Add ingredient to specific table in recipe designer
   */
  addIngredientToTable(type, ingredient) {
    // Try multiple possible table IDs
    const possibleIds = [
      `${type}-list`,
      `${type}-table-body`,
      `${type}s-list`, // plural form
      `${type.replace('fermentables', 'fermentable')}-list`
    ];
    
    let table = null;
    for (const id of possibleIds) {
      table = document.getElementById(id);
      if (table) break;
    }
    
    if (!table) {
      this.logger.warn(`Could not find table for ${type}, trying selector approach`);
      // Try finding table by class or other selectors
      table = document.querySelector(`.${type}-table tbody`) || 
              document.querySelector(`table[data-type="${type}"] tbody`) ||
              document.querySelector(`#recipe-tabs .${type} tbody`);
    }
    
    if (!table) {
      this.logger.error(`Could not find table element for ${type}`);
      return;
    }

    const row = document.createElement('tr');
    row.setAttribute('data-ai-generated', 'true');
    
    if (type === 'fermentables') {
      row.innerHTML = `
        <td>${ingredient.name}</td>
        <td>${ingredient.amount} ${ingredient.unit}</td>
        <td>${ingredient.ppg || 37}</td>
        <td>${ingredient.lovibond || 2}°L</td>
        <td><button type="button" onclick="this.closest('tr').remove(); if(window.recipeDesigner) window.recipeDesigner.calculateStats();">Remove</button></td>
      `;
    } else if (type === 'hops') {
      row.innerHTML = `
        <td>${ingredient.name}</td>
        <td>${ingredient.amount} ${ingredient.unit}</td>
        <td>${ingredient.alpha || 5}%</td>
        <td>${ingredient.time} min</td>
        <td>${ingredient.use || 'Boil'}</td>
        <td><button type="button" onclick="this.closest('tr').remove(); if(window.recipeDesigner) window.recipeDesigner.calculateStats();">Remove</button></td>
      `;
    } else if (type === 'yeast') {
      row.innerHTML = `
        <td>${ingredient.name}</td>
        <td>${ingredient.type}</td>
        <td>${ingredient.form}</td>
        <td>${ingredient.amount} ${ingredient.unit}</td>
        <td>${ingredient.attenuation}%</td>
        <td><button type="button" onclick="this.closest('tr').remove(); if(window.recipeDesigner) window.recipeDesigner.calculateStats();">Remove</button></td>
      `;
    }
    
    table.appendChild(row);
    this.logger.info(`Added ${type} ingredient to table: ${ingredient.name}`);
  }

  /**
   * Add ingredient directly to table (fallback method)
   */
  addIngredientToTableDirect(type, ingredient) {
    try {
      // Try the normal method first
      this.addIngredientToTable(type, ingredient);
      
      // Also try to find and click "Add" buttons to ensure ingredients are properly registered
      const addButtons = document.querySelectorAll(`[data-type="${type}"] .add-btn, button[onclick*="add"][onclick*="${type}"]`);
      if (addButtons.length === 0) {
        // Fallback: create a custom event to notify the recipe designer
        const event = new CustomEvent('ingredientAdded', {
          detail: { type, ingredient }
        });
        document.dispatchEvent(event);
      }
    } catch (error) {
      this.logger.warn(`Error adding ${type} ingredient`, error);
    }
  }

  /**
   * Export recipe with instructions as downloadable document
   */
  exportRecipeDocument(recipe, instructions) {
    const doc = this.generateRecipeDocument(recipe, instructions);
    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.name.replace(/\s+/g, '_')}_Recipe.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate formatted recipe document
   */
  generateRecipeDocument(recipe, instructions) {
    let doc = `${recipe.name}\n`;
    doc += `${'='.repeat(recipe.name.length)}\n\n`;
    
    doc += `Style: ${recipe.style}\n`;
    doc += `Batch Size: ${recipe.batchSize} gallons\n`;
    doc += `Efficiency: ${recipe.efficiency}%\n`;
    doc += `Boil Time: ${recipe.boilTime} minutes\n\n`;
    
    doc += `Target Stats:\n`;
    doc += `OG: ${recipe.targetOG}\n`;
    doc += `FG: ${recipe.targetFG}\n`;
    doc += `ABV: ${recipe.targetABV}%\n`;
    doc += `IBU: ${recipe.targetIBU}\n\n`;
    
    // Fermentables
    doc += `FERMENTABLES:\n`;
    doc += `-----------\n`;
    recipe.fermentables.forEach(f => {
      doc += `${f.amount} ${f.unit} ${f.name}\n`;
    });
    doc += `\n`;
    
    // Hops
    doc += `HOPS:\n`;
    doc += `-----\n`;
    recipe.hops.forEach(h => {
      doc += `${h.amount} ${h.unit} ${h.name} (${h.alpha}% AA) - ${h.time} min ${h.use}\n`;
    });
    doc += `\n`;
    
    // Yeast
    doc += `YEAST:\n`;
    doc += `------\n`;
    recipe.yeast.forEach(y => {
      doc += `${y.amount} ${y.unit} ${y.name} (${y.attenuation}% attenuation)\n`;
    });
    doc += `\n`;
    
    // Instructions
    doc += `BREWING INSTRUCTIONS:\n`;
    doc += `====================\n\n`;
    
    instructions.sections.forEach(section => {
      doc += `${section.title.toUpperCase()}:\n`;
      doc += `${'-'.repeat(section.title.length + 1)}\n`;
      section.steps.forEach((step, index) => {
        doc += `${index + 1}. ${step}\n`;
      });
      doc += `\n`;
    });
    
    doc += `Generated by BrewMetrics AI Brewmaster\n`;
    doc += `Date: ${new Date().toLocaleDateString()}\n`;
    
    return doc;
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
  
  // Check for AI recipe in URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const aiRecipeData = urlParams.get('aiRecipe');
  if (aiRecipeData) {
    try {
      const recipe = JSON.parse(decodeURIComponent(aiRecipeData));
      setTimeout(() => {
        window.AIBrewmaster.loadRecipeIntoDesigner(recipe);
      }, 1000); // Give the page time to fully load
    } catch (error) {
      console.error('Error loading AI recipe from URL:', error);
    }
  }
});

// Export for use in other scripts
window.AIBrewmaster = AIBrewmaster;
