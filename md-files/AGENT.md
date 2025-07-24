# BrewMetrics XYZ App - Agent Guide

## Commands
- **Lint Functions**: `cd functions && npm run lint`
- **Serve Functions Locally**: `cd functions && npm run serve` (Firebase emulators)
- **Deploy Functions**: `cd functions && npm run deploy`
- **Firebase Hosting Deploy**: `firebase deploy --only hosting`
- **Firebase Emulators**: `firebase emulators:start`
- **Test Functions**: No test framework found - uses ESLint for code quality

## Architecture
- **Frontend**: Vanilla HTML/CSS/JS in `/public` with Firebase Auth/Firestore
- **Backend**: Firebase Cloud Functions in `/functions` using Node.js 20
- **Database**: Firebase (implied from auth code), Neo4j integration in functions
- **AI**: Google Vertex AI (Gemini 2.5 Flash) for brewing advice via `getAIBrewingAdvice` function
- **Hosting**: Firebase Hosting with SPA rewrites (patron_survey, survey_questions)
- **Project**: `brewmetrics-xyz-app-e8d51` (hardcoded in functions)

## Code Style
- **ESLint**: Google style guide, double quotes, prefer arrow functions
- **Functions**: Use `firebase-functions` patterns, proper error handling with `HttpsError`
- **Frontend**: Vanilla JS with DOMContentLoaded, camelCase for JS variables
- **HTML/CSS**: kebab-case for IDs/classes, form validation patterns
- **Error Handling**: Use Firebase-specific error types, display user-friendly messages
- **Dependencies**: Uses @google-cloud/vertexai, firebase-admin, neo4j-driver
