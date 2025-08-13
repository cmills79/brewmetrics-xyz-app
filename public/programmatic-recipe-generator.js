class ProgrammaticRecipeGenerator {
    constructor() {
        this.styleDatabase = {
            'American IPA': {
                og: [1.056, 1.070], fg: [1.008, 1.014], abv: [5.5, 7.5], ibu: [40, 70], srm: [6, 14],
                baseGrains: [
                    { name: 'American 2-Row', percentage: [80, 90], yield: 82, lovibond: 2 }
                ],
                specialtyGrains: [
                    { name: 'Crystal 40L', percentage: [5, 15], yield: 75, lovibond: 40 },
                    { name: 'Munich Malt', percentage: [5, 10], yield: 80, lovibond: 9 }
                ],
                hops: [
                    { name: 'Cascade', aa: 5.5, use: 'Boil', time: 60 },
                    { name: 'Centennial', aa: 10.0, use: 'Boil', time: 15 },
                    { name: 'Citra', aa: 12.0, use: 'Dry Hop', time: 0 }
                ],
                yeast: { name: 'American Ale', strain: 'US-05', attenuation: 81, temp: [60, 72] },
                mash: { temp: 152, time: 60 },
                water: 'Burton on Trent'
            },
            'American Porter': {
                og: [1.050, 1.070], fg: [1.012, 1.018], abv: [4.8, 6.5], ibu: [25, 50], srm: [22, 40],
                baseGrains: [
                    { name: 'American 2-Row', percentage: [65, 75], yield: 82, lovibond: 2 }
                ],
                specialtyGrains: [
                    { name: 'Crystal 60L', percentage: [8, 12], yield: 75, lovibond: 60 },
                    { name: 'Chocolate Malt', percentage: [8, 12], yield: 75, lovibond: 350 },
                    { name: 'Black Patent', percentage: [2, 4], yield: 75, lovibond: 500 }
                ],
                hops: [
                    { name: 'Willamette', aa: 5.0, use: 'Boil', time: 60 },
                    { name: 'Cascade', aa: 5.5, use: 'Boil', time: 15 }
                ],
                yeast: { name: 'American Ale', strain: 'US-05', attenuation: 75, temp: [62, 72] },
                mash: { temp: 154, time: 60 },
                water: 'Balanced'
            },
            'Hazy IPA': {
                og: [1.060, 1.085], fg: [1.010, 1.016], abv: [6.0, 9.0], ibu: [25, 60], srm: [3, 7],
                baseGrains: [
                    { name: 'American 2-Row', percentage: [40, 50], yield: 82, lovibond: 2 },
                    { name: 'Wheat Malt', percentage: [20, 30], yield: 85, lovibond: 2 },
                    { name: 'Oats (Flaked)', percentage: [10, 20], yield: 70, lovibond: 1 }
                ],
                specialtyGrains: [
                    { name: 'Munich Malt', percentage: [5, 10], yield: 80, lovibond: 9 }
                ],
                hops: [
                    { name: 'Citra', aa: 12.0, use: 'Whirlpool', time: 20 },
                    { name: 'Mosaic', aa: 12.25, use: 'Dry Hop', time: 0 },
                    { name: 'Galaxy', aa: 14.0, use: 'Dry Hop', time: 0 }
                ],
                yeast: { name: 'London Ale III', strain: '1318', attenuation: 75, temp: [66, 70] },
                mash: { temp: 156, time: 60 },
                water: 'Soft'
            },
            'German Pilsner': {
                og: [1.044, 1.050], fg: [1.008, 1.013], abv: [4.4, 5.2], ibu: [25, 45], srm: [2, 5],
                baseGrains: [
                    { name: 'German Pilsner Malt', percentage: [95, 100], yield: 82, lovibond: 2 }
                ],
                specialtyGrains: [],
                hops: [
                    { name: 'Hallertau Mittelfrüh', aa: 4.0, use: 'Boil', time: 60 },
                    { name: 'Tettnang', aa: 4.5, use: 'Boil', time: 20 },
                    { name: 'Saaz', aa: 3.5, use: 'Boil', time: 5 }
                ],
                yeast: { name: 'German Lager', strain: '34/70', attenuation: 83, temp: [46, 56] },
                mash: { temp: 148, time: 90 },
                water: 'Soft'
            },
            'American Wheat': {
                og: [1.040, 1.055], fg: [1.008, 1.013], abv: [4.0, 5.5], ibu: [15, 30], srm: [3, 6],
                baseGrains: [
                    { name: 'American 2-Row', percentage: [50, 70], yield: 82, lovibond: 2 },
                    { name: 'Wheat Malt', percentage: [30, 50], yield: 85, lovibond: 2 }
                ],
                specialtyGrains: [],
                hops: [
                    { name: 'Cascade', aa: 5.5, use: 'Boil', time: 60 },
                    { name: 'Willamette', aa: 5.0, use: 'Boil', time: 15 }
                ],
                yeast: { name: 'American Ale', strain: 'US-05', attenuation: 78, temp: [62, 72] },
                mash: { temp: 152, time: 60 },
                water: 'Soft'
            }
        };

        this.waterProfiles = {
            'Burton on Trent': { ca: 295, mg: 45, na: 55, so4: 725, cl: 25 },
            'Balanced': { ca: 100, mg: 15, na: 10, so4: 150, cl: 100 },
            'Soft': { ca: 50, mg: 5, na: 5, so4: 50, cl: 50 }
        };
    }

    generateRecipe(styleName, batchSize = 5, options = {}) {
        const style = this.styleDatabase[styleName];
        if (!style) throw new Error(`Style ${styleName} not found`);

        const targetOG = this.randomInRange(style.og);
        const targetFG = this.randomInRange(style.fg);
        const targetIBU = this.randomInRange(style.ibu);
        const targetSRM = this.randomInRange(style.srm);

        const grainBill = this.calculateGrainBill(style, targetOG, batchSize);
        const hopSchedule = this.calculateHopSchedule(style, targetIBU, batchSize);
        const yeastInfo = this.calculateYeast(style, batchSize, targetOG);

        return {
            recipe_id: `${styleName.replace(/\s+/g, '_')}_${Date.now()}`,
            recipe_name: styleName,
            beer_style: { primary_style: styleName },
            author: "Programmatic_Generator_v1",
            version: 1.0,
            batch_info: {
                batch_size_gallons: batchSize,
                pre_boil_gallons: Math.round(batchSize * 1.15 * 10) / 10,
                post_boil_gallons: Math.round(batchSize * 1.05 * 10) / 10,
                efficiency_percent: 75.0
            },
            target_parameters: {
                original_gravity_sg: Math.round(targetOG * 1000) / 1000,
                final_gravity_sg: Math.round(targetFG * 1000) / 1000,
                abv_percent: Math.round(((targetOG - targetFG) * 131.25) * 10) / 10,
                ibu_tinseth: Math.round(targetIBU),
                srm_morey: Math.round(targetSRM)
            },
            ingredients: {
                fermentables: grainBill,
                hops: hopSchedule,
                yeast: yeastInfo,
                water_chemistry: this.getWaterProfile(style.water),
                other_ingredients: []
            },
            process: {
                mash_schedule: [{
                    name: "Single infusion mash",
                    temperature_f: style.mash.temp,
                    duration_minutes: style.mash.time,
                    type: "Infusion"
                }],
                boil_duration_minutes: 60,
                fermentation_schedule: [{
                    name: "Primary Fermentation",
                    temperature_f: style.yeast.temp[0],
                    duration_days: style.yeast.strain.includes('34/70') ? 14 : 7
                }]
            },
            notes: {
                brewing_notes: `Classic ${styleName} recipe generated using traditional proportions and techniques.`,
                tasting_notes: `Traditional ${styleName} characteristics with balanced flavor profile.`
            }
        };
    }

    randomInRange(range) {
        return range[0] + Math.random() * (range[1] - range[0]);
    }

    calculateGrainBill(style, targetOG, batchSize) {
        const totalPoints = (targetOG - 1) * 1000 * batchSize;
        const totalLbs = totalPoints / (0.75 * 46); // 75% efficiency, 46 points per pound per gallon

        let grainBill = [];
        let remainingPercentage = 100;

        // Base grains
        style.baseGrains.forEach(grain => {
            const percentage = this.randomInRange(grain.percentage);
            const weight = Math.round((totalLbs * percentage / 100) * 10) / 10;
            grainBill.push({
                name: grain.name,
                weight_lbs: weight,
                percentage: Math.round(percentage * 10) / 10,
                type: "Base Malt",
                yield_percent: grain.yield,
                color_lovibond: grain.lovibond
            });
            remainingPercentage -= percentage;
        });

        // Specialty grains
        style.specialtyGrains.forEach(grain => {
            if (remainingPercentage > 0) {
                const maxPercentage = Math.min(this.randomInRange(grain.percentage), remainingPercentage);
                const weight = Math.round((totalLbs * maxPercentage / 100) * 10) / 10;
                if (weight > 0.1) {
                    grainBill.push({
                        name: grain.name,
                        weight_lbs: weight,
                        percentage: Math.round(maxPercentage * 10) / 10,
                        type: "Specialty Malt",
                        yield_percent: grain.yield,
                        color_lovibond: grain.lovibond
                    });
                    remainingPercentage -= maxPercentage;
                }
            }
        });

        return grainBill;
    }

    calculateHopSchedule(style, targetIBU, batchSize) {
        const hopSchedule = [];
        let remainingIBU = targetIBU;

        style.hops.forEach((hop, index) => {
            const ibuContribution = index === 0 ? remainingIBU * 0.7 : remainingIBU * 0.3;
            const utilization = hop.time === 60 ? 0.3 : hop.time === 15 ? 0.15 : hop.time === 5 ? 0.05 : 0;
            
            let amount;
            if (hop.use === 'Dry Hop') {
                amount = Math.round((batchSize * 0.5) * 10) / 10; // 0.5 oz per gallon for dry hop
            } else {
                amount = Math.round((ibuContribution * batchSize * 1.05) / (hop.aa * utilization * 75) * 10) / 10;
            }

            hopSchedule.push({
                name: hop.name,
                alpha_acid_percent: hop.aa,
                amount_oz: amount,
                use: hop.use,
                time_minutes: hop.time,
                notes: hop.use === 'Dry Hop' ? 'Aroma and flavor' : `Bitterness: ${Math.round(ibuContribution)} IBU`
            });

            remainingIBU -= ibuContribution;
        });

        return hopSchedule;
    }

    calculateYeast(style, batchSize, targetOG) {
        const cellsNeeded = batchSize * 3.785 * (targetOG - 1) * 1000 * 0.75; // 0.75M cells/mL/°P
        const packetsNeeded = Math.ceil(cellsNeeded / 11500000000); // 11.5B cells per packet

        return {
            name: style.yeast.name,
            strain_code: style.yeast.strain,
            type: style.yeast.strain.includes('34/70') ? 'Lager' : 'Ale',
            form: "Dry",
            packets_needed: packetsNeeded,
            attenuation_percent: style.yeast.attenuation,
            optimum_temp_f: `${style.yeast.temp[0]}-${style.yeast.temp[1]}`
        };
    }

    getWaterProfile(profileName) {
        const profile = this.waterProfiles[profileName];
        return {
            target_profile_name: profileName,
            mash_ph: 5.4,
            ions_ppm: {
                calcium: profile.ca,
                magnesium: profile.mg,
                sodium: profile.na,
                sulfate: profile.so4,
                chloride: profile.cl
            }
        };
    }

    getAvailableStyles() {
        return Object.keys(this.styleDatabase);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgrammaticRecipeGenerator;
}