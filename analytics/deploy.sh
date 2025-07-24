#!/bin/bash
# Deployment script for BrewMetrics Analytics Service

set -e

PROJECT_ID="brewmetrics-xyz-app-e8d51"
SERVICE_NAME="brewmetrics-analytics"
REGION="us-central1"

echo "🚀 Deploying BrewMetrics Analytics Service to Cloud Run..."

# Build and deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --source . \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --service-account=brewmetrics-agent-sa@$PROJECT_ID.iam.gserviceaccount.com \
    --set-env-vars="GCP_PROJECT=$PROJECT_ID" \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=60 \
    --port=8080

echo "✅ Analytics service deployed successfully!"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
echo "📡 Service URL: $SERVICE_URL"

# Test the health endpoint
echo "🔍 Testing health endpoint..."
curl -f "$SERVICE_URL/health" || echo "⚠️  Health check failed"

echo "🎉 Deployment complete!"
echo "💡 Update your OpenAPI spec with the service URL: $SERVICE_URL"
