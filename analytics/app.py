# BrewMetrics Analytics Microservice
# Cloud Run service that provides AI agent with data analytics capabilities

import os
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from google.cloud import bigquery
from google.cloud import secretmanager
from google.api_core.exceptions import GoogleAPICallError, NotFound
import logging
from dotenv import load_dotenv

# Load environment variables from .env file (for local development)
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_secret(secret_id, project_id=None):
    """Retrieve a secret from Google Cloud Secret Manager"""
    if not project_id:
        project_id = os.getenv('GCP_PROJECT', 'brewmetrics-xyz-app-e8d51')
    
    try:
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logger.warning(f"Could not retrieve secret {secret_id}: {e}")
        return None

# Configuration - try Secret Manager first, then environment variables, then defaults
PROJECT_ID = get_secret('gcp-project') or os.getenv('GCP_PROJECT', 'brewmetrics-xyz-app-e8d51')
DATASET_ID = get_secret('dataset-id') or os.getenv('DATASET_ID', 'brewmetrics_data')
MAX_RESULTS = 100

# Initialize BigQuery client
try:
    client = bigquery.Client()
    logger.info(f"BigQuery client initialized for project: {PROJECT_ID}")
except Exception as e:
    logger.error(f"Failed to initialize BigQuery client: {e}")
    client = None

