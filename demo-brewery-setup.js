// Comprehensive Demo Brewery Setup - Copper Creek Brewing Co.
// Complete brewery with equipment, inventory, 3 batches, and 300+ survey responses

const demoBreweryData = {
    // Brewery Profile
    brewery: {
        name: "Copper Creek Brewing Co.",
        location: "Boulder, Colorado",
        established: "2019",
        brewmaster: "Sarah Mitchell",
        style: "Craft Brewery specializing in IPAs and Stouts",
        capacity: "15 BBL System",
        logo: "brewery-logos/copper-creek-logo.png"
    },

    // Complete Equipment Setup
    equipment: {
        mashTun: {
            brand: "Stout Tanks and Kettles",
            model: "15 BBL Mash Tun",
            capacity: 15,
            efficiency: 78,
            heatType: "steam",
            temperatureControl: "automated"
        },
        boilKettle: {
            brand: "Stout Tanks and Kettles", 
            model: "15 BBL Brew Kettle",
            capacity: 15,
            heatType: "steam",
            efficiency: 85
        },
        fermenters: [
            {
                brand: "Premier Stainless Systems",
                model: "15 BBL Conical Fermenter",
                capacity: 15,
                temperatureControl: "glycol",
                quantity: 4
            },
            {
                brand: "Premier Stainless Systems",
                model: "30 BBL Conical Fermenter", 
                capacity: 30,
                temperatureControl: "glycol",
                quantity: 2
            }
        ],
        chiller: {
            brand: "Hydro Innovations",
            model: "Glycol Chiller 5HP",
            capacity: "5HP"
        },
        mill: {
            brand: "Country Malt Group",
            model: "2-Roller Mill",
            efficiency: 82
        }
    },

    // Comprehensive Inventory
    inventory: {
        malts: [
            {
                name: "Pilsner Malt (German)",
                supplier: "Weyermann",
                stock: 2000,
                unit: "lbs",
                cost: 1.25,
                extractYield: 82,
                color: 1.7,
                category: "Base Malt"
            },
            {
                name: "Pale Ale Malt (American)",
                supplier: "Great Western Malting",
                stock: 1500,
                unit: "lbs", 
                cost: 1.15,
                extractYield: 80,
                color: 3.5,
                category: "Base Malt"
            },
            {
                name: "Munich Malt",
                supplier: "Weyermann",
                stock: 500,
                unit: "lbs",
                cost: 1.35,
                extractYield: 78,
                color: 9,
                category: "Specialty Malt"
            },
            {
                name: "Crystal 60L",
                supplier: "Briess",
                stock: 300,
                unit: "lbs",
                cost: 1.65,
                extractYield: 75,
                color: 60,
                category: "Crystal Malt"
            },
            {
                name: "Chocolate Malt",
                supplier: "Crisp Malting",
                stock: 200,
                unit: "lbs",
                cost: 1.85,
                extractYield: 70,
                color: 450,
                category: "Roasted Malt"
            }
        ],
        hops: [
            {
                name: "Centennial",
                supplier: "Yakima Chief Hops",
                stock: 25,
                unit: "lbs",
                cost: 18.50,
                alphaAcid: 9.5,
                betaAcid: 4.2,
                category: "Aroma Hop",
                harvestYear: 2023
            },
            {
                name: "Cascade",
                supplier: "Yakima Chief Hops", 
                stock: 30,
                unit: "lbs",
                cost: 16.75,
                alphaAcid: 6.8,
                betaAcid: 5.1,
                category: "Dual Purpose",
                harvestYear: 2023
            },
            {
                name: "Simcoe",
                supplier: "Hop Head Farms",
                stock: 20,
                unit: "lbs",
                cost: 22.00,
                alphaAcid: 12.1,
                betaAcid: 4.8,
                category: "Bittering Hop",
                harvestYear: 2023
            }
        ],
        yeast: [
            {
                name: "SafAle US-05",
                supplier: "Fermentis",
                stock: 50,
                unit: "packets",
                cost: 3.25,
                attenuation: 81,
                flocculation: "medium",
                temperatureRange: "59-75°F",
                category: "Ale Yeast"
            },
            {
                name: "Wyeast 1056",
                supplier: "Wyeast Laboratories",
                stock: 20,
                unit: "vials",
                cost: 8.50,
                attenuation: 75,
                flocculation: "low-medium", 
                temperatureRange: "60-72°F",
                category: "Ale Yeast"
            }
        ]
    },

    // Batch 1: Failed IPA (Poor Reviews)
    batch1: {
        batchInfo: {
            batchNumber: "IPA-001",
            beerName: "Copper Creek IPA v1.0",
            style: "American IPA",
            brewDate: "2024-01-15",
            packageDate: "2024-02-12",
            abv: 6.2,
            ibu: 65,
            srm: 8,
            batchSize: 15,
            status: "completed"
        },
        recipe: {
            malts: [
                { name: "Pale Ale Malt", amount: 280, unit: "lbs" },
                { name: "Crystal 60L", amount: 35, unit: "lbs" },
                { name: "Munich Malt", amount: 20, unit: "lbs" }
            ],
            hops: [
                { name: "Centennial", amount: 2.5, time: 60, usage: "bittering" },
                { name: "Cascade", amount: 2.0, time: 15, usage: "flavor" },
                { name: "Simcoe", amount: 3.0, time: 0, usage: "aroma" }
            ],
            yeast: { name: "SafAle US-05", amount: 3, unit: "packets" },
            waterProfile: "Burton-on-Trent",
            mashTemp: 152,
            boilTime: 60
        },
        issues: [
            "Fermentation temperature too high (78°F)",
            "Insufficient dry hopping",
            "Over-bittered for style",
            "Poor water chemistry balance"
        ]
    },

    // Batch 2: Successful Stout (Great Reviews)  
    batch2: {
        batchInfo: {
            batchNumber: "STT-001", 
            beerName: "Midnight Creek Stout",
            style: "American Stout",
            brewDate: "2024-02-20",
            packageDate: "2024-03-18",
            abv: 5.8,
            ibu: 35,
            srm: 40,
            batchSize: 15,
            status: "completed"
        },
        recipe: {
            malts: [
                { name: "Pale Ale Malt", amount: 220, unit: "lbs" },
                { name: "Munich Malt", amount: 45, unit: "lbs" },
                { name: "Crystal 60L", amount: 25, unit: "lbs" },
                { name: "Chocolate Malt", amount: 35, unit: "lbs" }
            ],
            hops: [
                { name: "Centennial", amount: 1.8, time: 60, usage: "bittering" },
                { name: "Cascade", amount: 1.0, time: 15, usage: "flavor" }
            ],
            yeast: { name: "Wyeast 1056", amount: 2, unit: "vials" },
            waterProfile: "Dublin",
            mashTemp: 154,
            boilTime: 60
        }
    },

    // Batch 3: Improved IPA (Excellent Reviews)
    batch3: {
        batchInfo: {
            batchNumber: "IPA-002",
            beerName: "Copper Creek IPA v2.0", 
            style: "American IPA",
            brewDate: "2024-03-25",
            packageDate: "2024-04-22",
            abv: 6.8,
            ibu: 55,
            srm: 6,
            batchSize: 15,
            status: "completed"
        },
        recipe: {
            malts: [
                { name: "Pilsner Malt", amount: 260, unit: "lbs" },
                { name: "Munich Malt", amount: 30, unit: "lbs" },
                { name: "Crystal 60L", amount: 15, unit: "lbs" }
            ],
            hops: [
                { name: "Centennial", amount: 1.8, time: 60, usage: "bittering" },
                { name: "Cascade", amount: 2.5, time: 15, usage: "flavor" },
                { name: "Simcoe", amount: 2.0, time: 5, usage: "aroma" },
                { name: "Centennial", amount: 2.5, time: "dry hop", usage: "aroma" }
            ],
            yeast: { name: "SafAle US-05", amount: 3, unit: "packets" },
            waterProfile: "Balanced",
            mashTemp: 149,
            boilTime: 60
        },
        improvements: [
            "Controlled fermentation temperature (66°F)",
            "Added dry hopping phase",
            "Reduced bittering hops",
            "Improved water chemistry",
            "Lower mash temperature for better attenuation"
        ]
    }
};

