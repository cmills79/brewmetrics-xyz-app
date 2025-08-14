// --- public/firebase-config.js ---
// DYNAMIC Firebase Configuration Loader

/**
 * This script automatically detects the environment (development or production)
 * and loads the appropriate Firebase configuration file.
 *
 * - On 'localhost' or '127.0.0.1', it will load 'firebase-config.dev.js'.
 * - On any other domain, it will load 'firebase-config.prod.js'.
 *
 * This prevents accidental use of production keys in a development environment.
 */
(function() {
    // Determine if the environment is development
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';

    // Create a new script element to load the correct config
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    // Set the source of the script based on the environment
    if (isDevelopment) {
        console.warn("ENVIRONMENT: Development mode detected. Loading dev configuration.");
        script.src = 'firebase-config.dev.js';
    } else {
        console.log("ENVIRONMENT: Production mode detected. Loading prod configuration.");
        script.src = 'firebase-config.prod.js';
    }

    // Append the script to the head of the document to load and initialize Firebase
    document.head.appendChild(script);
})();
