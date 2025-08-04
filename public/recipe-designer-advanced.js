// Advanced Features for BrewMetrics Recipe Designer
// Water chemistry, mash profiles, and hop optimization

class AdvancedBrewingCalculations {
  constructor(recipeDesigner) {
    this.recipeDesigner = recipeDesigner;
    this.waterProfiles = this.initWaterProfiles();
    this.mashSteps = [];
    this.init();
  }

  init() {
    this.setupWaterChemistry();
    this.setupMashProfiles();
    this.setupHopOptimization();
    this.setupStarterCalculations();
  }

  initWaterProfiles() {
    return {
      'balanced': {
        name: 'Balanced',
        calcium: [50, 150],
        sulfate: [50, 150],
        chloride: [50, 150],
        ratio: [1, 2]
      },
      'pale-ale': {
        name: 'Pale Ale (Burton-on-Trent)',
        calcium: [100, 300],
        sulfate: [200, 400],
        chloride: [50, 100],
        ratio: [2, 4]
      },
      'pilsner': {
        name: 'Pilsner (Pilsen)',
        calcium: [10, 50],
        sulfate: [5, 30],
        chloride: [5, 20],
        ratio: [1, 2]
      },
      'munich': {
        name: 'Munich Helles',
        calcium: [50, 100],
        sulfate: [10, 30],
        chloride: [2, 10],
        ratio: [2, 4]
      },
      'dublin': {
        name: 'Dublin Stout',
        calcium: [100, 200],
        sulfate: [50, 100],
        chloride: [50, 100],
        ratio: [1, 2]
      },
      'dortmund': {
        name: 'Dortmund Export',
        calcium: [200, 400],
        sulfate: [100, 200],
        chloride: [50, 100],
        ratio: [1.5, 3]
      }
    };
  }

  setupWaterChemistry() {
    // Water profile selector
    const styleSelector = document.getElementById('water-style-profile');
    if (styleSelector) {
      styleSelector.addEventListener('change', (e) => {
        this.updateWaterTargets(e.target.value);
      });
    }

    // Salt addition inputs
    ['gypsum', 'calcium-chloride', 'epsom-salt', 'table-salt'].forEach(salt => {
      const input = document.getElementById(salt);
      if (input) {
        input.addEventListener('input', () => this.calculateWaterProfile());
      }
    });

    // Source water inputs
    ['calcium', 'magnesium', 'sodium', 'chloride', 'sulfate', 'bicarbonate'].forEach(ion => {
      const input = document.getElementById(ion);
      if (input) {
        input.addEventListener('input', () => this.calculateWaterProfile());
      }
    });

    this.updateWaterTargets('balanced');
  }

  updateWaterTargets(profileKey) {
    const profile = this.waterProfiles[profileKey];
    if (!profile) return;

    const elements = {
      'selected-style': profile.name,
      'target-calcium': `${profile.calcium[0]}-${profile.calcium[1]} ppm`,
      'target-sulfate': `${profile.sulfate[0]}-${profile.sulfate[1]} ppm`,
      'target-chloride': `${profile.chloride[0]}-${profile.chloride[1]} ppm`,
      'target-ratio': `${profile.ratio[0]}:1 - ${profile.ratio[1]}:1`
    };

    Object.entries(elements).forEach(([id, text]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    });
  }

