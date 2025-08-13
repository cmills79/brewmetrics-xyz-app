class InventoryManager {
    constructor() {
        this.inventory = {
            fermentables: [],
            hops: [],
            yeast: [],
            chemicals: []
        };
        this.shoppingList = [];
        this.currentFilter = { category: 'all', stock: 'all', search: '' };
        this.init();
    }

    init() {
        this.loadInventory();
        this.setupEventListeners();
    }

    async loadInventory() {
        try {
            const breweryId = this.getBreweryId();
            const inventoryDoc = await firebase.firestore()
                .collection('breweries')
                .doc(breweryId)
                .collection('inventory')
                .doc('current')
                .get();

            if (inventoryDoc.exists) {
                this.inventory = inventoryDoc.data();
            }
            
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading inventory:', error);
            this.loadDemoInventory();
        }
    }

    loadDemoInventory() {
        this.inventory = {
            fermentables: [
                { 
                    id: '1', name: 'American 2-Row', type: 'Base Malt', quantity: 500, unit: 'lbs', cost: 1.20, supplier: 'Briess', reorderPoint: 100, expiryDate: '2024-12-31',
                    yield: 82, color: 2.0, maxUsage: 100, purchaseDate: '2024-01-15', lotNumber: 'BR240115001', storageTemp: 65, notes: 'High-quality base malt for all beer styles'
                },
                { 
                    id: '2', name: 'Munich Malt', type: 'Base Malt', quantity: 45, unit: 'lbs', cost: 1.40, supplier: 'Weyermann', reorderPoint: 50, expiryDate: '2024-11-30',
                    yield: 80, color: 9.0, maxUsage: 80, purchaseDate: '2024-02-01', lotNumber: 'WEY240201002', storageTemp: 65, notes: 'German Munich malt for malty character'
                },
                { 
                    id: '3', name: 'Crystal 60L', type: 'Crystal', quantity: 25, unit: 'lbs', cost: 1.85, supplier: 'Briess', reorderPoint: 30, expiryDate: '2024-10-15',
                    yield: 75, color: 60.0, maxUsage: 15, purchaseDate: '2024-01-20', lotNumber: 'BR240120003', storageTemp: 65, notes: 'Medium crystal malt for color and sweetness'
                },
                { 
                    id: '4', name: 'Wheat Malt', type: 'Specialty', quantity: 80, unit: 'lbs', cost: 1.55, supplier: 'Briess', reorderPoint: 40, expiryDate: '2024-12-15',
                    yield: 84, color: 2.5, maxUsage: 60, purchaseDate: '2024-01-25', lotNumber: 'BR240125004', storageTemp: 65, notes: 'White wheat malt for body and head retention'
                }
            ],
            hops: [
                { 
                    id: '5', name: 'Cascade', type: 'Dual', quantity: 3, unit: 'lbs', cost: 15.00, supplier: 'Yakima Chief', reorderPoint: 5, alpha: 5.5, expiryDate: '2025-08-30',
                    beta: 5.8, harvestYear: 2024, form: 'Pellet', purchaseDate: '2024-02-10', lotNumber: 'YC240210005', storageTemp: -10, notes: 'Classic American hop with citrus character'
                },
                { 
                    id: '6', name: 'Citra', type: 'Aroma', quantity: 1, unit: 'lbs', cost: 18.00, supplier: 'Yakima Chief', reorderPoint: 3, alpha: 12.0, expiryDate: '2025-09-15',
                    beta: 3.8, harvestYear: 2024, form: 'Pellet', purchaseDate: '2024-02-15', lotNumber: 'YC240215006', storageTemp: -10, notes: 'Tropical fruit and citrus aroma hop'
                },
                { 
                    id: '7', name: 'Mosaic', type: 'Aroma', quantity: 2, unit: 'lbs', cost: 18.50, supplier: 'Yakima Chief', reorderPoint: 4, alpha: 12.25, expiryDate: '2025-07-20',
                    beta: 3.2, harvestYear: 2024, form: 'Pellet', purchaseDate: '2024-02-20', lotNumber: 'YC240220007', storageTemp: -10, notes: 'Complex berry and tropical fruit character'
                },
                { 
                    id: '8', name: 'Centennial', type: 'Dual', quantity: 6, unit: 'lbs', cost: 16.50, supplier: 'Hop Union', reorderPoint: 3, alpha: 10.0, expiryDate: '2025-06-15',
                    beta: 4.5, harvestYear: 2024, form: 'Pellet', purchaseDate: '2024-02-25', lotNumber: 'HU240225008', storageTemp: -10, notes: 'Floral and citrus hop for American ales'
                }
            ],
            yeast: [
                { 
                    id: '9', name: 'Safale US-05', type: 'American Ale', quantity: 15, unit: 'packets', cost: 3.50, supplier: 'Fermentis', reorderPoint: 20, form: 'Dry', expiryDate: '2025-03-15',
                    attenuation: 81, tempRange: '64-72°F', flocculation: 'Medium', purchaseDate: '2024-03-01', lotNumber: 'FER240301009', storageTemp: 35, notes: 'Clean American ale yeast'
                },
                { 
                    id: '10', name: 'London Ale III', type: 'English Ale', quantity: 8, unit: 'vials', cost: 8.00, supplier: 'Wyeast', reorderPoint: 10, form: 'Liquid', expiryDate: '2024-06-30',
                    attenuation: 75, tempRange: '64-74°F', flocculation: 'High', purchaseDate: '2024-03-05', lotNumber: 'WY240305010', storageTemp: 35, notes: 'English ale yeast with fruity esters'
                },
                { 
                    id: '11', name: 'Saflager W-34/70', type: 'German Lager', quantity: 25, unit: 'packets', cost: 4.00, supplier: 'Fermentis', reorderPoint: 15, form: 'Dry', expiryDate: '2025-04-20',
                    attenuation: 83, tempRange: '46-57°F', flocculation: 'High', purchaseDate: '2024-03-10', lotNumber: 'FER240310011', storageTemp: 35, notes: 'German lager yeast for clean fermentation'
                }
            ],
            chemicals: [
                { 
                    id: '12', name: 'Gypsum (CaSO4)', type: 'Water Treatment', quantity: 8, unit: 'lbs', cost: 2.50, supplier: 'LD Carlson', reorderPoint: 10, expiryDate: null,
                    concentration: '99%', safetyRating: 'Food Grade', usageRate: '1-5 g/gal', purchaseDate: '2024-03-15', lotNumber: 'LDC240315012', storageTemp: 70, notes: 'Calcium sulfate for water treatment'
                },
                { 
                    id: '13', name: 'Calcium Chloride', type: 'Water Treatment', quantity: 5, unit: 'lbs', cost: 3.00, supplier: 'LD Carlson', reorderPoint: 8, expiryDate: null,
                    concentration: '97%', safetyRating: 'Food Grade', usageRate: '1-4 g/gal', purchaseDate: '2024-03-20', lotNumber: 'LDC240320013', storageTemp: 70, notes: 'Calcium chloride for malt character enhancement'
                },
                { 
                    id: '14', name: 'PBW', type: 'Cleaner', quantity: 8, unit: 'lbs', cost: 4.20, supplier: 'Five Star', reorderPoint: 15, expiryDate: null,
                    concentration: 'Alkaline', safetyRating: 'Low Risk', usageRate: '1-2 oz/gal', purchaseDate: '2024-03-25', lotNumber: 'FS240325014', storageTemp: 70, notes: 'Powdered brewery wash cleaner'
                },
                { 
                    id: '15', name: 'Star San', type: 'Sanitizer', quantity: 2, unit: 'bottles', cost: 12.50, supplier: 'Five Star', reorderPoint: 3, expiryDate: '2025-12-31',
                    concentration: 'Acid Sanitizer', safetyRating: 'Moderate Risk', usageRate: '1 oz/5 gal', purchaseDate: '2024-03-30', lotNumber: 'FS240330015', storageTemp: 70, notes: 'No-rinse acid sanitizer'
                }
            ]
        };
        this.updateDisplay();
    }

    updateDisplay() {
        this.updateStats();
        this.updateInventoryTable();
        this.updateShoppingList();
    }

    updateStats() {
        const totalItems = Object.values(this.inventory).reduce((sum, category) => sum + category.length, 0);
        const lowStockItems = this.getLowStockItems();
        const totalValue = this.calculateTotalValue();
        const expiringSoon = this.getExpiringSoonItems();

        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('low-stock-count').textContent = lowStockItems.length;
        document.getElementById('total-value').textContent = `$${totalValue.toLocaleString()}`;
        document.getElementById('expiring-soon').textContent = expiringSoon.length;
    }

    updateInventoryTable() {
        const tableBody = document.getElementById('inventory-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Get filtered items
        const filteredItems = this.getFilteredItems();
        
        filteredItems.forEach(({ item, category }) => {
            const row = this.createTableRow(item, category);
            tableBody.appendChild(row);
        });
    }

    createTableRow(item, category) {
        const row = document.createElement('div');
        row.className = 'table-row';
        
        const stockLevel = this.getStockLevel(item);
        const stockIndicatorClass = stockLevel === 'Critical' ? 'stock-critical' : 
                                   stockLevel === 'Low' ? 'stock-low' : 'stock-good';
        
        const needsReorder = item.quantity <= (item.reorderPoint || 0);
        const totalValue = (item.quantity * item.cost).toFixed(2);
        
        row.innerHTML = `
            <div>
                <div class="item-name">${item.name}</div>
                <div class="item-details">${item.supplier || ''} • ${item.type || category}</div>
            </div>
            <div>${item.quantity} ${item.unit}</div>
            <div>${item.reorderPoint || 0} ${item.unit}</div>
            <div>$${item.cost.toFixed(2)}</div>
            <div>$${totalValue}</div>
            <div>
                <span class="stock-indicator ${stockIndicatorClass}"></span>
                ${stockLevel}
                ${needsReorder ? '<span class="reorder-badge">Reorder</span>' : ''}
            </div>
            <div class="action-buttons">
                <button class="btn-icon" onclick="inventoryManager.adjustStock('${category}', '${item.id}')" title="Adjust Stock">
                    <i class="fas fa-plus-minus"></i>
                </button>
                <button class="btn-icon" onclick="inventoryManager.editItem('${category}', '${item.id}')" title="Edit Item">
                    <i class="fas fa-edit"></i>
                </button>
                ${needsReorder ? `<button class="btn-icon" onclick="inventoryManager.addToShoppingList('${category}', '${item.id}')" title="Add to Shopping List"><i class="fas fa-cart-plus"></i></button>` : ''}
                <button class="btn-icon" onclick="inventoryManager.removeItem('${category}', '${item.id}')" title="Remove Item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return row;
    }

    getStockLevel(item) {
        const reorderPoint = item.reorderPoint || item.minStock || 0;
        if (reorderPoint === 0) return 'Good';
        
        if (item.quantity <= reorderPoint * 0.5) return 'Critical';
        if (item.quantity <= reorderPoint) return 'Low';
        return 'Good';
    }

    getLowStockItems() {
        const lowStock = [];
        Object.values(this.inventory).forEach(category => {
            category.forEach(item => {
                if (this.getStockLevel(item) !== 'Good') {
                    lowStock.push(item);
                }
            });
        });
        return lowStock;
    }
    
    getExpiringSoonItems() {
        const expiring = [];
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        Object.values(this.inventory).forEach(category => {
            category.forEach(item => {
                if (item.expiryDate && new Date(item.expiryDate) <= thirtyDaysFromNow) {
                    expiring.push(item);
                }
            });
        });
        return expiring;
    }

    calculateTotalValue() {
        let total = 0;
        Object.values(this.inventory).forEach(category => {
            category.forEach(item => {
                total += item.quantity * item.cost;
            });
        });
        return Math.round(total);
    }
    
    getFilteredItems() {
        const items = [];
        
        Object.keys(this.inventory).forEach(category => {
            if (this.currentFilter.category !== 'all' && this.currentFilter.category !== category) {
                return;
            }
            
            this.inventory[category].forEach(item => {
                // Search filter
                if (this.currentFilter.search) {
                    const searchTerm = this.currentFilter.search.toLowerCase();
                    const searchableText = `${item.name} ${item.supplier || ''} ${item.type || ''}`.toLowerCase();
                    if (!searchableText.includes(searchTerm)) {
                        return;
                    }
                }
                
                // Stock level filter
                if (this.currentFilter.stock !== 'all') {
                    const stockLevel = this.getStockLevel(item).toLowerCase();
                    if (stockLevel !== this.currentFilter.stock) {
                        return;
                    }
                }
                
                items.push({ item, category });
            });
        });
        
        return items;
    }
    
    addToShoppingList(category, itemId) {
        const item = this.inventory[category].find(i => i.id === itemId);
        if (!item) return;
        
        const existingItem = this.shoppingList.find(i => i.id === itemId);
        if (existingItem) {
            this.showNotification('Item already in shopping list', 'warning');
            return;
        }
        
        const reorderQuantity = (item.reorderPoint || 0) * 2; // Order 2x reorder point
        this.shoppingList.push({
            id: item.id,
            name: item.name,
            category,
            supplier: item.supplier,
            quantity: reorderQuantity,
            unit: item.unit,
            cost: item.cost,
            totalCost: reorderQuantity * item.cost
        });
        
        this.updateShoppingList();
        this.showNotification(`${item.name} added to shopping list!`, 'success');
    }
    
    updateShoppingList() {
        const shoppingCount = document.getElementById('shopping-count');
        const shoppingContent = document.getElementById('shopping-list-content');
        
        if (shoppingCount) {
            shoppingCount.textContent = this.shoppingList.length;
        }
        
        if (shoppingContent) {
            shoppingContent.innerHTML = '';
            
            if (this.shoppingList.length === 0) {
                shoppingContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No items in shopping list</div>';
                return;
            }
            
            let totalCost = 0;
            this.shoppingList.forEach((item, index) => {
                totalCost += item.totalCost;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'shopping-item';
                itemDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: bold;">${item.name}</div>
                            <div style="font-size: 0.9em; color: #666;">${item.supplier || ''} • ${item.quantity} ${item.unit}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold;">$${item.totalCost.toFixed(2)}</div>
                            <button class="btn-icon" onclick="inventoryManager.removeFromShoppingList(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `;
                shoppingContent.appendChild(itemDiv);
            });
            
            // Add total
            const totalDiv = document.createElement('div');
            totalDiv.style.cssText = 'padding: 15px; border-top: 2px solid #eee; font-weight: bold; text-align: right;';
            totalDiv.innerHTML = `Total: $${totalCost.toFixed(2)}`;
            shoppingContent.appendChild(totalDiv);
        }
    }
    
    removeFromShoppingList(index) {
        this.shoppingList.splice(index, 1);
        this.updateShoppingList();
    }

    setupEventListeners() {
        // Search and filter listeners
        const searchInput = document.getElementById('inventory-search');
        const categoryFilter = document.getElementById('category-filter');
        const stockFilter = document.getElementById('stock-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.updateDisplay();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter.category = e.target.value;
                this.updateDisplay();
            });
        }
        
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.currentFilter.stock = e.target.value;
                this.updateDisplay();
            });
        }
    }

    showAddInventoryModal() {
        const modal = this.createAddInventoryModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    createAddInventoryModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center;
            align-items: center; z-index: 1000; padding: 20px;
        `;

        modal.innerHTML = `
            <div class="add-item-modal">
                <div class="modal-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <i class="fas fa-plus-circle"></i>
                        </div>
                        <div class="header-text">
                            <h2>Add Inventory Item</h2>
                            <p>Add ingredients and supplies to your brewery inventory</p>
                        </div>
                    </div>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <!-- Category Selection -->
                    <div class="form-section">
                        <h3><i class="fas fa-tags"></i> Category & Type</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label><i class="fas fa-layer-group"></i> Category</label>
                                <select id="item-category" onchange="inventoryManager.updateIngredientDropdown()">
                                    <option value="fermentables">🌾 Fermentables</option>
                                    <option value="hops">🌿 Hops</option>
                                    <option value="yeast">🦠 Yeast</option>
                                    <option value="chemicals">⚗️ Chemicals & Additives</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-database"></i> Quick Select</label>
                                <select id="ingredient-select" onchange="inventoryManager.fillIngredientDetails()">
                                    <option value="">Choose from database...</option>
                                </select>
                                <small>Select from our ingredient database or enter custom details</small>
                            </div>
                        </div>
                    </div>

                    <!-- Basic Information -->
                    <div class="form-section">
                        <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label><i class="fas fa-tag"></i> Item Name *</label>
                                <input type="text" id="item-name" placeholder="e.g., American 2-Row" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-industry"></i> Supplier</label>
                                <input type="text" id="item-supplier" placeholder="e.g., Briess Malt">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-shapes"></i> Type/Variety</label>
                                <input type="text" id="item-type" placeholder="e.g., Base Malt, Aroma Hop">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-map-marker-alt"></i> Storage Location</label>
                                <input type="text" id="item-location" placeholder="e.g., Grain Room A, Hop Freezer">
                            </div>
                        </div>
                    </div>

                    <!-- Inventory Details -->
                    <div class="form-section">
                        <h3><i class="fas fa-boxes"></i> Inventory & Pricing</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label><i class="fas fa-weight"></i> Current Stock *</label>
                                <input type="number" id="item-quantity" step="0.1" min="0" placeholder="0.0" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-ruler"></i> Unit</label>
                                <select id="item-unit">
                                    <option value="lbs">lbs (pounds)</option>
                                    <option value="oz">oz (ounces)</option>
                                    <option value="kg">kg (kilograms)</option>
                                    <option value="g">g (grams)</option>
                                    <option value="packets">packets</option>
                                    <option value="vials">vials</option>
                                    <option value="bottles">bottles</option>
                                    <option value="gallons">gallons</option>
                                    <option value="liters">liters</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-dollar-sign"></i> Cost per Unit (USD) *</label>
                                <input type="number" id="item-cost" step="0.01" min="0" placeholder="0.00" required>
                                <small>Enter price in US dollars</small>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-exclamation-triangle"></i> Reorder Point</label>
                                <input type="number" id="item-reorder" step="0.1" min="0" placeholder="0">
                                <small>Minimum stock before reordering</small>
                            </div>
                        </div>
                    </div>

                    <!-- Brewing Specifications -->
                    <div class="form-section" id="brewing-specs">
                        <h3><i class="fas fa-flask"></i> Brewing Specifications</h3>
                        <div class="form-grid" id="spec-fields">
                            <!-- Dynamic fields based on category -->
                        </div>
                    </div>

                    <!-- Quality & Tracking -->
                    <div class="form-section">
                        <h3><i class="fas fa-calendar-check"></i> Quality & Tracking</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label><i class="fas fa-calendar-alt"></i> Purchase Date</label>
                                <input type="date" id="item-purchase-date">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-calendar-times"></i> Expiry Date</label>
                                <input type="date" id="item-expiry">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-hashtag"></i> Lot/Batch Number</label>
                                <input type="text" id="item-lot" placeholder="e.g., LOT2024001">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-thermometer-half"></i> Storage Temp (°F)</label>
                                <input type="number" id="item-storage-temp" placeholder="e.g., 65">
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="form-section">
                        <h3><i class="fas fa-sticky-note"></i> Additional Notes</h3>
                        <div class="form-group">
                            <textarea id="item-notes" rows="3" placeholder="Any additional notes about this ingredient (quality, usage notes, etc.)"></textarea>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn btn-primary" onclick="inventoryManager.addInventoryItem(this)">
                        <i class="fas fa-plus"></i> Add Item
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .add-item-modal {
                background: white;
                border-radius: 16px;
                max-width: 900px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: modalSlideIn 0.3s ease;
            }
            @keyframes modalSlideIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .modal-header {
                padding: 30px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #2c3e50, #3498db);
                color: white;
                border-radius: 16px 16px 0 0;
                position: relative;
                overflow: hidden;
            }
            .modal-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                pointer-events: none;
            }
            .header-content {
                display: flex;
                align-items: center;
                gap: 20px;
                position: relative;
                z-index: 1;
            }
            .header-icon {
                width: 60px;
                height: 60px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.3);
            }
            .header-text h2 {
                margin: 0 0 5px 0;
                font-size: 1.8em;
                font-weight: 700;
            }
            .header-text p {
                margin: 0;
                opacity: 0.9;
                font-size: 0.95em;
            }
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5em;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.2s;
            }
            .close-btn:hover {
                background: rgba(255,255,255,0.2);
            }
            .modal-body {
                padding: 30px;
            }
            .form-section {
                margin-bottom: 25px;
                padding: 25px;
                background: linear-gradient(145deg, #ffffff, #f8f9fa);
                border-radius: 16px;
                border: 1px solid #e9ecef;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                position: relative;
                transition: all 0.3s ease;
            }
            .form-section:hover {
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }
            .form-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: linear-gradient(135deg, #3498db, #2c3e50);
                border-radius: 2px 0 0 2px;
            }
            .form-section h3 {
                margin: 0 0 25px 0;
                color: #2c3e50;
                font-size: 1.3em;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 12px;
                padding-bottom: 12px;
                border-bottom: 2px solid #e9ecef;
            }
            .form-section h3 i {
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #3498db, #2c3e50);
                color: white;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }
            .form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            .form-group {
                display: flex;
                flex-direction: column;
            }
            .form-group label {
                font-weight: 600;
                margin-bottom: 8px;
                color: #333;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .form-group input,
            .form-group select,
            .form-group textarea {
                padding: 14px 16px;
                border: 2px solid #e9ecef;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 500;
                background: #ffffff;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                border-color: #3498db;
                outline: none;
                box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.15), 0 4px 12px rgba(0,0,0,0.1);
                transform: translateY(-1px);
                background: #ffffff;
            }
            .form-group small {
                margin-top: 5px;
                color: #666;
                font-size: 0.9em;
            }
            .modal-footer {
                padding: 25px 30px;
                border-top: 1px solid #e9ecef;
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                background: linear-gradient(145deg, #f8f9fa, #ffffff);
                border-radius: 0 0 16px 16px;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
            }
            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .btn-primary {
                background: linear-gradient(135deg, #3498db, #2c3e50);
                color: white;
                position: relative;
                overflow: hidden;
            }
            .btn-primary::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            .btn-primary:hover::before {
                left: 100%;
            }
            .btn-primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
            }
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            .btn-secondary:hover {
                background: #5a6268;
            }
        `;
        document.head.appendChild(style);
        
        // Initialize ingredient dropdown and spec fields
        setTimeout(() => {
            this.updateIngredientDropdown();
            this.updateSpecFields('fermentables');
        }, 100);

        return modal;
    }

    updateIngredientDropdown() {
        const categorySelect = document.getElementById('item-category');
        const ingredientSelect = document.getElementById('ingredient-select');
        
        if (!categorySelect || !ingredientSelect || !window.brewingIngredientsDB) return;
        
        const category = categorySelect.value;
        const ingredients = window.brewingIngredientsDB.getIngredientsByCategory(category);
        
        ingredientSelect.innerHTML = '<option value="">Choose from database...</option>';
        
        ingredients.forEach(ingredient => {
            const option = document.createElement('option');
            option.value = JSON.stringify(ingredient);
            option.textContent = `${ingredient.name} (${ingredient.supplier || 'Generic'})`;
            ingredientSelect.appendChild(option);
        });
        
        // Add custom option
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = '✏️ Custom Ingredient';
        ingredientSelect.appendChild(customOption);
        
        // Update specification fields based on category
        this.updateSpecFields(category);
    }
    
    updateSpecFields(category) {
        const specFields = document.getElementById('spec-fields');
        if (!specFields) return;
        
        let fieldsHTML = '';
        
        switch(category) {
            case 'fermentables':
                fieldsHTML = `
                    <div class="form-group">
                        <label><i class="fas fa-percentage"></i> Extract Yield (%)</label>
                        <input type="number" id="item-yield" step="0.1" min="0" max="100" placeholder="e.g., 82">
                        <small>Potential extract yield percentage</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-palette"></i> Color (°L)</label>
                        <input type="number" id="item-color" step="0.1" min="0" placeholder="e.g., 2.5">
                        <small>Lovibond color rating</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-thermometer"></i> Max Usage (%)</label>
                        <input type="number" id="item-max-usage" step="1" min="0" max="100" placeholder="e.g., 10">
                        <small>Maximum percentage in grain bill</small>
                    </div>
                `;
                break;
            case 'hops':
                fieldsHTML = `
                    <div class="form-group">
                        <label><i class="fas fa-leaf"></i> Alpha Acid (%)</label>
                        <input type="number" id="item-alpha" step="0.1" min="0" max="25" placeholder="e.g., 12.5">
                        <small>Alpha acid percentage</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-seedling"></i> Beta Acid (%)</label>
                        <input type="number" id="item-beta" step="0.1" min="0" max="15" placeholder="e.g., 4.2">
                        <small>Beta acid percentage</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Harvest Year</label>
                        <input type="number" id="item-harvest-year" min="2020" max="2030" placeholder="2024">
                        <small>Year of hop harvest</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-tags"></i> Hop Form</label>
                        <select id="item-hop-form">
                            <option value="Pellet">Pellet</option>
                            <option value="Whole">Whole Cone</option>
                            <option value="Extract">Extract</option>
                            <option value="Cryo">Cryo Hops</option>
                        </select>
                    </div>
                `;
                break;
            case 'yeast':
                fieldsHTML = `
                    <div class="form-group">
                        <label><i class="fas fa-vial"></i> Yeast Form</label>
                        <select id="item-yeast-form">
                            <option value="Liquid">Liquid</option>
                            <option value="Dry">Dry</option>
                            <option value="Slant">Slant</option>
                            <option value="Starter">Starter</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-percentage"></i> Attenuation (%)</label>
                        <input type="number" id="item-attenuation" step="1" min="50" max="95" placeholder="e.g., 75">
                        <small>Expected attenuation percentage</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-thermometer-half"></i> Temp Range (°F)</label>
                        <input type="text" id="item-temp-range" placeholder="e.g., 60-72">
                        <small>Optimal fermentation temperature</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-wine-glass"></i> Flocculation</label>
                        <select id="item-flocculation">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Very High">Very High</option>
                        </select>
                    </div>
                `;
                break;
            case 'chemicals':
                fieldsHTML = `
                    <div class="form-group">
                        <label><i class="fas fa-flask"></i> Concentration</label>
                        <input type="text" id="item-concentration" placeholder="e.g., 5%, 1:100">
                        <small>Active ingredient concentration</small>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-exclamation-triangle"></i> Safety Rating</label>
                        <select id="item-safety">
                            <option value="Food Grade">Food Grade</option>
                            <option value="Low Risk">Low Risk</option>
                            <option value="Moderate Risk">Moderate Risk</option>
                            <option value="High Risk">High Risk</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-tint"></i> Usage Rate</label>
                        <input type="text" id="item-usage-rate" placeholder="e.g., 1 tsp/5 gal">
                        <small>Typical usage rate</small>
                    </div>
                `;
                break;
        }
        
        specFields.innerHTML = fieldsHTML;
    }
    
    fillIngredientDetails() {
        const ingredientSelect = document.getElementById('ingredient-select');
        const selectedValue = ingredientSelect.value;
        
        if (!selectedValue || selectedValue === 'custom') return;
        
        try {
            const ingredient = JSON.parse(selectedValue);
            
            document.getElementById('item-name').value = ingredient.name;
            document.getElementById('item-supplier').value = ingredient.supplier || '';
            document.getElementById('item-cost').value = ingredient.price || '';
            
            // Set appropriate unit based on category
            const category = document.getElementById('item-category').value;
            const unitSelect = document.getElementById('item-unit');
            
            if (category === 'fermentables') {
                unitSelect.value = 'lbs';
            } else if (category === 'hops') {
                unitSelect.value = 'lbs';
            } else if (category === 'yeast') {
                unitSelect.value = ingredient.form === 'Liquid' ? 'vials' : 'packets';
            } else if (category === 'chemicals') {
                unitSelect.value = ingredient.type === 'Sanitizer' ? 'bottles' : 'lbs';
            }
        } catch (error) {
            console.error('Error parsing ingredient data:', error);
        }
    }
    
    addInventoryItem(button) {
        const modal = button.closest('.modal');
        const category = modal.querySelector('#item-category').value;
        const name = modal.querySelector('#item-name').value.trim();
        const quantity = parseFloat(modal.querySelector('#item-quantity').value) || 0;
        const unit = modal.querySelector('#item-unit').value;
        const cost = parseFloat(modal.querySelector('#item-cost').value) || 0;
        const supplier = modal.querySelector('#item-supplier').value.trim();
        const reorderPoint = parseFloat(modal.querySelector('#item-reorder').value) || 0;
        const expiryDate = modal.querySelector('#item-expiry').value || null;
        
        // Validation
        if (!name) {
            alert('Please enter an item name');
            return;
        }
        if (quantity < 0) {
            alert('Quantity cannot be negative');
            return;
        }
        if (cost < 0) {
            alert('Cost cannot be negative');
            return;
        }

        // Get additional form data
        const type = modal.querySelector('#item-type')?.value.trim() || '';
        const location = modal.querySelector('#item-location')?.value.trim() || '';
        const purchaseDate = modal.querySelector('#item-purchase-date')?.value || null;
        const lotNumber = modal.querySelector('#item-lot')?.value.trim() || '';
        const storageTemp = parseFloat(modal.querySelector('#item-storage-temp')?.value) || null;
        const notes = modal.querySelector('#item-notes')?.value.trim() || '';

        // Get category-specific specifications
        let specifications = {};
        switch(category) {
            case 'fermentables':
                specifications = {
                    yield: parseFloat(modal.querySelector('#item-yield')?.value) || null,
                    color: parseFloat(modal.querySelector('#item-color')?.value) || null,
                    maxUsage: parseFloat(modal.querySelector('#item-max-usage')?.value) || null
                };
                break;
            case 'hops':
                specifications = {
                    alpha: parseFloat(modal.querySelector('#item-alpha')?.value) || null,
                    beta: parseFloat(modal.querySelector('#item-beta')?.value) || null,
                    harvestYear: parseInt(modal.querySelector('#item-harvest-year')?.value) || null,
                    form: modal.querySelector('#item-hop-form')?.value || 'Pellet'
                };
                break;
            case 'yeast':
                specifications = {
                    form: modal.querySelector('#item-yeast-form')?.value || 'Liquid',
                    attenuation: parseFloat(modal.querySelector('#item-attenuation')?.value) || null,
                    tempRange: modal.querySelector('#item-temp-range')?.value.trim() || '',
                    flocculation: modal.querySelector('#item-flocculation')?.value || 'Medium'
                };
                break;
            case 'chemicals':
                specifications = {
                    concentration: modal.querySelector('#item-concentration')?.value.trim() || '',
                    safetyRating: modal.querySelector('#item-safety')?.value || 'Food Grade',
                    usageRate: modal.querySelector('#item-usage-rate')?.value.trim() || ''
                };
                break;
        }

        // Get additional details from ingredient database if selected
        const ingredientSelect = modal.querySelector('#ingredient-select');
        let databaseData = {};
        
        if (ingredientSelect.value && ingredientSelect.value !== 'custom') {
            try {
                const ingredient = JSON.parse(ingredientSelect.value);
                databaseData = {
                    databaseId: ingredient.id,
                    description: ingredient.description
                };
            } catch (error) {
                console.error('Error parsing ingredient data:', error);
            }
        }

        const newItem = {
            id: Date.now().toString(),
            name,
            type,
            quantity,
            unit,
            cost,
            supplier,
            location,
            reorderPoint,
            purchaseDate,
            expiryDate,
            lotNumber,
            storageTemp,
            notes,
            ...specifications,
            ...databaseData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.inventory[category].push(newItem);
        this.saveInventory();
        this.updateDisplay();
        modal.remove();
        
        // Show success message
        this.showSuccessMessage(`${name} added to inventory successfully!`);
    }
    
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'success') {
        const colors = {
            success: { bg: '#28a745', icon: 'fa-check-circle' },
            warning: { bg: '#ffc107', icon: 'fa-exclamation-triangle' },
            error: { bg: '#dc3545', icon: 'fa-times-circle' },
            info: { bg: '#17a2b8', icon: 'fa-info-circle' }
        };
        
        const config = colors[type] || colors.success;
        
        const toast = document.createElement('div');
        toast.className = 'inventory-notification';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${config.bg};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 600;
            font-size: 14px;
            max-width: 350px;
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas ${config.icon}" style="font-size: 18px;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        // Add animation styles if not already present
        if (!document.querySelector('#inventory-notifications-style')) {
            const style = document.createElement('style');
            style.id = 'inventory-notifications-style';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    editItem(category, itemId) {
        const item = this.inventory[category].find(i => i.id === itemId);
        if (!item) return;

        const newQuantity = prompt(`Edit quantity for ${item.name}:`, item.quantity);
        if (newQuantity && !isNaN(newQuantity)) {
            item.quantity = parseFloat(newQuantity);
            this.saveInventory();
            this.updateDisplay();
        }
    }

    adjustStock(category, itemId) {
        const item = this.inventory[category].find(i => i.id === itemId);
        if (!item) return;

        const adjustment = prompt(`Adjust stock for ${item.name} (use + or - values):`, '0');
        if (adjustment && !isNaN(adjustment)) {
            item.quantity = Math.max(0, item.quantity + parseFloat(adjustment));
            this.saveInventory();
            this.updateDisplay();
        }
    }

    async saveInventory() {
        try {
            const breweryId = this.getBreweryId();
            await firebase.firestore()
                .collection('breweries')
                .doc(breweryId)
                .collection('inventory')
                .doc('current')
                .set(this.inventory);
        } catch (error) {
            console.error('Error saving inventory:', error);
        }
    }

    exportInventory() {
        const data = [];
        Object.keys(this.inventory).forEach(category => {
            this.inventory[category].forEach(item => {
                data.push({
                    Category: category,
                    Name: item.name,
                    Type: item.type,
                    Quantity: item.quantity,
                    Unit: item.unit,
                    Cost: item.cost,
                    'Total Value': item.quantity * item.cost,
                    Supplier: item.supplier,
                    Location: item.location,
                    'Min Stock': item.minStock,
                    'Stock Level': this.getStockLevel(item),
                    'Expiry Date': item.expiryDate
                });
            });
        });

        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'brewery-inventory.csv');
    }

    convertToCSV(data) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        return [headers, ...rows].join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    getBreweryId() {
        return 'demo-brewery'; // Replace with actual brewery ID from auth
    }
}

// Global functions
function showAddInventoryModal() {
    inventoryManager.showAddInventoryModal();
}

function exportInventory() {
    inventoryManager.exportInventory();
}

function toggleShoppingList() {
    const panel = document.getElementById('shopping-list-panel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

function printShoppingList() {
    const shoppingList = inventoryManager.shoppingList;
    if (shoppingList.length === 0) {
        alert('Shopping list is empty');
        return;
    }
    
    let printContent = `
        <h2>Brewery Shopping List</h2>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr>
                <th>Item</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
                <th>Total</th>
            </tr>
    `;
    
    let totalCost = 0;
    shoppingList.forEach(item => {
        totalCost += item.totalCost;
        printContent += `
            <tr>
                <td>${item.name}</td>
                <td>${item.supplier || ''}</td>
                <td>${item.quantity} ${item.unit}</td>
                <td>$${item.cost.toFixed(2)}</td>
                <td>$${item.totalCost.toFixed(2)}</td>
            </tr>
        `;
    });
    
    printContent += `
            <tr style="font-weight: bold;">
                <td colspan="4">Total</td>
                <td>$${totalCost.toFixed(2)}</td>
            </tr>
        </table>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head><title>Shopping List</title></head>
            <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Initialize inventory manager
const inventoryManager = new InventoryManager();