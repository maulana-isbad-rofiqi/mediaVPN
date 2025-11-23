// MediaVPN Dashboard - Logic Pembuatan VPN (Client Side Generator)
// Note: Ini membuat string konfigurasi VALID. 
// Agar bisa connect, UUID ini harus terdaftar di VPS/Server Xray Anda.

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Setup Event Listeners
    document.getElementById('generateLink').addEventListener('click', generateConfig);
    document.getElementById('copySubscriptionLink').addEventListener('click', copyResult);
    
    // Setup Navigasi
    setupNavigation();
    
    // Load Data Dummy untuk Tampilan Dashboard (Hanya visual)
    loadDashboardVisuals();
}

// --- LOGIKA INTI PEMBUATAN VPN (CORE LOGIC) ---

function generateConfig() {
    showLoading(true);

    // 1. Ambil Data dari Input Form
    const format = document.getElementById('formatSelect').value; // vmess, vless, trojan
    const domain = document.getElementById('serverHost').value || 'bug.example.com'; // Domain/Bug
    const username = 'user-' + Math.floor(Math.random() * 1000);
    const uuid = crypto.randomUUID(); // Generate REAL UUID
    const port = 443;
    
    let resultConfig = '';

    setTimeout(() => {
        try {
            // 2. Proses Pembuatan Sesuai Format
            if (format === 'vmess') {
                resultConfig = generateVmess(domain, port, uuid, username);
            } else if (format === 'vless') {
                resultConfig = generateVless(domain, port, uuid, username);
            } else if (format === 'trojan') {
                resultConfig = generateTrojan(domain, port, uuid, username);
            } else if (format === 'clash') {
                resultConfig = generateClash(domain, port, uuid, username);
            } else {
                // Default Raw
                resultConfig = `UUID: ${uuid}\nDomain: ${domain}\nPort: ${port}`;
            }

            // 3. Tampilkan Hasil
            document.getElementById('subscriptionLink').value = resultConfig;
            document.getElementById('generatedLink').style.display = 'block';
            showToast(`Sukses membuat akun ${format.toUpperCase()}`, 'success');
            
        } catch (error) {
            showToast('Gagal membuat config', 'error');
            console.error(error);
        } finally {
            showLoading(false);
        }
    }, 500); // Delay sedikit biar terasa "loading"
}

// --- GENERATOR FUNCTIONS (STANDAR XRAY) ---

function generateVmess(host, port, uuid, name) {
    // Format standar Vmess adalah JSON yang di-Base64 kan
    const vmessJson = {
        v: "2",
        ps: name,
        add: host,
        port: port,
        id: uuid,
        aid: "0",
        scy: "auto",
        net: "ws",
        type: "none",
        host: host,
        path: "/vmess",
        tls: "tls",
        sni: host,
        alpn: ""
    };
    
    // Encode ke Base64
    const base64Config = btoa(JSON.stringify(vmessJson));
    return `vmess://${base64Config}`;
}

function generateVless(host, port, uuid, name) {
    // Format: vless://uuid@host:port?params#name
    return `vless://${uuid}@${host}:${port}?encryption=none&security=tls&sni=${host}&type=ws&host=${host}&path=%2Fvless#${encodeURIComponent(name)}`;
}

function generateTrojan(host, port, uuid, name) {
    // Format: trojan://password@host:port?params#name
    return `trojan://${uuid}@${host}:${port}?security=tls&sni=${host}&type=ws&host=${host}&path=%2Ftrojan#${encodeURIComponent(name)}`;
}

function generateClash(host, port, uuid, name) {
    // Format YAML sederhana untuk Clash
    return `- name: ${name}
  type: vmess
  server: ${host}
  port: ${port}
  uuid: ${uuid}
  alterId: 0
  cipher: auto
  tls: true
  servername: ${host}
  network: ws
  ws-opts:
    path: /vmess
    headers:
      Host: ${host}`;
}

// --- UTILITY & UI FUNCTIONS ---

function copyResult() {
    const input = document.getElementById('subscriptionLink');
    input.select();
    document.execCommand('copy');
    showToast('Config berhasil disalin!', 'success');
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    // Styling toast via JS (atau bisa di CSS)
    toast.style.background = type === 'success' ? 'rgba(0, 255, 157, 0.9)' : 'rgba(255, 0, 85, 0.9)';
    toast.style.color = '#000';
    toast.style.padding = '12px 24px';
    toast.style.marginTop = '10px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = 'bold';
    toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    toast.innerText = msg;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

// Load data palsu agar Dashboard tidak kosong saat pertama dibuka
function loadDashboardVisuals() {
    document.getElementById('totalProxies').innerText = "12";
    document.getElementById('activeProxies').innerText = "12";
    document.getElementById('countriesCount').innerText = "4";
    document.getElementById('connectedUsers').innerText = "842";
    
    // Render tabel dummy
    const tbody = document.getElementById('proxiesTableBody');
    const dummyData = [
        {c: 'ID', ip: '103.152.xx.xx', p: 443, type: 'vmess', s: 'online', lat: 24},
        {c: 'SG', ip: '167.71.xx.xx', p: 443, type: 'vless', s: 'online', lat: 15},
        {c: 'US', ip: '104.21.xx.xx', p: 80, type: 'trojan', s: 'online', lat: 120},
    ];
    
    tbody.innerHTML = '';
    dummyData.forEach(d => {
        const row = `
            <tr>
                <td data-label="Country"><span class="flag">${d.c}</span></td>
                <td data-label="IP" style="color:var(--primary)">${d.ip}</td>
                <td data-label="Port">${d.p}</td>
                <td data-label="Protocol"><span class="protocol protocol-${d.type}">${d.type.toUpperCase()}</span></td>
                <td data-label="Status"><span class="status status-${d.s}">${d.s}</span></td>
                <td data-label="Latency">${d.lat}ms</td>
                <td data-label="Action"><button class="btn btn-secondary">Detail</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
