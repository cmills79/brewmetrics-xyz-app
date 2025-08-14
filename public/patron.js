// --- START OF FILE patron.js ---

// Wait for the DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("Patron script loaded.");

    // --- Get DOM Elements ---
    const breweryNameDisplay = document.getElementById('brewery-name');
    const beerListContainer = document.getElementById('beer-list-container');
    const errorMessageDiv = document.getElementById('error-message');
    const loadingBatchesDiv = document.getElementById('loading-batches');
    console.log("Raw window.location.search:", window.location.search);

    // --- Get Brewery ID from URL ---
    const urlParams = new URLSearchParams(window.location.search);
    let breweryId = urlParams.get('breweryId'); // Use let to allow modification
    console.log("Brewery ID extracted by script (raw):", breweryId);

    // --- Function to display error message ---
    function displayError(message) {
        console.error("Displaying Error:", message);
        if (errorMessageDiv) {
             errorMessageDiv.textContent = message;
             errorMessageDiv.style.display = 'block'; // Make sure it's visible
        }
        if (loadingBatchesDiv) loadingBatchesDiv.style.display = 'none';
        if (beerListContainer) beerListContainer.innerHTML = '';
    }

    // --- Validate and Trim Brewery ID ---
    if (!breweryId) {
        displayError("Error: No Brewery ID provided in the URL. Please scan the QR code again.");
        return; // Stop execution if no ID
    } else {
        // +++ ADD LENGTH/DELIMITER/TRIM LOGGING +++
        console.log(`[DEBUG] Extracted breweryId before trim: |${breweryId}|`);
        console.log(`[DEBUG] Length before trim: ${breweryId.length}`);
        breweryId = breweryId.trim(); // Explicitly trim whitespace
        console.log(`[DEBUG] Extracted breweryId after trim: |${breweryId}|`);
        console.log(`[DEBUG] Length after trim: ${breweryId.length}`);
        // Re-validate after trim in case it became empty
        if (!breweryId) {
             displayError("Error: Brewery ID became empty after trimming. Invalid QR code?");
             return;
        }
        // +++ END LOGGING +++
    }

    // --- Check if db object is available ---
    // Note: 'db' should be globally defined from the inline script in patron_survey HTML
    if (typeof db === 'undefined' || !db) {
         console.error("!!! CRITICAL: 'db' object is not defined or unavailable when needed! Check initialization script in HTML. !!!");
         displayError("Internal Error: Database connection not available.");
         return; // Stop execution
    } else {
        console.log("Confirmed 'db' object is defined before query.");
    }

    // --- Fetch Brewery Name ---
    // Use the potentially trimmed breweryId
    const breweryRef = db.collection('breweries').doc(breweryId);

    // +++ DETAILED LOGGING from previous step +++
    console.log(`[DEBUG] Attempting Firestore get: db.collection('breweries').doc('${breweryId}')`);
    console.log("[DEBUG] Using Firestore instance:", db);
    try {
        if (db && db.app && db.app.options) {
            console.log(`--- [DEBUG] Firestore Project ID used by JS: ${db.app.options.projectId} ---`);
            if (db.app.options.projectId !== 'brewmetrics-xyz-web') { // Verify this is your correct project ID
                console.error("!!!! PROJECT ID MISMATCH DETECTED IN JS !!!!");
                displayError("Configuration Error: Application connected to wrong project.");
                return;
            }
        } else {
            console.error("[DEBUG] The 'db' object or its properties are invalid!");
            displayError("Internal application error: Database connection invalid.");
            return;
        }
    } catch (e) {
         console.error("[DEBUG] Error accessing db.app.options:", e);
         displayError("Internal application error checking config.");
         return;
    }
    // +++ END DETAILED LOGGING +++

    // +++ MODIFIED .get() call to force server read +++
    breweryRef.get({ source: 'server' })
        .then(doc => {
            // +++ LOGGING INSIDE .then() +++
            console.log("[DEBUG] Firestore document snapshot received (source: server):", doc);
            console.log(`--- [DEBUG] Snapshot exists? ${doc.exists} ---`);
            // +++ END LOGGING +++

            if (doc.exists) {
                const breweryData = doc.data();
                 console.log("[DEBUG] Success: Brewery data found:", breweryData);
                if (breweryNameDisplay) {
                    breweryNameDisplay.textContent = breweryData.breweryName || 'this Brewery';
                }
                 if (errorMessageDiv) errorMessageDiv.style.display = 'none'; // Hide error on success
                loadBatchPhotos(breweryId); // Load batch photos
                fetchAndDisplayBatches(breweryId); // Use the trimmed breweryId
            } else {
                displayError(`Error: Brewery with ID ${breweryId} not found via script (source: server), though it might exist. Please check configuration or QR code.`);
                 console.log("[DEBUG] doc.exists returned false (source: server).");
            }
        })
        .catch(error => {
            console.error("Error during breweryRef.get({ source: 'server' }):", error);
            displayError(`Error loading brewery information (source: server): ${error.message}. Please try again later.`);
        });


    // --- Function to Fetch and Display Batches ---
    function fetchAndDisplayBatches(currentBreweryId) { // Use parameter name to avoid confusion
         console.log(`Fetching batches for brewery ${currentBreweryId}...`);
        db.collection('breweries').doc(currentBreweryId).collection('batches')
            .where('isActive', '==', true)
            .orderBy('createdAt', 'desc')
            .get({ source: 'server' }) // Force server read here too
            .then((querySnapshot) => {
                if (loadingBatchesDiv) loadingBatchesDiv.style.display = 'none';
                if (querySnapshot.empty) {
                    console.log("No active batches found.");
                    displayError("No active beer surveys found for this brewery at the moment. Please check back later.");
                    return;
                }
                console.log(`Found ${querySnapshot.size} active batches.`);
                if (beerListContainer) beerListContainer.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    const batch = doc.data();
                    const batchId = doc.id;
                    console.log(`Batch ID: ${batchId}`, batch);
                    const beerDiv = document.createElement('div');
                    beerDiv.classList.add('beer-item');
                    beerDiv.setAttribute('data-batch-id', batchId);
                    const beerName = document.createElement('h3');
                    beerName.textContent = batch.beerName || 'Unnamed Beer';
                    const beerIntro = document.createElement('p');
                    beerIntro.textContent = batch.beerIntro || 'No description provided.';
                    beerDiv.appendChild(beerName);
                    beerDiv.appendChild(beerIntro);
                    beerDiv.addEventListener('click', () => {
                        // Use the validated & trimmed ID when starting survey
                        startSurvey(currentBreweryId, batchId);
                    });
                    if (beerListContainer) beerListContainer.appendChild(beerDiv);
                });
            })
            .catch((error) => {
                console.error("Error getting active batches (source: server): ", error);
                displayError("An error occurred while fetching the list of beers. Please try again.");
            });
    }

    // --- Function to load and display batch photos ---
    async function loadBatchPhotos(currentBreweryId) {
        try {
            // Get brewery configuration with photos
            const configDoc = await db.collection('breweries').doc(currentBreweryId)
                .collection('configuration').doc('equipment').get();
            
            if (configDoc.exists) {
                const config = configDoc.data();
                const photos = config.batchPhotos || [];
                
                if (photos.length > 0) {
                    displayBatchPhotos(photos);
                }
            }
        } catch (error) {
            console.error('Error loading batch photos:', error);
            // Don't show error to user - photos are optional
        }
    }

    // --- Function to display batch photos ---
    function displayBatchPhotos(photos) {
        const photosContainer = document.getElementById('batch-photos');
        if (!photosContainer || photos.length === 0) return;
        
        photosContainer.innerHTML = '';
        
        // Create photo gallery
        photos.slice(0, 3).forEach(photo => { // Limit to 3 photos
            const img = document.createElement('img');
            img.src = photo.url;
            img.alt = photo.name || 'Batch photo';
            img.style.cssText = `
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
                margin: 0 5px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            photosContainer.appendChild(img);
        });
        
        photosContainer.style.display = 'block';
    }

    // --- Function to handle starting the survey ---
    function startSurvey(currentBreweryId, batchId) { // Use parameter name
        console.log(`Starting survey for Brewery: ${currentBreweryId}, Batch: ${batchId}`);
        window.location.href = `survey_questions?breweryId=${currentBreweryId}&batchId=${batchId}`;
    }

}); // End of DOMContentLoaded
// --- END OF FILE patron.js ---