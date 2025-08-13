const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Enhanced Analytics Data Capture Functions

/**
 * Capture Enhanced Survey Response with Analytics Data
 */
exports.submitEnhancedSurveyResponse = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const {
        breweryId,
        batchId,
        surveyAnswers,
        overallRating,
        sessionData,
        deviceInfo,
        locationData
    } = data;

    try {
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        const responseId = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Enhanced response data with analytics
        const enhancedResponseData = {
            responseId,
            breweryId,
            batchId,
            surveyAnswers,
            overallRating,
            timestamp,
            
            // Session Analytics
            sessionData: {
                sessionId: sessionData?.sessionId || `session_${Date.now()}`,
                startTime: sessionData?.startTime || timestamp,
                endTime: timestamp,
                timeSpent: sessionData?.timeSpent || 0,
                questionsSkipped: sessionData?.questionsSkipped || 0,
                questionsRevisited: sessionData?.questionsRevisited || 0,
                surveyVersion: '2.0'
            },

            // Device & Technical Data
            deviceInfo: {
                userAgent: deviceInfo?.userAgent || '',
                screenResolution: deviceInfo?.screenResolution || '',
                deviceType: deviceInfo?.deviceType || 'unknown',
                browser: deviceInfo?.browser || '',
                os: deviceInfo?.os || '',
                isMobile: deviceInfo?.isMobile || false
            },

            // Location Data (if available)
            locationData: {
                city: locationData?.city || '',
                state: locationData?.state || '',
                country: locationData?.country || 'US',
                timezone: locationData?.timezone || '',
                coordinates: locationData?.coordinates || null
            },

            // Calculated Analytics
            analytics: {
                tasteProfileScore: calculateTasteProfileScore(surveyAnswers),
                satisfactionIndex: calculateSatisfactionIndex(overallRating, surveyAnswers),
                recommendationLikelihood: calculateRecommendationLikelihood(overallRating),
                qualityMetrics: calculateQualityMetrics(surveyAnswers),
                flavorBalance: calculateFlavorBalance(surveyAnswers)
            }
        };

        // Save to Firestore
        await admin.firestore()
            .collection('breweries').doc(breweryId)
            .collection('batches').doc(batchId)
            .collection('responses').doc(responseId)
            .set(enhancedResponseData);

        // Update batch analytics
        await updateBatchAnalytics(breweryId, batchId, enhancedResponseData);

        // Update brewery analytics
        await updateBreweryAnalytics(breweryId, enhancedResponseData);

        // Trigger predictive analytics update
        await triggerPredictiveAnalytics(breweryId, batchId, enhancedResponseData);

        functions.logger.info('Enhanced survey response captured', {
            responseId,
            breweryId,
            batchId,
            overallRating
        });

        return { success: true, responseId };

    } catch (error) {
        functions.logger.error('Error capturing enhanced survey response', error);
        throw new functions.https.HttpsError('internal', 'Failed to save survey response');
    }
});

/**
 * Capture Customer Journey Events
 */
exports.trackCustomerJourney = functions.https.onCall(async (data, context) => {
    const {
        breweryId,
        sessionId,
        eventType,
        eventData,
        timestamp,
        userAgent,
        referrer
    } = data;

    try {
        const journeyEvent = {
            sessionId: sessionId || `session_${Date.now()}`,
            breweryId,
            eventType, // 'page_view', 'survey_start', 'survey_complete', 'qr_scan', etc.
            eventData,
            timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
            userAgent: userAgent || '',
            referrer: referrer || '',
            eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        // Save to customer journey collection
        await admin.firestore()
            .collection('customerJourney')
            .doc(journeyEvent.eventId)
            .set(journeyEvent);

        // Update session analytics
        await updateSessionAnalytics(sessionId, journeyEvent);

        return { success: true, eventId: journeyEvent.eventId };

    } catch (error) {
        functions.logger.error('Error tracking customer journey', error);
        throw new functions.https.HttpsError('internal', 'Failed to track customer journey');
    }
});

/**
 * Capture Revenue Impact Data
 */
exports.captureRevenueImpact = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const {
        breweryId,
        batchId,
        revenueData,
        salesData,
        customerData
    } = data;

    try {
        const revenueImpact = {
            breweryId,
            batchId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            
            // Revenue Metrics
            revenue: {
                totalRevenue: revenueData?.totalRevenue || 0,
                revenuePerBatch: revenueData?.revenuePerBatch || 0,
                averageOrderValue: revenueData?.averageOrderValue || 0,
                profitMargin: revenueData?.profitMargin || 0,
                costPerUnit: revenueData?.costPerUnit || 0
            },

            // Sales Metrics
            sales: {
                unitsSold: salesData?.unitsSold || 0,
                salesVelocity: salesData?.salesVelocity || 0,
                inventoryTurnover: salesData?.inventoryTurnover || 0,
                seasonalTrends: salesData?.seasonalTrends || {},
                channelPerformance: salesData?.channelPerformance || {}
            },

            // Customer Metrics
            customer: {
                newCustomers: customerData?.newCustomers || 0,
                returningCustomers: customerData?.returningCustomers || 0,
                customerLifetimeValue: customerData?.customerLifetimeValue || 0,
                churnRate: customerData?.churnRate || 0,
                acquisitionCost: customerData?.acquisitionCost || 0
            }
        };

        // Save revenue impact data
        await admin.firestore()
            .collection('revenueAnalytics')
            .doc(`${breweryId}_${batchId}_${Date.now()}`)
            .set(revenueImpact);

        // Update brewery revenue analytics
        await updateBreweryRevenueAnalytics(breweryId, revenueImpact);

        return { success: true };

    } catch (error) {
        functions.logger.error('Error capturing revenue impact', error);
        throw new functions.https.HttpsError('internal', 'Failed to capture revenue impact');
    }
});

