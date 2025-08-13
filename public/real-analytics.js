// Real Analytics System - Calculates from actual survey data
class RealAnalytics {
    constructor() {
        this.breweryId = null;
        this.analyticsData = null;
        this.init();
    }

    init() {
        // Get current user/brewery ID
        if (typeof currentUserId !== 'undefined') {
            this.breweryId = currentUserId;
            this.loadRealAnalytics();
        }
    }

    async loadRealAnalytics() {
        if (!this.breweryId || !db) return;

        try {
            const [batchesData, responsesData] = await Promise.all([
                this.getBatchesData(),
                this.getAllResponses()
            ]);

            this.analyticsData = {
                revenue: await this.calculateRevenueMetrics(responsesData),
                customers: await this.calculateCustomerMetrics(responsesData),
                preferences: await this.calculatePreferences(batchesData, responsesData),
                predictions: await this.generatePredictions(responsesData)
            };

            this.updateAnalyticsDisplay();
            return this.analyticsData;
        } catch (error) {
            console.error('Error loading real analytics:', error);
            return null;
        }
    }

    async getBatchesData() {
        const snapshot = await db.collection('breweries').doc(this.breweryId).collection('batches').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async getAllResponses() {
        const batchesSnapshot = await db.collection('breweries').doc(this.breweryId).collection('batches').get();
        const allResponses = [];

        for (const batchDoc of batchesSnapshot.docs) {
            const responsesSnapshot = await batchDoc.ref.collection('responses').get();
            responsesSnapshot.docs.forEach(responseDoc => {
                allResponses.push({
                    id: responseDoc.id,
                    batchId: batchDoc.id,
                    batchName: batchDoc.data().beerName,
                    ...responseDoc.data()
                });
            });
        }
        return allResponses;
    }

    async calculateRevenueMetrics(responses) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Estimate revenue impact based on ratings and response volume
        const recentResponses = responses.filter(r => {
            const responseDate = r.submittedAt?.toDate() || new Date(r.timestamp);
            return responseDate >= thirtyDaysAgo;
        });

        const previousResponses = responses.filter(r => {
            const responseDate = r.submittedAt?.toDate() || new Date(r.timestamp);
            return responseDate >= sixtyDaysAgo && responseDate < thirtyDaysAgo;
        });

        // Calculate average satisfaction and estimate revenue impact
        const avgRating = recentResponses.reduce((sum, r) => sum + (r.overallRating || 0), 0) / recentResponses.length || 0;
        const prevAvgRating = previousResponses.reduce((sum, r) => sum + (r.overallRating || 0), 0) / previousResponses.length || 0;

        // Estimate revenue based on response volume and satisfaction (simplified model)
        const estimatedRevenue = Math.round(recentResponses.length * avgRating * 50); // $50 per positive response
        const previousRevenue = Math.round(previousResponses.length * prevAvgRating * 50);

        return {
            current: estimatedRevenue,
            previous: previousRevenue,
            change: previousRevenue > 0 ? ((estimatedRevenue - previousRevenue) / previousRevenue * 100) : 0,
            responseVolume: recentResponses.length,
            avgSatisfaction: avgRating
        };
    }

    async calculateCustomerMetrics(responses) {
        // Calculate retention based on repeat survey submissions (simplified)
        const uniqueUsers = new Set(responses.map(r => r.userId || r.id)).size;
        const totalResponses = responses.length;
        const estimatedRetention = uniqueUsers > 0 ? Math.min(95, (totalResponses / uniqueUsers) * 20) : 0;

        // Calculate satisfaction metrics
        const ratingsWithValues = responses.filter(r => r.overallRating && r.overallRating > 0);
        const avgSatisfaction = ratingsWithValues.reduce((sum, r) => sum + r.overallRating, 0) / ratingsWithValues.length || 0;

        // Estimate repeat visits based on high ratings
        const highRatings = ratingsWithValues.filter(r => r.overallRating >= 4).length;
        const repeatVisitRate = ratingsWithValues.length > 0 ? (highRatings / ratingsWithValues.length * 100) : 0;

        return {
            retention: Math.round(estimatedRetention),
            satisfaction: Math.round(avgSatisfaction * 10) / 10,
            repeatVisits: Math.round(repeatVisitRate),
            totalResponses: totalResponses,
            uniqueCustomers: uniqueUsers
        };
    }

