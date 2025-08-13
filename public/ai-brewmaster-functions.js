// AI Brewmaster Specialized Functions
// Dedicated brewing analysis and recipe generation functions

class AIBrewmasterFunctions {
  constructor(aiBrewmaster) {
    this.ai = aiBrewmaster;
  }

  /**
   * Analyze batch ratings vs expected response
   */
  async analyzeBatchRatings(batchId) {
    try {
      const batchData = await this.getBatchData(batchId);
      if (!batchData) return this.errorResponse("Couldn't load batch data");

      const analysis = this.performRatingAnalysis(batchData);
      return this.formatAnalysisResponse(analysis, batchData);
    } catch (error) {
      return this.errorResponse("Analysis failed: " + error.message);
    }
  }

  /**
   * Generate new recipe based on style and preferences
   */
  async generateRecipe(style, preferences = {}) {
    const personality = window.advancedBrewingMastery?.personality;
    const intro = personality ? this.getRandomElement(personality.expertise.advanced) : "Here's a dialed-in recipe for you:";

    const recipe = await this.createRecipeFromStyle(style, preferences);
    return {
      summary: `${intro}\n\n${this.formatRecipe(recipe)}`,
      suggestions: ["Enhance this recipe", "Make it experimental", "Scale to different size"],
      action: "recipe-generated"
    };
  }

  /**
   * Enhance existing recipe with advanced techniques
   */
  async enhanceRecipe(currentRecipe) {
    const personality = window.advancedBrewingMastery?.personality;
    const intro = personality ? this.getRandomElement(personality.expertise.experimental) : "Let's take this recipe to the next level:";

    const enhancements = this.generateEnhancements(currentRecipe);
    return {
      summary: `${intro}\n\n${enhancements}`,
      suggestions: ["Apply enhancements", "Try experimental version", "Analyze potential issues"],
      action: "recipe-enhanced"
    };
  }

  /**
   * Create experimental recipe variation
   */
  async createExperimentalRecipe(baseStyle, experimentType = "hop") {
    const personality = window.advancedBrewingMastery?.personality;
    const intro = personality ? this.getRandomElement(personality.expertise.experimental) : "Ready to push some boundaries?";

    const experimental = this.generateExperimentalVariation(baseStyle, experimentType);
    return {
      summary: `${intro}\n\n${experimental}`,
      suggestions: ["Refine experiment", "Calculate risks", "Plan backup batch"],
      action: "experimental-created"
    };
  }

  /**
   * Troubleshoot batch issues based on feedback
   */
  async troubleshootBatch(batchData, issues) {
    const personality = window.advancedBrewingMastery?.personality;
    const intro = personality ? this.getRandomElement(personality.expertise.troubleshooting) : "Let me diagnose what went sideways:";

    const diagnosis = this.diagnoseBatchIssues(batchData, issues);
    return {
      summary: `${intro}\n\n${diagnosis}`,
      suggestions: ["Fix current batch", "Prevent in future", "Adjust recipe"],
      action: "batch-diagnosed"
    };
  }

