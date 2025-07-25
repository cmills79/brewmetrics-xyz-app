#!/usr/bin/env python3
"""
Setup BigQuery dataset and tables for BrewMetrics
Creates the complete analytics infrastructure in the correct GCP project
"""

import os
from google.cloud import bigquery
from google.cloud.exceptions import Conflict, NotFound
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ID = "brewmetrics-xyz-app-e8d51"
DATASET_ID = "brewmetrics_data"
LOCATION = "us-central1"

def create_bigquery_client():
    """Initialize BigQuery client"""
    try:
        client = bigquery.Client(project=PROJECT_ID)
        logger.info(f"BigQuery client initialized for project: {PROJECT_ID}")
        return client
    except Exception as e:
        logger.error(f"Failed to initialize BigQuery client: {e}")
        return None

def create_dataset(client):
    """Create the brewmetrics_data dataset"""
    dataset_id = f"{PROJECT_ID}.{DATASET_ID}"
    
    try:
        # Check if dataset exists
        client.get_dataset(dataset_id)
        logger.info(f"Dataset {dataset_id} already exists")
        return True
    except NotFound:
        # Create dataset
        dataset = bigquery.Dataset(dataset_id)
        dataset.location = LOCATION
        dataset.description = "BrewMetrics analytics data for AI agent insights"
        
        try:
            client.create_dataset(dataset, timeout=30)
            logger.info(f"Created dataset {dataset_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to create dataset: {e}")
            return False

