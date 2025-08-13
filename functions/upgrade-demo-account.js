const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Upgrade demo account to Premium
exports.upgradeDemoToPremium = functions.https.onCall(async (data, context) => {
    try {
        const db = admin.firestore();
        
        // Demo account credentials
        const demoEmail = 'demo@hopvalleybrewing.com';
        const demoBreweryId = 'demo-brewery';
        
        // Update user subscription to Premium
        const usersSnapshot = await db.collection('users')
            .where('email', '==', demoEmail)
            .get();
        
        if (!usersSnapshot.empty) {
            const userDoc = usersSnapshot.docs[0];
            await userDoc.ref.update({
                subscriptionTier: 'premium',
                subscriptionStatus: 'active',
                premiumFeatures: {
                    aiRecipeGeneration: true,
                    advancedAnalytics: true,
                    competitiveInsights: true,
                    unlimitedSurveys: true,
                    customBranding: true,
                    prioritySupport: true,
                    equipmentOptimization: true,
                    inventoryManagement: true,
                    batchPhotoManagement: true,
                    troubleshootingGuides: true
                },
                upgradeDate: admin.firestore.FieldValue.serverTimestamp(),
                subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
            });
            
            console.log('Demo user upgraded to Premium');
        }
        
        // Update brewery configuration with Premium features
        await db.collection('breweries').doc(demoBreweryId).update({
            subscriptionTier: 'premium',
            premiumFeatures: {
                aiRecipeGeneration: true,
                advancedAnalytics: true,
                competitiveInsights: true,
                unlimitedSurveys: true,
                customBranding: true,
                prioritySupport: true,
                equipmentOptimization: true,
                inventoryManagement: true,
                batchPhotoManagement: true,
                troubleshootingGuides: true
            },
            upgradeDate: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Add premium analytics data
        await db.collection('breweries').doc(demoBreweryId)
            .collection('premium_analytics').doc('settings').set({
                enabled: true,
                features: {
                    revenueTracking: true,
                    customerIntelligence: true,
                    predictiveAnalytics: true,
                    competitiveAnalysis: true,
                    advancedReporting: true
                },
                setupDate: admin.firestore.FieldValue.serverTimestamp()
            });
        
        return {
            success: true,
            message: 'Demo account successfully upgraded to Premium with all features unlocked',
            features: [
                'AI Recipe Generation',
                'Advanced Analytics',
                'Competitive Insights', 
                'Unlimited Surveys',
                'Custom Branding',
                'Priority Support',
                'Equipment Optimization',
                'Inventory Management',
                'Batch Photo Management',
                'Troubleshooting Guides'
            ]
        };
        
    } catch (error) {
        console.error('Error upgrading demo account:', error);
        throw new functions.https.HttpsError('internal', 'Failed to upgrade demo account');
    }
});

// Check user subscription tier
exports.getUserSubscriptionTier = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            return { tier: 'free', features: [] };
        }
        
        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(context.auth.uid).get();
        
        if (!userDoc.exists) {
            return { tier: 'free', features: [] };
        }
        
        const userData = userDoc.data();
        const tier = userData.subscriptionTier || 'free';
        const features = userData.premiumFeatures || {};
        
        return {
            tier,
            features,
            status: userData.subscriptionStatus || 'inactive',
            expiry: userData.subscriptionExpiry
        };
        
    } catch (error) {
        console.error('Error checking subscription tier:', error);
        return { tier: 'free', features: [] };
    }
});

module.exports = {
    upgradeDemoToPremium: exports.upgradeDemoToPremium,
    getUserSubscriptionTier: exports.getUserSubscriptionTier
};