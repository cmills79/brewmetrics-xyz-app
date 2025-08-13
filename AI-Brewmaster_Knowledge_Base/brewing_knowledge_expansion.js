// Expanded Brewing Knowledge Base for AI Brewmaster
// Additional brewing patterns and responses

const expandedBrewingKnowledge = {
  // Additional beer style recipes
  recipes: {
    porter: `Here's a classic English Porter recipe:

**5-Gallon English Porter Recipe:**

**Grain Bill:**
- 8 lbs English Pale Malt
- 1 lb Crystal 60L
- 0.75 lb Chocolate Malt
- 0.5 lb Brown Malt

**Hop Schedule:**
- 1.5 oz Fuggle (4.5% AA) @ 60 min
- 0.75 oz East Kent Goldings (5% AA) @ 15 min

**Yeast & Process:**
- Wyeast 1968 London ESB or S-04
- Mash at 154°F for 60 minutes
- Ferment at 66-68°F for 7-10 days

**Target Stats:**
- OG: 1.052, FG: 1.013
- ABV: 5.1%, IBU: 28, SRM: 22`,

    brownAle: `Here's a Northern English Brown Ale recipe:

**5-Gallon Brown Ale Recipe:**

**Grain Bill:**
- 7 lbs English Pale Malt
- 1.5 lbs Crystal 60L
- 0.5 lb Chocolate Malt
- 0.25 lb Victory Malt

**Hop Schedule:**
- 1 oz Fuggle (4.5% AA) @ 60 min
- 0.5 oz East Kent Goldings (5% AA) @ 15 min

**Yeast & Process:**
- Wyeast 1968 London ESB
- Mash at 154°F for 60 minutes
- Ferment at 66-68°F for 7-10 days

**Target Stats:**
- OG: 1.048, FG: 1.012
- ABV: 4.7%, IBU: 22, SRM: 18`
  },

  // Brewing calculations and formulas
  calculations: `Key brewing calculations and formulas:

**Original Gravity (OG):**
- Points = (Grain lbs × PPG × Efficiency%) ÷ Batch Size
- OG = 1 + (Points ÷ 1000)
- Example: 10 lbs × 37 PPG × 75% ÷ 5 gal = 55.5 points = 1.055

**IBU Calculation (Tinseth):**
- IBU = (AAU × Utilization × 75) ÷ Batch Size
- AAU = Hop oz × Alpha Acid %
- Utilization varies by boil time (60min = 30%, 15min = 15%)

**ABV Calculation:**
- ABV = (OG - FG) × 131.25
- Example: (1.055 - 1.012) × 131.25 = 5.6% ABV

**Strike Water Temperature:**
- Strike Temp = (Target Temp - Grain Temp) × (0.2 × Grain Weight ÷ Water Volume) + Target Temp
- Typical ratio: 1.25-1.5 qt/lb grain

**Color (SRM - Morey Equation):**
- SRM = 1.4922 × (Total MCU)^0.6859
- MCU = (Grain lbs × Lovibond) ÷ Batch Size`,

  // Ingredient substitutions
  substitutions: `Common brewing ingredient substitutions:

**Malt Substitutions:**
- **Pale 2-Row ↔ Pilsner Malt**: 1:1 ratio, slight flavor difference
- **Crystal 40L ↔ Crystal 60L**: Adjust amount by 20% (darker = less needed)
- **Chocolate Malt ↔ Roasted Barley**: 1:1 for color, different flavor
- **Munich ↔ Vienna**: 1:1 ratio, Munich slightly darker

**Hop Substitutions:**
- **Cascade ↔ Centennial**: Similar citrus character
- **Chinook ↔ Columbus**: Both high alpha, piney
- **Saaz ↔ Hallertau**: Noble hop character
- **Citra ↔ Mosaic**: Tropical fruit character

**Yeast Substitutions:**
- **US-05 ↔ Wyeast 1056**: Same strain, different form
- **S-04 ↔ Wyeast 1084**: English ale character
- **34/70 ↔ Wyeast 2124**: Lager strains`,

  // Beginner guidance
  beginner: `Getting started with homebrewing:

**Start with Extract Brewing:**
- **Equipment**: 5+ gallon pot, fermenter, airlock, hydrometer
- **First Recipe**: American Pale Ale or Wheat Beer
- **Process**: Steep specialty grains, add extract, boil hops, ferment
- **Timeline**: 4-6 weeks grain to glass

**Essential First Steps:**
1. **Join a homebrew club** - invaluable learning resource
2. **Read "How to Brew" by John Palmer** - brewing bible
3. **Start simple** - master basics before advanced techniques
4. **Take detailed notes** - track what works
5. **Sanitize everything** - most critical success factor

**Common Beginner Mistakes:**
- Skipping sanitization steps
- Not controlling fermentation temperature
- Rushing the process (patience is key)
- Over-complicating first recipes
- Not taking gravity readings`,

  // Advanced techniques
  advanced: `Advanced brewing techniques:

**Step Mashing:**
- **Protein Rest**: 122°F (15-20 min) - protein breakdown
- **Beta Amylase**: 148-150°F (30-45 min) - fermentability
- **Alpha Amylase**: 158-162°F (15-30 min) - body/sweetness
- **Mash Out**: 168°F (10 min) - stop enzyme activity

**Hop Techniques:**
- **First Wort Hopping**: Add hops to lauter tun
- **Hop Bursting**: Heavy late hop additions (0-20 min)
- **Whirlpool Hopping**: 170°F hop stand for aroma
- **Biotransformation**: Dry hop during active fermentation

**Fermentation Control:**
- **Diacetyl Rest**: Raise temp 2-3°F last 2 days
- **Cold Crash**: Drop to 35°F to clarify
- **Pressure Fermentation**: 10-15 PSI for cleaner esters`,

  // Seasonal brewing
  seasonal: `Seasonal brewing guide:

**Spring Brewing (March-May):**
- **Styles**: Maibock, Spring Saison, Fresh Hop Ales
- **Ingredients**: Fresh hops, light malts, Belgian yeasts
- **Focus**: Clean, refreshing, floral character

**Summer Brewing (June-August):**
- **Styles**: Wheat beers, Pilsners, Session IPAs, Gose
- **Characteristics**: Low ABV, high carbonation, crisp finish
- **Serving**: Cold, refreshing, easy drinking

**Fall Brewing (September-November):**
- **Styles**: Oktoberfest, Pumpkin Ales, Brown Ales
- **Ingredients**: Toasted malts, spices, seasonal adjuncts
- **Character**: Malty, warming, harvest flavors

**Winter Brewing (December-February):**
- **Styles**: Stouts, Barleywines, Winter Warmers
- **Additions**: Chocolate, coffee, vanilla, bourbon
- **Profile**: High ABV, rich, complex, warming`,

  // Professional brewmaster personality responses
  personality: {
    greetings: [
      "Hey there, fellow brewer! What's brewing today?",
      "Cheers! Ready to craft something exceptional?",
      "Another day, another chance to make great beer. What can I help with?",
      "Welcome to the brewhouse! Let's talk beer."
    ],
    
    expertise: {
      confident: [
        "I've been around the block a few times with this one...",
        "Here's what 25+ years in the industry has taught me:",
        "From my experience running commercial operations:",
        "I've seen this challenge countless times - here's the deal:"
      ],
      
      collaborative: [
        "Let's work through this together.",
        "Every brewer has their own approach, but here's what I'd suggest:",
        "We're all learning in this craft - here's my take:",
        "Fellow brewers have taught me that..."
      ]
    },
    
    encouragement: [
      "You've got this! Every great brewer started somewhere.",
      "That's the spirit of craft brewing - always experimenting!",
      "Keep pushing boundaries - that's how we advance the craft.",
      "Solid thinking! I like where your head's at."
    ],
    
    warnings: [
      "Hold up - let me save you from a mistake I've made before:",
      "Red flag alert! Here's what could go sideways:",
      "Been there, done that, got the infected batch to prove it:",
      "Trust me on this one - I learned it the hard way:"
    ],
    
    passion: [
      "This is why I love brewing - the science meets art!",
      "Nothing beats the satisfaction of nailing a recipe.",
      "The beauty of this craft never gets old.",
      "This is what separates good beer from great beer."
    ]
  }
};

// Export for use in AI Brewmaster
if (typeof module !== 'undefined' && module.exports) {
  module.exports = expandedBrewingKnowledge;
} else if (typeof window !== 'undefined') {
  window.expandedBrewingKnowledge = expandedBrewingKnowledge;
}