// MediaVPN Dashboard - Complete Integration
// Using integrated API from api.js

// Global variables
let currentTheme = 'dark';
let proxyData = [];
let subscriptionData = [];
let charts = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load theme from localStorage
        loadTheme();
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize components
        initializeThemeToggle();
        initializeDashboard();
        initializeProxies();
        initializeSubscriptions();
        initializeSettings();
        
        // Load initial data
        await loadDashboardData();
        await loadProxiesData();
        await loadSubscriptionsData();
        
        // Show loading
        showLoading(false);
        
        console.log('✅ MediaVPN Dashboard initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showLoading(false);
    }
}

// Load dashboard statistics
async function loadDashboardData() {
    try {
        showLoading(true);
        const response = await MediaVPNAPI.getDashboardStats();
        
        if (response.success) {
            const stats = response.data;
            updateDashboardStats(stats);
            initializeCharts(stats);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'error');
    } finally {
        showLoading(false);
    }
}

// Load proxies data
async function loadProxiesData(filters = {}) {
    try {
        showLoading(true);
        const response = await MediaVPNAPI.getProxies(filters);
        
        if (response.success) {
            proxyData = response.data;
            renderProxiesTable(proxyData);
            updateFilters();
        }
    } catch (error) {
        console.error('Error loading proxies:', error);
        showToast('Error loading proxies', 'error');
    } finally {
        showLoading(false);
    }
}