  // Helper methods
  async getBatchData(batchId) {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      const db = firebase.firestore();
      const doc = await db.collection('batches').doc(batchId).get();
      return doc.exists ? doc.data() : null;
    }
    return null;
  }

  performRatingAnalysis(batchData) {
    const ratings = batchData.ratings || [];
    const avgRating = ratings.reduce((sum, r) => sum + r.overall, 0) / ratings.length;
    const expectedRating = this.getExpectedRating(batchData.style);
    
    return {
      actual: avgRating,
      expected: expectedRating,
      variance: avgRating - expectedRating,
      issues: this.identifyIssues(ratings, batchData),
      recommendations: this.generateRecommendations(ratings, batchData)
    };
  }

  formatAnalysisResponse(analysis, batchData) {
    const personality = window.advancedBrewingMastery?.personality;
    let response = "";

    if (analysis.variance < -0.5) {
      response = personality ? this.getRandomElement(personality.expertise.troubleshooting) : "Houston, we have a problem.";
    } else if (analysis.variance > 0.3) {
      response = personality ? this.getRandomElement(personality.encouragement) : "Solid brewing!";
    }

    response += `\n\n**Batch Analysis: ${batchData.name}**\n`;
    response += `- **Actual Rating**: ${analysis.actual.toFixed(1)}/5.0\n`;
    response += `- **Expected Rating**: ${analysis.expected.toFixed(1)}/5.0\n`;
    response += `- **Performance**: ${analysis.variance > 0 ? '+' : ''}${analysis.variance.toFixed(1)} points\n\n`;

    if (analysis.issues.length > 0) {
      response += `**Identified Issues:**\n`;
      analysis.issues.forEach(issue => response += `- ${issue}\n`);
      response += `\n`;
    }

    response += `**Recommendations:**\n`;
    analysis.recommendations.forEach(rec => response += `- ${rec}\n`);

    return {
      summary: response,
      suggestions: ["Fix recipe", "Adjust process", "Try experimental approach"],
      action: "batch-analyzed"
    };
  }

  createRecipeFromStyle(style, preferences) {
    const recipes = {
      "American IPA": {
        fermentables: [
          { name: "Pale 2-Row", amount: 10, unit: "lbs" },
          { name: "Crystal 40L", amount: 1, unit: "lb" }
        ],
        hops: [
          { name: "Chinook", amount: 1, time: 60, alpha: 13 },
          { name: "Citra", amount: 1, time: 0, alpha: 12 },
          { name: "Mosaic", amount: 1, time: "dry hop", alpha: 12 }
        ],
        yeast: "US-05",
        og: 1.062, fg: 1.012, abv: 6.5, ibu: 65
      }
    };
    return recipes[style] || recipes["American IPA"];
  }

  formatRecipe(recipe) {
    let formatted = `**${recipe.fermentables.length > 0 ? 'Grain Bill' : 'Recipe'}:**\n`;
    recipe.fermentables?.forEach(f => formatted += `- ${f.amount} ${f.unit} ${f.name}\n`);
    
    formatted += `\n**Hop Schedule:**\n`;
    recipe.hops?.forEach(h => formatted += `- ${h.amount} oz ${h.name} @ ${h.time}${typeof h.time === 'number' ? ' min' : ''}\n`);
    
    formatted += `\n**Yeast:** ${recipe.yeast}\n`;
    formatted += `**Stats:** OG ${recipe.og}, FG ${recipe.fg}, ABV ${recipe.abv}%, IBU ${recipe.ibu}`;
    
    return formatted;
  }

  generateEnhancements(recipe) {
    return `**Recipe Enhancements:**

**Advanced Hop Techniques:**
- Replace 50% dry hops with Cryo hops for intense aroma
- Add biotransformation dry hop at 1.020 SG
- Implement hop stand at 170°F for 30 minutes

**Malt Complexity:**
- Add 0.5 lb Munich malt for depth
- Include 2% Aromatic malt for complexity
- Consider 3% flaked oats for mouthfeel

**Process Optimization:**
- Step mash: 148°F (30min) → 158°F (15min)
- Fermentation: Start at 64°F, free rise to 68°F
- Spund at 12 PSI for natural carbonation

**Water Chemistry:**
- Target 150ppm sulfate, 75ppm chloride
- Adjust to pH 5.3 with lactic acid
- Add 1g gypsum per gallon for hop character`;
  }

  generateExperimentalVariation(style, type) {
    const experiments = {
      hop: `**Experimental Hop Technique: Hop Hash Integration**

- Replace 25% of dry hops with hop hash
- Add at high krausen for biotransformation
- Expect 40% more intense aroma compounds
- Risk: Potential vegetal character if overdone

**Innovation Points:**
- Lupulin powder concentration
- Enhanced oil extraction
- Reduced plant matter
- Shorter contact time needed`,

      yeast: `**Experimental Yeast: Kveik Hybrid Fermentation**

- Primary: 70% US-05, 30% Voss Kveik
- Fermentation: 75°F for 48 hours
- Expect: Clean but fruity character
- Risk: Potential ester overproduction

**Innovation Points:**
- Rapid fermentation
- Unique flavor profile
- Temperature tolerance
- Reduced diacetyl risk`
    };
    
    return experiments[type] || experiments.hop;
  }

  diagnoseBatchIssues(batchData, issues) {
    return `**Batch Diagnosis: ${batchData.name}**

**Primary Issues Identified:**
${issues.map(issue => `- ${issue}`).join('\n')}

**Root Cause Analysis:**
- **Process Deviation**: Check mash temp, fermentation control
- **Ingredient Quality**: Verify hop freshness, yeast viability  
- **Water Chemistry**: Confirm pH, mineral content
- **Sanitation**: Review cleaning protocols

**Immediate Actions:**
1. Document all process parameters
2. Test remaining ingredients
3. Review temperature logs
4. Check equipment calibration

**Prevention Strategy:**
- Implement stricter process controls
- Upgrade temperature monitoring
- Establish ingredient QC protocols
- Create batch documentation system`;
  }

  getExpectedRating(style) {
    const expectations = {
      "American IPA": 4.2,
      "Hazy IPA": 4.3,
      "Stout": 4.0,
      "Pilsner": 3.9
    };
    return expectations[style] || 4.0;
  }

  identifyIssues(ratings, batchData) {
    const issues = [];
    const avgRatings = this.calculateAverageRatings(ratings);
    
    if (avgRatings.aroma < 3.5) issues.push("Poor hop aroma - check hop freshness and dry hop technique");
    if (avgRatings.flavor < 3.5) issues.push("Flavor issues - review recipe balance and fermentation");
    if (avgRatings.mouthfeel < 3.5) issues.push("Mouthfeel problems - check mash temperature and grain bill");
    
    return issues;
  }

  generateRecommendations(ratings, batchData) {
    return [
      "Increase late hop additions for better aroma",
      "Adjust mash temperature for improved body",
      "Consider water chemistry modifications",
      "Review fermentation temperature control"
    ];
  }

  calculateAverageRatings(ratings) {
    const totals = { aroma: 0, flavor: 0, mouthfeel: 0 };
    ratings.forEach(r => {
      totals.aroma += r.aroma || 0;
      totals.flavor += r.flavor || 0;
      totals.mouthfeel += r.mouthfeel || 0;
    });
    
    const count = ratings.length || 1;
    return {
      aroma: totals.aroma / count,
      flavor: totals.flavor / count,
      mouthfeel: totals.mouthfeel / count
    };
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  errorResponse(message) {
    return {
      summary: `Hmm, ran into an issue: ${message}. Let's try a different approach.`,
      suggestions: ["Try again", "Check data", "Manual analysis"],
      action: "error"
    };
  }
}

// Export for use
window.AIBrewmasterFunctions = AIBrewmasterFunctions;