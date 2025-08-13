# Advanced Analytics Suite: Enhanced Formulas and Methodologies

Here is a comprehensive guide to the formulas and methodologies for your Advanced Analytics Suite. This document provides improved, industry-standard calculations and frameworks to ensure you derive accurate and actionable insights for your brewery.

---

## 1. Revenue Impact Analysis

This section refines the core performance metrics to provide a clearer view of your business's health and customer loyalty.

### Revenue Impact

This measures the growth or decline in revenue between two periods.

* **Absolute Revenue Impact ($)**
  * **Formula:** `Revenue (Current Period) - Revenue (Previous Period)`
  * **Example:** If this month's revenue is $15,000 and last month's was $12,550, the impact is +$2,450.

* **Percentage Revenue Impact (%)**
  * **Formula:** $$\left( \frac{\text{Revenue (Current Period)} - \text{Revenue (Previous Period)}}{\text{Revenue (Previous Period)}} \right) \times 100$$
  * **Example:** Using the numbers above, the percentage impact is `($2,450 / $12,550) * 100 = +19.5%`.

### Customer Retention

This is the single most important metric for understanding customer loyalty. It measures the percentage of existing customers who remain customers over a specific period.

* **Customer Retention Rate (CRR)**
  * **Formula:** $$\text{CRR} = \left( \frac{\text{Customers at End of Period} - \text{New Customers Acquired During Period}}{\text{Customers at Start of Period}} \right) \times 100$$
  * **How to Calculate:**
        1. Define the period (e.g., Last 90 Days).
        2. Count the number of unique customers at the start of the period ($C_S$).
        3. Count the number of unique customers at the end of the period ($C_E$).
        4. Count the number of new customers acquired during this period ($C_N$).
        5. Plug the numbers into the formula: `((C_E - C_N) / C_S) * 100`.

> **Note:** A high retention rate is a strong indicator of customer satisfaction and product loyalty. Tracking this by customer cohort (e.g., customers who first visited in Q1) can provide deeper insights.

### Average Satisfaction (CSAT Score)

This metric quantifies customer satisfaction based on direct feedback.

* **Customer Satisfaction Score (CSAT)**
  * **Formula:** $$\text{CSAT} = \left( \frac{\text{Number of Satisfied Customers}}{\text{Total Number of Survey Respondents}} \right) \times 100$$
  * **How to Calculate:**
        1. Ask customers a direct question, like "How satisfied were you with your experience today?" on a 1-5 or 1-10 scale.
        2. Define what constitutes a "satisfied customer." Typically, this includes those who respond with a 4 or 5 on a 5-point scale, or 7-10 on a 10-point scale.
        3. Divide the number of these "satisfied" responses by the total number of responses received.

* **Average Rating (for star ratings)**
  * **Formula:** $$\text{Average Rating} = \frac{\sum (\text{Rating} \times \text{Number of Responses for that Rating})}{\text{Total Number of Responses}}$$
  * **Example:** `(5*100 + 4*60 + 3*20 + 2*5 + 1*5) / 190 total responses = 4.32 stars`.

### Repeat Visits (Repeat Customer Rate)

This metric measures the percentage of your customer base that has visited more than once within a given period.

* **Repeat Customer Rate**
  * **Formula:** $$\text{Repeat Customer Rate} = \left( \frac{\text{Customers with >1 Purchase/Visit}}{\text{Total Unique Customers}} \right) \times 100$$
  * **How to Calculate:**
        1. Define the time frame (e.g., Last 6 Months).
        2. Count the number of unique customers who made at least one purchase.
        3. Count how many of those customers made two or more purchases.
        4. Divide the second number by the first and multiply by 100.

---

## 2. Customer Intelligence

This section details methods for understanding who your customers are and what they want.

### Top Customer Preferences

Identify your best-selling products and what your customers say they love.

* **Methodology (Sales Data):**
    1. **Rank by Revenue:** List all beer styles by total revenue generated in the period.
    2. **Rank by Volume:** List all beer styles by the total quantity (e.g., pints, flights) sold.
    3. **Rank by Profit Margin:** If possible, calculate the profit margin for each style and rank them to find your most profitable products.
* **Methodology (Feedback Data):**
  * Use text analysis (see below) on customer reviews to find frequently mentioned positive terms associated with specific beers (e.g., "juicy," "hazy," "smooth," "crisp").

### Customer Segments

Group customers to personalize marketing and product development. The **RFM Model** is a powerful and standard approach.

