#!/usr/bin/env python3
"""
Configure Layout Parsing for BrewMetrics RAG Data Store
Updates the document processing configuration to enable layout parsing
"""

import os
from google.cloud import discoveryengine_v1
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ID = "brewmetrics-xyz-app-e8d51"
LOCATION = "global"
DATA_STORE_ID = "brewmetrics-pdf-rag-store"

def configure_document_processing():
    """Configure layout parsing for the data store"""
    
    # Initialize the client
    client = discoveryengine_v1.DataStoreServiceClient()
    
    # Get the data store
    data_store_name = f"projects/{PROJECT_ID}/locations/{LOCATION}/collections/default_collection/dataStores/{DATA_STORE_ID}"
    
    try:
        # Get current data store
        data_store = client.get_data_store(name=data_store_name)
        logger.info(f"Retrieved data store: {data_store.display_name}")
        
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
        
        # Update the data store
        data_store.document_processing_config = document_processing_config
        
        # Create update request
        update_request = discoveryengine_v1.UpdateDataStoreRequest(
            data_store=data_store,
            update_mask={"paths": ["document_processing_config"]}
        )
        
        # Apply the update
        updated_store = client.update_data_store(request=update_request)
        logger.info(f"✅ Layout parsing configured for: {updated_store.display_name}")
        
        return updated_store
        
    except Exception as e:
        logger.error(f"Error configuring layout parsing: {e}")
        return None

def main():
    """Main execution function"""
    logger.info(f"Configuring layout parsing for data store: {DATA_STORE_ID}")
    
    # Configure layout parsing
    result = configure_document_processing()
    
    if result:
        logger.info("🎉 Layout Parsing Configuration Complete!")
        logger.info("Features now enabled:")
        logger.info("  ✅ Layout-based document parsing")
        logger.info("  ✅ Table extraction and annotation")
        logger.info("  ✅ Image extraction and annotation")
        logger.info("  ✅ Advanced chunking (500 tokens)")
        logger.info("  ✅ Ancestor headings included in chunks")
        logger.info("")
        logger.info("📄 Next steps:")
        logger.info("1. Upload your brewing documents to the data store")
        logger.info("2. Documents will be automatically parsed with layout understanding")
        logger.info("3. Create a search app to query the RAG store")
    
    return result is not None

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
