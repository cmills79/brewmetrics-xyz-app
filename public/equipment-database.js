// Brewing Equipment Database with Brand/Model/Efficiency Data
class EquipmentDatabase {
    constructor() {
        this.equipment = {
            mashTuns: [
                // Premium Brands (base efficiency before modifiers)
                { brand: 'Premier Stainless', model: 'PSS-MT-7BBL', efficiency: 78, heatType: 'steam-jacket', price: 'Premium' },
                { brand: 'Premier Stainless', model: 'PSS-MT-15BBL', efficiency: 78, heatType: 'steam-jacket', price: 'Premium' },
                { brand: 'Stout Tanks', model: 'ST-MT-10BBL', efficiency: 76, heatType: 'electric', price: 'Premium' },
                { brand: 'DME Brewing', model: 'DME-MT-20BBL', efficiency: 79, heatType: 'steam-jacket', price: 'Premium' },
                { brand: 'Psycho Brew', model: 'PB-MT-7BBL', efficiency: 77, heatType: 'direct-fire', price: 'Premium' },
                
                // Mid-Range Brands
                { brand: 'Blichmann Engineering', model: 'BrewEasy-20G', efficiency: 74, heatType: 'electric', price: 'Mid-Range' },
                { brand: 'Ss Brewtech', model: 'BME-MT-1BBL', efficiency: 73, heatType: 'electric', price: 'Mid-Range' },
                { brand: 'Chapman Brewing', model: 'CB-MT-5BBL', efficiency: 72, heatType: 'direct-fire', price: 'Mid-Range' },
                { brand: 'Spike Brewing', model: 'SP-MT-3.5BBL', efficiency: 73, heatType: 'electric', price: 'Mid-Range' },
                
                // Budget Options
                { brand: 'Custom Fabricated', model: 'Local Fab Shop', efficiency: 75, heatType: 'direct-fire', price: 'Budget' },
                { brand: 'Used Equipment', model: 'Refurbished System', efficiency: 75, heatType: 'various', price: 'Budget' },
                { brand: 'Other', model: 'Custom Entry', efficiency: 75, heatType: 'various', price: 'Various' }
            ],
            
            fermenters: [
                // Premium Conical Fermenters
                { brand: 'Premier Stainless', model: 'PSS-CF-15BBL', type: 'conical', tempControl: 'glycol', efficiency: 95, price: 'Premium' },
                { brand: 'Stout Tanks', model: 'ST-CF-20BBL', type: 'conical', tempControl: 'glycol', efficiency: 94, price: 'Premium' },
                { brand: 'DME Brewing', model: 'DME-CF-30BBL', type: 'conical', tempControl: 'glycol', efficiency: 96, price: 'Premium' },
                
                // Mid-Range Conical
                { brand: 'Ss Brewtech', model: 'Unitank-7BBL', type: 'conical', tempControl: 'glycol', efficiency: 92, price: 'Mid-Range' },
                { brand: 'Chapman Brewing', model: 'CB-CF-10BBL', type: 'conical', tempControl: 'immersion', efficiency: 90, price: 'Mid-Range' },
                { brand: 'Blichmann Engineering', model: 'Fermenator-1BBL', type: 'conical', tempControl: 'immersion', efficiency: 88, price: 'Mid-Range' },
                
                // Horizontal Tanks
                { brand: 'Premier Stainless', model: 'PSS-HT-20BBL', type: 'horizontal', tempControl: 'glycol', efficiency: 93, price: 'Premium' },
                { brand: 'Stout Tanks', model: 'ST-HT-30BBL', type: 'horizontal', tempControl: 'glycol', efficiency: 92, price: 'Premium' },
                
                // Budget Options
                { brand: 'Custom Fabricated', model: 'Local Fab Tank', type: 'conical', tempControl: 'ambient', efficiency: 85, price: 'Budget' },
                { brand: 'Used Equipment', model: 'Refurbished Tank', type: 'various', tempControl: 'various', efficiency: 82, price: 'Budget' },
                { brand: 'Other', model: 'Custom Entry', type: 'conical', tempControl: 'glycol', efficiency: 90, price: 'Various' }
            ],
            
            boilKettles: [
                // Premium Steam Kettles
                { brand: 'Premier Stainless', model: 'PSS-BK-15BBL', heatType: 'steam-jacket', efficiency: 92, price: 'Premium' },
                { brand: 'Stout Tanks', model: 'ST-BK-20BBL', heatType: 'steam-jacket', efficiency: 91, price: 'Premium' },
                { brand: 'DME Brewing', model: 'DME-BK-30BBL', heatType: 'steam-jacket', efficiency: 94, price: 'Premium' },
                
                // Direct Fire Kettles
                { brand: 'Premier Stainless', model: 'PSS-DF-10BBL', heatType: 'direct-fire', efficiency: 88, price: 'Premium' },
                { brand: 'Psycho Brew', model: 'PB-DF-7BBL', heatType: 'direct-fire', efficiency: 86, price: 'Mid-Range' },
                { brand: 'Chapman Brewing', model: 'CB-DF-5BBL', heatType: 'direct-fire', efficiency: 84, price: 'Mid-Range' },
                
                // Electric Kettles
                { brand: 'Blichmann Engineering', model: 'BoilCoil-20G', heatType: 'electric', efficiency: 89, price: 'Mid-Range' },
                { brand: 'Ss Brewtech', model: 'BME-BK-1BBL', heatType: 'electric', efficiency: 87, price: 'Mid-Range' },
                
                // Budget Options
                { brand: 'Custom Fabricated', model: 'Local Fab Kettle', heatType: 'direct-fire', efficiency: 82, price: 'Budget' },
                { brand: 'Other', model: 'Custom Entry', heatType: 'various', efficiency: 85, price: 'Various' }
            ],
            
            heatExchangers: [
                { brand: 'Premier Stainless', model: 'PSS-PHE-15BBL', type: 'plate', efficiency: 95, price: 'Premium' },
                { brand: 'Stout Tanks', model: 'ST-PHE-20BBL', type: 'plate', efficiency: 94, price: 'Premium' },
                { brand: 'Blichmann Engineering', model: 'Therminator', type: 'plate', efficiency: 92, price: 'Mid-Range' },
                { brand: 'Ss Brewtech', model: 'FTSs Chiller', type: 'coil', efficiency: 88, price: 'Mid-Range' },
                { brand: 'Chapman Brewing', model: 'CB-IC-Coil', type: 'immersion', efficiency: 85, price: 'Budget' },
                { brand: 'Other', model: 'Custom Entry', type: 'plate', efficiency: 90, price: 'Various' }
            ],
            
            pumps: [
                { brand: 'March Pump', model: 'March 809-SS', type: 'centrifugal', efficiency: 85, price: 'Mid-Range' },
                { brand: 'Chugger Pumps', model: 'X-Dry', type: 'centrifugal', efficiency: 83, price: 'Mid-Range' },
                { brand: 'Grundfos', model: 'CM-SS', type: 'centrifugal', efficiency: 88, price: 'Premium' },
                { brand: 'Wilden', model: 'P4-SS', type: 'diaphragm', efficiency: 90, price: 'Premium' },
                { brand: 'Other', model: 'Custom Entry', type: 'centrifugal', efficiency: 85, price: 'Various' }
            ]
        };
    }

