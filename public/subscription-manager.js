// Subscription Management for BrewMetrics Premium Features

class SubscriptionManager {
  constructor() {
    this.db = firebase.firestore();
    this.auth = firebase.auth();
    this.currentUser = null;
    this.subscriptionStatus = null;
    this.features = {
      free: ['basic-analytics', 'survey-collection', 'qr-codes'],
      premium: ['advanced-analytics', 'ai-insights', 'revenue-tracking', 'competitive-analysis', 'predictive-analytics', 'custom-reports']
    };
    this.init();
  }

  init() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.checkSubscriptionStatus();
      }
    });
  }

  async checkSubscriptionStatus() {
    if (!this.currentUser) return;

    try {
      const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
      const userData = userDoc.data();
      
      this.subscriptionStatus = {
        tier: userData?.subscription?.tier || 'free',
        status: userData?.subscription?.status || 'inactive',
        expiresAt: userData?.subscription?.expiresAt,
        features: userData?.subscription?.features || this.features.free
      };

      this.updateUIBasedOnSubscription();
      this.enforceFeatureAccess();
    } catch (error) {
      console.error('Error checking subscription:', error);
      this.subscriptionStatus = { tier: 'free', status: 'inactive', features: this.features.free };
    }
  }

  updateUIBasedOnSubscription() {
    const isPremium = this.subscriptionStatus.tier === 'premium' && this.subscriptionStatus.status === 'active';
    
    // Update navigation
    this.updateNavigation(isPremium);
    
    // Update feature availability
    this.updateFeatureAvailability(isPremium);
    
    // Show/hide premium content
    this.togglePremiumContent(isPremium);
  }

  updateNavigation(isPremium) {
    const premiumNavItems = document.querySelectorAll('.premium-nav-item');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    
    premiumNavItems.forEach(item => {
      if (isPremium) {
        item.style.display = 'block';
        item.classList.remove('locked');
      } else {
        item.style.display = 'block';
        item.classList.add('locked');
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.showUpgradeModal();
        });
      }
    });

    upgradeButtons.forEach(button => {
      button.style.display = isPremium ? 'none' : 'inline-block';
    });
  }

  updateFeatureAvailability(isPremium) {
    const premiumFeatures = document.querySelectorAll('.premium-feature');
    
    premiumFeatures.forEach(feature => {
      if (isPremium) {
        feature.classList.remove('locked');
        feature.style.opacity = '1';
        feature.style.pointerEvents = 'auto';
      } else {
        feature.classList.add('locked');
        feature.style.opacity = '0.5';
        feature.style.pointerEvents = 'none';
        
        // Add upgrade overlay
        if (!feature.querySelector('.upgrade-overlay')) {
          const overlay = document.createElement('div');
          overlay.className = 'upgrade-overlay';
          overlay.innerHTML = `
            <div class="upgrade-message">
              <i class="fas fa-lock"></i>
              <p>Premium Feature</p>
              <button class="btn btn-primary" onclick="window.subscriptionManager.showUpgradeModal()">
                Upgrade Now
              </button>
            </div>
          `;
          feature.appendChild(overlay);
        }
      }
    });
  }

  togglePremiumContent(isPremium) {
    const premiumSections = document.querySelectorAll('.premium-section');
    
    premiumSections.forEach(section => {
      section.style.display = isPremium ? 'block' : 'none';
    });

    // Show free tier limitations
    const freeTierMessages = document.querySelectorAll('.free-tier-message');
    freeTierMessages.forEach(message => {
      message.style.display = isPremium ? 'none' : 'block';
    });
  }

  enforceFeatureAccess() {
    const isPremium = this.subscriptionStatus.tier === 'premium' && this.subscriptionStatus.status === 'active';
    
    // Disable premium analytics if not subscribed
    if (!isPremium) {
      this.disablePremiumAnalytics();
    }
    
    // Limit data export for free users
    this.enforceExportLimits(isPremium);
    
    // Limit AI features
    this.enforceAILimits(isPremium);
  }

  disablePremiumAnalytics() {
    const premiumCharts = ['revenue-analytics', 'competitive-analysis', 'predictive-analytics'];
    
    premiumCharts.forEach(chartId => {
      const container = document.getElementById(chartId);
      if (container) {
        container.innerHTML = `
          <div class="premium-placeholder">
            <i class="fas fa-chart-line"></i>
            <h3>Premium Analytics</h3>
            <p>Unlock advanced analytics, revenue tracking, and AI insights</p>
            <button class="btn btn-primary" onclick="window.subscriptionManager.showUpgradeModal()">
              Upgrade to Premium
            </button>
          </div>
        `;
      }
    });
  }

  enforceExportLimits(isPremium) {
    const exportButtons = document.querySelectorAll('.export-button');
    
    exportButtons.forEach(button => {
      if (!isPremium) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.showExportLimitModal();
        });
      }
    });
  }

  enforceAILimits(isPremium) {
    if (!isPremium) {
      // Limit AI queries per day
      this.checkAIUsageLimit();
    }
  }

  async checkAIUsageLimit() {
    const today = new Date().toDateString();
    const usageDoc = await this.db.collection('users').doc(this.currentUser.uid)
      .collection('usage').doc(today).get();
    
    const usage = usageDoc.data();
    const aiQueries = usage?.aiQueries || 0;
    const freeLimit = 10; // 10 AI queries per day for free users
    
    if (aiQueries >= freeLimit) {
      this.disableAIFeatures();
    }
  }

  disableAIFeatures() {
    const aiButtons = document.querySelectorAll('.ai-feature-button');
    
    aiButtons.forEach(button => {
      button.disabled = true;
      button.textContent = 'Daily Limit Reached';
      button.onclick = () => this.showUpgradeModal();
    });
  }

  showUpgradeModal() {
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="close-modal">&times;</button>
          <div class="upgrade-content">
            <h2>🚀 Upgrade to BrewMetrics Premium</h2>
            <p class="subtitle">Unlock powerful analytics and AI insights for your brewery</p>
            
            <div class="pricing-cards">
              <div class="pricing-card free">
                <h3>Free</h3>
                <div class="price">$0<span>/month</span></div>
                <ul class="features">
                  <li>✓ Basic customer surveys</li>
                  <li>✓ QR code generation</li>
                  <li>✓ Simple analytics</li>
                  <li>✗ Advanced analytics</li>
                  <li>✗ AI insights</li>
                  <li>✗ Revenue tracking</li>
                </ul>
              </div>
              
              <div class="pricing-card premium featured">
                <div class="popular-badge">Most Popular</div>
                <h3>Premium</h3>
                <div class="price">$29<span>/month</span></div>
                <ul class="features">
                  <li>✓ Everything in Free</li>
                  <li>✓ Advanced analytics dashboard</li>
                  <li>✓ AI-powered insights</li>
                  <li>✓ Revenue impact analysis</li>
                  <li>✓ Competitive benchmarking</li>
                  <li>✓ Predictive analytics</li>
                  <li>✓ Custom reports</li>
                  <li>✓ Unlimited AI queries</li>
                  <li>✓ Priority support</li>
                </ul>
                <button class="btn btn-primary upgrade-btn" onclick="window.subscriptionManager.initiatePremiumUpgrade()">
                  Start Free Trial
                </button>
                <p class="trial-info">14-day free trial, cancel anytime</p>
              </div>
            </div>
            
            <div class="premium-features-showcase">
              <h3>What you'll get with Premium:</h3>
              <div class="feature-grid">
                <div class="feature-item">
                  <i class="fas fa-chart-line"></i>
                  <h4>Revenue Analytics</h4>
                  <p>Track how customer feedback impacts your bottom line</p>
                </div>
                <div class="feature-item">
                  <i class="fas fa-brain"></i>
                  <h4>AI Insights</h4>
                  <p>Get personalized recommendations to improve your beers</p>
                </div>
                <div class="feature-item">
                  <i class="fas fa-trophy"></i>
                  <h4>Competitive Analysis</h4>
                  <p>See how you stack up against industry benchmarks</p>
                </div>
                <div class="feature-item">
                  <i class="fas fa-crystal-ball"></i>
                  <h4>Predictive Analytics</h4>
                  <p>Forecast trends and optimize your brewing strategy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.querySelector('.modal-overlay').onclick = (e) => {
      if (e.target === modal.querySelector('.modal-overlay')) modal.remove();
    };
  }

  showExportLimitModal() {
    const modal = document.createElement('div');
    modal.className = 'limit-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <h3>Export Limit Reached</h3>
          <p>Free users can export up to 3 reports per month. Upgrade to Premium for unlimited exports.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" onclick="this.closest('.limit-modal').remove()">
              Maybe Later
            </button>
            <button class="btn btn-primary" onclick="window.subscriptionManager.showUpgradeModal(); this.closest('.limit-modal').remove()">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  async initiatePremiumUpgrade() {
    try {
      // In a real implementation, this would integrate with Stripe or similar
      const checkoutData = {
        userId: this.currentUser.uid,
        plan: 'premium',
        priceId: 'price_premium_monthly',
        trialDays: 14
      };
      
      // Call Firebase function to create checkout session
      const createCheckout = firebase.functions().httpsCallable('createCheckoutSession');
      const result = await createCheckout(checkoutData);
      
      if (result.data.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      console.error('Error initiating upgrade:', error);
      alert('Error starting upgrade process. Please try again.');
    }
  }

  async cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You\'ll lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    try {
      const cancelSubscription = firebase.functions().httpsCallable('cancelSubscription');
      await cancelSubscription({ userId: this.currentUser.uid });
      
      alert('Subscription cancelled successfully. You\'ll retain access until the end of your billing period.');
      this.checkSubscriptionStatus();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error cancelling subscription. Please contact support.');
    }
  }

  async updatePaymentMethod() {
    try {
      const updatePayment = firebase.functions().httpsCallable('updatePaymentMethod');
      const result = await updatePayment({ userId: this.currentUser.uid });
      
      if (result.data.url) {
        window.open(result.data.url, '_blank');
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
      alert('Error updating payment method. Please try again.');
    }
  }

  getSubscriptionStatus() {
    return this.subscriptionStatus;
  }

  hasFeature(featureName) {
    return this.subscriptionStatus?.features?.includes(featureName) || false;
  }

  isPremium() {
    return this.subscriptionStatus?.tier === 'premium' && this.subscriptionStatus?.status === 'active';
  }
}

// Initialize subscription manager
document.addEventListener('DOMContentLoaded', () => {
  window.subscriptionManager = new SubscriptionManager();
});