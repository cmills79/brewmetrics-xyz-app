// BrewMetrics Advanced Components Library

class AdvancedComponents {
    constructor() {
        this.components = new Map();
        this.init();
    }

    init() {
        this.registerComponents();
        this.setupGlobalEventListeners();
    }

    registerComponents() {
        // Register all advanced components
        this.components.set('data-table', this.createDataTable);
        this.components.set('chart-widget', this.createChartWidget);
        this.components.set('metric-card', this.createMetricCard);
        this.components.set('progress-ring', this.createProgressRing);
        this.components.set('timeline', this.createTimeline);
        this.components.set('kanban-board', this.createKanbanBoard);
        this.components.set('calendar', this.createCalendar);
        this.components.set('file-upload', this.createFileUpload);
        this.components.set('search-box', this.createSearchBox);
        this.components.set('rating-stars', this.createRatingStars);
    }

    setupGlobalEventListeners() {
        // Auto-initialize components on DOM changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        this.initializeComponents(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initialize existing components
        this.initializeComponents(document);
    }

    initializeComponents(container) {
        this.components.forEach((createFn, selector) => {
            container.querySelectorAll(`[data-component="${selector}"]`).forEach(element => {
                if (!element.dataset.initialized) {
                    createFn.call(this, element);
                    element.dataset.initialized = 'true';
                }
            });
        });
    }

    // Advanced Data Table Component
    createDataTable(element) {
        const config = JSON.parse(element.dataset.config || '{}');
        const data = JSON.parse(element.dataset.data || '[]');
        
        const table = document.createElement('div');
        table.className = 'advanced-data-table';
        table.innerHTML = `
            <div class="table-header">
                <div class="table-search">
                    <input type="text" placeholder="Search..." class="search-input">
                    <i class="fas fa-search"></i>
                </div>
                <div class="table-actions">
                    <button class="btn btn-primary" data-action="export">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="table-pagination">
                <div class="pagination-info"></div>
                <div class="pagination-controls"></div>
            </div>
        `;

        element.appendChild(table);
        this.setupDataTableFeatures(table, data, config);
    }