// Survey Response Generator
function generateSurveyResponses(batchNumber, beerName, responseType) {
    const responses = [];
    const deviceFingerprints = [];
    
    // Generate unique device fingerprints
    for (let i = 0; i < 120; i++) {
        deviceFingerprints.push({
            screenResolution: `${Math.floor(Math.random() * 500) + 1200}x${Math.floor(Math.random() * 300) + 800}`,
            userAgent: `Mozilla/5.0 (${['Windows NT 10.0', 'Macintosh', 'X11; Linux x86_64'][Math.floor(Math.random() * 3)]})`,
            language: ['en-US', 'en-GB', 'en-CA'][Math.floor(Math.random() * 3)],
            timezone: ['America/Denver', 'America/New_York', 'America/Los_Angeles'][Math.floor(Math.random() * 3)]
        });
    }

    for (let i = 0; i < 120; i++) {
        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        let ratings, feedback;
        
        if (responseType === 'poor') {
            // Poor ratings for failed IPA
            ratings = {
                overall: Math.floor(Math.random() * 3) + 1, // 1-3
                aroma: Math.floor(Math.random() * 3) + 1,
                appearance: Math.floor(Math.random() * 2) + 3, // 3-4
                flavor: Math.floor(Math.random() * 3) + 1,
                mouthfeel: Math.floor(Math.random() * 3) + 2
            };
            
            const poorFeedback = [
                "Too bitter, harsh finish",
                "Lacks hop aroma, overpowering bitterness",
                "Tastes hot, possible fermentation issues",
                "Not balanced, too aggressive",
                "Missing the citrus notes I expect in an IPA",
                "Bitter without the hop character",
                "Needs more aroma hops",
                "Fermentation off-flavors detected",
                "Too harsh, not smooth",
                "Disappointing for an IPA"
            ];
            feedback = poorFeedback[Math.floor(Math.random() * poorFeedback.length)];
            
        } else if (responseType === 'excellent') {
            // Excellent ratings for improved IPA
            ratings = {
                overall: Math.floor(Math.random() * 2) + 4, // 4-5
                aroma: Math.floor(Math.random() * 2) + 4,
                appearance: Math.floor(Math.random() * 2) + 4,
                flavor: Math.floor(Math.random() * 2) + 4,
                mouthfeel: Math.floor(Math.random() * 2) + 4
            };
            
            const excellentFeedback = [
                "Perfect balance of hops and malt!",
                "Amazing citrus aroma, great dry hopping",
                "This is what an IPA should taste like",
                "Excellent improvement from the first version",
                "Beautiful hop character, well balanced",
                "Clean fermentation, great hop profile",
                "Love the citrus and pine notes",
                "Perfect bitterness level",
                "Outstanding beer, will definitely order again",
                "Best IPA I've had in Boulder!"
            ];
            feedback = excellentFeedback[Math.floor(Math.random() * excellentFeedback.length)];
            
        } else {
            // Good ratings for stout
            ratings = {
                overall: Math.floor(Math.random() * 2) + 4, // 4-5
                aroma: Math.floor(Math.random() * 2) + 4,
                appearance: 5, // Stouts usually look great
                flavor: Math.floor(Math.random() * 2) + 4,
                mouthfeel: Math.floor(Math.random() * 2) + 4
            };
            
            const stoutFeedback = [
                "Rich chocolate and coffee notes",
                "Smooth and creamy, perfect stout",
                "Great roasted malt character",
                "Well balanced, not too bitter",
                "Love the chocolate finish",
                "Perfect for a cold evening",
                "Excellent roasted flavors",
                "Smooth mouthfeel, great body",
                "Classic stout done right",
                "Rich and satisfying"
            ];
            feedback = stoutFeedback[Math.floor(Math.random() * stoutFeedback.length)];
        }

        responses.push({
            id: `survey_${batchNumber}_${i + 1}`,
            batchNumber,
            beerName,
            timestamp: timestamp.toISOString(),
            deviceFingerprint: deviceFingerprints[i],
            ratings,
            feedback,
            customerType: Math.random() > 0.7 ? 'returning' : 'new',
            location: ['Boulder, CO', 'Denver, CO', 'Fort Collins, CO'][Math.floor(Math.random() * 3)],
            ageGroup: ['21-30', '31-40', '41-50', '51+'][Math.floor(Math.random() * 4)],
            beerExperience: ['Novice', 'Intermediate', 'Expert'][Math.floor(Math.random() * 3)]
        });
    }
    
    return responses;
}

// Generate all survey responses
const allSurveyData = {
    batch1Responses: generateSurveyResponses('IPA-001', 'Copper Creek IPA v1.0', 'poor'),
    batch2Responses: generateSurveyResponses('STT-001', 'Midnight Creek Stout', 'good'), 
    batch3Responses: generateSurveyResponses('IPA-002', 'Copper Creek IPA v2.0', 'excellent')
};

// Export complete demo data
const completeDemoData = {
    ...demoBreweryData,
    surveyResponses: allSurveyData
};

// Console output for verification
console.log('Demo Brewery Setup Complete:');
console.log(`- Brewery: ${completeDemoData.brewery.name}`);
console.log(`- Equipment: ${Object.keys(completeDemoData.equipment).length} categories`);
console.log(`- Inventory: ${completeDemoData.inventory.malts.length + completeDemoData.inventory.hops.length + completeDemoData.inventory.yeast.length} items`);
console.log(`- Batches: 3 complete batches`);
console.log(`- Survey Responses: ${allSurveyData.batch1Responses.length + allSurveyData.batch2Responses.length + allSurveyData.batch3Responses.length} total`);

export default completeDemoData;