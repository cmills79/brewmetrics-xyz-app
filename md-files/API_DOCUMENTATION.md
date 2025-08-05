# BrewMetrics API Documentation

## Overview

The BrewMetrics API provides analytics and AI-powered insights for brewery operations. It consists of two main services:

- **Analytics API**: Data analytics and reporting endpoints
- **AI Functions**: Firebase Cloud Functions for brewing advice

## Base URLs

- **Analytics API**: `https://brewmetrics-analytics-{hash}-uc.a.run.app`
- **Firebase Functions**: `https://us-central1-brewmetrics-xyz-app-e8d51.cloudfunctions.net`

## Authentication

Firebase Authentication is required for all AI function calls. Analytics API uses brewery-based access control.

---

## Analytics API Endpoints

### Health Check

**GET** `/health`

Check if the analytics service is running and connected to BigQuery.

```bash
curl -X GET https://brewmetrics-analytics-{hash}-uc.a.run.app/health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "brewmetrics-analytics",
  "timestamp": "2024-01-15T10:30:00Z",
  "bigquery_connected": true
}
```

### Recipe Analytics

**POST** `/recipe-analytics`

Get detailed analytics for a specific beer recipe including ratings, taste profile, and performance metrics.

**Request Body:**

```json
{
  "recipe_name": "Hazy Dayz IPA",
  "brewery_id": "brewery_123"  // optional
}
```

**Example:**

```bash
curl -X POST https://brewmetrics-analytics-{hash}-uc.a.run.app/recipe-analytics \
  -H "Content-Type: application/json" \
  -d '{
    "recipe_name": "Hazy Dayz IPA",
    "brewery_id": "brewery_123"
  }'
```

**Response:**

```json
{
  "recipe": {
    "recipe_name": "Hazy Dayz IPA",
    "beer_style": "New England IPA",
    "average_rating": 4.2,
    "median_rating": 4.0,
    "rating_count": 45,
    "avg_sweetness": 3.1,
    "avg_acidity": 2.8,
    "avg_bitterness": 3.5,
    "avg_body": 3.8,
    "avg_carbonation": 3.2,
    "avg_malt_flavors": 3.0,
    "avg_hop_flavors": 4.1,
    "avg_finish": 3.7,
    "high_ratings_count": 32,
    "low_ratings_count": 3,
    "google_reviews_generated": 12,
    "last_feedback_date": "2024-01-10",
    "batch_active": true
  },
  "query_timestamp": "2024-01-15T10:30:00Z"
}
```

### Brewery Summary

**POST** `/brewery-summary`

Get overall performance metrics for a brewery including total ratings, active batches, and top recipes.

**Request Body:**

```json
{
  "brewery_id": "brewery_123"
}
```

**Response:**

```json
{
  "brewery_summary": {
    "brewery_name": "Craft Beer Co",
    "total_feedback_count": 250,
    "average_rating": 4.1,
    "active_batches_count": 8,
    "total_batches_count": 15,
    "google_reviews_generated": 45,
    "top_recipe_name": "Golden Wheat",
    "top_recipe_rating": 4.5,
    "recent_feedback_count": 28,
    "recent_average_rating": 4.3
  },
  "query_timestamp": "2024-01-15T10:30:00Z"
}
```

### Top Recipes

**POST** `/top-recipes`

Get the highest-rated recipes, optionally filtered by brewery or beer style.

**Request Body (all optional):**

```json
{
  "brewery_id": "brewery_123",
  "beer_style": "IPA",
  "limit": 10
}
```

**Response:**

```json
{
  "top_recipes": [
    {
      "recipe_name": "Golden Wheat",
      "beer_style": "Wheat Beer",
      "average_rating": 4.5,
      "rating_count": 67,
      "brewery_id": "brewery_123",
      "high_ratings_count": 58,
      "last_feedback_date": "2024-01-12"
    }
  ],
  "total_count": 1,
  "filters": {
    "brewery_id": "brewery_123",
    "beer_style": "all",
    "limit": 10
  },
  "query_timestamp": "2024-01-15T10:30:00Z"
}
```

