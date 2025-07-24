// BrewMetrics Recipe Designer
// Professional brewing recipe design interface

class RecipeDesigner {
  constructor() {
    this.recipe = {
      name: 'New Recipe',
      type: 'All Grain',
      brewer: '',
      batchSize: 5.00,
      efficiency: 72.00,
      boilTime: 60,
      style: '',
      fermentables: [],
      hops: [],
      yeast: [],
      misc: [],
      water: [],
      mash: {},
      fermentation: {},
      notes: ''
    };

    this.calculations = {
      og: 1.000,
      fg: 1.000,
      ibus: 0,
      srm: 0,
      abv: 0,
      bitterness_ratio: 0
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    
    // Force initial calculation after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.calculateStats();
      this.updateDisplay();
      console.log('Initial calculations completed');
    }, 100);
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.recipe-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Form inputs with proper calculation triggers
    const recipeNameInput = document.getElementById('recipe-name');
    if (recipeNameInput) {
      recipeNameInput.addEventListener('input', (e) => {
        this.recipe.name = e.target.value;
        this.updateTitle();
      });
    }

    const batchVolInput = document.getElementById('batch-vol');
    if (batchVolInput) {
      batchVolInput.addEventListener('input', (e) => {
        this.recipe.batchSize = parseFloat(e.target.value) || 5.0;
        this.calculateStats();
        this.updateDisplay();
      });
    }

    const efficiencyInput = document.getElementById('efficiency');
    if (efficiencyInput) {
      efficiencyInput.addEventListener('input', (e) => {
        this.recipe.efficiency = parseFloat(e.target.value) || 72.0;
        this.calculateStats();
        this.updateDisplay();
      });
    }

    const boilTimeInput = document.getElementById('boil-time');
    if (boilTimeInput) {
      boilTimeInput.addEventListener('input', (e) => {
        this.recipe.boilTime = parseInt(e.target.value) || 60;
        this.calculateStats();
        this.updateDisplay();
      });
    }

    // Style selector
    const beerStyleSelect = document.getElementById('beer-style');
    if (beerStyleSelect) {
      beerStyleSelect.addEventListener('change', (e) => {
        this.recipe.style = e.target.value;
        this.updateStyleGuidelines();
        console.log('Style changed to:', e.target.value);
      });
    }

    // Recipe type selector
    const recipeTypeSelect = document.getElementById('recipe-type');
    if (recipeTypeSelect) {
      recipeTypeSelect.addEventListener('change', (e) => {
        this.recipe.type = e.target.value;
        this.calculateStats();
        this.updateDisplay();
      });
    }

    const brewerInput = document.getElementById('brewer');
    if (brewerInput) {
      brewerInput.addEventListener('input', (e) => {
        this.recipe.brewer = e.target.value;
      });
    }