* **RFM (Recency, Frequency, Monetary) Analysis:**
  * **Recency:** How recently did the customer visit?
  * **Frequency:** How often do they visit?
  * **Monetary:** How much do they spend?

    **How to Implement:**
    1. For every unique customer, pull their visit history and total spending.
    2. Score each customer on a scale of 1-5 for each category (Recency, Frequency, Monetary), with 5 being the best.
    3. Combine the scores to create segments.

| RFM Segment | Recency Score | Frequency Score | Monetary Score | Description & Action |
| :--- | :--- | :--- | :--- | :--- |
| **Champions** | 5 | 5 | 5 | Your best customers. Reward them with early access to new brews. |
| **Loyal Customers** | 3-5 | 3-5 | 3-5 | High frequency/spend but may not be recent. Engage with loyalty points. |
| **Potential Loyalists** | 3-5 | 1-3 | 1-3 | Recent visitors with low frequency. Encourage repeat visits with a follow-up offer. |
| **At-Risk Customers** | 1-2 | 3-5 | 3-5 | Used to visit/spend a lot, but haven't been back. Send a "We Miss You" promo. |
| **New Customers** | 5 | 1 | 1 | Visited once, recently. Ensure a great first experience to convert them. |

### Taste Profile Insights

Use text analysis of customer reviews (from your POS, Google, Yelp, Untappd) to understand the "why" behind their ratings.

* **Methodology:**
    1. **Data Collection:** Aggregate reviews from all platforms.
    2. **Keyword Extraction:** Identify the most common adjectives and nouns used to describe your beers (e.g., "hoppy," "citrus," "malty," "chocolate," "bitter," "smooth").
    3. **Sentiment Analysis:** Assign a sentiment score (positive, negative, neutral) to each keyword or phrase. For example, "perfectly bitter" is positive, while "too bitter" is negative.
    4. **Synthesize:** Connect the taste keywords to specific beers and overall ratings. This reveals that customers love your Porter because of its "smooth chocolate notes" but find a certain IPA "too bitter."

---

## 3. Predictive Analytics

Leverage historical data to make accurate forecasts about future performance.

### Revenue Forecast

Predict future revenue using time-series forecasting models.

* **Recommended Models:**
  * **Prophet (by Facebook):** Excellent for businesses with seasonal effects and holidays. It's robust to missing data and shifts in trends.
  * **ARIMA (Autoregressive Integrated Moving Average):** A classic statistical model for analyzing and forecasting time-series data.
* **Prophet Model Formula:** $$Y_t = \text{Trend}_t + \text{Seasonality}_t + \text{Holiday}_t + \epsilon_t$$
  * $Y_t$: The revenue forecast at time $t$.
  * $\text{Trend}_t$: The non-periodic change in revenue over time.
  * $\text{Seasonality}_t$: Periodic changes (e.g., weekly, monthly, yearly patterns).
  * $\text{Holiday}_t$: The effect of specific holidays or events.
  * $\epsilon_t$: The error term (random, unpredictable fluctuations).
* **Confidence Interval (92% Confidence):** A forecast is never a single number but a range. The confidence interval provides this range. For example, a forecast of $18,200 with a 92% confidence interval of [$17,500, $18,900] means you can be 92% confident that the actual revenue will fall within that range.

### Best Performing Style

Predict which beer style will be a top seller in a future period.

* **Methodology: Multivariate Time-Series Forecasting:**
    1. Create a separate time-series forecast (as above) for the sales of each major beer style (e.g., West Coast IPA, Porter, Wheat Beer).
    2. Include external variables that might influence sales, such as marketing spend, raw material costs, or even weather data.
    3. The style with the highest forecasted sales volume or revenue for the "next quarter" is your predicted best performer.

### Peak Season

Identify your busiest periods with statistical certainty.

* **Methodology: Time-Series Decomposition:**
    1. Use your historical sales data (at least 2-3 years for accuracy).
    2. Apply a decomposition model (available in most statistical software) to separate your sales data into three components:
        * **Trend:** The long-term upward or downward movement.
        * **Seasonality:** The clear, repeating pattern of peaks and troughs.
        * **Residual:** The random, irregular noise left over.
    3. Analyze the **Seasonality** component to identify the months that consistently show the highest sales. This provides a data-backed confirmation of your peak season (e.g., June-August).

---

## 4. Competitive Positioning

Understand your place in the market and how you stack up against the competition.

### Market Position

This is determined by your market share relative to competitors.

