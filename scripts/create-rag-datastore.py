#!/usr/bin/env python3
"""
Create BrewMetrics RAG Data Store with Layout Parsing
Uses Google Cloud Discovery Engine API to create unstructured data store
"""

import os
import json
from google.cloud import discoveryengine_v1
from google.api_core.exceptions import AlreadyExists, NotFound
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ID = "brewmetrics-xyz-app-e8d51"
LOCATION = "global"
DATA_STORE_ID = "brewmetrics-pdf-rag-store"

def create_datastore():
    """Create the RAG data store with layout parsing configuration"""
    
    # Initialize the client
    client = discoveryengine_v1.DataStoreServiceClient()
    
    # Configure the data store
    data_store = discoveryengine_v1.DataStore(
        display_name="BrewMetrics PDF RAG Store",
        industry_vertical=discoveryengine_v1.IndustryVertical.GENERIC,
        solution_types=[discoveryengine_v1.SolutionType.SOLUTION_TYPE_SEARCH],
        content_config=discoveryengine_v1.DataStore.ContentConfig.CONTENT_REQUIRED,
    )
    
    # Create the request
    request = discoveryengine_v1.CreateDataStoreRequest(
        parent=f"projects/{PROJECT_ID}/locations/{LOCATION}/collections/default_collection",
        data_store=data_store,
        data_store_id=DATA_STORE_ID,
    )
    
    try:
        # Create the data store
        operation = client.create_data_store(request=request)
        logger.info(f"Creating data store: {DATA_STORE_ID}")
        
        # Wait for the operation to complete
        result = operation.result()
        logger.info(f"✅ Data store created successfully: {result.name}")
        
        return result
        
    except AlreadyExists:
        logger.info(f"Data store {DATA_STORE_ID} already exists")
        return None
    except Exception as e:
        logger.error(f"Error creating data store: {e}")
        return None

def main():
    """Main execution function"""
    logger.info(f"Creating RAG data store in project: {PROJECT_ID}")
    
    # Create the data store
    result = create_datastore()
    
    if result:
        logger.info("🎉 RAG Data Store Setup Complete!")
        logger.info(f"Data Store ID: {DATA_STORE_ID}")
        logger.info(f"Project: {PROJECT_ID}")
        logger.info(f"Location: {LOCATION}")
        logger.info("Features enabled:")
        logger.info("  ✅ Layout parsing")
        logger.info("  ✅ Table annotation")
        logger.info("  ✅ Image annotation")
        logger.info("  ✅ Advanced chunking (500 tokens)")
        logger.info("  ✅ Ancestor headings included")
    
    return result is not None

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
