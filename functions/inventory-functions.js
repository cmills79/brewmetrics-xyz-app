const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Recipe ingredient consumption tracking
exports.consumeIngredients = functions.https.onCall(async (data, context) => {
    try {
        const { breweryId, recipeId, batchSize } = data;
        
        if (!breweryId || !recipeId) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
        }

        const db = admin.firestore();
        
        // Get recipe data
        const recipeDoc = await db.collection('recipes').doc(recipeId).get();
        if (!recipeDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Recipe not found');
        }

        const recipe = recipeDoc.data();
        const inventoryRef = db.collection('breweries').doc(breweryId).collection('inventory').doc('current');
        
        // Get current inventory
        const inventoryDoc = await inventoryRef.get();
        const inventory = inventoryDoc.exists ? inventoryDoc.data() : {
            fermentables: [], hops: [], yeast: [], chemicals: []
        };

        const consumptionLog = [];
        const warnings = [];

        // Process fermentables
        if (recipe.ingredients?.fermentables) {
            recipe.ingredients.fermentables.forEach(ingredient => {
                const needed = (ingredient.weight_lbs * batchSize) / 5; // Scale from 5 gallon recipe
                const inventoryItem = inventory.fermentables.find(item => 
                    item.name.toLowerCase().includes(ingredient.name.toLowerCase())
                );

                if (inventoryItem) {
                    if (inventoryItem.quantity >= needed) {
                        inventoryItem.quantity -= needed;
                        consumptionLog.push({
                            type: 'fermentable',
                            name: ingredient.name,
                            consumed: needed,
                            remaining: inventoryItem.quantity
                        });
                    } else {
                        warnings.push(`Insufficient ${ingredient.name}: need ${needed} lbs, have ${inventoryItem.quantity} lbs`);
                    }
                } else {
                    warnings.push(`${ingredient.name} not found in inventory`);
                }
            });
        }

        // Process hops
        if (recipe.ingredients?.hops) {
            recipe.ingredients.hops.forEach(hop => {
                const needed = (hop.amount_oz * batchSize) / 5;
                const inventoryItem = inventory.hops.find(item => 
                    item.name.toLowerCase().includes(hop.name.toLowerCase())
                );

                if (inventoryItem) {
                    const neededLbs = needed / 16; // Convert oz to lbs
                    if (inventoryItem.quantity >= neededLbs) {
                        inventoryItem.quantity -= neededLbs;
                        consumptionLog.push({
                            type: 'hops',
                            name: hop.name,
                            consumed: neededLbs,
                            remaining: inventoryItem.quantity
                        });
                    } else {
                        warnings.push(`Insufficient ${hop.name}: need ${needed} oz, have ${inventoryItem.quantity * 16} oz`);
                    }
                } else {
                    warnings.push(`${hop.name} not found in inventory`);
                }
            });
        }

        // Process yeast
        if (recipe.ingredients?.yeast) {
            const yeastNeeded = Math.ceil(batchSize / 5); // 1 packet per 5 gallons
            const inventoryItem = inventory.yeast.find(item => 
                item.name.toLowerCase().includes(recipe.ingredients.yeast.strain_code?.toLowerCase() || 'ale')
            );

            if (inventoryItem) {
                if (inventoryItem.quantity >= yeastNeeded) {
                    inventoryItem.quantity -= yeastNeeded;
                    consumptionLog.push({
                        type: 'yeast',
                        name: inventoryItem.name,
                        consumed: yeastNeeded,
                        remaining: inventoryItem.quantity
                    });
                } else {
                    warnings.push(`Insufficient yeast: need ${yeastNeeded} packets, have ${inventoryItem.quantity} packets`);
                }
            } else {
                warnings.push('Suitable yeast not found in inventory');
            }
        }

        // Update inventory if no critical warnings
        if (warnings.length === 0) {
            await inventoryRef.set(inventory);
        }

        // Log consumption
        await db.collection('breweries').doc(breweryId).collection('consumption_log').add({
            recipeId,
            batchSize,
            consumptionLog,
            warnings,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: warnings.length === 0,
            consumptionLog,
            warnings,
            message: warnings.length === 0 ? 'Ingredients consumed successfully' : 'Some ingredients unavailable'
        };

    } catch (error) {
        console.error('Error consuming ingredients:', error);
        throw new functions.https.HttpsError('internal', 'Failed to consume ingredients');
    }
});

// Automatic reorder alerts - temporarily disabled
// exports.checkReorderLevels = functions.pubsub.schedule('0 9 * * *').timeZone('America/New_York').onRun(async (context) => {
//     // Implementation temporarily disabled for deployment
// });

