// Enhanced Survey Data Capture for Advanced Analytics

class EnhancedSurveyCapture {
    constructor() {
        this.sessionStartTime = Date.now();
        this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.pageViews = [];
        this.interactions = [];
        this.deviceInfo = this.collectDeviceInfo();
        this.locationData = null;
        
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupInteractionTracking();
        this.collectLocationData();
    }

    // Collect device and browser information
    collectDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            deviceType: this.getDeviceType(),
            browser: this.getBrowser(),
            os: this.getOS(),
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };
    }

    getDeviceType() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
        return 'desktop';
    }

    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    getOS() {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    // Track page views and navigation
    trackPageView() {
        const pageView = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            referrer: document.referrer
        };
        
        this.pageViews.push(pageView);
        this.sendAnalyticsEvent('page_view', pageView);
    }

    // Setup interaction tracking
    setupInteractionTracking() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', {
                element: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                text: e.target.textContent?.substring(0, 100)
            });
        });

        // Track form interactions
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' || e.target.type === 'checkbox') {
                this.trackInteraction('form_interaction', {
                    type: e.target.type,
                    name: e.target.name,
                    value: e.target.value
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackInteraction('scroll', { depth: maxScroll });
                }
            }
        });
    }

    // Track individual interactions
    trackInteraction(type, data) {
        const interaction = {
            type,
            data,
            timestamp: Date.now(),
            sessionTime: Date.now() - this.sessionStartTime
        };
        
        this.interactions.push(interaction);
    }

    // Collect location data (if available)
    async collectLocationData() {
        try {
            // Try to get location from IP (using a free service)
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                this.locationData = await response.json();
            }
        } catch (error) {
            console.log('Location data not available:', error);
        }
    }

    // Enhanced survey submission with analytics
    async submitEnhancedSurvey(surveyData) {
        const enhancedData = {
            ...surveyData,
            sessionData: {
                sessionId: this.sessionId,
                startTime: this.sessionStartTime,
                endTime: Date.now(),
                timeSpent: Date.now() - this.sessionStartTime,
                pageViews: this.pageViews,
                interactions: this.interactions,
                questionsSkipped: this.calculateSkippedQuestions(surveyData),
                questionsRevisited: this.calculateRevisitedQuestions()
            },
            deviceInfo: this.deviceInfo,
            locationData: this.locationData,
            analytics: this.calculateAnalytics(surveyData)
        };

        // Send to enhanced analytics function
        try {
            if (typeof functions !== 'undefined') {
                const submitEnhanced = functions.httpsCallable('submitEnhancedSurveyResponse');
                await submitEnhanced(enhancedData);
            }
        } catch (error) {
            console.error('Enhanced analytics submission failed:', error);
            // Fallback to regular submission
        }

        return enhancedData;
    }

    // Calculate analytics metrics
    calculateAnalytics(surveyData) {
        return {
            tasteProfileScore: this.calculateTasteProfileScore(surveyData.surveyAnswers),
            satisfactionIndex: this.calculateSatisfactionIndex(surveyData.overallRating, surveyData.surveyAnswers),
            recommendationLikelihood: this.calculateRecommendationLikelihood(surveyData.overallRating),
            qualityMetrics: this.calculateQualityMetrics(surveyData.surveyAnswers),
            flavorBalance: this.calculateFlavorBalance(surveyData.surveyAnswers),
            engagementScore: this.calculateEngagementScore()
        };
    }

    calculateTasteProfileScore(surveyAnswers) {
        if (!surveyAnswers || surveyAnswers.length === 0) return 0;
        const scores = surveyAnswers.map(answer => answer.answer || 0);
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return Math.round(average * 20); // Convert to 0-100 scale
    }

    calculateSatisfactionIndex(overallRating, surveyAnswers) {
        const baseScore = (overallRating || 0) * 20;
        const tasteScore = this.calculateTasteProfileScore(surveyAnswers);
        return Math.round((baseScore + tasteScore) / 2);
    }

    calculateRecommendationLikelihood(overallRating) {
        if (overallRating >= 4) return 'High';
        if (overallRating >= 3) return 'Medium';
        return 'Low';
    }

    calculateQualityMetrics(surveyAnswers) {
        const metrics = {};
        surveyAnswers.forEach(answer => {
            const questionText = answer.questionText || '';
            if (questionText.includes('Bitterness')) metrics.bitterness = answer.answer;
            if (questionText.includes('Sweetness')) metrics.sweetness = answer.answer;
            if (questionText.includes('Body')) metrics.body = answer.answer;
            if (questionText.includes('Carbonation')) metrics.carbonation = answer.answer;
            if (questionText.includes('Malt')) metrics.maltFlavors = answer.answer;
            if (questionText.includes('Hop')) metrics.hopFlavors = answer.answer;
            if (questionText.includes('Finish')) metrics.finish = answer.answer;
            if (questionText.includes('Acidity')) metrics.acidity = answer.answer;
        });
        return metrics;
    }

    calculateFlavorBalance(surveyAnswers) {
        const flavors = this.calculateQualityMetrics(surveyAnswers);
        const values = Object.values(flavors);
        if (values.length === 0) return 0;
        
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
        
        return Math.max(0, 100 - (variance * 20));
    }

    calculateEngagementScore() {
        const timeSpent = Date.now() - this.sessionStartTime;
        const interactionCount = this.interactions.length;
        const pageViewCount = this.pageViews.length;
        
        // Simple engagement scoring
        let score = 0;
        score += Math.min(timeSpent / 1000 / 60, 10) * 10; // Time spent (max 10 points)
        score += Math.min(interactionCount, 20) * 2; // Interactions (max 40 points)
        score += pageViewCount * 10; // Page views (10 points each)
        
        return Math.min(Math.round(score), 100);
    }

    calculateSkippedQuestions(surveyData) {
        // Logic to determine skipped questions
        return 0; // Placeholder
    }

    calculateRevisitedQuestions() {
        // Logic to determine revisited questions
        return 0; // Placeholder
    }

    // Send analytics events
    async sendAnalyticsEvent(eventType, eventData) {
        try {
            if (typeof functions !== 'undefined') {
                const trackJourney = functions.httpsCallable('trackCustomerJourney');
                await trackJourney({
                    sessionId: this.sessionId,
                    eventType,
                    eventData,
                    timestamp: Date.now(),
                    userAgent: this.deviceInfo.userAgent,
                    referrer: document.referrer
                });
            }
        } catch (error) {
            console.log('Analytics event tracking failed:', error);
        }
    }
}

// Initialize enhanced survey capture
window.enhancedSurveyCapture = new EnhancedSurveyCapture();