// --- START OF FILE survey.js ---

// --- UPDATED Question Definitions with Explanations ---
const surveyQuestions = [
    {
        id: 1,
        text: "Sweetness: How prominent is the initial sweetness (from malt, sugars, etc.)?",
        ratings: [ { value: 1, caption: "Not Sweet / Very Dry" }, { value: 2, caption: "Slightly Sweet / Off-Dry" }, { value: 3, caption: "Moderately Sweet" }, { value: 4, caption: "Quite Sweet" }, { value: 5, caption: "Very Sweet / Cloying" } ],
        tooltip: "Tip: Focus on the initial impression on your tongue. Does it taste sugary like candy, bready, or more dry and crisp? Consider if sweetness lingers.",
        explanation: "Why Sweetness Matters: Sweetness primarily comes from residual sugars left after fermentation. It balances bitterness and acidity, contributing to the overall body and flavor profile. Too much or too little can throw a beer out of style."
    },
    {
        id: 2,
        text: "Acidity/Tartness: How noticeable is a tart, acidic, or sour sensation?",
        ratings: [ { value: 1, caption: "None / Smooth" }, { value: 2, caption: "Slight Tartness / Hint of Sour" }, { value: 3, caption: "Noticeable Tartness / Moderately Sour" }, { value: 4, caption: "Quite Tart / Sour" }, { value: 5, caption: "Very Tart / Pucker Factor" } ],
        tooltip: "Tip: Think about lemons, vinegar, or sour candies. Does the beer make the sides of your tongue tingle or your mouth water excessively? Common in sours, goses, some fruit beers.",
        explanation: "Why Acidity/Tartness Matters: Acidity adds brightness and cuts through richness. In styles like Sours or Goses, it's a defining feature, often derived from specific yeasts or bacteria. Unintended acidity can indicate spoilage."
    },
    {
        id: 3,
        text: "Bitterness (Hops): How strong is the bitterness, often perceived at the back of the tongue?",
        ratings: [ { value: 1, caption: "Very Low / None" }, { value: 2, caption: "Slight Bitterness" }, { value: 3, caption: "Moderate Bitterness / Balanced" }, { value: 4, caption: "Quite Bitter / Hop-Forward" }, { value: 5, caption: "Very Bitter / Intense" } ],
        tooltip: "Tip: Focus on the finish after swallowing. Does a sharp, sometimes drying sensation linger? Distinct from sourness. Common in IPAs, Pale Ales.",
        explanation: "Why Bitterness Matters: Primarily from hops, bitterness balances malt sweetness and provides structure. The *intensity* and *quality* of bitterness are crucial, especially in styles like IPAs. It shouldn't be harsh or unpleasant."
    },
    {
        id: 4,
        text: "Body/Mouthfeel (Weight): How heavy or light does the beer feel in your mouth?",
        ratings: [ { value: 1, caption: "Very Light / Watery" }, { value: 2, caption: "Light Bodied" }, { value: 3, caption: "Medium Bodied" }, { value: 4, caption: "Full Bodied / Heavy" }, { value: 5, caption: "Very Heavy / Chewy" } ],
        tooltip: "Tip: Compare the feeling to liquids like water, milk, or cream. Does it feel thin or thick? Swirl it around. Stouts often have heavy body, Pilsners are lighter.",
        explanation: "Why Body/Mouthfeel Matters: This refers to the perceived weight and texture (e.g., smooth, creamy, thin). It's influenced by proteins, residual sugars, and carbonation. The right body enhances the drinking experience and should match the beer style."
    },
    {
        id: 5,
        text: "Carbonation (Bubbles): How much bubbly or fizzy sensation do you perceive?",
        ratings: [ { value: 1, caption: "Flat / Still" }, { value: 2, caption: "Low / Gentle Bubbles" }, { value: 3, caption: "Medium / Noticeable Fizz" }, { value: 4, caption: "High / Prickly Sensation" }, { value: 5, caption: "Very High / Gassy / Effervescent" } ],
        tooltip: "Tip: Pay attention to the 'bite' or 'prickle' on your tongue. Does it feel smooth or sharp and bubbly? Compare to soda water or champagne.",
        explanation: "Why Carbonation Matters: Carbonation (CO2 dissolved in the beer) affects mouthfeel (tingle, fullness) and aroma release. Different styles target different carbonation levels, from the gentle bubbles in a cask ale to the high effervescence of a Belgian Tripel."
    },
    {
        id: 6,
        text: "Malt Flavors: Besides sweetness, how prominent are flavors like bread, caramel, toast, nuts, or chocolate?",
        ratings: [ { value: 1, caption: "None / Very Subtle" }, { value: 2, caption: "Slight Malty Notes" }, { value: 3, caption: "Noticeable Malt Character" }, { value: 4, caption: "Rich Malt Flavors" }, { value: 5, caption: "Very Strong / Complex Malt" } ],
        tooltip: "Tip: Think beyond just sweetness. Does it taste like bread crust, crackers, toffee, coffee, or dark chocolate? More common in darker beers, lagers, less hoppy styles.",
        explanation: "Why Malt Flavors Matter: Malt provides the backbone of beer flavor – sugars for fermentation, plus complex notes like bread, biscuit, caramel, roast, or chocolate, depending on the type and kilning process. It's the soul of many beer styles."
    },
    {
        id: 7,
        text: "Hop Flavors: Besides bitterness, how prominent are flavors like citrus, pine, tropical fruit, floral, or grassy notes?",
        ratings: [ { value: 1, caption: "None / Very Subtle" }, { value: 2, caption: "Slight Hop Notes" }, { value: 3, caption: "Noticeable Hop Character" }, { value: 4, caption: "Rich Hop Flavors" }, { value: 5, caption: "Very Strong / Complex Hops" } ],
        tooltip: "Tip: Separate this from bitterness. What other flavors come through? Grapefruit, orange, mango, flowers, fresh cut grass, pine needles? Common in IPAs, Pales Ales, Hazy styles.",
        explanation: "Why Hop Flavors & Aroma Matter: Hops contribute not just bitterness but also a vast array of aromas and flavors (citrus, pine, fruity, floral, earthy, spicy). These are especially prominent in styles like Pale Ales and IPAs, defining their character."
    },
    {
        id: 8,
        text: "Finish/Aftertaste: How clean or lingering is the taste after you swallow?",
        ratings: [ { value: 1, caption: "Very Clean / Disappears Quickly" }, { value: 2, caption: "Clean / Short Aftertaste" }, { value: 3, caption: "Moderate Length Aftertaste" }, { value: 4, caption: "Lingering Aftertaste" }, { value: 5, caption: "Very Long / Coats Mouth" } ],
        tooltip: "Tip: Focus on what flavors (sweet, bitter, malt, hop) remain after swallowing and for how long. Is it crisp and refreshing, or do flavors stick around?",
        explanation: "Why Finish/Aftertaste Matters: The finish is the final impression. Is it crisp and quick (like a Pilsner), or do flavors linger (like a rich Stout)? The quality of the aftertaste (pleasant vs. harsh) is a key indicator of a well-made beer."
    }
];

