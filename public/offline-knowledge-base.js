// Offline Knowledge Base System
// Loads and indexes brewing knowledge for offline AI Assistant functionality

class OfflineKnowledgeBase {
  constructor() {
    this.knowledgeIndex = new Map();
    this.isLoaded = false;
    this.loadingPromise = null;
    
    // Knowledge base structure
    this.knowledgeStructure = {
      styles: [
        'american_ipa.md', 'american_porter.md', 'american_wheat.md', 
        'german_pilsner.md', 'hazy_ipa.md', 'imperial_stout.md', 
        'saison.md', 'sour_ale.md'
      ],
      troubleshooting: [
        'astringency.md', 'diacetyl.md', 'excessive_alcohol_heat.md',
        'excessive_bitterness.md', 'harsh_roasted_bitterness.md',
        'infection_prevention.md', 'infection.md', 'off_flavor_acetaldehyde.md',
        'off_flavor_diacetyl.md', 'off_flavor_fusel_alcohols.md',
        'off_flavor_phenols.md', 'off_flavor_sulfur.md', 'oxidation.md',
        'poor_head_retention.md', 'poor_hop_aroma.md', 
        'stuck_sluggish_fermentation.md', 'thin_body.md', 'wild_yeast_bacteria.md'
      ],
      ingredients: {
        hops: [
          'amarillo.md', 'azacca.md', 'cascade.md', 'centennial.md',
          'chinook.md', 'citra.md', 'columbus.md', 'idaho_7.md',
          'magnum_us.md', 'mosaic.md', 'nugget.md', 'sabro.md',
          'simcoe.md', 'talus.md', 'willamette.md'
        ],
        yeast: [
          'safale_us05.md'
        ]
      },
      guides: [
        'advanced_brewing_techniques.md', 'commercial_brewing_guide.md',
        'dry_hopping_guide.md', 'equipment_optimization.md',
        'modern_brewing_innovations.md', 'recipe_formulation_mastery.md',
        'sensory_analysis_guide.md', 'water_chemistry_guide.md'
      ]
    };
  }

  /**
   * Initialize and load knowledge base
   */
  async initialize() {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadKnowledgeBase();
    return this.loadingPromise;
  }

  /**
   * Load all knowledge base files
   */
  async loadKnowledgeBase() {
    try {
      console.log('🧠 Loading offline knowledge base...');
      
      // Load beer styles
      await this.loadSection('styles', this.knowledgeStructure.styles);
      
      // Load troubleshooting guides
      await this.loadSection('troubleshooting', this.knowledgeStructure.troubleshooting);
      
      // Load ingredient information
      await this.loadSection('ingredients/hops', this.knowledgeStructure.ingredients.hops);
      await this.loadSection('ingredients/yeast', this.knowledgeStructure.ingredients.yeast);
      
      // Load brewing guides
      await this.loadSection('', this.knowledgeStructure.guides);
      
      // Load expanded brewing knowledge
      this.loadExpandedKnowledge();
      
      // Load advanced brewing mastery
      this.loadAdvancedMastery();
      
      // Create search index
      this.createSearchIndex();
      
      this.isLoaded = true;
      console.log(`✅ Knowledge base loaded: ${this.knowledgeIndex.size} documents indexed`);
      
    } catch (error) {
      console.error('❌ Failed to load knowledge base:', error);
      // Create fallback knowledge for offline use
      this.createFallbackKnowledge();
    }
  }

  /**
   * Load a section of knowledge files
   */
  async loadSection(section, files) {
    const basePath = '/AI-Brewmaster_Knowledge_Base';
    const sectionPath = section ? `${basePath}/${section}` : basePath;
    
    for (const file of files) {
      try {
        const response = await fetch(`${sectionPath}/${file}`);
        if (response.ok) {
          const content = await response.text();
          const key = section ? `${section}/${file}` : file;
          this.knowledgeIndex.set(key, {
            content,
            section,
            filename: file,
            title: this.extractTitle(content),
            keywords: this.extractKeywords(content, file)
          });
        }
      } catch (error) {
        console.warn(`Could not load ${file}:`, error.message);
      }
    }
  }