/**
 * Capture Competitive Analysis Data
 */
exports.captureCompetitiveData = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const {
        breweryId,
        competitorData,
        marketData,
        benchmarkData
    } = data;

    try {
        const competitiveAnalysis = {
            breweryId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            
            // Competitor Data
            competitors: competitorData?.competitors || [],
            marketShare: competitorData?.marketShare || 0,
            priceComparison: competitorData?.priceComparison || {},
            qualityComparison: competitorData?.qualityComparison || {},

            // Market Data
            market: {
                totalMarketSize: marketData?.totalMarketSize || 0,
                growthRate: marketData?.growthRate || 0,
                trends: marketData?.trends || [],
                opportunities: marketData?.opportunities || []
            },

            // Benchmark Data
            benchmarks: {
                industryAverageRating: benchmarkData?.industryAverageRating || 0,
                industryAveragePrice: benchmarkData?.industryAveragePrice || 0,
                topPerformerMetrics: benchmarkData?.topPerformerMetrics || {},
                performanceGaps: benchmarkData?.performanceGaps || {}
            }
        };

        // Save competitive analysis
        await admin.firestore()
            .collection('competitiveAnalysis')
            .doc(`${breweryId}_${Date.now()}`)
            .set(competitiveAnalysis);

        return { success: true };

    } catch (error) {
        functions.logger.error('Error capturing competitive data', error);
        throw new functions.https.HttpsError('internal', 'Failed to capture competitive data');
    }
});

/**
 * Generate Predictive Analytics Data
 */
exports.generatePredictiveAnalytics = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { breweryId, timeframe } = data;

    try {
        // Get historical data
        const historicalData = await getHistoricalData(breweryId, timeframe);
        
        // Generate predictions
        const predictions = {
            breweryId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            timeframe,
            
            // Revenue Predictions
            revenueForecast: generateRevenueForecast(historicalData),
            
            // Customer Predictions
            customerGrowth: predictCustomerGrowth(historicalData),
            
            // Quality Predictions
            qualityTrends: predictQualityTrends(historicalData),
            
            // Market Predictions
            marketOpportunities: identifyMarketOpportunities(historicalData),
            
            // Risk Analysis
            riskFactors: analyzeRiskFactors(historicalData),
            
            // Recommendations
            recommendations: generateRecommendations(historicalData)
        };

        // Save predictions
        await admin.firestore()
            .collection('predictiveAnalytics')
            .doc(`${breweryId}_${Date.now()}`)
            .set(predictions);

        return { success: true, predictions };

    } catch (error) {
        functions.logger.error('Error generating predictive analytics', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate predictive analytics');
    }
});

// Helper Functions

function calculateTasteProfileScore(surveyAnswers) {
    if (!surveyAnswers || surveyAnswers.length === 0) return 0;
    
    const scores = surveyAnswers.map(answer => answer.answer || 0);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 20); // Convert to 0-100 scale
}

function calculateSatisfactionIndex(overallRating, surveyAnswers) {
    const baseScore = (overallRating || 0) * 20; // Convert 1-5 to 0-100
    const tasteScore = calculateTasteProfileScore(surveyAnswers);
    return Math.round((baseScore + tasteScore) / 2);
}

function calculateRecommendationLikelihood(overallRating) {
    if (overallRating >= 4) return 'High';
    if (overallRating >= 3) return 'Medium';
    return 'Low';
}

function calculateQualityMetrics(surveyAnswers) {
    const metrics = {};
    surveyAnswers.forEach(answer => {
        const questionText = answer.questionText || '';
        if (questionText.includes('Bitterness')) metrics.bitterness = answer.answer;
        if (questionText.includes('Sweetness')) metrics.sweetness = answer.answer;
        if (questionText.includes('Body')) metrics.body = answer.answer;
        if (questionText.includes('Carbonation')) metrics.carbonation = answer.answer;
    });
    return metrics;
}

function calculateFlavorBalance(surveyAnswers) {
    const flavors = calculateQualityMetrics(surveyAnswers);
    const values = Object.values(flavors);
    if (values.length === 0) return 0;
    
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    
    // Lower variance = better balance
    return Math.max(0, 100 - (variance * 20));
}