// --- Global variable to store potentially fetched custom questions ---
let fetchedQuestions = []; // Start with an empty array

console.log("Default survey questions defined.");

// --- VIDEO CONFIGURATION ---
const SKIP_VIDEOS = false; // Ensure this is false to play videos
const VIDEO_BASE_PATH = './videos/'; // Correct if patron_survey.html is in public/
const VIDEO_EXTENSION = '.mp4';

// --- UPDATED CODE FOR SURVEY LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Survey page script loaded. SKIP_VIDEOS:", SKIP_VIDEOS, "VIDEO_BASE_PATH:", VIDEO_BASE_PATH);
    
    // --- State Variables (moved up before first use) ---
    let currentQuestionIndex = 0;
    let surveyAnswers = [];
    let breweryId = null;
    let batchId = null;
    let currentSelectedRating = null;
    let breweryGmbLink = null;
    let combinedQuestions = [...surveyQuestions];
    let overallRating = null;
    
    // --- Get DOM Elements ---
    const beerNameIntroDisplay = document.getElementById('beer-name-intro');
    const questionNumberDisplay = document.getElementById('question-number');
    const questionTextDisplay = document.getElementById('question-text');
    const ratingsContainer = document.getElementById('ratings-container');
    const tooltipDisplay = document.getElementById('tooltip-text');
    const nextButton = document.getElementById('next-button');
    const finishButton = document.getElementById('finish-button'); // This should now find the button in survey_questions.html
    const errorMessageDiv = document.getElementById('error-message-survey');
    const loadingSurveyDiv = document.getElementById('loading-survey');
    const questionAreaDiv = document.getElementById('question-area');
    const navigationAreaDiv = document.getElementById('navigation-area');
    const overallRatingAreaDiv = document.getElementById('overall-rating-area');
    const overallRatingsContainer = document.getElementById('overall-ratings-container');
    const finalStepAreaDiv = document.getElementById('final-step-area');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationTitle = document.getElementById('explanation-title');
    const explanationText = document.getElementById('explanation-text');
    const continueButton = document.getElementById('continue-button');
    const videoContainer = document.getElementById('video-container');
    const surveyVideo = document.getElementById('survey-video');
    const videoLoading = document.getElementById('video-loading');



    // --- Function to display error message ---
    function displaySurveyError(message) {
        console.error("Displaying Survey Error:", message);
        if (errorMessageDiv) {
             errorMessageDiv.textContent = message;
             errorMessageDiv.classList.remove('hidden');
        }
        if (loadingSurveyDiv) loadingSurveyDiv.style.display = 'none';
        if (questionAreaDiv) questionAreaDiv.classList.add('hidden');
        if (navigationAreaDiv) navigationAreaDiv.classList.add('hidden');
        if (beerNameIntroDisplay) beerNameIntroDisplay.classList.add('hidden');
        if (overallRatingAreaDiv) overallRatingAreaDiv.classList.add('hidden');
        if (finalStepAreaDiv) finalStepAreaDiv.classList.add('hidden');
        if (explanationContainer) explanationContainer.classList.add('hidden');
        if (videoContainer) videoContainer.classList.add('hidden');
    }

    // --- Get Brewery and Batch ID from URL ---
     try {
        const urlParams = new URLSearchParams(window.location.search);
        breweryId = urlParams.get('breweryId');
        batchId = urlParams.get('batchId');
        console.log("Survey Script - Brewery ID:", breweryId);
        console.log("Survey Script - Batch ID:", batchId);
        if (!breweryId || !batchId) {
            throw new Error("Missing Brewery ID or Batch ID in URL.");
        }
        
        // Initialize enhanced data capture after getting IDs
        if (window.enhancedSurveyCapture) {
            window.enhancedSurveyCapture.trackInteraction('survey_start', {
                breweryId: breweryId,
                batchId: batchId
            });
        }
    } catch (error) {
        displaySurveyError("Error: Could not retrieve brewery or beer information from the URL. Please go back and select the beer again.");
        return;
    }

    // --- Fetch Batch Details AND Brewery GMB Link ---
    if (typeof db === 'undefined' || !db) {
        displaySurveyError("Error: Database connection not established. Please refresh the page or check Firebase setup.");
        return;
    }
    console.log(`Fetching details for batch ${batchId}, custom questions, and GMB link for brewery ${breweryId}...`);
    const breweryDocRef = db.collection('breweries').doc(breweryId);
    const batchDocRef = breweryDocRef.collection('batches').doc(batchId);
    Promise.all([breweryDocRef.get(), batchDocRef.get()])
        .then(([breweryDoc, batchDoc]) => {
            let batchData;
            if (batchDoc.exists) {
                batchData = batchDoc.data();
                console.log("Batch data fetched:", batchData);
                if (beerNameIntroDisplay) {
                    const beerName = batchData.beerName || 'This Beer';
                    const beerIntro = batchData.beerIntro || 'No introduction provided.';
                    beerNameIntroDisplay.innerHTML = `<h2>${beerName}</h2><p>${beerIntro}</p>`;
                    beerNameIntroDisplay.classList.remove('hidden');
                }
                if (batchData.customQuestions && Array.isArray(batchData.customQuestions)) {
                     fetchedQuestions = batchData.customQuestions.map((questionText, index) => ({
                         id: surveyQuestions.length + 1 + index,
                         text: questionText || `Custom Question ${index + 1}`,
                         ratings: [ { value: 1, caption: "Very Low / Not Present" }, { value: 2, caption: "Slightly Noticeable" }, { value: 3, caption: "Moderately Noticeable" }, { value: 4, caption: "Quite Strong" }, { value: 5, caption: "Very Strong / Dominant" } ],
                         tooltip: "Rate the intensity or presence of this characteristic.",
                         explanation: "This is a custom characteristic defined by the brewery for this specific beer."
                     }));
                     combinedQuestions = [...surveyQuestions, ...fetchedQuestions];
                     console.log(`Total questions (default + custom): ${combinedQuestions.length}`);
                     console.log('Custom questions:', fetchedQuestions);
                } else {
                    combinedQuestions = [...surveyQuestions];
                }
            } else {
                throw new Error(`Beer batch with ID ${batchId} not found.`);
            }
            if (breweryDoc.exists) {
                const breweryData = breweryDoc.data();
                breweryGmbLink = breweryData.gmbLink;
                console.log("Brewery GMB Link fetched:", breweryGmbLink);
                if (!breweryGmbLink) {
                    console.warn("Brewery GMB Link is missing in Firestore for brewery:", breweryId);
                }
            } else {
                 console.error(`Brewery with ID ${breweryId} not found. GMB link will be unavailable.`);
            }

            if (loadingSurveyDiv) loadingSurveyDiv.style.display = 'none';
            
            currentQuestionIndex = 0; // Ensure we start at Q0 before any videos or explanations
            if (SKIP_VIDEOS) {
                console.log("Videos disabled, starting with explanation for Q0");
                showExplanation();
            } else {
                console.log("Starting survey with general intro video (survey-0.mp4).");
                playVideo(0); // Play survey-0.mp4 (general intro)
            }
        })
        .catch((error) => {
            console.error("Error fetching initial data:", error);
            displaySurveyError(`Error loading survey details: ${error.message}. Please try again later.`);
        });

    // --- Function to play video ---
    function playVideo(videoNumericIndex) {
        console.log(`Attempting to play video: survey-${videoNumericIndex}.mp4. Current Q Index: ${currentQuestionIndex}. SKIP_VIDEOS: ${SKIP_VIDEOS}`);
        
        if (SKIP_VIDEOS) {
            console.log("Videos are disabled by SKIP_VIDEOS flag. Calling onVideoComplete to proceed.");
            onVideoComplete(videoNumericIndex); // Simulate video completion
            return;
        }
        
        if (videoContainer && surveyVideo) {
            videoContainer.classList.remove('hidden');
            if (beerNameIntroDisplay) beerNameIntroDisplay.classList.remove('hidden'); // Keep beer intro visible with video
            // Hide other survey UI elements during video playback
            if (questionAreaDiv) questionAreaDiv.classList.add('hidden');
            if (navigationAreaDiv) navigationAreaDiv.classList.add('hidden');
            if (explanationContainer) explanationContainer.classList.add('hidden');
            if (overallRatingAreaDiv) overallRatingAreaDiv.classList.add('hidden');
            if (finalStepAreaDiv) finalStepAreaDiv.classList.add('hidden');
            
            if (videoLoading) videoLoading.style.display = 'block'; // Show loading indicator
            
            const videoPath = `${VIDEO_BASE_PATH}survey-${videoNumericIndex}${VIDEO_EXTENSION}`;
            console.log(`Loading video from: ${videoPath}`);
            surveyVideo.src = videoPath;
            surveyVideo.load(); // Important to load the new source
            
            surveyVideo.oncanplay = () => {
                console.log(`Video survey-${videoNumericIndex}.mp4 can play.`);
                if (videoLoading) videoLoading.style.display = 'none'; // Hide loading indicator
                surveyVideo.play().catch(err => {
                    console.error(`Autoplay failed for survey-${videoNumericIndex}.mp4:`, err);
                    // Attempt to mute and play, or show a play button if still fails
                    onVideoComplete(videoNumericIndex); // Proceed if autoplay fails, as per current logic
                });
            };
            surveyVideo.onended = () => {
                console.log(`Video survey-${videoNumericIndex}.mp4 ended.`);
                onVideoComplete(videoNumericIndex);
            };
            surveyVideo.onerror = (e) => {
                console.error(`Error loading video survey-${videoNumericIndex}.mp4:`, e);
                console.log(`Video path attempted: ${videoPath}. Base URL: ${document.baseURI}videos/`);
                if (videoLoading) videoLoading.style.display = 'none';
                onVideoComplete(videoNumericIndex); // Skip video and continue
            };
        } else {
            console.error("Video player DOM elements (videoContainer or surveyVideo) NOT FOUND. Calling onVideoComplete.");
            onVideoComplete(videoNumericIndex); // Proceed as if video played/skipped
        }
    }

    // --- *** MODIFIED Function called when video completes or fails *** ---
    function onVideoComplete(completedVideoNumericIndex) {
        console.log(`Video survey-${completedVideoNumericIndex}.mp4 complete. Current question index before any changes in this function: ${currentQuestionIndex}`);
        
        if (videoContainer) videoContainer.classList.add('hidden');
        
        const N = combinedQuestions.length;

        if (completedVideoNumericIndex === 0) { // General intro video (survey-0.mp4) just finished
            if (N > 0) { 
                 console.log(`Intro video (survey-${completedVideoNumericIndex}.mp4) done. Playing video for Q${currentQuestionIndex} (which is survey-${currentQuestionIndex + 1}.mp4).`);
                 playVideo(currentQuestionIndex + 1); 
            } else { 
                console.log(`Intro video (survey-${completedVideoNumericIndex}.mp4) done. No questions. Playing video for overall rating.`);
                if (SKIP_VIDEOS) { showOverallRating(); } else { playVideo(N + 1); } 
            }
        } else if (completedVideoNumericIndex >= 1 && completedVideoNumericIndex <= N) { // Video for a question (e.g., survey-1.mp4 for Q0) just finished
            console.log(`Video survey-${completedVideoNumericIndex}.mp4 (which was for Q${currentQuestionIndex}) done. Showing explanation for Q${currentQuestionIndex}.`);
            showExplanation(); 
        } else if (completedVideoNumericIndex === N + 1) { // Video before overall rating (survey-(N+1).mp4) just finished
            console.log(`Video survey-${completedVideoNumericIndex}.mp4 (before overall rating) done. Showing overall rating.`);
            showOverallRating();
        } else if (completedVideoNumericIndex === N + 2) { // Video before final step (survey-(N+2).mp4) just finished
            console.log(`Video survey-${completedVideoNumericIndex}.mp4 (before final step) done. Showing final step.`);
            showFinalStep();
        } else {
            console.warn("onVideoComplete called with unexpected videoIndex:", completedVideoNumericIndex, "currentQuestionIndex:", currentQuestionIndex);
            if (currentQuestionIndex < N) { showExplanation(); } else { showOverallRating(); }
        }
    }

    // --- Function to Show Explanation ---
    function showExplanation() {
        console.log(`Showing explanation for question ${currentQuestionIndex + 1} (index ${currentQuestionIndex})`);
        if (explanationContainer && explanationText && continueButton) {
            if (beerNameIntroDisplay) beerNameIntroDisplay.classList.remove('hidden'); // Keep beer intro visible
            if (questionAreaDiv) questionAreaDiv.classList.add('hidden');
            if (navigationAreaDiv) navigationAreaDiv.classList.add('hidden');
            if (overallRatingAreaDiv) overallRatingAreaDiv.classList.add('hidden');
            if (finalStepAreaDiv) finalStepAreaDiv.classList.add('hidden');
            explanationContainer.classList.remove('hidden');
            if (currentQuestionIndex < combinedQuestions.length) {
                const currentQuestion = combinedQuestions[currentQuestionIndex];
                if (explanationTitle) {
                    explanationTitle.textContent = `Understanding: ${currentQuestion.text.substring(0, currentQuestion.text.indexOf(':') > 0 ? currentQuestion.text.indexOf(':') : currentQuestion.text.length)}...`;
                }
                explanationText.textContent = currentQuestion.explanation;
            } else {
                explanationText.textContent = "All questions explained. Proceeding...";
                 console.warn("showExplanation called when currentQuestionIndex might be out of bounds:", currentQuestionIndex);
                if (SKIP_VIDEOS) { showOverallRating(); } else { playVideo(combinedQuestions.length + 1); }
            }
        } else {
            console.warn("Explanation elements not found. Displaying question directly for Q" + currentQuestionIndex);
            displayQuestion();
        }
    }

    // --- Function to Display Question ---
    function displayQuestion() {
        console.log(`Displaying question ${currentQuestionIndex + 1} (index ${currentQuestionIndex}) of ${combinedQuestions.length}`);
        
        if (currentQuestionIndex >= combinedQuestions.length) {
            console.log("Attempt to display question when all questions are done. Transitioning to overall rating.");
            if (SKIP_VIDEOS) { showOverallRating(); } else { playVideo(combinedQuestions.length + 1); }
            return;
        }

        const currentQuestion = combinedQuestions[currentQuestionIndex];
        if (beerNameIntroDisplay) beerNameIntroDisplay.classList.remove('hidden'); // Keep beer intro visible
        if (explanationContainer) explanationContainer.classList.add('hidden');
        if (overallRatingAreaDiv) overallRatingAreaDiv.classList.add('hidden');
        if (finalStepAreaDiv) finalStepAreaDiv.classList.add('hidden');
        
        if (questionAreaDiv) questionAreaDiv.classList.remove('hidden');
        if (navigationAreaDiv) navigationAreaDiv.classList.remove('hidden'); // Show nav for next button
        
        if (questionNumberDisplay) questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${combinedQuestions.length}`;
        if (questionTextDisplay) questionTextDisplay.textContent = currentQuestion.text;
        
        if (ratingsContainer) {
            ratingsContainer.innerHTML = '';
            currentQuestion.ratings.forEach(rating => {
                const button = document.createElement('button');
                button.classList.add('rating-button');
                button.dataset.value = rating.value;
                button.innerHTML = `<strong>${rating.value}</strong><br>${rating.caption}`;
                button.addEventListener('click', selectRating);
                ratingsContainer.appendChild(button);
            });
        }
        if (tooltipDisplay && currentQuestion.tooltip) { // Check if tooltipDisplay and tooltip text exist
            const tooltipTextElement = tooltipDisplay.querySelector('span#tooltip-text') || tooltipDisplay; // Handle if span is not found
            tooltipTextElement.textContent = currentQuestion.tooltip;
            tooltipDisplay.classList.remove('hidden'); // Show tooltip area if there's a tip
        } else if (tooltipDisplay) {
            tooltipDisplay.classList.add('hidden'); // Hide tooltip area if no tip
        }

        currentSelectedRating = null;
        if (nextButton) {
            nextButton.disabled = true;
            // nextButton.style.display = 'inline-block'; // Use classList instead
            nextButton.classList.remove('hidden');
        }
        if (finishButton) {
            // finishButton.style.display = 'none'; // Use classList instead
            finishButton.classList.add('hidden');
        }
    }

    // --- Function to Handle Rating Selection (for individual questions) ---
    function selectRating(event) {
        const allButtons = ratingsContainer.querySelectorAll('.rating-button');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        let selectedButton = event.target.closest('.rating-button');
        selectedButton.classList.add('selected');
        currentSelectedRating = parseInt(selectedButton.dataset.value);
        if (nextButton) nextButton.disabled = false;
    }

    // --- *** MODIFIED Function to go to next question *** ---
    function goToNextQuestion() {
        if (currentSelectedRating === null) {
            alert("Please select a rating before continuing.");
            return;
        }
        const previousQuestion = combinedQuestions[currentQuestionIndex];
        surveyAnswers.push({
            questionId: currentQuestionIndex, // Use index for proper ordering
            questionText: previousQuestion.text,
            answer: currentSelectedRating
        });
        console.log(`Stored answer for Q${currentQuestionIndex} (ID ${previousQuestion.id}): ${currentSelectedRating}`);
        
        currentQuestionIndex++; 
        currentSelectedRating = null;
        
        if (currentQuestionIndex < combinedQuestions.length) { 
            if (SKIP_VIDEOS) {
                showExplanation(); 
            } else {
                console.log(`Answered previous question. Moving to Q${currentQuestionIndex}. Playing video survey-${currentQuestionIndex + 1}.mp4.`);
                playVideo(currentQuestionIndex + 1);
            }
        } else { 
            console.log("All questions answered. Moving to overall rating stage.");
            if (SKIP_VIDEOS) {
                showOverallRating();
            } else {
                console.log(`Playing video survey-${combinedQuestions.length + 1}.mp4 before overall rating.`);
                playVideo(combinedQuestions.length + 1);
            }
        }
    }

    // --- Function to show overall rating ---
    // MODIFIED VERSION OF showOverallRating
    function showOverallRating() {
        console.log("Showing overall rating question");
        // Hide other sections
        if (questionAreaDiv) questionAreaDiv.classList.add('hidden');
        if (explanationContainer) explanationContainer.classList.add('hidden');
        if (finalStepAreaDiv) finalStepAreaDiv.classList.add('hidden');
        if (beerNameIntroDisplay) beerNameIntroDisplay.classList.remove('hidden'); // Keep beer intro visible
        
        // Show overall rating area
        if (overallRatingAreaDiv) overallRatingAreaDiv.classList.remove('hidden');
        
        // Dynamically create overall rating buttons
        if (overallRatingsContainer) {
            overallRatingsContainer.innerHTML = ''; // Clear existing static buttons from HTML (if any)
            for (let i = 1; i <= 5; i++) {
                const button = document.createElement('button');
                button.classList.add('rating-button'); 
                button.dataset.value = i;
                let caption = '';
                switch(i) {
                    case 1: caption = '1: Poor'; break;
                    case 2: caption = '2: Fair'; break;
                    case 3: caption = '3: Good'; break;
                    case 4: caption = '4: Very Good'; break;
                    case 5: caption = '5: Excellent!'; break;
                }
                button.innerHTML = caption; 
                button.addEventListener('click', selectOverallRating);
                overallRatingsContainer.appendChild(button);
            }
        }

        overallRating = null; // Reset overallRating state

        // Manage visibility of navigation buttons area and its contents
        if (navigationAreaDiv) {
            navigationAreaDiv.classList.remove('hidden'); // IMPORTANT: Show the navigation area
        }
        if (nextButton) {
            nextButton.classList.add('hidden');    // IMPORTANT: Hide the 'Confirm Answer' / 'Next' button
        }
        if (finishButton) {
            finishButton.disabled = true;               // IMPORTANT: Initially disable it
            finishButton.classList.remove('hidden');    // IMPORTANT: REMOVE the .hidden class to make it visible
        }
    }  
       
    // --- Function to handle overall rating selection ---
    function selectOverallRating(event) {
        const allButtons = overallRatingsContainer.querySelectorAll('.rating-button');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        let selectedButton = event.target.closest('.rating-button');
        selectedButton.classList.add('selected');
        overallRating = parseInt(selectedButton.dataset.value);
        console.log("Overall rating selected:", overallRating); // Added for debugging
        if (finishButton) {
            finishButton.disabled = false;
            console.log("Finish button enabled."); // Added for debugging
        } else {
            console.error("Finish button not found in selectOverallRating, cannot enable.");
        }
    }

    // --- Function to finish survey ---
    function finishSurvey() {
        console.log("finishSurvey function called. Overall rating:", overallRating); // Added for debugging
        if (overallRating === null) {
            alert("Please provide an overall rating before finishing.");
            return;
        }
        console.log("Finishing survey, saving responses...");
        if (finishButton) finishButton.disabled = true;
        saveSurveyResponses();
    }

    // --- Function to save survey responses ---
    function saveSurveyResponses() {
        console.log("saveSurveyResponses function called."); // Added for debugging
        const ratings = []; // This array might not be used if surveyAnswers is primary
        surveyAnswers.forEach(answer => { 
            // Ensure questionId is a number and greater than 0 for array indexing
            if (typeof answer.questionId === 'number' && answer.questionId > 0) {
                ratings[answer.questionId - 1] = answer.answer; 
            } else {
                console.warn("Skipping rating for answer due to invalid questionId:", answer);
            }
        });
        const responseData = { 
            surveyAnswers, 
            // ratings, // Consider if this 'ratings' array is truly needed or if surveyAnswers is sufficient
            overallRating, 
            breweryId, 
            batchId, 
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        };
        console.log("Saving response data:", responseData);
        
        if (!db) { // Added check for db object
            console.error("Firestore db object is not initialized in saveSurveyResponses!");
            alert("Error: Cannot save responses, database connection is not available.");
            if (finishButton) finishButton.disabled = false; // Re-enable button
            return;
        }

        db.collection('breweries').doc(breweryId).collection('batches').doc(batchId).collection('responses').add(responseData)
            .then(async () => {
                console.log("Survey responses saved successfully to Firestore!");
                
                // Enhanced analytics capture
                try {
                    if (window.enhancedSurveyCapture) {
                        const enhancedData = await window.enhancedSurveyCapture.submitEnhancedSurvey({
                            breweryId,
                            batchId,
                            surveyAnswers,
                            overallRating
                        });
                        console.log("Enhanced survey data captured!");
                        
                        // Track revenue impact
                        if (window.revenueTracker) {
                            await window.revenueTracker.trackSurveyRevenueImpact(enhancedData);
                        }
                        
                        // Dispatch survey completion event
                        document.dispatchEvent(new CustomEvent('surveyCompleted', {
                            detail: { batchId, overallRating, enhancedData }
                        }));
                    }
                } catch (analyticsError) {
                    console.warn("Enhanced analytics failed, but survey saved:", analyticsError);
                }
                
                if (SKIP_VIDEOS) {
                    showFinalStep();
                } else {
                    console.log(`Playing final video survey-${combinedQuestions.length + 2}.mp4 before thank you.`);
                    playVideo(combinedQuestions.length + 2);
                }
            })
            .catch((error) => {
                console.error("Error saving survey responses:", error);
                alert("Error saving your responses. Please try again. Error: " + error.message);
                if (finishButton) finishButton.disabled = false;
            });
    }

    // --- Function to show final step ---
    function showFinalStep() {
        console.log("Showing final step");
        if (beerNameIntroDisplay) beerNameIntroDisplay.classList.add('hidden'); // Hide beer intro on final step
        if (questionAreaDiv) questionAreaDiv.classList.add('hidden');
        if (navigationAreaDiv) navigationAreaDiv.classList.add('hidden');
        if (explanationContainer) explanationContainer.classList.add('hidden');
        if (overallRatingAreaDiv) overallRatingAreaDiv.classList.add('hidden');
        if (videoContainer) videoContainer.classList.add('hidden'); // Ensure video player is hidden

        if (finalStepAreaDiv) {
            finalStepAreaDiv.classList.remove('hidden');
            if (overallRating >= 4 && breweryGmbLink) {
                finalStepAreaDiv.innerHTML = `<h3>Thank You for Your Feedback!</h3><p class="success-message">Your response has been recorded.</p><p>We're thrilled you enjoyed your beer! Would you consider leaving us a Google Review?</p><a href="${breweryGmbLink}" target="_blank" class="gmb-button">Leave a Google Review</a><p class="incentive-note">Show this page to your server for a special discount!</p>`;
            } else {
                finalStepAreaDiv.innerHTML = `<h3>Thank You for Your Feedback!</h3><p class="success-message">Your response has been recorded.</p><p>We appreciate your honest feedback and use it to improve our beers!</p>`;
            }
        }
    }

    // --- Event Listeners ---
    // Ensure these are attached after DOM is fully parsed and elements exist.
    console.log("Attempting to attach event listeners. Next button:", nextButton, "Finish button:", finishButton);
    if (nextButton) {
        nextButton.addEventListener('click', goToNextQuestion);
        console.log("Event listener attached to nextButton.");
    } else {
        console.warn("nextButton not found, listener not attached.");
    }

    if (finishButton) {
        finishButton.addEventListener('click', finishSurvey);
        console.log("Event listener attached to finishButton.");
    } else {
        console.warn("finishButton not found, listener not attached.");
    }
    
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            console.log("Continue button clicked (from explanation), showing question for Q" + currentQuestionIndex);
            displayQuestion();
        });
        console.log("Event listener attached to continueButton.");
    } else {
        console.warn("continueButton not found, listener not attached.");
    }

}); // End of DOMContentLoaded
// --- END OF FILE survey.js ---