// Revenue and Business Metrics Tracking

class RevenueTracker {
    constructor(breweryId) {
        this.breweryId = breweryId;
        this.init();
    }

    init() {
        this.setupRevenueTracking();
        this.trackBusinessMetrics();
    }

    // Track revenue impact from survey responses
    async trackSurveyRevenueImpact(surveyData) {
        const revenueImpact = this.calculateSurveyRevenueImpact(surveyData);
        
        try {
            if (typeof functions !== 'undefined') {
                const captureRevenue = functions.httpsCallable('captureRevenueImpact');
                await captureRevenue({
                    breweryId: this.breweryId,
                    batchId: surveyData.batchId,
                    revenueData: revenueImpact.revenue,
                    salesData: revenueImpact.sales,
                    customerData: revenueImpact.customer
                });
            }
        } catch (error) {
            console.error('Revenue tracking failed:', error);
        }
    }

    // Calculate revenue impact from survey feedback
    calculateSurveyRevenueImpact(surveyData) {
        const overallRating = surveyData.overallRating || 0;
        const satisfactionIndex = surveyData.analytics?.satisfactionIndex || 0;
        
        // Estimate revenue impact based on satisfaction
        const baseRevenue = 50; // Base revenue per customer
        const satisfactionMultiplier = satisfactionIndex / 100;
        const ratingMultiplier = overallRating / 5;
        
        const estimatedRevenue = baseRevenue * satisfactionMultiplier * ratingMultiplier;
        const repeatPurchaseLikelihood = this.calculateRepeatPurchase(overallRating);
        const referralLikelihood = this.calculateReferralPotential(overallRating);
        
        return {
            revenue: {
                estimatedImmediateRevenue: estimatedRevenue,
                potentialLifetimeValue: estimatedRevenue * repeatPurchaseLikelihood * 12,
                referralValue: estimatedRevenue * referralLikelihood * 3,
                totalPotentialImpact: estimatedRevenue * (1 + repeatPurchaseLikelihood + referralLikelihood)
            },
            sales: {
                conversionProbability: satisfactionMultiplier,
                upsellPotential: ratingMultiplier,
                seasonalImpact: this.calculateSeasonalImpact(),
                channelPerformance: this.estimateChannelPerformance(overallRating)
            },
            customer: {
                retentionProbability: repeatPurchaseLikelihood,
                referralPotential: referralLikelihood,
                brandLoyalty: satisfactionIndex,
                churnRisk: 1 - satisfactionMultiplier
            }
        };
    }

    calculateRepeatPurchase(rating) {
        if (rating >= 4) return 0.8;
        if (rating >= 3) return 0.5;
        if (rating >= 2) return 0.2;
        return 0.1;
    }

    calculateReferralPotential(rating) {
        if (rating >= 5) return 0.6;
        if (rating >= 4) return 0.3;
        if (rating >= 3) return 0.1;
        return 0.05;
    }

    calculateSeasonalImpact() {
        const month = new Date().getMonth();
        // Summer months typically higher for beer sales
        if (month >= 5 && month <= 8) return 1.3;
        if (month >= 11 || month <= 1) return 1.1; // Holiday season
        return 1.0;
    }

    estimateChannelPerformance(rating) {
        return {
            taproom: rating >= 4 ? 1.2 : 1.0,
            retail: rating >= 4 ? 1.1 : 0.9,
            online: rating >= 4 ? 1.3 : 0.8,
            events: rating >= 4 ? 1.4 : 1.0
        };
    }

    // Setup automated revenue tracking
    setupRevenueTracking() {
        // Track page engagement as proxy for purchase intent
        this.trackEngagementMetrics();
        
        // Track conversion events
        this.trackConversionEvents();
    }

    trackEngagementMetrics() {
        let engagementScore = 0;
        const startTime = Date.now();
        
        // Time on site
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            engagementScore += Math.min(timeSpent / 1000 / 60, 10); // Max 10 points for time
        });
        
        // Scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                engagementScore += 0.1;
            }
        });
        
        // Click interactions
        document.addEventListener('click', () => {
            engagementScore += 0.5;
        });
        
        this.engagementScore = engagementScore;
    }

    trackConversionEvents() {
        // Track survey completion as conversion
        document.addEventListener('surveyCompleted', (event) => {
            this.trackConversion('survey_completion', {
                batchId: event.detail.batchId,
                rating: event.detail.overallRating,
                engagementScore: this.engagementScore
            });
        });
        
        // Track QR code scans
        if (document.referrer.includes('qr') || window.location.search.includes('qr')) {
            this.trackConversion('qr_scan', {
                source: 'qr_code',
                timestamp: Date.now()
            });
        }
    }

    async trackConversion(type, data) {
        try {
            if (typeof functions !== 'undefined') {
                const trackJourney = functions.httpsCallable('trackCustomerJourney');
                await trackJourney({
                    breweryId: this.breweryId,
                    eventType: 'conversion',
                    eventData: { type, ...data },
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('Conversion tracking failed:', error);
        }
    }

    // Track business metrics
    trackBusinessMetrics() {
        // Simulate business metrics that would come from POS/sales systems
        this.generateBusinessMetrics();
    }

    generateBusinessMetrics() {
        // This would integrate with actual POS/sales systems
        // For demo purposes, we'll generate realistic metrics
        const metrics = {
            dailyRevenue: this.generateDailyRevenue(),
            customerCount: this.generateCustomerCount(),
            averageOrderValue: this.generateAverageOrderValue(),
            topSellingBatches: this.generateTopSellingBatches(),
            seasonalTrends: this.generateSeasonalTrends()
        };
        
        return metrics;
    }

    generateDailyRevenue() {
        // Generate realistic daily revenue data
        const baseRevenue = 2000;
        const variation = Math.random() * 1000;
        const seasonalMultiplier = this.calculateSeasonalImpact();
        
        return Math.round(baseRevenue + variation * seasonalMultiplier);
    }

    generateCustomerCount() {
        return Math.floor(Math.random() * 100) + 50;
    }

    generateAverageOrderValue() {
        return Math.round((Math.random() * 20 + 25) * 100) / 100;
    }

    generateTopSellingBatches() {
        return [
            { batchId: 'IPA-001', revenue: 1200, units: 48 },
            { batchId: 'LAGER-002', revenue: 800, units: 40 },
            { batchId: 'STOUT-003', revenue: 600, units: 24 }
        ];
    }

    generateSeasonalTrends() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map(month => ({
            month,
            revenue: Math.floor(Math.random() * 50000) + 30000,
            growth: (Math.random() - 0.5) * 20
        }));
    }

    // Calculate ROI from feedback improvements
    calculateFeedbackROI(beforeRating, afterRating, timeframe = 30) {
        const ratingImprovement = afterRating - beforeRating;
        const revenueImpact = ratingImprovement * 1000; // $1000 per rating point improvement
        const customerRetention = ratingImprovement * 0.1; // 10% retention improvement per point
        const referralIncrease = ratingImprovement * 0.05; // 5% referral increase per point
        
        return {
            revenueImpact,
            customerRetention,
            referralIncrease,
            totalROI: revenueImpact + (customerRetention * 500) + (referralIncrease * 300)
        };
    }
}

// Auto-initialize revenue tracking when brewery ID is available
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const breweryId = urlParams.get('breweryId');
    
    if (breweryId) {
        window.revenueTracker = new RevenueTracker(breweryId);
    }
});