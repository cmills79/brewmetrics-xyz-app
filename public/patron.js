// --- START OF FILE patron.js ---

// Wait for the DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("Patron script loaded and optimized.");

    // --- Get DOM Elements ---
    const breweryNameDisplay = document.getElementById('brewery-name');
    const beerListContainer = document.getElementById('beer-list-container');
    const errorMessageDiv = document.getElementById('error-message');
    const loadingBatchesDiv = document.getElementById('loading-batches');
    const mainContent = document.getElementById('main-content'); // Container for survey list

    // --- Get Brewery ID from URL ---
    const urlParams = new URLSearchParams(window.location.search);
    let breweryId = urlParams.get('breweryId');

    // --- Function to display error message ---
    function displayError(message) {
        console.error("Displaying Error:", message);
        if (loadingBatchesDiv) loadingBatchesDiv.style.display = 'none';
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }
        if (mainContent) mainContent.style.display = 'none'; // Hide main content on error
    }

    // --- Function to handle starting the survey ---
    function startSurvey(currentBreweryId, batchId) {
        console.log(`Redirecting to survey for Brewery: ${currentBreweryId}, Batch: ${batchId}`);
        window.location.href = `survey_questions?breweryId=${currentBreweryId}&batchId=${batchId}`;
    }

    // --- Validate and Trim Brewery ID ---
    if (!breweryId) {
        displayError("Error: No Brewery ID provided in the URL. Please scan the QR code again.");
        return;
    }
    breweryId = breweryId.trim();
    if (!breweryId) {
        displayError("Error: Brewery ID is invalid. Please scan the QR code again.");
        return;
    }

    // --- Check if db object is available ---
    if (typeof db === 'undefined' || !db) {
        displayError("Internal Error: Database connection not available. Please try again later.");
        return;
    }

    // --- OPTIMIZATION: Fetch brewery details and active batches in parallel ---
    console.log(`Optimized flow started for breweryId: ${breweryId}`);

    const breweryRef = db.collection('breweries').doc(breweryId);
    const activeBatchesRef = breweryRef.collection('batches')
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc');

    // Fire off all promises at once
    const breweryPromise = breweryRef.get({ source: 'server' });
    const batchesPromise = activeBatchesRef.get({ source: 'server' });
    const photosPromise = loadBatchPhotos(breweryId); // Start loading photos in parallel

    Promise.all([breweryPromise, batchesPromise])
        .then(([breweryDoc, batchesSnapshot]) => {

            // 1. Validate Brewery
            if (!breweryDoc.exists) {
                displayError(`Error: Brewery with ID ${breweryId} not found. Please check the QR code.`);
                return;
            }
            const breweryData = breweryDoc.data();
            console.log("Brewery data fetched successfully:", breweryData);

            // 2. Check number of active batches
            console.log(`Found ${batchesSnapshot.size} active batches.`);

            // --- OPTIMIZATION: "Single-Survey Skip" ---
            if (batchesSnapshot.size === 1) {
                const singleBatch = batchesSnapshot.docs[0];
                const batchId = singleBatch.id;
                console.log(`Single active batch found (ID: ${batchId}). Skipping list and redirecting.`);
                // Hide loading message before redirecting
                if (loadingBatchesDiv) loadingBatchesDiv.textContent = `Redirecting you to the survey for ${singleBatch.data().beerName}...`;
                startSurvey(breweryId, batchId);
                return; // Stop further processing
            }

            // --- Multi-survey (or zero-survey) flow ---
            if (loadingBatchesDiv) loadingBatchesDiv.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block'; // Show the main view

            // Display brewery name
            if (breweryNameDisplay) {
                breweryNameDisplay.textContent = breweryData.breweryName || 'this Brewery';
            }

            if (batchesSnapshot.empty) {
                displayError("No active beer surveys found for this brewery at the moment. Please check back later.");
                if (beerListContainer) beerListContainer.innerHTML = '';
                return;
            }

            // Display list of beers
            if (beerListContainer) beerListContainer.innerHTML = '';
            batchesSnapshot.forEach((doc) => {
                const batch = doc.data();
                const batchId = doc.id;
                const beerDiv = document.createElement('div');
                beerDiv.classList.add('beer-item');
                beerDiv.setAttribute('data-batch-id', batchId);

                const beerName = document.createElement('h3');
                beerName.textContent = batch.beerName || 'Unnamed Beer';
                const beerIntro = document.createElement('p');
                beerIntro.textContent = batch.beerIntro || 'No description provided.';

                beerDiv.appendChild(beerName);
                beerDiv.appendChild(beerIntro);
                beerDiv.addEventListener('click', () => startSurvey(breweryId, batchId));
                if (beerListContainer) beerListContainer.appendChild(beerDiv);
            });
        })
        .catch(error => {
            console.error("Error during parallel data fetch:", error);
            displayError(`An error occurred while loading brewery information: ${error.message}. Please try again.`);
        });

    // --- Function to load and display batch photos (runs in parallel) ---
    async function loadBatchPhotos(currentBreweryId) {
        try {
            const configDoc = await db.collection('breweries').doc(currentBreweryId)
                .collection('configuration').doc('equipment').get({ source: 'server' });
            
            if (configDoc.exists) {
                const photos = configDoc.data().batchPhotos || [];
                if (photos.length > 0) {
                    displayBatchPhotos(photos);
                }
            }
        } catch (error) {
            console.warn('Could not load batch photos:', error); // Use warn as it's non-critical
        }
    }

    // --- Function to display batch photos ---
    function displayBatchPhotos(photos) {
        const photosContainer = document.getElementById('batch-photos');
        if (!photosContainer || photos.length === 0) return;
        
        photosContainer.innerHTML = '';
        photos.slice(0, 3).forEach(photo => {
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

}); // End of DOMContentLoaded
// --- END OF FILE patron.js ---