    async calculatePreferences(batches, responses) {
        // Analyze beer style preferences based on ratings
        const styleRatings = {};
        
        responses.forEach(response => {
            const batch = batches.find(b => b.id === response.batchId);
            if (batch && response.overallRating) {
                const style = this.categorizeStyle(batch.beerName || batch.style || 'Other');
                if (!styleRatings[style]) {
                    styleRatings[style] = { total: 0, count: 0, ratings: [] };
                }
                styleRatings[style].total += response.overallRating;
                styleRatings[style].count += 1;
                styleRatings[style].ratings.push(response.overallRating);
            }
        });

        // Calculate preference percentages
        const preferences = Object.entries(styleRatings)
            .map(([style, data]) => ({
                style,
                avgRating: data.total / data.count,
                responseCount: data.count,
                preference: Math.min(100, (data.total / data.count) * 20) // Convert to percentage
            }))
            .sort((a, b) => b.preference - a.preference)
            .slice(0, 5);

        return preferences;
    }

    categorizeStyle(beerName) {
        const name = beerName.toLowerCase();
        if (name.includes('ipa') || name.includes('hop')) return 'Hoppy IPAs';
        if (name.includes('porter') || name.includes('stout')) return 'Dark Beers';
        if (name.includes('wheat') || name.includes('wit')) return 'Wheat Beers';
        if (name.includes('lager') || name.includes('pilsner')) return 'Light Lagers';
        if (name.includes('sour') || name.includes('gose')) return 'Sour Beers';
        return 'Other Styles';
    }

    async generatePredictions(responses) {
        const recentResponses = responses.filter(r => {
            const responseDate = r.submittedAt?.toDate() || new Date(r.timestamp);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return responseDate >= thirtyDaysAgo;
        });

        // Simple trend-based predictions
        const avgDailyResponses = recentResponses.length / 30;
        const avgRating = recentResponses.reduce((sum, r) => sum + (r.overallRating || 0), 0) / recentResponses.length || 0;
        
        // Predict next month revenue
        const predictedResponses = avgDailyResponses * 30;
        const predictedRevenue = Math.round(predictedResponses * avgRating * 50);

        return {
            nextMonthRevenue: predictedRevenue,
            confidence: Math.min(95, recentResponses.length * 2), // Higher confidence with more data
            trendDirection: recentResponses.length > 10 ? 'up' : 'stable'
        };
    }

    updateAnalyticsDisplay() {
        if (!this.analyticsData) return;

        // Update revenue metrics
        const revenueElement = document.getElementById('revenue-impact');
        if (revenueElement) {
            revenueElement.textContent = `+$${this.analyticsData.revenue.current.toLocaleString()}`;
        }

        // Update customer metrics
        const retentionElement = document.getElementById('customer-retention');
        if (retentionElement) {
            retentionElement.textContent = `${this.analyticsData.customers.retention}%`;
        }

        const satisfactionElement = document.getElementById('satisfaction-score');
        if (satisfactionElement) {
            satisfactionElement.textContent = this.analyticsData.customers.satisfaction.toString();
        }

        const repeatVisitsElement = document.getElementById('repeat-visits');
        if (repeatVisitsElement) {
            repeatVisitsElement.textContent = `${this.analyticsData.customers.repeatVisits}%`;
        }

        // Update preferences
        this.updatePreferencesDisplay();
    }

    updatePreferencesDisplay() {
        const preferencesList = document.querySelector('.preference-list');
        if (!preferencesList || !this.analyticsData.preferences) return;

        preferencesList.innerHTML = '';
        this.analyticsData.preferences.forEach(pref => {
            const item = document.createElement('div');
            item.className = 'preference-item';
            item.innerHTML = `
                <span class="preference-name">${pref.style}</span>
                <div class="preference-bar">
                    <div class="preference-fill" style="width: ${pref.preference}%"></div>
                </div>
                <span class="preference-value">${Math.round(pref.preference)}%</span>
            `;
            preferencesList.appendChild(item);
        });
    }

    // Method to get real analytics data for external use
    async getRealAnalyticsData() {
        if (!this.analyticsData) {
            await this.loadRealAnalytics();
        }
        return this.analyticsData;
    }
}

// Initialize real analytics
window.realAnalytics = new RealAnalytics();