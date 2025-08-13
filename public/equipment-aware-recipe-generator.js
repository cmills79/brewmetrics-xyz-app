// Equipment-Aware Recipe Generator
// Scales recipes based on actual brewery equipment specifications

class EquipmentAwareRecipeGenerator {
    constructor() {
        this.equipmentConfig = null;
        this.init();
    }

    async init() {
        await this.loadBreweryEquipment();
    }

    async loadBreweryEquipment() {
        try {
            const breweryId = this.getBreweryId();
            const configDoc = await firebase.firestore()
                .collection('breweries')
                .doc(breweryId)
                .collection('configuration')
                .doc('equipment')
                .get();

            if (configDoc.exists) {
                this.equipmentConfig = configDoc.data();
                console.log('Loaded brewery equipment configuration:', this.equipmentConfig);
            } else {
                // Use default equipment assumptions
                this.equipmentConfig = this.getDefaultEquipmentConfig();
                console.log('Using default equipment configuration');
            }
        } catch (error) {
            console.error('Error loading equipment configuration:', error);
            this.equipmentConfig = this.getDefaultEquipmentConfig();
        }
    }

    getDefaultEquipmentConfig() {
        return {
            equipment: {
                mashTun: {
                    volume: 10,
                    efficiency: 75,
                    heatType: 'electric'
                },
                fermentation: {
                    fermenterSize: 7,
                    fermenterCount: 2,
                    temperatureControl: 'glycol',
                    pressureCapability: 'standard'
                },
                boilKettle: {
                    volume: 10,
                    heatType: 'electric',
                    efficiency: 85
                },
                additionalEquipment: {
                    whirlpool: true,
                    hopBack: false,
                    centrifuge: false,
                    filtration: false
                }
            }
        };
    }

    async generateEquipmentAwareRecipe(beerStyle, targetBatchSize, characteristics = {}) {
        if (!this.equipmentConfig) {
            await this.loadBreweryEquipment();
        }

        // Generate base recipe with professional brewing standards
        const baseRecipe = this.generateBaseRecipe(beerStyle, 5.0); // Start with 5-gallon base
        
        // Scale recipe based on equipment capabilities
        const scaledRecipe = this.scaleRecipeForEquipment(baseRecipe, targetBatchSize);
        
        // Optimize for professional brewing equipment
        const optimizedRecipe = this.optimizeForEquipment(scaledRecipe);
        
        // Generate equipment-specific instructions
        const instructions = this.generateEquipmentSpecificInstructions(optimizedRecipe);

        return {
            recipe: optimizedRecipe,
            instructions: instructions,
            equipmentNotes: this.generateEquipmentNotes(),
            scalingFactors: this.getScalingFactors(targetBatchSize)
        };
    }

    scaleRecipeForEquipment(baseRecipe, targetBatchSize) {
        const equipment = this.equipmentConfig.equipment;
        const scaleFactor = targetBatchSize / 5.0;
        
        // Check equipment constraints
        const maxBatchSize = this.calculateMaxBatchSize();
        if (targetBatchSize > maxBatchSize) {
            console.warn(`Target batch size ${targetBatchSize} exceeds equipment capacity ${maxBatchSize}`);
        }

        // Scale fermentables with equipment efficiency adjustments
        const scaledFermentables = baseRecipe.fermentables.map(fermentable => {
            const scaledAmount = fermentable.amount * scaleFactor;
            
            // Adjust for actual mash tun efficiency
            const efficiencyRatio = equipment.mashTun.efficiency / 75; // 75% is base assumption
            const adjustedAmount = scaledAmount / efficiencyRatio;
            
            return {
                ...fermentable,
                amount: Math.round(adjustedAmount * 100) / 100
            };
        });

        // Scale hops with equipment-specific utilization adjustments
        const scaledHops = baseRecipe.hops.map(hop => {
            let scaledAmount = hop.amount * scaleFactor;
            
            // Adjust hop utilization based on boil kettle type
            const utilizationFactor = this.getHopUtilizationFactor(hop, equipment.boilKettle);
            scaledAmount = scaledAmount / utilizationFactor;
            
            // Adjust for whirlpool availability
            if (hop.use === 'Whirlpool' && !equipment.additionalEquipment.whirlpool) {
                // Convert whirlpool additions to flameout additions
                hop.use = 'Aroma';
                hop.time = 0;
                scaledAmount = scaledAmount * 1.2; // Increase amount to compensate
            }
            
            return {
                ...hop,
                amount: Math.round(scaledAmount * 100) / 100
            };
        });

        // Scale yeast based on batch size and fermentation equipment
        const scaledYeast = baseRecipe.yeast.map(yeast => {
            let amount = yeast.amount;
            
            // Calculate yeast pitch rate based on actual batch size and equipment
            const pitchRate = this.calculateYeastPitchRate(targetBatchSize, baseRecipe.targetOG, equipment.fermentation);
            
            if (yeast.form === 'Liquid') {
                amount = Math.ceil(pitchRate / 100); // 100B cells per liquid pack
            } else {
                amount = Math.ceil(pitchRate / 200); // 200B cells per dry pack
            }
            
            return {
                ...yeast,
                amount: Math.max(1, amount)
            };
        });

        return {
            ...baseRecipe,
            name: `${baseRecipe.name} (${targetBatchSize} gal - Equipment Optimized)`,
            batchSize: targetBatchSize,
            fermentables: scaledFermentables,
            hops: scaledHops,
            yeast: scaledYeast,
            efficiency: equipment.mashTun.efficiency,
            equipmentOptimized: true
        };
    }

