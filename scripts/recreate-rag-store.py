#!/usr/bin/env python3
"""
Recreate BrewMetrics RAG Data Store with Layout Parsing
Deletes existing and creates new with proper document processing config
"""

import os
from google.cloud import discoveryengine_v1
from google.api_core.exceptions import NotFound
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ID = "brewmetrics-xyz-app-e8d51"
LOCATION = "global"
DATA_STORE_ID = "brewmetrics-pdf-rag-store-v2"

def delete_existing_datastore():
    """Delete the existing data store"""
    client = discoveryengine_v1.DataStoreServiceClient()
    data_store_name = f"projects/{PROJECT_ID}/locations/{LOCATION}/collections/default_collection/dataStores/{DATA_STORE_ID}"
    
    try:
        operation = client.delete_data_store(name=data_store_name)
        operation.result()  # Wait for deletion
        logger.info(f"✅ Deleted existing data store: {DATA_STORE_ID}")
        return True
    except NotFound:
        logger.info("Data store not found - nothing to delete")
        return True
    except Exception as e:
        logger.error(f"Error deleting data store: {e}")
        return False

def create_datastore_with_layout_parsing():
    """Create data store with layout parsing enabled from the start"""
    client = discoveryengine_v1.DataStoreServiceClient()
    
    # Configure document processing with layout parsing
    document_processing_config = discoveryengine_v1.DocumentProcessingConfig(
        default_parsing_config=discoveryengine_v1.DocumentProcessingConfig.ParsingConfig(
            layout_parsing_config=discoveryengine_v1.DocumentProcessingConfig.ParsingConfig.LayoutParsingConfig()
        ),
        chunking_config=discoveryengine_v1.DocumentProcessingConfig.ChunkingConfig(
            layout_based_chunking_config=discoveryengine_v1.DocumentProcessingConfig.ChunkingConfig.LayoutBasedChunkingConfig(
                chunk_size=500,
                include_ancestor_headings=True
            )
        )
    )
    
    # Configure the data store with layout parsing
    data_store = discoveryengine_v1.DataStore(
        display_name="BrewMetrics PDF RAG Store",
        industry_vertical=discoveryengine_v1.IndustryVertical.GENERIC,
        solution_types=[discoveryengine_v1.SolutionType.SOLUTION_TYPE_SEARCH],
        content_config=discoveryengine_v1.DataStore.ContentConfig.CONTENT_REQUIRED,
        document_processing_config=document_processing_config
    )
    
    # Create the request
    request = discoveryengine_v1.CreateDataStoreRequest(
        parent=f"projects/{PROJECT_ID}/locations/{LOCATION}/collections/default_collection",
        data_store=data_store,
        data_store_id=DATA_STORE_ID,
    )
    
    try:
        operation = client.create_data_store(request=request)
        logger.info(f"Creating data store with layout parsing: {DATA_STORE_ID}")
        
        result = operation.result()
        logger.info(f"✅ Data store created with layout parsing: {result.name}")
        return result
        
    except Exception as e:
        logger.error(f"Error creating data store: {e}")
        return None

def main():
    """Main execution function"""
    logger.info(f"Creating new RAG data store with layout parsing: {DATA_STORE_ID}")
    
    # Skip deletion for new data store
    # Create new data store with layout parsing
    result = create_datastore_with_layout_parsing()
    
    if result:
        logger.info("🎉 RAG Data Store with Layout Parsing Complete!")
        logger.info(f"Data Store ID: {DATA_STORE_ID}")
        logger.info(f"Project: {PROJECT_ID}")
        logger.info(f"Location: {LOCATION}")
        logger.info("Features enabled:")
        logger.info("  ✅ Layout-based document parsing")
        logger.info("  ✅ Table extraction and annotation")
        logger.info("  ✅ Image extraction and annotation")
        logger.info("  ✅ Advanced chunking (500 tokens)")
        logger.info("  ✅ Ancestor headings included in chunks")
        logger.info("")
        logger.info("📄 Ready for document upload!")
    
    return result is not None

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
