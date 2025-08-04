const functions = require("firebase-functions");
const {BigQuery} = require("@google-cloud/bigquery");
const admin = require("firebase-admin");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT || "brewmetrics-xyz-app-e8d51",
});

const DATASET_ID = "brewmetrics_data";

/**
 * Cloud Function triggered when survey responses are written to Firestore
 * Syncs data to BigQuery for analytics
 */
exports.syncSurveyToBigQuery = functions.firestore
    .document("breweries/{breweryId}/batches/{batchId}/responses/{responseId}")
    .onCreate(async (snap, context) => {
      const responseData = snap.data();
      const responseId = context.params.responseId;
      const breweryId = context.params.breweryId;
      const batchId = context.params.batchId;

      try {
        // Transform Firestore data to BigQuery schema
        const bqRow = {
          feedback_id: responseId,
          brewery_id: breweryId,
          batch_id: batchId,
          recipe_id: responseData.recipeId || batchId, // Use batchId as recipe_id for now
          user_id: responseData.userId || null,
          rating_score: responseData.overallRating || null,
          feedback_text: responseData.comments || null,

          // Survey question responses (1-5 scale)
          sweetness_rating: responseData.responses?.sweetness || null,
          acidity_rating: responseData.responses?.acidity || null,
          bitterness_rating: responseData.responses?.bitterness || null,
          body_rating: responseData.responses?.body || null,
          carbonation_rating: responseData.responses?.carbonation || null,
          malt_flavors_rating: responseData.responses?.maltFlavors || null,
          hop_flavors_rating: responseData.responses?.hopFlavors || null,
          finish_rating: responseData.responses?.finish || null,

          // Metadata
          survey_version: responseData.surveyVersion || "1.0",
          response_time_seconds: responseData.responseTimeSeconds || null,
          created_at: responseData.submittedAt?.toDate?.() ||
                      responseData.submittedAt ||
                      new Date(),
          updated_at: new Date(),
        };

        // Insert into BigQuery
        const table = bigquery.dataset(DATASET_ID).table("user_feedback");
        await table.insert([bqRow]);

        functions.logger.info("Survey response synced to BigQuery", {
          responseId,
          breweryId: breweryId,
          batchId: batchId,
        });

        // Trigger analytics aggregation
        await updateRecipeAnalytics(batchId, breweryId);
      } catch (error) {
        functions.logger.error("Failed to sync survey to BigQuery", {
          responseId,
          error: error.message,
          stack: error.stack,
        });
        // Don't throw - this would retry the function indefinitely
      }
    });

/**
 * Update aggregated recipe analytics when new feedback arrives
 */
