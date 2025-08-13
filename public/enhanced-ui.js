// BrewMetrics Enhanced UI - Advanced Animations & Interactive Features

class EnhancedUI {
    constructor() {
        this.init();
        this.setupThemeToggle();
        this.setupNotifications();
        this.setupModals();
        this.setupAnimations();
        this.setupParticles();
        this.setupAdvancedCharts();
    }

    init() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }

        // Initialize Particles.js if available
        this.initParticles();
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
        
        // Setup advanced loading states
        this.setupLoadingStates();
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'fab theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.bottom = '90px';
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.body.appendChild(themeToggle);
        
        // Load saved theme
        const savedTheme = localStorage.getItem('brewmetrics-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        // Use brewery theme toggle if available
        if (window.breweryAnimations) {
            window.breweryAnimations.toggleBreweryTheme();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            this.updateThemeIcon(currentTheme);
        } else {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('brewmetrics-theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            // Animate theme transition
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Advanced Notification System
    setupNotifications() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        this.notificationContainer.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 1001;
            pointer-events: none;
        `;
        document.body.appendChild(this.notificationContainer);
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Use brewery notification if available
        if (window.breweryAnimations) {
            window.breweryAnimations.showBreweryNotification(message, type);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.pointerEvents = 'auto';
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="${icons[type]}" style="color: var(--${type}-color);"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        return notification;
    }

    // Advanced Modal System
    setupModals() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal]')) {
                this.openModal(e.target.dataset.modal);
            }
            if (e.target.matches('.modal-overlay')) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Advanced Animation System
    setupAnimations() {
        // Stagger animations for lists
        this.staggerElements('.card', 100);
        this.staggerElements('.btn', 50);
        
        // Setup hover effects
        this.setupHoverEffects();
        
        // Setup scroll animations
        this.setupScrollAnimations();
    }

    staggerElements(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}ms`;
            el.classList.add('animate-fadeInUp');
        });
    }

    setupHoverEffects() {
        // Add magnetic effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.card, .chart-container').forEach(el => {
            observer.observe(el);
        });
    }

    // Particles.js Integration
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50 },
                    color: { value: '#667eea' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.1 },
                    size: { value: 3 },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: true,
                        out_mode: 'out'
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' }
                    }
                }
            });
        }
    }

    setupParticles() {
        // Create particles container if it doesn't exist
        if (!document.getElementById('particles-js')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'particles-js';
            particlesContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            `;
            document.body.appendChild(particlesContainer);
        }
    }

    // Advanced Chart Enhancements
    setupAdvancedCharts() {
        // Enhance existing charts with animations
        if (typeof Chart !== 'undefined') {
            Chart.defaults.animation.duration = 1000;
            Chart.defaults.animation.easing = 'easeOutQuart';
            
            // Custom chart animations
            this.setupChartAnimations();
        }
    }

    setupChartAnimations() {
        const originalChartUpdate = Chart.prototype.update;
        Chart.prototype.update = function(mode) {
            // Add custom animation before update
            this.canvas.style.transform = 'scale(0.95)';
            this.canvas.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                this.canvas.style.transform = 'scale(1)';
            }, 100);
            
            return originalChartUpdate.call(this, mode);
        };
    }

    // Loading States
    setupLoadingStates() {
        this.createLoadingOverlay();
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>Loading BrewMetrics...</p>
            </div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--background);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(overlay);
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
    }

    // Intersection Observer for Performance
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Lazy load images
                    if (entry.target.dataset.src) {
                        entry.target.src = entry.target.dataset.src;
                        entry.target.removeAttribute('data-src');
                    }
                    
                    // Trigger animations
                    if (entry.target.dataset.animate) {
                        entry.target.classList.add(entry.target.dataset.animate);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements with data attributes
        document.querySelectorAll('[data-src], [data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Advanced Form Enhancements
    enhanceForm(formSelector) {
        const form = document.querySelector(formSelector);
        if (!form) return;
        
        // Add floating labels
        form.querySelectorAll('.form-control').forEach(input => {
            if (!input.nextElementSibling?.classList.contains('form-label')) {
                const label = document.createElement('label');
                label.className = 'form-label';
                label.textContent = input.placeholder || 'Enter value';
                input.parentNode.insertBefore(label, input.nextSibling);
            }
        });
        
        // Add validation animations
        form.addEventListener('submit', (e) => {
            const invalidInputs = form.querySelectorAll(':invalid');
            invalidInputs.forEach(input => {
                input.classList.add('animate__animated', 'animate__shakeX');
                setTimeout(() => {
                    input.classList.remove('animate__animated', 'animate__shakeX');
                }, 1000);
            });
        });
    }

    // Progress Bar Animation
    animateProgressBar(selector, targetValue, duration = 1000) {
        const progressBar = document.querySelector(selector);
        if (!progressBar) return;
        
        let currentValue = 0;
        const increment = targetValue / (duration / 16);
        
        const animate = () => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
            }
            
            progressBar.style.width = `${currentValue}%`;
            
            if (currentValue < targetValue) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Counter Animation
    animateCounter(selector, targetValue, duration = 2000) {
        const counter = document.querySelector(selector);
        if (!counter) return;
        
        let currentValue = 0;
        const increment = targetValue / (duration / 16);
        
        const animate = () => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
            }
            
            counter.textContent = Math.floor(currentValue);
            
            if (currentValue < targetValue) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Utility Methods
    addRippleEffect(element) {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Initialize enhanced features for existing elements
    enhance() {
        // Add ripple effects to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            this.addRippleEffect(btn);
        });
        
        // Enhance forms
        document.querySelectorAll('form').forEach(form => {
            this.enhanceForm(`#${form.id}`);
        });
        
        // Add hover effects to cards
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('hover-lift');
        });
    }
}

// CSS for ripple animation
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Add ripple CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize Enhanced UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedUI = new EnhancedUI();
    
    // Enhance existing elements after a short delay
    setTimeout(() => {
        window.enhancedUI.enhance();
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedUI;
}