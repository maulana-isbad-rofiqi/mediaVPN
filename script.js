// Global variables
let currentTheme = 'dark';
let proxyData = [];
let subscriptionData = [];
let charts = {};

// Sample data
const sampleProxies = [
    { country: 'ID', ip: '103.152.112.162', port: 80, protocol: 'trojan', status: 'online', latency: 45, org: 'PT Artha Telekomindo' },
    { country: 'SG', ip: '172.104.46.25', port: 443, protocol: 'vless', status: 'online', latency: 12, org: 'DigitalOcean' },
    { country: 'US', ip: '142.4.215.115', port: 443, protocol: 'ss', status: 'online', latency: 8, org: 'OVH' },
    { country: 'JP', ip: '157.112.145.88', port: 80, protocol: 'trojan', status: 'offline', latency: 0, org: 'Hostinger' },
    { country: 'KR', ip: '101.79.200.150', port: 443, protocol: 'vless', status: 'online', latency: 23, org: 'KT' },
    { country: 'ID', ip: '103.175.126.35', port: 80, protocol: 'ss', status: 'online', latency: 67, org: 'Biznet' },
    { country: 'SG', ip: '178.128.81.209', port: 443, protocol: 'trojan', status: 'offline', latency: 0, org: 'DigitalOcean' },
    { country: 'US', ip: '192.155.90.118', port: 443, protocol: 'vless', status: 'online', latency: 15, org: 'Linode' },
    { country: 'JP', ip: '150.95.146.66', port: 80, protocol: 'ss', status: 'online', latency: 31, org: 'ConoHa' },
    { country: 'KR', ip: '218.38.137.114', port: 443, protocol: 'trojan', status: 'offline', latency: 0, org: 'SK Broadband' }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
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
    loadDashboardData();
    loadProxiesData();
    
    // Show loading
    showLoading(false);
}

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('mediapvpn-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const body = document.body;
    
    if (currentTheme === 'dark') {
        currentTheme = 'light';
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        currentTheme = 'dark';
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    localStorage.setItem('mediapvpn-theme', currentTheme);
    updateChartsTheme();
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
        
        // Initialize section-specific components
        if (sectionId === 'dashboard') {
            updateDashboardCharts();
        } else if (sectionId === 'proxies') {
            renderProxiesTable();
        } else if (sectionId === 'subscriptions') {
            renderSubscriptionsList();
        }
    }
}

// Dashboard
function initializeDashboard() {
    // Dashboard will be initialized with sample data
}

function loadDashboardData() {
    // Simulate loading dashboard data
    setTimeout(() => {
        updateDashboardStats();
        initializeDashboardCharts();
    }, 1000);
}

function updateDashboardStats() {
    const totalProxies = proxyData.length;
    const activeProxies = proxyData.filter(p => p.status === 'online').length;
    const countries = [...new Set(proxyData.map(p => p.country))].length;
    const connectedUsers = Math.floor(Math.random() * 1000) + 100;
    
    document.getElementById('totalProxies').textContent = totalProxies;
    document.getElementById('activeProxies').textContent = activeProxies;
    document.getElementById('countriesCount').textContent = countries;
    document.getElementById('connectedUsers').textContent = connectedUsers.toLocaleString();
}