* **Market Share Formula:** $$\text{Market Share} = \left( \frac{\text{Your Brewery's Revenue}}{\text{Total Market Revenue}} \right) \times 100$$
  * **How to Calculate:**
        1. **Define Your Market:** Be specific (e.g., "Craft breweries in [Your City]").
        2. **Estimate Total Market Revenue:** This is the hardest part. You may need to use local business reports, chamber of commerce data, or industry association estimates to approximate the total sales of all competitors in your defined market.
        3. **Calculate Your Share:** Divide your revenue by the total market revenue.
        4. **Rank:** Rank your brewery against competitors based on this percentage.

### Rating Comparison

Aggregate and compare customer ratings from public sources.

* **Methodology:**
    1. **Identify Competitors:** List your top 3-5 direct local competitors.
    2. **Collect Data:** Scrape or manually collect average star ratings and the number of reviews from platforms like **Google Maps, Yelp, and Untappd**.
        * *Tools for scraping include Octoparse, ParseHub, or custom Python scripts using libraries like `BeautifulSoup` or `Scrapy`.*
    3. **Calculate Weighted Average:** To get a more accurate market average, calculate a weighted average that gives more importance to competitors with more reviews.
        * **Formula:** $$\text{Weighted Avg} = \frac{\sum (\text{Competitor Rating} \times \text{Competitor # of Reviews})}{\sum (\text{Total # of Reviews})}$$
    4. **Analyze:** Compare your average rating to the market average and your top competitor's rating.

### Strengths & Opportunities (SWOT Analysis)

Use the data from your analyses to build a strategic framework.

* **SWOT Analysis Framework:**
  * **Strengths (Internal, Positive):** What do you do well?
    * *Data Point:* `Superior IPA ratings (+0.8 vs competitors)`
    * *Data Point:* `High Customer Retention Rate (87%)`
  * **Weaknesses (Internal, Negative):** Where do you need to improve?
    * *Data Point:* Text analysis reveals `weekend wait times` are a common complaint.
    * *Data Point:* Wheat beers are low-selling and have mediocre ratings.
  * **Opportunities (External, Positive):** What market trends can you capitalize on?
    * *Data Point:* `Opportunity: Expand wheat beer selection` (if market data shows a trend you aren't capturing).
    * *Data Point:* Text analysis shows customers asking for `citrus-forward` or `seasonal` IPAs.
  * **Threats (External, Negative):** What external factors could harm your business?
    * *Data Point:* A top competitor has a very high rating (`4.4★`) and is growing fast.
    * *Data Point:* Rising costs of hops (from supplier data).

---

## 5. AI Recommendations

Translate your data insights into high-impact, actionable business recommendations.

### Generating Recommendations

The system should connect an **Opportunity** or **Weakness** to a concrete action with a predicted outcome.

* **Recommendation Logic:**
    1. **Identify Insight:** *Customers love our IPA and frequently mention "citrus" and "summer" in positive reviews.* (Taste Profile Insights)
    2. **Formulate Hypothesis:** *Launching a seasonal, citrus-forward summer IPA will appeal to our core customers and attract new ones, driving incremental revenue.*
    3. **Estimate Impact (Formulas below):**
        * Est. Revenue: +$3,200/month
        * Customer Interest: 89% (from survey or text analysis frequency)
        * Est. Rating Boost: +0.1 to overall rating
    4. **Define Success Metrics:** Track sales of the new IPA, customer feedback keywords, and its effect on repeat visits.

### Estimating Financial Impact

* **Formula for New Product Revenue:**
    $$\text{Est. Monthly Revenue} = (\text{Est. # of Units Sold}) \times (\text{Price per Unit})$$
  * **How to Estimate Units Sold:**
    * **Method A (Based on Similar Products):** If your current IPA sells 500 pints/month, you can conservatively estimate a new variant will sell a fraction of that (e.g., 50-60%), plus some incremental new sales.
    * **Method B (Based on Customer Interest):** If you survey customers and 20% of your loyal segment express strong interest, you can model expected sales based on their average visit frequency.

### Estimating Satisfaction Boost

* **Formula for Rating Boost:** This is more qualitative but can be estimated.
    $$\text{Est. Rating Boost} = (\text{Impact Score}) \times (\text{% of Customers Affected}) \times (\text{Max Potential Lift})$$
  * **Example (Optimizing Porter Recipe):**
    * **Insight:** Text analysis shows 15% of Porter reviews mention a desire for "more chocolate notes," and these reviews are, on average, 0.5 stars lower than other Porter reviews.
    * **Hypothesis:** A small recipe tweak could resolve this specific complaint.
    * **Calculation:** Assume the tweak fully satisfies this 15% of customers, lifting their ratings by 0.5 stars. The overall rating boost would be `15% * 0.5 = 0.075 stars`. You can then round this to a more conservative `+0.1` or more ambitious `+0.2` estimate.
