// --- Brewing-Specific Prompts for Gemini AI ---

const BrewingPrompts = {
    
    /**
     * System prompt to establish the AI as a Master Brewer
     */
    masterBrewerPersona: `You are a Master Brewer with 25+ years of experience in craft brewing. You have:
    - Deep knowledge of brewing science, ingredients, and processes
    - Experience with all beer styles from lagers to sours
    - Expertise in troubleshooting brewing issues
    - Knowledge of commercial brewing equipment and ingredients
    - Understanding of recipe formulation and scaling
    - Ability to recommend specific products and techniques
    
    Always provide practical, actionable advice. Include specific measurements, temperatures, and timings.
    When recommending products, focus on quality and explain why you're recommending them.
    Keep responses conversational but authoritative.`,

    /**
     * Generate a complete beer recipe
     */
    generateRecipe: (style, preferences) => {
        const { abv, ibu, srm, volume, equipment, experience } = preferences;
        
        return `${BrewingPrompts.masterBrewerPersona}

        Create a complete ${style} recipe with these specifications:
        - Target ABV: ${abv}%
        - Target IBU: ${ibu}
        - Target SRM: ${srm}
        - Batch size: ${volume} gallons
        - Equipment: ${equipment}
        - Brewer experience: ${experience}
        
        Please provide:
        1. Complete grain bill with specific malts and amounts
        2. Hop schedule with varieties, amounts, and timing
        3. Yeast recommendation with specific strain
        4. Mash schedule with temperatures and rest times
        5. Fermentation schedule and temperatures
        6. Conditioning and packaging notes
        7. Expected final statistics (ABV, IBU, SRM)
        8. Tasting notes for the finished beer
        
        Format the response as a structured recipe that can be easily followed.
        Include brief explanations for key ingredient choices.`;
    },

    /**
     * Enhance an existing recipe based on feedback
     */
    enhanceRecipe: (recipe, feedback) => {
        const { averageRating, weakAreas, strongAreas, comments } = feedback;
        
        return `${BrewingPrompts.masterBrewerPersona}

        Analyze this beer recipe and customer feedback, then suggest improvements:

        CURRENT RECIPE:
        ${JSON.stringify(recipe, null, 2)}

        CUSTOMER FEEDBACK:
        - Average Rating: ${averageRating}/5
        - Weak areas: ${weakAreas.join(', ')}
        - Strong areas: ${strongAreas.join(', ')}
        - Comments: ${comments}

        Please provide:
        1. Analysis of what's causing the weak areas
        2. Specific recipe modifications to address issues
        3. Process improvements if needed
        4. Expected impact of changes
        5. Alternative approaches if the first doesn't work
        
        Focus on practical, achievable improvements that address the specific feedback.`;
    },

    /**
     * Troubleshoot brewing issues
     */
    troubleshootBatch: (batchData, responses) => {
        const issues = BrewingPrompts.analyzeResponses(responses);
        
        return `${BrewingPrompts.masterBrewerPersona}

        Help troubleshoot this batch based on customer feedback:

        BATCH INFO:
        - Beer: ${batchData.beerName}
        - Style: ${batchData.style || 'Unknown'}
        - ABV: ${batchData.abv}%
        - IBU: ${batchData.ibu}
        - Batch Code: ${batchData.batchCode}

        CUSTOMER FEEDBACK ANALYSIS:
        - Total responses: ${responses.length}
        - Average rating: ${issues.averageRating}/5
        - Most common complaints: ${issues.complaints.join(', ')}
        - Lowest scoring attributes: ${issues.lowestScores.join(', ')}

        Please provide:
        1. Likely causes of the issues
        2. Specific brewing process problems that could cause these symptoms
        3. Recipe modifications for the next batch
        4. Process improvements to prevent recurrence
        5. Quality control checkpoints to monitor
        
        Be specific about temperatures, timings, and measurements.`;
    },

    /**
     * Recommend products based on brewing context
     */
    recommendProducts: (context) => {
        const { needType, currentSetup, budget, experience } = context;
        
        return `${BrewingPrompts.masterBrewerPersona}

        Recommend specific products for this brewing situation:

        NEEDS:
        - Type: ${needType} (ingredients, equipment, process improvement)
        - Current setup: ${currentSetup}
        - Budget range: ${budget}
        - Experience level: ${experience}

        Please provide:
        1. Top 3 product recommendations with specific brands/models
        2. Why each product is recommended
        3. How it will improve their brewing
        4. Price range and value proposition
        5. Where to buy (prefer homebrew suppliers)
        
        Focus on products that offer the best value and will make the biggest impact.`;
    },

    /**
     * General brewing question
     */
    generalBrewing: (question, context = {}) => {
        return `${BrewingPrompts.masterBrewerPersona}

        Answer this brewing question: ${question}

        Context: ${JSON.stringify(context, null, 2)}

        Provide a comprehensive answer that:
        1. Explains the science behind the topic
        2. Gives practical application advice
        3. Includes specific recommendations when relevant
        4. Mentions common mistakes to avoid
        5. Suggests related topics to explore
        
        Keep the answer informative but approachable.`;
    },

    /**
     * Analyze customer responses to identify issues
     */
    analyzeResponses: (responses) => {
        const ratings = responses.map(r => r.overallRating).filter(r => r);
        const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        
        // Analyze attribute scores
        const attributes = ['sweetness', 'acidity', 'bitterness', 'body', 'carbonation', 'malt', 'hopFlavor', 'finish'];
        const attributeScores = {};
        
        attributes.forEach(attr => {
            const scores = responses.map(r => r.ratings?.[attr] || r.surveyAnswers?.find(a => a.questionId === attr)?.answer).filter(s => s);
            if (scores.length > 0) {
                attributeScores[attr] = scores.reduce((a, b) => a + b, 0) / scores.length;
            }
        });
        
        // Find lowest scoring attributes
        const lowestScores = Object.entries(attributeScores)
            .filter(([_, score]) => score < 3)
            .sort(([_, a], [__, b]) => a - b)
            .slice(0, 3)
            .map(([attr, _]) => attr);
        
        // Common complaints based on low scores
        const complaints = [];
        if (attributeScores.sweetness < 2.5) complaints.push('too dry');
        if (attributeScores.sweetness > 3.5) complaints.push('too sweet');
        if (attributeScores.bitterness < 2.5) complaints.push('lacks hop character');
        if (attributeScores.bitterness > 3.5) complaints.push('overly bitter');
        if (attributeScores.body < 2.5) complaints.push('thin/watery');
        if (attributeScores.carbonation < 2.5) complaints.push('flat');
        if (attributeScores.carbonation > 3.5) complaints.push('overcarbonated');
        
        return {
            averageRating: averageRating.toFixed(1),
            attributeScores,
            lowestScores,
            complaints
        };
    }
};

// Make available globally
window.BrewingPrompts = BrewingPrompts;
