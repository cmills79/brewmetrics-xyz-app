// --- START dashboard.js (Auth Logic Refined & Advanced Analytics Added - Updated May 29, 2025) ---
// Enhanced logging added to verify script loading and version.
console.log("Executing dashboard.js - Version: May 29, 2025 (Includes setTimeout fix & enhanced logging)");

// CACHE BUSTING RECOMMENDATION:
// To ensure the browser always loads the latest version of this script,
// modify the script tag in your dashboard.html file to include a version parameter.
// Example: <script src="dashboard.js?v=2025052901"></script>
// Update the 'v' parameter whenever you make changes to this file.

// Original file content starts below:
document.addEventListener("DOMContentLoaded", () => {
    console.log("Dashboard DOM loaded. (Full Integration Attempt with Advanced Analytics)");

    // =========================================================================
    // SECTION: Global Variables & State
    // =========================================================================
    let currentBreweryData = null;
    let currentUserId = null;
    let currentSurveyUrl = null;
    let currentBatchResponses = [];
    let currentViewedBatchId = null;
    let fetchedAnalyticsData = {};
    window.chartInstances = window.chartInstances || {};
    // let authCheckTimeout = null; // No longer needed for the primary auth check

    // Constants
    const CSV_QUESTION_HEADERS = [
        "Question1_Sweetness", "Question2_Acidity", "Question3_Bitterness", "Question4_Body",
        "Question5_Carbonation", "Question6_Malt", "Question7_Hop_Flavor", "Question8_Finish"
    ];
    const standardQuestionLabels = {
       0: "Sweetness", 1: "Acidity", 2: "Bitterness", 3: "Body",
       4: "Carbonation", 5: "Malt", 6: "Hop Flavor", 7: "Finish"
    };
    const standardQuestionLabelArray = [
        "Sweetness", "Acidity", "Bitterness", "Body",
        "Carbonation", "Malt", "Hop Flavor", "Finish"
    ]; //
    // NEW: Colors for the Taste Attribute Trends Chart
    const TASTE_ATTRIBUTE_COLORS = [
        "rgba(255, 99, 132, 1)",  // Red
        "rgba(54, 162, 235, 1)", // Blue
        "rgba(255, 206, 86, 1)", // Yellow
        "rgba(75, 192, 192, 1)", // Green
        "rgba(153, 102, 255, 1)",// Purple
        "rgba(255, 159, 64, 1)", // Orange
        "rgba(201, 203, 207, 1)", // Grey
        "rgba(0, 0, 0, 1)"       // Black
    ]; //

    // =========================================================================
    // SECTION: DOM Element References
    // =========================================================================
    const loadingIndicator = document.getElementById("loading-indicator");
    const appContainer = document.getElementById("app-container");
    const sidebarNavLinks = document.querySelectorAll("#sidebar .sidebar-nav .nav-link");
    const breweryNameDisplaySidebar = document.getElementById("brewery-name-display-sidebar");
    const sidebarLogoutButton = document.getElementById("logout-button");
    const currentSectionTitleDisplay = document.getElementById("current-section-title");
    const dashboardSections = document.querySelectorAll("#dashboard-content-area .dashboard-section");
    const whatsNewBannerElement = document.querySelector("#dashboard-overview-section .whats-new-banner");
    const takeTourButton = whatsNewBannerElement ? whatsNewBannerElement.querySelector(".btn-primary") : null;
    const dismissBannerButton = whatsNewBannerElement ? whatsNewBannerElement.querySelector(".btn-secondary") : null;
    const exportDataButtonDashboard = document.querySelector("#dashboard-overview-section .main-dashboard-title-bar .btn-export");
    const newBatchButtonDashboard = document.querySelector("#dashboard-overview-section .main-dashboard-title-bar .btn-new-batch");
    const activeBatchesValueDisplay = document.querySelector("#dashboard-overview-section .summary-card-icon.batches + .summary-card-info .value");
    const feedbackResponsesValueDisplay = document.querySelector("#dashboard-overview-section .summary-card-icon.feedback + .summary-card-info .value");
    const googleReviewsValueDisplay = document.querySelector("#dashboard-overview-section .summary-card-icon.reviews + .summary-card-info .value");
    const activeDiscountsValueDisplay = document.querySelector("#dashboard-overview-section .summary-card-icon.discounts + .summary-card-info .value");
    const topRatedBeersControlsContainer = document.getElementById("top-rated-beers-controls");
    const topRatedBeersListContainer = document.getElementById("top-rated-beers-list");
    const detailBreweryName = document.getElementById("detail-brewery-name");
    const detailEmail = document.getElementById("detail-email");
    const detailLocation = document.getElementById("detail-location");
    const detailWebsite = document.getElementById("detail-website");
    const detailGmbLink = document.getElementById("detail-gmb-link");
    const detailIncentiveText = document.getElementById("detail-incentive-text");
    const displayGmbAvgRating = document.getElementById("display-gmb-avg-rating");
    const displayGmbTotalReviews = document.getElementById("display-gmb-total-reviews");
    const displayActiveDiscountsCount = document.getElementById("display-active-discounts-count");
    const editBreweryButton = document.getElementById("edit-brewery-button");
    const editBreweryModal = document.getElementById("edit-brewery-modal");
    const closeEditModalButton = document.getElementById("close-edit-modal");
    const cancelEditButton = document.getElementById("cancel-edit-button");
    const editBreweryForm = document.getElementById("edit-brewery-form");
    const editBreweryNameInput = document.getElementById("edit-brewery-name");
    const editLocationInput = document.getElementById("edit-location");
    const editWebsiteInput = document.getElementById("edit-website");
    const editGmbLinkInput = document.getElementById("edit-gmb-link");
    const editBreweryMessage = document.getElementById("edit-brewery-message");
    const editIncentiveTextInput = document.getElementById("edit-incentive-text");
    const editGmbAvgRatingInput = document.getElementById("edit-gmb-avg-rating");
    const editGmbTotalReviewsInput = document.getElementById("edit-gmb-total-reviews");
    const editActiveDiscountsCountInput = document.getElementById("edit-active-discounts-count");
    const qrCodeDisplay = document.getElementById("qr-code-display");
    const qrCodeLinkInput = document.getElementById("qr-code-link");
    const copyLinkButton = document.getElementById("copy-link-button");
    const copyStatusSpan = document.getElementById("copy-status");
    const printQrButton = document.getElementById("print-qr-button");
    const layoutSelect = document.getElementById("print-layout-select");
    const qrErrorDiv = document.createElement("div");
          qrErrorDiv.classList.add("error-message"); qrErrorDiv.style.textAlign = "center";
          qrErrorDiv.style.marginTop = "15px"; qrErrorDiv.style.display = "none";
    const batchEntryForm = document.getElementById("batch-entry-form");
    const beerNameInput = document.getElementById("beer-name");
    const beerIntroInput = document.getElementById("beer-intro");
    const abvInput = document.getElementById("beer-abv");
    const ibuInput = document.getElementById("beer-ibu");
    const batchCodeInput = document.getElementById("batch-code");
    const packagedDateInput = document.getElementById("packaged-date");
    const customQuestion1Input = document.getElementById("custom-question-1");
    const customQuestion2Input = document.getElementById("custom-question-2");
    const customQuestion3Input = document.getElementById("custom-question-3");
    const batchEntryMessage = document.getElementById("batch-entry-message");
    const feedbackLoading = document.querySelector("#batch-management-section #feedback-loading");
    const feedbackError = document.querySelector("#batch-management-section #feedback-error");
    const feedbackList = document.querySelector("#batch-management-section #feedback-summary-container ul");
    const exportAllCsvButton = document.querySelector("#batch-management-section #export-all-csv-button");
    const exportMessage = document.querySelector("#batch-management-section #export-message");
    const compareBatchesButton = document.querySelector("#batch-management-section #compare-batches-button");
    const comparisonModal = document.getElementById("comparison-modal");
    const closeComparisonModalButton = document.getElementById("close-comparison-modal");
    const comparisonLoading = document.getElementById("comparison-loading");
    const comparisonError = document.getElementById("comparison-error");
    const comparisonContentArea = document.getElementById("comparison-content-area");
    const compareBatch1Name = document.getElementById("compare-batch1-name");
    const compareBatch2Name = document.getElementById("compare-batch2-name");
    const feedbackDetailModal = document.getElementById("feedback-detail-modal");
    const closeFeedbackDetailModalButton = document.getElementById("close-feedback-detail-modal");
    const feedbackDetailTitle = document.getElementById("feedback-detail-title");
    const sortResponsesSelect = document.getElementById("sort-responses-select");
    const responseCountDisplay = document.getElementById("response-count-display");
    const feedbackDetailLoading = document.getElementById("feedback-detail-loading");
    const feedbackDetailError = document.getElementById("feedback-detail-error");
    const feedbackDetailTable = document.getElementById("feedback-detail-table");
    const feedbackDetailTbody = document.getElementById("feedback-detail-tbody");
    const feedbackDetailThead = feedbackDetailTable ? feedbackDetailTable.querySelector("thead tr") : null;

    // =========================================================================
    // CRITICAL TROUBLESHOOTING: Enable Firebase Debug Logging
    // =========================================================================
    if (firebase && typeof firebase.firestore === 'function') {
        // Enable debug logging for Firestore
        firebase.firestore.setLogLevel('debug');
        console.log("TROUBLESHOOTING: Firebase Firestore debug logging enabled");
        
        // Also try to clear persistence and enable network as per troubleshooting
        const firestoreInstance = firebase.firestore();
        firestoreInstance.clearPersistence()
            .then(() => {
                console.warn("TROUBLESHOOTING: Firestore persistence cleared for this session.");
                return firestoreInstance.enableNetwork();
            })
            .then(() => {
                console.warn("TROUBLESHOOTING: Firestore network explicitly enabled.");
            })
            .catch((err) => {
                console.error("TROUBLESHOOTING: Error with persistence/network management:", err);
            });
    }

    // =========================================================================
    // SECTION: Event Listeners Setup (NEWLY DEFINED)
    // This function will be called once the user is authenticated.
    // Place all event listeners that depend on currentUserId or the dashboard being loaded here.
    // =========================================================================
    function setupEventListeners(userId) {
        // Example: Sidebar Logout Button (if not already handled in auth.onAuthStateChanged scope)
        if (sidebarLogoutButton) {
            sidebarLogoutButton.addEventListener("click", async () => {
                try {
                    await firebase.auth().signOut();
                    console.log("User signed out successfully.");
                    // Redirect to login page is handled by onAuthStateChanged
                } catch (error) {
                    console.error("Error signing out:", error);
                    alert("Error signing out: " + error.message);
                }
            });
        } else {
            console.warn("Logout button not found.");
        }

        // Example: What's New Banner buttons
        if (takeTourButton) {
            takeTourButton.addEventListener("click", () => {
                alert("Tour functionality coming soon!"); // Placeholder
                if (whatsNewBannerElement) whatsNewBannerElement.classList.add("hidden");
            });
        }
        if (dismissBannerButton) {
            dismissBannerButton.addEventListener("click", () => {
                if (whatsNewBannerElement) whatsNewBannerElement.classList.add("hidden");
                // Optionally, save user preference to not show again
            });
        }

        // Example: Export Data Button (Dashboard overview section)
        if (exportDataButtonDashboard) {
            exportDataButtonDashboard.addEventListener("click", () => {
                // Implement export logic for dashboard overview if different from batch export
                alert("Dashboard data export coming soon!");
            });
        }

        // Example: New Batch Button (Dashboard overview section)
        if (newBatchButtonDashboard) {
            newBatchButtonDashboard.addEventListener("click", (e) => {
                e.preventDefault();
                setActiveSection("batch-entry-section"); // Assuming this is the correct section ID
                const contentArea = document.getElementById("dashboard-content-area");
                if (contentArea) contentArea.scrollTop = 0;
            });
        }
        // Add any other event listeners here that *must* be set up only once a user is authenticated
        // and the dashboard elements are guaranteed to be in the DOM and ready for interaction.
        // For instance, if any elements are dynamically added or become interactive only after a user logs in.
    }


    // =========================================================================
    // SECTION: Sidebar Navigation Logic
    // =========================================================================
    function setActiveSection(targetSectionId) {
        if (!dashboardSections || dashboardSections.length === 0) {
            console.error("Sidebar Nav: dashboardSections NodeList is empty or undefined.");
            return;
        }
        dashboardSections.forEach(section => section.classList.remove("active-section"));

        if (!sidebarNavLinks || sidebarNavLinks.length === 0) {
            console.error("Sidebar Nav: sidebarNavLinks NodeList is empty or undefined.");
        } else {
            sidebarNavLinks.forEach(link => link.classList.remove("active-link"));
        }

        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add("active-section");
            if (sidebarNavLinks) {
                sidebarNavLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${targetSectionId}`) {
                        link.classList.add("active-link");
                        if (currentSectionTitleDisplay) {
                            let titleText = link.innerHTML.replace(/<i[^>]*>.*?<\/i>/gi, "").trim();
                            currentSectionTitleDisplay.textContent = titleText || "BrewMetrics Dashboard";
                        }
                    }
                });
            }
        } else {
            console.warn(`Sidebar Nav: Target section "${targetSectionId}" not found. Defaulting to overview.`);
            const overviewSection = document.getElementById("dashboard-overview-section");
            const overviewLink = document.querySelector(".sidebar-nav .nav-link[href=\"#dashboard-overview-section\"]");
            if (overviewSection && overviewLink) {
                overviewSection.classList.add("active-section");
                overviewLink.classList.add("active-link");
                if (currentSectionTitleDisplay) {
                    let titleText = overviewLink.innerHTML.replace(/<i[^>]*>.*?<\/i>/gi, "").trim();
                    currentSectionTitleDisplay.textContent = titleText || "Dashboard";
                }
            } else {
                console.error("Sidebar Nav: Could not find a default section 'dashboard-overview-section' or its link.");
            }
        }
    }

    if (sidebarNavLinks.length > 0) {
        sidebarNavLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetSectionId = link.getAttribute("href")?.substring(1);
                if (targetSectionId) {
                    setActiveSection(targetSectionId);
                    const contentArea = document.getElementById("dashboard-content-area");
                    if (contentArea) contentArea.scrollTop = 0;
                } else {
                    console.warn("Clicked sidebar link has no valid href:", link);
                (targetSectionId);
                }
            });
        });
    } else {
        console.warn("Sidebar navigation links not found. Navigation will not work.");
    }

    // =========================================================================
    // SECTION: Authentication Handling (REFINED WITH LOGIN LOOP FIX)
    // =========================================================================
    // Ensure Firebase Auth object 'auth' is initialized and available globally or scoped here.
    // e.g., const auth = firebase.auth();
    console.log("Auth object initial state:", typeof auth !== "undefined" ? auth : "Auth object not defined yet"); // Enhanced logging

    // Initial UI state: show loading, hide app content
    // This assumes CSS initially hides appContainer and shows loadingIndicator,
    // or you can manage it here if not.
    if (appContainer) appContainer.classList.add("hidden"); // Ensure app is hidden initially
    if (loadingIndicator) {
        loadingIndicator.textContent = "Initializing Dashboard..."; // Generic initial message
        loadingIndicator.style.display = "flex"; // Ensure loader is visible
    }

    if (typeof auth !== "undefined") {
        // Verify persistence setting (optional, for debugging)
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
         .then(() => {
            console.log("Firebase Auth persistence set to LOCAL.");
         })
         .catch((error) => {
            console.error("Error setting Firebase Auth persistence:", error);
         });

        auth.onAuthStateChanged(user => {
            console.log("Auth: onAuthStateChanged event fired. User object:", user); // Enhanced logging
            // This 'user' object is the definitive state from Firebase.
            if (user) {
                console.log("Auth: User is authenticated via onAuthStateChanged:", user.uid);
                currentUserId = user.uid;
                
                // CRITICAL TROUBLESHOOTING: Expose variables to window for console testing
                window.db = db;
                window.currentUserId = currentUserId;
                window.firebase = firebase;
                console.log("TROUBLESHOOTING: window.db, window.currentUserId, and window.firebase are now available for console testing.");

                if (loadingIndicator) loadingIndicator.style.display = "none";
                if (appContainer) appContainer.classList.remove("hidden");

                // Initialize dashboard components
                fetchBreweryData(currentUserId);
                generateQrCode(currentUserId);
                loadFeedbackSummary(currentUserId);
                loadDashboardOverviewData(currentUserId);
                setupEventListeners(currentUserId); // Setup listeners after confirming user

                setActiveSection("dashboard-overview-section"); // Default view

                if (compareBatchesButton) compareBatchesButton.disabled = true;

            } else {
                // User is signed out or session is not yet restored.
                console.log("Auth: onAuthStateChanged reported no user. Waiting briefly for session restoration...");

                if (appContainer) appContainer.classList.add("hidden");
                if (loadingIndicator) {
                    loadingIndicator.textContent = "Verifying session..."; // Updated message
                    loadingIndicator.style.display = "flex";
                }

                setTimeout(() => {
                    console.log("Auth: Checking auth.currentUser after delay..."); // Enhanced logging
                    if (!auth.currentUser) {
                        console.log("Auth: No user session found after delay (auth.currentUser is null). Redirecting to login.");
                        
                        // Reset state (copied from your original else block)
                        currentUserId = null; currentBreweryData = null; currentSurveyUrl = null;
                        currentBatchResponses = []; currentViewedBatchId = null; fetchedAnalyticsData = {};
                        Object.values(window.chartInstances).forEach(chart => { if(chart && typeof chart.destroy === "function") chart.destroy(); });
                        window.chartInstances = {};

                        if (appContainer) appContainer.classList.add("hidden"); // Re-ensure hidden
                        if (loadingIndicator) {
                            loadingIndicator.textContent = "Redirecting to login...";
                            loadingIndicator.style.display = "flex"; // Re-ensure visible
                        }
                        // Ensure this redirect only happens once if onAuthStateChanged fires multiple times during logout
                        if (window.location.pathname.includes("dashboard.html")) { // Avoid redirect loop if already on index
                            console.log("Redirecting from dashboard.html to index.html"); // Enhanced logging
                            window.location.href = "index.html";
                        }
                    } else {
                        // User session was confirmed by auth.currentUser after the delay.
                        // onAuthStateChanged should fire again with the 'user' object,
                        // which will then be handled by the `if (user)` block above.
                        console.log("Auth: User session confirmed by auth.currentUser after delay or by subsequent event. UID:", auth.currentUser.uid);
                        // No redirect needed, the other branch of onAuthStateChanged will handle UI update.
                    }
                }, 1500); // 1.5 second delay to allow Firebase time to restore session
            }
        });
    } else {
        console.error("CRITICAL: Firebase auth object is not defined. Dashboard cannot function.");
        if (loadingIndicator) {
            loadingIndicator.innerHTML = "<p class=\"error-message\">Critical Error: Firebase unavailable. Please refresh.</p>";
            loadingIndicator.style.display = "flex";
        }
        if (appContainer) appContainer.classList.add("hidden");
    }

    // =========================================================================
    // SECTION: Dashboard Overview Data Loading
    // =========================================================================
    async function loadDashboardOverviewData(userId) {
        if (!userId) {
            console.error("loadDashboardOverviewData: No userId provided.");
            if(activeBatchesValueDisplay) activeBatchesValueDisplay.textContent = "0";
            if(feedbackResponsesValueDisplay) feedbackResponsesValueDisplay.textContent = "0";
            if(googleReviewsValueDisplay) googleReviewsValueDisplay.innerHTML = "N/A <small>(0)</small>";
            if(activeDiscountsValueDisplay) activeDiscountsValueDisplay.textContent = "0";
            return;
        }
        console.log("Loading dashboard overview data for user:", userId);

        // Fetch Active Batches Count
        try {
            const activeBatchesQuery = db.collection("breweries").doc(userId).collection("batches").where("isActive", "==", true);
            const activeBatchesSnapshot = await activeBatchesQuery.get();
            if (activeBatchesValueDisplay) activeBatchesValueDisplay.textContent = activeBatchesSnapshot.size;
        } catch (error) {
            console.error("Error fetching active batches count:", error);
            if (activeBatchesValueDisplay) activeBatchesValueDisplay.textContent = "Err";
        }

        // Fetch Total Feedback Responses Count
        try {
            let totalResponsesCount = 0;
            const allBatchesSnapshot = await db.collection("breweries").doc(userId).collection("batches").get();
            const responseCountPromises = [];

            allBatchesSnapshot.forEach(batchDoc => {
                responseCountPromises.push(
                    db.collection("breweries").doc(userId).collection("batches").doc(batchDoc.id).collection("responses").get()
                      .then(responsesSnapshot => responsesSnapshot.size)
                );
            });

            const counts = await Promise.all(responseCountPromises);
            totalResponsesCount = counts.reduce((sum, count) => sum + count, 0);

            if (feedbackResponsesValueDisplay) feedbackResponsesValueDisplay.textContent = totalResponsesCount;
        } catch (error) {
            console.error("Error fetching total feedback responses count:", error);
            if (feedbackResponsesValueDisplay) feedbackResponsesValueDisplay.textContent = "Err";
        }

        // Fetch Google Reviews Data from stored brewery data
        try {
            if (currentBreweryData) {
                const avgRating = currentBreweryData.gmbAvgRating || "N/A";
                const totalReviews = currentBreweryData.gmbTotalReviews || 0;
                if (googleReviewsValueDisplay) {
                    if (avgRating !== "N/A") {
                        googleReviewsValueDisplay.innerHTML = `${Number(avgRating).toFixed(1)} <small>(${totalReviews})</small>`;
                    } else {
                        googleReviewsValueDisplay.innerHTML = `N/A <small>(${totalReviews})</small>`;
                    }
                }
            }
        } catch (error) {
            console.error("Error displaying Google Reviews data:", error);
            if (googleReviewsValueDisplay) googleReviewsValueDisplay.innerHTML = "N/A <small>(Err)</small>";
        }

        // Fetch Active Discounts Count from stored brewery data
        try {
            if (currentBreweryData) {
                const activeDiscountsCount = currentBreweryData.activeDiscountsCount || 0;
                if (activeDiscountsValueDisplay) activeDiscountsValueDisplay.textContent = activeDiscountsCount;
            }
        } catch (error) {
            console.error("Error displaying active discounts count:", error);
            if (activeDiscountsValueDisplay) activeDiscountsValueDisplay.textContent = "Err";
        }

        // Fetch and Display Top Rated Beers
        loadTopRatedBeers(userId, "overall"); // Load overall initially
    }

    // =========================================================================
    // SECTION: Top Rated Beers Logic
    // =========================================================================
    async function loadTopRatedBeers(userId, timePeriod = "overall") {
        if (!userId) {
            console.error("loadTopRatedBeers: No userId provided.");
            if (topRatedBeersListContainer) topRatedBeersListContainer.innerHTML = "<li>Error loading data.</li>";
            return;
        }
        if (!topRatedBeersListContainer) {
            console.error("Top rated beers list container not found.");
            return;
        }

        console.log(`Loading top rated beers for user ${userId}, period: ${timePeriod}`);
        topRatedBeersListContainer.innerHTML = "<li>Loading...</li>";

        try {
            const batchesSnapshot = await db.collection("breweries").doc(userId).collection("batches").get();
            let batchRatings = [];

            const ratingPromises = batchesSnapshot.docs.map(async (batchDoc) => {
                const batchData = batchDoc.data();
                const responsesRef = batchDoc.ref.collection("responses");
                let query = responsesRef;

                // Apply time filter if not 'overall'
                if (timePeriod !== "overall") {
                    const now = new Date();
                    let startDate = new Date();
                    if (timePeriod === "last7days") {
                        startDate.setDate(now.getDate() - 7);
                    } else if (timePeriod === "last30days") {
                        startDate.setDate(now.getDate() - 30);
                    }
                    const startTimestamp = firebase.firestore.Timestamp.fromDate(startDate);
                    query = query.where("respondedAt", ">=", startTimestamp);
                }

                const responsesSnapshot = await query.get();
                let totalRating = 0;
                let responseCount = 0;
                responsesSnapshot.forEach(responseDoc => {
                    const responseData = responseDoc.data();
                    if (responseData.overallRating && typeof responseData.overallRating === 'number') {
                        totalRating += responseData.overallRating;
                        responseCount++;
                    }
                });

                if (responseCount > 0) {
                    return {
                        id: batchDoc.id,
                        name: batchData.beerName || "Unnamed Batch",
                        averageRating: totalRating / responseCount,
                        responseCount: responseCount
                    };
                } else {
                    return null; // No ratings for this batch in the time period
                }
            });

            const results = await Promise.all(ratingPromises);
            batchRatings = results.filter(r => r !== null && r.responseCount > 0); // Filter out nulls and batches with no responses

            // Sort by average rating descending
            batchRatings.sort((a, b) => b.averageRating - a.averageRating);

            // Display top 5 or fewer
            topRatedBeersListContainer.innerHTML = ""; // Clear loading/previous
            if (batchRatings.length === 0) {
                topRatedBeersListContainer.innerHTML = "<li>No rated beers found for this period.</li>";
            } else {
                const topBeers = batchRatings.slice(0, 5);
                topBeers.forEach(beer => {
                    const li = document.createElement("li");
                    li.innerHTML = `<strong>${beer.name}</strong> - <span class="avg-rating-display">${beer.averageRating.toFixed(1)}</span> <small>(${beer.responseCount} responses)</small>`;
                    topRatedBeersListContainer.appendChild(li);
                });
            }

        } catch (error) {
            console.error("Error loading top rated beers:", error);
            topRatedBeersListContainer.innerHTML = "<li>Error loading ratings.</li>";
        }
    }

    // Event listener for the time period selector
    if (topRatedBeersControlsContainer) {
        const timeSelect = topRatedBeersControlsContainer.querySelector("#top-rated-time-select");
        if (timeSelect) {
            timeSelect.addEventListener("change", (e) => {
                if (currentUserId) {
                    loadTopRatedBeers(currentUserId, e.target.value);
                }
            });
        }
    }

    // =========================================================================
    // SECTION: Brewery Data Fetching & Display (Settings Page)
    // =========================================================================
    async function fetchBreweryData(userId) {
        if (!userId) {
            console.error("fetchBreweryData: No userId provided.");
            return;
        }
        console.log("Fetching brewery data for user:", userId);
        try {
            const docRef = db.collection("breweries").doc(userId);
            const docSnap = await docRef.get();

            // Corrected based on problem description: docSnap.exists is a property, not a function
            if (docSnap.exists) { 
                currentBreweryData = docSnap.data();
                console.log("Brewery data fetched:", currentBreweryData);
                displayBreweryData(currentBreweryData);
            } else {
                console.log("No brewery document found for user:", userId);
                // Handle case where brewery data doesn't exist yet (e.g., new user)
                displayBreweryData(null); // Display defaults or empty state
            }
        } catch (error) {
            console.error("Error fetching brewery data:", error);
            // Display error state in the UI
            displayBreweryData(null, "Error loading data.");
        }
    }

    function displayBreweryData(data, errorMessage = null) {
        if (errorMessage) {
            // Display error message in relevant fields
            if (detailBreweryName) detailBreweryName.textContent = errorMessage;
            if (breweryNameDisplaySidebar) breweryNameDisplaySidebar.textContent = "Error";
            // Clear other fields or show error indicators
            if (detailEmail) detailEmail.textContent = "-";
            if (detailLocation) detailLocation.textContent = "-";
            if (detailWebsite) detailWebsite.innerHTML = "-";
            if (detailGmbLink) detailGmbLink.innerHTML = "-";
            if (detailIncentiveText) detailIncentiveText.textContent = "-";
            if (displayGmbAvgRating) displayGmbAvgRating.textContent = "N/A";
            if (displayGmbTotalReviews) displayGmbTotalReviews.textContent = "0";
            if (displayActiveDiscountsCount) displayActiveDiscountsCount.textContent = "0";
            return;
        }

        if (data) {
            if (detailBreweryName) detailBreweryName.textContent = data.breweryName || "Not Set";
            if (breweryNameDisplaySidebar) breweryNameDisplaySidebar.textContent = data.breweryName || "Brewery";
            if (detailEmail) detailEmail.textContent = data.email || "Not Set";
            if (detailLocation) detailLocation.textContent = data.location || "Not Set";
            if (detailWebsite) {
                detailWebsite.innerHTML = data.website ? `<a href="${ensureHttp(data.website)}" target="_blank">${data.website}</a>` : "Not Set";
            }
            if (detailGmbLink) {
                detailGmbLink.innerHTML = data.gmbLink ? `<a href="${ensureHttp(data.gmbLink)}" target="_blank">${data.gmbLink}</a>` : "Not Set";
            }
            if (detailIncentiveText) detailIncentiveText.textContent = data.incentiveText || "Not Set";
            if (displayGmbAvgRating) displayGmbAvgRating.textContent = data.gmbAvgRating || "N/A";
            if (displayGmbTotalReviews) displayGmbTotalReviews.textContent = data.gmbTotalReviews || "0";
            if (displayActiveDiscountsCount) displayActiveDiscountsCount.textContent = data.activeDiscountsCount || "0";
            
            // Populate edit modal fields as well
            if (editBreweryNameInput) editBreweryNameInput.value = data.breweryName || "";
            if (editLocationInput) editLocationInput.value = data.location || "";
            if (editWebsiteInput) editWebsiteInput.value = data.website || "";
            if (editGmbLinkInput) editGmbLinkInput.value = data.gmbLink || "";
            if (editIncentiveTextInput) editIncentiveTextInput.value = data.incentiveText || "";
            if (editGmbAvgRatingInput) editGmbAvgRatingInput.value = data.gmbAvgRating || "";
            if (editGmbTotalReviewsInput) editGmbTotalReviewsInput.value = data.gmbTotalReviews || "";
            if (editActiveDiscountsCountInput) editActiveDiscountsCountInput.value = data.activeDiscountsCount || "";
            
            // Refresh dashboard overview to reflect any updated values
            loadDashboardOverviewData(currentUserId);
        } else {
            // Display default/empty state if no data
            if (detailBreweryName) detailBreweryName.textContent = "Brewery Name Not Set";
            if (breweryNameDisplaySidebar) breweryNameDisplaySidebar.textContent = "Brewery";
            if (detailEmail) detailEmail.textContent = "Email Not Set";
            if (detailLocation) detailLocation.textContent = "Location Not Set";
            if (detailWebsite) detailWebsite.innerHTML = "Website Not Set";
            if (detailGmbLink) detailGmbLink.innerHTML = "GMB Link Not Set";
            if (detailIncentiveText) detailIncentiveText.textContent = "Not Set";
            if (displayGmbAvgRating) displayGmbAvgRating.textContent = "N/A";
            if (displayGmbTotalReviews) displayGmbTotalReviews.textContent = "0";
            if (displayActiveDiscountsCount) displayActiveDiscountsCount.textContent = "0";
            // Clear edit modal fields
            if (editBreweryNameInput) editBreweryNameInput.value = "";
            if (editLocationInput) editLocationInput.value = "";
            if (editWebsiteInput) editWebsiteInput.value = "";
            if (editGmbLinkInput) editGmbLinkInput.value = "";
            if (editIncentiveTextInput) editIncentiveTextInput.value = "";
            if (editGmbAvgRatingInput) editGmbAvgRatingInput.value = "";
            if (editGmbTotalReviewsInput) editGmbTotalReviewsInput.value = "";
            if (editActiveDiscountsCountInput) editActiveDiscountsCountInput.value = "";
        }
    }

    // Helper to ensure links have http/https
    function ensureHttp(url) {
        if (!url) return "#"; // Return a non-breaking value if URL is empty
        if (!/^https?:\/\//i.test(url)) { // Check if it starts with http:// or https:// (case-insensitive)
            return `https://${url}`; // Prepend https:// if it doesn't
        }
        return url; // Return the original URL if it's already valid
    }

    // =========================================================================
    // SECTION: Edit Brewery Modal Logic
    // =========================================================================
    if (editBreweryButton && editBreweryModal && closeEditModalButton && cancelEditButton && editBreweryForm) {
        editBreweryButton.addEventListener("click", () => {
            if (currentBreweryData) { // Pre-fill form if data exists
                editBreweryNameInput.value = currentBreweryData.breweryName || "";
                editLocationInput.value = currentBreweryData.location || "";
                editWebsiteInput.value = currentBreweryData.website || "";
                editGmbLinkInput.value = currentBreweryData.gmbLink || "";
                editIncentiveTextInput.value = currentBreweryData.incentiveText || "";
                editGmbAvgRatingInput.value = currentBreweryData.gmbAvgRating || "";
                editGmbTotalReviewsInput.value = currentBreweryData.gmbTotalReviews || "";
                editActiveDiscountsCountInput.value = currentBreweryData.activeDiscountsCount || "";
            }
            editBreweryModal.classList.remove("hidden");
            if (editBreweryMessage) {
                editBreweryMessage.textContent = "";
                editBreweryMessage.classList.add("hidden");
            }
        });

        const closeEditModal = () => {
            editBreweryModal.classList.add("hidden");
        };

        closeEditModalButton.addEventListener("click", closeEditModal);
        cancelEditButton.addEventListener("click", closeEditModal);

        editBreweryForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!currentUserId) {
                if (editBreweryMessage) {
                    editBreweryMessage.textContent = "Error: Not logged in.";
                    editBreweryMessage.classList.remove("hidden");
                    editBreweryMessage.classList.add("error-message");
                }
                return;
            }

            const updatedData = {
                breweryName: editBreweryNameInput.value.trim(),
                location: editLocationInput.value.trim(),
                website: editWebsiteInput.value.trim(),
                gmbLink: editGmbLinkInput.value.trim(),
                incentiveText: editIncentiveTextInput.value.trim(),
                gmbAvgRating: editGmbAvgRatingInput.value ? parseFloat(editGmbAvgRatingInput.value) : null,
                gmbTotalReviews: editGmbTotalReviewsInput.value ? parseInt(editGmbTotalReviewsInput.value) : 0,
                activeDiscountsCount: editActiveDiscountsCountInput.value ? parseInt(editActiveDiscountsCountInput.value) : 0,
                // email is usually not editable here, managed via auth
            };

            console.log("Attempting to update brewery data for user:", currentUserId, updatedData);
            if (editBreweryMessage) {
                editBreweryMessage.textContent = "Saving...";
                editBreweryMessage.classList.remove("hidden", "error-message", "success-message");
                editBreweryMessage.classList.add("loading-message");
            }

            try {
                const docRef = db.collection("breweries").doc(currentUserId);
                // Use set with merge: true to create or update fields
                await docRef.set(updatedData, { merge: true });
                console.log("Brewery data updated successfully.");
                if (editBreweryMessage) {
                    editBreweryMessage.textContent = "Brewery details saved successfully!";
                    editBreweryMessage.classList.remove("loading-message", "error-message");
                    editBreweryMessage.classList.add("success-message");
                }
                // Refresh displayed data
                fetchBreweryData(currentUserId);
                // Optionally close modal after a short delay
                setTimeout(closeEditModal, 1500);
            } catch (error) {
                console.error("Error updating brewery data:", error);
                if (editBreweryMessage) {
                    editBreweryMessage.textContent = `Error saving: ${error.message}`;
                    editBreweryMessage.classList.remove("loading-message", "success-message");
                    editBreweryMessage.classList.add("error-message");
                }
            }
        });
    } else {
        console.warn("Edit Brewery Modal elements not found. Edit functionality disabled.");
    }

    // =========================================================================
    // SECTION: QR Code Generation & Handling
    // =========================================================================
    async function generateQrCode(userId) {
        if (!userId) {
            console.error("generateQrCode: No userId provided.");
            return;
        }
        if (!qrCodeDisplay) {
            console.warn("QR Code display element not found.");
            return;
        }

        // Construct the survey URL - adjust domain/path as needed
        // Example: https://your-app-domain.com/survey?breweryId=USER_ID
        // Using a placeholder domain for now
        const baseUrl = window.location.origin; // Or your specific survey domain
        currentSurveyUrl = `${baseUrl}/patron_survey?breweryId=${userId}`;
        console.log("Generated Survey URL:", currentSurveyUrl);

        if (qrCodeLinkInput) qrCodeLinkInput.value = currentSurveyUrl;

        // Use a QR code generation library (assuming qrcode.min.js is included)
        if (typeof QRCode !== "undefined") {
            qrCodeDisplay.innerHTML = ""; // Clear previous QR code
            try {
                new QRCode(qrCodeDisplay, {
                    text: currentSurveyUrl,
                    width: 200,
                    height: 200,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H // High correction level
                });
                console.log("QR Code generated successfully.");
                if (qrErrorDiv.parentNode) qrErrorDiv.parentNode.removeChild(qrErrorDiv); // Remove error if shown previously
                if (printQrButton) printQrButton.disabled = false; // Enable print button
            } catch (error) {
                console.error("Error generating QR code:", error);
                qrCodeDisplay.innerHTML = ""; // Clear display on error
                qrErrorDiv.textContent = "Error generating QR code. Please try again.";
                qrCodeDisplay.parentNode.insertBefore(qrErrorDiv, qrCodeDisplay.nextSibling);
                qrErrorDiv.style.display = "block";
            }
        } else {
            console.error("QRCode library is not loaded. Cannot generate QR code.");
            qrCodeDisplay.innerHTML = "";
            qrErrorDiv.textContent = "QR Code library failed to load. Cannot display QR code.";
            qrCodeDisplay.parentNode.insertBefore(qrErrorDiv, qrCodeDisplay.nextSibling);
            qrErrorDiv.style.display = "block";
        }
    }

    if (copyLinkButton && qrCodeLinkInput && copyStatusSpan) {
        copyLinkButton.addEventListener("click", () => {
            qrCodeLinkInput.select();
            qrCodeLinkInput.setSelectionRange(0, 99999); // For mobile devices
            try {
                document.execCommand("copy");
                copyStatusSpan.classList.remove("hidden");
                copyStatusSpan.textContent = "Copied!";
                setTimeout(() => { 
                    copyStatusSpan.classList.add("hidden");
                    copyStatusSpan.textContent = "";
                }, 2000);
            } catch (err) {
                console.error("Failed to copy link: ", err);
                copyStatusSpan.classList.remove("hidden");
                copyStatusSpan.textContent = "Copy failed";
                setTimeout(() => { 
                    copyStatusSpan.classList.add("hidden");
                    copyStatusSpan.textContent = "";
                }, 2000);
            }
        });
    } else {
        console.warn("QR Code copy elements not found. Copy functionality disabled.");
    }

    if (printQrButton && layoutSelect && qrCodeDisplay) {
        printQrButton.addEventListener("click", () => {
            const qrCanvas = qrCodeDisplay.querySelector("canvas");
            const qrImage = qrCodeDisplay.querySelector("img");
            
            let qrSrc = null;
            if (qrCanvas) {
                qrSrc = qrCanvas.toDataURL();
            } else if (qrImage && qrImage.src) {
                qrSrc = qrImage.src;
            }
            
            if (!qrSrc) {
                alert("QR Code not found or not loaded yet.");
                return;
            }
            
            if (!currentBreweryData || !currentBreweryData.breweryName) {
                alert("Brewery name not loaded. Cannot generate print layout.");
                return;
            }

            const layout = layoutSelect.value;
            const breweryName = currentBreweryData.breweryName;
            
            // Store data in localStorage for print template
            const printData = {
                url: currentSurveyUrl,
                name: breweryName,
                layout: layout
            };
            
            localStorage.setItem('brewMetricsQrPrintData', JSON.stringify(printData));
            
            // Open print template in new window
            window.open('print_template.html', '_blank');
        });
    } else {
        console.warn("QR Code print elements not found. Print functionality disabled.");
    }

    // =========================================================================
    // SECTION: Batch Entry Form Handling
    // =========================================================================
    if (batchEntryForm) {
        batchEntryForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!currentUserId) {
                if (batchEntryMessage) {
                    batchEntryMessage.textContent = "Error: Not logged in.";
                    batchEntryMessage.classList.remove("hidden");
                    batchEntryMessage.classList.add("error-message");
                }
                return;
            }

            const batchData = {
                beerName: beerNameInput.value.trim(),
                beerIntro: beerIntroInput.value.trim(),
                abv: parseFloat(abvInput.value.trim()) || 0,
                ibu: ibuInput.value.trim() ? parseInt(ibuInput.value.trim()) : null,
                batchCode: batchCodeInput.value.trim(),
                packagedDate: packagedDateInput.value, // Assuming date input format is okay
                customQuestions: [
                    customQuestion1Input.value.trim(),
                    customQuestion2Input.value.trim(),
                    customQuestion3Input.value.trim()
                ].filter(q => q !== ""), // Only include non-empty custom questions
                isActive: true, // Default to active when created
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Basic validation
            if (!batchData.beerName || !batchData.beerIntro || !batchData.abv || !batchData.batchCode) {
                if (batchEntryMessage) {
                    batchEntryMessage.textContent = "Error: Please fill in all required fields (Beer Name, Description, ABV, and Batch Code).";
                    batchEntryMessage.classList.remove("hidden");
                    batchEntryMessage.classList.add("error-message");
                }
                return;
            }

            console.log("Attempting to add new batch for user:", currentUserId, batchData);
            if (batchEntryMessage) {
                batchEntryMessage.textContent = "Adding batch...";
                batchEntryMessage.classList.remove("hidden", "error-message", "success-message");
                batchEntryMessage.classList.add("loading-message");
            }

            try {
                // === CRITICAL TROUBLESHOOTING LOGS ===
                console.log("Current state of 'db' object:", db);
                if (!db || typeof db.collection !== 'function') {
                    console.error("CRITICAL: Firestore 'db' object is not properly initialized or is not a Firestore instance!");
                    if (batchEntryMessage) {
                        batchEntryMessage.textContent = "CRITICAL: Database connection error. Cannot save batch.";
                        batchEntryMessage.classList.remove("loading-message", "success-message");
                        batchEntryMessage.classList.add("error-message");
                    }
                    return;
                }
                console.log("currentUserId for path:", currentUserId);

                const batchesRef = db.collection("breweries").doc(currentUserId).collection("batches");
                console.log("batchesRef created. About to call .add()");
                
                // Log the actual data being sent
                console.log("Data being sent to Firestore:", batchData);

                const docRef = await batchesRef.add(batchData);
                console.log("Call to batchesRef.add() has awaited/completed on client-side. Document ID:", docRef.id);
                
                // === TROUBLESHOOTING: Check Network Tab NOW ===
                console.warn("TROUBLESHOOTING: Check Network Tab NOW for firestore.googleapis.com requests!");

                if (batchEntryMessage) {
                    batchEntryMessage.textContent = "Batch added successfully!";
                    batchEntryMessage.classList.remove("loading-message", "error-message");
                    batchEntryMessage.classList.add("success-message");
                }
                // Clear the form
                batchEntryForm.reset();
                // Refresh the batch list in the management section
                loadFeedbackSummary(currentUserId);
                // Refresh dashboard overview counts
                loadDashboardOverviewData(currentUserId);
                setTimeout(() => { 
                    if (batchEntryMessage) {
                        batchEntryMessage.textContent = "";
                        batchEntryMessage.classList.add("hidden");
                    }
                }, 3000);
            } catch (error) {
                console.error("Error adding new batch:", error);
                if (batchEntryMessage) {
                    batchEntryMessage.textContent = `Error adding batch: ${error.message}`;
                    batchEntryMessage.classList.remove("loading-message", "success-message");
                    batchEntryMessage.classList.add("error-message");
                }
            }
        });
    } else {
        console.warn("Batch entry form not found. Add batch functionality disabled.");
    }

    // =========================================================================
    // SECTION: Batch Management & Feedback Summary Loading
    // =========================================================================
    async function loadFeedbackSummary(userId) {
        if (!userId) {
            console.error("loadFeedbackSummary: No userId provided.");
            return;
        }
        if (!feedbackList) {
            console.warn("Feedback list container not found.");
            return;
        }

        console.log("Loading feedback summary for user:", userId);
        if (feedbackLoading) feedbackLoading.style.display = "block";
        if (feedbackError) feedbackError.classList.add("hidden");
        feedbackList.innerHTML = ""; // Clear previous list
        currentBatchResponses = []; // Reset cached responses

        try {
            const batchesRef = db.collection("breweries").doc(userId).collection("batches");
            const batchesSnapshot = await batchesRef.orderBy("createdAt", "desc").get();

            if (batchesSnapshot.empty) {
                feedbackList.innerHTML = "<li class=\"no-data\">No batches found. Add a new batch to start collecting feedback.</li>";
                if (feedbackLoading) feedbackLoading.style.display = "none";
                if (compareBatchesButton) compareBatchesButton.disabled = true;
                if (exportAllCsvButton) exportAllCsvButton.disabled = true;
                return;
            }

            const feedbackPromises = batchesSnapshot.docs.map(async (batchDoc) => {
                const batchData = batchDoc.data();
                const batchId = batchDoc.id;
                const responsesRef = batchDoc.ref.collection("responses");
                const responsesSnapshot = await responsesRef.get();
                const responseCount = responsesSnapshot.size;

                // Calculate average rating and aggregate taste profile data
                let totalOverallRating = 0;
                let ratedResponseCount = 0;
                const responses = []; // Store individual responses for detail view
                const tasteProfileSums = Array(8).fill(0);
                const tasteProfileCounts = Array(8).fill(0);

                responsesSnapshot.forEach(responseDoc => {
                    const responseData = responseDoc.data();
                    responses.push({ id: responseDoc.id, ...responseData });

                    // Collect overall ratings
                    if (responseData.overallRating && typeof responseData.overallRating === 'number' && responseData.overallRating >= 1 && responseData.overallRating <= 5) {
                        totalOverallRating += responseData.overallRating;
                        ratedResponseCount++;
                    }
                    
                    // Collect taste profile data from surveyAnswers array
                    if (responseData.surveyAnswers && Array.isArray(responseData.surveyAnswers)) {
                        responseData.surveyAnswers.forEach(answer => {
                            if (answer.questionId >= 0 && answer.questionId < 8 && typeof answer.answer === 'number') {
                                tasteProfileSums[answer.questionId] += answer.answer;
                                tasteProfileCounts[answer.questionId]++;
                            }
                        });
                    }
                });

                const averageRating = ratedResponseCount > 0 ? (totalOverallRating / ratedResponseCount) : null;
                const tasteProfileAverages = tasteProfileSums.map((sum, i) => 
                    tasteProfileCounts[i] > 0 ? sum / tasteProfileCounts[i] : null
                );

                // Store responses for potential detail view and comparison
                currentBatchResponses.push({ batchId, batchData, responses });

                return {
                    id: batchId,
                    data: batchData,
                    responseCount: responseCount,
                    averageRating: averageRating,
                    tasteProfileAverages: tasteProfileAverages,
                    tasteProfileCounts: tasteProfileCounts
                };
            });

            const feedbackSummaries = await Promise.all(feedbackPromises);

            // Populate the list with the enhanced template from style.css
            feedbackSummaries.forEach(summary => {
                const li = document.createElement("li");
                li.classList.add("feedback-summary-item");
                li.dataset.id = summary.id;
                li.dataset.active = summary.data.isActive !== undefined ? summary.data.isActive : true;

                // Create the enhanced UI structure
                let feedbackItemHTML = `
                    <div class="feedback-item-header">
                        <input type="checkbox" class="compare-checkbox" data-batch-id="${summary.id}" title="Select for comparison">
                        <h4 class="beer-name">${summary.data.beerName || 'Unnamed Beer'}</h4>
                        <span class="batch-code">${summary.data.batchCode || 'No Code'}</span>
                        <span class="status-indicator ${summary.data.isActive !== false ? 'active' : 'inactive'}">${summary.data.isActive !== false ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                    
                    <div class="batch-general-stats">
                        <div class="stat-item">
                            <i class="fas fa-comments"></i>
                            <span class="stat-label">Responses:</span>
                            <span class="stat-value">${summary.responseCount}</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-star"></i>
                            <span class="stat-label">Overall Avg:</span>
                            <span class="stat-value">${summary.averageRating !== null ? summary.averageRating.toFixed(1) : 'N/A'}</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-percent"></i>
                            <span class="stat-label">ABV:</span>
                            <span class="stat-value">${summary.data.abv || 'N/A'}%</span>
                        </div>
                `;
                
                if (summary.data.ibu) {
                    feedbackItemHTML += `
                        <div class="stat-item">
                            <i class="fas fa-leaf"></i>
                            <span class="stat-label">IBU:</span>
                            <span class="stat-value">${summary.data.ibu}</span>
                        </div>
                    `;
                }
                
                if (summary.data.packagedDate) {
                    feedbackItemHTML += `
                        <div class="stat-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span class="stat-label">Packaged:</span>
                            <span class="stat-value">${summary.data.packagedDate}</span>
                        </div>
                    `;
                }
                
                feedbackItemHTML += `</div>`; // Close batch-general-stats
                
                // Taste Profile Details section
                feedbackItemHTML += `
                    <div class="taste-profile-details">
                        <h5>Taste Profile Averages</h5>
                `;
                
                if (summary.responseCount > 0) {
                    feedbackItemHTML += `<div class="taste-profile-grid">`;
                    
                    const tasteIcons = ['fa-candy-cane', 'fa-lemon', 'fa-pepper-hot', 'fa-weight', 'fa-wind', 'fa-wheat-awn', 'fa-seedling', 'fa-flag-checkered'];
                    const tasteIconClasses = ['taste-icon-sweetness', 'taste-icon-acidity', 'taste-icon-bitterness', 'taste-icon-body', 'taste-icon-carbonation', 'taste-icon-malt', 'taste-icon-hop', 'taste-icon-finish'];
                    
                    standardQuestionLabelArray.forEach((label, i) => {
                        const avg = summary.tasteProfileAverages[i];
                        const count = summary.tasteProfileCounts[i];
                        feedbackItemHTML += `
                            <div class="taste-stat">
                                <i class="fas ${tasteIcons[i]} ${tasteIconClasses[i]}"></i>
                                <span class="stat-label">${label}:</span>
                                <span class="stat-value ${avg === null ? 'na' : ''}">${avg !== null ? avg.toFixed(1) : 'N/A'}</span>
                                ${count > 0 ? `<span class="stat-count">(${count})</span>` : ''}
                            </div>
                        `;
                    });
                    
                    feedbackItemHTML += `</div>`;
                } else {
                    feedbackItemHTML += `<p class="no-responses-message">No responses yet for taste profile analysis.</p>`;
                }
                
                feedbackItemHTML += `</div>`; // Close taste-profile-details
                
                // Action buttons
                feedbackItemHTML += `
                    <div class="feedback-item-actions">
                        <button class="btn btn-secondary btn-small view-feedback-details-button" data-batch-id="${summary.id}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-primary btn-small export-single-csv-button" data-batch-id="${summary.id}">
                            <i class="fas fa-file-csv"></i> Export CSV
                        </button>
                        <button class="btn ${summary.data.isActive !== false ? 'btn-danger' : 'btn-success'} btn-small toggle-active-button" data-batch-id="${summary.id}" data-current-status="${summary.data.isActive !== false}">
                            <i class="fas fa-toggle-${summary.data.isActive !== false ? 'off' : 'on'}"></i> ${summary.data.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button class="icon-button analyze-batch-button" title="Analyze Batch Feedback" data-batch-id="${summary.id}">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="icon-button edit-batch-button" title="Edit Batch Info (Coming Soon)" data-batch-id="${summary.id}" disabled>
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    
                    <div class="batch-analytics-area" id="analytics-${summary.id}">
                        </div>
                `;
                
                li.innerHTML = feedbackItemHTML;
                feedbackList.appendChild(li);
            });

            // Add event listeners after items are added
            addFeedbackItemListeners(userId);
            updateCompareButtonState(); // Enable/disable compare button based on checkboxes
            if (exportAllCsvButton) exportAllCsvButton.disabled = feedbackSummaries.length === 0;

            if (feedbackLoading) feedbackLoading.style.display = "none";

        } catch (error) {
            console.error("Error loading feedback summary:", error);
            if (feedbackLoading) feedbackLoading.style.display = "none";
            if (feedbackError) {
                feedbackError.textContent = `Error loading batches: ${error.message}`;
                feedbackError.classList.remove("hidden");
            }
            feedbackList.innerHTML = "<li class=\"no-data error\">Failed to load batch data. Please try again later.</li>";
            if (compareBatchesButton) compareBatchesButton.disabled = true;
            if (exportAllCsvButton) exportAllCsvButton.disabled = true;
        }
    }

    function addFeedbackItemListeners(userId) {
        const detailButtons = feedbackList.querySelectorAll(".view-feedback-details-button");
        const toggleButtons = feedbackList.querySelectorAll(".toggle-active-button");
        const exportButtons = feedbackList.querySelectorAll(".export-single-csv-button");
        const compareCheckboxes = feedbackList.querySelectorAll(".compare-checkbox");
        const analyzeButtons = feedbackList.querySelectorAll(".analyze-batch-button");

        detailButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                const batchId = e.target.closest('.view-feedback-details-button').dataset.batchId;
                console.log("View Details clicked for batch:", batchId);
                openFeedbackDetailModal(batchId);
            });
        });

        toggleButtons.forEach(button => {
            button.addEventListener("click", async (e) => {
                e.stopPropagation();
                const btn = e.target.closest('.toggle-active-button');
                const batchId = btn.dataset.batchId;
                const listItem = btn.closest(".feedback-summary-item");
                const currentlyActive = btn.dataset.currentStatus === "true";
                const newStatus = !currentlyActive;

                console.log(`Toggling active status for batch ${batchId} to ${newStatus}`);
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

                try {
                    const batchRef = db.collection("breweries").doc(userId).collection("batches").doc(batchId);
                    await batchRef.update({ isActive: newStatus });
                    console.log(`Batch ${batchId} status updated to ${newStatus}`);

                    // Update UI immediately
                    const statusIndicator = listItem.querySelector(".status-indicator");
                    if (statusIndicator) {
                        statusIndicator.className = `status-indicator ${newStatus ? "active" : "inactive"}`;
                        statusIndicator.textContent = newStatus ? "ACTIVE" : "INACTIVE";
                    }
                    
                    // Update list item data attribute
                    listItem.dataset.active = newStatus;
                    
                    // Update button
                    btn.dataset.currentStatus = newStatus;
                    btn.className = `btn ${newStatus ? 'btn-danger' : 'btn-success'} btn-small toggle-active-button`;
                    btn.innerHTML = `<i class="fas fa-toggle-${newStatus ? 'off' : 'on'}"></i> ${newStatus ? "Deactivate" : "Activate"}`;
                    
                    loadDashboardOverviewData(userId); // Refresh overview counts
                } catch (error) {
                    console.error(`Error updating status for batch ${batchId}:`, error);
                    alert(`Failed to update status: ${error.message}`);
                    // Revert button on error
                    btn.innerHTML = `<i class="fas fa-toggle-${currentlyActive ? 'off' : 'on'}"></i> ${currentlyActive ? "Deactivate" : "Activate"}`;
                }
                btn.disabled = false;
            });
        });

        exportButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                const batchId = e.target.closest('.export-single-csv-button').dataset.batchId;
                console.log("Export Single CSV clicked for batch:", batchId);
                exportSingleBatchCsv(batchId);
            });
        });

        compareCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("click", (e) => {
                e.stopPropagation();
                updateCompareButtonState();
            });
        });

        analyzeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                const batchId = e.target.closest('.analyze-batch-button').dataset.batchId;
                const analyticsArea = document.getElementById(`analytics-${batchId}`);
                
                if (analyticsArea.classList.contains("visible")) {
                    // Hide analytics
                    analyticsArea.classList.remove("visible");
                } else {
                    // Show analytics and generate charts
                    analyticsArea.classList.add("visible");
                    generateBatchAnalytics(batchId, analyticsArea);
                }
            });
        });
    }

    function generateBatchAnalytics(batchId, container) {
        const batchData = currentBatchResponses.find(b => b.batchId === batchId);
        if (!batchData || !batchData.responses || batchData.responses.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">No response data available for analytics.</p>';
            return;
        }

        // Clear previous content
        container.innerHTML = '';

        // Create chart containers
        const chartsHTML = `
            <div class="chart-container">
                <h5>Overall Rating Distribution</h5>
                <canvas id="rating-dist-${batchId}"></canvas>
            </div>
            <div class="chart-container">
                <h5>Rating Trend Over Time</h5>
                <canvas id="rating-trend-${batchId}"></canvas>
                <div id="trend-msg-${batchId}" class="chart-message"></div>
            </div>
            <div class="chart-container">
                <h5>Taste Profile Radar</h5>
                <canvas id="taste-radar-${batchId}"></canvas>
            </div>
        `;
        container.innerHTML = chartsHTML;

        // Generate Overall Rating Distribution Chart
        const ratingCounts = [0, 0, 0, 0, 0]; // For ratings 1-5
        batchData.responses.forEach(r => {
            if (r.overallRating >= 1 && r.overallRating <= 5) {
                ratingCounts[r.overallRating - 1]++;
            }
        });

        const distCtx = document.getElementById(`rating-dist-${batchId}`).getContext("2d");
        new Chart(distCtx, {
            type: 'bar',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Number of Responses',
                    data: ratingCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Generate Rating Trend Over Time
        const sortedResponses = [...batchData.responses]
            .filter(r => r.respondedAt && r.overallRating)
            .sort((a, b) => {
                const dateA = a.respondedAt.toDate ? a.respondedAt.toDate() : new Date(a.respondedAt);
                const dateB = b.respondedAt.toDate ? b.respondedAt.toDate() : new Date(b.respondedAt);
                return dateA - dateB;
            });

        if (sortedResponses.length > 1) {
            const trendLabels = sortedResponses.map(r => {
                const date = r.respondedAt.toDate ? r.respondedAt.toDate() : new Date(r.respondedAt);
                return date.toLocaleDateString();
            });
            const trendData = sortedResponses.map(r => r.overallRating);

            const trendCtx = document.getElementById(`rating-trend-${batchId}`).getContext("2d");
            new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: trendLabels,
                    datasets: [{
                        label: 'Overall Rating',
                        data: trendData,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 1,
                            max: 5,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } else {
            document.getElementById(`trend-msg-${batchId}`).textContent = "Not enough data points for trend analysis.";
        }

        // Generate Taste Profile Radar Chart
        const tasteData = calculateAverageRatings(batchData.responses);
        const radarCtx = document.getElementById(`taste-radar-${batchId}`).getContext("2d");
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: tasteData.labels,
                datasets: [{
                    label: batchData.batchData.beerName,
                    data: tasteData.averages,
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function updateCompareButtonState() {
        if (!compareBatchesButton) return;
        const checkedBoxes = feedbackList.querySelectorAll(".compare-checkbox:checked");
        compareBatchesButton.disabled = checkedBoxes.length !== 2;
        compareBatchesButton.textContent = `Compare Selected (${checkedBoxes.length})`;
    }

    // =========================================================================
    // SECTION: Feedback Detail Modal Logic
    // =========================================================================
    function openFeedbackDetailModal(batchId) {
        if (!feedbackDetailModal || !closeFeedbackDetailModalButton || !feedbackDetailTbody || !feedbackDetailTitle || !feedbackDetailLoading || !feedbackDetailError || !responseCountDisplay || !sortResponsesSelect || !feedbackDetailThead) {
            console.error("Feedback detail modal elements not found.");
            return;
        }

        currentViewedBatchId = batchId;
        const batchCacheEntry = currentBatchResponses.find(b => b.batchId === batchId);

        if (!batchCacheEntry) {
            console.error("Data for batch not found in cache:", batchId);
            feedbackDetailTitle.textContent = "Error";
            feedbackDetailError.textContent = "Could not find data for this batch.";
            feedbackDetailError.classList.remove("hidden");
            feedbackDetailLoading.style.display = "none";
            feedbackDetailTbody.innerHTML = "";
            feedbackDetailModal.classList.add("visible");
            return;
        }
        
        const { batchData, responses } = batchCacheEntry;

        feedbackDetailTitle.textContent = `Detailed Feedback for: ${batchData.beerName || "Unnamed Batch"}`;
        feedbackDetailLoading.style.display = "none"; 
        feedbackDetailError.classList.add("hidden");

        // Populate custom question headers
        const customHeaders = batchData.customQuestions || [];
        let headerHtml = `<th class="timestamp-col">Responded At</th>`;
        standardQuestionLabelArray.forEach((label) => {
            headerHtml += `<th class="rating-col">${label}</th>`;
        });
        customHeaders.forEach((q, index) => {
            headerHtml += `<th>Custom Q${index + 1}: ${q.length > 20 ? q.substring(0,18) + '...' : q}</th>`;
        });
        headerHtml += `<th>Overall Rating</th>`;
        feedbackDetailThead.innerHTML = headerHtml;

        populateFeedbackTable(responses, batchData.customQuestions || []);

        // Reset sort dropdown
        sortResponsesSelect.value = "respondedAt_desc";

        feedbackDetailModal.classList.add("visible");
    }

    function populateFeedbackTable(responses, customQuestions = [], sortBy = "respondedAt_desc") {
        if (!feedbackDetailTbody || !responseCountDisplay) return;

        feedbackDetailTbody.innerHTML = ""; 
        responseCountDisplay.textContent = `(${responses.length} responses)`;

        if (responses.length === 0) {
            const colspan = 2 + standardQuestionLabelArray.length + customQuestions.length;
            feedbackDetailTbody.innerHTML = `<tr><td colspan="${colspan}">No feedback responses recorded for this batch yet.</td></tr>`;
            return;
        }

        const sortedResponses = [...responses].sort((a, b) => {
            let valA, valB;
            const timeA = a.respondedAt?.toDate ? a.respondedAt.toDate().getTime() : 0;
            const timeB = b.respondedAt?.toDate ? b.respondedAt.toDate().getTime() : 0;

            switch (sortBy) {
                case "respondedAt_asc":
                    return timeA - timeB;
                case "overallRating_desc":
                    valA = a.overallRating || 0;
                    valB = b.overallRating || 0;
                    return valB - valA;
                case "overallRating_asc":
                    valA = a.overallRating || 0;
                    valB = b.overallRating || 0;
                    return valA - valB;
                case "respondedAt_desc":
                default:
                    return timeB - timeA;
            }
        });

        sortedResponses.forEach(response => {
            const tr = document.createElement("tr");
            const responseDate = response.respondedAt?.toDate ? response.respondedAt.toDate() : null;
            const timestampDisplay = responseDate ? responseDate.toLocaleString() : "N/A";
            
            let rowHtml = `<td class="timestamp-col">${timestampDisplay}</td>`;

            // Standard ratings from surveyAnswers array
            for (let i = 0; i < 8; i++) {
                let rating = "-";
                if (response.surveyAnswers) {
                    const answerObj = response.surveyAnswers.find(sa => sa.questionId === i);
                    if (answerObj && typeof answerObj.answer === 'number') {
                        rating = answerObj.answer;
                    }
                }
                rowHtml += `<td class="rating-col">${rating}</td>`;
            }
            
            // Custom question answers
            customQuestions.forEach((customQText, index) => {
                let answer = "-";
                if (response.surveyAnswers) {
                    const customAnswerObj = response.surveyAnswers.find(sa => sa.questionId === (8 + index));
                    if (customAnswerObj && customAnswerObj.answer !== undefined) {
                        answer = customAnswerObj.answer;
                    }
                }
                rowHtml += `<td>${answer}</td>`;
            });
            
            // Overall Rating
            const overallRating = (response.overallRating && typeof response.overallRating === 'number') ? response.overallRating : "-";
            rowHtml += `<td class="rating-col">${overallRating}</td>`;

            tr.innerHTML = rowHtml;
            feedbackDetailTbody.appendChild(tr);
        });
    }

    if (closeFeedbackDetailModalButton && feedbackDetailModal) {
        closeFeedbackDetailModalButton.addEventListener("click", () => {
            feedbackDetailModal.classList.remove("visible");
            currentViewedBatchId = null;
        });
    }

    if (sortResponsesSelect) {
        sortResponsesSelect.addEventListener("change", (e) => {
            if (currentViewedBatchId) {
                const batchData = currentBatchResponses.find(b => b.batchId === currentViewedBatchId);
                if (batchData) {
                    populateFeedbackTable(batchData.responses, batchData.batchData.customQuestions || [], e.target.value);
                }
            }
        });
    }

    // =========================================================================
    // SECTION: Data Export Logic (CSV)
    // =========================================================================
    function exportSingleBatchCsv(batchId) {
        const batchData = currentBatchResponses.find(b => b.batchId === batchId);
        if (!batchData) {
            alert("Error: Could not find data for the selected batch.");
            return;
        }
        console.log("Exporting CSV for batch:", batchData.batchData.beerName);
        const dataToExport = [batchData]; 
        const breweryName = currentBreweryData?.breweryName || "Brewery";
        const filenameSafeBreweryName = breweryName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filenameSafeBeerName = batchData.batchData.beerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        generateAndDownloadCsv(dataToExport, `${filenameSafeBreweryName}_${filenameSafeBeerName}_${batchId}_feedback.csv`);
    }

    if (exportAllCsvButton) {
        exportAllCsvButton.addEventListener("click", () => {
            if (!currentBatchResponses || currentBatchResponses.length === 0) {
                alert("No batch data loaded to export.");
                return;
            }
            // Filter for active batches only for "Export All Active"
            const activeBatchesToExport = currentBatchResponses.filter(br => br.batchData.isActive !== false);
            if (activeBatchesToExport.length === 0) {
                alert("No active batches with data to export.");
                if (exportMessage) {
                    exportMessage.textContent = "No active batches to export.";
                    exportMessage.classList.remove("hidden", "success-message", "error-message");
                    exportMessage.classList.add("info-message");
                    setTimeout(() => { exportMessage.classList.add("hidden"); }, 3000);
                }
                return;
            }

            console.log("Exporting CSV for all active batches.");
            const breweryName = currentBreweryData?.breweryName || "Brewery";
            const filenameSafeBreweryName = breweryName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            generateAndDownloadCsv(activeBatchesToExport, `${filenameSafeBreweryName}_all_active_batches_feedback.csv`);
        });
    } else {
        console.warn("Export All CSV button not found.");
    }

    function generateAndDownloadCsv(batchResponseData, filename) {
        if (!batchResponseData || batchResponseData.length === 0) {
            if (exportMessage) {
                exportMessage.textContent = "No data to export.";
                exportMessage.classList.remove("hidden", "success-message", "error-message");
                exportMessage.classList.add("info-message");
                setTimeout(() => { exportMessage.classList.add("hidden"); }, 3000);
            }
            return;
        }

        let csvContent = "";
        
        const maxCustomQuestions = Math.max(...batchResponseData.map(b => (b.batchData.customQuestions || []).length), 0);

        const headers = [
            "BreweryID", "BreweryName",
            "BatchID", "BatchName", "BatchCode", "PackagedDate", "BatchIsActive",
            "ResponseID", "RespondedTimestamp",
            ...standardQuestionLabelArray,
        ];
        for(let i=0; i < maxCustomQuestions; i++) {
            headers.push(`CustomQuestion${i+1}_Text`);
            headers.push(`CustomQuestion${i+1}_Answer`);
        }
        headers.push("OverallRating");
        csvContent += headers.join(",") + "\r\n";

        batchResponseData.forEach(batch => {
            const breweryId = currentUserId || "N/A";
            const breweryName = currentBreweryData?.breweryName || "N/A";
            const batchId = batch.batchId;
            const batchName = batch.batchData.beerName || "Unnamed";
            const batchCode = batch.batchData.batchCode || "N/A";
            const packagedDate = batch.batchData.packagedDate || "N/A";
            const batchIsActive = batch.batchData.isActive !== undefined ? batch.batchData.isActive : "N/A";
            const customQuestionTexts = batch.batchData.customQuestions || [];

            if (batch.responses && batch.responses.length > 0) {
                batch.responses.forEach(response => {
                    const responseId = response.id;
                    const responseTimestamp = response.respondedAt?.toDate ? response.respondedAt.toDate().toISOString() : "";
                    
                    const row = [
                        breweryId, `"${breweryName.replace(/"/g, `""`)}"`,
                        batchId, `"${batchName.replace(/"/g, `""`)}"`, batchCode, packagedDate, batchIsActive,
                        responseId, responseTimestamp
                    ];

                    // Standard ratings from surveyAnswers
                    for (let i = 0; i < 8; i++) {
                        let rating = "";
                        if (response.surveyAnswers) {
                            const answerObj = response.surveyAnswers.find(sa => sa.questionId === i);
                            if (answerObj && typeof answerObj.answer === 'number') rating = answerObj.answer;
                        }
                        row.push(rating);
                    }

                    // Custom answers
                    for (let i = 0; i < maxCustomQuestions; i++) {
                        const qText = customQuestionTexts[i] || "";
                        row.push(`"${qText.replace(/"/g, `""`)}"`);

                        let answer = "";
                        if (response.surveyAnswers) {
                            const customAnswerObj = response.surveyAnswers.find(sa => sa.questionId === (8 + i));
                            if (customAnswerObj && customAnswerObj.answer !== undefined) answer = customAnswerObj.answer;
                        }
                        row.push(answer);
                    }
                    
                    row.push(response.overallRating !== undefined ? response.overallRating : "");

                    csvContent += row.join(",") + "\r\n";
                });
            } else {
                // Include batches with no responses
                const emptyResponseRow = [
                    breweryId, `"${breweryName.replace(/"/g, `""`)}"`,
                    batchId, `"${batchName.replace(/"/g, `""`)}"`, batchCode, packagedDate, batchIsActive,
                    "NO_RESPONSES", "",
                ];
                for(let i=0; i < 8; i++) emptyResponseRow.push(""); // Standard ratings
                for(let i=0; i < maxCustomQuestions; i++) {
                    const qText = customQuestionTexts[i] || "";
                    emptyResponseRow.push(`"${qText.replace(/"/g, `""`)}"`);
                    emptyResponseRow.push("");
                }
                emptyResponseRow.push(""); // Overall
                csvContent += emptyResponseRow.join(",") + "\r\n";
            }
        });

        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) { 
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            if (exportMessage) {
                exportMessage.textContent = "CSV exported successfully!";
                exportMessage.classList.remove("hidden", "info-message", "error-message");
                exportMessage.classList.add("success-message");
                setTimeout(() => { exportMessage.classList.add("hidden"); }, 3000);
            }
        } else {
            alert("CSV download is not supported by your browser.");
            if (exportMessage) {
                exportMessage.textContent = "Export failed: Browser not supported.";
                exportMessage.classList.remove("hidden", "success-message", "info-message");
                exportMessage.classList.add("error-message");
                setTimeout(() => { exportMessage.classList.add("hidden"); }, 3000);
            }
        }
    }

    // =========================================================================
    // SECTION: Batch Comparison Modal Logic
    // =========================================================================
    if (compareBatchesButton && comparisonModal && closeComparisonModalButton && comparisonContentArea && comparisonLoading && comparisonError) {
        compareBatchesButton.addEventListener("click", () => {
            const checkedBoxes = feedbackList.querySelectorAll(".compare-checkbox:checked");
            if (checkedBoxes.length !== 2) {
                alert("Please select exactly two batches to compare.");
                return;
            }

            const batchId1 = checkedBoxes[0].dataset.batchId;
            const batchId2 = checkedBoxes[1].dataset.batchId;
            console.log("Comparing batches:", batchId1, "and", batchId2);

            openComparisonModal(batchId1, batchId2);
        });

        closeComparisonModalButton.addEventListener("click", () => {
            comparisonModal.classList.remove("visible");
            destroyComparisonCharts();
        });

    } else {
        console.warn("Comparison modal elements not found. Comparison functionality disabled.");
    }

    function openComparisonModal(batchId1, batchId2) {
        if (!comparisonModal || !comparisonContentArea || !comparisonLoading || !comparisonError || !compareBatch1Name || !compareBatch2Name) return;

        comparisonLoading.style.display = "block";
        comparisonError.classList.add("hidden");
        comparisonContentArea.style.display = "none";

        const batch1 = currentBatchResponses.find(b => b.batchId === batchId1);
        const batch2 = currentBatchResponses.find(b => b.batchId === batchId2);

        if (!batch1 || !batch2) {
            console.error("Could not find data for one or both batches to compare.");
            comparisonError.textContent = "Error: Data not found for selected batches.";
            comparisonError.classList.remove("hidden");
            comparisonLoading.style.display = "none";
            comparisonModal.classList.add("visible");
            return;
        }

        // Update batch names
        compareBatch1Name.textContent = `${batch1.batchData.beerName} (${batch1.responses.length} resp.)`;
        compareBatch2Name.textContent = `${batch2.batchData.beerName} (${batch2.responses.length} resp.)`;

        // Prepare data for charts
        const data1 = calculateAverageRatings(batch1.responses);
        const data2 = calculateAverageRatings(batch2.responses);

        // Generate all comparison charts
        setTimeout(() => {
            // Overall Rating Distribution
            generateComparisonRatingDistribution("compare-dist-chart-1", batch1.responses, batch1.batchData.beerName);
            generateComparisonRatingDistribution("compare-dist-chart-2", batch2.responses, batch2.batchData.beerName);

            // Rating Trend Over Time
            generateComparisonRatingTrend("compare-trend-chart-1", batch1.responses, batch1.batchData.beerName, "compareTrendMsg1");
            generateComparisonRatingTrend("compare-trend-chart-2", batch2.responses, batch2.batchData.beerName, "compareTrendMsg2");

            // Taste Profile Radar
            createComparisonRadarChart("compare-profile-chart-1", data1.labels, data1.averages, batch1.batchData.beerName);
            createComparisonRadarChart("compare-profile-chart-2", data2.labels, data2.averages, batch2.batchData.beerName);

            // Taste Attribute Trends
            generateComparisonAttributeTrends("compare-taste-attribute-trend-chart-1", batch1.responses, batch1.batchData.beerName, "compareTasteAttributeTrendMsg1");
            generateComparisonAttributeTrends("compare-taste-attribute-trend-chart-2", batch2.responses, batch2.batchData.beerName, "compareTasteAttributeTrendMsg2");

            comparisonLoading.style.display = "none";
            comparisonContentArea.style.display = "flex";
        }, 100);

        comparisonModal.classList.add("visible");
    }

    function generateComparisonRatingDistribution(canvasId, responses, beerName) {
        const ctx = document.getElementById(canvasId)?.getContext("2d");
        if (!ctx) {
            console.warn(`Canvas with ID ${canvasId} not found for rating distribution chart.`);
            return;
        }

        const ratingCounts = [0, 0, 0, 0, 0];
        responses.forEach(r => {
            if (r.overallRating >= 1 && r.overallRating <= 5) {
                ratingCounts[r.overallRating - 1]++;
            }
        });

        const chartId = `chart_${canvasId}`;
        if (window.chartInstances[chartId]) window.chartInstances[chartId].destroy();

        window.chartInstances[chartId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5'],
                datasets: [{
                    label: 'Responses',
                    data: ratingCounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `${beerName} - Overall Rating Distribution`
                    },
                    legend: { display: false }
                }
            }
        });
    }

    function generateComparisonRatingTrend(canvasId, responses, beerName, messageDivId) {
        const ctx = document.getElementById(canvasId)?.getContext("2d");
        const messageDiv = document.getElementById(messageDivId);
        if (!ctx) {
            if (messageDiv) messageDiv.textContent = "Chart area not found.";
            return;
        }
        // Filter and sort responses by date
        const sortedResponses = responses
            .filter(r => r.respondedAt && r.overallRating)
            .sort((a, b) => {
                const dateA = a.respondedAt.toDate ? a.respondedAt.toDate() : new Date(a.respondedAt);
                const dateB = b.respondedAt.toDate ? b.respondedAt.toDate() : new Date(b.respondedAt);
                return dateA - dateB;
            });

        if (sortedResponses.length > 1) {
            const trendLabels = sortedResponses.map(r => {
                const date = r.respondedAt.toDate ? r.respondedAt.toDate() : new Date(r.respondedAt);
                return date.toLocaleDateString();
            });
            const trendData = sortedResponses.map(r => r.overallRating);

            const chartId = `chart_${canvasId}`;
            if (window.chartInstances[chartId]) window.chartInstances[chartId].destroy();

            window.chartInstances[chartId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: trendLabels,
                    datasets: [{
                        label: 'Overall Rating',
                        data: trendData,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 1,
                            max: 5,
                            ticks: { stepSize: 1 }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `${beerName} - Rating Trend`
                        },
                        legend: { display: false }
                    }
                }
            });
            if (messageDiv) messageDiv.textContent = "";
                } else {
                    if (messageDiv) messageDiv.textContent = "Not enough data points for trend analysis.";
                }
            } // <-- Close generateComparisonRatingTrend function
        
            // =========================================================================
            // SECTION: Taste Profile Radar Chart Helper
            // =========================================================================
            function calculateAverageRatings(responses) {
                const averages = [];
                const counts = [];
                for (let i = 0; i < 8; i++) {
                    let sum = 0;
                    let count = 0;
                    responses.forEach(r => {
                        if (r.surveyAnswers) {
                            const answerObj = r.surveyAnswers.find(sa => sa.questionId === i);
                            if (answerObj && typeof answerObj.answer === 'number') {
                                sum += answerObj.answer;
                                count++;
                            }
                        }
                    });
                    averages[i] = count > 0 ? sum / count : null;
                    counts[i] = count;
                }
                return {
                    labels: standardQuestionLabelArray,
                    averages: averages,
                    counts: counts
                };
            }
        
            function createComparisonRadarChart(canvasId, labels, data, beerName) {
                const ctx = document.getElementById(canvasId)?.getContext("2d");
                if (!ctx) return;
                const chartId = `chart_${canvasId}`;
                if (window.chartInstances[chartId]) window.chartInstances[chartId].destroy();
                window.chartInstances[chartId] = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: beerName,
                            data: data,
                            fill: true,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)',
                            pointBackgroundColor: 'rgb(255, 99, 132)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(255, 99, 132)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: { display: true },
                                suggestedMin: 0,
                                suggestedMax: 5,
                                ticks: { stepSize: 1 }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `${beerName} - Taste Profile`
                            },
                            legend: { display: false }
                        }
                    }
                });
            }
        
            function generateComparisonAttributeTrends(canvasId, responses, beerName, messageDivId) {
                const ctx = document.getElementById(canvasId)?.getContext("2d");
                const messageDiv = document.getElementById(messageDivId);
                if (!ctx) {
                    if (messageDiv) messageDiv.textContent = "Chart area not found.";
                    return;
                }
                // Group responses by date and calculate averages for each attribute
                const dateMap = {};
                responses.forEach(r => {
                    if (r.respondedAt && r.surveyAnswers) {
                        const date = r.respondedAt.toDate ? r.respondedAt.toDate() : new Date(r.respondedAt);
                        const dateStr = date.toLocaleDateString();
                        if (!dateMap[dateStr]) {
                            dateMap[dateStr] = { sums: Array(8).fill(0), counts: Array(8).fill(0) };
                        }
                        r.surveyAnswers.forEach(sa => {
                            if (sa.questionId >= 0 && sa.questionId < 8 && typeof sa.answer === 'number') {
                                dateMap[dateStr].sums[sa.questionId] += sa.answer;
                                dateMap[dateStr].counts[sa.questionId]++;
                            }
                        });
                    }
                });
                const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));
                if (sortedDates.length > 1) {
                    const datasets = [];
                    for (let i = 0; i < 8; i++) {
                        const data = sortedDates.map(dateStr => {
                            const sum = dateMap[dateStr].sums[i];
                            const count = dateMap[dateStr].counts[i];
                            return count > 0 ? sum / count : null;
                        });
                        datasets.push({
                            label: standardQuestionLabelArray[i],
                            data: data,
                            borderColor: TASTE_ATTRIBUTE_COLORS[i],
                            backgroundColor: TASTE_ATTRIBUTE_COLORS[i],
                            fill: false,
                            spanGaps: true
                        });
                    }
                    const chartId = `chart_${canvasId}`;
                    if (window.chartInstances[chartId]) window.chartInstances[chartId].destroy();
                    window.chartInstances[chartId] = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: sortedDates,
                            datasets: datasets
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: `${beerName} - Taste Attribute Trends`
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 5,
                                    ticks: { stepSize: 1 }
                                }
                            }
                        }
                    });
                    if (messageDiv) messageDiv.textContent = "";
                } else {
                    if (messageDiv) messageDiv.textContent = "Not enough data points for trend analysis.";
                }
            }
        
            function destroyComparisonCharts() {
                if (!window.chartInstances) return;
                Object.keys(window.chartInstances).forEach(key => {
                    if (key.startsWith("chart_compare-") || key.startsWith("chart_compare")) {
                        if (window.chartInstances[key] && typeof window.chartInstances[key].destroy === "function") {
                            window.chartInstances[key].destroy();
                        }
                        delete window.chartInstances[key];
                    }
                });
            }
        
        }); // <-- Close DOMContentLoaded event listener