// Inventory valuation and reporting
exports.generateInventoryReport = functions.https.onCall(async (data, context) => {
    try {
        const { breweryId, reportType = 'summary' } = data;
        
        if (!breweryId) {
            throw new functions.https.HttpsError('invalid-argument', 'Brewery ID required');
        }

        const db = admin.firestore();
        const inventoryDoc = await db.collection('breweries').doc(breweryId)
            .collection('inventory').doc('current').get();

        if (!inventoryDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Inventory not found');
        }

        const inventory = inventoryDoc.data();
        const report = {
            breweryId,
            reportType,
            generatedAt: new Date().toISOString(),
            summary: {},
            details: {}
        };

        // Calculate summary statistics
        let totalValue = 0;
        let totalItems = 0;
        let lowStockItems = 0;
        let expiringSoon = 0;

        Object.keys(inventory).forEach(category => {
            const categoryItems = inventory[category];
            const categoryValue = categoryItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
            const categoryLowStock = categoryItems.filter(item => 
                item.minStock && item.quantity <= item.minStock
            ).length;
            
            // Check for items expiring in next 30 days
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            
            const categoryExpiring = categoryItems.filter(item => 
                item.expiryDate && new Date(item.expiryDate) <= thirtyDaysFromNow
            ).length;

            report.summary[category] = {
                itemCount: categoryItems.length,
                totalValue: Math.round(categoryValue),
                lowStockCount: categoryLowStock,
                expiringCount: categoryExpiring
            };

            totalValue += categoryValue;
            totalItems += categoryItems.length;
            lowStockItems += categoryLowStock;
            expiringSoon += categoryExpiring;
        });

        report.summary.overall = {
            totalItems,
            totalValue: Math.round(totalValue),
            lowStockItems,
            expiringSoon
        };

        // Add detailed breakdown if requested
        if (reportType === 'detailed') {
            report.details = inventory;
        }

        // Save report
        await db.collection('breweries').doc(breweryId)
            .collection('reports').add({
                type: 'inventory',
                report,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

        return report;

    } catch (error) {
        console.error('Error generating inventory report:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate report');
    }
});

// Batch ingredient cost calculation
exports.calculateBatchCost = functions.https.onCall(async (data, context) => {
    try {
        const { breweryId, recipeId, batchSize } = data;
        
        if (!breweryId || !recipeId) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
        }

        const db = admin.firestore();
        
        // Get recipe and inventory
        const [recipeDoc, inventoryDoc] = await Promise.all([
            db.collection('recipes').doc(recipeId).get(),
            db.collection('breweries').doc(breweryId).collection('inventory').doc('current').get()
        ]);

        if (!recipeDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Recipe not found');
        }

        const recipe = recipeDoc.data();
        const inventory = inventoryDoc.exists ? inventoryDoc.data() : {};
        
        let totalCost = 0;
        const costBreakdown = [];

        // Calculate fermentable costs
        if (recipe.ingredients?.fermentables) {
            recipe.ingredients.fermentables.forEach(ingredient => {
                const needed = (ingredient.weight_lbs * batchSize) / 5;
                const inventoryItem = inventory.fermentables?.find(item => 
                    item.name.toLowerCase().includes(ingredient.name.toLowerCase())
                );
                
                const cost = inventoryItem ? inventoryItem.cost * needed : needed * 1.50; // Default cost
                totalCost += cost;
                
                costBreakdown.push({
                    category: 'fermentables',
                    name: ingredient.name,
                    quantity: needed,
                    unit: 'lbs',
                    unitCost: inventoryItem?.cost || 1.50,
                    totalCost: Math.round(cost * 100) / 100
                });
            });
        }

        // Calculate hop costs
        if (recipe.ingredients?.hops) {
            recipe.ingredients.hops.forEach(hop => {
                const needed = (hop.amount_oz * batchSize) / 5;
                const inventoryItem = inventory.hops?.find(item => 
                    item.name.toLowerCase().includes(hop.name.toLowerCase())
                );
                
                const cost = inventoryItem ? (inventoryItem.cost * needed / 16) : needed * 1.00; // Default cost per oz
                totalCost += cost;
                
                costBreakdown.push({
                    category: 'hops',
                    name: hop.name,
                    quantity: needed,
                    unit: 'oz',
                    unitCost: inventoryItem ? inventoryItem.cost / 16 : 1.00,
                    totalCost: Math.round(cost * 100) / 100
                });
            });
        }

        // Calculate yeast cost
        if (recipe.ingredients?.yeast) {
            const yeastNeeded = Math.ceil(batchSize / 5);
            const inventoryItem = inventory.yeast?.find(item => 
                item.name.toLowerCase().includes('ale') || item.name.toLowerCase().includes('lager')
            );
            
            const cost = inventoryItem ? inventoryItem.cost * yeastNeeded : yeastNeeded * 4.00;
            totalCost += cost;
            
            costBreakdown.push({
                category: 'yeast',
                name: recipe.ingredients.yeast.name || 'Brewing Yeast',
                quantity: yeastNeeded,
                unit: 'packets',
                unitCost: inventoryItem?.cost || 4.00,
                totalCost: Math.round(cost * 100) / 100
            });
        }

        return {
            recipeId,
            batchSize,
            totalCost: Math.round(totalCost * 100) / 100,
            costPerGallon: Math.round((totalCost / batchSize) * 100) / 100,
            costBreakdown,
            calculatedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error('Error calculating batch cost:', error);
        throw new functions.https.HttpsError('internal', 'Failed to calculate batch cost');
    }
});