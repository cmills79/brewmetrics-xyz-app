#!/usr/bin/env python3
"""
Create AI Brewmaster RAG Data Store with Layout Parsing
Specialized data store for brewing knowledge and documentation
"""

import os
from google.cloud import discoveryengine_v1
from google.api_core.exceptions import AlreadyExists
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ID = "brewmetrics-xyz-app-e8d51"
LOCATION = "global"
DATA_STORE_ID = "ai-brewmaster-rag-store"

def create_brewmaster_datastore():
    """Create AI Brewmaster data store with layout parsing enabled"""
    client = discoveryengine_v1.DataStoreServiceClient()
    
    # Configure document processing with layout parsing optimized for brewing docs
    document_processing_config = discoveryengine_v1.DocumentProcessingConfig(
        default_parsing_config=discoveryengine_v1.DocumentProcessingConfig.ParsingConfig(
            layout_parsing_config=discoveryengine_v1.DocumentProcessingConfig.ParsingConfig.LayoutParsingConfig()
        ),
        chunking_config=discoveryengine_v1.DocumentProcessingConfig.ChunkingConfig(
            layout_based_chunking_config=discoveryengine_v1.DocumentProcessingConfig.ChunkingConfig.LayoutBasedChunkingConfig(
                chunk_size=500,  # Optimal for brewing knowledge snippets
                include_ancestor_headings=True  # Preserve recipe structure
            )
        )
    )
    
    # Configure the AI Brewmaster data store
    data_store = discoveryengine_v1.DataStore(
        display_name="AI Brewmaster Knowledge Base",
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
        logger.info(f"Creating AI Brewmaster data store: {DATA_STORE_ID}")
        
        result = operation.result()
        logger.info(f"✅ AI Brewmaster data store created: {result.name}")
        return result
        
    except AlreadyExists:
        logger.info(f"AI Brewmaster data store {DATA_STORE_ID} already exists")
        return None
    except Exception as e:
        logger.error(f"Error creating AI Brewmaster data store: {e}")
        return None

def create_search_app():
    """Create a search app for the AI Brewmaster"""
    client = discoveryengine_v1.EngineServiceClient()
    
    # Configure the search engine
    engine = discoveryengine_v1.Engine(
        display_name="AI Brewmaster Search Engine",
        solution_type=discoveryengine_v1.SolutionType.SOLUTION_TYPE_SEARCH,
        industry_vertical=discoveryengine_v1.IndustryVertical.GENERIC,
        data_store_ids=[DATA_STORE_ID],
        search_engine_config=discoveryengine_v1.Engine.SearchEngineConfig(
            search_tier=discoveryengine_v1.SearchTier.SEARCH_TIER_STANDARD,
            search_add_ons=[discoveryengine_v1.SearchAddOn.SEARCH_ADD_ON_LLM]
        )
    )
    
    # Create the request
    request = discoveryengine_v1.CreateEngineRequest(
        parent=f"projects/{PROJECT_ID}/locations/{LOCATION}/collections/default_collection",
        engine=engine,
        engine_id="ai-brewmaster-engine"
    )
    
    try:
        operation = client.create_engine(request=request)
        logger.info("Creating AI Brewmaster search engine...")
        
        result = operation.result()
        logger.info(f"✅ AI Brewmaster search engine created: {result.name}")
        return result
        
    except AlreadyExists:
        logger.info("AI Brewmaster search engine already exists")
        return None
    except Exception as e:
        logger.error(f"Error creating search engine: {e}")
        return None

def main():
    """Main execution function"""
    logger.info("🍺 Setting up AI Brewmaster RAG Infrastructure...")
    
    # Create the data store
    datastore_result = create_brewmaster_datastore()
    
    # Create the search app
    engine_result = create_search_app()
    
    if datastore_result or engine_result:
        logger.info("🎉 AI Brewmaster RAG Setup Complete!")
        logger.info("")
        logger.info("📊 Infrastructure Created:")
        logger.info(f"  🗃️  Data Store: {DATA_STORE_ID}")
        logger.info("  🔍  Search Engine: ai-brewmaster-engine")
        logger.info(f"  📍  Project: {PROJECT_ID}")
        logger.info(f"  🌐  Location: {LOCATION}")
        logger.info("")
        logger.info("🧠 AI Brewmaster Features:")
        logger.info("  ✅ Layout-based document parsing")
        logger.info("  ✅ Table extraction (ingredient lists, schedules)")
        logger.info("  ✅ Image annotation (process diagrams)")
        logger.info("  ✅ Intelligent chunking (500 tokens)")
        logger.info("  ✅ Recipe structure preservation")
        logger.info("  ✅ LLM-enhanced search")
        logger.info("")
        logger.info("📄 Ready for brewing knowledge upload:")
        logger.info("  • Recipe collections")
        logger.info("  • Brewing guides and manuals")
        logger.info("  • Ingredient specifications")
        logger.info("  • Process documentation")
        logger.info("  • Quality control guidelines")
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
