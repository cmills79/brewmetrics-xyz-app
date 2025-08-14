// Enhanced UI functionality for BrewMetrics
class EnhancedUI {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addLoadingStates();
    }

    addHoverEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.card, .summary-card, .dashboard-section');
        cards.forEach(card => {
            card.classList.add('hover-lift');
        });
    }

    addLoadingStates() {
        // Add loading states to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!button.disabled && !button.classList.contains('no-loading')) {
                    this.showButtonLoading(button);
                }
            });
        });
    }

    showButtonLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }

    enhance() {
        this.addHoverEffects();
        this.addLoadingStates();
    }
}

// Initialize enhanced UI
window.enhancedUI = new EnhancedUI();