    optimizeForEquipment(recipe) {
        const equipment = this.equipmentConfig.equipment;
        let optimizedRecipe = { ...recipe };

        // Optimize mash schedule based on equipment
        optimizedRecipe.mashSchedule = this.optimizeMashSchedule(recipe, equipment.mashTun);
        
        // Optimize boil schedule based on kettle type
        optimizedRecipe.boilSchedule = this.optimizeBoilSchedule(recipe, equipment.boilKettle);
        
        // Optimize fermentation based on fermentation equipment
        optimizedRecipe.fermentationSchedule = this.optimizeFermentationSchedule(recipe, equipment.fermentation);
        
        // Add equipment-specific process notes
        optimizedRecipe.processNotes = this.generateProcessNotes(equipment);

        return optimizedRecipe;
    }

    optimizeMashSchedule(recipe, mashTun) {
        const schedule = [];
        
        // Base mash step
        let mashTemp = 152; // Default
        let mashTime = 60;   // Default
        
        // Adjust based on heat type
        if (mashTun.heatType === 'direct-fire') {
            mashTemp = 150; // Lower temp to avoid hot spots
            mashTime = 75;  // Longer time to compensate
            schedule.push({
                name: 'Protein Rest',
                temperature: 122,
                time: 15,
                notes: 'Recommended for direct-fire to improve clarity'
            });
        } else if (mashTun.heatType === 'steam-jacket') {
            mashTemp = 154; // Can run slightly higher
            mashTime = 45;  // More efficient heating
        }
        
        schedule.push({
            name: 'Saccharification Rest',
            temperature: mashTemp,
            time: mashTime,
            notes: `Optimized for ${mashTun.heatType} heating`
        });
        
        // Mash out
        schedule.push({
            name: 'Mash Out',
            temperature: 168,
            time: 10,
            notes: 'Stop enzyme activity'
        });
        
        return schedule;
    }

    optimizeBoilSchedule(recipe, boilKettle) {
        const schedule = [];
        let boilTime = 60; // Default
        
        // Adjust boil time based on kettle type
        if (boilKettle.heatType === 'direct-fire') {
            boilTime = 75; // Longer boil for better DMS removal
        } else if (boilKettle.heatType === 'steam-jacket') {
            boilTime = 45; // More efficient, can reduce time
        }
        
        // Add hop additions with equipment-specific timing
        recipe.hops.forEach(hop => {
            let adjustedTime = hop.time;
            
            // Adjust timing for different kettle types
            if (boilKettle.heatType === 'direct-fire' && hop.time > 0) {
                adjustedTime = Math.min(hop.time + 5, boilTime); // Add 5 min for direct fire
            }
            
            schedule.push({
                ingredient: `${hop.amount} oz ${hop.name}`,
                time: adjustedTime,
                type: 'Hop Addition',
                notes: hop.use === 'Whirlpool' ? 'Add during whirlpool at 170°F' : ''
            });
        });
        
        return {
            totalTime: boilTime,
            additions: schedule.sort((a, b) => b.time - a.time)
        };
    }

