// Batch Tracker JavaScript
// Professional brewing process tracking and logging

class BatchTracker {
    constructor() {
        this.currentBatchId = null;
        this.currentUserId = null;
        this.batchData = null;
        this.measurements = {
            temperature: [],
            gravity: [],
            ph: []
        };
        this.currentStep = 0;
        this.completedSteps = [];
        this.stepNotes = {};
        this.beerStyleDefaults = {
            'American IPA': { temp: 65, gravity: 1.060, ph: 5.4, duration: 60 },
            'American Pale Ale': { temp: 66, gravity: 1.050, ph: 5.3, duration: 60 },
            'Stout': { temp: 68, gravity: 1.055, ph: 5.2, duration: 90 },
            'Wheat Beer': { temp: 64, gravity: 1.045, ph: 4.8, duration: 60 },
            'Lager': { temp: 50, gravity: 1.048, ph: 5.4, duration: 90 },
            'Porter': { temp: 67, gravity: 1.052, ph: 5.3, duration: 75 }
        };
        
        this.init();
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentBatchId = urlParams.get('batchId');
        
        if (!this.currentBatchId) {
            this.showAlert('No batch ID provided', 'warning');
            return;
        }

        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUserId = user.uid;
                this.loadBatchData();
                this.setupEventListeners();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    async loadBatchData() {
        try {
            const batchDoc = await db.collection('breweries')
                .doc(this.currentUserId)
                .collection('batches')
                .doc(this.currentBatchId)
                .get();

            if (!batchDoc.exists) {
                this.showAlert('Batch not found', 'warning');
                return;
            }

            this.batchData = batchDoc.data();
            this.displayBatchInfo();
            this.loadTrackingData();
        } catch (error) {
            console.error('Error loading batch data:', error);
            this.showAlert('Error loading batch data', 'warning');
        }
    }

    displayBatchInfo() {
        document.getElementById('batch-name').textContent = this.batchData.beerName || 'Unnamed Batch';
        document.getElementById('batch-code').textContent = `Batch Code: ${this.batchData.batchCode || 'N/A'}`;
        document.getElementById('beer-style').textContent = this.batchData.beerStyle || 'N/A';
        document.getElementById('beer-abv').textContent = this.batchData.abv || 'N/A';
        document.getElementById('beer-ibu').textContent = this.batchData.ibu || 'N/A';
        document.getElementById('batch-size').textContent = this.batchData.batchSize || '5';
        
        this.populateStyleDefaults();
        
        if (this.batchData.createdAt) {
            const brewDate = this.batchData.createdAt.toDate();
            const today = new Date();
            const daysDiff = Math.floor((today - brewDate) / (1000 * 60 * 60 * 24));
            document.getElementById('days-brewing').textContent = daysDiff;
            document.getElementById('brew-date').textContent = brewDate.toLocaleDateString();
            
            const packageDate = new Date(brewDate);
            packageDate.setDate(packageDate.getDate() + 14);
            document.getElementById('package-date').textContent = packageDate.toLocaleDateString();
        }
        
        this.updateStepProgress();
    }

    async loadTrackingData() {
        try {
            const trackingDoc = await db.collection('breweries')
                .doc(this.currentUserId)
                .collection('batches')
                .doc(this.currentBatchId)
                .collection('tracking')
                .doc('current')
                .get();

            if (trackingDoc.exists) {
                const trackingData = trackingDoc.data();
                this.updateCurrentStatus(trackingData);
                this.measurements = trackingData.measurements || this.measurements;
                this.currentStep = trackingData.currentStep || 0;
                this.completedSteps = trackingData.completedSteps || [];
                this.stepNotes = trackingData.stepNotes || {};
                this.updateMeasurementHistory();
                this.updateStepProgress();
            }
        } catch (error) {
            console.error('Error loading tracking data:', error);
        }
    }

    updateCurrentStatus(data) {
        document.getElementById('current-stage').textContent = data.currentStage || 'Brewing';
        document.getElementById('current-temp').textContent = data.currentTemp || '-';
        document.getElementById('current-gravity').textContent = data.currentGravity || '-';
        document.getElementById('current-ph').textContent = data.currentPh || '-';
        document.getElementById('expected-fg').textContent = data.expectedFg || '1.012';
    }

    setupEventListeners() {
        document.getElementById('save-progress').addEventListener('click', () => {
            this.saveTrackingData();
        });

        document.getElementById('photo-input').addEventListener('change', (e) => {
            this.handlePhotoUpload(e.target.files);
        });

        document.getElementById('step-timestamp').value = new Date().toISOString().slice(0, 16);
        this.setupMeasurementDefaults();
    }

    async logMeasurement(type) {
        const inputId = `${type}-reading`;
        const value = document.getElementById(inputId).value;
        
        if (!value) {
            this.showAlert('Please enter a value', 'warning');
            return;
        }

        const measurement = {
            value: parseFloat(value),
            timestamp: new Date(),
            type: type
        };

        this.measurements[type].push(measurement);
        
        if (type === 'temperature') {
            document.getElementById('current-temp').textContent = value;
        } else if (type === 'gravity') {
            document.getElementById('current-gravity').textContent = value;
        } else if (type === 'ph') {
            document.getElementById('current-ph').textContent = value;
        }

        document.getElementById(inputId).value = '';
        this.updateMeasurementHistory();
        await this.saveTrackingData();
        this.showAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} logged successfully`, 'success');
    }

    updateMeasurementHistory() {
        ['temperature', 'gravity', 'ph'].forEach(type => {
            const historyDiv = document.getElementById(`${type}-history`);
            const measurements = this.measurements[type].slice(-5);
            
            if (measurements.length === 0) {
                historyDiv.innerHTML = '<small>No readings yet</small>';
                return;
            }

            historyDiv.innerHTML = measurements.map(m => {
                const time = new Date(m.timestamp).toLocaleTimeString();
                return `<div><strong>${m.value}</strong> at ${time}</div>`;
            }).join('');
        });
    }

    async saveTrackingData() {
        try {
            const trackingData = {
                currentStage: document.getElementById('current-stage').textContent,
                currentTemp: document.getElementById('current-temp').textContent,
                currentGravity: document.getElementById('current-gravity').textContent,
                currentPh: document.getElementById('current-ph').textContent,
                expectedFg: document.getElementById('expected-fg').textContent,
                measurements: this.measurements,
                currentStep: this.currentStep,
                completedSteps: this.completedSteps,
                stepNotes: this.stepNotes,
                lastUpdated: new Date()
            };

            await db.collection('breweries')
                .doc(this.currentUserId)
                .collection('batches')
                .doc(this.currentBatchId)
                .collection('tracking')
                .doc('current')
                .set(trackingData, { merge: true });

            this.showAlert('Progress saved successfully', 'success');
        } catch (error) {
            console.error('Error saving tracking data:', error);
            this.showAlert('Error saving progress', 'warning');
        }
    }

    async saveNotes() {
        const notes = document.getElementById('brewing-notes').value;
        
        if (!notes.trim()) {
            this.showAlert('Please enter some notes', 'warning');
            return;
        }

        try {
            const noteData = {
                content: notes,
                timestamp: new Date(),
                batchId: this.currentBatchId
            };

            await db.collection('breweries')
                .doc(this.currentUserId)
                .collection('batches')
                .doc(this.currentBatchId)
                .collection('notes')
                .add(noteData);

            document.getElementById('brewing-notes').value = '';
            this.showAlert('Notes saved successfully', 'success');
        } catch (error) {
            console.error('Error saving notes:', error);
            this.showAlert('Error saving notes', 'warning');
        }
    }

    populateStyleDefaults() {
        const beerStyle = this.batchData.beerStyle;
        const defaults = this.beerStyleDefaults[beerStyle] || this.beerStyleDefaults['American Pale Ale'];
        
        document.getElementById('temp-reading').placeholder = `Temperature (${defaults.temp}°F)`;
        document.getElementById('gravity-reading').placeholder = `Gravity (${defaults.gravity})`;
        document.getElementById('ph-reading').placeholder = `pH (${defaults.ph})`;
    }
    
    setupMeasurementDefaults() {
        const beerStyle = this.batchData?.beerStyle;
        const defaults = this.beerStyleDefaults[beerStyle] || this.beerStyleDefaults['American Pale Ale'];
        this.createMeasurementDropdowns(defaults);
    }
    
    createMeasurementDropdowns(defaults) {
        const tempOptions = [defaults.temp - 2, defaults.temp, defaults.temp + 2];
        this.addDropdownToInput('temp-reading', tempOptions, '°F');
        
        const gravityOptions = [(defaults.gravity - 0.005).toFixed(3), defaults.gravity.toFixed(3), (defaults.gravity + 0.005).toFixed(3)];
        this.addDropdownToInput('gravity-reading', gravityOptions, '');
        
        const phOptions = [(defaults.ph - 0.2).toFixed(1), defaults.ph.toFixed(1), (defaults.ph + 0.2).toFixed(1)];
        this.addDropdownToInput('ph-reading', phOptions, '');
    }
    
    addDropdownToInput(inputId, options, unit) {
        const input = document.getElementById(inputId);
        const container = input.parentElement;
        
        const select = document.createElement('select');
        select.style.marginRight = '5px';
        select.innerHTML = `<option value="">Quick Select</option>`;
        
        options.forEach(option => {
            select.innerHTML += `<option value="${option}">${option}${unit}</option>`;
        });
        
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                input.value = e.target.value;
                e.target.value = '';
            }
        });
        
        container.insertBefore(select, input);
    }
    
    updateStepProgress() {
        const steps = document.querySelectorAll('.timeline-step');
        steps.forEach((step, index) => {
            const status = step.querySelector('.step-status');
            const button = step.querySelector('button');
            const notesDiv = document.getElementById(`step-notes-${index}`);
            
            if (this.completedSteps.includes(index)) {
                status.className = 'step-status completed';
                button.innerHTML = '<i class="fas fa-check"></i> Completed';
                button.className = 'btn btn-small btn-success';
            } else if (index === this.currentStep) {
                status.className = 'step-status active';
                button.innerHTML = '<i class="fas fa-play"></i> Active';
                button.className = 'btn btn-small btn-primary';
            } else if (index < this.currentStep) {
                button.disabled = false;
            } else {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-lock"></i> Locked';
                button.className = 'btn btn-small btn-secondary';
            }
            
            if (notesDiv && this.stepNotes[index]) {
                notesDiv.innerHTML = `<strong>Notes:</strong> ${this.stepNotes[index]}`;
                notesDiv.style.display = 'block';
            } else if (notesDiv) {
                notesDiv.style.display = 'none';
            }
        });
    }
    
    openStepModal(stepType) {
        const stepIndex = this.getStepIndex(stepType);
        
        if (stepIndex > this.currentStep && !this.completedSteps.includes(stepIndex)) {
            this.showAlert('Complete previous steps first', 'warning');
            return;
        }
        
        const modal = document.getElementById('step-modal');
        const title = document.getElementById('modal-title');
        
        title.textContent = `Log ${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Step`;
        
        const beerStyle = this.batchData?.beerStyle;
        const defaults = this.beerStyleDefaults[beerStyle] || this.beerStyleDefaults['American Pale Ale'];
        
        document.getElementById('step-temperature').value = defaults.temp;
        document.getElementById('step-duration').value = defaults.duration;
        document.getElementById('step-timestamp').value = new Date().toISOString().slice(0, 16);
        
        if (this.stepNotes[stepIndex]) {
            document.getElementById('step-notes').value = this.stepNotes[stepIndex];
        } else {
            document.getElementById('step-notes').value = '';
        }
        
        modal.classList.remove('hidden');
        this.currentStepType = stepType;
        this.currentStepIndex = stepIndex;
    }
    
    getStepIndex(stepType) {
        const stepMap = {
            'mash': 0,
            'lauter': 1,
            'boil': 2,
            'cooling': 3,
            'fermentation': 4,
            'packaging': 5
        };
        return stepMap[stepType] || 0;
    }
    
    async saveStep() {
        const stepIndex = this.currentStepIndex;
        const timestamp = document.getElementById('step-timestamp').value;
        const temperature = document.getElementById('step-temperature').value;
        const duration = document.getElementById('step-duration').value;
        const notes = document.getElementById('step-notes').value;
        
        if (!timestamp || !temperature || !duration) {
            this.showAlert('Please fill in all required fields', 'warning');
            return;
        }
        
        const stepData = {
            timestamp: new Date(timestamp),
            temperature: parseFloat(temperature),
            duration: parseInt(duration),
            notes: notes,
            stepType: this.currentStepType,
            stepIndex: stepIndex
        };
        
        if (!this.completedSteps.includes(stepIndex)) {
            this.completedSteps.push(stepIndex);
        }
        
        if (notes.trim()) {
            this.stepNotes[stepIndex] = notes;
        }
        
        if (stepIndex === this.currentStep) {
            this.currentStep = Math.min(this.currentStep + 1, 5);
        }
        
        try {
            await db.collection('breweries')
                .doc(this.currentUserId)
                .collection('batches')
                .doc(this.currentBatchId)
                .collection('steps')
                .doc(stepIndex.toString())
                .set(stepData, { merge: true });
            
            await this.saveTrackingData();
            this.updateStepProgress();
            this.closeStepModal();
            this.showAlert('Step completed successfully', 'success');
        } catch (error) {
            console.error('Error saving step:', error);
            this.showAlert('Error saving step', 'warning');
        }
    }
    
    closeStepModal() {
        document.getElementById('step-modal').classList.add('hidden');
        document.getElementById('step-temperature').value = '';
        document.getElementById('step-duration').value = '';
        document.getElementById('step-notes').value = '';
    }
    
    handlePhotoUpload(files) {
        const previewDiv = document.getElementById('photo-preview');
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                previewDiv.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }
    
    showAlert(message, type) {
        const alertsContainer = document.getElementById('alerts-container');
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        
        alertsContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Global functions for HTML onclick events
function openStepModal(stepType) {
    if (window.batchTracker) {
        window.batchTracker.openStepModal(stepType);
    }
}

function closeStepModal() {
    if (window.batchTracker) {
        window.batchTracker.closeStepModal();
    }
}

function saveStep() {
    if (window.batchTracker) {
        window.batchTracker.saveStep();
    }
}

function logMeasurement(type) {
    if (window.batchTracker) {
        window.batchTracker.logMeasurement(type);
    }
}

function saveNotes() {
    if (window.batchTracker) {
        window.batchTracker.saveNotes();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.batchTracker = new BatchTracker();
});