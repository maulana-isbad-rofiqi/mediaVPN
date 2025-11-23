# MediaVPN Proxy Management Dashboard

A modern, responsive web interface for managing VPN proxies and subscriptions, based on the Nautica project architecture.

## 🚀 Features

- **Modern Dashboard**: Real-time statistics and interactive charts
- **Proxy Management**: Add, edit, delete, and test proxies across multiple protocols
- **Subscription Generation**: Create and manage proxy subscription links
- **Multi-Protocol Support**: VLESS, Trojan, and Shadowsocks (SS)
- **Dark/Light Theme**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Monitoring**: Live proxy status and latency monitoring
- **Advanced Filtering**: Filter proxies by country, status, and protocol
- **WebSocket Support**: Real-time data updates

## 🏗️ Architecture

This project is inspired by the Nautica Cloudflare Workers architecture:

```
Nautica Architecture:
├── _worker.js (Clean source code)
├── worker.js (Obfuscated production)
├── helper/proxyip.ts (Proxy testing utility)
└── API Endpoints:
    ├── /api/v1/sub (Subscription generation)
    ├── /api/v1/proxies (Proxy management)
    └── /api/v1/stats (Statistics)
```

### Core Components

- **Cloudflare Workers**: Serverless edge computing
- **Multiple VPN Protocols**: VLESS, Trojan, Shadowsocks
- **Automatic Protocol Splitting**: Intelligent proxy distribution
- **WebSocket CDN**: Real-time communication
- **Subscription API**: Configurable proxy subscriptions

## 📁 Project Structure

```
mediaVPN/
├── index.html          # Main dashboard interface
├── styles.css          # Complete styling and responsive design
├── script.js           # JavaScript functionality and API integration
├── README.md           # Project documentation
└── package.json        # Project dependencies
```

## 🔧 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Quick Start

1. **Clone/Download** the project files
2. **Open** `index.html` in your browser
3. **Start managing** your VPN proxies!

### Local Development

If you want to run a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎯 Usage

### Dashboard
- **Real-time Statistics**: View total proxies, active proxies, countries, and connected users
- **Interactive Charts**: Country distribution and status overview
- **Live Updates**: Automatic data refresh every 30 seconds

### Proxies Management
- **Add Proxies**: Manual proxy addition with validation
- **Test Connections**: Single-click proxy testing
- **Bulk Operations**: Import/export proxy lists
- **Advanced Filtering**: Search by IP, country, protocol, or status
- **Performance Monitoring**: Latency tracking and status monitoring

### Subscriptions
- **Generate Links**: Create subscription URLs for different formats
- **Multiple Formats**: Support for Clash, Raw, and Base64 formats
- **Filtered Subscriptions**: Include only specific countries/protocols
- **Copy to Clipboard**: One-click URL copying

### Settings
- **Theme Configuration**: Dark/light mode toggle
- **Connection Settings**: Server host, port, and limits
- **Security Options**: Encryption and logging preferences
- **Country Filtering**: Restrict proxy access by region

## 🔌 API Integration

The dashboard integrates with the Nautica API structure:

### Endpoints

```javascript
// Get all proxies
GET /api/v1/proxies

// Generate subscription
GET /api/v1/sub?format={format}&cc={countries}&vpn={protocols}&limit={limit}

// Get statistics
GET /api/v1/stats

// Test proxy
POST /api/v1/test
```

### Response Format

```json
{
  "status": "success",
  "data": {
    "total": 150,
    "active": 145,
    "countries": 12,
    "users": 1234
  }
}
```

## 🌐 Supported Protocols

### VLESS (Visual Lightweight Extremely Simple)
- **Format**: `vless://uuid@server:port?security=...#name`
- **Features**: Better performance, no encryption required
- **Use Case**: High-speed proxy connections

### Trojan (Chinese for "Trojan Horse")
- **Format**: `trojan://password@server:port?security=...#name`
- **Features**: HTTPS伪装, highly undetectable
- **Use Case**: Bypass deep packet inspection (DPI)

### Shadowsocks (SS)
- **Format**: `ss://method:password@server:port`
- **Features**: Wide compatibility, fast encryption
- **Use Case**: General purpose proxy with encryption

## 📊 Dashboard Features

### Statistics Overview
- **Total Proxies**: Count of all configured proxies
- **Active Proxies**: Currently online and responding proxies
- **Countries**: Number of different countries with proxies
- **Connected Users**: Current user connections

### Visual Charts
- **Country Distribution**: Doughnut chart showing proxy distribution
- **Status Overview**: Pie chart of online vs offline proxies
- **Performance Metrics**: Latency and response time tracking

### Real-time Monitoring
- **Live Status Updates**: Automatic proxy health checking
- **Performance Alerts**: Notifications for slow or offline proxies
- **Usage Analytics**: Connection and bandwidth monitoring

## 🎨 Theming & Customization

### Dark Mode
- **Enabled by Default**: Modern dark theme for reduced eye strain
- **Toggle Button**: Easy switching between dark and light modes
- **Persistent Settings**: Theme preference saved to localStorage

### Customization Options
- **Color Schemes**: Easy to modify CSS variables
- **Layout Options**: Flexible grid system
- **Icon Integration**: Font Awesome icons throughout
- **Responsive Design**: Mobile-first approach

## 🔒 Security Features

- **Client-side Validation**: Input sanitization and validation
- **Secure Configuration**: Protected API endpoints
- **Privacy Protection**: No tracking or analytics
- **Local Storage**: Settings stored locally, not sent to servers

## 📱 Mobile Support

- **Responsive Layout**: Optimized for mobile devices
- **Touch-friendly**: Large buttons and touch targets
- **Mobile Menu**: Collapsible navigation for small screens
- **Optimized Performance**: Lightweight and fast loading

## 🛠️ Development

### File Structure

- **`index.html`**: Main application shell and structure
- **`styles.css`**: Complete styling with responsive design
- **`script.js`**: Application logic, API integration, and UI management
- **`README.md`**: Comprehensive documentation

### Key JavaScript Features

```javascript
// Theme Management
loadTheme();
toggleTheme();

// Dashboard Management
updateDashboardStats();
initializeDashboardCharts();

// Proxy Operations
testProxy(proxyAddress);
generateSubscriptionLink();

// Utility Functions
showToast(message, type);
showLoading(show);
```

## 🔄 Updates & Maintenance

### Regular Tasks
- **Proxy Health Checks**: Automated testing every 30 minutes
- **Statistics Updates**: Real-time dashboard refresh
- **Subscription Generation**: On-demand link creation
- **Settings Backup**: Automatic localStorage synchronization

### Monitoring
- **Connection Status**: Live proxy availability tracking
- **Performance Metrics**: Latency and response time monitoring
- **User Analytics**: Usage patterns and connection statistics

## 📋 Browser Support

- **Chrome** 70+
- **Firefox** 65+
- **Safari** 12+
- **Edge** 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 70+

## 🤝 Contributing

To contribute to this project:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex functionality
- Test on multiple browsers and devices
- Update documentation for new features

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Nautica Project**: Inspiration and architecture reference
- **Cloudflare Workers**: Serverless edge computing platform
- **Font Awesome**: Icon library
- **Chart.js**: Data visualization library

## 📞 Support

For support and questions:
- **Issues**: Report bugs via GitHub issues
- **Documentation**: Check this README and inline comments
- **API Reference**: Refer to Nautica project documentation

---

**Version**: 1.0.0  
**Last Updated**: 2024-11-23  
**Author**: MediaVPN Team