    optimizeFermentationSchedule(recipe, fermentation) {
        const schedule = [];
        const yeast = recipe.yeast[0];
        
        // Primary fermentation
        let primaryTemp = 66; // Default
        let primaryTime = 7;  // Default
        
        // Adjust based on temperature control capability
        if (fermentation.temperatureControl === 'glycol') {
            primaryTemp = 64; // Can run cooler with precise control
            primaryTime = 5;  // Faster with better control
        } else if (fermentation.temperatureControl === 'ambient') {
            primaryTemp = 68; // Run warmer for ambient
            primaryTime = 10; // Longer time needed
        }
        
        schedule.push({
            phase: 'Primary Fermentation',
            temperature: `${primaryTemp}°F`,
            duration: `${primaryTime} days`,
            notes: `Optimized for ${fermentation.temperatureControl} temperature control`
        });
        
        // Dry hop timing based on fermenter type
        const dryHops = recipe.hops.filter(h => h.use === 'Dry Hop');
        if (dryHops.length > 0) {
            let dryHopTiming = 'Day 3-4';
            
            if (fermentation.fermenterSize > 15) {
                dryHopTiming = 'Day 2-3'; // Larger fermenters can handle earlier
            }
            
            schedule.push({
                phase: 'Dry Hop Addition',
                temperature: `${primaryTemp}°F`,
                duration: '3 days',
                timing: dryHopTiming,
                notes: 'Add during active fermentation for biotransformation'
            });
        }
        
        // Conditioning
        schedule.push({
            phase: 'Conditioning',
            temperature: '35°F',
            duration: '7-14 days',
            notes: 'Cold conditioning for clarity and flavor maturation'
        });
        
        return schedule;
    }

    calculateMaxBatchSize() {
        const equipment = this.equipmentConfig.equipment;
        
        // Limiting factors
        const mashTunLimit = equipment.mashTun.volume * 0.8; // 80% capacity
        const fermenterLimit = equipment.fermentation.fermenterSize * 0.9; // 90% capacity
        const boilKettleLimit = equipment.boilKettle?.volume * 0.85 || mashTunLimit; // 85% capacity
        
        return Math.min(mashTunLimit, fermenterLimit, boilKettleLimit);
    }

    getHopUtilizationFactor(hop, boilKettle) {
        let factor = 1.0;
        
        // Base utilization by boil time
        const baseUtilization = {
            60: 0.30,
            45: 0.25,
            30: 0.20,
            15: 0.15,
            5: 0.10,
            0: 0.05
        };
        
        // Adjust for kettle type
        if (boilKettle.heatType === 'steam-jacket') {
            factor *= 1.1; // 10% better utilization
        } else if (boilKettle.heatType === 'direct-fire') {
            factor *= 0.95; // 5% lower utilization due to hot spots
        }
        
        // Adjust for batch size (larger batches = better utilization)
        const batchSizeFactor = Math.min(1.2, 1.0 + (this.targetBatchSize - 5) * 0.02);
        factor *= batchSizeFactor;
        
        return factor;
    }

    calculateYeastPitchRate(batchSize, og, fermentation) {
        // Base pitch rate: 0.75M cells/mL/°P for ales
        const plato = (og - 1) * 1000 / 4; // Rough conversion
        const basePitchRate = 0.75; // Million cells per mL per degree Plato
        
        // Volume in mL
        const volumeML = batchSize * 3785.41; // Gallons to mL
        
        // Calculate total cells needed
        let cellsNeeded = volumeML * basePitchRate * plato;
        
        // Adjust for fermentation equipment
        if (fermentation.temperatureControl === 'ambient') {
            cellsNeeded *= 1.2; // Need more yeast for temperature stress
        } else if (fermentation.temperatureControl === 'glycol') {
            cellsNeeded *= 0.9; // Can use less with precise control
        }
        
        // Adjust for fermenter size (larger = better yeast health)
        if (fermentation.fermenterSize > 15) {
            cellsNeeded *= 0.95;
        }
        
        return cellsNeeded / 1000000; // Convert to billions
    }

