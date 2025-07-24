-- BigQuery schema for BrewMetrics analytics
-- This creates the structured data foundation for the AI agent

-- Create dataset (run this via bq command or Cloud Console)
-- bq --location=us-central1 mk --dataset brewmetrics_data

-- User feedback table - stores individual survey responses
CREATE TABLE IF NOT EXISTS `brewmetrics-xyz-app-e8d51.brewmetrics_data.user_feedback` (
  feedback_id STRING NOT NULL,
  brewery_id STRING NOT NULL,
  batch_id STRING,
  recipe_id STRING,
  user_id STRING,
  rating_score FLOAT64,
  feedback_text STRING,
  
  -- Survey question responses
  sweetness_rating INT64,
  acidity_rating INT64,
  bitterness_rating INT64,
  body_rating INT64,
  carbonation_rating INT64,
  malt_flavors_rating INT64,
  hop_flavors_rating INT64,
  finish_rating INT64,
  
  -- Metadata
  survey_version STRING,
  response_time_seconds INT64,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
)
PARTITION BY DATE(created_at)
CLUSTER BY brewery_id, batch_id;

-- Recipe data table - aggregated performance metrics per recipe/batch
CREATE TABLE IF NOT EXISTS `brewmetrics-xyz-app-e8d51.brewmetrics_data.recipe_analytics` (
  recipe_id STRING NOT NULL,
  brewery_id STRING NOT NULL,
  batch_id STRING,
  recipe_name STRING NOT NULL,
  beer_style STRING,
  
  -- Aggregated ratings
  average_rating FLOAT64,
  median_rating FLOAT64,
  rating_count INT64,
  
  -- Detailed taste profile averages
  avg_sweetness FLOAT64,
  avg_acidity FLOAT64,
  avg_bitterness FLOAT64,
  avg_body FLOAT64,
  avg_carbonation FLOAT64,
  avg_malt_flavors FLOAT64,
  avg_hop_flavors FLOAT64,
  avg_finish FLOAT64,
  
  -- Performance metrics
  high_ratings_count INT64, -- ratings >= 4
  low_ratings_count INT64,  -- ratings <= 2
  google_reviews_generated INT64,
  
  -- Temporal data
  first_feedback_date DATE,
  last_feedback_date DATE,
  last_updated TIMESTAMP NOT NULL,
  
  -- Recipe metadata
  batch_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL
)
PARTITION BY DATE(created_at)
CLUSTER BY brewery_id, beer_style;

-- Brewery performance summary
CREATE TABLE IF NOT EXISTS `brewmetrics-xyz-app-e8d51.brewmetrics_data.brewery_summary` (
  brewery_id STRING NOT NULL,
  brewery_name STRING NOT NULL,
  
  -- Overall metrics
  total_feedback_count INT64,
  average_rating FLOAT64,
  active_batches_count INT64,
  total_batches_count INT64,
  google_reviews_generated INT64,
  
  -- Top performing recipes
  top_recipe_id STRING,
  top_recipe_name STRING,
  top_recipe_rating FLOAT64,
  
  -- Recent performance (last 30 days)
  recent_feedback_count INT64,
  recent_average_rating FLOAT64,
  
  last_updated TIMESTAMP NOT NULL
)
CLUSTER BY brewery_id;

-- Views for common analytics queries

-- Most popular recipes across all breweries
CREATE OR REPLACE VIEW `brewmetrics-xyz-app-e8d51.brewmetrics_data.popular_recipes` AS
SELECT 
  recipe_name,
  beer_style,
  average_rating,
  rating_count,
  brewery_id,
  RANK() OVER (ORDER BY average_rating DESC, rating_count DESC) as popularity_rank
FROM `brewmetrics-xyz-app-e8d51.brewmetrics_data.recipe_analytics`
WHERE rating_count >= 5  -- Only recipes with significant feedback
ORDER BY average_rating DESC, rating_count DESC;

-- Brewery performance comparison
CREATE OR REPLACE VIEW `brewmetrics-xyz-app-e8d51.brewmetrics_data.brewery_rankings` AS
SELECT 
  brewery_name,
  brewery_id,
  average_rating,
  total_feedback_count,
  active_batches_count,
  RANK() OVER (ORDER BY average_rating DESC, total_feedback_count DESC) as brewery_rank
FROM `brewmetrics-xyz-app-e8d51.brewmetrics_data.brewery_summary`
WHERE total_feedback_count >= 10
ORDER BY average_rating DESC;
