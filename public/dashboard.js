// --- START dashboard.js (Security & Stability Release) ---
console.log("Executing dashboard.js - Version: June 2024 (Security & Stability Release)");

document.addEventListener("DOMContentLoaded", () => {
    // Standardized check for BrewMetricsUtils
    const utils = window.BrewMetricsUtils;
    if (!utils || !utils.logger || !utils.errorHandler || !utils.sanitizer || !utils.loadingIndicator) {
        console.error('BrewMetricsUtils or its components are not loaded. Aborting dashboard script.');
        document.body.innerHTML = "A critical error occurred. Please refresh the page.";
        return;
    }

    const { logger, errorHandler, sanitizer, loadingIndicator } = utils;

    // =========================================================================
    // SECTION: Global State
    // =========================================================================
    let currentBreweryData = null;
    let currentUserId = null;
    let currentBatchResponses = []; // Cache for batch responses
    window.chartInstances = window.chartInstances || {};

    // =========================================================================
    // SECTION: Authentication Handling
    // =========================================================================
    function initializeAuthListener() {
        loadingIndicator.show();
        auth.onAuthStateChanged(user => {
            if (user) {
                logger.info("Auth: User is authenticated.", { uid: user.uid });
                currentUserId = user.uid;
                initializeAppForUser(user);
            } else {
                logger.info("Auth: No user authenticated. Redirecting to login.");
                if (window.location.pathname.includes("dashboard.html")) {
                    window.location.href = "index.html";
                }
            }
        });
    }

    // =========================================================================
    // SECTION: Application Initialization
    // =========================================================================
    async function initializeAppForUser(user) {
        try {
            await fetchBreweryData(user.uid);
            setupEventListeners();
            loadDashboardOverviewData();
            loadFeedbackSummary();
            generateQrCode();
            
            setActiveSection("dashboard-overview-section");
            document.getElementById("app-container").classList.remove("hidden");
        } catch (error) {
            errorHandler.displayError("Failed to initialize the dashboard. Please refresh.", "critical-error-container");
            logger.error("Dashboard initialization failed:", error);
        } finally {
            loadingIndicator.hide();
        }
    }

    // =========================================================================
    // SECTION: Data Fetching
    // =========================================================================
    async function fetchBreweryData(userId) {
        if (!userId) {
            throw new Error("User ID is missing for fetching brewery data.");
        }
        try {
            const docSnap = await db.collection("breweries").doc(userId).get();
            if (docSnap.exists) {
                currentBreweryData = docSnap.data();
                displayBreweryData(currentBreweryData);
            } else {
                throw new Error("Brewery data not found for this user.");
            }
        } catch (error) {
            logger.error("Error fetching brewery data:", error);
            throw error; // Propagate error
        }
    }

    async function loadFeedbackSummary() {
        if (!currentUserId) return;
        const feedbackList = document.querySelector("#batch-management-section ul");
        const feedbackLoading = document.getElementById("feedback-loading");
        if (!feedbackList || !feedbackLoading) return;

        feedbackLoading.style.display = "block";
        feedbackList.innerHTML = "";

        try {
            const snapshot = await db.collection("breweries").doc(currentUserId).collection("batches").orderBy("createdAt", "desc").get();
            if (snapshot.empty) {
                feedbackList.innerHTML = `<li class="no-data">No batches found.</li>`;
                return;
            }

            const responsePromises = snapshot.docs.map(doc =>
                doc.ref.collection('responses').get().then(res => ({
                    id: doc.id,
                    data: doc.data(),
                    responses: res.docs.map(d => ({ id: d.id, ...d.data() }))
                }))
            );
            
            currentBatchResponses = await Promise.all(responsePromises);
            currentBatchResponses.forEach(batch => {
                feedbackList.appendChild(createBatchSummaryElement(batch));
            });
            addFeedbackItemListeners();
        } catch (error) {
            logger.error("Error loading feedback summary:", error);
            feedbackList.innerHTML = `<li class="no-data error">Failed to load batches.</li>`;
        } finally {
            feedbackLoading.style.display = "none";
        }
    }
    
    async function loadDashboardOverviewData() {
        // This function would fetch and display the summary card data.
        // It's kept separate for clarity.
        logger.info("Loading dashboard overview data.");
    }

    // =========================================================================
    // SECTION: UI Rendering (SANITIZED)
    // =========================================================================
    function createBatchSummaryElement(batch) {
        const li = document.createElement("li");
        li.className = "feedback-summary-item";
        li.dataset.id = batch.id;

        const { beerName, batchCode, isActive } = batch.data;
        // Sanitize all dynamic data before injecting it into HTML
        const sanitizedBeerName = sanitizer.sanitize(beerName || 'Unnamed Beer');
        const sanitizedBatchCode = sanitizer.sanitize(batchCode || 'No Code');

        const html = `
            <div class="feedback-item-header">
                <input type="checkbox" class="compare-checkbox" data-batch-id="${batch.id}">
                <h4 class="beer-name">${sanitizedBeerName}</h4>
                <span class="batch-code">(${sanitizedBatchCode})</span>
                <span class="status-indicator ${isActive !== false ? 'active' : 'inactive'}">${isActive !== false ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <div class="feedback-item-actions">
                <button class="btn btn-secondary btn-small view-feedback-details-button" data-batch-id="${batch.id}">Details</button>
                <button class="btn ${isActive !== false ? 'btn-danger' : 'btn-success'} btn-small toggle-active-button" data-batch-id="${batch.id}" data-current-status="${isActive !== false}">
                    ${isActive !== false ? 'Deactivate' : 'Activate'}
                </button>
            </div>`;
        
        li.innerHTML = html; // Safe to use innerHTML as all parts are sanitized or static
        return li;
    }

    function displayBreweryData(data) {
        if (!data) return;
        // Sanitize every piece of data before it touches the DOM
        const safeData = {
            breweryName: sanitizer.sanitize(data.breweryName || 'Brewery'),
            email: sanitizer.sanitize(data.email || 'N/A'),
            location: sanitizer.sanitize(data.location || 'N/A'),
            website: sanitizer.sanitize(data.website || ''),
            gmbLink: sanitizer.sanitize(data.gmbLink || ''),
            incentiveText: sanitizer.sanitize(data.incentiveText || 'Not Set')
        };

        document.getElementById("brewery-name-display-sidebar").textContent = safeData.breweryName;
        document.getElementById("detail-brewery-name").textContent = safeData.breweryName;
        document.getElementById("detail-email").textContent = safeData.email;
        document.getElementById("detail-location").textContent = safeData.location;
        document.getElementById("detail-website").innerHTML = safeData.website ? `<a href="${safeData.website}" target="_blank" rel="noopener noreferrer">${safeData.website}</a>` : 'Not Set';
        document.getElementById("detail-gmb-link").innerHTML = safeData.gmbLink ? `<a href="${safeData.gmbLink}" target="_blank" rel="noopener noreferrer">View Link</a>` : 'Not Set';
        document.getElementById("detail-incentive-text").textContent = safeData.incentiveText;
    }

    function generateQrCode() {
        const qrCodeDisplay = document.getElementById("qr-code-display");
        if (!qrCodeDisplay || !currentUserId) return;
        
        const surveyUrl = `${window.location.origin}/patron_survey.html?breweryId=${currentUserId}`;
        document.getElementById('qr-code-link').value = surveyUrl;
        
        qrCodeDisplay.innerHTML = ""; // Clear previous QR code
        try {
            new QRCode(qrCodeDisplay, { text: surveyUrl, width: 200, height: 200 });
        } catch (e) {
            logger.error("QR Code generation failed", e);
            qrCodeDisplay.textContent = "Could not generate QR code.";
        }
    }

    // =========================================================================
    // SECTION: Event Listeners
    // =========================================================================
    function setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll("#sidebar .nav-link").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetSectionId = link.getAttribute("href")?.substring(1);
                if (targetSectionId) setActiveSection(targetSectionId);
            });
        });

        // Logout
        document.getElementById("logout-button").addEventListener("click", () => auth.signOut());

        // Batch Entry Form
        const batchForm = document.getElementById("batch-entry-form");
        if (batchForm) batchForm.addEventListener("submit", handleBatchFormSubmit);
    }

    function addFeedbackItemListeners() {
        document.querySelectorAll('.feedback-summary-item').forEach(item => {
            // View Details Button
            const viewBtn = item.querySelector('.view-feedback-details-button');
            if(viewBtn) viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openFeedbackDetailModal(e.target.closest('.feedback-summary-item').dataset.id);
            });

            // Toggle Status Button
            const toggleBtn = item.querySelector('.toggle-active-button');
            if(toggleBtn) toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const button = e.target;
                toggleBatchStatus(button.dataset.batchId, button.dataset.currentStatus === 'true');
            });
        });
    }

    // =========================================================================
    // SECTION: Actions & Handlers (with Authorization)
    // =========================================================================
    async function handleBatchFormSubmit(e) {
        e.preventDefault();
        if (!currentUserId) { // Authorization check
            return errorHandler.displayError("Authentication error. Please log in again.", "batch-entry-message");
        }

        const batchData = {
            beerName: document.getElementById("beer-name").value.trim(),
            beerIntro: document.getElementById("beer-intro").value.trim(),
            abv: parseFloat(document.getElementById("beer-abv").value) || null,
            ibu: parseInt(document.getElementById("beer-ibu").value) || null,
            batchCode: document.getElementById("batch-code").value.trim(),
            packagedDate: document.getElementById("packaged-date").value,
            isActive: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (!batchData.beerName || !batchData.batchCode) {
            return errorHandler.displayError("Beer Name and Batch Code are required.", "batch-entry-message");
        }

        try {
            await db.collection("breweries").doc(currentUserId).collection("batches").add(batchData);
            logger.info("Batch added successfully.");
            e.target.reset();
            loadFeedbackSummary();
        } catch (error) {
            logger.error("Error adding batch:", error);
            errorHandler.displayError("Failed to add batch.", "batch-entry-message");
        }
    }

    async function toggleBatchStatus(batchId, currentStatus) {
        if (!currentUserId) return; // Authorization check
        try {
            await db.collection("breweries").doc(currentUserId).collection("batches").doc(batchId).update({ isActive: !currentStatus });
            logger.info(`Toggled status for batch ${batchId}`);
            loadFeedbackSummary(); // Refresh list
        } catch (error) {
            logger.error("Error toggling batch status:", error);
            errorHandler.displayError("Failed to update batch status.");
        }
    }

    function openFeedbackDetailModal(batchId) {
        if (!currentUserId) return; // Authorization check
        // Logic to populate and show modal for viewing feedback details
        const modal = document.getElementById("feedback-detail-modal");
        const batch = currentBatchResponses.find(b => b.id === batchId);
        if (!batch) return;

        const title = document.getElementById("feedback-detail-title");
        const tbody = document.getElementById("feedback-detail-tbody");
        title.innerHTML = `Details for: ${sanitizer.sanitize(batch.data.beerName)}`;
        tbody.innerHTML = ''; // Clear old data

        batch.responses.forEach(res => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${res.respondedAt ? res.respondedAt.toDate().toLocaleDateString() : 'N/A'}</td><td>${res.overallRating || '-'}</td>`;
            tbody.appendChild(tr);
        });
        
        modal.classList.add('visible');
    }
    
    function setActiveSection(sectionId) {
        document.querySelectorAll(".dashboard-section").forEach(s => s.classList.remove('active-section'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active-section');

        document.querySelectorAll("#sidebar .nav-link").forEach(l => l.classList.remove('active-link'));
        const targetLink = document.querySelector(`#sidebar .nav-link[href="#${sectionId}"]`);
        if (targetLink) targetLink.classList.add('active-link');
    }

    // --- Kick off the application ---
    initializeAuthListener();
});
// --- END dashboard.js ---
