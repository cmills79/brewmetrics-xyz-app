// --- START analytics.js (Advanced Analytics Module for BrewMetrics) ---
// Created: May 30, 2025
// Purpose: Modular analytics functionality separated from dashboard.js

// Global analytics namespace
const BrewMetricsAnalytics = (function() {
    'use strict';

    // Chart color palette
    const CHART_COLORS = {
        primary: 'rgba(224, 159, 62, 0.8)',      // Brew amber
        secondary: 'rgba(107, 79, 79, 0.8)',     // Brew brown
        success: 'rgba(76, 175, 80, 0.8)',       // Green
        danger: 'rgba(164, 74, 63, 0.8)',        // Muted red
        info: 'rgba(78, 141, 124, 0.8)',         // Brew link blue
        warning: 'rgba(255, 193, 7, 0.8)',       // Yellow
        distribution: [
            'rgba(211, 47, 47, 0.8)',    // Rating 1 - Red
            'rgba(255, 111, 0, 0.8)',    // Rating 2 - Orange
            'rgba(255, 193, 7, 0.8)',    // Rating 3 - Yellow
            'rgba(139, 195, 74, 0.8)',   // Rating 4 - Light Green
            'rgba(76, 175, 80, 0.8)'     // Rating 5 - Green
        ]
    };

    // =========================================================================
    // SECTION 1: Rating Distribution Analytics
    // =========================================================================
    
    /**
     * Generate rating distribution chart for a specific batch
     * @param {string} canvasId - The canvas element ID
     * @param {Array} responses - Array of response objects
     * @param {string} batchName - Name of the batch
     * @param {string} chartType - Type of distribution chart ('overall' or 'detailed')
     * @returns {Chart|null} - Chart instance or null if error
     */
    function createRatingDistributionChart(canvasId, responses, batchName, chartType = 'overall') {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) {
            console.error(`Canvas ${canvasId} not found for rating distribution chart`);
            return null;
        }

        // Destroy existing chart if any
        const chartId = `chart_${canvasId}`;
        if (window.chartInstances && window.chartInstances[chartId]) {
            window.chartInstances[chartId].destroy();
        }

        if (chartType === 'overall') {
            return createOverallRatingDistribution(ctx, chartId, responses, batchName);
        } else {
            return createDetailedRatingDistribution(ctx, chartId, responses, batchName);
        }
    }

    /**
     * Create overall rating distribution histogram
     */
    function createOverallRatingDistribution(ctx, chartId, responses, batchName) {
        // Count ratings
        const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = rating 1, index 4 = rating 5
        let validResponses = 0;

        responses.forEach(response => {
            if (response.overallRating && response.overallRating >= 1 && response.overallRating <= 5) {
                ratingCounts[response.overallRating - 1]++;
                validResponses++;
            }
        });

        // Calculate percentages
        const percentages = ratingCounts.map(count => 
            validResponses > 0 ? (count / validResponses * 100).toFixed(1) : 0
        );

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Number of Ratings',
                    data: ratingCounts,
                    backgroundColor: CHART_COLORS.distribution,
                    borderColor: CHART_COLORS.distribution.map(color => 
                        color.replace('0.8', '1')
                    ),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Overall Rating Distribution - ${batchName}`,
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                return `${percentages[index]}% of responses`;
                            }
                        }
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        formatter: (value, context) => {
                            if (value === 0) return '';
                            const percentage = percentages[context.dataIndex];
                            return `${value}\n(${percentage}%)`;
                        },
                        font: { size: 11 },
                        color: '#333'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            stepSize: 1,
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: 'Number of Responses'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Rating'
                        }
                    }
                }
            }
        });

        if (window.chartInstances) {
            window.chartInstances[chartId] = chart;
        }
        return chart;
    }

    /**
     * Create detailed rating distribution for all taste attributes
     */
    function createDetailedRatingDistribution(ctx, chartId, responses, batchName) {
        const attributes = [
            'Sweetness', 'Acidity', 'Bitterness', 'Body',
            'Carbonation', 'Malt', 'Hop Flavor', 'Finish'
        ];

        // Initialize data structure
        const distributionData = {};
        attributes.forEach(attr => {
            distributionData[attr] = [0, 0, 0, 0, 0]; // Counts for ratings 1-5
        });

        // Count ratings for each attribute
        responses.forEach(response => {
            if (response.ratings && Array.isArray(response.ratings)) {
                response.ratings.forEach((rating, index) => {
                    if (index < 8 && rating >= 1 && rating <= 5) {
                        distributionData[attributes[index]][rating - 1]++;
                    }
                });
            } else if (response.surveyAnswers && Array.isArray(response.surveyAnswers)) {
                response.surveyAnswers.forEach(answer => {
                    if (answer.questionId < 8 && answer.answer >= 1 && answer.answer <= 5) {
                        distributionData[attributes[answer.questionId]][answer.answer - 1]++;
                    }
                });
            }
        });

        // Create stacked bar chart
        const datasets = [];
        for (let rating = 1; rating <= 5; rating++) {
            datasets.push({
                label: `${rating} Star${rating > 1 ? 's' : ''}`,
                data: attributes.map(attr => distributionData[attr][rating - 1]),
                backgroundColor: CHART_COLORS.distribution[rating - 1],
                borderColor: CHART_COLORS.distribution[rating - 1].replace('0.8', '1'),
                borderWidth: 1
            });
        }

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: attributes,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Taste Attributes'
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Responses'
                        },
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Taste Attribute Rating Distribution - ${batchName}`,
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: { 
                            boxWidth: 15,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const attributeIndex = context.dataIndex;
                                const total = datasets.reduce((sum, dataset) => 
                                    sum + dataset.data[attributeIndex], 0
                                );
                                if (total === 0) return '';
                                const percentage = (context.parsed.y / total * 100).toFixed(1);
                                return `${percentage}% of responses`;
                            }
                        }
                    }
                }
            }
        });

        if (window.chartInstances) {
            window.chartInstances[chartId] = chart;
        }
        return chart;
    }

    /**
     * Generate analytics summary statistics
     */
    function calculateBatchStatistics(responses) {
        const stats = {
            totalResponses: responses.length,
            overallRating: { mean: 0, median: 0, mode: 0, std: 0 },
            attributes: {},
            responseRate: { daily: {}, weekly: {}, hourly: {} },
            completionRate: 0
        };

        // Overall rating statistics
        const overallRatings = responses
            .filter(r => r.overallRating && r.overallRating >= 1 && r.overallRating <= 5)
            .map(r => r.overallRating);

        if (overallRatings.length > 0) {
            stats.overallRating.mean = calculateMean(overallRatings);
            stats.overallRating.median = calculateMedian(overallRatings);
            stats.overallRating.mode = calculateMode(overallRatings);
            stats.overallRating.std = calculateStandardDeviation(overallRatings);
        }

        // Attribute statistics
        const attributeNames = [
            'Sweetness', 'Acidity', 'Bitterness', 'Body',
            'Carbonation', 'Malt', 'Hop Flavor', 'Finish'
        ];

        attributeNames.forEach((attr, index) => {
            const ratings = [];
            responses.forEach(response => {
                if (response.ratings && response.ratings[index]) {
                    ratings.push(response.ratings[index]);
                } else if (response.surveyAnswers) {
                    const answer = response.surveyAnswers.find(a => a.questionId === index);
                    if (answer && answer.answer) ratings.push(answer.answer);
                }
            });

            if (ratings.length > 0) {
                stats.attributes[attr] = {
                    mean: calculateMean(ratings),
                    median: calculateMedian(ratings),
                    mode: calculateMode(ratings),
                    std: calculateStandardDeviation(ratings),
                    count: ratings.length
                };
            }
        });

        // Response rate analysis
        responses.forEach(response => {
            const date = response.respondedAt?.toDate ? response.respondedAt.toDate() : 
                        (response.timestamp?.toDate ? response.timestamp.toDate() : null);
            if (date) {
                // Daily
                const dayKey = date.toISOString().split('T')[0];
                stats.responseRate.daily[dayKey] = (stats.responseRate.daily[dayKey] || 0) + 1;

                // Weekly
                const weekKey = getWeekNumber(date);
                stats.responseRate.weekly[weekKey] = (stats.responseRate.weekly[weekKey] || 0) + 1;

                // Hourly
                const hour = date.getHours();
                stats.responseRate.hourly[hour] = (stats.responseRate.hourly[hour] || 0) + 1;
            }
        });

        return stats;
    }

    // =========================================================================
    // SECTION 2: Utility Functions
    // =========================================================================

    function calculateMean(values) {
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    function calculateMedian(values) {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    function calculateMode(values) {
        if (values.length === 0) return 0;
        const frequency = {};
        let maxFreq = 0;
        let mode = values[0];

        values.forEach(val => {
            frequency[val] = (frequency[val] || 0) + 1;
            if (frequency[val] > maxFreq) {
                maxFreq = frequency[val];
                mode = val;
            }
        });
        return mode;
    }

    function calculateStandardDeviation(values) {
        if (values.length === 0) return 0;
        const mean = calculateMean(values);
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        const variance = calculateMean(squaredDiffs);
        return Math.sqrt(variance);
    }

    function getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
        return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    }

    // =========================================================================
    // SECTION 3: Generate Analytics Dashboard for Batch
    // =========================================================================

    /**
     * Generate complete analytics dashboard for a batch
     * @param {string} batchId - The batch ID
     * @param {object} batchData - Batch metadata
     * @param {Array} responses - Array of responses
     * @param {string} containerElementId - Container to append analytics to
     */
    function generateBatchAnalytics(batchId, batchData, responses, containerElementId) {
        const container = document.getElementById(containerElementId);
        if (!container) {
            console.error(`Container ${containerElementId} not found`);
            return;
        }

        // Clear previous content
        container.innerHTML = '';
        
        // Create analytics layout
        const analyticsHTML = `
            <div class="analytics-header">
                <h5>Analytics Dashboard - ${batchData.beerName || 'Unnamed Batch'}</h5>
                <div class="analytics-stats-summary">
                    <span class="stat-badge">
                        <i class="fas fa-chart-bar"></i> ${responses.length} Total Responses
                    </span>
                    <span class="stat-badge">
                        <i class="fas fa-star"></i> ${calculateMean(responses.map(r => r.overallRating || 0)).toFixed(2)} Avg Rating
                    </span>
                </div>
            </div>
            <div class="analytics-charts-grid">
                <div class="chart-container">
                    <canvas id="rating-dist-overall-${batchId}"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="rating-dist-detailed-${batchId}"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="response-timeline-${batchId}"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="hour-distribution-${batchId}"></canvas>
                </div>
            </div>
            <div class="analytics-insights">
                <h6>Key Insights</h6>
                <div id="insights-${batchId}" class="insights-list"></div>
            </div>
        `;

        container.innerHTML = analyticsHTML;
        container.classList.add('visible');

        // Generate charts
        setTimeout(() => {
            // Overall rating distribution
            createRatingDistributionChart(
                `rating-dist-overall-${batchId}`,
                responses,
                batchData.beerName,
                'overall'
            );

            // Detailed attribute distribution
            createRatingDistributionChart(
                `rating-dist-detailed-${batchId}`,
                responses,
                batchData.beerName,
                'detailed'
            );

            // Response timeline
            createResponseTimelineChart(
                `response-timeline-${batchId}`,
                responses,
                batchData.beerName
            );

            // Hour distribution
            createHourlyDistributionChart(
                `hour-distribution-${batchId}`,
                responses,
                batchData.beerName
            );

            // Generate insights
            generateInsights(batchId, responses);
        }, 100);
    }

    /**
     * Create response timeline chart
     */
    function createResponseTimelineChart(canvasId, responses, batchName) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        // Group responses by date
        const dailyData = {};
        responses.forEach(response => {
            const date = response.respondedAt?.toDate ? response.respondedAt.toDate() : 
                        (response.timestamp?.toDate ? response.timestamp.toDate() : null);
            if (date) {
                const dateKey = date.toISOString().split('T')[0];
                if (!dailyData[dateKey]) {
                    dailyData[dateKey] = { count: 0, totalRating: 0 };
                }
                dailyData[dateKey].count++;
                if (response.overallRating) {
                    dailyData[dateKey].totalRating += response.overallRating;
                }
            }
        });

        const sortedDates = Object.keys(dailyData).sort();
        const responseCounts = sortedDates.map(date => dailyData[date].count);
        const avgRatings = sortedDates.map(date => 
            dailyData[date].totalRating / dailyData[date].count || 0
        );

        const chartId = `chart_${canvasId}`;
        if (window.chartInstances && window.chartInstances[chartId]) {
            window.chartInstances[chartId].destroy();
        }

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedDates.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [
                    {
                        label: 'Responses',
                        data: responseCounts,
                        borderColor: CHART_COLORS.primary,
                        backgroundColor: CHART_COLORS.primary.replace('0.8', '0.1'),
                        yAxisID: 'y-responses',
                        tension: 0.3
                    },
                    {
                        label: 'Average Rating',
                        data: avgRatings,
                        borderColor: CHART_COLORS.success,
                        backgroundColor: CHART_COLORS.success.replace('0.8', '0.1'),
                        yAxisID: 'y-rating',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Response Timeline - ${batchName}`,
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 11 } }
                    }
                },
                scales: {
                    'y-responses': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        ticks: { 
                            stepSize: 1,
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: 'Number of Responses'
                        }
                    },
                    'y-rating': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 5,
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: 'Average Rating'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });

        if (window.chartInstances) {
            window.chartInstances[chartId] = chart;
        }
        return chart;
    }

    /**
     * Create hourly distribution chart
     */
    function createHourlyDistributionChart(canvasId, responses, batchName) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        // Count responses by hour
        const hourCounts = new Array(24).fill(0);
        responses.forEach(response => {
            const date = response.respondedAt?.toDate ? response.respondedAt.toDate() : 
                        (response.timestamp?.toDate ? response.timestamp.toDate() : null);
            if (date) {
                const hour = date.getHours();
                hourCounts[hour]++;
            }
        });

        const chartId = `chart_${canvasId}`;
        if (window.chartInstances && window.chartInstances[chartId]) {
            window.chartInstances[chartId].destroy();
        }

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 24}, (_, i) => {
                    const hour = i === 0 ? 12 : (i > 12 ? i - 12 : i);
                    const ampm = i < 12 ? 'AM' : 'PM';
                    return `${hour}${ampm}`;
                }),
                datasets: [{
                    label: 'Responses',
                    data: hourCounts,
                    backgroundColor: CHART_COLORS.info,
                    borderColor: CHART_COLORS.info.replace('0.8', '1'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Response Time Distribution - ${batchName}`,
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            stepSize: 1,
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: 'Number of Responses'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Hour of Day'
                        }
                    }
                }
            }
        });

        if (window.chartInstances) {
            window.chartInstances[chartId] = chart;
        }
        return chart;
    }

    /**
     * Generate insights based on analytics
     */
    function generateInsights(batchId, responses) {
        const insightsContainer = document.getElementById(`insights-${batchId}`);
        if (!insightsContainer) return;

        const stats = calculateBatchStatistics(responses);
        const insights = [];

        // Overall rating insights
        if (stats.overallRating.mean >= 4.5) {
            insights.push({
                type: 'positive',
                icon: 'fa-star',
                text: `Exceptional performance! Average rating of ${stats.overallRating.mean.toFixed(2)}/5`
            });
        } else if (stats.overallRating.mean < 3) {
            insights.push({
                type: 'warning',
                icon: 'fa-exclamation-triangle',
                text: `Below average rating (${stats.overallRating.mean.toFixed(2)}/5). Consider recipe adjustments.`
            });
        }

        // Find best and worst attributes
        const attributeRatings = Object.entries(stats.attributes)
            .map(([name, data]) => ({ name, mean: data.mean }))
            .sort((a, b) => b.mean - a.mean);

        if (attributeRatings.length > 0) {
            const best = attributeRatings[0];
            const worst = attributeRatings[attributeRatings.length - 1];
            
            insights.push({
                type: 'info',
                icon: 'fa-thumbs-up',
                text: `Strongest attribute: ${best.name} (${best.mean.toFixed(2)}/5)`
            });

            if (worst.mean < 3) {
                insights.push({
                    type: 'warning',
                    icon: 'fa-thumbs-down',
                    text: `Needs improvement: ${worst.name} (${worst.mean.toFixed(2)}/5)`
                });
            }
        }

        // Response rate insights
        const peakHour = Object.entries(stats.responseRate.hourly)
            .sort(([,a], [,b]) => b - a)[0];
        if (peakHour) {
            const hour = parseInt(peakHour[0]);
            const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            const ampm = hour < 12 ? 'AM' : 'PM';
            insights.push({
                type: 'info',
                icon: 'fa-clock',
                text: `Peak response time: ${displayHour}${ampm} (${peakHour[1]} responses)`
            });
        }

        // Render insights
        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <i class="fas ${insight.icon}"></i>
                <span>${insight.text}</span>
            </div>
        `).join('');
    }

    // =========================================================================
    // SECTION 4: Export Functions
    // =========================================================================

    /**
     * Clean up analytics charts for a specific container
     */
    function destroyAnalyticsCharts(batchId) {
        const chartIds = [
            `chart_rating-dist-overall-${batchId}`,
            `chart_rating-dist-detailed-${batchId}`,
            `chart_response-timeline-${batchId}`,
            `chart_hour-distribution-${batchId}`
        ];

        chartIds.forEach(chartId => {
            if (window.chartInstances && window.chartInstances[chartId]) {
                window.chartInstances[chartId].destroy();
                delete window.chartInstances[chartId];
            }
        });
    }

    // Public API
    return {
        generateBatchAnalytics,
        createRatingDistributionChart,
        calculateBatchStatistics,
        destroyAnalyticsCharts,
        CHART_COLORS
    };

})();

// Make it available globally
window.BrewMetricsAnalytics = BrewMetricsAnalytics;

// --- END analytics.js ---