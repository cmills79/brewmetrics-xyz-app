# BrewMetrics Agent Guide

## Project Overview
BrewMetrics is a Firebase-based brewing analytics web application that helps breweries collect customer feedback and analyze batch performance. The app includes an AI-powered Master Brewer assistant using Google Vertex AI.

## Technology Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase Functions (Node.js 22)
- **Database**: Firebase Firestore
- **AI Service**: Google Vertex AI (Gemini)
- **Hosting**: Firebase Hosting
- **Authentication**: Firebase Auth

## Project Structure
```
brewmetrics-xyz-app/
├── functions/              # Firebase Functions (Node.js)
│   ├── index.js           # Main AI service function
│   └── package.json       # Node dependencies
├── public/                # Static web files
│   ├── dashboard.html     # Main dashboard
│   ├── dashboard.js       # Dashboard logic
│   ├── gemini-brewing-prompts.js # AI prompts
│   └── style.css          # Main styles
├── index.html             # Landing/login page
├── firebase.json          # Firebase configuration
└── README.md
```

## Development Commands

### Firebase Functions
```bash
# Install dependencies
cd functions && npm install

# Start local emulator
firebase emulators:start --only functions

# Deploy functions
firebase deploy --only functions

# View function logs
firebase functions:log

# Lint code
cd functions && npm run lint
```

### Web Hosting
```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy everything
firebase deploy

# Start local hosting emulator
firebase serve --only hosting
```

### Development Workflow
```bash
# Start full development environment
firebase emulators:start

# Deploy specific function
firebase deploy --only functions:getAIBrewingAdvice
```

## Key Firebase Configuration

### Project Details
- **Project ID**: brewmetrics-xyz-app
- **Region**: us-central1
- **Firebase Config**: Located in index.html and dashboard.html

### Environment Variables
The following are configured in Firebase:
- Google Vertex AI project integration
- Gemini API access via service account

## Database Schema

### Main Collections
- `breweries/{userId}` - Brewery profiles
- `breweries/{userId}/batches/{batchId}` - Batch data
- `breweries/{userId}/responses/{responseId}` - Customer feedback
- `breweries/{userId}/recipes/{recipeId}` - AI-generated recipes (planned)
- `breweries/{userId}/ai-interactions/{interactionId}` - AI chat history (planned)

## AI Integration

### Current Implementation
- **Function**: `getAIBrewingAdvice` in functions/index.js
- **Model**: gemini-1.5-flash-preview-0514
- **Prompts**: Comprehensive brewing-specific prompts in gemini-brewing-prompts.js

### AI Service Usage
```javascript
// Call from frontend
const result = await firebase.functions().httpsCallable('getAIBrewingAdvice')({
  prompt: 'Your brewing question here'
});
```

## Code Conventions

### JavaScript
- Use ES6+ features
- Prefer const/let over var
- Use async/await for promises
- Follow Firebase conventions for callable functions

### CSS
- Use CSS custom properties (variables)
- BEM-like naming for components
- Responsive design with mobile-first approach

### HTML
- Semantic HTML5 elements
- Accessible form labels and ARIA attributes
- Progressive enhancement approach

## Testing

### Functions Testing
```bash
# Run function tests (when implemented)
cd functions && npm test

# Manual testing with emulator
firebase emulators:start --only functions
```

### Frontend Testing
- Manual testing in browser
- Cross-browser compatibility testing
- Mobile responsiveness testing

## Deployment

### Production Deployment
```bash
# Full deployment
firebase deploy

# Functions only
firebase deploy --only functions

# Hosting only
firebase deploy --only hosting
```

### Staging/Testing
- Use Firebase hosting previews for testing
- Test functions in emulator before deployment

## Common Issues & Solutions

### Firebase Functions
- **Node version**: Must use Node 22 (specified in package.json)
- **Memory limits**: Default 256MB, increase if needed
- **Timeout**: Default 60s, increase for AI calls if needed

### AI Service
- **Rate limits**: Gemini API has rate limits, implement client-side throttling
- **Error handling**: Always wrap AI calls in try-catch blocks
- **Cost management**: Monitor Vertex AI usage in Google Cloud Console

## Security Notes
- Firebase security rules protect user data
- AI function can be called without authentication (currently)
- Never expose API keys in client-side code
- Use Firebase Functions for server-side AI calls

## Performance Considerations
- Lazy load dashboard components
- Implement caching for AI responses
- Optimize images in public/image/ directory
- Use Firebase performance monitoring

## Monitoring & Analytics
- Firebase Analytics configured (measurementId: G-MHT3H2ZVRY)
- Custom analytics in analytics.js
- Firebase Performance Monitoring available
- Function execution logs in Firebase Console