async function updateRecipeAnalytics(batchId, breweryId) {
  if (!batchId || !breweryId) {
    functions.logger.warn("Missing batchId or breweryId for analytics update");
    return;
  }

  try {
    // Aggregate query to calculate recipe metrics
    const query = `
      MERGE \`${bigquery.projectId}.${DATASET_ID}.recipe_analytics\` AS target
      USING (
        SELECT
          @batch_id as recipe_id,
          @brewery_id as brewery_id,
          @batch_id as batch_id,
          COALESCE(batch.name, 'Unknown Recipe') as recipe_name,
          COALESCE(batch.style, 'Unknown Style') as beer_style,
          
          -- Aggregated ratings
          AVG(feedback.rating_score) as average_rating,
          APPROX_QUANTILES(feedback.rating_score, 2)[OFFSET(1)] as median_rating,
          COUNT(*) as rating_count,
          
          -- Taste profile averages
          AVG(feedback.sweetness_rating) as avg_sweetness,
          AVG(feedback.acidity_rating) as avg_acidity,
          AVG(feedback.bitterness_rating) as avg_bitterness,
          AVG(feedback.body_rating) as avg_body,
          AVG(feedback.carbonation_rating) as avg_carbonation,
          AVG(feedback.malt_flavors_rating) as avg_malt_flavors,
          AVG(feedback.hop_flavors_rating) as avg_hop_flavors,
          AVG(feedback.finish_rating) as avg_finish,
          
          -- Performance metrics
          SUM(CASE WHEN feedback.rating_score >= 4 THEN 1 ELSE 0 END) as high_ratings_count,
          SUM(CASE WHEN feedback.rating_score <= 2 THEN 1 ELSE 0 END) as low_ratings_count,
          
          -- Temporal data
          MIN(DATE(feedback.created_at)) as first_feedback_date,
          MAX(DATE(feedback.created_at)) as last_feedback_date,
          CURRENT_TIMESTAMP() as last_updated,
          CURRENT_TIMESTAMP() as created_at
          
        FROM \`${bigquery.projectId}.${DATASET_ID}.user_feedback\` feedback
        LEFT JOIN (
          SELECT batch_id, name, style, active 
          FROM \`${bigquery.projectId}.${DATASET_ID}.batches\`
          WHERE batch_id = @batch_id
        ) batch ON feedback.batch_id = batch.batch_id
        WHERE feedback.batch_id = @batch_id
        GROUP BY batch.name, batch.style
      ) AS source
      ON target.recipe_id = source.recipe_id 
         AND target.brewery_id = source.brewery_id
      WHEN MATCHED THEN
        UPDATE SET
          average_rating = source.average_rating,
          median_rating = source.median_rating,
          rating_count = source.rating_count,
          avg_sweetness = source.avg_sweetness,
          avg_acidity = source.avg_acidity,
          avg_bitterness = source.avg_bitterness,
          avg_body = source.avg_body,
          avg_carbonation = source.avg_carbonation,
          avg_malt_flavors = source.avg_malt_flavors,
          avg_hop_flavors = source.avg_hop_flavors,
          avg_finish = source.avg_finish,
          high_ratings_count = source.high_ratings_count,
          low_ratings_count = source.low_ratings_count,
          last_feedback_date = source.last_feedback_date,
          last_updated = source.last_updated
      WHEN NOT MATCHED THEN
        INSERT (
          recipe_id, brewery_id, batch_id, recipe_name, beer_style,
          average_rating, median_rating, rating_count,
          avg_sweetness, avg_acidity, avg_bitterness, avg_body,
          avg_carbonation, avg_malt_flavors, avg_hop_flavors, avg_finish,
          high_ratings_count, low_ratings_count,
          first_feedback_date, last_feedback_date, last_updated, created_at,
          batch_active
        )
        VALUES (
          source.recipe_id, source.brewery_id, source.batch_id, 
          source.recipe_name, source.beer_style,
          source.average_rating, source.median_rating, source.rating_count,
          source.avg_sweetness, source.avg_acidity, source.avg_bitterness, 
          source.avg_body, source.avg_carbonation, source.avg_malt_flavors, 
          source.avg_hop_flavors, source.avg_finish,
          source.high_ratings_count, source.low_ratings_count,
          source.first_feedback_date, source.last_feedback_date, 
          source.last_updated, source.created_at,
          TRUE
        )
    `;

    await bigquery.query({
      query,
      params: {
        batch_id: batchId,
        brewery_id: breweryId,
      },
    });

    functions.logger.info("Recipe analytics updated", {batchId, breweryId});

    // Update brewery summary as well
    await updateBrewerySummary(breweryId);
  } catch (error) {
    functions.logger.error("Failed to update recipe analytics", {
      batchId,
      breweryId,
      error: error.message,
    });
  }
}

/**
 * Update brewery-level summary statistics
 */
