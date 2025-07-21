# BrewMetrics Agent Guide - Current Status

## Project Overview
BrewMetrics is a Firebase-based brewing analytics web application that helps breweries collect customer feedback and analyze batch performance. The app includes an AI-powered Master Brewer assistant using Google Vertex AI with advanced Markdown rendering capabilities.

**Current Status**: Production-ready with recent AI enhancements and bug fixes

## Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Firebase Functions (Node.js 20)
- **Database**: Firebase Firestore
- **AI Service**: Google Vertex AI (Gemini 2.5 Flash)
- **Graph Database**: Neo4j integration (in development)
- **Hosting**: Firebase Hosting
- **Authentication**: Firebase Auth

## Project Structure
```
brewmetrics-xyz-app/
├── functions/              # Firebase Functions (Node.js 20)
│   ├── index.js           # Main AI service function (recently updated)
│   └── package.json       # Node dependencies with Neo4j driver
├── public/                # Static web files
│   ├── dashboard.html     # Main dashboard
│   ├── dashboard.js       # Dashboard logic with AI assistant
│   ├── patron_survey.html # Customer feedback forms
│   ├── test-ai.html       # AI testing interface
│   ├── print_template.html # QR code printing
│   ├── gemini-brewing-prompts.js # AI prompts
│   ├── analytics.js       # Custom analytics
│   └── style.css          # Main styles
├── ai_train_data/         # Training data for AI model
├── index.html             # Landing/login page
├── firebase.json          # Firebase configuration
└── README.md
```

## Recent Updates & Current Status

### ✅ Completed Features
1. **AI Assistant Enhancements**
   - Advanced Markdown parsing with `parseMarkdownToHtml()` function
   - Support for bold, italic, code blocks, lists, headers
   - Refactored AI message rendering logic
   - Improved error handling and typing indicators

2. **Firebase Functions**
   - Successfully deployed `getAIBrewingAdvice` function
   - Updated to Gemini 2.5 Flash model
   - Neo4j driver integration (in development)
   - Fixed deployment issues and parameter handling

3. **Core Dashboard Features**
   - Brewery data management and editing
   - Batch entry and management system
   - QR code generation for customer surveys
   - Top-rated beers analytics with time filtering
   - Feedback collection and analysis

4. **Authentication & Security**
   - Firebase Auth integration with session persistence
   - User-specific data isolation
   - Secure Firebase Functions deployment

### 🚧 In Development
1. **Neo4j Graph Database Integration**
   - Driver installed and configured
   - Knowledge graph for brewing data relationships
   - Enhanced AI context from graph queries

2. **Advanced Analytics**
   - Chart.js integration for data visualization
   - Batch comparison functionality
   - Taste attribute trending

### 🔧 Recent Bug Fixes
1. Fixed Firebase Functions deployment errors
2. Resolved parameter calling issues during deployment
3. Updated Node.js version to 20 (from 22)
4. Removed problematic lint predeploy script

## Development Commands

### Firebase Functions
```bash
# Install dependencies
cd functions && npm install

# Deploy functions (working)
firebase deploy --only functions

# Start local emulator
firebase emulators:start --only functions

# View function logs
firebase functions:log
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
- **Project ID**: brewmetrics-xyz-app-e8d51
- **Region**: us-central1
- **Firebase Config**: Located in index.html and dashboard.html

### Environment Variables
Currently configured in Firebase:
- Google Vertex AI project integration
- Gemini API access via service account
- Neo4j connection parameters (NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)

## Database Schema

### Firestore Collections
- `breweries/{userId}` - Brewery profiles and settings
- `breweries/{userId}/batches/{batchId}` - Batch data and metadata
- `breweries/{userId}/responses/{responseId}` - Customer feedback responses
- `breweries/{userId}/recipes/{recipeId}` - AI-generated recipes (planned)
- `breweries/{userId}/ai-interactions/{interactionId}` - AI chat history (planned)

### Neo4j Graph Schema (In Development)
- Beer nodes with properties (name, style, ABV, IBU)
- Brewery nodes with relationships
- Taste profile connections
- Ingredient relationship mapping

## AI Integration

### Current Implementation
- **Function**: `getAIBrewingAdvice` in functions/index.js
- **Model**: gemini-2.5-flash (recently updated)
- **Prompts**: Comprehensive brewing-specific prompts in gemini-brewing-prompts.js
- **Frontend**: AIAssistant class with Markdown rendering

### AI Service Usage
```javascript
// Call from frontend
const result = await firebase.functions().httpsCallable('getAIBrewingAdvice')({
  prompt: 'Your brewing question here'
});

