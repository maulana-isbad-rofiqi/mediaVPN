// MediaVPN Dashboard - Cyberpunk Edition
// Integrated with api.js

let currentTheme = 'dark'; // Default theme
let proxyData = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Setup Themes & UI
        initializeTheme();
        initializeNavigation();
        
        // Setup Actions
        document.getElementById('refreshProxies')?.addEventListener('click', refreshProxies);
        document.getElementById('generateLink')?.addEventListener('click', generateSubscription);
        document.getElementById('copySubscriptionLink')?.addEventListener('click', copySubscriptionLink);
        document.getElementById('searchInput')?.addEventListener('input', debounce(applyFilters, 300));
        document.getElementById('countryFilter')?.addEventListener('change', applyFilters);

        // Load Initial Data
        await Promise.all([
            loadDashboardData(),
            loadProxiesData(),
            loadSettings()
        ]);
        
        showLoading(false);
        console.log('🚀 MediaVPN System Online');
    } catch (error) {
        console.error('System Failure:', error);
        showLoading(false);
    }
}

// --- DATA LOADING FUNCTIONS ---

async function loadDashboardData() {
    try {
        const response = await MediaVPNAPI.getDashboardStats();
        if (response.success) {
            updateStatsUI(response.data);
            initializeCharts(response.data); // Pass data to charts
        }
    } catch (e) { showToast('Failed to load stats', 'error'); }
}

async function loadProxiesData(filters = {}) {
    showLoading(true);
    try {
        const response = await MediaVPNAPI.getProxies(filters);
        if (response.success) {
            proxyData = response.data;
            renderProxiesTable(proxyData);
            updateCountryFilterOptions();
        }
    } catch (e) { showToast('Failed to load proxies', 'error'); } 
    finally { showLoading(false); }
}

// --- UI RENDERING (The Important Part for Mobile) ---

function renderProxiesTable(proxies) {
    const tbody = document.getElementById('proxiesTableBody');
    tbody.innerHTML = '';
    
    if(proxies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">No proxies found</td></tr>';
        return;
    }

    proxies.forEach(proxy => {
        const row = document.createElement('tr');
        
        // CRITICAL: 'data-label' attributes are required for the Mobile Card View CSS
        row.innerHTML = `
            <td data-label="Country">
                <span class="flag">${proxy.country}</span>
            </td>
            <td data-label="IP Address" style="font-family:monospace; color:var(--primary)">
                ${proxy.ip}
            </td>
            <td data-label="Port">${proxy.port}</td>
            <td data-label="Protocol">
                <span class="protocol protocol-${proxy.protocol}">${proxy.protocol.toUpperCase()}</span>
            </td>
            <td data-label="Status">
                <span class="status status-${proxy.status}">${proxy.status}</span>
            </td>
            <td data-label="Latency" class="${getLatencyClass(proxy.latency)}">
                ${proxy.latency}ms
            </td>
            <td data-label="Action">
                <button class="btn btn-secondary" style="padding:5px 10px;" onclick="copyProxy('${proxy.ip}', ${proxy.port})">
                    <i class="fas fa-copy"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateStatsUI(stats) {
    animateValue("totalProxies", 0, stats.totalProxies || 0, 1000);
    animateValue("activeProxies", 0, stats.activeProxies || 0, 1000);
    document.getElementById('countriesCount').textContent = stats.countriesCount || 0;
    document.getElementById('connectedUsers').textContent = stats.connectedUsers || 0;
}

// --- CHART.JS CONFIG (Neon Style) ---

function initializeCharts(stats) {
    // Destroy existing charts if any (to prevent overlap on refresh)
    if(window.myCountryChart) window.myCountryChart.destroy();
    if(window.myStatusChart) window.myStatusChart.destroy();

    // Chart Global Defaults
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

    // Country Chart
    const ctx1 = document.getElementById('countryChart');
    window.myCountryChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['ID', 'SG', 'US', 'JP', 'Others'],
            datasets: [{
                data: [40, 25, 15, 10, 10], // Mock data based on stats
                backgroundColor: ['#00f2ff', '#7000ff', '#00ff9d', '#ff0055', '#ffcc00'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'right' } }
        }
    });

    // Status Chart
    const ctx2 = document.getElementById('statusChart');
    window.myStatusChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Online', 'Offline'],
            datasets: [{
                label: 'Servers',
                data: [stats.activeProxies, stats.totalProxies - stats.activeProxies],
                backgroundColor: ['rgba(0, 255, 157, 0.6)', 'rgba(255, 0, 85, 0.6)'],
                borderColor: ['#00ff9d', '#ff0055'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// --- ACTIONS & INTERACTIVITY ---

async function generateSubscription() {
    showLoading(true);
    const config = {
        format: document.getElementById('formatSelect').value,
        limit: document.getElementById('limitInput').value
    };
    
    try {
        const response = await MediaVPNAPI.generateSubscription(config);
        if(response.success) {
            document.getElementById('subscriptionLink').value = response.data.url;
            document.getElementById('generatedLink').style.display = 'block';
            showToast('Config Generated Successfully!', 'success');
        }
    } catch(e) { showToast('Generation Failed', 'error'); }
    finally { showLoading(false); }
}

function copySubscriptionLink() {
    const input = document.getElementById('subscriptionLink');
    input.select();
    document.execCommand('copy');
    showToast('Link copied to clipboard', 'success');
}

function copyProxy(ip, port) {
    navigator.clipboard.writeText(`${ip}:${port}`);
    showToast(`Copied: ${ip}:${port}`, 'success');
}

function applyFilters() {
    const filters = {
        search: document.getElementById('searchInput').value.toLowerCase(),
        country: document.getElementById('countryFilter').value
    };
    loadProxiesData(filters);
}

function refreshProxies() {
    loadProxiesData();
    showToast('Refreshing Network...', 'info');
}

// --- THEME & NAVIGATION ---

function initializeTheme() {
    // Handle both Desktop and Mobile toggle buttons
    const toggles = [
        document.getElementById('themeToggle'),
        document.getElementById('mobileThemeToggle')
    ];
    
    // Since we are using a fixed "Cyberpunk Dark" theme, 
    // the toggle might just switch between "Deep Dark" and "Glass Light" if you want.
    // For now, let's make it toggle an 'extra-glow' class or just keep it decorative.
    
    toggles.forEach(btn => {
        if(btn) btn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode'); // Optional: Add light mode CSS if needed
            const icon = btn.querySelector('i');
            if(document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    });
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active to clicked
            link.classList.add('active');
            
            // Show section
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            
            // Scroll to top (helpful on mobile)
            window.scrollTo(0, 0);
        });
    });
}

// --- UTILITIES ---

function updateCountryFilterOptions() {
    const countries = [...new Set(proxyData.map(p => p.country))];
    const select = document.getElementById('countryFilter');
    // Keep first option
    const first = select.options[0];
    select.innerHTML = '';
    select.appendChild(first);
    
    countries.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });
}

function getLatencyClass(ms) {
    if (ms < 100) return 'text-success';
    if (ms < 300) return 'text-warning';
    return 'text-danger';
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if(!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.background = type === 'success' ? 'rgba(0,255,157,0.9)' : 
                             type === 'error' ? 'rgba(255,0,85,0.9)' : 'rgba(0,242,255,0.9)';
    toast.style.color = '#000';
    toast.style.padding = '12px 24px';
    toast.style.marginTop = '10px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    toast.innerText = msg;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Settings Placeholder
async function loadSettings() {
    // Simulate loading settings
}