  calculateWaterProfile() {
    const getElementValue = (id) => {
      const element = document.getElementById(id);
      return element ? parseFloat(element.value) || 0 : 0;
    };

    const source = {
      calcium: getElementValue('calcium'),
      sulfate: getElementValue('sulfate'),
      chloride: getElementValue('chloride')
    };

    const salts = {
      gypsum: getElementValue('gypsum'),
      calciumChloride: getElementValue('calcium-chloride'),
      epsomSalt: getElementValue('epsom-salt'),
      tableSalt: getElementValue('table-salt')
    };

    const batchSize = this.recipeDesigner.recipe.batchSize || 5;
    const mashWaterQt = parseFloat(document.getElementById('strike-water')?.textContent) || 0;
    const totalWaterGal = mashWaterQt > 0 ? mashWaterQt / 4 : batchSize; // Use mash water if available, else batch size

    const additions = {
      calcium: (salts.gypsum * 61.5 + salts.calciumChloride * 72.0) / totalWaterGal,
      sulfate: (salts.gypsum * 147.4 + salts.epsomSalt * 103.0) / totalWaterGal,
      chloride: (salts.calciumChloride * 127.4 + salts.tableSalt * 160.4) / totalWaterGal
    };

    const final = {
      calcium: Math.round(source.calcium + additions.calcium),
      sulfate: Math.round(source.sulfate + additions.sulfate),
      chloride: Math.round(source.chloride + additions.chloride)
    };

    const ratio = final.chloride > 0 ? (final.sulfate / final.chloride).toFixed(1) : 'N/A';

    const results = {
      'result-calcium': `${final.calcium} ppm`,
      'result-sulfate': `${final.sulfate} ppm`,
      'result-chloride': `${final.chloride} ppm`,
      'result-ratio': `${ratio}:1`
    };

    Object.entries(results).forEach(([id, text]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    });
  }

  suggestWaterAdditions() {
    console.log('Suggesting water additions based on target profile...');
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        return element ? parseFloat(element.value) || 0 : 0;
    };

    const source = {
        calcium: getElementValue('calcium'),
        sulfate: getElementValue('sulfate'),
        chloride: getElementValue('chloride')
    };

    const target = {
        calcium: getElementValue('target-calcium-input'),
        sulfate: getElementValue('target-sulfate-input'),
        chloride: getElementValue('target-chloride-input')
    };

    // If targets are 0, do nothing.
    if (target.sulfate === 0 && target.chloride === 0) {
        return;
    }

    const batchSize = this.recipeDesigner.recipe.batchSize || 5;
    const mashWaterQt = parseFloat(document.getElementById('strike-water')?.textContent) || 0;
    const totalWaterGal = mashWaterQt > 0 ? mashWaterQt / 4 : batchSize; // Use mash water if available, else batch size

    // Deficits in ppm (mg/L)
    const sulfateDeficit = Math.max(0, target.sulfate - source.sulfate);
    const chlorideDeficit = Math.max(0, target.chloride - source.chloride);

    // Salt contributions (ppm per gram in 1 gallon)
    // Gypsum (CaSO4): 147.4 ppm SO4
    // Calcium Chloride (CaCl2): 127.4 ppm Cl
    
    // Grams = (Target Deficit ppm * Gallons) / ppm_per_gram_per_gallon
    let gypsumGrams = (sulfateDeficit * totalWaterGal) / 147.4;
    let calciumChlorideGrams = (chlorideDeficit * totalWaterGal) / 127.4;

    // Update the input fields with suggestions
    const gypsumInput = document.getElementById('gypsum');
    const calciumChlorideInput = document.getElementById('calcium-chloride');

    if (gypsumInput) gypsumInput.value = gypsumGrams > 0 ? gypsumGrams.toFixed(1) : '0';
    if (calciumChlorideInput) calciumChlorideInput.value = calciumChlorideGrams > 0 ? calciumChlorideGrams.toFixed(1) : '0';

