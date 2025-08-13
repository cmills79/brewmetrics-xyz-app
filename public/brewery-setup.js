class BrewerySetup {
    constructor() {
        this.currentStep = 1;
        this.breweryConfig = {
            basicInfo: {},
            equipment: {},
            breweryLogo: null
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateEquipmentDropdowns();
        this.loadExistingConfig();
    }

    setupEventListeners() {
        // Equipment selection
        document.querySelectorAll('.equipment-card').forEach(card => {
            card.addEventListener('click', () => this.selectEquipment(card));
        });

        // Logo upload
        const logoInput = document.getElementById('logo-input');
        if (logoInput) {
            logoInput.addEventListener('change', (e) => this.handleLogoUpload(e));
        }

        // Wizard step navigation
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.addEventListener('click', (e) => {
                const stepNum = parseInt(e.currentTarget.dataset.step);
                if (stepNum <= this.currentStep) {
                    this.goToStep(stepNum);
                }
            });
        });
        
        // Custom equipment entry handling
        document.addEventListener('change', (e) => {
            if (e.target.value === 'Other' && e.target.id.includes('-model')) {
                this.showCustomEquipmentModal(e.target);
            }
        });
    }

    selectEquipment(card) {
        // Remove selection from siblings
        card.parentElement.querySelectorAll('.equipment-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        // Select current card
        card.classList.add('selected');
        
        // Store selection
        const equipmentType = card.dataset.equipment;
        const category = card.closest('h3').textContent.toLowerCase().replace(/\s+/g, '_');
        
        if (!this.breweryConfig.equipment[category]) {
            this.breweryConfig.equipment[category] = {};
        }
        this.breweryConfig.equipment[category].type = equipmentType;
    }

    async handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
            try {
                const logoData = await this.uploadLogo(file);
                this.breweryConfig.breweryLogo = logoData;
                this.displayLogo(logoData);
            } catch (error) {
                console.error('Error uploading logo:', error);
                alert('Failed to upload logo: ' + file.name);
            }
        } else {
            alert('Please select an image file under 2MB');
        }
    }

    async uploadLogo(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const logoData = {
                    name: file.name,
                    url: e.target.result,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString()
                };
                resolve(logoData);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    displayLogo(logoData) {
        const logoPreview = document.getElementById('logo-preview');
        const logoImage = document.getElementById('logo-image');
        
        logoImage.src = logoData.url;
        logoImage.alt = logoData.name;
        logoPreview.style.display = 'block';
        
        // Hide upload area
        document.getElementById('logo-upload-area').style.display = 'none';
    }

    removeLogo() {
        this.breweryConfig.breweryLogo = null;
        document.getElementById('logo-preview').style.display = 'none';
        document.getElementById('logo-upload-area').style.display = 'block';
        document.getElementById('logo-input').value = '';
    }

    nextStep(stepNum) {
        if (this.validateCurrentStep()) {
            this.saveCurrentStep();
            this.goToStep(stepNum);
        }
    }

    prevStep(stepNum) {
        this.goToStep(stepNum);
    }

    goToStep(stepNum) {
        // Hide current section
        document.querySelector('.setup-section.active').classList.remove('active');
        
        // Show target section
        document.getElementById(`step-${stepNum}`).classList.add('active');
        
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${(stepNum / 4) * 100}%`;
        }
        
        // Update wizard steps
        document.querySelectorAll('.step-circle').forEach((circle, index) => {
            circle.classList.remove('active', 'completed');
            if (index + 1 === stepNum) {
                circle.classList.add('active');
            } else if (index + 1 < stepNum) {
                circle.classList.add('completed');
            }
        });
        
        // Update step connectors
        document.querySelectorAll('.step-connector').forEach((connector, index) => {
            connector.classList.remove('completed');
            if (index + 1 < stepNum) {
                connector.classList.add('completed');
            }
        });
        
        this.currentStep = stepNum;

        // Special handling for final step
        if (stepNum === 4) {
            this.displaySetupSummary();
            this.saveBreweryConfig();
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                const breweryName = document.getElementById('brewery-name').value;
                if (!breweryName.trim()) {
                    alert('Please enter a brewery name');
                    return false;
                }
                return true;
            case 2:
                const mashVolume = document.getElementById('mash-volume').value;
                const efficiency = document.getElementById('mash-efficiency').value;
                if (!mashVolume || !efficiency) {
                    alert('Please fill in all required equipment specifications');
                    return false;
                }
                return true;
            case 3:
                return true; // Photos are optional
            default:
                return true;
        }
    }

    saveCurrentStep() {
        switch (this.currentStep) {
            case 1:
                this.breweryConfig.basicInfo = {
                    name: document.getElementById('brewery-name').value,
                    type: document.getElementById('brewery-type').value,
                    annualProduction: parseInt(document.getElementById('annual-production').value) || 0,
                    primaryStyles: document.getElementById('primary-styles').value
                };
                break;
            case 2:
                this.breweryConfig.equipment = {
                    ...this.breweryConfig.equipment,
                    mashTun: {
                        ...this.breweryConfig.equipment.mash_tun,
                        volume: parseFloat(document.getElementById('mash-volume').value),
                        efficiency: parseInt(document.getElementById('mash-efficiency').value)
                    },
                    fermentation: {
                        ...this.breweryConfig.equipment.fermentation_system,
                        fermenterSize: parseFloat(document.getElementById('fermenter-size').value),
                        fermenterCount: parseInt(document.getElementById('fermenter-count').value),
                        temperatureControl: document.getElementById('temp-control').value,
                        pressureCapability: document.getElementById('pressure-capability').value
                    },
                    additionalEquipment: {
                        whirlpool: document.getElementById('has-whirlpool').checked,
                        hopBack: document.getElementById('has-hop-back').checked,
                        centrifuge: document.getElementById('has-centrifuge').checked,
                        filtration: document.getElementById('has-filter').checked
                    }
                };
                break;
        }
    }

    displaySetupSummary() {
        const summary = document.getElementById('setup-summary');
        const config = this.breweryConfig;
        
        summary.innerHTML = `
            <div class="summary-card">
                <div class="summary-title"><i class="fas fa-beer"></i> Brewery Details</div>
                <div class="summary-value">${config.basicInfo.name || 'Not specified'}</div>
                <p>${config.basicInfo.type || 'Unknown type'} • ${config.basicInfo.annualProduction || 0} BBL/year</p>
            </div>
            <div class="summary-card">
                <div class="summary-title"><i class="fas fa-fire"></i> Mash System</div>
                <div class="summary-value">${config.equipment.mashTun?.efficiency || 'N/A'}%</div>
                <p>Calculated Efficiency</p>
            </div>
            <div class="summary-card">
                <div class="summary-title"><i class="fas fa-wine-glass"></i> Fermentation</div>
                <div class="summary-value">${config.equipment.fermentation?.fermenterSize || 'N/A'} BBL</div>
                <p>${config.equipment.fermentation?.fermenterCount || 0} Fermenters</p>
            </div>
            <div class="summary-card">
                <div class="summary-title"><i class="fas fa-image"></i> Brewery Logo</div>
                <div class="summary-value">${config.breweryLogo ? 'Uploaded' : 'None'}</div>
                <p>Logo Status</p>
            </div>
        `;
    }

    async saveBreweryConfig() {
        try {
            const breweryId = this.getBreweryId();
            
            // Save to Firestore
            await firebase.firestore()
                .collection('breweries')
                .doc(breweryId)
                .collection('configuration')
                .doc('equipment')
                .set({
                    ...this.breweryConfig,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    version: '1.0'
                });

            // Upload logo to Firebase Storage if exists
            if (this.breweryConfig.breweryLogo) {
                await this.uploadLogoToStorage(breweryId);
            }

            console.log('Brewery configuration saved successfully');
        } catch (error) {
            console.error('Error saving brewery configuration:', error);
            alert('Failed to save configuration. Please try again.');
        }
    }

    async uploadLogoToStorage(breweryId) {
        const storage = firebase.storage();
        const logo = this.breweryConfig.breweryLogo;
        
        if (logo && logo.url.startsWith('data:')) {
            try {
                const storageRef = storage.ref(`breweries/${breweryId}/logo/brewery-logo`);
                await storageRef.putString(logo.url, 'data_url');
                console.log('Logo uploaded successfully');
            } catch (error) {
                console.error('Error uploading logo:', error);
            }
        }
    }

    async loadExistingConfig() {
        try {
            const breweryId = this.getBreweryId();
            const configDoc = await firebase.firestore()
                .collection('breweries')
                .doc(breweryId)
                .collection('configuration')
                .doc('equipment')
                .get();

            if (configDoc.exists) {
                const config = configDoc.data();
                this.populateFormFields(config);
                this.breweryConfig = config;
            }
        } catch (error) {
            console.error('Error loading existing configuration:', error);
        }
    }

    populateFormFields(config) {
        if (config.basicInfo) {
            const fields = ['brewery-name', 'brewery-type', 'annual-production', 'primary-styles'];
            fields.forEach(field => {
                const element = document.getElementById(field);
                const key = field.replace('-', '');
                if (element && config.basicInfo[key]) {
                    element.value = config.basicInfo[key];
                }
            });
        }

        if (config.equipment) {
            if (config.equipment.mashTun) {
                document.getElementById('mash-volume').value = config.equipment.mashTun.volume || '';
                document.getElementById('mash-efficiency').value = config.equipment.mashTun.efficiency || '';
            }
            
            if (config.equipment.fermentation) {
                document.getElementById('fermenter-size').value = config.equipment.fermentation.fermenterSize || '';
                document.getElementById('fermenter-count').value = config.equipment.fermentation.fermenterCount || '';
                document.getElementById('temp-control').value = config.equipment.fermentation.temperatureControl || '';
                document.getElementById('pressure-capability').value = config.equipment.fermentation.pressureCapability || '';
            }
        }

        if (config.breweryLogo) {
            this.displayLogo(config.breweryLogo);
        }
    }

    populateEquipmentDropdowns() {
        if (!window.equipmentDatabase) return;
        
        // Populate mash tun brands
        const mashBrands = window.equipmentDatabase.getAllBrands('mashTuns');
        const mashBrandSelect = document.getElementById('mash-brand');
        if (mashBrandSelect) {
            mashBrands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                mashBrandSelect.appendChild(option);
            });
        }
        
        // Populate fermenter brands
        const fermenterBrands = window.equipmentDatabase.getAllBrands('fermenters');
        const fermenterBrandSelect = document.getElementById('fermenter-brand');
        if (fermenterBrandSelect) {
            fermenterBrands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                fermenterBrandSelect.appendChild(option);
            });
        }
    }
    
    showCustomEquipmentModal(selectElement) {
        const equipmentType = selectElement.id.replace('-model', '');
        const customBrand = prompt(`Enter custom brand for ${equipmentType}:`);
        const customModel = prompt(`Enter custom model for ${equipmentType}:`);
        const customEfficiency = prompt(`Enter efficiency % for ${equipmentType} (60-95):`);
        
        if (customBrand && customModel && customEfficiency) {
            // Add custom option to dropdown
            const option = document.createElement('option');
            option.value = `${customBrand}|${customModel}`;
            option.textContent = `${customBrand} - ${customModel}`;
            option.dataset.efficiency = customEfficiency;
            selectElement.appendChild(option);
            selectElement.value = option.value;
            
            // Update efficiency field
            if (equipmentType === 'mash') {
                document.getElementById('mash-efficiency').value = customEfficiency;
            }
        }
    }

    getBreweryId() {
        // In production, get from authenticated user
        return 'demo-brewery';
    }
}

// Global functions for HTML onclick handlers
function nextStep(stepNum) {
    brewerySetup.nextStep(stepNum);
}

function prevStep(stepNum) {
    brewerySetup.prevStep(stepNum);
}

// Global functions for dropdown updates
function updateMashModels() {
    const brandSelect = document.getElementById('mash-brand');
    const modelSelect = document.getElementById('mash-model');
    const selectedBrand = brandSelect.value;
    
    // Clear existing models
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    
    if (selectedBrand && window.equipmentDatabase) {
        const models = window.equipmentDatabase.getModelsByBrand('mashTuns', selectedBrand);
        models.forEach(equipment => {
            const option = document.createElement('option');
            option.value = `${equipment.brand}|${equipment.model}`;
            option.textContent = equipment.model;
            option.dataset.efficiency = equipment.efficiency;
            option.dataset.heatType = equipment.heatType;
            modelSelect.appendChild(option);
        });
        
        // Add "Other" option
        const otherOption = document.createElement('option');
        otherOption.value = 'Other';
        otherOption.textContent = 'Other (Custom Entry)';
        modelSelect.appendChild(otherOption);
    }
}

function updateMashEfficiency() {
    const modelSelect = document.getElementById('mash-model');
    const volumeInput = document.getElementById('mash-volume');
    const selectedOption = modelSelect.selectedOptions[0];
    
    if (selectedOption && selectedOption.dataset.efficiency && window.equipmentDatabase) {
        const baseEfficiency = parseInt(selectedOption.dataset.efficiency);
        const heatType = selectedOption.dataset.heatType;
        const volume = parseFloat(volumeInput.value) || 7;
        const brand = selectedOption.value.split('|')[0];
        
        // Get additional equipment selections
        const additionalEquipment = {
            whirlpool: document.getElementById('has-whirlpool')?.checked || false,
            hopBack: document.getElementById('has-hop-back')?.checked || false,
            centrifuge: document.getElementById('has-centrifuge')?.checked || false,
            filtration: document.getElementById('has-filter')?.checked || false
        };
        
        // Calculate dynamic efficiency with all factors
        const calculatedEfficiency = window.equipmentDatabase.calculateEfficiency(
            baseEfficiency, heatType, volume, brand, additionalEquipment
        );
        
        // Update heat type selection if available
        if (heatType) {
            document.querySelectorAll('.equipment-card').forEach(card => {
                card.classList.remove('selected');
                if (card.dataset.equipment === heatType) {
                    card.classList.add('selected');
                }
            });
        }
        
        // Show efficiency breakdown
        showEfficiencyBreakdown(baseEfficiency, heatType, volume, brand, calculatedEfficiency, additionalEquipment);
    }
}

function updateFermenterModels() {
    const brandSelect = document.getElementById('fermenter-brand');
    const modelSelect = document.getElementById('fermenter-model');
    const selectedBrand = brandSelect.value;
    
    // Clear existing models
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    
    if (selectedBrand && window.equipmentDatabase) {
        const models = window.equipmentDatabase.getModelsByBrand('fermenters', selectedBrand);
        models.forEach(equipment => {
            const option = document.createElement('option');
            option.value = `${equipment.brand}|${equipment.model}`;
            option.textContent = equipment.model;
            option.dataset.type = equipment.type;
            option.dataset.tempControl = equipment.tempControl;
            option.dataset.efficiency = equipment.efficiency;
            modelSelect.appendChild(option);
        });
        
        // Add "Other" option
        const otherOption = document.createElement('option');
        otherOption.value = 'Other';
        otherOption.textContent = 'Other (Custom Entry)';
        modelSelect.appendChild(otherOption);
    }
}

function updateFermenterSpecs() {
    const modelSelect = document.getElementById('fermenter-model');
    const selectedOption = modelSelect.selectedOptions[0];
    
    if (selectedOption && selectedOption.dataset.type) {
        // Update fermenter type selection
        const fermenterType = selectedOption.dataset.type;
        document.querySelectorAll('.equipment-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.equipment === fermenterType) {
                card.classList.add('selected');
            }
        });
        
        // Update temperature control
        const tempControl = selectedOption.dataset.tempControl;
        if (tempControl) {
            const tempControlSelect = document.getElementById('temp-control');
            if (tempControlSelect) {
                tempControlSelect.value = tempControl;
            }
        }
    }
}

function showEfficiencyBreakdown(base, heatType, volume, brand, final, additionalEquipment = {}) {
    const efficiencyDisplay = document.getElementById('efficiency-display');
    const efficiencyValue = document.getElementById('efficiency-value');
    const efficiencyBreakdown = document.getElementById('efficiency-breakdown');
    
    if (!efficiencyDisplay || !efficiencyValue || !efficiencyBreakdown) return;
    
    // Show the efficiency display
    efficiencyDisplay.style.display = 'block';
    
    // Update the efficiency value with animation
    efficiencyValue.textContent = `${final}%`;
    
    // Calculate modifiers for display
    const heatModifier = heatType === 'steam-jacket' ? '+8%' : 
                        heatType === 'electric' ? '+5%' : 
                        heatType === 'direct-fire' ? '-3%' : '0%';
    
    let volumeModifier = '0%';
    if (volume >= 30) volumeModifier = '+6%';
    else if (volume >= 20) volumeModifier = '+5%';
    else if (volume >= 15) volumeModifier = '+4%';
    else if (volume >= 10) volumeModifier = '+3%';
    else if (volume >= 7) volumeModifier = '+2%';
    else if (volume >= 5) volumeModifier = '+1%';
    else if (volume < 3) volumeModifier = '-4%';
    
    const brandModifier = brand === 'Premier Stainless' ? '+4%' :
                         brand === 'DME Brewing' ? '+5%' :
                         brand === 'Stout Tanks' ? '+3%' :
                         brand === 'Psycho Brew' ? '+2%' :
                         brand === 'Blichmann Engineering' ? '+2%' :
                         brand === 'Ss Brewtech' ? '+1%' :
                         brand === 'Custom Fabricated' ? '-6%' :
                         brand === 'Used Equipment' ? '-8%' :
                         brand === 'Other' ? '-2%' : '0%';
    
    // Calculate equipment bonuses
    let equipmentBonus = 0;
    const equipmentList = [];
    if (additionalEquipment.whirlpool) { equipmentBonus += 2; equipmentList.push('Whirlpool +2%'); }
    if (additionalEquipment.hopBack) { equipmentBonus += 1; equipmentList.push('Hop Back +1%'); }
    if (additionalEquipment.centrifuge) { equipmentBonus += 1; equipmentList.push('Centrifuge +1%'); }
    if (additionalEquipment.filtration) { equipmentBonus += 1; equipmentList.push('Filtration +1%'); }
    
    const professionalBonus = volume >= 7 ? '+2%' : '0%';
    
    efficiencyBreakdown.innerHTML = `
        <strong>Professional Brewing System Efficiency:</strong><br>
        Base: ${base}% | Heat: ${heatModifier} | Volume: ${volumeModifier} | Brand: ${brandModifier} | Professional: ${professionalBonus}<br>
        ${equipmentList.length > 0 ? 'Equipment: ' + equipmentList.join(', ') : 'No additional equipment bonuses'}
    `;
}

// Enhanced equipment interaction functions
function toggleEquipment(equipmentType) {
    const checkbox = document.getElementById(`has-${equipmentType}`);
    const card = checkbox.closest('.equipment-card');
    
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

// Drag and drop functionality for logo upload
function setupDragAndDrop() {
    const uploadArea = document.getElementById('logo-upload-area');
    if (!uploadArea) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
    });
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) handleLogoFile(file);
    }
}

function handleLogoFile(file) {
    if (file.type.startsWith('image/')) {
        brewerySetup.handleLogoUpload({ target: { files: [file] } });
    }
}

// Add volume change listener to recalculate efficiency
document.addEventListener('DOMContentLoaded', () => {
    const volumeInput = document.getElementById('mash-volume');
    if (volumeInput) {
        volumeInput.addEventListener('input', () => {
            updateMashEfficiency(); // Recalculate when volume changes
        });
    }
    
    // Setup drag and drop
    setupDragAndDrop();
    
    // Add form validation styling
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    } else {
        clearValidation(e);
    }
}

function clearValidation(e) {
    const field = e.target;
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

// Global function for logo removal
function removeLogo() {
    if (window.brewerySetup) {
        window.brewerySetup.removeLogo();
    }
}

// Initialize brewery setup
const brewerySetup = new BrewerySetup();
window.brewerySetup = brewerySetup;