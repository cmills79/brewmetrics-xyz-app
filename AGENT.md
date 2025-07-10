# BrewMetrics Agent Guide

## Build/Deploy Commands
- **Deploy**: `firebase deploy` (Firebase hosting)
- **Serve locally**: `firebase serve` or serve files via local HTTP server
- **Firebase CLI setup**: `firebase init`

## Architecture & Structure
- **Firebase Hosting**: Single-page app with static files in `/public`
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Auth (email/password)
- **Main entry points**: `index.html` (login), `dashboard.html` (admin), `patron_survey.html` (customer surveys)
- **Core modules**: 
  - `dashboard.js` - brewery admin interface with analytics
  - `analytics.js` - advanced chart generation and statistics
  - `survey.js` - customer beer rating survey
  - `patron.js` - customer batch selection
  - `script.js` - authentication logic

## Code Style & Conventions
- **Language**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Naming**: camelCase for variables/functions, kebab-case for IDs/classes
- **Firebase patterns**: Use compat SDK, global `db` and `auth` objects
- **Error handling**: Try-catch blocks, user-friendly error messages
- **Comments**: Section headers with `// =========` separator lines
- **Constants**: UPPER_CASE with descriptive prefixes (e.g., `CHART_COLORS`)
- **Async/await**: Preferred over .then() chains
- **DOM elements**: Cache references at function/module start
- **CSS**: CSS custom properties (--brew-* variables) for theming
- **File structure**: Modular separation (analytics, survey, dashboard logic)