def validate_brewery_access(brewery_id, user_claims=None):
    """Validate user has access to brewery data (implement based on your auth)"""
    # For now, basic validation - expand based on your user roles
    if not brewery_id or not isinstance(brewery_id, str):
        return False
    return True

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Cloud Run"""
    return jsonify({
        "status": "healthy",
        "service": "brewmetrics-analytics",
        "timestamp": datetime.utcnow().isoformat(),
        "bigquery_connected": client is not None
    }), 200

@app.route('/recipe-analytics', methods=['POST'])
def get_recipe_analytics():
    """Get analytics for a specific recipe"""
    if not client:
        return jsonify({"error": "BigQuery client not available"}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body required"}), 400

        recipe_name = data.get('recipe_name', '').strip()
        brewery_id = data.get('brewery_id', '').strip()
        
        if not recipe_name:
            return jsonify({"error": "recipe_name is required"}), 400
            
        if not validate_brewery_access(brewery_id):
            return jsonify({"error": "Invalid brewery access"}), 403

        # Query for recipe analytics
        query = f"""
        SELECT
            recipe_name,
            beer_style,
            average_rating,
            median_rating,
            rating_count,
            avg_sweetness,
            avg_acidity,
            avg_bitterness,
            avg_body,
            avg_carbonation,
            avg_malt_flavors,
            avg_hop_flavors,
            avg_finish,
            high_ratings_count,
            low_ratings_count,
            google_reviews_generated,
            last_feedback_date,
            batch_active
        FROM
            `{PROJECT_ID}.{DATASET_ID}.recipe_analytics`
        WHERE
            LOWER(recipe_name) = LOWER(@recipe_name)
            {"AND brewery_id = @brewery_id" if brewery_id else ""}
        ORDER BY last_updated DESC
        LIMIT 1
        """

        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("recipe_name", "STRING", recipe_name)
            ] + ([bigquery.ScalarQueryParameter("brewery_id", "STRING", brewery_id)] if brewery_id else [])
        )

        query_job = client.query(query, job_config=job_config)
        results = query_job.result()

        rows = [dict(row) for row in results]
        
        if not rows:
            return jsonify({
                "message": f"No analytics found for recipe: {recipe_name}",
                "recipe_name": recipe_name
            }), 404

        # Convert date/datetime objects to strings for JSON serialization
        recipe_data = rows[0]
        for key, value in recipe_data.items():
            if hasattr(value, 'isoformat'):
                recipe_data[key] = value.isoformat()

        logger.info(f"Recipe analytics retrieved for: {recipe_name}")
        return jsonify({
            "recipe": recipe_data,
            "query_timestamp": datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error in recipe analytics: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/brewery-summary', methods=['POST'])
def get_brewery_summary():
    """Get overall brewery performance summary"""
    if not client:
        return jsonify({"error": "BigQuery client not available"}), 500

    try:
        data = request.get_json()
        brewery_id = data.get('brewery_id', '').strip() if data else ''
        
        if not brewery_id:
            return jsonify({"error": "brewery_id is required"}), 400
            
        if not validate_brewery_access(brewery_id):
            return jsonify({"error": "Invalid brewery access"}), 403

        query = f"""
        SELECT
            brewery_name,
            total_feedback_count,
            average_rating,
            active_batches_count,
            total_batches_count,
            google_reviews_generated,
            top_recipe_name,
            top_recipe_rating,
            recent_feedback_count,
            recent_average_rating,
            last_updated
        FROM
            `{PROJECT_ID}.{DATASET_ID}.brewery_summary`
        WHERE
            brewery_id = @brewery_id
        """

        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("brewery_id", "STRING", brewery_id)
            ]
        )

        query_job = client.query(query, job_config=job_config)
        results = query_job.result()

        rows = [dict(row) for row in results]
        
        if not rows:
            return jsonify({
                "message": f"No summary found for brewery: {brewery_id}",
                "brewery_id": brewery_id
            }), 404

        # Convert datetime objects to strings
        summary_data = rows[0]
        for key, value in summary_data.items():
            if hasattr(value, 'isoformat'):
                summary_data[key] = value.isoformat()

        logger.info(f"Brewery summary retrieved for: {brewery_id}")
        return jsonify({
            "brewery_summary": summary_data,
            "query_timestamp": datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error in brewery summary: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/top-recipes', methods=['POST'])
def get_top_recipes():
    """Get top performing recipes across breweries or for specific brewery"""
    if not client:
        return jsonify({"error": "BigQuery client not available"}), 500

    try:
        data = request.get_json() or {}
        brewery_id = data.get('brewery_id', '').strip()
        limit = min(data.get('limit', 10), MAX_RESULTS)
        style_filter = data.get('beer_style', '').strip()

        # Build query based on parameters
        where_clauses = ["rating_count >= 5"]  # Only recipes with significant feedback
        
        if brewery_id:
            where_clauses.append("brewery_id = @brewery_id")
        if style_filter:
            where_clauses.append("LOWER(beer_style) = LOWER(@beer_style)")

        query = f"""
        SELECT
            recipe_name,
            beer_style,
            average_rating,
            rating_count,
            brewery_id,
            high_ratings_count,
            last_feedback_date
        FROM
            `{PROJECT_ID}.{DATASET_ID}.recipe_analytics`
        WHERE
            {" AND ".join(where_clauses)}
        ORDER BY average_rating DESC, rating_count DESC
        LIMIT @limit
        """

        # Build query parameters
        query_params = [bigquery.ScalarQueryParameter("limit", "INT64", limit)]
        if brewery_id:
            query_params.append(bigquery.ScalarQueryParameter("brewery_id", "STRING", brewery_id))
        if style_filter:
            query_params.append(bigquery.ScalarQueryParameter("beer_style", "STRING", style_filter))

        job_config = bigquery.QueryJobConfig(query_parameters=query_params)
        query_job = client.query(query, job_config=job_config)
        results = query_job.result()

        recipes = []
        for row in results:
            recipe = dict(row)
            # Convert date objects to strings
            for key, value in recipe.items():
                if hasattr(value, 'isoformat'):
                    recipe[key] = value.isoformat()
            recipes.append(recipe)

        logger.info(f"Top recipes query returned {len(recipes)} results")
        return jsonify({
            "top_recipes": recipes,
            "total_count": len(recipes),
            "filters": {
                "brewery_id": brewery_id or "all",
                "beer_style": style_filter or "all",
                "limit": limit
            },
            "query_timestamp": datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error in top recipes query: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/taste-profile-analysis', methods=['POST'])
def get_taste_profile_analysis():
    """Analyze taste profile trends for a recipe or brewery"""
    if not client:
        return jsonify({"error": "BigQuery client not available"}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body required"}), 400

        recipe_name = data.get('recipe_name', '').strip()
        brewery_id = data.get('brewery_id', '').strip()
        
        if not recipe_name and not brewery_id:
            return jsonify({"error": "Either recipe_name or brewery_id is required"}), 400

        # Build query for taste profile analysis
        where_clauses = []
        query_params = []

        if recipe_name:
            where_clauses.append("LOWER(recipe_name) = LOWER(@recipe_name)")
            query_params.append(bigquery.ScalarQueryParameter("recipe_name", "STRING", recipe_name))
        
        if brewery_id:
            where_clauses.append("brewery_id = @brewery_id")
            query_params.append(bigquery.ScalarQueryParameter("brewery_id", "STRING", brewery_id))

        query = f"""
        SELECT
            recipe_name,
            beer_style,
            avg_sweetness,
            avg_acidity,
            avg_bitterness,
            avg_body,
            avg_carbonation,
            avg_malt_flavors,
            avg_hop_flavors,
            avg_finish,
            average_rating,
            rating_count
        FROM
            `{PROJECT_ID}.{DATASET_ID}.recipe_analytics`
        WHERE
            {" AND ".join(where_clauses)}
            AND rating_count >= 3
        ORDER BY average_rating DESC
        """

        job_config = bigquery.QueryJobConfig(query_parameters=query_params)
        query_job = client.query(query, job_config=job_config)
        results = query_job.result()

        profiles = []
        for row in results:
            profiles.append(dict(row))

        if not profiles:
            return jsonify({
                "message": "No taste profile data found",
                "filters": {"recipe_name": recipe_name, "brewery_id": brewery_id}
            }), 404

        logger.info(f"Taste profile analysis returned {len(profiles)} profiles")
        return jsonify({
            "taste_profiles": profiles,
            "analysis_summary": {
                "total_recipes": len(profiles),
                "filters_applied": {"recipe_name": recipe_name, "brewery_id": brewery_id}
            },
            "query_timestamp": datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error in taste profile analysis: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=False, host='0.0.0.0', port=port)
