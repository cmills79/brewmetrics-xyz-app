// Advanced Analytics System
// Revenue impact, customer intelligence, and competitive positioning

class AdvancedAnalytics {
    constructor() {
        this.isLoading = false;
        this.analyticsData = null;
        this.charts = {};
        this.init();
    }

    init() {
        this.setupAnalyticsSection();
        this.loadAnalyticsData();
    }

    setupAnalyticsSection() {
        const analyticsSection = document.getElementById('advanced-analytics-section');
        if (!analyticsSection) return;

        analyticsSection.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-chart-line"></i> Advanced Analytics Suite</h2>
                <div class="analytics-controls">
                    <select id="analytics-timeframe" class="form-select">
                        <option value="30">Last 30 Days</option>
                        <option value="90" selected>Last 90 Days</option>
                        <option value="180">Last 6 Months</option>
                        <option value="365">Last Year</option>
                    </select>
                    <button id="refresh-analytics" class="btn btn-primary btn-small">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <div id="analytics-loading" class="loading-state" style="display: none;">
                <i class="fas fa-spinner fa-spin"></i> Analyzing your brewery data...
            </div>

            <!-- Revenue Impact Analytics -->
            <div class="analytics-module">
                <div class="module-header">
                    <h3><i class="fas fa-dollar-sign"></i> Revenue Impact Analysis</h3>
                    <span class="premium-badge">Premium</span>
                </div>
                <div class="analytics-grid">
                    <div class="metric-card revenue-card">
                        <div class="metric-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="metric-content">
                            <div class="metric-value" id="revenue-impact">+$12,450</div>
                            <div class="metric-label">Revenue Impact</div>
                            <div class="metric-change positive">+23% vs last period</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon"><i class="fas fa-users"></i></div>
                        <div class="metric-content">
                            <div class="metric-value" id="customer-retention">87%</div>
                            <div class="metric-label">Customer Retention</div>
                            <div class="metric-change positive">+12% improvement</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon"><i class="fas fa-star"></i></div>
                        <div class="metric-content">
                            <div class="metric-value" id="satisfaction-score">4.6</div>
                            <div class="metric-label">Avg Satisfaction</div>
                            <div class="metric-change positive">+0.4 improvement</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon"><i class="fas fa-repeat"></i></div>
                        <div class="metric-content">
                            <div class="metric-value" id="repeat-visits">68%</div>
                            <div class="metric-label">Repeat Visits</div>
                            <div class="metric-change positive">+15% increase</div>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="revenue-trend-chart"></canvas>
                </div>
            </div>

            <!-- Customer Intelligence -->
            <div class="analytics-module">
                <div class="module-header">
                    <h3><i class="fas fa-brain"></i> Customer Intelligence</h3>
                    <span class="premium-badge">Premium</span>
                </div>
                <div class="intelligence-grid">
                    <div class="intelligence-card">
                        <h4>Top Customer Preferences</h4>
                        <div class="preference-list">
                            <div class="preference-item">
                                <span class="preference-name">Hoppy IPAs</span>
                                <div class="preference-bar">
                                    <div class="preference-fill" style="width: 85%"></div>
                                </div>
                                <span class="preference-value">85%</span>
                            </div>
                            <div class="preference-item">
                                <span class="preference-name">Smooth Porters</span>
                                <div class="preference-bar">
                                    <div class="preference-fill" style="width: 72%"></div>
                                </div>
                                <span class="preference-value">72%</span>
                            </div>
                            <div class="preference-item">
                                <span class="preference-name">Light Wheat Beers</span>
                                <div class="preference-bar">
                                    <div class="preference-fill" style="width: 68%"></div>
                                </div>
                                <span class="preference-value">68%</span>
                            </div>
                        </div>
                    </div>
                    <div class="intelligence-card">
                        <h4>Customer Segments</h4>
                        <div class="chart-container">
                            <canvas id="customer-segments-chart"></canvas>
                        </div>
                    </div>
                    <div class="intelligence-card">
                        <h4>Taste Profile Insights</h4>
                        <div class="chart-container">
                            <canvas id="taste-profile-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Predictive Analytics -->
            <div class="analytics-module">
                <div class="module-header">
                    <h3><i class="fas fa-crystal-ball"></i> Predictive Analytics</h3>
                    <span class="premium-badge">Premium</span>
                </div>
                <div class="predictions-grid">
                    <div class="prediction-card">
                        <div class="prediction-icon"><i class="fas fa-trending-up"></i></div>
                        <div class="prediction-content">
                            <h4>Revenue Forecast</h4>
                            <div class="prediction-value">$18,200</div>
                            <div class="prediction-period">Next 30 days</div>
                            <div class="prediction-confidence">92% confidence</div>
                        </div>
                    </div>
                    <div class="prediction-card">
                        <div class="prediction-icon"><i class="fas fa-beer"></i></div>
                        <div class="prediction-content">
                            <h4>Best Performing Style</h4>
                            <div class="prediction-value">West Coast IPA</div>
                            <div class="prediction-period">Next quarter</div>
                            <div class="prediction-confidence">87% confidence</div>
                        </div>
                    </div>
                    <div class="prediction-card">
                        <div class="prediction-icon"><i class="fas fa-calendar"></i></div>
                        <div class="prediction-content">
                            <h4>Peak Season</h4>
                            <div class="prediction-value">Summer 2025</div>
                            <div class="prediction-period">Jun - Aug</div>
                            <div class="prediction-confidence">94% confidence</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Competitive Analysis -->
            <div class="analytics-module">
                <div class="module-header">
                    <h3><i class="fas fa-trophy"></i> Competitive Positioning</h3>
                    <span class="premium-badge">Premium</span>
                </div>
                <div class="competitive-grid">
                    <div class="competitive-card">
                        <h4>Market Position</h4>
                        <div class="position-indicator">
                            <div class="position-rank">#3</div>
                            <div class="position-label">in Local Market</div>
                            <div class="position-change">↑2 positions</div>
                        </div>
                    </div>
                    <div class="competitive-card">
                        <h4>Rating Comparison</h4>
                        <div class="comparison-chart">
                            <div class="comparison-item">
                                <span class="comparison-label">Your Brewery</span>
                                <div class="comparison-bar yours">
                                    <div class="comparison-fill" style="width: 92%"></div>
                                </div>
                                <span class="comparison-value">4.6★</span>
                            </div>
                            <div class="comparison-item">
                                <span class="comparison-label">Market Average</span>
                                <div class="comparison-bar average">
                                    <div class="comparison-fill" style="width: 76%"></div>
                                </div>
                                <span class="comparison-value">3.8★</span>
                            </div>
                            <div class="comparison-item">
                                <span class="comparison-label">Top Competitor</span>
                                <div class="comparison-bar competitor">
                                    <div class="comparison-fill" style="width: 88%"></div>
                                </div>
                                <span class="comparison-value">4.4★</span>
                            </div>
                        </div>
                    </div>
                    <div class="competitive-card">
                        <h4>Strengths & Opportunities</h4>
                        <div class="insights-list">
                            <div class="insight-item strength">
                                <i class="fas fa-check-circle"></i>
                                <span>Superior IPA ratings (+0.8 vs competitors)</span>
                            </div>
                            <div class="insight-item strength">
                                <i class="fas fa-check-circle"></i>
                                <span>Excellent customer service scores</span>
                            </div>
                            <div class="insight-item opportunity">
                                <i class="fas fa-lightbulb"></i>
                                <span>Opportunity: Expand wheat beer selection</span>
                            </div>
                            <div class="insight-item opportunity">
                                <i class="fas fa-lightbulb"></i>
                                <span>Opportunity: Improve weekend wait times</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actionable Recommendations -->
            <div class="analytics-module">
                <div class="module-header">
                    <h3><i class="fas fa-lightbulb"></i> AI Recommendations</h3>
                    <span class="premium-badge">Premium</span>
                </div>
                <div class="recommendations-list">
                    <div class="recommendation-item high-impact">
                        <div class="recommendation-priority">High Impact</div>
                        <div class="recommendation-content">
                            <h4>Launch Seasonal IPA Variant</h4>
                            <p>Based on customer preferences, a citrus-forward summer IPA could increase revenue by 15-20%</p>
                            <div class="recommendation-metrics">
                                <span class="metric">Est. Revenue: +$3,200/month</span>
                                <span class="metric">Customer Interest: 89%</span>
                            </div>
                        </div>
                        <div class="recommendation-action">
                            <button class="btn btn-primary btn-small">View Recipe Suggestions</button>
                        </div>
                    </div>
                    <div class="recommendation-item medium-impact">
                        <div class="recommendation-priority">Medium Impact</div>
                        <div class="recommendation-content">
                            <h4>Optimize Porter Recipe</h4>
                            <p>Customers love your porter but suggest slightly more chocolate notes</p>
                            <div class="recommendation-metrics">
                                <span class="metric">Est. Rating Boost: +0.3</span>
                                <span class="metric">Implementation: Easy</span>
                            </div>
                        </div>
                        <div class="recommendation-action">
                            <button class="btn btn-secondary btn-small">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.initializeCharts();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'refresh-analytics') {
                this.refreshAnalytics();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'analytics-timeframe') {
                this.updateTimeframe(e.target.value);
            }
        });
    }

    async loadAnalyticsData() {
        this.showLoading(true);
        
        try {
            // Simulate API call for analytics data
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.analyticsData = {
                revenue: {
                    current: 12450,
                    previous: 10120,
                    trend: [8500, 9200, 10120, 11300, 12450]
                },
                customers: {
                    retention: 87,
                    satisfaction: 4.6,
                    repeatVisits: 68,
                    segments: {
                        'IPA Enthusiasts': 35,
                        'Casual Drinkers': 28,
                        'Craft Connoisseurs': 22,
                        'Social Visitors': 15
                    }
                },
                predictions: {
                    nextMonthRevenue: 18200,
                    bestStyle: 'West Coast IPA',
                    peakSeason: 'Summer 2025'
                }
            };

            this.updateAnalyticsDisplay();
            this.updateCharts();
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const loading = document.getElementById('analytics-loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    updateAnalyticsDisplay() {
        if (!this.analyticsData) return;

        // Update metric values
        const metrics = {
            'revenue-impact': `+$${this.analyticsData.revenue.current.toLocaleString()}`,
            'customer-retention': `${this.analyticsData.customers.retention}%`,
            'satisfaction-score': this.analyticsData.customers.satisfaction.toString(),
            'repeat-visits': `${this.analyticsData.customers.repeatVisits}%`
        };

        Object.entries(metrics).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    initializeCharts() {
        // Revenue Trend Chart
        const revenueCtx = document.getElementById('revenue-trend-chart');
        if (revenueCtx) {
            this.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Revenue Impact',
                        data: [8500, 9200, 10120, 11300, 12450],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
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

        // Customer Segments Chart
        const segmentsCtx = document.getElementById('customer-segments-chart');
        if (segmentsCtx) {
            this.charts.segments = new Chart(segmentsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['IPA Enthusiasts', 'Casual Drinkers', 'Craft Connoisseurs', 'Social Visitors'],
                    datasets: [{
                        data: [35, 28, 22, 15],
                        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }

        // Taste Profile Chart
        const tasteCtx = document.getElementById('taste-profile-chart');
        if (tasteCtx) {
            this.charts.taste = new Chart(tasteCtx, {
                type: 'radar',
                data: {
                    labels: ['Hoppy', 'Malty', 'Smooth', 'Crisp', 'Bold', 'Balanced'],
                    datasets: [{
                        label: 'Customer Preference',
                        data: [85, 65, 78, 72, 68, 82],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.2)'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    updateCharts() {
        if (!this.analyticsData) return;

        // Update revenue chart
        if (this.charts.revenue) {
            this.charts.revenue.data.datasets[0].data = this.analyticsData.revenue.trend;
            this.charts.revenue.update();
        }

        // Update segments chart
        if (this.charts.segments) {
            const segments = this.analyticsData.customers.segments;
            this.charts.segments.data.datasets[0].data = Object.values(segments);
            this.charts.segments.update();
        }
    }

    async refreshAnalytics() {
        await this.loadAnalyticsData();
    }

    updateTimeframe(days) {
        // Update analytics based on timeframe
        this.loadAnalyticsData();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.advancedAnalytics = new AdvancedAnalytics();
    });
} else {
    window.advancedAnalytics = new AdvancedAnalytics();
}