// AI Brewmaster UI Components
// Interactive interface for brewing assistance

class AIBrewmasterUI {
  constructor(containerId = 'ai-brewmaster-container') {
    this.containerId = containerId;
    this.isOpen = false;
    this.conversationHistory = [];
    
    this.init();
  }

  init() {
    this.createUI();
    this.attachEventListeners();
    
    // Wait for AI Brewmaster to be ready
    this.waitForAI();
  }

  async waitForAI() {
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkAI = () => {
      if (window.AIBrewmaster && window.AIBrewmaster.isInitialized) {
        this.ai = window.AIBrewmaster;
        this.enableUI();
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkAI, 100);
      } else {
        this.showError('AI Brewmaster failed to initialize');
      }
    };
    
    checkAI();
  }

  createUI() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`AI Brewmaster container ${this.containerId} not found`);
      return;
    }

    container.innerHTML = `
      <div class="ai-brewmaster-widget">
        <!-- AI Assistant Toggle Button -->
        <button id="ai-toggle-btn" class="ai-toggle-button" title="Ask AI Brewmaster">
          <i class="fas fa-robot"></i>
          <span class="ai-status-indicator" id="ai-status"></span>
        </button>

        <!-- AI Chat Panel -->
        <div id="ai-chat-panel" class="ai-chat-panel hidden">
          <div class="ai-chat-header">
            <h3><i class="fas fa-robot"></i> AI Brewmaster</h3>
            <button id="ai-close-btn" class="ai-close-button">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="ai-chat-content">
            <div id="ai-conversation" class="ai-conversation">
              <div class="ai-message ai-message-system">
                <div class="ai-avatar">🍺</div>
                <div class="ai-text">
                  Hey there, fellow brewer! I'm your AI Brewmaster with 25+ years of brewing experience. 
                  Whether you're crafting your first batch or perfecting a flagship recipe, I'm here to help!
                  <br><br>
                  <strong>What I bring to the brewhouse:</strong> Professional brewing expertise, troubleshooting wisdom, 
                  recipe formulation, and that passion we all share for great beer. Plus, I work offline!
                  <br><br>
                  What's brewing today? Let's make something exceptional together.
                </div>
              </div>
            </div>

            <div class="ai-quick-actions">
              <button class="ai-quick-btn" data-action="generate-recipe">
                🧪 Generate Recipe
              </button>
              <button class="ai-quick-btn" data-action="enhance-recipe">
                ⭐ Enhance Recipe
              </button>
              <button class="ai-quick-btn" data-action="experimental-recipe">
                🚀 Experimental Recipe
              </button>
              <button class="ai-quick-btn" data-action="analyze-batch">
                📊 Analyze Batch
              </button>
              <button class="ai-quick-btn" data-action="troubleshoot-batch">
                🔧 Troubleshoot Batch
              </button>
              <button class="ai-quick-btn" data-action="inventory-recipe">
                📦 Use My Inventory
              </button>
            </div>

            <div class="ai-input-area">
              <input 
                type="text" 
                id="ai-query-input" 
                placeholder="Ask me about brewing..."
                maxlength="500"
              >
              <button id="ai-send-btn" class="ai-send-button" disabled>
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <div id="ai-loading" class="ai-loading hidden">
            <div class="ai-spinner"></div>
            <span>Consulting brewing knowledge...</span>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
  }

  addStyles() {
    if (document.getElementById('ai-brewmaster-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'ai-brewmaster-styles';
    styles.textContent = `
      .ai-brewmaster-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: 'Open Sans', sans-serif;
      }

      .ai-toggle-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .ai-toggle-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 25px rgba(255, 107, 53, 0.4);
      }

      .ai-status-indicator {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #4CAF50;
        border: 2px solid white;
        animation: pulse 2s infinite;
      }

      .ai-status-indicator.offline {
        background: #f44336;
        animation: none;
      }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }

      .ai-chat-panel {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 500px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid #e0e0e0;
      }

      .ai-chat-panel.hidden {
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
      }

      .ai-chat-header {
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ai-chat-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .ai-close-button {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: background 0.2s;
      }

      .ai-close-button:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .ai-chat-content {
        height: calc(100% - 60px);
        display: flex;
        flex-direction: column;
      }

      .ai-conversation {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        scroll-behavior: smooth;
      }

      .ai-message {
        display: flex;
        margin-bottom: 15px;
        animation: slideInUp 0.3s ease;
      }

      .ai-message-user {
        flex-direction: row-reverse;
      }

      .ai-message-user .ai-text {
        background: #ff6b35;
        color: white;
        margin-left: 0;
        margin-right: 10px;
      }

      .ai-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        background: #f0f0f0;
        flex-shrink: 0;
      }

      .ai-text {
        background: #f5f5f5;
        padding: 12px 16px;
        border-radius: 18px;
        max-width: 280px;
        margin-left: 10px;
        line-height: 1.4;
        font-size: 14px;
      }

      .ai-suggestions {
        margin-top: 10px;
      }

      .ai-suggestion-btn {
        display: inline-block;
        background: #e3f2fd;
        color: #1976d2;
        padding: 6px 12px;
        margin: 4px 4px 4px 0;
        border: 1px solid #bbdefb;
        border-radius: 15px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .ai-suggestion-btn:hover {
        background: #bbdefb;
      }

      .ai-quick-actions {
        padding: 15px 20px 10px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .ai-quick-btn {
        flex: 1;
        min-width: 80px;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 20px;
        background: white;
        color: #666;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .ai-quick-btn:hover {
        background: #f5f5f5;
        border-color: #ff6b35;
        color: #ff6b35;
      }

      .ai-input-area {
        padding: 15px 20px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .ai-input-area input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 25px;
        outline: none;
        font-size: 14px;
      }

      .ai-input-area input:focus {
        border-color: #ff6b35;
        box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
      }

      .ai-send-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #ff6b35;
        border: none;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ai-send-button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .ai-send-button:not(:disabled):hover {
        background: #e55a2b;
        transform: scale(1.05);
      }

      .ai-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
      }

      .ai-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #ff6b35;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 480px) {
        .ai-chat-panel {
          width: calc(100vw - 20px);
          height: 80vh;
          bottom: 90px;
          right: 10px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  attachEventListeners() {
    // Toggle panel
    document.getElementById('ai-toggle-btn').addEventListener('click', () => {
      this.togglePanel();
    });

    // Close panel
    document.getElementById('ai-close-btn').addEventListener('click', () => {
      this.closePanel();
    });

    // Send message
    document.getElementById('ai-send-btn').addEventListener('click', () => {
      this.sendMessage();
    });

    // Enter key to send
    document.getElementById('ai-query-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Enable/disable send button
    document.getElementById('ai-query-input').addEventListener('input', (e) => {
      const sendBtn = document.getElementById('ai-send-btn');
      sendBtn.disabled = !e.target.value.trim();
    });

    // Quick actions
    document.querySelectorAll('.ai-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleQuickAction(e.target.dataset.action);
      });
    });
  }

  togglePanel() {
    const panel = document.getElementById('ai-chat-panel');
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  }

  closePanel() {
    const panel = document.getElementById('ai-chat-panel');
    panel.classList.add('hidden');
    this.isOpen = false;
  }

  async sendMessage() {
    const input = document.getElementById('ai-query-input');
    const query = input.value.trim();
    
    if (!query || !this.ai) return;

    // Clear input
    input.value = '';
    document.getElementById('ai-send-btn').disabled = true;

    // Add user message to conversation
    this.addMessage('user', query);

    // Show loading
    this.showLoading(true);

    try {
      // Get recipe context if available
      const context = this.getRecipeContext();
      
      // Get AI response
      const response = await this.ai.getBrewingAdvice(query, context);
      
      // Add AI response to conversation
      this.addMessage('ai', response.summary, response.suggestions);
      
    } catch (error) {
      console.error('AI Brewmaster error:', error);
      this.addMessage('ai', "I'm having trouble accessing my brewing knowledge right now. Please try again in a moment.", []);
    } finally {
      this.showLoading(false);
    }
  }

  addMessage(type, text, suggestions = []) {
    const conversation = document.getElementById('ai-conversation');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `ai-message ai-message-${type}`;
    
    const avatar = type === 'user' ? '👤' : '🍺';
    const suggestionsHtml = suggestions.length > 0 ? 
      `<div class="ai-suggestions">
        ${suggestions.map(s => `<span class="ai-suggestion-btn" onclick="document.getElementById('ai-query-input').value='${s}'; document.getElementById('ai-send-btn').disabled=false;">${s}</span>`).join('')}
      </div>` : '';
    
    messageDiv.innerHTML = `
      <div class="ai-avatar">${avatar}</div>
      <div class="ai-text">
        ${text}
        ${suggestionsHtml}
      </div>
    `;
    
    conversation.appendChild(messageDiv);
    conversation.scrollTop = conversation.scrollHeight;
    
    // Store in conversation history
    this.conversationHistory.push({ type, text, suggestions, timestamp: Date.now() });
  }

  showLoading(show) {
    const loading = document.getElementById('ai-loading');
    if (show) {
      loading.classList.remove('hidden');
    } else {
      loading.classList.add('hidden');
    }
  }

  async handleQuickAction(action) {
    const context = this.getRecipeContext();
    
    // Initialize AI functions if not available
    if (!this.aiFunctions && window.AIBrewmasterFunctions && this.ai) {
      this.aiFunctions = new window.AIBrewmasterFunctions(this.ai);
    }
    
    // Show loading
    this.showLoading(true);
    
    try {
      let response;
      
      switch (action) {
        case 'generate-recipe':
          const style = context.beerStyle || await this.promptForStyle();
          response = await this.aiFunctions.generateRecipe(style, context);
          break;
          
        case 'enhance-recipe':
          if (!context.beerStyle) {
            response = { summary: "I need a recipe to enhance. Please open the Recipe Designer first or describe your current recipe." };
          } else {
            response = await this.aiFunctions.enhanceRecipe(context);
          }
          break;
          
        case 'experimental-recipe':
          const expStyle = context.beerStyle || await this.promptForStyle();
          response = await this.aiFunctions.createExperimentalRecipe(expStyle, 'hop');
          break;
          
        case 'analyze-batch':
          response = await this.handleBatchAnalysis();
          break;
          
        case 'troubleshoot-batch':
          response = await this.handleBatchTroubleshooting();
          break;
          
        case 'inventory-recipe':
          response = await this.ai.generateInventoryAwareResponse('Create a recipe using only my current inventory');
          break;
          
        default:
          response = { summary: "Function not implemented yet. Try asking me directly!" };
      }
      
      this.addMessage('ai', response.summary, response.suggestions || []);
      
    } catch (error) {
      console.error('AI function error:', error);
      this.addMessage('ai', "Had a hiccup with that function. Try asking me directly instead!", []);
    } finally {
      this.showLoading(false);
    }
  }

  getRecipeContext() {
    // Try to get current recipe context from recipe designer
    const context = {};
    
    if (window.recipeDesigner) {
      context.beerStyle = window.recipeDesigner.recipe?.style;
      context.abv = window.recipeDesigner.calculations?.abv;
      context.ibu = window.recipeDesigner.calculations?.ibus;
      context.og = window.recipeDesigner.calculations?.og;
      context.fg = window.recipeDesigner.calculations?.fg;
    }
    
    return context;
  }

  enableUI() {
    const statusIndicator = document.getElementById('ai-status');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    
    statusIndicator.classList.remove('offline');
    toggleBtn.disabled = false;
    
    // Check offline knowledge base status
    if (window.offlineKnowledgeBase && window.offlineKnowledgeBase.isLoaded) {
      const stats = window.offlineKnowledgeBase.getStats();
      toggleBtn.title = `AI Brewmaster (Ready - ${stats.totalDocuments} knowledge docs loaded)`;
      
      // Add knowledge base status to welcome message
      setTimeout(() => {
        this.addKnowledgeBaseStatus(stats);
      }, 1000);
    } else {
      toggleBtn.title = 'Ask AI Brewmaster (Ready - Online mode)';
    }
  }

  async promptForStyle() {
    return prompt("What beer style would you like to work with?") || "American IPA";
  }
  
  async handleBatchAnalysis() {
    const batchId = prompt("Enter batch ID to analyze (or leave blank for general analysis):");
    if (batchId && this.aiFunctions) {
      return await this.aiFunctions.analyzeBatchRatings(batchId);
    }
    return { summary: "To analyze a specific batch, I need the batch ID. For now, here's general batch analysis guidance: Check your fermentation temps, hop freshness, and water chemistry. These are the big three that affect customer ratings." };
  }
  
  async handleBatchTroubleshooting() {
    const issues = prompt("What issues are you experiencing? (e.g., 'low hop aroma, thin body')");
    if (issues && this.aiFunctions) {
      return await this.aiFunctions.troubleshootBatch({}, issues.split(',').map(i => i.trim()));
    }
    return { summary: "Describe the issues you're seeing and I'll help diagnose the root cause. Common problems: off-flavors, poor aroma, thin body, or clarity issues." };
  }

  showError(message) {
    const statusIndicator = document.getElementById('ai-status');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    
    statusIndicator.classList.add('offline');
    toggleBtn.title = `AI Brewmaster Error: ${message}`;
    
    console.error('AI Brewmaster UI Error:', message);
  }

  addKnowledgeBaseStatus(stats) {
    const conversation = document.getElementById('ai-conversation');
    const statusDiv = document.createElement('div');
    
    statusDiv.className = 'ai-message ai-message-system';
    statusDiv.innerHTML = `
      <div class="ai-avatar">📚</div>
      <div class="ai-text">
        <strong>Offline Knowledge Base Loaded!</strong><br>
        I have access to ${stats.totalDocuments} brewing documents including:
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px;">
          <li>${stats.sections.styles} beer style guides</li>
          <li>${stats.sections.troubleshooting} troubleshooting guides</li>
          <li>${stats.sections.ingredients} ingredient profiles</li>
          <li>${stats.sections.guides} brewing technique guides</li>
        </ul>
        I can help even when you're offline!
      </div>
    `;
    
    conversation.appendChild(statusDiv);
    conversation.scrollTop = conversation.scrollHeight;
  }
}

// Initialize AI Brewmaster UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if container exists
  if (document.getElementById('ai-brewmaster-container')) {
    window.AIBrewmasterUI = new AIBrewmasterUI();
  }
});

// Export for manual initialization
window.AIBrewmasterUI = AIBrewmasterUI;
