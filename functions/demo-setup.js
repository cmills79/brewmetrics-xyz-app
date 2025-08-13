const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Create Demo Brewery Account
 * Sets up a complete demo brewery with sample data
 */
exports.createDemoBrewery = functions.https.onCall(async (data, context) => {
    try {
        const demoEmail = "demo@hopvalleybrewing.com";
        const demoPassword = "demo123456";
        const demoBreweryId = "demo-hop-valley-brewing";

        // Create demo user account
        let userRecord;
        try {
            userRecord = await admin.auth().createUser({
                uid: demoBreweryId,
                email: demoEmail,
                password: demoPassword,
                displayName: "Hop Valley Brewing Demo",
                emailVerified: true
            });
        } catch (error) {
            if (error.code === 'auth/uid-already-exists') {
                userRecord = await admin.auth().getUser(demoBreweryId);
            } else {
                throw error;
            }
        }

        // Create brewery profile
        const breweryData = {
            name: "Hop Valley Brewing Co.",
            email: demoEmail,
            location: "Eugene, OR",
            website: "https://hopvalleybrewing.com",
            gmbReviewLink: "https://g.page/hopvalleybrewing/review",
            gmbAvgRating: 4.6,
            gmbTotalReviews: 127,
            incentiveText: "Show this review for $2 off your next pint!",
            activeDiscountsCount: 3,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isDemo: true
        };

        await admin.firestore()
            .collection('breweries')
            .doc(demoBreweryId)
            .set(breweryData);

        // Create sample beer batches
        const sampleBatches = [
            {
                id: "WCIPA-2025-001",
                beerName: "Citrus Burst IPA",
                beerIntro: "A bold West Coast IPA featuring Citra and Mosaic hops with bright citrus notes and a clean bitter finish.",
                abv: 6.8,
                ibu: 65,
                style: "West Coast IPA",
                batchCode: "WCIPA-2025-001",
                packagedDate: "2025-01-15",
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                customQuestions: [
                    "How prominent was the citrus aroma?",
                    "Did you find the bitterness balanced?",
                    "How would you rate the hop flavor intensity?"
                ]
            },
            {
                id: "PORTER-2025-001",
                beerName: "Midnight Porter",
                beerIntro: "Rich and smooth porter with notes of chocolate and coffee, perfect for cold evenings.",
                abv: 5.4,
                ibu: 28,
                style: "Robust Porter",
                batchCode: "PORTER-2025-001",
                packagedDate: "2025-01-08",
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                customQuestions: [
                    "How noticeable were the chocolate notes?",
                    "Was the coffee flavor balanced?",
                    "How would you describe the mouthfeel?"
                ]
            },
            {
                id: "WHEAT-2025-001",
                beerName: "Summer Wheat",
                beerIntro: "Light and refreshing wheat beer with subtle citrus notes, perfect for sunny days.",
                abv: 4.8,
                ibu: 18,
                style: "American Wheat",
                batchCode: "WHEAT-2025-001",
                packagedDate: "2025-01-22",
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                customQuestions: [
                    "How refreshing did you find this beer?",
                    "Were the citrus notes noticeable?",
                    "How would you rate the overall balance?"
                ]
            }
        ];

        const batch = admin.firestore().batch();
        sampleBatches.forEach(batchData => {
            const batchRef = admin.firestore()
                .collection('breweries')
                .doc(demoBreweryId)
                .collection('batches')
                .doc(batchData.id);
            batch.set(batchRef, batchData);
        });
        await batch.commit();

        // Generate 100+ sample survey responses per batch
        const sampleResponses = [];
        const batchIds = ["WCIPA-2025-001", "PORTER-2025-001", "WHEAT-2025-001"];
        
        const comments = {
            "WCIPA-2025-001": [
                "Absolutely fantastic IPA! The citrus hops really shine through.",
                "Great IPA, maybe a touch too bitter for my taste but well made.",
                "Love the hop forward profile, perfect balance.",
                "Citrus notes are amazing, very drinkable.",
                "Best IPA I've had in a while!",
                "Nice hoppy finish, would order again.",
                "Excellent beer, great aroma.",
                "Perfect bitterness level for an IPA.",
                "Outstanding citrus character.",
                "Really well crafted beer."
            ],
            "PORTER-2025-001": [
                "Perfect porter! Love the chocolate and coffee notes.",
                "Rich and smooth, exactly what I want in a porter.",
                "Great roasted malt character.",
                "Excellent balance of chocolate and coffee.",
                "Smooth finish, very drinkable.",
                "Perfect for a cold evening.",
                "Love the mouthfeel on this one.",
                "Great dark beer, not too heavy.",
                "Excellent porter, will definitely have another.",
                "Perfect roasted flavor profile."
            ],
            "WHEAT-2025-001": [
                "Very refreshing summer beer, perfect for the patio.",
                "Light and crisp, exactly what I needed.",
                "Great wheat character, very smooth.",
                "Perfect summer refresher.",
                "Love the citrus notes in this wheat.",
                "Easy drinking, great for hot days.",
                "Excellent wheat beer, very balanced.",
                "Perfect for outdoor drinking.",
                "Light and refreshing, great flavor.",
                "Smooth wheat beer, really enjoyable."
            ]
        };

        batchIds.forEach(batchId => {
            for (let i = 0; i < 120; i++) {
                const rating = Math.random() < 0.7 ? (Math.random() < 0.5 ? 5 : 4) : (Math.random() < 0.7 ? 3 : (Math.random() < 0.8 ? 2 : 1));
                const variance = () => Math.max(1, Math.min(5, Math.round(rating + (Math.random() - 0.5) * 2)));
                
                sampleResponses.push({
                    batchId: batchId,
                    overallRating: rating,
                    surveyAnswers: [
                        { questionId: 0, answer: variance() }, // sweetness
                        { questionId: 1, answer: variance() }, // acidity
                        { questionId: 2, answer: batchId === "WCIPA-2025-001" ? Math.max(3, variance()) : variance() }, // bitterness
                        { questionId: 3, answer: batchId === "PORTER-2025-001" ? Math.max(4, variance()) : variance() }, // body
                        { questionId: 4, answer: variance() }, // carbonation
                        { questionId: 5, answer: batchId === "PORTER-2025-001" ? Math.max(4, variance()) : variance() }, // malt
                        { questionId: 6, answer: batchId === "WCIPA-2025-001" ? Math.max(4, variance()) : Math.max(1, Math.min(3, variance())) }, // hop
                        { questionId: 7, answer: variance() }, // finish
                        { questionId: 8, answer: variance() }, // custom 1
                        { questionId: 9, answer: variance() }, // custom 2
                        { questionId: 10, answer: variance() } // custom 3
                    ],
                    comments: rating >= 4 ? comments[batchId][i % comments[batchId].length] : (rating === 3 ? "Decent beer, nothing special." : "Not really my style."),
                    submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                    userId: `user_${String(i + 1).padStart(3, '0')}_${batchId.split('-')[0]}`
                });
            }
        });

        const responseBatch = admin.firestore().batch();
        sampleResponses.forEach((response, index) => {
            const responseRef = admin.firestore()
                .collection('breweries')
                .doc(demoBreweryId)
                .collection('batches')
                .doc(response.batchId)
                .collection('responses')
                .doc(`response_${index + 1}`);
            responseBatch.set(responseRef, response);
        });
        await responseBatch.commit();

        // Create sample Google reviews
        const sampleGoogleReviews = [
            {
                reviewId: 'gmb_review_1',
                author: 'Sarah Johnson',
                rating: 5,
                text: 'Amazing brewery! The Citrus Burst IPA is incredible and the atmosphere is perfect. Staff was super knowledgeable about their beers.',
                createTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                reviewReply: {
                    comment: 'Thank you so much Sarah! We\'re thrilled you enjoyed our Citrus Burst IPA. Hope to see you again soon!',
                    updateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                fetchedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                reviewId: 'gmb_review_2',
                author: 'Mike Chen',
                rating: 4,
                text: 'Great selection of beers and good food. The Midnight Porter was excellent. Only wish they had more seating during busy hours.',
                createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                reviewReply: null,
                fetchedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                reviewId: 'gmb_review_3',
                author: 'Emily Rodriguez',
                rating: 5,
                text: 'Best brewery in Eugene! Love the seasonal rotations and the staff always has great recommendations. The flight option is perfect.',
                createTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                reviewReply: {
                    comment: 'Emily, thank you for being such a loyal customer! We love seeing you try our seasonal offerings.',
                    updateTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
                },
                fetchedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                reviewId: 'gmb_review_4',
                author: 'David Thompson',
                rating: 3,
                text: 'Decent beer selection but service was a bit slow. The Summer Wheat was refreshing though.',
                createTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                reviewReply: null,
                fetchedAt: admin.firestore.FieldValue.serverTimestamp()
            }
        ];

        const reviewsBatch = admin.firestore().batch();
        sampleGoogleReviews.forEach(review => {
            const reviewRef = admin.firestore()
                .collection('breweries')
                .doc(demoBreweryId)
                .collection('googleReviews')
                .doc(review.reviewId);
            reviewsBatch.set(reviewRef, review);
        });
        await reviewsBatch.commit();

        functions.logger.info("Demo brewery created successfully", {
            breweryId: demoBreweryId,
            email: demoEmail
        });

        return {
            success: true,
            message: "Demo brewery created successfully!",
            credentials: {
                email: demoEmail,
                password: demoPassword,
                breweryName: "Hop Valley Brewing Co."
            },
            data: {
                batches: sampleBatches.length,
                responses: sampleResponses.length,
                reviews: sampleGoogleReviews.length
            }
        };

    } catch (error) {
        functions.logger.error("Error creating demo brewery", {
            error: error.message,
            stack: error.stack
        });

        throw new functions.https.HttpsError(
            "internal",
            "Failed to create demo brewery: " + error.message
        );
    }
});