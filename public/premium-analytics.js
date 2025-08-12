// Premium Analytics Module for BrewMetrics
// Advanced analytics features for subscription tier

class PremiumAnalytics {
  constructor() {
    this.db = firebase.firestore();
    this.userId = null;
    this.charts = {};
    this.analyticsData = {};
    this.init();
  }

  init() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
        this.loadPremiumAnalytics();
      }
    });
  }

  async loadPremiumAnalytics() {
    if (!this.userId) return;
    
    try {
      await Promise.all([
        this.loadRevenueAnalytics(),
        this.loadCustomerInsights(),
        this.loadPredictiveAnalytics(),
        this.loadCompetitiveAnalysis(),
        this.loadSeasonalTrends()
      ]);
      
      this.renderAnalyticsDashboard();
    } catch (error) {
      console.error('Error loading premium analytics:', error);
    }
  }

  async loadRevenueAnalytics() {
    // Calculate revenue impact from feedback scores
    const batches = await this.db.collection('breweries').doc(this.userId).collection('batches').get();
    const revenueData = [];
    
    for (const batch of batches.docs) {
      const batchData = batch.data();
      const responses = await batch.ref.collection('responses').get();
      
      let totalRating = 0;
      let ratingCount = 0;
      
      responses.forEach(response => {
        const data = response.data();
        if (data.overallRating) {
          totalRating += data.overallRating;
          ratingCount++;
        }
      });
      
      const avgRating = ratingCount > 0 ? totalRating / ratingCount : 0;
      const estimatedRevenue = this.calculateRevenueImpact(avgRating, ratingCount, batchData);
      
      revenueData.push({
        batchName: batchData.beerName,
        avgRating,
        responseCount: ratingCount,
        estimatedRevenue,
        date: batchData.packagedDate
      });
    }
    
    this.analyticsData.revenue = revenueData;
  }

  calculateRevenueImpact(avgRating, responseCount, batchData) {
    // Proprietary algorithm for revenue impact calculation
    const basePrice = 8; // Average beer price
    const volumeMultiplier = responseCount * 10; // Estimate total sales from sample
    const ratingMultiplier = Math.max(0.5, avgRating / 5); // Rating impact on sales
    
    return basePrice * volumeMultiplier * ratingMultiplier;
  }

  async loadCustomerInsights() {
    const insights = {
      demographics: await this.analyzeCustomerDemographics(),
      preferences: await this.analyzeCustomerPreferences(),
      loyalty: await this.calculateCustomerLoyalty(),
      satisfaction: await this.analyzeSatisfactionTrends()
    };
    
    this.analyticsData.customerInsights = insights;
  }

  async analyzeCustomerDemographics() {
    // Analyze response patterns to infer demographics
    const batches = await this.db.collection('breweries').doc(this.userId).collection('batches').get();
    const demographics = {
      timePreferences: {},
      stylePreferences: {},
      ratingPatterns: {}
    };
    
    for (const batch of batches.docs) {
      const responses = await batch.ref.collection('responses').get();
      const batchData = batch.data();
      
      responses.forEach(response => {
        const data = response.data();
        const timestamp = data.respondedAt?.toDate();
        
        if (timestamp) {
          const hour = timestamp.getHours();
          const timeSlot = this.getTimeSlot(hour);
          demographics.timePreferences[timeSlot] = (demographics.timePreferences[timeSlot] || 0) + 1;
        }
        
        if (batchData.beerStyle) {
          demographics.stylePreferences[batchData.beerStyle] = (demographics.stylePreferences[batchData.beerStyle] || 0) + 1;
        }
      });
    }
    
    return demographics;
  }

  getTimeSlot(hour) {
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  }

  async analyzeSatisfactionTrends() {
    const batches = await this.db.collection('breweries').doc(this.userId).collection('batches').orderBy('createdAt').get();
    const trends = [];
    
    for (const batch of batches.docs) {
      const responses = await batch.ref.collection('responses').get();
      const batchData = batch.data();
      
      let totalSatisfaction = 0;
      let count = 0;
      
      responses.forEach(response => {
        const data = response.data();
        if (data.overallRating) {
          totalSatisfaction += data.overallRating;
          count++;
        }
      });
      
      if (count > 0) {
        trends.push({
          date: batchData.packagedDate,
          satisfaction: totalSatisfaction / count,
          batchName: batchData.beerName,
          responseCount: count
        });
      }
    }
    
    return trends;
  }

  async loadPredictiveAnalytics() {
    const predictions = {
      nextBestStyle: await this.predictNextBestStyle(),
      seasonalDemand: await this.predictSeasonalDemand(),
      qualityForecast: await this.predictQualityTrends(),
      revenueProjection: await this.projectRevenue()
    };
    
    this.analyticsData.predictions = predictions;
  }

  async predictNextBestStyle() {
    // Analyze trending styles and customer preferences
    const stylePerformance = {};
    const batches = await this.db.collection('breweries').doc(this.userId).collection('batches').get();
    
    for (const batch of batches.docs) {
      const batchData = batch.data();
      const responses = await batch.ref.collection('responses').get();
      
      if (batchData.beerStyle) {
        if (!stylePerformance[batchData.beerStyle]) {
          stylePerformance[batchData.beerStyle] = { totalRating: 0, count: 0 };
        }
        
        responses.forEach(response => {
          const data = response.data();
          if (data.overallRating) {
            stylePerformance[batchData.beerStyle].totalRating += data.overallRating;
            stylePerformance[batchData.beerStyle].count++;
          }
        });
      }
    }
    
    // Calculate average ratings and recommend best performing style
    let bestStyle = null;
    let bestScore = 0;
    
    Object.entries(stylePerformance).forEach(([style, data]) => {
      if (data.count > 0) {
        const avgRating = data.totalRating / data.count;
        const score = avgRating * Math.log(data.count + 1); // Weight by sample size
        
        if (score > bestScore) {
          bestScore = score;
          bestStyle = style;
        }
      }
    });
    
    return {
      recommendedStyle: bestStyle,
      confidence: Math.min(bestScore / 5, 1),
      reasoning: `Based on ${stylePerformance[bestStyle]?.count || 0} customer responses`
    };
  }

  async loadCompetitiveAnalysis() {
    // Analyze market positioning vs industry benchmarks
    const competitive = {
      marketPosition: await this.analyzeMarketPosition(),
      benchmarkComparison: await this.compareToBenchmarks(),
      competitiveAdvantages: await this.identifyAdvantages()
    };
    
    this.analyticsData.competitive = competitive;
  }

  async analyzeMarketPosition() {
    const batches = await this.db.collection('breweries').doc(this.userId).collection('batches').get();
    let totalRating = 0;
    let totalResponses = 0;
    
    for (const batch of batches.docs) {
      const responses = await batch.ref.collection('responses').get();
      
      responses.forEach(response => {
        const data = response.data();
        if (data.overallRating) {
          totalRating += data.overallRating;
          totalResponses++;
        }
      });
    }
    
    const avgRating = totalResponses > 0 ? totalRating / totalResponses : 0;
    
    // Industry benchmarks (would be from external data in production)
    const industryBenchmarks = {
      craftBeer: 4.1,
      localBrewery: 4.3,
      premiumBeer: 4.5
    };
    
    return {
      yourRating: avgRating,
      industryAverage: industryBenchmarks.craftBeer,
      localAverage: industryBenchmarks.localBrewery,
      premiumAverage: industryBenchmarks.premiumBeer,
      percentile: this.calculatePercentile(avgRating, industryBenchmarks.craftBeer)
    };
  }

  calculatePercentile(yourRating, industryAverage) {
    // Simplified percentile calculation
    const difference = yourRating - industryAverage;
    const percentile = 50 + (difference / industryAverage) * 30;
    return Math.max(5, Math.min(95, percentile));
  }

  renderAnalyticsDashboard() {
    this.renderRevenueAnalytics();
    this.renderCustomerInsights();
    this.renderPredictiveAnalytics();
    this.renderCompetitiveAnalysis();
    this.renderSeasonalTrends();
  }

  renderRevenueAnalytics() {
    const container = document.getElementById('revenue-analytics');
    if (!container) return;
    
    const revenueData = this.analyticsData.revenue || [];
    const totalRevenue = revenueData.reduce((sum, batch) => sum + batch.estimatedRevenue, 0);
    
    container.innerHTML = `
      <div class="analytics-card">
        <h3>Revenue Impact Analysis</h3>
        <div class="revenue-summary">
          <div class="metric">
            <span class="value">$${totalRevenue.toLocaleString()}</span>
            <span class="label">Estimated Monthly Revenue</span>
          </div>
          <div class="metric">
            <span class="value">${revenueData.length}</span>
            <span class="label">Active Products</span>
          </div>
        </div>
        <canvas id="revenue-chart"></canvas>
      </div>
    `;
    
    this.createRevenueChart(revenueData);
  }

  createRevenueChart(data) {
    const ctx = document.getElementById('revenue-chart')?.getContext('2d');
    if (!ctx) return;
    
    this.charts.revenue = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.batchName),
        datasets: [{
          label: 'Estimated Revenue',
          data: data.map(d => d.estimatedRevenue),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  renderCustomerInsights() {
    const container = document.getElementById('customer-insights');
    if (!container) return;
    
    const insights = this.analyticsData.customerInsights || {};
    
    container.innerHTML = `
      <div class="analytics-card">
        <h3>Customer Intelligence</h3>
        <div class="insights-grid">
          <div class="insight-item">
            <h4>Peak Hours</h4>
            <canvas id="time-preferences-chart"></canvas>
          </div>
          <div class="insight-item">
            <h4>Style Preferences</h4>
            <canvas id="style-preferences-chart"></canvas>
          </div>
          <div class="insight-item">
            <h4>Satisfaction Trend</h4>
            <canvas id="satisfaction-trend-chart"></canvas>
          </div>
        </div>
      </div>
    `;
    
    this.createCustomerInsightCharts(insights);
  }

  createCustomerInsightCharts(insights) {
    // Time preferences chart
    const timeCtx = document.getElementById('time-preferences-chart')?.getContext('2d');
    if (timeCtx && insights.demographics?.timePreferences) {
      this.charts.timePreferences = new Chart(timeCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(insights.demographics.timePreferences),
          datasets: [{
            data: Object.values(insights.demographics.timePreferences),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Satisfaction trend chart
    const satisfactionCtx = document.getElementById('satisfaction-trend-chart')?.getContext('2d');
    if (satisfactionCtx && insights.satisfaction) {
      this.charts.satisfaction = new Chart(satisfactionCtx, {
        type: 'line',
        data: {
          labels: insights.satisfaction.map(d => d.date),
          datasets: [{
            label: 'Satisfaction Score',
            data: insights.satisfaction.map(d => d.satisfaction),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 1,
              max: 5
            }
          }
        }
      });
    }
  }

  renderPredictiveAnalytics() {
    const container = document.getElementById('predictive-analytics');
    if (!container) return;
    
    const predictions = this.analyticsData.predictions || {};
    
    container.innerHTML = `
      <div class="analytics-card">
        <h3>AI Predictions & Recommendations</h3>
        <div class="predictions-grid">
          <div class="prediction-item">
            <h4>Next Best Style</h4>
            <div class="prediction-value">${predictions.nextBestStyle?.recommendedStyle || 'Analyzing...'}</div>
            <div class="confidence">Confidence: ${Math.round((predictions.nextBestStyle?.confidence || 0) * 100)}%</div>
          </div>
          <div class="prediction-item">
            <h4>Revenue Projection</h4>
            <div class="prediction-value">$${(predictions.revenueProjection || 0).toLocaleString()}</div>
            <div class="confidence">Next 30 days</div>
          </div>
        </div>
      </div>
    `;
  }

  renderCompetitiveAnalysis() {
    const container = document.getElementById('competitive-analysis');
    if (!container) return;
    
    const competitive = this.analyticsData.competitive || {};
    const position = competitive.marketPosition || {};
    
    container.innerHTML = `
      <div class="analytics-card">
        <h3>Market Position Analysis</h3>
        <div class="competitive-metrics">
          <div class="metric">
            <span class="value">${position.yourRating?.toFixed(1) || 'N/A'}</span>
            <span class="label">Your Average Rating</span>
          </div>
          <div class="metric">
            <span class="value">${position.industryAverage?.toFixed(1) || 'N/A'}</span>
            <span class="label">Industry Average</span>
          </div>
          <div class="metric">
            <span class="value">${Math.round(position.percentile || 0)}th</span>
            <span class="label">Percentile</span>
          </div>
        </div>
        <canvas id="competitive-chart"></canvas>
      </div>
    `;
    
    this.createCompetitiveChart(position);
  }

  createCompetitiveChart(position) {
    const ctx = document.getElementById('competitive-chart')?.getContext('2d');
    if (!ctx) return;
    
    this.charts.competitive = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Quality', 'Customer Satisfaction', 'Market Position', 'Innovation', 'Value'],
        datasets: [{
          label: 'Your Brewery',
          data: [
            position.yourRating || 0,
            position.yourRating || 0,
            (position.percentile || 0) / 20,
            4.2, // Placeholder
            4.0  // Placeholder
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)'
        }, {
          label: 'Industry Average',
          data: [
            position.industryAverage || 0,
            position.industryAverage || 0,
            2.5,
            3.8,
            3.5
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 5
          }
        }
      }
    });
  }

  async generateInsightReport() {
    const report = {
      summary: this.generateExecutiveSummary(),
      recommendations: this.generateRecommendations(),
      actionItems: this.generateActionItems(),
      kpis: this.calculateKPIs()
    };
    
    return report;
  }

  generateExecutiveSummary() {
    const revenue = this.analyticsData.revenue || [];
    const totalRevenue = revenue.reduce((sum, batch) => sum + batch.estimatedRevenue, 0);
    const avgRating = revenue.reduce((sum, batch) => sum + batch.avgRating, 0) / revenue.length;
    
    return `Your brewery generated an estimated $${totalRevenue.toLocaleString()} in revenue this month with an average customer rating of ${avgRating?.toFixed(1) || 'N/A'}. ${revenue.length} products are actively collecting feedback.`;
  }

  generateRecommendations() {
    const predictions = this.analyticsData.predictions || {};
    const recommendations = [];
    
    if (predictions.nextBestStyle?.recommendedStyle) {
      recommendations.push(`Consider brewing more ${predictions.nextBestStyle.recommendedStyle} based on customer preferences`);
    }
    
    recommendations.push('Focus on improving lowest-rated taste attributes');
    recommendations.push('Increase customer engagement during peak hours');
    
    return recommendations;
  }

  exportAnalyticsReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      brewery: this.userId,
      analytics: this.analyticsData,
      insights: this.generateInsightReport()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brewmetrics-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize Premium Analytics
document.addEventListener('DOMContentLoaded', () => {
  window.premiumAnalytics = new PremiumAnalytics();
});