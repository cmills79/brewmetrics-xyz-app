// firebase.js or config/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDmvUqgMlnaQFiyqlo50D66fX0Bwav3j1k",
    authDomain: "brewmetrics-xyz-app-e8d51.firebaseapp.com",
    projectId: "brewmetrics-xyz-app-e8d51",
    storageBucket: "brewmetrics-xyz-app-e8d51.firebasestorage.app",
    messagingSenderId: "391623246374",
    appId: "1:391623246374:web:3b8e39db5fff674befdce7",
    measurementId: "G-MHT3H2ZVRY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; // Export the initialized app and analytics