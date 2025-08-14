// Demo Data Loader for BrewMetrics
// Loads comprehensive demo brewery data into Firebase

class DemoDataLoader {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.storage = firebase.storage();
    }

    async loadCompleteDemoData() {
        try {
            console.log('🍺 Loading Copper Creek Brewing Co. demo data...');
            
            // Create demo user account
            const demoUser = await this.createDemoUser();
            
            // Load all demo data
            await this.loadBreweryProfile(demoUser.uid);
            await this.loadEquipmentSetup(demoUser.uid);
            await this.loadInventoryData(demoUser.uid);
            await this.loadBatchData(demoUser.uid);
            await this.loadSurveyResponses(demoUser.uid);
            
            console.log('✅ Demo data loaded successfully!');
            return demoUser;
            
        } catch (error) {
            console.error('❌ Error loading demo data:', error);
            throw error;
        }
    }

    async createDemoUser() {
        const email = 'demo@coppercreckbrewing.com';
        const password = 'BrewMetrics2024!';
        
        try {
            // Create user account
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update profile
            await user.updateProfile({
                displayName: 'Sarah Mitchell - Copper Creek Brewing'
            });
            
            // Set premium status
            await this.db.collection('users').doc(user.uid).set({
                email: email,
                displayName: 'Sarah Mitchell',
                brewery: 'Copper Creek Brewing Co.',
                role: 'Head Brewer',
                isPremium: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('👤 Demo user created:', email);
            return user;
            
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                // Sign in existing user
                const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
                console.log('👤 Demo user signed in:', email);
                return userCredential.user;
            }
            throw error;
        }
    }

    async loadBreweryProfile(userId) {
        const breweryData = {
            name: "Copper Creek Brewing Co.",
            location: "Boulder, Colorado",
            established: "2019",
            brewmaster: "Sarah Mitchell",
            description: "Craft brewery specializing in IPAs and Stouts with a focus on quality and innovation",
            capacity: "15 BBL System",
            website: "www.coppercreckbrewing.com",
            phone: "(303) 555-BREW",
            address: "1234 Brewery Lane, Boulder, CO 80301",
            logoUrl: "brewery-logos/copper-creek-logo.png",
            socialMedia: {
                instagram: "@coppercreckbrewing",
                facebook: "CopperCreekBrewing",
                twitter: "@CCBrewing"
            },
            certifications: ["Organic Certified", "B-Corp Certified"],
            awards: [
                "2023 Great American Beer Festival - Bronze Medal (American IPA)",
                "2022 Colorado Brewers Guild - Best New Brewery"
            ],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await this.db.collection('breweries').doc(userId).set(breweryData);
        console.log('🏭 Brewery profile loaded');
    }

    async loadEquipmentSetup(userId) {
        const equipmentData = {
            mashTun: {
                brand: "Stout Tanks and Kettles",
                model: "15 BBL Mash Tun",
                capacity: 15,
                efficiency: 78,
                heatType: "steam",
                temperatureControl: "automated",
                purchaseDate: "2019-03-15",
                cost: 25000,
                notes: "Excellent temperature control, consistent efficiency"
            },
            boilKettle: {
                brand: "Stout Tanks and Kettles",
                model: "15 BBL Brew Kettle",
                capacity: 15,
                heatType: "steam",
                efficiency: 85,
                purchaseDate: "2019-03-15",
                cost: 28000,
                features: ["Whirlpool port", "CIP spray ball", "Sight glass"]
            },
            fermenters: [
                {
                    id: "FV-001",
                    brand: "Premier Stainless Systems",
                    model: "15 BBL Conical Fermenter",
                    capacity: 15,
                    temperatureControl: "glycol",
                    material: "304 Stainless Steel",
                    purchaseDate: "2019-04-01",
                    cost: 15000,
                    status: "active"
                },
                {
                    id: "FV-002", 
                    brand: "Premier Stainless Systems",
                    model: "15 BBL Conical Fermenter",
                    capacity: 15,
                    temperatureControl: "glycol",
                    material: "304 Stainless Steel",
                    purchaseDate: "2019-04-01",
                    cost: 15000,
                    status: "active"
                },
                {
                    id: "FV-003",
                    brand: "Premier Stainless Systems", 
                    model: "30 BBL Conical Fermenter",
                    capacity: 30,
                    temperatureControl: "glycol",
                    material: "316 Stainless Steel",
                    purchaseDate: "2020-06-15",
                    cost: 22000,
                    status: "active"
                }
            ],
            chiller: {
                brand: "Hydro Innovations",
                model: "Glycol Chiller 5HP",
                capacity: "5HP",
                efficiency: 92,
                purchaseDate: "2019-03-20",
                cost: 8500,
                maintenanceSchedule: "Quarterly"
            },
            mill: {
                brand: "Country Malt Group",
                model: "2-Roller Mill",
                efficiency: 82,
                gapSetting: "0.045 inches",
                purchaseDate: "2019-02-28",
                cost: 3200,
                notes: "Consistent crush, easy adjustment"
            },
            packaging: {
                canSeamer: {
                    brand: "Criveller",
                    model: "Semi-Automatic Can Seamer",
                    speed: "12 cans/minute",
                    purchaseDate: "2020-08-10",
                    cost: 12000
                },
                kegWasher: {
                    brand: "Stout Tanks",
                    model: "Semi-Auto Keg Washer",
                    capacity: "6 kegs/hour",
                    purchaseDate: "2019-05-01",
                    cost: 8000
                }
            },
            totalInvestment: 156700,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };

        await this.db.collection('equipment').doc(userId).set(equipmentData);
        console.log('⚙️ Equipment setup loaded');
    }

    async loadInventoryData(userId) {
        const inventoryItems = [
            // Base Malts
            {
                name: "Pilsner Malt (German)",
                supplier: "Weyermann Malting",
                category: "Base Malt",
                stock: 2000,
                unit: "lbs",
                costPerUnit: 1.25,
                reorderPoint: 500,
                maxStock: 3000,
                extractYield: 82,
                color: 1.7,
                protein: 11.2,
                moisture: 4.5,
                lotNumber: "WEY-PIL-240115",
                expirationDate: "2025-01-15",
                storageLocation: "Grain Room A",
                notes: "Premium German Pilsner malt, excellent for lagers and light ales"
            },
            {
                name: "Pale Ale Malt (American)",
                supplier: "Great Western Malting",
                category: "Base Malt", 
                stock: 1500,
                unit: "lbs",
                costPerUnit: 1.15,
                reorderPoint: 400,
                maxStock: 2500,
                extractYield: 80,
                color: 3.5,
                protein: 12.1,
                moisture: 4.2,
                lotNumber: "GWM-PAL-240201",
                expirationDate: "2025-02-01",
                storageLocation: "Grain Room A"
            },
            // Specialty Malts
            {
                name: "Munich Malt",
                supplier: "Weyermann Malting",
                category: "Specialty Malt",
                stock: 500,
                unit: "lbs", 
                costPerUnit: 1.35,
                reorderPoint: 100,
                maxStock: 800,
                extractYield: 78,
                color: 9,
                lotNumber: "WEY-MUN-240110",
                expirationDate: "2025-01-10",
                storageLocation: "Grain Room B"
            },
            {
                name: "Crystal 60L",
                supplier: "Briess Malt & Ingredients",
                category: "Crystal Malt",
                stock: 300,
                unit: "lbs",
                costPerUnit: 1.65,
                reorderPoint: 75,
                maxStock: 500,
                extractYield: 75,
                color: 60,
                lotNumber: "BRI-C60-240205",
                expirationDate: "2025-02-05",
                storageLocation: "Grain Room B"
            },
            {
                name: "Chocolate Malt",
                supplier: "Crisp Malting Group",
                category: "Roasted Malt",
                stock: 200,
                unit: "lbs",
                costPerUnit: 1.85,
                reorderPoint: 50,
                maxStock: 300,
                extractYield: 70,
                color: 450,
                lotNumber: "CRI-CHO-240120",
                expirationDate: "2025-01-20",
                storageLocation: "Grain Room C"
            },
            // Hops
            {
                name: "Centennial",
                supplier: "Yakima Chief Hops",
                category: "Aroma Hop",
                stock: 25,
                unit: "lbs",
                costPerUnit: 18.50,
                reorderPoint: 5,
                maxStock: 50,
                alphaAcid: 9.5,
                betaAcid: 4.2,
                cohumulone: 29,
                harvestYear: 2023,
                lotNumber: "YCH-CEN-231015",
                storageTemp: "-10°F",
                storageLocation: "Hop Freezer A",
                notes: "Citrus and floral aroma, excellent for IPAs"
            },
            {
                name: "Cascade",
                supplier: "Yakima Chief Hops",
                category: "Dual Purpose",
                stock: 30,
                unit: "lbs",
                costPerUnit: 16.75,
                reorderPoint: 8,
                maxStock: 60,
                alphaAcid: 6.8,
                betaAcid: 5.1,
                cohumulone: 33,
                harvestYear: 2023,
                lotNumber: "YCH-CAS-231020",
                storageTemp: "-10°F",
                storageLocation: "Hop Freezer A"
            },
            {
                name: "Simcoe",
                supplier: "Hop Head Farms",
                category: "Bittering Hop",
                stock: 20,
                unit: "lbs",
                costPerUnit: 22.00,
                reorderPoint: 5,
                maxStock: 40,
                alphaAcid: 12.1,
                betaAcid: 4.8,
                cohumulone: 15,
                harvestYear: 2023,
                lotNumber: "HHF-SIM-231025",
                storageTemp: "-10°F",
                storageLocation: "Hop Freezer B"
            },
            // Yeast
            {
                name: "SafAle US-05",
                supplier: "Fermentis",
                category: "Ale Yeast",
                stock: 50,
                unit: "packets",
                costPerUnit: 3.25,
                reorderPoint: 10,
                maxStock: 100,
                attenuation: 81,
                flocculation: "medium",
                temperatureRange: "59-75°F",
                alcoholTolerance: 11,
                lotNumber: "FER-US05-240301",
                expirationDate: "2026-03-01",
                storageTemp: "35°F",
                storageLocation: "Yeast Fridge"
            },
            {
                name: "Wyeast 1056 American Ale",
                supplier: "Wyeast Laboratories",
                category: "Ale Yeast",
                stock: 20,
                unit: "vials",
                costPerUnit: 8.50,
                reorderPoint: 5,
                maxStock: 30,
                attenuation: 75,
                flocculation: "low-medium",
                temperatureRange: "60-72°F",
                alcoholTolerance: 10,
                lotNumber: "WYE-1056-240215",
                expirationDate: "2024-08-15",
                storageTemp: "35°F",
                storageLocation: "Yeast Fridge"
            }
        ];

        // Add each inventory item
        for (const item of inventoryItems) {
            const docRef = this.db.collection('inventory').doc();
            await docRef.set({
                ...item,
                userId: userId,
                id: docRef.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log(`📦 Inventory loaded: ${inventoryItems.length} items`);
    }

    async loadBatchData(userId) {
        const batches = [
            // Batch 1: Failed IPA
            {
                batchNumber: "IPA-001",
                beerName: "Copper Creek IPA v1.0",
                style: "American IPA",
                brewDate: "2024-01-15",
                packageDate: "2024-02-12",
                targetABV: 6.5,
                actualABV: 6.2,
                targetIBU: 60,
                actualIBU: 65,
                targetSRM: 6,
                actualSRM: 8,
                batchSize: 15,
                efficiency: 72,
                status: "completed",
                recipe: {
                    malts: [
                        { name: "Pale Ale Malt", amount: 280, unit: "lbs", percentage: 83.6 },
                        { name: "Crystal 60L", amount: 35, unit: "lbs", percentage: 10.4 },
                        { name: "Munich Malt", amount: 20, unit: "lbs", percentage: 6.0 }
                    ],
                    hops: [
                        { name: "Centennial", amount: 2.5, time: 60, usage: "bittering", ibuContribution: 35 },
                        { name: "Cascade", amount: 2.0, time: 15, usage: "flavor", ibuContribution: 18 },
                        { name: "Simcoe", amount: 3.0, time: 0, usage: "aroma", ibuContribution: 12 }
                    ],
                    yeast: { name: "SafAle US-05", amount: 3, unit: "packets" },
                    waterProfile: "Burton-on-Trent",
                    mashTemp: 152,
                    mashTime: 60,
                    boilTime: 60,
                    fermentationTemp: 78,
                    fermentationTime: 14
                },
                issues: [
                    "Fermentation temperature too high (78°F) - caused fusel alcohols",
                    "Insufficient dry hopping - lacks aroma complexity", 
                    "Over-bittered for style - harsh finish",
                    "Poor water chemistry balance - mineral imbalance",
                    "Mash temperature too high - poor attenuation"
                ],
                costs: {
                    ingredients: 285.50,
                    labor: 120.00,
                    utilities: 45.00,
                    packaging: 180.00,
                    total: 630.50
                },
                notes: "First attempt at house IPA. Multiple issues identified for improvement in next batch."
            },
            // Batch 2: Successful Stout
            {
                batchNumber: "STT-001",
                beerName: "Midnight Creek Stout",
                style: "American Stout", 
                brewDate: "2024-02-20",
                packageDate: "2024-03-18",
                targetABV: 5.8,
                actualABV: 5.8,
                targetIBU: 35,
                actualIBU: 35,
                targetSRM: 40,
                actualSRM: 40,
                batchSize: 15,
                efficiency: 76,
                status: "completed",
                recipe: {
                    malts: [
                        { name: "Pale Ale Malt", amount: 220, unit: "lbs", percentage: 67.7 },
                        { name: "Munich Malt", amount: 45, unit: "lbs", percentage: 13.8 },
                        { name: "Crystal 60L", amount: 25, unit: "lbs", percentage: 7.7 },
                        { name: "Chocolate Malt", amount: 35, unit: "lbs", percentage: 10.8 }
                    ],
                    hops: [
                        { name: "Centennial", amount: 1.8, time: 60, usage: "bittering", ibuContribution: 28 },
                        { name: "Cascade", amount: 1.0, time: 15, usage: "flavor", ibuContribution: 7 }
                    ],
                    yeast: { name: "Wyeast 1056", amount: 2, unit: "vials" },
                    waterProfile: "Dublin",
                    mashTemp: 154,
                    mashTime: 60,
                    boilTime: 60,
                    fermentationTemp: 66,
                    fermentationTime: 21
                },
                costs: {
                    ingredients: 295.75,
                    labor: 120.00,
                    utilities: 45.00,
                    packaging: 180.00,
                    total: 640.75
                },
                notes: "Excellent stout with perfect balance of roasted flavors. Customer favorite."
            },
            // Batch 3: Improved IPA
            {
                batchNumber: "IPA-002",
                beerName: "Copper Creek IPA v2.0",
                style: "American IPA",
                brewDate: "2024-03-25",
                packageDate: "2024-04-22",
                targetABV: 6.8,
                actualABV: 6.8,
                targetIBU: 55,
                actualIBU: 55,
                targetSRM: 6,
                actualSRM: 6,
                batchSize: 15,
                efficiency: 78,
                status: "completed",
                recipe: {
                    malts: [
                        { name: "Pilsner Malt", amount: 260, unit: "lbs", percentage: 85.2 },
                        { name: "Munich Malt", amount: 30, unit: "lbs", percentage: 9.8 },
                        { name: "Crystal 60L", amount: 15, unit: "lbs", percentage: 4.9 }
                    ],
                    hops: [
                        { name: "Centennial", amount: 1.8, time: 60, usage: "bittering", ibuContribution: 25 },
                        { name: "Cascade", amount: 2.5, time: 15, usage: "flavor", ibuContribution: 20 },
                        { name: "Simcoe", amount: 2.0, time: 5, usage: "aroma", ibuContribution: 8 },
                        { name: "Centennial", amount: 2.5, time: "dry hop", usage: "aroma", ibuContribution: 2 }
                    ],
                    yeast: { name: "SafAle US-05", amount: 3, unit: "packets" },
                    waterProfile: "Balanced",
                    mashTemp: 149,
                    mashTime: 60,
                    boilTime: 60,
                    fermentationTemp: 66,
                    fermentationTime: 14,
                    dryHopDays: 3
                },
                improvements: [
                    "Controlled fermentation temperature (66°F) - clean fermentation",
                    "Added 3-day dry hopping phase - enhanced aroma",
                    "Reduced bittering hops - better balance",
                    "Improved water chemistry - proper mineral content",
                    "Lower mash temperature (149°F) - better attenuation",
                    "Changed base malt to Pilsner - cleaner flavor profile"
                ],
                costs: {
                    ingredients: 275.25,
                    labor: 120.00,
                    utilities: 45.00,
                    packaging: 180.00,
                    total: 620.25
                },
                notes: "Significant improvement over v1.0. All issues resolved. Excellent customer feedback."
            }
        ];

        // Add each batch
        for (const batch of batches) {
            const docRef = this.db.collection('batches').doc();
            await docRef.set({
                ...batch,
                userId: userId,
                id: docRef.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log(`🍺 Batches loaded: ${batches.length} batches`);
    }

    async loadSurveyResponses(userId) {
        // Generate survey responses for each batch
        const batchSurveys = [
            { batchNumber: 'IPA-001', beerName: 'Copper Creek IPA v1.0', type: 'poor', count: 125 },
            { batchNumber: 'STT-001', beerName: 'Midnight Creek Stout', type: 'good', count: 118 },
            { batchNumber: 'IPA-002', beerName: 'Copper Creek IPA v2.0', type: 'excellent', count: 132 }
        ];

        let totalResponses = 0;

        for (const survey of batchSurveys) {
            const responses = this.generateSurveyResponses(survey.batchNumber, survey.beerName, survey.type, survey.count);
            
            // Add each response to Firestore
            for (const response of responses) {
                const docRef = this.db.collection('surveys').doc();
                await docRef.set({
                    ...response,
                    userId: userId,
                    id: docRef.id,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date(response.timestamp))
                });
            }
            
            totalResponses += responses.length;
            console.log(`📊 ${survey.batchNumber}: ${responses.length} survey responses loaded`);
        }

        console.log(`📊 Total survey responses loaded: ${totalResponses}`);
    }

    generateSurveyResponses(batchNumber, beerName, responseType, count) {
        const responses = [];
        const deviceFingerprints = this.generateDeviceFingerprints(count);

        for (let i = 0; i < count; i++) {
            const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            
            let ratings, feedback, traits;
            
            if (responseType === 'poor') {
                ratings = {
                    overall: Math.floor(Math.random() * 3) + 1, // 1-3
                    aroma: Math.floor(Math.random() * 3) + 1,
                    appearance: Math.floor(Math.random() * 2) + 3, // 3-4
                    flavor: Math.floor(Math.random() * 3) + 1,
                    mouthfeel: Math.floor(Math.random() * 3) + 2
                };
                
                const poorFeedback = [
                    "Too bitter, harsh finish that lingers unpleasantly",
                    "Lacks hop aroma, overpowering bitterness dominates",
                    "Tastes hot and alcoholic, possible fermentation issues",
                    "Not balanced at all, way too aggressive for my taste",
                    "Missing the citrus notes I expect in a good IPA",
                    "Bitter without any pleasant hop character to back it up",
                    "Needs much more aroma hops and less bittering",
                    "Definite off-flavors, fermentation seems problematic",
                    "Too harsh and astringent, not smooth at all",
                    "Very disappointing for an IPA, won't order again"
                ];
                
                traits = ['harsh', 'overly bitter', 'hot alcohol', 'astringent', 'unbalanced', 'lacking aroma'];
                feedback = poorFeedback[Math.floor(Math.random() * poorFeedback.length)];
                
            } else if (responseType === 'excellent') {
                ratings = {
                    overall: Math.floor(Math.random() * 2) + 4, // 4-5
                    aroma: Math.floor(Math.random() * 2) + 4,
                    appearance: Math.floor(Math.random() * 2) + 4,
                    flavor: Math.floor(Math.random() * 2) + 4,
                    mouthfeel: Math.floor(Math.random() * 2) + 4
                };
                
                const excellentFeedback = [
                    "Perfect balance of hops and malt! This is exceptional",
                    "Amazing citrus aroma from the dry hopping, love it",
                    "This is exactly what an American IPA should taste like",
                    "Excellent improvement from the first version, night and day",
                    "Beautiful hop character with perfect balance, outstanding",
                    "Clean fermentation with incredible hop profile",
                    "Love the citrus and pine notes, perfectly executed",
                    "Perfect bitterness level, not harsh at all",
                    "Outstanding beer, will definitely order this again",
                    "Best IPA I've had in Boulder, maybe anywhere!"
                ];
                
                traits = ['citrusy', 'balanced', 'aromatic', 'clean', 'smooth', 'hoppy', 'refreshing'];
                feedback = excellentFeedback[Math.floor(Math.random() * excellentFeedback.length)];
                
            } else {
                ratings = {
                    overall: Math.floor(Math.random() * 2) + 4, // 4-5
                    aroma: Math.floor(Math.random() * 2) + 4,
                    appearance: 5, // Stouts usually look great
                    flavor: Math.floor(Math.random() * 2) + 4,
                    mouthfeel: Math.floor(Math.random() * 2) + 4
                };
                
                const stoutFeedback = [
                    "Rich chocolate and coffee notes, perfectly balanced",
                    "Smooth and creamy texture, exactly what I want in a stout",
                    "Great roasted malt character without being burnt",
                    "Well balanced, not too bitter, just right",
                    "Love the chocolate finish, lingers pleasantly",
                    "Perfect for a cold Colorado evening",
                    "Excellent roasted flavors, complex but approachable",
                    "Smooth mouthfeel with great body and texture",
                    "Classic American stout done absolutely right",
                    "Rich and satisfying, will definitely be back"
                ];
                
                traits = ['roasted', 'smooth', 'chocolatey', 'rich', 'creamy', 'balanced'];
                feedback = stoutFeedback[Math.floor(Math.random() * stoutFeedback.length)];
            }

            responses.push({
                batchNumber,
                beerName,
                timestamp: timestamp.toISOString(),
                deviceFingerprint: deviceFingerprints[i],
                ratings,
                feedback,
                traits: traits.slice(0, Math.floor(Math.random() * 3) + 2), // 2-4 traits
                customerType: Math.random() > 0.7 ? 'returning' : 'new',
                location: ['Boulder, CO', 'Denver, CO', 'Fort Collins, CO', 'Longmont, CO'][Math.floor(Math.random() * 4)],
                ageGroup: ['21-30', '31-40', '41-50', '51+'][Math.floor(Math.random() * 4)],
                beerExperience: ['Novice', 'Intermediate', 'Expert'][Math.floor(Math.random() * 3)],
                visitFrequency: ['First time', 'Occasional', 'Regular', 'Weekly'][Math.floor(Math.random() * 4)],
                recommendToFriend: responseType === 'poor' ? Math.random() > 0.8 : Math.random() > 0.2,
                wouldOrderAgain: responseType === 'poor' ? Math.random() > 0.9 : Math.random() > 0.1
            });
        }
        
        return responses;
    }

    generateDeviceFingerprints(count) {
        const fingerprints = [];
        const resolutions = ['1920x1080', '1366x768', '1440x900', '1536x864', '1280x720'];
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        ];
        const languages = ['en-US', 'en-GB', 'en-CA'];
        const timezones = ['America/Denver', 'America/New_York', 'America/Los_Angeles'];

        for (let i = 0; i < count; i++) {
            fingerprints.push({
                screenResolution: resolutions[Math.floor(Math.random() * resolutions.length)],
                userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
                language: languages[Math.floor(Math.random() * languages.length)],
                timezone: timezones[Math.floor(Math.random() * timezones.length)],
                canvasFingerprint: Math.random().toString(36).substring(2, 15)
            });
        }
        
        return fingerprints;
    }
}

// Initialize and expose globally
window.DemoDataLoader = DemoDataLoader;

// Auto-load demo data when page loads (for demo purposes)
document.addEventListener('DOMContentLoaded', () => {
    // Add demo data load button to dashboard
    const loadDemoBtn = document.createElement('button');
    loadDemoBtn.textContent = '🍺 Load Demo Brewery Data';
    loadDemoBtn.className = 'demo-load-btn';
    loadDemoBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b35;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    `;
    
    loadDemoBtn.addEventListener('click', async () => {
        loadDemoBtn.textContent = '⏳ Loading...';
        loadDemoBtn.disabled = true;
        
        try {
            const loader = new DemoDataLoader();
            await loader.loadCompleteDemoData();
            
            loadDemoBtn.textContent = '✅ Demo Data Loaded!';
            setTimeout(() => {
                loadDemoBtn.remove();
                location.reload(); // Refresh to show new data
            }, 2000);
            
        } catch (error) {
            console.error('Demo load error:', error);
            loadDemoBtn.textContent = '❌ Load Failed';
            loadDemoBtn.disabled = false;
        }
    });
    
    document.body.appendChild(loadDemoBtn);
});

console.log('🍺 Demo Data Loader ready - Click the button to load Copper Creek Brewing Co. demo data!');