    generateEquipmentSpecificInstructions(recipe) {
        const equipment = this.equipmentConfig.equipment;
        const instructions = {
            overview: `Equipment-optimized brewing instructions for ${recipe.name}`,
            equipmentRequired: this.listRequiredEquipment(),
            sections: []
        };

        // Pre-brew setup
        instructions.sections.push({
            title: 'Equipment Setup & Preparation',
            duration: '30 minutes',
            steps: this.generateSetupSteps(equipment)
        });

        // Mashing
        instructions.sections.push({
            title: 'Mashing Process',
            duration: this.calculateMashDuration(recipe.mashSchedule),
            steps: this.generateMashSteps(recipe, equipment.mashTun)
        });

        // Boiling
        instructions.sections.push({
            title: 'Boil Process',
            duration: `${recipe.boilSchedule.totalTime} minutes`,
            steps: this.generateBoilSteps(recipe, equipment.boilKettle)
        });

        // Fermentation
        instructions.sections.push({
            title: 'Fermentation Management',
            duration: '2-3 weeks',
            steps: this.generateFermentationSteps(recipe, equipment.fermentation)
        });

        return instructions;
    }

    generateSetupSteps(equipment) {
        const steps = [
            'Verify all equipment is clean and sanitized',
            'Check temperature control systems are operational'
        ];

        if (equipment.mashTun.heatType === 'steam-jacket') {
            steps.push('Ensure steam boiler is at operating pressure');
        } else if (equipment.mashTun.heatType === 'direct-fire') {
            steps.push('Check gas connections and flame adjustment');
        }

        if (equipment.fermentation.temperatureControl === 'glycol') {
            steps.push('Verify glycol system is circulating at target temperature');
        }

        if (equipment.additionalEquipment.whirlpool) {
            steps.push('Prepare whirlpool system for post-boil hop additions');
        }

        return steps;
    }

    generateMashSteps(recipe, mashTun) {
        const steps = [];
        const totalGrain = recipe.fermentables.reduce((sum, f) => sum + f.amount, 0);
        
        // Calculate water volumes based on equipment
        const strikeWater = this.calculateStrikeWater(totalGrain, mashTun);
        const spargeWater = this.calculateSpargeWater(recipe.batchSize, strikeWater);

        steps.push(`Heat ${strikeWater} gallons of strike water to strike temperature`);
        
        if (mashTun.heatType === 'direct-fire') {
            steps.push('Use gentle flame to avoid scorching during mash');
            steps.push('Stir frequently to prevent hot spots');
        }

        recipe.mashSchedule.forEach(step => {
            steps.push(`${step.name}: Hold at ${step.temperature}°F for ${step.time} minutes`);
            if (step.notes) {
                steps.push(`Note: ${step.notes}`);
            }
        });

        steps.push(`Sparge with ${spargeWater} gallons at 170°F`);
        steps.push(`Target pre-boil volume: ${recipe.batchSize * 1.15} gallons`);

        return steps;
    }

    generateBoilSteps(recipe, boilKettle) {
        const steps = [
            'Bring wort to a vigorous rolling boil',
            `Maintain boil for ${recipe.boilSchedule.totalTime} minutes`
        ];

        if (boilKettle.heatType === 'direct-fire') {
            steps.push('Monitor flame to prevent scorching');
            steps.push('Adjust heat as needed to maintain steady boil');
        }

        recipe.boilSchedule.additions.forEach(addition => {
            if (addition.time > 0) {
                steps.push(`Add ${addition.ingredient} with ${addition.time} minutes remaining`);
            } else {
                steps.push(`Add ${addition.ingredient} at flameout`);
            }
            
            if (addition.notes) {
                steps.push(`Note: ${addition.notes}`);
            }
        });

        return steps;
    }

    generateFermentationSteps(recipe, fermentation) {
        const steps = [
            'Cool wort to fermentation temperature',
            'Transfer to sanitized fermenter',
            'Aerate wort thoroughly'
        ];

        recipe.fermentationSchedule.forEach(phase => {
            steps.push(`${phase.phase}: ${phase.temperature} for ${phase.duration}`);
            if (phase.timing) {
                steps.push(`Timing: ${phase.timing}`);
            }
            if (phase.notes) {
                steps.push(`Note: ${phase.notes}`);
            }
        });

        if (fermentation.temperatureControl === 'glycol') {
            steps.push('Monitor glycol system throughout fermentation');
        } else if (fermentation.temperatureControl === 'ambient') {
            steps.push('Monitor ambient temperature and adjust as needed');
        }

        return steps;
    }

