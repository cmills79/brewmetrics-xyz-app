// Common Firebase configuration for the entire BrewMetrics app.
const firebaseConfig = {
    apiKey: "AIzaSyAbWYXyIA0zc92QnxgkMeEmLZBJ_mV55AI",
    authDomain: "brewmetrics-xyz-web.firebaseapp.com",
    projectId: "brewmetrics-xyz-web",
    storageBucket: "brewmetrics-xyz-web.firebasestorage.app",
    messagingSenderId: "269907975135",
    appId: "1:269907975135:web:670727a1beba3c8879026a",
    measurementId: "G-BZZCFRNRYJ"
};

// Initialize and export Firebase services
// This pattern ensures Firebase is initialized only once.
let auth, db, functions;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized from firebase-config.js");
    } else {
        firebase.app(); // Use the already initialized app
        console.log("Firebase already initialized, using existing app.");
    }
    
    auth = firebase.auth();
    db = firebase.firestore();
    functions = firebase.functions();

} catch (e) {
    console.error("Critical Error: Could not initialize Firebase from firebase-config.js.", e);
    // Display a user-friendly error on the page if possible
    document.body.innerHTML = '<div style="padding: 20px; text-align: center; font-family: sans-serif; background-color: #ffebee; color: #c62828;">' +
                              '<h1>Application Error</h1>' +
                              '<p>Could not connect to required services. Please try again later or contact support.</p>' +
                              '<p>Error details: ' + e.message + '</p>' +
                              '</div>';
}
