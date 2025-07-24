# BrewMetrics Developer Guide

## Architecture Overview

BrewMetrics is a cloud-native brewery analytics platform built on Google Cloud Platform with a microservices architecture.

### System Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Firebase       │    │   Analytics     │
│   (Static Web)  │◄──►│   Functions      │◄──►│   API           │
│                 │    │   (Node.js)      │    │   (Python)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌──────────────────┐    ┌─────────────────┐
         │              │   Firestore      │    │   BigQuery      │
         └─────────────►│   (NoSQL DB)     │    │   (Data Warehouse)│
                        └──────────────────┘    └─────────────────┘
                                 │                       ▲
                                 └───────────────────────┘
                                    Data Pipeline
```

### Technology Stack

- **Frontend**: Vanilla JavaScript, Firebase Hosting
- **Backend**: Firebase Functions (Node.js), Cloud Run (Python Flask)
- **Database**: Firestore (operational), BigQuery (analytics)
- **AI/ML**: Vertex AI (Gemini 2.5 Flash)
- **Infrastructure**: Google Cloud Platform

---

## Core Services

### 1. Frontend Application

**Location**: `/public/`
**Hosting**: Firebase Hosting
**Key Files**:
- `index.html` - Main landing page
- `patron_survey.html` - Customer feedback form
- `dashboard.html` - Analytics dashboard
- `recipe-designer.html` - Recipe creation tool

**Architecture Pattern**: Single Page Application (SPA) with vanilla JavaScript modules

### 2. Firebase Functions

**Location**: `/functions/`
**Runtime**: Node.js 18
**Key Functions**:

#### AI Brewing Advice (`getAIBrewingAdvice`)
```javascript
// Rate-limited AI consultation service
exports.getAIBrewingAdvice = functions.https.onCall(async (data, context) => {
  // Authentication + rate limiting (10 req/min)
  // Vertex AI integration with Gemini 2.5 Flash
  // Structured brewing expertise prompts
});
```

#### Data Pipeline (`syncSurveyToBigQuery`)
```javascript
// Firestore trigger → BigQuery sync
exports.syncSurveyToBigQuery = functions.firestore
  .document("survey_responses/{responseId}")
  .onCreate(async (snap, context) => {
    // Transform survey data
    // Insert to BigQuery
    // Trigger analytics aggregation
  });
```

### 3. Analytics API

**Location**: `/analytics/`
**Runtime**: Python Flask on Cloud Run
**Database**: BigQuery
**Key Endpoints**:
- `/recipe-analytics` - Recipe performance metrics
- `/brewery-summary` - Brewery-wide statistics
- `/top-recipes` - Ranking and comparison
- `/taste-profile-analysis` - Sensory data analysis

---

## Data Architecture

### Data Flow

1. **Collection**: Customer surveys via web forms
2. **Storage**: Firestore for operational data
3. **Pipeline**: Cloud Functions transform and sync to BigQuery
4. **Analytics**: Aggregated views and real-time queries
5. **AI Integration**: Analytics API feeds AI agent context

### BigQuery Schema

#### Core Tables

**user_feedback** - Individual survey responses
```sql
CREATE TABLE user_feedback (
  feedback_id STRING NOT NULL,
  brewery_id STRING NOT NULL,
  batch_id STRING,
  rating_score FLOAT64,
  sweetness_rating INT64,  -- 1-5 scale
  acidity_rating INT64,
  bitterness_rating INT64,
  -- ... other taste metrics
  created_at TIMESTAMP NOT NULL
)
PARTITION BY DATE(created_at)
CLUSTER BY brewery_id, batch_id;
```

**recipe_analytics** - Aggregated recipe performance
```sql
CREATE TABLE recipe_analytics (
  recipe_id STRING NOT NULL,
  brewery_id STRING NOT NULL,
  recipe_name STRING NOT NULL,
  average_rating FLOAT64,
  rating_count INT64,
  avg_sweetness FLOAT64,
  -- ... aggregated taste profiles
  high_ratings_count INT64,  -- >= 4 stars
  low_ratings_count INT64,   -- <= 2 stars
  last_updated TIMESTAMP NOT NULL
);
```

**brewery_summary** - Brewery-level KPIs
```sql
CREATE TABLE brewery_summary (
  brewery_id STRING NOT NULL,
  brewery_name STRING NOT NULL,
  total_feedback_count INT64,
  average_rating FLOAT64,
  active_batches_count INT64,
  top_recipe_name STRING,
  recent_average_rating FLOAT64  -- Last 30 days
);
```

### Data Pipeline Implementation

**Real-time Sync**: Firestore triggers automatically sync survey responses to BigQuery
```javascript
// Triggered on new survey submission
.onCreate(async (snap, context) => {
  const surveyData = snap.data();
  
  // Transform to BigQuery schema
  const bqRow = {
    feedback_id: context.params.responseId,
    brewery_id: surveyData.breweryId,
    rating_score: surveyData.overallRating,
    sweetness_rating: surveyData.responses?.sweetness,
    // ... map all survey fields
    created_at: new Date()
  };
  
  // Insert to BigQuery
  await bigquery.dataset('brewmetrics_data')
    .table('user_feedback')
    .insert([bqRow]);
    
  // Update aggregated analytics
  await updateRecipeAnalytics(surveyData.batchId);
});
```

**Aggregation Logic**: MERGE statements update recipe and brewery analytics
```sql
-- Real-time recipe analytics update
MERGE recipe_analytics AS target
USING (
  SELECT 
    batch_id,
    AVG(rating_score) as average_rating,
    COUNT(*) as rating_count,
    AVG(sweetness_rating) as avg_sweetness,
    SUM(CASE WHEN rating_score >= 4 THEN 1 ELSE 0 END) as high_ratings_count
  FROM user_feedback 
  WHERE batch_id = @batch_id
  GROUP BY batch_id
) AS source
ON target.recipe_id = source.batch_id
WHEN MATCHED THEN UPDATE SET ...
WHEN NOT MATCHED THEN INSERT ...
```

---

## AI Integration

### Vertex AI Configuration

**Model**: Gemini 2.5 Flash
**Location**: us-central1
**Authentication**: Service Account with Vertex AI permissions

```javascript
const vertexAi = new VertexAI({
  project: PROJECT_ID,
  location: 'us-central1'
});