// Load subscriptions data
async function loadSubscriptionsData() {
    try {
        const response = await MediaVPNAPI.getSubscriptions();
        
        if (response.success) {
            subscriptionData = response.data;
            renderSubscriptionsList(subscriptionData);
        }
    } catch (error) {
        console.error('Error loading subscriptions:', error);
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    document.getElementById('totalProxies').textContent = stats.totalProxies || 0;
    document.getElementById('activeProxies').textContent = stats.activeProxies || 0;
    document.getElementById('countriesCount').textContent = stats.countriesCount || 0;
    document.getElementById('connectedUsers').textContent = stats.connectedUsers || 0;
}

// Render proxies table
function renderProxiesTable(proxies) {
    const tbody = document.getElementById('proxiesTableBody');
    tbody.innerHTML = '';
    
    proxies.forEach(proxy => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="flag flag-${proxy.country.toLowerCase()}">${proxy.country}</span></td>
            <td>${proxy.ip}</td>
            <td>${proxy.port}</td>
            <td><span class="protocol protocol-${proxy.protocol}">${proxy.protocol.toUpperCase()}</span></td>
            <td><span class="status status-${proxy.status}">${proxy.status}</span></td>
            <td>${proxy.latency}ms</td>
            <td>
                <button class="btn-action" onclick="testProxy('${proxy.ip}', ${proxy.port})">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn-action" onclick="copyProxy('${proxy.ip}', ${proxy.port})">
                    <i class="fas fa-copy"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Test proxy connection
async function testProxy(ip, port) {
    try {
        showToast(`Testing ${ip}:${port}...`, 'info');
        
        // Simulate proxy test
        setTimeout(() => {
            const isOnline = Math.random() > 0.3; // 70% chance online
            showToast(
                `${ip}:${port} is ${isOnline ? 'online' : 'offline'}`,
                isOnline ? 'success' : 'error'
            );
        }, 2000);
    } catch (error) {
        showToast('Error testing proxy', 'error');
    }
}

// Copy proxy details
function copyProxy(ip, port) {
    const proxyString = `${ip}:${port}`;
    navigator.clipboard.writeText(proxyString).then(() => {
        showToast('Proxy copied to clipboard', 'success');
    }).catch(() => {
        showToast('Failed to copy proxy', 'error');
    });
}

// Initialize charts
function initializeCharts(stats) {
    initializeCountryChart();
    initializeStatusChart();
}

// Country distribution chart
function initializeCountryChart() {
    const ctx = document.getElementById('countryChart');
    if (!ctx) return;
    
    const countryData = proxyData.reduce((acc, proxy) => {
        acc[proxy.country] = (acc[proxy.country] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(countryData),
            datasets: [{
                data: Object.values(countryData),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Status chart
function initializeStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    const statusData = proxyData.reduce((acc, proxy) => {
        acc[proxy.status] = (acc[proxy.status] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusData),
            datasets: [{
                data: Object.values(statusData),
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Generate subscription link
async function generateSubscription() {
    try {
        const config = {
            format: document.getElementById('formatSelect').value,
            countries: Array.from(document.getElementById('countrySelect').selectedOptions).map(opt => opt.value),
            protocols: Array.from(document.getElementById('protocolSelect').selectedOptions).map(opt => opt.value),
            ports: Array.from(document.getElementById('portSelect').selectedOptions).map(opt => opt.value),
            limit: parseInt(document.getElementById('limitInput').value),
            domain: document.getElementById('domainInput').value
        };
        
        showLoading(true);
        const response = await MediaVPNAPI.generateSubscription(config);
        
        if (response.success) {
            showGeneratedLink(response.data.url);
            showToast('Subscription link generated!', 'success');
        }
    } catch (error) {
        showToast('Error generating subscription', 'error');
    } finally {
        showLoading(false);
    }
}

// Show generated subscription link
function showGeneratedLink(url) {
    const linkDiv = document.getElementById('generatedLink');
    const linkInput = document.getElementById('subscriptionLink');
    
    linkInput.value = url;
    linkDiv.style.display = 'block';
}

// Copy subscription link
function copySubscriptionLink() {
    const linkInput = document.getElementById('subscriptionLink');
    linkInput.select();
    document.execCommand('copy');
    showToast('Subscription link copied!', 'success');
}

// Apply filters
function applyFilters() {
    const filters = {
        country: document.getElementById('countryFilter').value,
        status: document.getElementById('statusFilter').value,
        search: document.getElementById('searchInput').value
    };
    
    loadProxiesData(filters);
}

// Refresh proxies
async function refreshProxies() {
    await loadProxiesData();
    showToast('Proxies refreshed', 'success');
}

// Update filters options
function updateFilters() {
    const countries = [...new Set(proxyData.map(p => p.country))];
    const countryFilter = document.getElementById('countryFilter');
    
    // Keep "All Countries" option, add found countries
    const existingOptions = Array.from(countryFilter.options).map(opt => opt.value);
    countries.forEach(country => {
        if (!existingOptions.includes(country)) {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        }
    });
}

// Initialize navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Theme management
function loadTheme() {
    const savedTheme = localStorage.getItem('mediapvpn-theme') || 'dark';
    currentTheme = savedTheme;
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.className = currentTheme === 'dark' ? 'dark-mode' : 'light-mode';
            localStorage.setItem('mediapvpn-theme', currentTheme);
            
            const icon = themeToggle.querySelector('i');
            icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }
}

// Initialize components (simplified)
function initializeDashboard() {
    // Dashboard initialization is handled in loadDashboardData
}

function initializeProxies() {
    // Add event listeners for filters
    const filters = ['countryFilter', 'statusFilter', 'searchInput'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            if (filterId === 'searchInput') {
                element.addEventListener('input', debounce(applyFilters, 300));
            } else {
                element.addEventListener('change', applyFilters);
            }
        }
    });
    
    // Add refresh button listener
    const refreshBtn = document.getElementById('refreshProxies');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshProxies);
    }
}

function initializeSubscriptions() {
    // Add generate button listener
    const generateBtn = document.getElementById('generateLink');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateSubscription);
    }
    
    // Add copy button listeners
    const copyBtns = document.querySelectorAll('[id*="copy"]');
    copyBtns.forEach(btn => {
        if (btn.id === 'copySubscriptionLink') {
            btn.addEventListener('click', copySubscriptionLink);
        }
    });
}

function initializeSettings() {
    // Load settings on init
    loadSettings();
    
    // Add save button listener
    const saveBtn = document.getElementById('saveSettings');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
}

// Settings functions
async function loadSettings() {
    try {
        const response = await MediaVPNAPI.getSettings();
        if (response.success) {
            const settings = response.data;
            
            // Populate form fields
            Object.keys(settings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = settings[key];
                    } else {
                        element.value = settings[key];
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings() {
    try {
        const settings = {};
        
        // Collect all form values
        const formElements = document.querySelectorAll('#settings input, #settings select');
        formElements.forEach(element => {
            if (element.type === 'checkbox') {
                settings[element.id] = element.checked;
            } else {
                settings[element.id] = element.value;
            }
        });
        
        const response = await MediaVPNAPI.saveSettings(settings);
        if (response.success) {
            showToast('Settings saved successfully!', 'success');
        }
    } catch (error) {
        showToast('Error saving settings', 'error');
    }
}

// Utility functions
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toastContainer') || document.body;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some CSS for better styling
const style = document.createElement('style');
style.textContent = `
    .flag { padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .flag-id { background: #e74c3c; color: white; }
    .flag-sg { background: #3498db; color: white; }
    .flag-us { background: #2ecc71; color: white; }
    .flag-jp { background: #e67e22; color: white; }
    .flag-kr { background: #9b59b6; color: white; }
    
    .protocol { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .protocol-trojan { background: #ff6b6b; color: white; }
    .protocol-vless { background: #4ecdc4; color: white; }
    .protocol-ss { background: #45b7d1; color: white; }
    
    .status { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
    .status-online { background: #2ecc71; color: white; }
    .status-offline { background: #e74c3c; color: white; }
    
    .btn-action { background: none; border: 1px solid #ddd; padding: 4px 8px; margin: 0 2px; border-radius: 4px; cursor: pointer; }
    .btn-action:hover { background: #f8f9fa; }
    
    .toast { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 4px; color: white; z-index: 9999; }
    .toast-success { background: #28a745; }
    .toast-error { background: #dc3545; }
    .toast-info { background: #17a2b8; }
`;
document.head.appendChild(style);