    calculateStrikeWater(totalGrain, mashTun) {
        let ratio = 1.25; // Default quarts per pound
        
        // Adjust for mash tun type
        if (mashTun.heatType === 'direct-fire') {
            ratio = 1.5; // Thicker mash to prevent scorching
        } else if (mashTun.heatType === 'steam-jacket') {
            ratio = 1.2; // Can use thinner mash
        }
        
        return Math.round((totalGrain * ratio / 4) * 10) / 10; // Convert to gallons
    }

    calculateSpargeWater(batchSize, strikeWater) {
        const totalWater = batchSize * 1.5; // 1.5x batch size total water
        return Math.round((totalWater - strikeWater) * 10) / 10;
    }

    calculateMashDuration(mashSchedule) {
        const totalTime = mashSchedule.reduce((sum, step) => sum + step.time, 0);
        return `${totalTime + 30} minutes`; // Add 30 min for setup/transitions
    }

    generateEquipmentNotes() {
        const equipment = this.equipmentConfig.equipment;
        const notes = [];

        notes.push(`Mash Tun: ${equipment.mashTun.volume} BBL, ${equipment.mashTun.efficiency}% efficiency`);
        notes.push(`Heat Type: ${equipment.mashTun.heatType}`);
        notes.push(`Fermentation: ${equipment.fermentation.fermenterCount}x ${equipment.fermentation.fermenterSize} BBL fermenters`);
        notes.push(`Temperature Control: ${equipment.fermentation.temperatureControl}`);

        if (equipment.additionalEquipment.whirlpool) {
            notes.push('Whirlpool available for hop stands');
        }
        if (equipment.additionalEquipment.filtration) {
            notes.push('Filtration system available');
        }

        return notes;
    }

    getScalingFactors(targetBatchSize) {
        const baseBatchSize = 5.0;
        const equipment = this.equipmentConfig.equipment;
        
        return {
            volumeScale: targetBatchSize / baseBatchSize,
            efficiencyAdjustment: equipment.mashTun.efficiency / 75,
            equipmentCapacity: this.calculateMaxBatchSize(),
            recommendedBatchSize: Math.min(targetBatchSize, this.calculateMaxBatchSize())
        };
    }

    generateBaseRecipe(beerStyle, batchSize) {
        // Use the existing programmatic generator for base recipe
        if (window.ProgrammaticRecipeGenerator) {
            const generator = new ProgrammaticRecipeGenerator();
            return generator.generateRecipe(beerStyle, batchSize);
        }
        
        // Fallback basic recipe structure
        return {
            name: `${beerStyle} Recipe`,
            style: beerStyle,
            batchSize: batchSize,
            efficiency: 75,
            fermentables: [
                { name: 'Pale 2-Row', amount: 9, unit: 'lb', ppg: 37, lovibond: 2 }
            ],
            hops: [
                { name: 'Cascade', amount: 1, unit: 'oz', time: 60, alpha: 5.5, use: 'Boil' }
            ],
            yeast: [
                { name: 'US-05', amount: 1, unit: 'pkg', form: 'Dry', attenuation: 81 }
            ],
            targetOG: 1.050,
            targetFG: 1.010,
            targetABV: 5.2,
            targetIBU: 30
        };
    }

    listRequiredEquipment() {
        const equipment = this.equipmentConfig.equipment;
        const required = [];

        required.push(`Mash Tun: ${equipment.mashTun.volume} BBL capacity`);
        required.push(`Boil Kettle: ${equipment.boilKettle?.volume || equipment.mashTun.volume} BBL capacity`);
        required.push(`Fermenters: ${equipment.fermentation.fermenterCount}x ${equipment.fermentation.fermenterSize} BBL`);
        
        if (equipment.fermentation.temperatureControl === 'glycol') {
            required.push('Glycol cooling system');
        }
        
        if (equipment.additionalEquipment.whirlpool) {
            required.push('Whirlpool system');
        }
        
        return required;
    }

    getBreweryId() {
        // In production, get from authenticated user
        return 'demo-brewery';
    }
}

// Export for use in other modules
window.EquipmentAwareRecipeGenerator = EquipmentAwareRecipeGenerator;