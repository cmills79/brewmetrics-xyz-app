// Demo Account Premium Upgrade Script
class DemoUpgrade {
    constructor() {
        this.init();
    }

    init() {
        // Auto-upgrade demo account on page load
        if (this.isDemoAccount()) {
            this.upgradeToPremium();
        }
    }

    isDemoAccount() {
        // Check if current user is demo account
        const user = firebase.auth().currentUser;
        return user && user.email === 'demo@hopvalleybrewing.com';
    }

    async upgradeToPremium() {
        try {
            console.log('Upgrading demo account to Premium...');
            
            const upgradeDemoToPremium = firebase.functions().httpsCallable('upgradeDemoToPremium');
            const result = await upgradeDemoToPremium();
            
            if (result.data.success) {
                console.log('Demo account upgraded to Premium:', result.data.features);
                
                // Store premium status in localStorage for immediate access
                localStorage.setItem('userTier', 'premium');
                localStorage.setItem('premiumFeatures', JSON.stringify(result.data.features));
                
                // Show upgrade notification
                this.showUpgradeNotification(result.data.features);
                
                // Update UI to reflect premium status
                this.updateUIForPremium();
            }
            
        } catch (error) {
            console.error('Error upgrading demo account:', error);
        }
    }

    showUpgradeNotification(features) {
        // Create upgrade notification
        const notification = document.createElement('div');
        notification.className = 'premium-upgrade-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 350px;
            animation: slideInRight 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <i class="fas fa-crown" style="font-size: 1.5em; margin-right: 10px; color: #ffd700;"></i>
                <h3 style="margin: 0;">Premium Activated!</h3>
            </div>
            <p style="margin: 10px 0; font-size: 0.9em;">Demo account upgraded with all premium features:</p>
            <ul style="margin: 10px 0; padding-left: 20px; font-size: 0.8em;">
                ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                float: right;
                margin-top: 10px;
            ">Got it!</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    updateUIForPremium() {
        // Add premium badge to navbar
        const navbar = document.querySelector('.navbar');
        if (navbar && !navbar.querySelector('.premium-badge')) {
            const premiumBadge = document.createElement('div');
            premiumBadge.className = 'premium-badge';
            premiumBadge.style.cssText = `
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #333;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8em;
                font-weight: bold;
                margin-left: 15px;
                display: flex;
                align-items: center;
                gap: 5px;
            `;
            premiumBadge.innerHTML = '<i class="fas fa-crown"></i> PREMIUM';
            navbar.appendChild(premiumBadge);
        }
        
        // Update any "Upgrade to Premium" buttons
        document.querySelectorAll('.upgrade-btn, .premium-required').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Show premium features
        document.querySelectorAll('.premium-feature').forEach(feature => {
            feature.style.display = 'block';
        });
    }

    async checkSubscriptionTier() {
        try {
            const getUserSubscriptionTier = firebase.functions().httpsCallable('getUserSubscriptionTier');
            const result = await getUserSubscriptionTier();
            
            return result.data;
        } catch (error) {
            console.error('Error checking subscription tier:', error);
            return { tier: 'free', features: [] };
        }
    }
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .premium-upgrade-notification {
        animation: slideInRight 0.5s ease;
    }
`;
document.head.appendChild(style);

// Initialize demo upgrade when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase Auth to initialize
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            new DemoUpgrade();
        }
    });
});

// Global function to check if user has premium access
window.getUserTier = async function() {
    const cachedTier = localStorage.getItem('userTier');
    if (cachedTier) {
        return cachedTier;
    }
    
    try {
        const getUserSubscriptionTier = firebase.functions().httpsCallable('getUserSubscriptionTier');
        const result = await getUserSubscriptionTier();
        
        localStorage.setItem('userTier', result.data.tier);
        return result.data.tier;
    } catch (error) {
        console.error('Error checking user tier:', error);
        return 'free';
    }
};