    // After suggesting, recalculate the final profile to show the result
    this.calculateWaterProfile();
  }

  setupMashProfiles() {
    const addStepBtn = document.getElementById('add-mash-step');
    const mashTypeSelect = document.getElementById('mash-type-select');
  }

  setupMashProfiles() {
    const addStepBtn = document.getElementById('add-mash-step');
    const mashTypeSelect = document.getElementById('mash-type-select');
    
    if (addStepBtn) {
      addStepBtn.addEventListener('click', () => this.addMashStep());
    }

    if (mashTypeSelect) {
      mashTypeSelect.addEventListener('change', (e) => {
        this.loadMashTemplate(e.target.value);
      });
    }

    // Mash calculation inputs
    ['mash-ratio', 'grain-temp', 'tun-thermal-mass'].forEach(input => {
      const element = document.getElementById(input);
      if (element) {
        element.addEventListener('input', () => this.calculateMashWater());
      }
    });

    // Load default single infusion
    this.loadMashTemplate('single-infusion');
  }

  loadMashTemplate(type) {
    this.mashSteps = [];
    
    switch (type) {
      case 'single-infusion':
        this.mashSteps.push({
          name: 'Saccharification',
          temperature: 152,
          time: 60,
          type: 'infusion'
        });
        break;
      case 'step-mash':
        this.mashSteps.push(
          { name: 'Protein Rest', temperature: 122, time: 20, type: 'infusion' },
          { name: 'Saccharification', temperature: 152, time: 45, type: 'infusion' },
          { name: 'Mash Out', temperature: 168, time: 10, type: 'infusion' }
        );
        break;
      case 'decoction':
        this.mashSteps.push(
          { name: 'Acid Rest', temperature: 95, time: 15, type: 'infusion' },
          { name: 'Protein Rest', temperature: 122, time: 20, type: 'decoction' },
          { name: 'Saccharification', temperature: 152, time: 30, type: 'decoction' },
          { name: 'Mash Out', temperature: 168, time: 10, type: 'infusion' }
        );
        break;
      case 'hochkurz':
        this.mashSteps.push(
          { name: 'Saccharification', temperature: 148, time: 40, type: 'infusion' },
          { name: 'Mash Out', temperature: 168, time: 10, type: 'infusion' }
        );
        break;
    }

    this.renderMashSteps();
    this.calculateMashWater();
  }

  addMashStep() {
    const step = {
      name: 'Custom Step',
      temperature: 152,
      time: 30,
      type: 'infusion'
    };
    this.mashSteps.push(step);
    this.renderMashSteps();
  }

  renderMashSteps() {
    const container = document.getElementById('mash-steps-list');
    if (!container) return;

    container.innerHTML = '';

    this.mashSteps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'mash-step-item';
      stepElement.innerHTML = `
        <div class="mash-step-info">
          <div class="mash-step-name">${step.name}</div>
          <div class="mash-step-details">${step.temperature}°F for ${step.time} minutes (${step.type})</div>
        </div>
        <div class="mash-step-actions">
          <button class="btn-icon" onclick="advancedCalc.editMashStep(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="advancedCalc.removeMashStep(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      container.appendChild(stepElement);
    });

    this.drawMashChart();
  }

  editMashStep(index) {
    const step = this.mashSteps[index];
    const newTemp = prompt('Enter temperature (°F):', step.temperature);
    const newTime = prompt('Enter time (minutes):', step.time);
    
    if (newTemp && newTime) {
      this.mashSteps[index].temperature = parseFloat(newTemp);
      this.mashSteps[index].time = parseFloat(newTime);
      this.renderMashSteps();
      this.calculateMashWater();
    }
  }

  removeMashStep(index) {
    this.mashSteps.splice(index, 1);
    this.renderMashSteps();
    this.calculateMashWater();
  }

  calculateMashWater() {
    const grainWeight = this.recipeDesigner.recipe.fermentables.reduce((total, f) => total + (f.amount || 0), 0);
    const mashRatio = parseFloat(document.getElementById('mash-ratio')?.value) || 1.25;
    const grainTemp = parseFloat(document.getElementById('grain-temp')?.value) || 72;
    const tunThermalMass = parseFloat(document.getElementById('tun-thermal-mass')?.value) || 5;

    console.log('Calculating mash water:', { grainWeight, mashRatio, grainTemp, tunThermalMass });

    // Update grain weight display
    const grainWeightElement = document.getElementById('grain-weight');
    if (grainWeightElement) {
      grainWeightElement.value = grainWeight.toFixed(1);
    }

    // Calculate strike water (only if we have grain)
    const strikeWater = grainWeight > 0 ? grainWeight * mashRatio : 0;
    
    // Calculate strike temperature (first step)
    let strikeTemp = 152; // default
    if (this.mashSteps.length > 0) {
      const targetTemp = this.mashSteps[0].temperature;
      strikeTemp = ((0.2 / mashRatio) * (targetTemp - grainTemp)) + targetTemp + tunThermalMass;
    }

    // Calculate sparge water (simplified)
    const batchSize = this.recipeDesigner.recipe.batchSize;
    const spargeWater = (batchSize * 1.5) - (strikeWater / 4); // rough calculation

    // Update display
    const strikeWaterElement = document.getElementById('strike-water');
    const strikeTempElement = document.getElementById('strike-temp');
    const spargeWaterElement = document.getElementById('sparge-water');
    const totalWaterElement = document.getElementById('total-water');

    if (strikeWaterElement) strikeWaterElement.textContent = `${strikeWater.toFixed(1)} qt`;
    if (strikeTempElement) strikeTempElement.textContent = `${Math.round(strikeTemp)}°F`;
    if (spargeWaterElement) spargeWaterElement.textContent = `${spargeWater.toFixed(1)} gal`;
    if (totalWaterElement) totalWaterElement.textContent = `${(strikeWater/4 + spargeWater).toFixed(1)} gal`;
  }

  drawMashChart() {
    const canvas = document.getElementById('mash-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.mashSteps.length === 0) return;

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Calculate ranges
    const totalTime = this.mashSteps.reduce((total, step) => total + step.time, 0);
    const maxTemp = Math.max(...this.mashSteps.map(s => s.temperature)) + 10;
    const minTemp = Math.min(...this.mashSteps.map(s => s.temperature)) - 10;

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Draw mash profile
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let currentTime = 0;
    this.mashSteps.forEach((step, index) => {
      const x1 = padding + (currentTime / totalTime) * chartWidth;
      const x2 = padding + ((currentTime + step.time) / totalTime) * chartWidth;
      const y = padding + chartHeight - ((step.temperature - minTemp) / (maxTemp - minTemp)) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x1, y);
      } else {
        ctx.lineTo(x1, y);
      }
      ctx.lineTo(x2, y);

      // Add temperature labels
      ctx.fillStyle = '#2c3e50';
      ctx.font = '12px Arial';
      ctx.fillText(`${step.temperature}°F`, x1 + 5, y - 5);
      ctx.fillText(step.name, x1 + 5, y + 15);

      currentTime += step.time;
    });

    ctx.stroke();

    // Add axis labels
    ctx.fillStyle = '#6c757d';
    ctx.font = '14px Arial';
    ctx.fillText('Time (minutes)', canvas.width / 2 - 40, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Temperature (°F)', -40, 0);
    ctx.restore();
  }

  getWhirlpoolUtilization(temperatureF) {
    // Very simplified model for whirlpool hop utilization based on temperature.
    // Returns a Tinseth utilization factor.
    if (temperatureF >= 200) {
        return 0.10; // High end, near boiling
    } else if (temperatureF >= 180) {
        return 0.06; // Typical whirlpool range
    } else if (temperatureF >= 160) {
        return 0.03; // Low temp whirlpool / hop stand
    }
    return 0; // No significant isomerization below 160F
  }


  setupHopOptimization() {
    // This will be called when hops are added
    this.updateHopSchedule();
  }

  updateHopSchedule() {
    const tbody = document.getElementById('hop-schedule-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    let totalIBUs = 0;
    let bitteringIBUs = 0;
    let flavorIBUs = 0;
    let aromaIBUs = 0;

    this.recipeDesigner.recipe.hops.forEach((hop, index) => {
      // Add hop.use property if it doesn't exist for backward compatibility
      if (!hop.use) hop.use = 'Boil';

      let utilization = 0;
      let ibuContribution = 0;
      let useDisplay = `Boil: ${hop.time} min`;

      switch (hop.use) {
        case 'Boil':
            utilization = this.recipeDesigner.getHopUtilization(hop.time, this.recipeDesigner.calculations.og);
            ibuContribution = (hop.alpha * hop.amount * utilization * 7490) / (this.recipeDesigner.recipe.batchSize * 1.05);
            break;
        case 'Whirlpool':
            const whirlpoolTemp = hop.whirlpoolTemp || 185; // default temp
            utilization = this.getWhirlpoolUtilization(whirlpoolTemp);
            ibuContribution = (hop.alpha * hop.amount * utilization * 7490) / (this.recipeDesigner.recipe.batchSize * 1.05);
            useDisplay = `Whirlpool @ ${whirlpoolTemp}°F for ${hop.whirlpoolTime || 20} min`;
            break;
        case 'Dry Hop':
            utilization = 0;
            ibuContribution = 0;
            useDisplay = `Dry Hop: ${hop.contactTime || 4} days`;
            break;
        default:
            utilization = this.recipeDesigner.getHopUtilization(hop.time, this.recipeDesigner.calculations.og);
            ibuContribution = (hop.alpha * hop.amount * utilization * 7490) / (this.recipeDesigner.recipe.batchSize * 1.05);
            break;
      }

      totalIBUs += ibuContribution;

      // Categorize IBU contributions
      if (hop.use === 'Boil' && hop.time >= 45) bitteringIBUs += ibuContribution;
      else if (hop.use === 'Boil' && hop.time >= 15) flavorIBUs += ibuContribution;
      else aromaIBUs += ibuContribution; // Late boil (<15min) and Whirlpool hops

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${hop.name}</td>
        <td>${hop.amount.toFixed(2)} oz</td>
        <td>${useDisplay}</td>
        <td>${hop.alpha.toFixed(1)}%</td>
        <td>
          <div class="hop-utilization-bar">
            <div class="hop-utilization-fill" style="width: ${utilization * 100}%"></div>
          </div>
          ${(utilization * 100).toFixed(1)}%
        </td>
        <td>${ibuContribution.toFixed(1)}</td>
        <td>
          <button class="btn-icon" onclick="window.recipeDesigner.removeHop(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Update IBU breakdown
    const totalIbusElement = document.getElementById('total-ibus');
    const bitteringIbusElement = document.getElementById('bittering-ibus');
    const flavorIbusElement = document.getElementById('flavor-ibus');
    const aromaIbusElement = document.getElementById('aroma-ibus');

    if (totalIbusElement) totalIbusElement.textContent = totalIBUs.toFixed(1);
    if (bitteringIbusElement) bitteringIbusElement.textContent = bitteringIBUs.toFixed(1);
    if (flavorIbusElement) flavorIbusElement.textContent = flavorIBUs.toFixed(1);
    if (aromaIbusElement) aromaIbusElement.textContent = aromaIBUs.toFixed(1);

    this.generateHopSuggestions(totalIBUs, bitteringIBUs, flavorIBUs, aromaIBUs);
  }

  generateHopSuggestions(total, bittering, flavor, aroma) {
    const suggestions = document.getElementById('hop-suggestions');
    if (!suggestions) return;

    const bitteringRatio = total > 0 ? (bittering / total) * 100 : 0;
    const flavorRatio = total > 0 ? (flavor / total) * 100 : 0;
    const aromaRatio = total > 0 ? (aroma / total) * 100 : 0;

    let advice = [];

    if (bitteringRatio < 60 && total > 20) {
      advice.push('• Consider adding more bittering hops (45+ min) for better balance');
    }
    if (aromaRatio < 20 && total > 30) {
      advice.push('• Add late hop additions (< 15 min) for more aroma');
    }
    if (total > 80) {
      advice.push('• High IBU level - consider the beer style guidelines');
    }
    if (this.recipeDesigner.recipe.hops.length === 0) {
      advice.push('• Add hops to see optimization suggestions');
    }

    if (advice.length === 0) {
      advice.push('• Hop schedule looks well balanced!');
    }

    suggestions.innerHTML = `
      <h4><i class="fas fa-lightbulb"></i> Optimization Suggestions</h4>
      ${advice.map(a => `<p>${a}</p>`).join('')}
      <p><strong>Distribution:</strong> ${bitteringRatio.toFixed(0)}% Bittering, ${flavorRatio.toFixed(0)}% Flavor, ${aromaRatio.toFixed(0)}% Aroma</p>
    `;
  }

  setupStarterCalculations() {
    ['starter-gravity', 'starter-volume', 'yeast-viability'].forEach(input => {
      const element = document.getElementById(input);
      if (element) {
        element.addEventListener('input', () => this.calculateStarter());
      }
    });

    this.calculateStarter();
  }

  calculateStarter() {
    const og = this.recipeDesigner.calculations.og;
    const batchSize = this.recipeDesigner.recipe.batchSize;
    const viabilityElement = document.getElementById('yeast-viability');
    const viability = viabilityElement ? parseFloat(viabilityElement.value) || 85 : 85;
    
    // Calculate required cells (billion cells per liter per gravity point)
    const requiredCells = batchSize * 3.78541 * (og - 1) * 1000 * 0.75; // 0.75 million cells per mL per gravity point
    
    // Typical dry yeast package has ~20 billion cells at 100% viability
    const packageCells = 20 * (viability / 100);
    
    const starterNeeded = requiredCells > packageCells;
    const targetCells = Math.max(requiredCells, packageCells);
    
    // Starter calculations
    const starterVolumeElement = document.getElementById('starter-volume');
    const starterGravityElement = document.getElementById('starter-gravity');
    const starterVolume = starterVolumeElement ? parseFloat(starterVolumeElement.value) || 2.0 : 2.0;
    const starterGravity = starterGravityElement ? parseFloat(starterGravityElement.value) || 1.040 : 1.040;
    
    // DME needed (grams per liter for desired gravity)
    const dmePerLiter = (starterGravity - 1) * 1000 / 46; // Rough conversion
    const totalDME = dmePerLiter * starterVolume;
    
    const growthRate = starterNeeded ? 1.4 : 1.0;
    const steps = targetCells > (packageCells * 2) ? 2 : 1;

    // Update display
    const targetCellsElement = document.getElementById('target-cells');
    const dmeNeededElement = document.getElementById('dme-needed');
    const starterStepsElement = document.getElementById('starter-steps');
    const growthRateElement = document.getElementById('growth-rate');

    if (targetCellsElement) targetCellsElement.value = Math.round(targetCells);
    if (dmeNeededElement) dmeNeededElement.textContent = `${Math.round(totalDME)}g`;
    if (starterStepsElement) starterStepsElement.textContent = steps;
    if (growthRateElement) growthRateElement.textContent = `${growthRate.toFixed(1)}x`;
  }
}

// Extend the original RecipeDesigner class
class EnhancedRecipeDesigner extends RecipeDesigner {
  constructor() {
    super();
    this.advancedCalc = new AdvancedBrewingCalculations(this);
    this.currentRecipeId = null;

    // Make available globally for button callbacks
    window.advancedCalc = this.advancedCalc;

    // Event listeners for new save/load buttons
    const saveBtn = document.getElementById('save-recipe-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveRecipe());

    const loadBtn = document.getElementById('load-recipe-btn');
    if (loadBtn) loadBtn.addEventListener('click', () => this.showLoadRecipeModal());

    const closeLoadModalBtn = document.getElementById('close-load-modal');
    if (closeLoadModalBtn) closeLoadModalBtn.addEventListener('click', () => {
        document.getElementById('load-recipe-modal').classList.add('hidden');
    });
  }

  async initDesigner() {
      const urlParams = new URLSearchParams(window.location.search);
      const recipeId = urlParams.get('recipeId');
      if (recipeId) {
          console.log('Loading recipe from URL:', recipeId);
          // A short delay to ensure Firebase auth is ready
          setTimeout(async () => {
            if (window.auth && window.auth.currentUser) {
              await this.loadRecipe(recipeId);
            } else {
              // Wait for auth state to change if not ready
              const unsubscribe = window.auth.onAuthStateChanged(async user => {
                if (user) {
                  await this.loadRecipe(recipeId);
                  unsubscribe(); // Stop listening after we've loaded
                }
              });
            }
          }, 500);
      } else {
          console.log('Starting a new recipe.');
      }
  }

  async saveRecipe() {
      if (!window.auth || !window.auth.currentUser) {
          alert('You must be logged in to save a recipe.');
          return;
      }
      const userId = window.auth.currentUser.uid;
  
      // Collect all recipe data into one object
      const recipeToSave = {
          ...this.recipe,
          advanced: {
              waterProfile: {
                  source: {
                      calcium: parseFloat(document.getElementById('calcium')?.value) || 0,
                      magnesium: parseFloat(document.getElementById('magnesium')?.value) || 0,
                      sodium: parseFloat(document.getElementById('sodium')?.value) || 0,
                      chloride: parseFloat(document.getElementById('chloride')?.value) || 0,
                      sulfate: parseFloat(document.getElementById('sulfate')?.value) || 0,
                      bicarbonate: parseFloat(document.getElementById('bicarbonate')?.value) || 0,
                  },
                  targetStyle: document.getElementById('water-style-profile')?.value,
                  saltAdditions: {
                      gypsum: parseFloat(document.getElementById('gypsum')?.value) || 0,
                      calciumChloride: parseFloat(document.getElementById('calcium-chloride')?.value) || 0,
                      epsomSalt: parseFloat(document.getElementById('epsom-salt')?.value) || 0,
                      tableSalt: parseFloat(document.getElementById('table-salt')?.value) || 0,
                  }
              },
              mashProfile: {
                  type: document.getElementById('mash-type-select')?.value,
                  ratio: parseFloat(document.getElementById('mash-ratio')?.value) || 1.25,
                  grainTemp: parseFloat(document.getElementById('grain-temp')?.value) || 72,
                  tunThermalMass: parseFloat(document.getElementById('tun-thermal-mass')?.value) || 5,
                  steps: this.advancedCalc.mashSteps
              },
              starter: {
                  gravity: parseFloat(document.getElementById('starter-gravity')?.value) || 1.040,
                  volume: parseFloat(document.getElementById('starter-volume')?.value) || 2.0,
                  viability: parseFloat(document.getElementById('yeast-viability')?.value) || 85,
              }
          },
          notes: document.querySelector('#notes-section textarea')?.value || '',
          lastSaved: firebase.firestore.FieldValue.serverTimestamp(),
          calculations: this.calculations // Save the calculated stats too
      };
  
      try {
          const recipesRef = db.collection('breweries').doc(userId).collection('recipes');
          if (this.currentRecipeId) {
              // Update existing recipe
              await recipesRef.doc(this.currentRecipeId).update(recipeToSave);
              alert('Recipe updated successfully!');
              console.log('Recipe updated with ID:', this.currentRecipeId);
          } else {
              // Add new recipe
              const docRef = await recipesRef.add(recipeToSave);
              this.currentRecipeId = docRef.id; // Store the new ID
              alert('Recipe saved successfully!');
              console.log('Recipe saved with new ID:', this.currentRecipeId);
              
              // Update the URL to include the new recipeId for subsequent saves
              const newUrl = new URL(window.location);
              newUrl.searchParams.set('recipeId', this.currentRecipeId);
              window.history.pushState({ path: newUrl.href }, '', newUrl.href);
          }

          // Send recipe analytics to BigQuery
          await this.saveRecipeAnalytics(recipeToSave, userId);
          
      } catch (error) {
          console.error('Error saving recipe:', error);
          alert(`Failed to save recipe: ${error.message}. See console for details.`);
      }
  }

  async saveRecipeAnalytics(recipeData, userId) {
    try {
      if (!window.BrewMetricsAnalytics) {
        console.warn('Analytics not available, skipping recipe analytics');
        return;
      }

      // Prepare advanced recipe analytics data for BigQuery
      const recipeAnalyticsData = {
        recipe_id: this.currentRecipeId || `recipe_${Date.now()}`,
        brewery_id: userId, // Using user ID as brewery ID for now
        batch_id: `batch_${this.currentRecipeId || Date.now()}`,
        recipe_name: recipeData.name,
        beer_style: recipeData.style || 'Craft Beer',
        
        // Initial values - will be updated as feedback comes in
        average_rating: null,
        median_rating: null,
        rating_count: 0,
        
        // Taste profile averages (will be calculated from feedback)
        avg_sweetness: null,
        avg_acidity: null,
        avg_bitterness: null,
        avg_body: null,
        avg_carbonation: null,
        avg_malt_flavors: null,
        avg_hop_flavors: null,
        avg_finish: null,
        
        // Performance metrics
        high_ratings_count: 0,
        low_ratings_count: 0,
        google_reviews_generated: 0,
        
        // Recipe metadata
        batch_active: true,
        created_at: new Date().toISOString(),
        
        // Advanced recipe data
        abv: this.calculations.abv,
        ibu: this.calculations.ibus,
        og: this.calculations.og,
        fg: this.calculations.fg,
        
        // Advanced features analytics
        water_profile_used: recipeData.advanced?.waterProfile?.targetStyle || 'default',
        mash_type: recipeData.advanced?.mashProfile?.type || 'single-infusion',
        mash_steps_count: recipeData.advanced?.mashProfile?.steps?.length || 1,
        starter_used: Boolean(recipeData.advanced?.starter?.volume > 0)
      };

      // Submit to analytics
      console.log('Would submit advanced recipe analytics:', recipeAnalyticsData);
      
    } catch (error) {
      console.warn('Failed to submit recipe analytics:', error);
      // Don't block recipe saving if analytics fails
    }
  }

  addIngredient(type, button) {
    super.addIngredient(type, button);
    
    console.log('Enhanced: Ingredient added:', type, this.recipe[type === 'fermentable' ? 'fermentables' : type]);
    
    // Update advanced calculations when ingredients change
    setTimeout(() => {
      if (type === 'hops') {
        this.advancedCalc.updateHopSchedule();
      }
      if (type === 'fermentable') {
        this.advancedCalc.calculateMashWater();
        this.advancedCalc.calculateStarter();
      }
      // Always recalculate everything to ensure consistency
      this.advancedCalc.calculateStarter();
    }, 50); // Small delay to ensure DOM is updated
  }

  // Override to ensure advanced calculations update
  updateIngredientDisplay() {
    super.updateIngredientDisplay();
    
    // Trigger advanced calculations update
    if (this.advancedCalc) {
      setTimeout(() => {
        this.advancedCalc.calculateMashWater();
        this.advancedCalc.calculateStarter();
        this.advancedCalc.updateHopSchedule();
      }, 100);
    }
  }

  removeHop(index) {
    this.recipe.hops.splice(index, 1);
    this.calculateStats();
    this.advancedCalc.updateHopSchedule();
  }

  calculateStats() {
    super.calculateStats();
    
    // Update advanced features when stats change
    if (this.advancedCalc) {
      setTimeout(() => {
        this.advancedCalc.calculateStarter();
        this.advancedCalc.calculateMashWater();
        this.advancedCalc.updateHopSchedule();
      }, 10); // Very small delay to ensure calculations are complete
    }
  }
}

// Replace the original initialization - prevent double initialization
document.addEventListener('DOMContentLoaded', () => {
  if (!window.recipeDesigner) {
    window.recipeDesigner = new EnhancedRecipeDesigner();
  }
});
