// --- START OF script.js ---

// Wait for the HTML document to be fully loaded before running script logic
document.addEventListener('DOMContentLoaded', () => {

    // Initialize utilities
    const { logger, errorHandler, loadingIndicator } = window.BrewMetricsUtils || {};
    
    if (!logger) {
        console.error('BrewMetricsUtils not loaded. Please include utils.js before this script.');
        return;
    }
    
    logger.info("Authentication page loaded");

    // --- Get DOM Elements ---
    // (Keep all your getElementById calls here)
    const loginForm = document.getElementById('login'); // Should find it now
    const registerForm = document.getElementById('register'); // Should find it now
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const registerBreweryNameInput = document.getElementById('register-brewery-name');
    const registerLocationInput = document.getElementById('register-location');
    const registerGmbInput = document.getElementById('register-gmb');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const errorMessageDiv = document.getElementById('error-message'); // Should find it now
    const showRegisterLink = document.getElementById('show-register'); // Should find it now
    const showLoginLink = document.getElementById('show-login'); // Should find it now
    const loginSection = document.getElementById('login-form'); // Should find it now
    const registerSection = document.getElementById('register-form'); // Should find it now

    // --- Add Event Listeners ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear previous errors
            errorHandler.clearError();
            
            // Get values at submission time
            const email = loginEmailInput?.value?.trim();
            const password = loginPasswordInput?.value;

            if (!email || !password) {
                errorHandler.displayError("Please enter both email and password.");
                return;
            }

            logger.info("Login attempt started", { email });

            // Show loading indicator
            loadingIndicator.show();
            loginForm.style.display = 'none';

            // Use Firebase auth
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    logger.info("User logged in successfully", { 
                        uid: userCredential.user.uid, 
                        email: userCredential.user.email 
                    });
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    logger.error("Login failed", error);
                    errorHandler.handleFirebaseError(error);
                    
                    // Show form again on error
                    loadingIndicator.hide();
                    loginForm.style.display = 'block';
                });
        });
    } else {
        logger.error("Login form element not found");
    }

    if (registerForm) {
         registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAuthError();
            // Get values at submission time
            const email = registerEmailInput ? registerEmailInput.value : null;
            const password = registerPasswordInput ? registerPasswordInput.value : null;
            const breweryName = registerBreweryNameInput ? registerBreweryNameInput.value : null;
            const location = registerLocationInput ? registerLocationInput.value : null;
            const gmbLink = registerGmbInput ? registerGmbInput.value : ''; // Default to empty string

            if (!email || !password || !breweryName || !location) {
                 displayAuthError("Please fill in all required registration fields.");
                 return;
            }
            if (password.length < 6) {
                displayAuthError("Password must be at least 6 characters long.");
                return;
            }

            console.log(`Attempting registration for: ${email}`);

            // Show loading indicator
            registerForm.parentNode.insertBefore(loadingIndicator, registerForm); // Insert before form
            loadingIndicator.style.display = 'block';
            registerForm.style.display = 'none'; // Hide the form

            auth.createUserWithEmailAndPassword(email, password)
                 .then((userCredential) => {
                     const user = userCredential.user;
                     console.log('User registered:', user.uid);
                     // Now save brewery details to Firestore
                     // Use 'db' declared globally by index.html inline script
                     return db.collection('breweries').doc(user.uid).set({
                         breweryName: breweryName,
                         location: location,
                         gmbLink: gmbLink,
                         email: user.email, // Use the email from the auth user
                         createdAt: firebase.firestore.FieldValue.serverTimestamp()
                     });
                 })
                .then(() => {
                     console.log('Brewery details saved to Firestore.');
                      // if (registerForm) registerForm.reset(); // Reset form
                     window.location.href = 'dashboard.html'; // Redirect
                 })
                 .catch((error) => {
                     console.error("Registration or Firestore Error:", error);
                     displayAuthError(error.code); // Pass error code

                     // Hide loading indicator, show form again on error
                     loadingIndicator.style.display = 'none';
                     registerForm.style.display = 'block';
                 });
         });
    } else {
         console.error("Register form element not found!");
    }

    // --- Toggle Forms ---
    if (showRegisterLink && showLoginLink && loginSection && registerSection) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
            clearAuthError();
            // Optional: Clear form fields when toggling
             if (loginForm) loginForm.reset();
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
            clearAuthError();
             // Optional: Clear form fields when toggling
             if (registerForm) registerForm.reset();
        });
    } else {
        // Log which elements specifically weren't found
        if (!showRegisterLink) console.error("Show Register Link not found");
        if (!showLoginLink) console.error("Show Login Link not found");
        if (!loginSection) console.error("Login Section not found");
        if (!registerSection) console.error("Register Section not found");
    }
    
    // --- Form Clearing Function ---
    function clearFormFields(formElement) {
        if (formElement) {
            formElement.reset();
        }
    }

    // --- Error Handling Functions ---
    function displayAuthError(errorCodeOrMessage) {
        let message = errorCodeOrMessage; // Default to the raw message/code
        console.log("Displaying error for code/message:", errorCodeOrMessage); // Debugging
        if (errorMessageDiv) {
            // Map common error codes to user-friendly messages
            switch (errorCodeOrMessage) {
                case 'auth/invalid-email':
                    message = 'Please enter a valid email address.';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential': // Catch this modern code too
                    message = 'Incorrect email or password. Please try again.';
                    break;
                case 'auth/email-already-in-use':
                    message = 'This email address is already registered. Please login or use a different email.';
                    break;
                 case 'auth/weak-password':
                     message = 'Password is too weak. Please use at least 6 characters.';
                     break;
                 case 'auth/missing-password':
                     message = 'Please enter your password.';
                     break;
                 // Add more mappings as needed
                 default:
                     // If it's not a recognized code, display it or a generic message
                     // Avoid showing raw internal messages to the user unless debugging
                     console.error("Unhandled Auth Error Code:", errorCodeOrMessage);
                     message = 'An unexpected error occurred. Please try again.';
            }
            errorMessageDiv.textContent = message;
            errorMessageDiv.classList.remove('hidden');
        } else {
            console.error("Error display element (#error-message) not found!");
        }
    }

    function clearAuthError() {
         if (errorMessageDiv) {
            errorMessageDiv.textContent = '';
            errorMessageDiv.classList.add('hidden');
        }
    }
} // <-- Add this closing brace to end the DOMContentLoaded callback
); // <-- Add this closing parenthesis and semicolon to close the event listener
// --- END OF script.js --