    setupDataTableFeatures(table, data, config) {
        // Implement sorting, filtering, pagination
        const searchInput = table.querySelector('.search-input');
        const tbody = table.querySelector('tbody');
        const thead = table.querySelector('thead');
        
        let filteredData = [...data];
        let currentPage = 1;
        const itemsPerPage = config.itemsPerPage || 10;

        // Create headers
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            thead.innerHTML = `
                <tr>
                    ${headers.map(header => `
                        <th data-sort="${header}">
                            ${header.charAt(0).toUpperCase() + header.slice(1)}
                            <i class="fas fa-sort"></i>
                        </th>
                    `).join('')}
                </tr>
            `;
        }

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filteredData = data.filter(row => 
                Object.values(row).some(value => 
                    value.toString().toLowerCase().includes(searchTerm)
                )
            );
            this.renderTableData(tbody, filteredData, currentPage, itemsPerPage);
        });

        // Initial render
        this.renderTableData(tbody, filteredData, currentPage, itemsPerPage);
    }

    renderTableData(tbody, data, page, itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = data.slice(start, end);

        tbody.innerHTML = pageData.map(row => `
            <tr class="animate-fadeInUp">
                ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
            </tr>
        `).join('');
    }

    // Advanced Chart Widget Component
    createChartWidget(element) {
        const config = JSON.parse(element.dataset.config || '{}');
        
        const widget = document.createElement('div');
        widget.className = 'chart-widget card hover-lift';
        widget.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${config.title || 'Chart'}</h3>
                <div class="widget-actions">
                    <button class="btn-icon" data-action="refresh">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="btn-icon" data-action="fullscreen">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="widget-content">
                <canvas class="chart-canvas"></canvas>
            </div>
            <div class="widget-footer">
                <div class="chart-legend"></div>
            </div>
        `;

        element.appendChild(widget);
        this.setupChartWidget(widget, config);
    }

    setupChartWidget(widget, config) {
        const canvas = widget.querySelector('.chart-canvas');
        const ctx = canvas.getContext('2d');
        
        // Create chart with enhanced animations
        if (typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: config.type || 'line',
                data: config.data || {},
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1500,
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    ...config.options
                }
            });
        }
    }

    // Metric Card Component
    createMetricCard(element) {
        const config = JSON.parse(element.dataset.config || '{}');
        
        const card = document.createElement('div');
        card.className = 'metric-card card hover-glow';
        card.innerHTML = `
            <div class="metric-icon">
                <i class="${config.icon || 'fas fa-chart-line'}"></i>
            </div>
            <div class="metric-content">
                <div class="metric-value" data-value="${config.value || 0}">0</div>
                <div class="metric-label">${config.label || 'Metric'}</div>
                <div class="metric-change ${config.change >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-arrow-${config.change >= 0 ? 'up' : 'down'}"></i>
                    ${Math.abs(config.change || 0)}%
                </div>
            </div>
            <div class="metric-chart">
                <canvas class="mini-chart"></canvas>
            </div>
        `;

        element.appendChild(card);
        
        // Animate counter
        const valueElement = card.querySelector('.metric-value');
        this.animateCounter(valueElement, config.value || 0);
        
        // Create mini chart
        this.createMiniChart(card.querySelector('.mini-chart'), config.chartData);
    }

    animateCounter(element, targetValue, duration = 2000) {
        let currentValue = 0;
        const increment = targetValue / (duration / 16);
        
        const animate = () => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
            }
            
            element.textContent = Math.floor(currentValue).toLocaleString();
            
            if (currentValue < targetValue) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    createMiniChart(canvas, data) {
        if (!data || typeof Chart === 'undefined') return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || [],
                datasets: [{
                    data: data.values || [],
                    borderColor: 'rgba(37, 99, 235, 0.8)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: { point: { radius: 0 } }
            }
        });
    }

    // Progress Ring Component
    createProgressRing(element) {
        const config = JSON.parse(element.dataset.config || '{}');
        const value = config.value || 0;
        const max = config.max || 100;
        const size = config.size || 120;
        const strokeWidth = config.strokeWidth || 8;
        
        const ring = document.createElement('div');
        ring.className = 'progress-ring';
        ring.innerHTML = `
            <svg width="${size}" height="${size}" class="progress-ring-svg">
                <circle
                    class="progress-ring-background"
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${(size - strokeWidth) / 2}"
                    stroke-width="${strokeWidth}"
                />
                <circle
                    class="progress-ring-progress"
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${(size - strokeWidth) / 2}"
                    stroke-width="${strokeWidth}"
                />
            </svg>
            <div class="progress-ring-text">
                <span class="progress-value">${value}</span>
                <span class="progress-unit">%</span>
            </div>
        `;

        element.appendChild(ring);
        this.animateProgressRing(ring, value, max);
    }

    animateProgressRing(ring, value, max) {
        const circle = ring.querySelector('.progress-ring-progress');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        
        const progress = (value / max) * circumference;
        
        setTimeout(() => {
            circle.style.strokeDashoffset = circumference - progress;
        }, 100);
    }

    // Timeline Component
    createTimeline(element) {
        const events = JSON.parse(element.dataset.events || '[]');
        
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        timeline.innerHTML = events.map((event, index) => `
            <div class="timeline-item animate-fadeInLeft" style="animation-delay: ${index * 100}ms">
                <div class="timeline-marker">
                    <i class="${event.icon || 'fas fa-circle'}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h4>${event.title}</h4>
                        <span class="timeline-date">${event.date}</span>
                    </div>
                    <p>${event.description}</p>
                </div>
            </div>
        `).join('');

        element.appendChild(timeline);
    }

    // File Upload Component
    createFileUpload(element) {
        const config = JSON.parse(element.dataset.config || '{}');
        
        const uploader = document.createElement('div');
        uploader.className = 'file-upload-area';
        uploader.innerHTML = `
            <input type="file" class="file-input" ${config.multiple ? 'multiple' : ''} accept="${config.accept || '*'}">
            <div class="upload-content">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <p class="upload-text">Drag & drop files here or click to browse</p>
                <p class="upload-hint">Supported formats: ${config.accept || 'All files'}</p>
            </div>
            <div class="upload-progress" style="display: none;">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <span class="progress-text">0%</span>
            </div>
        `;

        element.appendChild(uploader);
        this.setupFileUpload(uploader, config);
    }

    setupFileUpload(uploader, config) {
        const input = uploader.querySelector('.file-input');
        const content = uploader.querySelector('.upload-content');
        const progress = uploader.querySelector('.upload-progress');
        
        // Drag and drop
        uploader.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploader.classList.add('drag-over');
        });
        
        uploader.addEventListener('dragleave', () => {
            uploader.classList.remove('drag-over');
        });
        
        uploader.addEventListener('drop', (e) => {
            e.preventDefault();
            uploader.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files, progress, config);
        });
        
        // Click to upload
        uploader.addEventListener('click', () => input.click());
        
        input.addEventListener('change', (e) => {
            this.handleFiles(e.target.files, progress, config);
        });
    }

    handleFiles(files, progressElement, config) {
        Array.from(files).forEach(file => {
            if (config.onUpload) {
                config.onUpload(file, progressElement);
            }
        });
    }

    // Search Box Component
    createSearchBox(element) {
        const config = JSON.parse(element.dataset.config || '{}');
        
        const searchBox = document.createElement('div');
        searchBox.className = 'advanced-search-box';
        searchBox.innerHTML = `
            <div class="search-input-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" placeholder="${config.placeholder || 'Search...'}">
                <button class="search-clear" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-suggestions" style="display: none;"></div>
        `;

        element.appendChild(searchBox);
        this.setupSearchBox(searchBox, config);
    }

    setupSearchBox(searchBox, config) {
        const input = searchBox.querySelector('.search-input');
        const suggestions = searchBox.querySelector('.search-suggestions');
        const clearBtn = searchBox.querySelector('.search-clear');
        
        let debounceTimer;
        
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            clearBtn.style.display = value ? 'block' : 'none';
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (config.onSearch) {
                    config.onSearch(value, suggestions);
                }
            }, 300);
        });
        
        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            suggestions.style.display = 'none';
            if (config.onClear) config.onClear();
        });
    }

    // Rating Stars Component
    createRatingStars(element) {
        const config = JSON.parse(element.dataset.config || '{}');
        const rating = config.rating || 0;
        const maxStars = config.maxStars || 5;
        const readonly = config.readonly || false;
        
        const stars = document.createElement('div');
        stars.className = 'rating-stars';
        
        for (let i = 1; i <= maxStars; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.innerHTML = '<i class="fas fa-star"></i>';
            star.dataset.rating = i;
            
            if (i <= rating) {
                star.classList.add('active');
            }
            
            if (!readonly) {
                star.addEventListener('click', () => {
                    this.setRating(stars, i, config.onChange);
                });
                
                star.addEventListener('mouseenter', () => {
                    this.highlightStars(stars, i);
                });
            }
            
            stars.appendChild(star);
        }
        
        if (!readonly) {
            stars.addEventListener('mouseleave', () => {
                this.highlightStars(stars, rating);
            });
        }
        
        element.appendChild(stars);
    }

    setRating(container, rating, callback) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
        
        if (callback) callback(rating);
    }

    highlightStars(container, rating) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('hover', index < rating);
        });
    }
}

// Initialize Advanced Components
document.addEventListener('DOMContentLoaded', () => {
    window.advancedComponents = new AdvancedComponents();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedComponents;
}