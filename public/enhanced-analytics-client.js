// Enhanced Analytics Client - Captures comprehensive data for advanced analytics

class BrewMetricsAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.sessionStartTime = Date.now();
        this.events = [];
        this.deviceInfo = this.collectDeviceInfo();
        this.locationData = null;
        this.init();
    }

    init() {
        this.setupEventTracking();
        this.collectLocationData();
        this.trackPageView();
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    collectDeviceInfo() {
        const ua = navigator.userAgent;
        return {
            userAgent: ua,
            screenResolution: `${screen.width}x${screen.height}`,
            deviceType: this.getDeviceType(),
            browser: this.getBrowser(ua),
            os: this.getOS(ua),
            isMobile: /Mobile|Android|iPhone|iPad/.test(ua),
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

    getBrowser(ua) {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    getOS(ua) {
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    async collectLocationData() {
        try {
            // Use IP-based geolocation (more privacy-friendly than GPS)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            this.locationData = {
                city: data.city || '',
                state: data.region || '',
                country: data.country_name || 'US',
                timezone: data.timezone || '',
                coordinates: data.latitude && data.longitude ? {
                    lat: data.latitude,
                    lng: data.longitude
                } : null
            };
        } catch (error) {
            console.warn('Could not collect location data:', error);
            this.locationData = {
                city: '',
                state: '',
                country: 'US',
                timezone: this.deviceInfo.timezone,
                coordinates: null
            };
        }
    }

    setupEventTracking() {
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('page_visibility_change', {
                hidden: document.hidden,
                timestamp: Date.now()
            });
        });

        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .rating-button, .nav-link, a[href]')) {
                this.trackEvent('element_click', {
                    element: e.target.tagName,
                    className: e.target.className,
                    text: e.target.textContent?.substring(0, 50),
                    href: e.target.href || null
                });
            }
        });

        // Track form interactions
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.trackEvent('form_interaction', {
                    inputType: e.target.type,
                    inputName: e.target.name,
                    formId: e.target.form?.id
                });
            }
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', { depth: scrollDepth });
                }
            }
        });

        // Track time on page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.sessionStartTime;
            this.trackEvent('page_unload', { timeOnPage });
        });
    }

    trackPageView() {
        this.trackEvent('page_view', {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: Date.now()
        });
    }

    trackEvent(eventType, eventData = {}) {
        const event = {
            eventType,
            eventData,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            url: window.location.href
        };

        this.events.push(event);

        // Send to Firebase if available
        if (typeof functions !== 'undefined' && functions) {
            const trackCustomerJourney = functions.httpsCallable('trackCustomerJourney');
            trackCustomerJourney({
                sessionId: this.sessionId,
                eventType,
                eventData,
                timestamp: event.timestamp,
                userAgent: this.deviceInfo.userAgent,
                referrer: document.referrer
            }).catch(error => {
                console.warn('Failed to track customer journey:', error);
            });
        }
    }

    // Enhanced survey submission with comprehensive analytics
    async submitSurveyFeedback(surveyData) {
        try {
            const enhancedData = {
                ...surveyData,
                sessionData: {
                    sessionId: this.sessionId,
                    startTime: this.sessionStartTime,
                    timeSpent: Date.now() - this.sessionStartTime,
                    questionsSkipped: 0, // Could be calculated from survey flow
                    questionsRevisited: 0, // Could be tracked during survey
                    surveyVersion: '2.0'
                },
                deviceInfo: this.deviceInfo,
                locationData: this.locationData,
                events: this.events.filter(e => e.eventType.includes('survey') || e.eventType.includes('rating'))
            };

            if (typeof functions !== 'undefined' && functions) {
                const submitEnhancedSurveyResponse = functions.httpsCallable('submitEnhancedSurveyResponse');
                const result = await submitEnhancedSurveyResponse(enhancedData);
                
                this.trackEvent('survey_submitted', {
                    responseId: result.data.responseId,
                    overallRating: surveyData.overall_rating
                });

                return result;
            }
        } catch (error) {
            console.error('Failed to submit enhanced survey feedback:', error);
            throw error;
        }
    }

    // Track revenue impact (for brewery owners)
    async captureRevenueImpact(revenueData) {
        try {
            if (typeof functions !== 'undefined' && functions) {
                const captureRevenueImpact = functions.httpsCallable('captureRevenueImpact');
                return await captureRevenueImpact(revenueData);
            }
        } catch (error) {
            console.error('Failed to capture revenue impact:', error);
            throw error;
        }
    }

    // Track competitive data (for brewery owners)
    async captureCompetitiveData(competitiveData) {
        try {
            if (typeof functions !== 'undefined' && functions) {
                const captureCompetitiveData = functions.httpsCallable('captureCompetitiveData');
                return await captureCompetitiveData(competitiveData);
            }
        } catch (error) {
            console.error('Failed to capture competitive data:', error);
            throw error;
        }
    }

    // Generate predictive analytics
    async generatePredictiveAnalytics(breweryId, timeframe = '12months') {
        try {
            if (typeof functions !== 'undefined' && functions) {
                const generatePredictiveAnalytics = functions.httpsCallable('generatePredictiveAnalytics');
                return await generatePredictiveAnalytics({ breweryId, timeframe });
            }
        } catch (error) {
            console.error('Failed to generate predictive analytics:', error);
            throw error;
        }
    }

    // Track specific brewery events
    trackBreweryEvent(eventType, data = {}) {
        this.trackEvent(`brewery_${eventType}`, {
            ...data,
            breweryContext: true
        });
    }

    // Track survey-specific events
    trackSurveyEvent(eventType, data = {}) {
        this.trackEvent(`survey_${eventType}`, {
            ...data,
            surveyContext: true
        });
    }

    // Track dashboard interactions
    trackDashboardEvent(eventType, data = {}) {
        this.trackEvent(`dashboard_${eventType}`, {
            ...data,
            dashboardContext: true
        });
    }

    // Get session analytics summary
    getSessionSummary() {
        return {
            sessionId: this.sessionId,
            duration: Date.now() - this.sessionStartTime,
            eventCount: this.events.length,
            deviceInfo: this.deviceInfo,
            locationData: this.locationData,
            events: this.events
        };
    }

    // Privacy-compliant data collection
    setPrivacyPreferences(preferences) {
        this.privacyPreferences = {
            analytics: preferences.analytics !== false,
            location: preferences.location !== false,
            marketing: preferences.marketing !== false,
            ...preferences
        };

        // Adjust data collection based on preferences
        if (!this.privacyPreferences.location) {
            this.locationData = null;
        }
    }

    // GDPR compliance - export user data
    exportUserData() {
        return {
            sessionId: this.sessionId,
            events: this.events,
            deviceInfo: this.privacyPreferences?.analytics ? this.deviceInfo : null,
            locationData: this.privacyPreferences?.location ? this.locationData : null,
            privacyPreferences: this.privacyPreferences
        };
    }

    // GDPR compliance - delete user data
    deleteUserData() {
        this.events = [];
        this.deviceInfo = {};
        this.locationData = null;
        this.sessionId = this.generateSessionId();
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not already initialized
    if (!window.BrewMetricsAnalytics) {
        window.BrewMetricsAnalytics = new BrewMetricsAnalytics();
        console.log('BrewMetrics Enhanced Analytics initialized');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrewMetricsAnalytics;
}