    // Additional form inputs that should trigger calculations
    ['pre-boil', 'version'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => {
          this.calculateStats();
          this.updateDisplay();
        });
      }
    });

    // Quick add buttons
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        if (type) {
          this.showAddIngredientModal(type);
        }
      });
    });

    // Fixed sliders with proper event handling
    document.querySelectorAll('.slider').forEach((slider, index) => {
      // Initialize slider first
      this.initializeSlider(slider, index);
      
      slider.addEventListener('input', (e) => {
        this.handleSliderChange(e, index);
      });
      
      // Also handle change event for better compatibility
      slider.addEventListener('change', (e) => {
        this.handleSliderChange(e, index);
      });
    });

    // Save/Cancel buttons
    const saveBtn = document.querySelector('.btn-success');
    const cancelBtn = document.querySelector('.btn-danger');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveRecipe());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.cancelRecipe());
  }

  switchTab(tabName) {
    // Update tab appearance
    document.querySelectorAll('.recipe-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Update section visibility
    document.querySelectorAll('.recipe-section').forEach(section => {
      section.classList.remove('active');
    });
    const activeSection = document.getElementById(`${tabName}-section`);
    if (activeSection) activeSection.classList.add('active');
  }

  updateTitle() {
    const titleElement = document.querySelector('.recipe-title');
    if (titleElement) titleElement.textContent = this.recipe.name;
  }

  calculateStats() {
    console.log('Calculating stats with recipe:', this.recipe);
    
    // Calculate Original Gravity
    this.calculations.og = this.calculateOG();
    
    // Calculate IBUs
    this.calculations.ibus = this.calculateIBUs();
    
    // Calculate SRM (Color)
    this.calculations.srm = this.calculateSRM();
    
    // Calculate Final Gravity (needs OG first)
    this.calculations.fg = this.calculateFG();
    
    // Calculate ABV (needs OG and FG)
    this.calculations.abv = this.calculateABV();
    
    // Calculate Bitterness Ratio
    if (this.calculations.og > 1.000) {
      this.calculations.bitterness_ratio = this.calculations.ibus / ((this.calculations.og - 1) * 1000);
    } else {
      this.calculations.bitterness_ratio = 0;
    }

    console.log('Calculated stats:', this.calculations);
    
    // Always update display after calculations
    this.updateDisplay();
  }

  calculateOG() {
    if (this.recipe.fermentables.length === 0) return 1.000;
    
    let totalPoints = 0;
    this.recipe.fermentables.forEach(fermentable => {
      const points = (fermentable.yield * fermentable.amount * this.recipe.efficiency / 100) / this.recipe.batchSize;
      totalPoints += points;
    });
    
    console.log('OG Calculation:', { 
      fermentablesCount: this.recipe.fermentables.length, 
      totalPoints, 
      efficiency: this.recipe.efficiency,
      batchSize: this.recipe.batchSize,
      og: 1 + (totalPoints / 1000)
    });
    
    return 1 + (totalPoints / 1000);
  }

  calculateFG() {
    if (this.calculations.og <= 1.000) return 1.000;
    
    // Simple attenuation calculation (75% typical for ale yeast)
    const attenuation = 0.75;
    const points = (this.calculations.og - 1) * 1000;
    const residualPoints = points * (1 - attenuation);
    
    return 1 + (residualPoints / 1000);
  }

  calculateIBUs() {
    if (this.recipe.hops.length === 0) return 0;
    
    let totalIBUs = 0;
    this.recipe.hops.forEach(hop => {
      // Simplified IBU calculation (Tinseth formula approximation)
      const utilization = this.getHopUtilization(hop.time, this.calculations.og);
      const ibus = (hop.alpha * hop.amount * utilization * 7490) / (this.recipe.batchSize * 1.05);
      totalIBUs += ibus;
    });
    
    return Math.round(totalIBUs * 10) / 10;
  }

  calculateSRM() {
    if (this.recipe.fermentables.length === 0) return 0;
    
    let mcu = 0;
    this.recipe.fermentables.forEach(fermentable => {
      mcu += (fermentable.color * fermentable.amount) / this.recipe.batchSize;
    });
    
    // Morey equation for SRM
    return Math.round((1.4922 * Math.pow(mcu, 0.6859)) * 10) / 10;
  }

  calculateABV() {
    if (this.calculations.og <= 1.000 || this.calculations.fg <= 1.000) return 0;
    
    // Simple ABV calculation
    return Math.round(((this.calculations.og - this.calculations.fg) * 131.25) * 10) / 10;
  }

  getHopUtilization(boilTime, gravity) {
    // Simplified Tinseth utilization formula
    const gravityFactor = 1.65 * Math.pow(0.000125, gravity - 1);
    const timeFactor = (1 - Math.exp(-0.04 * boilTime)) / 4.15;
    return gravityFactor * timeFactor;
  }

  updateDisplay() {
    console.log('Updating display with calculations:', this.calculations);
    
    // Update brewing statistics (main stats cards)
    const ogElement = document.getElementById('estimated-og');
    const ibusElement = document.getElementById('estimated-ibus');
    const colorElement = document.getElementById('estimated-color');
    const abvElement = document.getElementById('estimated-abv');

    if (ogElement) ogElement.textContent = this.calculations.og.toFixed(3);
    if (ibusElement) ibusElement.textContent = this.calculations.ibus.toFixed(1);
    if (colorElement) colorElement.textContent = this.calculations.srm.toFixed(1);
    if (abvElement) abvElement.textContent = this.calculations.abv.toFixed(1);

    // Update sidebar analysis calculations
    this.updateSidebarAnalysis();

    // Update sliders to reflect current recipe values
    this.updateSliders();

    // Update progress bars based on style guidelines
    this.updateProgressBars();
  }

  updateSidebarAnalysis() {
    // Calculate derived statistics for sidebar
    const totalFermentableWeight = this.recipe.fermentables.reduce((total, f) => total + (f.amount || 0), 0);
    const totalHopWeight = this.recipe.hops.reduce((total, h) => total + (h.amount || 0), 0);
    const estimatedCost = (totalFermentableWeight * 2.50) + (totalHopWeight * 15.00); // Rough cost estimates

    // Find sidebar elements by more specific selectors
    const sidebarInputs = document.querySelectorAll('.recipe-sidebar input[readonly]');
    
    sidebarInputs.forEach(input => {
      const label = input.previousElementSibling;
      if (!label) return;
      
      const labelText = label.textContent.toLowerCase();
      
      if (labelText.includes('bitter ratio')) {
        input.value = `${this.calculations.bitterness_ratio.toFixed(3)} BU:SG`;
      } else if (labelText.includes('est fg')) {
        input.value = `${this.calculations.fg.toFixed(3)} SG`;
      } else if (labelText.includes('hops per bbl')) {
        const hopsPerBbl = totalHopWeight > 0 ? (totalHopWeight / 16) / (this.recipe.batchSize / 31) : 0;
        input.value = `${hopsPerBbl.toFixed(2)} lb/bbl`;
      } else if (labelText.includes('tot hops')) {
        input.value = `${totalHopWeight.toFixed(2)} oz`;
      } else if (labelText.includes('fermentables')) {
        input.value = `${totalFermentableWeight.toFixed(1)} lb`;
      } else if (labelText.includes('tot cost')) {
        input.value = `$${estimatedCost.toFixed(2)}`;
      }
    });

    console.log('Sidebar updated:', { 
      totalFermentableWeight, 
      totalHopWeight, 
      estimatedCost,
      bitterRatio: this.calculations.bitterness_ratio,
      fg: this.calculations.fg
    });
  }

  updateSliders() {
    // Update slider values to reflect current recipe calculations
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach((slider, index) => {
      let value, displayValue;
      
      switch(index) {
        case 0: // OG slider
          value = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), this.calculations.og));
          displayValue = this.calculations.og.toFixed(3);
          break;
        case 1: // IBU slider
          value = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), this.calculations.ibus));
          displayValue = this.calculations.ibus.toFixed(1);
          break;
        case 2: // SRM slider
          value = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), this.calculations.srm));
          displayValue = this.calculations.srm.toFixed(1);
          break;
        case 3: // ABV slider
          value = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), this.calculations.abv));
          displayValue = this.calculations.abv.toFixed(1);
          break;
        default:
          return;
      }
      
      slider.value = value;
      this.updateSliderDisplay(slider, displayValue);
      this.updateProgressBar(slider, index);
    });
  }

  updateSliderDisplay(slider, value) {
    const container = slider.closest('.slider-container');
    if (!container) return;
    
    const label = container.querySelector('label');
    if (!label) return;
    
    // Create or update value display
    let valueSpan = label.querySelector('.current-value');
    if (!valueSpan) {
      valueSpan = document.createElement('span');
      valueSpan.className = 'current-value';
      valueSpan.style.cssText = 'float: right; font-weight: bold; color: #007bff; margin-left: 10px;';
      label.appendChild(valueSpan);
    }
    valueSpan.textContent = value;
  }

  updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach((slider, index) => {
      if (!progressBars[index]) return;
      
      const value = parseFloat(slider.value) || 0;
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
      
      progressBars[index].style.width = `${percentage}%`;
      
      // Color coding based on style guidelines
      const guidelines = this.getStyleGuidelines();
      if (guidelines) {
        const color = this.getProgressBarColor(index, value, guidelines);
        progressBars[index].style.background = color;
      }
    });
  }

  getStyleGuidelines() {
    const styleGuidelines = {
      // American Ales
      'American Amber Ale': { og: [1.045, 1.060], ibus: [25, 40], srm: [10, 17], abv: [4.5, 6.2] },
      'American IPA': { og: [1.056, 1.070], ibus: [40, 70], srm: [6, 14], abv: [5.5, 7.5] },
      'American Pale Ale': { og: [1.045, 1.060], ibus: [30, 50], srm: [5, 10], abv: [4.5, 6.2] },
      'American Wheat': { og: [1.040, 1.055], ibus: [15, 30], srm: [3, 6], abv: [4.0, 5.5] },
      'American Brown Ale': { og: [1.045, 1.060], ibus: [20, 30], srm: [18, 35], abv: [4.3, 6.2] },
      'American Porter': { og: [1.050, 1.070], ibus: [25, 50], srm: [22, 40], abv: [4.8, 6.5] },
      'American Stout': { og: [1.050, 1.075], ibus: [35, 75], srm: [30, 40], abv: [5.0, 9.0] },
      'Imperial IPA': { og: [1.070, 1.090], ibus: [60, 120], srm: [6, 14], abv: [7.5, 10.0] },
      'Imperial Stout': { og: [1.075, 1.115], ibus: [50, 90], srm: [30, 40], abv: [8.0, 12.0] },
      
      // English Ales
      'English Bitter': { og: [1.030, 1.050], ibus: [20, 50], srm: [4, 14], abv: [3.0, 5.0] },
      'English IPA': { og: [1.050, 1.075], ibus: [40, 60], srm: [6, 14], abv: [5.0, 7.5] },
      'English Brown Ale': { og: [1.040, 1.052], ibus: [20, 30], srm: [12, 22], abv: [4.2, 5.4] },
      'English Porter': { og: [1.040, 1.052], ibus: [18, 35], srm: [20, 30], abv: [4.0, 5.4] },
      'English Barleywine': { og: [1.080, 1.120], ibus: [35, 70], srm: [8, 22], abv: [8.0, 12.0] },
      
      // German Lagers
      'German Pilsner': { og: [1.044, 1.050], ibus: [25, 45], srm: [2, 5], abv: [4.4, 5.2] },
      'Munich Helles': { og: [1.044, 1.048], ibus: [16, 22], srm: [3, 5], abv: [4.7, 5.4] },
      'Märzen': { og: [1.054, 1.060], ibus: [18, 24], srm: [8, 17], abv: [5.2, 6.0] },
      'German Wheat': { og: [1.044, 1.052], ibus: [8, 15], srm: [2, 6], abv: [4.3, 5.6] },
      'Maibock': { og: [1.064, 1.072], ibus: [23, 35], srm: [6, 11], abv: [6.3, 7.4] },
      'Doppelbock': { og: [1.072, 1.112], ibus: [16, 26], srm: [6, 25], abv: [7.0, 10.0] },
      
      // Belgian Styles
      'Belgian Witbier': { og: [1.044, 1.052], ibus: [10, 20], srm: [2, 4], abv: [4.5, 5.5] },
      'Belgian Pale Ale': { og: [1.048, 1.054], ibus: [20, 30], srm: [8, 14], abv: [4.8, 5.5] },
      'Belgian Dubbel': { og: [1.062, 1.075], ibus: [15, 25], srm: [10, 17], abv: [6.0, 7.6] },
      'Belgian Tripel': { og: [1.075, 1.085], ibus: [20, 40], srm: [4, 7], abv: [7.5, 9.5] },
      'Belgian Quadrupel': { og: [1.075, 1.110], ibus: [20, 50], srm: [12, 22], abv: [9.0, 12.0] },
      'Saison': { og: [1.048, 1.065], ibus: [20, 35], srm: [5, 14], abv: [5.0, 7.0] },
      
      // Czech Styles
      'Czech Pilsner': { og: [1.044, 1.060], ibus: [30, 45], srm: [3, 6], abv: [4.2, 5.8] },
      'Czech Dark Lager': { og: [1.044, 1.056], ibus: [18, 34], srm: [14, 35], abv: [4.4, 5.8] },
      
      // Other Lagers
      'Vienna Lager': { og: [1.048, 1.055], ibus: [18, 30], srm: [10, 16], abv: [4.7, 5.5] },
      'Schwarzbier': { og: [1.046, 1.052], ibus: [20, 30], srm: [17, 30], abv: [4.4, 5.4] },
      'California Common': { og: [1.048, 1.054], ibus: [30, 45], srm: [10, 14], abv: [4.5, 5.5] },
      
      // Specialty Styles
      'Cream Ale': { og: [1.042, 1.055], ibus: [8, 20], srm: [2, 5], abv: [4.2, 5.6] },
      'Kölsch': { og: [1.044, 1.050], ibus: [20, 30], srm: [3, 5], abv: [4.4, 5.2] },
      'Altbier': { og: [1.044, 1.052], ibus: [25, 50], srm: [11, 17], abv: [4.3, 5.5] },
      'Irish Red Ale': { og: [1.044, 1.060], ibus: [17, 28], srm: [9, 18], abv: [4.0, 6.0] },
      'Scottish Ale': { og: [1.030, 1.050], ibus: [10, 25], srm: [9, 17], abv: [2.5, 5.2] },
      
      // Sour Styles
      'Berliner Weisse': { og: [1.028, 1.032], ibus: [3, 8], srm: [2, 3], abv: [2.8, 3.8] },
      'Gose': { og: [1.036, 1.056], ibus: [5, 12], srm: [3, 4], abv: [4.2, 4.8] },
      'Lambic': { og: [1.040, 1.054], ibus: [0, 10], srm: [3, 7], abv: [5.0, 6.5] },
      
      // Strong Ales
      'Old Ale': { og: [1.060, 1.090], ibus: [30, 60], srm: [10, 22], abv: [6.0, 9.0] },
      'Scotch Ale': { og: [1.070, 1.130], ibus: [17, 35], srm: [14, 25], abv: [6.5, 10.0] },
      'Baltic Porter': { og: [1.060, 1.090], ibus: [20, 40], srm: [17, 30], abv: [6.5, 9.5] }
    };
    return styleGuidelines[this.recipe.style] || null;
  }

  updateStyleGuidelines() {
    const guidelines = this.getStyleGuidelines();
    if (!guidelines) return;
    
    const rangeLabels = document.querySelectorAll('.range-labels span');
    if (rangeLabels[0]) rangeLabels[0].textContent = `${guidelines.og[0].toFixed(3)} - ${guidelines.og[1].toFixed(3)} SG`;
    if (rangeLabels[1]) rangeLabels[1].textContent = `${guidelines.ibus[0]} - ${guidelines.ibus[1]} IBUs`;
    if (rangeLabels[2]) rangeLabels[2].textContent = `${guidelines.srm[0]} - ${guidelines.srm[1]} SRM`;
    if (rangeLabels[3]) rangeLabels[3].textContent = `${guidelines.abv[0]} - ${guidelines.abv[1]}% ABV`;
    
    this.updateProgressBars();
  }

  getProgressBarColor(sliderIndex, value, guidelines) {
    const ranges = [guidelines.og, guidelines.ibus, guidelines.srm, guidelines.abv];
    const range = ranges[sliderIndex];
    if (!range) return 'linear-gradient(90deg, #ffd700, #ff8c00)';
    
    if (value >= range[0] && value <= range[1]) {
      return 'linear-gradient(90deg, #28a745, #20c997)'; // Green - in range
    } else if (value < range[0] * 0.8 || value > range[1] * 1.2) {
      return 'linear-gradient(90deg, #dc3545, #c82333)'; // Red - way off
    } else {
      return 'linear-gradient(90deg, #ffc107, #e0a800)'; // Yellow - close
    }
  }

  initializeSlider(slider, index) {
    const configs = [
      { min: 1.000, max: 1.120, step: 0.001, value: 1.045 }, // OG
      { min: 0, max: 100, step: 1, value: 30 },              // IBU
      { min: 0, max: 40, step: 0.1, value: 11 },             // SRM
      { min: 0, max: 15, step: 0.1, value: 4.5 }             // ABV
    ];
    
    const config = configs[index];
    if (!config) return;
    
    slider.min = config.min;
    slider.max = config.max;
    slider.step = config.step;
    slider.value = config.value;
    
    // Initialize display
    this.updateSliderDisplay(slider, config.value.toString());
    this.updateProgressBar(slider, index);
  }

  handleSliderChange(event, sliderIndex) {
    const slider = event.target;
    const value = parseFloat(slider.value);
    
    let displayValue;
    switch(sliderIndex) {
      case 0: displayValue = value.toFixed(3); break;
      case 1: displayValue = value.toFixed(1); break;
      case 2: displayValue = value.toFixed(1); break;
      case 3: displayValue = value.toFixed(1); break;
      default: displayValue = value.toString();
    }
    
    this.updateSliderDisplay(slider, displayValue);
    this.updateProgressBar(slider, sliderIndex);
    
    const guidelines = this.getStyleGuidelines();
    if (guidelines) {
      const progressBar = document.querySelectorAll('.progress-fill')[sliderIndex];
      if (progressBar) {
        progressBar.style.background = this.getProgressBarColor(sliderIndex, value, guidelines);
      }
    }
  }

  updateProgressBar(slider, index) {
    const progressBars = document.querySelectorAll('.progress-fill');
    if (progressBars[index]) {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const value = parseFloat(slider.value);
      const percentage = ((value - min) / (max - min)) * 100;
      
      progressBars[index].style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
  }

  showAddIngredientModal(type) {
    // Create modal for adding ingredients
    const modal = this.createIngredientModal(type);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  }

  createIngredientModal(type) {
    const modal = document.createElement('div');
    modal.className = 'ingredient-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const databases = {
      fermentable: [
        { name: 'Pale 2-Row', yield: 81, color: 2 },
        { name: 'Munich Malt', yield: 80, color: 9 },
        { name: 'Crystal 60L', yield: 74, color: 60 },
        { name: 'Chocolate Malt', yield: 70, color: 350 }
      ],
      hops: [
        { name: 'Cascade', alpha: 5.5, type: 'Aroma' },
        { name: 'Centennial', alpha: 10.0, type: 'Dual Purpose' },
        { name: 'Citra', alpha: 12.0, type: 'Aroma' },
        { name: 'Columbus', alpha: 14.0, type: 'Bittering' }
      ],
      yeast: [
        { name: 'Safale US-05', type: 'Ale', attenuation: 81 },
        { name: 'Wyeast 1056', type: 'Ale', attenuation: 77 },
        { name: 'Lallemand Verdant IPA', type: 'Ale', attenuation: 75 }
      ]
    };

    const items = databases[type] || [];
    
    modal.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; width: 90%;">
        <h3>Add ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        <div style="margin: 15px 0;">
          <label>Select ${type}:</label>
          <select id="ingredient-select" style="width: 100%; padding: 8px; margin-top: 5px;">
            ${items.map(item => `<option value="${item.name}">${item.name}</option>`).join('')}
          </select>
        </div>
        <div style="margin: 15px 0;">
          <label>Amount:</label>
          <input type="number" id="ingredient-amount" step="0.01" value="1.0" style="width: 100%; padding: 8px; margin-top: 5px;">
          <small>lbs for fermentables, oz for hops</small>
        </div>
        ${type === 'hops' ? `
          <div style="margin: 15px 0;">
            <label>Boil Time (minutes):</label>
            <input type="number" id="hop-time" value="60" style="width: 100%; padding: 8px; margin-top: 5px;">
          </div>
        ` : ''}
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button onclick="this.closest('.ingredient-modal').remove()" style="flex: 1; padding: 10px; background: #ccc; border: none; border-radius: 4px;">Cancel</button>
          <button onclick="window.recipeDesigner.addIngredient('${type}', this)" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px;">Add</button>
        </div>
      </div>
    `;

    return modal;
  }

  addIngredient(type, button) {
    const modal = button.closest('.ingredient-modal');
    const name = modal.querySelector('#ingredient-select').value;
    const amount = parseFloat(modal.querySelector('#ingredient-amount').value) || 0;
    
    if (amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    
    const ingredient = { name, amount };
    
    if (type === 'fermentable') {
      // Add fermentable properties
      const database = [
        { name: 'Pale 2-Row', yield: 81, color: 2 },
        { name: 'Munich Malt', yield: 80, color: 9 },
        { name: 'Crystal 60L', yield: 74, color: 60 },
        { name: 'Chocolate Malt', yield: 70, color: 350 }
      ];
      const fermentableData = database.find(f => f.name === name);
      if (fermentableData) {
        ingredient.yield = fermentableData.yield;
        ingredient.color = fermentableData.color;
      } else {
        // Default values if not found
        ingredient.yield = 80;
        ingredient.color = 10;
      }
      this.recipe.fermentables.push(ingredient);
      console.log('Added fermentable:', ingredient);
    } else if (type === 'hops') {
      const timeInput = modal.querySelector('#hop-time');
      const time = timeInput ? parseInt(timeInput.value) || 60 : 60;
      const database = [
        { name: 'Cascade', alpha: 5.5 },
        { name: 'Centennial', alpha: 10.0 },
        { name: 'Citra', alpha: 12.0 },
        { name: 'Columbus', alpha: 14.0 }
      ];
      const hopData = database.find(h => h.name === name);
      if (hopData) {
        ingredient.alpha = hopData.alpha;
      } else {
        // Default alpha if not found
        ingredient.alpha = 8.0;
      }
      ingredient.time = time;
      this.recipe.hops.push(ingredient);
      console.log('Added hop:', ingredient);
    } else if (type === 'yeast') {
      this.recipe.yeast.push(ingredient);
      console.log('Added yeast:', ingredient);
    }

    modal.remove();
    
    // Critical: Trigger calculations and display updates
    this.calculateStats();
    this.updateIngredientDisplay();
    
    console.log('Recipe after adding ingredient:', this.recipe);
  }

  updateIngredientDisplay() {
    this.updateFermentablesList();
    this.updateHopsList();
    this.updateYeastList();
    
    // Ensure calculations are updated after ingredient changes
    this.calculateStats();
  }

  updateFermentablesList() {
    const container = document.getElementById('fermentables-list');
    if (!container) return;

    if (this.recipe.fermentables.length === 0) {
      container.innerHTML = '<div class="ingredient-item" style="color: #6c757d; font-style: italic; text-align: center; padding: 20px;">No fermentables added yet</div>';
      return;
    }

    container.innerHTML = '';
    this.recipe.fermentables.forEach((fermentable, index) => {
      const item = document.createElement('div');
      item.className = 'ingredient-item';
      item.innerHTML = `
        <div class="ingredient-info">
          <div class="ingredient-name">${fermentable.name}</div>
          <div class="ingredient-details">${fermentable.amount} lbs - ${fermentable.yield}% yield - ${fermentable.color} SRM</div>
        </div>
        <div class="ingredient-actions">
          <button class="btn-icon" onclick="window.recipeDesigner.editIngredient('fermentable', ${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="window.recipeDesigner.removeIngredient('fermentable', ${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      container.appendChild(item);
    });
  }

  updateHopsList() {
    const container = document.getElementById('hops-list');
    if (!container) return;

    if (this.recipe.hops.length === 0) {
      container.innerHTML = '<div class="ingredient-item" style="color: #6c757d; font-style: italic; text-align: center; padding: 20px;">No hops added yet</div>';
      return;
    }

    container.innerHTML = '';
    this.recipe.hops.forEach((hop, index) => {
      const item = document.createElement('div');
      item.className = 'ingredient-item';
      item.innerHTML = `
        <div class="ingredient-info">
          <div class="ingredient-name">${hop.name}</div>
          <div class="ingredient-details">${hop.amount} oz - ${hop.alpha}% AA - ${hop.time} min</div>
        </div>
        <div class="ingredient-actions">
          <button class="btn-icon" onclick="window.recipeDesigner.editIngredient('hops', ${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="window.recipeDesigner.removeIngredient('hops', ${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      container.appendChild(item);
    });
  }

  updateYeastList() {
    const container = document.getElementById('yeast-list');
    if (!container) return;

    if (this.recipe.yeast.length === 0) {
      container.innerHTML = '<div class="ingredient-item" style="color: #6c757d; font-style: italic; text-align: center; padding: 20px;">No yeast added yet</div>';
      return;
    }

    container.innerHTML = '';
    this.recipe.yeast.forEach((yeast, index) => {
      const item = document.createElement('div');
      item.className = 'ingredient-item';
      item.innerHTML = `
        <div class="ingredient-info">
          <div class="ingredient-name">${yeast.name}</div>
          <div class="ingredient-details">${yeast.amount} pkg - Ale yeast</div>
        </div>
        <div class="ingredient-actions">
          <button class="btn-icon" onclick="window.recipeDesigner.removeIngredient('yeast', ${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      container.appendChild(item);
    });
  }

  editIngredient(type, index) {
    // Allow editing of existing ingredients
    const ingredient = this.recipe[type === 'fermentable' ? 'fermentables' : type][index];
    if (!ingredient) return;

    if (type === 'fermentable') {
      const newAmount = prompt('Enter amount (lbs):', ingredient.amount);
      if (newAmount && !isNaN(newAmount)) {
        ingredient.amount = parseFloat(newAmount);
        this.updateIngredientDisplay();
      }
    } else if (type === 'hops') {
      const newAmount = prompt('Enter amount (oz):', ingredient.amount);
      const newTime = prompt('Enter boil time (minutes):', ingredient.time);
      if (newAmount && !isNaN(newAmount)) ingredient.amount = parseFloat(newAmount);
      if (newTime && !isNaN(newTime)) ingredient.time = parseInt(newTime);
      this.updateIngredientDisplay();
    }
  }

  removeIngredient(type, index) {
    if (type === 'fermentable') {
      this.recipe.fermentables.splice(index, 1);
    } else if (type === 'hops') {
      this.recipe.hops.splice(index, 1);
    } else if (type === 'yeast') {
      this.recipe.yeast.splice(index, 1);
    }
    this.updateIngredientDisplay();
  }

  saveRecipe() {
    // Convert recipe to batch format compatible with existing system
    const batch = {
      beerName: this.recipe.name,
      beerIntro: `${this.recipe.style || 'Craft Beer'} - ${this.recipe.batchSize} gallon batch`,
      abv: this.calculations.abv,
      ibu: Math.round(this.calculations.ibus),
      batchCode: `${this.recipe.name.replace(/\s+/g, '').toUpperCase()}-001`,
      packagedDate: new Date().toISOString().split('T')[0],
      
      // Enhanced recipe data
      recipeData: {
        ...this.recipe,
        calculations: this.calculations,
        createdWith: 'recipe-designer',
        version: '1.0'
      }
    };

    // In a real implementation, this would save to Firebase
    console.log('Saving recipe as batch:', batch);
    
    // For now, show success message and redirect
    alert('Recipe saved successfully! Redirecting to dashboard...');
    window.location.href = 'dashboard.html';
  }

  cancelRecipe() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      window.location.href = 'dashboard.html';
    }
  }
}

// Initialize recipe designer when DOM is loaded - only if enhanced version not loaded
document.addEventListener('DOMContentLoaded', () => {
  if (!window.recipeDesigner) {
    window.recipeDesigner = new RecipeDesigner();
  }
});