### Taste Profile Analysis

**POST** `/taste-profile-analysis`

Analyze detailed taste characteristics for recipes. Requires either `recipe_name` or `brewery_id`.

**Request Body:**

```json
{
  "recipe_name": "Hazy Dayz IPA",
  "brewery_id": "brewery_123"  // alternative to recipe_name
}
```

**Response:**

```json
{
  "taste_profiles": [
    {
      "recipe_name": "Hazy Dayz IPA",
      "beer_style": "New England IPA",
      "avg_sweetness": 3.1,
      "avg_acidity": 2.8,
      "avg_bitterness": 3.5,
      "avg_body": 3.8,
      "avg_carbonation": 3.2,
      "avg_malt_flavors": 3.0,
      "avg_hop_flavors": 4.1,
      "avg_finish": 3.7,
      "average_rating": 4.2,
      "rating_count": 45
    }
  ],
  "analysis_summary": {
    "total_recipes": 1,
    "filters_applied": {
      "recipe_name": "Hazy Dayz IPA",
      "brewery_id": ""
    }
  },
  "query_timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Firebase Cloud Functions

### AI Brewing Advice

**Function Name:** `getAIBrewingAdvice`

Get AI-powered brewing advice and recommendations.

**Authentication:** Required (Firebase Auth)

**Rate Limit:** 10 requests per minute per user

**Parameters:**

```javascript
{
  prompt: "How do I improve the hop flavor in my IPA?"
}
```

**JavaScript Example:**

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getAIBrewingAdvice = httpsCallable(functions, 'getAIBrewingAdvice');

try {
  const result = await getAIBrewingAdvice({
    prompt: "How do I improve the hop flavor in my IPA?"
  });
  console.log(result.data.response);
} catch (error) {
  console.error('Error:', error.message);
}
```

**Response:**

```json
{
  "response": "To improve hop flavor in your IPA, consider these techniques: 1) Late hop additions during the last 10-15 minutes of boil, 2) Dry hopping during fermentation, 3) Using hop varieties known for flavor like Citra, Mosaic, or Amarillo..."
}
```

---

## Error Handling

### HTTP Status Codes

- **200**: Success
- **400**: Bad Request - Invalid parameters
- **403**: Forbidden - Access denied
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error description"
}
```

---

## Data Models

### Taste Profile Scale

All taste characteristics are rated on a scale of 1-5:

- **1**: Very Low/Light
- **2**: Low/Mild  
- **3**: Moderate/Balanced
- **4**: High/Strong
- **5**: Very High/Intense

### Rating System

- Ratings are on a 1-5 star scale
- `high_ratings_count`: Ratings ≥ 4 stars
- `low_ratings_count`: Ratings ≤ 2 stars

---

## Usage Examples

### Get Recipe Performance

```bash
# Check how your "Summer Wheat" is performing
curl -X POST https://brewmetrics-analytics-{hash}-uc.a.run.app/recipe-analytics \
  -H "Content-Type: application/json" \
  -d '{"recipe_name": "Summer Wheat"}'
```

### Find Top Performing IPAs

```bash
# Get top 5 IPA recipes
curl -X POST https://brewmetrics-analytics-{hash}-uc.a.run.app/top-recipes \
  -H "Content-Type: application/json" \
  -d '{"beer_style": "IPA", "limit": 5}'
```

### Analyze Brewery Performance

```bash
# Get overall brewery metrics
curl -X POST https://brewmetrics-analytics-{hash}-uc.a.run.app/brewery-summary \
  -H "Content-Type: application/json" \
  -d '{"brewery_id": "your_brewery_id"}'
```

---

## Integration Notes

1. **Analytics API** is deployed on Google Cloud Run and connects to BigQuery for data
2. **AI Functions** use Vertex AI (Gemini 2.5 Pro) for brewing advice
3. All endpoints return JSON responses
4. Timestamps are in ISO 8601 format (UTC)
5. The analytics API requires brewery access validation
6. AI functions require Firebase Authentication

For technical support, contact: <support@brewmetrics.xyz>
