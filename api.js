// MediaVPN API Endpoints - Complete Integration
// Frontend + Backend in One File

// API Configuration
const API_CONFIG = {
    // Local mock API endpoints (working without external backend)
    baseUrl: window.location.origin,
    endpoints: {
        proxies: '/api/proxies',
        subscriptions: '/api/subscriptions', 
        dashboard: '/api/dashboard',
        settings: '/api/settings'
    }
};

// Mock API Data
const MOCK_API_DATA = {
    proxies: [
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
    ],
    dashboard: {
        totalProxies: 10,
        activeProxies: 6,
        countriesCount: 5,
        connectedUsers: 1247
    },
    subscriptions: [
        { id: 1, name: 'Premium Indonesia', format: 'clash', countries: ['ID'], protocols: ['trojan', 'vless'], limit: 10 },
        { id: 2, name: 'Global Access', format: 'raw', countries: ['ID', 'SG', 'US', 'JP', 'KR'], protocols: ['trojan', 'vless', 'ss'], limit: 50 },
        { id: 3, name: 'Asia Pacific', format: 'vmess', countries: ['SG', 'JP', 'KR'], protocols: ['vless', 'ss'], limit: 25 }
    ]
};

// API Functions - Complete Backend Simulation
const MediaVPNAPI = {
    // Get proxies list
    async getProxies(filters = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let proxies = [...MOCK_API_DATA.proxies];
                
                // Apply filters
                if (filters.country) {
                    proxies = proxies.filter(p => p.country === filters.country);
                }
                if (filters.status) {
                    proxies = proxies.filter(p => p.status === filters.status);
                }
                if (filters.protocol) {
                    proxies = proxies.filter(p => p.protocol === filters.protocol);
                }
                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    proxies = proxies.filter(p => 
                        p.ip.includes(search) || p.org.toLowerCase().includes(search)
                    );
                }
                
                resolve({ success: true, data: proxies });
            }, 500); // Simulate network delay
        });
    },

    // Get dashboard stats
    async getDashboardStats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: MOCK_API_DATA.dashboard });
            }, 300);
        });
    },

    // Get subscriptions
    async getSubscriptions() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: MOCK_API_DATA.subscriptions });
            }, 400);
        });
    },

    // Generate subscription link
    async generateSubscription(config) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { format, countries, protocols, limit, domain } = config;
                const baseUrl = window.location.origin;
                
                // Generate mock subscription URL
                const params = new URLSearchParams({
                    format: format || 'raw',
                    cc: countries ? countries.join(',') : '',
                    vpn: protocols ? protocols.join(',') : '',
                    limit: limit || 10,
                    domain: domain || 'example.com'
                });
                
                const subscriptionUrl = `${baseUrl}/api/subscription?${params.toString()}`;
                
                resolve({ 
                    success: true, 
                    data: { 
                        url: subscriptionUrl,
                        config: config
                    }
                });
            }, 600);
        });
    },

    // Save settings
    async saveSettings(settings) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Save to localStorage for demo
                localStorage.setItem('mediapvpn-settings', JSON.stringify(settings));
                resolve({ success: true, message: 'Settings saved successfully' });
            }, 300);
        });
    },

    // Load settings
    async getSettings() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const saved = localStorage.getItem('mediapvpn-settings');
                const defaultSettings = {
                    serverHost: 'localhost',
                    serverPort: 443,
                    maxConnections: 1000,
                    encryption: 'none',
                    allowedCountries: 'ID,SG,US,JP,KR',
                    enableLogging: true,
                    enableDarkMode: true,
                    enableAnimations: true,
                    language: 'en'
                };
                
                const settings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
                resolve({ success: true, data: settings });
            }, 200);
        });
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MediaVPNAPI, API_CONFIG, MOCK_API_DATA };
}