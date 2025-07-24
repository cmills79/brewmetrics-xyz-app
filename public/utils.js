// Utility functions for BrewMetrics application
// Production-ready logging and error handling

class Logger {
  constructor() {
    this.isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.port !== '';
  }

  info(message, data = null) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  warn(message, data = null) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  error(message, error = null) {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
    // In production, you might want to send to error tracking service
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }
}

class ErrorHandler {
  constructor(logger) {
    this.logger = logger;
  }

  displayError(message, containerId = 'error-message') {
    const errorContainer = document.getElementById(containerId);
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.remove('hidden');
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        this.clearError(containerId);
      }, 10000);
    }
    this.logger.error('User error displayed:', message);
  }

  clearError(containerId = 'error-message') {
    const errorContainer = document.getElementById(containerId);
    if (errorContainer) {
      errorContainer.classList.add('hidden');
      errorContainer.textContent = '';
    }
  }

  handleFirebaseError(error) {
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        userMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        userMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        userMessage = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        userMessage = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/invalid-email':
        userMessage = 'Please enter a valid email address.';
        break;
      case 'auth/network-request-failed':
        userMessage = 'Network error. Please check your connection and try again.';
        break;
      case 'permission-denied':
        userMessage = 'You don\'t have permission to access this data.';
        break;
      case 'unavailable':
        userMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        this.logger.error('Unhandled Firebase error:', error);
    }
    
    this.displayError(userMessage);
    return userMessage;
  }
}

class LoadingIndicator {
  constructor() {
    this.createLoadingElement();
  }

  createLoadingElement() {
    if (!document.getElementById('global-loading')) {
      const loading = document.createElement('div');
      loading.id = 'global-loading';
      loading.innerHTML = `
        <div class="loading-overlay">
          <div class="loading-spinner">
            <div class="bubbles">
              <div class="bubble"></div>
              <div class="bubble"></div>
              <div class="bubble"></div>
            </div>
          </div>
        </div>
      `;
      loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: none;
        z-index: 9999;
        justify-content: center;
        align-items: center;
      `;
      document.body.appendChild(loading);
    }
  }

  show() {
    const loading = document.getElementById('global-loading');
    if (loading) {
      loading.style.display = 'flex';
    }
  }

  hide() {
    const loading = document.getElementById('global-loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }
}

// Global utilities
const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const loadingIndicator = new LoadingIndicator();

// Export for use in other scripts
window.BrewMetricsUtils = {
  logger,
  errorHandler,
  loadingIndicator
};
