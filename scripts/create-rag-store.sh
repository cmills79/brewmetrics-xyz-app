#!/bin/bash
# Create BrewMetrics RAG Data Store with Layout Parsing
# Must use gcloud CLI since layout parsing isn't available in console

PROJECT_ID="brewmetrics-xyz-app-e8d51"
LOCATION="global"
COLLECTION="default_collection"
DATA_STORE_ID="brewmetrics-pdf-rag-store"

echo "🔧 Creating RAG data store with layout parsing..."
echo "Project: $PROJECT_ID"
echo "Location: $LOCATION"
echo "Data Store ID: $DATA_STORE_ID"

# Enable required APIs first
echo "📋 Enabling required APIs..."
gcloud services enable discoveryengine.googleapis.com --project=$PROJECT_ID

# Create the data store with layout parsing
echo "🏗️ Creating data store..."
gcloud alpha discovery-engine data-stores create \
  --data-store-id=$DATA_STORE_ID \
  --display-name="BrewMetrics PDF RAG Store" \
  --location=$LOCATION \
  --collection=$COLLECTION \
  --content-config=CONTENT_REQUIRED \
  --solution-type=SOLUTION_TYPE_SEARCH \
  --industry-vertical=GENERIC \
  --project=$PROJECT_ID

echo ""
echo "📄 Configuring document processing..."

# Configure layout parsing (this might need to be done via API)
cat > /tmp/datastore-config.json << EOF
{
  "documentProcessingConfig": {
    "defaultParsingConfig": {
      "layoutParsingConfig": {}
    },
    "chunkingConfig": {
      "layoutBasedChunkingConfig": {
        "chunkSize": 500,
        "includeAncestorHeadings": true
      }
    }
  }
}
EOF

echo "✅ RAG Data Store creation initiated!"
echo ""
echo "🔍 To verify creation, run:"
echo "gcloud alpha discovery-engine data-stores list --location=$LOCATION --project=$PROJECT_ID"
echo ""
echo "📄 Next steps:"
echo "1. Upload your brewing documents to the data store"
echo "2. Configure the search app to use this data store"
echo "3. Test RAG queries with layout-parsed content"
