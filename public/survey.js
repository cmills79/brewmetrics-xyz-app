// --- START OF FILE survey.js ---

// --- UPDATED Question Definitions with Explanations ---
const surveyQuestions = [
    {
        id: 1,
        text: "Sweetness: How prominent is the initial sweetness (from malt, sugars, etc.)?",
        ratings: [ { value: 1, caption: "Not Sweet / Very Dry" }, { value: 2, caption: "Slightly Sweet / Off-Dry" }, { value: 3, caption: "Moderately Sweet" }, { value: 4, caption: "Quite Sweet" }, { value: 5, caption: "Very Sweet / Cloying" } ],
        tooltip: "Tip: Focus on the initial impression on your tongue. Does it taste sugary like candy, bready, or more dry and crisp? Consider if sweetness lingers.",
        explanation: "Why Sweetness Matters: Sweetness primarily comes from residual sugars left after fermentation. It balances bitterness and acidity, contributing to the overall body and flavor profile. Too much or too little can throw a beer out of style."
    },
    {
        id: 2,
        text: "Acidity/Tartness: How noticeable is a tart, acidic, or sour sensation?",
        ratings: [ { value: 1, caption: "None / Smooth" }, { value: 2, caption: "Slight Tartness / Hint of Sour" }, { value: 3, caption: "Noticeable Tartness / Moderately Sour" }, { value: 4, caption: "Quite Tart / Sour" }, { value: 5, caption: "Very Tart / Pucker Factor" } ],
        tooltip: "Tip: Think about lemons, vinegar, or sour candies. Does the beer make the sides of your tongue tingle or your mouth water excessively? Common in sours, goses, some fruit beers.",
        explanation: "Why Acidity/Tartness Matters: Acidity adds brightness and cuts through richness. In styles like Sours or Goses, it's a defining feature, often derived from specific yeasts or bacteria. Unintended acidity can indicate spoilage."
    },
    {
        id: 3,
        text: "Bitterness (Hops): How strong is the bitterness, often perceived at the back of the tongue?",
        ratings: [ { value: 1, caption: "Very Low / None" }, { value: 2, caption: "Slight Bitterness" }, { value: 3, caption: "Moderate Bitterness / Balanced" }, { value: 4, caption: "Quite Bitter / Hop-Forward" }, { value: 5, caption: "Very Bitter / Intense" } ],
        tooltip: "Tip: Focus on the finish after swallowing. Does a sharp, sometimes drying sensation linger? Distinct from sourness. Common in IPAs, Pale Ales.",
        explanation: "Why Bitterness Matters: Primarily from hops, bitterness balances malt sweetness and provides structure. The *intensity* and *quality* of bitterness are crucial, especially in styles like IPAs. It shouldn't be harsh or unpleasant."
    },
    {
        id: 4,
        text: "Body/Mouthfeel (Weight): How heavy or light does the beer feel in your mouth?",
        ratings: [ { value: 1, caption: "Very Light / Watery" }, { value: 2, caption: "Light Bodied" }, { value: 3, caption: "Medium Bodied" }, { value: 4, caption: "Full Bodied / Heavy" }, { value: 5, caption: "Very Heavy / Chewy" } ],
        tooltip: "Tip: Compare the feeling to liquids like water, milk, or cream. Does it feel thin or thick? Swirl it around. Stouts often have heavy body, Pilsners are lighter.",
        explanation: "Why Body/Mouthfeel Matters: This refers to the perceived weight and texture (e.g., smooth, creamy, thin). It's influenced by proteins, residual sugars, and carbonation. The right body enhances the drinking experience and should match the beer style."
    },
    {
        id: 5,
        text: "Carbonation (Bubbles): How much bubbly or fizzy sensation do you perceive?",
        ratings: [ { value: 1, caption: "Flat / Still" }, { value: 2, caption: "Low / Gentle Bubbles" }, { value: 3, caption: "Medium / Noticeable Fizz" }, { value: 4, caption: "High / Prickly Sensation" }, { value: 5, caption: "Very High / Gassy / Effervescent" } ],
        tooltip: "Tip: Pay attention to the 'bite' or 'prickle' on your tongue. Does it feel smooth or sharp and bubbly? Compare to soda water or champagne.",
        explanation: "Why Carbonation Matters: Carbonation (CO2 dissolved in the beer) affects mouthfeel (tingle, fullness) and aroma release. Different styles target different carbonation levels, from the gentle bubbles in a cask ale to the high effervescence of a Belgian Tripel."
    },
    {
        id: 6,
        text: "Malt Flavors: Besides sweetness, how prominent are flavors like bread, caramel, toast, nuts, or chocolate?",
        ratings: [ { value: 1, caption: "None / Very Subtle" }, { value: 2, caption: "Slight Malty Notes" }, { value: 3, caption: "Noticeable Malt Character" }, { value: 4, caption: "Rich Malt Flavors" }, { value: 5, caption: "Very Strong / Complex Malt" } ],
        tooltip: "Tip: Think beyond just sweetness. Does it taste like bread crust, crackers, toffee, coffee, or dark chocolate? More common in darker beers, lagers, less hoppy styles.",
        explanation: "Why Malt Flavors Matter: Malt provides the backbone of beer flavor – sugars for fermentation, plus complex notes like bread, biscuit, caramel, roast, or chocolate, depending on the type and kilning process. It's the soul of many beer styles."
    },
    {
        id: 7,
        text: "Hop Flavors: Besides bitterness, how prominent are flavors like citrus, pine, tropical fruit, floral, or grassy notes?",
        ratings: [ { value: 1, caption: "None / Very Subtle" }, { value: 2, caption: "Slight Hop Notes" }, { value: 3, caption: "Noticeable Hop Character" }, { value: 4, caption: "Rich Hop Flavors" }, { value: 5, caption: "Very Strong / Complex Hops" } ],
        tooltip: "Tip: Separate this from bitterness. What other flavors come through? Grapefruit, orange, mango, flowers, fresh cut grass, pine needles? Common in IPAs, Pales Ales, Hazy styles.",
        explanation: "Why Hop Flavors & Aroma Matter: Hops contribute not just bitterness but also a vast array of aromas and flavors (citrus, pine, fruity, floral, earthy, spicy). These are especially prominent in styles like Pale Ales and IPAs, defining their character."
    },
    {
        id: 8,
        text: "Finish/Aftertaste: How clean or lingering is the taste after you swallow?",
        ratings: [ { value: 1, caption: "Very Clean / Disappears Quickly" }, { value: 2, caption: "Clean / Short Aftertaste" }, { value: 3, caption: "Moderate Length Aftertaste" }, { value: 4, caption: "Lingering Aftertaste" }, { value: 5, caption: "Very Long / Coats Mouth" } ],
        tooltip: "Tip: Focus on what flavors (sweet, bitter, malt, hop) remain after swallowing and for how long. Is it crisp and refreshing, or do flavors stick around?",
        explanation: "Why Finish/Aftertaste Matters: The finish is the final impression. Is it crisp and quick (like a Pilsner), or do flavors linger (like a rich Stout)? The quality of the aftertaste (pleasant vs. harsh) is a key indicator of a well-made beer."
    }
];