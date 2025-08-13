// BrewMetrics Application Testing Automation Script
// Run this in browser console to perform automated tests

class BrewMetricsTestSuite {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
        this.testStartTime = null;
    }

    // Initialize test suite
    async runAllTests() {
        console.log('🧪 Starting BrewMetrics Test Suite...');
        this.testStartTime = Date.now();
        
        try {
            await this.testAuthentication();
            await this.testDashboardLoad();
            await this.testBatchManagement();
            await this.testInventorySystem();
            await this.testAIAssistant();
            await this.testQRGeneration();
            await this.testAnalytics();
            
            this.generateTestReport();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    // Test helper methods
    startTest(testName) {
        this.currentTest = {
            name: testName,
            startTime: Date.now(),
            status: 'running'
        };
        console.log(`🔄 Testing: ${testName}`);
    }

    passTest(message = '') {
        if (this.currentTest) {
            this.currentTest.status = 'passed';
            this.currentTest.endTime = Date.now();
            this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
            this.currentTest.message = message;
            this.testResults.push({...this.currentTest});
            console.log(`✅ ${this.currentTest.name} - ${message}`);
        }
    }

    failTest(error) {
        if (this.currentTest) {
            this.currentTest.status = 'failed';
            this.currentTest.endTime = Date.now();
            this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
            this.currentTest.error = error.message || error;
            this.testResults.push({...this.currentTest});
            console.log(`❌ ${this.currentTest.name} - ${error.message || error}`);
        }
    }

    // Authentication Tests
    async testAuthentication() {
        this.startTest('Authentication System');
        
        try {
            // Check if Firebase auth is initialized
            if (typeof firebase === 'undefined' || !firebase.auth) {
                throw new Error('Firebase authentication not initialized');
            }

            // Check current auth state
            const user = firebase.auth().currentUser;
            if (!user) {
                throw new Error('No user currently authenticated');
            }

            this.passTest(`User authenticated: ${user.email || user.uid}`);
        } catch (error) {
            this.failTest(error);
        }
    }

    // Dashboard Load Tests
    async testDashboardLoad() {
        this.startTest('Dashboard Loading');
        
        try {
            // Check if main dashboard elements exist
            const requiredElements = [
                '#app-container',
                '#sidebar',
                '#dashboard-content-area',
                '.summary-cards-container'
            ];

            for (const selector of requiredElements) {
                const element = document.querySelector(selector);
                if (!element) {
                    throw new Error(`Required element not found: ${selector}`);
                }
            }

            // Check if navigation works
            const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
            if (navLinks.length === 0) {
                throw new Error('No navigation links found');
            }

            this.passTest(`Dashboard loaded with ${navLinks.length} navigation items`);
        } catch (error) {
            this.failTest(error);
        }
    }

    // Batch Management Tests
    async testBatchManagement() {
        this.startTest('Batch Management System');
        
        try {
            // Navigate to batch management section
            const batchSection = document.getElementById('batch-management-section');
            if (!batchSection) {
                throw new Error('Batch management section not found');
            }

            // Check for batch list
            const batchList = document.querySelector('#feedback-summary-container ul');
            if (!batchList) {
                throw new Error('Batch list container not found');
            }

            // Check for export buttons
            const exportButton = document.getElementById('export-all-csv-button');
            const compareButton = document.getElementById('compare-batches-button');
            
            if (!exportButton || !compareButton) {
                throw new Error('Batch management controls not found');
            }

            this.passTest('Batch management interface loaded successfully');
        } catch (error) {
            this.failTest(error);
        }
    }

    // Inventory System Tests
    async testInventorySystem() {
        this.startTest('Inventory Management');
        
        try {
            // Check if inventory page is accessible
            const inventoryExists = await this.checkPageExists('inventory.html');
            if (!inventoryExists) {
                throw new Error('Inventory page not accessible');
            }

            // Check for inventory manager
            if (typeof window.inventoryManager === 'undefined') {
                console.warn('Inventory manager not loaded in current context');
            }

            this.passTest('Inventory system accessible');
        } catch (error) {
            this.failTest(error);
        }
    }

    // AI Assistant Tests
    async testAIAssistant() {
        this.startTest('AI Brewmaster Assistant');
        
        try {
            // Check AI assistant section
            const aiSection = document.getElementById('ai-assistant-section');
            if (!aiSection) {
                throw new Error('AI assistant section not found');
            }

            // Check for chat interface
            const chatMessages = document.getElementById('ai-messages');
            const promptInput = document.getElementById('ai-prompt');
            const sendButton = document.getElementById('ai-send');

            if (!chatMessages || !promptInput || !sendButton) {
                throw new Error('AI chat interface elements missing');
            }

            // Check if AI Brewmaster is initialized
            if (typeof window.AIBrewmaster === 'undefined') {
                throw new Error('AI Brewmaster not initialized');
            }

            this.passTest('AI Assistant interface loaded');
        } catch (error) {
            this.failTest(error);
        }
    }

    // QR Code Generation Tests
    async testQRGeneration() {
        this.startTest('QR Code Generation');
        
        try {
            // Check QR code section
            const qrSection = document.getElementById('qr-code-section');
            if (!qrSection) {
                throw new Error('QR code section not found');
            }

            // Check QR code display
            const qrDisplay = document.getElementById('qr-code-display');
            const qrLink = document.getElementById('qr-code-link');
            
            if (!qrDisplay || !qrLink) {
                throw new Error('QR code elements not found');
            }

            // Check if QR code library is loaded
            if (typeof QRCode === 'undefined') {
                throw new Error('QR code library not loaded');
            }

            this.passTest('QR code generation system ready');
        } catch (error) {
            this.failTest(error);
        }
    }

    // Analytics Tests
    async testAnalytics() {
        this.startTest('Advanced Analytics');
        
        try {
            // Check analytics section
            const analyticsSection = document.getElementById('advanced-analytics-section');
            if (!analyticsSection) {
                throw new Error('Analytics section not found');
            }

            // Check for Chart.js
            if (typeof Chart === 'undefined') {
                throw new Error('Chart.js library not loaded');
            }

            // Check for analytics scripts
            const analyticsScripts = [
                'real-analytics.js',
                'advanced-analytics.js'
            ];

            let scriptsLoaded = 0;
            const scripts = document.querySelectorAll('script[src]');
            scripts.forEach(script => {
                const src = script.getAttribute('src');
                if (analyticsScripts.some(name => src && src.includes(name))) {
                    scriptsLoaded++;
                }
            });

            this.passTest(`Analytics system loaded (${scriptsLoaded} scripts found)`);
        } catch (error) {
            this.failTest(error);
        }
    }

    // Helper method to check if page exists
    async checkPageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Generate comprehensive test report
    generateTestReport() {
        const totalTime = Date.now() - this.testStartTime;
        const passed = this.testResults.filter(t => t.status === 'passed').length;
        const failed = this.testResults.filter(t => t.status === 'failed').length;
        const total = this.testResults.length;

        console.log('\n📊 BrewMetrics Test Report');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed} ✅`);
        console.log(`Failed: ${failed} ❌`);
        console.log(`Success Rate: ${((passed/total) * 100).toFixed(1)}%`);
        console.log(`Total Time: ${totalTime}ms`);
        console.log('='.repeat(50));

        // Detailed results
        this.testResults.forEach(test => {
            const status = test.status === 'passed' ? '✅' : '❌';
            const duration = test.duration ? `(${test.duration}ms)` : '';
            console.log(`${status} ${test.name} ${duration}`);
            if (test.message) console.log(`   ${test.message}`);
            if (test.error) console.log(`   Error: ${test.error}`);
        });

        // Return results for programmatic access
        return {
            total,
            passed,
            failed,
            successRate: (passed/total) * 100,
            totalTime,
            results: this.testResults
        };
    }

    // Test specific functionality
    async testBatchCreation() {
        this.startTest('Batch Creation');
        
        try {
            // Navigate to batch entry section
            const batchEntrySection = document.getElementById('batch-entry-section');
            if (!batchEntrySection) {
                throw new Error('Batch entry section not found');
            }

            // Check form elements
            const form = document.getElementById('batch-entry-form');
            const beerNameInput = document.getElementById('beer-name');
            const beerIntroInput = document.getElementById('beer-intro');
            
            if (!form || !beerNameInput || !beerIntroInput) {
                throw new Error('Batch creation form elements missing');
            }

            this.passTest('Batch creation form ready');
        } catch (error) {
            this.failTest(error);
        }
    }

    // Test data integrity
    async testDataIntegrity() {
        this.startTest('Data Integrity');
        
        try {
            // Check Firebase connection
            if (!firebase.firestore) {
                throw new Error('Firestore not available');
            }

            // Test database connection
            const db = firebase.firestore();
            const testDoc = await db.collection('test').doc('connection').get();
            
            this.passTest('Database connection verified');
        } catch (error) {
            this.failTest(error);
        }
    }

    // Performance tests
    async testPerformance() {
        this.startTest('Performance Metrics');
        
        try {
            const performanceData = {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
            };

            if (performanceData.loadTime > 5000) {
                throw new Error(`Page load time too slow: ${performanceData.loadTime}ms`);
            }

            this.passTest(`Load time: ${performanceData.loadTime}ms`);
        } catch (error) {
            this.failTest(error);
        }
    }
}

// Quick test functions for manual testing
window.testBrewMetrics = {
    // Run full test suite
    runAll: async () => {
        const suite = new BrewMetricsTestSuite();
        return await suite.runAllTests();
    },

    // Test specific components
    testAuth: async () => {
        const suite = new BrewMetricsTestSuite();
        await suite.testAuthentication();
        return suite.testResults;
    },

    testDashboard: async () => {
        const suite = new BrewMetricsTestSuite();
        await suite.testDashboardLoad();
        return suite.testResults;
    },

    testAI: async () => {
        const suite = new BrewMetricsTestSuite();
        await suite.testAIAssistant();
        return suite.testResults;
    },

    // Test data operations
    testDataFlow: async () => {
        console.log('🔄 Testing data flow...');
        
        // Test batch creation → survey → response → analytics flow
        try {
            // Check if we can access the survey URL
            const qrLink = document.getElementById('qr-code-link');
            if (qrLink && qrLink.value) {
                console.log('✅ Survey URL generated:', qrLink.value);
            }

            // Check if batches are loaded
            const batchList = document.querySelector('#feedback-summary-container ul');
            if (batchList) {
                const batches = batchList.querySelectorAll('li:not(.no-data)');
                console.log(`✅ ${batches.length} batches loaded`);
            }

            console.log('✅ Data flow test completed');
        } catch (error) {
            console.error('❌ Data flow test failed:', error);
        }
    },

    // Test integrations
    testIntegrations: async () => {
        console.log('🔄 Testing integrations...');
        
        const integrations = {
            firebase: typeof firebase !== 'undefined',
            firestore: typeof firebase !== 'undefined' && firebase.firestore,
            auth: typeof firebase !== 'undefined' && firebase.auth,
            functions: typeof firebase !== 'undefined' && firebase.functions,
            chartjs: typeof Chart !== 'undefined',
            qrcode: typeof QRCode !== 'undefined',
            aiBrewmaster: typeof window.AIBrewmaster !== 'undefined',
            inventoryManager: typeof window.inventoryManager !== 'undefined'
        };

        Object.entries(integrations).forEach(([name, available]) => {
            const status = available ? '✅' : '❌';
            console.log(`${status} ${name}: ${available ? 'Available' : 'Not loaded'}`);
        });

        return integrations;
    },

    // Generate test data
    generateTestData: async () => {
        console.log('🔄 Generating test data...');
        
        if (!firebase.auth().currentUser) {
            console.error('❌ Must be authenticated to generate test data');
            return;
        }

        try {
            const db = firebase.firestore();
            const userId = firebase.auth().currentUser.uid;

            // Create test batch
            const testBatch = {
                beerName: 'Test IPA',
                beerIntro: 'A test IPA for automated testing',
                abv: 6.5,
                ibu: 65,
                batchCode: 'TEST-001',
                isActive: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('breweries').doc(userId).collection('batches').add(testBatch);
            console.log('✅ Test batch created');

            // Create test inventory item
            const testInventory = {
                fermentables: [{
                    id: 'test-001',
                    name: 'Test Pale Malt',
                    quantity: 50,
                    unit: 'lbs',
                    cost: 1.20,
                    supplier: 'Test Supplier',
                    reorderPoint: 25
                }]
            };

            await db.collection('breweries').doc(userId).collection('inventory').doc('current').set(testInventory, { merge: true });
            console.log('✅ Test inventory created');

        } catch (error) {
            console.error('❌ Test data generation failed:', error);
        }
    }
};

// Auto-run basic tests when script loads
console.log('🧪 BrewMetrics Test Automation Loaded');
console.log('Run testBrewMetrics.runAll() to start comprehensive testing');
console.log('Available commands:', Object.keys(window.testBrewMetrics));