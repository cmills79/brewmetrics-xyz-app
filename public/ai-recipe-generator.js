// AI Recipe Generator with Programmatic Fallback
// Handles both premium AI generation and free tier programmatic generation

class AIRecipeGenerator {
    constructor() {
        this.loadProgrammaticGenerator();
    }

    async loadProgrammaticGenerator() {
        // Load both programmatic and equipment-aware generators
        if (!window.ProgrammaticRecipeGenerator) {
            const script1 = document.createElement('script');
            script1.src = 'programmatic-recipe-generator.js';
            document.head.appendChild(script1);
        }
        
        if (!window.EquipmentAwareRecipeGenerator) {
            const script2 = document.createElement('script');
            script2.src = 'equipment-aware-recipe-generator.js';
            document.head.appendChild(script2);
        }
    }

    async generateRecipe(style, batchSize = 5, requirements = '') {
        const userTier = await this.getUserTier();
        
        if (userTier === 'free') {
            return this.generateProgrammaticRecipe(style, batchSize);
        } else {
            return this.generateAIRecipe(style, batchSize, requirements);
        }
    }

    async generateProgrammaticRecipe(style, batchSize) {
        try {
            // Try equipment-aware generation first
            if (window.EquipmentAwareRecipeGenerator) {
                try {
                    const equipmentGenerator = new EquipmentAwareRecipeGenerator();
                    const result = await equipmentGenerator.generateEquipmentAwareRecipe(style, batchSize);
                    
                    // Add free tier notification
                    result.recipe.notes = (result.recipe.notes || '') + '\n\nGenerated with BrewMetrics Free Tier using your equipment specifications. Upgrade to Premium for AI-powered custom recipes with advanced variations and brewing guidance.';
                    
                    return {
                        success: true,
                        recipe: result.recipe,
                        instructions: result.instructions,
                        equipmentNotes: result.equipmentNotes,
                        generationType: 'equipment-aware',
                        message: 'Recipe generated using your brewery equipment specifications'
                    };
                } catch (equipmentError) {
                    console.warn('Equipment-aware generation failed, falling back to basic:', equipmentError);
                }
            }
            
            // Fallback to basic programmatic generation
            if (!window.ProgrammaticRecipeGenerator) {
                throw new Error('Programmatic generator not loaded');
            }
            
            const generator = new ProgrammaticRecipeGenerator();
            const availableStyles = generator.getAvailableStyles();
            
            if (!availableStyles.includes(style)) {
                // Find closest match or use default
                const defaultStyle = availableStyles.find(s => s.includes('IPA')) || availableStyles[0];
                console.warn(`Style ${style} not available, using ${defaultStyle}`);
                style = defaultStyle;
            }
            
            const recipe = generator.generateRecipe(style, batchSize);
            
            // Add free tier notification
            recipe.notes.brewing_notes += '\n\nGenerated with BrewMetrics Free Tier. Upgrade to Premium for AI-powered custom recipes with advanced variations and brewing guidance.';
            
            return {
                success: true,
                recipe: recipe,
                generationType: 'programmatic',
                message: 'Recipe generated using traditional brewing formulas'
            };
            
        } catch (error) {
            console.error('Recipe generation failed:', error);
            throw new Error('Recipe generation failed. Please try again or contact support.');
        }
    }

    async generateAIRecipe(style, batchSize, requirements) {
        try {
            const response = await fetch('/generateRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    beerStyle: style,
                    batchSize: batchSize,
                    customRequirements: requirements,
                    userId: this.getCurrentUserId()
                })
            });

            if (!response.ok) {
                throw new Error(`AI generation failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            return {
                success: true,
                recipe: result.recipe,
                generationType: 'ai',
                message: 'Recipe generated using AI with your brewing knowledge base'
            };
            
        } catch (error) {
            console.error('AI generation failed:', error);
            // Fallback to programmatic for premium users if AI fails
            console.log('Falling back to programmatic generation...');
            return this.generateProgrammaticRecipe(style, batchSize);
        }
    }

    async getUserTier() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return 'free';
            
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            return userDoc.data()?.subscriptionTier || 'free';
        } catch (error) {
            console.warn('Could not determine user tier:', error);
            return 'free';
        }
    }

    getCurrentUserId() {
        const user = firebase.auth().currentUser;
        return user ? user.uid : 'anonymous';
    }

    getAvailableStyles() {
        // Return all styles available across both systems
        const programmaticStyles = window.ProgrammaticRecipeGenerator ? 
            new ProgrammaticRecipeGenerator().getAvailableStyles() : [];
        
        const aiStyles = [
            'American IPA', 'American Porter', 'Hazy IPA', 'German Pilsner',
            'American Wheat', 'Imperial Stout', 'Saison', 'Sour Ale'
        ];
        
        // Combine and deduplicate
        return [...new Set([...programmaticStyles, ...aiStyles])];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIRecipeGenerator;
}

// Global instance
window.aiRecipeGenerator = new AIRecipeGenerator();