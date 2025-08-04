// Commercial Brewing Data and Formulas
// Comprehensive ingredient databases and professional brewing calculations

class CommercialBrewingData {
  static getIngredientDatabase() {
    return {
      fermentables: [
        // Base Malts
        { name: 'Pale 2-Row', yield: 81, color: 2, type: 'Base Malt', supplier: 'Various' },
        { name: 'Pilsner Malt', yield: 82, color: 1.5, type: 'Base Malt', supplier: 'Various' },
        { name: 'Munich Malt', yield: 80, color: 9, type: 'Base Malt', supplier: 'Various' },
        { name: 'Vienna Malt', yield: 80, color: 3.5, type: 'Base Malt', supplier: 'Various' },
        { name: 'Wheat Malt', yield: 82, color: 2.5, type: 'Base Malt', supplier: 'Various' },
        { name: 'Rye Malt', yield: 78, color: 4, type: 'Base Malt', supplier: 'Various' },
        
        // Crystal/Caramel Malts
        { name: 'Crystal 20L', yield: 74, color: 20, type: 'Crystal Malt', supplier: 'Various' },
        { name: 'Crystal 40L', yield: 74, color: 40, type: 'Crystal Malt', supplier: 'Various' },
        { name: 'Crystal 60L', yield: 74, color: 60, type: 'Crystal Malt', supplier: 'Various' },
        { name: 'Crystal 80L', yield: 74, color: 80, type: 'Crystal Malt', supplier: 'Various' },
        { name: 'Crystal 120L', yield: 72, color: 120, type: 'Crystal Malt', supplier: 'Various' },
        
        // Roasted Malts
        { name: 'Chocolate Malt', yield: 70, color: 350, type: 'Roasted Malt', supplier: 'Various' },
        { name: 'Black Patent', yield: 65, color: 500, type: 'Roasted Malt', supplier: 'Various' },
        { name: 'Roasted Barley', yield: 70, color: 300, type: 'Roasted Malt', supplier: 'Various' },
        { name: 'Carafa II', yield: 70, color: 415, type: 'Roasted Malt', supplier: 'Weyermann' },
        
        // Specialty Malts
        { name: 'Biscuit Malt', yield: 75, color: 23, type: 'Specialty Malt', supplier: 'Dingemans' },
        { name: 'Victory Malt', yield: 75, color: 28, type: 'Specialty Malt', supplier: 'Briess' },
        { name: 'Special B', yield: 72, color: 180, type: 'Specialty Malt', supplier: 'Dingemans' },
        { name: 'Aromatic Malt', yield: 75, color: 26, type: 'Specialty Malt', supplier: 'Dingemans' },
        
        // Adjuncts
        { name: 'Flaked Oats', yield: 70, color: 2, type: 'Adjunct', supplier: 'Various' },
        { name: 'Flaked Wheat', yield: 75, color: 2, type: 'Adjunct', supplier: 'Various' },
        { name: 'Rice Hulls', yield: 0, color: 0, type: 'Adjunct', supplier: 'Various' },
        { name: 'Corn Sugar', yield: 100, color: 0, type: 'Sugar', supplier: 'Various' },
        { name: 'Cane Sugar', yield: 100, color: 0, type: 'Sugar', supplier: 'Various' },
        
        // Custom option
        { name: 'Custom Fermentable', yield: 80, color: 10, type: 'Custom', supplier: 'User Defined' }
      ],

      hops: [
        // American Hops
        { name: 'Cascade', alpha: 5.5, beta: 5.0, type: 'Aroma', origin: 'USA', profile: 'Citrus, Floral' },
        { name: 'Centennial', alpha: 10.0, beta: 4.5, type: 'Dual Purpose', origin: 'USA', profile: 'Citrus, Floral' },
        { name: 'Chinook', alpha: 13.0, beta: 4.0, type: 'Bittering', origin: 'USA', profile: 'Spicy, Piney' },
        { name: 'Citra', alpha: 12.0, beta: 4.0, type: 'Aroma', origin: 'USA', profile: 'Citrus, Tropical' },
        { name: 'Columbus', alpha: 14.0, beta: 4.5, type: 'Bittering', origin: 'USA', profile: 'Pungent, Herbal' },
        { name: 'Mosaic', alpha: 12.25, beta: 3.2, type: 'Aroma', origin: 'USA', profile: 'Tropical, Berry' },
        { name: 'Simcoe', alpha: 13.0, beta: 4.0, type: 'Dual Purpose', origin: 'USA', profile: 'Pine, Passion Fruit' },
        
        // German Hops
        { name: 'Hallertau', alpha: 4.5, beta: 4.0, type: 'Aroma', origin: 'Germany', profile: 'Mild, Herbal' },
        { name: 'Tettnang', alpha: 4.5, beta: 4.0, type: 'Aroma', origin: 'Germany', profile: 'Mild, Spicy' },
        { name: 'Spalt', alpha: 4.5, beta: 4.0, type: 'Aroma', origin: 'Germany', profile: 'Mild, Spicy' },
        { name: 'Magnum', alpha: 14.0, beta: 5.5, type: 'Bittering', origin: 'Germany', profile: 'Clean Bittering' },
        
        // English Hops
        { name: 'East Kent Goldings', alpha: 5.0, beta: 3.0, type: 'Aroma', origin: 'UK', profile: 'Earthy, Honey' },
        { name: 'Fuggle', alpha: 4.5, beta: 2.2, type: 'Aroma', origin: 'UK', profile: 'Earthy, Woody' },
        { name: 'Target', alpha: 11.0, beta: 4.8, type: 'Bittering', origin: 'UK', profile: 'Intense, Herbal' },
        
        // New World Hops
        { name: 'Nelson Sauvin', alpha: 12.0, beta: 6.0, type: 'Aroma', origin: 'New Zealand', profile: 'Wine, Tropical' },
        { name: 'Galaxy', alpha: 14.0, beta: 5.8, type: 'Aroma', origin: 'Australia', profile: 'Passion Fruit, Peach' },
        
        // Custom option
        { name: 'Custom Hop', alpha: 8.0, beta: 4.0, type: 'Custom', origin: 'User Defined', profile: 'Custom Profile' }
      ],

      yeast: [
        // Ale Yeasts
        { name: 'Safale US-05', type: 'Ale', attenuation: 81, temp: [59, 75], flocculation: 'Medium', supplier: 'Fermentis' },
        { name: 'Wyeast 1056', type: 'Ale', attenuation: 77, temp: [60, 72], flocculation: 'Low-Medium', supplier: 'Wyeast' },
        { name: 'White Labs WLP001', type: 'Ale', attenuation: 76, temp: [68, 73], flocculation: 'Medium', supplier: 'White Labs' },
        { name: 'Safale S-04', type: 'Ale', attenuation: 82, temp: [59, 75], flocculation: 'High', supplier: 'Fermentis' },
        { name: 'Wyeast 1968', type: 'Ale', attenuation: 72, temp: [64, 72], flocculation: 'High', supplier: 'Wyeast' },
        
        // Lager Yeasts
        { name: 'Saflager W-34/70', type: 'Lager', attenuation: 83, temp: [48, 59], flocculation: 'High', supplier: 'Fermentis' },
        { name: 'Wyeast 2124', type: 'Lager', attenuation: 75, temp: [46, 56], flocculation: 'Medium', supplier: 'Wyeast' },
        { name: 'White Labs WLP830', type: 'Lager', attenuation: 74, temp: [50, 55], flocculation: 'Medium', supplier: 'White Labs' },
        
        // Specialty Yeasts
        { name: 'Wyeast 3944', type: 'Belgian Wit', attenuation: 76, temp: [62, 75], flocculation: 'Medium', supplier: 'Wyeast' },
        { name: 'Lallemand Verdant IPA', type: 'IPA Specialist', attenuation: 75, temp: [64, 72], flocculation: 'Medium', supplier: 'Lallemand' },
        { name: 'Imperial A07 Flagship', type: 'Ale', attenuation: 77, temp: [64, 72], flocculation: 'Medium-High', supplier: 'Imperial' },
        
        // Custom option
        { name: 'Custom Yeast', type: 'Custom', attenuation: 75, temp: [65, 70], flocculation: 'Medium', supplier: 'User Defined' }
      ],

      equipment: [
        // Batch Sizes
        { name: '1 Gallon', volume: 1, type: 'batch_size' },
        { name: '5 Gallon', volume: 5, type: 'batch_size' },
        { name: '10 Gallon', volume: 10, type: 'batch_size' },
        { name: '15 Gallon', volume: 15, type: 'batch_size' },
        { name: '1 BBL (31 gal)', volume: 31, type: 'batch_size' },
        { name: '3 BBL (93 gal)', volume: 93, type: 'batch_size' },
        { name: '7 BBL (217 gal)', volume: 217, type: 'batch_size' },
        { name: '15 BBL (465 gal)', volume: 465, type: 'batch_size' },
        { name: 'Custom Size', volume: 5, type: 'batch_size' },
        
        // Efficiency Levels
        { name: 'Extract (100%)', efficiency: 100, type: 'efficiency' },
        { name: 'BIAB (75%)', efficiency: 75, type: 'efficiency' },
        { name: 'All Grain - Beginner (65%)', efficiency: 65, type: 'efficiency' },
        { name: 'All Grain - Intermediate (72%)', efficiency: 72, type: 'efficiency' },
        { name: 'All Grain - Advanced (78%)', efficiency: 78, type: 'efficiency' },
        { name: 'Commercial System (82%)', efficiency: 82, type: 'efficiency' },
        { name: 'Custom Efficiency', efficiency: 72, type: 'efficiency' }
      ]
    };
  }