  /**
   * Extract title from markdown content
   */
  extractTitle(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : 'Brewing Knowledge';
  }

  /**
   * Extract keywords from content and filename
   */
  extractKeywords(content, filename) {
    const keywords = new Set();
    
    // Add filename-based keywords
    const nameKeywords = filename.replace(/\.md$/, '').split(/[_-]/).filter(k => k.length > 2);
    nameKeywords.forEach(k => keywords.add(k.toLowerCase()));
    
    // Extract headers as keywords
    const headers = content.match(/^#+\s+(.+)$/gm) || [];
    headers.forEach(header => {
      const text = header.replace(/^#+\s+/, '').toLowerCase();
      text.split(/\s+/).forEach(word => {
        if (word.length > 3) keywords.add(word);
      });
    });
    
    // Add common brewing terms if found
    const brewingTerms = [
      'hop', 'hops', 'malt', 'grain', 'yeast', 'fermentation', 'mash', 'boil',
      'ipa', 'stout', 'porter', 'lager', 'ale', 'wheat', 'pilsner', 'bitter',
      'aroma', 'flavor', 'bitterness', 'ibu', 'srm', 'abv', 'og', 'fg'
    ];
    
    brewingTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        keywords.add(term);
      }
    });
    
    return Array.from(keywords);
  }

  /**
   * Create search index for fast lookups
   */
  createSearchIndex() {
    this.searchIndex = new Map();
    
    for (const [key, doc] of this.knowledgeIndex) {
      // Index by keywords
      doc.keywords.forEach(keyword => {
        if (!this.searchIndex.has(keyword)) {
          this.searchIndex.set(keyword, []);
        }
        this.searchIndex.get(keyword).push(key);
      });
      
      // Index by title words
      const titleWords = doc.title.toLowerCase().split(/\s+/);
      titleWords.forEach(word => {
        if (word.length > 2) {
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, []);
          }
          this.searchIndex.get(word).push(key);
        }
      });
    }
  }

  /**
   * Search knowledge base
   */
  search(query, maxResults = 5) {
    if (!this.isLoaded) {
      return this.getFallbackResponse(query);
    }

    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const results = new Map();
    
    // Score documents based on keyword matches
    queryWords.forEach(word => {
      // Exact matches
      if (this.searchIndex.has(word)) {
        this.searchIndex.get(word).forEach(docKey => {
          results.set(docKey, (results.get(docKey) || 0) + 2);
        });
      }
      
      // Partial matches
      for (const [keyword, docKeys] of this.searchIndex) {
        if (keyword.includes(word) || word.includes(keyword)) {
          docKeys.forEach(docKey => {
            results.set(docKey, (results.get(docKey) || 0) + 1);
          });
        }
      }
    });
    
    // Sort by relevance and return top results
    const sortedResults = Array.from(results.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxResults)
      .map(([key]) => this.knowledgeIndex.get(key));
    
    return sortedResults;
  }

  /**
   * Get specific document by key
   */
  getDocument(key) {
    return this.knowledgeIndex.get(key);
  }

  /**
   * Get documents by section
   */
  getDocumentsBySection(section) {
    const docs = [];
    for (const [key, doc] of this.knowledgeIndex) {
      if (doc.section === section) {
        docs.push(doc);
      }
    }
    return docs;
  }

  /**
   * Generate response from search results with brewmaster personality
   */
  generateResponse(query, searchResults) {
    if (!searchResults || searchResults.length === 0) {
      return this.getFallbackResponse(query);
    }

    // Combine relevant content from top results
    let response = '';
    const topResult = searchResults[0];
    
    if (topResult) {
      // Extract relevant sections from the top result
      const content = topResult.content;
      const sections = this.extractRelevantSections(content, query);
      
      if (sections.length > 0) {
        response = sections.join('\n\n');
      } else {
        // Use first few paragraphs if no specific sections found
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
        response = paragraphs.slice(0, 3).join('\n\n');
      }
    }

    // Add brewmaster personality
    response = this.addBrewmasterPersonality(response, query, topResult);

    return {
      summary: response || this.getFallbackResponse(query).summary,
      results: searchResults.map(doc => ({
        title: doc.title,
        snippet: this.extractSnippet(doc.content, query),
        source: doc.filename,
        section: doc.section
      })),
      suggestions: this.generateSuggestions(query, searchResults),
      totalResults: searchResults.length
    };
  }

  /**
   * Extract relevant sections based on query
   */
  extractRelevantSections(content, query) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const sections = content.split(/\n(?=#+\s)/); // Split on headers
    const relevantSections = [];
    
    sections.forEach(section => {
      const sectionLower = section.toLowerCase();
      const matches = queryWords.filter(word => sectionLower.includes(word));
      
      if (matches.length > 0) {
        relevantSections.push(section.trim());
      }
    });
    
    return relevantSections.slice(0, 2); // Return top 2 most relevant sections
  }

  /**
   * Extract snippet from content
   */
  extractSnippet(content, query, maxLength = 200) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const sentences = content.split(/[.!?]+/);
    
    // Find sentence with most query word matches
    let bestSentence = sentences[0] || '';
    let maxMatches = 0;
    
    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase();
      const matches = queryWords.filter(word => sentenceLower.includes(word)).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence;
      }
    });
    
    // Truncate if too long
    if (bestSentence.length > maxLength) {
      bestSentence = bestSentence.substring(0, maxLength) + '...';
    }
    
    return bestSentence.trim();
  }

  /**
   * Generate related suggestions
   */
  generateSuggestions(query, searchResults) {
    const suggestions = [];
    const queryLower = query.toLowerCase();
    
    // Context-aware suggestions based on query content
    if (queryLower.includes('hop') || queryLower.includes('bitter')) {
      suggestions.push('How do I balance hop bitterness?');
      suggestions.push('What are the best hop varieties for IPAs?');
    }
    
    if (queryLower.includes('yeast') || queryLower.includes('ferment')) {
      suggestions.push('How do I troubleshoot fermentation issues?');
      suggestions.push('What yeast strain should I use?');
    }
    
    if (queryLower.includes('water') || queryLower.includes('chemistry')) {
      suggestions.push('How do I adjust my water chemistry?');
      suggestions.push('What water profile fits my beer style?');
    }
    
    if (queryLower.includes('off') && queryLower.includes('flavor')) {
      suggestions.push('How do I prevent diacetyl off-flavors?');
      suggestions.push('What causes astringency in beer?');
    }
    
    // Add suggestions based on search results
    if (searchResults.length > 0) {
      const topResult = searchResults[0];
      if (topResult.section === 'styles') {
        suggestions.push(`How do I brew a perfect ${topResult.title}?`);
      } else if (topResult.section === 'troubleshooting') {
        suggestions.push('What are other common brewing problems?');
      }
    }
    
    // Default suggestions if none found
    if (suggestions.length === 0) {
      suggestions.push(
        'How do I improve my beer quality?',
        'What are common brewing mistakes?',
        'How do I troubleshoot off-flavors?'
      );
    }
    
    return suggestions.slice(0, 3);
  }

  /**
   * Create fallback knowledge for when files can't be loaded
   */
  createFallbackKnowledge() {
    const fallbackDocs = {
      'american_ipa.md': {
        content: `# American IPA\n\nAmerican IPA is characterized by citrusy, piney hop character with a solid malt backbone.\n\n## Key Characteristics\n- ABV: 5.5-7.5%\n- IBU: 40-70\n- SRM: 6-14\n\n## Brewing Tips\n- Use American hop varieties like Cascade, Centennial, Chinook\n- Mash at 150-152°F for good attenuation\n- Dry hop for maximum aroma`,
        section: 'styles',
        filename: 'american_ipa.md',
        title: 'American IPA',
        keywords: ['ipa', 'american', 'hops', 'citrus', 'pine', 'bitter']
      },
      'diacetyl.md': {
        content: `# Diacetyl Off-Flavor\n\nDiacetyl produces a buttery, butterscotch flavor that is generally undesirable in most beer styles.\n\n## Causes\n- Incomplete fermentation\n- Bacterial contamination\n- Premature packaging\n\n## Prevention\n- Ensure complete fermentation\n- Perform diacetyl rest at 65-68°F\n- Maintain proper sanitation`,
        section: 'troubleshooting',
        filename: 'diacetyl.md',
        title: 'Diacetyl Off-Flavor',
        keywords: ['diacetyl', 'buttery', 'off-flavor', 'fermentation', 'contamination']
      }
    };
    
    for (const [key, doc] of Object.entries(fallbackDocs)) {
      this.knowledgeIndex.set(key, doc);
    }
    
    this.createSearchIndex();
    this.isLoaded = true;
    console.log('📚 Fallback knowledge base created');
  }

  /**
   * Add brewmaster personality to responses
   */
  addBrewmasterPersonality(response, query, topResult) {
    const personality = window.expandedBrewingKnowledge?.personality;
    const mastery = window.advancedBrewingMastery?.personality;
    if (!personality && !mastery) return response;

    const queryLower = query.toLowerCase();
    let intro = '';
    let outro = '';

    // Choose appropriate intro based on query type and complexity
    if (queryLower.includes('chemistry') || queryLower.includes('formula') || queryLower.includes('advanced')) {
      intro = mastery ? this.getRandomElement(mastery.expertise.advanced) + ' ' : '';
    } else if (queryLower.includes('experimental') || queryLower.includes('innovation')) {
      intro = mastery ? this.getRandomElement(mastery.expertise.experimental) + ' ' : '';
    } else if (queryLower.includes('problem') || queryLower.includes('troubleshoot') || queryLower.includes('fix')) {
      intro = mastery ? this.getRandomElement(mastery.expertise.troubleshooting) + ' ' : 
              personality ? this.getRandomElement(personality.warnings) + ' ' : '';
    } else if (queryLower.includes('help') || queryLower.includes('how')) {
      intro = personality ? this.getRandomElement(personality.expertise.collaborative) + ' ' : '';
    } else if (queryLower.includes('recipe') || queryLower.includes('brew')) {
      intro = personality ? this.getRandomElement(personality.expertise.confident) + ' ' : '';
    }

    // Add encouraging outro for complex topics
    if (topResult && (topResult.section === 'troubleshooting' || topResult.section === 'chemistry' || queryLower.includes('advanced'))) {
      outro = ' ' + (mastery ? this.getRandomElement(mastery.encouragement) : 
                    personality ? this.getRandomElement(personality.encouragement) : '');
    } else if (topResult && topResult.section === 'styles') {
      outro = ' ' + (personality ? this.getRandomElement(personality.passion) : '');
    }

    return intro + response + outro;
  }

  /**
   * Get random element from array
   */
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get fallback response when no results found
   */
  getFallbackResponse(query) {
    const queryLower = query.toLowerCase();
    const personality = window.expandedBrewingKnowledge?.personality;
    
    let response = "";
    
    // Add personality greeting
    if (personality) {
      response = this.getRandomElement(personality.greetings) + ' ';
    }
    
    response += "I have access to brewing knowledge but couldn't find specific information about that topic. ";
    
    if (queryLower.includes('recipe')) {
      response += "For recipes, I can help you with grain bills, hop schedules, and yeast selection for various beer styles.";
    } else if (queryLower.includes('troubleshoot') || queryLower.includes('problem')) {
      response += "For troubleshooting, I can help with common issues like off-flavors, fermentation problems, and process optimization.";
    } else if (queryLower.includes('hop')) {
      response += "For hops, I can provide information about varieties, usage rates, and timing for different beer styles.";
    } else {
      response += "Try asking about specific beer styles, brewing techniques, or troubleshooting issues.";
    }
    
    return {
      summary: response,
      results: [],
      suggestions: [
        'How do I make an American IPA?',
        'What causes off-flavors in beer?',
        'How do I troubleshoot fermentation issues?'
      ],
      totalResults: 0
    };
  }

  /**
   * Load expanded brewing knowledge from brewing_knowledge_expansion.js
   */
  loadExpandedKnowledge() {
    if (window.expandedBrewingKnowledge) {
      const expanded = window.expandedBrewingKnowledge;
      
      // Add recipe knowledge
      Object.entries(expanded.recipes || {}).forEach(([style, content]) => {
        this.knowledgeIndex.set(`recipes/${style}.md`, {
          content,
          section: 'recipes',
          filename: `${style}.md`,
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} Recipe`,
          keywords: [style, 'recipe', 'grain', 'hops', 'yeast', 'brewing']
        });
      });
      
      // Add calculation knowledge
      if (expanded.calculations) {
        this.knowledgeIndex.set('calculations/brewing_math.md', {
          content: expanded.calculations,
          section: 'calculations',
          filename: 'brewing_math.md',
          title: 'Brewing Calculations and Formulas',
          keywords: ['calculations', 'formulas', 'og', 'ibu', 'abv', 'srm', 'math']
        });
      }
      
      // Add other expanded knowledge sections
      ['substitutions', 'beginner', 'advanced', 'seasonal'].forEach(section => {
        if (expanded[section]) {
          this.knowledgeIndex.set(`guides/${section}.md`, {
            content: expanded[section],
            section: 'guides',
            filename: `${section}.md`,
            title: `${section.charAt(0).toUpperCase() + section.slice(1)} Guide`,
            keywords: [section, 'brewing', 'guide', 'techniques']
          });
        }
      });
    }
  }

  /**
   * Load advanced brewing mastery knowledge
   */
  loadAdvancedMastery() {
    if (window.advancedBrewingMastery) {
      const mastery = window.advancedBrewingMastery;
      
      // Add chemistry knowledge
      Object.entries(mastery.chemistry || {}).forEach(([topic, content]) => {
        this.knowledgeIndex.set(`chemistry/${topic}.md`, {
          content,
          section: 'chemistry',
          filename: `${topic}.md`,
          title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Chemistry`,
          keywords: [topic, 'chemistry', 'science', 'formulas', 'advanced']
        });
      });
      
      // Add experimental techniques
      Object.entries(mastery.experimental || {}).forEach(([technique, content]) => {
        this.knowledgeIndex.set(`experimental/${technique}.md`, {
          content,
          section: 'experimental',
          filename: `${technique}.md`,
          title: `${technique.charAt(0).toUpperCase() + technique.slice(1)} Techniques`,
          keywords: [technique, 'experimental', 'advanced', 'innovation']
        });
      });
      
      // Add batch management
      Object.entries(mastery.batchManagement || {}).forEach(([topic, content]) => {
        this.knowledgeIndex.set(`batch/${topic}.md`, {
          content,
          section: 'batch',
          filename: `${topic}.md`,
          title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Management`,
          keywords: [topic, 'batch', 'management', 'quality', 'professional']
        });
      });
      
      // Add equipment optimization
      Object.entries(mastery.equipment || {}).forEach(([topic, content]) => {
        this.knowledgeIndex.set(`equipment/${topic}.md`, {
          content,
          section: 'equipment',
          filename: `${topic}.md`,
          title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Equipment`,
          keywords: [topic, 'equipment', 'optimization', 'efficiency']
        });
      });
    }
  }

  /**
   * Get current inventory for recipe creation
   */
  async getInventory() {
    try {
      if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
        const db = firebase.firestore();
        const userId = firebase.auth().currentUser.uid;
        const snapshot = await db.collection('users').doc(userId).collection('inventory').get();
        
        const inventory = {};
        snapshot.forEach(doc => {
          const data = doc.data();
          inventory[doc.id] = {
            name: data.name,
            category: data.category,
            quantity: data.quantity,
            unit: data.unit,
            specifications: data.specifications || {}
          };
        });
        
        return inventory;
      }
    } catch (error) {
      console.warn('Could not load inventory:', error);
    }
    return null;
  }

  /**
   * Generate inventory-aware recipe
   */
  async generateInventoryRecipe(style, useOnlyInventory = false) {
    const inventory = await this.getInventory();
    if (!inventory) {
      return this.generateResponse(`I couldn't access your inventory. Here's a standard ${style} recipe:`, []);
    }

    const available = {
      fermentables: Object.values(inventory).filter(item => item.category === 'Fermentables'),
      hops: Object.values(inventory).filter(item => item.category === 'Hops'),
      yeast: Object.values(inventory).filter(item => item.category === 'Yeast')
    };

    if (useOnlyInventory && (available.fermentables.length === 0 || available.hops.length === 0)) {
      return {
        summary: `I found limited ingredients in your inventory for ${style}. You need at least base malt and hops. Check your inventory and restock key ingredients.`,
        results: [],
        suggestions: ['What ingredients do I need for this style?', 'Show me my current inventory'],
        totalResults: 0
      };
    }

    let recipe = `**${style} Recipe Using Your Inventory:**\n\n`;
    
    // Build grain bill from available fermentables
    if (available.fermentables.length > 0) {
      recipe += `**Available Fermentables:**\n`;
      available.fermentables.forEach(grain => {
        const specs = grain.specifications;
        recipe += `- ${grain.name}: ${grain.quantity} ${grain.unit}`;
        if (specs.extractYield) recipe += ` (${specs.extractYield}% yield)`;
        if (specs.colorRating) recipe += ` (${specs.colorRating}°L)`;
        recipe += `\n`;
      });
      recipe += `\n`;
    }

    // Build hop schedule from available hops
    if (available.hops.length > 0) {
      recipe += `**Available Hops:**\n`;
      available.hops.forEach(hop => {
        const specs = hop.specifications;
        recipe += `- ${hop.name}: ${hop.quantity} ${hop.unit}`;
        if (specs.alphaAcids) recipe += ` (${specs.alphaAcids}% AA)`;
        if (specs.harvestYear) recipe += ` (${specs.harvestYear})`;
        recipe += `\n`;
      });
      recipe += `\n`;
    }

    // Available yeast
    if (available.yeast.length > 0) {
      recipe += `**Available Yeast:**\n`;
      available.yeast.forEach(yeast => {
        const specs = yeast.specifications;
        recipe += `- ${yeast.name}: ${yeast.quantity} ${yeast.unit}`;
        if (specs.attenuation) recipe += ` (${specs.attenuation}% attenuation)`;
        recipe += `\n`;
      });
      recipe += `\n`;
    }

    recipe += `**Recipe Suggestions:**\n`;
    recipe += `Based on your inventory, I recommend using your available ingredients to create a ${style}. `;
    recipe += `The exact amounts will depend on your target batch size and desired strength.\n\n`;
    recipe += `**Next Steps:**\n`;
    recipe += `1. Determine your batch size (5 gallons recommended)\n`;
    recipe += `2. Calculate grain bill based on target OG\n`;
    recipe += `3. Plan hop schedule for desired IBU\n`;
    recipe += `4. Ensure yeast viability and pitch rate`;

    return {
      summary: recipe,
      results: [],
      suggestions: [
        'Calculate exact amounts for 5 gallon batch',
        'What if I want to modify this recipe?',
        'Show me brewing process steps'
      ],
      totalResults: 1
    };
  }

  /**
   * Get knowledge base statistics
   */
  getStats() {
    return {
      isLoaded: this.isLoaded,
      totalDocuments: this.knowledgeIndex.size,
      searchTerms: this.searchIndex ? this.searchIndex.size : 0,
      sections: {
        styles: this.getDocumentsBySection('styles').length,
        troubleshooting: this.getDocumentsBySection('troubleshooting').length,
        ingredients: this.getDocumentsBySection('ingredients/hops').length + 
                    this.getDocumentsBySection('ingredients/yeast').length,
        guides: this.getDocumentsBySection('').length + this.getDocumentsBySection('guides').length,
        recipes: this.getDocumentsBySection('recipes').length,
        calculations: this.getDocumentsBySection('calculations').length,
        chemistry: this.getDocumentsBySection('chemistry').length,
        experimental: this.getDocumentsBySection('experimental').length,
        batch: this.getDocumentsBySection('batch').length,
        equipment: this.getDocumentsBySection('equipment').length
      }
    };
  }
}

// Initialize offline knowledge base
window.OfflineKnowledgeBase = OfflineKnowledgeBase;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (!window.offlineKnowledgeBase) {
    window.offlineKnowledgeBase = new OfflineKnowledgeBase();
    window.offlineKnowledgeBase.initialize();
  }
});