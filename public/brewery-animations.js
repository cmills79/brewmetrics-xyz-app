// BrewMetrics Brewery-Themed Animations & Interactions

class BreweryAnimations {
    constructor() {
        this.init();
        this.setupBreweryParticles();
        this.setupBreweryInteractions();
        this.setupBrewingEffects();
    }

    init() {
        // Apply brewery theme classes
        document.body.classList.add('brewery-theme');
        
        // Initialize brewery-specific animations
        this.initBreweryComponents();
        this.setupHopFloatingAnimation();
        this.setupBubbleEffects();
        this.setupFermentationAnimation();
    }

    // Brewery-themed particle system
    setupBreweryParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 30 },
                    color: { value: ['#D2691E', '#FFD700', '#228B22'] }, // Amber, Golden, Hops
                    shape: { 
                        type: 'circle',
                        stroke: { width: 1, color: '#D2691E' }
                    },
                    opacity: { 
                        value: 0.3,
                        random: true,
                        anim: { enable: true, speed: 1, opacity_min: 0.1 }
                    },
                    size: { 
                        value: 4,
                        random: true,
                        anim: { enable: true, speed: 2, size_min: 1 }
                    },
                    move: {
                        enable: true,
                        speed: 0.8,
                        direction: 'top', // Bubbles rise like in beer
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'bubble' },
                        onclick: { enable: true, mode: 'repulse' }
                    },
                    modes: {
                        bubble: { distance: 100, size: 8, duration: 2, opacity: 0.8 },
                        repulse: { distance: 150, duration: 0.4 }
                    }
                }
            });
        }
    }

    // Brewery-specific component initialization
    initBreweryComponents() {
        // Convert existing cards to brewery cards
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('brewery-card');
            this.addBreweryHoverEffect(card);
        });

        // Convert buttons to brewery buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.classList.add('btn-brewery-primary');
        });

        // Convert metric cards
        document.querySelectorAll('.summary-card').forEach(card => {
            card.classList.add('brewery-metric-card');
        });
    }

    // Add brewery-specific hover effects
    addBreweryHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            // Random brewery animation on hover
            const animations = ['brewery-hover-bubble', 'brewery-hover-ferment', 'brewery-hover-hop'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            element.classList.add(randomAnimation);
            
            // Create bubble effect
            this.createBubbleEffect(element);
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('brewery-hover-bubble', 'brewery-hover-ferment', 'brewery-hover-hop');
        });
    }

    // Create beer bubble effect
    createBubbleEffect(element) {
        const bubble = document.createElement('div');
        bubble.className = 'brewery-bubble';
        bubble.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #FFD700, #D2691E);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: bubbleUp 1s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        bubble.style.left = (rect.left + Math.random() * rect.width) + 'px';
        bubble.style.top = (rect.bottom - 10) + 'px';
        
        document.body.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 1000);
    }

    // Hop floating animation for icons
    setupHopFloatingAnimation() {
        document.querySelectorAll('.fas.fa-leaf, .fas.fa-seedling').forEach(icon => {
            icon.classList.add('animate-brewery-hop');
        });
    }

    // Beer bubble effects for loading and progress
    setupBubbleEffects() {
        // Replace loading spinners with brewery loading
        document.querySelectorAll('.loading-spinner').forEach(spinner => {
            spinner.classList.add('brewery-loading');
        });

        // Add bubble animation to progress indicators
        document.querySelectorAll('.progress-fill').forEach(progress => {
            progress.style.position = 'relative';
            progress.style.overflow = 'hidden';
            
            const bubbles = document.createElement('div');
            bubbles.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.6) 2px, transparent 2px),
                    radial-gradient(circle at 80% 20%, rgba(210, 105, 30, 0.6) 1px, transparent 1px),
                    radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.4) 1px, transparent 1px);
                background-size: 20px 20px, 15px 15px, 25px 25px;
                animation: bubbleUp 3s ease-in-out infinite;
            `;
            progress.appendChild(bubbles);
        });
    }

    // Fermentation animation for data processing
    setupFermentationAnimation() {
        // Add fermentation effect to charts when they update
        document.querySelectorAll('canvas').forEach(canvas => {
            const observer = new MutationObserver(() => {
                this.addFermentationEffect(canvas.parentElement);
            });
            
            observer.observe(canvas, { attributes: true, childList: true });
        });
    }

    addFermentationEffect(container) {
        container.classList.add('animate-brewery-ferment');
        setTimeout(() => {
            container.classList.remove('animate-brewery-ferment');
        }, 2000);
    }

    // Brewery-themed notifications
    showBreweryNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `brewery-notification ${type}`;
        
        const icons = {
            success: 'fas fa-beer',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-flask',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="${icons[type]}" style="color: var(--brew-amber); font-size: 1.2em;"></i>
                <span style="color: var(--text-primary);">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; cursor: pointer; margin-left: auto; color: var(--text-secondary);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Position notification
        notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 1001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove with brewery animation
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Brewery-themed progress ring animation
    animateBreweryProgressRing(element, value, max = 100) {
        const circle = element.querySelector('.progress-ring-progress');
        if (!circle) return;
        
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        circle.style.stroke = 'url(#breweryGradient)';
        
        // Add SVG gradient if not exists
        this.addBreweryGradient(element.querySelector('svg'));
        
        const progress = (value / max) * circumference;
        
        setTimeout(() => {
            circle.style.strokeDashoffset = circumference - progress;
            circle.style.filter = 'drop-shadow(0 0 3px var(--brew-amber))';
        }, 100);
    }

    // Add brewery gradient to SVG
    addBreweryGradient(svg) {
        if (!svg || svg.querySelector('#breweryGradient')) return;
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.id = 'breweryGradient';
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#D2691E');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#FFD700');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
    }

    // Brewery-themed counter animation
    animateBreweryCounter(element, targetValue, duration = 2000) {
        let currentValue = 0;
        const increment = targetValue / (duration / 16);
        
        const animate = () => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
            }
            
            element.textContent = Math.floor(currentValue).toLocaleString();
            element.style.color = 'var(--brew-amber)';
            element.style.textShadow = '0 0 10px rgba(210, 105, 30, 0.3)';
            
            if (currentValue < targetValue) {
                requestAnimationFrame(animate);
            } else {
                // Add completion effect
                element.classList.add('animate-brewery-glow');
                setTimeout(() => {
                    element.classList.remove('animate-brewery-glow');
                }, 1000);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Setup brewery interactions
    setupBreweryInteractions() {
        // Add brewery ripple effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createBreweryRipple(e, btn);
            });
        });

        // Add brewery hover sound effect (visual feedback)
        document.querySelectorAll('.brewery-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = '0 8px 25px rgba(210, 105, 30, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
            });
        });
    }

    // Create brewery-themed ripple effect
    createBreweryRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.6), rgba(210, 105, 30, 0.3));
            border-radius: 50%;
            transform: scale(0);
            animation: breweryRipple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Brewery theme toggle
    toggleBreweryTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('brewmetrics-theme', newTheme);
        
        // Show brewery-themed notification
        this.showBreweryNotification(
            `Switched to ${newTheme === 'dark' ? 'Pub' : 'Brewery'} theme!`, 
            'success'
        );
        
        // Add theme transition effect
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    // Initialize brewery enhancements for existing elements
    enhanceBreweryElements() {
        // Enhance metric cards with brewery animations
        document.querySelectorAll('[data-component="metric-card"]').forEach(card => {
            const value = card.querySelector('.value');
            if (value && !isNaN(parseInt(value.textContent))) {
                this.animateBreweryCounter(value, parseInt(value.textContent));
            }
        });

        // Enhance progress rings
        document.querySelectorAll('[data-component="progress-ring"]').forEach(ring => {
            const config = JSON.parse(ring.dataset.config || '{}');
            this.animateBreweryProgressRing(ring, config.value || 0, config.max || 100);
        });

        // Add brewery classes to forms
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.add('brewery-form-control');
        });

        // Enhance tables
        document.querySelectorAll('table').forEach(table => {
            table.classList.add('brewery-table');
        });
    }
}

// Add brewery ripple animation CSS
const breweryRippleCSS = `
@keyframes breweryRipple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = breweryRippleCSS;
document.head.appendChild(style);

// Initialize Brewery Animations
document.addEventListener('DOMContentLoaded', () => {
    window.breweryAnimations = new BreweryAnimations();
    
    // Enhance existing elements after a short delay
    setTimeout(() => {
        window.breweryAnimations.enhanceBreweryElements();
    }, 500);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreweryAnimations;
}