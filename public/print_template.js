// print_template.js

document.addEventListener('DOMContentLoaded', () => {
    const qrGrid = document.getElementById('qr-grid-container');
    const pageTitle = document.querySelector('h1'); // Select the H1 tag
    const qrDataString = localStorage.getItem('brewMetricsQrPrintData');
    const qrPixelSize = 128; // Internal pixel size for QR lib, CSS controls display size

    if (!qrGrid || !pageTitle) {
        console.error("Required elements (#qr-grid-container or h1) not found!");
        if(qrGrid) qrGrid.innerHTML = '<p class="error-message">Page structure error.</p>';
        return;
    }

    if (!qrDataString) {
        qrGrid.innerHTML = '<p class="error-message">No QR code data found. Please generate it from the dashboard first.</p>';
        return;
    }

    if (typeof QRCode === 'undefined') {
        console.error("QRCode library is not loaded.");
        qrGrid.innerHTML = '<p class="error-message">QR Code library failed to load. Check internet connection or script URL.</p>';
        return;
    }

    try {
        const qrData = JSON.parse(qrDataString);
        if (!qrData || !qrData.url || !qrData.name || !qrData.layout) {
            throw new Error("Invalid or incomplete QR data structure in localStorage.");
        }

        qrGrid.innerHTML = ''; // Clear loading/error message
        pageTitle.textContent = `${qrData.name} - Survey QR Codes (${qrData.layout.replace('x','×')})`; // Update H1 title

        // Apply layout CSS classes/styles
        applyLayoutStyles(qrData.layout, qrGrid);

        const codesToGenerate = calculateCodesNeeded(qrData.layout);

        console.log(`Generating ${codesToGenerate} QR codes for layout: ${qrData.layout}, URL: ${qrData.url}`);

        // Generate the required number of QR codes
        for (let i = 0; i < codesToGenerate; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('qr-code-item');
            // Optionally add layout class for more specific CSS if needed: itemDiv.classList.add(`layout-${qrData.layout}`);

            const namePara = document.createElement('p');
            namePara.classList.add('brewery-name');
            namePara.textContent = qrData.name;

            // Container for QR code image/canvas
            const qrImgContainer = document.createElement('div');
            qrImgContainer.classList.add('qr-code-img-container');
            // No ID needed if generating directly

            const promptPara = document.createElement('p');
            promptPara.classList.add('scan-prompt');
            promptPara.textContent = 'Scan for Survey!'; // Slightly different prompt

            itemDiv.appendChild(namePara);
            itemDiv.appendChild(qrImgContainer); // Append the container
            itemDiv.appendChild(promptPara);
            qrGrid.appendChild(itemDiv);

            // Generate the QR code directly into the container
            try {
                new QRCode(qrImgContainer, { // Target the container
                    text: qrData.url,
                    width: qrPixelSize, // Internal size
                    height: qrPixelSize,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M // Medium correction level
                });
            } catch (qrError) {
                console.error(`Error generating QR code for item ${i}:`, qrError);
                 qrImgContainer.innerHTML = `<p class="error-message" style="font-size: 6pt;">QR Gen Error</p>`;
            }
        } // End for loop

        // Optional: Trigger print dialog automatically after a short delay
        // Consider adding a manual Print button on the template page instead for better UX
        // setTimeout(() => {
        //    console.log("Attempting to trigger print dialog...");
        //    window.print();
        // }, 600); // Delay to allow QR codes to render

    } catch (e) {
        console.error("Error processing QR print data or generating grid:", e);
        qrGrid.innerHTML = `<p class="error-message">Error loading QR code data: ${e.message}. Please try generating again.</p>`;
    }
    // Decide if you want to clear the localStorage item after use
    // localStorage.removeItem('brewMetricsQrPrintData'); // Maybe clear it *after* print? Hard to detect reliably.
});

/**
 * Calculates how many QR code elements to generate based on the layout string.
 * @param {string} layout - The layout identifier (e.g., "1x1", "2x2", "auto").
 * @returns {number} The number of codes to generate.
 */
function calculateCodesNeeded(layout) {
    if (layout === 'auto') {
        return 48; // Generate a decent number for auto-fill
    }
    const parts = layout.split('x');
    if (parts.length === 2) {
        const num1 = parseInt(parts[0], 10);
        const num2 = parseInt(parts[1], 10);
        if (!isNaN(num1) && !isNaN(num2)) {
            return num1 * num2;
        }
    }
    console.warn(`Invalid layout string "${layout}", defaulting to auto (48 codes).`);
    return 48; // Default fallback
}

/**
 * Applies CSS classes or inline styles to the grid container based on the selected layout.
 * @param {string} layout - The layout identifier (e.g., "1x1", "2x2", "auto").
 * @param {HTMLElement} gridContainer - The container element for the QR codes.
 */
function applyLayoutStyles(layout, gridContainer) {
    // Set a data attribute on the container for easier CSS targeting
    gridContainer.setAttribute('data-layout', layout);

    // You can also apply direct styles here if needed, but using CSS classes/attributes is cleaner
    // Example: Reset grid styles if needed (though CSS attribute selectors are preferred)
    // gridContainer.style.gridTemplateColumns = '';
    // gridContainer.style.gridTemplateRows = '';

    // No direct style manipulation needed here if handled purely by CSS via [data-layout]
    console.log(`Applied data-layout="${layout}" attribute to grid container.`);
}