// Utility functions for BrewMetrics application
// Production-ready logging, error handling, and sanitization

/**
 * A simple, production-ready logger that only outputs messages in development environments.
 */
class Logger {
  constructor() {
    this.isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
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
    // In a real production environment, this would send errors to a tracking service (e.g., Sentry, LogRocket)
    console.error(`[ERROR] ${message}`, error || '');
  }
}

/**
 * Centralized error handler for displaying user-friendly messages and processing Firebase errors.
 */
class ErrorHandler {
  constructor(logger) {
    this.logger = logger;
  }

  displayError(message, containerId = 'error-message') {
    const errorContainer = document.getElementById(containerId);
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.remove('hidden');
      setTimeout(() => this.clearError(containerId), 8000); // Hide after 8s
    } else {
      this.logger.error(`Error display container #${containerId} not found.`);
    }
  }

  clearError(containerId = 'error-message') {
    const errorContainer = document.getElementById(containerId);
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.classList.add('hidden');
    }
  }

  handleFirebaseError(error) {
    let userMessage = 'An unexpected error occurred. Please try again.';
    this.logger.error('Firebase Error:', error);

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        userMessage = 'Incorrect email or password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        userMessage = 'This email address is already registered. Please login.';
        break;
      case 'auth/weak-password':
        userMessage = 'Password is too weak. Must be at least 6 characters.';
        break;
      case 'auth/invalid-email':
        userMessage = 'Please enter a valid email address.';
        break;
      case 'auth/network-request-failed':
        userMessage = 'Network error. Please check your connection and try again.';
        break;
      case 'permission-denied':
        userMessage = "You don't have permission to perform this action.";
        break;
      default:
        this.logger.error('Unhandled Firebase error code:', error.code);
    }
    this.displayError(userMessage);
    return userMessage;
  }
}

/**
 * A simple loading indicator to show during async operations.
 */
class LoadingIndicator {
  constructor(elementId = 'global-loading-indicator') {
    this.indicator = document.getElementById(elementId);
    if (!this.indicator) {
      this.indicator = this._createIndicator(elementId);
      document.body.appendChild(this.indicator);
    }
  }

  _createIndicator(id) {
    const indicator = document.createElement('div');
    indicator.id = id;
    indicator.className = 'loading-overlay';
    indicator.innerHTML = '<div class="loading-spinner"></div>';
    return indicator;
  }

  show() {
    this.indicator.style.display = 'flex';
  }

  hide() {
    this.indicator.style.display = 'none';
  }
}

/**
 * Sanitizer utility to prevent XSS attacks.
 * Relies on DOMPurify, which must be loaded before this script.
 */
class Sanitizer {
  constructor(logger) {
    this.logger = logger;
    if (typeof DOMPurify === 'undefined') {
      this.logger.error('DOMPurify is not loaded. Sanitization will not work.');
      this.isReady = false;
    } else {
      this.isReady = true;
      // You can configure DOMPurify here if needed
      // DOMPurify.setConfig({ ... });
    }
  }

  /**
   * Sanitizes a string of HTML, removing any potentially malicious code.
   * @param {string} dirtyHtml The HTML string to sanitize.
   * @returns {string} The sanitized HTML string.
   */
  sanitize(dirtyHtml) {
    if (!this.isReady || typeof dirtyHtml !== 'string') {
      // Fallback for safety: return an empty string or log an error
      this.logger.error('Sanitization failed. DOMPurify not ready or input is not a string.');
      // Return text content to be safe, prevents HTML rendering
      const div = document.createElement('div');
      div.textContent = dirtyHtml;
      return div.innerHTML;
    }
    return DOMPurify.sanitize(dirtyHtml);
  }
}


// --- Global Initialization ---

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const loadingIndicator = new LoadingIndicator();
const sanitizer = new Sanitizer(logger);

// Export a single, global utility object
window.BrewMetricsUtils = {
  logger,
  errorHandler,
  loadingIndicator,
  sanitizer, // Add the new sanitizer
};
