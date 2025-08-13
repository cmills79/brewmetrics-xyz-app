const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Equipment-aware recipe scaling
exports.scaleRecipeForEquipment = functions.https.onCall(async (data, context) => {
    try {
        const { breweryId, recipeId, targetBatchSize } = data;
        
        if (!breweryId || !recipeId || !targetBatchSize) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
        }

        const db = admin.firestore();
        
        // Get brewery equipment configuration
        const equipmentDoc = await db.collection('breweries').doc(breweryId)
            .collection('configuration').doc('equipment').get();
        
        if (!equipmentDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Brewery equipment configuration not found');
        }

        const equipment = equipmentDoc.data();
        
        // Get base recipe
        const recipeDoc = await db.collection('recipes').doc(recipeId).get();
        if (!recipeDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Recipe not found');
        }

        const baseRecipe = recipeDoc.data();
        const scalingFactor = targetBatchSize / (baseRecipe.batch_info?.batch_size_gallons || 5);
        
        // Apply equipment-specific adjustments
        const scaledRecipe = {
            ...baseRecipe,
            recipe_id: `${baseRecipe.recipe_id}_scaled_${Date.now()}`,
            batch_info: {
                ...baseRecipe.batch_info,
                batch_size_gallons: targetBatchSize,
                efficiency_percent: equipment.equipment?.mashTun?.efficiency || baseRecipe.batch_info?.efficiency_percent || 75
            }
        };

        // Scale fermentables with equipment efficiency
        if (baseRecipe.ingredients?.fermentables) {
            scaledRecipe.ingredients.fermentables = baseRecipe.ingredients.fermentables.map(fermentable => ({
                ...fermentable,
                weight_lbs: Math.round((fermentable.weight_lbs * scalingFactor) * 100) / 100
            }));
        }

        // Scale hops with equipment considerations
        if (baseRecipe.ingredients?.hops) {
            scaledRecipe.ingredients.hops = baseRecipe.ingredients.hops.map(hop => {
                let scaledAmount = hop.amount_oz * scalingFactor;
                
                // Adjust for whirlpool if equipment has it
                if (equipment.equipment?.additionalEquipment?.whirlpool && hop.use === 'Whirlpool') {
                    scaledAmount *= 1.1; // 10% increase for better utilization
                }
                
                return {
                    ...hop,
                    amount_oz: Math.round(scaledAmount * 100) / 100
                };
            });
        }

        // Adjust fermentation based on equipment
        if (baseRecipe.process?.fermentation_schedule && equipment.equipment?.fermentation) {
            scaledRecipe.process.fermentation_schedule = baseRecipe.process.fermentation_schedule.map(stage => {
                let adjustedStage = { ...stage };
                
                // Adjust fermentation time based on fermenter type
                if (equipment.equipment.fermentation.type === 'conical') {
                    adjustedStage.duration_days = Math.max(1, Math.round(stage.duration_days * 0.9)); // 10% faster
                } else if (equipment.equipment.fermentation.type === 'open') {
                    adjustedStage.duration_days = Math.round(stage.duration_days * 1.1); // 10% slower
                }
                
                return adjustedStage;
            });
        }

        // Recalculate target parameters based on equipment efficiency
        const efficiency = equipment.equipment?.mashTun?.efficiency || 75;
        const efficiencyFactor = efficiency / (baseRecipe.batch_info?.efficiency_percent || 75);
        
        if (baseRecipe.target_parameters) {
            scaledRecipe.target_parameters = {
                ...baseRecipe.target_parameters,
                original_gravity_sg: Math.round((1 + ((baseRecipe.target_parameters.original_gravity_sg - 1) * efficiencyFactor)) * 1000) / 1000
            };
        }

        // Add equipment notes
        scaledRecipe.notes = {
            ...baseRecipe.notes,
            equipment_notes: `Scaled for ${equipment.basicInfo?.name || 'brewery'} equipment. ` +
                           `Efficiency: ${efficiency}%, Fermenter: ${equipment.equipment?.fermentation?.type || 'standard'}`
        };

        return {
            success: true,
            scaledRecipe,
            scalingFactor,
            equipmentAdjustments: {
                efficiency: efficiency,
                fermenterType: equipment.equipment?.fermentation?.type,
                hasWhirlpool: equipment.equipment?.additionalEquipment?.whirlpool || false
            }
        };

    } catch (error) {
        console.error('Error scaling recipe for equipment:', error);
        throw new functions.https.HttpsError('internal', 'Failed to scale recipe');
    }
});