    getEquipmentByCategory(category) {
        return this.equipment[category] || [];
    }

    getEquipmentById(category, brand, model) {
        const categoryEquipment = this.equipment[category] || [];
        return categoryEquipment.find(item => item.brand === brand && item.model === model);
    }

    getAllBrands(category) {
        const categoryEquipment = this.equipment[category] || [];
        return [...new Set(categoryEquipment.map(item => item.brand))];
    }

    getModelsByBrand(category, brand) {
        const categoryEquipment = this.equipment[category] || [];
        return categoryEquipment.filter(item => item.brand === brand);
    }

    calculateEfficiency(baseEfficiency, heatType, volume, brand, additionalEquipment = {}) {
        let efficiency = baseEfficiency;
        
        // Heat type modifiers (more precise)
        const heatModifiers = {
            'steam-jacket': 8,    // +8% for even heating and precise control
            'electric': 5,        // +5% for precise temperature control
            'direct-fire': -3,    // -3% for hot spots and temperature variation
            'various': 0          // No modifier for mixed/unknown
        };
        
        // Volume efficiency curve (optimized for commercial brewing)
        let volumeModifier = 0;
        if (volume >= 30) volumeModifier = 6;      // Large commercial systems
        else if (volume >= 20) volumeModifier = 5; // Mid-large systems
        else if (volume >= 15) volumeModifier = 4; // Standard commercial
        else if (volume >= 10) volumeModifier = 3; // Small commercial
        else if (volume >= 7) volumeModifier = 2;  // Nano brewery
        else if (volume >= 5) volumeModifier = 1;  // Micro systems
        else if (volume >= 3) volumeModifier = 0;  // Small pilot
        else volumeModifier = -4;                  // Very small systems
        
        // Brand quality modifiers (refined based on industry reputation)
        const brandModifiers = {
            'Premier Stainless': 4,      // Top tier equipment
            'DME Brewing': 5,            // Industry leader
            'Stout Tanks': 3,            // High quality
            'Psycho Brew': 2,            // Good quality
            'Blichmann Engineering': 2,   // Precision equipment
            'Ss Brewtech': 1,            // Good mid-range
            'Chapman Brewing': 0,        // Standard quality
            'Spike Brewing': 0,          // Standard quality
            'Custom Fabricated': -6,     // Variable quality
            'Used Equipment': -8,        // Wear and unknown condition
            'Other': -2                  // Unknown quality
        };
        
        // Additional equipment bonuses
        let equipmentBonus = 0;
        if (additionalEquipment.whirlpool) equipmentBonus += 2;  // Better hop utilization
        if (additionalEquipment.hopBack) equipmentBonus += 1;    // Aroma extraction
        if (additionalEquipment.centrifuge) equipmentBonus += 1; // Clarity improvement
        if (additionalEquipment.filtration) equipmentBonus += 1; // Final quality
        
        // Apply all modifiers
        efficiency += heatModifiers[heatType] || 0;
        efficiency += volumeModifier;
        efficiency += brandModifiers[brand] || 0;
        efficiency += equipmentBonus;
        
        // Professional brewing systems should have higher baseline
        const professionalBonus = volume >= 7 ? 2 : 0;
        efficiency += professionalBonus;
        
        return Math.max(65, Math.min(96, efficiency)); // Clamp between 65-96%
    }
    
    getEfficiencyRange(category, priceRange) {
        const categoryEquipment = this.equipment[category] || [];
        const filtered = priceRange ? categoryEquipment.filter(item => item.price === priceRange) : categoryEquipment;
        
        if (filtered.length === 0) return { min: 70, max: 85 };
        
        const efficiencies = filtered.map(item => item.efficiency);
        return {
            min: Math.min(...efficiencies),
            max: Math.max(...efficiencies),
            avg: Math.round(efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length)
        };
    }
}

// Global instance
window.equipmentDatabase = new EquipmentDatabase();