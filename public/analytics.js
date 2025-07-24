// BrewMetrics Analytics Dashboard
// Advanced analytics functionality for brewery data insights

class BrewMetricsAnalytics {
  constructor() {
    this.analyticsEndpoint = null; // Will be set when analytics service is deployed
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    this.init();
  }

  async init() {
    // Initialize utilities
    this.utils = window.BrewMetricsUtils;
    if (!this.utils) {
      console.error('BrewMetricsUtils not available. Analytics functionality limited.');
      return;
    }

    this.logger = this.utils.logger;
    this.errorHandler = this.utils.errorHandler;
    
    this.logger.info('Analytics module initialized');
  }

  /**
   * Set the analytics service endpoint URL
   */
  setEndpoint(url) {
    this.analyticsEndpoint = url;
    this.logger.info('Analytics endpoint set', { url });
  }

  /**
   * Get cached data or fetch fresh data
   */
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      this.logger.debug('Using cached data', { key });
      return cached.data;
    }

    try {
      const data = await fetchFunction();
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch data', { key, error });
      throw error;
    }
  }

  /**
   * Get analytics for a specific recipe
   */
  async getRecipeAnalytics(recipeName, breweryId = null) {
    if (!this.analyticsEndpoint) {
      throw new Error('Analytics service endpoint not configured');
    }

    const cacheKey = `recipe-${recipeName}-${breweryId || 'all'}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(`${this.analyticsEndpoint}/recipe-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          recipe_name: recipeName,
          ...(breweryId && { brewery_id: breweryId })
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Recipe "${recipeName}" not found`);
        }
        throw new Error(`Analytics request failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info('Recipe analytics retrieved', { recipeName, breweryId });
      return data.recipe;
    });
  }

  /**
   * Get brewery summary statistics
   */
  async getBrewerySummary(breweryId) {
    if (!this.analyticsEndpoint) {
      throw new Error('Analytics service endpoint not configured');
    }

    const cacheKey = `brewery-summary-${breweryId}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(`${this.analyticsEndpoint}/brewery-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ brewery_id: breweryId })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Brewery "${breweryId}" not found`);
        }
        throw new Error(`Brewery summary request failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info('Brewery summary retrieved', { breweryId });
      return data.brewery_summary;
    });
  }

  /**
   * Get top performing recipes
   */
  async getTopRecipes(filters = {}) {
    if (!this.analyticsEndpoint) {
      throw new Error('Analytics service endpoint not configured');
    }

    const cacheKey = `top-recipes-${JSON.stringify(filters)}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(`${this.analyticsEndpoint}/top-recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(filters)
      });

      if (!response.ok) {
        throw new Error(`Top recipes request failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info('Top recipes retrieved', { filters, count: data.total_count });
      return data.top_recipes;
    });
  }

  /**
   * Get taste profile analysis
   */
  async getTasteProfileAnalysis(recipeName = null, breweryId = null) {
    if (!this.analyticsEndpoint) {
      throw new Error('Analytics service endpoint not configured');
    }

    if (!recipeName && !breweryId) {
      throw new Error('Either recipe name or brewery ID is required');
    }

    const cacheKey = `taste-profile-${recipeName || 'all'}-${breweryId || 'all'}`;
    
    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(`${this.analyticsEndpoint}/taste-profile-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...(recipeName && { recipe_name: recipeName }),
          ...(breweryId && { brewery_id: breweryId })
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No taste profile data found');
        }
        throw new Error(`Taste profile request failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info('Taste profile analysis retrieved', { recipeName, breweryId });
      return data.taste_profiles;
    });
  }

  /**
   * Clear analytics cache
   */
  clearCache() {
    this.cache.clear();
    this.logger.info('Analytics cache cleared');
  }

  /**
   * Get Firebase auth token for API requests
   */
  async getAuthToken() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
      throw new Error('Firebase auth not available');
    }

    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return await user.getIdToken();
  }

  /**
   * Create advanced analytics charts
   */
  async createTasteProfileChart(containerId, recipeName, breweryId = null) {
    try {
      const profiles = await this.getTasteProfileAnalysis(recipeName, breweryId);
      
      if (!profiles || profiles.length === 0) {
        throw new Error('No taste profile data available');
      }

      const profile = profiles[0]; // Use first profile
      
      // Check if Chart.js is available
      if (typeof Chart === 'undefined') {
        throw new Error('Chart.js library not loaded');
      }

      const ctx = document.getElementById(containerId);
      if (!ctx) {
        throw new Error(`Chart container "${containerId}" not found`);
      }

      // Create radar chart for taste profile
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            'Sweetness', 'Acidity', 'Bitterness', 'Body',
            'Carbonation', 'Malt Flavors', 'Hop Flavors', 'Finish'
          ],
          datasets: [{
            label: `${profile.recipe_name} Taste Profile`,
            data: [
              profile.avg_sweetness || 0,
              profile.avg_acidity || 0,
              profile.avg_bitterness || 0,
              profile.avg_body || 0,
              profile.avg_carbonation || 0,
              profile.avg_malt_flavors || 0,
              profile.avg_hop_flavors || 0,
              profile.avg_finish || 0
            ],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `${profile.recipe_name} - Taste Profile Analysis`,
              font: {
                size: 16
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 5,
              min: 0,
              ticks: {
                stepSize: 1
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              angleLines: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        }
      });

      this.logger.info('Taste profile chart created', { recipeName, containerId });

    } catch (error) {
      this.logger.error('Failed to create taste profile chart', { error, recipeName, containerId });
      if (this.errorHandler) {
        this.errorHandler.displayError(`Failed to load taste profile chart: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create performance comparison chart
   */
  async createPerformanceChart(containerId, breweryId, limit = 10) {
    try {
      const topRecipes = await this.getTopRecipes({ brewery_id: breweryId, limit });
      
      if (!topRecipes || topRecipes.length === 0) {
        throw new Error('No recipe performance data available');
      }

      if (typeof Chart === 'undefined') {
        throw new Error('Chart.js library not loaded');
      }

      const ctx = document.getElementById(containerId);
      if (!ctx) {
        throw new Error(`Chart container "${containerId}" not found`);
      }

      // Create horizontal bar chart for recipe performance
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topRecipes.map(recipe => recipe.recipe_name),
          datasets: [{
            label: 'Average Rating',
            data: topRecipes.map(recipe => recipe.average_rating),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }, {
            label: 'Rating Count',
            data: topRecipes.map(recipe => recipe.rating_count),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Recipe Performance Comparison',
              font: {
                size: 16
              }
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              position: 'left',
              title: {
                display: true,
                text: 'Average Rating'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Number of Ratings'
              },
              grid: {
                drawOnChartArea: false,
              },
            }
          }
        }
      });

      this.logger.info('Performance chart created', { breweryId, containerId, recipeCount: topRecipes.length });

    } catch (error) {
      this.logger.error('Failed to create performance chart', { error, breweryId, containerId });
      if (this.errorHandler) {
        this.errorHandler.displayError(`Failed to load performance chart: ${error.message}`);
      }
      throw error;
    }
  }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.BrewMetricsAnalytics = new BrewMetricsAnalytics();
});

// Export for use in other scripts
window.BrewMetricsAnalytics = BrewMetricsAnalytics;
