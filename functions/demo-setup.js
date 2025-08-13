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
                name: "Citrus Burst IPA",
                intro: "A bold West Coast IPA featuring Citra and Mosaic hops with bright citrus notes and a clean bitter finish.",
                abv: 6.8,
                ibu: 65,
                style: "West Coast IPA",
                batchCode: "WCIPA-2025-001",
                packagedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                active: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                customQuestions: [
                    "How prominent was the citrus aroma?",
                    "Did you find the bitterness balanced?",
                    "How would you rate the hop flavor intensity?"
                ]
            },
            {
                id: "PORTER-2025-001",
                name: "Midnight Porter",
                intro: "Rich and smooth porter with notes of chocolate and coffee, perfect for cold evenings.",
                abv: 5.4,
                ibu: 28,
                style: "Robust Porter",
                batchCode: "PORTER-2025-001",
                packagedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
                active: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                customQuestions: [
                    "How noticeable were the chocolate notes?",
                    "Was the coffee flavor balanced?",
                    "How would you describe the mouthfeel?"
                ]
            },
            {
                id: "WHEAT-2025-001",
                name: "Summer Wheat",
                intro: "Light and refreshing wheat beer with subtle citrus notes, perfect for sunny days.",
                abv: 4.8,
                ibu: 18,
                style: "American Wheat",
                batchCode: "WHEAT-2025-001",
                packagedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                active: true,
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

        // Create sample survey responses
        const sampleResponses = [
            // Citrus Burst IPA responses
            {
                batchId: "WCIPA-2025-001",
                overallRating: 5,
                responses: {
                    sweetness: 2,
                    acidity: 3,
                    bitterness: 5,
                    body: 4,
                    carbonation: 4,
                    maltFlavors: 3,
                    hopFlavors: 5,
                    finish: 4,
                    customQuestion1: 5,
                    customQuestion2: 4,
                    customQuestion3: 5
                },
                comments: "Absolutely fantastic IPA! The citrus hops really shine through.",
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                userId: "user_001"
            },
            {
                batchId: "WCIPA-2025-001",
                overallRating: 4,
                responses: {
                    sweetness: 2,
                    acidity: 3,
                    bitterness: 4,
                    body: 4,
                    carbonation: 4,
                    maltFlavors: 3,
                    hopFlavors: 4,
                    finish: 4,
                    customQuestion1: 4,
                    customQuestion2: 4,
                    customQuestion3: 4
                },
                comments: "Great IPA, maybe a touch too bitter for my taste but well made.",
                submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                userId: "user_002"
            },
            // Midnight Porter responses
            {
                batchId: "PORTER-2025-001",
                overallRating: 5,
                responses: {
                    sweetness: 3,
                    acidity: 2,
                    bitterness: 3,
                    body: 5,
                    carbonation: 3,
                    maltFlavors: 5,
                    hopFlavors: 2,
                    finish: 5,
                    customQuestion1: 5,
                    customQuestion2: 4,
                    customQuestion3: 5
                },
                comments: "Perfect porter! Love the chocolate and coffee notes.",
                submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                userId: "user_003"
            },
            // Summer Wheat responses
            {
                batchId: "WHEAT-2025-001",
                overallRating: 4,
                responses: {
                    sweetness: 3,
                    acidity: 3,
                    bitterness: 2,
                    body: 3,
                    carbonation: 4,
                    maltFlavors: 3,
                    hopFlavors: 2,
                    finish: 4,
                    customQuestion1: 4,
                    customQuestion2: 3,
                    customQuestion3: 4
                },
                comments: "Very refreshing summer beer, perfect for the patio.",
                submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                userId: "user_004"
            }
        ];

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