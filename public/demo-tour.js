// BrewMetrics Demo Tour System
// Interactive guided tour for showcasing premium features to potential customers

class BrewMetricsDemoTour {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.tourSteps = [
            {
                title: "Welcome to BrewMetrics",
                content: "The complete brewery management platform that transforms customer feedback into actionable insights and increased revenue.",
                target: ".main-dashboard-title-bar h2",
                position: "bottom",
                highlight: ".summary-cards-container",
                action: () => this.showDashboardOverview()
            },
            {
                title: "Real-Time Analytics Dashboard",
                content: "Track your brewery's performance with live metrics: active batches, customer feedback, Google reviews, and revenue impact.",
                target: ".summary-cards-container",
                position: "bottom",
                highlight: ".summary-cards-container",
                action: () => this.highlightMetrics()
            },
            {
                title: "Customer Survey System",
                content: "Generate QR codes for each beer batch. Customers scan and provide detailed feedback on taste, aroma, and overall experience.",
                target: "#qr-code-section",
                position: "top",
                highlight: "#qr-code-display",
                action: () => this.navigateToSection('qr-code-section')
            },
            {
                title: "Batch Management & Analytics",
                content: "Monitor each beer's performance with detailed analytics, customer ratings, and taste profile breakdowns.",
                target: "#batch-management-section",
                position: "top",
                highlight: ".feedback-summary-container",
                action: () => this.navigateToSection('batch-management-section')
            },
            {
                title: "Google Reviews Integration",
                content: "Manage Google My Business reviews directly from your dashboard. Respond to customers and track your online reputation.",
                target: "#google-reviews-section",
                position: "top",
                highlight: ".reviews-dashboard",
                action: () => this.navigateToSection('google-reviews-section')
            },
            {
                title: "AI-Powered Recipe Designer",
                content: "Create professional brewing recipes with our AI Brewmaster. Generate complete recipes with ingredients, calculations, and brewing instructions.",
                target: ".recipe-designer",
                position: "bottom",
                highlight: ".ai-recipe-generator-container",
                action: () => this.showRecipeDesigner()
            },
            {
                title: "Premium Analytics Suite",
                content: "Unlock advanced insights: revenue impact analysis, customer intelligence, predictive analytics, and competitive benchmarking.",
                target: "#analytics-section",
                position: "top",
                highlight: ".premium-feature",
                action: () => this.showPremiumFeatures()
            },
            {
                title: "ROI & Revenue Impact",
                content: "See exactly how customer feedback translates to increased sales, customer retention, and brewery growth.",
                target: ".revenue-analytics",
                position: "bottom",
                highlight: ".roi-metrics",
                action: () => this.showROIMetrics()
            }
        ];
        this.init();
    }

    init() {
        this.createTourInterface();
        this.setupEventListeners();
    }

    createTourInterface() {
        // Create tour overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'demo-tour-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: none;
        `;

        // Create tour tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'demo-tour-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: white;
            border-radius: 12px;
            padding: 25px;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            transform: translate(-50%, -50%);
        `;

        tooltip.innerHTML = `
            <div class="tour-header">
                <h3 id="tour-title" style="margin: 0 0 15px 0; color: #2c3e50; font-size: 1.3em;"></h3>
                <div class="tour-progress">
                    <div class="progress-bar" style="width: 100%; height: 4px; background: #e9ecef; border-radius: 2px; margin-bottom: 15px;">
                        <div id="tour-progress-fill" style="height: 100%; background: #007bff; border-radius: 2px; transition: width 0.3s;"></div>
                    </div>
                    <div class="step-counter" style="font-size: 0.9em; color: #6c757d; text-align: center;">
                        Step <span id="current-step">1</span> of <span id="total-steps">8</span>
                    </div>
                </div>
            </div>
            <div class="tour-content">
                <p id="tour-content" style="margin: 0 0 20px 0; line-height: 1.6; color: #2c3e50;"></p>
            </div>
            <div class="tour-actions" style="display: flex; justify-content: space-between; align-items: center;">
                <button id="tour-prev" class="btn btn-secondary" style="padding: 8px 16px;">Previous</button>
                <div class="tour-controls">
                    <button id="tour-skip" class="btn btn-outline" style="margin-right: 10px; padding: 8px 16px;">Skip Tour</button>
                    <button id="tour-next" class="btn btn-primary" style="padding: 8px 16px;">Next</button>
                </div>
            </div>
        `;

        this.overlay.appendChild(tooltip);
        document.body.appendChild(this.overlay);

        // Create tour start button
        this.createTourStartButton();
    }

    createTourStartButton() {
        const tourButton = document.createElement('div');
        tourButton.id = 'demo-tour-start';
        tourButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,123,255,0.3);
            z-index: 1000;
            font-weight: 600;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        `;

        tourButton.innerHTML = `
            <i class="fas fa-play-circle" style="margin-right: 8px;"></i>
            Start Demo Tour
        `;

        tourButton.addEventListener('mouseenter', () => {
            tourButton.style.transform = 'translateY(-2px)';
            tourButton.style.boxShadow = '0 6px 20px rgba(0,123,255,0.4)';
        });

        tourButton.addEventListener('mouseleave', () => {
            tourButton.style.transform = 'translateY(0)';
            tourButton.style.boxShadow = '0 4px 15px rgba(0,123,255,0.3)';
        });

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 4px 15px rgba(0,123,255,0.3); }
                50% { box-shadow: 0 4px 20px rgba(0,123,255,0.6); }
                100% { box-shadow: 0 4px 15px rgba(0,123,255,0.3); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(tourButton);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'demo-tour-start' || e.target.closest('#demo-tour-start')) {
                this.startTour();
            }
            if (e.target.id === 'tour-next') {
                this.nextStep();
            }
            if (e.target.id === 'tour-prev') {
                this.prevStep();
            }
            if (e.target.id === 'tour-skip') {
                this.endTour();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            if (e.key === 'ArrowRight' || e.key === 'Space') {
                e.preventDefault();
                this.nextStep();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevStep();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                this.endTour();
            }
        });
    }

    startTour() {
        this.isActive = true;
        this.currentStep = 0;
        this.overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Hide tour start button
        const startButton = document.getElementById('demo-tour-start');
        if (startButton) startButton.style.display = 'none';

        this.showStep(0);
    }

    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.tourSteps.length) return;

        const step = this.tourSteps[stepIndex];
        const tooltip = document.getElementById('demo-tour-tooltip');
        
        // Update content
        document.getElementById('tour-title').textContent = step.title;
        document.getElementById('tour-content').textContent = step.content;
        document.getElementById('current-step').textContent = stepIndex + 1;
        document.getElementById('total-steps').textContent = this.tourSteps.length;
        
        // Update progress
        const progress = ((stepIndex + 1) / this.tourSteps.length) * 100;
        document.getElementById('tour-progress-fill').style.width = `${progress}%`;

        // Update button states
        document.getElementById('tour-prev').disabled = stepIndex === 0;
        const nextBtn = document.getElementById('tour-next');
        if (stepIndex === this.tourSteps.length - 1) {
            nextBtn.textContent = 'Finish Tour';
            nextBtn.className = 'btn btn-success';
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.className = 'btn btn-primary';
        }

        // Execute step action
        if (step.action) {
            step.action();
        }

        // Position tooltip
        this.positionTooltip(step, tooltip);

        // Highlight target element
        this.highlightElement(step.highlight || step.target);
    }

    positionTooltip(step, tooltip) {
        const target = document.querySelector(step.target);
        if (!target) {
            // Center tooltip if target not found
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            return;
        }

        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top, left;

        switch (step.position) {
            case 'top':
                top = rect.top - tooltipRect.height - 20;
                left = rect.left + (rect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + 20;
                left = rect.left + (rect.width / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2);
                left = rect.left - tooltipRect.width - 20;
                break;
            case 'right':
                top = rect.top + (rect.height / 2);
                left = rect.right + 20;
                break;
            default:
                top = rect.bottom + 20;
                left = rect.left + (rect.width / 2);
        }

        // Ensure tooltip stays within viewport
        top = Math.max(20, Math.min(top, window.innerHeight - tooltipRect.height - 20));
        left = Math.max(20, Math.min(left, window.innerWidth - tooltipRect.width - 20));

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.transform = 'none';
    }

    highlightElement(selector) {
        // Remove previous highlights
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });

        // Add highlight to current element
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('tour-highlight');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Add highlight styles if not already added
        if (!document.getElementById('tour-highlight-styles')) {
            const style = document.createElement('style');
            style.id = 'tour-highlight-styles';
            style.textContent = `
                .tour-highlight {
                    position: relative;
                    z-index: 9999 !important;
                    box-shadow: 0 0 0 4px rgba(0,123,255,0.5) !important;
                    border-radius: 8px !important;
                    background: rgba(255,255,255,0.95) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    nextStep() {
        if (this.currentStep < this.tourSteps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.endTour();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    endTour() {
        this.isActive = false;
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
        
        // Remove highlights
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });

        // Show completion message
        this.showCompletionMessage();

        // Show tour start button again
        const startButton = document.getElementById('demo-tour-start');
        if (startButton) startButton.style.display = 'block';
    }

    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10002;
            text-align: center;
            max-width: 500px;
        `;

        message.innerHTML = `
            <div style="color: #28a745; font-size: 3em; margin-bottom: 15px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Demo Tour Complete!</h3>
            <p style="color: #6c757d; margin-bottom: 25px; line-height: 1.6;">
                You've seen how BrewMetrics can transform your brewery's customer feedback into actionable insights and increased revenue.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="start-trial" class="btn btn-success" style="padding: 12px 24px;">
                    <i class="fas fa-rocket"></i> Start Free Trial
                </button>
                <button id="contact-sales" class="btn btn-primary" style="padding: 12px 24px;">
                    <i class="fas fa-phone"></i> Contact Sales
                </button>
                <button id="view-pricing" class="btn btn-secondary" style="padding: 12px 24px;">
                    <i class="fas fa-tag"></i> View Pricing
                </button>
            </div>
        `;

        document.body.appendChild(message);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 10000);

        // Add click handlers
        message.addEventListener('click', (e) => {
            if (e.target.id === 'start-trial') {
                window.open('/demo-setup.html', '_blank');
            }
            if (e.target.id === 'contact-sales') {
                window.open('mailto:sales@brewmetrics.com?subject=Premium Plan Inquiry', '_blank');
            }
            if (e.target.id === 'view-pricing') {
                window.location.href = '/sales-demo.html?from=tour';
            }
            document.body.removeChild(message);
        });
    }

    // Step-specific actions
    showDashboardOverview() {
        const section = document.querySelector('[href="#dashboard-overview-section"]');
        if (section) section.click();
    }

    navigateToSection(sectionId) {
        const section = document.querySelector(`[href="#${sectionId}"]`);
        if (section) section.click();
    }

    highlightMetrics() {
        // Animate the metric cards
        document.querySelectorAll('.summary-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                card.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 500);
            }, index * 200);
        });
    }

    showRecipeDesigner() {
        // Open recipe designer in new tab for demo
        setTimeout(() => {
            window.open('/recipe-designer.html', '_blank');
        }, 1000);
    }

    showPremiumFeatures() {
        // Highlight premium features
        document.querySelectorAll('.premium-feature').forEach(el => {
            el.style.border = '2px solid #ffd700';
            el.style.background = 'rgba(255, 215, 0, 0.1)';
        });
    }

    showROIMetrics() {
        // Show sample ROI calculations
        const roiData = {
            monthlyRevenue: '$45,000',
            customerRetention: '+23%',
            avgRating: '4.6/5.0',
            reviewResponse: '95%'
        };

        // Update any visible metrics with demo data
        Object.keys(roiData).forEach(key => {
            const element = document.querySelector(`[data-metric="${key}"]`);
            if (element) {
                element.textContent = roiData[key];
                element.style.color = '#28a745';
                element.style.fontWeight = 'bold';
            }
        });
    }
}

// Initialize tour when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.brewMetricsTour = new BrewMetricsDemoTour();
    });
} else {
    window.brewMetricsTour = new BrewMetricsDemoTour();
}