  static getCommercialFormulas() {
    return {
      // Original Gravity Calculation (Enhanced)
      calculateOG: (fermentables, batchSize, efficiency) => {
        let totalPoints = 0;
        fermentables.forEach(fermentable => {
          const points = (fermentable.yield * fermentable.amount * efficiency / 100) / batchSize;
          totalPoints += points;
        });
        return 1 + (totalPoints / 1000);
      },

      // Final Gravity with Yeast Attenuation
      calculateFG: (og, yeastAttenuation = 75) => {
        const points = (og - 1) * 1000;
        const residualPoints = points * (1 - yeastAttenuation / 100);
        return 1 + (residualPoints / 1000);
      },

      // Enhanced IBU Calculation (Tinseth Formula)
      calculateIBUs: (hops, og, batchSize, boilTime = 60) => {
        let totalIBUs = 0;
        hops.forEach(hop => {
          const gravityFactor = 1.65 * Math.pow(0.000125, og - 1);
          const timeFactor = (1 - Math.exp(-0.04 * hop.time)) / 4.15;
          const utilization = gravityFactor * timeFactor;
          const ibus = (hop.alpha * hop.amount * utilization * 7490) / (batchSize * 1.05);
          totalIBUs += ibus;
        });
        return totalIBUs;
      },

      // SRM Color Calculation (Morey Equation)
      calculateSRM: (fermentables, batchSize) => {
        let mcu = 0;
        fermentables.forEach(fermentable => {
          mcu += (fermentable.color * fermentable.amount) / batchSize;
        });
        return 1.4922 * Math.pow(mcu, 0.6859);
      },

      // ABV Calculation (Multiple Methods)
      calculateABV: {
        simple: (og, fg) => (og - fg) * 131.25,
        advanced: (og, fg) => (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794),
        standard: (og, fg) => ((1.05 * (og - fg)) / fg) / 0.79 * 100
      },

      // Commercial Brewing Calculations
      commercial: {
        // Mash Water Calculations
        calculateStrikeWater: (grainWeight, mashRatio = 1.25) => grainWeight * mashRatio,
        
        calculateStrikeTemp: (targetTemp, grainTemp, mashRatio, tunThermalMass = 5) => {
          return ((0.2 / mashRatio) * (targetTemp - grainTemp)) + targetTemp + tunThermalMass;
        },

        // Sparge Water Calculation
        calculateSpargeWater: (batchSize, grainAbsorption = 0.125, deadSpace = 1) => {
          return (batchSize * 1.25) + (grainAbsorption) + deadSpace;
        },

        // Hop Utilization Factors
        getHopUtilization: (boilTime, gravity) => {
          const gravityFactor = 1.65 * Math.pow(0.000125, gravity - 1);
          const timeFactor = (1 - Math.exp(-0.04 * boilTime)) / 4.15;
          return gravityFactor * timeFactor;
        },

        // Yeast Pitching Rate (Cells per mL per °P)
        calculatePitchingRate: (og, batchSize, yeastType = 'ale') => {
          const plato = (-463.37) + (668.72 * og) - (205.35 * og * og);
          const cellsPerMl = yeastType === 'lager' ? 1.5 : 0.75; // Million cells
          const totalCells = batchSize * 3785.41 * plato * cellsPerMl; // Total billion cells needed
          return totalCells;
        },

        // Priming Sugar Calculation
        calculatePrimingSugar: (batchSize, targetCO2 = 2.4, temperature = 68) => {
          const residualCO2 = 3.0378 - (0.050062 * temperature) + (0.00026555 * temperature * temperature);
          const neededCO2 = targetCO2 - residualCO2;
          const cornSugar = (neededCO2 * batchSize * 15.195) / 1000; // oz
          return { cornSugar, caneSugar: cornSugar * 0.91, dme: cornSugar * 1.33 };
        },

        // Water Chemistry Adjustments
        calculateSaltAdditions: (sourceWater, targetWater, batchSize) => {
          const volume = batchSize; // gallons
          return {
            gypsum: ((targetWater.sulfate - sourceWater.sulfate) * volume) / 147.4,
            calciumChloride: ((targetWater.chloride - sourceWater.chloride) * volume) / 127.4,
            epsomSalt: ((targetWater.magnesium - sourceWater.magnesium) * volume) / 103.0,
            bakingSoda: ((targetWater.bicarbonate - sourceWater.bicarbonate) * volume) / 168.0
          };
        },

        // Alcohol Tolerance and Attenuation
        calculateRealAttenuation: (apparentAttenuation) => {
          return 0.8114 * apparentAttenuation;
        },

        // Bitterness to Gravity Ratio
        calculateBitterness: (ibus, og) => {
          return ibus / ((og - 1) * 1000);
        }
      }
    };
  }

  static getCommonValues() {
    return {
      batchSizes: [1, 2.5, 5, 10, 15, 31, 93, 217, 465], // gallons
      efficiencies: [65, 70, 72, 75, 78, 80, 82, 85], // percentages
      boilTimes: [30, 45, 60, 75, 90, 120], // minutes
      mashRatios: [1.0, 1.25, 1.5, 1.75, 2.0], // qt/lb
      fermentationTemps: {
        ale: [62, 65, 68, 70, 72, 75],
        lager: [45, 48, 50, 52, 55, 58],
        belgian: [68, 72, 75, 78, 80, 85]
      },
      carbonationLevels: [2.0, 2.2, 2.4, 2.6, 2.8, 3.0], // volumes CO2
      mashTemps: [148, 150, 152, 154, 156, 158] // °F
    };
  }
}

// Make available globally
window.CommercialBrewingData = CommercialBrewingData;