async function updateBrewerySummary(breweryId) {
  try {
    const query = `
      MERGE \`${bigquery.projectId}.${DATASET_ID}.brewery_summary\` AS target
      USING (
        SELECT
          @brewery_id as brewery_id,
          brewery.name as brewery_name,
          COUNT(feedback.feedback_id) as total_feedback_count,
          AVG(feedback.rating_score) as average_rating,
          COUNT(DISTINCT CASE WHEN recipe.batch_active THEN recipe.batch_id END) as active_batches_count,
          COUNT(DISTINCT recipe.batch_id) as total_batches_count,
          COALESCE(SUM(recipe.google_reviews_generated), 0) as google_reviews_generated,
          
          -- Top recipe (highest rated with sufficient feedback)
          (SELECT recipe_name FROM \`${bigquery.projectId}.${DATASET_ID}.recipe_analytics\` 
           WHERE brewery_id = @brewery_id AND rating_count >= 5 
           ORDER BY average_rating DESC LIMIT 1) as top_recipe_name,
          (SELECT average_rating FROM \`${bigquery.projectId}.${DATASET_ID}.recipe_analytics\` 
           WHERE brewery_id = @brewery_id AND rating_count >= 5 
           ORDER BY average_rating DESC LIMIT 1) as top_recipe_rating,
          
          -- Recent performance (last 30 days)
          COUNT(CASE WHEN feedback.created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY) 
                THEN feedback.feedback_id END) as recent_feedback_count,
          AVG(CASE WHEN feedback.created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY) 
                THEN feedback.rating_score END) as recent_average_rating,
          
          CURRENT_TIMESTAMP() as last_updated
          
        FROM \`${bigquery.projectId}.${DATASET_ID}.user_feedback\` feedback
        LEFT JOIN \`${bigquery.projectId}.${DATASET_ID}.recipe_analytics\` recipe 
          ON feedback.batch_id = recipe.batch_id
        LEFT JOIN (
          SELECT brewery_id, name 
          FROM \`${bigquery.projectId}.${DATASET_ID}.breweries\`
          WHERE brewery_id = @brewery_id
        ) brewery ON feedback.brewery_id = brewery.brewery_id
        WHERE feedback.brewery_id = @brewery_id
        GROUP BY brewery.name
      ) AS source
      ON target.brewery_id = source.brewery_id
      WHEN MATCHED THEN
        UPDATE SET
          brewery_name = source.brewery_name,
          total_feedback_count = source.total_feedback_count,
          average_rating = source.average_rating,
          active_batches_count = source.active_batches_count,
          total_batches_count = source.total_batches_count,
          google_reviews_generated = source.google_reviews_generated,
          top_recipe_name = source.top_recipe_name,
          top_recipe_rating = source.top_recipe_rating,
          recent_feedback_count = source.recent_feedback_count,
          recent_average_rating = source.recent_average_rating,
          last_updated = source.last_updated
      WHEN NOT MATCHED THEN
        INSERT (
          brewery_id, brewery_name, total_feedback_count, average_rating,
          active_batches_count, total_batches_count, google_reviews_generated,
          top_recipe_name, top_recipe_rating, recent_feedback_count,
          recent_average_rating, last_updated
        )
        VALUES (
          source.brewery_id, source.brewery_name, source.total_feedback_count,
          source.average_rating, source.active_batches_count, source.total_batches_count,
          source.google_reviews_generated, source.top_recipe_name, source.top_recipe_rating,
          source.recent_feedback_count, source.recent_average_rating, source.last_updated
        )
    `;

    await bigquery.query({
      query,
      params: {brewery_id: breweryId},
    });

    functions.logger.info("Brewery summary updated", {breweryId});
  } catch (error) {
    functions.logger.error("Failed to update brewery summary", {
      breweryId,
      error: error.message,
    });
  }
}

/**
 * Manual trigger for backfilling BigQuery data from existing Firestore
 * Call this function to migrate existing survey data
 */
exports.backfillSurveyData = functions.https.onCall(async (data, context) => {
  // Require authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be authenticated to backfill data",
    );
  }

  try {
    const db = admin.firestore();
    // Use a collection group query to get all responses from all subcollections
    const surveySnapshot = await db.collectionGroup("responses").get();

    functions.logger.info(`Starting backfill of ${surveySnapshot.size} survey responses`);

    const bqRows = [];
    surveySnapshot.forEach((doc) => {
      const responseData = doc.data();
      
      // Get IDs from the document path
      const responseId = doc.id;
      const batchRef = doc.ref.parent.parent;
      const breweryRef = batchRef.parent.parent;
      const batchId = batchRef.id;
      const breweryId = breweryRef.id;

      const bqRow = {
        feedback_id: responseId,
        brewery_id: breweryId,
        batch_id: batchId,
        recipe_id: responseData.recipeId || batchId,
        user_id: responseData.userId || null,
        rating_score: responseData.overallRating || null,
        feedback_text: responseData.comments || null,

        sweetness_rating: responseData.responses?.sweetness || null,
        acidity_rating: responseData.responses?.acidity || null,
        bitterness_rating: responseData.responses?.bitterness || null,
        body_rating: responseData.responses?.body || null,
        carbonation_rating: responseData.responses?.carbonation || null,
        malt_flavors_rating: responseData.responses?.maltFlavors || null,
        hop_flavors_rating: responseData.responses?.hopFlavors || null,
        finish_rating: responseData.responses?.finish || null,

        survey_version: responseData.surveyVersion || "1.0",
        response_time_seconds: responseData.responseTimeSeconds || null,
        created_at: responseData.submittedAt?.toDate?.() ||
                    responseData.submittedAt ||
                    new Date(),
        updated_at: new Date(),
      };

      bqRows.push(bqRow);
    });

    // Insert all rows to BigQuery
    if (bqRows.length > 0) {
      const table = bigquery.dataset(DATASET_ID).table("user_feedback");
      await table.insert(bqRows);
      functions.logger.info(`Backfilled ${bqRows.length} survey responses to BigQuery`);
    }

    return {
      success: true,
      recordsProcessed: bqRows.length,
      message: `Successfully backfilled ${bqRows.length} survey responses`,
    };
  } catch (error) {
    functions.logger.error("Backfill failed", {
      error: error.message,
      stack: error.stack,
    });

    throw new functions.https.HttpsError(
        "internal",
        "Backfill operation failed",
    );
  }
});
