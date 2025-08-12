// AI Recipe Generator UI
// Interactive conversational recipe generation interface

class AIRecipeGeneratorUI {
  constructor() {
    this.currentStep = 0;
    this.recipeData = {};
    this.conversation = [];
    this.isGenerating = false;
    
    this.beerStyles = [
      'IPA (India Pale Ale)',
      'West Coast IPA',
      'New England IPA (NEIPA)',
      'Double IPA (DIPA)',
      'Pale Ale',
      'American Pale Ale',
      'Stout',
      'Imperial Stout',
      'Porter',
      'Wheat Beer',
      'Hefeweizen',
      'Lager',
      'Pilsner',
      'Amber Ale',
      'Brown Ale',
      'Saison',
      'Belgian Ale',
      'Sour Beer',
      'Barleywine',
      'Other/Custom'
    ];
    
    this.init();
  }

  init() {
    this.createGeneratorButton();
    this.createRecipeModal();
    this.setupEventListeners();
  }

  createGeneratorButton() {
    // Find a good place to add the button - let's add it to the recipe designer
    const recipeDesigner = document.querySelector('.recipe-designer') || document.querySelector('.recipe-container') || document.body;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'ai-recipe-generator-container';
    buttonContainer.style.cssText = `
      margin: 20px 0;
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    `;
    
    buttonContainer.innerHTML = `
      <h3 style="color: white; margin: 0 0 15px 0; font-size: 1.4em;">🤖 AI Recipe Generator</h3>
      <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0; font-size: 1.1em;">
        Let our AI Brewmaster create a custom recipe just for you!
      </p>
      <button id="start-ai-recipe-generator" class="btn btn-primary" style="
        background: rgba(255,255,255,0.2);
        border: 2px solid white;
        color: white;
        font-size: 1.2em;
        padding: 12px 30px;
        border-radius: 25px;
        transition: all 0.3s ease;
        cursor: pointer;
      ">
        🍺 Generate My Recipe
      </button>
    `;
    
    // Add hover effect
    const button = buttonContainer.querySelector('#start-ai-recipe-generator');
    button.addEventListener('mouseenter', () => {
      button.style.background = 'white';
      button.style.color = '#667eea';
      button.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(255,255,255,0.2)';
      button.style.color = 'white';
      button.style.transform = 'translateY(0)';
    });
    
    recipeDesigner.insertBefore(buttonContainer, recipeDesigner.firstChild);
  }

