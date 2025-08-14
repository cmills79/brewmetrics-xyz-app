// --- START OF script.js ---

// Wait for the HTML document to be fully loaded before running script logic
document.addEventListener('DOMContentLoaded', () => {
    // Standardized check for BrewMetricsUtils
    const { logger, errorHandler, loadingIndicator } = window.BrewMetricsUtils || {};
    if (!logger || !errorHandler || !loadingIndicator) {
        console.error('BrewMetricsUtils or its components are not loaded. Please ensure utils.js is included and loaded correctly.');
        // Fallback to console if utils are missing
        window.logger = { info: console.log, error: console.error, warn: console.warn };
        window.errorHandler = { displayError: console.error, clearError: () => {}, handleFirebaseError: (err) => console.error(err) };
        window.loadingIndicator = { show: () => console.log('Loading...'), hide: () => {} };
    }

    logger.info("Authentication page logic initiated");

    // --- Get DOM Elements ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const registerBreweryNameInput = document.getElementById('register-brewery-name');
    const registerLocationInput = document.getElementById('register-location');
    const registerGmbInput = document.getElementById('register-gmb');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const errorMessageDiv = document.getElementById('error-message');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const mainContent = document.getElementById('main-content');
    const pageLoader = document.getElementById('page-loader');

    // --- Firebase Auth State Listener ---
    // This is the core fix for the authentication issue.
    // It listens for changes in auth state and ensures Firebase has initialized before redirecting.
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // If user is logged in, redirect to the dashboard.
            logger.info("User is already logged in. Redirecting to dashboard.", { uid: user.uid });
            window.location.href = 'dashboard.html';
        } else {
            // If user is not logged in, hide the loader and show the login/register forms.
            logger.info("No active user session found. Displaying authentication forms.");
            if (pageLoader) pageLoader.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
        }
    });

    // --- Event Listeners ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorHandler.clearError();

            const email = loginEmailInput?.value?.trim();
            const password = loginPasswordInput?.value;

            if (!email || !password) {
                errorHandler.displayError("Please enter both email and password.");
                return;
            }

            logger.info("Login attempt started", { email });
            loadingIndicator.show();

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    logger.info("User logged in successfully. Firebase will redirect.", { uid: userCredential.user.uid });
                    // No need to redirect here, onAuthStateChanged will handle it.
                })
                .catch((error) => {
                    logger.error("Login failed", error);
                    errorHandler.handleFirebaseError(error);
                    loadingIndicator.hide();
                });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorHandler.clearError();
            
            const email = registerEmailInput?.value?.trim();
            const password = registerPasswordInput?.value;
            const breweryName = registerBreweryNameInput?.value?.trim();
            const location = registerLocationInput?.value?.trim();
            const gmbLink = registerGmbInput?.value?.trim() || '';

            if (!email || !password || !breweryName || !location) {
                errorHandler.displayError("Please fill in all required registration fields.");
                return;
            }
            if (password.length < 6) {
                errorHandler.displayError("Password must be at least 6 characters long.");
                return;
            }

            logger.info("Registration attempt started", { email });
            loadingIndicator.show();

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    logger.info('User registered successfully. Saving brewery details to Firestore.', { uid: user.uid });
                    
                    // Save brewery details to Firestore
                    return firebase.firestore().collection('breweries').doc(user.uid).set({
                        breweryName: breweryName,
                        location: location,
                        gmbLink: gmbLink,
                        email: user.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    logger.info('Brewery details saved. Firebase will redirect.');
                    // onAuthStateChanged will handle the redirect to the dashboard.
                })
                .catch((error) => {
                    logger.error("Registration or Firestore Error:", error);
                    errorHandler.handleFirebaseError(error);
                    loadingIndicator.hide();
                });
        });
    }

    // --- Toggle Forms ---
    if (showRegisterLink && showLoginLink) {
        const loginSection = document.getElementById('login-section');
        const registerSection = document.getElementById('register-section');

        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginSection) loginSection.style.display = 'none';
            if (registerSection) registerSection.style.display = 'block';
            errorHandler.clearError();
            if (loginForm) loginForm.reset();
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerSection) registerSection.style.display = 'none';
            if (loginSection) loginSection.style.display = 'block';
            errorHandler.clearError();
            if (registerForm) registerForm.reset();
        });
    }
});
// --- END OF script.js ---