// Parse response with Markdown support
const formattedHTML = parseMarkdownToHtml(result.data.response);
```

## Code Conventions

### JavaScript
- ES6+ features (const/let, async/await, arrow functions)
- Modular function design (e.g., parseMarkdownToHtml utility)
- Firebase conventions for callable functions
- Comprehensive error handling with try-catch blocks

### CSS
- CSS custom properties for theming
- BEM-like naming conventions
- Mobile-first responsive design
- Component-based styling

### HTML
- Semantic HTML5 elements
- Accessible form labels and ARIA attributes
- Progressive enhancement approach
- SEO-friendly meta tags

## Testing Strategy

### Manual Testing
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Firebase Functions testing via emulator
- AI assistant functionality testing

### Automated Testing (Planned)
```bash
# Future implementation
cd functions && npm test
```

## Deployment Status

### Production Environment
- **Hosting**: Firebase Hosting (active)
- **Functions**: Successfully deployed to us-central1
- **Database**: Firestore in production mode
- **AI Service**: Vertex AI integration active

### Recent Deployment Issues Resolved
1. ✅ Firebase Functions parameter calling during deployment
2. ✅ Missing dependencies (@google-cloud/vertexai, neo4j-driver)
3. ✅ Lint script conflicts on Windows
4. ✅ Trailing comma in firebase.json

## Performance & Monitoring

### Current Monitoring
- Firebase Analytics (measurementId: G-MHT3H2ZVRY)
- Function execution logs in Firebase Console
- Real-time error tracking in dashboard

### Performance Optimizations
- Lazy loading of dashboard components
- Efficient Firestore queries with pagination
- Optimized image assets
- Markdown parsing performance improvements

## Security Implementation

### Current Security Measures
- Firebase Authentication with session persistence
- Firestore security rules for user data isolation
- Server-side AI function calls (no client-side API keys)
- Input validation and sanitization

### Security Considerations
- AI function currently callable without authentication (design choice)
- No sensitive data in client-side code
- Proper error message handling to prevent information leakage

## Common Issues & Solutions

### Firebase Functions
- **Node version**: Use Node 20 (currently configured)
- **Memory limits**: Default 256MB, monitored for AI calls
- **Timeout**: Default 60s, sufficient for current AI model
- **Parameter access**: Use .value() only at runtime, not deployment

### AI Service
- **Rate limits**: Gemini API rate limits managed with user feedback
- **Error handling**: Comprehensive try-catch blocks implemented
- **Cost management**: Monitor usage in Google Cloud Console
- **Markdown rendering**: Custom parseMarkdownToHtml function handles formatting

### Development Environment
- **Windows compatibility**: Removed problematic bash commands from predeploy
- **Cache busting**: Version parameters in script tags recommended
- **Local testing**: Firebase emulator suite for full stack testing

## Next Steps & Roadmap

### Short Term (Current Sprint)
1. Complete Neo4j integration testing
2. Implement batch comparison visualization
3. Add AI response caching for performance
4. Enhanced error boundaries for AI assistant

### Medium Term
1. Advanced analytics dashboard with Chart.js
2. AI-generated brewing recipes
3. Mobile app considerations
4. User onboarding flow improvements

### Long Term
1. Multi-brewery support
2. Public brewery directory
3. Advanced machine learning insights
4. Integration with brewing equipment APIs

## Support & Troubleshooting

### Debug Tools Available
- `window.db`, `window.currentUserId`, `window.firebase` exposed for console testing
- Comprehensive console logging throughout application
- Firebase debug logging enabled for Firestore operations

### Common Debug Commands
```javascript
// Test Firestore connection
window.db.collection('test').add({test: true})

// Check current user
window.firebase.auth().currentUser

// Test AI function
firebase.functions().httpsCallable('getAIBrewingAdvice')({prompt: 'test'})
```

---

**Last Updated**: January 2025
**Current Version**: Production-ready with AI enhancements
**Status**: ✅ Active Development