  createRecipeModal() {
    const modal = document.createElement('div');
    modal.id = 'ai-recipe-modal';
    modal.className = 'ai-recipe-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
      <div class="ai-recipe-modal-content" style="
        background: white;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        position: relative;
      ">
        <button class="close-modal" style="
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        ">&times;</button>
        
        <div id="ai-recipe-header">
          <h2 style="margin: 0 0 20px 0; color: #333; text-align: center;">
            🤖 AI Brewmaster Recipe Generator
          </h2>
        </div>
        
        <div id="ai-recipe-content">
          <!-- Dynamic content will be inserted here -->
        </div>
        
        <div id="ai-recipe-actions" style="margin-top: 30px; text-align: center;">
          <!-- Action buttons will be inserted here -->
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  setupEventListeners() {
    // Start generator button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'start-ai-recipe-generator') {
        this.startRecipeGeneration();
      }
    });
    
    // Close modal
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-modal') || e.target.id === 'ai-recipe-modal') {
        this.closeModal();
      }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('ai-recipe-modal').style.display === 'flex') {
        this.closeModal();
      }
    });
  }

  startRecipeGeneration() {
    this.currentStep = 0;
    this.recipeData = {};
    this.conversation = [];
    this.showModal();
    this.showBeerStyleSelection();
  }

  showModal() {
    const modal = document.getElementById('ai-recipe-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('ai-recipe-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    this.resetGenerator();
  }

  resetGenerator() {
    this.currentStep = 0;
    this.recipeData = {};
    this.conversation = [];
    this.isGenerating = false;
  }

  showBeerStyleSelection() {
    const content = document.getElementById('ai-recipe-content');
    
    content.innerHTML = `
      <div class="conversation-step">
        <div class="ai-message" style="
          background: #f0f4ff;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          border-left: 4px solid #667eea;
        ">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <span style="font-size: 2em; margin-right: 10px;">🤖</span>
            <strong>AI Brewmaster:</strong>
          </div>
          <p>Hello! I'm excited to help you create the perfect beer recipe. Let's start by choosing what style of beer you'd like to brew.</p>
          <p>What type of beer are you in the mood to create?</p>
        </div>
        
        <div class="beer-style-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        ">
          ${this.beerStyles.map(style => `
            <button class="beer-style-btn" data-style="${style}" style="
              padding: 12px 16px;
              border: 2px solid #e0e0e0;
              background: white;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 14px;
              text-align: left;
            ">${style}</button>
          `).join('')}
        </div>
        
        <div style="margin-top: 20px;">
          <label for="custom-style" style="display: block; margin-bottom: 8px; font-weight: bold;">
            Or describe your own style:
          </label>
          <input type="text" id="custom-style" placeholder="e.g., Hoppy wheat beer with citrus notes..." style="
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
          ">
        </div>
      </div>
    `;
    
    this.updateActions(`
      <button id="continue-style-selection" class="btn btn-primary" disabled style="
        background: #667eea;
        color: white;
        padding: 12px 30px;
        border: none;
        border-radius: 25px;
        font-size: 16px;
        cursor: pointer;
        opacity: 0.5;
      ">Continue</button>
    `);
    
    this.setupBeerStyleHandlers();
  }

  setupBeerStyleHandlers() {
    const beerStyleBtns = document.querySelectorAll('.beer-style-btn');
    const customStyleInput = document.getElementById('custom-style');
    const continueBtn = document.getElementById('continue-style-selection');
    
    // Beer style button handlers
    beerStyleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove selection from other buttons
        beerStyleBtns.forEach(b => {
          b.style.background = 'white';
          b.style.borderColor = '#e0e0e0';
          b.style.color = '#333';
        });
        
        // Select this button
        btn.style.background = '#667eea';
        btn.style.borderColor = '#667eea';
        btn.style.color = 'white';
        
        // Clear custom input
        customStyleInput.value = '';
        
        // Store selection
        this.recipeData.beerStyle = btn.dataset.style;
        
        // Enable continue button
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
      });
      
      // Hover effects
      btn.addEventListener('mouseenter', () => {
        if (!btn.style.background || btn.style.background === 'white') {
          btn.style.background = '#f8f9ff';
          btn.style.borderColor = '#667eea';
        }
      });
      
      btn.addEventListener('mouseleave', () => {
        if (btn.style.background === 'rgb(248, 249, 255)') {
          btn.style.background = 'white';
          btn.style.borderColor = '#e0e0e0';
        }
      });
    });
    
    // Custom style input handler
    customStyleInput.addEventListener('input', () => {
      // Clear button selections
      beerStyleBtns.forEach(btn => {
        btn.style.background = 'white';
        btn.style.borderColor = '#e0e0e0';
        btn.style.color = '#333';
      });
      
      // Store custom style
      if (customStyleInput.value.trim()) {
        this.recipeData.beerStyle = customStyleInput.value.trim();
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
      } else {
        continueBtn.disabled = true;
        continueBtn.style.opacity = '0.5';
      }
    });
    
    // Continue button handler
    continueBtn.addEventListener('click', () => {
      if (this.recipeData.beerStyle) {
        this.askFollowUpQuestions();
      }
    });
  }

  async askFollowUpQuestions() {
    this.currentStep = 1;
    
    // Add user's selection to conversation
    this.conversation.push({
      type: 'user',
      message: `I want to brew a ${this.recipeData.beerStyle}`
    });
    
    const content = document.getElementById('ai-recipe-content');
    
    content.innerHTML = `
      <div class="conversation-history">
        ${this.renderConversation()}
      </div>
      
      <div class="ai-message" style="
        background: #f0f4ff;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
        border-left: 4px solid #667eea;
      ">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <span style="font-size: 2em; margin-right: 10px;">🤖</span>
          <strong>AI Brewmaster:</strong>
        </div>
        <div id="ai-questions">
          <p>Excellent choice! A ${this.recipeData.beerStyle} can be absolutely delicious. Let me ask a few questions to make this recipe perfect for you:</p>
          
          <div class="question-group" style="margin: 20px 0; padding: 15px; background: white; border-radius: 8px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">
              What batch size are you planning? (gallons)
            </label>
            <select id="batch-size" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <option value="1">1 gallon</option>
              <option value="2.5">2.5 gallons</option>
              <option value="5" selected>5 gallons</option>
              <option value="10">10 gallons</option>
              <option value="15">15 gallons</option>
            </select>
          </div>
          
          <div class="question-group" style="margin: 20px 0; padding: 15px; background: white; border-radius: 8px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">
              What's your experience level?
            </label>
            <select id="experience-level" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
              <option value="beginner">Beginner (1-5 batches)</option>
              <option value="intermediate" selected>Intermediate (6-20 batches)</option>
              <option value="advanced">Advanced (20+ batches)</option>
              <option value="professional">Professional brewer</option>
            </select>
          </div>
          
          <div class="question-group" style="margin: 20px 0; padding: 15px; background: white; border-radius: 8px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">
              Any specific characteristics you want? (optional)
            </label>
            <textarea id="special-requests" placeholder="e.g., Extra hoppy, lower alcohol, citrus flavors, chocolate notes, etc." style="
              width: 100%;
              height: 80px;
              padding: 10px;
              border: 2px solid #e0e0e0;
              border-radius: 6px;
              resize: vertical;
              font-family: inherit;
            "></textarea>
          </div>
        </div>
      </div>
    `;
    
    this.updateActions(`
      <button id="generate-recipe" class="btn btn-primary" style="
        background: #667eea;
        color: white;
        padding: 12px 30px;
        border: none;
        border-radius: 25px;
        font-size: 16px;
        cursor: pointer;
      ">🧙‍♂️ Generate My Recipe!</button>
    `);
    
    // Setup generate button handler
    document.getElementById('generate-recipe').addEventListener('click', () => {
      this.collectAnswersAndGenerate();
    });
  }

  async collectAnswersAndGenerate() {
    // Collect all answers
    this.recipeData.batchSize = parseFloat(document.getElementById('batch-size').value);
    this.recipeData.experienceLevel = document.getElementById('experience-level').value;
    this.recipeData.specialRequests = document.getElementById('special-requests').value.trim();
    
    // Add to conversation
    const userResponse = `Batch size: ${this.recipeData.batchSize} gallons, Experience: ${this.recipeData.experienceLevel}${this.recipeData.specialRequests ? `, Special requests: ${this.recipeData.specialRequests}` : ''}`;
    
    this.conversation.push({
      type: 'user', 
      message: userResponse
    });
    
    await this.generateRecipe();
  }

  async generateRecipe() {
    this.isGenerating = true;
    
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="conversation-history">
        ${this.renderConversation()}
      </div>
      
      <div class="ai-message" style="
        background: #f0f4ff;
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #667eea;
        text-align: center;
      ">
        <div style="font-size: 3em; margin-bottom: 15px;">🧙‍♂️</div>
        <h3>Creating Your Perfect Recipe...</h3>
        <div class="loading-spinner" style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        "></div>
        <p>The AI Brewmaster is crafting something special just for you!</p>
      </div>
    `;
    
    this.updateActions('');
    
    // Add CSS animation
    if (!document.querySelector('#loading-spinner-css')) {
      const style = document.createElement('style');
      style.id = 'loading-spinner-css';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    try {
      // Generate the recipe using AI Brewmaster
      const response = await window.AIBrewmaster.generateRecipe(this.recipeData.beerStyle, {
        batchSize: this.recipeData.batchSize,
        experienceLevel: this.recipeData.experienceLevel,
        specialRequests: this.recipeData.specialRequests
      });
      
      // Store original recipe for revert functionality
      this.originalRecipe = JSON.parse(JSON.stringify(response.recipe));
      
      this.showGeneratedRecipe(response);
    } catch (error) {
      console.error('Error generating recipe:', error);
      this.showError('Sorry, there was an error generating your recipe. Please try again.');
    }
  }

  showGeneratedRecipe(response) {
    this.conversation.push({
      type: 'ai',
      message: 'Perfect! I\'ve created a custom recipe just for you. Here\'s what I came up with:'
    });
    
    const content = document.getElementById('ai-recipe-content');
    
    content.innerHTML = `
      <div class="conversation-history">
        ${this.renderConversation()}
      </div>
      
      <div class="generated-recipe" style="
        background: #f8fff8;
        border: 2px solid #4caf50;
        border-radius: 12px;
        padding: 25px;
        margin: 20px 0;
      ">
        <h3 style="color: #2e7d32; margin: 0 0 20px 0; text-align: center;">
          🍺 ${response.recipe.name}
        </h3>
        
        <div class="recipe-stats" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
          padding: 15px;
          background: white;
          border-radius: 8px;
        ">
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #666; font-size: 12px;">BATCH SIZE</div>
            <div style="font-size: 18px; color: #333;">${response.recipe.batchSize} gal</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #666; font-size: 12px;">TARGET OG</div>
            <div style="font-size: 18px; color: #333;">${response.recipe.targetOG}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #666; font-size: 12px;">TARGET ABV</div>
            <div style="font-size: 18px; color: #333;">${response.recipe.targetABV}%</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #666; font-size: 12px;">TARGET IBU</div>
            <div style="font-size: 18px; color: #333;">${response.recipe.targetIBU}</div>
          </div>
        </div>
        
        <div class="recipe-ingredients">
          <h4 style="color: #2e7d32; margin-bottom: 10px;">📦 Ingredients:</h4>
          
          <div style="margin-bottom: 15px;">
            <strong>Fermentables:</strong>
            <ul style="margin: 5px 0;">
              ${response.recipe.fermentables.map(f => `<li>${f.amount} ${f.unit} ${f.name}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Hops:</strong>
            <ul style="margin: 5px 0;">
              ${response.recipe.hops.map(h => `<li>${h.amount} ${h.unit} ${h.name} - ${h.time} min ${h.use}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Yeast:</strong>
            <ul style="margin: 5px 0;">
              ${response.recipe.yeast.map(y => `<li>${y.amount} ${y.unit} ${y.name}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="ai-notes" style="
          background: #e8f5e8;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        ">
          <strong>🤖 AI Brewmaster Notes:</strong>
          <p style="margin: 10px 0 0 0;">${response.summary.substring(0, 200)}...</p>
        </div>
      </div>
    `;
    
    this.updateActions(`
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <button id="load-into-designer" class="btn btn-primary" style="
          background: #4caf50;
          color: white;
          padding: 12px 25px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
        ">📋 Load into Designer</button>
        
        <button id="download-recipe" class="btn btn-secondary" style="
          background: #667eea;
          color: white;
          padding: 12px 25px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
        ">📄 Download Recipe</button>
        
        <button id="print-recipe" class="btn btn-secondary" style="
          background: #ff9800;
          color: white;
          padding: 12px 25px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
        ">🖨️ Print Recipe</button>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px;">
        <button id="scale-recipe" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">⚖️ Scale Recipe</button>
        
        <button id="adjust-gravity" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">🎯 Adjust Gravity</button>
        
        <button id="adjust-bitterness" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">🍺 Adjust Bitterness</button>
        
        <button id="adjust-color" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">🎨 Adjust Color</button>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px;">
        <button id="brew-steps" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">📋 Brew Steps</button>
        
        <button id="recipe-tutorial" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">🎓 Tutorial</button>
        
        <button id="set-as-default" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">⭐ Set as Default</button>
        
        <button id="start-over" class="btn btn-outline" style="
          background: transparent;
          color: #666;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">🔄 Start Over</button>
      </div>
    `);
    
    // Store the response for action handlers
    this.currentRecipeResponse = response;
    
    // Setup action handlers
    this.setupRecipeActionHandlers(response);
    
    this.isGenerating = false;
  }

  setupRecipeActionHandlers(response) {
    // Primary actions
    document.getElementById('load-into-designer').addEventListener('click', async () => {
      try {
        const success = await window.AIBrewmaster.loadRecipeIntoDesigner(response.recipe);
        if (success) {
          this.showSuccess('Recipe loaded into designer successfully!');
          setTimeout(() => this.closeModal(), 2000);
        } else {
          this.showError('Error loading recipe into designer.');
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        this.showError('Error loading recipe into designer.');
      }
    });
    
    document.getElementById('download-recipe').addEventListener('click', () => {
      window.AIBrewmaster.exportRecipeDocument(response.recipe, response.instructions);
    });

    document.getElementById('print-recipe').addEventListener('click', () => {
      window.AIBrewmaster.printRecipe(response.recipe, true);
    });
    
    // Recipe modification actions
    document.getElementById('scale-recipe').addEventListener('click', () => {
      this.showScaleRecipeDialog(response.recipe);
    });
    
    document.getElementById('adjust-gravity').addEventListener('click', () => {
      this.showAdjustGravityDialog(response.recipe);
    });
    
    document.getElementById('adjust-bitterness').addEventListener('click', () => {
      this.showAdjustBitternessDialog(response.recipe);
    });
    
    document.getElementById('adjust-color').addEventListener('click', () => {
      this.showAdjustColorDialog(response.recipe);
    });
    
    // Information and learning actions
    document.getElementById('brew-steps').addEventListener('click', () => {
      this.showBrewSteps(response.recipe);
    });
    
    document.getElementById('recipe-tutorial').addEventListener('click', () => {
      this.showRecipeTutorial(response.recipe);
    });
    
    document.getElementById('set-as-default').addEventListener('click', async () => {
      const result = await window.AIBrewmaster.setAsDefault(response.recipe);
      if (result.success) {
        this.showSuccess(result.message);
      } else {
        this.showError(result.message);
      }
    });
    
    document.getElementById('start-over').addEventListener('click', () => {
      this.startRecipeGeneration();
    });
    
    this.isGenerating = false;
  }

  // Recipe modification dialogs
  showScaleRecipeDialog(recipe) {
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="recipe-adjustment-dialog">
        <h3>⚖️ Scale Recipe</h3>
        <p>Current batch size: <strong>${recipe.batchSize} gallons</strong></p>
        
        <div style="margin: 20px 0;">
          <label for="new-batch-size" style="display: block; margin-bottom: 10px;">New batch size (gallons):</label>
          <input type="number" id="new-batch-size" value="${recipe.batchSize}" min="0.5" max="50" step="0.5" style="
            width: 200px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          ">
        </div>
        
        <div style="margin-top: 20px;">
          <button id="apply-scaling" class="btn btn-primary" style="margin-right: 10px;">Apply Scaling</button>
          <button id="cancel-scaling" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    `;

    document.getElementById('apply-scaling').addEventListener('click', async () => {
      const newSize = parseFloat(document.getElementById('new-batch-size').value);
      if (newSize && newSize !== recipe.batchSize) {
        try {
          const result = await window.AIBrewmaster.scaleRecipe(recipe, newSize);
          this.showAdjustmentResult('Scale Recipe', result);
        } catch (error) {
          console.error('Error scaling recipe:', error);
          this.showError('Error scaling recipe. Please try again.');
        }
      }
    });

    document.getElementById('cancel-scaling').addEventListener('click', () => {
      this.showGeneratedRecipe({ recipe, instructions: {} });
    });
  }

  showAdjustGravityDialog(recipe) {
    const currentOG = window.AIBrewmaster.calculateOG(recipe);
    
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="recipe-adjustment-dialog">
        <h3>🎯 Adjust Gravity</h3>
        <p>Current OG: <strong>${currentOG.toFixed(3)}</strong></p>
        
        <div style="margin: 20px 0;">
          <label for="target-og" style="display: block; margin-bottom: 10px;">Target OG:</label>
          <input type="number" id="target-og" value="${currentOG.toFixed(3)}" min="1.020" max="1.120" step="0.001" style="
            width: 200px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          ">
        </div>
        
        <div style="margin-top: 20px;">
          <button id="apply-gravity" class="btn btn-primary" style="margin-right: 10px;">Apply Adjustment</button>
          <button id="cancel-gravity" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    `;

    document.getElementById('apply-gravity').addEventListener('click', async () => {
      const targetOG = parseFloat(document.getElementById('target-og').value);
      if (targetOG && Math.abs(targetOG - currentOG) > 0.002) {
        try {
          const result = await window.AIBrewmaster.adjustGravity(recipe, targetOG);
          this.showAdjustmentResult('Adjust Gravity', result);
        } catch (error) {
          console.error('Error adjusting gravity:', error);
          this.showError('Error adjusting gravity. Please try again.');
        }
      }
    });

    document.getElementById('cancel-gravity').addEventListener('click', () => {
      this.showGeneratedRecipe({ recipe, instructions: {} });
    });
  }

  showAdjustBitternessDialog(recipe) {
    const currentIBU = window.AIBrewmaster.calculateIBU(recipe);
    
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="recipe-adjustment-dialog">
        <h3>🍺 Adjust Bitterness</h3>
        <p>Current IBU: <strong>${currentIBU.toFixed(1)}</strong></p>
        
        <div style="margin: 20px 0;">
          <label for="target-ibu" style="display: block; margin-bottom: 10px;">Target IBU:</label>
          <input type="number" id="target-ibu" value="${currentIBU.toFixed(1)}" min="5" max="120" step="1" style="
            width: 200px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          ">
        </div>
        
        <div style="margin-top: 20px;">
          <button id="apply-bitterness" class="btn btn-primary" style="margin-right: 10px;">Apply Adjustment</button>
          <button id="cancel-bitterness" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    `;

    document.getElementById('apply-bitterness').addEventListener('click', async () => {
      const targetIBU = parseFloat(document.getElementById('target-ibu').value);
      if (targetIBU && Math.abs(targetIBU - currentIBU) > 2) {
        try {
          const result = await window.AIBrewmaster.adjustBitterness(recipe, targetIBU);
          this.showAdjustmentResult('Adjust Bitterness', result);
        } catch (error) {
          console.error('Error adjusting bitterness:', error);
          this.showError('Error adjusting bitterness. Please try again.');
        }
      }
    });

    document.getElementById('cancel-bitterness').addEventListener('click', () => {
      this.showGeneratedRecipe({ recipe, instructions: {} });
    });
  }

  showAdjustColorDialog(recipe) {
    const currentSRM = window.AIBrewmaster.calculateSRM(recipe);
    
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="recipe-adjustment-dialog">
        <h3>🎨 Adjust Color</h3>
        <p>Current SRM: <strong>${currentSRM.toFixed(1)} (${window.AIBrewmaster.getSRMColorName(currentSRM)})</strong></p>
        
        <div style="margin: 20px 0;">
          <label for="target-srm" style="display: block; margin-bottom: 10px;">Target SRM:</label>
          <input type="number" id="target-srm" value="${currentSRM.toFixed(1)}" min="1" max="40" step="0.5" style="
            width: 200px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          ">
          <div style="font-size: 12px; color: #666; margin-top: 5px;">
            1-3: Pale, 4-6: Gold, 7-9: Amber, 10-14: Copper, 15-18: Brown, 19+: Dark
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <button id="apply-color" class="btn btn-primary" style="margin-right: 10px;">Apply Adjustment</button>
          <button id="cancel-color" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    `;

    document.getElementById('apply-color').addEventListener('click', async () => {
      const targetSRM = parseFloat(document.getElementById('target-srm').value);
      if (targetSRM && Math.abs(targetSRM - currentSRM) > 1) {
        try {
          const result = await window.AIBrewmaster.adjustColor(recipe, targetSRM);
          this.showAdjustmentResult('Adjust Color', result);
        } catch (error) {
          console.error('Error adjusting color:', error);
          this.showError('Error adjusting color. Please try again.');
        }
      }
    });

    document.getElementById('cancel-color').addEventListener('click', () => {
      this.showGeneratedRecipe({ recipe, instructions: {} });
    });
  }

  showAdjustmentResult(title, result) {
    if (result.error) {
      this.showError(result.error);
      return;
    }

    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="adjustment-result">
        <h3>✅ ${title} Complete</h3>
        
        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>🤖 AI Brewmaster Advice:</h4>
          <div style="white-space: pre-line; line-height: 1.6;">${result.advice}</div>
        </div>
        
        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Summary:</strong> ${result.summary}
        </div>
        
        <div style="margin-top: 20px;">
          <button id="accept-changes" class="btn btn-primary" style="margin-right: 10px;">Accept Changes</button>
          <button id="reject-changes" class="btn btn-secondary">Revert</button>
        </div>
      </div>
    `;

    document.getElementById('accept-changes').addEventListener('click', () => {
      // Update the current recipe response
      this.currentRecipeResponse.recipe = result.recipe;
      this.showGeneratedRecipe(this.currentRecipeResponse);
    });

    document.getElementById('reject-changes').addEventListener('click', () => {
      this.showGeneratedRecipe(this.currentRecipeResponse);
    });
  }

  showBrewSteps(recipe) {
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="brew-steps-loading" style="text-align: center; padding: 40px;">
        <h3>📋 Generating Detailed Brew Steps...</h3>
        <div class="loading-spinner" style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        "></div>
      </div>
    `;

    window.AIBrewmaster.generateBrewSteps(recipe).then(result => {
      content.innerHTML = `
        <div class="brew-steps-guide">
          <h3>📋 ${result.steps.overview}</h3>
          
          <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Estimated Time:</strong> ${result.steps.estimatedTime}<br>
            <strong>Difficulty:</strong> ${result.steps.difficulty}
          </div>
          
          ${result.steps.sections.map(section => `
            <div style="margin: 25px 0; border-left: 4px solid #667eea; padding-left: 20px;">
              <h4>${section.title}</h4>
              <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Duration: ${section.duration}</div>
              <ol style="line-height: 1.8;">
                ${section.steps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          `).join('')}
          
          <div style="margin-top: 30px;">
            <button id="back-to-recipe" class="btn btn-primary">← Back to Recipe</button>
          </div>
        </div>
      `;

      document.getElementById('back-to-recipe').addEventListener('click', () => {
        this.showGeneratedRecipe({ recipe, instructions: {} });
      });
    });
  }

  showRecipeTutorial(recipe) {
    try {
      const tutorial = window.AIBrewmaster.generateRecipeTutorial(recipe);
    
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div class="recipe-tutorial">
        <h3>${tutorial.title}</h3>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Difficulty:</strong> ${tutorial.difficulty}<br>
          <strong>Time Commitment:</strong> ${tutorial.estimatedTime}
        </div>
        
        ${tutorial.sections.map(section => `
          <div style="margin: 25px 0; border-left: 4px solid #ff9800; padding-left: 20px;">
            <h4>${section.title}</h4>
            ${Array.isArray(section.content) 
              ? `<ul style="line-height: 1.8;">${section.content.map(item => `<li>${item}</li>`).join('')}</ul>`
              : `<p style="line-height: 1.6;">${section.content}</p>`
            }
          </div>
        `).join('')}
        
        <div style="margin-top: 30px;">
          <button id="back-to-recipe" class="btn btn-primary">← Back to Recipe</button>
        </div>
      </div>
    `;

      document.getElementById('back-to-recipe').addEventListener('click', () => {
        this.showGeneratedRecipe(this.currentRecipeResponse);
      });
    } catch (error) {
      console.error('Error generating tutorial:', error);
      this.showError('Error generating tutorial. Please try again.');
    }
  }

  renderConversation() {
    return this.conversation.map(msg => {
      if (msg.type === 'user') {
        return `
          <div class="user-message" style="
            text-align: right;
            margin: 15px 0;
          ">
            <div style="
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 18px;
              border-radius: 18px 18px 4px 18px;
              max-width: 70%;
              text-align: left;
            ">
              ${msg.message}
            </div>
          </div>
        `;
      } else {
        return `
          <div class="ai-message-simple" style="
            text-align: left;
            margin: 15px 0;
          ">
            <div style="
              display: inline-block;
              background: #f0f4ff;
              color: #333;
              padding: 12px 18px;
              border-radius: 18px 18px 18px 4px;
              max-width: 70%;
              border-left: 4px solid #667eea;
            ">
              <strong>🤖 AI Brewmaster:</strong> ${msg.message}
            </div>
          </div>
        `;
      }
    }).join('');
  }

  updateActions(html) {
    document.getElementById('ai-recipe-actions').innerHTML = html;
  }

  showSuccess(message) {
    const content = document.getElementById('ai-recipe-content');
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 1001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 3000);
  }

  showError(message) {
    const content = document.getElementById('ai-recipe-content');
    content.innerHTML = `
      <div style="
        background: #ffebee;
        border: 2px solid #f44336;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        color: #c62828;
      ">
        <h3>❌ Oops!</h3>
        <p>${message}</p>
        <button onclick="this.closest('.ai-recipe-modal').style.display='none'" style="
          background: #f44336;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 15px;
        ">Close</button>
      </div>
    `;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.AIRecipeGeneratorUI = new AIRecipeGeneratorUI();
});
