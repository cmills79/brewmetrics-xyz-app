// Google Reviews Management System
// Handles fetching, displaying, and managing Google My Business reviews

class GoogleReviewsManager {
    constructor() {
        this.reviews = [];
        this.breweryData = null;
        this.isLoading = false;
        this.lastFetchTime = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBreweryData();
    }

    setupEventListeners() {
        // Refresh reviews button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'refresh-reviews-btn') {
                this.fetchReviews();
            }
        });

        // Export reviews button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'export-reviews-btn') {
                this.exportReviews();
            }
        });

        // Review response buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('respond-review-btn')) {
                const reviewId = e.target.dataset.reviewId;
                this.showResponseModal(reviewId);
            }
        });
    }

    async loadBreweryData() {
        try {
            if (!auth?.currentUser) {
                // Wait for auth to be ready
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        this.loadBreweryDataForUser(user.uid);
                    }
                });
                return;
            }
            
            await this.loadBreweryDataForUser(auth.currentUser.uid);
        } catch (error) {
            console.error('Error loading brewery data:', error);
        }
    }

    async loadBreweryDataForUser(uid) {
        try {
            const breweryDoc = await db.collection('breweries').doc(uid).get();
            if (breweryDoc.exists) {
                this.breweryData = breweryDoc.data();
                // Ensure GMB link exists for demo
                if (!this.breweryData.gmbReviewLink) {
                    this.breweryData.gmbReviewLink = 'https://g.page/demo-brewery/review';
                    this.breweryData.gmbAvgRating = this.breweryData.gmbAvgRating || 4.5;
                    this.breweryData.gmbTotalReviews = this.breweryData.gmbTotalReviews || 25;
                }
                this.updateReviewsSection();
                
                // Auto-load sample data for demo
                setTimeout(() => {
                    this.fetchReviews();
                }, 1000);
            } else {
                // Create default brewery data for testing
                this.breweryData = {
                    name: 'Demo Brewery',
                    gmbReviewLink: 'https://g.page/demo-brewery/review',
                    gmbAvgRating: 4.5,
                    gmbTotalReviews: 25
                };
                this.updateReviewsSection();
                
                // Auto-load sample data for demo
                setTimeout(() => {
                    this.fetchReviews();
                }, 1000);
            }
        } catch (error) {
            console.error('Error loading brewery data for user:', error);
        }
    }

    updateReviewsSection() {
        const reviewsSection = document.getElementById('google-reviews-section');
        if (!reviewsSection) return;

        // For demo purposes, always show the reviews interface
        const hasGMBLink = this.breweryData?.gmbReviewLink || true;
        
        reviewsSection.innerHTML = `
            <div class="section-header">
                <h2><i class="fab fa-google"></i> Google Reviews Management</h2>
                <div class="reviews-actions">
                    ${hasGMBLink ? `
                        <button id="refresh-reviews-btn" class="btn btn-primary btn-small">
                            <i class="fas fa-sync-alt"></i> Refresh Reviews
                        </button>
                        <button id="export-reviews-btn" class="btn btn-secondary btn-small">
                            <i class="fas fa-download"></i> Export CSV
                        </button>
                        <span class="demo-badge" style="background: #28a745; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; margin-left: 10px;">
                            <i class="fas fa-play"></i> Demo Mode
                        </span>
                    ` : ''}
                </div>
            </div>

            ${!hasGMBLink ? `
                <div class="gmb-setup-notice">
                    <div class="notice-content">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <h4>Google My Business Setup Required</h4>
                            <p>To fetch and manage Google reviews, please add your Google My Business review link in Settings.</p>
                            <button class="btn btn-primary" onclick="document.querySelector('[href=\\\"#settings-section\\\"]').click()">
                                Go to Settings
                            </button>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="reviews-dashboard">
                    <div class="reviews-stats">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-star"></i></div>
                            <div class="stat-info">
                                <div class="stat-label">Average Rating</div>
                                <div class="stat-value" id="avg-rating">${this.breweryData.gmbAvgRating || 'N/A'}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-comments"></i></div>
                            <div class="stat-info">
                                <div class="stat-label">Total Reviews</div>
                                <div class="stat-value" id="total-reviews">${this.breweryData.gmbTotalReviews || 0}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-clock"></i></div>
                            <div class="stat-info">
                                <div class="stat-label">Last Updated</div>
                                <div class="stat-value" id="last-updated">${this.lastFetchTime ? new Date(this.lastFetchTime).toLocaleDateString() : 'Never'}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-reply"></i></div>
                            <div class="stat-info">
                                <div class="stat-label">Response Rate</div>
                                <div class="stat-value" id="response-rate">0%</div>
                            </div>
                        </div>
                    </div>

                    <div class="reviews-filters">
                        <div class="filter-group">
                            <label for="rating-filter">Filter by Rating:</label>
                            <select id="rating-filter">
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="response-filter">Response Status:</label>
                            <select id="response-filter">
                                <option value="all">All Reviews</option>
                                <option value="responded">Responded</option>
                                <option value="pending">Needs Response</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="date-filter">Date Range:</label>
                            <select id="date-filter">
                                <option value="all">All Time</option>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                            </select>
                        </div>
                    </div>

                    <div id="reviews-loading" class="loading-state" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i> Loading reviews...
                    </div>

                    <div id="reviews-container" class="reviews-list">
                        <div class="no-reviews-message">
                            <i class="fas fa-star"></i>
                            <p>Click "Refresh Reviews" to fetch your latest Google reviews</p>
                        </div>
                    </div>
                </div>
            `}

            <div class="reviews-help">
                <h4><i class="fas fa-question-circle"></i> About Google Reviews Integration</h4>
                <div class="help-content">
                    <p><strong>Note:</strong> This feature simulates Google Reviews integration. In a production environment, you would need:</p>
                    <ul>
                        <li>Google My Business API access</li>
                        <li>OAuth 2.0 authentication</li>
                        <li>Proper API credentials and permissions</li>
                    </ul>
                    <p>For now, this demonstrates the interface and functionality you would have with full integration.</p>
                </div>
            </div>
        `;

        this.setupFilters();
    }

    setupFilters() {
        const ratingFilter = document.getElementById('rating-filter');
        const responseFilter = document.getElementById('response-filter');
        const dateFilter = document.getElementById('date-filter');

        if (ratingFilter) {
            ratingFilter.addEventListener('change', () => this.filterReviews());
        }
        if (responseFilter) {
            responseFilter.addEventListener('change', () => this.filterReviews());
        }
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterReviews());
        }
    }

    async fetchReviews() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const loadingEl = document.getElementById('reviews-loading');
        const refreshBtn = document.getElementById('refresh-reviews-btn');
        
        if (loadingEl) loadingEl.style.display = 'block';
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }

        try {
            // Simulate API call - in production, this would call Google My Business API
            await this.simulateGoogleReviewsFetch();
            this.displayReviews();
            this.updateStats();
            this.lastFetchTime = Date.now();
            
            // Update last updated time
            const lastUpdatedEl = document.getElementById('last-updated');
            if (lastUpdatedEl) {
                lastUpdatedEl.textContent = new Date().toLocaleDateString();
            }

        } catch (error) {
            console.error('Error fetching reviews:', error);
            this.showError('Failed to fetch reviews. Please try again.');
        } finally {
            this.isLoading = false;
            if (loadingEl) loadingEl.style.display = 'none';
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Reviews';
            }
        }
    }

    async simulateGoogleReviewsFetch() {
        try {
            // Call Firebase function to fetch reviews
            const fetchReviews = firebase.functions().httpsCallable('fetchGoogleReviews');
            const result = await fetchReviews({ breweryId: auth.currentUser.uid });
            
            if (result.data.success) {
                // Convert Firebase function response to local format
                this.reviews = result.data.reviews.map(review => ({
                    id: review.reviewId,
                    author: review.author,
                    rating: review.rating,
                    text: review.text,
                    date: new Date(review.createTime),
                    responded: !!review.reviewReply,
                    response: review.reviewReply?.comment || null,
                    responseDate: review.reviewReply ? new Date(review.reviewReply.updateTime) : null
                }));
                return;
            }
        } catch (error) {
            console.warn('Firebase function failed, using simulated data:', error);
        }
        
        // Fallback to simulated data
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.reviews = [
            {
                id: 'review_1',
                author: 'Sarah Johnson',
                rating: 5,
                text: 'Amazing brewery! The IPA is fantastic and the atmosphere is perfect for a night out. Staff was incredibly knowledgeable about their beers.',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                responded: true,
                response: 'Thank you so much Sarah! We\'re thrilled you enjoyed our IPA. Hope to see you again soon!',
                responseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'review_2',
                author: 'Mike Chen',
                rating: 4,
                text: 'Great selection of beers and good food. The porter was excellent. Only wish they had more seating during busy hours.',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                responded: false
            },
            {
                id: 'review_3',
                author: 'Emily Rodriguez',
                rating: 5,
                text: 'Best brewery in town! Love the seasonal rotations and the staff always has great recommendations. The flight option is perfect for trying new beers.',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                responded: true,
                response: 'Emily, thank you for being such a loyal customer! We love seeing you try our seasonal offerings.',
                responseDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'review_4',
                author: 'David Thompson',
                rating: 3,
                text: 'Decent beer selection but service was a bit slow. The wheat beer was good though.',
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                responded: false
            },
            {
                id: 'review_5',
                author: 'Lisa Park',
                rating: 5,
                text: 'Absolutely love this place! The brewery tour was informative and the tasting was amazing. Will definitely be back!',
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                responded: true,
                response: 'Thanks Lisa! We\'re so glad you enjoyed the tour. Our brewmaster loves sharing the process with visitors!',
                responseDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
            }
        ];
    }

    displayReviews() {
        const container = document.getElementById('reviews-container');
        if (!container) return;

        if (this.reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews-message">
                    <i class="fas fa-star"></i>
                    <p>No reviews found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.reviews.map(review => `
            <div class="review-item" data-rating="${review.rating}" data-responded="${review.responded}" data-date="${review.date.getTime()}">
                <div class="review-header">
                    <div class="review-author">
                        <div class="author-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="author-info">
                            <div class="author-name">${review.author}</div>
                            <div class="review-date">${review.date.toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${this.generateStars(review.rating)}
                    </div>
                </div>
                
                <div class="review-content">
                    <p>${review.text}</p>
                </div>
                
                ${review.responded ? `
                    <div class="review-response">
                        <div class="response-header">
                            <i class="fas fa-reply"></i>
                            <strong>Response from ${this.breweryData?.name || 'Brewery'}</strong>
                            <span class="response-date">${review.responseDate.toLocaleDateString()}</span>
                        </div>
                        <p>${review.response}</p>
                    </div>
                ` : `
                    <div class="review-actions">
                        <button class="respond-review-btn btn btn-primary btn-small" data-review-id="${review.id}">
                            <i class="fas fa-reply"></i> Respond
                        </button>
                    </div>
                `}
            </div>
        `).join('');
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star star-filled"></i>';
            } else {
                stars += '<i class="far fa-star star-empty"></i>';
            }
        }
        return stars;
    }

    updateStats() {
        const avgRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
        const responseRate = (this.reviews.filter(r => r.responded).length / this.reviews.length) * 100;

        const avgRatingEl = document.getElementById('avg-rating');
        const totalReviewsEl = document.getElementById('total-reviews');
        const responseRateEl = document.getElementById('response-rate');

        if (avgRatingEl) avgRatingEl.textContent = avgRating.toFixed(1);
        if (totalReviewsEl) totalReviewsEl.textContent = this.reviews.length;
        if (responseRateEl) responseRateEl.textContent = `${Math.round(responseRate)}%`;
    }

    filterReviews() {
        const ratingFilter = document.getElementById('rating-filter')?.value;
        const responseFilter = document.getElementById('response-filter')?.value;
        const dateFilter = document.getElementById('date-filter')?.value;

        const reviewItems = document.querySelectorAll('.review-item');
        
        reviewItems.forEach(item => {
            let show = true;

            // Rating filter
            if (ratingFilter !== 'all') {
                const rating = parseInt(item.dataset.rating);
                if (rating !== parseInt(ratingFilter)) {
                    show = false;
                }
            }

            // Response filter
            if (responseFilter !== 'all') {
                const responded = item.dataset.responded === 'true';
                if (responseFilter === 'responded' && !responded) {
                    show = false;
                } else if (responseFilter === 'pending' && responded) {
                    show = false;
                }
            }

            // Date filter
            if (dateFilter !== 'all') {
                const reviewDate = parseInt(item.dataset.date);
                const daysAgo = parseInt(dateFilter);
                const cutoffDate = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
                if (reviewDate < cutoffDate) {
                    show = false;
                }
            }

            item.style.display = show ? 'block' : 'none';
        });
    }

    showResponseModal(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) return;

        const modal = document.createElement('div');
        modal.className = 'response-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Respond to Review</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    
                    <div class="original-review">
                        <div class="review-header">
                            <strong>${review.author}</strong>
                            <div class="review-rating">${this.generateStars(review.rating)}</div>
                        </div>
                        <p>${review.text}</p>
                    </div>
                    
                    <div class="response-form">
                        <label for="response-text">Your Response:</label>
                        <textarea id="response-text" rows="4" placeholder="Thank you for your review..."></textarea>
                        
                        <div class="response-templates">
                            <label>Quick Templates:</label>
                            <div class="template-buttons">
                                <button class="template-btn" data-template="Thank you for your wonderful review! We're thrilled you enjoyed your experience with us.">Positive Response</button>
                                <button class="template-btn" data-template="Thank you for your feedback. We appreciate you taking the time to share your experience and will use this to improve.">Neutral Response</button>
                                <button class="template-btn" data-template="Thank you for bringing this to our attention. We'd love to discuss this further - please contact us directly so we can make this right.">Concern Response</button>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button id="submit-response" class="btn btn-primary">Submit Response</button>
                            <button class="close-modal btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal-overlay')) {
                document.body.removeChild(modal);
            }
        });

        // Template buttons
        modal.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('response-text').value = btn.dataset.template;
            });
        });

        // Submit response
        modal.querySelector('#submit-response').addEventListener('click', () => {
            const responseText = document.getElementById('response-text').value.trim();
            if (responseText) {
                this.submitResponse(reviewId, responseText);
                document.body.removeChild(modal);
            }
        });
    }

    async submitResponse(reviewId, responseText) {
        try {
            // Try to call Firebase function first
            try {
                const respondToReview = firebase.functions().httpsCallable('respondToGoogleReview');
                const result = await respondToReview({ reviewId, responseText });
                
                if (result.data.success) {
                    // Update local data
                    const review = this.reviews.find(r => r.id === reviewId);
                    if (review) {
                        review.responded = true;
                        review.response = responseText;
                        review.responseDate = new Date();
                    }
                    
                    this.displayReviews();
                    this.updateStats();
                    this.showSuccess('Response submitted successfully!');
                    return;
                }
            } catch (firebaseError) {
                console.warn('Firebase function failed, using local simulation:', firebaseError);
            }
            
            // Fallback to local simulation
            const review = this.reviews.find(r => r.id === reviewId);
            if (review) {
                review.responded = true;
                review.response = responseText;
                review.responseDate = new Date();
                
                this.displayReviews();
                this.updateStats();
                
                this.showSuccess('Response submitted successfully! (Simulated)');
            }
        } catch (error) {
            console.error('Error submitting response:', error);
            this.showError('Failed to submit response. Please try again.');
        }
    }

    exportReviews() {
        if (this.reviews.length === 0) {
            this.showError('No reviews to export');
            return;
        }

        const csvData = this.reviews.map(review => ({
            Author: review.author,
            Rating: review.rating,
            Date: review.date.toLocaleDateString(),
            Review: review.text.replace(/"/g, '""'),
            Responded: review.responded ? 'Yes' : 'No',
            Response: review.response ? review.response.replace(/"/g, '""') : '',
            ResponseDate: review.responseDate ? review.responseDate.toLocaleDateString() : ''
        }));

        const csv = this.convertToCSV(csvData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `google-reviews-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Reviews exported successfully!');
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => 
            headers.map(header => `"${row[header]}"`).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message-toast ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
        `;

        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 3000);
    }
}

// Initialize when DOM is loaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.googleReviewsManager = new GoogleReviewsManager();
    });
} else {
    window.googleReviewsManager = new GoogleReviewsManager();
}