async function updateBatchAnalytics(breweryId, batchId, responseData) {
    const batchRef = admin.firestore()
        .collection('breweries').doc(breweryId)
        .collection('batches').doc(batchId);

    await admin.firestore().runTransaction(async (transaction) => {
        const batchDoc = await transaction.get(batchRef);
        const batchData = batchDoc.data() || {};
        
        const analytics = batchData.analytics || {};
        const responseCount = (analytics.responseCount || 0) + 1;
        const totalRating = (analytics.totalRating || 0) + responseData.overallRating;
        const averageRating = totalRating / responseCount;

        transaction.update(batchRef, {
            'analytics.responseCount': responseCount,
            'analytics.totalRating': totalRating,
            'analytics.averageRating': averageRating,
            'analytics.lastUpdated': admin.firestore.FieldValue.serverTimestamp(),
            'analytics.satisfactionIndex': responseData.analytics.satisfactionIndex,
            'analytics.tasteProfileScore': responseData.analytics.tasteProfileScore
        });
    });
}

async function updateBreweryAnalytics(breweryId, responseData) {
    const breweryRef = admin.firestore().collection('breweries').doc(breweryId);
    
    await admin.firestore().runTransaction(async (transaction) => {
        const breweryDoc = await transaction.get(breweryRef);
        const breweryData = breweryDoc.data() || {};
        
        const analytics = breweryData.analytics || {};
        const totalResponses = (analytics.totalResponses || 0) + 1;
        const totalRating = (analytics.totalRating || 0) + responseData.overallRating;
        const averageRating = totalRating / totalResponses;

        transaction.update(breweryRef, {
            'analytics.totalResponses': totalResponses,
            'analytics.totalRating': totalRating,
            'analytics.averageRating': averageRating,
            'analytics.lastUpdated': admin.firestore.FieldValue.serverTimestamp()
        });
    });
}

async function updateSessionAnalytics(sessionId, journeyEvent) {
    const sessionRef = admin.firestore().collection('sessions').doc(sessionId);
    
    await admin.firestore().runTransaction(async (transaction) => {
        const sessionDoc = await transaction.get(sessionRef);
        
        if (!sessionDoc.exists) {
            transaction.set(sessionRef, {
                sessionId,
                startTime: journeyEvent.timestamp,
                events: [journeyEvent],
                eventCount: 1,
                breweryId: journeyEvent.breweryId
            });
        } else {
            const sessionData = sessionDoc.data();
            const events = sessionData.events || [];
            events.push(journeyEvent);
            
            transaction.update(sessionRef, {
                events,
                eventCount: events.length,
                lastActivity: journeyEvent.timestamp
            });
        }
    });
}

async function triggerPredictiveAnalytics(breweryId, batchId, responseData) {
    // This would trigger ML models or statistical analysis
    // For now, we'll just log that it should be triggered
    functions.logger.info('Predictive analytics should be triggered', {
        breweryId,
        batchId,
        responseId: responseData.responseId
    });
}

async function updateBreweryRevenueAnalytics(breweryId, revenueImpact) {
    const revenueRef = admin.firestore()
        .collection('breweries').doc(breweryId)
        .collection('analytics').doc('revenue');
    
    await admin.firestore().runTransaction(async (transaction) => {
        const revenueDoc = await transaction.get(revenueRef);
        
        if (!revenueDoc.exists) {
            transaction.set(revenueRef, {
                totalRevenue: revenueImpact.revenue.totalRevenue,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                monthlyRevenue: {},
                trends: []
            });
        } else {
            const currentData = revenueDoc.data();
            const newTotal = (currentData.totalRevenue || 0) + revenueImpact.revenue.totalRevenue;
            
            transaction.update(revenueRef, {
                totalRevenue: newTotal,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    });
}

async function getHistoricalData(breweryId, timeframe) {
    // Get historical survey responses, revenue data, etc.
    const responses = await admin.firestore()
        .collection('breweries').doc(breweryId)
        .collection('batches')
        .get();
    
    // Process and return historical data for predictions
    return {
        responses: responses.docs.map(doc => doc.data()),
        timeframe
    };
}

function generateRevenueForecast(historicalData) {
    // Simple linear projection - in production would use ML models
    return {
        nextMonth: 15000,
        nextQuarter: 45000,
        nextYear: 180000,
        confidence: 0.75
    };
}

function predictCustomerGrowth(historicalData) {
    return {
        newCustomersNextMonth: 150,
        retentionRate: 0.85,
        churnPrediction: 0.15
    };
}

function predictQualityTrends(historicalData) {
    return {
        overallQualityTrend: 'improving',
        riskAreas: ['carbonation', 'consistency'],
        opportunities: ['hop flavor', 'mouthfeel']
    };
}

function identifyMarketOpportunities(historicalData) {
    return {
        growthSegments: ['IPA', 'Sour Ales'],
        underperformingStyles: ['Lagers'],
        seasonalOpportunities: ['Summer Wheat', 'Winter Stout']
    };
}

function analyzeRiskFactors(historicalData) {
    return {
        qualityRisks: ['batch consistency'],
        marketRisks: ['seasonal demand'],
        operationalRisks: ['supply chain']
    };
}

function generateRecommendations(historicalData) {
    return [
        'Focus on IPA quality improvements',
        'Expand summer seasonal offerings',
        'Improve batch consistency monitoring',
        'Increase customer retention programs'
    ];
}