const model = vertexAi.getGenerativeModel({
  model: 'gemini-2.5-flash'
});
```

### AI Agent Architecture

**System Prompt**: Specialized brewing expertise
```javascript
const systemPrompt = `You are the AI Master Brewer, an expert brewing consultant 
with decades of experience. You provide helpful, accurate, and practical brewing 
advice. When discussing specific techniques, ingredients, or processes, provide 
concrete details and actionable guidance.`;
```

**Rate Limiting**: In-memory store (production should use Redis/Firestore)
- 10 requests per minute per authenticated user
- Sliding window implementation

**Analytics Integration**: AI agent can query analytics API for data-driven advice
```javascript
// AI agent can access brewery performance data
const analyticsResponse = await fetch('/recipe-analytics', {
  method: 'POST',
  body: JSON.stringify({ recipe_name: 'Hazy IPA' })
});
```

---

## Deployment Architecture

### Cloud Run (Analytics API)

**Configuration**:
```dockerfile
FROM python:3.9-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
```

**Environment Variables**:
- `GCP_PROJECT`: Project ID
- `PORT`: Container port (8080)
- BigQuery authentication via service account

**Scaling**: 
- Min instances: 0 (cost optimization)
- Max instances: 10
- Concurrency: 80 requests per instance

### Firebase Functions

**Configuration**:
```json
{
  "functions": [{
    "source": "functions",
    "codebase": "default",
    "ignore": ["node_modules", ".git"]
  }]
}
```

**Memory/Timeout**:
- AI Functions: 512MB, 60s timeout
- Data Pipeline: 256MB, 30s timeout

### Firebase Hosting

**Static Site Configuration**:
```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {"source": "/patron_survey", "destination": "/patron_survey.html"},
      {"source": "**", "destination": "/index.html"}
    ]
  }
}
```

---

## Security Implementation

### Authentication

**Firebase Auth**: Email/password and anonymous authentication
```javascript
// Anonymous auth for survey submissions
await signInAnonymously(auth);

// Persistent auth for brewery dashboards
await signInWithEmailAndPassword(auth, email, password);
```

### Authorization

**Brewery Access Control**: 
```python
def validate_brewery_access(brewery_id, user_claims=None):
    # Implement role-based access control
    # Check user permissions for brewery data
    return True  # Simplified for demo