def create_user_feedback_table(client):
    """Create user_feedback table"""
    table_id = f"{PROJECT_ID}.{DATASET_ID}.user_feedback"
    
    schema = [
        bigquery.SchemaField("feedback_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("brewery_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("batch_id", "STRING"),
        bigquery.SchemaField("recipe_id", "STRING"),
        bigquery.SchemaField("user_id", "STRING"),
        bigquery.SchemaField("rating_score", "FLOAT64"),
        bigquery.SchemaField("feedback_text", "STRING"),
        
        # Survey ratings
        bigquery.SchemaField("sweetness_rating", "INT64"),
        bigquery.SchemaField("acidity_rating", "INT64"),
        bigquery.SchemaField("bitterness_rating", "INT64"),
        bigquery.SchemaField("body_rating", "INT64"),
        bigquery.SchemaField("carbonation_rating", "INT64"),
        bigquery.SchemaField("malt_flavors_rating", "INT64"),
        bigquery.SchemaField("hop_flavors_rating", "INT64"),
        bigquery.SchemaField("finish_rating", "INT64"),
        
        # Metadata
        bigquery.SchemaField("survey_version", "STRING"),
        bigquery.SchemaField("response_time_seconds", "INT64"),
        bigquery.SchemaField("created_at", "TIMESTAMP", mode="REQUIRED"),
        bigquery.SchemaField("updated_at", "TIMESTAMP"),
    ]
    
    return create_table_with_schema(client, table_id, schema, 
                                  partition_field="created_at",
                                  cluster_fields=["brewery_id", "batch_id"])

def create_recipe_analytics_table(client):
    """Create recipe_analytics table"""
    table_id = f"{PROJECT_ID}.{DATASET_ID}.recipe_analytics"
    
    schema = [
        bigquery.SchemaField("recipe_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("brewery_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("batch_id", "STRING"),
        bigquery.SchemaField("recipe_name", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("beer_style", "STRING"),
        
        # Aggregated ratings
        bigquery.SchemaField("average_rating", "FLOAT64"),
        bigquery.SchemaField("median_rating", "FLOAT64"),
        bigquery.SchemaField("rating_count", "INT64"),
        
        # Taste profile averages
        bigquery.SchemaField("avg_sweetness", "FLOAT64"),
        bigquery.SchemaField("avg_acidity", "FLOAT64"),
        bigquery.SchemaField("avg_bitterness", "FLOAT64"),
        bigquery.SchemaField("avg_body", "FLOAT64"),
        bigquery.SchemaField("avg_carbonation", "FLOAT64"),
        bigquery.SchemaField("avg_malt_flavors", "FLOAT64"),
        bigquery.SchemaField("avg_hop_flavors", "FLOAT64"),
        bigquery.SchemaField("avg_finish", "FLOAT64"),
        
        # Performance metrics
        bigquery.SchemaField("high_ratings_count", "INT64"),
        bigquery.SchemaField("low_ratings_count", "INT64"),
        bigquery.SchemaField("google_reviews_generated", "INT64"),
        
        # Temporal data
        bigquery.SchemaField("first_feedback_date", "DATE"),
        bigquery.SchemaField("last_feedback_date", "DATE"),
        bigquery.SchemaField("last_updated", "TIMESTAMP", mode="REQUIRED"),
        
        # Recipe metadata
        bigquery.SchemaField("batch_active", "BOOLEAN"),
        bigquery.SchemaField("created_at", "TIMESTAMP", mode="REQUIRED"),
    ]
    
    return create_table_with_schema(client, table_id, schema,
                                  partition_field="created_at",
                                  cluster_fields=["brewery_id", "beer_style"])

def create_brewery_summary_table(client):
    """Create brewery_summary table"""
    table_id = f"{PROJECT_ID}.{DATASET_ID}.brewery_summary"
    
    schema = [
        bigquery.SchemaField("brewery_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("brewery_name", "STRING", mode="REQUIRED"),
        
        # Overall metrics
        bigquery.SchemaField("total_feedback_count", "INT64"),
        bigquery.SchemaField("average_rating", "FLOAT64"),
        bigquery.SchemaField("active_batches_count", "INT64"),
        bigquery.SchemaField("total_batches_count", "INT64"),
        bigquery.SchemaField("google_reviews_generated", "INT64"),
        
        # Top recipes
        bigquery.SchemaField("top_recipe_id", "STRING"),
        bigquery.SchemaField("top_recipe_name", "STRING"),
        bigquery.SchemaField("top_recipe_rating", "FLOAT64"),
        
        # Recent performance
        bigquery.SchemaField("recent_feedback_count", "INT64"),
        bigquery.SchemaField("recent_average_rating", "FLOAT64"),
        
        bigquery.SchemaField("last_updated", "TIMESTAMP", mode="REQUIRED"),
    ]
    
    return create_table_with_schema(client, table_id, schema,
                                  cluster_fields=["brewery_id"])

def create_table_with_schema(client, table_id, schema, partition_field=None, cluster_fields=None):
    """Helper function to create a table with schema"""
    try:
        # Check if table exists
        client.get_table(table_id)
        logger.info(f"Table {table_id} already exists")
        return True
    except NotFound:
        # Create table
        table = bigquery.Table(table_id, schema=schema)
        
        # Set partitioning if specified
        if partition_field:
            table.time_partitioning = bigquery.TimePartitioning(
                type_=bigquery.TimePartitioningType.DAY,
                field=partition_field
            )
        
        # Set clustering if specified
        if cluster_fields:
            table.clustering_fields = cluster_fields
        
        try:
            client.create_table(table)
            logger.info(f"Created table {table_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to create table {table_id}: {e}")
            return False

def create_views(client):
    """Create analytics views"""
    views = [
        {
            "view_id": f"{PROJECT_ID}.{DATASET_ID}.popular_recipes",
            "query": f"""
            SELECT 
              recipe_name,
              beer_style,
              average_rating,
              rating_count,
              brewery_id,
              RANK() OVER (ORDER BY average_rating DESC, rating_count DESC) as popularity_rank
            FROM `{PROJECT_ID}.{DATASET_ID}.recipe_analytics`
            WHERE rating_count >= 5
            ORDER BY average_rating DESC, rating_count DESC
            """
        },
        {
            "view_id": f"{PROJECT_ID}.{DATASET_ID}.brewery_rankings",
            "query": f"""
            SELECT 
              brewery_name,
              brewery_id,
              average_rating,
              total_feedback_count,
              active_batches_count,
              RANK() OVER (ORDER BY average_rating DESC, total_feedback_count DESC) as brewery_rank
            FROM `{PROJECT_ID}.{DATASET_ID}.brewery_summary`
            WHERE total_feedback_count >= 10
            ORDER BY average_rating DESC
            """
        }
    ]
    
    for view in views:
        try:
            view_table = bigquery.Table(view["view_id"])
            view_table.view_query = view["query"]
            
            # Try to create or replace view
            client.create_table(view_table, exists_ok=True)
            logger.info(f"Created/updated view {view['view_id']}")
        except Exception as e:
            logger.error(f"Failed to create view {view['view_id']}: {e}")

def main():
    """Main setup function"""
    client = create_bigquery_client()
    if not client:
        logger.error("Cannot proceed without BigQuery client")
        return False
    
    # Create dataset
    if not create_dataset(client):
        logger.error("Failed to create dataset")
        return False
    
    # Create tables
    tables_created = [
        create_user_feedback_table(client),
        create_recipe_analytics_table(client),
        create_brewery_summary_table(client)
    ]
    
    if not all(tables_created):
        logger.error("Some tables failed to create")
        return False
    
    # Create views
    create_views(client)
    
    logger.info("✅ BigQuery setup complete!")
    logger.info(f"Dataset: {PROJECT_ID}.{DATASET_ID}")
    logger.info("Tables: user_feedback, recipe_analytics, brewery_summary")
    logger.info("Views: popular_recipes, brewery_rankings")
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