function initializeDashboardCharts() {
    // Country Distribution Chart
    const countryCtx = document.getElementById('countryChart').getContext('2d');
    const countryData = getCountryDistribution();
    
    charts.country = new Chart(countryCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(countryData),
            datasets: [{
                data: Object.values(countryData),
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getTextColor(),
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
    
    // Status Chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    const onlineCount = proxyData.filter(p => p.status === 'online').length;
    const offlineCount = proxyData.filter(p => p.status === 'offline').length;
    
    charts.status = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['Online', 'Offline'],
            datasets: [{
                data: [onlineCount, offlineCount],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getTextColor(),
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

function updateDashboardCharts() {
    if (charts.country) {
        charts.country.destroy();
    }
    if (charts.status) {
        charts.status.destroy();
    }
    initializeDashboardCharts();
}

function getCountryDistribution() {
    const distribution = {};
    proxyData.forEach(proxy => {
        distribution[proxy.country] = (distribution[proxy.country] || 0) + 1;
    });
    return distribution;
}

function updateChartsTheme() {
    // Update chart colors when theme changes
    if (charts.country) {
        charts.country.options.plugins.legend.labels.color = getTextColor();
        charts.country.update();
    }
    if (charts.status) {
        charts.status.options.plugins.legend.labels.color = getTextColor();
        charts.status.update();
    }
}

function getTextColor() {
    return currentTheme === 'dark' ? '#f8fafc' : '#1e293b';
}

// Proxies Management
function initializeProxies() {
    // Initialize proxy filters
    document.getElementById('countryFilter').addEventListener('change', renderProxiesTable);
    document.getElementById('statusFilter').addEventListener('change', renderProxiesTable);
    document.getElementById('searchInput').addEventListener('input', renderProxiesTable);
    
    // Initialize proxy actions
    document.getElementById('refreshProxies').addEventListener('click', refreshProxies);
    document.getElementById('addProxy').addEventListener('click', showAddProxyModal);
}

function loadProxiesData() {
    proxyData = [...sampleProxies];
    
    // Populate country filter
    const countries = [...new Set(proxyData.map(p => p.country))];
    const countryFilter = document.getElementById('countryFilter');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = getCountryName(country);
        countryFilter.appendChild(option);
    });
    
    renderProxiesTable();
}

function renderProxiesTable() {
    const tbody = document.getElementById('proxiesTableBody');
    tbody.innerHTML = '';
    
    // Get filters
    const countryFilter = document.getElementById('countryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter proxies
    let filteredProxies = proxyData;
    
    if (countryFilter) {
        filteredProxies = filteredProxies.filter(p => p.country === countryFilter);
    }
    
    if (statusFilter) {
        filteredProxies = filteredProxies.filter(p => p.status === statusFilter);
    }
    
    if (searchTerm) {
        filteredProxies = filteredProxies.filter(p => 
            p.ip.toLowerCase().includes(searchTerm) ||
            p.org.toLowerCase().includes(searchTerm)
        );
    }
    
    // Render filtered proxies
    filteredProxies.forEach(proxy => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <span class="country-flag">${getCountryFlag(proxy.country)}</span>
                ${getCountryName(proxy.country)}
            </td>
            <td>${proxy.ip}</td>
            <td>${proxy.port}</td>
            <td>${proxy.protocol.toUpperCase()}</td>
            <td>
                <span class="status-badge ${proxy.status}">
                    <i class="fas ${proxy.status === 'online' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${proxy.status}
                </span>
            </td>
            <td>
                <span class="latency-badge ${getLatencyClass(proxy.latency)}">
                    ${proxy.latency > 0 ? proxy.latency + 'ms' : 'N/A'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="testProxy('${proxy.ip}:${proxy.port}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="editProxy('${proxy.ip}:${proxy.port}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProxy('${proxy.ip}:${proxy.port}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function refreshProxies() {
    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        showToast('Proxies refreshed successfully', 'success');
        showLoading(false);
    }, 2000);
}

function testProxy(proxyAddress) {
    showLoading(true);
    
    // Simulate proxy testing
    setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
            showToast(`Proxy ${proxyAddress} is working correctly`, 'success');
        } else {
            showToast(`Proxy ${proxyAddress} is not responding`, 'error');
        }
        showLoading(false);
    }, 1500);
}

function editProxy(proxyAddress) {
    showToast(`Edit proxy: ${proxyAddress}`, 'info');
}

function deleteProxy(proxyAddress) {
    if (confirm(`Are you sure you want to delete proxy ${proxyAddress}?`)) {
        showToast(`Proxy ${proxyAddress} deleted`, 'success');
    }
}

function showAddProxyModal() {
    showToast('Add proxy functionality coming soon', 'info');
}

// Subscriptions
function initializeSubscriptions() {
    // Initialize subscription form
    document.getElementById('generateLink').addEventListener('click', generateSubscriptionLink);
    document.getElementById('copyLink').addEventListener('click', copySubscriptionLink);
    document.getElementById('copySubscriptionLink').addEventListener('click', copySubscriptionLink);
    
    // Initialize subscription data
    subscriptionData = [
        {
            id: 1,
            name: 'Indonesia Proxies',
            format: 'raw',
            countries: ['ID'],
            protocols: ['trojan', 'vless'],
            ports: [80, 443],
            limit: 10,
            domain: 'your-domain.com',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'Global Proxies',
            format: 'clash',
            countries: ['US', 'SG', 'JP'],
            protocols: ['trojan', 'vless', 'ss'],
            ports: [443],
            limit: 25,
            domain: 'your-domain.com',
            createdAt: '2024-01-14'
        }
    ];
}

function generateSubscriptionLink() {
    const format = document.getElementById('formatSelect').value;
    const countries = Array.from(document.getElementById('countrySelect').selectedOptions).map(o => o.value);
    const protocols = Array.from(document.getElementById('protocolSelect').selectedOptions).map(o => o.value);
    const ports = Array.from(document.getElementById('portSelect').selectedOptions).map(o => o.value);
    const limit = document.getElementById('limitInput').value;
    const domain = document.getElementById('domainInput').value || 'your-domain.com';
    
    // Generate subscription link based on Nautica API structure
    let link = `https://${domain}/api/v1/sub?format=${format}&limit=${limit}&domain=${domain}`;
    
    if (countries.length > 0) {
        link += `&cc=${countries.join(',')}`;
    }
    
    if (protocols.length > 0) {
        link += `&vpn=${protocols.join(',')}`;
    }
    
    if (ports.length > 0) {
        link += `&port=${ports.join(',')}`;
    }
    
    // Show generated link
    const generatedLinkDiv = document.getElementById('generatedLink');
    const subscriptionLinkInput = document.getElementById('subscriptionLink');
    
    subscriptionLinkInput.value = link;
    generatedLinkDiv.style.display = 'block';
    
    // Save subscription
    const newSubscription = {
        id: Date.now(),
        name: `${countries.join(', ')} Proxies (${format.toUpperCase()})`,
        format: format,
        countries: countries,
        protocols: protocols,
        ports: ports,
        limit: parseInt(limit),
        domain: domain,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    subscriptionData.unshift(newSubscription);
    renderSubscriptionsList();
    
    showToast('Subscription link generated successfully', 'success');
}

function copySubscriptionLink() {
    const link = document.getElementById('subscriptionLink').value;
    if (link) {
        navigator.clipboard.writeText(link).then(() => {
            showToast('Subscription link copied to clipboard', 'success');
        }).catch(() => {
            showToast('Failed to copy link', 'error');
        });
    }
}

function renderSubscriptionsList() {
    const container = document.getElementById('subscriptionsList');
    container.innerHTML = '';
    
    subscriptionData.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'subscription-card';
        card.innerHTML = `
            <div class="subscription-info">
                <div class="subscription-title">${sub.name}</div>
                <div class="subscription-details">
                    ${sub.format.toUpperCase()} • ${sub.countries.join(', ')} • ${sub.protocols.join(', ')} • ${sub.limit} proxies
                </div>
            </div>
            <div class="subscription-actions">
                <button class="btn btn-sm btn-primary" onclick="copySubscriptionUrl('${sub.id}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="editSubscription('${sub.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSubscription('${sub.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function copySubscriptionUrl(id) {
    const sub = subscriptionData.find(s => s.id == id);
    if (sub) {
        const url = generateSubscriptionUrl(sub);
        navigator.clipboard.writeText(url).then(() => {
            showToast('Subscription URL copied to clipboard', 'success');
        }).catch(() => {
            showToast('Failed to copy URL', 'error');
        });
    }
}

function editSubscription(id) {
    showToast(`Edit subscription: ${id}`, 'info');
}

function deleteSubscription(id) {
    if (confirm('Are you sure you want to delete this subscription?')) {
        subscriptionData = subscriptionData.filter(s => s.id != id);
        renderSubscriptionsList();
        showToast('Subscription deleted successfully', 'success');
    }
}

// Settings
function initializeSettings() {
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    document.getElementById('resetSettings').addEventListener('click', resetSettings);
    
    // Load saved settings
    loadSettings();
}

function saveSettings() {
    const settings = {
        serverHost: document.getElementById('serverHost').value,
        serverPort: document.getElementById('serverPort').value,
        maxConnections: document.getElementById('maxConnections').value,
        encryption: document.getElementById('encryption').value,
        allowedCountries: document.getElementById('allowedCountries').value,
        enableLogging: document.getElementById('enableLogging').checked,
        enableDarkMode: document.getElementById('enableDarkMode').checked,
        enableAnimations: document.getElementById('enableAnimations').checked,
        language: document.getElementById('languageSelect').value
    };
    
    localStorage.setItem('mediapvpn-settings', JSON.stringify(settings));
    showToast('Settings saved successfully', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        // Reset to default values
        document.getElementById('serverHost').value = '';
        document.getElementById('serverPort').value = '443';
        document.getElementById('maxConnections').value = '1000';
        document.getElementById('encryption').value = 'none';
        document.getElementById('allowedCountries').value = '';
        document.getElementById('enableLogging').checked = true;
        document.getElementById('enableDarkMode').checked = true;
        document.getElementById('enableAnimations').checked = true;
        document.getElementById('languageSelect').value = 'en';
        
        showToast('Settings reset to default', 'success');
    }
}

function loadSettings() {
    const saved = localStorage.getItem('mediapvpn-settings');
    if (saved) {
        const settings = JSON.parse(saved);
        
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }
}

// Utility Functions
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-header">
            <div class="toast-title">${getToastTitle(type)}</div>
            <button class="toast-close" onclick="closeToast(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => closeToast(toast.querySelector('.toast-close')), 5000);
}

function getToastTitle(type) {
    switch (type) {
        case 'success': return 'Success';
        case 'error': return 'Error';
        case 'warning': return 'Warning';
        default: return 'Info';
    }
}

function closeToast(button) {
    const toast = button.closest('.toast');
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function getCountryFlag(countryCode) {
    const flags = {
        'ID': '🇮🇩',
        'SG': '🇸🇬',
        'US': '🇺🇸',
        'JP': '🇯🇵',
        'KR': '🇰🇷',
        'CN': '🇨🇳',
        'GB': '🇬🇧',
        'DE': '🇩🇪',
        'FR': '🇫🇷',
        'AU': '🇦🇺'
    };
    return flags[countryCode] || '🌍';
}

function getCountryName(countryCode) {
    const names = {
        'ID': 'Indonesia',
        'SG': 'Singapore',
        'US': 'United States',
        'JP': 'Japan',
        'KR': 'South Korea',
        'CN': 'China',
        'GB': 'United Kingdom',
        'DE': 'Germany',
        'FR': 'France',
        'AU': 'Australia'
    };
    return names[countryCode] || countryCode;
}

function getLatencyClass(latency) {
    if (latency === 0) return '';
    if (latency < 50) return 'latency-good';
    if (latency < 150) return 'latency-medium';
    return 'latency-bad';
}

// API Functions (simulated)
async function apiRequest(endpoint, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, return mock data
    switch (endpoint) {
        case '/api/v1/proxies':
            return { data: proxyData, status: 'success' };
        case '/api/v1/stats':
            return {
                data: {
                    total: proxyData.length,
                    active: proxyData.filter(p => p.status === 'online').length,
                    countries: [...new Set(proxyData.map(p => p.country))].length,
                    users: Math.floor(Math.random() * 1000) + 100
                },
                status: 'success'
            };
        default:
            throw new Error('Unknown endpoint');
    }
}

// Initialize with sample data
proxyData = [...sampleProxies];