```

**Function Security**:
```javascript
// All AI functions require authentication
if (!context.auth) {
  throw new functions.https.HttpsError('unauthenticated', 
    'User must be authenticated');
}
```

### Data Privacy

- **PII Handling**: Survey responses are anonymized
- **Access Logging**: All BigQuery queries are logged
- **Rate Limiting**: Prevents abuse of AI endpoints

---

## Development Setup

### Prerequisites
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Authenticate
firebase login
gcloud auth login
```

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd brewmetrics-xyz-app

# Install dependencies
cd functions && npm install

# Install Python dependencies
cd ../analytics && pip install -r requirements.txt

# Start local emulators
firebase emulators:start

# Deploy functions
firebase deploy --only functions

# Deploy analytics API
cd analytics && gcloud run deploy
```

### Environment Configuration
```bash
# Set Firebase project
firebase use brewmetrics-xyz-app-e8d51

# Configure environment variables
firebase functions:config:set vertex.project_id="brewmetrics-xyz-app-e8d51"
firebase functions:config:set vertex.location="us-central1"
```

---

## Monitoring & Observability

### Logging Strategy

**Structured Logging**:
```javascript
functions.logger.info("Survey response processed", {
  responseId,
  breweryId,
  batchId,
  processingTimeMs: Date.now() - startTime
});
```

**Error Tracking**:
```python
logger.error(f"BigQuery query failed: {str(e)}", extra={
  'query': query,
  'parameters': params,
  'error_type': type(e).__name__
})
```

### Performance Monitoring

**Key Metrics**:
- API response times (Analytics API)
- Function execution duration (Firebase Functions)
- BigQuery query performance
- AI model response times

**Alerting**:
- Error rate > 5%
- Response time > 2s
- BigQuery quota exceeded

---

## Testing Strategy

### Unit Tests
```javascript
// Firebase Functions testing
const test = require('firebase-functions-test')();
const myFunctions = require('../index');

describe('getAIBrewingAdvice', () => {
  it('should return brewing advice', async () => {
    const data = { prompt: 'How to brew IPA?' };
    const context = { auth: { uid: 'test-user' } };
    
    const result = await myFunctions.getAIBrewingAdvice(data, context);
    expect(result.response).toBeDefined();
  });
});
```

### Integration Tests
```python
# Analytics API testing
import pytest
from app import app

@pytest.fixture
def client():
    return app.test_client()

def test_recipe_analytics(client):
    response = client.post('/recipe-analytics', 
      json={'recipe_name': 'Test IPA'})
    assert response.status_code == 200
```

### Load Testing
```bash
# Artillery.js for API load testing
artillery quick --count 10 --num 100 \
  https://brewmetrics-analytics-{hash}-uc.a.run.app/health
```

---

## Performance Optimization

### BigQuery Optimization

**Partitioning**: Tables partitioned by date for cost efficiency
**Clustering**: Clustered by brewery_id and batch_id for query performance
**Query Optimization**: Use parameterized queries and avoid SELECT *

### Caching Strategy

**Analytics API**: Implement Redis caching for frequently accessed data
**Frontend**: Static asset caching via Firebase Hosting CDN
**BigQuery**: Use materialized views for complex aggregations

### Cost Optimization

**Cloud Run**: Scale to zero when not in use
**BigQuery**: Partition pruning and query optimization
**Firebase Functions**: Right-size memory allocation

---

## Troubleshooting Guide

### Common Issues

**BigQuery Connection Errors**:
```python
# Check service account permissions
# Verify dataset exists
# Check query syntax and parameters
```

**Firebase Function Timeouts**:
```javascript
// Increase timeout in firebase.json
// Optimize async operations
// Add proper error handling
```

**Analytics API 500 Errors**:
```python
# Check BigQuery client initialization
# Verify environment variables
# Review application logs
```

### Debug Commands
```bash
# View function logs
firebase functions:log

# Check Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision"

# BigQuery job monitoring
bq ls -j --max_results=10
```

---

## Contributing Guidelines

### Code Standards
- **Python**: PEP 8, type hints, docstrings
- **JavaScript**: ESLint configuration, async/await patterns
- **SQL**: Consistent formatting, parameterized queries

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/new-analytics-endpoint
git commit -m "feat: add taste profile comparison endpoint"
git push origin feature/new-analytics-endpoint
# Create pull request
```

### Deployment Process
1. **Development**: Local testing with emulators
2. **Staging**: Deploy to staging environment
3. **Testing**: Run integration tests
4. **Production**: Deploy with monitoring

For technical questions, contact: support@brewmetrics.xyz