// Generate equipment-optimized recipe suggestions
exports.generateEquipmentOptimizedRecipe = functions.https.onCall(async (data, context) => {
    try {
        const { breweryId, beerStyle, batchSize } = data;
        
        if (!breweryId || !beerStyle) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
        }

        const db = admin.firestore();
        
        // Get brewery equipment configuration
        const equipmentDoc = await db.collection('breweries').doc(breweryId)
            .collection('configuration').doc('equipment').get();
        
        if (!equipmentDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Please complete brewery setup first');
        }

        const equipment = equipmentDoc.data();
        
        // Build equipment-specific prompt for AI
        const equipmentPrompt = this.buildEquipmentPrompt(equipment, beerStyle, batchSize);
        
        // Call Vertex AI with equipment context
        const { VertexAI } = require('@google-cloud/vertexai');
        const vertexAi = new VertexAI({
            project: process.env.GCP_PROJECT || 'brewmetrics-xyz-app-e8d51',
            location: 'us-central1'
        });

        const generativeModel = vertexAi.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                maxOutputTokens: 2048
            }
        });

        const response = await generativeModel.generateContent(equipmentPrompt);
        const recipeText = response.response.candidates[0].content.parts[0].text;
        
        // Parse and enhance recipe with equipment data
        let recipeData;
        try {
            const jsonMatch = recipeText.match(/```json\s*([\s\S]*?)\s*```/) || recipeText.match(/\{[\s\S]*\}/);
            recipeData = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : recipeText);
        } catch (parseError) {
            throw new Error('Failed to parse AI recipe response');
        }

        // Add equipment metadata
        recipeData.equipment_profile = {
            breweryId,
            efficiency: equipment.equipment?.mashTun?.efficiency || 75,
            fermenterType: equipment.equipment?.fermentation?.type,
            temperatureControl: equipment.equipment?.fermentation?.temperatureControl,
            additionalEquipment: equipment.equipment?.additionalEquipment || {}
        };

        return {
            success: true,
            recipe: recipeData,
            equipmentOptimizations: this.getEquipmentOptimizations(equipment, beerStyle)
        };

    } catch (error) {
        console.error('Error generating equipment-optimized recipe:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate optimized recipe');
    }
});

// Get batch photos for survey display
exports.getBatchPhotos = functions.https.onCall(async (data, context) => {
    try {
        const { breweryId, batchId } = data;
        
        if (!breweryId) {
            throw new functions.https.HttpsError('invalid-argument', 'Brewery ID required');
        }

        const db = admin.firestore();
        
        // Get brewery configuration with photos
        const configDoc = await db.collection('breweries').doc(breweryId)
            .collection('configuration').doc('equipment').get();
        
        if (!configDoc.exists) {
            return { success: true, photos: [] };
        }

        const config = configDoc.data();
        const photos = config.batchPhotos || [];
        
        // If specific batch requested, try to get batch-specific photos
        if (batchId) {
            const batchDoc = await db.collection('breweries').doc(breweryId)
                .collection('batches').doc(batchId).get();
            
            if (batchDoc.exists && batchDoc.data().photos) {
                return {
                    success: true,
                    photos: batchDoc.data().photos
                };
            }
        }

        return {
            success: true,
            photos: photos.slice(0, 5) // Limit to 5 photos for performance
        };

    } catch (error) {
        console.error('Error getting batch photos:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get batch photos');
    }
});

// Helper function to build equipment-specific AI prompt
function buildEquipmentPrompt(equipment, beerStyle, batchSize) {
    const efficiency = equipment.equipment?.mashTun?.efficiency || 75;
    const fermenterType = equipment.equipment?.fermentation?.type || 'conical';
    const tempControl = equipment.equipment?.fermentation?.temperatureControl || 'glycol';
    const additionalEquip = equipment.equipment?.additionalEquipment || {};
    
    return `You are the AI Master Brewer creating a recipe optimized for specific brewery equipment.

BREWERY EQUIPMENT PROFILE:
- Mash Efficiency: ${efficiency}%
- Fermenter Type: ${fermenterType}
- Temperature Control: ${tempControl}
- Whirlpool: ${additionalEquip.whirlpool ? 'Yes' : 'No'}
- Hop Back: ${additionalEquip.hopBack ? 'Yes' : 'No'}
- Centrifuge: ${additionalEquip.centrifuge ? 'Yes' : 'No'}
- Filtration: ${additionalEquip.filtration ? 'Yes' : 'No'}

EQUIPMENT OPTIMIZATIONS:
${fermenterType === 'conical' ? '- Use conical fermenter advantages for cleaner fermentation and easier yeast harvesting' : ''}
${additionalEquip.whirlpool ? '- Optimize whirlpool hop additions for enhanced aroma' : '- Consider late boil additions without whirlpool'}
${additionalEquip.hopBack ? '- Utilize hop back for additional hop character' : ''}
${tempControl === 'glycol' ? '- Precise temperature control allows for advanced fermentation profiles' : '- Account for temperature fluctuations in fermentation planning'}

Generate a ${beerStyle} recipe for ${batchSize || 5} gallons that maximizes the potential of this equipment setup.

Return JSON format with recipe optimized for the specific equipment capabilities.`;
}

// Helper function to get equipment-specific optimizations
function getEquipmentOptimizations(equipment, beerStyle) {
    const optimizations = [];
    
    if (equipment.equipment?.additionalEquipment?.whirlpool) {
        optimizations.push('Whirlpool hop additions optimized for enhanced aroma extraction');
    }
    
    if (equipment.equipment?.fermentation?.type === 'conical') {
        optimizations.push('Fermentation schedule adjusted for conical fermenter efficiency');
    }
    
    if (equipment.equipment?.fermentation?.pressureCapability === 'high-pressure') {
        optimizations.push('Pressure fermentation options available for enhanced ester control');
    }
    
    const efficiency = equipment.equipment?.mashTun?.efficiency || 75;
    if (efficiency > 80) {
        optimizations.push('High mash efficiency allows for reduced grain bill');
    }
    
    return optimizations;
}

module.exports = {
    scaleRecipeForEquipment: exports.scaleRecipeForEquipment,
    generateEquipmentOptimizedRecipe: exports.generateEquipmentOptimizedRecipe,
    getBatchPhotos: exports.getBatchPhotos
};